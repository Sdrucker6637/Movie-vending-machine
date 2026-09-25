/* Machine FX cues - late show: dramas, crime, war, thrillers and horror.
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
  const sting = (fx) => { fx.chord(["C3", "C#3", "G3"], 1.2, { type: "sawtooth", vol: 0.12, filter: { freq: 1600 } }); fx.flash("#fff", 120); fx.buzz([100, 40, 100]); fx.shake("md", 400); };
  const shots = (fx, n, gap) => { for (let i = 0; i < n; i++) { fx.noise(0.12, { freq: 2600, vol: 0.5, at: i * (gap || 0.15) }); fx.thud({ vol: 0.2, freq: 120, dur: 0.08, at: i * (gap || 0.15) }); } };
  const dark = (fx, ms, a) => fx.wash("rgba(5,5,10," + (a || 0.6) + ")", ms, { fade: 400 });

  M.register([
    // Casino
    {
      id: 524,
      y: 1995,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("radial-gradient(circle, rgba(255,200,80,.2), rgba(60,10,20,.5))", 6400, { fade: 400 });
        const reels = [0, 1, 2].map((i) => fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:3px solid #c9a24a;border-radius:6px;font:700 30px/60px Georgia,serif;text-align:center;color:#b3122a">7</div>', W() / 2 + (i - 1) * 56, H() * 0.36, { size: 50, h: 60 }));
        const syms = ["7", "♦", "BAR", "♣", "♥", "7"];
        for (let k = 0; k < 16; k++) {
          reels.forEach((rl, i) => { if (k < 8 + i * 4) rl.firstChild.textContent = syms[(k + i * 2) % syms.length]; });
          fx.sfx("click", { vol: 0.35 });
          await fx.wait(90);
        }
        reels.forEach((rl) => (rl.firstChild.textContent = "7"));
        for (let i = 0; i < 8; i++) fx.tone(["C5", "E5", "G5", "C6"][i % 4], 0.12, { type: "square", vol: 0.05, at: i * 0.1 });
        A.coinReturn(fx, 12);
        fx.sfx("bell", { vol: 0.6 });
        fx.sfx("coin-drop", { n: 12, every: 0.11, at: 150 });
        fx.caption("(the house always wins… eventually)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        void r;
      }
    },

    // Good Will Hunting
    {
      id: 489,
      y: 1997,
      run: async (fx) => {
        const board = fx.put('<div style="width:100%;height:100%;background:#2d3a2a;border:6px solid #8a6a3a;box-sizing:border-box;font:14px/1.5 \'Special Elite\',\'Courier New\',monospace;color:#f4f2ec;padding:10px;white-space:pre"></div>', W() / 2, H() * 0.34, { size: Math.min(W() - 30, 320), h: 120 });
        const eq = "A = (0 1 0 1)\n    (1 0 2 1)\nG(z) = Σ wₖ zᵏ …\n∴ walks of length n";
        for (let i = 0; i <= eq.length; i++) {
          board.firstChild.textContent = eq.slice(0, i);
          fx.noise(0.03, { type: "bandpass", freq: 3000, q: 4, vol: 0.12 });
          await fx.wait(55);
        }
        fx.caption("(the janitor solved it overnight)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        fx.caption("It's not your fault.", { style: "subtitle", ms: 1200 });
        await fx.wait(1300);
        fx.caption("It's not your fault.", { style: "subtitle", ms: 1200 });
        fx.chord(["G3", "D4", "B4"], 2.4, { type: "sine", vol: 0.04, attack: 0.6 });
        await fx.wait(1600);
      }
    },

    // Reservoir Dogs
    {
      id: 500,
      y: 1992,
      run: async (fx) => {
        const suits = [];
        for (let i = 0; i < 6; i++) suits.push(fx.put(A.S("0 0 30 70", '<circle cx="15" cy="8" r="6" fill="#e8c8a0"/><path d="M5 16 H25 L24 44 H6 Z" fill="#1d1a18"/><path d="M13 16 L15 24 L17 16" fill="#fff"/><path d="M15 18 V28" stroke="#1d1a18" stroke-width="2"/><path d="M8 44 L6 68 M22 44 L24 68" stroke="#1d1a18" stroke-width="5"/><rect x="8" y="6" width="14" height="3" fill="#1d1a18"/>'), -30 - i * 34, H() * 0.7, { size: 28, h: 64 }));
        const all = fx.$$("#fx-layer .fx-sprite");
        fx.tempo(0.5, 5000);
        fx.move(all, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.5 + 120) + "px)" }], { duration: 4200, easing: "linear" });
        const riff = [["E4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["D5", 2], ["B4", 2]];
        fx.seq(riff.concat(riff), { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 1600 } });
        fx.caption("(the slow-motion walk, in matching suits)", { style: "whisper", ms: 2200 });
        await fx.wait(3000);
        fx.caption("(who's Mr. Pink?)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        void suits;
      }
    },

    // Django Unchained
    {
      id: 68718,
      y: 2012,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(1.3)", 6400, { fade: 300 });
        const r = fx.rect(fx.slot());
        const tooth = fx.put(A.S("0 0 40 50", '<path d="M8 8 C8 2 32 2 32 8 C34 20 30 34 26 46 C24 40 22 30 20 30 C18 30 16 40 14 46 C10 34 6 20 8 8 Z" fill="#fbfbf4" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, 40, { size: 30, h: 38 });
        fx.move(tooth, [{ transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }], { duration: 400, iterations: 6, direction: "alternate" });
        fx.caption("(the dentist's wagon, with a swinging tooth)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        shots(fx, 3, 0.4);
        for (let i = 0; i < 3; i++) {
          const o = fx.pick(fx.otherSlots(true));
          if (o) fx.later(i * 400, () => fx.particles({ kind: "burst", from: o, count: 10, spread: 30, gravity: 60, glyphs: dot("#b3122a"), min: 3, max: 7, dur: 700 }));
        }
        await fx.wait(1400);
        fx.caption("The D is silent.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
        void r;
      }
    },

    // A Few Good Men
    {
      id: 881,
      y: 1992,
      run: async (fx) => {
        const gavel = fx.put(A.S("0 0 60 40", '<rect x="4" y="4" width="30" height="16" rx="3" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M19 20 L50 34" stroke="#8a6a3a" stroke-width="5"/>'), W() * 0.8, H() * 0.3, { size: 60, h: 40, style: { transformOrigin: "80% 90%" } });
        fx.caption("I want the truth!", { style: "subtitle", ms: 1600 });
        await fx.wait(1800);
        fx.caption("You can't handle the truth!", { style: "hand", ms: 2000 });
        fx.tone(160, 1.6, { type: "sawtooth", vol: 0.08, filter: { freq: 900 } });
        fx.shake("md", 700);
        fx.buzz([80, 40, 80]);
        await fx.wait(1800);
        for (let i = 0; i < 3; i++) {
          fx.move(gavel, [{ transform: "none" }, { transform: "rotate(-40deg)" }, { transform: "none" }], 300);
          fx.later(150, () => fx.thud({ freq: 220, vol: 0.4, dur: 0.1 }));
          await fx.wait(400);
        }
        fx.caption("(order in the court)", { style: "whisper", ms: 1400 });
        await fx.wait(1200);
      }
    },

    // Catch Me If You Can
    {
      id: 640,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("linear-gradient(135deg, rgba(40,120,160,.25), rgba(220,120,40,.25))", 7000, { fade: 400 });
        const beat = 0.18;
        const titles = [["F4", 1], ["Ab4", 1], ["C5", 1], ["Eb5", 1], ["D5", 2], ["C5", 1], ["Ab4", 1], ["F4", 2]];
        fx.seq(titles.concat(titles), { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2000 } });
        for (let i = 0; i < 16; i++) fx.click({ freq: 4000, vol: 0.15, at: i * beat });
        const silhouettes = [A.plane, A.S("0 0 60 60", '<rect x="6" y="6" width="48" height="48" fill="#1d1a18"/><rect x="14" y="14" width="32" height="12" fill="#e8c870"/>'), A.S("0 0 40 70", '<circle cx="20" cy="10" r="8" fill="#1d1a18"/><path d="M8 20 H32 L30 68 H10 Z" fill="#1d1a18"/>')];
        for (let i = 0; i < 6; i++) fx.later(i * 450, () => fx.fly(silhouettes[i % 3], [-60, H() * (0.2 + (i % 3) * 0.2)], [W() + 60, H() * (0.25 + (i % 3) * 0.2)], { size: 60, h: 40, dur: 1600 }));
        await fx.wait(2400);
        const cheque = fx.put('<div style="width:100%;height:100%;background:#e8f0e0;border:2px solid #3a6a4a;font:11px/1.2 Georgia,serif;color:#1d1a18;padding:6px;box-sizing:border-box">PAN AM · PAY TO THE ORDER OF Frank W. Abagnale · $1,400.00</div>', r.x, r.y, { size: 180, h: 44 });
        fx.move(cheque, [{ transform: "rotate(-10deg) scale(.5)" }, { transform: "rotate(-3deg)" }], 400);
        fx.caption("(the cheque looks very real)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Dead Poets Society
    {
      id: 207,
      y: 1989,
      run: async (fx) => {
        const desks = fx.otherSlots(true).slice(0, 8);
        fx.caption("Carpe diem.", { style: "card", ms: 1800 });
        await fx.wait(2000);
        fx.caption("O Captain! My Captain!", { style: "subtitle", ms: 2600 });
        for (let i = 0; i < desks.length; i++) {
          fx.move(desks[i], [{ transform: "none" }, { transform: "translateY(-16px) scale(1.06)" }], { duration: 300, fill: "forwards" });
          fx.thud({ freq: 200, vol: 0.2, dur: 0.08 });
          await fx.wait(260);
        }
        fx.chord(["D4", "F#4", "A4", "D5"], 2.4, { type: "sawtooth", vol: 0.04, attack: 0.5, filter: { freq: 1800 } });
        fx.seq([["D5", 2], ["E5", 1], ["F#5", 1], ["A5", 4]], { type: "sine", vol: 0.06, beat: 0.35 });
        fx.caption("(standing on the desks)", { style: "whisper", ms: 1600 });
        await fx.wait(2400);
      }
    },

    // The Pursuit of Happyness
    {
      id: 1402,
      y: 2006,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cube = fx.put(A.S("0 0 40 40", '<rect x="4" y="4" width="32" height="32" fill="#f2d33b" ' + A.ink + ' stroke-width="1.5"/><path d="M4 15 H36 M4 25 H36 M15 4 V36 M25 4 V36" stroke="#1d1a18"/><rect x="4" y="4" width="11" height="11" fill="#d51f2a"/><rect x="25" y="25" width="11" height="11" fill="#3a6ad8"/><rect x="15" y="15" width="10" height="10" fill="#3aa655"/>'), r.x, r.y, { size: 44 });
        fx.caption("(solving the cube in one taxi ride)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 12; i++) {
          fx.move(cube, [{ transform: "rotate(" + i * 90 + "deg)" }, { transform: "rotate(" + (i + 1) * 90 + "deg)" }], { duration: 180, fill: "forwards" });
          fx.click({ freq: 1800 + (i % 3) * 300, vol: 0.3 });
          await fx.wait(200);
        }
        fx.put(A.S("0 0 40 40", '<rect x="4" y="4" width="32" height="32" fill="#3aa655" stroke="#1d1a18" stroke-width="1.5"/><path d="M4 15 H36 M4 25 H36 M15 4 V36 M25 4 V36" stroke="#1d1a18"/>'), r.x, r.y, { size: 44, ms: 2000 });
        fx.remove(cube);
        fx.chord(["C5", "E5", "G5"], 1, { type: "triangle", vol: 0.06 });
        await fx.wait(1200);
        fx.caption("(the scanner is still missing)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Rocky IV
    {
      id: 1374,
      y: 1985,
      run: async (fx) => {
        fx.wash("rgba(200,230,255,.3)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 60, glyphs: A.snowflake, min: 5, max: 10, dur: 3600, stagger: 6000 });
        const beat = 0.15;
        const heart = [["E4", 1], ["E4", 1], ["G4", 1], ["E4", 1], ["A4", 2], ["G4", 2], ["E4", 1], ["D4", 1], ["E4", 4]];
        fx.seq(heart.concat(heart), { type: "square", vol: 0.05, beat, filter: { freq: 2000 } });
        for (let i = 0; i < 32; i++) fx.thud({ freq: 70, vol: i % 2 ? 0.1 : 0.3, dur: 0.07, at: i * beat });
        const log = fx.put(A.S("0 0 100 20", '<rect x="2" y="2" width="96" height="16" rx="8" fill="#8a6a3a" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.5, { size: 100, h: 20 });
        fx.caption("(training montage: logs, snow, a mountain)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 6; i++) {
          await fx.move(log, [{ transform: "none" }, { transform: "translateY(-30px)" }, { transform: "none" }], { duration: 400, fill: "none" });
          fx.buzz(20);
        }
        fx.caption("I must break you.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Raging Bull
    {
      id: 1578,
      y: 1980,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.3)", 6400, { fade: 300 });
        const ring = fx.put(box("border:4px solid #f4f2ec;border-left:none;border-right:none;box-shadow:inset 0 14px 0 -10px #f4f2ec, inset 0 -14px 0 -10px #f4f2ec"), W() / 2, H() * 0.55, { size: W() * 0.9, h: 100 });
        void ring;
        const inter = [["G4", 3], ["A4", 1], ["B4", 2], ["D5", 2], ["C5", 3], ["B4", 1], ["A4", 4]];
        fx.seq(inter, { type: "sawtooth", vol: 0.05, beat: 0.4, filter: { freq: 1400 }, vibrato: [5, 5], attack: 0.1 });
        fx.tempo(0.25, 4000);
        fx.caption("(in slow motion, through the ropes)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        for (let i = 0; i < 4; i++) {
          fx.later(i * 500, () => { fx.flash("#fff", 90); fx.thud({ vol: 0.6, freq: 60, dur: 0.3 }); fx.noise(0.15, { type: "highpass", freq: 3000, vol: 0.3 }); fx.buzz(40); });
        }
        await fx.wait(2200);
        fx.caption("You never got me down, Ray.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Unforgiven
    {
      id: 33,
      y: 1992,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(.8)", 7000, { fade: 400 });
        fx.wash("linear-gradient(#e8a060, #6a3a2a)", 7000, { blend: "multiply", opacity: 0.35, fade: 600 });
        const tree = fx.put(A.S("0 0 100 120", '<path d="M50 120 V60 M50 80 L20 50 M50 70 L80 40" stroke="#1d1a18" stroke-width="5" fill="none"/>'), W() * 0.75, H() * 0.6, { size: 90, h: 108 });
        void tree;
        const guitar = [["G4", 2], ["B4", 1], ["D5", 1], ["E5", 3], ["D5", 1], ["B4", 2], ["G4", 4]];
        guitar.reduce((t, [n, l]) => { fx.tone(n, 1, { type: "triangle", vol: 0.08, at: t, attack: 0.002 }); return t + l * 0.35; }, 0);
        fx.particles({ kind: "fall", count: 50, glyphs: '<div style="width:1px;height:100%;background:rgba(220,220,230,.6)"></div>', min: 12, max: 20, dur: 800, stagger: 3000 });
        await fx.wait(3200);
        fx.caption("Deserve's got nothin' to do with it.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Dances with Wolves
    {
      id: 581,
      y: 1990,
      run: async (fx) => {
        fx.wash("linear-gradient(#bfe0ff 0 55%, rgba(200,170,100,.6) 55%)", 7000, { blend: "multiply", opacity: 0.45, fade: 500 });
        const buffalo = A.S("0 0 60 40", '<path d="M6 26 C4 14 14 6 26 8 C34 4 46 6 50 14 C56 16 58 24 54 28 L50 30 V38 H44 V30 H20 V38 H14 V30 C8 30 6 28 6 26 Z" fill="#4a3020"/><path d="M8 14 L4 8 M14 10 L12 4" stroke="#e8e0d0" stroke-width="2"/>');
        for (let i = 0; i < 20; i++) fx.later(i * 120, () => fx.fly(buffalo, [-60, H() * fx.rand(0.6, 0.9)], [W() + 60, H() * fx.rand(0.6, 0.9)], { size: 50, h: 34, dur: 2400, easing: "steps(16)" }));
        for (let t = 0; t < 4; t += 0.12) fx.thud({ freq: 55, vol: 0.12, dur: 0.1, at: t });
        fx.buzz([40, 80, 40, 80, 40, 80, 40, 80, 40]);
        fx.seq([["D4", 3], ["F#4", 1], ["A4", 4], ["G4", 2], ["F#4", 2], ["D4", 4]], { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { freq: 1400 }, attack: 0.1 });
        await fx.wait(3600);
        const wolf = fx.put(A.S("0 0 50 34", '<path d="M6 24 C8 14 26 12 36 14 L42 6 L46 10 L44 18 C48 20 46 26 40 26 L38 32 M14 26 L12 32 M24 26 L24 32" fill="#b8b0a0" stroke="#1d1a18" stroke-width="1.5"/>'), W() * 0.3, H() * 0.55, { size: 44, h: 30 });
        fx.caption("(Two Socks)", { style: "whisper", ms: 1600 });
        fx.move(wolf, [{ transform: "none" }, { transform: "translateX(20px)" }, { transform: "none" }], 1200);
        await fx.wait(1600);
      }
    },

    // Master and Commander: The Far Side of the World
    {
      id: 8619,
      y: 2003,
      run: async (fx) => {
        fx.wash("linear-gradient(#8aa8c0, #2a4a6a)", 7000, { blend: "multiply", opacity: 0.45, fade: 400 });
        const ship = fx.put(A.S("0 0 140 120", '<path d="M10 90 C30 110 110 110 130 90 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M50 90 V10 M90 90 V20" stroke="#4a3020" stroke-width="3"/><path d="M52 14 C70 20 72 40 52 52 Z M52 56 C74 60 76 80 52 86 Z M92 24 C106 30 108 48 92 56 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.55, { size: 150, h: 128 });
        if (!fx.reduced) fx.page([{ transform: "rotate(0)" }, { transform: "rotate(3deg)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(0)" }], { duration: 2400, iterations: 2 });
        fx.move(ship, [{ transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }], { duration: 1200, iterations: 4, direction: "alternate" });
        fx.noise(5, { freq: 600, sweep: 1400, vol: 0.2, attack: 0.5 });
        const cello = [["G3", 3], ["D4", 1], ["B3", 2], ["G3", 2], ["C4", 4], ["B3", 4]];
        fx.seq(cello, { type: "sawtooth", vol: 0.05, beat: 0.4, filter: { freq: 900 }, vibrato: [5, 5], attack: 0.1 });
        fx.caption("(a duet — cello and violin — below decks)", { style: "whisper", ms: 2200 });
        await fx.wait(2800);
        for (let i = 0; i < 6; i++) fx.later(i * 200, () => { fx.thud({ vol: 0.5, freq: 50 }); fx.particles({ kind: "burst", from: pt(fx.rand(0, W()), H() * 0.5), count: 8, spread: 30, glyphs: dot("rgba(200,200,200,.7)"), min: 10, max: 20, dur: 800 }); });
        fx.caption("(broadside)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Full Metal Jacket
    {
      id: 600,
      y: 1987,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const hat = fx.costume(".reely", '<path d="M30 30 H90 L84 14 C74 4 46 4 36 14 Z" fill="#8a6a3a" stroke="#1f1b16" stroke-width="3"/><path d="M26 30 H94" stroke="#1d1a18" stroke-width="5"/>', 6000);
        void hat;
        const lines = ["WHAT IS YOUR MAJOR MALFUNCTION?", "SOUND OFF!", "I CAN'T HEAR YOU!"];
        for (const l of lines) {
          fx.caption(l, { style: "hand", ms: 1100, css: { fontSize: "20px" } });
          fx.tone(180, 0.6, { type: "sawtooth", vol: 0.08, filter: { type: "bandpass", freq: 900, q: 2 } });
          fx.shake("sm", 300);
          await fx.wait(1200);
        }
        const beat = 0.35;
        for (let i = 0; i < 8; i++) fx.thud({ freq: 90, vol: 0.3, dur: 0.1, at: i * beat });
        fx.caption("(a jelly doughnut, found in the footlocker)", { style: "whisper", ms: 2000 });
        fx.put(A.S("0 0 40 30", '<ellipse cx="20" cy="16" rx="18" ry="12" fill="#d9a13a" ' + A.ink + ' stroke-width="1.5"/><circle cx="20" cy="14" r="3" fill="#b3122a"/>'), r.x, r.y, { size: 40, h: 30, ms: 2400 });
        await fx.wait(2600);
      }
    },

    // Platoon
    {
      id: 792,
      y: 1986,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(40,70,30,.4), rgba(20,30,10,.6))", 7000, { fade: 500 });
        const adagio = [["Bb4", 3], ["C5", 1], ["Db5", 4], ["C5", 2], ["Bb4", 2], ["Ab4", 4], ["Bb4", 4]];
        fx.seq(adagio, { type: "sawtooth", vol: 0.04, beat: 0.4, filter: { freq: 1000 }, vibrato: [5, 5], attack: 0.3 });
        fx.chord(["Bb3", "Db4", "F4"], 6, { type: "sine", vol: 0.03, attack: 2 });
        const r = fx.rect(fx.slot());
        const man = A.S("0 0 60 80", '<circle cx="30" cy="12" r="8" fill="#3b3530"/><path d="M22 20 H38 L36 50 H24 Z" fill="#4a5a3a"/><path d="M24 24 L4 2 M36 24 L56 2" stroke="#4a5a3a" stroke-width="6" stroke-linecap="round"/><path d="M26 50 L22 78 M34 50 L38 78" stroke="#4a5a3a" stroke-width="6"/>');
        await fx.wait(2400);
        const f = fx.put(man, r.x, r.y, { size: 60, h: 80 });
        fx.tempo(0.3, 3000);
        fx.caption("(arms raised, in slow motion)", { style: "whisper", ms: 2200 });
        fx.move(f, [{ transform: "none" }, { transform: "translateY(20px) rotate(10deg)" }], { duration: 3000, fill: "forwards" });
        shots(fx, 6, 0.25);
        await fx.wait(3000);
      }
    },

    // Dunkirk
    {
      id: 374720,
      y: 2017,
      run: async (fx) => {
        fx.wash("linear-gradient(#aab8c0, #5a6a74)", 7000, { blend: "multiply", opacity: 0.4, fade: 400 });
        const tick = (at) => fx.click({ freq: 3000, vol: 0.4, at });
        for (let i = 0; i < 24; i++) tick(i * 0.25);
        fx.tone(110, 6, { type: "sawtooth", vol: 0.05, slide: 220, filter: { freq: 900 } });
        fx.tone(165, 6, { type: "sawtooth", vol: 0.03, slide: 330, filter: { freq: 900 } });
        fx.caption("(the watch keeps ticking — the tone keeps rising)", { style: "whisper", ms: 2400 });
        await fx.wait(2800);
        const boats = [];
        for (let i = 0; i < 8; i++) boats.push(fx.put(A.S("0 0 60 30", '<path d="M4 16 C14 28 46 28 56 16 Z" fill="' + ["#d51f2a", "#3a6ad8", "#f4f0e6", "#3aa655"][i % 4] + '" ' + A.ink + ' stroke-width="1.5"/><path d="M30 16 V2" stroke="#1d1a18" stroke-width="2"/>'), -40 - i * 40, H() * 0.75 + (i % 3) * 10, { size: 44, h: 22 }));
        boats.forEach((b) => fx.move(b, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.8) + "px)" }], { duration: 3000, easing: "ease-out", fill: "forwards" }));
        fx.caption("(the little ships)", { style: "whisper", ms: 1800 });
        fx.chord(["D4", "F#4", "A4", "D5"], 2.4, { type: "sine", vol: 0.05, attack: 0.8 });
        await fx.wait(3200);
      }
    },

    // Gone Girl
    {
      id: 210577,
      y: 2014,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.6) hue-rotate(-10deg)", 6600, { fade: 400 });
        const clue = fx.put(A.envelope, r.x, r.y, { size: 50, h: 34 });
        fx.move(clue, [{ transform: "scale(0)" }, { transform: "none" }], 300);
        fx.put('<div style="font:700 12px/1 Georgia,serif;color:#b3122a">CLUE ONE</div>', r.x, r.y + 30, { size: 80, h: 16, ms: 2600 });
        fx.caption("(a treasure hunt, from your missing wife)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        const pulse = [["A3", 4], ["G#3", 4], ["A3", 4], ["F3", 4]];
        fx.seq(pulse, { type: "sine", vol: 0.08, beat: 0.25 });
        fx.noise(3, { type: "bandpass", freq: 300, q: 3, vol: 0.1 });
        fx.caption("(the Amazing Amy)", { style: "whisper", ms: 1600 });
        const book = fx.put('<div style="width:100%;height:100%;background:#ffd0e0;border:2px solid #1d1a18;font:700 11px/1.2 Georgia,serif;color:#1d1a18;text-align:center;padding:6px;box-sizing:border-box">AMAZING AMY</div>', W() * 0.7, H() * 0.3, { size: 70, h: 90 });
        void book;
        await fx.wait(1600);
        fx.style(fx.slot(), { filter: "grayscale(1) contrast(1.4)" }, 1400);
        fx.caption("(she's not missing)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Prisoners
    {
      id: 146233,
      y: 2013,
      run: async (fx) => {
        fx.filter("saturate(.4) brightness(.9)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 60, glyphs: '<div style="width:1px;height:100%;background:rgba(200,210,220,.7)"></div>', min: 12, max: 20, dur: 800, stagger: 6000 });
        const maze = fx.put(A.S("0 0 100 100", '<rect x="4" y="4" width="92" height="92" fill="none" stroke="#1d1a18" stroke-width="3"/><path d="M4 30 H70 M30 30 V70 M30 70 H96 M50 50 H96 M50 50 V96 M70 4 V30" stroke="#1d1a18" stroke-width="3" fill="none"/>'), W() / 2, H() * 0.34, { size: 110 });
        const p = maze.querySelectorAll("path")[0];
        if (p && !fx.reduced) { p.style.strokeDasharray = 400; await fx.tween(2400, (k) => (p.style.strokeDashoffset = 400 * (1 - k))); }
        fx.caption("(the maze)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        const whistle = fx.put(A.S("0 0 40 20", '<rect x="4" y="4" width="26" height="12" rx="6" fill="#d51f2a"/><circle cx="32" cy="10" r="6" fill="#d51f2a"/>'), W() * 0.3, H() * 0.8, { size: 30, h: 16 });
        void whistle;
        fx.tone(2400, 0.8, { type: "sine", vol: 0.03, vibrato: [20, 100], at: 0.2 });
        fx.caption("(a faint red whistle, underground)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Nightcrawler
    {
      id: 242582,
      y: 2014,
      run: async (fx) => {
        dark(fx, 7000, 0.55);
        const cam = fx.put(A.S("0 0 60 40", '<rect x="4" y="8" width="44" height="28" rx="4" fill="#1d1a18"/><circle cx="26" cy="22" r="9" fill="#555" stroke="#aaa" stroke-width="2"/><rect x="48" y="16" width="10" height="12" fill="#1d1a18"/><circle cx="10" cy="12" r="2" fill="#ff2020"/>'), W() * 0.25, H() * 0.66, { size: 60, h: 40 });
        void cam;
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 7000, style: { opacity: 0.35 } });
        const rec = fx.put('<div style="font:700 13px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff3030">● REC</div>', 50, 30, { size: 60, h: 16 });
        fx.move(rec, [{ opacity: 1 }, { opacity: 0.2 }], { duration: 500, iterations: 12, direction: "alternate" });
        for (let i = 0; i < 6; i++) fx.later(i * 700, () => { const l = fx.wash(i % 2 ? "rgba(255,0,0,.2)" : "rgba(0,80,255,.2)", 500, {}); void l; });
        fx.caption("If it bleeds, it leads.", { style: "subtitle", ms: 2200 });
        await fx.wait(2600);
        fx.caption("(he moves the body into better light)", { style: "whisper", ms: 2000 });
        fx.style(fx.slot(), { filter: "brightness(1.4)", boxShadow: "0 0 20px rgba(255,255,255,.8)" }, 2400);
        await fx.wait(2400);
      }
    },

    // Collateral
    {
      id: 1538,
      y: 2004,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(30,60,50,.45), rgba(10,20,30,.6))", 7000, { fade: 400 });
        const r = fx.rect(fx.slot());
        const cab = fx.put(A.S("0 0 110 50", '<path d="M6 34 C6 24 16 22 26 20 L40 8 H74 L88 20 C100 22 106 26 106 34 V38 H6 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><rect x="44" y="0" width="24" height="8" fill="#f4f0e6" stroke="#1d1a18"/><circle cx="26" cy="40" r="8" fill="#1d1a18"/><circle cx="86" cy="40" r="8" fill="#1d1a18"/>'), W() / 2, H() * 0.72, { size: 110, h: 50 });
        void cab;
        fx.tone(70, 5, { type: "sawtooth", vol: 0.04, filter: { freq: 250 } });
        fx.caption("(a cab ride through LA at night)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const coyote = A.S("0 0 50 34", '<path d="M6 24 C8 14 26 12 36 14 L42 6 L46 10 L44 18 C48 20 46 26 40 26 L38 32 M14 26 L12 32 M24 26 L24 32" fill="#8a7a62" stroke="#1d1a18" stroke-width="1.5"/>');
        fx.fly(coyote, [-40, H() * 0.66], [W() + 40, H() * 0.64], { size: 44, h: 30, dur: 3000, easing: "linear" });
        fx.tempo(0.4, 3000);
        fx.chord(["E3", "B3", "G4"], 3, { type: "sine", vol: 0.04, attack: 1 });
        fx.caption("(two coyotes cross the road)", { style: "whisper", ms: 2000 });
        await fx.wait(3000);
        void r;
      }
    },

    // L.A. Confidential
    {
      id: 2118,
      y: 1997,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(1.1)", 6600, { fade: 300 });
        const mag = fx.put('<div style="width:100%;height:100%;background:#f4e8c8;border:2px solid #1d1a18;padding:6px;box-sizing:border-box;font:700 12px/1.2 Georgia,serif;color:#b3122a;text-align:center">HUSH-HUSH<div style="font:10px/1.2 Georgia,serif;color:#1d1a18;margin-top:6px">Off the record, on the QT, and very hush-hush.</div></div>', W() / 2, H() * 0.34, { size: 150, h: 90 });
        fx.move(mag, [{ transform: "rotate(-20deg) scale(.3)" }, { transform: "rotate(-4deg)" }], 400);
        fx.noise(0.2, { type: "bandpass", freq: 2000, q: 2, vol: 0.3 });
        const jazz = [["F4", 1], ["Ab4", 1], ["C5", 1], ["Eb5", 1], ["D5", 2], ["C5", 2]];
        fx.seq(jazz, { type: "sawtooth", vol: 0.04, beat: 0.25, filter: { type: "bandpass", freq: 1400, q: 1.5 } });
        await fx.wait(2400);
        fx.caption("Rollo Tomasi.", { style: "subtitle", ms: 1800 });
        fx.chord(["C3", "F#3"], 1.6, { type: "sawtooth", vol: 0.05, filter: { freq: 800 } });
        await fx.wait(2200);
      }
    },

    // Lock, Stock and Two Smoking Barrels
    {
      id: 100,
      y: 1998,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const guns = fx.put(A.S("0 0 120 30", '<rect x="4" y="8" width="80" height="6" fill="#6b4a2a"/><rect x="4" y="16" width="80" height="6" fill="#6b4a2a"/><rect x="84" y="6" width="32" height="18" rx="3" fill="#8a6a3a" ' + A.ink + ' stroke-width="1.5"/>'), r.x, r.y, { size: 110, h: 28 });
        void guns;
        fx.caption("(two antique shotguns)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const cards = [];
        for (let i = 0; i < 4; i++) cards.push(fx.put(A.card, W() / 2 + (i - 1.5) * 40, H() * 0.3, { size: 36, h: 50 }));
        cards.forEach((c, i) => fx.move(c, [{ transform: "rotateY(90deg)" }, { transform: "none" }], { duration: 250, delay: i * 200 }));
        for (let i = 0; i < 4; i++) fx.sfx("click", { at: i * 200, vol: 0.6 });
        await fx.wait(1200);
        fx.caption("(and one very bad hand of three-card brag)", { style: "whisper", ms: 1800 });
        fx.tone(200, 1, { type: "sawtooth", vol: 0.06, slide: 90, filter: { freq: 900 } });
        A.errorBox(fx, "IOU.txt", "You owe Hatchet Harry £500,000.\nYou have one week.", 2400);
        await fx.wait(2600);
      }
    },

    // Trainspotting
    {
      id: 627,
      y: 1996,
      run: async (fx) => {
        const beat = 0.14;
        for (let i = 0; i < 32; i++) fx.thud({ freq: i % 4 === 2 ? 150 : 80, vol: 0.3, dur: 0.07, at: i * beat });
        fx.seq([["E4", 2], ["E4", 2], ["G4", 2], ["E4", 2], ["A4", 2], ["G4", 2], ["E4", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 1800 } });
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "translateX(" + W() * 0.3 + "px)" }, { transform: "none" }], { duration: 1800, easing: "ease-in-out" });
        const words = ["Choose life.", "Choose a job.", "Choose a career.", "Choose a family.", "Choose a big television…"];
        for (const w of words) {
          fx.caption(w, { style: "subtitle", ms: 600 });
          await fx.wait(620);
        }
        fx.freeze(1200);
        fx.sfx("scratch", { vol: 0.8 });
        fx.caption("(freeze frame)", { style: "whisper", ms: 1200 });
        await fx.wait(1400);
      }
    },

    // In Bruges
    {
      id: 8321,
      y: 2008,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(60,70,90,.4), rgba(20,30,40,.5))", 7000, { fade: 400 });
        const tower = fx.put(A.S("0 0 60 180", '<rect x="16" y="40" width="28" height="140" fill="#8a6a4a" ' + A.ink + ' stroke-width="1.5"/><rect x="20" y="10" width="20" height="30" fill="#8a6a4a" ' + A.ink + ' stroke-width="1.5"/><circle cx="30" cy="60" r="8" fill="#f4f0e6" stroke="#1d1a18"/>' + Array.from({ length: 8 }, (_, i) => '<path d="M16 ' + (80 + i * 12) + ' H44" stroke="#6b4a2a"/>').join("")), W() * 0.75, H() * 0.5, { size: 60, h: 180 });
        void tower;
        for (let i = 0; i < 6; i++) fx.tone([392, 330, 294, 262, 294, 392][i], 1.6, { type: "sine", vol: 0.08, at: i * 0.5 });
        fx.caption("(the belfry — 366 steps)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
        fx.caption("(one of them loves Bruges; the other really, really doesn't)", { style: "whisper", ms: 3000 });
        fx.particles({ kind: "fall", count: 30, glyphs: A.snowflake, min: 4, max: 8, dur: 2600 });
        await fx.wait(3000);
      }
    },

    // Moneyball
    {
      id: 60308,
      y: 2011,
      run: async (fx) => {
        const sheet = fx.put('<div style="width:100%;height:100%;background:#0b0907;border:2px solid #3aff8a;font:12px/1.4 \'Special Elite\',\'Courier New\',monospace;color:#3aff8a;padding:8px;box-sizing:border-box;white-space:pre"></div>', W() / 2, H() * 0.34, { size: Math.min(W() - 30, 280), h: 120 });
        const rows = ["PLAYER        OBP", "Hatteberg    .374", "Justice       .376", "Giambi (J)    .343", "-> buy runs, not players"];
        for (const row of rows) {
          sheet.firstChild.textContent += row + "\n";
          fx.click({ freq: 2200, vol: 0.12 });
          await fx.wait(400);
        }
        fx.caption("(the scoreboard says 20)", { style: "whisper", ms: 1600 });
        const board = fx.put('<div style="font:700 28px/1 \'Special Elite\',\'Courier New\',monospace;color:#ffcf5a;background:#1d1a18;padding:4px 10px;text-align:center">W 20</div>', W() / 2, H() * 0.7, { size: 110, h: 40 });
        void board;
        for (let i = 0; i < 6; i++) fx.noise(0.3, { type: "bandpass", freq: 900, q: 0.5, vol: 0.12, at: i * 0.2 });
        fx.caption("How can you not be romantic about baseball?", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Raising Arizona
    {
      id: 378,
      y: 1987,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const banjo = [["G4", 0.5], ["B4", 0.5], ["D5", 0.5], ["G5", 0.5], ["D5", 0.5], ["B4", 0.5], ["G4", 0.5], ["D4", 0.5]];
        fx.seq(banjo.concat(banjo, banjo, banjo), { type: "triangle", vol: 0.07, beat: 0.2, attack: 0.002 });
        const babies = [];
        for (let i = 0; i < 5; i++) babies.push(fx.put(A.S("0 0 30 30", '<circle cx="15" cy="12" r="8" fill="#f2d6b3" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="15" cy="24" rx="10" ry="6" fill="#fbfbf4" ' + A.ink + ' stroke-width="1.5"/><circle cx="12" cy="11" r="1.2" fill="#1d1a18"/><circle cx="18" cy="11" r="1.2" fill="#1d1a18"/>'), W() * (0.15 + i * 0.17), H() * 0.72, { size: 26 }));
        fx.caption("(the Arizona quints — five babies)", { style: "whisper", ms: 1800 });
        babies.forEach((b, i) => fx.move(b, [{ transform: "none" }, { transform: "translate(" + fx.rand(-40, 40) + "px," + fx.rand(-40, 0) + "px)" }, { transform: "none" }], { duration: 1200, delay: i * 120, iterations: 2 }));
        await fx.wait(2400);
        const huggies = fx.put(A.S("0 0 40 40", '<rect x="4" y="6" width="32" height="30" rx="3" fill="#3a8ad8" ' + A.ink + ' stroke-width="1.5"/>'), -30, H() * 0.5, { size: 30 });
        fx.caption("(a pack of Huggies, fetched at full speed)", { style: "whisper", ms: 1600 });
        shots(fx, 4, 0.3);
        await fx.move(huggies, [{ transform: "none" }, { transform: "translateX(" + (W() + 60) + "px)" }], { duration: 1400, easing: "linear" });
        void r;
      }
    },

    // O Brother, Where Art Thou?
    {
      id: 134,
      y: 2000,
      run: async (fx) => {
        fx.filter("sepia(.7) saturate(1.2) hue-rotate(-10deg)", 7000, { fade: 400 });
        const mic = fx.put(A.S("0 0 40 90", '<rect x="10" y="4" width="20" height="30" rx="10" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M14 12 H26 M14 18 H26 M14 24 H26" stroke="#6d7478"/><path d="M20 34 V86 M8 86 H32" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.5, { size: 40, h: 90 });
        void mic;
        const man = [["E4", 1], ["G4", 1], ["A4", 1], ["B4", 2], ["A4", 1], ["G4", 1], ["E4", 2], ["D4", 2], ["E4", 4]];
        man.reduce((t, [n, l]) => { fx.tone(n, 0.5, { type: "triangle", vol: 0.08, at: t, attack: 0.002 }); return t + l * 0.2; }, 0);
        fx.seq(man, { type: "sawtooth", vol: 0.04, beat: 0.2, filter: { type: "bandpass", freq: 1200, q: 2 }, vibrato: [6, 8] });
        fx.caption("(the Soggy Bottom Boys — man of constant sorrow)", { style: "whisper", ms: 2400 });
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "translateY(-6px) rotate(-4deg)" }, { transform: "none" }, { transform: "translateY(-6px) rotate(4deg)" }, { transform: "none" }], { duration: 800, iterations: 4 });
        await fx.wait(3000);
        fx.caption("(the leg-kick)", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Léon: The Professional
    {
      id: 101,
      y: 1994,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const plant = fx.put(A.S("0 0 50 70", '<path d="M14 44 H36 L32 68 H18 Z" fill="#b5613a" ' + A.ink + ' stroke-width="2"/><path d="M25 44 C20 30 10 26 6 14 C16 16 22 26 25 34 C28 22 36 10 46 8 C42 20 32 30 25 44" fill="#3a8a3a" ' + A.ink + ' stroke-width="1.5"/>'), r.x, r.top + r.height + 30, { size: 44, h: 62 });
        void plant;
        fx.caption("(he waters the plant every day)", { style: "whisper", ms: 1800 });
        fx.particles({ kind: "fall", area: pt(r.x, r.top + r.height, 20, 10), count: 8, glyphs: A.drop("#9cd6ff"), min: 4, max: 7, dur: 800 });
        await fx.wait(2000);
        const milk = fx.put(A.S("0 0 30 50", '<path d="M6 12 L15 2 L24 12 V48 H6 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><rect x="6" y="22" width="18" height="12" fill="#3a6ad8"/>'), r.x - 40, r.top + r.height + 20, { size: 22, h: 36 });
        void milk;
        fx.caption("(two quarts of milk)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
        fx.costume(".reely", '<circle cx="52.5" cy="55" r="7" fill="#1d1a18"/><circle cx="67.5" cy="55" r="7" fill="#1d1a18"/><path d="M59 55 H61" stroke="#1d1a18" stroke-width="2"/>', 2400);
        fx.caption("(the round sunglasses)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Magnolia
    {
      id: 334,
      y: 1999,
      run: async (fx) => {
        const frog = A.S("0 0 40 30", '<ellipse cx="20" cy="18" rx="16" ry="10" fill="#5fa04a" ' + A.ink + ' stroke-width="1.5"/><circle cx="12" cy="8" r="4" fill="#5fa04a" ' + A.ink + ' stroke-width="1.5"/><circle cx="28" cy="8" r="4" fill="#5fa04a" ' + A.ink + ' stroke-width="1.5"/><circle cx="12" cy="8" r="1.5" fill="#1d1a18"/><circle cx="28" cy="8" r="1.5" fill="#1d1a18"/>');
        fx.wash("rgba(20,20,40,.4)", 7000, { fade: 400 });
        fx.caption("(it's not going to stop…)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        fx.particles({ kind: "fall", count: 60, glyphs: frog, min: 16, max: 28, dur: 1400, stagger: 3600, spin: 180 });
        for (let t = 0; t < 4; t += 0.08) fx.thud({ freq: fx.rand(100, 250), vol: 0.15, dur: 0.05, at: t });
        fx.buzz([30, 60, 30, 60, 30, 60, 30, 60, 30, 60]);
        await fx.wait(2000);
        fx.caption("(it's raining frogs)", { style: "whisper", ms: 1600 });
        fx.shake("sm", 1200);
        await fx.wait(2400);
      }
    },

    // Saw
    {
      id: 176,
      y: 2004,
      run: async (fx) => {
        dark(fx, 7000, 0.5);
        fx.filter("sepia(.4) hue-rotate(40deg) saturate(1.2)", 7000, { fade: 300 });
        const puppet = fx.put(A.S("0 0 60 80", '<circle cx="30" cy="30" r="22" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><circle cx="21" cy="26" r="5" fill="#1d1a18"/><circle cx="39" cy="26" r="5" fill="#1d1a18"/><circle cx="21" cy="26" r="2" fill="#d51f2a"/><circle cx="39" cy="26" r="2" fill="#d51f2a"/><circle cx="18" cy="40" r="4" fill="#d51f2a"/><circle cx="42" cy="40" r="4" fill="#d51f2a"/><path d="M22 44 V52 M38 44 V52 M22 52 H38" stroke="#1d1a18" stroke-width="2"/><path d="M8 60 H52 L56 80 H4 Z" fill="#1d1a18"/>'), -60, H() * 0.6, { size: 60, h: 80 });
        const trike = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8];
        trike.forEach((t) => fx.click({ freq: 900, vol: 0.3, at: t }));
        await fx.move(puppet, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 60) + "px)" }], { duration: 2000, easing: "steps(14)" });
        fx.caption("I want to play a game.", { style: "subtitle", ms: 2200 });
        fx.tone(130, 2, { type: "sawtooth", vol: 0.06, filter: { type: "bandpass", freq: 600, q: 4 }, vibrato: [6, 10] });
        await fx.wait(2200);
        const timer = fx.put('<div style="font:700 22px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff2020;background:#0b0907;padding:4px 8px">00:05</div>', W() / 2, H() * 0.25, { size: 90, h: 32 });
        for (let s = 5; s > 0; s--) { timer.firstChild.textContent = "00:0" + s; fx.tone(1400, 0.08, { type: "square", vol: 0.06 }); await fx.wait(300); }
        fx.noise(0.6, { type: "bandpass", freq: 500, q: 3, vol: 0.4 });
        fx.caption("Game over.", { style: "hand", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Final Destination
    {
      id: 9532,
      y: 2000,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("(a premonition)", { style: "whisper", ms: 1400 });
        const chain = [
          () => { fx.put(A.S("0 0 20 30", '<path d="M10 2 C16 10 16 20 10 28 C4 20 4 10 10 2 Z" fill="#9cd6ff"/>'), r.x - 60, r.y + 60, { size: 14, h: 20, ms: 1400 }); fx.tone(3000, 0.1, { type: "sine", vol: 0.05 }); },
          () => { fx.noise(0.4, { type: "bandpass", freq: 3000, q: 8, vol: 0.2 }); fx.caption("(a spark)", { style: "whisper", ms: 700, css: { bottom: "18vh" } }); },
          () => { fx.move(fx.pick(fx.otherSlots(true)), [{ transform: "none" }, { transform: "rotate(-4deg)" }, { transform: "none" }], { duration: 300, fill: "none" }); fx.click({ freq: 1500, vol: 0.4 }); },
          () => { fx.tone(200, 0.6, { type: "sawtooth", vol: 0.06, slide: 90, filter: { freq: 900 } }); }
        ];
        for (let i = 0; i < chain.length; i++) { chain[i](); await fx.wait(700); }
        sting(fx);
        fx.style(fx.slot(), { filter: "brightness(.4) sepia(1) hue-rotate(-30deg) saturate(3)" }, 800);
        await fx.wait(1000);
        fx.caption("(…and then he wakes up, still in his seat)", { style: "whisper", ms: 1800 });
        fx.caption("(death has a design)", { style: "whisper", ms: 1400, css: { bottom: "16vh" } });
        await fx.wait(2000);
      }
    },

    // 28 Days Later
    {
      id: 170,
      y: 2002,
      run: async (fx) => {
        fx.filter("saturate(.3) contrast(1.2) blur(.5px)", 7000, { fade: 400 });
        fx.node("", { cls: "fx-filter fx-grain", ms: 7000 });
        const empty = fx.otherSlots(true);
        empty.forEach((s) => fx.style(s, { opacity: "0.15" }, 4000));
        fx.caption("Hello?", { style: "subtitle", ms: 1400 });
        await fx.wait(1600);
        fx.caption("…hello?", { style: "whisper", ms: 1400 });
        fx.tone(220, 3, { type: "sawtooth", vol: 0.04, filter: { freq: 700 }, attack: 1 });
        const build = [["E4", 4], ["F4", 4], ["G4", 4], ["A4", 4]];
        fx.seq(build, { type: "sawtooth", vol: 0.04, beat: 0.35, filter: { freq: 1800 } });
        await fx.wait(2800);
        for (let i = 0; i < 12; i++) fx.later(i * 80, () => { const o = fx.pick(fx.otherSlots(true)); if (o) fx.move(o, [{ transform: "none" }, { transform: "translate(" + fx.rand(-6, 6) + "px," + fx.rand(-6, 6) + "px)" }, { transform: "none" }], { duration: 120, fill: "none" }); });
        fx.wash("rgba(200,0,0,.35)", 1200, { fade: 100 });
        fx.noise(1, { type: "bandpass", freq: 1000, q: 1, vol: 0.4 });
        fx.buzz([50, 30, 50, 30, 50]);
        await fx.wait(1400);
      }
    },

    // Zombieland
    {
      id: 19908,
      y: 2009,
      run: async (fx) => {
        const rules = ["Rule #1: Cardio", "Rule #2: The Double Tap", "Rule #4: Seatbelts", "Rule #32: Enjoy the little things"];
        for (let i = 0; i < rules.length; i++) {
          const el = fx.put('<div style="font:900 22px/1 Georgia,serif;color:#fff;text-shadow:3px 3px 0 #b3122a, -1px -1px 0 #000;white-space:nowrap">' + rules[i] + "</div>", W() / 2, H() * (0.25 + i * 0.13), { size: 300, h: 30 });
          fx.move(el, [{ transform: "scale(3)", opacity: 0 }, { transform: "none", opacity: 1 }], 300);
          fx.thud({ vol: 0.5, freq: 60 });
          fx.later(1600, () => fx.fadeOut(el, 300));
          await fx.wait(700);
        }
        const twinkie = fx.put(A.S("0 0 60 30", '<ellipse cx="30" cy="15" rx="28" ry="12" fill="#f2c060" ' + A.ink + ' stroke-width="1.5"/><circle cx="18" cy="15" r="2" fill="#fff"/><circle cx="30" cy="15" r="2" fill="#fff"/><circle cx="42" cy="15" r="2" fill="#fff"/>'), W() / 2, H() * 0.8, { size: 60, h: 30 });
        void twinkie;
        fx.caption("(and find the last Twinkie)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // The Cabin in the Woods
    {
      id: 22970,
      y: 2011,
      run: async (fx) => {
        const grid = fx.$("#grid");
        const rg = fx.rect(grid);
        const labels = ["ZOMBIES", "WEREWOLF", "MERMAN", "CLOWN", "UNICORN", "SUGARPLUM FAIRY", "WITCHES", "DRAGONBAT"];
        const others = fx.otherSlots(false).slice(0, labels.length);
        others.forEach((o, i) => {
          const or_ = fx.rect(o);
          fx.put('<div style="font:700 9px/1.1 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;border:1px solid #1d1a18;padding:2px;text-align:center">' + labels[i] + "</div>", or_.x, or_.y, { size: Math.min(or_.width, 80), h: 24, ms: 5400 });
        });
        fx.caption("(the betting board, in the control room)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 6; i++) fx.click({ freq: 2400, vol: 0.2, at: i * 0.15 });
        await fx.wait(2400);
        fx.caption("(the elevators open. All of them.)", { style: "whisper", ms: 2000 });
        fx.tone(900, 0.2, { type: "sine", vol: 0.08 });
        fx.later(200, () => fx.tone(900, 0.2, { type: "sine", vol: 0.08 }));
        await fx.wait(800);
        sting(fx);
        for (let i = 0; i < 8; i++) fx.later(i * 100, () => fx.flash(i % 2 ? "rgba(255,0,0,.3)" : "rgba(0,0,0,.3)", 90));
        await fx.wait(2000);
        void rg;
      }
    },

    // The Others
    {
      id: 1933,
      y: 2001,
      run: async (fx) => {
        const fog = fx.wash("radial-gradient(circle, rgba(220,225,230,.3), rgba(200,205,210,.85))", 7400, { fade: 800 });
        void fog;
        fx.caption("(every door must be locked before the next is opened)", { style: "whisper", ms: 2400 });
        const doors = fx.otherSlots(false).slice(0, 5);
        for (const d of doors) {
          fx.style(d, { filter: "brightness(.5)" }, 5400);
          fx.click({ freq: 1400, vol: 0.4 });
          fx.thud({ freq: 150, vol: 0.2, dur: 0.1, at: 0.05 });
          await fx.wait(450);
        }
        fx.tone(700, 2, { type: "sine", vol: 0.03, vibrato: [5, 20] });
        fx.caption("(the curtains must stay closed)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        fx.caption("This house is ours.", { style: "subtitle", ms: 1800 });
        fx.chord(["D4", "F4", "Ab4"], 2, { type: "sine", vol: 0.04, attack: 0.6 });
        await fx.wait(1800);
      }
    },

    // Misery
    {
      id: 1700,
      y: 1990,
      run: async (fx) => {
        fx.wash("rgba(220,230,240,.35)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 50, glyphs: A.snowflake, min: 5, max: 9, dur: 4000, stagger: 6000 });
        const pig = fx.put(A.S("0 0 40 30", '<ellipse cx="20" cy="18" rx="16" ry="10" fill="#ffb0c0" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="34" cy="16" rx="4" ry="3" fill="#ff90a8"/><path d="M8 26 V30 M16 26 V30 M24 26 V30 M32 26 V30" stroke="#1d1a18"/>'), W() * 0.8, H() * 0.7, { size: 40, h: 30 });
        void pig;
        fx.caption("(the pig is named Misery)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        fx.caption("I'm your number one fan.", { style: "subtitle", ms: 2000 });
        fx.chord(["E4", "G#4", "B4"], 2, { type: "sine", vol: 0.04 });
        await fx.wait(2200);
        const mallet = fx.put(A.S("0 0 60 50", '<rect x="4" y="4" width="36" height="20" rx="3" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M22 24 L50 46" stroke="#8a6a3a" stroke-width="5"/>'), W() / 2, H() * 0.45, { size: 60, h: 50, style: { transformOrigin: "80% 90%" } });
        await fx.move(mallet, [{ transform: "none" }, { transform: "rotate(-40deg)" }, { transform: "rotate(30deg)" }], { duration: 600, easing: "ease-in" });
        fx.thud({ vol: 0.8, freq: 90 });
        fx.noise(0.2, { type: "highpass", freq: 2500, vol: 0.5 });
        fx.buzz([150]);
        fx.caption("(hobbled)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Candyman
    {
      id: 9529,
      y: 1992,
      run: async (fx) => {
        dark(fx, 7400, 0.5);
        const mirror = fx.put(box("border:6px solid #8a6a3a;border-radius:6px;background:linear-gradient(135deg, rgba(200,220,235,.5), rgba(120,140,160,.6))"), W() / 2, H() * 0.4, { size: 150, h: 190 });
        void mirror;
        const choir = [["C4", "Eb4", "G4"], ["Ab3", "C4", "Eb4"], ["F3", "Ab3", "C4"], ["G3", "B3", "D4"]];
        choir.forEach((c, i) => fx.chord(c, 1.3, { type: "sine", vol: 0.05, at: i * 1.1, attack: 0.3 }));
        for (let i = 1; i <= 5; i++) {
          fx.caption("Candyman…", { style: "whisper", ms: 900, css: { bottom: 10 + i * 6 + "vh", opacity: 0.4 + i * 0.12 } });
          await fx.wait(900);
        }
        const hook = fx.put(A.S("0 0 40 60", '<path d="M20 60 V30 C20 10 38 8 36 24 C34 34 24 30 26 22" stroke="#9aa2a6" stroke-width="5" fill="none" stroke-linecap="round"/>'), W() / 2 + 40, H() * 0.4, { size: 40, h: 60 });
        fx.move(hook, [{ opacity: 0 }, { opacity: 1 }], 200);
        sting(fx);
        fx.particles({ kind: "burst", from: hook, count: 20, spread: 60, glyphs: A.S("0 0 20 14", '<ellipse cx="10" cy="8" rx="7" ry="5" fill="#e8b830"/><path d="M6 6 L14 6" stroke="#1d1a18" stroke-width="2"/>'), min: 8, max: 14, dur: 1400 });
        fx.noise(1.4, { type: "bandpass", freq: 220, q: 6, vol: 0.3 });
        await fx.wait(1800);
      }
    },

    // Child's Play
    {
      id: 10585,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const doll = fx.put(A.S("0 0 50 80", '<circle cx="25" cy="18" r="14" fill="#f2d6b3" ' + A.ink + ' stroke-width="1.5"/><path d="M11 14 C12 0 38 0 39 14 C34 8 16 8 11 14 Z" fill="#e8601a"/><circle class="e" cx="20" cy="18" r="2" fill="#3a6ad8"/><circle class="e" cx="30" cy="18" r="2" fill="#3a6ad8"/><path class="m" d="M20 26 Q25 30 30 26" stroke="#1d1a18" stroke-width="1.5" fill="none"/><path d="M8 34 H42 L44 78 H6 Z" fill="#3a6ad8" ' + A.ink + ' stroke-width="1.5"/><path d="M14 34 V78 M36 34 V78" stroke="#d51f2a" stroke-width="3"/>'), r.x, r.top + r.height + 30, { size: 44, h: 70 });
        fx.caption("Hi, I'm Chucky. Wanna play?", { style: "subtitle", ms: 2000 });
        fx.tone(700, 0.4, { type: "square", vol: 0.04, filter: { freq: 1500 } });
        await fx.wait(2400);
        const m = doll.querySelector(".m");
        if (m) m.setAttribute("d", "M18 28 Q25 22 32 28");
        doll.querySelectorAll(".e").forEach((e) => e.setAttribute("fill", "#1d1a18"));
        fx.move(doll, [{ transform: "none" }, { transform: "rotate(-90deg) translateX(-10px)" }], { duration: 120, fill: "forwards" });
        sting(fx);
        fx.caption("(the doll's head turns)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Tremors
    {
      id: 9362,
      y: 1990,
      run: async (fx) => {
        fx.wash("rgba(220,180,110,.3)", 7000, { blend: "multiply", fade: 400 });
        const r = fx.rect(fx.slot());
        fx.caption("(stay on the rocks)", { style: "whisper", ms: 1600 });
        const ripple = fx.put(A.S("0 0 300 40", '<path d="M0 30 C30 20 60 20 90 30 S150 40 180 30 S240 20 300 30" stroke="#8a6a3a" stroke-width="3" fill="none"/>'), -150, H() - 50, { size: 300, h: 40 });
        fx.sfx("thunder", { vol: 0.6 });
        fx.buzz([40, 60, 40, 60, 40, 60, 40, 60, 40, 60, 40]);
        await fx.move(ripple, [{ transform: "none" }, { transform: "translateX(" + (r.x + 150) + "px)" }], { duration: 2400, easing: "ease-in" });
        const graboid = fx.put(A.S("0 0 80 100", '<path d="M10 100 C10 40 30 10 40 10 C50 10 70 40 70 100 Z" fill="#8a6a4a" ' + A.ink + ' stroke-width="2"/><path d="M40 10 L30 30 M40 10 L50 30 M40 10 L40 34" stroke="#d51f2a" stroke-width="4"/>'), r.x, H() + 40, { size: 70, h: 90 });
        await fx.move(graboid, [{ transform: "none" }, { transform: "translateY(-" + (H() - r.y + 40) + "px)" }], { duration: 400, easing: "cubic-bezier(.2,.9,.3,1.2)" });
        fx.sfx("hit", { vol: 0.8 });
        fx.sfx("boom", { vol: 0.5 });
        fx.shake("lg", 600);
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 20, spread: 60, gravity: 80, glyphs: dot("#8a6a3a"), min: 4, max: 10, dur: 900 });
        await fx.wait(1400);
      }
    },

    // An American Werewolf in London
    {
      id: 814,
      y: 1981,
      run: async (fx) => {
        dark(fx, 7000, 0.55);
        const moon = fx.put(A.moon, W() * 0.8, H() * 0.15, { size: 90 });
        void moon;
        const blue = [["C5", 2], ["D5", 1], ["E5", 1], ["G5", 2], ["E5", 2], ["D5", 2], ["C5", 4]];
        fx.seq(blue, { type: "sine", vol: 0.08, beat: 0.3, vibrato: [4, 6] });
        fx.caption("♪ Blue moon… ♪", { style: "hand", ms: 2000 });
        await fx.wait(2200);
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M34 40 C30 30 34 22 40 24 M86 40 C90 30 86 22 80 24" stroke="#6b4a2a" stroke-width="8" fill="none"/><path d="M40 70 L46 76 L52 70 L58 76 L64 70 L70 76 L76 70" stroke="#fff" stroke-width="2" fill="none"/>', 3400);
        fx.tone(90, 2.4, { type: "sawtooth", vol: 0.1, slide: 60, filter: { freq: 800 }, vibrato: [8, 10] });
        fx.noise(1.4, { type: "bandpass", freq: 400, q: 2, vol: 0.2 });
        await fx.move(reely, [{ transform: "none" }, { transform: "scaleX(1.1) scaleY(.9)" }, { transform: "scaleX(.9) scaleY(1.15)" }, { transform: "scale(1.1)" }], { duration: 2000, easing: "steps(6)" });
        fx.tone(500, 1.4, { type: "sawtooth", vol: 0.06, slide: 900, filter: { freq: 2000 } });
        fx.caption("(the transformation, in full light)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // The Lost Boys
    {
      id: 1547,
      y: 1987,
      run: async (fx) => {
        dark(fx, 7000, 0.5);
        const r = fx.rect(fx.slot());
        const sax = [["E4", 1], ["G4", 1], ["B4", 1], ["D5", 2], ["B4", 1], ["G4", 1], ["E4", 4]];
        fx.seq(sax, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { type: "bandpass", freq: 1200, q: 2 }, vibrato: [5, 8] });
        const noodles = fx.put(A.S("0 0 50 50", '<path d="M8 20 H42 L38 46 H12 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><path d="M14 20 C16 10 20 16 22 8 C24 16 28 10 30 18" stroke="#f2d33b" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 40 });
        fx.caption("(they're not maggots, Michael)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        noodles.querySelector("path + path") && noodles.querySelector("path + path").setAttribute("stroke", "#f4f0e6");
        fx.particles({ kind: "burst", from: noodles, count: 12, spread: 30, glyphs: A.S("0 0 20 8", '<ellipse cx="10" cy="4" rx="8" ry="3" fill="#f4f0e6"/>'), min: 8, max: 14, dur: 900 });
        await fx.wait(1000);
        for (let i = 0; i < 8; i++) fx.later(i * 100, () => fx.fly(A.bat, [fx.rand(0, W()), H() * 0.8], [fx.rand(0, W()), -30], { size: 40, h: 20, dur: 1200 }));
        fx.caption("(one thing about living in Santa Carla I never could stomach: all the damn vampires)", { style: "whisper", ms: 2400, css: { fontSize: "11px" } });
        await fx.wait(2400);
      }
    },

    // Evil Dead II
    {
      id: 765,
      y: 1987,
      run: async (fx) => {
        dark(fx, 7000, 0.45);
        const cam = [W() * 0.1, H() * 0.9];
        const path = [[W() * 0.3, H() * 0.7], [W() * 0.5, H() * 0.8], [W() * 0.7, H() * 0.5], [W() * 0.5, H() * 0.3]];
        fx.noise(3, { type: "bandpass", freq: 300, sweep: 1200, q: 1, vol: 0.4, attack: 0.3 });
        fx.caption("(the unseen force rushes through the woods)", { style: "whisper", ms: 2000 });
        if (!fx.reduced) {
          for (const [x, y] of path) {
            await fx.page([{ transform: "translate(" + (cam[0] - x) * 0.1 + "px," + (cam[1] - y) * 0.1 + "px) scale(1.05)" }, { transform: "none" }], { duration: 400, fill: "none" });
          }
        } else await fx.wait(1600);
        const reely = fx.$(".reely");
        const hand = fx.costume(".reely", '<path d="M96 60 L110 50 L114 54 L100 66 M100 66 L118 62 M100 66 L116 72" stroke="#e8c8a0" stroke-width="4" stroke-linecap="round"/>', 3000);
        void hand;
        fx.caption("(his own hand has turned against him)", { style: "whisper", ms: 1800 });
        fx.move(reely, [{ transform: "none" }, { transform: "rotate(-15deg)" }, { transform: "rotate(10deg)" }, { transform: "none" }], { duration: 300, iterations: 4 });
        for (let i = 0; i < 6; i++) fx.thud({ freq: 150, vol: 0.3, dur: 0.1, at: i * 0.2 });
        await fx.wait(1600);
        fx.caption("Groovy.", { style: "subtitle", ms: 1400 });
        fx.costume(".reely", '<path d="M96 70 L116 56" stroke="#9aa2a6" stroke-width="8"/><circle cx="116" cy="56" r="6" fill="#6d7478"/>', 1400);
        fx.noise(1.2, { type: "bandpass", freq: 200, q: 3, vol: 0.4 });
        await fx.wait(1400);
      }
    },

    // Pet Sematary
    {
      id: 8913,
      y: 1989,
      run: async (fx) => {
        dark(fx, 7000, 0.45);
        const sign = fx.put('<div style="font:700 13px/1 Georgia,serif;color:#1d1a18;background:#b8a888;border:2px solid #6b4a2a;padding:4px 8px;transform:rotate(-6deg)">PET SEMATARY</div>', W() / 2, H() * 0.3, { size: 140, h: 28 });
        void sign;
        const stones = [];
        for (let i = 0; i < 6; i++) stones.push(fx.put(A.S("0 0 30 40", '<path d="M4 40 V14 C4 2 26 2 26 14 V40 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/>'), W() * (0.15 + i * 0.14), H() * 0.72 + (i % 2) * 10, { size: 24, h: 32 }));
        fx.caption("Sometimes dead is better.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        const cat = fx.put(A.cat, W() * 0.8, H() * 0.8, { size: 60, h: 38 });
        cat.querySelector("svg") && fx.style(cat, { filter: "drop-shadow(0 0 6px #ffd23b)" });
        fx.tone(700, 1, { type: "sawtooth", vol: 0.06, slide: 400, filter: { freq: 1200 } });
        fx.caption("(Church came back… different)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        void stones;
      }
    },

    // The Witch
    {
      id: 310131,
      y: 2015,
      run: async (fx) => {
        fx.filter("saturate(.25) brightness(.9)", 7400, { fade: 600 });
        const choir = [["D4", "Eb4", "A4"], ["C4", "Db4", "G4"]];
        choir.forEach((c, i) => fx.chord(c, 3, { type: "sawtooth", vol: 0.035, at: i * 2.5, attack: 1, filter: { freq: 800 }, vibrato: [4, 8] }));
        const goat = fx.put(A.S("0 0 70 60", '<path d="M10 34 C12 22 36 20 48 24 L56 14 C60 10 66 12 64 18 L58 30 C60 38 54 42 48 40 L46 58 H40 L38 42 H20 L18 58 H12 L12 40 C6 40 6 36 10 34 Z" fill="#1d1a18"/><path d="M52 16 C46 4 58 0 62 6 M58 14 C58 2 70 2 70 10" stroke="#1d1a18" stroke-width="4" fill="none"/><circle cx="58" cy="22" r="2" fill="#ffd23b"/>'), W() * 0.7, H() * 0.62, { size: 80, h: 68 });
        fx.caption("(Black Phillip)", { style: "whisper", ms: 1800 });
        await fx.wait(2600);
        fx.caption("Wouldst thou like to live deliciously?", { style: "subtitle", ms: 2400, css: { letterSpacing: ".05em" } });
        fx.tone(70, 2.4, { type: "sawtooth", vol: 0.06, filter: { type: "bandpass", freq: 400, q: 4 } });
        fx.move(goat, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], 1200);
        await fx.wait(2600);
      }
    },

    // Train to Busan
    {
      id: 396535,
      y: 2016,
      run: async (fx) => {
        const grid = fx.$("#grid");
        const rg = fx.rect(grid);
        const cars = fx.put(box("border:3px solid #6d7478;border-radius:10px;background:repeating-linear-gradient(90deg, transparent 0 40px, rgba(109,116,120,.6) 40px 44px)"), rg.x, rg.y, { size: rg.width + 20, h: rg.height + 20 });
        void cars;
        for (let t = 0; t < 6; t += 0.3) fx.noise(0.12, { freq: 500, vol: 0.2, at: t });
        fx.caption("(car 13 — keep the doors shut)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        const others = fx.otherSlots(true);
        for (let i = 0; i < Math.min(10, others.length); i++) {
          fx.style(others[i], { filter: "grayscale(1) brightness(.6) contrast(1.4)" }, 3600);
          fx.move(others[i], [{ transform: "none" }, { transform: "rotate(" + fx.rand(-10, 10) + "deg) translateY(4px)" }], { duration: 150, fill: "forwards" });
          fx.noise(0.12, { type: "bandpass", freq: 800, q: 3, vol: 0.3 });
          await fx.wait(140);
        }
        fx.buzz([60, 30, 60, 30, 60]);
        fx.caption("(they don't see well in the dark — the tunnel!)", { style: "whisper", ms: 1800 });
        const tunnel = fx.wash("#050505", 1400, { fade: 100 });
        void tunnel;
        await fx.wait(1600);
      }
    },

    // Unbreakable
    {
      id: 9741,
      y: 2000,
      run: async (fx) => {
        fx.filter("saturate(.5) hue-rotate(40deg)", 7000, { fade: 400 });
        const r = fx.rect(fx.slot());
        const bench = fx.put(A.S("0 0 120 50", '<rect x="4" y="10" width="112" height="10" fill="#6d7478"/><rect x="4" y="30" width="112" height="10" fill="#6d7478"/><path d="M20 40 V50 M100 40 V50" stroke="#1d1a18" stroke-width="4"/>'), W() / 2, H() * 0.66, { size: 120, h: 50 });
        const weights = fx.put(A.S("0 0 160 40", '<rect x="20" y="16" width="120" height="8" fill="#9aa2a6"/>' + Array.from({ length: 6 }, (_, i) => '<rect x="' + (4 + i * 5) + '" y="' + (4 + i) + '" width="6" height="' + (32 - i * 2) + '" fill="#1d1a18"/><rect x="' + (150 - i * 5) + '" y="' + (4 + i) + '" width="6" height="' + (32 - i * 2) + '" fill="#1d1a18"/>').join("")), W() / 2, H() * 0.58, { size: 180, h: 40 });
        fx.caption("(he keeps adding weight)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 6; i++) {
          await fx.move(weights, [{ transform: "none" }, { transform: "translateY(-20px)" }, { transform: "none" }], 400);
          fx.thud({ freq: 90, vol: 0.2, dur: 0.1 });
          fx.put('<div style="font:700 12px/1 \'Special Elite\',\'Courier New\',monospace;color:#fff">' + (250 + i * 40) + " lb</div>", W() / 2 + 110, H() * 0.58, { size: 60, h: 14, ms: 400 });
        }
        fx.caption("You know what the scariest thing is? To not know your place in this world.", { style: "subtitle", ms: 2600, css: { fontSize: "13px" } });
        await fx.wait(2600);
        void bench; void r;
      }
    },

    // Panic Room
    {
      id: 4547,
      y: 2002,
      run: async (fx) => {
        dark(fx, 7000, 0.4);
        const monitors = [];
        for (let i = 0; i < 6; i++) {
          const m = fx.put("", W() * (0.18 + (i % 3) * 0.32), H() * (0.2 + Math.floor(i / 3) * 0.18), { size: 80, h: 56, cls: "fx-static" });
          m.style.border = "3px solid #3b3530";
          monitors.push(m);
        }
        fx.noise(3, { type: "bandpass", freq: 3000, q: 0.5, vol: 0.06 });
        fx.caption("(the room with the monitors)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const r = fx.rect(fx.slot());
        const door = fx.put(box("background:linear-gradient(90deg,#6d7478,#9aa2a6,#6d7478);border:3px solid #3b3530"), r.x, -r.height, { size: r.width * 1.1, h: r.height * 1.1 });
        fx.tone(90, 1.2, { type: "sawtooth", vol: 0.08, filter: { freq: 400 } });
        await fx.move(door, [{ transform: "none" }, { transform: "translateY(" + (r.y + r.height) + "px)" }], { duration: 1200, easing: "linear" });
        fx.thud({ vol: 0.8, freq: 50 });
        fx.buzz([120]);
        fx.caption("(the steel door slams down)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // The Game
    {
      id: 2649,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const clown = fx.put(A.S("0 0 50 60", '<circle cx="25" cy="30" r="20" fill="#f4f2ec" ' + A.ink + ' stroke-width="1.5"/><circle cx="25" cy="34" r="5" fill="#d51f2a"/><circle cx="18" cy="26" r="2.5" fill="#1d1a18"/><circle cx="32" cy="26" r="2.5" fill="#1d1a18"/><path d="M4 22 C4 6 46 6 46 22 C40 12 10 12 4 22 Z" fill="#3a6ad8"/><path d="M16 44 Q25 50 34 44" stroke="#d51f2a" stroke-width="2" fill="none"/>'), r.x, r.top + r.height + 30, { size: 44, h: 54 });
        void clown;
        fx.caption("(a clown doll on the driveway, with a key in its mouth)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        A.errorBox(fx, "CRS", "Consumer Recreation Services\nThe game has begun.", 2400);
        fx.sfx("beep", { hz: 990, n: 3, vol: 0.5 });
        await fx.wait(2400);
        fx.caption("(is any of this real?)", { style: "whisper", ms: 1600 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        fx.style(all, { filter: "invert(1)" }, 300);
        fx.sfx("glitch", { n: 5, vol: 0.8 });
        await fx.wait(1600);
      }
    },

    // Walk the Line
    {
      id: 69,
      y: 2005,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(1.1)", 6600, { fade: 300 });
        const beat = 0.18;
        const boom = [["E2", 1], [null, 1], ["B2", 1], [null, 1]];
        for (let i = 0; i < 6; i++) fx.seq(boom, { type: "triangle", vol: 0.1, beat, at: i * beat * 4 });
        for (let i = 0; i < 24; i++) fx.noise(0.06, { type: "bandpass", freq: 2000, q: 2, vol: i % 2 ? 0.25 : 0.1, at: i * beat });
        fx.caption("(boom-chicka-boom)", { style: "whisper", ms: 1800 });
        fx.costume(".reely", '<path d="M20 70 H100 L106 150 H14 Z" fill="#1d1a18" stroke="#1f1b16" stroke-width="3"/>', 5400);
        await fx.wait(2400);
        const ring = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="40" fill="none" stroke="#ff7a1a" stroke-width="10"/><circle cx="50" cy="50" r="40" fill="none" stroke="#ffcf5a" stroke-width="4" stroke-dasharray="6 6"/>'), W() / 2, H() * 0.4, { size: 120 });
        fx.move(ring, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 2400 });
        fx.caption("(a burning ring of fire)", { style: "whisper", ms: 1800 });
        fx.particles({ kind: "rise", from: ring, count: 20, glyphs: [dot("#ff7a1a"), dot("#ffcf5a")], min: 3, max: 7, dur: 1400 });
        await fx.wait(2400);
      }
    }
  ]);
})();
