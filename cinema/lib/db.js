/* =========================================================
   The My Cinema database: one JSON document (db.json) kept on
   the repository's cinema-data branch.

   {
     version, user, createdAt, updatedAt,
     films:     { [key]: Film }        every film ever watched
     viewings:  [ Viewing ]            diary entries (incl. rewatches)
     watchlist: { [key]: WatchItem }   snapshot from the CSV export
     imports:   [ { at, hash, counts } ]
   }
   Film     { key, title, year, tmdbId, slug, uri, rating, ratedAt,
              liked, firstSeenAt, sources[] }
   Viewing  { id, film, date, rating, rewatch, liked, review, reviewHash,
              spoilers, tags[], guid, uri, loggedAt, postedHour,
              sources[], edited, history[] }

   A film's key is its normalised Letterboxd "title|year". Both the
   CSV export and the RSS feed use Letterboxd's own titles, so the
   same key is produced by either source. When the feed supplies a
   TMDB id that already belongs to a film, that film is reused even
   if Letterboxd's title has since changed.
   ========================================================= */
import { filmKey, hash } from "./util.js";

export const DB_VERSION = 1;

export function emptyDb(user, now) {
  const at = now || new Date().toISOString();
  return { version: DB_VERSION, user, createdAt: at, updatedAt: at, films: {}, viewings: [], watchlist: {}, imports: [] };
}

function addSource(obj, s) {
  if (!obj.sources) obj.sources = [];
  if (!obj.sources.includes(s)) obj.sources.push(s);
}

export function findFilm(db, { title, year, tmdbId }) {
  if (tmdbId) {
    for (const f of Object.values(db.films)) if (f.tmdbId === tmdbId) return f;
  }
  return db.films[filmKey(title, year)] || null;
}

export function upsertFilm(db, info, source, now) {
  let f = findFilm(db, info);
  let created = false;
  if (!f) {
    let key = filmKey(info.title, info.year);
    // Two different films sharing a title and year: keep them apart.
    if (db.films[key] && info.tmdbId && db.films[key].tmdbId && db.films[key].tmdbId !== info.tmdbId) key += "|" + info.tmdbId;
    f = { key, title: info.title, year: info.year || null, tmdbId: info.tmdbId || null, slug: null, uri: null, rating: null, ratedAt: null, liked: false, firstSeenAt: now, sources: [] };
    db.films[key] = f;
    created = true;
  }
  if (info.tmdbId && !f.tmdbId) { f.tmdbId = info.tmdbId; f.tmdbMatch = "letterboxd"; }
  if (info.slug && !f.slug) f.slug = info.slug;
  if (info.uri && !f.uri) f.uri = info.uri;
  addSource(f, source);
  return { film: f, created };
}

// Film-level rating follows the most recent rating event we know of.
function setFilmRating(f, rating, at) {
  if (rating === null || rating === undefined) return false;
  if (f.ratedAt && at && at < f.ratedAt) return false;
  const changed = f.rating !== rating;
  f.rating = rating;
  f.ratedAt = at || f.ratedAt || null;
  return changed;
}

function viewingsFor(db, key, date) {
  return db.viewings.filter((v) => v.film === key && v.date === date);
}

function nextCsvId(db, key, date) {
  const base = `csv:${key}|${date || "undated"}`;
  let n = 0;
  const ids = new Set(db.viewings.map((v) => v.id));
  while (ids.has(`${base}|${n}`)) n++;
  return `${base}|${n}`;
}

function setReview(v, text, spoilers) {
  v.review = text || null;
  v.reviewHash = text ? hash(text) : null;
  if (spoilers !== undefined) v.spoilers = !!spoilers;
}

/* ---------- One-time CSV import ---------- */

