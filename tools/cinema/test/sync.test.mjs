import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { runSync } from "../sync.mjs";
import { readZip } from "../../../cinema/lib/zip.js";
import { read, tmpDir, exportFiles, detail, fakeTmdb, FIX } from "./helpers.mjs";

const quiet = () => {};
const T0 = "2024-06-05T00:00:00.000Z";

function repo() {
  const dir = tmpDir();
  fs.mkdirSync(path.join(dir, "cinema"), { recursive: true });
  fs.writeFileSync(path.join(dir, "cinema", "config.json"), JSON.stringify({ letterboxdUser: "testmember", syncEveryHours: 6 }));
  return dir;
}
function details() {
  const d = {};
  const add = (id, title, year, genres, dir, extra) => { d[id] = detail(id, { title, year, genres, directors: [[dir, "Dir " + dir]], cast: [[dir + 1000, "Star " + dir]], keywords: ["love"], ...(extra || {}) }); };
  add(101, "Alpha Film", 2001, ["Drama"], 1);
  add(102, "Beta Movie", 1975, ["Action"], 2);
  add(103, "Gamma", 2019, ["Thriller"], 3);
  add(104, "Delta", 1999, ["Drama"], 1);
  add(105, 'Epsilon, Part "One"', 1999, ["Comedy"], 5);
  add(106, "Zeta", 1950, ["Drama"], 6);
  add(107, "Eta", 1930, ["Drama"], 7);
  add(108, "Theta", 2010, ["Drama"], 8);
  add(900, "Candidate", 2003, ["Drama"], 1, { vc: 400, va: 7.5 });
  return d;
}
const okFetch = (xml) => async () => ({ ok: true, status: 200, text: async () => xml, headers: new Map() });

// Minimal STORE-method zip writer (test only), to check the importer never
// reads profile.csv out of a full Letterboxd export.
function makeZip(files) {
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const locals = [], centrals = [];
  let off = 0;
  for (const [name, text] of Object.entries(files)) {
    const data = Buffer.from(text), nm = Buffer.from(name), c = crc(data);
    const L = Buffer.alloc(30); L.writeUInt32LE(0x04034b50, 0); L.writeUInt16LE(20, 4); L.writeUInt32LE(c, 14); L.writeUInt32LE(data.length, 18); L.writeUInt32LE(data.length, 22); L.writeUInt16LE(nm.length, 26);
    const C = Buffer.alloc(46); C.writeUInt32LE(0x02014b50, 0); C.writeUInt16LE(20, 4); C.writeUInt16LE(20, 6); C.writeUInt32LE(c, 16); C.writeUInt32LE(data.length, 20); C.writeUInt32LE(data.length, 24); C.writeUInt16LE(nm.length, 28); C.writeUInt32LE(off, 42);
    locals.push(L, nm, data); centrals.push(C, nm);
    off += 30 + nm.length + data.length;
  }
  const cd = Buffer.concat(centrals);
  const E = Buffer.alloc(22); E.writeUInt32LE(0x06054b50, 0); E.writeUInt16LE(centrals.length / 2, 8); E.writeUInt16LE(centrals.length / 2, 10); E.writeUInt32LE(cd.length, 12); E.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cd, E]);
}

test("first run: import bundle + RSS + TMDB enrichment + candidates", async () => {
  const data = tmpDir(), rp = repo();
  fs.mkdirSync(path.join(data, "import"));
  fs.writeFileSync(path.join(data, "import", "letterboxd-import.json"), JSON.stringify({ format: "letterboxd-import", files: exportFiles() }));
  const tmdb = fakeTmdb(details(), { recs: { 104: [900, 101] }, discover: [900] });
  const s = await runSync({ dataDir: data, repoDir: rp, fetch: okFetch(read("rss-sample.xml")), tmdb, now: T0, log: quiet });
  assert.equal(s.ok, true);
  assert.equal(s.lastSuccessAt, T0);
  assert.equal(s.import.viewingsAdded, 5);
  assert.equal(s.rss.added, 2);
  assert.ok(!fs.existsSync(path.join(data, "import", "letterboxd-import.json")), "processed bundle removed");
  const db = JSON.parse(fs.readFileSync(path.join(data, "db.json"), "utf8"));
  const meta = JSON.parse(fs.readFileSync(path.join(data, "meta.json"), "utf8"));
  assert.equal(db.films["delta|1999"].tmdbId, 104, "CSV-only film matched by TMDB search");
  assert.equal(db.films['epsilon part one|1999'].tmdbId, 105);
  assert.equal(db.watchlist["theta|2010"].tmdbId, 108);
  assert.equal(meta[104].directors[0].name, "Dir 1");
  const cand = JSON.parse(fs.readFileSync(path.join(data, "candidates.json"), "utf8"));
  const ids = cand.candidates.map((c) => c.id);
  assert.ok(ids.includes(900));
  assert.ok(!ids.includes(101), "watched films are never candidates");
  assert.ok(meta[900], "candidate metadata cached");
  const st = JSON.parse(fs.readFileSync(path.join(data, "status.json"), "utf8"));
  assert.equal(st.counts.films, 7);
});

