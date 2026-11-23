/* =========================================================
   Statistics over the viewing history. Pure functions: they
   take the database + TMDB metadata and never fetch anything.
   Genres, runtimes, credits, countries and languages come only
   from TMDB metadata - films without metadata are counted as
   "unknown" rather than guessed.
   ========================================================= */
import { mean, stdev, median, pearson, decadeOf } from "./util.js";

export const SHRINK_K = 3; // pseudo-films pulling small groups toward your average

export function buildLibrary(db, meta) {
  const metaById = meta || {};
  const byFilm = new Map();
  for (const v of db.viewings) {
    if (!byFilm.has(v.film)) byFilm.set(v.film, []);
    byFilm.get(v.film).push(v);
  }
  const films = Object.values(db.films).map((f) => {
    const vs = (byFilm.get(f.key) || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
    let rating = f.rating;
    if (rating === null || rating === undefined) {
      const rated = vs.filter((v) => v.rating !== null);
      rating = rated.length ? rated[rated.length - 1].rating : null;
    }
    const m = f.tmdbId ? metaById[f.tmdbId] || null : null;
    const year = f.year || (m && m.year) || null;
    return {
      key: f.key, title: f.title, year, tmdbId: f.tmdbId || null, slug: f.slug || null, uri: f.uri || null,
      rating, liked: !!f.liked || vs.some((v) => v.liked),
      viewings: vs, views: vs.length, reviews: vs.filter((v) => v.review),
      rewatches: vs.filter((v) => v.rewatch).length,
      firstDate: vs.find((v) => v.date) ? vs.find((v) => v.date).date : null,
      lastDate: vs.length ? vs[vs.length - 1].date : null,
      decade: decadeOf(year),
      meta: m,
      runtime: m ? m.runtime || null : null,
      genres: m ? m.genres : [],
      directors: m ? m.directors : [],
      cast: m ? m.cast : [],
      countries: m ? m.countries : [],
      language: m ? m.languageName || m.language : null,
      keywords: m ? m.keywords.map((k) => k.name) : []
    };
  });
  const filmByKey = new Map(films.map((f) => [f.key, f]));
  const viewings = db.viewings.map((v) => ({ ...v, f: filmByKey.get(v.film) })).filter((v) => v.f);
  const ratings = films.filter((f) => f.rating !== null).map((f) => f.rating);
  return {
    films, viewings, filmByKey,
    watchlist: Object.values(db.watchlist || {}),
    mean: mean(ratings), std: stdev(ratings), ratedCount: ratings.length
  };
}

/* ---------- Filters ---------- */

export function applyFilters(lib, filters) {
  const fl = filters || {};
  const year = fl.year ? Number(fl.year) : null;
  const decade = fl.decade ? Number(fl.decade) : null;
  const genre = fl.genre || null;
  const rating = fl.rating === undefined || fl.rating === null || fl.rating === "" ? null : fl.rating;
  const keepFilm = (f) => {
    if (decade !== null && f.decade !== decade) return false;
    if (genre && !f.genres.includes(genre)) return false;
    if (rating !== null) {
      if (rating === "unrated") { if (f.rating !== null) return false; }
      else if (f.rating !== Number(rating)) return false;
    }
    if (year !== null && !f.viewings.some((v) => v.date && Number(v.date.slice(0, 4)) === year)) return false;
    return true;
  };
  const films = lib.films.filter(keepFilm);
  const keys = new Set(films.map((f) => f.key));
  const viewings = lib.viewings.filter((v) => keys.has(v.film) && (year === null || (v.date && Number(v.date.slice(0, 4)) === year)));
  const ratings = films.filter((f) => f.rating !== null).map((f) => f.rating);
  return { ...lib, films, viewings, mean: lib.mean, filteredMean: mean(ratings), ratedCount: ratings.length, filters: fl };
}

export function filterOptions(lib) {
  const years = new Set(), decades = new Set(), genres = new Set();
  for (const f of lib.films) {
    if (f.decade) decades.add(f.decade);
    f.genres.forEach((g) => genres.add(g));
    for (const v of f.viewings) if (v.date) years.add(Number(v.date.slice(0, 4)));
  }
  return {
    years: [...years].sort((a, b) => b - a),
    decades: [...decades].sort((a, b) => a - b),
    genres: [...genres].sort(),
    ratings: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]
  };
}

