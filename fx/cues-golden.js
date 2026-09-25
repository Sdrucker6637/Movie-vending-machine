/* Machine FX cues - the studio era and its contemporaries abroad, 1936-1953.
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
  const noir = (fx, ms) => fx.filter("grayscale(1) contrast(1.25) brightness(.9)", ms, { fade: 350 });
  // Full-screen SVG that stretches to the viewport.
  const scene = (fx, svg, style) => {
    const el = fx.node(svg, { cls: "fx-filter", style });
    const s = el.firstChild;
    if (s && s.setAttribute) {
      s.setAttribute("preserveAspectRatio", "none");
      s.style.width = s.style.height = "100%";
    }
    return el;
  };

  M.register([
    // Modern Times
    {
      id: 3082,
      y: 1936,
      run: async (fx) => {
        A.oldFilm(fx, 5200);
        const gear = (n, c) => A.S("0 0 100 100", '<circle cx="50" cy="50" r="34" fill="' + c + '" ' + A.ink + '/>' +
          Array.from({ length: n }, (_, i) => '<rect x="44" y="4" width="12" height="16" fill="' + c + '" ' + A.ink + ' stroke-width="2.5" transform="rotate(' + i * 360 / n + ' 50 50)"/>').join("") +
          '<circle cx="50" cy="50" r="10" fill="#0d0b09"/>');
        const big = fx.put(gear(12, "#8e969a"), W() * 0.35, H() * 0.45, { size: 200 });
        const small = fx.put(gear(8, "#6d7478"), W() * 0.35 + 150, H() * 0.45 - 70, { size: 120 });
        fx.move(big, [{ transform: "rotate(0)" }, { transform: "rotate(180deg)" }], { duration: 4000 });
        fx.move(small, [{ transform: "rotate(0)" }, { transform: "rotate(-300deg)" }], { duration: 4000 });
        fx.sfx("motor", { dur: 4, vol: 0.55 });
        for (let t = 0; t < 4; t += 0.25) { fx.click({ freq: 900, vol: 0.4, at: t }); fx.thud({ freq: 70, vol: 0.2, dur: 0.1, at: t + 0.12 }); }
        const slots = fx.otherSlots(true).slice(0, 6);
        for (const s of slots) {
          const r = fx.rect(s);
          const w = fx.put(A.S("0 0 60 20", '<path d="M4 10 H40 M40 4 C50 2 56 6 56 10 C56 14 50 18 40 16 Z" ' + A.ink + ' fill="#9ea6aa"/>'), r.x, r.y, { size: 50, h: 18 });
          fx.move(w, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }, { transform: "rotate(0)" }], 300);
          fx.move(s, [{ transform: "none" }, { transform: "rotate(4deg)" }, { transform: "none" }], { duration: 300, fill: "none" });
          fx.sfx("relay", { vol: 0.6 });
          await fx.wait(420);
          fx.remove(w);
        }
        await fx.wait(1600);
      }
    },

    // Grand Illusion
    {
      id: 777,
      y: 1937,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        A.oldFilm(fx, 5000);
        const bars = fx.put(A.S("0 0 100 140", Array.from({ length: 6 }, (_, i) => '<rect x="' + (6 + i * 17) + '" y="0" width="5" height="140" fill="#2b2622"/>').join("")), r.x, r.y, { size: r.width, h: r.height });
        await fx.fadeIn(bars, 400);
        const pot = fx.put(A.S("0 0 50 70",
          '<path d="M12 44 H38 L34 68 H16 Z" fill="#b5613a" ' + A.ink + ' stroke-width="2"/><path d="M25 44 V16" stroke="#3a6a2a" stroke-width="3"/>' +
          '<circle cx="25" cy="12" r="9" fill="#e0301c"/><circle cx="19" cy="18" r="6" fill="#e0301c"/><circle cx="31" cy="18" r="6" fill="#e0301c"/><path d="M25 30 C18 28 14 32 12 36 M25 34 C32 32 36 36 38 38" stroke="#3a6a2a" stroke-width="2.5" fill="none"/>'),
          r.x, r.top + r.height + 10, { size: 50, h: 70 });
        fx.seq([["G4", 1], ["A4", 1], ["B4", 2], ["D5", 2], ["B4", 1], ["A4", 1], ["G4", 4]], { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1300 }, vibrato: [5, 4] });
        await fx.fadeIn(pot, 600);
        await fx.wait(3200);
      }
    },

    // Bringing Up Baby
    {
      id: 900,
      y: 1938,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 5400, { fade: 300 });
        const cx = W() / 2, base = H() * 0.62;
        const bones = [];
        const parts = [[-70, -20, 34, 10], [-40, -30, 30, 10], [-10, -34, 30, 10], [20, -30, 30, 10], [50, -60, 10, 40], [60, -84, 30, 20], [-60, 20, 8, 40], [-20, 20, 8, 40], [20, 20, 8, 40], [50, 20, 8, 40], [-100, -10, 40, 6]];
        for (const [dx, dy, w, h] of parts) bones.push(fx.put(box("background:#efe7d2;border:2px solid #1f1b16;border-radius:6px"), cx + dx, base + dy, { size: w, h }));
        fx.seq([["C5", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["C5", 2]], { type: "triangle", vol: 0.1, beat: 0.2 });
        await fx.wait(1800);
        fx.caption("The intercostal clavicle!", { style: "subtitle", ms: 1500 });
        const leo = A.S("0 0 80 50", '<path d="M10 30 C14 16 40 14 56 20 C60 10 72 10 74 20 C78 28 70 34 64 32 L60 44 M20 34 L18 46 M36 36 L36 46 M50 36 L50 46 M10 28 C2 20 4 12 10 12" fill="#d9a13a" ' + A.ink + ' stroke-width="2.5"/><circle cx="68" cy="20" r="10" fill="#b07a28" ' + A.ink + ' stroke-width="2"/>');
        fx.fly(leo, [W() + 60, base - 90], [-60, base - 110], { size: 80, h: 50, dur: 1800, flip: true });
        await fx.wait(700);
        fx.noise(0.7, { freq: 900, vol: 0.4 });
        fx.buzz([40, 30, 40, 30, 80]);
        bones.forEach((b, i) => fx.move(b, [{ transform: "none" }, { transform: "translate(" + fx.rand(-60, 60) + "px," + (H() - base + 30) + "px) rotate(" + fx.rand(-200, 200) + "deg)" }], { duration: 700 + i * 50, easing: "cubic-bezier(.55,0,1,.6)", delay: i * 40 }));
        for (let i = 0; i < 6; i++) fx.click({ freq: 1200 + i * 200, vol: 0.4, at: 0.5 + i * 0.07 });
        await fx.wait(1800);
      }
    },

    // The Lady Vanishes
    {
      id: 940,
      y: 1938,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("grayscale(1)", 5200, { fade: 300 });
        for (let t = 0; t < 5; t += 0.4) fx.noise(0.12, { freq: 500, vol: 0.2, at: t });
        const fog = fx.put(box("background:rgba(230,236,240,.78);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);border-radius:6px"), r.x, r.y, { size: r.width, h: r.height });
        await fx.fadeIn(fog, 600);
        const name = fx.put('<svg viewBox="0 0 100 40"><path d="M10 28 C14 8 16 8 18 28 M16 18 H12 M26 12 V28 C34 28 36 12 26 12 M44 10 C38 10 38 28 44 28 C48 28 50 24 50 20 M58 12 V28 H66 M72 28 L78 12 L84 28 M74 22 H82" fill="none" stroke="#6f7a80" stroke-width="3" stroke-linecap="round"/></svg>', r.x, r.y, { size: r.width * 0.9, h: 40 });
        const p = name.querySelector("path");
        if (p && !fx.reduced) {
          const L = 400;
          p.style.strokeDasharray = L;
          await fx.tween(1500, (k) => (p.style.strokeDashoffset = L * (1 - k)));
        }
        fx.tone("E5", 0.6, { type: "sine", vol: 0.08 });
        await fx.wait(1300);
        await fx.fadeOut(name, 1200);
        fx.caption("What lady?", { style: "subtitle", ms: 1400 });
        await fx.fadeOut(fog, 600);
        await fx.wait(600);
      }
    },

    // The Rules of the Game
    {
      id: 776,
      y: 1939,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.1)", 5200, { fade: 300 });
        fx.marquee("THE RULES OF THE GAME", 5000, "everyone has their reasons");
        const figs = [];
        for (let i = 0; i < 5; i++) {
          figs.push(fx.put(A.S("0 0 30 50", '<circle cx="15" cy="10" r="7" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/><path d="M6 20 H24 L22 44 H8 Z" fill="' + ["#b3402d", "#3f7877", "#d9a13a", "#6b4a2a", "#2d3b55"][i] + '" ' + A.ink + ' stroke-width="2"/>'),
            W() / 2 + (i - 2) * 46, H() * 0.3, { size: 34, h: 56 }));
        }
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["F5", 1], ["A5", 1], ["G5", 2], ["E5", 1], ["C5", 1], ["D5", 1], ["B4", 1], ["C5", 4]];
        fx.seq(tune, { type: "square", vol: 0.06, beat: 0.22, filter: { freq: 2600 } });
        fx.seq(tune.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "triangle", vol: 0.06, beat: 0.22 });
        for (let b = 0; b < 12; b++) {
          figs.forEach((f, i) => { f.style.transform = fx.reduced ? "" : "translateY(" + ((b + i) % 2 ? -8 : 0) + "px) rotate(" + ((b + i) % 3 - 1) * 8 + "deg)"; });
          await fx.wait(260);
        }
        await fx.wait(1400);
      }
    },

    // The Great Dictator
    {
      id: 914,
      y: 1940,
      run: async (fx) => {
        fx.filter("grayscale(1)", 5600, { fade: 300 });
        const globe = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="46" fill="#dfe6ea" ' + A.ink + '/><path d="M20 30 C30 20 40 34 50 26 C60 20 66 36 80 30 M14 56 C28 50 36 64 52 58 C66 52 74 66 88 60 M30 80 C40 74 56 84 70 78" fill="none" stroke="#6f7a80" stroke-width="3"/>'),
          W() / 2, H() * 0.4, { size: 120 });
        const tune = [["D5", 3], ["C#5", 1], ["D5", 2], ["F#5", 2], ["A5", 4], ["G5", 2], ["F#5", 2], ["E5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.12, beat: 0.2, vibrato: [5, 4] });
        await fx.move(globe, [
          { transform: "translate(0,0) rotate(0)" }, { transform: "translate(0,-80px) rotate(90deg)" }, { transform: "translate(40px,-20px) rotate(180deg)" },
          { transform: "translate(-30px,-100px) rotate(270deg)" }, { transform: "translate(0,-40px) rotate(360deg)" }], { duration: 4000, easing: "ease-in-out" });
        fx.noise(0.2, { type: "highpass", freq: 4000, vol: 0.6 });
        fx.buzz(40);
        fx.remove(globe);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.4 - 40), count: 14, spread: 50, dur: 900, stagger: 0, glyphs: dot("#dfe6ea"), min: 4, max: 10 });
        await fx.wait(1000);
      }
    },

    // His Girl Friday
    {
      id: 3085,
      y: 1940,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 5000, { fade: 300 });
        for (let t = 0; t < 4.2; t += fx.rand(0.05, 0.11)) fx.click({ freq: fx.rand(1800, 3200), vol: 0.35, at: t });
        [0.8, 1.9, 3].forEach((t) => { fx.tone(1300, 0.9, { type: "square", vol: 0.04, at: t, vibrato: [18, 80] }); });
        const lines = ["Hold the presses!", "Get me rewrite!", "Now listen, Hildy—", "Wait a minute—", "Sweetheart, get me rewrite!"];
        for (let i = 0; i < lines.length; i++) {
          fx.caption(lines[i], { style: "subtitle", ms: 800, css: { bottom: "auto", top: 18 + i * 12 + "%" } });
          fx.later(160, () => fx.caption(lines[(i + 2) % lines.length], { style: "subtitle", ms: 650, css: { bottom: "auto", top: 24 + i * 12 + "%", color: "#d9e6ff" } }));
          await fx.wait(700);
        }
        const r = fx.rect(fx.slot());
        fx.caption("EXTRA!", { style: "card", ms: 1500, css: { top: r.top - 50 + "px" } });
        fx.move(fx.slot(), [{ transform: "rotate(-720deg) scale(.2)" }, { transform: "none" }], 700);
        await fx.wait(1500);
      }
    },

    // Rebecca
    {
      id: 223,
      y: 1940,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("grayscale(1) brightness(.85)", 5600, { fade: 500 });
        fx.chord(["E3", "G3", "B3", "D4"], 4, { type: "sine", vol: 0.07, attack: 1 });
        const monogram = fx.put('<svg viewBox="0 0 80 80"><path d="M20 70 V10 C60 6 64 40 24 40 C40 44 50 60 64 70" fill="none" stroke="#f4efe2" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 72 C24 76 34 70 40 74" stroke="#f4efe2" stroke-width="2" fill="none"/></svg>', r.x, r.y, { size: 90 });
        await fx.fadeIn(monogram, 800);
        await fx.wait(1200);
        fx.noise(2.4, { freq: 1200, sweep: 3000, vol: 0.25, attack: 0.4 });
        fx.style(monogram, { filter: "drop-shadow(0 0 6px #ff8a2a)" });
        fx.particles({ kind: "rise", from: pt(r.x, r.y + 30, 90, 10), count: 26, glyphs: [dot("#ff8a2a"), dot("#ffd26a"), dot("#b3402d")], min: 3, max: 9, dur: 1600, stagger: 1800 });
        await fx.tween(2200, (k) => { monogram.style.clipPath = "inset(0 0 " + k * 100 + "% 0)"; });
        fx.wash("rgba(255,120,30,.25)", 1200, { fade: 400 });
        await fx.wait(1200);
      }
    },

    // The Maltese Falcon
    {
      id: 963,
      y: 1941,
      run: async (fx) => {
        noir(fx, 5200);
        fx.wash("repeating-linear-gradient(0deg, rgba(0,0,0,.45) 0 14px, transparent 14px 34px)", 5200, { fade: 400 });
        const bird = fx.put(A.S("0 0 60 100",
          '<path d="M24 10 C34 4 44 10 42 18 L50 22 L42 24 C46 40 50 60 44 80 H16 C12 60 16 36 24 26 C20 22 20 14 24 10 Z" fill="#0d0b09" stroke="#555" stroke-width="1.5"/>' +
          '<path d="M24 34 C30 44 30 60 26 72 M32 30 C38 44 38 60 34 74" stroke="#444" stroke-width="2" fill="none"/><rect x="12" y="80" width="36" height="12" fill="#0d0b09" stroke="#555" stroke-width="1.5"/><circle cx="36" cy="16" r="1.5" fill="#f4efe2"/>'),
          W() / 2, H() * 0.42, { size: 110, h: 180 });
        fx.chord(["C3", "Eb3", "Gb3", "Bb3"], 3, { type: "sawtooth", vol: 0.06, attack: 0.5, filter: { freq: 700 } });
        await fx.fadeIn(bird, 800);
        await fx.wait(1300);
        fx.caption("The stuff that dreams are made of.", { style: "subtitle", ms: 2300 });
        for (let i = 0; i < 4; i++) { fx.noise(0.08, { type: "highpass", freq: 4500, vol: 0.4, at: i * 0.25 }); }
        await fx.move(bird, [{ transform: "none" }, { transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }, { transform: "none" }], 800);
        fx.caption("(it's lead)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Cat People
    {
      id: 25508,
      y: 1942,
      run: async (fx) => {
        noir(fx, 5200);
        fx.wash("radial-gradient(circle at 50% 50%, transparent 20%, rgba(0,0,0,.85) 70%)", 5200, { fade: 800 });
        for (let t = 0; t < 2.4; t += 0.6) fx.click({ freq: 1400, vol: 0.2, at: t });
        fx.tone("E2", 2.6, { type: "sine", vol: 0.1, attack: 0.8 });
        await fx.wait(2600);
        const cat = fx.put(A.S("0 0 100 60", '<path d="M10 40 C20 20 60 18 80 26 L88 12 L92 26 C98 30 96 38 88 40 L70 44 C50 50 30 48 10 40 Z" fill="#0b0907"/><circle cx="86" cy="30" r="2" fill="#e8ff6a"/>'), W() * 0.75, H() * 0.55, { size: 150, h: 90, style: { opacity: 0.7 } });
        void cat;
        fx.noise(0.9, { type: "highpass", freq: 2500, sweep: 6000, vol: 0.9, attack: 0.005 });
        fx.tone(160, 0.8, { type: "sawtooth", vol: 0.25, slide: 60 });
        fx.flash("#e8f0ff", 180);
        fx.buzz([60, 30, 120]);
        fx.shake("md", 400);
        await fx.wait(1200);
        fx.caption("…just the bus.", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Meshes of the Afternoon
    {
      id: 27040,
      y: 1943,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.3)", 6000, { fade: 400 });
        const figure = A.S("0 0 40 110", '<path d="M20 4 C34 4 36 20 34 30 L38 106 H2 L6 30 C4 20 6 4 20 4 Z" fill="#0b0907"/><ellipse cx="20" cy="22" rx="9" ry="11" fill="#c8d0d4" stroke="#fff" stroke-width="1.5"/><path d="M13 16 L27 28 M27 16 L13 28" stroke="#fff" stroke-width=".8" opacity=".6"/>');
        fx.tone(220, 5, { type: "sine", vol: 0.06, vibrato: [0.5, 8] });
        fx.chord(["A4", "Bb4"], 5, { type: "sine", vol: 0.03, attack: 1.5 });
        const objs = [
          A.S("0 0 40 20", '<circle cx="8" cy="10" r="6" fill="none" stroke="#f4efe2" stroke-width="3"/><path d="M14 10 H36 M30 10 V16 M24 10 V14" stroke="#f4efe2" stroke-width="3"/>'),
          A.S("0 0 50 14", '<path d="M2 7 H30 L48 4 L48 10 L30 7" fill="#dfe6ea" stroke="#fff" stroke-width="1.5"/><rect x="0" y="4" width="16" height="6" fill="#4a443c"/>'),
          A.S("0 0 30 40", '<path d="M15 16 V40" stroke="#3a6a2a" stroke-width="2"/><circle cx="15" cy="10" r="8" fill="#f4efe2"/>')
        ];
        for (let i = 0; i < 3; i++) {
          const y = H() * (0.3 + i * 0.12);
          fx.fly(figure, [W() + 30, y], [-30, y], { size: 40, h: 110, dur: 2600 });
          const o = fx.put(objs[i], W() / 2 + (i - 1) * 70, H() * 0.72, { size: 50, h: 40, style: { opacity: 0 } });
          fx.anim(o, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1600 });
          await fx.wait(1300);
        }
        await fx.wait(1600);
      }
    },

    // Gaslight
    {
      id: 13528,
      y: 1944,
      run: async (fx) => {
        fx.filter("grayscale(.7) sepia(.3)", 6200, { fade: 400 });
        const dim = fx.node("", { cls: "fx-filter", style: { background: "#0b0907", opacity: 0 } });
        fx.noise(5.5, { freq: 300, vol: 0.06, attack: 1 });
        const lamp = fx.put(A.S("0 0 40 60", '<path d="M12 20 H28 L32 44 H8 Z" fill="rgba(255,230,160,.5)" ' + A.ink + ' stroke-width="2"/><ellipse class="flame" cx="20" cy="36" rx="5" ry="7" fill="#ffd26a"/><path d="M16 44 H24 V56 H16 Z" fill="#8a7a62" ' + A.ink + ' stroke-width="2"/>'),
          W() - 50, 90, { size: 50, h: 76 });
        const flame = lamp.querySelector(".flame");
        await fx.tween(3600, (k) => {
          dim.style.opacity = k * 0.55;
          if (flame) flame.setAttribute("ry", 7 - k * 5);
        });
        fx.tone(1600, 0.08, { type: "sine", vol: 0.05 });
        await fx.wait(600);
        dim.style.opacity = 0;
        if (flame) flame.setAttribute("ry", 7);
        fx.caption("The lights are fine, dear.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Double Indemnity
    {
      id: 996,
      y: 1944,
      run: async (fx) => {
        noir(fx, 5400);
        fx.wash("repeating-linear-gradient(-12deg, rgba(0,0,0,.6) 0 16px, rgba(255,245,215,.12) 16px 30px)", 5400, { fade: 500 });
        const r = fx.rect(fx.slot());
        const anklet = fx.put(A.S("0 0 80 30", '<path d="M4 10 C20 26 60 26 76 10" fill="none" stroke="#e0b34a" stroke-width="3" stroke-dasharray="4 3"/><circle cx="40" cy="22" r="4" fill="#e0b34a" ' + A.ink + ' stroke-width="1.5"/>'), r.x, r.top + r.height - 20, { size: r.width, h: 30 });
        A.sparkleOn(fx, anklet, 6, "#ffe9a0");
        fx.seq([["F4", 3], ["E4", 1], ["F4", 2], ["Ab4", 2], ["Db5", 4], ["C5", 4]], { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 900 } });
        await fx.wait(2600);
        fx.caption("Straight down the line.", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Spellbound
    {
      id: 4174,
      y: 1945,
      run: async (fx) => {
        const eyes = scene(fx, A.S("0 0 400 300",
          '<rect width="400" height="300" fill="#e6e1d6"/>' +
          [[70, 60], [200, 50], [330, 70], [110, 170], [270, 160], [190, 250], [50, 250], [350, 240]].map(([x, y]) => '<path d="M' + (x - 36) + " " + y + " Q" + x + " " + (y - 28) + " " + (x + 36) + " " + y + " Q" + x + " " + (y + 28) + " " + (x - 36) + " " + y + ' Z" fill="#fff" stroke="#1f1b16" stroke-width="3"/><circle cx="' + x + '" cy="' + y + '" r="11" fill="#1f1b16"/>').join("")),
          { opacity: 0 });
        fx.tone(440, 4.5, { type: "sine", vol: 0.12, vibrato: [6, 30], attack: 0.6 });
        fx.tone(660, 4.5, { type: "sine", vol: 0.05, vibrato: [5, 40], attack: 1.2 });
        await fx.fadeIn(eyes, 700);
        await fx.wait(1300);
        const scissors = A.S("0 0 60 40", '<circle cx="10" cy="10" r="7" fill="none" ' + A.ink + '/><circle cx="10" cy="30" r="7" fill="none" ' + A.ink + '/><path d="M16 14 L58 26 M16 26 L58 14" ' + A.ink + '/>');
        fx.noise(1.2, { type: "highpass", freq: 3500, vol: 0.3 });
        await fx.fly(scissors, [-30, H() / 2], [W() + 30, H() / 2], { size: 60, h: 40, dur: 1200 });
        fx.style(eyes, { clipPath: "polygon(0 0, 100% 0, 100% 49%, 0 49%)" });
        const bottom = eyes.cloneNode(true);
        eyes.after(bottom);
        fx.style(bottom, { clipPath: "polygon(0 51%, 100% 51%, 100% 100%, 0 100%)" });
        fx.onCleanup(() => bottom.remove());
        await Promise.all([
          fx.move(eyes, [{ transform: "none" }, { transform: "translateY(-50%)" }], 800),
          fx.move(bottom, [{ transform: "none" }, { transform: "translateY(50%)" }], 800)
        ]);
        await fx.fadeOut(eyes, 300);
        bottom.remove();
      }
    },

    // Brief Encounter
    {
      id: 851,
      y: 1945,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 5600, { fade: 300 });
        const chords = [["C4", "Eb4", "G4", "C5"], ["Ab3", "C4", "Eb4", "Ab4"], ["F3", "Ab3", "C4", "F4"], ["G3", "B3", "D4", "G4"]];
        chords.forEach((c, i) => fx.chord(c, 1.3, { type: "triangle", vol: 0.08, at: i * 1.1, attack: 0.05 }));
        await fx.wait(1600);
        fx.noise(2, { freq: 500, vol: 0.4, attack: 0.3 });
        fx.tone(700, 1, { type: "square", vol: 0.05, slide: 600, filter: { freq: 1200 } });
        fx.particles({ kind: "sweep", count: 30, glyphs: dot("rgba(235,235,235,.8)"), min: 20, max: 50, dur: 1200, stagger: 1200 });
        fx.shake("sm", 1400);
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 20 20", '<path d="M4 4 L16 16 M16 4 L4 16" stroke="#555" stroke-width="2"/>'), r.x + r.width * 0.2, r.y - r.height * 0.1, { size: 10, ms: 2400 });
        await fx.wait(2600);
      }
    },

    // A Matter of Life and Death
    {
      id: 28162,
      y: 1946,
      run: async (fx) => {
        const cx = W() / 2;
        fx.filter("grayscale(1) brightness(1.1)", 5600, { fade: 1200 });
        fx.wash("radial-gradient(circle at 50% 0%, rgba(255,255,255,.7), transparent 70%)", 5600, { fade: 1000 });
        const stairs = fx.node(A.S("0 0 200 400", Array.from({ length: 16 }, (_, i) => '<rect x="' + (60 - i * 1.5) + '" y="' + (380 - i * 24) + '" width="' + (80 + i * 3) + '" height="10" fill="#f4f4f0" stroke="#aaa" stroke-width="1"/>').join("")),
          { style: { position: "absolute", left: cx - 100 + "px", bottom: "0", width: "200px", height: "80vh", opacity: 0.85 } });
        fx.style(stairs.firstChild, { width: "100%", height: "100%" });
        const st = stairs.firstChild;
        st.setAttribute("preserveAspectRatio", "none");
        fx.chord(["C4", "G4", "E5"], 5, { type: "sine", vol: 0.06, attack: 2 });
        if (!fx.reduced) fx.anim(st, [{ transform: "translateY(0)" }, { transform: "translateY(-6%)" }], { duration: 4000, iterations: 1 });
        fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateY(-20px)" }], 4000);
        await fx.wait(2400);
        fx.caption("One is starved for Technicolor up there.", { style: "subtitle", ms: 2600 });
        await fx.wait(2800);
      }
    },

    // Beauty and the Beast (1946)
    {
      id: 648,
      y: 1946,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15) brightness(.85)", 5400, { fade: 500 });
        const arm = A.S("0 0 120 40", '<path d="M0 16 H70 C80 16 84 12 90 12 V28 C84 28 80 24 70 24 H0 Z" fill="#e8dcc8" ' + A.ink + ' stroke-width="2"/><path d="M90 20 H104 M100 6 V34" stroke="#c9a24a" stroke-width="4"/><path d="M100 6 V-2 M104 20 V14 M100 34 V28" stroke="#fff5c0" stroke-width="3"/><circle cx="100" cy="0" r="3" fill="#ffd26a"/>');
        const ys = [0.25, 0.45, 0.65];
        for (const y of ys) {
          const L = fx.put(arm, 60, H() * y, { size: 120, h: 40 });
          const R = fx.put(arm, W() - 60, H() * y, { size: 120, h: 40, style: { transform: "scaleX(-1)" } });
          fx.move(L, [{ transform: "translateX(-120px)" }, { transform: "none" }], 700);
          fx.move(R, [{ transform: "scaleX(-1) translateX(-120px)" }, { transform: "scaleX(-1)" }], 700);
          fx.tone(fx.pick(["E5", "G5", "B5"]), 1, { type: "sine", vol: 0.08, vibrato: [4, 10] });
          await fx.wait(700);
        }
        fx.particles({ kind: "drift", count: 16, glyphs: A.sparkle("#fff5c0"), min: 6, max: 12, dur: 2000, stagger: 1400 });
        await fx.wait(2300);
      }
    },

    // Notorious
    {
      id: 303,
      y: 1946,
      run: async (fx) => {
        noir(fx, 5200);
        const r = fx.rect(fx.slot());
        const hand = fx.put(A.S("0 0 100 60", '<path d="M10 40 C10 20 40 14 60 20 L90 16 C96 16 96 26 90 26 L70 28 L86 34 C92 36 90 44 84 44 L40 50 C20 52 10 50 10 40 Z" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/>' +
          '<g transform="translate(34 26) rotate(-10)"><circle cx="0" cy="0" r="7" fill="none" stroke="#c9a24a" stroke-width="3.5"/><path d="M7 0 H30 M24 0 V6 M18 0 V5" stroke="#c9a24a" stroke-width="3.5"/></g>'),
          W() / 2, H() / 2, { size: 120, h: 72 });
        fx.chord(["D3", "F3", "A3", "C#4"], 3.5, { type: "sine", vol: 0.08, attack: 0.8 });
        if (!fx.reduced) await fx.anim(hand, [{ transform: "scale(.4)" }, { transform: "scale(2.6)" }], { duration: 2600, easing: "ease-in-out" });
        else await fx.wait(1600);
        fx.caption("UNICA", { style: "whisper", ms: 1400 });
        await fx.wait(700);
        await fx.fly(A.S("0 0 40 14", '<circle cx="7" cy="7" r="5" fill="none" stroke="#c9a24a" stroke-width="3"/><path d="M12 7 H38 M32 7 V12" stroke="#c9a24a" stroke-width="3"/>'), [W() / 2, H() / 2], [r.x, r.y], { size: 40, h: 14, dur: 800 });
        await fx.wait(600);
      }
    },

    // The Lady from Shanghai
    {
      id: 3766,
      y: 1947,
      run: async (fx) => {
        noir(fx, 5600);
        const s = fx.slot();
        const r = fx.rect(s);
        const img = s && s.querySelector("img");
        const copies = [];
        const n = 7;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2;
          const c = fx.put(img ? '<img src="' + img.src + '" style="width:100%;height:100%;object-fit:cover;border:2px solid #cfd4d6;opacity:.8">' : box("background:#555"), r.x + Math.cos(a) * r.width * 1.2, r.y + Math.sin(a) * r.height * 0.9, { size: r.width * 0.8, h: r.height * 0.8 });
          fx.fadeIn(c, 300);
          copies.push(c);
          fx.tone(1200 + i * 90, 0.3, { type: "sine", vol: 0.05 });
          await fx.wait(180);
        }
        await fx.wait(1200);
        for (const c of copies) {
          fx.noise(0.25, { type: "highpass", freq: 4000 + Math.random() * 3000, vol: 0.4 });
          fx.thud({ vol: 0.15, freq: 200 });
          const cr = fx.rect(c);
          fx.remove(c);
          fx.particles({ kind: "burst", from: pt(cr.x, cr.y), count: 8, spread: 30, gravity: 40, dur: 600, stagger: 0, glyphs: '<div style="width:100%;height:100%;background:linear-gradient(135deg,#fff,#9aa);clip-path:polygon(50% 0,100% 100%,0 70%)"></div>', min: 6, max: 14 });
          fx.buzz(15);
          await fx.wait(170);
        }
        await fx.wait(900);
      }
    },

    // Black Narcissus
    {
      id: 16391,
      y: 1947,
      run: async (fx) => {
        fx.wash("linear-gradient(#f0f4f8, rgba(200,220,240,.2) 60%)", 5400, { fade: 700, opacity: 0.8 });
        const bell = fx.put(A.S("0 0 60 80", '<path d="M30 4 V14" ' + A.ink + '/><path d="M12 56 C12 30 18 14 30 14 C42 14 48 30 48 56 L54 62 H6 Z" fill="#8a6a3a" ' + A.ink + '/><circle cx="30" cy="66" r="5" fill="#5d4a2a" ' + A.ink + ' stroke-width="2"/>'),
          W() / 2, H() * 0.28, { size: 70, h: 92 });
        for (let i = 0; i < 4; i++) {
          fx.chord([392, 587, 784, 1047], 2.2, { type: "sine", vol: 0.1, at: i * 0.9 });
          fx.later(i * 900, () => fx.move(bell, [{ transform: "rotate(-18deg)" }, { transform: "rotate(18deg)" }, { transform: "rotate(0)" }], 900));
        }
        fx.noise(4, { freq: 1200, vol: 0.12, pan: -1, panTo: 1, attack: 0.8 });
        await fx.wait(3200);
        fx.wash("#b3402d", 1400, { blend: "multiply", opacity: 0.45, fade: 400 });
        fx.chord(["C3", "F#3"], 1.3, { type: "sawtooth", vol: 0.05, filter: { freq: 500 } });
        await fx.wait(1600);
      }
    },

    // The Red Shoes
    {
      id: 19542,
      y: 1948,
      run: async (fx) => {
        const shoe = A.S("0 0 60 30", '<path d="M4 20 C4 10 12 8 20 12 C28 16 36 14 44 10 C52 8 58 14 56 20 C54 26 44 26 30 26 H8 C4 26 4 24 4 20 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M20 12 C24 4 32 4 34 12" stroke="#d51f2a" stroke-width="2.5" fill="none"/><path d="M8 26 V30" ' + A.ink + '/>');
        fx.wash("radial-gradient(circle at 50% 90%, rgba(240,40,40,.25), transparent 65%)", 5400, { fade: 600 });
        const l = fx.put(shoe, W() / 2 - 30, H() - 90, { size: 60, h: 30 });
        const rr = fx.put(shoe, W() / 2 + 30, H() - 90, { size: 60, h: 30 });
        const tune = [["E5", 1], ["F5", 1], ["G5", 2], ["C6", 2], ["B5", 1], ["A5", 1], ["G5", 2], ["E5", 2], ["F5", 1], ["D5", 1], ["C5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.12, beat: 0.2, vibrato: [5, 6] });
        fx.chord(["C4", "E4", "G4"], 2.6, { type: "triangle", vol: 0.04, attack: 0.3 });
        for (let i = 0; i < 12; i++) {
          const x = Math.sin(i * 0.9) * W() * 0.3, y = -Math.abs(Math.cos(i * 0.7)) * 70;
          fx.move(i % 2 ? l : rr, [{ transform: "none" }, { transform: "translate(" + x + "px," + y + "px) rotate(" + (i % 2 ? -25 : 25) + "deg)" }], { duration: 280, fill: "forwards" });
          fx.click({ freq: 2800, vol: 0.3 });
          await fx.wait(300);
        }
        await fx.move([l, rr], [{ opacity: 1 }, { transform: "translateX(" + W() + "px)", opacity: 1 }], { duration: 900, easing: "ease-in" });
        await fx.wait(300);
      }
    },

    // Bicycle Thieves
    {
      id: 5156,
      y: 1948,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 5400, { fade: 300 });
        const r = fx.rect(fx.slot());
        const bike = A.S("0 0 100 60", '<circle cx="22" cy="42" r="16" fill="none" ' + A.ink + '/><circle cx="78" cy="42" r="16" fill="none" ' + A.ink + '/><path d="M22 42 L40 18 H66 L78 42 M40 18 L50 42 L66 18 M36 12 H46 M64 10 L70 18" fill="none" ' + A.ink + '/>');
        const b = fx.put(bike, r.x, r.top + r.height + 10, { size: 90, h: 54 });
        fx.tone(1800, 0.12, { type: "sine", vol: 0.1 });
        fx.tone(1800, 0.12, { type: "sine", vol: 0.1, at: 0.2 });
        await fx.wait(1500);
        fx.noise(0.6, { freq: 900, vol: 0.2 });
        await fx.move(b, [{ transform: "none" }, { transform: "translateX(" + (W() - r.x + 100) + "px)" }], { duration: 700, easing: "ease-in" });
        fx.remove(b);
        fx.caption("Ladri!", { style: "hand", ms: 1400 });
        const crowd = fx.otherSlots(true).slice(0, 8);
        fx.move(crowd, [{ transform: "none" }, { transform: "translateX(6px)" }, { transform: "translateX(-6px)" }, { transform: "none" }], { duration: 500, fill: "none" });
        fx.seq([["A4", 2], ["G4", 1], ["F4", 1], ["E4", 4]], { type: "triangle", vol: 0.1, beat: 0.3 });
        await fx.wait(2200);
      }
    },

    // The Treasure of the Sierra Madre
    {
      id: 3090,
      y: 1948,
      run: async (fx) => {
        fx.filter("grayscale(1) sepia(.4) contrast(1.1)", 5400, { fade: 300 });
        fx.caption("Badges? We ain't got no badges!", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
        fx.noise(4, { type: "bandpass", freq: 700, sweep: 1600, q: 1, vol: 0.5, attack: 0.6, pan: -1, panTo: 1 });
        const bags = fx.otherSlots(true).slice(0, 6).map((s) => {
          const r = fx.rect(s);
          return fx.put(A.S("0 0 30 30", '<path d="M8 10 C4 20 6 28 15 28 C24 28 26 20 22 10 Z" fill="#b8a888" ' + A.ink + ' stroke-width="2"/><path d="M10 10 H20 L18 6 H12 Z" fill="#8a7a62" ' + A.ink + ' stroke-width="2"/>'), r.x, r.y, { size: 34 });
        });
        await fx.wait(700);
        bags.forEach((b, i) => fx.move(b, [{ transform: "none" }, { transform: "translate(" + (W() + 100) + "px," + fx.rand(-60, 60) + "px)", opacity: 0.2 }], { duration: 1600, delay: i * 90, easing: "ease-in" }));
        await fx.particles({ kind: "sweep", count: 70, glyphs: dot("rgba(230,200,120,.9)"), min: 2, max: 5, dur: 1300, stagger: 1600 });
        fx.caption("Gold dust… blown back to the mountain.", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Rope
    {
      id: 1580,
      y: 1948,
      run: async (fx) => {
        const rg = fx.rect(fx.$("#grid"));
        fx.wash("linear-gradient(180deg, #f0b06a, #7b5ab0 50%, #1b2440)", 6000, { fade: 1200, blend: "multiply", opacity: 0.5 });
        const chest = fx.put(A.S("0 0 100 50", '<rect x="4" y="12" width="92" height="36" fill="#6b4a2a" ' + A.ink + '/><path d="M2 12 H98 V6 H2 Z" fill="#7b5a3a" ' + A.ink + '/><path d="M20 24 H80" stroke="#c9a24a" stroke-width="2"/><rect x="44" y="18" width="12" height="8" fill="#c9a24a"/>'),
          W() / 2, rg.top + rg.height + 30, { size: 160, h: 80 });
        const rope = fx.put(A.S("0 0 60 60", '<path d="M10 50 C20 20 50 50 40 20 C34 6 18 10 22 22" fill="none" stroke="#c7a46a" stroke-width="5" stroke-dasharray="4 2"/>'), W() / 2 + 60, rg.top + rg.height - 20, { size: 50 });
        fx.seq([["C5", 2], ["D5", 1], ["E5", 1], ["G5", 2], ["E5", 2], ["D5", 2], ["C5", 4]], { type: "sine", vol: 0.1, beat: 0.35 });
        await fx.fadeIn(chest, 600);
        await fx.wait(1200);
        fx.move(rope, [{ transform: "none" }, { transform: "translateY(18px)", opacity: 0 }], 700);
        const cam = fx.node("", { cls: "fx-filter", style: { background: "#0b0907", opacity: 0 } });
        fx.caption("(no cut)", { style: "whisper", ms: 1600 });
        await fx.wait(1500);
        if (!fx.reduced) {
          await fx.anim(cam, [{ opacity: 0, transform: "translateX(-100%)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "ease-in" });
          await fx.anim(cam, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(100%)" }], { duration: 600, easing: "ease-out" });
        } else await fx.wait(600);
      }
    },

    // Kind Hearts and Coronets
    {
      id: 11898,
      y: 1949,
      run: async (fx) => {
        fx.filter("grayscale(1)", 6200, { fade: 300 });
        const others = fx.otherSlots(true).slice(0, 8);
        const crown = A.S("0 0 40 24", '<path d="M4 22 L2 6 L12 14 L20 2 L28 14 L38 6 L36 22 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/>');
        for (let i = 0; i < others.length; i++) {
          const rr = fx.rect(others[i]);
          const c = fx.put(crown, rr.x, rr.top + 4, { size: 30, h: 18 });
          fx.tone(["D5", "C5", "B4", "A4", "G4", "F#4", "E4", "D4"][i], 0.4, { type: "triangle", vol: 0.1 });
          fx.move(c, [{ transform: "none" }, { transform: "translateY(" + rr.height + "px) rotate(90deg)", opacity: 0 }], { duration: 500, easing: "ease-in" });
          fx.style(others[i], { filter: "brightness(.5)" }, 6000 - i * 500);
          await fx.wait(520);
        }
        const r = fx.rect(fx.slot());
        fx.put(crown, r.x, r.top - 4, { size: 44, h: 26 });
        fx.chord(["D4", "F#4", "A4", "D5"], 1.4, { type: "triangle", vol: 0.1 });
        fx.caption("the tenth Duke", { style: "whisper", ms: 1400 });
        await fx.wait(1500);
      }
    },

    // Late Spring
    {
      id: 20530,
      y: 1949,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(.95) brightness(1.08)", 6000, { fade: 700 });
        const cx = W() / 2, cy = H() * 0.45;
        const vase = fx.put(A.S("0 0 60 100", '<path d="M22 6 H38 C38 16 34 18 34 24 C52 34 54 70 42 94 H18 C6 70 8 34 26 24 C26 18 22 16 22 6 Z" fill="#cfc8b8" ' + A.ink + ' stroke-width="2"/><path d="M18 60 C26 56 34 64 42 58" stroke="#8a857a" stroke-width="2" fill="none"/>'), cx, cy, { size: 70, h: 116 });
        await fx.fadeIn(vase, 1000);
        const leaves = A.S("0 0 400 300", '<path d="M0 0 C60 60 100 30 150 90 M400 20 C340 80 300 60 250 120" stroke="rgba(40,40,40,.35)" stroke-width="6" fill="none"/>');
        const sh = fx.node(leaves, { cls: "fx-filter", style: { opacity: 0 } });
        fx.fadeIn(sh, 1500);
        fx.move(sh, [{ transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(-6px)" }], { duration: 4000 });
        fx.chord(["D4", "A4"], 4.5, { type: "sine", vol: 0.05, attack: 1.5 });
        fx.noise(4, { freq: 600, vol: 0.05, attack: 1.4 });
        await fx.wait(4200);
      }
    },

    // White Heat
    {
      id: 15794,
      y: 1949,
      run: async (fx) => {
        noir(fx, 4400);
        fx.caption("Made it, Ma!", { style: "subtitle", ms: 1500 });
        await fx.wait(1300);
        fx.caption("Top of the world!", { style: "card", ms: 1600 });
        fx.noise(0.2, { freq: 3000, vol: 0.7 });
        await fx.wait(700);
        fx.flash("#fff", 160);
        fx.flash("#ff9a2a", 500);
        fx.thud({ vol: 1, freq: 45, dur: 0.9 });
        fx.noise(1.8, { freq: 1200, sweep: 120, vol: 0.8 });
        fx.shake("lg", 1000);
        fx.buzz([200, 60, 300]);
        const r = fx.rect(fx.slot());
        const ball = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff6c0,#ff9a2a 40%,#b3402d 70%,rgba(80,30,10,0) 72%)"></div>', r.x, r.y, { size: 60 });
        await fx.move(ball, [{ transform: "scale(.2)" }, { transform: "scale(7)", opacity: 0 }], { duration: 1400, easing: "ease-out" });
        fx.particles({ kind: "rise", from: pt(r.x, r.y, 80, 20), count: 20, glyphs: dot("rgba(60,50,45,.7)"), min: 20, max: 40, dur: 1800 });
        await fx.wait(1500);
      }
    },

    // The Third Man
    {
      id: 1092,
      y: 1949,
      run: async (fx) => {
        noir(fx, 6000);
        if (!fx.reduced) fx.page([{ transform: "none" }, { transform: "rotate(-4deg)" }], { duration: 600, fill: "forwards" });
        const beat = 0.19;
        const tune = [["E5", 1], ["D5", 1], ["E5", 1], ["D5", 1], ["E5", 2], ["A4", 2], ["C5", 1], ["B4", 1], ["C5", 1], ["B4", 1], ["C5", 2], ["E4", 2], ["A4", 1], ["B4", 1], ["C5", 2], ["B4", 2], ["A4", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.06, beat, legato: 0.35, filter: { type: "bandpass", freq: 1800, q: 2 } });
        fx.seq(tune, { type: "triangle", vol: 0.08, beat, legato: 0.3 });
        const r = fx.rect(fx.slot());
        fx.put(box("background:linear-gradient(90deg, rgba(0,0,0,.9) 0 30%, transparent 30%);"), r.x, r.y, { size: r.width, h: r.height });
        await fx.wait(2400);
        const light = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle at 50% 40%, rgba(255,250,230,.95), rgba(255,250,230,.35) 40%, transparent 60%)"></div>', r.x, r.y, { size: r.width * 1.6, h: r.height * 1.4 });
        fx.tone(90, 0.3, { type: "sine", vol: 0.2 });
        await fx.fadeIn(light, 150);
        fx.costume(".reely", '<path d="M44 76 Q60 86 76 76" stroke="#1f1b16" stroke-width="3" fill="none"/>', 2400);
        await fx.wait(2200);
        await fx.fadeOut(light, 500);
        if (!fx.reduced) await fx.page([{ transform: "rotate(-4deg)" }, { transform: "none" }], { duration: 400, fill: "forwards" });
      }
    },

    // Begone Dull Care
    {
      id: 128679,
      y: 1949,
      run: async (fx) => {
        const cols = ["#e23b2e", "#f2c94c", "#2d7dd2", "#3aa655", "#f07ca8", "#fff"];
        const strip = fx.node("", { cls: "fx-filter", style: { background: "#0d0b09" } });
        await fx.fadeIn(strip, 200);
        for (let i = 0; i < 16; i++) {
          const x = fx.rand(0, W()), w = fx.rand(4, 40);
          const line = fx.put(box("background:" + fx.pick(cols) + ";border-radius:" + (i % 3 ? 0 : 50) + "%"), x, H() / 2, { size: w, h: H() * fx.rand(0.3, 1.1) });
          fx.anim(line, [{ transform: "scaleY(.1)", opacity: 1 }, { transform: "scaleY(1)", opacity: 0.9 }, { opacity: 0 }], { duration: 500 });
          fx.later(520, () => fx.remove(line));
          fx.tone(fx.pick(["C4", "Eb4", "F4", "G4", "Bb4", "C5"]), 0.16, { type: i % 2 ? "square" : "triangle", vol: 0.1, filter: { freq: 2000 } });
          fx.thud({ freq: i % 4 ? 180 : 80, vol: 0.2, dur: 0.1 });
          await fx.wait(220);
        }
        fx.particles({ kind: "burst", count: 20, glyphs: cols.map(dot), min: 6, max: 14, spread: 80, dur: 900, stagger: 0 });
        await fx.wait(800);
        await fx.fadeOut(strip, 300);
      }
    },

    // Harvey
    {
      id: 11787,
      y: 1950,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 5400, { fade: 300 });
        const r = fx.rect(fx.slot());
        const x = r.x + r.width * 0.9, y = r.y;
        const hat = fx.put(A.S("0 0 40 30", '<path d="M8 22 H32 V8 H10 Z" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><path d="M2 24 H38" ' + A.ink + '/><path d="M8 20 H32" stroke="#8a2a1a" stroke-width="3"/>'), x, y - r.height * 0.45, { size: 40, h: 30 });
        await fx.move(hat, [{ transform: "translateY(-40px)", opacity: 0 }, { transform: "none", opacity: 1 }], 600);
        fx.tone(700, 0.2, { type: "sine", vol: 0.08 });
        await fx.wait(600);
        const ear = A.S("0 0 50 70", '<path d="M14 66 C4 40 6 8 14 4 C22 8 22 40 18 66 M34 66 C30 40 32 8 40 4 C48 8 46 40 36 66" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="3"/>');
        const ears = fx.put(ear, x, y - r.height * 0.45 - 50, { size: 50, h: 70, style: { opacity: 0 } });
        fx.anim(ears, [{ opacity: 0 }, { opacity: 0.9 }, { opacity: 0 }], { duration: 1600 });
        fx.caption("Oh — have you met Harvey?", { style: "subtitle", ms: 2200 });
        fx.move(hat, [{ transform: "none" }, { transform: "rotate(-12deg) translateY(-6px)" }, { transform: "none" }], { duration: 700, delay: 800 });
        await fx.wait(2600);
      }
    },

    // Gerald McBoing-Boing
    {
      id: 46990,
      y: 1950,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("#f4f0da", 5000, { fade: 300, opacity: 0.6 });
        const boy = fx.put(A.S("0 0 40 70", '<circle cx="20" cy="14" r="10" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M10 6 C14 0 26 0 30 6" fill="#b3402d"/><rect x="10" y="26" width="20" height="26" fill="#3f7877" ' + A.ink + ' stroke-width="2"/><path d="M14 52 V68 M26 52 V68" ' + A.ink + '/><ellipse class="mouth" cx="20" cy="18" rx="3" ry="2" fill="' + A.INK + '"/>'), r.x, r.top + r.height + 40, { size: 40, h: 70 });
        const sounds = [
          () => { fx.tone(200, 0.35, { type: "sine", slide: 700, vol: 0.4 }); fx.tone(700, 0.35, { type: "sine", slide: 200, vol: 0.4, at: 0.35 }); },
          () => { fx.noise(0.3, { freq: 5000, vol: 0.6 }); fx.thud({ at: 0.05 }); },
          () => { fx.tone(1600, 0.4, { type: "square", vol: 0.12, vibrato: [22, 200] }); },
          () => { fx.tone(80, 0.5, { type: "sawtooth", vol: 0.2, slide: 50 }); fx.tone(90, 0.5, { type: "sawtooth", vol: 0.2, slide: 40, at: 0.1 }); },
          () => { fx.tone(900, 0.12, { type: "triangle", vol: 0.3 }); fx.tone(1100, 0.12, { type: "triangle", vol: 0.3, at: 0.14 }); fx.tone(1400, 0.2, { type: "triangle", vol: 0.3, at: 0.28 }); }
        ];
        const labels = ["BOING BOING", "CRASH!", "BRRRING", "TOOT", "DING!"];
        const mouth = boy.querySelector(".mouth");
        for (let i = 0; i < sounds.length; i++) {
          if (mouth) mouth.setAttribute("ry", 5);
          sounds[i]();
          fx.put('<div style="font:900 20px/1 \'Shrikhand\',Georgia,serif;color:#b3402d;white-space:nowrap;text-align:center">' + labels[i] + "</div>", r.x + fx.rand(-60, 60), r.y - 40 - i * 18, { size: 140, h: 24, ms: 700 });
          fx.move(boy, [{ transform: "none" }, { transform: "translateY(-8px)" }, { transform: "none" }], { duration: 250, fill: "none" });
          await fx.wait(700);
          if (mouth) mouth.setAttribute("ry", 2);
          await fx.wait(150);
        }
      }
    },

    // The Man in the White Suit
    {
      id: 32568,
      y: 1951,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const lab = [0, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1, 2.45, 2.8];
        const pattern = [["C5", "G4"], ["D5"], ["C5"], ["E5", "G5"]];
        lab.forEach((t, i) => fx.tone(fx.pick(pattern[i % 4]), 0.1, { type: "square", vol: 0.06, at: t, filter: { freq: 1200 } }));
        lab.forEach((t) => fx.noise(0.1, { type: "bandpass", freq: 400, q: 6, vol: 0.4, at: t + 0.18 }));
        const flask = fx.put(A.S("0 0 50 90", '<path d="M18 6 H32 V34 L46 80 C48 86 44 88 40 88 H10 C6 88 2 86 4 80 L18 34 Z" fill="rgba(230,245,255,.5)" ' + A.ink + ' stroke-width="2"/><path d="M8 70 L42 70 L46 82 C46 86 44 86 40 86 H10 C6 86 4 86 4 82 Z" fill="#fbfbf4"/>'), r.x + r.width, r.y, { size: 44, h: 80 });
        fx.particles({ kind: "rise", from: flask, count: 10, glyphs: A.bubble, min: 6, max: 12, dur: 1400, stagger: 2000 });
        await fx.wait(2400);
        A.liftSlot(fx, 2600);
        fx.style(fx.slot(), { filter: "brightness(1.35) saturate(.2)", boxShadow: "0 0 30px 8px rgba(255,255,255,.95)" }, 2600);
        fx.chord(["C5", "E5", "G5", "C6"], 1.6, { type: "sine", vol: 0.08 });
        await fx.wait(2400);
      }
    },

    // Royal Wedding
    {
      id: 18646,
      y: 1951,
      run: async (fx) => {
        fx.costume(".reely", '<path d="M40 20 H80 V-10 H44 Z" fill="#0d0b09"/><path d="M30 24 H90" stroke="#0d0b09" stroke-width="6" stroke-linecap="round"/>', 5200);
        const reely = fx.$(".reely");
        const tune = [["G4", 1], ["C5", 1], ["E5", 1], ["G5", 2], ["F5", 1], ["E5", 1], ["D5", 2], ["C5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.09, beat: 0.24 });
        for (let t = 0; t < 4; t += 0.24) fx.click({ freq: 3000, vol: 0.3, at: t });
        if (!fx.reduced && reely) {
          await fx.anim(reely, [
            { transform: "none" }, { transform: "rotate(90deg) translate(-10px, -30px)" }, { transform: "rotate(180deg) translate(0, -60px)" },
            { transform: "rotate(270deg) translate(10px, -30px)" }, { transform: "rotate(360deg)" }], { duration: 3600, easing: "ease-in-out" });
        } else await fx.wait(3600);
        fx.caption("(dancing on the ceiling)", { style: "whisper", ms: 1500 });
        await fx.wait(1400);
      }
    },

    // Strangers on a Train
    {
      id: 845,
      y: 1951,
      run: async (fx) => {
        noir(fx, 5600);
        const r = fx.rect(fx.slot());
        const lighter = fx.put(A.S("0 0 30 50", '<rect x="4" y="16" width="22" height="32" rx="3" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><path d="M8 16 V8 H22 V16" fill="#b8bec1" ' + A.ink + ' stroke-width="2"/><path d="M9 26 L21 38 M21 26 L9 38" stroke="#6b4a10" stroke-width="2"/>'), r.x, r.y + r.height / 2 + 30, { size: 30, h: 50 });
        void lighter;
        fx.tone(2200, 0.05, { type: "square", vol: 0.1 });
        fx.put(A.S("0 0 20 30", '<path d="M10 2 C16 10 16 18 10 28 C4 18 4 10 10 2 Z" fill="#ffb347"/>'), r.x, r.y + r.height / 2 + 2, { size: 16, h: 24, ms: 3000 });
        const rg = fx.rect(fx.$("#grid"));
        const horse = A.S("0 0 50 40", '<path d="M6 20 C10 12 30 12 38 16 L44 8 L48 12 L44 20 C44 24 40 26 36 26 L38 38 H34 L30 26 H16 L14 38 H10 L10 26 C6 26 4 24 6 20 Z" fill="#e8dcc8" ' + A.ink + ' stroke-width="2"/><path d="M20 12 V4" ' + A.ink + '/>');
        const n = 6;
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C6", 2], ["G5", 2]];
        fx.seq(tune.concat(tune), { type: "square", vol: 0.05, beat: 0.12, filter: { freq: 2000 } });
        const hs = [];
        for (let i = 0; i < n; i++) hs.push(fx.put(horse, rg.left + (i + 0.5) * rg.width / n, rg.top + rg.height + 20, { size: 40, h: 32 }));
        for (let k = 0; k < 16; k++) {
          hs.forEach((h, i) => { h.style.transform = fx.reduced ? "" : "translateY(" + Math.sin(k * 1.1 + i) * 8 + "px) translateX(" + (k * k * 0.9) * (i % 2 ? 1 : -1) + "px)"; });
          await fx.wait(Math.max(40, 180 - k * 10));
        }
        fx.noise(0.6, { freq: 900, vol: 0.4 });
        fx.shake("md", 400);
        await fx.wait(700);
      }
    },

    // Neighbours
    {
      id: 51406,
      y: 1952,
      run: async (fx) => {
        const cx = W() / 2, y = H() * 0.6;
        const man = (c) => A.S("0 0 30 60", '<circle cx="15" cy="8" r="7" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><rect x="6" y="16" width="18" height="24" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><path d="M10 40 L6 58 M20 40 L24 58" ' + A.ink + '/>');
        const a = fx.put(man("#2d3b55"), cx - 70, y, { size: 30, h: 60 });
        const b = fx.put(man("#6b4a2a"), cx + 70, y, { size: 30, h: 60 });
        const fl = fx.put(A.S("0 0 20 30", '<path d="M10 30 V14" stroke="#3a6a2a" stroke-width="2"/><circle cx="10" cy="8" r="6" fill="#f2c94c"/>'), cx, y + 18, { size: 20, h: 30 });
        void fl;
        const hops = [[-30, 30], [30, -30], [-10, 10], [40, -40]];
        for (let i = 0; i < 6; i++) {
          const [da, db] = hops[i % 4];
          fx.tone(fx.pick(["C4", "Eb4", "F#4", "A4"]), 0.08, { type: "square", vol: 0.12, filter: { freq: 900 } });
          fx.tone(fx.pick([60, 90]), 0.06, { type: "sawtooth", vol: 0.15, at: 0.1 });
          if (!fx.reduced) {
            a.style.transform = "translate(" + (da + i * 8) + "px," + (i % 2 ? -26 : 0) + "px)";
            b.style.transform = "translate(" + (db - i * 8) + "px," + (i % 2 ? 0 : -26) + "px)";
          }
          await fx.wait(300);
        }
        fx.caption("Love your neighbour.", { style: "card", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Ikiru
    {
      id: 3782,
      y: 1952,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 6400, { fade: 500 });
        const rg = fx.rect(fx.$("#grid"));
        const swing = fx.put(A.S("0 0 80 120", '<path d="M10 0 V100 M70 0 V100" stroke="#3b3530" stroke-width="3"/><rect x="4" y="100" width="72" height="8" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><circle cx="40" cy="80" r="9" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M28 70 C28 60 52 60 52 70 L50 100 H30 Z" fill="#3b3530"/><path d="M30 72 H50" stroke="#3b3530" stroke-width="6"/>'),
          rg.x, rg.top + rg.height * 0.4, { size: 90, h: 135, style: { transformOrigin: "50% 0" } });
        fx.move(swing, [{ transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(0)" }], { duration: 5600, easing: "ease-in-out" });
        const tune = [["E4", 2], ["G4", 1], ["A4", 1], ["B4", 2], ["A4", 1], ["G4", 1], ["E4", 2], ["D4", 2], ["E4", 4]];
        fx.seq(tune, { type: "sine", vol: 0.1, beat: 0.4, vibrato: [4, 3], attack: 0.1 });
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 4, max: 9, dur: 3800, stagger: 3000 });
        await fx.wait(5600);
      }
    },

    // High Noon
    {
      id: 288,
      y: 1952,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2) brightness(1.1)", 6200, { fade: 300 });
        const clock = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="#f4efe2" ' + A.ink + ' stroke-width="4"/><path class="m" d="M50 50 L50 14" ' + A.ink + ' stroke-width="4"/><path d="M50 50 L50 24" ' + A.ink + ' stroke-width="6"/><circle cx="50" cy="50" r="4" fill="' + A.INK + '"/>'), W() / 2, H() * 0.3, { size: 120 });
        const m = clock.querySelector(".m");
        if (m) m.setAttribute("transform", "rotate(-36 50 50)");
        for (let i = 0; i < 6; i++) {
          fx.click({ freq: 1000, vol: 0.5 });
          if (m) m.setAttribute("transform", "rotate(" + (-36 + (i + 1) * 6) + " 50 50)");
          await fx.wait(620);
        }
        fx.chord(["C4", "G4", "C5"], 1.8, { type: "sine", vol: 0.12 });
        fx.tone(98, 1.6, { type: "triangle", vol: 0.3 });
        fx.tone(196, 1.6, { type: "sine", vol: 0.15 });
        fx.buzz([80, 400, 80]);
        fx.tone(1300, 1.2, { type: "sine", vol: 0.05, slide: 900, at: 1.1 });
        fx.particles({ kind: "sweep", count: 2, glyphs: A.tumbleweed, min: 40, max: 60, dur: 2400, stagger: 400, spin: 720 });
        await fx.wait(2400);
      }
    },

    // Ugetsu
    {
      id: 14696,
      y: 1953,
      run: async (fx) => {
        fx.filter("grayscale(1) brightness(.95)", 6000, { fade: 700 });
        fx.wash("linear-gradient(transparent 55%, rgba(220,225,230,.85))", 6000, { fade: 1200 });
        const boat = A.S("0 0 120 50", '<path d="M4 30 C20 44 100 44 116 30 Z" fill="#2b2622"/><path d="M60 30 V2" stroke="#2b2622" stroke-width="3"/><circle cx="40" cy="22" r="5" fill="#2b2622"/><path d="M34 30 C34 24 46 24 46 30" fill="#2b2622"/><path d="M96 30 L108 8" stroke="#2b2622" stroke-width="2.5"/>');
        fx.noise(5.4, { freq: 500, vol: 0.08, attack: 1 });
        fx.seq([["E5", 3], ["B4", 2], ["C5", 1], ["A4", 4], [null, 2], ["E5", 2], ["F5", 2], ["E5", 4]], { type: "sine", vol: 0.09, beat: 0.3, vibrato: [4, 8], attack: 0.2 });
        fx.particles({ kind: "drift", area: pt(W() / 2, H() * 0.75, W(), H() * 0.3), count: 16, glyphs: dot("rgba(255,255,255,.5)"), min: 30, max: 70, dur: 3000, stagger: 2000 });
        await fx.fly(boat, [-100, H() * 0.72], [W() + 100, H() * 0.72], { size: 130, h: 54, dur: 5200, easing: "linear" });
      }
    },

    // Duck Amuck
    {
      id: 53210,
      y: 1953,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const brush = A.S("0 0 20 80", '<rect x="7" y="20" width="6" height="58" fill="#b07a38" ' + A.ink + ' stroke-width="1.5"/><path d="M5 20 C5 6 10 0 10 0 C10 0 15 6 15 20 Z" fill="#0d0b09"/>');
        const b = fx.put(brush, r.x + r.width / 2 + 20, r.y - 40, { size: 20, h: 80 });
        const bgs = ["#f2c94c", "#8fd0ff", "#f4efe2", "#3aa655"];
        const cov = fx.put(box("border-radius:6px;opacity:.8"), r.x, r.y, { size: r.width, h: r.height });
        for (let i = 0; i < 4; i++) {
          fx.noise(0.3, { type: "bandpass", freq: 1200 + i * 300, q: 3, vol: 0.5 });
          await fx.move(b, [{ transform: "none" }, { transform: "translate(-" + r.width * 0.6 + "px," + r.height * 0.3 + "px) rotate(-40deg)" }, { transform: "none" }], 450);
          cov.firstChild.style.background = bgs[i];
          await fx.wait(250);
        }
        fx.caption("Ain't it the truth?", { style: "subtitle", ms: 1400 });
        const er = A.S("0 0 30 20", '<rect x="2" y="2" width="26" height="16" rx="3" fill="#f07ca8" ' + A.ink + ' stroke-width="2"/>');
        await fx.fly(er, [r.x + 30, r.y - 30], [r.x - 30, r.y + 30], { size: 30, h: 20, dur: 700 });
        fx.remove(cov);
        fx.remove(b);
        fx.put('<div style="font:900 22px/1 Georgia,serif;color:#1f1b16;background:#fff;padding:4px;border:3px double #1f1b16">THAT\'S ALL FOLKS?</div>', r.x, r.y, { size: 180, h: 40, ms: 1200 });
        fx.tone(300, 0.5, { type: "sine", slide: 150, vol: 0.2 });
        await fx.wait(1300);
      }
    },

    // Robot Monster
    {
      id: 43353,
      y: 1953,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 5600, { fade: 300 });
        const ro = fx.put(A.S("0 0 80 120",
          '<path d="M14 50 C10 30 20 22 40 22 C60 22 70 30 66 50 L72 110 H8 Z" fill="#3b3530"/><path d="M4 60 C0 80 8 90 14 80 M76 60 C80 80 72 90 66 80" stroke="#3b3530" stroke-width="10" stroke-linecap="round"/>' +
          '<circle cx="40" cy="16" r="16" fill="rgba(200,220,230,.6)" ' + A.ink + ' stroke-width="2"/><path d="M40 0 V-8" stroke="#1f1b16" stroke-width="2"/><circle cx="40" cy="-10" r="3" fill="#ccc"/><rect x="30" y="10" width="20" height="10" fill="#8e969a"/>'),
          W() + 60, H() * 0.55, { size: 110, h: 165 });
        fx.move(ro, [{ transform: "none" }, { transform: "translateX(-" + (W() / 2 + 60) + "px)" }], { duration: 2400, easing: "steps(10)" });
        for (let t = 0; t < 4.8; t += 0.4) fx.particles({ kind: "rise", from: pt(W() / 2, H() * 0.6, W() * 0.6, 10), count: 3, glyphs: A.bubble, min: 10, max: 18, dur: 1400, stagger: 100 });
        fx.tone(220, 4.5, { type: "sine", vol: 0.1, vibrato: [7, 60] });
        fx.tone(330, 4.5, { type: "sine", vol: 0.04, vibrato: [5, 90] });
        await fx.wait(2600);
        fx.caption("I must. But I cannot.", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Tokyo Story
    {
      id: 18148,
      y: 1953,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(.95)", 6600, { fade: 700 });
        if (!fx.reduced) fx.page([{ transform: "none" }, { transform: "scale(.97) translateY(12px)" }], { duration: 1200, fill: "forwards" });
        const rg = fx.rect(fx.$("#grid"));
        const fan = fx.put(A.S("0 0 80 50", '<path d="M40 46 L4 12 C24 -2 56 -2 76 12 Z" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 7 }, (_, i) => '<path d="M40 46 L' + (8 + i * 11) + " " + (i === 0 || i === 6 ? 12 : 4) + '" stroke="#8a857a" stroke-width="1.5"/>').join("")), rg.x, rg.top + rg.height + 30, { size: 80, h: 50, style: { transformOrigin: "50% 92%" } });
        for (let i = 0; i < 6; i++) {
          fx.later(i * 700, () => fx.move(fan, [{ transform: "rotate(-14deg)" }, { transform: "rotate(14deg)" }, { transform: "rotate(-14deg)" }], 700));
          fx.noise(0.3, { freq: 700, vol: 0.06, at: i * 0.7 });
        }
        fx.tone(210, 1.2, { type: "sine", vol: 0.04, at: 1.6 });
        fx.tone(160, 1.2, { type: "sine", vol: 0.03, at: 3.6 });
        fx.seq([["D4", 2], ["E4", 2], ["G4", 4], ["A4", 2], ["G4", 2], ["E4", 4]], { type: "triangle", vol: 0.06, beat: 0.28, at: 0.4 });
        await fx.wait(4400);
        if (!fx.reduced) await fx.page([{ transform: "scale(.97) translateY(12px)" }, { transform: "none" }], { duration: 800, fill: "forwards" });
      }
    },

    // The Wages of Fear
    {
      id: 204,
      y: 1953,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15)", 6400, { fade: 300 });
        const truck = A.S("0 0 120 60", '<path d="M4 44 V18 H70 V44 Z" fill="#6a5d50" ' + A.ink + '/><path d="M70 44 V24 H96 L110 34 V44 Z" fill="#4a443c" ' + A.ink + '/><rect x="80" y="26" width="12" height="8" fill="#cfd4d6"/><circle cx="24" cy="48" r="9" fill="#1d1a18"/><circle cx="92" cy="48" r="9" fill="#1d1a18"/><text x="10" y="36" font-size="10" font-family="Georgia" fill="#f2c94c">NITRO</text>');
        const y = H() - 80;
        const t = fx.put(truck, -70, y, { size: 120, h: 60 });
        fx.tone(70, 5, { type: "sawtooth", vol: 0.08, filter: { freq: 200 }, attack: 0.3 });
        for (let i = 0; i < 10; i++) {
          const dx = (W() + 140) * (i + 1) / 10;
          if (!fx.reduced) t.style.transform = "translateX(" + dx + "px) rotate(" + (i % 3 - 1) * 1.5 + "deg)";
          fx.buzz(i === 6 ? [30, 20, 30] : 5);
          if (i === 6) { fx.thud({ freq: 110, vol: 0.4 }); fx.caption("…gently…", { style: "whisper", ms: 900 }); await fx.wait(1100); }
          await fx.wait(360);
        }
        fx.chord(["C4", "E4", "G4"], 1, { type: "triangle", vol: 0.08 });
        await fx.wait(700);
      }
    },

    // Mr. Hulot's Holiday
    {
      id: 778,
      y: 1953,
      run: async (fx) => {
        fx.filter("grayscale(1) brightness(1.08)", 6000, { fade: 300 });
        fx.wash("linear-gradient(transparent 70%, rgba(200,215,225,.6))", 6000, { fade: 500 });
        const door = fx.put(A.S("0 0 60 90", '<rect x="4" y="4" width="52" height="82" fill="#e6e1d6" ' + A.ink + '/><rect x="12" y="12" width="36" height="30" fill="rgba(200,220,235,.7)" ' + A.ink + ' stroke-width="2"/><circle cx="46" cy="52" r="3" fill="' + A.INK + '"/>'), W() * 0.7, H() * 0.45, { size: 60, h: 90, style: { transformOrigin: "0 50%" } });
        for (let i = 0; i < 5; i++) {
          fx.later(i * 1000, () => {
            fx.move(door, [{ transform: "perspective(300px) rotateY(0)" }, { transform: "perspective(300px) rotateY(-60deg)" }, { transform: "perspective(300px) rotateY(0)" }], 700);
            fx.tone(i % 2 ? 180 : 240, 0.25, { type: "triangle", vol: 0.3, slide: i % 2 ? 260 : 150, vibrato: [30, 20] });
          });
        }
        const car = A.car("#d9d0b8");
        fx.later(2000, () => {
          for (let k = 0; k < 6; k++) fx.noise(0.08, { freq: 400, vol: 0.4, at: k * 0.25 });
          fx.fly(car, [-80, H() - 60], [W() + 80, H() - 60], { size: 80, h: 36, dur: 2600, easing: "steps(18)" });
        });
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 2], ["E5", 2], ["F5", 1], ["D5", 1], ["C5", 4]], { type: "triangle", vol: 0.07, beat: 0.28 });
        await fx.wait(5200);
      }
    }
  ]);
})();
