const assert = require('assert');
const H = require('../js/hangul.js');
const { WORDS } = require('../js/words.js');
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.log('FAIL', name, '\n ', e.message); } }
const A = H.assembleSyllable;
t('사과', () => { assert.strictEqual(H.assembleWord([['ㅅ','ㅏ'],['ㄱ','ㅗ','ㅏ']]), '사과'); assert.strictEqual(A(['ㄱ','ㅘ']), '과'); });
[['밥',['ㅂ','ㅏ','ㅂ']],['물',['ㅁ','ㅜ','ㄹ']],['집',['ㅈ','ㅣ','ㅂ']],['빵',['ㅃ','ㅏ','ㅇ']],['꿈',['ㄲ','ㅜ','ㅁ']]]
  .forEach(([s, l]) => t(s, () => assert.strictEqual(A(l), s)));
t('김치 학교', () => { assert.strictEqual(H.assembleWord([['ㄱ','ㅣ','ㅁ'],['ㅊ','ㅣ']]), '김치'); assert.strictEqual(H.assembleWord([['ㅎ','ㅏ','ㄱ'],['ㄱ','ㅛ']]), '학교'); });
t('전화', () => assert.strictEqual(H.assembleWord([['ㅈ','ㅓ','ㄴ'],['ㅎ','ㅗ','ㅏ']]), '전화'));
t('찮 / 괜찮아요', () => {
  assert.strictEqual(A(['ㅊ','ㅏ','ㄴ','ㅎ']), '찮');
  assert.strictEqual(H.assembleWord([['ㄱ','ㅜ','ㅔ'].slice(0,0).concat(['ㄱ','ㅗ','ㅐ','ㄴ']),['ㅊ','ㅏ','ㄴ','ㅎ'],['ㅇ','ㅏ'],['ㅇ','ㅛ']]), '괜찮아요');
});
t('long greetings', () => {
  for (const w of ['안녕하세요','감사합니다','반갑습니다']) assert.strictEqual(H.assembleWord(H.wordToJamoLists(w)), w);
});
t('all 30 words round trip', () => {
  assert.strictEqual(WORDS.length, 30);
  for (const w of WORDS) {
    const r = H.assembleWord(H.wordToJamoLists(w.korean));
    assert.strictEqual(r, w.korean, w.id);
    assert.deepStrictEqual(Array.from(r).map(c => c.codePointAt(0)), Array.from(w.korean).map(c => c.codePointAt(0)));
  }
  assert.strictEqual(new Set(WORDS.map(w => w.id)).size, 30);
});
t('invalid -> null', () => {
  assert.strictEqual(A(['ㅏ','ㄱ']), null); assert.strictEqual(A(['ㅏ']), null);
  assert.strictEqual(A(['ㄱ','ㅗ','ㅓ']), null); assert.strictEqual(A(['ㄱ']), null);
  assert.strictEqual(A(['ㄱ','ㅏ','ㄸ']), null); assert.strictEqual(A(['ㄱ','ㅏ','ㄱ','ㄱ']), null);
  assert.strictEqual(A(['ㄱ','ㅏ','ㄱ','ㅏ']), null); assert.strictEqual(A([]), null);
  assert.strictEqual(H.assembleWord([['ㄱ','ㅏ'],['ㅏ']]), null);
});
t('7 compound vowels round trip', () => {
  const m = H.VOWEL_COMBOS; assert.strictEqual(Object.keys(m).length, 7);
  for (const [k, v] of Object.entries(m)) { const [a, b] = k; assert.strictEqual(H.combineVowels(a, b), v); assert.deepStrictEqual(H.splitVowel(v), [a, b]); assert.strictEqual(A(['ㄱ', a, b]), A(['ㄱ', v])); }
});
t('11 compound finals round trip', () => {
  const m = H.FINAL_COMBOS; assert.strictEqual(Object.keys(m).length, 11);
  for (const [k, v] of Object.entries(m)) { const [a, b] = k; assert.strictEqual(H.combineFinals(a, b), v); assert.deepStrictEqual(H.splitFinal(v), [a, b]); assert.strictEqual(A(['ㅂ','ㅏ', a, b]), A(['ㅂ','ㅏ', v])); assert.ok(A(['ㅂ','ㅏ', a, b])); }
});
t('compat vs conjoining jamo', () => {
  assert.strictEqual(A(['ᄒ','ᅡ','ᆫ']), '한'); assert.strictEqual(A(['ㅎ','ᅡ','ㄴ']), '한');
  assert.strictEqual(A(['ᄋ','ᅪ']), '와'); assert.strictEqual(A(['ᄀ','ᅩ','ᅡ']), '과');
  assert.strictEqual(A(['ㅊ','ㅏ','ᆫ','ᇂ']), '찮');
});
t('decompose/compose all syllables', () => {
  for (let c = 0xac00; c <= 0xd7a3; c += 7) { const s = String.fromCharCode(c); assert.strictEqual(A(H.syllableToJamo(s)), s); }
});
t('slots: 과 and 찮', () => {
  let s = H.newSlots();
  for (const [k, j] of [['cho','ㄱ'],['jung','ㅗ'],['jung','ㅏ']]) assert.ok(H.placeInSlot(s, k, j).ok);
  assert.strictEqual(H.slotSyllable(s), '과'); assert.strictEqual(H.slotDisplay('jung', s.jung), 'ㅘ');
  assert.ok(!H.placeInSlot(s, 'jung', 'ㅣ').ok);
  s = H.newSlots(); H.placeInSlot(s,'cho','ㅊ'); H.placeInSlot(s,'jung','ㅏ'); H.placeInSlot(s,'jong','ㄴ'); assert.ok(H.placeInSlot(s,'jong','ㅎ').ok);
  assert.strictEqual(H.slotSyllable(s), '찮'); assert.ok(!H.placeInSlot(s,'jong','ㄱ').ok);
  assert.ok(!H.placeInSlot(H.newSlots(),'jong','ㅃ').ok); assert.ok(!H.placeInSlot(H.newSlots(),'cho','ㅏ').ok);
  const v = H.newSlots(); H.placeInSlot(v,'jung','ㅗ'); assert.ok(!H.placeInSlot(v,'jung','ㅓ').ok);
});
t('buildTiles', () => {
  for (const w of WORDS) { const need = [].concat(...H.wordToJamoLists(w.korean)); const tl = H.buildTiles(w.korean);
    assert.ok(tl.length >= need.length + 2 && tl.length <= need.length + 4); const c = {}; tl.forEach(x => c[x] = (c[x]||0)+1); need.forEach(x => c[x]--); assert.ok(Object.values(c).every(n => n >= 0)); }
});
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
