/* Machine FX cues - the late fifties: B-movies, new waves and world cinema.
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
  const bw = (fx, ms, extra) => fx.filter("grayscale(1) contrast(1.15)" + (extra || ""), ms, { fade: 300 });
  const theremin = (fx, notes, beat) => fx.seq(notes, { type: "sine", vol: 0.14, beat: beat || 0.35, vibrato: [6, 14], attack: 0.12, legato: 1 });

  M.register([
    // Them!
    {
      id: 11071,
      y: 1954,
      run: async (fx) => {
        bw(fx, 5400, " brightness(1.1)");
        for (let i = 0; i < 16; i++) {
          const t = i * 0.08;
          fx.tone(i % 2 ? 3100 : 2600, 0.06, { type: "square", vol: 0.06, at: t + (i > 7 ? 0.9 : 0) });
        }
        await fx.wait(1600);
        const ant = A.S("0 0 120 80", '<ellipse cx="20" cy="40" rx="16" ry="12" fill="#1d1a18"/><ellipse cx="50" cy="40" rx="12" ry="9" fill="#1d1a18"/><ellipse cx="88" cy="38" rx="24" ry="16" fill="#1d1a18"/>' +
          '<path d="M44 44 L30 70 M50 46 L50 74 M56 44 L70 70 M44 36 L30 12 M56 36 L70 12 M8 34 L-4 18 M10 32 L4 14" stroke="#1d1a18" stroke-width="3" fill="none"/><circle cx="16" cy="36" r="3" fill="#e8e0c0"/>');
        fx.fly(ant, [-140, H() * 0.7], [W() + 140, H() * 0.66], { size: 180, h: 120, dur: 3200, easing: "steps(20)" });
        for (let i = 0; i < 16; i++) {
          fx.tone(i % 2 ? 3100 : 2600, 0.06, { type: "square", vol: 0.08, at: i * 0.08 });
          fx.tone(i % 2 ? 3100 : 2600, 0.06, { type: "square", vol: 0.08, at: 1.6 + i * 0.08 });
        }
        fx.buzz([10, 70, 10, 70, 10, 70, 10]);
        await fx.wait(3400);
      }
    },

    // Creature from the Black Lagoon
    {
      id: 10973,
      y: 1954,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(40,80,70,.2), rgba(10,40,35,.75))", 5400, { fade: 600 });
        bw(fx, 5400);
        fx.particles({ kind: "rise", count: 20, glyphs: A.bubble, min: 6, max: 16, dur: 3000, stagger: 3000 });
        const hand = fx.put(A.S("0 0 80 100", '<path d="M20 100 L24 60 C14 50 8 40 10 30 L16 32 L18 44 L20 20 L26 20 L28 44 L32 14 L38 14 L38 44 L44 18 L50 20 L46 50 L58 40 L62 44 L50 70 L52 100 Z" fill="#4a5a44" ' + A.ink + ' stroke-width="2.5"/><path d="M24 70 C30 66 40 66 46 70 M26 82 C32 78 40 78 46 82" stroke="#2e3a2a" stroke-width="2" fill="none"/>'),
          W() / 2, H() + 60, { size: 110, h: 140 });
        await fx.wait(1400);
        fx.chord(["C3", "C#3", "C4"], 0.8, { type: "sawtooth", vol: 0.14, filter: { freq: 900 } });
        fx.tone(98, 0.9, { type: "square", vol: 0.1 });
        fx.buzz([80, 40, 80]);
        await fx.move(hand, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.4 + "px)" }], { duration: 900, easing: "cubic-bezier(.2,.8,.3,1)" });
        await fx.wait(1600);
        fx.noise(0.6, { freq: 600, vol: 0.3 });
        await fx.move(hand, [{ transform: "translateY(-" + H() * 0.4 + "px)" }, { transform: "none" }], { duration: 900, easing: "ease-in" });
      }
    },

    // La Strada
    {
      id: 405,
      y: 1954,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.05)", 6000, { fade: 500 });
        const tune = [["G4", 2], ["C5", 1], ["D5", 1], ["E5", 3], ["D5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["G5", 1], ["F5", 2], ["E5", 1], ["D5", 1], ["C5", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.08, beat: 0.28, filter: { type: "bandpass", freq: 1400, q: 1.5 }, vibrato: [5, 5], attack: 0.05 });
        const trumpet = A.S("0 0 100 40", '<path d="M4 18 H60 L94 4 V36 L60 22 H4 Z" fill="#e0b34a" ' + A.ink + ' stroke-width="2"/><rect x="24" y="10" width="4" height="8" fill="#e0b34a" ' + A.ink + ' stroke-width="1.5"/><rect x="32" y="10" width="4" height="8" fill="#e0b34a" ' + A.ink + ' stroke-width="1.5"/><rect x="40" y="10" width="4" height="8" fill="#e0b34a" ' + A.ink + ' stroke-width="1.5"/>');
        fx.costume(".reely", '<path d="M40 30 C40 12 80 12 80 30 Z M36 30 H84" fill="#3b3530" stroke="#1f1b16" stroke-width="3"/><path d="M50 44 L46 48 M70 44 L74 48" stroke="#f4efe2" stroke-width="3"/>', 5800);
        const r = fx.rect(fx.$(".reely"));
        fx.put(trumpet, r.x + 40, r.y + 6, { size: 90, h: 36, ms: 5600 });
        await fx.wait(5600);
      }
    },

    // One Froggy Evening
    {
      id: 53211,
      y: 1955,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const frog = (open) => A.S("0 0 60 70",
          (open ? '<path d="M6 10 H54 L46 4 H14 Z" fill="#0d0b09"/><path d="M4 12 H56" stroke="#0d0b09" stroke-width="4"/>' : "") +
          '<ellipse cx="30" cy="44" rx="22" ry="20" fill="#5fa04a" ' + A.ink + ' stroke-width="2.5"/><circle cx="20" cy="24" r="7" fill="#5fa04a" ' + A.ink + ' stroke-width="2"/><circle cx="40" cy="24" r="7" fill="#5fa04a" ' + A.ink + ' stroke-width="2"/>' +
          '<circle cx="20" cy="24" r="3" fill="' + A.INK + '"/><circle cx="40" cy="24" r="3" fill="' + A.INK + '"/>' +
          (open ? '<ellipse cx="30" cy="42" rx="10" ry="7" fill="#8a1a1a" ' + A.ink + ' stroke-width="2"/><path d="M8 40 L0 30 M52 40 L60 30" ' + A.ink + '/><path d="M58 30 L62 20" stroke="#0d0b09" stroke-width="2"/>' : '<path d="M22 40 Q30 44 38 40" ' + A.ink + ' fill="none" stroke-width="2"/>'));
        const f = fx.put(frog(true), r.x, r.top + r.height + 30, { size: 60, h: 70, cls: "fx-tap" });
        let tapped = false;
        fx.onNextTap(() => { tapped = true; }, 5400);
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["C6", 2], ["A5", 1], ["G5", 1], ["E5", 1], ["G5", 3], ["F5", 1], ["E5", 1], ["D5", 1], ["C5", 3]];
        let t = 0;
        for (const [n, l] of tune) {
          if (tapped) break;
          fx.sfx("key", { hz: fx.note(n), vol: 0.55 });
          fx.move(f, [{ transform: "none" }, { transform: "translateY(-6px) rotate(" + (t % 2 ? 6 : -6) + "deg)" }, { transform: "none" }], { duration: 200 * l, fill: "none" });
          await fx.wait(200 * l);
          t++;
        }
        f.innerHTML = frog(false);
        fx.sfx("squeak", { rate: 0.45, vol: 0.9 });
        fx.caption("ribbit.", { style: "whisper", ms: 1400, at: "slot" });
        await fx.wait(1400);
      }
    },

    // Kiss Me Deadly
    {
      id: 18030,
      y: 1955,
      run: async (fx) => {
        bw(fx, 5600);
        const r = fx.rect(fx.slot());
        const bx = fx.put(A.S("0 0 80 60", '<rect x="6" y="20" width="68" height="36" fill="#6b4a2a" ' + A.ink + '/><path class="lid" d="M4 20 H76 V12 H4 Z" fill="#7b5a3a" ' + A.ink + '/><path d="M28 30 H52 V44 H28 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/>'), r.x, r.y, { size: 90, h: 68 });
        fx.noise(2.4, { type: "highpass", freq: 5000, vol: 0.04, attack: 1.2 });
        fx.tone(60, 2.4, { type: "sawtooth", vol: 0.06, attack: 1.4, filter: { freq: 200 } });
        await fx.wait(1800);
        const lid = bx.querySelector(".lid");
        if (lid) lid.setAttribute("transform", "rotate(-40 4 20)");
        fx.noise(1.4, { type: "highpass", freq: 1500, sweep: 7000, vol: 0.7 });
        fx.tone(120, 1.4, { type: "sawtooth", slide: 1800, vol: 0.2 });
        fx.buzz([100, 30, 200]);
        const glow = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff,#fffbe8 30%,rgba(255,250,220,0) 70%)"></div>', r.x, r.y - 10, { size: 60 });
        await fx.move(glow, [{ transform: "scale(.4)" }, { transform: "scale(18)" }], { duration: 1300, easing: "ease-in" });
        fx.flash("#fff", 400);
        await fx.wait(700);
      }
    },

    // Pather Panchali
    {
      id: 5801,
      y: 1955,
      run: async (fx) => {
        fx.filter("grayscale(1) brightness(1.05)", 6200, { fade: 500 });
        fx.wash("linear-gradient(transparent 60%, rgba(220,215,200,.55))", 6200, { fade: 600 });
        const grass = fx.node(A.S("0 0 400 100", Array.from({ length: 60 }, (_, i) => { const x = i * 7 + (i % 3); return '<path d="M' + x + " 100 C" + (x + 2) + " 60 " + (x - 4) + " 30 " + (x + 6) + " " + (8 + (i * 37) % 30) + '" stroke="#f4f2ec" stroke-width="2" fill="none"/>'; }).join("")),
          { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "22vh" } });
        grass.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(grass.firstChild.style, { width: "100%", height: "100%" });
        fx.move(grass, [{ transform: "skewX(0)" }, { transform: "skewX(-6deg)" }, { transform: "skewX(3deg)" }, { transform: "skewX(0)" }], { duration: 4000 });
        const train = A.S("0 0 160 40", '<rect x="40" y="10" width="110" height="20" fill="#1d1a18"/><rect x="4" y="6" width="36" height="24" fill="#1d1a18"/><path d="M10 6 V0 H18 V6" fill="#1d1a18"/><circle cx="20" cy="32" r="6" fill="#1d1a18"/><circle cx="70" cy="32" r="6" fill="#1d1a18"/><circle cx="120" cy="32" r="6" fill="#1d1a18"/>');
        fx.seq([["D5", 2], ["E5", 1], ["F5", 1], ["A5", 3], ["G5", 1], ["F5", 2], ["E5", 2], ["D5", 4]], { type: "sawtooth", vol: 0.05, beat: 0.28, filter: { freq: 1600 }, vibrato: [6, 8] });
        await fx.wait(1600);
        fx.particles({ kind: "sweep", dir: "rtl", area: pt(W() / 2, H() * 0.58, W(), 30), count: 12, glyphs: dot("rgba(30,30,30,.6)"), min: 16, max: 34, dur: 2600, stagger: 1400 });
        for (let t = 0; t < 3; t += 0.22) fx.noise(0.1, { freq: 500, vol: 0.18, at: t });
        fx.tone(600, 0.8, { type: "square", vol: 0.04, at: 0.2, filter: { freq: 900 } });
        await fx.fly(train, [W() + 100, H() * 0.6], [-120, H() * 0.6], { size: 200, h: 50, dur: 3600 });
      }
    },

    // Rififi
    {
      id: 934,
      y: 1955,
      run: async (fx) => {
        bw(fx, 7000);
        fx.caption("(no one speaks for the next 28 minutes)", { style: "whisper", ms: 2000 });
        const r = fx.rect(fx.slot());
        const umb = fx.put(A.S("0 0 80 60", '<path d="M4 30 C4 8 76 8 76 30 Z" fill="#1d1a18"/><path d="M40 30 V56 C40 60 34 60 34 56" stroke="#1d1a18" stroke-width="3" fill="none"/>'), r.x, r.top - 20, { size: 80, h: 60, style: { transform: "rotate(180deg)" } });
        void umb;
        for (let i = 0; i < 8; i++) {
          fx.noise(0.25, { type: "bandpass", freq: 2600, q: 5, vol: 0.18, at: i * 0.35 });
          fx.particles({ kind: "fall", area: pt(r.x, r.top - 40, 30, 10), count: 2, glyphs: dot("#cfc8b8"), min: 3, max: 6, dur: 700, stagger: 100 });
          await fx.wait(350);
        }
        fx.tone(3000, 0.04, { type: "sine", vol: 0.1 });
        const hole = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#0d0b09;box-shadow:0 0 0 3px #555"></div>', r.x, r.top, { size: 26 });
        await fx.move(hole, [{ transform: "scale(0)" }, { transform: "scale(1)" }], 400);
        fx.caption("Shh.", { style: "subtitle", ms: 1300 });
        await fx.wait(1400);
      }
    },

    // Les Diaboliques
    {
      id: 827,
      y: 1955,
      run: async (fx) => {
        bw(fx, 5600);
        const pool = fx.wash("linear-gradient(transparent 55%, rgba(40,55,50,.85))", 5600, { fade: 700 });
        void pool;
        fx.noise(3.6, { freq: 300, vol: 0.1, attack: 1 });
        await fx.wait(1800);
        fx.tone(900, 0.6, { type: "sine", vol: 0.06, slide: 700 });
        const r = fx.rect(fx.slot());
        fx.put(box("background:rgba(0,0,0,.7);border-radius:6px"), r.x, r.y, { size: r.width, h: r.height, ms: 800 });
        fx.put(A.S("0 0 60 40", '<ellipse cx="18" cy="20" rx="14" ry="10" fill="#f4f4f0"/><ellipse cx="44" cy="20" rx="14" ry="10" fill="#f4f4f0"/><circle cx="18" cy="20" r="3" fill="#0d0b09"/><circle cx="44" cy="20" r="3" fill="#0d0b09"/>'), r.x, r.y, { size: 70, h: 46, ms: 2400 });
        await fx.wait(800);
        fx.noise(0.6, { type: "highpass", freq: 2000, vol: 0.7 });
        fx.chord(["B2", "C3", "F3"], 1.5, { type: "sawtooth", vol: 0.12, filter: { freq: 1200 } });
        fx.buzz([150, 50, 150]);
        fx.flash("#fff", 150);
        await fx.wait(1600);
        fx.caption("Don't be diabolical — don't spoil the ending.", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // The Night of the Hunter
    {
      id: 3112,
      y: 1955,
      run: async (fx) => {
        bw(fx, 6200, " brightness(.85)");
        const hands = [["L O V E", "#f4efe2"], ["H A T E", "#f4efe2"]];
        const els = hands.map(([word, c], i) => fx.put(A.S("0 0 100 50",
          '<path d="M6 44 C4 30 6 14 14 10 H86 C94 12 96 24 92 44 Z" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/><path d="M28 10 V2 M46 10 V0 M64 10 V2 M80 12 V6" ' + A.ink + '/>' +
          '<text x="50" y="34" font-size="15" font-family="Georgia" text-anchor="middle" fill="' + A.INK + '" letter-spacing="3">' + word + "</text>"),
          W() / 2 + (i ? 70 : -70), H() * 0.45, { size: 130, h: 65 }));
        void els;
        const tune = [["C5", 1], ["E5", 1], ["G5", 2], ["G5", 1], ["A5", 1], ["G5", 2], ["E5", 1], ["C5", 1], ["D5", 2], ["C5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.12, beat: 0.35, vibrato: [4, 5] });
        fx.seq(tune.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "triangle", vol: 0.04, beat: 0.35, at: 0.18 });
        for (let i = 0; i < 4; i++) {
          fx.move(els[i % 2], [{ transform: "none" }, { transform: "rotate(" + (i % 2 ? 12 : -12) + "deg) translateY(-8px)" }, { transform: "none" }], 700);
          await fx.wait(800);
        }
        fx.particles({ kind: "drift", count: 12, glyphs: A.star("#fff8c0"), min: 4, max: 9, dur: 2400, stagger: 1500 });
        await fx.wait(2400);
      }
    },

    // The Red Balloon
    {
      id: 15265,
      y: 1956,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.25) brightness(1.05)", 6600, { fade: 400 });
        const b = fx.put(A.balloon("#e0201c"), r.x, r.y - r.height * 0.1, { size: 44, h: 99 });
        b.style.transition = "left 1.1s cubic-bezier(.3,.9,.4,1), top 1.1s cubic-bezier(.3,.9,.4,1)";
        let hx = r.x, hy = r.y;
        const follow = (e) => {
          hx = e.clientX; hy = e.clientY - 50;
          b.style.left = hx - 22 + "px";
          b.style.top = hy - 50 + "px";
          fx.tone(fx.pick(["G5", "A5", "C6"]), 0.2, { type: "sine", vol: 0.06 });
        };
        document.addEventListener("pointerdown", follow, true);
        fx.onCleanup(() => document.removeEventListener("pointerdown", follow, true));
        fx.move(b, [{ transform: "translateY(0) rotate(-3deg)" }, { transform: "translateY(-10px) rotate(3deg)" }, { transform: "translateY(0) rotate(-3deg)" }], { duration: 2400, iterations: 3 });
        fx.seq([["E5", 2], ["G5", 1], ["C6", 3], ["B5", 1], ["A5", 1], ["G5", 4]], { type: "sine", vol: 0.08, beat: 0.3 });
        await fx.wait(5800);
        const now = fx.rect(b);
        fx.remove(b);
        await fx.fly(A.balloon("#e0201c"), [now.x, now.y], [now.x + 40, -120], { size: 44, h: 99, dur: 1600, easing: "ease-in" });
      }
    },

    // Invasion of the Body Snatchers (1956)
    {
      id: 11549,
      y: 1956,
      run: async (fx) => {
        bw(fx, 6000);
        const pod = A.S("0 0 60 100", '<path d="M30 2 C54 20 58 70 30 98 C2 70 6 20 30 2 Z" fill="#8a8a60" ' + A.ink + ' stroke-width="2.5"/><path d="M30 10 C40 30 40 70 30 90 M30 10 C20 30 20 70 30 90" stroke="#5a5a3a" stroke-width="2" fill="none"/>');
        const others = fx.otherSlots(true).slice(0, 5);
        fx.noise(4.5, { freq: 200, vol: 0.12, attack: 1 });
        fx.chord(["E3", "F3"], 4.5, { type: "sine", vol: 0.05, attack: 1.5 });
        for (const s of others) {
          const rr = fx.rect(s);
          const p = fx.put(pod, rr.x, rr.y, { size: rr.width * 0.7, h: rr.height * 0.9 });
          fx.anim(p, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 0.85, transform: "none" }], 900);
          fx.noise(0.4, { type: "bandpass", freq: 300, q: 4, vol: 0.3 });
          await fx.wait(500);
        }
        await fx.wait(1200);
        fx.style(others, { filter: "grayscale(1) brightness(1.2) contrast(.6)" }, 2200);
        const r = fx.rect(fx.slot());
        fx.caption("You're next!", { style: "hand", ms: 1600, css: { top: r.top - 60 + "px" } });
        fx.tone(1400, 0.8, { type: "sawtooth", vol: 0.06, vibrato: [9, 60], filter: { freq: 2000 } });
        fx.buzz([40, 40, 40]);
        await fx.wait(2000);
      }
    },

    // The Searchers
    {
      id: 3114,
      y: 1956,
      run: async (fx) => {
        const door = fx.node("", { cls: "fx-filter", style: { background: "#0b0907" } });
        A.liftSlot(fx, 6000);
        const r = fx.rect(fx.slot());
        const pad = 30;
        const cut = (k) => {
          const w = r.width / 2 + pad + k * W(), h = r.height / 2 + pad + k * H();
          door.style.clipPath = "polygon(evenodd,0 0,100% 0,100% 100%,0 100%,0 0," + (r.x - w) + "px " + (r.y - h) + "px," + (r.x - w) + "px " + (r.y + h) + "px," + (r.x + w) + "px " + (r.y + h) + "px," + (r.x + w) + "px " + (r.y - h) + "px," + (r.x - w) + "px " + (r.y - h) + "px)";
        };
        cut(0);
        fx.wash("linear-gradient(#e8a15a, #c8683a)", 6000, { blend: "multiply", opacity: 0.35, fade: 500 });
        fx.noise(4, { freq: 800, vol: 0.12, pan: -1, panTo: 1, attack: 1 });
        fx.seq([["G4", 3], ["C5", 1], ["E5", 2], ["D5", 2], ["C5", 4]], { type: "triangle", vol: 0.08, beat: 0.4 });
        await fx.wait(2800);
        if (!fx.reduced) await fx.tween(1800, (k) => cut(k * k));
        else cut(1);
        await fx.wait(600);
      }
    },

    // Forbidden Planet
    {
      id: 830,
      y: 1956,
      run: async (fx) => {
        fx.wash("radial-gradient(circle at 50% 30%, rgba(80,200,160,.35), rgba(20,20,60,.75))", 5400, { fade: 400, blend: "multiply" });
        const robot = fx.put(A.S("0 0 80 120",
          '<path d="M24 10 C24 -2 56 -2 56 10 L60 40 H20 Z" fill="rgba(200,230,255,.5)" ' + A.ink + ' stroke-width="2"/><circle class="l1" cx="32" cy="22" r="4" fill="#ffcf5a"/><circle class="l2" cx="48" cy="22" r="4" fill="#5affc8"/><path d="M30 30 H50" stroke="#e05a5a" stroke-width="3"/>' +
          '<path d="M16 40 H64 L60 84 H20 Z" fill="#6d7478" ' + A.ink + '/><path d="M20 46 L4 76 M60 46 L76 76" ' + A.ink + ' stroke-width="6"/><path d="M24 84 L20 116 M56 84 L60 116" ' + A.ink + ' stroke-width="8"/>' +
          '<path d="M28 50 H52 M28 58 H52 M28 66 H52" stroke="#a8b0b4" stroke-width="3"/>'),
          W() / 2, H() * 0.45, { size: 110, h: 165 });
        const l1 = robot.querySelector(".l1"), l2 = robot.querySelector(".l2");
        for (let i = 0; i < 14; i++) {
          fx.tone(fx.rand(300, 2400), 0.18, { type: fx.pick(["sine", "triangle"]), slide: fx.rand(200, 3000), vol: 0.1, at: i * 0.22 });
        }
        for (let i = 0; i < 10; i++) {
          if (l1) l1.setAttribute("fill", i % 2 ? "#ffcf5a" : "#fff");
          fx.sfx("blip", { hz: fx.pick([660, 880, 1320, 990]), vol: 0.4 });
          if (l2) l2.setAttribute("fill", i % 2 ? "#fff" : "#5affc8");
          await fx.wait(260);
        }
        fx.caption("Good evening. Robby at your service.", { style: "terminal", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // The Cranes Are Flying
    {
      id: 38360,
      y: 1957,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.1)", 6000, { fade: 400 });
        const crane = A.S("0 0 80 40", '<path d="M40 22 C30 8 16 4 2 8 C16 12 26 18 32 24 L6 30 C20 32 34 30 40 26 C46 30 60 32 74 30 L48 24 C54 18 64 12 78 8 C64 4 50 8 40 22 Z" fill="#1d1a18"/><path d="M40 22 L50 20 L60 14" stroke="#1d1a18" stroke-width="2"/>');
        for (let i = 0; i < 7; i++) {
          const y = H() * 0.15 + (i % 2 ? 30 : 0) + i * 12;
          fx.later(i * 250, () => fx.fly(crane, [-60 - i * 30, y], [W() + 60, y - 60], { size: 60, h: 30, dur: 4200 }));
        }
        fx.chord(["A3", "C4", "E4"], 5, { type: "sine", vol: 0.05, attack: 1.5 });
        fx.seq([["E5", 3], ["D5", 1], ["C5", 2], ["A4", 2], ["B4", 3], ["C5", 1], ["A4", 4]], { type: "triangle", vol: 0.08, beat: 0.35 });
        if (!fx.reduced) fx.page([{ transform: "rotate(0)" }, { transform: "rotate(2deg)" }, { transform: "rotate(-2deg)" }, { transform: "rotate(0)" }], { duration: 4000 });
        await fx.wait(5200);
      }
    },

    // The Incredible Shrinking Man
    {
      id: 31682,
      y: 1957,
      run: async (fx) => {
        bw(fx, 5600);
        const lift = A.liftSlot(fx, 5600);
        fx.tone(600, 3.4, { type: "sine", slide: 150, vol: 0.12, vibrato: [5, 12] });
        await fx.move(lift, [{ transform: "none" }, { transform: "scale(.12)" }], { duration: 3000, easing: "ease-in" });
        const r = fx.rect(fx.slot());
        const spider = fx.put(A.S("0 0 60 40", '<ellipse cx="30" cy="22" rx="10" ry="8" fill="#0d0b09"/><circle cx="30" cy="12" r="6" fill="#0d0b09"/>' + [-1, 1].map((s) => '<path d="M' + (30 + s * 8) + " 18 L" + (30 + s * 22) + " 6 L" + (30 + s * 28) + " 20 M" + (30 + s * 8) + " 22 L" + (30 + s * 26) + " 20 L" + (30 + s * 30) + " 34 M" + (30 + s * 8) + " 26 L" + (30 + s * 20) + " 32 L" + (30 + s * 24) + ' 40" stroke="#0d0b09" stroke-width="2" fill="none"/>').join("")),
          r.x + 60, r.y - 30, { size: 60, h: 40 });
        fx.noise(0.3, { freq: 5000, vol: 0.2 });
        await fx.move(spider, [{ transform: "none" }, { transform: "translate(-40px, 20px)" }, { transform: "translate(-30px, 10px)" }], 900);
        fx.buzz([20, 20, 20]);
        fx.caption("To God, there is no zero.", { style: "subtitle", ms: 1600 });
        await fx.wait(1500);
        await fx.move(lift, [{ transform: "scale(.12)" }, { transform: "none" }], 500);
      }
    },

    // Throne of Blood
    {
      id: 3777,
      y: 1957,
      run: async (fx) => {
        bw(fx, 5600);
        fx.wash("rgba(230,230,230,.35)", 5600, { fade: 800 });
        const rg = fx.rect(fx.$("#grid"));
        const target = fx.$(".reely");
        const tr = fx.rect(target);
        fx.caption("…the forest moves.", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 18; i++) {
          const fromLeft = i % 2 === 0;
          const y = fx.rand(rg.top, rg.top + rg.height);
          const to = [tr.x + fx.rand(-tr.width / 2, tr.width / 2), tr.y + fx.rand(-tr.height / 2, tr.height / 2)];
          fx.later(1300 + i * 110, () => {
            fx.fly(A.S("0 0 60 6", '<path d="M0 3 H52" stroke="#1d1a18" stroke-width="2"/><path d="M52 0 L60 3 L52 6 Z M0 0 L6 3 L0 6" fill="#1d1a18"/>'), [fromLeft ? -40 : W() + 40, y], to, { size: 50, h: 6, dur: 380, r2: 0, flip: !fromLeft, keep: true });
            fx.thud({ freq: 220, vol: 0.15, dur: 0.08 });
            fx.noise(0.06, { type: "highpass", freq: 3000, vol: 0.2 });
          });
        }
        await fx.wait(1300 + 18 * 110 + 500);
        fx.buzz([30, 30, 30, 30, 80]);
        fx.move(target, [{ transform: "none" }, { transform: "rotate(-6deg)" }, { transform: "rotate(4deg)" }, { transform: "none" }], 600);
        await fx.wait(1600);
      }
    },

    // The Seventh Seal
    {
      id: 490,
      y: 1957,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.08)");
        const board = fx.put(A.S("0 0 80 80", Array.from({ length: 64 }, (_, i) => '<rect x="' + (i % 8) * 10 + '" y="' + Math.floor(i / 8) * 10 + '" width="10" height="10" fill="' + ((i + Math.floor(i / 8)) % 2 ? "#1d1a18" : "#e8e4da") + '"/>').join("")), W() / 2, H() * 0.36, { size: 150 });
        fx.put(A.S("0 0 20 30", '<circle cx="10" cy="8" r="6" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M4 28 H16 L13 14 H7 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/>'), W() / 2 - 20, H() * 0.36 + 20, { size: 20, h: 30 });
        const knight = fx.put(A.S("0 0 20 30", '<path d="M4 28 H16 L14 16 C18 12 14 2 8 4 L4 10 L8 12 L6 16 Z" fill="#1d1a18"/>'), W() / 2 + 38, H() * 0.36 - 38, { size: 20, h: 30 });
        void board;
        fx.tone("D3", 5, { type: "sine", vol: 0.08, attack: 1 });
        fx.chord(["D4", "A4"], 5, { type: "sine", vol: 0.03, attack: 2 });
        await fx.wait(1400);
        await fx.move(knight, [{ transform: "none" }, { transform: "translate(-38px, 38px)" }], 600);
        fx.click({ freq: 1600, vol: 0.7 });
        await fx.wait(900);
        const figs = [];
        for (let i = 0; i < 6; i++) figs.push('<g transform="translate(' + i * 22 + ' 0)"><circle cx="10" cy="8" r="5"/><path d="M5 14 H15 L17 30 H3 Z"/><path d="M0 16 L-6 26" stroke="#1d1a18" stroke-width="2"/></g>');
        const dance = A.S("0 0 140 34", '<g fill="#1d1a18">' + figs.join("") + "</g>");
        fx.seq([["D4", 1], ["F4", 1], ["E4", 1], ["D4", 1], ["C4", 2], ["D4", 2]], { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 800 } });
        await fx.fly(dance, [W() + 80, H() * 0.18], [-80, H() * 0.12], { size: 180, h: 44, dur: 3000, easing: "steps(16)" });
      }
    },

    // Wild Strawberries
    {
      id: 614,
      y: 1957,
      run: async (fx) => {
        bw(fx, 6400, " brightness(1.1)");
        const clock = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="#f4f2ec" ' + A.ink + ' stroke-width="4"/>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => '<circle cx="' + (50 + Math.sin(i * Math.PI / 6) * 36) + '" cy="' + (50 - Math.cos(i * Math.PI / 6) * 36) + '" r="2" fill="#1d1a18"/>').join("")),
          W() / 2, H() * 0.36, { size: 150 });
        void clock;
        fx.caption("(the clock has no hands)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 6; i++) fx.thud({ freq: 70, vol: 0.4, dur: 0.3, at: i * 0.55 });
        fx.buzz([30, 520, 30, 520, 30, 520, 30]);
        await fx.wait(3200);
        fx.filter("none", 2600, { bg: "rgba(0,0,0,0)" });
        fx.particles({ kind: "fall", count: 14, glyphs: A.S("0 0 20 22", '<path d="M10 20 C2 14 2 6 6 4 C8 2 12 2 14 4 C18 6 18 14 10 20 Z" fill="#e0201c"/><path d="M6 4 L10 0 L14 4" stroke="#3a6a2a" stroke-width="2" fill="#3a6a2a"/>'), min: 12, max: 20, dur: 2600, spin: 90 });
        fx.seq([["G4", 2], ["B4", 1], ["D5", 1], ["G5", 4]], { type: "triangle", vol: 0.08, beat: 0.3 });
        await fx.wait(2600);
      }
    },

    // Plan 9 from Outer Space
    {
      id: 10513,
      y: 1957,
      run: async (fx) => {
        bw(fx, 5600);
        const plate = A.S("0 0 100 50", '<ellipse cx="50" cy="30" rx="46" ry="12" fill="#b8bec1" ' + A.ink + '/><path d="M30 26 C30 12 70 12 70 26" fill="#d9dcde" ' + A.ink + '/><path d="M50 14 V-30" stroke="#999" stroke-width="1"/>');
        for (let i = 0; i < 3; i++) {
          const y = H() * (0.2 + i * 0.12);
          fx.later(i * 600, () => fx.fly(plate, [-80, y], [W() + 80, y + 20], { size: 100, h: 50, dur: 2600, via: [W() / 2, y - 30], r0: -6, r1: 8, r2: -4, easing: "steps(14)" }));
        }
        theremin(fx, [["E5", 2], ["C5", 2], ["A4", 3], ["F5", 1], ["E5", 4]], 0.35);
        await fx.wait(3200);
        fx.flash("#fff", 120);
        fx.filter("brightness(2) grayscale(1)", 150);
        await fx.wait(300);
        fx.caption("Future events such as these will affect you in the future.", { style: "subtitle", ms: 2200 });
        await fx.wait(2200);
      }
    },

    // Ashes and Diamonds
    {
      id: 5055,
      y: 1958,
      run: async (fx) => {
        bw(fx, 6000);
        const glasses = [];
        const n = 6;
        for (let i = 0; i < n; i++) {
          const g = fx.put(A.S("0 0 30 50", '<path d="M6 4 H24 L22 44 H8 Z" fill="rgba(220,235,245,.4)" ' + A.ink + ' stroke-width="2"/><path d="M8 20 H22 L22 44 H8 Z" fill="rgba(255,255,255,.7)"/>'), W() / 2 + (i - (n - 1) / 2) * 38, H() * 0.7, { size: 30, h: 50 });
          glasses.push(g);
        }
        for (let i = 0; i < n; i++) {
          fx.noise(0.4, { freq: 1500, vol: 0.2 });
          fx.tone(fx.pick([300, 360, 400]), 0.5, { type: "sine", vol: 0.1, slide: 150 });
          const fire = fx.put(A.S("0 0 20 30", '<path d="M10 2 C18 12 18 22 10 28 C2 22 2 12 10 2 Z" fill="#6ab0ff" opacity=".85"/><path d="M10 10 C14 16 14 22 10 26 C6 22 6 16 10 10 Z" fill="#dff3ff"/>'), W() / 2 + (i - (n - 1) / 2) * 38, H() * 0.7 - 36, { size: 20, h: 30 });
          fx.move(fire, [{ transform: "scale(.2)" }, { transform: "scale(1.1)" }, { transform: "scale(1)" }], 400);
          await fx.wait(450);
        }
        fx.chord(["A3", "C4", "E4"], 2.4, { type: "sawtooth", vol: 0.05, filter: { freq: 900 } });
        await fx.wait(2600);
      }
    },

    // The Fly (1958)
    {
      id: 11815,
      y: 1958,
      run: async (fx) => {
        bw(fx, 5800);
        const r = fx.rect(fx.slot());
        const web = fx.put(A.S("0 0 100 100", '<g stroke="rgba(255,255,255,.8)" stroke-width="1" fill="none">' + Array.from({ length: 8 }, (_, i) => '<path d="M50 50 L' + (50 + Math.cos(i * Math.PI / 4) * 48) + " " + (50 + Math.sin(i * Math.PI / 4) * 48) + '"/>').join("") + [12, 22, 32, 42].map((rr) => '<circle cx="50" cy="50" r="' + rr + '"/>').join("") + "</g>"),
          r.x + r.width / 2, r.top + 20, { size: 120 });
        void web;
        const fly = fx.put(A.S("0 0 40 30", '<ellipse cx="20" cy="18" rx="8" ry="6" fill="#1d1a18"/><circle cx="20" cy="10" r="6" fill="#f4efe2" ' + A.ink + ' stroke-width="1.5"/><path d="M17 9 H23" stroke="#1d1a18"/><ellipse cx="10" cy="12" rx="8" ry="4" fill="rgba(220,235,245,.7)"/><ellipse cx="30" cy="12" rx="8" ry="4" fill="rgba(220,235,245,.7)"/>'), r.x + r.width / 2, r.top + 20, { size: 36, h: 27 });
        fx.noise(3.4, { type: "bandpass", freq: 220, q: 8, vol: 0.2 });
        fx.tone(200, 3.4, { type: "sawtooth", vol: 0.05, vibrato: [30, 20] });
        await fx.move(fly, [{ transform: "none" }, { transform: "translate(2px,-2px)" }, { transform: "translate(-2px,2px)" }, { transform: "none" }], { duration: 300, iterations: 8 });
        await fx.move(fly, [{ transform: "none" }, { transform: "scale(2.4)" }], 400);
        fx.caption("Help me! Help meeee!", { style: "subtitle", ms: 1800, css: { fontSize: "13px" } });
        fx.tone(1800, 1.4, { type: "sine", vol: 0.08, vibrato: [11, 90] });
        await fx.wait(2000);
      }
    },

    // The Blob
    {
      id: 8851,
      y: 1958,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const others = fx.otherSlots(true).slice(0, 6);
        const blob = fx.put('<div style="width:100%;height:100%;border-radius:48% 52% 60% 40% / 55% 45% 55% 45%;background:radial-gradient(circle at 35% 35%, #ff7a8a, #c4102a 60%, #7a0010);box-shadow:0 0 18px rgba(220,20,40,.6)"></div>', r.x, r.y + r.height / 2, { size: 40, h: 30 });
        fx.seq([["C5", 1], ["C5", 1], ["E5", 1], ["G5", 1], [null, 1], ["G5", 1], ["A5", 1], ["G5", 2]], { type: "square", vol: 0.06, beat: 0.18, filter: { freq: 2000 } });
        fx.caption("Beware of the Blob!", { style: "hand", ms: 1600 });
        let size = 40;
        for (const s of others) {
          const sr = fx.rect(s);
          size += 14;
          fx.move(blob, [{ transform: "none" }, { transform: "translate(" + (sr.x - r.x) + "px," + (sr.y - r.y - r.height / 2) + "px) scale(" + size / 40 + ")" }], { duration: 500, easing: "cubic-bezier(.3,.9,.4,1.3)" });
          fx.tone(140, 0.4, { type: "sine", slide: 70, vol: 0.2 });
          fx.noise(0.3, { type: "lowpass", freq: 400, vol: 0.3 });
          await fx.wait(450);
          fx.style(s, { filter: "sepia(1) saturate(5) hue-rotate(-40deg)" }, 5000);
        }
        fx.buzz([40, 30, 40, 30]);
        await fx.fadeOut(blob, 700);
        await fx.wait(1200);
      }
    },

    // Touch of Evil
    {
      id: 1480,
      y: 1958,
      run: async (fx) => {
        bw(fx, 6400, " brightness(.9)");
        fx.letterbox(6400, "8vh");
        const r = fx.rect(fx.slot());
        const bomb = fx.put(A.S("0 0 50 40", '<rect x="4" y="10" width="42" height="24" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><circle cx="25" cy="22" r="7" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/><path d="M25 22 V17" stroke="#1d1a18" stroke-width="2"/>'), r.x, r.y, { size: 50, h: 40 });
        void bomb;
        fx.sfx("tick", { n: 11, every: 0.5, vol: 0.8 });
        fx.seq([["C4", 1], ["Eb4", 1], ["F4", 1], ["F#4", 1], ["G4", 2], ["Bb4", 2], ["C5", 2], ["Bb4", 1], ["G4", 3]], { type: "square", vol: 0.04, beat: 0.28, filter: { freq: 1200 } });
        if (!fx.reduced) await fx.page([{ transform: "scale(1.06) translate(0,20px)" }, { transform: "scale(1.06) translate(30px,-10px)" }, { transform: "scale(1.06) translate(-20px, -20px)" }, { transform: "none" }], { duration: 5200, easing: "linear" });
        else await fx.wait(5200);
        fx.sfx("boom", { vol: 0.9 });
        fx.flash("#fff", 200);
        fx.shake("lg", 600);
        fx.buzz(160);
        await fx.wait(700);
      }
    },

    // Mon Oncle
    {
      id: 427,
      y: 1958,
      run: async (fx) => {
        const rg = fx.rect(fx.$("#grid"));
        const fish = fx.put(A.S("0 0 80 110", '<path d="M40 110 V60" stroke="#8e969a" stroke-width="6"/><ellipse cx="40" cy="104" rx="36" ry="8" fill="#6ab0d0" ' + A.ink + ' stroke-width="2"/><path d="M20 40 C30 20 56 22 62 40 C56 56 30 58 20 40 Z M62 40 L76 28 V52 Z" fill="#6ab0d0" ' + A.ink + ' stroke-width="2.5"/><circle cx="30" cy="38" r="3" fill="' + A.INK + '"/>'),
          rg.x, rg.top + rg.height + 40, { size: 90, h: 124 });
        void fish;
        fx.tone(900, 0.3, { type: "square", vol: 0.1, filter: { freq: 1400 } });
        fx.tone(700, 0.3, { type: "square", vol: 0.1, filter: { freq: 1400 }, at: 0.35 });
        await fx.wait(700);
        const spout = fx.particles({ kind: "rise", from: pt(rg.x + 30, rg.top + rg.height + 20, 10, 10), count: 30, glyphs: dot("#bfe4ff"), min: 3, max: 7, dur: 900, stagger: 3000 });
        fx.noise(3.4, { type: "bandpass", freq: 3000, q: 1, vol: 0.12 });
        const tune = [["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 2], ["F5", 1], ["D5", 1], ["B4", 1], ["D5", 1], ["C5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.22, at: 0.2 });
        await spout;
        fx.caption("(only for important visitors)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Good Morning
    {
      id: 28276,
      y: 1959,
      run: async (fx) => {
        fx.filter("saturate(1.3) sepia(.12)", 5000, { fade: 400 });
        const boys = [0, 1, 2].map((i) => fx.put(A.S("0 0 40 70", '<circle cx="20" cy="12" r="9" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M11 8 C14 0 26 0 29 8" fill="#1d1a18"/><rect x="10" y="22" width="20" height="24" fill="' + ["#e0301c", "#2d7dd2", "#e0b34a"][i] + '" ' + A.ink + ' stroke-width="2"/><path d="M14 46 V68 M26 46 V68" ' + A.ink + '/>'), W() / 2 + (i - 1) * 50, H() * 0.66, { size: 40, h: 70 }));
        const tune = [["C5", 1], ["D5", 1], ["E5", 1], ["C5", 1], ["G5", 2], [null, 2]];
        for (let i = 0; i < 4; i++) {
          const b = boys[i % 3];
          fx.move(b, [{ transform: "none" }, { transform: "translateY(-10px)" }, { transform: "none" }], 300);
          fx.tone(fx.rand(90, 140), 0.25, { type: "sawtooth", vol: 0.25, filter: { freq: 300 }, slide: 60 });
          fx.noise(0.25, { type: "lowpass", freq: 250, vol: 0.4 });
          fx.put('<div style="font:700 14px Georgia,serif;color:#1d1a18">pfft</div>', fx.rect(b).x + 18, fx.rect(b).y + 20, { size: 40, h: 20, ms: 500 });
          fx.buzz(20);
          await fx.wait(700);
        }
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.22 });
        fx.caption("Ohayō!", { style: "card", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // Black Orpheus
    {
      id: 40423,
      y: 1959,
      run: async (fx) => {
        fx.wash("linear-gradient(#ffb347, #ff5e62 60%, #7b2ff7)", 5800, { fade: 600, blend: "multiply", opacity: 0.45 });
        for (let b = 0; b < 16; b++) {
          const t = b * 0.25;
          fx.thud({ freq: b % 4 === 0 ? 70 : 110, vol: b % 4 === 0 ? 0.35 : 0.15, dur: 0.12, at: t });
          if (b % 2) fx.click({ freq: 5000, vol: 0.15, at: t + 0.12 });
          fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.08, at: t + 0.06 });
        }
        const tune = [["A4", 3], ["B4", 1], ["C5", 2], ["E5", 2], ["D5", 3], ["C5", 1], ["B4", 2], ["A4", 2], ["G#4", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.09, beat: 0.25, vibrato: [5, 4] });
        fx.chord(["A3", "C4", "E4", "G4"], 4, { type: "sine", vol: 0.04 });
        fx.particles({ kind: "fall", count: 36, glyphs: ["#ffcf5a", "#ff5e62", "#5affc8", "#fff"].map((c) => A.petal(c)), min: 8, max: 14, dur: 3200, spin: 360, stagger: 2600 });
        fx.move([fx.$(".reely"), fx.$(".kernel")], [{ transform: "none" }, { transform: "translateY(-6px) rotate(-4deg)" }, { transform: "none" }, { transform: "translateY(-6px) rotate(4deg)" }, { transform: "none" }], { duration: 1000, iterations: 4 });
        await fx.wait(4400);
        const sun = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff6c0,#ffb347 60%,rgba(255,179,71,0) 72%)"></div>', W() / 2, H() + 40, { size: 180 });
        await fx.move(sun, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.25 + "px)" }], { duration: 1200, easing: "ease-out" });
      }
    },

    // House on Haunted Hill
    {
      id: 15856,
      y: 1959,
      run: async (fx) => {
        bw(fx, 5600, " brightness(.8)");
        fx.tone(220, 2, { type: "sine", vol: 0.12, vibrato: [6, 40], attack: 0.4 });
        fx.noise(1.8, { freq: 600, vol: 0.1, attack: 0.5 });
        const skel = A.S("0 0 60 110", '<circle cx="30" cy="12" r="10" fill="#f4f4f0" ' + A.ink + ' stroke-width="2"/><circle cx="26" cy="11" r="2.5" fill="' + A.INK + '"/><circle cx="34" cy="11" r="2.5" fill="' + A.INK + '"/>' +
          '<path d="M30 22 V60 M18 30 H42 M20 36 H40 M22 42 H38 M30 30 L10 50 M30 30 L50 50 M30 60 L20 100 M30 60 L40 100" stroke="#f4f4f0" stroke-width="4" stroke-linecap="round"/>');
        const wire = fx.put('<div style="width:1px;height:100%;background:rgba(255,255,255,.6);margin:0 auto"></div>', W() * 0.25, H() * 0.2, { size: 2, h: H() * 0.4 });
        void wire;
        await fx.fly(skel, [W() * 0.25, H() * 0.7], [W() * 0.75, H() * 0.25], { size: 60, h: 110, dur: 2400, via: [W() * 0.5, H() * 0.15], r0: -10, r1: 10, r2: -5, easing: "ease-in-out" });
        fx.caption("(on a wire, over the audience)", { style: "whisper", ms: 1400 });
        fx.noise(1, { type: "highpass", freq: 2500, vol: 0.5 });
        fx.tone(700, 1, { type: "sawtooth", vol: 0.08, slide: 1400 });
        fx.buzz([80, 40, 80]);
        await fx.wait(1600);
      }
    },

    // The Tingler
    {
      id: 26857,
      y: 1959,
      run: async (fx) => {
        bw(fx, 6000);
        fx.caption("Scream — scream for your lives!", { style: "card", ms: 1800 });
        fx.tone(90, 1.4, { type: "sawtooth", vol: 0.1, filter: { freq: 300 } });
        await fx.wait(1600);
        const bug = A.S("0 0 90 40", '<path d="M6 20 C10 8 30 6 50 10 C66 12 80 14 86 20 C80 26 66 28 50 30 C30 34 10 32 6 20 Z" fill="#6a5d50" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 7 }, (_, i) => '<path d="M' + (20 + i * 9) + " 10 L" + (18 + i * 9) + " 2 M" + (20 + i * 9) + " 30 L" + (18 + i * 9) + ' 38" ' + A.ink + ' stroke-width="2"/>').join("") + '<path d="M6 20 L0 14 M6 20 L0 26" ' + A.ink + ' stroke-width="2"/>');
        const r = fx.rect(fx.slot());
        const pulses = [];
        for (let i = 0; i < 12; i++) pulses.push(35, 45);
        fx.buzz(pulses);
        for (let t = 0; t < 1.9; t += 0.08) fx.noise(0.05, { type: "bandpass", freq: 180, q: 4, vol: 0.4, at: t });
        await fx.fly(bug, [W() + 50, r.y + 40], [-50, r.y - 40], { size: 90, h: 40, dur: 1900, via: [r.x, r.y + 10], flip: true, easing: "steps(20)" });
        fx.flash("#fff", 200);
        fx.caption("It's loose in this machine!", { style: "subtitle", ms: 1600 });
        fx.shake("md", 500);
        await fx.wait(1800);
      }
    },

    // The 400 Blows
    {
      id: 147,
      y: 1959,
      run: async (fx) => {
        bw(fx, 7000, " brightness(1.08)");
        fx.letterbox(7000, "9vh");
        const beach = fx.wash("linear-gradient(transparent 58%, rgba(210,210,205,.8) 58%, rgba(170,170,165,.9))", 7000, { fade: 600 });
        void beach;
        fx.sfx("wind", { dur: 4.3, vol: 0.45 });
        const boy = A.S("0 0 30 60", '<circle cx="15" cy="8" r="7" fill="#1d1a18"/><path d="M6 16 H24 L22 38 H8 Z" fill="#1d1a18"/><path d="M8 38 L2 58 M22 38 L28 58 M6 20 L0 34 M24 20 L30 32" stroke="#1d1a18" stroke-width="4"/>');
        fx.seq([["D5", 2], ["E5", 1], ["F5", 1], ["A5", 4], ["G5", 2], ["F5", 2], ["E5", 4]], { type: "triangle", vol: 0.06, beat: 0.35, at: 1 });
        await fx.fly(boy, [-30, H() * 0.66], [W() * 0.5, H() * 0.72], { size: 34, h: 68, dur: 4200, easing: "linear", keep: true });
        const face = fx.put(boy, W() * 0.5, H() * 0.72, { size: 34, h: 68 });
        if (!fx.reduced) fx.anim(face, [{ transform: "scale(1)" }, { transform: "scale(3.2)" }], { duration: 1000, easing: "ease-out" });
        fx.$$("#fx-layer .fx-sprite").forEach((el) => { if (el !== face) fx.remove(el); });
        fx.freeze(1600);
        fx.filter("grayscale(1) contrast(1.3)", 1600);
        await fx.wait(1600);
      }
    },

    // Pickpocket
    {
      id: 690,
      y: 1959,
      run: async (fx) => {
        bw(fx, 5600);
        const r = fx.rect(fx.slot());
        const others = fx.otherSlots(true).slice(0, 5);
        const hand = A.S("0 0 60 30", '<path d="M2 14 C10 6 30 6 40 10 L56 8 C60 8 60 14 56 14 L44 16 L56 20 C58 22 56 26 52 24 L34 22 C18 26 6 24 2 14 Z" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/>');
        const wallet = A.S("0 0 30 20", '<rect x="2" y="2" width="26" height="16" rx="2" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/>');
        fx.seq([["E4", 2], ["G4", 1], ["B4", 1], ["E5", 4]], { type: "sine", vol: 0.05, beat: 0.4 });
        for (const s of others) {
          const sr = fx.rect(s);
          await fx.fly(hand, [r.x, r.y], [sr.x, sr.y], { size: 50, h: 25, dur: 350, easing: "ease-in" });
          fx.click({ freq: 4000, vol: 0.25 });
          fx.fly(wallet, [sr.x, sr.y], [r.x, r.y], { size: 24, h: 16, dur: 450, easing: "ease-out" });
          await fx.wait(250);
        }
        fx.caption("Oh Jeanne, to reach you at last…", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
      }
    }
  ]);
})();
