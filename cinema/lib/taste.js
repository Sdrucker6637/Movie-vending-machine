/* =========================================================
   Taste profile.
   ---------------------------------------------------------
   Preference is measured from ratings, not from how often a
   kind of film turns up: every feature (genre, keyword,
   director, actor, decade, ...) gets an *affinity* - the
   shrunk average of (your rating - your overall average) over
   the rated films that have it. Lots of dramas rated 3★ by
   someone who averages 3.5★ is a negative affinity, however
   many dramas they log.

   Written reviews add evidence: lexicons of emotional /
   comedic / character / plot / formal language, and the words
   that separate your raves from your pans.
   ========================================================= */
import { mean, pearson, stdev } from "./util.js";
import { groupStats, keyers, runtimeStats } from "./stats.js";

export const FAMILIES = ["genre", "keyword", "director", "actor", "decade", "country", "language", "runtimeBucket"];

// extraRated: [{ film-like row with rating }] - recommendation feedback,
// counted as half-weight evidence.
export function affinities(lib, opts) {
  const o = opts || {};
  const rated = lib.films.filter((f) => f.rating !== null);
  const extra = o.extraRated || [];
  const mu = lib.mean ?? 3;
  const out = {};
  for (const fam of FAMILIES) {
    const groups = groupStats(rated.concat(extra), keyers[fam], mu, { k: fam === "keyword" ? 4 : 3 });
    const map = new Map();
    for (const g of groups) map.set(g.key, g);
    out[fam] = map;
  }
  out.mean = mu;
  out.std = lib.std || 0.8;
  return out;
}

/* ---------- Lexicons ---------- */

export const LEX = {
  emotional: {
    genres: ["Drama", "Romance", "War"],
    keywords: ["grief", "loss", "tragedy", "melancholy", "loneliness", "coming of age", "death of mother", "death of father", "terminal illness", "love", "heartbreak", "family relationships", "father son relationship", "mother daughter relationship", "friendship", "memory"],
    words: ["moving", "heartbreaking", "heartbreak", "tears", "cried", "cry", "crying", "devastating", "devastated", "emotional", "touching", "tender", "beautiful", "sad", "gutting", "sob", "wept", "poignant", "bittersweet", "heartfelt", "aching", "melancholy", "grief"]
  },
  comedic: {
    genres: ["Comedy"],
    keywords: ["satire", "parody", "slapstick", "dark comedy", "black comedy", "spoof", "absurd humor", "screwball comedy", "buddy comedy", "mockumentary"],
    words: ["hilarious", "funny", "funniest", "laugh", "laughed", "laughing", "lol", "lmao", "jokes", "joke", "comedy", "comedic", "witty", "gags", "gag", "silly", "goofy", "chuckle", "giggle", "humor", "humour"]
  },
  character: {
    genres: [],
    keywords: ["character study", "relationship", "family relationships", "loneliness", "friendship", "slice of life", "biography", "coming of age", "marriage", "dysfunctional family"],
    words: ["character", "characters", "performance", "performances", "acting", "actor", "actress", "portrait", "relationship", "relationships", "chemistry", "study", "human", "humanity", "people", "intimate", "nuanced", "lived-in"]
  },
  plot: {
    genres: ["Thriller", "Mystery", "Action", "Crime", "Adventure"],
    keywords: ["twist ending", "plot twist", "heist", "whodunit", "conspiracy", "investigation", "chase", "race against time", "murder mystery", "time travel", "nonlinear timeline", "puzzle"],
    words: ["plot", "twist", "twists", "story", "storyline", "pacing", "paced", "premise", "ending", "structure", "mystery", "suspense", "tense", "thrilling", "reveal", "narrative", "setup", "payoff"]
  },
  experimental: {
    genres: [],
    keywords: ["surrealism", "surreal", "experimental", "avant-garde", "nonlinear timeline", "dream", "absurdism", "art house", "dreamlike", "metafiction", "breaking the fourth wall", "psychedelic", "existentialism", "black and white", "silent film", "no dialogue", "found footage", "one take"],
    words: ["weird", "strange", "surreal", "experimental", "dreamlike", "bizarre", "abstract", "unconventional", "trippy", "hypnotic", "avant", "arthouse", "art-house", "fever", "baffling", "ambitious", "formal", "form"]
  },
  craft: {
    words: ["cinematography", "shot", "shots", "framing", "visual", "visuals", "gorgeous", "lighting", "colour", "color", "editing", "score", "soundtrack", "music", "sound", "production", "design", "costumes", "camera", "direction", "directing", "script", "writing", "dialogue"]
  }
};

