import React from 'react';
import { TestResult } from '../types';
import { clearHistory } from '../utils/typingCalculations';
import { X, History, Trash2, Trophy, Target, Zap, Clock } from 'lucide-react';

interface HistoryModalProps {
  history: TestResult[];
  onClear: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  onClear,
  onClose,
}) => {
  const bestWpm = history.length > 0 ? Math.max(...history.map(h => h.netWpm)) : 0;
  const avgAccuracy =
    history.length > 0
      ? Math.round((history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length) * 10) / 10
      : 0;
  const totalSessions = history.length;
  const totalPracticedSeconds = history.reduce((acc, curr) => acc + curr.durationSeconds, 0);

  return (
    <div
      id="history-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">英打練習歷史與統計</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> 最高紀錄
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {bestWpm} <span className="text-xs font-sans text-slate-500">WPM</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> 平均正確率
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {avgAccuracy}%
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-400" /> 測驗次數
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
              {totalSessions} <span className="text-xs font-sans text-slate-500">次</span>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> 累積時長
            </div>
            <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
              {Math.round(totalPracticedSeconds / 60)} <span className="text-xs font-sans text-slate-500">分</span>
            </div>
          </div>
        </div>

        {/* History List Table */}
        <div className="my-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 rounded-xl border border-slate-800 bg-slate-950">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              尚無練習紀錄，開始測驗後將自動記錄！
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="p-2.5">模式 / 標題</th>
                  <th className="p-2.5 text-center">字速 (WPM)</th>
                  <th className="p-2.5 text-center">正確率</th>
                  <th className="p-2.5 text-center">時長</th>
                  <th className="p-2.5 text-right">時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-2.5 font-sans">
                      <span className="font-semibold text-slate-200 block truncate max-w-[160px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">{item.mode}</span>
                    </td>
                    <td className="p-2.5 text-center font-bold text-amber-400">
                      {item.netWpm}
                    </td>
                    <td className="p-2.5 text-center text-emerald-400">
                      {item.accuracy}%
                    </td>
                    <td className="p-2.5 text-center text-slate-400">
                      {Math.round(item.durationSeconds)}s
                    </td>
                    <td className="p-2.5 text-right text-[11px] text-slate-500 font-sans">
                      {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {history.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('確定要清空所有練習紀錄嗎？')) {
                  clearHistory();
                  onClear();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              清空紀錄
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
