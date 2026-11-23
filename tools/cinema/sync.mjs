#!/usr/bin/env node
/* =========================================================
   My Cinema sync job.
   ---------------------------------------------------------
   Runs every 6 hours in GitHub Actions (.github/workflows/
   cinema-sync.yml), independently of the website:

     1. imports any pending Letterboxd CSV export
     2. reads the public Letterboxd RSS feed and merges it
        (dedupe + edited ratings/reviews)
     3. matches films to TMDB and caches their metadata
     4. refreshes recommendation candidates
     5. writes db.json, meta.json, candidates.json, people.json,
        status.json into the data directory (the cinema-data
        branch), which the workflow then commits.

   Usage:
     node tools/cinema/sync.mjs --data <dir> [--repo <dir>]
          [--import <zip|csv|json|dir>]... [--rss-file <xml>]
          [--skip-rss] [--refresh-candidates]
   Env: TMDB_API_KEY or TMDB_READ_TOKEN (secret), TMDB_BUDGET.
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import { parseRss } from "../../cinema/lib/rss.js";
import { parseLetterboxdExport, exportFileKind } from "../../cinema/lib/csv.js";
import { emptyDb, applyImport, applyRss, dbCounts } from "../../cinema/lib/db.js";
import { slimMovie, pickSearchResult } from "../../cinema/lib/meta.js";
import { readZip } from "../../cinema/lib/zip.js";
import { hash } from "../../cinema/lib/util.js";
import { createTmdb } from "./tmdb.mjs";
import { gatherCandidates } from "./candidates.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DAY = 86400000;

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}
function writeJson(file, data, pretty) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const next = JSON.stringify(data, null, pretty ? 1 : 0) + "\n";
  const prev = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (prev !== next) fs.writeFileSync(file, next);
  return prev !== next;
}

export function loadConfig(repoDir) {
  return readJson(path.join(repoDir || REPO, "cinema", "config.json"), {});
}

/* ---------- RSS ---------- */

export async function fetchRss(user, fetchImpl, log, delays) {
  const waits = delays || [2000, 6000, 15000];
  const url = `https://letterboxd.com/${encodeURIComponent(user)}/rss/`;
  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetchImpl(url, { headers: { "User-Agent": "MyCinemaSync/1.0 (personal RSS reader)", Accept: "application/rss+xml, application/xml;q=0.9" }, signal: AbortSignal.timeout(25000) });
      if (res.status === 404) throw Object.assign(new Error(`Letterboxd user "${user}" not found (404)`), { permanent: true });
      if (!res.ok) throw new Error(`Letterboxd RSS returned HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (e.permanent) break;
      log(`  RSS attempt ${attempt + 1} failed: ${e.message}`);
      if (attempt < 3) await sleep(waits[attempt] || 0);
    }
  }
  throw lastErr;
}

/* ---------- Import discovery ---------- */

async function filesFromPath(p) {
  const st = fs.statSync(p);
  const out = {};
  if (st.isDirectory()) {
    const walk = (d) => {
      for (const name of fs.readdirSync(d)) {
        const full = path.join(d, name);
        if (fs.statSync(full).isDirectory()) walk(full);
        else {
          const rel = path.relative(p, full).replace(/\\/g, "/");
          const kind = exportFileKind(rel);
          if (kind) out[kind] = fs.readFileSync(full, "utf8");
        }
      }
    };
    walk(p);
    return out;
  }
  if (/\.zip$/i.test(p)) {
    const files = await readZip(fs.readFileSync(p), (n) => !!exportFileKind(n), async (d) => zlib.inflateRawSync(d));
    for (const [n, t] of Object.entries(files)) out[exportFileKind(n)] = t;
    return out;
  }
  if (/\.json$/i.test(p)) {
    const j = readJson(p, null);
    if (!j || j.format !== "letterboxd-import" || !j.files) throw new Error(`${path.basename(p)} is not a My Cinema import bundle`);
    for (const [n, t] of Object.entries(j.files)) { const k = exportFileKind(n); if (k) out[k] = t; }
    return out;
  }
  const kind = exportFileKind(path.basename(p));
  if (kind) out[kind] = fs.readFileSync(p, "utf8");
  return out;
}

// Pending imports: <data>/import/* (uploaded to the data branch; removed
// once imported) and <repo>/cinema-import/* (uploaded to main; imported
// once per content hash). ZIPs found in either place are refused: the full
// export contains profile.csv with the account e-mail address.
function pendingImports(dataDir, repoDir, state, warnings) {
  const found = [];
  const scan = (dir, removable) => {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory() || name.startsWith(".") || /readme/i.test(name)) continue;
      if (/\.zip$/i.test(name)) { warnings.push(`Ignored ${name}: upload the bundle made by My Cinema's import tool (or the individual CSVs) instead of the full ZIP, which contains your e-mail address.`); continue; }
      if (!/\.(json|csv)$/i.test(name)) continue;
      const h = hash(fs.readFileSync(full, "utf8"));
      if (!removable && (state.processedImports || []).includes(h)) continue;
      found.push({ path: full, removable, hash: h });
    }
  };
  scan(path.join(dataDir, "import"), true);
  scan(path.join(repoDir, "cinema-import"), false);
  return found;
}

