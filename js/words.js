/* 30 words. Romanization: Revised Romanization of Korean (2000). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HangulData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const THEMES = [
  {
    "id": "food",
    "name": "Food"
  },
  {
    "id": "greetings",
    "name": "Greetings"
  },
  {
    "id": "everyday",
    "name": "K-drama & Everyday"
  }
];
  const WORDS = [
  {
    "id": "bap",
    "theme": "food",
    "korean": "밥",
    "romanization": "bap",
    "english": "rice; a meal",
    "emoji": "🍚"
  },
  {
    "id": "mul",
    "theme": "food",
    "korean": "물",
    "romanization": "mul",
    "english": "water",
    "emoji": "💧"
  },
  {
    "id": "gimchi",
    "theme": "food",
    "korean": "김치",
    "romanization": "gimchi",
    "english": "kimchi",
    "emoji": "🥬"
  },
  {
    "id": "bibimbap",
    "theme": "food",
    "korean": "비빔밥",
    "romanization": "bibimbap",
    "english": "bibimbap (rice mixed with vegetables and meat)",
    "emoji": "🥗"
  },
  {
    "id": "tteokbokki",
    "theme": "food",
    "korean": "떡볶이",
    "romanization": "tteokbokki",
    "english": "tteokbokki (spicy rice cakes)",
    "emoji": "🌶️"
  },
  {
    "id": "ramyeon",
    "theme": "food",
    "korean": "라면",
    "romanization": "ramyeon",
    "english": "ramyeon (instant noodles)",
    "emoji": "🍜"
  },
  {
    "id": "bulgogi",
    "theme": "food",
    "korean": "불고기",
    "romanization": "bulgogi",
    "english": "bulgogi (marinated grilled beef)",
    "emoji": "🥩"
  },
  {
    "id": "sagwa",
    "theme": "food",
    "korean": "사과",
    "romanization": "sagwa",
    "english": "apple",
    "emoji": "🍎"
  },
  {
    "id": "gimbap",
    "theme": "food",
    "korean": "김밥",
    "romanization": "gimbap",
    "english": "gimbap (seaweed rice roll)",
    "emoji": "🍙"
  },
  {
    "id": "ppang",
    "theme": "food",
    "korean": "빵",
    "romanization": "ppang",
    "english": "bread",
    "emoji": "🍞"
  },
  {
    "id": "annyeong",
    "theme": "greetings",
    "korean": "안녕",
    "romanization": "annyeong",
    "english": "hi (informal)",
    "emoji": "👋"
  },
  {
    "id": "annyeonghaseyo",
    "theme": "greetings",
    "korean": "안녕하세요",
    "romanization": "annyeonghaseyo",
    "english": "hello",
    "emoji": "🙋"
  },
  {
    "id": "gamsahamnida",
    "theme": "greetings",
    "korean": "감사합니다",
    "romanization": "gamsahamnida",
    "english": "thank you",
    "emoji": "🙏"
  },
  {
    "id": "ne",
    "theme": "greetings",
    "korean": "네",
    "romanization": "ne",
    "english": "yes",
    "emoji": "✅"
  },
  {
    "id": "aniyo",
    "theme": "greetings",
    "korean": "아니요",
    "romanization": "aniyo",
    "english": "no",
    "emoji": "🙅"
  },
  {
    "id": "mianhaeyo",
    "theme": "greetings",
    "korean": "미안해요",
    "romanization": "mianhaeyo",
    "english": "sorry",
    "emoji": "😔"
  },
  {
    "id": "juseyo",
    "theme": "greetings",
    "korean": "주세요",
    "romanization": "juseyo",
    "english": "please (give me)",
    "emoji": "🤲"
  },
  {
    "id": "gwaenchanayo",
    "theme": "greetings",
    "korean": "괜찮아요",
    "romanization": "gwaenchanayo",
    "english": "it's okay",
    "emoji": "👌"
  },
  {
    "id": "saranghaeyo",
    "theme": "greetings",
    "korean": "사랑해요",
    "romanization": "saranghaeyo",
    "english": "I love you",
    "emoji": "🥰"
  },
  {
    "id": "bangapseumnida",
    "theme": "greetings",
    "korean": "반갑습니다",
    "romanization": "bangapseumnida",
    "english": "nice to meet you",
    "emoji": "🤝"
  },
  {
    "id": "sarang",
    "theme": "everyday",
    "korean": "사랑",
    "romanization": "sarang",
    "english": "love",
    "emoji": "❤️"
  },
  {
    "id": "chingu",
    "theme": "everyday",
    "korean": "친구",
    "romanization": "chingu",
    "english": "friend",
    "emoji": "👫"
  },
  {
    "id": "gajok",
    "theme": "everyday",
    "korean": "가족",
    "romanization": "gajok",
    "english": "family",
    "emoji": "👨‍👩‍👧"
  },
  {
    "id": "jip",
    "theme": "everyday",
    "korean": "집",
    "romanization": "jip",
    "english": "house; home",
    "emoji": "🏠"
  },
  {
    "id": "hakgyo",
    "theme": "everyday",
    "korean": "학교",
    "romanization": "hakgyo",
    "english": "school",
    "emoji": "🏫"
  },
  {
    "id": "jeonhwa",
    "theme": "everyday",
    "korean": "전화",
    "romanization": "jeonhwa",
    "english": "phone; a call",
    "emoji": "📱"
  },
  {
    "id": "maeum",
    "theme": "everyday",
    "korean": "마음",
    "romanization": "maeum",
    "english": "heart; mind",
    "emoji": "💛"
  },
  {
    "id": "kkum",
    "theme": "everyday",
    "korean": "꿈",
    "romanization": "kkum",
    "english": "dream",
    "emoji": "💭"
  },
  {
    "id": "oppa",
    "theme": "everyday",
    "korean": "오빠",
    "romanization": "oppa",
    "english": "older brother (said by a woman); also a familiar term",
    "emoji": "🧑"
  },
  {
    "id": "unmyeong",
    "theme": "everyday",
    "korean": "운명",
    "romanization": "unmyeong",
    "english": "fate; destiny",
    "emoji": "✨"
  }
];
  return { THEMES, WORDS };
});
