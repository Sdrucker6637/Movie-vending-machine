/* Machine FX cues - 2009 onward: festival cinema, animation, documentary and cult.
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

  M.register([
    // Dogtooth
    {
      id: 38810,
      y: 2009,
      run: async (fx) => {
        fx.filter("saturate(.7) brightness(1.1)", 7000, { fade: 300 });
        fx.wash("rgba(240,245,240,.3)", 7000, { fade: 300 });
        const lessons = [["sea", "a leather armchair"], ["motorway", "a very strong wind"], ["zombie", "a small yellow flower"]];
        for (const [w, m] of lessons) {
          fx.caption("“" + w + "” means " + m + ".", { style: "subtitle", ms: 1700 });
          fx.click({ freq: 1200, vol: 0.2 });
          await fx.wait(1800);
        }
        const plane = A.S("0 0 60 20", '<path d="M2 10 L40 8 L58 4 L54 10 L58 16 L40 12 Z" fill="#9aa2a6"/>');
        fx.tone(600, 1.8, { type: "sine", vol: 0.04, slide: 400 });
        const r = fx.rect(fx.slot());
        await fx.fly(plane, [-60, H() * 0.15], [r.x, r.y], { size: 40, h: 14, dur: 1400, easing: "ease-in" });
        fx.put(A.S("0 0 30 20", '<path d="M2 10 L20 8 L28 4 L26 10 L28 16 L20 12 Z" fill="#9aa2a6"/>'), r.x, r.y, { size: 24, h: 16, ms: 1600 });
        fx.caption("(a toy plane lands in the garden)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // The Secret of Kells
    {
      id: 26963,
      y: 2009,
      run: async (fx) => {
        const cx = W() / 2, cy = H() * 0.42;
        const knot = fx.put(A.S("0 0 120 120", '<g fill="none" stroke-width="6" stroke-linecap="round">' +
          '<path d="M20 60 C20 20 60 20 60 60 C60 100 100 100 100 60 C100 20 60 20 60 60 C60 100 20 100 20 60 Z" stroke="#3aa655"/>' +
          '<path d="M60 20 C100 20 100 60 60 60 C20 60 20 100 60 100 C100 100 100 60 60 60 C20 60 20 20 60 20 Z" stroke="#f2c94c"/>' +
          '<circle cx="60" cy="60" r="54" stroke="#d51f2a" stroke-width="3" stroke-dasharray="6 5"/></g>'),
          cx, cy, { size: 180 });
        const paths = knot.querySelectorAll("path");
        paths.forEach((p) => { p.style.strokeDasharray = 600; p.style.strokeDashoffset = 600; });
        fx.wash("radial-gradient(circle, rgba(250,240,210,.4), rgba(40,70,40,.5))", 6400, { fade: 500 });
        const whistle = [["D5", 1], ["E5", 1], ["F#5", 2], ["A5", 1], ["F#5", 1], ["E5", 2], ["D5", 1], ["B4", 1], ["D5", 4]];
        fx.seq(whistle, { type: "sine", vol: 0.1, beat: 0.25, vibrato: [6, 8] });
        fx.tone("D3", 4, { type: "sawtooth", vol: 0.03, filter: { freq: 400 } });
        await fx.tween(fx.reduced ? 10 : 3000, (k) => paths.forEach((p) => (p.style.strokeDashoffset = 600 * (1 - k))));
        paths.forEach((p) => (p.style.strokeDashoffset = 0));
        fx.move(knot, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }], { duration: 2000, easing: "ease-in-out" });
        fx.particles({ kind: "burst", from: knot, count: 16, spread: 80, glyphs: A.leaf("#6aa04a"), min: 8, max: 14, dur: 1400 });
        fx.caption("(the Book of Iona)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
      }
    },

    // A Town Called Panic
    {
      id: 40623,
      y: 2009,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const fig = (c) => A.S("0 0 40 50", '<rect x="10" y="8" width="20" height="26" rx="4" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="8" r="7" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><rect x="8" y="34" width="24" height="14" fill="#2d8a3a" ' + A.ink + ' stroke-width="2"/>');
        const cow = fx.put(fig("#f4f0e6"), W() / 2 - 60, H() * 0.7, { size: 40, h: 50 });
        const cowboy = fx.put(fig("#e0b34a"), W() / 2, H() * 0.7, { size: 40, h: 50 });
        const horse = fx.put(fig("#8a5a2a"), W() / 2 + 60, H() * 0.7, { size: 40, h: 50 });
        fx.caption("(50 bricks. He ordered 50 million.)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 5; i++) {
          [cow, cowboy, horse].forEach((f, k) => fx.move(f, [{ transform: "none" }, { transform: "translateY(-" + (20 + k * 6) + "px)" }, { transform: "none" }], { duration: 250, delay: k * 80, easing: "steps(3)" }));
          fx.tone(fx.pick([600, 800, 1000]), 0.1, { type: "square", vol: 0.08 });
          await fx.wait(300);
        }
        const brick = A.S("0 0 30 16", '<rect x="1" y="1" width="28" height="14" fill="#b3402d" ' + A.ink + ' stroke-width="1.5"/>');
        fx.particles({ kind: "fall", count: 60, glyphs: brick, min: 14, max: 22, dur: 1600, spin: 180, stagger: 1500 });
        for (let t = 0; t < 1.8; t += 0.05) fx.thud({ freq: 150, vol: 0.12, dur: 0.05, at: t });
        fx.shake("md", 1600);
        fx.buzz([40, 30, 40, 30, 40, 30, 100]);
        fx.caption("Horse!", { style: "hand", ms: 1400 });
        await fx.wait(2400);
        void r;
      }
    },

    // Uncle Boonmee Who Can Recall His Past Lives
    {
      id: 38368,
      y: 2010,
      run: async (fx) => {
        const night = fx.wash("rgba(10,20,15,.7)", 7400, { fade: 800 });
        void night;
        fx.noise(7, { type: "bandpass", freq: 4500, q: 2, vol: 0.06, attack: 1 });
        for (let t = 0; t < 7; t += 0.2) fx.tone(4200 + Math.random() * 400, 0.05, { type: "sine", vol: 0.02, at: t });
        await fx.wait(2400);
        const eyes = [[0.2, 0.3], [0.75, 0.25], [0.6, 0.6], [0.3, 0.7]];
        for (const [x, y] of eyes) {
          const e = fx.put(A.S("0 0 40 16", '<circle cx="10" cy="8" r="5" fill="#ff2020"/><circle cx="30" cy="8" r="5" fill="#ff2020"/>'), W() * x, H() * y, { size: 30, h: 12, style: { filter: "drop-shadow(0 0 6px #ff2020)" } });
          fx.anim(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
          await fx.wait(700);
        }
        fx.caption("(the monkey ghosts have come to dinner)", { style: "whisper", ms: 2400, css: { color: "#ddd" } });
        fx.chord(["A3", "E4"], 3, { type: "sine", vol: 0.03, attack: 1 });
        await fx.wait(2400);
      }
    },

    // Rubber
    {
      id: 45649,
      y: 2010,
      run: async (fx) => {
        fx.wash("linear-gradient(#ffd080, #e09a4a)", 6600, { blend: "multiply", fade: 400, opacity: 0.45 });
        fx.caption("No reason.", { style: "card", ms: 1600 });
        await fx.wait(1600);
        const tire = fx.put(A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#1d1a18"/><circle cx="30" cy="30" r="12" fill="#6d7478" stroke="#1d1a18" stroke-width="2"/><path d="M30 4 V14 M30 46 V56 M4 30 H14 M46 30 H56" stroke="#333" stroke-width="3"/>'), -40, H() * 0.7, { size: 56 });
        fx.tone(80, 2, { type: "sawtooth", vol: 0.04, filter: { freq: 200 } });
        await fx.move(tire, [{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + (W() / 2 + 40) + "px) rotate(720deg)" }], { duration: 2000, easing: "ease-out" });
        fx.move(tire, [{ transform: "translateX(" + (W() / 2 + 40) + "px) rotate(720deg)" }, { transform: "translateX(" + (W() / 2 + 40) + "px) rotate(716deg) scale(1.05)" }, { transform: "translateX(" + (W() / 2 + 40) + "px) rotate(720deg)" }], { duration: 500, iterations: 3 });
        fx.tone(3000, 1.5, { type: "sine", vol: 0.06, vibrato: [20, 200] });
        const r = fx.rect(fx.slot());
        const lift = A.liftSlot(fx, 2400);
        void lift;
        await fx.wait(1500);
        fx.noise(0.4, { type: "lowpass", freq: 600, vol: 0.8 });
        fx.thud({ vol: 0.6 });
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 20, spread: 60, glyphs: dot("#b3122a"), min: 3, max: 8, dur: 800, stagger: 0 });
        fx.style(fx.slot(), { transform: "scale(0)" }, 900);
        fx.buzz([80]);
        fx.caption("(the tire did it with its mind)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Birdemic: Shock and Terror
    {
      id: 40016,
      y: 2010,
      run: async (fx) => {
        fx.filter("saturate(1.3) contrast(.9) blur(.4px)", 6600, { fade: 200 });
        const bird = A.S("0 0 50 30", '<path d="M25 18 C18 6 8 2 0 6 C10 8 16 14 20 20 L25 22 L30 20 C34 14 40 8 50 6 C42 2 32 6 25 18 Z" fill="#1d1a18"/><circle cx="25" cy="18" r="3" fill="#d51f2a"/>');
        for (let i = 0; i < 6; i++) {
          const b = fx.put(bird, fx.rand(40, W() - 40), fx.rand(80, H() * 0.6), { size: 60, h: 36 });
          fx.move(b, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 600, iterations: 8, easing: "steps(1)" });
          fx.tone(1200, 0.5, { type: "sawtooth", vol: 0.04, slide: 1500, filter: { freq: 3000 }, at: i * 0.3 });
        }
        fx.caption("(the eagles are not moving their wings)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
        const hanger = A.S("0 0 60 30", '<path d="M30 4 C36 4 36 10 30 12 L4 26 H56 L30 12" fill="none" stroke="#9aa2a6" stroke-width="3"/>');
        const r = fx.rect(fx.slot());
        fx.put(hanger, r.x, r.y, { size: 60, h: 30, ms: 2400 });
        fx.caption("(she fights them off with a coat hanger)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 6; i++) fx.noise(0.1, { type: "highpass", freq: 3000, vol: 0.3, at: i * 0.3 });
        await fx.wait(2600);
      }
    },

    // Exit Through the Gift Shop
    {
      id: 39452,
      y: 2010,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const wall = fx.wash("repeating-linear-gradient(0deg, rgba(160,150,140,.35) 0 20px, rgba(140,130,120,.35) 20px 22px)", 6600, { fade: 300 });
        void wall;
        for (let i = 0; i < 4; i++) fx.noise(0.6, { type: "bandpass", freq: 4000, q: 1, vol: 0.2, at: i * 0.7 });
        fx.caption("(psssst)", { style: "whisper", ms: 1200 });
        const stencil = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="36" r="22" fill="#1d1a18"/><rect x="28" y="30" width="44" height="12" fill="#d51f2a"/><path d="M30 60 H70 L74 96 H26 Z" fill="#1d1a18"/><path d="M24 70 L6 50 M76 70 L94 50" stroke="#1d1a18" stroke-width="6"/>'), r.x, r.y, { size: r.width * 0.9, h: r.height * 0.8 });
        await fx.tween(fx.reduced ? 10 : 2600, (k) => (stencil.style.clipPath = "inset(0 0 " + (1 - k) * 100 + "% 0)"));
        fx.caption("(the art is on your poster now)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const tag = fx.put('<div style="font:700 13px Georgia,serif;color:#fff;background:#d51f2a;padding:4px 8px;transform:rotate(-8deg);white-space:nowrap">SOLD — $1,000,000</div>', r.x, r.top - 10, { size: 170, h: 24 });
        fx.tone(2400, 0.3, { type: "sine", vol: 0.1 });
        fx.tone(3200, 0.3, { type: "sine", vol: 0.1, at: 0.15 });
        void tag;
        await fx.wait(1600);
      }
    },

    // Trollhunter
    {
      id: 46146,
      y: 2010,
      run: async (fx) => {
        fx.filter("saturate(.8) contrast(1.1)", 7000, { fade: 200 });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 7000, style: { opacity: 0.35 } });
        const night = fx.wash("rgba(10,30,20,.55)", 7000, { fade: 300 });
        void night;
        fx.caption("TROLL!", { style: "hand", ms: 1200 });
        const troll = fx.put(A.S("0 0 160 240", '<path d="M40 60 C30 20 70 0 90 10 C120 0 140 30 130 70 L140 200 L120 240 H50 L30 200 Z" fill="#5a5a4a"/><path d="M60 30 C66 20 80 20 86 30 M100 36 C104 28 114 28 118 36" stroke="#3a3a2a" stroke-width="4" fill="none"/><path d="M84 60 C86 80 76 90 70 96" stroke="#3a3a2a" stroke-width="6" fill="none"/><path d="M30 120 L0 180 M130 120 L160 180" stroke="#5a5a4a" stroke-width="18" stroke-linecap="round"/>'),
          W() / 2, H() + 140, { size: 200, h: 300 });
        for (let i = 0; i < 4; i++) { fx.thud({ vol: 0.9, freq: 40, dur: 0.6, at: i * 0.6 }); }
        fx.buzz([200, 400, 200, 400, 200]);
        fx.shake("md", 2400);
        await fx.move(troll, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.6 + "px)" }], { duration: 2400, easing: "ease-out" });
        const uv = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle, #fff, rgba(200,230,255,.8) 30%, transparent 70%)"></div>', W() / 2, H() * 0.45, { size: 80 });
        fx.tone(200, 1.2, { type: "sawtooth", vol: 0.1, slide: 2000 });
        await fx.move(uv, [{ transform: "scale(.2)" }, { transform: "scale(20)" }], { duration: 700, easing: "ease-in" });
        fx.flash("#fff", 400);
        fx.remove(troll);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.5), count: 30, spread: 90, gravity: 120, glyphs: dot("#8a857a"), min: 6, max: 16, dur: 1200, stagger: 0 });
        fx.caption("(it turned to stone)", { style: "whisper", ms: 1400, css: { color: "#fff" } });
        await fx.wait(1500);
      }
    },

    // The Illusionist (2010)
    {
      id: 41201,
      y: 2010,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(.8) brightness(1.05)", 7000, { fade: 400 });
        fx.wash("linear-gradient(rgba(210,220,230,.35), rgba(170,160,140,.35))", 7000, { fade: 400 });
        const r = fx.rect(fx.slot());
        const hat = fx.put(A.S("0 0 60 50", '<path d="M14 40 H46 V8 H14 Z" fill="#1d1a18"/><path d="M4 42 H56" stroke="#1d1a18" stroke-width="5" stroke-linecap="round"/>'), r.x, r.top + r.height + 20, { size: 50, h: 42 });
        const tune = [["G4", 2], ["B4", 1], ["D5", 1], ["G5", 3], ["F#5", 1], ["E5", 2], ["D5", 2], ["B4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.3 });
        await fx.wait(1200);
        const rabbit = fx.put(A.S("0 0 40 50", '<path d="M14 20 L10 0 L18 18 M26 20 L30 0 L22 18" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><ellipse cx="20" cy="30" rx="14" ry="12" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="16" cy="28" r="1.5" fill="#1d1a18"/><circle cx="24" cy="28" r="1.5" fill="#1d1a18"/>'), r.x, r.top + r.height + 4, { size: 36, h: 45 });
        await fx.move(rabbit, [{ transform: "translateY(20px)", opacity: 0 }, { transform: "translateY(-30px)", opacity: 1 }], { duration: 600, easing: "cubic-bezier(.3,1.6,.6,1)" });
        fx.tone(1400, 0.3, { type: "sine", vol: 0.08 });
        fx.move(rabbit, [{ transform: "translateY(-30px)" }, { transform: "translateY(-30px) rotate(-10deg)" }, { transform: "translateY(-30px)" }], { duration: 600 });
        await fx.wait(1600);
        fx.caption("Magicians do not exist.", { style: "subtitle", ms: 2200 });
        fx.move(hat, [{ opacity: 1 }, { opacity: 0.4 }], { duration: 2000, fill: "forwards" });
        await fx.wait(2200);
      }
    },

    // Once Upon a Time in Anatolia
    {
      id: 74879,
      y: 2011,
      run: async (fx) => {
        const dusk = fx.wash("linear-gradient(#1a2030, #3a3a40 60%, #6a5a40)", 8000, { fade: 800, blend: "multiply", opacity: 0.7 });
        void dusk;
        const hills = fullSvg(fx, A.S("0 0 400 300", '<path d="M0 300 V200 C60 170 120 190 200 160 C280 130 340 170 400 150 V300 Z" fill="rgba(20,20,20,.8)"/><path d="M200 160 C206 130 214 120 220 110" stroke="rgba(20,20,20,.9)" stroke-width="4"/><circle cx="220" cy="104" r="16" fill="rgba(20,20,20,.9)"/>'));
        void hills;
        const cars = [0, 1, 2].map((i) => fx.put('<div style="width:100%;height:100%;display:flex;gap:10px;justify-content:center"><span style="width:6px;height:6px;border-radius:50%;background:#fff6c0;box-shadow:0 0 10px 4px rgba(255,246,192,.8)"></span><span style="width:6px;height:6px;border-radius:50%;background:#fff6c0;box-shadow:0 0 10px 4px rgba(255,246,192,.8)"></span></div>', W() * (0.1 + i * 0.08), H() * 0.72 - i * 12, { size: 40, h: 10 }));
        fx.tone(70, 7, { type: "sawtooth", vol: 0.04, filter: { freq: 200 }, attack: 1 });
        fx.noise(7, { type: "bandpass", freq: 700, q: 0.6, vol: 0.12, attack: 1.5 });
        cars.forEach((c, i) => fx.move(c, [{ transform: "none" }, { transform: "translate(" + W() * 0.5 + "px,-" + H() * 0.1 + "px)" }], { duration: 6000, delay: i * 300, easing: "linear" }));
        await fx.wait(2600);
        fx.caption("It was by a fountain. Round. Near a tree.", { style: "subtitle", ms: 2600 });
        await fx.wait(2800);
        fx.caption("(they've tried eleven fountains)", { style: "whisper", ms: 1800, css: { color: "#ddd" } });
        await fx.wait(1800);
      },
      maxMs: 12000
    },

    // Jiro Dreams of Sushi
    {
      id: 80767,
      y: 2011,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const counter = fx.put(box("background:linear-gradient(#e8d8b8,#c8b890);border-top:4px solid #8a6a3a"), W() / 2, r.top + r.height + 40, { size: Math.min(W() - 20, 360), h: 40 });
        void counter;
        const piece = (c) => A.S("0 0 50 30", '<ellipse cx="25" cy="22" rx="20" ry="7" fill="#f4f2ec" ' + A.ink + ' stroke-width="1.5"/><path d="M6 18 C10 6 40 6 44 18 C40 14 10 14 6 18 Z" fill="' + c + '" ' + A.ink + ' stroke-width="1.5"/>');
        const cols = ["#e8603a", "#d51f2a", "#f2c0a0", "#c83a5a", "#f4e8d0"];
        const beat = 0.5;
        for (let i = 0; i < cols.length; i++) {
          fx.put(piece(cols[i]), W() / 2 + (i - 2) * 50, r.top + r.height + 28, { size: 44, h: 26 });
          fx.thud({ freq: 300, vol: 0.12, dur: 0.05 });
          fx.chord(["G4", "B4", "D5"], 0.6, { type: "triangle", vol: 0.04 });
          await fx.wait(beat * 1000);
        }
        fx.caption("You must fall in love with your work.", { style: "subtitle", ms: 2200 });
        fx.seq([["G5", 2], ["F#5", 2], ["E5", 2], ["D5", 2], ["G5", 4]], { type: "sine", vol: 0.06, beat: 0.3 });
        await fx.wait(2400);
      }
    },

    // Melancholia
    {
      id: 62215,
      y: 2011,
      run: async (fx) => {
        fx.filter("saturate(.7) brightness(.95)", 8000, { fade: 600 });
        const planet = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 35%, #bfe0ff, #4a7ab8 50%, #1a2a5a);box-shadow:0 0 40px rgba(120,170,255,.5)"></div>', W() / 2, H() * 0.25, { size: 40 });
        const chord = (at) => fx.chord(["A3", "C4", "E4"], 2.2, { type: "sawtooth", vol: 0.04, at, filter: { freq: 1200 }, attack: 0.4 });
        chord(0); fx.chord(["F3", "A3", "C4"], 2.2, { type: "sawtooth", vol: 0.04, at: 2.2, filter: { freq: 1200 }, attack: 0.4 });
        fx.chord(["D3", "F3", "A3"], 2.4, { type: "sawtooth", vol: 0.045, at: 4.4, filter: { freq: 1200 }, attack: 0.4 });
        fx.seq([[null, 2], ["E5", 4], ["F5", 2], ["E5", 2], ["D5", 4], ["C5", 4]], { type: "sine", vol: 0.06, beat: 0.35 });
        await fx.move(planet, [{ transform: "scale(1)" }, { transform: "scale(" + Math.max(W(), H()) / 30 + ")" }], { duration: 6400, easing: "cubic-bezier(.6,0,1,.8)" });
        fx.flash("#fff", 600);
        fx.thud({ vol: 1, freq: 35, dur: 1.2 });
        fx.noise(1.4, { freq: 400, vol: 0.6 });
        fx.shake("lg", 1000);
        fx.buzz([400]);
        await fx.wait(1200);
      },
      maxMs: 12000
    },

    // The Tree of Life
    {
      id: 8967,
      y: 2011,
      run: async (fx) => {
        const cosmos = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 50%, rgba(255,180,90,.5), rgba(120,30,90,.5) 40%, rgba(5,5,20,.9) 75%)", opacity: 0 } });
        fx.anim(cosmos, [{ opacity: 0 }, { opacity: 1 }], { duration: 1600, fill: "forwards" });
        fx.chord(["D3", "A3", "D4", "F#4", "A4"], 5, { type: "sine", vol: 0.05, attack: 2 });
        fx.seq([["D5", 4], ["E5", 2], ["F#5", 2], ["A5", 6], ["G5", 2], ["F#5", 4]], { type: "triangle", vol: 0.06, beat: 0.3, at: 1 });
        fx.particles({ kind: "drift", count: 40, glyphs: [dot("#fff6c0"), dot("#ffb0d0"), dot("#b0d0ff")], min: 2, max: 6, dur: 3600, stagger: 3000 });
        if (!fx.reduced) fx.anim(cosmos, [{ transform: "scale(1) rotate(0)" }, { transform: "scale(1.4) rotate(40deg)" }], { duration: 6000, fill: "forwards" });
        await fx.wait(3400);
        fx.caption("Where were you?", { style: "whisper", ms: 2000, css: { color: "#fff" } });
        await fx.wait(2200);
        const tree = fx.put(A.S("0 0 100 140", '<path d="M50 140 V80 M50 100 L20 60 M50 90 L84 56 M50 80 L40 30 M50 80 L64 24" stroke="#3b2a1a" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="50" cy="40" r="36" fill="rgba(80,140,60,.85)"/>'), W() / 2, H() * 0.55, { size: 120, h: 168, style: { transformOrigin: "50% 100%" } });
        fx.move(tree, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 1400, easing: "ease-out" });
        await fx.wait(1600);
      },
      maxMs: 12000
    },

    // Holy Motors
    {
      id: 103328,
      y: 2012,
      run: async (fx) => {
        fx.wash("rgba(20,20,30,.35)", 7000, { fade: 300 });
        const limo = A.S("0 0 220 50", '<path d="M8 30 C8 20 20 16 34 16 H180 C196 16 210 20 212 30 V38 H8 Z" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><rect x="40" y="20" width="130" height="10" fill="#1d1a18"/><circle cx="40" cy="40" r="8" fill="#1d1a18"/><circle cx="180" cy="40" r="8" fill="#1d1a18"/>');
        fx.fly(limo, [-230, H() - 70], [W() + 230, H() - 70], { size: 240, h: 55, dur: 3000, easing: "linear" });
        fx.tone(60, 3, { type: "sawtooth", vol: 0.04, filter: { freq: 200 } });
        await fx.wait(1600);
        const guises = [
          '<path d="M30 60 C30 20 90 20 90 60 C90 90 80 110 60 110 C40 110 30 90 30 60 Z" fill="#d8d0c0" stroke="#1f1b16" stroke-width="3"/><path d="M40 50 C50 40 70 40 80 50" stroke="#aaa" stroke-width="4"/>',
          '<path d="M20 40 H100 L94 150 H26 Z" fill="#3a6ad8" stroke="#1f1b16" stroke-width="3"/><circle cx="40" cy="70" r="4" fill="#f2c94c"/><circle cx="80" cy="70" r="4" fill="#f2c94c"/>',
          '<path d="M30 30 C30 0 90 0 90 30 L96 70 C80 60 40 60 24 70 Z" fill="#6aa04a" stroke="#1f1b16" stroke-width="3"/><circle cx="46" cy="50" r="5" fill="#fff"/><circle cx="74" cy="50" r="5" fill="#fff"/>'
        ];
        for (const g of guises) {
          fx.costume(".reely", g, 1000);
          fx.click({ freq: 900, vol: 0.4 });
          fx.noise(0.2, { type: "bandpass", freq: 1800, q: 2, vol: 0.2 });
          await fx.wait(1100);
        }
        fx.caption("Intermission!", { style: "card", ms: 1400 });
        const beat = 0.2;
        for (let i = 0; i < 12; i++) fx.noise(0.3, { type: "bandpass", freq: 700 + (i % 3) * 300, q: 1.5, vol: 0.2, at: i * beat });
        fx.move([fx.$(".reely"), fx.$(".kernel")], [{ transform: "none" }, { transform: "translateY(-8px)" }, { transform: "none" }], { duration: beat * 2000, iterations: 6 });
        await fx.wait(2200);
      }
    },

    // Wadjda
    {
      id: 129112,
      y: 2012,
      run: async (fx) => {
        fx.filter("saturate(1.1) sepia(.15)", 6600, { fade: 300 });
        fx.wash("linear-gradient(transparent 60%, rgba(220,190,140,.45))", 6600, { fade: 400 });
        const bike = A.S("0 0 100 60", '<circle cx="22" cy="44" r="14" fill="none" ' + A.ink + '/><circle cx="78" cy="44" r="14" fill="none" ' + A.ink + '/><path d="M22 44 L40 22 H64 L78 44 M40 22 L50 44 L64 22 M36 16 H46 M64 12 L70 20" fill="none" stroke="#3aa655" stroke-width="5"/><path d="M68 10 C74 4 84 8 80 14" stroke="#d51f2a" stroke-width="3" fill="none"/>');
        const r = fx.rect(fx.slot());
        const b = fx.put(bike, r.x, r.top + r.height + 30, { size: 90, h: 54 });
        fx.move(b, [{ transform: "rotate(-2deg)" }, { transform: "rotate(2deg)" }, { transform: "rotate(-2deg)" }], { duration: 1200, iterations: 2 });
        fx.caption("(the green bicycle in the shop window)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        fx.tone(2400, 0.15, { type: "sine", vol: 0.1 });
        fx.tone(2400, 0.15, { type: "sine", vol: 0.1, at: 0.2 });
        const tune = [["E5", 1], ["G5", 1], ["A5", 2], ["C6", 2], ["B5", 1], ["A5", 1], ["G5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.2 });
        await fx.move(b, [{ transform: "none" }, { transform: "translateX(" + (W() - r.x + 100) + "px)" }], { duration: 2400, easing: "ease-in" });
        fx.caption("(she wins the race)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // The Great Beauty
    {
      id: 179144,
      y: 2013,
      run: async (fx) => {
        const rome = fx.wash("linear-gradient(#ffd8a0, #e8906a 60%, #8a4a6a)", 7000, { blend: "multiply", fade: 500, opacity: 0.45 });
        void rome;
        const beat = 0.25;
        for (let i = 0; i < 16; i++) { fx.thud({ freq: 60, vol: i % 2 ? 0.1 : 0.3, dur: 0.1, at: i * beat }); fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.1, at: i * beat + beat / 2 }); }
        fx.seq([["A4", 2], ["A4", 2], ["C5", 2], ["E5", 2], ["D5", 4], ["C5", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2000 } });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? 6 : -6) + "px)" }, { transform: "none" }], { duration: beat * 2000, iterations: 8, delay: (i % 3) * 60, fill: "none" }));
        fx.caption("(the conga line on the terrace)", { style: "whisper", ms: 1800 });
        await fx.wait(4000);
        fx.caption("I didn't want to simply be a socialite. I wanted to become the king of the socialites.", { style: "subtitle", ms: 2600, css: { fontSize: "13px" } });
        fx.particles({ kind: "drift", count: 20, glyphs: A.S("0 0 20 20", '<path d="M10 2 C14 8 16 12 10 18 C4 12 6 8 10 2 Z" fill="#ffc0d8"/>'), min: 8, max: 14, dur: 2400 });
        await fx.wait(2800);
      }
    },

    // Under the Skin
    {
      id: 97370,
      y: 2014,
      run: async (fx) => {
        const black = fx.node("", { cls: "fx-filter", style: { background: "#050505", opacity: 0 } });
        fx.anim(black, [{ opacity: 0 }, { opacity: 0.94 }], { duration: 1000, fill: "forwards" });
        const drone = [["F#4", 1], ["G4", 1], ["F#4", 1], ["F4", 1]];
        for (let i = 0; i < 4; i++) fx.seq(drone, { type: "sawtooth", vol: 0.04, beat: 0.35, at: i * 1.4, filter: { type: "bandpass", freq: 1200, q: 4 }, vibrato: [4, 20] });
        fx.tone(45, 6, { type: "sine", vol: 0.1, attack: 1 });
        await fx.wait(1600);
        const r = fx.rect(fx.slot());
        const s = A.liftSlot(fx, 5000);
        if (s) fx.style(s, { filter: "brightness(1.3) contrast(1.2)" }, 5000);
        const floor = fx.put(box("background:linear-gradient(#050505, rgba(20,20,20,.9));border-top:1px solid rgba(255,255,255,.3)"), W() / 2, r.y + r.height * 0.2, { size: W(), h: H() });
        void floor;
        fx.caption("(the black liquid rises)", { style: "whisper", ms: 2400, css: { color: "#aaa" } });
        await fx.move(floor, [{ transform: "translateY(" + H() * 0.2 + "px)" }, { transform: "translateY(-" + r.height * 0.4 + "px)" }], { duration: 3200, easing: "linear" });
        await fx.wait(600);
      }
    },

    // A Pigeon Sat on a Branch Reflecting on Existence
    {
      id: 110390,
      y: 2014,
      run: async (fx) => {
        fx.filter("saturate(.3) brightness(1.15) contrast(.9)", 7400, { fade: 400 });
        fx.wash("rgba(200,215,205,.35)", 7400, { fade: 400 });
        const pigeon = fx.put(A.S("0 0 60 40", '<path d="M8 26 C12 14 28 10 40 14 L50 10 L48 18 C50 24 46 30 38 30 L16 32 Z" fill="#8a8a90" ' + A.ink + ' stroke-width="1.5"/><path d="M0 34 H60" stroke="#6b4a2a" stroke-width="4"/><circle cx="44" cy="14" r="1.5" fill="#d51f2a"/>'), W() / 2, H() * 0.3, { size: 70, h: 46 });
        fx.move(pigeon, [{ transform: "none" }, { transform: "rotate(-4deg)" }, { transform: "none" }], { duration: 2400, iterations: 2 });
        for (let i = 0; i < 3; i++) fx.tone(500, 0.4, { type: "sine", vol: 0.04, at: 1 + i * 1.6, slide: 420 });
        await fx.wait(1400);
        fx.caption("We want to help people have fun.", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
        fx.caption("(vampire teeth, extra-long)", { style: "whisper", ms: 1600 });
        fx.put(A.S("0 0 40 20", '<path d="M4 4 H36 L30 10 L28 18 L24 10 H16 L12 18 L10 10 Z" fill="#f4f2ec" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.6, { size: 40, h: 20, ms: 1800 });
        fx.caption("I'm happy to hear you're doing fine.", { style: "subtitle", ms: 1800, css: { bottom: "28vh" } });
        await fx.wait(2000);
      }
    },

    // It Follows
    {
      id: 270303,
      y: 2014,
      run: async (fx) => {
        fx.filter("saturate(.8) contrast(1.05)", 8000, { fade: 400 });
        const synth = [["A3", 1], ["A3", 1], ["C4", 1], ["A3", 1], ["G#3", 2], ["E3", 2]];
        fx.seq(synth.concat(synth), { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 900, q: 3 } });
        fx.tone(55, 7, { type: "square", vol: 0.03, filter: { freq: 200 } });
        const walker = fx.put(A.S("0 0 30 70", '<circle cx="15" cy="8" r="7" fill="#1d1a18"/><path d="M6 16 H24 L22 44 H8 Z" fill="#e8e4da"/><path d="M8 44 L6 68 M22 44 L24 68" stroke="#1d1a18" stroke-width="4"/>'), W() * 0.9, H() * 0.3, { size: 24, h: 56 });
        const r = fx.rect(fx.slot());
        const k = fx.reduced ? 1 : 0;
        await fx.tween(fx.reduced ? 10 : 6400, (p) => {
          const q = Math.max(k, p);
          walker.style.transform = "translate(" + (r.x - W() * 0.9) * q + "px," + (r.y - H() * 0.3) * q + "px) scale(" + (1 + q * 1.6) + ")";
        });
        fx.buzz([60, 60, 60]);
        fx.chord(["A2", "Bb2", "E3"], 1, { type: "sawtooth", vol: 0.1, filter: { freq: 1200 } });
        fx.caption("(it's slow — but it's always walking toward you)", { style: "whisper", ms: 1600 });
        await fx.wait(1500);
      },
      maxMs: 12000
    },

    // Toni Erdmann
    {
      id: 374475,
      y: 2016,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.9)", 7000, { fade: 300 });
        const teeth = A.S("0 0 60 30", '<path d="M4 10 C20 0 40 0 56 10 L50 20 C40 26 20 26 10 20 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><path d="M14 10 V20 M22 8 V22 M30 8 V22 M38 8 V22 M46 10 V20" stroke="#bbb" stroke-width="1.5"/>');
        fx.costume(".reely", '<g transform="translate(30 62) scale(1)">' + '<path d="M4 10 C20 0 40 0 56 10 L50 20 C40 26 20 26 10 20 Z" fill="#f4f0e6" stroke="#1f1b16" stroke-width="2"/></g><path d="M34 34 C30 20 42 12 60 12 C78 12 90 20 86 34 C78 26 42 26 34 34 Z" fill="#3b3530"/>', 3000);
        void teeth;
        fx.caption("(fake teeth, bad wig)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
        const kukeri = fx.put(A.S("0 0 100 160", '<path d="M50 4 C90 10 100 60 96 150 H4 C0 60 10 10 50 4 Z" fill="#8a6a4a"/>' + Array.from({ length: 30 }, (_, i) => '<path d="M' + (8 + (i % 6) * 16) + " " + (30 + Math.floor(i / 6) * 24) + ' l6 14" stroke="#5a4a2a" stroke-width="3"/>').join("") + '<circle cx="40" cy="36" r="4" fill="#1d1a18"/><circle cx="60" cy="36" r="4" fill="#1d1a18"/>'),
          W() / 2, H() * 0.5, { size: 120, h: 190 });
        fx.move(kukeri, [{ transform: "none" }, { transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }, { transform: "none" }], { duration: 800, iterations: 3 });
        for (let t = 0; t < 2.4; t += 0.2) fx.noise(0.12, { type: "bandpass", freq: 900, q: 1, vol: 0.2, at: t });
        fx.caption("(a Kukeri costume, at your birthday party)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        fx.caption("♪ The Greatest Love of All ♪", { style: "hand", ms: 1600 });
        await fx.wait(1600);
        void r;
      }
    },

    // A Ghost Story
    {
      id: 428449,
      y: 2017,
      run: async (fx) => {
        fx.pillarbox(8000, W() < 500 ? "8vw" : "22vw");
        fx.filter("saturate(.6) brightness(.95)", 8000, { fade: 400 });
        const r = fx.rect(fx.slot());
        const ghost = fx.put(A.S("0 0 60 100", '<path d="M30 4 C48 4 52 20 52 40 C52 64 56 84 58 98 H2 C4 84 8 64 8 40 C8 20 12 4 30 4 Z" fill="#f4f2ec" stroke="#ddd" stroke-width="1.5"/><ellipse cx="22" cy="30" rx="4" ry="6" fill="#1d1a18"/><ellipse cx="38" cy="30" rx="4" ry="6" fill="#1d1a18"/>'),
          r.x + r.width * 0.9, r.y, { size: 50, h: 84 });
        fx.chord(["C4", "G4", "E5"], 7, { type: "sine", vol: 0.04, attack: 2 });
        fx.seq([["G4", 4], ["C5", 4], ["E5", 8], ["D5", 8]], { type: "triangle", vol: 0.05, beat: 0.3, at: 1 });
        await fx.wait(2600);
        fx.caption("(it waits)", { style: "whisper", ms: 1600 });
        fx.tempo(3, 3000);
        await fx.wait(2000);
        fx.caption("(and waits)", { style: "whisper", ms: 1600 });
        fx.put(A.S("0 0 30 10", '<rect x="1" y="1" width="28" height="8" fill="#f4efe2" stroke="#999"/>'), r.x + r.width * 0.9, r.y + 50, { size: 24, h: 8, ms: 2600 });
        await fx.wait(2000);
        await fx.fadeOut(ghost, 1000);
      },
      maxMs: 12000
    },

    // Burning
    {
      id: 491584,
      y: 2018,
      run: async (fx) => {
        const dusk = fx.wash("linear-gradient(#4a6a9a, #e8a060 60%, #3a2a2a)", 7400, { blend: "multiply", fade: 800, opacity: 0.55 });
        void dusk;
        const trumpet = [["C5", 4], ["Eb5", 2], ["G5", 2], ["F5", 6], ["Eb5", 2], ["D5", 8]];
        fx.seq(trumpet, { type: "sawtooth", vol: 0.045, beat: 0.28, filter: { type: "bandpass", freq: 1400, q: 1.5 }, vibrato: [5, 8], attack: 0.1 });
        const dancer = fx.put(A.S("0 0 40 80", '<circle cx="20" cy="10" r="7" fill="#1d1a18"/><path d="M12 18 H28 L30 50 H10 Z" fill="#1d1a18"/><path d="M12 22 L0 6 M28 22 L40 6 M14 50 L10 78 M26 50 L30 78" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.55, { size: 44, h: 88 });
        fx.move(dancer, [{ transform: "none" }, { transform: "rotate(-10deg) translateX(-10px)" }, { transform: "rotate(10deg) translateX(10px)" }, { transform: "none" }], { duration: 2000, iterations: 2, easing: "ease-in-out" });
        await fx.wait(3800);
        fx.caption("(a greenhouse burns every two months)", { style: "whisper", ms: 2000, css: { color: "#fff" } });
        const gh = fx.put(A.S("0 0 100 60", '<path d="M4 58 V24 C4 10 96 10 96 24 V58 Z" fill="rgba(220,240,255,.35)" stroke="#ddd" stroke-width="2"/><path d="M4 30 H96 M30 14 V58 M70 14 V58" stroke="#ccc" stroke-width="1"/>'), W() * 0.8, H() * 0.75, { size: 90, h: 54 });
        fx.particles({ kind: "rise", from: gh, count: 20, glyphs: [dot("#ff7a1a"), dot("#ffcf5a")], min: 3, max: 8, dur: 1400, stagger: 2000 });
        fx.noise(2.4, { freq: 1500, sweep: 3000, vol: 0.15, attack: 0.4 });
        await fx.wait(2600);
      }
    },

    // Roma
    {
      id: 426426,
      y: 2018,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 7400, { fade: 500 });
        const floor = fx.node(A.S("0 0 400 300", Array.from({ length: 12 }, (_, i) => '<rect x="' + (i % 4) * 100 + '" y="' + Math.floor(i / 4) * 100 + '" width="100" height="100" fill="' + ((i + Math.floor(i / 4)) % 2 ? "#6d6860" : "#8a857a") + '" stroke="#555"/>').join("")),
          { cls: "fx-filter", style: { opacity: 0.8 } });
        floor.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(floor.firstChild.style, { width: "100%", height: "100%" });
        fx.noise(5, { freq: 900, vol: 0.2, attack: 0.3 });
        fx.particles({ kind: "sweep", count: 30, glyphs: dot("rgba(255,255,255,.6)"), min: 3, max: 8, dur: 1400, stagger: 3000 });
        const water = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(90deg, transparent, rgba(220,230,240,.5), transparent)", backgroundSize: "200% 100%" } });
        if (!fx.reduced) fx.anim(water, [{ backgroundPosition: "100% 0" }, { backgroundPosition: "-100% 0" }], { duration: 2400, iterations: 2 });
        await fx.wait(4400);
        const plane = A.S("0 0 60 20", '<path d="M2 10 L40 8 L58 4 L54 10 L58 16 L40 12 Z" fill="#f4f2ec"/>');
        fx.caption("(and in the puddle, an aeroplane)", { style: "whisper", ms: 2200 });
        fx.tone(300, 2.4, { type: "sine", vol: 0.04, slide: 200 });
        await fx.fly(plane, [W() + 40, H() * 0.55], [-40, H() * 0.5], { size: 40, h: 14, dur: 2600, easing: "linear" });
      }
    },

    // Portrait of a Lady on Fire
    {
      id: 531428,
      y: 2019,
      run: async (fx) => {
        const night = fx.wash("rgba(10,15,30,.6)", 7400, { fade: 500 });
        void night;
        const r = fx.rect(fx.slot());
        const beat = 0.24;
        for (let i = 0; i < 20; i++) fx.noise(0.08, { type: "bandpass", freq: 1200, q: 1, vol: i % 2 ? 0.18 : 0.3, at: i * beat });
        const chant = [["D4", 2], ["D4", 2], ["F4", 2], ["E4", 2], ["D4", 4], ["C4", 4]];
        fx.seq(chant.concat(chant), { type: "sawtooth", vol: 0.045, beat, filter: { type: "bandpass", freq: 900, q: 2 }, vibrato: [5, 6] });
        fx.caption("(Fugere non possum)", { style: "whisper", ms: 2400, css: { color: "#ddd" } });
        const fire = fx.put('<div style="width:100%;height:100%;background:radial-gradient(ellipse at 50% 100%, #fff0a0, #ff8a1a 40%, rgba(255,60,20,0) 70%)"></div>', W() / 2, H() * 0.8, { size: 120, h: 100 });
        fx.move(fire, [{ transform: "scaleY(1)" }, { transform: "scaleY(1.15)" }, { transform: "scaleY(.95)" }, { transform: "scaleY(1)" }], { duration: 600, iterations: 8 });
        fx.particles({ kind: "rise", from: fire, count: 30, glyphs: [dot("#ffcf5a"), dot("#ff7a1a")], min: 2, max: 5, dur: 1400, stagger: 4400 });
        await fx.wait(2600);
        fx.style(fx.slot(), { boxShadow: "0 0 0 2px #ff8a1a, 0 12px 30px rgba(255,120,30,.8)" }, 3200);
        fx.particles({ kind: "rise", from: pt(r.x, r.top + r.height, r.width * 0.6, 10), count: 14, glyphs: dot("#ffcf5a"), min: 3, max: 6, dur: 1600 });
        fx.caption("(the hem of her dress has caught)", { style: "whisper", ms: 2000, css: { color: "#fff" } });
        await fx.wait(2400);
      }
    },

    // The Worst Person in the World
    {
      id: 660120,
      y: 2021,
      run: async (fx) => {
        fx.filter("saturate(1.1) brightness(1.05)", 7000, { fade: 300 });
        fx.caption("(she flips the light switch)", { style: "whisper", ms: 1600 });
        fx.click({ freq: 1500, vol: 0.6 });
        await fx.wait(700);
        fx.freeze(4200);
        fx.caption("(the whole city stops)", { style: "whisper", ms: 2000 });
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "translateX(" + (-W() * 0.3) + "px)" }, { transform: "translateX(" + (-W() * 0.3) + "px) rotate(-6deg)" }, { transform: "none" }], { duration: 4000, easing: "ease-in-out" });
        const tune = [["E5", 2], ["G5", 1], ["A5", 1], ["B5", 3], ["A5", 1], ["G5", 2], ["E5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.3, at: 0.4 });
        fx.particles({ kind: "drift", count: 10, glyphs: A.heart("#e05a5a"), min: 8, max: 14, dur: 2800, stagger: 2000 });
        await fx.wait(4200);
        fx.click({ freq: 1500, vol: 0.6 });
        fx.caption("(…and starts again)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Anatomy of a Fall
    {
      id: 915935,
      y: 2023,
      run: async (fx) => {
        const snow = fx.wash("linear-gradient(rgba(235,240,245,.35), rgba(200,210,220,.4))", 7400, { fade: 400 });
        void snow;
        const beat = 0.2;
        const steel = [["C5", 1], ["E5", 1], ["G5", 1], ["C6", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1]];
        for (let loop = 0; loop < 3; loop++) {
          fx.seq(steel, { type: "square", vol: 0.05, beat, at: loop * beat * 8, filter: { freq: 2800 } });
          for (let i = 0; i < 8; i++) fx.thud({ freq: 70, vol: 0.12, dur: 0.08, at: loop * beat * 8 + i * beat });
        }
        fx.caption("(the music upstairs is very, very loud)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
        const ball = fx.put(A.S("0 0 30 30", '<circle cx="15" cy="15" r="12" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/>'), W() * 0.2, H() * 0.2, { size: 26 });
        const steps = 8;
        for (let i = 1; i <= steps; i++) {
          if (!fx.reduced) ball.style.transform = "translate(" + i * W() * 0.07 + "px," + i * H() * 0.07 + "px)";
          fx.thud({ freq: 300, vol: 0.2, dur: 0.06 });
          await fx.wait(180);
        }
        fx.caption("(the dog knows)", { style: "whisper", ms: 1600 });
        const dog = A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36" fill="#c9a24a" ' + A.ink + ' stroke-width="2.5"/>');
        fx.put(dog, W() * 0.2, H() * 0.8, { size: 60, h: 40, ms: 1800 });
        await fx.wait(1800);
      }
    }
  ]);
})();
