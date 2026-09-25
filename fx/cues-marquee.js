/* Machine FX cues - blockbusters: action, sci-fi and fantasy.
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
  const boom = (fx, x, y, big) => {
    fx.flash("#fff3c0", 140);
    fx.thud({ vol: big ? 1 : 0.6, freq: 45, dur: 0.8 });
    fx.noise(1, { freq: 900, sweep: 120, vol: big ? 0.7 : 0.4 });
    fx.shake(big ? "lg" : "md", 600);
    fx.buzz(big ? [200, 60, 200] : 90);
    fx.particles({ kind: "burst", from: pt(x, y), count: big ? 30 : 18, spread: big ? 90 : 50, gravity: 40, dur: 900, stagger: 0, glyphs: [dot("#ffcf5a"), dot("#ff7a1a"), dot("rgba(60,50,45,.8)")], min: 5, max: 16 });
  };
  const gun = (fx, n, gap) => { for (let i = 0; i < n; i++) { fx.noise(0.12, { freq: 2600, vol: 0.5, at: i * (gap || 0.12) }); fx.thud({ vol: 0.2, freq: 120, dur: 0.08, at: i * (gap || 0.12) }); } };
  const lightsaber = (c) => '<div style="width:100%;height:100%;border-radius:3px;background:#fff;box-shadow:0 0 6px 3px ' + c + ',0 0 16px 6px ' + c + '"></div>';

  M.register([
    // Gladiator
    {
      id: 98,
      y: 2000,
      run: async (fx) => {
        fx.filter("sepia(.45) saturate(1.2)", 6400, { fade: 400 });
        const wheat = A.S("0 0 400 100", Array.from({ length: 70 }, (_, i) => '<path d="M' + i * 6 + ' 100 C' + (i * 6 + 2) + ' 60 ' + (i * 6 - 2) + ' 40 ' + (i * 6 + 1) + ' ' + (20 + (i * 13) % 20) + '" stroke="#c9a24a" stroke-width="2" fill="none"/>').join(""));
        const field = fx.node(wheat, { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "26vh" } });
        field.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(field.firstChild.style, { width: "100%", height: "100%" });
        const hand = fx.put(A.S("0 0 60 40", '<path d="M4 30 C10 14 30 10 44 16 L56 12 C60 12 60 18 56 18 L46 22 C40 32 20 36 4 30 Z" fill="#e0c09a" ' + A.ink + ' stroke-width="2"/>'), -40, H() - 90, { size: 60, h: 40 });
        fx.move(hand, [{ transform: "none" }, { transform: "translateX(" + (W() + 80) + "px)" }], { duration: 4200, easing: "linear" });
        fx.seq([["D5", 3], ["F5", 1], ["E5", 2], ["D5", 2], ["A4", 4], ["C5", 2], ["D5", 6]], { type: "sine", vol: 0.08, beat: 0.3, vibrato: [5, 8], attack: 0.2 });
        fx.chord(["D3", "A3", "D4"], 5, { type: "sawtooth", vol: 0.025, attack: 1.2, filter: { freq: 700 } });
        await fx.wait(4200);
        fx.caption("Are you not entertained?", { style: "subtitle", ms: 1800 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 300, delay: (i % 5) * 70, iterations: 3, fill: "none" }));
        fx.noise(1.8, { type: "bandpass", freq: 900, q: 0.5, vol: 0.35, attack: 0.1 });
        await fx.wait(1900);
      }
    },

    // Heat
    {
      id: 949,
      y: 1995,
      run: async (fx) => {
        fx.filter("saturate(.6) hue-rotate(-15deg) brightness(.9)", 6200, { fade: 300 });
        fx.wash("rgba(30,60,90,.35)", 6200, { fade: 300 });
        const r = fx.rect(fx.slot());
        fx.put(A.mug, r.x - 30, r.top + r.height + 20, { size: 30, ms: 3000 });
        fx.put(A.mug, r.x + 30, r.top + r.height + 20, { size: 30, ms: 3000, style: { transform: "scaleX(-1)" } });
        fx.caption("(two men, one diner table)", { style: "whisper", ms: 2200 });
        fx.chord(["E3", "B3", "G4"], 3, { type: "sine", vol: 0.04, attack: 1 });
        await fx.wait(2800);
        gun(fx, 14, 0.09);
        for (let i = 0; i < 6; i++) {
          const o = fx.pick(fx.otherSlots(true));
          if (!o) continue;
          const orr = fx.rect(o);
          fx.later(i * 180, () => fx.put(A.S("0 0 20 20", '<circle cx="10" cy="10" r="4" fill="#1d1a18"/><path d="M10 0 L11 7 M20 10 L13 11 M10 20 L9 13 M0 10 L7 9" stroke="#fff" stroke-width="1.2"/>'), orr.x + fx.rand(-20, 20), orr.y + fx.rand(-30, 30), { size: 18, ms: 2400 }));
        }
        fx.shake("sm", 1400);
        fx.buzz([20, 60, 20, 60, 20, 60, 20]);
        await fx.wait(1800);
        fx.caption("(the airport lights at the end)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Braveheart
    {
      id: 197,
      y: 1995,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.costume(".reely", '<path d="M36 50 H84 V60 H36 Z M60 40 V70" stroke="#2d5ad8" stroke-width="10" fill="none" opacity=".75"/>', 6000);
        const pipes = [["A4", 2], ["B4", 1], ["C#5", 1], ["E5", 3], ["C#5", 1], ["B4", 2], ["A4", 4]];
        fx.seq(pipes, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { type: "bandpass", freq: 1600, q: 2 }, vibrato: [6, 6] });
        fx.tone("A3", 4, { type: "sawtooth", vol: 0.04, filter: { freq: 600 } });
        fx.tone("E3", 4, { type: "sawtooth", vol: 0.03, filter: { freq: 600 } });
        await fx.wait(2600);
        fx.caption("FREEEEEDOM!", { style: "hand", ms: 2000, css: { color: "#2d5ad8" } });
        fx.tone(300, 1.8, { type: "sawtooth", vol: 0.1, slide: 420, filter: { freq: 1400 }, vibrato: [6, 20] });
        fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateY(-14px) scale(1.08)" }, { transform: "none" }], 1800);
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 14, spread: 60, glyphs: A.petal("#6a3bff"), min: 8, max: 14, dur: 1400 });
        await fx.wait(2400);
      }
    },

    // Jurassic World
    {
      id: 135397,
      y: 2015,
      run: async (fx) => {
        const pool = fx.wash("linear-gradient(transparent 55%, rgba(30,110,160,.55))", 6400, { fade: 400 });
        void pool;
        const r = fx.rect(fx.slot());
        const shark = fx.put(A.S("0 0 100 50", '<path d="M4 28 C20 12 70 10 96 26 C70 40 20 42 4 28 Z" fill="#8a9aa8" ' + A.ink + ' stroke-width="2"/><path d="M40 16 L50 2 L58 16" fill="#8a9aa8" ' + A.ink + ' stroke-width="2"/>'), r.x, H() * 0.78, { size: 90, h: 45 });
        fx.move(shark, [{ transform: "translateX(-" + W() * 0.3 + "px)" }, { transform: "translateX(" + W() * 0.2 + "px)" }], 2000);
        fx.caption("(feeding time)", { style: "whisper", ms: 1600 });
        await fx.wait(2000);
        const jaw = fx.put(A.S("0 0 160 120", '<path d="M10 110 C10 60 60 20 110 30 C140 36 156 54 150 70 L100 72 L96 80 L150 84 C146 100 120 116 80 116 Z" fill="#6a7a5a" ' + A.ink + ' stroke-width="3"/><path d="M100 72 L106 66 L112 72 L118 66 L124 72 L130 66 L136 72 L142 66 L148 72" fill="#fff"/><circle cx="110" cy="46" r="5" fill="#f2c94c"/>'), W() / 2, H() + 80, { size: 200, h: 150 });
        await fx.move(jaw, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.34 + "px)" }], { duration: 500, easing: "cubic-bezier(.2,.9,.3,1.2)" });
        fx.noise(1, { freq: 700, sweep: 200, vol: 0.6 });
        fx.remove(shark);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.7), count: 30, spread: 80, gravity: 90, glyphs: A.drop("#9cd6ff"), min: 5, max: 10, dur: 1200, stagger: 0 });
        fx.buzz([150, 50, 150]);
        fx.shake("md", 500);
        await fx.move(jaw, [{ transform: "translateY(-" + H() * 0.34 + "px)" }, { transform: "none" }], { duration: 700, easing: "ease-in" });
        fx.caption("(the crowd gets splashed)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // The Lost World: Jurassic Park
    {
      id: 330,
      y: 1997,
      run: async (fx) => {
        const trailer = fx.put(A.S("0 0 140 70", '<rect x="4" y="10" width="132" height="50" rx="6" fill="#e8e4da" ' + A.ink + '/><rect x="14" y="18" width="30" height="16" fill="#9ab" ' + A.ink + ' stroke-width="1.5"/><circle cx="30" cy="62" r="7" fill="#1d1a18"/><circle cx="110" cy="62" r="7" fill="#1d1a18"/>'), W() / 2, H() * 0.45, { size: 180, h: 90, style: { transformOrigin: "100% 50%" } });
        fx.wash("rgba(10,30,20,.45)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 60, glyphs: '<div style="width:1px;height:100%;background:rgba(220,230,255,.8)"></div>', min: 12, max: 20, dur: 700, stagger: 6000 });
        for (let i = 0; i < 3; i++) { fx.thud({ vol: 0.7, freq: 40, dur: 0.6, at: 0.6 + i * 0.8 }); }
        fx.buzz([80, 700, 80, 700, 80]);
        await fx.wait(2600);
        fx.noise(1.2, { freq: 400, vol: 0.4 });
        fx.tone(120, 1, { type: "sawtooth", vol: 0.08, slide: 60, filter: { freq: 500 } });
        await fx.move(trailer, [{ transform: "none" }, { transform: "rotate(-40deg) translateY(30px)" }], { duration: 1600, easing: "ease-in" });
        const glass = fx.put(box("background:rgba(200,230,255,.35);border:2px solid #cfe8ff"), W() / 2 - 20, H() * 0.45 + 40, { size: 60, h: 40 });
        for (let i = 0; i < 6; i++) fx.click({ freq: 5000 - i * 300, vol: 0.2, at: i * 0.3 });
        fx.caption("(the glass is cracking…)", { style: "whisper", ms: 2000 });
        await fx.move(glass, Array.from({ length: 6 }, (_, i) => ({ transform: "translateY(" + i * 2 + "px)", filter: "brightness(" + (1 - i * 0.05) + ")" })), 2000);
        await fx.wait(400);
      }
    },

    // Aliens
    {
      id: 679,
      y: 1986,
      run: async (fx) => {
        fx.wash("rgba(10,30,40,.55)", 7000, { fade: 400 });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 7000, style: { opacity: 0.4 } });
        const tracker = fx.put(A.S("0 0 120 90", '<rect x="2" y="2" width="116" height="86" rx="8" fill="#1d2a24" ' + A.ink + '/><path d="M60 80 L14 20 M60 80 L106 20" stroke="#3aff8a" stroke-width="1" opacity=".5"/><path d="M20 70 A50 50 0 0 1 100 70 M32 58 A34 34 0 0 1 88 58" stroke="#3aff8a" stroke-width="1" fill="none" opacity=".5"/><circle class="blip" cx="60" cy="30" r="4" fill="#3aff8a"/><text class="dist" x="10" y="16" font-size="10" font-family="monospace" fill="#3aff8a">20m</text>'),
          W() / 2, H() * 0.42, { size: 170, h: 128 });
        const blip = tracker.querySelector(".blip"), dist = tracker.querySelector(".dist");
        const d = [20, 17, 14, 11, 9, 7, 5, 3, 2];
        for (let i = 0; i < d.length; i++) {
          if (blip) { blip.setAttribute("cy", 30 + i * 5); blip.setAttribute("cx", 60 + (i % 2 ? -6 : 6)); }
          if (dist) dist.textContent = d[i] + "m";
          fx.sfx("beep", { hz: 1760, vol: 0.45 + i * 0.04 });
          fx.tone(1800 - i * 60, 0.08, { type: "sine", vol: 0.05, at: 0.25 });
          await fx.wait(Math.max(260, 620 - i * 50));
        }
        fx.caption("They're in the room.", { style: "subtitle", ms: 1600 });
        await fx.wait(600);
        const tail = A.S("0 0 100 30", '<path d="M2 16 C30 4 60 28 90 12 L98 8 L94 18 Z" fill="#1d1a18"/>');
        fx.fly(tail, [W() + 40, H() * 0.2], [-60, H() * 0.25], { size: 100, h: 30, dur: 500 });
        fx.sfx("swish", { vol: 0.8 });
        fx.buzz([100]);
        await fx.wait(1400);
      }
    },

    // The Abyss
    {
      id: 2756,
      y: 1989,
      run: async (fx) => {
        const deep = fx.wash("linear-gradient(#0a2a4a, #020a1a)", 7000, { fade: 700, opacity: 0.8 });
        void deep;
        fx.particles({ kind: "rise", count: 16, glyphs: A.bubble, min: 5, max: 12, dur: 3000, stagger: 4000 });
        fx.chord(["E3", "B3", "F#4"], 6, { type: "sine", vol: 0.05, attack: 2 });
        await fx.wait(1600);
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const tent = fx.put(box("border-radius:40%;background:linear-gradient(90deg, rgba(160,220,255,.35), rgba(220,245,255,.65), rgba(160,220,255,.35));box-shadow:0 0 12px rgba(180,230,255,.8)"), -40, rr.y, { size: 90, h: 70 });
        fx.tone(900, 3, { type: "sine", vol: 0.05, vibrato: [3, 30] });
        await fx.move(tent, [{ transform: "none" }, { transform: "translateX(" + (rr.x - 30) + "px)" }], { duration: 2000, easing: "ease-out" });
        const face = fx.costume(".reely", '<g opacity=".6"><path d="M34 40 C34 20 86 20 86 40 V80 C86 96 34 96 34 80 Z" fill="#bfe8ff"/></g>', 2000);
        void face;
        fx.caption("(the water tentacle wears your face)", { style: "whisper", ms: 2000, css: { color: "#dff" } });
        fx.seq([["E5", 2], ["G#5", 1], ["B5", 3]], { type: "sine", vol: 0.05, beat: 0.3 });
        await fx.wait(2100);
        fx.move(tent, [{ transform: "translateX(" + (rr.x - 30) + "px)" }, { transform: "translateX(-60px)", opacity: 0 }], 800);
        await fx.wait(700);
      }
    },

    // True Lies
    {
      id: 36955,
      y: 1994,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const jet = fx.put(A.jet, -150, r.y - 20, { size: 150, h: 54 });
        fx.noise(3, { freq: 3000, sweep: 800, vol: 0.3, attack: 0.3 });
        fx.tone(200, 3, { type: "sawtooth", vol: 0.04, filter: { freq: 600 } });
        await fx.move(jet, [{ transform: "none" }, { transform: "translateX(" + (r.x + 150) + "px)" }], { duration: 1800, easing: "ease-out" });
        fx.move(jet, [{ transform: "translateX(" + (r.x + 150) + "px)" }, { transform: "translateX(" + (r.x + 150) + "px) translateY(-6px)" }, { transform: "translateX(" + (r.x + 150) + "px)" }], { duration: 700, iterations: 3 });
        fx.caption("(hovering, politely)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        fx.caption("You're fired.", { style: "subtitle", ms: 1400 });
        fx.noise(0.5, { type: "highpass", freq: 2000, vol: 0.6 });
        await fx.fly(A.S("0 0 40 12", '<path d="M2 6 H30 L38 2 V10 L30 6" fill="#9aa2a6" stroke="#1f1b16" stroke-width="1.5"/>'), [r.x + 20, r.y], [W() + 40, r.y - 60], { size: 36, h: 12, dur: 500 });
        boom(fx, W() - 30, r.y - 60, false);
        await fx.wait(1200);
      }
    },

    // Point Break
    {
      id: 1089,
      y: 1991,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const masks = ["#e0b870", "#d8a060", "#c89050", "#e8c080"];
        const others = fx.otherSlots(true).slice(0, 4);
        others.forEach((o, i) => {
          const orr = fx.rect(o);
          fx.put(A.S("0 0 50 60", '<ellipse cx="25" cy="30" rx="20" ry="26" fill="' + masks[i] + '" ' + A.ink + ' stroke-width="2"/><ellipse cx="17" cy="26" rx="5" ry="3" fill="#1d1a18"/><ellipse cx="33" cy="26" rx="5" ry="3" fill="#1d1a18"/><path d="M16 42 C22 46 28 46 34 42" stroke="#1d1a18" stroke-width="2" fill="none"/><path d="M10 12 C20 2 34 2 40 12" stroke="#6b4a2a" stroke-width="4" fill="none"/>'), orr.x, orr.y, { size: 40, h: 48, ms: 3000 });
        });
        fx.caption("(the Ex-Presidents)", { style: "whisper", ms: 2000 });
        await fx.wait(2600);
        fx.wash("linear-gradient(#8fd0ff, #1a6a9a)", 3600, { blend: "multiply", fade: 300, opacity: 0.5 });
        const wave = fx.put(A.S("0 0 400 200", '<path d="M0 200 V120 C60 40 180 0 260 40 C320 70 300 120 250 110 C290 90 280 60 240 60 C200 60 160 120 160 200 Z" fill="#2a8ab0"/><path d="M160 200 C160 120 200 60 240 60" stroke="#fff" stroke-width="6" fill="none"/>'), W() / 2, H() * 0.75, { size: W(), h: H() * 0.5 });
        fx.noise(3, { freq: 600, sweep: 1600, vol: 0.4, attack: 0.5 });
        await fx.move(wave, [{ transform: "translateX(" + W() + "px)" }, { transform: "none" }, { transform: "translateX(-" + W() + "px)" }], { duration: 3000, easing: "ease-in-out" });
        fx.caption("(the fifty-year storm)", { style: "whisper", ms: 1200 });
        await fx.wait(600);
        void r;
      }
    },

    // Face/Off
    {
      id: 754,
      y: 1997,
      run: async (fx) => {
        const reely = fx.$(".reely"), kernel = fx.$(".kernel");
        const fr = fx.rect(reely), kr = fx.rect(kernel);
        fx.caption("(face transplant)", { style: "whisper", ms: 1400 });
        fx.chord(["C4", "Eb4", "G4"], 1.4, { type: "sine", vol: 0.04 });
        await fx.wait(1200);
        if (!fx.reduced) {
          fx.anim(reely, [{ transform: "none" }, { transform: "translate(" + (kr.x - fr.x) + "px," + (kr.y - fr.y) + "px)" }], { duration: 1400, fill: "forwards", easing: "ease-in-out" });
          fx.anim(kernel, [{ transform: "none" }, { transform: "translate(" + (fr.x - kr.x) + "px," + (fr.y - kr.y) + "px)" }], { duration: 1400, fill: "forwards", easing: "ease-in-out" });
        }
        fx.tone(600, 1.4, { type: "sawtooth", vol: 0.04, slide: 300, filter: { freq: 1200 } });
        await fx.wait(1600);
        doves(fx);
        gun(fx, 8, 0.2);
        fx.tempo(0.3, 2000);
        fx.caption("(in slow motion, with doves)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        if (!fx.reduced) {
          fx.anim(reely, [{ transform: "translate(" + (kr.x - fr.x) + "px," + (kr.y - fr.y) + "px)" }, { transform: "none" }], { duration: 700, fill: "forwards" });
          fx.anim(kernel, [{ transform: "translate(" + (fr.x - kr.x) + "px," + (fr.y - kr.y) + "px)" }, { transform: "none" }], { duration: 700, fill: "forwards" });
        }
        await fx.wait(800);
        function doves(fx) {
          const dove = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#fff" stroke="#aaa" stroke-width=".8"/>');
          for (let i = 0; i < 8; i++) fx.later(i * 90, () => fx.fly(dove, [W() / 2, H() * 0.6], [fx.rand(0, W()), -40], { size: 40, h: 24, dur: 1600 }));
        }
      }
    },

    // The Rock
    {
      id: 9802,
      y: 1996,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const orb = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 35% 35%, #d8ffd0, #3aff5a 45%, #1a8a2a);box-shadow:0 0 16px #3aff5a"></div>', r.x, r.y, { size: 36 });
        fx.move(orb, [{ transform: "scale(1)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 900, iterations: 5 });
        fx.tone(220, 4, { type: "sine", vol: 0.05, vibrato: [4, 20] });
        fx.caption("(VX gas. Handle with extreme care.)", { style: "whisper", ms: 2200 });
        const beat = 0.18;
        for (let i = 0; i < 20; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.08, at: 1.4 + i * beat });
        fx.seq([["D4", 2], ["F4", 1], ["G4", 1], ["A4", 4], ["C5", 2], ["A4", 2], ["G4", 4]], { type: "sawtooth", vol: 0.05, beat, at: 1.4, filter: { freq: 1600 } });
        await fx.wait(3000);
        const flare = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff,#3aff5a 30%,transparent 70%)"></div>', W() * 0.8, H() * 0.2, { size: 60 });
        fx.move(flare, [{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], { duration: 400, iterations: 5 });
        fx.caption("Welcome to the Rock.", { style: "subtitle", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Con Air
    {
      id: 1701,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bunny = fx.put(A.S("0 0 50 60", '<path d="M16 22 L12 2 L20 20 M34 22 L38 2 L30 20" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><ellipse cx="25" cy="38" rx="18" ry="18" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="19" cy="34" r="2" fill="#1d1a18"/><circle cx="31" cy="34" r="2" fill="#1d1a18"/><path d="M22 42 L25 44 L28 42" stroke="#e05a8a" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 50, h: 60 });
        fx.caption("Put… the bunny… back… in the box.", { style: "subtitle", ms: 2600 });
        await fx.wait(2600);
        const bx = fx.put(A.box, r.x, r.top + r.height + 30, { size: 60, h: 52 });
        void bx;
        await fx.move(bunny, [{ transform: "none" }, { transform: "translateY(" + (r.height / 2 + 30) + "px) scale(.6)", opacity: 0 }], { duration: 700, easing: "ease-in" });
        fx.thud({ freq: 200, vol: 0.2 });
        const plane = A.S("0 0 160 60", '<rect x="20" y="22" width="120" height="18" rx="9" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M60 22 L80 4 H90 L80 22 M60 40 L80 58 H90 L80 40 M130 22 L150 10 V30" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/>');
        fx.noise(2.4, { freq: 2000, sweep: 800, vol: 0.2 });
        fx.seq([["E4", 2], ["G#4", 1], ["B4", 1], ["E5", 4]], { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1800 } });
        await fx.fly(plane, [-160, H() * 0.25], [W() + 160, H() * 0.15], { size: 170, h: 64, dur: 2400 });
      }
    },

    // Lethal Weapon
    {
      id: 941,
      y: 1987,
      run: async (fx) => {
        fx.wash("rgba(20,40,80,.3)", 6000, { fade: 300 });
        const sax = [["G4", 2], ["Bb4", 1], ["C5", 1], ["D5", 3], ["C5", 1], ["Bb4", 2], ["G4", 4]];
        fx.seq(sax, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { type: "bandpass", freq: 1200, q: 2 }, vibrato: [5, 8] });
        fx.caption("I'm too old for this.", { style: "subtitle", ms: 2200 });
        await fx.wait(2600);
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "rotate(-8deg) translateY(4px)" }, { transform: "rotate(-8deg) translateY(4px)" }, { transform: "none" }], 1400);
        fx.tone(160, 0.8, { type: "sawtooth", vol: 0.05, slide: 120, filter: { freq: 700 } });
        await fx.wait(1500);
        gun(fx, 3, 0.4);
        fx.later(1200, () => boom(fx, W() * 0.7, H() * 0.7, false));
        await fx.wait(2200);
      }
    },

    // Beverly Hills Cop
    {
      id: 90,
      y: 1984,
      run: async (fx) => {
        const beat = 0.14;
        const axel = [["F4", 2], [null, 1], ["Ab4", 1.5], ["F4", 1], ["F4", 0.5], ["Bb4", 1], ["F4", 1], ["Eb4", 1], ["F4", 2], [null, 1], ["C5", 1.5], ["F4", 1], ["F4", 0.5], ["Db5", 1], ["C5", 1], ["Ab4", 1], ["F4", 1], ["C5", 1], ["F5", 1], ["F4", 0.5], ["Eb4", 1], ["Eb4", 0.5], ["C4", 1], ["G4", 1], ["F4", 3]];
        fx.seq(axel, { type: "square", vol: 0.06, beat, filter: { freq: 2600 } });
        let t = 0;
        axel.forEach(([, l]) => { t += l * beat; });
        for (let i = 0; i < t / beat / 2; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.07, at: i * beat * 2 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        for (let i = 0; i < 10; i++) {
          const s = all[i % all.length];
          fx.style(s, { boxShadow: "0 0 0 3px " + ["#ff3b7a", "#3bd1ff", "#ffd23b"][i % 3] + ", 0 0 18px " + ["#ff3b7a", "#3bd1ff", "#ffd23b"][i % 3] }, 400);
          await fx.wait(beat * 2000);
        }
        fx.caption("(bananas in the tailpipe)", { style: "whisper", ms: 1600 });
        const banana = A.S("0 0 40 20", '<path d="M4 6 C10 18 30 18 38 4 C30 12 12 12 4 6 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="1.5"/>');
        fx.fly(banana, [-30, H() - 80], [W() * 0.5, H() - 60], { size: 36, h: 18, dur: 800, r2: 360 });
        await fx.wait(Math.max(400, t * 1000 - 2800));
      }
    },

    // First Blood
    {
      id: 1368,
      y: 1982,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(40,60,40,.4), rgba(20,30,20,.55))", 6400, { fade: 400 });
        fx.particles({ kind: "fall", count: 40, glyphs: '<div style="width:1px;height:100%;background:rgba(220,230,255,.7)"></div>', min: 12, max: 20, dur: 800, stagger: 5000 });
        fx.costume(".reely", '<path d="M34 40 C50 34 70 34 86 40 L90 46 C70 42 50 42 30 46 Z" fill="#d51f2a"/><path d="M86 44 L100 56 M86 44 L98 38" stroke="#d51f2a" stroke-width="4"/>', 6400);
        fx.seq([["F4", 3], ["Bb4", 1], ["C5", 2], ["Db5", 2], ["C5", 4], ["Ab4", 4]], { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1400 } });
        await fx.wait(2400);
        const others = fx.otherSlots(true);
        for (let i = 0; i < 5; i++) {
          const o = fx.pick(others);
          if (o) fx.style(o, { filter: "sepia(1) hue-rotate(40deg) saturate(2) brightness(.6)" }, 3600 - i * 300);
          fx.noise(0.2, { type: "bandpass", freq: 1200, q: 3, vol: 0.2 });
          await fx.wait(260);
        }
        fx.caption("(camouflaged in the mud)", { style: "whisper", ms: 1400 });
        fx.caption("They drew first blood, not me.", { style: "subtitle", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Commando
    {
      id: 10999,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("Remember when I said I'd kill you last?", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        fx.caption("I lied.", { style: "subtitle", ms: 1200 });
        fx.later(900, () => {
          fx.noise(0.6, { freq: 900, vol: 0.4 });
          fx.fly(A.S("0 0 50 50", '<circle cx="25" cy="25" r="10" fill="#6d665c"/><path d="M25 25 L0 10 M25 25 L50 40" stroke="#6d665c" stroke-width="3"/>'), [r.x, r.y], [r.x + 60, H() + 40], { size: 40, dur: 800, via: [r.x + 30, r.y - 60], r2: 360, easing: "ease-in" });
        });
        await fx.wait(1400);
        const tools = ["#9aa2a6", "#6b4a2a", "#d9a13a"];
        for (let i = 0; i < 6; i++) {
          fx.later(i * 120, () => fx.fly(A.S("0 0 50 12", '<rect x="2" y="3" width="46" height="6" fill="' + tools[i % 3] + '" ' + A.ink + ' stroke-width="1"/>'), [W() * 0.1, H() * 0.8], [fx.rand(W() * 0.3, W()), fx.rand(H() * 0.2, H() * 0.6)], { size: 50, h: 12, dur: 600, r2: fx.rand(-400, 400) }));
        }
        fx.caption("(the tool shed scene)", { style: "whisper", ms: 1400 });
        fx.later(800, () => fx.particles({ kind: "burst", from: fx.slot(), count: 10, spread: 30, dur: 700, glyphs: dot("#fff"), min: 3, max: 6 }));
        await fx.wait(1800);
      }
    },

    // Escape from New York
    {
      id: 1103,
      y: 1981,
      run: async (fx) => {
        fx.wash("rgba(10,20,40,.55)", 7000, { fade: 400 });
        const clock = fx.put('<div style="font:700 26px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff3030;background:#0b0907;padding:6px 10px;border:2px solid #555;text-align:center;letter-spacing:.1em">22:59:52</div>', W() / 2, H() * 0.28, { size: 160, h: 40 });
        const synth = [["C3", 1], ["C3", 1], ["G2", 1], ["C3", 1], ["C3", 1], ["Eb3", 1], ["C3", 2]];
        for (let i = 0; i < 3; i++) fx.seq(synth, { type: "sawtooth", vol: 0.06, beat: 0.25, at: i * 2, filter: { freq: 700 } });
        for (let s = 52; s < 60; s++) {
          clock.firstChild.textContent = "22:59:" + s;
          fx.click({ freq: 1600, vol: 0.2 });
          await fx.wait(500);
        }
        clock.firstChild.textContent = "23:00:00";
        fx.tone(1400, 0.4, { type: "square", vol: 0.08 });
        fx.caption("Call me Snake.", { style: "subtitle", ms: 2000 });
        fx.costume(".reely", '<path d="M40 50 C44 44 52 44 56 48 V60 C52 62 44 62 40 58 Z" fill="#1d1a18"/><path d="M40 50 L34 46 M56 48 L80 42" stroke="#1d1a18" stroke-width="2"/>', 2600);
        await fx.wait(2200);
      }
    },

    // Big Trouble in Little China
    {
      id: 6978,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.caption("It's all in the reflexes.", { style: "subtitle", ms: 2000 });
        const knife = A.S("0 0 50 12", '<path d="M2 6 L34 2 L48 6 L34 10 Z" fill="#dfe6ea" ' + A.ink + ' stroke-width="1.5"/><rect x="0" y="3" width="12" height="6" fill="#6b4a2a"/>');
        fx.fly(knife, [W() + 30, r.y - 60], [r.x + 20, r.y - 50], { size: 44, h: 12, dur: 400, flip: true, keep: true });
        await fx.wait(420);
        fx.click({ freq: 3000, vol: 0.5 });
        fx.caption("(caught it)", { style: "whisper", ms: 1000 });
        await fx.wait(1400);
        const cols = ["#ff3030", "#3a8aff", "#ffd23b"];
        for (let i = 0; i < 3; i++) {
          const bolt = fx.put(A.S("0 0 40 120", '<path d="M24 0 L8 54 H22 L12 120 L34 46 H20 Z" fill="' + cols[i] + '"/>'), W() * (0.25 + i * 0.25), H() * 0.4, { size: 40, h: 120, style: { filter: "drop-shadow(0 0 10px " + cols[i] + ")" } });
          fx.anim(bolt, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 500);
          fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.4 });
          fx.tone(1200 - i * 200, 0.3, { type: "sawtooth", vol: 0.05, slide: 300 });
          await fx.wait(450);
        }
        fx.caption("(the Three Storms)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Highlander
    {
      id: 8009,
      y: 1986,
      run: async (fx) => {
        fx.wash("rgba(20,30,60,.45)", 6400, { fade: 300 });
        fx.caption("There can be only one.", { style: "subtitle", ms: 2200 });
        await fx.wait(1600);
        const others = fx.otherSlots(true);
        for (const o of others) fx.style(o, { transition: "opacity .6s", opacity: "0.25" }, 4200);
        fx.style(fx.slot(), { boxShadow: "0 0 0 3px #bfe8ff, 0 0 30px 10px rgba(180,220,255,.9)" }, 4200);
        const r = fx.rect(fx.slot());
        for (let i = 0; i < 5; i++) {
          const b = fx.put(A.S("0 0 40 160", '<path d="M24 0 L6 70 H20 L10 160 L34 60 H20 Z" fill="#dff3ff"/>'), r.x + fx.rand(-40, 40), r.y - 60, { size: 40, h: 160, style: { filter: "drop-shadow(0 0 10px #8ac8ff)" } });
          fx.anim(b, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 300);
          fx.noise(0.25, { type: "highpass", freq: 2500, vol: 0.5 });
          fx.buzz(40);
          await fx.wait(280);
        }
        fx.chord(["D4", "A4", "D5", "F#5"], 2, { type: "sawtooth", vol: 0.05, filter: { freq: 2400 } });
        fx.caption("(the Quickening)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // The Mummy (1999)
    {
      id: 564,
      y: 1999,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(1.3)", 6400, { fade: 300 });
        fx.noise(5, { type: "bandpass", freq: 700, sweep: 1500, q: 0.5, vol: 0.35, attack: 0.6 });
        const face = fx.node(A.S("0 0 400 300", '<path d="M120 60 C120 10 280 10 280 60 L270 170 C260 230 220 260 200 260 C180 260 140 230 130 170 Z" fill="rgba(160,120,70,.75)"/><ellipse cx="165" cy="120" rx="22" ry="12" fill="rgba(40,25,10,.8)"/><ellipse cx="235" cy="120" rx="22" ry="12" fill="rgba(40,25,10,.8)"/><path d="M160 200 C180 225 220 225 240 200 C220 215 180 215 160 200 Z" fill="rgba(40,25,10,.8)"/>'),
          { cls: "fx-filter", style: { opacity: 0 } });
        face.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(face.firstChild.style, { width: "100%", height: "100%" });
        fx.particles({ kind: "sweep", count: 80, glyphs: dot("rgba(200,160,100,.8)"), min: 2, max: 5, dur: 900, stagger: 3000 });
        await fx.anim(face, [{ opacity: 0, transform: "translateX(40%) scale(.7)" }, { opacity: 1, transform: "none" }], { duration: 2000, fill: "forwards" });
        fx.tone(90, 1.6, { type: "sawtooth", vol: 0.12, slide: 60, filter: { freq: 600 } });
        fx.caption("(the sandstorm has a face)", { style: "whisper", ms: 1600 });
        await fx.wait(1400);
        for (let i = 0; i < 14; i++) fx.later(i * 60, () => fx.fly(A.S("0 0 20 12", '<ellipse cx="10" cy="6" rx="8" ry="5" fill="#2b2622"/><path d="M4 4 L0 0 M16 4 L20 0 M4 8 L0 12 M16 8 L20 12" stroke="#2b2622"/>'), [fx.rand(0, W()), H() + 10], [fx.rand(0, W()), fx.rand(H() * 0.4, H())], { size: 14, h: 9, dur: 700 }));
        fx.caption("(scarabs)", { style: "whisper", ms: 1200, css: { bottom: "16vh" } });
        await fx.anim(face, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, fill: "forwards" });
      }
    },

    // National Treasure
    {
      id: 2059,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const doc = fx.put(A.S("0 0 120 150", '<rect x="4" y="4" width="112" height="142" rx="3" fill="#e8d8b0" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 14 }, (_, i) => '<path d="M14 ' + (26 + i * 8) + ' H' + (100 - (i % 3) * 8) + '" stroke="#8a6a3a" stroke-width="1.5"/>').join("") + '<g class="map" opacity="0"><path d="M20 60 L50 80 L40 110 L80 120 L96 90" stroke="#1d6aff" stroke-width="2" stroke-dasharray="3 3" fill="none"/><circle cx="96" cy="90" r="4" fill="none" stroke="#1d6aff" stroke-width="2"/><text x="14" y="140" font-size="8" fill="#1d6aff" font-family="Georgia">Ottendorf</text></g>'),
          W() / 2, H() * 0.42, { size: 140, h: 175 });
        fx.caption("(the back of the Declaration)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const lens = fx.put('<div style="width:100%;height:100%;border-radius:50%;border:4px solid #c9a24a;background:rgba(200,255,220,.25);box-shadow:0 0 12px #3aff8a"></div>', W() / 2 - 60, H() * 0.42, { size: 70 });
        fx.tone(600, 2, { type: "sine", vol: 0.04, vibrato: [4, 20] });
        await fx.move(lens, [{ transform: "none" }, { transform: "translate(120px, 40px)" }, { transform: "translate(60px, -30px)" }], 2000);
        const map = doc.querySelector(".map");
        if (map) map.setAttribute("opacity", "1");
        fx.chord(["C5", "E5", "G5"], 1.4, { type: "triangle", vol: 0.06 });
        fx.caption("(invisible ink)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
        void r;
      }
    },

    // Mission: Impossible - Fallout
    {
      id: 353081,
      y: 2018,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const beat = 0.16;
        const mi = [["G4", 1.5], ["G4", 1.5], ["Bb4", 1], ["C5", 1], ["G4", 1.5], ["G4", 1.5], ["F4", 1], ["F#4", 1]];
        fx.seq(mi.concat(mi), { type: "square", vol: 0.05, beat, filter: { freq: 2000 } });
        const fuse = fx.put(box("background:linear-gradient(90deg,#ffcf5a,#ff5a1a);height:3px;border-radius:2px"), W() / 2, H() - 40, { size: W(), h: 3 });
        const spark = fx.put(dot("#fff6c0"), 0, H() - 40, { size: 10, style: { filter: "drop-shadow(0 0 6px #ffcf5a)" } });
        fx.noise(3, { type: "highpass", freq: 5000, vol: 0.1 });
        await fx.tween(fx.reduced ? 10 : 2600, (k) => {
          spark.style.transform = "translateX(" + k * (r.x) + "px) translateY(" + -k * (H() - 40 - r.y - r.height / 2) + "px)";
          fuse.style.clipPath = "inset(0 0 0 " + k * 50 + "%)";
        });
        fx.remove(fuse);
        fx.caption("This message will self-destruct.", { style: "subtitle", ms: 1400 });
        await fx.wait(1200);
        fx.particles({ kind: "rise", from: fx.slot(), count: 16, glyphs: dot("rgba(160,160,160,.7)"), min: 10, max: 22, dur: 1400 });
        fx.noise(0.6, { freq: 1200, vol: 0.4 });
        fx.style(fx.slot(), { filter: "brightness(.4) sepia(1)" }, 1600);
        await fx.wait(1600);
      }
    },

    // Skyfall
    {
      id: 37724,
      y: 2012,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const barrel = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, transparent 18%, #1d1a18 19%, #1d1a18 24%, #3b3530 25%, #0b0907 60%);box-shadow:0 0 0 200vmax #0b0907"></div>', 0, r.y, { size: 180 });
        fx.tone(98, 2, { type: "sawtooth", vol: 0.04, filter: { freq: 500 } });
        await fx.move(barrel, [{ transform: "translateX(0)" }, { transform: "translateX(" + r.x + "px)" }], { duration: 1600, easing: "steps(8)" });
        gun(fx, 1);
        fx.wash("linear-gradient(transparent, rgba(180,0,0,.8))", 1600, { fade: 600 });
        fx.remove(barrel);
        await fx.wait(1400);
        fx.caption("(Skyfall — the lodge burns in the heather)", { style: "whisper", ms: 2000 });
        const lodge = fx.put(A.S("0 0 140 80", '<path d="M10 76 V36 L70 6 L130 36 V76 Z" fill="#2b2622"/><rect x="30" y="44" width="16" height="16" fill="#ffb347"/><rect x="94" y="44" width="16" height="16" fill="#ffb347"/>'), W() / 2, H() * 0.66, { size: 170, h: 97 });
        fx.style(lodge, { filter: "drop-shadow(0 0 20px #ff7a1a)" });
        fx.particles({ kind: "rise", from: lodge, count: 30, glyphs: [dot("#ff7a1a"), dot("#ffcf5a")], min: 3, max: 8, dur: 1600 });
        fx.chord(["C3", "G3", "Eb4"], 2, { type: "sawtooth", vol: 0.04, filter: { freq: 900 } });
        await fx.wait(2200);
      }
    },

    // GoldenEye
    {
      id: 710,
      y: 1995,
      run: async (fx) => {
        fx.caption("(a dam, and a very long bungee jump)", { style: "whisper", ms: 2000 });
        const cord = fx.put(box("background:#1d1a18"), W() / 2, 0, { size: 2, h: 2, style: { transformOrigin: "50% 0" } });
        const man = fx.put(A.S("0 0 30 60", '<circle cx="15" cy="52" r="6" fill="#1d1a18"/><path d="M8 44 H22 L20 20 H10 Z M10 20 L6 0 M20 20 L24 0" fill="#1d1a18" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, 20, { size: 24, h: 48 });
        fx.tone(1600, 2.2, { type: "sine", vol: 0.05, slide: 200 });
        fx.noise(2.2, { freq: 3000, sweep: 800, vol: 0.2 });
        await fx.tween(fx.reduced ? 10 : 2000, (k) => {
          const y = k * k * (H() * 0.8);
          man.style.transform = "translateY(" + y + "px)";
          cord.style.height = y + 20 + "px";
        });
        fx.thud({ freq: 150, vol: 0.3 });
        fx.move(man, [{ transform: "translateY(" + H() * 0.8 + "px)" }, { transform: "translateY(" + H() * 0.6 + "px)" }, { transform: "translateY(" + H() * 0.72 + "px)" }], 900);
        await fx.wait(900);
        fx.caption("(the Golden Gun gunbarrel)", { style: "whisper", ms: 1400 });
        const bar = [["B3", 2], ["C4", 1], ["C#4", 1], ["C4", 2], ["B3", 2]];
        fx.seq(bar, { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 900 } });
        await fx.wait(1600);
      }
    },

    // The Bourne Identity
    {
      id: 2501,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.7) hue-rotate(-10deg)", 6000, { fade: 300 });
        fx.caption("(he doesn't know who he is)", { style: "whisper", ms: 1600 });
        const box1 = fx.put(A.S("0 0 100 70", '<rect x="4" y="4" width="92" height="62" rx="4" fill="#6d7478" ' + A.ink + '/><rect x="14" y="14" width="72" height="42" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/><text x="50" y="40" font-size="10" text-anchor="middle" font-family="monospace" fill="#1d1a18">GEMEINSCHAFT</text>'), r.x, r.y, { size: 100, h: 70 });
        void box1;
        await fx.wait(1600);
        const items = [A.S("0 0 40 26", '<rect x="2" y="2" width="36" height="22" rx="2" fill="#6b1d2a" ' + A.ink + ' stroke-width="1.5"/><text x="20" y="16" font-size="6" text-anchor="middle" fill="#e8c870" font-family="Georgia">PASSPORT</text>'), A.bill, A.S("0 0 40 26", '<rect x="2" y="2" width="36" height="22" rx="2" fill="#2d3b55" ' + A.ink + ' stroke-width="1.5"/>'), A.S("0 0 40 26", '<rect x="2" y="2" width="36" height="22" rx="2" fill="#1d6a3a" ' + A.ink + ' stroke-width="1.5"/>')];
        for (let i = 0; i < 6; i++) {
          fx.fly(items[i % items.length], [r.x, r.y], [r.x + fx.rand(-120, 120), r.y + fx.rand(-140, -40)], { size: 40, h: 26, dur: 700, keep: true });
          fx.click({ freq: 2200, vol: 0.2 });
          await fx.wait(150);
        }
        fx.caption("(six passports, six names)", { style: "whisper", ms: 1600 });
        const beat = 0.2;
        for (let i = 0; i < 12; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.08, at: i * beat });
        fx.seq([["A3", 2], ["A3", 1], ["C4", 1], ["D4", 2], ["E4", 2]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 900 } });
        await fx.wait(2400);
      }
    },

    // Taken
    {
      id: 8681,
      y: 2008,
      run: async (fx) => {
        const phone = fx.put(A.S("0 0 40 70", '<rect x="4" y="2" width="32" height="66" rx="6" fill="#2b2622" ' + A.ink + ' stroke-width="2"/><rect x="8" y="10" width="24" height="36" fill="#9ab"/><circle cx="20" cy="56" r="5" fill="#555"/>'), W() / 2, H() * 0.42, { size: 50, h: 88 });
        fx.move(phone, [{ transform: "none" }, { transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }, { transform: "none" }], { duration: 200, iterations: 4 });
        fx.tone(1400, 0.8, { type: "square", vol: 0.04, vibrato: [20, 80] });
        await fx.wait(1200);
        const lines = ["I don't know who you are.", "But I will find you.", "…and I will find you."];
        for (const l of lines) {
          fx.caption(l, { style: "subtitle", ms: 1500 });
          fx.tone(90, 1.2, { type: "sawtooth", vol: 0.04, filter: { type: "bandpass", freq: 500, q: 3 } });
          await fx.wait(1600);
        }
        fx.caption("(a particular set of skills)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Edge of Tomorrow
    {
      id: 137113,
      y: 2014,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const live = () => {
          fx.wash("rgba(60,70,60,.35)", 1800, { fade: 200 });
          fx.put(A.S("0 0 80 40", '<rect x="4" y="10" width="72" height="24" fill="#6d7478" ' + A.ink + ' stroke-width="2"/><path d="M10 10 L20 0 H60 L70 10" fill="none" ' + A.ink + '/>'), r.x, r.y + 30, { size: 60, h: 30, ms: 1400 });
          fx.thud({ vol: 0.5 });
          fx.noise(0.5, { freq: 900, vol: 0.3 });
          fx.caption("On your feet, maggot!", { style: "subtitle", ms: 1200 });
        };
        for (let loop = 0; loop < 3; loop++) {
          live();
          await fx.wait(1300);
          fx.flash("#fff", 160);
          fx.tone(200, 0.4, { type: "sawtooth", vol: 0.08, slide: 60 });
          fx.caption("(day " + (loop + 1) + ")", { style: "whisper", ms: 500 });
          await fx.wait(600);
        }
        fx.caption("Live. Die. Repeat.", { style: "card", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Looper
    {
      id: 59967,
      y: 2012,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("sepia(.4) saturate(1.2)", 6400, { fade: 300 });
        fx.caption("(a cornfield, 2044)", { style: "whisper", ms: 1600 });
        const tarp = fx.put(box("background:#e8e4da;border:2px solid #1d1a18"), r.x, r.y, { size: 60, h: 20 });
        await fx.wait(1400);
        fx.flash("rgba(255,255,255,.6)", 200);
        fx.tone(3000, 0.5, { type: "sine", vol: 0.06, slide: 200 });
        fx.remove(tarp);
        const man = fx.put(A.S("0 0 30 60", '<circle cx="15" cy="8" r="6" fill="#9a9a9a"/><path d="M6 16 H24 L22 40 H8 Z" fill="#4a443c"/><path d="M8 40 L6 58 M22 40 L24 58" stroke="#1d1a18" stroke-width="4"/>'), r.x, r.y, { size: 24, h: 48 });
        void man;
        fx.caption("(the target is… him, thirty years older)", { style: "whisper", ms: 2000 });
        fx.seq([["C4", 1], ["C4", 1], ["Eb4", 1], ["C4", 1], ["Bb3", 2], ["G3", 2]], { type: "sawtooth", vol: 0.05, beat: 0.22, filter: { freq: 900 } });
        await fx.wait(1800);
        fx.style(fx.$(".reely"), { filter: "grayscale(1) brightness(1.2)" }, 2000);
        fx.caption("(old Reely, just for a moment)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // District 9
    {
      id: 17654,
      y: 2009,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const sign = fx.put('<div style="font:700 12px/1.2 Georgia,serif;color:#1d1a18;background:#f4f0e6;border:3px solid #d51f2a;padding:6px;text-align:center">FOR HUMANS ONLY</div>', r.x, r.top - 20, { size: 120, h: 34 });
        void sign;
        fx.caption("(the mothership hangs over Johannesburg)", { style: "whisper", ms: 2000 });
        const ship = fx.put(A.S("0 0 300 60", '<path d="M10 30 C40 6 260 6 290 30 C260 54 40 54 10 30 Z" fill="#4a4a50"/><path d="M40 30 H260" stroke="#2a2a30" stroke-width="3"/>'), W() / 2, H() * 0.12, { size: W() * 0.9, h: 60 });
        fx.move(ship, [{ transform: "none" }, { transform: "translateY(6px)" }, { transform: "none" }], { duration: 3000, iterations: 2 });
        fx.tone(45, 5, { type: "sine", vol: 0.1, attack: 1 });
        await fx.wait(2400);
        fx.costume(".reely", '<path d="M96 60 C110 50 118 70 108 80 C100 90 96 80 96 70 Z" fill="#6a7a5a" stroke="#1f1b16" stroke-width="2"/>', 3000);
        fx.caption("(his hand is changing)", { style: "whisper", ms: 1600 });
        fx.tone(700, 0.4, { type: "sawtooth", vol: 0.05, vibrato: [30, 60] });
        await fx.wait(2400);
      }
    },

    // Children of Men
    {
      id: 9693,
      y: 2006,
      run: async (fx) => {
        fx.filter("saturate(.35) contrast(1.1)", 7400, { fade: 400 });
        fx.caption("(no babies born in 18 years)", { style: "whisper", ms: 2000 });
        const splat = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#8a1a1a, rgba(138,26,26,0) 70%)"></div>', W() * 0.7, H() * 0.35, { size: 20 });
        splat.style.opacity = 0;
        if (!fx.reduced) fx.page([{ transform: "translate(0,0)" }, { transform: "translate(4px,-3px)" }, { transform: "translate(-3px,2px)" }, { transform: "translate(0,0)" }], { duration: 900, iterations: 6, fill: "none" });
        gun(fx, 10, 0.3);
        fx.later(1600, () => splat.style.opacity = 1);
        fx.caption("(one unbroken take — the camera never cuts)", { style: "whisper", ms: 2400, css: { bottom: "30vh" } });
        await fx.wait(3200);
        fx.tone(700, 1.4, { type: "sine", vol: 0.08, vibrato: [8, 40] });
        fx.caption("(a baby cries — and the fighting stops)", { style: "whisper", ms: 2400 });
        await fx.wait(2600);
      }
    },

    // Gattaca
    {
      id: 782,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(40,90,110,.3)", 6400, { fade: 400 });
        const letters = "GATTACA";
        const helix = fx.put('<div style="font:700 20px/1 \'Special Elite\',\'Courier New\',monospace;letter-spacing:.3em;color:#e8c870;text-align:center"></div>', W() / 2, H() * 0.3, { size: 240, h: 30 });
        for (let i = 0; i < letters.length; i++) {
          helix.firstChild.textContent = letters.slice(0, i + 1);
          fx.tone(["G4", "A4", "C5", "C5", "A4", "C4", "A4"][i], 0.3, { type: "sine", vol: 0.06 });
          await fx.wait(260);
        }
        const scan = fx.put('<div style="width:100%;height:100%;background:linear-gradient(transparent, rgba(80,255,200,.6), transparent)"></div>', r.x, r.y, { size: r.width, h: 20 });
        fx.sfx("whir", { vol: 0.6, rate: 1.4 });
        await fx.move(scan, [{ transform: "translateY(-" + r.height / 2 + "px)" }, { transform: "translateY(" + r.height / 2 + "px)" }], 900);
        fx.remove(scan);
        fx.caption("IDENTITY CONFIRMED — VALID", { style: "terminal", ms: 1600 });
        fx.sfx("confirm", { vol: 0.6 });
        await fx.wait(1600);
        fx.caption("(one eyelash, on the keyboard…)", { style: "whisper", ms: 1400 });
        fx.put(A.S("0 0 20 6", '<path d="M1 5 C6 1 14 1 19 3" stroke="#1d1a18" stroke-width="1.2" fill="none"/>'), W() * 0.3, H() * 0.7, { size: 16, h: 5, ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Batman Returns
    {
      id: 364,
      y: 1992,
      run: async (fx) => {
        fx.wash("rgba(10,15,30,.5)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 60, glyphs: A.snowflake, min: 5, max: 10, dur: 4000, stagger: 5000 });
        const r = fx.rect(fx.slot());
        const cat = fx.costume(".reely", '<path d="M36 40 L30 14 L48 30 M84 40 L90 14 L72 30" fill="#1d1a18"/><path d="M40 44 C40 36 80 36 80 44 C74 52 46 52 40 44 Z" fill="#1d1a18"/><path d="M44 40 L48 48 M60 38 V50 M76 40 L72 48" stroke="#fff" stroke-width="1.5"/>', 5600);
        void cat;
        fx.caption("Meow.", { style: "subtitle", ms: 1400 });
        fx.tone(900, 0.5, { type: "sawtooth", vol: 0.05, slide: 600, filter: { freq: 1800 } });
        await fx.wait(1800);
        for (let i = 0; i < 4; i++) {
          fx.later(i * 200, () => fx.fly(A.S("0 0 30 36", '<path d="M15 4 C22 4 26 10 26 16 C26 24 22 32 15 32 C8 32 4 24 4 16 C4 10 8 4 15 4 Z" fill="#1d1a18"/><path d="M8 12 L2 16 M22 12 L28 16" stroke="#ffcf5a" stroke-width="2"/><circle cx="15" cy="14" r="3" fill="#fff"/>'), [W() + 30, H() * 0.8], [r.x, r.y], { size: 26, h: 32, dur: 1400, easing: "steps(10)" }));
        }
        fx.caption("(the penguin army, rockets strapped on)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 8; i++) fx.click({ freq: 1600, vol: 0.15, at: i * 0.2 });
        await fx.wait(2600);
      }
    },

    // The Dark Knight Rises
    {
      id: 49026,
      y: 2012,
      run: async (fx) => {
        fx.filter("saturate(.6) contrast(1.1)", 6400, { fade: 300 });
        const chant = ["Deshi…", "Deshi…", "Basara!", "Basara!"];
        for (let i = 0; i < chant.length; i++) {
          fx.caption(chant[i], { style: "subtitle", ms: 700, css: { bottom: 14 + (i % 2) * 6 + "vh" } });
          fx.tone(i < 2 ? 110 : 147, 0.5, { type: "sawtooth", vol: 0.08, filter: { type: "bandpass", freq: 700, q: 3 } });
          fx.thud({ freq: 60, vol: 0.3, dur: 0.3 });
          await fx.wait(700);
        }
        fx.caption("(he climbs out of the pit — without the rope)", { style: "whisper", ms: 2000 });
        const pit = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#0b0907 55%, rgba(11,9,7,0) 70%)"></div>', W() / 2, H() * 0.55, { size: Math.min(W(), H()) * 0.8 });
        void pit;
        const bats = [];
        for (let i = 0; i < 14; i++) bats.push(i);
        for (const i of bats) fx.later(i * 60, () => fx.fly(A.bat, [W() / 2, H() * 0.55], [fx.rand(0, W()), -30], { size: 40, h: 20, dur: 1400 }));
        fx.noise(1.6, { type: "bandpass", freq: 2000, q: 1, vol: 0.2 });
        await fx.wait(2400);
      }
    },

    // Spider-Man 2
    {
      id: 558,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const train = A.S("0 0 200 50", '<rect x="4" y="6" width="192" height="36" rx="6" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 7 }, (_, i) => '<rect x="' + (14 + i * 26) + '" y="12" width="18" height="12" fill="#cfe8ff"/>').join(""));
        const t = fx.put(train, -200, r.y + 40, { size: 220, h: 55 });
        fx.noise(3, { freq: 600, vol: 0.3, attack: 0.2 });
        await fx.move(t, [{ transform: "none" }, { transform: "translateX(" + (W() / 2 + 100) + "px)" }], { duration: 2000, easing: "cubic-bezier(.3,0,.1,1)" });
        const webs = fx.put(A.S("0 0 300 100", Array.from({ length: 8 }, (_, i) => '<path d="M150 50 L' + (i * 40) + " " + (i % 2 ? 0 : 100) + '" stroke="#fff" stroke-width="2"/>').join("")), W() / 2, r.y + 40, { size: W(), h: 120 });
        void webs;
        fx.noise(0.3, { type: "highpass", freq: 4000, vol: 0.4 });
        fx.caption("(he stops the train with his bare hands)", { style: "whisper", ms: 2200 });
        fx.thud({ vol: 0.5 });
        await fx.wait(2400);
        fx.caption("(and the passengers carry him back)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Captain America: The Winter Soldier
    {
      id: 100402,
      y: 2014,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const shield = A.S("0 0 60 60", '<circle cx="30" cy="30" r="28" fill="#d51f2a"/><circle cx="30" cy="30" r="21" fill="#f4f0e6"/><circle cx="30" cy="30" r="14" fill="#d51f2a"/><circle cx="30" cy="30" r="8" fill="#2d5ad8"/><path d="M30 23 L32 28 L37 28 L33 31 L35 36 L30 33 L25 36 L27 31 L23 28 L28 28 Z" fill="#fff"/>');
        const others = fx.otherSlots(true).slice(0, 5);
        let from = [r.x, r.y];
        for (const o of others) {
          const orr = fx.rect(o);
          await fx.fly(shield, from, [orr.x, orr.y], { size: 44, dur: 280, r2: 720 });
          fx.tone(1600, 0.2, { type: "sine", vol: 0.1 });
          fx.click({ freq: 3000, vol: 0.4 });
          fx.move(o, [{ transform: "none" }, { transform: "rotate(-6deg)" }, { transform: "none" }], { duration: 250, fill: "none" });
          from = [orr.x, orr.y];
        }
        await fx.fly(shield, from, [r.x, r.y], { size: 44, dur: 300, r2: 720 });
        fx.caption("(the elevator fight: \"Before we get started…\")", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Logan
    {
      id: 263115,
      y: 2017,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(.8) contrast(1.1)", 7000, { fade: 400 });
        const r = fx.rect(fx.slot());
        fx.costume(".reely", '<path d="M96 70 L114 50 M98 76 L118 60 M100 82 L120 70" stroke="#cfd4d6" stroke-width="3" stroke-linecap="round"/>', 7000);
        fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.tone(2400, 0.3, { type: "sawtooth", vol: 0.05, slide: 3000 });
        fx.caption("(snikt)", { style: "whisper", ms: 1000 });
        await fx.wait(1600);
        fx.chord(["A3", "C4", "E4"], 4, { type: "triangle", vol: 0.04, attack: 1 });
        fx.seq([["E4", 3], ["D4", 1], ["C4", 2], ["A3", 6]], { type: "sawtooth", vol: 0.04, beat: 0.35, filter: { freq: 900 } });
        await fx.wait(2400);
        const cross = fx.put(A.S("0 0 40 60", '<path d="M20 4 V56 M8 18 H32" stroke="#6b4a2a" stroke-width="5"/>'), r.x, r.top + r.height + 30, { size: 30, h: 44 });
        fx.move(cross, [{ transform: "rotate(0)" }, { transform: "rotate(-90deg)" }], { duration: 1200, delay: 800, fill: "forwards" });
        fx.caption("(the cross, tipped on its side — an X)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Guardians of the Galaxy Vol. 2
    {
      id: 283995,
      y: 2017,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const groot = fx.put(A.S("0 0 40 60", '<path d="M14 60 V34 C8 30 6 20 12 14 C16 4 30 4 30 16 C34 22 32 30 26 34 V60 Z" fill="#8a6a3a" ' + A.ink + ' stroke-width="2"/><circle cx="17" cy="20" r="2.5" fill="#1d1a18"/><circle cx="25" cy="20" r="2.5" fill="#1d1a18"/><path d="M16 26 Q21 30 26 26" stroke="#1d1a18" stroke-width="1.5" fill="none"/><path d="M12 12 L8 4 M28 10 L32 2" stroke="#5fa04a" stroke-width="3"/>'),
          r.x, r.top + r.height + 30, { size: 40, h: 60 });
        const beat = 0.2;
        const tune = [["D4", 1], ["D4", 1], ["F4", 1], ["A4", 2], ["G4", 1], ["F4", 1], ["D4", 2], ["C4", 1], ["D4", 3]];
        fx.seq(tune.concat(tune), { type: "square", vol: 0.05, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 20; i++) fx.thud({ freq: 80, vol: 0.15, dur: 0.07, at: i * beat * 2 });
        fx.caption("(Baby Groot dances while everyone else fights)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 12; i++) {
          if (!fx.reduced) groot.style.transform = "translateX(" + (i % 4 < 2 ? -8 : 8) + "px) rotate(" + (i % 2 ? 10 : -10) + "deg)";
          if (i % 3 === 0) fx.later(0, () => boom(fx, fx.rand(0, W()), fx.rand(0, H() * 0.5), false));
          await fx.wait(beat * 2000);
        }
        fx.caption("I am Groot.", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Watchmen
    {
      id: 13183,
      y: 2009,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const badge = fx.put(A.S("0 0 60 60", '<circle cx="30" cy="30" r="27" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><circle cx="22" cy="24" r="3" fill="#1d1a18"/><path d="M34 20 C36 24 38 24 38 20" stroke="#1d1a18" stroke-width="3" fill="none"/><path d="M18 38 C24 46 36 46 42 38" stroke="#1d1a18" stroke-width="3" fill="none"/><path d="M36 10 C40 16 38 24 44 26 C40 28 38 30 36 34" fill="#b3122a"/>'),
          r.x, -40, { size: 60 });
        await fx.move(badge, [{ transform: "none" }, { transform: "translateY(" + (r.y + 40) + "px) rotate(360deg)" }], { duration: 1400, easing: "ease-in" });
        fx.click({ freq: 3000, vol: 0.4 });
        fx.caption("(the smiley badge, one drop of blood)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        const doc = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#bff0ff, #3ab0ff 60%, rgba(58,176,255,0) 72%);box-shadow:0 0 30px #3ab0ff"></div>', W() / 2, H() * 0.3, { size: 90 });
        fx.move(doc, [{ transform: "scale(.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], 800);
        fx.tone(220, 2.4, { type: "sine", vol: 0.1, vibrato: [3, 20] });
        fx.caption("Who watches the Watchmen?", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // V for Vendetta
    {
      id: 752,
      y: 2005,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const dominos = [];
        const n = W() < 500 ? 12 : 18;
        for (let i = 0; i < n; i++) dominos.push(fx.put(box("background:#1d1a18;border-radius:2px;transform-origin:50% 100%"), W() * 0.1 + i * (W() * 0.8 / n), H() * 0.7, { size: 8, h: 30 }));
        fx.caption("Remember, remember, the fifth of November…", { style: "subtitle", ms: 2400 });
        await fx.wait(1800);
        for (let i = 0; i < dominos.length; i++) {
          fx.move(dominos[i], [{ transform: "rotate(0)" }, { transform: "rotate(80deg)" }], { duration: 160, fill: "forwards", easing: "ease-in" });
          fx.click({ freq: 2200 + i * 40, vol: 0.2 });
          await fx.wait(70);
        }
        fx.put(A.S("0 0 40 40", '<path d="M4 4 L20 36 L36 4" stroke="#d51f2a" stroke-width="5" fill="none"/>'), W() / 2, H() * 0.55, { size: 60, ms: 2800 });
        await fx.wait(600);
        for (let i = 0; i < 6; i++) fx.later(i * 200, () => boom(fx, fx.rand(0, W()), fx.rand(0, H() * 0.4), false));
        fx.chord(["Eb4", "G4", "Bb4", "Eb5"], 2.4, { type: "sawtooth", vol: 0.05, filter: { freq: 2000 } });
        await fx.wait(2400);
        void r;
      }
    },

    // 300
    {
      id: 1271,
      y: 2006,
      run: async (fx) => {
        fx.filter("sepia(.7) saturate(1.6) contrast(1.4)", 6000, { fade: 300 });
        fx.caption("This…", { style: "subtitle", ms: 900 });
        await fx.wait(900);
        fx.caption("…is…", { style: "subtitle", ms: 900 });
        await fx.wait(900);
        fx.caption("SPARTA!", { style: "hand", ms: 1400, css: { color: "#b3122a", fontSize: "34px" } });
        fx.tone(90, 0.8, { type: "sawtooth", vol: 0.14, filter: { freq: 700 } });
        fx.tempo(0.3, 1200);
        const reely = fx.$(".reely");
        await fx.move(reely, [{ transform: "none" }, { transform: "translateX(-20px) rotate(-8deg)" }, { transform: "translateX(40px) rotate(6deg)" }, { transform: "none" }], { duration: 900, easing: "cubic-bezier(.2,1.6,.4,1)" });
        fx.thud({ vol: 1, freq: 40, dur: 0.8 });
        fx.shake("lg", 500);
        fx.buzz([150]);
        const others = fx.otherSlots(true);
        const o = others[others.length - 1];
        if (o) fx.move(o, [{ transform: "none" }, { transform: "translateY(" + H() + "px) rotate(40deg)" }], { duration: 900, easing: "ease-in", fill: "forwards" });
        fx.caption("(kicked into the pit)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Hellboy
    {
      id: 1487,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.style(fx.$(".reely"), { filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }, 5600);
        fx.costume(".reely", '<path d="M40 30 C40 24 46 22 48 28 M72 28 C74 22 80 24 80 30" stroke="#f2c94c" stroke-width="5" stroke-linecap="round" fill="none"/>', 5600);
        fx.caption("(the horns are filed down)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        const cats = [];
        for (let i = 0; i < 5; i++) cats.push(fx.put(A.cat, fx.rand(30, W() - 30), H() - fx.rand(40, 90), { size: 50, h: 32, style: { opacity: 0 } }));
        cats.forEach((c, i) => fx.anim(c, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 200, fill: "forwards" }));
        fx.caption("(and he feeds the cats)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 5; i++) fx.tone(fx.rand(600, 900), 0.4, { type: "sawtooth", vol: 0.03, slide: fx.rand(400, 700), filter: { freq: 1400 }, at: i * 0.2 });
        await fx.wait(1800);
        const fist = fx.put(A.S("0 0 60 60", '<rect x="6" y="10" width="48" height="44" rx="10" fill="#8a3a2a" ' + A.ink + ' stroke-width="3"/><path d="M6 24 H54 M6 38 H54 M20 10 V54 M36 10 V54" stroke="#5a2a1a" stroke-width="2"/>'), r.x, r.y, { size: 60 });
        fx.thud({ vol: 0.7 });
        fx.shake("md", 400);
        await fx.move(fist, [{ transform: "scale(.4)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }], 400);
        await fx.wait(800);
      }
    },

    // Transformers
    {
      id: 1858,
      y: 2007,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const car = fx.put(A.car("#f2d33b"), r.x, r.top + r.height + 30, { size: 100, h: 45 });
        const transform = [0, 0.18, 0.32, 0.5, 0.6, 0.72, 0.85, 1, 1.1];
        transform.forEach((t, i) => { fx.noise(0.08, { type: "bandpass", freq: 1500 + i * 400, q: 4, vol: 0.4, at: t }); fx.tone(300 + i * 120, 0.1, { type: "square", vol: 0.05, at: t }); });
        await fx.wait(300);
        const bot = A.S("0 0 70 110", '<rect x="18" y="4" width="34" height="26" rx="4" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><rect x="24" y="12" width="22" height="8" fill="#3ab0ff"/><path d="M10 34 H60 L56 70 H14 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><rect x="14" y="38" width="16" height="10" fill="#cfe8ff"/><rect x="40" y="38" width="16" height="10" fill="#cfe8ff"/><path d="M14 70 L10 106 H26 L30 70 M40 70 L44 106 H60 L56 70" fill="#1d1a18"/><path d="M10 36 L0 70 M60 36 L70 70" stroke="#f2d33b" stroke-width="8"/>');
        if (!fx.reduced) await fx.anim(car, [{ transform: "none" }, { transform: "rotate(90deg) scale(.6)" }, { transform: "rotate(180deg) scale(.3)", opacity: 0 }], 900);
        fx.remove(car);
        const b = fx.put(bot, r.x, r.top + r.height - 10, { size: 70, h: 110 });
        fx.move(b, [{ transform: "scale(.3)" }, { transform: "scale(1)" }], { duration: 400, easing: "cubic-bezier(.3,1.6,.5,1)" });
        fx.thud({ vol: 0.6 });
        fx.caption("(the radio does the talking)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 3; i++) fx.noise(0.4, { type: "bandpass", freq: 1200, q: 3, vol: 0.15, at: 0.6 + i * 0.5 });
        await fx.wait(2400);
      }
    },

    // Pacific Rim
    {
      id: 68726,
      y: 2013,
      run: async (fx) => {
        fx.wash("rgba(10,30,50,.5)", 6400, { fade: 300 });
        fx.particles({ kind: "fall", count: 60, glyphs: '<div style="width:1px;height:100%;background:rgba(200,220,255,.7)"></div>', min: 12, max: 20, dur: 700, stagger: 5500 });
        const riff = [["D3", 2], ["D3", 1], ["F3", 1], ["D3", 2], ["G3", 2], ["F3", 2], ["D3", 4]];
        fx.seq(riff, { type: "sawtooth", vol: 0.07, beat: 0.2, filter: { freq: 1200 } });
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const jaeger = fx.put(A.S("0 0 120 180", '<path d="M40 10 H80 L84 40 H36 Z" fill="#6d7478" ' + A.ink + '/><rect x="46" y="18" width="28" height="8" fill="#3ab0ff"/><path d="M20 44 H100 L94 110 H26 Z" fill="#8a9aa8" ' + A.ink + '/><circle cx="60" cy="70" r="12" fill="#3ab0ff" style="filter:drop-shadow(0 0 6px #3ab0ff)"/><path d="M20 50 L0 110 M100 50 L120 110" stroke="#6d7478" stroke-width="16"/><path d="M34 110 L28 176 M86 110 L92 176" stroke="#6d7478" stroke-width="18"/>'),
          rr.x, H() + 100, { size: 150, h: 225 });
        for (let i = 0; i < 4; i++) fx.thud({ vol: 0.8, freq: 40, dur: 0.6, at: i * 0.5 });
        fx.buzz([100, 400, 100, 400, 100, 400, 100]);
        await fx.move(jaeger, [{ transform: "none" }, { transform: "translateY(-" + (H() * 0.6 + 100) + "px)" }], { duration: 2000, easing: "steps(4)" });
        fx.caption("(elbow rocket)", { style: "whisper", ms: 1200 });
        fx.noise(0.8, { freq: 2000, sweep: 400, vol: 0.4 });
        await fx.move(jaeger, [{ transform: "translateY(-" + (H() * 0.6 + 100) + "px)" }, { transform: "translateY(-" + (H() * 0.6 + 100) + "px) translateX(40px) rotate(8deg)" }, { transform: "translateY(-" + (H() * 0.6 + 100) + "px)" }], 500);
        boom(fx, rr.x + 60, rr.y, true);
        await fx.wait(1400);
      }
    },

    // Star Wars: The Force Awakens
    {
      id: 140607,
      y: 2015,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bb = fx.put(A.S("0 0 40 56", '<circle cx="20" cy="36" r="18" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="36" r="8" fill="none" stroke="#e8801a" stroke-width="3"/><path d="M6 14 C6 2 34 2 34 14 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="10" r="3" fill="#1d1a18"/><path d="M28 4 V-4" stroke="#1d1a18" stroke-width="1.5"/>'),
          -30, H() - 70, { size: 40, h: 56 });
        const beeps = [1800, 2400, 1600, 2800, 2000];
        beeps.forEach((f, i) => fx.tone(f, 0.08, { type: "sine", vol: 0.08, at: 0.2 + i * 0.12, slide: f * 1.2 }));
        await fx.move(bb, [{ transform: "none" }, { transform: "translateX(" + (r.x + 30) + "px)" }], { duration: 1600, easing: "ease-out" });
        fx.move(bb, [{ transform: "translateX(" + (r.x + 30) + "px)" }, { transform: "translateX(" + (r.x + 30) + "px) rotate(-20deg)" }, { transform: "translateX(" + (r.x + 30) + "px)" }], 500);
        await fx.wait(700);
        const saber = fx.put(lightsaber("#3a8aff"), r.x, r.y, { size: 8, h: 1, style: { transformOrigin: "50% 100%" } });
        fx.caption("(the saber flies to her hand)", { style: "whisper", ms: 1800 });
        fx.tone(90, 2, { type: "sawtooth", vol: 0.08, vibrato: [8, 3], filter: { freq: 400 } });
        fx.tone(92, 2, { type: "sawtooth", vol: 0.06, filter: { freq: 400 } });
        await fx.tween(400, (k) => { saber.style.height = k * 120 + "px"; saber.style.top = r.y - k * 120 + "px"; });
        fx.chord(["G4", "C5", "D5", "G5"], 2, { type: "sawtooth", vol: 0.04, filter: { freq: 2400 } });
        await fx.wait(2000);
      }
    },

    // Rogue One: A Star Wars Story
    {
      id: 330459,
      y: 2016,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const drive = fx.put(A.S("0 0 50 30", '<rect x="2" y="4" width="46" height="22" rx="2" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/><rect x="6" y="8" width="10" height="14" fill="#3aff8a"/>'), W() / 2, H() * 0.3, { size: 40, h: 24 });
        fx.caption("(the Death Star plans)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        fx.wash("rgba(0,0,0,.75)", 4200, { fade: 200 });
        const hands = [W() * 0.1, W() * 0.35, W() * 0.6];
        for (const x of hands) {
          fx.move(drive, [{ transform: "none" }, { transform: "translateX(" + (x - W() / 2 + 60) + "px)" }], { duration: 400, fill: "forwards" });
          await fx.wait(500);
        }
        const saber = fx.put(lightsaber("#ff2020"), W() * 0.1, H() * 0.5, { size: 8, h: 120 });
        fx.style(saber, { filter: "drop-shadow(0 0 20px #ff2020)" });
        fx.tone(70, 2, { type: "sawtooth", vol: 0.1, vibrato: [8, 3], filter: { freq: 300 } });
        fx.caption("(a red light in the dark corridor…)", { style: "whisper", ms: 1800, css: { color: "#fff" } });
        fx.seq([["G3", 2], ["G3", 2], ["G3", 2], ["Eb3", 1.5], ["Bb3", 0.5], ["G3", 2], ["Eb3", 1.5], ["Bb3", 0.5], ["G3", 4]], { type: "sawtooth", vol: 0.06, beat: 0.2, filter: { freq: 1400 } });
        await fx.move(drive, [{ transform: "translateX(" + (W() * 0.6 - W() / 2 + 60) + "px)" }, { transform: "translateX(" + (r.x - W() / 2) + "px) translateY(" + (r.y - H() * 0.3) + "px)" }], 900);
        fx.caption("Hope.", { style: "subtitle", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Star Wars: Episode I - The Phantom Menace
    {
      id: 1893,
      y: 1999,
      run: async (fx) => {
        fx.caption("(a podrace!)", { style: "whisper", ms: 1400 });
        const pod = A.S("0 0 140 40", '<rect x="4" y="10" width="40" height="20" rx="10" fill="#e8801a" ' + A.ink + ' stroke-width="2"/><rect x="50" y="10" width="40" height="20" rx="10" fill="#e8801a" ' + A.ink + ' stroke-width="2"/><path d="M44 20 H50 M90 20 L110 20" stroke="#3aff8a" stroke-width="2"/><path d="M110 12 H130 L136 20 L130 28 H110 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>');
        for (let i = 0; i < 3; i++) {
          const y = H() * (0.55 + i * 0.1);
          fx.later(i * 300, () => {
            fx.fly(pod, [-150, y], [W() + 150, y - 20], { size: 150, h: 42, dur: 1400, flip: true });
            fx.tone(300 + i * 80, 1.4, { type: "sawtooth", vol: 0.05, slide: 900 + i * 100, filter: { freq: 2000 }, pan: -1 });
          });
        }
        await fx.wait(2400);
        const duel = [["D4", 1], ["F4", 1], ["G4", 1], ["Bb4", 1], ["A4", 2], ["G4", 2], ["D5", 4]];
        fx.seq(duel, { type: "sawtooth", vol: 0.05, beat: 0.2, filter: { freq: 1800 } });
        fx.chord(["D3", "A3"], 2.4, { type: "sawtooth", vol: 0.04, filter: { freq: 500 } });
        const sr = fx.rect(fx.slot());
        const staff = fx.put('<div style="width:100%;height:100%;display:flex;flex-direction:column"><div style="flex:1;background:#fff;box-shadow:0 0 10px 4px #ff2020;border-radius:3px"></div><div style="height:16px;background:#1d1a18"></div><div style="flex:1;background:#fff;box-shadow:0 0 10px 4px #ff2020;border-radius:3px"></div></div>', sr.x, sr.y, { size: 8, h: 140 });
        fx.move(staff, [{ transform: "rotate(0)" }, { transform: "rotate(540deg)" }], { duration: 1800, easing: "ease-in-out" });
        fx.caption("(double-bladed)", { style: "whisper", ms: 1600 });
        await fx.wait(2200);
      }
    },

    // Star Trek II: The Wrath of Khan
    {
      id: 154,
      y: 1982,
      run: async (fx) => {
        fx.wash("rgba(10,10,40,.5)", 6400, { fade: 300 });
        fx.particles({ kind: "drift", count: 30, glyphs: dot("#fff"), min: 1, max: 3, dur: 3000 });
        const nebula = fx.wash("radial-gradient(circle at 60% 40%, rgba(255,80,160,.35), rgba(80,40,160,.3) 40%, transparent 70%)", 6400, { fade: 800 });
        void nebula;
        fx.caption("(the Mutara Nebula — shields useless, sensors blind)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        fx.caption("KHAAAAAN!", { style: "hand", ms: 2000 });
        fx.tone(220, 2, { type: "sawtooth", vol: 0.1, slide: 140, filter: { freq: 1400 }, vibrato: [6, 20] });
        if (!fx.reduced) fx.page([{ transform: "scale(1)" }, { transform: "scale(.9)" }, { transform: "scale(.75)" }, { transform: "scale(1)" }], { duration: 2000, easing: "ease-in-out" });
        await fx.wait(2200);
        fx.seq([["C5", 2], ["F5", 3], ["E5", 1], ["C5", 1], ["A4", 1], ["D5", 1], ["G5", 4]], { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 2400 } });
        await fx.wait(1400);
      }
    },

    // The Lord of the Rings: The Two Towers
    {
      id: 121,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(10,20,30,.45)", 7000, { fade: 300 });
        fx.caption("(Helm's Deep — five hundred against ten thousand)", { style: "whisper", ms: 2200 });
        fx.particles({ kind: "fall", count: 60, glyphs: '<div style="width:1px;height:100%;background:rgba(220,230,255,.8)"></div>', min: 12, max: 20, dur: 700, stagger: 3000 });
        for (let i = 0; i < 8; i++) fx.thud({ freq: 55, vol: 0.4, dur: 0.3, at: i * 0.35 });
        await fx.wait(2800);
        const sunrise = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff, #fff6c0 30%, rgba(255,246,192,0) 70%)"></div>', W() * 0.85, H() * 0.15, { size: 60 });
        fx.move(sunrise, [{ transform: "scale(.5)" }, { transform: "scale(12)" }], { duration: 1600, easing: "ease-in", fill: "forwards" });
        fx.caption("Look to my coming on the first light of the fifth day.", { style: "subtitle", ms: 2200 });
        fx.chord(["D4", "F#4", "A4", "D5"], 2.4, { type: "sawtooth", vol: 0.05, attack: 0.4, filter: { freq: 2400 } });
        fx.later(1000, () => {
          for (let i = 0; i < 8; i++) fx.fly(A.S("0 0 40 30", '<path d="M4 26 C8 14 22 10 30 14 L36 6 L38 14 C40 18 36 22 32 22 L34 30 M10 26 L8 30 M20 26 L20 30" fill="#f4f0e6" stroke="#1d1a18" stroke-width="1.5"/>'), [W() * 0.9, H() * 0.2 + i * 10], [W() * 0.1, H() * 0.8], { size: 34, h: 26, dur: 1200, flip: true });
        });
        await fx.wait(2600);
        void r;
      }
    },

    // Harry Potter and the Chamber of Secrets
    {
      id: 672,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const car = fx.put(A.car("#5a8ab0"), -100, H() * 0.25, { size: 110, h: 50 });
        fx.tone(200, 2, { type: "sawtooth", vol: 0.04, filter: { freq: 600 } });
        await fx.move(car, [{ transform: "none" }, { transform: "translateX(" + (W() + 200) + "px) translateY(-20px) rotate(-8deg)" }], { duration: 2000, easing: "linear" });
        fx.caption("(a flying Ford Anglia, over the train)", { style: "whisper", ms: 1800 });
        await fx.wait(600);
        const wall = fx.put('<div style="width:100%;height:100%;font:700 16px/1.2 Georgia,serif;color:#b3122a;text-align:center;display:flex;align-items:center;justify-content:center;background:rgba(200,190,170,.85);border:2px solid #6b4a2a">THE CHAMBER OF SECRETS HAS BEEN OPENED</div>', r.x, r.y, { size: Math.max(r.width * 1.4, 140), h: 60 });
        fx.anim(wall, [{ opacity: 0 }, { opacity: 1 }], 800);
        fx.noise(2, { type: "bandpass", freq: 300, q: 2, vol: 0.2 });
        fx.caption("(something is slithering in the pipes)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 4; i++) fx.noise(0.4, { type: "bandpass", freq: 2500, q: 6, vol: 0.12, at: 0.5 + i * 0.4, pan: -1 + i * 0.6 });
        await fx.wait(2400);
      }
    },

    // Kingsman: The Secret Service
    {
      id: 207703,
      y: 2014,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const umb = fx.put(A.S("0 0 20 120", '<path d="M10 0 V110 C10 118 2 118 2 110" stroke="#1d1a18" stroke-width="3" fill="none"/><path d="M4 10 L10 0 L16 10 V80 L10 90 L4 80 Z" fill="#1d1a18"/>'), r.x + r.width * 0.8, r.y, { size: 20, h: 120 });
        fx.caption("Manners… maketh… man.", { style: "subtitle", ms: 2200 });
        await fx.wait(2200);
        const door = fx.put(box("background:#6b4a2a;border:3px solid #1d1a18"), W() * 0.12, H() * 0.5, { size: 60, h: 120 });
        fx.click({ freq: 1800, vol: 0.5 });
        fx.tone(900, 0.2, { type: "sine", vol: 0.06 });
        fx.caption("(he locks the pub door)", { style: "whisper", ms: 1200 });
        void door;
        await fx.wait(1200);
        const open = fx.put(A.S("0 0 120 120", '<path d="M60 60 L10 10 C40 -4 80 -4 110 10 Z M60 60 L110 10 C124 40 124 80 110 110 Z M60 60 L110 110 C80 124 40 124 10 110 Z M60 60 L10 110 C-4 80 -4 40 10 10 Z" fill="#1d1a18"/>'), r.x + r.width * 0.8, r.y, { size: 90 });
        fx.move(open, [{ transform: "scale(.2)" }, { transform: "scale(1)" }], { duration: 250, easing: "cubic-bezier(.3,1.6,.5,1)" });
        fx.remove(umb);
        fx.noise(0.3, { type: "highpass", freq: 2000, vol: 0.4 });
        gun(fx, 5, 0.12);
        fx.caption("(the bulletproof umbrella)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Back to the Future Part III
    {
      id: 196,
      y: 1990,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(1.2)", 7000, { fade: 400 });
        const r = fx.rect(fx.slot());
        const loco = A.S("0 0 160 70", '<rect x="60" y="14" width="44" height="34" fill="#3b3530" ' + A.ink + '/><path d="M8 30 H64 V52 H8 Z" fill="#4a443c" ' + A.ink + '/><path d="M20 30 L14 6 H34 L28 30" fill="#3b3530" ' + A.ink + '/><circle cx="30" cy="58" r="10" fill="#b3402d" ' + A.ink + '/><circle cx="80" cy="56" r="12" fill="#b3402d" ' + A.ink + '/><path d="M104 30 H150 V52 H104 Z" fill="#9aa2a6" ' + A.ink + '/><circle cx="126" cy="58" r="8" fill="#1d1a18"/>');
        const cols = ["#3aff8a", "#ffcf5a", "#ff3030"];
        fx.caption("(logs: green, yellow, red)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 3; i++) {
          fx.later(i * 700, () => fx.put(A.S("0 0 40 16", '<rect x="2" y="2" width="36" height="12" rx="6" fill="' + cols[i] + '" ' + A.ink + ' stroke-width="1.5"/>'), W() * 0.3 + i * 30, H() - 60, { size: 30, h: 12, ms: 3000 }));
        }
        for (let t = 0; t < 4; t += 0.25) fx.noise(0.12, { freq: 600, vol: 0.25, at: t });
        fx.tone(200, 4, { type: "sawtooth", vol: 0.04, slide: 600 });
        const train = fx.fly(loco, [-160, H() - 80], [W() + 160, H() - 80], { size: 170, h: 74, dur: 4000, easing: "ease-in" });
        const speedo = fx.put('<div style="font:700 22px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff3030;background:#0b0907;padding:4px 8px;text-align:center">00 MPH</div>', W() / 2, H() * 0.3, { size: 110, h: 34 });
        for (let mph = 0; mph <= 88; mph += 8) { speedo.firstChild.textContent = String(mph).padStart(2, "0") + " MPH"; await fx.wait(330); }
        speedo.firstChild.textContent = "88 MPH";
        fx.flash("#bfe8ff", 200);
        fx.noise(0.5, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.thud({ vol: 0.5 });
        fx.put(A.S("0 0 200 20", '<path d="M0 6 H200 M0 14 H200" stroke="#ff7a1a" stroke-width="4"/>'), W() / 2, H() - 76, { size: W(), h: 20, ms: 1400 });
        await train;
        await fx.wait(800);
        void r;
      },
      maxMs: 12000
    },

    // Event Horizon
    {
      id: 8413,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const core = fx.put(A.S("0 0 120 120", '<circle cx="60" cy="60" r="54" fill="none" stroke="#6d7478" stroke-width="8"/><circle cx="60" cy="60" r="40" fill="none" stroke="#6d7478" stroke-width="6" stroke-dasharray="14 6"/><circle cx="60" cy="60" r="28" fill="none" stroke="#6d7478" stroke-width="6" stroke-dasharray="8 6"/><circle cx="60" cy="60" r="12" fill="#1a1a3a"/>'), W() / 2, H() * 0.4, { size: 160 });
        fx.move(core, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 3000, easing: "ease-in" });
        fx.tone(60, 4, { type: "sawtooth", vol: 0.06, slide: 240, filter: { freq: 600 } });
        await fx.wait(2800);
        fx.caption("Liberate tutemet ex inferis.", { style: "subtitle", ms: 2200 });
        fx.noise(1.6, { type: "bandpass", freq: 900, q: 1, vol: 0.2 });
        fx.tone(140, 1.6, { type: "sawtooth", vol: 0.06, filter: { type: "bandpass", freq: 600, q: 5 }, vibrato: [10, 40] });
        for (let i = 0; i < 5; i++) fx.later(i * 300, () => { fx.flash(i % 2 ? "#ff2020" : "#000", 120); });
        fx.buzz([60, 240, 60, 240, 60]);
        await fx.wait(2400);
        void r;
      }
    },

    // Moon
    {
      id: 17431,
      y: 2009,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(20,20,25,.45)", 7000, { fade: 400 });
        const gerty = fx.put(A.S("0 0 80 60", '<rect x="4" y="4" width="72" height="44" rx="6" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><rect class="scr" x="20" y="10" width="40" height="30" rx="3" fill="#f2d33b"/><circle cx="32" cy="22" r="3" fill="#1d1a18"/><circle cx="48" cy="22" r="3" fill="#1d1a18"/><path class="m" d="M30 30 Q40 36 50 30" stroke="#1d1a18" stroke-width="2.5" fill="none"/><path d="M40 48 V60" stroke="#6d7478" stroke-width="6"/>'), W() * 0.78, H() * 0.3, { size: 80, h: 60 });
        const mouth = gerty.querySelector(".m");
        fx.tone(700, 0.2, { type: "sine", vol: 0.05 });
        fx.caption("Hello, Sam.", { style: "subtitle", ms: 1600 });
        await fx.wait(1800);
        if (mouth) mouth.setAttribute("d", "M30 32 Q40 28 50 32");
        fx.caption("(the smiley turns into a frown)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
        fx.caption("(there's another Sam in the rover)", { style: "whisper", ms: 2000 });
        const clone = fx.slot() && fx.slot().querySelector("img");
        if (clone) fx.put('<img src="' + clone.src + '" style="width:100%;height:100%;object-fit:cover;opacity:.8;filter:grayscale(.4)">', r.x + r.width * 1.05, r.y, { size: r.width, h: r.height, ms: 2400 });
        fx.chord(["E4", "G4", "B4"], 2.4, { type: "triangle", vol: 0.04 });
        await fx.wait(2400);
      }
    }
  ]);
})();
