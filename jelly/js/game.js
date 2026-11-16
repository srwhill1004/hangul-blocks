(function () {
  'use strict';
  const H = window.Hangul, P = window.HangulPuzzle, I = window.HangulI18n, { WORDS, THEMES } = window.HangulData;
  const KEY = 'hangul-blocks-progress';
  const app = document.getElementById('app');
  const byId = (id) => WORDS.find((w) => w.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const params = new URLSearchParams(location.search);
  const testMode = { fx: true, speech: true }; // switched off by tests via HangulGame.setTest

  // ---- language ----
  function readSavedLang() { try { return localStorage.getItem(I.STORE); } catch (e) { return null; } }
  let lang = I.detect(params.get('lang') || readSavedLang(), navigator);
  const T = (key, vars) => I.t(lang, key, vars);
  function applyLangToDoc() { document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en'; document.title = T('pageTitle'); }
  function setLang(l) {
    if (!I.LANGS.includes(l) || l === lang) return;
    lang = l;
    try { localStorage.setItem(I.STORE, l); } catch (e) {}
    applyLangToDoc(); refresh();
  }
  const langToggle = () => `<div class="lang" role="group" aria-label="${esc(T('langLabel'))}">${I.LANGS.map((l) =>
    `<button class="${l === lang ? 'on' : ''}" data-lang="${l}" aria-pressed="${l === lang}" lang="${l}">${esc(T(l === 'en' ? 'langEn' : 'langZh'))}</button>`).join('')}</div>`;
  const bindCommon = () => {
    app.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => go(b.dataset.go));
    document.querySelectorAll('[data-lang]').forEach((b) => b.onclick = () => setLang(b.dataset.lang));
  };
  const meaning = (w) => (lang === 'zh' ? w.chinese : w.english);
  const shortMeaning = (w) => meaning(w).split(/ \(|（/)[0];
  const themeName = (t) => (lang === 'zh' ? t.chinese : t.name);

  // ---- progress ----
  function load() {
    try { const p = JSON.parse(localStorage.getItem(KEY)); if (p && Array.isArray(p.done)) return { done: p.done, hints: p.hints || {} }; } catch (e) {}
    return { done: [], hints: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} }
  let progress = load();

  // ---- routing ----
  let screen = 'home', cur = null, popSlot = null;
  function route() {
    clearCelebration();
    let h = location.hash.replace(/^#\/?/, '');
    const q = params.get('word');
    if (!h && q) h = 'word/' + q;
    const [kind, id] = h.split('/');
    applyLangToDoc();
    if (kind === 'word' && byId(id)) return showPuzzle(byId(id));
    if (kind === 'theme' && THEMES.some((t) => t.id === id)) return showTheme(id);
    showHome();
  }
  const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  window.addEventListener('hashchange', route);
  function refresh() { // redraw current screen in the new language, keeping state
    if (screen === 'puzzle' && cur) return render();
    if (screen === 'theme') return showTheme(screenArg);
    showHome();
  }
  let screenArg = null;

  // ---- screens ----
  function showHome() {
    screen = 'home'; cur = null; app.className = '';
    const n = progress.done.filter((id) => byId(id)).length;
    app.innerHTML = `<div class="toprow">${langToggle()}</div><h1>Hangul Blocks</h1>
      <p class="sub">${T('homeSub')}</p>
      <p class="howto-home"><b>${esc(T('howToTitle'))}:</b> ${esc(T('howToHome'))}</p>
      <div class="progress-label">${esc(T('wordsCount', { n, m: WORDS.length }))}</div>
      <div class="bar"><i style="width:${(n / WORDS.length) * 100}%"></i></div>
      ${THEMES.map((t) => { const ws = WORDS.filter((w) => w.theme === t.id); const d = ws.filter((w) => progress.done.includes(w.id)).length;
        return `<button class="card" data-go="#/theme/${t.id}"><b>${esc(themeName(t))}</b><span>${esc(T('themeProgress', { d, m: ws.length }))}</span></button>`; }).join('')}
      <p style="text-align:center"><button class="btn ghost" id="reset">${esc(T('resetProgress'))}</button></p>`;
    bindCommon();
    document.getElementById('reset').onclick = () => {
      if (confirm(T('resetConfirm'))) { progress = { done: [], hints: {} }; save(); showHome(); }
    };
  }

  function showTheme(id) {
    screen = 'theme'; screenArg = id; cur = null; app.className = '';
    const t = THEMES.find((x) => x.id === id), ws = WORDS.filter((w) => w.theme === id);
    app.innerHTML = `<div class="topbar"><button class="btn" data-go="#/">← ${esc(T('home'))}</button>${langToggle()}</div><h2 class="theme-title">${esc(themeName(t))}</h2>
      <div class="wordlist">${ws.map((w) => { const d = progress.done.includes(w.id);
        return `<button class="card ${d ? 'done' : ''}" data-go="#/word/${w.id}" ${d ? `aria-label="${esc(shortMeaning(w))} — ${esc(T('complete'))}"` : ''}><span class="emo">${w.emoji}</span>${esc(shortMeaning(w))}${d ? ' ✓' : ''}</button>`; }).join('')}</div>`;
    bindCommon();
  }

  // ---- puzzle ----
  function showPuzzle(word) {
    clearCelebration(); screen = 'puzzle';
    const tiles = H.buildTiles(word.korean).map((j, i) => ({ id: i, jamo: j }));
    cur = { word, sylls: P.createSylls(word.korean), tiles, hint: false, solved: false, nextReady: false, shake: null };
    render();
    if (params.get('solve') === '1') {
      for (const j of P.solveOrder(word.korean)) { const t = cur.tiles.find((x) => x.jamo === j && !usedIds().has(x.id)); if (t) onTile(t.id); }
    }
  }
  const usedIds = () => new Set([].concat(...cur.sylls.map((s) => [].concat(s.ids.cho, s.ids.jung, s.ids.jong))));
  const slotLabel = (k) => T({ cho: 'slotInitial', jung: 'slotVowel', jong: 'slotFinal' }[k]);

  function render() {
    const { word, sylls } = cur, used = usedIds();
    const list = WORDS.filter((w) => w.theme === word.theme), idx = list.indexOf(word);
    const prevScroll = (app.querySelector('.ptop') || {}).scrollTop || 0;
    const anyWrong = sylls.some((s) => P.status(s) === 'wrong');
    const sylHtml = sylls.map((s, si) => {
      const st = P.status(s), text = H.slotSyllable(s.slots), shake = cur.shake === si ? ' shake' : '';
      const slot = (k) => { const l = s.slots[k], lab = slotLabel(k);
        return `<button class="slot ${k === 'jong' ? 'jong' : ''} ${l.length ? 'filled' : ''}${k === 'jung' ? ' v' : ''}${popSlot === si + ':' + k ? ' pop' : ''}" data-syl="${si}" data-kind="${k}" aria-label="${esc(l.length ? T('slotAriaFilled', { n: si + 1, slot: lab, jamo: H.slotDisplay(k, l) }) : T('slotAria', { n: si + 1, slot: lab }))}">${l.length ? esc(H.slotDisplay(k, l)) : `<small>${esc(lab)}</small>`}</button>`; };
      return `<div class="syl ${st}${shake}"><div class="result">${text && H.slotCount(s.slots) >= s.need ? esc(text) : '&nbsp;'}</div>
        <div class="grid ${s.layout}">${slot('cho')}${slot('jung')}${s.hasJong ? slot('jong') : ''}</div></div>`;
    }).join('');
    app.className = 'puzzle' + (sylls.length >= 4 ? ' many' : '');
    app.innerHTML = `<div class="ptop"><div class="topbar"><button class="btn" data-go="#/theme/${word.theme}">← ${esc(T('back'))}</button>${langToggle()}
      <button class="btn" id="hint" ${cur.solved ? 'disabled' : ''}>${esc(T('hint'))} (${progress.hints[word.id] || 0})</button></div>
      <div class="wordno">${esc(T('wordNofM', { n: idx + 1, m: list.length }))}</div>
      <div class="pic" role="img" aria-label="${esc(meaning(word))}">${word.emoji}</div>
      <div class="meaning">${esc(meaning(word))}</div>
      <div class="hintline">${cur.hint || cur.solved ? esc(word.romanization) : ''}</div>
      <p class="howto">${esc(T('puzzleTip'))}</p>
      <div class="syllables">${sylHtml}</div>
      <div class="msg" role="status">${anyWrong ? esc(T('notQuite')) : ''}</div></div>
      <div class="pdock"><div class="tray" role="group" aria-label="${esc(T('trayAria'))}">${cur.tiles.map((t) => used.has(t.id) ? `<button class="tile${/[ㅏ-ㅣ]/.test(t.jamo) ? ' v' : ''} used" data-tile="${t.id}" disabled tabindex="-1" aria-hidden="true"></button>` : `<button class="tile${/[ㅏ-ㅣ]/.test(t.jamo) ? ' v' : ''}" data-tile="${t.id}" aria-label="${esc(T('tileAria', { jamo: t.jamo }))}">${esc(t.jamo)}</button>`).join('')}</div></div>`;
    cur.shake = null; popSlot = null;
    bindCommon();
    const pt = app.querySelector('.ptop'); if (pt) pt.scrollTop = prevScroll;
    const hb = document.getElementById('hint');
    if (hb) hb.onclick = () => { if (!cur.hint) { cur.hint = true; progress.hints[word.id] = (progress.hints[word.id] || 0) + 1; save(); } render(); };
    app.querySelectorAll('.slot').forEach((el) => el.onclick = () => onSlot(+el.dataset.syl, el.dataset.kind));
    app.querySelectorAll('.tile').forEach((el) => el.onclick = () => onTile(+el.dataset.tile));
    if (cur.solved) renderCelebration();
  }

  // tap a tile -> it goes into the next free slot
  function onTile(tileId) {
    if (cur.solved) return;
    const tile = cur.tiles.find((t) => t.id === tileId);
    if (!tile || usedIds().has(tileId)) return;
    const tg = P.place(cur.sylls, tile.jamo);
    if (!tg) return;
    cur.sylls[tg.si].ids[tg.kind].push(tileId);
    popSlot = tg.si + ':' + tg.kind;
    if (P.status(cur.sylls[tg.si]) === 'wrong') cur.shake = tg.si;
    if (P.isSolved(cur.sylls, cur.word.korean)) {
      cur.solved = true; cur.shake = null;
      if (!progress.done.includes(cur.word.id)) { progress.done.push(cur.word.id); save(); }
      render();
      celebrate();
      return;
    }
    render();
  }
  // tap a placed jamo -> back to the tray
  function onSlot(si, kind) {
    if (cur.solved) return;
    if (P.remove(cur.sylls, si, kind) !== null) { cur.sylls[si].ids[kind].pop(); render(); }
  }

  // ---- celebration: big message + canvas fireworks + speech + Next Stage ----
  function celebrate() {
    const still = params.get('still') === '1';
    const word = cur.word;
    if (testMode.fx) window.HangulFx.celebrate(still ? { still: 350 } : {});
    if (still) { cur.nextReady = true; renderCelebration(); return; }
    const ready = () => { if (cur && cur.word === word && !cur.nextReady) { cur.nextReady = true; updateNext(); } };
    speak(word.korean, ready);
  }
  function speak(text, done) {
    let fired = false; const fin = () => { if (!fired) { fired = true; if (done) done(); } };
    try {
      if (testMode.speech && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = 0.85;
        u.onend = fin; u.onerror = fin;
        window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
        setTimeout(fin, 1800); return;
      }
    } catch (e) { /* silently skip */ }
    setTimeout(fin, 500);
  }
  function clearCelebration() {
    const o = document.getElementById('celebrate'); if (o) o.remove();
    if (window.HangulFx) window.HangulFx.stop();
  }
  function updateNext() {
    const b = document.getElementById('next'); if (b) { b.classList.add('ready'); b.disabled = false; }
  }
  function renderCelebration() {
    const { word } = cur;
    const list = WORDS.filter((w) => w.theme === word.theme), idx = list.indexOf(word), last = idx + 1 >= list.length;
    let o = document.getElementById('celebrate');
    if (!o) { o = document.createElement('div'); o.id = 'celebrate'; document.body.appendChild(o); }
    o.className = 'celebrate' + (params.get('still') === '1' ? ' still' : ''); o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', T('celebrationAria'));
    o.innerHTML = `<div class="toprow">${langToggle()}</div><div class="cel-body"><div class="big" lang="${lang}">${esc(T('correct'))}</div>
      <div class="ko">${esc(word.korean)}</div><div class="rom">${esc(word.romanization)}</div><div class="cel-meaning">${esc(meaning(word))}</div>
      <div class="actions"><button class="btn" id="say">🔊 ${esc(T('listen'))}</button>
      <button class="btn primary ${cur.nextReady ? 'ready' : ''}" id="next" ${cur.nextReady ? '' : 'disabled'}>${esc(T(last ? 'finish' : 'nextStage'))}</button></div></div>`;
    o.querySelectorAll('[data-lang]').forEach((b) => b.onclick = () => setLang(b.dataset.lang));
    document.getElementById('say').onclick = () => speak(word.korean);
    document.getElementById('next').onclick = () => go(last ? '#/' : '#/word/' + list[idx + 1].id);
  }

  window.HangulGame = { route, setTest: (o) => Object.assign(testMode, o), open: (id) => showPuzzle(byId(id)), setLang, getLang: () => lang, state: () => cur };
  if (!window.__noAutoRoute) route();
})();
