import React, { useState } from 'react';
import { Volume2, ChevronLeft, ChevronRight, RotateCw, Lightbulb, AlertTriangle } from 'lucide-react';
import { HIRAGANA_EXAM_QUESTIONS, KATAKANA_EXAM_QUESTIONS } from '../data/examQuestions';
import { QuizQuestion } from '../types/quiz';
import { speakJapanese } from '../utils/audio';
import { AudioButton } from './AudioButton';

interface FlashcardsViewProps {
  speechRate: number;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ speechRate }) => {
  const [filter, setFilter] = useState<'all' | 'hiragana' | 'katakana'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const cardList: QuizQuestion[] =
    filter === 'hiragana'
      ? HIRAGANA_EXAM_QUESTIONS
      : filter === 'katakana'
      ? KATAKANA_EXAM_QUESTIONS
      : [...HIRAGANA_EXAM_QUESTIONS, ...KATAKANA_EXAM_QUESTIONS];

  const currentCard = cardList[currentIndex] || cardList[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cardList.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cardList.length) % cardList.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-stone-900">期中考 40 單字速查卡</h2>
          <p className="text-xs text-stone-500">翻卡快速記憶，點擊可立即聆聽日文發音</p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            全部 40 單字
          </button>
          <button
            onClick={() => {
              setFilter('hiragana');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'hiragana' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            平假名 20 題
          </button>
          <button
            onClick={() => {
              setFilter('katakana');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'katakana' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600'
            }`}
          >
            片假名 20 題
          </button>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div className="relative">
        <div
          onClick={handleFlip}
          className={`min-h-[340px] bg-white rounded-3xl border-2 transition-all duration-300 p-8 shadow-sm flex flex-col justify-between cursor-pointer select-none ${
            isFlipped ? 'border-amber-400 bg-amber-50/20' : 'border-stone-200 hover:border-amber-300'
          }`}
        >
          {/* Card Top Info */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
              {currentCard.categoryLabel} · 第 {currentIndex + 1} / {cardList.length} 卡
            </span>
            <div className="flex items-center gap-2">
              <AudioButton text={currentCard.audioText} rate={speechRate} size="sm" variant="subtle" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                title="翻轉卡片"
              >
                <RotateCw size={16} />
              </button>
            </div>
          </div>

          {/* Card Content (Front vs Back) */}
          <div className="my-auto text-center py-6">
            {!isFlipped ? (
              <div className="space-y-3">
                <div className="text-5xl sm:text-6xl font-black text-stone-900 font-japanese tracking-wider">
                  {currentCard.prompt}
                </div>
                <div className="text-xs text-stone-600 font-medium">
                  {currentCard.promptType === 'english_meaning' ? '英文釋義（外來語）' : '漢字單字'}
                </div>
                <div className="text-xs text-amber-700 font-semibold mt-4">
                  👆 點擊卡片翻面看正確假名讀音與詳解
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div className="text-4xl sm:text-5xl font-black text-amber-800 font-japanese tracking-wide">
                  {currentCard.options[currentCard.correctIndex]}
                </div>
                <div className="text-sm font-mono text-stone-600">
                  {currentCard.romaji}
                </div>
                <div className="text-base font-bold text-stone-800">
                  {currentCard.meaningZh}
                </div>
                {currentCard.soundWarning && (
                  <div className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    {currentCard.soundWarning}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card Bottom Hint */}
          <div className="text-xs text-stone-500 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span>
              {isFlipped ? '點擊卡片翻回正面' : '翻面揭曉假名與記憶口訣'}
            </span>
            {currentCard.isPastExamMistake && (
              <span className="text-red-700 font-bold flex items-center gap-1">
                <AlertTriangle size={14} /> 必考難題
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <ChevronLeft size={18} />
          <span>上一張</span>
        </button>

        <span className="text-xs font-mono text-stone-600 font-semibold">
          {currentIndex + 1} / {cardList.length}
        </span>

        <button
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <span>下一張</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