// parsed: output of parseLetterboxdExport(). Idempotent: importing the same
// export twice changes nothing; importing after RSS sync fills gaps only.
export function applyImport(db, parsed, now) {
  const at = now || new Date().toISOString();
  const c = { filmsAdded: 0, viewingsAdded: 0, viewingsMatched: 0, reviewsAttached: 0, ratingsSet: 0, likes: 0, watchlist: 0 };

  // diary.csv - one row per logged viewing. Rows for the same film and date
  // are matched to existing viewings in order, so double features survive.
  const seen = new Map();
  for (const r of parsed.diary || []) {
    const { film, created } = upsertFilm(db, r, "csv", at);
    if (created) c.filmsAdded++;
    const slotKey = film.key + "|" + r.watchedDate;
    const idx = seen.get(slotKey) || 0;
    seen.set(slotKey, idx + 1);
    const existing = viewingsFor(db, film.key, r.watchedDate)[idx];
    if (existing) {
      c.viewingsMatched++;
      if (existing.rating === null && r.rating !== null) existing.rating = r.rating;
      if (!existing.tags || !existing.tags.length) existing.tags = r.tags;
      if (!existing.uri) existing.uri = r.uri;
      addSource(existing, "csv");
    } else {
      db.viewings.push({
        id: nextCsvId(db, film.key, r.watchedDate), film: film.key, date: r.watchedDate, rating: r.rating, rewatch: r.rewatch,
        liked: false, review: null, reviewHash: null, spoilers: false, tags: r.tags, guid: null, uri: r.uri,
        loggedAt: r.date, postedHour: null, sources: ["csv"], edited: false, history: []
      });
      c.viewingsAdded++;
    }
    if (setFilmRating(film, r.rating, r.date)) c.ratingsSet++;
  }

  // reviews.csv - attach text to the matching diary viewing.
  for (const r of parsed.reviews || []) {
    if (!r.review) continue;
    const { film, created } = upsertFilm(db, r, "csv", at);
    if (created) c.filmsAdded++;
    const candidates = db.viewings.filter((v) => v.film === film.key && (!r.watchedDate || v.date === r.watchedDate));
    const target = candidates.find((v) => !v.review && v.rating === r.rating) || candidates.find((v) => !v.review) || candidates.find((v) => v.reviewHash === hash(r.review));
    if (target) {
      if (!target.review) { setReview(target, r.review); c.reviewsAttached++; }
    } else {
      db.viewings.push({
        id: nextCsvId(db, film.key, r.watchedDate), film: film.key, date: r.watchedDate, rating: r.rating, rewatch: r.rewatch,
        liked: false, review: r.review, reviewHash: hash(r.review), spoilers: false, tags: r.tags, guid: null, uri: r.uri,
        loggedAt: r.date, postedHour: null, sources: ["csv"], edited: false, history: []
      });
      c.viewingsAdded++; c.reviewsAttached++;
    }
  }

  // ratings.csv - the current rating for every rated film (diary or not).
  for (const r of parsed.ratings || []) {
    const { film, created } = upsertFilm(db, r, "csv", at);
    if (created) c.filmsAdded++;
    if (setFilmRating(film, r.rating, r.date)) c.ratingsSet++;
  }

  // watched.csv - every film marked watched, including undated ones.
  for (const r of parsed.watched || []) {
    const { created } = upsertFilm(db, r, "csv", at);
    if (created) c.filmsAdded++;
  }

  for (const r of parsed.likes || []) {
    const { film, created } = upsertFilm(db, r, "csv", at);
    if (created) c.filmsAdded++;
    if (!film.liked) { film.liked = true; c.likes++; }
  }

  // watchlist.csv - a snapshot; replaced wholesale by a newer import.
  if ((parsed.watchlist || []).length) {
    const wl = {};
    for (const r of parsed.watchlist) {
      const key = filmKey(r.title, r.year);
      const prev = db.watchlist[key];
      wl[key] = { key, title: r.title, year: r.year, uri: r.uri, addedAt: r.date, tmdbId: prev ? prev.tmdbId : null };
    }
    db.watchlist = wl;
    c.watchlist = Object.keys(wl).length;
  }

  db.updatedAt = at;
  return c;
}

/* ---------- Recurring RSS sync ---------- */

