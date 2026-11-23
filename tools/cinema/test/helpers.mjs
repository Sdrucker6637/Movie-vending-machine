// Test helpers: a fake TMDB and synthetic metadata. Only used by tests.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export const FIX = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");
export const read = (p) => fs.readFileSync(path.join(FIX, p), "utf8");
export const tmpDir = () => fs.mkdtempSync(path.join(os.tmpdir(), "cinema-test-"));

export function exportFiles() {
  const dir = path.join(FIX, "export");
  return {
    "diary.csv": fs.readFileSync(path.join(dir, "diary.csv"), "utf8"),
    "reviews.csv": fs.readFileSync(path.join(dir, "reviews.csv"), "utf8"),
    "ratings.csv": fs.readFileSync(path.join(dir, "ratings.csv"), "utf8"),
    "watched.csv": fs.readFileSync(path.join(dir, "watched.csv"), "utf8"),
    "watchlist.csv": fs.readFileSync(path.join(dir, "watchlist.csv"), "utf8"),
    "likes/films.csv": fs.readFileSync(path.join(dir, "likes/films.csv"), "utf8")
  };
}

// A TMDB "detail" response shaped like /movie/{id}?append_to_response=credits,keywords
export function detail(id, o) {
  return {
    id, title: o.title, original_title: o.title, release_date: `${o.year}-05-01`, runtime: o.runtime ?? 100,
    genres: (o.genres || []).map((n, i) => ({ id: i, name: n })),
    production_countries: (o.countries || ["United States of America"]).map((n) => ({ name: n })),
    original_language: o.lang || "en",
    spoken_languages: [{ iso_639_1: o.lang || "en", english_name: o.langName || "English" }],
    credits: {
      crew: (o.directors || []).map(([pid, name]) => ({ id: pid, name, job: "Director", department: "Directing" })),
      cast: (o.cast || []).map(([pid, name], i) => ({ id: pid, name, order: i }))
    },
    keywords: { keywords: (o.keywords || []).map((k, i) => ({ id: 9000 + k.length * 7 + i, name: k })) },
    vote_average: o.va ?? 7, vote_count: o.vc ?? 1000, popularity: o.pop ?? 10, poster_path: `/p${id}.jpg`, overview: "An overview."
  };
}

export function fakeTmdb(details, extra) {
  const e = extra || {};
  let used = 0;
  const api = {
    hasCredentials: true,
    get used() { return used; },
    movie: async (id) => { used++; return details[id] || null; },
    searchMovie: async (q) => { used++; const hits = Object.values(details).filter((d) => d.title.toLowerCase() === q.toLowerCase()); return { results: hits.map((d) => ({ id: d.id, title: d.title, original_title: d.title, release_date: d.release_date, vote_count: d.vote_count })) }; },
    recommendations: async (id) => { used++; return { results: (e.recs && e.recs[id] || []).map((x) => ({ id: x })) }; },
    personCredits: async (pid) => { used++; return e.people && e.people[pid] || { cast: [], crew: [] }; },
    discover: async () => { used++; return { results: (e.discover || []).map((x) => ({ id: x })) }; }
  };
  return api;
}
