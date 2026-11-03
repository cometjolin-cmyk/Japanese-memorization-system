import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Volume2,
  AlertTriangle,
  Lightbulb,
  Bookmark,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { QuizQuestion } from '../types/quiz';
import { speakJapanese, sfx } from '../utils/audio';
import { AudioButton } from './AudioButton';

interface QuizEngineProps {
  title: string;
  subtitle?: string;
  questions: QuizQuestion[];
  speechRate: number;
  soundEnabled: boolean;
  onMistakeAdded?: (question: QuizQuestion) => void;
  onMistakeResolved?: (questionId: string) => void;
  mistakeIds: Set<string>;
  onBackToHome?: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  title,
  subtitle,
  questions,
  speechRate,
  soundEnabled,
  onMistakeAdded,
  onMistakeResolved,
  mistakeIds,
  onBackToHome,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);

  const currentQ = questions[currentIndex];
  const hasAnswered = userAnswers[currentIndex] !== undefined;
  const selectedAnswer = userAnswers[currentIndex];
  const isCorrect = selectedAnswer === currentQ?.correctIndex;

  // Auto-speak when moving to next question if enabled
  useEffect(() => {
    if (autoPlayAudio && currentQ && !hasAnswered) {
      speakJapanese(currentQ.audioText, speechRate);
    }
  }, [currentIndex, autoPlayAudio]);

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;

    const correct = idx === currentQ.correctIndex;
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: idx }));

    if (soundEnabled) {
      if (correct) {
        sfx.playCorrect();
      } else {
        sfx.playWrong();
      }
    }

    if (!correct && onMistakeAdded) {
      onMistakeAdded(currentQ);
    } else if (correct && onMistakeResolved && mistakeIds.has(currentQ.id)) {
      onMistakeResolved(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      if (soundEnabled) {
        sfx.playCelebration();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  // Score calculation
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.entries(userAnswers).filter(
    ([indexStr, ansIdx]) => questions[Number(indexStr)]?.correctIndex === ansIdx
  ).length;

  // Score scaled to 100 points
  const pointsPerQuestion = 100 / totalQuestions;
  const totalScore = Math.round(correctCount * pointsPerQuestion);

  if (totalQuestions === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
        <p className="text-stone-600">目前沒有題目可供測驗。</p>
      </div>
    );
  }

  // Completion Screen
  if (isCompleted) {
    const wrongQuestions = questions.filter(
      (_, i) => userAnswers[i] !== undefined && userAnswers[i] !== questions[i].correctIndex
    );

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 mb-4">
            <Trophy size={36} />
          </div>

          <h2 className="text-2xl font-bold text-stone-900 mb-1">測驗完成！成績結算</h2>
          <p className="text-sm text-stone-500 mb-6">{title}</p>

          {/* Score Card */}
          <div className="inline-block bg-stone-50 border border-stone-200 rounded-2xl px-8 py-5 mb-6 text-center">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">獲得點數</div>
            <div className="text-5xl font-black text-amber-600 tracking-tight">
              {totalScore}
              <span className="text-xl font-medium text-stone-400"> / 100</span>
            </div>
            <div className="mt-2 text-sm text-stone-600">
              答對 <span className="font-bold text-emerald-600">{correctCount}</span> 題 / 共 {totalQuestions} 題
              （每題 {pointsPerQuestion % 1 === 0 ? pointsPerQuestion : pointsPerQuestion.toFixed(1)} 點數）
            </div>
          </div>

          {/* Feedback message */}
          <div className="max-w-md mx-auto mb-6 text-sm">
            {totalScore === 100 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                🎉 太厲害了！滿分 100 分！平假名與片假名已經完全熟練，期中考必定拿 A+！
              </div>
            ) : totalScore >= 90 ? (
              <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                ✨ 很棒！成績達到 {totalScore} 分！針對下方答錯的題目（特別是拗音與形似字）再複習一下就能穩拿滿分！
              </div>
            ) : (
              <div className="p-3 bg-stone-100 text-stone-700 rounded-xl border border-stone-200">
                💪 繼續加油！還有進步空間。請善用「錯題筆記」和「音標卡」加強記憶！
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>重新再測一次</span>
            </button>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
              >
                回首頁導覽
              </button>
            )}
          </div>
        </div>

        {/* Breakdown of missed questions */}
        {wrongQuestions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-red-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-bold text-base">
              <AlertTriangle size={18} />
              <span>本輪需特別加強的題目 ({wrongQuestions.length} 題)</span>
            </div>
            <div className="divide-y divide-stone-100">
              {wrongQuestions.map((q) => {
                const userChoice = userAnswers[questions.indexOf(q)];
                return (
                  <div key={q.id} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs text-stone-600">
                          第 {questions.indexOf(q) + 1} 題 · {q.categoryLabel}
                        </span>
                        <div className="text-xl font-bold text-stone-900 font-japanese flex items-center gap-2 mt-0.5">
                          <span>{q.prompt}</span>
                          <AudioButton text={q.audioText} rate={speechRate} size="sm" />
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-red-600">你的答案: {q.options[userChoice]}</span>
                        <div className="text-emerald-700 font-semibold">正解: {q.options[q.correctIndex]}</div>
                      </div>
                    </div>
                    <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200 whitespace-pre-line">
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Quiz Header & Progress */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                {currentQ.categoryLabel}
              </span>
              {currentQ.isPastExamMistake && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  前測失分題 (原得 0/5)
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">{title}</h2>
          </div>

          <div className="text-right">
            <div className="text-sm font-semibold text-stone-700">
              第 <span className="text-amber-600 font-bold">{currentIndex + 1}</span> / {totalQuestions} 題
            </div>
            <div className="text-xs text-stone-600">
              每題 {pointsPerQuestion % 1 === 0 ? pointsPerQuestion : pointsPerQuestion.toFixed(1)} 點數
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Question navigator dots */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 no-scrollbar">
          {questions.map((q, idx) => {
            const ans = userAnswers[idx];
            const isDone = ans !== undefined;
            const isRight = ans === q.correctIndex;
            const isCurrent = idx === currentIndex;

            let dotColor = 'bg-stone-200 text-stone-500 hover:bg-stone-300';
            if (isDone) {
              dotColor = isRight
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white';
            }
            if (isCurrent) {
              dotColor = 'ring-2 ring-amber-600 ring-offset-1 ' + dotColor;
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-md text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center justify-center ${dotColor}`}
                title={`第 ${idx + 1} 題`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        {/* Past mistake warning banner if applicable */}
        {currentQ.isPastExamMistake && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div className="text-xs sm:text-sm text-amber-900">
              <strong className="font-bold">★ 重點突破提點：</strong>
              這題是您先前答錯 (0/5 點數) 的題目！「寮」的讀音是「りょう (ryō)」，屬於<strong>拗長音（小寫 ょ ＋ 長音 う）</strong>。請仔細辨認大小寫與音節長度！
            </div>
          </div>
        )}

        {/* Question Prompt */}
        <div className="text-center py-4 px-2 bg-stone-50 rounded-2xl border border-stone-200/80">
          <div className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
            {currentQ.promptType === 'english_meaning'
              ? '請選出對應的日文片假名單字'
              : currentQ.promptType === 'audio_only'
              ? '請點擊聽取語音，選出正確答案'
              : '請選出正確的讀音或假名'}
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl sm:text-5xl font-black text-stone-900 font-japanese tracking-wide">
              {currentQ.prompt}
            </span>
            <AudioButton text={currentQ.audioText} rate={speechRate} size="lg" variant="primary" />
          </div>

          {currentQ.soundWarning && (
            <div className="mt-3 inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
              {currentQ.soundWarning}
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-stone-500 flex items-center justify-between">
            <span>點選以下選項完成作答：</span>
            <button
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              題目語音自動朗讀: {autoPlayAudio ? '開' : '關'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isOptionCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 hover:border-amber-300';
              let badge = null;

              if (hasAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold ring-1 ring-emerald-400';
                  badge = <CheckCircle2 size={20} className="text-emerald-600 shrink-0 ml-auto" />;
                } else if (isSelected && !isOptionCorrect) {
                  btnStyle = 'bg-red-50 text-red-900 border-red-300 ring-1 ring-red-300';
                  badge = <XCircle size={20} className="text-red-500 shrink-0 ml-auto" />;
                } else {
                  btnStyle = 'opacity-50 bg-stone-50 text-stone-500 border-stone-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${btnStyle} ${
                    !hasAnswered ? 'active:scale-98' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-white/80 border border-stone-200 flex items-center justify-center text-xs font-bold shrink-0 text-stone-600">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-japanese tracking-wide truncate">
                      {option}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Audio button for each option so user can hear the pronunciation difference */}
                    <AudioButton
                      text={option}
                      rate={speechRate}
                      size="sm"
                      variant="ghost"
                      className="opacity-70 hover:opacity-100"
                    />
                    {badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Explanation Box (shows after answering) */}
        {hasAnswered && (
          <div className="rounded-2xl p-5 bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 size={14} /> 正確 (+{pointsPerQuestion % 1 === 0 ? pointsPerQuestion : pointsPerQuestion.toFixed(1)} 點數)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-800">
                    <XCircle size={14} /> 錯誤 (+0 點數)
                  </span>
                )}
                <span className="text-xs text-stone-500">
                  正解: <strong className="text-stone-900 font-japanese text-sm">{currentQ.options[currentQ.correctIndex]}</strong>
                </span>
              </div>

              <div className="text-xs text-stone-500 font-mono">
                {currentQ.romaji} · {currentQ.meaningZh}
              </div>
            </div>

            <div className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
              {currentQ.explanation}
            </div>

            {currentQ.mnemonicTip && (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
                <Lightbulb size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">記憶口訣：</strong>
                  {currentQ.mnemonicTip}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:pointer-events-none text-sm font-medium transition-colors cursor-pointer"
          >
            上一題
          </button>

          <div className="flex items-center gap-2">
            {hasAnswered ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <span>{currentIndex === totalQuestions - 1 ? '查看結算成績' : '下一題'}</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <span className="text-xs text-stone-400">請先點選答案</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
