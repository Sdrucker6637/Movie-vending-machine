/* =========================================================
   Letterboxd RSS reader (https://letterboxd.com/<user>/rss/)
   ---------------------------------------------------------
   The public feed lists a member's most recent activity (about
   the latest 50 entries). Diary items carry:
     guid               letterboxd-review-<n> | letterboxd-watch-<n>
     link               https://letterboxd.com/<user>/film/<slug>/[n/]
     pubDate            when the entry was posted
     letterboxd:watchedDate, :rewatch, :filmTitle, :filmYear,
     letterboxd:memberRating, :memberLike, tmdb:movieId
     description        HTML: poster <img> + review text
   List items (letterboxd-list-*) and anything without a film
   title are skipped. No dependency on a DOM - runs in Node too.
   ========================================================= */
import { toNumber, toRating, toYesNo, isoDate } from "./util.js";

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

export function decodeEntities(s) {
  return String(s || "").replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const v = ENTITIES[e.toLowerCase()];
    return v !== undefined ? v : m;
  });
}

function unCdata(s) {
  const m = String(s).match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return m ? m[1] : decodeEntities(s);
}

function tag(block, name) {
  const re = new RegExp("<" + name.replace(":", "\\:") + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name.replace(":", "\\:") + ">", "i");
  const m = block.match(re);
  return m ? unCdata(m[1]).trim() : null;
}

// Turns the description HTML into the plain review text, or null when the
// entry has no written review (just the poster and "Watched on ..." line).
export function reviewFromDescription(html) {
  if (!html) return { text: null, spoilers: false };
  let h = String(html);
  const spoilers = /This review may contain spoilers/i.test(h);
  h = h.replace(/<p>\s*<img[^>]*>\s*<\/p>/gi, "")
    .replace(/<img[^>]*>/gi, "")
    .replace(/<p>\s*<em>\s*This review may contain spoilers\.?\s*<\/em>\s*<\/p>/gi, "")
    .replace(/<p>\s*This review may contain spoilers\.?\s*<\/p>/gi, "");
  const text = decodeEntities(
    h.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>\s*<p[^>]*>/gi, "\n\n").replace(/<[^>]+>/g, "")
  ).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) return { text: null, spoilers };
  if (/^(Re)?[Ww]atched on [A-Za-z]+,? [A-Za-z]+ \d{1,2},? \d{4}\.?$/.test(text)) return { text: null, spoilers };
  return { text, spoilers };
}

export function slugFromLink(link) {
  const m = String(link || "").match(/letterboxd\.com\/[^/]+\/film\/([^/]+)\//i);
  return m ? m[1] : null;
}

function rfc822ToIso(s) {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Keeps the poster's own clock: "Sat, 01 Jun 2024 23:40:12 +1200" -> 23
export function localHourFromPubDate(s) {
  const m = String(s || "").match(/\d{1,2} \w{3} \d{4} (\d{2}):\d{2}/);
  return m ? Number(m[1]) : null;
}

export function parseRss(xml) {
  const text = String(xml || "");
  if (!/<rss[\s>]/i.test(text) || !/<channel[\s>]/i.test(text)) {
    throw new Error("Not an RSS feed (no <rss><channel>)");
  }
  const channelTitle = tag(text.replace(/<item[\s\S]*$/i, ""), "title");
  const items = [];
  const re = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(text))) {
    const b = m[1];
    const guid = tag(b, "guid") || "";
    const title = tag(b, "letterboxd:filmTitle");
    if (!title || /letterboxd-list-/i.test(guid)) continue;
    const kind = /letterboxd-review-/i.test(guid) ? "review" : /letterboxd-watch-/i.test(guid) ? "watch" : "other";
    const link = tag(b, "link");
    const pub = tag(b, "pubDate");
    const desc = tag(b, "description");
    const { text: review, spoilers } = kind === "watch" ? { text: null, spoilers: false } : reviewFromDescription(desc);
    const poster = (String(desc || "").match(/<img[^>]+src="([^"]+)"/i) || [])[1] || null;
    items.push({
      guid,
      kind,
      link,
      slug: slugFromLink(link),
      title,
      year: toNumber(tag(b, "letterboxd:filmYear")),
      tmdbId: toNumber(tag(b, "tmdb:movieId")),
      rating: toRating(tag(b, "letterboxd:memberRating")),
      rewatch: toYesNo(tag(b, "letterboxd:rewatch")),
      liked: toYesNo(tag(b, "letterboxd:memberLike")),
      watchedDate: isoDate(tag(b, "letterboxd:watchedDate")),
      publishedAt: rfc822ToIso(pub),
      postedHour: localHourFromPubDate(pub),
      review,
      spoilers,
      poster
    });
  }
  return { channelTitle, items };
}
