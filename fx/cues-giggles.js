/* Machine FX cues - comedies and romances.
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
  const hearts = (fx, from, n) => fx.particles({ kind: "burst", from, count: n || 12, spread: 50, glyphs: [A.heart("#e05a5a"), A.heart("#ff9ab8")], min: 8, max: 16, dur: 1400, stagger: 500 });
  const rimshot = (fx, at) => { fx.thud({ freq: 150, vol: 0.3, dur: 0.08, at: at || 0 }); fx.thud({ freq: 120, vol: 0.3, dur: 0.08, at: (at || 0) + 0.12 }); fx.noise(0.5, { type: "highpass", freq: 6000, vol: 0.2, at: (at || 0) + 0.3 }); };
  const romance = (fx, at) => fx.chord(["F4", "A4", "C5", "E5"], 3, { type: "sine", vol: 0.04, attack: 0.8, at: at || 0 });

  M.register([
    // Ghostbusters
    {
      id: 620,
      y: 1984,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const beat = 0.16;
        const hook = [["B3", 1], ["B3", 1], ["D#4", 1], ["B3", 1], ["C#4", 2], ["A3", 2], [null, 2], ["B3", 1], ["B3", 1], ["B3", 1], ["B3", 1], ["A3", 1], ["B3", 3]];
        fx.seq(hook, { type: "sawtooth", vol: 0.06, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 20; i++) fx.thud({ freq: i % 2 ? 150 : 70, vol: 0.2, dur: 0.07, at: i * beat });
        const slimer = fx.put(A.S("0 0 60 60", '<path d="M10 30 C10 10 50 10 50 30 C54 40 48 52 40 50 C38 58 30 56 30 50 C24 58 16 54 18 48 C8 48 6 38 10 30 Z" fill="#7aff3b" ' + A.ink + ' stroke-width="2"/><circle cx="22" cy="26" r="5" fill="#fff"/><circle cx="38" cy="26" r="5" fill="#fff"/><circle cx="23" cy="27" r="2" fill="#1d1a18"/><circle cx="37" cy="27" r="2" fill="#1d1a18"/><path d="M20 38 Q30 46 40 38" stroke="#1d1a18" stroke-width="2" fill="#2a8a1a"/>'), -40, H() * 0.3, { size: 60 });
        await fx.move(slimer, [{ transform: "none" }, { transform: "translate(" + (r.x + 40) + "px," + (r.y - H() * 0.3) + "px)" }], { duration: 1600, easing: "ease-in-out" });
        fx.noise(0.4, { type: "lowpass", freq: 400, vol: 0.6 });
        fx.put(box("background:radial-gradient(#9aff6a 40%, transparent 70%)"), r.x, r.y, { size: r.width, h: r.height, ms: 2600 });
        fx.remove(slimer);
        fx.caption("He slimed me.", { style: "subtitle", ms: 1600 });
        await fx.wait(1800);
        const sign = fx.put(A.S("0 0 80 80", '<circle cx="40" cy="40" r="36" fill="none" stroke="#d51f2a" stroke-width="7"/><path d="M14 66 L66 14" stroke="#d51f2a" stroke-width="7"/><path d="M28 54 C24 34 30 20 42 20 C54 20 58 34 54 54 L48 48 L44 56 L38 48 L32 56 Z" fill="#fff" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.35, { size: 90 });
        fx.move(sign, [{ transform: "scale(0)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], 400);
        await fx.wait(1400);
      }
    },

    // Caddyshack
    {
      id: 11977,
      y: 1980,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const gopher = fx.put(A.S("0 0 40 50", '<ellipse cx="20" cy="30" rx="14" ry="18" fill="#8a6a4a" ' + A.ink + ' stroke-width="2"/><circle cx="14" cy="22" r="2.5" fill="#1d1a18"/><circle cx="26" cy="22" r="2.5" fill="#1d1a18"/><rect x="16" y="30" width="8" height="6" fill="#fff" ' + A.ink + ' stroke-width="1"/>'), r.x, r.top + r.height + 30, { size: 36, h: 45 });
        const holes = [r.x, r.x - 80, r.x + 80, r.x - 40];
        const beat = 0.2;
        for (let i = 0; i < 16; i++) fx.thud({ freq: 90, vol: 0.2, dur: 0.07, at: i * beat });
        fx.seq([["G4", 1], ["B4", 1], ["D5", 1], ["E5", 1], ["D5", 2], ["B4", 2], ["A4", 4]], { type: "square", vol: 0.04, beat, filter: { freq: 2000 } });
        for (const x of holes) {
          if (!fx.reduced) gopher.style.left = x - 18 + "px";
          fx.sfx("pop", { vol: 0.7, rate: 0.8 + Math.random() * 0.4 });
          await fx.move(gopher, [{ transform: "translateY(30px)" }, { transform: "none" }, { transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "translateY(30px)" }], 700);
        }
        fx.caption("(the gopher dances; the greenkeeper does not)", { style: "whisper", ms: 1800 });
        fx.sfx("boom", { at: 800, vol: 0.9 });
        fx.later(800, () => { fx.thud({ vol: 1, freq: 40 }); fx.flash("#ffcf5a", 160); fx.shake("lg", 500); fx.particles({ kind: "burst", from: pt(r.x, H() - 40), count: 20, spread: 60, gravity: 60, glyphs: dot("#6b4a2a"), min: 3, max: 8, dur: 900 }); });
        await fx.wait(2200);
      }
    },

    // Trading Places
    {
      id: 1621,
      y: 1983,
      run: async (fx) => {
        const ticker = fx.put('<div style="height:100%;overflow:hidden;background:#0b0907;border-top:2px solid #444;border-bottom:2px solid #444"><div class="t" style="white-space:nowrap;font:700 16px/30px \'Special Elite\',\'Courier New\',monospace;color:#3aff8a">FCOJ ▲ 102.00 &nbsp; FCOJ ▲ 118.50 &nbsp; FCOJ ▲ 142.00 &nbsp; FCOJ ▼ 46.00 &nbsp; FCOJ ▼ 29.00</div></div>', W() / 2, H() * 0.3, { size: W(), h: 34 });
        const t = ticker.querySelector(".t");
        if (t && !fx.reduced) fx.anim(t, [{ transform: "translateX(" + W() + "px)" }, { transform: "translateX(-100%)" }], { duration: 5000, easing: "linear" });
        for (let i = 0; i < 20; i++) fx.noise(0.2, { type: "bandpass", freq: fx.rand(600, 2000), q: 2, vol: 0.12, at: i * 0.2 });
        fx.caption("Sell! Sell!", { style: "hand", ms: 1400 });
        fx.sfx("bell", { vol: 0.7 });
        await fx.wait(2600);
        const juice = fx.put(A.S("0 0 30 50", '<path d="M6 10 H24 L22 48 H8 Z" fill="#ffa020" ' + A.ink + ' stroke-width="1.5"/><path d="M8 10 L6 2 H24 L22 10" fill="#fff" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.55, { size: 30, h: 50 });
        void juice;
        A.coinReturn(fx, 8, "#e8c870");
        fx.sfx("coin-drop", { n: 8, every: 0.11 });
        fx.caption("Looking good, Billy Ray! Feeling good, Louis!", { style: "subtitle", ms: 2200, css: { fontSize: "14px" } });
        await fx.wait(2400);
      }
    },

    // Coming to America
    {
      id: 9602,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const petals = ["#d51f2a", "#ff9ab8", "#f2c94c", "#fff"];
        const aisle = fx.put(box("background:linear-gradient(90deg, transparent 20%, rgba(213,31,42,.5) 20% 80%, transparent 80%)"), W() / 2, H() * 0.7, { size: 140, h: H() * 0.6 });
        void aisle;
        fx.particles({ kind: "fall", count: 50, glyphs: petals.map((c) => A.petal(c)), min: 8, max: 14, dur: 2600, stagger: 3000, spin: 360 });
        const horns = [["C5", 1], ["E5", 1], ["G5", 2], ["C6", 4]];
        fx.seq(horns, { type: "sawtooth", vol: 0.06, beat: 0.22, filter: { freq: 2200 } });
        fx.seq(horns.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "sawtooth", vol: 0.04, beat: 0.22, filter: { freq: 1600 } });
        fx.caption("(the royal petal-throwers)", { style: "whisper", ms: 1800 });
        await fx.wait(2600);
        const menu = fx.put('<div style="font:700 15px/1.2 Georgia,serif;color:#fff;background:#d51f2a;border:3px solid #f2c94c;padding:6px 10px;text-align:center">McDOWELL\'S</div>', r.x, r.top - 22, { size: 140, h: 32 });
        void menu;
        fx.caption("(not to be confused with the other place)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Planes, Trains and Automobiles
    {
      id: 2609,
      y: 1987,
      run: async (fx) => {
        const vehicles = [A.plane, A.S("0 0 160 40", '<rect x="4" y="8" width="150" height="26" rx="4" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 6 }, (_, i) => '<rect x="' + (12 + i * 24) + '" y="12" width="16" height="10" fill="#cfe8ff"/>').join("")), A.car("#d8c8a0")];
        for (let i = 0; i < 3; i++) {
          fx.tone([700, 150, 90][i], 1.2, { type: "sawtooth", vol: 0.04, filter: { freq: 800 } });
          await fx.fly(vehicles[i], [-160, H() * (0.25 + i * 0.2)], [W() + 160, H() * (0.25 + i * 0.2)], { size: [120, 160, 100][i], h: [60, 40, 45][i], dur: 1300 });
        }
        fx.caption("(the car is on fire)", { style: "whisper", ms: 1400 });
        const r = fx.rect(fx.slot());
        fx.particles({ kind: "rise", from: pt(r.x, r.top + r.height, r.width, 10), count: 20, glyphs: [dot("#ff7a1a"), dot("#ffcf5a"), dot("rgba(60,60,60,.7)")], min: 4, max: 12, dur: 1600 });
        await fx.wait(1600);
        fx.caption("Those aren't pillows!", { style: "subtitle", ms: 2000 });
        fx.put(A.S("0 0 80 40", '<rect x="4" y="6" width="72" height="30" rx="10" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.66, { size: 80, h: 40, ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Fast Times at Ridgemont High
    {
      id: 13342,
      y: 1982,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pizza = fx.fly(A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#e8b860" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="30" r="21" fill="#d9401a"/>' + [[20, 22], [38, 20], [30, 36], [18, 38], [42, 38]].map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#8a1a1a"/>').join("")), [-60, H() + 20], [r.x, r.y], { size: 50, dur: 1000, via: [r.x / 2, H() * 0.4], r2: 360 });
        fx.caption("(pizza delivery — to history class)", { style: "whisper", ms: 1800 });
        await pizza;
        fx.put(A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#e8b860" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="30" r="21" fill="#d9401a"/>'), r.x, r.y, { size: 50, ms: 2600 });
        fx.caption("Aloha, Mr. Hand!", { style: "subtitle", ms: 1800 });
        const surf = [["E5", 1], ["E5", 1], ["E5", 1], ["E5", 1], ["G5", 2], ["E5", 2]];
        fx.seq(surf, { type: "sawtooth", vol: 0.05, beat: 0.12, filter: { freq: 2400 }, vibrato: [12, 20] });
        await fx.wait(2400);
      }
    },

    // Sixteen Candles
    {
      id: 15144,
      y: 1984,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cake = fx.put(A.S("0 0 100 70", '<rect x="10" y="30" width="80" height="36" rx="4" fill="#ffd0e0" ' + A.ink + ' stroke-width="2"/><path d="M10 38 C20 44 30 34 40 40 C50 46 60 34 70 40 C80 46 90 36 90 36" stroke="#fff" stroke-width="3" fill="none"/>' + Array.from({ length: 16 }, (_, i) => '<rect x="' + (14 + i * 4.6) + '" y="16" width="2.5" height="14" fill="' + ["#3a6ad8", "#ff7ab0", "#f2d33b"][i % 3] + '"/><ellipse class="f" cx="' + (15.2 + i * 4.6) + '" cy="13" rx="1.6" ry="3" fill="#ffb347"/>').join("")),
          W() / 2, H() * 0.4, { size: 160, h: 112 });
        fx.caption("(the whole family forgot her birthday)", { style: "whisper", ms: 2000 });
        romance(fx);
        await fx.wait(2400);
        const flames = cake.querySelectorAll(".f");
        fx.noise(0.8, { freq: 700, sweep: 200, vol: 0.4 });
        flames.forEach((f, i) => fx.later(i * 25, () => f.setAttribute("opacity", "0")));
        fx.particles({ kind: "rise", from: cake, count: 16, glyphs: dot("rgba(200,200,200,.6)"), min: 4, max: 10, dur: 1400 });
        await fx.wait(600);
        fx.caption("Make a wish.", { style: "subtitle", ms: 1600 });
        hearts(fx, fx.slot(), 10);
        await fx.wait(1800);
        void r;
      }
    },

    // Weird Science
    {
      id: 11814,
      y: 1985,
      run: async (fx) => {
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 6000, style: { opacity: 0.4 } });
        const term = fx.put('<div style="font:14px/1.3 \'Special Elite\',\'Courier New\',monospace;color:#3aff8a;background:#0b0907;padding:8px;border:2px solid #3aff8a;white-space:pre"></div>', W() / 2, H() * 0.34, { size: 240, h: 90 });
        const lines = "> LOAD WOMAN.DAT\n> ADD BRAINS\n> ADD CHARM\n> RUN";
        for (let i = 0; i <= lines.length; i++) {
          term.firstChild.textContent = lines.slice(0, i) + "_";
          fx.click({ freq: 2400, vol: 0.12 });
          await fx.wait(45);
        }
        fx.caption("(the bras on their heads help, apparently)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 4; i++) {
          fx.flash(i % 2 ? "#bfe8ff" : "#fff", 120);
          fx.sfx("zap", { vol: 0.7 });
          fx.buzz(40);
          await fx.wait(300);
        }
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => fx.style(s, { filter: "hue-rotate(" + fx.rand(0, 360) + "deg) saturate(2)" }, 1600));
        fx.caption("So what would you little maniacs like to do first?", { style: "subtitle", ms: 2200, css: { fontSize: "14px" } });
        await fx.wait(2200);
      }
    },

    // Ace Ventura: Pet Detective
    {
      id: 3049,
      y: 1994,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("Alrighty then!", { style: "hand", ms: 1600 });
        fx.tone(300, 0.6, { type: "sawtooth", vol: 0.06, slide: 800, filter: { freq: 2000 } });
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M36 34 C30 14 50 -10 60 20 C70 -10 90 14 84 34" fill="#6b3a1a" stroke="#1f1b16" stroke-width="2"/>', 5200);
        await fx.move(reely, [{ transform: "none" }, { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "none" }], 700);
        const animals = [A.cat, A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36" fill="#b8a888" stroke="#1d1a18" stroke-width="2"/>'), A.S("0 0 40 30", '<path d="M20 18 C14 6 6 4 0 8 C8 10 12 14 16 18 L20 20 L24 18 C28 14 32 10 40 8 C34 4 26 6 20 18 Z" fill="#3aa0ff"/>'), A.S("0 0 50 30", '<ellipse cx="22" cy="18" rx="16" ry="10" fill="#f4f0e6" stroke="#1d1a18" stroke-width="1.5"/><path d="M36 14 L48 8 L46 18 Z" fill="#f4f0e6"/>')];
        for (let i = 0; i < 12; i++) fx.later(i * 110, () => fx.fly(animals[i % 4], [fx.rand(0, W()), H() + 20], [r.x + fx.rand(-60, 60), r.y + fx.rand(-60, 60)], { size: 34, h: 24, dur: 900 }));
        for (let i = 0; i < 8; i++) fx.tone(fx.rand(400, 1400), 0.15, { type: "sawtooth", vol: 0.04, at: 0.4 + i * 0.15, filter: { freq: 2000 } });
        fx.caption("(the whole zoo follows him home)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
      }
    },

    // Liar Liar
    {
      id: 1624,
      y: 1997,
      run: async (fx) => {
        const pen = fx.put(A.S("0 0 80 16", '<rect x="2" y="3" width="64" height="10" rx="2" fill="#2d5ad8" ' + A.ink + ' stroke-width="1.5"/><path d="M66 3 L78 8 L66 13 Z" fill="#c9a24a"/>'), W() / 2, H() * 0.4, { size: 90, h: 18 });
        fx.caption("The pen is blue.", { style: "subtitle", ms: 1600 });
        await fx.wait(1400);
        fx.caption("The pen is… r-r-r-", { style: "subtitle", ms: 1600 });
        fx.sfx("motor-strain", { dur: 1.3, vol: 0.7 });
        fx.move(pen, [{ transform: "none" }, { transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "none" }], { duration: 300, iterations: 4 });
        await fx.wait(1600);
        fx.caption("THE PEN IS BLUE!", { style: "hand", ms: 1400, css: { color: "#2d5ad8" } });
        fx.noise(0.4, { freq: 900, vol: 0.4 });
        await fx.wait(1000);
        fx.caption("(he can't lie for 24 hours)", { style: "whisper", ms: 1600 });
        fx.sfx("error", { vol: 0.8 });
        A.errorBox(fx, "honesty.exe", "Lying is currently disabled.\nRetry in 24:00:00.", 2000);
        await fx.wait(2000);
      }
    },

    // Happy Gilmore
    {
      id: 9614,
      y: 1996,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("linear-gradient(#bfe0ff 0 55%, rgba(120,190,90,.6) 55%)", 6400, { blend: "multiply", opacity: 0.4, fade: 400 });
        const ball = A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#fff" stroke="#999"/><circle cx="7" cy="7" r="1" fill="#ccc"/><circle cx="12" cy="9" r="1" fill="#ccc"/>');
        const reely = fx.$(".reely");
        fx.caption("(the running start)", { style: "whisper", ms: 1400 });
        await fx.move(reely, [{ transform: "none" }, { transform: "translateX(-40px)" }, { transform: "translateX(20px) rotate(20deg)" }, { transform: "none" }], { duration: 1200, easing: "ease-in" });
        fx.noise(0.2, { type: "highpass", freq: 3000, vol: 0.7 });
        fx.thud({ freq: 300, vol: 0.4, dur: 0.1 });
        await fx.fly(ball, [fx.rect(reely).x, fx.rect(reely).y], [r.x, r.y], { size: 14, dur: 1400, via: [W() / 2, -60] });
        fx.tone(2000, 0.3, { type: "sine", vol: 0.08, slide: 600 });
        fx.caption("The price is wrong!", { style: "subtitle", ms: 1600 });
        const bob = fx.put(A.S("0 0 40 50", '<circle cx="20" cy="14" r="10" fill="#e8c8a0" ' + A.ink + ' stroke-width="1.5"/><rect x="10" y="26" width="20" height="22" fill="#3a6ad8"/>'), W() * 0.7, H() * 0.6, { size: 30, h: 38 });
        fx.move(bob, [{ transform: "none" }, { transform: "rotate(-80deg) translateY(10px)" }], { duration: 400, delay: 800, fill: "forwards" });
        fx.later(800, () => { fx.thud({ vol: 0.5 }); fx.buzz(60); });
        await fx.wait(2000);
      }
    },

    // Austin Powers: International Man of Mystery
    {
      id: 816,
      y: 1997,
      run: async (fx) => {
        const cols = ["#ff3bb0", "#3bd1ff", "#ffd23b", "#7aff3b", "#b33bff", "#ff7a1a"];
        const shag = fx.node("", { cls: "fx-filter", style: { background: "conic-gradient(" + cols.map((c, i) => c + " " + i * 60 + "deg " + (i + 1) * 60 + "deg").join(",") + ")", opacity: 0.35, mixBlendMode: "multiply" } });
        if (!fx.reduced) fx.anim(shag, [{ transform: "rotate(0) scale(2)" }, { transform: "rotate(360deg) scale(2)" }], { duration: 5000 });
        const beat = 0.18;
        const soul = [["E4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["D5", 2], ["B4", 1], ["A4", 1], ["G4", 2], ["E4", 2]];
        fx.seq(soul.concat(soul), { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2000 } });
        for (let i = 0; i < 28; i++) { fx.thud({ freq: 70, vol: i % 2 ? 0 : 0.2, dur: 0.07, at: i * beat }); if (i % 2) fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.12, at: i * beat }); }
        A.retitle(fx, { fontFamily: "'Shrikhand', Georgia, serif", color: "#ff3bb0", transform: "skewX(-10deg)" }, 5000);
        fx.caption("Yeah, baby!", { style: "hand", ms: 1800, css: { color: "#ff3bb0" } });
        await fx.wait(2600);
        fx.caption("(one… million… dollars)", { style: "whisper", ms: 1800 });
        fx.costume(".reely", '<path d="M104 60 C110 54 110 66 104 62" stroke="#1d1a18" stroke-width="3" fill="none"/>', 1800);
        await fx.wait(2200);
      }
    },

    // Meet the Parents
    {
      id: 1597,
      y: 2000,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const circle = fx.put(box("border:4px dashed #c9a24a;border-radius:50%"), W() / 2, H() * 0.5, { size: Math.min(W(), H()) * 0.9 });
        fx.move(circle, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }], { duration: 5000 });
        fx.caption("(you're in the Circle of Trust… for now)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        fx.caption("I'm watching you.", { style: "subtitle", ms: 1400 });
        const fingers = fx.put(A.S("0 0 60 40", '<path d="M10 36 L20 4 L26 6 L20 30 M30 30 L36 4 L42 6 L36 36" stroke="#e8c8a0" stroke-width="6" stroke-linecap="round" fill="none"/>'), r.x, r.top - 30, { size: 50, h: 34 });
        await fx.move(fingers, [{ transform: "none" }, { transform: "rotate(180deg)" }, { transform: "rotate(180deg)" }, { transform: "none" }], 1400);
        fx.style(circle, { borderColor: "#d51f2a" });
        fx.tone(220, 0.6, { type: "sawtooth", vol: 0.06, slide: 110, filter: { freq: 900 } });
        fx.caption("(out of the circle)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // There's Something About Mary
    {
      id: 544,
      y: 1998,
      run: async (fx) => {
        fx.costume(".reely", '<path d="M40 14 C44 -10 76 -10 80 14 C74 2 66 -6 60 -8 C62 2 58 10 60 14" fill="#f2d33b" stroke="#1f1b16" stroke-width="2"/>', 5200);
        fx.caption("(the hair gel)", { style: "whisper", ms: 1600 });
        fx.tone(900, 0.4, { type: "sine", vol: 0.06, slide: 1400 });
        await fx.wait(2200);
        const strum = [["G4", "B4", "D5"], ["C4", "E4", "G4"], ["D4", "F#4", "A4"], ["G4", "B4", "D5"]];
        strum.forEach((c, i) => c.forEach((n, k) => fx.tone(n, 1, { type: "triangle", vol: 0.06, at: i * 0.6 + k * 0.03, attack: 0.002 })));
        const troubadours = fx.put(A.S("0 0 60 60", '<path d="M10 20 L20 4 L30 20 Z" fill="#6b4a2a"/><circle cx="20" cy="26" r="7" fill="#e8c8a0"/><path d="M12 34 H28 L30 58 H10 Z" fill="#2d3b55"/><ellipse cx="38" cy="44" rx="10" ry="8" fill="#c9a24a" stroke="#1d1a18" stroke-width="1.5"/><path d="M46 40 L58 28" stroke="#6b4a2a" stroke-width="3"/>'), W() * 0.85, H() * 0.3, { size: 50 });
        void troubadours;
        fx.caption("(the band in the tree narrates everything)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
      }
    },

    // Superbad
    {
      id: 8363,
      y: 2007,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const id = fx.put('<div style="width:100%;height:100%;background:#e8e0f4;border:2px solid #1d1a18;border-radius:6px;font:10px/1.2 Arial,sans-serif;color:#1d1a18;padding:4px;box-sizing:border-box"><b>HAWAII</b><br>NAME: McLOVIN<br>AGE: 25<br>ORGAN DONOR</div>', r.x, r.y, { size: 110, h: 64 });
        fx.move(id, [{ transform: "scale(.2) rotate(-40deg)" }, { transform: "rotate(-4deg)" }], { duration: 500, easing: "cubic-bezier(.3,1.6,.5,1)" });
        fx.click({ freq: 2400, vol: 0.4 });
        fx.caption("McLovin.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        fx.caption("(just one name — like Seal)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const beat = 0.2;
        for (let i = 0; i < 12; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.08, at: i * beat });
        fx.seq([["C4", 1], ["Eb4", 1], ["F4", 1], ["G4", 1], ["Bb4", 2], ["G4", 2]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 1400 } });
        fx.caption("(the cops take him on a ride-along)", { style: "whisper", ms: 1800 });
        const light = fx.wash("rgba(255,0,0,.15)", 2400, {});
        for (let i = 0; i < 8; i++) { await fx.wait(150); light.style.background = i % 2 ? "rgba(255,0,0,.15)" : "rgba(0,80,255,.15)"; }
        await fx.wait(1200);
      }
    },

    // Step Brothers
    {
      id: 12133,
      y: 2008,
      run: async (fx) => {
        const drums = fx.put(A.S("0 0 80 60", '<ellipse cx="40" cy="40" rx="24" ry="16" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><ellipse cx="14" cy="30" rx="10" ry="6" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="66" cy="28" rx="12" ry="5" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.66, { size: 90, h: 68 });
        fx.caption("(don't touch my drum set)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const beat = 0.12;
        for (let i = 0; i < 20; i++) { fx.thud({ freq: fx.rand(60, 160), vol: 0.3, dur: 0.08, at: i * beat }); fx.noise(0.08, { type: "highpass", freq: fx.rand(4000, 8000), vol: 0.2, at: i * beat + 0.04 }); }
        await fx.move(drums, Array.from({ length: 10 }, (_, i) => ({ transform: "translate(" + fx.rand(-6, 6) + "px," + fx.rand(-6, 6) + "px)" })), 2400);
        fx.caption("Did we just become best friends?", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        fx.caption("YEP!", { style: "hand", ms: 1200 });
        fx.later(200, () => fx.caption("(bunk beds!)", { style: "whisper", ms: 1400 }));
        const bunk = fx.put(A.S("0 0 80 80", '<path d="M6 6 V78 M74 6 V78" stroke="#6b4a2a" stroke-width="5"/><rect x="6" y="20" width="68" height="10" fill="#8a6a3a"/><rect x="6" y="60" width="68" height="10" fill="#8a6a3a"/>'), W() * 0.2, H() * 0.6, { size: 70 });
        fx.move(bunk, [{ transform: "none" }, { transform: "rotate(-10deg)" }, { transform: "rotate(-90deg) translateY(30px)" }], { duration: 1200, delay: 400, easing: "ease-in" });
        fx.later(1500, () => fx.thud({ vol: 0.6 }));
        await fx.wait(1800);
      }
    },

    // Talladega Nights: The Ballad of Ricky Bobby
    {
      id: 9718,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("If you ain't first, you're last.", { style: "subtitle", ms: 2000 });
        const car = (c, n) => A.S("0 0 100 40", '<path d="M4 28 C4 20 14 16 30 14 L44 6 H70 L84 16 C94 18 96 22 96 28 V32 H4 Z" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><circle cx="26" cy="32" r="7" fill="#1d1a18"/><circle cx="76" cy="32" r="7" fill="#1d1a18"/><text x="50" y="28" font-size="12" text-anchor="middle" font-family="Georgia" fill="#fff">' + n + "</text>");
        const cars = [car("#d51f2a", "26"), car("#3a6ad8", "47"), car("#f2d33b", "11")];
        for (let lap = 0; lap < 2; lap++) {
          cars.forEach((c, i) => fx.later(i * 150, () => fx.fly(c, [-110, H() * 0.7 + i * 12], [W() + 110, H() * 0.7 + i * 12], { size: 90, h: 36, dur: 700 })));
          fx.tone(200, 1, { type: "sawtooth", vol: 0.05, slide: 600, filter: { freq: 1200 } });
          await fx.wait(1100);
        }
        fx.caption("(shake and bake!)", { style: "whisper", ms: 1400 });
        const flag = fx.put(box("background:conic-gradient(#1d1a18 25%, #fff 0 50%, #1d1a18 0 75%, #fff 0);background-size:14px 14px"), r.x, r.top - 30, { size: 60, h: 40 });
        fx.move(flag, [{ transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }], { duration: 300, iterations: 6, direction: "alternate" });
        await fx.wait(1800);
      }
    },

    // Tropic Thunder
    {
      id: 7446,
      y: 2008,
      run: async (fx) => {
        const trailer = fx.node('<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 18px/1.3 Georgia,serif;color:#fff;text-align:center;background:#0b0907;padding:0 20px"></div>', { cls: "fx-filter" });
        const d = trailer.firstChild;
        const cards = ["IN A WORLD…", "WHERE ACTORS…", "THOUGHT THEY WERE…", "…MAKING A WAR MOVIE"];
        for (const c of cards) {
          d.textContent = c;
          fx.thud({ vol: 0.5, freq: 50, dur: 0.6 });
          fx.noise(0.6, { type: "bandpass", freq: 300, q: 1, vol: 0.2 });
          await fx.wait(900);
        }
        fx.remove(trailer);
        fx.wash("rgba(40,90,40,.3)", 3000, { fade: 200 });
        fx.later(200, () => { fx.thud({ vol: 1, freq: 40 }); fx.flash("#ffcf5a", 200); fx.shake("lg", 600); fx.buzz([200]); });
        fx.caption("(the director steps on the wrong spot)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        fx.caption("(fake trailers first: this movie comes with several)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Borat
    {
      id: 496,
      y: 2006,
      run: async (fx) => {
        fx.caption("Very nice!", { style: "subtitle", ms: 1600 });
        const thumb = fx.put(A.S("0 0 40 50", '<path d="M10 22 H30 C34 22 34 30 30 30 C34 30 34 38 30 38 C34 38 32 46 28 46 H10 Z" fill="#e8c8a0" ' + A.ink + ' stroke-width="1.5"/><path d="M14 22 L18 4 C20 0 26 2 24 8 L22 22" fill="#e8c8a0" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.4, { size: 50, h: 62 });
        fx.move(thumb, [{ transform: "scale(0)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], 400);
        fx.tone(600, 0.5, { type: "sawtooth", vol: 0.05, slide: 800, filter: { freq: 1600 } });
        await fx.wait(1800);
        const anthem = [["C5", 2], ["G4", 1], ["C5", 1], ["E5", 2], ["D5", 2], ["C5", 2], ["G4", 2]];
        fx.seq(anthem, { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 1400 } });
        fx.caption("(the national anthem, wrong lyrics, at a rodeo)", { style: "whisper", ms: 2000 });
        A.retitle(fx, { transform: "scaleX(-1)" }, 2400);
        await fx.wait(2400);
      }
    },

    // Napoleon Dynamite
    {
      id: 8193,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const beat = 0.24;
        const canned = [["F4", 1], ["F4", 1], ["A4", 1], ["C5", 1], ["Bb4", 2], ["A4", 1], ["G4", 1], ["F4", 4]];
        fx.seq(canned.concat(canned), { type: "square", vol: 0.05, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 24; i++) { fx.thud({ freq: 80, vol: 0.2, dur: 0.07, at: i * beat }); if (i % 2) fx.noise(0.05, { type: "highpass", freq: 6000, vol: 0.15, at: i * beat }); }
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M36 34 C30 6 90 6 84 34 C80 20 70 16 60 16 C50 16 40 20 36 34 Z" fill="#c8804a" stroke="#1f1b16" stroke-width="2"/><circle cx="52" cy="55" r="9" fill="none" stroke="#1f1b16" stroke-width="2.5"/><circle cx="68" cy="55" r="9" fill="none" stroke="#1f1b16" stroke-width="2.5"/>', 6400);
        const moves = ["translateX(-10px) rotate(-8deg)", "translateY(-8px)", "translateX(10px) rotate(8deg)", "scaleX(-1)", "rotate(15deg)", "translateY(-12px) rotate(-15deg)"];
        for (let i = 0; i < 12; i++) {
          fx.move(reely, [{ transform: "none" }, { transform: moves[i % moves.length] }], { duration: beat * 1000, fill: "forwards" });
          await fx.wait(beat * 2000);
        }
        fx.caption("Vote for Pedro.", { style: "card", ms: 1600 });
        void r;
        await fx.wait(1400);
      }
    },

    // DodgeBall: A True Underdog Story
    {
      id: 9472,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("If you can dodge a wrench, you can dodge a ball.", { style: "subtitle", ms: 2400, css: { fontSize: "14px" } });
        const wrench = A.S("0 0 60 20", '<path d="M4 10 H40 M40 4 C50 2 56 6 56 10 C56 14 50 18 40 16 Z" stroke="#9aa2a6" stroke-width="5" fill="#9aa2a6"/>');
        for (let i = 0; i < 3; i++) {
          fx.fly(wrench, [W() + 30, fx.rand(H() * 0.2, H() * 0.6)], [-40, fx.rand(H() * 0.3, H() * 0.7)], { size: 50, h: 16, dur: 700, r2: -720 });
          fx.noise(0.3, { type: "bandpass", freq: 1800, q: 2, vol: 0.2 });
          fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateY(-20px) rotate(-10deg)" }, { transform: "none" }], { duration: 400, fill: "none" });
          await fx.wait(700);
        }
        const ball = A.S("0 0 40 40", '<circle cx="20" cy="20" r="18" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M6 14 C14 20 26 20 34 14" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>');
        await fx.fly(ball, [-40, r.y], [r.x, r.y], { size: 30, dur: 300 });
        fx.thud({ freq: 200, vol: 0.5, dur: 0.1 });
        fx.move(fx.slot(), [{ transform: "none" }, { transform: "rotate(8deg) translateX(10px)" }, { transform: "none" }], { duration: 300, fill: "none" });
        fx.caption("(the five D's: dodge, duck, dip, dive and dodge)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Wedding Crashers
    {
      id: 9522,
      y: 2005,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const rules = ["Rule #76: No excuses. Play like a champion.", "Rule #…: always bring a gift.", "(crab cakes are how we're gonna win)"];
        const card = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:2px solid #c9a24a;padding:8px;box-sizing:border-box;font:13px/1.3 Georgia,serif;color:#1d1a18;text-align:center;display:flex;align-items:center;justify-content:center"></div>', W() / 2, H() * 0.35, { size: 240, h: 70 });
        for (const rule of rules) {
          card.firstChild.textContent = rule;
          fx.tone(1800, 0.3, { type: "sine", vol: 0.06 });
          await fx.wait(1200);
        }
        const hora = [["D4", 1], ["F#4", 1], ["A4", 1], ["D5", 1], ["C#5", 1], ["A4", 1], ["F#4", 2]];
        fx.seq(hora.concat(hora), { type: "sawtooth", vol: 0.05, beat: 0.15, filter: { freq: 2200 } });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], { duration: 300, delay: i * 50, iterations: 4, fill: "none" }));
        hearts(fx, pt(r.x, r.y), 10);
        await fx.wait(2600);
      }
    },

    // Bridesmaids
    {
      id: 55721,
      y: 2011,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const mic = fx.put(A.S("0 0 20 60", '<ellipse cx="10" cy="10" rx="8" ry="10" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/><rect x="7" y="18" width="6" height="40" fill="#1d1a18"/>'), W() / 2, H() * 0.5, { size: 16, h: 48 });
        void mic;
        const toasts = [["Good evening…", 0], ["No — I had a toast…", 1], ["…I'll go after her toast.", 2]];
        for (const [t, i] of toasts) {
          fx.caption(t, { style: "subtitle", ms: 1300, css: { bottom: 14 + i * 6 + "vh" } });
          fx.tone(1400 + i * 400, 0.3, { type: "sine", vol: 0.04, vibrato: [20, 40] });
          await fx.wait(1100);
        }
        fx.caption("(the microphone battle escalates)", { style: "whisper", ms: 1600 });
        fx.tone(3400, 1.2, { type: "sine", vol: 0.05, vibrato: [8, 200] });
        await fx.wait(1600);
        const cookie = A.S("0 0 50 50", '<circle cx="25" cy="25" r="22" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M14 18 C20 12 30 12 36 18" stroke="#d51f2a" stroke-width="3" fill="none"/>');
        await fx.fly(cookie, [W() + 30, H() * 0.3], [r.x, r.y], { size: 50, dur: 800, r2: 360 });
        fx.thud({ vol: 0.5 });
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 20, spread: 50, gravity: 60, glyphs: [dot("#f4f0e6"), dot("#d51f2a")], min: 3, max: 8, dur: 800 });
        fx.caption("(the giant cookie)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // 21 Jump Street
    {
      id: 64688,
      y: 2012,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const truck = fx.put(A.S("0 0 120 60", '<path d="M4 50 V20 H80 V50 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M80 50 V26 H104 L116 38 V50 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><circle cx="26" cy="52" r="8" fill="#1d1a18"/><circle cx="96" cy="52" r="8" fill="#1d1a18"/><text x="40" y="40" font-size="9" text-anchor="middle" font-family="Georgia" fill="#fff">FUEL</text>'), -120, r.y + 60, { size: 110, h: 55 });
        const tanker = fx.move(truck, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 120) + "px)" }], { duration: 1400, easing: "ease-in" });
        fx.caption("(a fuel truck — that doesn't explode)", { style: "whisper", ms: 1800 });
        await tanker;
        await fx.wait(700);
        fx.caption("…", { style: "subtitle", ms: 700 });
        await fx.wait(900);
        fx.caption("(still no explosion)", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
        fx.sfx("boom", { vol: 1 });
        fx.flash("#ffcf5a", 200);
        fx.shake("lg", 700);
        fx.buzz([200, 60, 200]);
        fx.particles({ kind: "burst", from: pt(W() / 2, r.y + 60), count: 30, spread: 90, glyphs: [dot("#ffcf5a"), dot("#ff7a1a")], min: 5, max: 14, dur: 900 });
        fx.caption("(there it is)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Nacho Libre
    {
      id: 9353,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const mask = fx.costume(".reely", '<path d="M34 40 C34 20 86 20 86 40 V70 C86 86 34 86 34 70 Z" fill="#d51f2a" stroke="#1f1b16" stroke-width="2" opacity=".85"/><ellipse cx="50" cy="52" rx="7" ry="5" fill="#fff"/><ellipse cx="70" cy="52" rx="7" ry="5" fill="#fff"/><path d="M40 36 H80" stroke="#3a6ad8" stroke-width="4"/>', 6400);
        void mask;
        const beat = 0.2;
        fx.seq([["A4", 1], ["C5", 1], ["E5", 1], ["A5", 2], ["G5", 1], ["E5", 1], ["C5", 2], ["D5", 1], ["E5", 3]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2000 } });
        const reely = fx.$(".reely");
        await fx.move(reely, [{ transform: "none" }, { transform: "translateY(-40px) rotate(-180deg)" }, { transform: "translateY(0) rotate(-360deg)" }], { duration: 1200, easing: "ease-in-out" });
        fx.thud({ vol: 0.6 });
        fx.buzz(80);
        fx.caption("(eagle powers)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        fx.caption("(elote)", { style: "whisper", ms: 1200 });
        fx.put(A.S("0 0 40 80", '<path d="M20 4 C30 10 32 50 24 76 H16 C8 50 10 10 20 4 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><path d="M16 76 V80 M24 76 V80" stroke="#6b4a2a" stroke-width="3"/>'), r.x, r.y, { size: 24, h: 48, ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Tommy Boy
    {
      id: 11381,
      y: 1995,
      run: async (fx) => {
        const car = fx.put(A.car("#8a6a4a"), W() / 2, H() - 70, { size: 110, h: 50 });
        fx.caption("♪ Fat guy in a little coat ♪", { style: "hand", ms: 2000 });
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M26 70 H94 L90 110 H30 Z" fill="#6b4a2a" stroke="#1f1b16" stroke-width="3"/><path d="M60 70 V110" stroke="#1f1b16" stroke-width="2"/><path class="seam" d="M60 70 L56 90 L64 100" stroke="#fff" stroke-width="2" fill="none" opacity="0"/>', 5000);
        fx.seq([["C5", 1], ["D5", 1], ["E5", 1], ["C5", 1], ["G5", 2], ["E5", 2]], { type: "triangle", vol: 0.07, beat: 0.22 });
        await fx.move(reely, [{ transform: "none" }, { transform: "scale(1.1, .95)" }, { transform: "scale(1.2, .9)" }], { duration: 1600, fill: "forwards" });
        fx.noise(0.4, { type: "highpass", freq: 2500, vol: 0.5 });
        fx.caption("(riiiip)", { style: "whisper", ms: 1400 });
        await fx.wait(1200);
        fx.caption("(the car door falls off on the highway)", { style: "whisper", ms: 1800 });
        const door = fx.put(A.S("0 0 40 30", '<rect x="2" y="2" width="36" height="26" rx="3" fill="#8a6a4a" stroke="#1d1a18" stroke-width="1.5"/>'), W() / 2 + 20, H() - 70, { size: 30, h: 22 });
        await fx.move(door, [{ transform: "none" }, { transform: "translate(-120px, 30px) rotate(-200deg)" }], { duration: 700, easing: "ease-in" });
        fx.noise(0.4, { freq: 900, vol: 0.4 });
        await fx.wait(700);
        void car;
      }
    },

    // Dazed and Confused
    {
      id: 9571,
      y: 1993,
      run: async (fx) => {
        fx.filter("sepia(.35) saturate(1.3)", 6600, { fade: 400 });
        const car = fx.put(A.car("#e8801a"), -100, H() - 60, { size: 110, h: 50 });
        const beat = 0.24;
        const riff = [["E3", 1], ["G3", 1], ["A3", 2], ["E3", 1], ["G3", 1], ["Bb3", 1], ["A3", 1]];
        fx.seq(riff.concat(riff), { type: "sawtooth", vol: 0.07, beat, filter: { freq: 1400, q: 2 } });
        for (let i = 0; i < 16; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.08, at: i * beat });
        await fx.move(car, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 100) + "px)" }], { duration: 2400, easing: "ease-out" });
        fx.caption("Alright, alright, alright.", { style: "subtitle", ms: 2200 });
        fx.costume(".reely", '<path d="M40 70 C44 76 52 80 60 80 C68 80 76 76 80 70" stroke="#6b3a1a" stroke-width="3" fill="none"/>', 2400);
        await fx.wait(2400);
      }
    },

    // What About Bob?
    {
      id: 10276,
      y: 1991,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const fish = fx.put(A.S("0 0 50 70", '<rect x="6" y="20" width="38" height="46" rx="10" fill="rgba(200,230,255,.5)" ' + A.ink + ' stroke-width="2"/><path d="M4 20 H46" stroke="#1d1a18" stroke-width="3"/><path d="M14 44 C20 36 32 36 36 44 C32 52 20 52 14 44 Z M36 44 L42 38 V50 Z" fill="#f2a020"/>'), r.x, r.top + r.height + 30, { size: 40, h: 56 });
        void fish;
        fx.caption("(Gil, in a jar, round his neck)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const steps = ["Baby steps…", "baby steps to the elevator…", "baby steps into the elevator…"];
        for (const s of steps) {
          fx.caption(s, { style: "subtitle", ms: 1100 });
          fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateX(6px)" }], { duration: 400, fill: "forwards" });
          await fx.wait(1100);
        }
        fx.caption("I'm sailing! I'm a sailor!", { style: "hand", ms: 1600 });
        fx.move(fx.$(".reely"), [{ transform: "translateX(6px)" }, { transform: "rotate(-15deg)" }, { transform: "rotate(15deg)" }, { transform: "none" }], 1600);
        await fx.wait(1600);
      }
    },

    // The Naked Gun: From the Files of Police Squad!
    {
      id: 37136,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("(nothing to see here)", { style: "whisper", ms: 1600 });
        const booms = [[W() * 0.2, H() * 0.7], [W() * 0.8, H() * 0.6], [W() * 0.5, H() * 0.8]];
        booms.forEach(([x, y], i) => fx.later(i * 500, () => { fx.thud({ vol: 0.6 }); fx.particles({ kind: "burst", from: pt(x, y), count: 12, spread: 40, glyphs: [dot("#ffcf5a"), dot("#ff7a1a")], min: 5, max: 10, dur: 700 }); fx.flash("rgba(255,210,120,.4)", 100); }));
        await fx.wait(700);
        const cop = fx.put(A.S("0 0 40 70", '<path d="M10 10 H30 L28 4 H12 Z" fill="#2d3b55"/><circle cx="20" cy="16" r="7" fill="#e8c8a0"/><rect x="10" y="24" width="20" height="30" fill="#2d3b55"/><path d="M10 30 L0 20 M30 30 L40 20" stroke="#2d3b55" stroke-width="5"/>'), W() / 2, H() * 0.5, { size: 36, h: 64 });
        fx.move(cop, [{ transform: "none" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }], { duration: 400, iterations: 4, direction: "alternate" });
        fx.caption("Nothing to see here! Please disperse!", { style: "subtitle", ms: 2000 });
        await fx.wait(2400);
        const gag = fx.put('<div style="font:700 14px/1 Georgia,serif;color:#1d1a18;background:#fff;border:2px solid #1d1a18;padding:4px 8px">POLICE SQUAD — in color</div>', r.x, r.top - 20, { size: 180, h: 26 });
        void gag;
        fx.later(400, () => { fx.move(fx.slot(), [{ transform: "none" }, { transform: "translateY(" + (H() - r.y) + "px) rotate(40deg)" }, { transform: "none" }], { duration: 1200, fill: "none" }); fx.noise(0.4, { freq: 800, vol: 0.4, at: 0.3 }); });
        await fx.wait(1800);
      }
    },

    // A Fish Called Wanda
    {
      id: 623,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const tank = fx.put('<div style="width:100%;height:100%;border:3px solid #6d7478;background:linear-gradient(rgba(180,230,255,.3), rgba(60,140,200,.5))"></div>', W() / 2, H() * 0.55, { size: 180, h: 110 });
        void tank;
        const cols = ["#f2a020", "#3a6ad8", "#d51f2a", "#7aff3b"];
        const fishes = cols.map((c, i) => fx.put(A.fish(c), W() / 2 + (i - 1.5) * 36, H() * 0.55 + (i % 2) * 20, { size: 30, h: 18 }));
        fishes.forEach((f, i) => fx.move(f, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? 20 : -20) + "px)" }], { duration: 1000, iterations: 2, direction: "alternate" }));
        fx.caption("(the aquarium is not safe)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const fries = A.S("0 0 20 40", '<rect x="8" y="0" width="4" height="36" fill="#f2d33b"/>');
        for (let i = 0; i < fishes.length; i++) {
          fx.move(fishes[i], [{ transform: "none" }, { transform: "translateY(-80px) scale(.5)", opacity: 0 }], { duration: 400, delay: i * 250, fill: "forwards" });
          fx.later(i * 250, () => fx.noise(0.15, { type: "bandpass", freq: 1500, q: 3, vol: 0.3 }));
        }
        void fries;
        await fx.wait(1400);
        fx.caption("(Ken is not having a good day)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        void r;
      }
    },

    // Amélie
    {
      id: 194,
      y: 2001,
      run: async (fx) => {
        fx.filter("saturate(1.5) sepia(.3) hue-rotate(-15deg)", 7000, { fade: 400 });
        fx.wash("rgba(60,140,40,.15)", 7000, { blend: "multiply", fade: 400 });
        const accordion = [["A4", 1], ["C5", 1], ["E5", 1], ["A5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1]];
        fx.seq(accordion.concat(accordion), { type: "sawtooth", vol: 0.04, beat: 0.16, filter: { freq: 1600 }, vibrato: [6, 6] });
        fx.seq([["A3", 4], ["E3", 4], ["A3", 4], ["E3", 4]], { type: "triangle", vol: 0.05, beat: 0.16 });
        const gnome = fx.put(A.gnome, W() * 0.8, H() * 0.66, { size: 36, h: 58 });
        void gnome;
        const polaroids = ["#e8e0d0", "#e0d8c8", "#ece4d4"];
        for (let i = 0; i < 3; i++) {
          fx.put('<div style="width:100%;height:100%;background:' + polaroids[i] + ';border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,.3);transform:rotate(' + (i * 8 - 8) + 'deg)"><div style="margin:4px 4px 10px;height:60%;background:linear-gradient(#bfe0ff,#c8e0a0)"></div></div>', W() * 0.2 + i * 40, H() * 0.3 + i * 10, { size: 44, h: 52 });
          fx.noise(0.12, { type: "highpass", freq: 4000, vol: 0.3 });
          await fx.wait(400);
        }
        fx.caption("(the garden gnome is travelling the world)", { style: "whisper", ms: 2000 });
        await fx.wait(1800);
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 40 30", '<path d="M4 16 C4 6 36 6 36 16 C36 24 4 24 4 16 Z" fill="#e8c890" ' + A.ink + ' stroke-width="1.5"/><path d="M6 16 H34" stroke="#b08a50"/>'), r.x, r.top + r.height + 16, { size: 40, h: 30, ms: 1800 });
        fx.click({ freq: 5000, vol: 0.5 });
        fx.caption("(crack the crème brûlée)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // The Grand Budapest Hotel
    {
      id: 120467,
      y: 2014,
      run: async (fx) => {
        fx.pillarbox(7000, W() < 500 ? "10vw" : "20vw");
        fx.wash("linear-gradient(#ffc8d8, #e8a0c0)", 7000, { blend: "multiply", opacity: 0.35, fade: 300 });
        const hotel = fx.put(A.S("0 0 160 100", '<rect x="10" y="30" width="140" height="66" fill="#ffb0c8" ' + A.ink + ' stroke-width="2"/><path d="M10 30 L80 6 L150 30" fill="#e87a9a" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 12 }, (_, i) => '<rect x="' + (20 + (i % 6) * 22) + '" y="' + (40 + Math.floor(i / 6) * 22) + '" width="12" height="14" fill="#fff6e0"/>').join("")), W() / 2, H() * 0.3, { size: 170, h: 106 });
        void hotel;
        const bells = [["D6", 1], ["A5", 1], ["F#5", 1], ["D5", 1], ["E5", 2], ["A5", 2]];
        fx.seq(bells, { type: "triangle", vol: 0.06, beat: 0.16 });
        fx.seq([["D3", 2], ["A3", 2], ["D3", 2], ["A3", 2]], { type: "sawtooth", vol: 0.04, beat: 0.24, filter: { freq: 600 } });
        const box1 = fx.put(A.S("0 0 60 50", '<rect x="4" y="14" width="52" height="32" fill="#ffd0e0" ' + A.ink + ' stroke-width="2"/><path d="M4 14 H56 L50 4 H10 Z" fill="#f4b0c8" ' + A.ink + ' stroke-width="2"/><path d="M30 4 V46 M4 30 H56" stroke="#9ad0ff" stroke-width="3"/><text x="30" y="40" font-size="7" text-anchor="middle" fill="#1d1a18" font-family="Georgia">MENDL\'S</text>'), -40, H() * 0.7, { size: 50, h: 42 });
        await fx.move(box1, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 40) + "px)" }], { duration: 2400, easing: "steps(12)" });
        fx.caption("(Courtesan au chocolat, hiding a file)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Moonrise Kingdom
    {
      id: 83666,
      y: 2012,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(1.3) hue-rotate(-10deg)", 7000, { fade: 300 });
        const r = fx.rect(fx.slot());
        const beat = 0.24;
        const parts = [
          () => fx.tone("C5", 0.2, { type: "triangle", vol: 0.06 }),
          () => fx.tone("E5", 0.2, { type: "square", vol: 0.04, filter: { freq: 1400 } }),
          () => fx.thud({ freq: 90, vol: 0.2, dur: 0.1 }),
          () => fx.tone("G3", 0.3, { type: "sawtooth", vol: 0.04, filter: { freq: 500 } })
        ];
        const names = ["(the theme)", "(the variation)", "(the percussion)", "(the bass)"];
        for (let p = 0; p < 4; p++) {
          fx.caption(names[p], { style: "whisper", ms: 900 });
          for (let i = 0; i < 4; i++) for (let k = 0; k <= p; k++) fx.later(i * beat * 1000, parts[k]);
          await fx.wait(4 * beat * 1000);
        }
        fx.caption("(a young person's guide to the orchestra)", { style: "whisper", ms: 1800 });
        const tent = fx.put(A.S("0 0 80 60", '<path d="M4 56 L40 4 L76 56 Z" fill="#e8c890" ' + A.ink + ' stroke-width="2"/><path d="M40 4 V56" stroke="#1d1a18"/>'), r.x, r.top + r.height + 30, { size: 60, h: 45 });
        void tent;
        await fx.wait(1800);
      }
    },

    // Rushmore
    {
      id: 11545,
      y: 1998,
      run: async (fx) => {
        const clubs = ["French Club: President", "Bombardment Society: Captain", "Kite-Flying Society: Founder", "Beekeepers: President", "Rushmore Beekeepers: Founder"];
        const list = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:3px double #2d3b55;padding:8px;box-sizing:border-box;font:12px/1.4 Georgia,serif;color:#2d3b55"></div>', W() / 2, H() * 0.36, { size: 240, h: 120 });
        for (const c of clubs) {
          list.firstChild.innerHTML += c + "<br>";
          fx.click({ freq: 1800, vol: 0.3 });
          await fx.wait(500);
        }
        fx.caption("(Max Fischer, extra-curricular)", { style: "whisper", ms: 1800 });
        const beat = 0.2;
        fx.seq([["A4", 1], ["C5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["A4", 2]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2200 } });
        for (let i = 0; i < 8; i++) fx.thud({ freq: 80, vol: 0.2, dur: 0.07, at: i * beat });
        await fx.wait(2000);
        fx.caption("(a slow-motion walk, in a beret)", { style: "whisper", ms: 1600 });
        fx.costume(".reely", '<ellipse cx="60" cy="24" rx="26" ry="8" fill="#d51f2a" stroke="#1f1b16" stroke-width="2"/><path d="M60 16 V10" stroke="#1d1a18" stroke-width="3"/>', 2000);
        fx.tempo(0.3, 2000);
        await fx.wait(1800);
      }
    },

    // Juno
    {
      id: 7326,
      y: 2007,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const phone = fx.put(A.S("0 0 80 40", '<path d="M10 32 C4 32 4 20 14 16 C24 12 30 18 40 18 C50 18 56 12 66 16 C76 20 76 32 70 32 Z" fill="#e8b830" ' + A.ink + ' stroke-width="2"/><path d="M26 18 V10 C26 4 54 4 54 10 V18" stroke="#e8b830" stroke-width="4" fill="none"/>'), r.x, r.top + r.height + 24, { size: 70, h: 36 });
        void phone;
        fx.caption("(the hamburger phone)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        const strum = [["C4", "E4", "G4"], ["A3", "C4", "E4"], ["F3", "A3", "C4"], ["G3", "B3", "D4"]];
        strum.forEach((c, i) => c.forEach((n, k) => fx.tone(n, 0.8, { type: "triangle", vol: 0.06, at: i * 0.5 + k * 0.03, attack: 0.002 })));
        const tic = fx.put(box("background:#ff7ab0;border-radius:3px"), W() / 2, H() * 0.3, { size: 12, h: 8 });
        for (let i = 0; i < 12; i++) fx.later(i * 120, () => fx.fly(box("background:#ff7ab0;border-radius:3px"), [W() / 2, H() * 0.3], [fx.rand(0, W()), H() + 10], { size: 10, h: 6, dur: 900, r2: fx.rand(-400, 400) }));
        fx.caption("(orange Tic Tacs everywhere)", { style: "whisper", ms: 1600 });
        await fx.wait(2200);
        void tic;
      }
    },

    // 10 Things I Hate About You
    {
      id: 4951,
      y: 1999,
      run: async (fx) => {
        const list = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border-left:3px solid #d51f2a;padding:8px 10px;box-sizing:border-box;font:13px/1.35 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18"></div>', W() / 2, H() * 0.34, { size: 240, h: 150 });
        const items = ["I hate the way you talk to me,", "and the way you cut your hair.", "I hate the way you drive my car.", "…", "But mostly I hate the way", "I don't hate you."];
        for (const it of items) {
          list.firstChild.innerHTML += it + "<br>";
          fx.click({ freq: 1600, vol: 0.12 });
          await fx.wait(700);
        }
        fx.caption("(not even close — not even a little bit)", { style: "whisper", ms: 1600 });
        romance(fx);
        await fx.wait(1400);
        const r = fx.rect(fx.slot());
        const bleachers = fx.put(A.S("0 0 120 60", '<path d="M0 60 H120 M10 44 H110 M20 28 H100 M30 12 H90" stroke="#9aa2a6" stroke-width="4"/>'), W() / 2, H() * 0.75, { size: 150, h: 70 });
        void bleachers;
        const band = [["E5", 1], ["E5", 1], ["F5", 1], ["G5", 2], ["F5", 1], ["E5", 1], ["D5", 2], ["C5", 3]];
        fx.seq(band, { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2200 } });
        hearts(fx, pt(r.x, r.y), 8);
        await fx.wait(1600);
      }
    },

    // Freaky Friday
    {
      id: 10330,
      y: 2003,
      run: async (fx) => {
        const reely = fx.$(".reely"), kernel = fx.$(".kernel");
        const fortune = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:1px solid #999;font:11px/1.2 Georgia,serif;color:#b3122a;text-align:center;padding:4px;box-sizing:border-box">A journey soon begins, its prize reflected in another\'s eyes.</div>', W() / 2, H() * 0.34, { size: 200, h: 40 });
        void fortune;
        fx.chord(["C4", "F#4"], 2, { type: "sine", vol: 0.05, vibrato: [3, 10] });
        await fx.wait(1600);
        fx.shake("md", 900);
        fx.buzz([100, 60, 100]);
        fx.thud({ vol: 0.5 });
        fx.flash("#fff", 150);
        await fx.wait(300);
        const rr = fx.rect(reely), kr = fx.rect(kernel);
        if (!fx.reduced) {
          fx.anim(reely, [{ transform: "none" }, { transform: "translate(" + (kr.x - rr.x) + "px," + (kr.y - rr.y) + "px)" }], { duration: 10, fill: "forwards" });
          fx.anim(kernel, [{ transform: "none" }, { transform: "translate(" + (rr.x - kr.x) + "px," + (rr.y - kr.y) + "px)" }], { duration: 10, fill: "forwards" });
        }
        fx.caption("(you woke up in each other's bodies)", { style: "whisper", ms: 2000 });
        A.retitle(fx, { fontFamily: "'Special Elite', 'Courier New', monospace" }, 3000);
        await fx.wait(3000);
      }
    },

    // The Devil Wears Prada
    {
      id: 350,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("(you're wearing cerulean)", { style: "whisper", ms: 1800 });
        fx.style(fx.slot(), { filter: "sepia(1) saturate(4) hue-rotate(170deg)" }, 5000);
        fx.tone(900, 0.3, { type: "sine", vol: 0.05 });
        await fx.wait(2000);
        const coat = A.S("0 0 50 60", '<path d="M10 4 H40 L48 58 H2 Z" fill="#1d1a18"/><path d="M25 4 V58" stroke="#444"/>');
        const bag = A.S("0 0 40 30", '<rect x="4" y="10" width="32" height="18" rx="3" fill="#b3122a"/><path d="M12 10 C12 2 28 2 28 10" stroke="#b3122a" stroke-width="3" fill="none"/>');
        fx.fly(coat, [W() + 30, H() * 0.2], [r.x, r.y], { size: 40, h: 48, dur: 700 });
        fx.later(250, () => fx.fly(bag, [W() + 30, H() * 0.25], [r.x + 10, r.y + 10], { size: 32, h: 24, dur: 700 }));
        fx.noise(0.3, { type: "bandpass", freq: 1600, q: 2, vol: 0.2 });
        fx.caption("That's all.", { style: "subtitle", ms: 1600 });
        await fx.wait(1800);
        A.retitle(fx, { fontFamily: "Didot, 'Bodoni 72', Georgia, serif", letterSpacing: ".1em", color: "#1d1a18" }, 2400);
        fx.caption("(florals? for spring? groundbreaking.)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Notting Hill
    {
      id: 509,
      y: 1999,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const door = fx.put(A.S("0 0 60 100", '<rect x="4" y="4" width="52" height="92" fill="#3a6ad8" ' + A.ink + ' stroke-width="2"/><rect x="12" y="12" width="36" height="30" fill="#2d5ab8"/><rect x="12" y="50" width="36" height="38" fill="#2d5ab8"/><circle cx="46" cy="54" r="2.5" fill="#c9a24a"/>'), W() * 0.2, H() * 0.55, { size: 60, h: 100 });
        void door;
        fx.caption("(the famous blue door)", { style: "whisper", ms: 1600 });
        const oj = A.S("0 0 30 40", '<rect x="4" y="4" width="22" height="34" fill="#ffa020" ' + A.ink + ' stroke-width="1.5"/>');
        await fx.fly(oj, [W() * 0.6, H() * 0.3], [r.x, r.y], { size: 26, h: 34, dur: 700 });
        fx.noise(0.3, { type: "lowpass", freq: 600, vol: 0.5 });
        fx.put(box("background:rgba(255,160,32,.5);border-radius:40%"), r.x, r.y, { size: r.width * 0.8, h: r.height * 0.6, ms: 2400 });
        fx.caption("Whoops-a-daisy.", { style: "subtitle", ms: 1600 });
        await fx.wait(1800);
        fx.caption("I'm also just a girl, standing in front of a boy…", { style: "subtitle", ms: 2600, css: { fontSize: "14px" } });
        romance(fx);
        await fx.wait(2400);
      }
    },

    // When Harry Met Sally...
    {
      id: 639,
      y: 1989,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const deli = fx.put(A.S("0 0 120 60", '<rect x="4" y="20" width="112" height="36" fill="#8a3a1a" ' + A.ink + ' stroke-width="2"/><text x="60" y="44" font-size="14" text-anchor="middle" font-family="Georgia" fill="#fff">KATZ\'S</text>'), W() / 2, H() * 0.2, { size: 130, h: 65 });
        void deli;
        await fx.wait(1000);
        const other = fx.pick(fx.otherSlots(true));
        if (other) {
          const or_ = fx.rect(other);
          fx.caption("I'll have what she's having.", { style: "subtitle", ms: 2200, css: { top: or_.top + or_.height + 6 + "px", bottom: "auto" } });
        } else fx.caption("I'll have what she's having.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        fx.caption("(it's New Year's Eve)", { style: "whisper", ms: 1600 });
        const auld = [["C5", 1], ["F5", 1.5], ["E5", 0.5], ["F5", 1], ["A5", 1], ["G5", 1.5], ["F5", 0.5], ["G5", 1], ["A5", 1], ["F5", 2]];
        fx.seq(auld, { type: "sine", vol: 0.08, beat: 0.28 });
        fx.particles({ kind: "fall", count: 30, glyphs: ["#ff3bb0", "#3bd1ff", "#ffd23b", "#fff"].map((c) => A.star(c)), min: 6, max: 12, dur: 2600, spin: 360 });
        hearts(fx, pt(r.x, r.y), 10);
        await fx.wait(3000);
      }
    },

    // Sleepless in Seattle
    {
      id: 858,
      y: 1993,
      run: async (fx) => {
        fx.wash("rgba(30,40,80,.35)", 7000, { fade: 400 });
        const radio = fx.put(A.S("0 0 80 50", '<rect x="4" y="10" width="72" height="36" rx="6" fill="#8a6a3a" ' + A.ink + ' stroke-width="2"/><circle cx="24" cy="28" r="10" fill="#3b3530"/><rect x="42" y="18" width="28" height="8" fill="#f2d33b"/><path d="M60 10 L70 0" stroke="#1d1a18" stroke-width="2"/>'), W() * 0.2, H() * 0.66, { size: 70, h: 44 });
        void radio;
        for (let i = 0; i < 4; i++) fx.noise(0.5, { type: "bandpass", freq: 1500, q: 4, vol: 0.06, at: i * 0.6 });
        fx.caption("(a kid calls a late-night radio show)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const empire = fx.put(A.S("0 0 60 160", '<rect x="18" y="60" width="24" height="100" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/><rect x="22" y="30" width="16" height="30" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/><rect x="26" y="12" width="8" height="18" fill="#6d7478"/><path d="M30 0 V12" stroke="#6d7478" stroke-width="2"/><g class="h" opacity="0"><path d="M30 90 C18 80 18 70 24 68 C28 66 30 70 30 72 C30 70 32 66 36 68 C42 70 42 80 30 90 Z" fill="#ff3b5a"/></g>'), W() * 0.7, H() * 0.45, { size: 60, h: 160 });
        const h = empire.querySelector(".h");
        romance(fx);
        await fx.wait(1600);
        if (h) fx.anim(h, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
        fx.caption("(top of the Empire State Building, Valentine's Day)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // You've Got Mail
    {
      id: 9489,
      y: 1998,
      run: async (fx) => {
        const beeps = [[1200, 0], [2400, 0.2], [1800, 0.35], [2600, 0.5], [900, 0.7]];
        beeps.forEach(([f, t]) => fx.sfx("blip", { hz: f, at: t * 1000, vol: 0.55 }));
        fx.sfx("static", { at: 900, dur: 1.6, vol: 0.4 });
        fx.noise(1.8, { type: "bandpass", freq: 2200, q: 1, vol: 0.12, at: 0.9 });
        fx.tone(1600, 1.8, { type: "square", vol: 0.03, at: 0.9, vibrato: [30, 400] });
        const bar = A.progress(fx, "Connecting…", 2600, 0.6);
        await bar;
        const r = fx.rect(fx.slot());
        const env = fx.put(A.envelope, r.x, r.y, { size: 60, h: 40 });
        fx.sfx("chime", { vol: 0.7 });
        fx.move(env, [{ transform: "scale(0)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], 400);
        fx.caption("You've got mail!", { style: "subtitle", ms: 1800 });
        fx.chord(["C5", "E5", "G5"], 0.6, { type: "triangle", vol: 0.06 });
        await fx.wait(1600);
        fx.caption("(from NY152, of course)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // The Notebook
    {
      id: 11036,
      y: 2004,
      run: async (fx) => {
        fx.wash("rgba(60,80,120,.3)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 70, glyphs: '<div style="width:1px;height:100%;background:rgba(220,230,255,.8)"></div>', min: 12, max: 20, dur: 800, stagger: 6000 });
        fx.noise(6, { type: "highpass", freq: 2500, vol: 0.1, attack: 0.4 });
        fx.caption("(it rained)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
        const boat = A.S("0 0 80 30", '<path d="M4 16 C20 28 60 28 76 16 Z" fill="#8a6a3a" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="10" r="4" fill="#1d1a18"/><circle cx="48" cy="10" r="4" fill="#6b3a1a"/>');
        fx.caption("It wasn't over. It still isn't over.", { style: "subtitle", ms: 2400 });
        const swans = [];
        for (let i = 0; i < 6; i++) swans.push(fx.put(A.swan, fx.rand(30, W() - 30), H() * fx.rand(0.55, 0.85), { size: 36, h: 27 }));
        fx.fly(boat, [-80, H() * 0.7], [W() + 80, H() * 0.66], { size: 80, h: 30, dur: 3600 });
        romance(fx);
        await fx.wait(3200);
        void swans;
      }
    },

    // Jerry Maguire
    {
      id: 9390,
      y: 1996,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("Show me the money!", { style: "hand", ms: 2000 });
        const phone = fx.put(A.S("0 0 30 60", '<rect x="4" y="2" width="22" height="56" rx="4" fill="#1d1a18"/><rect x="7" y="10" width="16" height="12" fill="#3aff8a"/>'), W() * 0.2, H() * 0.5, { size: 30, h: 60 });
        void phone;
        for (let i = 0; i < 4; i++) fx.tone(i % 2 ? 180 : 220, 0.4, { type: "sawtooth", vol: 0.06, at: i * 0.45, filter: { freq: 1200 } });
        A.coinReturn(fx, 10, "#3aa655");
        fx.sfx("coin-drop", { n: 10, every: 0.11 });
        await fx.wait(2200);
        fx.caption("You had me at hello.", { style: "subtitle", ms: 2200 });
        romance(fx);
        hearts(fx, pt(r.x, r.y), 10);
        await fx.wait(2400);
      }
    },

    // Say Anything...
    {
      id: 2028,
      y: 1989,
      run: async (fx) => {
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const boombox = fx.put(A.S("0 0 120 70", '<rect x="4" y="16" width="112" height="50" rx="6" fill="#6d7478" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="42" r="16" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><circle cx="90" cy="42" r="16" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><rect x="48" y="30" width="24" height="12" fill="#cfd4d6"/><path d="M20 16 V6 H100 V16" stroke="#1d1a18" stroke-width="3" fill="none"/>'), rr.x, rr.y - 70, { size: 100, h: 58 });
        fx.caption("(the trench coat, the boombox, held high)", { style: "whisper", ms: 2200 });
        const song = [["F4", 2], ["A4", 1], ["C5", 1], ["D5", 3], ["C5", 1], ["A4", 2], ["G4", 2], ["F4", 4]];
        fx.seq(song, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { freq: 1400 }, vibrato: [5, 6] });
        fx.seq([["F2", 4], ["D2", 4], ["Bb2", 4], ["C3", 4]], { type: "sine", vol: 0.08, beat: 0.35 });
        fx.move(boombox, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], { duration: 1400, iterations: 3 });
        await fx.wait(4400);
      }
    },

    // Pride & Prejudice
    {
      id: 4348,
      y: 2005,
      run: async (fx) => {
        const dawn = fx.wash("linear-gradient(#f8d8a0, #c8d8e8)", 7000, { blend: "multiply", opacity: 0.4, fade: 800 });
        void dawn;
        const mist = fx.wash("linear-gradient(transparent 50%, rgba(240,240,240,.7))", 7000, { fade: 1000 });
        void mist;
        const piano = [["E5", 1], ["C5", 1], ["G4", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["F5", 2], ["D5", 1], ["B4", 1], ["G4", 1], ["B4", 1], ["D5", 1], ["F5", 1], ["E5", 2]];
        fx.seq(piano, { type: "triangle", vol: 0.07, beat: 0.3, attack: 0.002 });
        const figure = A.S("0 0 40 100", '<circle cx="20" cy="10" r="7" fill="#3b3530"/><path d="M10 18 H30 L36 98 H4 Z" fill="#3b3530"/><path d="M4 30 C-8 50 -4 90 4 98" stroke="#3b3530" stroke-width="4" fill="none"/>');
        fx.caption("(across the misty field at dawn)", { style: "whisper", ms: 2200 });
        await fx.fly(figure, [W() + 30, H() * 0.7], [W() * 0.6, H() * 0.66], { size: 34, h: 84, dur: 3400, keep: true });
        fx.caption("You have bewitched me, body and soul.", { style: "subtitle", ms: 2400 });
        await fx.wait(2400);
      }
    },

    // Before Sunset
    {
      id: 80,
      y: 2004,
      run: async (fx) => {
        const clock = fx.put('<div style="font:700 22px/1 \'Special Elite\',\'Courier New\',monospace;color:#fbf4e2;background:#1d1a18;padding:4px 10px;border-radius:4px;text-align:center">80:00</div>', W() - 70, 60, { size: 110, h: 34 });
        const d = clock.firstChild;
        fx.wash("linear-gradient(#ffd8a0, #ffa060)", 7000, { blend: "multiply", opacity: 0.3, fade: 600 });
        fx.caption("(nine years later, one afternoon in Paris — in real time)", { style: "whisper", ms: 2400 });
        for (let s = 80; s > 72; s--) { d.textContent = s + ":00"; fx.click({ freq: 1200, vol: 0.1 }); await fx.wait(450); }
        fx.caption("Baby, you are gonna miss that plane.", { style: "subtitle", ms: 2400 });
        const waltz = [["A4", 3], ["C5", 1], ["E5", 2], ["D5", 3], ["C5", 1], ["B4", 2], ["A4", 6]];
        fx.seq(waltz, { type: "triangle", vol: 0.07, beat: 0.25, attack: 0.002 });
        fx.chord(["A3", "E4"], 3, { type: "sine", vol: 0.03 });
        await fx.wait(2400);
        d.textContent = "∞";
        fx.caption("I know.", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // (500) Days of Summer
    {
      id: 19913,
      y: 2009,
      run: async (fx) => {
        const counter = fx.put('<div style="font:900 30px/1 Georgia,serif;color:#fff;background:#3a8ad8;border-radius:50%;width:100%;height:100%;display:flex;align-items:center;justify-content:center">(1)</div>', W() / 2, H() * 0.3, { size: 90 });
        const d = counter.firstChild;
        const days = [1, 34, 290, 154, 488, 28, 500];
        for (const n of days) {
          d.textContent = "(" + n + ")";
          d.style.background = n > 290 ? "#6d7478" : "#3a8ad8";
          fx.click({ freq: 1600, vol: 0.2 });
          fx.tone(n > 290 ? 300 : 900, 0.2, { type: "triangle", vol: 0.05 });
          await fx.wait(600);
        }
        fx.caption("(expectations / reality)", { style: "whisper", ms: 1800 });
        const r = fx.rect(fx.slot());
        const split = fx.put('<div style="width:100%;height:100%;display:flex"><div style="flex:1;background:rgba(58,138,216,.35);border-right:2px dashed #fff"></div><div style="flex:1;background:rgba(109,116,120,.35)"></div></div>', r.x, r.y, { size: r.width * 1.3, h: r.height * 1.2 });
        void split;
        await fx.wait(1800);
        d.textContent = "(1)";
        fx.caption("(Autumn)", { style: "whisper", ms: 1400 });
        fx.particles({ kind: "fall", count: 14, glyphs: [A.leaf("#d9702a"), A.leaf("#b3402d")], min: 8, max: 14, dur: 1800 });
        await fx.wait(1600);
      }
    },

    // Romeo + Juliet
    {
      id: 454,
      y: 1996,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const tank = fx.put('<div style="width:100%;height:100%;border:3px solid #9aa2a6;background:linear-gradient(rgba(60,160,220,.4), rgba(20,80,160,.6))"></div>', W() / 2, H() * 0.5, { size: 200, h: 120 });
        void tank;
        const fishes = ["#ff7a1a", "#3bd1ff", "#ffd23b", "#ff3bb0"].map((c, i) => fx.put(A.fish(c), W() / 2 - 60 + i * 40, H() * 0.5 + (i % 2 ? 20 : -20), { size: 30, h: 18 }));
        fishes.forEach((f, i) => fx.move(f, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? 30 : -30) + "px)" }], { duration: 1400, iterations: 2, direction: "alternate" }));
        fx.caption("(through the fish tank, first sight)", { style: "whisper", ms: 2000 });
        romance(fx);
        await fx.wait(2400);
        fx.caption("(a Sword 9mm)", { style: "whisper", ms: 1400 });
        const gun = fx.put(A.S("0 0 80 40", '<path d="M4 14 H60 V8 H74 V22 H44 L40 36 H28 L32 22 H4 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><text x="30" y="19" font-size="7" font-family="Georgia" fill="#1d1a18">SWORD</text>'), r.x, r.top + r.height + 20, { size: 70, h: 35 });
        void gun;
        fx.tone(900, 0.5, { type: "sine", vol: 0.05, vibrato: [8, 40] });
        await fx.wait(1800);
      }
    },

    // The Truman Show
    {
      id: 37165,
      y: 1998,
      run: async (fx) => {
        const light = fx.put(A.S("0 0 40 60", '<rect x="12" y="4" width="16" height="12" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/><path d="M8 16 H32 L36 40 H4 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/><text x="20" y="34" font-size="6" text-anchor="middle" fill="#1d1a18" font-family="monospace">SIRIUS 9</text>'), W() * 0.3, -60, { size: 40, h: 60 });
        fx.noise(0.8, { freq: 3000, sweep: 400, vol: 0.2 });
        await fx.move(light, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.7 + 60) + "px) rotate(40deg)" }], { duration: 900, easing: "ease-in" });
        fx.thud({ vol: 0.6 });
        fx.noise(0.4, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.caption("(a studio light falls from the sky)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        const rain = fx.put('<div style="width:100%;height:100%;background:repeating-linear-gradient(90deg, transparent 0 6px, rgba(200,220,255,.6) 6px 7px)"></div>', W() / 2, H() * 0.3, { size: 80, h: H() * 0.6 });
        fx.caption("(the rain only falls on him)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        fx.remove(rain);
        const sky = fx.put(A.S("0 0 80 120", '<rect x="4" y="4" width="72" height="112" fill="#bfe0ff" ' + A.ink + ' stroke-width="2"/><path d="M4 40 C20 34 40 46 60 36" stroke="#fff" stroke-width="6" fill="none"/><path d="M50 60 H64 V116 H50 Z" fill="#1d1a18"/><text x="57" y="56" font-size="7" text-anchor="middle" font-family="Georgia" fill="#1d1a18">EXIT</text>'), W() / 2, H() * 0.45, { size: 90, h: 135 });
        void sky;
        fx.caption("Good afternoon, good evening, and good night.", { style: "subtitle", ms: 2600, css: { fontSize: "14px" } });
        await fx.wait(2600);
      }
    },

    // Big Fish
    {
      id: 587,
      y: 2003,
      run: async (fx) => {
        const daff = [];
        const n = W() < 500 ? 30 : 60;
        for (let i = 0; i < n; i++) {
          const d = fx.put(A.S("0 0 20 30", '<path d="M10 30 V14" stroke="#3a7a2a" stroke-width="2"/><circle cx="10" cy="10" r="4" fill="#f2a020"/>' + [0, 72, 144, 216, 288].map((a) => '<ellipse cx="10" cy="4" rx="3" ry="5" fill="#f2d33b" transform="rotate(' + a + ' 10 10)"/>').join("")), fx.rand(10, W() - 10), fx.rand(H() * 0.4, H() - 10), { size: 20, h: 30, style: { opacity: 0, transformOrigin: "50% 100%" } });
          daff.push(d);
          fx.anim(d, [{ opacity: 0, transform: "scale(0)" }, { opacity: 1, transform: "none" }], { duration: 400, delay: i * 40, fill: "forwards" });
        }
        fx.seq([["C5", 2], ["E5", 1], ["G5", 1], ["A5", 3], ["G5", 1], ["E5", 2], ["C5", 4]], { type: "sine", vol: 0.08, beat: 0.3 });
        fx.caption("(a whole field of daffodils — her favourite)", { style: "whisper", ms: 2400 });
        await fx.wait(3200);
        const fish = fx.put(A.fish("#9aa2a6"), W() / 2, H() * 0.3, { size: 140, h: 84 });
        fx.move(fish, [{ transform: "scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 800);
        fx.caption("(the one that got away)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Pleasantville
    {
      id: 2657,
      y: 1998,
      run: async (fx) => {
        const grey = fx.filter("grayscale(1)", 7000, { fade: 200 });
        void grey;
        const r = fx.rect(fx.slot());
        fx.caption("(it's 1958, and everything is black and white)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
        A.liftSlot(fx, 5000);
        const s = fx.slot();
        if (s) fx.style(s, { filter: "saturate(1.6)" }, 5000);
        const rose = fx.put(A.S("0 0 30 50", '<path d="M15 50 V20" stroke="#3a7a2a" stroke-width="3"/><circle cx="15" cy="14" r="10" fill="#d51f2a"/><path d="M9 12 C12 8 18 8 21 12" stroke="#8a0a14" stroke-width="2" fill="none"/>'), r.x, r.top + r.height + 24, { size: 24, h: 40 });
        void rose;
        fx.chord(["C5", "E5", "G5", "B5"], 2, { type: "sine", vol: 0.06, attack: 0.5 });
        fx.caption("(the first thing in colour)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
        fx.caption("(and then the colour spreads)", { style: "whisper", ms: 1400 });
        const others = fx.otherSlots(true).slice(0, 4);
        for (const o of others) { fx.style(o, { position: "relative", zIndex: 86 }, 1800); fx.tone(fx.pick(["E5", "G5", "C6"]), 0.4, { type: "sine", vol: 0.04 }); await fx.wait(300); }
        await fx.wait(600);
      }
    },

    // Death Becomes Her
    {
      id: 9374,
      y: 1992,
      run: async (fx) => {
        const reely = fx.$(".reely");
        const potion = fx.put(A.S("0 0 30 50", '<path d="M12 2 H18 V14 C28 20 28 44 15 48 C2 44 2 20 12 14 Z" fill="rgba(200,120,255,.7)" ' + A.ink + ' stroke-width="1.5"/>'), W() * 0.8, H() * 0.3, { size: 30, h: 50, style: { filter: "drop-shadow(0 0 10px #c080ff)" } });
        void potion;
        fx.caption("(one sip, eternal youth)", { style: "whisper", ms: 1600 });
        fx.tone(900, 1.4, { type: "sine", vol: 0.05, vibrato: [4, 30] });
        await fx.wait(1600);
        fx.noise(0.2, { freq: 900, vol: 0.5 });
        if (!fx.reduced) await fx.anim(reely, [{ transform: "none" }, { transform: "rotate(180deg)" }], { duration: 500, fill: "forwards" });
        fx.caption("(her head is on backwards)", { style: "whisper", ms: 1800 });
        fx.tone(300, 0.6, { type: "sawtooth", vol: 0.06, slide: 150, filter: { freq: 900 } });
        await fx.wait(2000);
        if (!fx.reduced) await fx.anim(reely, [{ transform: "rotate(180deg)" }, { transform: "none" }], { duration: 400, fill: "forwards" });
        fx.caption("(the spray paint touch-up helps)", { style: "whisper", ms: 1600 });
        fx.noise(0.8, { type: "bandpass", freq: 4000, q: 1, vol: 0.2 });
        await fx.wait(1600);
      }
    }
  ]);
})();
