/* TMDB client for the sync job: polite rate limit, retries with backoff,
   a per-run request budget, and v3-key or v4-token auth from the
   environment (never from the repository). */

const BASE = "https://api.themoviedb.org/3";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class TmdbBudgetExceeded extends Error {}

export function createTmdb(opts) {
  const o = opts || {};
  const apiKey = o.apiKey || process.env.TMDB_API_KEY || "";
  const token = o.token || process.env.TMDB_READ_TOKEN || "";
  const fetchImpl = o.fetch || globalThis.fetch;
  let budget = o.budget ?? Number(process.env.TMDB_BUDGET || 2500);
  const minGap = o.minGapMs ?? 90; // ~11 requests a second, well under TMDB's limit
  let last = 0;
  let used = 0;

  async function get(path, params) {
    if (!apiKey && !token) throw new Error("No TMDB credentials (set the TMDB_API_KEY or TMDB_READ_TOKEN secret)");
    if (budget <= 0) throw new TmdbBudgetExceeded("TMDB request budget for this run is used up");
    const url = new URL(BASE + path);
    for (const [k, v] of Object.entries(params || {})) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    if (!token) url.searchParams.set("api_key", apiKey);
    const headers = { Accept: "application/json" };
    if (token) headers.Authorization = "Bearer " + token;
    for (let attempt = 0; attempt < 4; attempt++) {
      const wait = last + minGap - Date.now();
      if (wait > 0) await sleep(wait);
      last = Date.now();
      budget--; used++;
      let res;
      try {
        res = await fetchImpl(url, { headers, signal: AbortSignal.timeout(20000) });
      } catch (e) {
        if (attempt === 3) throw e;
        await sleep(1000 * 2 ** attempt);
        continue;
      }
      if (res.status === 404) return null;
      if (res.status === 401) throw new Error("TMDB rejected the credentials (401)");
      if (res.status === 429 || res.status >= 500) {
        const ra = Number(res.headers.get("retry-after")) || 2 ** attempt;
        if (attempt === 3) throw new Error(`TMDB ${res.status} after retries`);
        await sleep(ra * 1000);
        continue;
      }
      if (!res.ok) throw new Error(`TMDB ${res.status} for ${path}`);
      return res.json();
    }
    return null;
  }

  return {
    get,
    get used() { return used; },
    get remaining() { return budget; },
    hasCredentials: !!(apiKey || token),
    movie: (id) => get(`/movie/${id}`, { append_to_response: "credits,keywords", language: "en-US" }),
    searchMovie: (query, year) => get("/search/movie", { query, year: year || undefined, include_adult: "false", language: "en-US" }),
    recommendations: (id) => get(`/movie/${id}/recommendations`, { page: 1, language: "en-US" }),
    personCredits: (id) => get(`/person/${id}/movie_credits`, { language: "en-US" }),
    discover: (params) => get("/discover/movie", { include_adult: "false", language: "en-US", ...params })
  };
}
