import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KeystrokeRecord, SoundEffectType } from '../types';
import { soundManager } from '../utils/audio';
import { AlertCircle, MousePointerClick, RotateCcw } from 'lucide-react';

interface TypingEngineProps {
  targetText: string;
  isActive: boolean;
  isPaused: boolean;
  timeLeft: number;
  soundType: SoundEffectType;
  soundVolume: number;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  onStart: () => void;
  onFinish: (keystrokes: KeystrokeRecord[], completedText: string) => void;
  onKeystroke: (record: KeystrokeRecord, currentCombo: number) => void;
  onKeyChange?: (activeKey: string, nextKey: string, isPressed: boolean) => void;
  onRestart: () => void;
}

export const TypingEngine: React.FC<TypingEngineProps> = ({
  targetText,
  isActive,
  isPaused,
  timeLeft,
  soundType,
  soundVolume,
  fontSize,
  onStart,
  onFinish,
  onKeystroke,
  onKeyChange,
  onRestart,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [keystrokes, setKeystrokes] = useState<KeystrokeRecord[]>([]);
  const [combo, setCombo] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>('');
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize or reset when targetText changes
  useEffect(() => {
    setTypedChars([]);
    setKeystrokes([]);
    setCombo(0);
    startTimeRef.current = null;
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, [targetText]);

  // Keep next key updated on virtual keyboard
  const currentIndex = typedChars.length;
  const nextChar = targetText[currentIndex] || '';

  useEffect(() => {
    if (onKeyChange) {
      onKeyChange(activeKey, nextChar, isPressed);
    }
  }, [activeKey, nextChar, isPressed, onKeyChange]);

  // Auto scroll active line into view smoothly
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charElem = activeCharRef.current;
      const container = containerRef.current;
      
      const charTop = charElem.offsetTop;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Keep active element centered in container
      if (charTop < containerScrollTop + 40 || charTop > containerScrollTop + containerHeight - 80) {
        container.scrollTo({
          top: Math.max(0, charTop - containerHeight / 3),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Check if test finishes (either time is 0 or all text completed)
  useEffect(() => {
    if (isActive && (timeLeft <= 0 || (typedChars.length >= targetText.length && targetText.length > 0))) {
      onFinish(keystrokes, typedChars.join(''));
    }
  }, [isActive, timeLeft, typedChars.length, targetText.length, keystrokes, onFinish, typedChars]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPaused) return;

    // Check Caps Lock state
    setCapsLockActive(e.getModifierState && e.getModifierState('CapsLock'));

    // Handle Quick Restart (Tab + Enter or Escape)
    if (e.key === 'Escape') {
      e.preventDefault();
      onRestart();
      return;
    }

    // Ignore non-character keys except Backspace and Space
    if (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock' ||
      e.key === 'Tab' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.key === 'PageUp' ||
      e.key === 'PageDown'
    ) {
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        soundManager.playKeySound(soundType, soundVolume, false);
        setTypedChars(prev => prev.slice(0, prev.length - 1));
      }
      return;
    }

    // Single character input
    if (e.key.length === 1) {
      e.preventDefault();

      // Start timer on first keystroke if not active
      if (!isActive && startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        onStart();
      }

      const inputChar = e.key;
      const charIndex = typedChars.length;
      const expectedChar = targetText[charIndex] || '';

      if (!expectedChar) return; // reached end

      const isCorrect = inputChar === expectedChar;
      const now = startTimeRef.current ? Date.now() - startTimeRef.current : 0;

      const record: KeystrokeRecord = {
        char: inputChar,
        expectedChar,
        isCorrect,
        timestamp: now,
      };

      // Sound & feedback
      if (isCorrect) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        soundManager.playKeySound(soundType, soundVolume, inputChar === ' ');
        if (newCombo % 25 === 0) {
          soundManager.playComboChime(newCombo, soundVolume);
        }
        onKeystroke(record, newCombo);
      } else {
        setCombo(0);
        soundManager.playErrorSound(soundVolume);
        onKeystroke(record, 0);
      }

      // Visual key feedback
      setActiveKey(inputChar);
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 80);

      setTypedChars(prev => [...prev, inputChar]);
      setKeystrokes(prev => [...prev, record]);
    }
  }, [isPaused, isActive, onRestart, typedChars, soundType, soundVolume, targetText, combo, onStart, onKeystroke]);

  // Font size mapping
  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-lg leading-relaxed';
      case 'lg':
        return 'text-2xl leading-loose';
      case 'xl':
        return 'text-3xl leading-loose';
      case 'base':
      default:
        return 'text-xl leading-relaxed';
    }
  };

  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setIsFocused(true);
    }
  };

  return (
    <div
      id="typing-engine-container"
      className="relative w-full max-w-4xl mx-auto"
      onClick={focusInput}
    >
      {/* Hidden input to capture keyboard events seamlessly */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute opacity-0 pointer-events-none -top-40 left-0"
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus
        tabIndex={0}
        aria-label="英打文字輸入區域"
      />

      {/* Unfocused overlay banner */}
      {!isFocused && (
        <div className="absolute inset-0 z-20 bg-slate-950/70 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center cursor-pointer border border-indigo-500/30 transition-opacity">
          <div className="bg-indigo-600/90 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/30 animate-bounce">
            <MousePointerClick className="w-5 h-5" />
            點擊此處繼續打字練習 (Click to focus)
          </div>
        </div>
      )}

      {/* CapsLock Warning */}
      {capsLockActive && (
        <div className="mb-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs flex items-center gap-1.5 w-fit">
          <AlertCircle className="w-4 h-4" />
          <span>大寫鎖定 CapsLock 已開啟，請留意大小寫！</span>
        </div>
      )}

      {/* Typing Text Box */}
      <div
        ref={containerRef}
        className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 min-h-[190px] max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 select-none shadow-inner font-mono tracking-wide ${getFontSizeClasses()}`}
      >
        <div className="flex flex-wrap items-center">
          {targetText.split('').map((char, index) => {
            const isTyped = index < typedChars.length;
            const typedChar = typedChars[index];
            const isCurrent = index === typedChars.length;
            const isCorrect = isTyped && typedChar === char;
            const isIncorrect = isTyped && typedChar !== char;

            let charStyle = 'text-slate-500 transition-colors';
            if (isCorrect) {
              charStyle = 'text-emerald-400 font-medium';
            } else if (isIncorrect) {
              charStyle = 'text-rose-400 bg-rose-950/60 rounded px-0.5 font-bold underline decoration-rose-500';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative inline-block ${charStyle}`}
              >
                {/* Blinking Caret */}
                {isCurrent && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2.5px] bg-amber-400 rounded-full animate-pulse z-10 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                )}
                {/* Render spaces visibly when mistyped or normal space */}
                {char === ' ' ? (
                  isIncorrect ? (
                    <span className="text-rose-400 font-sans">␣</span>
                  ) : (
                    <span>&nbsp;</span>
                  )
                ) : (
                  char
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom status bar hints */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">Backspace</kbd>
            修正字元
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">Esc</kbd>
            快速重新開始
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestart();
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-800/60"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新整理題目
        </button>
      </div>
    </div>
  );
};
