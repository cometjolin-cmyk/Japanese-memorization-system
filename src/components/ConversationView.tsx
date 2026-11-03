import React, { useState } from 'react';
import { Volume2, Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CONVERSATION_LIST } from '../data/conversationData';
import { speakJapanese } from '../utils/audio';
import { AudioButton } from './AudioButton';

interface ConversationViewProps {
  speechRate: number;
  onStartQuiz?: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  speechRate,
  onStartQuiz,
}) => {
  const [activeReply, setActiveReply] = useState<string | null>(null);

  const handlePlayReply = async (replyText: string, id: string) => {
    setActiveReply(id);
    await speakJapanese(replyText, speechRate);
    setActiveReply(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              期中考必考 8 大生活會話
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            日文日常實用會話聽讀專區
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            早安、午安、晚安、再見、謝謝、不好意思、麻煩您了、我回來了
          </p>
        </div>

        {onStartQuiz && (
          <button
            onClick={onStartQuiz}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={16} />
            <span>進入日常會話測驗</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Conversation Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONVERSATION_LIST.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-lg">
                  {item.zh}
                </span>
                <AudioButton text={item.kana} rate={speechRate} size="sm" variant="subtle" />
              </div>

              <div className="mt-3">
                <div className="text-2xl font-black text-stone-900 font-japanese">
                  {item.japanese}
                </div>
                <div className="text-xs text-amber-800 font-japanese mt-0.5">
                  【假名】{item.kana}
                </div>
                <div className="text-xs text-stone-600 font-mono mt-0.5">
                  {item.romaji}
                </div>
              </div>

              <div className="mt-3 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 leading-relaxed">
                <div>🎯 <strong>使用場合：</strong>{item.scene}</div>
                {item.keyPoints && (
                  <div className="mt-1 text-amber-900">
                    💡 <strong>考點提點：</strong>{item.keyPoints}
                  </div>
                )}
              </div>
            </div>

            {/* If there is a paired response (e.g. ただいま -> おかえりなさい) */}
            {item.reply && (
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                <div className="text-xs">
                  <span className="font-semibold text-amber-900">對應回答：</span>
                  <span className="font-japanese text-stone-900 font-bold ml-1">{item.reply}</span>
                  {item.replyZh && <span className="text-stone-500 ml-1">({item.replyZh})</span>}
                </div>
                <button
                  onClick={() => handlePlayReply(item.reply!, item.id)}
                  className="px-2 py-1 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Volume2 size={12} className={activeReply === item.id ? 'animate-pulse text-amber-600' : ''} />
                  <span>聽回答</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
