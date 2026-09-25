const CACHE = "movie-machine-v13";
// Recorded clips (fx/clips/*) get their own cache. It is not tied to the app
// version, so clips survive app updates; clip files never change in place,
// and the cache is trimmed to the most recent CLIP_MAX files.
const CLIP_CACHE = "movie-machine-clips";
const CLIP_MAX = 40;
const FILES = [
  "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./fonts/shrikhand-400.woff2",
  "./fonts/limelight-400.woff2",
  "./fonts/special-elite-400.woff2",
  "./fonts/bitter-var.woff2",
  "./fx/fx.css",
  "./fx/sound.js",
  "./fx/engine.js",
  "./fx/art.js",
  "./fx/index.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== CLIP_CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Only handle the app shell files - let API calls (TMDB, image CDN) go straight to network.
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  // fx packs (fx/cues-*.js) aren't precached - they load on demand and are
  // cached here the first time they're fetched.
  const isAppFile = url.pathname.endsWith("/") || url.pathname.includes("/fx/") ||
    FILES.some((f) => f !== "./" && url.pathname.endsWith(f.slice(1)));
  if (!isAppFile) return;

  if (/\/fx\/clips\/[^/]+$/.test(url.pathname)) {
    e.respondWith(clip(e.request));
    return;
  }

  // Network-first: always try to get the latest version; fall back to cache when offline.
  // "no-cache" makes the browser revalidate with the server instead of reusing a
  // stale HTTP-cached copy, so a new deploy shows up on the next load.
  e.respondWith(
    fetch(e.request.url, { cache: "no-cache" })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});

// Cache-first for clips: once a clip has played it plays offline too.
// Only complete, successful responses are kept (never a 404 or a partial).
function clip(request) {
  return caches.open(CLIP_CACHE).then((c) =>
    c.match(request, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((res) => {
        if (res.ok && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          c.put(request, copy).then(() => trim(c)).catch(() => {});
        }
        return res;
      });
    })
  );
}
function trim(c) {
  return c.keys().then((keys) => Promise.all(keys.slice(0, Math.max(0, keys.length - CLIP_MAX)).map((k) => c.delete(k))));
}
