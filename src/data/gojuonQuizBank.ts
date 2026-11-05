import { QuizQuestion, MnemonicCard } from '../types/quiz';
import { SEION_MNEMONICS } from './mnemonicData';

export type GojuonQuizMode =
  | 'hira_to_kata'
  | 'kata_to_hira'
  | 'hira_to_romaji'
  | 'kata_to_romaji'
  | 'audio_to_hira'
  | 'audio_to_kata'
  | 'tricky_pairs';

export type GojuonRowScope = 'all' | 'ak' | 'st' | 'nh' | 'myrw';

/**
 * Curated visually & phonetically similar kana confusion groups for realistic distractors
 */
const CONFUSION_MAP: Record<string, string[]> = {
  a: ['o', 'ma', 'ya', 'ka'],
  i: ['ri', 'ni', 'ko', 'te'],
  u: ['wa', 'fu', 'ra', 'tsu'],
  e: ['ko', 'ni', 'se', 'he'],
  o: ['a', 'ho', 'yo', 'mo'],

  ka: ['ya', 'ke', 'ku', 'ko'],
  ki: ['sa', 'chi', 'te', 'ke'],
  ku: ['ke', 'ta', 'he', 'u'],
  ke: ['ku', 'ta', 'ha', 'se'],
  ko: ['yo', 'yu', 'ro', 'ni'],

  sa: ['ki', 'chi', 'se', 'ta'],
  shi: ['tsu', 'so', 'n', 'chi'],
  su: ['nu', 'ma', 'mu', 'fu'],
  se: ['sa', 'ke', 'te', 'so'],
  so: ['n', 'shi', 'tsu', 'no'],

  ta: ['na', 'ku', 'ke', 'chi'],
  chi: ['ra', 'sa', 'ki', 'te'],
  tsu: ['shi', 'n', 'so', 'su'],
  te: ['to', 'chi', 'ke', 'ki'],
  to: ['te', 'ko', 'so', 'no'],

  na: ['ta', 'me', 'no', 'ni'],
  ni: ['ko', 'mi', 'ta', 'na'],
  nu: ['ne', 'me', 'su', 'no'],
  ne: ['nu', 're', 'wa', 'me'],
  no: ['me', 'nu', 'na', 'so'],

  ha: ['ho', 'ma', 'na', 'ka'],
  hi: ['shi', 'chi', 'ni', 'he'],
  fu: ['u', 'wa', 'ra', 'tsu'],
  he: ['ku', 'e', 'hi', 'ho'],
  ho: ['ha', 'ma', 'mo', 'o'],

  ma: ['a', 'ya', 'ho', 'mu'],
  mi: ['ni', 'shi', 'chi', 'me'],
  mu: ['su', 'ma', 'mo', 'nu'],
  me: ['nu', 'ne', 'no', 'na'],
  mo: ['ma', 'ho', 'shi', 'mu'],

  ya: ['ka', 'ma', 'yu', 'yo'],
  yu: ['ko', 'yo', 'nu', 'ya'],
  yo: ['ko', 'yu', 'ro', 'ma'],

  ra: ['chi', 'ru', 'fu', 'u'],
  ri: ['i', 'ru', 're', 'ni'],
  ru: ['ro', 're', 'ra', 'so'],
  re: ['ne', 'wa', 'ru', 'ro'],
  ro: ['ru', 'ko', 'yo', 're'],

  wa: ['re', 'ne', 'u', 'fu'],
  wo: ['o', 'ra', 'wa', 'fu'],
  n: ['so', 'tsu', 'shi', 'no'],
};

const ROW_SCOPE_MAP: Record<GojuonRowScope, string[]> = {
  all: [
    'あ行 (a)',
    'か行 (ka)',
    'さ行 (sa)',
    'た行 (ta)',
    'な行 (na)',
    'は行 (ha)',
    'ま行 (ma)',
    'や行 (ya)',
    'ら行 (ra)',
    'わ行 / 撥音',
  ],
  ak: ['あ行 (a)', 'か行 (ka)'],
  st: ['さ行 (sa)', 'た行 (ta)'],
  nh: ['な行 (na)', 'は行 (ha)'],
  myrw: ['ま行 (ma)', 'や行 (ya)', 'ら行 (ra)', 'わ行 / 撥音'],
};

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getCardByRomaji(romaji: string): MnemonicCard | undefined {
  return SEION_MNEMONICS.find((m) => m.romaji === romaji);
}

