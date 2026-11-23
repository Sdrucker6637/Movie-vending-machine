/* TMDB metadata, slimmed to what My Cinema uses. Shared by the sync job
   (which writes meta.json) and the browser (which reads it). */

export const POSTER_BASE = "https://image.tmdb.org/t/p/";

export const TMDB_GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama",
  10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};
export const GENRE_IDS = Object.fromEntries(Object.entries(TMDB_GENRES).map(([id, n]) => [n, Number(id)]));

// detail = /movie/{id}?append_to_response=credits,keywords
export function slimMovie(detail, fetchedAt) {
  const d = detail || {};
  const credits = d.credits || {};
  const year = d.release_date ? Number(d.release_date.slice(0, 4)) : null;
  const spoken = (d.spoken_languages || []).map((l) => l.english_name || l.name).filter(Boolean);
  const origLang = d.original_language || null;
  const origName = (d.spoken_languages || []).find((l) => l.iso_639_1 === origLang);
  return {
    id: d.id,
    title: d.title || d.original_title || "",
    originalTitle: d.original_title && d.original_title !== d.title ? d.original_title : null,
    year,
    releaseDate: d.release_date || null,
    runtime: d.runtime || null,
    genres: (d.genres || []).map((g) => g.name),
    directors: (credits.crew || []).filter((p) => p.job === "Director").map((p) => ({ id: p.id, name: p.name })),
    writers: (credits.crew || []).filter((p) => p.department === "Writing").slice(0, 4).map((p) => ({ id: p.id, name: p.name })),
    cast: (credits.cast || []).filter((p) => p.order === undefined || p.order < 12).slice(0, 12).map((p) => ({ id: p.id, name: p.name, order: p.order ?? null })),
    countries: (d.production_countries || []).map((c) => c.name),
    language: origLang,
    languageName: origName ? (origName.english_name || origName.name) : null,
    spokenLanguages: spoken,
    keywords: ((d.keywords && (d.keywords.keywords || d.keywords.results)) || []).slice(0, 30).map((k) => ({ id: k.id, name: k.name })),
    voteAverage: d.vote_average ?? null,
    voteCount: d.vote_count ?? null,
    popularity: d.popularity ?? null,
    poster: d.poster_path || null,
    overview: d.overview ? (d.overview.length > 320 ? d.overview.slice(0, 317).trimEnd() + "…" : d.overview) : null,
    imdbId: d.imdb_id || null,
    collection: d.belongs_to_collection ? d.belongs_to_collection.name : null,
    fetchedAt: fetchedAt || new Date().toISOString()
  };
}

export function posterUrl(m, size) {
  return m && m.poster ? POSTER_BASE + (size || "w342") + m.poster : null;
}

// Picks the best TMDB search result for a Letterboxd title/year.
export function pickSearchResult(results, title, year) {
  const list = (results || []).filter((r) => r && r.id);
  if (!list.length) return null;
  const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
  const yr = (r) => (r.release_date ? Number(r.release_date.slice(0, 4)) : null);
  const scored = list.map((r, i) => {
    let s = 0;
    if (norm(r.title) === norm(title) || norm(r.original_title) === norm(title)) s += 4;
    const y = yr(r);
    if (year && y) {
      const dy = Math.abs(y - year);
      s += dy === 0 ? 4 : dy === 1 ? 2.5 : dy <= 3 ? 0.5 : -3;
    }
    s += Math.min(2, Math.log10((r.vote_count || 0) + 1) / 2);
    s -= i * 0.15;
    return { r, s };
  }).sort((a, b) => b.s - a.s);
  const best = scored[0];
  // Reject weak guesses rather than attaching wrong metadata.
  if (year && best.r.release_date && Math.abs(yr(best.r) - year) > 3) return null;
  return best.s >= 3 ? best.r : null;
}
