import React from 'react';
import { Clock, Flame, Zap, CheckCircle2, Target } from 'lucide-react';

interface TypingHUDProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  totalDurationSeconds: number;
  targetWpm: number;
  isActive: boolean;
}

export const TypingHUD: React.FC<TypingHUDProps> = ({
  wpm,
  cpm,
  accuracy,
  combo,
  maxCombo,
  timeLeft,
  totalDurationSeconds,
  targetWpm,
  isActive,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((totalDurationSeconds - timeLeft) / totalDurationSeconds) * 100));
  const isTimeRunningLow = timeLeft <= 10 && timeLeft > 0;

  return (
    <div id="typing-hud" className="w-full max-w-4xl mx-auto mb-6">
      {/* Top HUD Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {/* WPM Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              即時字速 (WPM)
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-0.5">
              {wpm}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-500 font-mono block">CPM {cpm}</span>
            {targetWpm > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${wpm >= targetWpm ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                目標 {targetWpm}
              </span>
            )}
          </div>
        </div>

        {/* Accuracy Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              正確率 (Accuracy)
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-0.5">
              {accuracy}%
            </div>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 flex items-center justify-center text-[11px] font-mono text-emerald-400">
            {accuracy >= 95 ? '精' : accuracy >= 85 ? '良' : '準'}
          </div>
        </div>

        {/* Combo Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Flame className={`w-3.5 h-3.5 ${combo > 10 ? 'text-rose-400 animate-pulse' : 'text-orange-400'}`} />
              連擊數 (Combo)
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-orange-400 mt-0.5 flex items-center gap-1.5">
              {combo}
              {combo >= 20 && <span className="text-xs font-sans text-rose-400 animate-bounce">🔥</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">最高連擊</span>
            <span className="text-xs font-mono text-slate-300 font-semibold">{maxCombo}</span>
          </div>
        </div>

        {/* Time Remaining Card */}
        <div className={`bg-slate-900/80 border rounded-xl p-3 shadow-md flex items-center justify-between transition-colors ${isTimeRunningLow ? 'border-rose-500/70 bg-rose-950/20 animate-pulse' : 'border-slate-800'}`}>
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock className={`w-3.5 h-3.5 ${isTimeRunningLow ? 'text-rose-400' : 'text-indigo-400'}`} />
              剩餘時間 (Time)
            </div>
            <div className={`text-2xl sm:text-3xl font-bold font-mono mt-0.5 ${isTimeRunningLow ? 'text-rose-400' : 'text-indigo-400'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">測驗總長</span>
            <span className="text-xs font-mono text-slate-300">
              {formatTime(totalDurationSeconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Linear Progress Bar */}
      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-slate-700/50 relative">
        <div
          className={`h-full transition-all duration-300 ease-linear rounded-full ${
            isTimeRunningLow
              ? 'bg-gradient-to-r from-orange-500 to-rose-500'
              : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