/* ---------- TMDB enrichment ---------- */

async function enrich(tmdb, db, meta, state, now, log) {
  const res = { resolved: 0, unresolved: 0, fetched: 0, failed: 0, pending: 0 };
  state.resolve = state.resolve || {};
  const nowMs = Date.parse(now);
  // a) Films (and watchlist items) without a TMDB id: search by title + year.
  const needId = [...Object.values(db.films), ...Object.values(db.watchlist || {})].filter((f) => !f.tmdbId);
  for (const f of needId) {
    const key = f.key;
    const cached = state.resolve[key];
    if (cached && cached.id) { f.tmdbId = cached.id; f.tmdbMatch = "search"; continue; }
    if (cached && cached.id === null && nowMs - Date.parse(cached.at) < 30 * DAY) { res.unresolved++; continue; }
    try {
      let r = await tmdb.searchMovie(f.title, f.year);
      let pick = pickSearchResult(r && r.results, f.title, f.year);
      if (!pick && f.year) { r = await tmdb.searchMovie(f.title); pick = pickSearchResult(r && r.results, f.title, f.year); }
      state.resolve[key] = { id: pick ? pick.id : null, at: now };
      if (pick) { f.tmdbId = pick.id; f.tmdbMatch = "search"; res.resolved++; } else res.unresolved++;
    } catch (e) {
      if (/budget/i.test(e.message)) { res.pending += 1; break; }
      if (/credentials|401/.test(e.message)) throw e;
      res.failed++;
    }
  }
  // b) Metadata for every known id; stale entries (120+ days) refreshed oldest first.
  const ids = new Set();
  for (const f of Object.values(db.films)) if (f.tmdbId) ids.add(f.tmdbId);
  for (const w of Object.values(db.watchlist || {})) if (w.tmdbId) ids.add(w.tmdbId);
  const missing = [...ids].filter((id) => !meta[id]);
  const stale = [...ids].filter((id) => meta[id] && nowMs - Date.parse(meta[id].fetchedAt) > 120 * DAY)
    .sort((a, b) => Date.parse(meta[a].fetchedAt) - Date.parse(meta[b].fetchedAt)).slice(0, 150);
  const queue = [...missing, ...stale];
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    try {
      const d = await tmdb.movie(id);
      if (d) { meta[id] = slimMovie(d, now); res.fetched++; } else res.failed++;
    } catch (e) {
      if (/budget/i.test(e.message)) { res.pending = queue.length - i; break; }
      if (/credentials|401/.test(e.message)) throw e;
      res.failed++;
    }
  }
  log(`  TMDB: ${res.resolved} matched, ${res.unresolved} unmatched, ${res.fetched} fetched, ${res.failed} failed, ${res.pending} left for next run`);
  return res;
}

