/* =========================================================
   Recommendation engine.
   ---------------------------------------------------------
   Candidates are gathered server-side by the sync job (TMDB
   recommendations for your favourites, filmographies of the
   people you rate highly, discover queries for your best
   genres, classics, hidden gems, short films...). Every
   candidate arrives with full TMDB metadata and the reasons it
   was gathered ("sources").

   Scoring happens here, in the browser, so likes/dislikes take
   effect immediately. A candidate's score is the weighted sum
   of your affinities for its genres, keywords, director, cast,
   decade, country and language (see taste.js), plus a small
   quality prior from TMDB's vote average and a bonus when TMDB
   itself links it to films you rated highly. Feedback is
   counted as extra rated films (like = your average + 1★,
   dislike = your average - 1.5★).
   ========================================================= */
import { affinities } from "./taste.js";
import { decadeOf, seededRandom, mean } from "./util.js";
import { runtimeCategory } from "./stats.js";

export const MODES = [
  { id: "favorites", name: "Based on My Favorites", blurb: "Close cousins of the films you rated highest." },
  { id: "gems", name: "Hidden Gems", blurb: "Lesser-known films that fit your taste." },
  { id: "directors", name: "Director Discovery", blurb: "Directors you haven't explored, introduced by their best match for you." },
  { id: "actors", name: "Actor Discovery", blurb: "Films featuring actors you consistently enjoy." },
  { id: "stretch", name: "Outside My Comfort Zone", blurb: "Genres you rarely watch, chosen through a thread that leads back to your taste." },
  { id: "random", name: "Random Discovery", blurb: "One reel pulled from the good stuff, at random." },
  { id: "classics", name: "Forgotten Classics", blurb: "Older films - before 1976 - you might appreciate." },
  { id: "short", name: "Short and Sweet", blurb: "Recommendations under 100 minutes." }
];

const W = { genre: 0.9, keyword: 1.1, director: 1.3, actor: 0.8, decade: 0.35, country: 0.25, language: 0.25, runtimeBucket: 0.2 };

// Builds a film-like row from TMDB metadata so feedback can be counted as ratings.
export function rowFromMeta(m, rating) {
  return {
    key: "tmdb:" + m.id, title: m.title, year: m.year, tmdbId: m.id, rating, liked: false, reviews: [], viewings: [],
    decade: decadeOf(m.year), runtime: m.runtime, genres: m.genres || [], directors: m.directors || [], cast: m.cast || [],
    countries: m.countries || [], language: m.languageName || m.language, keywords: (m.keywords || []).map((k) => k.name), meta: m
  };
}

export function buildProfile(lib, ctx) {
  const c = ctx || {};
  const mu = lib.mean ?? 3;
  const extra = [];
  for (const [id, v] of Object.entries(c.feedback || {})) {
    const m = c.meta && c.meta[id];
    if (!m) continue;
    extra.push(rowFromMeta(m, Math.max(0.5, Math.min(5, v > 0 ? mu + 1 : mu - 1.5))));
  }
  for (const id of c.favorites || []) {
    const f = lib.films.find((x) => x.tmdbId === Number(id));
    if (f && f.rating === null) extra.push({ ...f, rating: 5 });
  }
  const aff = affinities(lib, { extraRated: extra });
  // Genre share of what you watch, for the comfort-zone mode.
  const genreCount = new Map();
  for (const f of lib.films) for (const g of f.genres) genreCount.set(g, (genreCount.get(g) || 0) + 1);
  const total = lib.films.length || 1;
  const genreShare = new Map([...genreCount.entries()].map(([g, n]) => [g, n / total]));
  const directorSeen = new Map();
  for (const f of lib.films) for (const d of f.directors) directorSeen.set(d.id, (directorSeen.get(d.id) || 0) + 1);
  return { aff, mean: mu, genreShare, directorSeen, lib };
}

function familyValues(m, fam) {
  switch (fam) {
    case "genre": return (m.genres || []).map((g) => ({ key: g, label: g }));
    case "keyword": return (m.keywords || []).map((k) => ({ key: k.name, label: k.name }));
    case "director": return (m.directors || []).map((d) => ({ key: d.id, label: d.name }));
    case "actor": return (m.cast || []).filter((c) => c.order === null || c.order < 6).map((c) => ({ key: c.id, label: c.name }));
    case "decade": return m.year ? [{ key: decadeOf(m.year), label: decadeOf(m.year) + "s" }] : [];
    case "country": return (m.countries || []).map((c) => ({ key: c, label: c }));
    case "language": { const l = m.languageName || m.language; return l ? [{ key: l, label: l }] : []; }
    case "runtimeBucket": return m.runtime ? [runtimeCategory(m.runtime)] : [];
    default: return [];
  }
}

