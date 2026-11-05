import React from 'react';
import {
  FileText,
  Bookmark,
  Sparkles,
  Layers,
  MessageSquare,
  Hash,
  ArrowRight,
  AlertTriangle,
  Flame,
  Shuffle,
} from 'lucide-react';
import { QuizCategory } from '../types/quiz';

interface CategoryQuizSelectorProps {
  onSelectCategory: (category: QuizCategory | 'custom_combined', name: string) => void;
  onOpenFullGojuonHub?: () => void;
}

export const CategoryQuizSelector: React.FC<CategoryQuizSelectorProps> = ({
  onSelectCategory,
  onOpenFullGojuonHub,
}) => {
  const categories = [
    {
      id: 'custom_combined' as const,
      title: '🎲 全範圍綜合隨機大亂鬥 (25題抽考)',
      desc: '從「期中 40 單字 ＋ 50 音魔王字 ＋ 8 大會話 ＋ 數字聽讀選」隨機抽出 25 題並打亂選項，每次點開都是全新考卷！',
      badge: '全範圍隨機抽題',
      badgeColor: 'bg-amber-600 text-white',
      count: '25 題 · 全範圍隨機',
      icon: Shuffle,
      highlight: true,
    },
    {
      id: 'midterm_hiragana' as QuizCategory,
      title: '期中考平假名原題 (20題)',
      desc: '何、犬、猫、母、十、百円、鉛筆、水、寮(★必看)、日本、雑誌、牛乳、病院、名前、靴、玉子、弟、先生、音楽、今日',
      badge: '期中原題 100%',
      badgeColor: 'bg-amber-100 text-amber-800',
      count: '20 題 · 100 分',
      icon: FileText,
      highlight: true,
    },
    {
      id: 'midterm_katakana' as QuizCategory,
      title: '期中考片假名原題 (20題)',
      desc: 'coffee、cake、convenience store、hamburger、toilet、milk、mask、necktie、携帯、card、ice cream、elevator、拉麵、notebook、hotel、taxi、supermarket、sheet、shirt、bed',
      badge: '期中原題 100%',
      badgeColor: 'bg-amber-100 text-amber-800',
      count: '20 題 · 100 分',
      icon: FileText,
      highlight: true,
    },
    {
      id: 'gojuon' as QuizCategory,
      title: '五十音平片對照與形似大魔王 (30題)',
      desc: '含圖像記憶提示！專考 シ/ツ、ソ/ン、ス/ヌ、ぬ/ね/め、わ/れ、は/ほ、る/ろ、ク/ケ/タ、ユ/コ 等易錯假名',
      badge: '附圖像記憶提示',
      badgeColor: 'bg-sky-100 text-sky-800',
      count: '30 題 · 形似對照',
      icon: Layers,
      hasFullHub: true,
    },
    {
      id: 'numbers' as QuizCategory,
      title: '系統唸數字 ➔ 我選數字聽力題庫 (24題)',
      desc: '系統自動唸出日文數字發音！涵蓋 0~10、4/7/9 雙讀法、300/600/800(さんびゃく/ろっぴゃく/はっぴゃく)、3000/8000、複合數字與金額',
      badge: '支援聽音選號',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      count: '24 題 · 聽音選數字',
      icon: Hash,
    },
    {
      id: 'conversation' as QuizCategory,
      title: '日常生活實用會話 (10題)',
      desc: '早安、午安、晚安、再見、謝謝、不好意思、麻煩你了、我回來了、歡迎回來、我開動了',
      badge: '必背 8 大會話',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      count: '10 題 · 情境選擇',
      icon: MessageSquare,
    },
    {
      id: 'dakuon_youon' as QuizCategory,
      title: '濁音、半濁音與拗音專項 (10題)',
      desc: '深入剖析寮(りょう vs りよう)、醫院(びょういん vs びよういん)、牛乳(ぎゅうにゅう)、鉛筆(ぴ)、ベッド',
      badge: '攻克失分陷阱',
      badgeColor: 'bg-red-100 text-red-800',
      count: '10 題 · 深度解讀',
      icon: Flame,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <h2 className="text-xl font-bold text-stone-900">分項專屬模擬練習題庫</h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          可依據您的複習進度，針對期中考原題、五十音、拗音/濁音、生活會話或數字聽力進行單元測驗。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all flex flex-col justify-between space-y-4 ${
                cat.highlight
                  ? 'border-amber-300 shadow-xs hover:border-amber-500'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                  <span className="text-xs text-stone-600 font-medium">{cat.count}</span>
                </div>

                <div className="flex items-center gap-2.5 mt-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-base text-stone-900">{cat.title}</h3>
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectCategory(cat.id, cat.title)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <span>開始本單元測驗</span>
                  <ArrowRight size={15} />
                </button>
                {cat.hasFullHub && onOpenFullGojuonHub && (
                  <button
                    onClick={onOpenFullGojuonHub}
                    className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                    title="開啟全 46 音七大模式題庫（含平轉片、片轉平、看字選音、聽音辨字）"
                  >
                    全46音模式
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
