/* Machine FX cues - adventure, romance, prison and war favourites.
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
  const fedora = '<path d="M34 30 C34 12 86 12 86 30 Z" fill="#8a6a3a" stroke="#1f1b16" stroke-width="3"/><path d="M40 20 C52 16 68 16 80 20" stroke="#5a3a1a" stroke-width="4"/><path d="M24 32 C40 38 80 38 96 32 C80 26 40 26 24 32 Z" fill="#8a6a3a" stroke="#1f1b16" stroke-width="3"/>';
  const adventure = (fx, at) => fx.seq([["E4", 1], ["F4", 0.5], ["G4", 1], ["C5", 3], ["D4", 1], ["E4", 0.5], ["F4", 3.5], ["G4", 1], ["A4", 0.5], ["B4", 1], ["F5", 3]], { type: "sawtooth", vol: 0.05, beat: 0.2, at: at || 0, filter: { freq: 2200 } });
  const idol = A.S("0 0 40 50", '<path d="M20 4 C30 4 32 14 28 20 C34 24 34 36 30 44 H10 C6 36 6 24 12 20 C8 14 10 4 20 4 Z" fill="#e8b830" ' + A.ink + ' stroke-width="2"/><circle cx="16" cy="12" r="2" fill="#1d1a18"/><circle cx="24" cy="12" r="2" fill="#1d1a18"/><path d="M8 44 H32 V48 H8 Z" fill="#c99a20" ' + A.ink + ' stroke-width="1.5"/>');

  M.register([
    // Raiders of the Lost Ark
    {
      id: 85,
      y: 1981,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.costume(".reely", fedora, 6400);
        const gold = fx.put(idol, r.x, r.y, { size: 40, h: 50, style: { filter: "drop-shadow(0 0 10px #ffd84a)" } });
        fx.tone(1600, 0.8, { type: "sine", vol: 0.05, vibrato: [5, 20] });
        await fx.wait(900);
        const bag = A.S("0 0 40 40", '<path d="M8 14 C4 28 6 38 20 38 C34 38 36 28 32 14 Z" fill="#b8a888" ' + A.ink + ' stroke-width="2"/><path d="M10 14 H30 L26 6 H14 Z" fill="#8a7a62" ' + A.ink + ' stroke-width="2"/>');
        fx.remove(gold);
        fx.put(bag, r.x, r.y, { size: 34 });
        fx.click({ freq: 900, vol: 0.4 });
        fx.caption("(…a little heavy)", { style: "whisper", ms: 1000 });
        await fx.wait(900);
        fx.thud({ vol: 0.6, freq: 50, dur: 0.8 });
        fx.noise(4, { freq: 220, vol: 0.45, attack: 0.3 });
        fx.shake("sm", 3400);
        fx.buzz([80, 40, 80, 40, 80, 40, 80, 40, 200]);
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const size = Math.min(W(), H()) * 0.42;
        const boulder = fx.put(A.boulder, -size, rr.y, { size });
        fx.move(reely, [{ transform: "none" }, { transform: "translateX(" + (W() - rr.x + 80) + "px)" }], { duration: 2600, easing: "ease-in", delay: 250 });
        adventure(fx, 0.3);
        await fx.move(boulder, [{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + (W() + size * 2) + "px) rotate(900deg)" }], { duration: 3000, easing: "ease-in" });
        fx.caption("(he made it)", { style: "whisper", ms: 1200 });
        await fx.move(reely, [{ transform: "translateX(-" + (rr.x + 80) + "px)" }, { transform: "none" }], { duration: 700, easing: "ease-out" });
      }
    },

    // Indiana Jones and the Temple of Doom
    {
      id: 87,
      y: 1984,
      run: async (fx) => {
        fx.costume(".reely", fedora, 6400);
        const cave = fx.wash("radial-gradient(circle at 50% 60%, rgba(255,120,30,.25), rgba(30,10,0,.8))", 6400, { fade: 400 });
        void cave;
        const y = H() - 90;
        const track = fx.put(box("border-top:4px solid #6d7478;border-bottom:4px solid #6d7478;background:repeating-linear-gradient(90deg,#5a3a1a 0 8px,transparent 8px 22px)"), W() / 2, y + 30, { size: W() + 40, h: 12 });
        void track;
        const cart = A.S("0 0 90 60", '<path d="M6 10 H84 L74 44 H16 Z" fill="#6d665c" ' + A.ink + '/><circle cx="26" cy="50" r="8" fill="#1d1a18"/><circle cx="64" cy="50" r="8" fill="#1d1a18"/><path d="M30 10 C30 -4 46 -4 46 10 M52 10 C52 0 64 0 64 10" fill="#8a6a3a" stroke="#1f1b16" stroke-width="2"/>');
        fx.noise(3.4, { type: "bandpass", freq: 3000, q: 2, vol: 0.18, attack: 0.2 });
        for (let t = 0; t < 3.2; t += 0.14) fx.click({ freq: 1400, vol: 0.2, at: t });
        adventure(fx, 0.2);
        const c = fx.fly(cart, [-100, y], [W() + 100, y], { size: 90, h: 60, dur: 3000, via: [W() / 2, y - 70], r1: -8, easing: "ease-in-out" });
        fx.particles({ kind: "sweep", area: pt(W() / 2, y + 26, W(), 10), count: 30, glyphs: dot("#ffcf5a"), min: 2, max: 4, dur: 500, stagger: 2800 });
        await c;
        const stones = [0, 1, 2].map((i) => fx.put(A.S("0 0 30 40", '<path d="M15 2 C26 10 28 30 15 38 C2 30 4 10 15 2 Z" fill="#e8dcc0" ' + A.ink + ' stroke-width="2"/><path d="M15 10 V30 M9 18 H21" stroke="#8a6a3a" stroke-width="2"/>'), W() / 2 + (i - 1) * 50, H() * 0.4, { size: 34, h: 45 }));
        fx.chord(["D3", "Ab3", "D4"], 2.4, { type: "sawtooth", vol: 0.05, filter: { freq: 900 } });
        for (const s of stones) fx.style(s, { filter: "drop-shadow(0 0 10px #ff5a1a) sepia(1) saturate(4) hue-rotate(-30deg)" });
        fx.caption("(the Sankara stones are burning hot)", { style: "whisper", ms: 2000, css: { color: "#fff" } });
        await fx.wait(2200);
      }
    },

    // Indiana Jones and the Last Crusade
    {
      id: 89,
      y: 1989,
      run: async (fx) => {
        fx.costume(".reely", fedora, 9000);
        fx.wash("radial-gradient(circle at 50% 40%, rgba(255,230,160,.2), rgba(20,10,0,.75))", 9000, { fade: 400 });
        fx.caption("Choose wisely.", { style: "subtitle", ms: 2200 });
        const fancy = (c) => A.S("0 0 40 60", '<path d="M6 6 H34 C34 26 28 32 20 34 C12 32 6 26 6 6 Z" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><path d="M20 34 V50 M8 54 H32" ' + A.ink + '/><circle cx="14" cy="16" r="3" fill="#d51f2a"/><circle cx="26" cy="16" r="3" fill="#3a6ad8"/>');
        const plain = A.S("0 0 40 60", '<path d="M8 10 H32 C32 26 28 32 20 34 C12 32 8 26 8 10 Z" fill="#9a7a4a" ' + A.ink + ' stroke-width="2"/><path d="M20 34 V50 M10 54 H30" stroke="#6b4a2a" stroke-width="4"/>');
        const n = 5, right = 3;
        const cups = [];
        for (let i = 0; i < n; i++) {
          const x = W() / 2 + (i - (n - 1) / 2) * Math.min(64, W() / 6);
          cups.push(fx.put(i === right ? plain : fancy(["#e8b830", "#cfd4d6", "#e8b830", "", "#c9a24a"][i]), x, H() * 0.5, { size: 44, h: 66, cls: "fx-tap" }));
        }
        fx.chord(["D4", "F#4", "A4"], 2, { type: "sine", vol: 0.04, attack: 0.5 });
        let chosen = -1;
        fx.onNextTap((e) => {
          cups.forEach((c, i) => { const cr = fx.rect(c); if (Math.abs(e.clientX - cr.x) < 30 && Math.abs(e.clientY - cr.y) < 40) chosen = i; });
        }, 5000);
        for (let t = 0; t < 50 && chosen < 0; t++) await fx.wait(100);
        if (chosen < 0) chosen = right;
        const cup = cups[chosen];
        fx.move(cup, [{ transform: "none" }, { transform: "translateY(-20px) scale(1.2)" }], { duration: 500, fill: "forwards" });
        await fx.wait(600);
        if (chosen === right) {
          fx.style(cup, { filter: "drop-shadow(0 0 16px #fff6c0)" });
          fx.chord(["D5", "F#5", "A5", "D6"], 2, { type: "sine", vol: 0.07, attack: 0.3 });
          fx.particles({ kind: "burst", from: cup, count: 16, spread: 50, glyphs: A.sparkle("#fff6c0"), min: 8, max: 14, dur: 1200 });
          fx.caption("You have chosen… wisely.", { style: "subtitle", ms: 2200 });
        } else {
          fx.chord(["C3", "C#3", "G3"], 1.4, { type: "sawtooth", vol: 0.1, filter: { freq: 1200 } });
          fx.noise(1.2, { freq: 800, sweep: 200, vol: 0.3 });
          fx.move(cup, [{ transform: "translateY(-20px) scale(1.2)" }, { transform: "translateY(10px) scale(.2)", opacity: 0 }], { duration: 1200, fill: "forwards" });
          fx.particles({ kind: "fall", area: cup, count: 20, glyphs: dot("rgba(200,190,170,.8)"), min: 2, max: 5, dur: 1200 });
          fx.caption("He chose… poorly.", { style: "subtitle", ms: 2200 });
        }
        await fx.wait(2400);
      },
      maxMs: 14000
    },

    // Before Sunrise
    {
      id: 76,
      y: 1995,
      run: async (fx) => {
        const sky = fx.node("", { cls: "fx-filter", style: { background: "linear-gradient(#0d1a3a, #2a2a5a 60%, #5a3a5a)", mixBlendMode: "multiply", opacity: 0.7 } });
        fx.noise(7, { freq: 500, vol: 0.05, attack: 1 });
        const booth = fx.put(A.S("0 0 100 120", '<rect x="6" y="6" width="88" height="110" rx="4" fill="#6b4a2a" ' + A.ink + '/><rect x="16" y="16" width="68" height="60" fill="rgba(220,235,245,.4)" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="44" r="8" fill="#1d1a18"/><path d="M28 76 C28 60 44 60 44 76" fill="#1d1a18"/><circle cx="64" cy="44" r="8" fill="#6b3a1a"/><path d="M56 76 C56 60 72 60 72 76" fill="#6b3a1a"/><circle cx="50" cy="96" r="12" fill="#141414"/><circle cx="50" cy="96" r="3" fill="#d51f2a"/>'),
          W() / 2, H() * 0.42, { size: 130, h: 156 });
        void booth;
        const song = [["A4", 2], ["C5", 1], ["E5", 1], ["D5", 2], ["C5", 2], ["G4", 2], ["A4", 2], ["B4", 4]];
        fx.seq(song, { type: "triangle", vol: 0.06, beat: 0.35, filter: { freq: 1800 } });
        fx.noise(3, { type: "highpass", freq: 5000, vol: 0.03 });
        fx.caption("(they both look — just not at the same time)", { style: "whisper", ms: 2600, css: { color: "#fff" } });
        await fx.wait(3200);
        await fx.anim(sky, [{ background: "linear-gradient(#0d1a3a, #2a2a5a 60%, #5a3a5a)", opacity: 0.7 }, { background: "linear-gradient(#ffd8a0, #ffb070 60%, #ff8a6a)", opacity: 0.45 }], { duration: fx.reduced ? 10 : 2600, fill: "forwards" });
        fx.chord(["A3", "E4", "C#5"], 2.4, { type: "sine", vol: 0.05, attack: 0.8 });
        const sun = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff6c0,#ffb347 60%,rgba(255,179,71,0) 72%)"></div>', W() / 2, H() + 40, { size: 160 });
        fx.move(sun, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.2 + "px)" }], { duration: 1800, easing: "ease-out" });
        fx.caption("Vienna, 9:30 a.m. — six months from now?", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      },
      maxMs: 12000
    },

    // Jurassic Park
    {
      id: 329,
      y: 1993,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cup = fx.put(A.S("0 0 50 60", '<path d="M6 8 H44 L38 56 H12 Z" fill="rgba(220,240,255,.5)" ' + A.ink + ' stroke-width="2"/><path d="M8 20 H42 L39 50 H11 Z" fill="rgba(120,180,220,.55)"/><ellipse class="rip" cx="25" cy="20" rx="17" ry="3" fill="none" stroke="#fff" stroke-width="1.5" opacity="0"/>'),
          r.x, r.top + r.height + 30, { size: 44, h: 54 });
        const rip = cup.querySelector(".rip");
        fx.wash("rgba(10,20,15,.45)", 7000, { fade: 500 });
        fx.noise(7, { type: "highpass", freq: 3000, vol: 0.05, attack: 1 });
        for (let i = 0; i < 5; i++) {
          await fx.wait(i ? 900 : 700);
          fx.thud({ vol: 0.5 + i * 0.1, freq: 40, dur: 0.6 });
          fx.buzz(60 + i * 20);
          if (rip) fx.anim(rip, [{ opacity: 0.9, transform: "scale(.3)" }, { opacity: 0, transform: "scale(1.2)" }], { duration: 600 });
          fx.shake("sm", 300);
        }
        const eye = fx.put(A.S("0 0 120 60", '<path d="M4 30 C30 4 90 4 116 30 C90 56 30 56 4 30 Z" fill="#c8a040" ' + A.ink + ' stroke-width="3"/><ellipse class="p" cx="60" cy="30" rx="4" ry="22" fill="#1d1a18"/>'), W() / 2, H() * 0.3, { size: 160, h: 80 });
        fx.anim(eye, [{ opacity: 0 }, { opacity: 1 }], 500);
        const p = eye.querySelector(".p");
        if (p) fx.later(700, () => p.setAttribute("rx", 9));
        await fx.wait(1100);
        fx.tone(160, 1.6, { type: "sawtooth", vol: 0.14, slide: 70, filter: { freq: 900 }, vibrato: [12, 8] });
        fx.noise(1.6, { type: "bandpass", freq: 800, sweep: 300, q: 1, vol: 0.4 });
        fx.shake("lg", 900);
        fx.buzz([300]);
        await fx.wait(1300);
        fx.caption("Objects in mirror are closer than they appear.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // The Shawshank Redemption
    {
      id: 278,
      y: 1994,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        fx.filter("saturate(.6) sepia(.25)", 8000, { fade: 400 });
        const hammer = A.S("0 0 50 20", '<rect x="2" y="8" width="30" height="5" fill="#8a6a3a" ' + A.ink + ' stroke-width="1"/><path d="M30 4 H46 L48 10 L46 16 H30 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/>');
        for (let i = 0; i < 6; i++) { fx.click({ freq: 3200, vol: 0.3, at: i * 0.3 }); fx.noise(0.05, { type: "highpass", freq: 5000, vol: 0.2, at: i * 0.3 + 0.02 }); }
        fx.put(hammer, r.x + r.width * 0.3, r.top + r.height + 14, { size: 44, h: 18, ms: 2000 });
        fx.caption("(chip… chip… chip… for nineteen years)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        const hole = fx.put('<div style="width:100%;height:100%;border-radius:50% 50% 40% 40%;background:radial-gradient(#050505 55%, #3a2a1a)"></div>', r.x, r.y, { size: r.width * 0.75, h: r.height * 0.8 });
        void hole;
        A.liftSlot(fx, 7000);
        if (s) fx.style(s, { transformOrigin: "50% 0" }, 7000);
        await fx.move(s, [{ transform: "none" }, { transform: "rotate(38deg) translateX(" + r.width * 0.35 + "px)" }], { duration: 700, easing: "ease-out", fill: "forwards" });
        fx.tone(200, 0.6, { type: "sine", vol: 0.06, slide: 120 });
        fx.caption("(behind the poster)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        fx.wash("rgba(20,30,50,.5)", 3600, { fade: 300 });
        fx.particles({ kind: "fall", count: 90, glyphs: '<div style="width:1px;height:100%;background:rgba(220,230,255,.8)"></div>', min: 12, max: 22, dur: 700, stagger: 3000 });
        fx.noise(3.4, { type: "highpass", freq: 2500, vol: 0.2, attack: 0.3 });
        fx.thud({ vol: 0.4, freq: 60, dur: 1.2 });
        fx.flash("#fff", 160);
        const man = fx.put(A.S("0 0 80 60", '<circle cx="40" cy="10" r="7" fill="#e8e4da"/><path d="M34 18 H46 L44 58 H36 Z" fill="#e8e4da"/><path d="M34 22 L4 6 M46 22 L76 6" stroke="#e8e4da" stroke-width="5" stroke-linecap="round"/>'), W() / 2, H() * 0.66, { size: 100, h: 75 });
        fx.move(man, [{ transform: "translateY(10px)", opacity: 0 }, { transform: "none", opacity: 1 }], 600);
        fx.chord(["D4", "F#4", "A4", "D5"], 2.6, { type: "sine", vol: 0.06, attack: 0.8 });
        await fx.wait(2800);
      },
      maxMs: 13000
    },

    // 1917
    {
      id: 530915,
      y: 2019,
      run: async (fx) => {
        fx.filter("saturate(.55) sepia(.25) contrast(1.05)", 9000, { fade: 400 });
        fx.caption("(one continuous shot)", { style: "whisper", ms: 1800 });
        const trench = fx.put(box("background:linear-gradient(#5a4a32,#3a2e1e);border-top:6px solid #2a2014;box-shadow:inset 0 10px 18px rgba(0,0,0,.5)"), W() / 2, H() - 40, { size: W() * 3, h: 90 });
        const runner = fx.put(A.S("0 0 40 60", '<path d="M10 10 C10 2 30 2 30 10 H34 V12 H6 V10 Z" fill="#5a5a3a"/><circle cx="20" cy="16" r="6" fill="#e8c8a0"/><path d="M12 22 H28 L26 42 H14 Z" fill="#6a6040"/><path class="l1" d="M16 42 L10 58 M24 42 L30 58" stroke="#3a3020" stroke-width="4"/><path d="M28 26 L38 34" stroke="#3a3020" stroke-width="3"/>'), W() * 0.2, H() - 110, { size: 44, h: 66 });
        const pulse = [["D3", 1], [null, 1], ["D3", 1], [null, 1]];
        for (let i = 0; i < 5; i++) fx.seq(pulse, { type: "sine", vol: 0.12, beat: 0.35, at: i * 1.4 });
        fx.tone("D4", 7, { type: "sawtooth", vol: 0.025, filter: { freq: 700 }, attack: 2, slide: 330 });
        if (!fx.reduced) {
          fx.anim(trench, [{ transform: "translateX(0)" }, { transform: "translateX(-" + W() + "px)" }], { duration: 7000, easing: "linear" });
          fx.page([{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }, { transform: "translateY(2px)" }, { transform: "translateY(0)" }], { duration: 700, iterations: 10, fill: "none" });
          fx.anim(runner, [{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }, { transform: "translateY(0)" }], { duration: 350, iterations: 20 });
        }
        for (let i = 0; i < 4; i++) {
          fx.later(1200 + i * 1400, () => {
            fx.thud({ vol: 0.6, freq: 45, dur: 0.8 });
            fx.noise(0.5, { freq: 600, vol: 0.3 });
            fx.particles({ kind: "burst", from: pt(fx.rand(W() * 0.4, W()), H() - 60), count: 12, spread: 50, gravity: 60, glyphs: dot("rgba(90,70,50,.8)"), min: 4, max: 10, dur: 800, stagger: 0 });
            fx.buzz(40);
          });
        }
        fx.later(3800, () => {
          fx.wash("radial-gradient(circle at 50% 20%, rgba(255,210,120,.55), rgba(20,10,0,.7))", 2400, { fade: 400 });
          fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff,#ffcf5a 40%,transparent 70%)"></div>', W() * 0.6, H() * 0.18, { size: 50, ms: 2200 });
        });
        await fx.wait(7000);
        fx.caption("(the message got through)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      },
      maxMs: 12000
    }
  ]);
})();
