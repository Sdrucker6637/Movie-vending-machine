/* Machine FX cues - action, crime, sci-fi and superheroes.
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
  const streak = (c) => '<div class="fx-streak" style="height:100%;background:' + (c || "#fff") + '"></div>';

  M.register([
    // Fight Club
    {
      id: 550,
      run: async (fx) => {
        const burn = () => {
          const el = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, rgba(20,10,0,.0) 30%, rgba(20,10,0,.75) 55%, rgba(255,220,160,.5) 62%, transparent 70%)"></div>', W() - 42, 70, { size: 38 });
          fx.later(90, () => fx.remove(el));
        };
        fx.click({ freq: 900, vol: 0.3 });
        burn();
        fx.marquee("", 1300);
        await fx.wait(1300);
        burn();
        fx.click({ freq: 900, vol: 0.3 });
        await fx.wait(1100);
        const r = fx.rect(fx.slot());
        const guy = fx.put(A.S("0 0 60 100", '<circle cx="30" cy="18" r="12" fill="#1f1b16"/><path d="M10 100 C10 60 14 36 30 34 C46 36 50 60 50 100 Z" fill="#1f1b16"/><path d="M24 16 L28 17 M34 17 L38 16" stroke="#fbf4e2" stroke-width="1.5"/>'), r.x, r.y, { size: r.width * 0.8, h: r.height * 0.9, style: { opacity: fx.reduced ? "0.5" : "0.9" } });
        await fx.wait(fx.reduced ? 300 : 70);
        fx.remove(guy);
        await fx.wait(400);
      }
    },

    // Pulp Fiction
    {
      id: 680,
      run: async (fx) => {
        const s = A.liftSlot(fx, 3800);
        if (!s) return;
        const r = fx.rect(s);
        const glow = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, rgba(255,220,120,.95), rgba(255,180,40,.5) 35%, transparent 70%)"></div>', r.x, r.y, { size: Math.max(r.width, r.height) * 2.4 });
        fx.style(s, { filter: "brightness(1.15) sepia(.3)" }, 3800);
        fx.chord(["A4", "E5", "A5"], 3.4, { vol: 0.05, attack: 0.8, vibrato: [5, 3] });
        await fx.anim(glow, [{ opacity: 0, transform: "scale(.5)" }, { opacity: 1, transform: "scale(1)", offset: 0.3 }, { opacity: 0.8, transform: "scale(1.05)", offset: 0.7 }, { opacity: 0, transform: "scale(1)" }], { duration: 3600 });
      }
    },

    // The Dark Knight
    {
      id: 155,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(20,30,50,.35)", 3400, { blend: "multiply", fade: 400 });
        fx.tone(220, 2.4, { type: "sawtooth", vol: 0.05, slide: 330, filter: { type: "bandpass", freq: 1200, q: 3 } });
        const card = fx.put(A.card, W() + 40, H() * 0.3, { size: 50, h: 70 });
        await fx.move(card, [{ transform: "translate(0,0) rotate(0) rotateY(0)" }, { transform: "translate(" + (r.x - W() - 40) + "px," + (r.y - H() * 0.3) + "px) rotate(-380deg) rotateY(720deg)" }], { duration: 1100, easing: "ease-out" });
        if (fx.reduced) card.style.transform = "translate(" + (r.x - W() - 40) + "px," + (r.y - H() * 0.3) + "px) rotate(-20deg)";
        fx.click({ freq: 1800, vol: 0.4 });
        await fx.wait(2200);
        await fx.fadeOut(card, 400);
      }
    },

    // Batman Begins
    {
      id: 272,
      run: async (fx) => {
        fx.noise(2, { type: "bandpass", freq: 1400, q: 0.6, vol: 0.4, attack: 0.2 });
        fx.buzz([30, 20, 30, 20, 30]);
        await fx.particles({ kind: "rise", count: 34, glyphs: A.bat, min: 22, max: 44, dur: 1600, stagger: 900, wind: 0, easing: "ease-in" });
      }
    },

    // Batman (1989)
    {
      id: 268,
      run: async (fx) => {
        const h = fx.rect("body > header");
        const night = fx.wash("rgba(10,15,30,.7)", 0, { opacity: 0 });
        fx.anim(night, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 });
        const size = Math.min(h.width * 0.8, 300);
        const sig = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(ellipse, #fff7c8 0 55%, rgba(255,247,200,.3) 70%, transparent 72%);display:flex;align-items:center;justify-content:center">' +
          '<svg viewBox="0 0 60 30" style="width:70%">' + A.bat.replace(/^<svg[^>]*>|<\/svg>$/g, "") + "</svg></div>", h.x, h.y, { size, h: size * 0.6 });
        fx.chord(["D3", "F3", "A3"], 3, { type: "sawtooth", vol: 0.05, attack: 0.8, filter: { freq: 600 } });
        await fx.anim(sig, [{ opacity: 0 }, { opacity: 0.95 }], { duration: 700 });
        await fx.wait(2200);
        fx.fadeOut(sig, 500);
        await fx.fadeOut(night, 500);
      }
    },

    // Predator
    {
      id: 106,
      run: async (fx) => {
        fx.filter("invert(1) hue-rotate(180deg) saturate(4) contrast(1.4)", 3600, { fade: 250 });
        const r = fx.rect(fx.slot());
        const tri = fx.put(A.S("0 0 40 36", '<circle cx="20" cy="4" r="3" fill="#ff1a1a"/><circle cx="4" cy="32" r="3" fill="#ff1a1a"/><circle cx="36" cy="32" r="3" fill="#ff1a1a"/>'), r.x, r.y, { size: 36, h: 32, style: { filter: "drop-shadow(0 0 4px #f00)" } });
        fx.move(tri, [{ transform: "translate(-30px,-40px)" }, { transform: "translate(10px,5px)" }, { transform: "none" }], { duration: 1500, easing: "ease-out" });
        for (let i = 0; i < 6; i++) fx.noise(0.06, { type: "bandpass", freq: 1200, q: 6, vol: 0.3, at: 0.6 + i * 0.13 });
        await fx.wait(3600);
      }
    },

    // RoboCop (1987)
    {
      id: 5548,
      run: async (fx) => {
        fx.wash("rgba(100,160,255,.25)", 3400, { blend: "multiply", fade: 200 });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 3400 });
        const scan = fx.node("", { style: { position: "absolute", left: 0, right: 0, top: 0, height: "3px", background: "#dff", boxShadow: "0 0 10px 3px #aff" } });
        fx.sfxSeq([["whir", 0, { vol: 0.8 }], ["whir", 600, { vol: 0.7, rate: 0.8 }], ["relay", 1300, { vol: 0.6 }]]);
        fx.tone(600, 0.4, { type: "sawtooth", slide: 350, vol: 0.08, at: 0.6, filter: { freq: 1500 } });
        fx.move(".reely", [{ transform: "rotate(0)" }, { transform: "rotate(-12deg)", offset: 0.3 }, { transform: "rotate(-12deg)", offset: 0.6 }, { transform: "rotate(0)" }], { duration: 1400, easing: "steps(6)" });
        await fx.move(scan, [{ transform: "translateY(0)" }, { transform: "translateY(" + H() + "px)" }], { duration: 1600, iterations: 2 });
        if (fx.reduced) await fx.wait(3000);
      }
    },

    // Total Recall (1990)
    {
      id: 861,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        fx.wash("rgba(200,60,30,.3)", 3400, { blend: "multiply", fade: 300 });
        const bands = [[0, 33], [33, 66], [66, 100]].map(([a, b], i) => {
          const c = s.cloneNode(true);
          c.style.cssText = "width:100%;height:100%;margin:0;clip-path:inset(" + a + "% 0 " + (100 - b) + "% 0)";
          const holder = fx.put("", r.x, r.y, { size: r.width, h: r.height });
          holder.appendChild(c);
          return [holder, i];
        });
        fx.style(s, { visibility: "hidden" }, 3000);
        for (let i = 0; i < 3; i++) fx.tone(180 - i * 30, 0.25, { type: "square", vol: 0.1, at: 0.2 + i * 0.3, filter: { freq: 700 } });
        await Promise.all(bands.map(([el, i]) => fx.move(el, [{ transform: "none" }, { transform: "translate(" + (i - 1) * 10 + "px," + (i - 1) * 16 + "px)" }], { duration: 900, delay: 200 + i * 300, easing: "steps(4)" })));
        await fx.wait(1300);
        await Promise.all(bands.map(([el, i]) => fx.move(el, [{ transform: "translate(" + (i - 1) * 10 + "px," + (i - 1) * 16 + "px)" }, { transform: "none" }], { duration: 300 })));
      }
    },

    // Tron (1982)
    {
      id: 97,
      run: async (fx) => {
        const m = fx.rect(".machine");
        const pad = 6;
        const svg = fx.node('<svg style="position:absolute;left:' + (m.left - pad) + "px;top:" + (m.top - pad) + "px;width:" + (m.width + pad * 2) + "px;height:" + (m.height + pad * 2) + 'px;overflow:visible"><rect class="a" x="2" y="2" width="' + (m.width + pad * 2 - 4) + '" height="' + (m.height + pad * 2 - 4) + '" rx="6" pathLength="1" fill="none" stroke="#35f0ff" stroke-width="4" style="filter:drop-shadow(0 0 6px #35f0ff)"/>' +
          '<rect class="b" x="2" y="2" width="' + (m.width + pad * 2 - 4) + '" height="' + (m.height + pad * 2 - 4) + '" rx="6" pathLength="1" fill="none" stroke="#ff9a1a" stroke-width="4" style="filter:drop-shadow(0 0 6px #ff9a1a)"/></svg>');
        const a = svg.querySelector(".a"), b = svg.querySelector(".b");
        [a, b].forEach((el) => { el.style.strokeDasharray = "0.18 1"; });
        fx.tone(110, 2.4, { type: "sawtooth", vol: 0.08, slide: 220, filter: { freq: 900 } });
        fx.tone(165, 2.4, { type: "square", vol: 0.04, slide: 330, filter: { freq: 900 } });
        if (fx.reduced) { a.style.strokeDasharray = "1"; await fx.wait(2400); return; }
        fx.anim(a, [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }], { duration: 2400, easing: "linear" });
        await fx.anim(b, [{ strokeDashoffset: 0.5 }, { strokeDashoffset: 1.5 }], { duration: 2400, easing: "linear" });
      }
    },

    // TRON: Legacy
    {
      id: 20526,
      run: async (fx) => {
        const floor = fx.node("", { style: { position: "absolute", left: "-50%", right: "-50%", bottom: 0, height: "30vh", background: "linear-gradient(90deg, rgba(53,240,255,.7) 1px, transparent 1px) 0 0/40px 40px, linear-gradient(rgba(53,240,255,.7) 1px, transparent 1px) 0 0/40px 40px", transform: "perspective(200px) rotateX(55deg)", transformOrigin: "50% 100%", opacity: 0, maskImage: "linear-gradient(transparent, #000)", webkitMaskImage: "linear-gradient(transparent, #000)" } });
        fx.fadeIn(floor, 600);
        fx.wash("rgba(0,30,50,.5)", 3600, { blend: "multiply", fade: 400 });
        const s = fx.slot();
        await fx.wait(900);
        if (s) {
          const r = fx.rect(s);
          fx.noise(0.5, { type: "highpass", freq: 2500, vol: 0.3 });
          fx.anim(s, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "steps(3)" });
          await fx.particles({ kind: "burst", from: pt(r.x, r.y, r.width, r.height), count: 24, spread: 40, dur: 800, stagger: 100, glyphs: '<div style="width:100%;height:100%;background:#35f0ff;box-shadow:0 0 6px #35f0ff"></div>', min: 4, max: 9 });
          fx.tone(400, 0.4, { type: "square", vol: 0.06, slide: 1200 });
          await fx.anim(s, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: "steps(4)" });
        }
        await fx.wait(800);
        await fx.fadeOut(floor, 400);
      }
    },

    // WarGames
    {
      id: 860,
      run: async (fx) => {
        const slots = fx.$$("#grid .slot");
        const order = [5, 0, 10, 15, 6, 9, 3, 12, 1, 14, 2, 13, 4, 11, 7, 8];
        const marks = [];
        for (let i = 0; i < order.length; i++) {
          const s = slots[order[i]];
          if (!s) continue;
          const r = fx.rect(s);
          const mark = fx.put('<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font:700 ' + r.width * 0.7 + 'px monospace;color:#6dff8a;text-shadow:0 0 8px #2bff5a;background:rgba(0,20,0,.75)">' + (i % 2 ? "O" : "X") + "</div>", r.x, r.y, { size: r.width, h: r.height });
          marks.push(mark);
          fx.tone(i % 2 ? 660 : 880, 0.05, { type: "square", vol: 0.07 });
          await fx.wait(Math.max(40, 160 - i * 9));
        }
        await fx.wait(700);
        fx.tone(440, 0.6, { type: "square", vol: 0.06 });
        marks.forEach((m) => fx.remove(m));
        await fx.wait(300);
      }
    },

    // The Fifth Element
    {
      id: 18,
      run: async (fx) => {
        fx.text(".ticket-peek", "MULTIPASS", 3600);
        fx.style(".ticket-peek", { background: "#ff8a1a", color: "#1f1b16" }, 3600);
        fx.move(".ticket-peek", [{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], { duration: 300, iterations: 6, direction: "alternate" });
        const lanes = [H() * 0.15, H() * 0.28, H() * 0.4];
        const colors = ["#ffcf1a", "#3fa7d6", "#e84a4a", "#ffcf1a"];
        for (let i = 0; i < 6; i++) {
          const y = lanes[i % 3];
          const ltr = i % 2 === 0;
          fx.later(i * 380, () => {
            fx.noise(0.6, { type: "bandpass", freq: 900, q: 2, vol: 0.15, pan: ltr ? -1 : 1, panTo: ltr ? 1 : -1 });
            fx.fly(A.car(colors[i % colors.length]), [ltr ? -60 : W() + 60, y], [ltr ? W() + 60 : -60, y + 10], { size: 56, h: 26, dur: 1300, flip: !ltr });
          });
        }
        await fx.wait(3600);
      }
    },

    // Men in Black
    {
      id: 607,
      run: async (fx) => {
        const r = fx.rect("#drawBtn");
        const pen = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#f22;box-shadow:0 0 18px 8px #f44"></div>', r.x, r.top - 30, { size: 14 });
        fx.tone(1800, 0.25, { vol: 0.1 });
        await fx.anim(pen, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 700 });
        fx.remove(pen);
        fx.flash("#fff", fx.reduced ? 400 : 700);
        fx.noise(0.3, { type: "highpass", freq: 4000, vol: 0.4 });
        fx.style("#grid .slot:not(.empty) img, #grid .slot:not(.empty) .label, #grid .slot:not(.empty) .title-fallback", { visibility: "hidden" }, 1300);
        await fx.wait(1300);
        fx.tone(600, 0.2, { vol: 0.08, slide: 900 });
        await fx.wait(300);
      }
    },

    // Independence Day
    {
      id: 602,
      run: async (fx) => {
        const shadow = fx.node("", { style: { position: "absolute", left: "-10%", right: "-10%", top: 0, height: "140vh", background: "linear-gradient(rgba(10,10,20,.85) 60%, transparent)", transform: "translateY(-140vh)" } });
        fx.tone(45, 4, { type: "sawtooth", vol: 0.14, attack: 1.5, filter: { freq: 200 } });
        fx.noise(4, { freq: 150, vol: 0.2, attack: 1.5 });
        fx.buzz(400);
        if (fx.reduced) shadow.style.transform = "translateY(-60vh)";
        await fx.move(shadow, [{ transform: "translateY(-140vh)" }, { transform: "translateY(-60vh)" }], { duration: 2400, easing: "ease-out" });
        const h = fx.rect("body > header");
        const beam = fx.put('<div style="width:100%;height:100%;background:linear-gradient(#9dff9a, #3aff6a);box-shadow:0 0 30px 10px #3aff6a;border-radius:0 0 50% 50%"></div>', h.x, h.top / 2, { size: 26, h: Math.max(20, h.top + 20) });
        fx.tone(900, 1, { vol: 0.08, vibrato: [20, 30] });
        await fx.wait(1300);
        fx.remove(beam);
        await fx.move(shadow, [{ transform: "translateY(-60vh)" }, { transform: "translateY(-140vh)" }], { duration: 900, easing: "ease-in" });
      }
    },

    // Armageddon
    {
      id: 95,
      run: async (fx) => {
        fx.wash("rgba(255,110,40,.2)", 3000, { blend: "multiply", fade: 300 });
        const meteor = '<div style="width:100%;height:100%;background:linear-gradient(90deg, transparent, rgba(255,140,40,.7) 60%, #fff4c0);border-radius:50%;filter:blur(1px)"></div>';
        for (let i = 0; i < 7; i++) {
          fx.later(i * 280, () => {
            const x = Math.random() * W() * 0.8 + W() * 0.3;
            const el = fx.put(meteor, x, -20, { size: 80, h: 8 });
            el.style.transform = "rotate(135deg)";
            fx.move(el, [{ transform: "rotate(135deg) translateX(0)" }, { transform: "rotate(135deg) translateX(" + -H() * 1.2 + "px)" }], { duration: 900, easing: "ease-in" }).then(() => fx.remove(el));
            fx.noise(0.5, { freq: 3000, sweep: 300, vol: 0.2, pan: Math.random() * 2 - 1 });
            fx.later(900, () => { fx.thud({ vol: 0.35 }); fx.shake("sm", 200); });
          });
        }
        await fx.wait(3000);
      }
    },

    // Twister (1996)
    {
      id: 664,
      run: async (fx) => {
        fx.noise(3.4, { type: "bandpass", freq: 500, sweep: 1400, q: 0.8, vol: 0.4, attack: 0.8 });
        fx.shake("sm", 2800);
        fx.particles({ kind: "sweep", count: 30, glyphs: (i) => i % 4 ? dot("rgba(120,100,80,.7)") : A.leaf("#6b8a3a"), min: 5, max: 14, dur: 1100, stagger: 2400, spin: 720 });
        await fx.wait(800);
        fx.tone(500, 0.6, { type: "sawtooth", vol: 0.08, slide: 380, filter: { freq: 900 }, at: 0.7 });
        await fx.fly(A.cow, [-70, H() * 0.6], [W() + 70, H() * 0.25], { size: 64, h: 48, dur: 2200, via: [W() / 2, H() * 0.2], r0: 0, r1: 380, r2: 720 });
      }
    },

    // Mission: Impossible (1996)
    {
      id: 954,
      run: async (fx) => {
        const y = H() - 26;
        const fuse = fx.node("", { style: { position: "absolute", left: "4%", right: "4%", top: y + "px", height: "3px", background: "#c9a87a" } });
        const spark = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle,#fff,#ffcf5a 40%,rgba(255,120,20,0) 70%)"></div>', W() * 0.04, y + 1, { size: 26 });
        fx.noise(2.2, { type: "highpass", freq: 3000, vol: 0.2 });
        fx.move(fuse, [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 100%)" }], { duration: 2200, easing: "linear" });
        await fx.move(spark, [{ transform: "translateX(0)" }, { transform: "translateX(" + W() * 0.92 + "px)" }], { duration: 2200, easing: "linear" });
        fx.remove(spark);
        fx.remove(fuse);
        const r = fx.rect(fx.slot());
        const agent = fx.node('<svg viewBox="0 0 40 1000" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M20 0 V960" stroke="#1f1b16" stroke-width="1.5"/></svg><svg viewBox="0 0 80 30" style="position:absolute;left:-20px;bottom:0;width:80px;height:30px"><path d="M8 16 H60 M60 16 L74 12 M60 16 L74 20 M16 16 L6 26 M28 16 L22 28 M40 16 L40 2" stroke="#1f1b16" stroke-width="5" stroke-linecap="round"/><circle cx="66" cy="16" r="6" fill="#1f1b16"/></svg>', { style: { position: "absolute", left: r.x - 20 + "px", top: 0, width: "40px", height: r.top - 6 + "px", transform: "translateY(-100%)" } });
        fx.tone(200, 1.2, { vol: 0.06, slide: 90 });
        if (fx.reduced) agent.style.transform = "none";
        await fx.move(agent, [{ transform: "translateY(-100%)" }, { transform: "translateY(-8px)", offset: 0.8 }, { transform: "none" }], { duration: 1400, easing: "ease-out" });
        await fx.fly(A.drop("#bfe4ff"), [r.x + 46, r.top - 10], [r.x + 46, r.y], { size: 8, h: 12, dur: 700, easing: "ease-in" });
        fx.tone(3000, 0.05, { vol: 0.2 });
        await fx.wait(700);
        await fx.move(agent, [{ transform: "none" }, { transform: "translateY(-100%)" }], { duration: 500, easing: "ease-in" });
      }
    },

    // John Wick
    {
      id: 245891,
      run: async (fx) => {
        fx.wash("linear-gradient(135deg, rgba(160,40,200,.35), rgba(30,60,200,.3))", 3400, { blend: "multiply", fade: 400 });
        const r = fx.rect(fx.slot());
        fx.tone(3200, 0.6, { vol: 0.12 });
        fx.tone(4800, 0.4, { vol: 0.05 });
        await fx.fly('<div style="width:100%;height:100%">' + A.coin("#e8c050") + "</div>", [W() / 2, H() + 30], [r.x, r.y + r.height * 0.6], { size: 30, dur: 900, via: [W() / 2 - 20, H() * 0.3], r2: 1080, easing: "ease-out", keep: true });
        fx.click({ freq: 5000, vol: 0.5 });
        fx.tone(80, 1.6, { type: "sawtooth", vol: 0.1, filter: { freq: 300 } });
        await fx.wait(2000);
      }
    },

    // Casino Royale (2006)
    {
      id: 36557,
      run: async (fx) => {
        fx.wash("rgba(30,90,50,.3)", 3600, { blend: "multiply", fade: 400 });
        const r = fx.rect(fx.slot());
        const chip = (c) => '<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="13" fill="' + c + '" stroke="#1f1b16" stroke-width="2"/><circle cx="15" cy="15" r="8" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/></svg>';
        for (let i = 0; i < 8; i++) {
          fx.later(i * 120, () => {
            fx.click({ freq: 2800 + i * 60, vol: 0.4 });
            fx.put(chip(["#c8261e", "#1f1b16", "#2a5ac8"][i % 3]), r.x + r.width * 0.6, r.top + r.height - 10 - i * 5, { size: 26, h: 10 });
          });
        }
        await fx.wait(1100);
        const suits = ["♠", "♥", "♦", "♣"];
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 16, spread: 60, dur: 1200, stagger: 400, glyphs: (i) => '<div style="font:700 100%/1 Georgia;color:' + (i % 2 ? "#c8261e" : "#1f1b16") + '">' + suits[i % 4] + "</div>" });
        await fx.wait(2400);
      }
    },

    // Goldfinger
    {
      id: 658,
      run: async (fx) => {
        const s = A.liftSlot(fx, 4000);
        if (!s) return;
        const r = fx.rect(s);
        fx.style(s, { filter: "sepia(1) saturate(3) hue-rotate(-8deg) brightness(1.15) contrast(1.1)", boxShadow: "0 0 18px 4px rgba(255,200,60,.8)" }, 4000);
        A.sparkleOn(fx, s, 12, "#fff3b0");
        fx.chord(["E4", "G4", "B4", "D#5"], 1.8, { type: "sawtooth", vol: 0.04, attack: 0.3, filter: { freq: 1500 } });
        await fx.wait(1400);
        const laser = fx.node("", { style: { position: "absolute", left: r.x - 1 + "px", top: r.top + r.height + "px", width: "3px", height: "0px", background: "#ff2a1a", boxShadow: "0 0 10px 3px #ff2a1a" } });
        fx.tone(1200, 2.2, { type: "sawtooth", vol: 0.04, vibrato: [60, 20], filter: { type: "bandpass", freq: 1500, q: 4 } });
        await fx.tween(2000, (p) => {
          laser.style.top = r.top + r.height - p * r.height * 0.9 + "px";
          laser.style.height = p * r.height * 0.9 + "px";
        });
        fx.remove(laser);
        await fx.wait(300);
      }
    },

    // Dr. No
    {
      id: 646,
      run: async (fx) => {
        const bg = fx.wash("#fff", 0, { opacity: 0.94 });
        const y = H() * 0.45;
        const d = Math.min(W(), H()) * 0.14;
        const dots = [];
        for (let i = 0; i < 5; i++) {
          const el = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 3px #1f1b16, 0 0 0 2px #fff"></div>', -d, y, { size: d * 0.5 });
          dots.push(fx.move(el, [{ transform: "translateX(0)" }, { transform: "translateX(" + (W() * 0.15 + i * d * 0.9 + d) + "px)" }], { duration: 1400, delay: i * 90, easing: "ease-out" }).then(() => { if (i < 4) fx.remove(el); }));
        }
        fx.seq([["B3", 1], [null, 1], ["C4", 1], ["C#4", 1], ["C4", 1]], { beat: 0.25, type: "sawtooth", vol: 0.06, filter: { freq: 800 } });
        await Promise.all(dots);
        fx.remove(bg);
        const hole = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle " + d * 1.2 + "px at 50% 45%, transparent 90%, #0b0907 92%)" } });
        const barrel = fx.node("", { cls: "fx-filter", style: { background: "repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,.05) 0 10deg, transparent 10deg 30deg)", mixBlendMode: "screen" } });
        await fx.move([hole, barrel], [{ transform: "rotate(0)" }, { transform: "rotate(60deg)" }], { duration: 1200 });
        if (fx.reduced) await fx.wait(1200);
        fx.remove(barrel);
        await fx.fadeOut(hole, 400);
      }
    },

    // Die Hard
    {
      id: 562,
      run: async (fx) => {
        const m = fx.rect(".machine-marquee");
        const n = Math.max(8, Math.round(m.width / 20));
        const colors = ["#ff3a3a", "#3aff6a", "#3a8aff", "#ffd23a"];
        let bulbs = "";
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * (100 / n);
          bulbs += '<ellipse class="bl" cx="' + x + '" cy="' + (8 + Math.sin(i) * 2) + '" rx="2.2" ry="3.2" fill="' + colors[i % 4] + '" style="filter:drop-shadow(0 0 2px ' + colors[i % 4] + ')"/>';
        }
        const lights = fx.node('<svg viewBox="0 0 100 16" preserveAspectRatio="none" style="width:100%;height:100%"><path d="M0 5 Q' + 50 + ' 11 100 5" stroke="#1f5a1f" stroke-width="1" fill="none"/>' + bulbs + "</svg>", { style: { position: "absolute", left: m.left + "px", top: m.top - 8 + "px", width: m.width + "px", height: "20px" } });
        fx.seq([["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1], ["G5", 2]], { beat: 0.18, type: "triangle", vol: 0.06 });
        fx.move(lights.querySelectorAll(".bl"), [{ opacity: 1 }, { opacity: 0.3 }], { duration: 400, iterations: 6, direction: "alternate" });
        await fx.wait(1600);
        const crack = fx.glass(A.S("0 0 100 100", '<g stroke="#fff" stroke-width=".6" fill="none"><path d="M70 30 L40 0 M70 30 L100 10 M70 30 L100 70 M70 30 L50 100 M70 30 L0 50 M60 20 L82 24 L84 44 L62 44 Z M52 12 L92 16 L94 56 L56 60 Z"/></g>'));
        if (crack) { crack.firstChild.setAttribute("preserveAspectRatio", "none"); crack.firstChild.style.cssText = "width:100%;height:100%"; }
        fx.noise(0.5, { type: "highpass", freq: 3000, vol: 0.6 });
        fx.shake("md", 300);
        await fx.wait(2000);
      }
    },

    // Speed (1994)
    {
      id: 1637,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        fx.text(el, "50 MPH", 0);
        fx.tone(70, 3.6, { type: "sawtooth", vol: 0.1, filter: { freq: 260 }, vibrato: [9, 4] });
        fx.shake("sm", 3600);
        await fx.tween(3600, (p) => {
          const v = Math.round(50 + Math.sin(p * 14) * 3 + (p > 0.4 && p < 0.55 ? -2 : 1));
          el.textContent = Math.max(50, v) + " MPH";
        });
      }
    },

    // Top Gun
    {
      id: 744,
      run: async (fx) => {
        fx.noise(1.6, { type: "bandpass", freq: 700, sweep: 250, q: 0.7, vol: 0.6, attack: 0.5, pan: 1, panTo: -1 });
        fx.later(900, () => { fx.shake("md", 500); fx.buzz(200); });
        await fx.fly(A.jet, [W() + 120, H() * 0.18], [-160, H() * 0.36], { size: 130, h: 46, dur: 1500, flip: true, easing: "ease-in" });
        fx.wash("linear-gradient(transparent 40%, rgba(255,140,60,.3))", 1200, { fade: 300 });
        await fx.wait(1200);
      }
    },

    // Top Gun: Maverick
    {
      id: 361743,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        fx.text(el, "MACH 9.0", 0);
        fx.tone(200, 2.4, { type: "sawtooth", slide: 700, vol: 0.1, filter: { freq: 1200 } });
        await fx.tween(2400, (p) => { el.textContent = "MACH " + (9 + p).toFixed(1); }, (p) => 1 - Math.pow(1 - p, 3));
        await fx.wait(500);
        A.ring(fx, W() / 2, H() * 0.35, { size: Math.max(W(), H()), color: "rgba(255,255,255,.9)", width: 16, dur: 700 });
        fx.thud({ freq: 45, vol: 1, dur: 0.8 });
        fx.shake("lg", 500);
        fx.buzz(250);
        await fx.wait(1200);
      }
    },

    // Mad Max: Fury Road
    {
      id: 76341,
      run: async (fx) => {
        fx.wash("linear-gradient(#ffb04a, #e8661e)", 3800, { blend: "multiply", fade: 500 });
        fx.particles({ kind: "sweep", count: 50, glyphs: dot("rgba(200,120,60,.6)"), min: 6, max: 26, dur: 1200, stagger: 3000 });
        ["E2", "B2", "E3"].forEach((n) => fx.tone(n, 2.2, { type: "sawtooth", vol: 0.18, filter: { freq: 1400 }, detune: 12, at: 0.5 }));
        ["E2", "B2", "E3"].forEach((n) => fx.tone(n, 2.2, { type: "square", vol: 0.08, filter: { freq: 900 }, detune: -12, at: 0.5 }));
        const r = fx.rect("#drawBtn");
        fx.later(500, () => fx.particles({ kind: "rise", from: pt(r.x, r.top, r.width * 0.5, 0), count: 20, glyphs: dot("#ffb020"), min: 8, max: 18, dur: 900, stagger: 600, cls: "fx-blur" }));
        const s = fx.slot();
        await fx.wait(2200);
        if (s) {
          fx.style(s, { filter: "grayscale(1) contrast(1.8) brightness(1.4)" }, 900);
          A.sparkleOn(fx, s, 10, "#fff");
          fx.tone(4000, 0.4, { vol: 0.06 });
        }
        await fx.wait(1500);
      }
    },

    // Dune (2021)
    {
      id: 438631,
      run: async (fx) => {
        fx.wash("rgba(220,150,70,.3)", 5200, { blend: "multiply", fade: 500 });
        for (let i = 0; i < 6; i++) {
          fx.thud({ freq: 60, vol: 0.5, dur: 0.25, at: i * 0.45 });
          fx.later(i * 450, () => fx.shake("sm", 120));
        }
        await fx.wait(2800);
        const hump = fx.put('<div style="width:100%;height:100%;border-radius:50% 50% 0 0;background:radial-gradient(ellipse at 50% 100%, #c8914a, #a86a2a);box-shadow:0 -4px 10px rgba(120,70,20,.5)"></div>', -140, H() - 16, { size: 220, h: 50 });
        fx.noise(2.4, { freq: 120, vol: 0.5, attack: 0.3 });
        fx.buzz([300, 100, 300]);
        fx.shake("md", 2000);
        await fx.move(hump, [{ transform: "translateX(0)" }, { transform: "translateX(" + (W() + 280) + "px)" }], { duration: 2200, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(2000);
      }
    },

    // Dune (1984)
    {
      id: 841,
      run: async (fx) => {
        const eyes = '<g style="filter:drop-shadow(0 0 3px #3aa8ff)">';
        fx.costume(".reely", eyes + '<ellipse cx="52.5" cy="55" rx="5" ry="8" fill="#1a5cff"/><ellipse cx="67.5" cy="55" rx="5" ry="8" fill="#1a5cff"/><circle cx="52.5" cy="55" r="2" fill="#bfe8ff"/><circle cx="67.5" cy="55" r="2" fill="#bfe8ff"/></g>', 5000);
        fx.costume(".kernel", eyes + '<ellipse cx="58" cy="88" rx="3.6" ry="6" fill="#1a5cff"/><ellipse cx="72" cy="88" rx="3.6" ry="6" fill="#1a5cff"/></g>', 5000);
        fx.tone("A2", 3, { type: "sawtooth", vol: 0.05, attack: 1, filter: { freq: 500 } });
        await fx.wait(5000);
      }
    },

    // Contact
    {
      id: 686,
      run: async (fx) => {
        const primes = [2, 3, 5, 7, 11];
        let t = 0.2;
        const blips = [];
        primes.forEach((p) => {
          for (let i = 0; i < p; i++) { fx.tone(1000, 0.05, { type: "sine", vol: 0.2, at: t }); blips.push(t); t += 0.1; }
          t += 0.45;
        });
        fx.noise(t + 0.3, { freq: 2500, vol: 0.06 });
        const light = fx.node("", { style: { position: "absolute", right: "16px", top: "calc(16px + env(safe-area-inset-top))", width: "10px", height: "10px", borderRadius: "50%", background: "#6dff8a", boxShadow: "0 0 10px 4px #2bff5a", opacity: 0 } });
        blips.forEach((b) => fx.later(b * 1000, () => fx.anim(light, [{ opacity: 1 }, { opacity: 0 }], { duration: 90 })));
        await fx.wait((t + 0.4) * 1000);
      }
    },

    // Arrival
    {
      id: 329865,
      run: async (fx) => {
        const fog = fx.wash("rgba(230,230,225,.8)", 0, { opacity: 0 });
        fx.anim(fog, [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
        let tendrils = "";
        for (let i = 0; i < 9; i++) {
          const a = i * 40 + Math.random() * 15, rad = Math.PI * a / 180;
          const x = 50 + Math.cos(rad) * 36, y = 50 + Math.sin(rad) * 36;
          tendrils += '<path d="M' + x + " " + y + " l" + Math.cos(rad) * (4 + Math.random() * 8) + " " + Math.sin(rad) * (4 + Math.random() * 8) + '" stroke="#111" stroke-width="' + (1 + Math.random() * 2) + '" stroke-linecap="round"/>';
        }
        const size = Math.min(W(), H()) * 0.6;
        const logo = fx.put(A.S("0 0 100 100", '<circle class="c" cx="50" cy="50" r="36" pathLength="1" fill="none" stroke="#111" stroke-width="5" stroke-dasharray="1" style="filter:url(#boilA)"/>' + tendrils), W() / 2, H() * 0.45, { size });
        const c = logo.querySelector(".c");
        c.style.strokeDashoffset = fx.reduced ? "0" : "1";
        fx.tone(55, 3, { type: "sawtooth", vol: 0.12, attack: 0.8, vibrato: [1.5, 3], filter: { freq: 220 } });
        fx.tone(82, 3, { type: "sawtooth", vol: 0.06, attack: 1.2, filter: { freq: 220 } });
        await fx.move(c, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1800, easing: "ease-out" });
        await fx.wait(1200);
        fx.fadeOut(logo, 800);
        await fx.fadeOut(fog, 900);
      }
    },

    // Ex Machina
    {
      id: 264660,
      run: async (fx) => {
        fx.noise(0.15, { freq: 400, vol: 0.5 });
        const red = fx.wash("rgba(200,0,0,.55)", 0, { blend: "multiply" });
        const dark = fx.wash("rgba(0,0,0,.4)", 0);
        for (let i = 0; i < 3; i++) fx.tone(740, 0.35, { type: "square", vol: 0.06, at: 0.4 + i * 0.8, filter: { freq: 1500 } });
        await fx.anim(red, [{ opacity: 1 }, { opacity: 0.6 }, { opacity: 1 }], { duration: 1600, iterations: 2 });
        fx.noise(0.12, { freq: 400, vol: 0.4 });
        fx.remove(red);
        await fx.fadeOut(dark, 200);
      }
    },

    // Annihilation
    {
      id: 300668,
      run: async (fx) => {
        const sheen = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(115deg, rgba(255,0,150,.25), rgba(0,200,255,.25), rgba(120,255,120,.25), rgba(255,220,0,.25), rgba(255,0,150,.25))", backgroundSize: "300% 300%", mixBlendMode: "screen", opacity: 0 } });
        fx.fadeIn(sheen, 800);
        fx.move(sheen, [{ backgroundPosition: "0% 50%" }, { backgroundPosition: "100% 50%" }], { duration: 3600, easing: "linear" });
        fx.style(".machine", { filter: "drop-shadow(8px 0 0 rgba(255,0,200,.25)) drop-shadow(-8px 4px 0 rgba(0,220,255,.25))" }, 3600);
        ["C5", "F#5", "B5"].forEach((n, i) => fx.tone(n, 3, { vol: 0.05, attack: 1, vibrato: [3 + i, 12] }));
        await fx.wait(3600);
        await fx.fadeOut(sheen, 600);
      }
    },

    // Signs
    {
      id: 2675,
      run: async (fx) => {
        const g = fx.glass(A.S("0 0 100 100", '<g fill="none" stroke="rgba(230,215,160,.85)" stroke-width="2.2"><circle class="k" cx="50" cy="50" r="22" pathLength="1"/><circle class="k" cx="50" cy="50" r="10" pathLength="1"/><circle class="k" cx="50" cy="16" r="7" pathLength="1"/><circle class="k" cx="80" cy="66" r="7" pathLength="1"/><circle class="k" cx="20" cy="66" r="7" pathLength="1"/><path class="k" d="M50 28 V23 M69 61 L74 63 M31 61 L26 63" pathLength="1"/></g>'));
        if (!g) return;
        g.firstChild.style.cssText = "width:100%;height:100%";
        const ks = g.querySelectorAll(".k");
        ks.forEach((k) => { k.style.strokeDasharray = "1"; k.style.strokeDashoffset = fx.reduced ? "0" : "1"; });
        fx.tone(60, 3, { vol: 0.15, attack: 0.8 });
        for (let i = 0; i < ks.length; i++) {
          fx.move(ks[i], [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 700 });
          fx.noise(0.4, { type: "bandpass", freq: 900, q: 2, vol: 0.08 });
          await fx.wait(300);
        }
        await fx.wait(1800);
        await fx.fadeOut(g, 500);
      }
    },

    // Zodiac
    {
      id: 1949,
      run: async (fx) => {
        const g = fx.glass("", { style: { background: "rgba(245,240,225,.94)", padding: "10px", font: "20px/1.25 'Special Elite', monospace", color: "#1a1a1a", letterSpacing: "4px", wordBreak: "break-all" } });
        if (!g) return;
        const glyphs = "△⊕ΛΦΘ♀□∩ЖΞ∆Ø≡⌑Ψ℧KEPJ/9Z●◐†";
        for (let i = 0; i < 40; i++) {
          g.textContent += glyphs[Math.floor(Math.random() * glyphs.length)];
          fx.click({ freq: 1400 + Math.random() * 600, vol: 0.25 });
          await fx.wait(60);
        }
        await fx.wait(1600);
        await fx.fadeOut(g, 400);
      }
    },

    // Minority Report
    {
      id: 180,
      run: async (fx) => {
        const y = H() * 0.62;
        const tube = fx.node("", { style: { position: "absolute", left: 0, right: 0, top: y - 16 + "px", height: "32px", background: "linear-gradient(rgba(255,255,255,.35), rgba(200,230,255,.15) 50%, rgba(255,255,255,.35))", borderTop: "1px solid rgba(255,255,255,.7)", borderBottom: "1px solid rgba(255,255,255,.7)" } });
        fx.fadeIn(tube, 300);
        fx.noise(1.8, { type: "bandpass", freq: 350, q: 2, vol: 0.3, pan: -1, panTo: 1 });
        await fx.fly('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 30%, #ff8a7a, #b8160e 60%, #6a0a06)"></div>', [-30, y], [W() + 30, y], { size: 26, dur: 1800, r2: 1440 });
        fx.click({ freq: 700, vol: 0.5 });
        await fx.fadeOut(tube, 300);
      }
    },

    // War of the Worlds (2005)
    {
      id: 74,
      run: async (fx) => {
        fx.sfx("drone", { dur: 2.6, fadeIn: 200, rate: 1.3, vol: 1 });
        fx.tone(58, 2.6, { type: "sawtooth", vol: 0.35, attack: 0.2, slide: 52, filter: { freq: 700 } });
        fx.tone(87, 2.6, { type: "sawtooth", vol: 0.2, attack: 0.3, filter: { freq: 700 } });
        fx.shake("lg", 2400);
        fx.buzz([600, 100, 600]);
        const weed = fx.node("", { cls: "fx-filter", style: { boxShadow: "inset 0 0 60px 20px rgba(150,10,10,.8)", opacity: 0 } });
        await fx.anim(weed, [{ opacity: 0 }, { opacity: 1 }], { duration: 2600 });
        await fx.wait(900);
        await fx.fadeOut(weed, 700);
      }
    },

    // Mars Attacks!
    {
      id: 75,
      run: async (fx) => {
        for (let i = 0; i < 3; i++) {
          fx.later(i * 500, () => fx.fly(A.saucer, [i % 2 ? W() + 60 : -60, H() * (0.15 + i * 0.12)], [i % 2 ? -60 : W() + 60, H() * (0.2 + i * 0.1)], { size: 70, h: 35, dur: 2400, via: [W() / 2, H() * (0.05 + i * 0.15)], r0: -8, r1: 8, r2: -8 }));
        }
        for (let i = 0; i < 9; i++) {
          const t = 0.3 + Math.floor(i / 3) * 0.8 + (i % 3) * 0.13;
          fx.tone(1300, 0.08, { type: "square", vol: 0.08, slide: 900, at: t, filter: { type: "bandpass", freq: 1500, q: 3 } });
          fx.noise(0.06, { type: "bandpass", freq: 2500, q: 4, vol: 0.15, at: t });
        }
        await fx.wait(3400);
      }
    },

    // Starship Troopers
    {
      id: 563,
      run: async (fx) => {
        const panel = fx.node('<div style="font:700 11px \'Special Elite\',monospace;letter-spacing:.2em;color:#fbf4e2;background:#1d3a78;padding:6px 10px;border-bottom:3px solid #d9a13a">FEDNET · BULLETIN</div>' +
          '<div style="padding:14px 14px 16px;text-align:center;background:#f1e3c2;color:#1f1b16;font:600 15px Bitter, Georgia, serif">Service guarantees citizenship.<br><button class="fx-know" style="margin-top:12px;font:700 13px Bitter, Georgia, serif;padding:10px 14px;border:3px solid #1f1b16;background:#3a6ad0;color:#fff;box-shadow:3px 3px 0 #1f1b16;border-radius:6px;cursor:pointer">Would you like to know more?</button></div>',
        { cls: "fx-tap", style: { position: "absolute", left: "50%", top: "30%", transform: "translateX(-50%)", width: "min(86vw, 300px)", border: "4px solid #1f1b16", boxShadow: "5px 6px 0 #1f1b16", borderRadius: "6px", overflow: "hidden" } });
        fx.seq([["C5", 1], ["G5", 1], ["C6", 2]], { beat: 0.12, type: "square", vol: 0.05 });
        let clicked = false;
        panel.querySelector(".fx-know").addEventListener("click", (e) => {
          e.stopPropagation();
          clicked = true;
          fx.flash("#fff", 150);
          fx.sfx("confirm", { vol: 0.7 });
          fx.seq([["C6", 1], ["E6", 1], ["G6", 2]], { beat: 0.08, type: "square", vol: 0.05 });
          panel.lastChild.innerHTML = '<div style="font:700 15px Bitter, Georgia, serif">Enjoy the feature, citizen.</div>';
        });
        for (let i = 0; i < 40 && !clicked; i++) await fx.wait(100);
        await fx.wait(clicked ? 1200 : 0);
        await fx.fadeOut(panel, 300);
      }
    },

    // Tenet
    {
      id: 577922,
      run: async (fx) => {
        const el = fx.$(".machine-marquee .marquee-text");
        const sub = fx.$(".machine-marquee .marquee-sub");
        if (el) fx.text(el, el.textContent.split("").reverse().join(""), 3600);
        if (sub) fx.text(sub, sub.textContent.split("").reverse().join(""), 3600);
        fx.tone(100, 1.5, { type: "sawtooth", slide: 900, vol: 0.12, attack: 1.4, filter: { freq: 1800 } });
        fx.filter("invert(1) hue-rotate(180deg)", 250);
        await fx.wait(1600);
        fx.filter("invert(1) hue-rotate(180deg)", 250);
        fx.thud({ vol: 0.5 });
        const s = fx.slot();
        if (s) await fx.move(s, [{ transform: "translateY(0)" }, { transform: "translateY(-40px) rotate(-6deg)", offset: 0.5 }, { transform: "translateY(0)" }], { duration: 900, direction: "reverse" });
        await fx.wait(1100);
      }
    },

    // Oppenheimer
    {
      id: 872585,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const dark = fx.wash("rgba(0,0,0,.55)", 0);
        fx.fadeIn(dark, 400);
        await fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 30, spread: 70, dur: 1600, stagger: 900, glyphs: dot("#ffb040"), min: 3, max: 7, spin: 360 });
        const white = fx.wash("#fff8e8", 0, { opacity: 0 });
        await fx.anim(white, [{ opacity: 0 }, { opacity: fx.reduced ? 0.6 : 1 }], { duration: 900, easing: "ease-in" });
        fx.remove(dark);
        // Silence... then the sound arrives.
        await fx.wait(2400);
        fx.sfx("boom", { vol: 1 });
        fx.sfx("thunder", { vol: 0.7, at: 60 });
        fx.noise(2.4, { freq: 250, sweep: 50, vol: 0.6 });
        fx.shake("lg", 1200);
        fx.buzz([400, 100, 200]);
        await fx.fadeOut(white, 1400);
      }
    },

    // Memento
    {
      id: 77,
      run: async (fx) => {
        const s = A.liftSlot(fx, 5000);
        if (!s) return;
        fx.style(s, { background: "#fff", padding: "6px 6px 20px" }, 5000);
        const img = s.querySelector("img, .title-fallback");
        fx.move(s, [{ transform: "rotate(0)" }, { transform: "rotate(-5deg)" }, { transform: "rotate(5deg)" }, { transform: "rotate(0)" }], { duration: 300, iterations: 3 });
        for (let i = 0; i < 5; i++) fx.noise(0.1, { freq: 900, vol: 0.15, at: i * 0.18 });
        if (img) {
          await fx.anim(img, [{ opacity: 1, filter: "none" }, { opacity: 0.05, filter: "sepia(1) brightness(1.6)" }], { duration: 1800, easing: "ease-in" });
          fx.click({ freq: 3000, vol: 0.5 });
          fx.flash("#fff", 150);
          await fx.wait(600);
          await fx.anim(img, [{ opacity: 0.05, filter: "grayscale(1)" }, { opacity: 1, filter: "grayscale(1)", offset: 0.7 }, { opacity: 1, filter: "none" }], { duration: 1600 });
        }
      }
    },

    // The Prestige
    {
      id: 1124,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const others = fx.otherSlots(false);
        const dest = others.length ? fx.rect(fx.pick(others)) : r;
        const bolt = (a, b) => {
          const el = fx.node('<svg style="position:absolute;inset:0;width:100%;height:100%"><path d="M' + a.x + " " + a.y + " L" + (a.x + b.x) / 2 + " " + ((a.y + b.y) / 2 - 30) + " L" + (a.x + b.x) / 2 + " " + ((a.y + b.y) / 2 + 20) + " L" + b.x + " " + b.y + '" stroke="#cfe8ff" stroke-width="3" fill="none" style="filter:drop-shadow(0 0 6px #7fc4ff)"/></svg>', { ms: 140 });
          return el;
        };
        for (let i = 0; i < 4; i++) {
          bolt(r, dest);
          fx.noise(0.12, { type: "highpass", freq: 2500, vol: 0.4 });
          await fx.wait(220);
        }
        fx.particles({ kind: "burst", from: r, count: 14, spread: 30, dur: 800, stagger: 0, glyphs: dot("rgba(230,230,230,.8)"), min: 10, max: 22, cls: "fx-blur" });
        fx.style(s, { visibility: "hidden" }, 1800);
        const copy = s.cloneNode(true);
        copy.style.cssText = "width:100%;height:100%;margin:0;box-shadow:3px 3px 0 #1f1b16";
        const holder = fx.put("", dest.x, dest.y, { size: r.width, h: r.height });
        holder.appendChild(copy);
        fx.tone(880, 0.4, { vol: 0.08, slide: 1760 });
        await fx.wait(1800);
        fx.remove(holder);
        await fx.wait(200);
      }
    },

    // Oldboy (2003)
    {
      id: 670,
      run: async (fx) => {
        const s = fx.slot();
        if (!s) return;
        const r = fx.rect(s);
        const svg = fx.put('<svg viewBox="0 0 100 60" style="width:100%;height:100%"></svg>', r.x, r.y, { size: r.width * 0.9, h: r.width * 0.54 });
        const box = svg.firstChild;
        for (let i = 0; i < 15; i++) {
          const group = Math.floor(i / 5), k = i % 5;
          const x0 = 8 + group * 32;
          const d = k < 4 ? "M" + (x0 + k * 6) + " 12 L" + (x0 + k * 6 + 1) + " 48" : "M" + (x0 - 3) + " 40 L" + (x0 + 23) + " 18";
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", d);
          p.setAttribute("stroke", "#fbf4e2");
          p.setAttribute("stroke-width", "3");
          p.setAttribute("stroke-linecap", "round");
          p.style.filter = "drop-shadow(1px 1px 0 #1f1b16)";
          box.appendChild(p);
          fx.noise(0.08, { type: "bandpass", freq: 3000, q: 3, vol: 0.3 });
          await fx.wait(160);
        }
        await fx.wait(1500);
        await fx.fadeOut(svg, 400);
      }
    },

    // Parasite
    {
      id: 496243,
      run: async (fx) => {
        const water = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "45vh", background: "linear-gradient(rgba(90,110,80,.55), rgba(50,60,40,.75))", borderTop: "2px solid rgba(200,220,200,.6)", transformOrigin: "50% 100%" } });
        fx.noise(4, { freq: 500, vol: 0.3, attack: 0.8 });
        for (let i = 0; i < 10; i++) fx.tone(300 + Math.random() * 300, 0.1, { vol: 0.06, slide: 900, at: 0.5 + i * 0.3 });
        if (fx.reduced) { await fx.wait(3200); return; }
        await fx.anim(water, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 2400, easing: "ease-out" });
        await fx.wait(700);
        await fx.anim(water, [{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: 900, easing: "ease-in" });
      }
    },

    // Kill Bill: Vol. 1
    {
      id: 24,
      run: async (fx) => {
        fx.flash("#d8101a", 400);
        for (let i = 0; i < 3; i++) fx.tone(700, 0.5, { type: "sawtooth", slide: 1400, vol: 0.12, at: i * 0.5, filter: { freq: 2500 } });
        fx.wash("rgba(255,210,0,.3)", 2200, { blend: "multiply" });
        await fx.wait(1500);
        const slash = fx.node("", { style: { position: "absolute", left: "-20%", width: "140%", top: "50%", height: "3px", background: "#fff", boxShadow: "0 0 12px 4px #fff", transform: "rotate(-24deg)", transformOrigin: "50% 50%" } });
        fx.noise(0.25, { type: "highpass", freq: 5000, vol: 0.6 });
        fx.tone(5000, 0.5, { vol: 0.08, slide: 3000 });
        await fx.anim(slash, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 160 });
        fx.page([{ transform: "translate(0,0)" }, { transform: "translate(6px,-3px)" }, { transform: "translate(0,0)" }], { duration: 260, fill: "none" });
        await fx.wait(700);
        await fx.fadeOut(slash, 300);
      }
    },

    // Kill Bill: Vol. 2
    {
      id: 393,
      run: async (fx) => {
        const dark = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle 16vmin at 50% 55%, rgba(255,230,160,.12), rgba(0,0,0,.96) 100%)" } });
        fx.noise(3, { freq: 160, vol: 0.2, attack: 0.5 });
        for (let i = 0; i < 4; i++) {
          await fx.wait(i === 0 ? 700 : 520 - i * 60);
          fx.thud({ freq: 90, vol: 0.6 + i * 0.1, dur: 0.2 });
          fx.shake(i === 3 ? "lg" : "sm", 200);
          fx.buzz(60);
        }
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.4), count: 16, spread: 40, gravity: 80, dur: 900, stagger: 0, glyphs: '<div style="width:100%;height:30%;background:#8a6a3a"></div>', min: 8, max: 20, spin: 360 });
        await fx.fadeOut(dark, 700);
      }
    },

    // Inglourious Basterds
    {
      id: 16869,
      run: async (fx) => {
        const burn = fx.node("", { cls: "fx-filter" });
        fx.noise(1.8, { freq: 1200, vol: 0.3, attack: 0.4 });
        fx.tone(24, 1.8, { type: "square", vol: 0.05 });
        await fx.tween(fx.reduced ? 100 : 1600, (p) => {
          const r = p * 90;
          burn.style.background = "radial-gradient(circle at 60% 40%, rgba(255,255,255,.95) " + r * 0.6 + "vmax, #ffb020 " + r * 0.75 + "vmax, #6a1a00 " + r * 0.9 + "vmax, transparent " + r + "vmax)";
        });
        await fx.wait(400);
        await fx.fadeOut(burn, 600);
      }
    },

    // The Big Lebowski
    {
      id: 115,
      run: async (fx) => {
        const y = H() - 40;
        const pins = [];
        for (let i = 0; i < 4; i++) pins.push(fx.put(A.pin, W() - 40 - (i % 2) * 14, y - 20 - Math.floor(i / 2) * 3, { size: 14, h: 36 }));
        fx.noise(1.6, { freq: 200, vol: 0.4, attack: 0.3, pan: -1, panTo: 1 });
        await fx.fly(A.bowlingBall, [-40, y], [W() - 50, y - 10], { size: 34, dur: 1600, r2: 900, easing: "ease-in" });
        for (let i = 0; i < 8; i++) fx.noise(0.08, { type: "bandpass", freq: 1500 + Math.random() * 1500, q: 3, vol: 0.5, at: i * 0.04 });
        pins.forEach((p, i) => fx.move(p, [{ transform: "none" }, { transform: "translate(" + (20 + i * 15) + "px," + (-80 - i * 30) + "px) rotate(" + (200 + i * 90) + "deg)" }], { duration: 700, easing: "ease-out" }));
        await fx.wait(1200);
      }
    },

    // Fargo
    {
      id: 275,
      run: async (fx) => {
        const white = fx.wash("#f4f6f8", 0, { opacity: 0 });
        fx.noise(3.6, { type: "bandpass", freq: 700, q: 0.6, vol: 0.35, attack: 1 });
        fx.particles({ kind: "sweep", count: 80, glyphs: dot(), min: 3, max: 7, dur: 900, stagger: 3000 });
        await fx.anim(white, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 1800 });
        await fx.wait(700);
        await fx.fadeOut(white, 1200);
      }
    },

    // No Country for Old Men
    {
      id: 6977,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const coin = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 30%, #fff4c0, #c9a040 55%, #8a6a1a);border:2px solid #5a4a1a"></div>', r.x, r.y, { size: 34 });
        fx.tone(4000, 0.2, { vol: 0.1 });
        await fx.move(coin, [{ transform: "translateY(0) rotateX(0)" }, { transform: "translateY(-" + H() * 0.25 + "px) rotateX(1440deg)", offset: 0.5 }, { transform: "translateY(0) rotateX(2880deg)" }], { duration: 1400, easing: "ease-in-out" });
        fx.click({ freq: 3500, vol: 0.6 });
        fx.move(coin, [{ transform: "rotateX(0)" }, { transform: "rotateX(80deg)" }, { transform: "rotateX(0)" }], { duration: 400 });
        await fx.wait(2200);
        await fx.fadeOut(coin, 300);
      }
    },

    // Ocean's Eleven (2001)
    {
      id: 161,
      run: async (fx) => {
        const jets = [];
        for (let i = 0; i < 9; i++) {
          const x = W() * (0.1 + i * 0.1);
          const jet = fx.put('<div style="width:100%;height:100%;background:linear-gradient(rgba(255,255,255,0), rgba(220,240,255,.9));border-radius:50% 50% 0 0;filter:blur(1px)"></div>', x, H(), { size: 10, h: H() * 0.5, style: { transformOrigin: "50% 100%" } });
          jets.push(fx.anim(jet, [{ transform: "translateY(-50%) scaleY(0)" }, { transform: "translateY(-50%) scaleY(1)", offset: 0.5 }, { transform: "translateY(-50%) scaleY(.2)" }], { duration: 2200, delay: Math.abs(4 - i) * 90 }));
        }
        fx.noise(2.4, { freq: 2500, vol: 0.2, attack: 0.5 });
        fx.chord(["C4", "E4", "G4", "B4"], 2.4, { vol: 0.05, attack: 0.6 });
        await Promise.all(jets);
        // The pinch.
        fx.tone(60, 0.6, { vol: 0.4, slide: 30 });
        const out = fx.wash("#000", 0, { opacity: 0 });
        await fx.anim(out, [{ opacity: 0 }, { opacity: 0.9 }], { duration: 250, easing: "steps(3)" });
        await fx.wait(900);
        await fx.anim(out, [{ opacity: 0.9 }, { opacity: 0 }], { duration: 300, easing: "steps(3)" });
      }
    },

    // Baby Driver
    {
      id: 339403,
      run: async (fx) => {
        fx.tone(6200, 1.2, { vol: 0.04, attack: 0.2 });
        await fx.wait(1300);
        const slots = fx.$$("#grid .slot");
        for (let b = 0; b < 8; b++) {
          fx.thud({ freq: 70, vol: 0.5, dur: 0.15 });
          if (b % 2) fx.noise(0.08, { type: "bandpass", freq: 2000, vol: 0.4 });
          slots.forEach((s, i) => {
            if ((i + b) % 2 !== 0) return;
            if (fx.reduced) fx.style(s, { boxShadow: "0 0 10px 3px #ff4a3a" }, 200);
            else fx.move(s, [{ transform: "translateY(0)" }, { transform: "translateY(-5px)" }, { transform: "translateY(0)" }], { duration: 220, fill: "none" });
          });
          await fx.wait(300);
        }
      }
    },

    // The Fast and the Furious (2001)
    {
      id: 9799,
      run: async (fx) => {
        fx.noise(0.4, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.tone(150, 1.4, { type: "sawtooth", slide: 900, vol: 0.14, filter: { freq: 2000 } });
        fx.particles({ kind: "sweep", count: 30, glyphs: '<div style="width:100%;height:2px;background:rgba(160,220,255,.9)"></div>', min: 40, max: 90, dur: 400, stagger: 1100, dir: "rtl" });
        await fx.page([{ transform: "translateY(0)" }, { transform: "translateY(10px) scale(.98)", offset: 0.25 }, { transform: "translateY(-6px) scale(1.01)", offset: 0.6 }, { transform: "none" }], { duration: 1400, easing: "ease-out", fill: "none" });
        fx.wash("rgba(80,160,255,.2)", 500);
        await fx.wait(500);
      }
    },

    // Christine (1983)
    {
      id: 8769,
      run: async (fx) => {
        const dark = fx.node('<div style="position:absolute;left:28%;top:62%;width:18vmin;height:10vmin;border-radius:50%;background:radial-gradient(ellipse, #fffbe0, rgba(255,250,200,.4) 50%, transparent 70%)"></div><div style="position:absolute;right:28%;top:62%;width:18vmin;height:10vmin;border-radius:50%;background:radial-gradient(ellipse, #fffbe0, rgba(255,250,200,.4) 50%, transparent 70%)"></div>', { cls: "fx-filter", style: { background: "rgba(5,5,8,.9)", opacity: 0 } });
        await fx.anim(dark, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
        fx.noise(2.2, { type: "bandpass", freq: 1800, q: 1, vol: 0.2 });
        fx.seq([["C5", 1], ["C5", 1], ["A4", 1], ["C5", 1], ["D5", 2], ["C5", 2]], { beat: 0.18, type: "square", vol: 0.04, filter: { type: "bandpass", freq: 1200, q: 2 }, at: 0.3 });
        fx.tone(90, 1.8, { type: "sawtooth", vol: 0.12, vibrato: [18, 6], filter: { freq: 400 }, at: 1.2 });
        await fx.wait(2600);
        await fx.fadeOut(dark, 500);
      }
    },

    // The Avengers (2012)
    {
      id: 24428,
      run: async (fx) => {
        fx.chord(["C4", "G4", "C5", "E5"], 2.6, { type: "sawtooth", vol: 0.05, attack: 0.5, filter: { freq: 1600 } });
        fx.noise(2.4, { freq: 600, sweep: 2000, vol: 0.12, attack: 1 });
        if (fx.reduced) fx.wash("linear-gradient(120deg, rgba(40,90,200,.3), rgba(200,40,40,.3))", 2400, { fade: 400 });
        await fx.move(".machine", [{ transform: "perspective(900px) rotateY(0)" }, { transform: "perspective(900px) rotateY(360deg)" }], { duration: 2400, easing: "ease-in-out" });
        if (fx.reduced) await fx.wait(2400);
      }
    },

    // Avengers: Infinity War
    {
      id: 299536,
      run: async (fx) => {
        fx.noise(0.05, { type: "bandpass", freq: 2200, q: 3, vol: 0.9 });
        fx.buzz(30);
        await fx.wait(900);
        const filled = fx.$$("#grid .slot:not(.empty)");
        const doomed = filled.filter(() => Math.random() < 0.5);
        if (!doomed.length && filled.length) doomed.push(filled[0]);
        fx.noise(2, { type: "highpass", freq: 2500, vol: 0.12, attack: 0.5 });
        for (const s of doomed) {
          const r = fx.rect(s);
          fx.particles({ kind: "burst", from: pt(r.x, r.y, r.width, r.height), count: fx.reduced ? 4 : 14, spread: 20, gravity: -40, dur: 1600, stagger: 600, glyphs: dot("#6a4a2a"), min: 2, max: 5, easing: "ease-out" });
          fx.anim(s, [{ opacity: 1, filter: "none" }, { opacity: 0, filter: "sepia(1) blur(2px)" }], { duration: 1400, delay: Math.random() * 400 });
          await fx.wait(80);
        }
        await fx.wait(2800);
        fx.tone("A4", 1, { vol: 0.06, attack: 0.3 });
        await Promise.all(doomed.map((s) => fx.anim(s, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 })));
      }
    },

    // Avengers: Endgame
    {
      id: 299534,
      run: async (fx) => {
        const spots = [[0.15, 0.3], [0.85, 0.25], [0.2, 0.75], [0.8, 0.7], [0.5, 0.12]];
        fx.chord(["D4", "A4", "D5", "F#5"], 3, { type: "sawtooth", vol: 0.05, attack: 1, filter: { freq: 1400 } });
        for (const [x, y] of spots) {
          const p = fx.put('<div style="width:100%;height:100%;border-radius:50%;border:5px dotted #ffb020;box-shadow:0 0 16px 4px #ff8a1a, inset 0 0 16px 4px #ff8a1a"></div>', W() * x, H() * y, { size: 90 });
          fx.anim(p, [{ transform: "scale(0) rotate(0)" }, { transform: "scale(1) rotate(360deg)" }], { duration: 900, easing: "ease-out" });
          fx.move(p.firstChild, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 1500, iterations: 3 });
          fx.noise(0.6, { type: "bandpass", freq: 3000, q: 2, vol: 0.12 });
          await fx.wait(300);
        }
        await fx.wait(2200);
      }
    },

    // Iron Man
    {
      id: 1726,
      run: async (fx) => {
        fx.costume(".kernel", '<g style="filter:drop-shadow(0 0 6px #7fe8ff)"><circle cx="65" cy="120" r="8" fill="#e8fbff" stroke="#1f1b16" stroke-width="2"/><circle cx="65" cy="120" r="5" fill="none" stroke="#35c8ff" stroke-width="2"/></g>', 4200);
        fx.tone(200, 1.2, { type: "sawtooth", slide: 1600, vol: 0.08, filter: { freq: 2400 } });
        fx.tone(1600, 2.4, { vol: 0.04, at: 1.1, vibrato: [8, 10] });
        fx.cls(".kernel", "cheer", 1100);
        await fx.wait(4200);
      }
    },

    // Guardians of the Galaxy
    {
      id: 118340,
      run: async (fx) => {
        const r = fx.rect(".reely");
        const tape = fx.put(A.S("0 0 60 40", '<rect x="2" y="2" width="56" height="36" rx="4" fill="#f2c230" ' + A.ink + ' stroke-width="2"/><rect x="10" y="8" width="40" height="16" rx="3" fill="#fbf4e2" stroke="#1f1b16" stroke-width="1.5"/><circle cx="20" cy="16" r="4" fill="#1f1b16"/><circle cx="40" cy="16" r="4" fill="#1f1b16"/><path d="M14 30 H46" stroke="#1f1b16" stroke-width="2"/>'), r.x + r.width * 0.9, r.top + r.height * 0.3, { size: 36, h: 24 });
        fx.click({ freq: 1200, vol: 0.5 });
        const beat = 0.24;
        for (let i = 0; i < 12; i++) {
          if (i % 2 === 0) fx.thud({ freq: 90, vol: 0.4, dur: 0.12, at: i * beat });
          else fx.noise(0.06, { type: "bandpass", freq: 2500, vol: 0.3, at: i * beat });
          fx.tone(["E3", "E3", "G3", "A3"][i % 4], beat * 0.8, { type: "square", vol: 0.04, at: i * beat, filter: { freq: 700 } });
        }
        await fx.move([".reely", ".kernel"], [{ transform: "rotate(-8deg) translateY(0)" }, { transform: "rotate(8deg) translateY(-6px)" }], { duration: beat * 1000, iterations: 12, direction: "alternate" });
        if (fx.reduced) await fx.wait(2900);
        await fx.fadeOut(tape, 300);
      }
    },

    // Black Panther
    {
      id: 284054,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.style(fx.slot(), { boxShadow: "0 0 14px 4px #a45cff" }, 1500);
        for (let i = 0; i < 4; i++) fx.tone(300 + i * 100, 0.3, { type: "triangle", vol: 0.06, at: i * 0.3 });
        await fx.wait(1300);
        A.ring(fx, r.x, r.y, { size: Math.max(W(), H()) * 1.5, color: "#b77bff", width: 12, glow: 30, dur: 1100 });
        fx.thud({ freq: 55, vol: 0.9, dur: 0.6 });
        fx.shake("md", 500);
        fx.buzz(120);
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 20, spread: 90, dur: 900, stagger: 0, glyphs: dot("#d0a8ff"), min: 3, max: 7 });
        await fx.wait(1300);
      }
    },

    // Spider-Man (2002)
    {
      id: 557,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const corner = [W() - 10, 10];
        const web = fx.node('<svg style="position:absolute;inset:0;width:100%;height:100%"><path class="w" d="M' + corner[0] + " " + corner[1] + " Q" + (corner[0] + r.x) / 2 + " " + ((corner[1] + r.y) / 2 + 30) + " " + r.x + " " + r.y + '" stroke="#fff" stroke-width="2.5" fill="none" pathLength="1" style="filter:drop-shadow(0 0 1px #1f1b16)"/></svg>');
        const line = web.querySelector(".w");
        line.style.strokeDasharray = "1";
        line.style.strokeDashoffset = fx.reduced ? "0" : "1";
        fx.noise(0.25, { type: "bandpass", freq: 3000, sweep: 1200, q: 2, vol: 0.4 });
        await fx.move(line, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 250, easing: "ease-out" });
        const splat = fx.put(A.S("0 0 100 100", '<g stroke="#fff" stroke-width="1.6" fill="none" style="filter:drop-shadow(0 0 1px #1f1b16)">' +
          [0, 45, 90, 135].map((a) => '<path d="M50 50 L' + (50 + Math.cos(a * Math.PI / 180) * 48) + " " + (50 + Math.sin(a * Math.PI / 180) * 48) + " M50 50 L" + (50 - Math.cos(a * Math.PI / 180) * 48) + " " + (50 - Math.sin(a * Math.PI / 180) * 48) + '"/>').join("") +
          '<circle cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="42"/></g>'), r.x, r.y, { size: Math.min(r.width, r.height) * 1.2 });
        await fx.anim(splat, [{ transform: "scale(.2)" }, { transform: "scale(1)" }], { duration: 160 });
        await fx.wait(2200);
        fx.fadeOut(web, 300);
        await fx.fadeOut(splat, 300);
      }
    },

    // Deadpool
    {
      id: 293660,
      run: async (fx) => {
        const size = Math.min(W(), H()) * 0.32;
        const peel = fx.node('<div style="position:absolute;right:0;bottom:0;width:100%;height:100%;background:#b8141e;clip-path:polygon(100% 0, 100% 100%, 0 100%)"></div>' +
          '<div class="flap" style="position:absolute;right:0;bottom:0;width:100%;height:100%;background:linear-gradient(135deg, #fbf4e2 40%, #d8c8a0);clip-path:polygon(0 100%, 100% 0, 0 0);box-shadow:-4px -4px 10px rgba(0,0,0,.3);transform-origin:100% 0"></div>' +
          '<svg viewBox="0 0 30 30" style="position:absolute;right:18%;bottom:12%;width:42%;height:42%"><use href="#glove"/></svg>',
        { style: { position: "absolute", right: 0, bottom: 0, width: size + "px", height: size + "px", transformOrigin: "100% 100%" } });
        fx.noise(0.4, { type: "bandpass", freq: 2500, q: 0.7, vol: 0.4 });
        fx.move(peel, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 450, easing: "ease-out" });
        const glove = peel.lastChild;
        await fx.wait(700);
        fx.move(glove, [{ transform: "rotate(0)" }, { transform: "rotate(-20deg)" }, { transform: "rotate(10deg)" }, { transform: "rotate(-20deg)" }, { transform: "rotate(0)" }], { duration: 900 });
        fx.tone("C5", 0.15, { type: "square", vol: 0.05 });
        fx.tone("G5", 0.2, { type: "square", vol: 0.05, at: 0.15 });
        await fx.wait(1800);
        await fx.move(peel, [{ transform: "scale(1)" }, { transform: "scale(0)" }], { duration: 300, easing: "ease-in" });
      }
    },

    // Joker (2019)
    {
      id: 475557,
      run: async (fx) => {
        fx.costume(".reely", '<path d="M52.5 44 L50 36 L55 36 Z M67.5 44 L65 36 L70 36 Z M52.5 66 L50 72 L55 72 Z M67.5 66 L65 72 L70 72 Z" fill="#2a6ad0"/><path d="M42 66 Q60 88 78 66 Q60 78 42 66 Z" fill="#d8141e"/>', 4200);
        fx.wash("linear-gradient(rgba(60,160,120,.25), rgba(220,180,40,.25))", 4200, { blend: "multiply", fade: 500 });
        const beat = 0.5;
        for (let i = 0; i < 6; i++) {
          fx.thud({ freq: 60, vol: 0.4, dur: 0.2, at: i * beat });
          if (i % 2) fx.noise(0.1, { type: "bandpass", freq: 1800, vol: 0.25, at: i * beat });
        }
        await fx.move(".reely", [{ transform: "rotate(0) translateY(0)" }, { transform: "rotate(-10deg) translateY(-4px)" }, { transform: "rotate(6deg) translateY(0)" }, { transform: "rotate(-4deg) translateY(-3px)" }, { transform: "rotate(0)" }], { duration: 3000, easing: "ease-in-out" });
        await fx.wait(1100);
      }
    },

    // Superman (1978)
    {
      id: 1924,
      run: async (fx) => {
        const h = fx.$("body > header h1");
        fx.style(h, { color: "#3aa0ff", textShadow: "3px 3px 0 #1f1b16, 0 0 14px #7fd0ff" }, 3000);
        fx.noise(1.2, { type: "bandpass", freq: 800, sweep: 4000, q: 1, vol: 0.35 });
        await fx.move(h, [{ transform: "scale(.05) translateZ(0)", filter: "blur(6px)", opacity: 0 }, { transform: "scale(1)", filter: "blur(0)", opacity: 1, offset: 0.6 }, { transform: "scale(1)" }], { duration: 1600, easing: "cubic-bezier(.2,.7,.2,1)" });
        fx.particles({ kind: "sweep", count: 24, glyphs: '<div style="width:100%;height:2px;background:#bfe6ff"></div>', min: 30, max: 70, dur: 500, stagger: 900 });
        await fx.wait(1400);
      }
    },

    // Wonder Woman (2017)
    {
      id: 297762,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const lasso = fx.put(A.S("0 0 100 140", '<ellipse class="l" cx="50" cy="70" rx="46" ry="66" pathLength="1" fill="none" stroke="#f2c230" stroke-width="4" style="filter:drop-shadow(0 0 6px #ffd24a)"/>'), r.x, r.y, { size: r.width * 1.3, h: r.height * 1.25 });
        const l = lasso.querySelector(".l");
        l.style.strokeDasharray = "1";
        l.style.strokeDashoffset = fx.reduced ? "0" : "1";
        fx.noise(0.8, { type: "bandpass", freq: 1500, sweep: 3000, q: 2, vol: 0.2 });
        await fx.move(l, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 800, easing: "ease-out" });
        fx.tone(1200, 1.4, { vol: 0.08, vibrato: [6, 8] });
        fx.tone(1800, 1.4, { vol: 0.05, vibrato: [6, 8] });
        await fx.move(lasso, [{ transform: "scale(1)" }, { transform: "scale(.92)" }, { transform: "scale(1)" }], { duration: 600 });
        await fx.wait(1500);
        await fx.fadeOut(lasso, 400);
      }
    },

    // X-Men (2000)
    {
      id: 36657,
      run: async (fx) => {
        const room = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 45%, rgba(20,40,120,.6), rgba(0,0,20,.92)), repeating-radial-gradient(circle at 50% 45%, transparent 0 28px, rgba(120,170,255,.25) 28px 30px)", backgroundBlendMode: "screen", opacity: 0 } });
        await fx.anim(room, [{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
        fx.chord(["C4", "G4", "D5"], 3, { vol: 0.06, attack: 0.8 });
        const dots = fx.$$("#grid .slot:not(.empty)").map((s) => {
          const r = fx.rect(s);
          const d = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#ff4a3a;box-shadow:0 0 10px 4px #ff4a3a"></div>', r.x, r.y, { size: 10 });
          fx.anim(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: Math.random() * 1200, fill: "both" });
          return d;
        });
        fx.move(room, [{ backgroundSize: "100% 100%, 100% 100%" }, { backgroundSize: "100% 100%, 140% 140%" }], { duration: 2800 });
        await fx.wait(2600);
        dots.forEach((d) => fx.remove(d));
        await fx.fadeOut(room, 500);
      }
    },

    // Thor: Ragnarok
    {
      id: 284053,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const beam = fx.node("", { style: { position: "absolute", left: r.x - 22 + "px", top: 0, width: "44px", height: r.y + "px", background: "linear-gradient(90deg, #ff5a5a, #ffb03a, #fff04a, #6aff6a, #4ab0ff, #b06aff)", boxShadow: "0 0 30px 8px rgba(255,255,255,.7)", transformOrigin: "50% 0" } });
        fx.noise(0.8, { freq: 4000, sweep: 200, vol: 0.5 });
        fx.thud({ freq: 50, vol: 0.9, dur: 0.8, at: 0.25 });
        await fx.anim(beam, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: fx.reduced ? 10 : 250, easing: "ease-in" });
        fx.shake("lg", 500);
        fx.buzz(200);
        fx.flash("#fff", 200);
        await fx.wait(600);
        fx.remove(beam);
        const rune = fx.put(A.S("0 0 100 100", '<g fill="none" stroke="#d9a13a" stroke-width="2.5" opacity=".9"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="30"/>' + Array.from({ length: 12 }, (_, i) => '<path d="M' + (50 + Math.cos(i * Math.PI / 6) * 30) + " " + (50 + Math.sin(i * Math.PI / 6) * 30) + " L" + (50 + Math.cos(i * Math.PI / 6 + 0.2) * 46) + " " + (50 + Math.sin(i * Math.PI / 6 + 0.2) * 46) + '"/>').join("") + "</g>"), r.x, r.top + r.height, { size: r.width * 1.8, h: r.width * 0.6 });
        await fx.wait(1500);
        await fx.fadeOut(rune, 600);
      }
    },

    // Doctor Strange (2016)
    {
      id: 284052,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const mandala = fx.put(A.S("0 0 100 100", '<g fill="none" stroke="#6aff9a" stroke-width="1.6" style="filter:drop-shadow(0 0 4px #3aff7a)"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="34"/><rect x="26" y="26" width="48" height="48" transform="rotate(45 50 50)"/><rect x="26" y="26" width="48" height="48"/><circle cx="50" cy="50" r="10"/></g>'), r.x, r.y, { size: Math.max(r.width, r.height) * 1.5 });
        fx.move(mandala, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 3000 });
        fx.tone(220, 2.8, { type: "sawtooth", vol: 0.04, vibrato: [8, 8], filter: { freq: 900 } });
        await fx.wait(900);
        // Time runs backwards for a moment.
        const s = fx.slot();
        if (s) await fx.move(s, [{ transform: "none" }, { transform: "translateY(-30px) scale(.6) rotate(-20deg)" }, { transform: "none" }], { duration: 1400, easing: "ease-in-out" });
        await fx.wait(600);
        await fx.fadeOut(mandala, 400);
      }
    }
  ]);
})();
