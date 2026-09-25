/* Machine FX cues - horror, thrillers and mysteries.
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
  const glove = (fill) => '<svg viewBox="0 0 30 30"><use href="#glove"' + (fill ? ' style="filter:' + fill + '"' : "") + "/></svg>";

  M.register([
    // Halloween (1978)
    {
      id: 948,
      run: async (fx) => {
        // Two eyeholes cut from one black sheet
        const mask = fx.node("", { cls: "fx-filter", style: { background: "#050403" } });
        mask.style.webkitMaskImage = mask.style.maskImage = "radial-gradient(ellipse 13vmin 8vmin at 38% 46%, transparent 80%, #000 100%), radial-gradient(ellipse 13vmin 8vmin at 62% 46%, transparent 80%, #000 100%)";
        mask.style.webkitMaskComposite = "source-in";
        mask.style.maskComposite = "intersect";
        fx.wash("rgba(255,140,40,.15)", 4000, { blend: "multiply" });
        for (let i = 0; i < 3; i++) {
          fx.noise(0.9, { type: "bandpass", freq: 600, q: 1.2, vol: 0.25, attack: 0.4, at: i * 1.3 });
          fx.noise(0.6, { type: "bandpass", freq: 900, q: 1.2, vol: 0.15, attack: 0.1, at: i * 1.3 + 0.8 });
        }
        await fx.move(mask, [{ transform: "translate(0,0)" }, { transform: "translate(-6px,4px)" }, { transform: "translate(5px,-2px)" }, { transform: "translate(0,0)" }], { duration: 3800, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3600);
        await fx.fadeOut(mask, 300);
      }
    },

    // A Nightmare on Elm Street (1984)
    {
      id: 377,
      run: async (fx) => {
        const g = fx.glass(A.S("0 0 100 100", [0, 1, 2, 3].map((i) =>
          '<path class="c" d="M' + (18 + i * 16) + " " + (8 + i * 3) + " C" + (30 + i * 16) + " 40 " + (22 + i * 16) + " 70 " + (38 + i * 16) + " " + (94 - i * 2) + '" pathLength="1" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 1px #000)"/>').join("")));
        if (!g) return;
        g.firstChild.setAttribute("preserveAspectRatio", "none");
        g.firstChild.style.cssText = "width:100%;height:100%";
        const lines = g.querySelectorAll(".c");
        lines.forEach((l) => { l.style.strokeDasharray = "1"; l.style.strokeDashoffset = fx.reduced ? "0" : "1"; });
        fx.tone(2600, 0.9, { type: "sawtooth", vol: 0.08, vibrato: [30, 60], filter: { type: "bandpass", freq: 3000, q: 4 } });
        fx.noise(0.9, { type: "bandpass", freq: 4000, q: 6, vol: 0.18 });
        await fx.move(lines, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 800, easing: "ease-in" });
        await fx.wait(2200);
        await fx.fadeOut(g, 500);
      }
    },

    // Friday the 13th (1980)
    {
      id: 4488,
      run: async (fx) => {
        const fog = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(transparent 50%, rgba(220,230,235,.7))", opacity: 0 } });
        fx.fadeIn(fog, 1000);
        [1, 0.45, 0.2].forEach((v, echo) => {
          const base = echo * 0.5;
          for (let i = 0; i < 3; i++) fx.noise(0.07, { type: "bandpass", freq: 5200, q: 3, vol: 0.4 * v, at: base + i * 0.12 });
          for (let i = 0; i < 3; i++) fx.noise(0.14, { type: "bandpass", freq: 1500, q: 2, vol: 0.35 * v, at: base + 0.45 + i * 0.16 });
        });
        await fx.wait(3200);
        await fx.fadeOut(fog, 800);
      }
    },

    // Scream (1996)
    {
      id: 4232,
      run: async (fx) => {
        fx.sfxSeq([["ring", 0, { dur: 1.2 }], ["ring", 2000, { dur: 1.2 }]]);
        for (let ring = 0; ring < 2; ring++) {
          const t = ring * 2;
          for (let k = 0; k < 12; k++) {
            fx.tone(440, 0.05, { vol: 0.15, at: t + k * 0.1 });
            fx.tone(480, 0.05, { vol: 0.15, at: t + k * 0.1 });
          }
          fx.later(ring * 2000, () => {
            fx.buzz([100, 50, 100, 50, 100, 50, 100]);
            if (fx.reduced) fx.style(".machine-marquee", { boxShadow: "0 0 0 3px #d9a13a, 0 0 0 5px #1f1b16, 0 0 22px 8px #ff4a3a" }, 1200);
            fx.move(".machine", Array.from({ length: 13 }, (_, i) => ({ transform: "translateX(" + (i % 2 ? 2 : -2) + "px)" })).concat([{ transform: "none" }]), { duration: 1200, easing: "steps(13)", fill: "none" });
          });
        }
        await fx.wait(4200);
      }
    },

    // The Exorcist
    {
      id: 9552,
      run: async (fx) => {
        fx.wash("rgba(120,160,220,.3)", 4200, { blend: "multiply", fade: 500 });
        fx.tone(55, 3.6, { type: "sawtooth", vol: 0.12, vibrato: [7, 4], filter: { freq: 240 }, attack: 0.6 });
        fx.shake("sm", 1200);
        await fx.wait(600);
        await fx.move(".reely", [{ transform: "rotate(0)", transformOrigin: "50% 40%" }, { transform: "rotate(180deg)", transformOrigin: "50% 40%", offset: 0.45 }, { transform: "rotate(180deg)", transformOrigin: "50% 40%", offset: 0.6 }, { transform: "rotate(360deg)", transformOrigin: "50% 40%" }], { duration: 3000, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Poltergeist (1982)
    {
      id: 609,
      run: async (fx) => {
        const g = fx.glass('<div class="fx-static" style="position:absolute;inset:0;opacity:.9"></div>');
        if (!g) return;
        fx.sfxSeq([["crt-on", 0, { vol: 0.7 }], ["static", 250, { dur: 3.1, vol: 0.45 }]]);
        await fx.wait(1100);
        [[30, 40, -10], [66, 58, 12]].forEach(([x, y, rot], i) => {
          fx.later(i * 500, () => {
            const hand = fx.node(glove("brightness(1.1)"), { parent: g, style: { position: "absolute", left: x + "%", top: y + "%", width: "70px", height: "70px", margin: "-35px 0 0 -35px", transform: "rotate(" + rot + "deg)", opacity: 0.85 } });
            fx.anim(hand, [{ transform: "rotate(" + rot + "deg) scale(.6)", opacity: 0 }, { transform: "rotate(" + rot + "deg) scale(1)", opacity: 0.9 }], { duration: 400 });
            fx.thud({ freq: 150, vol: 0.2, dur: 0.1 });
          });
        });
        await fx.wait(2300);
      }
    },

    // It (2017)
    {
      id: 346364,
      run: async (fx) => {
        const y = H() - 30;
        const boat = fx.fly(A.S("0 0 60 36", '<path d="M4 20 H56 L46 34 H14 Z" fill="#f1e3c2" ' + A.ink + ' stroke-width="2"/><path d="M30 20 V2 L44 18 Z" fill="#f1e3c2" ' + A.ink + ' stroke-width="2"/>'), [-40, y], [W() + 40, y], { size: 40, h: 24, dur: 3800 });
        fx.tone("A3", 3.4, { type: "triangle", vol: 0.05, vibrato: [3, 6], attack: 1 });
        fx.tone("Eb4", 3.4, { type: "triangle", vol: 0.03, vibrato: [2.5, 6], attack: 1.4 });
        const x = W() * 0.62;
        await fx.fly(A.balloon("#d0141e"), [x, H() + 60], [x - 20, -90], { size: 34, h: 76, dur: 4200, via: [x + 30, H() * 0.5], easing: "ease-in-out" });
        await boat;
      }
    },

    // Get Out
    {
      id: 419430,
      run: async (fx) => {
        [0, 0.55, 1.1, 1.4, 1.6].forEach((t) => {
          fx.tone(2640, 0.6, { vol: 0.12, at: t });
          fx.tone(4190, 0.3, { vol: 0.05, at: t });
        });
        await fx.wait(1800);
        const void_ = fx.wash("#000", 0, { opacity: 0 });
        fx.anim(void_, [{ opacity: 0 }, { opacity: 0.92 }], { duration: 900 });
        fx.tone(40, 3, { type: "sine", slide: 30, vol: 0.3, attack: 0.5 });
        const s = A.liftSlot(fx);
        if (s) fx.move(s, [{ transform: "none", opacity: 1 }, { transform: "translateY(60px) scale(.25)", opacity: 0.5 }], { duration: 2400, easing: "ease-in" });
        await fx.wait(2800);
        if (s) fx.move(s, [{ transform: "translateY(60px) scale(.25)" }, { transform: "none" }], { duration: 250 });
        await fx.fadeOut(void_, 250);
      }
    },

    // Hereditary
    {
      id: 493922,
      run: async (fx) => {
        const band = (top) => fx.node("", { style: { position: "absolute", left: 0, right: 0, height: "22vh", [top ? "top" : "bottom"]: 0, backdropFilter: "blur(3px) saturate(1.3)", webkitBackdropFilter: "blur(3px) saturate(1.3)", opacity: 0 } });
        const a = band(true), b = band(false);
        fx.anim([a, b], [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
        await fx.wait(1500);
        fx.noise(0.03, { type: "bandpass", freq: 1700, q: 8, vol: 0.9 });
        fx.tone(1100, 0.03, { vol: 0.2 });
        await fx.wait(2000);
        fx.anim([a, b], [{ opacity: 1 }, { opacity: 0 }], { duration: 600 });
        await fx.wait(600);
      }
    },

    // The Ring (2002)
    {
      id: 565,
      run: async (fx) => {
        const black = fx.node('<div style="position:absolute;left:50%;top:45%;width:36vmin;height:36vmin;margin:-18vmin 0 0 -18vmin;border-radius:50%;box-shadow:0 0 0 1.4vmin #f4f7ff, 0 0 30px 3vmin rgba(220,235,255,.6), inset 0 0 20px 2vmin rgba(220,235,255,.45)"></div>', { cls: "fx-filter", style: { background: "#050505" } });
        fx.sfx("static", { dur: 1.8, vol: 0.3 });
        fx.tone(98, 1.8, { type: "sine", vol: 0.2, attack: 0.4 });
        await fx.wait(1900);
        fx.remove(black);
        fx.sfx("crt-off", { vol: 0.7 });
        const s = fx.slot();
        if (!s) return;
        fx.style(s, { filter: "grayscale(.6) contrast(1.4)" }, 1600);
        await fx.move(s, [{ transform: "none" }, { transform: "skewX(8deg) translateY(4px)" }, { transform: "skewX(-3deg)" }, { transform: "skewY(4deg) translateX(3px)" }, { transform: "skewX(6deg)" }, { transform: "none" }], { duration: 1300, easing: "steps(5)" });
        fx.tone(60, 0.2, { type: "square", vol: 0.1 });
      }
    },

    // Gremlins
    {
      id: 927,
      run: async (fx) => {
        const m = fx.rect(".machine");
        const ears = fx.put(A.S("0 0 120 50", '<path d="M40 44 C20 40 2 24 4 10 C18 12 34 24 48 38 Z M80 44 C100 40 118 24 116 10 C102 12 86 24 72 38 Z" fill="#b08a5a" ' + A.ink + ' stroke-width="2.5"/><path d="M36 36 C24 30 14 22 10 14 M84 36 C96 30 106 22 110 14" stroke="#e8b8a8" stroke-width="4" fill="none"/><path d="M40 50 C40 30 80 30 80 50 Z" fill="#b08a5a" ' + A.ink + ' stroke-width="2.5"/><circle cx="52" cy="44" r="4" fill="#1f1b16"/><circle cx="68" cy="44" r="4" fill="#1f1b16"/>'), m.left + m.width * 0.7, m.top - 2, { size: 90, h: 38 });
        fx.move(ears, [{ transform: "translateY(30px)" }, { transform: "translateY(0)" }], { duration: 500, easing: "ease-out" });
        fx.tone("C6", 0.25, { type: "triangle", vol: 0.08, vibrato: [8, 30], at: 0.6 });
        fx.tone("E6", 0.4, { type: "triangle", vol: 0.08, vibrato: [8, 30], at: 0.9 });
        await fx.wait(1500);
        const dx = m.left + m.width * 0.7;
        await fx.fly(A.drop("#9fd8ff"), [dx, -20], [dx, m.top - 20], { size: 12, h: 18, dur: 700, easing: "ease-in" });
        for (let i = 0; i < 3; i++) {
          fx.tone(900 + i * 200, 0.08, { vol: 0.12, at: i * 0.15 });
          fx.later(i * 150, () => fx.particles({ kind: "burst", from: pt(dx, m.top - 16), count: 4, spread: 20, dur: 500, stagger: 0, glyphs: dot("#8a6a4a"), min: 6, max: 10 }));
        }
        await fx.wait(900);
        await fx.move(ears, [{ transform: "none" }, { transform: "translateY(40px)" }], { duration: 300 });
        fx.remove(ears);
      }
    },

    // Beetlejuice
    {
      id: 4011,
      run: async (fx) => {
        const s = fx.slot();
        // Once... twice... three times.
        for (let i = 0; i < 3; i++) {
          fx.sfx("air", { dur: 0.45, vol: 0.5 + i * 0.25 });
          if (s) fx.style(s, { filter: "grayscale(1) contrast(1.4)" }, 300);
          await fx.wait(550);
        }
        const stripes = fx.node("", { cls: "fx-filter", style: { background: "repeating-linear-gradient(90deg, rgba(255,255,255,.9) 0 26px, rgba(15,15,15,.9) 26px 52px)", mixBlendMode: "multiply", opacity: 0 } });
        fx.flash("#b7ff5a", 250);
        fx.sfx("sting", { vol: 0.9 });
        fx.noise(1.2, { freq: 1500, sweep: 100, vol: 0.4 });
        fx.shake("lg", 700);
        fx.buzz([120, 60, 120]);
        await fx.anim(stripes, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 250 });
        fx.wash("rgba(150,255,80,.25)", 2000, { blend: "screen" });
        fx.seq([["C4", 1], ["Eb4", 1], ["F#4", 1], ["C5", 2]], { beat: 0.16, type: "square", vol: 0.05 });
        await fx.wait(2300);
        await fx.fadeOut(stripes, 400);
      }
    },

    // Edward Scissorhands
    {
      id: 162,
      run: async (fx) => {
        fx.particles({ kind: "fall", count: 36, glyphs: A.snowflake, min: 6, max: 12, dur: 3600, stagger: 2000 });
        const s = fx.slot();
        const cuts = ["polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 8%)", "polygon(8% 0, 92% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)", "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 0 100%, 0 8%)", "polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)"];
        for (let i = 0; i < cuts.length; i++) {
          await fx.wait(450);
          fx.noise(0.05, { type: "highpass", freq: 5000, vol: 0.5 });
          fx.noise(0.05, { type: "highpass", freq: 6500, vol: 0.4, at: 0.07 });
          if (s) fx.style(s, { clipPath: cuts[i] });
        }
        fx.seq([["E5", 1], ["G5", 1], ["B5", 1], ["E6", 3]], { beat: 0.3, type: "sine", vol: 0.06 });
        await fx.wait(2000);
      }
    },

    // The Thing (1982)
    {
      id: 1091,
      run: async (fx) => {
        fx.wash("rgba(170,200,230,.3)", 4200, { blend: "multiply", fade: 500 });
        for (let i = 0; i < 6; i++) {
          fx.tone("E1", 0.18, { type: "sine", vol: 0.5, at: i * 0.7 });
          fx.tone("E1", 0.14, { type: "sine", vol: 0.35, at: i * 0.7 + 0.22 });
        }
        const others = fx.otherSlots(true);
        const victim = others.length ? fx.pick(others) : fx.slot();
        await fx.wait(1800);
        if (victim) {
          fx.noise(0.6, { type: "bandpass", freq: 400, q: 3, vol: 0.2 });
          await fx.move(victim, [{ transform: "none" }, { transform: "scale(1.1,1.35) skewX(-8deg)" }, { transform: "scale(.9,1.1) skewY(6deg)" }, { transform: "scale(1.15,.85)" }, { transform: "none" }], { duration: 900, easing: "steps(6)" });
          if (fx.reduced) fx.style(victim, { filter: "hue-rotate(80deg) saturate(2)" }, 900);
        }
        await fx.wait(1300);
      }
    },

    // The Blair Witch Project
    {
      id: 2667,
      run: async (fx) => {
        const dark = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle 22vmin at 50% 50%, transparent 40%, rgba(0,0,0,.92) 100%)" } });
        fx.filter("grayscale(1) contrast(1.4) brightness(.8)", 3800);
        fx.noise(3.6, { freq: 400, vol: 0.2, attack: 0.1 });
        for (let i = 0; i < 8; i++) fx.noise(0.08, { type: "bandpass", freq: 2000, q: 2, vol: 0.2, at: i * 0.4 + Math.random() * 0.2 });
        const h = fx.rect("body > header");
        const fig = fx.put(A.S("0 0 60 90", '<path d="M30 0 V14 M30 14 V60 M10 30 L50 24 M16 18 L44 40 M30 60 L16 88 M30 60 L44 88 M22 10 L38 10" stroke="#3a2a1a" stroke-width="3.5" stroke-linecap="round" fill="none"/><path d="M26 40 L34 40" stroke="#6a5a4a" stroke-width="2"/>'), h.x, h.top + h.height + 30, { size: 44, h: 66, style: { transformOrigin: "50% 0" } });
        fx.move(fig, [{ transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }], { duration: 900, iterations: 4, direction: "alternate", easing: "ease-in-out" });
        await fx.move(dark, [{ transform: "translate(0,0)" }, { transform: "translate(-10vw,6vh)" }, { transform: "translate(8vw,-4vh)" }, { transform: "translate(0,-8vh)" }], { duration: 3600, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3400);
      }
    },

    // Paranormal Activity
    {
      id: 23827,
      run: async (fx) => {
        fx.filter("grayscale(1) sepia(.4) hue-rotate(60deg) brightness(.85) contrast(1.2)", 5200, { fade: 300 });
        const code = fx.node("", { style: { position: "absolute", right: "12px", bottom: "calc(12px + env(safe-area-inset-bottom))", font: "13px 'Special Elite', monospace", color: "#fff", textShadow: "0 0 4px #000", whiteSpace: "pre", textAlign: "right" } });
        let secs = 3 * 3600 + 14 * 60;
        const fmt = (n) => String(n).padStart(2, "0");
        fx.tween(5000, (p) => {
          const t = secs + Math.floor(p * 1800);
          code.textContent = "NIGHT #" + (20 + fx.slotIndex) + "\n" + fmt(Math.floor(t / 3600)) + ":" + fmt(Math.floor(t / 60) % 60) + ":" + fmt(t % 60) + " AM";
        });
        fx.noise(5, { freq: 200, vol: 0.12, attack: 0.5 });
        await fx.wait(1800);
        const others = fx.otherSlots(false);
        const door = others.length ? fx.pick(others) : null;
        if (door) {
          fx.tone(90, 1.6, { type: "sawtooth", slide: 140, vol: 0.08, vibrato: [12, 8], filter: { type: "bandpass", freq: 700, q: 3 } });
          await fx.move(door, [{ transform: "perspective(400px) rotateY(0)", transformOrigin: "0 50%" }, { transform: "perspective(400px) rotateY(-50deg)", transformOrigin: "0 50%" }], { duration: 1800, easing: "ease-in-out" });
          if (fx.reduced) fx.style(door, { opacity: "0.4" }, 1800);
        }
        await fx.wait(1600);
      }
    },

    // Cloverfield
    {
      id: 7191,
      run: async (fx) => {
        const rec = fx.node('<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f22;margin-right:6px"></span>REC', { style: { position: "absolute", left: "14px", top: "calc(14px + env(safe-area-inset-top))", font: "14px 'Special Elite', monospace", color: "#fff", textShadow: "0 0 4px #000" } });
        fx.anim(rec.firstChild, [{ opacity: 1 }, { opacity: 0 }], { duration: 500, iterations: 8, direction: "alternate" });
        fx.shake("sm", 3600);
        await fx.wait(1000);
        const h = fx.rect("body > header");
        const shadow = fx.put('<div style="width:100%;height:100%;border-radius:40% 60% 10% 10%;background:rgba(10,10,10,.8);filter:blur(10px)"></div>', -W() * 0.4, h.y, { size: W() * 0.8, h: h.height * 1.6 });
        fx.tone(120, 1.8, { type: "sawtooth", slide: 60, vol: 0.2, vibrato: [14, 20], filter: { freq: 600 } });
        fx.noise(1.8, { freq: 300, vol: 0.3 });
        fx.buzz([200, 100, 300]);
        await fx.move(shadow, [{ transform: "translateX(0)" }, { transform: "translateX(" + (W() * 1.8) + "px)" }], { duration: 1800, easing: "ease-in-out" });
        fx.remove(shadow);
        await fx.wait(800);
      }
    },

    // The Evil Dead (1981)
    {
      id: 764,
      run: async (fx) => {
        fx.noise(1.2, { freq: 200, sweep: 1800, vol: 0.45 });
        fx.tone(70, 1.2, { type: "sawtooth", slide: 140, vol: 0.2, filter: { freq: 500 } });
        await fx.page([{ transform: "scale(1)", filter: "blur(0)" }, { transform: "scale(1.5) translateY(4%)", filter: "blur(2px)" }], { duration: 1100, easing: "cubic-bezier(.6,0,1,1)", fill: "none" });
        fx.flash("#000", 300);
        fx.shake("md", 300);
        await fx.wait(400);
      }
    },

    // The Fly (1986)
    {
      id: 9426,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const fly = fx.put(A.S("0 0 20 16", '<ellipse cx="10" cy="10" rx="4" ry="5" fill="#1f1b16"/><ellipse cx="5" cy="5" rx="4" ry="3" fill="rgba(200,220,255,.8)" stroke="#1f1b16" stroke-width=".6"/><ellipse cx="15" cy="5" rx="4" ry="3" fill="rgba(200,220,255,.8)" stroke="#1f1b16" stroke-width=".6"/>'), 0, 0, { size: 16, h: 13 });
        const dur = 3000;
        fx.tone(190, dur / 1000, { type: "sawtooth", vol: 0.07, vibrato: [30, 20], filter: { type: "bandpass", freq: 900, q: 2 } });
        if (fx.reduced) {
          fly.style.transform = "translate(" + r.x + "px," + r.y + "px)";
          await fx.wait(dur);
        } else {
          await fx.tween(dur, (p) => {
            const rad = (1 - p) * Math.min(W(), H()) * 0.35 + 6;
            const a = p * Math.PI * 7;
            fly.style.transform = "translate(" + (r.x + Math.cos(a) * rad - 8) + "px," + (r.y + Math.sin(a) * rad * 0.7 - 6) + "px)";
          });
        }
        fx.flash("#cfe8ff", 200);
        fx.noise(0.4, { type: "highpass", freq: 3000, vol: 0.3 });
        await fx.wait(700);
      }
    },

    // Videodrome
    {
      id: 837,
      run: async (fx) => {
        const g = fx.glass("", { cls: "fx-scanlines", style: { background: "repeating-linear-gradient(0deg, rgba(255,60,120,.18) 0 2px, transparent 2px 4px)" } });
        fx.sfx("heartbeat", { n: 4, vol: 0.8 });
        for (let i = 0; i < 4; i++) {
          fx.tone(50, 0.4, { vol: 0.35, at: i * 0.9 });
          fx.noise(0.5, { freq: 300, vol: 0.12, at: i * 0.9 + 0.1 });
        }
        await fx.move("#grid", [{ transform: "scale(1)" }, { transform: "scale(1.05, 1.07)", offset: 0.5 }, { transform: "scale(1)" }], { duration: 900, iterations: 4, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3600);
        if (g) fx.remove(g);
      }
    },

    // Carrie (1976)
    {
      id: 7340,
      run: async (fx) => {
        const s = A.liftSlot(fx, 4200);
        if (!s) return;
        const r = fx.rect(s);
        const bucket = fx.put(A.S("0 0 50 44", '<path d="M6 8 H44 L40 40 H10 Z" fill="#9aa2a6" ' + A.ink + '/><path d="M6 8 C6 -2 44 -2 44 8" fill="none" ' + A.ink + ' stroke-width="2"/>'), r.x, r.top - 50, { size: 40, h: 36, style: { zIndex: 87 } });
        fx.later(0, () => fx.move(bucket, [{ transform: "rotate(0)" }, { transform: "rotate(150deg)" }], { duration: 600, easing: "ease-in" }));
        await fx.wait(600);
        fx.noise(0.6, { freq: 700, vol: 0.4 });
        const paint = fx.node('<svg viewBox="0 0 100 150" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M0 0 H100 V60 C94 80 90 60 86 90 C82 60 76 70 72 110 C68 70 60 64 56 80 C52 64 46 70 42 130 C38 70 30 60 26 84 C22 60 14 70 10 100 C6 60 2 70 0 64 Z" fill="#c4121a" opacity=".9"/></svg>', { parent: s, style: { position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none", transformOrigin: "50% 0" } });
        await fx.anim(paint, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: fx.reduced ? 10 : 900, easing: "ease-in" });
        fx.fadeOut(bucket, 300);
        await fx.wait(2200);
        await fx.fadeOut(paint, 500);
      }
    },

    // The Lighthouse
    {
      id: 503919,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.35)", 4200, { fade: 300 });
        const side = Math.max(0, (W() - H() * 1.19 * 0.6) / 2);
        fx.pillarbox(4200, Math.min(W() * 0.2, Math.max(W() * 0.08, side * 0.3)) + "px");
        fx.tone(65, 2.6, { type: "sawtooth", vol: 0.3, attack: 0.8, filter: { freq: 280 } });
        fx.tone(66.5, 2.6, { type: "sawtooth", vol: 0.2, attack: 0.8, filter: { freq: 280 } });
        fx.buzz(600);
        fx.shake("sm", 2000);
        await fx.wait(4200);
      }
    },

    // Midsommar
    {
      id: 530385,
      run: async (fx) => {
        const flowers = [20, 34, 48, 62, 76, 90, 100].map((x, i) => {
          const y = 22 - Math.sin(i / 6 * Math.PI) * 8;
          const c = ["#ffd3e8", "#fff6a8", "#c8e8ff", "#ffe0b0"][i % 4];
          return '<g transform="translate(' + x + " " + y + ')"><circle r="5" fill="' + c + '" stroke="#1f1b16" stroke-width="1.2"/><circle r="1.8" fill="#e8a81a"/></g>';
        }).join("");
        fx.costume(".reely", '<path d="M18 26 C40 12 80 12 104 26" stroke="#5a8a3a" stroke-width="3" fill="none"/>' + flowers, 4500);
        fx.filter("brightness(1.15) saturate(.8) contrast(.92)", 4500, { fade: 800 });
        ["C6", "E6", "C6", "G6"].forEach((nn, i) => fx.tone(nn, 0.12, { vol: 0.05, at: 0.8 + i * 0.13, slide: nn === "G6" ? "E6" : undefined }));
        await fx.wait(4500);
      }
    },

    // A Quiet Place
    {
      id: 447332,
      run: async (fx) => {
        fx.filter("saturate(.3) brightness(.85)", 7000, { fade: 600 });
        fx.style(".machine-marquee .marquee-text", { opacity: "0.25", animation: "none" }, 7000);
        let heard = false;
        fx.onNextTap(() => {
          heard = true;
          fx.sfx("sting", { vol: 1 });
          fx.tone(1300, 0.8, { type: "sawtooth", slide: 700, vol: 0.15, vibrato: [40, 60], filter: { type: "bandpass", freq: 1800, q: 3 } });
          fx.noise(0.5, { type: "bandpass", freq: 2500, q: 2, vol: 0.2 });
          fx.shake("md", 500);
          fx.flash("rgba(120,0,0,.6)", 250);
        }, 6000);
        await fx.wait(6200);
        void heard;
      }
    },

    // Us
    {
      id: 458723,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const holder = fx.put("", Math.min(W() - r.width / 2 - 4, r.x + r.width * 0.55), r.y + 8, { size: r.width, h: r.height });
        const c = s.cloneNode(true);
        c.style.cssText = "width:100%;height:100%;margin:0;transform:scaleX(-1);filter:sepia(1) hue-rotate(-40deg) saturate(3) brightness(.8);box-shadow:3px 3px 0 #1f1b16";
        holder.appendChild(c);
        fx.tone("F#4", 2.5, { type: "sine", vol: 0.06, vibrato: [4, 6], attack: 0.6 });
        fx.tone("G4", 2.5, { type: "sine", vol: 0.05, vibrato: [4.4, 6], attack: 0.6 });
        await fx.anim(holder, [{ opacity: 0 }, { opacity: 0.95 }], { duration: 900 });
        const sc = fx.put(A.S("0 0 40 60", '<path d="M14 56 C4 56 4 42 14 42 C20 42 22 50 18 54 M26 56 C36 56 36 42 26 42 C20 42 18 50 22 54 M16 44 L28 4 M24 44 L12 4" stroke="#d9a13a" stroke-width="3" fill="none" stroke-linecap="round"/>'), r.x + r.width * 0.55, r.top + r.height + 14, { size: 24, h: 36 });
        fx.noise(0.06, { type: "highpass", freq: 6000, vol: 0.4, at: 0.1 });
        await fx.wait(1800);
        fx.fadeOut(sc, 300);
        await fx.fadeOut(holder, 500);
      }
    },

    // Nope
    {
      id: 762504,
      run: async (fx) => {
        const cloud = fx.put(A.S("0 0 160 70", '<path d="M20 60 C0 60 0 34 22 34 C22 14 50 8 62 22 C72 4 108 6 110 28 C134 22 150 40 138 56 C136 62 128 62 120 62 Z" fill="#6f7478" stroke="#3a3e42" stroke-width="2"/>'), W() / 2, 46, { size: 160, h: 70 });
        fx.fadeIn(cloud, 800);
        await fx.wait(1600);
        const loose = fx.$$(".ticket-peek, .cta-sign, .knob, .machine-marquee .side-reel");
        fx.noise(1.6, { freq: 200, sweep: 2500, vol: 0.35, attack: 0.6 });
        await fx.move(loose, [{ transform: "translateY(0)" }, { transform: "translateY(-18px) rotate(-8deg)", offset: 0.7 }, { transform: "translateY(-22px) rotate(8deg)" }], { duration: 1400, easing: "ease-in" });
        fx.move(loose, [{ transform: "translateY(-22px) rotate(8deg)" }, { transform: "none" }], { duration: 220, easing: "ease-in" });
        fx.thud({ vol: 0.3 });
        await fx.wait(500);
        await fx.fadeOut(cloud, 600);
      }
    },

    // Bird Box
    {
      id: 405774,
      run: async (fx) => {
        const cloth = fx.node("", { cls: "fx-filter", style: { background: "repeating-linear-gradient(0deg, rgba(20,16,12,.96) 0 2px, rgba(40,32,24,.94) 2px 4px), #000", opacity: 0 } });
        await fx.anim(cloth, [{ opacity: 0 }, { opacity: 0.97 }], { duration: 500 });
        for (let i = 0; i < 16; i++) fx.tone(3000 + Math.random() * 1500, 0.07, { slide: 2600 + Math.random() * 2000, vol: 0.08, at: i * 0.17 + Math.random() * 0.05, pan: Math.random() * 2 - 1 });
        await fx.wait(3000);
        await fx.fadeOut(cloth, 500);
      }
    },

    // The Babadook
    {
      id: 242224,
      run: async (fx) => {
        for (let i = 0; i < 3; i++) {
          await fx.wait(i === 0 ? 300 : 650);
          fx.thud({ freq: 70, vol: 0.8, dur: 0.4 });
          fx.shake("md", 250);
          fx.buzz(90);
        }
        await fx.wait(600);
        const r = fx.rect(fx.slot());
        const pop = fx.put(A.S("0 0 60 90", '<path d="M18 30 V6 H42 V30" fill="#0b0907"/><path d="M8 30 H52" stroke="#0b0907" stroke-width="5"/><path d="M20 34 C10 50 12 76 18 88 H42 C48 76 50 50 40 34 Z" fill="#0b0907"/><path d="M22 44 L28 46 M38 44 L32 46" stroke="#fff" stroke-width="2"/><path d="M22 56 Q30 64 38 56" stroke="#fff" stroke-width="2" fill="none"/>'), r.x, r.y, { size: r.width * 0.8, h: r.height * 0.95, style: { transformOrigin: "50% 100%" } });
        fx.noise(0.2, { type: "bandpass", freq: 1200, vol: 0.4 });
        await fx.anim(pop, [{ transform: "scaleY(0)" }, { transform: "scaleY(1.1)" }, { transform: "scaleY(1)" }], { duration: fx.reduced ? 10 : 350 });
        await fx.wait(1500);
        await fx.anim(pop, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: fx.reduced ? 10 : 250 });
      }
    },

    // The Conjuring
    {
      id: 138843,
      run: async (fx) => {
        const dim = fx.wash("rgba(0,0,0,.65)", 0, { opacity: 0 });
        await fx.anim(dim, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
        await fx.wait(700);
        fx.noise(0.06, { type: "bandpass", freq: 1500, q: 1.5, vol: 0.9, pan: -0.9 });
        await fx.wait(900);
        fx.noise(0.06, { type: "bandpass", freq: 1500, q: 1.5, vol: 0.9, pan: 0.9 });
        await fx.wait(1100);
        await fx.fadeOut(dim, 500);
      }
    },

    // Pan's Labyrinth
    {
      id: 1417,
      run: async (fx) => {
        fx.wash("rgba(60,40,30,.4)", 4400, { blend: "multiply", fade: 500 });
        const hand = (x, rot) => {
          const el = fx.put('<div style="position:relative;width:100%;height:100%">' + glove("sepia(.3) saturate(.5) brightness(1.05)") +
            '<div style="position:absolute;left:34%;top:46%;width:32%;height:22%;border-radius:50%;background:#fff;border:2px solid #1f1b16"><div style="position:absolute;left:32%;top:15%;width:36%;height:70%;border-radius:50%;background:#1f1b16"></div></div></div>', x, H() + 40, { size: 80 });
          fx.move(el, [{ transform: "translateY(0) rotate(" + rot + "deg)" }, { transform: "translateY(-150px) rotate(" + rot + "deg)" }], { duration: 1600, easing: "ease-out" });
          if (fx.reduced) el.style.transform = "translateY(-150px) rotate(" + rot + "deg)";
          return el;
        };
        hand(W() * 0.3, -12);
        hand(W() * 0.7, 12);
        fx.tone("B4", 3, { type: "sine", vol: 0.06, attack: 1, vibrato: [3, 5] });
        fx.tone("C5", 3, { type: "sine", vol: 0.05, attack: 1.4 });
        await fx.wait(4400);
      }
    },

    // The Silence of the Lambs
    {
      id: 274,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const moth = fx.put(A.moth, W() + 60, H() * 0.2, { size: 56, h: 42 });
        fx.noise(1.5, { type: "bandpass", freq: 250, q: 2, vol: 0.12 });
        const wings = [{ transform: "scaleX(1)" }, { transform: "scaleX(.4)" }];
        fx.move(moth.firstChild, wings, { duration: 90, iterations: 16, direction: "alternate" });
        await fx.move(moth, [{ transform: "translate(0,0)" }, { transform: "translate(" + (r.x - W() - 60 + 60) + "px," + (r.y - H() * 0.2 - 40) + "px)" }, { transform: "translate(" + (r.x - W() - 60) + "px," + (r.y - H() * 0.2) + "px)" }], { duration: 1500, easing: "ease-in-out" });
        if (fx.reduced) moth.style.transform = "translate(" + (r.x - W() - 60) + "px," + (r.y - H() * 0.2) + "px)";
        await fx.wait(2200);
        fx.move(moth.firstChild, wings, { duration: 90, iterations: 10, direction: "alternate" });
        await fx.move(moth, [{ transform: "translate(" + (r.x - W() - 60) + "px," + (r.y - H() * 0.2) + "px)" }, { transform: "translate(" + (-W()) + "px," + (-H() * 0.3) + "px)" }], { duration: 1000, easing: "ease-in" });
        await fx.fadeOut(moth, 200);
      }
    },

    // Se7en
    {
      id: 807,
      run: async (fx) => {
        const h1 = fx.$("body > header h1");
        fx.style(h1, { fontFamily: "'Special Elite', monospace", color: "#e8e2d0", textShadow: "1px 0 #b3402d, -1px 0 #3f7877", WebkitTextStroke: "0" }, 1800);
        fx.wash("rgba(20,15,10,.5)", 1800, { blend: "multiply" });
        for (let i = 0; i < 10; i++) {
          fx.noise(0.05, { type: "bandpass", freq: 800 + Math.random() * 3000, q: 4, vol: 0.25, at: i * 0.16 });
          fx.later(i * 160, () => fx.style(h1, { transform: "translate(" + (Math.random() * 6 - 3) + "px," + (Math.random() * 4 - 2) + "px)", opacity: String(0.5 + Math.random() * 0.5) }, 150));
        }
        await fx.wait(1900);
        const r = fx.rect(fx.slot());
        await fx.fly(A.box, [r.x, -60], [r.x, r.y], { size: r.width * 0.85, h: r.width * 0.75, dur: 700, easing: "cubic-bezier(.5,0,1,1)", keep: true });
        fx.thud({ vol: 0.5 });
        fx.shake("sm", 250);
        await fx.wait(2600);
      }
    },

    // The Sixth Sense
    {
      id: 745,
      run: async (fx) => {
        fx.wash("rgba(180,210,255,.35)", 4000, { blend: "multiply", fade: 800 });
        fx.tone(40, 3.6, { vol: 0.2, attack: 1 });
        const reely = fx.rect(".reely");
        for (let i = 0; i < 3; i++) {
          await fx.wait(900);
          fx.noise(0.6, { type: "bandpass", freq: 600, q: 1, vol: 0.15, attack: 0.1 });
          fx.particles({ kind: "burst", from: pt(reely.x, reely.top + reely.height * 0.48), count: 6, spread: 10, gravity: -20, dur: 1000, stagger: 150, glyphs: dot("rgba(255,255,255,.65)"), min: 8, max: 16, cls: "fx-blur" });
        }
        await fx.wait(1200);
      }
    },

    // The Usual Suspects
    {
      id: 629,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        if (!el) return;
        const text = el.textContent;
        fx.text(el, "", 0);
        const letters = text.split("").map((ch) => {
          const sp = document.createElement("span");
          sp.textContent = ch;
          sp.style.display = "inline-block";
          sp.style.whiteSpace = "pre";
          el.appendChild(sp);
          return sp;
        });
        await fx.wait(600);
        for (const sp of letters) {
          fx.move(sp, [{ transform: "none", opacity: 1 }, { transform: "translateY(40px) rotate(" + (Math.random() * 90 - 45) + "deg)", opacity: 0 }], { duration: 500, easing: "ease-in" });
          if (fx.reduced) sp.style.opacity = "0";
          fx.click({ freq: 1200, vol: 0.15 });
          await fx.wait(110);
        }
        const r = fx.rect(".cta-stage");
        await fx.fly(A.mug, [r.x + 40, r.top - 60], [r.x + 40, r.top + 40], { size: 32, dur: 450, easing: "ease-in", r2: 40 });
        fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.6 });
        fx.particles({ kind: "burst", from: pt(r.x + 40, r.top + 40), count: 10, spread: 30, gravity: 30, dur: 600, stagger: 0, glyphs: '<div style="width:100%;height:100%;background:#fbf4e2;border:1px solid #1f1b16"></div>', min: 4, max: 8, spin: 360 });
        await fx.wait(1500);
      }
    },

    // Hocus Pocus
    {
      id: 10439,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const candle = fx.put(A.S("0 0 30 70", '<rect x="8" y="26" width="14" height="42" fill="#efe6cf" ' + A.ink + ' stroke-width="2"/><path d="M15 24 V18" stroke="#1f1b16" stroke-width="2"/><path d="M15 2 C22 10 22 18 15 20 C8 18 8 10 15 2 Z" fill="#0b0907" style="filter:drop-shadow(0 0 4px #9dff6a)"/>'), r.left + r.width + 12, r.top + r.height - 30, { size: 24, h: 56 });
        fx.fadeIn(candle, 300);
        fx.noise(0.2, { freq: 900, vol: 0.2 });
        fx.wash("rgba(80,40,120,.3)", 3600, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "rise", from: pt(r.left + r.width + 12, r.top + r.height - 58), count: 14, glyphs: dot("rgba(140,255,100,.45)"), min: 16, max: 30, dur: 2400, stagger: 2000, cls: "fx-blur", wind: -40 });
        fx.tone("A3", 3, { type: "sawtooth", vol: 0.05, vibrato: [5, 10], filter: { freq: 700 }, attack: 0.5 });
        await fx.wait(3600);
        await fx.fadeOut(candle, 300);
      }
    },

    // Donnie Darko
    {
      id: 141,
      run: async (fx) => {
        const marquee = fx.$(".machine-marquee .marquee-text");
        let secs = 28 * 86400 + 6 * 3600 + 42 * 60 + 12;
        const fmt = (s) => [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");
        fx.text(marquee, fmt(secs), 0);
        for (let i = 0; i < 4; i++) {
          await fx.wait(600);
          secs -= 1;
          marquee.textContent = fmt(secs);
          fx.sfx("tick", { vol: 0.7 });
        }
        const m = fx.rect(".machine");
        fx.sfx("whoosh", { dur: 1.1, vol: 0.7 });
        await fx.fly(A.engine, [m.x + 30, -80], [m.x + 10, m.top - 10], { size: 70, h: 46, dur: 1100, easing: "cubic-bezier(.5,0,1,1)", r0: 20, r2: 60, keep: true });
        fx.sfx("boom", { vol: 0.8 });
        fx.sfx("crack", { vol: 0.5 });
        fx.noise(0.8, { type: "highpass", freq: 1500, vol: 0.4 });
        fx.shake("lg", 600);
        fx.buzz(250);
        fx.particles({ kind: "burst", from: pt(m.x + 10, m.top - 10), count: 16, spread: 60, gravity: 80, dur: 900, stagger: 0, glyphs: dot("#8e969a"), min: 4, max: 10 });
        await fx.wait(1600);
      }
    },

    // They Live
    {
      id: 8337,
      run: async (fx) => {
        const w = Math.min(W() * 0.8, 340), h = w * 0.34;
        const lens = fx.node('<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 ' + h * 0.45 + 'px Bitter, Georgia, sans-serif;letter-spacing:.06em;color:#111;background:rgba(255,255,255,.35)">OBEY</div>', {
          style: { position: "absolute", width: w + "px", height: h + "px", left: -w + "px", top: H() * 0.42 + "px", backdropFilter: "grayscale(1) contrast(1.8)", webkitBackdropFilter: "grayscale(1) contrast(1.8)", border: "6px solid #111", borderRadius: "30% 30% 42% 42% / 40% 40% 60% 60%", boxShadow: "0 0 0 3px #555", clipPath: "polygon(0 0, 100% 0, 100% 100%, 56% 100%, 50% 60%, 44% 100%, 0 100%)" }
        });
        fx.tone(82, 3.4, { type: "sawtooth", vol: 0.08, filter: { freq: 500 }, attack: 0.3 });
        if (fx.reduced) {
          lens.style.left = (W() - w) / 2 + "px";
          await fx.wait(3000);
        } else {
          await fx.anim(lens, [{ transform: "translateX(0)" }, { transform: "translateX(" + (W() / 2 + w / 2) + "px)", offset: 0.4 }, { transform: "translateX(" + (W() / 2 + w / 2) + "px)", offset: 0.65 }, { transform: "translateX(" + (W() + w) + "px)" }], { duration: 3600, easing: "ease-in-out" });
        }
      }
    }
  ]);
})();
