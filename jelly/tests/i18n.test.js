const assert = require('assert');
const fs = require('fs');
const path = require('path');
const I = require('../js/i18n.js');
const { WORDS, THEMES } = require('../js/words.js');
let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.log('FAIL', name, '\n ', e.message); } }
const en = I.STRINGS.en, zh = I.STRINGS.zh;
t('en/zh key sets equal', () => assert.deepStrictEqual(Object.keys(en).sort(), Object.keys(zh).sort()));
t('no empty strings', () => { for (const L of [en, zh]) for (const [k, v] of Object.entries(L)) assert.ok(typeof v === 'string' && v.trim(), k); });
t('placeholders match', () => { for (const k of Object.keys(en)) assert.deepStrictEqual((en[k].match(/\{\w+\}/g) || []).sort(), (zh[k].match(/\{\w+\}/g) || []).sort(), k); });
t('required copy', () => {
  assert.strictEqual(en.correct, 'Correct!'); assert.strictEqual(zh.correct, '正确!');
  assert.strictEqual(en.nextStage, 'Next Stage'); assert.strictEqual(zh.nextStage, '下一关');
  assert.strictEqual(en.finish, 'Finish'); assert.strictEqual(zh.finish, '完成');
  assert.deepStrictEqual([zh.slotInitial, zh.slotVowel, zh.slotFinal], ['初声', '母音', '终声']);
  assert.strictEqual(zh.wordNofM.replace('{n}', 3).replace('{m}', 10), '第 3 / 10 个词');
});
t('30 words have english+chinese', () => {
  assert.strictEqual(WORDS.length, 30);
  for (const w of WORDS) { assert.ok(w.english && w.english.trim(), w.id + ' english'); assert.ok(w.chinese && w.chinese.trim(), w.id + ' chinese'); }
  for (const th of THEMES) { assert.ok(th.name && th.chinese, th.id); }
});
t('chinese meanings fixed list', () => {
  const m = Object.fromEntries(WORDS.map((w) => [w.korean, w.chinese]));
  const exp = { 밥: '米饭；一餐', 김치: '韩国泡菜', 비빔밥: '拌饭（蔬菜和肉拌米饭）', 라면: '拉面（方便面）', 불고기: '烤肉（韩式腌制牛肉）', 안녕: '嗨（非正式）', 주세요: '请给我', 오빠: '哥哥（女性对年长男性的称呼；也可作亲昵称呼）', 집: '家；房子', 마음: '心；心情', 꿈: '梦', 운명: '命运' };
  for (const [k, v] of Object.entries(exp)) assert.strictEqual(m[k], v, k);
  assert.deepStrictEqual(THEMES.map((x) => x.chinese), ['食物', '问候', '韩剧与日常']);
});
t('every key used by game.js exists', () => {
  const src = fs.readFileSync(path.join(__dirname, '../js/game.js'), 'utf8');
  const used = new Set([...src.matchAll(/\bT\(\s*'(\w+)'/g)].map((m) => m[1]));
  for (const m of src.matchAll(/T\(\s*\{([^}]*)\}\[/g)) for (const k of m[1].matchAll(/'(\w+)'/g)) used.add(k[1]);
  for (const m of src.matchAll(/T\(\s*\w+\s*\?\s*'(\w+)'\s*:\s*'(\w+)'/g)) { used.add(m[1]); used.add(m[2]); }
  for (const m of src.matchAll(/T\(\s*'(\w+)'|T\(l === 'en' \? '(\w+)' : '(\w+)'/g)) [m[1], m[2], m[3]].filter(Boolean).forEach((k) => used.add(k));
  ['correct', 'nextStage', 'finish', 'notQuite', 'puzzleTip', 'howToHome', 'slotInitial', 'slotVowel', 'slotFinal', 'langEn', 'langZh', 'resetConfirm', 'wordNofM', 'wordsCount'].forEach((k) => assert.ok(used.has(k), 'game.js does not use ' + k));
  for (const k of used) { assert.ok(en[k], 'missing en ' + k); assert.ok(zh[k], 'missing zh ' + k); }
});
t('language detection', () => {
  assert.strictEqual(I.detect('zh', { language: 'en-US' }), 'zh');
  assert.strictEqual(I.detect('en', { language: 'zh-CN' }), 'en');
  assert.strictEqual(I.detect(null, { language: 'zh-CN' }), 'zh');
  assert.strictEqual(I.detect(null, { language: 'en-US', languages: ['en-US', 'zh-TW'] }), 'zh');
  assert.strictEqual(I.detect(null, { language: 'ko-KR' }), 'en');
  assert.strictEqual(I.detect('fr', { language: 'en' }), 'en');
});
t('index.html loads scripts and has noindex', () => {
  const h = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  for (const f of ['i18n', 'puzzle', 'fx', 'game']) assert.ok(h.includes(`js/${f}.js`), f);
  assert.ok(/noindex/.test(h));
});
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
