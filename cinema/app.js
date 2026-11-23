/* =========================================================
   My Cinema - the little picture house built around your
   Letterboxd history. Views: Lobby, Statistics, Taste,
   Picks, Trophies, (secret) Projection Booth, Box Office.
   ========================================================= */
import { buildLibrary, applyFilters, filterOptions, overview, genreStats, directorStats, actorStats, runtimeStats, timeStats, decadeStats, worldStats, rewatchStats, ratingDistribution, topBottom, contrarian } from "./lib/stats.js";
import { tasteProfile, MIN_RATED_FOR_PROFILE } from "./lib/taste.js";
import { recommend, buildProfile, wildcard, MODES } from "./lib/recommend.js";
import { evaluateAchievements, boothUnlocked } from "./lib/achievements.js";
import { posterUrl } from "./lib/meta.js";
import { parseLetterboxdExport, exportFileKind } from "./lib/csv.js";
import { readZip, browserInflateRaw } from "./lib/zip.js";
import { letterboxdFilmUrl, plural } from "./lib/util.js";
import { loadData, loadConfig, local, hasToken, setToken, dispatchSync, latestRun, uploadImport, lsGet, lsSet, LS } from "./ui/data.js";
import { hbars, divergingBars, columns, axisDial, starsHtml, esc, fmt1 } from "./ui/charts.js";
import { stubby, professor, professorMood, popcornMachine, reelLoader, badge, boothDoor, ticketSvg } from "./ui/art.js";
import { initEggs, usher, maybeIntertitle, flyTicket } from "./ui/eggs.js";

const $ = (s, el) => (el || document).querySelector(s);
const view = $("#view");
const state = { data: null, lib: null, filters: lsGet(LS.filters, {}), drills: {}, profileKey: null, profile: null, picksSeed: Date.now(), error: null };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ---------- Helpers ---------- */

function ago(iso) {
  if (!iso) return "never";
  const s = (Date.now() - Date.parse(iso)) / 1000;
  if (s < 90) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400 * 2) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
}
function when(iso) {
  return iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "–";
}
const num = (n) => (n === null || n === undefined ? "–" : Math.round(n).toLocaleString("en-US"));

function poster(m, size, alt) {
  const u = posterUrl(m, size || "w185");
  return u ? `<img src="${u}" alt="${esc(alt || (m && m.title) || "")}" loading="lazy" decoding="async">` : `<span class="noposter" aria-hidden="true">${esc(((m && m.title) || alt || "?").slice(0, 1))}</span>`;
}

function filmChip(f, extra) {
  return `<button type="button" class="film-chip" data-film="${esc(f.key)}" title="${esc(f.title)}${f.year ? " (" + f.year + ")" : ""}">${poster(f.meta, "w154", f.title)}<span class="fc-title">${esc(f.title)}</span><span class="fc-meta">${f.year || ""} ${starsHtml(f.rating)}${f.liked ? ' <span class="heart" title="Liked">♥</span>' : ""}${extra ? " " + extra : ""}</span></button>`;
}
function filmStrip(films, extraFn) {
  if (!films.length) return `<p class="empty-note">No films here yet.</p>`;
  return `<div class="film-strip">${films.map((f) => filmChip(f, extraFn ? extraFn(f) : "")).join("")}</div>`;
}

function drill(id, title, rows) { state.drills[id] = { title, rows }; return id; }

function section(title, body, o) {
  return `<section class="panel${o && o.cls ? " " + o.cls : ""}"${o && o.id ? ` id="${o.id}"` : ""}><h3 class="panel-title"><span>${title}</span></h3>${o && o.note ? `<p class="panel-note">${o.note}</p>` : ""}${body}</section>`;
}

function getProfile() {
  const key = JSON.stringify([local.feedback(), local.favorites()]);
  if (state.profileKey !== key || !state.profile) {
    state.profile = buildProfile(state.lib, { feedback: local.feedback(), favorites: local.favorites().filter((k) => typeof k === "number"), meta: state.data.meta });
    state.profileKey = key;
  }
  return state.profile;
}

/* ---------- Shell ---------- */

const TABS = [["lobby", "Lobby"], ["stats", "Statistics"], ["taste", "Taste"], ["picks", "Picks"], ["trophies", "Trophies"], ["box", "Box Office"]];

function renderNav(active) {
  $("#cinemaNav").innerHTML = TABS.map(([id, label]) => `<a href="#${id}" class="tab${active === id ? " active" : ""}"${active === id ? ' aria-current="page"' : ""}>${label}</a>`).join("");
  const st = state.data && state.data.status;
  const pill = $("#syncPill");
  if (!state.data) { pill.className = "sync-pill"; pill.textContent = "Loading…"; return; }
  if (!state.data.connected) { pill.className = "sync-pill off"; pill.innerHTML = "Not connected"; return; }
  const stale = !st.lastSuccessAt || Date.now() - Date.parse(st.lastSuccessAt) > 13 * 3600 * 1000;
  pill.className = "sync-pill " + (st.ok && !stale ? "on" : "warn");
  pill.innerHTML = `<span class="dot"></span>${st.ok ? "Synced " + ago(st.lastSuccessAt) : "Sync trouble"}`;
}

async function boot(bust) {
  view.innerHTML = reelLoader("Threading the projector…");
  try {
    state.data = await loadData(bust);
    state.error = null;
    if (state.data.connected && state.data.db) state.lib = buildLibrary(state.data.db, state.data.meta);
    else state.lib = null;
    state.profile = null;
  } catch (e) {
    state.error = e;
    state.data = { connected: false, cfg: await loadConfig().catch(() => ({})) };
  }
  route();
  checkNewAchievements();
}

