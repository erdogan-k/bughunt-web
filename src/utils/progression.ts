import type { Badge, Challenge, UserProgress } from '../types/challenge';

export const BADGES: Badge[] = [
  {
    id: 'first-blood',
    title: 'İlk Böcek Avı',
    description: 'İlk hata ayıklama görevini başarıyla tamamladın.',
    icon: 'Bug',
    conditionText: '1 görev tamamla',
  },
  {
    id: 'bug-hunter',
    title: 'Kıdemli Avcı',
    description: 'En az 3 farklı hata ayıklama görevini çözdün.',
    icon: 'ShieldCheck',
    conditionText: '3 görev tamamla',
  },
  {
    id: 'hardcore-debugger',
    title: 'Zorlu Terminatör',
    description: '"Zor" seviyesinde en az bir görevi başarıyla çözdün.',
    icon: 'Zap',
    conditionText: '1 Zor görev tamamla',
  },
  {
    id: 'async-master',
    title: 'Asenkron Ustası',
    description: 'Asenkron & Promise kategorisinden görev tamamladın.',
    icon: 'Cpu',
    conditionText: 'Asenkron & Promise görevi tamamla',
  },
  {
    id: 'halfway-hero',
    title: 'Sistem Analisti',
    description: 'En az 6 görevi başarıyla temizledin.',
    icon: 'Award',
    conditionText: '6 görev tamamla',
  },
  {
    id: 'grandmaster',
    title: 'BugHunt Efsanesi',
    description: 'Sistemdeki tüm hata ayıklama görevlerini tamamladın!',
    icon: 'Trophy',
    conditionText: 'Tüm görevleri tamamla',
  },
];

export interface LevelInfo {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Stajyer Debugger',
  2: 'Junior Bug Avcısı',
  3: 'Kod Dedektifi',
  4: 'Kıdemli Analist',
  5: 'Sistem Mimarı',
  6: 'Kernel Muhafızı',
  7: 'BugHunt Efsanesi',
};

export const XP_PER_LEVEL = 250;

export function getLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp);
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const currentLevelXp = safeXp % XP_PER_LEVEL;
  const nextLevelXp = XP_PER_LEVEL;
  const progressPercent = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100));
  const title = LEVEL_TITLES[level] ?? `Seviye ${level} Başmühendis`;

  return {
    level,
    title,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
  };
}

export function evaluateUnlockedBadges(
  progress: UserProgress,
  challenges: Challenge[]
): string[] {
  const completedSet = new Set(progress.completedChallengeIds);
  const completedChallenges = challenges.filter((c) => completedSet.has(c.id));
  const unlocked = new Set<string>(progress.unlockedBadgeIds);

  if (completedChallenges.length >= 1) {
    unlocked.add('first-blood');
  }
  if (completedChallenges.length >= 3) {
    unlocked.add('bug-hunter');
  }
  if (completedChallenges.some((c) => c.difficulty === 'Zor')) {
    unlocked.add('hardcore-debugger');
  }
  if (completedChallenges.some((c) => c.category === 'Asenkron & Promise')) {
    unlocked.add('async-master');
  }
  if (completedChallenges.length >= 6) {
    unlocked.add('halfway-hero');
  }
  if (challenges.length > 0 && completedChallenges.length === challenges.length) {
    unlocked.add('grandmaster');
  }

  return Array.from(unlocked);
}
