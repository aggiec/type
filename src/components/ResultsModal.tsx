import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TestResult } from '../types';
import { getRankBadge } from '../utils/typingCalculations';
import {
  Trophy,
  RotateCcw,
  FastForward,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  Keyboard,
  Target,
  Flame,
} from 'lucide-react';

interface ResultsModalProps {
  result: TestResult;
  onRetry: () => void;
  onNext: () => void;
  onPracticeMistakes: (mistakeChars: string[]) => void;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onRetry,
  onNext,
  onPracticeMistakes,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);
  const badge = getRankBadge(result.netWpm, result.accuracy);

  useEffect(() => {
    if (result.netWpm >= 40 || result.accuracy >= 95) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch (e) {
        console.error('Confetti error', e);
      }
    }
  }, [result]);

  const copyResultCard = () => {
    const text = `🏆 英打大師練習成績\n━━━━━━━━━━━━━━━\n⚡ 淨字速 (Net WPM): ${result.netWpm} WPM\n🎯 正確率 (Accuracy): ${result.accuracy}%\n⌨️ 字元速 (CPM): ${result.cpm}\n⏱️ 練習時長: ${Math.round(result.durationSeconds)} 秒\n🔥 最高連擊: ${result.maxCombo}\n🎖️ 評級: ${badge.rank} - ${badge.title} ${badge.emoji}\n━━━━━━━━━━━━━━━`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mistakeChars = result.problematicKeys.map(k => k.char);

  return (
    <div
      id="results-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="results-card"
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Title & Rank */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              {result.mode === 'words' ? '單字練習成果' : result.mode === 'articles' ? '文章練習成果' : '自訂題目成果'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              測驗結果分析
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">{badge.comment}</p>
          </div>

          {/* Rank Badge */}
          <div
            className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-gradient-to-r ${badge.badgeColor} border shadow-lg`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider opacity-90">評級 Rank</div>
              <div className="text-xl font-extrabold">{badge.rank} · {badge.title}</div>
            </div>
          </div>
        </div>

        {/* Main Highlights Grid: WPM & Accuracy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-6">
          {/* Primary Net WPM */}
          <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-4 text-center shadow-inner relative overflow-hidden">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-amber-500/10 rounded-full blur-sm" />
            <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              每分鐘字數 (WPM)
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-amber-400 mt-2">
              {result.netWpm}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              Raw WPM: {result.grossWpm}
            </div>
          </div>

          {/* Primary Accuracy */}
          <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-4 text-center shadow-inner relative overflow-hidden">
            <div className="absolute -right-2 -top-2 w-12 h-12 bg-emerald-500/10 rounded-full blur-sm" />
            <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
              <Target className="w-4 h-4 text-emerald-400" />
              正確率 (Accuracy)
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 mt-2">
              {result.accuracy}%
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {result.correctKeystrokes}/{result.totalKeystrokes} 正確
            </div>
          </div>

          {/* CPM */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-center shadow-inner">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              字元速率 (CPM)
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-indigo-400 mt-2">
              {result.cpm}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Chars / Min</div>
          </div>

          {/* Max Combo & Duration */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 text-center shadow-inner">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-rose-400" />
              最高連擊 (Combo)
            </div>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-rose-400 mt-2">
              {result.maxCombo}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              {Math.round(result.durationSeconds)} 秒測驗
            </div>
          </div>
        </div>

        {/* Speed Timeline Chart */}
        {result.wpmTimeline && result.wpmTimeline.length > 1 && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-semibold flex items-center gap-1 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                測驗速率趨勢 (Speed Timeline)
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> 淨字速 (WPM)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> 總速率 (Raw)
                </span>
              </div>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.wpmTimeline}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis
                    dataKey="second"
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={v => `${v}s`}
                  />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rawWpm"
                    stroke="#6366f1"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorRaw)"
                    name="Raw WPM"
                  />
                  <Area
                    type="monotone"
                    dataKey="wpm"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWpm)"
                    name="Net WPM"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Detailed Breakdown & Problematic Keys */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Keystrokes Breakdown */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              按鍵擊打統計
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> 正確字元數
                </span>
                <span className="font-mono font-bold text-white">{result.correctKeystrokes}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <XCircle className="w-4 h-4" /> 錯誤按鍵數
                </span>
                <span className="font-mono font-bold text-rose-400">{result.incorrectKeystrokes}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 border-t border-slate-700/60 pt-2">
                <span>總按鍵數 (Keystrokes)</span>
                <span className="font-mono text-slate-200">{result.totalKeystrokes}</span>
              </div>
            </div>
          </div>

          {/* Problem Keys Analysis */}
          <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 text-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              需加強鍵位分析 (Weak Keys)
            </h4>
            {result.problematicKeys && result.problematicKeys.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.problematicKeys.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-800/50 text-rose-300 px-2.5 py-1 rounded-lg text-xs font-mono"
                  >
                    <span className="font-bold text-rose-200 bg-rose-900/60 px-1.5 py-0.5 rounded">
                      {item.char}
                    </span>
                    <span>{item.mistakes} 次失誤</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-emerald-400 text-xs flex items-center gap-1.5 py-2">
                <CheckCircle2 className="w-4 h-4" /> 表現完美！無明顯重複失誤鍵位。
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={copyResultCard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? '已複製成績！' : '分享/複製成績'}
            </button>

            {mistakeChars.length > 0 && (
              <button
                onClick={() => onPracticeMistakes(mistakeChars)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-200 text-sm font-medium border border-rose-800/60 transition-colors"
              >
                錯字專項練習
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors border border-slate-700"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              再試一次
            </button>

            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <FastForward className="w-4 h-4" />
              下一篇 / 換題
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
