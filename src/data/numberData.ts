import { NumberGuideItem, QuizQuestion } from '../types/quiz';

export const BASIC_NUMBERS: NumberGuideItem[] = [
  { value: 0, kanji: '零', kana: 'ぜろ / れい', romaji: 'zero / rei' },
  { value: 1, kanji: '一', kana: 'いち', romaji: 'ichi' },
  { value: 2, kanji: '二', kana: 'に', romaji: 'ni' },
  { value: 3, kanji: '三', kana: 'さん', romaji: 'san' },
  { value: 4, kanji: '四', kana: 'よん / し', romaji: 'yon / shi', note: '一般算數與時間多用よん' },
  { value: 5, kanji: '五', kana: 'ご', romaji: 'go' },
  { value: 6, kanji: '六', kana: 'ろく', romaji: 'roku' },
  { value: 7, kanji: '七', kana: 'なな / しち', romaji: 'nana / shichi', note: '一般算數多用なな，時間7點常讀しちじ' },
  { value: 8, kanji: '八', kana: 'はち', romaji: 'hachi' },
  { value: 9, kanji: '九', kana: 'きゅう / く', romaji: 'kyū / ku', note: '一般用きゅう，時間9點讀くじ' },
  { value: 10, kanji: '十', kana: 'じゅう', romaji: 'jū', note: '期中考原題：小寫ゅ長音' },
];

export const HUNDREDS: NumberGuideItem[] = [
  { value: 100, kanji: '百', kana: 'ひゃく', romaji: 'hyaku', note: '清音拗音' },
  { value: 200, kanji: '二百', kana: 'にひゃく', romaji: 'nihyaku' },
  { value: 300, kanji: '三百', kana: 'さんびゃく', romaji: 'sanbyaku', isSpecialChange: true, note: '★濁音音變：びゃく' },
  { value: 400, kanji: '四百', kana: 'よんひゃく', romaji: 'yonhyaku' },
  { value: 500, kanji: '五百', kana: 'ごひゃく', romaji: 'gohyaku' },
  { value: 600, kanji: '六百', kana: 'ろっぴゃく', romaji: 'roppyaku', isSpecialChange: true, note: '★促音＋半濁音：ろっぴゃく' },
  { value: 700, kanji: '七百', kana: 'ななひゃく', romaji: 'nanahyaku' },
  { value: 800, kanji: '八百', kana: 'はっぴゃく', romaji: 'happyaku', isSpecialChange: true, note: '★促音＋半濁音：はっぴゃく' },
  { value: 900, kanji: '九百', kana: 'きゅうひゃく', romaji: 'kyūhyaku' },
];

export const THOUSANDS: NumberGuideItem[] = [
  { value: 1000, kanji: '千', kana: 'せん', romaji: 'sen', note: '1000不需說いちせん，直接說せん' },
  { value: 2000, kanji: '二千', kana: 'にせん', romaji: 'nisen' },
  { value: 3000, kanji: '三千', kana: 'さんぜん', romaji: 'sanzen', isSpecialChange: true, note: '★濁音音變：さんぜん' },
  { value: 4000, kanji: '四千', kana: 'よんせん', romaji: 'yonsen' },
  { value: 5000, kanji: '五千', kana: 'ごせん', romaji: 'gosen' },
  { value: 6000, kanji: '六千', kana: 'ろくせん', romaji: 'rokusen' },
  { value: 7000, kanji: '七千', kana: 'ななせん', romaji: 'nanasen' },
  { value: 8000, kanji: '八千', kana: 'はっせん', romaji: 'hassen', isSpecialChange: true, note: '★促音音變：はっせん' },
  { value: 9000, kanji: '九千', kana: 'きゅうせん', romaji: 'kyūsen' },
  { value: 10000, kanji: '一万', kana: 'いちまん', romaji: 'ichiman', note: '一萬必須加「いち」：いちまん' },
];

export interface JapaneseNumberReading {
  kana: string;
  romaji: string;
  parts: { chunk: string; kana: string; note?: string }[];
}

const ONES_KANA = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const ONES_ROMAJI = ['', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyū'];

const TENS_KANA = ['', 'じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう', 'ろくじゅう', 'ななじゅう', 'はちじゅう', 'きゅうじゅう'];
const TENS_ROMAJI = ['', 'jū', 'nijū', 'sanjū', 'yonjū', 'gojū', 'rokujū', 'nanajū', 'hachijū', 'kyūjū'];

const HUNDREDS_KANA = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
const HUNDREDS_ROMAJI = ['', 'hyaku', 'nihyaku', 'sanbyaku', 'yonhyaku', 'gohyaku', 'roppyaku', 'nanahyaku', 'happyaku', 'kyūhyaku'];

const THOUSANDS_KANA = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];
const THOUSANDS_ROMAJI = ['', 'sen', 'nisen', 'sanzen', 'yonsen', 'gosen', 'rokusen', 'nanasen', 'hassen', 'kyūsen'];

