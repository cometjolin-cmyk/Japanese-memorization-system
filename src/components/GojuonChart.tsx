import React, { useState } from 'react';
import { Volume2, Sparkles, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { SEION_ROWS, DAKUON_ROWS, YOUON_ROWS } from '../data/gojuonData';
import { speakJapanese } from '../utils/audio';

interface GojuonChartProps {
  speechRate: number;
  onStartGojuonQuiz?: () => void;
}

export const GojuonChart: React.FC<GojuonChartProps> = ({
  speechRate,
  onStartGojuonQuiz,
}) => {
  const [tab, setTab] = useState<'seion' | 'dakuon' | 'youon'>('seion');
  const [displayScript, setDisplayScript] = useState<'both' | 'hiragana' | 'katakana'>('both');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const handleCharClick = (hira: string, kata: string) => {
    const textToSpeak = hira || kata;
    if (!textToSpeak) return;
    setSelectedChar(textToSpeak);
    speakJapanese(textToSpeak, speechRate);
  };

  const currentRows =
    tab === 'seion' ? SEION_ROWS : tab === 'dakuon' ? DAKUON_ROWS : YOUON_ROWS;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
              點擊任意方格立即真人朗讀
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            五十音與發音音標全覽圖（清音・濁音・半濁音・拗音）
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            日語期中考基礎骨架，支援平假名、片假名與發音切換，內建「片假名四天王」形似字特訓！
          </p>
        </div>

        {onStartGojuonQuiz && (
          <button
            onClick={onStartGojuonQuiz}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Sparkles size={16} />
            <span>進行五十音測驗</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Mode Filters */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('seion')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              tab === 'seion' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            清音 (五十音)
          </button>
          <button
            onClick={() => setTab('dakuon')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              tab === 'dakuon' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            濁音・半濁音
          </button>
          <button
            onClick={() => setTab('youon')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              tab === 'youon' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            拗音 (きゃ/しゃ/りょ)
          </button>
        </div>

        {/* Display Script Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
          <span className="text-stone-400 px-2 font-medium">顯示方式:</span>
          <button
            onClick={() => setDisplayScript('both')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayScript === 'both' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
            }`}
          >
            平片並列
          </button>
          <button
            onClick={() => setDisplayScript('hiragana')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayScript === 'hiragana' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
            }`}
          >
            只看平假名
          </button>
          <button
            onClick={() => setDisplayScript('katakana')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              displayScript === 'katakana' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
            }`}
          >
            只看片假名
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="space-y-3">
          {currentRows.map((row, rIdx) => (
            <div key={rIdx} className="space-y-1.5">
              <div className="text-xs font-semibold text-stone-400 pl-1">{row.rowName}</div>
              <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                {row.chars.map((char, cIdx) => {
                  if (!char.hiragana && !char.katakana) {
                    return (
                      <div
                        key={cIdx}
                        className="h-20 sm:h-22 rounded-xl bg-stone-50/50 border border-dashed border-stone-200/60 flex items-center justify-center text-stone-300 text-xs"
                      >
                        —
                      </div>
                    );
                  }

                  const isCurrent =
                    selectedChar === char.hiragana || selectedChar === char.katakana;

                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleCharClick(char.hiragana, char.katakana)}
                      className={`h-20 sm:h-22 p-2 rounded-xl border text-center transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-amber-100/90 border-amber-500 ring-2 ring-amber-400'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 hover:border-amber-300 active:scale-95'
                      }`}
                    >
                      <div className="text-[11px] text-stone-600 font-mono text-right w-full">
                        {char.romaji}
                      </div>

                      <div className="font-japanese leading-none flex items-baseline justify-center gap-1.5 my-auto">
                        {displayScript !== 'katakana' && (
                          <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                            {char.hiragana}
                          </span>
                        )}
                        {displayScript !== 'hiragana' && (
                          <span
                            className={`text-xl sm:text-2xl font-bold ${
                              displayScript === 'katakana'
                                ? 'text-stone-900 text-2xl sm:text-3xl'
                                : 'text-stone-600'
                            }`}
                          >
                            {char.katakana}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center text-stone-600 group-hover:text-amber-700">
                        <Volume2 size={12} className="opacity-60 group-hover:opacity-100" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Katakana Traps & Confusion Comparison Spotlight */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-amber-700" size={20} />
          <h3 className="font-bold text-stone-900 text-base">
            期中考片假名「大魔王」形似字終極圖解
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-semibold">
            期中考高頻失分區
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trap 1: シ vs ツ */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">1. シ (shi) vs ツ (tsu)</span>
              <span className="text-xs text-amber-800 font-mono">考題：タクシー / シーツ</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center py-2">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-3xl font-bold font-japanese text-amber-900">シ</div>
                <div className="text-xs font-bold text-stone-700 mt-1">shi (平躺微笑)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  兩點近乎水平，由<strong>左下往右上</strong>長挑
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-3xl font-bold font-japanese text-amber-900">ツ</div>
                <div className="text-xs font-bold text-stone-700 mt-1">tsu (站立直落)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  兩點縱向排列，由<strong>右上往左下</strong>撇落
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-600 bg-amber-50/50 p-2 rounded-lg">
              💡 <strong>計程車：</strong> 是「タクシー (shi)」，不是「タクツー」！<strong>床單：</strong>「シーツ」前面是シ、後面是ツ！
            </p>
          </div>

          {/* Trap 2: ソ vs ン */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">2. ソ (so) vs ン (n)</span>
              <span className="text-xs text-amber-800 font-mono">考題：ハンバーガー / ラーメン</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center py-2">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-3xl font-bold font-japanese text-amber-900">ソ</div>
                <div className="text-xs font-bold text-stone-700 mt-1">so (從上往下一斜)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  第一點斜立，第二筆從<strong>右上往下撇</strong>
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="text-3xl font-bold font-japanese text-amber-900">ン</div>
                <div className="text-xs font-bold text-stone-700 mt-1">n (從下往上一挑)</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  第一點偏平，第二筆從<strong>左下往右上長挑</strong>
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-600 bg-amber-50/50 p-2 rounded-lg">
              💡 <strong>漢堡：</strong> 是「ハンバーガー (han)」，不是「ハソ」！<strong>拉麵：</strong> 是「ラーメン (men)」，不是「メソ」！
            </p>
          </div>

          {/* Trap 3: ス vs ヌ */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">3. ス (su) vs ヌ (nu)</span>
              <span className="text-xs text-amber-800 font-mono">考題：マスク / アイスクリーム</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              「ス」右上角轉彎<strong>沒有出頭交叉</strong>，像注音的「ㄡ」；「ヌ」右上角則有<strong>交叉出頭</strong>（像「又」）。口罩是「マスク (masuku)」絕非「マヌク」！
            </p>
          </div>

          {/* Trap 4: 促音 ッ vs 長音 ー & 濁音 */}
          <div className="bg-white rounded-xl p-4 border border-amber-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900">4. ベッド (bed) 雙濁音＋促音</span>
              <span className="text-xs text-amber-800 font-mono">考題：bed / ケーキ</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              「ベッド (bed)」兩端都要點濁音：「ベ」濁音 + 小寫「ッ」+「ド」濁音！選項「ベット」少點濁點、「ペット」變成寵物 (pet)！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
