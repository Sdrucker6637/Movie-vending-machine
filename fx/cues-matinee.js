/* Machine FX cues - family matinee: animation, musicals and kids' favourites.
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
  const fairy = (fx, from, to, c) => {
    fx.particles({ kind: "burst", from, count: 14, spread: 40, glyphs: A.sparkle(c || "#fff6c0"), min: 6, max: 12, dur: 1000, stagger: 600 });
    return fx.fly('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff,' + (c || "#fff6c0") + ' 50%,transparent 72%)"></div>', [from.x, from.y], to, { size: 22, dur: 1400, via: [(from.x + to[0]) / 2, Math.min(from.y, to[1]) - 80] });
  };
  const castle = A.S("0 0 120 100", '<path d="M10 100 V50 H24 V36 L30 26 L36 36 V50 H48 V30 L60 6 L72 30 V50 H84 V36 L90 26 L96 36 V50 H110 V100 Z" fill="#e8e0f4" ' + A.ink + ' stroke-width="2"/><path d="M52 100 V76 C52 66 68 66 68 76 V100" fill="#6a5aa0"/>');

  M.register([
    // Home Alone
    {
      id: 771,
      y: 1990,
      run: async (fx) => {
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M38 60 C30 60 30 76 38 76 M82 60 C90 60 90 76 82 76" stroke="#f2c0a0" stroke-width="6" fill="none"/><ellipse cx="60" cy="70" rx="6" ry="8" fill="#1d1a18"/>', 3000);
        fx.caption("AAAAHHH!", { style: "hand", ms: 1400 });
        fx.tone(700, 1.2, { type: "sawtooth", vol: 0.08, slide: 1200, filter: { freq: 2400 }, vibrato: [8, 30] });
        fx.move(reely, [{ transform: "none" }, { transform: "scale(1.1)" }, { transform: "none" }], 1200);
        await fx.wait(1600);
        const traps = [
          A.S("0 0 40 40", '<path d="M20 36 L4 8 H36 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/>'),
          A.S("0 0 40 40", '<path d="M4 36 L20 4 L36 36 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M14 36 L20 20 L26 36" stroke="#1d1a18"/>'),
          A.S("0 0 40 40", '<rect x="8" y="6" width="24" height="30" rx="4" fill="#d9a13a" ' + A.ink + ' stroke-width="2"/><path d="M20 6 V0" stroke="#1d1a18" stroke-width="2"/>')
        ];
        const sounds = [() => fx.click({ freq: 5000, vol: 0.5 }), () => fx.tone(150, 0.4, { type: "sawtooth", vol: 0.1, slide: 60 }), () => fx.thud({ vol: 0.6 })];
        for (let i = 0; i < 6; i++) {
          const x = fx.rand(40, W() - 40), y = H() - fx.rand(40, 120);
          fx.put(traps[i % 3], x, y, { size: 30, ms: 2600 });
          sounds[i % 3]();
          fx.buzz(30);
          fx.caption(["(marbles)", "(tar)", "(paint cans)", "(the iron)", "(the blowtorch)", "(tarantula)"][i], { style: "whisper", ms: 400, css: { bottom: 12 + (i % 3) * 6 + "vh" } });
          await fx.wait(420);
        }
        fx.caption("Keep the change, ya filthy animal.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Home Alone 2: Lost in New York
    {
      id: 772,
      y: 1992,
      run: async (fx) => {
        fx.wash("rgba(20,30,60,.3)", 6400, { fade: 300 });
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 5, max: 9, dur: 4000, stagger: 5000 });
        const tree = fx.put(A.S("0 0 80 120", '<path d="M40 4 L70 50 H56 L76 86 H4 L24 50 H10 Z" fill="#2d6a3a" ' + A.ink + ' stroke-width="2"/><rect x="34" y="86" width="12" height="20" fill="#6b4a2a"/>' + Array.from({ length: 10 }, (_, i) => '<circle class="b" cx="' + (20 + (i * 17) % 44) + '" cy="' + (30 + i * 5) + '" r="3" fill="#ffd23b"/>').join("")), W() / 2, H() * 0.42, { size: 110, h: 165 });
        const bulbs = tree.querySelectorAll(".b");
        const cols = ["#ffd23b", "#ff3b3b", "#3bd1ff", "#7aff3b"];
        fx.seq([["G4", 1], ["E5", 1], ["D5", 1], ["C5", 1], ["G4", 3], [null, 1], ["G4", 1], ["E5", 1], ["D5", 1], ["C5", 1], ["A4", 4]], { type: "triangle", vol: 0.08, beat: 0.22 });
        for (let k = 0; k < 14; k++) {
          bulbs.forEach((b, i) => b.setAttribute("fill", cols[(i + k) % 4]));
          fx.click({ freq: 5000, vol: 0.06 });
          await fx.wait(260);
        }
        fx.caption("(Rockefeller Center — and a very expensive room service bill)", { style: "whisper", ms: 2000 });
        const bill = fx.put('<div style="font:700 14px/1 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fff;border:1px solid #999;padding:6px">ROOM SERVICE ... $967.00</div>', W() / 2, H() * 0.8, { size: 240, h: 28 });
        void bill;
        await fx.wait(2000);
      }
    },

    // Shrek 2
    {
      id: 809,
      y: 2004,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cat = fx.put(A.S("0 0 60 70", '<path d="M8 30 C8 12 52 12 52 30 C52 52 40 64 30 64 C20 64 8 52 8 30 Z" fill="#e8a13a" ' + A.ink + ' stroke-width="2"/><path d="M10 20 L6 4 L22 14 M50 20 L54 4 L38 14" fill="#e8a13a" ' + A.ink + ' stroke-width="2"/><ellipse class="e" cx="21" cy="34" rx="6" ry="6" fill="#1d1a18"/><ellipse class="e" cx="39" cy="34" rx="6" ry="6" fill="#1d1a18"/><circle cx="23" cy="32" r="2" fill="#fff"/><circle cx="41" cy="32" r="2" fill="#fff"/><path d="M4 12 C10 0 26 0 30 8 C34 0 50 0 56 12 L48 14 H12 Z" fill="#1d1a18"/>'),
          r.x, r.y, { size: 60, h: 70 });
        await fx.wait(600);
        const eyes = cat.querySelectorAll(".e");
        fx.tone(600, 1.6, { type: "sine", vol: 0.06, slide: 900, vibrato: [5, 10] });
        await fx.tween(fx.reduced ? 10 : 1500, (k) => eyes.forEach((e) => { e.setAttribute("rx", 6 + k * 4); e.setAttribute("ry", 6 + k * 5); }));
        fx.caption("(the eyes)", { style: "whisper", ms: 1600 });
        fx.particles({ kind: "burst", from: cat, count: 10, spread: 40, glyphs: A.heart("#ff7ab0"), min: 8, max: 14, dur: 1200 });
        await fx.wait(1600);
        fx.caption("(and then he coughs up a hairball)", { style: "whisper", ms: 1400 });
        fx.noise(0.4, { type: "bandpass", freq: 600, q: 2, vol: 0.4 });
        fx.move(cat, [{ transform: "none" }, { transform: "scale(1.1, .9)" }, { transform: "none" }], { duration: 200, iterations: 3 });
        await fx.wait(1400);
      }
    },

    // Toy Story 2
    {
      id: 863,
      y: 1999,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const road = fx.put(box("background:repeating-linear-gradient(90deg,#3b3530 0 30px,#f2d33b 30px 44px,#3b3530 44px 74px);border-top:3px solid #555;border-bottom:3px solid #555"), W() / 2, H() * 0.72, { size: W(), h: 40 });
        const cones = [];
        for (let i = 0; i < 5; i++) {
          const c = fx.put(A.S("0 0 30 40", '<path d="M15 2 L26 38 H4 Z" fill="#ff7a1a" ' + A.ink + ' stroke-width="2"/><path d="M9 20 H21 M7 28 H23" stroke="#fff" stroke-width="3"/>'), W() * 0.15 + i * W() * 0.17, H() * 0.72, { size: 26, h: 34 });
          cones.push(c);
        }
        fx.caption("(the toys, crossing the road under traffic cones)", { style: "whisper", ms: 2200 });
        for (let step = 0; step < 6; step++) {
          const car = step === 3;
          if (car) {
            fx.tone(900, 0.3, { type: "square", vol: 0.08 });
            fx.tone(700, 0.3, { type: "square", vol: 0.08, at: 0.3 });
            fx.fly(A.car("#3a6ad8"), [-100, H() * 0.72], [W() + 100, H() * 0.72], { size: 90, h: 40, dur: 800 });
          } else if (!fx.reduced) cones.forEach((c) => (c.style.transform = "translateY(" + ((step % 2) ? -8 : 0) + "px) translateX(" + step * 6 + "px)"));
          fx.noise(0.05, { type: "bandpass", freq: 900, q: 3, vol: 0.2 });
          await fx.wait(car ? 900 : 350);
        }
        fx.caption("To infinity…", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
        void road; void r;
      }
    },

    // Lilo & Stitch
    {
      id: 11544,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const others = fx.otherSlots(true);
        const stitch = fx.put(A.S("0 0 70 60", '<ellipse cx="35" cy="34" rx="22" ry="20" fill="#3a6ad8" ' + A.ink + ' stroke-width="2"/><path d="M14 26 L0 6 L22 20 M56 26 L70 6 L48 20" fill="#3a6ad8" ' + A.ink + ' stroke-width="2"/><ellipse cx="26" cy="30" rx="6" ry="7" fill="#1d1a18"/><ellipse cx="44" cy="30" rx="6" ry="7" fill="#1d1a18"/><ellipse cx="35" cy="40" rx="5" ry="3" fill="#1d2a5a"/><path d="M24 46 Q35 54 46 46" stroke="#1d1a18" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 60, h: 52 });
        fx.tone(900, 0.3, { type: "sawtooth", vol: 0.06, slide: 1400, filter: { freq: 2000 } });
        for (const o of others.slice(0, 5)) {
          const orr = fx.rect(o);
          await fx.move(stitch, [{ transform: "none" }, { transform: "translate(" + (orr.x - r.x) + "px," + (orr.y - r.y) + "px)" }], { duration: 250, fill: "forwards" });
          fx.move(o, [{ transform: "none" }, { transform: "rotate(" + fx.rand(-20, 20) + "deg) translateY(10px)" }], { duration: 200, fill: "forwards" });
          fx.noise(0.15, { freq: 1500, vol: 0.4 });
          fx.buzz(20);
          await fx.wait(120);
        }
        fx.caption("Ohana means family.", { style: "subtitle", ms: 2000 });
        fx.seq([["C5", 1], ["E5", 1], ["G5", 2], ["A5", 1], ["G5", 1], ["E5", 2]], { type: "triangle", vol: 0.08, beat: 0.22 });
        await fx.wait(2000);
      }
    },

    // Mulan
    {
      id: 10674,
      y: 1998,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const mushu = fx.put(A.S("0 0 60 40", '<path d="M6 26 C10 12 30 8 42 14 L54 8 L52 18 C58 22 54 30 46 30 L20 32 C12 32 6 30 6 26 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><circle cx="44" cy="16" r="2" fill="#f2d33b"/><path d="M20 12 L24 4 L28 12 M30 10 L34 2 L38 10" fill="#f2d33b"/>'), r.x + r.width * 0.6, r.top + 6, { size: 50, h: 34 });
        fx.move(mushu, [{ transform: "none" }, { transform: "translateY(-6px) rotate(-6deg)" }, { transform: "none" }], { duration: 500, iterations: 3 });
        fx.caption("(a tiny dragon on your shoulder)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const beat = 0.2;
        const drum = [1, 0, 1, 0, 1, 1, 0, 1];
        for (let i = 0; i < 16; i++) if (drum[i % 8]) fx.thud({ freq: 70, vol: 0.3, dur: 0.1, at: i * beat });
        fx.seq([["D4", 2], ["F4", 1], ["G4", 1], ["A4", 2], ["C5", 2], ["A4", 2], ["G4", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 1600 } });
        const reely = fx.$(".reely");
        fx.move(reely, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], { duration: beat * 4000, iterations: 3 });
        fx.caption("♪ Be a man ♪", { style: "hand", ms: 1600 });
        await fx.wait(2600);
        fx.particles({ kind: "fall", count: 20, glyphs: A.petal("#ffc0d8"), min: 8, max: 12, dur: 2000 });
        await fx.wait(1200);
      }
    },

    // Tarzan
    {
      id: 37135,
      y: 1999,
      run: async (fx) => {
        fx.wash("rgba(30,90,40,.3)", 6000, { fade: 400 });
        const vine = A.S("0 0 20 200", '<path d="M10 0 C4 60 16 120 10 200" stroke="#3a7a2a" stroke-width="4" fill="none"/><path d="M8 40 C0 36 0 44 6 46 M12 100 C20 96 20 104 14 106" fill="#5fa04a"/>');
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        fx.put(vine, rr.x, rr.y - 100, { size: 20, h: 200, style: { transformOrigin: "50% 0" } });
        fx.caption("(the yell)", { style: "whisper", ms: 1400 });
        const yell = [[330, 0], [660, 0.25], [330, 0.45], [660, 0.65], [440, 0.9]];
        yell.forEach(([f, t]) => fx.tone(f, 0.25, { type: "sawtooth", vol: 0.08, at: t, vibrato: [20, 40], filter: { freq: 2000 } }));
        await fx.move(reely, [{ transform: "none" }, { transform: "translateX(-" + W() * 0.2 + "px) rotate(-20deg)" }, { transform: "translateX(" + W() * 0.2 + "px) rotate(20deg)" }, { transform: "none" }], { duration: 2400, easing: "ease-in-out" });
        const beat = 0.18;
        for (let i = 0; i < 16; i++) fx.thud({ freq: i % 2 ? 150 : 90, vol: 0.2, dur: 0.08, at: i * beat });
        fx.caption("(the camp gets trashed to a beat)", { style: "whisper", ms: 1800 });
        const others = fx.otherSlots(true).slice(0, 8);
        others.forEach((o, i) => fx.move(o, [{ transform: "none" }, { transform: "translateY(-8px) rotate(" + (i % 2 ? 6 : -6) + "deg)" }, { transform: "none" }], { duration: beat * 2000, delay: i * 90, iterations: 3, fill: "none" }));
        await fx.wait(2600);
      }
    },

    // The Emperor's New Groove
    {
      id: 11688,
      y: 2000,
      run: async (fx) => {
        const lever = fx.put(A.S("0 0 40 80", '<rect x="16" y="20" width="8" height="56" fill="#6b4a2a"/><circle cx="20" cy="18" r="10" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/>'), W() - 50, H() * 0.4, { size: 40, h: 80, style: { transformOrigin: "50% 100%" } });
        fx.caption("Pull the lever, Kronk!", { style: "subtitle", ms: 1400 });
        await fx.wait(1500);
        await fx.move(lever, [{ transform: "none" }, { transform: "rotate(40deg)" }], { duration: 300, fill: "forwards" });
        fx.click({ freq: 1200, vol: 0.5 });
        fx.noise(0.5, { freq: 300, vol: 0.4 });
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const hole = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#0b0907"></div>', rr.x, rr.top + rr.height, { size: 80, h: 16 });
        fx.move(reely, [{ transform: "none" }, { transform: "translateY(200px)", opacity: 0 }], { duration: 500, easing: "ease-in" });
        fx.tone(900, 1, { type: "sine", vol: 0.08, slide: 200 });
        await fx.wait(1000);
        fx.caption("Wrong lever!", { style: "hand", ms: 1400 });
        await fx.wait(700);
        const llama = fx.put(A.S("0 0 50 70", '<path d="M14 66 V36 C8 30 10 20 16 18 L18 4 L22 16 L26 4 L28 18 C36 22 36 32 30 36 V66" fill="#e8dcc8" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="26" r="2" fill="#1d1a18"/><circle cx="28" cy="26" r="2" fill="#1d1a18"/>'), rr.x, rr.y, { size: 44, h: 62 });
        fx.move(llama, [{ transform: "translateY(60px)", opacity: 0 }, { transform: "none", opacity: 1 }], 400);
        fx.tone(500, 0.6, { type: "sawtooth", vol: 0.05, vibrato: [14, 40], filter: { freq: 1200 } });
        fx.caption("(no touchy!)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
        void hole;
      }
    },

    // Hercules
    {
      id: 11970,
      y: 1997,
      run: async (fx) => {
        const muses = [];
        for (let i = 0; i < 5; i++) {
          const m = fx.put(A.S("0 0 40 80", '<circle cx="20" cy="12" r="9" fill="#8a5a3a"/><path d="M20 6 C10 0 8 14 12 18 M20 6 C30 0 32 14 28 18" stroke="#1d1a18" stroke-width="3" fill="none"/><path d="M10 22 H30 L36 78 H4 Z" fill="' + ["#e0b34a", "#e8d8b0", "#d9a13a", "#f4e8c8", "#c9a24a"][i] + '" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2 + (i - 2) * 46, H() * 0.66, { size: 36, h: 72 });
          muses.push(m);
        }
        fx.wash("linear-gradient(#f4e0a0, #e8b860)", 6400, { blend: "multiply", opacity: 0.35, fade: 400 });
        const beat = 0.18;
        const gospel = [["C5", 1], ["E5", 1], ["G5", 2], ["A5", 1], ["G5", 1], ["E5", 2], ["F5", 1], ["E5", 1], ["D5", 2], ["C5", 4]];
        fx.seq(gospel, { type: "triangle", vol: 0.08, beat });
        fx.chord(["C4", "E4", "G4"], 3, { type: "sawtooth", vol: 0.03, filter: { freq: 1200 } });
        for (let i = 0; i < 16; i++) { if (i % 2) fx.click({ freq: 2600, vol: 0.3, at: i * beat }); }
        for (let k = 0; k < 8; k++) {
          muses.forEach((m, i) => { if (!fx.reduced) m.style.transform = "translateY(" + ((k + i) % 2 ? -8 : 0) + "px) rotate(" + ((k + i) % 2 ? -5 : 5) + "deg)"; });
          await fx.wait(beat * 2000);
        }
        fx.caption("(the Muses, gospel truth)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Snow White and the Seven Dwarfs
    {
      id: 408,
      y: 1937,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const mirror = fx.put(A.S("0 0 100 130", '<ellipse cx="50" cy="65" rx="46" ry="60" fill="#c9a24a" ' + A.ink + '/><ellipse cx="50" cy="65" rx="36" ry="50" fill="#1a2a3a"/><g class="face" opacity="0"><ellipse cx="50" cy="60" rx="18" ry="24" fill="rgba(200,240,255,.7)"/><ellipse cx="42" cy="54" rx="4" ry="2" fill="#1a2a3a"/><ellipse cx="58" cy="54" rx="4" ry="2" fill="#1a2a3a"/></g>'), W() / 2, H() * 0.38, { size: 120, h: 156 });
        fx.caption("Magic mirror, on the wall…", { style: "subtitle", ms: 2000 });
        fx.chord(["D3", "A3", "D4"], 3, { type: "sine", vol: 0.05, attack: 1 });
        await fx.wait(1800);
        const face = mirror.querySelector(".face");
        if (face) fx.anim(face, [{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: "forwards" });
        fx.noise(1.2, { type: "bandpass", freq: 700, q: 2, vol: 0.12 });
        await fx.wait(1000);
        fx.caption("(it points at your poster)", { style: "whisper", ms: 1600 });
        fx.style(fx.slot(), { boxShadow: "0 0 0 3px #bfe8ff, 0 0 24px #bfe8ff" }, 2400);
        const apple = fx.put(A.S("0 0 40 40", '<circle cx="20" cy="24" r="14" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M20 10 C20 4 24 2 26 2" stroke="#6b4a2a" stroke-width="2" fill="none"/><path d="M22 8 C28 4 34 8 30 12 C26 12 24 10 22 8 Z" fill="#3a7a2a"/>'), r.x, r.top + r.height + 20, { size: 30 });
        void apple;
        fx.seq([["G4", 1], ["C5", 1], ["E5", 1], ["G5", 3]], { type: "triangle", vol: 0.06, beat: 0.3 });
        await fx.wait(2200);
      }
    },

    // Pinocchio
    {
      id: 10895,
      y: 1940,
      run: async (fx) => {
        fx.costume(".reely", '<rect class="nose" x="58" y="58" width="6" height="4" rx="2" fill="#e8b08a" stroke="#1f1b16" stroke-width="1.5"/>', 7000);
        const nose = fx.$(".reely .nose");
        const lies = ["I'm a real boy.", "I didn't touch the machine.", "This poster was here already."];
        for (let i = 0; i < lies.length; i++) {
          fx.caption(lies[i], { style: "subtitle", ms: 1300 });
          await fx.wait(700);
          const target = 4 + (i + 1) * 14;
          const from = nose ? parseFloat(nose.getAttribute("width")) : 6;
          await fx.tween(fx.reduced ? 10 : 400, (k) => nose && nose.setAttribute("width", from + (target - from) * k));
          fx.tone(400 + i * 200, 0.3, { type: "sine", vol: 0.08, slide: 700 + i * 300 });
          if (i === 2) fx.put(A.S("0 0 30 30", '<path d="M15 28 C10 20 4 14 8 8 C12 4 16 8 15 12 C14 8 18 4 22 8 C26 14 20 20 15 28 Z" fill="#5fa04a"/><circle cx="12" cy="6" r="4" fill="#fff"/>'), fx.rect(fx.$(".reely")).x + 44, fx.rect(fx.$(".reely")).y - 6, { size: 18, ms: 1600 });
          await fx.wait(500);
        }
        fx.seq([["E5", 2], ["D5", 1], ["C5", 1], ["A4", 2], ["G4", 4]], { type: "sine", vol: 0.07, beat: 0.3 });
        await fx.wait(1400);
      }
    },

    // Fantasia
    {
      id: 756,
      y: 1940,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const hat = fx.costume(".reely", '<path d="M36 30 L60 -20 L84 30 Z" fill="#2d3b8a" stroke="#1f1b16" stroke-width="3"/><path d="M50 10 A4 4 0 1 0 54 6 M68 -2 L70 2 L74 2 L71 5 L72 9 L68 7 L64 9 L65 5 L62 2 L66 2 Z" fill="#f2d33b"/>', 6400);
        void hat;
        const broom = A.S("0 0 40 90", '<path d="M20 4 V50" stroke="#8a6a3a" stroke-width="4"/><path d="M10 50 H30 L36 86 H4 Z" fill="#d9b24a" ' + A.ink + ' stroke-width="1.5"/><path d="M8 30 H2 M32 30 H38" stroke="#8a6a3a" stroke-width="3"/><rect x="26" y="34" width="12" height="14" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/>');
        const brooms = [];
        const beat = 0.22;
        const march = [["F4", 1], ["A4", 1], ["C5", 1], ["A4", 1], ["F4", 1], ["A4", 1], ["C5", 2], ["D5", 1], ["C5", 1], ["Bb4", 1], ["A4", 1], ["G4", 4]];
        fx.seq(march.concat(march), { type: "square", vol: 0.04, beat, filter: { freq: 1400 } });
        fx.seq([["F2", 4], ["C3", 4], ["F2", 4], ["C3", 4], ["F2", 4], ["C3", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 400 } });
        for (let i = 0; i < 6; i++) {
          const b = fx.put(broom, -30, H() * 0.72, { size: 30, h: 68 });
          brooms.push(b);
          fx.move(b, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.2 + i * W() * 0.12) + "px)" }], { duration: 1200, delay: i * 250, fill: "forwards", easing: "steps(6)" });
        }
        await fx.wait(2600);
        const water = fx.node("", { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "0", background: "linear-gradient(rgba(80,150,220,.5), rgba(30,80,160,.7))" } });
        fx.particles({ kind: "fall", count: 30, glyphs: A.drop("#9cd6ff"), min: 5, max: 9, dur: 1200, stagger: 2400 });
        await fx.tween(2400, (k) => (water.style.height = k * 30 + "vh"));
        fx.caption("(the brooms won't stop)", { style: "whisper", ms: 1400 });
        await fx.wait(1200);
        void r;
      }
    },

    // Dumbo
    {
      id: 11360,
      y: 1941,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const feather = fx.put(A.feather, r.x, r.y, { size: 24, h: 60 });
        fx.caption("(hold the magic feather)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const eleph = A.S("0 0 80 70", '<ellipse cx="40" cy="42" rx="22" ry="18" fill="#b8c0c8" ' + A.ink + ' stroke-width="2"/><path d="M20 30 C-8 20 -8 60 18 50 Z M60 30 C88 20 88 60 62 50 Z" fill="#b8c0c8" ' + A.ink + ' stroke-width="2"/><path d="M40 52 C40 62 46 66 50 62" stroke="#1f1b16" stroke-width="3" fill="none"/><circle cx="34" cy="38" r="2" fill="#1d1a18"/><circle cx="46" cy="38" r="2" fill="#1d1a18"/><path d="M34 26 L40 16 L46 26" fill="#f2d33b"/>');
        const e = fx.put(eleph, r.x, H() - 60, { size: 80, h: 70 });
        await fx.move(e, [{ transform: "none" }, { transform: "translateY(-" + (H() * 0.5) + "px)" }], { duration: 1600, easing: "ease-out" });
        fx.move(e, [{ transform: "translateY(-" + H() * 0.5 + "px) rotate(-6deg)" }, { transform: "translateY(-" + (H() * 0.5 + 16) + "px) rotate(6deg)" }], { duration: 400, iterations: 5, direction: "alternate" });
        fx.fly(A.feather, [r.x, r.y], [r.x + 40, H() + 30], { size: 20, h: 50, dur: 2000, r2: 200 });
        fx.remove(feather);
        fx.caption("(he never needed it)", { style: "whisper", ms: 1800 });
        fx.seq([["C5", 2], ["E5", 1], ["G5", 1], ["C6", 4]], { type: "triangle", vol: 0.07, beat: 0.3 });
        await fx.wait(2200);
      }
    },

    // Bambi
    {
      id: 3170,
      y: 1942,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pond = fx.put(box("border-radius:50%;background:linear-gradient(#bfe0ff,#6aa0d0);border:2px solid #6b4a2a"), r.x, r.top + r.height + 40, { size: 140, h: 36 });
        void pond;
        fx.wash("linear-gradient(#e8f4ff, #bcd8ec)", 6000, { blend: "multiply", opacity: 0.35, fade: 400 });
        const fawn = A.S("0 0 60 60", '<ellipse cx="30" cy="36" rx="18" ry="11" fill="#c8804a" ' + A.ink + ' stroke-width="2"/><circle cx="46" cy="22" r="8" fill="#c8804a" ' + A.ink + ' stroke-width="2"/><circle cx="24" cy="32" r="2" fill="#fff"/><circle cx="32" cy="36" r="2" fill="#fff"/><path d="M18 46 L14 58 M24 46 L22 58 M36 46 L38 58 M42 46 L46 58" ' + A.ink + '/>');
        const b = fx.put(fawn, r.x - 40, r.top + r.height + 20, { size: 50 });
        fx.caption("(on the ice)", { style: "whisper", ms: 1400 });
        await fx.move(b, [{ transform: "none" }, { transform: "translateX(30px) rotate(-10deg)" }, { transform: "translateX(50px) rotate(14deg)" }, { transform: "translateX(70px) scale(1.2, .7)" }], { duration: 1600, easing: "ease-in-out" });
        fx.thud({ vol: 0.3, freq: 200 });
        fx.tone(700, 0.4, { type: "sine", vol: 0.06, slide: 300 });
        const bunny = fx.put(A.S("0 0 40 40", '<ellipse cx="20" cy="28" rx="12" ry="10" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M14 20 L10 4 L18 18 M24 18 L30 4 L28 20" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/>'), r.x + 60, r.top + r.height + 10, { size: 32 });
        for (let i = 0; i < 8; i++) { fx.thud({ freq: 300, vol: 0.2, dur: 0.05, at: i * 0.12 }); }
        fx.move(bunny, [{ transform: "none" }, { transform: "translateY(-4px)" }, { transform: "none" }], { duration: 120, iterations: 8 });
        fx.caption("(thump thump thump)", { style: "whisper", ms: 1400 });
        await fx.wait(2000);
      }
    },

    // Cinderella
    {
      id: 11224,
      y: 1950,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pump = fx.put(A.S("0 0 60 40", '<path d="M4 24 C6 10 20 8 30 14 C38 18 44 10 54 12 C58 16 56 26 50 30 H10 C4 30 4 28 4 24 Z" fill="rgba(200,240,255,.7)" stroke="#bfe8ff" stroke-width="2"/><path d="M12 30 V38" stroke="#bfe8ff" stroke-width="3"/>'), r.x, r.top + r.height + 20, { size: 50, h: 34 });
        A.sparkleOn(fx, pump, 12, "#bfe8ff");
        const clock = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="#f4efe2" ' + A.ink + ' stroke-width="4"/><path d="M50 50 V14" ' + A.ink + ' stroke-width="4"/><path class="m" d="M50 50 V20" ' + A.ink + ' stroke-width="3"/>'), W() - 60, 90, { size: 80 });
        const m = clock.querySelector(".m");
        for (let i = 0; i < 12; i++) {
          if (m) m.setAttribute("transform", "rotate(" + (i < 11 ? -10 + i : 0) + " 50 50)");
          fx.tone(392, 1, { type: "sine", vol: 0.1, at: 0, attack: 0.005 });
          fx.tone(784, 0.8, { type: "sine", vol: 0.04 });
          await fx.wait(320);
        }
        fx.caption("(midnight)", { style: "whisper", ms: 1400 });
        const coach = fx.put(A.S("0 0 80 70", '<ellipse cx="40" cy="32" rx="30" ry="26" fill="#e8801a" ' + A.ink + ' stroke-width="2"/><path d="M26 12 C30 6 36 4 40 6" stroke="#3a7a2a" stroke-width="3" fill="none"/><path d="M14 36 H66" stroke="#b85a0a" stroke-width="2"/>'), r.x, r.y, { size: 70, h: 60 });
        fx.move(coach, [{ transform: "scale(1.4)", opacity: 0 }, { transform: "none", opacity: 1 }], 500);
        fx.noise(0.5, { type: "highpass", freq: 3000, vol: 0.3 });
        await fx.wait(1600);
      }
    },

    // Peter Pan
    {
      id: 10693,
      y: 1953,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const shadow = fx.put(A.S("0 0 60 100", '<circle cx="30" cy="14" r="10" fill="rgba(0,0,0,.55)"/><path d="M18 26 H42 L46 70 H14 Z M18 70 L10 100 M42 70 L50 100 M18 30 L2 10 M42 30 L58 14" fill="rgba(0,0,0,.55)" stroke="rgba(0,0,0,.55)" stroke-width="6"/>'), rr.x + 30, rr.y + 20, { size: 50, h: 84 });
        fx.caption("(the shadow has other plans)", { style: "whisper", ms: 1800 });
        await fx.move(shadow, [{ transform: "none" }, { transform: "translate(" + (-rr.x * 0.7) + "px,-20px) rotate(-20deg)" }, { transform: "translate(" + (W() * 0.6 - rr.x) + "px,40px) rotate(20deg)" }, { transform: "translate(" + (W() + 60 - rr.x) + "px,-30px)" }], { duration: 2400, easing: "ease-in-out" });
        fairy(fx, pt(r.x, r.y), [W() * 0.8, H() * 0.15], "#fff6a0");
        fx.tone(1400, 1.4, { type: "sine", vol: 0.05, vibrato: [10, 40] });
        for (let i = 0; i < 6; i++) fx.tone(2000 + i * 300, 0.1, { type: "sine", vol: 0.04, at: i * 0.08 });
        fx.caption("(second star to the right)", { style: "whisper", ms: 1600 });
        fx.put(A.star("#fff6c0"), W() * 0.8, H() * 0.15, { size: 20, ms: 2000, style: { filter: "drop-shadow(0 0 6px #fff)" } });
        await fx.wait(2000);
      }
    },

    // Lady and the Tramp
    {
      id: 10340,
      y: 1955,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(40,20,40,.35)", 6400, { fade: 400 });
        const plate = fx.put(A.S("0 0 120 40", '<ellipse cx="60" cy="24" rx="56" ry="14" fill="#f4f2ec" ' + A.ink + ' stroke-width="2"/><path d="M30 20 C40 10 50 26 60 16 C70 8 80 24 90 18" stroke="#f2d33b" stroke-width="3" fill="none"/><circle cx="50" cy="18" r="5" fill="#8a3a1a"/><circle cx="70" cy="20" r="5" fill="#8a3a1a"/>'), W() / 2, H() * 0.66, { size: 150, h: 50 });
        void plate;
        const accordion = [["G4", 2], ["B4", 1], ["D5", 1], ["G5", 2], ["F#5", 1], ["E5", 1], ["D5", 4]];
        fx.seq(accordion, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1400 }, vibrato: [6, 6] });
        const strand = fx.put(A.S("0 0 200 20", '<path d="M0 10 C50 0 150 20 200 10" stroke="#f2d33b" stroke-width="3" fill="none"/>'), W() / 2, H() * 0.58, { size: 160, h: 16 });
        await fx.tween(fx.reduced ? 10 : 2200, (k) => { strand.style.transform = "scaleX(" + (1 - k * 0.95) + ")"; });
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.56), count: 10, spread: 30, glyphs: A.heart("#ff7ab0"), min: 10, max: 16, dur: 1400 });
        fx.caption("(one spaghetti strand, two dogs)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        void r;
      }
    },

    // Sleeping Beauty
    {
      id: 10882,
      y: 1959,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const wheel = fx.put(A.S("0 0 80 100", '<circle cx="40" cy="36" r="30" fill="none" stroke="#6b4a2a" stroke-width="4"/>' + Array.from({ length: 8 }, (_, i) => '<path d="M40 36 L' + (40 + Math.cos(i * Math.PI / 4) * 30) + ' ' + (36 + Math.sin(i * Math.PI / 4) * 30) + '" stroke="#6b4a2a" stroke-width="2"/>').join("") + '<path d="M40 66 V96 M20 96 H60" stroke="#6b4a2a" stroke-width="4"/><path d="M70 30 L76 10" stroke="#9aa2a6" stroke-width="2"/>'), r.x, r.top + r.height + 40, { size: 70, h: 88 });
        void wheel;
        fx.wash("rgba(20,40,20,.4)", 7000, { fade: 400 });
        fx.chord(["B3", "D4", "F4"], 3, { type: "sine", vol: 0.05, attack: 1 });
        fx.caption("(touch the spindle…)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#8aff6a,#2a8a1a 60%,transparent 72%)"></div>', r.x, r.y, { size: 60, ms: 1400 });
        fx.tone(200, 1.2, { type: "sine", vol: 0.08, slide: 100 });
        const others = fx.otherSlots(true);
        fx.style(others, { filter: "grayscale(.8) brightness(.6)" }, 4000);
        fx.caption("(the whole machine falls asleep)", { style: "whisper", ms: 2000 });
        fx.freeze(3600);
        const thorns = fx.node(A.S("0 0 400 300", Array.from({ length: 16 }, (_, i) => '<path d="M' + (i * 26) + ' 300 C' + (i * 26 + 40) + ' 200 ' + (i * 26 - 30) + ' 120 ' + (i * 26 + 10) + ' 60" stroke="#2a3a1a" stroke-width="4" fill="none"/><path d="M' + (i * 26 + 12) + ' 200 l8 -6 M' + (i * 26 - 4) + ' 140 l-8 -4" stroke="#2a3a1a" stroke-width="3"/>').join("")), { cls: "fx-filter", style: { opacity: 0 } });
        thorns.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(thorns.firstChild.style, { width: "100%", height: "100%" });
        await fx.anim(thorns, [{ opacity: 0, transform: "translateY(40%)" }, { opacity: 0.7, transform: "none" }], { duration: 2400, fill: "forwards" });
        await fx.wait(800);
      }
    },

    // One Hundred and One Dalmatians
    {
      id: 12230,
      y: 1961,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const spots = [];
        for (let i = 0; i < 101; i++) spots.push(fx.put(dot("#1d1a18"), fx.rand(r.left, r.left + r.width), fx.rand(r.top, r.top + r.height), { size: fx.rand(4, 10), style: { opacity: 0 } }));
        spots.forEach((s, i) => fx.anim(s, [{ opacity: 0 }, { opacity: 0.85 }], { duration: 100, delay: i * 18, fill: "forwards" }));
        for (let i = 0; i < 10; i++) fx.click({ freq: 3000 + i * 100, vol: 0.06, at: i * 0.18 });
        await fx.wait(2000);
        fx.caption("(ninety-nine… one hundred… one hundred and one)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        fx.costume(".reely", '<path d="M40 30 C40 10 60 4 60 4 C60 4 80 10 80 30" fill="#f4f2ec" stroke="#1f1b16" stroke-width="3"/><path d="M60 4 V30" stroke="#1d1a18" stroke-width="10"/>', 2400);
        fx.caption("(Cruella's hair)", { style: "whisper", ms: 1600 });
        fx.tone(160, 1.4, { type: "sawtooth", vol: 0.06, filter: { freq: 900 }, vibrato: [6, 10] });
        await fx.wait(2000);
      }
    },

    // The Jungle Book
    {
      id: 9325,
      y: 1967,
      run: async (fx) => {
        fx.wash("rgba(40,110,50,.3)", 6400, { fade: 400 });
        const baloo = fx.put(A.S("0 0 100 90", '<ellipse cx="50" cy="56" rx="36" ry="30" fill="#8a8a90" ' + A.ink + ' stroke-width="2"/><circle cx="50" cy="24" r="18" fill="#8a8a90" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="10" r="6" fill="#8a8a90" ' + A.ink + ' stroke-width="2"/><circle cx="64" cy="10" r="6" fill="#8a8a90" ' + A.ink + ' stroke-width="2"/><ellipse cx="50" cy="30" rx="8" ry="6" fill="#c8c8c8"/><circle cx="44" cy="20" r="2" fill="#1d1a18"/><circle cx="56" cy="20" r="2" fill="#1d1a18"/>'),
          W() / 2, H() * 0.62, { size: 110, h: 99, style: { transformOrigin: "50% 100%" } });
        const beat = 0.18;
        const swing = [["C5", 1], ["C5", 0.5], ["D5", 1], ["E5", 1.5], ["G5", 1], ["E5", 1], ["C5", 2], ["A4", 1], ["C5", 1], ["D5", 2]];
        fx.seq(swing.concat(swing), { type: "triangle", vol: 0.08, beat });
        fx.seq([["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["F3", 2], ["C4", 2], ["G3", 4]], { type: "sawtooth", vol: 0.04, beat, filter: { freq: 500 } });
        fx.caption("(the bare necessities: a good back scratch)", { style: "whisper", ms: 2200 });
        await fx.move(baloo, Array.from({ length: 12 }, (_, i) => ({ transform: "rotate(" + (i % 2 ? 6 : -6) + "deg) translateX(" + (i % 2 ? 6 : -6) + "px)" })), { duration: 3600 });
        const snake = fx.put(A.S("0 0 80 80", '<path d="M40 76 C10 70 10 50 40 46 C70 42 70 22 40 18" stroke="#6aa04a" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="14" rx="10" ry="7" fill="#6aa04a"/><circle class="i" cx="36" cy="12" r="3" fill="#ffd23b"/><circle class="i" cx="44" cy="12" r="3" fill="#ffd23b"/>'), W() * 0.2, H() * 0.3, { size: 70 });
        fx.caption("Trust in me…", { style: "whisper", ms: 1600 });
        fx.tone(440, 1.4, { type: "sine", vol: 0.06, vibrato: [3, 60] });
        fx.move(snake, [{ transform: "rotate(-5deg)" }, { transform: "rotate(5deg)" }], { duration: 700, iterations: 2, direction: "alternate" });
        await fx.wait(1600);
      }
    },

    // Robin Hood (1973)
    {
      id: 11886,
      y: 1973,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const target = fx.put(A.S("0 0 80 80", '<circle cx="40" cy="40" r="36" fill="#fff" ' + A.ink + ' stroke-width="2"/><circle cx="40" cy="40" r="26" fill="#d51f2a"/><circle cx="40" cy="40" r="16" fill="#fff"/><circle cx="40" cy="40" r="6" fill="#d51f2a"/>'), r.x, r.y, { size: 70 });
        void target;
        const whistle = [["G5", 1], ["E5", 0.5], ["D5", 0.5], ["C5", 2], ["D5", 1], ["E5", 1], ["G5", 2], ["A5", 1], ["G5", 1], ["E5", 2]];
        fx.seq(whistle, { type: "sine", vol: 0.1, beat: 0.25, vibrato: [5, 10] });
        await fx.wait(1400);
        const arrow = A.S("0 0 80 12", '<path d="M0 6 H70" stroke="#6b4a2a" stroke-width="3"/><path d="M70 0 L80 6 L70 12 Z" fill="#9aa2a6"/><path d="M0 0 L10 6 L0 12 M6 0 L14 6 L6 12" fill="#3a7a2a"/>');
        await fx.fly(arrow, [-60, r.y], [r.x - 20, r.y], { size: 60, h: 10, dur: 500, keep: true });
        fx.thud({ freq: 220, vol: 0.3, dur: 0.1 });
        await fx.wait(300);
        await fx.fly(arrow, [-60, r.y], [r.x - 30, r.y], { size: 60, h: 10, dur: 500, keep: true });
        fx.noise(0.2, { type: "highpass", freq: 3000, vol: 0.4 });
        fx.caption("(split the first arrow)", { style: "whisper", ms: 1600 });
        fx.chord(["C5", "E5", "G5"], 1, { type: "triangle", vol: 0.06 });
        await fx.wait(1800);
      }
    },

    // Big Hero 6
    {
      id: 177572,
      y: 2014,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bay = fx.put(A.S("0 0 90 110", '<ellipse cx="45" cy="70" rx="38" ry="38" fill="#fbfbf8" ' + A.ink + ' stroke-width="2"/><ellipse cx="45" cy="26" rx="22" ry="16" fill="#fbfbf8" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="26" r="3.5" fill="#1d1a18"/><circle cx="54" cy="26" r="3.5" fill="#1d1a18"/><path d="M36 26 H54" stroke="#1d1a18" stroke-width="2"/>'), r.x, H() + 60, { size: 90, h: 110 });
        fx.noise(1.2, { type: "lowpass", freq: 500, vol: 0.3 });
        await fx.move(bay, [{ transform: "scale(.2)" }, { transform: "translateY(-" + (H() + 60 - r.y) + "px) scale(1)" }], { duration: 1400, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "forwards" });
        fx.tone(700, 0.2, { type: "sine", vol: 0.06 });
        fx.caption("Hello. I am Baymax, your personal healthcare companion.", { style: "subtitle", ms: 2400, css: { fontSize: "14px" } });
        await fx.wait(2400);
        const scale = fx.put('<div style="font:700 14px/1 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fff;border:2px solid #1d1a18;padding:6px;text-align:center">PAIN LEVEL: 1 2 3 4 5 6 7 8 9 10</div>', W() / 2, H() * 0.3, { size: 280, h: 30 });
        void scale;
        fx.caption("On a scale of one to ten, how would you rate your pain?", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
        fx.caption("(fist bump — ba-la-la-la-la)", { style: "whisper", ms: 1400 });
        for (let i = 0; i < 5; i++) fx.tone(900 - i * 80, 0.12, { type: "sine", vol: 0.05, at: i * 0.1 });
        await fx.wait(1400);
      }
    },

    // Ice Age
    {
      id: 425,
      y: 2002,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const acorn = fx.put(A.S("0 0 30 36", '<ellipse cx="15" cy="22" rx="10" ry="12" fill="#b87a3a" ' + A.ink + ' stroke-width="2"/><path d="M4 16 C4 6 26 6 26 16 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M15 6 V0" stroke="#6b4a2a" stroke-width="3"/>'), r.x, r.top + 10, { size: 24, h: 30 });
        fx.wash("rgba(200,230,255,.3)", 6400, { fade: 300 });
        fx.caption("(the squirrel only wants the acorn)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        fx.sfx("crack", { vol: 0.5 });
        const crack = fx.put(A.S("0 0 300 300", '<path d="M150 0 L140 60 L170 110 L130 170 L160 230 L140 300" stroke="#fff" stroke-width="3" fill="none"/><path d="M140 60 L80 90 M170 110 L240 130 M130 170 L60 200 M160 230 L220 260" stroke="#fff" stroke-width="2" fill="none"/>'), r.x, r.y + 60, { size: 200, h: 200 });
        await fx.tween(fx.reduced ? 10 : 800, (k) => (crack.style.clipPath = "inset(0 0 " + (1 - k) * 100 + "% 0)"));
        fx.noise(1, { type: "highpass", freq: 2000, vol: 0.5 });
        fx.sfx("thunder", { vol: 0.8 });
        fx.shake("lg", 900);
        fx.buzz([200, 60, 200]);
        const halves = fx.$$("#grid .slot");
        halves.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateX(" + (fx.rect(s).x < W() / 2 ? -8 : 8) + "px)" }, { transform: "none" }], { duration: 900, delay: i * 20, fill: "none" }));
        fx.sfx("slide-whistle", { down: true, at: 150, vol: 0.9 });
        fx.move(acorn, [{ transform: "none" }, { transform: "translateY(" + H() + "px) rotate(720deg)" }], { duration: 1200, easing: "ease-in" });
        fx.caption("(…and the whole glacier cracks)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Chicken Run
    {
      id: 7443,
      y: 2000,
      run: async (fx) => {
        const fence = fx.put(box("background:repeating-linear-gradient(45deg, transparent 0 8px, #9aa2a6 8px 10px), repeating-linear-gradient(-45deg, transparent 0 8px, #9aa2a6 8px 10px)"), W() / 2, H() * 0.55, { size: W(), h: H() * 0.5 });
        fence.style.opacity = 0.6;
        const hen = A.S("0 0 50 50", '<ellipse cx="24" cy="30" rx="16" ry="13" fill="#e8d0a0" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="16" r="8" fill="#e8d0a0" ' + A.ink + ' stroke-width="2"/><path d="M42 14 L50 16 L42 19" fill="#e8a13a"/><path d="M34 8 L36 2 L40 8" fill="#d51f2a"/><path d="M10 26 C2 20 2 32 10 34" fill="#d8c090" stroke="#1f1b16" stroke-width="1.5"/>');
        fx.caption("(the Great Escape — with chickens)", { style: "whisper", ms: 1800 });
        const plane = A.S("0 0 160 70", '<rect x="30" y="30" width="100" height="20" rx="10" fill="#b8a888" ' + A.ink + ' stroke-width="2"/><path d="M40 30 L60 4 H100 L120 30 M40 50 L60 70 H100 L120 50" fill="#e8d8b0" ' + A.ink + ' stroke-width="2"/><circle cx="8" cy="40" r="10" fill="none" stroke="#6b4a2a" stroke-width="3"/>');
        for (let i = 0; i < 6; i++) fx.later(i * 150, () => fx.fly(hen, [fx.rand(20, W() - 20), H() - 30], [fx.rand(20, W() - 20), H() * 0.5], { size: 30, dur: 700, via: [W() / 2, H() * 0.4] }));
        for (let i = 0; i < 8; i++) fx.tone(fx.rand(800, 1400), 0.15, { type: "sawtooth", vol: 0.04, at: i * 0.15, filter: { freq: 2400 } });
        await fx.wait(1600);
        fx.seq([["C5", 1], ["F5", 1], ["A5", 2], ["G5", 1], ["F5", 1], ["C6", 4]], { type: "sawtooth", vol: 0.05, beat: 0.2, filter: { freq: 2000 } });
        for (let t = 0; t < 2.4; t += 0.08) fx.click({ freq: 1200, vol: 0.1, at: t });
        await fx.fly(plane, [-160, H() * 0.7], [W() + 160, H() * 0.15], { size: 170, h: 74, dur: 2600, via: [W() / 2, H() * 0.55], r0: -4, r2: -20 });
      }
    },

    // Fantastic Mr. Fox
    {
      id: 10315,
      y: 2009,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(220,130,40,.3)", 6400, { blend: "multiply", fade: 400 });
        const fox = fx.put(A.S("0 0 60 60", '<path d="M10 30 L4 6 L22 20 M50 30 L56 6 L38 20" fill="#d9702a" ' + A.ink + ' stroke-width="2"/><path d="M8 26 C8 14 52 14 52 26 C52 44 38 56 30 56 C22 56 8 44 8 26 Z" fill="#d9702a" ' + A.ink + ' stroke-width="2"/><path d="M18 40 C22 50 38 50 42 40 L30 56 Z" fill="#f4efe2"/><circle cx="22" cy="30" r="3" fill="#1d1a18"/><circle cx="38" cy="30" r="3" fill="#1d1a18"/>'),
          r.x, r.top + r.height + 30, { size: 50 });
        fx.caption("(whistle-click)", { style: "whisper", ms: 1200 });
        fx.tone(2400, 0.15, { type: "sine", vol: 0.1 });
        fx.click({ freq: 3000, vol: 0.5, at: 0.18 });
        await fx.wait(1000);
        const dirt = fx.particles({ kind: "burst", from: fox, count: 40, spread: 40, gravity: 80, glyphs: dot("#6b4a2a"), min: 3, max: 8, dur: 900, stagger: 1600 });
        for (let t = 0; t < 1.8; t += 0.1) fx.noise(0.08, { type: "bandpass", freq: 600, q: 2, vol: 0.2, at: t });
        await fx.move(fox, [{ transform: "none" }, { transform: "translateY(30px) scale(.6)", opacity: 0 }], { duration: 1400, easing: "steps(10)" });
        await dirt;
        fx.caption("(cussing!)", { style: "whisper", ms: 1400 });
        fx.put('<div style="font:900 18px/1 Georgia,serif;color:#1d1a18;white-space:nowrap">what the cuss?</div>', W() / 2, H() * 0.4, { size: 160, h: 24, ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Corpse Bride
    {
      id: 3933,
      y: 2005,
      run: async (fx) => {
        const grey = fx.filter("grayscale(.9) brightness(.9) hue-rotate(180deg)", 7000, { fade: 400 });
        fx.chord(["D4", "F4", "A4"], 2.4, { type: "sine", vol: 0.04, attack: 0.8 });
        fx.caption("(the land of the living is grey…)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        await fx.anim(grey, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" });
        fx.wash("linear-gradient(135deg, rgba(60,200,220,.35), rgba(160,60,220,.35))", 4000, { fade: 200 });
        const beat = 0.16;
        for (let i = 0; i < 16; i++) { fx.click({ freq: 1500 + (i % 4) * 200, vol: 0.3, at: i * beat }); if (i % 4 === 0) fx.thud({ freq: 80, vol: 0.3, dur: 0.1, at: i * beat }); }
        fx.seq([["E4", 1], ["G4", 1], ["B4", 1], ["E5", 1], ["D5", 1], ["B4", 1], ["G4", 2]], { type: "square", vol: 0.05, beat, filter: { freq: 2000 } });
        const skel = A.S("0 0 30 60", '<circle cx="15" cy="8" r="6" fill="#f4f2ec"/><path d="M15 14 V36 M6 20 H24 M15 36 L8 58 M15 36 L22 58 M15 20 L4 32 M15 20 L26 32" stroke="#f4f2ec" stroke-width="3" stroke-linecap="round"/>');
        fx.caption("(…the dead are having a party)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 5; i++) {
          const s = fx.put(skel, W() * (0.15 + i * 0.17), H() * 0.7, { size: 26, h: 52 });
          fx.move(s, [{ transform: "none" }, { transform: "translateY(-10px) rotate(10deg)" }, { transform: "none" }], { duration: beat * 2000, iterations: 7 });
        }
        fx.particles({ kind: "drift", count: 16, glyphs: A.moth, min: 14, max: 20, dur: 2400 });
        await fx.wait(2800);
      }
    },

    // Cloudy with a Chance of Meatballs
    {
      id: 22794,
      y: 2009,
      run: async (fx) => {
        const cloud = fx.put(A.S("0 0 160 70", '<path d="M20 60 C0 60 0 34 22 32 C24 12 56 6 66 24 C74 4 110 6 114 28 C140 22 156 40 144 56 C150 64 140 66 130 64 Z" fill="#e8ecf0" ' + A.ink + ' stroke-width="2"/>'), W() / 2, 60, { size: 200, h: 88 });
        void cloud;
        fx.caption("(forecast: food)", { style: "whisper", ms: 1600 });
        const food = [
          A.S("0 0 40 30", '<path d="M4 16 C4 4 36 4 36 16 Z" fill="#d9a13a"/><rect x="2" y="16" width="36" height="6" fill="#6b3a1a"/><path d="M4 22 H36 C36 28 4 28 4 22 Z" fill="#d9a13a"/>'),
          A.S("0 0 30 30", '<circle cx="15" cy="15" r="12" fill="#8a3a1a"/><circle cx="11" cy="11" r="3" fill="#b85a3a"/>'),
          A.S("0 0 40 30", '<path d="M4 6 H36 L30 26 H10 Z" fill="#f4e8c8"/><circle cx="20" cy="4" r="6" fill="#ff7ab0"/>'),
          A.S("0 0 40 20", '<ellipse cx="20" cy="10" rx="18" ry="8" fill="#f2c94c"/><ellipse cx="20" cy="10" rx="7" ry="5" fill="#f4a020"/>')
        ];
        fx.particles({ kind: "fall", count: 40, glyphs: food, min: 16, max: 30, dur: 2400, spin: 180, stagger: 3000 });
        for (let t = 0; t < 4; t += 0.15) fx.thud({ freq: fx.rand(120, 260), vol: 0.1, dur: 0.06, at: t });
        await fx.wait(2600);
        fx.caption("(the meatballs get bigger)", { style: "whisper", ms: 1400 });
        const big = fx.put(food[1], W() / 2, -80, { size: 140 });
        await fx.move(big, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.6 + 80) + "px)" }], { duration: 900, easing: "ease-in" });
        fx.thud({ vol: 1, freq: 40, dur: 0.8 });
        fx.shake("lg", 600);
        fx.buzz([150]);
        await fx.wait(1200);
      }
    },

    // Rango
    {
      id: 44896,
      y: 2011,
      run: async (fx) => {
        fx.wash("rgba(230,170,90,.35)", 6600, { blend: "multiply", fade: 300 });
        const box1 = fx.put(A.S("0 0 80 50", '<rect x="4" y="4" width="72" height="42" rx="3" fill="rgba(200,230,255,.35)" stroke="#cfe8ff" stroke-width="2"/><path d="M10 40 H70" stroke="#6b4a2a" stroke-width="2"/>'), W() / 2, -60, { size: 90, h: 56 });
        fx.noise(0.6, { freq: 2000, sweep: 400, vol: 0.2 });
        await fx.move(box1, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.66 + 60) + "px) rotate(20deg)" }], { duration: 900, easing: "cubic-bezier(.5,0,1,.6)" });
        fx.noise(0.5, { type: "highpass", freq: 3000, vol: 0.6 });
        fx.remove(box1);
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.66), count: 20, spread: 60, gravity: 60, glyphs: '<div style="width:100%;height:100%;background:linear-gradient(135deg,#fff,#9ab);clip-path:polygon(50% 0,100% 100%,0 70%)"></div>', min: 5, max: 12, dur: 900, stagger: 0 });
        fx.caption("(a pet lizard, out on the highway)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const owls = [0, 1, 2, 3].map((i) => fx.put(A.S("0 0 30 50", '<ellipse cx="15" cy="30" rx="12" ry="18" fill="#8a6a3a"/><circle cx="10" cy="20" r="4" fill="#fff"/><circle cx="20" cy="20" r="4" fill="#fff"/><path d="M4 14 H26 L22 6 H8 Z" fill="#1d1a18"/>'), W() * 0.2 + i * 40, H() * 0.28, { size: 26, h: 44 }));
        fx.seq([["E4", 1], ["G4", 1], ["B4", 1], ["C5", 2], ["B4", 1], ["G4", 1], ["E4", 3]], { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 1400 } });
        fx.caption("(the mariachi owls narrate his doom)", { style: "whisper", ms: 2000 });
        owls.forEach((o, i) => fx.move(o, [{ transform: "none" }, { transform: "translateY(-4px)" }, { transform: "none" }], { duration: 500, delay: i * 100, iterations: 4 }));
        await fx.wait(2200);
      }
    },

    // A Bug's Life
    {
      id: 9487,
      y: 1998,
      run: async (fx) => {
        const leaf = A.leaf("#6aa04a");
        const ants = [];
        for (let i = 0; i < 10; i++) {
          const a = fx.put(A.S("0 0 30 18", '<ellipse cx="6" cy="10" rx="5" ry="4" fill="#3a6ad8"/><ellipse cx="14" cy="10" rx="4" ry="3" fill="#3a6ad8"/><ellipse cx="23" cy="9" rx="6" ry="5" fill="#3a6ad8"/><path d="M12 12 L8 18 M14 12 L14 18 M16 12 L20 18" stroke="#1d2a5a"/>'), -20 - i * 30, H() - 50, { size: 26, h: 16 });
          fx.put(leaf, -20 - i * 30, H() - 64, { size: 18, parent: undefined });
          ants.push(a);
        }
        const lineUp = fx.$$("#fx-layer .fx-sprite");
        fx.move(lineUp, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.5) + "px)" }], { duration: 2400, easing: "linear" });
        fx.caption("(the line of ants, marching)", { style: "whisper", ms: 1600 });
        await fx.wait(1200);
        const leafDrop = fx.put(A.leaf("#b8d04a"), W() * 0.3, -20, { size: 30 });
        await fx.move(leafDrop, [{ transform: "none" }, { transform: "translateY(" + (H() - 40) + "px) rotate(120deg)" }], { duration: 800, easing: "ease-in" });
        fx.caption("Where is the line?!", { style: "subtitle", ms: 1400 });
        fx.freeze(1400);
        fx.tone(900, 0.5, { type: "sawtooth", vol: 0.06, slide: 1400, filter: { freq: 2000 } });
        await fx.wait(1400);
        fx.caption("(…around the leaf. Very carefully.)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        void ants;
      }
    },

    // Brave
    {
      id: 62177,
      y: 2012,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.costume(".reely", '<path d="M34 50 C20 30 28 6 44 8 C44 0 60 -4 66 4 C76 -4 96 6 90 20 C100 30 96 48 86 50 C88 36 80 30 76 30 C70 20 50 20 44 30 C38 30 32 36 34 50 Z" fill="#d9401a" stroke="#1f1b16" stroke-width="2"/>', 6400);
        const target = fx.put(A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#e8d8b0" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="30" r="16" fill="#d51f2a"/><circle cx="30" cy="30" r="6" fill="#f4f0e6"/>'), r.x, r.y, { size: 56 });
        void target;
        const arrow = A.S("0 0 80 12", '<path d="M0 6 H70" stroke="#6b4a2a" stroke-width="3"/><path d="M70 0 L80 6 L70 12 Z" fill="#9aa2a6"/>');
        const pipes = [["D5", 1], ["E5", 1], ["F#5", 2], ["A5", 1], ["F#5", 1], ["E5", 2]];
        fx.seq(pipes, { type: "sawtooth", vol: 0.05, beat: 0.2, filter: { type: "bandpass", freq: 1600, q: 2 }, vibrato: [6, 6] });
        for (let i = 0; i < 3; i++) {
          await fx.fly(arrow, [-60, r.y + (i - 1) * 4], [r.x - 20, r.y + (i - 1) * 4], { size: 60, h: 10, dur: 400, keep: true });
          fx.thud({ freq: 250, vol: 0.3, dur: 0.08 });
          await fx.wait(250);
        }
        fx.caption("(three bullseyes, three suitors defeated)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const bear = fx.put(A.S("0 0 80 70", '<ellipse cx="40" cy="44" rx="30" ry="22" fill="#4a3a2a"/><circle cx="40" cy="20" r="16" fill="#4a3a2a"/><circle cx="28" cy="8" r="6" fill="#4a3a2a"/><circle cx="52" cy="8" r="6" fill="#4a3a2a"/><path d="M30 24 C34 28 46 28 50 24" stroke="#1d1a18"/>'), W() * 0.8, H() * 0.72, { size: 70, h: 62 });
        fx.move(bear, [{ transform: "scale(.2)", opacity: 0 }, { transform: "none", opacity: 1 }], 500);
        fx.tone(90, 1, { type: "sawtooth", vol: 0.1, filter: { freq: 500 } });
        fx.caption("(Mum?)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // The Polar Express
    {
      id: 5255,
      y: 2004,
      run: async (fx) => {
        fx.wash("rgba(20,30,70,.45)", 7000, { fade: 400 });
        fx.particles({ kind: "fall", count: 50, glyphs: A.snowflake, min: 5, max: 9, dur: 4000, stagger: 5000 });
        const r = fx.rect(fx.slot());
        const ticket = fx.put('<div style="font:700 13px/1.2 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#f2d33b;border:2px solid #1d1a18;padding:6px;text-align:center">POLAR EXPRESS<br>ONE WAY</div>', r.x, r.y, { size: 120, h: 44 });
        const letters = ["B", "E", "L", "I", "E", "V", "E"];
        for (let i = 0; i < letters.length; i++) {
          fx.put('<div style="font:900 18px/1 Georgia,serif;color:#b3122a">' + letters[i] + "</div>", r.x - 48 + i * 16, r.y + 26, { size: 16, h: 18 });
          fx.click({ freq: 2400, vol: 0.4 });
          await fx.wait(180);
        }
        fx.caption("(punched by the conductor)", { style: "whisper", ms: 1600 });
        void ticket;
        await fx.wait(1400);
        const bell = fx.put(A.S("0 0 40 40", '<path d="M8 30 C8 12 32 12 32 30 L36 34 H4 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="36" r="3" fill="#8a6a1a"/><path d="M20 12 V4" stroke="#b3122a" stroke-width="3"/>'), W() / 2, H() * 0.3, { size: 44 });
        fx.move(bell, [{ transform: "rotate(-20deg)" }, { transform: "rotate(20deg)" }], { duration: 300, iterations: 6, direction: "alternate" });
        for (let i = 0; i < 6; i++) fx.tone(2093, 1.2, { type: "sine", vol: 0.06, at: i * 0.3 });
        fx.caption("(only believers can hear it)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
      }
    },

    // Night at the Museum
    {
      id: 1593,
      y: 2006,
      run: async (fx) => {
        fx.wash("rgba(10,15,40,.5)", 7000, { fade: 400 });
        const rex = fx.put(A.S("0 0 160 110", '<path d="M20 60 C30 40 60 30 90 34 L120 20 C140 16 152 26 150 36 L130 42 L150 48 C146 58 130 60 116 56 L100 60 L96 90 H88 L84 64 H56 L52 90 H44 L42 64 C30 64 20 70 4 84 C10 70 14 64 20 60 Z" fill="none" stroke="#f4f0e6" stroke-width="3"/><path d="M60 40 V60 M70 38 V60 M80 36 V60" stroke="#f4f0e6" stroke-width="2"/>'), W() / 2, H() * 0.55, { size: 200, h: 138 });
        fx.caption("(sunset — the exhibits wake up)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        fx.move(rex, [{ transform: "none" }, { transform: "rotate(-4deg) translateX(-10px)" }, { transform: "rotate(3deg) translateX(10px)" }, { transform: "none" }], { duration: 800, iterations: 2 });
        for (let i = 0; i < 4; i++) fx.click({ freq: 1400, vol: 0.4, at: i * 0.2 });
        fx.thud({ vol: 0.4, at: 0.8 });
        await fx.wait(1600);
        fx.caption("(it wants to play fetch — with its own bone)", { style: "whisper", ms: 2000 });
        const bone = A.S("0 0 60 20", '<path d="M10 10 H50" stroke="#f4f0e6" stroke-width="8"/><circle cx="8" cy="6" r="6" fill="#f4f0e6"/><circle cx="8" cy="14" r="6" fill="#f4f0e6"/><circle cx="52" cy="6" r="6" fill="#f4f0e6"/><circle cx="52" cy="14" r="6" fill="#f4f0e6"/>');
        await fx.fly(bone, [W() * 0.2, H() * 0.8], [W() * 0.9, H() * 0.3], { size: 50, h: 16, dur: 900, r2: 720, via: [W() * 0.5, H() * 0.1] });
        fx.move(rex, [{ transform: "none" }, { transform: "translateX(" + W() * 0.3 + "px)" }], 700);
        for (let i = 0; i < 6; i++) fx.thud({ vol: 0.3, freq: 120, dur: 0.1, at: i * 0.1 });
        await fx.wait(1200);
      }
    },

    // Enchanted
    {
      id: 4523,
      y: 2007,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const frame = fx.put(box("border:10px solid #e8c870;border-radius:50% 50% 8px 8px;background:radial-gradient(#fff6e0,#f4d8f0)"), W() / 2, H() * 0.45, { size: 180, h: 220 });
        fx.seq([["C5", 1], ["E5", 1], ["G5", 1], ["C6", 3]], { type: "sine", vol: 0.08, beat: 0.3 });
        await fx.wait(1000);
        fx.flash("#fff", 300);
        fx.remove(frame);
        fx.filter("saturate(.8) contrast(1.05)", 5000, { fade: 400 });
        fx.caption("(out of the storybook, into the real world)", { style: "whisper", ms: 1800 });
        await fx.wait(1200);
        const critters = [
          A.S("0 0 30 20", '<ellipse cx="14" cy="12" rx="10" ry="6" fill="#6d7478"/><circle cx="24" cy="8" r="4" fill="#6d7478"/><path d="M4 12 C0 10 0 16 4 16" stroke="#6d7478"/>'),
          A.S("0 0 30 20", '<path d="M15 14 C9 4 3 2 0 6 C6 8 10 12 13 16 C17 12 21 8 27 6 C24 2 18 4 15 14 Z" fill="#8a8a90"/>'),
          A.S("0 0 30 20", '<ellipse cx="12" cy="10" rx="8" ry="5" fill="#6b3a1a"/><path d="M4 10 L0 4 M4 10 L0 16 M20 10 L26 6 M20 10 L26 14" stroke="#6b3a1a"/>')
        ];
        fx.caption("♪ Happy working song ♪", { style: "hand", ms: 1800 });
        fx.seq([["G4", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 2]], { type: "triangle", vol: 0.07, beat: 0.2 });
        for (let i = 0; i < 12; i++) fx.later(i * 140, () => fx.fly(critters[i % 3], [fx.rand(0, W()), H() + 10], [r.x + fx.rand(-40, 40), r.y + fx.rand(-40, 40)], { size: 26, h: 18, dur: 900 }));
        await fx.wait(2400);
      }
    },

    // Mamma Mia!
    {
      id: 11631,
      y: 2008,
      run: async (fx) => {
        fx.wash("linear-gradient(#8fd0ff 0 60%, #3a8ad8 60%)", 6600, { blend: "multiply", opacity: 0.35, fade: 400 });
        const beat = 0.19;
        const disco = [["A4", 1], ["A4", 1], ["C5", 1], ["E5", 1], ["D5", 2], ["C5", 1], ["A4", 1], ["G4", 1], ["A4", 3]];
        fx.seq(disco.concat(disco), { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2400 } });
        for (let i = 0; i < 32; i++) { fx.thud({ freq: 70, vol: i % 2 ? 0 : 0.25, dur: 0.08, at: i * beat }); if (i % 2) fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.1, at: i * beat }); }
        const all = [fx.slot()].concat(fx.otherSlots(true));
        for (let k = 0; k < 14; k++) {
          const s = all[(k * 3) % all.length];
          fx.style(s, { transform: "rotate(" + (k % 2 ? 4 : -4) + "deg)", boxShadow: "0 0 0 3px " + ["#ff3bb0", "#3bd1ff", "#ffd23b", "#b33bff"][k % 4] }, 500);
          await fx.wait(beat * 2000);
        }
        fx.caption("(platform boots, spandex, one very old jetty)", { style: "whisper", ms: 1800 });
        await fx.wait(1000);
      }
    },

    // The Greatest Showman
    {
      id: 316029,
      y: 2017,
      run: async (fx) => {
        const tent = fx.node(A.S("0 0 400 300", '<path d="M0 300 L200 20 L400 300 Z" fill="none"/>' + Array.from({ length: 10 }, (_, i) => '<path d="M200 20 L' + (i * 40) + ' 300 L' + (i * 40 + 20) + ' 300 Z" fill="' + (i % 2 ? "rgba(213,31,42,.55)" : "rgba(244,240,230,.55)") + '"/>').join("")),
          { cls: "fx-filter", style: { opacity: 0 } });
        tent.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(tent.firstChild.style, { width: "100%", height: "100%" });
        fx.anim(tent, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
        const beat = 0.3;
        for (let i = 0; i < 16; i++) { fx.thud({ freq: 60, vol: i % 4 === 0 ? 0.5 : 0.2, dur: 0.14, at: i * beat }); if (i % 4 === 2) fx.noise(0.12, { type: "bandpass", freq: 1800, q: 1, vol: 0.3, at: i * beat }); }
        fx.buzz([40, 260, 40, 260, 40, 260, 40, 260, 40]);
        fx.seq([["D4", 2], ["F4", 1], ["A4", 1], ["D5", 4], ["C5", 2], ["A4", 2], ["D5", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 2000 } });
        const spot = fx.put('<div style="width:100%;height:100%;background:radial-gradient(ellipse at 50% 0, rgba(255,255,240,.7), transparent 70%);clip-path:polygon(40% 0,60% 0,100% 100%,0 100%)"></div>', W() / 2, H() * 0.4, { size: 180, h: H() * 0.8 });
        fx.move(spot, [{ transform: "rotate(-15deg)" }, { transform: "rotate(15deg)" }], { duration: 1200, iterations: 4, direction: "alternate" });
        fx.caption("♪ This is the greatest show ♪", { style: "hand", ms: 2200 });
        await fx.wait(4800);
      }
    },

    // Chicago
    {
      id: 1574,
      y: 2002,
      run: async (fx) => {
        fx.wash("rgba(20,10,20,.55)", 6600, { fade: 300 });
        const beat = 0.22;
        const jazz = [["D5", 1], ["F5", 1], ["Ab5", 1], ["C6", 1], ["B5", 2], ["G5", 2], ["F5", 1], ["D5", 3]];
        fx.seq(jazz, { type: "sawtooth", vol: 0.05, beat, filter: { type: "bandpass", freq: 1500, q: 1.5 } });
        for (let i = 0; i < 20; i++) fx.click({ freq: i % 2 ? 5000 : 2000, vol: 0.12, at: i * beat });
        fx.caption("(and all that jazz)", { style: "whisper", ms: 1600 });
        const cells = [];
        const n = 6;
        for (let i = 0; i < n; i++) {
          const c = fx.put(box("border-left:3px solid #9aa2a6;border-right:3px solid #9aa2a6;background:repeating-linear-gradient(90deg, transparent 0 10px, #9aa2a6 10px 12px)"), (i + 0.5) * W() / n, H() * 0.55, { size: W() / n - 6, h: 120 });
          cells.push(c);
        }
        await fx.wait(1400);
        fx.caption("Pop. Six. Squish. Uh-uh. Cicero. Lipschitz.", { style: "subtitle", ms: 2600 });
        for (let i = 0; i < n; i++) {
          fx.style(cells[i], { background: "radial-gradient(ellipse at 50% 0, rgba(255,40,40,.6), transparent 70%)" }, 2600);
          fx.thud({ freq: 90, vol: 0.3, dur: 0.12 });
          await fx.wait(380);
        }
        await fx.wait(1200);
      }
    },

    // Moulin Rouge!
    {
      id: 824,
      y: 2001,
      run: async (fx) => {
        fx.wash("radial-gradient(circle, rgba(255,40,80,.25), rgba(80,0,30,.55))", 6600, { fade: 300 });
        const mill = fx.put(A.S("0 0 120 140", '<rect x="44" y="60" width="32" height="76" fill="#b3122a" ' + A.ink + ' stroke-width="2"/><g class="sails" transform="rotate(0 60 50)"><path d="M60 50 L60 4 L70 6 L64 50 Z M60 50 L106 50 L104 60 L60 54 Z M60 50 L60 96 L50 94 L56 50 Z M60 50 L14 50 L16 40 L60 46 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/></g><circle cx="60" cy="50" r="5" fill="#ffd23b"/>'), W() * 0.8, H() * 0.36, { size: 100, h: 117 });
        const sails = mill.querySelector(".sails");
        const beat = 0.16;
        const can = [["G4", 1], ["C5", 1], ["D5", 1], ["F5", 1], ["E5", 1], ["D5", 1], ["G5", 2], ["G5", 1], ["G5", 1], ["A5", 1], ["E5", 1], ["F5", 1], ["D5", 1], ["G5", 2]];
        fx.seq(can.concat(can), { type: "square", vol: 0.05, beat, filter: { freq: 2600 } });
        const legs = [];
        for (let i = 0; i < 6; i++) legs.push(fx.put(A.S("0 0 20 60", '<path d="M6 0 C2 20 6 40 8 56 H16 C14 40 18 20 14 0 Z" fill="#f2d6c0" ' + A.ink + ' stroke-width="1.5"/><path d="M0 0 C6 10 14 10 20 0" fill="#ff3b7a"/>'), W() * 0.1 + i * 26, H() * 0.7, { size: 18, h: 54, style: { transformOrigin: "50% 0" } }));
        for (let k = 0; k < 16; k++) {
          if (sails) sails.setAttribute("transform", "rotate(" + k * 22 + " 60 50)");
          legs.forEach((l, i) => { if (!fx.reduced) l.style.transform = "rotate(" + (((k + i) % 2) ? -60 : 0) + "deg)"; });
          await fx.wait(beat * 2000);
        }
        fx.caption("(the can-can)", { style: "whisper", ms: 1200 });
        await fx.wait(600);
      }
    },

    // Les Misérables
    {
      id: 82695,
      y: 2012,
      run: async (fx) => {
        fx.filter("saturate(.6) sepia(.25)", 7000, { fade: 400 });
        const barricade = fx.put(A.S("0 0 300 100", '<path d="M0 100 L20 60 L60 70 L80 30 L130 50 L150 20 L200 46 L230 36 L270 60 L300 50 V100 Z" fill="#4a3a2a"/><path d="M60 70 L50 90 M150 20 L170 60 M230 36 L220 70" stroke="#6b4a2a" stroke-width="5"/>'), W() / 2, H() * 0.78, { size: W(), h: H() * 0.26 });
        void barricade;
        const flag = fx.put(A.S("0 0 60 60", '<path d="M4 2 V58" stroke="#1d1a18" stroke-width="3"/><path d="M6 4 C20 0 30 10 56 4 V26 C30 32 20 22 6 26 Z" fill="#d51f2a"/>'), W() / 2 + 20, H() * 0.58, { size: 60 });
        fx.move(flag, [{ transform: "skewY(0)" }, { transform: "skewY(-4deg)" }, { transform: "skewY(3deg)" }, { transform: "skewY(0)" }], { duration: 1200, iterations: 5 });
        const beat = 0.3;
        for (let i = 0; i < 16; i++) fx.thud({ freq: 70, vol: 0.3, dur: 0.12, at: i * beat });
        fx.seq([["G4", 2], ["G4", 1], ["A4", 1], ["B4", 2], ["G4", 2], ["D5", 3], ["C5", 1], ["B4", 4]], { type: "sawtooth", vol: 0.05, beat, filter: { freq: 1800 } });
        fx.caption("♪ Do you hear the people sing? ♪", { style: "hand", ms: 2400 });
        await fx.wait(2600);
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: beat * 2000, delay: i * 40, iterations: 3, fill: "none" }));
        await fx.wait(2400);
      }
    },

    // The Dark Crystal
    {
      id: 11639,
      y: 1982,
      run: async (fx) => {
        fx.wash("radial-gradient(circle at 50% 40%, rgba(140,80,200,.25), rgba(20,10,30,.7))", 7000, { fade: 400 });
        const crystal = fx.put(A.S("0 0 60 120", '<path d="M30 2 L50 40 L40 116 H20 L10 40 Z" fill="rgba(80,40,120,.85)" stroke="#b08ae0" stroke-width="2"/><path class="gap" d="M28 30 L34 40 L30 52 Z" fill="#0b0907"/>'), W() / 2, H() * 0.38, { size: 70, h: 140 });
        fx.chord(["C3", "F#3", "B3"], 3, { type: "sawtooth", vol: 0.04, filter: { freq: 700 } });
        fx.caption("(one shard is missing)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        const r = fx.rect(fx.slot());
        const shard = A.S("0 0 12 24", '<path d="M6 0 L12 12 L6 24 L0 12 Z" fill="#e0c8ff" style="filter:drop-shadow(0 0 4px #fff)"/>');
        await fx.fly(shard, [r.x, r.y], [W() / 2 + 2, H() * 0.38 - 18], { size: 10, h: 20, dur: 1200, via: [r.x, H() * 0.2] });
        const gap = crystal.querySelector(".gap");
        if (gap) gap.setAttribute("fill", "#e0c8ff");
        fx.flash("#fff6e0", 400);
        crystal.firstChild.querySelector("path").setAttribute("fill", "rgba(220,240,255,.95)");
        fx.style(crystal, { filter: "drop-shadow(0 0 20px #fff)" });
        fx.chord(["C4", "E4", "G4", "C5", "E5"], 2.4, { type: "sine", vol: 0.07, attack: 0.3 });
        fx.caption("(healed)", { style: "whisper", ms: 1600 });
        await fx.wait(2200);
      }
    },

    // The Land Before Time
    {
      id: 12144,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("linear-gradient(#f0c080, #c8804a)", 7000, { blend: "multiply", opacity: 0.3, fade: 500 });
        const tree = fx.put(A.S("0 0 60 100", '<path d="M30 100 V50" stroke="#6b4a2a" stroke-width="8"/><circle cx="30" cy="36" r="26" fill="#6aa04a" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 6 }, (_, i) => '<path d="M' + (16 + i * 6) + ' 30 C' + (14 + i * 6) + ' 22 ' + (20 + i * 6) + ' 20 ' + (22 + i * 6) + ' 28" fill="#9ad06a"/>').join("")), W() * 0.8, H() * 0.55, { size: 60, h: 100 });
        void tree;
        const dinos = [
          A.S("0 0 50 40", '<path d="M4 30 C6 18 24 14 34 18 L40 6 C44 2 48 6 46 12 L40 24 C42 30 38 34 32 34 H10 C6 34 4 32 4 30 Z" fill="#8a6a4a" ' + A.ink + ' stroke-width="1.5"/>'),
          A.S("0 0 40 30", '<path d="M4 20 C6 10 20 8 30 12 C36 14 38 20 34 24 H8 C4 24 4 22 4 20 Z" fill="#e8a13a" ' + A.ink + ' stroke-width="1.5"/><path d="M28 12 L32 4 L34 12" fill="#e8a13a"/>'),
          A.S("0 0 40 30", '<path d="M4 22 C4 12 20 8 30 14 L38 10 L36 18 C38 24 34 26 28 26 H8 Z" fill="#6aa0d0" ' + A.ink + ' stroke-width="1.5"/>')
        ];
        for (let i = 0; i < 3; i++) fx.later(i * 500, () => fx.fly(dinos[i], [-50, H() * 0.7 + i * 12], [W() * 0.7, H() * 0.66 + i * 12], { size: 40 - i * 4, h: 32 - i * 3, dur: 3600, easing: "steps(24)", keep: true }));
        fx.seq([["E5", 2], ["G5", 1], ["A5", 1], ["C6", 3], ["B5", 1], ["A5", 2], ["G5", 2], ["E5", 4]], { type: "sine", vol: 0.08, beat: 0.35 });
        fx.caption("(following the bright circle, to the Great Valley)", { style: "whisper", ms: 2400 });
        await fx.wait(4400);
        fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff6c0,#ffb347 60%,transparent 72%)"></div>', W() * 0.85, H() * 0.2, { size: 70, ms: 1600 });
        await fx.wait(1400);
        void r;
      }
    },

    // An American Tail
    {
      id: 4978,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(20,30,60,.4)", 7000, { fade: 400 });
        const mouse = fx.put(A.S("0 0 40 40", '<circle cx="12" cy="10" r="8" fill="#b8a888" ' + A.ink + ' stroke-width="1.5"/><circle cx="28" cy="10" r="8" fill="#b8a888" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="20" cy="24" rx="12" ry="12" fill="#b8a888" ' + A.ink + ' stroke-width="1.5"/><path d="M10 14 C10 4 30 4 30 14" fill="#3a6ad8"/><circle cx="16" cy="22" r="2" fill="#1d1a18"/><circle cx="24" cy="22" r="2" fill="#1d1a18"/>'), r.x, r.top + r.height + 20, { size: 34 });
        void mouse;
        const moon = fx.put(A.moon, W() * 0.8, H() * 0.18, { size: 80 });
        void moon;
        const tune = [["C5", 2], ["E5", 1], ["G5", 1], ["A5", 2], ["G5", 2], ["E5", 1], ["D5", 1], ["C5", 2], ["A4", 4]];
        fx.seq(tune, { type: "sine", vol: 0.1, beat: 0.35, vibrato: [4, 5] });
        fx.caption("♪ Somewhere out there… ♪", { style: "hand", ms: 2400 });
        await fx.wait(2600);
        fx.caption("(…beneath the pale moonlight)", { style: "whisper", ms: 2000 });
        const other = fx.pick(fx.otherSlots(true));
        if (other) {
          const or_ = fx.rect(other);
          fx.put(A.S("0 0 40 40", '<circle cx="12" cy="10" r="8" fill="#b8a888"/><circle cx="28" cy="10" r="8" fill="#b8a888"/><ellipse cx="20" cy="24" rx="12" ry="12" fill="#b8a888"/>'), or_.x, or_.top - 8, { size: 26, ms: 2400 });
        }
        await fx.wait(2600);
      }
    },

    // The Great Mouse Detective
    {
      id: 9994,
      y: 1986,
      run: async (fx) => {
        fx.wash("rgba(30,30,40,.4)", 7000, { fade: 400 });
        const gears = [];
        for (let i = 0; i < 3; i++) {
          const g = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="34" fill="none" stroke="#c9a24a" stroke-width="8"/>' + Array.from({ length: 12 }, (_, k) => '<rect x="46" y="6" width="8" height="12" fill="#c9a24a" transform="rotate(' + k * 30 + ' 50 50)"/>').join("")), W() * (0.25 + i * 0.25), H() * (0.3 + (i % 2) * 0.15), { size: 90 + i * 20 });
          gears.push(g);
          fx.move(g, [{ transform: "rotate(0)" }, { transform: "rotate(" + (i % 2 ? -360 : 360) + "deg)" }], { duration: 3000 + i * 400, iterations: 2 });
        }
        for (let t = 0; t < 5; t += 0.3) fx.click({ freq: 1400, vol: 0.2, at: t });
        fx.caption("(the fight inside Big Ben)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        const cap = fx.costume(".reely", '<path d="M36 34 C36 16 84 16 84 34 Z" fill="#8a6a3a" stroke="#1f1b16" stroke-width="3"/><path d="M40 22 L80 30 M44 30 L78 20" stroke="#6b4a2a" stroke-width="2"/><path d="M84 30 L96 38" stroke="#8a6a3a" stroke-width="4"/>', 3000);
        void cap;
        for (let i = 0; i < 4; i++) fx.tone(392, 1, { type: "sine", vol: 0.08, at: i * 0.6 });
        fx.caption("Elementary.", { style: "subtitle", ms: 1600 });
        await fx.wait(2400);
      }
    },

    // Anastasia
    {
      id: 9444,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const musicbox = fx.put(A.S("0 0 70 60", '<rect x="6" y="24" width="58" height="32" rx="4" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><path class="lid" d="M4 24 H66 V16 H4 Z" fill="#e0c060" ' + A.ink + ' stroke-width="2"/><circle cx="35" cy="40" r="6" fill="#bfe8ff"/>'), r.x, r.top + r.height + 30, { size: 70, h: 60 });
        await fx.wait(500);
        const lid = musicbox.querySelector(".lid");
        if (lid) lid.setAttribute("transform", "rotate(-40 4 24)");
        fx.click({ freq: 2400, vol: 0.4 });
        const tune = [["A5", 2], ["C6", 1], ["E6", 3], ["D6", 1], ["C6", 1], ["B5", 2], ["C6", 1], ["A5", 5]];
        fx.seq(tune, { type: "sine", vol: 0.09, beat: 0.28, attack: 0.002 });
        fx.seq(tune, { type: "triangle", vol: 0.03, beat: 0.28, detune: 1200 });
        const ballroom = fx.wash("radial-gradient(circle, rgba(255,230,160,.25), rgba(40,60,120,.5))", 6000, { fade: 1200 });
        void ballroom;
        const ghosts = [];
        for (let i = 0; i < 4; i++) ghosts.push(fx.put(A.S("0 0 40 80", '<circle cx="20" cy="10" r="8" fill="rgba(255,255,255,.5)"/><path d="M8 20 H32 L38 78 H2 Z" fill="rgba(255,255,255,.35)"/>'), W() * (0.2 + i * 0.2), H() * 0.55, { size: 34, h: 68 }));
        ghosts.forEach((g, i) => fx.move(g, [{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + (i % 2 ? 30 : -30) + "px) rotate(" + (i % 2 ? 10 : -10) + "deg)" }, { transform: "none" }], { duration: 1800, iterations: 2 }));
        fx.caption("(once upon a December)", { style: "whisper", ms: 2400 });
        await fx.wait(3800);
      }
    },

    // The Prince of Egypt
    {
      id: 9837,
      y: 1998,
      run: async (fx) => {
        const grid = fx.$("#grid");
        const rg = fx.rect(grid);
        fx.wash("linear-gradient(#f0c080, #d0703a)", 7000, { blend: "multiply", opacity: 0.3, fade: 400 });
        const left = fx.put(box("background:linear-gradient(90deg, rgba(20,80,140,.8), rgba(60,150,220,.8))"), rg.x - rg.width / 4, rg.y, { size: rg.width / 2, h: rg.height });
        const right = fx.put(box("background:linear-gradient(-90deg, rgba(20,80,140,.8), rgba(60,150,220,.8))"), rg.x + rg.width / 4, rg.y, { size: rg.width / 2, h: rg.height });
        fx.noise(3, { freq: 400, sweep: 2000, vol: 0.4, attack: 0.4 });
        fx.chord(["D3", "A3", "D4", "F4"], 3, { type: "sawtooth", vol: 0.05, attack: 1, filter: { freq: 1400 } });
        await fx.wait(700);
        fx.buzz([300]);
        await Promise.all([
          fx.move(left, [{ transform: "none" }, { transform: "translateX(-" + rg.width * 0.4 + "px) scaleX(.3)" }], { duration: 2000, easing: "ease-in-out", fill: "forwards" }),
          fx.move(right, [{ transform: "none" }, { transform: "translateX(" + rg.width * 0.4 + "px) scaleX(.3)" }], { duration: 2000, easing: "ease-in-out", fill: "forwards" })
        ]);
        fx.caption("(the sea parts — right down the middle of the machine)", { style: "whisper", ms: 2000 });
        fx.seq([["D5", 2], ["F5", 1], ["G5", 1], ["A5", 4], ["G5", 2], ["F5", 2], ["D5", 4]], { type: "sine", vol: 0.08, beat: 0.3 });
        await fx.wait(2600);
      }
    },

    // Treasure Planet
    {
      id: 9016,
      y: 2002,
      run: async (fx) => {
        const space = fx.wash("linear-gradient(#1a1040, #402a70)", 6600, { fade: 400, opacity: 0.6 });
        void space;
        fx.particles({ kind: "drift", count: 40, glyphs: A.star("#fff6c0"), min: 3, max: 8, dur: 3000 });
        const r = fx.rect(fx.slot());
        const sphere = fx.put(A.S("0 0 60 60", '<circle cx="30" cy="30" r="26" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 8 }, (_, i) => '<path d="M30 30 L' + (30 + Math.cos(i * Math.PI / 4) * 26) + ' ' + (30 + Math.sin(i * Math.PI / 4) * 26) + '" stroke="#8a6a1a" stroke-width="2"/>').join("")), r.x, r.y, { size: 50 });
        await fx.move(sphere, [{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }, { transform: "rotate(45deg)" }], 1200);
        fx.click({ freq: 2000, vol: 0.4 });
        const map = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle, rgba(120,220,160,.7), rgba(40,120,80,.3) 60%, transparent 70%)"></div>', W() / 2, H() * 0.4, { size: 40 });
        fx.move(map, [{ transform: "scale(1)" }, { transform: "scale(" + Math.max(W(), H()) / 50 + ")", opacity: 0.6 }], { duration: 1600, fill: "forwards", easing: "ease-out" });
        fx.chord(["E4", "G#4", "B4", "E5"], 2.4, { type: "sine", vol: 0.06, attack: 0.4 });
        fx.caption("(the map becomes a galaxy)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const ship = A.S("0 0 120 80", '<path d="M10 60 C30 70 90 70 110 60 L96 48 H24 Z" fill="#8a5a2a" ' + A.ink + ' stroke-width="2"/><path d="M60 48 V4 M40 48 V14" stroke="#6b4a2a" stroke-width="3"/><path d="M60 8 C80 12 90 30 80 44 H60 Z M40 16 C24 22 22 36 30 44 H40 Z" fill="#f4e0a0" ' + A.ink + ' stroke-width="1.5"/>');
        await fx.fly(ship, [-120, H() * 0.6], [W() + 120, H() * 0.3], { size: 110, h: 74, dur: 2400 });
      }
    },

    // Kubo and the Two Strings
    {
      id: 313297,
      y: 2016,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pluck = (n, at) => { fx.tone(n, 1.2, { type: "triangle", vol: 0.12, at, attack: 0.002 }); fx.noise(0.04, { type: "highpass", freq: 3000, vol: 0.3, at }); };
        const notes = ["E4", "B4", "E5", "D5", "B4", "A4", "E4"];
        notes.forEach((n, i) => pluck(n, i * 0.3));
        const papers = ["#d51f2a", "#f2d33b", "#3a6ad8", "#f4f0e6", "#3aa655"];
        const folds = [];
        for (let i = 0; i < 10; i++) {
          const f = fx.put(A.S("0 0 30 30", '<path d="M2 28 L15 2 L28 28 Z M15 2 L15 28" fill="' + papers[i % 5] + '" ' + A.ink + ' stroke-width="1.5"/>'), r.x, r.y, { size: 24 });
          folds.push(f);
          fx.move(f, [{ transform: "none" }, { transform: "translate(" + Math.cos(i / 10 * Math.PI * 2) * 90 + "px," + Math.sin(i / 10 * Math.PI * 2) * 90 + "px) rotate(" + i * 36 + "deg)" }], { duration: 900, delay: i * 80, fill: "forwards" });
        }
        await fx.wait(1800);
        const samurai = fx.put(A.S("0 0 60 80", '<path d="M10 20 L30 2 L50 20 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/><path d="M14 20 H46 L50 76 H10 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M50 30 L60 10" stroke="#f4f0e6" stroke-width="3"/>'), r.x, r.y - 20, { size: 50, h: 66 });
        fx.move(samurai, [{ transform: "scale(0) rotate(-180deg)" }, { transform: "none" }], 600);
        fx.caption("If you must blink, do it now.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Isle of Dogs
    {
      id: 399174,
      y: 2018,
      run: async (fx) => {
        const beat = 0.3;
        for (let i = 0; i < 16; i++) fx.thud({ freq: i % 4 === 0 ? 70 : 110, vol: i % 4 === 0 ? 0.5 : 0.2, dur: 0.15, at: i * beat });
        fx.buzz([60, 240, 30, 270, 60, 240, 30, 270]);
        fx.caption("(taiko drums)", { style: "whisper", ms: 1400 });
        fx.wash("rgba(160,150,130,.35)", 6000, { fade: 400 });
        const dogs = [];
        for (let i = 0; i < 5; i++) dogs.push(fx.put(A.S("0 0 50 40", '<path d="M6 22 C8 12 28 10 38 14 L44 6 L48 10 L46 18 C50 22 48 28 42 28 L40 36 M14 28 L12 36 M24 28 L24 36 M34 28 L34 36" fill="' + ["#b8a888", "#6b4a2a", "#e8e0d0", "#1d1a18", "#8a6a4a"][i] + '" ' + A.ink + ' stroke-width="1.5"/>'), W() * (0.15 + i * 0.17), H() * 0.72, { size: 44, h: 36 }));
        await fx.wait(2000);
        const lines = ["I bite.", "We're a pack of scary, indestructible alpha dogs.", "I'm a stray."];
        for (let i = 0; i < 3; i++) {
          fx.caption(lines[i], { style: "subtitle", ms: 1100, css: { fontSize: "14px" } });
          fx.move(dogs[i], [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], 300);
          await fx.wait(1100);
        }
        void dogs;
      }
    },

    // Your Name.
    {
      id: 372058,
      y: 2016,
      run: async (fx) => {
        const sky = fx.wash("linear-gradient(#ff9a8a, #b06ab0 50%, #4a4ab0)", 7000, { blend: "multiply", opacity: 0.5, fade: 600 });
        void sky;
        const comet = A.S("0 0 160 30", '<path d="M0 15 C60 10 120 12 150 15 C120 18 60 20 0 15 Z" fill="rgba(160,220,255,.6)"/><circle cx="150" cy="15" r="8" fill="#fff"/>');
        fx.tone(1200, 3, { type: "sine", vol: 0.04, slide: 600, attack: 0.5 });
        await fx.fly(comet, [-160, H() * 0.05], [W() + 160, H() * 0.4], { size: 200, h: 38, dur: 3000, r0: 20, r2: 20 });
        fx.caption("(the comet splits)", { style: "whisper", ms: 1400 });
        fx.particles({ kind: "burst", from: pt(W() * 0.6, H() * 0.3), count: 16, spread: 60, glyphs: A.star("#bfe8ff"), min: 6, max: 12, dur: 1200 });
        await fx.wait(1400);
        const r = fx.rect(fx.slot());
        const cord = fx.put(A.S("0 0 120 20", '<path d="M2 10 C30 0 60 20 90 10 C100 6 110 8 118 10" stroke="#d51f2a" stroke-width="4" fill="none"/><path d="M4 14 C30 4 60 24 90 14" stroke="#ff7ab0" stroke-width="2" fill="none"/>'), r.x, r.top + r.height + 20, { size: 110, h: 18 });
        void cord;
        fx.caption("(the braided cord)", { style: "whisper", ms: 1400 });
        fx.seq([["E5", 1], ["F#5", 1], ["G#5", 2], ["B5", 2], ["G#5", 1], ["F#5", 1], ["E5", 4]], { type: "triangle", vol: 0.08, beat: 0.25 });
        await fx.wait(1600);
        fx.caption("What's your name?", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Whisper of the Heart
    {
      id: 37797,
      y: 1995,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const baron = fx.put(A.S("0 0 50 70", '<path d="M10 28 L6 10 L18 20 M40 28 L44 10 L32 20" fill="#c8a070" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="25" cy="30" rx="16" ry="14" fill="#c8a070" ' + A.ink + ' stroke-width="1.5"/><circle cx="19" cy="28" r="3" fill="#6ab0d0"/><circle cx="31" cy="28" r="3" fill="#6ab0d0"/><path d="M8 14 H42 L38 4 H12 Z" fill="#1d1a18"/><path d="M12 44 H38 L42 68 H8 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><path d="M25 44 V68" stroke="#1d1a18"/>'), r.x, r.y, { size: 40, h: 56 });
        void baron;
        fx.caption("(the Baron, in the antique shop)", { style: "whisper", ms: 1800 });
        const violin = [["A4", 2], ["C5", 1], ["D5", 1], ["E5", 3], ["D5", 1], ["C5", 2], ["A4", 2], ["G4", 4]];
        fx.seq(violin, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1600 }, vibrato: [5.5, 6], attack: 0.08 });
        await fx.wait(2400);
        const cat = A.S("0 0 50 34", '<path d="M6 26 C8 14 28 12 38 16 L42 6 L46 10 L46 18 C50 22 46 28 40 28 L10 30 Z" fill="#e8e0d0" ' + A.ink + ' stroke-width="1.5"/><ellipse cx="22" cy="20" rx="6" ry="4" fill="#8a6a4a"/>');
        fx.caption("(follow the cat on the train)", { style: "whisper", ms: 1600 });
        await fx.fly(cat, [-50, H() * 0.75], [W() + 50, H() * 0.7], { size: 46, h: 32, dur: 2400 });
      }
    },

    // The Tale of the Princess Kaguya
    {
      id: 149871,
      y: 2013,
      run: async (fx) => {
        const paper = fx.wash("#f4efe2", 7400, { fade: 600, opacity: 0.6 });
        void paper;
        const r = fx.rect(fx.slot());
        const bamboo = fx.put(A.S("0 0 40 160", '<path d="M14 160 V0 M26 160 V0" stroke="#6aa04a" stroke-width="2"/><path d="M12 40 H28 M12 80 H28 M12 120 H28" stroke="#3a7a2a" stroke-width="3"/><g class="glow" opacity="0"><circle cx="20" cy="60" r="10" fill="#fff6c0"/></g>'), r.x, r.y, { size: 30, h: 130 });
        const glow = bamboo.querySelector(".glow");
        if (glow) fx.anim(glow, [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, fill: "forwards" });
        fx.tone(1600, 2, { type: "sine", vol: 0.04, attack: 1 });
        fx.caption("(a tiny princess, inside the bamboo)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        fx.caption("(she runs — and the brushstrokes run with her)", { style: "whisper", ms: 2200 });
        const ink = fx.node(A.S("0 0 400 100", '<path d="M0 60 C60 20 120 90 200 40 C260 10 320 80 400 30" stroke="#1d1a18" stroke-width="6" fill="none" stroke-linecap="round"/>'), { cls: "fx-filter", style: { top: "35%", height: "20vh" } });
        ink.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(ink.firstChild.style, { width: "100%", height: "100%" });
        const p = ink.querySelector("path");
        if (p && !fx.reduced) { p.style.strokeDasharray = 700; await fx.tween(1600, (k) => (p.style.strokeDashoffset = 700 * (1 - k))); }
        for (let i = 0; i < 10; i++) fx.noise(0.08, { type: "bandpass", freq: 900, q: 2, vol: 0.2, at: i * 0.15 });
        const moon = fx.put(A.moon, W() * 0.8, H() * 0.12, { size: 70 });
        fx.move(moon, [{ opacity: 0 }, { opacity: 1 }], 800);
        fx.chord(["D5", "F5", "A5"], 2.4, { type: "sine", vol: 0.04, attack: 0.6 });
        await fx.wait(2200);
      }
    },

    // Matilda
    {
      id: 10830,
      y: 1996,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const newt = fx.put(A.S("0 0 50 20", '<path d="M4 10 C10 4 30 4 40 8 L48 6 L46 12 L40 12 C30 16 10 16 4 10 Z" fill="#6aa04a" ' + A.ink + ' stroke-width="1.5"/>'), r.x - 40, r.top + r.height + 20, { size: 40, h: 16 });
        void newt;
        fx.caption("(eyes narrow…)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        const others = fx.otherSlots(true).slice(0, 6);
        fx.tone(200, 2.4, { type: "sine", vol: 0.06, slide: 600, vibrato: [8, 10] });
        others.forEach((o, i) => fx.move(o, [{ transform: "none" }, { transform: "translateY(-20px) rotate(" + (i % 2 ? 8 : -8) + "deg)" }, { transform: "translateY(-30px) rotate(" + (i % 2 ? -8 : 8) + "deg)" }, { transform: "none" }], { duration: 2000, delay: i * 80, fill: "none" }));
        const chalk = fx.put(A.S("0 0 20 10", '<rect x="1" y="1" width="18" height="8" rx="2" fill="#fff"/>'), W() / 2, H() * 0.3, { size: 16, h: 8 });
        await fx.move(chalk, [{ transform: "none" }, { transform: "translate(40px,-10px) rotate(-20deg)" }, { transform: "translate(80px,10px) rotate(10deg)" }], 1600);
        fx.put('<div style="font:700 16px/1.2 \'Special Elite\',\'Courier New\',monospace;color:#fff;background:#1d3a2a;padding:6px;border:3px solid #6b4a2a">I AM WATCHING YOU</div>', W() / 2, H() * 0.24, { size: 200, h: 30, ms: 2000 });
        fx.caption("(the chalk writes by itself)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 10; i++) fx.noise(0.06, { type: "bandpass", freq: 3000, q: 4, vol: 0.2, at: i * 0.12 });
        await fx.wait(2200);
      }
    },

    // The Addams Family
    {
      id: 2907,
      y: 1991,
      run: async (fx) => {
        fx.filter("grayscale(.8) contrast(1.1)", 6400, { fade: 300 });
        const snaps = [0, 0.5, 1.4, 1.9];
        snaps.forEach((t) => fx.noise(0.05, { type: "bandpass", freq: 2800, q: 3, vol: 0.9, at: t }));
        fx.seq([[null, 2], ["C4", 1], ["D4", 1], ["E4", 1], ["F4", 2], [null, 2], ["D4", 1], ["E4", 1], ["F#4", 1], ["G4", 2]], { type: "sawtooth", vol: 0.04, beat: 0.24, filter: { freq: 900 } });
        await fx.wait(2400);
        const r = fx.rect(fx.slot());
        const hand = fx.put(A.S("0 0 60 40", '<path d="M6 30 V20 L12 8 L16 10 L14 20 L20 4 L25 5 L22 20 L30 3 L35 4 L30 20 L38 6 L43 8 L36 22 L44 22 C50 22 52 28 46 30 Z" fill="#e8d6c0" ' + A.ink + ' stroke-width="1.5"/>'), -40, r.top + r.height + 20, { size: 50, h: 34 });
        fx.caption("(Thing)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 12; i++) fx.click({ freq: 1600, vol: 0.2, at: i * 0.12 });
        await fx.move(hand, [{ transform: "none" }, { transform: "translateX(" + (r.x + 40) + "px)" }], { duration: 1400, easing: "steps(12)" });
        fx.move(hand, [{ transform: "translateX(" + (r.x + 40) + "px)" }, { transform: "translateX(" + (r.x + 40) + "px) rotate(-20deg)" }, { transform: "translateX(" + (r.x + 40) + "px)" }], 400);
        fx.caption("(it waves)", { style: "whisper", ms: 1200 });
        await fx.wait(1400);
      }
    },

    // The Witches
    {
      id: 10166,
      y: 1990,
      run: async (fx) => {
        fx.wash("rgba(40,60,50,.35)", 6400, { fade: 300 });
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const bottle = fx.put(A.S("0 0 30 50", '<path d="M10 2 H20 V14 C28 18 28 44 20 48 H10 C2 44 2 18 10 14 Z" fill="rgba(80,200,120,.7)" ' + A.ink + ' stroke-width="1.5"/><text x="15" y="34" font-size="8" text-anchor="middle" font-family="Georgia" fill="#1d1a18">86</text>'), W() * 0.8, H() * 0.3, { size: 30, h: 50 });
        fx.caption("(Formula 86: Delayed Action Mouse-Maker)", { style: "whisper", ms: 2200 });
        await fx.wait(1800);
        fx.particles({ kind: "burst", from: bottle, count: 16, spread: 40, glyphs: dot("#5aff8a"), min: 3, max: 6, dur: 900 });
        fx.tone(900, 1, { type: "sine", vol: 0.06, slide: 3000 });
        if (!fx.reduced) await fx.anim(reely, [{ transform: "scale(1)" }, { transform: "scale(.25) translateY(200px)" }], { duration: 1200, fill: "forwards", easing: "ease-in" });
        fx.put(A.mouse, rr.x, rr.top + rr.height - 10, { size: 50, h: 26, ms: 2400 });
        fx.tone(2800, 0.4, { type: "sine", vol: 0.06, vibrato: [20, 200] });
        fx.caption("(squeak)", { style: "whisper", ms: 1400 });
        await fx.wait(2000);
        if (!fx.reduced) fx.anim(reely, [{ transform: "scale(.25) translateY(200px)" }, { transform: "none" }], { duration: 400, fill: "forwards" });
        await fx.wait(400);
      }
    },

    // School of Rock
    {
      id: 1584,
      y: 2003,
      run: async (fx) => {
        const beat = 0.14;
        const riff = [["E3", 1], ["E3", 1], ["G3", 1], ["E3", 1], ["A3", 2], ["G3", 1], ["E3", 1], ["D3", 2], ["E3", 2]];
        fx.seq(riff.concat(riff, riff), { type: "sawtooth", vol: 0.08, beat, filter: { freq: 1600, q: 3 } });
        for (let i = 0; i < 36; i++) { fx.thud({ freq: 70, vol: i % 2 ? 0.1 : 0.3, dur: 0.07, at: i * beat }); if (i % 2) fx.noise(0.05, { type: "highpass", freq: 6000, vol: 0.2, at: i * beat }); }
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M86 60 L110 90 L104 96 L82 68 Z" fill="#d51f2a" stroke="#1f1b16" stroke-width="2"/><path d="M104 92 L116 104" stroke="#1d1a18" stroke-width="4"/>', 5000);
        fx.move(reely, [{ transform: "none" }, { transform: "rotate(-10deg) translateY(4px)" }, { transform: "rotate(10deg)" }, { transform: "none" }], { duration: beat * 4000, iterations: 5 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-" + (4 + (i % 3) * 3) + "px)" }, { transform: "none" }], { duration: beat * 2000, iterations: 9, delay: (i % 4) * 30, fill: "none" }));
        fx.caption("(one great rock show can change the world)", { style: "whisper", ms: 2200 });
        await fx.wait(3200);
        fx.caption("Rock!", { style: "hand", ms: 1400 });
        fx.chord(["E3", "B3", "E4", "G#4"], 1.6, { type: "sawtooth", vol: 0.06, filter: { freq: 2400 } });
        fx.shake("sm", 500);
        await fx.wait(1400);
      }
    }
  ]);
})();
