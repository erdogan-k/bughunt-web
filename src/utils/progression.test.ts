import { describe, it, expect, beforeEach } from 'vitest';
import { getLevelInfo, XP_PER_LEVEL } from './progression';
import {
  DEFAULT_PROGRESS,
  loadProgress,
  recordChallengeCompletion,
  resetProgress,
  saveProgress,
} from './storage';
import { CHALLENGES } from '../data/challenges';

describe('progression and localStorage persistence', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('calculates level and XP progress accurately', () => {
    const lvl1 = getLevelInfo(0);
    expect(lvl1.level).toBe(1);
    expect(lvl1.currentLevelXp).toBe(0);

    const lvl2 = getLevelInfo(XP_PER_LEVEL + 50);
    expect(lvl2.level).toBe(2);
    expect(lvl2.currentLevelXp).toBe(50);
    expect(lvl2.progressPercent).toBe(20);
  });

  it('persists and loads user progress via localStorage', () => {
    const custom = {
      ...DEFAULT_PROGRESS,
      xp: 300,
      completedChallengeIds: ['challenge-1'],
    };
    saveProgress(custom);

    const loaded = loadProgress();
    expect(loaded.xp).toBe(300);
    expect(loaded.completedChallengeIds).toEqual(['challenge-1']);
  });

  it('awards XP and unlocks first-blood badge only once per challenge', () => {
    const firstChallenge = CHALLENGES[0];
    const outcome1 = recordChallengeCompletion(
      DEFAULT_PROGRESS,
      firstChallenge,
      CHALLENGES,
      firstChallenge.solutionCode
    );

    expect(outcome1.xpEarned).toBe(firstChallenge.xpReward);
    expect(outcome1.alreadyCompleted).toBe(false);
    expect(outcome1.newlyUnlockedBadges).toContain('first-blood');

    // Re-completing same challenge should not award duplicate XP
    const outcome2 = recordChallengeCompletion(
      outcome1.updatedProgress,
      firstChallenge,
      CHALLENGES,
      firstChallenge.solutionCode
    );
    expect(outcome2.xpEarned).toBe(0);
    expect(outcome2.alreadyCompleted).toBe(true);
    expect(outcome2.updatedProgress.xp).toBe(firstChallenge.xpReward);
  });
});
