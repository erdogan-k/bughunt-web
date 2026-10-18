import { useState } from 'react';
import { CHALLENGES } from './data/challenges';
import type { Challenge, UserProgress } from './types/challenge';
import {
  loadProgress,
  recordChallengeCompletion,
  resetProgress,
  saveProgress,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChallengeWorkspace } from './components/ChallengeWorkspace';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const activeChallengeIndex = activeChallengeId
    ? CHALLENGES.findIndex((c) => c.id === activeChallengeId)
    : -1;
  const activeChallenge =
    activeChallengeIndex >= 0 ? CHALLENGES[activeChallengeIndex] : null;

  const handleSaveDraftCode = (challengeId: string, code: string) => {
    setProgress((prev) => {
      const next: UserProgress = {
        ...prev,
        savedCodeByChallenge: {
          ...prev.savedCodeByChallenge,
          [challengeId]: code,
        },
      };
      saveProgress(next);
      return next;
    });
  };

  const handleRevealSolution = (challengeId: string) => {
    setProgress((prev) => {
      if (prev.revealedSolutionIds.includes(challengeId)) return prev;
      const next: UserProgress = {
        ...prev,
        revealedSolutionIds: [...prev.revealedSolutionIds, challengeId],
      };
      saveProgress(next);
      return next;
    });
  };

  const handleChallengeSolved = (challenge: Challenge, userCode: string) => {
    const outcome = recordChallengeCompletion(
      progress,
      challenge,
      CHALLENGES,
      userCode
    );
    setProgress(outcome.updatedProgress);
    return {
      xpEarned: outcome.xpEarned,
      newlyUnlockedBadges: outcome.newlyUnlockedBadges,
      alreadyCompleted: outcome.alreadyCompleted,
    };
  };

  const handleConfirmReset = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setShowResetConfirm(false);
    setActiveChallengeId(null);
  };

  const handleNavigateChallenge = (direction: 'prev' | 'next') => {
    if (activeChallengeIndex < 0) return;
    const nextIdx =
      direction === 'prev' ? activeChallengeIndex - 1 : activeChallengeIndex + 1;
    if (nextIdx >= 0 && nextIdx < CHALLENGES.length) {
      setActiveChallengeId(CHALLENGES[nextIdx].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-zinc-100">
      <Navbar
        progress={progress}
        totalChallenges={CHALLENGES.length}
        activeChallengeTitle={activeChallenge?.title}
        onNavigateHome={() => setActiveChallengeId(null)}
        onResetProgress={() => setShowResetConfirm(true)}
      />

      <div className="flex-1">
        {activeChallenge ? (
          <ChallengeWorkspace
            challenge={activeChallenge}
            challengeIndex={activeChallengeIndex}
            totalChallenges={CHALLENGES.length}
            initialCode={
              progress.savedCodeByChallenge[activeChallenge.id] ??
              activeChallenge.buggyCode
            }
            isCompleted={progress.completedChallengeIds.includes(activeChallenge.id)}
            isSolutionRevealed={progress.revealedSolutionIds.includes(
              activeChallenge.id
            )}
            onSaveDraftCode={handleSaveDraftCode}
            onChallengeSolved={handleChallengeSolved}
            onRevealSolution={handleRevealSolution}
            onBackToDashboard={() => setActiveChallengeId(null)}
            onNavigateChallenge={handleNavigateChallenge}
          />
        ) : (
          <Dashboard
            challenges={CHALLENGES}
            progress={progress}
            onSelectChallenge={(id) => setActiveChallengeId(id)}
          />
        )}
      </div>

      {/* Confirmation Modal for Progress Reset */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-[#161b22] p-6 shadow-2xl space-y-4">
            <h3 className="font-mono text-base font-bold text-zinc-100">
              İlerlemeyi Sıfırlamak İstiyor musunuz?
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              Kazandığınız tüm XP puanları, açılan rozetler ve görevlerde yazdığınız
              kod taslakları tarayıcı belleğinden (`localStorage`) silinecek.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-zinc-700 bg-[#0d1117] px-4 py-2 font-mono text-xs text-zinc-300 hover:text-zinc-100"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-lg bg-rose-600 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-rose-500"
              >
                Evet, Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0d1117] py-4 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-zinc-500 sm:flex-row font-mono">
          <span>BugHunt_Web // İstemci Taraflı JavaScript Hata Ayıklama Oyunu</span>
          <span>İlerleme durumu tarayıcınızda (localStorage) güvenle saklanır.</span>
        </div>
      </footer>
    </div>
  );
}
