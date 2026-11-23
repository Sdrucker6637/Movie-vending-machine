import test from "node:test";
import assert from "node:assert/strict";
import { emptyDb, applyImport, applyRss, dbCounts } from "../../../cinema/lib/db.js";
import { parseLetterboxdExport } from "../../../cinema/lib/csv.js";
import { parseRss } from "../../../cinema/lib/rss.js";
import { read, exportFiles } from "./helpers.mjs";

const NOW = "2024-06-05T00:00:00.000Z";
const fresh = () => emptyDb("testmember", NOW);

test("CSV import builds films, viewings, reviews, likes and the watchlist", () => {
  const db = fresh();
  const c = applyImport(db, parseLetterboxdExport(exportFiles()), NOW);
  const n = dbCounts(db);
  assert.equal(n.films, 6, "Alpha, Beta, Delta, Epsilon, Zeta, Eta");
  assert.equal(n.viewings, 5, "five diary rows incl. a rewatch of Delta");
  assert.equal(n.reviews, 1);
  assert.equal(n.watchlist, 2);
  assert.equal(c.reviewsAttached, 1);
  assert.equal(db.films["delta|1999"].liked, true);
  assert.equal(db.films["zeta|1950"].rating, 4, "ratings.csv covers films with no diary entry");
  assert.equal(db.films["eta|1930"].rating, null);
  // The review lands on the first Delta viewing, not the rewatch.
  const delta = db.viewings.filter((v) => v.film === "delta|1999").sort((a, b) => a.date.localeCompare(b.date));
  assert.ok(delta[0].review && !delta[1].review);
});

test("CSV import is idempotent", () => {
  const db = fresh();
  applyImport(db, parseLetterboxdExport(exportFiles()), NOW);
  const snap = JSON.stringify({ f: db.films, v: db.viewings });
  const c = applyImport(db, parseLetterboxdExport(exportFiles()), NOW);
  assert.equal(c.viewingsAdded, 0);
  assert.equal(c.filmsAdded, 0);
  assert.equal(JSON.stringify({ f: db.films, v: db.viewings }), snap);
});

test("Two films logged the same day stay two viewings; a double viewing of one film too", () => {
  const db = fresh();
  const diary = [
    { title: "Same", year: 2000, uri: null, date: "2024-01-01", rating: 3, rewatch: false, tags: [], watchedDate: "2024-01-01" },
    { title: "Same", year: 2000, uri: null, date: "2024-01-01", rating: 4, rewatch: true, tags: [], watchedDate: "2024-01-01" }
  ];
  applyImport(db, { diary }, NOW);
  assert.equal(db.viewings.length, 2);
  applyImport(db, { diary }, NOW);
  assert.equal(db.viewings.length, 2, "re-import matches both in order");
});

test("RSS after CSV: no duplicates, TMDB ids and guids attached", () => {
  const db = fresh();
  applyImport(db, parseLetterboxdExport(exportFiles()), NOW);
  const c = applyRss(db, parseRss(read("rss-sample.xml")).items, NOW);
  // Alpha (2024-05-31) is already in the CSV -> matched, not added.
  // Beta 2024-06-02 is a new rewatch; Gamma is new.
  assert.equal(c.added, 2);
  assert.equal(db.viewings.filter((v) => v.film === "alpha film|2001").length, 1);
  const alpha = db.viewings.find((v) => v.film === "alpha film|2001");
  assert.equal(alpha.guid, "letterboxd-review-1001");
  assert.equal(db.films["alpha film|2001"].tmdbId, 101);
  assert.equal(db.films["alpha film|2001"].slug, "alpha-film");
  assert.ok(alpha.review, "RSS review text attached");
  assert.equal(alpha.edited, false, "first link-up with the CSV is not an edit");
  assert.equal(db.films["beta movie|1975"].rating, 2, "newer RSS rating wins over the older CSV rating");
  assert.ok(!db.watchlist["gamma|2019"], "logged films leave the watchlist");
  assert.ok(db.watchlist["theta|2010"]);
});

test("RSS is idempotent and detects edited ratings and reviews", () => {
  const db = fresh();
  const items = parseRss(read("rss-sample.xml")).items;
  applyRss(db, items, NOW);
  const again = applyRss(db, items, NOW);
  assert.equal(again.added, 0);
  assert.equal(again.updated, 0);
  assert.equal(db.viewings.length, 3);
  const edited = items.map((it) => (it.guid === "letterboxd-review-1001" ? { ...it, rating: 3.5, review: "Changed my mind." } : it));
  const c = applyRss(db, edited, "2024-06-06T00:00:00.000Z");
  assert.equal(c.updated, 1);
  assert.deepEqual(c.edited, [{ title: "Alpha Film", year: 2001, changes: ["rating", "review"] }]);
  const v = db.viewings.find((x) => x.guid === "letterboxd-review-1001");
  assert.equal(v.rating, 3.5);
  assert.equal(v.review, "Changed my mind.");
  assert.equal(v.edited, true);
  assert.equal(v.history[0].rating, 4.5);
  assert.equal(db.films["alpha film|2001"].rating, 3.5);
});

test("A film whose Letterboxd title changed is matched by TMDB id", () => {
  const db = fresh();
  applyRss(db, [{ guid: "letterboxd-watch-1", title: "Old Title", year: 2010, tmdbId: 55, rating: 3, watchedDate: "2024-01-01", publishedAt: "2024-01-01T00:00:00Z" }], NOW);
  applyRss(db, [{ guid: "letterboxd-watch-2", title: "New Title", year: 2010, tmdbId: 55, rating: 4, watchedDate: "2024-02-01", publishedAt: "2024-02-01T00:00:00Z" }], NOW);
  assert.equal(Object.keys(db.films).length, 1);
  assert.equal(db.viewings.length, 2);
});
