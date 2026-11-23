import test from "node:test";
import assert from "node:assert/strict";
import { emptyDb, applyRss } from "../../../cinema/lib/db.js";
import { slimMovie } from "../../../cinema/lib/meta.js";
import { buildLibrary, applyFilters, overview, genreStats, directorStats, actorStats, runtimeStats, timeStats, ratingDistribution, decadeStats, worldStats, rewatchStats, groupStats, keyers } from "../../../cinema/lib/stats.js";
import { tasteProfile, affinities, reviewWords } from "../../../cinema/lib/taste.js";
import { recommend, wildcard, MODES } from "../../../cinema/lib/recommend.js";
import { evaluateAchievements, boothUnlocked } from "../../../cinema/lib/achievements.js";
import { detail } from "./helpers.mjs";

// Synthetic history: the viewer loves Director A's character dramas and
// dislikes Director B's action films, even though B's films are more frequent.
const NOW = "2025-06-01T00:00:00.000Z";
const SPEC = [];
for (let i = 0; i < 6; i++) SPEC.push({ id: 100 + i, title: `Drama ${i}`, year: 1970 + i * 3, genres: ["Drama"], directors: [[1, "Director A"]], cast: [[11, "Actor Warm"], [12 + i, `Extra ${i}`]], keywords: ["grief", "character study"], runtime: 130 + i, rating: i % 2 ? 4.5 : 5, review: "Moving and heartbreaking performances." });
for (let i = 0; i < 10; i++) SPEC.push({ id: 200 + i, title: `Action ${i}`, year: 2005 + i, genres: ["Action"], directors: [[2, "Director B"]], cast: [[21, "Actor Loud"]], keywords: ["explosion", "heist"], runtime: 95 + i, rating: i % 3 ? 2 : 2.5, review: i < 4 ? "Boring plot, silly twist." : null });
for (let i = 0; i < 4; i++) SPEC.push({ id: 300 + i, title: `Comedy ${i}`, year: 1995 + i, genres: ["Comedy"], directors: [[3, "Director C"]], cast: [[31, "Actor Funny"]], keywords: ["satire"], runtime: 85, rating: 3.5, countries: ["France"], lang: "fr", langName: "French" });

