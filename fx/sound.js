/* =========================================================
   Machine sound
   ---------------------------------------------------------
   The one audio system for the machine's reactions. Every sound is
   synthesized with the Web Audio API on demand - there are no audio
   files to download.

     MachineSound.play(name, opts)  -> handle { stop(ms) }
       opts.vol     relative volume (default 1, ~0..1.5)
       opts.pan     -1..1
       opts.dur     seconds, for sounds with a length (motors, loops...)
       opts.fadeIn  ms
       opts.rate    pitch multiplier for most sounds
     MachineSound.stopAll(ms)
     MachineSound.isEnabled() / setEnabled(bool) / onChange(fn)

   Cues don't call this directly - they use fx.sfx()/fx.sfxSeq() from
   the engine, which ties every sound to the cue's lifetime.

   Browser rules this is built around:
     - Nothing is created before the first tap/key. The AudioContext
       is created and resumed inside a real user gesture (and a silent
       buffer is played there, which is what finally unlocks iOS).
     - If the context is suspended/interrupted when a sound is asked
       for, one resume is attempted; if that doesn't succeed quickly
       the sound is dropped rather than queued up for later.
     - On iOS the session is "ambient": it mixes with other audio and
       honours the ring/silent switch.
     - Every failure is swallowed; no audio simply means silence.
   ========================================================= */
