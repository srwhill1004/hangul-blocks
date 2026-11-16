(function () {
  'use strict';
  const H = window.Hangul, { WORDS, THEMES } = window.HangulData;
  const KEY = 'hangul-blocks-progress';
  const app = document.getElementById('app');
  const byId = (id) => WORDS.find((w) => w.id === id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ---- progress ----
  function load() {
    try { const p = JSON.parse(localStorage.getItem(KEY)); if (p && Array.isArray(p.done)) return { done: p.done, hints: p.hints || {} }; } catch (e) {}
    return { done: [], hints: {} };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (e) {} }
  let progress = load();

  // ---- routing ----
  function route() {
    let h = location.hash.replace(/^#\/?/, '');
    const q = new URLSearchParams(location.search).get('word');
    if (!h && q) h = 'word/' + q;
    const [kind, id] = h.split('/');
    if (kind === 'word' && byId(id)) return showPuzzle(byId(id));
    if (kind === 'theme' && THEMES.some((t) => t.id === id)) return showTheme(id);
    showHome();
  }
  const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
  window.addEventListener('hashchange', route);

  // ---- screens ----
  function showHome() {
    const n = progress.done.filter((id) => byId(id)).length;
    app.innerHTML = `<h1>Hangul Blocks</h1>
      <p class="sub">Build Korean words from letter blocks.<br>Pick a picture, drag or tap the blocks, and learn Hangul!</p>
      <div class="progress-label">${n}/${WORDS.length} words</div>
      <div class="bar"><i style="width:${(n / WORDS.length) * 100}%"></i></div>
      ${THEMES.map((t) => { const ws = WORDS.filter((w) => w.theme === t.id); const d = ws.filter((w) => progress.done.includes(w.id)).length;
        return `<button class="card" data-go="#/theme/${t.id}"><b>${esc(t.name)}</b><span>${d}/${ws.length} complete</span></button>`; }).join('')}
      <p style="text-align:center"><button class="btn ghost" id="reset">Reset progress</button></p>`;
    app.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => go(b.dataset.go));
    document.getElementById('reset').onclick = () => {
      if (confirm('Reset all progress? Your completed words will be cleared.')) { progress = { done: [], hints: {} }; save(); showHome(); }
    };
  }

  function showTheme(id) {
    const t = THEMES.find((x) => x.id === id), ws = WORDS.filter((w) => w.theme === id);
    app.innerHTML = `<div class="topbar"><button class="btn" data-go="#/">← Home</button><h2>${esc(t.name)}</h2><span></span></div>
      <div class="wordlist">${ws.map((w) => `<button class="card ${progress.done.includes(w.id) ? 'done' : ''}" data-go="#/word/${w.id}"><span class="emo">${w.emoji}</span>${esc(w.english.split(' (')[0])}${progress.done.includes(w.id) ? ' ✓' : ''}</button>`).join('')}</div>`;
    app.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => go(b.dataset.go));
  }

  // ---- puzzle ----
  let cur = null;
  function showPuzzle(word) {
    const sylls = Array.from(word.korean).map((s) => ({
      expected: s, layout: H.layoutOf(s), hasJong: !!H.decomposeSyllable(s).jong,
      need: H.syllableToJamo(s).length, slots: H.newSlots(), ids: { cho: [], jung: [], jong: [] } }));
    const tiles = H.buildTiles(word.korean).map((j, i) => ({ id: i, jamo: j }));
    cur = { word, sylls, tiles, selected: null, hint: false, solved: false, msg: '' };
    render();
  }
  const usedIds = () => new Set([].concat(...cur.sylls.map((s) => [].concat(s.ids.cho, s.ids.jung, s.ids.jong))));

  function status(s) {
    const text = H.slotSyllable(s.slots), count = H.slotCount(s.slots);
    if (text === s.expected) return 'ok';
    if (count >= s.need) return 'wrong';
    return '';
  }

  function render() {
    const { word, sylls } = cur, used = usedIds();
    const list = WORDS.filter((w) => w.theme === word.theme), idx = list.indexOf(word);
    const labels = { cho: 'start', jung: 'vowel', jong: 'end' };
    const sylHtml = sylls.map((s, si) => {
      const st = status(s), text = H.slotSyllable(s.slots);
      const slot = (k) => `<button class="slot ${s.slots[k].length ? 'filled' : ''}" data-syl="${si}" data-kind="${k}" aria-label="syllable ${si + 1} ${labels[k]} slot">${s.slots[k].length ? esc(H.slotDisplay(k, s.slots[k])) : `<small>${labels[k]}</small>`}</button>`;
      return `<div class="syl ${st}"><div class="result">${text && H.slotCount(s.slots) >= s.need - 0 ? esc(text) : '&nbsp;'}</div>
        <div class="grid ${s.layout}">${slot('cho')}${slot('jung')}${s.hasJong ? slot('jong').replace('class="slot', 'class="jong slot') : ''}</div></div>`;
    }).join('');
    const doneCount = progress.done.filter((id) => list.some((w) => w.id === id)).length;
    app.innerHTML = `<div class="topbar"><button class="btn" data-go="#/theme/${word.theme}">← Back</button>
      <span>Word ${idx + 1} of ${list.length}</span><button class="btn" id="hint" ${cur.solved ? 'disabled' : ''}>Hint (${progress.hints[word.id] || 0})</button></div>
      <div class="pic" role="img" aria-label="${esc(word.english)}">${word.emoji}</div>
      <div class="meaning">${esc(word.english)}</div>
      <div class="hintline">${cur.hint || cur.solved ? esc(word.romanization) : ''}</div>
      <div class="syllables">${sylHtml}</div>
      <div class="msg">${esc(cur.msg)}</div>
      ${cur.solved ? `<div class="success"><div class="ko">${esc(word.korean)}</div><div class="rom">${esc(word.romanization)}</div><div>Great job! ✓</div>
        <div class="actions" style="margin-top:8px"><button class="btn" id="say">🔊 Listen</button><button class="btn primary" id="next">${idx + 1 < list.length ? 'Next' : 'Finish'}</button></div></div>`
      : `<div class="tray">${cur.tiles.filter((t) => !used.has(t.id)).map((t) => `<button class="tile ${cur.selected === t.id ? 'sel' : ''}" data-tile="${t.id}">${esc(t.jamo)}</button>`).join('')}</div>`}`;
    app.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => go(b.dataset.go));
    const hb = document.getElementById('hint');
    if (hb) hb.onclick = () => { cur.hint = true; progress.hints[word.id] = (progress.hints[word.id] || 0) + 1; save(); render(); };
    if (cur.solved) {
      document.getElementById('say').onclick = () => speak(word.korean);
      document.getElementById('next').onclick = () => go(idx + 1 < list.length ? '#/word/' + list[idx + 1].id : '#/theme/' + word.theme);
    }
    app.querySelectorAll('.slot').forEach((el) => el.onclick = () => onSlot(+el.dataset.syl, el.dataset.kind));
    app.querySelectorAll('.tile').forEach(bindTile);
  }

  function speak(text) {
    try {
      if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
      const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = 0.85;
      window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    } catch (e) { /* silently skip */ }
  }

  function place(tileId, si, kind) {
    const tile = cur.tiles.find((t) => t.id === tileId), s = cur.sylls[si];
    const r = H.placeInSlot(s.slots, kind, tile.jamo);
    if (!r.ok) { cur.msg = "That block doesn't fit there."; cur.selected = null; return render(); }
    s.ids[kind].push(tileId); cur.selected = null; cur.msg = '';
    if (status(s) === 'wrong') cur.msg = 'Not quite! Tap a block in that syllable to take it back.';
    if (cur.sylls.every((x) => status(x) === 'ok')) {
      cur.solved = true; cur.msg = '';
      if (!progress.done.includes(cur.word.id)) { progress.done.push(cur.word.id); save(); }
      speak(cur.word.korean);
    }
    render();
  }
  function onSlot(si, kind) {
    if (cur.solved) return;
    if (cur.selected !== null) return place(cur.selected, si, kind);
    const s = cur.sylls[si];
    if (s.slots[kind].length) { H.removeFromSlot(s.slots, kind); s.ids[kind].pop(); cur.msg = ''; render(); }
  }

  // tap to select; drag (pointer) to drop on a slot
  function bindTile(el) {
    const id = +el.dataset.tile;
    el.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      const x0 = e.clientX, y0 = e.clientY; let ghost = null, last = null;
      const move = (ev) => {
        if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) {
          ghost = el.cloneNode(true); ghost.classList.add('ghost-tile'); document.body.appendChild(ghost);
        }
        if (ghost) {
          ghost.style.left = ev.clientX + 'px'; ghost.style.top = ev.clientY + 'px';
          const t = document.elementFromPoint(ev.clientX, ev.clientY), sl = t && t.closest && t.closest('.slot');
          if (last && last !== sl) last.classList.remove('target');
          if (sl) sl.classList.add('target'); last = sl;
        }
      };
      const up = (ev) => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
        if (!ghost) { cur.selected = cur.selected === id ? null : id; cur.msg = ''; return render(); }
        ghost.remove();
        const t = document.elementFromPoint(ev.clientX, ev.clientY), sl = t && t.closest && t.closest('.slot');
        if (sl && ev.type === 'pointerup') place(id, +sl.dataset.syl, sl.dataset.kind); else render();
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    });
  }

  window.HangulGame = { route };
  route();
})();
