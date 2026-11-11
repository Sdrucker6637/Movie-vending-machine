#!/usr/bin/env node
// Tests for yt/check.js (official YouTube Movies & TV availability from
// TMDB watch/providers data). No network. Run: node tools/test-yt-check.js
"use strict";
const assert = require("assert");
const path = require("path");
const YT = require(path.join(__dirname, "..", "yt", "check.js"));
const _ = YT._;

let failures = 0;
async function test(name, fn) {
  try { await fn(); console.log("ok   " + name); }
  catch (e) { failures++; console.log("FAIL " + name + "\n     " + (e && e.message)); }
}
const p = (name) => ({ provider_name: name });

(async () => {
  await test("free with ads in the YouTube catalog", () => {
    assert.equal(_.classify({ ads: [p("Tubi TV"), p("YouTube Free")] }).status, "free_ads");
    assert.equal(_.classify({ ads: [p("YouTube")] }).status, "free_ads");
  });
  await test("free (no ads listed)", () => {
    assert.equal(_.classify({ free: [p("YouTube Free")] }).status, "free");
  });
  await test("rent/buy only is not free", () => {
    const c = _.classify({ rent: [p("YouTube")], buy: [p("YouTube"), p("Apple TV")] });
    assert.equal(c.status, "rent");
  });
  await test("YouTube Premium and YouTube TV don't count", () => {
    assert.equal(_.classify({ flatrate: [p("YouTube Premium")], ads: [p("YouTube TV")] }).status, "unavailable");
  });
  await test("free on other services only -> not on YouTube", () => {
    assert.equal(_.classify({ ads: [p("Tubi TV"), p("Pluto TV")] }).status, "unavailable");
    assert.equal(_.classify(null).status, "unavailable");
  });
  await test("check builds a YouTube Movies link and uses US listings", async () => {
    YT.setFetcher(async () => ({ year: 1979, runtime: 117, providers: { US: { link: "https://tmdb/x", ads: [p("YouTube Free")] }, GB: {} } }));
    const r = await _.check({ title: "Alien", year: 1979 });
    assert.equal(r.status, "free_ads");
    assert.equal(r.results.length, 1);
    assert.equal(r.results[0].channel, "YouTube Movies & TV");
    assert.equal(r.results[0].durationSec, 117 * 60);
    assert.ok(r.results[0].url.startsWith("https://www.youtube.com/results?search_query=Alien%201979"));
  });
  await test("no TMDB data -> error, not 'No'", async () => {
    YT.setFetcher(async () => ({ error: "TMDB isn't connected" }));
    const r = await _.check({ title: "Alien" });
    assert.equal(r.status, "error");
  });
  if (failures) { console.log(failures + " failed"); process.exit(1); }
  console.log("all passed");
})();