export function fixture() {
  const db = emptyDb("t", NOW);
  const meta = {};
  const items = SPEC.map((s, i) => {
    meta[s.id] = slimMovie(detail(s.id, s), NOW);
    return { guid: `letterboxd-review-${s.id}`, kind: "review", title: s.title, year: s.year, tmdbId: s.id, rating: s.rating, rewatch: false, liked: s.rating === 5, watchedDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-0${(i % 9) + 1}`, publishedAt: `2024-${String((i % 12) + 1).padStart(2, "0")}-10T12:00:00Z`, postedHour: i === 0 ? 2 : 20, review: s.review || null };
  });
  // A rewatch of Drama 0.
  items.push({ ...items[0], guid: "letterboxd-review-9999", rewatch: true, watchedDate: "2025-01-05", publishedAt: "2025-01-05T10:00:00Z", postedHour: 10 });
  applyRss(db, items, NOW);
  // Candidates
  const cands = [
    { id: 500, title: "Unseen A", year: 1978, genres: ["Drama"], directors: [[1, "Director A"]], cast: [[11, "Actor Warm"]], keywords: ["grief"], runtime: 120, va: 7.8, vc: 3000, src: [{ type: "fav", from: 100 }] },
    { id: 501, title: "Unseen B", year: 2015, genres: ["Action"], directors: [[2, "Director B"]], cast: [[21, "Actor Loud"]], keywords: ["explosion"], runtime: 110, va: 7.8, vc: 3000, src: [{ type: "fav", from: 200 }] },
    { id: 502, title: "New Director Drama", year: 1972, genres: ["Drama"], directors: [[7, "Director New"]], cast: [[11, "Actor Warm"]], keywords: ["character study", "grief"], runtime: 95, va: 7.4, vc: 600, src: [{ type: "gem" }, { type: "actor", person: 11, name: "Actor Warm" }] },
    { id: 503, title: "A Western", year: 1956, genres: ["Western"], directors: [[1, "Director A"]], cast: [[40, "Cowboy"]], keywords: ["grief"], runtime: 90, va: 7.9, vc: 900, src: [{ type: "stretch" }, { type: "classic" }] },
    { id: 504, title: "Already Seen", year: 1970, genres: ["Drama"], directors: [[1, "Director A"]], cast: [], keywords: [], runtime: 100, va: 8, vc: 100, src: [{ type: "fav", from: 100 }] },
    { id: 505, title: "On Watchlist", year: 1980, genres: ["Drama"], directors: [[1, "Director A"]], cast: [], keywords: ["grief"], runtime: 100, va: 8, vc: 5000, src: [{ type: "fav", from: 100 }] }
  ];
  for (const c of cands) meta[c.id] = slimMovie(detail(c.id, c), NOW);
  meta[504] = meta[100]; // "Already Seen" is Drama 0's id below
  const candidates = cands.map((c) => ({ id: c.id === 504 ? 100 : c.id, sources: c.src }));
  db.watchlist["on watchlist|1980"] = { key: "on watchlist|1980", title: "On Watchlist", year: 1980, tmdbId: 505 };
  return { db, meta, candidates };
}

test("overview counts real entries only", () => {
  const { db, meta } = fixture();
  const lib = buildLibrary(db, meta);
  const o = overview(lib, NOW);
  assert.equal(o.uniqueFilms, 20);
  assert.equal(o.diaryEntries, 21);
  assert.equal(o.totalWatches, 21);
  assert.equal(o.reviews, 6 + 4 + 1, "the rewatch repeats Drama 0's review");
  assert.equal(o.directors, 3);
  assert.equal(o.watchlist, 1);
  const minutes = SPEC.reduce((s, x) => s + x.runtime, 0) + SPEC[0].runtime;
  assert.equal(Math.round(o.hours * 60), minutes);
  assert.equal(o.thisYear, 1, "only the 2025 rewatch");
  assert.ok(Math.abs(o.avgRating - (3 * 5 + 3 * 4.5 + 6 * 2 + 4 * 2.5 + 4 * 3.5) / 20) < 1e-9);
});

test("genre preference uses ratings, not frequency", () => {
  const lib = buildLibrary(fixture().db, fixture().meta);
  const g = genreStats(lib);
  assert.equal(g.mostWatched[0].key, "Action");
  assert.equal(g.highest[0].key, "Drama");
  assert.equal(g.lowest[0].key, "Action");
  // Shrinkage pulls small groups toward the mean.
  const drama = g.all.find((x) => x.key === "Drama");
  assert.ok(drama.shrunk < drama.avg && drama.shrunk > lib.mean);
});

test("director, actor, runtime, time, decade, world, rewatch and rating stats", () => {
  const { db, meta } = fixture();
  const lib = buildLibrary(db, meta);
  const d = directorStats(lib);
  assert.equal(d.highest[0].label, "Director A");
  assert.equal(d.mostWatched[0].label, "Director B");
  const a = actorStats(lib);
  assert.equal(a.enjoy[0].label, "Actor Warm");
  const r = runtimeStats(lib);
  assert.equal(r.shortest[0].runtime, 85);
  assert.equal(r.longest[0].runtime, 135);
  assert.ok(r.correlation > 0.5, "long dramas rated higher");
  assert.match(r.tendency, /longer films higher/);
  const t = timeStats(lib);
  assert.equal(t.years.find((y) => y.key === 2024).count, 20);
  assert.ok(t.months.length >= 12);
  assert.equal(decadeStats(lib)[0].key, 1970);
  assert.equal(worldStats(lib).languages.find((l) => l.key === "French").count, 4);
  const rw = rewatchStats(lib);
  assert.equal(rw.rewatches, 1);
  assert.equal(rw.mostRewatched[0].title, "Drama 0");
  const rd = ratingDistribution(lib);
  assert.equal(rd.buckets.find((b) => b.key === 2).count, 6);
});

test("filters narrow films and viewings", () => {
  const lib = buildLibrary(fixture().db, fixture().meta);
  assert.equal(applyFilters(lib, { genre: "Comedy" }).films.length, 4);
  assert.equal(applyFilters(lib, { decade: 1970 }).films.length, 4, "Drama 0-3 were released in the 1970s");
  assert.equal(applyFilters(lib, { rating: 5 }).films.length, 3);
  const y = applyFilters(lib, { year: 2025 });
  assert.equal(y.films.length, 1);
  assert.equal(y.viewings.length, 1);
});

test("groupStats shrinkage math", () => {
  const films = [{ key: "a", rating: 5, genres: ["X"] }, { key: "b", rating: 5, genres: ["X"] }];
  const [g] = groupStats(films, keyers.genre, 3, { k: 2 });
  assert.equal(g.avg, 5);
  assert.equal(g.shrunk, (10 + 6) / 4);
});

test("taste profile explains itself with real films", () => {
  const lib = buildLibrary(fixture().db, fixture().meta);
  const p = tasteProfile(lib);
  assert.equal(p.enough, true);
  assert.equal(p.genresLoved[0].key, "Drama");
  assert.equal(p.genresCold[0].key, "Action");
  assert.equal(p.directors[0].label, "Director A");
  const freq = p.notes.find((n) => n.kind === "frequency");
  assert.match(freq.text, /Action is what you watch most/);
  assert.ok(freq.examples.every((f) => f.title.startsWith("Drama")));
  assert.ok(p.axes.emotionalComedic.position > 0, "emotional films rated higher than comedies");
  assert.ok(p.archetype.startsWith("The "));
  const w = reviewWords(lib);
  assert.ok(w.raves.some((x) => ["moving", "heartbreaking", "performances"].includes(x.word)));
  assert.ok(w.pans.some((x) => ["boring", "plot", "silly", "twist"].includes(x.word)));
});

test("taste profile asks for more data when there's too little", () => {
  const { db, meta } = fixture();
  db.viewings = db.viewings.slice(0, 3);
  for (const k of Object.keys(db.films).slice(3)) delete db.films[k];
  assert.equal(tasteProfile(buildLibrary(db, meta)).enough, false);
});

test("recommendations: never watched, never watchlisted, explained with real titles", () => {
  const { db, meta, candidates } = fixture();
  const lib = buildLibrary(db, meta);
  const { items } = recommend(lib, candidates, meta, { mode: "favorites", watchlistIds: [505] });
  const ids = items.map((x) => x.id);
  assert.ok(!ids.includes(100), "watched film excluded");
  assert.ok(!ids.includes(505), "watchlist film excluded");
  assert.equal(ids[0], 500, "Director A's unseen film ranks first");
  assert.ok(ids.indexOf(501) > ids.indexOf(500));
  assert.ok(items[0].reasons.some((r) => /Director A/.test(r) && /Drama \d \(5★\)|Drama \d \(4\.5★\)/.test(r)));
  assert.ok(items[0].predicted > items[items.length - 1].predicted);
  const withWl = recommend(lib, candidates, meta, { mode: "favorites", watchlistIds: [505], includeWatchlist: true }).items.map((x) => x.id);
  assert.ok(withWl.includes(505));
  const withSeen = recommend(lib, candidates, meta, { mode: "favorites", includeWatched: true }).items.map((x) => x.id);
  assert.ok(withSeen.includes(100));
});

test("recommendation modes filter correctly", () => {
  const { db, meta, candidates } = fixture();
  const lib = buildLibrary(db, meta);
  const run = (mode, extra) => recommend(lib, candidates, meta, { mode, ...(extra || {}) }).items.map((x) => x.id);
  assert.deepEqual(run("directors"), [502], "only directors with no watched films");
  assert.ok(run("actors").includes(502) && run("actors").includes(500));
  assert.ok(!run("actors").includes(501), "Actor Loud isn't enjoyed");
  assert.deepEqual(run("classics").sort(), [502, 503], "released 1975 or earlier");
  assert.ok(run("short").every((id) => meta[id].runtime < 100));
  assert.deepEqual(run("stretch"), [503], "Western: rare genre with a thread (Director A)");
  assert.ok(run("gems").every((id) => meta[id].voteCount <= 1500));
  assert.equal(run("random", { seed: 7 }).length, 1);
  assert.deepEqual(run("random", { seed: 7 }), run("random", { seed: 7 }), "seeded random is reproducible");
  assert.equal(MODES.length, 8);
});

test("feedback: dislikes are removed and likes shift the ranking", () => {
  const { db, meta, candidates } = fixture();
  const lib = buildLibrary(db, meta);
  const base = recommend(lib, candidates, meta, { mode: "all" }).items;
  const disliked = recommend(lib, candidates, meta, { mode: "all", feedback: { 500: -1 } }).items.map((x) => x.id);
  assert.ok(!disliked.includes(500));
  const before = base.find((x) => x.id === 501).score;
  const liked = recommend(lib, candidates, meta, { mode: "all", feedback: { 501: 1 } }).items.find((x) => x.id === 501).score;
  assert.ok(liked > before, "liking an action pick warms the profile to it");
  const lw = recommend(lib, candidates, meta, { mode: "all", localWatched: [500] }).items.map((x) => x.id);
  assert.ok(!lw.includes(500), "films marked watched here are excluded too");
  const w = wildcard(lib, candidates, meta, 3);
  assert.ok(w && w.id !== 100);
});

test("achievements unlock from history", () => {
  const { db, meta } = fixture();
  const lib = buildLibrary(db, meta);
  const a = Object.fromEntries(evaluateAchievements(lib, { filmographies: { 1: { name: "Director A", films: [100, 101, 102, 103, 104, 105].map((id) => ({ id, year: 1980, voteCount: 100 })) } } }).map((x) => [x.id, x]));
  assert.equal(a["first-review"].done, true);
  assert.equal(a["films-100"].done, false);
  assert.equal(a["films-100"].progress, 0.2);
  assert.equal(a["five-star-1"].done, true);
  assert.equal(a["midnight"].done, true, "one entry posted at 2 a.m.");
  assert.equal(a["completionist"].done, true);
  assert.equal(a["rewatcher"].progress, 0.1);
  assert.equal(boothUnlocked(lib), false);
});