/* ---------- Grouping ---------- */

// keysOf(film) -> [{ key, label }]; returns per-group rating stats.
export function groupStats(films, keysOf, baseMean, opts) {
  const k = opts && opts.k !== undefined ? opts.k : SHRINK_K;
  const groups = new Map();
  for (const f of films) {
    for (const g of keysOf(f) || []) {
      if (!g || g.key === null || g.key === undefined) continue;
      if (!groups.has(g.key)) groups.set(g.key, { key: g.key, label: g.label, id: g.id, films: [], ratings: [] });
      const grp = groups.get(g.key);
      grp.films.push(f.key);
      if (f.rating !== null) grp.ratings.push(f.rating);
    }
  }
  const mu = baseMean ?? 3;
  return [...groups.values()].map((g) => {
    const n = g.ratings.length;
    const sum = g.ratings.reduce((a, b) => a + b, 0);
    return {
      key: g.key, label: g.label, id: g.id, count: g.films.length, rated: n, films: g.films,
      avg: n ? sum / n : null,
      shrunk: (sum + k * mu) / (n + k),
      std: stdev(g.ratings),
      delta: n ? (sum + k * mu) / (n + k) - mu : 0
    };
  });
}

const by = (field, dir) => (a, b) => dir * ((a[field] ?? -Infinity) - (b[field] ?? -Infinity)) || (b.count - a.count) || String(a.label).localeCompare(String(b.label));

export const keyers = {
  genre: (f) => f.genres.map((g) => ({ key: g, label: g })),
  director: (f) => f.directors.map((d) => ({ key: d.id, label: d.name, id: d.id })),
  // Lead and supporting cast only - extras in long credit lists add noise.
  actor: (f) => f.cast.filter((c) => c.order === null || c.order < 8).map((c) => ({ key: c.id, label: c.name, id: c.id })),
  decade: (f) => (f.decade ? [{ key: f.decade, label: f.decade + "s" }] : []),
  country: (f) => f.countries.map((c) => ({ key: c, label: c })),
  language: (f) => (f.language ? [{ key: f.language, label: f.language }] : []),
  keyword: (f) => f.keywords.map((k) => ({ key: k, label: k })),
  runtimeBucket: (f) => (f.runtime ? [runtimeCategory(f.runtime)] : [])
};

export function runtimeCategory(min) {
  if (min < 90) return { key: "short", label: "Under 90 min" };
  if (min < 120) return { key: "standard", label: "90–119 min" };
  if (min < 150) return { key: "long", label: "120–149 min" };
  return { key: "epic", label: "150 min +" };
}

function ranked(list, minRated) {
  const eligible = list.filter((g) => g.rated >= minRated);
  return {
    mostWatched: [...list].sort(by("count", -1)),
    highest: [...eligible].sort(by("shrunk", -1)),
    lowest: [...eligible].sort(by("shrunk", 1)),
    all: list
  };
}

/* ---------- Sections ---------- */

export function overview(lib, now) {
  const today = now ? new Date(now) : new Date();
  const thisYear = today.getUTCFullYear();
  const films = lib.films;
  const ratings = films.filter((f) => f.rating !== null).map((f) => f.rating);
  const directors = new Set(), actors = new Set();
  for (const f of films) {
    f.directors.forEach((d) => directors.add(d.id));
    f.cast.forEach((c) => actors.add(c.id));
  }
  // Hours: every logged viewing counts; films marked watched without a diary
  // entry count once.
  let minutes = 0, missingRuntime = 0;
  for (const v of lib.viewings) { if (v.f.runtime) minutes += v.f.runtime; else missingRuntime++; }
  for (const f of films) if (!f.viewings.length) { if (f.runtime) minutes += f.runtime; else missingRuntime++; }
  const withMeta = films.filter((f) => f.meta).length;
  return {
    totalWatches: lib.viewings.length + films.filter((f) => !f.viewings.length).length,
    diaryEntries: lib.viewings.length,
    uniqueFilms: films.length,
    avgRating: mean(ratings),
    ratedFilms: ratings.length,
    reviews: lib.viewings.filter((v) => v.review).length,
    hours: minutes / 60,
    missingRuntime,
    thisYear: lib.viewings.filter((v) => v.date && Number(v.date.slice(0, 4)) === thisYear).length,
    thisYearLabel: thisYear,
    directors: directors.size,
    actors: actors.size,
    watchlist: lib.watchlist.length,
    likes: films.filter((f) => f.liked).length,
    metaCoverage: films.length ? withMeta / films.length : 0,
    withoutMeta: films.length - withMeta
  };
}