export function applyRss(db, items, now) {
  const at = now || new Date().toISOString();
  const c = { seen: 0, added: 0, updated: 0, unchanged: 0, filmsAdded: 0, edited: [] };
  // Oldest first, so film ratings end on the newest value.
  const sorted = [...items].sort((a, b) => String(a.publishedAt).localeCompare(String(b.publishedAt)));
  for (const it of sorted) {
    c.seen++;
    const { film, created } = upsertFilm(db, it, "rss", at);
    if (created) c.filmsAdded++;
    if (it.liked) film.liked = true;
    const date = it.watchedDate || (it.publishedAt ? it.publishedAt.slice(0, 10) : null);

    let v = it.guid ? db.viewings.find((x) => x.guid === it.guid) : null;
    if (!v) {
      // A CSV-imported viewing of the same film on the same day, not yet
      // linked to a feed entry.
      v = viewingsFor(db, film.key, date).find((x) => !x.guid) || null;
      if (v) v.guid = it.guid;
    }
    const fields = { date, rating: it.rating, rewatch: it.rewatch, liked: it.liked, reviewHash: it.review ? hash(it.review) : null };
    if (!v) {
      db.viewings.push({
        id: "lb:" + (it.guid || `${film.key}|${date}`), film: film.key, date, rating: it.rating, rewatch: it.rewatch, liked: it.liked,
        review: it.review, reviewHash: fields.reviewHash, spoilers: it.spoilers, tags: [], guid: it.guid, uri: it.link,
        loggedAt: it.publishedAt, postedHour: it.postedHour, sources: ["rss"], edited: false, history: []
      });
      c.added++;
    } else {
      const wasCsvOnly = !v.sources.includes("rss");
      const changes = [];
      if (v.rating !== fields.rating) changes.push("rating");
      // An RSS watch-entry with no text must not wipe a CSV review.
      if (fields.reviewHash !== v.reviewHash && (fields.reviewHash || !wasCsvOnly)) changes.push("review");
      if (v.rewatch !== fields.rewatch) changes.push("rewatch");
      if (fields.date && v.date !== fields.date) changes.push("date");
      if (v.liked !== fields.liked) changes.push("liked");
      if (changes.length) {
        v.history.push({ at, rating: v.rating, reviewHash: v.reviewHash, date: v.date });
        if (v.history.length > 10) v.history.shift();
        v.rating = fields.rating;
        if (changes.includes("review")) setReview(v, it.review, it.spoilers);
        v.rewatch = fields.rewatch;
        v.liked = fields.liked;
        if (fields.date) v.date = fields.date;
        v.updatedAt = at;
        if (!wasCsvOnly && (changes.includes("rating") || changes.includes("review"))) {
          v.edited = true;
          c.edited.push({ title: film.title, year: film.year, changes });
        }
        c.updated++;
      } else {
        c.unchanged++;
      }
      if (!v.loggedAt) v.loggedAt = it.publishedAt;
      if (v.postedHour === null || v.postedHour === undefined) v.postedHour = it.postedHour;
      if (!v.uri) v.uri = it.link;
      addSource(v, "rss");
    }
    setFilmRating(film, it.rating, it.publishedAt);
    // Letterboxd drops a film from the watchlist once it's logged.
    if (db.watchlist[film.key]) delete db.watchlist[film.key];
  }
  if (c.added || c.updated || c.filmsAdded) db.updatedAt = at;
  return c;
}

/* ---------- Queries ---------- */

export function watchedTmdbIds(db) {
  const s = new Set();
  for (const f of Object.values(db.films)) if (f.tmdbId) s.add(f.tmdbId);
  return s;
}

export function watchlistTmdbIds(db) {
  const s = new Set();
  for (const w of Object.values(db.watchlist || {})) if (w.tmdbId) s.add(w.tmdbId);
  return s;
}

export function dbCounts(db) {
  return {
    films: Object.keys(db.films).length,
    viewings: db.viewings.length,
    reviews: db.viewings.filter((v) => v.review).length,
    rated: Object.values(db.films).filter((f) => f.rating !== null).length,
    watchlist: Object.keys(db.watchlist || {}).length,
    withTmdb: Object.values(db.films).filter((f) => f.tmdbId).length
  };
}