test("second run is a no-op for data, and RSS failure keeps the last success", async () => {
  const data = tmpDir(), rp = repo();
  const tmdb = fakeTmdb(details());
  await runSync({ dataDir: data, repoDir: rp, fetch: okFetch(read("rss-sample.xml")), tmdb, now: T0, log: quiet });
  const db1 = fs.readFileSync(path.join(data, "db.json"), "utf8");
  const used1 = tmdb.used;
  const s2 = await runSync({ dataDir: data, repoDir: rp, fetch: okFetch(read("rss-sample.xml")), tmdb, now: "2024-06-05T06:00:00.000Z", log: quiet });
  assert.equal(s2.rss.added, 0);
  assert.equal(fs.readFileSync(path.join(data, "db.json"), "utf8"), db1, "unchanged database");
  assert.ok(tmdb.used - used1 < 3, "metadata comes from the cache");
  const failing = async () => { throw new Error("getaddrinfo ENOTFOUND letterboxd.com"); };
  const s3 = await runSync({ dataDir: data, repoDir: rp, fetch: failing, tmdb, now: "2024-06-05T12:00:00.000Z", log: quiet, rssRetryDelays: [0, 0, 0] });
  assert.equal(s3.ok, false);
  assert.equal(s3.lastSuccessAt, "2024-06-05T06:00:00.000Z");
  assert.match(s3.errors[0], /ENOTFOUND/);
  assert.equal(fs.readFileSync(path.join(data, "db.json"), "utf8"), db1, "data untouched by a failed sync");
});

test("an HTML error page instead of RSS is reported, not merged", async () => {
  const data = tmpDir(), rp = repo();
  const s = await runSync({ dataDir: data, repoDir: rp, fetch: okFetch("<html>Just a moment...</html>"), tmdb: fakeTmdb({}), now: T0, log: quiet });
  assert.equal(s.ok, false);
  assert.match(s.errors.join(" "), /Not an RSS feed/);
});

test("missing TMDB credentials is a warning, not a failure", async () => {
  const data = tmpDir(), rp = repo();
  const s = await runSync({ dataDir: data, repoDir: rp, fetch: okFetch(read("rss-sample.xml")), tmdb: { hasCredentials: false }, now: T0, log: quiet });
  assert.equal(s.ok, true);
  assert.match(s.warnings.join(" "), /TMDB_API_KEY/);
});

test("ZIP exports: uploaded zips are refused; local zips skip profile.csv", async () => {
  const dir = path.join(FIX, "export");
  const all = {};
  for (const f of ["diary.csv", "reviews.csv", "ratings.csv", "watched.csv", "watchlist.csv", "profile.csv", "likes/films.csv"]) all["letterboxd-testmember/" + f] = fs.readFileSync(path.join(dir, f), "utf8");
  const zip = makeZip(all);
  const data = tmpDir(), rp = repo();
  fs.mkdirSync(path.join(rp, "cinema-import"));
  fs.writeFileSync(path.join(rp, "cinema-import", "export.zip"), zip);
  const s = await runSync({ dataDir: data, repoDir: rp, skipRss: true, tmdb: { hasCredentials: false }, now: T0, log: quiet });
  assert.match(s.warnings.join(" "), /Ignored export\.zip/);
  assert.equal(s.import, null);
  const zp = path.join(tmpDir(), "x.zip");
  fs.writeFileSync(zp, zip);
  const s2 = await runSync({ dataDir: data, repoDir: rp, skipRss: true, importPaths: [zp], tmdb: { hasCredentials: false }, now: T0, log: quiet });
  assert.deepEqual(s2.import.files.sort(), ["diary.csv", "likes/films.csv", "ratings.csv", "reviews.csv", "watched.csv", "watchlist.csv"]);
  assert.ok(!fs.readFileSync(path.join(data, "db.json"), "utf8").includes("secret@example.com"));
  const raw = await readZip(zip, (n) => n.endsWith("profile.csv"), async (d) => zlib.inflateRawSync(d));
  assert.match(Object.values(raw)[0], /secret@example.com/, "sanity: the zip really contains it");
});

test("CSVs uploaded to cinema-import/ on main are imported once", async () => {
  const data = tmpDir(), rp = repo();
  fs.mkdirSync(path.join(rp, "cinema-import"));
  fs.writeFileSync(path.join(rp, "cinema-import", "diary.csv"), exportFiles()["diary.csv"]);
  const s1 = await runSync({ dataDir: data, repoDir: rp, skipRss: true, tmdb: { hasCredentials: false }, now: T0, log: quiet });
  assert.equal(s1.import.viewingsAdded, 5);
  const s2 = await runSync({ dataDir: data, repoDir: rp, skipRss: true, tmdb: { hasCredentials: false }, now: T0, log: quiet });
  assert.equal(s2.import, null, "already processed");
});