/**
 * Convert any integer 0..99,999 into natural Tokyo Japanese kana, romaji, and structural breakdown
 */
export function numberToJapanese(num: number): JapaneseNumberReading {
  const n = Math.max(0, Math.min(99999, Math.floor(num)));
  if (n === 0) {
    return {
      kana: 'ぜろ',
      romaji: 'zero',
      parts: [{ chunk: '0', kana: 'ぜろ' }],
    };
  }

  const parts: { chunk: string; kana: string; note?: string }[] = [];
  const romajiParts: string[] = [];

  const man = Math.floor(n / 10000);
  const remAfterMan = n % 10000;
  const thou = Math.floor(remAfterMan / 1000);
  const remAfterThou = remAfterMan % 1000;
  const hund = Math.floor(remAfterThou / 100);
  const remAfterHund = remAfterThou % 100;
  const ten = Math.floor(remAfterHund / 10);
  const one = remAfterHund % 10;

  if (man > 0) {
    const manKana = `${ONES_KANA[man]}まん`;
    const manRomaji = `${ONES_ROMAJI[man]}man`;
    parts.push({
      chunk: `${(man * 10000).toLocaleString()}`,
      kana: manKana,
      note: man === 1 ? '一萬必須加いち' : undefined,
    });
    romajiParts.push(manRomaji);
  }

  if (thou > 0) {
    const thouKana = THOUSANDS_KANA[thou];
    parts.push({
      chunk: `${(thou * 1000).toLocaleString()}`,
      kana: thouKana,
      note: thou === 3 ? '★濁音さんぜん' : thou === 8 ? '★促音はっせん' : undefined,
    });
    romajiParts.push(THOUSANDS_ROMAJI[thou]);
  }

  if (hund > 0) {
    const hundKana = HUNDREDS_KANA[hund];
    parts.push({
      chunk: `${hund * 100}`,
      kana: hundKana,
      note:
        hund === 3
          ? '★濁音さんびゃく'
          : hund === 6
          ? '★促音+半濁音ろっぴゃく'
          : hund === 8
          ? '★促音+半濁音はっぴゃく'
          : undefined,
    });
    romajiParts.push(HUNDREDS_ROMAJI[hund]);
  }

  if (ten > 0) {
    parts.push({
      chunk: `${ten * 10}`,
      kana: TENS_KANA[ten],
    });
    romajiParts.push(TENS_ROMAJI[ten]);
  }

  if (one > 0) {
    parts.push({
      chunk: `${one}`,
      kana: ONES_KANA[one],
    });
    romajiParts.push(ONES_ROMAJI[one]);
  }

  return {
    kana: parts.map((p) => p.kana).join(''),
    romaji: romajiParts.join(' '),
    parts,
  };
}

export type NumberPracticeTier = 'basic' | 'hundreds' | 'thousands' | 'mixed';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Dynamically generate a high-value "Hear Japanese Number -> Pick Arabic Number" question
 * with smart distractors that test digit order, zero count, and sound changes (3/6/8).
 */
