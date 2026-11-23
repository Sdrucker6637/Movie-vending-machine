import test from "node:test";
import assert from "node:assert/strict";
import { parseCSV, exportFileKind, parseLetterboxdExport } from "../../../cinema/lib/csv.js";
import { parseRss, reviewFromDescription } from "../../../cinema/lib/rss.js";
import { read, exportFiles } from "./helpers.mjs";

test("CSV: quotes, doubled quotes, embedded newlines, CRLF and BOM", () => {
  const rows = parseCSV('﻿a,b\r\n"x, y","he said ""hi"""\r\n"multi\nline",2\r\n');
  assert.deepEqual(rows, [{ a: "x, y", b: 'he said "hi"' }, { a: "multi\nline", b: "2" }]);
});

test("Export: only the allowed files are recognised (never profile.csv or lists)", () => {
  assert.equal(exportFileKind("letterboxd-x-2024/diary.csv"), "diary.csv");
  assert.equal(exportFileKind("letterboxd-x-2024/likes/films.csv"), "likes/films.csv");
  assert.equal(exportFileKind("letterboxd-x-2024/profile.csv"), null);
  assert.equal(exportFileKind("letterboxd-x-2024/lists/my-list.csv"), null);
  assert.equal(exportFileKind("letterboxd-x-2024/deleted/diary.csv"), null);
  assert.equal(exportFileKind("comments.csv"), null);
});

test("Export: rows are normalised", () => {
  const p = parseLetterboxdExport(exportFiles());
  assert.equal(p.diary.length, 5);
  assert.deepEqual(p.diary[0], { title: "Alpha Film", year: 2001, uri: "https://boxd.it/aaa1", date: "2024-06-01", rating: 4.5, rewatch: false, tags: ["cinema", "friends"], watchedDate: "2024-05-31" });
  assert.equal(p.diary[3].title, 'Epsilon, Part "One"');
  assert.equal(p.diary[4].rewatch, true);
  assert.match(p.reviews[0].review, /multi-line review/);
  assert.equal(p.ratings.length, 5);
  assert.equal(p.watched.length, 6);
  assert.equal(p.watchlist.length, 2);
  assert.equal(p.likes[0].title, "Delta");
});

test("RSS: diary items parsed, list items skipped", () => {
  const { items, channelTitle } = parseRss(read("rss-sample.xml"));
  assert.equal(channelTitle, "Letterboxd - Test Member");
  assert.equal(items.length, 3);
  const [a, b, g] = items;
  assert.equal(a.kind, "review");
  assert.equal(a.tmdbId, 101);
  assert.equal(a.rating, 4.5);
  assert.equal(a.liked, true);
  assert.equal(a.slug, "alpha-film");
  assert.equal(a.watchedDate, "2024-05-31");
  assert.equal(a.review, "Heartbreaking & tender.\n\nThe performances are moving.");
  assert.equal(a.postedHour, 1);
  assert.equal(b.kind, "watch");
  assert.equal(b.review, null);
  assert.equal(b.rewatch, true);
  assert.equal(g.rating, null, "no rating element means unrated");
  assert.equal(g.spoilers, true);
  assert.equal(g.review, "The twist ending got me.");
});

test("RSS: watched-on boilerplate is not a review; non-RSS input throws", () => {
  assert.equal(reviewFromDescription('<p><img src="x"/></p> <p>Watched on Monday January 6, 2025.</p>').text, null);
  assert.throws(() => parseRss("<html><body>Blocked</body></html>"), /Not an RSS feed/);
});
