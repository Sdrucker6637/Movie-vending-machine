const CACHE = "movie-machine-v9";
const FILES = [
  "./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./fonts/shrikhand-400.woff2",
  "./fonts/limelight-400.woff2",
  "./fonts/special-elite-400.woff2",
  "./fonts/bitter-var.woff2",
  "./fx/fx.css",
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
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
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