export function scoreCandidate(profile, m, sources) {
  const contribs = [];
  let score = 0;
  for (const fam of Object.keys(W)) {
    const vals = familyValues(m, fam);
    const known = vals.map((v) => ({ v, g: profile.aff[fam].get(v.key) })).filter((x) => x.g && x.g.rated > 0);
    if (!known.length) continue;
    // Mean of known affinities, with a mild boost when several line up.
    const avg = mean(known.map((x) => x.g.delta));
    const s = W[fam] * avg * Math.min(1.6, Math.sqrt(known.length));
    score += s;
    for (const x of known) contribs.push({ fam, key: x.v.key, label: x.v.label, delta: x.g.delta, n: x.g.rated, films: x.g.films, weight: (W[fam] * x.g.delta) / known.length });
  }
  // Quality prior: Bayesian TMDB vote average.
  const C = 6.6, k = 150;
  const va = m.voteAverage || 0, vc = m.voteCount || 0;
  const bayes = (va * vc + C * k) / (vc + k);
  score += (bayes - C) * 0.35;
  const favSources = (sources || []).filter((s) => s.type === "fav");
  if (favSources.length) score += Math.min(0.45, 0.15 * favSources.length);
  const predicted = Math.max(0.5, Math.min(5, profile.mean + score * 0.9));
  return { score, predicted, contribs, bayes };
}

/* ---------- Explanations ---------- */

function exampleTitles(profile, films, n) {
  const lib = profile.lib;
  return films.map((k) => lib.filmByKey.get(k)).filter((f) => f && f.rating !== null)
    .sort((a, b) => b.rating - a.rating).slice(0, n || 2);
}

const fmtStar = (r) => `${r}★`;

export function explain(profile, cand, scored, mode) {
  const out = [];
  const lib = profile.lib;
  const favs = (cand.sources || []).filter((s) => s.type === "fav")
    .map((s) => lib.films.find((f) => f.tmdbId === s.from)).filter((f) => f && f.rating !== null && f.rating >= Math.max(3.5, profile.mean + 0.25))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (favs.length) out.push(`TMDB pairs it with films you loved: ${favs.slice(0, 2).map((f) => `${f.title} (${fmtStar(f.rating)})`).join(" and ")}.`);

  const pos = scored.contribs.filter((c) => c.delta > 0.08).sort((a, b) => b.weight - a.weight);
  const used = new Set();
  for (const c of pos) {
    if (out.length >= 3) break;
    if (used.has(c.fam)) continue;
    const ex = exampleTitles(profile, c.films, 2);
    if (!ex.length) continue;
    used.add(c.fam);
    const exs = ex.map((f) => `${f.title} (${fmtStar(f.rating)})`).join(", ");
    if (c.fam === "director") out.push(`Directed by ${c.label}, whose films you rate highly - ${exs}.`);
    else if (c.fam === "actor") out.push(`Stars ${c.label}, a regular in films you enjoy - ${exs}.`);
    else if (c.fam === "keyword") out.push(`Built around “${c.label}”, a theme you rate ${(profile.mean + c.delta).toFixed(1)}★ on average (${c.n} films, e.g. ${exs}).`);
    else if (c.fam === "genre") out.push(`${c.label} is a genre you rate above your average - e.g. ${exs}.`);
    else if (c.fam === "decade") out.push(`From the ${c.label}, a decade that treats you well - e.g. ${exs}.`);
    else if (c.fam === "country") out.push(`Made in ${c.label}, like ${exs}.`);
    else if (c.fam === "language") out.push(`In ${c.label}, like ${exs}.`);
  }
  if (mode === "stretch") {
    const rare = (cand.meta.genres || []).filter((g) => (profile.genreShare.get(g) || 0) < 0.06);
    if (rare.length) out.unshift(`A step outside your usual: you've logged very few ${rare.join(" / ").toLowerCase()} films.`);
  }
  if (mode === "gems" && cand.meta.voteCount !== null) out.push(`Only ${cand.meta.voteCount.toLocaleString("en-US")} TMDB votes - not many people have found it yet.`);
  const actorSrc = (cand.sources || []).find((s) => s.type === "actor");
  if (mode === "actors" && actorSrc && !out.some((s) => s.includes(actorSrc.name || "~"))) out.push(`Features ${actorSrc.name}, an actor whose films you consistently rate well.`);
  if (!out.length) out.push(`A well-regarded film (${(cand.meta.voteAverage || 0).toFixed(1)}/10 on TMDB) that sits close to your overall taste.`);
  return out;
}

/* ---------- Modes ---------- */

