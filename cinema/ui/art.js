/* Original rubber-hose cast and props for My Cinema, drawn in the same ink
   as the vending machine (glove symbol, boil filter, paper/ink/red/mustard/teal).

   Recurring characters:
     Stubby      - a ticket-stub usher in a pillbox cap, with a flashlight
     Prof. Stars - a star-shaped critic with a monocle; his mood follows
                   your average rating
   plus the popcorn machine, achievement medallions and the projection
   booth door. Every function returns an SVG string. */

const INK = "#1f1b16", PAPER = "#fbf4e2", RED = "#b3402d", MUSTARD = "#d9a13a", TEAL = "#3f7877", TEAL_D = "#2b5655";

const eyes = (x1, x2, y, rx, ry) =>
  `<g class="blink"><ellipse cx="${x1}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/><path d="M${x1} ${y} l${rx * 0.6} -${ry * 0.8} l-${rx * 0.9} -${ry * 0.15}z" fill="${PAPER}"/><ellipse cx="${x2}" cy="${y}" rx="${rx}" ry="${ry}" fill="${INK}"/><path d="M${x2} ${y} l${rx * 0.6} -${ry * 0.8} l-${rx * 0.9} -${ry * 0.15}z" fill="${PAPER}"/></g>`;

/* ---------- Stubby the usher ---------- */
// mood: "wave" | "point" | "cheer" | "shrug" | "sweep"
export function stubby(mood) {
  const m = mood || "wave";
  const mouth = m === "shrug" ? `<path d="M52 77 Q60 73 68 77" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M49 74 Q60 88 71 74 Q60 79 49 74Z" fill="${INK}"/><path d="M55 79 Q60 83 65 79 Q60 85 55 79Z" fill="${RED}"/>`;
  const rightArm = m === "cheer" || m === "wave"
    ? `<g class="wave-arm"><path class="hose" d="M90 66 C104 58 108 44 104 30"/><use href="#glove" x="92" y="7" width="24" height="24"/></g>`
    : m === "point"
      ? `<path class="hose" d="M90 68 C104 66 112 70 118 76"/><use href="#glove-point" width="28" height="18" transform="translate(116 74) rotate(10) translate(-3 -9)"/>`
      : `<path class="hose" d="M90 68 C104 70 108 60 112 52"/><use href="#glove" width="22" height="22" transform="translate(112 52) rotate(-20) translate(-11 -18)"/>`;
  const leftArm = m === "cheer"
    ? `<path class="hose" d="M30 66 C16 58 12 44 16 30"/><use href="#glove" x="4" y="7" width="24" height="24"/>`
    : m === "sweep"
      ? `<path class="hose" d="M30 70 C18 78 16 92 22 100"/><path d="M22 92 L8 132" stroke="${INK}" stroke-width="3.5"/><path d="M0 128 L16 136 L12 144 L-4 136Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.5"/><use href="#glove" width="20" height="20" transform="translate(22 100) rotate(150) translate(-10 -16)"/>`
      : `<path class="hose" d="M30 70 C16 74 12 90 22 98"/><use href="#glove" width="22" height="22" transform="translate(22 98) rotate(140) translate(-11 -18)"/><g class="flashlight"><rect x="8" y="98" width="20" height="9" rx="2" fill="${TEAL}" stroke="${INK}" stroke-width="2.5" transform="rotate(25 18 102)"/></g>`;
  return `<svg class="toon stubby mood-${m}" viewBox="-6 -4 132 156" aria-hidden="true" focusable="false"><g class="boil">
<path class="hose" d="M50 114 C48 126 44 134 38 140"/><path class="hose" d="M70 114 C74 126 78 134 84 140"/>
<ellipse cx="34" cy="143" rx="13" ry="7" fill="${INK}"/><ellipse cx="29" cy="141" rx="4" ry="1.7" fill="${PAPER}" opacity=".85"/>
<ellipse cx="88" cy="143" rx="13" ry="7" fill="${INK}"/><ellipse cx="93" cy="141" rx="4" ry="1.7" fill="${PAPER}" opacity=".85"/>
${leftArm}${rightArm}
<path d="M28 34 H92 V54 a6 6 0 0 0 0 12 V116 H28 V66 a6 6 0 0 0 0 -12 Z" fill="${PAPER}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
<path d="M34 98 H86" stroke="${INK}" stroke-width="2" stroke-dasharray="3 4"/>
<text x="60" y="110" text-anchor="middle" font-family="Limelight, Georgia, serif" font-size="8.5" fill="${RED}" letter-spacing="1">ADMIT ONE</text>
${eyes(51, 69, 58, 4.4, 7.2)}
<circle cx="42" cy="72" r="3.6" fill="${RED}" opacity=".5"/><circle cx="78" cy="72" r="3.6" fill="${RED}" opacity=".5"/>
${mouth}
<g class="cap"><path d="M38 34 L40 18 H80 L82 34 Z" fill="${RED}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M39 28 H81" stroke="${MUSTARD}" stroke-width="4"/><path d="M40 18 H80" stroke="${INK}" stroke-width="3"/><circle cx="60" cy="13" r="4" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.5"/></g>
</g></svg>`;
}

