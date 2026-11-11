/* =========================================================
   Free on YouTube? - availability checker
   ---------------------------------------------------------
   Answers one question for a movie: can you sit down and
   watch the whole thing on YouTube, for free, right now -
   whoever uploaded it?

   The browser can't query youtube.com directly (no CORS), so
   searches go through, in order:
     1. The official YouTube Data API v3, when a key is saved in
        Settings. Its search is not limited to official channels
        or YouTube Movies; it returns any public upload.
     2. Public Invidious instances (open-source YouTube front ends
        whose JSON API mirrors YouTube's public search results).
     3. Public Piped API instances (the same idea, another project).
   Every source returns the same broad, unfiltered search - none
   of them is restricted to official uploads, and nothing here
   ever narrows the search to official channels. If every source
   fails the result is "Couldn't check", never "Unavailable".

   This file has no DOM code; the UI lives in yt/panel.js.
   ========================================================= */
(function (root) {
  "use strict";

  const CACHE_STORAGE = "yt-free-cache-v1";
  const YT_KEY_STORAGE = "youtube-api-key";
  const INSTANCE_STORAGE = "yt-free-instances-v1";
  const CACHE_MAX = 300;

  // How long a result is trusted before it's rechecked. Available uploads
  // get rechecked fairly often because they're the ones that disappear.
  const HOUR = 3600 * 1000;
  const DAY = 24 * HOUR;
  const TTL = {
    free: 3 * DAY,
    free_ads: 3 * DAY,
    possible: 2 * DAY,
    unavailable: 5 * DAY,
    error: 30 * 60 * 1000
  };

  const STATUS_TEXT = {
    free_ads: "Free with ads",
    free: "Free",
    possible: "Possibly available",
    unavailable: "Unavailable",
    error: "Couldn't check"
  };

  // Fallbacks if the Invidious instance directory itself is unreachable.
  const INVIDIOUS_FALLBACK = [
    "https://inv.nadeko.net",
    "https://invidious.nerdvpn.de",
    "https://yewtu.be",
    "https://invidious.f5.si",
    "https://iv.melmac.space",
    "https://invidious.privacyredirect.com"
  ];
  const PIPED_FALLBACK = [
    "https://pipedapi.kavin.rocks",
    "https://api.piped.private.coffee",
    "https://pipedapi.adminforge.de",
    "https://pipedapi.leptons.xyz"
  ];

  // Channels that are known ad-supported free-movie distributors. Only used
  // to tell "Free with ads" from plain "Free" - never to include or exclude
  // an upload.
  const AD_SUPPORTED_CHANNELS = [
    "youtube movies", "popcornflix", "filmrise", "fawesome", "maverick movies",
    "movie central", "midnight pulp", "grizzly", "timeless", "shout! factory",
    "shout factory", "paramount movies", "cineverse", "moviedome", "bonfire",
    "kings of horror", "crackle", "tubi", "pluto tv", "gravitas", "screambox",
    "film&clips", "film & clips", "hoopla", "cinedigm", "mgm", "lionsgate",
    "sony pictures", "warner bros", "free movies", "full movies"
  ];

  // Words that mark a video as something other than the movie itself.
  const NOT_A_MOVIE = /\b(trailers?|teasers?|clips?|scenes?|reviews?|reacts?|reactions?|reacting|explained|explanation|recap|recapped|summary|summari[sz]ed|breakdown|analysis|essay|ending|behind the scenes|making of|featurette|interview|interviews|soundtrack|ost|score|theme song|compilation|best moments|top \d+|bloopers|deleted scenes?|alternate ending|easter eggs|things you missed|podcast|commentary|parody|spoof|gameplay|walkthrough|lego|minecraft|roblox|fan ?made|fan film|tribute|vlog|unboxing|blu-?ray|dvd menu|premiere|red carpet|press conference|in \d+ minutes|in \d+ seconds|shorts?)\b/;

  // "Full movie" uploads that are really a still image pointing at an
  // off-site streaming/download link.
  const BAIT = /(link in (the )?(description|desc|bio|comments?)|watch (the )?(full )?movie (here|at|on|online)|download (link|here|now|free)|click (the )?link|streaming link|free download|\b123 ?movies\b|\bputlocker\b|\bfmovies\b|\bsolarmovie\b|full movie (link|in description)|watch online free|telegram)/;

  const DUB = /\b(hindi|tamil|telugu|malayalam|kannada|bengali|urdu|dubbed|dublado|doblad[ao]|latino|castellano|espa[nñ]ol|türkçe|turkce|deutsch|german|fran[cç]ais|french|italiano|portugu[eê]s|русск\S*|russian|polski|arabic|عربي|vietsub|thuyết minh|indonesia|sub indo)\b/;

  const FULL_PHRASE = /\b(full(-| )?(movie|film|length|feature)|complete (movie|film)|entire (movie|film)|whole (movie|film)|pel[ií]cula completa|film complet|ganzer film|filme completo)\b/;

  // ---------- small helpers ----------

  function now() { return Date.now(); }

  function norm(s) {
    return String(s || "")
      .normalize("NFKD").replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/['’`]/g, "")
      .replace(/[^a-z0-9Ѐ-ӿ؀-ۿऀ-෿]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const STOP = new Set(["the", "a", "an", "of", "and", "in", "on", "to", "for", "at", "by", "with", "from"]);

  function significantWords(s) {
    return norm(s).split(" ").filter((w) => w && !STOP.has(w));
  }

  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // ISO-8601 duration ("PT1H32M10S") to seconds.
  function parseIsoDuration(iso) {
    const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || "");
    if (!m) return 0;
    return (+m[1] || 0) * 86400 + (+m[2] || 0) * 3600 + (+m[3] || 0) * 60 + (+m[4] || 0);
  }

  function formatDuration(sec) {
    if (!sec) return "?";
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const mm = String(m).padStart(h ? 2 : 1, "0");
    return (h ? h + ":" : "") + mm + ":" + String(s).padStart(2, "0");
  }

  function userRegion() {
    try {
      const langs = (root.navigator && (root.navigator.languages || [root.navigator.language])) || [];
      for (const l of langs) {
        const m = /[-_]([A-Za-z]{2})$/.exec(l || "");
        if (m) return m[1].toUpperCase();
      }
    } catch (e) { /* ignore */ }
    return "US";
  }

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

  async function fetchJson(url, timeoutMs) {
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs || 10000) : null;
    try {
      const r = await root.fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
      let body = null;
      try { body = await r.json(); } catch (e) { body = null; }
      return { ok: r.ok, status: r.status, body };
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  // ---------- search queries ----------

  // A title needs its year in every query when it's short or generic
  // ("Up", "It", "Heat") - otherwise only the first query carries it.
  function needsYearEverywhere(title) {
    return significantWords(title).length <= 1 || norm(title).length <= 6;
  }

  function buildQueries(movie) {
    const t = String(movie.title || "").trim();
    const y = movie.year ? String(movie.year) : "";
    const ty = y ? t + " " + y : t;
    const base = y && needsYearEverywhere(t) ? ty : t;
    // `long` asks the backend for 20+ minute videos, which drops most
    // trailers and clips up front. One query runs without it so movies
    // uploaded in parts can still be found.
    const qs = [
      { q: ty + " full movie", long: true },
      { q: base + " full movie", long: false },
      { q: base + " full movie with ads", long: true },
      { q: base + " full film", long: true },
      { q: base + " complete movie", long: true }
    ];
    const seen = new Set();
    return qs.filter((x) => (seen.has(x.q) ? false : (seen.add(x.q), true)));
  }

  // ---------- matching & scoring ----------

  const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10 };
  const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  function toNum(tok) {
    if (/^\d{1,2}$/.test(tok)) return +tok;
    if (ROMAN[tok]) return ROMAN[tok];
    if (WORD_NUM[tok]) return WORD_NUM[tok];
    return null;
  }

  // How well a video title names this movie: 2 = the whole title as a
  // phrase, 1 = most of its words, 0 = no match. Also catches sequels
  // ("Rocky II" when looking for "Rocky").
  function titleMatch(movieTitle, videoTitle) {
    const mt = norm(movieTitle);
    const vt = norm(videoTitle);
    if (!mt || !vt) return { level: 0 };
    const re = new RegExp("(^| )" + escapeRegex(mt) + "( |$)");
    const m = re.exec(vt);
    if (m) {
      const after = vt.slice(m.index + m[0].length).split(" ")[0] || "";
      const movieEndsInNum = toNum(mt.split(" ").pop()) !== null;
      // "<title> 2", "<title> II", "<title> part 2" -> a sequel, unless the
      // number is a split-upload part marker ("part 2 of 3" / "pt 2").
      const restAfter = vt.slice(m.index + m[0].length);
      const sequelNum = !movieEndsInNum && /^(\d|ii|iii|iv|v|vi|vii|viii|ix|x)\b/.test(after) && !/^\d+ ?(of|\/) ?\d/.test(restAfter);
      // Only a 1-digit/roman number right after counts; a year doesn't.
      if (sequelNum && !/^(19|20)\d\d$/.test(after)) return { level: 0, sequel: true };
      return { level: 2 };
    }
    // Movie titles with subtitles ("Star Wars: Episode IV - A New Hope")
    // are often uploaded with only part of the name.
    const words = significantWords(movieTitle);
    if (words.length < 2) return { level: 0 };
    const vset = new Set(vt.split(" "));
    const hits = words.filter((w) => vset.has(w)).length;
    if (hits / words.length >= 0.75) return { level: 1 };
    if (/[:\-–—]/.test(movieTitle)) {
      const head = norm(String(movieTitle).split(/[:\-–—]/)[0]);
      const tail = norm(String(movieTitle).split(/[:\-–—]/).pop());
      if (head.split(" ").length >= 2 && new RegExp("(^| )" + escapeRegex(head) + "( |$)").test(vt)) return { level: 1 };
      if (tail.split(" ").length >= 2 && new RegExp("(^| )" + escapeRegex(tail) + "( |$)").test(vt)) return { level: 1 };
    }
    return { level: 0 };
  }

  function yearsIn(text) {
    return (String(text || "").match(/\b(19[0-9]{2}|20[0-4][0-9])\b/g) || []).map(Number);
  }

  // Detects "Part 2", "Pt. 2", "(2/3)", "2 of 3" in what's left of the
  // video title once the movie's own title is removed.
  function partInfo(movieTitle, videoTitle) {
    let rest = norm(videoTitle);
    const mt = norm(movieTitle);
    if (mt) rest = rest.replace(new RegExp("(^| )" + escapeRegex(mt) + "( |$)"), " ");
    let m = /\b(\d{1,2}) ?(?:of|\/) ?(\d{1,2})\b/.exec(String(videoTitle).toLowerCase().replace(new RegExp(escapeRegex(String(movieTitle).toLowerCase()), "g"), " "));
    if (m && +m[1] >= 1 && +m[1] <= +m[2] && +m[2] <= 12) return { part: +m[1], of: +m[2] };
    m = /\b(?:part|pt)\s?(\d{1,2}|one|two|three|four|five|six|i|ii|iii|iv|v|vi)\b(?:\s?of\s?(\d{1,2}))?/.exec(rest);
    if (m) {
      const n = toNum(m[1]);
      if (n && n <= 12) return { part: n, of: m[2] ? +m[2] : null };
    }
    return null;
  }

  function hasAny(list, text) {
    const t = String(text || "").toLowerCase();
    return list.some((x) => t.includes(x));
  }

  // Turns a raw search hit into a scored candidate, or null if it is clearly
  // not this movie / not a full movie. `ctx` = { title, year, runtimeMin }.
  function assess(video, ctx) {
    const title = video.title || "";
    const lowerTitle = title.toLowerCase();
    const desc = String(video.description || "").toLowerCase();
    const tm = titleMatch(ctx.title, title);
    if (tm.level === 0) return null;
    if (video.isLive || video.isUpcoming) return null;
    if (video.isShort) return null;

    const fullPhrase = FULL_PHRASE.test(lowerTitle);
    // The movie's own title may contain a "bad" word ("Scream", "Clue",
    // "Interview with the Vampire"), so test only what's left over.
    const leftover = norm(title).replace(new RegExp("(^| )" + escapeRegex(norm(ctx.title)) + "( |$)"), " ");
    const notMovie = NOT_A_MOVIE.test(leftover);
    if (notMovie && !fullPhrase) return null;
    if (/\b(reacts?|reaction|reacting|review|explained|recap|trailer)\b/.test(leftover)) return null;
    if (BAIT.test(lowerTitle) || BAIT.test(desc.slice(0, 600))) return null;

    const dur = video.durationSec || 0;
    const part = partInfo(ctx.title, title);
    const runtime = ctx.runtimeMin ? ctx.runtimeMin * 60 : 0;
    const ratio = runtime && dur ? dur / runtime : null;

    // Full-length fit. Wide enough for credits, PAL speed-up (~4% short),
    // alternate/extended cuts and director's cuts.
    let fit = "none";
    if (part) {
      fit = "part";
    } else if (ratio !== null) {
      if (ratio >= 0.85 && ratio <= 1.25) fit = "full";
      else if (ratio >= 0.7 && ratio <= 1.6) fit = "near";
    } else if (dur >= 60 * 60 && dur <= 4.5 * 3600) {
      // Runtime unknown: a 1-4.5h upload is plausible but unconfirmed.
      fit = "near";
    }
    if (fit === "none") return null;

    const ys = yearsIn(title);
    const yearMatch = !!(ctx.year && ys.some((y) => Math.abs(y - ctx.year) <= 1));
    const yearConflict = !!(ctx.year && ys.length && !yearMatch);
    const descYear = !!(ctx.year && yearsIn(desc.slice(0, 1500)).some((y) => Math.abs(y - ctx.year) <= 1));
    const dubbed = DUB.test(lowerTitle) && !DUB.test(String(ctx.title).toLowerCase());
    const channel = video.channel || "";
    const adText = /\b(free with ads|with ads|ad-supported|ad supported)\b/.test(lowerTitle + " " + desc.slice(0, 800));
    const knownAdChannel = hasAny(AD_SUPPORTED_CHANNELS, channel);
    // The YouTube Movies storefront lists rentals and purchases too; without
    // an explicit "free" signal such an entry can't be called free.
    const storefront = /^youtube movies/i.test(channel) || video.paid === true;
    const paidRisk = storefront && !adText && !/\bfree\b/.test(lowerTitle + " " + desc.slice(0, 400));

    // Correct-movie confidence, used for ranking (higher is better).
    let match = tm.level * 2;
    if (yearMatch) match += 2;
    else if (descYear) match += 1;
    if (yearConflict) match -= 4;
    if (fullPhrase) match += 1;
    if (dubbed) match -= 2;
    if (notMovie) match -= 2;

    return {
      id: video.id,
      url: "https://www.youtube.com/watch?v=" + video.id,
      title,
      channel,
      channelId: video.channelId || null,
      durationSec: dur,
      published: video.published || null,
      views: video.views || null,
      fit,
      part,
      ratio,
      titleLevel: tm.level,
      yearMatch,
      yearConflict,
      dubbed,
      fullPhrase,
      ads: adText || knownAdChannel || video.licensed === true,
      paidRisk,
      match,
      // Playability: filled in by verification. Search hits are public by
      // definition, but may still be blocked for this viewer.
      playable: video.premium || video.paid ? false : "unknown",
      notes: [],
      raw: video
    };
  }

  // Groups "Part 1 / Part 2 ..." uploads from one channel into a single
  // candidate when together they add up to the movie.
  function combineParts(cands, ctx) {
    const parts = cands.filter((c) => c.fit === "part");
    const groups = new Map();
    parts.forEach((c) => {
      const key = (c.channelId || norm(c.channel)) + "|" + (c.part.of || "");
      if (!groups.has(key)) groups.set(key, new Map());
      const g = groups.get(key);
      const prev = g.get(c.part.part);
      if (!prev || c.match > prev.match) g.set(c.part.part, c);
    });
    const out = [];
    const runtime = ctx.runtimeMin ? ctx.runtimeMin * 60 : 0;
    groups.forEach((g) => {
      const list = [...g.values()].sort((a, b) => a.part.part - b.part.part);
      if (list.length < 2 || list[0].part.part !== 1) return;
      const declared = list[0].part.of || list.find((c) => c.part.of)?.part.of || null;
      // Consecutive parts only.
      for (let i = 0; i < list.length; i++) if (list[i].part.part !== i + 1) return;
      const total = list.reduce((s, c) => s + (c.durationSec || 0), 0);
      const complete = declared ? list.length === declared : null;
      let fit = "none";
      if (runtime) {
        const r = total / runtime;
        if (r >= 0.85 && r <= 1.25) fit = "near";
      } else if (total >= 3600) {
        fit = "near";
      }
      if (fit === "none" || complete === false) return;
      const first = list[0];
      out.push({
        ...first,
        durationSec: total,
        ratio: runtime ? total / runtime : null,
        fit: "near",
        kind: "parts",
        parts: list.map((c) => ({ id: c.id, url: c.url, title: c.title, durationSec: c.durationSec, part: c.part.part })),
        match: Math.min(...list.map((c) => c.match)),
        notes: ["Split into " + list.length + " parts" + (complete ? "" : " (set may be incomplete)")]
      });
    });
    return out;
  }

  const FIT_RANK = { full: 0, near: 1 };
  const PLAY_RANK = { true: 0, unknown: 1, false: 2 };

  // Ranking order from the spec: full-length match, then currently
  // playable, then correct movie & year, then closest to the runtime.
  function rank(a, b) {
    return (FIT_RANK[a.fit] - FIT_RANK[b.fit]) ||
      (PLAY_RANK[String(a.playable)] - PLAY_RANK[String(b.playable)]) ||
      (b.match - a.match) ||
      ((a.ratio === null ? 9 : Math.abs(a.ratio - 1)) - (b.ratio === null ? 9 : Math.abs(b.ratio - 1))) ||
      ((b.views || 0) - (a.views || 0));
  }

  // A candidate is "confirmed" when it's a single full-length upload of the
  // right movie that is playable for this viewer without payment.
  function isConfirmed(c) {
    return c.kind !== "parts" && c.fit === "full" && c.playable === true &&
      c.titleLevel === 2 && !c.yearConflict && !c.dubbed && !c.paidRisk;
  }

  function decideStatus(top) {
    const confirmed = top.find(isConfirmed);
    if (confirmed) return confirmed.ads ? "free_ads" : "free";
    return top.some((c) => c.playable !== false) ? "possible" : "unavailable";
  }

  // ---------- backends ----------
  // Each backend: search(query, long) -> [video], verify([video]) -> Map(id -> info)
  // video = { id, title, channel, channelId, durationSec, description,
  //           published, views, isLive, isUpcoming, isShort, paid, premium }
  // info  = { state: "ok"|"removed"|"unknown", ageRestricted, regionBlocked,
  //           paid, licensed, durationSec, description }

  function classifyError(msg) {
    const m = String(msg || "").toLowerCase();
    if (/bot|captcha|rate|too many|quota|429|blocked by youtube|try again later|internal|timeout|failed to fetch/.test(m)) return { state: "unknown" };
    if (/private/.test(m)) return { state: "removed", reason: "Private video" };
    if (/(country|region|location)/.test(m)) return { state: "unknown", regionNote: true };
    if (/(age|inappropriate|confirm your age|sign in to confirm)/.test(m)) return { state: "ok", ageRestricted: true };
    if (/(members|join this channel|premium|rent|purchase|paid)/.test(m)) return { state: "ok", paid: true };
    if (/(unavailable|removed|terminated|does not exist|no longer available|copyright|not available|deleted)/.test(m)) return { state: "removed", reason: "Removed or unavailable" };
    return { state: "unknown" };
  }

  function dataApiBackend(key, region) {
    const base = "https://www.googleapis.com/youtube/v3/";
    return {
      name: "YouTube Data API",
      async search(q, long) {
        const url = base + "search?part=snippet&type=video&maxResults=25&safeSearch=none" +
          "&regionCode=" + region + (long ? "&videoDuration=long" : "") +
          "&q=" + encodeURIComponent(q) + "&key=" + encodeURIComponent(key);
        const r = await fetchJson(url);
        if (!r.ok) {
          const reason = r.body && r.body.error && (r.body.error.errors || [])[0];
          throw new Error("YouTube API " + r.status + (reason ? " " + reason.reason : ""));
        }
        const items = (r.body && r.body.items) || [];
        // Search results don't include duration; videos.list fills it in.
        const vids = items.filter((it) => it.id && it.id.videoId).map((it) => ({
          id: it.id.videoId,
          title: decodeEntities(it.snippet.title),
          channel: decodeEntities(it.snippet.channelTitle),
          channelId: it.snippet.channelId,
          description: decodeEntities(it.snippet.description || ""),
          published: it.snippet.publishedAt,
          isLive: it.snippet.liveBroadcastContent === "live",
          isUpcoming: it.snippet.liveBroadcastContent === "upcoming",
          durationSec: 0
        }));
        if (!vids.length) return [];
        const info = await this.details(vids.map((v) => v.id));
        return vids.map((v) => {
          const d = info.get(v.id);
          if (!d) return null;
          return { ...v, durationSec: d.durationSec, description: d.description || v.description, views: d.views, _info: d };
        }).filter(Boolean);
      },
      async details(ids) {
        const out = new Map();
        for (let i = 0; i < ids.length; i += 50) {
          const chunk = ids.slice(i, i + 50);
          const url = base + "videos?part=snippet,contentDetails,status,statistics&id=" + chunk.join(",") + "&key=" + encodeURIComponent(key);
          const r = await fetchJson(url);
          if (!r.ok) throw new Error("YouTube API " + r.status);
          ((r.body && r.body.items) || []).forEach((it) => {
            const cd = it.contentDetails || {};
            const st = it.status || {};
            const rr = cd.regionRestriction || {};
            const regionBlocked = (rr.allowed && !rr.allowed.includes(region)) || (rr.blocked && rr.blocked.includes(region)) || false;
            out.set(it.id, {
              state: st.privacyStatus === "private" || st.uploadStatus === "rejected" || st.uploadStatus === "deleted" ? "removed" : "ok",
              durationSec: parseIsoDuration(cd.duration),
              description: decodeEntities((it.snippet && it.snippet.description) || ""),
              ageRestricted: !!(cd.contentRating && cd.contentRating.ytRating === "ytAgeRestricted"),
              regionBlocked: !!regionBlocked,
              licensed: !!cd.licensedContent,
              views: it.statistics ? +it.statistics.viewCount || 0 : 0
            });
          });
          // Ids missing from videos.list are deleted or private.
          chunk.forEach((id) => { if (!out.has(id)) out.set(id, { state: "removed", reason: "Removed or private" }); });
        }
        return out;
      },
      async verify(videos) {
        // videos.list already ran during search - reuse it, refresh nothing.
        const out = new Map();
        videos.forEach((v) => { if (v.raw && v.raw._info) out.set(v.id, v.raw._info); });
        const missing = videos.filter((v) => !out.has(v.id)).map((v) => v.id);
        if (missing.length) (await this.details(missing)).forEach((val, k) => out.set(k, val));
        return out;
      }
    };
  }

  function decodeEntities(s) {
    return String(s || "")
      .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">");
  }

  async function invidiousInstances() {
    const cached = readJson(INSTANCE_STORAGE, null);
    if (cached && cached.inv && now() - cached.at < DAY) return cached.inv;
    let list = [];
    try {
      const r = await fetchJson("https://api.invidious.io/instances.json?sort_by=health", 8000);
      if (r.ok && Array.isArray(r.body)) {
        list = r.body
          .filter(([, i]) => i && i.type === "https" && i.api === true && i.cors !== false && i.uri)
          .map(([, i]) => String(i.uri).replace(/\/$/, ""));
      }
    } catch (e) { /* use fallbacks */ }
    const merged = [...new Set([...list.slice(0, 8), ...INVIDIOUS_FALLBACK])];
    writeJson(INSTANCE_STORAGE, { at: now(), inv: merged });
    return merged;
  }

  // Tries instances in turn until one answers; the one that worked is
  // remembered (moved to the front) for the rest of the check.
  function pool(urls) {
    const list = urls.slice();
    return async function call(path, parse) {
      let lastErr = null;
      for (let i = 0; i < Math.min(list.length, 4); i++) {
        const host = list[0];
        try {
          const r = await fetchJson(host + path, 10000);
          const parsed = parse(r);
          if (parsed !== undefined) return parsed;
          lastErr = new Error("Bad response from " + host);
        } catch (e) {
          lastErr = e;
        }
        list.push(list.shift());
      }
      throw lastErr || new Error("No instance answered");
    };
  }

  function invidiousBackend(urls, region) {
    const call = pool(urls);
    const parseVideo = (it) => ({
      id: it.videoId,
      title: it.title,
      channel: it.author,
      channelId: it.authorId,
      description: it.description || "",
      durationSec: +it.lengthSeconds || 0,
      published: it.published ? new Date(it.published * 1000).toISOString() : null,
      views: it.viewCount || 0,
      isLive: !!it.liveNow,
      isUpcoming: !!it.isUpcoming,
      paid: !!it.paid,
      premium: !!it.premium
    });
    return {
      name: "Invidious",
      async search(q, long) {
        const path = "/api/v1/search?type=video&sort_by=relevance&region=" + region +
          (long ? "&duration=long" : "") + "&q=" + encodeURIComponent(q);
        return call(path, (r) => (r.ok && Array.isArray(r.body) ? r.body.filter((x) => x.type === "video").map(parseVideo) : undefined));
      },
      async verify(videos) {
        const out = new Map();
        for (const v of videos) {
          try {
            const info = await call(
              "/api/v1/videos/" + v.id + "?fields=videoId,lengthSeconds,allowedRegions,paid,premium,isListed,liveNow,isUpcoming,description,error",
              (r) => {
                if (r.body && r.body.videoId) return r.body;
                if (r.body && r.body.error) {
                  const c = classifyError(r.body.error);
                  // An instance-side failure: let the pool try another one.
                  return c.state === "unknown" ? undefined : { error: r.body.error };
                }
                return undefined;
              });
            if (info.error) {
              out.set(v.id, classifyError(info.error));
            } else {
              const allowed = info.allowedRegions || [];
              out.set(v.id, {
                state: "ok",
                durationSec: +info.lengthSeconds || v.durationSec,
                description: info.description || "",
                regionBlocked: allowed.length > 0 && !allowed.includes(region),
                paid: !!(info.paid || info.premium)
              });
            }
          } catch (e) {
            out.set(v.id, { state: "unknown" });
          }
        }
        return out;
      }
    };
  }

  function pipedBackend(urls) {
    const call = pool(urls);
    return {
      name: "Piped",
      async search(q) {
        const path = "/search?filter=videos&q=" + encodeURIComponent(q);
        return call(path, (r) => {
          if (!r.ok || !r.body || !Array.isArray(r.body.items)) return undefined;
          return r.body.items.filter((x) => x.url && /watch\?v=/.test(x.url)).map((it) => ({
            id: it.url.split("v=")[1].split("&")[0],
            title: it.title,
            channel: it.uploaderName,
            channelId: (it.uploaderUrl || "").split("/").pop() || null,
            description: it.shortDescription || "",
            durationSec: it.duration > 0 ? it.duration : 0,
            published: it.uploaded > 0 ? new Date(it.uploaded).toISOString() : null,
            views: it.views || 0,
            isShort: !!it.isShort,
            isLive: it.duration === -1
          }));
        });
      },
      async verify(videos) {
        const out = new Map();
        for (const v of videos) {
          try {
            const info = await call("/streams/" + v.id, (r) => {
              if (r.body && r.body.title) return r.body;
              if (r.body && (r.body.error || r.body.message)) {
                const c = classifyError(r.body.message || r.body.error);
                return c.state === "unknown" ? undefined : { error: r.body.message || r.body.error };
              }
              return undefined;
            });
            if (info.error) out.set(v.id, classifyError(info.error));
            else out.set(v.id, { state: "ok", durationSec: info.duration || v.durationSec, description: info.description || "" });
          } catch (e) {
            out.set(v.id, { state: "unknown" });
          }
        }
        return out;
      }
    };
  }

  async function backends() {
    const region = userRegion();
    const list = [];
    const key = readKey();
    if (key) list.push(dataApiBackend(key, region));
    list.push(invidiousBackend(await invidiousInstances(), region));
    list.push(pipedBackend(PIPED_FALLBACK));
    return list;
  }

  function readKey() {
    const ls = storage();
    try { return ls ? ls.getItem(YT_KEY_STORAGE) : null; } catch (e) { return null; }
  }

  // ---------- the check itself ----------

  function strongCount(cands) {
    return cands.filter((c) => c.fit === "full" && c.titleLevel === 2 && !c.yearConflict && !c.dubbed).length;
  }

  // Runs the query variations on one backend. Stops early once three
  // strong full-length matches are in hand, to go easy on rate limits.
  async function searchAll(backend, ctx) {
    const byId = new Map();
    let ok = 0, failed = 0, lastErr = null;
    const queries = buildQueries(ctx);
    for (let i = 0; i < queries.length; i++) {
      const { q, long } = queries[i];
      try {
        const vids = await backend.search(q, long);
        ok++;
        vids.forEach((v) => {
          if (!v || !v.id || byId.has(v.id)) return;
          const c = assess(v, ctx);
          if (c) byId.set(v.id, c);
        });
      } catch (e) {
        failed++;
        lastErr = e;
        // The first query failing outright usually means the backend is
        // down or out of quota; move on to the next backend.
        if (i === 0) break;
      }
      if (i >= 1 && strongCount([...byId.values()]) >= 3) break;
    }
    return { cands: [...byId.values()], ok, failed, lastErr, queries: queries.length };
  }

  function applyVerification(c, info) {
    if (!info) return c;
    if (info.state === "removed") return null;
    const out = { ...c, notes: c.notes.slice() };
    if (info.durationSec && !out.parts) out.durationSec = info.durationSec;
    if (info.state === "ok" && out.playable !== false) out.playable = true;
    if (info.ageRestricted) out.notes.push("Age-restricted: sign in to YouTube to watch");
    if (info.regionBlocked) { out.playable = false; out.notes.push("Blocked in your region"); }
    if (info.regionNote) out.notes.push("May be region-restricted");
    if (info.paid) { out.playable = false; out.notes.push("Requires payment or membership"); }
    if (info.licensed) out.ads = true;
    if (info.description && BAIT.test(String(info.description).slice(0, 600).toLowerCase())) return null;
    return out;
  }

  async function check(movie, opts) {
    opts = opts || {};
    const ctx = {
      title: movie.title,
      year: movie.year ? +String(movie.year).slice(0, 4) : null,
      runtimeMin: movie.runtime || null
    };
    const list = opts.backends || (await backends());
    const errors = [];
    let result = null;

    for (const backend of list) {
      const s = await searchAll(backend, ctx);
      if (s.ok === 0) {
        errors.push(backend.name + ": " + (s.lastErr ? s.lastErr.message : "no response"));
        continue;
      }
      let cands = s.cands.filter((c) => c.fit === "full" || c.fit === "near");
      const combined = combineParts(s.cands, ctx);
      cands.sort(rank);

      // Verify the most promising single uploads, plus part 1 of any sets.
      const toVerify = cands.slice(0, 6);
      let verified = new Map();
      try { verified = await backend.verify(toVerify.concat(combined.map((c) => ({ ...c, raw: {} })))); } catch (e) { /* stays unknown */ }
      cands = cands.map((c) => (toVerify.includes(c) ? applyVerification(c, verified.get(c.id)) : c)).filter(Boolean);
      const parts = combined.map((c) => applyVerification(c, verified.get(c.id))).filter(Boolean);
      const all = cands.concat(parts).sort(rank);
      const top = all.slice(0, 3);
      const status = decideStatus(top);

      result = {
        status,
        checkedAt: now(),
        source: backend.name,
        runtimeMin: ctx.runtimeMin,
        partial: s.failed > 0,
        results: top.map(publicView)
      };
      // An empty answer from a backend that only half-worked isn't trusted
      // as "Unavailable" while another backend could still be asked.
      if (status === "unavailable" && s.failed > 0 && backend !== list[list.length - 1]) {
        errors.push(backend.name + ": incomplete search");
        continue;
      }
      break;
    }

    if (!result) {
      result = {
        status: "error",
        checkedAt: now(),
        source: null,
        runtimeMin: ctx.runtimeMin,
        error: errors.join("; ") || "No search source answered",
        results: []
      };
    }
    return result;
  }

  function publicView(c) {
    return {
      id: c.id,
      url: c.url,
      title: c.title,
      channel: c.channel,
      durationSec: c.durationSec,
      published: c.published,
      fit: c.fit,
      playable: c.playable,
      ads: !!c.ads,
      confirmed: isConfirmed(c),
      yearConflict: c.yearConflict,
      dubbed: c.dubbed,
      paidRisk: c.paidRisk,
      parts: c.parts || null,
      notes: c.notes.concat(
        c.dubbed ? ["Looks dubbed or not in the original language"] : [],
        c.yearConflict ? ["Title names a different year - may be another version"] : [],
        c.paidRisk ? ["YouTube Movies listing - may be a rental"] : [],
        c.fit === "near" && !c.parts ? ["Length differs from the movie's runtime"] : [],
        c.playable === "unknown" ? ["Couldn't confirm it plays"] : []
      )
    };
  }

  // ---------- cache & scheduling ----------

  function cacheKey(movie) {
    if (movie.id) return "tmdb:" + movie.id;
    return "t:" + norm(movie.title) + "|" + (movie.year || "");
  }

  function readCache() { return readJson(CACHE_STORAGE, {}); }

  function getCached(movie) {
    const c = readCache()[cacheKey(movie)];
    return c || null;
  }

  function isStale(rec) {
    if (!rec) return true;
    const ttl = rec.partial && rec.status === "unavailable" ? DAY : (TTL[rec.status] || DAY);
    return now() - rec.checkedAt > ttl;
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

  const listeners = new Set();
  const inflight = new Map();
  let queue = Promise.resolve();
  let enrich = null; // (movie) -> Promise<{year, runtime}>

  function emit(key, state) { listeners.forEach((fn) => { try { fn(key, state); } catch (e) { /* ignore */ } }); }

  function state(movie) {
    const key = cacheKey(movie);
    return { key, checking: inflight.has(key), record: getCached(movie) };
  }

  // Queues a check (one at a time, to stay polite to the search sources).
  // Returns the cached record without searching when it's still fresh,
  // unless `force` is set.
  function ensure(movie, opts) {
    opts = opts || {};
    if (!movie || !movie.title) return Promise.resolve(null);
    const key = cacheKey(movie);
    const cached = getCached(movie);
    if (!opts.force && cached && !isStale(cached)) return Promise.resolve(cached);
    if (inflight.has(key)) return inflight.get(key);
    const p = (queue = queue.catch(() => {}).then(async () => {
      emit(key, state(movie));
      let m = { ...movie };
      if (enrich) {
        try { m = { ...m, ...(await enrich(movie)) }; } catch (e) { /* use what we have */ }
      }
      let rec;
      try {
        rec = await check(m);
      } catch (e) {
        rec = { status: "error", checkedAt: now(), error: String(e && e.message || e), results: [] };
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
    YT_KEY_STORAGE,
    // pure helpers, exported for tests
    _: { norm, titleMatch, partInfo, assess, combineParts, rank, decideStatus, buildQueries, parseIsoDuration, classifyError, isConfirmed, publicView, searchAll, check },
    formatDuration,
    cacheKey,
    getCached,
    isStale,
    state,
    ensure,
    check,
    setEnricher(fn) { enrich = fn; },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    hasApiKey() { return !!readKey(); },
    setApiKey(k) {
      const ls = storage();
      if (!ls) return;
      if (k) ls.setItem(YT_KEY_STORAGE, k); else ls.removeItem(YT_KEY_STORAGE);
    },
    clearErrors() {
      const all = readCache();
      Object.keys(all).forEach((k) => { if (all[k].status === "error") delete all[k]; });
      writeJson(CACHE_STORAGE, all);
    }
  };

  root.YTFree = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
