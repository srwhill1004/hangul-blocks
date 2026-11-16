/* UI strings (en / zh-Hans). Works in browser (window.HangulI18n) and node. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HangulI18n = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const STRINGS = {
    en: {
      pageTitle: 'Hangul Blocks',
      langLabel: 'Language',
      langEn: 'English',
      langZh: '中文',
      homeSub: 'Build Korean words from letter blocks.<br>Pick a theme and tap the blocks to learn Hangul!',
      howToTitle: 'How to play',
      howToHome: 'Tap a letter block and it jumps into the next slot.',
      puzzleTip: 'Tap a block to place it. For ㅘ, tap ㅗ then ㅏ.',
      wordsCount: '{n}/{m} words',
      themeProgress: '{d}/{m} complete',
      complete: 'complete',
      resetProgress: 'Reset progress',
      resetConfirm: 'Reset all progress? Your completed words will be cleared.',
      back: 'Back',
      home: 'Home',
      hint: 'Hint',
      wordNofM: 'Word {n} of {m}',
      slotInitial: 'initial',
      slotVowel: 'vowel',
      slotFinal: 'final',
      slotAria: 'Syllable {n}, {slot} slot',
      slotAriaFilled: 'Syllable {n}, {slot} slot: {jamo}. Tap to take it back.',
      tileAria: 'Letter block {jamo}',
      trayAria: 'Letter blocks',
      notQuite: 'Not quite! Tap a placed block to take it back.',
      correct: 'Correct!',
      listen: 'Listen',
      nextStage: 'Next Stage',
      finish: 'Finish',
      celebrationAria: 'Correct answer'
    },
    zh: {
      pageTitle: 'Hangul Blocks',
      langLabel: '语言',
      langEn: 'English',
      langZh: '中文',
      homeSub: '用字母块拼出韩语单词。<br>选一个主题，点按字母块来学习韩文吧！',
      howToTitle: '玩法',
      howToHome: '点按字母块，它会自动进入下一个空格。',
      puzzleTip: '点按字母块即可放入。要组成ㅘ，先点ㅗ再点ㅏ。',
      wordsCount: '{n}/{m} 个词',
      themeProgress: '已完成 {d}/{m}',
      complete: '已完成',
      resetProgress: '重置进度',
      resetConfirm: '确定重置进度吗？已完成的单词将被清除。',
      back: '返回',
      home: '首页',
      hint: '提示',
      wordNofM: '第 {n} / {m} 个词',
      slotInitial: '初声',
      slotVowel: '母音',
      slotFinal: '终声',
      slotAria: '第 {n} 个音节，{slot}格',
      slotAriaFilled: '第 {n} 个音节，{slot}格：{jamo}。点按可取回。',
      tileAria: '字母块 {jamo}',
      trayAria: '字母块',
      notQuite: '不对！点已放入的字母即可取回。',
      correct: '正确!',
      listen: '听发音',
      nextStage: '下一关',
      finish: '完成',
      celebrationAria: '回答正确'
    }
  };
  const LANGS = ['en', 'zh'];
  const STORE = 'hangul-blocks-lang';

  function t(lang, key, vars) {
    const s = (STRINGS[lang] && STRINGS[lang][key]) || '';
    return s.replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] !== undefined ? vars[k] : m));
  }
  // saved value > navigator language(s) starting with zh > en
  function detect(saved, nav) {
    if (LANGS.includes(saved)) return saved;
    const list = [].concat((nav && nav.languages) || [], (nav && nav.language) || []);
    return list.some((l) => /^zh/i.test(String(l))) ? 'zh' : 'en';
  }
  return { STRINGS, LANGS, STORE, t, detect };
});
