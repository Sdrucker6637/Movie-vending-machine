/* =========================================================
   Free on YouTube? - availability checker
   ---------------------------------------------------------
   Answers one question for a movie: is it free to watch in
   YouTube's official Movies & TV catalog right now?

   Only the official catalog counts - user uploads, reviews,
   watch-alongs and clips are never considered. The data comes
   from TMDB's where-to-watch listings (sourced from JustWatch),
   which list YouTube's free-with-ads movies separately from its
   rentals and purchases. YouTube Premium and YouTube TV are
   different products and are ignored.

   This file has no DOM code; the UI lives in yt/panel.js. The
   TMDB request itself is supplied by index.html (setFetcher),
   which owns the TMDB key.
   ========================================================= */
(function (root) {
  "use strict";

  const CACHE_STORAGE = "yt-free-cache-v4"; // v4: official catalog only
  const CACHE_MAX = 300;
  const REGION = "US"; // matches the app's other where-to-watch info

  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;
  // Catalog listings change daily, so nothing is trusted for long.
  const TTL = {
    free_ads: 2 * DAY,
    free: 2 * DAY,
    rent: 2 * DAY,
    unavailable: 2 * DAY,
    error: 30 * 60 * 1000
  };

  const STATUS_TEXT = {
    free_ads: "Free with ads",
    free: "Free",
    rent: "Rent or buy only",
    unavailable: "Not on YouTube",
    error: "Couldn't check"
  };

  // "YouTube" (rent/buy) and "YouTube Free" (free with ads) are the
  // Movies & TV catalog. "YouTube Premium" / "YouTube TV" are not.
  function isYouTubeCatalog(name) {
    return /^youtube( free| movies.*)?$/i.test(String(name || "").trim());
  }

  function now() { return Date.now(); }

  function storage() {
    try { return root.localStorage || null; } catch (e) { return null; }
  }
  function readJson(key, fallback) {
    const ls = storage();
    if (!ls) return fallback;
    try {
      const raw = ls.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeJson(key, value) {
    const ls = storage();
    if (!ls) return;
    try { ls.setItem(key, JSON.stringify(value)); } catch (e) { /* full or blocked */ }
  }

  // YouTube search restricted to the "Movies" type, i.e. the official
  // Movies & TV catalog, where free titles are marked "Free with ads".
  function youtubeMoviesUrl(title, year) {
    const q = String(title || "") + (year ? " " + year : "");
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q) + "&sp=EgIQBA%253D%253D";
  }

  // Turns TMDB's watch/providers entry for one country into a status.
  // `region` = { link, free:[], ads:[], flatrate:[], rent:[], buy:[] }
  function classify(region) {
    if (!region) return { status: "unavailable" };
    const has = (list) => (list || []).some((p) => isYouTubeCatalog(p.provider_name));
    if (has(region.ads)) return { status: "free_ads" };
    if (has(region.free)) return { status: "free" };
    if (has(region.rent) || has(region.buy)) {
      return { status: "rent", rent: has(region.rent), buy: has(region.buy) };
    }
    return { status: "unavailable" };
  }

  let fetcher = null; // (movie) -> Promise<{ year, runtime, providers }>

  async function check(movie) {
    if (!fetcher) throw new Error("No data source");
    const facts = await fetcher(movie);
    if (!facts || !facts.providers) {
      return { status: "error", checkedAt: now(), error: (facts && facts.error) || "Couldn't reach TMDB", results: [] };
    }
    const region = facts.providers[REGION] || null;
    const c = classify(region);
    const year = movie.year || facts.year || null;
    const rec = {
      status: c.status,
      checkedAt: now(),
      source: "YouTube Movies & TV (via TMDB/JustWatch)",
      runtimeMin: facts.runtime || null,
      region: REGION,
      tmdbLink: region && region.link ? region.link : null,
      results: []
    };
    if (c.status !== "unavailable") {
      rec.results.push({
        url: youtubeMoviesUrl(movie.title, year),
        title: movie.title + (year ? " (" + year + ")" : ""),
        channel: "YouTube Movies & TV",
        durationSec: facts.runtime ? facts.runtime * 60 : 0,
        offer: c.status === "rent"
          ? (c.rent && c.buy ? "Rent or buy" : c.rent ? "Rent" : "Buy")
          : STATUS_TEXT[c.status]
      });
    }
    return rec;
  }

  function formatDuration(sec) {
    if (!sec) return "?";
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec % 3600) / 60);
    return h ? h + "h " + m + "m" : m + "m";
  }

  // ---------- cache & scheduling ----------

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function cacheKey(movie) {
    if (movie.id) return "tmdb:" + movie.id;
    return "t:" + norm(movie.title) + "|" + (movie.year || "");
  }

  function readCache() { return readJson(CACHE_STORAGE, {}); }

  function getCached(movie) {
    return readCache()[cacheKey(movie)] || null;
  }

  function isStale(rec) {
    if (!rec) return true;
    return now() - rec.checkedAt > (TTL[rec.status] || DAY);
  }

  function store(movie, rec) {
    const all = readCache();
    all[cacheKey(movie)] = { ...rec, title: movie.title, year: movie.year || null };
    const keys = Object.keys(all);
    if (keys.length > CACHE_MAX) {
      keys.sort((a, b) => all[a].checkedAt - all[b].checkedAt).slice(0, keys.length - CACHE_MAX).forEach((k) => delete all[k]);
    }
    writeJson(CACHE_STORAGE, all);
  }

  // Leftovers from the earlier upload-search version.
  (function cleanUp() {
    const ls = storage();
    if (!ls) return;
    ["yt-free-cache-v1", "yt-free-cache-v2", "yt-free-cache-v3", "yt-free-hidden-v1", "yt-free-instances-v1", "youtube-api-key"]
      .forEach((k) => { try { ls.removeItem(k); } catch (e) { /* ignore */ } });
  })();

  const listeners = new Set();
  const inflight = new Map();
  let queue = Promise.resolve();

  function emit(key, st) { listeners.forEach((fn) => { try { fn(key, st); } catch (e) { /* ignore */ } }); }

  function state(movie) {
    const key = cacheKey(movie);
    return { key, checking: inflight.has(key), record: getCached(movie) };
  }

  // Queues a check (one at a time). Returns the cached record without a
  // request when it's still fresh, unless `force` is set.
  function ensure(movie, opts) {
    opts = opts || {};
    if (!movie || !movie.title) return Promise.resolve(null);
    const key = cacheKey(movie);
    const cached = getCached(movie);
    if (!opts.force && cached && !isStale(cached)) return Promise.resolve(cached);
    if (inflight.has(key)) return inflight.get(key);
    const p = (queue = queue.catch(() => {}).then(async () => {
      let rec;
      try {
        rec = await check(movie);
      } catch (e) {
        rec = { status: "error", checkedAt: now(), error: String((e && e.message) || e), results: [] };
      }
      // A failed recheck never overwrites a good earlier answer; it just
      // gets retried sooner.
      if (rec.status === "error" && cached && cached.status !== "error") {
        rec = { ...cached, lastError: rec.error, checkedAt: Math.min(cached.checkedAt, now() - (TTL[cached.status] || DAY) + TTL.error) };
      }
      store(movie, rec);
      return rec;
    }).finally(() => {
      inflight.delete(key);
      emit(key, state(movie));
    }));
    inflight.set(key, p);
    emit(key, state(movie));
    return p;
  }

  const api = {
    STATUS_TEXT,
    _: { classify, isYouTubeCatalog, youtubeMoviesUrl, check },
    formatDuration,
    cacheKey,
    getCached,
    isStale,
    state,
    ensure,
    check,
    setFetcher(fn) { fetcher = fn; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };

  root.YTFree = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
