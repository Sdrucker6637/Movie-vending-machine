/* Machine FX cues - animation, family and fantasy.
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
    // Toy Story
    {
      id: 862,
      run: async (fx) => {
        for (let i = 0; i < 4; i++) fx.sfx("hit", { at: i * 350, vol: 0.2 + i * 0.12, rate: 0.7 });
        await fx.wait(1300);
        fx.freeze(2600);
        if (fx.reduced) fx.style([fx.$(".reely"), fx.$(".kernel")], { filter: "grayscale(1) brightness(.75)" }, 2400);
        fx.move(".reely", [{ transform: "none", transformOrigin: "50% 95%" }, { transform: "rotate(84deg) translateY(10px)", transformOrigin: "50% 95%" }], { duration: 200, easing: "ease-in" });
        fx.move(".kernel", [{ transform: "none", transformOrigin: "50% 95%" }, { transform: "rotate(-80deg)", transformOrigin: "50% 95%" }], { duration: 200, easing: "ease-in" });
        fx.sfx("clunk", { vol: 0.35 });
        await fx.wait(2400);
        fx.move(".reely", [{ transform: "rotate(84deg) translateY(10px)", transformOrigin: "50% 95%" }, { transform: "none", transformOrigin: "50% 95%" }], { duration: 160, easing: "steps(3)" });
        fx.move(".kernel", [{ transform: "rotate(-80deg)", transformOrigin: "50% 95%" }, { transform: "none", transformOrigin: "50% 95%" }], { duration: 160, easing: "steps(3)" });
        await fx.wait(300);
      }
    },

    // Toy Story 3
    {
      id: 10193,
      run: async (fx) => {
        const s = A.liftSlot(fx);
        if (!s) return;
        const r = fx.rect(s);
        const claw = fx.node(A.S("0 0 60 1000",
          '<path d="M30 0 V950" stroke="#6b7377" stroke-width="3"/><rect x="18" y="940" width="24" height="16" rx="3" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>' +
          '<path class="l" d="M20 954 C6 966 6 984 16 996" fill="none" ' + A.ink + ' stroke-width="4"/><path class="r" d="M40 954 C54 966 54 984 44 996" fill="none" ' + A.ink + ' stroke-width="4"/>'),
        { style: { position: "absolute", left: r.x - 30 + "px", top: 0, width: "60px", height: "1000px" } });
        claw.firstChild.style.cssText = "width:100%;height:100%";
        const endY = r.top + 10 - 1000;
        fx.tone(160, 1.2, { type: "square", vol: 0.05, filter: { freq: 500 }, vibrato: [20, 10] });
        await fx.anim(claw, [{ transform: "translateY(-1000px)" }, { transform: "translateY(" + endY + "px)" }], { duration: fx.reduced ? 10 : 1200, easing: "ease-out" });
        fx.click({ freq: 900, vol: 0.6 });
        ["C5", "E5", "G5"].forEach((n, i) => fx.tone(n, 1.4, { type: "sine", vol: 0.08, vibrato: [6, 10], at: 0.2 + i * 0.12, attack: 0.3 }));
        fx.move(s, [{ transform: "none" }, { transform: "translateY(-26px)" }], { duration: 700, easing: "ease-in-out" });
        await fx.move(claw, [{ transform: "translateY(" + endY + "px)" }, { transform: "translateY(" + (endY - 26) + "px)" }], { duration: 700, easing: "ease-in-out" });
        await fx.wait(1200);
        fx.anim(s, [{ transform: "translateY(-26px)" }, { transform: "none" }], { duration: 180, easing: "ease-in" });
        fx.thud({ vol: 0.3 });
        await fx.anim(claw, [{ transform: "translateY(" + (endY - 26) + "px)" }, { transform: "translateY(-1000px)" }], { duration: fx.reduced ? 10 : 700, easing: "ease-in" });
      }
    },

    // Finding Nemo
    {
      id: 12,
      run: async (fx) => {
        const g = fx.rect("#grid");
        fx.particles({ kind: "rise", area: pt(g.x, g.top + g.height - 10, g.width, 10), count: 22, glyphs: A.bubble, min: 8, max: 18, dur: 2200, stagger: 2000 });
        for (let i = 0; i < 8; i++) fx.tone(500 + Math.random() * 600, 0.08, { vol: 0.08, slide: 1400, at: i * 0.3 });
        fx.wash("rgba(40,140,200,.18)", 3400, { blend: "multiply", fade: 400 });
        await fx.fly(A.fish("#f47a20"), [g.left - 40, g.y], [g.left + g.width + 40, g.y - 30], { size: 44, h: 26, dur: 2600, via: [g.x, g.y + 20], flip: true, easing: "ease-in-out" });
        await fx.wait(500);
      }
    },

    // The Lion King (1994)
    {
      id: 8587,
      run: async (fx) => {
        const s = A.liftSlot(fx);
        if (!s) return;
        const r = fx.rect(s);
        const rays = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:repeating-conic-gradient(rgba(255,214,120,.75) 0 8deg, transparent 8deg 20deg);-webkit-mask:radial-gradient(circle, #000 20%, transparent 70%);mask:radial-gradient(circle, #000 20%, transparent 70%)"></div>', r.x, r.y - 26, { size: Math.max(W(), H()) * 0.9 });
        fx.wash("rgba(255,150,50,.25)", 4200, { blend: "multiply", fade: 500 });
        fx.chord(["C4", "G4", "C5", "E5"], 3.6, { type: "sawtooth", vol: 0.05, attack: 1.2, filter: { freq: 1200 } });
        fx.move(rays, [{ transform: "rotate(0) scale(.3)", opacity: 0 }, { transform: "rotate(40deg) scale(1)", opacity: 1 }], { duration: 3200, easing: "ease-out" });
        if (fx.reduced) fx.fadeIn(rays, 600);
        await fx.move(s, [{ transform: "none" }, { transform: "translateY(-26px) scale(1.15)" }], { duration: 1600, easing: "ease-out" });
        await fx.wait(fx.reduced ? 3400 : 1800);
        fx.fadeOut(rays, 500);
        await fx.move(s, [{ transform: "translateY(-26px) scale(1.15)" }, { transform: "none" }], { duration: 500 });
      }
    },

    // The Lion King (2019)
    {
      id: 420818,
      run: async (fx) => {
        const sun = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 85%, rgba(255,210,120,.9) 0 8vmin, rgba(240,120,40,.5) 30vmin, transparent 70vmin)", mixBlendMode: "screen", opacity: 0 } });
        const grass = fx.node(A.S("0 0 400 60", Array.from({ length: 60 }, (_, i) => {
          const x = i * 6.8, h = 24 + (i * 37) % 30;
          return '<path d="M' + x + ' 60 Q' + (x + 3) + ' ' + (60 - h / 2) + ' ' + (x + 6 + (i % 3) * 2) + ' ' + (60 - h) + '" stroke="#3a2410" stroke-width="2.4" fill="none"/>';
        }).join("")), { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "12vh", transformOrigin: "50% 100%" } });
        grass.firstChild.setAttribute("preserveAspectRatio", "none");
        grass.firstChild.style.cssText = "width:100%;height:100%";
        fx.noise(3.6, { freq: 500, vol: 0.12, attack: 1 });
        fx.fadeIn(sun, 1000);
        await fx.move(grass, [{ transform: "skewX(0)" }, { transform: "skewX(8deg)" }, { transform: "skewX(-4deg)" }, { transform: "skewX(6deg)" }, { transform: "skewX(0)" }], { duration: 3400, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
        fx.fadeOut(grass, 600);
        await fx.fadeOut(sun, 600);
      }
    },

    // Up
    {
      id: 14160,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const colors = ["#e84a4a", "#f2c230", "#4aa0e8", "#6cc36c", "#e87ad0", "#f28a30", "#9a6ce8"];
        const n = fx.reduced ? 5 : 16;
        const ups = [];
        for (let i = 0; i < n; i++) {
          const x = r.x + (Math.random() - 0.5) * r.width;
          ups.push(fx.wait(i * 110).then(() => fx.fly(A.balloon(colors[i % colors.length]), [x, r.top + 10], [x + (Math.random() - 0.5) * 160, -100], { size: 26, h: 58, dur: 2600 + Math.random() * 800, via: [x + (Math.random() - 0.5) * 60, r.top - H() * 0.3], easing: "ease-in" })));
        }
        ["C5", "E5", "G5", "A5", "G5"].forEach((nn, i) => fx.tone(nn, 0.4, { type: "triangle", vol: 0.08, at: 0.2 + i * 0.28 }));
        fx.move(s, [{ transform: "none" }, { transform: "translateY(-10px) rotate(-2deg)" }, { transform: "translateY(-14px) rotate(2deg)" }, { transform: "none" }], { duration: 2600, easing: "ease-in-out" });
        await Promise.all(ups);
      }
    },

    // WALL-E
    {
      id: 10681,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.chord(["C4", "G4", "C5", "E5"], 1.6, { type: "triangle", vol: 0.12, attack: 0.02 });
        const boot = fx.put(A.S("0 0 50 60", '<path d="M10 58 V30 C10 22 20 20 22 28 L24 58 Z" fill="#6b5a3a" ' + A.ink + ' stroke-width="2"/><path d="M24 58 H44 C46 52 40 48 24 48 Z" fill="#6b5a3a" ' + A.ink + ' stroke-width="2"/>' +
          '<g class="sprout"><path d="M17 30 C17 20 16 12 17 6" stroke="#3d8a3a" stroke-width="2.5" fill="none"/><path d="M17 12 C8 6 6 12 10 14 C13 15 16 13 17 12 Z M17 8 C24 0 30 6 26 9 C23 11 19 10 17 8 Z" fill="#6cc36c" stroke="#2d6a2a" stroke-width="1"/></g>'), r.x, r.top + r.height - 34, { size: 44, h: 52 });
        const sprout = boot.querySelector(".sprout");
        sprout.style.transformOrigin = "17px 30px";
        await fx.move(sprout, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 1600, easing: "ease-out" });
        fx.tone("E6", 0.5, { vol: 0.08, at: 0 });
        fx.tone("A6", 0.8, { vol: 0.08, at: 0.2 });
        await fx.wait(2200);
        await fx.fadeOut(boot, 400);
      }
    },

    // Ratatouille
    {
      id: 2062,
      run: async (fx) => {
        fx.costume(".reely", '<path d="M40 24 C30 22 28 6 40 6 C42 -6 60 -8 64 2 C72 -6 90 0 84 10 C96 12 92 26 80 24 Z" fill="#fffefa" stroke="#1f1b16" stroke-width="3"/><rect x="42" y="18" width="36" height="8" rx="2" fill="#fffefa" stroke="#1f1b16" stroke-width="3"/>', 4000);
        fx.cls(".reely", "hop", 600);
        const r = fx.rect(fx.slot());
        fx.particles({ kind: "rise", area: pt(r.x, r.top, r.width * 0.6, 4), count: 10, glyphs: dot("rgba(255,255,255,.7)"), min: 14, max: 26, dur: 2200, stagger: 1500, fadeIn: true, cls: "fx-blur" });
        fx.seq([["G5", 1], ["E5", 1], ["C6", 2]], { beat: 0.16, type: "triangle", vol: 0.1 });
        await fx.wait(3800);
      }
    },

    // Monsters, Inc.
    {
      id: 585,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const lamp = fx.put('<div class="b" style="width:100%;height:100%;border-radius:50% 50% 30% 30%;background:#e33;border:2px solid #1f1b16;box-shadow:0 0 12px 4px #f44"></div>', r.x, r.top - 4, { size: 18, h: 14 });
        const bulb = lamp.firstChild;
        const bars = ["▯▯▯▯▯", "▮▯▯▯▯", "▮▮▯▯▯", "▮▮▮▯▯", "▮▮▮▮▯", "▮▮▮▮▮"];
        fx.marquee(bars[0], 0);
        for (let i = 0; i < 4; i++) {
          fx.tone(620, 0.12, { type: "square", vol: 0.08, at: 0 });
          fx.style(bulb, { opacity: i % 2 ? "1" : ".35" });
          await fx.wait(260);
        }
        for (let i = 1; i < bars.length; i++) {
          fx.$(".machine-marquee .marquee-text").textContent = bars[i];
          fx.tone(300 + i * 90, 0.2, { type: "sawtooth", vol: 0.07, filter: { freq: 1400 } });
          await fx.wait(260);
        }
        fx.style(bulb, { background: "#3c3", boxShadow: "0 0 12px 4px #4f4", opacity: "1" });
        fx.chord(["C5", "E5", "G5"], 0.8, { type: "triangle", vol: 0.1 });
        await fx.wait(1600);
      }
    },

    // The Incredibles
    {
      id: 9806,
      run: async (fx) => {
        const s = A.liftSlot(fx);
        if (!s) return;
        const r = fx.rect(s);
        const cape = fx.put(A.S("0 0 100 120", '<path d="M18 4 C10 40 6 80 2 116 C30 108 70 108 98 116 C94 80 90 40 82 4 Z" fill="#d32f2f" ' + A.ink + '/><path d="M18 4 H82" ' + A.ink + '/>'), r.x + 8, r.y + 10, { size: r.width * 1.25, h: r.height * 1.15 });
        fx.noise(1.4, { freq: 1200, vol: 0.15, attack: 0.1 });
        await fx.move(cape, [{ transform: "skewX(0)" }, { transform: "skewX(-8deg) scaleX(1.05)" }, { transform: "skewX(5deg)" }, { transform: "skewX(-6deg)" }, { transform: "skewX(0)" }], { duration: 1400 });
        if (fx.reduced) await fx.wait(1200);
        // ...no capes.
        fx.noise(0.25, { type: "highpass", freq: 1500, sweep: 6000, vol: 0.4 });
        fx.tone(900, 0.2, { slide: 300, vol: 0.12 });
        await fx.move(cape, [{ transform: "none", opacity: 1 }, { transform: "translate(40px,-" + H() + "px) rotate(40deg)", opacity: 1 }], { duration: 350, easing: "ease-in" });
        fx.remove(cape);
        await fx.wait(300);
      }
    },

    // Inside Out
    {
      id: 150540,
      run: async (fx) => {
        const g = fx.rect("#grid");
        const colors = ["#ffd83a", "#4a8cff", "#ff4a3a", "#5ccf5c", "#b56cff"];
        const orbs = colors.map((c, i) => fx.wait(i * 280).then(() => {
          fx.tone(["C5", "D5", "E5", "G5", "A5"][i], 0.5, { type: "sine", vol: 0.1 });
          return fx.fly('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 30%, #fff, ' + c + ' 45%);box-shadow:0 0 16px 4px ' + c + '"></div>', [g.left - 20, g.top + g.height - 22], [g.left + g.width + 20, g.top + g.height - 22], { size: 22, dur: 2200, r2: 720 });
        }));
        await Promise.all(orbs);
      }
    },

    // Coco
    {
      id: 354912,
      run: async (fx) => {
        const h = fx.rect("body > header");
        const colors = ["#ff4fa3", "#ffb300", "#34c3eb", "#7bd13a", "#b04cff", "#ff6a2a"];
        const n = Math.max(6, Math.round(h.width / 34));
        let flags = "";
        for (let i = 0; i < n; i++) {
          const x = i * 34;
          flags += '<g transform="translate(' + x + ' 6)"><path d="M0 0 H30 V30 L15 38 L0 30 Z" fill="' + colors[i % colors.length] + '"/><circle cx="15" cy="12" r="4" fill="#fbf4e2"/><path d="M6 22 L15 18 L24 22 L15 28 Z" fill="#fbf4e2"/></g>';
        }
        const banner = fx.node('<svg viewBox="0 0 ' + n * 34 + ' 50" style="width:100%;height:100%"><path d="M0 6 H' + n * 34 + '" stroke="#1f1b16" stroke-width="1.5"/>' + flags + "</svg>", { style: { position: "absolute", left: h.left + "px", top: h.top - 6 + "px", width: h.width + "px", height: "44px" } });
        fx.move(banner, [{ transform: "translateY(-60px)" }, { transform: "none" }], { duration: 500, easing: "ease-out" });
        const r = fx.rect(fx.slot());
        fx.particles({ kind: "rise", from: pt(r.x, r.y, r.width, 0), count: 26, glyphs: A.petal("#ff9a1a"), min: 8, max: 14, dur: 2400, stagger: 1400, spin: 360 });
        ["E4", "G#4", "B4", "E5", "B4", "G#4", "E4"].forEach((nn, i) => fx.tone(nn, 0.5, { type: "triangle", vol: 0.1, at: i * 0.11 }));
        await fx.wait(3600);
        await fx.fadeOut(banner, 400);
      }
    },

    // Frozen
    {
      id: 109445,
      run: async (fx) => {
        const frost = fx.glass("", { style: { background: "radial-gradient(ellipse at center, transparent 30%, rgba(225,245,255,.85) 90%)", boxShadow: "inset 0 0 26px 10px #fff", opacity: 0 } });
        if (frost) fx.anim(frost, [{ opacity: 0 }, { opacity: 1 }], { duration: 1600 });
        fx.particles({ kind: "fall", count: 30, glyphs: A.snowflake, min: 8, max: 18, dur: 3200, stagger: 1800, spin: 180 });
        ["B5", "F#6", "D6", "B6", "A6", "F#6"].forEach((nn, i) => fx.tone(nn, 0.9, { type: "sine", vol: 0.06, at: i * 0.22 }));
        await fx.wait(3600);
        if (frost) await fx.fadeOut(frost, 500);
      }
    },

    // Shrek
    {
      id: 808,
      run: async (fx) => {
        const h = fx.rect("body > header");
        const page = (clip) => fx.put('<div style="width:100%;height:100%;background:#f3e2b8;border:2px solid #8a6a3a;clip-path:' + clip + ';display:flex;align-items:center;justify-content:center;font:italic 700 22px Georgia, serif;color:#5a3a1a">Once upon a time…</div>', h.x, h.y, { size: h.width, h: h.height });
        const left = page("polygon(0 0, 52% 0, 47% 30%, 53% 55%, 46% 100%, 0 100%)");
        const right = page("polygon(52% 0, 100% 0, 100% 100%, 46% 100%, 53% 55%, 47% 30%)");
        fx.anim([left, right], [{ opacity: 0 }, { opacity: 1 }], 250);
        await fx.wait(1300);
        fx.noise(0.5, { type: "bandpass", freq: 2500, q: 0.8, vol: 0.5 });
        fx.move(left, [{ transform: "none" }, { transform: "translate(-40px," + H() + "px) rotate(-40deg)" }], { duration: 900, easing: "ease-in" });
        await fx.move(right, [{ transform: "none" }, { transform: "translate(40px," + H() + "px) rotate(30deg)" }], { duration: 900, easing: "ease-in" });
        fx.remove(left);
        fx.remove(right);
        fx.wash("rgba(120,160,40,.3)", 1400, { blend: "multiply", fade: 300 });
        fx.noise(1, { freq: 1500, sweep: 200, vol: 0.2 });
        await fx.wait(1400);
      }
    },

    // Pirates of the Caribbean: The Curse of the Black Pearl
    {
      id: 22,
      run: async (fx) => {
        const target = fx.rect("#drawBtn");
        const cx = W() / 2, cy = H() * 0.42;
        const angle = Math.atan2(target.y - cy, target.x - cx) * 180 / Math.PI + 90;
        const comp = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="46" fill="#c9a35a" ' + A.ink + ' stroke-width="4"/><circle cx="50" cy="50" r="38" fill="#f1e3c2" stroke="#1f1b16" stroke-width="2"/><path d="M50 16 V22 M50 78 V84 M16 50 H22 M78 50 H84" stroke="#1f1b16" stroke-width="2"/><g class="n"><path d="M50 18 L56 50 L50 82 L44 50 Z" fill="#b3402d" stroke="#1f1b16" stroke-width="1.5"/><path d="M50 50 L56 50 L50 82 L44 50 Z" fill="#1f1b16"/></g><circle cx="50" cy="50" r="4" fill="#d9a13a" stroke="#1f1b16" stroke-width="1.5"/>'), cx, cy, { size: 120 });
        const needle = comp.querySelector(".n");
        needle.style.transformOrigin = "50px 50px";
        fx.fadeIn(comp, 200);
        for (let i = 0; i < 16; i++) fx.click({ freq: 2600, vol: 0.2, at: i * 0.1 });
        await fx.anim(needle, [{ transform: "rotate(0)" }, { transform: "rotate(900deg)", offset: 0.6 }, { transform: "rotate(" + (720 + angle - 40) + "deg)", offset: 0.8 }, { transform: "rotate(" + (720 + angle) + "deg)" }], { duration: fx.reduced ? 300 : 2400, easing: "ease-out" });
        fx.tone("A4", 0.6, { type: "triangle", vol: 0.1 });
        fx.cls("#drawBtn", "boing", 400);
        await fx.wait(1400);
        await fx.fadeOut(comp, 300);
      }
    },

    // Spirited Away
    {
      id: 129,
      run: async (fx) => {
        const m = fx.rect(".machine");
        const y = m.top + m.height - 12;
        const sprites = [];
        const n = fx.reduced ? 3 : 7;
        for (let i = 0; i < n; i++) {
          const x0 = m.left - 30 - i * 28;
          const candy = i % 2 === 0 ? '<div style="position:absolute;left:4px;top:-14px;width:14px;height:14px">' + A.star(["#ff7ab0", "#7ad3ff", "#ffe07a"][i % 3]) + "</div>" : "";
          const el = fx.put('<div style="position:relative;width:100%;height:100%">' + A.soot + candy + "</div>", 0, 0, { size: 24, style: { left: x0 + "px", top: y - 12 + "px" } });
          sprites.push(fx.move(el, [{ transform: "translate(0,0)" }, { transform: "translate(" + (m.width * 0.5 + 60) + "px,-8px)" }, { transform: "translate(" + (m.width + 80 + i * 28) + "px,0)" }], { duration: 2600, delay: i * 80, easing: "steps(18)" }));
          if (fx.reduced) fx.anim(el, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 2200 });
        }
        for (let i = 0; i < 16; i++) fx.click({ freq: 5000 + Math.random() * 2000, vol: 0.08, at: i * 0.15 });
        await Promise.all(sprites);
        if (fx.reduced) await fx.wait(2200);
      }
    },

    // My Neighbor Totoro
    {
      id: 8392,
      run: async (fx) => {
        fx.wash("rgba(40,60,70,.35)", 4200, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "fall", count: 40, glyphs: '<div class="fx-streak" style="height:100%;background:rgba(220,235,255,.7)"></div>', min: 12, max: 18, dur: 900, stagger: 3000 });
        fx.noise(3.8, { freq: 3000, vol: 0.12, attack: 0.5 });
        const h = fx.rect("body > header");
        for (let i = 0; i < 3; i++) {
          await fx.wait(700);
          fx.tone(700, 0.15, { slide: 180, vol: 0.3 });
          fx.thud({ freq: 110, vol: 0.25, dur: 0.2 });
          const x = h.left + h.width * (0.2 + i * 0.3);
          fx.fly(A.S("0 0 30 36", '<path d="M4 14 C4 30 26 30 26 14 Z" fill="#9a6a2a" ' + A.ink + ' stroke-width="2"/><path d="M2 14 C2 4 28 4 28 14 Z" fill="#6b4a1a" ' + A.ink + ' stroke-width="2"/><path d="M15 4 V0" ' + A.ink + ' stroke-width="2"/>'), [x, -30], [x + 10, h.top - 8], { size: 18, h: 22, dur: 500, easing: "ease-in", keep: true });
        }
        await fx.wait(1600);
      }
    },

    // Princess Mononoke
    {
      id: 128,
      run: async (fx) => {
        const m = fx.rect(".machine");
        const spots = [[m.left - 6, m.top + 40], [m.left - 8, m.top + m.height * 0.5], [m.left + m.width + 6, m.top + 80], [m.left + m.width + 8, m.top + m.height * 0.7], [m.left + 30, m.top + m.height + 14], [m.left + m.width - 30, m.top + m.height + 14]];
        fx.wash("rgba(20,50,30,.35)", 4600, { blend: "multiply", fade: 500 });
        const kodamas = [];
        for (const [x, y] of spots) {
          const k = fx.put(A.kodama, x, y, { size: 26, h: 40 });
          kodamas.push(k);
          fx.fadeIn(k, 500);
          await fx.wait(260);
        }
        for (let round = 0; round < 3; round++) {
          kodamas.forEach((k, i) => {
            fx.move(k.firstChild, [{ transform: "rotate(0)" }, { transform: "rotate(-20deg)" }, { transform: "rotate(18deg)" }, { transform: "rotate(-10deg)" }, { transform: "rotate(0)" }], { duration: 420, delay: i * 40, easing: "steps(4)" });
            for (let c = 0; c < 4; c++) fx.click({ freq: 1400 + i * 120, vol: 0.14, at: i * 0.04 + c * 0.1, pan: (i % 2 ? 0.6 : -0.6) });
          });
          await fx.wait(900);
        }
        await Promise.all(kodamas.map((k) => fx.fadeOut(k, 600)));
      }
    },

    // Howl's Moving Castle
    {
      id: 4935,
      run: async (fx) => {
        const m = fx.rect(".machine");
        fx.particles({ kind: "rise", from: pt(m.left + m.width * 0.8, m.top - 60, 10, 0), count: 12, glyphs: dot("rgba(120,110,100,.6)"), min: 16, max: 34, dur: 2600, stagger: 2400, wind: -80, cls: "fx-blur" });
        for (let i = 0; i < 8; i++) {
          fx.thud({ freq: 90, vol: 0.3, dur: 0.2, at: i * 0.45 });
          fx.noise(0.2, { type: "bandpass", freq: 300 + (i % 2) * 200, vol: 0.12, at: i * 0.45 + 0.1 });
        }
        await fx.move(".machine", [
          { transform: "translate(0,0) rotate(0)" }, { transform: "translate(4px,-6px) rotate(1deg)" }, { transform: "translate(8px,0) rotate(0)" },
          { transform: "translate(4px,-6px) rotate(-1deg)" }, { transform: "translate(0,0) rotate(0)" }
        ], { duration: 900, iterations: 4, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Kiki's Delivery Service
    {
      id: 16859,
      run: async (fx) => {
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["F5", 1], ["A5", 2], ["G5", 2]], { beat: 0.2, type: "triangle", vol: 0.07 });
        await fx.fly(A.witch, [-100, H() * 0.3], [W() + 100, H() * 0.12], { size: 110, h: 55, dur: 3200, via: [W() * 0.5, H() * 0.28], r0: -4, r1: -10, r2: -2, easing: "ease-in-out" });
      }
    },

    // Akira
    {
      id: 149,
      run: async (fx) => {
        const y = fx.rect(".cta-stage").top - 18;
        fx.noise(1.2, { type: "bandpass", freq: 1800, q: 2, vol: 0.4, pan: -1, panTo: 1 });
        fx.tone(300, 1, { type: "sawtooth", slide: 90, vol: 0.12, filter: { freq: 1400 } });
        const bike = fx.put('<div style="width:100%;height:100%;border-radius:40% 60% 30% 30%;background:#d2261e;border:3px solid #1f1b16"></div>', -60, y, { size: 70, h: 26 });
        const trails = [];
        for (let i = 0; i < 2; i++) trails.push(fx.node("", { style: { position: "absolute", left: 0, top: y - 6 + i * 12 + "px", height: "4px", width: "100%", background: "linear-gradient(90deg, transparent, #ff2a1a)", boxShadow: "0 0 10px #ff2a1a", transformOrigin: "0 50%" } }));
        fx.move(trails, [{ transform: "scaleX(0)" }, { transform: "scaleX(.75)" }], { duration: 700, easing: "ease-out" });
        await fx.move(bike, [{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + W() * 0.75 + "px) rotate(0)", offset: 0.7 }, { transform: "translateX(" + (W() * 0.75 + 40) + "px) rotate(-12deg)" }], { duration: 1000, easing: "ease-out" });
        await fx.wait(1300);
        trails.concat([bike]).forEach((t) => fx.fadeOut(t, 400));
        await fx.wait(450);
      }
    },

    // Ghost in the Shell (1995)
    {
      id: 9323,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        fx.tone(4000, 0.5, { slide: 800, vol: 0.06 });
        await fx.anim(s, [{ opacity: 1 }, { opacity: 0.06 }], { duration: 500 });
        const shimmer = fx.put("", r.x, r.y, { size: r.width, h: r.height, style: { backdropFilter: "blur(2px) hue-rotate(40deg)", webkitBackdropFilter: "blur(2px) hue-rotate(40deg)", borderRadius: "8px" } });
        fx.move(shimmer, [{ transform: "translateX(-2px)" }, { transform: "translateX(2px)" }], { duration: 160, iterations: 14, direction: "alternate" });
        await fx.wait(2400);
        fx.remove(shimmer);
        fx.noise(0.3, { type: "bandpass", freq: 5000, q: 5, vol: 0.2 });
        await fx.anim(s, [{ opacity: 0.06 }, { opacity: 1 }], { duration: 400, easing: "steps(4)" });
      }
    },

    // Beauty and the Beast (1991)
    {
      id: 10020,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const jar = fx.put(A.S("0 0 60 90", '<path d="M10 86 V30 C10 6 50 6 50 30 V86" fill="rgba(220,240,255,.25)" stroke="#fff" stroke-width="2"/><path d="M4 86 H56" stroke="#d9a13a" stroke-width="5"/><path d="M30 80 C29 64 31 54 30 44" stroke="#2d6a2a" stroke-width="2.5" fill="none"/><path d="M22 38 C22 26 38 26 38 38 C38 46 22 46 22 38 Z" fill="#c8142a" stroke="#6a0a14" stroke-width="1.5"/><ellipse cx="17" cy="30" rx="3" ry="12" fill="#fff" opacity=".35"/>'), r.x, r.y, { size: r.width * 0.9, h: r.height * 0.9, style: { filter: "drop-shadow(0 0 10px rgba(255,120,150,.7))" } });
        fx.wash("rgba(40,20,60,.4)", 4600, { blend: "multiply", fade: 500 });
        fx.fadeIn(jar, 500);
        for (let i = 0; i < 3; i++) {
          await fx.wait(900);
          fx.tone(["E6", "C6", "A5"][i], 1.2, { vol: 0.07, type: "sine" });
          fx.fly(A.petal("#c8142a"), [r.x + (i - 1) * 6, r.y - r.height * 0.1], [r.x + (i - 1) * 12, r.y + r.height * 0.33], { size: 8, dur: 1200, r2: 160, keep: true, easing: "ease-in" });
        }
        await fx.wait(1500);
        await fx.fadeOut(jar, 500);
      }
    },

    // Beauty and the Beast (2017)
    {
      id: 321612,
      run: async (fx) => {
        fx.wash("rgba(255,210,120,.2)", 4000, { blend: "multiply", fade: 400 });
        const chand = A.S("0 0 120 90", '<path d="M60 0 V20" stroke="#8a6a1a" stroke-width="2"/><path d="M20 40 C20 70 100 70 100 40" fill="none" stroke="#d9a13a" stroke-width="4"/><ellipse cx="60" cy="40" rx="42" ry="8" fill="none" stroke="#d9a13a" stroke-width="3"/>' +
          [20, 40, 60, 80, 100].map((x) => '<rect x="' + (x - 2) + '" y="24" width="4" height="12" fill="#fff8e0"/><path d="M' + x + ' 18 C' + (x + 4) + ' 22 ' + (x + 2) + ' 26 ' + x + ' 26 C' + (x - 2) + ' 26 ' + (x - 4) + ' 22 ' + x + ' 18 Z" fill="#ffd24a"/>').join(""));
        const c = fx.put(chand, W() / 2, 40, { size: 140, h: 105, style: { transformOrigin: "50% 0" } });
        fx.move(c, [{ transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }], { duration: 1200, iterations: 3, direction: "alternate", easing: "ease-in-out" });
        fx.particles({ kind: "fall", count: 30, glyphs: A.sparkle("#ffe28a"), min: 6, max: 12, dur: 2600, stagger: 1800 });
        fx.seq([["F3", 1], [["A4", "C5"], 1], [["A4", "C5"], 1], ["C3", 1], [["G4", "Bb4"], 1], [["G4", "Bb4"], 1], ["F3", 3]], { beat: 0.3, type: "triangle", vol: 0.06 });
        await fx.wait(3800);
        await fx.fadeOut(c, 400);
      }
    },

    // Aladdin (1992)
    {
      id: 812,
      run: async (fx) => {
        const rug = A.S("0 0 120 40", '<path d="M8 14 C30 4 60 22 90 10 C100 6 108 8 112 12 L112 28 C90 36 60 20 30 32 C20 36 12 34 8 30 Z" fill="#7b3fa0" ' + A.ink + '/><path d="M16 20 C36 14 62 28 96 18" stroke="#f2c230" stroke-width="3" fill="none"/>' +
          '<path d="M8 14 L2 12 M8 20 L2 20 M8 28 L2 30 M112 12 L118 10 M112 20 L118 20 M112 28 L118 30" stroke="#f2c230" stroke-width="2"/>');
        fx.particles({ kind: "sweep", count: 14, area: pt(W() / 2, H() * 0.35, W(), 80), glyphs: A.sparkle("#bfe4ff"), min: 6, max: 12, dur: 2000, stagger: 1200 });
        ["D5", "F5", "A5", "C#6", "D6"].forEach((nn, i) => fx.tone(nn, 0.5, { vol: 0.07, at: i * 0.12, type: "sine" }));
        await fx.fly(rug, [-120, H() * 0.45], [W() + 120, H() * 0.25], { size: 120, h: 40, dur: 2800, via: [W() * 0.5, H() * 0.42], r0: 8, r1: -6, r2: 4, easing: "ease-in-out" });
      }
    },

    // Aladdin (2019)
    {
      id: 420817,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(255,190,60,.18)", 3000, { blend: "multiply", fade: 300 });
        for (let i = 0; i < 12; i++) fx.tone(2500 + Math.random() * 2500, 0.12, { vol: 0.05, at: i * 0.1 });
        await fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 30, spread: 60, gravity: H() * 0.5, dur: 1600, stagger: 800, glyphs: A.coin("#f2c230"), min: 10, max: 18, spin: 540 });
      }
    },

    // The Little Mermaid (1989)
    {
      id: 10144,
      run: async (fx) => {
        fx.wash("rgba(40,130,160,.22)", 4000, { blend: "multiply", fade: 400 });
        fx.particles({ kind: "rise", count: 26, glyphs: A.bubble, min: 8, max: 20, dur: 3000, stagger: 2000 });
        const fork = A.S("0 0 20 80", '<path d="M10 30 V78" stroke="#c9d0d3" stroke-width="4" stroke-linecap="round"/><path d="M3 4 V22 C3 30 17 30 17 22 V4 M8 4 V22 M12 4 V22" stroke="#c9d0d3" stroke-width="2.5" fill="none" stroke-linecap="round"/>');
        [0, 0.6, 1.2].forEach((t, i) => fx.tone(["G5", "B5", "D6"][i], 0.6, { vol: 0.07, at: t, slide: ["A5", "C6", "E6"][i] }));
        await fx.fly(fork, [W() * 0.3, -60], [W() * 0.6, H() + 60], { size: 18, h: 72, dur: 3600, via: [W() * 0.7, H() * 0.45], r0: 20, r1: -40, r2: 160, easing: "ease-in-out" });
      }
    },

    // Moana
    {
      id: 277834,
      run: async (fx) => {
        const arm = fx.put(A.S("0 0 100 300", '<path d="M20 300 C20 200 30 120 42 80 C46 62 54 62 58 80 C70 120 80 200 80 300 Z" fill="#3fa7d6" opacity=".85"/><path d="M40 110 C44 90 56 90 60 110" stroke="#dff6ff" stroke-width="3" fill="none"/>' +
          '<g transform="translate(50 60)"><circle r="14" fill="#2f9a5a" stroke="#1f1b16" stroke-width="2"/><path d="M0 0 m0 -2 a2 2 0 1 1 -2 2 a5 5 0 1 1 5 5 a9 9 0 1 1 -9 -9" stroke="#b8f5c8" stroke-width="2" fill="none"/></g>'), W() / 2, H() - 120, { size: 100, h: 300 });
        fx.noise(3.4, { freq: 600, vol: 0.2, attack: 0.6 });
        ["E4", "G#4", "B4", "E5"].forEach((nn, i) => fx.tone(nn, 1, { vol: 0.06, at: 0.6 + i * 0.15, type: "triangle" }));
        await fx.move(arm, [{ transform: "translateY(260px)" }, { transform: "translateY(0)" }], { duration: 1200, easing: "ease-out" });
        await fx.wait(1600);
        await fx.move(arm, [{ transform: "translateY(0)" }, { transform: "translateY(300px)" }], { duration: 900, easing: "ease-in" });
        if (fx.reduced) await fx.wait(2000);
      }
    },

    // Zootopia
    {
      id: 269149,
      run: async (fx) => {
        const steps = ["▯▯▯▯▯▯", "▮▯▯▯▯▯", "▮▮▯▯▯▯"];
        fx.marquee(steps[0], 0, "p r o c e s s i n g . . .");
        fx.tempo(0.15, 4600);
        for (let i = 1; i < steps.length; i++) {
          await fx.wait(1800);
          fx.$(".machine-marquee .marquee-text").textContent = steps[i];
          fx.tone(180, 0.9, { type: "triangle", vol: 0.08, slide: 150 });
        }
        await fx.wait(1100);
      }
    },

    // Encanto
    {
      id: 568124,
      run: async (fx) => {
        const slots = fx.$$("#grid .slot");
        slots.forEach((s, i) => {
          const d = ((i % 4) + Math.floor(i / 4)) * 70;
          fx.move(s, [{ transform: "translateY(0)" }, { transform: "translateY(-8px) rotate(3deg)" }, { transform: "translateY(0)" }], { duration: 300, delay: d, fill: "none" });
          fx.click({ freq: 900 + (i % 4) * 150, vol: 0.2, at: d / 1000 });
        });
        await fx.wait(800);
        const r = fx.rect(fx.slot());
        fx.particles({ kind: "rise", from: pt(r.x, r.y, r.width, 0), count: 14, glyphs: A.S("0 0 30 20", '<path d="M15 10 C8 0 0 2 2 10 C0 18 8 20 15 10 C22 20 30 18 28 10 C30 2 22 0 15 10 Z" fill="#f2c230" stroke="#8a5a0a" stroke-width="1"/>'), min: 14, max: 22, dur: 2600, stagger: 1200, wind: 40 });
        ["A4", "C#5", "E5", "A5"].forEach((nn, i) => fx.tone(nn, 0.6, { type: "triangle", vol: 0.08, at: i * 0.15 }));
        await fx.wait(2800);
      }
    },

    // Tangled
    {
      id: 38757,
      run: async (fx) => {
        const night = fx.wash("rgba(20,20,60,.6)", 0);
        fx.fadeIn(night, 700);
        fx.particles({ kind: "rise", count: 26, glyphs: '<div style="width:100%;height:100%;filter:drop-shadow(0 0 8px #ffb347)">' + A.lantern + "</div>", min: 14, max: 26, dur: 4500, stagger: 1800, wind: 30, easing: "ease-out" });
        ["D5", "F#5", "A5", "D6"].forEach((nn, i) => fx.tone(nn, 1.6, { vol: 0.05, at: i * 0.5, attack: 0.3 }));
        await fx.wait(5000);
        await fx.fadeOut(night, 700);
      }
    },

    // The Iron Giant
    {
      id: 10386,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const eyes = fx.node('<div style="position:absolute;left:50%;top:14vh;transform:translateX(-50%);display:flex;gap:26px"><i style="display:block;width:26px;height:18px;border-radius:50%;background:#aaff66;box-shadow:0 0 18px 6px #7fff3a"></i><i style="display:block;width:26px;height:18px;border-radius:50%;background:#aaff66;box-shadow:0 0 18px 6px #7fff3a"></i></div>', { cls: "fx-filter", style: { background: "rgba(6,10,20,.55)" } });
        fx.fadeIn(eyes, 500);
        await fx.wait(900);
        for (let i = 0; i < 3; i++) {
          fx.noise(0.12, { type: "bandpass", freq: 1200, q: 3, vol: 0.4, at: i * 0.18 });
          fx.tone(160, 0.1, { type: "square", vol: 0.1, at: i * 0.18 });
        }
        fx.style(s, { clipPath: "polygon(0 0, 62% 0, 66% 7%, 72% 4%, 76% 12%, 83% 9%, 86% 18%, 93% 17%, 94% 26%, 100% 29%, 100% 100%, 0 100%)" }, 2800);
        await fx.wait(2800);
        fx.tone(700, 0.25, { type: "square", vol: 0.08 });
        fx.click({ freq: 1500, vol: 0.4 });
        await fx.fadeOut(eyes, 500);
      }
    },

    // Who Framed Roger Rabbit
    {
      id: 856,
      run: async (fx) => {
        const h = fx.rect("body > header");
        const hole = fx.put(A.S("0 0 100 160", '<path d="M36 40 C28 20 26 0 34 0 C42 0 44 22 44 40 C48 22 54 2 62 4 C70 6 64 28 58 42 C74 48 78 66 68 76 L84 92 L70 96 L62 88 C66 104 70 122 60 134 L72 158 H54 L50 142 H44 L40 158 H22 L34 134 C22 120 26 102 32 90 L18 96 L12 84 L30 76 C20 66 22 48 36 40 Z" fill="#0b0907"/>'), h.x, h.y, { size: Math.min(110, h.height * 0.8), h: Math.min(176, h.height * 1.3) });
        fx.noise(0.3, { type: "bandpass", freq: 900, q: 0.8, vol: 0.6 });
        fx.thud({ vol: 0.5 });
        fx.shake("md", 300);
        fx.particles({ kind: "burst", from: pt(h.x, h.y), count: 14, spread: 50, gravity: 40, dur: 900, stagger: 0, glyphs: '<div style="width:100%;height:100%;background:#f1e3c2;border:1px solid #1f1b16"></div>', min: 5, max: 10, spin: 360 });
        fx.tone(1600, 0.9, { type: "sine", slide: 200, vol: 0.1, at: 0.3 });
        await fx.wait(2600);
        await fx.fadeOut(hole, 400);
      }
    },

    // Coraline
    {
      id: 14836,
      run: async (fx) => {
        const button = (cx, cy, r) => '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#1f1b16"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.72) + '" fill="none" stroke="#3a3a3a" stroke-width="1"/>' +
          [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => '<circle cx="' + (cx + a * r * 0.3) + '" cy="' + (cy + b * r * 0.3) + '" r="' + r * 0.13 + '" fill="#777"/>').join("") +
          '<path d="M' + (cx - r * 0.3) + " " + (cy - r * 0.3) + " L" + (cx + r * 0.3) + " " + (cy + r * 0.3) + " M" + (cx + r * 0.3) + " " + (cy - r * 0.3) + " L" + (cx - r * 0.3) + " " + (cy + r * 0.3) + '" stroke="#fbf4e2" stroke-width="1"/>';
        const stitch = () => { for (let i = 0; i < 4; i++) fx.click({ freq: 3500, vol: 0.2, at: i * 0.09 }); };
        stitch();
        fx.costume(".reely", button(52.5, 55, 7.5) + button(67.5, 55, 7.5), 4200);
        await fx.wait(700);
        stitch();
        fx.costume(".kernel", button(58, 88, 6) + button(72, 88, 6), 3500);
        fx.wash("rgba(40,30,80,.25)", 3500, { blend: "multiply", fade: 400 });
        fx.tone("E5", 2.8, { type: "sine", vol: 0.05, vibrato: [5, 10], attack: 0.5 });
        await fx.wait(3500);
      }
    },

    // Paddington
    {
      id: 116149,
      run: async (fx) => {
        const hat = fx.costume(".reely", '<g class="hat"><path d="M26 26 C28 14 40 6 60 6 C80 6 92 14 94 26 Z" fill="#c8261e" stroke="#1f1b16" stroke-width="3"/><path d="M16 28 C40 20 80 20 104 28 C80 34 40 34 16 28 Z" fill="#c8261e" stroke="#1f1b16" stroke-width="3"/></g>');
        if (!hat) return;
        fx.cls(".reely", "hop", 600);
        await fx.wait(1600);
        const g = hat.querySelector(".hat");
        fx.move(g, [{ transform: "translateY(0)" }, { transform: "translateY(-18px)" }], { duration: 300, easing: "ease-out" });
        const reely = fx.rect(".reely");
        fx.tone("G5", 0.2, { type: "triangle", vol: 0.1 });
        fx.tone("C6", 0.3, { type: "triangle", vol: 0.1, at: 0.15 });
        await fx.fly(A.S("0 0 40 30", '<path d="M2 12 L20 2 L38 12 L20 22 Z" fill="#f3e0b0" ' + A.ink + ' stroke-width="2"/><path d="M4 14 L20 24 L36 14" stroke="#f08a1a" stroke-width="3" fill="none"/><path d="M2 12 V18 L20 28 L38 18 V12" fill="#f3e0b0" ' + A.ink + ' stroke-width="2"/>'), [reely.x, reely.top + 16], [reely.x + 20, reely.top + reely.height + 30], { size: 30, h: 22, dur: 700, easing: "ease-in", r2: 200 });
        fx.thud({ freq: 300, vol: 0.2, dur: 0.1 });
        await fx.wait(1200);
      }
    },

    // Paddington 2
    {
      id: 346648,
      run: async (fx) => {
        const sock = A.S("0 0 30 50", '<path d="M8 2 H22 V30 L28 38 C30 44 24 48 18 46 L6 38 C4 36 8 32 8 28 Z" fill="#d8261e" ' + A.ink + ' stroke-width="2"/><path d="M8 8 H22" stroke="#fff" stroke-width="3"/>');
        fx.noise(1.4, { type: "bandpass", freq: 400, q: 1, vol: 0.2 });
        await fx.fly(sock, [-40, H() * 0.6], [W() + 40, H() * 0.55], { size: 28, h: 46, dur: 1300, r2: 720 });
        const pink = fx.wash("#ffa6c9", 0, { blend: "multiply", opacity: 0 });
        fx.chord(["F4", "A4", "C5"], 2, { type: "triangle", vol: 0.07, attack: 0.4 });
        await fx.anim(pink, [{ opacity: 0 }, { opacity: 0.75 }], { duration: 900 });
        await fx.wait(1800);
        await fx.fadeOut(pink, 700);
      }
    },

    // The Lego Movie
    {
      id: 137106,
      run: async (fx) => {
        const studs = fx.glass("", { style: { backgroundImage: "radial-gradient(circle at 50% 45%, rgba(255,255,255,.55) 0 3px, rgba(0,0,0,.18) 5px, transparent 6.5px)", backgroundSize: "18px 18px", opacity: 0 } });
        if (studs) fx.fadeIn(studs, 300);
        const colors = ["#e3000b", "#ffd500", "#0055bf", "#00852b", "#fe8a18", "#fff"];
        const brick = (i) => '<svg viewBox="0 0 40 26"><rect x="1" y="7" width="38" height="18" rx="2" fill="' + colors[i % colors.length] + '" stroke="#1f1b16" stroke-width="2"/><rect x="7" y="2" width="8" height="6" rx="1" fill="' + colors[i % colors.length] + '" stroke="#1f1b16" stroke-width="2"/><rect x="25" y="2" width="8" height="6" rx="1" fill="' + colors[i % colors.length] + '" stroke="#1f1b16" stroke-width="2"/></svg>';
        fx.particles({ kind: "fall", count: 40, glyphs: brick, min: 14, max: 24, dur: 2200, stagger: 1800, spin: 540 });
        for (let i = 0; i < 18; i++) fx.click({ freq: 2200 + Math.random() * 1800, vol: 0.3, at: 0.2 + i * 0.16 + Math.random() * 0.05 });
        fx.seq([["C5", 1], ["C5", 1], ["E5", 1], ["G5", 2], ["C6", 3]], { beat: 0.14, type: "square", vol: 0.04, at: 0.1 });
        await fx.wait(3600);
        if (studs) await fx.fadeOut(studs, 400);
      }
    },

    // How to Train Your Dragon
    {
      id: 10191,
      run: async (fx) => {
        fx.tone(2400, 1.2, { slide: 500, vol: 0.12, type: "sawtooth", filter: { type: "bandpass", freq: 1800, q: 2 } });
        const flight = fx.fly(A.dragon, [W() + 100, H() * 0.15], [-120, H() * 0.3], { size: 140, h: 70, dur: 1400, via: [W() * 0.5, H() * 0.55], easing: "ease-in-out" });
        await fx.wait(700);
        const r = fx.rect(fx.slot());
        A.ring(fx, r.x, r.y, { size: 220, color: "#b28bff", width: 8, dur: 600 });
        fx.flash("rgba(160,110,255,.7)", 200);
        fx.thud({ freq: 70, vol: 0.7 });
        fx.noise(0.6, { freq: 1500, sweep: 200, vol: 0.4 });
        fx.shake("md", 400);
        await flight;
        await fx.wait(300);
      }
    },

    // Kung Fu Panda
    {
      id: 9502,
      run: async (fx) => {
        [110, 163, 227, 331].forEach((f, i) => fx.tone(f, 3.2, { vol: [0.35, 0.18, 0.1, 0.06][i], attack: 0.005, type: "sine" }));
        fx.noise(1.2, { type: "bandpass", freq: 2000, q: 1, vol: 0.1 });
        fx.shake("sm", 400);
        await fx.particles({ kind: "fall", count: 36, glyphs: A.petal("#ffb3c8"), min: 8, max: 14, dur: 3600, stagger: 1800, wind: 120, spin: 360 });
      }
    },

    // Despicable Me
    {
      id: 20352,
      run: async (fx) => {
        const night = fx.wash("rgba(10,15,40,.6)", 0);
        fx.fadeIn(night, 400);
        const mx = W() * 0.75, my = H() * 0.18;
        const moon = fx.put(A.moon, mx, my, { size: 110 });
        await fx.wait(900);
        const beam = fx.node("", { style: { position: "absolute", left: W() * 0.3 + "px", top: H() + "px", width: Math.hypot(mx - W() * 0.3, H() - my) + "px", height: "8px", background: "linear-gradient(90deg, #6aff6a, #d8ffd0)", boxShadow: "0 0 16px 4px #6aff6a", transformOrigin: "0 50%", transform: "rotate(" + Math.atan2(my - H(), mx - W() * 0.3) * 180 / Math.PI + "deg)" } });
        fx.tone(200, 0.9, { type: "sawtooth", slide: 1800, vol: 0.12, filter: { freq: 2000 } });
        await fx.wait(700);
        fx.remove(beam);
        fx.tone(1800, 0.3, { slide: 3000, vol: 0.1 });
        await fx.anim(moon, [{ transform: "scale(1)" }, { transform: "scale(.12)" }], { duration: 500, easing: "steps(5)" });
        await fx.wait(1200);
        fx.fadeOut(moon, 300);
        await fx.fadeOut(night, 400);
      }
    },

    // Minions
    {
      id: 211672,
      run: async (fx) => {
        const banana = A.S("0 0 50 40", '<path d="M4 8 C8 30 30 38 46 26 C40 30 20 28 12 6 Z" fill="#f7d633" ' + A.ink + ' stroke-width="2"/><path d="M4 8 L2 4" ' + A.ink + ' stroke-width="3"/>');
        ["A5", "F5", "A5"].forEach((nn, i) => fx.tone(nn, 0.16, { type: "square", vol: 0.06, at: i * 0.2, slide: i === 2 ? "D6" : undefined, filter: { type: "bandpass", freq: 1500 } }));
        const y = H() * 0.55;
        for (let i = 0; i < 3; i++) {
          fx.fly(banana, [-40 - i * 50, y], [W() + 40, y - 30], { size: 36, h: 28, dur: 2000, via: [W() / 2 - i * 20, y - 100], r2: 720 });
        }
        await fx.wait(2400);
      }
    },

    // Wreck-It Ralph
    {
      id: 82690,
      run: async (fx) => {
        const m = fx.rect(".machine");
        for (let i = 0; i < 4; i++) {
          fx.sfx("hit", { at: i * 300, vol: 0.7 });
          fx.later(i * 300, () => fx.shake("md", 200));
        }
        fx.particles({ kind: "burst", from: pt(m.x, m.top + 20, m.width, 0), count: 26, spread: 50, gravity: H() * 0.6, dur: 1400, stagger: 1100, glyphs: (i) => '<div style="width:100%;height:100%;background:' + ["#b3402d", "#87301f", "#d9a13a"][i % 3] + ';border:2px solid #1f1b16"></div>', min: 8, max: 14 });
        await fx.wait(1800);
        fx.seq([["C6", 1], ["E6", 1], ["G6", 1], ["C7", 2]], { beat: 0.07, type: "square", vol: 0.06 });
        A.sparkleOn(fx, ".machine", 16, "#ffe07a");
        fx.sfx("arcade-up", { vol: 0.8 });
        const gold = fx.wash("rgba(255,210,80,.35)", 800, { blend: "screen" });
        void gold;
        await fx.wait(1200);
      }
    },

    // Space Jam
    {
      id: 2300,
      run: async (fx) => {
        const ball = fx.put(A.S("0 0 40 40", '<circle cx="20" cy="20" r="18" fill="#e46b1e" ' + A.ink + ' stroke-width="2"/><path d="M2 20 H38 M20 2 V38 M7 7 C14 14 14 26 7 33 M33 7 C26 14 26 26 33 33" stroke="#1f1b16" stroke-width="1.5" fill="none"/>'), 0, 0, { size: 30 });
        const floor = H() - 50;
        const hops = 6;
        const frames = [];
        for (let i = 0; i <= hops * 2; i++) {
          const x = -30 + (W() + 60) * (i / (hops * 2));
          const y = i % 2 ? floor - 150 + i * 6 : floor;
          frames.push({ transform: "translate(" + x + "px," + y + "px) rotate(" + i * 90 + "deg)" });
        }
        for (let i = 0; i < hops; i++) fx.thud({ freq: 140, vol: 0.4, dur: 0.12, at: 0.4 + i * (3 / hops) });
        await fx.move(ball, frames, { duration: 3000, easing: "linear" });
        if (fx.reduced) { ball.style.transform = "translate(" + W() / 2 + "px," + floor + "px)"; await fx.wait(1500); }
      }
    },

    // Sonic the Hedgehog
    {
      id: 454626,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const ring = '<div style="width:100%;height:100%;border-radius:50%;border:4px solid #ffd21a;box-shadow:0 0 6px #ffe98a, inset 0 0 3px #b8860b"></div>';
        const n = 8;
        const all = [];
        for (let i = 0; i < n; i++) {
          const x = W() * 0.1 + i * (W() * 0.8 / (n - 1));
          const y = H() * 0.3 - Math.sin(i / (n - 1) * Math.PI) * 60;
          const el = fx.put(ring, x, y, { size: 22 });
          fx.move(el, [{ transform: "scaleX(1)" }, { transform: "scaleX(.2)" }], { duration: 300, iterations: 8, direction: "alternate" });
          all.push([el, x, y]);
        }
        await fx.wait(600);
        for (let i = 0; i < all.length; i++) {
          const [el, x, y] = all[i];
          fx.tone("E6", 0.08, { vol: 0.08, at: 0 });
          fx.tone("A6", 0.18, { vol: 0.08, at: 0.06 });
          fx.move(el, [{ transform: "translate(0,0)" }, { transform: "translate(" + (r.x - x) + "px," + (r.y - y) + "px) scale(.4)" }], { duration: 260, easing: "ease-in" }).then(() => fx.remove(el));
          if (fx.reduced) fx.fadeOut(el, 200);
          await fx.wait(90);
        }
        await fx.wait(500);
      }
    },

    // The Super Mario Bros. Movie
    {
      id: 502356,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const block = fx.put('<div style="width:100%;height:100%;background:#f7b21a;border:3px solid #1f1b16;box-shadow:inset -3px -3px 0 #b86b0a, inset 3px 3px 0 #ffe08a;display:flex;align-items:center;justify-content:center;font:700 22px Georgia;color:#fff;text-shadow:2px 2px 0 #1f1b16">?</div>', r.x, r.top - 26, { size: 32 });
        fx.fadeIn(block, 150);
        await fx.wait(700);
        fx.thud({ freq: 220, vol: 0.3, dur: 0.1 });
        fx.move(block, [{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0)" }], { duration: 180 });
        fx.tone("B5", 0.08, { type: "square", vol: 0.08 });
        fx.tone("E6", 0.35, { type: "square", vol: 0.08, at: 0.08 });
        await fx.fly(A.coin("#ffd21a"), [r.x, r.top - 40], [r.x, r.top - 40], { size: 22, dur: 600, via: [r.x, r.top - 110], easing: "ease-out" });
        fx.style(block.firstChild, { background: "#a0602a", color: "transparent" });
        await fx.wait(900);
        await fx.fadeOut(block, 300);
      }
    },

    // Spider-Man: Into the Spider-Verse
    {
      id: 324857,
      run: async (fx) => {
        const dots = fx.node("", { cls: "fx-filter", style: { backgroundImage: "radial-gradient(circle, rgba(255,40,120,.35) 1.4px, transparent 1.8px)", backgroundSize: "7px 7px", mixBlendMode: "multiply" } });
        fx.style("body > header h1", { textShadow: "-3px 0 0 rgba(0,200,255,.85), 3px 0 0 rgba(255,0,90,.85)" }, 3000);
        fx.style(".machine", { filter: "drop-shadow(-3px 0 0 rgba(0,200,255,.6)) drop-shadow(3px 0 0 rgba(255,0,90,.6))" }, 3000);
        for (let i = 0; i < 6; i++) {
          fx.tone(200 + Math.random() * 1200, 0.05, { type: "square", vol: 0.06, at: i * 0.35 });
          fx.later(i * 350, () => fx.move(fx.pageParts(), [{ transform: "translate(" + (Math.random() * 8 - 4) + "px,0) skewX(" + (Math.random() * 6 - 3) + "deg)" }, { transform: "none" }], { duration: 90, fill: "none" }));
        }
        await fx.wait(3000);
        await fx.fadeOut(dots, 300);
      }
    },

    // Cars
    {
      id: 920,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.noise(0.8, { type: "bandpass", freq: 900, q: 1, vol: 0.4, pan: -1, panTo: 1 });
        fx.tone(220, 0.8, { type: "sawtooth", slide: 520, vol: 0.08, filter: { freq: 1200 } });
        const bolt = fx.put(A.S("0 0 60 60", '<path d="M36 2 L12 34 H28 L20 58 L50 22 H32 Z" fill="#ffcf1a" stroke="#e03a1a" stroke-width="3" stroke-linejoin="round"/>'), r.x, r.y, { size: r.width * 0.7 });
        await fx.anim(bolt, [{ transform: "scale(3) rotate(-30deg)", opacity: 0 }, { transform: "scale(1) rotate(0)", opacity: 1 }], { duration: fx.reduced ? 10 : 250, easing: "ease-in" });
        fx.thud({ freq: 300, vol: 0.2, dur: 0.1 });
        for (let i = 0; i < 3; i++) {
          await fx.wait(380);
          fx.click({ freq: 4200, vol: 0.4 });
          const fl = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#fff,rgba(255,255,255,0) 70%)"></div>', r.x + (Math.random() - 0.5) * 160, r.y + (Math.random() - 0.5) * 120, { size: 70 });
          fx.fadeOut(fl, 300);
        }
        await fx.wait(1300);
        await fx.fadeOut(bolt, 300);
      }
    },

    // The Nightmare Before Christmas
    {
      id: 9479,
      run: async (fx) => {
        const night = fx.wash("rgba(20,20,40,.55)", 0);
        fx.fadeIn(night, 500);
        const moon = fx.put(A.moon, W() * 0.5, H() * 0.36, { size: Math.min(W(), H()) * 0.55 });
        const hill = fx.node(A.S("0 0 400 200",
          '<path d="M0 200 C100 190 150 150 190 120 C210 104 214 90 204 84 C194 78 182 88 190 96 C198 104 210 98 210 88" fill="none" stroke="#0b0907" stroke-width="10" stroke-linecap="round" class="curl" pathLength="1"/>' +
          '<path d="M0 200 C100 190 150 150 190 120 L260 200 Z" fill="#0b0907"/>'),
        { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "40vh" } });
        hill.firstChild.setAttribute("preserveAspectRatio", "xMidYMax meet");
        hill.firstChild.style.cssText = "width:100%;height:100%";
        const curl = hill.querySelector(".curl");
        curl.style.strokeDasharray = "1";
        curl.style.strokeDashoffset = fx.reduced ? "0" : "0.45";
        fx.tone("D4", 3.2, { type: "sine", vol: 0.06, vibrato: [5, 8], attack: 0.6 });
        fx.tone("Ab4", 3.2, { type: "sine", vol: 0.04, vibrato: [4, 8], attack: 0.9 });
        await fx.move(curl, [{ strokeDashoffset: 0.45 }, { strokeDashoffset: 0 }], { duration: 2400, easing: "ease-out" });
        await fx.wait(fx.reduced ? 2400 : 900);
        fx.fadeOut(moon, 500);
        fx.fadeOut(hill, 500);
        await fx.fadeOut(night, 500);
      }
    },

    // Willy Wonka & the Chocolate Factory (1971)
    {
      id: 252,
      run: async (fx) => {
        const peek = fx.$(".ticket-peek");
        if (!peek) return;
        fx.style(peek, { background: "linear-gradient(110deg, #c99a1a, #ffe68a 45%, #c99a1a 60%, #ffd24a)", color: "#5a3a0a", boxShadow: "0 0 18px 6px rgba(255,210,80,.8)", position: "relative", zIndex: "86" });
        fx.text(peek, "GOLDEN TICKET", 0);
        ["C5", "E5", "G5", "C6", "E6", "G6", "C7"].forEach((nn, i) => fx.tone(nn, 0.5, { vol: 0.06, at: i * 0.09 }));
        A.sparkleOn(fx, peek, 16, "#fff4b0");
        await fx.move(peek, [{ transform: "translateY(0)" }, { transform: "translateY(-26px) rotate(-4deg) scale(1.15)" }, { transform: "translateY(-22px) rotate(3deg) scale(1.15)" }, { transform: "translateY(0)" }], { duration: 3000, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Charlie and the Chocolate Factory (2005)
    {
      id: 118,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const stat = fx.put('<div class="fx-static" style="width:100%;height:100%;border-radius:6px;opacity:.85"></div>', r.x, r.y, { size: r.width, h: r.height });
        fx.sfx("static", { dur: 1.3, vol: 0.45 });
        fx.sfx("slide-whistle", { down: true, vol: 0.6 });
        fx.tone(3000, 0.6, { slide: 200, vol: 0.08, at: 0.6 });
        await fx.move(s, [{ transform: "none" }, { transform: "scale(.12)" }], { duration: 600, easing: "steps(6)" });
        await fx.wait(fx.reduced ? 1400 : 700);
        fx.remove(stat);
        fx.sfx("pop", { vol: 0.6 });
        await fx.move(s, [{ transform: "scale(.12)" }, { transform: "none" }], { duration: 300, easing: "steps(3)" });
        if (fx.reduced) fx.remove(stat);
      }
    },

    // Mary Poppins
    {
      id: 433,
      run: async (fx) => {
        fx.noise(3.6, { freq: 700, sweep: 1500, vol: 0.2, attack: 0.8 });
        fx.particles({ kind: "sweep", count: 26, glyphs: (i) => A.leaf(["#b8732a", "#d9a13a", "#8a5a1a"][i % 3]), min: 10, max: 18, dur: 1800, stagger: 2400, spin: 540, dir: "rtl" });
        const umb = A.S("0 0 80 110", '<path d="M4 34 C4 8 76 8 76 34 C70 28 62 28 58 34 C52 28 46 28 40 34 C34 28 28 28 22 34 C18 28 10 28 4 34 Z" fill="#1f1b16"/><path d="M40 10 V94 C40 104 52 104 52 94" stroke="#6b3a1a" stroke-width="4" fill="none"/><path d="M40 4 V10" stroke="#1f1b16" stroke-width="3"/>' +
          '<path d="M52 94 C54 100 50 106 46 106" stroke="none"/>');
        ["G4", "C5", "E5", "G5"].forEach((nn, i) => fx.tone(nn, 0.9, { type: "triangle", vol: 0.06, at: 0.6 + i * 0.4 }));
        await fx.fly(umb, [W() * 0.75, -110], [W() * 0.55, H() * 0.55], { size: 70, h: 96, dur: 3400, via: [W() * 0.35, H() * 0.25], r0: -10, r1: 12, r2: -4, easing: "ease-out", keep: true });
        await fx.wait(600);
      }
    },

    // The Sound of Music
    {
      id: 15121,
      run: async (fx) => {
        const hills = fx.node(A.S("0 0 400 120", '<path d="M0 120 V70 C60 30 120 20 200 50 C260 72 320 30 400 40 V120 Z" fill="#6aa84f"/><path d="M0 120 V92 C80 70 160 80 240 96 C300 104 350 84 400 80 V120 Z" fill="#4a8a3a"/>'), { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "26vh" } });
        hills.firstChild.setAttribute("preserveAspectRatio", "none");
        hills.firstChild.style.cssText = "width:100%;height:100%";
        fx.move(hills, [{ transform: "translateY(100%)" }, { transform: "none" }], { duration: 900, easing: "ease-out" });
        fx.seq(["C5", "D5", "E5", "F5", "G5", "A5", "B5", "C6"].map((n) => [n, 1]), { beat: 0.26, type: "triangle", vol: 0.08, at: 0.5 });
        fx.later(2600, () => fx.cls(".reely", "hop", 600));
        await fx.wait(3600);
        await fx.fadeOut(hills, 500);
      }
    }
  ]);
})();
