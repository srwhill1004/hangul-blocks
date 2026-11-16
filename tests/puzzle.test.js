const assert = require('assert');
const H = require('../js/hangul.js');
const P = require('../js/puzzle.js');
const { WORDS } = require('../js/words.js');
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.log('FAIL', name, '\n ', e.message); } }
t('30 words auto-place in order; solved exactly at last jamo, no confirm step', () => {
  for (const w of WORDS) {
    const sylls = P.createSylls(w.korean), order = P.solveOrder(w.korean);
    order.forEach((j, i) => {
      assert.ok(!P.isSolved(sylls, w.korean), w.id + ' solved early at ' + i);
      assert.ok(P.place(sylls, j), w.id + ' no target');
    });
    assert.ok(P.isSolved(sylls, w.korean), w.id + ' not solved'); assert.strictEqual(P.builtWord(sylls), w.korean);
    assert.strictEqual(P.nextTarget(sylls), null);
  }
});
t('slot order: 사과 = ㅅ ㅏ | ㄱ ㅗ ㅏ (ㅗ then ㅏ in vowel slot)', () => {
  const s = P.createSylls('사과'), seen = [];
  for (const j of ['ㅅ', 'ㅏ', 'ㄱ', 'ㅗ', 'ㅏ']) seen.push(P.place(s, j));
  assert.deepStrictEqual(seen.map((x) => x.si + x.kind), ['0cho', '0jung', '1cho', '1jung', '1jung']);
  assert.deepStrictEqual(s[1].slots.jung, ['ㅗ', 'ㅏ']);
});
t('final slot with compound final fills in order (읽-like 괜찮아요 괜)', () => {
  const s = P.createSylls('괜찮아요'); const seen = [];
  for (const j of P.solveOrder('괜찮아요')) seen.push(P.place(s, j).kind);
  assert.deepStrictEqual(seen.slice(0, 5), ['cho', 'jung', 'jung', 'jong', 'cho']);
});
t('wrong jamo goes in, marks wrong, can be removed and fixed', () => {
  const s = P.createSylls('사과');
  P.place(s, 'ㅂ'); assert.strictEqual(P.status(s[0]), 'wrong'); assert.strictEqual(s[0].slots.cho[0], 'ㅂ');
  assert.strictEqual(P.remove(s, 0, 'cho'), 'ㅂ'); assert.strictEqual(P.status(s[0]), '');
  for (const j of P.solveOrder('사과')) P.place(s, j);
  assert.ok(P.isSolved(s, '사과'));
});
t('full but wrong -> no solve; remove and refill', () => {
  const s = P.createSylls('물');
  for (const j of ['ㅁ', 'ㅜ', 'ㅁ']) P.place(s, j);
  assert.ok(!P.isSolved(s, '물')); assert.strictEqual(P.status(s[0]), 'wrong'); assert.strictEqual(P.nextTarget(s), null);
  P.remove(s, 0, 'jong'); P.place(s, 'ㄹ'); assert.ok(P.isSolved(s, '물'));
});
t('wrong consonant in vowel slot is accepted but wrong', () => {
  const s = P.createSylls('가'); P.place(s, 'ㄱ'); P.place(s, 'ㄴ');
  assert.strictEqual(P.status(s[0]), 'wrong'); assert.strictEqual(P.nextTarget(s), null);
});
t('removing earlier jamo: next tile fills the hole', () => {
  const s = P.createSylls('사과'); for (const j of ['ㅅ', 'ㅏ', 'ㄱ']) P.place(s, j);
  P.remove(s, 0, 'jung'); const tg = P.place(s, 'ㅏ'); assert.deepStrictEqual([tg.si, tg.kind], [0, 'jung']);
});
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
