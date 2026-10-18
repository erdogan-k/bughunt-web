import { useMemo, useState } from 'react';
import {
  Award,
  Bug,
  CheckCircle2,
  Code2,
  Cpu,
  Filter,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import type { Category, Challenge, Difficulty, UserProgress } from '../types/challenge';
import { BADGES, getLevelInfo } from '../utils/progression';

interface DashboardProps {
  challenges: Challenge[];
  progress: UserProgress;
  onSelectChallenge: (challengeId: string) => void;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  Kolay: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  Orta: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  Zor: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
};

function renderBadgeIcon(iconName: string, unlocked: boolean) {
  const cls = `h-5 w-5 ${unlocked ? 'text-emerald-400' : 'text-zinc-600'}`;
  switch (iconName) {
    case 'Bug':
      return <Bug className={cls} />;
    case 'ShieldCheck':
      return <ShieldCheck className={cls} />;
    case 'Zap':
      return <Zap className={cls} />;
    case 'Cpu':
      return <Cpu className={cls} />;
    case 'Award':
      return <Award className={cls} />;
    case 'Trophy':
    default:
      return <Trophy className={cls} />;
  }
}

export function Dashboard({ challenges, progress, onSelectChallenge }: DashboardProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Tümü'>('Tümü');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Tümü'>('Tümü');
  const [statusFilter, setStatusFilter] = useState<'Tümü' | 'Bekleyen' | 'Tamamlanan'>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const levelInfo = getLevelInfo(progress.xp);
  const completedSet = useMemo(
    () => new Set(progress.completedChallengeIds),
    [progress.completedChallengeIds]
  );

  const categories = useMemo(() => {
    const unique = Array.from(new Set(challenges.map((c) => c.category)));
    return unique;
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      if (selectedDifficulty !== 'Tümü' && challenge.difficulty !== selectedDifficulty) {
        return false;
      }
      if (selectedCategory !== 'Tümü' && challenge.category !== selectedCategory) {
        return false;
      }
      const isDone = completedSet.has(challenge.id);
      if (statusFilter === 'Tamamlanan' && !isDone) return false;
      if (statusFilter === 'Bekleyen' && isDone) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = challenge.title.toLowerCase().includes(q);
        const matchesDesc = challenge.shortDescription.toLowerCase().includes(q);
        const matchesCategory = challenge.category.toLowerCase().includes(q);
        const matchesFn = challenge.functionName.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesCategory || matchesFn;
      }
      return true;
    });
  }, [challenges, selectedDifficulty, selectedCategory, statusFilter, searchQuery, completedSet]);

  const totalPossibleXp = useMemo(
    () => challenges.reduce((acc, item) => acc + item.xpReward, 0),
    [challenges]
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8 space-y-8">
      {/* Terminal Hero & Player Stats */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#161b22] via-[#12171e] to-[#0d1117] p-6 shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left: Terminal Welcome & Level Progress */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>TERMINAL DURUMU: ÇEVRİMİÇİ // İZOLE WORKER SANDBOX</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
              JavaScript Hatalarını Avla,{' '}
              <span className="text-emerald-400 font-mono">Sistemi Kurtar.</span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
              Kurulum gerektirmeyen tarayıcı içi hata ayıklama laboratuvarı. Her görevdeki bozuk
              JavaScript fonksiyonunu analiz et, editörde düzelt, birim testlerini çalıştır ve XP
              ile rozetleri topla.
            </p>

            {/* Level Progress Card */}
            <div className="rounded-xl border border-zinc-800/90 bg-[#0d1117]/90 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300">
                    SEVİYE {levelInfo.level}
                  </span>
                  <span className="font-mono text-sm font-semibold text-zinc-200">
                    {levelInfo.title}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-400">
                  Sonraki seviye için:{' '}
                  <strong className="text-emerald-400">
                    {levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP
                  </strong>
                </span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300 transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Telemetry Metrics */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-800/80 bg-[#0d1117]/80 p-4">
              <div className="font-mono text-xs uppercase text-zinc-400">Toplam XP</div>
              <div className="mt-1 font-mono text-2xl font-bold text-emerald-400">
                {progress.xp}
                <span className="text-xs font-normal text-zinc-500"> / {totalPossibleXp}</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">Kazanılan deneyim puanı</div>
            </div>

            <div className="rounded-xl border border-zinc-800/80 bg-[#0d1117]/80 p-4">
              <div className="font-mono text-xs uppercase text-zinc-400">Çözülen Görev</div>
              <div className="mt-1 font-mono text-2xl font-bold text-zinc-100">
                {completedSet.size}
                <span className="text-xs font-normal text-zinc-500"> / {challenges.length}</span>
              </div>
              <div className="mt-1 text-[11px] text-zinc-500">
                %{challenges.length ? Math.round((completedSet.size / challenges.length) * 100) : 0}{' '}
                tamamlandı
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 lg:col-span-2 rounded-xl border border-zinc-800/80 bg-[#0d1117]/80 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-zinc-400">Rozet Koleksiyonu</span>
                <span className="font-mono text-xs text-amber-400">
                  {progress.unlockedBadgeIds.length} / {BADGES.length} Açıldı
                </span>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {BADGES.map((badge) => {
                  const unlocked = progress.unlockedBadgeIds.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      title={`${badge.title}: ${badge.description} (${badge.conditionText})`}
                      className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 transition ${
                        unlocked
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-zinc-100 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                          : 'border-zinc-800/70 bg-zinc-900/40 text-zinc-500 opacity-60'
                      }`}
                    >
                      {renderBadgeIcon(badge.icon, unlocked)}
                      <div className="min-w-0">
                        <div className="truncate font-mono text-[11px] font-semibold">
                          {badge.title}
                        </div>
                        <div className="truncate text-[10px] text-zinc-400">
                          {badge.conditionText}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="rounded-xl border border-zinc-800 bg-[#161b22] p-4 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Görev adı, fonksiyon veya konu ara..."
              aria-label="Görev ara"
              className="w-full rounded-lg border border-zinc-800 bg-[#0d1117] py-2 pr-4 pl-9 text-sm text-zinc-200 placeholder-zinc-500 focus:border-emerald-500/60 focus:outline-none"
            />
          </div>

          {/* Difficulty Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 flex items-center gap-1 font-mono text-xs text-zinc-400">
              <Filter className="h-3.5 w-3.5 text-emerald-400" />
              Zorluk:
            </span>
            {(['Tümü', 'Kolay', 'Orta', 'Zor'] as const).map((diff) => {
              const active = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition ${
                    active
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-zinc-800 bg-[#0d1117] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(['Tümü', 'Bekleyen', 'Tamamlanan'] as const).map((st) => {
              const active = statusFilter === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-xs transition ${
                    active
                      ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                      : 'border-zinc-800 bg-[#0d1117] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800/80 pt-3">
          <span className="font-mono text-xs text-zinc-400">Konu:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory('Tümü')}
            className={`rounded-md border px-2.5 py-1 font-mono text-xs transition ${
              selectedCategory === 'Tümü'
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : 'border-zinc-800 bg-[#0d1117] text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tüm Konular ({challenges.length})
          </button>
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            const count = challenges.filter((c) => c.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-md border px-2.5 py-1 font-mono text-xs transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-zinc-800 bg-[#0d1117] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Hata Ayıklama Görevleri ({filteredChallenges.length})
          </h2>
          {(selectedDifficulty !== 'Tümü' ||
            selectedCategory !== 'Tümü' ||
            statusFilter !== 'Tümü' ||
            searchQuery.trim() !== '') && (
            <button
              type="button"
              onClick={() => {
                setSelectedDifficulty('Tümü');
                setSelectedCategory('Tümü');
                setStatusFilter('Tümü');
                setSearchQuery('');
              }}
              className="font-mono text-xs text-emerald-400 hover:underline"
            >
              Filtreleri Temizle
            </button>
          )}
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-[#161b22] p-10 text-center">
            <Bug className="mx-auto h-10 w-10 text-zinc-600" />
            <p className="mt-3 font-mono text-sm text-zinc-300">
              Seçilen filtrelere uygun görev bulunamadı.
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Farklı bir zorluk derecesi veya konu seçmeyi deneyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => {
              const indexNumber = challenges.findIndex((c) => c.id === challenge.id) + 1;
              const isCompleted = completedSet.has(challenge.id);

              return (
                <article
                  key={challenge.id}
                  className={`group flex flex-col justify-between rounded-xl border p-5 transition duration-200 ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-[#161b22]/90 hover:border-emerald-400'
                      : 'border-zinc-800 bg-[#161b22] hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.08)]'
                  }`}
                >
                  <div>
                    {/* Top Metadata Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-500">
                          #{String(indexNumber).padStart(2, '0')}
                        </span>
                        <span
                          className={`rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${DIFFICULTY_STYLES[challenge.difficulty]}`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-zinc-800 bg-[#0d1117] px-2 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                          +{challenge.xpReward} XP
                        </span>
                        {isCompleted && (
                          <span
                            className="flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-300"
                            title="Bu görevi başarıyla çözdünüz"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Çözüldü
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h3 className="mt-3 text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition">
                      {challenge.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                      {challenge.shortDescription}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                        {challenge.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
                        <Code2 className="h-3.5 w-3.5 text-emerald-400" />
                        {challenge.functionName}()
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectChallenge(challenge.id)}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs font-semibold transition ${
                        isCompleted
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          : 'border-emerald-500 bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                      }`}
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isCompleted ? 'Görevi Tekrar İncele' : 'Hata Ayıklamaya Başla'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
