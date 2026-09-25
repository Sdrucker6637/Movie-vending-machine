#!/usr/bin/env node
/* Prepares a short recorded clip for a machine reaction.

     node tools/make-clip.js --in source.wav --id <tmdb id> --key 1 \
       --from 12.3 --to 14.1 --source "where the source audio came from" \
       [--movie "Title (year)"] [--license "CC BY 3.0"] [--attribution "..."] [--url https://...]

   - --id must be a TMDB id that already has a cue (see fx/index.js); the
     clip is written to fx/clips/<id>-<key>.mp3, where fx.sfx("clip:<key>")
     in that cue will find it.
   - Only the --from/--to span is kept (seconds). Leading/trailing silence
     is trimmed, loudness is normalised, and it is encoded as small mono MP3
     (plays everywhere, including iOS Safari).
   - Refuses anything longer than 6 s or bigger than 64 KB: clips are
     meant to be a moment, not a scene.
   - Records the source in tools/clip-sources.json so every file can be
     traced. That file is never served to the app.

   Needs ffmpeg on PATH (or FFMPEG=/path/to/ffmpeg). Never replace a clip
   file in place - give a new take a new --key, since clip URLs are cached
   indefinitely. */
"use strict";
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const MAX_S = 6;
const MAX_BYTES = 64 * 1024;
const root = path.join(__dirname, "..");

function arg(name, required) {
  const i = process.argv.indexOf("--" + name);
  const v = i > -1 ? process.argv[i + 1] : undefined;
  if (required && (v == null || v.startsWith("--"))) fail("missing --" + name);
  return v;
}
function fail(msg) {
  console.error("make-clip: " + msg);
  process.exit(1);
}

const input = arg("in", true);
const id = Number(arg("id", true));
const key = arg("key", true);
const from = Number(arg("from", true));
const to = Number(arg("to", true));
const source = arg("source", true);
const ffmpeg = process.env.FFMPEG || "ffmpeg";

if (!fs.existsSync(input)) fail("no such file: " + input);
if (!Number.isInteger(id) || id <= 0) fail("--id must be a TMDB id");
if (!/^[\w-]{1,24}$/.test(key)) fail("--key may only use letters, digits, _ and -");
if (!(to > from) || to - from > MAX_S) fail("--from/--to must be a span of at most " + MAX_S + "s");
const index = fs.readFileSync(path.join(root, "fx", "index.js"), "utf8");
if (!new RegExp("[\\[,]" + id + "[,\\]]").test(index)) fail("TMDB id " + id + " has no cue in fx/index.js - add the cue first");

const out = path.join(root, "fx", "clips", id + "-" + key + ".mp3");
if (fs.existsSync(out)) fail(path.relative(root, out) + " already exists - use a new --key");
fs.mkdirSync(path.dirname(out), { recursive: true });

// even out loudness first, then trim true silence at both ends (keeping a
// short margin so soft onsets survive), with short fades against clicks
const trim = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.08";
const filters = ["loudnorm=I=-16:TP=-1.5:LRA=11", trim, "areverse", trim, "areverse", "afade=t=in:d=0.01", "areverse", "afade=t=in:d=0.03", "areverse"].join(",");
execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-ss", String(from), "-to", String(to), "-i", input,
  "-af", filters, "-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "64k", "-map_metadata", "-1", out], { stdio: "inherit" });

const bytes = fs.statSync(out).size;
if (bytes > MAX_BYTES) {
  fs.unlinkSync(out);
  fail("result is " + bytes + " bytes - trim it shorter");
}

const log = path.join(__dirname, "clip-sources.json");
const list = fs.existsSync(log) ? JSON.parse(fs.readFileSync(log, "utf8")) : [];
const extra = {};
["movie", "license", "attribution", "url"].forEach((k) => { const v = arg(k); if (v) extra[k] = v; });
list.push(Object.assign({ file: path.relative(root, out).split(path.sep).join("/"), tmdbId: id, key }, extra, { source, from, to, bytes, added: new Date().toISOString().slice(0, 10) }));
fs.writeFileSync(log, JSON.stringify(list, null, 2) + "\n");
console.log("wrote " + path.relative(root, out) + " (" + bytes + " bytes) - now use fx.sfx(\"clip:" + key + "\", { fallback: ... }) in cue " + id);
