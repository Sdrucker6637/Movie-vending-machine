/* Achievements, unlocked from the real viewing history. Each check returns
   { done, progress (0-1), detail }. Badge art lives in ui/art.js. */
import { overview } from "./stats.js";

const count = (lib, fn) => lib.films.filter(fn).length;

function maxPerDay(lib) {
  const m = new Map();
  for (const v of lib.viewings) if (v.date) m.set(v.date, (m.get(v.date) || 0) + 1);
  let best = 0, day = null;
  for (const [d, n] of m) if (n > best) { best = n; day = d; }
  return { best, day };
}

function bestYear(lib) {
  const m = new Map();
  for (const v of lib.viewings) if (v.date) { const y = v.date.slice(0, 4); m.set(y, (m.get(y) || 0) + 1); }
  let best = 0, year = null;
  for (const [y, n] of m) if (n > best) { best = n; year = y; }
  return { best, year };
}

function tier(n, goal, unit) {
  return { done: n >= goal, progress: Math.min(1, n / goal), detail: `${n.toLocaleString("en-US")} / ${goal.toLocaleString("en-US")} ${unit}` };
}

export const ACHIEVEMENTS = [
  { id: "first-review", name: "First Review", art: "quill", desc: "Write your first Letterboxd review.", check: (lib) => tier(lib.viewings.filter((v) => v.review).length, 1, "reviews") },
  { id: "critic-50", name: "Critic's Notebook", art: "notebook", desc: "Write 50 reviews.", check: (lib) => tier(lib.viewings.filter((v) => v.review).length, 50, "reviews") },
  { id: "films-100", name: "100 Films Watched", art: "reel100", desc: "Watch 100 different films.", check: (lib) => tier(lib.films.length, 100, "films") },
  { id: "films-500", name: "500 Films Watched", art: "reel500", desc: "Watch 500 different films.", check: (lib) => tier(lib.films.length, 500, "films") },
  { id: "films-1000", name: "1,000 Films Watched", art: "reel1000", desc: "Watch 1,000 different films.", check: (lib) => tier(lib.films.length, 1000, "films") },
  { id: "rated-100", name: "Century of Stars", art: "booth", desc: "Rate 100 films. (Something opens up backstage…)", check: (lib) => tier(count(lib, (f) => f.rating !== null), 100, "rated") },
  {
    id: "genre-explorer", name: "Genre Explorer", art: "compass", desc: "Watch films from 15 different TMDB genres.",
    check: (lib) => { const s = new Set(); lib.films.forEach((f) => f.genres.forEach((g) => s.add(g))); return tier(s.size, 15, "genres"); }
  },
  { id: "silent", name: "Silent Film Enthusiast", art: "silent", desc: "Watch 5 films released before 1930.", check: (lib) => tier(count(lib, (f) => f.year && f.year < 1930), 5, "silent-era films") },
  {
    id: "international", name: "International Cinema Explorer", art: "globe", desc: "Watch films from 15 production countries.",
    check: (lib) => { const s = new Set(); lib.films.forEach((f) => f.countries.forEach((c) => s.add(c))); return tier(s.size, 15, "countries"); }
  },
  {
    id: "polyglot", name: "Subtitle Reader", art: "subtitle", desc: "Watch films in 10 original languages.",
    check: (lib) => { const s = new Set(lib.films.map((f) => f.language).filter(Boolean)); return tier(s.size, 10, "languages"); }
  },
  {
    id: "completionist", name: "Director Completionist", art: "clapper",
    desc: "Watch every feature by a director with at least 4 (from TMDB's filmography, ignoring obscure titles).",
    check: (lib, ctx) => {
      const fg = (ctx && ctx.filmographies) || {};
      const seen = new Set(lib.films.map((f) => f.tmdbId));
      let best = null;
      for (const [pid, d] of Object.entries(fg)) {
        const films = (d.films || []).filter((x) => x.voteCount >= 20 && x.year && x.year <= new Date().getUTCFullYear());
        if (films.length < 4) continue;
        const got = films.filter((x) => seen.has(x.id)).length;
        const p = got / films.length;
        if (!best || p > best.p) best = { p, name: d.name, got, of: films.length, pid };
      }
      if (!best) return { done: false, progress: 0, detail: "Needs director filmographies (synced automatically)" };
      return { done: best.p >= 1, progress: best.p, detail: `${best.name}: ${best.got} / ${best.of}` };
    }
  },
  {
    id: "midnight", name: "Midnight Moviegoer", art: "moon",
    desc: "Log a diary entry between midnight and 4 a.m. (post time from the RSS feed - Letterboxd doesn't record when you pressed play).",
    check: (lib) => { const n = lib.viewings.filter((v) => v.postedHour !== null && v.postedHour !== undefined && v.postedHour < 4).length; return { done: n > 0, progress: n > 0 ? 1 : 0, detail: n ? `${n} late-night log${n > 1 ? "s" : ""}` : "No late-night logs yet" }; }
  },
  { id: "five-star-1", name: "Standing Ovation", art: "star", desc: "Give a film five stars.", check: (lib) => tier(count(lib, (f) => f.rating === 5), 1, "five-star films") },
  { id: "five-star-club", name: "Five-Star Film Club", art: "club", desc: "Give 10 films five stars.", check: (lib) => tier(count(lib, (f) => f.rating === 5), 10, "five-star films") },
  { id: "double-feature", name: "Double Feature", art: "double", desc: "Log two films on the same day.", check: (lib) => { const m = maxPerDay(lib); return { done: m.best >= 2, progress: Math.min(1, m.best / 2), detail: m.day ? `Best day: ${m.best} on ${m.day}` : "No dated diary entries" }; } },
  { id: "marathon", name: "Marathon Runner", art: "marathon", desc: "Log four films in one day.", check: (lib) => { const m = maxPerDay(lib); return { done: m.best >= 4, progress: Math.min(1, m.best / 4), detail: m.day ? `Best day: ${m.best} on ${m.day}` : "No dated diary entries" }; } },
  { id: "rewatcher", name: "Encore! Encore!", art: "encore", desc: "Log 10 rewatches.", check: (lib) => tier(lib.viewings.filter((v) => v.rewatch).length, 10, "rewatches") },
  { id: "year-100", name: "A Year in the Dark", art: "calendar", desc: "Log 100 films in one calendar year.", check: (lib) => { const b = bestYear(lib); return { ...tier(b.best, 100, "in one year"), detail: b.year ? `Best year: ${b.best} in ${b.year}` : "No dated diary entries" }; } },
  {
    id: "decades", name: "Time Traveller", art: "hourglass", desc: "Watch films from 8 different decades.",
    check: (lib) => tier(new Set(lib.films.map((f) => f.decade).filter(Boolean)).size, 8, "decades")
  },
  { id: "hours-500", name: "Five Hundred Hours", art: "clock", desc: "Spend 500 hours at the movies.", check: (lib) => { const h = Math.floor(overview(lib).hours); return tier(h, 500, "hours"); } }
];

export function evaluateAchievements(lib, ctx) {
  return ACHIEVEMENTS.map((a) => {
    let r;
    try { r = a.check(lib, ctx); } catch (e) { r = { done: false, progress: 0, detail: "Couldn't compute" }; }
    return { ...a, ...r };
  });
}

export function boothUnlocked(lib) {
  return lib.films.filter((f) => f.rating !== null).length >= 100;
}
