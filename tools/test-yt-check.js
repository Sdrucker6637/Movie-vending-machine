#!/usr/bin/env node
// Tests for yt/check.js scoring and status logic, using fake search
// backends (no network). Run: node tools/test-yt-check.js
"use strict";
const assert = require("assert");
const path = require("path");
const YT = require(path.join(__dirname, "..", "yt", "check.js"));
const _ = YT._;

let failures = 0;
function test(name, fn) {
  Promise.resolve().then(fn).then(
    () => console.log("ok   " + name),
    (e) => { failures++; console.log("FAIL " + name + "\n     " + (e && e.message)); }
  );
}

const MIN = 60;
function vid(id, title, minutes, extra) {
  return Object.assign({ id, title, channel: "Some Channel", channelId: "c-" + id, durationSec: Math.round(minutes * MIN), description: "" }, extra || {});
}

// A backend that answers every query with the same list and treats the
// given ids as removed/age-restricted/etc. on verification.
function fakeBackend(videos, verifyMap, opts) {
  opts = opts || {};
  let calls = 0;
  return {
    name: opts.name || "Fake",
    async search() {
      calls++;
      if (opts.fail) throw new Error("down");
      return videos;
    },
    async verify(list) {
      const m = new Map();
      list.forEach((v) => m.set(v.id, (verifyMap && verifyMap[v.id]) || { state: "ok" }));
      return m;
    },
    get calls() { return calls; }
  };
}

const ALIEN = { title: "Alien", year: 1979, runtime: 117 };

test("title matching: exact, partial, sequel, plural", () => {
  assert.equal(_.titleMatch("Alien", "ALIEN (1979) Full Movie").level, 2);
  assert.equal(_.titleMatch("Alien", "Aliens 1986 full movie").level, 0);
  assert.equal(_.titleMatch("Rocky", "Rocky II full movie").level, 0);
  assert.equal(_.titleMatch("Rocky", "Rocky 2 full movie").level, 0);
  assert.equal(_.titleMatch("Rocky", "Rocky 1976 full movie").level, 2);
  assert.equal(_.titleMatch("Star Wars: Episode IV - A New Hope", "Star Wars A New Hope full movie").level, 1);
  assert.equal(_.titleMatch("Back to the Future Part II", "Back to the Future Part II (1989)").level, 2);
  assert.equal(_.titleMatch("Amélie", "Amelie 2001 full film").level, 2);
});

test("part detection", () => {
  assert.deepEqual(_.partInfo("Nosferatu", "Nosferatu (1922) Part 2"), { part: 2, of: null });
  assert.deepEqual(_.partInfo("Nosferatu", "Nosferatu 1922 full movie (3/4)"), { part: 3, of: 4 });
  assert.equal(_.partInfo("Back to the Future Part II", "Back to the Future Part II full movie"), null);
});

test("trailers, clips, reviews, reactions and bait are rejected", () => {
  const ctx = { title: "Alien", year: 1979, runtimeMin: 117 };
  assert.equal(_.assess(vid("t", "Alien (1979) Official Trailer", 2), ctx), null);
  assert.equal(_.assess(vid("r", "Alien 1979 movie reaction FIRST TIME WATCHING", 118), ctx), null);
  assert.equal(_.assess(vid("v", "Alien review - a masterpiece", 25), ctx), null);
  assert.equal(_.assess(vid("x", "Alien explained", 40), ctx), null);
  assert.equal(_.assess(vid("b", "Alien 1979 FULL MOVIE link in description", 118), ctx), null);
  assert.equal(_.assess(vid("d", "Alien 1979 full movie", 118, { description: "Watch full movie here: http://x" }), ctx), null);
});

test("'Full Movie' in the title isn't enough - the length has to fit", () => {
  const ctx = { title: "Alien", year: 1979, runtimeMin: 117 };
  assert.equal(_.assess(vid("s", "Alien 1979 FULL MOVIE HD", 12), ctx), null);
  assert.equal(_.assess(vid("l", "Alien 1979 FULL MOVIE", 10 * 60), ctx), null);
  assert.equal(_.assess(vid("f", "Alien 1979 FULL MOVIE", 116), ctx).fit, "full");
  assert.equal(_.assess(vid("c", "Alien (Director's Cut)", 116), ctx).fit, "full");
  assert.equal(_.assess(vid("n", "Alien 1979", 90), ctx).fit, "near");
});

test("movie title containing a 'bad' word is still found", () => {
  const ctx = { title: "Scream", year: 1996, runtimeMin: 111 };
  assert.equal(_.assess(vid("s", "Scream (1996) Full Movie", 111), ctx).fit, "full");
  assert.equal(_.assess(vid("s2", "Scream 2 (1997) Full Movie", 120), ctx), null);
});

test("unofficial uploads count; confirmed full movie -> Free", async () => {
  const b = fakeBackend([vid("a", "alien 1979 full movie english", 116, { channel: "random guy 123" })]);
  const r = await _.check(ALIEN, { backends: [b] });
  assert.equal(r.status, "free");
  assert.equal(r.results[0].channel, "random guy 123");
  assert.equal(r.results[0].url, "https://www.youtube.com/watch?v=a");
});

