/* Machine FX cues - the sixties: new waves, spaghetti westerns, art-house and kaiju-era oddities.
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
  const bw = (fx, ms, extra) => fx.filter("grayscale(1) contrast(1.15)" + (extra || ""), ms, { fade: 300 });
  const fullSvg = (fx, svg, style) => {
    const el = fx.node(svg, { cls: "fx-filter", style });
    const s = el.firstChild;
    if (s && s.setAttribute) { s.setAttribute("preserveAspectRatio", "none"); s.style.width = s.style.height = "100%"; }
    return el;
  };
  // Jump cut: the page skips a few frames forward.
  const jump = (fx, dx, dy) => {
    if (fx.reduced) return;
    fx.page([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "translate(" + dx + "px," + dy + "px)" }], { duration: 120, fill: "none" });
    fx.click({ freq: 2000, vol: 0.25 });
  };

  M.register([
    // L'Avventura
    {
      id: 5165,
      y: 1960,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.1)");
        fx.noise(6, { freq: 500, sweep: 900, vol: 0.14, attack: 1.2 });
        const rocks = fullSvg(fx, A.S("0 0 400 300", '<path d="M0 300 V200 C40 190 60 150 90 160 C120 170 130 130 170 140 C200 150 210 190 240 200 L260 300 Z" fill="#3b3530"/><path d="M280 300 C300 240 340 220 400 230 V300 Z" fill="#4a443c"/>'), { opacity: 0.8 });
        void rocks;
        const figs = fx.otherSlots(true);
        fx.caption("Anna?", { style: "subtitle", ms: 1200 });
        await fx.wait(1500);
        fx.caption("Anna!", { style: "subtitle", ms: 1200, css: { opacity: 0.6 } });
        const gone = fx.pick(figs);
        if (gone) fx.style(gone, { opacity: "0", transition: "opacity 2s" }, 6000);
        await fx.wait(1700);
        fx.caption("…Anna?", { style: "whisper", ms: 1500 });
        await fx.wait(1600);
      }
    },

    // Eyes Without a Face
    {
      id: 31417,
      y: 1960,
      run: async (fx) => {
        bw(fx, 6000, " brightness(1.05)");
        const r = fx.rect(fx.slot());
        const mask = fx.put(A.S("0 0 80 100", '<path d="M10 40 C8 12 72 12 70 40 C72 70 58 94 40 94 C22 94 8 70 10 40 Z" fill="#f4f2ee" stroke="#cfc8b8" stroke-width="2"/><ellipse cx="28" cy="44" rx="7" ry="4" fill="#1d1a18"/><ellipse cx="52" cy="44" rx="7" ry="4" fill="#1d1a18"/><path d="M36 74 Q40 76 44 74" stroke="#aaa" stroke-width="1.5" fill="none"/>'),
          r.x, r.y, { size: Math.min(r.width, 90), h: Math.min(r.height, 112) });
        fx.seq([["E5", 1], ["G5", 1], ["B5", 1], ["E6", 2], ["D6", 1], ["B5", 1], ["G5", 1], ["E5", 3]], { type: "triangle", vol: 0.08, beat: 0.22 });
        fx.seq([["E4", 2], ["B3", 2], ["C4", 2], ["B3", 2]], { type: "sine", vol: 0.05, beat: 0.5 });
        await fx.fadeIn(mask, 900);
        await fx.wait(1600);
        const doves = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#fff" stroke="#999" stroke-width=".8"/>');
        for (let i = 0; i < 6; i++) fx.later(i * 120, () => fx.fly(doves, [r.x, r.y], [r.x + fx.rand(-W() / 2, W() / 2), -40], { size: 40, h: 24, dur: 1800, easing: "ease-out" }));
        fx.noise(1.6, { type: "bandpass", freq: 1400, q: 1, vol: 0.2 });
        await fx.wait(2000);
      }
    },

    // Village of the Damned
    {
      id: 11773,
      y: 1960,
      run: async (fx) => {
        bw(fx, 6000);
        const eyes = '<g style="filter:drop-shadow(0 0 5px #fff)"><circle cx="52.5" cy="55" r="7" fill="#fff"/><circle cx="67.5" cy="55" r="7" fill="#fff"/></g>';
        fx.tone(880, 4, { type: "sine", vol: 0.06, vibrato: [0.5, 10], attack: 1 });
        fx.tone(884, 4, { type: "sine", vol: 0.06, attack: 1 });
        await fx.wait(900);
        fx.costume(".reely", eyes, 3800);
        fx.costume(".kernel", '<g style="filter:drop-shadow(0 0 5px #fff)"><circle cx="58" cy="88" r="6" fill="#fff"/><circle cx="72" cy="88" r="6" fill="#fff"/></g>', 3800);
        const others = fx.otherSlots(true);
        for (const s of others.slice(0, 8)) {
          const rr = fx.rect(s);
          fx.put(A.S("0 0 40 20", '<circle cx="10" cy="10" r="6" fill="#fff"/><circle cx="30" cy="10" r="6" fill="#fff"/>'), rr.x, rr.y - rr.height * 0.1, { size: 30, h: 15, style: { filter: "drop-shadow(0 0 5px #fff)" } });
        }
        fx.buzz([200]);
        await fx.wait(1600);
        const wall = fx.put(A.S("0 0 100 60", Array.from({ length: 18 }, (_, i) => '<rect x="' + (i % 6) * 17 + '" y="' + Math.floor(i / 6) * 20 + '" width="16" height="9" fill="#b3402d" stroke="#1f1b16" stroke-width="1"/>').join("")), W() / 2, H() * 0.3, { size: 160, h: 96 });
        fx.caption("(think of a brick wall)", { style: "whisper", ms: 2000 });
        fx.move(wall, [{ transform: "none" }, { transform: "translate(-3px,0)" }, { transform: "translate(3px,1px)" }, { transform: "none" }], { duration: 220, iterations: 8 });
        await fx.wait(2200);
      }
    },

    // Mughal-e-Azam
    {
      id: 44519,
      y: 1960,
      run: async (fx) => {
        const hall = fx.wash("radial-gradient(circle at 50% 40%, rgba(255,230,160,.35), rgba(60,30,10,.7))", 6400, { fade: 600 });
        void hall;
        const mirrors = [];
        for (let i = 0; i < 60; i++) {
          const m = fx.put(box("background:linear-gradient(135deg,#fff,#cfe8ff 40%,#ffe6a0);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)"), fx.rand(0, W()), fx.rand(0, H()), { size: fx.rand(6, 16) });
          m.style.opacity = 0;
          mirrors.push(m);
        }
        const tune = [["D5", 2], ["Eb5", 1], ["F#5", 1], ["G5", 2], ["A5", 2], ["Bb5", 1], ["A5", 1], ["G5", 2], ["F#5", 2], ["G5", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.28, filter: { freq: 1600 }, vibrato: [6, 10] });
        fx.chord(["D3", "A3"], 5, { type: "sawtooth", vol: 0.03, filter: { freq: 400 }, attack: 1 });
        for (let t = 0; t < 5; t += 0.28) fx.click({ freq: 7000, vol: 0.05, at: t });
        mirrors.forEach((m, i) => fx.anim(m, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0 }], { duration: 3000, delay: i * 40 }));
        A.liftSlot(fx, 6000);
        fx.style(fx.slot(), { boxShadow: "0 0 0 3px #ffe6a0, 0 0 40px 10px rgba(255,220,140,.8)" }, 6000);
        await fx.wait(6000);
      }
    },

    // Macario
    {
      id: 122019,
      y: 1960,
      run: async (fx) => {
        const cave = fx.node("", { cls: "fx-filter", style: { background: "#0b0907", opacity: 0.9 } });
        void cave;
        const n = 36;
        const candles = [];
        for (let i = 0; i < n; i++) {
          const x = fx.rand(20, W() - 20), y = fx.rand(H() * 0.2, H() * 0.9), s = fx.rand(0.5, 1.2);
          candles.push(fx.put(A.S("0 0 20 50", '<rect x="6" y="16" width="8" height="32" fill="#f4efe2"/><path class="f" d="M10 2 C15 8 15 12 10 16 C5 12 5 8 10 2 Z" fill="#ffcf5a"/>'), x, y, { size: 20 * s, h: 50 * s, style: { filter: "drop-shadow(0 0 6px #ffb347)" } }));
        }
        fx.chord(["A3", "E4"], 5, { type: "sine", vol: 0.05, attack: 1 });
        fx.noise(5, { freq: 300, vol: 0.05, attack: 1 });
        fx.caption("Every flame is a life.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        const r = fx.rect(fx.slot());
        const mine = fx.put(A.S("0 0 20 50", '<rect x="6" y="36" width="8" height="12" fill="#f4efe2"/><path d="M10 22 C15 28 15 32 10 36 C5 32 5 28 10 22 Z" fill="#ffcf5a"/>'), r.x, r.y, { size: 30, h: 75, style: { filter: "drop-shadow(0 0 8px #ffb347)" } });
        const f = mine.querySelector("path");
        for (let i = 0; i < 8; i++) {
          if (f) f.style.opacity = i % 2 ? 1 : 0.4;
          await fx.wait(fx.rand(120, 320));
        }
        fx.tone(200, 1, { type: "sine", vol: 0.06, slide: 120 });
        fx.caption("(still burning)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Breathless
    {
      id: 269,
      y: 1960,
      run: async (fx) => {
        bw(fx, 5600, " brightness(1.1)");
        const tune = [["C5", 1], ["Eb5", 1], ["G5", 2], ["F5", 1], ["Eb5", 1], ["D5", 2], ["C5", 2]];
        fx.seq(tune.concat(tune), { type: "triangle", vol: 0.08, beat: 0.2 });
        fx.chord(["C3", "G3", "Bb3", "Eb4"], 3, { type: "sawtooth", vol: 0.03, filter: { freq: 800 } });
        for (let i = 0; i < 9; i++) {
          jump(fx, fx.rand(-18, 18), fx.rand(-10, 10));
          await fx.wait(fx.rand(250, 480));
        }
        fx.costume(".reely", '<path d="M40 42 C44 34 56 36 60 40 C64 36 76 34 80 42" stroke="#1f1b16" stroke-width="3" fill="none"/><path d="M52 70 H70" stroke="#1f1b16" stroke-width="3"/><path d="M60 66 L64 64" stroke="#1f1b16" stroke-width="2"/>', 2000);
        fx.caption("New York Herald Tribune!", { style: "subtitle", ms: 1700 });
        await fx.wait(1800);
      }
    },

    // La Dolce Vita
    {
      id: 439,
      y: 1960,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.12)");
        const fountain = fx.wash("linear-gradient(transparent 55%, rgba(200,215,225,.6))", 6400, { fade: 700 });
        void fountain;
        const r = fx.rect(fx.slot());
        fx.particles({ kind: "rise", from: pt(r.x, r.top + r.height, r.width, 10), count: 40, glyphs: dot("rgba(220,240,255,.9)"), min: 2, max: 5, dur: 1400, stagger: 5000 });
        fx.noise(6, { type: "bandpass", freq: 3000, q: 0.7, vol: 0.15, attack: 0.8 });
        fx.seq([["F5", 2], ["G5", 1], ["A5", 1], ["C6", 3], ["Bb5", 1], ["A5", 2], ["G5", 2], ["F5", 4]], { type: "sine", vol: 0.08, beat: 0.35 });
        await fx.wait(2400);
        for (let i = 0; i < 6; i++) {
          fx.later(i * 280, () => {
            fx.flash("rgba(255,255,255,.85)", 110);
            fx.noise(0.12, { type: "highpass", freq: 4000, vol: 0.3 });
            fx.tone(1800, 0.25, { type: "sine", vol: 0.05, slide: 3000 });
          });
        }
        fx.caption("Marcello! Come here!", { style: "subtitle", ms: 1800, css: { bottom: "30vh" } });
        await fx.wait(3200);
      }
    },

    // The Apartment
    {
      id: 284,
      y: 1960,
      run: async (fx) => {
        bw(fx, 6000);
        const rg = fx.rect(fx.$("#grid"));
        const rows = 8, cols = W() < 500 ? 6 : 10;
        const desks = fullSvg(fx, A.S("0 0 100 100", Array.from({ length: rows * cols }, (_, i) => { const x = (i % cols) * (100 / cols), y = 30 + Math.floor(i / cols) * 9; return '<rect x="' + (x + 1) + '" y="' + y + '" width="' + (100 / cols - 3) + '" height="3" fill="#6d7478"/>'; }).join("")),
          { opacity: 0.55 });
        void desks;
        for (let t = 0; t < 3; t += 0.09) fx.click({ freq: fx.rand(1500, 3500), vol: 0.08, at: t });
        await fx.wait(1600);
        const key = A.S("0 0 50 20", '<circle cx="8" cy="10" r="6" fill="none" stroke="#c9a24a" stroke-width="3"/><path d="M14 10 H46 M40 10 V16 M34 10 V14" stroke="#c9a24a" stroke-width="3"/>');
        const r = fx.rect(fx.slot());
        await fx.fly(key, [rg.left - 30, rg.top], [r.x, r.y], { size: 44, h: 18, dur: 900, r2: 720 });
        fx.click({ freq: 5000, vol: 0.4 });
        fx.noise(0.08, { type: "highpass", freq: 6000, vol: 0.5, at: 0.4 });
        fx.caption("Shut up and deal.", { style: "subtitle", ms: 1800 });
        await fx.particles({ kind: "burst", from: fx.slot(), count: 12, spread: 50, glyphs: A.card, min: 20, max: 30, dur: 1200, stagger: 400, spin: 360 });
      }
    },

    // Spartacus
    {
      id: 967,
      y: 1960,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(1.2)", 5600, { fade: 300 });
        const slots = [fx.slot()].concat(fx.otherSlots(true)).slice(0, 9);
        for (let i = 0; i < slots.length; i++) {
          const rr = fx.rect(slots[i]);
          fx.put('<div style="font:700 12px Georgia,serif;color:#fff8d8;text-shadow:0 0 3px #000,1px 1px 0 #000;text-align:center;white-space:nowrap">I\'m Spartacus!</div>', rr.x, rr.top - 6, { size: 110, h: 16 });
          fx.move(slots[i], [{ transform: "none" }, { transform: "translateY(-8px)" }], { duration: 200, fill: "forwards" });
          fx.tone(fx.rand(110, 180), 0.35, { type: "sawtooth", vol: 0.1, filter: { freq: 900 } });
          fx.noise(0.2, { freq: 900, vol: 0.12 });
          await fx.wait(i < 2 ? 700 : 280);
        }
        fx.chord(["C4", "G4", "C5", "E5"], 2, { type: "sawtooth", vol: 0.06, filter: { freq: 1600 } });
        fx.buzz([60, 40, 60]);
        await fx.wait(2000);
      }
    },

    // Last Year at Marienbad
    {
      id: 4024,
      y: 1961,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.12)");
        const garden = fullSvg(fx, A.S("0 0 400 300", '<rect y="170" width="400" height="130" fill="#e8e4da"/>' +
          [60, 130, 200, 270, 340].map((x) => '<path d="M' + x + ' 200 L' + (x - 10) + ' 180 L' + x + ' 150 L' + (x + 10) + ' 180 Z" fill="#1d1a18"/>').join("") +
          '<path d="M0 250 H400 M60 300 L200 180 L340 300" stroke="#bbb" stroke-width="2" fill="none"/>'), { opacity: 0 });
        fx.anim(garden, [{ opacity: 0 }, { opacity: 0.75 }], { duration: 800, fill: "forwards" });
        const figs = [0.2, 0.35, 0.5, 0.65, 0.8].map((x) => fx.put(A.S("0 0 20 60", '<circle cx="10" cy="6" r="5" fill="#1d1a18"/><path d="M4 12 H16 L18 58 H2 Z" fill="#1d1a18"/>'), W() * x, H() * 0.6, { size: 12, h: 36, style: { filter: "drop-shadow(" + (-40) + "px 12px 0 rgba(0,0,0,.5))" } }));
        void figs;
        fx.chord(["C4", "F#4", "B4"], 5.5, { type: "sine", vol: 0.06, attack: 1 });
        for (let i = 0; i < 12; i++) fx.tone(fx.pick(["C5", "F#5", "B5", "E6"]), 0.6, { type: "sine", vol: 0.04, at: 0.5 + i * 0.4 });
        fx.caption("Last year… at Frederiksbad?", { style: "subtitle", ms: 1800 });
        await fx.wait(2200);
        fx.caption("Or perhaps Marienbad.", { style: "subtitle", ms: 1800 });
        fx.freeze(2200);
        await fx.wait(2400);
      }
    },

    // West Side Story
    {
      id: 1725,
      y: 1961,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const split = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(90deg, rgba(220,40,50,.35) 50%, rgba(60,110,220,.35) 50%)", mixBlendMode: "multiply" } });
        void split;
        fx.caption("♪", { style: "hand", ms: 400 });
        const snaps = [0, 0.5, 1, 1.5, 2, 2.25, 2.5, 3, 3.5];
        snaps.forEach((t) => fx.noise(0.04, { type: "bandpass", freq: 2800, q: 3, vol: 0.9, at: t, pan: t % 1 ? 0.6 : -0.6 }));
        const reely = fx.$(".reely"), kernel = fx.$(".kernel");
        for (let i = 0; i < 7; i++) {
          fx.move(i % 2 ? reely : kernel, [{ transform: "none" }, { transform: "translateY(-10px) rotate(" + (i % 2 ? 12 : -12) + "deg)" }, { transform: "none" }], { duration: 400, fill: "none" });
          fx.buzz(10);
          await fx.wait(500);
        }
        const fire = fx.put(A.S("0 0 80 120", '<path d="M10 10 V120 M70 10 V120" stroke="#3b3530" stroke-width="4"/>' + [20, 50, 80, 110].map((y) => '<path d="M10 ' + y + ' H70 M10 ' + (y - 8) + ' L70 ' + (y - 8) + '" stroke="#3b3530" stroke-width="2"/>').join("")), r.x + r.width * 0.8, r.y, { size: 60, h: r.height * 1.2 });
        void fire;
        fx.seq([["C5", 2], ["F#5", 1], ["G5", 3]], { type: "sine", vol: 0.1, beat: 0.3 });
        fx.particles({ kind: "drift", area: fx.slot(), count: 8, glyphs: A.heart("#e05a5a"), min: 8, max: 14, dur: 1400 });
        await fx.wait(1600);
      }
    },

    // Knife in the Water
    {
      id: 11502,
      y: 1962,
      run: async (fx) => {
        bw(fx, 5600);
        const cx = W() / 2, cy = H() * 0.45;
        const hand = fx.put(A.S("0 0 120 60", '<path d="M4 30 C10 20 30 18 44 22 L60 22 C66 22 66 30 60 30 L48 32 C40 40 20 42 4 30 Z" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/>'), cx - 30, cy, { size: 120, h: 60 });
        void hand;
        const knife = fx.put(A.S("0 0 20 60", '<path d="M10 2 L16 36 H4 Z" fill="#dfe6ea" ' + A.ink + ' stroke-width="1.5"/><rect x="5" y="36" width="10" height="22" rx="2" fill="#6b4a2a" ' + A.ink + ' stroke-width="1.5"/>'), cx + 20, cy - 60, { size: 14, h: 42 });
        const gaps = [cx + 6, cx + 26, cx + 12, cx + 40, cx + 20, cx + 50, cx - 4, cx + 30, cx + 10, cx + 44];
        const tune = [["F#4", 1], ["A4", 1], ["C#5", 1], ["E5", 1], ["D5", 2], ["C#5", 2]];
        fx.seq(tune.concat(tune), { type: "sawtooth", vol: 0.04, beat: 0.2, filter: { freq: 1400 } });
        for (let i = 0; i < gaps.length; i++) {
          knife.style.left = gaps[i] - 7 + "px";
          fx.move(knife, [{ transform: "translateY(-30px)" }, { transform: "translateY(" + 36 + "px)" }], { duration: Math.max(90, 240 - i * 16), easing: "ease-in" });
          fx.thud({ freq: 240, vol: 0.18, dur: 0.07 });
          await fx.wait(Math.max(120, 300 - i * 18));
        }
        fx.noise(1.4, { freq: 600, sweep: 200, vol: 0.2 });
        fx.move(knife, [{ transform: "translateY(36px)" }, { transform: "translate(80px, " + H() + "px) rotate(200deg)" }], { duration: 1200, easing: "ease-in" });
        fx.caption("(splash)", { style: "whisper", ms: 1200 });
        await fx.wait(1500);
      }
    },

    // The Exterminating Angel
    {
      id: 29264,
      y: 1962,
      run: async (fx) => {
        bw(fx, 7000);
        const r = fx.rect(fx.slot());
        const line = fx.put(box("border:2px dashed rgba(255,255,255,.7);border-radius:8px"), r.x, r.y, { size: r.width + 24, h: r.height + 24 });
        void line;
        fx.chord(["C4", "E4", "G4", "Bb4"], 2, { type: "sine", vol: 0.06 });
        fx.caption("Shall we go?", { style: "subtitle", ms: 1400 });
        await fx.wait(1600);
        for (let i = 0; i < 3; i++) {
          fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateX(18px)" }, { transform: "translateX(14px)" }, { transform: "none" }], 900);
          fx.tone(160, 0.3, { type: "triangle", vol: 0.08, at: 0.4 });
          await fx.wait(1000);
        }
        fx.caption("…in a moment.", { style: "subtitle", ms: 1400 });
        fx.later(900, () => {
          const sheep = A.S("0 0 50 36", '<ellipse cx="24" cy="18" rx="18" ry="12" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><circle cx="42" cy="14" r="6" fill="#1d1a18"/><path d="M14 28 V34 M32 28 V34" ' + A.ink + '/>');
          fx.fly(sheep, [-40, H() - 50], [W() + 40, H() - 50], { size: 50, h: 36, dur: 2600, easing: "steps(12)" });
          fx.tone(300, 0.5, { type: "sawtooth", vol: 0.08, vibrato: [12, 40], filter: { freq: 900 } });
        });
        await fx.wait(2600);
      }
    },

    // Carnival of Souls
    {
      id: 16093,
      y: 1962,
      run: async (fx) => {
        bw(fx, 6400, " brightness(.9)");
        const organ = [["C4", "Eb4", "Gb4"], ["Db4", "E4", "G4"], ["B3", "D4", "F4"], ["C4", "Eb4", "A4"]];
        organ.forEach((c, i) => fx.chord(c, 1.3, { type: "sawtooth", vol: 0.045, at: i * 1.2, filter: { freq: 1200 }, vibrato: [5.5, 5] }));
        fx.chord(["C2", "G2"], 5, { type: "square", vol: 0.03, filter: { freq: 300 } });
        await fx.wait(1200);
        const man = A.S("0 0 50 100", '<path d="M10 30 C10 8 40 8 40 30 L42 96 H8 Z" fill="#1d1a18"/><ellipse cx="25" cy="26" rx="12" ry="15" fill="#e8ecee"/><circle cx="20" cy="24" r="4" fill="#1d1a18"/><circle cx="30" cy="24" r="4" fill="#1d1a18"/><path d="M20 34 H30" stroke="#1d1a18" stroke-width="2"/>');
        const spots = [[0.8, 0.4], [0.2, 0.3], [0.6, 0.75]];
        for (const [x, y] of spots) {
          const m = fx.put(man, W() * x, H() * y, { size: 60, h: 120 });
          fx.anim(m, [{ opacity: 0 }, { opacity: 0.85 }, { opacity: 0.85 }, { opacity: 0 }], { duration: 1300 });
          fx.noise(0.2, { type: "highpass", freq: 4000, vol: 0.1 });
          await fx.wait(1400);
        }
        fx.move(fx.pageParts(), [{ transform: "none" }, { transform: "rotate(1deg)" }, { transform: "rotate(-1deg)" }, { transform: "none" }], { duration: 900, fill: "none" });
        await fx.wait(1200);
      }
    },

    // Cléo from 5 to 7
    {
      id: 499,
      y: 1962,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.1)");
        const clock = fx.put('<div style="font:700 26px/1 \'Special Elite\',\'Courier New\',monospace;color:#f4efe2;background:#1d1a18;padding:6px 10px;border-radius:4px;text-align:center">17:00</div>', W() - 80, 70, { size: 110, h: 40 });
        const d = clock.firstChild;
        for (let i = 0; i < 16; i++) {
          const mins = Math.floor(i * 7.5);
          d.textContent = (17 + Math.floor(mins / 60)) + ":" + String(mins % 60).padStart(2, "0");
          fx.click({ freq: 1400, vol: 0.2 });
          await fx.wait(260);
        }
        d.textContent = "18:30";
        const cards = ["☉", "☾", "✦", "♜", "✝"];
        for (let i = 0; i < 5; i++) {
          fx.put('<div style="width:100%;height:100%;background:#f4efe2;border:2px solid #1d1a18;border-radius:4px;font:24px/60px Georgia;text-align:center;color:#1d1a18">' + cards[i] + "</div>", W() / 2 + (i - 2) * 46, H() * 0.42, { size: 40, h: 60 });
          fx.tone(["A4", "C5", "E5", "G5", "F4"][i], 0.4, { type: "triangle", vol: 0.1 });
          await fx.wait(300);
        }
        fx.caption("Tarot never lies.", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
      }
    },

    // La Jetée
    {
      id: 662,
      y: 1962,
      run: async (fx) => {
        const s = A.liftSlot(fx, 7400);
        bw(fx, 7400, " brightness(1.05)");
        fx.node("", { cls: "fx-filter fx-grain", ms: 7400 });
        fx.freeze(7400);
        fx.chord(["E3", "B3", "G4"], 6, { type: "sine", vol: 0.05, attack: 2 });
        fx.noise(6, { freq: 300, vol: 0.05, attack: 1 });
        const whisper = ["This is the story of a man", "marked by an image from his childhood."];
        for (const w of whisper) {
          fx.caption(w, { style: "subtitle", ms: 1900 });
          await fx.wait(2000);
        }
        fx.style(s, { filter: "grayscale(1)" }, 7400);
        await fx.wait(600);
        for (const k of [1, 0, 1, 0]) {
          if (s) s.style.filter = k ? "grayscale(1) brightness(.08)" : "grayscale(1)";
          await fx.wait(k ? 90 : 150);
        }
        fx.tone(1200, 0.2, { type: "sine", vol: 0.05 });
        await fx.wait(1800);
      }
    },

    // High and Low
    {
      id: 12493,
      y: 1963,
      run: async (fx) => {
        bw(fx, 6400);
        fx.noise(1, { freq: 900, vol: 0.1 });
        await fx.wait(1200);
        const r = fx.rect(fx.$(".reely") || fx.slot());
        const plume = fx.particles({ kind: "rise", from: pt(W() * 0.8, H() * 0.55, 20, 10), count: 26, glyphs: dot("#ff66b3"), min: 14, max: 32, dur: 3000, stagger: 2600 });
        fx.put(A.S("0 0 40 60", '<rect x="6" y="20" width="28" height="40" fill="#3b3530"/><rect x="14" y="0" width="12" height="22" fill="#3b3530"/>'), W() * 0.8, H() * 0.6, { size: 40, h: 60 });
        fx.caption("Pink smoke!", { style: "hand", ms: 1600, css: { color: "#ff66b3" } });
        fx.seq([["E5", 1], ["C5", 1], ["E5", 1], ["C5", 1], ["G5", 2]], { type: "square", vol: 0.06, beat: 0.18 });
        fx.later(400, () => fx.flash("rgba(255,102,179,.25)", 400));
        void r;
        await plume;
      }
    },

    // Jason and the Argonauts
    {
      id: 11533,
      y: 1963,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const skel = A.S("0 0 50 90", '<circle cx="25" cy="10" r="8" fill="#efe7d2" ' + A.ink + ' stroke-width="2"/><path d="M25 18 V52 M14 26 H36 M16 32 H34 M18 38 H32 M25 26 L8 40 L2 30 M25 26 L42 40 M25 52 L16 86 M25 52 L34 86" stroke="#efe7d2" stroke-width="4" stroke-linecap="round"/><path d="M42 40 L50 10" stroke="#9aa2a6" stroke-width="3"/><circle cx="4" cy="40" r="8" fill="#b3402d" ' + A.ink + ' stroke-width="2"/>');
        const n = 3;
        const sk = [];
        for (let i = 0; i < n; i++) {
          const x = W() / 2 + (i - 1) * 70;
          const s = fx.put(skel, x, H() + 60, { size: 50, h: 90 });
          sk.push(s);
          fx.move(s, [{ transform: "none" }, { transform: "translateY(-" + (H() * 0.35 + 60) + "px)" }], { duration: 900, delay: i * 300, easing: "steps(8)" });
        }
        await fx.wait(1600);
        for (let k = 0; k < 10; k++) {
          sk.forEach((s, i) => { if (!fx.reduced) s.style.transform = "translateY(-" + (H() * 0.35 + 60) + "px) rotate(" + ((k + i) % 2 ? 8 : -8) + "deg)"; });
          fx.click({ freq: 2200, vol: 0.4 });
          fx.noise(0.05, { type: "highpass", freq: 5000, vol: 0.3, at: 0.08 });
          await fx.wait(180);
        }
        fx.move(fx.slot(), [{ transform: "none" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "none" }], { duration: 400, fill: "none" });
        fx.buzz([20, 40, 20, 40, 20]);
        await fx.wait(1200);
        void r;
      }
    },

    // The Haunting (1963)
    {
      id: 11772,
      y: 1963,
      run: async (fx) => {
        bw(fx, 6400, " brightness(.85)");
        const rg = fx.rect(fx.$("#grid"));
        for (let i = 0; i < 5; i++) {
          fx.thud({ freq: 60, vol: 0.9, dur: 0.4, at: i * 0.5 });
          fx.noise(0.12, { freq: 400, vol: 0.4, at: i * 0.5 });
        }
        fx.buzz([80, 420, 80, 420, 80, 420, 80, 420, 80]);
        fx.later(2600, () => fx.buzz([80, 420, 80]));
        for (let i = 0; i < 5; i++) {
          fx.later(i * 500, () => fx.move(fx.$(".machine"), [{ transform: "none" }, { transform: "scale(1.012)" }, { transform: "none" }], { duration: 300, fill: "none" }));
        }
        await fx.wait(2800);
        const bulge = fx.put('<div style="width:100%;height:100%;border-radius:40%;background:radial-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,.35))"></div>', rg.x, rg.y, { size: rg.width * 0.7, h: rg.height * 0.6 });
        await fx.move(bulge, [{ transform: "scale(.8)" }, { transform: "scale(1.1)" }, { transform: "scale(.9)" }], 1600);
        fx.caption("Whose hand was I holding?", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // 8½
    {
      id: 422,
      y: 1963,
      run: async (fx) => {
        bw(fx, 7000, " brightness(1.1)");
        const r = fx.rect(fx.slot());
        const kite = A.S("0 0 40 200", '<path d="M20 200 V60" stroke="#1d1a18" stroke-width="1.5"/><path d="M20 20 C40 30 40 50 20 60 C0 50 0 30 20 20 Z" fill="#1d1a18"/><rect x="12" y="0" width="16" height="22" fill="#1d1a18"/>');
        const man = fx.put(kite, r.x, r.y - 60, { size: 40, h: 200 });
        await fx.move(man, [{ transform: "none" }, { transform: "translateY(-" + (r.y - 40) + "px)" }], { duration: 2000, easing: "ease-out" });
        fx.tone(700, 1.8, { type: "sine", vol: 0.06, slide: 1400 });
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["C6", 1], ["B5", 1], ["G5", 1], ["E5", 2], ["F5", 1], ["A5", 1], ["C6", 2], ["G5", 4]];
        fx.seq(tune, { type: "square", vol: 0.06, beat: 0.2, filter: { freq: 2200 } });
        fx.seq([["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["F3", 2], ["C4", 2], ["G3", 4]], { type: "triangle", vol: 0.08, beat: 0.2 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        for (let i = 0; i < all.length; i++) fx.move(all[i], [{ transform: "none" }, { transform: "translateY(-6px) rotate(" + (i % 2 ? 4 : -4) + "deg)" }, { transform: "none" }], { duration: 440, delay: i * 90, iterations: 3, fill: "none" });
        fx.caption("Life is a celebration — let's live it together.", { style: "subtitle", ms: 2600 });
        await fx.wait(3600);
      }
    },

    // Contempt
    {
      id: 266,
      y: 1963,
      run: async (fx) => {
        const bands = ["rgba(220,30,30,.35)", "rgba(255,255,255,.0)", "rgba(40,90,220,.35)"];
        const w = fx.wash(bands[0], 6000, { blend: "multiply" });
        fx.chord(["G3", "D4", "Bb4"], 6, { type: "sawtooth", vol: 0.04, attack: 1.2, filter: { freq: 900 } });
        fx.seq([["D5", 4], ["C5", 2], ["Bb4", 2], ["A4", 4], ["G4", 4]], { type: "sine", vol: 0.1, beat: 0.35, attack: 0.3 });
        for (let i = 1; i < 6; i++) {
          await fx.wait(900);
          w.style.background = bands[i % 3];
        }
        fx.letterbox(1400, "12vh");
        fx.wash("linear-gradient(#6aa5d8 0 55%, #2f5f8a 55%)", 1400, { fade: 400, opacity: 0.6, blend: "multiply" });
        await fx.wait(1400);
      }
    },

    // The Umbrellas of Cherbourg
    {
      id: 5967,
      y: 1964,
      run: async (fx) => {
        const cols = ["#e84a8a", "#4ab0e8", "#f2c94c", "#7ed957", "#b36be8", "#e8744a"];
        fx.particles({ kind: "fall", count: 60, glyphs: A.drop("#dff3ff"), min: 5, max: 9, dur: 1200, stagger: 5000 });
        fx.noise(6, { type: "highpass", freq: 3000, vol: 0.06, attack: 0.5 });
        const n = W() < 500 ? 5 : 8;
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * W() / n;
          const u = A.S("0 0 60 60", '<path d="M4 30 C4 8 56 8 56 30 C50 26 44 26 38 30 C32 26 28 26 22 30 C16 26 10 26 4 30 Z" fill="' + cols[i % cols.length] + '" ' + A.ink + ' stroke-width="2"/><path d="M30 30 V54 C30 58 24 58 24 54" stroke="#1d1a18" stroke-width="2.5" fill="none"/>');
          fx.fly(u, [x, -60], [x, H() * 0.55 + (i % 2) * 20], { size: 60, easing: "ease-out", dur: 1400 + i * 120, keep: true });
          fx.tone(["C5", "E5", "G5", "B5", "A5", "F5", "D5", "G5"][i], 0.4, { type: "sine", vol: 0.06, at: i * 0.18 });
        }
        await fx.wait(2200);
        fx.caption("♪ Je ne pourrai jamais vivre sans toi ♪", { style: "subtitle", ms: 2200 });
        fx.seq([["A4", 2], ["C5", 1], ["E5", 1], ["A5", 3], ["G5", 1], ["F5", 2], ["E5", 2], ["D5", 4]], { type: "triangle", vol: 0.08, beat: 0.28 });
        await fx.wait(2800);
      }
    },

    // Woman in the Dunes
    {
      id: 16672,
      y: 1964,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.05)");
        const sand = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "0", background: "linear-gradient(#bdb6a4, #8a8474)" } });
        fx.noise(6, { type: "bandpass", freq: 2200, q: 0.8, vol: 0.2, attack: 1 });
        fx.particles({ kind: "fall", count: 90, glyphs: dot("rgba(190,180,160,.9)"), min: 1, max: 3, dur: 1800, stagger: 5200, wind: 20 });
        await fx.tween(5200, (k) => { sand.style.height = k * 38 + "vh"; sand.style.clipPath = "polygon(0 " + (20 + Math.sin(k * 6) * 10) + "%, 30% 0, 60% " + (10 + k * 10) + "%, 100% 5%, 100% 100%, 0 100%)"; });
        fx.caption("Are you shoveling to live, or living to shovel?", { style: "subtitle", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Onibaba
    {
      id: 3763,
      y: 1964,
      run: async (fx) => {
        bw(fx, 6400);
        const reeds = fullSvg(fx, A.S("0 0 400 300", Array.from({ length: 80 }, (_, i) => { const x = i * 5 + (i % 3); return '<path d="M' + x + " 300 C" + (x + 3) + " 200 " + (x - 5) + " 120 " + (x + 4) + " " + (40 + (i * 53) % 80) + '" stroke="#2b2b2b" stroke-width="2.5" fill="none"/>'; }).join("")), { opacity: 0.8 });
        fx.noise(6, { type: "bandpass", freq: 900, q: 0.6, vol: 0.35, attack: 0.5, pan: -1, panTo: 1 });
        if (!fx.reduced) fx.anim(reeds, [{ transform: "skewX(0)" }, { transform: "skewX(-10deg)" }, { transform: "skewX(6deg)" }, { transform: "skewX(-8deg)" }, { transform: "skewX(0)" }], { duration: 3600 });
        for (let i = 0; i < 12; i++) fx.thud({ freq: 90, vol: 0.4, dur: 0.14, at: 0.3 + i * 0.28 });
        await fx.wait(3600);
        const mask = fx.put(A.S("0 0 80 100", '<path d="M10 40 C6 8 74 8 70 40 C74 72 58 96 40 96 C22 96 6 72 10 40 Z" fill="#f4f0e6" ' + A.ink + '/><path d="M18 20 L10 4 L26 16 M62 20 L70 4 L54 16" fill="#f4f0e6" ' + A.ink + '/><path d="M24 40 L34 44 M56 40 L46 44" ' + A.ink + '/><path d="M24 70 C34 60 46 60 56 70 L50 76 L40 70 L30 76 Z" fill="#8a1a1a" ' + A.ink + ' stroke-width="2"/>'),
          W() / 2, H() * 0.4, { size: 120, h: 150 });
        fx.chord(["C3", "C#3", "G3"], 1.4, { type: "sawtooth", vol: 0.1, filter: { freq: 900 } });
        fx.buzz([100, 40, 100]);
        await fx.fadeIn(mask, 150);
        await fx.wait(1800);
      }
    },

    // Band of Outsiders
    {
      id: 8073,
      y: 1964,
      run: async (fx) => {
        bw(fx, 7000, " brightness(1.1)");
        fx.caption("A minute of silence.", { style: "card", ms: 1400 });
        await fx.wait(1400);
        await fx.wait(2200);
        const trio = [0, 1, 2].map((i) => fx.put(A.S("0 0 30 60", '<circle cx="15" cy="8" r="7" fill="#1d1a18"/><path d="M6 16 H24 L22 40 H8 Z" fill="#1d1a18"/><path d="M8 40 L4 58 M22 40 L26 58" stroke="#1d1a18" stroke-width="4"/>'), W() / 2 + (i - 1) * 40, H() * 0.7, { size: 30, h: 60 }));
        const tune = [["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["D4", 1], ["E4", 2]];
        fx.seq(tune.concat(tune), { type: "triangle", vol: 0.1, beat: 0.2 });
        for (let k = 0; k < 14; k++) {
          trio.forEach((t, i) => {
            const side = [0, 1, 0, -1][(k + i) % 4] * 10;
            if (!fx.reduced) t.style.transform = "translateX(" + side + "px) translateY(" + ((k + i) % 2 ? -4 : 0) + "px)";
          });
          fx.click({ freq: 1600, vol: 0.2 });
          await fx.wait(220);
        }
      }
    },

    // Marnie
    {
      id: 506,
      y: 1964,
      run: async (fx) => {
        const s = A.liftSlot(fx, 6000);
        fx.filter("saturate(.8)", 6000, { fade: 300 });
        for (let i = 0; i < 3; i++) {
          fx.flash("rgba(220,20,30,.8)", 500);
          fx.chord(["E3", "B3", "F4"], 0.6, { type: "sawtooth", vol: 0.1, filter: { freq: 1400 } });
          fx.buzz(60);
          if (s) fx.style(s, { filter: "sepia(1) saturate(6) hue-rotate(-40deg)" }, 500);
          await fx.wait(1100);
        }
        fx.put(A.S("0 0 80 30", '<rect x="2" y="4" width="76" height="22" rx="4" fill="#e8e0c8" ' + A.ink + ' stroke-width="2"/><rect x="30" y="10" width="20" height="10" fill="#6b4a2a"/>'), W() / 2, H() - 80, { size: 90, h: 34, ms: 2400 });
        fx.caption("(the safe is open)", { style: "whisper", ms: 2000 });
        fx.noise(0.1, { type: "highpass", freq: 5000, vol: 0.3 });
        await fx.wait(2400);
      }
    },

    // Kwaidan
    {
      id: 30959,
      y: 1965,
      run: async (fx) => {
        const sky = fullSvg(fx, A.S("0 0 400 300",
          '<defs><linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a4a"/><stop offset=".6" stop-color="#b3402d"/><stop offset="1" stop-color="#1d1a18"/></linearGradient></defs>' +
          '<rect width="400" height="300" fill="url(#kw)" opacity=".75"/><g fill="#fff" opacity=".7">' + Array.from({ length: 10 }, (_, i) => '<ellipse cx="' + (40 + i * 38) + '" cy="' + (40 + (i * 29) % 60) + '" rx="6" ry="16" transform="rotate(20 ' + (40 + i * 38) + " " + (40 + (i * 29) % 60) + ')"/>').join("") + "</g>" +
          '<path d="M0 300 C60 280 90 230 150 240 C220 250 260 200 320 220 C360 232 380 260 400 250 V300 Z" fill="#0d0b09"/>'),
          { opacity: 0 });
        fx.anim(sky, [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: "forwards" });
        const pluck = (n, at) => { fx.tone(n, 1.2, { type: "triangle", vol: 0.14, at, attack: 0.002 }); fx.noise(0.05, { type: "highpass", freq: 3000, vol: 0.3, at }); };
        pluck("E4", 0.3); pluck("F4", 1.3); pluck("B3", 2.5); pluck("E4", 3.8);
        fx.noise(0.9, { type: "bandpass", freq: 1200, q: 8, vol: 0.2, at: 2 });
        fx.later(2200, () => { fx.style(fx.$(".reely"), { filter: "invert(1)" }, 1200); fx.click({ freq: 800, vol: 0.5 }); });
        await fx.wait(4400);
        fx.caption("The woman of the snow is watching.", { style: "whisper", ms: 1400 });
        fx.particles({ kind: "fall", count: 30, glyphs: A.snowflake, min: 5, max: 10, dur: 2400, wind: 40 });
        await fx.wait(1500);
      }
    },

    // Alphaville
    {
      id: 8072,
      y: 1965,
      run: async (fx) => {
        bw(fx, 6400, " contrast(1.4)");
        const eq = fx.put('<div style="font:700 44px/1 Georgia,serif;color:#fff;text-align:center;text-shadow:0 0 12px #fff">E = mc²</div>', W() / 2, H() * 0.3, { size: 240, h: 60 });
        for (let i = 0; i < 8; i++) {
          eq.style.opacity = i % 2 ? 1 : 0.1;
          fx.click({ freq: 900, vol: 0.4 });
          await fx.wait(200);
        }
        eq.style.opacity = 1;
        const voice = (t, a, b) => { fx.tone(a, 0.4, { type: "sawtooth", vol: 0.08, at: t, filter: { type: "bandpass", freq: 700, q: 6 }, vibrato: [30, 20] }); fx.tone(b, 0.3, { type: "sawtooth", vol: 0.06, at: t + 0.4, filter: { type: "bandpass", freq: 500, q: 6 } }); };
        voice(0, 90, 80); voice(0.9, 100, 70); voice(1.8, 85, 75);
        fx.caption("Alpha 60: no one has lived in the past, and no one will live in the future.", { style: "terminal", ms: 2800, css: { fontSize: "13px" } });
        await fx.wait(2900);
        fx.caption("Your name, please?", { style: "terminal", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Pierrot le Fou
    {
      id: 2786,
      y: 1965,
      run: async (fx) => {
        const cols = ["#d51f2a", "#1f4fd5", "#f2c94c"];
        for (let i = 0; i < 6; i++) {
          fx.flash(cols[i % 3], 260);
          fx.tone(fx.pick(["E4", "G4", "Bb4", "C5"]), 0.3, { type: "sawtooth", vol: 0.05, filter: { freq: 1500 } });
          await fx.wait(320);
        }
        const r = fx.rect(fx.slot());
        fx.style(fx.$(".reely"), { filter: "hue-rotate(200deg) saturate(3)" }, 3600);
        const dyn = fx.put(A.S("0 0 120 40", Array.from({ length: 6 }, (_, i) => '<rect x="' + (4 + i * 19) + '" y="6" width="14" height="30" rx="2" fill="' + (i % 2 ? "#d51f2a" : "#f2c94c") + '" ' + A.ink + ' stroke-width="1.5"/>').join("") + '<path d="M60 6 C60 -4 70 -6 74 -10" stroke="#1f1b16" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 120, h: 40 });
        fx.put(A.S("0 0 12 12", '<circle cx="6" cy="6" r="4" fill="#ffcf5a"/>'), r.x + 14, r.y - 26, { size: 10, ms: 2600 });
        for (let t = 0; t < 2.4; t += 0.08) fx.noise(0.04, { type: "highpass", freq: 5000, vol: 0.15, at: t });
        await fx.wait(2600);
        fx.caption("Found again. What? Eternity.", { style: "subtitle", ms: 1800 });
        fx.remove(dyn);
        fx.wash("linear-gradient(#4ab0e8 50%, #1f4fd5 50%)", 1800, { fade: 600, opacity: 0.5 });
        fx.noise(1.8, { freq: 600, vol: 0.12 });
        await fx.wait(1800);
      }
    },

    // For a Few Dollars More
    {
      id: 938,
      y: 1965,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(1.4) contrast(1.1)", 6400, { fade: 400 });
        fx.letterbox(6400, "12vh");
        const watch = fx.put(A.S("0 0 80 90", '<rect x="36" y="0" width="8" height="10" fill="#c9a24a"/><circle cx="40" cy="50" r="36" fill="#c9a24a" ' + A.ink + '/><circle cx="40" cy="50" r="28" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/><path class="h" d="M40 50 V28" ' + A.ink + ' stroke-width="3"/>'),
          W() / 2, H() * 0.4, { size: 110, h: 124 });
        const h = watch.querySelector(".h");
        const chime = ["E6", "G6", "B6", "A6", "G6", "E6", "D6", "E6", "G6", "B6", "D7", "B6"];
        chime.forEach((n, i) => fx.tone(n, 0.5, { type: "sine", vol: 0.07, at: i * 0.32 }));
        for (let i = 0; i < 12; i++) {
          if (h) h.setAttribute("transform", "rotate(" + i * 30 + " 40 50)");
          await fx.wait(320);
        }
        await fx.wait(500);
        fx.noise(0.25, { freq: 2600, vol: 0.9 });
        fx.thud({ vol: 0.6 });
        fx.flash("#fff7d6", 120);
        fx.buzz(60);
        fx.tone(900, 1.8, { type: "sine", vol: 0.05, slide: 700, at: 0.2 });
        await fx.wait(1600);
      }
    },

    // Au Hasard Balthazar
    {
      id: 20108,
      y: 1966,
      run: async (fx) => {
        bw(fx, 7000);
        const donkey = A.S("0 0 80 60", '<path d="M14 30 C16 20 44 18 56 22 L62 8 L66 10 L66 22 L72 30 C74 36 70 40 64 38 L60 36 C56 42 50 42 46 40 L44 56 H40 L38 40 H24 L22 56 H18 L18 38 C12 38 10 34 14 30 Z M62 8 L58 2 L60 12" fill="#6d665c" ' + A.ink + ' stroke-width="2"/><circle cx="66" cy="24" r="1.5" fill="' + A.INK + '"/>');
        const y = H() - 90;
        const d = fx.put(donkey, -40, y, { size: 80, h: 60 });
        fx.move(d, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.5 + 40) + "px)" }], { duration: 4000, easing: "steps(16)" });
        for (let t = 0; t < 4; t += 0.5) fx.tone(t % 1 ? 1100 : 900, 0.3, { type: "sine", vol: 0.05, at: t });
        const tune = [["A4", 2], ["C5", 1], ["E5", 1], ["D5", 2], ["C5", 2], ["B4", 2], ["A4", 2], ["G#4", 2], ["A4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.07, beat: 0.28, at: 0.4 });
        await fx.wait(4200);
        fx.particles({ kind: "drift", area: pt(W() / 2, y, 200, 60), count: 12, glyphs: A.S("0 0 20 20", '<ellipse cx="10" cy="10" rx="6" ry="9" fill="#f4f2ec" stroke="#999"/>'), min: 10, max: 16, dur: 2400 });
        fx.chord(["A3", "E4", "A4"], 2.4, { type: "sine", vol: 0.05, attack: 0.5 });
        await fx.wait(2400);
      }
    },

    // Daisies
    {
      id: 46919,
      y: 1966,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const tints = ["rgba(255,0,120,.35)", "rgba(0,200,255,.35)", "rgba(255,220,0,.35)", "rgba(0,255,120,.35)"];
        const pieces = [];
        fx.style(fx.slot(), { opacity: "0" }, 5200);
        const img = fx.slot() && fx.slot().querySelector("img");
        const cols = 3, rows = 4;
        for (let i = 0; i < cols * rows; i++) {
          const c = i % cols, rr = Math.floor(i / cols);
          const w = r.width / cols, h = r.height / rows;
          const el = fx.put(img ? '<div style="width:100%;height:100%;background:url(' + img.src + ') ' + (-c * w) + "px " + (-rr * h) + "px/" + r.width + "px " + r.height + 'px"></div>' : box("background:" + tints[i % 4]), r.left + c * w + w / 2, r.top + rr * h + h / 2, { size: w, h });
          pieces.push(el);
        }
        fx.seq([["C6", 1], ["E6", 1], ["G5", 1], ["B5", 1], ["F6", 1], ["D6", 1], ["A5", 2]], { type: "square", vol: 0.05, beat: 0.12, filter: { freq: 3000 } });
        for (let t = 0; t < 1.6; t += 0.12) fx.noise(0.08, { type: "bandpass", freq: 2500, q: 2, vol: 0.25, at: t });
        await fx.wait(300);
        pieces.forEach((p, i) => fx.move(p, [{ transform: "none" }, { transform: "translate(" + fx.rand(-W() / 3, W() / 3) + "px," + fx.rand(-H() / 3, H() / 3) + "px) rotate(" + fx.rand(-90, 90) + "deg)" }], { duration: 900, delay: i * 30, easing: "cubic-bezier(.2,.8,.3,1)" }));
        fx.later(900, () => pieces.forEach((p, i) => fx.style(p, { filter: "drop-shadow(0 0 0 " + tints[i % 4] + ") hue-rotate(" + i * 30 + "deg) saturate(2)" })));
        await fx.wait(2400);
        fx.caption("If everything is spoiled, we'll be spoiled too!", { style: "hand", ms: 1600, css: { fontSize: "18px" } });
        pieces.forEach((p) => fx.move(p, [{ opacity: 1 }, { opacity: 0 }], 1400));
        await fx.wait(1800);
      }
    },

    // Tokyo Drifter
    {
      id: 45706,
      y: 1966,
      run: async (fx) => {
        const set = ["#e8f0ff", "#ffd6f0", "#fff0a0", "#b8ffea"];
        const bg = fx.node("", { cls: "fx-filter", style: { background: set[0], mixBlendMode: "multiply", opacity: 0.8 } });
        const tune = [["E4", 2], ["G4", 1], ["A4", 1], ["B4", 2], ["A4", 1], ["G4", 1], ["E4", 2], ["D4", 2], ["E4", 4]];
        fx.seq(tune, { type: "sine", vol: 0.12, beat: 0.28, vibrato: [5, 6] });
        fx.chord(["E3", "B3"], 5, { type: "triangle", vol: 0.04 });
        for (let i = 1; i < 5; i++) {
          await fx.wait(900);
          bg.style.background = set[i % 4];
          fx.click({ freq: 700, vol: 0.5 });
        }
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 60 100", '<path d="M30 4 C44 4 46 16 44 24 L48 90 H12 L16 24 C14 16 16 4 30 4 Z" fill="#dfe6f0" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="16" r="8" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M20 10 H40" stroke="#1d1a18" stroke-width="3"/>'), r.x, r.y, { size: 60, h: 100, ms: 1800 });
        fx.caption("(the drifter walks alone)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Manos: The Hands of Fate
    {
      id: 22293,
      y: 1966,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(.7) contrast(1.3) brightness(.8) blur(.6px)", 6400, { fade: 300 });
        const master = fx.put(A.S("0 0 120 80", '<path d="M10 70 C10 20 110 20 110 70 Z" fill="#1d1a18"/><path d="M28 50 L20 30 L34 44 L44 20 L50 44 L60 16 L66 44 L78 22 L82 46 L96 32 L90 54" fill="#b3402d" stroke="#1d1a18" stroke-width="2"/><circle cx="60" cy="10" r="8" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M54 6 C56 14 64 14 66 6" stroke="#1d1a18" stroke-width="3"/>'),
          W() / 2, H() * 0.35, { size: 180, h: 120 });
        void master;
        const tune = [["G4", 1], ["F4", 1], ["G4", 2], ["Bb4", 1], ["A4", 1], ["F4", 2]];
        fx.seq(tune.concat(tune), { type: "triangle", vol: 0.08, beat: 0.3, detune: 30 });
        for (let i = 0; i < 4; i++) {
          fx.noise(0.2, { freq: 400, vol: 0.2, at: 0.6 + i * 0.9 });
          fx.later(600 + i * 900, () => jump(fx, fx.rand(-20, 20), fx.rand(-12, 12)));
        }
        await fx.wait(2600);
        const tor = A.S("0 0 50 90", '<path d="M16 20 C10 40 12 70 16 88 H34 C38 70 40 40 34 20 Z" fill="#6a5d50"/><circle cx="25" cy="12" r="10" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><ellipse cx="14" cy="60" rx="10" ry="16" fill="#6a5d50"/><ellipse cx="36" cy="60" rx="10" ry="16" fill="#6a5d50"/>');
        fx.caption("(Torgo takes care of the place while the Master is away)", { style: "subtitle", ms: 2600, css: { fontSize: "13px" } });
        await fx.fly(tor, [W() + 40, H() - 80], [-40, H() - 80], { size: 50, h: 90, dur: 3400, easing: "steps(14)", flip: true });
      }
    },

    // Django (1966)
    {
      id: 10772,
      y: 1966,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(.8) contrast(1.2) brightness(.9)", 6400, { fade: 400 });
        fx.wash("linear-gradient(transparent 60%, rgba(90,70,50,.8))", 6400, { fade: 600 });
        const coffin = A.S("0 0 40 100", '<path d="M10 2 H30 L38 24 L30 98 H10 L2 24 Z" fill="#5a3a22" ' + A.ink + ' stroke-width="2"/><path d="M20 20 V60 M12 32 H28" stroke="#8a6a4a" stroke-width="3"/>');
        const man = A.S("0 0 40 90", '<path d="M8 12 H32 L28 4 H12 Z M4 14 H36" fill="#1d1a18" stroke="#1d1a18" stroke-width="3"/><circle cx="20" cy="20" r="6" fill="#f2d6b3"/><path d="M10 28 H30 L32 70 H8 Z" fill="#1d1a18"/><path d="M12 70 L10 88 M28 70 L30 88" stroke="#1d1a18" stroke-width="5"/><path d="M30 30 L38 26" stroke="#5a3a22" stroke-width="3"/>');
        const y = H() - 110;
        fx.fly(coffin, [W() + 90, y + 20], [W() * 0.35, y + 24], { size: 40, h: 100, dur: 4200, r0: -70, r2: -70, easing: "steps(20)", keep: true });
        fx.fly(man, [W() + 40, y], [W() * 0.35 + 50, y], { size: 44, h: 99, dur: 4200, easing: "steps(20)", keep: true, flip: true });
        const tune = [["A4", 2], ["C5", 1], ["E5", 1], ["D5", 3], ["C5", 1], ["B4", 2], ["A4", 2], ["E4", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { freq: 1400 }, vibrato: [5, 6] });
        for (let t = 0; t < 4.2; t += 0.7) fx.noise(0.3, { freq: 300, vol: 0.2, at: t });
        await fx.wait(4400);
        fx.noise(0.25, { freq: 2200, vol: 0.9 });
        fx.noise(0.25, { freq: 2200, vol: 0.9, at: 0.12 });
        fx.noise(0.25, { freq: 2200, vol: 0.9, at: 0.24 });
        fx.buzz([30, 90, 30, 90, 30]);
        fx.flash("#fff7d6", 120);
        await fx.wait(1600);
      }
    },

    // Blow-Up
    {
      id: 1052,
      y: 1966,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        fx.style(s, { position: "relative", zIndex: "50" }, 6400);
        fx.filter("saturate(.4)", 6400, { fade: 300 });
        const shots = [1.5, 2.4, 3.6, 5];
        for (const k of shots) {
          fx.noise(0.18, { type: "highpass", freq: 3500, vol: 0.4 });
          fx.click({ freq: 1500, vol: 0.5, at: 0.12 });
          fx.flash("rgba(255,255,255,.7)", 120);
          if (s) {
            s.style.transition = "transform .6s, filter .6s";
            fx.style(s, { transform: "scale(" + k + ")", filter: "grayscale(1) contrast(" + (1 + k * 0.4) + ") blur(" + (k - 1) * 0.5 + "px)" });
          }
          await fx.wait(900);
        }
        const circle = fx.put('<div style="width:100%;height:100%;border:3px solid #e0201c;border-radius:50%"></div>', r.x + 10, r.y - 10, { size: 36 });
        fx.move(circle, [{ transform: "scale(2)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
        fx.caption("(is that… a gun?)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        if (s) s.style.transition = "";
        fx.style(s, { transform: "none" });
        for (let i = 0; i < 3; i++) fx.noise(0.12, { type: "highpass", freq: 6000, vol: 0.06, at: i * 0.5 });
        fx.caption("(tennis without a ball)", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Persona
    {
      id: 797,
      y: 1966,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.1)");
        const burn = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 50%, #fff 0, #fff 10%, rgba(255,255,255,0) 11%)", opacity: 0 } });
        fx.tone(60, 0.6, { type: "sawtooth", vol: 0.12, filter: { freq: 300 } });
        fx.noise(0.6, { type: "highpass", freq: 3000, vol: 0.3 });
        A.projector(fx, 1);
        fx.anim(burn, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 900 });
        await fx.wait(1000);
        const s = fx.slot();
        const r = fx.rect(s);
        const img = s && s.querySelector("img");
        if (img) {
          const half = fx.put('<div style="width:100%;height:100%;background:url(' + img.src + ') center/cover;transform:scaleX(-1);clip-path:inset(0 50% 0 0)"></div>', r.x, r.y, { size: r.width, h: r.height });
          fx.anim(half, [{ opacity: 0 }, { opacity: 0.9 }], { duration: 1200, fill: "forwards" });
        } else {
          fx.style(s, { transform: "scaleX(-1)" }, 4000);
        }
        fx.chord(["C4", "C#4"], 3.4, { type: "sine", vol: 0.05, attack: 0.8 });
        fx.caption("Nothing.", { style: "subtitle", ms: 1400 });
        await fx.wait(2000);
        fx.caption("(nothing at all)", { style: "whisper", ms: 1400 });
        await fx.wait(1800);
      }
    },

    // Andrei Rublev
    {
      id: 895,
      y: 1966,
      run: async (fx) => {
        const grey = bw(fx, 5200);
        const bell = fx.put(A.S("0 0 120 110", '<path d="M60 4 V16" ' + A.ink + ' stroke-width="4"/><path d="M20 90 C20 40 36 16 60 16 C84 16 100 40 100 90 L110 100 H10 Z" fill="#6d5a3a" ' + A.ink + '/><path d="M24 70 H96" stroke="#8a7a52" stroke-width="3"/><circle cx="60" cy="100" r="8" fill="#3b3530"/>'),
          W() / 2, -80, { size: 160, h: 146 });
        await fx.move(bell, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.35 + 80) + "px)" }], { duration: 2400, easing: "ease-out" });
        const peal = [98, 196, 247, 294, 392, 523];
        peal.forEach((f, i) => fx.tone(f, 4.5 - i * 0.4, { type: "sine", vol: 0.14 / (i + 1) + 0.02, attack: 0.005 }));
        fx.tone(98 * 2.4, 3, { type: "sine", vol: 0.05 });
        fx.noise(0.3, { freq: 900, vol: 0.4 });
        fx.buzz([300]);
        fx.move(bell, [{ transform: "translateY(" + (H() * 0.35 + 80) + "px) rotate(-6deg)" }, { transform: "translateY(" + (H() * 0.35 + 80) + "px) rotate(6deg)" }, { transform: "translateY(" + (H() * 0.35 + 80) + "px)" }], 1200);
        fx.later(900, () => fx.anim(grey, [{ opacity: 1 }, { opacity: 0 }], { duration: 1600, fill: "forwards" }));
        await fx.wait(3000);
      }
    },

    // Branded to Kill
    {
      id: 17905,
      y: 1967,
      run: async (fx) => {
        bw(fx, 6000, " contrast(1.5)");
        const r = fx.rect(fx.slot());
        const pot = fx.put(A.S("0 0 60 60", '<path d="M8 20 H52 L48 50 C48 56 12 56 12 50 Z" fill="#e8e4da" ' + A.ink + '/><path d="M4 20 H56" ' + A.ink + ' stroke-width="4"/>'), r.x + 70, r.y + 30, { size: 60 });
        void pot;
        fx.particles({ kind: "rise", from: pt(r.x + 70, r.y, 30, 10), count: 10, glyphs: dot("rgba(240,240,240,.7)"), min: 10, max: 22, dur: 1500, stagger: 1600 });
        fx.caption("(he sniffs the rice)", { style: "whisper", ms: 1600 });
        fx.tone(700, 0.4, { type: "sine", vol: 0.06, slide: 900 });
        fx.tone(900, 0.4, { type: "sine", vol: 0.06, slide: 700, at: 0.5 });
        await fx.wait(1800);
        const moth = fx.put(A.moth, r.x, r.y, { size: 80, h: 60 });
        fx.noise(1.6, { type: "bandpass", freq: 300, q: 5, vol: 0.2 });
        await fx.move(moth, [{ transform: "none" }, { transform: "translate(20px,-30px) rotate(10deg)" }, { transform: "translate(-10px,-10px) rotate(-10deg)" }, { transform: "none" }], 1600);
        fx.noise(0.2, { freq: 2600, vol: 0.9 });
        fx.flash("#fff", 100);
        fx.caption("Number One.", { style: "card", ms: 1400 });
        await fx.wait(1500);
      }
    },

    // Playtime
    {
      id: 10227,
      y: 1967,
      run: async (fx) => {
        const cool = fx.filter("grayscale(.6) brightness(1.06) hue-rotate(-10deg)", 6600, { fade: 300 });
        void cool;
        fx.wash("rgba(170,190,205,.25)", 6600, { fade: 400 });
        const rg = fx.rect(fx.$("#grid"));
        const glass = fx.glass('<div style="position:absolute;inset:0;background:linear-gradient(105deg, transparent 30%, rgba(255,255,255,.55) 38%, transparent 46%)"></div>', { ms: 6600 });
        if (glass && !fx.reduced) fx.anim(glass.firstChild, [{ transform: "translateX(-100%)" }, { transform: "translateX(100%)" }], { duration: 2000, iterations: 2 });
        const tile = fx.put(A.S("0 0 70 90", '<path d="M8 90 V10 H62 V90" fill="none" stroke="#6d7478" stroke-width="3"/><path d="M8 10 L35 2 L62 10" fill="none" stroke="#6d7478" stroke-width="3"/>'), rg.x, rg.top + rg.height + 40, { size: 70, h: 90, style: { transformOrigin: "50% 100%" } });
        void tile;
        fx.chord(["C4", "E4", "G4", "B4"], 1.5, { type: "sine", vol: 0.06 });
        for (let t = 0; t < 3; t += 0.35) fx.click({ freq: 5500, vol: 0.12, at: 1 + t });
        const hulot = A.S("0 0 40 90", '<path d="M14 6 H26 L28 12 H12 Z M8 12 H32" fill="#6b4a2a" stroke="#6b4a2a" stroke-width="2"/><rect x="12" y="16" width="16" height="42" fill="#8a7a62"/><path d="M26 30 L36 50" stroke="#1d1a18" stroke-width="2.5"/><path d="M16 58 L12 88 M24 58 L30 88" stroke="#1d1a18" stroke-width="3"/>');
        fx.later(1400, () => fx.fly(hulot, [-30, H() - 80], [W() + 30, H() - 80], { size: 40, h: 90, dur: 4200, easing: "steps(24)" }));
        fx.later(3200, () => { fx.style(fx.$(".reely"), { transform: "translateX(-4px)" }, 400); fx.thud({ freq: 200, vol: 0.3 }); fx.tone(3000, 0.3, { type: "sine", vol: 0.06, at: 0.05 }); });
        await fx.wait(6000);
      }
    },

    // Wavelength
    {
      id: 88421,
      y: 1967,
      run: async (fx) => {
        const s = A.liftSlot(fx, 9000);
        const r = fx.rect(s);
        fx.filter("saturate(.7) sepia(.2)", 9000, { fade: 400 });
        fx.tone(50, 8.4, { type: "sine", slide: 12000, vol: 0.08, attack: 0.5 });
        fx.tone(52, 8.4, { type: "sine", slide: 12500, vol: 0.04, attack: 0.5 });
        const cx = W() / 2 - r.x, cy = H() / 2 - r.y;
        const zoom = Math.max(W() / r.width, H() / r.height) * 1.05;
        if (!fx.reduced) {
          await fx.anim(s, [{ transform: "none" }, { transform: "translate(" + cx + "px," + cy + "px) scale(" + zoom + ")" }], { duration: 8000, easing: "linear" });
        } else {
          for (let i = 0; i < 4; i++) { fx.style(s, { outline: (i + 1) * 6 + "px solid rgba(255,255,255,.4)" }); await fx.wait(2000); }
        }
        fx.flash("#fff", 300);
        await fx.wait(300);
      },
      maxMs: 12000
    },

    // Belle de Jour
    {
      id: 649,
      y: 1967,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(255,240,245,.25), rgba(255,210,220,.25))", 6400, { fade: 600 });
        for (let t = 0; t < 5; t += 0.6) {
          fx.tone(2600, 0.25, { type: "sine", vol: 0.06, at: t });
          fx.tone(3200, 0.2, { type: "sine", vol: 0.04, at: t + 0.1 });
        }
        for (let t = 0; t < 5; t += 0.3) fx.thud({ freq: 120, vol: 0.15, dur: 0.1, at: t });
        const carriage = A.S("0 0 140 70", '<path d="M40 16 H100 C110 16 112 24 112 34 V46 H30 V30 C30 22 34 16 40 16 Z" fill="#6b1d2a" ' + A.ink + '/><rect x="56" y="22" width="22" height="14" fill="rgba(220,235,245,.7)"/><circle cx="46" cy="56" r="10" fill="none" ' + A.ink + '/><circle cx="100" cy="56" r="10" fill="none" ' + A.ink + '/>' +
          '<path d="M112 36 L130 34" ' + A.ink + '/><path d="M126 28 C128 22 138 22 138 30 L136 50 H128 Z" fill="#6d665c"/>');
        await fx.fly(carriage, [-150, H() - 100], [W() + 150, H() - 100], { size: 150, h: 75, dur: 5000, easing: "linear" });
        fx.caption("(was it a daydream?)", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Yellow Submarine
    {
      id: 12105,
      y: 1968,
      run: async (fx) => {
        const cols = ["#ff3b7a", "#ffd23b", "#3bd1ff", "#7aff3b", "#b33bff"];
        fx.wash("linear-gradient(135deg, rgba(255,60,120,.25), rgba(60,210,255,.25), rgba(255,210,60,.25))", 6600, { fade: 500 });
        const sub = A.S("0 0 140 70", '<ellipse cx="68" cy="42" rx="56" ry="20" fill="#ffd23b" ' + A.ink + '/><path d="M58 22 V8 H80 V22" fill="#ffd23b" ' + A.ink + '/><path d="M68 8 V0 H78" ' + A.ink + ' fill="none"/><circle cx="40" cy="42" r="6" fill="#bfe8ff" ' + A.ink + ' stroke-width="2"/><circle cx="62" cy="42" r="6" fill="#bfe8ff" ' + A.ink + ' stroke-width="2"/><circle cx="84" cy="42" r="6" fill="#bfe8ff" ' + A.ink + ' stroke-width="2"/><path d="M124 42 L138 30 V54 Z" fill="#ff3b7a" ' + A.ink + ' stroke-width="2"/>');
        fx.particles({ kind: "rise", count: 24, glyphs: A.bubble, min: 8, max: 18, dur: 3200, stagger: 3400 });
        fx.particles({ kind: "drift", count: 20, glyphs: cols.map((c) => A.star(c)), min: 10, max: 20, dur: 2600, stagger: 3000 });
        const bounce = [["G4", 1], ["C5", 1], ["E5", 1], ["C5", 1], ["G4", 1], ["C5", 1], ["E5", 2], ["F5", 1], ["E5", 1], ["D5", 1], ["C5", 1], ["D5", 4]];
        fx.seq(bounce, { type: "square", vol: 0.05, beat: 0.2, filter: { freq: 2200 } });
        fx.seq([["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["G2", 2], ["D3", 2], ["G2", 4]], { type: "triangle", vol: 0.08, beat: 0.2 });
        fx.later(3400, () => { for (let i = 0; i < 4; i++) fx.tone(900, 0.4, { type: "sine", vol: 0.08, slide: 400, at: i * 0.15 }); });
        await fx.fly(sub, [-160, H() * 0.55], [W() + 160, H() * 0.35], { size: 150, h: 75, dur: 5200, via: [W() / 2, H() * 0.6], r0: -6, r1: 6, r2: -8, easing: "ease-in-out" });
      }
    },

    // Night of the Living Dead (1968)
    {
      id: 10331,
      y: 1968,
      run: async (fx) => {
        bw(fx, 6400, " contrast(1.35) brightness(.9)");
        fx.node("", { cls: "fx-filter fx-grain", ms: 6400 });
        const boards = fx.otherSlots(false).slice(0, 10);
        fx.caption("They're coming to get you, Barbara…", { style: "subtitle", ms: 2200 });
        fx.tone(90, 2, { type: "sawtooth", vol: 0.06, filter: { freq: 300 }, attack: 0.5 });
        await fx.wait(1400);
        for (const s of boards) {
          const rr = fx.rect(s);
          const plank = fx.put(box("background:repeating-linear-gradient(90deg,#8a7a62 0 6px,#7a6a52 6px 12px);border:2px solid #1d1a18;border-radius:2px"), rr.x, rr.y, { size: rr.width * 1.2, h: 16, style: { transform: "rotate(" + fx.rand(-25, 25) + "deg)" } });
          void plank;
          fx.thud({ freq: 150, vol: 0.5, dur: 0.12 });
          fx.click({ freq: 3500, vol: 0.4, at: 0.05 });
          fx.buzz(15);
          await fx.wait(220);
        }
        const hands = fx.particles({ kind: "rise", area: pt(W() / 2, H() + 20, W(), 10), count: 10, glyphs: A.S("0 0 30 60", '<path d="M10 60 V24 L6 8 L10 6 L14 20 L14 4 H18 L18 20 L22 6 L26 8 L22 24 V60 Z" fill="#8a8a80" ' + A.ink + ' stroke-width="2"/>'), min: 30, max: 44, dur: 2400, stagger: 800 });
        await hands;
      }
    },

    // Once Upon a Time in the West
    {
      id: 335,
      y: 1968,
      run: async (fx) => {
        fx.filter("sepia(.45) saturate(1.3)", 7400, { fade: 300 });
        const r = fx.rect(fx.slot());
        fx.letterbox(7400, "14vh");
        const eyes = fx.node(A.S("0 0 400 60", '<rect width="400" height="60" fill="#c49a6a"/><path d="M60 30 C100 10 150 10 180 30 C150 50 100 50 60 30 Z M220 30 C250 10 300 10 340 30 C300 50 250 50 220 30 Z" fill="#f4efe2"/><circle cx="120" cy="30" r="13" fill="#3a5a6a"/><circle cx="280" cy="30" r="13" fill="#3a5a6a"/><circle cx="120" cy="30" r="6" fill="#0d0b09"/><circle cx="280" cy="30" r="6" fill="#0d0b09"/>'),
          { style: { position: "absolute", left: 0, right: 0, top: "40%", height: "14vh", opacity: 0 } });
        eyes.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(eyes.firstChild.style, { width: "100%", height: "100%" });
        fx.noise(7, { type: "bandpass", freq: 900, q: 1, vol: 0.08, attack: 1 });
        const creak = (at) => fx.tone(fx.rand(300, 420), 0.7, { type: "sawtooth", vol: 0.04, slide: fx.rand(200, 500), at, filter: { type: "bandpass", freq: 900, q: 6 } });
        creak(0.4); creak(1.8); creak(3.1);
        fx.later(1200, () => { fx.noise(0.9, { type: "bandpass", freq: 2400, q: 12, vol: 0.12 }); });
        await fx.wait(2400);
        fx.anim(eyes, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, fill: "forwards" });
        const harm = [["A4", 3], ["G4", 1], ["F4", 2], ["E4", 6]];
        fx.seq(harm, { type: "sawtooth", vol: 0.06, beat: 0.4, filter: { type: "bandpass", freq: 1500, q: 2 }, vibrato: [6, 12] });
        fx.seq(harm, { type: "square", vol: 0.03, beat: 0.4, detune: 12, filter: { freq: 1800 } });
        await fx.wait(3000);
        fx.noise(0.25, { freq: 2500, vol: 0.9 });
        fx.flash("#fff7d6", 100);
        fx.buzz(50);
        await fx.wait(1200);
        void r;
      }
    },

    // The Color of Pomegranates
    {
      id: 26302,
      y: 1969,
      run: async (fx) => {
        const tab = fx.node("", { cls: "fx-filter", style: { background: "#e9dfc8", opacity: 0.94 } });
        void tab;
        const items = [
          A.S("0 0 60 60", '<circle cx="30" cy="34" r="22" fill="#b3122a" ' + A.ink + ' stroke-width="2"/><path d="M24 12 L30 4 L36 12" fill="#b3122a" ' + A.ink + ' stroke-width="2"/><path d="M30 34 L20 22 M30 34 L40 22" stroke="#6b0a18" stroke-width="2"/>'),
          A.S("0 0 60 60", '<path d="M30 6 C40 20 50 40 30 56 C10 40 20 20 30 6 Z" fill="#1f4fd5" ' + A.ink + ' stroke-width="2"/>'),
          A.S("0 0 60 60", '<rect x="10" y="10" width="40" height="40" fill="#f2c94c" ' + A.ink + ' stroke-width="2"/><path d="M10 30 H50 M30 10 V50" stroke="#1d1a18" stroke-width="2"/>'),
          A.S("0 0 60 60", '<path d="M8 50 C20 10 40 10 52 50 Z" fill="#fff" ' + A.ink + ' stroke-width="2"/>')
        ];
        const pos = [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]];
        for (let i = 0; i < 4; i++) {
          fx.put(items[i], W() * pos[i][0], H() * pos[i][1], { size: 80 });
          fx.chord([["D4", "A4"], ["C4", "G4"], ["Bb3", "F4"], ["A3", "E4"]][i], 1.4, { type: "sawtooth", vol: 0.04, filter: { freq: 700 }, vibrato: [4, 6] });
          fx.thud({ freq: 60, vol: 0.2, dur: 0.3 });
          await fx.wait(1100);
        }
        fx.particles({ kind: "burst", from: pt(W() * 0.3, H() * 0.3), count: 16, spread: 50, gravity: 100, glyphs: dot("#b3122a"), min: 4, max: 8, dur: 1600, stagger: 0 });
        fx.noise(0.6, { freq: 700, vol: 0.2 });
        await fx.wait(1600);
      }
    }
  ]);
})();
