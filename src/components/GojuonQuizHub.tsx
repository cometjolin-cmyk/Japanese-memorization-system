import React, { useState, useMemo } from 'react';
import {
  Shuffle,
  Layers,
  Volume2,
  Eye,
  Swords,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import {
  GojuonQuizMode,
  GojuonRowScope,
  buildGojuonQuizQuestions,
} from '../data/gojuonQuizBank';
import { QuizQuestion } from '../types/quiz';
import { QuizEngine } from './QuizEngine';

interface GojuonQuizHubProps {
  speechRate: number;
  soundEnabled: boolean;
  onMistakeAdded: (question: QuizQuestion) => void;
  onMistakeResolved: (questionId: string) => void;
  mistakeIds: Set<string>;
  onGoToMnemonics?: () => void;
}

export const GojuonQuizHub: React.FC<GojuonQuizHubProps> = ({
  speechRate,
  soundEnabled,
  onMistakeAdded,
  onMistakeResolved,
  mistakeIds,
  onGoToMnemonics,
}) => {
  const [mode, setMode] = useState<GojuonQuizMode>('hira_to_kata');
  const [rowScope, setRowScope] = useState<GojuonRowScope>('all');
  const [orderType, setOrderType] = useState<'ordered' | 'random_20' | 'random_all'>('random_20');
  const [shuffleSeed, setShuffleSeed] = useState<number>(2);

  const modeOptions: {
    id: GojuonQuizMode;
    label: string;
    shortDesc: string;
    badge?: string;
  }[] = [
    {
      id: 'hira_to_kata',
      label: '平假名 ➔ 選片假名',
      shortDesc: '看到平假名（如 し），選出對應片假名（シ）',
      badge: '最經典必考',
    },
    {
      id: 'kata_to_hira',
      label: '片假名 ➔ 選平假名',
      shortDesc: '看到片假名（如 ヌ），選出對應平假名（ぬ）',
    },
    {
      id: 'hira_to_romaji',
      label: '看平假名 ➔ 選讀音',
      shortDesc: '測驗平假名認字，從 4 個羅馬拼音中選正解',
    },
    {
      id: 'kata_to_romaji',
      label: '看片假名 ➔ 選讀音',
      shortDesc: '測驗片假名認字，攻克最容易忘記的片假名',
    },
    {
      id: 'audio_to_hira',
      label: '聽發音 ➔ 選平假名',
      shortDesc: '聽東京真人發音，從易混淆平假名中選出正解',
    },
    {
      id: 'audio_to_kata',
      label: '聽發音 ➔ 選片假名',
      shortDesc: '聽東京真人發音，從易混淆片假名中選出正解',
    },
    {
      id: 'tricky_pairs',
      label: '⚔️ 形似字大魔王 30 題',
      shortDesc: '專考 シ/ツ、ソ/ン、ス/ヌ、は/ほ、ぬ/ね/め、わ/れ 等陷阱',
      badge: '高頻失分特訓',
    },
  ];

  const rowScopes: { id: GojuonRowScope; label: string }[] = [
    { id: 'all', label: '全部 46 音' },
    { id: 'ak', label: 'あ・か行 (10音)' },
    { id: 'st', label: 'さ・た行 (10音)' },
    { id: 'nh', label: 'な・は行 (10音)' },
    { id: 'myrw', label: 'ま・や・ら・わ行 (16音)' },
  ];

  const questions = useMemo(() => {
    const seed = orderType === 'ordered' ? 1 : shuffleSeed;
    const limit =
      mode === 'tricky_pairs'
        ? 30
        : orderType === 'random_20' && rowScope === 'all'
        ? 20
        : 46;
    return buildGojuonQuizQuestions(mode, rowScope, limit, seed);
  }, [mode, rowScope, orderType, shuffleSeed]);

  const currentModeObj = modeOptions.find((m) => m.id === mode)!;

  const handleReshuffle = () => {
    if (orderType === 'ordered') {
      setOrderType('random_20');
    }
    setShuffleSeed((prev) => prev + 1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Control Panel */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                全 46 音平假名・片假名互動選擇題庫
              </span>
              <span className="text-xs text-stone-500">
                含圖像記憶提示 ＋ 錯題自動收錄
              </span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1.5">
              五十音平假・片假選擇題特訓館
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              可自由切換「平轉片」、「片轉平」、「看字選音」、「聽音辨字」與「形似字大魔王」，支援分段按行練習！
            </p>
          </div>

          {onGoToMnemonics && (
            <button
              onClick={onGoToMnemonics}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>先看五十音圖像記憶口訣</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* Step 1: Select Quiz Mode */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-700">1. 選擇測驗題型模式：</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {modeOptions.map((m) => {
              const isSelected = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-bold">{m.label}</span>
                  </div>
                  <span
                    className={`text-[11px] mt-1 leading-snug ${
                      isSelected ? 'text-amber-100' : 'text-stone-500'
                    }`}
                  >
                    {m.shortDesc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Row Scope & Order Controls (or reshuffle bar for tricky_pairs) */}
        {mode !== 'tricky_pairs' ? (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            {/* Row Scope */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-700">2. 選擇練習範圍（分段記憶更輕鬆）：</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {rowScopes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRowScope(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      rowScope === r.id
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Order & Shuffle */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-stone-700">3. 出題順序與題數：</div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setOrderType('random_20')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    orderType === 'random_20'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  隨機 20 題
                </button>
                <button
                  onClick={() => setOrderType('random_all')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    orderType === 'random_all'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  隨機全音
                </button>
                <button
                  onClick={() => setOrderType('ordered')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    orderType === 'ordered'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  依五十音順序
                </button>

                <button
                  onClick={handleReshuffle}
                  className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ml-1"
                  title="重新隨機抽取題目"
                >
                  <Shuffle size={13} />
                  <span>換一批題目</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-stone-600">
              已為您打亂 30 題形似字順序與選項位置，避免背位置誤答
            </div>
            <button
              type="button"
              onClick={handleReshuffle}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Shuffle size={13} />
              <span>換一批隨機順序</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Quiz Engine */}
      <QuizEngine
        key={`gojuon-hub-${mode}-${rowScope}-${orderType}-${shuffleSeed}`}
        title={`${currentModeObj.label}（共 ${questions.length} 題）`}
        subtitle={currentModeObj.shortDesc}
        questions={questions}
        speechRate={speechRate}
        soundEnabled={soundEnabled}
        onMistakeAdded={onMistakeAdded}
        onMistakeResolved={onMistakeResolved}
        mistakeIds={mistakeIds}
      />
    </div>
  );
};