export function genreStats(lib) {
  const g = groupStats(lib.films, keyers.genre, lib.mean);
  const r = ranked(g, 3);
  const total = g.reduce((s, x) => s + x.count, 0);
  return { ...r, distribution: r.mostWatched.map((x) => ({ ...x, share: total ? x.count / total : 0 })) };
}

export function directorStats(lib) {
  const g = groupStats(lib.films, keyers.director, lib.mean);
  const r = ranked(g, 2);
  return { ...r, consistent: consistency(g, 3), explored: g.length };
}

export function actorStats(lib) {
  const g = groupStats(lib.films, keyers.actor, lib.mean);
  const r = ranked(g, 3);
  const mu = lib.mean ?? 3;
  // "Consistently enjoy": several rated films, above your average, low spread.
  const enjoy = g.filter((x) => x.rated >= 3 && x.avg >= mu + 0.3 && (x.std === null || x.std <= 0.75))
    .sort((a, b) => b.shrunk - a.shrunk || b.rated - a.rated);
  return { ...r, consistent: consistency(g, 3), enjoy };
}

export function consistency(groups, minRated) {
  return groups.filter((x) => x.rated >= minRated && x.std !== null)
    .sort((a, b) => a.std - b.std || b.rated - a.rated);
}

export function runtimeStats(lib) {
  const timed = lib.films.filter((f) => f.runtime);
  const rts = timed.map((f) => f.runtime);
  const buckets = [];
  for (let lo = 60; lo < 200; lo += 10) buckets.push({ key: lo, label: lo === 60 ? "<70" : lo >= 190 ? "190+" : `${lo}s`, lo: lo === 60 ? 0 : lo, hi: lo >= 190 ? Infinity : lo + 10, count: 0, films: [] });
  for (const f of timed) {
    const b = buckets.find((x) => f.runtime >= x.lo && f.runtime < x.hi);
    if (b) { b.count++; b.films.push(f.key); }
  }
  const sorted = [...timed].sort((a, b) => a.runtime - b.runtime);
  const cats = groupStats(timed, keyers.runtimeBucket, lib.mean, { k: 0 });
  const order = ["short", "standard", "long", "epic"];
  cats.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
  const rated = timed.filter((f) => f.rating !== null);
  const r = pearson(rated.map((f) => f.runtime), rated.map((f) => f.rating));
  let tendency = "not enough rated films with runtimes yet";
  if (r !== null && rated.length >= 10) {
    if (Math.abs(r) < 0.1) tendency = "Runtime makes almost no difference to how you rate a film";
    else if (r > 0) tendency = `You tend to rate longer films higher (correlation ${r.toFixed(2)})`;
    else tendency = `You tend to rate shorter films higher (correlation ${r.toFixed(2)})`;
  }
  return {
    average: mean(rts), median: median(rts), count: timed.length, missing: lib.films.length - timed.length,
    histogram: buckets.filter((b, i) => b.count || (i > 0 && i < buckets.length - 1)),
    shortest: sorted.slice(0, 5), longest: sorted.slice(-5).reverse(),
    byCategory: cats, correlation: r, tendency
  };
}

