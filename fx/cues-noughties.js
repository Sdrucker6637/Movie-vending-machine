/* Machine FX cues - 2000-2008: world cinema, animation, documentary and cult.
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
    // Dancer in the Dark
    {
      id: 16,
      y: 2000,
      run: async (fx) => {
        fx.filter("saturate(.5) contrast(1.1)", 6600, { fade: 300 });
        const beat = 0.3;
        const found = [
          () => fx.noise(0.12, { type: "bandpass", freq: 600, q: 4, vol: 0.4 }),
          () => fx.noise(0.06, { type: "highpass", freq: 5000, vol: 0.3 }),
          () => fx.thud({ freq: 70, vol: 0.3, dur: 0.1 }),
          () => fx.click({ freq: 2400, vol: 0.4 })
        ];
        fx.caption("(the factory machines start keeping time)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 12; i++) fx.later(i * beat * 1000, () => found[i % 4]());
        await fx.wait(2400);
        fx.filter("saturate(2) brightness(1.1)", 3600, { fade: 300 });
        const tune = [["G4", 1], ["A4", 1], ["B4", 2], ["D5", 2], ["C5", 1], ["B4", 1], ["A4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat });
        for (let i = 0; i < 10; i++) fx.later(i * beat * 1000, () => found[i % 4]());
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: beat * 2000, delay: (i % 4) * 80, iterations: 5, fill: "none" }));
        await fx.wait(3400);
      }
    },

    // Amores perros
    {
      id: 55,
      y: 2000,
      run: async (fx) => {
        fx.filter("saturate(1.3) contrast(1.25) sepia(.2)", 5600, { fade: 150 });
        const r = fx.rect(fx.slot());
        const a = A.car("#d51f2a"), b = A.car("#3a6ad8");
        const y = r.top + r.height + 20;
        fx.tone(90, 1.6, { type: "sawtooth", vol: 0.08, filter: { freq: 500 }, slide: 160 });
        await Promise.all([
          fx.fly(a, [-80, y], [W() / 2 - 30, y], { size: 90, h: 40, dur: 1500, easing: "ease-in" }),
          fx.fly(b, [W() + 80, y], [W() / 2 + 30, y], { size: 90, h: 40, dur: 1500, easing: "ease-in", flip: true })
        ]);
        fx.thud({ vol: 1, freq: 50, dur: 0.6 });
        fx.noise(0.8, { type: "highpass", freq: 2000, vol: 0.6 });
        fx.flash("#fff", 150);
        fx.shake("lg", 700);
        fx.buzz([150, 50, 150]);
        fx.particles({ kind: "burst", from: pt(W() / 2, y), count: 24, spread: 70, gravity: 60, dur: 900, stagger: 0, glyphs: '<div style="width:100%;height:100%;background:linear-gradient(135deg,#fff,#9ab);clip-path:polygon(50% 0,100% 100%,0 70%)"></div>', min: 5, max: 12 });
        await fx.wait(900);
        for (let i = 0; i < 3; i++) fx.tone(fx.rand(500, 700), 0.2, { type: "sawtooth", vol: 0.05, slide: 400, at: i * 0.25, filter: { freq: 1500 } });
        fx.caption("(three stories, one crash)", { style: "whisper", ms: 1600 });
        await fx.wait(1700);
      }
    },

    // In the Mood for Love
    {
      id: 843,
      y: 2000,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(140,20,20,.35), rgba(60,20,10,.45))", 7400, { fade: 600, blend: "multiply" });
        fx.tempo(0.4, 7000);
        const waltz = [["G4", 3], ["Bb4", 1], ["D5", 2], ["C5", 3], ["Bb4", 1], ["A4", 2], ["G4", 6]];
        fx.seq(waltz, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { freq: 1300 }, vibrato: [5.5, 10], attack: 0.1 });
        for (let i = 0; i < 6; i++) { fx.thud({ freq: 80, vol: 0.15, dur: 0.2, at: i * 1.05 }); fx.click({ freq: 1600, vol: 0.12, at: i * 1.05 + 0.35 }); fx.click({ freq: 1600, vol: 0.12, at: i * 1.05 + 0.7 }); }
        const cheong = A.S("0 0 40 100", '<circle cx="20" cy="10" r="7" fill="#1d1a18"/><path d="M12 18 H28 C30 40 32 70 30 96 H10 C8 70 10 40 12 18 Z" fill="#b3122a"/><path d="M14 30 C20 36 26 30 28 40 M12 60 C20 66 26 58 30 70" stroke="#f2c94c" stroke-width="1.5" fill="none"/>');
        const man = A.S("0 0 40 100", '<circle cx="20" cy="10" r="7" fill="#1d1a18"/><path d="M8 18 H32 L30 60 H10 Z" fill="#2b2622"/><path d="M12 60 V96 M28 60 V96" stroke="#2b2622" stroke-width="6"/>');
        const y = H() * 0.62;
        fx.fly(cheong, [W() + 30, y], [W() * 0.35, y], { size: 36, h: 90, dur: 5200, easing: "linear" });
        await fx.fly(man, [-30, y], [W() * 0.65, y], { size: 36, h: 90, dur: 5200, easing: "linear" });
        fx.caption("(they pass on the stairs)", { style: "whisper", ms: 1600, css: { color: "#fff" } });
        await fx.wait(1600);
      }
    },

    // Battle Royale
    {
      id: 3176,
      y: 2000,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(1.1) contrast(1.1)", 6400, { fade: 300 });
        const collar = fx.put(A.S("0 0 80 40", '<path d="M6 12 C20 34 60 34 74 12" stroke="#9aa2a6" stroke-width="8" fill="none"/><rect x="34" y="24" width="12" height="10" rx="2" fill="#6d7478"/><circle class="led" cx="40" cy="29" r="2.5" fill="#20ff40"/>'), r.x, r.y + r.height * 0.3, { size: 80, h: 40 });
        const led = collar.querySelector(".led");
        fx.caption("Today's lesson: you kill each other.", { style: "subtitle", ms: 2200 });
        for (let i = 0; i < 10; i++) {
          if (led) led.setAttribute("fill", i > 6 ? "#ff2020" : (i % 2 ? "#20ff40" : "#0a4010"));
          fx.tone(i > 6 ? 2400 : 1600, 0.06, { type: "square", vol: 0.06 });
          await fx.wait(i > 6 ? 180 : 360);
        }
        const board = fx.put('<div style="font:700 14px/1.3 \'Special Elite\',\'Courier New\',monospace;color:#f4efe2;background:#1d3a2a;border:4px solid #6b4a2a;padding:8px;text-align:center">STUDENTS REMAINING: 42</div>', W() / 2, H() * 0.25, { size: 220, h: 50 });
        for (let n = 41; n >= 38; n--) {
          await fx.wait(450);
          board.firstChild.textContent = "STUDENTS REMAINING: " + n;
          fx.click({ freq: 800, vol: 0.4 });
        }
        await fx.wait(700);
      }
    },

    // Crouching Tiger, Hidden Dragon
    {
      id: 146,
      y: 2000,
      run: async (fx) => {
        const bamboo = fullSvg(fx, A.S("0 0 400 300", Array.from({ length: 16 }, (_, i) => { const x = 12 + i * 25; return '<path d="M' + x + ' 300 C' + (x + 4) + ' 200 ' + (x - 6) + ' 100 ' + (x + 2) + ' 0" stroke="rgba(60,120,60,.7)" stroke-width="7" fill="none"/>'; }).join("")), { opacity: 0.75 });
        fx.wash("rgba(170,220,170,.25)", 6600, { fade: 500 });
        if (!fx.reduced) fx.anim(bamboo, [{ transform: "skewX(0)" }, { transform: "skewX(-8deg)" }, { transform: "skewX(6deg)" }, { transform: "skewX(0)" }], { duration: 4200 });
        fx.noise(6, { type: "bandpass", freq: 1500, q: 0.5, vol: 0.18, attack: 1 });
        const erhu = [["A4", 3], ["C5", 1], ["D5", 2], ["E5", 2], ["G5", 3], ["E5", 1], ["D5", 4]];
        fx.seq(erhu, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { type: "bandpass", freq: 1500, q: 2 }, vibrato: [6, 12], attack: 0.1 });
        const fighter = A.S("0 0 50 60", '<circle cx="25" cy="10" r="7" fill="#1d1a18"/><path d="M16 18 H34 L40 44 H10 Z" fill="#e8e4da"/><path d="M34 22 L50 14" stroke="#cfd4d6" stroke-width="2"/>');
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.2 + "px)" }, { transform: "none" }], { duration: 3000, easing: "ease-in-out" });
        await fx.fly(fighter, [W() * 0.1, H() * 0.7], [W() * 0.9, H() * 0.2], { size: 50, h: 60, dur: 3000, via: [W() * 0.5, H() * 0.05], r1: -20 });
        for (let i = 0; i < 5; i++) fx.noise(0.06, { type: "highpass", freq: 6000, vol: 0.4, at: i * 0.16 });
        await fx.wait(1600);
      }
    },

    // Songs from the Second Floor
    {
      id: 34070,
      y: 2000,
      run: async (fx) => {
        const pale = fx.filter("saturate(.35) brightness(1.1) contrast(.9)", 7400, { fade: 400 });
        void pale;
        fx.wash("rgba(200,215,210,.35)", 7400, { fade: 400 });
        const man = A.S("0 0 30 60", '<circle cx="15" cy="8" r="7" fill="#e8e0d8"/><path d="M6 16 H24 L22 40 H8 Z" fill="#6d7478"/><path d="M8 40 L6 58 M22 40 L24 58" stroke="#6d7478" stroke-width="4"/><path d="M24 20 L30 36" stroke="#6d7478" stroke-width="3"/>');
        const n = W() < 500 ? 6 : 10;
        for (let i = 0; i < n; i++) fx.put(man, (i + 0.5) * W() / n, H() * 0.7, { size: 20, h: 40 });
        fx.noise(7, { freq: 600, vol: 0.06, attack: 1 });
        for (let t = 0; t < 7; t += 0.6) fx.tone(90, 0.3, { type: "sine", vol: 0.04, at: t });
        await fx.wait(2600);
        fx.caption("Beloved be the one who sits down.", { style: "subtitle", ms: 2600 });
        await fx.wait(2600);
        fx.caption("(traffic hasn't moved in hours)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Yi Yi
    {
      id: 25538,
      y: 2000,
      run: async (fx) => {
        fx.filter("saturate(.9)", 6600, { fade: 300 });
        const r = fx.rect(fx.slot());
        const cam = fx.put(A.S("0 0 50 34", '<rect x="2" y="6" width="46" height="26" rx="3" fill="#2b2622"/><circle cx="25" cy="19" r="9" fill="#555" stroke="#ccc" stroke-width="2"/><rect x="8" y="2" width="10" height="6" fill="#2b2622"/>'), r.x, r.top + r.height + 30, { size: 50, h: 34 });
        void cam;
        fx.caption("You can't see it, so I'll show you.", { style: "subtitle", ms: 2200 });
        await fx.wait(1600);
        const others = fx.otherSlots(true).slice(0, 6);
        for (const o of others) {
          fx.noise(0.12, { type: "highpass", freq: 4000, vol: 0.4 });
          fx.click({ freq: 1500, vol: 0.5, at: 0.08 });
          const or_ = fx.rect(o);
          fx.put(A.S("0 0 40 50", '<ellipse cx="20" cy="18" rx="12" ry="14" fill="#2b2622"/><path d="M8 50 C8 34 32 34 32 50 Z" fill="#6b4a2a"/>'), or_.x, or_.y, { size: or_.width * 0.7, h: or_.height * 0.7, ms: 3000, style: { opacity: 0.85 } });
          await fx.wait(300);
        }
        fx.caption("(the backs of everyone's heads)", { style: "whisper", ms: 2000 });
        fx.seq([["C5", 2], ["E5", 2], ["G5", 4]], { type: "triangle", vol: 0.06, beat: 0.35 });
        await fx.wait(2200);
      }
    },

    // Werckmeister Harmonies
    {
      id: 23160,
      y: 2000,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 9000, { fade: 400 });
        const cx = W() / 2, cy = H() * 0.45;
        const sun = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#f4f2ec;box-shadow:0 0 12px #fff"></div>', cx, cy, { size: 60 });
        const earth = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#8a857a"></div>', cx + 90, cy, { size: 28 });
        const moon = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#cfc8b8"></div>', cx + 130, cy, { size: 14 });
        void sun;
        fx.chord(["C3", "G3", "C4", "E4"], 8, { type: "sawtooth", vol: 0.025, attack: 2, filter: { freq: 800 } });
        fx.seq([["E5", 4], ["D5", 4], ["C5", 4], ["G4", 8]], { type: "sine", vol: 0.06, beat: 0.4, attack: 0.4 });
        fx.caption("(the tavern drunks become the solar system)", { style: "whisper", ms: 2600 });
        await fx.tween(fx.reduced ? 10 : 7200, (k) => {
          const a = k * Math.PI * 2, b = k * Math.PI * 12;
          const ex = cx + Math.cos(a) * 90, ey = cy + Math.sin(a) * 90 * 0.5;
          earth.style.transform = "translate(" + (ex - cx - 90) + "px," + (ey - cy) + "px)";
          moon.style.transform = "translate(" + (ex + Math.cos(b) * 26 - cx - 130) + "px," + (ey + Math.sin(b) * 26 - cy) + "px)";
        });
        fx.caption("…and then the eclipse.", { style: "subtitle", ms: 1400 });
        await fx.wait(1300);
      },
      maxMs: 12000
    },

    // The Devil's Backbone
    {
      id: 1433,
      y: 2001,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(.8) brightness(.9)", 6600, { fade: 400 });
        const bomb = fx.put(A.S("0 0 60 140", '<path d="M18 30 C18 10 42 10 42 30 V120 L30 136 L18 120 Z" fill="#6d7478" ' + A.ink + '/><path d="M18 14 L4 2 M42 14 L56 2" ' + A.ink + '/>'), W() / 2, H() * 0.45, { size: 60, h: 140 });
        void bomb;
        for (let t = 0; t < 5.5; t += 0.9) fx.click({ freq: 700, vol: 0.2, at: t });
        fx.chord(["D3", "Ab3"], 6, { type: "sine", vol: 0.05, attack: 1.5 });
        await fx.wait(1600);
        const ghost = fx.put(A.S("0 0 50 80", '<circle cx="25" cy="18" r="14" fill="rgba(220,235,245,.55)"/><path d="M12 32 H38 L40 78 H10 Z" fill="rgba(220,235,245,.45)"/><path d="M20 0 C26 10 30 4 28 16" stroke="rgba(140,110,90,.6)" stroke-width="3" fill="none"/>'), W() * 0.2, H() * 0.6, { size: 50, h: 80 });
        fx.particles({ kind: "rise", from: ghost, count: 12, glyphs: dot("rgba(160,130,110,.6)"), min: 3, max: 6, dur: 1800 });
        fx.anim(ghost, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.6 }, { opacity: 0 }], { duration: 3400 });
        fx.noise(3, { type: "bandpass", freq: 2000, q: 3, vol: 0.08, attack: 0.5 });
        fx.caption("What is a ghost?", { style: "subtitle", ms: 2200 });
        await fx.wait(3600);
      }
    },

    // Mulholland Drive
    {
      id: 1018,
      y: 2001,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const dark = fx.node("", { cls: "fx-filter", style: { background: "#050510", opacity: 0 } });
        fx.anim(dark, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 700, fill: "forwards" });
        const bx = fx.put(A.S("0 0 60 60", '<path d="M8 20 L30 10 L52 20 V50 L30 58 L8 50 Z" fill="#2d5ad8" ' + A.ink + ' stroke-width="2"/><path d="M8 20 L30 30 L52 20 M30 30 V58" stroke="#1d1a18" stroke-width="2"/><path d="M26 22 L30 18 L34 22" fill="none" stroke="#1d1a18" stroke-width="2"/>'), r.x, r.y, { size: 60 });
        fx.chord(["E3", "B3", "G4"], 5, { type: "sine", vol: 0.05, attack: 1.2 });
        await fx.wait(1200);
        const key = fx.put(A.S("0 0 40 20", '<circle cx="8" cy="10" r="6" fill="none" stroke="#2d5ad8" stroke-width="3"/><path d="M14 10 H38 L34 16 M28 10 V14" stroke="#2d5ad8" stroke-width="3" fill="none"/>'), r.x - 60, r.y, { size: 40, h: 20 });
        await fx.move(key, [{ transform: "none" }, { transform: "translateX(60px)" }], 700);
        fx.click({ freq: 2000, vol: 0.5 });
        fx.remove(key);
        fx.noise(0.6, { type: "lowpass", freq: 300, vol: 0.5 });
        await fx.move(bx, [{ transform: "scale(1)" }, { transform: "scale(14)", opacity: 1 }], { duration: 900, easing: "ease-in" });
        fx.remove(bx);
        fx.caption("Silencio.", { style: "subtitle", ms: 1800, css: { color: "#8ab0ff", letterSpacing: ".3em" } });
        await fx.wait(1800);
      }
    },

    // The Royal Tenenbaums
    {
      id: 9428,
      y: 2001,
      run: async (fx) => {
        fx.filter("sepia(.2) saturate(1.2)", 6600, { fade: 300 });
        const chapters = ["Chapter One", "Chapter Two", "Chapter Three"];
        for (const c of chapters) {
          fx.caption(c, { style: "card", ms: 900, css: { fontFamily: "Futura, 'Century Gothic', sans-serif", letterSpacing: ".04em" } });
          fx.click({ freq: 1200, vol: 0.3 });
          await fx.wait(1000);
        }
        const suit = fx.costume(".reely", '<path d="M20 70 H100 L106 150 H14 Z" fill="#d51f2a" stroke="#1f1b16" stroke-width="3"/><path d="M60 70 V150" stroke="#fff" stroke-width="4"/>', 3600);
        void suit;
        const dogs = A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36" fill="#1d1a18" stroke="#1d1a18" stroke-width="2"/><circle cx="46" cy="14" r="1.5" fill="#fff"/>');
        fx.fly(dogs, [-60, H() - 60], [W() + 60, H() - 60], { size: 50, h: 34, dur: 2600, easing: "steps(16)" });
        fx.seq([["D5", 1], ["F#5", 1], ["A5", 2], ["G5", 1], ["F#5", 1], ["E5", 2], ["D5", 4]], { type: "triangle", vol: 0.07, beat: 0.22 });
        fx.later(800, () => { fx.tone(1000, 0.1, { type: "sine", vol: 0.1 }); fx.caption("(the Dalmatian mice)", { style: "whisper", ms: 1600 }); });
        await fx.wait(3000);
      }
    },

    // City of God
    {
      id: 598,
      y: 2002,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(1.5) contrast(1.15)", 6000, { fade: 200 });
        const knife = A.S("0 0 50 12", '<path d="M2 6 L34 2 L48 6 L34 10 Z" fill="#dfe6ea" ' + A.ink + ' stroke-width="1.5"/><rect x="0" y="3" width="14" height="6" fill="#6b4a2a"/>');
        for (let i = 0; i < 8; i++) {
          fx.later(i * 150, () => fx.noise(0.08, { type: "highpass", freq: 5000, vol: 0.4 }));
        }
        for (let t = 0; t < 2; t += 0.15) fx.thud({ freq: 140, vol: 0.15, dur: 0.08, at: t });
        fx.put(knife, W() / 2, H() * 0.3, { size: 60, h: 14, ms: 1300, style: { transform: "rotate(-30deg)" } });
        await fx.wait(1200);
        const chicken = A.S("0 0 50 50", '<ellipse cx="24" cy="30" rx="16" ry="13" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="16" r="8" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M42 14 L50 16 L42 19" fill="#e8a13a"/><path d="M34 8 L36 2 L40 8" fill="#d51f2a"/>');
        fx.tone(900, 0.2, { type: "square", vol: 0.06, slide: 1400 });
        fx.fly(chicken, [W() * 0.2, H() * 0.75], [W() + 50, H() * 0.7], { size: 50, dur: 1500, via: [W() * 0.6, H() * 0.6], easing: "steps(12)" });
        await fx.wait(700);
        const r = fx.rect(fx.slot());
        const cam = fx.put(A.S("0 0 50 34", '<rect x="2" y="6" width="46" height="26" rx="3" fill="#2b2622"/><circle cx="25" cy="19" r="9" fill="#555" stroke="#ccc" stroke-width="2"/>'), r.x, r.top + r.height + 30, { size: 50, h: 34 });
        void cam;
        if (!fx.reduced) fx.page([{ transform: "rotate(0)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(0)" }], { duration: 1200 });
        fx.noise(0.12, { type: "highpass", freq: 4000, vol: 0.4 });
        fx.flash("#fff", 120);
        fx.caption("(the chicken got away. the photographer got the shot.)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Hero
    {
      id: 79,
      y: 2002,
      run: async (fx) => {
        const seq = [["rgba(200,20,30,.5)", "RED"], ["rgba(30,80,220,.5)", "BLUE"], ["rgba(40,160,80,.5)", "GREEN"], ["rgba(240,240,240,.55)", "WHITE"]];
        const wash = fx.wash(seq[0][0], 6400, { blend: "multiply", fade: 200 });
        for (let i = 0; i < seq.length; i++) {
          wash.style.background = seq[i][0];
          if (i === 3) wash.style.mixBlendMode = "screen";
          fx.chord([["D4", "A4"], ["E4", "B4"], ["C4", "G4"], ["D4", "F#4"]][i], 1.3, { type: "sawtooth", vol: 0.04, filter: { freq: 1000 } });
          if (i === 0) fx.particles({ kind: "sweep", count: 30, glyphs: A.leaf("#e0b03a"), min: 8, max: 14, dur: 1400, stagger: 1000, spin: 360 });
          if (i === 3) {
            for (let k = 0; k < 40; k++) fx.later(k * 30, () => fx.fly(box("background:#1d1a18"), [fx.rand(-100, 0), fx.rand(0, H() * 0.5)], [W() + 20, fx.rand(H() * 0.4, H())], { size: 30, h: 2, dur: 500 }));
            for (let k = 0; k < 12; k++) fx.noise(0.05, { type: "highpass", freq: 6000, vol: 0.2, at: k * 0.08 });
          }
          await fx.wait(1500);
        }
      }
    },

    // Spring, Summer, Fall, Winter… and Spring
    {
      id: 113,
      y: 2003,
      run: async (fx) => {
        const pond = fx.wash("linear-gradient(rgba(80,140,120,.3), rgba(40,90,80,.45))", 7400, { fade: 400, blend: "multiply" });
        const temple = fx.put(A.S("0 0 120 80", '<path d="M10 40 L60 12 L110 40 Z" fill="#6b1d2a" ' + A.ink + ' stroke-width="2"/><rect x="24" y="40" width="72" height="30" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><path d="M0 72 H120" stroke="#6b4a2a" stroke-width="5"/>'), W() / 2, H() * 0.42, { size: 150, h: 100 });
        void temple;
        const seasons = [
          ["rgba(80,140,120,.3)", [A.petal("#ffc0d8")]],
          ["rgba(60,160,80,.35)", [dot("rgba(255,255,255,.0)")]],
          ["rgba(200,110,40,.35)", [A.leaf("#d9702a"), A.leaf("#b3402d")]],
          ["rgba(230,240,250,.55)", [A.snowflake]],
          ["rgba(80,140,120,.3)", [A.petal("#ffc0d8")]]
        ];
        const bell = (at) => fx.tone(392, 1.6, { type: "sine", vol: 0.1, at, attack: 0.003 });
        for (let i = 0; i < seasons.length; i++) {
          pond.style.background = seasons[i][0];
          bell(0);
          fx.particles({ kind: "fall", count: 16, glyphs: seasons[i][1], min: 6, max: 11, dur: 1600, stagger: 800, spin: 200 });
          await fx.wait(1400);
        }
      }
    },

    // Coffee and Cigarettes
    {
      id: 883,
      y: 2003,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15)", 6600, { fade: 300 });
        const table = fx.put(A.S("0 0 200 200", Array.from({ length: 64 }, (_, i) => '<rect x="' + (i % 8) * 25 + '" y="' + Math.floor(i / 8) * 25 + '" width="25" height="25" fill="' + ((i + Math.floor(i / 8)) % 2 ? "#1d1a18" : "#e8e4da") + '"/>').join("")), W() / 2, H() * 0.45, { size: 180, style: { transform: "perspective(400px) rotateX(55deg)" } });
        void table;
        const cups = [W() / 2 - 40, W() / 2 + 40].map((x) => fx.put(A.mug, x, H() * 0.42, { size: 36 }));
        fx.particles({ kind: "rise", from: pt(W() / 2, H() * 0.36, 80, 10), count: 10, glyphs: dot("rgba(230,230,230,.6)"), min: 8, max: 16, dur: 2000, stagger: 3000 });
        fx.caption("You're not supposed to drink coffee before bed.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        fx.caption("I drink it so I can have fast dreams.", { style: "subtitle", ms: 2200 });
        cups.forEach((c, i) => fx.move(c, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 300, delay: i * 500 }));
        for (let i = 0; i < 4; i++) fx.click({ freq: 3200, vol: 0.2, at: i * 0.4 });
        await fx.wait(2400);
      }
    },

    // Dogville
    {
      id: 553,
      y: 2003,
      run: async (fx) => {
        const floor = fx.node(A.S("0 0 400 300", '<rect width="400" height="300" fill="#1d1a18"/>' +
          [[40, 40, 120, 90, "MA GINGER"], [200, 40, 150, 90, "CHUCK"], [40, 170, 120, 100, "ELM STREET"], [200, 170, 150, 100, "OLD LADY'S BUSHES"]].map(([x, y, w, h, t]) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="none" stroke="#f4f2ec" stroke-width="2"/><text x="' + (x + 6) + '" y="' + (y + 18) + '" font-size="10" fill="#f4f2ec" font-family="Georgia">' + t + "</text>").join("") +
          '<text x="170" y="155" font-size="9" fill="#f4f2ec" font-family="Georgia">DOG</text><circle cx="185" cy="140" r="6" fill="none" stroke="#f4f2ec"/>'),
          { cls: "fx-filter", style: { opacity: 0 } });
        floor.firstChild.setAttribute("preserveAspectRatio", "xMidYMid meet");
        Object.assign(floor.firstChild.style, { width: "100%", height: "100%" });
        fx.anim(floor, [{ opacity: 0 }, { opacity: 0.94 }], { duration: 700, fill: "forwards" });
        fx.caption("(the town is chalk lines on a soundstage)", { style: "whisper", ms: 2200, css: { color: "#fff" } });
        await fx.wait(2400);
        for (let i = 0; i < 3; i++) { fx.noise(0.3, { type: "bandpass", freq: 900, q: 3, vol: 0.2, at: i * 0.35 }); }
        fx.caption("(a door that isn't there, knocked on)", { style: "whisper", ms: 1800, css: { color: "#fff" } });
        await fx.wait(2000);
        fx.caption("Dog.", { style: "subtitle", ms: 1400 });
        fx.tone(200, 0.3, { type: "sawtooth", vol: 0.06, filter: { freq: 700 } });
        await fx.wait(1400);
      }
    },

    // The Room
    {
      id: 17473,
      y: 2003,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const ball = fx.put(A.S("0 0 40 40", '<ellipse cx="20" cy="20" rx="18" ry="11" fill="#8a4a1a" ' + A.ink + ' stroke-width="2"/><path d="M10 20 H30 M16 16 V24 M20 16 V24 M24 16 V24" stroke="#fff" stroke-width="1.5"/>'), r.x - 60, r.y, { size: 36 });
        for (let i = 0; i < 4; i++) {
          fx.tone(300, 0.1, { type: "sine", vol: 0.1 });
          await fx.move(ball, [{ transform: "translateX(0)" }, { transform: "translateX(40px) translateY(-20px) rotate(180deg)" }, { transform: "translateX(0)" }], { duration: 500 });
        }
        fx.caption("Oh hi, Mark.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        fx.caption("You're tearing me apart!", { style: "hand", ms: 1800 });
        fx.tone(250, 1.4, { type: "sawtooth", vol: 0.1, slide: 180, filter: { freq: 1200 }, vibrato: [8, 30] });
        const spoons = A.S("0 0 20 50", '<ellipse cx="10" cy="12" rx="7" ry="10" fill="#cfd4d6" ' + A.ink + ' stroke-width="1.5"/><rect x="8" y="20" width="4" height="28" fill="#cfd4d6" ' + A.ink + ' stroke-width="1"/>');
        fx.particles({ kind: "fall", count: 24, glyphs: spoons, min: 14, max: 22, dur: 1800, spin: 300 });
        for (let i = 0; i < 10; i++) fx.click({ freq: 5000 + i * 200, vol: 0.15, at: 0.8 + i * 0.1 });
        await fx.wait(2200);
      }
    },

    // The Triplets of Belleville
    {
      id: 9662,
      y: 2003,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(.8)", 6400, { fade: 300 });
        const beat = 0.25;
        const swing = [["A4", 1], ["C5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["F5", 1], ["E5", 2]];
        fx.seq(swing.concat(swing), { type: "square", vol: 0.04, beat, filter: { freq: 2000 } });
        const parts = [
          (t) => fx.noise(0.15, { type: "bandpass", freq: 500, q: 2, vol: 0.3, at: t }),
          (t) => fx.click({ freq: 3000, vol: 0.4, at: t }),
          (t) => fx.tone(120, 0.15, { type: "sawtooth", vol: 0.15, at: t, filter: { freq: 500 } })
        ];
        for (let i = 0; i < 16; i++) parts[i % 3](i * beat);
        const items = [
          A.S("0 0 50 20", '<rect x="2" y="6" width="46" height="8" fill="#e8e4da" ' + A.ink + ' stroke-width="1.5"/>'),
          A.S("0 0 40 40", '<circle cx="20" cy="20" r="14" fill="#cfd4d6" ' + A.ink + ' stroke-width="2"/>'),
          A.S("0 0 40 30", '<path d="M4 26 V10 H36 V26" fill="none" ' + A.ink + '/>')
        ];
        const labels = ["(newspaper)", "(fridge)", "(vacuum)"];
        for (let i = 0; i < 3; i++) {
          const el = fx.put(items[i], W() / 2 + (i - 1) * 70, H() * 0.66, { size: 44, h: 36 });
          fx.move(el, [{ transform: "none" }, { transform: "translateY(-8px)" }, { transform: "none" }], { duration: beat * 1000 * 2, iterations: 5 });
          fx.caption(labels[i], { style: "whisper", ms: 900, css: { bottom: 14 + i * 7 + "vh" } });
          await fx.wait(700);
        }
        const bike = A.S("0 0 100 60", '<circle cx="22" cy="44" r="14" fill="none" ' + A.ink + '/><circle cx="78" cy="44" r="14" fill="none" ' + A.ink + '/><path d="M22 44 L40 22 H64 L78 44" fill="none" ' + A.ink + '/><path d="M40 20 C46 6 60 6 62 18" stroke="#6b3a1a" stroke-width="8" fill="none"/>');
        await fx.fly(bike, [-80, H() - 60], [W() + 80, H() - 60], { size: 80, h: 48, dur: 2000 });
      }
    },

    // Kung Fu Hustle
    {
      id: 9470,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const palm = fx.put(A.S("0 0 120 150", '<path d="M20 150 L22 70 C14 60 10 40 16 30 L22 32 L26 60 L28 12 C28 4 40 4 40 12 L42 56 L48 4 C48 -4 60 -4 60 4 L60 56 L68 10 C68 2 80 2 80 10 L76 62 L90 40 C96 32 108 38 102 48 L84 94 L82 150 Z" fill="#f2c94c" ' + A.ink + ' stroke-width="3"/>'),
          W() / 2, -160, { size: 160, h: 200 });
        fx.tone(60, 2, { type: "sawtooth", vol: 0.1, filter: { freq: 300 } });
        fx.caption("Buddhist Palm!", { style: "hand", ms: 1600 });
        fx.sfx("whoosh", { dur: 1.4, vol: 0.7 });
        await fx.move(palm, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.55 + 160) + "px)" }], { duration: 1400, easing: "cubic-bezier(.5,0,1,.6)" });
        fx.sfx("boom", { vol: 1 });
        fx.noise(1, { freq: 500, vol: 0.6 });
        fx.shake("lg", 800);
        fx.buzz([200, 60, 200]);
        fx.flash("#fff6c0", 300);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.75), count: 30, spread: 100, gravity: 40, glyphs: dot("rgba(180,160,120,.8)"), min: 6, max: 16, dur: 1200, stagger: 0 });
        await fx.wait(1200);
        const lotus = A.S("0 0 60 40", '<path d="M30 36 C20 30 10 20 14 8 C22 12 26 20 30 28 C34 20 38 12 46 8 C50 20 40 30 30 36 Z" fill="#ffc0d8" ' + A.ink + ' stroke-width="1.5"/>');
        fx.sfx("chime", { vol: 0.6 });
        fx.put(lotus, r.x, r.y, { size: 60, h: 40, ms: 1600 });
        fx.chord(["C5", "E5", "G5"], 1.4, { type: "triangle", vol: 0.06 });
        await fx.wait(1500);
      }
    },

    // The Life Aquatic with Steve Zissou
    {
      id: 421,
      y: 2004,
      run: async (fx) => {
        const sea = fx.wash("linear-gradient(#8fd0ff, #1a6a9a)", 7000, { fade: 500, blend: "multiply", opacity: 0.5 });
        void sea;
        fx.costume(".reely", '<path d="M40 30 C40 14 80 14 80 30 Z" fill="#d51f2a" stroke="#1f1b16" stroke-width="3"/>', 7000);
        fx.particles({ kind: "rise", count: 20, glyphs: A.bubble, min: 6, max: 14, dur: 3000, stagger: 4000 });
        const fishes = [
          A.S("0 0 60 30", '<path d="M6 15 C16 2 40 2 48 15 C40 28 16 28 6 15 Z M48 15 L58 6 V24 Z" fill="#ff7ab0" ' + A.ink + ' stroke-width="1.5"/><path d="M14 10 L20 20 M22 8 L28 22 M30 8 L36 22" stroke="#ffd23b" stroke-width="2"/>'),
          A.S("0 0 60 30", '<path d="M6 15 C16 2 40 2 48 15 C40 28 16 28 6 15 Z M48 15 L58 6 V24 Z" fill="#3bd1ff" ' + A.ink + ' stroke-width="1.5"/><circle cx="18" cy="13" r="3" fill="#fff"/>'),
          A.S("0 0 60 30", '<path d="M6 15 C16 2 40 2 48 15 C40 28 16 28 6 15 Z M48 15 L58 6 V24 Z" fill="#f2c94c" ' + A.ink + ' stroke-width="1.5"/><path d="M20 4 L24 -4 L28 4" fill="#d51f2a"/>')
        ];
        fishes.forEach((f, i) => fx.fly(f, [-60, H() * (0.3 + i * 0.15)], [W() + 60, H() * (0.25 + i * 0.15)], { size: 60, h: 30, dur: 3600 + i * 400, easing: "steps(24)" }));
        const tune = [["E5", 2], ["C#5", 1], ["B4", 1], ["A4", 2], ["B4", 2], ["C#5", 3], ["E5", 1], ["F#5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.3 });
        await fx.wait(3600);
        const shark = fx.put(A.S("0 0 160 60", '<path d="M6 30 C30 6 120 6 146 30 C120 54 30 54 6 30 Z M146 30 L160 14 V46 Z" fill="#9ab8c0" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 10 }, (_, i) => '<circle cx="' + (30 + i * 11) + '" cy="' + (22 + (i % 3) * 8) + '" r="3" fill="#e8ff8a"/>').join("")), W() / 2, H() * 0.6, { size: 200, h: 75 });
        fx.style(shark, { filter: "drop-shadow(0 0 8px #e8ff8a)" });
        fx.anim(shark, [{ opacity: 0 }, { opacity: 1 }], 1000);
        fx.caption("I wonder if it remembers me.", { style: "subtitle", ms: 2400 });
        fx.chord(["A3", "C#4", "E4", "G#4"], 2.4, { type: "sine", vol: 0.05, attack: 0.6 });
        await fx.wait(2600);
      }
    },

    // Grizzly Man
    {
      id: 501,
      y: 2005,
      run: async (fx) => {
        fx.filter("saturate(.9) contrast(1.05)", 6600, { fade: 300 });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 6600, style: { opacity: 0.4 } });
        const rec = fx.put('<div style="font:700 13px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff3030;display:flex;align-items:center;gap:6px"><span style="width:10px;height:10px;border-radius:50%;background:#ff3030;display:inline-block"></span>REC</div>', 50, 30, { size: 70, h: 20 });
        fx.move(rec, [{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 1000, iterations: 6 });
        const bear = fx.put(A.S("0 0 120 80", '<path d="M10 50 C10 26 40 16 70 20 C86 10 104 14 108 30 C114 34 114 44 106 46 L100 50 C98 70 90 76 80 76 L78 78 H70 V70 H40 V78 H30 L28 70 C14 68 10 62 10 50 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><circle cx="96" cy="22" r="6" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><circle cx="100" cy="32" r="2" fill="#1d1a18"/>'),
          W() * 0.72, H() * 0.66, { size: 140, h: 94 });
        void bear;
        fx.noise(6, { type: "bandpass", freq: 900, q: 0.5, vol: 0.2, attack: 0.6 });
        fx.caption("(hand-held, over-exposed, too close)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        fx.caption("In all the faces of all the bears… I discover no kinship.", { style: "subtitle", ms: 2600, css: { fontSize: "14px" } });
        fx.tone(80, 2.4, { type: "sawtooth", vol: 0.05, filter: { freq: 300 } });
        await fx.wait(2600);
      }
    },

    // The Host
    {
      id: 1255,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("linear-gradient(transparent 60%, rgba(60,90,80,.6))", 6400, { fade: 400 });
        const beast = fx.put(A.S("0 0 160 90", '<path d="M10 60 C20 30 60 20 90 26 C120 30 140 44 150 60 C130 58 120 70 100 70 C80 76 40 80 10 60 Z" fill="#6a7a5a" ' + A.ink + ' stroke-width="2"/><path d="M120 44 C130 50 146 52 156 48 L150 60" fill="#8a4a4a" ' + A.ink + ' stroke-width="2"/><path d="M30 64 L20 86 M60 70 L56 88 M90 70 L96 88" ' + A.ink + '/><path d="M40 40 C60 30 80 34 100 40" stroke="#4a5a3a" stroke-width="3" fill="none"/>'),
          -120, H() * 0.6, { size: 180, h: 100 });
        fx.tone(70, 2.4, { type: "sawtooth", vol: 0.1, filter: { freq: 400 }, vibrato: [8, 10] });
        fx.caption("(something is hanging from the bridge)", { style: "whisper", ms: 1600 });
        await fx.move(beast, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 120) + "px)" }], { duration: 1600, easing: "cubic-bezier(.3,.9,.4,1)" });
        fx.noise(0.8, { freq: 900, vol: 0.5 });
        fx.buzz([100, 40, 100]);
        fx.shake("md", 600);
        await fx.move(beast, [{ transform: "translateX(" + (W() / 2 + 120) + "px)" }, { transform: "translateX(" + (W() / 2 + 120) + "px) translateY(-" + H() * 0.4 + "px) rotate(-30deg)" }, { transform: "translateX(" + (W() + 200) + "px) translateY(-" + H() * 0.2 + "px) rotate(20deg)" }], { duration: 1600, easing: "ease-in-out" });
        fx.particles({ kind: "fall", count: 30, glyphs: A.drop("#9cc"), min: 4, max: 8, dur: 1200 });
        await fx.wait(1500);
        void r;
      }
    },

    // Paprika
    {
      id: 4977,
      y: 2006,
      run: async (fx) => {
        const cols = ["#ff3b7a", "#ffd23b", "#3bd1ff", "#7aff3b", "#b33bff"];
        fx.wash("linear-gradient(135deg, rgba(255,60,120,.25), rgba(60,210,255,.25))", 7000, { fade: 400 });
        const parade = [
          A.S("0 0 40 50", '<path d="M8 40 C8 10 32 10 32 40 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="16" cy="26" r="3" fill="#1d1a18"/><circle cx="24" cy="26" r="3" fill="#1d1a18"/><path d="M8 40 V48 M32 40 V48" ' + A.ink + '/>'),
          A.S("0 0 40 50", '<rect x="6" y="10" width="28" height="30" rx="4" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="24" r="8" fill="#fff"/><path d="M10 40 V48 M30 40 V48" ' + A.ink + '/>'),
          A.S("0 0 40 50", '<path d="M20 4 L34 40 H6 Z" fill="#ffd23b" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="26" r="4" fill="#1d1a18"/>'),
          A.S("0 0 40 50", '<circle cx="20" cy="22" r="16" fill="#3bd1ff" ' + A.ink + ' stroke-width="2"/><path d="M12 22 H28" stroke="#1d1a18" stroke-width="3"/><path d="M14 38 V48 M26 38 V48" ' + A.ink + '/>'),
          A.S("0 0 40 50", '<path d="M8 10 H32 V38 H8 Z" fill="#7aff3b" ' + A.ink + ' stroke-width="2"/><path d="M12 18 H28 M12 26 H28" stroke="#1d1a18" stroke-width="2"/>')
        ];
        const beat = 0.2;
        const march = [["C5", 1], ["C5", 1], ["G5", 1], ["G5", 1], ["A5", 1], ["F5", 1], ["E5", 2], ["D5", 1], ["E5", 1], ["F5", 1], ["G5", 1], ["C6", 4]];
        fx.seq(march.concat(march), { type: "square", vol: 0.05, beat, filter: { freq: 2800 } });
        for (let i = 0; i < 32; i++) fx.thud({ freq: 80, vol: 0.18, dur: 0.08, at: i * beat });
        for (let i = 0; i < 14; i++) {
          fx.later(i * 280, () => fx.fly(parade[i % parade.length], [W() + 40, H() * 0.66 - (i % 3) * 30], [-40, H() * 0.66 - (i % 3) * 30], { size: 40, h: 50, dur: 3000, easing: "steps(20)" }));
        }
        fx.particles({ kind: "fall", count: 40, glyphs: cols.map((c) => A.star(c)), min: 8, max: 14, dur: 2600, spin: 360, stagger: 4000 });
        await fx.wait(6400);
      }
    },

    // The Lives of Others
    {
      id: 582,
      y: 2006,
      run: async (fx) => {
        fx.filter("saturate(.35) sepia(.2) brightness(.9)", 7000, { fade: 400 });
        const phones = fx.put(A.S("0 0 80 40", '<path d="M10 30 C10 6 70 6 70 30" stroke="#6d7478" stroke-width="10" fill="none"/><rect x="0" y="22" width="20" height="16" rx="4" fill="#6d7478"/><rect x="60" y="22" width="20" height="16" rx="4" fill="#6d7478"/>'), fx.rect(fx.$(".reely")).x, fx.rect(fx.$(".reely")).y - 30, { size: 70, h: 36 });
        void phones;
        fx.noise(6, { type: "bandpass", freq: 1200, q: 3, vol: 0.05, attack: 1 });
        const sonata = [["F4", 2], ["Ab4", 1], ["C5", 1], ["Db5", 3], ["C5", 1], ["Bb4", 2], ["Ab4", 2], ["G4", 2], ["F4", 4]];
        fx.seq(sonata, { type: "triangle", vol: 0.07, beat: 0.35, attack: 0.02 });
        fx.chord(["F3", "C4"], 5, { type: "sine", vol: 0.03, attack: 1 });
        const report = fx.put('<div style="font:13px/1.4 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#f4efe2;padding:8px;border:1px solid #999;white-space:pre"></div>', W() / 2, H() * 0.3, { size: 240, h: 60 });
        const line = "22:40 — Nothing to report.";
        for (let i = 0; i <= line.length; i++) {
          report.firstChild.textContent = line.slice(0, i);
          fx.click({ freq: 2000, vol: 0.15 });
          await fx.wait(90);
        }
        await fx.wait(2000);
        fx.caption("(HGW XX/7)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Still Life (2006)
    {
      id: 2346,
      y: 2006,
      run: async (fx) => {
        fx.filter("saturate(.6) brightness(1.05)", 7000, { fade: 400 });
        fx.wash("linear-gradient(rgba(200,210,215,.4), rgba(120,130,130,.4))", 7000, { fade: 500 });
        const tower = fx.put(A.S("0 0 60 160", '<rect x="10" y="10" width="40" height="150" fill="#b8b0a0" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 12 }, (_, i) => '<rect x="16" y="' + (18 + i * 12) + '" width="10" height="6" fill="#6d7478"/><rect x="34" y="' + (18 + i * 12) + '" width="10" height="6" fill="#6d7478"/>').join("")),
          W() * 0.75, H() * 0.5, { size: 60, h: 160 });
        fx.noise(6, { freq: 400, vol: 0.08, attack: 1 });
        fx.chord(["D4", "A4"], 5, { type: "sawtooth", vol: 0.025, filter: { freq: 700 }, attack: 1.5 });
        await fx.wait(2600);
        fx.tone(300, 2, { type: "sine", vol: 0.06, slide: 900, attack: 0.3 });
        await fx.move(tower, [{ transform: "none" }, { transform: "translateY(-" + H() + "px)" }], { duration: 2200, easing: "ease-in" });
        fx.caption("(the building simply takes off)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Idiocracy
    {
      id: 7512,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const can = fx.put(A.S("0 0 40 60", '<rect x="4" y="6" width="32" height="50" rx="4" fill="#3bd14a" ' + A.ink + ' stroke-width="2"/><path d="M4 22 H36 M4 40 H36" stroke="#1d1a18" stroke-width="2"/><text x="20" y="34" font-size="7" text-anchor="middle" font-family="Georgia" fill="#1d1a18">⚡</text>'), r.x + r.width, r.y, { size: 34, h: 52 });
        void can;
        fx.caption("It's got what plants crave.", { style: "subtitle", ms: 2000 });
        fx.tone(900, 0.4, { type: "square", vol: 0.06, slide: 1400 });
        await fx.wait(2000);
        fx.caption("It's got electrolytes.", { style: "subtitle", ms: 1800 });
        const plants = fx.otherSlots(true).slice(0, 6);
        for (const p of plants) {
          const pr = fx.rect(p);
          fx.put(A.S("0 0 30 40", '<path d="M15 40 V20 C12 12 6 10 2 14 M15 22 C20 14 26 14 28 18" stroke="#8a7a3a" stroke-width="3" fill="none"/>'), pr.x, pr.top + pr.height - 10, { size: 26, h: 34, ms: 2400 });
          fx.tone(200, 0.3, { type: "sine", vol: 0.05, slide: 100 });
          await fx.wait(200);
        }
        fx.caption("(the crops are all dead)", { style: "whisper", ms: 1400 });
        await fx.wait(1800);
      }
    },

    // Persepolis
    {
      id: 2011,
      y: 2007,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.6) brightness(1.05)", 7000, { fade: 300 });
        const cut = fullSvg(fx, A.S("0 0 400 300", '<path d="M0 300 V210 C40 200 60 170 90 180 L100 120 H120 L130 180 C160 170 180 190 220 180 L230 100 C236 90 250 90 256 100 L262 180 C300 170 340 200 400 190 V300 Z" fill="#0d0b09"/>'));
        void cut;
        const girl = fx.put(A.S("0 0 60 100", '<path d="M10 40 C8 10 52 10 50 40 L54 96 H6 Z" fill="#0d0b09"/><ellipse cx="30" cy="34" rx="12" ry="14" fill="#f4f2ec"/><circle cx="25" cy="32" r="2" fill="#0d0b09"/><circle cx="35" cy="32" r="2" fill="#0d0b09"/>'), W() / 2, H() * 0.45, { size: 70, h: 116 });
        fx.seq([["D4", 2], ["F4", 1], ["G4", 1], ["Ab4", 3], ["G4", 1], ["F4", 2], ["D4", 4]], { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1200 }, vibrato: [6, 10] });
        await fx.wait(2200);
        fx.caption("PUNK IS NOT DED", { style: "card", ms: 1800 });
        const beat = 0.14;
        for (let i = 0; i < 16; i++) { fx.thud({ freq: 90, vol: 0.25, dur: 0.07, at: i * beat }); fx.noise(0.06, { type: "highpass", freq: 5000, vol: 0.2, at: i * beat + 0.07 }); }
        fx.seq([["E3", 1], ["E3", 1], ["G3", 1], ["A3", 1], ["E3", 1], ["E3", 1], ["D3", 2]], { type: "sawtooth", vol: 0.06, beat, filter: { freq: 900 } });
        fx.move(girl, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], { duration: beat * 2000, iterations: 8 });
        await fx.wait(2600);
      }
    },

    // The Orphanage
    {
      id: 6537,
      y: 2007,
      run: async (fx) => {
        fx.filter("saturate(.6) brightness(.85)", 7000, { fade: 400 });
        const knocks = [0, 0.4, 0.8];
        fx.caption("One, two, three…", { style: "subtitle", ms: 1400 });
        knocks.forEach((t) => fx.thud({ freq: 150, vol: 0.4, dur: 0.15, at: t }));
        await fx.wait(1600);
        fx.caption("…knock on the wall!", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
        const r = fx.rect(fx.slot());
        const sack = fx.put(A.S("0 0 60 80", '<path d="M10 20 C6 50 8 76 30 76 C52 76 54 50 50 20 Z" fill="#b8a888" ' + A.ink + ' stroke-width="2"/><circle cx="22" cy="42" r="5" fill="#1d1a18"/><circle cx="38" cy="42" r="5" fill="#1d1a18"/><path d="M24 58 Q30 54 36 58" stroke="#1d1a18" stroke-width="2" fill="none"/><path d="M10 20 H50 L44 10 H16 Z" fill="#8a7a62"/>'), r.x, r.y, { size: 60, h: 80, style: { opacity: 0 } });
        fx.anim(sack, [{ opacity: 0 }, { opacity: 1 }], { duration: 100, fill: "forwards" });
        fx.chord(["B2", "C3", "F#3"], 1.6, { type: "sawtooth", vol: 0.12, filter: { freq: 1600 } });
        fx.flash("#fff", 120);
        fx.buzz([120, 40, 120]);
        fx.shake("md", 400);
        await fx.wait(2000);
      }
    },

    // Encounters at the End of the World
    {
      id: 12172,
      y: 2007,
      run: async (fx) => {
        const ice = fx.wash("linear-gradient(#e8f4ff, #bcd8ec)", 7000, { fade: 500, blend: "multiply", opacity: 0.55 });
        void ice;
        fx.noise(7, { type: "bandpass", freq: 700, sweep: 1400, q: 0.5, vol: 0.2, attack: 1 });
        fx.chord(["D4", "A4", "E5"], 6, { type: "sine", vol: 0.04, attack: 2 });
        const peng = A.S("0 0 30 40", '<ellipse cx="15" cy="24" rx="10" ry="14" fill="#1d1a18"/><ellipse cx="15" cy="27" rx="6" ry="10" fill="#fff"/><circle cx="15" cy="10" r="7" fill="#1d1a18"/><path d="M19 10 L25 12 L19 14" fill="#e8a13a"/><path d="M11 38 L9 40 M19 38 L21 40" stroke="#e8a13a" stroke-width="2"/>');
        const n = 6;
        for (let i = 0; i < n; i++) fx.put(peng, W() * 0.15 + i * 16, H() * 0.8, { size: 24, h: 32 });
        await fx.wait(1200);
        const lone = fx.put(peng, W() * 0.3, H() * 0.8, { size: 28, h: 38 });
        fx.caption("(one penguin heads for the mountains)", { style: "whisper", ms: 2400 });
        await fx.move(lone, [{ transform: "none" }, { transform: "translate(" + W() * 0.5 + "px,-" + H() * 0.4 + "px) scale(.5)" }], { duration: 4200, easing: "steps(30)" });
        fx.caption("…to certain death.", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Timecrimes
    {
      id: 14139,
      y: 2007,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.9) contrast(1.05)", 7000, { fade: 300 });
        const bandage = A.S("0 0 50 60", '<path d="M8 30 C6 6 44 6 42 30 C44 50 34 58 25 58 C16 58 6 50 8 30 Z" fill="#f4f0e6" stroke="#e05a8a" stroke-width="3"/><path d="M8 20 C20 18 30 26 42 20 M8 34 C20 32 30 40 42 34 M10 46 C20 44 30 50 40 46" stroke="#e8b0c0" stroke-width="3" fill="none"/>');
        const trips = [[0.2, 0.3], [0.5, 0.6], [0.8, 0.35]];
        for (let i = 0; i < 3; i++) {
          const b = fx.put(bandage, W() * trips[i][0], H() * trips[i][1], { size: 40 - i * 4, h: 48 - i * 4, style: { opacity: 1 - i * 0.25 } });
          void b;
          fx.tone(200 + i * 100, 0.8, { type: "sine", vol: 0.06, slide: 900 - i * 100 });
          fx.noise(0.6, { type: "bandpass", freq: 600, q: 4, vol: 0.2 });
          fx.flash("rgba(255,255,255,.4)", 250);
          fx.caption(["(1:00 pm)", "(1:00 pm, again)", "(1:00 pm, a third time)"][i], { style: "whisper", ms: 1400 });
          await fx.wait(1700);
        }
        fx.put(A.S("0 0 50 50", '<circle cx="25" cy="25" r="20" fill="none" stroke="#cfd4d6" stroke-width="4"/><path d="M25 25 V12 M25 25 L35 25" stroke="#cfd4d6" stroke-width="3"/>'), r.x, r.y, { size: 50, ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Let the Right One In
    {
      id: 13310,
      y: 2008,
      run: async (fx) => {
        const snow = fx.wash("linear-gradient(rgba(220,230,240,.4), rgba(170,190,210,.5))", 7000, { fade: 600 });
        void snow;
        fx.particles({ kind: "fall", count: 50, glyphs: A.snowflake, min: 4, max: 9, dur: 4200, stagger: 5000, wind: 10 });
        const wall = fx.put(box("background:repeating-linear-gradient(0deg,#b8b0a0 0 18px,#a8a090 18px 20px), repeating-linear-gradient(90deg,transparent 0 38px,#a8a090 38px 40px)"), W() / 2, H() * 0.5, { size: 12, h: H() * 0.4 });
        void wall;
        const morse = [0.15, 0.15, 0.15, 0.45, 0.15, 0.45, 0.15];
        let t = 0;
        morse.forEach((d) => { fx.thud({ freq: 180, vol: 0.4, dur: d > 0.3 ? 0.18 : 0.08, at: t }); t += d + 0.2; });
        fx.caption("·· · · — · —", { style: "whisper", ms: 3000 });
        await fx.wait(3200);
        const cube = fx.put(A.S("0 0 40 40", '<rect x="4" y="4" width="32" height="32" fill="#f2c94c"/><path d="M4 15 H36 M4 25 H36 M15 4 V36 M25 4 V36" stroke="#1d1a18" stroke-width="1"/><rect x="4" y="4" width="11" height="11" fill="#d51f2a"/><rect x="25" y="25" width="11" height="11" fill="#3a6ad8"/>'), W() * 0.3, H() * 0.7, { size: 40 });
        fx.move(cube, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }, { transform: "rotate(90deg)" }, { transform: "rotate(180deg)" }], { duration: 1600, easing: "steps(4)" });
        fx.click({ freq: 1500, vol: 0.3 });
        fx.click({ freq: 1500, vol: 0.3, at: 0.8 });
        fx.caption("(you have to invite me in)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
      }
    },

    // Man on Wire
    {
      id: 14048,
      y: 2008,
      run: async (fx) => {
        const sky = fx.wash("linear-gradient(#e8f0f8, #bcd0e0)", 7000, { fade: 400, blend: "multiply", opacity: 0.5 });
        void sky;
        const towers = fullSvg(fx, A.S("0 0 400 300", '<rect x="20" y="40" width="80" height="260" fill="rgba(120,130,140,.8)"/><rect x="300" y="60" width="80" height="240" fill="rgba(120,130,140,.8)"/><path d="M100 60 L300 70" stroke="#1d1a18" stroke-width="1.5"/>'), { opacity: 0.9 });
        void towers;
        const walker = fx.put(A.S("0 0 120 60", '<path d="M0 30 H120" stroke="#1d1a18" stroke-width="2"/><circle cx="60" cy="8" r="5" fill="#1d1a18"/><path d="M60 13 V36 M60 36 L56 50 M60 36 L64 50" stroke="#1d1a18" stroke-width="2.5"/>'), W() * 0.25, H() * 0.2, { size: 120, h: 60 });
        fx.chord(["C4", "E4", "G4", "B4"], 6, { type: "sine", vol: 0.03, attack: 2 });
        fx.seq([["G4", 4], ["B4", 2], ["C5", 2], ["E5", 4], ["D5", 4], ["C5", 8]], { type: "triangle", vol: 0.07, beat: 0.25 });
        fx.noise(6, { type: "bandpass", freq: 800, q: 0.5, vol: 0.12, attack: 1 });
        await fx.move(walker, [{ transform: "none" }, { transform: "translate(" + W() * 0.25 + "px,4px) rotate(2deg)" }, { transform: "translate(" + W() * 0.5 + "px,6px) rotate(-2deg)" }], { duration: 5000, easing: "ease-in-out" });
        fx.caption("(1,350 feet up — he lies down on the wire)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
      }
    },

    // Waltz with Bashir
    {
      id: 8885,
      y: 2008,
      run: async (fx) => {
        const flare = fx.wash("linear-gradient(#2a1a0a, #c8781a 50%, #f2b84a)", 7000, { fade: 700, blend: "multiply", opacity: 0.65 });
        void flare;
        fx.filter("contrast(1.3) saturate(.8)", 7000, { fade: 700 });
        const dogs = A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36" fill="#1d1a18" stroke="#1d1a18" stroke-width="2"/><circle cx="46" cy="14" r="1.8" fill="#ffcf5a"/>');
        for (let i = 0; i < 26; i++) fx.later(i * 110, () => fx.fly(dogs, [W() + 40, H() * fx.rand(0.5, 0.9)], [-40, H() * fx.rand(0.5, 0.9)], { size: 44, h: 30, dur: 1800, flip: true, easing: "steps(12)" }));
        for (let t = 0; t < 3; t += 0.12) fx.noise(0.08, { type: "bandpass", freq: 400, q: 2, vol: 0.12, at: t });
        fx.caption("(twenty-six dogs)", { style: "whisper", ms: 2000, css: { color: "#fff" } });
        await fx.wait(3600);
        fx.chord(["D3", "A3", "D4", "F4"], 3, { type: "sawtooth", vol: 0.04, attack: 1, filter: { freq: 900 } });
        fx.particles({ kind: "fall", count: 6, glyphs: '<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff,#ffcf5a 40%,transparent 70%)"></div>', min: 30, max: 50, dur: 3000, stagger: 1200 });
        fx.caption("(the sea, the flares, the men rising from the water)", { style: "whisper", ms: 2600, css: { color: "#fff" } });
        await fx.wait(3000);
      }
    },

    // Ponyo
    {
      id: 12429,
      y: 2008,
      run: async (fx) => {
        const sea = fx.wash("linear-gradient(#8fd0ff, #2a7ab0)", 7000, { fade: 400, blend: "multiply", opacity: 0.5 });
        void sea;
        const waves = [];
        for (let i = 0; i < 5; i++) {
          const w = fx.put(A.S("0 0 80 40", '<path d="M4 30 C10 10 30 6 40 20 C50 6 70 10 76 30 Z" fill="#3a8ad8" ' + A.ink + ' stroke-width="2"/><circle cx="24" cy="18" r="3" fill="#fff"/><circle cx="56" cy="18" r="3" fill="#fff"/><circle cx="24" cy="18" r="1.5" fill="#1d1a18"/><circle cx="56" cy="18" r="1.5" fill="#1d1a18"/>'), -60, H() * (0.5 + i * 0.08), { size: 80, h: 40 });
          waves.push(w);
          fx.move(w, [{ transform: "none" }, { transform: "translate(" + (W() + 120) + "px,-" + (20 + (i % 2) * 20) + "px)" }], { duration: 2600 + i * 200, delay: i * 200, easing: "ease-in-out" });
        }
        const tune = [["C5", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 1], ["E5", 2], ["F5", 1], ["E5", 1], ["D5", 1], ["C5", 1], ["D5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.09, beat: 0.2 });
        fx.noise(3, { type: "bandpass", freq: 700, sweep: 1400, vol: 0.2, attack: 0.4 });
        const girl = A.S("0 0 50 60", '<circle cx="25" cy="18" r="14" fill="#f2c0a0" ' + A.ink + ' stroke-width="2"/><path d="M11 14 C12 0 38 0 39 14 C34 8 16 8 11 14 Z" fill="#d51f2a"/><circle cx="20" cy="18" r="2" fill="#1d1a18"/><circle cx="30" cy="18" r="2" fill="#1d1a18"/><path d="M12 32 H38 L42 56 H8 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/>');
        fx.later(1200, () => fx.fly(girl, [-60, H() * 0.48], [W() + 60, H() * 0.38], { size: 50, h: 60, dur: 2800, via: [W() / 2, H() * 0.3], r1: -10, easing: "ease-in-out" }));
        await fx.wait(4200);
        fx.caption("Ponyo loves Sōsuke!", { style: "hand", ms: 1800, css: { color: "#d51f2a" } });
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 30 20", '<path d="M4 16 C4 6 26 6 26 16 Z" fill="#8a6a3a"/><path d="M8 10 H22" stroke="#f2c94c" stroke-width="3"/>'), r.x, r.y, { size: 36, h: 24, ms: 1800 });
        await fx.wait(1800);
      }
    }
  ]);
})();