test("ad-supported distributor -> Free with ads", async () => {
  const b = fakeBackend([vid("a", "Alien (1979) | Full Movie", 117, { channel: "FilmRise Movies" })]);
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "free_ads");
});

test("only a trailer -> Unavailable", async () => {
  const b = fakeBackend([vid("t", "Alien - Trailer", 2), vid("c", "Alien chestburster scene", 4)]);
  const r = await _.check(ALIEN, { backends: [b] });
  assert.equal(r.status, "unavailable");
  assert.equal(r.results.length, 0);
});

test("deleted/private uploads are dropped", async () => {
  const b = fakeBackend([vid("a", "Alien 1979 full movie", 116)], { a: { state: "removed" } });
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "unavailable");
});

test("region-blocked or paid -> not free; age-restricted stays free with a note", async () => {
  let b = fakeBackend([vid("a", "Alien 1979 full movie", 116)], { a: { state: "ok", regionBlocked: true } });
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "unavailable");
  b = fakeBackend([vid("a", "Alien 1979 full movie", 116, { premium: true })]);
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "unavailable");
  b = fakeBackend([vid("a", "Alien 1979 full movie", 116)], { a: { state: "ok", ageRestricted: true } });
  const r = await _.check(ALIEN, { backends: [b] });
  assert.equal(r.status, "free");
  assert.ok(r.results[0].notes.some((n) => /Age-restricted/.test(n)));
});

test("YouTube Movies storefront listing without a free signal -> Possibly", async () => {
  const b = fakeBackend([vid("a", "Alien", 117, { channel: "YouTube Movies" })]);
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "possible");
});

test("couldn't verify playback -> Possibly", async () => {
  const b = fakeBackend([vid("a", "Alien 1979 full movie", 116)], { a: { state: "unknown" } });
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "possible");
});

test("wrong year (remake) or dubbed -> Possibly at best", async () => {
  const thing = { title: "The Thing", year: 1982, runtime: 109 };
  let b = fakeBackend([vid("a", "The Thing 2011 full movie", 103)]);
  assert.equal((await _.check(thing, { backends: [b] })).status, "possible");
  b = fakeBackend([vid("a", "Alien 1979 full movie hindi dubbed", 116)]);
  assert.equal((await _.check(ALIEN, { backends: [b] })).status, "possible");
});

test("split uploads combine into one Possibly result", async () => {
  const nos = { title: "Nosferatu", year: 1922, runtime: 94 };
  const b = fakeBackend([
    vid("p1", "Nosferatu 1922 part 1", 31, { channelId: "ch" }),
    vid("p2", "Nosferatu 1922 part 2", 31, { channelId: "ch" }),
    vid("p3", "Nosferatu 1922 part 3", 32, { channelId: "ch" })
  ]);
  const r = await _.check(nos, { backends: [b] });
  assert.equal(r.status, "possible");
  assert.equal(r.results[0].parts.length, 3);
  assert.equal(r.results[0].url, "https://www.youtube.com/watch?v=p1");
});

test("ranking: full + playable + right year + closest runtime; top 3 only", async () => {
  const b = fakeBackend([
    vid("near", "Alien 1979", 90),
    vid("dead", "Alien 1979 full movie", 117),
    vid("far", "Alien 1979 full movie", 140),
    vid("close", "Alien 1979 full movie", 118),
    vid("noyear", "Alien full movie", 117)
  ], { dead: { state: "ok", regionBlocked: true } });
  const r = await _.check(ALIEN, { backends: [b] });
  assert.deepEqual(r.results.map((x) => x.id), ["close", "far", "noyear"]);
  assert.equal(r.status, "free");
});

test("every backend down -> error, never Unavailable", async () => {
  const r = await _.check(ALIEN, { backends: [fakeBackend([], null, { fail: true }), fakeBackend([], null, { fail: true })] });
  assert.equal(r.status, "error");
});

test("falls through to the next backend when the first is down", async () => {
  const r = await _.check(ALIEN, { backends: [fakeBackend([], null, { fail: true, name: "A" }), fakeBackend([vid("a", "Alien 1979 full movie", 116)], null, { name: "B" })] });
  assert.equal(r.status, "free");
  assert.equal(r.source, "B");
});

test("queries include the variations and the year", () => {
  const qs = _.buildQueries({ title: "Heat", year: 1995 }).map((x) => x.q);
  assert.deepEqual(qs, ["Heat 1995 full movie", "Heat 1995 full movie with ads", "Heat 1995 full film", "Heat 1995 complete movie"]);
  const qs2 = _.buildQueries({ title: "The Night of the Hunter", year: 1955 }).map((x) => x.q);
  assert.ok(qs2.includes("The Night of the Hunter full movie"));
  assert.ok(qs2.includes("The Night of the Hunter 1955 full movie"));
});

test("ISO durations and error classification", () => {
  assert.equal(_.parseIsoDuration("PT1H32M10S"), 5530);
  assert.equal(_.classifyError("This video is private").state, "removed");
  assert.equal(_.classifyError("Video unavailable").state, "removed");
  assert.equal(_.classifyError("Sign in to confirm your age").ageRestricted, true);
  assert.equal(_.classifyError("Sign in to confirm you're not a bot").state, "unknown");
});

setTimeout(() => {
  if (failures) { console.log(failures + " failed"); process.exit(1); }
  console.log("all passed");
}, 200);