export function timeStats(lib) {
  const byMonth = new Map(), byYear = new Map(), byMonthOfYear = new Array(12).fill(0), byWeekday = new Array(7).fill(0);
  for (const v of lib.viewings) {
    if (!v.date) continue;
    const ym = v.date.slice(0, 7), y = Number(v.date.slice(0, 4));
    if (!byMonth.has(ym)) byMonth.set(ym, []);
    byMonth.get(ym).push(v.film);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(v.film);
    byMonthOfYear[Number(v.date.slice(5, 7)) - 1]++;
    byWeekday[new Date(v.date + "T12:00:00Z").getUTCDay()]++;
  }
  const months = [...byMonth.entries()].map(([k, fl]) => ({ key: k, label: k, count: fl.length, films: fl })).sort((a, b) => a.key.localeCompare(b.key));
  // Fill gaps so the timeline doesn't hide quiet months.
  const filled = [];
  if (months.length) {
    let [y, m] = months[0].key.split("-").map(Number);
    const [ey, em] = months[months.length - 1].key.split("-").map(Number);
    const idx = new Map(months.map((x) => [x.key, x]));
    while (y < ey || (y === ey && m <= em)) {
      const key = `${y}-${String(m).padStart(2, "0")}`;
      filled.push(idx.get(key) || { key, label: key, count: 0, films: [] });
      m++; if (m > 12) { m = 1; y++; }
    }
  }
  const undated = lib.viewings.filter((v) => !v.date).length;
  return {
    months: filled,
    years: [...byYear.entries()].map(([k, fl]) => ({ key: k, label: String(k), count: fl.length, films: fl })).sort((a, b) => a.key - b.key),
    busiestMonths: [...months].sort((a, b) => b.count - a.count || b.key.localeCompare(a.key)).slice(0, 5),
    monthOfYear: byMonthOfYear, weekday: byWeekday, undated
  };
}

export function decadeStats(lib) {
  return groupStats(lib.films, keyers.decade, lib.mean).sort((a, b) => a.key - b.key);
}

export function worldStats(lib) {
  const countries = groupStats(lib.films, keyers.country, lib.mean).sort(by("count", -1));
  const languages = groupStats(lib.films, keyers.language, lib.mean).sort(by("count", -1));
  return { countries, languages };
}

export function rewatchStats(lib) {
  let first = 0, re = 0;
  const reFilms = new Map();
  for (const v of lib.viewings) {
    if (v.rewatch) { re++; reFilms.set(v.film, (reFilms.get(v.film) || 0) + 1); } else first++;
  }
  const mostRewatched = lib.films.filter((f) => f.views > 1 || reFilms.has(f.key))
    .map((f) => ({ ...f, times: f.views }))
    .sort((a, b) => b.times - a.times).slice(0, 10);
  return { firstTime: first, rewatches: re, mostRewatched };
}

export function ratingDistribution(lib) {
  const steps = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const d = steps.map((s) => ({ key: s, label: String(s), count: 0, films: [] }));
  let unrated = 0;
  for (const f of lib.films) {
    if (f.rating === null) { unrated++; continue; }
    const b = d.find((x) => x.key === f.rating);
    if (b) { b.count++; b.films.push(f.key); }
  }
  return { buckets: d, unrated, mean: mean(lib.films.filter((f) => f.rating !== null).map((f) => f.rating)), median: median(lib.films.filter((f) => f.rating !== null).map((f) => f.rating)) };
}

export function topBottom(lib, n) {
  const rated = lib.films.filter((f) => f.rating !== null);
  const tieBreak = (a, b) => (b.liked - a.liked) || ((b.meta?.voteAverage ?? 0) - (a.meta?.voteAverage ?? 0));
  return {
    highest: [...rated].sort((a, b) => b.rating - a.rating || tieBreak(a, b)).slice(0, n || 12),
    lowest: [...rated].sort((a, b) => a.rating - b.rating || -tieBreak(a, b)).slice(0, n || 12)
  };
}

// Films where your rating differs most from TMDB's crowd (on a 5-point scale).
export function contrarian(lib, n) {
  const rows = lib.films.filter((f) => f.rating !== null && f.meta && f.meta.voteCount >= 50 && f.meta.voteAverage)
    .map((f) => ({ ...f, crowd: f.meta.voteAverage / 2, gap: f.rating - f.meta.voteAverage / 2 }));
  return {
    above: [...rows].sort((a, b) => b.gap - a.gap).slice(0, n || 8),
    below: [...rows].sort((a, b) => a.gap - b.gap).slice(0, n || 8),
    agreement: pearson(rows.map((r) => r.rating), rows.map((r) => r.crowd))
  };
}

export function filmsFor(lib, keys) {
  return keys.map((k) => lib.filmByKey.get(k)).filter(Boolean);
}