function sanitizeHint(hint: string, secretChars: string[]): string {
  let result = hint;
  for (const ch of secretChars) {
    if (ch) {
      result = result.split(ch).join('？');
    }
  }
  return result;
}

/**
 * Curated Tricky Pairs & Dakuon/Youon Multiple-Choice Questions (30 Questions)
 */
export const TRICKY_GOJUON_QUESTIONS: QuizQuestion[] = [
  {
    id: 'tg-1',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'シ',
    promptSub: '請選出片假名「シ」對應的平假名與發音',
    promptType: 'gojuon_char',
    audioText: 'し',
    options: ['し (shi)', 'つ (tsu)', 'そ (so)', 'ん (n)'],
    correctIndex: 0,
    romaji: 'shi',
    meaningZh: '假名 し / シ',
    soundWarning: '★ 片假名四天王：シ vs ツ',
    preHint: '圖像聯想：兩眼「平躺微笑 (Smile)」，兩點近乎水平、最後一筆由左下往右上長揚！',
    explanation: '「シ」對應平假名「し (shi)」。兩點平躺微笑、由左下往右上挑起是「シ (shi)」；兩點直立、由右上往下落筆是「ツ (tsu)」。',
    mnemonicTip: '計程車 タクシー (takushī) 就是用微笑的「シ」！',
  },
  {
    id: 'tg-2',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ツ',
    promptSub: '請選出片假名「ツ」對應的平假名與發音',
    promptType: 'gojuon_char',
    audioText: 'つ',
    options: ['つ (tsu)', 'し (shi)', 'ん (n)', 'そ (so)'],
    correctIndex: 0,
    romaji: 'tsu',
    meaningZh: '假名 つ / ツ',
    soundWarning: '★ 片假名四天王：ツ vs シ',
    preHint: '圖像聯想：天空「垂直落下的雨滴 (Tsunami 水花)」，兩點縱向排列、由右上往左下垂落！',
    explanation: '「ツ」對應平假名「つ (tsu)」。兩點垂直站立、最後一筆由右上往左下垂落。',
    mnemonicTip: '床單 シーツ (shītsu) 開頭是微笑「シ」，結尾是直落「ツ」！',
  },
  {
    id: 'tg-3',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ン',
    promptSub: '請選出片假名「ン」對應的平假名與發音',
    promptType: 'gojuon_char',
    audioText: 'ん',
    options: ['ん (n)', 'そ (so)', 'し (shi)', 'つ (tsu)'],
    correctIndex: 0,
    romaji: 'n',
    meaningZh: '撥音 ん / ン',
    soundWarning: '★ 片假名四天王：ン vs ソ',
    preHint: '圖像聯想：一艘小帆船破浪「由左下往右上揚帆挑起」！',
    explanation: '「ン」是撥音「ん (n)」。左下一點，第二筆從「左下往右上」長長挑起；若是從右上往下滑落則是「ソ (so)」。',
    mnemonicTip: '漢堡 ハンバーガー、拉麵 ラーメン 都是用揚帆向上的「ン」！',
  },
  {
    id: 'tg-4',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ソ',
    promptSub: '請選出片假名「ソ」對應的平假名與發音',
    promptType: 'gojuon_char',
    audioText: 'そ',
    options: ['そ (so)', 'ん (n)', 'つ (tsu)', 'し (shi)'],
    correctIndex: 0,
    romaji: 'so',
    meaningZh: '假名 そ / ソ',
    soundWarning: '★ 片假名四天王：ソ vs ン',
    preHint: '圖像聯想：兩根從上往下滑落的冰柱（溜滑梯向下），兩筆都是由上往下寫！',
    explanation: '「ソ」對應平假名「そ (so)」。第一點斜立，第二筆由右上往左下垂落。',
    mnemonicTip: '千萬別把漢堡 ハ「ン」バーガー 誤選成 ハ「ソ」バーガー！',
  },
  {
    id: 'tg-5',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ス',
    promptSub: '請選出片假名「ス」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'す',
    options: ['す', 'ぬ', 'ま', 'む'],
    correctIndex: 0,
    romaji: 'su',
    meaningZh: '假名 す / ス',
    soundWarning: '★ 形似辨識：ス vs ヌ',
    preHint: '圖像聯想：順溜的「溜滑梯 (Slide)」，右上角轉折處「沒有出頭交叉」！',
    explanation: '「ス」是「す (su)」，右上角轉彎沒有交叉出頭；有交叉出頭像「又」字的是「ヌ (nu)」。',
    mnemonicTip: '口罩 マスク (masuku) 是用沒出頭的「ス」！',
  },
  {
    id: 'tg-6',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ヌ',
    promptSub: '請選出片假名「ヌ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'ぬ',
    options: ['ぬ', 'す', 'ね', 'め'],
    correctIndex: 0,
    romaji: 'nu',
    meaningZh: '假名 ぬ / ヌ',
    soundWarning: '★ 形似辨識：ヌ vs ス',
    preHint: '圖像聯想：筷子交叉夾起拉麵 (Noodle)，右上角「有交叉出頭」！',
    explanation: '「ヌ」對應平假名「ぬ (nu)」，兩筆交叉且右上角明顯出頭。',
    mnemonicTip: 'Noodle 拉麵的 nu 就是有交叉筷子的「ヌ」！',
  },
  {
    id: 'tg-7',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ぬ',
    promptSub: '請選出平假名「ぬ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ぬ',
    options: ['ヌ', 'ネ', 'メ', 'ス'],
    correctIndex: 0,
    romaji: 'nu',
    meaningZh: '假名 ぬ / ヌ',
    soundWarning: '★ 平假名三胞胎：ぬ vs ね vs め',
    preHint: '圖像聯想：一雙筷子插進麵碗裡捲起拉麵 (Noodle)，尾巴打圓圈！',
    explanation: '「ぬ」讀作 nu，對應片假名「ヌ」。注意區分：「ぬ」尾巴有圓圈、「め」尾巴沒有圓圈、「ね」左邊是直豎！',
  },
  {
    id: 'tg-8',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'め',
    promptSub: '請選出平假名「め」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'め',
    options: ['メ', 'ヌ', 'ネ', 'ノ'],
    correctIndex: 0,
    romaji: 'me',
    meaningZh: '假名 め / メ',
    soundWarning: '★ 平假名三胞胎：め vs ぬ vs の',
    preHint: '圖像聯想：少女水汪汪的大眼睛（日文「目」讀 me），片假名像俏皮眨眼打一個叉！',
    explanation: '「め」讀作 me，對應片假名「メ」。平假名「め」比「ぬ」少了尾巴的小圓圈。',
  },
  {
    id: 'tg-9',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ね',
    promptSub: '請選出平假名「ね」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ね',
    options: ['ネ', 'ヌ', 'レ', 'ワ'],
    correctIndex: 0,
    romaji: 'ne',
    meaningZh: '假名 ね / ネ',
    soundWarning: '★ 平假名三胞胎：ね vs わ vs れ',
    preHint: '圖像聯想：小貓咪 (neko) 尾巴捲起來打結；片假名像神明祈福的「示」字旁！',
    explanation: '「ね」讀作 ne，對應片假名「ネ」。左邊一豎，右邊尾巴向內打一個結。',
  },
  {
    id: 'tg-10',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'わ',
    promptSub: '請選出平假名「わ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'わ',
    options: ['ワ', 'ウ', 'フ', 'レ'],
    correctIndex: 0,
    romaji: 'wa',
    meaningZh: '假名 わ / ワ',
    soundWarning: '★ 平假名三胞胎：わ vs れ vs ね',
    preHint: '圖像聯想：大肚子的優雅白天鵝 (Swan)，片假名像倒扣的大水杯 (Water)！',
    explanation: '「わ」讀作 wa，對應片假名「ワ」。「わ」右邊是圓潤大肚子，「れ」右邊像躺椅向外勾，「ね」右邊打圓結。',
  },
  {
    id: 'tg-11',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'れ',
    promptSub: '請選出平假名「れ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'れ',
    options: ['レ', 'ワ', 'ネ', 'ル'],
    correctIndex: 0,
    romaji: 're',
    meaningZh: '假名 れ / レ',
    soundWarning: '★ 平假名三胞胎：れ vs わ vs ね',
    preHint: '圖像聯想：靠在躺椅上舒服休息的人 (Rest)，片假名像打一個大勾勾 (Ready)！',
    explanation: '「れ」讀作 re，對應片假名「レ」。',
    mnemonicTip: '廁所 トイレ (toire)、電梯 エレベーター 都用打勾的「レ」！',
  },
  {
    id: 'tg-12',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'は',
    promptSub: '請選出平假名「は」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'は',
    options: ['ハ', 'ホ', 'マ', 'ナ'],
    correctIndex: 0,
    romaji: 'ha',
    meaningZh: '假名 は / ハ',
    soundWarning: '★ 形似辨識：は vs ほ',
    preHint: '圖像聯想：媽媽開懷哈哈大笑 (haha)，頭頂只有一橫、沒有帽子；片假名像八字鬍！',
    explanation: '「は」讀作 ha，對應片假名「ハ」。注意「は」上方只有一橫；若上方多出一短橫蓋頂則是「ほ (ho)」。',
  },
  {
    id: 'tg-13',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ほ',
    promptSub: '請選出平假名「ほ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ほ',
    options: ['ホ', 'ハ', 'モ', 'オ'],
    correctIndex: 0,
    romaji: 'ho',
    meaningZh: '假名 ほ / ホ',
    soundWarning: '★ 形似辨識：ほ vs は',
    preHint: '圖像聯想：聖誕老人戴著紅帽大笑「Ho! Ho! Ho!」，片假名像掛滿飾品的聖誕樹！',
    explanation: '「ほ」讀作 ho，對應片假名「ホ」。平假名頂部有兩橫，片假名像「木」字左右掛兩點。',
    mnemonicTip: '飯店 ホテル (hoteru) 開頭就是聖誕樹「ホ」！',
  },
  {
    id: 'tg-14',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'る',
    promptSub: '請選出平假名「る」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'る',
    options: ['ル', 'ロ', 'レ', 'ラ'],
    correctIndex: 0,
    romaji: 'ru',
    meaningZh: '假名 る / ル',
    soundWarning: '★ 形似辨識：る vs ろ',
    preHint: '圖像聯想：繩索尾端畫了一個「小圓圈 (Loop)」，片假名像兩條長腿向前奔跑 (Run)！',
    explanation: '「る」尾巴有個小圈圈，讀作 ru，對應片假名「ル」。沒有圈圈的則是「ろ (ro)」。',
  },
  {
    id: 'tg-15',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ろ',
    promptSub: '請選出平假名「ろ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ろ',
    options: ['ロ', 'ル', 'コ', 'ヨ'],
    correctIndex: 0,
    romaji: 'ro',
    meaningZh: '假名 ろ / ロ',
    soundWarning: '★ 形似辨識：ろ vs る',
    preHint: '圖像聯想：空蕩蕩敞開的大馬路 (Road，沒有圈圈)，片假名像四方圓環 (口)！',
    explanation: '「ろ」尾巴沒有圈圈，讀作 ro，對應片假名「ロ」。',
  },
  {
    id: 'tg-16',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ク',
    promptSub: '請選出片假名「ク」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'く',
    options: ['く', 'け', 'た', 'う'],
    correctIndex: 0,
    romaji: 'ku',
    meaningZh: '假名 く / ク',
    soundWarning: '★ 片假名三胞胎：ク vs ケ vs タ',
    preHint: '圖像聯想：廚師彎彎的切菜刀 (Cook)，只有一撇一橫折、沒有中間那橫！',
    explanation: '「ク」對應平假名「く (ku)」。對比：「ク」沒有中間交叉橫、「タ」中間有一點變成「夕」、「ケ」左邊多一撇像竹字！',
    mnemonicTip: '領帶 ネクタイ、牛奶 ミルク 都是用切菜刀「ク」！',
  },
  {
    id: 'tg-17',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ケ',
    promptSub: '請選出片假名「ケ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'け',
    options: ['け', 'く', 'た', 'せ'],
    correctIndex: 0,
    romaji: 'ke',
    meaningZh: '假名 け / ケ',
    soundWarning: '★ 片假名三胞胎：ケ vs ク vs タ',
    preHint: '圖像聯想：漢字「竹」的一半，像一根立著的小竹籤！',
    explanation: '「ケ」對應平假名「け (ke)」。蛋糕 ケーキ、手機 ケータイ 都是用「ケ」。',
  },
  {
    id: 'tg-18',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'タ',
    promptSub: '請選出片假名「タ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'た',
    options: ['た', 'く', 'け', 'な'],
    correctIndex: 0,
    romaji: 'ta',
    meaningZh: '假名 た / タ',
    soundWarning: '★ 片假名三胞胎：タ vs ク vs ケ',
    preHint: '圖像聯想：黃昏美麗的「夕」陽，中間多了一點！',
    explanation: '「タ」對應平假名「た (ta)」，外型就像夕陽的「夕」。',
  },
  {
    id: 'tg-19',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ア',
    promptSub: '請選出片假名「ア」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'あ',
    options: ['あ', 'ま', 'や', 'お'],
    correctIndex: 0,
    romaji: 'a',
    meaningZh: '假名 あ / ア',
    soundWarning: '★ 形似辨識：ア vs マ',
    preHint: '圖像聯想：英文字母 A 的尖角頂端，下面是一豎撇下來（沒有封口橫線）！',
    explanation: '「ア」對應平假名「あ (a)」。注意「ア」是一橫折加一撇；若下方變成一橫點封口則是馬丁尼酒杯「マ (ma)」。',
  },
  {
    id: 'tg-20',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'マ',
    promptSub: '請選出片假名「マ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'ま',
    options: ['ま', 'あ', 'や', 'む'],
    correctIndex: 0,
    romaji: 'ma',
    meaningZh: '假名 ま / マ',
    soundWarning: '★ 形似辨識：マ vs ア',
    preHint: '圖像聯想：高腳馬丁尼酒杯 (Martini)，三角杯身加底座一點！',
    explanation: '「マ」對應平假名「ま (ma)」。',
  },
  {
    id: 'tg-21',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'さ',
    promptSub: '請選出平假名「さ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'さ',
    options: ['サ', 'キ', 'チ', 'セ'],
    correctIndex: 0,
    romaji: 'sa',
    meaningZh: '假名 さ / サ',
    soundWarning: '★ 形似辨識：さ vs き',
    preHint: '圖像聯想：跳莎莎舞 (Salsa) 的少女，只有「一橫」；片假名就是草字頭「艹」！',
    explanation: '「さ」讀作 sa，對應片假名草字頭「サ」。平假名「さ」只有一橫，「き (ki)」有兩橫！',
  },
  {
    id: 'tg-22',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'き',
    promptSub: '請選出平假名「き」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'き',
    options: ['キ', 'サ', 'チ', 'テ'],
    correctIndex: 0,
    romaji: 'ki',
    meaningZh: '假名 き / キ',
    soundWarning: '★ 形似辨識：き vs さ',
    preHint: '圖像聯想：打開寶箱的黃金鑰匙 (Key)，有「兩道橫桿」齒輪！',
    explanation: '「き」讀作 ki，對應片假名「キ」。兩者都有兩橫一斜！',
  },
  {
    id: 'tg-23',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ち',
    promptSub: '請選出平假名「ち」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ち',
    options: ['チ', 'ラ', 'サ', 'テ'],
    correctIndex: 0,
    romaji: 'chi',
    meaningZh: '假名 ち / チ',
    soundWarning: '★ 形似辨識：ち vs ら',
    preHint: '圖像聯想：挺著大肚吃起司 (Cheese) 像數字 5，片假名像漢字「千」！',
    explanation: '「ち」讀作 chi，對應片假名「チ」。注意「ち」頂部是一橫貫穿，「ら (ra)」頂部是一點！',
  },
  {
    id: 'tg-24',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ら',
    promptSub: '請選出平假名「ら」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'ら',
    options: ['ラ', 'チ', 'フ', 'ワ'],
    correctIndex: 0,
    romaji: 'ra',
    meaningZh: '假名 ら / ラ',
    soundWarning: '★ 形似辨識：ら vs ち',
    preHint: '圖像聯想：沙漠單峰駱駝，頂部是一小點頭顱；片假名是一橫加橫折！',
    explanation: '「ら」讀作 ra，對應片假名「ラ」。拉麵 ラーメン 開頭就是「ラ」！',
  },
  {
    id: 'tg-25',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ユ',
    promptSub: '請選出片假名「ユ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'ゆ',
    options: ['ゆ', 'こ', 'よ', 'ぬ'],
    correctIndex: 0,
    romaji: 'yu',
    meaningZh: '假名 ゆ / ユ',
    soundWarning: '★ 片假名轉角組：ユ vs コ vs ヨ',
    preHint: '圖像聯想：溫泉熱水 (湯 yu) 出水管的管閥，底下那一橫向右突出！',
    explanation: '「ユ」對應平假名「ゆ (yu)」。對比：「コ (ko)」底部沒有突出、「ユ (yu)」底部向右突出、「ヨ (yo)」有三橫！',
  },
  {
    id: 'tg-26',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'コ',
    promptSub: '請選出片假名「コ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'こ',
    options: ['こ', 'ゆ', 'よ', 'ろ'],
    correctIndex: 0,
    romaji: 'ko',
    meaningZh: '假名 こ / コ',
    soundWarning: '★ 片假名轉角組：コ vs ユ vs ヨ',
    preHint: '圖像聯想：字母 C 的方形轉角 (Corner)，上下兩橫等長不突出！',
    explanation: '「コ」對應平假名「こ (ko)」。便利商店 コンビニ、咖啡 コーヒー 開頭都是「コ」！',
  },
  {
    id: 'tg-27',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'ウ',
    promptSub: '請選出片假名「ウ」對應的平假名',
    promptType: 'gojuon_char',
    audioText: 'う',
    options: ['う', 'わ', 'ふ', 'ら'],
    correctIndex: 0,
    romaji: 'u',
    meaningZh: '假名 う / ウ',
    soundWarning: '★ 片假名寶蓋組：ウ vs ワ vs フ',
    preHint: '圖像聯想：漢字「宇」的寶蓋頭「宀」，頂部有一小豎！',
    explanation: '「ウ」對應平假名「う (u)」。頂部有一豎的是「ウ (u)」，沒那一豎的是「ワ (wa)」，連那一撇都沒有只剩橫折的是「フ (fu)」。',
  },
  {
    id: 'tg-28',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'あ',
    promptSub: '請選出平假名「あ」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'あ',
    options: ['ア', 'オ', 'マ', 'ヤ'],
    correctIndex: 0,
    romaji: 'a',
    meaningZh: '假名 あ / ア',
    soundWarning: '★ 形似辨識：あ vs お',
    preHint: '圖像聯想：一刀切開的圓蘋果 (Apple)，右下角沒有孤立的一小點！',
    explanation: '「あ」讀作 a，對應片假名「ア」。右下角多出一點高爾夫球的則是「お (o)」。',
  },
  {
    id: 'tg-29',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'お',
    promptSub: '請選出平假名「お」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'お',
    options: ['オ', 'ア', 'ホ', 'モ'],
    correctIndex: 0,
    romaji: 'o',
    meaningZh: '假名 お / オ',
    soundWarning: '★ 形似辨識：お vs あ',
    preHint: '圖像聯想：高爾夫球一桿進洞 (Oh!)，右上角多一顆小白球；片假名像漢字「才」！',
    explanation: '「お」讀作 o，對應片假名「オ」。',
  },
  {
    id: 'tg-30',
    category: 'gojuon',
    categoryLabel: '形似字大魔王辨識',
    prompt: 'を',
    promptSub: '請選出平假名「を」對應的片假名',
    promptType: 'gojuon_char',
    audioText: 'を',
    options: ['ヲ', 'ラ', 'ワ', 'フ'],
    correctIndex: 0,
    romaji: 'wo (o)',
    meaningZh: '助詞假名 を / ヲ',
    preHint: '圖像聯想：踩在衝浪板上的特技高手 (Woah!)；片假名是兩橫加一斜撇！',
    explanation: '「を」對應片假名「ヲ」，發音同「お (o)」，日語中專門作為受格助詞使用。',
  },
];

