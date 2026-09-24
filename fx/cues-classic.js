/* Machine FX cues - classics, epics, sci-fi and drama.
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
  const streak = (c) => '<div class="fx-streak" style="height:100%;background:' + (c || "#dfe9ff") + '"></div>';

  M.register([
    // Citizen Kane
    {
      id: 15,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const globe = fx.put(A.S("0 0 80 90",
          '<circle cx="40" cy="38" r="34" fill="rgba(220,240,255,.35)" stroke="#fff" stroke-width="3"/>' +
          '<path d="M26 56 L34 34 L40 42 L46 30 L54 56 Z" fill="#fbf4e2" ' + A.ink + ' stroke-width="2"/>' +
          '<path d="M14 64 H66 L72 86 H8 Z" fill="#6b4a2a" ' + A.ink + '/>'), r.x, r.y, { size: 90, h: 100 });
        fx.particles({ kind: "fall", area: pt(r.x, r.y - 14, 56, 60), count: 16, glyphs: dot(), min: 2, max: 4, dur: 1500, stagger: 1100 });
        await fx.wait(1900);
        const drop = fx.reduced ? 0 : H() - r.y - 70;
        await fx.move(globe, [{ transform: "none" }, { transform: "translateY(" + drop + "px) rotate(35deg)" }], { duration: 650, easing: "cubic-bezier(.55,0,1,.6)" });
        fx.remove(globe);
        fx.noise(0.3, { type: "highpass", freq: 3500, vol: 0.5 });
        fx.noise(0.6, { type: "bandpass", freq: 7000, q: 3, vol: 0.25, at: 0.06 });
        fx.buzz(25);
        await fx.particles({ kind: "burst", from: pt(r.x, r.y + drop), count: 16, spread: 30, gravity: 30, dur: 700, stagger: 0, glyphs: dot("#e6f4ff"), min: 3, max: 7 });
      }
    },

    // The Wizard of Oz
    {
      id: 630,
      run: async (fx) => {
        const f = fx.filter("sepia(1) saturate(.55) contrast(1.05)");
        await fx.wait(1100);
        [0, 0.3, 0.6].forEach((t) => fx.click({ freq: 2600, vol: 0.7, at: t }));
        fx.particles({ kind: "burst", from: pt(W() / 2, H() - 70), count: 12, spread: 30, dur: 900, stagger: 600, glyphs: A.sparkle("#e0303a"), min: 8, max: 14 });
        await fx.wait(1100);
        fx.chord(["C5", "E5", "G5", "C6"], 1.6, { attack: 0.3, vol: 0.1, type: "triangle" });
        await fx.anim(f, [{ backdropFilter: "sepia(1) saturate(.55) contrast(1.05)", webkitBackdropFilter: "sepia(1) saturate(.55) contrast(1.05)" },
          { backdropFilter: "sepia(0) saturate(1.5) contrast(1)", webkitBackdropFilter: "sepia(0) saturate(1.5) contrast(1)" }], { duration: fx.reduced ? 10 : 1400 });
        await fx.wait(500);
      }
    },

    // Gone with the Wind
    {
      id: 770,
      run: async (fx) => {
        const sky = fx.node(A.S("0 0 400 300",
          '<path d="M0 250 C40 244 60 236 90 240 L96 196 C90 180 110 172 104 160 C120 150 118 132 132 140 C140 150 150 160 146 176 L150 240 C220 236 300 250 400 244 V300 H0 Z" fill="#1a0c08"/>' +
          '<path d="M232 244 L236 214 L240 212 L244 244 Z M246 244 L248 220 L252 218 L256 244 Z" fill="#1a0c08"/>'),
        { cls: "fx-filter", style: { background: "linear-gradient(#f6b24a, #d8572a 55%, #6e1b12)", mixBlendMode: "multiply", opacity: 0 } });
        fx.chord(["G3", "D4", "B4"], 3, { attack: 0.8, vol: 0.08, type: "sawtooth", filter: { freq: 900 } });
        await fx.fadeIn(sky, 800);
        await fx.wait(1800);
        await fx.fadeOut(sky, 900);
      }
    },

    // Casablanca
    {
      id: 289,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.1)", 4200, { fade: 400 });
        const fog = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(ellipse at 50% 110%, rgba(230,230,230,.75), transparent 60%)", opacity: 0 } });
        fx.fadeIn(fog, 900);
        const beam = fx.node("", { style: { position: "absolute", left: "50%", bottom: "-10%", width: "36vmax", height: "140vmax", marginLeft: "-18vmax", transformOrigin: "50% 100%", background: "linear-gradient(to top, rgba(255,255,240,.55), transparent 80%)", clipPath: "polygon(46% 100%, 54% 100%, 100% 0, 0 0)" } });
        fx.tone(58, 3.4, { type: "sawtooth", vol: 0.12, attack: 0.6, filter: { freq: 300 }, vibrato: [11, 3] });
        await fx.anim(beam, [{ transform: "rotate(-55deg)" }, { transform: "rotate(55deg)" }], { duration: fx.reduced ? 3600 : 3600, easing: "ease-in-out" });
        await fx.fadeOut(fog, 400);
      }
    },

    // Singin' in the Rain
    {
      id: 872,
      run: async (fx) => {
        fx.particles({ kind: "fall", count: 60, glyphs: streak("#cfe3ff"), min: 12, max: 22, dur: 700, stagger: 3000, wind: -30 });
        const umb = A.S("0 0 80 90", '<path d="M4 36 C4 10 76 10 76 36 C70 30 62 30 58 36 C52 30 46 30 40 36 C34 30 28 30 22 36 C18 30 10 30 4 36 Z" fill="' + A.INK + '"/><path d="M40 14 V80 C40 88 30 88 30 80" ' + A.ink + ' fill="none"/>');
        const y = H() - 120;
        const trip = fx.fly(umb, [-60, y], [W() + 60, y], { size: 80, h: 90, dur: 3000, via: [W() / 2, y - 60], r0: -15, r1: 20, r2: -10, easing: "ease-in-out" });
        for (let i = 0; i < 10; i++) fx.click({ freq: 1600 + (i % 2) * 500, vol: 0.4, at: 0.3 + i * 0.26 });
        await trip;
      }
    },

    // Sunset Boulevard
    {
      id: 599,
      run: async (fx) => {
        const s = A.liftSlot(fx);
        if (!s) return;
        const r = fx.rect(s);
        const dim = fx.wash("rgba(10,8,6,.7)", 0);
        fx.fadeIn(dim, 600);
        fx.chord(["A3", "C#4", "E4", "G#4"], 3, { attack: 1, vol: 0.07, type: "triangle" });
        fx.style(s, { filter: "drop-shadow(0 0 18px rgba(255,240,200,.8)) contrast(1.1) blur(.3px)" });
        await fx.move(s, [{ transform: "none" }, { transform: "translate(" + (W() / 2 - r.x) + "px," + (H() / 2 - r.y) + "px) scale(2.1)" }], { duration: 2200, easing: "ease-in-out" });
        await fx.wait(fx.reduced ? 2400 : 900);
        fx.fadeOut(dim, 500);
        await fx.move(s, [{ transform: "translate(" + (W() / 2 - r.x) + "px," + (H() / 2 - r.y) + "px) scale(2.1)" }, { transform: "none" }], { duration: 500, easing: "ease-in" });
      }
    },

    // Psycho
    {
      id: 539,
      run: async (fx) => {
        const curtain = fx.glass('<div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg, rgba(255,255,255,.88) 0 14px, rgba(220,230,235,.8) 14px 22px);"></div>' +
          '<div style="position:absolute;left:0;right:0;top:4px;height:10px;background:radial-gradient(circle, transparent 3px, #bbb 3.5px 5px, transparent 5.5px) 0 0/22px 10px repeat-x;"></div>');
        if (!curtain) return;
        await fx.move(curtain, [{ transform: "translateX(-100%)" }, { transform: "none" }], { duration: 260, easing: "ease-out" });
        for (let i = 0; i < 4; i++) {
          fx.tone(1900 + i * 90, 0.16, { type: "sawtooth", slide: 1500, vol: 0.28, at: i * 0.2, filter: { type: "highpass", freq: 900 } });
        }
        fx.shake("sm", 800);
        await fx.wait(1000);
        await fx.move(curtain, [{ transform: "none" }, { transform: "translateX(100%)" }], { duration: 300, easing: "ease-in" });
        fx.remove(curtain);
        const r = fx.rect(fx.slot());
        const drain = fx.put(A.S("0 0 100 100", '<path d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a14 14 0 1 1 -14 -14 a22 22 0 1 1 22 22 a32 32 0 1 1 -32 -32" fill="none" stroke="#1f1b16" stroke-width="3" opacity=".7"/>'), r.x, r.y, { size: Math.min(r.width, r.height) });
        fx.noise(1.4, { freq: 500, sweep: 150, vol: 0.2 });
        await fx.anim(drain, [{ transform: "rotate(0) scale(1)", opacity: 1 }, { transform: "rotate(-720deg) scale(.2)", opacity: 0 }], { duration: 1500, easing: "ease-in" });
      }
    },

    // Vertigo
    {
      id: 426,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const spiral = fx.put(A.S("0 0 100 100", '<path d="M50 50 m0 -3 a3 3 0 1 1 -3 3 a6 6 0 1 1 6 6 a10 10 0 1 1 -10 -10 a15 15 0 1 1 15 15 a21 21 0 1 1 -21 -21 a28 28 0 1 1 28 28 a36 36 0 1 1 -36 -36" fill="none" stroke="#d6423a" stroke-width="3.5"/>'), r.x, r.y, { size: Math.max(r.width, r.height) * 1.6 });
        [0, 0.5, 1, 1.5].forEach((t, i) => fx.tone(i % 2 ? "Eb5" : "C5", 0.45, { at: t, type: "triangle", vol: 0.12, slide: i % 2 ? "C5" : "Eb5" }));
        fx.move(fx.$(".machine"), [{ transform: "scale(1)" }, { transform: "scale(1.05) perspective(600px) rotateX(4deg)" }, { transform: "scale(1)" }], { duration: 2400, easing: "ease-in-out" });
        await fx.anim(spiral, [{ transform: "rotate(0) scale(.3)", opacity: 0 }, { opacity: 0.9, offset: 0.2 }, { opacity: 0.9, offset: 0.8 }, { transform: "rotate(1080deg) scale(1)", opacity: 0 }], { duration: 2600 });
      }
    },

    // The Birds
    {
      id: 571,
      run: async (fx) => {
        const edges = [fx.rect("body > header"), fx.rect(".machine-marquee"), fx.rect(".cta-sign")];
        const birds = [];
        const n = fx.reduced ? 6 : 13;
        for (let i = 0; i < n; i++) {
          const e = edges[i % edges.length];
          const x = e.left + 14 + Math.random() * Math.max(10, e.width - 28);
          const b = fx.put(A.crow, x, e.top - 9, { size: 30, h: 20 });
          if (Math.random() < 0.5) b.firstChild.style.transform = "scaleX(-1)";
          birds.push(b);
          fx.fadeIn(b, 120);
          await fx.wait(220);
        }
        await fx.wait(1300);
        fx.noise(0.9, { type: "bandpass", freq: 900, q: 0.8, vol: 0.5 });
        fx.buzz([20, 30, 20]);
        await Promise.all(birds.map((b) => {
          b.innerHTML = A.crowFly;
          const dx = (Math.random() - 0.5) * W();
          return fx.move(b, [{ transform: "none" }, { transform: "translate(" + dx + "px," + -(H() * 0.8) + "px) scale(1.4)" }], { duration: 900 + Math.random() * 500, easing: "ease-in" }).then(() => fx.reduced && fx.fadeOut(b, 300));
        }));
      }
    },

    // Rear Window
    {
      id: 567,
      run: async (fx) => {
        const lens = fx.node("", { cls: "fx-filter" });
        const slots = fx.$$("#grid .slot");
        const target = fx.rect(fx.slot());
        const stops = [fx.rect(slots[0]), fx.rect(slots[3] || slots[0]), fx.rect(slots[10] || slots[0]), target];
        const rad = Math.min(W(), 480) * 0.17;
        const paint = (x, y) => (lens.style.background = "radial-gradient(circle " + rad + "px at " + x + "px " + y + "px, transparent 96%, #0b0907 100%)");
        paint(stops[0].x, stops[0].y);
        fx.tone(1200, 0.05, { type: "square", vol: 0.1 });
        for (let i = 1; i < stops.length; i++) {
          const a = stops[i - 1], b = stops[i];
          if (fx.reduced) paint(b.x, b.y);
          else await fx.tween(650, (p) => paint(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p), (p) => p * p * (3 - 2 * p));
          fx.click({ freq: 1800, vol: 0.4 });
          await fx.wait(450);
        }
        await fx.wait(900);
        await fx.fadeOut(lens, 400);
      }
    },

    // North by Northwest
    {
      id: 213,
      run: async (fx) => {
        fx.tone(95, 3, { type: "sawtooth", vol: 0.14, attack: 0.8, vibrato: [22, 6], filter: { freq: 700 } });
        fx.later(1100, () => fx.cls(".reely", "hop", 600));
        const ground = H() - 70;
        fx.particles({ kind: "burst", from: pt(W() * 0.5, ground), count: 10, spread: 30, gravity: -20, dur: 1200, stagger: 900, glyphs: dot("#c7ad7a"), min: 8, max: 16 });
        await fx.fly(A.plane, [W() + 80, 40], [-100, ground - 40], { size: 90, h: 45, dur: 2600, via: [W() * 0.45, ground - 20], flip: false, easing: "ease-in-out" });
      }
    },

    // Lawrence of Arabia
    {
      id: 947,
      run: async (fx) => {
        const dark = fx.wash("rgba(8,6,4,.9)", 0);
        const match = fx.put(A.S("0 0 40 120", '<rect x="18" y="40" width="4" height="78" fill="#caa56a"/><ellipse cx="20" cy="38" rx="5" ry="6" fill="#7a2b1a"/><path d="M20 4 C30 18 28 32 20 36 C12 32 10 18 20 4 Z" fill="#ffcf5a"/><path d="M20 16 C25 24 24 31 20 34 C16 31 15 24 20 16 Z" fill="#fff4c2"/>'), W() / 2, H() / 2, { size: 40, h: 120 });
        fx.move(match.firstChild, [{ transform: "scaleY(1)" }, { transform: "scaleY(1.06) skewX(3deg)" }, { transform: "scaleY(.96)" }], { duration: 300, iterations: 6 });
        await fx.wait(1500);
        fx.noise(0.25, { freq: 900, vol: 0.4 });
        fx.remove(match);
        fx.remove(dark);
        const desert = fx.node(A.S("0 0 400 300", '<rect width="400" height="300" fill="url(#d)"/><defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf6b"/><stop offset=".6" stop-color="#ff8a2a"/><stop offset=".61" stop-color="#b0561c"/><stop offset="1" stop-color="#6f3312"/></linearGradient></defs><circle cx="200" cy="183" r="46" fill="#fff0b0"/><path d="M0 184 C80 170 140 190 200 180 C280 168 330 190 400 178 V300 H0 Z" fill="#a44e18"/>'), { cls: "fx-filter", style: { display: "flex" } });
        desert.firstChild.setAttribute("preserveAspectRatio", "xMidYMid slice");
        desert.firstChild.style.cssText = "width:100%;height:100%";
        fx.noise(2.6, { freq: 400, vol: 0.18, attack: 0.8 });
        await fx.wait(2000);
        await fx.fadeOut(desert, 700);
      }
    },

    // Ben-Hur
    {
      id: 665,
      run: async (fx) => {
        for (let i = 0; i < 18; i++) fx.thud({ freq: 110 + (i % 2) * 30, vol: 0.35, at: i * 0.12, dur: 0.12 });
        fx.noise(2.4, { freq: 600, vol: 0.2, pan: -1, panTo: 1 });
        fx.shake("sm", 2000);
        await fx.particles({ kind: "sweep", area: pt(W() / 2, H() - 50, W(), 60), count: 40, stagger: 1500, dur: 900, glyphs: dot("rgba(196,170,120,.8)"), min: 14, max: 34 });
      }
    },

    // Seven Samurai
    {
      id: 346,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.25)", 3200, { fade: 300 });
        fx.noise(3, { freq: 2500, vol: 0.22, attack: 0.3 });
        await fx.particles({ kind: "fall", count: 90, glyphs: streak("rgba(235,240,255,.85)"), min: 20, max: 36, dur: 450, stagger: 2600, wind: -120 });
      }
    },

    // Rashomon
    {
      id: 548,
      run: async (fx) => {
        const light = fx.node("", { cls: "fx-filter", style: { mixBlendMode: "soft-light", opacity: 0, background: "radial-gradient(circle 60px at 20% 30%, #fff 0, transparent 70%), radial-gradient(circle 90px at 70% 20%, #fff 0, transparent 70%), radial-gradient(circle 70px at 40% 70%, #fff 0, transparent 70%), radial-gradient(circle 110px at 85% 75%, #fff 0, transparent 70%), rgba(0,0,0,.35)" } });
        fx.fadeIn(light, 600);
        await fx.move(light, [{ transform: "translate(0,0)" }, { transform: "translate(18px,-10px)" }, { transform: "translate(-12px,8px)" }, { transform: "translate(6px,4px)" }], { duration: 3000, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(2500);
        await fx.fadeOut(light, 600);
      }
    },

    // Metropolis
    {
      id: 19,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("grayscale(.8) contrast(1.2)", 3000, { fade: 300 });
        fx.noise(2.4, { type: "bandpass", freq: 3000, q: 6, vol: 0.12 });
        fx.tone(60, 2.4, { type: "square", vol: 0.06, filter: { freq: 200 } });
        const rings = [];
        for (let i = 0; i < 5; i++) {
          const ring = fx.put('<div style="width:100%;height:100%;border-radius:50%;border:3px solid #e8f4ff;box-shadow:0 0 12px #bfe0ff, inset 0 0 8px #bfe0ff"></div>', r.x, r.top + r.height, { size: r.width * 1.5, h: r.width * 0.45 });
          rings.push(fx.anim(ring, [{ transform: "translateY(0)", opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: "translateY(" + -r.height + "px)", opacity: 0 }], { duration: 1400, delay: i * 320, iterations: fx.reduced ? 1 : 1, fill: "both" }));
        }
        await Promise.all(rings);
      }
    },

    // Nosferatu (1922)
    {
      id: 653,
      run: async (fx) => {
        fx.wash("rgba(40,70,140,.55)", 3600, { blend: "multiply", fade: 500 });
        const m = fx.rect(".machine");
        const shadow = fx.put(A.S("0 0 80 200", '<path d="M40 14 C30 14 26 24 30 34 C20 40 16 60 18 90 L10 200 H64 L58 100 C62 70 60 44 50 36 C56 24 50 14 40 14 Z M30 12 L26 2 L34 10 M50 12 L54 2 L46 10 M18 70 C4 60 0 40 4 22 M4 22 L0 12 M4 22 L6 10 M4 22 L10 12 M4 22 L12 16" fill="#000" stroke="#000" stroke-width="3" stroke-linecap="round"/>'), m.left + m.width - 30, m.top + m.height * 0.7, { size: 90, h: 230, style: { opacity: 0.8 } });
        fx.tone(49, 3.2, { type: "sawtooth", vol: 0.08, attack: 1, filter: { freq: 220 } });
        await fx.move(shadow, [{ transform: "translateY(0)" }, { transform: "translateY(" + -(m.height * 0.5) + "px)" }], { duration: 3000, easing: "steps(12)" });
        if (fx.reduced) await fx.wait(2400);
        await fx.fadeOut(shadow, 400);
      }
    },

    // King Kong (1933)
    {
      id: 244,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15)", 4000, { fade: 300 });
        const h = fx.rect("body > header");
        const small = A.S("0 0 60 30", '<rect x="10" y="12" width="36" height="7" rx="3" fill="#333"/><rect x="22" y="2" width="8" height="26" rx="2" fill="#555"/><rect x="12" y="4" width="28" height="4" fill="#444"/><path d="M46 14 L56 8 L56 22 Z" fill="#333"/>');
        fx.tone(140, 3.6, { type: "sawtooth", vol: 0.08, vibrato: [30, 8], filter: { freq: 900 } });
        const lap = (delay, flip) => fx.wait(delay).then(() => fx.fly(small, [flip ? W() + 40 : -40, h.top + 10], [flip ? -40 : W() + 40, h.top + h.height * 0.2], { size: 40, h: 20, via: [W() / 2, h.top + h.height + 30], dur: 2200, flip: !flip }));
        await Promise.all([lap(0, false), lap(900, true)]);
      }
    },

    // Frankenstein (1931)
    {
      id: 3035,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bolt = (x) => '<svg viewBox="0 0 100 400" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M' + x + ' 0 L' + (x - 18) + ' 110 L' + (x + 14) + ' 130 L' + (x - 22) + ' 260 L' + (x + 10) + ' 280 L50 400" stroke="#eaf6ff" stroke-width="5" fill="none" style="filter:drop-shadow(0 0 6px #9fd3ff)"/></svg>';
        fx.filter("grayscale(1) brightness(.7)", 3000);
        for (let i = 0; i < 2; i++) {
          const b = fx.node(bolt(40 + i * 20), { style: { position: "absolute", left: r.x - r.width / 2 + "px", top: 0, width: r.width + "px", height: r.y + "px" }, ms: 180 });
          fx.flash("#dff1ff", 160);
          fx.noise(0.5, { type: "highpass", freq: 1500, vol: 0.45 });
          fx.thud({ vol: 0.5 });
          fx.buzz(40);
          await fx.wait(520);
          fx.remove(b);
        }
        await fx.wait(700);
        fx.move(fx.slot(), [{ transform: "rotate(0)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(0)" }], { duration: 360, easing: "steps(4)" });
        fx.tone(70, 0.4, { type: "square", vol: 0.15 });
        await fx.wait(600);
      }
    },

    // Godzilla (1954)
    {
      id: 1678,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 4200, { fade: 300 });
        for (let i = 0; i < 3; i++) {
          fx.thud({ freq: 70, vol: 0.5 + i * 0.2, dur: 0.6 });
          fx.shake(i === 2 ? "lg" : "md", 350);
          fx.buzz(60 + i * 30);
          await fx.wait(800);
        }
        fx.tone(900, 1.6, { type: "sawtooth", slide: 420, vol: 0.2, vibrato: [18, 25], filter: { type: "bandpass", freq: 1400, q: 2 } });
        fx.noise(1.5, { type: "bandpass", freq: 1200, q: 3, vol: 0.2 });
        await fx.wait(1800);
      }
    },

    // Godzilla (2014)
    {
      id: 124905,
      run: async (fx) => {
        const dark = fx.wash("rgba(4,10,24,.75)", 0);
        fx.fadeIn(dark, 500);
        const spikes = [];
        for (let i = 0; i < 6; i++) {
          const x = W() * 0.25 + i * (W() * 0.1);
          spikes.push(fx.put(A.S("0 0 40 60", '<path d="M4 60 L20 2 L36 60 Z" fill="#0d1b2a" stroke="#7fdcff" stroke-width="2"/>'), x, H() - 30 - Math.sin(i / 5 * Math.PI) * 30, { size: 40, h: 60 }));
        }
        fx.tone(55, 3, { type: "sawtooth", vol: 0.14, attack: 0.5, filter: { freq: 260 } });
        for (let i = 0; i < spikes.length; i++) {
          fx.style(spikes[i], { filter: "drop-shadow(0 0 10px #7fdcff) brightness(2)" });
          fx.tone(300 + i * 80, 0.25, { type: "triangle", vol: 0.1 });
          await fx.wait(260);
        }
        const beam = fx.node("", { style: { position: "absolute", left: 0, right: 0, top: H() * 0.45 + "px", height: "22px", background: "linear-gradient(#bff4ff, #4fc6ff)", boxShadow: "0 0 30px 12px #4fc6ff" } });
        fx.noise(1.2, { freq: 3000, sweep: 800, vol: 0.4 });
        await fx.anim(beam, [{ transform: "scaleX(0)", transformOrigin: "0 50%" }, { transform: "scaleX(1)", transformOrigin: "0 50%" }], { duration: 400 });
        fx.shake("md", 600);
        await fx.wait(700);
        fx.remove(beam);
        await fx.fadeOut(dark, 500);
      }
    },

    // The Day the Earth Stood Still (1951)
    {
      id: 828,
      run: async (fx) => {
        fx.freeze(3400);
        const m = fx.rect(".machine-marquee");
        const visor = fx.node("", { style: { position: "absolute", left: m.left + "px", top: m.y - 3 + "px", width: m.width + "px", height: "6px" } });
        const glow = fx.node("", { parent: visor, style: { position: "absolute", top: 0, width: "30px", height: "6px", background: "#fff", borderRadius: "3px", boxShadow: "0 0 14px 6px #bfe8ff" } });
        fx.tone(220, 3, { type: "sine", vol: 0.08, vibrato: [5, 8], attack: 0.5 });
        await fx.move(glow, [{ transform: "translateX(0)" }, { transform: "translateX(" + (m.width - 30) + "px)" }, { transform: "translateX(0)" }], { duration: 2400, easing: "ease-in-out" });
        await fx.wait(fx.reduced ? 2400 : 900);
      }
    },

    // Planet of the Apes (1968)
    {
      id: 871,
      run: async (fx) => {
        const beach = fx.node(A.S("0 0 400 140",
          '<path d="M300 140 L306 60 L300 56 L304 40 C300 30 310 24 316 30 L322 20 L326 34 L334 26 L334 38 L344 36 L338 46 L342 60 L336 64 L338 140 Z" fill="#6f8f82" stroke="#1f1b16" stroke-width="3"/>' +
          '<path d="M318 30 L316 4 L322 2 L324 28 Z" fill="#6f8f82" stroke="#1f1b16" stroke-width="3"/><path d="M314 4 C316 -6 326 -6 326 2" fill="#d9a13a" stroke="#1f1b16" stroke-width="2"/>' +
          '<path d="M0 104 C80 96 160 110 240 100 C300 94 350 110 400 102 V140 H0 Z" fill="#d8c08a" stroke="#1f1b16" stroke-width="3"/>'),
        { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "38vh" } });
        beach.firstChild.setAttribute("preserveAspectRatio", "xMaxYMax meet");
        beach.firstChild.style.cssText = "width:100%;height:100%";
        fx.noise(4, { freq: 700, vol: 0.18, attack: 1 });
        await fx.move(beach, [{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 1600, easing: "ease-out" });
        await fx.wait(2600);
        await fx.fadeOut(beach, 700);
      }
    },

    // Butch Cassidy and the Sundance Kid
    {
      id: 642,
      run: async (fx) => {
        fx.freeze(3000);
        fx.click({ freq: 1200, vol: 0.6 });
        const f = fx.filter("sepia(0)");
        await fx.anim(f, [{ backdropFilter: "sepia(0)", webkitBackdropFilter: "sepia(0)" }, { backdropFilter: "sepia(1) contrast(1.1) brightness(.95)", webkitBackdropFilter: "sepia(1) contrast(1.1) brightness(.95)" }], { duration: 1200 });
        await fx.wait(1700);
      }
    },

    // Goodfellas
    {
      id: 769,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        fx.click({ freq: 4000, vol: 0.7 });
        fx.noise(0.08, { freq: 1500, vol: 0.4, at: 0.05 });
        const r = fx.rect(s);
        const frame = fx.put("", r.x, r.y, { size: r.width + 16, h: r.height + 16, style: { border: "8px solid #fff", boxShadow: "3px 4px 0 #1f1b16" } });
        fx.flash("#fff", 200);
        fx.freeze(2000);
        await fx.wait(2000);
        fx.fadeOut(frame, 200);
        await fx.wait(220);
      }
    },

    // The Godfather
    {
      id: 238,
      run: async (fx) => {
        fx.filter("sepia(.45) brightness(.55) contrast(1.15)", 4200, { fade: 700 });
        const s = A.liftSlot(fx, 4200);
        const r = fx.rect(s);
        fx.style(s, { filter: "brightness(1.1)" }, 4200);
        const strings = fx.node(A.S("0 0 100 100", '<g stroke="#e8dfc8" stroke-width=".5">' +
          '<path d="M30 0 L20 100"/><path d="M50 0 L50 100"/><path d="M70 0 L80 100"/></g>'),
        { style: { position: "absolute", left: r.x - r.width * 0.6 + "px", top: 0, width: r.width * 1.2 + "px", height: r.top + 8 + "px", transformOrigin: "50% 0" } });
        strings.firstChild.setAttribute("preserveAspectRatio", "none");
        strings.firstChild.style.cssText = "width:100%;height:100%";
        fx.tone("C3", 3.6, { type: "sawtooth", vol: 0.05, attack: 1.2, filter: { freq: 400 } });
        await fx.move(strings, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 1500, easing: "ease-out" });
        fx.move(s, [{ transform: "translateY(0)" }, { transform: "translateY(-6px) rotate(-1deg)" }, { transform: "translateY(0)" }, { transform: "translateY(-4px) rotate(1deg)" }, { transform: "none" }], { duration: 1600 });
        await fx.wait(fx.reduced ? 3200 : 2200);
      }
    },

    // Schindler's List
    {
      id: 424,
      run: async (fx) => {
        A.liftSlot(fx, 4500);
        fx.filter("grayscale(1)", 4500, { fade: 1000 });
        await fx.wait(4500);
      }
    },

    // Saving Private Ryan
    {
      id: 857,
      run: async (fx) => {
        fx.filter("grayscale(.85) contrast(1.2) brightness(.9)", 3500, { fade: 300 });
        fx.noise(3, { freq: 180, vol: 0.35, attack: 0.02 });
        fx.tone(3900, 3.2, { vol: 0.05, attack: 0.4 });
        fx.shake("md", 1400);
        fx.buzz([80, 60, 40]);
        await fx.wait(3500);
      }
    },

    // Apocalypse Now
    {
      id: 28,
      run: async (fx) => {
        fx.wash("rgba(230,120,40,.35)", 4000, { blend: "multiply", fade: 600 });
        const blades = fx.node('<div style="position:absolute;left:50%;top:50%;width:200vmax;height:7vmax;margin:-3.5vmax 0 0 -100vmax;background:rgba(10,6,2,.35);filter:blur(6px)"></div><div style="position:absolute;left:50%;top:50%;width:7vmax;height:200vmax;margin:-100vmax 0 0 -3.5vmax;background:rgba(10,6,2,.35);filter:blur(6px)"></div>', { cls: "fx-filter" });
        for (let i = 0; i < 22; i++) fx.noise(0.12, { freq: 160, vol: 0.45 - i * 0.012, at: i * 0.16 });
        await fx.move(blades, [{ transform: "rotate(0)" }, { transform: "rotate(270deg)" }], { duration: 3600, easing: "linear" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // One Flew Over the Cuckoo's Nest
    {
      id: 510,
      run: async (fx) => {
        const crack = fx.glass(A.S("0 0 100 100", '<g stroke="#fff" stroke-width=".7" fill="none" opacity=".9"><path d="M50 45 L20 5 M50 45 L85 10 M50 45 L95 60 M50 45 L60 100 M50 45 L10 80 M50 45 L0 40"/><path d="M40 32 L58 30 L64 50 L48 60 L36 52 Z M30 18 L70 20 L78 58 L52 76 L22 62 Z"/></g>'));
        if (crack) crack.firstChild.setAttribute("preserveAspectRatio", "none"), crack.firstChild.style.cssText = "width:100%;height:100%";
        fx.noise(0.5, { type: "highpass", freq: 2500, vol: 0.6 });
        fx.thud({ vol: 0.5 });
        fx.shake("md", 300);
        await fx.wait(700);
        const light = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(120deg, rgba(255,246,210,.75), transparent 55%)", mixBlendMode: "screen", opacity: 0 } });
        fx.chord(["D4", "A4", "F#5"], 2.4, { attack: 0.8, vol: 0.07 });
        await fx.fadeIn(light, 900);
        await fx.wait(1200);
        await fx.fadeOut(light, 700);
      }
    },

    // Rain Man
    {
      id: 380,
      run: async (fx) => {
        fx.particles({ kind: "fall", count: 60, glyphs: '<div style="width:2px;height:100%;margin:auto;background:#d8b98a;border-radius:1px"></div>', min: 14, max: 20, dur: 900, stagger: 300, spin: 360 });
        for (let i = 0; i < 20; i++) fx.click({ freq: 5000, vol: 0.12, at: 0.5 + Math.random() * 0.6 });
        await fx.wait(1300);
        fx.marquee("246", 2000);
        fx.tone(880, 0.08, { type: "square", vol: 0.1 });
        await fx.wait(2000);
      }
    },

    // Taxi Driver
    {
      id: 103,
      run: async (fx) => {
        fx.wash("rgba(255,200,40,.18)", 3500, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "rise", area: pt(W() / 2, H() - 20, W() * 0.8, 10), count: 18, glyphs: dot("rgba(255,255,255,.55)"), min: 50, max: 110, dur: 3000, stagger: 1500, fadeIn: true, cls: "fx-blur" });
        fx.noise(3, { freq: 900, vol: 0.12, attack: 0.5 });
        await fx.wait(900);
        fx.move("body > header", [{ transform: "scaleX(1)" }, { transform: "scaleX(-1)", offset: 0.15 }, { transform: "scaleX(-1)", offset: 0.85 }, { transform: "scaleX(1)" }], { duration: 1800 });
        await fx.wait(2400);
      }
    },

    // Scarface (1983)
    {
      id: 111,
      run: async (fx) => {
        const blimp = A.S("0 0 220 70",
          '<ellipse cx="100" cy="30" rx="96" ry="26" fill="#d9d4c8" ' + A.ink + '/><rect x="80" y="54" width="36" height="10" rx="3" fill="#8a8274" ' + A.ink + ' stroke-width="2"/>' +
          '<path d="M190 18 L216 6 L214 30 Z M190 42 L216 54 L214 30 Z" fill="#d9d4c8" ' + A.ink + '/>' +
          '<text x="100" y="36" text-anchor="middle" font-family="Limelight, Georgia" font-size="13" fill="#ff5a9e" style="filter:drop-shadow(0 0 3px #ff5a9e)">THE WORLD IS YOURS</text>');
        fx.tone(120, 4, { type: "sawtooth", vol: 0.05, filter: { freq: 400 }, vibrato: [8, 2] });
        await fx.fly(blimp, [W() + 130, 70], [-130, 50], { size: 220, h: 70, dur: 5200 });
      }
    },

    // The Good, the Bad and the Ugly
    {
      id: 429,
      run: async (fx) => {
        fx.letterbox(4000, "24vh");
        fx.wash("rgba(230,170,90,.22)", 4000, { blend: "multiply" });
        fx.tone(1400, 1.2, { vol: 0.08, slide: 1800, attack: 0.3, at: 0.4 });
        fx.noise(3.6, { type: "bandpass", freq: 700, q: 2, vol: 0.14, attack: 1 });
        await fx.fly(A.tumbleweed, [-50, H() * 0.74], [W() + 50, H() * 0.74], { size: 46, dur: 3400, via: [W() / 2, H() * 0.7], r0: 0, r1: 360, r2: 720 });
      }
    },

    // Dr. Strangelove
    {
      id: 935,
      run: async (fx) => {
        const bomb = A.S("0 0 50 110", '<path d="M25 20 C38 20 40 40 40 70 C40 90 34 100 25 104 C16 100 10 90 10 70 C10 40 12 20 25 20 Z" fill="#6f7a6a" ' + A.ink + '/><path d="M18 20 L14 6 H36 L32 20" fill="#6f7a6a" ' + A.ink + ' stroke-width="2"/>' +
          '<path d="M18 52 C20 42 30 42 32 52" fill="' + A.INK + '"/><circle cx="25" cy="36" r="6" fill="' + A.INK + '"/><path d="M15 32 H35 L31 26 H19 Z" fill="#6a4a2a"/>');
        fx.tone(1900, 1.6, { slide: 350, vol: 0.12, attack: 0.1 });
        await fx.fly(bomb, [W() * 0.55, -60], [W() * 0.5, H() * 0.7], { size: 44, h: 96, dur: 1600, easing: "cubic-bezier(.5,0,1,1)", r0: 15, r2: 8 });
        fx.flash("#fff", 700);
        fx.thud({ freq: 50, vol: 0.9, dur: 1.4 });
        fx.noise(1.8, { freq: 300, sweep: 60, vol: 0.5 });
        fx.shake("lg", 800);
        fx.buzz(200);
        await fx.wait(1500);
      }
    },

    // 2001: A Space Odyssey
    {
      id: 62,
      run: async (fx) => {
        const reely = fx.rect(".reely");
        const mono = fx.put('<div style="width:100%;height:100%;background:linear-gradient(90deg,#0b0b0b,#262626 40%,#0b0b0b);border-radius:1px;box-shadow:0 0 14px rgba(255,255,255,.25)"></div>', reely.x + reely.width * 0.75, reely.top + reely.height * 0.55, { size: 26, h: 64 });
        ["C4", "Db4", "Eb4", "E4", "Gb4", "G4", "Ab4"].forEach((n, i) => fx.tone(n, 3.2, { vol: 0.05, attack: 1.2, vibrato: [5 + i, 3], type: "sine" }));
        await fx.move(mono, [{ transform: "translateY(40px) scaleY(0)", transformOrigin: "50% 100%" }, { transform: "none", transformOrigin: "50% 100%" }], { duration: 1600, easing: "ease-out" });
        await fx.wait(fx.reduced ? 2000 : 1400);
        fx.remove(mono);
        const eye = fx.node('<div style="width:30px;height:30px;border-radius:50%;background:radial-gradient(circle, #ffe08a 0 2px, #ff2a1a 3px, #9b0d05 9px, #2a0402 14px);box-shadow:0 0 18px 6px rgba(255,40,20,.6), 0 0 0 3px #bbb, 0 0 0 5px #333"></div>', { parent: ".machine-marquee", style: { position: "absolute", left: "50%", top: "50%", marginLeft: "-15px", marginTop: "-15px", zIndex: 3 } });
        fx.style(".machine-marquee .marquee-text, .machine-marquee .marquee-sub", { visibility: "hidden" });
        fx.tone(60, 2.8, { vol: 0.12, attack: 0.3 });
        await fx.anim(eye, [{ opacity: 0.6 }, { opacity: 1 }, { opacity: 0.7 }, { opacity: 1 }], { duration: 2800 });
      }
    },

    // The Shining
    {
      id: 694,
      run: async (fx) => {
        const carpet = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='56' viewBox='0 0 48 56'%3E%3Crect width='48' height='56' fill='%23a3371e'/%3E%3Cpath d='M24 4 L42 14 V38 L24 48 L6 38 V14 Z' fill='none' stroke='%23e0862f' stroke-width='6'/%3E%3Cpath d='M24 16 L32 21 V33 L24 38 L16 33 V21 Z' fill='%234a1d10'/%3E%3C/svg%3E\")";
        const rug = fx.glass("", { style: { backgroundImage: carpet, backgroundSize: "36px 42px", opacity: 0 } });
        fx.style(".machine-marquee .marquee-text", { transform: "scaleX(-1)", display: "block" });
        if (rug) await fx.fadeIn(rug, 300);
        // tricycle: wheels loud on wood, silent on carpet, loud again
        const pattern = [0, 0.18, 0.36, 0.54, 1.5, 1.68, 1.86, 2.04];
        pattern.forEach((t, i) => fx.thud({ freq: 160 + (i % 3) * 20, vol: 0.3, dur: 0.1, at: t }));
        await fx.wait(2800);
        if (rug) await fx.fadeOut(rug, 300);
      }
    },

    // A Clockwork Orange
    {
      id: 185,
      run: async (fx) => {
        fx.costume(".reely",
          '<path d="M60 49 L58 42 M64 48 L64 41 M68 48 L70 41 M72 49 L76 43 M75 52 L80 48" stroke="#1f1b16" stroke-width="1.6" stroke-linecap="round"/>' +
          '<ellipse cx="60" cy="21" rx="27" ry="5" fill="#1f1b16"/><path d="M42 21 C42 2 78 2 78 21 Z" fill="#1f1b16"/>', 4200);
        await fx.wait(900);
        fx.tempo(4, 1600);
        for (let i = 0; i < 14; i++) fx.tone(["C5", "E5", "G5", "C6"][i % 4], 0.08, { type: "square", vol: 0.06, at: i * 0.1 });
        await fx.wait(3200);
      }
    },

    // Jaws
    {
      id: 578,
      run: async (fx) => {
        const y = H() - 40;
        const water = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "46px", background: "linear-gradient(rgba(63,120,140,.0), rgba(40,90,120,.55))" } });
        fx.fadeIn(water, 500);
        let t = 0, gap = 0.62;
        for (let i = 0; i < 12; i++) {
          fx.tone(i % 2 ? "F2" : "E2", Math.min(0.35, gap * 0.8), { type: "sawtooth", vol: 0.3, at: t, filter: { freq: 400 } });
          t += gap;
          gap = Math.max(0.14, gap * 0.84);
        }
        const trip = fx.fly(A.fin, [-60, y], [W() + 60, y], { size: 84, h: 50, dur: t * 1000 + 200, via: [W() * 0.4, y + 4], easing: "ease-in" });
        await fx.wait(t * 1000);
        fx.shake("lg", 450);
        fx.buzz([60, 40, 120]);
        fx.thud({ freq: 60, vol: 0.8 });
        await trip;
        await fx.fadeOut(water, 300);
      }
    },

    // E.T. the Extra-Terrestrial
    {
      id: 601,
      run: async (fx) => {
        const size = Math.min(W(), H()) * 0.55;
        const cx = W() * 0.6, cy = H() * 0.32;
        const night = fx.wash("rgba(10,20,50,.78)", 0);
        fx.fadeIn(night, 500);
        const moon = fx.put(A.moon, cx, cy, { size });
        fx.fadeIn(moon, 500);
        fx.chord(["C5", "G5", "E6"], 3, { attack: 0.8, vol: 0.06, type: "triangle" });
        await fx.wait(500);
        await fx.fly(A.bikeET, [-80, cy + size * 0.3], [W() + 80, cy - size * 0.45], { size: size * 0.55, h: size * 0.37, dur: 2800, via: [cx, cy], easing: "ease-in-out" });
        fx.fadeOut(moon, 500);
        await fx.fadeOut(night, 500);
      }
    },

    // Close Encounters of the Third Kind
    {
      id: 840,
      run: async (fx) => {
        const notes = ["G4", "A4", "F4", "F3", "C4"];
        const colors = ["#ff5a5a", "#ffd24a", "#6aff8a", "#5ab4ff", "#d17bff"];
        const beat = 0.5;
        fx.seq(notes.map((n, i) => [n, i === 4 ? 2.5 : 1]), { beat, type: "triangle", vol: 0.28, attack: 0.05 });
        const dim = fx.wash("rgba(0,0,10,.45)", 0);
        for (let i = 0; i < 5; i++) {
          const x = W() * (0.18 + i * 0.16);
          const light = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:' + colors[i] + ';box-shadow:0 0 30px 12px ' + colors[i] + '"></div>', x, 60 + Math.abs(2 - i) * 12, { size: 34 });
          fx.anim(light, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 0.35 }], { duration: 1600 });
          await fx.wait(beat * 1000);
        }
        await fx.wait(1300);
        await fx.fadeOut(dim, 400);
      }
    },

    // Alien
    {
      id: 348,
      run: async (fx) => {
        const box = fx.glass('<div class="fx-scanlines" style="position:absolute;inset:0;background-color:rgba(4,20,8,.88)"></div>' +
          '<svg viewBox="0 0 100 100" style="position:absolute;left:50%;top:50%;width:70%;max-width:260px;transform:translate(-50%,-50%);overflow:visible">' +
          '<g fill="none" stroke="#5dff8a" stroke-width=".6" opacity=".6"><path d="M50 95 A45 45 0 0 1 5 50 M50 95 A45 45 0 0 0 95 50 M50 95 A30 30 0 0 1 20 65 M50 95 A30 30 0 0 0 80 65 M50 95 A15 15 0 0 1 35 80 M50 95 A15 15 0 0 0 65 80 M50 95 L50 10"/></g>' +
          '<circle class="blip" cx="50" cy="12" r="3" fill="#aaffbf"/></svg>');
        if (!box) return;
        const blip = box.querySelector(".blip");
        let t = 0;
        const beeps = [1, 0.8, 0.62, 0.48, 0.36, 0.26, 0.2, 0.15];
        beeps.forEach((g) => { fx.tone(1250, 0.07, { type: "sine", vol: 0.25, at: t }); t += g; });
        await fx.tween(t * 1000, (p) => blip.setAttribute("cy", 12 + p * 76));
        fx.remove(box);
        fx.wash("#000", 1100);
        await fx.wait(1100);
      }
    },

    // The Terminator
    {
      id: 218,
      run: async (fx) => {
        fx.wash("rgba(220,20,20,.38)", 3600, { blend: "multiply", fade: 200 });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 3600 });
        const r = fx.rect(fx.slot());
        const box = fx.put('<div style="width:100%;height:100%;border:2px solid #fff;box-shadow:0 0 6px #fff"></div>', r.x, r.y, { size: r.width * 3, h: r.height * 3 });
        const lines = fx.node("", { style: { position: "absolute", left: "8px", top: "18vh", font: "11px 'Special Elite', monospace", color: "#fff", whiteSpace: "pre", lineHeight: "1.4", textShadow: "0 0 4px #fff" } });
        await fx.move(box, [{ transform: "scale(1)" }, { transform: "scale(.36)" }], { duration: 700, easing: "steps(6)" });
        fx.style(box, { transform: "scale(.36)" });
        for (let i = 0; i < 6; i++) {
          lines.textContent += (Math.random().toString(16).slice(2, 10).toUpperCase() + " " + (1000 + Math.floor(Math.random() * 8999))) + "\n";
          fx.tone(2200, 0.03, { type: "square", vol: 0.06 });
          await fx.wait(170);
        }
        fx.tone(440, 0.4, { type: "square", vol: 0.08 });
        await fx.wait(1500);
      }
    },

    // Terminator 2: Judgment Day
    {
      id: 280,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        fx.style(s, { filter: "grayscale(1) contrast(1.6) brightness(1.3)" }, 2400);
        fx.tone(300, 1.8, { type: "sine", vol: 0.12, slide: 120, vibrato: [7, 30] });
        await fx.move(s, [{ transform: "none" }, { transform: "scale(1.04,.94) skewX(3deg)" }, { transform: "scale(.96,1.05) skewX(-3deg)" }, { transform: "none" }], { duration: 1600, easing: "ease-in-out" });
        await fx.wait(fx.reduced ? 2400 : 900);
        const molten = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "16vh", background: "linear-gradient(transparent, rgba(255,120,20,.55) 40%, rgba(255,210,90,.8))" } });
        fx.fadeIn(molten, 400);
        const thumb = fx.put('<div style="font-size:52px;line-height:1;filter:grayscale(1) brightness(.8)">👍</div>', W() / 2, H() - 50, { size: 60 });
        fx.noise(2.4, { freq: 300, vol: 0.2, attack: 0.3 });
        await fx.move(thumb, [{ transform: "translateY(-60px)" }, { transform: "translateY(0)" }, { transform: "translateY(90px)" }], { duration: 2400, easing: "ease-in" });
        if (fx.reduced) await fx.wait(2000);
        await fx.fadeOut(molten, 400);
      }
    },

    // Blade Runner
    {
      id: 78,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        fx.wash("rgba(20,40,80,.45)", 3800, { blend: "multiply", fade: 300 });
        const r = fx.rect(s);
        const grid = fx.put('<div style="width:100%;height:100%;background:linear-gradient(90deg, transparent 49.6%, #bfffe0 49.6% 50.4%, transparent 50.4%), linear-gradient(transparent 49.6%, #bfffe0 49.6% 50.4%, transparent 50.4%);border:1px solid #bfffe0;box-shadow:0 0 6px #bfffe0"></div>', r.x, r.y, { size: r.width * 1.1, h: r.height * 1.1 });
        let scale = 1;
        for (let i = 0; i < 3; i++) {
          [0, 0.06, 0.12, 0.18].forEach((t) => fx.tone(1600 + i * 200, 0.04, { type: "square", vol: 0.07, at: t }));
          fx.tone(90, 0.2, { type: "square", vol: 0.12, at: 0.3 });
          await fx.wait(550);
          scale += 0.35;
          fx.move(s, [{ transform: "scale(" + (scale - 0.35) + ")" }, { transform: "scale(" + scale + ")" }], { duration: 250, easing: "steps(3)" });
          await fx.wait(450);
        }
        await fx.wait(700);
        fx.remove(grid);
        await fx.move(s, [{ transform: "scale(" + scale + ")" }, { transform: "none" }], { duration: 300 });
      }
    },

    // Blade Runner 2049
    {
      id: 335984,
      run: async (fx) => {
        const haze = fx.wash("linear-gradient(#ffb04a, #d9661e)", 0, { blend: "multiply", opacity: 0.001 });
        fx.chord(["C2", "G2", "D3"], 4, { type: "sawtooth", vol: 0.08, attack: 1.2, filter: { freq: 380 } });
        await fx.anim(haze, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 1200 });
        fx.particles({ kind: "drift", count: 30, glyphs: dot("rgba(255,220,160,.8)"), min: 2, max: 5, dur: 2400, stagger: 800 });
        await fx.wait(2200);
        await fx.fadeOut(haze, 900);
      }
    },

    // Star Wars (1977)
    {
      id: 11,
      run: async (fx) => {
        const space = fx.wash("#000", 0);
        fx.particles({ kind: "drift", count: 50, glyphs: dot(), min: 1, max: 3, dur: 5200, stagger: 200 });
        const crawl = fx.node('<div style="position:absolute;left:50%;bottom:-40%;width:min(90vw,420px);transform:translateX(-50%);color:#ffd23f;font:700 20px/1.35 Bitter, Georgia, serif;text-align:justify;">' +
          '<div style="text-align:center;margin-bottom:10px">SLOT ' + (fx.slotIndex + 1) + '<br>A NEW FEATURE</div>' +
          "It is a period of movie night. Rebel snackers, striking from a hidden couch, have won their first victory against the evil Remote. During the battle, a lone slot managed to secure the plans to tonight's showing.</div>",
        { cls: "fx-filter", style: { perspective: "300px", overflow: "hidden" } });
        const inner = crawl.firstChild;
        inner.style.transformOrigin = "50% 100%";
        if (fx.reduced) {
          inner.style.bottom = "20%";
          inner.style.transform = "translateX(-50%) rotateX(25deg)";
          await fx.wait(4000);
        } else {
          await fx.anim(inner, [{ transform: "translateX(-50%) rotateX(25deg) translateY(0)" }, { transform: "translateX(-50%) rotateX(25deg) translateY(-110vh)" }], { duration: 5200, easing: "linear" });
        }
        fx.remove(crawl);
        fx.tone(90, 0.6, { type: "sawtooth", slide: 140, vol: 0.2, filter: { freq: 600 } });
        fx.tone(140, 1, { type: "sawtooth", vol: 0.12, at: 0.5, vibrato: [4, 3], filter: { freq: 500 } });
        await fx.fadeOut(space, 600);
      }
    },

    // The Empire Strikes Back
    {
      id: 1891,
      run: async (fx) => {
        const glow = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(ellipse at 50% 20%, rgba(200,0,0,.45), transparent 60%)", opacity: 0 } });
        for (let i = 0; i < 2; i++) {
          fx.noise(1.1, { type: "bandpass", freq: 700, q: 1.5, vol: 0.35, attack: 0.5, at: i * 2.2 });
          fx.noise(0.9, { type: "bandpass", freq: 500, q: 1.5, vol: 0.28, attack: 0.3, at: i * 2.2 + 1.2 });
        }
        await fx.anim(glow, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0 }], { duration: 4400 });
      }
    },

    // Return of the Jedi
    {
      id: 1892,
      run: async (fx) => {
        const bg = fx.wash("#02030a", 0);
        fx.particles({ kind: "drift", count: 40, glyphs: dot(), min: 1, max: 3, dur: 3000, stagger: 200 });
        const ds = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="40" fill="#8a8f95"/><circle cx="36" cy="36" r="8" fill="#5d6166"/><path d="M10 50 H90" stroke="#5d6166" stroke-width="1.5"/><path d="M60 10 C90 30 90 70 60 90" fill="#6d7277" opacity=".7"/>'), W() / 2, H() * 0.4, { size: 110 });
        await fx.wait(1200);
        fx.flash("#fff", 300);
        fx.remove(ds);
        A.ring(fx, W() / 2, H() * 0.4, { size: Math.max(W(), H()) * 1.4, color: "#c9e4ff", width: 10, dur: 1200 });
        fx.noise(1.6, { freq: 1200, sweep: 80, vol: 0.5 });
        fx.shake("md", 500);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.4), count: 30, spread: 120, dur: 1200, stagger: 0, glyphs: A.star("#ffc86a"), min: 6, max: 14 });
        await fx.wait(1600);
        await fx.fadeOut(bg, 400);
      }
    },

    // The Matrix
    {
      id: 603,
      run: async (fx) => {
        const glass = fx.glass("", { style: { background: "rgba(0,12,0,.92)" } });
        if (!glass) return;
        const cols = 16;
        for (let c = 0; c < cols; c++) {
          const col = document.createElement("div");
          let s = "";
          for (let i = 0; i < 26; i++) s += String.fromCharCode(0x30a0 + Math.floor(Math.random() * 90)) + "\n";
          col.textContent = s;
          col.style.cssText = "position:absolute;top:0;left:" + (c / cols * 100) + "%;width:" + (100 / cols) + "%;font:13px/1.05 monospace;white-space:pre;text-align:center;color:#4dff6a;text-shadow:0 0 5px #2bff4a;";
          glass.appendChild(col);
          fx.move(col, [{ transform: "translateY(-100%)" }, { transform: "translateY(100%)" }], { duration: 1500 + Math.random() * 1500, delay: Math.random() * 600, iterations: 2 });
        }
        for (let i = 0; i < 12; i++) fx.tone(1500 + Math.random() * 1500, 0.03, { type: "square", vol: 0.04, at: i * 0.2 });
        await fx.wait(2600);
        fx.remove(glass);
        const y = fx.rect(".cta-stage").top - 20;
        await fx.fly(A.cat, [-50, y], [W() + 50, y], { size: 50, h: 32, dur: 1300 });
        await fx.wait(250);
        await fx.fly(A.cat, [-50, y], [W() + 50, y], { size: 50, h: 32, dur: 1300 });
      }
    },

    // The Matrix Reloaded
    {
      id: 604,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const clones = [];
        const n = fx.reduced ? 4 : 10;
        fx.wash("rgba(40,120,50,.25)", 3200, { blend: "multiply" });
        for (let i = 0; i < n; i++) {
          const c = s.cloneNode(true);
          c.removeAttribute("onclick");
          const holder = fx.put("", r.x + (Math.random() - 0.5) * W() * 0.8, r.y + (Math.random() - 0.5) * H() * 0.5, { size: r.width, h: r.height });
          c.style.cssText = "width:100%;height:100%;margin:0;pointer-events:none;box-shadow:3px 3px 0 #1f1b16;filter:grayscale(.4) hue-rotate(60deg)";
          holder.appendChild(c);
          clones.push(holder);
          fx.anim(holder, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], { duration: 160 });
          fx.tone(200 + i * 30, 0.1, { type: "square", vol: 0.06 });
          await fx.wait(170);
        }
        await fx.wait(1100);
        clones.forEach((c) => fx.fadeOut(c, 250));
        await fx.wait(300);
      }
    },

    // Back to the Future
    {
      id: 105,
      run: async (fx) => {
        let speed = 0;
        fx.marquee("0 MPH", 0);
        const t0 = 1600;
        fx.tone(80, t0 / 1000, { type: "sawtooth", slide: 400, vol: 0.12, filter: { freq: 900 } });
        await fx.tween(t0, (p) => {
          const v = Math.round(p * 88);
          if (v !== speed) { speed = v; fx.$(".machine-marquee .marquee-text").textContent = v + " MPH"; }
        }, (p) => p * p);
        fx.flash("#bfe6ff", 250);
        fx.noise(0.4, { type: "highpass", freq: 2000, vol: 0.5 });
        fx.thud({ vol: 0.7 });
        fx.buzz(80);
        const trail = (y) => fx.node('<div style="position:absolute;left:0;top:' + y + 'px;width:100%;height:14px;background:linear-gradient(90deg, transparent, #ff7a1a 20%, #ffd76a 50%, #ff7a1a 80%, transparent);filter:blur(1px);box-shadow:0 0 14px #ff7a1a"></div>');
        const y = fx.rect(".cta-stage").top - 10;
        const a = trail(y), b = trail(y + 36);
        fx.later(2400, () => { fx.fadeOut(a, 600); fx.fadeOut(b, 600); });
        await fx.wait(3100);
      }
    },

    // Back to the Future Part II
    {
      id: 165,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        fx.marquee("OCT 21 2015", 3200);
        fx.tone(180, 3, { type: "sine", vol: 0.1, vibrato: [3, 12], attack: 0.3 });
        fx.style(s, { boxShadow: "3px 14px 10px rgba(80,160,255,.6)" }, 3200);
        await fx.move(s, [{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(-6px)" }, { transform: "translateY(-11px)" }, { transform: "translateY(0)" }], { duration: 3000, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Inception
    {
      id: 27205,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const top = fx.put(A.top, r.x, r.top + r.height - 30, { size: 36, h: 46 });
        fx.tone(2200, 3, { type: "sine", vol: 0.04, vibrato: [40, 20] });
        if (fx.reduced) {
          await fx.wait(2600);
        } else {
          await fx.anim(top, [
            { transform: "rotate(0deg) scaleX(1)" }, { transform: "rotate(3deg) scaleX(-1)" }, { transform: "rotate(-3deg) scaleX(1)" },
            { transform: "rotate(5deg) scaleX(-1)" }, { transform: "rotate(-7deg) scaleX(1)" }, { transform: "rotate(9deg) scaleX(-1)" }
          ], { duration: 2800, easing: "linear" });
        }
        // ...and cut before we find out.
        fx.wash("#000", 700);
        await fx.wait(700);
      }
    },

    // Interstellar
    {
      id: 157336,
      run: async (fx) => {
        const rows = fx.reduced ? 5 : 11;
        const dust = fx.node("", { cls: "fx-filter" });
        for (let i = 0; i < rows; i++) {
          if (Math.random() < 0.4) continue;
          const band = document.createElement("div");
          band.style.cssText = "position:absolute;top:0;left:" + (i / rows * 100 + 2) + "%;width:" + (100 / rows * (Math.random() < 0.5 ? 0.3 : 0.7)) + "%;height:100%;background:linear-gradient(rgba(220,200,160,.0), rgba(220,200,160,.5), rgba(220,200,160,0));";
          dust.appendChild(band);
          fx.move(band, [{ transform: "translateY(-100%)" }, { transform: "translateY(100%)" }], { duration: 2600, delay: i * 60 });
        }
        fx.chord(["A2", "E3", "A3", "C#4"], 3.8, { type: "sawtooth", vol: 0.05, attack: 1.4, filter: { freq: 700 } });
        for (let i = 0; i < 4; i++) fx.click({ freq: 2200, vol: 0.4, at: i * 1.25 });
        await fx.wait(4200);
      }
    },

    // Titanic
    {
      id: 597,
      run: async (fx) => {
        fx.wash("rgba(80,130,190,.28)", 4200, { blend: "multiply", fade: 600 });
        fx.tone("F2", 1.4, { type: "sawtooth", vol: 0.14, filter: { freq: 300 }, attack: 0.1 });
        fx.tone("A2", 1.4, { type: "sawtooth", vol: 0.1, filter: { freq: 300 }, attack: 0.1 });
        fx.later(3000, () => fx.noise(1, { type: "bandpass", freq: 900, q: 1, vol: 0.12 }));
        const frost = fx.glass("", { style: { boxShadow: "inset 0 0 30px 12px rgba(235,248,255,.85)", opacity: 0 } });
        if (frost) fx.fadeIn(frost, 2000);
        await fx.move(".machine", [{ transform: "rotate(0) translateY(0)" }, { transform: "rotate(-4deg) translateY(6px)", offset: 0.7 }, { transform: "rotate(0) translateY(0)" }], { duration: 4000, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3600);
      }
    },

    // Avatar
    {
      id: 19995,
      run: async (fx) => {
        const night = fx.wash("rgba(4,16,40,.75)", 0);
        fx.fadeIn(night, 600);
        fx.style(".machine-marquee .marquee-text", { fontFamily: "Papyrus, fantasy", letterSpacing: "0.1em", color: "#7ff5ff" }, 4200);
        fx.particles({ kind: "rise", count: 16, glyphs: '<svg viewBox="0 0 20 20"><g stroke="#e8fbff" stroke-width="1" fill="none"><path d="M10 10 L10 2 M10 10 L3 5 M10 10 L17 5 M10 10 L2 11 M10 10 L18 11 M10 10 L6 17 M10 10 L14 17"/></g><circle cx="10" cy="10" r="2" fill="#fff"/></svg>', min: 16, max: 26, dur: 4000, stagger: 1200, wind: 30 });
        fx.chord(["E4", "B4", "F#5"], 3.6, { type: "sine", vol: 0.06, attack: 1 });
        await fx.wait(3600);
        await fx.fadeOut(night, 600);
      }
    },

    // Forrest Gump
    {
      id: 13,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.seq([["C5", 2], ["E5", 1], ["G5", 3], ["F5", 2], ["E5", 4]], { beat: 0.3, type: "triangle", vol: 0.06, attack: 0.08 });
        const x0 = W() * 0.8;
        const f = fx.put(A.feather, x0, -60, { size: 30, h: 76 });
        if (fx.reduced) {
          f.style.transform = "translate(" + (r.x - x0) + "px," + (r.y + 60) + "px)";
          await fx.fadeIn(f, 500);
          await fx.wait(2200);
        } else {
          await fx.anim(f, [
            { transform: "translate(0,0) rotate(20deg)" },
            { transform: "translate(" + (-W() * 0.5) + "px," + H() * 0.2 + "px) rotate(-30deg)" },
            { transform: "translate(" + (-W() * 0.1) + "px," + H() * 0.35 + "px) rotate(25deg)" },
            { transform: "translate(" + (r.x - x0) + "px," + (r.y + 60) + "px) rotate(80deg)" }
          ], { duration: 4200, easing: "ease-in-out" });
          await fx.wait(900);
        }
        await fx.fadeOut(f, 500);
      }
    },

    // The Lord of the Rings: The Fellowship of the Ring
    {
      id: 120,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const ring = fx.put(A.ringGold, r.x, r.y - 20, { size: 44 });
        A.sparkleOn(fx, pt(r.x, r.y - 20), 8, "#fff6c0");
        await fx.move(ring, [{ transform: "translateY(-40px) rotate(0)" }, { transform: "translateY(0) rotate(200deg)" }], { duration: 900, easing: "ease-in" });
        fx.tone(980, 0.9, { vol: 0.12, vibrato: [7, 6] });
        await fx.wait(500);
        const wraith = fx.filter("grayscale(1) blur(2px) contrast(1.3) brightness(.8)", 2400, { fade: 400 });
        fx.noise(2.4, { type: "bandpass", freq: 500, q: 0.6, vol: 0.35, attack: 0.4 });
        for (let i = 0; i < 5; i++) fx.noise(0.5, { type: "bandpass", freq: 2000 + Math.random() * 2000, q: 8, vol: 0.12, at: 0.3 + i * 0.35, pan: Math.random() * 2 - 1 });
        await fx.wait(2600);
        await fx.fadeOut(ring, 300);
      }
    },

    // The Lord of the Rings: The Return of the King
    {
      id: 122,
      run: async (fx) => {
        const slots = fx.$$("#grid .slot");
        const top = slots.slice(0, 4).map((s) => fx.rect(s));
        const peaks = [fx.rect(".settings-btn.info-btn"), ...top, fx.rect("#settingsBtn")];
        const dusk = fx.wash("rgba(20,20,50,.55)", 0);
        fx.fadeIn(dusk, 500);
        for (let i = 0; i < peaks.length; i++) {
          const p = peaks[i];
          const fire = fx.put(A.S("0 0 30 40", '<path d="M15 2 C24 14 26 24 22 32 C20 36 10 36 8 32 C4 24 8 14 15 2 Z" fill="#ff8a1a"/><path d="M15 14 C20 22 20 28 18 32 C16 34 14 34 12 32 C10 28 11 22 15 14 Z" fill="#ffe07a"/><rect x="6" y="34" width="18" height="5" fill="#5a3a1a"/>'), p.x, p.top - 14, { size: 24, h: 32 });
          fx.anim(fire, [{ transform: "scale(0)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], { duration: 300 });
          fx.tone(["D4", "E4", "F#4", "A4", "B4", "D5"][i % 6], 0.6, { type: "sawtooth", vol: 0.07, attack: 0.02, filter: { freq: 1500 } });
          fx.noise(0.4, { freq: 700, vol: 0.15 });
          await fx.wait(380);
        }
        await fx.wait(1500);
        await fx.fadeOut(dusk, 500);
      }
    },

    // Harry Potter and the Philosopher's Stone
    {
      id: 671,
      run: async (fx) => {
        const t = fx.rect(".ticket-slot");
        fx.style(".ticket-peek", { visibility: "hidden" }, 3600);
        fx.buzz([30, 40, 30, 40, 30]);
        for (let i = 0; i < 3; i++) fx.thud({ freq: 200, vol: 0.2, dur: 0.1, at: i * 0.15 });
        const n = fx.reduced ? 6 : 24;
        const flights = [];
        for (let i = 0; i < n; i++) {
          const to = [t.x + (Math.random() - 0.5) * W() * 1.4, -60 - Math.random() * 100];
          flights.push(fx.wait(i * 90).then(() => {
            fx.noise(0.12, { type: "highpass", freq: 3000, vol: 0.12 });
            return fx.fly(A.envelope, [t.x, t.y], to, { size: 40, h: 27, dur: 1400 + Math.random() * 600, via: [t.x + (Math.random() - 0.5) * 200, t.y - H() * 0.3], r0: 0, r1: Math.random() * 90 - 45, r2: Math.random() * 360 - 180, easing: "ease-out" });
          }));
        }
        await Promise.all(flights);
      }
    },

    // Harry Potter and the Prisoner of Azkaban
    {
      id: 673,
      run: async (fx) => {
        const parch = fx.wash("rgba(215,190,140,.35)", 4600, { blend: "multiply", fade: 400 });
        const r = fx.rect(fx.slot());
        const steps = 10;
        for (let i = 0; i < steps; i++) {
          const p = i / (steps - 1);
          const x = W() * 0.1 + (r.x - W() * 0.1) * p + (i % 2 ? 10 : -10);
          const y = H() * 0.9 + (r.y + r.height / 2 - H() * 0.9) * p;
          const foot = fx.put(A.S("0 0 20 36", '<ellipse cx="10" cy="11" rx="6" ry="9" fill="#3b2a14"/><ellipse cx="10" cy="28" rx="5" ry="6" fill="#3b2a14"/>'), x, y, { size: 14, h: 24, style: { transform: "rotate(" + (Math.atan2(r.y - H() * 0.9, r.x - W() * 0.1) * 180 / Math.PI + 90) + "deg)" } });
          fx.anim(foot, [{ opacity: 0 }, { opacity: 0.8 }, { opacity: 0.8, offset: 0.7 }, { opacity: 0 }], { duration: 2000 });
          fx.click({ freq: 700, vol: 0.12 });
          await fx.wait(260);
        }
        await fx.wait(1600);
        void parch;
      }
    },

    // Harry Potter and the Goblet of Fire
    {
      id: 674,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const flame = fx.put(A.S("0 0 60 100", '<path d="M30 4 C48 30 56 56 48 78 C44 92 16 92 12 78 C4 56 12 30 30 4 Z" fill="#3f8cff" opacity=".85"/><path d="M30 30 C40 46 42 62 38 74 C36 82 24 82 22 74 C18 62 20 46 30 30 Z" fill="#bfe4ff"/>'), r.x, r.y - r.height * 0.2, { size: r.width * 1.1, h: r.height * 1.4, style: { filter: "drop-shadow(0 0 14px #3f8cff)" } });
        fx.noise(2.2, { freq: 800, vol: 0.3, attack: 0.2 });
        fx.move(flame, [{ transform: "scale(1,1)" }, { transform: "scale(1.06,.94)" }, { transform: "scale(.95,1.08)" }, { transform: "scale(1)" }], { duration: 500, iterations: 4 });
        await fx.wait(1300);
        fx.flash("#bcd8ff", 200);
        fx.tone(700, 0.3, { slide: 1400, vol: 0.12 });
        const slip = A.S("0 0 50 30", '<path d="M2 4 L48 2 L46 26 L4 28 Z" fill="#f1e3c2" stroke="#6b3a1a" stroke-width="2"/><path d="M40 4 L48 2 L46 10 Z M4 22 L4 28 L12 27 Z" fill="#2a1a0a"/><path d="M10 12 H38 M10 18 H30" stroke="#3a2a1a" stroke-width="1.5"/>');
        await fx.fly(slip, [r.x, r.y - r.height * 0.4], [r.x + 60, r.y + r.height * 0.8], { size: 44, h: 26, dur: 1600, via: [r.x - 30, r.y - r.height], r0: 0, r1: 200, r2: 380, keep: true, easing: "ease-out" });
        fx.fadeOut(flame, 300);
        await fx.wait(900);
      }
    },

    // Harry Potter and the Deathly Hallows: Part 2
    {
      id: 12445,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const size = Math.max(r.width, r.height) * 1.3;
        const el = fx.put(A.S("0 0 100 100", '<g fill="none" stroke="#f4f0e0" stroke-width="3" stroke-linecap="round" style="filter:drop-shadow(0 0 4px #fff)">' +
          '<path class="h1" d="M50 8 L94 88 L6 88 Z" pathLength="1"/><circle class="h2" cx="50" cy="61" r="26" pathLength="1"/><path class="h3" d="M50 8 V88" pathLength="1"/></g>'), r.x, r.y, { size });
        el.querySelectorAll("path,circle").forEach((p) => { p.style.strokeDasharray = "1"; p.style.strokeDashoffset = fx.reduced ? "0" : "1"; });
        const draw = async (sel, note) => {
          fx.tone(note, 0.8, { type: "sine", vol: 0.1, attack: 0.1 });
          await fx.move(el.querySelector(sel), [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700, easing: "ease-in-out" });
        };
        await draw(".h1", "D5");
        await draw(".h2", "F5");
        await draw(".h3", "A5");
        await fx.wait(1100);
        await fx.fadeOut(el, 500);
      }
    }
  ]);
})();