async function fetchCandidateMeta(tmdb, candidates, meta, now, log) {
  let fetched = 0, pending = 0;
  const missing = candidates.map((c) => c.id).filter((id) => !meta[id]);
  for (let i = 0; i < missing.length; i++) {
    try {
      const d = await tmdb.movie(missing[i]);
      if (d) { meta[missing[i]] = slimMovie(d, now); fetched++; }
    } catch (e) {
      if (/budget/i.test(e.message)) { pending = missing.length - i; break; }
    }
  }
  log(`  Candidates: ${fetched} new films described${pending ? `, ${pending} left for next run` : ""}`);
  return { fetched, pending };
}

// Removes cached metadata nobody needs any more (unwatched ex-candidates).
function pruneMeta(meta, db, candidates) {
  const keep = new Set();
  for (const f of Object.values(db.films)) if (f.tmdbId) keep.add(f.tmdbId);
  for (const w of Object.values(db.watchlist || {})) if (w.tmdbId) keep.add(w.tmdbId);
  for (const c of candidates) keep.add(c.id);
  for (const id of Object.keys(meta)) if (!keep.has(Number(id))) delete meta[id];
}

/* ---------- Main ---------- */

export async function runSync(o) {
  const log = o.log || ((s) => console.log(s));
  const dataDir = path.resolve(o.dataDir);
  const repoDir = path.resolve(o.repoDir || REPO);
  const now = o.now || new Date().toISOString();
  const cfg = loadConfig(repoDir);
  const user = o.user || process.env.LETTERBOXD_USER || cfg.letterboxdUser;
  const fetchImpl = o.fetch || globalThis.fetch;

  const prevStatus = readJson(path.join(dataDir, "status.json"), {});
  const db = readJson(path.join(dataDir, "db.json"), null) || emptyDb(user, now);
  const meta = readJson(path.join(dataDir, "meta.json"), {});
  const state = readJson(path.join(dataDir, "state.json"), { resolve: {}, processedImports: [] });
  let cand = readJson(path.join(dataDir, "candidates.json"), { generatedAt: null, candidates: [] });
  let people = readJson(path.join(dataDir, "people.json"), { directors: {} });
  const before = JSON.stringify({ f: db.films, v: db.viewings, w: db.watchlist });

  const status = {
    user, lastAttemptAt: now, lastSuccessAt: prevStatus.lastSuccessAt || null, ok: false,
    errors: [], warnings: [], rss: null, import: null, tmdb: null, candidates: null, counts: null,
    nextScheduledHint: `every ${cfg.syncEveryHours || 6} hours`
  };

  // 1. Imports
  const imports = [...(o.importPaths || []).map((p) => ({ path: p, removable: false, hash: null, explicit: true })), ...pendingImports(dataDir, repoDir, state, status.warnings)];
  if (imports.length) {
    const files = {};
    for (const imp of imports) {
      try { Object.assign(files, await filesFromPath(imp.path)); }
      catch (e) { status.errors.push(`Import ${path.basename(imp.path)}: ${e.message}`); imp.failed = true; }
    }
    if (Object.keys(files).length) {
      const counts = applyImport(db, parseLetterboxdExport(files), now);
      db.imports.push({ at: now, files: Object.keys(files), counts });
      status.import = { at: now, files: Object.keys(files), ...counts };
      log(`Imported ${Object.keys(files).join(", ")}: ${JSON.stringify(counts)}`);
      for (const imp of imports) {
        if (imp.failed) continue;
        if (imp.removable) fs.rmSync(imp.path);
        else if (imp.hash) state.processedImports = [...(state.processedImports || []), imp.hash].slice(-50);
      }
    }
  }

  // 2. RSS
  if (!o.skipRss) {
    try {
      const xml = o.rssXml !== undefined ? o.rssXml : await fetchRss(user, fetchImpl, log, o.rssRetryDelays);
      const feed = parseRss(xml);
      const c = applyRss(db, feed.items, now);
      status.rss = { ok: true, at: now, items: feed.items.length, added: c.added, updated: c.updated, unchanged: c.unchanged, filmsAdded: c.filmsAdded, edited: c.edited };
      log(`RSS: ${feed.items.length} items, ${c.added} new, ${c.updated} updated, ${c.edited.length} edited`);
    } catch (e) {
      status.rss = { ok: false, at: now, error: e.message };
      status.errors.push(`Letterboxd RSS: ${e.message}`);
      log(`RSS failed: ${e.message}`);
    }
  }

  // 3 + 4. TMDB
  const tmdb = o.tmdb || createTmdb({ fetch: fetchImpl });
  const changed = JSON.stringify({ f: db.films, v: db.viewings, w: db.watchlist }) !== before;
  if (tmdb.hasCredentials === false) {
    status.warnings.push("TMDB isn't connected: add a TMDB_API_KEY (or TMDB_READ_TOKEN) repository secret so genres, runtimes, credits and recommendations can be filled in.");
  } else {
    try {
      status.tmdb = await enrich(tmdb, db, meta, state, now, log);
      const old = !cand.generatedAt || Date.parse(now) - Date.parse(cand.generatedAt) > 3 * DAY;
      const enoughRated = Object.values(db.films).filter((f) => f.rating !== null && f.tmdbId && meta[f.tmdbId]).length >= 5;
      if (enoughRated && (o.refreshCandidates || old || changed || !cand.candidates.length || cand.pending)) {
        log("Gathering recommendation candidates…");
        const g = await gatherCandidates(tmdb, db, meta, log);
        const m = await fetchCandidateMeta(tmdb, g.candidates, meta, now, log);
        cand = { generatedAt: now, candidates: g.candidates, seeds: g.seeds, pending: m.pending };
        people = { generatedAt: now, ...g.people };
        status.candidates = { count: g.candidates.length, described: g.candidates.filter((c) => meta[c.id]).length, pending: m.pending };
      } else if (cand.pending) {
        const m = await fetchCandidateMeta(tmdb, cand.candidates, meta, now, log);
        cand.pending = m.pending;
      }
      if (!enoughRated) status.warnings.push("Recommendations start once at least 5 rated films have TMDB metadata.");
      status.tmdb.requests = tmdb.used;
    } catch (e) {
      status.errors.push(`TMDB: ${e.message}`);
      log(`TMDB failed: ${e.message}`);
    }
  }
  pruneMeta(meta, db, cand.candidates);

  // 5. Status. A run counts as successful when Letterboxd was read (or
  // deliberately skipped) - TMDB trouble is reported but doesn't block.
  status.ok = !status.rss || status.rss.ok;
  if (status.ok) status.lastSuccessAt = now;
  else status.lastSuccessAt = prevStatus.lastSuccessAt || null;
  status.counts = { ...dbCounts(db), meta: Object.keys(meta).length, candidates: cand.candidates.length };
  status.lastChangeAt = changed ? now : prevStatus.lastChangeAt || null;

  writeJson(path.join(dataDir, "db.json"), db);
  writeJson(path.join(dataDir, "meta.json"), meta);
  writeJson(path.join(dataDir, "candidates.json"), cand);
  writeJson(path.join(dataDir, "people.json"), people);
  writeJson(path.join(dataDir, "state.json"), state);
  writeJson(path.join(dataDir, "status.json"), status, true);
  return status;
}

function parseArgs(argv) {
  const a = { importPaths: [] };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--data") a.dataDir = argv[++i];
    else if (k === "--repo") a.repoDir = argv[++i];
    else if (k === "--import") a.importPaths.push(argv[++i]);
    else if (k === "--rss-file") a.rssXml = fs.readFileSync(argv[++i], "utf8");
    else if (k === "--skip-rss") a.skipRss = true;
    else if (k === "--refresh-candidates") a.refreshCandidates = true;
    else if (k === "--user") a.user = argv[++i];
  }
  return a;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.dataDir) { console.error("Usage: sync.mjs --data <dir> [--import <path>] [--rss-file <xml>] [--skip-rss]"); process.exit(2); }
  runSync(args).then((s) => {
    console.log(`\nStatus: ${s.ok ? "OK" : "FAILED"}; ${JSON.stringify(s.counts)}`);
    if (s.errors.length) console.log("Errors:\n - " + s.errors.join("\n - "));
    if (s.warnings.length) console.log("Warnings:\n - " + s.warnings.join("\n - "));
    // A failed RSS read is recorded in status.json (and committed) rather
    // than failing the job, so the site can show it. Exit 0 either way.
  }).catch((e) => { console.error(e); process.exit(1); });
}
