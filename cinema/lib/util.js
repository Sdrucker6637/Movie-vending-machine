/* Small helpers shared by every My Cinema module (browser + Node). */

// Letterboxd titles come from the same database in the CSV export and the
// RSS feed, so a normalised "title|year" pair identifies a film across both.
export function normTitle(s) {
  return String(s || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function filmKey(title, year) {
  return normTitle(title) + "|" + (year ? String(year) : "");
}

export function toNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// Letterboxd ratings are 0.5-5 in half steps. Anything else is "no rating".
export function toRating(v) {
  const n = toNumber(v);
  if (n === null || n <= 0 || n > 5) return null;
  return Math.round(n * 2) / 2;
}

export function toYesNo(v) {
  return /^(yes|true|1)$/i.test(String(v || "").trim());
}

export function isoDate(v) {
  const s = String(v || "").trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export function mean(arr) {
  if (!arr.length) return null;
  let s = 0;
  for (const x of arr) s += x;
  return s / arr.length;
}

export function stdev(arr) {
  if (arr.length < 2) return null;
  const m = mean(arr);
  let s = 0;
  for (const x of arr) s += (x - m) * (x - m);
  return Math.sqrt(s / (arr.length - 1));
}

export function median(arr) {
  if (!arr.length) return null;
  const a = [...arr].sort((x, y) => x - y);
  const mid = a.length >> 1;
  return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export function pearson(xs, ys) {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  const mx = mean(xs), my = mean(ys);
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  if (!dx || !dy) return null;
  return num / Math.sqrt(dx * dy);
}

// Small, stable string hash (FNV-1a) used to notice edited review text.
export function hash(str) {
  let h = 0x811c9dc5;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export function decadeOf(year) {
  const y = toNumber(year);
  return y ? Math.floor(y / 10) * 10 : null;
}

export function stars(r) {
  if (r === null || r === undefined) return "unrated";
  const full = Math.floor(r);
  return "★".repeat(full) + (r % 1 ? "½" : "");
}

export function plural(n, one, many) {
  return `${n.toLocaleString("en-US")} ${n === 1 ? one : (many || one + "s")}`;
}

export function letterboxdFilmUrl(film) {
  if (film && film.slug) return `https://letterboxd.com/film/${film.slug}/`;
  if (film && film.tmdbId) return `https://letterboxd.com/tmdb/${film.tmdbId}/`;
  if (film && film.uri) return film.uri;
  return null;
}

// Deterministic PRNG so "random" picks can be reproduced in tests.
export function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}
