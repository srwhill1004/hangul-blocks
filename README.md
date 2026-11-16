# Hangul Blocks

A casual web puzzle for learners of Korean. See a picture and its English meaning, then build the Korean word from consonant and vowel blocks.

## How to play
- Tap a block to select it, then tap an empty slot (initial / vowel / final). Or drag a block onto a slot.
- Tap a filled slot to return its block to the tray.
- Compound vowels are built from parts in the vowel slot (ㅗ+ㅏ=ㅘ). Compound final consonants are built in the final slot (ㄴ+ㅎ=ㄶ). Double consonants (ㄲ ㄸ ㅃ ㅆ ㅉ) are single blocks.
- Hint shows the romanization. Progress is saved in `localStorage` (`hangul-blocks-progress`); use **Reset progress** on the home screen to clear it.

## Run locally
Open `index.html` in a browser (works from `file://`), or run `python3 -m http.server` and visit `http://localhost:8000/`.
Debug: `index.html#/word/sagwa` opens a word directly.

## Romanization
Revised Romanization of Korean (National Institute of Korean Language, 2000), e.g. 김치 = gimchi, 떡볶이 = tteokbokki.

## Tests
- `node tests/hangul.test.js` (Node built-in `assert`)
- Open `tests/browser-check.html`; the page prints `BROWSER_CHECK_PASS` or `BROWSER_CHECK_FAIL`. Headless: `google-chrome --headless=new --dump-dom file://$PWD/tests/browser-check.html`

Static HTML/JS/CSS only; no external assets.
