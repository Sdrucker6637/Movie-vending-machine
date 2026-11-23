/* Hand-inked charts built from plain HTML so they stay sharp, responsive and
   readable by screen readers. Every bar/column is a button: clicking one opens
   the films behind it. Values are always printed next to the mark, and each
   mark carries a title tooltip. */

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt1 = (x) => (x === null || x === undefined ? "–" : x.toFixed(1));

// rows: [{ label, value, sub?, key?, films? }]
export function hbars(rows, o) {
  const opt = o || {};
  if (!rows.length) return `<p class="empty-note">${esc(opt.empty || "Nothing to show for these filters.")}</p>`;
  const max = opt.max || Math.max(...rows.map((r) => r.value), 0.0001);
  const min = opt.min || 0;
  return `<ol class="hbars${opt.tone ? " tone-" + opt.tone : ""}">${rows.map((r, i) => {
    const w = Math.max(2, ((r.value - min) / (max - min)) * 100);
    const val = opt.format ? opt.format(r.value, r) : r.value.toLocaleString("en-US");
    const clickable = opt.drill && r.films && r.films.length;
    const tag = clickable ? "button" : "div";
    const attrs = clickable ? ` type="button" data-drill="${esc(opt.drill)}" data-idx="${i}" title="${esc(r.label)}: ${esc(val)} - show films"` : ` title="${esc(r.label)}: ${esc(val)}"`;
    return `<li><${tag} class="hbar"${attrs}><span class="hbar-label">${esc(r.label)}${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</span><span class="hbar-track"><span class="hbar-fill" style="--w:${w.toFixed(1)}%;--d:${Math.min(i, 14) * 40}ms"></span></span><span class="hbar-val">${esc(val)}</span></${tag}></li>`;
  }).join("")}</ol>`;
}

// Average rating vs your overall average: bars grow left (below) or right (above).
export function divergingBars(rows, mean, o) {
  const opt = o || {};
  if (!rows.length) return `<p class="empty-note">${esc(opt.empty || "Not enough rated films yet.")}</p>`;
  const span = Math.max(0.5, ...rows.map((r) => Math.abs(r.value - mean)));
  return `<ol class="dbars">${rows.map((r, i) => {
    const d = r.value - mean;
    const w = (Math.abs(d) / span) * 50;
    const clickable = opt.drill && r.films && r.films.length;
    const tag = clickable ? "button" : "div";
    const attrs = clickable ? ` type="button" data-drill="${esc(opt.drill)}" data-idx="${i}"` : "";
    return `<li><${tag} class="dbar"${attrs} title="${esc(r.label)}: ${fmt1(r.value)}★ (${d >= 0 ? "+" : ""}${d.toFixed(2)} vs your average)"><span class="dbar-label">${esc(r.label)}${r.sub ? `<small>${esc(r.sub)}</small>` : ""}</span><span class="dbar-track"><span class="dbar-mid"></span><span class="dbar-fill ${d >= 0 ? "pos" : "neg"}" style="--w:${w.toFixed(1)}%"></span></span><span class="dbar-val">${fmt1(r.value)}★</span></${tag}></li>`;
  }).join("")}</ol><p class="chart-key"><span class="key neg"></span> below your ${fmt1(mean)}★ average <span class="key pos"></span> above it</p>`;
}

// Vertical columns (timeline, distribution). rows: [{label, value, short?}]
export function columns(rows, o) {
  const opt = o || {};
  if (!rows.length) return `<p class="empty-note">${esc(opt.empty || "Nothing logged yet.")}</p>`;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const labelEvery = opt.labelEvery || Math.ceil(rows.length / 14);
  return `<div class="columns${opt.scroll ? " scroll" : ""}" style="--n:${rows.length}"><div class="columns-inner">${rows.map((r, i) => {
    const h = (r.value / max) * 100;
    const clickable = opt.drill && r.films && r.films.length;
    const tag = clickable ? "button" : "div";
    const attrs = clickable ? ` type="button" data-drill="${esc(opt.drill)}" data-idx="${i}"` : "";
    const val = opt.format ? opt.format(r.value) : r.value;
    return `<${tag} class="col${r.hl ? " hl" : ""}"${attrs} title="${esc(r.title || r.label)}: ${esc(val)}"><span class="col-val">${r.value ? esc(val) : ""}</span><span class="col-bar" style="--h:${h.toFixed(1)}%;--d:${Math.min(i, 30) * 25}ms"></span><span class="col-label">${i % labelEvery === 0 || opt.allLabels ? esc(r.short ?? r.label) : ""}</span></${tag}>`;
  }).join("")}</div></div>`;
}

// A two-ended dial for taste axes. position: -1 (left) .. +1 (right)
export function axisDial(leftLabel, rightLabel, position, note) {
  const p = Math.max(-1, Math.min(1, position || 0));
  return `<div class="axis"><div class="axis-ends"><span>${esc(leftLabel)}</span><span>${esc(rightLabel)}</span></div><div class="axis-track"><span class="axis-mid"></span><span class="axis-knob" style="--p:${((p + 1) * 50).toFixed(1)}%"></span></div>${note ? `<p class="axis-note">${note}</p>` : ""}</div>`;
}

export function starsHtml(r) {
  if (r === null || r === undefined) return `<span class="stars none">unrated</span>`;
  const full = Math.floor(r);
  return `<span class="stars" aria-label="${r} stars">${"★".repeat(full)}${r % 1 ? "½" : ""}</span>`;
}

export { fmt1 };
