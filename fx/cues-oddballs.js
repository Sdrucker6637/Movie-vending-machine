/* Machine FX cues - oddballs: cult curios, midnight movies and world cinema.
   Keyed by TMDB movie id; see fx/engine.js for the cue format. */
(function () {
  "use strict";
  const M = window.MachineFX;
  if (!M || !M.art) return;
  const A = M.art;
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;
  const pt = (x, y, w, h) => ({ x, y, width: w || 0, height: h || 0 });
  const dot = (c) => '<div class="fx-dot" style="width:100%;height:100%;background:' + (c || "#fff") + '"></div>';
  const box = (css) => '<div style="width:100%;height:100%;' + css + '"></div>';
  const neon = (fx, ms) => { fx.filter("saturate(1.8) contrast(1.1)", ms, { fade: 300 }); fx.wash("linear-gradient(135deg, rgba(255,0,170,.2), rgba(0,220,255,.2))", ms, { fade: 300 }); };
  const warm = (fx, ms) => fx.filter("sepia(.3) saturate(1.2)", ms, { fade: 300 });
  const hit = (fx, at) => { fx.thud({ vol: 0.4, freq: 90, dur: 0.12, at: at || 0 }); fx.noise(0.08, { type: "highpass", freq: 2000, vol: 0.4, at: at || 0 }); };
  const shot = (fx, at) => { fx.noise(0.18, { freq: 2600, vol: 0.6, at: at || 0 }); fx.thud({ vol: 0.3, freq: 110, dur: 0.1, at: at || 0 }); };
  const synth = (fx, notes, beat, vol) => fx.seq(notes, { type: "sawtooth", vol: vol || 0.05, beat: beat || 0.2, filter: { freq: 1800, q: 4 } });
  const walker = (c) => A.S("0 0 30 60", '<circle cx="15" cy="8" r="6" fill="' + c + '"/><path d="M7 16 H23 L22 40 H8 Z" fill="' + c + '"/><path d="M9 40 L6 58 M21 40 L24 58" stroke="' + c + '" stroke-width="4"/>');

  M.register([
    // The Adventures of Buckaroo Banzai Across the 8th Dimension
    {
      id: 11379,
      y: 1984,
      run: async (fx) => {
        neon(fx, 6600);
        const r = fx.rect(fx.slot());
        const car = fx.put(A.S("0 0 120 50", '<path d="M6 34 C6 24 20 20 36 18 L50 8 H80 L94 18 C108 20 114 26 114 34 V38 H6 Z" fill="#c9c9c9" ' + A.ink + ' stroke-width="2"/><path d="M10 38 H0 L4 30" stroke="#ff7a1a" stroke-width="4"/><circle cx="30" cy="40" r="8" fill="#1d1a18"/><circle cx="92" cy="40" r="8" fill="#1d1a18"/>'), -120, r.y, { size: 110, h: 46 });
        fx.caption("(the oscillation overthruster: engage)", { style: "whisper", ms: 2000 });
        fx.tone(120, 1.4, { type: "sawtooth", vol: 0.07, slide: 1600, filter: { freq: 2000 } });
        await fx.move(car, [{ transform: "none" }, { transform: "translateX(" + (r.x + 120) + "px)" }], { duration: 1200, easing: "ease-in", fill: "forwards" });
        A.glitch ? A.glitch(fx, 600) : fx.flash("#bfe8ff", 200);
        fx.style(fx.slot(), { filter: "hue-rotate(160deg) saturate(3)" }, 1600);
        fx.flash("rgba(160,255,240,.6)", 300);
        await fx.move(car, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
        await fx.wait(600);
        fx.caption("No matter where you go, there you are.", { style: "subtitle", ms: 2400 });
        await fx.wait(2400);
      }
    },

    // Flash Gordon
    {
      id: 3604,
      y: 1980,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(255,40,40,.3), rgba(255,200,0,.25))", 6400, { fade: 300 });
        const beat = 0.22;
        const riff = [["D4", 1], ["D4", 1], ["D4", 1], ["D4", 1], ["C4", 2], ["D4", 2]];
        synth(fx, riff.concat(riff), beat, 0.07);
        for (let i = 0; i < 12; i++) fx.thud({ freq: 60, vol: 0.3, dur: 0.1, at: i * beat * 2 });
        fx.caption("Flash! Ah-ahhh!", { style: "hand", ms: 1800 });
        await fx.wait(1600);
        fx.caption("(saviour of the universe)", { style: "whisper", ms: 1800 });
        const ship = A.S("0 0 100 40", '<path d="M4 20 C20 4 80 4 96 20 C80 36 20 36 4 20 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M4 20 L-4 10 M4 20 L-4 30" stroke="#ffcf5a" stroke-width="4"/><circle cx="70" cy="18" r="6" fill="#ffcf5a"/>');
        for (let i = 0; i < 3; i++) fx.later(i * 400, () => fx.fly(ship, [-100, H() * (0.2 + i * 0.12)], [W() + 100, H() * (0.3 + i * 0.1)], { size: 90, h: 36, dur: 1800 }));
        fx.particles({ kind: "drift", count: 30, glyphs: dot("#ffe070"), min: 2, max: 5, dur: 3000 });
        await fx.wait(2600);
        fx.caption("Gordon's alive?!", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Heavy Metal
    {
      id: 11827,
      y: 1981,
      run: async (fx) => {
        fx.wash("linear-gradient(#1a0030, #401060)", 6400, { opacity: 0.6, fade: 300 });
        const orb = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff, #6aff5a 30%, #1a8a2a 60%, transparent 70%);box-shadow:0 0 30px #6aff5a"></div>', W() / 2, H() * 0.35, { size: 80 });
        fx.move(orb, [{ transform: "scale(.9)" }, { transform: "scale(1.1)" }], { duration: 500, iterations: 10, direction: "alternate" });
        fx.caption("(the Loc-Nar — the sum of all evils)", { style: "whisper", ms: 2200 });
        const pc = [["E2", 1], ["E2", 1], ["G2", 1], ["E2", 1], ["A2", 1], ["G2", 1], ["E2", 2]];
        fx.seq(pc.concat(pc), { type: "sawtooth", vol: 0.09, beat: 0.18, filter: { freq: 900, q: 6 } });
        await fx.wait(2600);
        const car = A.S("0 0 120 50", '<path d="M6 34 C6 24 20 18 40 16 L56 6 H84 L98 18 C110 20 116 26 116 34 V38 H6 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="40" r="8" fill="#1d1a18"/><circle cx="92" cy="40" r="8" fill="#1d1a18"/>');
        fx.caption("(a 1960 Corvette, re-entering from orbit)", { style: "whisper", ms: 2000 });
        fx.tone(2000, 1.4, { type: "sawtooth", vol: 0.05, slide: 200, filter: { freq: 1400 } });
        await fx.fly(car, [W() * 0.9, -60], [W() * 0.2, H() * 0.75], { size: 100, h: 42, dur: 1400, r0: 30, r1: 0 });
        fx.thud({ vol: 0.6, freq: 50 });
        fx.shake("md", 500);
        await fx.wait(1000);
      }
    },

    // The Toxic Avenger
    {
      id: 15239,
      y: 1984,
      run: async (fx) => {
        const barrel = fx.put(A.S("0 0 50 60", '<rect x="6" y="6" width="38" height="50" rx="4" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><path d="M6 20 H44 M6 42 H44" stroke="#1d1a18" stroke-width="2"/><circle cx="25" cy="31" r="7" fill="none" stroke="#1d1a18" stroke-width="2"/><path d="M25 31 L20 26 M25 31 L30 26 M25 31 V38" stroke="#1d1a18" stroke-width="2"/>'), W() / 2, H() * 0.35, { size: 50, h: 60 });
        fx.caption("(a nerd, a tutu, a vat of toxic waste)", { style: "whisper", ms: 2000 });
        await fx.move(barrel, [{ transform: "rotate(0)" }, { transform: "rotate(100deg) translateY(10px)" }], { duration: 800, fill: "forwards" });
        fx.particles({ kind: "burst", from: barrel, count: 20, spread: 60, gravity: 80, glyphs: A.drop("#7aff3a"), min: 6, max: 12, dur: 1000 });
        fx.noise(0.6, { type: "lowpass", freq: 700, vol: 0.4 });
        await fx.wait(1000);
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => fx.style(s, { filter: "hue-rotate(80deg) saturate(2.2)" }, 3200));
        fx.tone(200, 1.2, { type: "square", vol: 0.05, slide: 60, vibrato: [8, 40], filter: { freq: 800 } });
        fx.costume(".reely", '<path d="M44 40 C40 30 50 28 52 36 M70 50 C76 44 82 50 78 56" stroke="#3a8a2a" stroke-width="6" fill="none"/><path d="M40 20 L30 8 L44 16" fill="#b0b0b0"/>', 3000);
        fx.caption("(and so a hero is born — with a mop)", { style: "whisper", ms: 2000 });
        await fx.wait(3000);
      }
    },

    // Cry-Baby
    {
      id: 9768,
      y: 1990,
      run: async (fx) => {
        fx.filter("saturate(1.5) contrast(1.05)", 6600, { fade: 300 });
        const r = fx.rect(fx.slot());
        fx.caption("(one single, perfect tear)", { style: "whisper", ms: 1800 });
        const tear = fx.put(A.drop("#bfe4ff"), r.x - 10, r.y - 10, { size: 12, h: 18, style: { filter: "drop-shadow(0 0 4px #fff)" } });
        await fx.move(tear, [{ transform: "none" }, { transform: "translateY(" + r.height * 0.5 + "px)" }], { duration: 2000, easing: "ease-in", fill: "forwards" });
        fx.tone(3000, 0.5, { type: "sine", vol: 0.06 });
        await fx.wait(600);
        const beat = 0.18;
        const doo = [["C5", 1], ["C5", 1], ["A4", 1], ["A4", 1], ["F4", 1], ["F4", 1], ["G4", 2], ["C5", 1], ["C5", 1], ["A4", 1], ["F4", 1], ["G4", 4]];
        fx.seq(doo, { type: "triangle", vol: 0.07, beat });
        for (let i = 0; i < 16; i++) fx.noise(0.04, { type: "highpass", freq: 6000, vol: 0.12, at: i * beat * 2 });
        fx.costume(".reely", '<path d="M36 40 C30 10 90 10 84 40 C80 24 60 20 36 40 Z" fill="#1d1a18"/><path d="M26 70 H94 L100 150 H20 Z" fill="#1d1a18" stroke="#1f1b16" stroke-width="3"/>', 3200);
        fx.caption("(the Drapes versus the Squares)", { style: "whisper", ms: 2000 });
        await fx.wait(3200);
      }
    },

    // Withnail & I
    {
      id: 13446,
      y: 1987,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(.8) brightness(.95)", 7000, { fade: 400 });
        fx.wash("rgba(100,110,110,.25)", 7000, { fade: 400 });
        fx.caption("We want the finest wines available to humanity.", { style: "subtitle", ms: 2400 });
        const bottles = [];
        for (let i = 0; i < 7; i++) bottles.push(fx.put(A.S("0 0 20 60", '<path d="M7 2 H13 V16 C18 20 18 24 18 28 V58 H2 V28 C2 24 2 20 7 16 Z" fill="' + (i % 2 ? "#3a5a2a" : "#5a1a2a") + '" ' + A.ink + ' stroke-width="1.5"/>'), W() * (0.2 + i * 0.1), H() * 0.72, { size: 16, h: 48 }));
        for (let i = 0; i < 7; i++) fx.click({ freq: 1800 - i * 100, vol: 0.15, at: 0.3 + i * 0.15 });
        await fx.wait(2600);
        fx.caption("And we want them here, and we want them now!", { style: "subtitle", ms: 2000 });
        bottles.forEach((b, i) => fx.move(b, [{ transform: "none" }, { transform: "rotate(" + (i % 2 ? 90 : -90) + "deg) translateY(10px)" }], { duration: 500, delay: i * 80, fill: "forwards" }));
        for (let i = 0; i < 7; i++) fx.noise(0.12, { type: "highpass", freq: 3000, vol: 0.2, at: i * 0.08 + 0.3 });
        fx.shake("sm", 500);
        await fx.wait(2200);
      }
    },

    // Braindead (Dead Alive)
    {
      id: 763,
      y: 1992,
      run: async (fx) => {
        fx.filter("saturate(1.3)", 6400, { fade: 300 });
        const monkey = fx.put(A.S("0 0 50 40", '<ellipse cx="24" cy="26" rx="16" ry="10" fill="#6b4a2a"/><circle cx="36" cy="16" r="10" fill="#6b4a2a"/><circle cx="40" cy="14" r="2" fill="#ff2020"/><path d="M8 26 C0 20 4 10 10 14" stroke="#6b4a2a" stroke-width="3" fill="none"/>'), W() * 0.3, H() * 0.66, { size: 50, h: 40 });
        fx.caption("(the Sumatran rat-monkey)", { style: "whisper", ms: 1800 });
        fx.tone(900, 0.6, { type: "square", vol: 0.05, vibrato: [30, 200] });
        await fx.move(monkey, [{ transform: "none" }, { transform: "translateX(" + W() * 0.2 + "px)" }], { duration: 800, easing: "steps(6)", fill: "forwards" });
        await fx.wait(1200);
        const mower = A.S("0 0 70 60", '<rect x="10" y="30" width="46" height="18" rx="3" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><circle cx="18" cy="50" r="7" fill="#1d1a18"/><circle cx="48" cy="50" r="7" fill="#1d1a18"/><path d="M56 34 L68 4" stroke="#6d7478" stroke-width="4"/>');
        fx.caption("(the lawnmower comes out)", { style: "whisper", ms: 1800 });
        for (let t = 0; t < 2.4; t += 0.05) fx.noise(0.04, { type: "bandpass", freq: 300, q: 2, vol: 0.2, at: t });
        fx.tone(90, 2.4, { type: "sawtooth", vol: 0.06, vibrato: [30, 20], filter: { freq: 600 } });
        fx.later(800, () => fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.7), count: 24, spread: 80, gravity: 100, glyphs: A.drop("#b3122a"), min: 5, max: 10, dur: 1000 }));
        await fx.fly(mower, [W() + 70, H() * 0.7], [-70, H() * 0.7], { size: 70, h: 60, dur: 2400, flip: true });
        await fx.wait(400);
      }
    },

    // Earth Girls Are Easy
    {
      id: 2210,
      y: 1988,
      run: async (fx) => {
        fx.filter("saturate(1.6)", 6600, { fade: 300 });
        fx.wash("linear-gradient(rgba(255,120,200,.2), rgba(120,220,255,.2))", 6600, { fade: 300 });
        const pool = fx.put(box("background:linear-gradient(#8fdfff, #3aa0e8);border:4px solid #f4f0e6;border-radius:40px"), W() / 2, H() * 0.7, { size: 220, h: 60 });
        void pool;
        fx.caption("(a spaceship lands in a San Fernando Valley pool)", { style: "whisper", ms: 2400 });
        const ship = fx.put(A.saucer, W() / 2, -60, { size: 100, h: 50 });
        fx.tone(1200, 1.6, { type: "sine", vol: 0.06, slide: 300, vibrato: [10, 20] });
        await fx.move(ship, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.7 + 50) + "px)" }], { duration: 1600, easing: "ease-in", fill: "forwards" });
        fx.noise(0.8, { type: "lowpass", freq: 800, vol: 0.5 });
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.7), count: 20, spread: 70, gravity: 100, glyphs: A.drop("#bfe4ff"), min: 6, max: 10, dur: 900 });
        await fx.wait(1000);
        const fur = ["#3a6ad8", "#ff5aa8", "#ff7a1a"];
        fur.forEach((c, i) => fx.put(A.S("0 0 40 60", '<circle cx="20" cy="18" r="16" fill="' + c + '"/><path d="M6 30 C4 50 36 50 34 30" fill="' + c + '"/><circle cx="14" cy="16" r="3" fill="#fff"/><circle cx="26" cy="16" r="3" fill="#fff"/>'), W() * (0.3 + i * 0.2), H() * 0.5, { size: 40, h: 60, ms: 2400 }));
        fx.caption("(three very furry aliens, in need of a salon)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Howard the Duck
    {
      id: 10658,
      y: 1986,
      run: async (fx) => {
        const duck = A.S("0 0 50 60", '<circle cx="24" cy="16" r="12" fill="#fbfbf4" ' + A.ink + ' stroke-width="1.5"/><path d="M32 18 L46 20 L32 24 Z" fill="#ff9a1a" ' + A.ink + ' stroke-width="1"/><circle cx="26" cy="13" r="2" fill="#1d1a18"/><path d="M10 28 H40 L42 50 H8 Z" fill="#3a6ad8" ' + A.ink + ' stroke-width="1.5"/><path d="M12 50 L10 58 M36 50 L38 58" stroke="#ff9a1a" stroke-width="4"/><path d="M14 6 H34 V2 H14 Z" fill="#1d1a18"/>');
        fx.caption("(a duck, trapped in a world he never made)", { style: "whisper", ms: 2200 });
        fx.tone(600, 0.5, { type: "sawtooth", vol: 0.06, slide: 200, filter: { freq: 1400 } });
        await fx.fly(duck, [W() / 2, -60], [W() / 2, H() * 0.6], { size: 50, h: 60, dur: 1400, r0: 720, r1: 0 });
        fx.thud({ vol: 0.5, freq: 80 });
        const quack = (at) => { fx.tone(700, 0.15, { type: "sawtooth", vol: 0.06, slide: 400, at, filter: { type: "bandpass", freq: 1200, q: 3 } }); };
        quack(0.2); quack(0.5);
        await fx.wait(1400);
        const riff = [["E4", 1], ["G4", 1], ["A4", 1], ["B4", 2], ["A4", 1], ["G4", 1], ["E4", 3]];
        synth(fx, riff, 0.2, 0.06);
        fx.caption("(Cherry Bomb, live, with a duck on guitar)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Masters of the Universe
    {
      id: 11649,
      y: 1987,
      run: async (fx) => {
        const sword = fx.put(A.S("0 0 30 120", '<path d="M15 2 L22 80 H8 Z" fill="#dfe6ea" ' + A.ink + ' stroke-width="1.5"/><path d="M0 80 H30 V88 H0 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><rect x="11" y="88" width="8" height="26" fill="#6b4a2a"/>'), W() / 2, H() * 0.4, { size: 34, h: 136 });
        fx.caption("By the power of Grayskull!", { style: "hand", ms: 2200 });
        fx.chord(["C4", "G4", "C5", "E5"], 2, { type: "sawtooth", vol: 0.06, filter: { freq: 2400 } });
        await fx.move(sword, [{ transform: "none" }, { transform: "translateY(-40px)" }], { duration: 800, fill: "forwards" });
        for (let i = 0; i < 6; i++) fx.later(i * 120, () => fx.flash(i % 2 ? "rgba(255,255,255,.6)" : "rgba(160,200,255,.6)", 100));
        fx.noise(1, { type: "bandpass", freq: 4000, q: 2, vol: 0.3 });
        await fx.wait(1600);
        fx.caption("(the Cosmic Key — a synthesiser that opens portals)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 8; i++) fx.tone(fx.pick(["C5", "E5", "G5", "B5", "D6"]), 0.2, { type: "square", vol: 0.05, at: i * 0.15 });
        fx.later(1300, () => fx.flash("rgba(120,255,200,.4)", 400));
        await fx.wait(2400);
      }
    },

    // Krull
    {
      id: 849,
      y: 1983,
      run: async (fx) => {
        fx.filter("saturate(1.3) contrast(1.05)", 6600, { fade: 300 });
        const glaive = A.S("0 0 60 60", '<path d="M30 30 L30 2 L36 18 Z M30 30 L58 30 L42 36 Z M30 30 L30 58 L24 42 Z M30 30 L2 30 L18 24 Z M30 30 L50 10 L44 26 Z M30 30 L10 50 L16 34 Z" fill="#c9a24a" stroke="#1d1a18" stroke-width="1"/><circle cx="30" cy="30" r="6" fill="#dfe6ea" stroke="#1d1a18" stroke-width="1.5"/>');
        fx.caption("(the Glaive)", { style: "whisper", ms: 1600 });
        fx.tone(900, 2.4, { type: "sine", vol: 0.05, vibrato: [20, 40] });
        await fx.fly(glaive, [-40, H() * 0.6], [W() + 40, H() * 0.3], { size: 50, dur: 2000, via: [W() / 2, H() * 0.1], r1: 1440 });
        await fx.fly(glaive, [W() + 40, H() * 0.3], [W() / 2, H() * 0.5], { size: 50, dur: 1200, r1: -1080 });
        fx.click({ freq: 2400, vol: 0.4 });
        const horse = A.S("0 0 80 50", '<path d="M10 30 C12 20 40 18 52 22 L58 8 L62 10 L62 22 L68 30 C70 36 66 40 60 38 L40 40 L38 50 M18 38 L16 50" fill="#1d1a18" stroke="#1d1a18" stroke-width="2"/><path d="M50 26 C60 26 70 20 76 12" stroke="#ff7a1a" stroke-width="3" fill="none"/>');
        fx.caption("(the Fire Mares cover a thousand leagues a day)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 3; i++) fx.later(i * 200, () => fx.fly(horse, [-80, H() * (0.7 + i * 0.05)], [W() + 80, H() * (0.7 + i * 0.05)], { size: 70, h: 44, dur: 800 }));
        await fx.wait(2000);
      }
    },

    // Hudson Hawk
    {
      id: 9292,
      y: 1991,
      run: async (fx) => {
        const clock = fx.put('<div style="font:700 20px/1 \'Courier New\',monospace;color:#3aff8a;background:#0a0a0a;padding:6px 10px;border:2px solid #333">5:34</div>', W() / 2, H() * 0.25, { size: 90, h: 34 });
        fx.caption("(the heist has to be timed to a song)", { style: "whisper", ms: 2000 });
        const swinging = [["G4", 1], ["G4", 0.5], ["A4", 0.5], ["B4", 1], ["D5", 1], ["B4", 1], ["A4", 1], ["G4", 2], ["E4", 1], ["G4", 1], ["A4", 2], ["G4", 4]];
        fx.seq(swinging, { type: "triangle", vol: 0.07, beat: 0.22 });
        for (let s = 34; s >= 26; s--) {
          clock.firstChild.textContent = "5:" + String(s).padStart(2, "0");
          fx.click({ freq: 2200, vol: 0.12 });
          await fx.wait(450);
        }
        fx.caption("(and swing the loot out the window)", { style: "whisper", ms: 1800 });
        const r = fx.rect(fx.slot());
        const sforza = A.S("0 0 40 50", '<path d="M6 10 H34 V46 H6 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><circle cx="20" cy="28" r="8" fill="#6b4a2a"/>');
        await fx.fly(sforza, [r.x, r.y], [W() + 40, H() * 0.3], { size: 34, h: 42, dur: 1400, via: [W() * 0.8, H() * 0.7] });
        await fx.wait(400);
      }
    },

    // Last Action Hero
    {
      id: 9593,
      y: 1993,
      run: async (fx) => {
        const ticket = fx.put('<div style="width:100%;height:100%;background:linear-gradient(90deg,#ffd23b,#fff6a0,#ffd23b);border:2px dashed #b38a00;border-radius:4px;font:900 12px/34px Georgia,serif;color:#6b4a2a;text-align:center;box-shadow:0 0 18px #ffe070">ADMIT ONE</div>', W() / 2, H() * 0.36, { size: 130, h: 38 });
        fx.caption("(a magic ticket, torn in half)", { style: "whisper", ms: 1800 });
        fx.chord(["C5", "E5", "G5", "C6"], 1.4, { type: "sine", vol: 0.06, attack: 0.3 });
        await fx.wait(1800);
        fx.remove(ticket);
        fx.flash("#fff6c0", 400);
        fx.noise(0.6, { type: "highpass", freq: 2000, vol: 0.3 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => fx.style(s, { filter: "saturate(2.2) contrast(1.2)" }, 3600));
        fx.caption("(now you're in the movie — where nothing ever hurts)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 4; i++) { fx.later(1000 + i * 250, () => { fx.thud({ vol: 0.8, freq: 40 }); fx.flash("#ffcf5a", 150); }); }
        fx.later(1000, () => fx.shake("md", 1000));
        await fx.wait(2600);
        fx.caption("I'll be back… ish.", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Demolition Man
    {
      id: 9739,
      y: 1993,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(255,255,255,.3), rgba(220,240,255,.3))", 6600, { fade: 300 });
        const ticketer = fx.put('<div style="width:100%;height:100%;background:#1d1a18;border:2px solid #9aa2a6;border-radius:4px;font:700 10px/1.3 \'Courier New\',monospace;color:#3aff8a;padding:4px;box-sizing:border-box;text-align:center">MORALITY STATUTE</div>', W() / 2, H() * 0.28, { size: 170, h: 40 });
        void ticketer;
        const buzz = (at) => fx.tone(1000, 0.2, { type: "square", vol: 0.06, at });
        fx.caption("(you've been fined one credit for a violation of the verbal morality statute)", { style: "whisper", ms: 2600, css: { fontSize: "11px" } });
        for (let i = 0; i < 3; i++) { buzz(i * 0.7); fx.later(i * 700, () => fx.put('<div style="font:700 11px/1 \'Courier New\',monospace;background:#fbf8ee;border:1px solid #1d1a18;padding:3px 6px">1 CREDIT</div>', W() / 2 + (i - 1) * 50, H() * 0.36 + i * 14, { size: 80, h: 20, ms: 2400 - i * 700 })); }
        await fx.wait(2600);
        const shells = A.S("0 0 40 30", '<ellipse cx="10" cy="15" rx="8" ry="11" fill="#f4e8c8" ' + A.ink + ' stroke-width="1.2"/><ellipse cx="22" cy="15" rx="8" ry="11" fill="#f4e8c8" ' + A.ink + ' stroke-width="1.2"/><ellipse cx="34" cy="15" rx="8" ry="11" fill="#f4e8c8" ' + A.ink + ' stroke-width="1.2"/>');
        fx.put(shells, W() / 2, H() * 0.6, { size: 60, h: 45, ms: 2000 });
        fx.caption("(the three seashells. Nobody explains them.)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Waterworld
    {
      id: 9804,
      y: 1995,
      run: async (fx) => {
        const sea = fx.put(box("background:linear-gradient(rgba(40,140,200,.5), rgba(10,60,110,.8))"), W() / 2, H() + H() * 0.3, { size: W(), h: H() * 0.6 });
        fx.caption("(the ice caps melted)", { style: "whisper", ms: 1800 });
        fx.noise(4, { type: "lowpass", freq: 500, sweep: 900, vol: 0.3, attack: 1 });
        await fx.move(sea, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.5 + "px)" }], { duration: 3000, easing: "ease-in-out", fill: "forwards" });
        const tri = A.S("0 0 100 80", '<path d="M10 60 H90 L80 72 H20 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M50 60 V6 L86 56 Z" fill="#e8e0d0" ' + A.ink + ' stroke-width="1.5"/><path d="M48 60 V14 L20 56 Z" fill="#d8d0c0" ' + A.ink + ' stroke-width="1.5"/>');
        await fx.fly(tri, [-100, H() * 0.55], [W() + 100, H() * 0.55], { size: 90, h: 72, dur: 2400, easing: "linear" });
        fx.caption("(Dryland is on the map, tattooed on a girl's back)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Super Mario Bros. (1993)
    {
      id: 9607,
      y: 1993,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(80,120,60,.25), rgba(60,40,30,.35))", 6600, { fade: 300 });
        const beat = 0.14;
        const bit = [["E5", 1], ["E5", 1], [null, 1], ["E5", 1], [null, 1], ["C5", 1], ["E5", 2], ["G5", 4], ["G4", 4]];
        fx.seq(bit, { type: "square", vol: 0.05, beat });
        fx.later(beat * 16 * 1000, () => { fx.tone(200, 0.8, { type: "square", vol: 0.05, slide: 60 }); fx.caption("(…not quite the game you remember)", { style: "whisper", ms: 2000 }); });
        await fx.wait(beat * 16 * 1000 + 300);
        fx.wash("rgba(80,160,80,.35)", 3000, { fade: 400 });
        fx.particles({ kind: "fall", count: 30, glyphs: A.S("0 0 20 20", '<path d="M4 16 C4 6 16 6 16 16 Z" fill="#6a8a3a" opacity=".7"/><path d="M6 14 C8 12 12 12 14 14" stroke="#3a5a1a"/>'), min: 8, max: 16, dur: 2600, spin: 90 });
        fx.caption("(the fungus is everywhere in Dinohattan)", { style: "whisper", ms: 2000, css: { bottom: "12vh" } });
        const shoes = A.S("0 0 50 30", '<path d="M4 20 C4 10 30 8 40 14 L46 20 V26 H4 Z" fill="#1d1a18"/><rect x="6" y="20" width="36" height="4" fill="#ff7a1a"/>');
        fx.put(shoes, W() / 2, H() * 0.7, { size: 50, h: 30, ms: 1800 });
        fx.tone(600, 0.6, { type: "sine", vol: 0.06, slide: 1400 });
        await fx.wait(2600);
      }
    },

    // Cool World
    {
      id: 14239,
      y: 1992,
      run: async (fx) => {
        const cols = ["#ff5aa8", "#3aff8a", "#f2d33b", "#3a6ad8"];
        fx.wash("linear-gradient(135deg, rgba(255,90,168,.3), rgba(58,255,138,.3))", 6600, { fade: 300 });
        const doodles = [];
        for (let i = 0; i < 10; i++) {
          const d = fx.put(A.S("0 0 40 40", '<path d="M6 34 C10 6 30 6 34 34 M12 20 C20 26 26 16 30 22" stroke="' + cols[i % 4] + '" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="16" cy="14" r="3" fill="#1d1a18"/><circle cx="26" cy="14" r="3" fill="#1d1a18"/>'), fx.rand(20, W() - 20), fx.rand(40, H() - 40), { size: 36, style: { opacity: 0 } });
          doodles.push(d);
          fx.anim(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: i * 120, fill: "forwards" });
          fx.later(i * 120, () => fx.tone(fx.rand(400, 1400), 0.12, { type: "square", vol: 0.04, slide: fx.rand(200, 1600) }));
        }
        fx.caption("(a doodle crossed into the real world)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        doodles.forEach((d) => fx.move(d, [{ transform: "none" }, { transform: "rotate(20deg) scale(1.3)" }, { transform: "rotate(-20deg) scale(.8)" }, { transform: "none" }], { duration: 700, iterations: 3 }));
        fx.caption("(noids aren't allowed to touch doodles)", { style: "whisper", ms: 2200, css: { bottom: "12vh" } });
        await fx.wait(2400);
      }
    },

    // The Rocketeer
    {
      id: 10249,
      y: 1991,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(1.3)", 6600, { fade: 300 });
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M36 50 C36 20 84 20 84 50 L80 58 C76 44 44 44 40 58 Z" fill="#c9a24a" stroke="#1f1b16" stroke-width="2"/><path d="M60 20 V8" stroke="#c9a24a" stroke-width="4"/><path d="M34 90 H44 V130 H34 Z M76 90 H86 V130 H76 Z" fill="#9aa2a6" stroke="#1f1b16" stroke-width="2"/>', 6400);
        fx.caption("(a rocket pack, a stolen chewing-gum fix, and a finned helmet)", { style: "whisper", ms: 2400 });
        await fx.wait(2000);
        const r = fx.rect(reely);
        fx.noise(2, { freq: 600, sweep: 2000, vol: 0.4, attack: 0.2 });
        fx.particles({ kind: "burst", from: pt(r.x, r.y + r.height * 0.4), count: 20, spread: 40, gravity: 200, glyphs: dot("#ff9a3a"), min: 4, max: 8, dur: 800 });
        await fx.move(reely, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.4 + "px)" }, { transform: "translateY(-" + H() * 0.4 + "px) translateX(30px)" }, { transform: "none" }], { duration: 2600, easing: "ease-in-out" });
        const brass = [["C5", 1], ["E5", 1], ["G5", 2], ["C6", 4]];
        fx.seq(brass, { type: "sawtooth", vol: 0.06, beat: 0.25, filter: { freq: 2000 } });
        await fx.wait(1600);
      }
    },

    // Hackers
    {
      id: 10428,
      y: 1995,
      run: async (fx) => {
        neon(fx, 6600);
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 6600, style: { opacity: 0.4 } });
        const scr = fx.put('<div style="width:100%;height:100%;background:#050510;border:2px solid #3aff8a;box-sizing:border-box;padding:6px;font:11px/1.3 \'Courier New\',monospace;color:#3aff8a;white-space:pre;overflow:hidden"></div>', W() / 2, H() * 0.4, { size: Math.min(W() * 0.9, 280), h: 130 });
        const lines = ["> login: zero_cool", "> password: ****", "> ACCESS GRANTED", "> gibson.ellingson.net", "> HACK THE PLANET!"];
        for (const l of lines) {
          for (let i = 0; i <= l.length; i += 2) {
            scr.firstChild.textContent = lines.slice(0, lines.indexOf(l)).join("\n") + (lines.indexOf(l) ? "\n" : "") + l.slice(0, i);
            fx.click({ freq: 3000, vol: 0.08 });
            await fx.wait(25);
          }
          if (l === "> ACCESS GRANTED") fx.sfx("confirm", { vol: 0.6 });
          await fx.wait(250);
        }
        synth(fx, [["A3", 1], ["A3", 1], ["C4", 1], ["A3", 1], ["E4", 2], ["D4", 2]], 0.16, 0.06);
        fx.caption("(it's in that place where I put that thing that time)", { style: "whisper", ms: 2000 });
        const cube = fx.put(A.S("0 0 60 60", '<path d="M30 4 L56 18 V44 L30 58 L4 44 V18 Z" fill="none" stroke="#ff2dd4" stroke-width="2"/><path d="M4 18 L30 32 L56 18 M30 32 V58" stroke="#00e5ff" stroke-width="2" fill="none"/>'), W() * 0.8, H() * 0.7, { size: 60 });
        fx.move(cube, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 2000 });
        await fx.wait(2000);
      }
    },

    // Killer Klowns from Outer Space
    {
      id: 16296,
      y: 1988,
      run: async (fx) => {
        const tent = fx.put(A.S("0 0 140 110", '<path d="M10 100 L70 10 L130 100 Z" fill="#fbfbf4" ' + A.ink + ' stroke-width="2"/>' + [0, 1, 2, 3].map((i) => '<path d="M70 10 L' + (22 + i * 32) + ' 100 L' + (38 + i * 32) + ' 100 Z" fill="#d51f2a"/>').join("") + '<circle cx="70" cy="10" r="6" fill="#3aff8a"/>'), W() / 2, H() * 0.55, { size: 140, h: 110 });
        fx.tone(200, 3, { type: "sine", vol: 0.06, vibrato: [8, 40] });
        fx.caption("(a circus tent lands in the woods — it's a spaceship)", { style: "whisper", ms: 2400 });
        fx.move(tent, [{ filter: "none" }, { filter: "drop-shadow(0 0 20px #3aff8a)" }], { duration: 700, iterations: 4, direction: "alternate" });
        await fx.wait(2400);
        const popcorn = A.S("0 0 20 20", '<circle cx="8" cy="10" r="5" fill="#fff8d0"/><circle cx="13" cy="8" r="5" fill="#fff8d0"/><circle cx="12" cy="13" r="4" fill="#fff8d0"/>');
        const r = fx.rect(fx.slot());
        fx.caption("(the popcorn gun)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 20; i++) fx.later(i * 50, () => { fx.fly(popcorn, [W() * 0.1, H() * 0.8], [r.x + fx.rand(-40, 40), r.y + fx.rand(-40, 40)], { size: 14, dur: 500 }); fx.click({ freq: 900, vol: 0.2 }); });
        await fx.wait(1400);
        const honk = [["C4", 1], ["G3", 1]];
        honk.forEach(([n], i) => fx.tone(n, 0.3, { type: "sawtooth", vol: 0.08, at: i * 0.3, filter: { type: "bandpass", freq: 700, q: 4 } }));
        fx.put(dot("#d51f2a"), r.x, r.y, { size: 30, ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Re-Animator
    {
      id: 1694,
      y: 1985,
      run: async (fx) => {
        fx.filter("saturate(1.2) contrast(1.1)", 6600, { fade: 300 });
        const syringe = fx.put(A.S("0 0 100 30", '<rect x="20" y="8" width="56" height="14" rx="2" fill="#dff8d0" ' + A.ink + ' stroke-width="1.5"/><rect x="24" y="10" width="40" height="10" fill="#6aff3a"/><path d="M76 15 H98" stroke="#9aa2a6" stroke-width="2"/><path d="M4 15 H20 M4 6 V24" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.35, { size: 120, h: 36, style: { filter: "drop-shadow(0 0 8px #6aff3a)" } });
        fx.caption("(a glowing green reagent)", { style: "whisper", ms: 1800 });
        const r = fx.rect(fx.slot());
        await fx.move(syringe, [{ transform: "none" }, { transform: "translate(" + (r.x - W() / 2) + "px," + (r.y - H() * 0.35) + "px)" }], { duration: 1000, fill: "forwards" });
        fx.tone(4000, 0.2, { type: "sine", vol: 0.05 });
        fx.remove(syringe);
        await fx.wait(1000);
        fx.style(fx.slot(), { filter: "hue-rotate(70deg) saturate(2) brightness(1.2)" }, 2600);
        for (let i = 0; i < 6; i++) fx.later(i * 200, () => fx.move(fx.slot(), [{ transform: "none" }, { transform: "rotate(" + (i % 2 ? 6 : -6) + "deg)" }, { transform: "none" }], { duration: 180, fill: "none" }));
        fx.chord(["C3", "F#3", "C4"], 1.2, { type: "sawtooth", vol: 0.06, filter: { freq: 1200 } });
        fx.caption("(too much. It's twitching.)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Time Bandits
    {
      id: 36819,
      y: 1981,
      run: async (fx) => {
        const map = fx.put('<div style="width:100%;height:100%;background:#e8d8b0;border:2px solid #6b4a2a;box-sizing:border-box;background-image:radial-gradient(circle at 20% 30%, #1d1a18 2px, transparent 3px), radial-gradient(circle at 70% 60%, #1d1a18 2px, transparent 3px), radial-gradient(circle at 50% 20%, #b3122a 3px, transparent 4px);font:700 10px Georgia,serif;color:#6b4a2a;text-align:center;padding-top:4px">MAP OF TIME HOLES</div>', W() / 2, H() * 0.3, { size: 190, h: 110 });
        void map;
        fx.caption("(a wardrobe opens and a knight rides out of it)", { style: "whisper", ms: 2200 });
        const wardrobe = fx.put(box("background:#6b4a2a;border:3px solid #3b2a1a"), W() * 0.2, H() * 0.66, { size: 60, h: 110 });
        void wardrobe;
        const horse = A.S("0 0 80 70", '<path d="M10 40 C12 30 40 28 52 32 L58 18 L62 20 L62 32 L68 40 C70 46 66 50 60 48 L42 50 L40 68 M18 48 L16 68" fill="#f4f0e6" stroke="#1d1a18" stroke-width="2"/><rect x="28" y="6" width="14" height="22" fill="#9aa2a6" stroke="#1d1a18" stroke-width="1.5"/>');
        for (let t = 0; t < 1.4; t += 0.18) fx.thud({ freq: 120, vol: 0.2, dur: 0.06, at: 0.2 + t });
        await fx.fly(horse, [W() * 0.2, H() * 0.66], [W() + 80, H() * 0.66], { size: 70, h: 60, dur: 1400 });
        await fx.wait(600);
        const dwarfs = [];
        for (let i = 0; i < 6; i++) dwarfs.push(fx.put(walker("#3b3530"), W() * 0.2, H() * 0.72, { size: 14, h: 28 }));
        dwarfs.forEach((d, i) => fx.move(d, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.1 + i * 30) + "px)" }], { duration: 800, delay: i * 120, fill: "forwards" }));
        fx.caption("(followed by six thieves with a map of the universe)", { style: "whisper", ms: 2200, css: { bottom: "12vh" } });
        await fx.wait(2200);
      }
    },

    // Wet Hot American Summer
    {
      id: 2171,
      y: 2001,
      run: async (fx) => {
        fx.filter("saturate(1.3) sepia(.15)", 7000, { fade: 300 });
        fx.wash("linear-gradient(rgba(255,210,120,.2), transparent)", 7000, { fade: 300 });
        const can = fx.put(A.S("0 0 40 60", '<rect x="6" y="6" width="28" height="48" rx="4" fill="#d9d9d9" ' + A.ink + ' stroke-width="2"/><path d="M6 20 H34" stroke="#1d1a18" stroke-width="1.5"/><rect x="10" y="26" width="20" height="14" fill="#3a6ad8"/>'), W() / 2, H() * 0.38, { size: 36, h: 54 });
        fx.caption("(the talking can of vegetables gives advice)", { style: "whisper", ms: 2000 });
        await fx.wait(1600);
        fx.caption("Hi. I'm a can of vegetables.", { style: "subtitle", ms: 1000 });
        fx.move(can, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 250, iterations: 4 });
        fx.tone(500, 0.4, { type: "sawtooth", vol: 0.06, filter: { type: "bandpass", freq: 900, q: 3 } });
        await fx.wait(1100);
        fx.caption("(and it has feelings)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        fx.caption("(Summer '81. Last day of camp.)", { style: "whisper", ms: 1800 });
        const flag = fx.put(A.S("0 0 40 80", '<path d="M4 78 V4" stroke="#6d7478" stroke-width="3"/><path d="M4 4 H36 L30 14 L36 24 H4 Z" fill="#3aa655"/>'), W() * 0.8, H() * 0.6, { size: 34, h: 70 });
        void flag;
        fx.later(200, () => fx.tone(fx.pick(["G4", "A4"]), 1.2, { type: "sawtooth", vol: 0.04, filter: { freq: 1400 } }));
        await fx.wait(1800);
      }
    },

    // What We Do in the Shadows
    {
      id: 246741,
      y: 2014,
      run: async (fx) => {
        fx.wash("rgba(20,10,30,.5)", 6600, { fade: 300 });
        const chart = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:2px solid #1d1a18;box-sizing:border-box;padding:6px;font:11px/1.5 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18">FLAT CHORE WHEEL<br>Dishes ....... VIAGO<br>Dishes ....... VIAGO<br>Dishes ....... VLADISLAV<br>Dishes ....... DEACON (5 YEARS)</div>', W() / 2, H() * 0.34, { size: 210, h: 110 });
        void chart;
        fx.caption("(a flat meeting is called)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
        fx.caption("(someone has not done the dishes in five years)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 4; i++) fx.later(i * 200, () => fx.fly(A.bat, [W() / 2, H() * 0.5], [fx.rand(0, W()), -30], { size: 40, h: 20, dur: 1400 }));
        fx.tone(900, 0.2, { type: "square", vol: 0.04, at: 0.1 });
        await fx.wait(2000);
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 60 40", '<path d="M4 20 C20 4 40 4 56 20 C40 36 20 36 4 20 Z" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>'), r.x, r.y, { size: 60, h: 40, ms: 1400 });
        fx.caption("We're werewolves, not swearwolves.", { style: "subtitle", ms: 1800, css: { bottom: "10vh" } });
        await fx.wait(1800);
      }
    },

    // Hunt for the Wilderpeople
    {
      id: 371645,
      y: 2016,
      run: async (fx) => {
        fx.filter("saturate(1.3)", 7000, { fade: 300 });
        fx.wash("linear-gradient(rgba(60,120,60,.2), rgba(40,80,40,.3))", 7000, { fade: 300 });
        const sign = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:2px solid #1d1a18;font:700 12px/1.3 Georgia,serif;color:#1d1a18;text-align:center;padding:4px;box-sizing:border-box">WANTED<br><span style="font-size:10px">(a real bad egg)</span></div>', W() / 2, H() * 0.3, { size: 110, h: 50 });
        void sign;
        fx.caption("(a haiku)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        const haiku = ["Trees and birds.", "Rivers and sky.", "Running with my Uncle… living forever."];
        for (const l of haiku) { fx.caption(l, { style: "hand", ms: 1400 }); await fx.wait(1400); }
        fx.caption("(Majestical.)", { style: "whisper", ms: 1400 });
        const pig = A.S("0 0 60 40", '<ellipse cx="28" cy="24" rx="22" ry="12" fill="#3b3530"/><path d="M46 20 L58 16 L56 26 Z" fill="#3b3530"/><path d="M52 22 L60 14" stroke="#f4f0e6" stroke-width="2"/><path d="M14 34 V40 M40 34 V40" stroke="#3b3530" stroke-width="4"/>');
        await fx.fly(pig, [-60, H() * 0.75], [W() + 60, H() * 0.75], { size: 60, h: 40, dur: 1400, easing: "steps(10)" });
      }
    },

    // Swiss Army Man
    {
      id: 347031,
      y: 2016,
      run: async (fx) => {
        fx.filter("saturate(1.2) sepia(.15)", 7000, { fade: 300 });
        const sea = fx.put(box("background:linear-gradient(rgba(60,140,200,.4), rgba(20,80,140,.7))"), W() / 2, H() * 0.85, { size: W(), h: H() * 0.3 });
        void sea;
        const man = A.S("0 0 80 30", '<rect x="10" y="10" width="60" height="12" rx="6" fill="#e8c8a0" ' + A.ink + ' stroke-width="1.5"/><circle cx="70" cy="16" r="8" fill="#e8c8a0" ' + A.ink + ' stroke-width="1.5"/><path d="M10 12 H0 M10 20 H0" stroke="#3b3530" stroke-width="3"/>');
        fx.caption("(riding a very gassy corpse across the waves)", { style: "whisper", ms: 2400 });
        for (let i = 0; i < 10; i++) fx.tone(fx.rand(60, 110), 0.25, { type: "sawtooth", vol: 0.06, at: i * 0.3, filter: { freq: 400 }, vibrato: [30, 10] });
        fx.particles({ kind: "burst", from: pt(0, H() * 0.72), count: 20, spread: 30, glyphs: A.bubble, min: 5, max: 10, dur: 1200 });
        await fx.fly(man, [-80, H() * 0.72], [W() + 80, H() * 0.72], { size: 80, h: 30, dur: 3000, easing: "linear" });
        const hum = [["C5", 1], ["D5", 1], ["E5", 2], ["G5", 2], ["E5", 1], ["D5", 1], ["C5", 4]];
        fx.seq(hum, { type: "sine", vol: 0.07, beat: 0.25, vibrato: [4, 8] });
        fx.caption("(humming the Jurassic Park theme, a cappella)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // The Lobster
    {
      id: 254320,
      y: 2015,
      run: async (fx) => {
        fx.filter("saturate(.6) contrast(.95)", 7000, { fade: 400 });
        const clock = fx.put('<div style="font:700 13px/1.4 Georgia,serif;color:#1d1a18;background:#fbf8ee;padding:6px 10px;border:1px solid #1d1a18;text-align:center">DAYS REMAINING<br><span style="font-size:22px">45</span></div>', W() / 2, H() * 0.3, { size: 150, h: 56 });
        fx.caption("(find a partner in 45 days — or be turned into an animal)", { style: "whisper", ms: 2400 });
        const span = clock.querySelector("span");
        for (let d = 45; d >= 0; d -= 5) {
          if (span) span.textContent = String(d);
          fx.click({ freq: 800, vol: 0.12 });
          await fx.wait(260);
        }
        fx.chord(["D3", "Ab3", "D4"], 1.2, { type: "sawtooth", vol: 0.05, filter: { freq: 900 } });
        await fx.wait(600);
        const lob = fx.put(A.S("0 0 60 40", '<ellipse cx="30" cy="22" rx="16" ry="8" fill="#d51f2a" ' + A.ink + ' stroke-width="1.5"/><path d="M14 18 C6 10 4 4 10 2 M46 18 C54 10 56 4 50 2" stroke="#d51f2a" stroke-width="4" fill="none"/>'), W() / 2, H() * 0.6, { size: 50, h: 34 });
        void lob;
        fx.caption("I would like to be a lobster, because they live for over one hundred years.", { style: "subtitle", ms: 2600, css: { fontSize: "12px" } });
        await fx.wait(2600);
      }
    },

    // Kung Fury
    {
      id: 251516,
      y: 2015,
      run: async (fx) => {
        neon(fx, 6600);
        A.vhs(fx, 6600, "PLAY");
        fx.sfxSeq([["tape-insert", 0, { vol: 0.8 }], ["vhs-hiss", 700, { dur: 5.6, vol: 0.7 }]]);
        const beat = 0.14;
        const synthwave = [["A3", 1], ["A3", 1], ["C4", 1], ["A3", 1], ["E4", 2], ["D4", 1], ["C4", 1], ["A3", 4]];
        synth(fx, synthwave.concat(synthwave), beat, 0.07);
        for (let i = 0; i < 16; i++) fx.thud({ freq: 60, vol: 0.3, dur: 0.1, at: i * beat * 2 });
        fx.caption("(struck by lightning AND bitten by a cobra)", { style: "whisper", ms: 2200 });
        await fx.wait(1600);
        fx.flash("#fff", 150);
        fx.sfx("thunder", { vol: 0.7 });
        const dino = A.S("0 0 100 70", '<path d="M10 60 L20 30 C24 14 50 10 70 16 L94 10 L90 22 L72 28 L60 34 L56 60 M36 36 L34 60 M60 22 L64 12" fill="#3aa655" stroke="#1d1a18" stroke-width="2"/><rect x="62" y="2" width="12" height="8" fill="#1d1a18"/>');
        fx.caption("(and then a laser-raptor with sunglasses)", { style: "whisper", ms: 2000 });
        await fx.fly(dino, [W() + 100, H() * 0.66], [-100, H() * 0.66], { size: 100, h: 70, dur: 2000, flip: true });
        for (let i = 0; i < 4; i++) fx.sfx("blip", { hz: 1600 - i * 200, at: i * 200, vol: 0.7 });
        await fx.wait(1200);
      }
    },

    // Primer
    {
      id: 14337,
      y: 2004,
      run: async (fx) => {
        fx.filter("saturate(.7) sepia(.2)", 7400, { fade: 300 });
        const clock = fx.put('<div style="font:700 18px/1 \'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:6px 10px;border:2px solid #1d1a18">09:00</div>', W() / 2, H() * 0.25, { size: 100, h: 34 });
        const times = ["09:00", "09:30", "10:00", "09:00", "09:30", "10:00", "09:00", "09:15", "09:00"];
        const r = fx.rect(fx.slot());
        const ghost = fx.slot() && fx.slot().querySelector("img");
        fx.caption("(the box)", { style: "whisper", ms: 1400 });
        fx.put(box("border:2px solid #6d7478;background:rgba(200,200,200,.2)"), r.x, r.y, { size: r.width + 20, h: r.height + 20, ms: 6000 });
        for (let i = 0; i < times.length; i++) {
          clock.firstChild.textContent = times[i];
          if (times[i] === "09:00" && i) { fx.flash("rgba(255,255,255,.35)", 150); fx.tone(80, 0.5, { type: "sine", vol: 0.08, slide: 40 }); if (ghost) fx.put('<img src="' + ghost.src + '" style="width:100%;height:100%;object-fit:cover;opacity:.3">', r.x + 12 * i, r.y + 6 * i, { size: r.width, h: r.height, ms: 2400 }); }
          else fx.click({ freq: 1200, vol: 0.12 });
          await fx.wait(520);
        }
        fx.caption("(are you hungry? I haven't eaten since later this afternoon.)", { style: "whisper", ms: 2200 });
        await fx.wait(2200);
      }
    },

    // Flight of the Navigator
    {
      id: 10122,
      y: 1986,
      run: async (fx) => {
        const ship = fx.put(A.S("0 0 120 50", '<path d="M6 30 C20 6 100 6 114 30 C100 44 20 44 6 30 Z" fill="#e8eef2" stroke="#9aa2a6" stroke-width="2"/><path d="M20 26 C40 12 80 12 100 26" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>'), W() / 2, H() * 0.36, { size: 150, h: 62, style: { filter: "drop-shadow(0 0 10px #bfe8ff)" } });
        fx.caption("(the chrome ship changes shape)", { style: "whisper", ms: 1800 });
        fx.tone(600, 1, { type: "sine", vol: 0.06, slide: 1200, vibrato: [8, 20] });
        await fx.move(ship, [{ transform: "scaleX(1)" }, { transform: "scaleX(.5) scaleY(1.6)" }, { transform: "scaleX(1)" }], { duration: 1400 });
        await fx.wait(600);
        fx.caption("Compliance!", { style: "hand", ms: 1400 });
        fx.tone(900, 0.3, { type: "square", vol: 0.05, slide: 1600 });
        await fx.wait(1400);
        fx.caption("(and it's been eight years — though he hasn't aged a day)", { style: "whisper", ms: 2200 });
        const sweep = fx.put(A.S("0 0 40 40", '<circle cx="20" cy="20" r="18" fill="none" stroke="#3aff8a" stroke-width="2"/><path d="M20 20 L20 2" stroke="#3aff8a" stroke-width="3"/>'), W() * 0.8, H() * 0.7, { size: 40 });
        fx.move(sweep, [{ transform: "rotate(0)" }, { transform: "rotate(720deg)" }], { duration: 2000, easing: "linear" });
        await fx.wait(2200);
      }
    },

    // Life Is Beautiful
    {
      id: 637,
      y: 1997,
      run: async (fx) => {
        warm(fx, 7000);
        const r = fx.rect(fx.slot());
        const score = fx.put('<div style="font:700 14px/1 Georgia,serif;color:#1d1a18;background:#fbf8ee;padding:6px 10px;border:2px solid #1d1a18;text-align:center">POINTS: 0</div>', W() / 2, H() * 0.28, { size: 130, h: 30 });
        fx.caption("(it's all a game — first to a thousand points wins a real tank)", { style: "whisper", ms: 2400 });
        for (let p = 0; p <= 1000; p += 120) {
          score.firstChild.textContent = "POINTS: " + Math.min(1000, p);
          fx.tone(800 + p / 2, 0.1, { type: "triangle", vol: 0.06 });
          await fx.wait(220);
        }
        score.firstChild.textContent = "POINTS: 1000";
        const tank = A.S("0 0 100 50", '<rect x="10" y="20" width="80" height="20" rx="4" fill="#5a6a3a" ' + A.ink + ' stroke-width="2"/><rect x="30" y="8" width="36" height="14" fill="#5a6a3a" ' + A.ink + ' stroke-width="2"/><path d="M66 14 H96" stroke="#5a6a3a" stroke-width="4"/><path d="M12 42 H88" stroke="#1d1a18" stroke-width="6" stroke-dasharray="4 3"/>');
        await fx.fly(tank, [-100, H() * 0.7], [r.x, H() * 0.7], { size: 100, h: 50, dur: 1600, keep: false });
        fx.caption("Buongiorno, principessa!", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // The Intouchables
    {
      id: 77338,
      y: 2011,
      run: async (fx) => {
        warm(fx, 6600);
        const beat = 0.2;
        const boogie = [["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 1], ["A4", 2]];
        fx.seq(boogie.concat(boogie), { type: "square", vol: 0.05, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 14; i++) fx.thud({ freq: 70, vol: 0.3, dur: 0.1, at: i * beat * 2 });
        fx.caption("(Boogie Wonderland at a posh birthday concert)", { style: "whisper", ms: 2200 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        for (let k = 0; k < 8; k++) {
          all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateX(" + ((i + k) % 2 ? 4 : -4) + "px) rotate(" + ((i + k) % 2 ? 3 : -3) + "deg)" }, { transform: "none" }], { duration: 380, fill: "none" }));
          await fx.wait(400);
        }
        const chair = A.S("0 0 70 60", '<circle cx="20" cy="46" r="12" fill="none" stroke="#1d1a18" stroke-width="3"/><circle cx="56" cy="50" r="7" fill="none" stroke="#1d1a18" stroke-width="3"/><path d="M20 46 V14 M20 30 H50 V46" stroke="#1d1a18" stroke-width="3" fill="none"/>');
        fx.caption("(and a wheelchair at top speed)", { style: "whisper", ms: 1800 });
        fx.tone(200, 1.6, { type: "sawtooth", vol: 0.04, slide: 500, filter: { freq: 900 } });
        await fx.fly(chair, [-70, H() * 0.75], [W() + 70, H() * 0.75], { size: 60, h: 50, dur: 1400, easing: "ease-in" });
      }
    },

    // Y Tu Mamá También
    {
      id: 1391,
      y: 2001,
      run: async (fx) => {
        warm(fx, 7000);
        fx.wash("linear-gradient(#ffd89a, #e89a5a)", 7000, { blend: "multiply", opacity: 0.3, fade: 400 });
        const car = A.S("0 0 110 50", '<path d="M6 34 C6 24 16 22 26 20 L40 8 H74 L88 20 C100 22 106 26 106 34 V38 H6 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="28" cy="40" r="8" fill="#1d1a18"/><circle cx="84" cy="40" r="8" fill="#1d1a18"/>');
        fx.caption("(a road trip to a beach called Heaven's Mouth)", { style: "whisper", ms: 2200 });
        const fly = fx.fly(car, [-110, H() * 0.7], [W() + 110, H() * 0.7], { size: 110, h: 50, dur: 5200, easing: "linear" });
        await fx.wait(2400);
        fx.caption("(the sound cuts out — a narrator tells you what they'll never know)", { style: "whisper", ms: 2600, css: { fontSize: "11px" } });
        fx.wash("rgba(0,0,0,.15)", 2400, { fade: 200 });
        await fly;
        const sea = fx.put(box("background:linear-gradient(rgba(80,190,220,.5), rgba(20,120,170,.7))"), W() / 2, H() * 0.9, { size: W(), h: H() * 0.2, ms: 1600 });
        void sea;
        fx.noise(1.6, { type: "lowpass", freq: 700, sweep: 400, vol: 0.3 });
        await fx.wait(1600);
      }
    },

    // Good Bye Lenin!
    {
      id: 338,
      y: 2003,
      run: async (fx) => {
        fx.filter("saturate(.7) sepia(.2)", 7000, { fade: 400 });
        const tv = fx.put('<div style="width:100%;height:100%;background:#1d1a18;border:6px solid #6b4a2a;border-radius:8px;box-sizing:border-box;font:700 11px/1.3 Georgia,serif;color:#e8e0d0;padding:8px;text-align:center">AKTUELLE KAMERA<br><span style="font-size:10px;font-weight:400">All is well in the GDR.</span></div>', W() / 2, H() * 0.32, { size: 190, h: 90 });
        void tv;
        fx.caption("(the Wall fell — but nobody tells Mother)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        const jar = A.S("0 0 40 50", '<rect x="6" y="10" width="28" height="36" rx="3" fill="#7a9a3a" ' + A.ink + ' stroke-width="1.5"/><rect x="4" y="4" width="32" height="8" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><text x="20" y="32" font-size="7" text-anchor="middle" font-family="Georgia" fill="#fff">GURKEN</text>');
        fx.caption("(relabel the pickle jars)", { style: "whisper", ms: 1600 });
        await fx.fly(jar, [-40, H() * 0.7], [W() / 2, H() * 0.6], { size: 36, h: 46, dur: 900 });
        const statue = A.S("0 0 60 100", '<circle cx="30" cy="12" r="10" fill="#9aa2a6"/><path d="M14 24 H46 L42 90 H18 Z M46 30 L60 10" fill="#9aa2a6" stroke="#9aa2a6" stroke-width="5"/>');
        fx.caption("(a statue flies by, outstretched hand first)", { style: "whisper", ms: 2000, css: { bottom: "12vh" } });
        fx.tone(90, 2, { type: "sawtooth", vol: 0.05, filter: { freq: 400 }, vibrato: [18, 6] });
        await fx.fly(statue, [-60, H() * 0.2], [W() + 60, H() * 0.15], { size: 60, h: 100, dur: 2400, r0: -20, r1: -10 });
      }
    },

    // Lagaan
    {
      id: 19666,
      y: 2001,
      run: async (fx) => {
        fx.filter("saturate(1.3) sepia(.2)", 7000, { fade: 300 });
        fx.wash("linear-gradient(#ffd89a, #e8b05a)", 7000, { blend: "multiply", opacity: 0.25, fade: 300 });
        fx.caption("(the drought-struck village bets its taxes on a cricket match)", { style: "whisper", ms: 2400 });
        const clouds = [];
        for (let i = 0; i < 4; i++) clouds.push(fx.put(A.S("0 0 80 40", '<path d="M10 30 C4 30 4 18 14 18 C14 8 30 6 36 14 C42 4 62 6 62 18 C74 18 76 30 66 30 Z" fill="#6d7478"/>'), W() * (0.15 + i * 0.23), H() * 0.12, { size: 80, h: 40, style: { opacity: 0 } }));
        clouds.forEach((c, i) => fx.anim(c, [{ opacity: 0 }, { opacity: 0.9 }], { duration: 600, delay: i * 200, fill: "forwards" }));
        fx.thud({ vol: 0.4, freq: 60, dur: 1.2, at: 0.8 });
        await fx.wait(2400);
        const ball = A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#b3122a" stroke="#1d1a18" stroke-width="1"/><path d="M4 8 C8 10 12 10 16 8" stroke="#fff" stroke-width="1"/>');
        fx.click({ freq: 1500, vol: 0.5 });
        fx.thud({ vol: 0.3, freq: 300 });
        await fx.fly(ball, [W() / 2, H() * 0.8], [W() + 20, -20], { size: 16, dur: 1000, via: [W() * 0.8, H() * 0.1], r1: 720 });
        fx.caption("(six!)", { style: "hand", ms: 1400 });
        const chorus = [["D5", 1], ["E5", 1], ["F#5", 2], ["E5", 1], ["D5", 1], ["A4", 2], ["D5", 4]];
        fx.seq(chorus, { type: "sawtooth", vol: 0.05, beat: 0.2, filter: { freq: 1600 }, vibrato: [5, 8] });
        await fx.wait(1600);
      }
    },

    // 3 Idiots
    {
      id: 20453,
      y: 2009,
      run: async (fx) => {
        fx.filter("saturate(1.3)", 6600, { fade: 300 });
        fx.caption("All izz well.", { style: "hand", ms: 2000 });
        const r = fx.rect(fx.slot());
        const heart = fx.put(A.heart("#d51f2a"), r.x, r.y, { size: 40 });
        fx.move(heart, [{ transform: "scale(1.3)" }, { transform: "scale(.9)" }], { duration: 400, iterations: 5, direction: "alternate" });
        for (let i = 0; i < 5; i++) fx.thud({ freq: 70, vol: 0.4, dur: 0.15, at: i * 0.4 });
        fx.buzz([80, 320, 80, 320, 80]);
        await fx.wait(2000);
        fx.caption("(the machine definition, as fast as possible)", { style: "whisper", ms: 1800 });
        const def = "Machines are any combination of bodies so connected that their relative motions are constrained…";
        const box1 = fx.put('<div style="font:11px/1.3 Georgia,serif;color:#1d1a18;background:#fbf8ee;padding:6px;border:1px solid #1d1a18"></div>', W() / 2, H() * 0.36, { size: 240, h: 60 });
        for (let i = 0; i <= def.length; i += 4) { box1.firstChild.textContent = def.slice(0, i); fx.click({ freq: 2500, vol: 0.06 }); await fx.wait(20); }
        fx.caption("(…or: things that save human effort.)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Children of Heaven
    {
      id: 21334,
      y: 1997,
      run: async (fx) => {
        warm(fx, 7000);
        const shoes = fx.put(A.S("0 0 60 30", '<path d="M4 22 C4 12 24 10 30 16 L34 22 V26 H4 Z" fill="#ff8ac8" ' + A.ink + ' stroke-width="1.5"/><path d="M30 22 C30 12 50 10 56 16 L58 22 V26 H30 Z" fill="#ff8ac8" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.4, { size: 60, h: 30 });
        fx.caption("(one pair of shoes, shared between a brother and sister)", { style: "whisper", ms: 2400 });
        for (let i = 0; i < 4; i++) {
          await fx.move(shoes, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? -W() * 0.3 : W() * 0.3) + "px)" }], { duration: 400, fill: "forwards" });
          for (let k = 0; k < 4; k++) fx.thud({ freq: 200, vol: 0.12, dur: 0.05, at: k * 0.08 });
          await fx.wait(300);
        }
        fx.caption("(third place wins a new pair — he comes first)", { style: "whisper", ms: 2200 });
        for (let t = 0; t < 1.8; t += 0.15) fx.thud({ freq: 180, vol: 0.12, dur: 0.05, at: t });
        await fx.wait(2200);
      }
    },

    // A Separation
    {
      id: 60243,
      y: 2011,
      run: async (fx) => {
        fx.filter("saturate(.6) contrast(1.05)", 7000, { fade: 300 });
        const glass = fx.put(box("background:rgba(220,230,240,.35);border:2px solid rgba(255,255,255,.7);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)"), W() / 2, H() * 0.5, { size: 16, h: H() * 0.7 });
        void glass;
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => { const rr = fx.rect(s); fx.move(s, [{ transform: "none" }, { transform: "translateX(" + (rr.x < W() / 2 ? -8 : 8) + "px)" }], { duration: 1200, fill: "forwards" }); });
        fx.caption("(two sides, a pane of glass between them)", { style: "whisper", ms: 2400 });
        fx.noise(5, { freq: 1000, vol: 0.03 });
        await fx.wait(2600);
        fx.caption("(the judge asks the daughter to choose)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        fx.caption("(we never hear her answer)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Wild Tales
    {
      id: 265195,
      y: 2014,
      run: async (fx) => {
        fx.filter("saturate(1.3) contrast(1.1)", 6600, { fade: 300 });
        const titles = ["PASTERNAK", "LAS RATAS", "EL MÁS FUERTE", "BOMBITA", "LA PROPUESTA", "HASTA QUE LA MUERTE NOS SEPARE"];
        fx.caption("(six stories of people pushed one step too far)", { style: "whisper", ms: 2400 });
        for (const t of titles) {
          const el = fx.put('<div style="font:900 14px/1 Georgia,serif;color:#fff;background:#b3122a;padding:6px 10px;text-align:center">' + t + "</div>", W() / 2, H() * 0.3, { size: 200, h: 28 });
          fx.later(380, () => fx.remove(el));
          fx.thud({ freq: 90, vol: 0.2, dur: 0.1 });
          await fx.wait(420);
        }
        fx.caption("(Bombita: a parking ticket too many)", { style: "whisper", ms: 1800 });
        const car = fx.put(A.car("#6d7478"), W() / 2, H() * 0.66, { size: 100, h: 45 });
        await fx.wait(1400);
        fx.thud({ vol: 0.9, freq: 40, dur: 0.8 });
        fx.flash("#ffcf5a", 250);
        fx.shake("lg", 600);
        fx.particles({ kind: "burst", from: car, count: 20, spread: 80, gravity: 60, glyphs: dot("#ff7a1a"), min: 4, max: 10, dur: 1000 });
        fx.remove(car);
        await fx.wait(1400);
      }
    },

    // Memories of Murder
    {
      id: 11423,
      y: 2003,
      run: async (fx) => {
        fx.filter("saturate(.7) sepia(.25) brightness(.9)", 7400, { fade: 400 });
        fx.wash("linear-gradient(transparent 50%, rgba(160,140,60,.4))", 7400, { fade: 400 });
        const drain = fx.put(A.S("0 0 80 60", '<path d="M4 56 C4 10 76 10 76 56 Z" fill="#1d1a18" stroke="#6d7478" stroke-width="4"/>'), W() / 2, H() * 0.66, { size: 90, h: 68 });
        void drain;
        fx.caption("(a drainage ditch in a field of rice)", { style: "whisper", ms: 2200 });
        fx.noise(4, { type: "bandpass", freq: 3000, q: 1, vol: 0.04 });
        await fx.wait(2400);
        fx.caption("(the radio plays a request whenever it rains)", { style: "whisper", ms: 2000 });
        fx.particles({ kind: "fall", count: 60, glyphs: A.drop("#bfe4ff"), min: 3, max: 6, dur: 800, stagger: 2400 });
        fx.noise(2.4, { freq: 2000, vol: 0.15 });
        fx.tone(440, 2, { type: "sine", vol: 0.04, filter: { type: "bandpass", freq: 900, q: 3 }, vibrato: [4, 6] });
        await fx.wait(2400);
        fx.caption("(he just had an ordinary face)", { style: "whisper", ms: 1800 });
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "scale(1.04)" }], { duration: 1600, fill: "forwards" });
        await fx.wait(1600);
      }
    },

    // The Handmaiden
    {
      id: 290098,
      y: 2016,
      run: async (fx) => {
        fx.filter("saturate(1.2) contrast(1.05)", 7000, { fade: 300 });
        const parts = ["PART ONE", "PART TWO", "PART THREE"];
        for (let i = 0; i < parts.length; i++) {
          const el = fx.put('<div style="font:700 14px/1 Georgia,serif;letter-spacing:.3em;color:#e8d8b0;background:#1d1a18;padding:8px 14px;text-align:center">' + parts[i] + "</div>", W() / 2, H() * 0.36, { size: 180, h: 32 });
          fx.later(1600, () => fx.remove(el));
          fx.tone(["E4", "G4", "B4"][i], 1.4, { type: "sine", vol: 0.05 });
          const all = [fx.slot()].concat(fx.otherSlots(true));
          if (i) all.forEach((s) => fx.move(s, [{ transform: "none" }, { transform: "rotateY(180deg)" }, { transform: "none" }], { duration: 800, fill: "none" }));
          fx.caption(["(a maid, hired to deceive a lady)", "(the same story — from the other side)", "(nobody was who you thought)"][i], { style: "whisper", ms: 1600 });
          await fx.wait(1800);
        }
        const bell = fx.put(A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#c9a24a" stroke="#1d1a18" stroke-width="1.5"/>'), W() / 2, H() * 0.6, { size: 20, ms: 1200 });
        void bell;
        fx.tone(3200, 0.8, { type: "sine", vol: 0.06 });
        await fx.wait(1200);
      }
    },

    // Hard Boiled
    {
      id: 11782,
      y: 1992,
      run: async (fx) => {
        fx.filter("saturate(1.2) contrast(1.15)", 6600, { fade: 300 });
        const beat = 0.18;
        fx.seq([["A2", 2], ["A2", 1], ["C3", 1], ["A2", 2], ["E3", 2]], { type: "sawtooth", vol: 0.06, beat, filter: { freq: 900 } });
        fx.caption("(one take, through a hospital, with a baby on his arm)", { style: "whisper", ms: 2400 });
        fx.particles({ kind: "fall", count: 10, glyphs: A.feather, min: 10, max: 18, dur: 2400, spin: 60 });
        for (let i = 0; i < 20; i++) shot(fx, i * 0.12);
        fx.later(200, () => fx.shake("sm", 2000));
        const doves = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#fbfbf4"/>');
        await fx.wait(2400);
        fx.tempo(0.4, 2000);
        for (let i = 0; i < 6; i++) fx.later(i * 140, () => fx.fly(doves, [W() / 2, H() * 0.6], [fx.rand(0, W()), -30], { size: 40, h: 24, dur: 2000 }));
        fx.caption("(and yes — doves)", { style: "whisper", ms: 1800 });
        fx.noise(1.4, { type: "bandpass", freq: 1500, q: 1, vol: 0.2 });
        await fx.wait(2200);
      }
    },

    // Shaolin Soccer
    {
      id: 11770,
      y: 2001,
      run: async (fx) => {
        fx.filter("saturate(1.4)", 6600, { fade: 300 });
        const r = fx.rect(fx.slot());
        const ball = A.S("0 0 40 40", '<circle cx="20" cy="20" r="18" fill="#fbfbf4" ' + A.ink + ' stroke-width="2"/><path d="M20 10 L28 16 L25 26 H15 L12 16 Z" fill="#1d1a18"/>');
        fx.caption("(a kung-fu kick)", { style: "whisper", ms: 1600 });
        hit(fx);
        fx.sfx("hit", { vol: 0.7 });
        fx.sfx("whoosh", { dur: 0.8, vol: 0.6 });
        const shotBall = fx.fly(ball, [-40, H() * 0.8], [r.x, r.y], { size: 36, dur: 800, r1: 1440 });
        fx.later(100, () => fx.particles({ kind: "sweep", count: 20, glyphs: dot("#ff9a3a"), min: 4, max: 10, dur: 700 }));
        fx.noise(0.8, { freq: 800, sweep: 2400, vol: 0.4 });
        await shotBall;
        fx.flash("#ffcf5a", 200);
        fx.sfx("boom", { vol: 0.8 });
        fx.shake("lg", 600);
        fx.later(100, () => fx.move(fx.slot(), [{ transform: "none" }, { transform: "translate(8px,-6px) rotate(6deg)" }, { transform: "none" }], { duration: 600, fill: "none" }));
        fx.caption("(GOAL — and the net is on fire)", { style: "whisper", ms: 1800 });
        const flames = fx.put(A.S("0 0 60 40", '<path d="M6 40 C0 20 16 20 14 4 C24 16 30 10 30 0 C40 14 46 16 46 4 C58 16 60 28 54 40 Z" fill="#ff7a1a"/>'), r.x, r.top + r.height, { size: 60, h: 40, ms: 2000 });
        void flames;
        fx.noise(1.8, { type: "bandpass", freq: 800, q: 0.5, vol: 0.2 });
        await fx.wait(2400);
      }
    },

    // Ong-Bak: The Thai Warrior
    {
      id: 9316,
      y: 2003,
      run: async (fx) => {
        fx.filter("saturate(1.2) contrast(1.1)", 6600, { fade: 300 });
        const reely = fx.$(".reely");
        fx.caption("(no wires, no stunt doubles)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 3; i++) {
          fx.tempo(i === 2 ? 0.3 : 1, 900);
          await fx.move(reely, [{ transform: "none" }, { transform: "translateY(-" + (30 + i * 10) + "px) rotate(" + (i % 2 ? 360 : -360) + "deg)" }, { transform: "none" }], { duration: 900 });
          hit(fx);
        }
        fx.caption("(and the same knee strike — from three different angles)", { style: "whisper", ms: 2200 });
        for (let k = 0; k < 3; k++) {
          fx.later(k * 600, () => { fx.flash("rgba(255,255,255,.4)", 100); hit(fx); fx.filter(["none", "hue-rotate(20deg)", "invert(.1)"][k], 500); });
        }
        await fx.wait(2400);
      }
    },

    // La Haine
    {
      id: 406,
      y: 1995,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 7400, { fade: 300 });
        const clock = fx.put('<div style="font:700 16px/1 \'Courier New\',monospace;color:#fff;background:#1d1a18;padding:6px 10px">10:38</div>', W() / 2, H() * 0.22, { size: 90, h: 30 });
        const times = ["10:38", "12:43", "14:36", "17:30", "20:32", "00:57", "04:25", "06:00"];
        fx.caption("It's about a guy who falls from a fifty-storey building.", { style: "subtitle", ms: 2400, css: { fontSize: "13px" } });
        for (const t of times.slice(0, 5)) {
          clock.firstChild.textContent = t;
          fx.tone(60, 0.3, { type: "sine", vol: 0.1 });
          fx.click({ freq: 1800, vol: 0.2, at: 0.05 });
          await fx.wait(520);
        }
        fx.caption("So far so good… so far so good…", { style: "subtitle", ms: 2400 });
        for (const t of times.slice(5)) {
          clock.firstChild.textContent = t;
          fx.tone(60, 0.3, { type: "sine", vol: 0.1 });
          await fx.wait(700);
        }
        fx.caption("(the important thing isn't the fall. It's the landing.)", { style: "whisper", ms: 1800 });
        fx.thud({ vol: 0.6, freq: 50 });
        await fx.wait(1800);
      }
    },

    // Millennium Actress
    {
      id: 33320,
      y: 2001,
      run: async (fx) => {
        const eras = [["sepia(.8)", "(feudal Japan)"], ["saturate(1.4) hue-rotate(-10deg)", "(a Meiji-era romance)"], ["grayscale(1)", "(post-war melodrama)"], ["saturate(1.8) hue-rotate(160deg)", "(a rocket to the moon)"]];
        fx.caption("(she keeps running after him — through every film she ever made)", { style: "whisper", ms: 2600 });
        const key = fx.put(A.S("0 0 50 20", '<circle cx="10" cy="10" r="8" fill="none" stroke="#c9a24a" stroke-width="3"/><path d="M18 10 H48 M40 10 V18 M46 10 V16" stroke="#c9a24a" stroke-width="3"/>'), W() / 2, H() * 0.3, { size: 50, h: 20, style: { filter: "drop-shadow(0 0 6px #ffd23b)" } });
        void key;
        const reely = fx.$(".reely");
        for (let i = 0; i < eras.length; i++) {
          fx.filter(eras[i][0], 1000, { fade: 150 });
          fx.caption(eras[i][1], { style: "whisper", ms: 900, css: { bottom: "12vh" } });
          fx.move(reely, [{ transform: "translateX(-20px)" }, { transform: "translateX(20px)" }], { duration: 900, easing: "linear" });
          for (let t = 0; t < 0.9; t += 0.15) fx.thud({ freq: 200, vol: 0.1, dur: 0.05, at: t });
          await fx.wait(1100);
        }
        fx.caption("(because what I really love is chasing him)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Tokyo Godfathers
    {
      id: 13398,
      y: 2003,
      run: async (fx) => {
        fx.wash("rgba(20,30,60,.4)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 5, max: 9, dur: 4000, stagger: 5000 });
        const bundle = fx.put(A.S("0 0 50 40", '<ellipse cx="25" cy="24" rx="20" ry="14" fill="#fbf8ee" ' + A.ink + ' stroke-width="1.5"/><circle cx="25" cy="18" r="8" fill="#f2d6b3"/>'), W() / 2, H() * 0.66, { size: 50, h: 40 });
        fx.caption("(Christmas Eve: three homeless friends find a baby in the rubbish)", { style: "whisper", ms: 2600 });
        const cry = (at) => fx.tone(700, 0.4, { type: "sawtooth", vol: 0.04, slide: 500, at, filter: { type: "bandpass", freq: 1200, q: 3 } });
        cry(0.3); cry(0.9);
        fx.move(bundle, [{ transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }], { duration: 400, iterations: 6, direction: "alternate" });
        await fx.wait(2800);
        const ode = [["E5", 1], ["E5", 1], ["F5", 1], ["G5", 1], ["G5", 1], ["F5", 1], ["E5", 1], ["D5", 1], ["C5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["E5", 1.5], ["D5", 0.5], ["D5", 2]];
        fx.seq(ode, { type: "triangle", vol: 0.07, beat: 0.2 });
        fx.caption("(a string of coincidences — each one a small miracle)", { style: "whisper", ms: 2400 });
        await fx.wait(3200);
      }
    },

    // Song of the Sea
    {
      id: 110416,
      y: 2014,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(40,120,150,.3), rgba(20,60,100,.5))", 7000, { fade: 400 });
        const shell = fx.put(A.S("0 0 50 50", '<path d="M6 44 C6 20 20 6 44 6 C30 14 24 28 26 44 Z" fill="#f2e0d0" ' + A.ink + ' stroke-width="1.5"/><path d="M12 40 C14 26 22 16 36 10 M18 42 C20 30 26 22 38 16" stroke="#c8a890" stroke-width="1.5" fill="none"/>'), W() / 2, H() * 0.4, { size: 50 });
        fx.caption("(blow the shell)", { style: "whisper", ms: 1600 });
        fx.move(shell, [{ filter: "none" }, { filter: "drop-shadow(0 0 12px #bfe8ff)" }], { duration: 800, iterations: 3, direction: "alternate" });
        const song = [["D5", 2], ["E5", 1], ["F#5", 1], ["A5", 3], ["F#5", 1], ["E5", 2], ["D5", 4]];
        fx.seq(song, { type: "sine", vol: 0.08, beat: 0.35, vibrato: [4, 6] });
        await fx.wait(2600);
        const lights = [];
        for (let i = 0; i < 16; i++) lights.push(fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff, #7ae8ff 50%, transparent 70%)"></div>', fx.rand(20, W() - 20), H() * 0.9, { size: fx.rand(8, 16) }));
        lights.forEach((l, i) => fx.move(l, [{ transform: "none", opacity: 1 }, { transform: "translateY(-" + H() * fx.rand(0.5, 0.8) + "px)", opacity: 0 }], { duration: 2400, delay: i * 80 }));
        fx.caption("(the spirits rise and go home)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
      }
    },

    // Baraka
    {
      id: 14002,
      y: 1992,
      run: async (fx) => {
        fx.filter("saturate(1.2) contrast(1.05)", 7400, { fade: 500 });
        fx.chord(["D3", "A3", "D4", "F#4"], 7, { type: "sine", vol: 0.04, attack: 2 });
        fx.tone(146.8, 7, { type: "sawtooth", vol: 0.02, filter: { freq: 300 }, attack: 2 });
        const scenes = ["linear-gradient(#ffd89a, #a86a3a)", "linear-gradient(#1d2a3a, #0a0a14)", "linear-gradient(#bfe8ff, #e8f4ff)", "linear-gradient(#3a3a3a, #8a8a8a)"];
        const w = fx.wash(scenes[0], 7000, { blend: "multiply", opacity: 0.35, fade: 1000 });
        fx.later(200, () => fx.caption("(no words)", { style: "whisper", ms: 1600 }));
        const all = [fx.slot()].concat(fx.otherSlots(true));
        for (let i = 1; i < 4; i++) {
          await fx.wait(1500);
          w.style.transition = "background 1s";
          w.style.background = scenes[i];
          if (i === 3) {
            all.forEach((s, k) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-4px)" }, { transform: "none" }], { duration: 200, delay: k * 20, iterations: 6, fill: "none" }));
            fx.tempo(3, 1500);
          }
        }
        await fx.wait(2000);
      }
    },

    // Begotten
    {
      id: 1483,
      y: 1990,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(2.2) brightness(.8)", 7000, { fade: 300 });
        A.oldFilm(fx, 7000);
        fx.node("", { cls: "fx-filter", ms: 7000, style: { background: "repeating-radial-gradient(circle at 30% 40%, rgba(0,0,0,.2) 0 2px, transparent 2px 7px)", mixBlendMode: "multiply" } });
        fx.sfx("drone", { dur: 6.4, fadeIn: 1500, vol: 0.55 });
        fx.sfx("crackle", { dur: 6.4, vol: 0.5 });
        fx.tone(50, 7, { type: "sine", vol: 0.08, attack: 2 });
        for (let i = 0; i < 12; i++) fx.later(i * 500 + fx.rand(0, 200), () => { fx.flash(i % 2 ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.6)", 60); if (i % 3 === 0) fx.click({ freq: 300, vol: 0.2 }); });
        fx.later(600, () => fx.caption("(untitled)", { style: "whisper", ms: 1400, css: { color: "#fff" } }));
        await fx.wait(6400);
      }
    },

    // Waking Life
    {
      id: 9081,
      y: 2001,
      run: async (fx) => {
        const all = [fx.slot()].concat(fx.otherSlots(true));
        fx.filter("saturate(1.6) contrast(1.1)", 7000, { fade: 400 });
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "skew(" + (i % 2 ? 2 : -2) + "deg, 1deg) translate(2px,-2px)" }, { transform: "skew(" + (i % 2 ? -1 : 1) + "deg, -1deg)" }, { transform: "none" }], { duration: 1600, iterations: 3, easing: "ease-in-out", fill: "none" }));
        fx.caption("(the edges won't stay still — as if painted over, frame by frame)", { style: "whisper", ms: 2600 });
        fx.tone(220, 5, { type: "sine", vol: 0.04, vibrato: [0.8, 10] });
        await fx.wait(2600);
        const sw = fx.put('<div style="font:700 16px/1 \'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:6px 10px;border:2px solid #1d1a18">LIGHTS: ON</div>', W() / 2, H() * 0.3, { size: 120, h: 30 });
        fx.caption("(flip the light switch to see if you're dreaming)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 4; i++) {
          sw.firstChild.textContent = i % 2 ? "LIGHTS: ON" : "LIGHTS: OFF";
          fx.click({ freq: 1600, vol: 0.3 });
          await fx.wait(450);
        }
        sw.firstChild.textContent = "LIGHTS: ON";
        fx.caption("(it didn't work. Still dreaming.)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    }
  ]);
})();
