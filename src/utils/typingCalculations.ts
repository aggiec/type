import { KeystrokeRecord, WpmDataPoint, TestResult } from '../types';

export function calculateWpm(
  correctChars: number,
  totalChars: number,
  elapsedSeconds: number
): { netWpm: number; grossWpm: number; cpm: number; accuracy: number } {
  if (elapsedSeconds <= 0) {
    return { netWpm: 0, grossWpm: 0, cpm: 0, accuracy: 100 };
  }

  const minutes = elapsedSeconds / 60;
  const grossWpm = Math.round((totalChars / 5) / minutes);
  const netWpm = Math.max(0, Math.round((correctChars / 5) / minutes));
  const cpm = Math.round(correctChars / minutes);
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 1000) / 10 : 100;

  return { netWpm, grossWpm, cpm, accuracy };
}

export function generateWpmTimeline(
  keystrokes: KeystrokeRecord[],
  totalSeconds: number
): WpmDataPoint[] {
  if (totalSeconds <= 0 || keystrokes.length === 0) return [];

  const points: WpmDataPoint[] = [];
  const step = totalSeconds > 120 ? 5 : totalSeconds > 60 ? 2 : 1;

  for (let s = step; s <= totalSeconds; s += step) {
    const timeLimitMs = s * 1000;
    const pastKeystrokes = keystrokes.filter(k => k.timestamp <= timeLimitMs);
    const correctCount = pastKeystrokes.filter(k => k.isCorrect).length;
    const totalCount = pastKeystrokes.length;
    const errorCount = pastKeystrokes.filter(k => !k.isCorrect).length;

    const minutes = s / 60;
    const rawWpm = Math.round((totalCount / 5) / minutes);
    const wpm = Math.max(0, Math.round((correctCount / 5) / minutes));
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 100;

    points.push({
      second: s,
      wpm,
      rawWpm,
      accuracy,
      errors: errorCount,
    });
  }

  return points;
}

export function analyzeProblematicKeys(
  keystrokes: KeystrokeRecord[]
): { char: string; mistakes: number; total: number }[] {
  const map = new Map<string, { mistakes: number; total: number }>();

  keystrokes.forEach(k => {
    const key = k.expectedChar.toLowerCase();
    if (!map.has(key)) {
      map.set(key, { mistakes: 0, total: 0 });
    }
    const stat = map.get(key)!;
    stat.total += 1;
    if (!k.isCorrect) {
      stat.mistakes += 1;
    }
  });

  const result: { char: string; mistakes: number; total: number }[] = [];
  map.forEach((stat, char) => {
    if (stat.mistakes > 0) {
      result.push({ char: char === ' ' ? 'Space' : char, mistakes: stat.mistakes, total: stat.total });
    }
  });

  return result.sort((a, b) => b.mistakes - a.mistakes).slice(0, 6);
}

export function getRankBadge(wpm: number, accuracy: number): {
  rank: 'SSS' | 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  badgeColor: string;
  emoji: string;
  comment: string;
} {
  if (wpm >= 100 && accuracy >= 95) {
    return { rank: 'SSS', title: '神乎其技', badgeColor: 'from-amber-500 to-yellow-300 text-slate-900 border-amber-300', emoji: '👑', comment: '超越極限的極速打字神手！' };
  }
  if (wpm >= 80 && accuracy >= 90) {
    return { rank: 'S', title: '電光石火', badgeColor: 'from-indigo-600 to-violet-500 text-white border-indigo-400', emoji: '⚡', comment: '打字如行雲流水，反應極度敏捷！' };
  }
  if (wpm >= 60 && accuracy >= 85) {
    return { rank: 'A', title: '獵豹奔馳', badgeColor: 'from-emerald-600 to-teal-500 text-white border-emerald-400', emoji: '🐆', comment: '專業打字水準，速度與精準度兼備！' };
  }
  if (wpm >= 40 && accuracy >= 80) {
    return { rank: 'B', title: '敏捷靈巧', badgeColor: 'from-sky-600 to-cyan-500 text-white border-sky-400', emoji: '🦊', comment: '節奏穩定流暢，維持手感將更進一步！' };
  }
  if (wpm >= 25) {
    return { rank: 'C', title: '漸入佳境', badgeColor: 'from-orange-500 to-amber-500 text-white border-orange-400', emoji: '🐇', comment: '基礎穩健，多加練習手指肌肉記憶！' };
  }
  return { rank: 'D', title: '扎實起步', badgeColor: 'from-slate-600 to-slate-700 text-slate-100 border-slate-500', emoji: '🐢', comment: '放慢速度求精準，正確率是速度的基石！' };
}

export function saveResultToHistory(result: TestResult) {
  try {
    const existing = localStorage.getItem('typing_game_history');
    const list: TestResult[] = existing ? JSON.parse(existing) : [];
    list.unshift(result);
    // keep latest 50
    localStorage.setItem('typing_game_history', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save typing history', e);
  }
}

export function getHistory(): TestResult[] {
  try {
    const existing = localStorage.getItem('typing_game_history');
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem('typing_game_history');
}