(function () {
  "use strict";

  const PREF_KEY = "mvm-sound";
  const MASTER = 0.45;          // overall level for every reaction sound
  const MAX_VOICES = 6;         // simultaneous sounds before new ones are dropped
  const MAX_LOOP_S = 12;        // no loop outlives this, whatever happens
  const RESUME_GRACE_MS = 600;  // how long a suspended context gets to wake up
  const IDLE_SUSPEND_MS = 25000;
  const RETRIGGER_MS = 40;      // same sound twice within this = once

  let ctx = null;
  let bus = null;
  let enabled = readPref();
  let idleTimer = 0;
  const voices = new Set();
  const lastPlayed = {};
  const listeners = new Set();
  const buffers = {};
  const NOOP = { stop() {}, get playing() { return false; } };

  function readPref() {
    try {
      return localStorage.getItem(PREF_KEY) !== "off";
    } catch (e) {
      return true;
    }
  }
  function writePref(on) {
    try {
      localStorage.setItem(PREF_KEY, on ? "on" : "off");
    } catch (e) {}
  }

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      try {
        if (navigator.audioSession && navigator.audioSession.type === "auto") navigator.audioSession.type = "ambient";
      } catch (e) {}
      ctx = new AC();
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 6;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.003;
      limiter.release.value = 0.2;
      bus = ctx.createGain();
      bus.gain.value = MASTER;
      bus.connect(limiter);
      limiter.connect(ctx.destination);
    } catch (e) {
      ctx = null;
      bus = null;
    }
    return ctx;
  }

  function resume() {
    try {
      if (ctx && ctx.state !== "running" && ctx.state !== "closed") {
        const p = ctx.resume();
        if (p && p.catch) p.catch(() => {});
        return p;
      }
    } catch (e) {}
    return null;
  }

  // Called from real user gestures only.
  function unlock() {
    if (!enabled) return;
    if (!ensureCtx()) return;
    // iOS only unlocks from touchend/click (not touchstart), and wants a
    // sound started inside that gesture - so keep doing both until the
    // context is actually running.
    if (ctx.state !== "running") {
      resume();
      try {
        const s = ctx.createBufferSource();
        s.buffer = ctx.createBuffer(1, 1, 22050);
        s.connect(ctx.destination);
        s.start(0);
      } catch (e) {}
    }
    armIdle();
  }
  ["pointerdown", "touchend", "mousedown", "click", "keydown"].forEach((ev) =>
    document.addEventListener(ev, unlock, { capture: true, passive: true })
  );

  // A running context keeps the audio hardware awake; let it sleep when
  // nothing has played for a while. The next tap wakes it again.
  function armIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (ctx && !voices.size && ctx.state === "running") {
        try { ctx.suspend().catch(() => {}); } catch (e) {}
      }
    }, IDLE_SUSPEND_MS);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAll(30);
  });

  // ---------- building blocks ----------
  const rnd = (a, b) => a + Math.random() * (b - a);

  function noiseBuffer() {
    return buffers.noise || (buffers.noise = makeBuffer(2, (d) => {
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }));
  }
  function makeBuffer(seconds, fill) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    fill(b.getChannelData(0), ctx.sampleRate);
    return b;
  }
  // A short decaying noise burst written into d at sample i.
  function burst(d, i, len, amp) {
    for (let k = 0; k < len && i + k < d.length; k++) d[i + k] += (Math.random() * 2 - 1) * amp * Math.pow(1 - k / len, 3);
  }
  const LOOPS = {
    // one frame pair at ~24fps: shutter clack + claw tick
    projector: () => makeBuffer(1 / 12, (d, sr) => {
      burst(d, 0, Math.floor(sr * 0.012), 0.9);
      burst(d, Math.floor(sr / 24), Math.floor(sr * 0.008), 0.45);
    }),
    // the tail of a film strip slapping the reel
    flap: () => makeBuffer(1 / 14, (d, sr) => burst(d, 0, Math.floor(sr * 0.018), 0.9)),
    // sparse dust-and-scratch crackle
    crackle: () => makeBuffer(2.3, (d, sr) => {
      for (let n = 0; n < 60; n++) burst(d, Math.floor(Math.random() * d.length), Math.floor(sr * rnd(0.0005, 0.003)), rnd(0.2, 1));
    })
  };
  function loopBuffer(name) {
    return buffers[name] || (buffers[name] = LOOPS[name]());
  }

  function env(g, t, a, vol, end, hold) {
    vol = Math.max(0.0002, vol);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + a);
    if (hold) g.gain.setValueAtTime(vol, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, Math.max(t + a + (hold || 0) + 0.01, end));
  }
  // Frequency shape: [[secondsFromT, hz], ...] joined by ramps.
  function shape(param, t, pts, expo) {
    param.setValueAtTime(pts[0][1], t + pts[0][0]);
    for (let i = 1; i < pts.length; i++) {
      const v = Math.max(1, pts[i][1]);
      if (expo) param.exponentialRampToValueAtTime(v, t + pts[i][0]);
      else param.linearRampToValueAtTime(v, t + pts[i][0]);
    }
  }

  // Everything a recipe needs, wired into one voice.
  function kit(v, rate) {
    rate = rate || 1;
    function filterize(node, o, t, dur) {
      if (!o.filter) return node;
      const f = ctx.createBiquadFilter();
      f.type = o.filter.type || "lowpass";
      f.Q.value = o.filter.q || 1;
      if (o.filter.pts) shape(f.frequency, t, o.filter.pts, true);
      else {
        f.frequency.setValueAtTime(o.filter.f || 1200, t);
        if (o.filter.to) f.frequency.exponentialRampToValueAtTime(o.filter.to, t + dur);
      }
      if (o.filter.lfo) lfo(f.frequency, t, dur, o.filter.lfo);
      node.connect(f);
      return f;
    }
    function lfo(param, t, dur, spec) {
      const l = ctx.createOscillator();
      const lg = ctx.createGain();
      l.frequency.value = spec[0];
      lg.gain.value = spec[1];
      l.connect(lg);
      lg.connect(param);
      l.start(t);
      l.stop(t + dur + 0.05);
      v.srcs.push(l);
    }
    function trem(node, t, dur, spec) {
      const g = ctx.createGain();
      g.gain.value = 1 - spec[1] / 2;
      lfo(g.gain, t, dur, [spec[0], spec[1] / 2]);
      node.connect(g);
      return g;
    }
    return {
      t: v.t0,
      rnd,
      osc(type, hz, t, dur, o) {
        o = o || {};
        const s = ctx.createOscillator();
        s.type = type;
        if (o.pts) shape(s.frequency, t, o.pts.map((p) => [p[0], p[1] * rate]), o.expo !== false);
        else {
          s.frequency.setValueAtTime(hz * rate, t);
          if (o.to) s.frequency.exponentialRampToValueAtTime(Math.max(20, o.to * rate), t + (o.slide || dur));
        }
        if (o.detune) s.detune.value = o.detune;
        if (o.lfo) lfo(s.frequency, t, dur, o.lfo);
        const g = ctx.createGain();
        env(g, t, o.a || 0.004, o.vol == null ? 0.4 : o.vol, t + dur, o.hold);
        s.connect(g);
        let out = filterize(g, o, t, dur);
        if (o.trem) out = trem(out, t, dur, o.trem);
        out.connect(v.out);
        s.start(t);
        s.stop(t + dur + 0.05);
        v.srcs.push(s);
      },
      noise(t, dur, o) {
        o = o || {};
        const s = ctx.createBufferSource();
        s.buffer = o.buffer ? loopBuffer(o.buffer) : noiseBuffer();
        s.loop = true;
        if (o.rate) shape(s.playbackRate, t, o.rate);
        const g = ctx.createGain();
        env(g, t, o.a || 0.003, o.vol == null ? 0.3 : o.vol, t + dur, o.hold);
        s.connect(g);
        let out = filterize(g, o, t, dur);
        if (o.trem) out = trem(out, t, dur, o.trem);
        out.connect(v.out);
        s.start(t, o.buffer ? 0 : Math.random());
        s.stop(t + dur + 0.05);
        v.srcs.push(s);
      }
    };
  }

  // ---------- the sound library ----------
  // Each recipe schedules its sound from k.t and returns its length (s).
  const bp = (f, q) => ({ type: "bandpass", f, q: q || 1 });
  const lp = (f, to) => ({ type: "lowpass", f, to });
  const hp = (f) => ({ type: "highpass", f });
  const len = (o, d) => Math.min(MAX_LOOP_S, Math.max(0.05, (o && o.dur) || d));
  function clickAt(k, t, f, vol) {
    k.noise(t, 0.03, { filter: bp(f || 3800, 3), vol: vol || 0.5 });
  }
  function holdFor(d, a, r) {
    return Math.max(0, d - a - r);
  }

  const R = {
    // --- the machine itself ---
    click(k) {
      clickAt(k, k.t, 3800, 0.75);
      k.osc("square", 1900, k.t, 0.012, { vol: 0.06 });
      return 0.05;
    },
    relay(k) {
      clickAt(k, k.t, 1800, 0.8);
      clickAt(k, k.t + 0.045, 2500, 0.55);
      return 0.1;
    },
    clunk(k) {
      k.osc("sine", 120, k.t, 0.3, { to: 45, vol: 0.8 });
      k.osc("triangle", 240, k.t, 0.12, { to: 110, vol: 0.2 });
      k.noise(k.t, 0.14, { filter: lp(500), vol: 0.5 });
      k.osc("triangle", 640, k.t, 0.18, { vol: 0.1 });
      return 0.34;
    },
    coin(k) {
      [0, 0.07].forEach((d, i) => {
        k.osc("sine", 2637, k.t + d, 0.45, { vol: i ? 0.12 : 0.22, a: 0.002 });
        k.osc("sine", 3951, k.t + d, 0.3, { vol: i ? 0.06 : 0.1, a: 0.002 });
      });
      return 0.55;
    },
    "coin-drop"(k, o) {
      const n = (o && o.n) || 6;
      let t = k.t;
      for (let i = 0; i < n; i++) {
        k.osc("sine", rnd(2500, 3400), t, 0.07, { vol: 0.2 * (1 - i / (n + 2)), a: 0.001 });
        k.noise(t, 0.02, { filter: bp(5200, 2), vol: 0.18 });
        t += o && o.every ? o.every : 0.09 * Math.pow(0.8, i);
      }
      k.noise(t, 0.14, { filter: bp(3000, 1), vol: 0.2 });
      return t - k.t + 0.16;
    },
    motor(k, o) {
      const d = len(o, 1.2);
      const pts = [[0, 50], [d * 0.35, 150], [d * 0.7, 150], [d, 45]];
      k.osc("sawtooth", 50, k.t, d, { pts, expo: false, a: 0.08, hold: holdFor(d, 0.08, 0.15), vol: 0.3, filter: lp(900), trem: [18, 0.3] });
      k.noise(k.t, d, { a: 0.08, hold: holdFor(d, 0.08, 0.15), vol: 0.1, filter: bp(700, 1) });
      return d;
    },
    "motor-strain"(k, o) {
      const d = len(o, 1.6);
      const pts = [[0, 70], [d * 0.2, 95], [d * 0.35, 58], [d * 0.5, 84], [d * 0.7, 50], [d, 28]];
      k.osc("sawtooth", 70, k.t, d, { pts, expo: false, a: 0.05, hold: holdFor(d, 0.05, 0.2), vol: 0.32, filter: lp(650), lfo: [7, 6] });
      k.noise(k.t, d, { a: 0.05, hold: holdFor(d, 0.05, 0.2), vol: 0.14, filter: bp(1100, 3), trem: [11, 0.8] });
      return d;
    },
    whir(k) {
      k.osc("sawtooth", 260, k.t, 0.38, { to: 620, vol: 0.4, a: 0.03, filter: bp(900, 3) });
      return 0.4;
    },
    hum(k, o) {
      const d = len(o, MAX_LOOP_S);
      const a = 0.3;
      k.osc("sine", 60, k.t, d, { a, hold: holdFor(d, a, 0.2), vol: 0.3 });
      k.osc("sine", 120, k.t, d, { a, hold: holdFor(d, a, 0.2), vol: 0.14 });
      k.osc("sawtooth", 180, k.t, d, { a, hold: holdFor(d, a, 0.2), vol: 0.07, filter: lp(700) });
      return d;
    },
    "power-down"(k) {
      k.osc("sawtooth", 440, k.t, 0.9, { to: 40, vol: 0.2, filter: { type: "lowpass", f: 1600, to: 200 } });
      k.osc("sine", 60, k.t, 0.6, { vol: 0.2 });
      return 0.95;
    },
    "power-up"(k) {
      k.osc("sawtooth", 40, k.t, 0.75, { to: 440, vol: 0.18, a: 0.2, filter: { type: "lowpass", f: 200, to: 1800 } });
      return 0.8;
    },

    // --- electronics ---
    beep(k, o) {
      const n = (o && o.n) || 1;
      const hz = (o && o.hz) || 1320;
      for (let i = 0; i < n; i++) k.osc("sine", hz, k.t + i * 0.18, 0.13, { a: 0.003, hold: 0.08, vol: 0.28 });
      return n * 0.18;
    },
    error(k) {
      k.osc("square", 520, k.t, 0.16, { hold: 0.1, vol: 0.14, filter: lp(2000) });
      k.osc("square", 370, k.t + 0.19, 0.28, { hold: 0.16, vol: 0.14, filter: lp(2000) });
      return 0.5;
    },
    confirm(k) {
      k.osc("sine", 880, k.t, 0.1, { hold: 0.05, vol: 0.25 });
      k.osc("sine", 1320, k.t + 0.1, 0.2, { hold: 0.06, vol: 0.25 });
      return 0.32;
    },
    zap(k) {
      k.osc("sawtooth", 90, k.t, 0.28, { lfo: [55, 400], vol: 0.22, filter: lp(3000) });
      k.noise(k.t, 0.22, { filter: hp(2500), vol: 0.3, trem: [40, 0.9] });
      return 0.3;
    },
    glitch(k, o) {
      const n = (o && o.n) || 8;
      let t = k.t;
      for (let i = 0; i < n; i++) {
        const d = rnd(0.015, 0.045);
        if (Math.random() < 0.6) k.osc("square", rnd(180, 2400), t, d, { vol: 0.15, a: 0.001 });
        else k.noise(t, d, { filter: bp(rnd(800, 6000), 2), vol: 0.45 });
        t += d + rnd(0, 0.035);
      }
      return t - k.t + 0.05;
    },
    static(k, o) {
      const d = len(o, 0.45);
      k.noise(k.t, d, { a: 0.01, hold: holdFor(d, 0.01, 0.1), vol: 0.26, filter: hp(1400), trem: [rnd(30, 60), 0.5] });
      k.noise(k.t, Math.min(0.12, d), { filter: bp(6000, 1), vol: 0.15 });
      return d;
    },
    "crt-on"(k) {
      k.osc("sine", 70, k.t, 0.4, { to: 35, vol: 0.6 });
      k.noise(k.t, 0.1, { filter: lp(900), vol: 0.3 });
      k.osc("sine", 7800, k.t, 0.9, { vol: 0.02, a: 0.05 });
      k.noise(k.t + 0.05, 0.5, { filter: hp(2000), vol: 0.12 });
      return 1;
    },
    "crt-off"(k) {
      k.osc("sine", 1400, k.t, 0.22, { to: 60, vol: 0.22 });
      clickAt(k, k.t + 0.22, 2000, 0.4);
      return 0.28;
    },

    // --- tape ---
    "tape-stop"(k, o) {
      const d = len(o, 0.8);
      k.osc("sawtooth", 220, k.t, d, { to: 30, vol: 0.25, hold: d * 0.4, filter: { type: "lowpass", f: 1200, to: 150 } });
      k.osc("sawtooth", 330, k.t, d, { to: 45, vol: 0.12, hold: d * 0.4, filter: { type: "lowpass", f: 1200, to: 150 } });
      k.noise(k.t, d, { vol: 0.06, filter: lp(600) });
      return d;
    },
    "tape-whir"(k, o) {
      const d = len(o, 1);
      k.noise(k.t, d, { a: 0.05, hold: holdFor(d, 0.05, 0.1), vol: 0.32, filter: { type: "bandpass", f: 900, to: 2400, q: 2 }, trem: [30, 0.3] });
      k.osc("sine", 1800, k.t, d, { to: 3200, vol: 0.025, a: 0.1 });
      return d;
    },
    "tape-insert"(k) {
      k.noise(k.t, 0.05, { filter: bp(1400, 1), vol: 0.7 });
      k.noise(k.t + 0.05, 0.08, { filter: lp(600), vol: 0.5 });
      k.osc("sawtooth", 110, k.t + 0.2, 0.5, { to: 140, vol: 0.18, a: 0.05, filter: lp(500) });
      clickAt(k, k.t + 0.75, 2600, 0.3);
      return 0.85;
    },
    "vhs-hiss"(k, o) {
      const d = len(o, MAX_LOOP_S);
      k.noise(k.t, d, { a: 0.2, hold: holdFor(d, 0.2, 0.2), vol: 0.08, filter: hp(3500) });
      k.osc("sine", 60, k.t, d, { a: 0.2, hold: holdFor(d, 0.2, 0.2), vol: 0.035 });
      return d;
    },

    // --- film ---
    projector(k, o) {
      const d = len(o, MAX_LOOP_S);
      k.noise(k.t, d, { buffer: "projector", a: 0.15, hold: holdFor(d, 0.15, 0.2), vol: 0.5, filter: bp(2200, 0.7) });
      k.osc("sawtooth", 48, k.t, d, { a: 0.2, hold: holdFor(d, 0.2, 0.2), vol: 0.1, filter: lp(250) });
      return d;
    },
    "reel-flap"(k, o) {
      const d = len(o, 1.4);
      k.noise(k.t, d, { buffer: "flap", rate: [[0, 1.4], [d, 0.5]], hold: holdFor(d, 0.003, 0.15), vol: 0.8, filter: bp(1800, 0.8) });
      return d;
    },
    crackle(k, o) {
      const d = len(o, MAX_LOOP_S);
      k.noise(k.t, d, { buffer: "crackle", a: 0.2, hold: holdFor(d, 0.2, 0.2), vol: 0.35, filter: hp(800) });
      return d;
    },
    scratch(k) {
      const pts = [[0, 500], [0.12, 2600], [0.22, 700], [0.34, 2200], [0.45, 400]];
      k.noise(k.t, 0.45, { vol: 0.45, a: 0.01, hold: 0.3, filter: { type: "bandpass", pts, q: 4 } });
      k.osc("sawtooth", 170, k.t, 0.45, { pts: pts.map((p) => [p[0], p[1] / 3]), vol: 0.08, hold: 0.3, filter: lp(1600) });
      return 0.47;
    },

    // --- drama ---
    sting(k) {
      [130.8, 138.6, 196, 261.6, 277.2].forEach((hz, i) =>
        k.osc("sawtooth", hz, k.t, 1.1, { detune: i * 3, vol: 0.1, a: 0.01, filter: { type: "lowpass", f: 2400, to: 500 } })
      );
      k.osc("sine", 55, k.t, 0.8, { to: 30, vol: 0.6 });
      k.noise(k.t, 0.25, { filter: lp(1200), vol: 0.25 });
      return 1.15;
    },
    boom(k) {
      k.osc("sine", 62, k.t, 1, { to: 28, vol: 0.85 });
      k.osc("triangle", 180, k.t, 0.35, { to: 70, vol: 0.2 });
      k.noise(k.t, 0.6, { filter: lp(600), vol: 0.45 });
      return 1.05;
    },
    hit(k) {
      k.osc("sine", 150, k.t, 0.22, { to: 48, vol: 0.8 });
      k.noise(k.t, 0.1, { filter: bp(1400, 0.8), vol: 0.45 });
      return 0.25;
    },
    suspense(k, o) {
      const d = len(o, 2);
      [73.4, 77.8, 110].forEach((hz) =>
        k.osc("sawtooth", hz, k.t, d, { a: d * 0.8, vol: 0.11, filter: { type: "lowpass", f: 200, to: 900 } })
      );
      return d;
    },
    drone(k, o) {
      const d = len(o, MAX_LOOP_S);
      const a = Math.min(1, d / 3);
      k.osc("sawtooth", 55, k.t, d, { a, hold: holdFor(d, a, 0.3), vol: 0.12, filter: { type: "lowpass", f: 320, q: 3 }, trem: [0.3, 0.4] });
      k.osc("sawtooth", 58.3, k.t, d, { a, hold: holdFor(d, a, 0.3), vol: 0.12, filter: { type: "lowpass", f: 320, q: 3 } });
      k.osc("sine", 27.5, k.t, d, { a, hold: holdFor(d, a, 0.3), vol: 0.2 });
      return d;
    },
    air(k, o) {
      const d = len(o, 1.6);
      k.noise(k.t, d, { a: 0.3, hold: holdFor(d, 0.3, 0.3), vol: 0.34, filter: bp(2600, 6), trem: [3, 0.8] });
      k.noise(k.t, d, { a: 0.3, hold: holdFor(d, 0.3, 0.3), vol: 0.24, filter: bp(900, 5), trem: [4.3, 0.7] });
      return d;
    },
    heartbeat(k, o) {
      const n = (o && o.n) || 2;
      for (let i = 0; i < n; i++) {
        k.osc("sine", 60, k.t + i * 0.85, 0.16, { to: 40, vol: 0.9 });
        k.osc("triangle", 150, k.t + i * 0.85, 0.08, { to: 90, vol: 0.18 });
        k.osc("sine", 55, k.t + i * 0.85 + 0.2, 0.14, { to: 38, vol: 0.7 });
        k.osc("triangle", 140, k.t + i * 0.85 + 0.2, 0.07, { to: 85, vol: 0.13 });
      }
      return n * 0.85;
    },

    // --- comedy ---
    pop(k) {
      k.osc("sine", 380, k.t, 0.05, { to: 1200, vol: 0.45, a: 0.002 });
      k.noise(k.t, 0.02, { filter: hp(3000), vol: 0.3 });
      return 0.08;
    },
    squeak(k) {
      k.osc("sine", 1300, k.t, 0.18, { pts: [[0, 1300], [0.06, 1900], [0.14, 1250]], lfo: [25, 40], vol: 0.16 });
      return 0.2;
    },
    boing(k) {
      k.osc("sine", 170, k.t, 0.6, { to: 250, lfo: [14, 60], vol: 0.32 });
      k.osc("triangle", 340, k.t, 0.4, { vol: 0.06 });
      return 0.6;
    },
    "slide-whistle"(k, o) {
      const down = o && o.down;
      k.osc("sine", down ? 1500 : 520, k.t, 0.55, { to: down ? 520 : 1500, lfo: [6, 12], a: 0.03, vol: 0.16 });
      return 0.6;
    },

    // --- movement & impact ---
    whoosh(k, o) {
      const d = len(o, 0.5);
      k.noise(k.t, d, { a: d * 0.45, vol: 0.45, filter: { type: "bandpass", q: 1.2, pts: [[0, 350], [d * 0.55, 2200], [d, 500]] } });
      return d;
    },
    swish(k) {
      k.noise(k.t, 0.22, { a: 0.09, vol: 0.4, filter: { type: "bandpass", q: 1.5, pts: [[0, 1200], [0.12, 4500], [0.22, 1500]] } });
      return 0.23;
    },
    crack(k) {
      k.noise(k.t, 0.12, { filter: hp(900), vol: 0.55, a: 0.001 });
      k.osc("sine", 110, k.t, 0.25, { to: 45, vol: 0.45 });
      k.noise(k.t, 0.5, { filter: lp(700), vol: 0.12 });
      return 0.5;
    },
    thunder(k) {
      k.noise(k.t, 0.3, { filter: lp(1600), vol: 0.5 });
      k.noise(k.t, 2.2, { a: 0.05, vol: 0.8, filter: { type: "lowpass", f: 400, to: 120 }, trem: [7, 0.5] });
      return 2.2;
    },
    wind(k, o) {
      const d = len(o, 3);
      k.noise(k.t, d, { a: Math.min(0.8, d / 3), hold: holdFor(d, Math.min(0.8, d / 3), 0.5), vol: 0.42, filter: { type: "bandpass", f: 600, q: 2, lfo: [0.4, 300] } });
      return d;
    },
    splash(k) {
      k.noise(k.t, 0.5, { vol: 0.45, filter: { type: "lowpass", f: 1600, to: 400 } });
      for (let i = 0; i < 4; i++) {
        const hz = rnd(600, 1200);
        k.osc("sine", hz, k.t + 0.1 + i * 0.07, 0.06, { to: hz * 1.8, vol: 0.08 });
      }
      return 0.55;
    },
    drip(k) {
      k.osc("sine", 1800, k.t, 0.08, { to: 700, vol: 0.18, a: 0.002 });
      return 0.1;
    },

    // --- odds and ends ---
    tick(k, o) {
      const n = (o && o.n) || 1;
      const every = (o && o.every) || 0.5;
      for (let i = 0; i < n; i++) k.noise(k.t + i * every, 0.025, { filter: bp(i % 2 ? 3800 : 4600, 5), vol: 0.75 });
      return n * every;
    },
    typewriter(k, o) {
      k.noise(k.t, 0.03, { filter: bp(2200, 2), vol: 0.8 });
      k.noise(k.t, 0.04, { filter: lp(500), vol: 0.4 });
      if (o && o.bell) k.osc("sine", 2600, k.t + 0.05, 0.6, { vol: 0.13, a: 0.001 });
      return o && o.bell ? 0.65 : 0.05;
    },
    bell(k) {
      k.osc("sine", 2093, k.t, 1.2, { vol: 0.22, a: 0.001 });
      k.osc("sine", 5230, k.t, 0.6, { vol: 0.07, a: 0.001 });
      k.osc("sine", 3150, k.t, 0.9, { vol: 0.05, a: 0.001 });
      return 1.2;
    },
    chime(k) {
      for (let i = 0; i < 7; i++) k.osc("sine", rnd(2200, 5200), k.t + i * 0.05, 0.6, { vol: 0.08, a: 0.002 });
      return 0.95;
    },
    ring(k, o) {
      const d = len(o, 1.2);
      k.osc("sine", 1450, k.t, d, { hold: holdFor(d, 0.004, 0.08), vol: 0.09, trem: [20, 1] });
      k.osc("sine", 1680, k.t, d, { hold: holdFor(d, 0.004, 0.08), vol: 0.06, trem: [20, 1] });
      return d;
    },
    horn(k, o) {
      const n = (o && o.n) || 1;
      for (let i = 0; i < n; i++) {
        k.osc("square", 392, k.t + i * 0.55, 0.42, { hold: 0.3, vol: 0.1, filter: lp(1400) });
        k.osc("square", 494, k.t + i * 0.55, 0.42, { hold: 0.3, vol: 0.1, filter: lp(1400) });
      }
      return n * 0.55;
    },

    // a single plucked note for interactive toys: opts.hz
    key(k, o) {
      const hz = Math.max(40, Math.min(4000, (o && +o.hz) || 440));
      k.osc("triangle", hz, k.t, 0.6, { vol: 0.4, a: 0.004 });
      k.osc("sine", hz * 2, k.t, 0.25, { vol: 0.08, a: 0.004 });
      return 0.62;
    },

    // --- retro ---
    blip(k, o) {
      k.osc("square", (o && o.hz) || 880, k.t, 0.06, { vol: 0.1, a: 0.001, hold: 0.04 });
      return 0.07;
    },
    "arcade-up"(k) {
      [523, 659, 784, 1047].forEach((hz, i) => k.osc("square", hz, k.t + i * 0.055, 0.06, { vol: 0.09, hold: 0.04, a: 0.001 }));
      return 0.3;
    },
    "arcade-down"(k) {
      [784, 622, 523, 392, 311].forEach((hz, i) => k.osc("square", hz, k.t + i * 0.07, 0.08, { vol: 0.09, hold: 0.05, a: 0.001 }));
      return 0.42;
    }
  };

  // ---------- voices ----------
  function stopVoice(v, ms) {
    if (v.ended) return;
    v.ended = true;
    voices.delete(v);
    clearTimeout(v.timer);
    const fade = Math.max(0.01, (ms == null ? 80 : ms) / 1000);
    try {
      const t = ctx.currentTime;
      v.out.gain.cancelScheduledValues(t);
      v.out.gain.setValueAtTime(v.out.gain.value, t);
      v.out.gain.linearRampToValueAtTime(0, t + fade);
      v.srcs.forEach((s) => { try { s.stop(t + fade + 0.02); } catch (e) {} });
    } catch (e) {}
    setTimeout(() => { try { v.out.disconnect(); } catch (e) {} }, fade * 1000 + 200);
    armIdle();
  }

  function start(name, opts, handle) {
    if (handle.cancelled || !enabled || !ctx || ctx.state !== "running") return;
    if (voices.size >= MAX_VOICES) return;
    const now = performance.now();
    if (lastPlayed[name] && now - lastPlayed[name] < RETRIGGER_MS) return;
    lastPlayed[name] = now;
    const v = { name, srcs: [], ended: false, t0: ctx.currentTime + 0.005 };
    try {
      const vol = Math.max(0, Math.min(1.5, opts.vol == null ? 1 : +opts.vol || 0));
      v.out = ctx.createGain();
      let node = v.out;
      if (opts.pan != null && ctx.createStereoPanner) {
        const p = ctx.createStereoPanner();
        p.pan.value = Math.max(-1, Math.min(1, +opts.pan || 0));
        v.out.connect(p);
        node = p;
      }
      if (opts.fadeIn) {
        v.out.gain.setValueAtTime(0, v.t0);
        v.out.gain.linearRampToValueAtTime(vol, v.t0 + opts.fadeIn / 1000);
      } else v.out.gain.value = vol;
      node.connect(bus);
      const dur = R[name](kit(v, opts.rate), opts) || 0.5;
      voices.add(v);
      handle.voice = v;
      v.timer = setTimeout(() => stopVoice(v, 10), (dur + 0.15) * 1000);
      clearTimeout(idleTimer);
    } catch (e) {
      stopVoice(v, 10);
    }
  }

  function play(name, opts) {
    try {
      opts = opts || {};
      if (!enabled || !R[name] || !ctx) return NOOP;
      const handle = {
        cancelled: false,
        voice: null,
        stop(ms) {
          handle.cancelled = true;
          if (handle.voice) stopVoice(handle.voice, ms);
        },
        get playing() {
          return !!(handle.voice && !handle.voice.ended);
        }
      };
      if (ctx.state === "running") start(name, opts, handle);
      else {
        const asked = performance.now();
        const p = resume();
        if (p && p.then) p.then(() => { if (performance.now() - asked < RESUME_GRACE_MS) start(name, opts, handle); }, () => {});
      }
      return handle;
    } catch (e) {
      return NOOP;
    }
  }

  function stopAll(ms) {
    Array.from(voices).forEach((v) => stopVoice(v, ms));
  }

  function setEnabled(on) {
    on = !!on;
    if (on === enabled) return;
    enabled = on;
    writePref(on);
    if (on) {
      unlock();
      play("relay", { vol: 0.7 });
    } else {
      stopAll(40);
      setTimeout(() => {
        try { if (!enabled && ctx && ctx.state === "running") ctx.suspend().catch(() => {}); } catch (e) {}
      }, 120);
    }
    listeners.forEach((fn) => { try { fn(on); } catch (e) {} });
  }

  window.MachineSound = {
    play,
    stopAll,
    has: (name) => !!R[name],
    get active() {
      return voices.size;
    },
    isEnabled: () => enabled,
    setEnabled,
    onChange(fn) {
      listeners.add(fn);
    }
  };
})();
