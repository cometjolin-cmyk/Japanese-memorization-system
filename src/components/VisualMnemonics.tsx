import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Eye,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SEION_MNEMONICS } from '../data/mnemonicData';
import { MnemonicCard } from '../types/quiz';
import { AudioButton } from './AudioButton';

interface VisualMnemonicsProps {
  speechRate: number;
  onLaunchPracticeQuiz?: () => void;
}

export const VisualMnemonics: React.FC<VisualMnemonicsProps> = ({
  speechRate,
  onLaunchPracticeQuiz,
}) => {
  const [selectedRow, setSelectedRow] = useState<string>('all');
  const [scriptMode, setScriptMode] = useState<'both' | 'hira' | 'kata'>('both');
  const [searchQuery, setSearchQuery] = useState('');

  const rowList = [
    { id: 'all', label: '全部清音 (46字)' },
    { id: 'あ行 (a)', label: 'あ行 (a)' },
    { id: 'か行 (ka)', label: 'か行 (ka)' },
    { id: 'さ行 (sa)', label: 'さ行 (sa)' },
    { id: 'た行 (ta)', label: 'た行 (ta)' },
    { id: 'な行 (na)', label: 'な行 (na)' },
    { id: 'は行 (ha)', label: 'は行 (ha)' },
    { id: 'ま行 (ma)', label: 'ま行 (ma)' },
    { id: 'や行 (ya)', label: 'や行 (ya)' },
    { id: 'ら行 (ra)', label: 'ら行 (ra)' },
    { id: 'わ行 / 撥音', label: 'わ行 / 撥音 (n)' },
    { id: 'special_dakuon', label: '⚡ 濁音半濁音心法' },
    { id: 'special_youon', label: '🪄 拗音融合心法' },
    { id: 'special_four_kings', label: '⚔️ 片假名四大魔王' },
  ];

  const filteredCards = SEION_MNEMONICS.filter((card) => {
    if (selectedRow.startsWith('special_')) return false;
    if (selectedRow !== 'all' && card.row !== selectedRow) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        card.hiragana.includes(q) ||
        card.katakana.includes(q) ||
        card.romaji.includes(q) ||
        card.hiraMnemonicTitle.toLowerCase().includes(q) ||
        card.kataMnemonicTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white flex items-center gap-1">
              <Sparkles size={12} /> 圖像聯想記憶專區
            </span>
            <span className="text-xs text-amber-200">
              拯救記不住五十音・清音・濁音・拗音
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            日語五十音圖像聯想記憶法圖鑑
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
            把枯燥的假名符號轉化為「具體生活圖像」與「幽默諧音故事」。看到蘋果🍎就想到「あ」、看到鑰匙🔑就想到「き」、看到垂釣鉤🎣就想到「し」。點擊卡片隨時聽真人標準東京發音！
          </p>
        </div>
      </div>

      {/* Row Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-xs font-bold text-stone-700">選擇想記憶的音行：</div>
          {/* Script view mode */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
            <span className="text-stone-400 px-2 font-medium">切換焦點:</span>
            <button
              onClick={() => setScriptMode('both')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                scriptMode === 'both' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              平片並列
            </button>
            <button
              onClick={() => setScriptMode('hira')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                scriptMode === 'hira' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              專注平假名
            </button>
            <button
              onClick={() => setScriptMode('kata')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                scriptMode === 'kata' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-600'
              }`}
            >
              專注片假名
            </button>
          </div>
        </div>

        {/* Row Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {rowList.map((r) => {
            const isSelected = selectedRow === r.id;
            const isSpecial = r.id.startsWith('special_');
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRow(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? isSpecial
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-stone-900 text-white shadow-xs'
                    : isSpecial
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SPECIAL VIEW 1: DAKUON & HANDAKUON (濁音・半濁音圖像心法) */}
      {(selectedRow === 'special_dakuon' || selectedRow === 'all') && (
        <div className="bg-amber-50/60 border border-amber-300 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <Zap size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  濁音「゛」與半濁音「゜」圖像心法：噴口水 vs 吹泡泡
                </h3>
                <p className="text-xs text-stone-600">
                  很多人背不起來濁音到底是什麼？記住這個「發聲器官動作圖像」瞬間秒懂！
                </p>
              </div>
            </div>
            <AudioButton text="か、が、さ、ざ、た、だ、は、ば、ぱ" rate={speechRate} size="sm" label="聽濁音半濁音對照" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* 濁音心法 */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="text-xl">💦</span> 1. 濁音符號「゛」：用力噴出兩滴口水
                </span>
                <span className="text-xs font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">が ざ だ ば</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>【圖像記憶】</strong>原本的假名（か、さ、た、は）都是乾淨清爽的「清音」。當你喉嚨突然猛烈震動、說話太激動時，右上角噴出了<strong>兩滴唾沫「゛」</strong>！聲帶振動，聲音就變得渾厚低沉：
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <li>• <strong>か (ka) 噴兩滴 ➔ が (ga)</strong>（期中考：音楽 おん<strong>が</strong>く）</li>
                <li>• <strong>さ (sa) 噴兩滴 ➔ ざ (za)</strong>（期中考：雑誌 <strong>ざ</strong>っし）</li>
                <li>• <strong>た (ta) 噴兩滴 ➔ だ (da)</strong>（期中考：ベッド ベッ<strong>ド</strong>）</li>
                <li>• <strong>は (ha) 噴兩滴 ➔ ば (ba)</strong>（期中考：ハンバーガー ハン<strong>バーガー</strong>）</li>
              </ul>
            </div>

            {/* 半濁音心法 */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="text-xl">🫧</span> 2. 半濁音符號「゜」：嘴唇爆開吹小泡泡
                </span>
                <span className="text-xs font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">ぱ ぴ ぷ ぺ ぽ</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                <strong>【圖像記憶】</strong>右上角不是兩點，而是一個<strong>圓滾滾的小肥皂泡「゜」</strong>！日文中「只有 は行」能吹泡泡！雙唇緊閉然後 POP 地一聲吹出泡泡，發出爆破的「P」音：
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <li>• <strong>は (ha) 吹泡泡 ➔ ぱ (pa)</strong></li>
                <li>• <strong>ひ (hi) 吹泡泡 ➔ ぴ (pi)</strong>（期中考必考：鉛筆 えん<strong>ぴ</strong>つ，筆尖圓圓配小泡泡！）</li>
                <li>• <strong>ふ (fu) 吹泡泡 ➔ ぷ (pu)</strong></li>
                <li>• <strong>へ (he) 吹泡泡 ➔ ぺ (pe)</strong></li>
                <li>• <strong>ほ (ho) 吹泡泡 ➔ ぽ (po)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL VIEW 2: YOUON FUSION (拗音小精靈融合心法 & 寮突破) */}
      {(selectedRow === 'special_youon' || selectedRow === 'all') && (
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600 text-white">
                <Flame size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-amber-400">
                  拗音融合術心法：大巨人抱著小精靈 (ゃ・ゅ・ょ)
                </h3>
                <p className="text-xs text-stone-300">
                  破解前測失分 0/5 的「寮（りょう）」與「病院（びょういん）」混淆大盲區！
                </p>
              </div>
            </div>
            <AudioButton text="りょう、びょういん、ぎゅうにゅう" rate={speechRate} size="sm" variant="pill" label="聽拗長音示範" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            {/* 核心圖像法則 */}
            <div className="bg-stone-850 p-5 rounded-2xl border border-stone-700 space-y-3">
              <div className="text-amber-400 font-bold text-sm">
                1. 為什麼一定要縮小？（小寫 ゃ・ゅ・ょ 是連體嬰）
              </div>
              <p className="text-stone-300 leading-relaxed">
                拗音是<strong>「い段音（き/し/ち/に/ひ/み/り）」</strong>把「や/ゆ/よ」縮小抱在懷裡！
                因為前字只拿骨架子音，後面小精靈負責填入母音，兩個人「合體成一拍」！
              </p>
              <div className="p-3 bg-stone-800 rounded-xl border border-stone-700 text-stone-200">
                <div className="font-mono text-amber-300 font-bold">き (k) ＋ ゃ (ya) ＝ kya（一拍！）</div>
                <div className="font-mono text-amber-300 font-bold">し (sh) ＋ ゅ (yu) ＝ shu（一拍！）</div>
                <div className="font-mono text-amber-300 font-bold">り (r) ＋ ょ (yo) ＝ ryo（一拍！）</div>
              </div>
            </div>

            {/* 寮 vs 利用、病院 vs 美容院 */}
            <div className="bg-stone-850 p-5 rounded-2xl border border-stone-700 space-y-3">
              <div className="text-amber-400 font-bold text-sm">
                2. ★ 期中考必殺陷阱：小寫是宿舍、大寫變利用！
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-700/60">
                  <div className="text-red-300 font-bold font-japanese text-sm">
                    寮 ＝「りょう (ryō)」(2拍拗長音)
                  </div>
                  <div className="text-stone-400 text-[11px] mt-0.5">
                    學生宿舍房間小小的，所以「ょ」要縮到房間角落，後面加「う」拉長：<strong>りょう</strong>！
                    ❌ 如果寫成大寫「りよう」是 3 拍的「利用」，直接得 0 分！
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-700/60">
                  <div className="text-amber-300 font-bold font-japanese text-sm">
                    病院 ＝「びょういん」 vs 美容院 ＝「びよういん」
                  </div>
                  <div className="text-stone-400 text-[11px] mt-0.5">
                    生病送醫院要爭分奪秒，縮小「びょういん」；去沙龍做美髮慢慢保養，寫大寫「びよういん」！
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL VIEW 3: KATAKANA FOUR KINGS (片假名四大魔王) */}
      {(selectedRow === 'special_four_kings' || selectedRow === 'all') && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-600 text-white">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  片假名四大魔王死穴破解：シ・ツ・ソ・ン
                </h3>
                <p className="text-xs text-stone-500">
                  每年日語期中考至少考 3 題的終極視力測驗！用動態筆劃意象永不看錯。
                </p>
              </div>
            </div>
            <AudioButton text="シ、ツ、ソ、ン、タクシー、ハンバーガー" rate={speechRate} size="sm" label="聽四魔王發音" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Duel 1: シ vs ツ */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">對決一：シ (shi) vs ツ (tsu)</span>
                <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">考題：タクシー / シーツ</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-4xl font-black font-japanese text-amber-800">シ</div>
                  <div className="text-xs font-bold text-stone-800 mt-1">shi · 平躺微笑</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    兩點水平，第三筆從<strong>「左下往右上長揚」</strong>（像嘴角微笑 Smile / shi）
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-4xl font-black font-japanese text-amber-800">ツ</div>
                  <div className="text-xs font-bold text-stone-800 mt-1">tsu · 直立下墜</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    兩點垂直站立，第三筆從<strong>「右上往左下垂落」</strong>（像雨滴垂直墜落）
                  </div>
                </div>
              </div>
              <div className="text-xs text-stone-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                💡 <strong>計程車 Taxi：</strong> 是「タク<strong>シー</strong>」，不是「タクツー」！<strong>床單 Sheet：</strong>「<strong>シ</strong>ー<strong>ツ</strong>」前面是平躺微笑シ、結尾是直落下墜ツ！
              </div>
            </div>

            {/* Duel 2: ソ vs ン */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">對決二：ソ (so) vs ン (n)</span>
                <span className="text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">考題：ハンバーガー / ラーメン</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-4xl font-black font-japanese text-amber-800">ソ</div>
                  <div className="text-xs font-bold text-stone-800 mt-1">so · 溜滑梯向下</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    第一點斜立，第二筆從<strong>「右上往下左滑落」</strong>，兩筆皆由上往下！
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <div className="text-4xl font-black font-japanese text-amber-800">ン</div>
                  <div className="text-xs font-bold text-stone-800 mt-1">n · 揚帆破浪向上</div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    第一點偏平，第二筆從<strong>「左下往右上長挑」</strong>，宛如打勾揚帆向上！
                  </div>
                </div>
              </div>
              <div className="text-xs text-stone-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                💡 <strong>漢堡 Hamburger：</strong> 是「ハ<strong>ン</strong>バーガー」，千萬不可選「ハソ」！<strong>拉麵 Ramen：</strong> 是「ラーメ<strong>ン</strong>」，不是「ラーメソ」！
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGULAR SEION CARDS (五十音圖像卡清單) */}
      {!selectedRow.startsWith('special_') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <span>清音圖像聯想記憶卡片</span>
              <span className="text-xs font-normal text-stone-500">
                (共 {filteredCards.length} 字 · 點擊喇叭隨時聽發音)
              </span>
            </div>
            {onLaunchPracticeQuiz && (
              <button
                onClick={onLaunchPracticeQuiz}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <span>前往五十音測驗驗收</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-400 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3"
              >
                {/* Top Row: Visual Icon, Character & Sound */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shadow-xs">
                      {card.visualEmoji}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        {scriptMode !== 'kata' && (
                          <span className="text-3xl font-black text-stone-900 font-japanese">
                            {card.hiragana}
                          </span>
                        )}
                        {scriptMode !== 'hira' && (
                          <span
                            className={`text-2xl font-bold font-japanese ${
                              scriptMode === 'kata' ? 'text-3xl text-stone-900' : 'text-stone-500'
                            }`}
                          >
                            {card.katakana}
                          </span>
                        )}
                        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md ml-1">
                          {card.romaji}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{card.row}</div>
                    </div>
                  </div>

                  <AudioButton text={card.hiragana} rate={speechRate} size="sm" variant="subtle" />
                </div>

                {/* Middle: Mnemonics Story */}
                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                  {/* Hiragana Mnemonic */}
                  {scriptMode !== 'kata' && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                      <div className="font-bold text-stone-800 flex items-center gap-1">
                        <span className="text-amber-600 font-japanese">【平】{card.hiragana}</span>
                        <span>{card.hiraMnemonicTitle}</span>
                      </div>
                      <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                        {card.hiraMnemonicDesc}
                      </p>
                    </div>
                  )}

                  {/* Katakana Mnemonic */}
                  {scriptMode !== 'hira' && (
                    <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                      <div className="font-bold text-amber-950 flex items-center gap-1">
                        <span className="text-amber-700 font-japanese">【片】{card.katakana}</span>
                        <span>{card.kataMnemonicTitle}</span>
                      </div>
                      <p className="text-stone-600 mt-1 leading-relaxed text-[11px]">
                        {card.kataMnemonicDesc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom: Exam Word Hint */}
                {card.examWordHint && (
                  <div className="pt-2 text-[11px] text-amber-800 font-medium bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/50 flex items-center gap-1">
                    <Lightbulb size={12} className="text-amber-600 shrink-0" />
                    <span>{card.examWordHint}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