/* ---------- Professor Stars, the critic ---------- */
// mood from average rating: "ecstatic" | "pleased" | "pondering" | "grumpy" | "sleepy"
export function professorMood(avg) {
  if (avg === null || avg === undefined) return "sleepy";
  if (avg >= 3.8) return "ecstatic";
  if (avg >= 3.2) return "pleased";
  if (avg >= 2.6) return "pondering";
  return "grumpy";
}
export function professor(mood) {
  const m = mood || "pleased";
  const brows = { ecstatic: "M45 50 Q51 44 57 50 M66 50 Q72 44 78 50", pleased: "M45 51 Q51 48 57 51 M66 51 Q72 48 78 51", pondering: "M45 52 L57 49 M66 47 Q72 44 78 49", grumpy: "M45 47 L57 52 M66 52 L78 47", sleepy: "M45 53 H57 M66 53 H78" }[m];
  const mouth = {
    ecstatic: `<path d="M50 78 Q62 96 74 78 Q62 84 50 78Z" fill="${INK}"/><path d="M56 84 Q62 89 68 84 Q62 92 56 84Z" fill="${RED}"/>`,
    pleased: `<path d="M52 80 Q62 90 72 80" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    pondering: `<path d="M54 83 Q62 80 70 84" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    grumpy: `<path d="M52 86 Q62 77 72 86" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
    sleepy: `<ellipse cx="62" cy="83" rx="4" ry="3" fill="${INK}"/><text x="88" y="40" font-family="Shrikhand, Georgia" font-size="13" fill="${INK}">z</text><text x="97" y="28" font-family="Shrikhand, Georgia" font-size="10" fill="${INK}">z</text>`
  }[m];
  const eyeY = 59;
  const eyesSvg = m === "sleepy"
    ? `<path d="M46 60 Q51 64 56 60 M67 60 Q72 64 77 60" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : eyes(51, 72, eyeY, 3.8, 6.2);
  const arm = m === "ecstatic"
    ? `<path class="hose" d="M98 70 C112 60 114 46 110 34"/><use href="#glove" x="98" y="12" width="24" height="24"/>`
    : m === "grumpy"
      ? `<path class="hose" d="M98 74 C110 80 108 92 96 94"/><use href="#glove" width="20" height="20" transform="translate(96 94) rotate(200) translate(-10 -16)"/>`
      : `<path class="hose" d="M98 72 C110 74 114 84 110 92"/><use href="#glove" width="20" height="20" transform="translate(110 92) rotate(170) translate(-10 -16)"/>`;
  return `<svg class="toon professor mood-${m}" viewBox="0 0 124 150" aria-hidden="true" focusable="false"><g class="boil">
<path class="hose" d="M50 112 C48 124 44 132 40 138"/><path class="hose" d="M74 112 C76 124 80 132 84 138"/>
<ellipse cx="36" cy="141" rx="12" ry="6.5" fill="${INK}"/><ellipse cx="88" cy="141" rx="12" ry="6.5" fill="${INK}"/>
<path class="hose" d="M26 72 C12 74 8 88 14 96"/><use href="#glove" width="20" height="20" transform="translate(14 96) rotate(150) translate(-10 -16)"/>
${arm}
<path d="M62 6 L77 42 L116 45 L86 70 L96 108 L62 88 L28 108 L38 70 L8 45 L47 42 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>
<path d="${brows}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
${eyesSvg}
<circle cx="72" cy="${eyeY}" r="9.5" fill="none" stroke="${INK}" stroke-width="2.4"/><path d="M81 62 Q88 72 84 86" stroke="${INK}" stroke-width="1.5" fill="none"/>
<path d="M50 73 Q56 68 62 73 Q68 68 74 73 Q68 77 62 74 Q56 77 50 73Z" fill="${INK}"/>
${mouth}
<path d="M46 6 H78 L74 0 H50 Z" fill="${INK}" transform="translate(0 -1)"/>
</g></svg>`;
}

/* ---------- Popcorn machine (Easter egg) ---------- */
export function popcornMachine() {
  return `<svg class="popcorn-machine" viewBox="0 0 160 200" role="img" aria-label="A vintage popcorn machine - try cranking it">
<g class="boil">
<path d="M28 34 Q80 6 132 34 Z" fill="${RED}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
<circle cx="80" cy="12" r="6" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/>
<rect x="26" y="34" width="108" height="92" rx="6" fill="#fffaf0" fill-opacity=".55" stroke="${INK}" stroke-width="4.5"/>
<path d="M34 42 L52 42 M34 50 L44 50" stroke="${PAPER}" stroke-width="3" stroke-linecap="round"/>
<g class="kettle"><path d="M62 50 H98 L94 66 H66 Z" fill="#9aa0a0" stroke="${INK}" stroke-width="3"/><path d="M80 44 V50" stroke="${INK}" stroke-width="3"/></g>
<g class="kernels" fill="${PAPER}" stroke="${INK}" stroke-width="2">
<circle cx="44" cy="116" r="6"/><circle cx="56" cy="118" r="6.5"/><circle cx="70" cy="115" r="6"/><circle cx="84" cy="117" r="7"/><circle cx="98" cy="116" r="6"/><circle cx="112" cy="118" r="6.5"/><circle cx="122" cy="113" r="5"/>
<circle cx="50" cy="108" r="5.5"/><circle cx="64" cy="106" r="6"/><circle cx="78" cy="108" r="5.5"/><circle cx="92" cy="105" r="6"/><circle cx="106" cy="108" r="5.5"/>
</g>
<g class="pops" fill="${PAPER}" stroke="${INK}" stroke-width="2">
<circle class="p1" cx="70" cy="76" r="5"/><circle class="p2" cx="86" cy="80" r="5.5"/><circle class="p3" cx="78" cy="70" r="4.5"/><circle class="p4" cx="96" cy="74" r="5"/>
</g>
<rect x="20" y="126" width="120" height="22" rx="4" fill="${RED}" stroke="${INK}" stroke-width="4"/>
<text x="80" y="142" text-anchor="middle" font-family="Limelight, Georgia, serif" font-size="11" fill="${PAPER}" letter-spacing="2">POPCORN</text>
<path d="M34 148 L30 188 M126 148 L130 188" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
<circle cx="30" cy="190" r="7" fill="${INK}"/><circle cx="130" cy="190" r="7" fill="${INK}"/>
<g class="crank"><circle cx="146" cy="80" r="5" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/><path d="M146 80 L156 64" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="156" cy="63" r="4" fill="${RED}" stroke="${INK}" stroke-width="2.5"/></g>
</g></svg>`;
}

/* ---------- Film-reel loader ---------- */
export function reelLoader(text) {
  return `<div class="reel-loader" role="status"><svg viewBox="0 0 40 40" aria-hidden="true"><use href="#reel-icon"/></svg><svg class="second" viewBox="0 0 40 40" aria-hidden="true"><use href="#reel-icon"/></svg><span>${text || "Threading the projector…"}</span></div>`;
}

/* ---------- Achievement medallions ---------- */
const ICONS = {
  quill: `<path d="M34 64 C40 44 54 32 68 28 C62 40 54 52 40 62 Z" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M34 66 L52 44" stroke="${INK}" stroke-width="2.5"/>`,
  notebook: `<rect x="34" y="30" width="32" height="40" rx="3" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M40 40 H60 M40 48 H60 M40 56 H54" stroke="${INK}" stroke-width="2.5"/><path d="M34 30 V70" stroke="${RED}" stroke-width="5"/>`,
  reel100: `<use href="#reel-icon" x="30" y="26" width="40" height="40"/><text x="50" y="80" text-anchor="middle" font-family="Shrikhand" font-size="13" fill="${INK}">100</text>`,
  reel500: `<use href="#reel-icon" x="30" y="26" width="40" height="40"/><text x="50" y="80" text-anchor="middle" font-family="Shrikhand" font-size="13" fill="${INK}">500</text>`,
  reel1000: `<use href="#reel-icon" x="30" y="24" width="40" height="40"/><text x="50" y="80" text-anchor="middle" font-family="Shrikhand" font-size="12" fill="${INK}">1,000</text>`,
  booth: `<path d="M32 70 V38 Q50 22 68 38 V70 Z" fill="${TEAL}" stroke="${INK}" stroke-width="3"/><circle cx="50" cy="44" r="6" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.5"/><path d="M50 50 L46 64 H54 Z" fill="${INK}"/>`,
  compass: `<circle cx="50" cy="50" r="20" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M50 32 L56 50 L50 68 L44 50 Z" fill="${RED}" stroke="${INK}" stroke-width="2"/><path d="M50 50 L44 50 L50 68 Z" fill="${INK}"/>`,
  silent: `<rect x="30" y="34" width="40" height="30" rx="2" fill="${INK}"/><text x="50" y="52" text-anchor="middle" font-family="Limelight" font-size="8" fill="${PAPER}">THE END</text><path d="M34 38 H66 M34 60 H66" stroke="${PAPER}" stroke-width="1" stroke-dasharray="2 2"/>`,
  globe: `<circle cx="50" cy="50" r="20" fill="${TEAL}" stroke="${INK}" stroke-width="3"/><path d="M30 50 H70 M50 30 C38 40 38 60 50 70 C62 60 62 40 50 30" stroke="${INK}" stroke-width="2.2" fill="none"/><path d="M40 40 C44 44 48 38 54 42 C56 46 50 50 46 48 Z M54 56 C58 54 62 58 60 62 C56 62 54 60 54 56 Z" fill="${MUSTARD}"/>`,
  subtitle: `<rect x="28" y="34" width="44" height="30" rx="3" fill="${INK}"/><rect x="34" y="52" width="32" height="6" rx="1" fill="${PAPER}"/><path d="M38 44 Q44 40 50 44 Q56 48 62 44" stroke="${MUSTARD}" stroke-width="2" fill="none"/>`,
  clapper: `<rect x="30" y="44" width="40" height="26" rx="2" fill="${INK}"/><path d="M30 36 L68 30 L70 38 L32 44 Z" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/><path d="M38 35 L42 42 M48 33 L52 41 M58 32 L62 39" stroke="${INK}" stroke-width="3"/><path d="M36 54 H64 M36 62 H56" stroke="${PAPER}" stroke-width="2"/>`,
  moon: `<path d="M58 28 A22 22 0 1 0 70 64 A18 18 0 1 1 58 28 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/><circle cx="64" cy="34" r="2" fill="${INK}"/><circle cx="36" cy="30" r="2" fill="${INK}"/>`,
  star: `<path d="M50 26 L56 42 L73 43 L60 54 L64 71 L50 62 L36 71 L40 54 L27 43 L44 42 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>`,
  club: `<path d="M50 24 L55 38 L70 38 L58 47 L62 62 L50 53 L38 62 L42 47 L30 38 L45 38 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><text x="50" y="76" text-anchor="middle" font-family="Limelight" font-size="9" fill="${INK}">CLUB</text>`,
  double: `<rect x="28" y="34" width="22" height="32" rx="2" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><rect x="50" y="34" width="22" height="32" rx="2" fill="${RED}" stroke="${INK}" stroke-width="3"/><text x="39" y="54" text-anchor="middle" font-family="Shrikhand" font-size="12" fill="${INK}">1</text><text x="61" y="54" text-anchor="middle" font-family="Shrikhand" font-size="12" fill="${PAPER}">2</text>`,
  marathon: `<path d="M30 66 C40 40 60 40 70 66" stroke="${INK}" stroke-width="3" fill="none"/><circle cx="50" cy="36" r="8" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/><path d="M50 44 V58 M42 50 H58" stroke="${INK}" stroke-width="3"/><text x="50" y="78" text-anchor="middle" font-family="Limelight" font-size="9" fill="${INK}">×4</text>`,
  encore: `<path d="M50 30 A18 18 0 1 1 33 46" stroke="${INK}" stroke-width="4" fill="none"/><path d="M27 40 L33 48 L40 40" stroke="${INK}" stroke-width="4" fill="none" stroke-linejoin="round"/><circle cx="50" cy="48" r="5" fill="${RED}"/>`,
  calendar: `<rect x="30" y="32" width="40" height="36" rx="3" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M30 42 H70" stroke="${INK}" stroke-width="3"/><rect x="30" y="32" width="40" height="10" fill="${RED}"/><text x="50" y="62" text-anchor="middle" font-family="Shrikhand" font-size="14" fill="${INK}">365</text>`,
  hourglass: `<path d="M36 28 H64 M36 72 H64 M38 28 C38 44 62 46 62 50 C62 54 38 56 38 72 M62 28 C62 44 38 46 38 50 C38 54 62 56 62 72" stroke="${INK}" stroke-width="3" fill="none"/><path d="M42 66 Q50 56 58 66 Z" fill="${MUSTARD}"/>`,
  clock: `<circle cx="50" cy="50" r="20" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M50 50 V36 M50 50 L60 56" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="2.5" fill="${RED}"/>`
};

export function badge(art, unlocked) {
  const fill = unlocked ? MUSTARD : "#cfc2a3";
  const scallops = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `<circle cx="${(50 + Math.cos(a) * 36).toFixed(1)}" cy="${(50 + Math.sin(a) * 36).toFixed(1)}" r="7" fill="${fill}" stroke="${INK}" stroke-width="2.5"/>`;
  }).join("");
  const icon = unlocked ? (ICONS[art] || ICONS.star) : `<text x="50" y="62" text-anchor="middle" font-family="Shrikhand, Georgia" font-size="30" fill="${INK}" opacity=".55">?</text>`;
  return `<svg class="badge-svg${unlocked ? " on" : ""}" viewBox="0 0 100 112" aria-hidden="true">
<path d="M36 80 L28 108 L40 102 L46 112 L50 84 Z M64 80 L72 108 L60 102 L54 112 L50 84 Z" fill="${unlocked ? RED : "#a89a7d"}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
${scallops}<circle cx="50" cy="50" r="34" fill="${fill}" stroke="${INK}" stroke-width="3"/>
<circle cx="50" cy="50" r="28" fill="${unlocked ? PAPER : "#e6dcc4"}" stroke="${INK}" stroke-width="2"/>
${icon}</svg>`;
}

