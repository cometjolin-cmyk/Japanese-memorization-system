import React, { useState } from 'react';
import {
  FileCheck2,
  BookOpen,
  Hash,
  MessageCircle,
  Layers,
  AlertTriangle,
  Volume2,
  Sparkles,
  Play,
  Settings2,
} from 'lucide-react';
import { VoiceEngineType, speakJapanese } from '../utils/audio';

export type NavTab =
  | 'midterm_exam'
  | 'visual_mnemonics'
  | 'category_quiz'
  | 'gojuon_chart'
  | 'number_lab'
  | 'conversations'
  | 'flashcards'
  | 'mistakes_review';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  speechRate: number;
  onChangeSpeechRate: (rate: number) => void;
  voiceEngine: VoiceEngineType;
  onChangeVoiceEngine: (engine: VoiceEngineType) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  mistakesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  speechRate,
  onChangeSpeechRate,
  voiceEngine,
  onChangeVoiceEngine,
  soundEnabled,
  onToggleSound,
  mistakesCount,
}) => {
  const [isTestingVoice, setIsTestingVoice] = useState(false);

  const handleTestAudio = async () => {
    if (isTestingVoice) return;
    setIsTestingVoice(true);
    await speakJapanese('おはようございます。よろしくお願いします。', speechRate, voiceEngine);
    setIsTestingVoice(false);
  };

  const tabs = [
    {
      id: 'midterm_exam' as NavTab,
      label: '期中考全真測驗',
      icon: FileCheck2,
      sub: '40題·100分',
      badge: '必考原題',
    },
    {
      id: 'visual_mnemonics' as NavTab,
      label: '🎨 圖像記憶館',
      icon: Sparkles,
      sub: '清濁拗音秒記',
      badge: '背不起來救星',
    },
    {
      id: 'category_quiz' as NavTab,
      label: '專項自選測驗',
      icon: Sparkles,
      sub: '平/片/五十音/會話/數字',
    },
    {
      id: 'gojuon_chart' as NavTab,
      label: '五十音發音表',
      icon: Layers,
      sub: '清/濁/半濁/拗音',
    },
    {
      id: 'number_lab' as NavTab,
      label: '數字聽讀選',
      icon: Hash,
      sub: '0~1萬・音變特訓',
    },
    {
      id: 'conversations' as NavTab,
      label: '日常實用會話',
      icon: MessageCircle,
      sub: '早午晚安·謝謝·我回來了',
    },
    {
      id: 'flashcards' as NavTab,
      label: '單字速查卡',
      icon: BookOpen,
      sub: '40單字聽讀卡',
    },
    {
      id: 'mistakes_review' as NavTab,
      label: '錯題筆記本',
      icon: AlertTriangle,
      sub: '鎖定「寮」與易錯題',
      count: mistakesCount,
    },
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Brand & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm font-japanese">
            あ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-stone-900 text-lg leading-tight tracking-tight">
                日文一期中考前考衝刺複習系統
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                期中必勝 100 分
              </span>
            </div>
            <p className="text-xs text-stone-500">
              平片假名 40 原題 ＋ 五十音/拗音/濁音 ＋ 8大生活會話 ＋ 數字聽讀選
            </p>
          </div>
        </div>

        {/* Global Controls: Natural Voice Selection & Speed */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-stone-600">
          {/* Voice Engine Mode */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <span className="text-stone-500 font-medium pl-1 text-[11px] hidden lg:inline">發音音色:</span>
            <button
              onClick={() => onChangeVoiceEngine('google_natural')}
              title="Google 日本語母語真人自然原音（推薦，語調最自然真實）"
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                voiceEngine === 'google_natural'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <span>🌟 真人母語自然音</span>
            </button>
            <button
              onClick={() => onChangeVoiceEngine('system_female')}
              title="系統高品質自然女聲（如 七海 / Kyoko / Google 日本語）"
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                voiceEngine === 'system_female'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              系統女聲
            </button>
            <button
              onClick={() => onChangeVoiceEngine('system_male')}
              title="系統高品質自然男聲（如 啓太 / Otoya）"
              className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer ${
                voiceEngine === 'system_male'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              系統男聲
            </button>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={handleTestAudio}
            disabled={isTestingVoice}
            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-medium flex items-center gap-1 cursor-pointer transition-colors active:scale-95"
            title="試聽當前語音效果"
          >
            <Volume2 size={13} className={isTestingVoice ? 'animate-pulse text-amber-600' : ''} />
            <span>{isTestingVoice ? '播放中...' : '試聽發音'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <span className="text-stone-500 hidden sm:inline pl-1 text-[11px]">語速:</span>
            {[
              { rate: 0.75, label: '0.75x 慢速' },
              { rate: 0.9, label: '0.9x 標準' },
              { rate: 1.0, label: '1.0x 正常' },
            ].map((s) => (
              <button
                key={s.rate}
                onClick={() => onChangeSpeechRate(s.rate)}
                className={`px-1.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                  speechRate === s.rate
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Sound Effect toggle */}
          <button
            onClick={onToggleSound}
            className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              soundEnabled
                ? 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
            title="答題答對/答錯音效開關"
          >
            <span>{soundEnabled ? '音效開' : '靜音'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'} />
                <span className="whitespace-nowrap">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-amber-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.badge && !isActive && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
