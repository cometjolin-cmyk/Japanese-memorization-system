import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shuffle,
  Mic,
  BookOpen,
  Headphones,
  Zap,
  Lightbulb,
} from 'lucide-react';
import {
  BASIC_NUMBERS,
  HUNDREDS,
  THOUSANDS,
  NUMBER_QUIZ_QUESTIONS,
  NUMBER_READING_QUESTIONS,
  NumberPracticeTier,
  generateRandomNumberQuestion,
  numberToJapanese,
} from '../data/numberData';
import { QuizQuestion } from '../types/quiz';
import { speakJapanese, sfx } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { QuizEngine } from './QuizEngine';

interface NumberBoardProps {
  speechRate: number;
  soundEnabled?: boolean;
  onMistakeAdded?: (question: QuizQuestion) => void;
  onMistakeResolved?: (questionId: string) => void;
  mistakeIds?: Set<string>;
  onStartNumberQuiz?: () => void;
}

type NumberSectionTab = 'listen_pick' | 'see_speak' | 'reference';
type ListenSubMode = 'curated_24' | 'infinite_random';

export const NumberBoard: React.FC<NumberBoardProps> = ({
  speechRate,
  soundEnabled = true,
  onMistakeAdded,
  onMistakeResolved,
  mistakeIds = new Set<string>(),
}) => {
  const [sectionTab, setSectionTab] = useState<NumberSectionTab>('listen_pick');
  const [listenSubMode, setListenSubMode] = useState<ListenSubMode>('curated_24');

  // Infinite Random Listening Drill State
  const [randomTier, setRandomTier] = useState<NumberPracticeTier>('mixed');
  const [randomCount, setRandomCount] = useState<number>(1);
  const [randomQuestion, setRandomQuestion] = useState<QuizQuestion>(() =>
    generateRandomNumberQuestion('mixed', 1)
  );
  const [selectedRandomIdx, setSelectedRandomIdx] = useState<number | null>(null);
  const [autoAdvanceOnCorrect, setAutoAdvanceOnCorrect] = useState<boolean>(false);
  const [showRandomHint, setShowRandomHint] = useState<boolean>(false);
  const [drillStats, setDrillStats] = useState<{
    attempted: number;
    correct: number;
    streak: number;
  }>({ attempted: 0, correct: 0, streak: 0 });

  const autoNextTimerRef = useRef<number | null>(null);

  // Reference Board State
  const [activeRefTab, setActiveRefTab] = useState<'basic' | 'hundreds' | 'thousands'>('hundreds');
  const [playingValue, setPlayingValue] = useState<number | null>(null);

  const clearAutoTimer = () => {
    if (autoNextTimerRef.current !== null) {
      window.clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearAutoTimer();
  }, []);

  const loadNextRandomQuestion = useCallback(
    (tierOverride?: NumberPracticeTier, shouldSpeak: boolean = true) => {
      clearAutoTimer();
      const targetTier = tierOverride || randomTier;
      const nextNum = randomCount + 1;
      const nextQ = generateRandomNumberQuestion(targetTier, nextNum);
      setRandomCount(nextNum);
      setRandomQuestion(nextQ);
      setSelectedRandomIdx(null);
      setShowRandomHint(false);
      if (shouldSpeak) {
        setTimeout(() => {
          speakJapanese(nextQ.audioText, speechRate);
        }, 80);
      }
    },
    [randomTier, randomCount, speechRate]
  );

  // Speak when switching into infinite_random mode
  useEffect(() => {
    if (sectionTab === 'listen_pick' && listenSubMode === 'infinite_random' && selectedRandomIdx === null) {
      speakJapanese(randomQuestion.audioText, speechRate);
    }
  }, [sectionTab, listenSubMode]);

  const handleSelectRandomOption = (idx: number) => {
    if (selectedRandomIdx !== null) return;
    setSelectedRandomIdx(idx);

    const isCorrect = idx === randomQuestion.correctIndex;
    if (soundEnabled) {
      if (isCorrect) {
        sfx.playCorrect();
      } else {
        sfx.playWrong();
      }
    }

    setDrillStats((prev) => ({
      attempted: prev.attempted + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
    }));

    if (isCorrect && autoAdvanceOnCorrect) {
      autoNextTimerRef.current = window.setTimeout(() => {
        loadNextRandomQuestion(randomTier, true);
      }, 1250);
    }
  };

  const handlePlayNumber = (value: number, kana: string) => {
    setPlayingValue(value);
    const speakText = kana.split('/')[0].trim();
    speakJapanese(speakText, speechRate);
    setTimeout(() => setPlayingValue(null), 1000);
  };

  const accuracyPct =
    drillStats.attempted > 0 ? Math.round((drillStats.correct / drillStats.attempted) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Primary Mode Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs text-stone-500 font-medium">
              期中考數字聽讀專區 · 0～10,000 ＋ 音變實戰
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              日文數字聽讀選實戰特訓
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              專為「系統唸數字 ➔ 你選數字」與「看數字開口唸 ➔ 核對讀音」打造，徹底攻克 4/7/9 雙讀法與 300/600/800/3000/8000 音變。
            </p>
          </div>
        </div>

        {/* Top Level Interactive Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => {
              clearAutoTimer();
              setSectionTab('listen_pick');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              sectionTab === 'listen_pick'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Headphones size={15} />
            <span>唸數字・我選數字（聽力題庫）</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearAutoTimer();
              setSectionTab('see_speak');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              sectionTab === 'see_speak'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Mic size={15} />
            <span>看數字・我來唸（16 題讀音核對）</span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearAutoTimer();
              setSectionTab('reference');
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0 ${
              sectionTab === 'reference'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <BookOpen size={15} />
            <span>0～1萬發音速查表</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 唸數字 -> 我選數字 (LISTEN & PICK NUMBER) */}
      {sectionTab === 'listen_pick' && (
        <div className="space-y-5">
          {/* Sub-mode Switcher: Curated 24 Questions vs Infinite Random Generator */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-stone-900">選擇聽數字練習模式</div>
              <div className="text-xs text-stone-500 mt-0.5">
                系統自動唸出日文數字發音，請聽音選出正確的阿拉伯數字或金額
              </div>
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  clearAutoTimer();
                  setListenSubMode('curated_24');
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  listenSubMode === 'curated_24'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                期中核心 24 題聽力測驗
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAutoTimer();
                  setListenSubMode('infinite_random');
                }}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  listenSubMode === 'infinite_random'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Shuffle size={14} />
                <span>無限隨機出題連刷</span>
              </button>
            </div>
          </div>

          {/* Sub-mode A: Curated 24-Question Exam Quiz */}
          {listenSubMode === 'curated_24' && (
            <QuizEngine
              key="number-listen-curated-24"
              title="系統唸數字 ➔ 我選數字（期中核心 24 題）"
              subtitle="循序涵蓋 0~10、4/7/9 雙讀法、300/600/800/3000/8000 音變、複合數字與日圓金額"
              questions={NUMBER_QUIZ_QUESTIONS}
              speechRate={speechRate}
              soundEnabled={soundEnabled}
              onMistakeAdded={onMistakeAdded}
              onMistakeResolved={onMistakeResolved}
              mistakeIds={mistakeIds}
            />
          )}

          {/* Sub-mode B: Infinite Random Number Generator */}
          {listenSubMode === 'infinite_random' && (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Tier & Auto-Advance Controls */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      無限隨機數字聽力練習器
                    </h3>
                    <div className="text-xs text-stone-500 mt-0.5 tabular-nums">
                      第 {randomCount} 題 · 已作答 {drillStats.attempted} 題 · 答對 {drillStats.correct} 題 · 連勝 {drillStats.streak} 題 · 正確率 {accuracyPct}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAutoAdvanceOnCorrect(!autoAdvanceOnCorrect)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        autoAdvanceOnCorrect
                          ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                      title="開啟後，答對時會在 1.2 秒後自動產生並朗讀下一題；答錯時會暫停讓您檢視解析"
                    >
                      <Zap size={13} />
                      <span>答對自動連刷：{autoAdvanceOnCorrect ? '開' : '關'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDrillStats({ attempted: 0, correct: 0, streak: 0 });
                        setRandomCount(0);
                        loadNextRandomQuestion(randomTier, true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      <RotateCcw size={13} />
                      <span>歸零重算</span>
                    </button>
                  </div>
                </div>

                {/* Range Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                  {(
                    [
                      { id: 'mixed', label: '全範圍綜合 (0～10,000)' },
                      { id: 'basic', label: '0～99 基礎與雙讀音' },
                      { id: 'hundreds', label: '100～999 百位音變' },
                      { id: 'thousands', label: '1,000～10,000 千萬大數' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setRandomTier(t.id);
                        loadNextRandomQuestion(t.id, true);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        randomTier === t.id
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Listening Question Card */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                {/* Audio Stage */}
                <div className="text-center py-6 px-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
                  <div className="text-xs font-medium text-stone-500">
                    {randomQuestion.categoryLabel} · {randomQuestion.promptSub}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-stone-900">
                    請聆聽日文數字發音，選出正確數字：
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <AudioButton
                      text={randomQuestion.audioText}
                      rate={speechRate}
                      size="lg"
                      variant="pill"
                      label="點擊唸出數字"
                    />
                    <AudioButton
                      text={randomQuestion.audioText}
                      rate={0.72}
                      size="sm"
                      variant="subtle"
                      label="0.72x 慢速重聽"
                    />
                    {selectedRandomIdx === null && (
                      <button
                        type="button"
                        onClick={() => loadNextRandomQuestion(randomTier, true)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Shuffle size={13} />
                        <span>換一題</span>
                      </button>
                    )}
                  </div>

                  {selectedRandomIdx === null && randomQuestion.soundWarning && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowRandomHint(!showRandomHint)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200/70 px-3 py-1.5 rounded-lg border border-amber-300/70 transition-colors cursor-pointer"
                      >
                        <Lightbulb size={14} />
                        <span>{showRandomHint ? '隱藏音變提示' : '不確定？點我看音變提示'}</span>
                      </button>
                      {showRandomHint && (
                        <div className="mt-2 text-xs text-amber-900 font-medium">
                          {randomQuestion.soundWarning}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRandomIdx !== null && (
                    <div className="pt-2 text-sm text-stone-700 font-japanese">
                      讀音解答：
                      <strong className="text-amber-900 font-bold text-lg ml-1">
                        {randomQuestion.furigana}
                      </strong>
                      <span className="text-stone-400 mx-2">·</span>
                      <span className="font-mono text-xs text-stone-500">
                        {randomQuestion.romaji}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4 Numeric Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {randomQuestion.options.map((opt, idx) => {
                    const hasAnswered = selectedRandomIdx !== null;
                    const isSelected = selectedRandomIdx === idx;
                    const isOptionCorrect = idx === randomQuestion.correctIndex;
                    const numericVal = Number(opt.replace(/[^\d]/g, ''));
                    const optionKana = !Number.isNaN(numericVal)
                      ? numberToJapanese(numericVal).kana
                      : opt;

                    let btnStyle =
                      'bg-stone-50 hover:bg-stone-100 text-stone-900 border-stone-200 hover:border-amber-400';
                    let statusIcon = null;

                    if (hasAnswered) {
                      if (isOptionCorrect) {
                        btnStyle =
                          'bg-emerald-50 text-emerald-950 border-emerald-500 font-bold ring-1 ring-emerald-500';
                        statusIcon = (
                          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        );
                      } else if (isSelected && !isOptionCorrect) {
                        btnStyle =
                          'bg-red-50 text-red-900 border-red-300 ring-1 ring-red-300';
                        statusIcon = <XCircle size={20} className="text-red-500 shrink-0" />;
                      } else {
                        btnStyle = 'opacity-55 bg-stone-50 text-stone-500 border-stone-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectRandomOption(idx)}
                        disabled={hasAnswered}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle} ${
                          !hasAnswered ? 'active:scale-98' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-xs font-bold shrink-0 text-stone-600">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <div>
                            <div className="text-2xl font-black tracking-tight tabular-nums">
                              {opt}
                            </div>
                            {hasAnswered && (
                              <div className="text-xs font-japanese text-stone-600 mt-0.5">
                                {optionKana}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {hasAnswered && (
                            <AudioButton
                              text={optionKana}
                              rate={speechRate}
                              size="sm"
                              variant="ghost"
                            />
                          )}
                          {statusIcon}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Result Breakdown & Next Action */}
                {selectedRandomIdx !== null && (
                  <div className="rounded-2xl p-5 bg-stone-50 border border-stone-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {selectedRandomIdx === randomQuestion.correctIndex ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                            <CheckCircle2 size={16} />
                            <span>答對了！</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700">
                            <XCircle size={16} />
                            <span>答錯了！</span>
                          </span>
                        )}
                        <span className="text-stone-300">·</span>
                        <span className="text-xs text-stone-600 tabular-nums">
                          正確答案：<strong className="text-stone-900">{randomQuestion.options[randomQuestion.correctIndex]}</strong>（{randomQuestion.furigana}）
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => loadNextRandomQuestion(randomTier, true)}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <span>下一題（自動唸出）</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>

                    <div className="text-xs sm:text-sm text-stone-700 whitespace-pre-line leading-relaxed">
                      {randomQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: 看數字 -> 我來唸 (SPEAK & VERIFY KANA READING) */}
      {sectionTab === 'see_speak' && (
        <QuizEngine
          key="number-see-speak-16"
          title="看數字自己開口唸 ➔ 選讀音假名核對（16 題）"
          subtitle="題目先遮住發音，請看著數字自己大聲唸出來，再點選正確假名並聆聽真人標準音對照"
          questions={NUMBER_READING_QUESTIONS}
          speechRate={speechRate}
          soundEnabled={soundEnabled}
          onMistakeAdded={onMistakeAdded}
          onMistakeResolved={onMistakeResolved}
          mistakeIds={mistakeIds}
        />
      )}

      {/* SECTION 3: 0～10,000 發音速查表 */}
      {sectionTab === 'reference' && (
        <div className="space-y-6">
          {/* Special Rules Callout Banner */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertCircle size={18} />
              <span>期中考絕對會考的「數字特殊音變」必備口訣</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
                <div className="text-amber-400 font-bold text-base tabular-nums">300 · さんびゃく</div>
                <div className="text-stone-300 mt-1">濁音「びゃく (byaku)」</div>
                <div className="text-stone-400 text-[11px] mt-0.5">百 (ひゃく) 遇到 3 變濁音</div>
              </div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
                <div className="text-amber-400 font-bold text-base tabular-nums">600 · ろっぴゃく</div>
                <div className="text-stone-300 mt-1">促音＋半濁音「ぴゃく」</div>
                <div className="text-stone-400 text-[11px] mt-0.5">ろく 縮成 ろっ + ぴゃく</div>
              </div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
                <div className="text-amber-400 font-bold text-base tabular-nums">800 · はっぴゃく</div>
                <div className="text-stone-300 mt-1">促音＋半濁音「ぴゃく」</div>
                <div className="text-stone-400 text-[11px] mt-0.5">はち 縮成 はっ + ぴゃく</div>
              </div>
              <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
                <div className="text-amber-400 font-bold text-base tabular-nums">3000 / 8000</div>
                <div className="text-stone-300 mt-1">さんぜん / はっせん</div>
                <div className="text-stone-400 text-[11px] mt-0.5">3000變濁音ぜん，8000變促音</div>
              </div>
            </div>
          </div>

          {/* Range Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setActiveRefTab('basic')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeRefTab === 'basic'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              基本數字 0～10 (含4/7/9雙讀音)
            </button>
            <button
              type="button"
              onClick={() => setActiveRefTab('hundreds')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeRefTab === 'hundreds'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              百位數 100～900 (音變重點)
            </button>
            <button
              type="button"
              onClick={() => setActiveRefTab('thousands')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeRefTab === 'thousands'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              千位與萬 1000～10,000
            </button>
          </div>

          {/* Number Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(activeRefTab === 'basic'
              ? BASIC_NUMBERS
              : activeRefTab === 'hundreds'
              ? HUNDREDS
              : THOUSANDS
            ).map((num) => {
              const isPlaying = playingValue === num.value;
              return (
                <button
                  key={num.value}
                  type="button"
                  onClick={() => handlePlayNumber(num.value, num.kana)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                    num.isSpecialChange
                      ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                      : 'bg-white border-stone-200 hover:border-amber-300'
                  } ${isPlaying ? 'ring-2 ring-amber-500 bg-amber-100/70' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl font-black text-stone-900 tracking-tight tabular-nums">
                      {num.value.toLocaleString()}
                    </span>
                    <span className="text-xs font-japanese font-bold text-stone-500">
                      {num.kanji}
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="text-lg font-bold text-amber-900 font-japanese">
                      {num.kana}
                    </div>
                    <div className="text-xs text-stone-600 font-mono">{num.romaji}</div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span
                      className={
                        num.isSpecialChange
                          ? 'text-amber-700 font-semibold text-[11px]'
                          : 'text-stone-400 text-[11px]'
                      }
                    >
                      {num.note || '標準讀音'}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors text-stone-500">
                      <Volume2 size={12} className={isPlaying ? 'animate-pulse' : ''} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
