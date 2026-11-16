const assert = require('assert');
const A = require('../js/audio.js');
let pass = 0, fail = 0;
function t(n, fn) { try { fn(); pass++; } catch (e) { fail++; console.log('FAIL', n, '\n ', e.message); } }
const mem = () => { const m = {}; return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, m }; };
function param() { return { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} }; }
function node() { return { connect() {}, start() {}, stop() {}, gain: param(), frequency: param(), Q: param(), delayTime: param(), type: '' }; }
function MockCtx() { this.state = 'running'; this.currentTime = 0; this.sampleRate = 8000; this.destination = {};
  ['createGain', 'createOscillator', 'createBiquadFilter', 'createDelay', 'createBufferSource'].forEach((f) => { this[f] = node; });
  this.createBuffer = (c, n) => ({ getChannelData: () => new Float32Array(n) }); this.resume = () => Promise.resolve(); this.suspend = () => Promise.resolve(); }
const ivs = [];
const env = (extra) => Object.assign({ AudioContext: MockCtx, storage: mem(), setInterval: (f) => { ivs.push(f); return ivs.length; }, clearInterval() {} }, extra);
t('no AudioContext: nothing throws', () => { const a = A.create({ AudioContext: undefined, storage: null });
  for (const f of ['unlock', 'pop', 'whoosh', 'chime', 'duck', 'unduck']) a[f](); a.setBgm(true); a.setSfx(false); a.onVis(true); });
t('throwing AudioContext is swallowed', () => { const a = A.create(env({ AudioContext: function () { throw new Error('x'); } })); a.unlock(); a.pop(); a.whoosh(); a.chime(); });
t('suspended context is skipped silently', () => { function S() { MockCtx.call(this); this.state = 'suspended'; this.resume = () => new Promise(() => {}); } const a = A.create(env({ AudioContext: S })); a.unlock(); assert.strictEqual(a.pop(), false); });
t('synth with mock ctx plays', () => { const a = A.create(env()); a.unlock(); assert.strictEqual(a.pop(), true); assert.strictEqual(a.whoosh(), true); assert.strictEqual(a.chime(), true); assert.ok(a.state().active, 'bgm scheduling'); });
t('defaults on, toggles persist', () => { const e = env(); const a = A.create(e); assert.deepStrictEqual([a.state().bgm, a.state().sfx], [true, true]);
  a.setBgm(false); a.setSfx(false); assert.deepStrictEqual(JSON.parse(e.storage.m[A.STORE]), { bgm: false, sfx: false });
  const b = A.create(e); assert.deepStrictEqual([b.state().bgm, b.state().sfx], [false, false]); });
t('sfx off -> no sound; bgm off -> no scheduler', () => { const a = A.create(env()); a.unlock(); a.setSfx(false); assert.ok(!a.pop() && !a.whoosh() && !a.chime());
  a.setBgm(false); assert.strictEqual(a.state().active, false); a.setBgm(true); assert.strictEqual(a.state().active, true); });
t('bgm does not start before unlock (autoplay)', () => { const a = A.create(env()); a.setBgm(true); assert.strictEqual(a.state().active, false); });
t('duck / unduck state', () => { const a = A.create(env()); a.unlock(); a.duck(); assert.strictEqual(a.state().ducked, true); a.unduck(); assert.strictEqual(a.state().ducked, false); });
t('setEnabled(false) silences everything', () => { const a = A.create(env()); a.setEnabled(false); a.unlock(); assert.ok(!a.pop()); assert.strictEqual(a.state().active, false); });
t('corrupt saved settings fall back to defaults', () => { const s = mem(); s.setItem(A.STORE, '{bad'); assert.strictEqual(A.create(env({ storage: s })).state().bgm, true); });
console.log(`${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
