/* Loads the synced data and keeps the viewer's own picks (likes, local
   watchlist, favourites) in localStorage. No API keys live here: the TMDB key
   stays in GitHub Actions. An optional GitHub token, entered on this device
   only, lets "Sync Now" and the importer talk to GitHub directly. */

const LS = {
  feedback: "cinema-feedback",
  watched: "cinema-local-watched",
  watchlist: "cinema-watchlist",
  favorites: "cinema-favorites",
  token: "cinema-gh-token",
  eggs: "cinema-eggs-off",
  seenAch: "cinema-seen-achievements",
  filters: "cinema-filters",
  machineSlots: "movie-machine-slots",
  machineWatched: "watched-movies"
};
export { LS };

export function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
}
export function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

let config = null;
export async function loadConfig() {
  if (config) return config;
  const r = await fetch("config.json", { cache: "no-cache" });
  config = await r.json();
  return config;
}

function token() { return lsGet(LS.token, null); }

// ?data=<url> points the page at another copy of the data (local testing).
function dataBase(cfg) {
  const p = new URLSearchParams(location.search).get("data");
  if (p) return p.endsWith("/") ? p : p + "/";
  return `https://raw.githubusercontent.com/${cfg.repoOwner}/${cfg.repoName}/${cfg.dataBranch}/`;
}

async function getFile(cfg, name, bust) {
  const t = token();
  const override = new URLSearchParams(location.search).get("data");
  if (t && !override) {
    const r = await fetch(`https://api.github.com/repos/${cfg.repoOwner}/${cfg.repoName}/contents/${name}?ref=${cfg.dataBranch}`, {
      headers: { Authorization: "Bearer " + t, Accept: "application/vnd.github.raw+json" }, cache: "no-store"
    });
    if (r.status === 404) return null;
    if (r.ok) return r.json();
    // Bad token: fall through to the public copy.
  }
  const r = await fetch(dataBase(cfg) + name + (bust ? "?t=" + Date.now() : ""), { cache: bust ? "no-store" : "default" });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
  return r.json();
}

export async function loadData(bust) {
  const cfg = await loadConfig();
  const status = await getFile(cfg, "status.json", bust);
  if (!status) return { cfg, connected: false };
  const [db, meta, candidates, people] = await Promise.all([
    getFile(cfg, "db.json", bust), getFile(cfg, "meta.json", bust), getFile(cfg, "candidates.json", bust), getFile(cfg, "people.json", bust)
  ]);
  return { cfg, connected: true, status, db: db || null, meta: meta || {}, candidates: (candidates && candidates.candidates) || [], candidatesInfo: candidates || {}, people: people || { directors: {} } };
}

/* ---------- GitHub actions (optional token) ---------- */

export function hasToken() { return !!token(); }
export function setToken(t) { if (t) lsSet(LS.token, t.trim()); else { try { localStorage.removeItem(LS.token); } catch {} } }

async function gh(cfg, path, opts) {
  const r = await fetch(`https://api.github.com/repos/${cfg.repoOwner}/${cfg.repoName}${path}`, {
    ...opts,
    headers: { Authorization: "Bearer " + token(), Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...((opts && opts.headers) || {}) }
  });
  return r;
}

export async function dispatchSync(cfg) {
  const r = await gh(cfg, `/actions/workflows/${cfg.workflowFile}/dispatches`, { method: "POST", body: JSON.stringify({ ref: cfg.workflowRef }) });
  if (r.status === 204) return true;
  const body = await r.text();
  throw new Error(r.status === 404 ? "Workflow not found - is cinema-sync.yml merged into main, and does the token have Actions: write?" : r.status === 401 || r.status === 403 ? "GitHub refused the token (needs Actions: read & write on this repository)." : `GitHub: ${r.status} ${body.slice(0, 120)}`);
}

export async function latestRun(cfg) {
  const r = await gh(cfg, `/actions/workflows/${cfg.workflowFile}/runs?per_page=1`);
  if (!r.ok) return null;
  const j = await r.json();
  return j.workflow_runs && j.workflow_runs[0] ? j.workflow_runs[0] : null;
}

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export async function uploadImport(cfg, bundleJson) {
  const name = `import/letterboxd-import-${Date.now()}.json`;
  const r = await gh(cfg, `/contents/${name}`, { method: "PUT", body: JSON.stringify({ message: "Add Letterboxd import bundle", content: b64(bundleJson), branch: cfg.dataBranch }) });
  if (r.status === 201 || r.status === 200) return name;
  if (r.status === 404 || r.status === 422) throw new Error("The cinema-data branch doesn't exist yet - press Sync Now once first, then import.");
  throw new Error(r.status === 401 || r.status === 403 ? "GitHub refused the token (needs Contents: read & write)." : `GitHub: HTTP ${r.status}`);
}

/* ---------- Local lists ---------- */

export const local = {
  feedback: () => lsGet(LS.feedback, {}),
  setFeedback(id, v) { const f = local.feedback(); if (v) f[id] = v; else delete f[id]; lsSet(LS.feedback, f); },
  watched: () => lsGet(LS.watched, []),
  markWatched(m) {
    const w = new Set(local.watched()); w.add(m.id); lsSet(LS.watched, [...w]);
    // Also add to the vending machine's Ticket Stubs so its Surprise Me skips it.
    const stubs = lsGet(LS.machineWatched, []);
    if (!stubs.some((s) => s.id === m.id)) { stubs.push({ id: m.id, title: m.title, poster: m.poster ? "https://image.tmdb.org/t/p/w500" + m.poster : null, rating: null }); lsSet(LS.machineWatched, stubs); }
  },
  unmarkWatched(id) { lsSet(LS.watched, local.watched().filter((x) => x !== id)); },
  watchlist: () => lsGet(LS.watchlist, []),
  addWatchlist(m) { const l = local.watchlist(); if (!l.some((x) => x.id === m.id)) { l.push({ id: m.id, title: m.title, year: m.year, poster: m.poster, addedAt: new Date().toISOString() }); lsSet(LS.watchlist, l); } },
  removeWatchlist(id) { lsSet(LS.watchlist, local.watchlist().filter((x) => x.id !== id)); },
  favorites: () => lsGet(LS.favorites, []),
  toggleFavorite(key) { const f = local.favorites(); const i = f.indexOf(key); if (i >= 0) f.splice(i, 1); else f.push(key); lsSet(LS.favorites, f); return i < 0; },
  eggsOn: () => !lsGet(LS.eggs, false),
  setEggs(on) { lsSet(LS.eggs, !on); },
  // Puts a film in the first empty slot of the vending machine.
  loadIntoMachine(m) {
    const slots = lsGet(LS.machineSlots, new Array(16).fill(null));
    if (slots.some((s) => s && s.id === m.id)) return "already";
    const i = slots.findIndex((s) => !s);
    if (i < 0) return "full";
    slots[i] = { title: m.title, poster: m.poster ? "https://image.tmdb.org/t/p/w500" + m.poster : null, id: m.id, year: m.year || null };
    lsSet(LS.machineSlots, slots);
    return i + 1;
  }
};
