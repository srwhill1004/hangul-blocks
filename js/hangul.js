/* Hangul engine: works in browser (window.Hangul) and node (require). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Hangul = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const CHO = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  const JUNG = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'.split('');
  const JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const VOWEL_COMBOS = { 'ㅗㅏ': 'ㅘ', 'ㅗㅐ': 'ㅙ', 'ㅗㅣ': 'ㅚ', 'ㅜㅓ': 'ㅝ', 'ㅜㅔ': 'ㅞ', 'ㅜㅣ': 'ㅟ', 'ㅡㅣ': 'ㅢ' };
  const FINAL_COMBOS = { 'ㄱㅅ': 'ㄳ', 'ㄴㅈ': 'ㄵ', 'ㄴㅎ': 'ㄶ', 'ㄹㄱ': 'ㄺ', 'ㄹㅁ': 'ㄻ', 'ㄹㅂ': 'ㄼ', 'ㄹㅅ': 'ㄽ', 'ㄹㅌ': 'ㄾ', 'ㄹㅍ': 'ㄿ', 'ㄹㅎ': 'ㅀ', 'ㅂㅅ': 'ㅄ' };
  const invert = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [v, k.split('')]));
  const VOWEL_SPLIT = invert(VOWEL_COMBOS);
  const FINAL_SPLIT = invert(FINAL_COMBOS);
  const BASIC_VOWELS = JUNG.filter((v) => !VOWEL_SPLIT[v]);
  const BASIC_CONSONANTS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');

  const isVowel = (c) => JUNG.includes(c);
  const isConsonant = (c) => CHO.includes(c) || (c !== '' && JONG.includes(c));

  // Conjoining jamo (U+1100..) -> compatibility jamo. Other chars unchanged.
  function normalize(ch) {
    const c = ch.codePointAt(0);
    if (c >= 0x1100 && c <= 0x1112) return CHO[c - 0x1100];
    if (c >= 0x1161 && c <= 0x1175) return JUNG[c - 0x1161];
    if (c >= 0x11a8 && c <= 0x11c2) return JONG[c - 0x11a8 + 1];
    return ch;
  }
  const combineVowels = (a, b) => VOWEL_COMBOS[normalize(a) + normalize(b)] || null;
  const splitVowel = (v) => VOWEL_SPLIT[v] ? VOWEL_SPLIT[v].slice() : [v];
  const combineFinals = (a, b) => FINAL_COMBOS[normalize(a) + normalize(b)] || null;
  const splitFinal = (f) => FINAL_SPLIT[f] ? FINAL_SPLIT[f].slice() : (f ? [f] : []);

  function composeSyllable(cho, jung, jong) {
    const ci = CHO.indexOf(normalize(cho)), vi = JUNG.indexOf(normalize(jung));
    const fi = JONG.indexOf(jong ? normalize(jong) : '');
    if (ci < 0 || vi < 0 || fi < 0) return null;
    return String.fromCodePoint(0xac00 + (ci * 21 + vi) * 28 + fi);
  }
  function decomposeSyllable(s) {
    const c = s.codePointAt(0) - 0xac00;
    if (!(c >= 0 && c < 11172)) return null;
    return { cho: CHO[Math.floor(c / 588)], jung: JUNG[Math.floor((c % 588) / 28)], jong: JONG[c % 28] };
  }
  // list of jamo (primitive or compound, either jamo block) -> syllable or null
  function assembleSyllable(list) {
    const l = (list || []).map(normalize);
    if (!l.length || !CHO.includes(l[0])) return null;
    let i = 1, v = null, f = null;
    while (i < l.length && isVowel(l[i])) {
      if (v === null) v = l[i];
      else { v = VOWEL_COMBOS[v + l[i]]; if (!v) return null; }
      i++;
    }
    if (v === null) return null;
    for (; i < l.length; i++) {
      if (!isConsonant(l[i])) return null;
      if (f === null) f = l[i];
      else { f = FINAL_COMBOS[f + l[i]]; if (!f) return null; }
    }
    if (f !== null && !JONG.includes(f)) return null;
    return composeSyllable(l[0], v, f || '');
  }
  function assembleWord(lists) {
    let out = '';
    for (const l of lists) { const s = assembleSyllable(l); if (!s) return null; out += s; }
    return out;
  }
  // syllable -> primitive jamo needed as tiles, e.g. 과 -> [ㄱ,ㅗ,ㅏ]
  function syllableToJamo(s) {
    const d = decomposeSyllable(s);
    return d ? [d.cho, ...splitVowel(d.jung), ...splitFinal(d.jong)] : null;
  }
  const wordToJamoLists = (w) => Array.from(w).map(syllableToJamo);
  function layoutOf(s) {
    const d = decomposeSyllable(s);
    if ('ㅏㅐㅑㅒㅓㅔㅕㅖㅣ'.includes(d.jung)) return 'v';
    if ('ㅗㅛㅜㅠㅡ'.includes(d.jung)) return 'h';
    return 'c';
  }
  // Tiles for a word: needed primitives + 2..4 distractors, shuffled.
  function buildTiles(word, rng, extra) {
    rng = rng || Math.random;
    const needed = [].concat(...wordToJamoLists(word));
    const n = extra || 2 + Math.floor(rng() * 3);
    const pool = BASIC_CONSONANTS.concat(BASIC_VOWELS).filter((j) => !needed.includes(j));
    const picks = [];
    while (picks.length < n && pool.length) picks.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    const all = needed.concat(picks);
    for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
    return all;
  }

  // ---- slot state (cho / jung / jong), used by the game and the checks ----
  const newSlots = () => ({ cho: [], jung: [], jong: [] });
  function placeInSlot(slots, kind, jamo) {
    jamo = normalize(jamo);
    const cur = slots[kind];
    if (kind === 'cho') {
      if (cur.length) return { ok: false, reason: 'occupied' };
      if (!CHO.includes(jamo)) return { ok: false, reason: 'not-initial' };
    } else if (kind === 'jung') {
      if (!BASIC_VOWELS.includes(jamo)) return { ok: false, reason: 'not-vowel' };
      if (cur.length && (cur.length > 1 || !combineVowels(cur[0], jamo))) return { ok: false, reason: 'bad-vowel-combo' };
    } else if (kind === 'jong') {
      if (!JONG.includes(jamo) || jamo === '') {
        if (!(cur.length === 1 && combineFinals(cur[0], jamo))) return { ok: false, reason: 'not-final' };
      }
      if (cur.length >= 2) return { ok: false, reason: 'occupied' };
      if (cur.length && !combineFinals(cur[0], jamo)) return { ok: false, reason: 'bad-final-combo' };
    } else return { ok: false, reason: 'bad-slot' };
    slots[kind].push(jamo);
    return { ok: true };
  }
  const removeFromSlot = (slots, kind) => slots[kind].pop() || null;
  const slotCount = (s) => s.cho.length + s.jung.length + s.jong.length;
  const slotJamo = (s) => s.cho.concat(s.jung, s.jong);
  // What to draw inside one slot box (combined glyph)
  function slotDisplay(kind, list) {
    if (list.length === 2) return (kind === 'jung' ? combineVowels : combineFinals)(list[0], list[1]) || list.join('');
    return list[0] || '';
  }
  // current syllable (string or null) for a slots state
  const slotSyllable = (s) => assembleSyllable(slotJamo(s));

  return { CHO, JUNG, JONG, VOWEL_COMBOS, FINAL_COMBOS, BASIC_VOWELS, BASIC_CONSONANTS, normalize, combineVowels, splitVowel, combineFinals, splitFinal, composeSyllable, decomposeSyllable, assembleSyllable, assembleWord, syllableToJamo, wordToJamoLists, layoutOf, buildTiles, newSlots, placeInSlot, removeFromSlot, slotCount, slotJamo, slotDisplay, slotSyllable };
});
