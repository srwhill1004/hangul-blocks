/* Hangul Blocks audio: every sound is synthesized with the Web Audio API (no samples, no files).
   window.HangulAudio: unlock() pop() whoosh() chime() duck() unduck() setBgm(on) setSfx(on) state() setEnabled(bool)
   Also usable from node with a mock AudioContext: HangulAudio.create({ AudioContext, storage, setInterval, clearInterval }). */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HangulAudio = api.create({});
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const STORE = 'hangul-blocks-sound';
  const BGM_LEVEL = 0.07, SFX_LEVEL = 0.5, DUCK_LEVEL = 0.18;
  // C major pentatonic (C D E G A) as MIDI-ish frequencies; slow 4-bar loop of soft chords + music-box arpeggio
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const BAR = 3.2; // seconds per chord
  const PROG = [ // [pad root, arpeggio notes] all within C pentatonic
    { pad: [48, 55, 64], arp: [72, 76, 79, 76, 74, 76, 79, 81] },
    { pad: [45, 52, 60], arp: [72, 69, 76, 72, 69, 67, 72, 76] },
    { pad: [43, 50, 59], arp: [74, 79, 76, 74, 71, 74, 79, 76] },
    { pad: [48, 55, 62], arp: [72, 74, 76, 79, 76, 74, 72, 67] }
  ];

  function create(env) {
    const g = (typeof globalThis !== 'undefined' ? globalThis : {});
    const Ctor = env.AudioContext || g.AudioContext || g.webkitAudioContext;
    const setIv = env.setInterval || ((f, ms) => g.setInterval(f, ms));
    const clrIv = env.clearInterval || ((id) => g.clearInterval(id));
    const storage = env.storage !== undefined ? env.storage : (function () { try { return g.localStorage; } catch (e) { return null; } })();

    let enabled = true, ctx = null, master = null, bgmBus = null, duckBus = null, noiseBuf = null;
    let ducked = false, timer = null, nextBar = 0, barIdx = 0, started = false;
    const st = { bgm: true, sfx: true };
    try {
      const saved = JSON.parse(storage && storage.getItem(STORE));
      if (saved && typeof saved === 'object') { st.bgm = saved.bgm !== false; st.sfx = saved.sfx !== false; }
    } catch (e) { /* defaults */ }
    const persist = () => { try { storage && storage.setItem(STORE, JSON.stringify(st)); } catch (e) {} };
    const safe = (fn) => function () { try { return fn.apply(null, arguments); } catch (e) { return undefined; } };

    function ensure() {
      if (!enabled || !Ctor) return null;
      if (ctx) return ctx;
      ctx = new Ctor();
      master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
      duckBus = ctx.createGain(); duckBus.gain.value = 1; duckBus.connect(master);
      bgmBus = ctx.createGain(); bgmBus.gain.value = 0; bgmBus.connect(duckBus);
      // soft echo for the BGM bus
      const d = ctx.createDelay(1.0); d.delayTime.value = 0.42;
      const fb = ctx.createGain(); fb.gain.value = 0.35;
      const wet = ctx.createGain(); wet.gain.value = 0.4;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      bgmBus.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(duckBus);
      return ctx;
    }
    const running = () => ctx && ctx.state !== 'closed';
    function tone(dest, type, f, t, dur, peak, opts) {
      const o = ctx.createOscillator(), a = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (opts && opts.to) o.frequency.exponentialRampToValueAtTime(opts.to, t + (opts.glide || dur));
      const atk = (opts && opts.atk) || 0.008;
      a.gain.setValueAtTime(0.0001, t);
      a.gain.linearRampToValueAtTime(peak, t + atk);
      a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(a); a.connect(dest);
      o.start(t); o.stop(t + dur + 0.05);
    }
    function sfxReady() { return enabled && st.sfx && ensure() && ctx.state === 'running'; }

    // ---- effects ----
    // 「뾱」: quick rising sine blip with a tiny second harmonic, ~110 ms; pitch jitters so repeats sound alive
    const pop = safe(function () {
      if (!sfxReady()) return false;
      const t = ctx.currentTime, k = 0.94 + Math.random() * 0.14;
      tone(master, 'sine', 520 * k, t, 0.11, 0.22 * SFX_LEVEL * 2, { to: 1150 * k, glide: 0.055, atk: 0.004 });
      tone(master, 'triangle', 1040 * k, t + 0.012, 0.07, 0.05, { to: 1700 * k, glide: 0.05, atk: 0.004 });
      return true;
    });
    // 「휘리릭」: band-passed noise sweeping down + a faint falling whistle, ~210 ms
    const whoosh = safe(function () {
      if (!sfxReady()) return false;
      const t = ctx.currentTime, dur = 0.21;
      if (!noiseBuf) {
        noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.4), ctx.sampleRate);
        const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const n = ctx.createBufferSource(); n.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 3;
      bp.frequency.setValueAtTime(3200, t); bp.frequency.exponentialRampToValueAtTime(700, t + dur);
      const a = ctx.createGain();
      a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(0.16, t + 0.04); a.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.connect(bp); bp.connect(a); a.connect(master); n.start(t); n.stop(t + dur + 0.02);
      tone(master, 'sine', 1900, t, dur, 0.05, { to: 600, glide: dur, atk: 0.03 });
      return true;
    });
    // bright three-note sparkle, once per correct answer
    const chime = safe(function () {
      if (!sfxReady()) return false;
      const t = ctx.currentTime;
      [[1046.5, 0], [1318.5, 0.08], [1568, 0.16], [2093, 0.26]].forEach(([f, dt]) => tone(master, 'sine', f, t + dt, 0.7, 0.11, { atk: 0.006 }));
      return true;
    });

    // ---- BGM: lookahead scheduler, music-box arpeggio over a soft pad; endless (no loop seam) ----
    function scheduleBar(t, bar) {
      const c = PROG[bar % PROG.length];
      c.pad.forEach((m) => { // pad: slow swell, overlaps into next bar so chords cross-fade
        const o = ctx.createOscillator(), a = ctx.createGain(), f = ctx.createBiquadFilter();
        o.type = 'triangle'; o.frequency.value = hz(m); f.type = 'lowpass'; f.frequency.value = 900;
        a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(0.5, t + 1.2);
        a.gain.linearRampToValueAtTime(0.35, t + BAR - 0.2); a.gain.linearRampToValueAtTime(0.0001, t + BAR + 1.2);
        o.connect(f); f.connect(a); a.connect(bgmBus); o.start(t); o.stop(t + BAR + 1.3);
      });
      const step = BAR / c.arp.length;
      c.arp.forEach((m, i) => { if (i % 4 === 3 && bar % 2) return; tone(bgmBus, 'sine', hz(m), t + i * step, 1.3, 0.45 * (i % 2 ? 0.7 : 1), { atk: 0.01 }); });
    }
    function tick() {
      if (!running() || !st.bgm) return;
      while (nextBar < ctx.currentTime + 1.5) { scheduleBar(nextBar, barIdx++); nextBar += BAR; }
    }
    function startBgm() {
      if (!enabled || !st.bgm || !started || !ensure() || ctx.state !== 'running' || timer) return;
      const t = ctx.currentTime;
      bgmBus.gain.cancelScheduledValues(t); bgmBus.gain.setValueAtTime(bgmBus.gain.value, t);
      bgmBus.gain.linearRampToValueAtTime(BGM_LEVEL, t + 2.5);
      nextBar = t + 0.1; barIdx = 0; tick(); timer = setIv(safe(tick), 400);
    }
    function stopBgm() {
      if (timer) { clrIv(timer); timer = null; }
      if (ctx && bgmBus) { const t = ctx.currentTime; bgmBus.gain.cancelScheduledValues(t); bgmBus.gain.setValueAtTime(bgmBus.gain.value, t); bgmBus.gain.linearRampToValueAtTime(0, t + 0.4); }
    }
    // first user gesture: create/resume the context, then start BGM if enabled
    const unlock = safe(function () {
      if (!enabled || !ensure()) return false;
      started = true;
      const go = () => { if (st.bgm) startBgm(); };
      if (ctx.state === 'running') go();
      else { const p = ctx.resume(); if (p && p.then) p.then(go, () => {}); else go(); }
      return true;
    });
    const duck = safe(function () { ducked = true; if (!ctx || !duckBus) return; const t = ctx.currentTime; duckBus.gain.cancelScheduledValues(t); duckBus.gain.setTargetAtTime(DUCK_LEVEL, t, 0.06); });
    const unduck = safe(function () { ducked = false; if (!ctx || !duckBus) return; const t = ctx.currentTime; duckBus.gain.cancelScheduledValues(t); duckBus.gain.setTargetAtTime(1, t, 0.7); });
    const setBgm = safe(function (on) { st.bgm = !!on; persist(); if (st.bgm) { if (started) startBgm(); } else stopBgm(); });
    const setSfx = safe(function (on) { st.sfx = !!on; persist(); });
    const setEnabled = safe(function (on) { enabled = !!on; if (!enabled) stopBgm(); });
    const onVis = safe(function (hidden) { if (!ctx) return; if (hidden) ctx.suspend(); else if (started) ctx.resume(); });
    return { create, STORE, unlock, pop, whoosh, chime, duck, unduck, setBgm, setSfx, setEnabled, onVis,
      state: () => ({ bgm: st.bgm, sfx: st.sfx, ducked, enabled, active: !!timer }) };
  }
  return { create, STORE };
});