export function recommend(lib, candidates, meta, ctx) {
  const c = ctx || {};
  const mode = c.mode || "favorites";
  const limit = c.limit || 12;
  const profile = c.profile || buildProfile(lib, { ...c, meta });
  const watched = new Set(lib.films.map((f) => f.tmdbId).filter(Boolean));
  for (const id of c.localWatched || []) watched.add(Number(id));
  const watchlist = new Set([...(c.watchlistIds || []), ...(c.localWatchlist || [])].map(Number));
  const disliked = new Set(Object.entries(c.feedback || {}).filter(([, v]) => v < 0).map(([k]) => Number(k)));

  let pool = [];
  for (const cand of candidates || []) {
    const m = meta[cand.id];
    if (!m || !m.title) continue;
    if (!c.includeWatched && watched.has(cand.id)) continue;
    if (!c.includeWatchlist && watchlist.has(cand.id)) continue;
    if (disliked.has(cand.id)) continue;
    if (m.genres && m.genres.includes("TV Movie") && !(cand.sources || []).some((s) => s.type === "fav")) continue;
    if (m.genres && m.genres.includes("Documentary") && !(profile.genreShare.get("Documentary") > 0.03) && mode !== "stretch") continue;
    const scored = scoreCandidate(profile, m, cand.sources);
    pool.push({ id: cand.id, meta: m, sources: cand.sources || [], ...scored });
  }

  const has = (x, t) => x.sources.some((s) => s.type === t);
  const year = (x) => x.meta.year || 9999;
  switch (mode) {
    case "favorites": pool = pool.filter((x) => has(x, "fav") || has(x, "director-more")); break;
    case "gems": pool = pool.filter((x) => (x.meta.voteCount || 0) >= 25 && (x.meta.voteCount || 0) <= 1500 && (x.meta.voteAverage || 0) >= 6.6); break;
    case "actors": {
      const loved = new Set([...profile.aff.actor.values()].filter((g) => g.rated >= 2 && g.delta > 0.1).map((g) => g.key));
      pool = pool.filter((x) => (x.meta.cast || []).some((p) => (p.order === null || p.order < 8) && loved.has(p.id)));
      break;
    }
    case "directors": {
      pool = pool.filter((x) => (x.meta.directors || []).length && x.meta.directors.every((d) => (profile.directorSeen.get(d.id) || 0) === 0));
      // One film per director - the best match introduces them.
      const best = new Map();
      for (const x of pool.sort((a, b) => b.score - a.score)) {
        const d = x.meta.directors[0].id;
        if (!best.has(d)) best.set(d, x);
      }
      pool = [...best.values()];
      break;
    }
    case "stretch": {
      pool = pool.filter((x) => {
        const gs = x.meta.genres || [];
        if (!gs.length) return false;
        const rare = gs.filter((g) => (profile.genreShare.get(g) || 0) < 0.06);
        // A thread back to your taste: a liked person or theme.
        const thread = x.contribs.some((cc) => (cc.fam === "director" || cc.fam === "actor" || cc.fam === "keyword") && cc.delta > 0.1);
        return rare.length >= 1 && (thread || x.bayes >= 7.4);
      });
      break;
    }
    case "classics": pool = pool.filter((x) => year(x) <= 1975 && (x.meta.voteCount || 0) >= 40); break;
    case "short": pool = pool.filter((x) => x.meta.runtime && x.meta.runtime < 100 && x.meta.runtime >= 40); break;
    case "random": break;
    case "all": break;
    default: break;
  }

  pool.sort((a, b) => b.score - a.score || (b.meta.voteCount || 0) - (a.meta.voteCount || 0));

  if (mode === "random") {
    const rnd = seededRandom(c.seed || Date.now());
    const top = pool.slice(0, 80);
    if (!top.length) return { profile, items: [] };
    // Weighted towards better matches, but anything in the top 80 can come up.
    const weights = top.map((x, i) => 1 / Math.sqrt(i + 1));
    let t = rnd() * weights.reduce((s, w) => s + w, 0);
    let pick = top[0];
    for (let i = 0; i < top.length; i++) { t -= weights[i]; if (t <= 0) { pick = top[i]; break; } }
    pool = [pick];
  }

  // Variety: no more than two picks per director in one list.
  const perDir = new Map();
  const items = [];
  for (const x of pool) {
    const d = x.meta.directors && x.meta.directors[0] ? x.meta.directors[0].id : null;
    if (d !== null) {
      const n = perDir.get(d) || 0;
      if (n >= 2) continue;
      perDir.set(d, n + 1);
    }
    items.push({ ...x, reasons: explain(profile, x, x, mode) });
    if (items.length >= limit) break;
  }
  return { profile, items };
}

// Completely random pick from the whole candidate pool (the secret button).
export function wildcard(lib, candidates, meta, seed) {
  const watched = new Set(lib.films.map((f) => f.tmdbId).filter(Boolean));
  const pool = (candidates || []).filter((c) => meta[c.id] && !watched.has(c.id));
  if (!pool.length) return null;
  const rnd = seededRandom(seed || Date.now());
  const c = pool[Math.floor(rnd() * pool.length)];
  return { id: c.id, meta: meta[c.id], sources: c.sources };
}
