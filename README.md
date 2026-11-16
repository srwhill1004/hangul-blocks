# Hangul Blocks

A casual web puzzle for learners of Korean. See a picture and its meaning (English or 简体中文), then build the Korean word from consonant and vowel blocks.

## How to play
- **Tap a letter block and it jumps into the next empty slot.** Order: leftmost syllable first; each syllable is initial → vowel → (final).
- Compound vowels / finals fill the same slot part by part (for ㅘ tap ㅗ, then ㅏ; for ㄶ tap ㄴ, then ㅎ).
- A wrong block still goes in, but the syllable shakes and a short message appears. **Tap a placed block to send it back to the tray.**
- There is no check button: the moment the word matches, a big **Correct! / 正确!** appears with canvas fireworks and confetti, the Korean word is spoken (`speechSynthesis`, `ko-KR`, skipped silently if unavailable), then **Next Stage / 下一关** appears (**Finish / 完成** on the last word of a theme).
- Hint shows the romanization. Progress is saved in `localStorage` (`hangul-blocks-progress`); **Reset progress** is on the home screen.

## Language (English / 中文)
All UI text is in `js/i18n.js`. Switch with the English / 中文 control on every screen. The choice is stored in `localStorage` key `hangul-blocks-lang` (`en` | `zh`). Default: saved value, otherwise `zh` if `navigator.language(s)` starts with `zh`, otherwise `en`. Word data has `english` and `chinese` meanings; themes have `name` and `chinese`.

## Run locally
Open `index.html` in a browser (works from `file://`), or run `python3 -m http.server`.
Debug routes/flags:
- `index.html#/word/sagwa` opens a word directly.
- `?lang=zh` / `?lang=en` forces a language for that page load (not saved unless you use the switch).
- `?solve=1` auto-taps the correct blocks on load; add `&still=1` to freeze the fireworks frame (used for screenshots), e.g. `index.html?lang=zh&solve=1&still=1#/word/sagwa`.

## Romanization
Revised Romanization of Korean (National Institute of Korean Language, 2000), e.g. 김치 = gimchi, 떡볶이 = tteokbokki.

## Tests
- `node tests/hangul.test.js` – composition engine
- `node tests/puzzle.test.js` – tap auto-placement; all 30 words solve exactly at the last jamo
- `node tests/i18n.test.js` – en/zh key sets equal, no empty strings, every key used by the game exists, 30 words have english + chinese
- Open `tests/browser-check.html`; prints `BROWSER_CHECK_PASS` or `BROWSER_CHECK_FAIL` (engine assembly, tapping real tiles for 30 words in en and zh, wrong-answer behavior, no stray English in zh). Headless: `google-chrome --headless=new --no-sandbox --dump-dom file://$PWD/tests/browser-check.html`

Static HTML/JS/CSS only; no external assets or libraries.
- Tray tiles keep a fixed layout: used tiles stay as dashed empty placeholders and return to their original spot (`tests/tray-stable.html`).

## Sound
`js/audio.js` (an identical copy lives in each folder) synthesizes every sound live with the Web Audio API: a pop when a jamo goes into a slot, a whoosh when it is taken back, a short chime on a correct answer, and a quiet looping BGM (soft triangle pad + sine "music-box" arpeggio over a C-major-pentatonic 4-chord progression, scheduled endlessly so there is no loop seam). BGM starts only after the first tap/click (autoplay policy) and ducks while the Korean word is spoken. Two toggles (♪ music, 🔔 effects) sit next to the language switch on every screen; settings are stored in `localStorage` key `hangul-blocks-sound` (default: both on). If Web Audio is missing or suspended, sounds are skipped silently. Tests turn audio off with `HangulGame.setTest({audio:false})`; `node tests/audio.test.js` checks the module with a mock AudioContext.
