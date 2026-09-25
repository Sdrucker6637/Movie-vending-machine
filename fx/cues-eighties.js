/* Machine FX cues - the eighties: cult comedies, Hong Kong action, world animation and art-house.
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
  const fullSvg = (fx, svg, style) => {
    const el = fx.node(svg, { cls: "fx-filter", style });
    const s = el.firstChild;
    if (s && s.setAttribute) { s.setAttribute("preserveAspectRatio", "none"); s.style.width = s.style.height = "100%"; }
    return el;
  };
  const synthBass = (fx, notes, beat, at) => fx.seq(notes, { type: "sawtooth", vol: 0.06, beat, at, filter: { freq: 600, q: 4 } });
  const doves = (fx, n, from) => {
    const dove = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#fff" stroke="#aaa" stroke-width=".8"/>');
    for (let i = 0; i < n; i++) fx.later(i * 90, () => fx.fly(dove, from, [from[0] + fx.rand(-W() / 2, W() / 2), -40], { size: 40, h: 24, dur: 1500 + fx.rand(0, 600), easing: "ease-out" }));
    fx.noise(1.4, { type: "bandpass", freq: 1500, q: 1, vol: 0.25 });
  };

  M.register([
    // Fitzcarraldo
    {
      id: 9343,
      y: 1982,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(30,70,30,.3), rgba(10,40,10,.5))", 7000, { fade: 500 });
        const hill = fullSvg(fx, A.S("0 0 400 300", '<path d="M0 300 L0 260 C100 250 150 120 220 110 C280 100 340 200 400 240 V300 Z" fill="rgba(30,50,20,.8)"/>'));
        void hill;
        const ship = fx.put(A.S("0 0 160 80", '<path d="M8 50 H152 L138 72 H22 Z" fill="#f4f0e6" ' + A.ink + '/><rect x="36" y="30" width="80" height="20" fill="#e8e0c8" ' + A.ink + ' stroke-width="2"/><rect x="64" y="8" width="12" height="22" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><path d="M20 52 L4 40 M140 52 L156 40" stroke="#6b4a2a" stroke-width="2"/>'),
          W() * 0.15, H() * 0.8, { size: 160, h: 80 });
        const aria = [["F4", 3], ["A4", 1], ["C5", 2], ["F5", 2], ["E5", 2], ["D5", 1], ["C5", 1], ["Bb4", 2], ["A4", 4]];
        fx.seq(aria, { type: "sawtooth", vol: 0.06, beat: 0.35, filter: { freq: 1300 }, vibrato: [5.5, 8], attack: 0.08 });
        fx.chord(["F3", "C4"], 6, { type: "triangle", vol: 0.04, attack: 1 });
        for (let i = 0; i < 10; i++) fx.tone(fx.rand(60, 90), 0.4, { type: "sawtooth", vol: 0.06, slide: 40, at: i * 0.55, filter: { freq: 250 } });
        await fx.move(ship, [{ transform: "none" }, { transform: "translate(" + W() * 0.35 + "px," + -H() * 0.42 + "px) rotate(-18deg)" }], { duration: 5200, easing: "steps(26)" });
        fx.caption("(over the mountain)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Koyaanisqatsi
    {
      id: 11314,
      y: 1982,
      run: async (fx) => {
        const sky = fx.wash("linear-gradient(#10182a, #2a3a6a)", 7400, { fade: 400, blend: "multiply", opacity: 0.6 });
        void sky;
        fx.tempo(4, 7000);
        const organ = ["C2", "C2", "C2", "C2"];
        organ.forEach((n, i) => fx.tone(n, 1.4, { type: "sawtooth", vol: 0.08, at: i * 1.6, filter: { freq: 300 }, attack: 0.1 }));
        fx.caption("koyaanisqatsi", { style: "whisper", ms: 1600, css: { color: "#fff", letterSpacing: ".4em" } });
        const arp = [];
        for (let i = 0; i < 28; i++) arp.push([["C5", "E5", "G5", "C6"][i % 4], 1]);
        fx.seq(arp, { type: "triangle", vol: 0.06, beat: 0.12, at: 1.8 });
        for (let i = 0; i < 20; i++) {
          fx.later(1800 + i * 200, () => fx.fly(streakSvg(fx.pick(["#fff4b0", "#ff5a5a"])), [-40, H() * fx.rand(0.5, 0.9)], [W() + 40, H() * fx.rand(0.5, 0.9)], { size: 120, h: 4, dur: 500 }));
        }
        fx.particles({ kind: "drift", count: 40, glyphs: dot("#fff6c0"), min: 2, max: 4, dur: 600, stagger: 5000 });
        await fx.wait(6200);
        fx.caption("life out of balance", { style: "whisper", ms: 1200, css: { color: "#fff" } });
        await fx.wait(1100);
        function streakSvg(c) { return box("background:linear-gradient(90deg, transparent, " + c + ");border-radius:2px"); }
      }
    },

    // The King of Comedy
    {
      id: 262,
      y: 1982,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(1.1)", 6000, { fade: 300 });
        const cut = fx.put(A.S("0 0 60 110", '<rect x="8" y="30" width="44" height="80" fill="#e8d6c0" stroke="#8a7a62" stroke-width="2"/><circle cx="30" cy="18" r="14" fill="#f2d6b3" stroke="#8a7a62" stroke-width="2"/><path d="M22 34 H38 L30 60 Z" fill="#b3402d"/><path d="M4 110 H56" stroke="#8a7a62" stroke-width="4"/>'),
          r.x + r.width * 0.8, r.y + 10, { size: 50, h: 92 });
        void cut;
        fx.caption("Better to be king for a night…", { style: "subtitle", ms: 1800 });
        const tune = [["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 2], ["E5", 1], ["C5", 1], ["D5", 4]];
        fx.seq(tune, { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2400 }, at: 0.2 });
        await fx.wait(2000);
        for (let i = 0; i < 18; i++) fx.noise(0.08, { type: "bandpass", freq: fx.rand(800, 2400), q: 2, vol: 0.18, at: i * 0.06 + fx.rand(0, 0.5) });
        fx.caption("…than schmuck for a lifetime.", { style: "subtitle", ms: 1800 });
        fx.style(fx.slot(), { boxShadow: "0 0 0 3px #ffd23b, 0 0 30px 8px rgba(255,210,60,.8)" }, 2400);
        await fx.wait(2400);
      }
    },

    // Fanny and Alexander
    {
      id: 5961,
      y: 1982,
      run: async (fx) => {
        fx.wash("radial-gradient(circle at 50% 50%, rgba(255,210,140,.2), rgba(90,20,10,.6))", 7000, { fade: 700 });
        const theatre = fx.put(A.S("0 0 120 100", '<rect x="6" y="20" width="108" height="76" fill="#6b1d2a" ' + A.ink + '/><rect x="20" y="30" width="80" height="54" fill="#1d1a18"/><path d="M20 30 C40 50 40 70 20 84 Z M100 30 C80 50 80 70 100 84 Z" fill="#b3122a"/><path d="M6 20 L60 2 L114 20" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/>'),
          W() / 2, H() * 0.42, { size: 170, h: 142 });
        void theatre;
        const lantern = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle, rgba(255,255,230,.9), transparent 70%)"></div>', W() / 2, H() * 0.44, { size: 80 });
        fx.move(lantern, [{ transform: "none" }, { transform: "translate(-20px,-10px)" }, { transform: "translate(20px,5px)" }, { transform: "none" }], { duration: 4000 });
        const tune = [["G4", 1], ["C5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["B4", 2], ["C5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.35 });
        fx.chord(["C4", "E4", "G4"], 3, { type: "sine", vol: 0.04, attack: 0.5, at: 1 });
        await fx.wait(3200);
        fx.caption("Everything can happen.", { style: "subtitle", ms: 2200 });
        fx.particles({ kind: "fall", count: 20, glyphs: A.snowflake, min: 5, max: 9, dur: 3000 });
        await fx.wait(2600);
      }
    },

    // The Last Unicorn
    {
      id: 10150,
      y: 1982,
      run: async (fx) => {
        const uni = A.S("0 0 120 90", '<path d="M20 50 C24 34 56 30 76 34 L86 20 C90 14 98 16 98 22 L96 36 C98 42 94 46 88 46 L84 48 L86 86 H80 L74 52 H40 L34 86 H28 L30 52 C22 52 16 56 20 50 Z" fill="#fbfbf4" ' + A.ink + ' stroke-width="2"/><path d="M92 18 L108 2" stroke="#f2c94c" stroke-width="3"/><path d="M76 34 C70 24 76 14 82 16 M20 50 C8 54 4 66 10 72" stroke="#e8e0f4" stroke-width="4" fill="none"/><circle cx="92" cy="30" r="2" fill="' + A.INK + '"/>');
        fx.wash("linear-gradient(rgba(180,200,255,.25), rgba(80,60,140,.35))", 6400, { fade: 500 });
        const tune = [["E5", 2], ["G5", 1], ["A5", 1], ["B5", 3], ["A5", 1], ["G5", 2], ["E5", 2], ["D5", 1], ["E5", 1], ["G5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.1, beat: 0.3, vibrato: [5, 5] });
        fx.chord(["E4", "G4", "B4"], 5, { type: "triangle", vol: 0.03, attack: 1 });
        fx.particles({ kind: "drift", count: 24, glyphs: A.sparkle("#fff"), min: 5, max: 12, dur: 2600, stagger: 3400 });
        await fx.fly(uni, [-120, H() * 0.6], [W() + 120, H() * 0.45], { size: 140, h: 105, dur: 4600, via: [W() / 2, H() * 0.38], easing: "ease-in-out" });
        const r = fx.rect(fx.slot());
        const bull = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle at 50% 60%, rgba(255,60,30,.7), transparent 60%)"></div>', r.x, r.y, { size: r.width * 2, h: r.height * 2 });
        fx.tone(60, 1.2, { type: "sawtooth", vol: 0.1, filter: { freq: 200 } });
        await fx.fadeOut(bull, 1200);
      }
    },

    // The Secret of NIMH
    {
      id: 11704,
      y: 1982,
      run: async (fx) => {
        const dark = fx.wash("radial-gradient(circle at 50% 45%, rgba(0,0,0,.1), rgba(0,0,0,.85) 60%)", 6400, { fade: 500 });
        void dark;
        const r = fx.rect(fx.slot());
        const amulet = fx.put(A.S("0 0 60 80", '<path d="M30 4 C44 4 50 14 46 20 H14 C10 14 16 4 30 4 Z" fill="none" stroke="#c9a24a" stroke-width="2"/><path d="M30 20 L50 44 L30 76 L10 44 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/><path d="M30 30 L42 44 L30 64 L18 44 Z" fill="#e0301c"/>'),
          r.x, r.y, { size: 60, h: 80 });
        fx.chord(["D4", "F4", "A4"], 3, { type: "sine", vol: 0.05, attack: 1 });
        fx.caption("You can unlock any door if you only have the key.", { style: "subtitle", ms: 2400 });
        await fx.wait(2400);
        fx.style(amulet, { filter: "drop-shadow(0 0 12px #ff4a2a) drop-shadow(0 0 24px #ff8a2a)" });
        fx.tone(220, 2.4, { type: "sawtooth", vol: 0.06, slide: 880, filter: { freq: 2000 } });
        fx.chord(["D5", "F#5", "A5", "D6"], 2, { type: "sine", vol: 0.06, attack: 0.4, at: 0.6 });
        fx.particles({ kind: "burst", from: amulet, count: 30, spread: 80, glyphs: [dot("#ff8a2a"), dot("#fff0a0"), A.sparkle("#ff4a2a")], min: 4, max: 12, dur: 1600, stagger: 900 });
        const others = fx.otherSlots(true).slice(0, 6);
        fx.move(others, [{ transform: "none" }, { transform: "translateY(-14px)" }, { transform: "none" }], { duration: 1600, fill: "none" });
        fx.buzz([40, 40, 80]);
        await fx.wait(2600);
      }
    },

    // Zelig
    {
      id: 11030,
      y: 1983,
      run: async (fx) => {
        const s = fx.slot();
        fx.filter("grayscale(1) contrast(1.1)", 6600, { fade: 300 });
        fx.node("", { cls: "fx-filter fx-grain", ms: 6600 });
        A.projector(fx, 6);
        fx.sfx("projector", { dur: 5.8, vol: 0.4, fadeIn: 400 });
        const looks = [
          { label: "", filter: "none" },
          { label: "", filter: "sepia(1) brightness(.9)" },
          { label: "", filter: "brightness(.55)" },
          { label: "", filter: "contrast(1.8)" }
        ];
        const hats = [
          '<path d="M36 26 H84 L74 6 H46 Z" fill="#1d1a18"/><path d="M28 28 H92" stroke="#1d1a18" stroke-width="5"/>',
          '<path d="M40 24 C40 6 80 6 80 24 Z" fill="#b3402d"/><path d="M60 6 V0" stroke="#1d1a18" stroke-width="3"/>',
          '<path d="M34 30 C34 10 86 10 86 30 Z M30 30 H90" fill="#f4efe2" stroke="#1d1a18" stroke-width="3"/>',
          '<path d="M44 28 L60 4 L76 28 Z" fill="#3f7877" stroke="#1d1a18" stroke-width="2"/>'
        ];
        const who = ["(a doctor)", "(a jazz musician)", "(a boxer)", "(a pilot)"];
        for (let i = 0; i < 4; i++) {
          fx.costume(".reely", hats[i], 1400);
          if (s) fx.style(s, { filter: looks[i].filter }, 1400);
          fx.caption(who[i], { style: "whisper", ms: 1200 });
          fx.sfx("click", { vol: 0.5 });
          fx.tone(fx.pick(["C4", "E4", "G4", "A4"]), 0.3, { type: "triangle", vol: 0.06 });
          await fx.wait(1450);
        }
        fx.caption("The Chameleon Man", { style: "intertitle", ms: 1000 });
        await fx.wait(900);
      }
    },

    // Rumble Fish
    {
      id: 232,
      y: 1983,
      run: async (fx) => {
        A.liftSlot(fx, 6400);
        fx.filter("grayscale(1) contrast(1.3)", 6400, { fade: 400 });
        fx.style(fx.slot(), { filter: "grayscale(1) contrast(1.3)" }, 6400);
        const r = fx.rect(fx.slot());
        const tank = fx.put('<div style="width:100%;height:100%;border:2px solid rgba(255,255,255,.7);background:rgba(200,220,230,.15)"></div>', W() / 2, H() * 0.72, { size: 180, h: 80 });
        void tank;
        const fishes = [];
        const cols = ["#d51f2a", "#3a6ad8", "#d51f2a", "#3a6ad8"];
        for (let i = 0; i < 4; i++) {
          const f = fx.put(A.fish(cols[i]), W() / 2 - 60 + i * 38, H() * 0.72 + (i % 2 ? 10 : -10), { size: 34, h: 20 });
          fishes.push(f);
          fx.move(f, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? -20 : 20) + "px) scaleX(-1)" }, { transform: "none" }], { duration: 1800, iterations: 3 });
        }
        for (let t = 0; t < 5; t += 0.25) fx.click({ freq: 1200, vol: 0.2, at: t });
        fx.tone(90, 5, { type: "sawtooth", vol: 0.04, filter: { freq: 300 } });
        await fx.wait(2400);
        fx.caption("(only the fish are in colour)", { style: "whisper", ms: 1800 });
        fx.particles({ kind: "sweep", count: 20, glyphs: box("background:rgba(255,255,255,.5)"), min: 20, max: 40, dur: 400, stagger: 2000 });
        await fx.wait(2600);
        void r;
      }
    },

    // Stop Making Sense
    {
      id: 24128,
      y: 1984,
      run: async (fx) => {
        const r = fx.rect(fx.$(".reely"));
        const suit = fx.costume(".reely", '<path d="M10 70 H110 L118 150 H2 Z" fill="#e8e4da" stroke="#1f1b16" stroke-width="3"/><path d="M60 70 V150 M40 90 H80" stroke="#bbb" stroke-width="2"/>', 7000);
        void suit;
        const beat = 0.23;
        for (let i = 0; i < 24; i++) {
          fx.thud({ freq: 60, vol: i % 4 === 0 ? 0.35 : 0.12, dur: 0.12, at: i * beat });
          if (i % 2) fx.noise(0.05, { type: "highpass", freq: 8000, vol: 0.12, at: i * beat });
          if (i % 4 === 2) fx.noise(0.12, { type: "bandpass", freq: 1800, q: 1, vol: 0.2, at: i * beat });
        }
        synthBass(fx, [["E2", 2], ["E2", 1], ["G2", 1], ["A2", 2], ["E2", 2], ["B2", 2], ["A2", 2], ["G2", 2], ["E2", 2]], beat, 0);
        const reely = fx.$(".reely");
        for (let i = 0; i < 12; i++) {
          fx.move(reely, [{ transform: "none" }, { transform: "translateY(-4px) rotate(" + (i % 2 ? 5 : -5) + "deg) scaleY(" + (i % 2 ? 1.04 : 0.98) + ")" }], { duration: beat * 1000, fill: "forwards" });
          await fx.wait(beat * 2000);
        }
        fx.caption("(same as it ever was)", { style: "whisper", ms: 1000 });
        void r;
      }
    },

    // Repo Man
    {
      id: 13820,
      y: 1984,
      run: async (fx) => {
        const car = A.S("0 0 110 50", '<path d="M6 34 C6 24 16 22 26 20 L40 8 H74 L88 20 C100 22 106 26 106 34 V38 H6 Z" fill="#7aa6a0" ' + A.ink + '/><path d="M44 12 H56 V20 H36 Z M60 12 H72 L82 20 H60 Z" fill="#cfe9f0" ' + A.ink + ' stroke-width="2"/><circle cx="26" cy="40" r="8" fill="#1d1a18"/><circle cx="86" cy="40" r="8" fill="#1d1a18"/>');
        const r = fx.rect(fx.slot());
        const c = fx.put(car, r.x, r.top + r.height + 30, { size: 110, h: 50 });
        const glow = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle, rgba(120,255,140,.9), rgba(120,255,140,0) 65%)"></div>', r.x, r.top + r.height + 30, { size: 180 });
        fx.move(glow, [{ opacity: 0.3, transform: "scale(.8)" }, { opacity: 1, transform: "scale(1.2)" }, { opacity: 0.3, transform: "scale(.8)" }], { duration: 800, iterations: 4 });
        fx.tone(90, 3, { type: "sawtooth", vol: 0.05, vibrato: [3, 10], filter: { freq: 600 } });
        fx.noise(3, { type: "bandpass", freq: 3000, q: 4, vol: 0.05 });
        fx.caption("(don't open the trunk)", { style: "whisper", ms: 2400 });
        await fx.wait(3200);
        fx.flash("rgba(140,255,160,.7)", 300);
        fx.tone(200, 1.6, { type: "sine", slide: 1600, vol: 0.08 });
        await fx.move([c, glow], [{ transform: "none" }, { transform: "translateY(-" + H() + "px)" }], { duration: 1600, easing: "ease-in" });
        fx.caption("The life of a repo man is always intense.", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Stranger Than Paradise
    {
      id: 469,
      y: 1984,
      run: async (fx) => {
        const black = fx.node("", { cls: "fx-filter", style: { background: "#0b0907", opacity: 0 } });
        fx.filter("grayscale(1) contrast(1.1)", 7200, { fade: 200 });
        const shots = ["", "", ""];
        const scream = [["G4", 1], ["Bb4", 1], ["D5", 2], ["C5", 1], ["Bb4", 1], ["G4", 2]];
        for (let i = 0; i < shots.length; i++) {
          black.style.opacity = 0;
          if (i === 0) fx.seq(scream, { type: "sawtooth", vol: 0.04, beat: 0.25, filter: { freq: 1200 }, vibrato: [5, 5] });
          fx.noise(1.6, { freq: 400, vol: 0.04 });
          await fx.wait(1500);
          black.style.opacity = 1;
          fx.click({ freq: 800, vol: 0.2 });
          await fx.wait(700);
        }
        black.style.opacity = 0;
        fx.caption("(you know, it's funny… you come to someplace new, and everything looks just the same)", { style: "subtitle", ms: 1600, css: { fontSize: "13px" } });
        await fx.wait(1500);
      }
    },

    // Nausicaä of the Valley of the Wind
    {
      id: 81,
      y: 1984,
      run: async (fx) => {
        const field = fx.wash("linear-gradient(#d8e8f0, #c9b27a)", 7000, { fade: 600, blend: "multiply", opacity: 0.5 });
        void field;
        const glider = A.S("0 0 120 40", '<path d="M4 20 L60 10 L116 20 L60 26 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="60" cy="24" r="5" fill="#3a6ad8"/>');
        fx.noise(6, { type: "bandpass", freq: 1200, sweep: 600, q: 0.6, vol: 0.25, attack: 0.6, pan: -1, panTo: 1 });
        const tune = [["E5", 2], ["D5", 1], ["E5", 1], ["G5", 2], ["E5", 2], ["D5", 2], ["C5", 2], ["D5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.09, beat: 0.3, vibrato: [5, 4] });
        fx.fly(glider, [-120, H() * 0.3], [W() + 120, H() * 0.2], { size: 130, h: 44, dur: 3000, via: [W() / 2, H() * 0.12], easing: "ease-in-out" });
        await fx.wait(2400);
        const ohm = A.S("0 0 140 80", '<path d="M6 60 C6 20 40 6 70 6 C100 6 134 20 134 60 C120 74 20 74 6 60 Z" fill="#8a6a3a" ' + A.ink + '/>' +
          [30, 50, 70, 90, 110].map((x) => '<path d="M' + (x - 10) + " 40 C" + (x - 6) + " 20 " + (x + 6) + " 20 " + (x + 10) + ' 40" stroke="#6b4a2a" stroke-width="3" fill="none"/>').join("") +
          '<circle class="e" cx="36" cy="54" r="6" fill="#d51f2a"/><circle class="e" cx="56" cy="58" r="6" fill="#d51f2a"/><circle class="e" cx="84" cy="58" r="6" fill="#d51f2a"/><circle class="e" cx="104" cy="54" r="6" fill="#d51f2a"/>');
        const o = fx.put(ohm, W() / 2, H() * 0.72, { size: 180, h: 104 });
        fx.move(o, [{ transform: "translateX(" + W() + "px)" }, { transform: "none" }], { duration: 1400, easing: "ease-out" });
        fx.tone(70, 1.6, { type: "sawtooth", vol: 0.1, filter: { freq: 300 } });
        await fx.wait(1600);
        o.querySelectorAll(".e").forEach((e) => e.setAttribute("fill", "#3a8ad8"));
        fx.chord(["E4", "G#4", "B4", "E5"], 1.8, { type: "sine", vol: 0.06, attack: 0.3 });
        fx.caption("(the Ohm's eyes turn blue)", { style: "whisper", ms: 1600 });
        fx.particles({ kind: "rise", from: o, count: 18, glyphs: A.sparkle("#f2e6a0"), min: 6, max: 12, dur: 1600 });
        await fx.wait(1800);
      }
    },

    // Angel's Egg
    {
      id: 15916,
      y: 1985,
      run: async (fx) => {
        const dark = fx.wash("linear-gradient(#0d1a2a, #1d2a3a)", 7000, { fade: 1000, opacity: 0.85 });
        void dark;
        fx.particles({ kind: "fall", count: 60, glyphs: A.drop("#9ab"), min: 3, max: 6, dur: 1400, stagger: 6000 });
        fx.noise(7, { type: "highpass", freq: 2500, vol: 0.06, attack: 1 });
        fx.chord(["D3", "A3", "E4"], 7, { type: "sine", vol: 0.05, attack: 2.4 });
        const egg = fx.put('<div style="width:100%;height:100%;border-radius:50% 50% 46% 46% / 60% 60% 40% 40%;background:radial-gradient(circle at 40% 35%, #fff, #dfe6ea 60%, #8a9aa4)"></div>', W() / 2, H() * 0.5, { size: 60, h: 76 });
        fx.move(egg, [{ transform: "none" }, { transform: "translateY(-8px)" }, { transform: "none" }], { duration: 2600, iterations: 2 });
        await fx.wait(3200);
        const fish = A.S("0 0 120 50", '<path d="M8 25 C30 4 80 4 100 25 C80 46 30 46 8 25 Z M100 25 L118 10 V40 Z" fill="rgba(0,0,0,.6)"/>');
        for (let i = 0; i < 3; i++) fx.fly(fish, [-120, H() * (0.2 + i * 0.15)], [W() + 120, H() * (0.24 + i * 0.15)], { size: 140, h: 58, dur: 3000, easing: "linear" });
        fx.tone(55, 3, { type: "sawtooth", vol: 0.05, filter: { freq: 200 } });
        await fx.wait(3000);
      }
    },

    // After Hours
    {
      id: 10843,
      y: 1985,
      run: async (fx) => {
        fx.wash("rgba(20,20,50,.45)", 6400, { fade: 300 });
        const bill = A.bill;
        const r = fx.rect(fx.slot());
        fx.noise(0.8, { type: "bandpass", freq: 1600, q: 1, vol: 0.2 });
        await fx.fly(bill, [r.x, r.y], [W() + 60, -40], { size: 60, h: 30, dur: 900, r2: 400, easing: "ease-in" });
        fx.caption("(his last $20 just blew out the cab window)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const tick = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4, 2.7];
        tick.forEach((t) => fx.click({ freq: 2400, vol: 0.2, at: t }));
        const clock = fx.put('<div style="font:700 26px/1 \'Special Elite\',\'Courier New\',monospace;color:#ff3b3b;background:#0b0907;padding:4px 8px;border-radius:3px;text-align:center">2:47</div>', W() / 2, H() * 0.3, { size: 100, h: 36 });
        for (let i = 0; i < 6; i++) { clock.firstChild.textContent = "2:4" + (7 + i) % 10; await fx.wait(450); }
        const mob = fx.otherSlots(true).slice(0, 6);
        fx.move(mob, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 300, iterations: 4, fill: "none" });
        fx.caption("I just wanted to leave my apartment, maybe meet a nice girl…", { style: "subtitle", ms: 2000, css: { fontSize: "14px" } });
        await fx.wait(2000);
      }
    },

    // Tampopo
    {
      id: 11830,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bowl = fx.put(A.S("0 0 100 70", '<path d="M6 24 H94 C92 52 72 66 50 66 C28 66 8 52 6 24 Z" fill="#d51f2a" ' + A.ink + '/><ellipse cx="50" cy="24" rx="44" ry="8" fill="#e8c890" ' + A.ink + ' stroke-width="2"/><circle cx="32" cy="22" r="6" fill="#f4e0a0" stroke="#c9a24a"/><path d="M50 18 H70 V24 H50 Z" fill="#b87050"/><circle cx="64" cy="20" r="4" fill="#3a6a2a"/><path d="M20 22 C30 26 40 18 48 24 M56 26 C66 22 74 28 84 22" stroke="#f4e0a0" stroke-width="2" fill="none"/>'),
          r.x, r.y + 10, { size: 100, h: 70 });
        fx.particles({ kind: "rise", from: pt(r.x, r.y - 10, 80, 10), count: 14, glyphs: dot("rgba(255,255,255,.6)"), min: 10, max: 22, dur: 1800, stagger: 3000 });
        fx.caption("First, observe the whole bowl.", { style: "subtitle", ms: 1800 });
        await fx.wait(1900);
        fx.caption("Caress the surface with the chopstick tips.", { style: "subtitle", ms: 1800 });
        const sticks = fx.put(A.S("0 0 100 20", '<path d="M4 6 L96 2 M4 14 L96 18" stroke="#c9a24a" stroke-width="3" stroke-linecap="round"/>'), r.x + 20, r.y - 10, { size: 90, h: 18, style: { transform: "rotate(-20deg)" } });
        fx.move(sticks, [{ transform: "rotate(-20deg)" }, { transform: "rotate(-10deg) translateX(-10px)" }, { transform: "rotate(-20deg)" }], { duration: 900, iterations: 2 });
        await fx.wait(1900);
        fx.caption("Apologize to the pork.", { style: "subtitle", ms: 1400 });
        for (let i = 0; i < 6; i++) fx.noise(0.2, { type: "bandpass", freq: 900 + i * 100, q: 3, vol: 0.2, at: 0.3 + i * 0.25 });
        await fx.wait(1600);
        void bowl;
      }
    },

    // Mr. Vampire
    {
      id: 67342,
      y: 1985,
      run: async (fx) => {
        fx.wash("rgba(40,60,50,.4)", 6400, { fade: 400 });
        const jiang = A.S("0 0 50 90", '<path d="M14 6 H36 V14 H14 Z" fill="#1d1a18"/><circle cx="25" cy="22" r="10" fill="#b8c8b0" ' + A.ink + ' stroke-width="2"/><rect x="20" y="16" width="10" height="16" fill="#f2c94c" stroke="#b3402d"/><path d="M22 20 H28 M22 24 H28 M25 18 V30" stroke="#b3402d" stroke-width="1"/><path d="M12 34 H38 L40 80 H10 Z" fill="#2d3b55" ' + A.ink + ' stroke-width="2"/><path d="M14 38 H-6 M36 38 H56" stroke="#2d3b55" stroke-width="6" stroke-linecap="round"/><path d="M16 80 V88 M34 80 V88" stroke="#1d1a18" stroke-width="5"/>');
        const j = fx.put(jiang, W() * 0.15, H() * 0.68, { size: 60, h: 108 });
        for (let i = 0; i < 8; i++) {
          if (!fx.reduced) j.style.transform = "translate(" + (i + 1) * W() * 0.08 + "px," + (i % 2 ? -26 : 0) + "px)";
          fx.thud({ freq: 110, vol: 0.3, dur: 0.12 });
          fx.tone(fx.pick(["D5", "E5", "A5"]), 0.12, { type: "triangle", vol: 0.05 });
          await fx.wait(380);
        }
        fx.caption("(hold your breath!)", { style: "subtitle", ms: 1800 });
        fx.style(j, { filter: "drop-shadow(0 0 6px #fff)" });
        await fx.wait(1400);
        fx.put(A.S("0 0 20 60", '<rect x="2" y="2" width="16" height="56" fill="#f2c94c"/><path d="M6 10 H14 M10 6 V54 M6 30 H14 M6 44 H14" stroke="#b3402d" stroke-width="2"/>'), fx.rect(j).x, fx.rect(j).y - 30, { size: 20, h: 60, ms: 1400 });
        fx.click({ freq: 900, vol: 0.5 });
        await fx.wait(1400);
      }
    },

    // Police Story
    {
      id: 9056,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pole = fx.put('<div style="width:100%;height:100%;background:repeating-linear-gradient(0deg,#ffe9a0 0 8px,#fff6c0 8px 16px);box-shadow:0 0 12px #ffe9a0"></div>', W() / 2, H() / 2, { size: 12, h: H() });
        void pole;
        const man = A.S("0 0 40 60", '<circle cx="20" cy="8" r="7" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M10 16 H30 L28 40 H12 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M12 18 L4 4 M28 18 L36 4 M14 40 L10 58 M26 40 L30 58" ' + A.ink + '/>');
        fx.tone(900, 1.4, { type: "sawtooth", vol: 0.05, slide: 200, filter: { freq: 2000 } });
        await fx.fly(man, [W() / 2, 20], [W() / 2, H() - 60], { size: 40, h: 60, dur: 1400, easing: "ease-in" });
        for (let i = 0; i < 10; i++) {
          const bulb = fx.put(dot("#fff6c0"), W() / 2 + fx.rand(-20, 20), fx.rand(0, H()), { size: 8 });
          fx.move(bulb, [{ transform: "none", opacity: 1 }, { transform: "translate(" + fx.rand(-60, 60) + "px," + fx.rand(-40, 40) + "px)", opacity: 0 }], 500);
          fx.noise(0.08, { type: "highpass", freq: 5000, vol: 0.3, at: i * 0.05 });
        }
        fx.flash("#fff", 140);
        fx.thud({ vol: 0.9, freq: 50 });
        fx.noise(0.5, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.shake("md", 500);
        fx.buzz([80, 40, 80]);
        await fx.wait(700);
        fx.caption("(and again, from two more angles)", { style: "whisper", ms: 1400 });
        await fx.wait(1500);
        void r;
      }
    },

    // Return to Oz
    {
      id: 13155,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.8) sepia(.15)", 6400, { fade: 400 });
        const heads = fx.otherSlots(true).slice(0, 6);
        for (const h of heads) {
          const hr = fx.rect(h);
          fx.put(A.S("0 0 40 50", '<rect x="4" y="4" width="32" height="42" rx="4" fill="rgba(200,230,255,.3)" stroke="#c9a24a" stroke-width="2"/><ellipse cx="20" cy="22" rx="10" ry="13" fill="#f2d6b3"/><circle cx="16" cy="20" r="1.5" fill="#1d1a18"/><circle cx="24" cy="20" r="1.5" fill="#1d1a18"/>'), hr.x, hr.y, { size: Math.min(hr.width, 50), h: Math.min(hr.height, 62) });
          fx.tone(fx.rand(900, 1400), 0.3, { type: "sine", vol: 0.04 });
          await fx.wait(200);
        }
        fx.caption("Dorothy Gale…", { style: "whisper", ms: 1600 });
        fx.tone(1600, 1.4, { type: "sine", vol: 0.07, vibrato: [6, 30], slide: 1200 });
        fx.noise(1.4, { type: "highpass", freq: 3500, vol: 0.12 });
        await fx.wait(1800);
        const wheeler = A.S("0 0 50 60", '<circle cx="25" cy="12" r="10" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/><path d="M14 22 H36 L38 40 H12 Z" fill="#6a3bff" ' + A.ink + ' stroke-width="2"/><circle cx="8" cy="52" r="7" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><circle cx="42" cy="52" r="7" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M12 40 L8 52 M38 40 L42 52" ' + A.ink + '/>');
        for (let i = 0; i < 3; i++) fx.later(i * 300, () => fx.fly(wheeler, [W() + 40, H() - 60], [-40, H() - 60], { size: 50, h: 60, dur: 1800, flip: true }));
        fx.tone(700, 1.8, { type: "square", vol: 0.03, vibrato: [14, 50], filter: { freq: 1400 } });
        await fx.wait(2400);
        void r;
      }
    },

    // Pee-wee's Big Adventure
    {
      id: 5683,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const bike = A.S("0 0 120 70", '<circle cx="24" cy="52" r="16" fill="none" ' + A.ink + ' stroke-width="4"/><circle cx="96" cy="52" r="16" fill="none" ' + A.ink + ' stroke-width="4"/><path d="M24 52 L50 26 H86 L96 52 M50 26 L60 52 L86 26" fill="none" stroke="#d51f2a" stroke-width="6"/><path d="M40 20 C40 10 60 10 60 20 Z" fill="#fff" ' + A.ink + ' stroke-width="2"/><path d="M84 18 L94 10 H104" ' + A.ink + '/><circle cx="104" cy="10" r="3" fill="#c9a24a"/>');
        const b = fx.put(bike, r.x, r.top + r.height + 40, { size: 120, h: 70 });
        fx.tone(2400, 0.15, { type: "sine", vol: 0.1 });
        fx.tone(2400, 0.15, { type: "sine", vol: 0.1, at: 0.25 });
        await fx.wait(700);
        fx.caption("Tequila!", { style: "hand", ms: 2400 });
        const beat = 0.2;
        const riff = [["E4", 1], [null, 1], ["E4", 1], ["G4", 1], ["A4", 2], ["E4", 2], ["D4", 1], ["E4", 1], ["G4", 2]];
        fx.seq(riff, { type: "sawtooth", vol: 0.06, beat, filter: { freq: 1600 } });
        for (let i = 0; i < 12; i++) fx.thud({ freq: 90, vol: 0.2, dur: 0.1, at: i * beat });
        const reely = fx.$(".reely"), kernel = fx.$(".kernel");
        fx.move([reely, kernel], [{ transform: "none" }, { transform: "translateY(-10px) rotate(-6deg)" }, { transform: "none" }, { transform: "translateY(-10px) rotate(6deg)" }, { transform: "none" }], { duration: 800, iterations: 3 });
        await fx.wait(2600);
        await fx.move(b, [{ transform: "none" }, { transform: "translateX(" + W() + "px)" }], { duration: 700, easing: "ease-in" });
      }
    },

    // Real Genius
    {
      id: 14370,
      y: 1985,
      run: async (fx) => {
        const rg = fx.rect(fx.$("#grid"));
        const beam = fx.put(box("background:linear-gradient(90deg, transparent, #ff2020 40%, #fff 50%, #ff2020 60%, transparent);box-shadow:0 0 12px #ff2020"), rg.x, rg.top - 40, { size: 8, h: H() });
        beam.style.opacity = 0;
        fx.tone(1200, 1.2, { type: "sawtooth", vol: 0.06, slide: 2400, filter: { freq: 3000 } });
        fx.anim(beam, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 1000 });
        await fx.wait(1100);
        const kernel = A.S("0 0 30 30", '<path d="M15 3 C22 3 26 8 24 13 C29 14 29 22 23 24 C22 29 14 29 12 25 C6 27 2 21 5 17 C1 13 5 6 10 7 C11 4 13 3 15 3 Z" fill="#fffbe8" stroke="#d9c07a" stroke-width="1.5"/>');
        const fill = fx.glass('<div style="position:absolute;left:0;right:0;bottom:0;height:0;background:radial-gradient(circle at 20% 30%, #fffbe8 0 6px, transparent 7px) 0 0/22px 22px, radial-gradient(circle at 70% 60%, #fff4c8 0 7px, transparent 8px) 0 0/26px 26px, #fff1c0"></div>', { ms: 6000 });
        fx.particles({ kind: "burst", from: pt(rg.x, rg.y), count: 30, glyphs: kernel, min: 12, max: 22, spread: 90, gravity: 60, dur: 1200, stagger: 2400 });
        for (let t = 0; t < 3.6; t += 0.05) fx.noise(0.03, { type: "bandpass", freq: 1600 + Math.random() * 2400, q: 3, vol: 0.2, at: t + Math.random() * 0.04 });
        if (fill) await fx.tween(3600, (k) => { fill.firstChild.style.height = k * 100 + "%"; });
        else await fx.wait(3600);
        fx.caption("(the house is full of popcorn)", { style: "whisper", ms: 1600 });
        fx.shake("sm", 400);
        await fx.wait(1600);
      }
    },

    // Clue
    {
      id: 15196,
      y: 1985,
      run: async (fx) => {
        fx.wash("radial-gradient(circle at 50% 40%, rgba(255,230,180,.1), rgba(20,10,5,.75))", 7000, { fade: 400 });
        for (let i = 0; i < 3; i++) {
          fx.thud({ freq: 60, vol: 0.4, dur: 0.5, at: i * 0.2 });
        }
        fx.caption("(thunder)", { style: "whisper", ms: 800 });
        fx.flash("#fff", 120);
        await fx.wait(900);
        const endings = [
          { who: "Mrs. Peacock", c: "#3a6ad8" },
          { who: "Miss Scarlet", c: "#d51f2a" },
          { who: "…everybody", c: "#f2c94c" }
        ];
        const tune = [["C4", 1], ["Eb4", 1], ["F#4", 1], ["A4", 3]];
        for (let i = 0; i < endings.length; i++) {
          fx.caption("Ending " + "ABC"[i] + ": " + endings[i].who + ".", { style: "card", ms: 1500, css: { borderColor: endings[i].c } });
          fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.2, filter: { freq: 900 } });
          const card = fx.put(A.S("0 0 50 70", '<rect x="3" y="3" width="44" height="64" rx="5" fill="#fff" ' + A.ink + '/><circle cx="25" cy="30" r="12" fill="' + endings[i].c + '"/><path d="M13 54 H37" stroke="' + A.INK + '" stroke-width="3"/>'), W() / 2 + (i - 1) * 64, H() * 0.66, { size: 50, h: 70 });
          fx.move(card, [{ transform: "rotateY(90deg)" }, { transform: "none" }], 300);
          await fx.wait(1700);
        }
        fx.caption("…but here's what really happened.", { style: "whisper", ms: 1200 });
        await fx.wait(1100);
      }
    },

    // Better Off Dead…
    {
      id: 13667,
      y: 1985,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.wash("rgba(230,240,255,.3)", 6000, { fade: 400 });
        const paperboy = A.S("0 0 70 60", '<circle cx="18" cy="48" r="10" fill="none" ' + A.ink + '/><circle cx="54" cy="48" r="10" fill="none" ' + A.ink + '/><path d="M18 48 L32 30 H48 L54 48" ' + A.ink + ' fill="none"/><circle cx="40" cy="10" r="6" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M36 16 L34 30" ' + A.ink + '/><rect x="30" y="18" width="16" height="10" fill="#e8e4da" ' + A.ink + ' stroke-width="1.5"/>');
        fx.fly(paperboy, [-60, H() - 70], [W() + 60, H() - 70], { size: 70, h: 60, dur: 2400 });
        fx.caption("I want my two dollars!", { style: "subtitle", ms: 1800 });
        await fx.wait(900);
        fx.tone(700, 0.2, { type: "square", vol: 0.06 });
        fx.tone(900, 0.2, { type: "square", vol: 0.06, at: 0.25 });
        await fx.wait(1500);
        const burger = A.S("0 0 60 50", '<path d="M6 22 C6 6 54 6 54 22 Z" fill="#d9a13a" ' + A.ink + ' stroke-width="2"/><rect x="4" y="22" width="52" height="8" fill="#6b3a1a"/><path d="M4 30 H56 L50 36 H10 Z" fill="#6aa04a"/><path d="M6 36 H54 C54 44 6 44 6 36 Z" fill="#d9a13a" ' + A.ink + ' stroke-width="2"/><circle cx="22" cy="14" r="3" fill="#fff"/><circle cx="38" cy="14" r="3" fill="#fff"/><path d="M24 26 H36" stroke="#fff" stroke-width="2"/>');
        const b = fx.put(burger, r.x, r.y, { size: 60, h: 50 });
        const guitar = [["E4", 1], ["G4", 1], ["B4", 1], ["E5", 2], ["D5", 1], ["B4", 1], ["G4", 2]];
        fx.seq(guitar, { type: "sawtooth", vol: 0.05, beat: 0.16, filter: { freq: 2400 } });
        await fx.move(b, [{ transform: "none" }, { transform: "rotate(-15deg) translateY(-10px)" }, { transform: "rotate(15deg)" }, { transform: "none" }], { duration: 600, iterations: 3 });
      }
    },

    // The Purple Rose of Cairo
    {
      id: 10849,
      y: 1985,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        fx.filter("grayscale(1)", 6400, { fade: 300 });
        fx.wash("rgba(80,30,90,.25)", 6400, { fade: 300 });
        A.projector(fx, 5);
        fx.sfx("projector", { dur: 3.6, vol: 0.45 });
        const beam = fx.put('<div style="width:100%;height:100%;background:linear-gradient(to bottom, rgba(255,255,230,.5), transparent);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%)"></div>', r.x, r.top - H() * 0.25, { size: r.width * 1.4, h: H() * 0.5 });
        void beam;
        const man = A.S("0 0 40 90", '<path d="M10 8 C12 0 28 0 30 8 L32 12 H8 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="18" r="7" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M8 28 H32 L30 64 H10 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M14 64 V88 M26 64 V88" ' + A.ink + '/>');
        await fx.wait(1200);
        fx.caption("My God, you must really love this picture.", { style: "subtitle", ms: 2000 });
        await fx.wait(1000);
        const m = fx.put(man, r.x, r.y, { size: 34, h: 76 });
        fx.style(m, { filter: "grayscale(1)" });
        fx.sfx("whoosh", { vol: 0.45, dur: 0.9 });
        await fx.move(m, [{ transform: "none" }, { transform: "translate(" + (W() / 2 - r.x) + "px," + (H() * 0.7 - r.y) + "px) scale(1.3)" }], { duration: 1600, easing: "ease-in-out" });
        m.style.filter = "none";
        fx.sfx("chime", { vol: 0.6 });
        fx.chord(["C5", "E5", "G5"], 1.4, { type: "sine", vol: 0.06 });
        fx.caption("(he stepped out of the screen)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Ran
    {
      id: 11645,
      y: 1985,
      run: async (fx) => {
        fx.filter("saturate(1.3)", 7000, { fade: 400 });
        const cols = ["#d51f2a", "#f2c94c", "#3a6ad8"];
        const banner = (c) => A.S("0 0 20 60", '<path d="M3 0 V60" stroke="#1d1a18" stroke-width="2"/><path d="M4 4 H18 V40 H4 Z" fill="' + c + '" stroke="#1d1a18" stroke-width="1.5"/>');
        for (let i = 0; i < 18; i++) {
          fx.later(i * 120, () => fx.fly(banner(cols[i % 3]), [-20, H() * (0.3 + (i % 6) * 0.1)], [W() + 20, H() * (0.28 + (i % 6) * 0.1)], { size: 20, h: 60, dur: 2400, easing: "linear" }));
        }
        fx.chord(["A3", "C4", "E4"], 4, { type: "sine", vol: 0.05, attack: 1.4 });
        fx.seq([["E5", 4], ["D5", 2], ["C5", 2], ["A4", 8]], { type: "sine", vol: 0.07, beat: 0.3, vibrato: [4, 6] });
        await fx.wait(3200);
        const castle = fx.put(A.S("0 0 120 110", '<path d="M10 100 H110 V70 H96 L90 50 H30 L24 70 H10 Z" fill="#e8e4da" ' + A.ink + '/><path d="M30 50 L60 28 L90 50 Z M40 28 L60 10 L80 28 Z" fill="#3b3530" ' + A.ink + '/>'), W() / 2, H() * 0.42, { size: 150, h: 138 });
        fx.style(castle, { filter: "drop-shadow(0 0 16px #ff7a1a)" });
        fx.particles({ kind: "rise", from: castle, count: 40, glyphs: [dot("#ff7a1a"), dot("#ffcf5a"), dot("rgba(40,30,20,.7)")], min: 4, max: 14, dur: 1800, stagger: 2600 });
        fx.noise(3, { freq: 1000, sweep: 3000, vol: 0.25, attack: 0.4 });
        fx.caption("(the fortress burns — and the soundtrack goes silent)", { style: "whisper", ms: 2400 });
        await fx.wait(3000);
      }
    },

    // A Better Tomorrow
    {
      id: 11471,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(1.2) contrast(1.1)", 6000, { fade: 300 });
        fx.wash("rgba(40,60,120,.25)", 6000, { fade: 300 });
        const bill = fx.put(A.bill, r.x + 30, r.y, { size: 60, h: 30 });
        await fx.wait(400);
        fx.put(A.S("0 0 20 30", '<path d="M10 2 C16 10 16 18 10 28 C4 18 4 10 10 2 Z" fill="#ffb347"/>'), r.x + 2, r.y, { size: 12, h: 18, ms: 2000 });
        fx.noise(1.8, { freq: 1600, sweep: 3200, vol: 0.2 });
        await fx.tween(1800, (k) => { bill.style.clipPath = "inset(0 " + k * 100 + "% 0 0)"; });
        fx.particles({ kind: "rise", from: pt(r.x, r.y, 60, 10), count: 12, glyphs: dot("rgba(60,60,60,.6)"), min: 8, max: 16, dur: 1400 });
        fx.caption("(he lights his cigarette with a counterfeit note)", { style: "whisper", ms: 1600 });
        await fx.wait(1400);
        const tune = [["E4", 2], ["G4", 1], ["A4", 1], ["B4", 3], ["A4", 1], ["G4", 2], ["E4", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1200 } });
        fx.costume(".reely", '<path d="M36 50 C44 40 76 40 84 50 V58 C76 64 44 64 36 58 Z" fill="#1d1a18"/><path d="M60 50 V56" stroke="#444" stroke-width="2"/>', 2400);
        await fx.wait(2400);
      }
    },

    // Street of Crocodiles
    {
      id: 59357,
      y: 1986,
      run: async (fx) => {
        fx.filter("sepia(.8) saturate(.6) contrast(1.2) brightness(.8)", 7000, { fade: 400 });
        fx.node("", { cls: "fx-filter fx-grain", ms: 7000 });
        const screw = fx.put(A.S("0 0 30 80", '<path d="M15 4 V70" stroke="#9aa2a6" stroke-width="6"/>' + Array.from({ length: 10 }, (_, i) => '<path d="M9 ' + (10 + i * 6) + ' L21 ' + (14 + i * 6) + '" stroke="#6d7478" stroke-width="2"/>').join("") + '<path d="M6 4 H24 V10 H6 Z" fill="#9aa2a6"/>'),
          W() / 2, 0, { size: 30, h: 80 });
        const turn = fx.move(screw, [{ transform: "translateY(-80px) rotateY(0)" }, { transform: "translateY(" + H() * 0.35 + "px) rotateY(3600deg)" }], { duration: 3600, easing: "ease-out" });
        for (let t = 0; t < 3.6; t += 0.09) fx.click({ freq: 3000 + Math.random() * 800, vol: 0.12, at: t });
        fx.tone(110, 5, { type: "sawtooth", vol: 0.04, filter: { freq: 300 }, vibrato: [0.5, 6] });
        await turn;
        const doll = fx.put(A.S("0 0 40 70", '<circle cx="20" cy="12" r="10" fill="#e8d6c0" ' + A.ink + ' stroke-width="2"/><circle cx="16" cy="10" r="2" fill="#1d1a18"/><circle cx="24" cy="10" r="2" fill="#1d1a18"/><path d="M8 24 H32 L34 66 H6 Z" fill="#6d665c" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.65, { size: 40, h: 70 });
        await fx.move(doll, [{ transform: "none" }, { transform: "rotate(-90deg)" }, { transform: "rotate(-90deg) translateY(-6px)" }, { transform: "rotate(0)" }], { duration: 1600, easing: "steps(8)" });
        fx.particles({ kind: "drift", count: 16, glyphs: dot("rgba(200,190,170,.7)"), min: 2, max: 5, dur: 2000 });
        await fx.wait(1200);
      }
    },

    // Little Shop of Horrors (1986)
    {
      id: 10776,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pot = fx.put(A.S("0 0 100 120", '<path d="M26 90 H74 L70 118 H30 Z" fill="#b5613a" ' + A.ink + ' stroke-width="2"/><path d="M50 90 C46 70 54 60 50 48" stroke="#3a6a2a" stroke-width="6" fill="none"/>' +
          '<g class="head"><path d="M14 40 C14 14 86 14 86 40 C86 46 14 46 14 40 Z" fill="#5fa04a" ' + A.ink + ' stroke-width="2.5"/><path class="jaw" d="M14 42 C18 62 82 62 86 42 Z" fill="#5fa04a" ' + A.ink + ' stroke-width="2.5"/><path d="M18 40 H82" stroke="#b3122a" stroke-width="6"/><path d="M24 38 L28 44 L32 38 L36 44 L40 38 L44 44 L48 38 L52 44 L56 38 L60 44 L64 38 L68 44 L72 38 L76 44" stroke="#fff" stroke-width="2" fill="none"/></g>' +
          '<path d="M36 76 C24 70 20 60 26 56 M64 76 C76 70 80 60 74 56" stroke="#3a6a2a" stroke-width="4" fill="#5fa04a"/>'),
          r.x, r.y, { size: 90, h: 108 });
        const head = pot.querySelector(".head");
        const words = ["Feed", "me,", "Sey-", "mour!"];
        for (let i = 0; i < 4; i++) {
          if (head) head.setAttribute("transform", i % 2 ? "translate(0 -6) scale(1 1.1)" : "");
          fx.tone(i < 3 ? 110 : 82, 0.35, { type: "sawtooth", vol: 0.12, filter: { type: "bandpass", freq: 500, q: 3 }, vibrato: [6, 8] });
          fx.caption(words.slice(0, i + 1).join(" "), { style: "hand", ms: 500, css: { color: "#5fa04a" } });
          await fx.wait(480);
        }
        const tune = [["C4", 1], ["Eb4", 1], ["F4", 1], ["G4", 2], ["Bb4", 1], ["G4", 1], ["F4", 2], ["Eb4", 1], ["C4", 3]];
        fx.seq(tune, { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 1400 } });
        for (let i = 0; i < 8; i++) fx.thud({ freq: 70, vol: 0.2, dur: 0.1, at: i * 0.36 });
        await fx.move(pot, [{ transform: "none" }, { transform: "scale(1.6) translateY(-10px)" }], { duration: 1600, easing: "steps(6)" });
        fx.noise(0.2, { freq: 600, vol: 0.5 });
        fx.buzz(40);
        await fx.wait(800);
      }
    },

    // Castle in the Sky
    {
      id: 10515,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const stone = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(circle at 40% 35%, #dff, #3ad8e8 50%, #1a6a8a);box-shadow:0 0 16px #6af0ff"></div>', r.x, r.y, { size: 22 });
        void stone;
        fx.tone(880, 2, { type: "sine", vol: 0.06, vibrato: [4, 8], attack: 0.3 });
        const beam = fx.put('<div style="width:100%;height:100%;background:linear-gradient(to top, rgba(106,240,255,.8), rgba(106,240,255,0))"></div>', r.x, r.y - H() / 2, { size: 8, h: H() });
        fx.anim(beam, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.6 }], 1200);
        const tune = [["A4", 1], ["B4", 1], ["C5", 3], ["B4", 1], ["C5", 2], ["E5", 2], ["B4", 6]];
        fx.seq(tune, { type: "sine", vol: 0.09, beat: 0.25, at: 0.4 });
        await fx.wait(1600);
        const island = A.S("0 0 160 120", '<path d="M20 60 C20 40 140 40 140 60 L120 90 C110 110 50 110 40 90 Z" fill="#8a7a62" ' + A.ink + '/><path d="M40 60 C40 10 120 10 120 60" fill="#4a8a3a" ' + A.ink + '/><path d="M60 58 V40 H100 V58 M70 40 V30 H90 V40" fill="none" ' + A.ink + ' stroke-width="2"/><path d="M60 100 C50 110 40 116 30 118 M100 100 C110 110 120 116 130 118" stroke="#6b4a2a" stroke-width="3"/>');
        fx.particles({ kind: "drift", count: 12, glyphs: dot("rgba(255,255,255,.8)"), min: 30, max: 60, dur: 3000 });
        await fx.fly(island, [W() + 100, H() * 0.25], [-100, H() * 0.2], { size: 160, h: 120, dur: 3600, via: [W() / 2, H() * 0.15], easing: "ease-in-out" });
      }
    },

    // Blue Velvet
    {
      id: 793,
      y: 1986,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const sky = fx.wash("linear-gradient(#6ab0ff, #cfe8ff 60%)", 6600, { fade: 400, blend: "multiply", opacity: 0.5 });
        void sky;
        fx.particles({ kind: "rise", area: pt(W() / 2, H() - 20, W(), 10), count: 12, glyphs: ["#d51f2a", "#f2c94c", "#fff"].map((c) => A.petal(c)), min: 14, max: 22, dur: 1600, stagger: 800 });
        const fence = fullSvg(fx, A.S("0 0 400 80", Array.from({ length: 30 }, (_, i) => '<path d="M' + (i * 14) + " 80 V20 L" + (i * 14 + 5) + " 12 L" + (i * 14 + 10) + ' 20 V80 Z" fill="#fff" stroke="#ccc"/>').join("")), { top: "auto", height: "14vh", bottom: 0 });
        void fence;
        fx.seq([["Eb5", 2], ["G5", 1], ["Bb5", 3], ["Ab5", 1], ["G5", 1], ["F5", 4]], { type: "sine", vol: 0.08, beat: 0.3 });
        await fx.wait(2200);
        const ear = fx.put(A.S("0 0 40 60", '<path d="M26 6 C38 10 40 34 30 46 C26 50 26 56 20 56 C12 56 12 46 16 42 C22 34 14 30 14 22 C14 12 18 4 26 6 Z" fill="#e8c8b0" ' + A.ink + ' stroke-width="2"/><path d="M24 16 C30 18 30 30 24 34" stroke="#b08a70" stroke-width="2" fill="none"/>'),
          r.x, r.top + r.height + 20, { size: 40, h: 60 });
        fx.style(fx.slot(), { filter: "saturate(.5) brightness(.8)" }, 4000);
        fx.noise(3, { type: "bandpass", freq: 300, q: 3, vol: 0.2, attack: 0.5 });
        fx.tone(60, 3, { type: "sine", vol: 0.08 });
        fx.particles({ kind: "drift", area: ear, count: 10, glyphs: A.S("0 0 20 12", '<ellipse cx="4" cy="6" rx="3" ry="2.5" fill="#1d1a18"/><ellipse cx="10" cy="6" rx="3" ry="2.5" fill="#1d1a18"/><ellipse cx="16" cy="6" rx="3.5" ry="3" fill="#1d1a18"/>'), min: 8, max: 12, dur: 1800 });
        if (!fx.reduced) await fx.move(ear, [{ transform: "scale(1)" }, { transform: "scale(4)", opacity: 0.2 }], { duration: 2600, easing: "ease-in" });
        else await fx.wait(2600);
        fx.caption("It's a strange world.", { style: "subtitle", ms: 1600 });
        await fx.wait(1500);
      }
    },

    // A Chinese Ghost Story
    {
      id: 30421,
      y: 1987,
      run: async (fx) => {
        fx.wash("linear-gradient(rgba(20,40,60,.5), rgba(40,20,50,.6))", 7000, { fade: 500 });
        const veil = A.S("0 0 120 60", '<path d="M0 30 C20 10 40 50 60 30 C80 10 100 50 120 30" stroke="rgba(255,255,255,.8)" stroke-width="8" fill="none"/>');
        for (let i = 0; i < 4; i++) {
          fx.later(i * 500, () => fx.fly(veil, [-120, H() * (0.2 + i * 0.15)], [W() + 120, H() * (0.3 + i * 0.1)], { size: 200, h: 100, dur: 3400, via: [W() / 2, H() * (0.1 + i * 0.1)], r1: 10 }));
        }
        const guqin = [["D5", 2], ["E5", 1], ["G5", 1], ["A5", 2], ["G5", 1], ["E5", 1], ["D5", 4]];
        guqin.reduce((t, [n, l]) => { fx.tone(n, 0.9, { type: "triangle", vol: 0.1, at: t, attack: 0.002 }); return t + l * 0.3; }, 0);
        fx.noise(6, { type: "bandpass", freq: 900, q: 0.5, vol: 0.15, attack: 1 });
        await fx.wait(3200);
        const tongue = fx.put(A.S("0 0 40 200", '<path d="M20 0 C10 60 30 120 14 200 L26 200 C40 120 20 60 20 0 Z" fill="#c4304a" ' + A.ink + ' stroke-width="2"/>'), W() * 0.8, -100, { size: 40, h: 200 });
        fx.tone(90, 1.4, { type: "sawtooth", vol: 0.1, slide: 60, filter: { freq: 400 } });
        await fx.move(tongue, [{ transform: "none" }, { transform: "translateY(" + H() * 0.6 + "px) translateX(-" + W() * 0.3 + "px)" }], { duration: 1200, easing: "ease-in" });
        fx.buzz([60, 30, 60]);
        await fx.wait(1800);
      }
    },

    // Where Is the Friend's House?
    {
      id: 49964,
      y: 1987,
      run: async (fx) => {
        fx.filter("sepia(.2) saturate(.9) brightness(1.05)", 7400, { fade: 400 });
        const hill = fullSvg(fx, A.S("0 0 400 300", '<path d="M0 300 C60 240 120 260 180 200 C220 160 260 180 300 120 C330 80 380 90 400 60 V300 Z" fill="rgba(200,180,130,.6)"/><path d="M40 290 L100 250 L150 262 L200 210 L250 190 L290 140 L320 110" stroke="#8a6a3a" stroke-width="4" fill="none" stroke-dasharray="6 4"/><path d="M310 40 V110 M320 60 C330 50 340 60 330 70" stroke="#3a6a2a" stroke-width="5"/>'), { opacity: 0.9 });
        void hill;
        const boy = A.S("0 0 20 36", '<circle cx="10" cy="6" r="5" fill="#1d1a18"/><path d="M4 12 H16 L15 26 H5 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><path d="M6 26 L4 36 M14 26 L16 36" stroke="#1d1a18" stroke-width="2.5"/><rect x="14" y="14" width="8" height="10" fill="#3a6ad8"/>');
        const path = [[0.1, 0.97], [0.25, 0.83], [0.37, 0.87], [0.5, 0.7], [0.62, 0.63], [0.72, 0.47], [0.8, 0.37]];
        const b = fx.put(boy, W() * path[0][0], H() * path[0][1], { size: 20, h: 36 });
        const pulse = [["A4", 1], ["C5", 1], ["E5", 2]];
        const step = (k) => "translate(" + (path[k][0] - path[0][0]) * W() + "px," + (path[k][1] - path[0][1]) * H() + "px)";
        for (let i = 1; i < path.length; i++) {
          if (!fx.reduced) await fx.anim(b, [{ transform: step(i - 1) }, { transform: step(i) }], { duration: 700, fill: "forwards", easing: "steps(4)" });
          else await fx.wait(700);
          fx.seq(pulse, { type: "sawtooth", vol: 0.03, beat: 0.12, filter: { freq: 900 } });
        }
        fx.caption("(he still has his friend's notebook)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // The Man Who Planted Trees
    {
      id: 49565,
      y: 1987,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(.8)", 7400, { fade: 400 });
        fx.wash("linear-gradient(transparent 60%, rgba(160,140,100,.6))", 7400, { fade: 400 });
        const n = W() < 500 ? 7 : 12;
        const trees = [];
        for (let i = 0; i < n; i++) {
          const x = (i + 0.5) * W() / n, y = H() * (0.72 + (i % 3) * 0.06);
          const acorn = fx.put(A.S("0 0 10 12", '<ellipse cx="5" cy="7" rx="4" ry="5" fill="#8a5a2a"/><path d="M1 5 H9 C9 1 1 1 1 5 Z" fill="#6b4a2a"/>'), x, y, { size: 8, h: 10 });
          fx.click({ freq: 1200, vol: 0.2 });
          await fx.wait(160);
          trees.push([acorn, x, y]);
        }
        fx.seq([["G4", 2], ["B4", 1], ["D5", 1], ["G5", 3], ["F#5", 1], ["E5", 2], ["D5", 2], ["G5", 4]], { type: "sine", vol: 0.07, beat: 0.35 });
        for (let i = 0; i < trees.length; i++) {
          const [acorn, x, y] = trees[i];
          fx.remove(acorn);
          const t = fx.put(A.S("0 0 40 60", '<path d="M20 60 V30" stroke="#6b4a2a" stroke-width="4"/><circle cx="20" cy="22" r="16" fill="#4a8a3a" ' + A.ink + ' stroke-width="2"/><circle cx="12" cy="28" r="10" fill="#5fa04a"/><circle cx="28" cy="26" r="10" fill="#3a7a2a"/>'), x, y - 26, { size: 40, h: 60, style: { transformOrigin: "50% 100%" } });
          fx.move(t, [{ transform: "scale(0)" }, { transform: "scale(1)" }], { duration: 900, easing: "cubic-bezier(.3,1.4,.6,1)" });
          await fx.wait(180);
        }
        fx.noise(2.4, { type: "bandpass", freq: 1200, q: 0.5, vol: 0.15, attack: 0.5 });
        fx.particles({ kind: "drift", count: 12, glyphs: A.leaf("#6aa04a"), min: 8, max: 14, dur: 2400 });
        fx.caption("(one man, forty years, a forest)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Prince of Darkness
    {
      id: 8852,
      y: 1987,
      run: async (fx) => {
        fx.filter("saturate(.6) brightness(.8)", 7000, { fade: 400 });
        const vessel = fx.put('<div style="width:100%;height:100%;border-radius:12px;background:linear-gradient(90deg,#1a3a2a,#3aff8a 40%,#1a6a3a 60%,#0a2a1a);box-shadow:0 0 22px #3aff8a;border:3px solid #6d7478"></div>', W() / 2, H() * 0.5, { size: 50, h: 120 });
        fx.move(vessel, [{ filter: "brightness(.8)" }, { filter: "brightness(1.4)" }, { filter: "brightness(.8)" }], { duration: 1200, iterations: 4 });
        const arp = [["E3", 1], ["G3", 1], ["B3", 1], ["E4", 1], ["D4", 1], ["B3", 1], ["G3", 1], ["B3", 1]];
        fx.seq(arp.concat(arp, arp), { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 900 } });
        fx.tone("E2", 4.5, { type: "sawtooth", vol: 0.05, filter: { freq: 200 } });
        await fx.wait(2600);
        const tv = fx.node("", { cls: "fx-filter fx-scanlines", style: { background: "rgba(0,0,0,.4)" } });
        fx.node("", { cls: "fx-filter fx-static", style: { opacity: 0.25 } });
        fx.caption("This is not a dream. This is being broadcast from the year one-nine-nine-nine.", { style: "terminal", ms: 2800, css: { fontSize: "12px" } });
        fx.sfx("static", { dur: 2.8, vol: 0.55 });
        await fx.wait(2800);
        void tv;
      }
    },

    // Wings of Desire
    {
      id: 144,
      y: 1987,
      run: async (fx) => {
        const grey = fx.filter("grayscale(1) sepia(.3)", 7000, { fade: 400 });
        const wings = fx.costume(".reely", '<path d="M20 70 C-10 40 -10 10 10 0 C10 30 20 50 30 60 Z M100 70 C130 40 130 10 110 0 C110 30 100 50 90 60 Z" fill="#f4f2ec" stroke="#aaa" stroke-width="2"/>', 7000);
        void wings;
        const thoughts = ["…the rent is due…", "…why am I me, and not you?…", "…the ninth floor…", "…when the child was a child…"];
        for (let i = 0; i < thoughts.length; i++) {
          fx.caption(thoughts[i], { style: "whisper", ms: 1100, css: { bottom: 18 + i * 9 + "vh", color: "#fff" } });
          fx.noise(0.9, { type: "bandpass", freq: 1800, q: 2, vol: 0.06, pan: i % 2 ? 0.7 : -0.7 });
          await fx.wait(900);
        }
        await fx.anim(grey, [{ opacity: 1 }, { opacity: 0 }], { duration: 1600, fill: "forwards" });
        fx.chord(["D4", "F#4", "A4", "D5"], 2, { type: "triangle", vol: 0.06, attack: 0.4 });
        fx.caption("(colour — he chose to fall)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Hellraiser
    {
      id: 9003,
      y: 1987,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const cube = fx.put(A.S("0 0 60 60", '<rect x="4" y="4" width="52" height="52" fill="#c9a24a" ' + A.ink + '/><path d="M30 8 L52 30 L30 52 L8 30 Z" fill="none" stroke="#1d1a18" stroke-width="2"/><circle cx="30" cy="30" r="8" fill="none" stroke="#1d1a18" stroke-width="2"/><path d="M4 4 L20 20 M56 4 L40 20 M4 56 L20 40 M56 56 L40 40" stroke="#1d1a18" stroke-width="1.5"/>'), r.x, r.y, { size: 60 });
        fx.chord(["C4", "E4", "G#4"], 3, { type: "sine", vol: 0.05, attack: 1 });
        for (let i = 0; i < 4; i++) {
          fx.move(cube, [{ transform: "rotate(" + i * 90 + "deg)" }, { transform: "rotate(" + (i + 1) * 90 + "deg)" }], { duration: 500, easing: "steps(3)" });
          fx.click({ freq: 1500, vol: 0.5 });
          fx.click({ freq: 900, vol: 0.4, at: 0.2 });
          await fx.wait(650);
        }
        fx.flash("rgba(120,160,255,.6)", 300);
        fx.chord(["C3", "C#3", "G3"], 1.6, { type: "sawtooth", vol: 0.1, filter: { freq: 900 } });
        fx.tone(2000, 1.6, { type: "sine", vol: 0.05, slide: 3000 });
        const chains = fx.put(A.S("0 0 200 200", Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return '<path d="M100 100 L' + (100 + Math.cos(a) * 96) + " " + (100 + Math.sin(a) * 96) + '" stroke="#9aa2a6" stroke-width="3" stroke-dasharray="6 3"/>'; }).join("")), r.x, r.y, { size: 260 });
        fx.move(chains, [{ transform: "scale(.2)" }, { transform: "scale(1)" }], 400);
        fx.buzz([50, 30, 50, 30, 100]);
        fx.caption("We have such sights to show you.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Landscape in the Mist
    {
      id: 47795,
      y: 1988,
      run: async (fx) => {
        const fog = fx.node("", { cls: "fx-filter", style: { background: "rgba(225,228,230,.85)", opacity: 0 } });
        fx.anim(fog, [{ opacity: 0 }, { opacity: 1 }], { duration: 1600, fill: "forwards" });
        fx.chord(["B3", "D4", "F#4"], 7, { type: "sawtooth", vol: 0.025, attack: 2, filter: { freq: 700 } });
        fx.seq([["F#5", 4], ["E5", 2], ["D5", 2], ["B4", 8]], { type: "sine", vol: 0.07, beat: 0.35, attack: 0.3, at: 1 });
        await fx.wait(2400);
        const tree = fx.put(A.S("0 0 100 140", '<path d="M50 140 V70 M50 90 L20 60 M50 80 L80 50 M50 70 L40 30 M50 70 L64 20 M20 60 L6 40 M80 50 L96 36" stroke="#3b3530" stroke-width="4" fill="none" stroke-linecap="round"/>'), W() / 2, H() * 0.5, { size: 140, h: 196 });
        fx.anim(tree, [{ opacity: 0 }, { opacity: 0.8 }], { duration: 2000, fill: "forwards" });
        const kids = A.S("0 0 40 36", '<circle cx="10" cy="6" r="5" fill="#3b3530"/><path d="M4 12 H16 L15 30 H5 Z" fill="#3b3530"/><circle cx="28" cy="10" r="4" fill="#3b3530"/><path d="M23 15 H33 L32 32 H24 Z" fill="#3b3530"/><path d="M16 16 H24" stroke="#3b3530" stroke-width="2"/>');
        await fx.fly(kids, [W() * 0.1, H() * 0.8], [W() * 0.45, H() * 0.66], { size: 40, h: 36, dur: 2600, keep: true });
        fx.caption("(a tree in the fog)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Alice (1988)
    {
      id: 18917,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.8) contrast(1.1)", 6400, { fade: 300 });
        const rabbit = fx.put(A.S("0 0 60 100", '<path d="M20 30 L14 2 L24 26 M40 30 L46 2 L36 26" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="38" r="14" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><circle cx="25" cy="36" r="2.5" fill="#1d1a18"/><circle cx="35" cy="36" r="2.5" fill="#1d1a18"/><path d="M20 52 H40 L44 94 H16 Z" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><path d="M22 60 C28 64 32 64 38 60" stroke="#e8c870" stroke-width="3" fill="none"/>'),
          r.x, r.y, { size: 60, h: 100 });
        fx.particles({ kind: "fall", from: rabbit, area: pt(r.x, r.y + 20, 20, 10), count: 14, glyphs: dot("#e8dcc0"), min: 2, max: 4, dur: 900, stagger: 3000 });
        for (let i = 0; i < 8; i++) fx.noise(0.12, { type: "bandpass", freq: 2600, q: 4, vol: 0.2, at: i * 0.35 });
        fx.caption("(sawdust leaks from the rabbit)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        for (let i = 0; i < 5; i++) {
          if (!fx.reduced) rabbit.style.transform = "translate(" + fx.rand(-6, 6) + "px," + fx.rand(-4, 4) + "px) rotate(" + fx.rand(-8, 8) + "deg)";
          fx.click({ freq: 1600, vol: 0.4 });
          await fx.wait(170);
        }
        const drawer = fx.put(A.S("0 0 60 40", '<rect x="2" y="2" width="56" height="36" fill="#8a6a3a" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="20" r="4" fill="#c9a24a"/>'), W() / 2, H() * 0.7, { size: 70, h: 46 });
        fx.move(drawer, [{ transform: "none" }, { transform: "translateY(10px) scaleY(1.2)" }, { transform: "none" }], { duration: 300, iterations: 4 });
        fx.caption("Alice thought to herself…", { style: "subtitle", ms: 1500 });
        await fx.wait(1600);
      }
    },

    // Women on the Verge of a Nervous Breakdown
    {
      id: 4203,
      y: 1988,
      run: async (fx) => {
        fx.filter("saturate(1.6)", 6400, { fade: 300 });
        fx.wash("linear-gradient(135deg, rgba(255,60,90,.25), rgba(255,210,40,.25))", 6400, { fade: 300 });
        const phone = fx.put(A.S("0 0 80 60", '<path d="M10 30 H70 L66 56 H14 Z" fill="#d51f2a" ' + A.ink + '/><path d="M6 20 C6 8 74 8 74 20 L64 26 C60 18 20 18 16 26 Z" fill="#d51f2a" ' + A.ink + '/><circle cx="40" cy="42" r="8" fill="#f4efe2" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.42, { size: 90, h: 68 });
        for (let i = 0; i < 3; i++) {
          fx.tone(1300, 0.8, { type: "square", vol: 0.04, at: i * 1.1, vibrato: [22, 120] });
          fx.later(i * 1100, () => fx.move(phone, [{ transform: "none" }, { transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }, { transform: "none" }], { duration: 200, iterations: 4 }));
        }
        await fx.wait(3200);
        fx.noise(0.3, { freq: 900, vol: 0.5 });
        fx.thud({ vol: 0.4 });
        await fx.move(phone, [{ transform: "none" }, { transform: "translate(" + W() * 0.3 + "px," + H() * 0.3 + "px) rotate(200deg)" }], { duration: 500, easing: "ease-in" });
        fx.caption("(gazpacho, anyone?)", { style: "whisper", ms: 1600 });
        const glass = A.S("0 0 20 30", '<path d="M3 3 H17 L15 27 H5 Z" fill="#d5402a" ' + A.ink + ' stroke-width="1.5"/>');
        fx.put(glass, W() / 2, H() * 0.66, { size: 24, h: 36, ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Grave of the Fireflies
    {
      id: 12477,
      y: 1988,
      run: async (fx) => {
        const night = fx.wash("rgba(10,15,35,.65)", 7400, { fade: 1000 });
        void night;
        const r = fx.rect(fx.slot());
        const tin = fx.put(A.S("0 0 40 50", '<rect x="4" y="8" width="32" height="40" rx="4" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><rect x="4" y="4" width="32" height="8" rx="2" fill="#c9c9c9" ' + A.ink + ' stroke-width="2"/><text x="20" y="34" font-size="8" text-anchor="middle" fill="#fff" font-family="Georgia">DROPS</text>'),
          r.x, r.top + r.height + 26, { size: 34, h: 42 });
        void tin;
        fx.tone(2600, 0.1, { type: "sine", vol: 0.05 });
        fx.tone(2900, 0.1, { type: "sine", vol: 0.05, at: 0.2 });
        const flies = [];
        for (let i = 0; i < 26; i++) {
          const f = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:#e8ff8a;box-shadow:0 0 8px 3px rgba(220,255,120,.8)"></div>', fx.rand(20, W() - 20), fx.rand(H() * 0.2, H() * 0.9), { size: 5 });
          flies.push(f);
          fx.anim(f, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }, { opacity: 0 }], { duration: 3200 + fx.rand(0, 1600), delay: fx.rand(0, 1500) });
          if (!fx.reduced) fx.anim(f, [{ transform: "none" }, { transform: "translate(" + fx.rand(-40, 40) + "px," + fx.rand(-40, 20) + "px)" }], { duration: 5000, fill: "forwards" });
        }
        const tune = [["E5", 2], ["D5", 1], ["C5", 1], ["D5", 2], ["G4", 2], ["A4", 2], ["C5", 2], ["B4", 4]];
        fx.seq(tune, { type: "sine", vol: 0.07, beat: 0.4, attack: 0.1 });
        fx.chord(["C4", "E4", "G4"], 6, { type: "triangle", vol: 0.025, attack: 2 });
        await fx.wait(5800);
      }
    },

    // Cinema Paradiso
    {
      id: 11216,
      y: 1988,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        fx.wash("radial-gradient(circle at 50% 50%, rgba(255,230,180,.0), rgba(30,15,5,.7))", 7400, { fade: 600 });
        A.projector(fx, 6.5);
        fx.sfx("projector", { dur: 6.4, vol: 0.35, fadeIn: 800 });
        const beam = fx.put('<div style="width:100%;height:100%;background:linear-gradient(to bottom, rgba(255,255,220,.6), rgba(255,255,220,0));clip-path:polygon(47% 0,53% 0,100% 100%,0 100%)"></div>', r.x, r.top - H() * 0.3, { size: r.width * 1.5, h: H() * 0.6 });
        void beam;
        fx.particles({ kind: "drift", area: pt(r.x, r.top - H() * 0.15, r.width, H() * 0.3), count: 20, glyphs: dot("rgba(255,255,230,.8)"), min: 1, max: 3, dur: 3000, stagger: 4000 });
        const tune = [["E5", 3], ["D5", 1], ["C5", 2], ["G4", 2], ["A4", 2], ["B4", 2], ["C5", 4], ["D5", 2], ["E5", 2], ["C5", 4]];
        fx.seq(tune, { type: "sine", vol: 0.09, beat: 0.3, vibrato: [5, 4], attack: 0.1 });
        fx.chord(["C4", "E4", "G4"], 3, { type: "triangle", vol: 0.03, attack: 1 });
        fx.chord(["A3", "C4", "E4"], 3, { type: "triangle", vol: 0.03, attack: 1, at: 3 });
        await fx.wait(2800);
        const others = fx.otherSlots(true).slice(0, 8);
        for (const o of others) {
          const or_ = fx.rect(o);
          fx.put(A.heart("#e05a5a"), or_.x, or_.y, { size: 22, ms: 3400 });
          fx.tone(fx.pick(["C6", "E6", "G6"]), 0.4, { type: "sine", vol: 0.03 });
          await fx.wait(260);
        }
        fx.caption("(every kiss the priest ever cut)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Heathers
    {
      id: 2640,
      y: 1988,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const colors = ["#d51f2a", "#f2c94c", "#3aa655", "#3a6ad8"];
        const croquet = colors.map((c, i) => fx.put(A.S("0 0 30 30", '<circle cx="15" cy="15" r="12" fill="' + c + '" ' + A.ink + ' stroke-width="2"/>'), W() / 2 + (i - 1.5) * 50, H() - 60, { size: 26 }));
        for (let i = 0; i < 4; i++) {
          fx.click({ freq: 1000, vol: 0.6 });
          fx.thud({ freq: 300, vol: 0.2, dur: 0.06 });
          fx.move(croquet[i], [{ transform: "none" }, { transform: "translate(" + fx.rand(-40, 40) + "px,-" + fx.rand(40, 90) + "px)" }, { transform: "translateY(0)" }], 600);
          await fx.wait(450);
        }
        fx.caption("What's your damage?", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        fx.style(fx.slot(), { boxShadow: "0 0 0 3px #d51f2a, 0 0 20px rgba(213,31,42,.8)" }, 2400);
        const scr = fx.put(A.S("0 0 20 60", '<rect x="4" y="0" width="12" height="40" rx="3" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M10 40 V58" stroke="#1d1a18" stroke-width="3"/>'), r.x + r.width / 2, r.top, { size: 16, h: 48 });
        void scr;
        fx.caption("(it's a red scrunchie — she's in charge now)", { style: "whisper", ms: 1800 });
        fx.chord(["E4", "G4", "B4", "D5"], 1.6, { type: "sawtooth", vol: 0.04, filter: { freq: 1600 } });
        await fx.wait(2000);
      }
    },

    // Tetsuo: The Iron Man
    {
      id: 41428,
      y: 1989,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.8) brightness(.9)", 6000, { fade: 150 });
        fx.node("", { cls: "fx-filter fx-grain", ms: 6000 });
        const beat = 0.12;
        for (let i = 0; i < 40; i++) {
          fx.thud({ freq: 60, vol: i % 2 ? 0.2 : 0.4, dur: 0.08, at: i * beat });
          fx.noise(0.05, { type: "bandpass", freq: 2500, q: 2, vol: 0.3, at: i * beat + 0.06 });
        }
        fx.tone(55, 4.8, { type: "sawtooth", vol: 0.1, filter: { freq: 800 } });
        const others = fx.otherSlots(true);
        for (let i = 0; i < 18; i++) {
          if (!fx.reduced) fx.page([{ transform: "translate(" + fx.rand(-8, 8) + "px," + fx.rand(-6, 6) + "px)" }, { transform: "none" }], { duration: 120, fill: "none", easing: "steps(2)" });
          const o = fx.pick(others);
          if (o) fx.style(o, { filter: "grayscale(1) contrast(2) brightness(.6)", boxShadow: "inset 0 0 0 3px #555" }, 5000);
          fx.buzz(30);
          await fx.wait(220);
        }
        const bolts = A.S("0 0 20 20", '<path d="M10 2 L17 6 V14 L10 18 L3 14 V6 Z" fill="#6d7478" ' + A.ink + ' stroke-width="1.5"/>');
        fx.particles({ kind: "burst", from: fx.slot(), count: 30, glyphs: [bolts, A.S("0 0 30 10", '<path d="M2 5 H28" stroke="#9aa2a6" stroke-width="4"/>')], min: 10, max: 20, spread: 100, dur: 1200, stagger: 200, spin: 360 });
        fx.caption("Your future is metal!", { style: "hand", ms: 1400, css: { color: "#ccc" } });
        await fx.wait(1600);
      }
    },

    // Leningrad Cowboys Go America
    {
      id: 11475,
      y: 1989,
      run: async (fx) => {
        const quiff = '<path d="M44 26 C30 10 44 -10 90 -26 C84 -6 88 10 80 26 Z" fill="#1d1a18"/><path d="M96 90 L104 150 M104 150 H120" stroke="#1d1a18" stroke-width="3"/>';
        fx.costume(".reely", quiff, 6400);
        fx.costume(".kernel", '<g transform="translate(5 32)">' + quiff + "</g>", 6400);
        const beat = 0.18;
        const polka = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["F5", 1], ["A5", 1], ["G5", 2], ["C5", 1], ["E5", 1], ["G5", 1], ["C6", 1], ["B5", 1], ["G5", 1], ["C6", 2]];
        fx.seq(polka, { type: "sawtooth", vol: 0.05, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 16; i++) fx.thud({ freq: i % 2 ? 150 : 70, vol: 0.2, dur: 0.1, at: i * beat });
        const car = A.S("0 0 140 60", '<path d="M6 40 C6 30 18 26 30 24 L46 12 H94 L110 24 C126 26 134 32 134 40 V46 H6 Z" fill="#e8e4da" ' + A.ink + '/><circle cx="32" cy="48" r="9" fill="#1d1a18"/><circle cx="108" cy="48" r="9" fill="#1d1a18"/><rect x="50" y="0" width="30" height="14" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M30 24 L20 6" stroke="#1d1a18" stroke-width="2"/>');
        fx.fly(car, [-150, H() - 70], [W() + 150, H() - 70], { size: 150, h: 64, dur: 3600, easing: "steps(20)" });
        await fx.wait(3200);
        fx.caption("(the band's manager is strapped to the roof)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // The Killer (1989)
    {
      id: 10835,
      y: 1989,
      run: async (fx) => {
        const church = fx.wash("radial-gradient(circle at 50% 30%, rgba(255,240,200,.2), rgba(20,10,5,.6))", 6600, { fade: 500 });
        void church;
        const r = fx.rect(fx.slot());
        const candles = [];
        for (let i = 0; i < 7; i++) candles.push(fx.put(A.S("0 0 20 50", '<rect x="7" y="16" width="6" height="32" fill="#f4efe2"/><path d="M10 2 C14 8 14 12 10 16 C6 12 6 8 10 2 Z" fill="#ffcf5a"/>'), W() / 2 + (i - 3) * 30, H() * 0.24, { size: 16, h: 40, style: { filter: "drop-shadow(0 0 6px #ffb347)" } }));
        void candles;
        fx.chord(["D4", "F#4", "A4"], 2, { type: "sine", vol: 0.05, attack: 0.5 });
        await fx.wait(1200);
        doves(fx, 10, [W() / 2, H() * 0.55]);
        fx.tempo(0.25, 2000);
        await fx.wait(1400);
        for (let i = 0; i < 10; i++) {
          fx.noise(0.1, { freq: 2400, vol: 0.6, at: i * 0.1 });
          fx.later(i * 100, () => fx.put(A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#fff6c0"/>'), fx.rand(W() * 0.2, W() * 0.8), fx.rand(H() * 0.3, H() * 0.7), { size: 14, ms: 90 }));
        }
        fx.buzz([20, 80, 20, 80, 20, 80, 20]);
        await fx.wait(1200);
        fx.caption("(in slow motion, naturally)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        void r;
      }
    },

    // UHF
    {
      id: 11959,
      y: 1989,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const tv = fx.put(A.S("0 0 120 100", '<rect x="4" y="10" width="112" height="80" rx="8" fill="#6b4a2a" ' + A.ink + '/><rect x="14" y="18" width="80" height="62" rx="8" fill="#223"/><circle cx="104" cy="34" r="5" fill="#c9a24a"/><circle cx="104" cy="54" r="5" fill="#c9a24a"/><path d="M40 10 L20 -10 M80 10 L100 -10" ' + A.ink + '/>'),
          W() / 2, H() * 0.4, { size: 160, h: 133 });
        const scr = fx.put("", W() / 2 - 12, H() * 0.4 + 2, { size: 106, h: 80, cls: "fx-static" });
        fx.noise(1.2, { type: "bandpass", freq: 3000, q: 0.5, vol: 0.12 });
        await fx.wait(1200);
        fx.remove(scr);
        fx.put('<div style="width:100%;height:100%;background:linear-gradient(90deg,#fff 0 14%,#ff0 14% 28%,#0ff 28% 42%,#0f0 42% 57%,#f0f 57% 71%,#f00 71% 85%,#00f 85%)"></div>', W() / 2 - 12, H() * 0.4 + 2, { size: 106, h: 80, ms: 1200 });
        fx.tone(1000, 1.1, { type: "sine", vol: 0.08 });
        await fx.wait(1300);
        fx.caption("♪ Wheel of Fish! ♪", { style: "hand", ms: 1600 });
        const fishes = ["#6ab0d0", "#f2c94c", "#d51f2a", "#3aa655"];
        for (let i = 0; i < 4; i++) fx.later(i * 120, () => fx.fly(A.fish(fishes[i]), [W() / 2, H() * 0.4], [fx.rand(0, W()), fx.rand(0, H())], { size: 50, h: 30, dur: 1200, r2: fx.rand(-360, 360) }));
        for (let t = 0; t < 1.4; t += 0.08) fx.click({ freq: 2200, vol: 0.2, at: t });
        await fx.wait(1600);
        fx.caption("Supercalafragalisticexpialidocious!", { style: "subtitle", ms: 1400, css: { fontSize: "13px" } });
        fx.put(A.S("0 0 40 30", '<path d="M4 26 C4 10 36 10 36 26 Z" fill="#4a8a3a" ' + A.ink + ' stroke-width="2"/><path d="M4 26 H36" stroke="#1d1a18" stroke-width="2"/>'), r.x, r.y, { size: 40, h: 30, ms: 1400 });
        await fx.wait(1400);
        void tv;
      }
    }
  ]);
})();
