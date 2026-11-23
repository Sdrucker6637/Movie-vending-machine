/* Gathers recommendation candidates from TMDB for every mode. Scoring is
   done later, in the browser (cinema/lib/recommend.js). */
import { buildLibrary } from "../../cinema/lib/stats.js";
import { affinities } from "../../cinema/lib/taste.js";
import { GENRE_IDS } from "../../cinema/lib/meta.js";

export async function gatherCandidates(tmdb, db, meta, log) {
  const lib = buildLibrary(db, meta);
  const aff = affinities(lib);
  const mu = lib.mean ?? 3;
  const watched = new Set(lib.films.map((f) => f.tmdbId).filter(Boolean));
  const found = new Map(); // id -> sources[]
  const add = (id, source) => {
    if (!id || watched.has(id)) return;
    if (!found.has(id)) found.set(id, []);
    const list = found.get(id);
    if (!list.some((s) => JSON.stringify(s) === JSON.stringify(source))) list.push(source);
  };
  const people = { directors: {} };
  const safe = async (label, fn) => { try { return await fn(); } catch (e) { log(`  ! ${label}: ${e.message}`); if (e.name === "TmdbBudgetExceeded" || /budget/.test(e.message)) throw e; return null; } };

  // 1. Favourites: TMDB recommendations for your highest-rated films.
  const favs = lib.films.filter((f) => f.tmdbId && f.rating !== null && (f.rating >= Math.max(4, mu + 0.5) || (f.liked && f.rating >= mu)))
    .sort((a, b) => b.rating - a.rating || b.liked - a.liked || String(b.lastDate).localeCompare(String(a.lastDate)))
    .slice(0, 30);
  for (const f of favs) {
    const r = await safe(`recommendations ${f.title}`, () => tmdb.recommendations(f.tmdbId));
    for (const m of (r && r.results) || []) add(m.id, { type: "fav", from: f.tmdbId });
  }

  // 2. Directors you love: the rest of their filmography.
  const dirs = [...aff.director.values()].filter((d) => d.count >= 2).sort((a, b) => b.delta - a.delta || b.count - a.count).slice(0, 20);
  for (const d of dirs) {
    const r = await safe(`credits ${d.label}`, () => tmdb.personCredits(d.key));
    if (!r) continue;
    const films = (r.crew || []).filter((c) => c.job === "Director" && c.release_date)
      .map((c) => ({ id: c.id, title: c.title, year: Number(c.release_date.slice(0, 4)), voteCount: c.vote_count || 0 }));
    people.directors[d.key] = { name: d.label, films };
    if (d.delta > 0.05) for (const x of films.filter((x) => x.voteCount >= 50)) add(x.id, { type: "director-more", person: d.key, name: d.label });
  }

  // 3. Actors you consistently enjoy.
  const actors = [...aff.actor.values()].filter((a) => a.rated >= 2 && a.delta > 0.1).sort((a, b) => b.delta - a.delta || b.rated - a.rated).slice(0, 14);
  for (const a of actors) {
    const r = await safe(`credits ${a.label}`, () => tmdb.personCredits(a.key));
    const cast = ((r && r.cast) || []).filter((c) => (c.order ?? 99) <= 6 && (c.vote_count || 0) >= 120)
      .sort((x, y) => (y.vote_average || 0) - (x.vote_average || 0)).slice(0, 15);
    for (const c of cast) add(c.id, { type: "actor", person: a.key, name: a.label });
  }

  // 4. Genre-driven discovery: best genres (by affinity, then by volume).
  const genres = [...aff.genre.values()].filter((g) => g.rated >= 3 && GENRE_IDS[g.key]).sort((a, b) => b.delta - a.delta).slice(0, 4);
  if (!genres.length) genres.push(...[...aff.genre.values()].filter((g) => GENRE_IDS[g.key]).sort((a, b) => b.count - a.count).slice(0, 3));
  for (const g of genres) {
    const gid = GENRE_IDS[g.key];
    const gems = await safe(`gems ${g.key}`, () => tmdb.discover({ with_genres: gid, "vote_count.gte": 40, "vote_count.lte": 1200, "vote_average.gte": 7, sort_by: "vote_average.desc", page: 1 }));
    for (const m of (gems && gems.results) || []) add(m.id, { type: "gem", genre: g.key });
    for (const page of [1, 2]) {
      const cl = await safe(`classics ${g.key}`, () => tmdb.discover({ with_genres: gid, "primary_release_date.lte": "1975-12-31", "vote_count.gte": 100, sort_by: "vote_average.desc", page }));
      for (const m of (cl && cl.results) || []) add(m.id, { type: "classic", genre: g.key });
    }
    const sh = await safe(`short ${g.key}`, () => tmdb.discover({ with_genres: gid, "with_runtime.lte": 99, "with_runtime.gte": 60, "vote_count.gte": 200, sort_by: "vote_average.desc", page: 1 }));
    for (const m of (sh && sh.results) || []) add(m.id, { type: "short", genre: g.key });
  }

  // 5. Hidden gems by favourite themes (TMDB keywords).
  const themes = [...aff.keyword.values()].filter((k) => k.rated >= 3 && k.delta > 0.1).sort((a, b) => b.delta - a.delta).slice(0, 5);
  const kwIds = new Map();
  for (const m of Object.values(meta)) for (const k of m.keywords || []) kwIds.set(k.name, k.id);
  for (const t of themes) {
    const id = kwIds.get(t.key);
    if (!id) continue;
    const r = await safe(`theme ${t.key}`, () => tmdb.discover({ with_keywords: id, "vote_count.gte": 30, sort_by: "vote_average.desc", page: 1 }));
    for (const m of (r && r.results) || []) add(m.id, { type: "theme", keyword: t.key });
  }

  // 6. Comfort-zone stretch: well-regarded films in genres you rarely watch.
  const share = new Map();
  for (const f of lib.films) for (const g of f.genres) share.set(g, (share.get(g) || 0) + 1);
  const rare = Object.keys(GENRE_IDS).filter((g) => g !== "TV Movie" && (share.get(g) || 0) / Math.max(1, lib.films.length) < 0.05).slice(0, 5);
  for (const g of rare) {
    const r = await safe(`stretch ${g}`, () => tmdb.discover({ with_genres: GENRE_IDS[g], "vote_count.gte": 400, sort_by: "vote_average.desc", page: 1 }));
    for (const m of (r && r.results) || []) add(m.id, { type: "stretch", genre: g });
  }

  return { candidates: [...found.entries()].map(([id, sources]) => ({ id, sources })), people, seeds: { favourites: favs.length, directors: dirs.length, actors: actors.length, genres: genres.map((g) => g.key), themes: themes.map((t) => t.key), stretch: rare } };
}
