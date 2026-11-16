/* Pure puzzle state: tap-to-place logic on top of the Hangul engine (browser + node). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./hangul.js'));
  else root.HangulPuzzle = factory(root.Hangul);
})(typeof self !== 'undefined' ? self : this, function (H) {
  const KINDS = ['cho', 'jung', 'jong'];

  function createSylls(word) {
    return Array.from(word).map((s) => {
      const d = H.decomposeSyllable(s);
      const exp = { cho: [d.cho], jung: H.splitVowel(d.jung), jong: H.splitFinal(d.jong) };
      return { expected: s, layout: H.layoutOf(s), hasJong: exp.jong.length > 0, exp,
        need: exp.cho.length + exp.jung.length + exp.jong.length, slots: H.newSlots(), ids: { cho: [], jung: [], jong: [] } };
    });
  }
  // first slot (left syllable first; cho -> jung -> jong) that still has room
  function nextTarget(sylls) {
    for (let si = 0; si < sylls.length; si++) {
      for (const kind of KINDS) if (sylls[si].slots[kind].length < sylls[si].exp[kind].length) return { si, kind };
    }
    return null;
  }
  // Put a jamo into the next free slot. A wrong jamo still goes in (so it can be taken back).
  function place(sylls, jamo) {
    const tg = nextTarget(sylls);
    if (!tg) return null;
    const s = sylls[tg.si];
    if (!H.placeInSlot(s.slots, tg.kind, jamo).ok) s.slots[tg.kind].push(H.normalize(jamo));
    return tg;
  }
  const remove = (sylls, si, kind) => (sylls[si].slots[kind].length ? H.removeFromSlot(sylls[si].slots, kind) : null);

  const isPrefix = (a, b) => a.length <= b.length && a.every((x, i) => x === b[i]);
  // 'ok' = exactly the expected syllable, 'wrong' = some placed jamo cannot lead to it, '' = in progress
  function status(s) {
    if (H.slotSyllable(s.slots) === s.expected && H.slotCount(s.slots) === s.need) return 'ok';
    return KINDS.every((k) => isPrefix(s.slots[k], s.exp[k])) ? '' : 'wrong';
  }
  const builtWord = (sylls) => sylls.map((s) => H.slotSyllable(s.slots) || '').join('');
  const isSolved = (sylls, word) => sylls.every((s) => status(s) === 'ok') && builtWord(sylls) === word;
  // ordered jamo needed to solve the word by tapping
  const solveOrder = (word) => [].concat(...H.wordToJamoLists(word));

  return { createSylls, nextTarget, place, remove, status, builtWord, isSolved, solveOrder };
});
