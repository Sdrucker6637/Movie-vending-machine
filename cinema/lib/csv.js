/* =========================================================
   Letterboxd CSV export reader
   ---------------------------------------------------------
   Letterboxd's "Export your data" ZIP contains (among others):
     diary.csv      Date, Name, Year, Letterboxd URI, Rating,
                    Rewatch, Tags, Watched Date
     reviews.csv    Date, Name, Year, Letterboxd URI, Rating,
                    Rewatch, Review, Tags, Watched Date
     ratings.csv    Date, Name, Year, Letterboxd URI, Rating
     watched.csv    Date, Name, Year, Letterboxd URI
     watchlist.csv  Date, Name, Year, Letterboxd URI
     likes/films.csv Date, Name, Year, Letterboxd URI
   Only these files are ever read. profile.csv (which holds the
   account e-mail address), comments, lists etc. are ignored and
   never leave the device through the import tool.
   ========================================================= */
import { toNumber, toRating, toYesNo, isoDate } from "./util.js";

export const ALLOWED_FILES = ["diary.csv", "reviews.csv", "ratings.csv", "watched.csv", "watchlist.csv", "likes/films.csv"];

// RFC 4180 CSV: quoted fields, doubled quotes, embedded newlines, CRLF, BOM.
export function parseCSV(text) {
  const s = String(text || "").replace(/^﻿/, "");
  const rows = [];
  let row = [], field = "", i = 0, inQuotes = false;
  while (i < s.length) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += c; i++;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const nonEmpty = rows.filter((r) => r.some((f) => f.trim() !== ""));
  if (!nonEmpty.length) return [];
  const header = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const o = {};
    header.forEach((h, idx) => { o[h] = r[idx] !== undefined ? r[idx] : ""; });
    return o;
  });
}

// Maps an archive path ("letterboxd-x/likes/films.csv", "diary.csv") to one
// of ALLOWED_FILES, or null when the file must be ignored.
export function exportFileKind(path) {
  const p = String(path || "").replace(/\\/g, "/").toLowerCase();
  if (/(^|\/)likes\/films\.csv$/.test(p)) return "likes/films.csv";
  if (/(^|\/)(deleted|orphaned)\//.test(p)) return null;
  const base = p.split("/").pop();
  if (["diary.csv", "reviews.csv", "ratings.csv", "watched.csv", "watchlist.csv"].includes(base)) {
    // Only top-level files - lists/*.csv also contain these columns.
    const parts = p.split("/");
    if (parts.length > 2) return null;
    return base;
  }
  return null;
}

function base(row) {
  return {
    title: String(row["Name"] || "").trim(),
    year: toNumber(row["Year"]),
    uri: String(row["Letterboxd URI"] || "").trim() || null,
    date: isoDate(row["Date"])
  };
}

function tags(v) {
  return String(v || "").split(",").map((t) => t.trim()).filter(Boolean);
}

// files: { "diary.csv": "<text>", ... } (keys as returned by exportFileKind)
export function parseLetterboxdExport(files) {
  const out = { diary: [], reviews: [], ratings: [], watched: [], watchlist: [], likes: [] };
  const get = (k) => (files[k] ? parseCSV(files[k]) : []);
  for (const r of get("diary.csv")) {
    const b = base(r);
    if (!b.title) continue;
    out.diary.push({ ...b, rating: toRating(r["Rating"]), rewatch: toYesNo(r["Rewatch"]), tags: tags(r["Tags"]), watchedDate: isoDate(r["Watched Date"]) || b.date });
  }
  for (const r of get("reviews.csv")) {
    const b = base(r);
    if (!b.title) continue;
    out.reviews.push({ ...b, rating: toRating(r["Rating"]), rewatch: toYesNo(r["Rewatch"]), tags: tags(r["Tags"]), review: String(r["Review"] || "").trim() || null, watchedDate: isoDate(r["Watched Date"]) });
  }
  for (const r of get("ratings.csv")) {
    const b = base(r);
    if (!b.title) continue;
    out.ratings.push({ ...b, rating: toRating(r["Rating"]) });
  }
  for (const r of get("watched.csv")) { const b = base(r); if (b.title) out.watched.push(b); }
  for (const r of get("watchlist.csv")) { const b = base(r); if (b.title) out.watchlist.push(b); }
  for (const r of get("likes/films.csv")) { const b = base(r); if (b.title) out.likes.push(b); }
  return out;
}
