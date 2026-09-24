/* Machine FX cues - repertory house: Hollywood classics, westerns, musicals and '70s cinema.
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
  const bw = (fx, ms) => fx.filter("grayscale(1) contrast(1.12)", ms, { fade: 300 });
  const techni = (fx, ms) => fx.filter("saturate(1.5) contrast(1.05)", ms, { fade: 300 });
  const seventies = (fx, ms) => fx.filter("sepia(.3) saturate(1.1) contrast(1.05)", ms, { fade: 300 });
  const west = (fx, ms) => { fx.filter("sepia(.55) saturate(1.3)", ms, { fade: 300 }); fx.wash("linear-gradient(transparent 60%, rgba(160,110,50,.45))", ms, { fade: 400 }); };
  const shot = (fx, at) => { fx.noise(0.2, { freq: 2600, vol: 0.7, at: at || 0 }); fx.thud({ vol: 0.3, freq: 110, dur: 0.1, at: at || 0 }); };
  const wolfWhistle = (fx) => { fx.tone(900, 0.25, { type: "sine", vol: 0.08, slide: 2000 }); fx.tone(1400, 0.45, { type: "sine", vol: 0.08, slide: 700, at: 0.3 }); };
  const walker = (c) => A.S("0 0 30 60", '<circle cx="15" cy="8" r="6" fill="' + (c || "#1d1a18") + '"/><path d="M7 16 H23 L22 40 H8 Z" fill="' + (c || "#1d1a18") + '"/><path d="M9 40 L6 58 M21 40 L24 58" stroke="' + (c || "#1d1a18") + '" stroke-width="4"/>');
  const horse = A.S("0 0 80 60", '<path d="M10 30 C12 20 40 18 52 22 L58 8 L62 10 L62 22 L68 30 C70 36 66 40 60 38 L56 36 C52 42 46 42 42 40 L40 58 H36 L34 40 H20 L18 58 H14 L14 38 C8 38 6 34 10 30 Z" fill="#6b4a2a"/><circle cx="36" cy="14" r="5" fill="#1d1a18"/><path d="M30 20 H42 L40 30 H32 Z" fill="#1d1a18"/>');

  M.register([
    // The Godfather: Part II
    {
      id: 240,
      y: 1974,
      run: async (fx) => {
        fx.filter("sepia(.6) saturate(1.2) brightness(.85)", 7000, { fade: 400 });
        fx.wash("radial-gradient(circle, transparent 30%, rgba(20,10,0,.7))", 7000, { fade: 400 });
        const ship = A.S("0 0 160 70", '<path d="M8 50 H152 L138 68 H22 Z" fill="#3b3530"/><rect x="40" y="30" width="80" height="20" fill="#e8e0d0"/><rect x="70" y="10" width="14" height="20" fill="#3b3530"/>');
        const liberty = fx.put(A.S("0 0 40 100", '<path d="M16 100 V40 H24 V100 Z M12 40 C12 24 28 24 28 40 Z M26 26 L34 6" fill="#6a9a8a" stroke="#6a9a8a" stroke-width="3"/><path d="M32 6 L36 0 L38 8 Z" fill="#ffcf5a"/>'), W() * 0.85, H() * 0.5, { size: 40, h: 100 });
        void liberty;
        const waltz = [["G4", 3], ["C5", 1], ["Eb5", 2], ["D5", 3], ["C5", 1], ["Bb4", 2], ["C5", 6]];
        fx.seq(waltz, { type: "sawtooth", vol: 0.05, beat: 0.3, filter: { freq: 1200 }, vibrato: [5, 6] });
        fx.caption("(1901 — a boy arrives at Ellis Island)", { style: "whisper", ms: 2200 });
        await fx.fly(ship, [-160, H() * 0.66], [W() * 0.6, H() * 0.66], { size: 160, h: 70, dur: 4000, keep: true });
        fx.caption("Keep your friends close, but your enemies closer.", { style: "subtitle", ms: 2400 });
        await fx.wait(2400);
      }
    },

    // Chinatown
    {
      id: 829,
      y: 1974,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("rgba(220,170,90,.2)", 7000, { blend: "multiply", fade: 300 });
        fx.costume(".reely", '<path d="M56 60 H64 V66 H56 Z" fill="#fbfbf4" stroke="#1f1b16" stroke-width="1.5"/><path d="M54 58 L66 58 M54 68 L66 68" stroke="#fbfbf4" stroke-width="2"/>', 6600);
        fx.caption("(a bandage on his nose)", { style: "whisper", ms: 1600 });
        const trumpet = [["D5", 3], ["C5", 1], ["A4", 2], ["F4", 2], ["E4", 4], ["D4", 4]];
        fx.seq(trumpet, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { type: "bandpass", freq: 1400, q: 2 }, vibrato: [5, 6], attack: 0.1 });
        await fx.wait(2400);
        const water = fx.put(box("background:linear-gradient(transparent, rgba(80,140,200,.6))"), W() / 2, H() - 40, { size: W(), h: 80 });
        void water;
        fx.noise(2, { freq: 900, sweep: 300, vol: 0.2 });
        fx.caption("Forget it, Jake. It's Chinatown.", { style: "subtitle", ms: 2600 });
        await fx.wait(2600);
      }
    },

    // The French Connection
    {
      id: 1051,
      y: 1971,
      run: async (fx) => {
        seventies(fx, 6600);
        const el = fx.put(A.S("0 0 200 40", '<path d="M0 30 H200" stroke="#6d7478" stroke-width="6"/>' + Array.from({ length: 10 }, (_, i) => '<path d="M' + i * 20 + ' 30 V40" stroke="#6d7478" stroke-width="4"/>').join("") + '<rect x="20" y="4" width="160" height="22" rx="3" fill="#8a9aa8" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 6 }, (_, i) => '<rect x="' + (30 + i * 24) + '" y="8" width="14" height="10" fill="#cfe8ff"/>').join("")), W() / 2, H() * 0.25, { size: W(), h: 50 });
        fx.move(el, [{ transform: "translateX(-" + W() + "px)" }, { transform: "translateX(" + W() + "px)" }], { duration: 2400, easing: "linear" });
        for (let t = 0; t < 4; t += 0.1) fx.noise(0.06, { freq: 700, vol: 0.2, at: t });
        const car = A.car("#6b4a2a");
        await fx.fly(car, [-100, H() * 0.7], [W() + 100, H() * 0.7], { size: 100, h: 45, dur: 1400, easing: "linear" });
        fx.tone(700, 1, { type: "sawtooth", vol: 0.05, slide: 1200 });
        fx.caption("(car chasing a train under the tracks)", { style: "whisper", ms: 2000 });
        await fx.fly(car, [-100, H() * 0.72], [W() + 100, H() * 0.72], { size: 100, h: 45, dur: 1200, easing: "linear" });
        fx.caption("Did you ever pick your feet in Poughkeepsie?", { style: "subtitle", ms: 2200 });
        await fx.wait(2200);
      }
    },

    // Dog Day Afternoon
    {
      id: 968,
      y: 1975,
      run: async (fx) => {
        seventies(fx, 6600);
        fx.wash("rgba(255,210,120,.2)", 6600, { blend: "multiply", fade: 300 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        fx.caption("Attica! Attica!", { style: "hand", ms: 2200 });
        for (let i = 0; i < 6; i++) {
          fx.noise(0.5, { type: "bandpass", freq: 700, q: 0.5, vol: 0.3, at: i * 0.4 });
          fx.later(i * 400, () => all.forEach((s, k) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-" + (4 + (k % 3) * 2) + "px)" }, { transform: "none" }], { duration: 300, fill: "none" })));
        }
        await fx.wait(2600);
        const pizza = fx.fly(A.S("0 0 50 50", '<rect x="4" y="10" width="42" height="36" fill="#f4e8c8" ' + A.ink + ' stroke-width="1.5"/>'), [-40, H() * 0.8], [W() / 2, H() * 0.6], { size: 40, dur: 1000 });
        fx.caption("(the bank robbery becomes a street party)", { style: "whisper", ms: 2000 });
        await pizza;
        await fx.wait(1400);
      }
    },

    // The Sting
    {
      id: 9277,
      y: 1973,
      run: async (fx) => {
        fx.filter("sepia(.5) saturate(1.1)", 7000, { fade: 300 });
        const beat = 0.18;
        const rag = [["D5", 0.5], ["D#5", 0.5], ["E5", 1], ["C6", 1.5], ["E5", 0.5], ["C6", 1.5], ["E5", 0.5], ["C6", 4], ["C6", 0.5], ["D6", 0.5], ["D#6", 0.5], ["E6", 0.5], ["C6", 0.5], ["D6", 0.5], ["E6", 1], ["B5", 0.5], ["D6", 1], ["C6", 3]];
        fx.seq(rag, { type: "triangle", vol: 0.08, beat, attack: 0.002 });
        fx.seq([["C3", 1], ["G3", 1], ["C3", 1], ["G3", 1], ["C3", 1], ["G3", 1], ["F3", 1], ["C4", 1], ["G3", 1], ["D4", 1], ["C3", 2]], { type: "triangle", vol: 0.06, beat: beat * 2 });
        const cards = ["INTRODUCTION", "THE SET-UP", "THE HOOK", "THE TALE", "THE WIRE", "THE SHUT-OUT", "THE STING"];
        for (const c of cards) {
          const el = fx.put('<div style="width:100%;height:100%;background:#f4e8c8;border:3px double #6b4a2a;font:700 14px/40px Georgia,serif;color:#6b4a2a;text-align:center">' + c + "</div>", W() / 2, H() * 0.3, { size: 190, h: 44 });
          fx.later(720, () => fx.remove(el));
          await fx.wait(800);
        }
      }
    },

    // Bonnie and Clyde
    {
      id: 475,
      y: 1967,
      run: async (fx) => {
        seventies(fx, 6400);
        const banjo = [["G4", 0.5], ["B4", 0.5], ["D5", 0.5], ["G5", 0.5], ["D5", 0.5], ["B4", 0.5], ["A4", 0.5], ["B4", 0.5]];
        fx.seq(banjo.concat(banjo, banjo), { type: "triangle", vol: 0.07, beat: 0.16, attack: 0.002 });
        const car = A.S("0 0 120 50", '<path d="M6 36 C6 26 14 20 30 18 L40 6 H80 L92 18 C108 20 114 26 114 36 V40 H6 Z" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="42" r="8" fill="#1d1a18"/><circle cx="90" cy="42" r="8" fill="#1d1a18"/>');
        await fx.fly(car, [-120, H() * 0.7], [W() / 2, H() * 0.7], { size: 120, h: 50, dur: 2000, keep: true, easing: "ease-out" });
        fx.caption("We rob banks.", { style: "subtitle", ms: 1800 });
        await fx.wait(2000);
        for (let i = 0; i < 20; i++) shot(fx, i * 0.07);
        fx.later(200, () => fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.7), count: 16, spread: 60, glyphs: dot("#1d1a18"), min: 3, max: 6, dur: 700 }));
        fx.tempo(0.3, 1600);
        fx.shake("md", 1200);
        await fx.wait(1800);
      }
    },

    // Network
    {
      id: 10774,
      y: 1976,
      run: async (fx) => {
        seventies(fx, 6600);
        const tv = fx.put(A.S("0 0 120 100", '<rect x="4" y="4" width="112" height="84" rx="8" fill="#6b4a2a" ' + A.ink + '/><rect x="14" y="12" width="80" height="66" rx="8" fill="#9ab"/><circle cx="104" cy="30" r="5" fill="#c9a24a"/>'), W() / 2, H() * 0.35, { size: 140, h: 117 });
        void tv;
        fx.caption("I'm as mad as hell…", { style: "subtitle", ms: 1800 });
        fx.tone(180, 1.6, { type: "sawtooth", vol: 0.06, filter: { type: "bandpass", freq: 700, q: 3 } });
        await fx.wait(2000);
        fx.caption("…and I'm not going to take this anymore!", { style: "hand", ms: 2200 });
        const windows = fx.otherSlots(true);
        for (let i = 0; i < Math.min(10, windows.length); i++) {
          const w = windows[i];
          fx.later(i * 120, () => { fx.move(w, [{ transform: "none" }, { transform: "rotateY(60deg)" }, { transform: "none" }], { duration: 600, fill: "none" }); fx.tone(fx.rand(180, 300), 0.4, { type: "sawtooth", vol: 0.03, filter: { freq: 900 } }); });
        }
        fx.caption("(everyone yells out their windows)", { style: "whisper", ms: 2000, css: { bottom: "16vh" } });
        await fx.wait(2600);
      }
    },

    // All the President's Men
    {
      id: 891,
      y: 1976,
      run: async (fx) => {
        seventies(fx, 6600);
        const typer = fx.put('<div style="font:15px/1.3 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:10px;border:1px solid #bbb;white-space:pre"></div>', W() / 2, H() * 0.35, { size: 240, h: 60 });
        const line = "WATERGATE — FOLLOW THE MONEY.";
        for (let i = 0; i <= line.length; i++) {
          typer.firstChild.textContent = line.slice(0, i);
          fx.noise(0.04, { type: "bandpass", freq: 2000 + (i % 3) * 300, q: 4, vol: 0.3 });
          fx.thud({ freq: 300, vol: 0.08, dur: 0.03 });
          await fx.wait(i % 7 === 6 ? 180 : 70);
        }
        fx.tone(2400, 0.3, { type: "sine", vol: 0.08 });
        fx.caption("(the carriage bell)", { style: "whisper", ms: 1200 });
        await fx.wait(1400);
        fx.caption("(a garage, a cigarette, Deep Throat)", { style: "whisper", ms: 2000 });
        fx.wash("rgba(0,0,0,.6)", 2000, { fade: 400 });
        fx.put(dot("#ff7a1a"), W() * 0.3, H() * 0.6, { size: 4, ms: 2000, style: { boxShadow: "0 0 8px #ff7a1a" } });
        await fx.wait(2000);
      }
    },

    // Midnight Cowboy
    {
      id: 3116,
      y: 1969,
      run: async (fx) => {
        seventies(fx, 6600);
        const harmonica = [["G4", 2], ["E4", 1], ["G4", 1], ["A4", 2], ["G4", 2], ["E4", 2], ["D4", 4]];
        fx.seq(harmonica, { type: "sawtooth", vol: 0.05, beat: 0.35, filter: { type: "bandpass", freq: 1600, q: 3 }, vibrato: [6, 8] });
        fx.costume(".reely", '<path d="M26 30 C20 18 100 18 94 30 C80 26 40 26 26 30 Z M40 26 C40 10 80 10 80 26" fill="#e8d8b0" stroke="#1f1b16" stroke-width="2"/>', 6600);
        await fx.wait(2400);
        const cab = A.car("#f2d33b");
        fx.caption("I'm walkin' here! I'm walkin' here!", { style: "hand", ms: 2000 });
        fx.tone(600, 0.4, { type: "square", vol: 0.08 });
        fx.tone(600, 0.4, { type: "square", vol: 0.08, at: 0.5 });
        fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "none" }], 700);
        await fx.fly(cab, [W() + 100, H() - 60], [-100, H() - 60], { size: 100, h: 45, dur: 1200, flip: true });
        await fx.wait(1400);
      }
    },

    // Easy Rider
    {
      id: 624,
      y: 1969,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("linear-gradient(#ffc870, #e8804a)", 7000, { blend: "multiply", opacity: 0.35, fade: 400 });
        const chopper = A.S("0 0 140 70", '<circle cx="24" cy="52" r="16" fill="none" stroke="#1d1a18" stroke-width="4"/><circle cx="116" cy="52" r="16" fill="none" stroke="#1d1a18" stroke-width="4"/><path d="M24 52 L60 40 H84 L116 52 M84 40 L100 8 M92 8 H108" stroke="#9aa2a6" stroke-width="4" fill="none"/><path d="M50 32 H80 L76 42 H54 Z" fill="#d51f2a"/><path d="M52 34 L50 38 M58 32 V40 M66 32 V40" stroke="#fff" stroke-width="1.5"/><circle cx="68" cy="22" r="6" fill="#e8c8a0"/>');
        const beat = 0.2;
        const riff = [["E3", 1], ["E3", 1], ["G3", 1], ["E3", 1], ["A3", 2], ["G3", 1], ["E3", 1], ["D3", 2], ["E3", 2]];
        fx.seq(riff.concat(riff), { type: "sawtooth", vol: 0.07, beat, filter: { freq: 1400, q: 3 } });
        fx.caption("(born to be wild)", { style: "whisper", ms: 1800 });
        fx.tone(70, 5, { type: "sawtooth", vol: 0.05, filter: { freq: 250 }, vibrato: [25, 6] });
        await fx.fly(chopper, [-150, H() * 0.7], [W() + 150, H() * 0.7], { size: 150, h: 75, dur: 4800, easing: "linear" });
      }
    },

    // Cool Hand Luke
    {
      id: 903,
      y: 1967,
      run: async (fx) => {
        seventies(fx, 6600);
        const r = fx.rect(fx.slot());
        const eggs = [];
        const counter = fx.put('<div style="font:700 22px/1 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:4px 10px;border:2px solid #1d1a18">0</div>', W() / 2, H() * 0.28, { size: 70, h: 34 });
        fx.caption("(fifty eggs in one hour)", { style: "whisper", ms: 1800 });
        for (let i = 1; i <= 50; i += 7) {
          counter.firstChild.textContent = i;
          const e = fx.put(A.S("0 0 20 26", '<ellipse cx="10" cy="14" rx="8" ry="11" fill="#fbfbf4" stroke="#aaa"/>'), r.x + fx.rand(-40, 40), r.top + r.height + 20, { size: 14, h: 18 });
          eggs.push(e);
          fx.click({ freq: 3000, vol: 0.3 });
          await fx.wait(260);
        }
        counter.firstChild.textContent = "50";
        fx.chord(["C5", "E5", "G5"], 1, { type: "triangle", vol: 0.06 });
        await fx.wait(800);
        fx.caption("What we've got here is failure to communicate.", { style: "subtitle", ms: 2400 });
        await fx.wait(2400);
      }
    },

    // To Kill a Mockingbird
    {
      id: 595,
      y: 1962,
      run: async (fx) => {
        bw(fx, 7000);
        const tree = fx.put(A.S("0 0 100 140", '<path d="M50 140 V60 M50 90 L20 60 M50 80 L84 50" stroke="#3b3530" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="50" cy="44" r="40" fill="#6d6860"/><ellipse class="hole" cx="50" cy="96" rx="6" ry="8" fill="#1d1a18"/>'), W() * 0.75, H() * 0.55, { size: 100, h: 140 });
        const r = fx.rect(tree);
        const gifts = [A.S("0 0 20 20", '<circle cx="10" cy="10" r="7" fill="#c9a24a"/>'), A.S("0 0 20 20", '<rect x="3" y="6" width="14" height="8" fill="#f2c0a0"/>'), A.S("0 0 20 20", '<path d="M4 16 L10 4 L16 16 Z" fill="#9aa2a6"/>')];
        const box1 = fx.put('<div style="width:100%;height:100%;background:#e8e0d0;border:2px solid #1d1a18"></div>', W() / 2, H() * 0.3, { size: 1, h: 1 });
        void box1;
        const piano = [["D5", 2], ["F5", 1], ["A5", 1], ["G5", 2], ["F5", 2], ["E5", 2], ["D5", 4]];
        fx.seq(piano, { type: "triangle", vol: 0.07, beat: 0.35, attack: 0.002 });
        fx.caption("(small gifts, left in the knothole)", { style: "whisper", ms: 2200 });
        for (let i = 0; i < 3; i++) {
          fx.put(gifts[i], r.x, r.y + 26, { size: 14, ms: 900 });
          fx.tone(1600 + i * 200, 0.3, { type: "sine", vol: 0.05 });
          await fx.wait(900);
        }
        fx.caption("Hey, Boo.", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // 12 Angry Men
    {
      id: 389,
      y: 1957,
      run: async (fx) => {
        bw(fx, 7000);
        fx.wash("rgba(255,255,255,.1)", 7000, {});
        const all = [fx.slot()].concat(fx.otherSlots(true)).slice(0, 12);
        const votes = all.map((s) => { const r = fx.rect(s); return fx.put('<div style="font:900 13px/1 Georgia,serif;color:#fff;background:#b3122a;padding:3px 5px;border-radius:3px">GUILTY</div>', r.x, r.y, { size: 60, h: 18 }); });
        fx.caption("(eleven guilty, one not guilty)", { style: "whisper", ms: 2000 });
        votes[0].firstChild.textContent = "NOT GUILTY";
        votes[0].firstChild.style.background = "#3a6ad8";
        fx.noise(5, { freq: 1200, vol: 0.04 });
        await fx.wait(1800);
        for (let i = 1; i < votes.length; i++) {
          votes[i].firstChild.textContent = "NOT GUILTY";
          votes[i].firstChild.style.background = "#3a6ad8";
          fx.click({ freq: 1600, vol: 0.2 });
          await fx.wait(300);
        }
        fx.caption("(the fan finally works)", { style: "whisper", ms: 1400 });
        fx.noise(1.6, { type: "bandpass", freq: 800, q: 1, vol: 0.1 });
        await fx.wait(1600);
      }
    },

    // On the Waterfront
    {
      id: 654,
      y: 1954,
      run: async (fx) => {
        bw(fx, 7000);
        fx.wash("linear-gradient(transparent 60%, rgba(40,50,60,.6))", 7000, { fade: 400 });
        fx.caption("(the back seat of a taxi)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const lines = ["I coulda had class.", "I coulda been a contender.", "I coulda been somebody…"];
        for (const l of lines) {
          fx.caption(l, { style: "subtitle", ms: 1500 });
          await fx.wait(1500);
        }
        fx.caption("(the pigeons on the roof)", { style: "whisper", ms: 1600 });
        const pigeon = A.S("0 0 40 24", '<path d="M20 14 C14 4 6 2 0 6 C8 8 12 12 16 16 L2 20 C10 22 18 20 20 18 C22 20 30 22 38 20 L24 16 C28 12 32 8 40 6 C34 2 26 4 20 14 Z" fill="#8a8a90"/>');
        for (let i = 0; i < 6; i++) fx.later(i * 120, () => fx.fly(pigeon, [W() / 2, H() * 0.5], [fx.rand(0, W()), -30], { size: 36, h: 22, dur: 1600 }));
        fx.noise(1.2, { type: "bandpass", freq: 1500, q: 1, vol: 0.2 });
        await fx.wait(1800);
      }
    },

    // Rebel Without a Cause
    {
      id: 221,
      y: 1955,
      run: async (fx) => {
        techni(fx, 6600);
        fx.costume(".reely", '<path d="M20 70 H100 L106 150 H14 Z" fill="#d51f2a" stroke="#1f1b16" stroke-width="3"/><path d="M60 70 V150" stroke="#8a1a1a" stroke-width="2"/>', 6600);
        fx.caption("(the red jacket)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
        const cars = [A.car("#1d1a18"), A.car("#6d7478")];
        fx.caption("(the chickie run — to the cliff edge)", { style: "whisper", ms: 2000 });
        fx.tone(90, 2.4, { type: "sawtooth", vol: 0.06, slide: 180, filter: { freq: 500 } });
        await Promise.all([
          fx.fly(cars[0], [-100, H() * 0.66], [W() * 0.8, H() * 0.66], { size: 90, h: 40, dur: 2400, easing: "ease-in" }),
          fx.fly(cars[1], [-100, H() * 0.78], [W() * 0.7, H() * 0.78], { size: 90, h: 40, dur: 2200, easing: "ease-in" })
        ]);
        fx.caption("You're tearing me apart!", { style: "subtitle", ms: 1800 });
        fx.thud({ vol: 0.5, freq: 50, at: 0.3 });
        await fx.wait(1800);
      }
    },

    // The Ten Commandments
    {
      id: 6844,
      y: 1956,
      run: async (fx) => {
        techni(fx, 7000);
        const grid = fx.$("#grid");
        const rg = fx.rect(grid);
        const tablet = fx.put(A.S("0 0 100 120", '<path d="M4 30 C4 4 46 4 46 30 V116 H4 Z M54 30 C54 4 96 4 96 30 V116 H54 Z" fill="#b8b0a0" ' + A.ink + ' stroke-width="2"/>' + ["I", "II", "III", "IV", "V"].map((n, i) => '<text x="25" y="' + (40 + i * 16) + '" font-size="10" text-anchor="middle" font-family="Georgia" fill="#3b3530">' + n + "</text>").join("") + ["VI", "VII", "VIII", "IX", "X"].map((n, i) => '<text x="75" y="' + (40 + i * 16) + '" font-size="10" text-anchor="middle" font-family="Georgia" fill="#3b3530">' + n + "</text>").join("")), W() / 2, -80, { size: 110, h: 132 });
        fx.chord(["C3", "G3", "C4", "E4"], 3, { type: "sawtooth", vol: 0.05, attack: 1, filter: { freq: 1400 } });
        await fx.move(tablet, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.3 + 80) + "px)" }], { duration: 1600, easing: "ease-out" });
        fx.flash("#fff6c0", 300);
        fx.thud({ vol: 0.8, freq: 40, dur: 1 });
        await fx.wait(800);
        const left = fx.put(box("background:linear-gradient(90deg, rgba(20,80,160,.8), rgba(60,150,220,.8))"), rg.x - rg.width / 4, rg.y, { size: rg.width / 2, h: rg.height });
        const right = fx.put(box("background:linear-gradient(-90deg, rgba(20,80,160,.8), rgba(60,150,220,.8))"), rg.x + rg.width / 4, rg.y, { size: rg.width / 2, h: rg.height });
        fx.noise(2.4, { freq: 400, sweep: 2000, vol: 0.4, attack: 0.3 });
        fx.move(left, [{ transform: "none" }, { transform: "translateX(-" + rg.width * 0.45 + "px)" }], { duration: 2000, fill: "forwards", easing: "ease-in-out" });
        fx.move(right, [{ transform: "none" }, { transform: "translateX(" + rg.width * 0.45 + "px)" }], { duration: 2000, fill: "forwards", easing: "ease-in-out" });
        fx.caption("So let it be written. So let it be done.", { style: "subtitle", ms: 2400 });
        await fx.wait(2600);
      }
    },

    // Doctor Zhivago
    {
      id: 907,
      y: 1965,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("rgba(220,235,250,.4)", 7000, { fade: 500 });
        fx.particles({ kind: "fall", count: 50, glyphs: A.snowflake, min: 5, max: 10, dur: 4200, stagger: 5000 });
        const balal = [["A4", 2], ["B4", 1], ["C#5", 1], ["E5", 3], ["D5", 1], ["C#5", 2], ["B4", 2], ["A4", 4]];
        balal.reduce((t, [n, l]) => { for (let k = 0; k < l * 3; k++) fx.tone(n, 0.08, { type: "triangle", vol: 0.06, at: t + k * 0.1 }); return t + l * 0.3; }, 0);
        fx.caption("(Lara's theme, on the balalaika)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
        const palace = fx.put(A.S("0 0 140 100", '<rect x="20" y="40" width="100" height="60" fill="rgba(240,248,255,.9)" stroke="#bcd8ec" stroke-width="2"/><path d="M30 40 C30 20 50 20 50 40 M60 40 C60 10 80 10 80 40 M90 40 C90 20 110 20 110 40" fill="rgba(240,248,255,.9)" stroke="#bcd8ec" stroke-width="2"/>'), W() / 2, H() * 0.55, { size: 170, h: 120 });
        fx.move(palace, [{ opacity: 0 }, { opacity: 1 }], 1000);
        fx.caption("(the ice palace at Varykino)", { style: "whisper", ms: 1800 });
        await fx.wait(2200);
      }
    },

    // All About Eve
    {
      id: 705,
      y: 1950,
      run: async (fx) => {
        bw(fx, 7000);
        fx.costume(".reely", '<path d="M96 60 L114 52" stroke="#fbfbf4" stroke-width="3"/><circle cx="116" cy="51" r="2" fill="#ff7a1a"/>', 6600);
        fx.caption("Fasten your seatbelts.", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
        fx.caption("It's going to be a bumpy night.", { style: "subtitle", ms: 2000 });
        fx.shake("sm", 1600);
        fx.buzz([40, 80, 40, 80, 40, 80, 40]);
        await fx.wait(2200);
        const r = fx.rect(fx.slot());
        const understudy = fx.slot() && fx.slot().querySelector("img");
        if (understudy) fx.put('<img src="' + understudy.src + '" style="width:100%;height:100%;object-fit:cover;opacity:.6;filter:grayscale(1)">', r.x + 30, r.y, { size: r.width, h: r.height, ms: 2000 });
        fx.caption("(the understudy is waiting in the wings)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // A Streetcar Named Desire
    {
      id: 702,
      y: 1951,
      run: async (fx) => {
        bw(fx, 6600);
        fx.wash("rgba(40,30,20,.35)", 6600, { fade: 300 });
        fx.caption("STELLAAAAA!", { style: "hand", ms: 2200, css: { fontSize: "32px" } });
        fx.tone(260, 2, { type: "sawtooth", vol: 0.12, slide: 180, filter: { freq: 1200 }, vibrato: [5, 10] });
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M26 70 H94 L100 150 H20 Z" fill="#fbfbf4" stroke="#1f1b16" stroke-width="3"/>', 3000);
        fx.move(reely, [{ transform: "none" }, { transform: "rotate(-8deg) scale(1.05)" }, { transform: "none" }], 2000);
        await fx.wait(2600);
        const car = fx.put(A.S("0 0 140 50", '<rect x="4" y="6" width="132" height="34" rx="6" fill="#3a6a4a" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 6 }, (_, i) => '<rect x="' + (12 + i * 20) + '" y="10" width="14" height="12" fill="#e8e0d0"/>').join("") + '<text x="70" y="36" font-size="8" text-anchor="middle" font-family="Georgia" fill="#fff">DESIRE</text>'), -140, H() * 0.7, { size: 140, h: 50 });
        for (let i = 0; i < 3; i++) fx.tone(1400, 0.2, { type: "sine", vol: 0.08, at: i * 0.3 });
        await fx.move(car, [{ transform: "none" }, { transform: "translateX(" + (W() + 280) + "px)" }], { duration: 2400, easing: "linear" });
        fx.caption("I have always depended on the kindness of strangers.", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
      }
    },

    // The African Queen
    {
      id: 488,
      y: 1951,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("linear-gradient(rgba(60,110,50,.3), rgba(100,80,40,.45))", 7000, { blend: "multiply", fade: 400 });
        const boat = fx.put(A.S("0 0 120 60", '<path d="M4 36 C20 52 100 52 116 36 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><rect x="40" y="12" width="12" height="24" fill="#3b3530"/><path d="M20 20 H100 V26 H20 Z" fill="#e8e0d0"/>'), W() / 2, H() * 0.66, { size: 120, h: 60 });
        fx.move(boat, [{ transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }], { duration: 800, iterations: 6, direction: "alternate" });
        for (let t = 0; t < 5; t += 0.5) fx.noise(0.2, { freq: 400, vol: 0.2, at: t });
        await fx.wait(1600);
        fx.caption("(the leeches)", { style: "whisper", ms: 1400 });
        const reely = fx.$(".reely");
        fx.costume(".reely", '<ellipse cx="44" cy="100" rx="4" ry="8" fill="#1d1a18"/><ellipse cx="74" cy="110" rx="4" ry="8" fill="#1d1a18"/><ellipse cx="60" cy="126" rx="4" ry="8" fill="#1d1a18"/>', 2400);
        fx.move(reely, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 300, iterations: 4 });
        fx.tone(500, 0.8, { type: "sawtooth", vol: 0.05, vibrato: [18, 50], filter: { freq: 1200 } });
        await fx.wait(2400);
        fx.caption("Nature, Mr. Allnut, is what we are put in this world to rise above.", { style: "subtitle", ms: 2400, css: { fontSize: "13px" } });
        await fx.wait(2200);
      }
    },

    // Mr. Smith Goes to Washington
    {
      id: 3083,
      y: 1939,
      run: async (fx) => {
        bw(fx, 7400);
        A.projector(fx, 7);
        const dome = fx.put(A.S("0 0 140 100", '<path d="M20 70 C20 20 120 20 120 70 Z" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><rect x="10" y="70" width="120" height="26" fill="#e8e4da" ' + A.ink + ' stroke-width="2"/><path d="M70 22 V4" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.22, { size: 140, h: 100 });
        void dome;
        const clock = fx.put('<div style="font:700 18px/1 \'Special Elite\',\'Courier New\',monospace;color:#1d1a18;background:#fbf8ee;padding:4px 8px;border:2px solid #1d1a18">HOUR 1</div>', W() * 0.8, H() * 0.4, { size: 90, h: 30 });
        fx.caption("(the filibuster)", { style: "whisper", ms: 1600 });
        for (let h = 1; h <= 23; h += 3) {
          clock.firstChild.textContent = "HOUR " + h;
          fx.click({ freq: 1400, vol: 0.3 });
          if (!fx.reduced) fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "rotate(" + h / 3 + "deg) translateY(" + h / 3 + "px)" }], { duration: 400, fill: "forwards" });
          await fx.wait(600);
        }
        fx.caption("Lost causes are the only ones worth fighting for.", { style: "subtitle", ms: 2200 });
        const letters = A.envelope;
        fx.particles({ kind: "fall", count: 30, glyphs: letters, min: 14, max: 24, dur: 2000, spin: 90 });
        await fx.wait(2400);
      }
    },

    // Miracle on 34th Street
    {
      id: 11881,
      y: 1947,
      run: async (fx) => {
        bw(fx, 7000);
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 5, max: 9, dur: 4000, stagger: 5000 });
        const bags = [];
        for (let i = 0; i < 8; i++) bags.push(fx.put(A.S("0 0 40 40", '<path d="M6 12 H34 L32 38 H8 Z" fill="#b8a888" ' + A.ink + ' stroke-width="1.5"/><text x="20" y="28" font-size="8" text-anchor="middle" font-family="Georgia" fill="#1d1a18">MAIL</text>'), -40, H() * 0.6, { size: 36 }));
        bags.forEach((b, i) => fx.move(b, [{ transform: "none" }, { transform: "translate(" + (W() / 2 + (i % 4 - 1.5) * 30) + "px," + -(Math.floor(i / 4) * 30) + "px)" }], { duration: 800, delay: i * 180, fill: "forwards" }));
        for (let i = 0; i < 8; i++) fx.thud({ freq: 150, vol: 0.2, dur: 0.1, at: 0.8 + i * 0.18 });
        fx.caption("(the Post Office delivers all of Santa's letters to the courtroom)", { style: "whisper", ms: 2400, css: { fontSize: "11px" } });
        await fx.wait(2600);
        const bells = [["G5", 1], ["G5", 1], ["G5", 2], ["G5", 1], ["G5", 1], ["G5", 2], ["G5", 1], ["Bb5", 1], ["Eb5", 1.5], ["F5", 0.5], ["G5", 4]];
        fx.seq(bells, { type: "sine", vol: 0.08, beat: 0.2 });
        fx.caption("(case dismissed)", { style: "whisper", ms: 1600 });
        await fx.wait(2400);
      }
    },

    // The Philadelphia Story
    {
      id: 981,
      y: 1940,
      run: async (fx) => {
        bw(fx, 6600);
        const glasses = [];
        for (let i = 0; i < 3; i++) glasses.push(fx.put(A.S("0 0 30 60", '<path d="M4 4 H26 L16 28 V52 M8 56 H24" fill="rgba(255,240,200,.5)" stroke="#1d1a18" stroke-width="1.5"/><circle cx="12" cy="12" r="2" fill="#fff"/>'), W() / 2 + (i - 1) * 40, H() * 0.5, { size: 26, h: 52 }));
        fx.caption("(champagne — before the wedding)", { style: "whisper", ms: 1800 });
        for (let i = 0; i < 3; i++) fx.tone(2400 + i * 200, 0.6, { type: "sine", vol: 0.06, at: i * 0.2 });
        fx.particles({ kind: "rise", area: pt(W() / 2, H() * 0.5, 120, 10), count: 20, glyphs: dot("rgba(255,255,255,.8)"), min: 2, max: 4, dur: 1200 });
        await fx.wait(2200);
        const pool = fx.put(box("background:linear-gradient(rgba(180,220,255,.5), rgba(100,160,220,.6));border:3px solid #9aa2a6;border-radius:6px"), W() / 2, H() * 0.8, { size: 180, h: 50 });
        void pool;
        fx.noise(0.6, { type: "lowpass", freq: 900, vol: 0.4 });
        fx.particles({ kind: "burst", from: pt(W() / 2, H() * 0.8), count: 16, spread: 40, gravity: 60, glyphs: A.drop("#bfe4ff"), min: 5, max: 9, dur: 900 });
        fx.caption("(a midnight swim)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
      }
    },

    // The Grapes of Wrath
    {
      id: 596,
      y: 1940,
      run: async (fx) => {
        bw(fx, 7000);
        fx.particles({ kind: "sweep", count: 60, glyphs: dot("rgba(160,150,130,.7)"), min: 2, max: 6, dur: 1400, stagger: 5000 });
        fx.noise(6, { type: "bandpass", freq: 600, sweep: 1200, q: 0.5, vol: 0.2, attack: 1 });
        const truck = A.S("0 0 140 80", '<rect x="4" y="30" width="80" height="30" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M84 60 V36 H108 L120 48 V60 Z" fill="#4a3a2a" ' + A.ink + ' stroke-width="2"/><path d="M10 30 L20 6 H40 L50 30 M50 30 L64 10 H78 L80 30" fill="#b8a888" ' + A.ink + ' stroke-width="1.5"/><circle cx="24" cy="64" r="9" fill="#1d1a18"/><circle cx="104" cy="64" r="9" fill="#1d1a18"/>');
        const harm = [["G4", 2], ["B4", 1], ["D5", 1], ["C5", 2], ["B4", 2], ["A4", 2], ["G4", 4]];
        fx.seq(harm, { type: "sawtooth", vol: 0.04, beat: 0.4, filter: { type: "bandpass", freq: 1400, q: 3 }, vibrato: [6, 8] });
        fx.caption("(the Joads drive west, everything they own on the truck)", { style: "whisper", ms: 2400 });
        await fx.fly(truck, [-140, H() * 0.7], [W() + 140, H() * 0.7], { size: 140, h: 80, dur: 5000, easing: "steps(30)" });
        fx.caption("Wherever there's a fight so hungry people can eat, I'll be there.", { style: "subtitle", ms: 1800, css: { fontSize: "13px" } });
        await fx.wait(1600);
      }
    },

    // The Adventures of Robin Hood (1938)
    {
      id: 10907,
      y: 1938,
      run: async (fx) => {
        techni(fx, 6600);
        fx.costume(".reely", '<path d="M30 30 L60 4 L90 30 Z" fill="#3a8a3a" stroke="#1f1b16" stroke-width="3"/><path d="M76 16 L96 0" stroke="#d51f2a" stroke-width="3"/>', 6600);
        fx.caption("Welcome to Sherwood, my lady.", { style: "subtitle", ms: 1800 });
        const fanfare = [["C5", 1], ["E5", 1], ["G5", 2], ["E5", 1], ["G5", 1], ["C6", 4]];
        fx.seq(fanfare, { type: "sawtooth", vol: 0.06, beat: 0.2, filter: { freq: 2400 } });
        await fx.wait(2000);
        const shadow = fx.put(A.S("0 0 160 120", '<path d="M20 110 L50 40 L60 44 L34 110 Z M50 40 C60 20 80 20 90 40 L130 60 L120 70 L90 56" fill="rgba(0,0,0,.6)"/>'), W() * 0.4, H() * 0.5, { size: 200, h: 150 });
        const shadow2 = fx.put(A.S("0 0 160 120", '<path d="M140 110 L110 40 L100 44 L126 110 Z M110 40 C100 20 80 20 70 40 L30 60 L40 70 L70 56" fill="rgba(0,0,0,.6)"/>'), W() * 0.6, H() * 0.5, { size: 200, h: 150 });
        for (let i = 0; i < 6; i++) {
          fx.noise(0.08, { type: "highpass", freq: 5000, vol: 0.5, at: i * 0.3 });
          fx.later(i * 300, () => { fx.move(shadow, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? 20 : -20) + "px)" }], { duration: 150, fill: "forwards" }); fx.move(shadow2, [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? -20 : 20) + "px)" }], { duration: 150, fill: "forwards" }); });
        }
        fx.caption("(the sword fight, in giant shadows on the wall)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Dracula (1931)
    {
      id: 138,
      y: 1931,
      run: async (fx) => {
        A.oldFilm(fx, 7000);
        A.projector(fx, 6.5);
        const eyes = fx.put(A.S("0 0 200 40", '<rect width="200" height="40" fill="#0b0907"/><rect x="0" y="12" width="200" height="16" fill="rgba(255,255,255,.12)"/><ellipse cx="70" cy="20" rx="16" ry="6" fill="#f4f2ec"/><ellipse cx="130" cy="20" rx="16" ry="6" fill="#f4f2ec"/><circle cx="70" cy="20" r="4" fill="#0b0907"/><circle cx="130" cy="20" r="4" fill="#0b0907"/>'), W() / 2, H() * 0.35, { size: Math.min(W() * 0.9, 320), h: 64 });
        fx.chord(["D3", "F3", "Ab3"], 3, { type: "sine", vol: 0.05, attack: 1 });
        fx.caption("I never drink… wine.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
        fx.remove(eyes);
        fx.caption("Listen to them. Children of the night.", { style: "subtitle", ms: 2200 });
        for (let i = 0; i < 3; i++) fx.tone(500 + i * 50, 1.2, { type: "sine", vol: 0.04, slide: 700, at: i * 0.5, vibrato: [5, 20] });
        for (let i = 0; i < 6; i++) fx.later(i * 150, () => fx.fly(A.bat, [W() + 30, fx.rand(0, H() * 0.5)], [-30, fx.rand(0, H() * 0.5)], { size: 40, h: 20, dur: 1600 }));
        await fx.wait(2600);
      }
    },

    // The Mummy (1932)
    {
      id: 15849,
      y: 1932,
      run: async (fx) => {
        A.oldFilm(fx, 7000);
        const r = fx.rect(fx.slot());
        const scroll = fx.put(A.S("0 0 100 50", '<rect x="10" y="8" width="80" height="34" fill="#e8d8b0" ' + A.ink + ' stroke-width="1.5"/><rect x="4" y="4" width="8" height="42" rx="3" fill="#c9a870"/><rect x="88" y="4" width="8" height="42" rx="3" fill="#c9a870"/><path d="M20 16 L26 20 M34 14 V26 M44 16 C48 12 52 20 48 24 M60 14 L66 26 M74 18 H82" stroke="#6b4a2a" stroke-width="2"/>'), W() / 2, H() * 0.34, { size: 130, h: 65 });
        void scroll;
        fx.caption("(someone reads the Scroll of Thoth aloud)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
        const hand = fx.put(A.S("0 0 40 30", '<path d="M4 24 C4 12 20 8 30 10 L36 6 M16 10 L14 2 M22 10 L22 2 M28 10 L30 2" stroke="#c8b890" stroke-width="4" fill="none" stroke-linecap="round"/>'), r.x, r.top + r.height, { size: 40, h: 30 });
        fx.move(hand, [{ transform: "none" }, { transform: "translateY(-8px)" }], { duration: 600, fill: "forwards" });
        fx.tone(90, 2, { type: "sawtooth", vol: 0.06, filter: { freq: 400 } });
        await fx.wait(1600);
        fx.caption("He went for a little walk.", { style: "subtitle", ms: 2000 });
        fx.put(A.S("0 0 20 20", '<path d="M2 18 C6 10 14 10 18 2" stroke="#c8b890" stroke-width="3" fill="none"/>'), r.x + 40, r.top + r.height, { size: 20, ms: 2000 });
        await fx.wait(2000);
      }
    },

    // The Wolf Man (1941)
    {
      id: 13666,
      y: 1941,
      run: async (fx) => {
        A.oldFilm(fx, 7000);
        fx.wash("rgba(200,200,200,.3)", 7000, { fade: 600 });
        const moon = fx.put(A.moon, W() * 0.8, H() * 0.15, { size: 80 });
        void moon;
        fx.caption("Even a man who is pure in heart…", { style: "subtitle", ms: 2000 });
        await fx.wait(2000);
        fx.caption("…may become a wolf when the wolfbane blooms.", { style: "subtitle", ms: 2200 });
        const cane = fx.put(A.S("0 0 20 100", '<path d="M10 20 V96" stroke="#1d1a18" stroke-width="4"/><circle cx="10" cy="12" r="9" fill="#c9c9c9" stroke="#1d1a18" stroke-width="1.5"/>'), W() * 0.2, H() * 0.6, { size: 20, h: 100 });
        void cane;
        await fx.wait(1600);
        const reely = fx.$(".reely");
        fx.costume(".reely", '<path d="M34 50 C28 40 30 30 36 32 M86 50 C92 40 90 30 84 32 M40 70 C50 80 70 80 80 70" stroke="#6b4a2a" stroke-width="6" fill="none"/>', 2400);
        fx.tone(300, 2, { type: "sawtooth", vol: 0.07, slide: 900, filter: { freq: 1500 }, vibrato: [6, 20] });
        fx.move(reely, [{ transform: "none" }, { transform: "scale(1.05)" }, { transform: "none" }], 800);
        await fx.wait(2400);
      }
    },

    // The Thing from Another World
    {
      id: 10785,
      y: 1951,
      run: async (fx) => {
        bw(fx, 7000);
        fx.wash("rgba(220,235,250,.35)", 7000, { fade: 400 });
        const circle = [];
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          circle.push(fx.put(walker("#1d1a18"), W() / 2 + Math.cos(a) * 90, H() * 0.55 + Math.sin(a) * 30, { size: 16, h: 32 }));
        }
        fx.caption("(they spread out on the ice to measure the shape)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        fx.caption("(it's round. It's a saucer.)", { style: "whisper", ms: 2000 });
        fx.put(A.saucer, W() / 2, H() * 0.55, { size: 180, h: 60, ms: 2400, style: { opacity: 0.4 } });
        fx.tone(220, 2, { type: "sine", vol: 0.08, vibrato: [6, 30] });
        await fx.wait(2200);
        fx.caption("Keep watching the skies!", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // The War of the Worlds (1953)
    {
      id: 8974,
      y: 1953,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("rgba(80,20,60,.3)", 7000, { fade: 400 });
        const ship = fx.put(A.S("0 0 120 80", '<path d="M10 50 C10 30 110 30 110 50 L100 60 H20 Z" fill="#2a8a5a" ' + A.ink + ' stroke-width="2"/><path d="M60 30 C54 20 54 10 60 4 C66 10 66 20 60 30" fill="#2a8a5a" ' + A.ink + ' stroke-width="1.5"/><circle cx="60" cy="4" r="4" fill="#ff5050"/>'), W() / 2, -60, { size: 150, h: 100 });
        fx.tone(220, 5, { type: "sine", vol: 0.08, vibrato: [18, 40] });
        await fx.move(ship, [{ transform: "none" }, { transform: "translateY(" + (H() * 0.3 + 60) + "px)" }], { duration: 1800, easing: "ease-out" });
        for (let i = 0; i < 3; i++) {
          const o = fx.pick(fx.otherSlots(true));
          if (!o) continue;
          const or_ = fx.rect(o);
          fx.put(box("background:linear-gradient(90deg, rgba(255,80,80,.9), rgba(255,200,120,.2));height:4px"), (W() / 2 + or_.x) / 2, (H() * 0.3 + or_.y) / 2, { size: Math.hypot(W() / 2 - or_.x, H() * 0.3 - or_.y), h: 4, ms: 400, style: { transform: "rotate(" + Math.atan2(or_.y - H() * 0.3, or_.x - W() / 2) * 180 / Math.PI + "deg)" } });
          fx.noise(0.3, { type: "bandpass", freq: 2500, q: 3, vol: 0.4 });
          fx.later(200, () => fx.style(o, { filter: "brightness(.1)" }, 3000));
          await fx.wait(600);
        }
        fx.caption("(and then… the smallest things defeat them)", { style: "whisper", ms: 2000 });
        await fx.move(ship, [{ transform: "translateY(" + (H() * 0.3 + 60) + "px)" }, { transform: "translateY(" + (H() * 0.3 + 90) + "px) rotate(20deg)", opacity: 0.4 }], 1600);
      }
    },

    // 20,000 Leagues Under the Sea
    {
      id: 173,
      y: 1954,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("linear-gradient(rgba(20,90,110,.4), rgba(5,30,50,.7))", 7000, { fade: 500 });
        fx.particles({ kind: "rise", count: 20, glyphs: A.bubble, min: 5, max: 12, dur: 3200, stagger: 5000 });
        const nautilus = fx.put(A.S("0 0 180 60", '<path d="M10 30 C30 10 150 10 170 30 C150 50 30 50 10 30 Z" fill="#4a5a64" ' + A.ink + ' stroke-width="2"/><path d="M20 30 L4 20 M20 30 L4 40" stroke="#4a5a64" stroke-width="4"/><circle cx="130" cy="30" r="8" fill="#ffcf5a" stroke="#1d1a18" stroke-width="2"/>' + Array.from({ length: 8 }, (_, i) => '<path d="M' + (30 + i * 12) + ' 14 L' + (34 + i * 12) + ' 6" stroke="#4a5a64" stroke-width="3"/>').join("")), -180, H() * 0.4, { size: 180, h: 60 });
        const organ = [["D3", "A3", "D4", "F4"], ["C#3", "G#3", "C#4", "E4"], ["D3", "A3", "D4", "F4"], ["A2", "E3", "A3", "C#4"]];
        organ.forEach((c, i) => fx.chord(c, 1.3, { type: "sawtooth", vol: 0.04, at: i * 1.1, filter: { freq: 1400 } }));
        await fx.move(nautilus, [{ transform: "none" }, { transform: "translateX(" + (W() * 0.6 + 180) + "px)" }], { duration: 3200, easing: "ease-in-out" });
        const tentacle = fx.put(A.S("0 0 60 200", '<path d="M30 200 C0 150 60 110 30 60 C10 30 40 10 50 20" stroke="#8a4a6a" stroke-width="16" fill="none" stroke-linecap="round"/>'), W() * 0.7, H() + 60, { size: 60, h: 200 });
        await fx.move(tentacle, [{ transform: "none" }, { transform: "translateY(-" + H() * 0.55 + "px) rotate(-10deg)" }], { duration: 1000, easing: "cubic-bezier(.2,.9,.3,1.2)" });
        fx.caption("(the giant squid)", { style: "whisper", ms: 1600 });
        fx.shake("md", 600);
        await fx.wait(1600);
      }
    },

    // The Time Machine (1960)
    {
      id: 2134,
      y: 1960,
      run: async (fx) => {
        techni(fx, 7000);
        const dial = fx.put('<div style="font:700 18px/1 \'Special Elite\',\'Courier New\',monospace;color:#c9a24a;background:#1d1a18;padding:6px 10px;border:3px solid #c9a24a;text-align:center">1899</div>', W() / 2, H() * 0.24, { size: 130, h: 34 });
        const d = dial.firstChild;
        const years = [1899, 1917, 1940, 1966, 3000, 50000, 802701];
        const mannequin = fx.put(A.S("0 0 40 90", '<circle cx="20" cy="12" r="9" fill="#f2d6b3"/><path d="M8 24 H32 L34 88 H6 Z" fill="#b3122a"/>'), W() * 0.8, H() * 0.55, { size: 36, h: 80 });
        const dresses = ["#b3122a", "#3a6ad8", "#d9a13a", "#3aa655", "#ff7ab0", "#e8e0d0", "#6d7478"];
        fx.tone(200, 5, { type: "sawtooth", vol: 0.04, slide: 1600, filter: { freq: 1600 } });
        fx.tempo(4, 4400);
        for (let i = 0; i < years.length; i++) {
          d.textContent = String(years[i]);
          const p = mannequin.querySelector("path");
          if (p) p.setAttribute("fill", dresses[i]);
          fx.flash(i % 2 ? "rgba(255,255,255,.3)" : "rgba(0,0,0,.3)", 120);
          fx.click({ freq: 2000 + i * 200, vol: 0.2 });
          await fx.wait(600);
        }
        fx.caption("(the shop-window dress changes with every decade)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // Fantastic Voyage
    {
      id: 2161,
      y: 1966,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const sub = fx.put(A.S("0 0 80 40", '<ellipse cx="40" cy="20" rx="34" ry="14" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><ellipse cx="50" cy="16" rx="12" ry="7" fill="#bfe8ff" ' + A.ink + ' stroke-width="1.5"/>'), r.x, r.y, { size: 80, h: 40 });
        fx.caption("(shrinking the submarine…)", { style: "whisper", ms: 1600 });
        fx.tone(900, 2, { type: "sine", vol: 0.06, slide: 3000 });
        await fx.move(sub, [{ transform: "scale(1)" }, { transform: "scale(.1)" }], { duration: 1600, fill: "forwards", easing: "ease-in" });
        fx.remove(sub);
        const blood = fx.wash("radial-gradient(circle, rgba(255,120,120,.2), rgba(160,20,40,.6))", 4200, { fade: 400 });
        void blood;
        fx.particles({ kind: "sweep", count: 30, glyphs: A.S("0 0 30 30", '<circle cx="15" cy="15" r="12" fill="#d51f2a" opacity=".7"/><circle cx="15" cy="15" r="5" fill="#8a0a14" opacity=".6"/>'), min: 16, max: 34, dur: 2200, stagger: 3000 });
        for (let t = 0; t < 4; t += 0.8) fx.thud({ freq: 60, vol: 0.5, dur: 0.3, at: t });
        fx.buzz([60, 740, 60, 740, 60, 740, 60]);
        fx.caption("(inside the bloodstream — mind the heartbeat)", { style: "whisper", ms: 2200 });
        await fx.wait(3600);
      }
    },

    // Barbarella
    {
      id: 8069,
      y: 1968,
      run: async (fx) => {
        const cols = ["rgba(255,80,200,.3)", "rgba(80,200,255,.3)", "rgba(255,220,80,.3)"];
        const w = fx.wash(cols[0], 6600, { blend: "multiply", fade: 300 });
        const fur = fx.put(box("background:repeating-radial-gradient(circle at 30% 30%, #e8c8a0 0 3px, #d8b890 3px 6px);border-radius:20px"), W() / 2, H() * 0.5, { size: W() * 0.9, h: H() * 0.5 });
        fur.style.opacity = 0.3;
        fx.caption("(a fur-lined spaceship)", { style: "whisper", ms: 1600 });
        const groove = [["A4", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 2]];
        fx.seq(groove.concat(groove), { type: "sine", vol: 0.07, beat: 0.25, vibrato: [5, 10] });
        for (let i = 1; i < 8; i++) { await fx.wait(500); w.style.background = cols[i % 3]; }
        fx.caption("(and the Excessive Machine)", { style: "whisper", ms: 1600 });
        const organ = fx.put(A.S("0 0 120 60", '<rect x="4" y="10" width="112" height="46" rx="6" fill="#6a3bff" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 10 }, (_, i) => '<rect x="' + (10 + i * 10) + '" y="30" width="7" height="20" fill="#fff"/>').join("")), W() / 2, H() * 0.75, { size: 140, h: 70 });
        for (let i = 0; i < 12; i++) fx.tone(fx.pick(["C5", "E5", "G5", "B5", "D6"]), 0.15, { type: "square", vol: 0.04, at: i * 0.1 });
        fx.move(organ, [{ transform: "none" }, { transform: "translate(2px,-2px)" }, { transform: "translate(-2px,2px)" }, { transform: "none" }], { duration: 200, iterations: 6 });
        await fx.wait(1800);
      }
    },

    // Logan's Run
    {
      id: 10803,
      y: 1976,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("linear-gradient(135deg, rgba(255,200,120,.2), rgba(120,220,255,.25))", 7000, { fade: 400 });
        const palm = fx.put('<div style="width:100%;height:100%;border-radius:50%;background:radial-gradient(#fff, #3aff8a 40%, #1a8a3a 70%);box-shadow:0 0 16px #3aff8a"></div>', W() / 2, H() * 0.4, { size: 40 });
        fx.caption("(the life-clock in your palm)", { style: "whisper", ms: 1800 });
        const cols = ["#3aff8a", "#ffd23b", "#ff7a1a", "#ff2020", "#1d1a18"];
        for (let i = 0; i < cols.length; i++) {
          palm.firstChild.style.background = "radial-gradient(#fff, " + cols[i] + " 40%, " + cols[i] + " 70%)";
          palm.firstChild.style.boxShadow = "0 0 16px " + cols[i];
          fx.tone(800 - i * 100, 0.4, { type: "sine", vol: 0.06 });
          await fx.wait(700);
        }
        fx.caption("(at thirty, it's Carousel)", { style: "whisper", ms: 1600 });
        const people = [];
        for (let i = 0; i < 6; i++) people.push(fx.put(walker("#f4f0e6"), W() / 2 + Math.cos(i) * 60, H() * 0.6, { size: 20, h: 40 }));
        people.forEach((p, i) => fx.move(p, [{ transform: "translateY(0) rotate(0)" }, { transform: "translateY(-" + H() * 0.4 + "px) rotate(" + (i % 2 ? 360 : -360) + "deg)", opacity: 0 }], { duration: 2400, delay: i * 150 }));
        fx.chord(["C4", "E4", "G#4"], 2.4, { type: "sine", vol: 0.05, attack: 0.5 });
        await fx.wait(2600);
      }
    },

    // Soylent Green
    {
      id: 12101,
      y: 1973,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("rgba(80,140,60,.3)", 7000, { blend: "multiply", fade: 400 });
        const wafers = [];
        for (let i = 0; i < 12; i++) wafers.push(fx.put(box("background:#3aa655;border:2px solid #1d6a2a;border-radius:3px"), W() * 0.1 + i * (W() * 0.8 / 12), H() * 0.72, { size: 22, h: 22 }));
        const belt = fx.move(wafers, [{ transform: "none" }, { transform: "translateX(" + W() * 0.15 + "px)" }], { duration: 3000, easing: "linear" });
        for (let t = 0; t < 3; t += 0.25) fx.click({ freq: 1200, vol: 0.15, at: t });
        fx.caption("(Tuesday is Soylent Green day)", { style: "whisper", ms: 2000 });
        await belt;
        fx.caption("Soylent Green is people!", { style: "hand", ms: 2400 });
        fx.chord(["C3", "F#3", "C4"], 2, { type: "sawtooth", vol: 0.08, filter: { freq: 1200 } });
        fx.shake("sm", 600);
        await fx.wait(2400);
      }
    },

    // Westworld (1973)
    {
      id: 2362,
      y: 1973,
      run: async (fx) => {
        west(fx, 7000);
        const r = fx.rect(fx.slot());
        const gun = fx.costume(".reely", '<circle cx="52.5" cy="55" r="6" fill="#bfe8ff"/><circle cx="67.5" cy="55" r="6" fill="#bfe8ff"/>', 6600);
        void gun;
        fx.caption("(the gunslinger's eyes)", { style: "whisper", ms: 1600 });
        await fx.wait(1800);
        const view = fx.node("", { cls: "fx-filter", style: { backdropFilter: "contrast(2) saturate(2) hue-rotate(180deg) blur(2px)", webkitBackdropFilter: "contrast(2) saturate(2) hue-rotate(180deg) blur(2px)" } });
        fx.node("", { cls: "fx-filter fx-scanlines", ms: 2400, style: { opacity: 0.6 } });
        for (let i = 0; i < 8; i++) fx.tone(fx.rand(200, 900), 0.08, { type: "square", vol: 0.04, at: i * 0.12 });
        fx.caption("(pixel vision — the first digital effects in a feature)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        fx.remove(view);
        shot(fx);
        fx.flash("#fff", 100);
        fx.caption("(nothing can possibly go wrong)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        void r;
      }
    },

    // Silent Running
    {
      id: 811,
      y: 1972,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("linear-gradient(#0a0a20, #1a2040)", 7000, { opacity: 0.6, fade: 400 });
        fx.particles({ kind: "drift", count: 40, glyphs: dot("#fff"), min: 1, max: 3, dur: 4000 });
        const dome = fx.put(A.S("0 0 120 80", '<path d="M10 70 C10 10 110 10 110 70 Z" fill="rgba(200,240,220,.3)" stroke="#bfe8ff" stroke-width="2"/><path d="M20 70 C30 50 40 60 50 40 C60 56 70 44 80 50 C90 40 100 60 100 70 Z" fill="#3a8a3a"/><rect x="4" y="70" width="112" height="8" fill="#6d7478"/>'), W() / 2, H() * 0.4, { size: 160, h: 107 });
        void dome;
        const drone = fx.put(A.S("0 0 40 40", '<rect x="6" y="6" width="28" height="22" rx="3" fill="#f4f0e6" ' + A.ink + ' stroke-width="1.5"/><path d="M10 28 V36 M30 28 V36" stroke="#1d1a18" stroke-width="3"/><circle cx="20" cy="16" r="4" fill="#3a6ad8"/>'), W() * 0.3, H() * 0.66, { size: 30 });
        const song = [["E5", 2], ["D5", 1], ["C5", 1], ["D5", 2], ["G4", 2], ["A4", 2], ["C5", 2], ["D5", 4]];
        fx.seq(song, { type: "sine", vol: 0.08, beat: 0.35 });
        fx.caption("(the last forest, tended by a little robot)", { style: "whisper", ms: 2400 });
        fx.move(drone, [{ transform: "none" }, { transform: "translateX(" + W() * 0.3 + "px)" }], { duration: 3000, easing: "steps(20)" });
        await fx.wait(3600);
      }
    },

    // THX 1138
    {
      id: 636,
      y: 1971,
      run: async (fx) => {
        const white = fx.wash("#f4f4f2", 7000, { fade: 400, opacity: 0.9 });
        void white;
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => fx.style(s, { filter: "grayscale(1) brightness(1.4) contrast(.6)" }, 6600));
        const pa = ["Work hard. Increase production. Prevent accidents. Be happy.", "You are a true believer.", "Buy more. Buy more now."];
        for (const l of pa) {
          fx.caption(l, { style: "terminal", ms: 1600, css: { color: "#1d1a18", textShadow: "none", fontSize: "13px" } });
          fx.tone(90, 1.4, { type: "sawtooth", vol: 0.04, filter: { type: "bandpass", freq: 600, q: 5 } });
          await fx.wait(1700);
        }
        const cop = fx.put(A.S("0 0 40 90", '<circle cx="20" cy="14" r="12" fill="#c9c9c9" stroke="#1d1a18" stroke-width="1.5"/><path d="M12 12 H28" stroke="#1d1a18" stroke-width="2"/><path d="M8 28 H32 L34 88 H6 Z" fill="#1d1a18"/>'), W() * 0.8, H() * 0.6, { size: 34, h: 76 });
        void cop;
        fx.caption("(the chrome-faced police)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Rosemary's Baby
    {
      id: 805,
      y: 1968,
      run: async (fx) => {
        seventies(fx, 7000);
        const lull = [["A4", 2], ["C5", 1], ["B4", 1], ["A4", 2], ["E4", 2], ["F4", 2], ["E4", 2], ["D4", 4]];
        fx.seq(lull, { type: "sine", vol: 0.07, beat: 0.35, vibrato: [4, 6] });
        fx.caption("La la la la…", { style: "whisper", ms: 2400 });
        await fx.wait(2400);
        const charm = fx.put(A.S("0 0 30 40", '<path d="M15 0 V10" stroke="#c9a24a" stroke-width="1.5"/><circle cx="15" cy="24" r="12" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><circle cx="15" cy="24" r="6" fill="#6b4a2a"/>'), W() / 2, H() * 0.36, { size: 30, h: 40 });
        fx.move(charm, [{ transform: "rotate(-15deg)" }, { transform: "rotate(15deg)" }], { duration: 700, iterations: 4, direction: "alternate" });
        fx.caption("(the tannis root charm)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
        const cradle = fx.put(A.S("0 0 80 50", '<path d="M4 20 C4 44 76 44 76 20 Z" fill="#1d1a18"/><path d="M10 20 C20 4 60 4 70 20" stroke="#1d1a18" stroke-width="4" fill="none"/><path d="M40 40 L36 50 M40 40 L44 50" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.66, { size: 80, h: 50 });
        void cradle;
        fx.caption("What have you done to its eyes?", { style: "subtitle", ms: 2000 });
        fx.chord(["C3", "C#3", "G3"], 1.4, { type: "sawtooth", vol: 0.06, filter: { freq: 900 } });
        await fx.wait(2000);
      }
    },

    // The Omen
    {
      id: 794,
      y: 1976,
      run: async (fx) => {
        seventies(fx, 7000);
        const chant = [["D4", 1], ["D4", 1], ["Eb4", 2], ["D4", 1], ["D4", 1], ["C4", 2], ["D4", 4]];
        fx.seq(chant, { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { type: "bandpass", freq: 800, q: 2 }, vibrato: [5, 8] });
        fx.seq(chant.map(([n, l]) => [n.replace(/\d/, (d) => d - 1), l]), { type: "sawtooth", vol: 0.04, beat: 0.25, filter: { freq: 500 } });
        fx.caption("(Ave Satani)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const r = fx.rect(fx.slot());
        fx.put('<div style="font:900 22px/1 Georgia,serif;color:#b3122a;text-shadow:0 0 6px #000">666</div>', r.x, r.y, { size: 60, h: 26, ms: 2400 });
        fx.caption("(the birthmark, hidden in the hair)", { style: "whisper", ms: 1800 });
        const dog = fx.put(A.S("0 0 70 50", '<path d="M8 30 C10 16 34 14 48 18 L56 6 L62 12 L60 22 C66 26 62 34 54 34 L52 46 M18 34 L16 46 M30 34 L30 46 M42 34 L42 46" fill="#1d1a18" stroke="#1d1a18" stroke-width="2"/><circle cx="56" cy="18" r="2" fill="#ff2020"/>'), W() * 0.8, H() * 0.7, { size: 60, h: 44 });
        fx.move(dog, [{ opacity: 0 }, { opacity: 1 }], 800);
        fx.tone(90, 1.2, { type: "sawtooth", vol: 0.06, filter: { freq: 500 } });
        await fx.wait(2400);
      }
    },

    // Dawn of the Dead (1978)
    {
      id: 923,
      y: 1978,
      run: async (fx) => {
        seventies(fx, 7000);
        const muzak = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["F5", 1], ["D5", 1], ["C5", 2]];
        fx.seq(muzak.concat(muzak), { type: "triangle", vol: 0.05, beat: 0.25 });
        fx.caption("(the shopping mall — still playing its music)", { style: "whisper", ms: 2200 });
        const shuffle = [];
        for (let i = 0; i < 7; i++) shuffle.push(fx.put(walker("#6a8a9a"), -30 - i * 40, H() * (0.6 + (i % 3) * 0.08), { size: 20, h: 40 }));
        shuffle.forEach((z, i) => fx.move(z, [{ transform: "none" }, { transform: "translateX(" + (W() + 200) + "px)" }], { duration: 6000 + i * 200, easing: "steps(40)" }));
        await fx.wait(3000);
        fx.caption("When there's no more room in hell, the dead will walk the earth.", { style: "subtitle", ms: 2600, css: { fontSize: "13px" } });
        const escalator = fx.put(A.S("0 0 120 60", '<path d="M4 56 L116 4" stroke="#6d7478" stroke-width="10"/>' + Array.from({ length: 10 }, (_, i) => '<path d="M' + (10 + i * 11) + ' ' + (54 - i * 5) + ' h8" stroke="#1d1a18" stroke-width="2"/>').join("")), W() * 0.75, H() * 0.4, { size: 120, h: 60 });
        void escalator;
        await fx.wait(2600);
      }
    },

    // Dial M for Murder
    {
      id: 521,
      y: 1954,
      run: async (fx) => {
        techni(fx, 7000);
        const dial = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="44" fill="#1d1a18"/>' + Array.from({ length: 10 }, (_, i) => { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; return '<circle cx="' + (50 + Math.cos(a) * 32) + '" cy="' + (50 + Math.sin(a) * 32) + '" r="7" fill="#f4f0e6"/><text x="' + (50 + Math.cos(a) * 32) + '" y="' + (53 + Math.sin(a) * 32) + '" font-size="8" text-anchor="middle" font-family="Georgia" fill="#1d1a18">' + ((i + 1) % 10) + "</text>"; }).join("") + '<circle cx="50" cy="50" r="12" fill="#c9a24a"/><text x="50" y="54" font-size="12" text-anchor="middle" font-family="Georgia" fill="#1d1a18">M</text>'),
          W() / 2, H() * 0.36, { size: 130 });
        for (let d = 0; d < 4; d++) {
          await fx.move(dial, [{ transform: "rotate(0)" }, { transform: "rotate(" + (60 + d * 30) + "deg)" }], { duration: 300, easing: "ease-in", fill: "forwards" });
          for (let k = 0; k < 4 + d; k++) fx.click({ freq: 1600, vol: 0.2, at: k * 0.06 });
          await fx.move(dial, [{ transform: "rotate(" + (60 + d * 30) + "deg)" }, { transform: "rotate(0)" }], { duration: 500, fill: "forwards" });
        }
        fx.caption("(it rings — at exactly the wrong moment)", { style: "whisper", ms: 2000 });
        fx.tone(1300, 1, { type: "square", vol: 0.04, vibrato: [22, 100] });
        const scissors = fx.put(A.S("0 0 60 40", '<circle cx="10" cy="10" r="7" fill="none" ' + A.ink + '/><circle cx="10" cy="30" r="7" fill="none" ' + A.ink + '/><path d="M16 14 L58 26 M16 26 L58 14" ' + A.ink + '/>'), W() * 0.3, H() * 0.66, { size: 50, h: 34 });
        void scissors;
        await fx.wait(2000);
      }
    },

    // To Catch a Thief
    {
      id: 381,
      y: 1955,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("linear-gradient(#8fd0ff, #3a8ad8)", 7000, { blend: "multiply", opacity: 0.3, fade: 400 });
        const cat = A.S("0 0 50 34", '<path d="M6 26 C8 14 28 12 38 16 L42 6 L46 10 L46 18 C50 22 46 28 40 28 L10 30 Z" fill="#1d1a18"/>');
        fx.caption("(the Cat, across the Riviera rooftops)", { style: "whisper", ms: 2000 });
        const roofs = [[0.1, 0.3], [0.3, 0.24], [0.5, 0.32], [0.7, 0.22], [0.9, 0.3]];
        for (let i = 0; i < roofs.length - 1; i++) {
          await fx.fly(cat, [W() * roofs[i][0], H() * roofs[i][1]], [W() * roofs[i + 1][0], H() * roofs[i + 1][1]], { size: 40, h: 28, dur: 500, via: [W() * (roofs[i][0] + roofs[i + 1][0]) / 2, H() * 0.12] });
          fx.click({ freq: 3000, vol: 0.2 });
        }
        const r = fx.rect(fx.slot());
        fx.put(A.S("0 0 60 30", '<path d="M4 6 C20 26 40 26 56 6" stroke="#fff" stroke-width="4" stroke-dasharray="1 5" stroke-linecap="round" fill="none"/>'), r.x, r.y, { size: 60, h: 30, ms: 2400, style: { filter: "drop-shadow(0 0 4px #fff)" } });
        fx.caption("(the diamond necklace)", { style: "whisper", ms: 1600 });
        for (let i = 0; i < 12; i++) fx.later(1200 + i * 150, () => { fx.flash(i % 2 ? "rgba(255,80,160,.25)" : "rgba(80,200,255,.25)", 100); fx.thud({ vol: 0.2, freq: 200 }); });
        fx.caption("(fireworks — in the other sense)", { style: "whisper", ms: 1800, css: { bottom: "16vh" } });
        await fx.wait(3200);
      }
    },

    // The Magnificent Seven
    {
      id: 966,
      y: 1960,
      run: async (fx) => {
        west(fx, 7000);
        const gallop = [["C5", 1], ["C5", 0.5], ["C5", 0.5], ["G5", 2], ["F5", 1], ["E5", 1], ["D5", 1], ["C6", 3], ["G5", 1], ["F5", 1], ["E5", 1], ["F5", 1], ["D5", 3]];
        fx.seq(gallop, { type: "sawtooth", vol: 0.06, beat: 0.18, filter: { freq: 2200 } });
        for (let i = 0; i < 20; i++) fx.thud({ freq: 120, vol: 0.15, dur: 0.06, at: i * 0.18 });
        for (let i = 0; i < 7; i++) fx.later(i * 200, () => fx.fly(horse, [-80, H() * (0.55 + (i % 3) * 0.1)], [W() + 80, H() * (0.55 + (i % 3) * 0.1)], { size: 70, h: 52, dur: 2400, easing: "steps(16)" }));
        fx.caption("(seven)", { style: "whisper", ms: 1400 });
        await fx.wait(4000);
        fx.caption("(one of them catches a fly with his bare hand)", { style: "whisper", ms: 2000 });
        await fx.wait(2000);
      }
    },

    // Rio Bravo
    {
      id: 301,
      y: 1959,
      run: async (fx) => {
        west(fx, 7000);
        const r = fx.rect(fx.slot());
        const coin = A.coin("#c9c9c9");
        fx.caption("(a coin, dropped into a spittoon)", { style: "whisper", ms: 1800 });
        const spittoon = fx.put(A.S("0 0 40 40", '<path d="M6 10 H34 L30 36 H10 Z" fill="#c9a24a" ' + A.ink + ' stroke-width="2"/>'), r.x, r.top + r.height + 30, { size: 36 });
        void spittoon;
        await fx.fly(coin, [r.x + 60, r.y - 60], [r.x, r.top + r.height + 22], { size: 18, dur: 700, r2: 720 });
        fx.tone(2400, 0.4, { type: "sine", vol: 0.1 });
        await fx.wait(1000);
        const guitar = [["E4", "G#4", "B4"], ["A3", "C#4", "E4"], ["B3", "D#4", "F#4"], ["E4", "G#4", "B4"]];
        guitar.forEach((c, i) => c.forEach((n, k) => fx.tone(n, 1, { type: "triangle", vol: 0.06, at: i * 0.6 + k * 0.03, attack: 0.002 })));
        fx.caption("(the jailhouse sing-along)", { style: "whisper", ms: 2200 });
        await fx.wait(2600);
      }
    },

    // Stagecoach
    {
      id: 995,
      y: 1939,
      run: async (fx) => {
        bw(fx, 7000);
        A.projector(fx, 6.5);
        const coach = A.S("0 0 160 70", '<rect x="60" y="14" width="60" height="36" rx="4" fill="#3b3530" ' + A.ink + ' stroke-width="2"/><rect x="70" y="20" width="16" height="14" fill="#e8e0d0"/><rect x="94" y="20" width="16" height="14" fill="#e8e0d0"/><circle cx="72" cy="56" r="12" fill="none" stroke="#1d1a18" stroke-width="3"/><circle cx="110" cy="56" r="12" fill="none" stroke="#1d1a18" stroke-width="3"/><path d="M60 40 H30" stroke="#1d1a18" stroke-width="2"/><path d="M4 40 C6 30 20 28 26 30 L30 22 V40 M8 40 V56 M22 40 V56" fill="#3b3530" stroke="#3b3530" stroke-width="3"/>');
        const mesa = fx.put(A.S("0 0 300 80", '<path d="M0 80 V60 H40 L50 20 H90 L100 60 H180 L190 10 H230 L240 60 H300 V80 Z" fill="#8a857a"/>'), W() / 2, H() * 0.55, { size: W(), h: 80 });
        void mesa;
        for (let t = 0; t < 5; t += 0.2) fx.thud({ freq: 110, vol: 0.12, dur: 0.06, at: t });
        fx.caption("(Monument Valley)", { style: "whisper", ms: 1600 });
        await fx.fly(coach, [-160, H() * 0.7], [W() + 160, H() * 0.7], { size: 160, h: 70, dur: 4400, easing: "steps(28)" });
        for (let i = 0; i < 4; i++) fx.later(i * 200, () => { const a = fx.fly(A.S("0 0 60 8", '<path d="M0 4 H50" stroke="#6b4a2a" stroke-width="2"/><path d="M50 0 L60 4 L50 8 Z" fill="#9aa2a6"/>'), [W() + 30, H() * 0.5], [-40, H() * 0.7], { size: 50, h: 8, dur: 600 }); void a; });
        await fx.wait(1000);
      }
    },

    // A Fistful of Dollars
    {
      id: 391,
      y: 1964,
      run: async (fx) => {
        west(fx, 7000);
        fx.costume(".reely", '<path d="M20 90 L60 70 L100 90 L96 140 H24 Z" fill="#a0784a" stroke="#1f1b16" stroke-width="3"/><path d="M30 100 H90 M28 116 H92" stroke="#6b4a2a" stroke-width="3" stroke-dasharray="4 3"/>', 6600);
        fx.caption("(the poncho, the cigarillo)", { style: "whisper", ms: 1800 });
        const whistle = [["A5", 1], ["D6", 1], ["A5", 1], ["D6", 1], ["A5", 4]];
        fx.seq(whistle, { type: "sine", vol: 0.1, beat: 0.2, vibrato: [6, 10] });
        fx.tone(98, 1.5, { type: "sawtooth", vol: 0.05, at: 1.4, filter: { freq: 900 } });
        await fx.wait(2400);
        const plate = fx.put(A.S("0 0 50 70", '<path d="M6 4 H44 L40 66 H10 Z" fill="#6d7478" ' + A.ink + ' stroke-width="2"/>'), fx.rect(fx.$(".reely")).x, fx.rect(fx.$(".reely")).y + 30, { size: 30, h: 42 });
        void plate;
        for (let i = 0; i < 4; i++) { shot(fx, i * 0.4); fx.later(i * 400, () => fx.tone(3000, 0.2, { type: "sine", vol: 0.08 })); }
        fx.caption("(the bullets ping off the iron plate)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // True Grit (1969)
    {
      id: 17529,
      y: 1969,
      run: async (fx) => {
        west(fx, 7000);
        fx.costume(".reely", '<path d="M44 50 C50 44 58 44 60 50 V60 C56 62 48 62 44 58 Z" fill="#1d1a18"/><path d="M44 50 L30 44 M60 50 L80 44" stroke="#1d1a18" stroke-width="2"/>', 6600);
        fx.caption("Fill your hand, you son of a…!", { style: "subtitle", ms: 2200 });
        await fx.wait(2200);
        const rider = A.S("0 0 80 70", '<path d="M10 40 C12 30 40 28 52 32 L58 18 L62 20 L62 32 L68 40 C70 46 66 50 60 48 L56 46 C52 52 46 52 42 50 L40 68 H36 L34 50 H20 L18 68 H14 L14 48 C8 48 6 44 10 40 Z" fill="#6b4a2a"/><circle cx="36" cy="16" r="5" fill="#1d1a18"/><path d="M28 22 H44 L42 32 H30 Z" fill="#1d1a18"/><path d="M20 24 L8 20 M44 24 L60 22" stroke="#6d7478" stroke-width="3"/>');
        fx.caption("(reins in his teeth, a gun in each hand)", { style: "whisper", ms: 2000 });
        for (let t = 0; t < 2; t += 0.18) fx.thud({ freq: 120, vol: 0.15, dur: 0.06, at: t });
        for (let i = 0; i < 6; i++) shot(fx, 0.8 + i * 0.2);
        await fx.fly(rider, [-80, H() * 0.66], [W() + 80, H() * 0.66], { size: 80, h: 70, dur: 2400 });
        await fx.wait(600);
      }
    },

    // The Wild Bunch
    {
      id: 576,
      y: 1969,
      run: async (fx) => {
        west(fx, 6600);
        const bunch = [];
        for (let i = 0; i < 4; i++) bunch.push(fx.put(walker("#3b3530"), -30 - i * 34, H() * 0.66, { size: 26, h: 52 }));
        fx.move(bunch, [{ transform: "none" }, { transform: "translateX(" + W() * 0.5 + "px)" }], { duration: 3000, easing: "linear", fill: "forwards" });
        fx.caption("Let's go.", { style: "subtitle", ms: 1400 });
        fx.later(1400, () => fx.caption("Why not?", { style: "subtitle", ms: 1400 }));
        await fx.wait(3200);
        fx.tempo(0.3, 3000);
        for (let i = 0; i < 20; i++) shot(fx, i * 0.12);
        fx.shake("md", 2400);
        fx.buzz([30, 40, 30, 40, 30, 40, 30, 40, 30]);
        fx.caption("(slow motion, from six cameras at once)", { style: "whisper", ms: 2000 });
        await fx.wait(2600);
      }
    },

    // Chitty Chitty Bang Bang
    {
      id: 11708,
      y: 1968,
      run: async (fx) => {
        techni(fx, 7000);
        const car = fx.put(A.S("0 0 140 70", '<path d="M10 44 C10 30 30 24 50 24 H110 C124 24 130 34 130 44 V50 H10 Z" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M30 24 C30 10 60 10 60 24" fill="#d51f2a"/><circle cx="34" cy="54" r="12" fill="none" stroke="#1d1a18" stroke-width="3"/><circle cx="106" cy="54" r="12" fill="none" stroke="#1d1a18" stroke-width="3"/><path class="w" d="M40 40 L10 10 M40 40 L70 10" stroke="#ffd23b" stroke-width="4" opacity="0"/>'), W() / 2, H() * 0.7, { size: 140, h: 70 });
        const chitty = [["C5", 1], ["C5", 1], ["E5", 1], ["G5", 1], ["C6", 2], ["A5", 1], ["G5", 1], ["E5", 2]];
        fx.seq(chitty, { type: "square", vol: 0.05, beat: 0.2, filter: { freq: 2200 } });
        for (let i = 0; i < 6; i++) { fx.thud({ freq: 90, vol: 0.3, dur: 0.1, at: i * 0.3 }); fx.noise(0.1, { freq: 500, vol: 0.3, at: i * 0.3 + 0.1 }); }
        fx.caption("(chitty-chitty — BANG — bang)", { style: "whisper", ms: 1800 });
        await fx.wait(2000);
        const wings = car.querySelector(".w");
        if (wings) wings.setAttribute("opacity", "1");
        fx.tone(600, 1.6, { type: "sine", vol: 0.06, slide: 1400 });
        await fx.move(car, [{ transform: "none" }, { transform: "translate(" + W() * 0.2 + "px,-" + H() * 0.5 + "px) rotate(-10deg)" }], { duration: 2000, easing: "ease-in" });
        fx.caption("(it flies)", { style: "whisper", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Bedknobs and Broomsticks
    {
      id: 12335,
      y: 1971,
      run: async (fx) => {
        techni(fx, 7000);
        const knob = fx.put(A.S("0 0 30 40", '<circle cx="15" cy="12" r="10" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/><rect x="11" y="20" width="8" height="18" fill="#c9a24a" ' + A.ink + ' stroke-width="1.5"/>'), W() / 2, H() * 0.4, { size: 30, h: 40 });
        await fx.move(knob, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], 800);
        fx.tone(1200, 0.6, { type: "sine", vol: 0.06, slide: 2400 });
        fx.caption("(twist the bedknob…)", { style: "whisper", ms: 1400 });
        await fx.wait(600);
        const bed = A.S("0 0 120 70", '<rect x="10" y="30" width="100" height="24" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M10 54 V20 M110 54 V14" stroke="#c9a24a" stroke-width="5"/><circle cx="10" cy="16" r="5" fill="#c9a24a"/><circle cx="110" cy="10" r="5" fill="#c9a24a"/>');
        await fx.fly(bed, [-120, H() * 0.6], [W() + 120, H() * 0.2], { size: 120, h: 70, dur: 3000, via: [W() / 2, H() * 0.1] });
        const armour = [];
        for (let i = 0; i < 5; i++) armour.push(fx.put(A.S("0 0 30 60", '<circle cx="15" cy="10" r="8" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/><path d="M5 20 H25 L24 48 H6 Z" fill="#9aa2a6" ' + A.ink + ' stroke-width="1.5"/><path d="M8 48 V58 M22 48 V58" stroke="#9aa2a6" stroke-width="4"/>'), W() * (0.15 + i * 0.17), H() * 0.72, { size: 26, h: 52 }));
        for (let i = 0; i < 12; i++) fx.later(i * 200, () => { armour.forEach((a) => fx.move(a, [{ transform: "none" }, { transform: "translateY(-4px)" }, { transform: "none" }], { duration: 200, fill: "none" })); fx.click({ freq: 1400, vol: 0.2 }); });
        fx.caption("(the empty suits of armour march)", { style: "whisper", ms: 2000 });
        await fx.wait(2600);
      }
    },

    // The Muppet Movie
    {
      id: 11176,
      y: 1979,
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        const frog = fx.put(A.S("0 0 60 60", '<ellipse cx="30" cy="36" rx="20" ry="16" fill="#5fa04a" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="20" r="8" fill="#fbfbf4" ' + A.ink + ' stroke-width="2"/><circle cx="40" cy="20" r="8" fill="#fbfbf4" ' + A.ink + ' stroke-width="2"/><circle cx="20" cy="21" r="2" fill="#1d1a18"/><circle cx="40" cy="21" r="2" fill="#1d1a18"/><path d="M16 40 Q30 50 44 40" stroke="#1d1a18" stroke-width="2" fill="none"/><path d="M10 50 L20 54 L30 50 L40 54 L50 50" stroke="#3a7a2a" stroke-width="4" fill="none"/>'), W() * 0.3, H() * 0.66, { size: 60 });
        const banjo = fx.put(A.S("0 0 60 30", '<circle cx="14" cy="15" r="12" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><path d="M26 15 H58" stroke="#8a6a3a" stroke-width="4"/>'), W() * 0.3 + 20, H() * 0.66 + 10, { size: 50, h: 25 });
        void banjo;
        fx.wash("linear-gradient(transparent 60%, rgba(60,110,40,.4))", 7000, { fade: 400 });
        const song = [["C5", 2], ["E5", 1], ["G5", 1], ["A5", 3], ["G5", 1], ["E5", 2], ["D5", 2], ["C5", 4]];
        song.reduce((t, [n, l]) => { for (let k = 0; k < l * 2; k++) fx.tone(n, 0.2, { type: "triangle", vol: 0.07, at: t + k * 0.15, attack: 0.002 }); return t + l * 0.3; }, 0);
        fx.caption("(on a log in the swamp)", { style: "whisper", ms: 2000 });
        fx.move(frog, [{ transform: "none" }, { transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }, { transform: "none" }], { duration: 1200, iterations: 3 });
        await fx.wait(4200);
        const rainbow = fx.put(A.S("0 0 200 100", ["#d51f2a", "#ff7a1a", "#f2d33b", "#3aa655", "#3a6ad8", "#6a3bff"].map((c, i) => '<path d="M' + (10 + i * 8) + ' 100 C' + (10 + i * 8) + ' ' + (10 + i * 8) + ' ' + (190 - i * 8) + ' ' + (10 + i * 8) + ' ' + (190 - i * 8) + ' 100" stroke="' + c + '" stroke-width="7" fill="none"/>').join("")), r.x, r.y - 20, { size: 160, h: 80, style: { opacity: 0.7 } });
        fx.move(rainbow, [{ opacity: 0 }, { opacity: 0.7 }], 800);
        await fx.wait(1600);
      }
    },

    // Watership Down
    {
      id: 11837,
      y: 1978,
      run: async (fx) => {
        const field = fx.wash("linear-gradient(#e8d8a0, #a8b870)", 7000, { blend: "multiply", opacity: 0.35, fade: 500 });
        void field;
        const bunny = A.S("0 0 50 40", '<ellipse cx="24" cy="28" rx="16" ry="10" fill="#b8a080" ' + A.ink + ' stroke-width="1.5"/><circle cx="38" cy="20" r="8" fill="#b8a080" ' + A.ink + ' stroke-width="1.5"/><path d="M36 14 L32 0 L38 12 M42 14 L44 0 L40 12" fill="#b8a080" ' + A.ink + ' stroke-width="1.5"/><circle cx="41" cy="19" r="1.5" fill="#1d1a18"/>');
        const bright = [["F5", 2], ["G5", 1], ["A5", 1], ["C6", 3], ["A5", 1], ["G5", 2], ["F5", 4]];
        fx.seq(bright, { type: "sine", vol: 0.08, beat: 0.35 });
        for (let i = 0; i < 6; i++) fx.later(i * 300, () => fx.fly(bunny, [-50, H() * (0.62 + (i % 3) * 0.08)], [W() + 50, H() * (0.6 + (i % 3) * 0.08)], { size: 40, h: 32, dur: 2600, via: [W() / 2, H() * 0.5] }));
        fx.caption("(the warren is leaving)", { style: "whisper", ms: 2000 });
        await fx.wait(3200);
        fx.wash("rgba(160,0,20,.35)", 1600, { fade: 300 });
        fx.caption("(the Black Rabbit of Inlé)", { style: "whisper", ms: 1600, css: { color: "#fff" } });
        fx.chord(["C3", "Eb3", "Gb3"], 1.6, { type: "sine", vol: 0.06 });
        await fx.wait(1800);
      }
    },

    // Some Like It Hot
    {
      id: 239,
      y: 1959,
      run: async (fx) => {
        bw(fx, 7000);
        const beat = 0.16;
        const hot = [["C5", 1], ["E5", 1], ["G5", 1], ["A5", 1], ["G5", 2], ["E5", 1], ["C5", 1], ["D5", 2], ["E5", 1], ["C5", 3]];
        fx.seq(hot.concat(hot), { type: "sawtooth", vol: 0.05, beat, filter: { type: "bandpass", freq: 1500, q: 1.5 } });
        for (let i = 0; i < 26; i++) fx.thud({ freq: i % 2 ? 150 : 80, vol: 0.2, dur: 0.06, at: i * beat });
        fx.costume(".reely", '<path d="M30 40 C30 10 90 10 90 40 C84 26 36 26 30 40 Z" fill="#3b3530"/><path d="M50 72 Q60 80 70 72" stroke="#d51f2a" stroke-width="4" fill="none"/>', 6000);
        fx.caption("(disguised — in the all-girl band)", { style: "whisper", ms: 2000 });
        await fx.wait(3000);
        fx.caption("Well, nobody's perfect.", { style: "subtitle", ms: 2200 });
        fx.later(200, () => wolfWhistle(fx));
        await fx.wait(2400);
      }
    },

    // The Pink Panther (1963)
    {
      id: 936,
      y: 1963,
      run: async (fx) => {
        const beat = 0.2;
        const sneak = [["C#4", 1], ["D4", 3], [null, 1], ["D#4", 1], ["E4", 3], [null, 1], ["C#4", 1], ["D4", 1], ["D#4", 1], ["E4", 1], ["A4", 1], ["G#4", 3]];
        fx.seq(sneak, { type: "sawtooth", vol: 0.05, beat, filter: { type: "bandpass", freq: 1200, q: 2 }, vibrato: [5, 5] });
        const panther = fx.put(A.S("0 0 70 90", '<path d="M20 88 C16 60 18 40 30 30 C24 20 26 8 34 6 C38 0 44 0 46 6 C54 8 56 20 50 30 C62 40 64 60 60 88" fill="#ff8ac8" ' + A.ink + ' stroke-width="2"/><circle cx="36" cy="18" r="2" fill="#1d1a18"/><circle cx="44" cy="18" r="2" fill="#1d1a18"/><path d="M58 60 C70 50 70 30 62 26" stroke="#ff8ac8" stroke-width="5" fill="none"/>'), -40, H() * 0.6, { size: 60, h: 78 });
        const steps = 10;
        for (let i = 1; i <= steps; i++) {
          if (!fx.reduced) panther.style.transform = "translateX(" + (i * (W() + 80) / steps) + "px) translateY(" + (i % 2 ? -4 : 0) + "px)";
          if (i === 5) { fx.wait(0); }
          await fx.wait(i === 5 ? 1200 : 260);
          if (i === 5) fx.caption("(freeze)", { style: "whisper", ms: 800 });
        }
        const r = fx.rect(fx.slot());
        const gem = fx.put(A.S("0 0 40 40", '<path d="M20 4 L36 16 L20 36 L4 16 Z" fill="#ff5aa8" stroke="#fff" stroke-width="1.5"/>'), r.x, r.y, { size: 34, ms: 1800, style: { filter: "drop-shadow(0 0 8px #ff5aa8)" } });
        void gem;
        fx.caption("(the Pink Panther diamond — gone)", { style: "whisper", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // Young Frankenstein
    {
      id: 3034,
      y: 1974,
      run: async (fx) => {
        bw(fx, 7000);
        const r = fx.rect(fx.slot());
        const brain = fx.put(A.S("0 0 60 50", '<path d="M10 30 C4 16 18 4 30 8 C42 2 58 14 52 28 C58 40 44 48 30 44 C16 50 4 42 10 30 Z" fill="#e8b8c8" ' + A.ink + ' stroke-width="1.5"/><path d="M18 20 C22 26 28 18 32 26 M36 16 C40 24 46 18 48 28" stroke="#b8889a" stroke-width="2" fill="none"/>'), r.x, r.y, { size: 50, h: 42 });
        void brain;
        fx.put('<div style="font:700 11px/1 Georgia,serif;color:#1d1a18;background:#fbf8ee;border:1px solid #1d1a18;padding:2px 4px">ABBY NORMAL</div>', r.x, r.y + 30, { size: 100, h: 16, ms: 2600 });
        fx.caption("(the brain in the jar: Abby… Normal)", { style: "whisper", ms: 2000 });
        await fx.wait(2400);
        const beat = 0.2;
        const ritz = [["D5", 1], ["C#5", 1], ["C5", 1], ["B4", 1], ["Bb4", 2], ["B4", 2], ["C5", 4]];
        fx.seq(ritz, { type: "square", vol: 0.05, beat, filter: { freq: 1800 } });
        for (let i = 0; i < 12; i++) fx.click({ freq: 3000, vol: 0.3, at: i * beat });
        fx.costume(".reely", '<path d="M40 20 H80 V-10 H44 Z" fill="#1d1a18"/><path d="M30 24 H90" stroke="#1d1a18" stroke-width="6"/>', 2400);
        fx.caption("♪ Puttin' on the Ritz ♪", { style: "hand", ms: 2000 });
        await fx.wait(2400);
      }
    },

    // Blazing Saddles
    {
      id: 11072,
      y: 1974,
      run: async (fx) => {
        west(fx, 7000);
        const toll = fx.put(A.S("0 0 100 60", '<rect x="4" y="20" width="16" height="36" fill="#d51f2a" ' + A.ink + ' stroke-width="1.5"/><path d="M20 30 H96" stroke="#f4f0e6" stroke-width="5"/><path d="M20 30 H96" stroke="#d51f2a" stroke-width="5" stroke-dasharray="10 10"/><text x="12" y="16" font-size="8" text-anchor="middle" font-family="Georgia" fill="#1d1a18">TOLL</text>'), W() / 2, H() * 0.66, { size: 110, h: 66 });
        void toll;
        fx.caption("(a tollbooth — in the middle of the desert)", { style: "whisper", ms: 2000 });
        await fx.wait(2200);
        fx.caption("Somebody's gotta go back and get a whole lot of dimes!", { style: "subtitle", ms: 2200, css: { fontSize: "13px" } });
        A.coinReturn(fx, 12, "#c9c9c9");
        await fx.wait(2200);
        fx.caption("(and then the movie breaks out of the movie)", { style: "whisper", ms: 1800 });
        const wall = fx.put(A.S("0 0 200 100", '<rect x="4" y="4" width="192" height="92" fill="#e8d8b0" ' + A.ink + ' stroke-width="2"/><path d="M4 4 L60 50 L20 96 M196 4 L140 60 L180 96" stroke="#1d1a18" stroke-width="2"/>'), W() / 2, H() * 0.4, { size: 200, h: 100 });
        fx.move(wall, [{ transform: "none" }, { transform: "scale(1.4)", opacity: 0 }], { duration: 800, delay: 400 });
        fx.later(400, () => { fx.noise(0.5, { freq: 800, vol: 0.5 }); fx.thud({ vol: 0.6 }); });
        await fx.wait(1600);
      }
    },

    // The Producers (1967)
    {
      id: 30197,
      y: 1968,
      run: async (fx) => {
        const review = fx.put('<div style="width:100%;height:100%;background:#fbf8ee;border:2px solid #1d1a18;padding:8px;box-sizing:border-box;font:700 13px/1.2 Georgia,serif;color:#1d1a18;text-align:center">OPENING TONIGHT<br><span style="font-size:18px;color:#b3122a">A SURE-FIRE FLOP</span></div>', W() / 2, H() * 0.3, { size: 190, h: 64 });
        fx.caption("(the plan: produce the worst show on Broadway)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
        const kick = [["C5", 1], ["C5", 1], ["D5", 1], ["E5", 1], ["G5", 2], ["E5", 2], ["C5", 4]];
        fx.seq(kick.concat(kick), { type: "square", vol: 0.05, beat: 0.18, filter: { freq: 2200 } });
        const line = [];
        for (let i = 0; i < 8; i++) line.push(fx.put(A.S("0 0 24 60", '<circle cx="12" cy="8" r="6" fill="#f2d6b3"/><path d="M4 16 H20 L22 36 H2 Z" fill="#6d7478"/><path d="M6 36 L4 58 M18 36 L20 58" stroke="#1d1a18" stroke-width="4"/>'), W() * (0.08 + i * 0.12), H() * 0.72, { size: 20, h: 50, style: { transformOrigin: "50% 60%" } }));
        for (let k = 0; k < 10; k++) {
          line.forEach((d, i) => { if (!fx.reduced) d.style.transform = "rotate(" + ((k + i) % 2 ? 30 : -30) + "deg)"; });
          await fx.wait(300);
        }
        review.firstChild.innerHTML = "OPENING TONIGHT<br><span style=\"font-size:18px;color:#3aa655\">A SMASH HIT!</span>";
        fx.caption("(it's a hit. Disaster.)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // Monty Python's Life of Brian
    {
      id: 583,
      y: 1979,
      run: async (fx) => {
        const whistle = [["G5", 1], ["E5", 1], ["C5", 1], ["E5", 1], ["G5", 2], ["A5", 1], ["G5", 1], ["E5", 1], ["C5", 1], ["D5", 4]];
        fx.seq(whistle, { type: "sine", vol: 0.1, beat: 0.25, vibrato: [5, 10] });
        fx.caption("♪ Always look on the bright side of life ♪", { style: "hand", ms: 3000 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "rotate(" + (i % 2 ? 5 : -5) + "deg)" }, { transform: "none" }], { duration: 1000, iterations: 3, delay: i * 30, fill: "none" }));
        await fx.wait(3200);
        const sandal = fx.put(A.S("0 0 50 24", '<path d="M4 18 C4 8 46 8 46 18 Z" fill="#8a6a3a" ' + A.ink + ' stroke-width="1.5"/><path d="M14 10 V4 M36 10 V4" stroke="#6b4a2a" stroke-width="2"/>'), W() / 2, H() * 0.75, { size: 50, h: 24 });
        fx.caption("(the shoe is a sign!)", { style: "whisper", ms: 1600 });
        fx.move(sandal, [{ transform: "none" }, { transform: "translateY(-10px) rotate(-6deg)" }, { transform: "none" }], 600);
        await fx.wait(1800);
      }
    },

    // Roman Holiday
    {
      id: 804,
      y: 1953,
      run: async (fx) => {
        bw(fx, 7000);
        const scooter = A.S("0 0 100 60", '<circle cx="20" cy="46" r="10" fill="none" stroke="#1d1a18" stroke-width="3"/><circle cx="80" cy="46" r="10" fill="none" stroke="#1d1a18" stroke-width="3"/><path d="M20 46 C24 30 40 28 60 30 H76 L80 46 M72 30 L78 10 H86" fill="#9aa2a6" stroke="#1d1a18" stroke-width="2"/><circle cx="50" cy="16" r="6" fill="#1d1a18"/><circle cx="36" cy="18" r="6" fill="#3b3530"/>');
        fx.caption("(through Rome on a Vespa)", { style: "whisper", ms: 1800 });
        fx.tone(200, 2.4, { type: "sawtooth", vol: 0.04, vibrato: [20, 8], filter: { freq: 900 } });
        await fx.fly(scooter, [-100, H() * 0.7], [W() + 100, H() * 0.66], { size: 100, h: 60, dur: 2600, via: [W() * 0.5, H() * 0.6], easing: "ease-in-out" });
        const mouth = fx.put(A.S("0 0 100 100", '<circle cx="50" cy="50" r="46" fill="#9a958a" ' + A.ink + ' stroke-width="2"/><circle cx="34" cy="38" r="8" fill="#3b3530"/><circle cx="66" cy="38" r="8" fill="#3b3530"/><ellipse cx="50" cy="70" rx="16" ry="10" fill="#1d1a18"/>'), W() / 2, H() * 0.36, { size: 110 });
        void mouth;
        fx.caption("(the Mouth of Truth — liars lose their hand)", { style: "whisper", ms: 2000 });
        await fx.wait(1600);
        fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateY(10px)" }, { transform: "translateY(-10px)" }, { transform: "none" }], 500);
        fx.noise(0.3, { freq: 700, vol: 0.4 });
        fx.caption("(just kidding)", { style: "whisper", ms: 1200 });
        await fx.wait(1400);
      }
    },

    // Breakfast at Tiffany's
    {
      id: 164,
      y: 1961,
      run: async (fx) => {
        techni(fx, 7000);
        fx.wash("rgba(129,216,208,.25)", 7000, { fade: 400 });
        const box1 = fx.put(A.S("0 0 70 60", '<rect x="6" y="18" width="58" height="38" fill="#81d8d0" ' + A.ink + ' stroke-width="2"/><path d="M4 18 H66 V10 H4 Z" fill="#81d8d0" ' + A.ink + ' stroke-width="2"/><path d="M35 10 V56" stroke="#fff" stroke-width="5"/><path d="M26 4 C30 10 35 10 35 10 C35 10 40 10 44 4" stroke="#fff" stroke-width="4" fill="none"/>'), W() / 2, H() * 0.4, { size: 80, h: 68 });
        void box1;
        const moon = [["G4", 3], ["D5", 2], ["C5", 1], ["B4", 1.5], ["A4", 0.5], ["G4", 1], ["F4", 1], ["G4", 4]];
        fx.seq(moon, { type: "sine", vol: 0.08, beat: 0.35, vibrato: [4, 6] });
        fx.caption("(a croissant, a coffee, and the window at Tiffany's)", { style: "whisper", ms: 2400 });
        fx.costume(".reely", '<path d="M36 56 C36 50 50 48 52 56 M68 56 C70 48 84 50 84 56" stroke="#1d1a18" stroke-width="7" fill="none"/><path d="M52 56 H68" stroke="#1d1a18" stroke-width="3"/><path d="M40 20 C40 0 80 0 80 20" fill="#1d1a18"/>', 5000);
        await fx.wait(3000);
        fx.put(A.cat, W() * 0.8, H() * 0.75, { size: 50, h: 32, ms: 1800, style: { filter: "sepia(1) saturate(3) hue-rotate(-20deg)" } });
        fx.caption("(Cat, in the rain)", { style: "whisper", ms: 1600 });
        await fx.wait(1600);
      }
    },

    // The Graduate
    {
      id: 37247,
      y: 1967,
      run: async (fx) => {
        seventies(fx, 7000);
        const pool = fx.wash("linear-gradient(rgba(80,170,230,.35), rgba(40,110,180,.55))", 3600, { fade: 400 });
        void pool;
        fx.particles({ kind: "rise", count: 16, glyphs: A.bubble, min: 5, max: 10, dur: 2400 });
        fx.caption("(the scuba suit, at the bottom of the pool)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 6; i++) fx.noise(0.5, { type: "lowpass", freq: 300, vol: 0.2, at: i * 0.6 });
        await fx.wait(2400);
        fx.caption("Plastics.", { style: "subtitle", ms: 1600 });
        await fx.wait(1600);
        const guitar = [["E4", 1], ["G4", 1], ["B4", 1], ["G4", 1], ["E4", 1], ["G4", 1], ["C5", 1], ["B4", 1]];
        guitar.forEach(([n], i) => fx.tone(n, 0.6, { type: "triangle", vol: 0.06, at: i * 0.2, attack: 0.002 }));
        fx.caption("(the back of the bus — and their smiles fade)", { style: "whisper", ms: 2000 });
        const bus = fx.put(box("background:#f2d33b;border:3px solid #1d1a18;border-radius:8px"), W() / 2, H() * 0.75, { size: 200, h: 70 });
        void bus;
        await fx.wait(2000);
      }
    },

    // Annie Hall
    {
      id: 703,
      y: 1977,
      run: async (fx) => {
        seventies(fx, 7000);
        const r = fx.rect(fx.slot());
        const lobster = A.S("0 0 50 40", '<ellipse cx="25" cy="22" rx="14" ry="8" fill="#d51f2a" ' + A.ink + ' stroke-width="1.5"/><path d="M11 18 C4 10 2 4 8 2 C12 4 12 10 14 14 M39 18 C46 10 48 4 42 2 C38 4 38 10 36 14" fill="#d51f2a" ' + A.ink + ' stroke-width="1.5"/><path d="M14 28 L8 36 M20 30 L18 38 M30 30 L32 38 M36 28 L42 36" stroke="#d51f2a" stroke-width="2"/>');
        fx.caption("(the lobsters got loose in the kitchen)", { style: "whisper", ms: 2000 });
        for (let i = 0; i < 5; i++) fx.later(i * 200, () => fx.fly(lobster, [r.x, r.y], [fx.rand(0, W()), H() - 30], { size: 36, h: 28, dur: 1400, easing: "steps(10)" }));
        for (let i = 0; i < 10; i++) fx.click({ freq: 2600, vol: 0.15, at: i * 0.15 });
        await fx.wait(2600);
        const subs = fx.put('<div style="font:13px/1.3 Georgia,serif;color:#fff;background:rgba(0,0,0,.6);padding:4px 8px;text-align:center">(he thinks I&#39;m a yo-yo)</div>', W() / 2, H() * 0.55, { size: 260, h: 40 });
        fx.caption("So, did you do those photographs in there?", { style: "subtitle", ms: 2000 });
        fx.caption("(subtitles, for what they're really thinking)", { style: "whisper", ms: 1800, css: { bottom: "10vh" } });
        await fx.wait(2200);
        fx.remove(subs);
        fx.caption("La-di-da, la-di-da.", { style: "subtitle", ms: 1400 });
        await fx.wait(1400);
      }
    },

    // Fiddler on the Roof
    {
      id: 14811,
      y: 1971,
      run: async (fx) => {
        seventies(fx, 7000);
        const roof = fx.put(A.S("0 0 160 80", '<path d="M4 76 L80 10 L156 76 Z" fill="#8a6a4a" ' + A.ink + ' stroke-width="2"/>'), W() / 2, H() * 0.24, { size: 160, h: 80 });
        const fiddler = fx.put(A.S("0 0 40 60", '<circle cx="20" cy="8" r="6" fill="#e8c8a0"/><path d="M10 4 H30" stroke="#1d1a18" stroke-width="3"/><path d="M12 16 H28 L30 44 H10 Z" fill="#3b3530"/><path d="M28 18 L40 10" stroke="#8a4a1a" stroke-width="4"/><path d="M26 20 L38 30" stroke="#c9a24a" stroke-width="1.5"/><path d="M12 44 L10 58 M28 44 L30 58" stroke="#1d1a18" stroke-width="3"/>'), W() / 2, H() * 0.24 - 40, { size: 36, h: 54 });
        void roof;
        const tune = [["D5", 1], ["G5", 1], ["F#5", 1], ["G5", 1], ["A5", 1], ["Bb5", 1], ["A5", 1], ["G5", 1], ["F#5", 2], ["D5", 2]];
        fx.seq(tune, { type: "sawtooth", vol: 0.05, beat: 0.25, filter: { freq: 1800 }, vibrato: [6, 8] });
        fx.move(fiddler, [{ transform: "rotate(-6deg)" }, { transform: "rotate(6deg)" }], { duration: 500, iterations: 6, direction: "alternate" });
        await fx.wait(2600);
        fx.caption("Tradition!", { style: "hand", ms: 1600 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s, i) => fx.move(s, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 250, delay: (i % 4) * 60, iterations: 4, fill: "none" }));
        for (let i = 0; i < 8; i++) fx.thud({ freq: 90, vol: 0.2, dur: 0.1, at: i * 0.25 });
        await fx.wait(2200);
      }
    },

    // My Fair Lady
    {
      id: 11113,
      y: 1964,
      run: async (fx) => {
        techni(fx, 7000);
        const hat = fx.costume(".reely", '<ellipse cx="60" cy="22" rx="46" ry="10" fill="#fbfbf4" stroke="#1f1b16" stroke-width="2"/><path d="M40 18 C40 4 80 4 80 18" fill="#fbfbf4" stroke="#1f1b16" stroke-width="2"/><path d="M84 16 C96 6 104 14 98 22" stroke="#1d1a18" stroke-width="3" fill="none"/>', 7000);
        void hat;
        fx.caption("The rain in Spain stays mainly in the plain.", { style: "subtitle", ms: 2600 });
        const tango = [["C5", 1], ["D5", 1], ["E5", 2], ["G5", 1], ["E5", 1], ["C5", 2]];
        fx.seq(tango, { type: "sawtooth", vol: 0.05, beat: 0.22, filter: { freq: 1800 } });
        for (let i = 0; i < 6; i++) fx.thud({ freq: 90, vol: 0.2, dur: 0.1, at: i * 0.44 });
        await fx.wait(2800);
        fx.caption("(the Ascot races — everyone in black and white)", { style: "whisper", ms: 2200 });
        const all = [fx.slot()].concat(fx.otherSlots(true));
        all.forEach((s) => fx.style(s, { filter: "grayscale(1) contrast(1.4)" }, 2400));
        fx.caption("C'mon, Dover!", { style: "hand", ms: 1600, css: { bottom: "12vh" } });
        await fx.wait(2400);
      }
    },

    // Cabaret
    {
      id: 10784,
      y: 1972,
      run: async (fx) => {
        fx.wash("radial-gradient(circle, rgba(255,200,120,.1), rgba(30,0,10,.7))", 7000, { fade: 400 });
        const stage = fx.put('<div style="width:100%;height:100%;background:radial-gradient(ellipse at 50% 0, rgba(255,255,230,.7), transparent 70%)"></div>', W() / 2, H() * 0.45, { size: 200, h: H() * 0.8 });
        void stage;
        const chair = fx.put(A.S("0 0 50 70", '<path d="M10 4 V66 M40 4 V66 M10 34 H40 M10 14 H40" stroke="#1d1a18" stroke-width="4"/>'), W() / 2, H() * 0.6, { size: 44, h: 62 });
        void chair;
        fx.costume(".reely", '<path d="M36 40 C36 20 84 20 84 40 L80 30 C70 26 50 26 40 30 Z" fill="#1d1a18"/><path d="M40 20 H80 V14 H40 Z" fill="#1d1a18"/>', 6600);
        const vamp = [["E4", 1], ["G4", 1], ["B4", 1], ["E5", 1], ["D5", 1], ["B4", 1], ["G4", 2]];
        fx.seq(vamp.concat(vamp), { type: "sawtooth", vol: 0.05, beat: 0.22, filter: { freq: 1600 } });
        for (let i = 0; i < 16; i++) fx.noise(0.05, { type: "highpass", freq: 7000, vol: 0.1, at: i * 0.22 });
        fx.caption("Willkommen, bienvenue, welcome!", { style: "subtitle", ms: 2400 });
        await fx.wait(2600);
        fx.caption("Life is a cabaret, old chum.", { style: "subtitle", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // The Bridge on the River Kwai
    {
      id: 826,
      y: 1957,
      run: async (fx) => {
        techni(fx, 7000);
        const whistle = [["G4", 0.5], ["E4", 0.5], ["E4", 1], ["F4", 0.5], ["G4", 0.5], ["E5", 1], ["E5", 1], ["C5", 2], ["G4", 0.5], ["E4", 0.5], ["E4", 1], ["F4", 0.5], ["G4", 0.5], ["G4", 1], ["F4", 1], ["E4", 2]];
        fx.seq(whistle, { type: "sine", vol: 0.1, beat: 0.25, vibrato: [5, 10] });
        const bridge = fx.put(A.S("0 0 300 80", '<path d="M0 30 H300" stroke="#6b4a2a" stroke-width="8"/>' + Array.from({ length: 12 }, (_, i) => '<path d="M' + (12 + i * 25) + ' 30 L' + (i * 25) + ' 80 M' + (12 + i * 25) + ' 30 L' + (24 + i * 25) + ' 80" stroke="#6b4a2a" stroke-width="3"/>').join("")), W() / 2, H() * 0.6, { size: W(), h: 80 });
        fx.caption("(the Colonel Bogey March)", { style: "whisper", ms: 2000 });
        await fx.wait(4000);
        const plunger = fx.put(A.S("0 0 40 50", '<rect x="6" y="22" width="28" height="24" fill="#6b4a2a" ' + A.ink + ' stroke-width="1.5"/><path d="M20 22 V4 M10 4 H30" stroke="#1d1a18" stroke-width="3"/>'), W() * 0.15, H() * 0.8, { size: 30, h: 38 });
        await fx.move(plunger, [{ transform: "none" }, { transform: "translateY(8px)" }], { duration: 300, fill: "forwards" });
        fx.thud({ vol: 1, freq: 40, dur: 1 });
        fx.flash("#ffcf5a", 300);
        fx.shake("lg", 800);
        fx.buzz([200, 60, 200]);
        fx.move(bridge, [{ transform: "none" }, { transform: "translateY(60px) rotate(4deg)", opacity: 0 }], { duration: 1200 });
        fx.caption("Madness! Madness!", { style: "subtitle", ms: 1800 });
        await fx.wait(1800);
      }
    },

    // The Great Escape
    {
      id: 5925,
      y: 1963,
      run: async (fx) => {
        techni(fx, 7000);
        const march = [["C5", 1], ["G4", 1], ["C5", 1], ["E5", 1], ["D5", 2], ["C5", 1], ["B4", 1], ["C5", 4]];
        fx.seq(march.concat(march), { type: "square", vol: 0.05, beat: 0.2, filter: { freq: 2000 } });
        const tunnel = fx.put(box("background:linear-gradient(90deg, #6b4a2a, #3b2a1a 40%, #6b4a2a);border-top:4px solid #8a6a3a"), W() / 2, H() - 30, { size: W(), h: 40 });
        void tunnel;
        const trolley = fx.put(A.S("0 0 40 20", '<rect x="4" y="4" width="32" height="10" fill="#8a6a3a" ' + A.ink + ' stroke-width="1.5"/><circle cx="10" cy="16" r="3" fill="#1d1a18"/><circle cx="30" cy="16" r="3" fill="#1d1a18"/>'), -20, H() - 30, { size: 36, h: 18 });
        fx.caption("(Tom, Dick and Harry — the tunnels)", { style: "whisper", ms: 2000 });
        await fx.move(trolley, [{ transform: "none" }, { transform: "translateX(" + (W() + 40) + "px)" }], { duration: 2400, easing: "linear" });
        const bike = A.S("0 0 100 60", '<circle cx="22" cy="44" r="14" fill="none" ' + A.ink + '/><circle cx="78" cy="44" r="14" fill="none" ' + A.ink + '/><path d="M22 44 L40 22 H64 L78 44 M40 22 L50 44" fill="none" ' + A.ink + '/><circle cx="50" cy="8" r="6" fill="#e8c8a0"/>');
        fx.caption("(and a motorcycle, over the wire)", { style: "whisper", ms: 2000 });
        fx.tone(90, 2, { type: "sawtooth", vol: 0.05, slide: 200, filter: { freq: 600 }, vibrato: [30, 5] });
        await fx.fly(bike, [-100, H() * 0.7], [W() + 100, H() * 0.6], { size: 100, h: 60, dur: 2000, via: [W() / 2, H() * 0.35] });
      }
    },

    // The Deer Hunter
    {
      id: 11778,
      y: 1978,
      run: async (fx) => {
        seventies(fx, 7000);
        const guitar = [["E5", 2], ["B4", 1], ["G#4", 1], ["E4", 2], ["F#4", 2], ["G#4", 1], ["A4", 1], ["B4", 4]];
        guitar.reduce((t, [n, l]) => { fx.tone(n, 1.2, { type: "triangle", vol: 0.08, at: t, attack: 0.002 }); return t + l * 0.3; }, 0);
        fx.caption("(Cavatina)", { style: "whisper", ms: 1800 });
        await fx.wait(2400);
        const cyl = fx.put(A.S("0 0 80 80", '<circle cx="40" cy="40" r="36" fill="#6d7478" ' + A.ink + ' stroke-width="2"/>' + Array.from({ length: 6 }, (_, i) => '<circle cx="' + (40 + Math.cos(i * Math.PI / 3) * 20) + '" cy="' + (40 + Math.sin(i * Math.PI / 3) * 20) + '" r="7" fill="' + (i === 0 ? "#c9a24a" : "#1d1a18") + '"/>').join("") + '<circle cx="40" cy="40" r="5" fill="#9aa2a6"/>'), W() / 2, H() * 0.4, { size: 90 });
        await fx.move(cyl, [{ transform: "rotate(0)" }, { transform: "rotate(" + (720 + 60 * fx.rand(1, 5) | 0) + "deg)" }], { duration: 1600, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" });
        for (let i = 0; i < 12; i++) fx.click({ freq: 1200, vol: 0.2, at: i * 0.12 });
        await fx.wait(600);
        fx.click({ freq: 700, vol: 0.6 });
        fx.caption("(click)", { style: "whisper", ms: 1400 });
        await fx.wait(1600);
      }
    },

    // From Russia with Love
    {
      id: 657,
      y: 1963,
      run: async (fx) => {
        techni(fx, 7000);
        const r = fx.rect(fx.slot());
        const case1 = fx.put(A.S("0 0 80 60", '<rect x="4" y="12" width="72" height="44" rx="4" fill="#6b4a2a" ' + A.ink + ' stroke-width="2"/><path d="M30 12 V4 H50 V12" fill="none" ' + A.ink + ' stroke-width="3"/><circle cx="20" cy="30" r="3" fill="#c9a24a"/><circle cx="60" cy="30" r="3" fill="#c9a24a"/>'), r.x, r.top + r.height + 30, { size: 70, h: 52 });
        void case1;
        fx.caption("(the briefcase: gold sovereigns, a knife, tear gas)", { style: "whisper", ms: 2200 });
        await fx.wait(1600);
        fx.noise(0.6, { type: "highpass", freq: 3000, vol: 0.5 });
        fx.particles({ kind: "burst", from: case1, count: 20, spread: 40, glyphs: dot("rgba(230,230,210,.8)"), min: 8, max: 18, dur: 1200 });
        A.coinReturn(fx, 6);
        await fx.wait(1600);
        const heli = A.S("0 0 100 50", '<path d="M0 6 H100" stroke="#1d1a18" stroke-width="3"/><path d="M50 6 V14" stroke="#1d1a18" stroke-width="3"/><ellipse cx="40" cy="28" rx="26" ry="14" fill="#3b3530"/><path d="M66 28 H96 L100 20" stroke="#3b3530" stroke-width="4" fill="none"/>');
        fx.caption("(and a helicopter over the hills)", { style: "whisper", ms: 1800 });
        for (let t = 0; t < 2.4; t += 0.08) fx.noise(0.05, { type: "bandpass", freq: 300, q: 2, vol: 0.2, at: t });
        await fx.fly(heli, [W() + 100, H() * 0.2], [-100, H() * 0.3], { size: 100, h: 50, dur: 2400, flip: true });
      }
    },

    // Live and Let Die
    {
      id: 253,
      y: 1973,
      run: async (fx) => {
        seventies(fx, 7000);
        fx.wash("linear-gradient(transparent 55%, rgba(60,100,70,.5))", 7000, { fade: 400 });
        const crocs = [];
        for (let i = 0; i < 4; i++) crocs.push(fx.put(A.S("0 0 80 24", '<path d="M4 14 C20 4 60 4 76 12 L70 16 L76 20 C60 24 20 22 4 14 Z" fill="#3a6a3a" ' + A.ink + ' stroke-width="1.5"/><circle cx="64" cy="10" r="2" fill="#f2d33b"/>'), W() * (0.2 + i * 0.2), H() * 0.78, { size: 70, h: 22 }));
        fx.caption("(no bridge — just crocodiles)", { style: "whisper", ms: 1800 });
        await fx.wait(1600);
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        const hops = crocs.map((c) => fx.rect(c));
        for (const h of hops) {
          await fx.move(reely, [{ transform: "none" }, { transform: "translate(" + (h.x - rr.x) + "px," + (h.y - rr.y - 40) + "px)" }], { duration: 300, fill: "forwards" });
          fx.thud({ freq: 150, vol: 0.3, dur: 0.08 });
          fx.later(100, () => fx.noise(0.2, { type: "bandpass", freq: 500, q: 2, vol: 0.3 }));
        }
        if (!fx.reduced) await fx.anim(reely, [{ transform: "translate(" + (hops[3].x - rr.x) + "px," + (hops[3].y - rr.y - 40) + "px)" }, { transform: "none" }], { duration: 600, fill: "forwards" });
        const theme = [["G4", 1], ["C5", 1], ["E5", 1], ["G5", 3], ["F5", 1], ["D5", 1], ["C5", 3]];
        fx.seq(theme, { type: "sawtooth", vol: 0.06, beat: 0.2, filter: { freq: 2000 } });
        fx.later(800, () => { fx.thud({ vol: 0.9, freq: 40 }); fx.flash("#ffcf5a", 200); fx.shake("lg", 500); });
        await fx.wait(2400);
      }
    },

    // Harold and Maude
    {
      id: 343,
      y: 1971,
      run: async (fx) => {
        seventies(fx, 7000);
        const hearse = A.S("0 0 140 50", '<path d="M6 34 C6 24 16 20 30 18 H110 C124 20 132 26 132 34 V38 H6 Z" fill="#1d1a18"/><path d="M40 18 C40 8 100 8 100 18" fill="#1d1a18"/><circle cx="32" cy="40" r="8" fill="#555"/><circle cx="108" cy="40" r="8" fill="#555"/>');
        fx.caption("(his car is a hearse)", { style: "whisper", ms: 1600 });
        await fx.fly(hearse, [-140, H() * 0.72], [W() + 140, H() * 0.72], { size: 130, h: 46, dur: 2400 });
        const song = [["G4", 1], ["G4", 1], ["A4", 1], ["B4", 1], ["D5", 2], ["B4", 1], ["A4", 1], ["G4", 4]];
        song.reduce((t, [n, l]) => { fx.tone(n, 0.8, { type: "triangle", vol: 0.08, at: t, attack: 0.002 }); return t + l * 0.3; }, 0);
        fx.caption("♪ If you want to sing out, sing out ♪", { style: "hand", ms: 2400 });
        const daisies = [];
        for (let i = 0; i < 20; i++) daisies.push(fx.put(A.S("0 0 20 30", '<path d="M10 30 V14" stroke="#3a7a2a" stroke-width="2"/><circle cx="10" cy="10" r="3" fill="#f2d33b"/>' + [0, 60, 120, 180, 240, 300].map((a) => '<ellipse cx="10" cy="5" rx="2" ry="4" fill="#fff" transform="rotate(' + a + ' 10 10)"/>').join("")), fx.rand(10, W() - 10), fx.rand(H() * 0.55, H() - 10), { size: 16, h: 24, style: { opacity: 0 } }));
        daisies.forEach((d, i) => fx.anim(d, [{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: i * 60, fill: "forwards" }));
        await fx.wait(3000);
      }
    },

    // Death Race 2000
    {
      id: 13282,
      y: 1975,
      run: async (fx) => {
        seventies(fx, 6600);
        const board = fx.put('<div style="width:100%;height:100%;background:#1d1a18;border:3px solid #f2d33b;padding:6px;box-sizing:border-box;font:700 12px/1.4 \'Special Elite\',\'Courier New\',monospace;color:#f2d33b"></div>', W() / 2, H() * 0.28, { size: 220, h: 90 });
        const rows = ["FRANKENSTEIN ...... 92", "MACHINE GUN JOE ... 85", "CALAMITY JANE ..... 60"];
        for (const r of rows) { board.firstChild.innerHTML += r + "<br>"; fx.click({ freq: 2000, vol: 0.2 }); await fx.wait(400); }
        const car = (c) => A.S("0 0 100 40", '<path d="M4 28 C4 20 14 16 30 14 L44 6 H70 L84 16 C94 18 96 22 96 28 V32 H4 Z" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><path d="M84 18 L100 10 L96 22" fill="#f4f0e6"/><circle cx="26" cy="32" r="7" fill="#1d1a18"/><circle cx="76" cy="32" r="7" fill="#1d1a18"/>');
        for (let i = 0; i < 3; i++) fx.later(i * 300, () => fx.fly(car(["#3aa655", "#d51f2a", "#f2d33b"][i]), [-100, H() * (0.6 + i * 0.1)], [W() + 100, H() * (0.6 + i * 0.1)], { size: 100, h: 40, dur: 1200 }));
        fx.tone(200, 2, { type: "sawtooth", vol: 0.06, slide: 800, filter: { freq: 1400 } });
        fx.caption("(points for pedestrians, cross-country)", { style: "whisper", ms: 2200 });
        await fx.wait(2400);
      }
    },

    // Mad Max (1979)
    {
      id: 9659,
      y: 1979,
      run: async (fx) => {
        seventies(fx, 6600);
        fx.wash("linear-gradient(#ffc870, #d08040)", 6600, { blend: "multiply", opacity: 0.3, fade: 400 });
        const road = fx.put(A.S("0 0 400 100", '<path d="M170 0 H230 L400 100 H0 Z" fill="rgba(40,40,40,.7)"/><path class="d" d="M200 0 V100" stroke="#f2d33b" stroke-width="4" stroke-dasharray="10 12"/>'), W() / 2, H() * 0.8, { size: W(), h: H() * 0.4 });
        const d = road.querySelector(".d");
        fx.tone(80, 5, { type: "sawtooth", vol: 0.07, slide: 160, filter: { freq: 500 }, vibrato: [30, 5] });
        await fx.tween(3000, (k) => { if (d) d.style.strokeDashoffset = -k * 600; });
        const interceptor = fx.put(A.S("0 0 120 50", '<path d="M4 34 C4 24 20 18 40 16 L54 6 H86 L100 18 C112 20 116 26 116 34 V38 H4 Z" fill="#1d1a18" ' + A.ink + ' stroke-width="2"/><rect x="50" y="0" width="20" height="10" fill="#9aa2a6"/><circle cx="30" cy="40" r="8" fill="#333"/><circle cx="92" cy="40" r="8" fill="#333"/>'), W() / 2, H() * 0.75, { size: 120, h: 50 });
        fx.caption("(the last of the V8 Interceptors)", { style: "whisper", ms: 2000 });
        fx.noise(0.6, { type: "bandpass", freq: 600, q: 2, vol: 0.5 });
        fx.tone(120, 1, { type: "sawtooth", vol: 0.1, slide: 400, filter: { freq: 1200 } });
        fx.move(interceptor, [{ transform: "none" }, { transform: "translateY(-6px)" }, { transform: "none" }], { duration: 120, iterations: 8 });
        await fx.wait(2200);
      }
    },

    // The Italian Job (1969)
    {
      id: 10536,
      y: 1969,
      run: async (fx) => {
        seventies(fx, 7000);
        const minis = ["#d51f2a", "#f4f0e6", "#3a6ad8"];
        const mini = (c) => A.S("0 0 70 40", '<path d="M6 28 C6 18 14 14 22 12 L28 4 H50 L56 12 C64 14 66 20 66 28 V32 H6 Z" fill="' + c + '" ' + A.ink + ' stroke-width="2"/><rect x="30" y="6" width="18" height="6" fill="#cfe8ff"/><circle cx="18" cy="32" r="6" fill="#1d1a18"/><circle cx="54" cy="32" r="6" fill="#1d1a18"/>');
        const beat = 0.2;
        const self = [["C5", 1], ["E5", 1], ["G5", 1], ["E5", 1], ["C5", 2], ["G4", 2], ["A4", 1], ["B4", 1], ["C5", 4]];
        fx.seq(self, { type: "square", vol: 0.05, beat, filter: { freq: 2000 } });
        for (let i = 0; i < 3; i++) fx.later(i * 250, () => fx.fly(mini(minis[i]), [-70, H() * 0.7], [W() + 70, H() * 0.66], { size: 60, h: 34, dur: 1800, via: [W() / 2, H() * 0.5], easing: "ease-in-out" }));
        await fx.wait(2400);
        fx.caption("(the bus teeters over the cliff edge, the gold at the back)", { style: "whisper", ms: 2200 });
        const bus = fx.put(A.S("0 0 160 60", '<rect x="4" y="10" width="152" height="40" rx="4" fill="#f4f0e6" ' + A.ink + ' stroke-width="2"/><rect x="120" y="26" width="30" height="20" fill="#e8b830"/>'), W() * 0.6, H() * 0.6, { size: 150, h: 56, style: { transformOrigin: "30% 100%" } });
        fx.move(bus, [{ transform: "rotate(0)" }, { transform: "rotate(8deg)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(6deg)" }], { duration: 1600, fill: "forwards" });
        fx.caption("Hang on a minute, lads. I've got a great idea.", { style: "subtitle", ms: 2000 });
        await fx.wait(2200);
      }
    },

    // National Lampoon's Animal House
    {
      id: 8469,
      y: 1978,
      run: async (fx) => {
        seventies(fx, 6600);
        const r = fx.rect(fx.slot());
        const toga = fx.costume(".reely", '<path d="M26 70 H94 L100 150 H20 Z" fill="#f4f2ec" stroke="#1f1b16" stroke-width="3"/><path d="M26 70 L94 140" stroke="#dcd8cc" stroke-width="6"/><path d="M40 30 C44 20 76 20 80 30" stroke="#3a7a2a" stroke-width="5" fill="none"/>', 6600);
        void toga;
        const beat = 0.2;
        fx.caption("TOGA! TOGA! TOGA!", { style: "hand", ms: 2400 });
        for (let i = 0; i < 6; i++) { fx.thud({ freq: 90, vol: 0.35, dur: 0.12, at: i * beat * 2 }); fx.tone(150, 0.2, { type: "sawtooth", vol: 0.05, at: i * beat * 2, filter: { freq: 700 } }); }
        await fx.wait(2600);
        fx.caption("(a zit is ready to pop)", { style: "whisper", ms: 1600 });
        await fx.wait(1400);
        const food = [A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#f4f0e6"/>'), A.S("0 0 20 20", '<rect x="2" y="6" width="16" height="8" fill="#d9a13a"/>'), A.S("0 0 20 20", '<circle cx="10" cy="10" r="8" fill="#d51f2a"/>')];
        fx.caption("Food fight!", { style: "hand", ms: 1600 });
        fx.particles({ kind: "burst", from: pt(r.x, r.y), count: 30, spread: 120, gravity: 60, glyphs: food, min: 10, max: 18, dur: 1200 });
        for (let i = 0; i < 12; i++) fx.noise(0.08, { type: "lowpass", freq: 600, vol: 0.2, at: i * 0.1 });
        await fx.wait(1600);
      }
    },

    // The Jerk
    {
      id: 6471,
      y: 1979,
      run: async (fx) => {
        seventies(fx, 6600);
        const items = ["This ashtray.", "And this paddle game.", "And this remote control.", "And these matches.", "And this lamp.", "…that's all I need."];
        const gear = [A.S("0 0 30 20", '<ellipse cx="15" cy="12" rx="12" ry="6" fill="#9aa2a6"/>'), A.S("0 0 30 30", '<circle cx="15" cy="10" r="8" fill="#c9a24a"/><path d="M15 18 V28" stroke="#8a6a3a" stroke-width="3"/>'), A.S("0 0 30 20", '<rect x="4" y="4" width="22" height="12" fill="#1d1a18"/>'), A.S("0 0 20 20", '<rect x="4" y="2" width="12" height="16" fill="#d51f2a"/>'), A.S("0 0 30 40", '<path d="M6 6 H24 L20 20 H10 Z" fill="#f2d33b"/><path d="M15 20 V38" stroke="#1d1a18" stroke-width="2"/>')];
        const reely = fx.$(".reely");
        const rr = fx.rect(reely);
        for (let i = 0; i < items.length; i++) {
          fx.caption(items[i], { style: "subtitle", ms: 900 });
          if (gear[i]) fx.put(gear[i], rr.x - 40 + i * 20, rr.y + 50, { size: 22, ms: 6000 - i * 900 });
          fx.click({ freq: 1400, vol: 0.2 });
          fx.move(reely, [{ transform: "none" }, { transform: "translateX(-" + i * 6 + "px)" }], { duration: 300, fill: "forwards" });
          await fx.wait(900);
        }
        await fx.wait(600);
      }
    },

    // The Hidden Fortress
    {
      id: 1059,
      y: 1958,
      run: async (fx) => {
        bw(fx, 7000);
        const peasants = [0, 1].map((i) => fx.put(A.S("0 0 30 50", '<circle cx="15" cy="8" r="6" fill="#3b3530"/><path d="M6 16 H24 L26 46 H4 Z" fill="#8a857a"/><path d="M4 18 L-6 30 M26 18 L36 26" stroke="#8a857a" stroke-width="3"/>'), W() * 0.3 + i * 40, H() * 0.72, { size: 28, h: 46 }));
        fx.caption("(two bickering peasants — told from their point of view)", { style: "whisper", ms: 2400 });
        for (let i = 0; i < 6; i++) {
          fx.move(peasants[i % 2], [{ transform: "none" }, { transform: "translateX(" + (i % 2 ? -8 : 8) + "px) rotate(" + (i % 2 ? -8 : 8) + "deg)" }, { transform: "none" }], 400);
          fx.tone(i % 2 ? 180 : 220, 0.3, { type: "sawtooth", vol: 0.04, filter: { type: "bandpass", freq: 700, q: 4 } });
          await fx.wait(450);
        }
        const gold = A.S("0 0 60 20", '<rect x="2" y="4" width="56" height="12" rx="2" fill="#8a6a3a" ' + A.ink + ' stroke-width="1.5"/><rect x="26" y="4" width="8" height="12" fill="#e8b830"/>');
        fx.caption("(gold hidden inside firewood)", { style: "whisper", ms: 1800 });
        fx.put(gold, W() / 2, H() * 0.5, { size: 60, h: 20, ms: 2000, style: { filter: "drop-shadow(0 0 6px #ffd23b)" } });
        fx.tone(2400, 0.4, { type: "sine", vol: 0.06 });
        await fx.wait(2200);
      }
    },

    // Harakiri
    {
      id: 14537,
      y: 1962,
      run: async (fx) => {
        bw(fx, 7400);
        fx.wash("rgba(255,255,255,.08)", 7400, {});
        const armor = fx.put(A.S("0 0 80 110", '<path d="M20 30 C20 10 60 10 60 30" fill="#3b3530" ' + A.ink + ' stroke-width="1.5"/><path d="M10 34 H70 L66 100 H14 Z" fill="#3b3530" ' + A.ink + ' stroke-width="1.5"/>' + Array.from({ length: 6 }, (_, i) => '<path d="M14 ' + (44 + i * 10) + ' H66" stroke="#6d6860" stroke-width="2"/>').join("") + '<path d="M26 14 L20 0 M54 14 L60 0" stroke="#c9a24a" stroke-width="3"/>'), W() / 2, H() * 0.4, { size: 100, h: 138 });
        void armor;
        fx.caption("(the empty suit of ancestral armour watches)", { style: "whisper", ms: 2400 });
        const biwa = (n, at) => { fx.tone(n, 1.2, { type: "triangle", vol: 0.1, at, attack: 0.002 }); fx.noise(0.05, { type: "highpass", freq: 3000, vol: 0.4, at }); };
        biwa("E3", 0.4); biwa("F3", 1.6); biwa("B2", 3); biwa("E3", 4.4);
        fx.tone(40, 6, { type: "sine", vol: 0.08, attack: 1 });
        await fx.wait(4200);
        fx.caption("(it is only a hollow thing)", { style: "whisper", ms: 2000 });
        await fx.move(armor, [{ transform: "none" }, { transform: "rotate(-40deg) translateY(40px)", opacity: 0.4 }], { duration: 1600, easing: "ease-in" });
        fx.thud({ vol: 0.5, freq: 80 });
        await fx.wait(600);
      }
    }
  ]);
})();