const STOP = new Set("a an and the of to in is it that this was for on with as at by be are or but not have has had i me my you your he she they them his her its we our just so very really too all any more most some much what which who when where how than then there their from into out up down over about also only even one two can could would should will well like get got been being film films movie movies watch watched watching see seen time no yes do does did dont didnt im its it's i'm don't didn't isn't wasn't thats that's there's theres way still never ever thing things make makes made lot bit something nothing everything quite pretty enough".split(" "));

export function tokenize(text) {
  return String(text || "").toLowerCase().replace(/[’']/g, "'").match(/[a-z][a-z'-]{1,}/g) || [];
}

function markerHit(f, lex) {
  if (!lex) return false;
  if (lex.genres && lex.genres.some((g) => f.genres.includes(g))) return true;
  if (lex.keywords && f.keywords.some((k) => lex.keywords.includes(k))) return true;
  if (lex.words) {
    const words = new Set(f.reviews.flatMap((v) => tokenize(v.review)));
    if (lex.words.some((w) => words.has(w))) return true;
  }
  return false;
}

function axis(lib, aLex, bLex, k) {
  const mu = lib.mean ?? 3;
  const rated = lib.films.filter((f) => f.rating !== null);
  const A = rated.filter((f) => markerHit(f, aLex));
  const B = rated.filter((f) => markerHit(f, bLex));
  const shrunk = (arr) => (arr.reduce((s, f) => s + f.rating, 0) + (k || 4) * mu) / (arr.length + (k || 4)) - mu;
  const dA = shrunk(A), dB = shrunk(B);
  const pos = Math.max(-1, Math.min(1, (dA - dB) / 0.8));
  const top = (arr) => [...arr].sort((x, y) => y.rating - x.rating || y.liked - x.liked).slice(0, 3);
  return { a: { n: A.length, delta: dA, avg: mean(A.map((f) => f.rating)), examples: top(A) }, b: { n: B.length, delta: dB, avg: mean(B.map((f) => f.rating)), examples: top(B) }, position: pos, enough: A.length >= 4 && B.length >= 4 };
}

function experimentalAxis(lib) {
  const mu = lib.mean ?? 3;
  const rated = lib.films.filter((f) => f.rating !== null);
  const isExp = (f) => markerHit(f, LEX.experimental) || (f.meta && f.meta.voteCount !== null && f.meta.voteCount < 300 && f.language && f.language !== "English");
  const A = rated.filter(isExp), B = rated.filter((f) => !isExp(f));
  const sh = (arr) => (arr.reduce((s, f) => s + f.rating, 0) + 4 * mu) / (arr.length + 4) - mu;
  const dA = sh(A), dB = sh(B);
  return { a: { n: A.length, delta: dA, avg: mean(A.map((f) => f.rating)), examples: [...A].sort((x, y) => y.rating - x.rating).slice(0, 3) }, b: { n: B.length, delta: dB, avg: mean(B.map((f) => f.rating)) }, position: Math.max(-1, Math.min(1, (dA - dB) / 0.8)), enough: A.length >= 3 };
}

/* ---------- Review language ---------- */

// Log-odds ratio with an informative Dirichlet prior (Monroe et al. 2008):
// words that separate reviews of films you rated above vs below average.
export function reviewWords(lib) {
  const mu = lib.mean ?? 3;
  const hi = new Map(), lo = new Map(), all = new Map();
  let nHi = 0, nLo = 0, reviewsHi = 0, reviewsLo = 0;
  for (const f of lib.films) {
    if (f.rating === null) continue;
    for (const v of f.reviews) {
      const toks = tokenize(v.review).filter((t) => !STOP.has(t) && t.length > 2);
      const uniq = new Set(toks);
      const target = f.rating >= mu + 0.5 ? hi : f.rating <= mu - 0.5 ? lo : null;
      if (!target) continue;
      if (target === hi) reviewsHi++; else reviewsLo++;
      for (const t of uniq) {
        target.set(t, (target.get(t) || 0) + 1);
        all.set(t, (all.get(t) || 0) + 1);
        if (target === hi) nHi++; else nLo++;
      }
    }
  }
  const a0 = [...all.values()].reduce((s, x) => s + x, 0) || 1;
  const alpha = 10;
  const rows = [];
  for (const [w, cAll] of all) {
    if (cAll < 3) continue;
    const ai = alpha * cAll / a0;
    const yh = hi.get(w) || 0, yl = lo.get(w) || 0;
    const lh = Math.log((yh + ai) / (nHi + alpha - yh - ai));
    const ll = Math.log((yl + ai) / (nLo + alpha - yl - ai));
    const z = (lh - ll) / Math.sqrt(1 / (yh + ai) + 1 / (yl + ai));
    rows.push({ word: w, hi: yh, lo: yl, z });
  }
  rows.sort((a, b) => b.z - a.z);
  return {
    raves: rows.filter((r) => r.z > 1 && r.hi >= 2).slice(0, 12),
    pans: rows.filter((r) => r.z < -1 && r.lo >= 2).reverse().slice(0, 12),
    reviewsHi, reviewsLo
  };
}

// What you write about, and how you rate films when you mention it.
export function reviewFocus(lib) {
  const topics = {
    "Performances": ["performance", "performances", "acting", "actor", "actress", "cast"],
    "Visuals": ["cinematography", "visual", "visuals", "shot", "shots", "gorgeous", "lighting", "framing", "camera", "colour", "color"],
    "Music & sound": ["score", "soundtrack", "music", "sound", "song", "songs"],
    "Writing": ["script", "writing", "dialogue", "screenplay", "written"],
    "Pacing": ["pacing", "paced", "slow", "long", "drags", "dragged", "boring"],
    "The ending": ["ending", "finale", "climax", "conclusion"],
    "Laughs": LEX.comedic.words,
    "Feelings": LEX.emotional.words
  };
  const out = [];
  for (const [topic, words] of Object.entries(topics)) {
    const ws = new Set(words);
    const hits = lib.films.filter((f) => f.reviews.some((v) => tokenize(v.review).some((t) => ws.has(t))));
    const rated = hits.filter((f) => f.rating !== null);
    out.push({ topic, count: hits.length, avg: mean(rated.map((f) => f.rating)), examples: [...rated].sort((a, b) => b.rating - a.rating).slice(0, 3) });
  }
  return out.filter((t) => t.count > 0).sort((a, b) => b.count - a.count);
}

/* ---------- Profile ---------- */

const GENRE_NOUN = {
  Drama: "Dramatist", Comedy: "Jester", Horror: "Night Owl", Thriller: "Nail-Biter", Crime: "Gumshoe", "Science Fiction": "Stargazer",
  Fantasy: "Dreamer", Animation: "Inkwell Devotee", Romance: "Romantic", Documentary: "Truth-Seeker", Mystery: "Detective",
  Western: "Drifter", War: "Old Soldier", History: "Historian", Music: "Bandleader", Action: "Stunt Double", Adventure: "Explorer",
  Family: "Matinee Kid", "TV Movie": "Late-Show Lodger"
};

function topAffinities(map, minN, n, dir) {
  return [...map.values()].filter((g) => g.rated >= minN && (dir > 0 ? g.delta > 0.05 : g.delta < -0.05))
    .sort((a, b) => dir * (b.delta - a.delta) || b.rated - a.rated).slice(0, n);
}

function examplesFor(lib, group, n) {
  const keys = new Set(group.films);
  return lib.films.filter((f) => keys.has(f.key) && f.rating !== null).sort((a, b) => b.rating - a.rating || b.liked - a.liked).slice(0, n || 3);
}
function worstFor(lib, group, n) {
  const keys = new Set(group.films);
  return lib.films.filter((f) => keys.has(f.key) && f.rating !== null).sort((a, b) => a.rating - b.rating).slice(0, n || 3);
}

export const MIN_RATED_FOR_PROFILE = 10;

export function tasteProfile(lib) {
  const rated = lib.films.filter((f) => f.rating !== null);
  if (rated.length < MIN_RATED_FOR_PROFILE) return { enough: false, rated: rated.length, needed: MIN_RATED_FOR_PROFILE };
  const aff = affinities(lib);
  const mu = aff.mean;
  const genresLoved = topAffinities(aff.genre, 3, 5, 1);
  const genresCold = topAffinities(aff.genre, 3, 4, -1);
  const genresFrequent = [...aff.genre.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  const subgenres = topAffinities(aff.keyword, 3, 10, 1);
  const themesCold = topAffinities(aff.keyword, 3, 6, -1);
  const directors = topAffinities(aff.director, 2, 6, 1);
  const actors = topAffinities(aff.actor, 3, 6, 1);
  const decades = [...aff.decade.values()].filter((d) => d.rated >= 2).sort((a, b) => a.key - b.key);
  const countries = topAffinities(aff.country, 3, 5, 1);

  const axes = {
    emotionalComedic: axis(lib, LEX.emotional, LEX.comedic),
    characterPlot: axis(lib, LEX.character, LEX.plot),
    experimental: experimentalAxis(lib)
  };

  // High vs low: what separates the films you love from the ones you don't.
  const sd = lib.std || 0.8;
  const hi = rated.filter((f) => f.rating >= Math.max(4, mu + sd * 0.75));
  const lo = rated.filter((f) => f.rating <= Math.min(2.5, mu - sd * 0.75));
  const avgOf = (arr, fn) => mean(arr.map(fn).filter((x) => x !== null && x !== undefined));
  const contrast = {
    hiCount: hi.length, loCount: lo.length,
    year: { hi: avgOf(hi, (f) => f.year), lo: avgOf(lo, (f) => f.year) },
    runtime: { hi: avgOf(hi, (f) => f.runtime), lo: avgOf(lo, (f) => f.runtime) },
    crowd: { hi: avgOf(hi, (f) => (f.meta ? f.meta.voteAverage : null)), lo: avgOf(lo, (f) => (f.meta ? f.meta.voteAverage : null)) },
    foreign: { hi: hi.length ? hi.filter((f) => f.language && f.language !== "English").length / hi.length : null, lo: lo.length ? lo.filter((f) => f.language && f.language !== "English").length / lo.length : null },
    popularity: { hi: avgOf(hi, (f) => (f.meta ? f.meta.voteCount : null)), lo: avgOf(lo, (f) => (f.meta ? f.meta.voteCount : null)) }
  };
  const crowdRows = rated.filter((f) => f.meta && f.meta.voteAverage && f.meta.voteCount >= 50);
  const crowdAgreement = pearson(crowdRows.map((f) => f.rating), crowdRows.map((f) => f.meta.voteAverage));
  const runtime = runtimeStats(lib);
  const words = reviewWords(lib);
  const focus = reviewFocus(lib);

  // Decade lean: rating-weighted average release year vs plain average.
  const years = rated.filter((f) => f.year);
  const avgYear = mean(years.map((f) => f.year));
  const lovedYear = mean(years.filter((f) => f.rating >= mu + 0.5).map((f) => f.year));

  // Archetype name: strongest leaning + best-loved genre. It changes as
  // the ratings do.
  const leans = [];
  const ec = axes.emotionalComedic, cp = axes.characterPlot, ex = axes.experimental;
  if (ec.enough) leans.push({ w: Math.abs(ec.position), adj: ec.position > 0 ? "Tender-Hearted" : "Wisecracking" });
  if (cp.enough) leans.push({ w: Math.abs(cp.position) * 0.9, adj: cp.position > 0 ? "People-Watching" : "Puzzle-Solving" });
  if (ex.enough) leans.push({ w: Math.abs(ex.position), adj: ex.position > 0 ? "Avant-Garde" : "Straight-Shooting" });
  if (avgYear && lovedYear) leans.push({ w: Math.min(1, Math.abs(lovedYear - avgYear) / 12), adj: lovedYear < avgYear ? "Silver-Screen" : "New-Fangled" });
  if (crowdAgreement !== null) leans.push({ w: crowdAgreement < 0.3 ? 0.6 : 0.2, adj: crowdAgreement < 0.3 ? "Contrarian" : "Crowd-Pleasing" });
  leans.sort((a, b) => b.w - a.w);
  const topGenre = genresLoved[0] || genresFrequent[0];
  const archetype = `The ${leans[0] ? leans[0].adj + " " : ""}${topGenre ? GENRE_NOUN[topGenre.key] || "Moviegoer" : "Moviegoer"}`;

  const notes = [];
  const fmt = (x) => (x === null || x === undefined ? "–" : x.toFixed(1));
  const ex3 = (arr) => arr.map((f) => `${f.title} (${f.rating}★)`).join(", ");

  // 1. frequency is not preference
  const mostCommon = genresFrequent[0];
  if (mostCommon && genresLoved[0] && mostCommon.key !== genresLoved[0].key) {
    notes.push({
      kind: "frequency",
      text: `${mostCommon.label} is what you watch most (${mostCommon.count} films, averaging ${fmt(mostCommon.avg)}★), but ${genresLoved[0].label} is what you rate best: ${fmt(genresLoved[0].avg)}★ across ${genresLoved[0].rated} rated films.`,
      examples: examplesFor(lib, genresLoved[0], 3)
    });
  } else if (genresLoved[0]) {
    notes.push({ kind: "genre", text: `${genresLoved[0].label} is both a habit and a love: ${genresLoved[0].count} films at ${fmt(genresLoved[0].avg)}★ on average.`, examples: examplesFor(lib, genresLoved[0], 3) });
  }
  if (genresCold[0]) notes.push({ kind: "cold", text: `${genresCold[0].label} rarely wins you over: ${fmt(genresCold[0].avg)}★ across ${genresCold[0].rated} rated films, below your ${fmt(mu)}★ average.`, examples: worstFor(lib, genresCold[0], 3) });
  if (directors[0]) notes.push({ kind: "director", text: `You trust ${directors[0].label}: ${directors[0].rated} films rated, averaging ${fmt(directors[0].avg)}★.`, examples: examplesFor(lib, directors[0], 3) });
  if (subgenres.length) notes.push({ kind: "themes", text: `Themes that light you up: ${subgenres.slice(0, 4).map((s) => `“${s.label}” (${fmt(s.avg)}★ over ${s.rated})`).join(", ")}.`, examples: examplesFor(lib, subgenres[0], 3) });
  if (ec.enough) {
    const side = ec.position > 0.15 ? "emotional" : ec.position < -0.15 ? "comedic" : null;
    notes.push({ kind: "axis", text: side === "emotional" ? `You reward films that hit the heart: emotional stories average ${fmt(ec.a.avg)}★ vs ${fmt(ec.b.avg)}★ for comedies.` : side === "comedic" ? `A good laugh beats a good cry: comedic films average ${fmt(ec.b.avg)}★ vs ${fmt(ec.a.avg)}★ for weepies.` : `You're even-handed between tears (${fmt(ec.a.avg)}★) and laughs (${fmt(ec.b.avg)}★).`, examples: side === "comedic" ? ec.b.examples : ec.a.examples });
  }
  if (contrast.hiCount >= 3 && contrast.loCount >= 3) {
    const dy = contrast.year.hi - contrast.year.lo;
    const dr = contrast.runtime.hi && contrast.runtime.lo ? contrast.runtime.hi - contrast.runtime.lo : null;
    const parts = [];
    if (Math.abs(dy) >= 3) parts.push(`${Math.round(Math.abs(dy))} years ${dy < 0 ? "older" : "newer"}`);
    if (dr !== null && Math.abs(dr) >= 5) parts.push(`${Math.round(Math.abs(dr))} minutes ${dr > 0 ? "longer" : "shorter"}`);
    if (parts.length) notes.push({ kind: "contrast", text: `Your favourites (${contrast.hiCount} films) are on average ${parts.join(" and ")} than the ones you rated lowest (${contrast.loCount} films).`, examples: [...hi].sort((a, b) => b.rating - a.rating).slice(0, 3) });
  }
  if (crowdAgreement !== null && crowdRows.length >= 15) {
    notes.push({ kind: "crowd", text: crowdAgreement > 0.55 ? `You and the crowd mostly agree (correlation with TMDB scores ${crowdAgreement.toFixed(2)}).` : crowdAgreement > 0.25 ? `You agree with the crowd only loosely (correlation with TMDB scores ${crowdAgreement.toFixed(2)}) - you have your own opinions.` : `You march to your own drum: your ratings barely track TMDB's crowd (correlation ${crowdAgreement.toFixed(2)}).`, examples: [] });
  }
  if (runtime.correlation !== null && rated.length >= 10) notes.push({ kind: "runtime", text: runtime.tendency + ".", examples: [] });
  if (words.raves.length >= 3) notes.push({ kind: "words", text: `In reviews of films you love, you reach for: ${words.raves.slice(0, 6).map((w) => `“${w.word}”`).join(", ")}.`, examples: [] });

  return {
    enough: true, rated: rated.length, mean: mu, std: lib.std, archetype,
    genresLoved, genresCold, genresFrequent, subgenres, themesCold, directors, actors, decades, countries,
    axes, contrast, crowdAgreement, words, focus, notes,
    avgYear, lovedYear,
    examples: { genre: (g) => examplesFor(lib, g, 3) },
    stdOfRatings: stdev(rated.map((f) => f.rating)),
    _ex3: ex3
  };
}