export function generateRandomNumberQuestion(
  tier: NumberPracticeTier,
  questionIndex: number
): QuizQuestion {
  const effectiveTier: Exclude<NumberPracticeTier, 'mixed'> =
    tier === 'mixed' ? pickRandom(['basic', 'hundreds', 'thousands']) : tier;

  let target = 300;
  const distractorPool = new Set<number>();

  if (effectiveTier === 'basic') {
    const highFreqBasics = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 17, 19, 24, 36, 40, 48, 55, 63, 70, 74, 80, 88, 90, 99];
    target = Math.random() < 0.7 ? pickRandom(highFreqBasics) : Math.floor(Math.random() * 99) + 1;

    // Smart distractors: swapped digits, +/- 10, 4/7/9 confusions
    if (target >= 10) {
      const tens = Math.floor(target / 10);
      const ones = target % 10;
      if (ones > 0 && ones !== tens) distractorPool.add(ones * 10 + tens);
      if (tens < 9) distractorPool.add((tens + 1) * 10 + ones);
      if (tens > 1) distractorPool.add((tens - 1) * 10 + ones);
    } else {
      [4, 7, 8, 9, 6, 3].forEach((n) => {
        if (n !== target) distractorPool.add(n);
      });
    }
    if (target === 4) distractorPool.add(40);
    if (target === 7) distractorPool.add(70);
    if (target === 9) distractorPool.add(90);
  } else if (effectiveTier === 'hundreds') {
    const specialHundreds = [100, 200, 300, 400, 500, 600, 700, 800, 900, 150, 240, 300, 320, 360, 380, 450, 600, 630, 650, 680, 740, 800, 830, 860, 890, 910];
    target =
      Math.random() < 0.75
        ? pickRandom(specialHundreds)
        : (Math.floor(Math.random() * 9) + 1) * 100 + Math.floor(Math.random() * 9 + 1) * 10;

    const h = Math.floor(target / 100);
    const rem = target % 100;
    // Swap 3 / 6 / 8 hundreds sound changes
    [3, 6, 8, 1, 4, 7, 9].forEach((altH) => {
      if (altH !== h) distractorPool.add(altH * 100 + rem);
    });
    if (rem === 0) {
      distractorPool.add(h * 10);
      distractorPool.add(h * 1000);
    } else {
      const t = Math.floor(rem / 10);
      if (t !== h) distractorPool.add(t * 100 + h * 10 + (rem % 10));
      distractorPool.add(h * 100);
    }
  } else {
    const specialThousands = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 1300, 1600, 1800, 2300, 2600, 3000, 3500, 3600, 3800, 4800, 6300, 7800, 8000, 8300, 8600, 9800, 10500, 12000];
    target =
      Math.random() < 0.8
        ? pickRandom(specialThousands)
        : (Math.floor(Math.random() * 9) + 1) * 1000 + pickRandom([0, 300, 600, 800, 500]);

    if (target >= 10000) {
      [1000, 10000, 10300, 10500, 10800, 12000, 20000, 8000].forEach((v) => {
        if (v !== target) distractorPool.add(v);
      });
    } else {
      const k = Math.floor(target / 1000);
      const rem = target % 1000;
      [3, 8, 1, 6, 4, 7].forEach((altK) => {
        if (altK !== k) distractorPool.add(altK * 1000 + rem);
      });
      if (rem > 0) {
        [300, 600, 800, 0].forEach((altH) => {
          if (altH !== rem) distractorPool.add(k * 1000 + altH);
        });
      } else {
        distractorPool.add(k * 100);
      }
    }
  }

  // Ensure we always have 3 unique distractors
  while (distractorPool.size < 3) {
    const fallback =
      effectiveTier === 'basic'
        ? Math.floor(Math.random() * 99) + 1
        : effectiveTier === 'hundreds'
        ? (Math.floor(Math.random() * 9) + 1) * 100
        : (Math.floor(Math.random() * 9) + 1) * 1000;
    if (fallback !== target) distractorPool.add(fallback);
  }

  const chosenDistractors = shuffleArray(Array.from(distractorPool)).slice(0, 3);
  const allNumbers = shuffleArray([target, ...chosenDistractors]);
  const correctIndex = allNumbers.indexOf(target);

  const info = numberToJapanese(target);
  const breakdownText = info.parts
    .map((p) => `${p.chunk}＝「${p.kana}」${p.note ? `(${p.note})` : ''}`)
    .join(' ＋ ');

  return {
    id: `rand-num-${Date.now()}-${questionIndex}`,
    category: 'numbers',
    categoryLabel:
      effectiveTier === 'basic'
        ? '聽音選數字 · 0～99 基礎'
        : effectiveTier === 'hundreds'
        ? '聽音選數字 · 百位音變'
        : '聽音選數字 · 千萬大數',
    prompt: '請聽日文數字發音，選出正確的數字：',
    promptSub: '聽力實戰：注意「3/6/8」音變與位數零的個數',
    promptType: 'audio_only',
    audioText: info.kana,
    options: allNumbers.map((n) => n.toLocaleString()),
    correctIndex,
    furigana: info.kana,
    romaji: info.romaji,
    meaningZh: `數字 ${target.toLocaleString()}`,
    soundWarning: info.parts.find((p) => p.note)?.note,
    explanation: `語音唸作「${info.kana} (${info.romaji})」。\n結構拆解：${breakdownText}。`,
  };
}

/**
 * 24 題固定「聽日文唸數字 -> 選阿拉伯數字」期中核心題庫
 */
