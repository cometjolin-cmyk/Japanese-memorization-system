import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Sparkles,
  Layers,
  Hash,
  MessageCircle,
  BookOpen,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Flame,
  Volume2,
  Clock,
  Shuffle,
} from 'lucide-react';
import { Navbar, NavTab } from './components/Navbar';
import { QuizEngine } from './components/QuizEngine';
import { GojuonChart } from './components/GojuonChart';
import { NumberBoard } from './components/NumberBoard';
import { ConversationView } from './components/ConversationView';
import { FlashcardsView } from './components/FlashcardsView';
import { MistakesReview } from './components/MistakesReview';
import { CategoryQuizSelector } from './components/CategoryQuizSelector';
import { VisualMnemonics } from './components/VisualMnemonics';
import { GojuonQuizHub } from './components/GojuonQuizHub';
import { LastHourSprintHub } from './components/LastHourSprintHub';
import { HIRAGANA_EXAM_QUESTIONS, KATAKANA_EXAM_QUESTIONS } from './data/examQuestions';
import { GOJUON_PRACTICE_QUESTIONS, DAKUON_YOUON_QUESTIONS } from './data/gojuonData';
import { CONVERSATION_QUIZ_QUESTIONS } from './data/conversationData';
import { NUMBER_QUIZ_QUESTIONS } from './data/numberData';
import { QuizQuestion, QuizCategory } from './types/quiz';
import { AudioButton } from './components/AudioButton';
import { setVoiceEngine } from './utils/audio';

