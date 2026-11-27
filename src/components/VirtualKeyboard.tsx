import React from 'react';

interface VirtualKeyboardProps {
  activeKey: string;
  nextKey: string;
  isPressed: boolean;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey,
  nextKey,
  isPressed,
}) => {
  const normalizeKey = (k: string): string => {
    if (!k) return '';
    if (k === ' ') return 'Space';
    return k.toLowerCase();
  };

  const currentNext = normalizeKey(nextKey);
  const currentActive = normalizeKey(activeKey);

  const getKeyWidth = (key: string) => {
    switch (key) {
      case 'Backspace':
      case 'Tab':
        return 'w-16 sm:w-20';
      case 'Caps':
      case 'Enter':
        return 'w-20 sm:w-24';
      case 'Shift':
        return 'w-24 sm:w-28';
      case 'Space':
        return 'w-64 sm:w-80';
      case 'Ctrl':
      case 'Alt':
        return 'w-12 sm:w-16';
      default:
        return 'w-8 sm:w-11';
    }
  };

  const isNext = (key: string) => {
    const norm = normalizeKey(key);
    if (norm === 'space' && currentNext === 'space') return true;
    if (norm === currentNext) return true;
    return false;
  };

  const isActive = (key: string) => {
    const norm = normalizeKey(key);
    if (norm === 'space' && currentActive === 'space') return true;
    if (norm === currentActive) return true;
    return false;
  };

  return (
    <div
      id="virtual-keyboard-container"
      className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl select-none max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2.5 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30"></span>
            下一個按鍵
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-500/30"></span>
            目前輸入
          </span>
        </div>
        <span className="text-slate-500 hidden sm:inline">QWERTY 鍵盤指引 (F/J 基準定位鍵)</span>
      </div>

      <div className="flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center w-full">
            {row.map((key, keyIndex) => {
              const next = isNext(key);
              const active = isActive(key) && isPressed;
              const isHomeRowKey = key === 'f' || key === 'j';

              let keyStyle = 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-750 shadow-sm';
              
              if (active) {
                keyStyle = 'bg-indigo-600 text-white border-indigo-400 scale-95 shadow-indigo-500/40 shadow-md font-bold';
              } else if (next) {
                keyStyle = 'bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400/50 shadow-emerald-500/30 shadow-md animate-pulse font-bold';
              }

              return (
                <div
                  key={`${rowIndex}-${keyIndex}`}
                  id={`key-${key.toLowerCase()}`}
                  className={`relative h-9 sm:h-11 ${getKeyWidth(key)} rounded-lg flex items-center justify-center text-xs sm:text-sm font-mono border transition-all duration-75 uppercase ${keyStyle}`}
                >
                  <span>{key === 'Space' ? 'Space ␣' : key}</span>
                  {isHomeRowKey && (
                    <span className="absolute bottom-1 w-2.5 h-0.5 bg-slate-400 rounded-full opacity-60"></span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