export const NUMBER_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'nq-1',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 音變必考',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽是濁音「びゃく」還是半濁音「ぴゃく」',
    promptType: 'audio_only',
    audioText: 'さんびゃく',
    options: ['300', '30', '800', '600'],
    correctIndex: 0,
    furigana: 'さんびゃく',
    romaji: 'sanbyaku',
    meaningZh: '三百 (300)',
    soundWarning: '★ 音變重點：300 是濁音「びゃく」',
    explanation: '語音讀作「さんびゃく (sanbyaku)」，這是 300 的特殊濁音音變（百ひゃく 變 びゃく）。',
  },
  {
    id: 'nq-2',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 音變必考',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽開頭「ろっ」促音與半濁音「ぴゃく」',
    promptType: 'audio_only',
    audioText: 'ろっぴゃく',
    options: ['600', '800', '60', '300'],
    correctIndex: 0,
    furigana: 'ろっぴゃく',
    romaji: 'roppyaku',
    meaningZh: '六百 (600)',
    soundWarning: '★ 音變重點：600 是促音＋半濁音「ろっぴゃく」',
    explanation: '語音讀作「ろっぴゃく (roppyaku)」，ろく縮成「ろっ」加上半濁音「ぴゃく」，代表 600。',
  },
  {
    id: 'nq-3',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 音變必考',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽開頭「はっ」促音與半濁音「ぴゃく」',
    promptType: 'audio_only',
    audioText: 'はっぴゃく',
    options: ['800', '600', '80', '8,000'],
    correctIndex: 0,
    furigana: 'はっぴゃく',
    romaji: 'happyaku',
    meaningZh: '八百 (800)',
    soundWarning: '★ 音變重點：800 是促音＋半濁音「はっぴゃく」',
    explanation: '語音讀作「はっぴゃく (happyaku)」，はち縮成「はっ」加上半濁音「ぴゃく」，代表 800。',
  },
  {
    id: 'nq-4',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 音變必考',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽千位濁音「ぜん (zen)」',
    promptType: 'audio_only',
    audioText: 'さんぜん',
    options: ['3,000', '300', '8,000', '1,000'],
    correctIndex: 0,
    furigana: 'さんぜん',
    romaji: 'sanzen',
    meaningZh: '三千 (3,000)',
    soundWarning: '★ 音變重點：3000 是濁音「ぜん」',
    explanation: '語音讀作「さんぜん (sanzen)」，這是 3000 的特殊濁音音變（千せん 變 ぜん）。',
  },
  {
    id: 'nq-5',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 音變必考',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽促音「はっせん」與「はっぴゃく」的區別',
    promptType: 'audio_only',
    audioText: 'はっせん',
    options: ['8,000', '800', '6,000', '3,000'],
    correctIndex: 0,
    furigana: 'はっせん',
    romaji: 'hassen',
    meaningZh: '八千 (8,000)',
    soundWarning: '★ 音變重點：8000 是促音「はっせん」',
    explanation: '語音讀作「はっせん (hassen)」，代表 8,000，中間帶有停頓一拍的促音。',
  },
  {
    id: 'nq-6',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 期中原題',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '期中考平假名第 5 題原音測試',
    promptType: 'audio_only',
    audioText: 'じゅう',
    options: ['10', '9', '100', '4'],
    correctIndex: 0,
    furigana: 'じゅう',
    romaji: 'jū',
    meaningZh: '十 (10)',
    explanation: '語音讀作「じゅう (jū)」，即數字 10。注意是濁音 じ＋小寫ゅ＋長音う（勿與 9 きゅう 混淆）。',
  },
  {
    id: 'nq-7',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 期中原題',
    prompt: '請聽日文數字發音，選出正確的金額：',
    promptSub: '期中考平假名第 6 題「百円」原音測試',
    promptType: 'audio_only',
    audioText: 'ひゃくえん',
    options: ['100 円', '10 円', '300 円', '1,000 円'],
    correctIndex: 0,
    furigana: 'ひゃくえん',
    romaji: 'hyaku-en',
    meaningZh: '100 日圓',
    explanation: '「百 (ひゃく)」＋「円 (えん)」＝「ひゃくえん」，即 100 円。100 為清音拗音，不加濁點。',
  },
  {
    id: 'nq-8',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 基礎雙讀音',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '測試「4」的常見算數讀音',
    promptType: 'audio_only',
    audioText: 'よん',
    options: ['4', '7', '9', '40'],
    correctIndex: 0,
    furigana: 'よん',
    romaji: 'yon',
    meaningZh: '四 (4)',
    explanation: '語音讀作「よん (yon)」，代表數字 4（另一個讀音是 し）。',
  },
  {
    id: 'nq-9',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 基礎雙讀音',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '測試「7」的另一種常見讀音（常與 1 いち 混淆）',
    promptType: 'audio_only',
    audioText: 'しち',
    options: ['7', '1', '4', '8'],
    correctIndex: 0,
    furigana: 'しち',
    romaji: 'shichi',
    meaningZh: '七 (7)',
    soundWarning: '★ 陷阱警告：しち 是 7，いち 才是 1！',
    explanation: '語音讀作「しち (shichi)」，代表數字 7（另一個讀音是 なな）。聽力常與 1（いち）混淆，務必聽清楚開頭的 sh 氣音！',
  },
  {
    id: 'nq-10',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 基礎雙讀音',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '測試「9」的長音讀音',
    promptType: 'audio_only',
    audioText: 'きゅう',
    options: ['9', '10', '6', '90'],
    correctIndex: 0,
    furigana: 'きゅう',
    romaji: 'kyū',
    meaningZh: '九 (9)',
    explanation: '語音讀作「きゅう (kyū)」，代表數字 9（另一個短讀音為 く，常用於九點 くじ）。',
  },
  {
    id: 'nq-11',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 萬位規則',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意聽前面有沒有加上「いち」',
    promptType: 'audio_only',
    audioText: 'いちまん',
    options: ['10,000', '1,000', '100', '100,000'],
    correctIndex: 0,
    furigana: 'いちまん',
    romaji: 'ichiman',
    meaningZh: '一萬 (10,000)',
    soundWarning: '★ 萬位鐵則：100(ひゃく)與1000(せん)不加いち，唯獨 10,000 必唸「いちまん」！',
    explanation: '語音讀作「いちまん (ichiman)」，代表 10,000（一萬）。',
  },
  {
    id: 'nq-12',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 金額聽讀',
    prompt: '請聽發音選出正確金額：',
    promptSub: '專注分辨 500 與 5,000 的單位差異',
    promptType: 'audio_only',
    audioText: 'ごせんえん',
    options: ['5,000 円', '500 円', '50,000 円', '1,500 円'],
    correctIndex: 0,
    furigana: 'ごせんえん',
    romaji: 'gosen-en',
    meaningZh: '五千日圓',
    explanation: '語音讀作「ごせんえん (gosen-en)」，ご(5)＋せん(千)＋えん(圓) ＝ 5,000 円。',
  },
  {
    id: 'nq-13',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 兩位數',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '分辨「じゅうよん」與「よんじゅう」的順序差異',
    promptType: 'audio_only',
    audioText: 'じゅうよん',
    options: ['14', '40', '41', '24'],
    correctIndex: 0,
    furigana: 'じゅうよん',
    romaji: 'jūyon',
    meaningZh: '十四 (14)',
    explanation: '「じゅう (10)」在前、「よん (4)」在後 ＝ 14。若是「よんじゅう」則是 40！',
  },
  {
    id: 'nq-14',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 兩位數',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '分辨十位數順序',
    promptType: 'audio_only',
    audioText: 'よんじゅう',
    options: ['40', '14', '400', '70'],
    correctIndex: 0,
    furigana: 'よんじゅう',
    romaji: 'yonjū',
    meaningZh: '四十 (40)',
    explanation: '「よん (4)」在前、「じゅう (10)」在後 ＝ 40。',
  },
  {
    id: 'nq-15',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 兩位數',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '分辨 70 與 17',
    promptType: 'audio_only',
    audioText: 'ななじゅう',
    options: ['70', '17', '700', '90'],
    correctIndex: 0,
    furigana: 'ななじゅう',
    romaji: 'nanajū',
    meaningZh: '七十 (70)',
    explanation: '「なな (7)」＋「じゅう (10)」＝ 70（亦可說 しちじゅう，但 ななじゅう 最常見）。',
  },
  {
    id: 'nq-16',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 兩位數',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '分辨 90 與 19、900',
    promptType: 'audio_only',
    audioText: 'きゅうじゅう',
    options: ['90', '19', '900', '80'],
    correctIndex: 0,
    furigana: 'きゅうじゅう',
    romaji: 'kyūjū',
    meaningZh: '九十 (90)',
    explanation: '「きゅう (9)」＋「じゅう (10)」＝ 90。注意 90 不可說 くじゅう，必唸 きゅうじゅう。',
  },
  {
    id: 'nq-17',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合百位',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '拆解「百位＋十位」兩段聽音',
    promptType: 'audio_only',
    audioText: 'にひゃくごじゅう',
    options: ['250', '520', '205', '2,500'],
    correctIndex: 0,
    furigana: 'にひゃくごじゅう',
    romaji: 'nihyaku gojū',
    meaningZh: '二百五十 (250)',
    explanation: 'にひゃく (200) ＋ ごじゅう (50) ＝ 250。',
  },
  {
    id: 'nq-18',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合音變',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '結合 300 濁音「さんびゃく」的複合數字',
    promptType: 'audio_only',
    audioText: 'さんびゃくろくじゅう',
    options: ['360', '630', '306', '860'],
    correctIndex: 0,
    furigana: 'さんびゃくろくじゅう',
    romaji: 'sanbyaku rokujū',
    meaningZh: '三百六十 (360)',
    soundWarning: '★ 聽見さんびゃく立刻鎖定 3 開頭百位！',
    explanation: 'さんびゃく (300) ＋ ろくじゅう (60) ＝ 360。',
  },
  {
    id: 'nq-19',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合音變',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '結合 600 音變「ろっぴゃく」與十位「はちじゅう」',
    promptType: 'audio_only',
    audioText: 'ろっぴゃくはちじゅう',
    options: ['680', '860', '380', '608'],
    correctIndex: 0,
    furigana: 'ろっぴゃくはちじゅう',
    romaji: 'roppyaku hachijū',
    meaningZh: '六百八十 (680)',
    soundWarning: '★ 雙重誘惑題：先聽到ろっぴゃく(600)，後面才是はちじゅう(80)',
    explanation: 'ろっぴゃく (600) ＋ はちじゅう (80) ＝ 680。考試最愛考 6 和 8 順序顛倒！',
  },
  {
    id: 'nq-20',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合音變',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '結合 800 音變「はっぴゃく」的複合數字',
    promptType: 'audio_only',
    audioText: 'はっぴゃくよんじゅう',
    options: ['840', '480', '640', '804'],
    correctIndex: 0,
    furigana: 'はっぴゃくよんじゅう',
    romaji: 'happyaku yonjū',
    meaningZh: '八百四十 (840)',
    explanation: 'はっぴゃく (800) ＋ よんじゅう (40) ＝ 840。',
  },
  {
    id: 'nq-21',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合千位',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '注意千位「せん (1000)」＋ 300 濁音「さんびゃく」',
    promptType: 'audio_only',
    audioText: 'せんさんびゃく',
    options: ['1,300', '3,100', '1,600', '300'],
    correctIndex: 0,
    furigana: 'せんさんびゃく',
    romaji: 'sen sanbyaku',
    meaningZh: '一千三百 (1,300)',
    soundWarning: '★ 千位 1,000 直接唸「せん」，不會加いち！',
    explanation: 'せん (1,000) ＋ さんびゃく (300) ＝ 1,300。',
  },
  {
    id: 'nq-22',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 複合千位',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '聽辨「にせん (2000)」＋「ろっぴゃく (600)」',
    promptType: 'audio_only',
    audioText: 'にせんろっぴゃく',
    options: ['2,600', '6,200', '2,800', '3,600'],
    correctIndex: 0,
    furigana: 'にせんろっぴゃく',
    romaji: 'nisen roppyaku',
    meaningZh: '二千六百 (2,600)',
    explanation: 'にせん (2,000) ＋ ろっぴゃく (600) ＝ 2,600。',
  },
  {
    id: 'nq-23',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 雙音變魔王',
    prompt: '請聽日文數字發音，選出正確的阿拉伯數字：',
    promptSub: '終極雙音變魔王：3,000 濁音 ＋ 800 半濁音！',
    promptType: 'audio_only',
    audioText: 'さんぜんはっぴゃく',
    options: ['3,800', '8,300', '3,600', '380'],
    correctIndex: 0,
    furigana: 'さんぜんはっぴゃく',
    romaji: 'sanzen happyaku',
    meaningZh: '三千八百 (3,800)',
    soundWarning: '★ 雙音變合體：さんぜん(3000) ＋ はっぴゃく(800)',
    explanation: 'さんぜん (3,000) ＋ はっぴゃく (800) ＝ 3,800。若能一秒聽出這題，數字音變已完全制霸！',
  },
  {
    id: 'nq-24',
    category: 'numbers',
    categoryLabel: '數字聽讀選 · 金額實戰',
    prompt: '請聽日文金額發音，選出正確的價錢：',
    promptSub: '商店結帳常見金額聽力',
    promptType: 'audio_only',
    audioText: 'いちまんえん',
    options: ['10,000 円', '1,000 円', '100 円', '100,000 円'],
    correctIndex: 0,
    furigana: 'いちまんえん',
    romaji: 'ichiman-en',
    meaningZh: '一萬日圓',
    explanation: 'いちまん (10,000) ＋ えん (円) ＝ 10,000 円（一萬日圓）。',
  },
];

