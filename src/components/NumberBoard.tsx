import React, { useState } from 'react';
import { Volume2, Sparkles, Hash, AlertCircle, ArrowRight, Play } from 'lucide-react';
import { BASIC_NUMBERS, HUNDREDS, THOUSANDS } from '../data/numberData';
import { speakJapanese } from '../utils/audio';

interface NumberBoardProps {
  speechRate: number;
  onStartNumberQuiz?: () => void;
}

export const NumberBoard: React.FC<NumberBoardProps> = ({
  speechRate,
  onStartNumberQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'hundreds' | 'thousands'>('hundreds');
  const [playingValue, setPlayingValue] = useState<number | null>(null);

  const handlePlayNumber = (value: number, kana: string) => {
    setPlayingValue(value);
    // Take the primary reading before slash
    const speakText = kana.split('/')[0].trim();
    speakJapanese(speakText, speechRate);
    setTimeout(() => setPlayingValue(null), 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              期中考必背聽力與讀音
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            日文數字聽讀選特訓館（0～10,000 ＋ 特殊音變）
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            點擊任意數字卡片直接聽發音，重點掌握 300(濁音)、600/800(促音+半濁音)、3000(濁音)、8000(促音)
          </p>
        </div>

        {onStartNumberQuiz && (
          <button
            onClick={onStartNumberQuiz}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={16} />
            <span>開始數字聽讀選擇題測驗</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Special Rules Callout Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertCircle size={18} />
          <span>期中考絕對會考的「數字特殊音變」必備口訣</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
            <div className="text-amber-400 font-bold text-base">300 · さんびゃく</div>
            <div className="text-stone-300 mt-1">濁音「びゃく (byaku)」</div>
            <div className="text-stone-400 text-[11px] mt-0.5">百 (ひゃく) 遇到 3 變濁音</div>
          </div>
          <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
            <div className="text-amber-400 font-bold text-base">600 · ろっぴゃく</div>
            <div className="text-stone-300 mt-1">促音＋半濁音「ぴゃく」</div>
            <div className="text-stone-400 text-[11px] mt-0.5">ろく 縮成 ろっ + ぴゃく</div>
          </div>
          <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
            <div className="text-amber-400 font-bold text-base">800 · はっぴゃく</div>
            <div className="text-stone-300 mt-1">促音＋半濁音「ぴゃく」</div>
            <div className="text-stone-400 text-[11px] mt-0.5">はち 縮成 はっ + ぴゃく</div>
          </div>
          <div className="bg-stone-800 p-3 rounded-xl border border-stone-700">
            <div className="text-amber-400 font-bold text-base">3000 / 8000</div>
            <div className="text-stone-300 mt-1">さんぜん / はっせん</div>
            <div className="text-stone-400 text-[11px] mt-0.5">3000變濁音ぜん，8000變促音</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'basic' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          基本數字 0～10 (含4/7/9雙讀音)
        </button>
        <button
          onClick={() => setActiveTab('hundreds')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'hundreds' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          百位數 100～900 (音變重點)
        </button>
        <button
          onClick={() => setActiveTab('thousands')}
          className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'thousands' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          千位與萬 1000～10,000
        </button>
      </div>

      {/* Number Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {(activeTab === 'basic' ? BASIC_NUMBERS : activeTab === 'hundreds' ? HUNDREDS : THOUSANDS).map(
          (num) => {
            const isPlaying = playingValue === num.value;
            return (
              <button
                key={num.value}
                onClick={() => handlePlayNumber(num.value, num.kana)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                  num.isSpecialChange
                    ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                } ${isPlaying ? 'ring-2 ring-amber-500 bg-amber-100/70' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl font-black text-stone-900 tracking-tight">
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
                  <div className="text-xs text-stone-600 font-mono">
                    {num.romaji}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className={num.isSpecialChange ? 'text-amber-700 font-semibold text-[11px]' : 'text-stone-400 text-[11px]'}>
                    {num.note || '標準讀音'}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center transition-colors text-stone-500">
                    <Volume2 size={12} className={isPlaying ? 'animate-pulse' : ''} />
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};