// Question 9 "寮" specifically failed in pre-test (0/5)
const DEFAULT_PRE_TEST_MISTAKE = HIRAGANA_EXAM_QUESTIONS.find((q) => q.id === 'h-9')!;

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('midterm_exam');
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [voiceEngine, setVoiceEngineState] = useState<'google_natural' | 'system_female' | 'system_male'>('google_natural');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Category quiz sub-state (if user picked a specific quiz inside category_quiz)
  const [activeQuizCategory, setActiveQuizCategory] = useState<QuizCategory | 'custom_combined' | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState<string>('');
  const [combinedRandomQuestions, setCombinedRandomQuestions] = useState<QuizQuestion[]>([]);

  const buildCombinedRandom25 = (): QuizQuestion[] => {
    const pool = [
      ...HIRAGANA_EXAM_QUESTIONS,
      ...KATAKANA_EXAM_QUESTIONS,
      ...GOJUON_PRACTICE_QUESTIONS,
      ...NUMBER_QUIZ_QUESTIONS,
      ...CONVERSATION_QUIZ_QUESTIONS,
    ];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 25).map((q) => {
      const indexed = q.options.map((opt, idx) => ({ opt, idx }));
      for (let i = indexed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
      }
      const newCorrectIndex = indexed.findIndex((item) => item.idx === q.correctIndex);
      return {
        ...q,
        options: indexed.map((item) => item.opt),
        correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
      };
    });
  };

  // Mistakes persistence in localStorage
  const [mistakes, setMistakes] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('japanese_exam_mistakes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load mistakes from storage:', e);
    }
    // Default includes Question 9 (寮) which user got 0/5 on in their pre-test
    return [DEFAULT_PRE_TEST_MISTAKE];
  });

  const [isRetestingMistakes, setIsRetestingMistakes] = useState(false);
  const [retestSnapshot, setRetestSnapshot] = useState<QuizQuestion[]>([]);

  // Save mistakes on change
  useEffect(() => {
    try {
      localStorage.setItem('japanese_exam_mistakes', JSON.stringify(mistakes));
    } catch (e) {
      console.warn('Failed to save mistakes:', e);
    }
  }, [mistakes]);

  const mistakeIds = new Set(mistakes.map((m) => m.id));

  const handleAddMistake = (q: QuizQuestion) => {
    setMistakes((prev) => {
      if (prev.some((item) => item.id === q.id)) return prev;
      return [...prev, q];
    });
  };

  const handleRemoveMistake = (id: string) => {
    setMistakes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllMistakes = () => {
    setMistakes([]);
  };

  // Launch Category Quiz
  const handleLaunchCategoryQuiz = (cat: QuizCategory | 'custom_combined', title: string) => {
    if (cat === 'custom_combined') {
      setCombinedRandomQuestions(buildCombinedRandom25());
    }
    setActiveQuizCategory(cat);
    setActiveQuizTitle(title);
    setIsRetestingMistakes(false);
  };

  // Launch Retest of Mistakes
  const handleRetestMistakes = () => {
    setRetestSnapshot([...mistakes]);
    setIsRetestingMistakes(true);
    setActiveTab('mistakes_review');
  };

  // Full 40 questions for the Midterm Exam (memoized so mistake updates don't reset active quiz state)
  const fullMidtermQuestions = useMemo(
    () => [...HIRAGANA_EXAM_QUESTIONS, ...KATAKANA_EXAM_QUESTIONS],
    []
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col text-stone-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveQuizCategory(null);
          setIsRetestingMistakes(false);
        }}
        speechRate={speechRate}
        onChangeSpeechRate={setSpeechRate}
        voiceEngine={voiceEngine}
        onChangeVoiceEngine={(engine) => {
          setVoiceEngineState(engine);
          setVoiceEngine(engine);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        mistakesCount={mistakes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TAB 1: MIDTERM EXAM (40 Questions or 20/20) */}
        {activeTab === 'midterm_exam' && (
          <div className="space-y-6">
            {/* Quick Hero Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                    期中考全真原題 40 問
                  </span>
                  <span className="text-xs text-amber-200">
                    平假名 20 題 (95分前測) ＋ 片假名 20 題 (100分前測)
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  日文一期中考前考衝刺 100 分實戰
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm mt-1 leading-relaxed">
                  每題 5 點數（共 40 題，採 100 分制標準計分）。支援真人音訊播放、詳細選項辨析、記憶口訣。特別鎖定前測 0/5 的「寮（りょう）」！
                </p>

                {/* Spotlight on past mistake question 9 */}
                <div className="mt-4 p-3 rounded-2xl bg-black/20 border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-amber-300 shrink-0" size={16} />
                    <span>
                      前測失分提醒：第 9 題「寮」讀作<strong>「りょう (ryō)」</strong>（拗長音），勿選「りよう」或「りゅう」！
                    </span>
                  </div>
                  <AudioButton text="寮、りょう" rate={speechRate} size="sm" variant="pill" label="聽寮發音" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab('sprint_hub')}
                    className="px-4 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <Clock size={15} />
                    <span>進入考前 1 小時「遮蓋法 × 逆推法」衝刺題庫 (全範圍 76+25 題)</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => setActiveTab('number_lab')}
                    className="px-4 py-2 rounded-xl bg-amber-900/40 hover:bg-amber-900/60 text-white border border-white/25 font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Hash size={15} />
                    <span>唸數字 ➔ 我選數字題庫 (24題＋無限隨機)</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quiz Engine with Full Midterm Questions */}
            <QuizEngine
              key="midterm-exam-engine"
              title="日文一期中考原題全真測驗"
              subtitle="包含平假名 20 題 ＋ 片假名 20 題"
              questions={fullMidtermQuestions}
              speechRate={speechRate}
              soundEnabled={soundEnabled}
              onMistakeAdded={handleAddMistake}
              onMistakeResolved={handleRemoveMistake}
              mistakeIds={mistakeIds}
              onBackToHome={() => setActiveTab('category_quiz')}
            />
          </div>
        )}

        {/* TAB: LAST HOUR SPRINT HUB (考前1小時遮蓋法 × 逆推法實戰題庫) */}
        {activeTab === 'sprint_hub' && (
          <LastHourSprintHub
            speechRate={speechRate}
            soundEnabled={soundEnabled}
            onMistakeAdded={handleAddMistake}
            onMistakeResolved={handleRemoveMistake}
            mistakeIds={mistakeIds}
            onGoToMistakes={() => setActiveTab('mistakes_review')}
          />
        )}

        {/* TAB: GOJUON MULTIPLE-CHOICE QUIZ HUB (五十音平假片假選擇題) */}
        {activeTab === 'gojuon_quiz' && (
          <GojuonQuizHub
            speechRate={speechRate}
            soundEnabled={soundEnabled}
            onMistakeAdded={handleAddMistake}
            onMistakeResolved={handleRemoveMistake}
            mistakeIds={mistakeIds}
            onGoToMnemonics={() => setActiveTab('visual_mnemonics')}
          />
        )}

        {/* TAB: VISUAL MNEMONICS (圖像記憶館) */}
        {activeTab === 'visual_mnemonics' && (
          <VisualMnemonics
            speechRate={speechRate}
            onLaunchPracticeQuiz={() => {
              setActiveTab('gojuon_quiz');
            }}
          />
        )}

        {/* TAB 2: CATEGORY QUIZ SELECTOR OR SPECIFIC QUIZ */}
        {activeTab === 'category_quiz' && (
          <div>
            {activeQuizCategory ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveQuizCategory(null)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                  >
                    ← 返回專項測驗列表
                  </button>

                  {activeQuizCategory === 'custom_combined' && (
                    <button
                      type="button"
                      onClick={() => setCombinedRandomQuestions(buildCombinedRandom25())}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Shuffle size={13} />
                      <span>從全範圍題庫重新抽取 25 題</span>
                    </button>
                  )}
                </div>

                <QuizEngine
                  key={`category-${activeQuizCategory}`}
                  title={activeQuizTitle || '專項自選測驗'}
                  questions={
                    activeQuizCategory === 'custom_combined'
                      ? combinedRandomQuestions
                      : activeQuizCategory === 'midterm_hiragana'
                      ? HIRAGANA_EXAM_QUESTIONS
                      : activeQuizCategory === 'midterm_katakana'
                      ? KATAKANA_EXAM_QUESTIONS
                      : activeQuizCategory === 'numbers'
                      ? NUMBER_QUIZ_QUESTIONS
                      : activeQuizCategory === 'conversation'
                      ? CONVERSATION_QUIZ_QUESTIONS
                      : activeQuizCategory === 'dakuon_youon'
                      ? DAKUON_YOUON_QUESTIONS
                      : GOJUON_PRACTICE_QUESTIONS
                  }
                  speechRate={speechRate}
                  soundEnabled={soundEnabled}
                  onMistakeAdded={handleAddMistake}
                  onMistakeResolved={handleRemoveMistake}
                  mistakeIds={mistakeIds}
                  onBackToHome={() => setActiveQuizCategory(null)}
                />
              </div>
            ) : (
              <CategoryQuizSelector
                onSelectCategory={handleLaunchCategoryQuiz}
                onOpenFullGojuonHub={() => setActiveTab('gojuon_quiz')}
              />
            )}
          </div>
        )}

        {/* TAB 3: GOJUON CHART */}
        {activeTab === 'gojuon_chart' && (
          <GojuonChart
            speechRate={speechRate}
            onStartGojuonQuiz={() => {
              setActiveTab('gojuon_quiz');
            }}
          />
        )}

        {/* TAB 4: NUMBER LAB */}
        {activeTab === 'number_lab' && (
          <NumberBoard
            speechRate={speechRate}
            soundEnabled={soundEnabled}
            onMistakeAdded={handleAddMistake}
            onMistakeResolved={handleRemoveMistake}
            mistakeIds={mistakeIds}
            onStartNumberQuiz={() => {
              setActiveTab('category_quiz');
              setActiveQuizCategory('numbers');
              setActiveQuizTitle('系統唸數字 ➔ 我選數字（24題聽力測驗）');
            }}
          />
        )}

        {/* TAB 5: CONVERSATIONS */}
        {activeTab === 'conversations' && (
          <ConversationView
            speechRate={speechRate}
            onStartQuiz={() => {
              setActiveTab('category_quiz');
              setActiveQuizCategory('conversation');
              setActiveQuizTitle('日常生活與課堂會話測驗');
            }}
          />
        )}

        {/* TAB 6: FLASHCARDS */}
        {activeTab === 'flashcards' && <FlashcardsView speechRate={speechRate} />}

        {/* TAB 7: MISTAKES REVIEW */}
        {activeTab === 'mistakes_review' && (
          <div>
            {isRetestingMistakes ? (
              <div className="space-y-4">
                <button
                  onClick={() => setIsRetestingMistakes(false)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  ← 返回錯題筆記列表
                </button>
                <QuizEngine
                  key="mistakes-retest-engine"
                  title="錯題弱點強化測驗"
                  questions={retestSnapshot.length > 0 ? retestSnapshot : mistakes}
                  speechRate={speechRate}
                  soundEnabled={soundEnabled}
                  onMistakeAdded={handleAddMistake}
                  onMistakeResolved={handleRemoveMistake}
                  mistakeIds={mistakeIds}
                  onBackToHome={() => setIsRetestingMistakes(false)}
                />
              </div>
            ) : (
              <MistakesReview
                mistakes={mistakes}
                speechRate={speechRate}
                onRetestMistakes={handleRetestMistakes}
                onRemoveMistake={handleRemoveMistake}
                onClearAllMistakes={handleClearAllMistakes}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-japanese font-bold text-amber-700">日本語一 期中考必勝</span>
            <span>· 全真 40 題模擬與真人朗讀系統</span>
          </div>
          <div className="flex items-center gap-4 text-stone-600">
            <span>平假名 20 題</span>
            <span>·</span>
            <span>片假名 20 題</span>
            <span>·</span>
            <span>五十音/濁音/拗音</span>
            <span>·</span>
            <span>日常會話</span>
            <span>·</span>
            <span>數字聽讀選</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
