/* Machine FX cues - silents, early talkies and the avant-garde.
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

  M.register([
    // A Trip to the Moon
    {
      id: 775,
      y: 1902,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 5200);
        A.projector(fx, 4.5);
        fx.sfx("projector", { dur: 4.4, vol: 0.4 });
        const moon = fx.put(A.S("0 0 120 120",
          '<circle cx="60" cy="60" r="54" fill="#f1ead2" ' + A.ink + '/>' +
          '<path d="M36 48 C40 42 48 42 52 48 M70 48 C74 42 82 42 86 48" fill="none" ' + A.ink + '/>' +
          '<circle cx="44" cy="54" r="4" fill="' + A.INK + '"/><circle class="eye" cx="78" cy="54" r="4" fill="' + A.INK + '"/>' +
          '<path d="M44 84 C52 92 70 92 78 84" fill="none" ' + A.ink + '/><path d="M60 58 L56 72 L62 72" fill="none" ' + A.ink + ' stroke-width="2"/>'),
          W() / 2, H() * 0.32, { size: 150 });
        fx.fadeIn(moon, 500);
        await fx.wait(700);
        const rocket = A.S("0 0 30 60", '<path d="M15 2 C26 14 26 40 24 56 H6 C4 40 4 14 15 2 Z" fill="#cfd4d6" ' + A.ink + ' stroke-width="2.5"/><path d="M6 46 L0 58 H8 M24 46 L30 58 H22" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>');
        const eye = [W() / 2 + 22, H() * 0.32 - 7];
        fx.tone(300, 1.1, { type: "triangle", slide: 900, vol: 0.18 });
        fx.sfx("whoosh", { dur: 1.1, vol: 0.5 });
        await fx.fly(rocket, [r.x, r.y], eye, { size: 34, h: 60, dur: 1100, r0: 30, r2: 60, easing: "ease-in" });
        fx.put(A.S("0 0 30 60", '<path d="M15 2 C26 14 26 40 24 56 H6 C4 40 4 14 15 2 Z" fill="#cfd4d6" ' + A.ink + ' stroke-width="2.5"/>'), eye[0] - 4, eye[1] - 10, { size: 30, h: 50, style: { transform: "rotate(60deg)" } });
        fx.sfx("hit", { vol: 0.7 });
        fx.buzz(40);
        fx.move(moon, [{ transform: "none" }, { transform: "rotate(-6deg) scale(1.03)" }, { transform: "rotate(3deg)" }, { transform: "none" }], 500);
        fx.particles({ kind: "burst", from: pt(eye[0], eye[1]), count: 10, spread: 20, dur: 700, stagger: 0, glyphs: dot("#fff6c0"), min: 3, max: 6 });
        await fx.wait(1500);
        A.intertitle(fx, "The Projectile\nlands in the Eye\nof the Moon!", 2000);
        await fx.wait(2000);
      }
    },

    // The Great Train Robbery
    {
      id: 5698,
      y: 1903,
      run: async (fx) => {
        A.oldFilm(fx, 3800);
        A.projector(fx, 3.5);
        fx.sfx("projector", { dur: 3.6, vol: 0.4 });
        const gun = fx.put(A.S("0 0 120 80",
          '<path d="M10 40 H80 V30 H100 V50 H60 L50 76 H34 L42 50 H10 Z" fill="#2b2622" ' + A.ink + '/><circle cx="12" cy="45" r="5" fill="#000"/>'),
          W() / 2, H() / 2, { size: 220, h: 150 });
        await fx.move(gun, [{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 600);
        for (let i = 0; i < 3; i++) {
          await fx.wait(450);
          fx.flash("#fff7d6", 120);
          fx.sfx("crack", { vol: 0.55 });
          fx.noise(0.25, { freq: 2200, vol: 0.7 });
          fx.thud({ vol: 0.5 });
          fx.buzz(30);
          fx.particles({ kind: "burst", from: pt(W() / 2 - 100, H() / 2 + 4), count: 8, spread: 40, dur: 1200, stagger: 0, glyphs: dot("rgba(240,230,210,.8)"), min: 14, max: 30 });
          fx.move(gun, [{ transform: "rotate(-8deg)" }, { transform: "none" }], 180);
        }
        await fx.wait(900);
      }
    },

    // The Cabinet of Dr. Caligari
    {
      id: 234,
      y: 1920,
      run: async (fx) => {
        A.oldFilm(fx, 5000, "grayscale(1) sepia(.8) hue-rotate(-20deg) saturate(1.6) contrast(1.3)");
        const shards = fx.node(A.S("0 0 400 300",
          '<path d="M0 0 L140 0 L60 120 L90 300 H0 Z" fill="#0d0b09" opacity=".85"/>' +
          '<path d="M400 0 L280 0 L350 90 L300 300 H400 Z" fill="#0d0b09" opacity=".85"/>' +
          '<path d="M150 300 L200 150 L230 170 L260 300 Z" fill="#0d0b09" opacity=".6"/>' +
          '<path d="M120 40 L300 20 M90 200 L180 140 M260 120 L380 200" stroke="#f4efe2" stroke-width="3" opacity=".6"/>'),
          { cls: "fx-filter", style: { opacity: 0 } });
        shards.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(shards.firstChild.style, { width: "100%", height: "100%" });
        fx.fadeIn(shards, 500);
        fx.page([{ transform: "none" }, { transform: "skewX(-7deg) rotate(-1.5deg)" }], { duration: 900, easing: "ease-in-out" });
        fx.seq([["E3", 2], ["F3", 2], ["E3", 2], ["B2", 4]], { type: "sawtooth", vol: 0.1, beat: 0.35, filter: { freq: 700 } });
        await fx.wait(1500);
        A.intertitle(fx, "You must become\nCaligari!", 2200);
        await fx.wait(2600);
        await fx.page([{ transform: "skewX(-7deg) rotate(-1.5deg)" }, { transform: "none" }], 500);
      }
    },

    // Rhythmus 21
    {
      id: 105715,
      y: 1921,
      run: async (fx) => {
        const bg = fx.node("", { cls: "fx-filter", style: { background: "#0d0b09" } });
        fx.fadeIn(bg, 200);
        const sq = [];
        for (let i = 0; i < 4; i++) {
          sq.push(fx.put(box("background:" + (i % 2 ? "#f4efe2" : "#8a857a")), W() / 2 + (i - 1.5) * 40, H() / 2, { size: 60 + i * 30 }));
        }
        for (let b = 0; b < 8; b++) {
          fx.click({ freq: 900 + b * 120, vol: 0.4 });
          sq.forEach((s, i) => {
            const k = ((b + i) % 4) / 3;
            s.style.transform = fx.reduced ? "none" : "scale(" + (0.3 + k * 1.4) + ", " + (1.4 - k) + ") translateX(" + (k - 0.5) * 80 + "px)";
            s.style.opacity = 0.4 + k * 0.6;
          });
          await fx.wait(380);
        }
        await fx.fadeOut(bg, 300);
      }
    },

    // The Kid
    {
      id: 10098,
      y: 1921,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 4600);
        A.projector(fx, 4);
        const rock = A.S("0 0 20 20", '<path d="M3 10 C2 4 8 2 12 3 C18 4 19 10 16 15 C12 19 5 17 3 10 Z" fill="#7a6e60" ' + A.ink + ' stroke-width="2"/>');
        await fx.fly(rock, [-20, r.y + 40], [r.x, r.y], { size: 22, dur: 700, via: [r.x / 2, r.y - 80], r2: 400 });
        fx.noise(0.5, { type: "highpass", freq: 4000, vol: 0.6 });
        fx.buzz(30);
        const crack = fx.put(A.S("0 0 100 140", '<path d="M50 70 L20 10 M50 70 L90 30 M50 70 L10 100 M50 70 L80 130 M50 70 L60 0 M50 70 L100 90" stroke="#fff" stroke-width="2.5" fill="none"/>'), r.x, r.y, { size: r.width, h: r.height });
        await fx.wait(700);
        const man = fx.fly(A.S("0 0 70 90",
          '<circle cx="30" cy="16" r="10" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><rect x="18" y="28" width="24" height="38" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><path d="M24 66 L20 88 M36 66 L40 88" ' + A.ink + '/>' +
          '<rect x="40" y="18" width="26" height="44" fill="rgba(210,235,255,.6)" ' + A.ink + ' stroke-width="2"/>'),
          [W() + 40, r.y], [r.x + r.width * 0.9, r.y], { size: 80, h: 100, dur: 1300, keep: true });
        await man;
        fx.seq([["G5", 1], ["E5", 1], ["C5", 2]], { type: "triangle", vol: 0.12, beat: 0.15 });
        fx.remove(crack);
        A.sparkleOn(fx, fx.slot(), 10);
        await fx.wait(1400);
      }
    },

    // Nanook of the North
    {
      id: 669,
      y: 1922,
      run: async (fx) => {
        A.oldFilm(fx, 5200, "grayscale(1) sepia(.2) contrast(1.1) brightness(1.08)");
        fx.noise(5, { freq: 900, sweep: 500, vol: 0.12, attack: 0.8 });
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 6, max: 12, dur: 4200, wind: -120, spin: 180 });
        const cx = W() / 2, base = H() * 0.62;
        const rows = [[-60, -20, 20, 60], [-40, 0, 40], [-20, 20], [0]];
        for (let row = 0; row < rows.length; row++) {
          for (const dx of rows[row]) {
            const x = cx + dx, y = base - row * 22;
            fx.put(box("background:#f4f6f8;border:2px solid #7c8a94;border-radius:3px"), x, y, { size: 40, h: 22 });
            fx.thud({ freq: 160, vol: 0.25, dur: 0.12 });
            await fx.wait(140);
          }
        }
        fx.put(box("background:#1d1a18;border-radius:20px 20px 0 0"), cx, base + 2, { size: 26, h: 20 });
        await fx.wait(1600);
      }
    },

    // Häxan
    {
      id: 57283,
      y: 1922,
      run: async (fx) => {
        A.oldFilm(fx, 5200, "grayscale(1) sepia(1) hue-rotate(180deg) saturate(1.8) brightness(.75)");
        fx.chord(["D3", "Ab3", "D4"], 4, { type: "sawtooth", vol: 0.06, attack: 0.8, filter: { freq: 600 } });
        for (let i = 0; i < 4; i++) {
          fx.later(i * 600, () => fx.fly(A.witch, [-120, H() * rand01(i)], [W() + 120, H() * rand01(i) - 80], { size: 110, h: 55, dur: 2400 }));
        }
        await fx.wait(2400);
        const devil = fx.put(A.S("0 0 80 80",
          '<path d="M20 30 L12 4 L30 22 M60 30 L68 4 L50 22" fill="#1d1a18" ' + A.ink + '/><circle cx="40" cy="44" r="26" fill="#1d1a18"/><circle cx="30" cy="40" r="4" fill="#ffcf5a"/><circle cx="50" cy="40" r="4" fill="#ffcf5a"/><path d="M28 58 L34 54 L40 60 L46 54 L52 58" stroke="#ffcf5a" stroke-width="2" fill="none"/>'),
          W() / 2, H() * 0.4, { size: 110 });
        fx.noise(1, { freq: 300, vol: 0.3 });
        await fx.fadeIn(devil, 800);
        fx.tone("A1", 1.2, { type: "sawtooth", vol: 0.15, filter: { freq: 200 } });
        await fx.wait(1500);
        await fx.fadeOut(devil, 400);
        function rand01(i) { return [0.2, 0.45, 0.3, 0.6][i]; }
      }
    },

    // Safety Last!
    {
      id: 22596,
      y: 1923,
      run: async (fx) => {
        A.oldFilm(fx, 5000);
        A.projector(fx, 4.6);
        const cx = W() / 2, cy = H() * 0.3;
        const clock = fx.put(A.S("0 0 140 140",
          '<circle cx="70" cy="70" r="64" fill="#f4efe2" ' + A.ink + ' stroke-width="4"/>' +
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => { const a = i * Math.PI / 6; return '<path d="M' + (70 + Math.sin(a) * 52) + " " + (70 - Math.cos(a) * 52) + " L" + (70 + Math.sin(a) * 60) + " " + (70 - Math.cos(a) * 60) + '" ' + A.ink + '/>'; }).join("") +
          '<path d="M70 70 L70 26" ' + A.ink + ' stroke-width="4"/><path class="minute" d="M70 70 L118 70" ' + A.ink + ' stroke-width="5"/>'),
          cx, cy, { size: 180 });
        const man = fx.put(A.S("0 0 40 80",
          '<circle cx="20" cy="12" r="8" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M12 6 H28" stroke="#1d1a18" stroke-width="4"/>' +
          '<circle cx="17" cy="13" r="3" fill="none" stroke="#1d1a18" stroke-width="1.5"/><circle cx="24" cy="13" r="3" fill="none" stroke="#1d1a18" stroke-width="1.5"/>' +
          '<rect x="12" y="22" width="16" height="30" fill="#4a443c" ' + A.ink + ' stroke-width="2"/><path d="M12 24 L4 0 M28 24 L36 2" ' + A.ink + '/><path d="M16 52 L12 78 M24 52 L30 76" ' + A.ink + '/>'),
          cx + 84, cy + 34, { size: 50, h: 100 });
        await fx.wait(600);
        fx.move(man, [{ transform: "rotate(0)" }, { transform: "rotate(8deg)" }, { transform: "rotate(-6deg)" }, { transform: "rotate(4deg)" }], { duration: 2800, easing: "ease-in-out" });
        const hand = clock.querySelector(".minute");
        fx.sfx("tick", { n: 6, every: 0.47, vol: 0.8 });
        await fx.tween(fx.reduced ? 10 : 2800, (k) => {
          hand.setAttribute("transform", "rotate(" + k * 35 + " 70 70)");
          man.style.top = cy + 34 - 50 + k * 42 + "px";
        });
        fx.buzz([20, 60, 20]);
        fx.seq([["E5", 1], ["D5", 1], ["C5", 1], ["G4", 3]], { type: "triangle", vol: 0.12, beat: 0.14 });
        await fx.wait(1300);
      }
    },

    // Sherlock Jr.
    {
      id: 992,
      y: 1924,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 4800);
        A.projector(fx, 4.5);
        fx.sfx("projector", { dur: 4.6, vol: 0.4 });
        const man = A.S("0 0 40 80",
          '<path d="M10 10 H30 L28 4 H12 Z" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="16" r="7" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/>' +
          '<rect x="12" y="24" width="16" height="28" fill="#4a443c" ' + A.ink + ' stroke-width="2"/><path d="M16 52 L12 78 M24 52 L28 78" ' + A.ink + '/>');
        await fx.fly(man, [-30, H() - 70], [r.x, r.y + r.height / 2 - 30], { size: 30, h: 60, dur: 1600, via: [r.x * 0.6, H() - 90] });
        const inside = fx.put(man, r.x, r.y, { size: 22, h: 44 });
        fx.noise(0.2, { freq: 3000, vol: 0.4 });
        const bgs = ["#d9d0b8", "#8fb3c7", "#c9a26b", "#e7e3da"];
        const lift = A.liftSlot(fx, 3600);
        for (const c of bgs) {
          fx.flash(c, 180);
          fx.sfx("relay", { vol: 0.6 });
          fx.click({ freq: 1400, vol: 0.5 });
          if (lift) fx.style(lift, { filter: "sepia(1) hue-rotate(" + bgs.indexOf(c) * 60 + "deg)" }, 500);
          await fx.wait(620);
        }
        await fx.fadeOut(inside, 300);
      }
    },

    // The Last Laugh
    {
      id: 5991,
      y: 1924,
      run: async (fx) => {
        const s = fx.slot();
        A.oldFilm(fx, 4600);
        fx.seq([["C4", 2], ["Eb4", 2], ["G4", 2], ["C5", 4]], { type: "triangle", vol: 0.1, beat: 0.3 });
        const lift = A.liftSlot(fx, 4600);
        await fx.move(lift, [{ transform: "perspective(600px) rotateY(0)" }, { transform: "perspective(600px) rotateY(360deg)" }, { transform: "perspective(600px) rotateY(720deg)" }], { duration: 2600, easing: "ease-in-out" });
        fx.costume(".reely", '<g><path d="M30 92 H90 L96 140 H24 Z" fill="#2d3b55" stroke="#1f1b16" stroke-width="3"/><path d="M48 92 V140 M72 92 V140" stroke="#e0b34a" stroke-width="3"/><circle cx="60" cy="104" r="3" fill="#e0b34a"/><circle cx="60" cy="118" r="3" fill="#e0b34a"/><path d="M40 20 H80 V30 H40 Z" fill="#2d3b55" stroke="#1f1b16" stroke-width="3"/><path d="M36 30 H84" stroke="#1f1b16" stroke-width="4"/></g>', 2600);
        fx.chord(["C5", "E5", "G5"], 1.2, { type: "triangle", vol: 0.1 });
        await fx.wait(2000);
        void s;
      }
    },

    // Greed
    {
      id: 1405,
      y: 1924,
      run: async (fx) => {
        A.liftSlot(fx, 5200);
        fx.filter("grayscale(1) contrast(1.15)", 5200, { fade: 400 });
        fx.style(fx.slot(), { filter: "sepia(1) saturate(4) hue-rotate(-5deg) brightness(1.1)" }, 5200);
        await fx.wait(600);
        for (let i = 0; i < 14; i++) {
          fx.later(i * 160, () => fx.click({ freq: 5000 + i * 100, vol: 0.3 }));
        }
        await fx.particles({ kind: "fall", count: 30, glyphs: A.coin("#f2c94c"), min: 14, max: 22, dur: 2600, spin: 360, stagger: 1600 });
        fx.noise(1.8, { freq: 4000, sweep: 300, vol: 0.15 });
        fx.wash("radial-gradient(circle at 50% 30%, rgba(255,240,200,.0), rgba(255,240,200,.55))", 1600, { fade: 500 });
        await fx.wait(1600);
      }
    },

    // Ballet Mécanique
    {
      id: 107011,
      y: 1924,
      run: async (fx) => {
        const shapes = [
          A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="none" stroke="#f4efe2" stroke-width="6"/>'),
          A.S("0 0 60 60", '<path d="M30 4 L56 56 H4 Z" fill="#f4efe2"/>'),
          A.S("0 0 60 60", '<ellipse cx="30" cy="30" rx="26" ry="14" fill="#f4efe2"/><circle cx="30" cy="30" r="10" fill="#0d0b09"/>'),
          A.S("0 0 60 60", '<path d="M30 4 C44 30 44 30 30 56 C16 30 16 30 30 4 Z" fill="#f4efe2"/>')
        ];
        const bg = fx.node("", { cls: "fx-filter", style: { background: "#0d0b09" } });
        for (let i = 0; i < 12; i++) {
          const el = fx.put(shapes[i % 4], fx.rand(40, W() - 40), fx.rand(80, H() - 80), { size: fx.rand(60, 160) });
          fx.tone(fx.pick([196, 262, 330, 392]), 0.12, { type: "square", vol: 0.12 });
          fx.noise(0.05, { type: "highpass", freq: 6000, vol: 0.3, at: 0.1 });
          fx.move(el, [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }], 300);
          await fx.wait(260);
          fx.remove(el);
        }
        await fx.fadeOut(bg, 200);
      }
    },

    // Battleship Potemkin
    {
      id: 643,
      y: 1925,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 5600, { fade: 300 });
        fx.node("", { cls: "fx-filter fx-grain", ms: 5600 });
        const steps = fx.node(A.S("0 0 400 300", Array.from({ length: 10 }, (_, i) => '<path d="M' + (i * 40 - 10) + " " + (i * 30) + " H400 V300 H" + (i * 40 - 10) + ' Z" fill="' + (i % 2 ? "#8a8478" : "#a8a294") + '"/>').join("")),
          { cls: "fx-filter", style: { opacity: 0.55 } });
        steps.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(steps.firstChild.style, { width: "100%", height: "100%" });
        const pram = A.S("0 0 60 50", '<path d="M6 10 C6 30 44 34 50 16 L50 30 H10 Z" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><path d="M10 10 C14 0 40 0 44 8" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><circle cx="16" cy="40" r="7" fill="none" ' + A.ink + '/><circle cx="44" cy="40" r="7" fill="none" ' + A.ink + '/>');
        const p = fx.fly(pram, [0, 0], [W(), H()], { size: 60, h: 50, dur: 3600, via: [W() / 2, H() / 2 - 30], r0: -10, r1: 15, r2: 30, easing: "steps(10)" });
        for (let i = 0; i < 10; i++) fx.thud({ freq: 90 + i * 4, vol: 0.35, dur: 0.18, at: i * 0.36 });
        fx.buzz([15, 345, 15, 345, 15, 345, 15]);
        await p;
        const flag = fx.put(A.S("0 0 60 40", '<path d="M4 2 V38" ' + A.ink + '/><path d="M6 4 C20 0 30 10 56 4 V24 C30 30 20 20 6 24 Z" fill="#e0201c"/>'), W() / 2, H() * 0.25, { size: 80, h: 54 });
        fx.chord(["C4", "E4", "G4", "C5"], 1.4, { type: "sawtooth", vol: 0.08, filter: { freq: 1400 } });
        await fx.fadeIn(flag, 300);
        await fx.wait(1200);
      }
    },

    // The Gold Rush
    {
      id: 962,
      y: 1925,
      run: async (fx) => {
        A.oldFilm(fx, 5200);
        const cx = W() / 2, cy = H() * 0.45;
        const roll = A.S("0 0 50 40", '<ellipse cx="25" cy="18" rx="20" ry="14" fill="#e0b06a" ' + A.ink + ' stroke-width="2.5"/><path d="M8 18 C16 24 34 24 42 18" fill="none" stroke="#b07a38" stroke-width="2"/><path d="M25 32 V40" ' + A.ink + ' stroke-width="3"/>');
        const l = fx.put(roll, cx - 34, cy, { size: 54, h: 44 });
        const r = fx.put(roll, cx + 34, cy, { size: 54, h: 44 });
        const face = fx.put(A.S("0 0 80 60", '<path d="M10 20 H70 V10 C60 0 20 0 10 10 Z" fill="#1d1a18"/><circle cx="40" cy="36" r="18" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M34 44 H46" stroke="#1d1a18" stroke-width="4"/><circle cx="34" cy="34" r="2" fill="#1d1a18"/><circle cx="46" cy="34" r="2" fill="#1d1a18"/>'), cx, cy - 70, { size: 100, h: 76 });
        void face;
        const tune = [["E5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["F5", 1], ["D5", 1], ["B4", 1], ["C5", 2], ["G4", 2]];
        fx.seq(tune, { type: "triangle", vol: 0.12, beat: 0.28 });
        for (let i = 0; i < 12; i++) {
          const up = i % 2 ? 0 : -14;
          const side = i % 4 < 2 ? 10 : -10;
          fx.move([l, r], [{ transform: "none" }, { transform: "translate(" + side + "px," + up + "px) rotate(" + side + "deg)" }], { duration: 140, fill: "forwards" });
          fx.click({ freq: 2200, vol: 0.2 });
          await fx.wait(280);
        }
        await fx.move([l, r], [{ transform: "none" }, { transform: "translate(0, -30px) scale(1.2)" }], 300);
        A.intertitle(fx, "The Oceana Roll", 1500);
        await fx.wait(1500);
      }
    },

    // The Phantom of the Opera
    {
      id: 964,
      y: 1925,
      run: async (fx) => {
        const cx = W() / 2;
        A.oldFilm(fx, 5200, "grayscale(1) sepia(.6) contrast(1.2) brightness(.8)");
        fx.chord(["A2", "E3", "A3", "C4", "E4"], 3, { type: "sawtooth", vol: 0.07, attack: 0.1, filter: { freq: 1200 } });
        fx.chord(["G#2", "D3", "G#3", "B3", "D4"], 2.5, { type: "sawtooth", vol: 0.07, at: 0.9, filter: { freq: 1200 } });
        const ch = fx.put(A.S("0 0 120 100",
          '<path d="M60 0 V20" ' + A.ink + '/><path d="M20 40 C30 60 90 60 100 40 L60 20 Z" fill="#c9a24a" ' + A.ink + '/>' +
          [20, 40, 60, 80, 100].map((x) => '<path d="M' + x + ' 42 V52" stroke="#fff5c0" stroke-width="3"/><circle cx="' + x + '" cy="38" r="3" fill="#ffd26a"/>').join("") +
          '<path d="M30 58 C40 90 80 90 90 58" fill="none" stroke="#c9a24a" stroke-width="3"/><circle cx="60" cy="86" r="6" fill="#bfe8ff" ' + A.ink + ' stroke-width="2"/>'),
          cx, 40, { size: 160, h: 130 });
        fx.move(ch, [{ transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(-3deg)" }], { duration: 1600, iterations: 1 });
        await fx.wait(1600);
        fx.sfx("whoosh", { dur: 0.7, vol: 0.6 });
        await fx.move(ch, [{ transform: "none" }, { transform: "translateY(" + (H() - 140) + "px) rotate(12deg)" }], { duration: 700, easing: "cubic-bezier(.55,0,1,.6)" });
        fx.sfx("boom", { vol: 0.8 });
        fx.sfx("crack", { vol: 0.5 });
        fx.noise(0.8, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.shake("lg", 600);
        fx.buzz(120);
        fx.particles({ kind: "burst", from: pt(cx, H() - 80), count: 20, spread: 60, gravity: 60, dur: 900, stagger: 0, glyphs: [dot("#bfe8ff"), dot("#ffd26a")], min: 3, max: 8 });
        await fx.wait(700);
        fx.wash("#b0120f", 1800, { blend: "multiply", opacity: 0.5, fade: 500 });
        await fx.wait(1800);
      }
    },

    // Faust
    {
      id: 10728,
      y: 1926,
      run: async (fx) => {
        A.oldFilm(fx, 5000, "grayscale(1) contrast(1.35) brightness(.8)");
        const wings = fx.node(A.S("0 0 400 200",
          '<path d="M200 120 C150 20 60 0 0 40 C40 50 50 70 40 100 C70 80 90 90 100 120 C120 100 150 100 170 130 Z M200 120 C250 20 340 0 400 40 C360 50 350 70 360 100 C330 80 310 90 300 120 C280 100 250 100 230 130 Z" fill="#0b0907"/>' +
          '<circle cx="190" cy="100" r="4" fill="#fff6c0"/><circle cx="210" cy="100" r="4" fill="#fff6c0"/>'),
          { style: { position: "absolute", left: "-10vw", right: "-10vw", top: "-5vh", height: "70vh" } });
        wings.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(wings.firstChild.style, { width: "100%", height: "100%" });
        fx.noise(3.5, { freq: 200, sweep: 80, vol: 0.4, attack: 1 });
        fx.tone("C2", 3.5, { type: "sawtooth", vol: 0.12, attack: 1, filter: { freq: 180 } });
        await fx.anim(wings, [{ transform: "translateY(-70vh)" }, { transform: "translateY(0)" }], { duration: fx.reduced ? 1 : 2400, easing: "ease-out" });
        fx.particles({ kind: "fall", count: 30, glyphs: dot("rgba(40,30,20,.7)"), min: 6, max: 14, dur: 2400 });
        await fx.wait(1800);
        await fx.fadeOut(wings, 600);
      }
    },

    // The Adventures of Prince Achmed
    {
      id: 19354,
      y: 1926,
      run: async (fx) => {
        const bg = fx.wash("linear-gradient(#e89a3a, #b5402a)", 5400, { fade: 400, opacity: 0.9 });
        void bg;
        const horse = A.S("0 0 120 80",
          '<path d="M20 40 C30 30 60 28 80 34 L96 16 L104 18 L100 30 L112 36 L106 40 L96 40 C94 50 86 56 80 56 L84 76 H78 L72 58 C60 60 46 60 36 58 L30 76 H24 L28 56 C18 54 14 46 20 40 Z M60 28 L70 4 L76 26 Z" fill="#0b0907"/>' +
          '<path d="M44 30 C36 18 20 10 4 14 C20 16 30 22 40 34 Z M60 30 C64 16 80 8 96 12 C80 14 70 20 64 34 Z" fill="#0b0907"/>');
        const vines = fx.node(A.S("0 0 400 120", '<path d="M0 120 C30 60 60 100 80 50 C90 30 110 40 100 60 C140 20 170 90 200 40 C230 0 260 60 280 30 C300 10 330 70 360 30 C380 10 400 40 400 40 V120 Z" fill="#0b0907"/>'),
          { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "22vh" } });
        vines.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(vines.firstChild.style, { width: "100%", height: "100%" });
        fx.seq([["D5", 1], ["Eb5", 1], ["F#5", 2], ["G5", 1], ["F#5", 1], ["Eb5", 2], ["D5", 4]], { type: "triangle", vol: 0.1, beat: 0.25 });
        await fx.fly(horse, [-120, H() * 0.55], [W() + 120, H() * 0.2], { size: 140, h: 94, dur: 3800, via: [W() / 2, H() * 0.15], r0: -10, r2: -14 });
        await fx.wait(700);
      }
    },

    // Anemic Cinema
    {
      id: 58094,
      y: 1926,
      run: async (fx) => {
        const sp = fx.put(A.S("0 0 200 200",
          '<circle cx="100" cy="100" r="96" fill="#f4efe2"/>' +
          Array.from({ length: 9 }, (_, i) => '<circle cx="' + (100 + i * 3) + '" cy="' + (100 - i * 2) + '" r="' + (90 - i * 10) + '" fill="none" stroke="#0d0b09" stroke-width="5"/>').join("")),
          W() / 2, H() / 2, { size: Math.min(W(), H()) * 0.6 });
        const bg = fx.node("", { cls: "fx-filter", style: { background: "#0d0b09" } });
        bg.after(sp);
        fx.tone(110, 4, { type: "sine", vol: 0.15, vibrato: [1.5, 30] });
        if (!fx.reduced) fx.anim(sp, [{ transform: "rotate(0)" }, { transform: "rotate(-1080deg)" }], { duration: 4200, easing: "linear" });
        await fx.wait(4200);
      }
    },

    // The General
    {
      id: 961,
      y: 1926,
      run: async (fx) => {
        A.oldFilm(fx, 4800);
        const train = A.S("0 0 160 70",
          '<rect x="60" y="14" width="44" height="34" fill="#3b3530" ' + A.ink + '/><path d="M8 30 H64 V52 H8 Z" fill="#4a443c" ' + A.ink + '/><path d="M20 30 L14 6 H34 L28 30" fill="#3b3530" ' + A.ink + '/>' +
          '<path d="M0 54 L10 44 V58 Z" fill="#8a2a1a"/><circle cx="30" cy="58" r="10" fill="#e0b34a" ' + A.ink + '/><circle cx="80" cy="56" r="12" fill="#e0b34a" ' + A.ink + '/><circle cx="130" cy="58" r="10" fill="#6a5d50" ' + A.ink + '/>' +
          '<rect x="108" y="30" width="46" height="22" fill="#6a5d50" ' + A.ink + '/><circle cx="84" cy="8" r="5" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/>');
        const y = H() - 100;
        for (let t = 0; t < 3.6; t += 0.3) fx.noise(0.14, { freq: 700, vol: 0.3, at: t });
        fx.tone(740, 0.5, { type: "triangle", vol: 0.12, at: 0.2 });
        fx.tone(880, 0.5, { type: "triangle", vol: 0.12, at: 0.2 });
        fx.particles({ kind: "rise", from: pt(W() / 2, y - 40, W(), 10), count: 14, glyphs: dot("rgba(220,215,205,.85)"), min: 16, max: 34, dur: 2000, stagger: 2600 });
        await fx.fly(train, [W() + 100, y], [-100, y], { size: 170, h: 74, dur: 3600, flip: true });
        await fx.wait(300);
      }
    },

    // Sunrise: A Song of Two Humans
    {
      id: 631,
      y: 1927,
      run: async (fx) => {
        const s = fx.slot();
        A.oldFilm(fx, 5000, "grayscale(1) contrast(1.05) brightness(1.05)");
        const ghost = s ? s.cloneNode(true) : null;
        if (ghost) {
          const r = fx.rect(s);
          const g = fx.put("", r.x, r.y, { size: r.width, h: r.height, style: { opacity: 0.35, mixBlendMode: "screen" } });
          g.appendChild(ghost);
          Object.assign(ghost.style, { width: "100%", height: "100%", margin: 0 });
          fx.move(g, [{ transform: "translate(-24px, -10px) scale(1.1)" }, { transform: "translate(24px, 10px) scale(1.1)" }, { transform: "none" }], { duration: 3600, easing: "ease-in-out" });
        }
        fx.seq([["F4", 3], ["A4", 1], ["C5", 4], ["Bb4", 2], ["A4", 2], ["G4", 4]], { type: "sine", vol: 0.12, beat: 0.25 });
        fx.wash("radial-gradient(circle at 50% 110%, rgba(255,230,160,.8), transparent 70%)", 4800, { fade: 1200 });
        await fx.wait(4800);
      }
    },

    // Steamboat Bill, Jr.
    {
      id: 25768,
      y: 1928,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 4800);
        fx.noise(3, { freq: 600, vol: 0.2, attack: 0.5 });
        const wall = fx.node(A.S("0 0 100 160",
          '<rect x="2" y="2" width="96" height="156" fill="#b8a888" ' + A.ink + '/><path d="M2 40 H98 M2 80 H98 M2 120 H98" stroke="#8a7a62" stroke-width="2"/>' +
          '<rect x="30" y="50" width="40" height="56" fill="none" ' + A.ink + ' stroke-width="4"/>'),
          { style: { position: "absolute", left: r.x - 100 + "px", top: r.top + r.height - 320 + "px", width: "200px", height: "320px", transformOrigin: "50% 100%" } });
        fx.style(wall.firstChild, { width: "100%", height: "100%" });
        const win = wall.firstChild.querySelector("rect:nth-of-type(2)");
        if (win) win.setAttribute("fill", "transparent");
        await fx.wait(700);
        fx.sfx("whoosh", { dur: 0.9, vol: 0.5 });
        if (!fx.reduced) await fx.anim(wall, [{ transform: "perspective(800px) rotateX(0)" }, { transform: "perspective(800px) rotateX(-88deg)" }], { duration: 900, easing: "cubic-bezier(.6,0,1,.7)" });
        fx.sfx("boom", { vol: 0.9 });
        fx.sfx("crackle", { dur: 2, vol: 0.5 });
        fx.noise(0.6, { freq: 800, vol: 0.6 });
        fx.shake("lg", 500);
        fx.buzz(150);
        fx.particles({ kind: "burst", from: pt(r.x, r.top + r.height), count: 16, spread: 60, dur: 1000, stagger: 0, glyphs: dot("rgba(180,165,140,.8)"), min: 10, max: 24 });
        A.intertitle(fx, "Not a scratch.", 1800);
        await fx.wait(2000);
      }
    },

    // The Crowd
    {
      id: 3061,
      y: 1928,
      run: async (fx) => {
        A.oldFilm(fx, 5000);
        const desks = [];
        const n = W() < 500 ? 5 : 8;
        for (let row = 0; row < 7; row++) {
          for (let c = 0; c < n; c++) {
            desks.push(fx.put(A.S("0 0 30 30", '<rect x="2" y="16" width="26" height="8" fill="#4a443c"/><circle cx="15" cy="10" r="5" fill="#1d1a18"/><path d="M4 24 V30 M26 24 V30" stroke="#4a443c" stroke-width="2"/>'),
              (c + 0.5) * W() / n, H() * 0.18 + row * H() * 0.1, { size: 26 }));
          }
        }
        for (let t = 0; t < 4; t += 0.12) fx.click({ freq: 2500 + Math.random() * 1500, vol: 0.12, at: t });
        await fx.wait(1500);
        const mine = desks[Math.floor(desks.length / 2) + 1];
        fx.style(mine, { filter: "drop-shadow(0 0 6px #fff6c0)" });
        if (!fx.reduced) {
          const rr = fx.rect(mine);
          const others = fx.$$("#fx-layer .fx-sprite");
          await fx.anim(others, [{ transform: "none" }, { transform: "translate(" + (W() / 2 - rr.x) * 3 + "px," + (H() / 2 - rr.y) * 3 + "px) scale(4)" }], { duration: 2400, easing: "ease-in" });
        } else await fx.wait(1600);
        fx.tone("C4", 1, { type: "triangle", vol: 0.1 });
        await fx.wait(700);
      }
    },

    // The Wind
    {
      id: 31416,
      y: 1928,
      run: async (fx) => {
        A.oldFilm(fx, 5200, "grayscale(1) sepia(.7) contrast(1.2)");
        fx.noise(5, { type: "bandpass", freq: 500, sweep: 1400, q: 1.5, vol: 0.5, attack: 0.6, pan: -1, panTo: 1 });
        fx.particles({ kind: "sweep", count: 70, glyphs: dot("rgba(170,140,100,.8)"), min: 2, max: 6, dur: 900, stagger: 4000 });
        fx.particles({ kind: "sweep", count: 4, glyphs: A.tumbleweed, min: 50, max: 80, dur: 1800, stagger: 3000, spin: 720 });
        if (!fx.reduced) {
          for (let i = 0; i < 6; i++) {
            fx.anim(fx.otherSlots(true), [{ transform: "none" }, { transform: "skewX(-3deg) translateX(3px)" }, { transform: "none" }], { duration: 600, fill: "none" });
            await fx.wait(700);
          }
        } else await fx.wait(4200);
        fx.buzz([30, 80, 30, 80, 30]);
        await fx.wait(900);
      }
    },

    // Steamboat Willie
    {
      id: 53565,
      y: 1928,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const f = A.oldFilm(fx, 4600, "grayscale(1) contrast(1.3)");
        void f;
        fx.sfx("crackle", { dur: 4.4, vol: 0.6 });
        const wheel = fx.put(A.S("0 0 100 100",
          '<circle cx="50" cy="50" r="30" fill="none" ' + A.ink + ' stroke-width="6"/><circle cx="50" cy="50" r="8" fill="' + A.INK + '"/>' +
          Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return '<path d="M' + (50 + Math.cos(a) * 8) + " " + (50 + Math.sin(a) * 8) + " L" + (50 + Math.cos(a) * 46) + " " + (50 + Math.sin(a) * 46) + '" ' + A.ink + ' stroke-width="5"/><circle cx="' + (50 + Math.cos(a) * 46) + '" cy="' + (50 + Math.sin(a) * 46) + '" r="4" fill="' + A.INK + '"/>'; }).join("")),
          r.x, r.y, { size: Math.min(r.width, r.height) * 0.9 });
        const tune = [["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["G5", 1], ["G5", 2], ["A5", 1], ["G5", 1], ["F5", 1], ["E5", 1], ["D5", 2], [null, 2]];
        fx.seq(tune, { type: "square", vol: 0.06, beat: 0.2, filter: { freq: 2400 } });
        fx.tone(1760, 0.35, { type: "sine", vol: 0.1, at: 3, vibrato: [8, 20] });
        for (let i = 0; i < 8; i++) {
          fx.move(wheel, [{ transform: "rotate(" + i * 45 + "deg)" }, { transform: "rotate(" + (i + 1) * 45 + "deg)" }], { duration: 400, easing: "steps(2)" });
          fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateY(-6px) rotate(" + (i % 2 ? 4 : -4) + "deg)" }, { transform: "none" }], { duration: 400, fill: "none" });
          await fx.wait(400);
        }
        await fx.wait(900);
      }
    },

    // The Passion of Joan of Arc
    {
      id: 780,
      y: 1928,
      run: async (fx) => {
        const s = A.liftSlot(fx, 5000);
        fx.wash("#f4f2ec", 5000, { fade: 700, opacity: 0.94 });
        fx.chord(["D4", "F4", "A4"], 4.5, { type: "sine", vol: 0.07, attack: 1.2 });
        fx.chord(["D5"], 4.5, { type: "sine", vol: 0.05, attack: 1.8 });
        if (s) {
          fx.style(s, { filter: "grayscale(1) contrast(1.3)" }, 5000);
          fx.move(s, [{ transform: "none" }, { transform: "scale(1.25)" }], { duration: 3600, easing: "ease-in-out" });
        }
        await fx.wait(2200);
        const r = fx.rect(s);
        const tear = fx.node(A.drop("#dff3ff"), { parent: s || undefined, cls: "fx-sprite", style: { position: "absolute", left: r.width * 0.36 + "px", top: r.height * 0.4 + "px", width: "10px", height: "15px", zIndex: 3 } });
        await fx.move(tear, [{ transform: "none" }, { transform: "translateY(" + r.height * 0.4 + "px)" }], { duration: 1800, easing: "ease-in" });
        await fx.wait(800);
      }
    },

    // Man with a Movie Camera
    {
      id: 26317,
      y: 1929,
      run: async (fx) => {
        A.oldFilm(fx, 5200, "grayscale(1) contrast(1.25)");
        const cam = A.S("0 0 80 120",
          '<rect x="16" y="10" width="40" height="30" rx="3" fill="#2b2622" ' + A.ink + '/><circle cx="24" cy="8" r="10" fill="#2b2622" ' + A.ink + '/><circle cx="48" cy="8" r="10" fill="#2b2622" ' + A.ink + '/>' +
          '<rect x="56" y="18" width="16" height="14" fill="#2b2622" ' + A.ink + '/><circle cx="74" cy="25" r="6" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/><circle class="pupil" cx="74" cy="25" r="3" fill="#0d0b09"/>' +
          '<path d="M36 40 L14 116 M36 40 L36 116 M36 40 L58 116" ' + A.ink + '/>');
        const el = fx.put(cam, -60, H() * 0.6, { size: 90, h: 130 });
        fx.sfx("projector", { dur: 2.6, vol: 0.45 });
        if (!fx.reduced) {
          await fx.anim(el, [
            { transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + W() * 0.25 + "px) rotate(8deg)", offset: 0.25 },
            { transform: "translateX(" + W() * 0.45 + "px) rotate(-8deg)", offset: 0.5 }, { transform: "translateX(" + (W() * 0.5 + 60) + "px) rotate(0)" }], { duration: 2600, easing: "steps(12)" });
        } else el.style.left = W() / 2 - 45 + "px";
        const pupil = el.querySelector(".pupil");
        if (pupil) pupil.setAttribute("fill", "#6a8bb0");
        fx.sfx("click", { vol: 0.7 });
        fx.tone(440, 0.4, { type: "triangle", vol: 0.12 });
        await fx.move(el, [{ transform: "translateX(" + (W() * 0.5 + 60) + "px) scale(1)" }, { transform: "translateX(" + (W() * 0.5 + 60) + "px) scale(1.4)" }, { transform: "translateX(" + (W() * 0.5 + 60) + "px) scale(1)" }], 900);
        await fx.wait(1200);
      }
    },

    // Pandora's Box
    {
      id: 905,
      y: 1929,
      run: async (fx) => {
        A.oldFilm(fx, 4800, "grayscale(1) contrast(1.2) brightness(1.05)");
        fx.costume(".reely", '<path d="M30 58 C26 20 44 14 60 14 C76 14 94 20 90 58 L86 50 C86 36 80 34 60 34 C40 34 34 36 34 50 Z" fill="#0d0b09"/><path d="M34 34 H86 V42 H34 Z" fill="#0d0b09"/>', 4800);
        fx.costume(".kernel", '<path d="M40 70 C36 40 54 34 65 34 C76 34 94 40 90 70 L86 62 C86 52 80 50 65 50 C50 50 44 52 44 62 Z" fill="#0d0b09"/>', 4800);
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["Bb5", 2], ["A5", 1], ["F5", 1], ["D5", 3]], { type: "triangle", vol: 0.1, beat: 0.22 });
        fx.particles({ kind: "drift", count: 16, glyphs: A.sparkle("#fff"), min: 6, max: 12, dur: 2200, stagger: 2400 });
        await fx.wait(4700);
      }
    },

    // Un Chien Andalou
    {
      id: 626,
      y: 1929,
      run: async (fx) => {
        const cx = W() / 2, cy = H() * 0.35;
        const bg = fx.node("", { cls: "fx-filter", style: { background: "#0d0b09" } });
        await fx.fadeIn(bg, 400);
        fx.put(A.moon, cx, cy, { size: 120 });
        fx.tone("A3", 2.4, { type: "sine", vol: 0.1, attack: 0.4 });
        const cloud = fx.put(box("background:linear-gradient(90deg, transparent, #0d0b09 20%, #0d0b09 80%, transparent);border-radius:50%"), cx - 160, cy, { size: 300, h: 7 });
        await fx.move(cloud, [{ transform: "none" }, { transform: "translateX(320px)" }], { duration: 1800, easing: "linear" });
        await fx.wait(400);
        const r = fx.rect(fx.slot());
        const ants = fx.particles({ kind: "drift", area: pt(r.x, r.y, r.width * 0.6, r.height * 0.5), count: 18, glyphs: A.S("0 0 20 12", '<ellipse cx="4" cy="6" rx="3" ry="2.5" fill="#1d1a18"/><ellipse cx="10" cy="6" rx="3" ry="2.5" fill="#1d1a18"/><ellipse cx="16" cy="6" rx="3.5" ry="3" fill="#1d1a18"/><path d="M8 3 L6 0 M12 3 L14 0 M8 9 L6 12 M12 9 L14 12" stroke="#1d1a18"/>'), min: 10, max: 14, dur: 2400, stagger: 800 });
        fx.noise(2.6, { type: "highpass", freq: 6000, vol: 0.08 });
        await fx.fadeOut(bg, 500);
        await ants;
      }
    },

    // M
    {
      id: 832,
      y: 1931,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.25) brightness(.85)", 5600, { fade: 400 });
        const tune = [["A4", 1], ["B4", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["C5", 1], ["E5", 2], ["D#5", 1], ["B4", 1], ["D#5", 2], ["D5", 1], ["Bb4", 1], ["D5", 2]];
        fx.seq(tune, { type: "sine", vol: 0.14, beat: 0.24, vibrato: [5, 6] });
        await fx.wait(1800);
        const m = fx.costume(".reely", '<path d="M92 88 L96 70 L102 84 L108 70 L112 90" fill="none" stroke="#f4efe2" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>', 3800);
        void m;
        const shadow = fx.node(A.S("0 0 60 140", '<circle cx="30" cy="16" r="12" fill="#0b0907"/><path d="M14 24 H46 L52 100 H8 Z M14 100 L12 140 H22 L28 100 M32 100 L38 140 H48 L46 100" fill="#0b0907"/><path d="M10 24 H50 L46 14 H14 Z" fill="#0b0907"/>'),
          { style: { position: "absolute", right: "6vw", top: "20vh", width: "18vh", height: "42vh", opacity: 0 } });
        fx.style(shadow.firstChild, { width: "100%", height: "100%" });
        await fx.anim(shadow, [{ opacity: 0 }, { opacity: 0.6 }], 800);
        await fx.wait(2600);
      }
    },

    // City Lights
    {
      id: 901,
      y: 1931,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 5200);
        const flower = A.S("0 0 40 80", '<path d="M20 30 V78" stroke="#3a6a2a" stroke-width="3"/><path d="M20 50 C10 44 6 50 4 56 C12 56 16 54 20 50 Z" fill="#3a6a2a"/><circle cx="20" cy="18" r="6" fill="#fff"/>' +
          [0, 72, 144, 216, 288].map((a) => '<ellipse cx="20" cy="8" rx="6" ry="9" fill="#fff" stroke="#1f1b16" stroke-width="1.5" transform="rotate(' + a + ' 20 18)"/>').join("") + '<circle cx="20" cy="18" r="4" fill="#e0b34a"/>');
        fx.seq([["E5", 2], ["D5", 1], ["C5", 1], ["D5", 2], ["G4", 2], ["A4", 1], ["B4", 1], ["C5", 1], ["D5", 1], ["E5", 4]], { type: "sawtooth", vol: 0.06, beat: 0.28, filter: { freq: 1600 }, vibrato: [5.5, 4], attack: 0.08 });
        await fx.fly(flower, [W() / 2, H() + 40], [r.x, r.y + r.height * 0.3], { size: 40, h: 80, dur: 1800, easing: "ease-out", keep: true });
        await fx.wait(900);
        A.intertitle(fx, "You?", 1600);
        await fx.wait(1500);
        fx.caption("You can see now?", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Vampyr
    {
      id: 779,
      y: 1932,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(.75) brightness(1.2) blur(1.2px)", 5600, { fade: 900 });
        fx.wash("rgba(235,235,230,.45)", 5600, { fade: 900 });
        fx.tone("E2", 5, { type: "sine", vol: 0.12, attack: 1.5, vibrato: [0.3, 3] });
        const shadow = A.S("0 0 40 100", '<circle cx="20" cy="12" r="9" fill="rgba(10,8,6,.55)"/><path d="M8 22 H32 L34 70 H6 Z M10 70 L10 100 M30 70 L30 100" fill="rgba(10,8,6,.55)" stroke="rgba(10,8,6,.55)" stroke-width="6"/>');
        await fx.fly(shadow, [-40, H() * 0.7], [W() + 40, H() * 0.6], { size: 50, h: 125, dur: 3600, via: [W() / 2, H() * 0.5] });
        const r = fx.rect(fx.slot());
        const lid = fx.put(box("background:#2d2620;clip-path:polygon(30% 0,70% 0,100% 18%,80% 100%,20% 100%,0 18%);opacity:.85"), r.x, r.y, { size: r.width * 0.9, h: r.height * 0.9 });
        fx.put(box("background:rgba(240,240,235,.6);border:2px solid #2d2620"), r.x, r.y - r.height * 0.22, { size: r.width * 0.3, h: r.height * 0.2 });
        fx.thud({ freq: 70, vol: 0.5 });
        await fx.fadeIn(lid, 300);
        await fx.wait(1300);
      }
    },

    // Scarface (1932)
    {
      id: 877,
      y: 1932,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.3)", 5000, { fade: 300 });
        const spots = fx.otherSlots(false).concat(fx.slot()).slice(0, 8);
        for (let i = 0; i < spots.length; i++) {
          const r = fx.rect(spots[i]);
          fx.put(A.S("0 0 40 40", '<path d="M6 6 L34 34 M34 6 L6 34" stroke="#0b0907" stroke-width="7" stroke-linecap="round" opacity=".75"/>'), r.x, r.y, { size: Math.min(r.width, 60) });
          fx.tone(120, 0.2, { type: "square", vol: 0.08 });
          fx.noise(0.1, { freq: 1600, vol: 0.4 });
          await fx.wait(380);
        }
        const r = fx.rect(fx.slot());
        fx.caption("THE WORLD IS YOURS", { style: "card", ms: 1800, css: { top: r.top - 60 + "px" } });
        await fx.wait(1900);
      }
    },

    // Freaks
    {
      id: 136,
      y: 1932,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15)", 5000, { fade: 300 });
        fx.wash("radial-gradient(circle at 50% 60%, transparent 30%, rgba(0,0,0,.8))", 5000, { fade: 400 });
        const words = ["We accept her!", "One of us!", "Gooble gobble!", "One of us!"];
        for (let i = 0; i < 4; i++) {
          fx.thud({ freq: 90, vol: 0.4, dur: 0.18 });
          fx.thud({ freq: 90, vol: 0.4, dur: 0.18, at: 0.3 });
          fx.tone(i % 2 ? "A3" : "C4", 0.5, { type: "triangle", vol: 0.12 });
          fx.caption(words[i], { style: "subtitle", ms: 900 });
          fx.move(fx.otherSlots(true), [{ transform: "none" }, { transform: "translateY(-5px)" }, { transform: "none" }], { duration: 300, fill: "none" });
          await fx.wait(1000);
        }
        await fx.wait(600);
      }
    },

    // The Invisible Man
    {
      id: 10787,
      y: 1933,
      run: async (fx) => {
        const cx = W() / 2, cy = H() * 0.4;
        A.oldFilm(fx, 5000, "grayscale(1) contrast(1.15)");
        const head = fx.put(A.S("0 0 100 120",
          '<path d="M20 50 C18 16 82 16 80 50 C82 80 70 100 50 100 C30 100 18 80 20 50 Z" fill="#f4f0e6" ' + A.ink + '/>' +
          '<path d="M22 34 C40 30 60 40 78 34 M20 50 C40 46 60 56 80 50 M22 66 C40 62 60 72 78 66 M28 82 C42 78 58 88 72 82" stroke="#c9c0ae" stroke-width="3" fill="none"/>' +
          '<rect class="g" x="24" y="44" width="52" height="16" rx="6" fill="#0d0b09"/><path d="M8 110 H92 L84 120 H16 Z" fill="#3b3530"/>'),
          cx, cy, { size: 130, h: 156 });
        fx.noise(2.4, { type: "highpass", freq: 3000, vol: 0.12, attack: 0.3 });
        fx.tone(660, 2.4, { type: "sine", vol: 0.05, vibrato: [7, 12], attack: 0.5 });
        await fx.wait(700);
        const face = head.querySelector("path");
        await fx.tween(2000, (k) => { if (face) face.style.opacity = 1 - k; head.querySelectorAll("path")[1].style.opacity = 1 - k; });
        fx.caption("(nobody there)", { style: "whisper", ms: 1800 });
        await fx.move(head, [{ transform: "none" }, { transform: "translateY(-20px) rotate(10deg)" }, { transform: "translateY(0) rotate(-6deg)" }], 1400);
        await fx.fadeOut(head, 400);
      }
    },

    // Duck Soup
    {
      id: 3063,
      y: 1933,
      run: async (fx) => {
        const reely = fx.$(".reely"), kernel = fx.$(".kernel");
        fx.filter("grayscale(1) contrast(1.1)", 5200, { fade: 300 });
        const specs = '<g><circle cx="52" cy="55" r="7" fill="none" stroke="#1f1b16" stroke-width="2.5"/><circle cx="68" cy="55" r="7" fill="none" stroke="#1f1b16" stroke-width="2.5"/><path d="M59 55 H61" stroke="#1f1b16" stroke-width="2.5"/><path d="M44 46 C48 40 56 42 58 46 M62 46 C64 42 72 40 76 46" stroke="#0d0b09" stroke-width="5"/><path d="M50 70 C54 64 66 64 70 70 Z" fill="#0d0b09"/></g>';
        fx.costume(".reely", specs, 5200);
        fx.costume(".kernel", '<g transform="translate(5 33)">' + specs + "</g>", 5200);
        const moves = ["translateX(-8px)", "translateY(-10px)", "rotate(-10deg)", "translateX(8px) rotate(6deg)", "none"];
        for (const m of moves) {
          fx.click({ freq: 1800, vol: 0.4 });
          fx.move(reely, [{ transform: "none" }, { transform: m }], { duration: 220, fill: "forwards" });
          await fx.wait(500);
          fx.click({ freq: 1800, vol: 0.4 });
          fx.move(kernel, [{ transform: "none" }, { transform: m.replace(/-?\d+px/g, (x) => -parseFloat(x) + "px") }], { duration: 220, fill: "forwards" });
          await fx.wait(450);
        }
        fx.seq([["F4", 1], ["F4", 1], ["C5", 2]], { type: "square", vol: 0.08, beat: 0.18 });
        await fx.wait(600);
      }
    },

    // L'Atalante
    {
      id: 43904,
      y: 1934,
      run: async (fx) => {
        const water = fx.wash("linear-gradient(rgba(60,110,120,.25), rgba(20,50,60,.6))", 5400, { fade: 700 });
        void water;
        fx.filter("grayscale(1) blur(.6px)", 5400, { fade: 700 });
        fx.particles({ kind: "rise", count: 20, glyphs: A.bubble, min: 8, max: 18, dur: 3200, stagger: 2600 });
        const veil = A.S("0 0 60 90", '<path d="M30 4 C50 10 56 40 54 86 C40 80 20 80 6 86 C4 40 10 10 30 4 Z" fill="rgba(255,255,255,.55)" stroke="rgba(255,255,255,.9)" stroke-width="1.5"/><circle cx="30" cy="24" r="10" fill="rgba(255,255,255,.7)"/>');
        const g = fx.put(veil, W() / 2, H() * 0.4, { size: 110, h: 160, style: { opacity: 0 } });
        fx.anim(g, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 0.8, transform: "translateY(-10px)" }, { opacity: 0, transform: "translateY(-20px)" }], { duration: 4200, easing: "ease-in-out" });
        const tune = [["A4", 1], ["C5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["B4", 2], ["A4", 1], ["G#4", 1], ["A4", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1400 }, vibrato: [6, 5] });
        fx.seq(tune.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "square", vol: 0.03, beat: 0.3, filter: { freq: 900 } });
        await fx.wait(5000);
      }
    },

    // The Thin Man
    {
      id: 3529,
      y: 1934,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const shaker = fx.put(A.S("0 0 40 90", '<path d="M8 30 H32 L30 86 H10 Z" fill="#cfd4d6" ' + A.ink + '/><path d="M10 30 C10 18 30 18 30 30 Z" fill="#b8bec1" ' + A.ink + '/><rect x="16" y="8" width="8" height="12" fill="#b8bec1" ' + A.ink + ' stroke-width="2"/>'), r.x, r.y, { size: 50, h: 110 });
        for (let i = 0; i < 8; i++) {
          fx.noise(0.12, { type: "bandpass", freq: 3500, q: 2, vol: 0.35, at: i * 0.2 });
          fx.click({ freq: 5000, vol: 0.2, at: i * 0.2 + 0.1 });
        }
        await fx.move(shaker, Array.from({ length: 9 }, (_, i) => ({ transform: "translateY(" + (i % 2 ? -14 : 8) + "px) rotate(" + (i % 2 ? -15 : 15) + "deg)" })), { duration: 1600 });
        fx.caption("Always shake to waltz time.", { style: "subtitle", ms: 2000 });
        const dog = A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36 M8 20 L2 14" fill="#f0ece2" ' + A.ink + ' stroke-width="2.5"/><circle cx="46" cy="14" r="1.5" fill="' + A.INK + '"/><path d="M40 14 C38 18 42 20 44 18" fill="#3b3530"/>');
        fx.tone(900, 0.08, { type: "square", vol: 0.12, at: 0.3 });
        fx.tone(1000, 0.08, { type: "square", vol: 0.12, at: 0.45 });
        await fx.fly(dog, [-40, H() - 60], [W() + 40, H() - 60], { size: 60, h: 40, dur: 1800 });
        await fx.wait(300);
      }
    },

    // It Happened One Night
    {
      id: 3078,
      y: 1934,
      run: async (fx) => {
        const grid = fx.$("#grid");
        if (!grid) return;
        const rg = fx.rect(grid);
        fx.filter("grayscale(1) contrast(1.05)", 5000, { fade: 400 });
        const cord = fx.put(box("border-top:3px solid #3b3530"), rg.x, rg.top + 10, { size: rg.width, h: 4 });
        void cord;
        const blanket = fx.put(A.S("0 0 60 200", '<path d="M4 0 H56 C58 60 54 140 58 196 H2 C6 140 2 60 4 0 Z" fill="#b8a888" ' + A.ink + '/><path d="M4 30 H56 M4 70 H56 M4 110 H56 M4 150 H56" stroke="#8a2a1a" stroke-width="3" opacity=".6"/>'),
          rg.x, rg.top + rg.height / 2, { size: 64, h: rg.height });
        await fx.move(blanket, [{ transform: "translateY(-120%)" }, { transform: "none" }], { duration: 900, easing: "cubic-bezier(.3,1.3,.6,1)" });
        fx.noise(0.4, { freq: 1200, vol: 0.2 });
        fx.caption("The Walls of Jericho", { style: "card", ms: 2000 });
        await fx.wait(2400);
        fx.seq([["C6", 1], ["E6", 1], ["G6", 2]], { type: "triangle", vol: 0.1, beat: 0.2 });
        await fx.move(blanket, [{ transform: "none" }, { transform: "translateY(" + H() + "px)" }], { duration: 700, easing: "ease-in" });
        fx.particles({ kind: "burst", from: fx.slot(), count: 10, glyphs: A.heart("#e05a5a"), min: 10, max: 16, dur: 1200, stagger: 200 });
        await fx.wait(1200);
      }
    },

    // Bride of Frankenstein
    {
      id: 229,
      y: 1935,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.3)", 5400, { fade: 200 });
        for (let i = 0; i < 2; i++) {
          fx.flash("#eef4ff", 140);
          fx.noise(0.9, { freq: 400, sweep: 60, vol: 0.6 });
          fx.buzz([40, 30, 60]);
          await fx.wait(600);
        }
        fx.costume(".reely", '<path d="M30 40 C20 -20 100 -20 90 40 C92 20 84 0 72 -6 L66 30 L60 -12 L54 30 L48 -6 C36 0 28 20 30 40 Z" fill="#0d0b09"/><path d="M66 30 L63 -4 C66 -8 70 -8 72 -4 Z" fill="#fff"/>', 4200);
        fx.costume(".kernel", '<path d="M40 70 C30 10 100 10 90 70 C92 50 86 34 78 30 L74 60 L68 24 L62 60 L56 30 C46 34 38 50 40 70 Z" fill="#0d0b09"/><path d="M68 60 L66 30 C68 26 72 26 74 30 Z" fill="#fff"/>', 4200);
        await fx.wait(700);
        fx.tone(900, 0.25, { type: "sawtooth", vol: 0.1, slide: 1500 });
        fx.tone(1200, 0.3, { type: "sawtooth", vol: 0.1, slide: 700, at: 0.28 });
        fx.move([fx.$(".reely"), fx.$(".kernel")], [{ transform: "none" }, { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "none" }], { duration: 500, easing: "steps(3)" });
        await fx.wait(3200);
      }
    },

    // Top Hat
    {
      id: 3080,
      y: 1935,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.1) brightness(1.05)", 5200, { fade: 300 });
        fx.costume(".reely", '<g><path d="M40 20 H80 V-14 H44 Z" fill="#0d0b09" transform="translate(0 4)"/><path d="M30 24 H90" stroke="#0d0b09" stroke-width="6" stroke-linecap="round"/><path d="M44 14 H80" stroke="#f4efe2" stroke-width="3"/><path d="M100 70 L116 140" stroke="#0d0b09" stroke-width="4"/><circle cx="116" cy="140" r="3" fill="#f4efe2"/></g>', 5200);
        const beats = [0, 0.18, 0.36, 0.5, 0.72, 0.9, 1.04, 1.26, 1.44, 1.58, 1.8, 2.16, 2.3, 2.5, 2.7, 2.9];
        beats.forEach((t, i) => fx.click({ freq: i % 3 ? 3200 : 2400, vol: 0.55, at: t }));
        fx.seq([["C5", 2], ["E5", 1], ["G5", 1], ["A5", 2], ["G5", 2], ["E5", 1], ["C5", 1], ["D5", 4]], { type: "triangle", vol: 0.08, beat: 0.2 });
        const reely = fx.$(".reely");
        for (let i = 0; i < 6; i++) {
          fx.move(reely, [{ transform: "none" }, { transform: "translateY(-6px) rotate(" + (i % 2 ? 5 : -5) + "deg)" }, { transform: "none" }], { duration: 280, fill: "none" });
          fx.buzz(8);
          await fx.wait(440);
        }
        fx.particles({ kind: "fall", area: fx.$(".reely"), count: 10, glyphs: A.sparkle("#fff"), min: 6, max: 12, dur: 1400 });
        await fx.wait(1800);
      }
    }
  ]);
})();
