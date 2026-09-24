/* Machine FX - shared drawings and little composite helpers used by cues.
   Everything is inline SVG in the machine's ink-and-paper style. */
(function () {
  "use strict";
  if (!window.MachineFX) return;

  const INK = "#1f1b16", PAPER = "#fbf4e2", RED = "#b3402d", MUSTARD = "#d9a13a", TEAL = "#3f7877";
  const S = (vb, body) => '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg">' + body + "</svg>";
  const ink = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  const art = {
    INK, PAPER, RED, MUSTARD, TEAL, S, ink,

    fin: S("0 0 100 60", '<path d="M5 58 C30 50 45 20 62 2 C60 25 70 45 95 58 Z" fill="#5d6b73" ' + ink + '/><path d="M0 58 H100" ' + ink + ' fill="none"/>'),
    feather: S("0 0 40 100", '<path d="M20 98 C18 70 18 40 22 4" ' + ink + ' fill="none" stroke-width="2"/><path d="M22 6 C40 20 38 60 20 88 C4 60 6 22 22 6 Z" fill="#fffdf6" ' + ink + ' stroke-width="2"/><path d="M21 30 L32 24 M21 44 L34 38 M20 58 L31 54 M21 36 L10 30 M20 52 L8 46" stroke="' + INK + '" stroke-width="1.2" fill="none"/>'),
    balloon: (c) => S("0 0 40 90", '<path d="M20 50 C22 62 16 72 20 88" stroke="' + INK + '" stroke-width="1.5" fill="none"/><ellipse cx="20" cy="24" rx="17" ry="22" fill="' + c + '" ' + ink + '/><path d="M16 46 L24 46 L20 51 Z" fill="' + c + '" ' + ink + ' stroke-width="2"/><ellipse cx="13" cy="15" rx="4" ry="6" fill="#fff" opacity=".6"/>'),
    cat: S("0 0 80 50", '<path d="M8 40 C10 22 30 18 46 22 L54 10 L58 22 L64 12 L66 26 C72 30 70 40 64 42 L60 48 M20 40 L16 48 M36 42 L36 48 M50 42 L52 48 M8 38 C0 34 2 20 8 16" fill="' + INK + '" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><circle cx="62" cy="28" r="1.8" fill="' + MUSTARD + '"/>'),
    bat: S("0 0 60 30", '<path d="M30 10 C26 4 22 4 20 8 C14 2 6 4 2 10 C8 10 10 14 10 18 C14 14 18 16 20 20 C22 16 26 16 30 22 C34 16 38 16 40 20 C42 16 46 14 50 18 C50 14 52 10 58 10 C54 4 46 2 40 8 C38 4 34 4 30 10 Z" fill="' + INK + '"/>'),
    envelope: S("0 0 60 40", '<rect x="3" y="3" width="54" height="34" rx="2" fill="#f3e6c4" ' + ink + ' stroke-width="2.5"/><path d="M3 5 L30 24 L57 5" fill="none" ' + ink + ' stroke-width="2"/><circle cx="30" cy="24" r="5" fill="#8b1e1e" stroke="' + INK + '" stroke-width="1.5"/>'),
    boulder: S("0 0 100 100", '<circle cx="50" cy="50" r="46" fill="#8a7a62" ' + ink + ' stroke-width="4"/><path d="M22 34 C30 30 34 40 42 36 M56 70 C62 62 72 66 76 58 M30 68 C36 72 40 64 46 70 M60 24 C66 30 74 26 78 34" ' + ink + ' fill="none" stroke-width="2.5"/>'),
    crow: S("0 0 60 40", '<path d="M6 26 C14 16 28 14 38 18 L52 12 L46 20 C50 24 46 30 40 30 L20 32 Z" fill="' + INK + '"/><path d="M22 32 L20 40 M30 32 L30 40" stroke="' + INK + '" stroke-width="2"/><circle cx="44" cy="19" r="1.4" fill="' + PAPER + '"/>'),
    crowFly: S("0 0 70 40", '<path d="M35 22 C28 8 14 4 2 8 C14 12 22 18 28 26 L42 26 C48 18 56 12 68 8 C56 4 42 8 35 22 Z" fill="' + INK + '"/>'),
    plane: S("0 0 120 60", '<rect x="30" y="24" width="64" height="14" rx="7" fill="#c9c2b0" ' + ink + '/><path d="M52 10 H70 L66 52 H56 Z" fill="#e0d7c0" ' + ink + '/><path d="M92 28 L110 18 L112 42 L92 36" fill="#c9c2b0" ' + ink + '/><circle cx="30" cy="31" r="3" fill="' + INK + '"/><path d="M26 18 V44" stroke="' + INK + '" stroke-width="3"/>'),
    jet: S("0 0 140 50", '<path d="M4 26 C20 18 60 16 110 20 L136 8 L130 26 L136 42 L110 32 C60 36 20 34 4 26 Z" fill="#a9b0b3" ' + ink + '/><path d="M60 22 L86 2 L94 2 L80 24 Z M60 30 L86 48 L94 48 L80 30 Z" fill="#8d9598" ' + ink + '/><path d="M16 24 C20 20 28 20 30 24" fill="#6fc3d6" ' + ink + ' stroke-width="2"/>'),
    cow: S("0 0 80 60", '<ellipse cx="38" cy="30" rx="26" ry="16" fill="' + PAPER + '" ' + ink + '/><path d="M26 20 C30 26 36 22 34 30 C30 34 24 30 22 34 M48 36 C52 30 58 34 56 40" fill="' + INK + '"/><rect x="62" y="16" width="16" height="18" rx="6" fill="' + PAPER + '" ' + ink + '/><rect x="66" y="28" width="12" height="7" rx="3" fill="#e8a8a0" ' + ink + ' stroke-width="2"/><path d="M20 44 V56 M30 44 V56 M46 44 V56 M56 42 V54 M12 26 C4 22 4 34 8 38" ' + ink + ' fill="none"/><path d="M64 16 L60 8 M76 16 L80 8" ' + ink + ' fill="none"/>'),
    fish: (c) => S("0 0 60 36", '<path d="M8 18 C18 4 40 4 48 18 C40 32 18 32 8 18 Z" fill="' + c + '" ' + ink + ' stroke-width="2.5"/><path d="M48 18 L58 8 L58 28 Z" fill="' + c + '" ' + ink + ' stroke-width="2.5"/><path d="M22 9 V27 M32 8 V28" stroke="' + PAPER + '" stroke-width="3"/><circle cx="16" cy="16" r="2.2" fill="' + INK + '"/>'),
    bubble: S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="rgba(255,255,255,.18)" stroke="#e8fbff" stroke-width="1.5"/><circle cx="7" cy="7" r="2" fill="#fff"/>'),
    coin: (c) => S("0 0 40 40", '<circle cx="20" cy="20" r="17" fill="' + (c || MUSTARD) + '" ' + ink + '/><circle cx="20" cy="20" r="11" fill="none" stroke="' + INK + '" stroke-width="1.5" opacity=".5"/>'),
    ringGold: S("0 0 60 60", '<ellipse cx="30" cy="30" rx="24" ry="24" fill="none" stroke="#6b4a10" stroke-width="10"/><ellipse cx="30" cy="30" rx="24" ry="24" fill="none" stroke="#f2c94c" stroke-width="7"/><path d="M14 18 A22 22 0 0 1 30 8" stroke="#fff6c8" stroke-width="2.5" fill="none"/>'),
    moth: S("0 0 80 60", '<path d="M40 30 C30 6 6 4 4 18 C2 30 20 34 38 32 C22 38 12 52 22 56 C30 58 38 44 40 34 C42 44 50 58 58 56 C68 52 58 38 42 32 C60 34 78 30 76 18 C74 4 50 6 40 30 Z" fill="#6d5a45" ' + ink + ' stroke-width="2"/><ellipse cx="40" cy="28" rx="5" ry="6" fill="' + MUSTARD + '" stroke="' + INK + '" stroke-width="1.5"/><circle cx="38.3" cy="26.5" r="1.2" fill="' + INK + '"/><circle cx="41.7" cy="26.5" r="1.2" fill="' + INK + '"/><path d="M38 31 Q40 33 42 31" stroke="' + INK + '" stroke-width="1" fill="none"/><path d="M40 34 V50" stroke="' + INK + '" stroke-width="4"/>'),
    box: S("0 0 80 70", '<path d="M6 22 L40 10 L74 22 L74 60 L40 68 L6 60 Z" fill="#c49a62" ' + ink + '/><path d="M6 22 L40 32 L74 22 M40 32 V68" fill="none" ' + ink + '/><path d="M24 16 L58 28" stroke="#e8d4a8" stroke-width="5"/>'),
    mug: S("0 0 50 50", '<path d="M8 10 H36 V40 C36 46 32 48 26 48 H18 C12 48 8 46 8 40 Z" fill="' + PAPER + '" ' + ink + '/><path d="M36 16 C46 16 46 32 36 32" fill="none" ' + ink + '/>'),
    swan: S("0 0 80 60", '<path d="M8 44 C14 56 56 58 66 46 C72 38 62 30 50 36 C44 40 38 40 34 34 C28 22 34 8 26 6 C18 4 16 14 22 16 C28 20 22 30 24 38 C20 36 14 38 8 44 Z" fill="#fff" ' + ink + '/><path d="M16 12 L10 14 L16 16" fill="' + MUSTARD + '" ' + ink + ' stroke-width="1.5"/><circle cx="21" cy="10" r="1.2" fill="' + INK + '"/>'),
    mouse: S("0 0 70 36", '<path d="M10 26 C12 12 30 8 42 16 C50 20 52 28 46 30 L14 30 C10 30 10 28 10 26 Z" fill="#8c8278" ' + ink + ' stroke-width="2.5"/><circle cx="18" cy="12" r="6" fill="#b5aaa0" ' + ink + ' stroke-width="2"/><circle cx="8" cy="22" r="1.5" fill="' + INK + '"/><path d="M46 28 C58 30 62 20 68 24" fill="none" ' + ink + ' stroke-width="2"/><circle cx="4" cy="26" r="2" fill="#e38c8c"/>'),
    spool: S("0 0 30 30", '<rect x="4" y="6" width="22" height="18" rx="2" fill="#e05a5a" ' + ink + ' stroke-width="2"/><rect x="2" y="3" width="26" height="4" rx="1" fill="#d8b98a" ' + ink + ' stroke-width="2"/><rect x="2" y="23" width="26" height="4" rx="1" fill="#d8b98a" ' + ink + ' stroke-width="2"/>'),
    volleyball: S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#fbfbf4" ' + ink + '/><path d="M30 4 C22 20 22 40 30 56 M6 24 C22 26 40 20 52 12 M8 42 C24 38 42 42 54 46" fill="none" stroke="' + INK + '" stroke-width="1.6" opacity=".6"/><path d="M20 22 C18 16 24 14 25 20 C26 14 32 16 30 22 C34 22 36 28 30 30 C34 34 30 38 26 34 C24 40 18 38 20 32 C14 32 14 26 20 26 Z" fill="#b82c20" opacity=".85"/>'),
    rat: S("0 0 70 30", '<path d="M8 22 C10 10 30 6 44 14 C52 18 52 24 46 26 L14 26 C10 26 8 25 8 22 Z" fill="#4b4238" ' + ink + ' stroke-width="2"/><circle cx="16" cy="11" r="4" fill="#6a5d50" ' + ink + ' stroke-width="1.5"/><circle cx="6" cy="20" r="1.3" fill="' + PAPER + '"/><path d="M46 24 C60 26 62 14 70 18" fill="none" ' + ink + ' stroke-width="2"/>'),
    gnome: S("0 0 50 80", '<path d="M25 2 L40 34 H10 Z" fill="' + RED + '" ' + ink + '/><circle cx="25" cy="38" r="9" fill="#f2c8a0" ' + ink + ' stroke-width="2"/><path d="M14 40 C16 58 34 58 36 40 C32 48 18 48 14 40 Z" fill="#fff" ' + ink + ' stroke-width="2"/><rect x="12" y="52" width="26" height="22" rx="6" fill="' + TEAL + '" ' + ink + '/><path d="M14 76 H24 M28 76 H38" ' + ink + ' stroke-width="4"/>'),
    soot: S("0 0 40 40", '<path d="M20 4 L23 10 L29 6 L28 13 L35 12 L32 18 L38 21 L32 24 L35 30 L28 29 L28 36 L22 32 L19 38 L16 31 L10 35 L11 28 L4 28 L8 22 L2 18 L9 16 L6 9 L13 11 L14 4 L18 9 Z" fill="#111"/><circle cx="15" cy="19" r="4.5" fill="#fff"/><circle cx="25" cy="19" r="4.5" fill="#fff"/><circle cx="15.5" cy="19.5" r="2" fill="#111"/><circle cx="24.5" cy="19.5" r="2" fill="#111"/>'),
    kodama: S("0 0 40 60", '<path d="M8 22 C6 6 34 6 32 22 C33 30 28 34 20 34 C12 34 7 30 8 22 Z" fill="#f4f8ee" stroke="#bfcab0" stroke-width="1.5"/><path d="M13 34 C12 44 14 54 12 58 M27 34 C28 44 26 54 28 58 M14 38 C8 42 8 46 10 48 M26 38 C32 42 32 46 30 48" stroke="#f4f8ee" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="15" cy="20" r="2.4" fill="#23261f"/><circle cx="25" cy="21" r="2" fill="#23261f"/><ellipse cx="20" cy="27" rx="1.6" ry="2.4" fill="#23261f"/>'),
    witch: S("0 0 120 60", '<path d="M10 40 L100 30" ' + ink + ' stroke-width="4"/><path d="M92 26 L118 20 L114 32 L96 36 Z" fill="#8a6a3a" ' + ink + ' stroke-width="2"/><path d="M40 36 C40 20 50 12 58 14 C66 16 64 30 62 36 Z" fill="' + INK + '"/><circle cx="54" cy="10" r="6" fill="' + INK + '"/><path d="M46 8 C50 -2 60 -4 66 4 L58 8 Z" fill="' + INK + '"/><path d="M54 8 L50 12" stroke="' + RED + '" stroke-width="3"/><path d="M78 30 C78 24 84 22 86 26 L88 22 L89 28 C90 32 84 34 80 33 Z" fill="' + INK + '"/>'),
    saucer: S("0 0 100 50", '<ellipse cx="50" cy="32" rx="46" ry="12" fill="#b9c2c4" ' + ink + '/><path d="M30 28 C30 10 70 10 70 28" fill="#9fe8c2" ' + ink + ' opacity=".9"/><circle cx="24" cy="34" r="3" fill="' + MUSTARD + '"/><circle cx="50" cy="38" r="3" fill="' + MUSTARD + '"/><circle cx="76" cy="34" r="3" fill="' + MUSTARD + '"/>'),
    car: (c) => S("0 0 110 50", '<path d="M6 34 C6 24 16 22 26 20 L40 8 H74 L88 20 C100 22 106 26 106 34 V38 H6 Z" fill="' + c + '" ' + ink + '/><path d="M44 12 H56 V20 H36 Z M60 12 H72 L82 20 H60 Z" fill="#cfe9f0" ' + ink + ' stroke-width="2"/><circle cx="28" cy="40" r="8" fill="' + INK + '"/><circle cx="84" cy="40" r="8" fill="' + INK + '"/><circle cx="28" cy="40" r="3" fill="#aaa"/><circle cx="84" cy="40" r="3" fill="#aaa"/>'),
    van: S("0 0 120 60", '<path d="M6 44 V20 C6 10 12 6 22 6 H96 C108 6 114 14 114 26 V44 Z" fill="#f2d33b" ' + ink + '/><path d="M6 30 H114" stroke="#fff" stroke-width="6"/><rect x="18" y="12" width="18" height="12" fill="#cfe9f0" ' + ink + ' stroke-width="2"/><rect x="44" y="12" width="18" height="12" fill="#cfe9f0" ' + ink + ' stroke-width="2"/><rect x="70" y="12" width="18" height="12" fill="#cfe9f0" ' + ink + ' stroke-width="2"/><circle cx="30" cy="48" r="9" fill="' + INK + '"/><circle cx="92" cy="48" r="9" fill="' + INK + '"/>'),
    booth: S("0 0 50 100", '<rect x="6" y="10" width="38" height="86" fill="#2c4f9e" ' + ink + '/><rect x="10" y="2" width="30" height="10" rx="2" fill="#2c4f9e" ' + ink + '/><rect x="12" y="20" width="26" height="60" fill="#bfe4ff" ' + ink + ' stroke-width="2"/><path d="M12 40 H38 M12 60 H38 M25 20 V80" stroke="#2c4f9e" stroke-width="3"/><rect x="14" y="4" width="22" height="6" fill="#fff" opacity=".8"/>'),
    dragon: S("0 0 140 70", '<path d="M70 40 C50 10 20 8 2 20 C24 22 34 30 44 42 C30 40 20 44 14 52 C34 48 52 50 70 48 C88 50 106 48 126 52 C120 44 110 40 96 42 C106 30 116 22 138 20 C120 8 90 10 70 40 Z" fill="#141414"/><circle cx="66" cy="42" r="1.8" fill="#9dff6a"/><circle cx="74" cy="42" r="1.8" fill="#9dff6a"/>'),
    bowlingBall: S("0 0 60 60", '<circle cx="30" cy="30" r="27" fill="#2b3a67" ' + ink + '/><circle cx="24" cy="18" r="3.5" fill="' + INK + '"/><circle cx="34" cy="17" r="3.5" fill="' + INK + '"/><circle cx="29" cy="27" r="3.5" fill="' + INK + '"/><path d="M12 38 C18 48 30 50 38 48" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>'),
    pin: S("0 0 24 60", '<path d="M12 2 C18 2 18 12 15 18 C22 28 22 44 18 58 H6 C2 44 2 28 9 18 C6 12 6 2 12 2 Z" fill="#fff" ' + ink + ' stroke-width="2"/><path d="M8 16 H16 M7 20 H17" stroke="' + RED + '" stroke-width="2"/>'),
    tumbleweed: S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="none" stroke="#9a7b4a" stroke-width="2"/><path d="M8 20 C30 30 40 10 52 22 M6 36 C24 28 36 50 54 38 M20 6 C28 26 18 40 26 56 M38 6 C30 24 44 40 34 56 M10 12 L50 50 M50 10 L12 50" stroke="#8a6b3a" stroke-width="2" fill="none"/>'),
    cymbal: S("0 0 80 30", '<ellipse cx="40" cy="16" rx="38" ry="10" fill="#e3b53c" ' + ink + '/><ellipse cx="40" cy="14" rx="8" ry="3" fill="#c79a22" ' + ink + ' stroke-width="2"/><path d="M14 16 C24 20 56 20 66 16" stroke="#fff3b8" stroke-width="2" fill="none"/>'),
    record: S("0 0 60 60", '<circle cx="30" cy="30" r="28" fill="#141414"/><circle cx="30" cy="30" r="20" fill="none" stroke="#333" stroke-width="1"/><circle cx="30" cy="30" r="14" fill="none" stroke="#333" stroke-width="1"/><circle cx="30" cy="30" r="9" fill="' + RED + '"/><circle cx="30" cy="30" r="1.8" fill="' + PAPER + '"/>'),
    engine: S("0 0 90 60", '<rect x="10" y="10" width="70" height="40" rx="14" fill="#8e969a" ' + ink + '/><ellipse cx="12" cy="30" rx="10" ry="20" fill="#5d6468" ' + ink + '/><path d="M8 16 L16 44 M4 26 L20 34 M6 38 L18 20" stroke="' + INK + '" stroke-width="2"/><path d="M80 16 L88 12 V48 L80 44" fill="#6b7377" ' + ink + '/>'),
    card: S("0 0 50 70", '<rect x="3" y="3" width="44" height="64" rx="5" fill="#fff" ' + ink + '/><text x="9" y="18" font-size="12" font-family="Georgia" fill="' + RED + '">J</text><circle cx="25" cy="32" r="9" fill="#f0e8e0" ' + ink + ' stroke-width="1.5"/><path d="M16 28 L25 14 L34 28" fill="#6a3fa0" ' + ink + ' stroke-width="1.5"/><path d="M19 36 Q25 42 31 36" stroke="' + RED + '" stroke-width="2.5" fill="none"/><path d="M14 54 H36" stroke="#2f8f4a" stroke-width="4"/>'),
    top: S("0 0 40 50", '<path d="M20 48 L6 26 C6 18 34 18 34 26 Z" fill="#9ea6aa" ' + ink + '/><ellipse cx="20" cy="24" rx="14" ry="5" fill="#c9d0d3" ' + ink + ' stroke-width="2"/><rect x="17" y="4" width="6" height="20" rx="2" fill="#7c8589" ' + ink + ' stroke-width="2"/>'),
    moon: S("0 0 200 200", '<circle cx="100" cy="100" r="96" fill="#fdf7dc"/><circle cx="70" cy="80" r="14" fill="#efe6c0"/><circle cx="130" cy="120" r="20" fill="#efe6c0"/><circle cx="120" cy="60" r="8" fill="#efe6c0"/>'),
    bikeET: S("0 0 120 80", '<circle cx="28" cy="62" r="15" fill="none" stroke="#000" stroke-width="4"/><circle cx="92" cy="62" r="15" fill="none" stroke="#000" stroke-width="4"/><path d="M28 62 L50 40 L80 40 L92 62 M50 40 L60 62 L80 40 M76 34 L84 32" stroke="#000" stroke-width="4" fill="none"/><path d="M52 40 C46 26 50 14 60 12 C70 12 72 24 66 38 Z" fill="#000"/><circle cx="60" cy="8" r="6" fill="#000"/><path d="M74 26 C80 18 90 20 90 28 C90 34 82 36 76 34 Z" fill="#000"/><path d="M80 34 L86 42" stroke="#000" stroke-width="3"/>'),
    bill: S("0 0 70 34", '<rect x="2" y="2" width="66" height="30" rx="2" fill="#a7c79a" ' + ink + ' stroke-width="2"/><circle cx="35" cy="17" r="8" fill="#cfe3c4" stroke="' + INK + '" stroke-width="1.5"/><text x="31" y="21" font-size="11" font-family="Georgia" fill="' + INK + '">$</text>'),
    lantern: S("0 0 30 40", '<path d="M6 6 H24 L27 32 C27 36 3 36 3 32 Z" fill="#ffb347"/><rect x="8" y="2" width="14" height="4" fill="#a0521d"/><ellipse cx="15" cy="30" rx="8" ry="4" fill="#fff3b0"/>'),
    petal: (c) => S("0 0 20 20", '<path d="M10 2 C18 6 18 14 10 18 C2 14 2 6 10 2 Z" fill="' + c + '"/>'),
    snowflake: S("0 0 20 20", '<path d="M10 1 V19 M2 5.5 L18 14.5 M2 14.5 L18 5.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'),
    leaf: (c) => S("0 0 20 20", '<path d="M3 17 C3 6 10 2 18 2 C18 10 14 17 3 17 Z M3 17 L12 8" fill="' + c + '" stroke="' + INK + '" stroke-width="1"/>'),
    star: (c) => S("0 0 20 20", '<path d="M10 1 L12.6 7.4 L19 7.6 L14 11.8 L15.8 18.4 L10 14.6 L4.2 18.4 L6 11.8 L1 7.6 L7.4 7.4 Z" fill="' + c + '"/>'),
    heart: (c) => S("0 0 20 20", '<path d="M10 18 C-2 10 2 1 10 5 C18 1 22 10 10 18 Z" fill="' + c + '"/>'),
    sparkle: (c) => S("0 0 20 20", '<path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="' + (c || "#fff") + '"/>'),
    drop: (c) => S("0 0 12 18", '<path d="M6 1 C9 7 11 10 11 13 C11 16 9 17 6 17 C3 17 1 16 1 13 C1 10 3 7 6 1 Z" fill="' + (c || "#bfe4ff") + '" stroke="' + INK + '" stroke-width="1"/>'),

    // --- composite helpers ---
    ring(fx, x, y, opts) {
      opts = opts || {};
      const size = opts.size || 300;
      const el = fx.put('<div style="width:100%;height:100%;border-radius:50%;border:' + (opts.width || 6) + "px solid " + (opts.color || "#fff") + ";box-shadow:0 0 " + (opts.glow || 20) + "px " + (opts.color || "#fff") + '"></div>', x, y, { size });
      return fx.anim(el, [{ transform: "scale(.05)", opacity: 1 }, { transform: "scale(1)", opacity: 0 }], { duration: opts.dur || 900, easing: "ease-out", delay: opts.delay || 0 }).then(() => fx.remove(el));
    },
    glowOn(fx, el, color, ms) {
      return fx.style(el, { boxShadow: "0 0 0 3px " + color + ", 0 0 28px 10px " + color }, ms);
    },
    sparkleOn(fx, target, count, color) {
      return fx.particles({ kind: "burst", from: target, count: count || 12, spread: 30, dur: 900, stagger: 400, glyphs: art.sparkle(color || "#fff8c0"), min: 8, max: 16 });
    },
    // --- old-film kit ---
    // Projector chatter: a shutter click train over a low motor hum.
    projector(fx, sec) {
      sec = sec || 3;
      fx.tone(55, sec, { type: "sawtooth", vol: 0.05, attack: 0.3, filter: { freq: 220 } });
      for (let t = 0; t < sec; t += 1 / 16) fx.click({ freq: 1800, vol: 0.12, at: t });
    },
    // Grain, scratches and flicker over the whole page (sepia/grey optional).
    oldFilm(fx, ms, look) {
      const f = fx.filter(look === "none" ? "none" : look || "grayscale(1) sepia(.35) contrast(1.15) brightness(.95)", ms, { fade: 250 });
      fx.node("", { cls: "fx-filter fx-grain", ms });
      return f;
    },
    // A silent-film title card (tap-through never needed; it just holds).
    intertitle(fx, str, ms) {
      return fx.caption(str, { style: "intertitle", ms: ms || 2600 });
    },
    // An iris closing (or opening) on a point. Static under reduced motion.
    iris(fx, at, opts) {
      opts = opts || {};
      const p = at ? fx.rect(at) : { x: innerWidth / 2, y: innerHeight / 2 };
      const el = fx.node("", { cls: "fx-filter" });
      const big = Math.hypot(innerWidth, innerHeight);
      const end = opts.to == null ? 70 : opts.to;
      const set = (r) => (el.style.background = "radial-gradient(circle at " + p.x + "px " + p.y + "px, transparent " + r + "px, " + (opts.color || "#0b0907") + " " + (r + 1.5) + "px)");
      if (fx.reduced) { set(opts.open ? big : end); return Promise.resolve(el); }
      const from = opts.open ? end : big, to = opts.open ? big : end;
      return fx.tween(opts.dur || 900, (k) => set(from + (to - from) * k), (k) => 1 - Math.pow(1 - k, 3)).then(() => el);
    },
    // Tints the page like a hand-coloured print.
    tint(fx, color, ms, opacity) {
      return fx.wash(color, ms, { blend: "multiply", opacity: opacity == null ? 0.55 : opacity, fade: 300 });
    },

    // Lifts the new slot above the fx layer (so full-screen filters skip it).
    liftSlot(fx, ms) {
      const s = fx.slot();
      if (s) fx.cls(s, "fx-lift", ms);
      return s;
    }
  };

  window.MachineFX.art = art;
})();
