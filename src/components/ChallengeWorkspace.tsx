import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Eye,
  Lightbulb,
  Play,
  RotateCcw,
  ShieldAlert,
  Terminal,
  XCircle,
} from 'lucide-react';
import type { Challenge, Difficulty, ExecutionResult } from '../types/challenge';
import { BADGES } from '../utils/progression';
import { runCodeInSandbox } from '../utils/sandboxRunner';
import { CodeEditor } from './CodeEditor';

interface ChallengeWorkspaceProps {
  challenge: Challenge;
  challengeIndex: number;
  totalChallenges: number;
  initialCode: string;
  isCompleted: boolean;
  isSolutionRevealed: boolean;
  onSaveDraftCode: (challengeId: string, code: string) => void;
  onChallengeSolved: (
    challenge: Challenge,
    code: string
  ) => { xpEarned: number; newlyUnlockedBadges: string[]; alreadyCompleted: boolean };
  onRevealSolution: (challengeId: string) => void;
  onBackToDashboard: () => void;
  onNavigateChallenge: (direction: 'prev' | 'next') => void;
}

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  Kolay: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  Orta: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Zor: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
};

export function ChallengeWorkspace({
  challenge,
  challengeIndex,
  totalChallenges,
  initialCode,
  isCompleted,
  isSolutionRevealed,
  onSaveDraftCode,
  onChallengeSolved,
  onRevealSolution,
  onBackToDashboard,
  onNavigateChallenge,
}: ChallengeWorkspaceProps) {
  const [code, setCode] = useState(initialCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(isSolutionRevealed);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [rewardBanner, setRewardBanner] = useState<{
    xpEarned: number;
    newlyUnlockedBadges: string[];
    alreadyCompleted: boolean;
  } | null>(null);

  // Reset local workspace state when switching to a different challenge
  useEffect(() => {
    setCode(initialCode);
    setShowHint(false);
    setShowSolution(isSolutionRevealed);
    setExecutionResult(null);
    setRewardBanner(null);
  }, [challenge.id, initialCode, isSolutionRevealed]);

  const handleCodeChange = (nextCode: string) => {
    setCode(nextCode);
    onSaveDraftCode(challenge.id, nextCode);
  };

  const handleResetToBuggy = () => {
    setCode(challenge.buggyCode);
    onSaveDraftCode(challenge.id, challenge.buggyCode);
    setExecutionResult(null);
  };

  const handleRevealSolutionClick = () => {
    setShowSolution(true);
    onRevealSolution(challenge.id);
  };

  const handleApplySolutionToEditor = () => {
    setCode(challenge.solutionCode);
    onSaveDraftCode(challenge.id, challenge.solutionCode);
  };

  const handleRunTests = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setRewardBanner(null);

    try {
      const result = await runCodeInSandbox(
        code,
        challenge.functionName,
        challenge.testCases
      );
      setExecutionResult(result);

      if (result.allPassed) {
        const reward = onChallengeSolved(challenge, code);
        setRewardBanner(reward);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const shouldShowExplanation =
    showSolution || isCompleted || Boolean(executionResult?.allPassed);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      {/* Top Navigation & Mission Header */}
      <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-[#161b22] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-700/80 bg-[#0d1117] px-2.5 py-1 font-mono text-xs text-zinc-300 transition hover:border-emerald-500/50 hover:text-emerald-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Görev Listesi
            </button>

            <span className="font-mono text-xs text-zinc-500">
              Görev #{String(challengeIndex + 1).padStart(2, '0')} /{' '}
              {String(totalChallenges).padStart(2, '0')}
            </span>

            <span
              className={`rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${DIFFICULTY_BADGE[challenge.difficulty]}`}
            >
              {challenge.difficulty}
            </span>

            <span className="rounded-md border border-zinc-800 bg-[#0d1117] px-2 py-0.5 font-mono text-xs text-zinc-300">
              {challenge.category}
            </span>

            <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
              +{challenge.xpReward} XP
            </span>

            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Tamamlandı
              </span>
            )}
          </div>

          <h1 className="pt-1 text-xl font-bold text-zinc-100 sm:text-2xl">
            {challenge.title}
          </h1>
        </div>

        {/* Prev / Next Challenge Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            disabled={challengeIndex <= 0}
            onClick={() => onNavigateChallenge('prev')}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </button>
          <button
            type="button"
            disabled={challengeIndex >= totalChallenges - 1}
            onClick={() => onNavigateChallenge('next')}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-700 disabled:opacity-40 disabled:pointer-events-none"
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Problem Brief, Expected Behavior, Hint & Solution Controls */}
      <section className="rounded-xl border border-zinc-800 bg-[#161b22] p-5 space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-2">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              // Hata Raporu & Görev Açıklaması
            </h2>
            <p className="text-sm leading-relaxed text-zinc-200">
              {challenge.problemDescription}
            </p>
          </div>

          <div className="lg:col-span-5 rounded-lg border border-zinc-800/90 bg-[#0d1117] p-3.5 space-y-1.5">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-teal-400">
              // Beklenen Davranış
            </div>
            <p className="text-xs leading-relaxed text-zinc-300">
              {challenge.expectedBehavior}
            </p>
          </div>
        </div>

        {/* Action Bar for Hint & Solution */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/80 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
            >
              <Lightbulb className="h-3.5 w-3.5" />
              {showHint ? 'İpucunu Gizle' : 'İpucu Göster'}
            </button>

            <button
              type="button"
              onClick={handleRevealSolutionClick}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-[#0d1117] px-3 py-1.5 font-mono text-xs font-medium text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
            >
              <Eye className="h-3.5 w-3.5" />
              Çözümü ve Öğretici Açıklamayı Göster
            </button>
          </div>

          <span className="font-mono text-[11px] text-zinc-500">
            Kısayol: Editörde <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-zinc-300">Ctrl + Enter</kbd> ile testleri çalıştırın
          </span>
        </div>

        {/* Hint Callout */}
        {showHint && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <strong className="font-mono uppercase">İpucu: </strong>
              <span>{challenge.hint}</span>
            </div>
          </div>
        )}

        {/* Revealed Solution & Educational Explanation */}
        {shouldShowExplanation && (
          <div className="rounded-xl border border-emerald-500/40 bg-[#0d1117] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <BookOpen className="h-4 w-4" />
                <span>Öğretici Açıklama & Kök Neden Analizi</span>
              </div>

              {showSolution && (
                <button
                  type="button"
                  onClick={handleApplySolutionToEditor}
                  className="rounded-md border border-emerald-500/50 bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
                >
                  Çözüm Kodunu Editöre Yükle
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
              {challenge.explanation}
            </p>

            {showSolution && (
              <div className="space-y-1.5 pt-1">
                <div className="font-mono text-[11px] text-zinc-400">
                  // Referans Çözüm Kodu:
                </div>
                <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-[#161b22] p-3 font-mono text-xs text-emerald-300">
                  <code>{challenge.solutionCode}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Reward / Completion Celebration Banner */}
      {rewardBanner && (
        <section className="rounded-xl border border-emerald-500 bg-emerald-500/15 p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-mono text-sm font-bold text-emerald-300">
                  TEBRİKLER! TÜM TESTLER BAŞARIYLA GEÇTİ!
                </h3>
                <p className="mt-0.5 text-xs text-zinc-200">
                  {rewardBanner.alreadyCompleted
                    ? 'Bu görevi daha önce tamamlamıştınız. Çözümünüz tekrar doğrulandı!'
                    : `Harika iş çıkardın! +${rewardBanner.xpEarned} XP hesabına eklendi ve ilerlemen kaydedildi.`}
                </p>

                {rewardBanner.newlyUnlockedBadges.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-amber-300 flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      Yeni Rozet Kazanıldı:
                    </span>
                    {rewardBanner.newlyUnlockedBadges.map((badgeId) => {
                      const badge = BADGES.find((b) => b.id === badgeId);
                      if (!badge) return null;
                      return (
                        <span
                          key={badge.id}
                          className="rounded-md border border-amber-400/50 bg-amber-500/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-200"
                        >
                          {badge.title}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {challengeIndex < totalChallenges - 1 && (
              <button
                type="button"
                onClick={() => onNavigateChallenge('next')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 font-mono text-xs font-bold text-zinc-950 transition hover:bg-emerald-400"
              >
                Sonraki Göreve Geç
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </section>
      )}

      {/* Main Split Workspace: Left = Code Editor, Right = Test Runner & Output */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Editor Panel */}
        <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#161b22]">
          {/* Editor Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-[#0d1117] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 font-mono text-xs font-semibold text-zinc-200">
                {challenge.slug}.js
              </span>
              <span className="hidden rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-emerald-400 sm:inline-flex items-center gap-1">
                <Code2 className="h-3 w-3" />
                {challenge.functionName}()
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToBuggy}
                className="inline-flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#161b22] px-2.5 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
                title="Kodu başlangıçtaki hatalı haline döndür"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Sıfırla
              </button>

              <button
                type="button"
                disabled={isRunning}
                onClick={handleRunTests}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 font-mono text-xs font-bold text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {isRunning ? 'Çalıştırılıyor...' : 'Testleri Çalıştır'}
              </button>
            </div>
          </div>

          {/* Code Editor Surface */}
          <div className="flex-1">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              onRunShortcut={handleRunTests}
            />
          </div>
        </div>

        {/* Right Column: Test Suite & Console Results */}
        <div className="lg:col-span-5 flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#161b22]">
          <div>
            {/* Test Panel Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0d1117] px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Test Sonuçları ({challenge.testCases.length} Senaryo)
                </span>
              </div>

              {executionResult && (
                <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-emerald-400" />
                  {executionResult.totalDurationMs}ms
                </span>
              )}
            </div>

            <div className="p-4 space-y-4 max-h-[440px] overflow-y-auto">
              {/* If tests haven't been run yet, show test cases preview */}
              {!executionResult && !isRunning && (
                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-800/80 bg-[#0d1117] p-3 text-xs text-zinc-400">
                    Kodunuzdaki hatayı düzelttikten sonra{' '}
                    <strong className="text-emerald-400">Testleri Çalıştır</strong> butonuna
                    basarak aşağıdaki doğrulama senaryolarını test edin.
                  </div>

                  {challenge.testCases.map((tc, idx) => (
                    <div
                      key={tc.id}
                      className="rounded-lg border border-zinc-800 bg-[#0d1117]/70 p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-zinc-300">
                          Test #{idx + 1}: {tc.description}
                        </span>
                        <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                          BEKLİYOR
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-zinc-400">
                        <span className="text-zinc-500">Girdi:</span>{' '}
                        {tc.input.map((i) => JSON.stringify(i)).join(', ')}
                      </div>
                      <div className="font-mono text-[11px] text-emerald-400/90">
                        <span className="text-zinc-500">Beklenen:</span>{' '}
                        {JSON.stringify(tc.expected)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Running indicator */}
              {isRunning && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  <p className="mt-3 font-mono text-xs text-emerald-400">
                    İzole Web Worker içinde testler yürütülüyor...
                  </p>
                </div>
              )}

              {/* Execution Results */}
              {executionResult && !isRunning && (
                <div className="space-y-3">
                  {/* Overall Summary Banner */}
                  <div
                    className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 font-mono text-xs font-semibold ${
                      executionResult.allPassed
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {executionResult.allPassed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      <span>
                        {executionResult.allPassed
                          ? 'TÜM TESTLER BAŞARILI'
                          : 'BAZI TESTLER BAŞARISIZ OLDU'}
                      </span>
                    </div>
                    <span>
                      {executionResult.results.filter((r) => r.passed).length} /{' '}
                      {challenge.testCases.length} Geçti
                    </span>
                  </div>

                  {/* Runtime / Syntax / Timeout Error Box */}
                  {executionResult.runtimeError && (
                    <div className="rounded-lg border border-rose-500/50 bg-rose-950/30 p-3 text-xs text-rose-200 space-y-1">
                      <div className="flex items-center gap-1.5 font-mono font-bold text-rose-400">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>
                          {executionResult.timedOut
                            ? 'ZAMAN AŞIMI KORUMASI DEVREYE GİRDİ'
                            : 'ÇALIŞMA ZAMANI / SÖZDİZİMİ HATASI'}
                        </span>
                      </div>
                      <pre className="whitespace-pre-wrap font-mono text-[11px] text-rose-200">
                        {executionResult.runtimeError}
                      </pre>
                    </div>
                  )}

                  {/* Per-TestCase Cards */}
                  {executionResult.results.map((res, idx) => (
                    <div
                      key={res.testCaseId}
                      className={`rounded-lg border p-3 space-y-1.5 ${
                        res.passed
                          ? 'border-emerald-500/30 bg-[#0d1117]'
                          : 'border-rose-500/40 bg-[#0d1117]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-200">
                          #{idx + 1} {res.description}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                            res.passed
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {res.passed ? 'GEÇTİ' : 'KALDI'}
                        </span>
                      </div>

                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="text-zinc-400">
                          <span className="text-zinc-500">Girdi: </span>
                          {res.inputFormatted}
                        </div>
                        <div className="text-emerald-400">
                          <span className="text-zinc-500">Beklenen: </span>
                          {res.expectedFormatted}
                        </div>
                        <div className={res.passed ? 'text-emerald-300' : 'text-rose-400'}>
                          <span className="text-zinc-500">Üretilen: </span>
                          {res.actualFormatted}
                        </div>
                        {res.error && (
                          <div className="rounded bg-rose-950/40 px-2 py-1 text-rose-300">
                            Hata: {res.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Console Output Section */}
                  {executionResult.logs.length > 0 && (
                    <div className="rounded-lg border border-zinc-800 bg-[#0d1117] p-3 space-y-1.5">
                      <div className="font-mono text-[11px] font-semibold uppercase text-zinc-400">
                        // Konsol Çıktısı (console.log)
                      </div>
                      <pre className="max-h-32 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-amber-300">
                        {executionResult.logs.join('\n')}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Security Notice Footer */}
          <div className="border-t border-zinc-800 bg-[#0d1117]/90 px-4 py-2.5 flex items-center gap-2 text-[11px] text-zinc-500">
            <ShieldAlert className="h-4 w-4 shrink-0 text-emerald-500/80" />
            <span>
              Kodlar sunucuya gönderilmez; tarayıcıda 2sn zaman aşımlı ve kısıtlı{' '}
              <strong className="text-zinc-400">Web Worker</strong> içinde çalıştırılır.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
