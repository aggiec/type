import React from 'react';
import {
  PracticeMode,
  WordCategory,
  SoundEffectType,
  PracticeSettings,
} from '../types';
import { WORD_CATEGORIES } from '../data/wordLists';
import { ARTICLES_DATA } from '../data/articles';
import {
  BookOpen,
  SpellCheck,
  FileEdit,
  Volume2,
  VolumeX,
  Keyboard,
  Clock,
  History,
  Settings,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  settings: PracticeSettings;
  onUpdateSettings: (newSettings: Partial<PracticeSettings>) => void;
  onOpenCustomModal: () => void;
  onOpenHistoryModal: () => void;
  isTestActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenCustomModal,
  onOpenHistoryModal,
  isTestActive,
}) => {
  const [showCustomTimeInput, setShowCustomTimeInput] = React.useState(settings.isCustomDuration);
  const [customTimeVal, setCustomTimeVal] = React.useState(settings.durationMinutes.toString());

  const handleCustomTimeSubmit = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0.2 && num <= 60) {
      onUpdateSettings({ durationMinutes: num, isCustomDuration: true });
    }
  };

  return (
    <header className="w-full max-w-5xl mx-auto pt-4 pb-2 px-4 select-none">
      {/* Top Brand Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              英打大師 <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Typing Master</span>
            </h1>
            <p className="text-[11px] text-slate-400">專注提升英文打字速度、正確率與指法直覺</p>
          </div>
        </div>

        {/* Quick Utility Tools */}
        <div className="flex items-center gap-2">
          {/* Sound Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => {
                const sounds: SoundEffectType[] = ['mechanical', 'typewriter', 'soft', 'none'];
                const currentIndex = sounds.indexOf(settings.soundType);
                const nextSound = sounds[(currentIndex + 1) % sounds.length];
                onUpdateSettings({ soundType: nextSound });
              }}
              title={`目前鍵盤音效：${
                settings.soundType === 'mechanical'
                  ? '青軸機械'
                  : settings.soundType === 'typewriter'
                  ? '復古打字機'
                  : settings.soundType === 'soft'
                  ? '柔和氣泡'
                  : '靜音'
              }`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {settings.soundType === 'none' ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              )}
              <span className="hidden sm:inline font-mono">
                {settings.soundType === 'mechanical'
                  ? '機械軸'
                  : settings.soundType === 'typewriter'
                  ? '打字機'
                  : settings.soundType === 'soft'
                  ? '柔和'
                  : '靜音'}
              </span>
            </button>
          </div>

          {/* Virtual Keyboard Toggle */}
          <button
            onClick={() => onUpdateSettings({ showKeyboard: !settings.showKeyboard })}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
              settings.showKeyboard
                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="開啟/關閉虛擬指法鍵盤"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">虛擬鍵盤</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistoryModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs transition-colors"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>歷史成績</span>
          </button>
        </div>
      </div>

      {/* Main Control Strip: Mode Selector & Duration Selector */}
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Mode Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <button
            disabled={isTestActive}
            onClick={() => onUpdateSettings({ mode: 'articles' })}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              settings.mode === 'articles'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            文章練習
          </button>

          <button
            disabled={isTestActive}
            onClick={() => onUpdateSettings({ mode: 'words' })}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              settings.mode === 'words'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SpellCheck className="w-3.5 h-3.5" />
            單字庫練習
          </button>

          <button
            disabled={isTestActive}
            onClick={() => {
              onUpdateSettings({ mode: 'custom' });
              if (!settings.customText) {
                onOpenCustomModal();
              }
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              settings.mode === 'custom'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            自訂內容
          </button>
        </div>

        {/* Right: Duration Selector (自訂分鐘數) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-xs px-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            時間：
          </span>

          {[1, 2, 3, 5].map((mins) => {
            const isSelected = !settings.isCustomDuration && settings.durationMinutes === mins;
            return (
              <button
                key={mins}
                disabled={isTestActive}
                onClick={() => {
                  setShowCustomTimeInput(false);
                  onUpdateSettings({ durationMinutes: mins, isCustomDuration: false });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {mins} 分鐘
              </button>
            );
          })}

          {/* Custom Duration Button & Input */}
          {!showCustomTimeInput ? (
            <button
              disabled={isTestActive}
              onClick={() => {
                setShowCustomTimeInput(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                settings.isCustomDuration
                  ? 'bg-indigo-600 text-white font-mono'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {settings.isCustomDuration ? `${settings.durationMinutes} 分鐘 (自訂)` : '自訂分鐘...'}
            </button>
          ) : (
            <div className="flex items-center gap-1 pl-1">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="30"
                value={customTimeVal}
                onChange={(e) => {
                  setCustomTimeVal(e.target.value);
                  handleCustomTimeSubmit(e.target.value);
                }}
                className="w-14 bg-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:outline-none"
                placeholder="分鐘"
                autoFocus
              />
              <span className="text-[11px] text-slate-400">分</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-selector for Selected Mode */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        {settings.mode === 'words' && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500">詞彙庫：</span>
            {WORD_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                disabled={isTestActive}
                onClick={() => onUpdateSettings({ wordCategory: cat.id })}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  settings.wordCategory === cat.id
                    ? 'bg-indigo-950/80 border border-indigo-500/50 text-indigo-300 font-semibold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={cat.description}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {settings.mode === 'articles' && (
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <span className="text-slate-500">精選文章：</span>
            <select
              disabled={isTestActive}
              value={settings.articleId}
              onChange={(e) => onUpdateSettings({ articleId: e.target.value })}
              className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 text-xs"
            >
              {ARTICLES_DATA.map((art) => (
                <option key={art.id} value={art.id}>
                  [{art.difficulty}] {art.title} ({art.category})
                </option>
              ))}
            </select>
          </div>
        )}

        {settings.mode === 'custom' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-400">
              {settings.customText ? `已載入自訂文字 (${settings.customText.length} 字元)` : '尚未設定自訂文字'}
            </span>
            <button
              onClick={onOpenCustomModal}
              className="text-indigo-400 hover:text-indigo-300 underline font-medium"
            >
              編輯/貼上自訂文章
            </button>
          </div>
        )}

        {/* Font size control */}
        <div className="flex items-center gap-1 ml-auto text-slate-500">
          <span>字體：</span>
          {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => onUpdateSettings({ fontSize: sz })}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                settings.fontSize === sz
                  ? 'bg-slate-800 text-white font-bold'
                  : 'hover:text-slate-300'
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
