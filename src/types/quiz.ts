export type QuizCategory =
  | 'midterm_all'
  | 'midterm_hiragana'
  | 'midterm_katakana'
  | 'gojuon'
  | 'dakuon_youon'
  | 'conversation'
  | 'numbers';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  categoryLabel: string;
  questionNumber?: number;
  prompt: string;
  promptSub?: string;
  promptType: 'kanji' | 'katakana_word' | 'english_meaning' | 'conversation' | 'audio_only' | 'gojuon_char' | 'number';
  audioText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  furigana?: string;
  romaji: string;
  meaningZh: string;
  mnemonicTip?: string;
  isPastExamMistake?: boolean; // Specifically for 寮 (0/5)
  soundWarning?: string; // e.g. "長音注意", "促音注意", "拗音注意", "シ/ツ區分"
}

export interface GojuonChar {
  hiragana: string;
  katakana: string;
  romaji: string;
  group: 'seion' | 'dakuon' | 'handakuon' | 'youon';
  rowName?: string;
}

export interface NumberGuideItem {
  value: number;
  kanji: string;
  kana: string;
  romaji: string;
  note?: string;
  isSpecialChange?: boolean;
}

export interface ConversationItem {
  id: string;
  zh: string;
  japanese: string;
  kana: string;
  romaji: string;
  scene: string;
  reply?: string;
  replyZh?: string;
  keyPoints?: string;
}
