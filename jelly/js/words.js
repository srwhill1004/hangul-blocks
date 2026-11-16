/* 30 words. Romanization: Revised Romanization of Korean (2000). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HangulData = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const THEMES = [
  {
    "id": "food",
    "name": "Food",
    "chinese": "食物"
  },
  {
    "id": "greetings",
    "name": "Greetings",
    "chinese": "问候"
  },
  {
    "id": "everyday",
    "name": "K-drama & Everyday",
    "chinese": "韩剧与日常"
  }
];
  const WORDS = [
  {
    "id": "bap",
    "theme": "food",
    "korean": "밥",
    "romanization": "bap",
    "english": "rice; a meal",
    "chinese": "米饭；一餐",
    "emoji": "🍚"
  },
  {
    "id": "mul",
    "theme": "food",
    "korean": "물",
    "romanization": "mul",
    "english": "water",
    "chinese": "水",
    "emoji": "💧"
  },
  {
    "id": "gimchi",
    "theme": "food",
    "korean": "김치",
    "romanization": "gimchi",
    "english": "kimchi",
    "chinese": "韩国泡菜",
    "emoji": "🥬"
  },
  {
    "id": "bibimbap",
    "theme": "food",
    "korean": "비빔밥",
    "romanization": "bibimbap",
    "english": "bibimbap (rice mixed with vegetables and meat)",
    "chinese": "拌饭（蔬菜和肉拌米饭）",
    "emoji": "🥗"
  },
  {
    "id": "tteokbokki",
    "theme": "food",
    "korean": "떡볶이",
    "romanization": "tteokbokki",
    "english": "tteokbokki (spicy rice cakes)",
    "chinese": "炒年糕",
    "emoji": "🌶️"
  },
  {
    "id": "ramyeon",
    "theme": "food",
    "korean": "라면",
    "romanization": "ramyeon",
    "english": "ramyeon (instant noodles)",
    "chinese": "拉面（方便面）",
    "emoji": "🍜"
  },
  {
    "id": "bulgogi",
    "theme": "food",
    "korean": "불고기",
    "romanization": "bulgogi",
    "english": "bulgogi (marinated grilled beef)",
    "chinese": "烤肉（韩式腌制牛肉）",
    "emoji": "🥩"
  },
  {
    "id": "sagwa",
    "theme": "food",
    "korean": "사과",
    "romanization": "sagwa",
    "english": "apple",
    "chinese": "苹果",
    "emoji": "🍎"
  },
  {
    "id": "gimbap",
    "theme": "food",
    "korean": "김밥",
    "romanization": "gimbap",
    "english": "gimbap (seaweed rice roll)",
    "chinese": "紫菜包饭",
    "emoji": "🍙"
  },
  {
    "id": "ppang",
    "theme": "food",
    "korean": "빵",
    "romanization": "ppang",
    "english": "bread",
    "chinese": "面包",
    "emoji": "🍞"
  },
  {
    "id": "annyeong",
    "theme": "greetings",
    "korean": "안녕",
    "romanization": "annyeong",
    "english": "hi (informal)",
    "chinese": "嗨（非正式）",
    "emoji": "👋"
  },
  {
    "id": "annyeonghaseyo",
    "theme": "greetings",
    "korean": "안녕하세요",
    "romanization": "annyeonghaseyo",
    "english": "hello",
    "chinese": "你好",
    "emoji": "🙋"
  },
  {
    "id": "gamsahamnida",
    "theme": "greetings",
    "korean": "감사합니다",
    "romanization": "gamsahamnida",
    "english": "thank you",
    "chinese": "谢谢",
    "emoji": "🙏"
  },
  {
    "id": "ne",
    "theme": "greetings",
    "korean": "네",
    "romanization": "ne",
    "english": "yes",
    "chinese": "是",
    "emoji": "✅"
  },
  {
    "id": "aniyo",
    "theme": "greetings",
    "korean": "아니요",
    "romanization": "aniyo",
    "english": "no",
    "chinese": "不是",
    "emoji": "🙅"
  },
  {
    "id": "mianhaeyo",
    "theme": "greetings",
    "korean": "미안해요",
    "romanization": "mianhaeyo",
    "english": "sorry",
    "chinese": "对不起",
    "emoji": "😔"
  },
  {
    "id": "juseyo",
    "theme": "greetings",
    "korean": "주세요",
    "romanization": "juseyo",
    "english": "please (give me)",
    "chinese": "请给我",
    "emoji": "🤲"
  },
  {
    "id": "gwaenchanayo",
    "theme": "greetings",
    "korean": "괜찮아요",
    "romanization": "gwaenchanayo",
    "english": "it's okay",
    "chinese": "没关系",
    "emoji": "👌"
  },
  {
    "id": "saranghaeyo",
    "theme": "greetings",
    "korean": "사랑해요",
    "romanization": "saranghaeyo",
    "english": "I love you",
    "chinese": "我爱你",
    "emoji": "🥰"
  },
  {
    "id": "bangapseumnida",
    "theme": "greetings",
    "korean": "반갑습니다",
    "romanization": "bangapseumnida",
    "english": "nice to meet you",
    "chinese": "很高兴见到你",
    "emoji": "🤝"
  },
  {
    "id": "sarang",
    "theme": "everyday",
    "korean": "사랑",
    "romanization": "sarang",
    "english": "love",
    "chinese": "爱",
    "emoji": "❤️"
  },
  {
    "id": "chingu",
    "theme": "everyday",
    "korean": "친구",
    "romanization": "chingu",
    "english": "friend",
    "chinese": "朋友",
    "emoji": "👫"
  },
  {
    "id": "gajok",
    "theme": "everyday",
    "korean": "가족",
    "romanization": "gajok",
    "english": "family",
    "chinese": "家人",
    "emoji": "👨‍👩‍👧"
  },
  {
    "id": "jip",
    "theme": "everyday",
    "korean": "집",
    "romanization": "jip",
    "english": "house; home",
    "chinese": "家；房子",
    "emoji": "🏠"
  },
  {
    "id": "hakgyo",
    "theme": "everyday",
    "korean": "학교",
    "romanization": "hakgyo",
    "english": "school",
    "chinese": "学校",
    "emoji": "🏫"
  },
  {
    "id": "jeonhwa",
    "theme": "everyday",
    "korean": "전화",
    "romanization": "jeonhwa",
    "english": "phone; a call",
    "chinese": "电话",
    "emoji": "📱"
  },
  {
    "id": "maeum",
    "theme": "everyday",
    "korean": "마음",
    "romanization": "maeum",
    "english": "heart; mind",
    "chinese": "心；心情",
    "emoji": "💛"
  },
  {
    "id": "kkum",
    "theme": "everyday",
    "korean": "꿈",
    "romanization": "kkum",
    "english": "dream",
    "chinese": "梦",
    "emoji": "💭"
  },
  {
    "id": "oppa",
    "theme": "everyday",
    "korean": "오빠",
    "romanization": "oppa",
    "english": "older brother (said by a woman); also a familiar term",
    "chinese": "哥哥（女性对年长男性的称呼；也可作亲昵称呼）",
    "emoji": "🧑"
  },
  {
    "id": "unmyeong",
    "theme": "everyday",
    "korean": "운명",
    "romanization": "unmyeong",
    "english": "fate; destiny",
    "chinese": "命运",
    "emoji": "✨"
  }
];
  return { THEMES, WORDS };
});
