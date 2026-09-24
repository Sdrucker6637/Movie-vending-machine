/* Machine FX cues - the seventies: new Hollywood, euro-horror, art-house and the midnight movie.
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
  const fullSvg = (fx, svg, style) => {
    const el = fx.node(svg, { cls: "fx-filter", style });
    const s = el.firstChild;
    if (s && s.setAttribute) { s.setAttribute("preserveAspectRatio", "none"); s.style.width = s.style.height = "100%"; }
    return el;
  };
  const seventies = (fx, ms) => fx.filter("sepia(.25) saturate(1.25) contrast(1.05)", ms, { fade: 400 });

  M.register([
    // Two-Lane Blacktop
    {
      id: 27236,
      y: 1971,
      run: async (fx) => {
        seventies(fx, 6000);
        const road = fullSvg(fx, A.S("0 0 400 300", '<path d="M170 0 H230 L400 300 H0 Z" fill="rgba(40,40,40,.55)"/><path class="dash" d="M200 0 V300" stroke="#f2c94c" stroke-width="4" stroke-dasharray="20 24"/>'));
        const dash = road.querySelector(".dash");
        fx.tone(70, 5, { type: "sawtooth", vol: 0.08, filter: { freq: 260 }, attack: 0.4, vibrato: [18, 3] });
        fx.tone(140, 5, { type: "square", vol: 0.02, filter: { freq: 400 }, attack: 0.4 });
        await fx.tween(4600, (k) => { if (dash) dash.style.strokeDashoffset = -k * 1400; });
        const r = fx.rect(fx.slot());
        const burn = fx.put(box("background:radial-gradient(circle, #fff 0, #ffcf5a 20%, #b3402d 40%, transparent 60%)"), r.x, r.y, { size: r.width * 1.1, h: r.height * 1.1 });
        fx.noise(0.8, { type: "highpass", freq: 1500, vol: 0.4 });
        fx.tone(60, 0.8, { type: "sawtooth", vol: 0.1, slide: 30 });
        await fx.move(burn, [{ transform: "scale(.1)", opacity: 1 }, { transform: "scale(1.5)", opacity: 0 }], 800);
        fx.caption("(the film burns up in the gate)", { style: "whisper", ms: 1200 });
        await fx.wait(1000);
      }
    },

    // Cries and Whispers
    {
      id: 10238,
      y: 1972,
      run: async (fx) => {
        const red = fx.node("", { cls: "fx-filter", style: { background: "#8a0a14", opacity: 0 } });
        fx.anim(red, [{ opacity: 0 }, { opacity: 0.8 }], { duration: 1200, fill: "forwards" });
        for (let i = 0; i < 12; i++) fx.click({ freq: 1500, vol: 0.12, at: i * 0.5 });
        const whispers = ["…Agnes…", "…Maria…", "…Karin…", "…Anna…"];
        for (let i = 0; i < whispers.length; i++) {
          fx.caption(whispers[i], { style: "whisper", ms: 1100, css: { color: "rgba(255,230,230,.85)", bottom: 20 + i * 8 + "vh" } });
          fx.noise(0.9, { type: "bandpass", freq: 2400, q: 2, vol: 0.08, pan: i % 2 ? 0.8 : -0.8 });
          await fx.wait(1000);
        }
        await fx.anim(red, [{ opacity: 0.8 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
        await fx.anim(red, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, fill: "forwards" });
      }
    },

    // The Discreet Charm of the Bourgeoisie
    {
      id: 4593,
      y: 1972,
      run: async (fx) => {
        seventies(fx, 7000);
        const road = fx.wash("linear-gradient(transparent 70%, rgba(80,80,70,.4))", 7000, { fade: 400 });
        void road;
        const walker = A.S("0 0 30 60", '<circle cx="15" cy="7" r="6" fill="#1d1a18"/><path d="M6 14 H24 L22 40 H8 Z" fill="#2d3b55"/><path d="M8 40 L6 58 M22 40 L24 58" stroke="#1d1a18" stroke-width="4"/>');
        for (let i = 0; i < 6; i++) fx.fly(walker, [-30 - i * 36, H() - 70], [W() * 0.55 - i * 36, H() - 70], { size: 26, h: 52, dur: 4000, easing: "linear" });
        await fx.wait(4200);
        fx.caption("Dinner is served.", { style: "card", ms: 1200 });
        fx.chord(["C5", "E5", "G5"], 0.8, { type: "sine", vol: 0.06 });
        await fx.wait(1200);
        const curtain = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(90deg,#8a0a14 0 50%, #7a0a12 50%)", transform: "translateY(-100%)" } });
        await fx.move(curtain, [{ transform: "translateY(-100%)" }, { transform: "none" }], 700);
        fx.noise(1, { freq: 1500, vol: 0.3, attack: 0.05 });
        fx.caption("(an audience is watching)", { style: "whisper", ms: 1200, css: { color: "#fff" } });
        await fx.wait(1200);
        fx.remove(curtain);
      }
    },

    // Aguirre, the Wrath of God
    {
      id: 2000,
      y: 1972,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("linear-gradient(rgba(220,230,210,.4), rgba(90,70,40,.5))", 7000, { fade: 600, blend: "multiply" });
        fx.chord(["D4", "A4", "D5", "F5"], 6, { type: "sine", vol: 0.05, attack: 2, vibrato: [4, 5] });
        fx.chord(["D3", "A3"], 6, { type: "sawtooth", vol: 0.02, attack: 2, filter: { freq: 500 } });
        const raft = A.S("0 0 120 50", '<path d="M4 34 H116 L110 44 H10 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M60 34 V4" stroke="#6b4a2a" stroke-width="3"/><path d="M30 34 V22 M44 34 V18 M78 34 V20" stroke="#1d1a18" stroke-width="5"/>');
        const r = fx.put(raft, W() / 2, H() * 0.7, { size: 150, h: 62 });
        fx.move(r, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }, { transform: "rotate(200deg)" }, { transform: "rotate(360deg)" }], { duration: 6000, easing: "linear" });
        for (let i = 0; i < 14; i++) {
          fx.later(1500 + i * 220, () => {
            const x = W() / 2 + fx.rand(-70, 70);
            fx.fly(A.S("0 0 30 30", '<circle cx="12" cy="16" r="9" fill="#8a7a62"/><circle cx="20" cy="10" r="5" fill="#8a7a62"/><path d="M8 22 L4 30 M16 24 L18 30" stroke="#8a7a62" stroke-width="2"/>'), [fx.rand(0, W()), -20], [x, H() * 0.66], { size: 18, dur: 700, keep: true });
            fx.tone(fx.rand(1200, 2000), 0.12, { type: "square", vol: 0.04, slide: fx.rand(800, 2400) });
          });
        }
        await fx.wait(5000);
        fx.caption("I am the Wrath of God.", { style: "subtitle", ms: 1800 });
        await fx.wait(1600);
      }
    },

    // Solaris (1972)
    {
      id: 593,
      y: 1972,
      run: async (fx) => {
        const ocean = fullSvg(fx, A.S("0 0 400 300", '<defs><radialGradient id="so" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#4a6a5a"/><stop offset="1" stop-color="#0d1a14"/></radialGradient></defs><rect width="400" height="300" fill="url(#so)"/>' +
          Array.from({ length: 12 }, (_, i) => '<ellipse cx="' + (20 + i * 34) + '" cy="' + (150 + (i * 47) % 120) + '" rx="' + (30 + (i * 13) % 40) + '" ry="' + (8 + (i * 7) % 14) + '" fill="rgba(200,230,210,.15)"/>').join("")), { opacity: 0 });
        fx.anim(ocean, [{ opacity: 0 }, { opacity: 0.88 }], { duration: 1600, fill: "forwards" });
        if (!fx.reduced) fx.anim(ocean.firstChild, [{ transform: "scale(1)" }, { transform: "scale(1.15) rotate(3deg)" }], { duration: 6000, fill: "forwards" });
        fx.tone(62, 6, { type: "sine", vol: 0.12, attack: 2, vibrato: [0.2, 4] });
        fx.chord(["F4", "Ab4", "C5"], 5, { type: "sine", vol: 0.03, attack: 2.5 });
        fx.noise(6, { freq: 400, vol: 0.06, attack: 2 });
        await fx.wait(3000);
        const r = fx.rect(fx.slot());
        const house = fx.put(A.S("0 0 60 50", '<path d="M6 24 L30 6 L54 24 V46 H6 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><rect x="24" y="30" width="10" height="16" fill="#ffcf5a"/>'), r.x, r.y, { size: 70, h: 58 });
        fx.anim(house, [{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "none" }], 1500);
        fx.caption("(an island of memory)", { style: "whisper", ms: 2200, css: { color: "#dfe" } });
        await fx.wait(2600);
      }
    },

    // The Holy Mountain
    {
      id: 8327,
      y: 1973,
      run: async (fx) => {
        const cx = W() / 2, cy = H() * 0.4;
        const tri = fx.put(A.S("0 0 120 110", '<path d="M60 4 L116 104 H4 Z" fill="none" stroke="#f2c94c" stroke-width="4"/><circle cx="60" cy="68" r="16" fill="none" stroke="#f2c94c" stroke-width="3"/><circle cx="60" cy="68" r="5" fill="#f2c94c"/>'), cx, cy, { size: 160, h: 146 });
        const cols = ["#e0201c", "#2d7dd2", "#f2c94c", "#3aa655", "#b33bff"];
        fx.wash("radial-gradient(circle at 50% 40%, rgba(255,255,255,.4), rgba(20,10,40,.7))", 6400, { fade: 500 });
        fx.move(tri, [{ transform: "rotate(0) scale(.6)" }, { transform: "rotate(360deg) scale(1)" }], { duration: 3000, easing: "ease-out" });
        fx.chord(["C3", "G3", "C4", "E4", "G4"], 4, { type: "sawtooth", vol: 0.03, attack: 1, filter: { freq: 1200 } });
        for (let i = 0; i < 8; i++) fx.tone(fx.pick(["C5", "E5", "G5", "B5"]), 1.4, { type: "sine", vol: 0.05, at: 0.5 + i * 0.4 });
        await fx.wait(3200);
        fx.particles({ kind: "burst", from: pt(cx, cy), count: 30, glyphs: cols.map((c) => A.sparkle(c)), min: 8, max: 18, spread: 100, dur: 1400, stagger: 400 });
        fx.caption("Zoom back, camera!", { style: "card", ms: 1600 });
        if (!fx.reduced) await fx.page([{ transform: "scale(1)" }, { transform: "scale(.82)" }], { duration: 1400, easing: "ease-in" });
        fx.caption("Real life awaits us.", { style: "subtitle", ms: 1400 });
        await fx.wait(1200);
        if (!fx.reduced) await fx.page([{ transform: "scale(.82)" }, { transform: "none" }], { duration: 300 });
      }
    },

    // Amarcord
    {
      id: 7857,
      y: 1973,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.particles({ kind: "drift", count: 40, glyphs: A.S("0 0 20 20", '<circle cx="10" cy="10" r="3" fill="#fff"/><path d="M10 2 V18 M2 10 H18 M4 4 L16 16 M16 4 L4 16" stroke="rgba(255,255,255,.7)" stroke-width="1"/>'), min: 10, max: 18, dur: 3600, stagger: 3000 });
        const tune = [["A4", 1], ["C5", 1], ["E5", 1], ["A5", 2], ["G5", 1], ["F5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["B4", 2], ["A4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.28 });
        fx.seq(tune.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "square", vol: 0.025, beat: 0.28, filter: { freq: 900 } });
        await fx.wait(3000);
        const ship = A.S("0 0 200 80", '<path d="M10 56 H190 L176 74 H26 Z" fill="#1d1a18"/><rect x="40" y="36" width="120" height="20" fill="#f4f0e6"/>' + Array.from({ length: 12 }, (_, i) => '<circle cx="' + (48 + i * 10) + '" cy="46" r="2.5" fill="#ffcf5a"/>').join("") + '<rect x="70" y="16" width="14" height="20" fill="#b3402d"/><rect x="110" y="16" width="14" height="20" fill="#b3402d"/>');
        fx.caption("The Rex!", { style: "hand", ms: 1400 });
        fx.tone(98, 1.4, { type: "sawtooth", vol: 0.12, filter: { freq: 400 } });
        fx.tone(147, 1.4, { type: "sawtooth", vol: 0.08, filter: { freq: 400 } });
        await fx.fly(ship, [W() + 120, H() * 0.55], [-120, H() * 0.55], { size: 240, h: 96, dur: 4000 });
      }
    },

    // The Spirit of the Beehive
    {
      id: 4495,
      y: 1973,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(255,210,120,.35), rgba(200,140,40,.4))", 6600, { fade: 800, blend: "multiply" });
        const hex = fx.node(A.S("0 0 120 104", Array.from({ length: 30 }, (_, i) => { const c = i % 6, r = Math.floor(i / 6); const x = c * 20 + (r % 2) * 10, y = r * 18; return '<path d="M' + (x + 5) + " " + y + " h10 l5 9 l-5 9 h-10 l-5 -9 Z\" fill=\"rgba(255,200,80,.25)\" stroke=\"rgba(120,70,10,.6)\" stroke-width=\"1.5\"/>"; }).join("")),
          { cls: "fx-filter", style: { opacity: 0.8 } });
        hex.firstChild.setAttribute("preserveAspectRatio", "xMidYMid slice");
        Object.assign(hex.firstChild.style, { width: "100%", height: "100%" });
        fx.noise(6, { type: "bandpass", freq: 220, q: 6, vol: 0.2, attack: 1 });
        fx.tone(220, 6, { type: "sawtooth", vol: 0.02, vibrato: [30, 6], attack: 1 });
        fx.particles({ kind: "drift", count: 14, glyphs: A.S("0 0 20 14", '<ellipse cx="10" cy="8" rx="6" ry="4" fill="#d9a13a"/><path d="M6 6 L14 6" stroke="#1d1a18" stroke-width="2"/><ellipse cx="8" cy="3" rx="4" ry="3" fill="rgba(255,255,255,.7)"/>'), min: 10, max: 16, dur: 3000, stagger: 2400 });
        await fx.wait(3200);
        fx.caption("Soy Ana.", { style: "whisper", ms: 2400, css: { color: "#4a2a00" } });
        await fx.wait(2600);
      }
    },

    // Fantastic Planet
    {
      id: 16306,
      y: 1973,
      run: async (fx) => {
        const sky = fx.wash("linear-gradient(#9fd8d0, #3a8a9a)", 6400, { fade: 600, blend: "multiply", opacity: 0.6 });
        void sky;
        const hand = fx.put(A.S("0 0 200 200", '<path d="M20 200 C20 140 30 100 50 90 L60 20 C62 8 76 8 76 20 L80 80 L90 10 C92 -2 108 -2 108 10 L106 80 L120 20 C122 8 138 8 136 20 L128 90 L150 50 C156 40 170 46 164 58 L140 120 C130 160 120 200 120 200 Z" fill="#3aa0b0" ' + A.ink + ' stroke-width="3"/><circle cx="96" cy="130" r="10" fill="#e8f0f0" ' + A.ink + ' stroke-width="2"/>'),
          W() / 2, H() + 100, { size: 220 });
        const tune = [["E3", 2], ["G3", 1], ["A3", 1], ["B3", 2], ["D4", 2], ["B3", 2], ["A3", 2], ["E3", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.06, beat: 0.3, filter: { freq: 900 }, vibrato: [5, 4] });
        fx.chord(["E4", "B4"], 5, { type: "sine", vol: 0.04, attack: 1, vibrato: [6, 10] });
        for (let t = 0; t < 4.8; t += 0.3) fx.thud({ freq: 70, vol: 0.12, dur: 0.1, at: t });
        await fx.move(hand, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.55 + "px)" }], { duration: 2400, easing: "ease-out" });
        const r = fx.rect(fx.slot());
        const om = fx.put(A.S("0 0 20 30", '<circle cx="10" cy="7" r="5" fill="#e8d6c0" ' + A.ink + ' stroke-width="1.5"/><path d="M5 12 H15 L14 28 H6 Z" fill="#b3402d"/>'), r.x, r.y, { size: 16, h: 24 });
        fx.move(om, [{ transform: "none" }, { transform: "translateY(-30px)" }, { transform: "none" }], { duration: 400, iterations: 3 });
        fx.caption("(an Om, the Draags' tiny pet)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        fx.move(hand, [{ transform: "translateY(-" + H() * 0.55 + "px)" }, { transform: "none" }], 700);
        await fx.wait(700);
      }
    },

    // The Wicker Man (1973)
    {
      id: 16307,
      y: 1973,
      run: async (fx) => {
        const man = fx.put(A.S("0 0 100 160", '<g fill="none" stroke="#b08a4a" stroke-width="4"><circle cx="50" cy="20" r="14"/><path d="M36 36 H64 L70 100 H30 Z M30 40 L8 90 M70 40 L92 90 M36 100 L30 156 M64 100 L70 156"/>' +
          '<path d="M34 50 H66 M32 64 H68 M31 78 H69 M30 92 H70 M40 36 V100 M50 36 V100 M60 36 V100" stroke-width="2"/></g>'), W() / 2, H() * 0.45, { size: 140, h: 224 });
        const tune = [["D4", 1], ["F4", 1], ["G4", 2], ["A4", 1], ["G4", 1], ["F4", 2], ["D4", 2], ["C4", 2], ["D4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.1, beat: 0.3 });
        fx.seq(tune, { type: "sine", vol: 0.05, beat: 0.3, at: 0.02, detune: 700 });
        await fx.wait(2200);
        fx.caption("Sumer is icumen in…", { style: "subtitle", ms: 2600 });
        const g = man.querySelector("g");
        if (g) g.setAttribute("stroke", "#ffb347");
        fx.style(man, { filter: "drop-shadow(0 0 16px #ff7a1a)" });
        fx.noise(3.6, { freq: 1600, sweep: 4000, vol: 0.3, attack: 0.5 });
        fx.particles({ kind: "rise", from: pt(W() / 2, H() * 0.6, 120, 20), count: 50, glyphs: [dot("#ffb347"), dot("#ff5e1a"), dot("#fff0a0")], min: 3, max: 9, dur: 1600, stagger: 3000 });
        fx.wash("radial-gradient(circle at 50% 60%, rgba(255,120,30,.45), transparent 60%)", 3600, { fade: 600 });
        await fx.wait(3600);
      }
    },

    // F for Fake
    {
      id: 43003,
      y: 1973,
      run: async (fx) => {
        seventies(fx, 6400);
        const r = fx.rect(fx.slot());
        const key = fx.put(A.S("0 0 40 20", '<circle cx="8" cy="10" r="6" fill="none" stroke="#c9a24a" stroke-width="3"/><path d="M14 10 H38 M32 10 V16" stroke="#c9a24a" stroke-width="3"/>'), r.x, r.y, { size: 50, h: 24 });
        const cape = fx.put(box("background:#0d0b09;border-radius:50% 50% 0 0"), r.x, r.y, { size: r.width * 1.4, h: r.height * 1.3 });
        cape.style.opacity = 0;
        fx.seq([["C5", 1], ["Eb5", 1], ["G5", 1], ["Bb5", 2]], { type: "square", vol: 0.05, beat: 0.2, filter: { freq: 2000 } });
        await fx.wait(900);
        await fx.anim(cape, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" });
        fx.remove(key);
        fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.3 });
        await fx.anim(cape, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" });
        const coin = fx.put(A.coin("#c9a24a"), r.x, r.y, { size: 36 });
        fx.tone(2400, 0.4, { type: "sine", vol: 0.1 });
        await fx.move(coin, [{ transform: "rotateY(0)" }, { transform: "rotateY(720deg)" }], 800);
        fx.caption("For the next hour, everything you hear is the truth.", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
        fx.caption("(the hour ended 17 minutes ago)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Sleeper
    {
      id: 11561,
      y: 1973,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("linear-gradient(#eaf6ff, #cfe8f5)", 5600, { fade: 400, opacity: 0.35 });
        const orb = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 35%, #fff, #c0c8cc 50%, #6d7478)"></div>', r.x, r.y, { size: 50 });
        fx.tone(700, 0.5, { type: "sine", vol: 0.08, vibrato: [10, 40] });
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        await fx.move(orb, [{ transform: "none" }, { transform: "translate(" + (rr.x - r.x) + "px," + (rr.y - r.y) + "px)" }], { duration: 1200, easing: "ease-in-out" });
        fx.caption("(the Orb)", { style: "whisper", ms: 1200 });
        await fx.wait(600);
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["E5", 2], ["C5", 1], ["A4", 1], ["C5", 1], ["A4", 1], ["G4", 4]];
        fx.seq(tune, { type: "square", vol: 0.06, beat: 0.16, filter: { freq: 1800 } });
        fx.seq(tune.map(([n, l]) => [n.replace(/\d/, (d) => d - 2), l]), { type: "sawtooth", vol: 0.04, beat: 0.16, filter: { freq: 500 } });
        fx.move(reely, [{ transform: "none" }, { transform: "translateX(10px) rotate(8deg)" }, { transform: "translateX(-10px) rotate(-8deg)" }, { transform: "none" }], { duration: 500, iterations: 4 });
        fx.move(orb, [{ transform: "translate(" + (rr.x - r.x) + "px," + (rr.y - r.y) + "px)" }, { transform: "translate(" + (rr.x - r.x) + "px," + (rr.y - r.y - 20) + "px) scale(1.1)" }, { transform: "translate(" + (rr.x - r.x) + "px," + (rr.y - r.y) + "px)" }], { duration: 400, iterations: 5 });
        await fx.wait(2400);
      }
    },

    // Don't Look Now
    {
      id: 931,
      y: 1973,
      run: async (fx) => {
        fx.filter("saturate(.35) brightness(.8)", 6400, { fade: 500 });
        fx.wash("linear-gradient(rgba(20,40,50,.2), rgba(10,20,30,.5))", 6400, { fade: 500 });
        fx.noise(6, { freq: 400, vol: 0.06, attack: 1 });
        for (let i = 0; i < 5; i++) fx.noise(0.3, { type: "bandpass", freq: 800, q: 6, vol: 0.2, at: 0.4 + i * 1.1 });
        const coat = A.S("0 0 30 50", '<path d="M15 4 C22 4 24 10 22 14 L28 46 H2 L8 14 C6 10 8 4 15 4 Z" fill="#d51f2a"/><path d="M8 8 C10 2 20 2 22 8" fill="#d51f2a"/>');
        const spots = [[0.85, 0.3], [0.1, 0.6], [0.7, 0.8]];
        for (const [x, y] of spots) {
          const c = fx.put(coat, W() * x, H() * y, { size: 24, h: 40 });
          fx.anim(c, [{ opacity: 0 }, { opacity: 1 }, { opacity: 1 }, { opacity: 0 }], { duration: 1200 });
          fx.tone(1800, 0.5, { type: "sine", vol: 0.03, slide: 1600 });
          await fx.wait(1500);
        }
        const r = fx.rect(fx.slot());
        fx.put(box("background:#d51f2a;opacity:.25;border-radius:6px"), r.x, r.y, { size: r.width, h: r.height, ms: 900 });
        fx.caption("Don't look now.", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Lady Snowblood
    {
      id: 2487,
      y: 1973,
      run: async (fx) => {
        fx.wash("rgba(240,245,255,.35)", 6000, { fade: 500 });
        fx.particles({ kind: "fall", count: 50, glyphs: A.snowflake, min: 5, max: 11, dur: 4200, stagger: 4200, wind: -40 });
        fx.chord(["E3", "B3"], 5, { type: "sine", vol: 0.04, attack: 1 });
        const umb = fx.put(A.S("0 0 80 80", '<path d="M40 8 C12 8 4 30 4 36 L40 30 L76 36 C76 30 68 8 40 8 Z" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><path d="M40 8 V80" ' + A.ink + '/><path d="M20 16 L40 30 L60 16" stroke="#aaa" fill="none"/>'), W() / 2, H() * 0.42, { size: 110 });
        await fx.wait(1800);
        fx.noise(0.25, { type: "highpass", freq: 5000, vol: 0.6 });
        fx.tone(3200, 0.6, { type: "sine", vol: 0.08, slide: 5200 });
        await fx.move(umb, [{ transform: "none" }, { transform: "translateY(-40px) rotate(-30deg)" }], 300);
        fx.flash("#fff", 120);
        fx.buzz(30);
        const blade = fx.put(box("background:linear-gradient(90deg, transparent, #fff 50%, transparent);transform:rotate(-20deg)"), W() / 2, H() * 0.45, { size: W() * 1.2, h: 3 });
        void blade;
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.45), count: 30, spread: 60, gravity: 160, glyphs: [A.petal("#c4102a"), dot("#c4102a")], min: 5, max: 12, dur: 1500, stagger: 100 });
        fx.wash("linear-gradient(transparent 70%, rgba(196,16,42,.4))", 2400, { fade: 600 });
        await fx.wait(2600);
      }
    },

    // Enter the Dragon
    {
      id: 9461,
      y: 1973,
      run: async (fx) => {
        seventies(fx, 6200);
        const s = fx.slot();
        const r = fx.rect(s);
        const img = s && s.querySelector("img");
        const reflections = [];
        const n = 8;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const d = Math.min(W(), H()) * 0.3;
          const e = fx.put(img ? '<img src="' + img.src + '" style="width:100%;height:100%;object-fit:cover;opacity:.85;border:2px solid #cfe8f5">' : box("background:#8aa"), W() / 2 + Math.cos(a) * d, H() / 2 + Math.sin(a) * d, { size: r.width * 0.55, h: r.height * 0.55 });
          reflections.push(e);
          fx.anim(e, [{ opacity: 0 }, { opacity: 1 }], 200);
          fx.tone(1000 + i * 150, 0.25, { type: "sine", vol: 0.04 });
          await fx.wait(100);
        }
        fx.tone(900, 0.2, { type: "square", vol: 0.1, slide: 1300 });
        fx.caption("Destroy the image.", { style: "subtitle", ms: 1400 });
        await fx.wait(1300);
        for (const e of reflections) {
          fx.noise(0.18, { type: "highpass", freq: 3500, vol: 0.4 });
          fx.thud({ freq: 180, vol: 0.2 });
          fx.buzz(12);
          const er = fx.rect(e);
          fx.remove(e);
          fx.particles({ kind: "burst", from: pt(er.x, er.y), count: 6, spread: 30, gravity: 40, glyphs: '<div style="width:100%;height:100%;background:linear-gradient(135deg,#fff,#9ab);clip-path:polygon(50% 0,100% 100%,0 70%)"></div>', min: 6, max: 12, dur: 500, stagger: 0 });
          await fx.wait(140);
        }
        fx.tone(1300, 0.35, { type: "sawtooth", vol: 0.06, vibrato: [14, 60], filter: { freq: 2400 } });
        await fx.wait(900);
      }
    },

    // Zardoz
    {
      id: 4923,
      y: 1974,
      run: async (fx) => {
        seventies(fx, 6400);
        const head = fx.put(A.S("0 0 140 160", '<path d="M20 60 C20 16 120 16 120 60 C124 110 100 150 70 150 C40 150 16 110 20 60 Z" fill="#b8b0a0" ' + A.ink + '/><path d="M30 40 C50 30 90 30 110 40" stroke="#8a847a" stroke-width="3" fill="none"/>' +
          '<ellipse cx="48" cy="72" rx="14" ry="8" fill="#1d1a18"/><ellipse cx="92" cy="72" rx="14" ry="8" fill="#1d1a18"/><path d="M70 76 V104" stroke="#8a847a" stroke-width="3"/><path d="M44 116 C58 130 82 130 96 116 L92 126 C80 136 60 136 48 126 Z" fill="#1d1a18"/><path d="M48 18 C50 6 90 6 92 18" stroke="#1d1a18" stroke-width="4" fill="none"/>'),
          W() / 2, -100, { size: 170, h: 194 });
        fx.tone(55, 5, { type: "sawtooth", vol: 0.1, filter: { freq: 200 }, attack: 1 });
        fx.chord(["A2", "E3", "A3"], 5, { type: "sine", vol: 0.05, attack: 1.5 });
        await fx.move(head, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.38 + 100) + "px)" }], { duration: 2600, easing: "ease-out" });
        fx.caption("The gun is good.", { style: "card", ms: 1500, css: { top: "70%" } });
        fx.tone(90, 0.8, { type: "sawtooth", vol: 0.14, filter: { type: "bandpass", freq: 600, q: 4 } });
        await fx.wait(1100);
        for (let i = 0; i < 10; i++) fx.fly(A.S("0 0 20 40", '<rect x="8" y="0" width="4" height="24" fill="#3b3530"/><rect x="4" y="22" width="12" height="16" fill="#6b4a2a"/>'), [W() / 2, H() * 0.42 + 40], [fx.rand(0, W()), H() + 40], { size: 18, h: 36, dur: 1200, r2: fx.rand(-360, 360), easing: "ease-in" });
        fx.caption("(Zardoz has spoken)", { style: "whisper", ms: 1400 });
        await fx.wait(1800);
      }
    },

    // Phantom of the Paradise
    {
      id: 27327,
      y: 1974,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const helm = fx.put(A.S("0 0 100 110", '<path d="M10 60 C6 20 30 4 50 4 C70 4 94 20 90 60 L84 104 H16 Z" fill="#1d1a18" stroke="#9aa2a6" stroke-width="3"/><path d="M20 44 C30 36 44 40 50 50 C56 40 70 36 80 44 L74 58 H26 Z" fill="#9aa2a6"/><circle cx="36" cy="50" r="6" fill="#e0201c"/><path d="M50 4 V-6" stroke="#9aa2a6" stroke-width="4"/><path d="M40 72 L50 96 L60 72" fill="none" stroke="#9aa2a6" stroke-width="3"/>'),
          r.x, r.y, { size: 90, h: 99 });
        fx.move(helm, [{ transform: "scale(.2) rotate(-90deg)" }, { transform: "none" }], 500);
        fx.chord(["C3", "G3", "C4", "Eb4", "G4"], 2.4, { type: "sawtooth", vol: 0.06, filter: { freq: 1600 } });
        fx.seq([["C5", 1], ["Eb5", 1], ["G5", 1], ["C6", 3], ["Bb5", 1], ["Ab5", 1], ["G5", 4]], { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2600 }, at: 0.5 });
        const lights = fx.otherSlots(true).slice(0, 8);
        for (let i = 0; i < 8; i++) {
          fx.style(lights[i % lights.length] || [], { boxShadow: "0 0 0 3px " + ["#ff3b7a", "#3bd1ff", "#ffd23b"][i % 3] + ", 0 0 20px " + ["#ff3b7a", "#3bd1ff", "#ffd23b"][i % 3] }, 400);
          fx.thud({ freq: 90, vol: 0.2, dur: 0.1 });
          await fx.wait(260);
        }
        fx.caption("Paradise.", { style: "hand", ms: 1600 });
        fx.flash("rgba(255,59,122,.4)", 300);
        await fx.wait(1800);
      }
    },

    // Dark Star
    {
      id: 1410,
      y: 1974,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const space = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 50%, #1a1030, #000)", opacity: 0.85 } });
        void space;
        fx.particles({ kind: "drift", count: 30, glyphs: dot("#fff"), min: 1, max: 3, dur: 4000, stagger: 1000 });
        const ball = fx.put(A.S("0 0 70 60", '<ellipse cx="35" cy="32" rx="26" ry="24" fill="#e05a2a" ' + A.ink + ' stroke-width="2"/><path d="M20 34 C30 24 40 24 50 34" stroke="#b33a1a" stroke-width="3" fill="none"/><path d="M14 52 L8 60 M56 52 L62 60 M24 56 L22 60 M46 56 L48 60" ' + A.ink + ' stroke-width="2"/><circle cx="28" cy="26" r="2.5" fill="' + A.INK + '"/><circle cx="42" cy="26" r="2.5" fill="' + A.INK + '"/>'),
          r.x, r.y, { size: 60, h: 52 });
        fx.move(ball, [{ transform: "none" }, { transform: "translate(40px,-20px)" }, { transform: "translate(-30px,-40px)" }, { transform: "translate(10px,10px)" }, { transform: "none" }], { duration: 3000 });
        for (let i = 0; i < 6; i++) fx.tone(fx.rand(500, 900), 0.12, { type: "square", vol: 0.06, at: i * 0.5, filter: { freq: 1200 } });
        await fx.wait(2600);
        fx.caption("BOMB #20: Let there be light.", { style: "terminal", ms: 2000 });
        fx.tone(40, 2, { type: "sawtooth", slide: 1200, vol: 0.08 });
        await fx.wait(1800);
        fx.flash("#fff", 500);
        fx.buzz(100);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() / 2), count: 24, spread: 120, glyphs: dot("#fff6c0"), min: 3, max: 8, dur: 1400, stagger: 0 });
        await fx.wait(1200);
      }
    },

    // The Texas Chain Saw Massacre (1974)
    {
      id: 30497,
      y: 1974,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(1.8) contrast(1.2)", 5600, { fade: 200 });
        for (let i = 0; i < 3; i++) {
          fx.flash("#fff", 90);
          fx.noise(0.3, { type: "bandpass", freq: 2200, q: 3, vol: 0.5 });
          fx.tone(40, 0.3, { type: "sawtooth", vol: 0.2, slide: 30 });
          await fx.wait(500);
        }
        fx.tone(95, 3, { type: "sawtooth", vol: 0.14, vibrato: [40, 30], filter: { freq: 1400 } });
        fx.noise(3, { type: "bandpass", freq: 900, q: 2, vol: 0.3 });
        fx.shake("sm", 2800);
        fx.buzz([400, 50, 400, 50, 400]);
        const sun = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff0a0,#ff8a2a 60%,rgba(255,138,42,0) 72%)"></div>', W() / 2, H() * 0.8, { size: 160 });
        void sun;
        const saw = A.S("0 0 120 40", '<rect x="4" y="12" width="36" height="24" rx="4" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><path d="M40 16 H112 C118 16 118 32 112 32 H40 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M44 16 L48 12 L52 16 L56 12 L60 16 L64 12 L68 16 L72 12 L76 16 L80 12 L84 16 L88 12 L92 16 L96 12 L100 16 L104 12 L108 16" fill="none" stroke="#1d1a18" stroke-width="1.5"/>');
        const sw = fx.put(saw, W() / 2, H() * 0.72, { size: 140, h: 46 });
        await fx.move(sw, Array.from({ length: 8 }, (_, i) => ({ transform: "rotate(" + (i % 2 ? -35 : 25) + "deg) translateY(" + (i % 2 ? -20 : 0) + "px)" })), { duration: 2600, easing: "ease-in-out" });
      }
    },

    // The Conversation
    {
      id: 592,
      y: 1974,
      run: async (fx) => {
        seventies(fx, 6600);
        const r = fx.rect(fx.slot());
        const reel = (x) => fx.put(A.S("0 0 50 50", '<circle cx="25" cy="25" r="22" fill="#2b2622" ' + A.ink + ' stroke-width="2"/><circle cx="25" cy="25" r="5" fill="#9aa2a6"/><path d="M25 8 V16 M25 34 V42 M8 25 H16 M34 25 H42" stroke="#9aa2a6" stroke-width="3"/>'), x, r.top - 40, { size: 50 });
        const a = reel(r.x - 36), b = reel(r.x + 36);
        fx.move([a, b], [{ transform: "rotate(0)" }, { transform: "rotate(-720deg)" }], { duration: 3600, easing: "linear" });
        const garble = ["He'd kill us if he got the chance.", "He'd kill us if he got the chance.", "He'd KILL us if he got the chance."];
        for (let i = 0; i < 3; i++) {
          fx.noise(1.4, { type: "bandpass", freq: 1000 + i * 300, q: 3, vol: 0.18 });
          fx.tone(160 + i * 20, 1.2, { type: "sawtooth", vol: 0.04, filter: { type: "bandpass", freq: 800, q: 5 }, vibrato: [7, 30] });
          fx.caption(garble[i], { style: "subtitle", ms: 1100, css: { fontSize: i === 2 ? "18px" : "15px", opacity: 0.6 + i * 0.2 } });
          await fx.wait(1200);
        }
        const others = fx.otherSlots(true).slice(0, 8);
        for (const s of others) {
          fx.move(s, [{ transform: "none" }, { transform: "rotate(" + fx.rand(-8, 8) + "deg) translateY(" + fx.rand(-10, 10) + "px)" }], { duration: 250, fill: "forwards" });
          fx.noise(0.12, { freq: 400, vol: 0.3 });
          await fx.wait(120);
        }
        fx.caption("(he tears the room apart looking for the bug)", { style: "whisper", ms: 1400 });
        fx.seq([["F4", 2], ["Ab4", 1], ["C5", 1], ["Db5", 4]], { type: "triangle", vol: 0.08, beat: 0.3 });
        await fx.wait(1600);
      }
    },

    // Picnic at Hanging Rock
    {
      id: 11020,
      y: 1975,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(.8) brightness(1.1) blur(.4px)", 7000, { fade: 1000 });
        fx.wash("radial-gradient(circle at 50% 50%, rgba(255,250,235,.0) 30%, rgba(255,250,235,.7))", 7000, { fade: 1000 });
        const pan = [["C5", 2], ["E5", 1], ["G5", 1], ["A5", 2], ["G5", 2], ["E5", 2], ["D5", 2], ["C5", 4]];
        fx.seq(pan, { type: "sine", vol: 0.1, beat: 0.35, vibrato: [4, 5], attack: 0.15 });
        fx.seq(pan, { type: "triangle", vol: 0.03, beat: 0.35, detune: 1200, at: 0.02 });
        const watch = fx.put(A.S("0 0 40 50", '<rect x="16" y="0" width="8" height="8" fill="#c9a24a"/><circle cx="20" cy="28" r="18" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="28" r="14" fill="#f4efe2"/><path d="M20 28 V17 M20 28 L28 28" ' + A.ink + ' stroke-width="2"/>'), W() - 50, 80, { size: 40, h: 50 });
        void watch;
        fx.caption("(the watch has stopped at 12:00)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        const others = fx.otherSlots(true).slice(0, 4);
        for (const s of others) {
          fx.style(s, { transition: "opacity 1.4s", opacity: "0" }, 5200);
          fx.tone(fx.pick(["E6", "G6", "A6"]), 1, { type: "sine", vol: 0.03 });
          await fx.wait(700);
        }
        fx.caption("What we see, and what we seem, are but a dream…", { style: "subtitle", ms: 2200 });
        await fx.wait(2000);
      }
    },

    // Deep Red
    {
      id: 20126,
      y: 1975,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const beat = 0.18;
        const riff = [["A3", 1], ["C4", 1], ["E4", 1], ["A4", 1], ["G4", 1], ["E4", 1], ["C4", 1], ["E4", 1]];
        fx.seq(riff.concat(riff, riff), { type: "square", vol: 0.05, beat, filter: { freq: 1400 } });
        fx.seq([["A2", 8], ["F2", 8], ["G2", 8]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 500 } });
        for (let i = 0; i < 24; i++) fx.thud({ freq: i % 2 ? 150 : 70, vol: 0.15, dur: 0.1, at: i * beat });
        const doll = fx.put(A.S("0 0 60 80", '<circle cx="30" cy="22" r="18" fill="#f4e0d0" ' + A.ink + ' stroke-width="2"/><circle cx="24" cy="20" r="3" fill="#1d1a18"/><circle cx="36" cy="20" r="3" fill="#1d1a18"/><path d="M26 32 Q30 28 34 32" stroke="#b3402d" stroke-width="2" fill="none"/><path d="M14 40 H46 L50 78 H10 Z" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><path d="M12 12 C14 0 46 0 48 12" fill="#6b4a2a"/>'),
          W() + 60, H() * 0.6, { size: 70, h: 94 });
        await fx.move(doll, [{ transform: "none" }, { transform: "translateX(-" + (W() / 2 + 60) + "px)" }], { duration: 1400, easing: "steps(10)" });
        fx.move(doll, [{ transform: "translateX(-" + (W() / 2 + 60) + "px)" }, { transform: "translateX(-" + (W() / 2 + 60) + "px) rotate(30deg)" }], 400);
        await fx.wait(1600);
        fx.wash("#9a0010", 1600, { blend: "multiply", opacity: 0.6, fade: 300 });
        fx.put(A.S("0 0 100 60", '<path d="M10 10 H90 V50 H10 Z" fill="rgba(200,220,235,.3)" stroke="#fff" stroke-width="2"/><path d="M20 20 C30 30 40 20 50 30" stroke="#b3122a" stroke-width="3" fill="none"/>'), r.x, r.y, { size: 90, h: 54, ms: 1600 });
        fx.caption("(the mirror remembers)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Hedgehog in the Fog
    {
      id: 36129,
      y: 1975,
      run: async (fx) => {
        const fog = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 60%, rgba(240,240,235,.5), rgba(220,225,220,.95) 60%)", opacity: 0 } });
        fx.anim(fog, [{ opacity: 0 }, { opacity: 1 }], { duration: 1500, fill: "forwards" });
        fx.noise(7, { freq: 300, vol: 0.05, attack: 1.5 });
        fx.chord(["D4", "F4", "A4"], 6, { type: "sine", vol: 0.03, attack: 2 });
        const hog = fx.put(A.S("0 0 60 40", '<path d="M6 30 C6 14 20 6 36 8 C46 10 52 18 54 26 L58 30 L52 32 C50 36 44 36 40 34 H10 C6 34 6 32 6 30 Z" fill="#6b4a2a"/><path d="M10 26 L6 18 M16 20 L12 10 M24 16 L22 6 M32 14 L32 4 M40 14 L42 6 M46 18 L50 10" stroke="#3b2a1a" stroke-width="2"/><circle cx="48" cy="24" r="1.5" fill="#fff"/><path d="M20 34 V40 M40 34 V40" stroke="#3b2a1a" stroke-width="2"/><rect x="18" y="4" width="12" height="10" fill="#e8d6c0" stroke="#3b2a1a" stroke-width="1.5"/>'),
          W() * 0.2, H() * 0.68, { size: 60, h: 40 });
        fx.move(hog, [{ transform: "none" }, { transform: "translateX(" + W() * 0.3 + "px)" }], { duration: 4200, easing: "linear" });
        await fx.wait(1800);
        const horse = fx.put(A.S("0 0 100 120", '<path d="M20 60 C24 40 60 36 76 42 L84 18 C86 10 94 10 94 18 L92 46 C92 54 86 58 80 58 L76 60 L80 116 H74 L68 64 H36 L30 116 H24 L26 64 C18 64 16 62 20 60 Z" fill="#fff"/>'), W() * 0.72, H() * 0.42, { size: 110, h: 132, style: { opacity: 0 } });
        fx.anim(horse, [{ opacity: 0 }, { opacity: 0.85 }, { opacity: 0.85 }, { opacity: 0 }], { duration: 3200 });
        fx.seq([["A5", 3], ["F5", 2], ["D5", 3]], { type: "sine", vol: 0.06, beat: 0.4, vibrato: [3, 6] });
        fx.caption("Ëжик!", { style: "whisper", ms: 1400, css: { color: "#555" } });
        await fx.wait(1400);
        fx.caption("…Hedgehog!", { style: "whisper", ms: 1400, css: { color: "#555" } });
        await fx.wait(2000);
      }
    },

    // Sholay
    {
      id: 12259,
      y: 1975,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(1.3)", 6400, { fade: 300 });
        fx.wash("linear-gradient(transparent 60%, rgba(160,110,50,.5))", 6400, { fade: 400 });
        const coin = fx.put(A.coin("#c9c9c9"), W() / 2, H() * 0.6, { size: 48 });
        fx.tone(3000, 0.1, { type: "sine", vol: 0.1 });
        await fx.move(coin, [{ transform: "translateY(0) rotateX(0)" }, { transform: "translateY(-" + H() * 0.3 + "px) rotateX(900deg)" }, { transform: "translateY(0) rotateX(1800deg)" }], { duration: 1600, easing: "ease-in-out" });
        fx.tone(2400, 0.3, { type: "sine", vol: 0.1 });
        fx.caption("Heads.", { style: "card", ms: 1200 });
        await fx.wait(1200);
        const bike = A.S("0 0 140 70", '<circle cx="24" cy="54" r="14" fill="none" ' + A.ink + '/><circle cx="96" cy="54" r="14" fill="none" ' + A.ink + '/><path d="M24 54 L50 34 H80 L96 54 M60 34 L66 20" ' + A.ink + ' fill="none"/><rect x="100" y="30" width="36" height="24" rx="4" fill="#3b3530"/><circle cx="118" cy="56" r="10" fill="none" ' + A.ink + '/><circle cx="56" cy="16" r="6" fill="#f2d6b3"/><circle cx="72" cy="14" r="6" fill="#f2d6b3"/>');
        fx.tone(90, 3, { type: "sawtooth", vol: 0.08, filter: { freq: 300 }, vibrato: [22, 5] });
        const tune = [["C5", 1], ["D5", 1], ["E5", 2], ["G5", 1], ["E5", 1], ["D5", 2], ["C5", 1], ["D5", 1], ["E5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.09, beat: 0.22 });
        await fx.fly(bike, [-150, H() - 80], [W() + 150, H() - 80], { size: 140, h: 70, dur: 3200, easing: "linear" });
      }
    },

    // Barry Lyndon
    {
      id: 3175,
      y: 1975,
      run: async (fx) => {
        const room = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 55%, rgba(255,200,110,.0) 10%, rgba(40,20,5,.85) 60%)", opacity: 0 } });
        fx.anim(room, [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: "forwards" });
        fx.filter("sepia(.4) saturate(1.2) blur(.3px)", 7000, { fade: 1000 });
        const n = 5;
        for (let i = 0; i < n; i++) {
          fx.put(A.S("0 0 20 50", '<rect x="7" y="16" width="6" height="32" fill="#f4efe2"/><path d="M10 2 C14 8 14 12 10 16 C6 12 6 8 10 2 Z" fill="#ffcf5a"/>'), W() / 2 + (i - 2) * 36, H() * 0.62, { size: 20, h: 50, style: { filter: "drop-shadow(0 0 8px #ffb347)" } });
        }
        const sar = [["D4", 2], ["F4", 1], ["E4", 3], ["D4", 2], ["C#4", 1], ["D4", 3], ["A3", 4]];
        fx.seq(sar, { type: "sawtooth", vol: 0.05, beat: 0.45, filter: { freq: 900 } });
        fx.seq(sar.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "triangle", vol: 0.06, beat: 0.45 });
        if (!fx.reduced) await fx.page([{ transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 5600, easing: "linear" });
        else await fx.wait(5600);
      }
    },

    // Mirror (1975)
    {
      id: 1396,
      y: 1975,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(.8)", 7000, { fade: 600 });
        fx.noise(6.5, { type: "bandpass", freq: 700, sweep: 1500, q: 0.6, vol: 0.2, attack: 1.5 });
        const field = fullSvg(fx, A.S("0 0 400 300", Array.from({ length: 70 }, (_, i) => { const x = i * 6; return '<path d="M' + x + " 300 C" + (x + 2) + " 240 " + (x - 3) + " 200 " + (x + 3) + " " + (170 + (i * 31) % 60) + '" stroke="rgba(60,90,40,.7)" stroke-width="3" fill="none"/>'; }).join("")), { opacity: 0.85 });
        if (!fx.reduced) {
          for (let i = 0; i < 3; i++) {
            await fx.anim(field, [{ transform: "skewX(0)" }, { transform: "skewX(-16deg)" }, { transform: "skewX(0)" }], { duration: 1500, easing: "ease-in-out" });
          }
        } else await fx.wait(4500);
        const r = fx.rect(fx.slot());
        const jug = fx.put(A.S("0 0 40 60", '<path d="M12 6 H28 V16 C38 22 38 50 30 56 H10 C2 50 2 22 12 16 Z" fill="#c8b8a0" ' + A.ink + ' stroke-width="2"/>'), r.x, r.y, { size: 40, h: 60 });
        fx.move(jug, [{ transform: "none" }, { transform: "translateY(" + r.height * 0.5 + "px) rotate(40deg)" }], { duration: 400, easing: "ease-in" });
        fx.later(400, () => { fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.4 }); fx.remove(jug); });
        fx.particles({ kind: "fall", area: fx.slot(), count: 20, glyphs: A.drop("#dfe"), min: 5, max: 9, dur: 1400 });
        await fx.wait(1800);
      }
    },

    // Jeanne Dielman, 23 quai du Commerce, 1080 Bruxelles
    {
      id: 44012,
      y: 1976,
      run: async (fx) => {
        const all = fx.$$("#grid .slot");
        fx.filter("saturate(.8) brightness(1.02)", 8000, { fade: 400 });
        all.forEach((s, i) => fx.style(s, { transform: "rotate(" + ((i * 37) % 7 - 3) + "deg) translate(" + ((i * 13) % 5 - 2) + "px, " + ((i * 7) % 5 - 2) + "px)" }, 8000));
        await fx.wait(700);
        for (let i = 0; i < all.length; i++) {
          if (!fx.reduced) fx.anim(all[i], [{ transform: all[i].style.transform }, { transform: "none" }], { duration: 400, fill: "forwards" });
          else all[i].style.transform = "none";
          fx.click({ freq: 1800, vol: 0.12 });
          await fx.wait(260);
        }
        fx.noise(1.2, { freq: 300, vol: 0.05 });
        fx.tone(210, 0.3, { type: "sine", vol: 0.05 });
        fx.caption("(everything in its place)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
        const one = all[fx.slotIndex] || all[0];
        if (one) fx.style(one, { transform: "rotate(2deg)" }, 1400);
        fx.caption("…almost.", { style: "whisper", ms: 1200 });
        await fx.wait(1400);
      },
      maxMs: 14000
    },

    // Grey Gardens
    {
      id: 17346,
      y: 1976,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(.9) contrast(1.05)", 7000, { fade: 400 });
        fx.costume(".reely", '<path d="M34 34 C30 14 50 4 60 4 C70 4 90 14 86 34 C80 26 70 22 60 22 C50 22 40 26 34 34 Z" fill="#e8d6c0" stroke="#1f1b16" stroke-width="3"/><circle cx="84" cy="30" r="7" fill="#c9a24a" stroke="#1f1b16" stroke-width="2"/>', 7000);
        const tune = [["G4", 1], ["C5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["A4", 2], ["G4", 1], ["A4", 1], ["C5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.3 });
        fx.seq(tune, { type: "sawtooth", vol: 0.02, beat: 0.3, filter: { freq: 900 }, detune: 25 });
        const cats = [];
        for (let i = 0; i < 6; i++) {
          const c = fx.put(A.cat, fx.rand(30, W() - 30), H() - fx.rand(40, 120), { size: 60, h: 38, style: { opacity: 0 } });
          cats.push(c);
          fx.anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: i * 350, fill: "forwards" });
          fx.tone(fx.rand(500, 800), 0.4, { type: "sawtooth", vol: 0.03, slide: fx.rand(300, 600), filter: { freq: 1400 }, at: i * 0.35 });
        }
        fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }, { transform: "none" }], { duration: 1200, iterations: 3 });
        await fx.wait(2400);
        fx.caption("It's the best costume for today.", { style: "subtitle", ms: 2400 });
        await fx.wait(2600);
      }
    },

    // Stroszek
    {
      id: 11698,
      y: 1977,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const booth = fx.put(A.S("0 0 100 120", '<rect x="6" y="10" width="88" height="106" fill="#e8c84a" ' + A.ink + '/><rect x="16" y="24" width="68" height="60" fill="#e6f2ff" ' + A.ink + ' stroke-width="2"/><path d="M30 20 H70" stroke="#b3402d" stroke-width="4"/><text x="50" y="18" font-size="9" text-anchor="middle" font-family="Georgia" fill="#1d1a18">DANCING CHICKEN</text><rect x="44" y="94" width="12" height="4" fill="#1d1a18"/>'),
          W() / 2, H() * 0.45, { size: 160, h: 192 });
        const chick = fx.put(A.S("0 0 50 50", '<ellipse cx="24" cy="30" rx="16" ry="13" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="16" r="8" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M42 14 L50 16 L42 19" fill="#e8a13a"/><path d="M34 8 L36 2 L40 8" fill="#d51f2a"/><circle cx="38" cy="14" r="1.5" fill="' + A.INK + '"/><path d="M18 42 V50 M28 42 V50" stroke="#e8a13a" stroke-width="3"/>'),
          W() / 2, H() * 0.45 - 16, { size: 50 });
        fx.fly(A.coin(), [r.x, r.y], [W() / 2, H() * 0.45 + 38], { size: 20, dur: 700 });
        await fx.wait(700);
        fx.click({ freq: 3000, vol: 0.5 });
        const plink = [["C6", 1], ["E6", 1], ["G6", 1], ["E6", 1], ["C6", 1], ["E6", 1], ["G6", 2]];
        for (let loop = 0; loop < 3; loop++) fx.seq(plink, { type: "square", vol: 0.05, beat: 0.14, at: loop * 1.26, filter: { freq: 3000 } });
        fx.seq([["C4", 2], ["G3", 2], ["C4", 2], ["G3", 2], ["C4", 2], ["G3", 2], ["C4", 2], ["G3", 2], ["C4", 2], ["G3", 2]], { type: "triangle", vol: 0.08, beat: 0.19 });
        await fx.move(chick, Array.from({ length: 13 }, (_, i) => ({ transform: "translate(" + (i % 4 < 2 ? -12 : 12) + "px," + (i % 2 ? -8 : 0) + "px) rotate(" + (i % 2 ? 15 : -15) + "deg)" })), { duration: 3800, easing: "steps(13)" });
        fx.caption("Is that a chicken?", { style: "subtitle", ms: 1400 });
        fx.move(booth, [{ transform: "none" }, { transform: "scale(1.02)" }, { transform: "none" }], 300);
        await fx.wait(1500);
      }
    },

    // Sorcerer
    {
      id: 38985,
      y: 1977,
      run: async (fx) => {
        fx.filter("saturate(1.1) sepia(.2)", 6400, { fade: 400 });
        fx.wash("linear-gradient(rgba(20,60,30,.3), rgba(10,30,15,.6))", 6400, { fade: 500 });
        const bridge = fx.node(A.S("0 0 400 120", '<path d="M0 30 C100 60 300 60 400 30" stroke="#6b4a2a" stroke-width="5" fill="none"/>' + Array.from({ length: 20 }, (_, i) => '<rect x="' + (10 + i * 19) + '" y="' + (38 + Math.sin(i / 19 * Math.PI) * 20) + '" width="14" height="6" fill="#8a6a3a"/>').join("")),
          { style: { position: "absolute", left: 0, right: 0, top: "55%", height: "16vh" } });
        bridge.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(bridge.firstChild.style, { width: "100%", height: "100%" });
        fx.particles({ kind: "fall", count: 60, glyphs: A.drop("#bfe4ff"), min: 4, max: 8, dur: 900, stagger: 5000 });
        fx.noise(6, { type: "highpass", freq: 2000, vol: 0.12, attack: 0.5 });
        const pulse = [["E2", 1], [null, 1], ["E2", 1], ["G2", 1], ["E2", 2], ["D2", 2]];
        for (let i = 0; i < 3; i++) fx.seq(pulse, { type: "sawtooth", vol: 0.08, beat: 0.2, at: i * 1.6, filter: { freq: 500 } });
        fx.seq([["B4", 4], ["C5", 4], ["B4", 4], ["G4", 8]], { type: "sine", vol: 0.04, beat: 0.25, vibrato: [5, 8] });
        const truck = fx.put(A.S("0 0 120 60", '<path d="M4 44 V18 H70 V44 Z" fill="#6a5d50" ' + A.ink + '/><path d="M70 44 V24 H96 L110 34 V44 Z" fill="#4a443c" ' + A.ink + '/><circle cx="24" cy="48" r="9" fill="#1d1a18"/><circle cx="92" cy="48" r="9" fill="#1d1a18"/>'), -60, H() * 0.55 - 10, { size: 110, h: 55 });
        for (let i = 0; i < 12; i++) {
          if (!fx.reduced) truck.style.transform = "translateX(" + (W() + 120) * (i + 1) / 12 + "px) rotate(" + (i % 2 ? 9 : -9) + "deg)";
          fx.move(bridge, [{ transform: "none" }, { transform: "translateY(" + (i % 2 ? 6 : -6) + "px)" }], { duration: 400, fill: "forwards" });
          fx.buzz(20);
          await fx.wait(420);
        }
        await fx.wait(600);
      }
    },

    // Suspiria (1977)
    {
      id: 11906,
      y: 1977,
      run: async (fx) => {
        const cols = ["rgba(230,20,60,.55)", "rgba(40,60,230,.55)", "rgba(30,200,120,.45)"];
        const w = fx.wash(cols[0], 6400, { blend: "multiply", fade: 300 });
        const box12 = [["E5", 1], ["C5", 1], ["A4", 1], ["C5", 1], ["E5", 1], ["C5", 1], ["A4", 1], ["C5", 1], ["D5", 1], ["B4", 1], ["G#4", 1], ["B4", 1]];
        fx.seq(box12.concat(box12), { type: "triangle", vol: 0.08, beat: 0.18, filter: { freq: 3000 } });
        fx.seq([["A2", 12], ["G#2", 12]], { type: "sawtooth", vol: 0.04, beat: 0.18, filter: { freq: 300 } });
        for (let i = 0; i < 12; i++) fx.noise(0.5, { type: "bandpass", freq: 1800, q: 5, vol: 0.12, at: 0.2 + i * 0.36, pan: i % 2 ? -0.8 : 0.8 });
        fx.later(900, () => fx.caption("La… la la…", { style: "whisper", ms: 1400, css: { color: "#fff" } }));
        for (let i = 1; i < 8; i++) {
          await fx.wait(520);
          w.style.background = cols[i % 3];
        }
        fx.flash("#fff", 120);
        fx.chord(["A2", "Bb2", "E3"], 1, { type: "sawtooth", vol: 0.14, filter: { freq: 2000 } });
        fx.buzz([60, 40, 60]);
        await fx.wait(1600);
      }
    },

    // House (Hausu, 1977)
    {
      id: 25623,
      y: 1977,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(1.8) contrast(1.1)", 6400, { fade: 300 });
        const sunset = fx.wash("linear-gradient(#ff6ab0, #ffb347 50%, #6a3bff)", 6400, { blend: "multiply", opacity: 0.5, fade: 400 });
        void sunset;
        const piano = [["C5", 1], ["E5", 1], ["G5", 1], ["C6", 1], ["B5", 1], ["G5", 1], ["E5", 1], ["C5", 1]];
        fx.seq(piano.concat(piano), { type: "triangle", vol: 0.08, beat: 0.14 });
        const cat = fx.put(A.S("0 0 60 60", '<circle cx="30" cy="34" r="20" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><path d="M14 22 L12 6 L24 16 M46 22 L48 6 L36 16" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><circle class="e" cx="23" cy="32" r="3" fill="#1d1a18"/><circle class="e" cx="37" cy="32" r="3" fill="#1d1a18"/><path d="M26 42 Q30 46 34 42" stroke="#1d1a18" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 70 });
        fx.tone(700, 0.4, { type: "sawtooth", vol: 0.06, slide: 900, filter: { freq: 1600 } });
        await fx.wait(1600);
        cat.querySelectorAll(".e").forEach((e) => e.setAttribute("fill", "#20ff80"));
        fx.style(cat, { filter: "drop-shadow(0 0 10px #20ff80)" });
        fx.tone(1200, 0.6, { type: "sine", vol: 0.1, vibrato: [18, 200] });
        await fx.wait(500);
        const piano2 = fx.put(A.S("0 0 120 50", '<rect x="4" y="4" width="112" height="42" fill="#1d1a18"/>' + Array.from({ length: 14 }, (_, i) => '<rect class="k" x="' + (8 + i * 8) + '" y="22" width="7" height="22" fill="#fff"/>').join("")), W() / 2, H() * 0.72, { size: 180, h: 76 });
        const keys = piano2.querySelectorAll(".k");
        for (let i = 0; i < 14; i++) {
          if (keys[i]) keys[i].setAttribute("fill", "#ff3b7a");
          fx.tone(fx.pick(["C4", "D4", "Eb4", "F#4", "A4"]), 0.2, { type: "triangle", vol: 0.1 });
          fx.later(150, () => keys[i] && keys[i].setAttribute("fill", "#fff"));
          await fx.wait(110);
        }
        fx.move(piano2, [{ transform: "none" }, { transform: "translateY(-30px) scale(1.2)" }, { transform: "translateY(0)" }], 500);
        fx.caption("(the piano bites)", { style: "whisper", ms: 1400 });
        fx.noise(0.2, { freq: 600, vol: 0.5 });
        fx.buzz(40);
        await fx.wait(1600);
      }
    },

    // Eraserhead
    {
      id: 985,
      y: 1977,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.35) brightness(.85)", 7000, { fade: 400 });
        fx.noise(6.5, { freq: 180, vol: 0.3, attack: 1 });
        fx.noise(6.5, { type: "bandpass", freq: 900, q: 8, vol: 0.05, attack: 2 });
        fx.tone(48, 6.5, { type: "sine", vol: 0.1, attack: 1 });
        const r = fx.rect(fx.$(".reely") || fx.slot());
        const hair = fx.costume(".reely", '<path d="M40 30 C34 -10 86 -10 80 30 C86 10 80 -20 60 -24 C40 -20 34 10 40 30 Z" fill="#1d1a18"/>', 7000);
        void hair;
        await fx.wait(2200);
        const stage = fx.put('<div style="width:100%;height:100%;background:radial-gradient(ellipse at 50% 100%, rgba(255,255,255,.6), transparent 70%);border-bottom:6px solid #fff"></div>', W() / 2, H() * 0.55, { size: 220, h: 120 });
        void stage;
        const lady = fx.put(A.S("0 0 60 80", '<circle cx="18" cy="22" r="10" fill="#f4f2ec"/><circle cx="42" cy="22" r="10" fill="#f4f2ec"/><ellipse cx="30" cy="34" rx="14" ry="12" fill="#f4f2ec"/><circle cx="26" cy="32" r="2" fill="#1d1a18"/><circle cx="34" cy="32" r="2" fill="#1d1a18"/><path d="M24 40 Q30 44 36 40" stroke="#1d1a18" stroke-width="2" fill="none"/><path d="M18 46 H42 L46 78 H14 Z" fill="#f4f2ec"/>'), W() / 2, H() * 0.55, { size: 60, h: 80 });
        const tune = [["F4", 2], ["A4", 1], ["C5", 1], ["F5", 3], ["E5", 1], ["D5", 2], ["C5", 2], ["A4", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.04, beat: 0.35, filter: { freq: 1000 }, vibrato: [5, 5] });
        fx.caption("In heaven, everything is fine.", { style: "subtitle", ms: 2600 });
        fx.move(lady, [{ transform: "none" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "none" }], { duration: 1400, iterations: 2 });
        await fx.wait(3200);
        fx.particles({ kind: "fall", area: pt(W() / 2, H() * 0.45, 200, 20), count: 10, glyphs: A.S("0 0 20 10", '<path d="M2 5 C6 0 14 10 18 5" stroke="#f4f2ec" stroke-width="3" fill="none"/>'), min: 14, max: 22, dur: 1400 });
        fx.noise(0.6, { type: "lowpass", freq: 300, vol: 0.4 });
        await fx.wait(1300);
        void r;
      }
    },

    // Powers of Ten
    {
      id: 53223,
      y: 1977,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        const frame = fx.put(box("border:2px solid #fff;box-shadow:0 0 0 1px #000"), r.x, r.y, { size: 60 });
        const label = fx.put('<div style="font:700 12px/1 \'Special Elite\',\'Courier New\',monospace;color:#fff;text-shadow:0 0 3px #000;white-space:nowrap">10⁰ m</div>', r.x + 30, r.y - 44, { size: 80, h: 16 });
        const space = fx.node("", { cls: "fx-filter", style: { background: "#000", opacity: 0 } });
        void frame;
        const stars = fx.node("", { cls: "fx-filter" });
        fx.tone(220, 7, { type: "sine", vol: 0.06, slide: 55, attack: 0.5 });
        for (let p = 1; p <= 9; p++) {
          label.firstChild.innerHTML = "10<sup>" + p * 2 + "</sup> m";
          fx.click({ freq: 1000 + p * 150, vol: 0.2 });
          if (!fx.reduced) fx.page([{ transform: "scale(" + Math.pow(0.8, p - 1) + ")" }, { transform: "scale(" + Math.pow(0.8, p) + ")" }], { duration: 600, fill: "forwards" });
          space.style.opacity = Math.min(0.95, p * 0.12);
          if (p > 5) for (let k = 0; k < 6; k++) fx.put(dot("#fff"), fx.rand(0, W()), fx.rand(0, H()), { size: fx.rand(1, 3), parent: stars });
          await fx.wait(600);
        }
        fx.caption("…and back again.", { style: "whisper", ms: 1200, css: { color: "#fff" } });
        if (!fx.reduced) await fx.page([{ transform: "scale(" + Math.pow(0.8, 9) + ")" }, { transform: "none" }], { duration: 700, easing: "ease-in" });
        fx.remove(stars);
        fx.tone(55, 0.6, { type: "sine", slide: 220, vol: 0.08 });
        await fx.fadeOut(space, 400);
      },
      maxMs: 12000
    },

    // Days of Heaven
    {
      id: 16642,
      y: 1978,
      run: async (fx) => {
        const dusk = fx.wash("linear-gradient(#f6c077, #d98a5a 40%, #6a4a6a)", 7000, { fade: 1000, blend: "multiply", opacity: 0.5 });
        void dusk;
        const wheat = fullSvg(fx, A.S("0 0 400 100", Array.from({ length: 90 }, (_, i) => { const x = i * 4.5; return '<path d="M' + x + " 100 C" + (x + 1) + " 70 " + (x - 2) + " 50 " + (x + 2) + " " + (30 + (i * 17) % 20) + '" stroke="#c9a24a" stroke-width="2" fill="none"/><ellipse cx="' + (x + 2) + '" cy="' + (28 + (i * 17) % 20) + '" rx="2" ry="5" fill="#d9b24a"/>'; }).join("")),
          { top: "auto", height: "30vh", bottom: 0 });
        if (!fx.reduced) fx.anim(wheat, [{ transform: "skewX(0)" }, { transform: "skewX(-8deg)" }, { transform: "skewX(4deg)" }, { transform: "skewX(0)" }], { duration: 5000 });
        const tune = [["E5", 2], ["D5", 1], ["C5", 1], ["B4", 2], ["A4", 2], ["B4", 1], ["C5", 1], ["D5", 2], ["E5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.09, beat: 0.35, attack: 0.1 });
        fx.chord(["A3", "E4"], 6, { type: "triangle", vol: 0.03, attack: 1 });
        await fx.wait(3200);
        fx.noise(3, { type: "bandpass", freq: 3500, q: 1, vol: 0.2, attack: 0.6 });
        fx.particles({ kind: "fall", count: 90, glyphs: A.S("0 0 16 10", '<ellipse cx="8" cy="5" rx="5" ry="3" fill="#6a8a3a"/><path d="M3 3 L0 0 M13 3 L16 0" stroke="#6a8a3a"/>'), min: 5, max: 10, dur: 1400, stagger: 2600, wind: 60 });
        fx.caption("(locusts)", { style: "whisper", ms: 1400 });
        await fx.wait(3000);
      }
    },

    // Nosferatu the Vampyre (1979)
    {
      id: 6404,
      y: 1979,
      run: async (fx) => {
        fx.filter("saturate(.55) brightness(.9)", 7000, { fade: 500 });
        fx.wash("linear-gradient(rgba(30,40,60,.3), rgba(10,15,25,.5))", 7000, { fade: 500 });
        fx.chord(["C3", "G3", "Eb4"], 6, { type: "sine", vol: 0.05, attack: 2 });
        fx.chord(["G4", "C5"], 6, { type: "sine", vol: 0.025, attack: 3, vibrato: [5, 6] });
        const rats = [];
        for (let i = 0; i < 26; i++) rats.push(i);
        const y0 = H() - 40;
        for (const i of rats) {
          fx.later(i * 110, () => fx.fly(A.rat, [-60, y0 - (i % 5) * 16], [W() + 60, y0 - (i % 5) * 16 - fx.rand(-10, 10)], { size: 50, h: 22, dur: 2200 + (i % 3) * 400 }));
        }
        for (let t = 0; t < 5; t += 0.1) fx.noise(0.05, { type: "bandpass", freq: 6000, q: 5, vol: 0.05, at: t });
        await fx.wait(3200);
        fx.caption("(the plague has come to Wismar)", { style: "whisper", ms: 2000, css: { color: "#eee" } });
        const coffins = fx.otherSlots(true).slice(0, 4);
        fx.style(coffins, { filter: "brightness(.5) sepia(.4)" }, 2800);
        await fx.wait(2600);
      }
    },

    // Being There
    {
      id: 10322,
      y: 1979,
      run: async (fx) => {
        fx.filter("saturate(.9) sepia(.15)", 6400, { fade: 400 });
        const tv = fx.put(A.S("0 0 100 90", '<rect x="4" y="4" width="92" height="70" rx="8" fill="#6b4a2a" ' + A.ink + '/><rect class="scr" x="14" y="12" width="64" height="54" rx="6" fill="#9ab"/><circle cx="87" cy="24" r="4" fill="#c9a24a"/><circle cx="87" cy="40" r="4" fill="#c9a24a"/><path d="M20 74 L14 88 M80 74 L86 88" ' + A.ink + '/>'),
          W() / 2, H() * 0.4, { size: 130, h: 117 });
        const scr = tv.querySelector(".scr");
        const channels = ["#9ab", "#e0b34a", "#b3402d", "#3aa655", "#6a3bff", "#f4efe2"];
        for (let i = 0; i < 6; i++) {
          if (scr) scr.setAttribute("fill", channels[i]);
          fx.click({ freq: 900, vol: 0.4 });
          fx.noise(0.3, { type: "bandpass", freq: 2000, q: 2, vol: 0.12 });
          fx.tone(fx.rand(200, 600), 0.3, { type: "square", vol: 0.03, filter: { freq: 1200 } });
          await fx.wait(450);
        }
        fx.caption("I like to watch.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
        const walker = A.S("0 0 30 60", '<path d="M8 4 H22 L24 10 H6 Z" fill="#3b3530"/><circle cx="15" cy="14" r="5" fill="#f2d6b3"/><path d="M8 20 H22 L22 40 H8 Z" fill="#3b3530"/><path d="M10 40 V58 M20 40 V58" stroke="#3b3530" stroke-width="4"/><path d="M22 24 L28 34" stroke="#1d1a18" stroke-width="2"/>');
        const water = fx.wash("linear-gradient(transparent 80%, rgba(120,160,200,.6))", 2400, { fade: 400 });
        void water;
        fx.fly(walker, [-30, H() - 50], [W() + 30, H() - 50], { size: 28, h: 56, dur: 2400 });
        fx.caption("(he walks on the water)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
      }
    },

    // Phantasm
    {
      id: 9638,
      y: 1979,
      run: async (fx) => {
        fx.filter("saturate(.7) contrast(1.2) brightness(.8)", 6000, { fade: 400 });
        const tune = [["D4", 1], ["F4", 1], ["A4", 1], ["D5", 1], ["C#5", 1], ["A4", 1], ["F4", 1], ["A4", 1]];
        fx.seq(tune.concat(tune, tune), { type: "square", vol: 0.04, beat: 0.18, filter: { freq: 1800 } });
        fx.chord(["D3", "A3"], 4.4, { type: "sawtooth", vol: 0.03, filter: { freq: 500 } });
        await fx.wait(1400);
        const sphere = A.S("0 0 40 40", '<circle cx="20" cy="20" r="16" fill="#cfd4d6" stroke="#fff" stroke-width="2"/><circle cx="14" cy="14" r="5" fill="#fff" opacity=".8"/><path d="M20 4 V0 M20 36 V40 M4 20 H0 M36 20 H40" stroke="#9aa2a6" stroke-width="3"/>');
        const hall = [W() * 0.1, H() * 0.3];
        fx.tone(900, 1.6, { type: "sine", vol: 0.06, vibrato: [20, 80] });
        const r = fx.rect(fx.slot());
        await fx.fly(sphere, hall, [r.x, r.y], { size: 44, dur: 1600, via: [W() * 0.6, H() * 0.2], easing: "ease-in" });
        fx.put(sphere, r.x, r.y, { size: 44, ms: 1200 });
        fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.tone(2400, 0.5, { type: "sawtooth", vol: 0.06, slide: 900 });
        fx.buzz([80, 30, 80]);
        fx.caption("BOOOOY!", { style: "hand", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // All That Jazz
    {
      id: 16858,
      y: 1979,
      run: async (fx) => {
        fx.caption("It's showtime, folks!", { style: "card", ms: 1400 });
        const drops = [0, 0.4, 0.8];
        drops.forEach((t) => fx.noise(0.15, { type: "highpass", freq: 3000, vol: 0.3, at: t }));
        await fx.wait(1400);
        const spots = [0.25, 0.5, 0.75].map((x) => fx.put('<div style="width:100%;height:100%;background:radial-gradient(ellipse at 50% 0, rgba(255,255,240,.7), transparent 70%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)"></div>', W() * x, H() * 0.4, { size: 140, h: H() * 0.8 }));
        spots.forEach((s, i) => fx.move(s, [{ transform: "rotate(-12deg)" }, { transform: "rotate(12deg)" }, { transform: "rotate(-12deg)" }], { duration: 1400, delay: i * 200, iterations: 2 }));
        const tune = [["C5", 1], ["C5", 1], ["Eb5", 1], ["F5", 1], ["G5", 2], ["Bb5", 1], ["G5", 1], ["F5", 2], ["Eb5", 2], ["C5", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 2400 } });
        for (let t = 0; t < 3; t += 0.36) { fx.noise(0.08, { type: "highpass", freq: 7000, vol: 0.1, at: t }); fx.thud({ freq: 90, vol: 0.2, dur: 0.1, at: t }); }
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "rotate(" + (i % 2 ? 6 : -6) + "deg) translateX(" + (i % 2 ? 4 : -4) + "px)" }, { transform: "none" }], { duration: 360, delay: 200 + (i % 4) * 90, iterations: 4, fill: "none" }));
        fx.buzz([20, 340, 20, 340, 20, 340, 20]);
        await fx.wait(3200);
        fx.caption("(bye bye life…)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // The Tin Drum
    {
      id: 659,
      y: 1979,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const drum = fx.put(A.S("0 0 70 60", '<ellipse cx="35" cy="14" rx="30" ry="10" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/><path d="M5 14 V46 C5 52 65 52 65 46 V14" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M5 20 L20 46 L35 20 L50 46 L65 20" stroke="#fff" stroke-width="3" fill="none"/>'), r.x, r.top + r.height + 30, { size: 70, h: 60 });
        void drum;
        for (let i = 0; i < 16; i++) {
          fx.noise(0.06, { type: "bandpass", freq: 1800, q: 1.5, vol: 0.5, at: i * 0.14 + (i % 4 === 3 ? 0.05 : 0) });
          fx.thud({ freq: 200, vol: 0.12, dur: 0.05, at: i * 0.14 });
        }
        await fx.wait(2400);
        fx.tone(2200, 1.3, { type: "sine", vol: 0.12, slide: 4400, vibrato: [8, 40] });
        fx.tone(3300, 1.3, { type: "sine", vol: 0.06, slide: 6000 });
        fx.caption("AAAAHHH!", { style: "hand", ms: 1400 });
        await fx.wait(500);
        const others = fx.otherSlots(true).slice(0, 8);
        for (const s of others) {
          const sr = fx.rect(s);
          fx.put('<div style="width:100%;height:100%;background:linear-gradient(135deg, transparent 45%, rgba(255,255,255,.9) 48%, transparent 51%), linear-gradient(45deg, transparent 45%, rgba(255,255,255,.9) 48%, transparent 51%)"></div>', sr.x, sr.y, { size: sr.width, h: sr.height, ms: 2200 });
          fx.noise(0.25, { type: "highpass", freq: 4000 + fx.rand(0, 3000), vol: 0.3 });
          fx.buzz(10);
          await fx.wait(90);
        }
        await fx.wait(1800);
      }
    },

    // Stalker
    {
      id: 1398,
      y: 1979,
      run: async (fx) => {
        const sepia = fx.filter("sepia(1) saturate(.6) brightness(.9)", 7400, { fade: 400 });
        fx.noise(7, { freq: 250, vol: 0.06, attack: 1 });
        for (let i = 0; i < 10; i++) fx.noise(0.12, { freq: 600, vol: 0.18, at: 0.3 + i * 0.5 });
        fx.chord(["E3", "B3"], 7, { type: "sawtooth", vol: 0.025, filter: { freq: 500 }, vibrato: [4, 5], attack: 1 });
        const nut = A.S("0 0 20 20", '<path d="M10 2 L17 6 V14 L10 18 L3 14 V6 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/><circle cx="10" cy="10" r="3" fill="#1d1a18"/><path d="M10 18 C12 22 8 26 12 30" stroke="#e8e4da" stroke-width="2" fill="none"/>');
        const r = fx.rect(fx.slot());
        await fx.fly(nut, [W() * 0.2, H() * 0.8], [r.x, r.y + 30], { size: 20, h: 30, dur: 1000, via: [W() * 0.4, H() * 0.4], r2: 600 });
        fx.click({ freq: 2500, vol: 0.4 });
        fx.put(nut, r.x, r.y + 30, { size: 20, h: 30, ms: 3000 });
        await fx.wait(1600);
        await fx.anim(sepia, [{ opacity: 1 }, { opacity: 0 }], { duration: 1200, fill: "forwards" });
        const glass = fx.put(A.S("0 0 30 40", '<path d="M6 4 H24 L22 36 H8 Z" fill="rgba(220,235,245,.5)" ' + A.ink + ' stroke-width="2"/><path d="M8 16 H22 V36 H8 Z" fill="rgba(255,255,255,.6)"/>'), W() * 0.3, H() * 0.72, { size: 30, h: 40 });
        fx.chord(["E4", "G#4", "B4"], 2.5, { type: "sine", vol: 0.04, attack: 0.5 });
        fx.buzz([10, 150, 10, 150, 10, 150, 10]);
        await fx.move(glass, [{ transform: "none" }, { transform: "translateX(" + W() * 0.2 + "px)" }], { duration: 2400, easing: "ease-in-out" });
        fx.noise(0.2, { type: "highpass", freq: 3500, vol: 0.4 });
        fx.remove(glass);
        await fx.wait(600);
      }
    },

    // The Warriors
    {
      id: 11474,
      y: 1979,
      run: async (fx) => {
        const night = fx.wash("rgba(10,10,40,.55)", 6400, { fade: 400 });
        void night;
        const bottles = ["M 6 20 C 6 10 14 8 14 2 H 18 C 18 8 26 10 26 20 V 50 H 6 Z"];
        const r = fx.rect(fx.slot());
        const clink = (at) => fx.tone(fx.rand(1800, 2400), 0.3, { type: "sine", vol: 0.08, at });
        for (let i = 0; i < 3; i++) {
          const b = fx.put(A.S("0 0 32 52", '<path d="' + bottles[0] + '" fill="rgba(80,140,90,.8)" ' + A.ink + ' stroke-width="2"/>'), W() * 0.3 + i * 44, H() * 0.7, { size: 24, h: 40 });
          void b;
          clink(i * 0.9);
          clink(i * 0.9 + 0.08);
          fx.later(i * 900, () => fx.caption(i < 2 ? "Warriors…" : "Come out to pla-ay!", { style: "subtitle", ms: 800, css: { bottom: "34vh" } }));
        }
        await fx.wait(2800);
        const tune = [["E4", 1], ["G4", 1], ["A4", 2], ["E4", 1], ["G4", 1], ["B4", 2]];
        fx.seq(tune.concat(tune), { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 1400 } });
        for (let t = 0; t < 2.2; t += 0.18) fx.thud({ freq: 70, vol: 0.2, dur: 0.1, at: t });
        const vest = A.S("0 0 50 60", '<path d="M8 4 H42 L46 56 H4 Z" fill="#7a4a1a" ' + A.ink + ' stroke-width="2"/><path d="M25 4 V56" stroke="#1d1a18" stroke-width="2"/><circle cx="25" cy="30" r="10" fill="#d9a13a"/>');
        for (let i = 0; i < 6; i++) fx.later(i * 200, () => fx.fly(vest, [-40, H() * 0.6 + (i % 3) * 20], [W() + 40, H() * 0.55 + (i % 3) * 20], { size: 34, h: 40, dur: 1600, easing: "steps(10)" }));
        await fx.wait(2600);
        void r;
      }
    },

    // Das Boot
    {
      id: 387,
      y: 1981,
      run: async (fx) => {
        const hull = fx.wash("radial-gradient(circle at 50% 50%, rgba(40,60,50,.2), rgba(5,15,10,.85))", 7000, { fade: 600 });
        void hull;
        fx.filter("saturate(.4) sepia(.3) brightness(.8)", 7000, { fade: 600 });
        for (let i = 0; i < 4; i++) {
          fx.tone(1480, 1.4, { type: "sine", vol: 0.12, at: i * 1.3, attack: 0.002 });
          fx.tone(1485, 1.4, { type: "sine", vol: 0.05, at: i * 1.3 + 0.05, attack: 0.002 });
        }
        await fx.wait(2800);
        fx.caption("(ping)", { style: "whisper", ms: 1200, css: { color: "#cfe" } });
        await fx.wait(1600);
        for (let i = 0; i < 3; i++) {
          fx.thud({ vol: 0.9, freq: 45, dur: 0.8, at: i * 0.7 });
          fx.noise(0.6, { freq: 300, vol: 0.5, at: i * 0.7 });
        }
        fx.shake("lg", 2000);
        fx.buzz([200, 500, 200, 500, 300]);
        const rivet = A.S("0 0 20 20", '<circle cx="10" cy="10" r="6" fill="#6d7478" ' + A.ink + ' stroke-width="2"/>');
        fx.later(600, () => fx.particles({ kind: "burst", count: 6, glyphs: rivet, min: 10, max: 16, spread: 120, dur: 900, stagger: 800 }));
        fx.particles({ kind: "fall", count: 30, glyphs: A.drop("#9cc"), min: 4, max: 8, dur: 1300, stagger: 2000 });
        await fx.wait(2400);
      }
    }
  ]);
})();
