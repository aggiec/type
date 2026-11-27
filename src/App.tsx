import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  PracticeSettings,
  KeystrokeRecord,
  TestResult,
  WordCategory,
} from './types';
import { getRandomWords, WORD_CATEGORIES } from './data/wordLists';
import { ARTICLES_DATA } from './data/articles';
import { Header } from './components/Header';
import { TypingHUD } from './components/TypingHUD';
import { TypingEngine } from './components/TypingEngine';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultsModal } from './components/ResultsModal';
import { CustomTextModal } from './components/CustomTextModal';
import { HistoryModal } from './components/HistoryModal';
import {
  calculateWpm,
  generateWpmTimeline,
  analyzeProblematicKeys,
  saveResultToHistory,
  getHistory,
} from './utils/typingCalculations';
import { soundManager } from './utils/audio';

export default function App() {
  // Practice Settings
  const [settings, setSettings] = useState<PracticeSettings>(() => {
    return {
      mode: 'articles',
      wordCategory: 'common200',
      articleId: 'ai-revolution',
      customText: '',
      durationMinutes: 1,
      isCustomDuration: false,
      soundType: 'mechanical',
      showKeyboard: true,
      showLiveWpm: true,
      soundVolume: 0.6,
      fontSize: 'base',
      targetWpm: 60,
    };
  });

  // Current Target Text
  const [targetText, setTargetText] = useState<string>('');

  // Test Runtime State
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Live Performance Stats
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveCpm, setLiveCpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [keystrokes, setKeystrokes] = useState<KeystrokeRecord[]>([]);

  // Keyboard visualizer states
  const [activeKey, setActiveKey] = useState<string>('');
  const [nextKey, setNextKey] = useState<string>('');
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false);

  // Modals
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalDurationSeconds = Math.round(settings.durationMinutes * 60);

  // Load history from localStorage
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Generate / Load Text according to current settings
  const generateText = useCallback(() => {
    if (settings.mode === 'words') {
      const wordsCount = Math.max(120, Math.round(settings.durationMinutes * 150));
      const generated = getRandomWords(settings.wordCategory, wordsCount);
      setTargetText(generated);
    } else if (settings.mode === 'articles') {
      const art = ARTICLES_DATA.find(a => a.id === settings.articleId) || ARTICLES_DATA[0];
      setTargetText(art.text);
    } else if (settings.mode === 'custom') {
      if (settings.customText) {
        setTargetText(settings.customText);
      } else {
        setTargetText('Technology empowers humanity to connect, learn, and grow together across borders.');
      }
    }
  }, [settings.mode, settings.wordCategory, settings.articleId, settings.customText, settings.durationMinutes]);

  // Reset practice whenever settings or text changes
  const handleReset = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTestActive(false);
    setIsPaused(false);
    setTimeLeft(totalDurationSeconds);
    setElapsedSeconds(0);
    setLiveWpm(0);
    setLiveCpm(0);
    setLiveAccuracy(100);
    setCombo(0);
    setMaxCombo(0);
    setKeystrokes([]);
    setResult(null);
    generateText();
  }, [totalDurationSeconds, generateText]);

  // Trigger reset on settings duration / mode change
  useEffect(() => {
    handleReset();
  }, [settings.mode, settings.wordCategory, settings.articleId, settings.durationMinutes, settings.customText]);

  // Start Test Timer
  const handleStart = useCallback(() => {
    if (isTestActive) return;
    setIsTestActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setTimeLeft(totalDurationSeconds);

    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, [isTestActive, totalDurationSeconds]);

  // Keystroke Handler
  const handleKeystroke = useCallback((record: KeystrokeRecord, currentCombo: number) => {
    setKeystrokes(prev => {
      const updated = [...prev, record];
      const correctCount = updated.filter(k => k.isCorrect).length;
      const totalCount = updated.length;

      // Update real-time stats
      const currentSeconds = Math.max(1, elapsedSeconds);
      const metrics = calculateWpm(correctCount, totalCount, currentSeconds);
      setLiveWpm(metrics.netWpm);
      setLiveCpm(metrics.cpm);
      setLiveAccuracy(metrics.accuracy);

      return updated;
    });

    setCombo(currentCombo);
    setMaxCombo(prev => Math.max(prev, currentCombo));
  }, [elapsedSeconds]);

  // Finish Test
  const handleFinish = useCallback((finalKeystrokes: KeystrokeRecord[], completedText: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTestActive(false);

    const actualDuration = Math.max(1, totalDurationSeconds - timeLeft);
    const correctCount = finalKeystrokes.filter(k => k.isCorrect).length;
    const incorrectCount = finalKeystrokes.filter(k => !k.isCorrect).length;
    const totalCount = finalKeystrokes.length;

    const metrics = calculateWpm(correctCount, totalCount, actualDuration);
    const timeline = generateWpmTimeline(finalKeystrokes, actualDuration);
    const problemKeys = analyzeProblematicKeys(finalKeystrokes);

    let title = '單字測驗';
    if (settings.mode === 'articles') {
      const art = ARTICLES_DATA.find(a => a.id === settings.articleId);
      title = art ? art.title : '文章練習';
    } else if (settings.mode === 'custom') {
      title = '自訂文章測驗';
    } else {
      const cat = WORD_CATEGORIES.find(c => c.id === settings.wordCategory);
      title = cat ? cat.name : '單字測驗';
    }

    const testResult: TestResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode: settings.mode,
      title,
      durationSeconds: actualDuration,
      netWpm: metrics.netWpm,
      grossWpm: metrics.grossWpm,
      cpm: metrics.cpm,
      accuracy: metrics.accuracy,
      totalKeystrokes: totalCount,
      correctKeystrokes: correctCount,
      incorrectKeystrokes: incorrectCount,
      maxCombo,
      wpmTimeline: timeline,
      problematicKeys: problemKeys,
      completedText,
    };

    setResult(testResult);
    saveResultToHistory(testResult);
    setHistory(getHistory());
    soundManager.playFinishFanfare(settings.soundVolume);
  }, [totalDurationSeconds, timeLeft, maxCombo, settings.mode, settings.articleId, settings.wordCategory, settings.soundVolume]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update specific settings
  const handleUpdateSettings = (newSettings: Partial<PracticeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Next text in category
  const handleNextText = () => {
    setResult(null);
    if (settings.mode === 'articles') {
      const currentIndex = ARTICLES_DATA.findIndex(a => a.id === settings.articleId);
      const nextIndex = (currentIndex + 1) % ARTICLES_DATA.length;
      handleUpdateSettings({ articleId: ARTICLES_DATA[nextIndex].id });
    } else if (settings.mode === 'words') {
      // Re-randomize words
      handleReset();
    } else {
      handleReset();
    }
  };

  // Focus mistyped characters
  const handlePracticeMistakes = (mistakeChars: string[]) => {
    setResult(null);
    const wordsWithMistakes: string[] = [];
    const validMistakes = mistakeChars.filter(c => c.length === 1 && /[a-zA-Z]/.test(c)).map(c => c.toLowerCase());
    
    // Find sample words containing these letters
    const allWords = WORD_CATEGORIES.flatMap(c => c.words);
    validMistakes.forEach(char => {
      const matches = allWords.filter(w => w.toLowerCase().includes(char));
      for (let i = 0; i < 5 && i < matches.length; i++) {
        wordsWithMistakes.push(matches[Math.floor(Math.random() * matches.length)]);
      }
    });

    const practiceText = wordsWithMistakes.length > 5
      ? wordsWithMistakes.slice(0, 40).join(' ')
      : validMistakes.map(c => `${c}${c}${c} ${c}a${c} ${c}e${c} ${c}i${c} ${c}o${c}`).join(' ');

    setTargetText(practiceText);
    setTimeLeft(totalDurationSeconds);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setCombo(0);
    setMaxCombo(0);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Header Bar */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenCustomModal={() => setShowCustomModal(true)}
        onOpenHistoryModal={() => setShowHistoryModal(true)}
        isTestActive={isTestActive}
      />

      {/* Main Practice Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 flex flex-col justify-center">
        {/* Live HUD Bar */}
        <TypingHUD
          wpm={liveWpm}
          cpm={liveCpm}
          accuracy={liveAccuracy}
          combo={combo}
          maxCombo={maxCombo}
          timeLeft={timeLeft}
          totalDurationSeconds={totalDurationSeconds}
          targetWpm={settings.targetWpm}
          isActive={isTestActive}
        />

        {/* Typing Engine */}
        <TypingEngine
          targetText={targetText}
          isActive={isTestActive}
          isPaused={isPaused}
          timeLeft={timeLeft}
          soundType={settings.soundType}
          soundVolume={settings.soundVolume}
          fontSize={settings.fontSize}
          onStart={handleStart}
          onFinish={handleFinish}
          onKeystroke={handleKeystroke}
          onKeyChange={(active, next, pressed) => {
            setActiveKey(active);
            setNextKey(next);
            setIsKeyPressed(pressed);
          }}
          onRestart={handleReset}
        />

        {/* Virtual Keyboard visualizer */}
        {settings.showKeyboard && (
          <div className="mt-6">
            <VirtualKeyboard
              activeKey={activeKey}
              nextKey={nextKey}
              isPressed={isKeyPressed}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto py-3 px-4 text-center text-xs text-slate-600 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <span>英打大師 Typing Master · 支援文章與自訂單字庫練習</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span>提示：打字時可按 <kbd className="px-1 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[10px]">Esc</kbd> 重新測驗</span>
        </div>
      </footer>

      {/* Results Modal */}
      {result && (
        <ResultsModal
          result={result}
          onRetry={handleReset}
          onNext={handleNextText}
          onPracticeMistakes={handlePracticeMistakes}
          onClose={() => setResult(null)}
        />
      )}

      {/* Custom Text Modal */}
      {showCustomModal && (
        <CustomTextModal
          initialText={settings.customText}
          onSave={(text) => {
            handleUpdateSettings({ customText: text, mode: 'custom' });
          }}
          onClose={() => setShowCustomModal(false)}
        />
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <HistoryModal
          history={history}
          onClear={() => setHistory([])}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}
