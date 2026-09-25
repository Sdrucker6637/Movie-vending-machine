/* Machine FX cues - after hours: a few reactions that bring their own recordings.
   Keyed by TMDB movie id; see fx/engine.js for the cue format. Recorded clips
   live in fx/clips/<id>-<key>.mp3 (sources and licences: tools/clip-sources.json). */
(function () {
  "use strict";
  const M = window.MachineFX;
  if (!M || !M.art) return;
  const A = M.art;
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;
  const pt = (x, y, w, h) => ({ x, y, width: w || 0, height: h || 0 });
  const dot = (c) => '<div class="fx-dot" style="width:100%;height:100%;background:' + (c || "#fff") + '"></div>';
  // Each visit shows the next moment in turn.
  const turn = (fx, n) => ((fx.stats && fx.stats.adds) || 1) % n;

  const dragon = A.S("0 0 80 60", '<path d="M20 36 C18 22 32 14 44 18 C52 10 64 12 66 22 L74 20 L70 28 C72 38 62 46 50 44 L46 54 L42 44 C34 48 22 46 20 36 Z" fill="#c9a26b" ' + A.ink + ' stroke-width="2"/><path d="M40 22 C30 8 18 10 14 18 C22 16 28 20 34 26 Z" fill="#e8c890" ' + A.ink + ' stroke-width="1.5"/><circle cx="60" cy="22" r="2.5" fill="#1d1a18"/><path d="M20 36 C10 38 6 46 2 44" stroke="#c9a26b" stroke-width="4" fill="none" stroke-linecap="round"/>');
  const blade = A.S("0 0 30 120", '<path d="M15 4 L21 80 H9 Z" fill="#dfe6ea" ' + A.ink + ' stroke-width="1.5"/><path d="M2 80 H28 V86 H2 Z" fill="#6b4a2a" ' + A.ink + ' stroke-width="1.5"/><rect x="11" y="86" width="8" height="28" fill="#3b3530"/>');
  const hand = A.S("0 0 70 40", '<path d="M68 22 H30 C24 22 22 16 26 12 H36 L30 6 C28 2 34 0 38 4 L50 14 H68 Z" fill="#f2d6b3" ' + A.ink + ' stroke-width="2"/><path d="M26 22 C20 22 18 30 24 32 H40" fill="none" ' + A.ink + ' stroke-width="2"/>');
  const gear = (c) => A.S("0 0 100 100", '<circle cx="50" cy="50" r="30" fill="' + c + '" ' + A.ink + ' stroke-width="3"/><circle cx="50" cy="50" r="10" fill="#1d1a18"/>' +
    Array.from({ length: 10 }, (_, i) => '<rect x="45" y="6" width="10" height="16" fill="' + c + '" ' + A.ink + ' stroke-width="2.5" transform="rotate(' + i * 36 + ' 50 50)"/>').join(""));
  const phone = A.S("0 0 60 50", '<path d="M6 20 C6 8 54 8 54 20 L48 24 H12 Z" fill="#1d1a18"/><rect x="14" y="24" width="32" height="22" rx="4" fill="#b3402d" ' + A.ink + ' stroke-width="2"/><circle cx="30" cy="35" r="6" fill="#f4efe2"/>');
  const claw = A.S("0 0 90 110", '<rect x="38" y="0" width="14" height="56" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><circle cx="45" cy="60" r="10" fill="#6d7478" ' + A.ink + ' stroke-width="2"/><path d="M38 64 L14 90 L24 108 M52 64 L76 90 L66 108 M45 70 V100" fill="none" stroke="#9aa2a6" stroke-width="8" stroke-linecap="round"/>');
  const robotHand = A.S("0 0 60 80", '<rect x="18" y="40" width="24" height="38" rx="4" fill="#9aa2a6" ' + A.ink + ' stroke-width="2"/><path d="M16 42 V14 M26 40 V6 M36 40 V8 M46 44 V18" stroke="#9aa2a6" stroke-width="8" stroke-linecap="round"/><path d="M16 42 V14 M26 40 V6 M36 40 V8 M46 44 V18" stroke="#1d1a18" stroke-width="1.5" stroke-dasharray="5 7"/>');

  M.register([
    // Sintel
    {
      id: 45745,
      y: 2010,
      clips: ["dragon", "cry", "gate", "blade", "alone"],
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.75) brightness(.95)", 6800, { fade: 400 });
        fx.wash("linear-gradient(rgba(210,225,240,.35), rgba(120,140,170,.35))", 6800, { fade: 500 });
        fx.particles({ kind: "fall", count: 40, glyphs: A.snowflake, min: 4, max: 9, dur: 4200, stagger: 5200 });
        fx.sfx("wind", { dur: 6, vol: 0.35 });
        const v = turn(fx, 4);
        if (v === 1) {
          // the machine coughs something up... and it's alive
          fx.sfxSeq([["motor", 300, { dur: 0.8, vol: 0.5 }], ["clunk", 1100, { vol: 0.6 }]]);
          await fx.wait(1100);
          fx.move(fx.$(".machine"), [{ transform: "none" }, { transform: "translateY(3px)" }, { transform: "none" }], 200);
          fx.sfx("clip:dragon", { fallback: "chime" });
          await fx.wait(1500);
          const d = fx.put(dragon, r.x, r.y + r.height * 0.4, { size: 60, h: 45 });
          fx.move(d, [{ transform: "scale(.2)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 500, fill: "forwards" });
          fx.sfx("clip:cry", { at: 350, fallback: "squeak" });
          await fx.wait(700);
          fx.move(d, [{ transform: "translateY(0)" }, { transform: "translateY(-6px) rotate(-6deg)" }, { transform: "translateY(0)" }], { duration: 500, iterations: 4 });
          await fx.wait(2600);
        } else if (v === 2) {
          // a question from the gatekeeper
          const gate = fx.put(A.S("0 0 160 120", '<path d="M10 120 V40 C10 10 150 10 150 40 V120 H120 V50 C120 30 40 30 40 50 V120 Z" fill="#8a857a" ' + A.ink + ' stroke-width="3"/>'), W() / 2, H() * 0.42, { size: 170, h: 128, style: { opacity: 0 } });
          fx.anim(gate, [{ opacity: 0 }, { opacity: 0.9 }], { duration: 900, fill: "forwards" });
          fx.sfx("clip:gate", { at: 500, fallback: "suspense" });
          await fx.wait(5000);
        } else if (v === 3) {
          // a blade with a history
          fx.sfx("swish", { vol: 0.7 });
          const b = fx.put(blade, W() / 2, H() * 0.4, { size: 30, h: 120 });
          fx.move(b, [{ transform: "rotate(-40deg) scale(.6)", opacity: 0 }, { transform: "rotate(0) scale(1)", opacity: 1 }], { duration: 500, fill: "forwards" });
          fx.later(600, () => A.sparkleOn(fx, b, 6, "#fff"));
          fx.sfx("clip:blade", { at: 700, fallback: "sting" });
          await fx.wait(4300);
        } else {
          // one small figure against the snow
          fx.sfx("clip:alone", { at: 600, fallback: "air" });
          const s = fx.slot();
          if (s) fx.style(s, { filter: "grayscale(.6) brightness(.9)" }, 4200);
          await fx.wait(4800);
        }
      }
    },

    // Elephants Dream
    {
      id: 9761,
      y: 2006,
      clips: ["left", "safe", "attention", "pulp"],
      run: async (fx) => {
        fx.filter("saturate(.8) sepia(.25) contrast(1.05)", 7000, { fade: 400 });
        fx.wash("radial-gradient(circle, transparent 35%, rgba(30,20,10,.55))", 7000, { fade: 400 });
        const g1 = fx.put(gear("#8e969a"), W() * 0.15, H() * 0.2, { size: 110 });
        const g2 = fx.put(gear("#6d7478"), W() * 0.85, H() * 0.75, { size: 90 });
        fx.move(g1, [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], { duration: 6000, easing: "linear" });
        fx.move(g2, [{ transform: "rotate(0)" }, { transform: "rotate(-360deg)" }], { duration: 5000, easing: "linear" });
        fx.sfx("hum", { dur: 6.5, vol: 0.35, fadeIn: 500 });
        const v = turn(fx, 4);
        if (v === 1) {
          // the guided tour
          fx.sfx("relay", { vol: 0.6 });
          const h = fx.put(hand, W() * 0.62, H() * 0.42, { size: 70, h: 40 });
          fx.sfx("clip:left", { at: 400, fallback: "blip" });
          fx.later(400, () => fx.move(h, [{ transform: "none" }, { transform: "translateX(-" + W() * 0.3 + "px)" }], { duration: 1600, fill: "forwards", easing: "ease-in-out" }));
          fx.later(900, () => fx.otherSlots(true).filter((s) => fx.rect(s).x < W() / 2).forEach((s) => fx.style(s, { boxShadow: "0 0 0 3px #ffe07a" }, 1800)));
          await fx.wait(4400);
        } else if (v === 2) {
          // perfectly safe
          fx.sfx("clip:safe", { at: 300, fallback: "confirm" });
          await fx.wait(2900);
          fx.sfxSeq([["clunk", 0, { vol: 0.7 }], ["hit", 150, { vol: 0.6 }]]);
          fx.shake("md", 500);
          fx.move(fx.slot(), [{ transform: "none" }, { transform: "rotate(-4deg) translateY(4px)" }, { transform: "none" }], { duration: 500, fill: "none" });
          await fx.wait(1300);
        } else if (v === 3) {
          // something more interesting than the machine
          const p = fx.put(phone, W() * 0.75, H() * 0.3, { size: 60, h: 50 });
          fx.sfx("ring", { dur: 1.1, vol: 0.7 });
          fx.move(p, [{ transform: "rotate(-8deg)" }, { transform: "rotate(8deg)" }], { duration: 90, iterations: 12, direction: "alternate" });
          await fx.wait(1300);
          fx.sfx("clip:attention", { fallback: "error" });
          fx.later(200, () => fx.remove(p));
          await fx.wait(3000);
        } else {
          // the machine's opinion of mistakes
          fx.sfx("motor-strain", { dur: 1.2, vol: 0.6 });
          fx.move([g1, g2], [{ transform: "rotate(0)" }, { transform: "rotate(20deg)" }, { transform: "rotate(-10deg)" }], { duration: 1200 });
          fx.sfx("clip:pulp", { at: 1200, fallback: "hit" });
          await fx.wait(5800);
        }
      }
    },

    // Tears of Steel
    {
      id: 133701,
      y: 2012,
      clips: ["jerk", "freaked"],
      run: async (fx) => {
        const r = fx.rect(fx.slot());
        fx.filter("saturate(.7) contrast(1.15)", 6400, { fade: 300 });
        fx.wash("linear-gradient(rgba(40,70,90,.3), rgba(10,20,30,.45))", 6400, { fade: 400 });
        if (turn(fx, 2) === 1) {
          // a farewell on a bridge
          fx.sfx("clip:jerk", { at: 400, fallback: "error" });
          const h = fx.put(robotHand, r.x + r.width * 0.6, r.y + r.height * 0.1, { size: 44, h: 60 });
          fx.move(h, [{ transform: "rotate(-12deg)" }, { transform: "rotate(12deg)" }], { duration: 300, iterations: 8, direction: "alternate" });
          fx.later(400, () => fx.sfx("whir", { vol: 0.5, rate: 0.8 }));
          await fx.wait(3600);
          fx.sfx("sting", { vol: 0.5 });
          fx.style(fx.slot(), { filter: "grayscale(1)" }, 1600);
          await fx.wait(1600);
        } else {
          // the recurring nightmare
          const c = fx.put(claw, W() / 2, -70, { size: 90, h: 110 });
          fx.sfx("motor", { dur: 1.2, vol: 0.55 });
          await fx.move(c, [{ transform: "none" }, { transform: "translateY(" + (r.top + 30) + "px)" }], { duration: 1200, fill: "forwards", easing: "ease-in" });
          fx.sfx("clunk", { vol: 0.7 });
          fx.shake("sm", 300);
          fx.sfx("clip:freaked", { at: 250, fallback: "sting" });
          fx.later(250, () => fx.move(fx.$(".reely"), [{ transform: "none" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "none" }], { duration: 250, iterations: 3 }));
          await fx.wait(2600);
          fx.particles({ kind: "burst", from: pt(W() / 2, r.top + 90), count: 10, spread: 40, glyphs: dot("#9aa2a6"), min: 3, max: 6, dur: 700 });
          await fx.wait(900);
        }
      }
    }
  ]);
})();