/**
 * Dynamically build a 4-option multiple choice quiz across all 46 Seion kana (or filtered by row)
 */
export function buildGojuonQuizQuestions(
  mode: GojuonQuizMode,
  rowScope: GojuonRowScope = 'all',
  limitCount: number = 46,
  shuffleSeed: number = 1
): QuizQuestion[] {
  if (mode === 'tricky_pairs') {
    const baseList =
      shuffleSeed > 1 ? seededShuffle(TRICKY_GOJUON_QUESTIONS, shuffleSeed) : TRICKY_GOJUON_QUESTIONS;
    return baseList.slice(0, Math.min(limitCount, baseList.length)).map((q, idx) => {
      const indexed = q.options.map((opt, oIdx) => ({ opt, oIdx }));
      const shuffledOpts = seededShuffle(indexed, shuffleSeed * 31 + idx + 7);
      const newCorrectIdx = shuffledOpts.findIndex((item) => item.oIdx === q.correctIndex);
      return {
        ...q,
        options: shuffledOpts.map((item) => item.opt),
        correctIndex: newCorrectIdx >= 0 ? newCorrectIdx : 0,
      };
    });
  }

  const allowedRows = ROW_SCOPE_MAP[rowScope] || ROW_SCOPE_MAP.all;
  let pool = SEION_MNEMONICS.filter((m) => allowedRows.includes(m.row));

  if (shuffleSeed > 1) {
    pool = seededShuffle(pool, shuffleSeed);
  }
  if (limitCount < pool.length) {
    pool = pool.slice(0, limitCount);
  }

  return pool.map((item, index) => {
    const confuserRomajis = CONFUSION_MAP[item.romaji] || [];
    const distractorCards: MnemonicCard[] = [];

    for (const r of confuserRomajis) {
      const found = getCardByRomaji(r);
      if (found && found.romaji !== item.romaji) {
        distractorCards.push(found);
      }
      if (distractorCards.length === 3) break;
    }

    // Fallback padding if fewer than 3 distractors
    if (distractorCards.length < 3) {
      for (const candidate of SEION_MNEMONICS) {
        if (
          candidate.romaji !== item.romaji &&
          !distractorCards.some((d) => d.romaji === candidate.romaji)
        ) {
          distractorCards.push(candidate);
        }
        if (distractorCards.length === 3) break;
      }
    }

    const allFourCards = seededShuffle([item, ...distractorCards], (index + 1) * 37 + shuffleSeed);
    const correctIdx = allFourCards.findIndex((c) => c.romaji === item.romaji);

    if (mode === 'hira_to_kata') {
      const rawHint = `${item.visualEmoji} 片假名圖像聯想：「${item.kataMnemonicTitle}」— ${item.kataMnemonicDesc}`;
      return {
        id: `gq-h2k-${item.romaji}-${shuffleSeed}`,
        category: 'gojuon',
        categoryLabel: '五十音平假 ➔ 片假選擇題',
        prompt: item.hiragana,
        promptSub: `請選出平假名「${item.hiragana}」對應的片假名`,
        promptType: 'gojuon_char',
        audioText: item.hiragana,
        options: allFourCards.map((c) => c.katakana),
        correctIndex: correctIdx,
        romaji: item.romaji,
        meaningZh: `${item.row} · ${item.hiragana} / ${item.katakana}`,
        preHint: sanitizeHint(rawHint, [item.katakana]),
        explanation: `平假名「${item.hiragana}」的發音為 [${item.romaji}]，對應的片假名是「${item.katakana}」。\n• ${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}\n• ${item.kataMnemonicTitle}：${item.kataMnemonicDesc}`,
        mnemonicTip: item.examWordHint || `${item.visualEmoji} ${item.kataMnemonicTitle}：${item.kataMnemonicDesc}`,
      };
    }

    if (mode === 'kata_to_hira') {
      const rawHint = `${item.visualEmoji} 平假名圖像聯想：「${item.hiraMnemonicTitle}」— ${item.hiraMnemonicDesc}`;
      return {
        id: `gq-k2h-${item.romaji}-${shuffleSeed}`,
        category: 'gojuon',
        categoryLabel: '五十音片假 ➔ 平假選擇題',
        prompt: item.katakana,
        promptSub: `請選出片假名「${item.katakana}」對應的平假名`,
        promptType: 'gojuon_char',
        audioText: item.hiragana,
        options: allFourCards.map((c) => c.hiragana),
        correctIndex: correctIdx,
        romaji: item.romaji,
        meaningZh: `${item.row} · ${item.hiragana} / ${item.katakana}`,
        preHint: sanitizeHint(rawHint, [item.hiragana]),
        explanation: `片假名「${item.katakana}」的發音為 [${item.romaji}]，對應的平假名是「${item.hiragana}」。\n• ${item.kataMnemonicTitle}：${item.kataMnemonicDesc}\n• ${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}`,
        mnemonicTip: item.examWordHint || `${item.visualEmoji} ${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}`,
      };
    }

    if (mode === 'hira_to_romaji') {
      const rawHint = `${item.visualEmoji} 平假名圖像提示：「${item.hiraMnemonicTitle}」— ${item.hiraMnemonicDesc}`;
      return {
        id: `gq-h2r-${item.romaji}-${shuffleSeed}`,
        category: 'gojuon',
        categoryLabel: '平假名認字讀音選擇題',
        prompt: item.hiragana,
        promptSub: `請選出平假名「${item.hiragana}」的正確羅馬拼音讀音`,
        promptType: 'gojuon_char',
        audioText: item.hiragana,
        disablePreAnswerAudio: true,
        options: allFourCards.map((c) => c.romaji),
        correctIndex: correctIdx,
        romaji: item.romaji,
        meaningZh: `平假名 ${item.hiragana}（片假名 ${item.katakana}）`,
        preHint: sanitizeHint(rawHint, [item.romaji]),
        explanation: `平假名「${item.hiragana}」（片假名「${item.katakana}」）讀作 [${item.romaji}]。\n${item.visualEmoji} ${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}`,
        mnemonicTip: item.examWordHint || `${item.kataMnemonicTitle}：${item.kataMnemonicDesc}`,
      };
    }

    if (mode === 'kata_to_romaji') {
      const rawHint = `${item.visualEmoji} 片假名圖像提示：「${item.kataMnemonicTitle}」— ${item.kataMnemonicDesc}`;
      return {
        id: `gq-k2r-${item.romaji}-${shuffleSeed}`,
        category: 'gojuon',
        categoryLabel: '片假名認字讀音選擇題',
        prompt: item.katakana,
        promptSub: `請選出片假名「${item.katakana}」的正確羅馬拼音讀音`,
        promptType: 'gojuon_char',
        audioText: item.hiragana,
        disablePreAnswerAudio: true,
        options: allFourCards.map((c) => c.romaji),
        correctIndex: correctIdx,
        romaji: item.romaji,
        meaningZh: `片假名 ${item.katakana}（平假名 ${item.hiragana}）`,
        preHint: sanitizeHint(rawHint, [item.romaji]),
        explanation: `片假名「${item.katakana}」（平假名「${item.hiragana}」）讀作 [${item.romaji}]。\n${item.visualEmoji} ${item.kataMnemonicTitle}：${item.kataMnemonicDesc}`,
        mnemonicTip: item.examWordHint || `${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}`,
      };
    }

    if (mode === 'audio_to_hira') {
      const rawHint = `${item.visualEmoji} 圖像提示：「${item.hiraMnemonicTitle}」— ${item.hiraMnemonicDesc}`;
      return {
        id: `gq-a2h-${item.romaji}-${shuffleSeed}`,
        category: 'gojuon',
        categoryLabel: '五十音聽音選平假名',
        prompt: '🔊 聽音辨平假名',
        promptSub: '請聆聽東京真人標準發音，選出正確的平假名',
        promptType: 'audio_only',
        audioText: item.hiragana,
        options: allFourCards.map((c) => c.hiragana),
        correctIndex: correctIdx,
        romaji: item.romaji,
        meaningZh: `發音 [${item.romaji}] · 平假名 ${item.hiragana}`,
        preHint: sanitizeHint(rawHint, [item.hiragana]),
        explanation: `語音播放的是「${item.hiragana} [${item.romaji}]」（片假名為「${item.katakana}」）。\n${item.visualEmoji} ${item.hiraMnemonicTitle}：${item.hiraMnemonicDesc}`,
        mnemonicTip: item.examWordHint,
      };
    }

    // audio_to_kata
    const rawHint = `${item.visualEmoji} 圖像提示：「${item.kataMnemonicTitle}」— ${item.kataMnemonicDesc}`;
    return {
      id: `gq-a2k-${item.romaji}-${shuffleSeed}`,
      category: 'gojuon',
      categoryLabel: '五十音聽音選片假名',
      prompt: '🔊 聽音辨片假名',
      promptSub: '請聆聽東京真人標準發音，選出正確的片假名',
      promptType: 'audio_only',
      audioText: item.hiragana,
      options: allFourCards.map((c) => c.katakana),
      correctIndex: correctIdx,
      romaji: item.romaji,
      meaningZh: `發音 [${item.romaji}] · 片假名 ${item.katakana}`,
      preHint: sanitizeHint(rawHint, [item.katakana]),
      explanation: `語音播放的是「${item.katakana} [${item.romaji}]」（平假名為「${item.hiragana}」）。\n${item.visualEmoji} ${item.kataMnemonicTitle}：${item.kataMnemonicDesc}`,
      mnemonicTip: item.examWordHint,
    };
  });
}
