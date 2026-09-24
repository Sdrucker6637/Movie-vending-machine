/* Machine FX cues - comedy, romance, music, holidays and everything else.
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

  M.register([
    // Groundhog Day
    {
      id: 137,
      repeat: "always",
      cooldown: 4000,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        for (let day = 0; day < 2; day++) {
          fx.text(el, "5:59", 0);
          await fx.wait(900);
          fx.click({ freq: 700, vol: 0.5 });
          el.textContent = "6:00";
          fx.move(el, [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0)" }], { duration: 200 });
          fx.seq([["G4", 1], ["C5", 1], ["E5", 1], ["G5", 2]], { beat: 0.14, type: "triangle", vol: 0.08 });
          fx.cls(".reely", "hop", 600);
          await fx.wait(1300);
        }
      }
    },

    // Eternal Sunshine of the Spotless Mind
    {
      id: 38,
      run: async (fx) => {
        const others = fx.otherSlots(true).sort(() => Math.random() - 0.5);
        fx.tone("E5", 3, { vol: 0.05, attack: 0.5, vibrato: [3, 6] });
        for (const s of others) {
          fx.anim(s, [{ opacity: 1, filter: "none" }, { opacity: 0.1, filter: "blur(4px) grayscale(1)" }], { duration: 700 });
          fx.noise(0.3, { type: "bandpass", freq: 2000, q: 3, vol: 0.05 });
          await fx.wait(220);
        }
        await fx.wait(1300);
        await Promise.all(others.map((s) => fx.anim(s, [{ opacity: 0.1, filter: "blur(4px) grayscale(1)" }, { opacity: 1, filter: "none" }], { duration: 500 })));
      }
    },

    // Being John Malkovich
    {
      id: 492,
      run: async (fx) => {
        const src = fx.movie.poster;
        const imgs = fx.$$("#grid .slot img");
        if (!src || !imgs.length) return;
        fx.style("body > header", { transform: "scaleY(.86)", transformOrigin: "50% 0" }, 3000);
        const saved = imgs.map((img) => [img, img.src]);
        fx.onCleanup(() => saved.forEach(([img, s]) => { if (img.isConnected) img.src = s; }));
        for (let i = 0; i < imgs.length; i++) {
          imgs[i].src = src;
          fx.tone(300 + (i % 4) * 40, 0.07, { type: "triangle", vol: 0.06 });
          await fx.wait(90);
        }
        await fx.wait(2200);
      }
    },

    // The Princess Bride
    {
      id: 2493,
      run: async (fx) => {
        const cx = W() / 2, cy = H() * 0.42;
        const sword = A.S("0 0 20 120", '<path d="M10 2 L13 88 H7 Z" fill="#d8dde0" ' + A.ink + ' stroke-width="1.5"/><path d="M0 88 H20 M10 88 V112" ' + A.ink + ' stroke-width="4"/><circle cx="10" cy="114" r="4" fill="#d9a13a" ' + A.ink + ' stroke-width="1.5"/>');
        const l = fx.put(sword, cx - 40, cy, { size: 20, h: 120, style: { transformOrigin: "50% 90%" } });
        const r = fx.put(sword, cx + 40, cy, { size: 20, h: 120, style: { transformOrigin: "50% 90%" } });
        for (let i = 0; i < 5; i++) {
          fx.anim(l, [{ transform: "rotate(10deg)" }, { transform: "rotate(" + (30 + (i % 2) * 20) + "deg)" }], { duration: 180, fill: "forwards" });
          await fx.anim(r, [{ transform: "rotate(-10deg)" }, { transform: "rotate(-" + (30 + (i % 2) * 20) + "deg)" }], { duration: 180, fill: "forwards" });
          fx.tone(2600 + Math.random() * 400, 0.3, { type: "triangle", vol: 0.12 });
          fx.noise(0.05, { type: "highpass", freq: 5000, vol: 0.3 });
          fx.particles({ kind: "burst", from: pt(cx, cy - 20), count: 5, spread: 20, dur: 400, stagger: 0, glyphs: A.sparkle("#fff4b0"), min: 6, max: 10 });
          await fx.wait(220);
        }
        await fx.wait(400);
        fx.fadeOut(l, 300);
        await fx.fadeOut(r, 300);
      }
    },

    // Monty Python and the Holy Grail
    {
      id: 762,
      run: async (fx) => {
        for (let i = 0; i < 12; i++) {
          fx.tone(i % 2 ? 380 : 330, 0.05, { type: "triangle", vol: 0.35, at: i * 0.2, filter: { type: "bandpass", freq: 600, q: 3 } });
          fx.noise(0.04, { type: "bandpass", freq: 700, q: 5, vol: 0.3, at: i * 0.2 });
        }
        await fx.wait(2600);
        const reely = fx.rect(".reely");
        const bunny = A.S("0 0 40 40", '<ellipse cx="20" cy="28" rx="14" ry="10" fill="#fff" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="20" r="7" fill="#fff" ' + A.ink + ' stroke-width="2"/><path d="M28 14 L26 2 M32 14 L34 2" ' + A.ink + ' stroke-width="3"/><circle cx="32" cy="19" r="1.3" fill="#d8141e"/>');
        await fx.fly(bunny, [-30, H() - 40], [reely.x, reely.y], { size: 30, dur: 900, via: [reely.x / 2, reely.y - 80], easing: "ease-in" });
        fx.shake("sm", 400);
        fx.move(".reely", [{ transform: "rotate(0)" }, { transform: "rotate(-15deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(0)" }], { duration: 400 });
        fx.tone(900, 0.3, { type: "sawtooth", slide: 300, vol: 0.1 });
        await fx.wait(600);
      }
    },

    // Ferris Bueller's Day Off
    {
      id: 9377,
      repeat: "sometimes",
      chance: 0.5,
      run: async (fx) => {
        await fx.wait(600);
        fx.costume(".reely", '<rect x="44" y="44" width="30" height="22" fill="#fbf4e2"/><path d="M46 56 Q52.5 51 59 56" stroke="#1f1b16" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="67.5" cy="55" rx="5" ry="8" fill="#1f1b16"/>', 700);
        fx.tone("C6", 0.12, { type: "sine", vol: 0.1 });
        await fx.wait(900);
      }
    },

    // The Breakfast Club
    {
      id: 2108,
      run: async (fx) => {
        const fist = fx.put('<svg viewBox="0 0 30 30" style="width:100%;height:100%"><use href="#glove"/></svg>', W() / 2, H() + 60, { size: 90 });
        fx.seq([["D4", 1], ["F#4", 1], ["A4", 1], ["D5", 3]], { beat: 0.2, type: "sawtooth", vol: 0.05, filter: { freq: 1400 } });
        await fx.move(fist, [{ transform: "translateY(0) rotate(-6deg)" }, { transform: "translateY(-" + H() * 0.4 + "px) rotate(0)" }], { duration: 700, easing: "ease-out" });
        if (fx.reduced) fist.style.transform = "translateY(-" + H() * 0.4 + "px)";
        fx.freeze(1800);
        fx.filter("grayscale(.6) contrast(1.1)", 1800);
        await fx.wait(1800);
        await fx.fadeOut(fist, 300);
      }
    },

    // Rocky
    {
      id: 1366,
      run: async (fx) => {
        [0, 0.35].forEach((t) => { fx.tone(1250, 1.2, { vol: 0.2, at: t }); fx.tone(2890, 0.8, { vol: 0.08, at: t }); fx.tone(4300, 0.5, { vol: 0.05, at: t }); });
        fx.wash("rgba(255,180,90,.2)", 3000, { blend: "multiply", fade: 400 });
        for (let i = 0; i < 4; i++) {
          fx.later(600 + i * 550, () => { fx.cls([fx.$(".reely"), fx.$(".kernel")], "hop", 500); });
        }
        await fx.wait(3200);
      }
    },

    // Airplane!
    {
      id: 813,
      run: async (fx) => {
        fx.tone(70, 3.2, { type: "sawtooth", vol: 0.14, vibrato: [18, 10], filter: { freq: 500 }, attack: 0.4 });
        await fx.fly(A.jet, [-160, H() * 0.25], [W() + 160, H() * 0.2], { size: 130, h: 46, dur: 3200, via: [W() / 2, H() * 0.3], r0: 3, r1: -3, r2: 2 });
      }
    },

    // Spaceballs
    {
      id: 957,
      run: async (fx) => {
        fx.particles({ kind: "burst", count: 40, spread: 200, dur: 700, stagger: 500, glyphs: '<div style="width:100%;height:2px;background:#fff"></div>', min: 20, max: 60 });
        fx.tone(200, 1.2, { type: "sawtooth", slide: 3000, vol: 0.12, filter: { freq: 3000 } });
        await fx.wait(900);
        const plaid = fx.node("", { cls: "fx-filter", style: { background: "repeating-linear-gradient(90deg, rgba(200,30,40,.6) 0 20px, rgba(20,60,30,.5) 20px 34px, rgba(240,210,60,.5) 34px 38px, rgba(20,20,90,.5) 38px 60px), repeating-linear-gradient(0deg, rgba(200,30,40,.6) 0 20px, rgba(20,60,30,.5) 20px 34px, rgba(240,210,60,.5) 34px 38px, rgba(20,20,90,.5) 38px 60px)" } });
        fx.noise(1.4, { freq: 1200, vol: 0.3 });
        await fx.move(plaid, [{ backgroundPosition: "0 0" }, { backgroundPosition: "600px 300px" }], { duration: 1400, easing: "linear" });
        if (fx.reduced) await fx.wait(1400);
        fx.remove(plaid);
        await fx.wait(200);
      }
    },

    // This Is Spinal Tap
    {
      id: 11031,
      run: async (fx) => {
        const knobs = fx.$$(".knob");
        knobs.forEach((k) => fx.cls(k, "fx-knob-eleven", 3200));
        const k = knobs[knobs.length - 1];
        if (k) {
          const r = fx.rect(k);
          const label = fx.put('<div style="font:700 14px Bitter, Georgia;color:#fbf4e2;background:#1f1b16;border-radius:8px;padding:1px 5px;text-align:center">11</div>', r.x, r.top - 14, { size: 26, h: 18 });
          fx.fadeIn(label, 200);
        }
        for (let i = 0; i < 11; i++) fx.click({ freq: 1800, vol: 0.2, at: i * 0.07 });
        await fx.wait(900);
        ["E2", "B2", "E3"].forEach((n) => fx.tone(n, 1.8, { type: "sawtooth", vol: 0.16, filter: { freq: 1600 } }));
        fx.tone(3100, 1.4, { vol: 0.05, attack: 0.6, at: 0.5 });
        fx.shake("sm", 1200);
        await fx.wait(2300);
      }
    },

    // Wayne's World
    {
      id: 8872,
      run: async (fx) => {
        for (let i = 0; i < 8; i++) fx.tone(i % 2 ? 880 : 660, 0.16, { type: "sine", vol: 0.1, at: i * 0.18, vibrato: [12, 20] });
        const parts = fx.pageParts();
        await fx.move(parts, [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ transform: "translateX(" + (i === 8 ? 0 : Math.sin(i * 1.4) * 10) + "px) skewX(" + (i === 8 ? 0 : Math.sin(i) * 6) + "deg)" })), { duration: 1500, easing: "ease-in-out", fill: "none" });
        if (fx.reduced) fx.filter("blur(2px)", 1200);
        fx.wash("rgba(80,120,255,.15)", 800, { fade: 200 });
        await fx.wait(900);
      }
    },

    // Bill & Ted's Excellent Adventure
    {
      id: 1648,
      run: async (fx) => {
        const x = W() - 50, y = H() * 0.55;
        fx.flash("#cfe8ff", 200);
        fx.noise(0.8, { type: "highpass", freq: 2500, vol: 0.4 });
        const booth = fx.put(A.booth, x, y, { size: 44, h: 88 });
        fx.anim(booth, [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0.5, offset: 0.4 }, { opacity: 1 }], { duration: 700 });
        for (let i = 0; i < 3; i++) {
          const bolt = fx.node('<svg style="position:absolute;inset:0;width:100%;height:100%"><path d="M' + x + " " + (y - 50) + " l" + (-20 + i * 20) + " -30 l10 10 l-10 -40" + '" stroke="#cfe8ff" stroke-width="2" fill="none"/></svg>', { ms: 120 });
          void bolt;
          await fx.wait(150);
        }
        await fx.wait(500);
        ["E3", "G#3", "B3", "E4"].forEach((n, i) => fx.tone(n, 1.4, { type: "sawtooth", vol: 0.1, at: i * 0.03, filter: { freq: 2000 } }));
        fx.tone("E5", 1.2, { type: "sawtooth", vol: 0.06, vibrato: [7, 20], at: 0.2, filter: { freq: 3000 } });
        await fx.wait(1800);
        fx.flash("#cfe8ff", 200);
        fx.remove(booth);
        await fx.wait(200);
      }
    },

    // The Hangover
    {
      id: 18785,
      run: async (fx) => {
        const black = fx.wash("#000", 0);
        fx.tone(60, 0.6, { vol: 0.2 });
        await fx.wait(900);
        const slots = fx.$$("#grid .slot");
        slots.forEach((s) => fx.style(s, { transform: "translate(" + (Math.random() * 30 - 15) + "px," + (Math.random() * 20 - 10) + "px) rotate(" + (Math.random() * 40 - 20) + "deg)" }, 2400));
        fx.style(".reely", { transform: "rotate(170deg) translateY(-20px)" }, 2400);
        fx.remove(black);
        fx.flash("#fff", 400);
        fx.noise(0.3, { freq: 900, vol: 0.2 });
        await fx.wait(2400);
        for (let i = 0; i < 6; i++) fx.click({ freq: 1200 + i * 100, vol: 0.2, at: i * 0.06 });
        await fx.wait(300);
      }
    },

    // Dumb and Dumber
    {
      id: 8467,
      run: async (fx) => {
        fx.tone(310, 1.4, { type: "sawtooth", vol: 0.14, vibrato: [5, 4], filter: { type: "bandpass", freq: 1300, q: 5 } });
        fx.tone(620, 1.4, { type: "square", vol: 0.05, filter: { type: "bandpass", freq: 2600, q: 5 } });
        fx.move(".reely", [{ transform: "scale(1)" }, { transform: "scale(1.06,.94)" }], { duration: 120, iterations: 11, direction: "alternate" });
        fx.wash("rgba(255,190,60,.18)", 1400, { blend: "multiply", fade: 200 });
        await fx.wait(1600);
      }
    },

    // Zoolander
    {
      id: 9398,
      run: async (fx) => {
        const s = A.liftSlot(fx, 3000);
        if (!s) return;
        const r = fx.rect(s);
        fx.move(s, [{ transform: "none" }, { transform: "rotate(-8deg) scale(1.12) translateX(-6px)" }], { duration: 500, easing: "steps(3)" });
        fx.style(s, { filter: "saturate(1.4) hue-rotate(-12deg)" }, 3000);
        for (let i = 0; i < 6; i++) {
          await fx.wait(i === 0 ? 400 : 380);
          fx.click({ freq: 4500, vol: 0.4 });
          fx.noise(0.08, { type: "highpass", freq: 2000, vol: 0.2, at: 0.02 });
          const fl = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,255,255,0) 70%)"></div>', r.x + (Math.random() - 0.5) * 200, r.y + (Math.random() - 0.5) * 200, { size: 80 });
          fx.fadeOut(fl, 250);
        }
        await fx.wait(600);
      }
    },

    // Bruce Almighty
    {
      id: 310,
      run: async (fx) => {
        const slots = fx.$$("#grid .slot");
        fx.wash("rgba(200,40,30,.2)", 3000, { blend: "multiply", fade: 400 });
        fx.noise(2.6, { freq: 400, sweep: 1400, vol: 0.3, attack: 0.5 });
        fx.chord(["C4", "G4", "E5"], 2.6, { type: "sawtooth", vol: 0.04, attack: 0.8, filter: { freq: 1400 } });
        await Promise.all(slots.map((s, i) => {
          const dir = i % 4 < 2 ? -1 : 1;
          return fx.move(s, [{ transform: "translateX(0)" }, { transform: "translateX(" + dir * 26 + "px)", offset: 0.3 }, { transform: "translateX(" + dir * 26 + "px)", offset: 0.75 }, { transform: "translateX(0)" }], { duration: 2800, easing: "ease-in-out" });
        }));
        if (fx.reduced) await fx.wait(2600);
      }
    },

    // Hot Fuzz
    {
      id: 4638,
      run: async (fx) => {
        const y = H() - 40;
        for (let i = 0; i < 10; i++) fx.noise(0.06, { type: "bandpass", freq: 900, q: 4, vol: 0.3, at: 0.3 + i * 0.35 });
        await fx.move(fx.put(A.swan, -50, y, { size: 56, h: 42 }), [{ transform: "translateX(0) rotate(-4deg)" }, { transform: "translateX(" + (W() * 0.5 + 50) + "px) rotate(4deg)" }, { transform: "translateX(" + (W() + 110) + "px) rotate(-4deg)" }], { duration: 3800, easing: "steps(20)" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Shaun of the Dead
    {
      id: 747,
      run: async (fx) => {
        for (let i = 0; i < 4; i++) {
          fx.later(i * 450, () => {
            fx.noise(0.3, { type: "bandpass", freq: 1500, sweep: 700, q: 2, vol: 0.2 });
            fx.fly(A.record, [-40, H() * (0.3 + i * 0.1)], [W() + 40, H() * (0.35 + i * 0.1)], { size: 44, dur: 1100, via: [W() / 2, H() * (0.25 + i * 0.1)], r2: 1080 });
          });
        }
        fx.later(1800, () => fx.thud({ freq: 150, vol: 0.4, dur: 0.1 }));
        await fx.wait(3300);
      }
    },

    // Scott Pilgrim vs. the World
    {
      id: 22538,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.flash("#fff", 150);
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 20, spread: 70, gravity: 120, dur: 1200, stagger: 200, glyphs: A.coin("#ffd21a"), min: 12, max: 18, spin: 360 });
        for (let i = 0; i < 10; i++) { fx.tone("B5", 0.05, { type: "square", vol: 0.05, at: i * 0.08 }); fx.tone("E6", 0.08, { type: "square", vol: 0.05, at: i * 0.08 + 0.04 }); }
        const pts = fx.put('<div style="font:700 20px Bitter, Georgia;color:#fff;text-shadow:2px 2px 0 #1f1b16, -1px -1px 0 #1f1b16">+1000</div>', r.x, r.top - 10, { size: 90, h: 26 });
        await fx.move(pts, [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-40px)", opacity: 0 }], { duration: 1400 });
        if (fx.reduced) await fx.wait(1200);
      }
    },

    // Little Miss Sunshine
    {
      id: 773,
      run: async (fx) => {
        const y = H() - 44;
        const van = fx.put(A.van, -70, y, { size: 90, h: 45 });
        const honk = (t) => { fx.tone(420, 0.25, { type: "square", vol: 0.07, at: t, filter: { freq: 1400 } }); fx.tone(520, 0.25, { type: "square", vol: 0.05, at: t, filter: { freq: 1400 } }); };
        for (let i = 0; i < 9; i++) honk(0.3 + i * 0.38);
        await fx.move(van, [{ transform: "translateX(0)" }, { transform: "translateX(" + (W() * 0.4) + "px)", offset: 0.4 }, { transform: "translateX(" + (W() * 0.45) + "px)", offset: 0.5 }, { transform: "translateX(" + (W() + 140) + "px)" }], { duration: 3800, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3400);
      }
    },

    // The Mask
    {
      id: 854,
      run: async (fx) => {
        const s = A.liftSlot(fx, 2400);
        if (!s) return;
        const r = fx.rect(s);
        const twister = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:conic-gradient(from 0deg, #3fdc3f, transparent 25%, #3fdc3f 50%, transparent 75%, #3fdc3f);filter:blur(2px)"></div>', r.x, r.y, { size: Math.max(r.width, r.height) * 1.5 });
        fx.noise(1.2, { type: "bandpass", freq: 600, sweep: 2400, vol: 0.3 });
        fx.move(twister, [{ transform: "rotate(0)" }, { transform: "rotate(1440deg)" }], { duration: 1200, easing: "ease-in" });
        await fx.move(s, [{ transform: "rotate(0)" }, { transform: "rotate(720deg)" }], { duration: 1200, easing: "ease-in" });
        fx.remove(twister);
        fx.style(s, { filter: "hue-rotate(80deg) saturate(1.8)" }, 1200);
        fx.tone(900, 0.3, { slide: 2600, vol: 0.12 });
        fx.tone(1400, 0.6, { slide: 500, vol: 0.12, at: 0.35 });
        await fx.wait(1200);
      }
    },

    // Mrs. Doubtfire
    {
      id: 788,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const splat = fx.node('<svg viewBox="0 0 100 150" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M10 30 C0 10 30 0 40 14 C50 0 80 4 80 20 C100 20 104 50 90 60 C100 80 90 110 70 104 C66 130 40 130 36 108 C10 118 0 90 14 80 C-2 66 4 40 10 30 Z" fill="#fffaf0" stroke="#e8d8c0" stroke-width="2"/><circle cx="36" cy="50" r="4" fill="#e03a3a"/><circle cx="64" cy="56" r="4" fill="#e03a3a"/></svg>', { parent: s, style: { position: "absolute", inset: "4px", zIndex: 5, pointerEvents: "none" } });
        fx.noise(0.2, { freq: 400, vol: 0.6 });
        fx.thud({ freq: 180, vol: 0.3, dur: 0.1 });
        await fx.anim(splat, [{ transform: "scale(.2)", opacity: 0 }, { transform: "scale(1.05)", opacity: 1 }, { transform: "scale(1)" }], { duration: 200 });
        await fx.wait(2400);
        await fx.fadeOut(splat, 400);
      }
    },

    // Pretty Woman
    {
      id: 114,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const box = fx.put('<div style="position:relative;width:100%;height:100%"><div style="position:absolute;left:0;right:0;bottom:0;height:55%;background:#7a0f1e;border:3px solid #1f1b16;border-radius:4px"><div style="position:absolute;left:12%;right:12%;top:18%;height:40%;border-radius:50%;border:3px solid #ff5a5a;box-shadow:0 0 8px #fff"></div></div>' +
          '<div class="lid" style="position:absolute;left:0;right:0;top:0;height:48%;background:#8a1a28;border:3px solid #1f1b16;border-radius:4px;transform-origin:50% 100%;transform:rotateX(-110deg)"></div></div>', r.x, r.y, { size: r.width * 0.9, h: r.width * 0.7 });
        A.sparkleOn(fx, pt(r.x, r.y), 8, "#ffe0e8");
        await fx.wait(1300);
        const lid = box.querySelector(".lid");
        fx.anim(lid, [{ transform: "rotateX(-110deg)" }, { transform: "rotateX(0)" }], { duration: 120, easing: "ease-in" });
        await fx.wait(110);
        fx.click({ freq: 1200, vol: 0.9 });
        fx.thud({ freq: 220, vol: 0.3, dur: 0.08 });
        fx.move(box, [{ transform: "translateY(0)" }, { transform: "translateY(-4px)" }, { transform: "translateY(0)" }], { duration: 150 });
        await fx.wait(1100);
        await fx.fadeOut(box, 300);
      }
    },

    // Love Actually
    {
      id: 508,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cards = ["♥", "♥ ♥", "♥ ♥ ♥"];
        for (let i = 0; i < cards.length; i++) {
          const c = fx.put('<div style="width:100%;height:100%;background:#fffdf6;border:2px solid #1f1b16;box-shadow:3px 3px 0 #1f1b16;display:flex;align-items:center;justify-content:center;font:700 18px \'Special Elite\', monospace;color:#c8261e">' + cards[i] + "</div>", r.x, r.y, { size: r.width * 1.2, h: r.width * 0.8 });
          fx.noise(0.12, { type: "bandpass", freq: 2500, vol: 0.3 });
          await fx.anim(c, [{ transform: "rotateY(90deg)" }, { transform: "rotateY(0)" }], { duration: fx.reduced ? 10 : 250 });
          await fx.wait(900);
          await fx.anim(c, [{ transform: "rotateY(0)" }, { transform: "rotateY(-90deg)" }], { duration: fx.reduced ? 10 : 200 });
          fx.remove(c);
        }
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["C6", 2]], { beat: 0.16, type: "triangle", vol: 0.06 });
        await fx.wait(700);
      }
    },

    // Twilight
    {
      id: 8966,
      run: async (fx) => {
        fx.wash("rgba(80,140,170,.3)", 3200, { blend: "multiply", fade: 400 });
        const s = A.liftSlot(fx, 3200);
        if (!s) return;
        fx.style(s, { filter: "brightness(1.15) contrast(1.05)" }, 3200);
        for (let i = 0; i < 16; i++) fx.tone(3000 + Math.random() * 3000, 0.15, { vol: 0.03, at: i * 0.15 });
        await fx.particles({ kind: "drift", area: fx.rect(s), count: 26, dur: 900, stagger: 2200, glyphs: A.sparkle("#fff"), min: 5, max: 12 });
      }
    },

    // The Hunger Games
    {
      id: 70160,
      run: async (fx) => {
        fx.wash("rgba(20,30,40,.4)", 4200, { blend: "multiply", fade: 400 });
        await fx.wait(500);
        fx.thud({ freq: 45, vol: 0.9, dur: 1.5 });
        fx.noise(1.6, { freq: 200, sweep: 60, vol: 0.4 });
        fx.buzz(150);
        await fx.wait(1700);
        [["D6", 0], ["F6", 0.22], ["E6", 0.44], ["A5", 0.66]].forEach(([n, t]) => fx.tone(n, 0.22, { vol: 0.12, at: t, vibrato: [8, 10] }));
        const r = fx.rect(fx.slot());
        await fx.particles({ kind: "rise", from: pt(r.x, r.y + r.height / 2, r.width, 0), count: 22, glyphs: dot("#ff8a1a"), min: 3, max: 6, dur: 1600, stagger: 1000 });
      }
    },

    // Pitch Perfect
    {
      id: 114150,
      run: async (fx) => {
        const hits = [0, 0.25, 0.5, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3];
        hits.forEach((t, i) => {
          if (i % 3 === 2) fx.noise(0.05, { type: "bandpass", freq: 2200, q: 2, vol: 0.4, at: t });
          else fx.tone(i % 2 ? 420 : 300, 0.06, { type: "triangle", vol: 0.25, at: t, filter: { type: "bandpass", freq: 700, q: 2 } });
        });
        const r = fx.rect(fx.slot());
        const cup = fx.put(A.S("0 0 30 40", '<path d="M3 4 H27 L23 38 H7 Z" fill="#d8261e" ' + A.ink + ' stroke-width="2"/><path d="M4 10 H26" stroke="#fff" stroke-width="2"/>'), r.x, r.top + r.height + 20, { size: 22, h: 30 });
        await fx.move(cup, [{ transform: "rotate(0) translateY(0)" }, { transform: "rotate(180deg) translateY(-12px)", offset: 0.25 }, { transform: "rotate(180deg)", offset: 0.5 }, { transform: "rotate(360deg) translateY(-12px)", offset: 0.75 }, { transform: "rotate(360deg)" }], { duration: 3000 });
        if (fx.reduced) await fx.wait(3000);
        await fx.fadeOut(cup, 200);
      }
    },

    // Bohemian Rhapsody
    {
      id: 424694,
      run: async (fx) => {
        const pattern = [0, 0.3, 0.6];
        for (let bar = 0; bar < 4; bar++) {
          const t = bar * 1.2;
          fx.thud({ freq: 70, vol: 0.6, dur: 0.2, at: t + pattern[0] });
          fx.thud({ freq: 70, vol: 0.6, dur: 0.2, at: t + pattern[1] });
          fx.noise(0.12, { type: "bandpass", freq: 1800, q: 0.8, vol: 0.6, at: t + pattern[2] });
          fx.later((t + pattern[0]) * 1000, () => fx.shake("sm", 100));
          fx.later((t + pattern[1]) * 1000, () => fx.shake("sm", 100));
          fx.later((t + pattern[2]) * 1000, () => fx.flash("rgba(255,255,255,.35)", 120));
        }
        await fx.wait(5000);
      }
    },

    // La La Land
    {
      id: 313369,
      run: async (fx) => {
        const sky = fx.wash("linear-gradient(#1a1446, #5b2a86 60%, #e07aa0)", 0, { opacity: 0 });
        await fx.anim(sky, [{ opacity: 0 }, { opacity: 0.82 }], { duration: 700 });
        fx.particles({ kind: "drift", count: 40, glyphs: A.star("#fffbe0"), min: 3, max: 9, dur: 3400, stagger: 500 });
        fx.chord(["D4", "F#4", "A4", "C#5"], 2.6, { type: "triangle", vol: 0.08 });
        fx.seq([["A5", 1], ["F#5", 1], ["C#6", 2]], { beat: 0.35, type: "sine", vol: 0.06, at: 1.2 });
        const s = A.liftSlot(fx, 3400);
        if (s) fx.style(s, { boxShadow: "0 0 30px 12px rgba(255,240,200,.6)" }, 3400);
        await fx.wait(3200);
        await fx.fadeOut(sky, 600);
      }
    },

    // Whiplash
    {
      id: 244786,
      run: async (fx) => {
        let t = 0, gap = 0.3;
        for (let i = 0; i < 22; i++) {
          fx.noise(0.05, { type: "bandpass", freq: 3000, q: 1.5, vol: 0.5, at: t });
          t += gap;
          gap = Math.max(0.06, gap * 0.9);
        }
        await fx.wait(t * 1000 + 250);
        const reely = fx.rect(".reely");
        fx.noise(0.3, { type: "bandpass", freq: 900, sweep: 3000, vol: 0.3 });
        fx.move(".reely", [{ transform: "translateY(0)" }, { transform: "translateY(12px) scale(1,.8)" }, { transform: "translateY(0)" }], { duration: 600 });
        await fx.fly(A.cymbal, [W() + 60, reely.y - 60], [-80, reely.y - 10], { size: 70, h: 26, dur: 700, r2: -720, easing: "ease-in" });
        fx.noise(1.8, { type: "highpass", freq: 4000, vol: 0.35 });
        await fx.wait(700);
      }
    },

    // The Social Network
    {
      id: 37799,
      run: async (fx) => {
        fx.wash("rgba(59,89,152,.3)", 3200, { blend: "multiply", fade: 300 });
        for (let i = 0; i < 30; i++) fx.noise(0.03, { type: "bandpass", freq: 2500 + Math.random() * 1500, q: 3, vol: 0.25, at: i * 0.09 + Math.random() * 0.04 });
        fx.later(2800, () => fx.tone(880, 0.1, { type: "square", vol: 0.06 }));
        fx.tone("F2", 3, { type: "sine", vol: 0.1, attack: 1 });
        await fx.wait(3200);
      }
    },

    // American Beauty
    {
      id: 14,
      run: async (fx) => {
        fx.particles({ kind: "fall", count: 36, glyphs: A.petal("#b8101e"), min: 10, max: 18, dur: 3600, stagger: 2000, spin: 540, wind: 40 });
        const bag = fx.fly(A.S("0 0 60 70", '<path d="M10 14 C4 30 6 60 16 66 C30 70 44 70 52 62 C58 44 58 22 48 12 C44 4 40 10 38 16 C34 10 26 10 22 16 C20 8 14 6 10 14 Z" fill="rgba(255,255,255,.55)" stroke="rgba(200,200,200,.8)" stroke-width="1.5"/>'), [-40, H() * 0.6], [W() + 40, H() * 0.4], { size: 50, h: 58, dur: 4200, via: [W() * 0.5, H() * 0.15], r0: 0, r1: 200, r2: 380, easing: "ease-in-out" });
        fx.chord(["E5", "G5", "C6"], 3.6, { type: "sine", vol: 0.05, attack: 0.8 });
        await bag;
      }
    },

    // The Green Mile
    {
      id: 497,
      run: async (fx) => {
        const y = fx.rect(".cta-stage").top - 10;
        const spool = fx.fly(A.spool, [-40, y + 10], [W() + 40, y + 10], { size: 18, dur: 2600, r2: 1440 });
        fx.later(300, () => fx.fly(A.mouse, [-60, y], [W() + 40, y], { size: 44, h: 22, dur: 2600, flip: true }));
        for (let i = 0; i < 10; i++) fx.tone(4000 + Math.random() * 500, 0.03, { vol: 0.04, at: 0.5 + i * 0.2 });
        await spool;
        await fx.wait(400);
        for (let i = 0; i < 3; i++) {
          fx.wash("rgba(0,0,0,.5)", 90);
          fx.noise(0.08, { type: "bandpass", freq: 200, vol: 0.3 });
          await fx.wait(300);
        }
      }
    },

    // Cast Away
    {
      id: 8358,
      run: async (fx) => {
        const sea = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "12vh", background: "linear-gradient(rgba(60,150,190,.0), rgba(40,120,170,.6))" } });
        fx.fadeIn(sea, 600);
        fx.noise(4.6, { freq: 500, vol: 0.2, attack: 1 });
        const y = H() - 34;
        await fx.move(fx.put(A.volleyball, W() * 0.35, y, { size: 40 }), [
          { transform: "translate(0,0) rotate(0)" }, { transform: "translate(" + W() * 0.2 + "px,-6px) rotate(60deg)" }, { transform: "translate(" + W() * 0.4 + "px,2px) rotate(100deg)" }, { transform: "translate(" + W() * 0.75 + "px,-4px) rotate(160deg) scale(.6)" }
        ], { duration: 4200, easing: "ease-in" });
        if (fx.reduced) await fx.wait(3800);
        await fx.fadeOut(sea, 500);
      }
    },

    // Apollo 13
    {
      id: 568,
      run: async (fx) => {
        const light = fx.put('<div style="width:100%;height:100%;background:#ffcf2a;border:3px solid #1f1b16;display:flex;align-items:center;justify-content:center;font:700 10px \'Special Elite\',monospace;color:#1f1b16;text-align:center;line-height:1.1">MASTER<br>ALARM</div>', W() - 50, 90, { size: 64, h: 40 });
        for (let i = 0; i < 6; i++) {
          fx.tone(i % 2 ? 1400 : 1800, 0.22, { type: "square", vol: 0.06, at: i * 0.25 });
        }
        fx.anim(light, [{ opacity: 1 }, { opacity: 0.25 }], { duration: 250, iterations: 8, direction: "alternate" });
        await fx.wait(1600);
        const dim = fx.wash("rgba(0,0,0,.55)", 0, { opacity: 0 });
        fx.freeze(1400);
        fx.tone(120, 0.8, { type: "sawtooth", slide: 40, vol: 0.12 });
        await fx.anim(dim, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
        await fx.wait(900);
        fx.remove(light);
        fx.tone(200, 0.5, { slide: 600, vol: 0.08 });
        await fx.fadeOut(dim, 400);
      }
    },

    // Gravity
    {
      id: 49047,
      run: async (fx) => {
        fx.noise(3.8, { type: "bandpass", freq: 500, q: 1, vol: 0.12, attack: 0.3, hold: 0.2 });
        for (let i = 0; i < 4; i++) fx.noise(0.8, { type: "bandpass", freq: 400, q: 1.5, vol: 0.12, attack: 0.4, at: i * 0.95 });
        if (fx.reduced) fx.wash("rgba(0,0,20,.4)", 3600, { fade: 800 });
        await fx.move(".machine", [{ transform: "translate(0,0) rotate(0)" }, { transform: "translate(8px,-14px) rotate(3deg)" }, { transform: "translate(-6px,-20px) rotate(-2deg)" }, { transform: "translate(0,0) rotate(0)" }], { duration: 3800, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3600);
      }
    },

    // The Martian
    {
      id: 286217,
      run: async (fx) => {
        fx.wash("rgba(210,90,40,.35)", 3600, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "sweep", count: 40, glyphs: dot("rgba(200,110,60,.7)"), min: 3, max: 10, dur: 1400, stagger: 2600 });
        const el = fx.$(".machine-marquee .marquee-text");
        fx.text(el, "SOL 1", 0);
        await fx.tween(2600, (p) => { el.textContent = "SOL " + Math.max(1, Math.round(p * 561)); }, (p) => p * p);
        fx.tone(660, 0.12, { type: "square", vol: 0.06 });
        await fx.wait(900);
      }
    },

    // Everything Everywhere All at Once
    {
      id: 545611,
      run: async (fx) => {
        const eye = () => '<div style="width:100%;height:100%;border-radius:50%;background:#fff;border:2px solid #1f1b16;position:relative"><div class="p" style="position:absolute;left:30%;top:30%;width:40%;height:40%;border-radius:50%;background:#1f1b16"></div></div>';
        const eyes = fx.$$("#grid .slot:not(.empty)").map((s) => {
          const r = fx.rect(s);
          const e = fx.put(eye(), r.x + (Math.random() - 0.5) * r.width * 0.4, r.top + r.height * 0.35, { size: Math.min(28, r.width * 0.45) });
          fx.move(e.querySelector(".p"), [{ transform: "translate(0,0)" }, { transform: "translate(40%,50%)" }, { transform: "translate(-45%,30%)" }, { transform: "translate(20%,-40%)" }, { transform: "translate(0,50%)" }], { duration: 900, iterations: 3, easing: "cubic-bezier(.3,1.6,.6,1)" });
          return e;
        });
        for (let i = 0; i < eyes.length; i++) fx.click({ freq: 700 + i * 40, vol: 0.2, at: i * 0.05 });
        await fx.wait(2000);
        const bagel = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, transparent 18%, #0b0907 20% 64%, #3a2a1a 66%, transparent 70%)"></div>', W() / 2, H() * 0.45, { size: 150 });
        fx.move(bagel, [{ transform: "scale(0) rotate(0)" }, { transform: "scale(1) rotate(360deg)" }, { transform: "scale(0) rotate(720deg)" }], { duration: 1600, easing: "ease-in-out" });
        fx.tone(60, 1.6, { type: "sawtooth", vol: 0.1, slide: 30, filter: { freq: 300 } });
        await fx.wait(1600);
        fx.remove(bagel);
        eyes.forEach((e) => fx.remove(e));
      }
    },

    // Knives Out
    {
      id: 546554,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const n = 16;
        let blades = "";
        for (let i = 0; i < n; i++) {
          const a = i * 360 / n;
          blades += '<g transform="rotate(' + a + ' 50 50)"><path d="M50 2 L53 22 L50 26 L47 22 Z" fill="#d8dde0" stroke="#1f1b16" stroke-width="1"/><rect x="48" y="26" width="4" height="8" fill="#5a3a1a"/></g>';
        }
        const ring = fx.put(A.S("0 0 100 100", blades), r.x, r.y, { size: Math.max(r.width, r.height) * 1.9 });
        fx.wash("rgba(60,30,20,.3)", 3200, { blend: "multiply", fade: 300 });
        for (let i = 0; i < 8; i++) fx.noise(0.08, { type: "highpass", freq: 5000, vol: 0.15, at: i * 0.07 });
        fx.chord(["A3", "C4", "E4"], 2.4, { type: "triangle", vol: 0.06, attack: 0.3 });
        await fx.move(ring, [{ transform: "scale(.4) rotate(-60deg)", opacity: 0 }, { transform: "scale(1) rotate(0)", opacity: 1 }], { duration: 600, easing: "ease-out" });
        await fx.wait(2200);
        await fx.fadeOut(ring, 400);
      }
    },

    // The Wolf of Wall Street
    {
      id: 106646,
      run: async (fx) => {
        for (let i = 0; i < 6; i++) {
          fx.thud({ freq: 80, vol: 0.5, dur: 0.12, at: i * 0.32 });
          fx.tone(i % 2 ? 110 : 98, 0.3, { type: "triangle", vol: 0.14, at: i * 0.32, vibrato: [5, 3] });
        }
        await fx.particles({ kind: "fall", count: 36, glyphs: A.bill, min: 26, max: 40, dur: 2600, stagger: 1600, spin: 720, wind: 50 });
      }
    },

    // The Departed
    {
      id: 1422,
      repeat: "sometimes",
      chance: 0.4,
      run: async (fx) => {
        const m = fx.rect(".machine");
        fx.tone(4200, 0.04, { vol: 0.05, at: 0.6 });
        await fx.fly(A.rat, [m.left - 40, m.top - 8], [m.left + m.width + 40, m.top - 8], { size: 48, h: 21, dur: 2600, flip: true, easing: "steps(26)" });
      }
    },

    // Shutter Island
    {
      id: 11324,
      run: async (fx) => {
        fx.wash("rgba(30,50,60,.5)", 4000, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "fall", count: 60, glyphs: '<div class="fx-streak" style="height:100%;background:rgba(210,225,235,.7)"></div>', min: 14, max: 22, dur: 600, stagger: 3200, wind: -140 });
        fx.noise(4, { freq: 1800, vol: 0.2, attack: 0.5 });
        for (let i = 0; i < 2; i++) {
          await fx.wait(1100);
          fx.flash("#eef4ff", 180);
          fx.thud({ freq: 40, vol: 0.5, dur: 1.2, at: 0.3 });
        }
        const beam = fx.node("", { style: { position: "absolute", right: "8%", top: "12%", width: "80vmax", height: "10vmax", marginTop: "-5vmax", background: "linear-gradient(90deg, rgba(255,250,210,.55), transparent)", transformOrigin: "100% 50%", clipPath: "polygon(0 0, 100% 45%, 100% 55%, 0 100%)" } });
        await fx.move(beam, [{ transform: "rotate(-30deg)" }, { transform: "rotate(30deg)" }], { duration: 1600, easing: "ease-in-out" });
        fx.remove(beam);
      }
    },

    // There Will Be Blood
    {
      id: 7345,
      run: async (fx) => {
        const t = fx.rect(".ticket-slot");
        fx.thud({ freq: 50, vol: 0.8, dur: 1 });
        fx.shake("md", 700);
        fx.noise(2.6, { freq: 300, vol: 0.4, attack: 0.3 });
        await fx.wait(500);
        fx.particles({ kind: "burst", from: pt(t.x, t.y), count: 50, spread: 30, gravity: -H() * 0.4, dur: 1300, stagger: 1500, glyphs: dot("#1a1208"), min: 6, max: 14, easing: "cubic-bezier(.1,.8,.5,1)" });
        const gush = fx.put('<div style="width:100%;height:100%;background:linear-gradient(#1a1208, #2a1e10);border-radius:40% 40% 0 0"></div>', t.x, t.y - H() * 0.2, { size: 22, h: H() * 0.4, style: { transformOrigin: "50% 100%" } });
        await fx.move(gush, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)", offset: 0.3 }, { transform: "scaleY(.9)", offset: 0.7 }, { transform: "scaleY(0)" }], { duration: 2400 });
        if (fx.reduced) await fx.wait(2000);
      }
    },

    // Mean Girls
    {
      id: 10625,
      run: async (fx) => {
        const wednesday = new Date().getDay() === 3;
        const pink = fx.wash("#ff8cc6", 0, { blend: "multiply", opacity: 0 });
        await fx.anim(pink, [{ opacity: 0 }, { opacity: wednesday ? 0.7 : 0.25 }], { duration: wednesday ? 600 : 150 });
        if (wednesday) {
          fx.seq([["E5", 1], ["G#5", 1], ["B5", 2]], { beat: 0.14, type: "triangle", vol: 0.08 });
          await fx.wait(2600);
        } else {
          await fx.wait(250);
        }
        await fx.fadeOut(pink, wednesday ? 600 : 150);
      }
    },

    // Clueless
    {
      id: 9603,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        for (let i = 0; i < 5; i++) {
          fx.style(s, { filter: "hue-rotate(" + (i * 70 + 40) + "deg) saturate(1.4)" });
          fx.tone(i < 4 ? 220 : 880, i < 4 ? 0.12 : 0.3, { type: "square", vol: 0.06 });
          await fx.wait(420);
        }
        fx.style(s, { filter: "none" });
        fx.seq([["C6", 1], ["E6", 1], ["G6", 2]], { beat: 0.1, type: "triangle", vol: 0.08 });
        A.sparkleOn(fx, s, 8, "#ffe0f0");
        await fx.wait(900);
      }
    },

    // Legally Blonde
    {
      id: 8835,
      run: async (fx) => {
        fx.wash("rgba(255,140,200,.25)", 2200, { blend: "multiply", fade: 300 });
        await fx.move(".kernel", [{ transform: "rotate(0)", transformOrigin: "50% 90%" }, { transform: "rotate(-35deg) translateY(6px)", transformOrigin: "50% 90%", offset: 0.4 }, { transform: "rotate(5deg) translateY(-8px)", transformOrigin: "50% 90%", offset: 0.6 }, { transform: "rotate(0)", transformOrigin: "50% 90%" }], { duration: 1100, easing: "ease-in-out" });
        fx.noise(0.04, { type: "bandpass", freq: 2500, q: 3, vol: 0.8 });
        A.sparkleOn(fx, ".kernel", 12, "#ffc8e8");
        fx.tone(1500, 0.3, { slide: 2500, vol: 0.08 });
        await fx.wait(1300);
      }
    },

    // Office Space
    {
      id: 1542,
      run: async (fx) => {
        const g = fx.glass('<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:86%;background:#c8c8c8;border:3px solid #1f1b16;box-shadow:4px 4px 0 #1f1b16;font:12px \'Special Elite\',monospace;color:#1f1b16"><div style="background:#1f3a8a;color:#fff;padding:3px 6px">Printer</div><div style="padding:12px 8px;text-align:center;font-size:16px">PC LOAD LETTER</div></div>');
        for (let i = 0; i < 5; i++) fx.noise(0.25, { type: "bandpass", freq: 300 + (i % 2) * 150, q: 3, vol: 0.3, at: i * 0.28 });
        fx.tone(90, 1.4, { type: "square", vol: 0.05, vibrato: [14, 20], filter: { freq: 400 } });
        await fx.wait(1800);
        for (let i = 0; i < 3; i++) {
          fx.thud({ freq: 100, vol: 0.6, dur: 0.2 });
          fx.shake("lg", 200);
          fx.buzz(60);
          await fx.wait(320);
        }
        if (g) fx.remove(g);
        await fx.wait(200);
      }
    },

    // Anchorman: The Legend of Ron Burgundy
    {
      id: 8699,
      run: async (fx) => {
        const fog = fx.glass("", { style: { background: "rgba(240,245,250,.0)", backdropFilter: "blur(0px)", webkitBackdropFilter: "blur(0px)" } });
        if (!fog) return;
        fx.noise(1.2, { type: "bandpass", freq: 1500, q: 1, vol: 0.15, attack: 0.2 });
        await fx.anim(fog, [{ background: "rgba(240,245,250,0)", backdropFilter: "blur(0px)", webkitBackdropFilter: "blur(0px)" }, { background: "rgba(240,245,250,.55)", backdropFilter: "blur(4px)", webkitBackdropFilter: "blur(4px)" }], { duration: 1800 });
        const drips = fx.node("", { parent: fog, style: { position: "absolute", inset: 0 } });
        for (let i = 0; i < 7; i++) {
          const d = document.createElement("div");
          d.style.cssText = "position:absolute;top:0;left:" + (8 + i * 13) + "%;width:3px;height:0;background:linear-gradient(transparent, rgba(255,255,255,.9));border-radius:2px";
          drips.appendChild(d);
          fx.anim(d, [{ height: "0%" }, { height: (40 + Math.random() * 50) + "%" }], { duration: 1200, delay: i * 120 });
        }
        fx.tone("D4", 0.6, { type: "sawtooth", vol: 0.04, vibrato: [6, 15], filter: { freq: 900 }, at: 0.3 });
        await fx.wait(2200);
        await fx.fadeOut(fog, 600);
      }
    },

    // Elf
    {
      id: 10719,
      run: async (fx) => {
        for (let i = 0; i < 16; i++) fx.noise(0.12, { type: "bandpass", freq: 6000 + (i % 3) * 800, q: 8, vol: 0.2, at: i * 0.15 });
        fx.style("#drawBtn", { backgroundImage: "repeating-linear-gradient(-45deg, #fbf4e2 0 14px, #d8261e 14px 28px)" }, 3600);
        fx.particles({ kind: "fall", count: 30, glyphs: A.snowflake, min: 8, max: 14, dur: 3000, stagger: 1500, spin: 180 });
        await fx.wait(3600);
      }
    },

    // It's a Wonderful Life
    {
      id: 1585,
      run: async (fx) => {
        const m = fx.rect(".machine-marquee");
        const bell = fx.put(A.S("0 0 40 44", '<path d="M20 4 C30 4 32 16 32 26 L36 34 H4 L8 26 C8 16 10 4 20 4 Z" fill="#d9a13a" ' + A.ink + ' stroke-width="2.5"/><circle cx="20" cy="38" r="4" fill="#d9a13a" ' + A.ink + ' stroke-width="2"/>'), m.x, m.top - 18, { size: 30, h: 33, style: { transformOrigin: "50% 0" } });
        fx.particles({ kind: "fall", count: 24, glyphs: A.snowflake, min: 6, max: 11, dur: 3200, stagger: 1500 });
        await fx.wait(600);
        [2093, 2637].forEach((f) => fx.tone(f, 2, { vol: 0.12 }));
        fx.tone(4186, 1.4, { vol: 0.04 });
        fx.move(bell, [{ transform: "rotate(-18deg)" }, { transform: "rotate(18deg)" }], { duration: 180, iterations: 6, direction: "alternate" });
        await fx.wait(500);
        const wings = A.S("0 0 60 30", '<path d="M30 20 C22 4 8 2 2 8 C10 10 12 16 14 20 C18 14 24 16 30 22 Z M30 20 C38 4 52 2 58 8 C50 10 48 16 46 20 C42 14 36 16 30 22 Z" fill="#fff" stroke="#1f1b16" stroke-width="1.5"/>');
        await fx.fly(wings, [m.x, m.top - 20], [m.x + 20, -40], { size: 40, h: 20, dur: 1600, easing: "ease-in" });
        await fx.fadeOut(bell, 300);
      }
    },

    // A Christmas Story
    {
      id: 850,
      run: async (fx) => {
        const r = fx.rect(".ticket-slot");
        const lamp = fx.put(A.S("0 0 50 100", '<path d="M8 4 H42 L38 22 H12 Z" fill="#ffd9a0" stroke="#1f1b16" stroke-width="2"/><path d="M8 4 C4 8 4 14 8 20 M42 4 C46 8 46 14 42 20" stroke="#1f1b16" stroke-width="1" fill="none"/><path d="M22 22 C18 40 20 60 22 76 L24 88 L34 92 L30 84 L28 72 C30 56 32 38 30 22 Z" fill="#f4c8a8" stroke="#1f1b16" stroke-width="2"/><path d="M19 30 C22 34 30 34 31 30" stroke="#1f1b16" stroke-width="1" fill="none"/><rect x="14" y="92" width="24" height="6" fill="#1f1b16"/>'), r.x, r.top - 50, { size: 44, h: 88, style: { filter: "drop-shadow(0 0 12px rgba(255,190,90,.9))" } });
        fx.tone(120, 2.4, { vol: 0.04, type: "sawtooth", filter: { freq: 200 } });
        fx.seq([["F4", 1], ["A4", 1], ["C5", 2]], { beat: 0.25, type: "triangle", vol: 0.06, at: 0.3 });
        await fx.anim(lamp, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
        await fx.wait(2400);
        await fx.fadeOut(lamp, 300);
      }
    },

    // National Lampoon's Christmas Vacation
    {
      id: 5825,
      run: async (fx) => {
        const m = fx.rect(".machine");
        const colors = ["#ff3a3a", "#3aff6a", "#3a8aff", "#ffd23a", "#ff7ad0"];
        const bulbs = [];
        const per = Math.round(m.width / 22);
        const pts = [];
        for (let i = 0; i <= per; i++) pts.push([m.left + (m.width * i) / per, m.top]);
        for (let i = 1; i <= Math.round(m.height / 22); i++) pts.push([m.left + m.width, m.top + i * 22], [m.left, m.top + i * 22]);
        pts.forEach(([x, y], i) => {
          const b = fx.put('<div style="width:100%;height:100%;border-radius:50% 50% 45% 45%;background:#555;border:1px solid #1f1b16"></div>', x, y, { size: 8, h: 11 });
          bulbs.push([b.firstChild, colors[i % colors.length]]);
        });
        await fx.wait(1300);
        fx.thud({ freq: 90, vol: 0.4, dur: 0.1 });
        fx.tone(60, 1.6, { type: "sawtooth", vol: 0.08, filter: { freq: 200 } });
        bulbs.forEach(([b, c]) => { b.style.background = c; b.style.boxShadow = "0 0 8px 3px " + c; });
        const glow = fx.wash("rgba(255,250,220,.35)", 0, { blend: "screen" });
        fx.chord(["C5", "E5", "G5", "C6"], 1.4, { vol: 0.07, attack: 0.1 });
        await fx.wait(1600);
        fx.noise(0.1, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.remove(glow);
        bulbs.forEach(([b]) => { b.style.background = "#555"; b.style.boxShadow = "none"; });
        await fx.wait(900);
      }
    },

    // The Goonies
    {
      id: 9340,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const map = fx.node("", { cls: "fx-filter", style: { background: "rgba(222,196,140,.5)", mixBlendMode: "multiply", opacity: 0 } });
        fx.fadeIn(map, 400);
        const start = [W() * 0.1, H() * 0.9];
        const path = fx.node('<svg style="position:absolute;inset:0;width:100%;height:100%"><path class="p" d="M' + start[0] + " " + start[1] + " C" + W() * 0.8 + " " + H() * 0.85 + " " + W() * 0.05 + " " + H() * 0.4 + " " + r.x + " " + r.y + '" pathLength="1" fill="none" stroke="#8a1a10" stroke-width="3" stroke-dasharray="0.02 0.015"/></svg>');
        fx.seq([["G4", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["G5", 2]], { beat: 0.2, type: "triangle", vol: 0.06 });
        const svg = path.firstChild;
        if (!fx.reduced) await fx.tween(1600, (q) => { svg.style.clipPath = "circle(" + q * 150 + "% at " + start[0] + "px " + start[1] + "px)"; });
        const x = fx.put('<div style="font:700 44px Shrikhand, Georgia;color:#b3140e;text-shadow:2px 2px 0 #1f1b16;text-align:center;line-height:1">✕</div>', r.x, r.y, { size: 50 });
        fx.anim(x, [{ transform: "scale(3)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 250 });
        fx.thud({ freq: 150, vol: 0.4 });
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 10, spread: 40, dur: 800, stagger: 100, glyphs: A.coin("#ffd21a"), min: 10, max: 16 });
        await fx.wait(1800);
        fx.fadeOut(path, 400);
        fx.fadeOut(x, 400);
        await fx.fadeOut(map, 400);
      }
    },

    // Stand by Me
    {
      id: 235,
      run: async (fx) => {
        const light = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle 2vmin at 50% 55%, #fffbe0, rgba(255,250,200,.4) 40%, transparent 70%)", opacity: 0 } });
        fx.tone(233, 2.6, { type: "sawtooth", vol: 0.08, attack: 0.4, filter: { freq: 900 } });
        fx.tone(294, 2.6, { type: "sawtooth", vol: 0.06, attack: 0.4, filter: { freq: 900 } });
        for (let i = 0; i < 16; i++) fx.thud({ freq: 120, vol: 0.1 + i * 0.02, dur: 0.08, at: i * 0.18 });
        await fx.tween(3000, (p) => {
          light.style.opacity = String(p);
          light.style.background = "radial-gradient(circle " + (2 + p * 60) + "vmin at 50% 55%, #fffbe0, rgba(255,250,200,.4) 40%, transparent 70%)";
        }, (p) => p * p);
        fx.shake("md", 500);
        fx.buzz(300);
        await fx.fadeOut(light, 300);
      }
    },

    // Jumanji (1995)
    {
      id: 8844,
      run: async (fx) => {
        for (let i = 0; i < 16; i++) {
          const accent = i % 4 === 0 || i % 4 === 3;
          fx.thud({ freq: accent ? 90 : 140, vol: 0.2 + i * 0.03, dur: 0.14, at: i * 0.2 });
        }
        const vines = fx.node(A.S("0 0 100 100", '<g fill="none" stroke="#3d7a2a" stroke-width="2.4" stroke-linecap="round"><path class="v" pathLength="1" d="M0 0 C20 10 10 30 30 34 C40 36 36 48 46 50"/><path class="v" pathLength="1" d="M100 0 C80 14 92 30 72 36 C62 40 66 52 56 54"/><path class="v" pathLength="1" d="M0 100 C18 88 8 70 28 66"/><path class="v" pathLength="1" d="M100 100 C84 86 94 70 74 66"/></g>'), { cls: "fx-filter" });
        vines.firstChild.setAttribute("preserveAspectRatio", "none");
        vines.firstChild.style.cssText = "width:100%;height:100%";
        const vs = vines.querySelectorAll(".v");
        vs.forEach((v) => { v.style.strokeDasharray = "1"; v.style.strokeDashoffset = fx.reduced ? "0" : "1"; });
        await fx.move(vs, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 3000, easing: "ease-out" });
        if (fx.reduced) await fx.wait(3000);
        await fx.fadeOut(vines, 500);
      }
    },

    // Jumanji: Welcome to the Jungle
    {
      id: 353486,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        const bars = ["▌▌▌", "▌▌", "▌"];
        fx.text(el, bars[0], 0);
        fx.style(el, { color: "#3aff6a", letterSpacing: "0.3em" }, 3200);
        fx.seq([["C5", 1], ["G5", 1], ["C6", 2]], { beat: 0.1, type: "square", vol: 0.05 });
        await fx.wait(1300);
        el.textContent = bars[1];
        fx.seq([["C5", 1], ["G4", 1], ["C4", 2]], { beat: 0.1, type: "square", vol: 0.05 });
        fx.move(el, [{ opacity: 1 }, { opacity: 0 }], { duration: 150, iterations: 6, direction: "alternate" });
        await fx.wait(1900);
      }
    },

    // Hook
    {
      id: 879,
      run: async (fx) => {
        const bell = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#fff,#fff4a0 40%,rgba(255,220,80,0) 70%)"></div>', 0, 0, { size: 22 });
        const P = [[W() * 0.1, H() * 0.7], [W() * 0.8, H() * 0.2], [W() * 0.3, H() * 0.3], [W() * 0.7, H() * 0.6], [W() * 0.5, -40]];
        for (let i = 0; i < 12; i++) fx.tone(3000 + (i % 4) * 500, 0.12, { vol: 0.04, at: i * 0.2 });
        if (fx.reduced) { bell.style.transform = "translate(" + W() / 2 + "px," + H() / 3 + "px)"; await fx.wait(2400); return; }
        await fx.tween(2600, (p) => {
          const seg = Math.min(P.length - 2, Math.floor(p * (P.length - 1)));
          const q = p * (P.length - 1) - seg;
          const x = P[seg][0] + (P[seg + 1][0] - P[seg][0]) * q, y = P[seg][1] + (P[seg + 1][1] - P[seg][1]) * q;
          bell.style.transform = "translate(" + (x - 11) + "px," + (y - 11) + "px)";
          if (Math.random() < 0.35) {
            const sp = fx.put(A.sparkle("#fff4a0"), x, y, { size: 8 });
            fx.anim(sp, [{ opacity: 1 }, { opacity: 0, transform: "translateY(12px)" }], { duration: 600 }).then(() => fx.remove(sp));
          }
        });
      }
    },

    // Labyrinth
    {
      id: 13597,
      run: async (fx) => {
        const h = fx.rect("body > header");
        const orb = '<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 30%, #fff, rgba(220,235,255,.5) 30%, rgba(160,190,230,.25) 60%, rgba(255,255,255,.6) 100%);box-shadow:0 0 12px rgba(255,255,255,.8)"></div>';
        fx.tone("A5", 3, { vol: 0.05, vibrato: [4, 12], attack: 0.5 });
        fx.tone("E6", 3, { vol: 0.03, vibrato: [5, 12], attack: 0.8 });
        await fx.fly(orb, [h.left + 20, h.top + h.height + 8], [h.left + h.width - 20, h.top + h.height + 8], { size: 34, dur: 3000, via: [h.x, h.top + h.height - 16], r2: 540, easing: "ease-in-out" });
      }
    },

    // The NeverEnding Story
    {
      id: 34584,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const size = Math.max(r.width, r.height) * 1.4;
        const auryn = fx.put(A.S("0 0 100 100", '<ellipse class="a" cx="42" cy="50" rx="26" ry="36" pathLength="1" fill="none" stroke="#d9a13a" stroke-width="6" style="filter:drop-shadow(0 0 3px #fff2a0)"/><ellipse class="a" cx="58" cy="50" rx="26" ry="36" pathLength="1" fill="none" stroke="#b8c0c4" stroke-width="6" style="filter:drop-shadow(0 0 3px #fff)"/><circle cx="42" cy="14" r="5" fill="#d9a13a"/><circle cx="58" cy="86" r="5" fill="#b8c0c4"/>'), r.x, r.y, { size });
        const as = auryn.querySelectorAll(".a");
        as.forEach((a) => { a.style.strokeDasharray = "1"; a.style.strokeDashoffset = fx.reduced ? "0" : "1"; });
        fx.chord(["D5", "A5", "D6"], 2.6, { vol: 0.05, attack: 0.6 });
        await fx.move(as, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1600, easing: "ease-in-out" });
        await fx.wait(1300);
        await fx.fadeOut(auryn, 500);
      }
    },

    // The Karate Kid (1984)
    {
      id: 1885,
      run: async (fx) => {
        const g = fx.rect("#grid");
        const wipe = (cx, dir) => {
          const el = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, rgba(255,255,255,.55), rgba(255,255,255,0) 60%)"><svg viewBox="0 0 30 30" style="width:60%;height:60%;margin:20%"><use href="#glove"/></svg></div>', cx, g.y, { size: 70 });
          fx.tween(1600, (p) => {
            const a = dir * p * Math.PI * 4;
            el.style.transform = "translate(" + Math.cos(a) * 26 + "px," + Math.sin(a) * 26 + "px)";
          });
          return el;
        };
        const a = wipe(g.left + g.width * 0.3, 1), b = wipe(g.left + g.width * 0.7, -1);
        for (let i = 0; i < 8; i++) fx.noise(0.18, { type: "bandpass", freq: 1800, q: 1, vol: 0.12, at: i * 0.2 });
        await fx.wait(1700);
        fx.remove(a);
        fx.remove(b);
        A.sparkleOn(fx, "#grid", 14, "#fff");
        fx.tone(3000, 0.4, { vol: 0.06 });
        fx.tone(4500, 0.3, { vol: 0.04, at: 0.1 });
        await fx.wait(900);
      }
    },

    // Big (1988)
    {
      id: 2280,
      run: async (fx) => {
        fx.marquee("ZOLTAR SPEAKS", 5200);
        fx.style(".machine-marquee .marquee-text", { color: "#ff9a3a", textShadow: "0 0 6px #ff6a00" }, 5200);
        fx.chord(["A3", "C4", "E4"], 1.4, { type: "sawtooth", vol: 0.05, filter: { freq: 700 } });
        const t = fx.rect(".ticket-slot");
        const card = fx.put('<div style="width:100%;height:100%;background:#fbf4e2;border:2px solid #1f1b16;font:11px/1.2 \'Special Elite\',monospace;color:#1f1b16;text-align:center;padding:6px 4px">★<br>YOUR WISH<br>IS GRANTED</div>', t.x, t.y, { size: 84, h: 56 });
        await fx.move(card, [{ transform: "translateY(0) scaleY(0)", transformOrigin: "50% 0" }, { transform: "translateY(10px) scaleY(1)", transformOrigin: "50% 0" }], { duration: 900, easing: "steps(8)" });
        // Floor piano - tap a key.
        const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
        const piano = fx.node("", { cls: "fx-tap", style: { position: "absolute", left: "50%", bottom: "calc(8px + env(safe-area-inset-bottom))", transform: "translateX(-50%)", display: "flex", width: "min(92vw, 380px)", height: "64px", border: "3px solid #1f1b16", boxShadow: "3px 4px 0 #1f1b16", background: "#1f1b16", gap: "3px" } });
        notes.forEach((n) => {
          const k = document.createElement("button");
          k.type = "button";
          k.setAttribute("aria-label", n);
          k.style.cssText = "flex:1;border:0;background:#fbf4e2;cursor:pointer;padding:0;min-height:0;touch-action:manipulation";
          k.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            k.style.background = "#d9a13a";
            fx.tone(n, 0.5, { type: "triangle", vol: 0.25 });
            setTimeout(() => { k.style.background = "#fbf4e2"; }, 160);
          });
          piano.appendChild(k);
        });
        fx.move(piano, [{ transform: "translate(-50%, 100px)" }, { transform: "translate(-50%, 0)" }], { duration: 400, easing: "ease-out" });
        fx.seq(notes.map((n) => [n, 1]), { beat: 0.12, type: "triangle", vol: 0.1 });
        await fx.wait(5200);
        fx.fadeOut(card, 300);
        await fx.fadeOut(piano, 300);
      }
    },

    // Honey, I Shrunk the Kids
    {
      id: 9354,
      run: async (fx) => {
        const s = fx.slot();
        const ant = A.S("0 0 120 60", '<ellipse cx="24" cy="30" rx="18" ry="14" fill="#2a1a10"/><ellipse cx="56" cy="32" rx="12" ry="10" fill="#2a1a10"/><circle cx="84" cy="28" r="12" fill="#2a1a10"/><path d="M90 18 C100 6 110 6 116 10 M88 18 C94 4 102 0 108 2 M30 40 L20 58 M50 42 L50 58 M62 40 L74 58 M28 22 L16 6 M52 24 L52 8 M62 24 L76 8" stroke="#2a1a10" stroke-width="3" fill="none"/><circle cx="90" cy="26" r="2.5" fill="#fbf4e2"/>');
        fx.tone(3000, 0.5, { slide: 300, vol: 0.08 });
        if (s) fx.move(s, [{ transform: "scale(1)" }, { transform: "scale(.3)", offset: 0.2 }, { transform: "scale(.3)", offset: 0.85 }, { transform: "scale(1)" }], { duration: 3600 });
        for (let i = 0; i < 10; i++) fx.thud({ freq: 160, vol: 0.12, dur: 0.06, at: 0.4 + i * 0.25 });
        await fx.fly(ant, [-140, H() - 70], [W() + 140, H() - 80], { size: 180, h: 90, dur: 3000, flip: true, easing: "steps(24)" });
        await fx.wait(600);
      }
    },

    // Ready Player One
    {
      id: 333339,
      repeat: "once",
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const egg = fx.put('<svg viewBox="0 0 12 16" shape-rendering="crispEdges" style="width:100%;height:100%;filter:drop-shadow(0 0 10px #ffd84a)"><path d="M4 0h4v1h1v2h1v2h1v2h1v5h-1v2h-1v1h-2v1h-4v-1h-2v-1h-1v-2h-1v-5h1v-2h1v-2h1v-2h1z" fill="#ffd84a"/><path d="M4 2h2v1h-1v2h-1zM3 6h1v2h-1z" fill="#fff6c0"/><path d="M9 9h1v3h-1v1h-2v-1h2z" fill="#c9951a"/></svg>', r.x, r.y - r.height * 0.1, { size: 44, h: 58 });
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["C6", 1], ["G5", 1], ["C6", 3]], { beat: 0.11, type: "square", vol: 0.06 });
        await fx.anim(egg, [{ transform: "translateY(-" + H() * 0.4 + "px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }], { duration: fx.reduced ? 10 : 700, easing: "steps(10)" });
        A.sparkleOn(fx, egg, 16, "#fff4a0");
        fx.move(egg, [{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], { duration: 300, iterations: 6, direction: "alternate", easing: "steps(2)" });
        await fx.wait(2400);
        await fx.fadeOut(egg, 400);
      }
    },

    // Ghost (1990)
    {
      id: 251,
      repeat: "sometimes",
      chance: 0.4,
      run: async (fx) => {
        const x = W() - 22;
        const penny = fx.put(A.coin("#c7773a"), x, H() - 40, { size: 20 });
        fx.chord(["F4", "A4", "C5", "E5"], 3.6, { type: "sine", vol: 0.04, attack: 1 });
        await fx.move(penny, [{ transform: "translateY(0)" }, { transform: "translateY(-" + H() * 0.6 + "px)" }], { duration: 3600, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
        await fx.fadeOut(penny, 400);
      }
    },

    // Dirty Dancing
    {
      id: 88,
      run: async (fx) => {
        const s = A.liftSlot(fx, 3600);
        if (!s) return;
        const r = fx.rect(s);
        const corner = [0, 3, 12, 15].includes(fx.slotIndex);
        fx.chord(["D4", "F#4", "A4", "D5"], 3, { type: "triangle", vol: 0.06, attack: 0.6 });
        const dx = corner ? (W() / 2 - r.x) * 0.5 : 0;
        await fx.move(s, [{ transform: "none" }, { transform: "translate(" + dx + "px,-40px) scale(1.08)" }], { duration: 1400, easing: "ease-out" });
        fx.noise(1, { freq: 1500, vol: 0.05, attack: 0.3 });
        await fx.wait(fx.reduced ? 2800 : 1600);
        await fx.move(s, [{ transform: "translate(" + dx + "px,-40px) scale(1.08)" }, { transform: "none" }], { duration: 500 });
      }
    },

    // Grease
    {
      id: 621,
      run: async (fx) => {
        fx.wash("rgba(255,180,200,.2)", 3200, { blend: "multiply", fade: 300 });
        fx.seq([["C4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["G4", 1], ["E4", 1]], { beat: 0.2, type: "square", vol: 0.04, filter: { freq: 1200 } });
        await fx.fly(A.car("#d8261e"), [W() * 0.3, H() + 40], [W() * 0.7, -60], { size: 90, h: 41, dur: 2800, via: [W() * 0.45, H() * 0.5], r0: -8, r1: -20, r2: -10, easing: "ease-in" });
      }
    },

    // Saturday Night Fever
    {
      id: 11009,
      run: async (fx) => {
        const slots = fx.$$("#grid .slot");
        const colors = ["#ff3a8a", "#3ae0ff", "#ffd23a", "#7a3aff", "#3aff7a"];
        for (let b = 0; b < 8; b++) {
          fx.thud({ freq: 70, vol: 0.45, dur: 0.12 });
          fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.15, at: 0.25 });
          slots.forEach((s, i) => { if ((i + b) % 3 === 0) fx.style(s, { boxShadow: "0 0 14px 5px " + colors[(i + b) % colors.length] }, 250); });
          await fx.wait(500);
        }
      }
    },

    // The Rocky Horror Picture Show
    {
      id: 36685,
      run: async (fx) => {
        fx.seq([["E4", 1], ["A4", 1], [null, 1], ["B4", 1], ["C#5", 2]], { beat: 0.25, type: "square", vol: 0.05, filter: { freq: 1500 } });
        const parts = fx.pageParts();
        if (fx.reduced) fx.wash("rgba(200,20,40,.22)", 2000, { fade: 300 });
        await fx.move(parts, [{ transform: "translateX(0)" }, { transform: "translateX(-24px) translateY(-10px)", offset: 0.2 }, { transform: "translateX(-24px)", offset: 0.3 }, { transform: "translateX(0)", offset: 0.55 }, { transform: "translateX(0) scale(1.03)", offset: 0.75 }, { transform: "none" }], { duration: 2000, easing: "ease-in-out", fill: "none" });
        if (fx.reduced) await fx.wait(2000);
        fx.thud({ vol: 0.3 });
      }
    },

    // American Psycho
    {
      id: 1359,
      run: async (fx) => {
        const cards = ["#fbfbf4", "#f4efe0", "#efe9d6", "#e9e2cb"];
        const cy = H() * 0.45;
        for (let i = 0; i < cards.length; i++) {
          const c = fx.put('<div style="width:100%;height:100%;background:' + cards[i] + ';border:1px solid #bbb;box-shadow:2px 3px 6px rgba(0,0,0,.25);display:flex;flex-direction:column;align-items:center;justify-content:center;font:9px/1.4 Georgia;letter-spacing:.2em;color:#333"><div style="width:60%;height:1px;background:#999;margin-bottom:6px"></div>VICE PRESIDENT<div style="width:40%;height:1px;background:#bbb;margin-top:6px"></div></div>', W() / 2 + (i - 1.5) * 14, cy + (i - 1.5) * 10, { size: 160, h: 90 });
          fx.move(c, [{ transform: "translateY(" + H() * 0.6 + "px)" }, { transform: "none" }], { duration: 300, easing: "ease-out" });
          fx.noise(0.1, { type: "bandpass", freq: 3000, vol: 0.2 });
          await fx.wait(700);
        }
        fx.tone(3900, 1, { vol: 0.03 });
        await fx.wait(1000);
      }
    },

    // Drive (2011)
    {
      id: 64690,
      run: async (fx) => {
        const h1 = fx.$("body > header h1");
        fx.style(h1, { fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontStyle: "italic", color: "#ff4fb4", textShadow: "0 0 6px #ff4fb4, 0 0 18px #ff1a8c", WebkitTextStroke: "0", rotate: "-4deg" }, 4200);
        fx.wash("linear-gradient(rgba(40,10,60,.35), rgba(255,80,160,.2))", 4200, { blend: "multiply", fade: 400 });
        const arp = ["A3", "C4", "E4", "A4"];
        for (let i = 0; i < 16; i++) fx.tone(arp[i % 4], 0.18, { type: "sawtooth", vol: 0.04, at: i * 0.2, filter: { freq: 1400 } });
        fx.tone("A2", 3.2, { type: "sawtooth", vol: 0.06, filter: { freq: 500 } });
        await fx.wait(4200);
      }
    },

    // Her
    {
      id: 152601,
      run: async (fx) => {
        fx.wash("rgba(255,120,80,.25)", 4000, { blend: "multiply", fade: 500 });
        const m = fx.$(".machine-marquee");
        fx.style(".machine-marquee .marquee-text, .machine-marquee .marquee-sub", { visibility: "hidden" }, 4000);
        const wave = fx.node('<svg viewBox="0 0 200 30" preserveAspectRatio="none" style="width:100%;height:100%"><path class="w" d="M0 15 H200" stroke="#fbe6d0" stroke-width="2" fill="none"/></svg>', { parent: m, style: { position: "absolute", left: "44px", right: "44px", top: "50%", height: "30px", marginTop: "-15px" } });
        const path = wave.querySelector(".w");
        fx.tone("A4", 3.2, { vol: 0.04, vibrato: [4, 6], attack: 0.6 });
        await fx.tween(3600, (p) => {
          let d = "M0 15";
          const amp = Math.sin(p * Math.PI) * (6 + Math.sin(p * 40) * 5);
          for (let x = 0; x <= 200; x += 8) d += " L" + x + " " + (15 + Math.sin(x / 12 + p * 30) * amp * Math.sin((x / 200) * Math.PI));
          path.setAttribute("d", d);
        });
      }
    },

    // Lost in Translation
    {
      id: 153,
      repeat: "sometimes",
      chance: 0.4,
      run: async (fx) => {
        fx.wash("linear-gradient(135deg, rgba(255,60,160,.25), rgba(40,120,255,.25))", 3600, { blend: "screen", fade: 500 });
        await fx.wait(1200);
        fx.noise(1.2, { type: "bandpass", freq: 2200, q: 2, vol: 0.05, attack: 0.3, pan: 0.6 });
        fx.noise(0.8, { type: "bandpass", freq: 1500, q: 2, vol: 0.04, attack: 0.2, at: 0.5, pan: 0.6 });
        await fx.wait(2400);
      }
    },

    // Moonlight
    {
      id: 376867,
      run: async (fx) => {
        fx.wash("rgba(30,80,200,.4)", 4200, { blend: "multiply", fade: 800 });
        fx.noise(4, { freq: 500, sweep: 900, vol: 0.12, attack: 1.5 });
        fx.chord(["E4", "G#4", "B4", "D#5"], 3.6, { type: "sine", vol: 0.05, attack: 1.2 });
        await fx.wait(4200);
      }
    },

    // 12 Monkeys
    {
      id: 63,
      run: async (fx) => {
        const r = fx.rect(".machine");
        const tag = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="42" fill="none" stroke="#c8141e" stroke-width="6" stroke-dasharray="20 6 30 4 40 6"/><g fill="#c8141e"><circle cx="30" cy="42" r="6"/><circle cx="70" cy="42" r="6"/><circle cx="50" cy="46" r="14"/><ellipse cx="50" cy="60" rx="10" ry="8"/></g><circle cx="44" cy="44" r="2" fill="#fbf4e2"/><circle cx="56" cy="44" r="2" fill="#fbf4e2"/>'), r.left + r.width * 0.78, r.top + r.height * 0.82, { size: 80, style: { opacity: 0.85, filter: "blur(.4px)" } });
        fx.noise(0.9, { type: "highpass", freq: 3000, vol: 0.3, attack: 0.05 });
        await fx.anim(tag, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: fx.reduced ? 10 : 800, easing: "steps(8)" });
        await fx.wait(2600);
        await fx.fadeOut(tag, 500);
      }
    },

    // Brazil
    {
      id: 68,
      run: async (fx) => {
        const paper = '<div style="width:100%;height:100%;background:#f7f3e6;border:1px solid #999;background-image:repeating-linear-gradient(transparent 0 5px, #bbb 5px 6px)"></div>';
        fx.noise(2.8, { type: "bandpass", freq: 900, q: 0.6, vol: 0.25, attack: 0.3 });
        for (let i = 0; i < 12; i++) fx.noise(0.03, { type: "bandpass", freq: 2500, q: 3, vol: 0.2, at: 0.2 + i * 0.12 });
        const m = fx.rect(".machine-marquee");
        await fx.particles({ kind: "burst", from: pt(m.x, m.y), count: 30, spread: 120, gravity: H() * 0.3, dur: 2400, stagger: 800, glyphs: paper, min: 16, max: 28, spin: 720 });
      }
    },

    // Snatch
    {
      id: 107,
      repeat: "sometimes",
      chance: 0.5,
      run: async (fx) => {
        fx.onNextTap(() => {
          fx.tone(1400, 0.12, { type: "square", slide: 2000, vol: 0.12, filter: { type: "bandpass", freq: 1800, q: 4 } });
          fx.tone(1900, 0.14, { type: "square", slide: 1300, vol: 0.12, at: 0.13, filter: { type: "bandpass", freq: 1800, q: 4 } });
        }, 12000);
        await fx.wait(12000);
      }
    },

    // Run Lola Run
    {
      id: 104,
      run: async (fx) => {
        const y = fx.rect(".cta-stage").top - 18;
        for (let run = 0; run < 3; run++) {
          for (let i = 0; i < 6; i++) fx.click({ freq: 1800, vol: 0.3, at: i * 0.18 });
          fx.fly('<div style="width:100%;height:100%;border-radius:50%;background:#ff2a1a;box-shadow:-30px 0 20px -4px rgba(255,42,26,.6)"></div>', [-30, y + run * 8], [W() + 30, y + run * 8], { size: 18, dur: 700, easing: "ease-in" });
          await fx.wait(1100);
        }
      }
    },

    // Requiem for a Dream
    {
      id: 641,
      run: async (fx) => {
        const s = A.liftSlot(fx, 3000);
        for (let i = 0; i < 3; i++) {
          fx.noise(0.15, { type: "highpass", freq: 3000, vol: 0.5 });
          fx.click({ freq: 1000, vol: 0.6, at: 0.1 });
          if (s) await fx.move(s, [{ transform: "none" }, { transform: "scale(1.5)" }, { transform: "none" }], { duration: 260, easing: "steps(2)" });
          const eye = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, #000 20%, #5a7a4a 22%, #3a5a2a 55%, #fff 58%)"></div>', W() / 2, H() / 2, { size: Math.min(W(), H()) * 0.5 });
          await fx.anim(eye, [{ transform: "scale(1)" }, { transform: "scale(1.15)" }], { duration: 220 });
          fx.remove(eye);
          await fx.wait(380);
        }
      }
    }
  ]);
})();
