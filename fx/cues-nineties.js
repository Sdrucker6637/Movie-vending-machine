/* Machine FX cues - the nineties: indie, Hong Kong, Iranian, Chinese and Balkan cinema, J-horror and cult.
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
  // Wong Kar-wai step-printing: the page stutters and smears.
  const smear = (fx, ms) => {
    fx.filter("blur(1.5px) saturate(1.5)", ms, { fade: 150 });
    if (fx.reduced) return;
    const n = Math.round(ms / 160);
    const frames = [];
    for (let i = 0; i < n; i++) frames.push({ transform: "translate(" + (Math.random() * 10 - 5) + "px," + (Math.random() * 6 - 3) + "px)" });
    frames.push({ transform: "none" });
    fx.page(frames, { duration: ms, easing: "steps(" + n + ")", fill: "none" });
  };

  M.register([
    // Close-Up (1990)
    {
      id: 30017,
      y: 1990,
      run: async (fx) => {
        fx.filter("saturate(.8) sepia(.15)", 6600, { fade: 300 });
        const bike = A.S("0 0 100 60", '<circle cx="22" cy="44" r="14" fill="none" ' + A.ink + '/><circle cx="78" cy="44" r="14" fill="none" ' + A.ink + '/><path d="M22 44 L40 22 H64 L78 44 M40 22 L50 44 L64 22 M36 16 H46" fill="none" ' + A.ink + '/>');
        fx.fly(bike, [-60, H() - 70], [W() * 0.55, H() - 70], { size: 90, h: 54, dur: 3000, keep: true });
        await fx.wait(900);
        for (let i = 0; i < 12; i++) {
          fx.later(i * 200, () => {
            const cut = i % 3 === 0;
            fx.noise(cut ? 0.3 : 0.15, { type: "bandpass", freq: 1200, q: 1, vol: cut ? 0.3 : 0.12 });
          });
        }
        fx.caption("(the sound keeps cutting out)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
        const pot = A.S("0 0 50 40", '<path d="M8 12 H42 L38 38 H12 Z" fill="#b5613a" ' + A.ink + ' stroke-width="2"/><circle cx="25" cy="6" r="6" fill="#e0301c"/><circle cx="18" cy="8" r="5" fill="#f2c94c"/><circle cx="32" cy="8" r="5" fill="#e0301c"/>');
        fx.put(pot, W() * 0.55 + 20, H() - 110, { size: 44, h: 36 });
        fx.chord(["E4", "G#4", "B4"], 2, { type: "triangle", vol: 0.06, attack: 0.3 });
        fx.caption("(he brings flowers)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
      }
    },

    // Troll 2
    {
      id: 26914,
      y: 1990,
      run: async (fx) => {
        fx.filter("saturate(1.4) contrast(1.1) brightness(1.05)", 6000, { fade: 200 });
        fx.wash("rgba(60,200,80,.2)", 6000, { fade: 200 });
        const r = fx.rect(fx.slot());
        const corn = fx.put(A.S("0 0 40 80", '<path d="M20 4 C30 10 32 50 24 76 H16 C8 50 10 10 20 4 Z" fill="#f2d33b" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 12 }, (_, i) => '<circle cx="' + (16 + (i % 2) * 8) + '" cy="' + (14 + Math.floor(i / 2) * 10) + '" r="3" fill="#e0b83a"/>').join("") + '<path d="M16 76 C4 60 6 40 12 30 M24 76 C36 60 34 40 28 30" fill="#6aa04a" stroke="#3a6a2a" stroke-width="2"/>'),
          r.x, r.y, { size: 40, h: 80 });
        fx.move(corn, [{ transform: "none" }, { transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "none" }], { duration: 500, iterations: 3 });
        fx.caption("They're eating her…", { style: "subtitle", ms: 1500 });
        await fx.wait(1600);
        fx.caption("…and then they're going to eat me!", { style: "subtitle", ms: 1500 });
        await fx.wait(1600);
        fx.caption("OH MY GOOOOOD!", { style: "hand", ms: 1800 });
        fx.tone(300, 1.8, { type: "sawtooth", vol: 0.1, slide: 180, filter: { freq: 1500 }, vibrato: [7, 30] });
        fx.page([{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }], { duration: 1800 });
        await fx.wait(1900);
      }
    },

    // Miller's Crossing
    {
      id: 379,
      y: 1990,
      run: async (fx) => {
        fx.filter("sepia(.4) saturate(.9)", 6400, { fade: 400 });
        fx.wash("linear-gradient(rgba(60,80,50,.3), rgba(30,40,25,.5))", 6400, { fade: 500 });
        const hat = A.S("0 0 80 40", '<path d="M18 28 C18 8 62 8 62 28 Z" fill="#2b2622" ' + A.ink + ' stroke-width="2"/><path d="M4 30 C20 36 60 36 76 30 C60 26 20 26 4 30 Z" fill="#2b2622" ' + A.ink + ' stroke-width="2"/><path d="M20 24 H60" stroke="#6b4a2a" stroke-width="3"/>');
        fx.noise(5, { type: "bandpass", freq: 700, q: 0.6, vol: 0.2, attack: 0.8, pan: -1, panTo: 1 });
        fx.chord(["G3", "D4", "G4"], 5, { type: "sine", vol: 0.04, attack: 1.2 });
        fx.seq([["B4", 3], ["A4", 1], ["G4", 2], ["D5", 2], ["C5", 2], ["B4", 2], ["A4", 4]], { type: "triangle", vol: 0.07, beat: 0.35, at: 0.5 });
        await fx.fly(hat, [W() / 2 - 60, H() * 0.7], [W() / 2 + 80, -40], { size: 80, h: 40, dur: 4600, via: [W() / 2 + 20, H() * 0.35], r0: -10, r1: 12, r2: -6, easing: "ease-in-out" });
        fx.particles({ kind: "fall", count: 16, glyphs: [A.leaf("#b87a3a"), A.leaf("#8a6a3a")], min: 10, max: 18, dur: 2400, spin: 200 });
        fx.caption("Nobody knows anybody. Not that well.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Dreams (1990)
    {
      id: 12516,
      y: 1990,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const orchard = fx.wash("linear-gradient(#ffd8e8, #ffb0cc)", 7000, { fade: 600, blend: "multiply", opacity: 0.55 });
        void orchard;
        fx.particles({ kind: "fall", count: 60, glyphs: [A.petal("#ffc0d8"), A.petal("#fff0f4")], min: 6, max: 12, dur: 3600, spin: 200, wind: 60, stagger: 3000 });
        const flute = [["E5", 2], ["A5", 1], ["B5", 1], ["C6", 3], ["B5", 1], ["A5", 2], ["E5", 4]];
        fx.seq(flute, { type: "sine", vol: 0.09, beat: 0.3, vibrato: [5, 6], attack: 0.1 });
        for (let t = 0; t < 3.2; t += 0.4) fx.thud({ freq: 90, vol: 0.12, dur: 0.1, at: t });
        await fx.wait(3600);
        const others = fx.otherSlots(true).slice(0, 8);
        for (const o of others) {
          const or_ = fx.rect(o);
          fx.put(A.S("0 0 40 30", '<path d="M4 26 C4 8 36 8 36 26 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><circle cx="20" cy="14" r="4" fill="#d51f2a"/>'), or_.x, or_.top + 10, { size: 26, h: 20, ms: 2400 });
          fx.tone(fx.pick(["A5", "C6", "E6"]), 0.3, { type: "triangle", vol: 0.04 });
          await fx.wait(120);
        }
        fx.caption("(the dolls of the peach orchard)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        void r;
      }
    },

    // Raise the Red Lantern
    {
      id: 10404,
      y: 1991,
      run: async (fx) => {
        fx.wash("rgba(30,10,5,.45)", 7000, { fade: 400 });
        const rg = fx.rect(fx.$("#grid"));
        const n = W() < 500 ? 4 : 6;
        const lamps = [];
        for (let i = 0; i < n; i++) {
          const l = fx.put(A.S("0 0 40 60", '<path d="M20 0 V8" stroke="#c9a24a" stroke-width="2"/><rect x="12" y="6" width="16" height="6" fill="#c9a24a"/><ellipse cx="20" cy="32" rx="18" ry="20" fill="#d51f2a" stroke="#6b0a0a" stroke-width="2"/><path d="M8 32 H32 M20 12 V52" stroke="#9a1010" stroke-width="1.5"/><rect x="12" y="50" width="16" height="6" fill="#c9a24a"/><path d="M16 56 V60 M20 56 V62 M24 56 V60" stroke="#e8c870" stroke-width="1.5"/>'),
            rg.left + (i + 0.5) * rg.width / n, rg.top - 30, { size: 34, h: 52, style: { filter: "brightness(.35)" } });
          lamps.push(l);
        }
        const r = fx.rect(fx.slot());
        const mine = fx.put(A.S("0 0 40 60", '<ellipse cx="20" cy="32" rx="18" ry="20" fill="#d51f2a" stroke="#6b0a0a" stroke-width="2"/><rect x="12" y="6" width="16" height="6" fill="#c9a24a"/><rect x="12" y="50" width="16" height="6" fill="#c9a24a"/>'), r.x, r.top - 10, { size: 40, h: 60, style: { filter: "brightness(.35)" } });
        for (let i = 0; i < 6; i++) fx.noise(0.08, { type: "bandpass", freq: 3000, q: 6, vol: 0.25, at: i * 0.12 });
        await fx.wait(1600);
        fx.chord(["D4", "F4", "A4"], 3, { type: "sawtooth", vol: 0.03, filter: { freq: 900 }, attack: 0.4 });
        fx.style(mine, { filter: "brightness(1.3) drop-shadow(0 0 16px #ff4020)" });
        fx.wash("radial-gradient(circle at " + r.x + "px " + r.top + "px, rgba(255,60,30,.5), transparent 40%)", 3600, { fade: 400 });
        fx.caption("Light the lanterns in the Fourth Mistress's courtyard.", { style: "subtitle", ms: 2400, css: { fontSize: "14px" } });
        fx.later(1000, () => { for (let t = 0; t < 1.6; t += 0.12) fx.click({ freq: 4000, vol: 0.12, at: t }); });
        await fx.wait(3600);
        void lamps;
      }
    },

    // Delicatessen
    {
      id: 892,
      y: 1991,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(1.4) hue-rotate(-10deg)", 6600, { fade: 300 });
        fx.wash("rgba(200,140,30,.2)", 6600, { fade: 300 });
        const beat = 0.35;
        const parts = [
          () => fx.tone(98, 0.3, { type: "sawtooth", vol: 0.1, filter: { freq: 400 } }),
          () => fx.noise(0.12, { type: "bandpass", freq: 2200, q: 3, vol: 0.4 }),
          () => fx.tone(440, 0.25, { type: "triangle", vol: 0.1 }),
          () => fx.noise(0.08, { type: "highpass", freq: 5000, vol: 0.3 })
        ];
        const labels = ["(bedsprings)", "(carpet beating)", "(cello)", "(knitting)"];
        const slots = fx.$$("#grid .slot");
        for (let k = 0; k < 16; k++) {
          const t = k * beat * (1 - k * 0.02);
          fx.later(t * 1000, () => {
            parts.forEach((p, i) => { if (k >= i * 2) p(); });
            const sl = slots[(k * 5) % slots.length];
            if (sl) fx.move(sl, [{ transform: "none" }, { transform: "translateY(-4px)" }, { transform: "none" }], { duration: 200, fill: "none" });
            if (k % 2 === 0 && k < 8) fx.caption(labels[k / 2], { style: "whisper", ms: 600 });
          });
        }
        await fx.wait(5200);
        fx.thud({ vol: 0.5, freq: 50 });
        fx.noise(0.3, { freq: 900, vol: 0.4 });
        fx.caption("(the springs snap)", { style: "whisper", ms: 1200 });
        await fx.wait(1200);
      }
    },

    // Barton Fink
    {
      id: 290,
      y: 1991,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(1.1) brightness(.95)", 7000, { fade: 400 });
        const wall = fx.wash("repeating-linear-gradient(90deg, rgba(210,190,120,.3) 0 20px, rgba(190,170,100,.3) 20px 40px)", 7000, { fade: 400 });
        void wall;
        fx.tone(3200, 6, { type: "sine", vol: 0.02, vibrato: [0.3, 40], attack: 1 });
        fx.noise(0.6, { type: "bandpass", freq: 300, q: 6, vol: 0.2, at: 1 });
        await fx.wait(1400);
        const paper = fx.put('<div style="width:100%;height:100%;background:#e8d890;box-shadow:0 2px 0 #b8a860"></div>', W() * 0.8, H() * 0.2, { size: 90, h: 70, style: { transformOrigin: "50% 0" } });
        fx.noise(1.2, { type: "bandpass", freq: 2000, q: 2, vol: 0.2 });
        await fx.move(paper, [{ transform: "none" }, { transform: "rotateX(60deg) translateY(10px)" }], { duration: 1200, easing: "ease-in" });
        const drip = fx.put('<div style="width:100%;height:100%;background:linear-gradient(#e8d890,#d8c070);border-radius:0 0 50% 50%"></div>', W() * 0.8, H() * 0.2 + 70, { size: 8, h: 30 });
        fx.move(drip, [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 1600 });
        await fx.wait(1200);
        const typer = fx.put('<div style="font:15px/1.3 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:10px;border:1px solid #bbb;white-space:pre"></div>', W() / 2, H() * 0.45, { size: 220, h: 60 });
        const line = "Fade in on a tenement…";
        for (let i = 0; i <= line.length; i++) {
          typer.firstChild.textContent = line.slice(0, i);
          fx.click({ freq: 2200, vol: 0.2 });
          await fx.wait(80);
        }
        fx.tone(2400, 0.3, { type: "sine", vol: 0.1 });
        await fx.wait(1200);
      }
    },

    // Twin Peaks: Fire Walk with Me
    {
      id: 1923,
      y: 1992,
      run: async (fx) => {
        const floor = fx.node(A.S("0 0 400 200", Array.from({ length: 12 }, (_, i) => '<path d="M' + (i * 40 - 40) + ' 200 L' + (i * 40) + ' 160 L' + (i * 40 + 40) + ' 200 L' + (i * 40 + 80) + ' 160" stroke="#0d0b09" stroke-width="18" fill="none"/>').join("")),
          { style: { position: "absolute", left: 0, right: 0, bottom: 0, height: "30vh", background: "#f4f2ec" } });
        floor.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(floor.firstChild.style, { width: "100%", height: "100%" });
        const curtains = fx.node("", { cls: "fx-filter", style: { bottom: "30vh", background: "repeating-linear-gradient(90deg, #8a0a14 0 16px, #b3122a 16px 26px, #6a0810 26px 34px)" } });
        fx.anim([curtains, floor], [{ opacity: 0 }, { opacity: 1 }], { duration: 800, fill: "forwards" });
        fx.chord(["E3", "G3", "B3"], 6, { type: "sawtooth", vol: 0.04, filter: { freq: 700 }, vibrato: [4, 6], attack: 1 });
        fx.seq([["B4", 4], ["C5", 2], ["B4", 2], ["G4", 4], ["E4", 4]], { type: "sine", vol: 0.08, beat: 0.4, attack: 0.2 });
        await fx.wait(1600);
        const lines = ["Where we're from, the birds sing a pretty song…", "…and there's always music in the air."];
        for (const l of lines) {
          fx.caption(l, { style: "subtitle", ms: 1800, css: { fontSize: "14px", letterSpacing: ".05em" } });
          fx.tone(180, 1.6, { type: "sawtooth", vol: 0.03, filter: { type: "bandpass", freq: 700, q: 4 }, slide: 150 });
          await fx.wait(1900);
        }
        fx.put(A.S("0 0 40 40", '<path d="M20 36 C6 26 4 16 10 10 C14 6 18 8 20 12 C22 8 26 6 30 10 C36 16 34 26 20 36 Z" fill="#c9a24a"/><rect x="18" y="14" width="4" height="6" fill="#1d1a18"/>'), W() / 2, H() * 0.4, { size: 36, ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Porco Rosso
    {
      id: 11621,
      y: 1992,
      run: async (fx) => {
        const sea = fx.wash("linear-gradient(#8fd0ff 0 55%, #2a8ab0 55%)", 6600, { fade: 500, blend: "multiply", opacity: 0.45 });
        void sea;
        const plane = A.S("0 0 140 60", '<path d="M10 30 C30 22 90 20 120 26 L136 20 V40 L120 36 C90 40 30 40 10 30 Z" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><rect x="40" y="10" width="60" height="6" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><rect x="40" y="44" width="60" height="6" fill="#d51f2a" ' + A.ink + ' stroke-width="2"/><path d="M50 16 V44 M90 16 V44" ' + A.ink + ' stroke-width="1.5"/><circle cx="4" cy="30" r="4" fill="#9aa2a6"/><circle cx="66" cy="26" r="6" fill="#f2c0b0" ' + A.ink + ' stroke-width="1.5"/>');
        fx.tone(90, 4, { type: "sawtooth", vol: 0.06, filter: { freq: 400 }, vibrato: [30, 4] });
        const tune = [["D5", 2], ["F5", 1], ["A5", 1], ["G5", 3], ["F5", 1], ["E5", 2], ["D5", 2], ["C#5", 4]];
        fx.seq(tune, { type: "triangle", vol: 0.08, beat: 0.3 });
        fx.later(800, () => fx.particles({ kind: "sweep", dir: "rtl", count: 8, area: pt(W() / 2, H() * 0.3, W(), 60), glyphs: dot("rgba(255,255,255,.8)"), min: 30, max: 60, dur: 2400, stagger: 1200 }));
        await fx.fly(plane, [-140, H() * 0.4], [W() + 140, H() * 0.22], { size: 150, h: 64, dur: 4200, via: [W() / 2, H() * 0.5], r0: 8, r1: -4, r2: -10, flip: true, easing: "ease-in-out" });
        fx.caption("A pig who doesn't fly is just a pig.", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Three Colors: Blue
    {
      id: 108,
      y: 1993,
      run: async (fx) => {
        const blue = fx.wash("rgba(20,70,200,.55)", 6400, { blend: "multiply", fade: 200 });
        fx.chord(["C3", "G3", "C4", "E4", "G4", "C5"], 1.8, { type: "sawtooth", vol: 0.05, filter: { freq: 1800 }, attack: 0.08 });
        fx.chord(["C3", "G3", "C4", "E4", "G4", "C5"], 1.8, { type: "sine", vol: 0.04, attack: 0.08 });
        await fx.wait(1900);
        blue.style.opacity = 0;
        fx.caption("(silence)", { style: "whisper", ms: 1400 });
        await fx.wait(1500);
        blue.style.opacity = 1;
        fx.chord(["A2", "E3", "A3", "C4", "E4"], 1.8, { type: "sawtooth", vol: 0.05, filter: { freq: 1600 } });
        const r = fx.rect(fx.slot());
        const cube = fx.put('<div style="width:100%;height:100%;background:#fff;border-radius:3px;box-shadow:0 0 0 1px #bbb"></div>', r.x, r.y - 30, { size: 18 });
        await fx.wait(600);
        const coffee = fx.put('<div style="width:100%;height:100%;background:linear-gradient(to top, #3b2010 0%, #3b2010 100%)"></div>', r.x, r.y - 30, { size: 18, h: 0 });
        fx.tween(2000, (k) => { coffee.style.height = 18 * k + "px"; coffee.style.top = parseFloat(cube.style.top) + 18 * (1 - k) + "px"; });
        fx.caption("(she watches the sugar cube soak through)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Cronos
    {
      id: 11655,
      y: 1993,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const dev = fx.put(A.S("0 0 80 80", '<path d="M40 4 C60 4 74 18 74 40 C74 62 60 76 40 76 C20 76 6 62 6 40 C6 18 20 4 40 4 Z" fill="#c9a24a" ' + A.ink + '/><circle cx="40" cy="40" r="14" fill="#8a6a1a" ' + A.ink + ' stroke-width="2"/><path d="M40 4 L46 16 M76 40 L64 44 M40 76 L34 64 M4 40 L16 36 M14 14 L24 22 M66 14 L56 22 M14 66 L24 58 M66 66 L56 58" stroke="#1d1a18" stroke-width="3"/><path class="leg" d="M8 30 L-4 22 M8 50 L-4 58 M72 30 L84 22 M72 50 L84 58" stroke="#8a6a1a" stroke-width="3"/>'),
          r.x, r.y, { size: 70 });
        for (let t = 0; t < 2.4; t += 0.15) fx.click({ freq: 3500, vol: 0.15, at: t });
        fx.tone(110, 2.4, { type: "sawtooth", vol: 0.04, filter: { freq: 500 } });
        await fx.move(dev, Array.from({ length: 8 }, (_, i) => ({ transform: "rotate(" + i * 20 + "deg) scale(" + (1 + (i % 2) * 0.05) + ")" })), { duration: 2400 });
        fx.noise(0.2, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.tone(1600, 0.4, { type: "sawtooth", vol: 0.06, slide: 800 });
        fx.buzz([60, 30, 60]);
        fx.particles({ kind: "burst", from: dev, count: 12, spread: 30, gravity: 80, glyphs: dot("#9a0010"), min: 3, max: 6, dur: 900, stagger: 0 });
        fx.later(600, () => fx.style(fx.$(".reely"), { filter: "saturate(.4) brightness(1.2)" }, 2400));
        fx.caption("(it bites)", { style: "whisper", ms: 1600 });
        await fx.wait(2400);
      }
    },

    // To Live
    {
      id: 31439,
      y: 1994,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const lamp = fx.node("", { cls: "fx-filter", style: { background: "radial-gradient(circle at 50% 50%, rgba(255,210,120,.0) 20%, rgba(20,10,0,.7))" } });
        void lamp;
        const screen = fx.put('<div style="width:100%;height:100%;background:rgba(255,240,210,.85);border:4px solid #6b4a2a"></div>', r.x, r.y, { size: r.width * 1.6, h: r.height * 1.2 });
        const puppets = A.S("0 0 120 80", '<path d="M20 70 L30 30 L40 70 Z M30 30 C24 22 26 12 32 10 C38 12 40 22 30 30 M28 16 L18 6" fill="#6b1d0a" opacity=".85"/><path d="M80 70 L90 30 L100 70 Z M90 30 C84 22 86 12 92 10 C98 12 100 22 90 30 M92 16 L102 6" fill="#1d3a6b" opacity=".85"/>');
        const p = fx.put(puppets, r.x, r.y, { size: r.width * 1.4, h: r.height });
        void screen;
        const suona = [["G4", 1], ["A4", 1], ["C5", 2], ["D5", 1], ["C5", 1], ["A4", 2], ["G4", 4]];
        fx.seq(suona, { type: "sawtooth", vol: 0.07, beat: 0.22, filter: { type: "bandpass", freq: 1400, q: 2 }, vibrato: [7, 10] });
        for (let i = 0; i < 8; i++) fx.noise(0.06, { type: "bandpass", freq: 3200, q: 4, vol: 0.3, at: i * 0.25 });
        await fx.move(p, [{ transform: "none" }, { transform: "translateX(8px) rotate(3deg)" }, { transform: "translateX(-8px) rotate(-3deg)" }, { transform: "none" }], { duration: 800, iterations: 3 });
        fx.caption("(the shadow puppets survive everything)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Sátántangó
    {
      id: 31414,
      y: 1994,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.15)", 12000, { fade: 400 });
        fx.particles({ kind: "fall", count: 120, glyphs: '<div style="width:1px;height:100%;background:rgba(220,220,220,.7)"></div>', min: 10, max: 20, dur: 800, stagger: 10000, wind: -20 });
        fx.noise(11, { type: "highpass", freq: 2500, vol: 0.08, attack: 1 });
        const cows = A.S("0 0 80 50", '<ellipse cx="38" cy="26" rx="26" ry="14" fill="#2b2622"/><rect x="62" y="16" width="14" height="12" rx="4" fill="#2b2622"/><path d="M20 38 V50 M30 38 V50 M46 38 V50 M56 38 V50" stroke="#2b2622" stroke-width="4"/>');
        for (let i = 0; i < 4; i++) fx.later(i * 600, () => fx.fly(cows, [-60, H() * 0.7 - (i % 2) * 20], [W() + 60, H() * 0.68 - (i % 2) * 20], { size: 60, h: 38, dur: 9000, easing: "linear" }));
        fx.later(1000, () => fx.tone(160, 1.2, { type: "sawtooth", vol: 0.04, filter: { freq: 500 }, slide: 120 }));
        const tango = [["A4", 1], [null, 1], ["A4", 1], ["C5", 1], ["E5", 2], ["D5", 1], ["C5", 1], ["B4", 2], ["A4", 2]];
        for (let i = 0; i < 4; i++) fx.seq(tango, { type: "sawtooth", vol: 0.03, beat: 0.25, at: 2 + i * 2.75, filter: { freq: 1300 }, vibrato: [5, 5] });
        fx.caption("(this is going to take a while)", { style: "whisper", ms: 3000 });
        await fx.wait(11000);
      },
      maxMs: 13000
    },

    // Three Colors: Red
    {
      id: 110,
      y: 1994,
      run: async (fx) => {
        const red = fx.wash("rgba(200,20,30,.5)", 6400, { blend: "multiply", fade: 400 });
        void red;
        const r = fx.rect(fx.slot());
        const billboard = fx.put(A.S("0 0 160 70", '<rect x="2" y="2" width="156" height="66" fill="#d51f2a" ' + A.ink + '/><ellipse cx="80" cy="36" rx="18" ry="24" fill="#f2d6b3"/><path d="M62 30 C70 10 90 10 98 30" fill="#6b3a1a"/>'), W() / 2, H() * 0.28, { size: 200, h: 88 });
        void billboard;
        fx.chord(["A3", "C4", "E4"], 3, { type: "sine", vol: 0.05, attack: 0.5 });
        const dog = A.S("0 0 60 40", '<path d="M8 22 C10 12 30 10 42 14 L48 6 L52 10 L50 18 C54 22 52 28 46 28 L44 36 M16 28 L14 36 M26 28 L26 36 M36 28 L36 36" fill="#c9a24a" ' + A.ink + ' stroke-width="2.5"/>');
        await fx.wait(1400);
        fx.noise(0.3, { type: "highpass", freq: 3000, vol: 0.4 });
        fx.thud({ vol: 0.4 });
        fx.fly(dog, [-60, H() - 60], [r.x, r.top + r.height + 20], { size: 60, h: 40, dur: 1400, keep: true });
        await fx.wait(1400);
        const phone = fx.put(A.S("0 0 40 20", '<path d="M4 16 C4 4 36 4 36 16" stroke="#1d1a18" stroke-width="5" fill="none"/>'), W() * 0.2, H() * 0.6, { size: 40, h: 20 });
        for (let i = 0; i < 4; i++) fx.noise(0.5, { type: "bandpass", freq: 900 + i * 200, q: 8, vol: 0.06, at: i * 0.5, pan: -0.6 });
        fx.caption("(he's listening to his neighbours' calls)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
        void phone;
      }
    },

    // Chungking Express
    {
      id: 11104,
      y: 1994,
      run: async (fx) => {
        smear(fx, 2600);
        const tins = [];
        const r = fx.rect(fx.slot());
        const lbl = "MAY 1";
        for (let i = 0; i < 8; i++) {
          const t = fx.put(A.S("0 0 30 36", '<rect x="3" y="4" width="24" height="30" rx="3" fill="#f2c94c" ' + A.ink + ' stroke-width="2"/><rect x="3" y="12" width="24" height="12" fill="#e0501c"/><text x="15" y="21" font-size="6" text-anchor="middle" fill="#fff" font-family="Georgia">' + lbl + "</text>"), r.x + (i % 4 - 1.5) * 30, r.top + r.height + 20 + Math.floor(i / 4) * 30, { size: 28, h: 34 });
          tins.push(t);
          fx.click({ freq: 2800, vol: 0.2 });
          await fx.wait(120);
        }
        fx.caption("(pineapple, expiring May 1)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const beat = 0.22;
        const hook = [["E5", 1], ["E5", 1], ["D5", 1], ["E5", 1], ["G5", 2], ["E5", 2], ["D5", 1], ["C5", 1], ["D5", 2]];
        fx.seq(hook, { type: "triangle", vol: 0.08, beat });
        for (let i = 0; i < 12; i++) fx.thud({ freq: 70, vol: 0.15, dur: 0.08, at: i * beat });
        const air = A.S("0 0 70 30", '<path d="M4 20 L50 12 L66 4 L62 14 L50 18 Z M30 16 L20 28 M38 14 L50 26" fill="#e0e4e6" ' + A.ink + ' stroke-width="2"/>');
        fx.fly(air, [-70, H() * 0.3], [W() + 70, H() * 0.15], { size: 70, h: 30, dur: 2600 });
        await fx.wait(2700);
      }
    },

    // The Hudsucker Proxy
    {
      id: 11934,
      y: 1994,
      run: async (fx) => {
        fx.filter("sepia(.3) saturate(1.1)", 6400, { fade: 300 });
        const r = fx.rect(fx.slot());
        const circle = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="46" fill="none" ' + A.ink + ' stroke-width="4"/>'), r.x, r.y, { size: 100 });
        void circle;
        fx.caption("You know… for kids.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
        const hoop = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="none" stroke="#d51f2a" stroke-width="8"/><circle cx="50" cy="50" r="44" fill="none" stroke="#f2c94c" stroke-width="3" stroke-dasharray="10 10"/>'), -60, H() - 70, { size: 90 });
        const tune = [["C5", 1], ["E5", 1], ["G5", 2], ["C6", 2], ["G5", 1], ["E5", 1], ["C5", 4]];
        fx.seq(tune, { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2000 } });
        await fx.move(hoop, [{ transform: "translateX(0) rotate(0)" }, { transform: "translateX(" + (W() + 120) + "px) rotate(1080deg)" }], { duration: 2400, easing: "linear" });
        fx.caption("(the Hula Hoop — it catches on)", { style: "whisper", ms: 1400 });
        const kids = fx.otherSlots(true).slice(0, 8);
        kids.forEach((k, i) => fx.move(k, [{ transform: "rotate(0)" }, { transform: "rotate(" + (i % 2 ? 8 : -8) + "deg)" }, { transform: "rotate(0)" }], { duration: 400, iterations: 3, delay: i * 60, fill: "none" }));
        await fx.wait(1800);
      }
    },

    // The Adventures of Priscilla, Queen of the Desert
    {
      id: 2759,
      y: 1994,
      run: async (fx) => {
        const desert = fx.wash("linear-gradient(#ffb070, #ff6a3a 60%, #b3402d)", 6400, { blend: "multiply", fade: 400, opacity: 0.45 });
        void desert;
        const bus = A.S("0 0 160 60", '<rect x="6" y="10" width="148" height="36" rx="8" fill="#e8e4da" ' + A.ink + '/><rect x="16" y="16" width="120" height="12" fill="#9ab" ' + A.ink + ' stroke-width="1.5"/><path d="M40 4 L120 4 L112 10 H48 Z" fill="#c9a24a"/><circle cx="36" cy="48" r="9" fill="#1d1a18"/><circle cx="124" cy="48" r="9" fill="#1d1a18"/>' +
          '<path d="M60 4 C70 -30 110 -40 140 -20 C120 -10 100 -4 90 4 Z" fill="#e6c0ff" stroke="#b36be8" stroke-width="2"/>');
        const tune = [["G4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["D5", 2], ["B4", 1], ["A4", 1], ["G4", 2], ["E4", 2]];
        fx.seq(tune.concat(tune), { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2600 } });
        for (let i = 0; i < 16; i++) fx.thud({ freq: 80, vol: 0.2, dur: 0.1, at: i * 0.36 });
        fx.particles({ kind: "fall", count: 40, glyphs: ["#ff3bb0", "#b33bff", "#ffd23b", "#3bd1ff"].map((c) => A.sparkle(c)), min: 8, max: 16, dur: 3000, spin: 360, stagger: 3000 });
        await fx.fly(bus, [-180, H() - 90], [W() + 180, H() - 90], { size: 180, h: 68, dur: 5000, easing: "linear" });
      }
    },

    // Clerks
    {
      id: 2292,
      y: 1994,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(1.2)", 6000, { fade: 300 });
        const r = fx.rect(fx.slot());
        const sign = fx.put('<div style="font:700 13px/1.2 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;border:2px solid #1d1a18;padding:6px;text-align:center">I ASSURE YOU;<br>WE\'RE OPEN</div>', r.x, r.y, { size: 130, h: 48 });
        fx.move(sign, [{ transform: "rotate(-4deg)" }, { transform: "rotate(-2deg)" }], 400);
        fx.click({ freq: 1200, vol: 0.3 });
        await fx.wait(1600);
        fx.caption("I'm not even supposed to be here today!", { style: "subtitle", ms: 2200 });
        const tune = [["E4", 1], ["E4", 1], ["G4", 1], ["A4", 1], ["B4", 2], ["A4", 2]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 1800 } });
        for (let i = 0; i < 8; i++) fx.noise(0.06, { type: "highpass", freq: 6000, vol: 0.15, at: i * 0.18 });
        await fx.wait(2400);
        const lot = fx.put(A.S("0 0 40 40", '<rect x="4" y="4" width="32" height="32" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M4 20 H36 M20 4 V36" stroke="#1d1a18" stroke-width="1"/>'), W() * 0.2, H() - 60, { size: 30 });
        fx.move(lot, [{ transform: "none" }, { transform: "translateY(-30px)" }, { transform: "none" }], 500);
        fx.caption("(roof hockey, anyone?)", { style: "whisper", ms: 1400 });
        await fx.wait(1500);
      }
    },

    // Underground
    {
      id: 11902,
      y: 1995,
      run: async (fx) => {
        const beat = 0.14;
        const brass = [["D5", 1], ["D5", 1], ["F5", 1], ["E5", 1], ["D5", 1], ["C#5", 1], ["D5", 2], ["A4", 1], ["Bb4", 1], ["C#5", 1], ["D5", 1], ["E5", 1], ["F5", 1], ["E5", 2]];
        fx.seq(brass.concat(brass), { type: "sawtooth", vol: 0.06, beat, filter: { freq: 2000 } });
        fx.seq(brass.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]).concat(brass.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l])), { type: "square", vol: 0.03, beat, filter: { freq: 900 } });
        for (let i = 0; i < 32; i++) fx.thud({ freq: i % 2 ? 150 : 70, vol: 0.22, dur: 0.08, at: i * beat });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-6px) rotate(" + (i % 2 ? 5 : -5) + "deg)" }, { transform: "none" }], { duration: beat * 2000, delay: i * 40, iterations: 8, fill: "none" }));
        fx.move([fx.$(".reely"), fx.$(".kernel")], [{ transform: "none" }, { transform: "translateY(-10px) rotate(-8deg)" }, { transform: "none" }, { transform: "translateY(-10px) rotate(8deg)" }, { transform: "none" }], { duration: beat * 4000, iterations: 4 });
        await fx.wait(2400);
        const land = fx.put(A.S("0 0 160 70", '<path d="M10 40 C10 20 150 20 150 40 C150 56 10 56 10 40 Z" fill="#6a8a4a" ' + A.ink + ' stroke-width="2"/><path d="M40 30 V12 H70 V30 M100 30 L110 14 L120 30" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.75, { size: 180, h: 80 });
        fx.move(land, [{ transform: "translateY(" + H() * 0.3 + "px)" }, { transform: "none" }], { duration: 1200, easing: "ease-out" });
        fx.caption("Once upon a time there was a country…", { style: "subtitle", ms: 2000 });
        fx.move(land, [{ transform: "none" }, { transform: "translateX(" + W() + "px)" }], { duration: 2400, delay: 1400, easing: "ease-in" });
        await fx.wait(2400);
      }
    },

    // Fallen Angels
    {
      id: 11220,
      y: 1995,
      run: async (fx) => {
        const neon = fx.wash("linear-gradient(135deg, rgba(0,200,160,.35), rgba(255,40,140,.35))", 6000, { blend: "multiply", fade: 200 });
        void neon;
        smear(fx, 3000);
        fx.tone(90, 5, { type: "sawtooth", vol: 0.05, filter: { freq: 400 }, vibrato: [6, 6] });
        const hook = [["A4", 2], ["C5", 1], ["E5", 1], ["D5", 2], ["C5", 2], ["A4", 4]];
        fx.seq(hook, { type: "sine", vol: 0.08, beat: 0.3, vibrato: [4, 6] });
        await fx.wait(3000);
        const bike = A.S("0 0 120 60", '<circle cx="24" cy="44" r="14" fill="#1d1a18"/><circle cx="96" cy="44" r="14" fill="#1d1a18"/><path d="M24 44 L50 24 H86 L96 44" stroke="#1d1a18" stroke-width="6" fill="none"/><path d="M50 14 C54 4 70 4 74 14 L72 24 H52 Z" fill="#1d1a18"/>');
        fx.caption("(the tunnel light goes on forever)", { style: "whisper", ms: 1800, css: { color: "#fff" } });
        for (let i = 0; i < 8; i++) fx.later(i * 200, () => fx.fly(box("background:linear-gradient(90deg, transparent, #ffd8a0);border-radius:2px"), [W() + 20, H() * 0.2 + i * 12], [-20, H() * 0.2 + i * 12], { size: 120, h: 3, dur: 400 }));
        await fx.fly(bike, [-120, H() - 80], [W() + 120, H() - 80], { size: 110, h: 55, dur: 1800, easing: "ease-in" });
        await fx.wait(600);
      }
    },

    // The White Balloon
    {
      id: 46785,
      y: 1995,
      run: async (fx) => {
        fx.filter("saturate(1.1)", 6400, { fade: 300 });
        const r = fx.rect(fx.slot());
        const grate = fx.put(A.S("0 0 100 40", '<rect x="2" y="2" width="96" height="36" fill="#2b2622" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 9 }, (_, i) => '<path d="M' + (10 + i * 10) + ' 2 V38" stroke="#6d7478" stroke-width="3"/>').join("")), W() / 2, H() - 60, { size: 120, h: 48 });
        void grate;
        const note = fx.put('<div style="width:100%;height:100%;background:#9ac8a0;border:1px solid #3a6a4a;border-radius:2px"></div>', r.x, r.y, { size: 34, h: 18 });
        await fx.move(note, [{ transform: "none" }, { transform: "translate(" + (W() / 2 - r.x) + "px," + (H() - 50 - r.y) + "px) rotate(40deg)" }], { duration: 1400, easing: "cubic-bezier(.5,0,.8,.6)" });
        fx.caption("(the money fell through the grate)", { style: "whisper", ms: 1800 });
        fx.tone(600, 0.6, { type: "sine", vol: 0.06, slide: 300 });
        await fx.wait(1600);
        const pole = fx.put(A.S("0 0 20 120", '<path d="M10 0 V110" stroke="#6b4a2a" stroke-width="3"/><circle cx="10" cy="112" r="7" fill="#fff" stroke="#999" stroke-width="1.5"/>'), W() / 2 + 30, H() * 0.4, { size: 20, h: 120 });
        await fx.move(pole, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.6 - 130) + "px)" }], { duration: 900 });
        fx.chord(["G4", "B4", "D5", "G5"], 1.6, { type: "triangle", vol: 0.06 });
        fx.caption("(with a balloon and some gum)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // Dilwale Dulhania Le Jayenge
    {
      id: 19404,
      y: 1995,
      run: async (fx) => {
        const field = fx.wash("linear-gradient(transparent 50%, rgba(250,210,40,.45))", 6400, { fade: 500 });
        void field;
        const mustard = fullSvg(fx, A.S("0 0 400 100", Array.from({ length: 80 }, (_, i) => '<circle cx="' + (i * 5 + (i % 3)) + '" cy="' + (30 + (i * 29) % 60) + '" r="3" fill="#f2c94c"/>').join("")), { top: "auto", height: "30vh", bottom: 0 });
        void mustard;
        const tune = [["E5", 2], ["G5", 1], ["A5", 1], ["C6", 3], ["B5", 1], ["A5", 2], ["G5", 2], ["E5", 4]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.28, filter: { freq: 1600 }, vibrato: [6, 10] });
        for (let t = 0; t < 4.4; t += 0.28) fx.thud({ freq: 120, vol: 0.12, dur: 0.1, at: t });
        const train = A.S("0 0 220 50", '<rect x="20" y="8" width="190" height="30" fill="#3a6ad8" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 8 }, (_, i) => '<rect x="' + (28 + i * 22) + '" y="14" width="14" height="10" fill="#cfe8ff"/>').join("") + '<circle cx="40" cy="42" r="6" fill="#1d1a18"/><circle cx="190" cy="42" r="6" fill="#1d1a18"/>');
        fx.fly(train, [W() + 200, H() * 0.55], [W() * 0.3, H() * 0.55], { size: 240, h: 55, dur: 3000, easing: "ease-out", keep: true });
        await fx.wait(2600);
        const hand = A.S("0 0 60 30", '<path d="M2 14 C10 6 30 6 40 10 L56 8 C60 8 60 14 56 14 L44 16 L56 20 C58 22 56 26 52 24 L34 22 C18 26 6 24 2 14 Z" fill="#e8c8a0" ' + A.ink + ' stroke-width="2"/>');
        fx.put(hand, W() * 0.3 + 70, H() * 0.55 - 20, { size: 50, h: 25, ms: 2000 });
        fx.put(hand, W() * 0.3 + 120, H() * 0.55 + 10, { size: 50, h: 25, ms: 2000, style: { transform: "scaleX(-1)" } });
        fx.caption("Ja Simran, ja…", { style: "subtitle", ms: 2000 });
        fx.particles({ kind: "drift", count: 12, glyphs: A.heart("#e05a5a"), min: 10, max: 16, dur: 1800 });
        await fx.wait(2200);
      }
    },

    // Happy Together
    {
      id: 18329,
      y: 1997,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const lamp = fx.put(A.S("0 0 100 110", '<path d="M50 6 L90 70 H10 Z" fill="rgba(255,230,160,.85)" stroke="#6b4a2a" stroke-width="2"/><path d="M20 70 C30 60 70 60 80 70" stroke="#3a8a9a" stroke-width="4" fill="none"/><path d="M30 60 L50 20 L70 60" stroke="#3a8a9a" stroke-width="2" fill="none"/><rect x="44" y="70" width="12" height="30" fill="#6b4a2a"/><rect x="30" y="100" width="40" height="8" fill="#6b4a2a"/>'),
          r.x + r.width, r.y, { size: 80, h: 88 });
        fx.move(lamp, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 3000, iterations: 2, easing: "linear" });
        const falls = fx.wash("linear-gradient(90deg, rgba(255,255,255,.0), rgba(220,240,255,.45) 40%, rgba(255,255,255,.0))", 6000, { fade: 700 });
        void falls;
        fx.noise(6, { freq: 1200, sweep: 700, vol: 0.2, attack: 1 });
        fx.particles({ kind: "fall", count: 50, glyphs: dot("rgba(230,245,255,.8)"), min: 2, max: 5, dur: 900, stagger: 5000 });
        const tango = [["E5", 2], ["D#5", 1], ["E5", 1], ["C5", 2], ["A4", 2], ["B4", 1], ["C5", 1], ["D5", 2], ["E5", 4]];
        fx.seq(tango, { type: "sawtooth", vol: 0.05, beat: 0.28, filter: { freq: 1400 }, vibrato: [5, 6] });
        fx.caption("Let's start over.", { style: "subtitle", ms: 2200 });
        smear(fx, 1600);
        await fx.wait(5600);
      }
    },

    // Perfect Blue
    {
      id: 10494,
      y: 1997,
      run: async (fx) => {
        const s = fx.slot();
        const r = fx.rect(s);
        fx.filter("saturate(1.2) hue-rotate(-10deg)", 6600, { fade: 300 });
        const mirror = fx.put('<div style="width:100%;height:100%;border:3px solid #cfe8ff;border-radius:6px;background:rgba(200,220,255,.2)"></div>', r.x + r.width * 1.1, r.y, { size: r.width, h: r.height });
        const img = s && s.querySelector("img");
        const refl = fx.put(img ? '<img src="' + img.src + '" style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1);opacity:.85">' : box("background:#9ab"), r.x + r.width * 1.1, r.y, { size: r.width * 0.9, h: r.height * 0.9 });
        void mirror;
        const pop = [["E5", 1], ["G5", 1], ["A5", 1], ["G5", 1], ["E5", 2], ["D5", 2], ["C5", 1], ["D5", 1], ["E5", 4]];
        fx.seq(pop, { type: "square", vol: 0.05, beat: 0.16, filter: { freq: 3000 } });
        await fx.wait(1800);
        fx.move(refl, [{ transform: "none" }, { transform: "translateY(-10px) rotate(-6deg)" }, { transform: "none" }], { duration: 600, iterations: 2 });
        fx.caption("Who are you?", { style: "subtitle", ms: 1400 });
        await fx.wait(1500);
        fx.chord(["B3", "C4", "F4"], 1.6, { type: "sawtooth", vol: 0.07, filter: { freq: 1400 } });
        fx.caption("I'm the real thing.", { style: "hand", ms: 1600, css: { color: "#ff6ab0" } });
        fx.style(refl, { filter: "saturate(2) hue-rotate(300deg)" });
        await fx.move(refl, [{ transform: "none" }, { transform: "translate(" + W() * 0.2 + "px,-" + H() * 0.2 + "px) scale(1.1)" }], { duration: 1600, easing: "ease-out" });
        await fx.wait(300);
      }
    },

    // Cube
    {
      id: 431,
      y: 1997,
      run: async (fx) => {
        const room = fx.node(A.S("0 0 300 300", '<rect width="300" height="300" fill="rgba(200,140,40,.4)"/><path d="M0 0 L80 80 H220 L300 0 M0 300 L80 220 H220 L300 300 M80 80 V220 M220 80 V220" stroke="#6b4a1a" stroke-width="4" fill="none"/>' +
          Array.from({ length: 9 }, (_, i) => '<rect x="' + (90 + (i % 3) * 42) + '" y="' + (90 + Math.floor(i / 3) * 42) + '" width="36" height="36" fill="none" stroke="#8a6a2a" stroke-width="2"/>').join("") + '<rect x="132" y="132" width="36" height="36" fill="#2b2622"/>'),
          { cls: "fx-filter", style: { opacity: 0 } });
        room.firstChild.setAttribute("preserveAspectRatio", "xMidYMid slice");
        Object.assign(room.firstChild.style, { width: "100%", height: "100%" });
        fx.anim(room, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: "forwards" });
        fx.tone(70, 5, { type: "sawtooth", vol: 0.05, filter: { freq: 250 }, attack: 0.6 });
        const primes = ["149 · 373 · 083", "566 · 472 · 737", "(prime?)"];
        for (const p of primes) {
          fx.caption(p, { style: "terminal", ms: 1100, css: { color: "#ffb347", textShadow: "0 0 6px #ff7a1a" } });
          fx.tone(fx.pick([400, 600, 800]), 0.1, { type: "square", vol: 0.05 });
          await fx.wait(1200);
        }
        const wire = fx.put(box("background:repeating-linear-gradient(0deg, rgba(255,255,255,.9) 0 1px, transparent 1px 12px), repeating-linear-gradient(90deg, rgba(255,255,255,.9) 0 1px, transparent 1px 12px)"), W() / 2, H() / 2, { size: Math.max(W(), H()), h: Math.max(W(), H()) });
        wire.style.opacity = 0;
        fx.noise(0.3, { type: "highpass", freq: 5000, vol: 0.6 });
        fx.tone(4000, 0.4, { type: "sawtooth", vol: 0.05, slide: 1000 });
        fx.buzz([40, 30, 40]);
        await fx.anim(wire, [{ opacity: 0, transform: "translateX(-100%)" }, { opacity: 1, transform: "translateX(100%)" }], { duration: 500 });
        await fx.wait(800);
      }
    },

    // Lost Highway
    {
      id: 638,
      y: 1997,
      run: async (fx) => {
        const dark = fx.node("", { cls: "fx-filter", style: { background: "#050505", opacity: 0 } });
        fx.anim(dark, [{ opacity: 0 }, { opacity: 0.88 }], { duration: 700, fill: "forwards" });
        const road = fx.node(A.S("0 0 400 300", '<path class="d" d="M200 300 V0" stroke="#f2c94c" stroke-width="8" stroke-dasharray="30 40"/>'), { cls: "fx-filter" });
        road.firstChild.setAttribute("preserveAspectRatio", "none");
        Object.assign(road.firstChild.style, { width: "100%", height: "100%" });
        const d = road.querySelector(".d");
        fx.noise(5, { freq: 200, vol: 0.2, attack: 0.5 });
        fx.tone(55, 5, { type: "sawtooth", vol: 0.06, filter: { freq: 200 } });
        await fx.tween(3200, (k) => { if (d) d.style.strokeDashoffset = k * 1200; });
        fx.caption("Dick Laurent is dead.", { style: "subtitle", ms: 2000, css: { color: "#fff" } });
        fx.noise(0.05, { type: "bandpass", freq: 1200, q: 2, vol: 0.4 });
        await fx.wait(2200);
      }
    },

    // Festen
    {
      id: 309,
      y: 1998,
      run: async (fx) => {
        fx.filter("saturate(.7) contrast(1.2) blur(.5px)", 6000, { fade: 200 });
        if (!fx.reduced) {
          const frames = [];
          for (let i = 0; i < 20; i++) frames.push({ transform: "translate(" + (Math.random() * 14 - 7) + "px," + (Math.random() * 10 - 5) + "px) rotate(" + (Math.random() * 2 - 1) + "deg)" });
          fx.page(frames, { duration: 5000, fill: "none" });
        }
        fx.caption("(a Dogme 95 film: handheld, available light)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
        const glass = fx.put(A.S("0 0 30 50", '<path d="M6 4 H24 L20 26 C20 30 18 32 15 32 C12 32 10 30 10 26 Z" fill="rgba(220,235,245,.6)" ' + A.ink + ' stroke-width="1.5"/><path d="M15 32 V46 M8 46 H22" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.35, { size: 30, h: 50 });
        void glass;
        for (let i = 0; i < 3; i++) fx.tone(2800, 0.5, { type: "sine", vol: 0.1, at: i * 0.3 });
        fx.caption("I'd like to make a speech.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Pi
    {
      id: 473,
      y: 1998,
      run: async (fx) => {
        fx.filter("grayscale(1) contrast(2) brightness(1.1)", 6000, { fade: 150 });
        const digits = "3.14159265358979323846264338327950288419716939937510";
        const el = fx.put('<div style="font:700 16px/1 \'Special Elite\',\'Courier New\',monospace;color:#fff;background:#000;padding:6px;white-space:nowrap;overflow:hidden"></div>', W() / 2, H() * 0.3, { size: Math.min(W() - 20, 360), h: 28 });
        const beat = 0.11;
        for (let i = 0; i < 40; i++) {
          el.firstChild.textContent = digits.slice(0, i + 2).slice(-26);
          fx.thud({ freq: 60, vol: i % 4 === 0 ? 0.4 : 0.15, dur: 0.07 });
          if (i % 2) fx.noise(0.04, { type: "highpass", freq: 7000, vol: 0.15 });
          await fx.wait(beat * 1000);
        }
        fx.tone(3000, 1.2, { type: "sine", vol: 0.08, vibrato: [10, 200] });
        fx.flash("#fff", 400);
        fx.buzz([100, 50, 100]);
        fx.caption("216.", { style: "terminal", ms: 1400, css: { color: "#fff", textShadow: "0 0 6px #fff" } });
        await fx.wait(1400);
      }
    },

    // Dark City
    {
      id: 2666,
      y: 1998,
      run: async (fx) => {
        const night = fx.wash("rgba(10,15,30,.6)", 6400, { fade: 400 });
        void night;
        fx.caption("(midnight — everyone falls asleep)", { style: "whisper", ms: 1600, css: { color: "#cde" } });
        fx.freeze(4200);
        fx.tone(40, 5, { type: "sawtooth", vol: 0.08, filter: { freq: 200 }, attack: 0.5 });
        fx.noise(5, { freq: 300, vol: 0.2, attack: 0.5 });
        await fx.wait(1400);
        const slots = fx.$$("#grid .slot");
        for (let i = 0; i < slots.length; i++) {
          const up = (i * 37) % 5 - 2;
          fx.move(slots[i], [{ transform: "none" }, { transform: "translateY(" + up * 10 + "px) scaleY(" + (1 + up * 0.08) + ")" }], { duration: 1600, delay: i * 40, fill: "forwards", easing: "ease-in-out" });
        }
        fx.shake("sm", 2400);
        fx.buzz([300, 100, 300]);
        await fx.wait(2600);
        fx.caption("Tuning.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Ringu
    {
      id: 2671,
      y: 1998,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const tv = fx.put(A.S("0 0 120 100", '<rect x="4" y="4" width="112" height="84" rx="8" fill="#2b2622" ' + A.ink + '/><rect x="14" y="12" width="92" height="68" rx="6" fill="#111"/>'), W() / 2, H() * 0.42, { size: 170, h: 142 });
        void tv;
        const scr = fx.put("", W() / 2, H() * 0.42 - 6, { size: 130, h: 96, cls: "fx-static" });
        fx.noise(1.6, { type: "bandpass", freq: 3000, q: 0.5, vol: 0.14 });
        await fx.wait(1500);
        fx.remove(scr);
        const well = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle at 50% 50%, #ccc 0 30%, #111 32% 44%, #bbb 46% 60%, #222 62%);filter:grayscale(1) contrast(1.2)"></div>', W() / 2, H() * 0.42 - 6, { size: 130, h: 96 });
        fx.chord(["C4", "C#4", "G4"], 3, { type: "sine", vol: 0.05, attack: 1, vibrato: [0.5, 6] });
        await fx.wait(1600);
        const girl = fx.put(A.S("0 0 40 90", '<path d="M8 20 C8 0 32 0 32 20 L36 90 H4 Z" fill="#111"/><path d="M12 30 H28 L30 90 H10 Z" fill="#f4f2ec"/>'), W() / 2, H() * 0.42, { size: 26, h: 58 });
        fx.remove(well);
        for (let i = 0; i < 6; i++) {
          if (!fx.reduced) girl.style.transform = "translateY(" + i * 24 + "px) scale(" + (1 + i * 0.35) + ")";
          fx.noise(0.2, { type: "bandpass", freq: 1500, q: 2, vol: 0.2 });
          await fx.wait(fx.rand(200, 450));
        }
        fx.buzz([150, 60, 150]);
        fx.caption("7 days.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        void r;
      }
    },

    // Buffalo '66
    {
      id: 9464,
      y: 1998,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.7) contrast(1.1)", 6400, { fade: 300 });
        fx.wash("rgba(80,120,160,.2)", 6400, { fade: 300 });
        const alley = fx.put(A.S("0 0 200 40", '<rect x="0" y="4" width="200" height="30" fill="#c9a26a" ' + A.ink + ' stroke-width="2"/><path d="M0 18 H200" stroke="#a8844a" stroke-width="1"/>'), W() / 2, H() * 0.62, { size: Math.min(W() - 20, 320), h: 60 });
        void alley;
        const spot = fx.put('<div style="width:100%;height:100%;background:radial-gradient(circle, rgba(255,255,240,.8), transparent 65%)"></div>', W() / 2, H() * 0.55, { size: 180 });
        void spot;
        fx.seq([["C5", 2], ["E5", 1], ["G5", 1], ["A5", 3], ["G5", 1], ["E5", 4]], { type: "triangle", vol: 0.07, beat: 0.3 });
        fx.caption("(tap dancing, in the bowling alley)", { style: "whisper", ms: 2000 });
        for (let t = 0; t < 3; t += fx.rand(0.1, 0.25)) fx.click({ freq: 3000, vol: 0.35, at: t });
        await fx.wait(3000);
        fx.freeze(1600);
        fx.caption("(freeze-frame, 360°)", { style: "whisper", ms: 1400 });
        if (!fx.reduced) fx.page([{ transform: "perspective(900px) rotateY(0)" }, { transform: "perspective(900px) rotateY(20deg)" }, { transform: "perspective(900px) rotateY(-20deg)" }, { transform: "none" }], { duration: 1600 });
        await fx.wait(1700);
        void r;
      }
    },

    // Audition
    {
      id: 11075,
      y: 1999,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.6) brightness(.9)", 6400, { fade: 400 });
        const phone = fx.put(A.S("0 0 50 40", '<path d="M6 20 H44 L40 38 H10 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M4 14 C4 4 46 4 46 14 L40 18 C36 12 14 12 10 18 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/>'), W() * 0.75, H() * 0.7, { size: 50, h: 40 });
        fx.chord(["G4", "B4"], 5, { type: "sine", vol: 0.02, attack: 2 });
        fx.caption("(she's waiting for the phone to ring)", { style: "whisper", ms: 2200 });
        await fx.wait(2800);
        fx.tone(1400, 0.6, { type: "square", vol: 0.05, vibrato: [22, 100] });
        fx.move(phone, [{ transform: "none" }, { transform: "rotate(-10deg)" }, { transform: "rotate(10deg)" }, { transform: "none" }], { duration: 150, iterations: 4 });
        const sack = fx.put(A.S("0 0 50 60", '<path d="M8 20 C4 40 6 56 25 56 C44 56 46 40 42 20 Z" fill="#b8a888" ' + A.ink + ' stroke-width="2"/><path d="M10 20 H40 L36 10 H14 Z" fill="#8a7a62" ' + A.ink + ' stroke-width="2"/>'), r.x, r.top + r.height + 20, { size: 50, h: 60 });
        await fx.wait(700);
        fx.move(sack, [{ transform: "none" }, { transform: "translateY(-8px) rotate(4deg)" }, { transform: "none" }], 400);
        fx.noise(0.3, { freq: 400, vol: 0.4 });
        fx.buzz([80]);
        fx.caption("Kiri kiri kiri…", { style: "whisper", ms: 1800 });
        fx.tone(4200, 1.2, { type: "sine", vol: 0.04, vibrato: [12, 200] });
        await fx.wait(1800);
      }
    },

    // The Straight Story
    {
      id: 404,
      y: 1999,
      run: async (fx) => {
        fx.filter("saturate(1.1) sepia(.2)", 7000, { fade: 400 });
        fx.wash("linear-gradient(#bfe0ff 0 45%, rgba(220,190,90,.5) 45%)", 7000, { blend: "multiply", fade: 400, opacity: 0.5 });
        const mower = A.S("0 0 120 70", '<rect x="20" y="26" width="60" height="22" rx="4" fill="#3a8a3a" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="54" r="10" fill="#1d1a18"/><circle cx="74" cy="54" r="10" fill="#1d1a18"/><path d="M50 26 V10 H60" ' + A.ink + ' fill="none"/><circle cx="54" cy="8" r="5" fill="#f2d6b3"/><rect x="80" y="30" width="36" height="20" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><circle cx="90" cy="54" r="6" fill="#1d1a18"/><circle cx="110" cy="54" r="6" fill="#1d1a18"/>');
        const el = fx.put(mower, -60, H() * 0.72, { size: 120, h: 70 });
        fx.tone(70, 6.5, { type: "sawtooth", vol: 0.05, filter: { freq: 300 }, vibrato: [14, 3] });
        fx.seq([["G4", 2], ["B4", 1], ["D5", 1], ["E5", 4], ["D5", 2], ["B4", 2], ["G4", 4]], { type: "triangle", vol: 0.07, beat: 0.4 });
        await fx.move(el, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.35) + "px)" }], { duration: 6200, easing: "linear" });
        fx.caption("(5 mph, the whole way to Wisconsin)", { style: "whisper", ms: 1600 });
        await fx.wait(600);
      },
      maxMs: 12000
    },

    // Galaxy Quest
    {
      id: 926,
      y: 1999,
      run: async (fx) => {
        const space = fx.wash("radial-gradient(circle, rgba(20,20,60,.3), rgba(0,0,20,.8))", 6000, { fade: 400 });
        void space;
        fx.particles({ kind: "drift", count: 30, glyphs: dot("#fff"), min: 1, max: 3, dur: 3000 });
        const ship = A.S("0 0 140 60", '<ellipse cx="50" cy="26" rx="44" ry="12" fill="#cfd4d6" ' + A.ink + ' stroke-width="2"/><path d="M60 34 L90 40 H130 L136 30 L130 44 H90" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><text x="40" y="30" font-size="8" font-family="Georgia" fill="#1d1a18">NTE-3120</text>');
        fx.fly(ship, [-140, H() * 0.35], [W() + 140, H() * 0.3], { size: 150, h: 64, dur: 3000 });
        fx.seq([["C5", 2], ["G5", 2], ["C6", 4], ["B5", 1], ["A5", 1], ["G5", 2], ["C6", 4]], { type: "sawtooth", vol: 0.05, beat: 0.18, filter: { freq: 2400 } });
        await fx.wait(2200);
        fx.caption("Never give up!", { style: "card", ms: 1300 });
        await fx.wait(1300);
        fx.caption("Never surrender!", { style: "card", ms: 1300 });
        fx.chord(["C4", "G4", "C5", "E5"], 1.2, { type: "sawtooth", vol: 0.05, filter: { freq: 2000 } });
        await fx.wait(1500);
        fx.caption("(by Grabthar's hammer…)", { style: "whisper", ms: 1400 });
        await fx.wait(1300);
      }
    },

    // Ghost Dog: The Way of the Samurai
    {
      id: 4816,
      y: 1999,
      run: async (fx) => {
        fx.wash("rgba(20,20,30,.4)", 6600, { fade: 400 });
        const roof = fx.put(A.S("0 0 160 60", '<path d="M0 60 V30 H160 V60 Z" fill="#2b2622"/><rect x="20" y="4" width="50" height="26" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M20 14 H70 M20 22 H70 M34 4 V30 M50 4 V30" stroke="#1d1a18" stroke-width="1"/>'), W() * 0.72, H() * 0.3, { size: 160, h: 60 });
        void roof;
        const pigeon = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#8a8a90" stroke="#555" stroke-width=".8"/>');
        const beat = 0.3;
        for (let i = 0; i < 16; i++) { fx.thud({ freq: 60, vol: i % 4 === 0 ? 0.35 : 0.12, dur: 0.12, at: i * beat }); if (i % 4 === 2) fx.noise(0.12, { type: "bandpass", freq: 1800, q: 1, vol: 0.2, at: i * beat }); }
        fx.seq([["C4", 2], ["Eb4", 2], ["G4", 4], ["F4", 2], ["Eb4", 2], ["C4", 4]], { type: "sine", vol: 0.06, beat, filter: { freq: 900 } });
        for (let i = 0; i < 3; i++) fx.later(i * 900, () => fx.fly(pigeon, [W() * 0.72, H() * 0.28], [fx.rand(0, W()), -40], { size: 36, h: 22, dur: 1800 }));
        const r = fx.rect(fx.slot());
        const msg = fx.put(A.S("0 0 20 12", '<rect x="1" y="1" width="18" height="10" rx="2" fill="#f4efe2" stroke="#1d1a18"/>'), r.x, r.y, { size: 16, h: 10 });
        await fx.wait(2800);
        fx.move(msg, [{ transform: "none" }, { transform: "translateY(-" + r.y + "px)" }], 1200);
        fx.caption("One should make his decisions within the space of seven breaths.", { style: "subtitle", ms: 2400, css: { fontSize: "13px" } });
        await fx.wait(2400);
      }
    },

    // eXistenZ
    {
      id: 1946,
      y: 1999,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const pod = fx.put(A.S("0 0 80 60", '<path d="M10 30 C10 10 40 4 60 10 C76 16 76 44 60 50 C40 56 10 50 10 30 Z" fill="#c88a8a" ' + A.ink + ' stroke-width="2"/><path d="M20 24 C30 20 40 30 50 24 M20 36 C30 32 40 42 56 36" stroke="#a86a6a" stroke-width="2" fill="none"/><circle cx="36" cy="30" r="4" fill="#8a4a4a"/><path d="M60 40 C80 50 90 70 80 90" stroke="#a86a6a" stroke-width="5" fill="none"/>'),
          r.x, r.top + r.height + 20, { size: 80, h: 60 });
        fx.move(pod, [{ transform: "scale(1)" }, { transform: "scale(1.06, .96)" }, { transform: "scale(1)" }], { duration: 900, iterations: 3 });
        for (let i = 0; i < 3; i++) fx.tone(90, 0.8, { type: "sine", vol: 0.1, at: i * 0.9, slide: 70 });
        fx.noise(2.7, { type: "lowpass", freq: 300, vol: 0.15 });
        await fx.wait(2700);
        const rip = fx.filter("hue-rotate(40deg) saturate(1.4)", 2600, { fade: 300 });
        void rip;
        fx.caption("Are we still in the game?", { style: "subtitle", ms: 2400 });
        fx.tone(600, 0.6, { type: "sine", vol: 0.05, slide: 300, at: 0.6 });
        await fx.wait(2600);
      }
    }
  ]);
})();