/**
 * 16 題「看數字自己開口唸 -> 選對照假名」口說預判練習題
 */
export const NUMBER_READING_QUESTIONS: QuizQuestion[] = [
  {
    id: 'nr-1',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 音變',
    prompt: '300',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'さんびゃく',
    disablePreAnswerAudio: true,
    options: ['さんびゃく', 'さんひゃく', 'さんぴゃく', 'さんぜん'],
    correctIndex: 0,
    furigana: 'さんびゃく',
    romaji: 'sanbyaku',
    meaningZh: '三百 (300)',
    explanation: '300 遇到「さん」發生濁音音變，讀作「さんびゃく (sanbyaku)」。',
  },
  {
    id: 'nr-2',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 音變',
    prompt: '600',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'ろっぴゃく',
    disablePreAnswerAudio: true,
    options: ['ろっぴゃく', 'ろくひゃく', 'ろっびゃく', 'ろくぴゃく'],
    correctIndex: 0,
    furigana: 'ろっぴゃく',
    romaji: 'roppyaku',
    meaningZh: '六百 (600)',
    explanation: '600 發生「促音っ＋半濁音ぴゃく」雙重音變，讀作「ろっぴゃく (roppyaku)」。',
  },
  {
    id: 'nr-3',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 音變',
    prompt: '800',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'はっぴゃく',
    disablePreAnswerAudio: true,
    options: ['はっぴゃく', 'はちひゃく', 'はっびゃく', 'はっせん'],
    correctIndex: 0,
    furigana: 'はっぴゃく',
    romaji: 'happyaku',
    meaningZh: '八百 (800)',
    explanation: '800 發生「促音っ＋半濁音ぴゃく」雙重音變，讀作「はっぴゃく (happyaku)」。',
  },
  {
    id: 'nr-4',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 音變',
    prompt: '3,000',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'さんぜん',
    disablePreAnswerAudio: true,
    options: ['さんぜん', 'さんせん', 'さんびゃく', 'さっせん'],
    correctIndex: 0,
    furigana: 'さんぜん',
    romaji: 'sanzen',
    meaningZh: '三千 (3,000)',
    explanation: '3,000 的千位「せん」發生濁音音變為「ぜん」，讀作「さんぜん (sanzen)」。',
  },
  {
    id: 'nr-5',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 音變',
    prompt: '8,000',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'はっせん',
    disablePreAnswerAudio: true,
    options: ['はっせん', 'はちせん', 'はっぜん', 'はっぴゃく'],
    correctIndex: 0,
    furigana: 'はっせん',
    romaji: 'hassen',
    meaningZh: '八千 (8,000)',
    explanation: '8,000 的「はち」縮為促音「はっ」，加上清音「せん」，讀作「はっせん (hassen)」。',
  },
  {
    id: 'nr-6',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 期中原題',
    prompt: '10',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'じゅう',
    disablePreAnswerAudio: true,
    options: ['じゅう', 'じゆう', 'ちゆう', 'きゅう'],
    correctIndex: 0,
    furigana: 'じゅう',
    romaji: 'jū',
    meaningZh: '十 (10)',
    explanation: '10 讀作「じゅう (jū)」，中間 ゅ 必須小寫。',
  },
  {
    id: 'nr-7',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 期中原題',
    prompt: '100 円',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'ひゃくえん',
    disablePreAnswerAudio: true,
    options: ['ひゃくえん', 'いちひゃくえん', 'びゃくえん', 'ぴゃくえん'],
    correctIndex: 0,
    furigana: 'ひゃくえん',
    romaji: 'hyaku-en',
    meaningZh: '一百日圓',
    explanation: '100 不加いち、不變濁音，直接讀作「ひゃくえん (hyaku-en)」。',
  },
  {
    id: 'nr-8',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 萬位規則',
    prompt: '10,000',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'いちまん',
    disablePreAnswerAudio: true,
    options: ['いちまん', 'まん', 'いっまん', 'いちせん'],
    correctIndex: 0,
    furigana: 'いちまん',
    romaji: 'ichiman',
    meaningZh: '一萬 (10,000)',
    explanation: '一萬前面一定要加上「いち」，讀作「いちまん (ichiman)」。',
  },
  {
    id: 'nr-9',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 雙讀音',
    prompt: '4',
    promptSub: '請先自己開口唸出「4」的兩種日文讀音：',
    promptType: 'number',
    audioText: 'よん、し',
    disablePreAnswerAudio: true,
    options: ['よん / し', 'なな / しち', 'きゅう / く', 'よ / よう'],
    correctIndex: 0,
    furigana: 'よん / し',
    romaji: 'yon / shi',
    meaningZh: '四 (4)',
    explanation: '4 有「よん」與「し」兩種讀法。一般數字與 40 (よんじゅう)、400 (よんひゃく) 多用 よん。',
  },
  {
    id: 'nr-10',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 雙讀音',
    prompt: '7',
    promptSub: '請先自己開口唸出「7」的兩種日文讀音：',
    promptType: 'number',
    audioText: 'なな、しち',
    disablePreAnswerAudio: true,
    options: ['なな / しち', 'よん / し', 'きゅう / く', 'しち / いち'],
    correctIndex: 0,
    furigana: 'なな / しち',
    romaji: 'nana / shichi',
    meaningZh: '七 (7)',
    explanation: '7 有「なな」與「しち」兩種讀法。算數常用 なな，7點整讀 しちじ。',
  },
  {
    id: 'nr-11',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 雙讀音',
    prompt: '9',
    promptSub: '請先自己開口唸出「9」的兩種日文讀音：',
    promptType: 'number',
    audioText: 'きゅう、く',
    disablePreAnswerAudio: true,
    options: ['きゅう / く', 'じゅう / じゅ', 'よん / し', 'きゅ / きょう'],
    correctIndex: 0,
    furigana: 'きゅう / く',
    romaji: 'kyū / ku',
    meaningZh: '九 (9)',
    explanation: '9 有「きゅう」與「く」兩種讀法。90 讀 きゅうじゅう，9點整讀 くじ。',
  },
  {
    id: 'nr-12',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 複合數字',
    prompt: '360',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'さんびゃくろくじゅう',
    disablePreAnswerAudio: true,
    options: [
      'さんびゃくろくじゅう',
      'さんひゃくろくじゅう',
      'さんびゃくろっぴゃく',
      'ろっぴゃくさんじゅう',
    ],
    correctIndex: 0,
    furigana: 'さんびゃくろくじゅう',
    romaji: 'sanbyaku rokujū',
    meaningZh: '三百六十 (360)',
    explanation: '300 (さんびゃく) ＋ 60 (ろくじゅう) ＝ さんびゃくろくじゅう。',
  },
  {
    id: 'nr-13',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 複合數字',
    prompt: '680',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'ろっぴゃくはちじゅう',
    disablePreAnswerAudio: true,
    options: [
      'ろっぴゃくはちじゅう',
      'ろくひゃくはちじゅう',
      'はっぴゃくろくじゅう',
      'ろっぴゃくはっぴゃく',
    ],
    correctIndex: 0,
    furigana: 'ろっぴゃくはちじゅう',
    romaji: 'roppyaku hachijū',
    meaningZh: '六百八十 (680)',
    explanation: '600 (ろっぴゃく) ＋ 80 (はちじゅう) ＝ ろっぴゃくはちじゅう。',
  },
  {
    id: 'nr-14',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 複合數字',
    prompt: '1,300',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'せんさんびゃく',
    disablePreAnswerAudio: true,
    options: [
      'せんさんびゃく',
      'いちせんさんびゃく',
      'せんさんひゃく',
      'さんぜんひゃく',
    ],
    correctIndex: 0,
    furigana: 'せんさんびゃく',
    romaji: 'sen sanbyaku',
    meaningZh: '一千三百 (1,300)',
    explanation: '1,000 直接唸「せん」不加 いち，加上 300 濁音「さんびゃく」＝ せんさんびゃく。',
  },
  {
    id: 'nr-15',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 複合數字',
    prompt: '3,800',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'さんぜんはっぴゃく',
    disablePreAnswerAudio: true,
    options: [
      'さんぜんはっぴゃく',
      'さんせんはちひゃく',
      'さんぜんはちひゃく',
      'はっせんさんびゃく',
    ],
    correctIndex: 0,
    furigana: 'さんぜんはっぴゃく',
    romaji: 'sanzen happyaku',
    meaningZh: '三千八百 (3,800)',
    explanation: '3,000 (さんぜん) ＋ 800 (はっぴゃく) ＝ さんぜんはっぴゃく。',
  },
  {
    id: 'nr-16',
    category: 'numbers',
    categoryLabel: '看數字唸讀音 · 複合數字',
    prompt: '8,600',
    promptSub: '請先自己開口唸一遍，再選出正確的平假名讀音：',
    promptType: 'number',
    audioText: 'はっせんろっぴゃく',
    disablePreAnswerAudio: true,
    options: [
      'はっせんろっぴゃく',
      'はちせんろくひゃく',
      'はっぴゃくろくせん',
      'ろくせんはっぴゃく',
    ],
    correctIndex: 0,
    furigana: 'はっせんろっぴゃく',
    romaji: 'hassen roppyaku',
    meaningZh: '八千六百 (8,600)',
    explanation: '8,000 (はっせん) ＋ 600 (ろっぴゃく) ＝ はっせんろっぴゃく。',
  },
];
