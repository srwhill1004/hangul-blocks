# RESULT — Hangul Blocks 시제품

## 만든 파일
`index.html`, `css/style.css`, `js/hangul.js`(조합 엔진), `js/words.js`(30단어), `js/game.js`(UI·진행), `tests/hangul.test.js`, `tests/browser-check.html`, `robots.txt`, `.nojekyll`, `README.md`(영어), `RESULT.md`, `screenshot-mobile.png`

## 구현한 기능
- 홈(이름·설명·주제 3개·전체 진행도 n/30), 주제별 단어 목록(완료 ✓ 표시), 퍼즐 화면
- 이모지 + 영어 뜻 표시, 정답 숨김, Hint(로마자 표시, 사용 횟수 표시)
- 초성/중성/종성 슬롯을 모음 유형(세로·가로·겹모음)에 따라 배치. 슬롯 순서대로 음절 조립
- 탭(선택 후 슬롯 탭) + 포인터 드래그앤드롭, 슬롯 탭으로 되돌리기
- 겹모음 7개(ㅗ+ㅏ 등), 겹받침 11개(ㄴ+ㅎ=ㄶ 등)를 구성 자모로 결합. 쌍자음은 단일 타일
- 오답 시 해당 음절만 표시 후 수정 가능(전체 리셋 없음)
- 성공 시 `speechSynthesis` ko-KR 발음(미지원 시 조용히 생략), 한글·로마자 표시, Next
- `localStorage`(`hangul-blocks-progress`) 저장, Reset progress(확인창)
- 모바일 우선 반응형, 터치 영역 ≥44px, safe-area, 줄바꿈 레이아웃, `noindex` 메타

## 단어 30개
| # | 한글 | 로마자 | 영어 뜻 | 주제 |
|---|---|---|---|---|
| 1 | 밥 | bap | rice; a meal | Food |
| 2 | 물 | mul | water | Food |
| 3 | 김치 | gimchi | kimchi | Food |
| 4 | 비빔밥 | bibimbap | bibimbap (rice mixed with vegetables and meat) | Food |
| 5 | 떡볶이 | tteokbokki | tteokbokki (spicy rice cakes) | Food |
| 6 | 라면 | ramyeon | ramyeon (instant noodles) | Food |
| 7 | 불고기 | bulgogi | bulgogi (marinated grilled beef) | Food |
| 8 | 사과 | sagwa | apple | Food |
| 9 | 김밥 | gimbap | gimbap (seaweed rice roll) | Food |
| 10 | 빵 | ppang | bread | Food |
| 11 | 안녕 | annyeong | hi (informal) | Greetings |
| 12 | 안녕하세요 | annyeonghaseyo | hello | Greetings |
| 13 | 감사합니다 | gamsahamnida | thank you | Greetings |
| 14 | 네 | ne | yes | Greetings |
| 15 | 아니요 | aniyo | no | Greetings |
| 16 | 미안해요 | mianhaeyo | sorry | Greetings |
| 17 | 주세요 | juseyo | please (give me) | Greetings |
| 18 | 괜찮아요 | gwaenchanayo | it's okay | Greetings |
| 19 | 사랑해요 | saranghaeyo | I love you | Greetings |
| 20 | 반갑습니다 | bangapseumnida | nice to meet you | Greetings |
| 21 | 사랑 | sarang | love | K-drama & Everyday |
| 22 | 친구 | chingu | friend | K-drama & Everyday |
| 23 | 가족 | gajok | family | K-drama & Everyday |
| 24 | 집 | jip | house; home | K-drama & Everyday |
| 25 | 학교 | hakgyo | school | K-drama & Everyday |
| 26 | 전화 | jeonhwa | phone; a call | K-drama & Everyday |
| 27 | 마음 | maeum | heart; mind | K-drama & Everyday |
| 28 | 꿈 | kkum | dream | K-drama & Everyday |
| 29 | 오빠 | oppa | older brother (said by a woman); also a familiar term | K-drama & Everyday |
| 30 | 운명 | unmyeong | fate; destiny | K-drama & Everyday |

## 단위 테스트
- 명령: `node tests/hangul.test.js`
- 결과: 18개 테스트 통과, 0개 실패 (사과·밥·물·집·빵·꿈·김치·학교·전화·괜찮아요·긴 인사말, 30단어 코드포인트 일치, 잘못된 조합 null, 겹모음 7/겹받침 11 왕복, 호환/첫가끝 자모 동일 결과 포함)

## 브라우저 검사
- `google-chrome --headless=new --dump-dom tests/browser-check.html` → **BROWSER_CHECK_PASS** (30단어 자동 조립)
- 스크린샷(390×844, 사과 퍼즐): `/workspace/dev/hangul-puzzle/screenshot-mobile.png`
- 괜찮아요 화면 dump-dom 시 콘솔 에러 0건

## 알려진 한계
- 실제 터치 기기·드래그 동작은 헤드리스에서 자동 검증하지 못함(코드 구현만, 수동 확인 필요)
- 겹모음 슬롯은 실제 글자 모양 대신 단일 가로 칸으로 단순화
- 한국어 음성은 기기·브라우저 음성 지원에 의존. 이모지 모양은 OS별로 다름
- 일부 그림(안녕하세요, 아니요 등)은 이모지로 대체(직접 SVG 아님)
- 로마자 30개는 제공된 목록을 그대로 사용(별도 웹 검색 검증은 하지 않음)

## 열기
`/workspace/dev/hangul-puzzle/index.html` (예: `file:///workspace/dev/hangul-puzzle/index.html#/word/sagwa`)

## 로컬 커밋
