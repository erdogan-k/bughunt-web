import type { Challenge, UserProgress } from '../types/challenge';
import { evaluateUnlockedBadges } from './progression';

export const STORAGE_KEY = 'bughunt_web_progress_v1';

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  completedChallengeIds: [],
  unlockedBadgeIds: [],
  savedCodeByChallenge: {},
  revealedSolutionIds: [],
};

export function loadProgress(): UserProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    return {
      xp: typeof parsed.xp === 'number' && parsed.xp >= 0 ? parsed.xp : 0,
      completedChallengeIds: Array.isArray(parsed.completedChallengeIds)
        ? parsed.completedChallengeIds
        : [],
      unlockedBadgeIds: Array.isArray(parsed.unlockedBadgeIds) ? parsed.unlockedBadgeIds : [],
      savedCodeByChallenge:
        parsed.savedCodeByChallenge && typeof parsed.savedCodeByChallenge === 'object'
          ? parsed.savedCodeByChallenge
          : {},
      revealedSolutionIds: Array.isArray(parsed.revealedSolutionIds)
        ? parsed.revealedSolutionIds
        : [],
    };
  } catch (_) {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (_) {
    // Ignore quota or private browsing errors
  }
}

export function resetProgress(): UserProgress {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    // Ignore
  }
  return { ...DEFAULT_PROGRESS };
}

export interface CompleteChallengeOutcome {
  updatedProgress: UserProgress;
  xpEarned: number;
  newlyUnlockedBadges: string[];
  alreadyCompleted: boolean;
}

export function recordChallengeCompletion(
  current: UserProgress,
  challenge: Challenge,
  allChallenges: Challenge[],
  userCode: string
): CompleteChallengeOutcome {
  const alreadyCompleted = current.completedChallengeIds.includes(challenge.id);
  const xpEarned = alreadyCompleted ? 0 : challenge.xpReward;

  const nextCompleted = alreadyCompleted
    ? current.completedChallengeIds
    : [...current.completedChallengeIds, challenge.id];

  const draftProgress: UserProgress = {
    ...current,
    xp: current.xp + xpEarned,
    completedChallengeIds: nextCompleted,
    savedCodeByChallenge: {
      ...current.savedCodeByChallenge,
      [challenge.id]: userCode,
    },
  };

  const allUnlocked = evaluateUnlockedBadges(draftProgress, allChallenges);
  const newlyUnlockedBadges = allUnlocked.filter(
    (id) => !current.unlockedBadgeIds.includes(id)
  );

  const updatedProgress: UserProgress = {
    ...draftProgress,
    unlockedBadgeIds: allUnlocked,
  };

  saveProgress(updatedProgress);

  return {
    updatedProgress,
    xpEarned,
    newlyUnlockedBadges,
    alreadyCompleted,
  };
}
