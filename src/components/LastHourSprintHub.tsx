import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Eye,
  EyeOff,
  Headphones,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Play,
  Pause,
  ShieldAlert,
  Target,
  Layers,
  Shuffle,
} from 'lucide-react';
import {
  COVER_METHOD_ITEMS,
  REVERSE_DEDUCTION_QUESTIONS,
  SprintScope,
  CoverTestItem,
} from '../data/sprintData';
import { QuizQuestion } from '../types/quiz';
import { speakJapanese, sfx } from '../utils/audio';
import { AudioButton } from './AudioButton';
import { QuizEngine } from './QuizEngine';

interface LastHourSprintHubProps {
  speechRate: number;
  soundEnabled: boolean;
  onMistakeAdded: (question: QuizQuestion) => void;
  onMistakeResolved: (questionId: string) => void;
  mistakeIds: Set<string>;
  onGoToMistakes: () => void;
}

export const LastHourSprintHub: React.FC<LastHourSprintHubProps> = ({
  speechRate,
  soundEnabled,
  onMistakeAdded,
  onMistakeResolved,
  mistakeIds,
  onGoToMistakes,
}) => {
  const [methodTab, setMethodTab] = useState<'cover' | 'reverse'>('cover');

  // 60-minute countdown timer
  const [secondsLeft, setSecondsLeft] = useState<number>(60 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // 4-step exam-day checklist
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  // Cover Method State
  const [coverScope, setCoverScope] = useState<SprintScope>('all');
  const [coverBlindMode, setCoverBlindMode] = useState<'visual_cover' | 'audio_blind'>('visual_cover');
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [coverResults, setCoverResults] = useState<Record<string, 'pass' | 'fail'>>({});
  const [coverShuffleSeed, setCoverShuffleSeed] = useState<number>(0);

  // Reverse Deduction State
  const [reverseFilter, setReverseFilter] = useState<
    'all' | 'midterm_hiragana' | 'midterm_katakana' | 'gojuon' | 'conversation' | 'numbers'
  >('all');

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Filtered Cover items (with optional random shuffle)
  const filteredCoverItems = useMemo(() => {
    const base =
      coverScope === 'all'
        ? COVER_METHOD_ITEMS
        : COVER_METHOD_ITEMS.filter((item) => item.scope === coverScope);
    if (coverShuffleSeed === 0) return base;
    const copy = [...base];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [coverScope, coverShuffleSeed]);

  const currentCoverItem: CoverTestItem | undefined = filteredCoverItems[coverIndex];

  // Auto-play audio when in audio_blind mode
  useEffect(() => {
    if (
      methodTab === 'cover' &&
      coverBlindMode === 'audio_blind' &&
      currentCoverItem &&
      !isRevealed
    ) {
      speakJapanese(currentCoverItem.audioText, speechRate);
    }
  }, [coverIndex, coverBlindMode, methodTab, coverScope]);

  const handleSelectCoverScope = (scope: SprintScope) => {
    setCoverScope(scope);
    setCoverIndex(0);
    setIsRevealed(false);
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (currentCoverItem) {
      speakJapanese(currentCoverItem.audioText, speechRate);
    }
  };

  const buildFallbackQuizQuestion = (item: CoverTestItem): QuizQuestion => {
    if (item.linkedQuestion) return item.linkedQuestion;
    return {
      id: item.id,
      category:
        item.scope === 'midterm_hira'
          ? 'midterm_hiragana'
          : item.scope === 'midterm_kata'
          ? 'midterm_katakana'
          : item.scope === 'gojuon_demons'
          ? 'gojuon'
          : item.scope === 'conversations'
          ? 'conversation'
          : 'numbers',
      categoryLabel: `遮蓋法盲點｜${item.scopeLabel}`,
      prompt: item.prompt,
      promptSub: item.promptSub,
      promptType: 'kanji',
      audioText: item.audioText,
      options: [item.answer, '（考前遮蓋法標記之易錯題）', '（請默寫核對結構）', '（點擊上方聽發音）'],
      correctIndex: 0,
      romaji: item.romaji,
      meaningZh: item.promptSub,
      explanation: `正確答案：${item.answer} [${item.romaji}]\n結構重點：${item.structureTags.join(' · ')}\n防呆提醒：${item.trapWarning}`,
      mnemonicTip: item.trapWarning,
    };
  };

  const handleMarkCoverResult = (status: 'pass' | 'fail') => {
    if (!currentCoverItem) return;

    setCoverResults((prev) => ({ ...prev, [currentCoverItem.id]: status }));

    if (soundEnabled) {
      if (status === 'pass') {
        sfx.playCorrect();
      } else {
        sfx.playWrong();
      }
    }

    if (status === 'fail') {
      onMistakeAdded(buildFallbackQuizQuestion(currentCoverItem));
    } else if (currentCoverItem.linkedQuestion && mistakeIds.has(currentCoverItem.linkedQuestion.id)) {
      onMistakeResolved(currentCoverItem.linkedQuestion.id);
    }

    // Advance to next card
    if (coverIndex < filteredCoverItems.length - 1) {
      setCoverIndex((prev) => prev + 1);
      setIsRevealed(false);
    }
  };

  const passedCount = Object.values(coverResults).filter((v) => v === 'pass').length;
  const failedItems = COVER_METHOD_ITEMS.filter((item) => coverResults[item.id] === 'fail');

  // Filtered Reverse questions
  const filteredReverseQuestions = useMemo(() => {
    if (reverseFilter === 'all') return REVERSE_DEDUCTION_QUESTIONS;
    return REVERSE_DEDUCTION_QUESTIONS.filter((q) => q.category === reverseFilter);
  }, [reverseFilter]);

  const sprintSteps = [
    {
      step: 1,
      time: '0–20 分',
      title: '【遮蓋法】期中 40 單字視覺遮蓋默寫',
      desc: '切到「遮蓋答案模式」，遮住假名，看到漢字/英文在紙上寫出假名；特別檢查「寮 りょう」、「病院 びょういん」、「ベッド」、「シーツ」。',
    },
    {
      step: 2,
      time: '20–35 分',
      title: '【遮蓋法】50 音魔王字 ＋ 8 大會話 ＋ 數字純聽盲測',
      desc: '切到「純聽覺盲測模式」，遮住題目文字純聽發音寫答案，徹底封殺數字音變（300/600/800/3000/8000）與長短音！',
    },
    {
      step: 3,
      time: '35–50 分',
      title: '【逆推法】25 題誘答陷阱反向拆解選擇題',
      desc: '切換到「套路二：逆推法」，練習從錯誤選項、英文字源、筆劃方向與對話回應逆推正解，看穿老師所有陷阱！',
    },
    {
      step: 4,
      time: '50–60 分',
      title: '錯題筆記本總清零（紅燈轉綠燈）',
      desc: '打開頂部「錯題筆記本」，把前 50 分鐘標記的所有猶豫題與錯題再刷一遍，確認 100% 秒殺過關！',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Hero & 60-Min Sprint Timer */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
              <span>考前 1 小時終極作戰室</span>
              <span aria-hidden="true">·</span>
              <span>期中 40 單字 + 50 音魔王字 + 8 大會話 + 數字聽讀</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              「遮蓋法」×「逆推法」雙軌自我檢測實戰題庫
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              先用<strong>「遮蓋法」</strong>做零提示主動提取，抓出所有靠猜才對的假性熟悉；再用<strong>「逆推法」</strong>反向拆解誘答選項，封殺考場 100% 陷阱！
            </p>
          </div>

          {/* Interactive 60-Min Countdown Timer */}
          <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 min-w-[220px] text-center space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-center gap-1.5">
              <Clock size={13} className="text-amber-400" />
              <span>考前 60 分鐘衝刺計時器</span>
            </div>
            <div className="text-3xl font-black font-mono text-amber-400 tracking-wider">
              {formatTime(secondsLeft)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                {timerRunning ? <Pause size={12} /> : <Play size={12} />}
                <span>{timerRunning ? '暫停' : '開始倒數'}</span>
              </button>
              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsLeft(60 * 60);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-medium transition-colors cursor-pointer"
                title="重設為 60 分鐘"
              >
                重設
              </button>
            </div>
          </div>
        </div>

        {/* 4-Step Action Plan Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-stone-800">
          {sprintSteps.map((s) => {
            const isChecked = !!checkedSteps[s.step];
            return (
              <button
                key={s.step}
                type="button"
                onClick={() =>
                  setCheckedSteps((prev) => ({ ...prev, [s.step]: !prev[s.step] }))
                }
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isChecked
                    ? 'bg-emerald-950/60 border-emerald-700/70 text-emerald-100'
                    : 'bg-stone-800/70 border-stone-700/80 hover:border-amber-500/60 text-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isChecked ? 'text-emerald-400' : 'text-amber-400'}>
                      步驟 {s.step} · {s.time}
                    </span>
                    <CheckCircle2
                      size={15}
                      className={isChecked ? 'text-emerald-400' : 'text-stone-600'}
                    />
                  </div>
                  <div className="font-bold text-xs mt-1.5 leading-snug">{s.title}</div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Method Switcher Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          <button
            onClick={() => setMethodTab('cover')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              methodTab === 'cover'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <EyeOff size={16} />
            <span>套路一：【遮蓋法】全範圍主動提取檢測（76題）</span>
          </button>

          <button
            onClick={() => setMethodTab('reverse')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              methodTab === 'reverse'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Target size={16} />
            <span>套路二：【逆推法】誘答陷阱反向拆解選擇題（25題）</span>
          </button>
        </div>

        <div className="px-3 text-xs text-stone-500 flex items-center gap-3">
          <span>
            遮蓋已過關：<strong className="text-emerald-700">{passedCount}</strong> / {COVER_METHOD_ITEMS.length}
          </span>
          {failedItems.length > 0 && (
            <button
              onClick={onGoToMistakes}
              className="text-red-700 font-bold underline cursor-pointer"
            >
              盲點 ({failedItems.length}) ➔ 錯題本
            </button>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VIEW 1: 【遮蓋法】全範圍主動提取檢測台                                    */}
      {/* ===================================================================== */}
      {methodTab === 'cover' && currentCoverItem && (
        <div className="space-y-5">
          {/* Scope & Blind Mode Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Scope Filter */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all' as SprintScope, label: '全範圍 (76題)' },
                  { id: 'midterm_hira' as SprintScope, label: '期中平假名 (20)' },
                  { id: 'midterm_kata' as SprintScope, label: '期中片假名 (20)' },
                  { id: 'gojuon_demons' as SprintScope, label: '50音魔王字 (14)' },
                  { id: 'conversations' as SprintScope, label: '8大會話 (10)' },
                  { id: 'numbers' as SprintScope, label: '數字聽讀 (12)' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectCoverScope(sc.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      coverScope === sc.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              {/* Cover Mode Toggle: Visual Cover vs Audio-Only Blind */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => {
                    setCoverBlindMode('visual_cover');
                    setIsRevealed(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    coverBlindMode === 'visual_cover'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <EyeOff size={14} />
                  <span>遮蓋答案（看題默寫）</span>
                </button>
                <button
                  onClick={() => {
                    setCoverBlindMode('audio_blind');
                    setIsRevealed(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    coverBlindMode === 'audio_blind'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Headphones size={14} />
                  <span>純聽覺盲測（遮字聽音）</span>
                </button>
              </div>
            </div>

            {/* Random Order Bar for Cover Method */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCoverShuffleSeed((s) => s + 1);
                    setCoverIndex(0);
                    setIsRevealed(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Shuffle size={13} />
                  <span>{coverShuffleSeed > 0 ? '再隨機洗牌順序' : '隨機打亂題序'}</span>
                </button>
                {coverShuffleSeed > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverShuffleSeed(0);
                      setCoverIndex(0);
                      setIsRevealed(false);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                  >
                    恢復原順序
                  </button>
                )}
              </div>
              <span className="text-xs text-stone-500">
                {coverShuffleSeed > 0 ? '目前：隨機洗牌順序' : '目前：單元標準順序'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  目前單元：<strong className="text-stone-800">{currentCoverItem.scopeLabel}</strong>
                </span>
                <span>
                  第 <strong className="text-amber-700">{coverIndex + 1}</strong> / {filteredCoverItems.length} 題
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full transition-all duration-300"
                  style={{
                    width: `${((coverIndex + 1) / filteredCoverItems.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Cover Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            {/* Metadata Line (No pill boxes per design system) */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-800">{currentCoverItem.scopeLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {coverBlindMode === 'audio_blind'
                    ? '純聽音模式：請先聽發音寫出日語與意思'
                    : '視覺遮蓋模式：請先在紙上或心中默寫假名'}
                </span>
              </div>
              {coverResults[currentCoverItem.id] && (
                <span
                  className={`font-bold ${
                    coverResults[currentCoverItem.id] === 'pass'
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}
                >
                  {coverResults[currentCoverItem.id] === 'pass' ? '✓ 已標記過關' : '✕ 已標記盲點'}
                </span>
              )}
            </div>

            {/* Prompt Box */}
            <div className="bg-stone-50 rounded-2xl p-6 sm:p-8 border border-stone-200/80 text-center space-y-3">
              {coverBlindMode === 'audio_blind' && !isRevealed ? (
                <div className="py-4 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    🎧 題目文字已遮蓋 — 請聆聽日語發音寫出假名與意思
                  </div>
                  <div className="flex justify-center">
                    <AudioButton
                      text={currentCoverItem.audioText}
                      rate={speechRate}
                      size="lg"
                      variant="primary"
                      label="播放日語發音（可重聽）"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs sm:text-sm text-stone-600 font-medium">
                    {currentCoverItem.promptSub}
                  </div>
                  <div className="flex items-center justify-center gap-3 py-1">
                    <span
                      className={`font-black text-stone-900 font-japanese ${
                        currentCoverItem.prompt.length <= 8
                          ? 'text-4xl sm:text-5xl'
                          : 'text-2xl sm:text-3xl'
                      }`}
                    >
                      {currentCoverItem.prompt}
                    </span>
                    <AudioButton
                      text={currentCoverItem.audioText}
                      rate={speechRate}
                      size="md"
                      variant="subtle"
                      label="聽讀音"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Covered Answer Area vs Revealed Answer Area */}
            {!isRevealed ? (
              <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-8 text-center space-y-4">
                <div className="text-sm font-bold text-stone-700">
                  🙈 假名答案遮蓋中 — 請先在腦中或紙上寫出完整假名（注意小寫拗音、促音、長音、濁點！）
                </div>
                <button
                  onClick={handleReveal}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
                >
                  <Eye size={18} />
                  <span>揭曉正確假名並核對結構</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/30 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-800">
                    ✓ 正確答案揭曉（請核對每一個假名與大小寫）：
                  </span>
                  <span className="text-xs font-mono text-stone-600">
                    羅馬拼音：{currentCoverItem.romaji}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-emerald-200">
                  <div className="text-3xl sm:text-4xl font-black text-stone-900 font-japanese">
                    {currentCoverItem.answer}
                  </div>
                  <AudioButton
                    text={currentCoverItem.audioText}
                    rate={speechRate}
                    size="md"
                    variant="primary"
                    label="再聽一次發音"
                  />
                </div>

                {/* Structure breakdown */}
                <div className="text-xs text-stone-700 flex flex-wrap items-center gap-2">
                  <strong className="text-stone-900">必考結構檢查點：</strong>
                  {currentCoverItem.structureTags.map((tag, i) => (
                    <span
                      key={i}
                      className="font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Trap warning */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>考場防呆提醒：</strong>
                    {currentCoverItem.trapWarning}
                  </div>
                </div>

                {/* Self-assessment buttons */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleMarkCoverResult('pass')}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                  >
                    <CheckCircle2 size={18} />
                    <span>我有寫對（秒殺過關 ➔ 下一題）</span>
                  </button>
                  <button
                    onClick={() => handleMarkCoverResult('fail')}
                    className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                  >
                    <XCircle size={18} />
                    <span>寫錯 / 猶豫超過 3 秒（收入錯題本）</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  if (coverIndex > 0) {
                    setCoverIndex((prev) => prev - 1);
                    setIsRevealed(false);
                  }
                }}
                disabled={coverIndex === 0}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 disabled:opacity-30 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={15} />
                <span>上一題</span>
              </button>

              <button
                onClick={() => {
                  if (coverIndex < filteredCoverItems.length - 1) {
                    setCoverIndex((prev) => prev + 1);
                    setIsRevealed(false);
                  } else {
                    setCoverIndex(0);
                    setIsRevealed(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>
                  {coverIndex < filteredCoverItems.length - 1 ? '跳過下一題' : '回到本單元第一題'}
                </span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Failed items summary box if any */}
          {failedItems.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                  <ShieldAlert size={18} />
                  <span>本輪【遮蓋法】抓出的紅燈盲點 ({failedItems.length} 題，已同步至錯題筆記本)</span>
                </div>
                <button
                  onClick={onGoToMistakes}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                >
                  前往錯題筆記本重測
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {failedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-red-50/60 border border-red-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-900">{item.prompt}</span>
                      <span className="mx-1.5 text-stone-400">➔</span>
                      <span className="font-bold text-red-700 font-japanese">{item.answer}</span>
                    </div>
                    <AudioButton text={item.audioText} rate={speechRate} size="sm" variant="ghost" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: 【逆推法】誘答陷阱反向拆解選擇題                                 */}
      {/* ===================================================================== */}
      {methodTab === 'reverse' && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-bold text-stone-700">
              篩選逆推主題（從錯誤選項、英文字源、筆劃與音變規則反向破題）：
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'all', label: '全範圍逆推 (25題)' },
                { id: 'midterm_hiragana', label: '期中平假名逆推 (7)' },
                { id: 'midterm_katakana', label: '期中片假名逆推 (9)' },
                { id: 'gojuon', label: '50音魔王字逆推 (4)' },
                { id: 'conversation', label: '8大會話逆推 (3)' },
                { id: 'numbers', label: '數字音變逆推 (2)' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setReverseFilter(f.id as typeof reverseFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    reverseFilter === f.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <QuizEngine
            key={`reverse-deduction-${reverseFilter}`}
            title={`【逆推法】考點陷阱反向拆解實戰（${filteredReverseQuestions.length} 題）`}
            subtitle="練習先看穿誘答選項的破綻，再鎖定正解"
            questions={filteredReverseQuestions}
            speechRate={speechRate}
            soundEnabled={soundEnabled}
            onMistakeAdded={onMistakeAdded}
            onMistakeResolved={onMistakeResolved}
            mistakeIds={mistakeIds}
          />
        </div>
      )}
    </div>
  );
};