/* ---------- Ornaments ---------- */
export function curtainCorner(side) {
  return `<svg class="curtain-corner ${side}" viewBox="0 0 120 160" aria-hidden="true" preserveAspectRatio="none"><path d="M0 0 H120 C90 20 70 60 60 160 H0 Z" fill="${RED}" stroke="${INK}" stroke-width="4"/><path d="M20 0 C24 50 30 100 22 160 M44 0 C46 40 52 90 44 160" stroke="#87301f" stroke-width="5" fill="none"/><path d="M0 70 C30 80 50 74 70 64" stroke="${MUSTARD}" stroke-width="6" fill="none"/><circle cx="72" cy="64" r="6" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/></svg>`;
}

export function boothDoor(open) {
  return `<svg class="booth-door${open ? " open" : ""}" viewBox="0 0 120 170" aria-hidden="true"><rect x="10" y="10" width="100" height="156" rx="6" fill="#54483a" stroke="${INK}" stroke-width="4"/>
<g class="door-leaf"><rect x="18" y="18" width="84" height="148" rx="4" fill="${TEAL_D}" stroke="${INK}" stroke-width="4"/><circle cx="60" cy="56" r="16" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M60 46 V66 M50 56 H70" stroke="${INK}" stroke-width="2"/><circle cx="90" cy="100" r="5" fill="${MUSTARD}" stroke="${INK}" stroke-width="2.5"/><rect x="34" y="118" width="52" height="20" rx="2" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/><text x="60" y="132" text-anchor="middle" font-family="Limelight" font-size="8" fill="${INK}">${open ? "STAFF ONLY" : "LOCKED"}</text></g></svg>`;
}

export function ticketSvg(text) {
  return `<svg class="flying-ticket" viewBox="0 0 120 56" aria-hidden="true"><path d="M4 4 H116 V20 a8 8 0 0 0 0 16 V52 H4 V36 a8 8 0 0 0 0 -16 Z" fill="${MUSTARD}" stroke="${INK}" stroke-width="3"/><path d="M30 8 V48" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/><text x="74" y="25" text-anchor="middle" font-family="Limelight, Georgia" font-size="10" fill="${INK}">ADMIT ONE</text><text x="74" y="40" text-anchor="middle" font-family="Special Elite, monospace" font-size="8" fill="${INK}">${String(text || "").replace(/[<&>"]/g, "").slice(0, 22)}</text><text x="17" y="31" text-anchor="middle" font-family="Shrikhand" font-size="13" fill="${RED}">★</text></svg>`;
}
