export type PracticeMode = 'words' | 'articles' | 'custom';

export type WordCategory = 'common200' | 'common1000' | 'tech' | 'business' | 'toefl' | 'irregular_verbs';

export type SoundEffectType = 'mechanical' | 'typewriter' | 'soft' | 'none';

export interface ArticleItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  text: string;
  author?: string;
}

export interface PracticeSettings {
  mode: PracticeMode;
  wordCategory: WordCategory;
  articleId: string;
  customText: string;
  durationMinutes: number; // e.g. 1, 2, 3, 5, or custom decimal
  isCustomDuration: boolean;
  soundType: SoundEffectType;
  showKeyboard: boolean;
  showLiveWpm: boolean;
  soundVolume: number; // 0 to 1
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  targetWpm: number; // Target pace (e.g. 60)
}

export interface KeystrokeRecord {
  char: string;
  expectedChar: string;
  isCorrect: boolean;
  timestamp: number; // ms since start
}

export interface WpmDataPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
}

export interface TestResult {
  id: string;
  date: string;
  mode: PracticeMode;
  title: string;
  durationSeconds: number;
  netWpm: number;
  grossWpm: number;
  cpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  incorrectKeystrokes: number;
  maxCombo: number;
  wpmTimeline: WpmDataPoint[];
  problematicKeys: { char: string; mistakes: number; total: number }[];
  completedText: string;
}
