# RESULT — Hangul Blocks (탭 자동배치 · 즉시 정답 연출 · EN/ZH)

## 파일
`index.html`, `css/style.css`, `js/hangul.js`(조합 엔진, 변경 없음), `js/words.js`(+`chinese`), `js/i18n.js`(en/zh 문구·언어 감지), `js/puzzle.js`(탭 자동배치 순수 로직), `js/fx.js`(canvas 폭죽/컨페티), `js/game.js`(UI), `tests/hangul.test.js`, `tests/puzzle.test.js`, `tests/i18n.test.js`, `tests/browser-check.html`, `README.md`, `robots.txt`, `.nojekyll`, 스크린샷 4장

## 고훈 피드백 반영
1. **드래그 제거**: 포인터 드래그, ghost-tile, `touch-action:none` 삭제. 타일 탭 = 다음 빈 칸 자동 배치(왼쪽 음절부터, 초성→중성→종성, 겹모음/겹받침은 같은 슬롯에 순서대로). 틀린 자모도 들어가되 해당 음절 흔들림 + 문구. 슬롯 탭 = 트레이로 되돌리기. 2단계 탭 방식 없음.
2. **확인 버튼 없음**: 마지막 자모로 단어가 정답과 정확히 일치하는 순간 중앙에 큰 `Correct!`/`正确!`, canvas 폭죽·컨페티(외부 라이브러리 없음, 약 2.8초, DPR≤2), `speechSynthesis` ko-KR 발음(없으면 생략), 발음 시도 후 `Next Stage`/`下一关`(마지막 단어는 `Finish`/`完成` → 홈의 주제 목록). 오답은 흔들림만, 축하 없음.
3. **EN/中文**: 모든 화면에 언어 전환, `localStorage` `hangul-blocks-lang`, 기본값은 저장값 → `navigator.language(s)`가 zh면 zh → en. 전환 즉시 재렌더(진행도·퍼즐 상태 유지). 버튼/안내/확인창/aria-label/슬롯 라벨/테마 이름/진행 문구/오답·정답 문구 모두 i18n. 중국어 뜻은 요청 목록 그대로.

## 단어 30개
| # | 한글 | 로마자 | English | 中文 | 주제 |
|---|---|---|---|---|---|
| 1 | 밥 | bap | rice; a meal | 米饭；一餐 | Food / 食物 |
| 2 | 물 | mul | water | 水 | Food / 食物 |
| 3 | 김치 | gimchi | kimchi | 韩国泡菜 | Food / 食物 |
| 4 | 비빔밥 | bibimbap | bibimbap (rice mixed with vegetables and meat) | 拌饭（蔬菜和肉拌米饭） | Food / 食物 |
| 5 | 떡볶이 | tteokbokki | tteokbokki (spicy rice cakes) | 炒年糕 | Food / 食物 |
| 6 | 라면 | ramyeon | ramyeon (instant noodles) | 拉面（方便面） | Food / 食物 |
| 7 | 불고기 | bulgogi | bulgogi (marinated grilled beef) | 烤肉（韩式腌制牛肉） | Food / 食物 |
| 8 | 사과 | sagwa | apple | 苹果 | Food / 食物 |
| 9 | 김밥 | gimbap | gimbap (seaweed rice roll) | 紫菜包饭 | Food / 食物 |
| 10 | 빵 | ppang | bread | 面包 | Food / 食物 |
| 11 | 안녕 | annyeong | hi (informal) | 嗨（非正式） | Greetings / 问候 |
| 12 | 안녕하세요 | annyeonghaseyo | hello | 你好 | Greetings / 问候 |
| 13 | 감사합니다 | gamsahamnida | thank you | 谢谢 | Greetings / 问候 |
| 14 | 네 | ne | yes | 是 | Greetings / 问候 |
| 15 | 아니요 | aniyo | no | 不是 | Greetings / 问候 |
| 16 | 미안해요 | mianhaeyo | sorry | 对不起 | Greetings / 问候 |
| 17 | 주세요 | juseyo | please (give me) | 请给我 | Greetings / 问候 |
| 18 | 괜찮아요 | gwaenchanayo | it's okay | 没关系 | Greetings / 问候 |
| 19 | 사랑해요 | saranghaeyo | I love you | 我爱你 | Greetings / 问候 |
| 20 | 반갑습니다 | bangapseumnida | nice to meet you | 很高兴见到你 | Greetings / 问候 |
| 21 | 사랑 | sarang | love | 爱 | K-drama & Everyday / 韩剧与日常 |
| 22 | 친구 | chingu | friend | 朋友 | K-drama & Everyday / 韩剧与日常 |
| 23 | 가족 | gajok | family | 家人 | K-drama & Everyday / 韩剧与日常 |
| 24 | 집 | jip | house; home | 家；房子 | K-drama & Everyday / 韩剧与日常 |
| 25 | 학교 | hakgyo | school | 学校 | K-drama & Everyday / 韩剧与日常 |
| 26 | 전화 | jeonhwa | phone; a call | 电话 | K-drama & Everyday / 韩剧与日常 |
| 27 | 마음 | maeum | heart; mind | 心；心情 | K-drama & Everyday / 韩剧与日常 |
| 28 | 꿈 | kkum | dream | 梦 | K-drama & Everyday / 韩剧与日常 |
| 29 | 오빠 | oppa | older brother (said by a woman); also a familiar term | 哥哥（女性对年长男性的称呼；也可作亲昵称呼） | K-drama & Everyday / 韩剧与日常 |
| 30 | 운명 | unmyeong | fate; destiny | 命运 | K-drama & Everyday / 韩剧与日常 |

## 디버그
`#/word/<id>`, `?lang=zh|en`(저장 안 함), `?solve=1`(로드 후 정답 자동 탭), `&still=1`(폭죽 프레임 고정; 스크린샷용).

## 검증 결과
- `node tests/hangul.test.js`: 18 통과 / 0 실패
- `node tests/puzzle.test.js`: 7 통과 / 0 실패 (30단어를 `place`로 순서대로 채우면 마지막 자모에서만 정답 판정)
- `node tests/i18n.test.js`: 9 통과 / 0 실패
- 헤드리스 Chrome `tests/browser-check.html` → `BROWSER_CHECK_PASS` (6회 반복 모두 통과): 엔진 30단어 조립 + 실제 DOM 타일 탭으로 en/zh 각각 30단어 완성(마지막 자모에서 축하 표시, 그 전에는 없음) + 오답 시 축하 없음/슬롯 탭 되돌리기 + zh 화면에 영어 잔여 없음
- 스크린샷(390×844, 직접 열어 확인): `screenshot-zh-home.png`, `screenshot-correct.png`(중앙 `正确!` + 불꽃·컨페티), `screenshot-zh-puzzle.png`(苹果·提示·返回), `screenshot-mobile.png`(영어 퍼즐)

## 알려진 한계
- 실제 터치 기기, 실제 음성 출력, 폭죽의 실시간 부드러움은 헤드리스에서 확인 불가(정지 프레임과 코드 구현만 확인).
- 이모지 모양은 OS별로 다름. 중국어 UI의 음성 안내는 한국어 단어 발음만.
- 구 `screenshot-hello.png`(드래그 시절 화면)는 오래된 UI라 삭제함.
