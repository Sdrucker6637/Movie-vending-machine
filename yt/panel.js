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
    possible: "Maybe",
    unavailable: "No",
    error: "?"
  };
  const EXPLAIN = {
    free_ads: "A full-length upload looks watchable right now at no cost. Expect ads.",
    free: "A full-length upload looks watchable right now with no rental or purchase. YouTube may still show ads.",
    possible: "There's a promising long upload, but it couldn't be confirmed as the complete movie, playable for you, and free.",
    unavailable: "No credible full-length free upload turned up.",
    error: "YouTube couldn't be searched just now. Adding a YouTube API key in Settings makes checks more reliable."
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
    el.setAttribute("aria-label", "Free on YouTube? " + s.label + ". Show uploads");
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

  function resultHtml(r, runtimeMin, idx) {
    const rt = runtimeMin ? " <span class=\"yt-dim\">(movie runs " + runtimeMin + " min)</span>" : "";
    let parts = "";
    if (r.parts && r.parts.length) {
      parts = '<ol class="yt-parts">' + r.parts.map((p) =>
        '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">Part ' + p.part + "</a> · " + YT.formatDuration(p.durationSec) + "</li>").join("") + "</ol>";
    }
    const tag = r.confirmed ? '<span class="yt-tag ok">Full movie</span>' :
      r.playable === false ? '<span class="yt-tag no">Not playable</span>' :
      '<span class="yt-tag maybe">Unconfirmed</span>';
    return '<li class="yt-result">' +
      '<a class="yt-vtitle" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.title) + "</a>" +
      '<div class="yt-meta">' + tag + " " + esc(r.channel || "Unknown channel") + "</div>" +
      '<div class="yt-meta">Length ' + YT.formatDuration(r.durationSec) + rt + "</div>" +
      (r.notes && r.notes.length ? '<ul class="yt-notes">' + r.notes.map((n) => "<li>" + esc(n) + "</li>").join("") + "</ul>" : "") +
      parts +
      '<div class="yt-actions">' +
      '<a class="yt-watch" href="' + esc(r.url) + '" target="_blank" rel="noopener">▶ Watch on YouTube</a>' +
      '<button type="button" class="yt-hide" data-idx="' + idx + '" title="Hide this upload and everything else from ' + esc(r.channel || "this channel") + '">✕ Not the movie</button>' +
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
      body.innerHTML = movieLine + '<p class="yt-checking">Searching YouTube for full-length uploads…</p>';
      return;
    }
    let html = movieLine +
      '<div class="yt-status ' + rec.status + '">' + esc(YT.STATUS_TEXT[rec.status]) + "</div>" +
      '<p class="small yt-explain">' + esc(EXPLAIN[rec.status]) + "</p>";
    if (rec.results && rec.results.length) {
      html += '<div class="watch-label left">' + (rec.results.length > 1 ? "Best " + rec.results.length + " uploads" : "Best upload") + "</div>";
      html += '<ul class="yt-results">' + rec.results.map((r, i) => resultHtml(r, rec.runtimeMin, i)).join("") + "</ul>";
    }
    html += '<p class="yt-checked">Last checked ' + esc(fmtDate(rec.checkedAt)) +
      (rec.source ? " via " + esc(rec.source) : "") +
      (st.checking ? " · rechecking now…" : "") + "</p>";
    if (rec.lastError) html += '<p class="yt-checked">Latest recheck failed; showing the previous result.</p>';
    if (rec.status === "error" && rec.error) html += '<p class="yt-checked">' + esc(rec.error) + "</p>";
    html += '<p class="yt-fine">Includes uploads from anyone, not just studios. If one turns out to be a review, watch-along or clip, tap &ldquo;Not the movie&rdquo; and that channel is skipped from then on. Results are rechecked every few days.</p>';
    body.innerHTML = html;
    body.querySelectorAll(".yt-hide").forEach((b) => {
      b.onclick = () => {
        const r = rec.results[+b.dataset.idx];
        if (!r || !current) return;
        YT.hideUpload(current, r);
        renderBody();
      };
    });
  }

  // ---------- inline summary (used in the slot's dialog) ----------

  function inline(container, movie) {
    if (!container) return;
    if (!movie || !movie.title) { container.innerHTML = ""; return; }
    const draw = () => {
      if (!container.isConnected) return;
      const s = badgeState(movie);
      const rec = YT.state(movie).record;
      const n = rec && rec.results ? rec.results.length : 0;
      container.innerHTML = "";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "yt-inline";
      btn.innerHTML = '<span class="yt-badge ' + s.cls + '"><span class="yt-play" aria-hidden="true"></span><span class="yt-text">' + esc(s.text) + "</span></span>" +
        '<span class="yt-inline-text">Free on YouTube? <strong>' + esc(s.label) + "</strong>" +
        (n ? " · " + n + " upload" + (n > 1 ? "s" : "") : "") + "</span>";
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
