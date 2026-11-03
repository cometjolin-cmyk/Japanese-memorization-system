import React from 'react';
import { AlertTriangle, CheckCircle, RotateCcw, Volume2, Sparkles, BookX, Trash2 } from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import { AudioButton } from './AudioButton';

interface MistakesReviewProps {
  mistakes: QuizQuestion[];
  speechRate: number;
  onRetestMistakes: () => void;
  onRemoveMistake: (id: string) => void;
  onClearAllMistakes: () => void;
}

export const MistakesReview: React.FC<MistakesReviewProps> = ({
  mistakes,
  speechRate,
  onRetestMistakes,
  onRemoveMistake,
  onClearAllMistakes,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-red-100 text-red-800 flex items-center gap-1">
              <AlertTriangle size={12} />
              弱點集中營 · 包含「寮」與錯題
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            個人錯題與易混淆弱點筆記本
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            特別收錄前測失分 0/5 的「寮（りょう）」以及在測驗中答錯的題目，反覆鞏固直到 100 分！
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mistakes.length > 0 && (
            <>
              <button
                onClick={onRetestMistakes}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <RotateCcw size={15} />
                <span>立即重測這 {mistakes.length} 題</span>
              </button>
              <button
                onClick={onClearAllMistakes}
                className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="清空錯題本"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-stone-800">太棒了！目前錯題本空空如也</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            您在所有測驗中掌握度極佳！隨時可以在「期中考全真測驗」進行模擬檢測。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakes.map((q) => (
            <div
              key={q.id}
              className={`bg-white rounded-2xl p-6 border shadow-xs transition-all space-y-4 ${
                q.isPastExamMistake
                  ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/20'
                  : 'border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {q.categoryLabel}
                  </span>
                  {q.isPastExamMistake && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200">
                      ★ 前測 0/5 核心失分題
                    </span>
                  )}
                  {q.soundWarning && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {q.soundWarning}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onRemoveMistake(q.id)}
                  className="text-xs text-stone-400 hover:text-emerald-700 font-medium px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-1 cursor-pointer"
                  title="標記已掌握，移出租錯題本"
                >
                  <CheckCircle size={14} />
                  <span>已掌握</span>
                </button>
              </div>

              {/* Question display */}
              <div className="flex items-center justify-between bg-stone-50 p-4 rounded-xl border border-stone-200/80">
                <div>
                  <div className="text-xs text-stone-500 font-semibold mb-1">
                    題目 (點擊聽發音)：
                  </div>
                  <div className="text-3xl font-black text-stone-900 font-japanese flex items-center gap-3">
                    <span>{q.prompt}</span>
                    <AudioButton text={q.audioText} rate={speechRate} size="sm" variant="primary" />
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-emerald-800 font-semibold mb-1">正確答案：</div>
                  <div className="text-2xl font-bold text-emerald-700 font-japanese">
                    {q.options[q.correctIndex]}
                  </div>
                  <div className="text-xs text-stone-500 font-mono mt-0.5">
                    {q.romaji} · {q.meaningZh}
                  </div>
                </div>
              </div>

              {/* All choices comparison */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border text-center text-sm font-japanese font-bold flex items-center justify-between ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-stone-200 text-stone-500'
                      }`}
                    >
                      <span className="truncate">{opt}</span>
                      <AudioButton text={opt} rate={speechRate} size="sm" variant="ghost" />
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              <div className="text-xs sm:text-sm text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200 whitespace-pre-line leading-relaxed">
                {q.explanation}
              </div>

              {q.mnemonicTip && (
                <div className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200/80 font-medium">
                  💡 <strong>記憶口訣：</strong>{q.mnemonicTip}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
