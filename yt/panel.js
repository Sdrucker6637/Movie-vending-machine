/* =========================================================
   Free on YouTube? - indicator badges and results dialog.
   Logic lives in yt/check.js (window.YTFree).
   ========================================================= */
(function () {
  "use strict";
  const YT = window.YTFree;
  if (!YT) return;

  const SHORT = {
    free_ads: "Free · ads",
    free: "Free",
    rent: "$",
    unavailable: "No",
    error: "?"
  };
  const EXPLAIN = {
    free_ads: "It's in YouTube's official Movies & TV catalog, free to watch with ads.",
    free: "It's in YouTube's official Movies & TV catalog, free to watch.",
    rent: "It's in YouTube's official Movies & TV catalog, but only to rent or buy - not free.",
    unavailable: "It isn't in YouTube's official Movies & TV catalog right now.",
    error: "Couldn't look this up just now. Check that your TMDB key is connected in Settings."
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function fmtDate(ts) {
    if (!ts) return "never";
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
      ", " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  function badgeState(movie) {
    const st = YT.state(movie);
    const rec = st.record;
    if (st.checking && !rec) return { cls: "checking", text: "…", label: "Checking YouTube" };
    if (!rec) return { cls: "unknown", text: "?", label: "Not checked yet" };
    return {
      cls: rec.status + (st.checking ? " rechecking" : ""),
      text: SHORT[rec.status] || "?",
      label: YT.STATUS_TEXT[rec.status] || "Unknown"
    };
  }

  function paintBadge(el, movie) {
    const s = badgeState(movie);
    el.className = "yt-badge " + s.cls;
    el.innerHTML = '<span class="yt-play" aria-hidden="true"></span><span class="yt-text">' + esc(s.text) + "</span>";
    el.title = "Free on YouTube? " + s.label;
    el.setAttribute("aria-label", "Free on YouTube? " + s.label + ". Show details");
  }

  // The slot itself is a <button>, so the badge is a focusable span that
  // swallows its own clicks/keys instead of letting them reach the slot.
  function badge(movie) {
    const el = document.createElement("span");
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    el.dataset.ytKey = YT.cacheKey(movie);
    el._movie = movie;
    paintBadge(el, movie);
    const activate = (e) => {
      e.preventDefault();
      e.stopPropagation();
      open(movie);
    };
    el.addEventListener("click", activate);
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") activate(e);
    });
    el.addEventListener("keyup", (e) => { if (e.key === " ") { e.preventDefault(); e.stopPropagation(); } });
    return el;
  }

  // ---------- dialog ----------

  let overlay = null;
  let current = null;

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "overlay hidden";
    overlay.id = "ytOverlay";
    overlay.innerHTML =
      '<div class="dialog yt-dialog" role="dialog" aria-modal="true" aria-labelledby="ytDialogTitle">' +
      '<button class="close-x" id="ytClose" aria-label="Close">✕</button>' +
      '<h2 id="ytDialogTitle">Free on YouTube?</h2>' +
      '<div id="ytBody"></div>' +
      '<div class="dialog-buttons spaced">' +
      '<button class="btn-cancel" id="ytRecheck">Recheck now</button>' +
      '<button class="btn-primary" id="ytDone">Done</button>' +
      "</div></div>";
    document.body.appendChild(overlay);
    const close = () => { overlay.classList.add("hidden"); current = null; };
    overlay.querySelector("#ytClose").onclick = close;
    overlay.querySelector("#ytDone").onclick = close;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && current) close();
    });
    overlay.querySelector("#ytRecheck").onclick = () => {
      if (current) YT.ensure(current, { force: true });
      renderBody();
    };
  }

  function open(movie) {
    if (!overlay) buildOverlay();
    current = movie;
    renderBody();
    overlay.classList.remove("hidden");
    // Fresh enough results show instantly; stale ones refresh in place.
    YT.ensure(movie).then(() => { if (current === movie) renderBody(); });
  }

  function resultHtml(r) {
    return '<li class="yt-result">' +
      '<div class="yt-vtitle">' + esc(r.title) + "</div>" +
      '<div class="yt-meta">' + esc(r.channel) + " · " + esc(r.offer) + "</div>" +
      (r.durationSec ? '<div class="yt-meta">Running time ' + YT.formatDuration(r.durationSec) + "</div>" : "") +
      '<div class="yt-actions">' +
      '<a class="yt-watch" href="' + esc(r.url) + '" target="_blank" rel="noopener">▶ Open on YouTube</a>' +
      "</div></li>";
  }

  function renderBody() {
    if (!overlay || !current) return;
    const body = overlay.querySelector("#ytBody");
    const st = YT.state(current);
    const rec = st.record;
    const movieLine = '<p class="yt-movie">' + esc(current.title) + (current.year ? " (" + esc(current.year) + ")" : "") + "</p>";
    const recheck = overlay.querySelector("#ytRecheck");
    recheck.disabled = st.checking;
    recheck.textContent = st.checking ? "Checking…" : "Recheck now";

    if (!rec) {
      body.innerHTML = movieLine + '<p class="yt-checking">Checking YouTube Movies &amp; TV…</p>';
      return;
    }
    let html = movieLine +
      '<div class="yt-status ' + rec.status + '">' + esc(YT.STATUS_TEXT[rec.status]) + "</div>" +
      '<p class="small yt-explain">' + esc(EXPLAIN[rec.status]) + "</p>";
    if (rec.results && rec.results.length) {
      html += '<ul class="yt-results">' + rec.results.map(resultHtml).join("") + "</ul>";
    }
    html += '<p class="yt-checked">Last checked ' + esc(fmtDate(rec.checkedAt)) +
      (rec.source ? " via " + esc(rec.source) : "") +
      (st.checking ? " · rechecking now…" : "") + "</p>";
    if (rec.lastError) html += '<p class="yt-checked">Latest recheck failed; showing the previous result.</p>';
    if (rec.status === "error" && rec.error) html += '<p class="yt-checked">' + esc(rec.error) + "</p>";
    if (rec.tmdbLink) html += '<p class="yt-checked"><a href="' + esc(rec.tmdbLink) + '" target="_blank" rel="noopener">All US where-to-watch options</a></p>';
    html += '<p class="yt-fine">Official YouTube Movies &amp; TV listings only (US), from TMDB/JustWatch &mdash; no user uploads. Free titles come and go, so this is rechecked every couple of days.</p>';
    body.innerHTML = html;
  }

  // ---------- inline summary (used in the slot's dialog) ----------

  function inline(container, movie) {
    if (!container) return;
    if (!movie || !movie.title) { container.innerHTML = ""; return; }
    const draw = () => {
      if (!container.isConnected) return;
      const s = badgeState(movie);
      container.innerHTML = "";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "yt-inline";
      btn.innerHTML = '<span class="yt-badge ' + s.cls + '"><span class="yt-play" aria-hidden="true"></span><span class="yt-text">' + esc(s.text) + "</span></span>" +
        '<span class="yt-inline-text">Free on YouTube? <strong>' + esc(s.label) + "</strong></span>";
      btn.onclick = () => open(movie);
      container.appendChild(btn);
    };
    container._ytDraw = draw;
    container.dataset.ytKey = YT.cacheKey(movie);
    draw();
    YT.ensure(movie);
  }

  YT.subscribe((key) => {
    document.querySelectorAll('[data-yt-key="' + CSS.escape(key) + '"]').forEach((el) => {
      if (el._ytDraw) el._ytDraw();
      else if (el._movie) paintBadge(el, el._movie);
    });
    if (current && YT.cacheKey(current) === key) renderBody();
  });

  // ---------- background rechecks ----------

  // Checks every loaded movie that has no result or a stale one. Runs at
  // start-up, every 30 minutes while open, and when the app comes back to
  // the foreground. YTFree.ensure queues them one at a time.
  function startScheduler(getMovies) {
    const sweep = () => {
      if (navigator.onLine === false) return;
      (getMovies() || []).forEach((m) => {
        if (m && m.title && YT.isStale(YT.getCached(m))) YT.ensure(m);
      });
    };
    setTimeout(sweep, 1500);
    setInterval(sweep, 30 * 60 * 1000);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sweep(); });
    window.addEventListener("online", sweep);
  }

  window.YTFreeUI = { badge, open, inline, startScheduler };
})();