function route() {
  const [name, sub] = (location.hash.replace(/^#/, "") || "lobby").split("/");
  const tab = TABS.some(([id]) => id === name) ? name : name === "booth" ? "trophies" : "lobby";
  renderNav(tab);
  state.drills = {};
  window.scrollTo({ top: 0 });
  if (name === "box") return renderBox();
  if (!state.lib) return renderDisconnected();
  if (name === "stats") renderStats(sub || "genres");
  else if (name === "taste") renderTaste();
  else if (name === "picks") renderPicks(sub || "favorites");
  else if (name === "trophies") renderTrophies();
  else if (name === "booth") renderBooth();
  else renderLobby();
  maybeIntertitle();
}

function renderDisconnected() {
  const cfg = (state.data && state.data.cfg) || {};
  view.innerHTML = `<div class="empty-house">
  <div class="empty-art">${stubby("sweep")}</div>
  <div class="empty-copy">
    <h2>The house is dark tonight</h2>
    ${state.error ? `<p class="err">Couldn't reach the film vault: ${esc(state.error.message)}. Check your connection and try again.</p>` : `<p>No Letterboxd history has been synced for <strong>${esc(cfg.letterboxdUser || "your account")}</strong> yet. The projector warms up after the first sync.</p>`}
    <ol class="steps">
      <li>Add a free TMDB API key as a repository secret named <code>TMDB_API_KEY</code> (GitHub → Settings → Secrets and variables → Actions).</li>
      <li>Merge this branch into <code>main</code>. The sync then runs on its own every ${cfg.syncEveryHours || 6} hours.</li>
      <li>In the <a href="#box">Box Office</a>, import your Letterboxd export once for your full history, then press <strong>Sync Now</strong>.</li>
    </ol>
    <p><a class="btn-primary inline" href="#box">Go to the Box Office</a> <button type="button" class="btn-cancel inline" id="retryBtn">Try again</button></p>
  </div></div>`;
  $("#retryBtn").onclick = () => boot(true);
}

/* ---------- Lobby ---------- */

function renderLobby() {
  const lib = state.lib;
  const o = overview(lib);
  const st = state.data.status;
  const mood = professorMood(o.avgRating);
  const moodLine = { ecstatic: "A generous patron! The house adores you.", pleased: "Splendid taste, splendid taste.", pondering: "Hmm. A discerning sort, I see.", grumpy: "Tough crowd tonight!", sleepy: "Wake me when you've rated something." }[mood];
  const localWl = local.watchlist().length;
  const tiles = [
    ["Films Watched", num(o.totalWatches), `${num(o.diaryEntries)} diary entries`],
    ["Unique Films", num(o.uniqueFilms), `${num(o.likes)} liked ♥`],
    ["Average Rating", o.avgRating ? fmt1(o.avgRating) + "★" : "–", `${num(o.ratedFilms)} rated`],
    ["Reviews Written", num(o.reviews), ""],
    ["Hours in the Dark", num(o.hours), o.missingRuntime ? `${num(o.missingRuntime)} without a runtime yet` : `${(o.hours / 24).toFixed(1)} days`],
    [`Watched in ${o.thisYearLabel}`, num(o.thisYear), ""],
    ["Directors Explored", num(o.directors), ""],
    ["Actors Encountered", num(o.actors), ""],
    ["Watchlist", num(o.watchlist + localWl), localWl ? `${num(localWl)} added here` : "from your CSV import"]
  ];
  const t = timeStats(lib);
  const months = t.months.slice(-24).map((m) => ({ ...m, value: m.count, short: m.key.endsWith("-01") ? m.key.slice(0, 4) : (Number(m.key.slice(5)) - 1) % 3 === 0 ? MONTHS[Number(m.key.slice(5)) - 1] : "", title: `${MONTHS[Number(m.key.slice(5)) - 1]} ${m.key.slice(0, 4)}` }));
  drill("lobbyMonths", "Watched in", months.map((m) => ({ label: m.title, films: m.films })));
  const rd = ratingDistribution(lib);
  drill("lobbyRatings", "Rated", rd.buckets.map((b) => ({ label: b.label + "★", films: b.films })));
  const dec = decadeStats(lib);
  drill("lobbyDecades", "Released in the", dec.map((d) => ({ label: d.label, films: d.films })));
  const recent = [...lib.viewings].filter((v) => v.date).sort((a, b) => b.date.localeCompare(a.date) || String(b.loggedAt).localeCompare(String(a.loggedAt))).slice(0, 10);
  const favKeys = local.favorites();
  const favFilms = favKeys.map((k) => lib.films.find((f) => f.key === k)).filter(Boolean);
  const g = genreStats(lib);

  view.innerHTML = `
  <div class="lobby-top">
    <div class="tiles">${tiles.map(([label, value, sub], i) => `<div class="tile" style="--i:${i}"><span class="tile-label">${label}</span><span class="tile-value">${value}</span>${sub ? `<span class="tile-sub">${esc(sub)}</span>` : ""}</div>`).join("")}</div>
    <aside class="critic-card" aria-label="Professor Stars">
      <button type="button" class="critic" id="professorBtn" aria-label="Poke Professor Stars">${professor(mood)}</button>
      <p class="speech">${esc(moodLine)}<small>Professor Stars reads your ${o.avgRating ? fmt1(o.avgRating) + "★ average" : "ratings"}</small></p>
      ${o.metaCoverage < 0.98 ? `<p class="meta-note">${num(o.withoutMeta)} film${o.withoutMeta === 1 ? "" : "s"} still waiting for TMDB details${st.tmdb && st.tmdb.pending ? " (next sync)" : ""}.</p>` : ""}
    </aside>
  </div>
  <div class="grid2">
    ${section("Reels per Month", columns(months, { drill: "lobbyMonths", allLabels: true, empty: "No dated diary entries yet." }), { note: "Your last 24 months. Tap a month for its films." })}
    ${section("How You Rate", columns(rd.buckets.map((b) => ({ ...b, value: b.count, short: b.key % 1 ? "½" : b.label + "★", title: b.label + " stars" })), { drill: "lobbyRatings", allLabels: true }), { note: `${rd.unrated ? num(rd.unrated) + " films unrated. " : ""}Median ${rd.median ?? "–"}★.` })}
  </div>
  <div class="grid2">
    ${section("Release Decades", hbars(dec.map((d) => ({ label: d.label, value: d.count, sub: d.avg ? fmt1(d.avg) + "★ avg" : "", films: d.films })), { drill: "lobbyDecades" }))}
    ${section("Genres at a Glance", `<div class="split"><div><h4>Most watched</h4>${hbars(g.mostWatched.slice(0, 5).map((x) => ({ label: x.label, value: x.count, films: x.films })), { drill: drill("lobbyG1", "Genre:", g.mostWatched.slice(0, 5)) })}</div><div><h4>Best rated</h4>${hbars(g.highest.slice(0, 5).map((x) => ({ label: x.label, value: x.avg, sub: `${x.rated} rated`, films: x.films })), { drill: drill("lobbyG2", "Genre:", g.highest.slice(0, 5)), format: (v) => fmt1(v) + "★", max: 5 })}</div></div><p class="panel-note"><a href="#stats/genres">All genre statistics →</a></p>`)}
  </div>
  <div class="grid2">
    ${section("Now Showing: Recent Diary", recent.length ? `<ul class="diary">${recent.map((v) => `<li><button type="button" class="diary-row" data-film="${esc(v.f.key)}">${poster(v.f.meta, "w92", v.f.title)}<span><strong>${esc(v.f.title)}</strong> <em>${v.f.year || ""}</em><br><small>${esc(v.date)} · ${starsHtml(v.rating)}${v.rewatch ? " · rewatch" : ""}${v.review ? " · reviewed" : ""}</small></span></button></li>`).join("")}</ul>` : `<p class="empty-note">No dated diary entries yet.</p>`)}
    ${section("Hall of Fame", `${favFilms.length ? filmStrip(favFilms) : `<p class="empty-note">Open any film and press <strong>★ Hall of Fame</strong> to pin it here. A ticket gets printed every time.</p>`}<div class="popcorn-stand"><button type="button" id="popcornBtn" class="popcorn-btn" aria-label="Crank the popcorn machine">${popcornMachine()}</button><p class="tiny">Fresh popcorn - give the crank a turn.</p></div>`)}
  </div>`;
  $("#professorBtn").onclick = (e) => { e.currentTarget.classList.remove("boing"); void e.currentTarget.offsetWidth; e.currentTarget.classList.add("boing"); usher.say(o.avgRating ? `The Professor says your ${fmt1(o.avgRating)}★ average is ${mood === "grumpy" ? "frankly stingy" : mood === "pondering" ? "carefully considered" : mood === "pleased" ? "just right" : "positively glowing"}.` : "The Professor is napping. Rate a few films to wake him!", "point"); };
}

/* ---------- Statistics ---------- */

const STAT_SECTIONS = [["genres", "Genres"], ["directors", "Directors"], ["actors", "Actors"], ["runtime", "Runtime"], ["timeline", "Timeline"], ["decades", "Decades"], ["world", "World"], ["ratings", "Ratings"], ["films", "All Films"]];

function filterBar(lib) {
  const opts = filterOptions(lib);
  const f = state.filters;
  const sel = (name, label, values, fmt) => `<label class="filter"><span>${label}</span><select data-filter="${name}"><option value="">All</option>${values.map((v) => `<option value="${v}"${String(f[name] ?? "") === String(v) ? " selected" : ""}>${fmt ? fmt(v) : v}</option>`).join("")}</select></label>`;
  const active = Object.values(f).some((v) => v !== "" && v !== null && v !== undefined);
  return `<div class="filter-bar" role="group" aria-label="Filters">${sel("year", "Year watched", opts.years)}${sel("decade", "Decade", opts.decades, (d) => d + "s")}${sel("genre", "Genre", opts.genres)}${sel("rating", "Rating", [...opts.ratings, "unrated"], (r) => (r === "unrated" ? "Unrated" : r + "★"))}${active ? `<button type="button" class="clear-filters" id="clearFilters">Clear</button>` : ""}</div>`;
}

function renderStats(sub) {
  const lib = applyFilters(state.lib, state.filters);
  const tabs = `<nav class="subtabs" aria-label="Statistics sections">${STAT_SECTIONS.map(([id, label]) => `<a href="#stats/${id}" class="${id === sub ? "active" : ""}">${label}</a>`).join("")}</nav>`;
  const summary = `<p class="filter-summary">${plural(lib.films.length, "film")} · ${plural(lib.viewings.length, "diary entry", "diary entries")}${lib.filteredMean ? ` · ${fmt1(lib.filteredMean)}★ average` : ""}</p>`;
  let body = "";
  const mu = state.lib.mean;
  if (!lib.films.length) body = `<p class="empty-note big">No films match these filters.</p>`;
  else if (sub === "genres") {
    const g = genreStats(lib);
    drill("gMost", "Genre:", g.mostWatched);
    drill("gHi", "Genre:", g.highest);
    drill("gLo", "Genre:", g.lowest);
    drill("gAvg", "Genre:", g.all.filter((x) => x.rated).sort((a, b) => b.avg - a.avg));
    body = `<div class="grid2">
      ${section("Most Watched Genres", hbars(g.mostWatched.map((x) => ({ label: x.label, value: x.count, sub: `${Math.round(x.count / lib.films.length * 100)}% of films`, films: x.films })), { drill: "gMost" }))}
      ${section("Average Rating by Genre", divergingBars(g.all.filter((x) => x.rated).sort((a, b) => b.avg - a.avg).map((x) => ({ label: x.label, value: x.avg, sub: `${x.rated} rated`, films: x.films })), mu, { drill: "gAvg" }))}
    </div><div class="grid2">
      ${section("Highest-Rated Genres", hbars(g.highest.slice(0, 8).map((x) => ({ label: x.label, value: x.shrunk, sub: `${fmt1(x.avg)}★ raw · ${x.rated} rated`, films: x.films })), { drill: "gHi", format: (v) => fmt1(v) + "★", max: 5, empty: "Genres need 3+ rated films to be ranked." }), { note: "Ranked by a weighted average that pulls genres with only a few films toward your overall average, so one 5★ musical doesn't top the chart." })}
      ${section("Lowest-Rated Genres", hbars(g.lowest.slice(0, 8).map((x) => ({ label: x.label, value: x.shrunk, sub: `${fmt1(x.avg)}★ raw · ${x.rated} rated`, films: x.films })), { drill: "gLo", format: (v) => fmt1(v) + "★", max: 5, tone: "cool" }))}
    </div>
    ${section("Genre Distribution", `<div class="dist">${g.distribution.map((x, i) => `<button type="button" class="dist-seg" style="--s:${(x.share * 100).toFixed(2)}%" data-drill="gMost" data-idx="${i}" title="${esc(x.label)}: ${Math.round(x.share * 100)}% of genre tags">${x.share > 0.06 ? esc(x.label) : ""}</button>`).join("")}</div><p class="panel-note">Share of all genre tags (a film can have several). Tap a band for its films.</p>`)}`;
  } else if (sub === "directors") {
    const d = directorStats(lib);
    const people = state.data.people.directors || {};
    const seen = new Set(state.lib.films.map((f) => f.tmdbId));
    drill("dMost", "Directed by", d.mostWatched);
    drill("dHi", "Directed by", d.highest);
    drill("dCons", "Directed by", d.consistent);
    const completion = Object.entries(people).map(([pid, p]) => {
      const fl = (p.films || []).filter((x) => x.voteCount >= 20 && x.year && x.year <= new Date().getFullYear());
      return { pid, name: p.name, of: fl.length, got: fl.filter((x) => seen.has(x.id)).length };
    }).filter((x) => x.of >= 3).sort((a, b) => b.got / b.of - a.got / a.of || b.got - a.got).slice(0, 10);
    let unexplored = [];
    try { unexplored = recommend(state.lib, state.data.candidates, state.data.meta, { mode: "directors", limit: 8, profile: getProfile(), watchlistIds: [...watchlistIds()], localWatched: local.watched(), feedback: local.feedback() }).items; } catch { unexplored = []; }
    body = `<div class="grid2">
      ${section("Most Watched Directors", hbars(d.mostWatched.slice(0, 12).map((x) => ({ label: x.label, value: x.count, sub: x.avg ? fmt1(x.avg) + "★ avg" : "", films: x.films })), { drill: "dMost" }), { note: `${num(d.explored)} directors explored.` })}
      ${section("Highest-Rated Directors", hbars(d.highest.slice(0, 12).map((x) => ({ label: x.label, value: x.avg, sub: `${x.rated} rated`, films: x.films })), { drill: "dHi", format: (v) => fmt1(v) + "★", max: 5, empty: "Directors need 2+ rated films." }))}
    </div><div class="grid2">
      ${section("Most Consistent", hbars(d.consistent.slice(0, 8).map((x) => ({ label: x.label, value: x.std, sub: `${fmt1(x.avg)}★ avg over ${x.rated}`, films: x.films })), { drill: "dCons", format: (v) => "±" + v.toFixed(2), tone: "cool", empty: "Needs directors with 3+ rated films." }), { note: "Smallest spread between your ratings of their films." })}
      ${section("Filmography Progress", completion.length ? `<ul class="progress-list">${completion.map((c) => `<li><span>${esc(c.name)}</span><span class="pbar"><span style="--w:${(c.got / c.of * 100).toFixed(0)}%"></span></span><span>${c.got}/${c.of}</span></li>`).join("")}</ul>` : `<p class="empty-note">Filmographies arrive with the next sync.</p>`, { note: "Feature films per TMDB (titles with very few votes are left out)." })}
    </div>
    ${section("Directors You Haven't Explored", unexplored.length ? `<div class="rec-mini">${unexplored.map((r) => `<a href="#picks/directors" class="mini-card">${poster(r.meta, "w154")}<strong>${esc(r.meta.directors[0].name)}</strong><small>Start with ${esc(r.meta.title)} (${r.meta.year || "?"})</small></a>`).join("")}</div>` : `<p class="empty-note">Suggestions appear once recommendations have synced.</p>`, { note: "Directors with no films in your history whose work matches your taste." })}`;
  } else if (sub === "actors") {
    const a = actorStats(lib);
    drill("aMost", "Featuring", a.mostWatched);
    drill("aHi", "Featuring", a.highest);
    drill("aEnjoy", "Featuring", a.enjoy);
    drill("aCons", "Featuring", a.consistent);
    body = `<div class="grid2">
      ${section("Most Frequent Faces", hbars(a.mostWatched.slice(0, 14).map((x) => ({ label: x.label, value: x.count, sub: x.avg ? fmt1(x.avg) + "★ avg" : "", films: x.films })), { drill: "aMost" }), { note: "Top-billed cast (first eight credits) from TMDB." })}
      ${section("Highest-Rated Actors", hbars(a.highest.slice(0, 14).map((x) => ({ label: x.label, value: x.shrunk, sub: `${fmt1(x.avg)}★ raw · ${x.rated} films`, films: x.films })), { drill: "aHi", format: (v) => fmt1(v) + "★", max: 5, empty: "Actors need 3+ rated films." }), { note: "Weighted toward your average when there are only a few films." })}
    </div><div class="grid2">
      ${section("Actors You Consistently Enjoy", hbars(a.enjoy.slice(0, 10).map((x) => ({ label: x.label, value: x.avg, sub: `${x.rated} films · spread ±${(x.std ?? 0).toFixed(2)}`, films: x.films })), { drill: "aEnjoy", format: (v) => fmt1(v) + "★", max: 5, empty: "No one yet: needs 3+ films above your average with steady ratings." }))}
      ${section("Most Consistent Ratings", hbars(a.consistent.slice(0, 10).map((x) => ({ label: x.label, value: x.std, sub: `${fmt1(x.avg)}★ over ${x.rated}`, films: x.films })), { drill: "aCons", format: (v) => "±" + v.toFixed(2), tone: "cool" }))}
    </div>`;
  } else if (sub === "runtime") {
    const r = runtimeStats(lib);
    drill("rHist", "Running", r.histogram.map((b) => ({ ...b, label: b.label + " min" })));
    drill("rCat", "Runtime", r.byCategory);
    body = `<div class="tiles small">
      <div class="tile"><span class="tile-label">Average</span><span class="tile-value">${num(r.average)}<small> min</small></span></div>
      <div class="tile"><span class="tile-label">Median</span><span class="tile-value">${num(r.median)}<small> min</small></span></div>
      <div class="tile"><span class="tile-label">Timed films</span><span class="tile-value">${num(r.count)}</span>${r.missing ? `<span class="tile-sub">${r.missing} unknown</span>` : ""}</div>
    </div>
    <p class="verdict">${esc(r.tendency)}.</p>
    <div class="grid2">
      ${section("Runtime Distribution", columns(r.histogram.map((b) => ({ ...b, value: b.count, short: b.label, title: b.label + " minutes" })), { drill: "rHist", allLabels: true }))}
      ${section("Average Rating by Length", divergingBars(r.byCategory.filter((c) => c.rated).map((c) => ({ label: c.label, value: c.avg, sub: `${c.rated} rated`, films: c.films })), mu, { drill: "rCat" }))}
    </div><div class="grid2">
      ${section("Shortest", filmStrip(r.shortest, (f) => `<span class="rt">${f.runtime}′</span>`))}
      ${section("Longest", filmStrip(r.longest, (f) => `<span class="rt">${f.runtime}′</span>`))}
    </div>`;
  } else if (sub === "timeline") {
    const t = timeStats(lib);
    const rw = rewatchStats(lib);
    const months = t.months.map((m) => ({ ...m, value: m.count, short: m.key.endsWith("-01") ? m.key.slice(0, 4) : "", title: `${MONTHS[Number(m.key.slice(5)) - 1]} ${m.key.slice(0, 4)}` }));
    drill("tMonths", "Watched in", months.map((m) => ({ label: m.title, films: m.films })));
    drill("tYears", "Watched in", t.years);
    drill("tBusy", "Watched in", t.busiestMonths.map((m) => ({ ...m, label: `${MONTHS[Number(m.key.slice(5)) - 1]} ${m.key.slice(0, 4)}` })));
    body = `${section("Every Month at the Movies", columns(months, { drill: "tMonths", scroll: months.length > 36, allLabels: true }), { note: `${t.undated ? num(t.undated) + " diary entries have no date. " : ""}Scroll sideways for older months.` })}
    <div class="grid2">
      ${section("By Year", hbars(t.years.map((y) => ({ ...y, value: y.count })).reverse(), { drill: "tYears" }))}
      ${section("Busiest Months", hbars(t.busiestMonths.map((m) => ({ label: `${MONTHS[Number(m.key.slice(5)) - 1]} ${m.key.slice(0, 4)}`, value: m.count, films: m.films })), { drill: "tBusy" }))}
    </div><div class="grid2">
      ${section("Month of the Year", columns(t.monthOfYear.map((n, i) => ({ label: MONTHS[i], value: n })), { allLabels: true }))}
      ${section("Day of the Week", columns(t.weekday.map((n, i) => ({ label: WEEKDAYS[i], value: n })), { allLabels: true }), { note: "From the watched date in your diary." })}
    </div>
    ${section("First Watches vs Rewatches", `<div class="split"><div class="versus"><span class="big">${num(rw.firstTime)}</span><span>first watches</span></div><div class="versus alt"><span class="big">${num(rw.rewatches)}</span><span>rewatches</span></div></div>${rw.mostRewatched.length ? `<h4>Most revisited</h4>${filmStrip(rw.mostRewatched, (f) => `<span class="rt">×${f.times}</span>`)}` : ""}`)}`;
  } else if (sub === "decades") {
    const d = decadeStats(lib);
    drill("decC", "Released in the", d);
    drill("decA", "Released in the", d.filter((x) => x.rated));
    body = `<div class="grid2">
      ${section("Films by Release Decade", columns(d.map((x) => ({ ...x, value: x.count, short: "’" + String(x.key).slice(2) })), { drill: "decC", allLabels: true }))}
      ${section("Average Rating by Decade", divergingBars(d.filter((x) => x.rated).map((x) => ({ label: x.label, value: x.avg, sub: `${x.rated} rated`, films: x.films })), mu, { drill: "decA" }))}
    </div>`;
  } else if (sub === "world") {
    const w = worldStats(lib);
    drill("wC", "From", w.countries);
    drill("wL", "In", w.languages);
    body = `<div class="grid2">
      ${section("Countries of Origin", hbars(w.countries.slice(0, 20).map((x) => ({ label: x.label, value: x.count, sub: x.avg ? fmt1(x.avg) + "★ avg" : "", films: x.films })), { drill: "wC" }), { note: `${num(w.countries.length)} production countries (TMDB).` })}
      ${section("Original Languages", hbars(w.languages.slice(0, 20).map((x) => ({ label: x.label, value: x.count, sub: x.avg ? fmt1(x.avg) + "★ avg" : "", films: x.films })), { drill: "wL" }), { note: `${num(w.languages.length)} languages.` })}
    </div>`;
  } else if (sub === "ratings") {
    const rd = ratingDistribution(lib);
    const tb = topBottom(lib, 12);
    const c = contrarian(lib, 8);
    drill("rDist", "Rated", rd.buckets.map((b) => ({ ...b, label: b.label + "★" })));
    body = `${section("Rating Distribution", columns(rd.buckets.map((b) => ({ ...b, value: b.count, short: b.label, title: b.label + " stars" })), { drill: "rDist", allLabels: true }), { note: `Mean ${fmt1(rd.mean)}★ · median ${rd.median ?? "–"}★ · ${num(rd.unrated)} unrated.` })}
    <div class="grid2">
      ${section("Highest Rated", filmStrip(tb.highest))}
      ${section("Lowest Rated", filmStrip(tb.lowest))}
    </div><div class="grid2">
      ${section("You Liked It More Than the Crowd", filmStrip(c.above.filter((f) => f.gap > 0.3), (f) => `<span class="rt">TMDB ${fmt1(f.crowd)}</span>`), { note: "Your stars vs TMDB's average (halved to a 5-point scale)." })}
      ${section("The Crowd Liked It More", filmStrip(c.below.filter((f) => f.gap < -0.3), (f) => `<span class="rt">TMDB ${fmt1(f.crowd)}</span>`))}
    </div>`;
  } else if (sub === "films") {
    const q = (state.filmQuery || "").toLowerCase();
    const sort = state.filmSort || "recent";
    let films = lib.films.filter((f) => !q || f.title.toLowerCase().includes(q) || f.directors.some((d) => d.name.toLowerCase().includes(q)));
    const sorters = { recent: (a, b) => String(b.lastDate).localeCompare(String(a.lastDate)), rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1), title: (a, b) => a.title.localeCompare(b.title), year: (a, b) => (a.year || 0) - (b.year || 0) };
    films.sort(sorters[sort]);
    body = `<div class="film-tools"><input type="search" id="filmSearch" placeholder="Search titles or directors" value="${esc(state.filmQuery || "")}" aria-label="Search films"><select id="filmSort" aria-label="Sort">${[["recent", "Recently watched"], ["rating", "Your rating"], ["year", "Release year"], ["title", "Title"]].map(([v, l]) => `<option value="${v}"${v === sort ? " selected" : ""}>${l}</option>`).join("")}</select></div>
    <p class="panel-note">${plural(films.length, "film")}</p>${filmStrip(films.slice(0, 300))}${films.length > 300 ? `<p class="panel-note">Showing the first 300 - narrow it with the search or filters.</p>` : ""}`;
  }
  view.innerHTML = `<div class="stats-head"><h2 class="view-title">Statistics</h2>${filterBar(state.lib)}${summary}</div>${tabs}<div class="stats-body">${body}</div>`;
  view.querySelectorAll("[data-filter]").forEach((s) => s.addEventListener("change", () => { state.filters[s.dataset.filter] = s.value; lsSet(LS.filters, state.filters); renderStats(sub); }));
  const cf = $("#clearFilters");
  if (cf) cf.onclick = () => { state.filters = {}; lsSet(LS.filters, {}); renderStats(sub); };
  const fs = $("#filmSearch");
  if (fs) { fs.oninput = () => { state.filmQuery = fs.value; clearTimeout(state.fsT); state.fsT = setTimeout(() => { renderStats("films"); const n = $("#filmSearch"); n.focus(); n.setSelectionRange(n.value.length, n.value.length); }, 250); }; $("#filmSort").onchange = (e) => { state.filmSort = e.target.value; renderStats("films"); }; }
}

/* ---------- Taste ---------- */

function renderTaste() {
  const p = tasteProfile(state.lib);
  if (!p.enough) {
    view.innerHTML = `<h2 class="view-title">Your Taste</h2><div class="empty-house small"><div class="empty-art">${professor("sleepy")}</div><div class="empty-copy"><p>The Professor needs at least ${MIN_RATED_FOR_PROFILE} rated films to read your taste. You have ${p.rated} so far.</p></div></div>`;
    return;
  }
  const exList = (arr) => (arr && arr.length ? `<div class="examples">${arr.map((f) => filmChip(f)).join("")}</div>` : "");
  const ax = p.axes;
  const axisNote = (a, leftName, rightName) => a.enough ? `${esc(leftName)}: ${fmt1(a.a.avg)}★ over ${a.a.n} films · ${esc(rightName)}: ${fmt1(a.b.avg)}★ over ${a.b.n}` : "Not enough evidence yet on one side.";
  drill("tLoved", "Genre:", p.genresLoved);
  drill("tCold", "Genre:", p.genresCold);
  drill("tSub", "Theme:", p.subgenres);
  drill("tThemesCold", "Theme:", p.themesCold);
  drill("tDir", "Directed by", p.directors);
  drill("tAct", "Featuring", p.actors);
  drill("tDec", "Released in the", p.decades);
  const c = p.contrast;
  view.innerHTML = `<h2 class="view-title">Your Taste</h2>
  <div class="ticket-profile">
    <div class="tp-stub"><span>ADMIT</span><span>ONE</span></div>
    <div class="tp-body">
      <p class="tp-kicker">Tonight's patron is</p>
      <h3 class="tp-name">${esc(p.archetype)}</h3>
      <p class="tp-sub">Read from ${plural(p.rated, "rated film")} and ${plural(state.lib.viewings.filter((v) => v.review).length, "review")}. It changes as you watch more.</p>
    </div>
    <div class="tp-art">${professor(professorMood(p.mean))}</div>
  </div>
  ${section("What I've Learned About You", `<ul class="learned">${p.notes.map((n) => `<li><p>${esc(n.text)}</p>${exList(n.examples)}</li>`).join("")}</ul>`)}
  ${section("Where You Sit", `
    ${axisDial("Laughs", "Tears", ax.emotionalComedic.position, axisNote(ax.emotionalComedic, "Emotional", "Comedic"))}
    ${axisDial("Plot-driven", "Character-driven", ax.characterPlot.position, axisNote(ax.characterPlot, "Character", "Plot"))}
    ${axisDial("Conventional", "Experimental", ax.experimental.position, ax.experimental.enough ? `Unconventional films (surreal, experimental, art-house keywords or obscure foreign films): ${fmt1(ax.experimental.a.avg)}★ over ${ax.experimental.a.n} · everything else ${fmt1(ax.experimental.b.avg)}★` : "Few unconventional films rated so far.")}
    ${p.avgYear && p.lovedYear ? axisDial("Old-time", "Modern", Math.max(-1, Math.min(1, (p.lovedYear - p.avgYear) / 12)), `Films you rate above average were released around ${Math.round(p.lovedYear)}; your overall average is ${Math.round(p.avgYear)}.`) : ""}
    <p class="panel-note">Each dial compares your average rating for films on either side - using genres, TMDB keywords and the words in your reviews - not how many of each you watch.</p>`)}
  <div class="grid2">
    ${section("Genres You Love", divergingBars(p.genresLoved.map((g) => ({ label: g.label, value: g.avg, sub: `${g.rated} rated`, films: g.films })), p.mean, { drill: "tLoved", empty: "No genre stands out yet." }))}
    ${section("Genres That Leave You Cold", divergingBars(p.genresCold.map((g) => ({ label: g.label, value: g.avg, sub: `${g.rated} rated`, films: g.films })), p.mean, { drill: "tCold", empty: "Nothing you consistently dislike. Generous!" }))}
  </div><div class="grid2">
    ${section("Subgenres & Themes You Appreciate", p.subgenres.length ? `<div class="chips">${p.subgenres.map((s, i) => `<button type="button" class="chip-btn" data-drill="tSub" data-idx="${i}">${esc(s.label)} <small>${fmt1(s.avg)}★ · ${s.rated}</small></button>`).join("")}</div>` : `<p class="empty-note">Themes need 3+ rated films each.</p>`, { note: "TMDB keywords on films you rate above your average." })}
    ${section("Themes That Don't Land", p.themesCold.length ? `<div class="chips cold">${p.themesCold.map((s, i) => `<button type="button" class="chip-btn" data-drill="tThemesCold" data-idx="${i}">${esc(s.label)} <small>${fmt1(s.avg)}★ · ${s.rated}</small></button>`).join("")}</div>` : `<p class="empty-note">None yet.</p>`)}
  </div><div class="grid2">
    ${section("Directors You Trust", hbars(p.directors.map((d) => ({ label: d.label, value: d.avg, sub: `${d.rated} films`, films: d.films })), { drill: "tDir", format: (v) => fmt1(v) + "★", max: 5, empty: "Needs 2+ rated films per director." }))}
    ${section("Actors You Follow", hbars(p.actors.map((d) => ({ label: d.label, value: d.avg, sub: `${d.rated} films`, films: d.films })), { drill: "tAct", format: (v) => fmt1(v) + "★", max: 5, empty: "Needs 3+ rated films per actor." }))}
  </div>
  ${section("Decades", divergingBars(p.decades.map((d) => ({ label: d.label, value: d.avg, sub: `${d.rated} rated`, films: d.films })), p.mean, { drill: "tDec" }))}
  ${c.hiCount >= 3 && c.loCount >= 3 ? section("Loved vs Not-for-Me", `<table class="contrast"><thead><tr><th></th><th>Films you love<br><small>${c.hiCount} films</small></th><th>Films you pan<br><small>${c.loCount} films</small></th></tr></thead><tbody>
    <tr><th>Average release year</th><td>${c.year.hi ? Math.round(c.year.hi) : "–"}</td><td>${c.year.lo ? Math.round(c.year.lo) : "–"}</td></tr>
    <tr><th>Average runtime</th><td>${num(c.runtime.hi)} min</td><td>${num(c.runtime.lo)} min</td></tr>
    <tr><th>TMDB crowd score</th><td>${fmt1(c.crowd.hi)}/10</td><td>${fmt1(c.crowd.lo)}/10</td></tr>
    <tr><th>Not in English</th><td>${c.foreign.hi === null ? "–" : Math.round(c.foreign.hi * 100) + "%"}</td><td>${c.foreign.lo === null ? "–" : Math.round(c.foreign.lo * 100) + "%"}</td></tr>
    <tr><th>Typical TMDB votes</th><td>${num(c.popularity.hi)}</td><td>${num(c.popularity.lo)}</td></tr>
  </tbody></table>`, { note: "Love = rated 4★+ and well above your average; pan = 2.5★ or below and well below it." }) : ""}
  <div class="grid2">
    ${section("Words You Use When You Love a Film", p.words.raves.length ? `<div class="chips words">${p.words.raves.map((w) => `<span class="chip-word">${esc(w.word)} <small>${w.hi}</small></span>`).join("")}</div>` : `<p class="empty-note">Write a few more reviews and the Professor will read between the lines.</p>`, { note: `From ${num(p.words.reviewsHi)} reviews of films rated above your average.` })}
    ${section("Words You Use When You Don't", p.words.pans.length ? `<div class="chips words cold">${p.words.pans.map((w) => `<span class="chip-word">${esc(w.word)} <small>${w.lo}</small></span>`).join("")}</div>` : `<p class="empty-note">Not enough critical reviews yet.</p>`, { note: `From ${num(p.words.reviewsLo)} reviews of films rated below your average.` })}
  </div>
  ${p.focus.length ? section("What You Write About", hbars(p.focus.map((t) => ({ label: t.topic, value: t.count, sub: t.avg ? `${fmt1(t.avg)}★ when you mention it` : "" }))), { note: "Films whose reviews mention each topic." }) : ""}`;
}

/* ---------- Picks ---------- */

function watchlistIds() {
  const s = new Set();
  for (const w of Object.values(state.data.db.watchlist || {})) if (w.tmdbId) s.add(w.tmdbId);
  return s;
}

function renderPicks(mode) {
  const d = state.data;
  const opts = state.picksOpts || (state.picksOpts = { includeWatchlist: false, includeWatched: false });
  const modeInfo = MODES.find((m) => m.id === mode) || MODES[0];
  const head = `<h2 class="view-title">Tonight's Picks</h2>
  <nav class="modes" aria-label="Recommendation modes">${MODES.map((m, i) => `<a href="#picks/${m.id}" class="mode${m.id === modeInfo.id ? " active" : ""}" style="--i:${i}">${esc(m.name)}</a>`).join("")}</nav>
  <div class="picks-bar"><p class="mode-blurb">${esc(modeInfo.blurb)}</p>
  <label class="toggle"><input type="checkbox" id="optWl"${opts.includeWatchlist ? " checked" : ""}> include my watchlist</label>
  <label class="toggle"><input type="checkbox" id="optSeen"${opts.includeWatched ? " checked" : ""}> include films I've seen</label>
  ${modeInfo.id === "random" ? `<button type="button" class="btn-primary inline" id="reroll">Spin again</button>` : ""}</div>`;
  if (!d.candidates.length) {
    view.innerHTML = head + `<div class="empty-house small"><div class="empty-art">${stubby("shrug")}</div><div class="empty-copy"><p>No picks in the projection room yet. Recommendations are gathered by the sync job once TMDB is connected and at least five rated films have metadata${d.status.candidates && d.status.candidates.pending ? ` (${d.status.candidates.pending} films still being described)` : ""}.</p><p><a href="#box">Check the Box Office</a></p></div></div>`;
    bindPickOpts(mode);
    return;
  }
  let res;
  try {
    res = recommend(state.lib, d.candidates, d.meta, { mode: modeInfo.id, limit: modeInfo.id === "random" ? 1 : 12, profile: getProfile(), feedback: local.feedback(), localWatched: local.watched(), watchlistIds: [...watchlistIds()], localWatchlist: local.watchlist().map((x) => x.id), includeWatchlist: opts.includeWatchlist, includeWatched: opts.includeWatched, seed: state.picksSeed });
  } catch (e) {
    view.innerHTML = head + `<p class="err">Couldn't build picks: ${esc(e.message)}</p>`;
    return;
  }
  const fb = local.feedback();
  const lw = new Set(local.watchlist().map((x) => x.id));
  const seenLocal = new Set(local.watched());
  view.innerHTML = head + (res.items.length ? `<ol class="rec-list">${res.items.map((r, i) => recCard(r, i, fb, lw, seenLocal)).join("")}</ol>` : `<p class="empty-note big">Nothing in this aisle right now. Try another mode, or include your watchlist.</p>`) +
    `<p class="panel-note picks-foot">Ranked from your ratings, reviews and feedback across ${num(d.candidates.length)} candidates gathered from TMDB on ${when(d.candidatesInfo.generatedAt)}. Likes and dislikes are remembered on this device. <button type="button" class="lucky" id="luckyPenny" title="A lucky penny…" aria-label="Completely random pick">¢</button></p>`;
  bindPickOpts(mode);
}

function recCard(r, i, fb, lw, seenLocal) {
  const m = r.meta;
  const dir = (m.directors || []).map((x) => x.name).join(", ");
  const lb = letterboxdFilmUrl({ tmdbId: m.id });
  const v = fb[m.id] || 0;
  return `<li class="rec" style="--i:${i}" data-id="${m.id}">
    <div class="rec-poster">${poster(m, "w342", m.title)}<span class="rec-rank">${i + 1}</span></div>
    <div class="rec-body">
      <h3>${esc(m.title)} <span class="yr">${m.year || ""}</span></h3>
      <p class="rec-meta">${dir ? `Directed by ${esc(dir)} · ` : ""}${m.runtime ? m.runtime + " min · " : ""}${esc((m.genres || []).join(", "))}</p>
      <p class="rec-scores"><span class="score you" title="Predicted from your ratings">For you ≈ ${fmt1(r.predicted)}★</span><span class="score tmdb">TMDB ${m.voteAverage ? m.voteAverage.toFixed(1) + "/10" : "n/a"}${m.voteCount ? ` <small>(${num(m.voteCount)} votes)</small>` : ""}</span><a class="score lb" href="${lb}" target="_blank" rel="noopener" title="Letterboxd's average isn't available without their API - see it on the film's page">Letterboxd rating ↗</a></p>
      <ul class="reasons">${r.reasons.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      <div class="rec-actions">
        <button type="button" data-act="like" class="act${v > 0 ? " on" : ""}" aria-pressed="${v > 0}">👍 More like this</button>
        <button type="button" data-act="dislike" class="act${v < 0 ? " on" : ""}" aria-pressed="${v < 0}">👎 Not for me</button>
        <button type="button" data-act="watched" class="act${seenLocal.has(m.id) ? " on" : ""}">✓ Watched</button>
        <button type="button" data-act="watchlist" class="act${lw.has(m.id) ? " on" : ""}">${lw.has(m.id) ? "On watchlist" : "+ Watchlist"}</button>
        <button type="button" data-act="machine" class="act">Load into the machine</button>
        <a class="act" href="${lb}" target="_blank" rel="noopener">Open on Letterboxd ↗</a>
      </div>
    </div></li>`;
}

function bindPickOpts(mode) {
  const o = state.picksOpts;
  const wl = $("#optWl"), sn = $("#optSeen");
  if (wl) wl.onchange = () => { o.includeWatchlist = wl.checked; renderPicks(mode); };
  if (sn) sn.onchange = () => { o.includeWatched = sn.checked; renderPicks(mode); };
  const rr = $("#reroll");
  if (rr) rr.onclick = () => { state.picksSeed = Date.now(); renderPicks(mode); };
  const lucky = $("#luckyPenny");
  if (lucky) lucky.onclick = () => showWildcard();
}

function showWildcard() {
  const w = wildcard(state.lib, state.data.candidates, state.data.meta, Date.now());
  if (!w) return usher.say("The vault's empty - nothing to pull at random yet.", "shrug");
  openDialog(`<h2>The Lucky Penny</h2><p class="note">No taste, no logic - one reel pulled blind from the vault.</p>
    <div class="wild">${poster(w.meta, "w342")}<div><h3>${esc(w.meta.title)} <span class="yr">${w.meta.year || ""}</span></h3><p>${esc((w.meta.genres || []).join(", "))}${w.meta.runtime ? " · " + w.meta.runtime + " min" : ""}</p><p class="small">${esc(w.meta.overview || "")}</p><p><a class="btn-primary inline" target="_blank" rel="noopener" href="${letterboxdFilmUrl({ tmdbId: w.id })}">Open on Letterboxd ↗</a></p></div></div>`);
  usher.say("A penny for the projectionist… and a mystery reel for you!", "cheer");
}

view.addEventListener("click", (e) => {
  const btn = e.target.closest(".rec [data-act]");
  if (!btn || btn.tagName === "A") return;
  const li = btn.closest(".rec");
  const id = Number(li.dataset.id);
  const m = state.data.meta[id];
  const act = btn.dataset.act;
  const fb = local.feedback();
  if (act === "like") { local.setFeedback(id, fb[id] > 0 ? 0 : 1); usher.say(fb[id] > 0 ? "Noted - forgetting that one." : `More like ${m.title}, coming right up!`, "cheer"); }
  else if (act === "dislike") { local.setFeedback(id, fb[id] < 0 ? 0 : -1); if (!(fb[id] < 0)) usher.say("Into the bin it goes. I'll steer clear of that sort.", "shrug"); }
  else if (act === "watched") { if (local.watched().includes(id)) local.unmarkWatched(id); else { local.markWatched(m); usher.say("Marked watched here. Log it on Letterboxd and the next sync picks up your rating!", "wave"); } }
  else if (act === "watchlist") { if (local.watchlist().some((x) => x.id === id)) local.removeWatchlist(id); else { local.addWatchlist(m); flyTicket(btn, m.title); } }
  else if (act === "machine") {
    const r = local.loadIntoMachine(m);
    usher.say(r === "full" ? "The machine's full - swap something out first." : r === "already" ? "That one's already in the machine!" : `Loaded into slot ${r} of the vending machine.`, r === "full" ? "shrug" : "point");
    return;
  }
  const [name, sub] = location.hash.replace(/^#/, "").split("/");
  if (name === "picks") renderPicks(sub || "favorites");
});

/* ---------- Trophies & Booth ---------- */

function achievementCtx() {
  const fg = {};
  for (const [pid, p] of Object.entries(state.data.people.directors || {})) fg[pid] = p;
  return { filmographies: fg };
}

function renderTrophies() {
  const list = evaluateAchievements(state.lib, achievementCtx());
  const got = list.filter((a) => a.done).length;
  const open = boothUnlocked(state.lib);
  view.innerHTML = `<h2 class="view-title">The Trophy Case</h2><p class="filter-summary">${got} of ${list.length} unlocked - every one earned from your real history.</p>
  <ul class="badges">${list.map((a, i) => `<li class="badge${a.done ? " done" : ""}" style="--i:${i}"><div class="badge-art">${badge(a.art, a.done)}</div><h3>${esc(a.name)}</h3><p>${esc(a.desc)}</p><div class="pbar" title="${Math.round(a.progress * 100)}%"><span style="--w:${(a.progress * 100).toFixed(0)}%"></span></div><small>${esc(a.detail)}</small></li>`).join("")}</ul>
  ${section("Staff Only", `<div class="booth-teaser"><a href="#booth" class="booth-link" aria-label="${open ? "Enter the projection booth" : "A locked door"}">${boothDoor(open)}</a><p>${open ? "The projectionist left the door open. <a href=\"#booth\">Step inside →</a>" : `A locked door. Rumour says it opens for patrons who've rated 100 films. (${state.lib.films.filter((f) => f.rating !== null).length}/100)`}</p></div>`)}`;
}

function renderBooth() {
  if (!boothUnlocked(state.lib)) { location.hash = "#trophies"; return; }
  const lib = state.lib;
  const tb = topBottom(lib, 10);
  const c = contrarian(lib, 10);
  const byYear = new Map();
  for (const v of lib.viewings) if (v.date && v.rating !== null) { const y = v.date.slice(0, 4); if (!byYear.has(y)) byYear.set(y, []); byYear.get(y).push(v.rating); }
  const years = [...byYear.entries()].sort().map(([y, r]) => ({ label: y, value: r.reduce((s, x) => s + x, 0) / r.length, count: r.length }));
  const defend = lib.films.filter((f) => f.rating >= 4 && f.meta && f.meta.voteAverage && f.meta.voteAverage < 6.2 && f.meta.voteCount >= 50).sort((a, b) => a.meta.voteAverage - b.meta.voteAverage).slice(0, 10);
  view.innerHTML = `<div class="booth">
    <h2 class="view-title">The Projection Booth</h2><p class="filter-summary">Staff only. You rated your hundredth film, so the projectionist let you in.</p>
    ${section("Tonight's Programme: Your Personal Canon", `<ol class="programme">${tb.highest.map((f, i) => `<li><button type="button" data-film="${esc(f.key)}"><span class="pg-no">${["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][i]}.</span> <strong>${esc(f.title)}</strong> <em>${f.year || ""}</em> <span class="dots"></span> ${starsHtml(f.rating)}</button></li>`).join("")}</ol>`, { cls: "programme-card" })}
    <div class="grid2">
      ${section("Films You'd Defend in a Fistfight", filmStrip(defend, (f) => `<span class="rt">TMDB ${f.meta.voteAverage.toFixed(1)}</span>`), { note: "Rated 4★+ by you, under 6.2/10 on TMDB." })}
      ${section("The Contrarian Corner", filmStrip(c.below.slice(0, 8), (f) => `<span class="rt">TMDB ${fmt1(f.crowd)}★</span>`), { note: `Crowd favourites you rated lowest. Your agreement with TMDB overall: ${c.agreement === null ? "–" : c.agreement.toFixed(2)}.` })}
    </div>
    ${section("Has Your Taste Got Tougher?", columns(years.map((y) => ({ ...y, short: "’" + y.label.slice(2), title: `${y.label}: ${y.count} rated viewings` })), { format: (v) => v.toFixed(1), allLabels: true }), { note: "Average rating of the diary entries you logged each year." })}
  </div>`;
}

/* ---------- Box Office ---------- */

function renderBox() {
  const d = state.data || {};
  const cfg = d.cfg || {};
  const st = d.status;
  const repoUrl = `https://github.com/${cfg.repoOwner}/${cfg.repoName}`;
  const statusHtml = !d.connected
    ? `<p class="status-line off"><span class="dot"></span> Not connected yet - no sync has completed.</p>`
    : `<dl class="status-grid">
      <dt>Letterboxd member</dt><dd><a href="https://letterboxd.com/${esc(st.user)}/" target="_blank" rel="noopener">${esc(st.user)} ↗</a></dd>
      <dt>Connection</dt><dd class="${st.ok ? "ok" : "bad"}"><span class="dot"></span>${st.ok ? "Reading the public RSS feed" : "Last attempt failed"}</dd>
      <dt>Last successful sync</dt><dd>${when(st.lastSuccessAt)} <small>(${ago(st.lastSuccessAt)})</small></dd>
      <dt>Last attempt</dt><dd>${when(st.lastAttemptAt)}</dd>
      <dt>Schedule</dt><dd>Automatically ${esc(st.nextScheduledHint || "every 6 hours")} on GitHub's servers (next ≈ ${when(new Date(Date.parse(st.lastAttemptAt) + (cfg.syncEveryHours || 6) * 3600000).toISOString())})</dd>
      <dt>In the vault</dt><dd>${st.counts ? `${num(st.counts.films)} films · ${num(st.counts.viewings)} diary entries · ${num(st.counts.reviews)} reviews · ${num(st.counts.watchlist)} on watchlist · ${num(st.counts.candidates)} recommendation candidates` : "–"}</dd>
      ${st.rss && st.rss.ok ? `<dt>Last feed read</dt><dd>${st.rss.items} entries: ${st.rss.added} new, ${st.rss.updated} updated${st.rss.edited && st.rss.edited.length ? ` (edited: ${st.rss.edited.map((e) => esc(e.title)).join(", ")})` : ""}</dd>` : ""}
      ${st.tmdb ? `<dt>TMDB</dt><dd>${st.tmdb.fetched || 0} described, ${st.tmdb.resolved || 0} matched, ${st.tmdb.unresolved || 0} couldn't be matched${st.tmdb.pending ? `, ${st.tmdb.pending} queued for next sync` : ""}</dd>` : ""}
    </dl>
    ${st.errors && st.errors.length ? `<div class="alert bad"><strong>Errors</strong><ul>${st.errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul><p class="small">The site keeps showing the last good data. Temporary failures retry automatically at the next scheduled sync.</p></div>` : ""}
    ${st.warnings && st.warnings.length ? `<div class="alert warn"><ul>${st.warnings.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : ""}`;
  view.innerHTML = `<h2 class="view-title">The Box Office</h2>
  <div class="grid2">
    ${section("Projector Status", `${statusHtml}<div class="btn-row"><button type="button" class="btn-primary inline" id="syncNow">Sync Now</button><button type="button" class="btn-cancel inline" id="reloadData">Reload data</button></div><p class="small" id="syncMsg">${hasToken() ? "Sync Now starts the sync job directly using the GitHub token saved on this device." : `Without a token, Sync Now opens the workflow on GitHub - press <strong>Run workflow</strong> there.`}</p>`)}
    ${section("One-Time Import", `<p>Letterboxd's RSS feed only shows your latest ~50 entries, so your full history comes from a one-time export: on Letterboxd go to <strong>Settings → Data → Export your data</strong>, then choose the ZIP here.</p>
      <label class="file-pick"><input type="file" id="importFile" accept=".zip,.csv" multiple><span>Choose export ZIP or CSVs</span></label>
      <div id="importPreview"></div>
      <p class="small">The file is read here in your browser. Only the diary, reviews, ratings, watched, watchlist and likes files are kept - <strong>profile.csv (with your e-mail address) is never read or uploaded</strong>.</p>`)}
  </div>
  <div class="grid2">
    ${section("GitHub Token (optional)", `<p class="small">With a token, <em>Sync Now</em> and <em>Import</em> work in one tap. Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained token</a> for <strong>only this repository</strong> with <strong>Actions: Read and write</strong> and <strong>Contents: Read and write</strong>. It's stored only in this browser and only ever sent to api.github.com.</p>
      ${hasToken() ? `<p class="status-line on"><span class="dot"></span> Token saved on this device.</p><button type="button" class="btn-cancel inline" id="forgetToken">Forget token</button>` : `<input type="password" id="tokenField" placeholder="github_pat_…" autocomplete="off" aria-label="GitHub token"><button type="button" class="btn-primary inline" id="saveToken">Save token</button>`}`)}
    ${section("Your Lists on This Device", `<p class="small">Things you do here that Letterboxd can't receive (it has no public write API):</p>
      <ul class="plain"><li>${num(local.watchlist().length)} added to your watchlist here ${local.watchlist().length ? `<button type="button" class="link" id="showWl">show</button>` : ""}</li><li>${num(local.watched().length)} marked watched here</li><li>${num(Object.keys(local.feedback()).length)} pick ratings (👍/👎) ${Object.keys(local.feedback()).length ? `<button type="button" class="link" id="resetFb">reset</button>` : ""}</li><li>${num(local.favorites().length)} in your Hall of Fame</li></ul>
      <label class="toggle"><input type="checkbox" id="eggsToggle"${local.eggsOn() ? " checked" : ""}> Usher, surprises & Easter eggs</label>`)}
  </div>
  ${section("Where the Data Comes From", `<ul class="plain sources">
    <li><strong>Letterboxd RSS</strong> (public feed, read every ${cfg.syncEveryHours || 6} h): new diary entries, ratings, rewatches, likes, reviews and TMDB ids. It only holds your ~50 most recent entries, so edits to older entries can't be seen.</li>
    <li><strong>Letterboxd CSV export</strong> (once): the complete diary, ratings, reviews, watched films, likes and watchlist. Letterboxd has no public API (access is granted case by case), and its pages aren't scraped.</li>
    <li><strong>TMDB</strong>: genres, runtimes, credits, countries, languages, keywords, posters and crowd scores - fetched by the sync job with a key stored as a GitHub secret, and cached.</li>
    <li><strong>Not available</strong>: Letterboxd's own average ratings, your live watchlist after the import (the feed doesn't include it), deletions, and the time of day you watched (achievements use the post time instead).</li></ul>
    <p class="small">Data lives on the <a href="${repoUrl}/tree/${cfg.dataBranch}" target="_blank" rel="noopener">${esc(cfg.dataBranch || "cinema-data")}</a> branch. Sync job: <a href="${repoUrl}/actions/workflows/${cfg.workflowFile}" target="_blank" rel="noopener">workflow runs ↗</a></p>`)}`;
  bindBox(cfg);
}

function bindBox(cfg) {
  $("#reloadData").onclick = () => boot(true).then(() => { location.hash = "#box"; });
  $("#syncNow").onclick = async () => {
    const msg = $("#syncMsg");
    if (!hasToken()) { window.open(`https://github.com/${cfg.repoOwner}/${cfg.repoName}/actions/workflows/${cfg.workflowFile}`, "_blank", "noopener"); msg.innerHTML = "Opened GitHub - press <strong>Run workflow</strong>, wait a minute or two, then <em>Reload data</em>."; return; }
    try {
      const before = await latestRun(cfg);
      await dispatchSync(cfg);
      msg.innerHTML = reelLoader("Sync requested - the projectionist is threading the reels…");
      usher.say("Rolling! I'll shout when the new reels arrive.", "wave");
      const started = Date.now();
      while (Date.now() - started < 15 * 60000) {
        await new Promise((r) => setTimeout(r, 8000));
        const run = await latestRun(cfg);
        if (run && (!before || run.id !== before.id)) {
          if (run.status === "completed") {
            msg.textContent = run.conclusion === "success" ? "Sync finished - loading the new reels." : `The sync job ended with “${run.conclusion}”. See the workflow run for details.`;
            if (run.conclusion === "success") { await boot(true); location.hash = "#box"; usher.say("Fresh reels are in!", "cheer"); }
            return;
          }
          msg.innerHTML = reelLoader(`Sync job ${run.status.replace("_", " ")}…`);
        }
      }
      msg.textContent = "Still running - check the workflow on GitHub.";
    } catch (e) { msg.textContent = e.message; }
  };
  const tf = $("#saveToken");
  if (tf) tf.onclick = () => { const v = $("#tokenField").value.trim(); if (v) { setToken(v); renderBox(); } };
  const ft = $("#forgetToken");
  if (ft) ft.onclick = () => { setToken(null); renderBox(); };
  const rf = $("#resetFb");
  if (rf) rf.onclick = () => { lsSet(LS.feedback, {}); state.profile = null; renderBox(); };
  const sw = $("#showWl");
  if (sw) sw.onclick = () => openDialog(`<h2>Added Here</h2><ul class="plain">${local.watchlist().map((w) => `<li>${esc(w.title)} ${w.year ? `(${w.year})` : ""} - <a href="${letterboxdFilmUrl({ tmdbId: w.id })}" target="_blank" rel="noopener">add on Letterboxd ↗</a> <button type="button" class="link" data-unwl="${w.id}">remove</button></li>`).join("")}</ul>`);
  $("#eggsToggle").onchange = (e) => { local.setEggs(e.target.checked); document.body.classList.toggle("eggs-off", !e.target.checked); };
  $("#importFile").onchange = (e) => handleImport(e.target.files, cfg);
}

async function handleImport(fileList, cfg) {
  const out = $("#importPreview");
  out.innerHTML = reelLoader("Reading your export…");
  try {
    const files = {};
    for (const file of fileList) {
      if (/\.zip$/i.test(file.name)) {
        const got = await readZip(new Uint8Array(await file.arrayBuffer()), (n) => !!exportFileKind(n), browserInflateRaw);
        for (const [n, t] of Object.entries(got)) files[exportFileKind(n)] = t;
      } else {
        const k = exportFileKind(file.name);
        if (k) files[k] = await file.text();
      }
    }
    if (!Object.keys(files).length) throw new Error("No Letterboxd export files found (expected diary.csv, ratings.csv, watched.csv…).");
    const p = parseLetterboxdExport(files);
    const dates = p.diary.map((r) => r.watchedDate).filter(Boolean).sort();
    const bundle = JSON.stringify({ format: "letterboxd-import", createdAt: new Date().toISOString(), files });
    out.innerHTML = `<div class="import-card"><p><strong>Found:</strong> ${num(p.diary.length)} diary entries${dates.length ? ` (${dates[0]} → ${dates[dates.length - 1]})` : ""}, ${num(p.watched.length)} watched films, ${num(p.ratings.length)} ratings, ${num(p.reviews.length)} reviews, ${num(p.likes.length)} likes, ${num(p.watchlist.length)} on the watchlist.</p>
      <p class="small">Files kept: ${Object.keys(files).map(esc).join(", ")}.</p>
      <div class="btn-row">${hasToken() ? `<button type="button" class="btn-primary inline" id="sendImport">Send to the projection room</button>` : ""}<button type="button" class="${hasToken() ? "btn-cancel" : "btn-primary"} inline" id="dlImport">Download import bundle</button></div>
      ${hasToken() ? "" : `<p class="small">Then upload it to <a href="https://github.com/${cfg.repoOwner}/${cfg.repoName}/upload/${cfg.dataBranch}/import" target="_blank" rel="noopener">the import folder on GitHub ↗</a> and press Sync Now. (Save a GitHub token above to skip this step.)</p>`}
      <p class="small" id="importMsg"></p></div>`;
    $("#dlImport").onclick = () => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([bundle], { type: "application/json" }));
      a.download = "letterboxd-import.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    };
    const send = $("#sendImport");
    if (send) send.onclick = async () => {
      const msg = $("#importMsg");
      try {
        send.disabled = true;
        msg.textContent = "Uploading…";
        await uploadImport(cfg, bundle);
        await dispatchSync(cfg);
        msg.textContent = "Uploaded. The sync job is importing it now - it takes a few minutes for a big history (TMDB details are fetched in batches).";
        usher.say("Your whole history is on its way to the vault!", "cheer");
      } catch (e) { msg.textContent = e.message; send.disabled = false; }
    };
  } catch (e) {
    out.innerHTML = `<p class="err">${esc(e.message)}</p>`;
  }
}

/* ---------- Film dialogs ---------- */

const dialog = $("#filmDialog");
function openDialog(html) {
  $("#dialogBody").innerHTML = html;
  dialog.classList.remove("hidden");
  dialog.querySelector(".dialog").scrollTop = 0;
  $("#dialogClose").focus();
}
function closeDialog() { dialog.classList.add("hidden"); }
$("#dialogClose").onclick = closeDialog;
dialog.addEventListener("click", (e) => { if (e.target === dialog) closeDialog(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !dialog.classList.contains("hidden")) closeDialog(); });

function openFilmList(title, keys) {
  const films = keys.map((k) => state.lib.filmByKey.get(k)).filter(Boolean).sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  openDialog(`<h2>${esc(title)}</h2><p class="note">${plural(films.length, "film")}</p>${filmStrip(films)}`);
}

function openFilm(key) {
  const f = state.lib.filmByKey.get(key);
  if (!f) return;
  const m = f.meta;
  const isFav = local.favorites().includes(f.key);
  const lb = letterboxdFilmUrl(f);
  openDialog(`<div class="film-detail">
    <div class="fd-poster">${poster(m, "w342", f.title)}</div>
    <div class="fd-info"><h2>${esc(f.title)} <span class="yr">${f.year || ""}</span></h2>
    <p class="rec-meta">${m ? `${m.directors.length ? "Directed by " + esc(m.directors.map((d) => d.name).join(", ")) + " · " : ""}${m.runtime ? m.runtime + " min · " : ""}${esc(m.genres.join(", "))}` : "TMDB details not synced yet."}</p>
    <p>Your rating: ${starsHtml(f.rating)} ${f.liked ? '<span class="heart">♥ liked</span>' : ""}${m && m.voteAverage ? ` · TMDB ${m.voteAverage.toFixed(1)}/10` : ""}</p>
    ${m && m.cast.length ? `<p class="small">With ${esc(m.cast.slice(0, 5).map((c) => c.name).join(", "))}</p>` : ""}
    ${m && m.overview ? `<p class="small">${esc(m.overview)}</p>` : ""}
    <div class="btn-row"><button type="button" class="btn-primary inline" id="favBtn" aria-pressed="${isFav}">${isFav ? "★ In the Hall of Fame" : "☆ Hall of Fame"}</button>${lb ? `<a class="btn-cancel inline" href="${lb}" target="_blank" rel="noopener">Letterboxd ↗</a>` : ""}</div></div></div>
    <h3 class="sub-h">Your Diary</h3>
    ${f.viewings.length ? `<ul class="viewings">${[...f.viewings].reverse().map((v) => `<li><strong>${esc(v.date || "Undated")}</strong> ${starsHtml(v.rating)}${v.rewatch ? " · rewatch" : ""}${v.liked ? " · ♥" : ""}${v.edited ? ' · <em title="Changed after it was first synced">edited</em>' : ""}${v.review ? `<blockquote>${v.spoilers ? '<span class="spoiler-tag">spoilers</span> ' : ""}${esc(v.review).replace(/\n/g, "<br>")}</blockquote>` : ""}</li>`).join("")}</ul>` : `<p class="small">Marked as watched without a diary date.</p>`}`);
  $("#favBtn").onclick = (e) => {
    const on = local.toggleFavorite(f.key);
    e.currentTarget.textContent = on ? "★ In the Hall of Fame" : "☆ Hall of Fame";
    e.currentTarget.setAttribute("aria-pressed", on);
    if (on) { flyTicket(e.currentTarget, f.title); usher.say(`${f.title} joins the Hall of Fame!`, "cheer"); }
    state.profile = null;
  };
}

document.addEventListener("click", (e) => {
  const d = e.target.closest("[data-drill]");
  if (d) {
    const reg = state.drills[d.dataset.drill];
    const row = reg && reg.rows[Number(d.dataset.idx)];
    if (row && row.films) openFilmList(`${reg.title} ${row.label}`.replace(/: /, ": "), row.films);
    return;
  }
  const f = e.target.closest("[data-film]");
  if (f) { openFilm(f.dataset.film); return; }
  const u = e.target.closest("[data-unwl]");
  if (u) { local.removeWatchlist(Number(u.dataset.unwl)); u.closest("li").remove(); }
});

/* ---------- Achievements toast ---------- */

function checkNewAchievements() {
  if (!state.lib) return;
  const done = evaluateAchievements(state.lib, achievementCtx()).filter((a) => a.done).map((a) => a.id);
  const seen = lsGet(LS.seenAch, null);
  lsSet(LS.seenAch, done);
  if (!seen) return; // first visit: don't flood with toasts
  const fresh = done.filter((id) => !seen.includes(id));
  if (fresh.length) {
    const a = evaluateAchievements(state.lib, achievementCtx()).find((x) => x.id === fresh[0]);
    usher.say(`Trophy unlocked: ${a.name}!${fresh.length > 1 ? ` (+${fresh.length - 1} more)` : ""}`, "cheer", "#trophies");
  }
}

/* ---------- Go ---------- */

window.addEventListener("hashchange", () => { closeDialog(); route(); });
initEggs({ onRandom: () => (state.lib && state.data.candidates.length ? showWildcard() : usher.say("No reels in the vault yet!", "shrug")) });
if (!local.eggsOn()) document.body.classList.add("eggs-off");
boot(false);
