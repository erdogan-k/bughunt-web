import { Terminal, Award, RotateCcw, Shield, ChevronLeft } from 'lucide-react';
import type { UserProgress } from '../types/challenge';
import { BADGES, getLevelInfo } from '../utils/progression';

interface NavbarProps {
  progress: UserProgress;
  totalChallenges: number;
  activeChallengeTitle?: string;
  onNavigateHome: () => void;
  onResetProgress: () => void;
}

export function Navbar({
  progress,
  totalChallenges,
  activeChallengeTitle,
  onNavigateHome,
  onResetProgress,
}: NavbarProps) {
  const levelInfo = getLevelInfo(progress.xp);
  const completedCount = progress.completedChallengeIds.length;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0d1117]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition group-hover:border-emerald-400 group-hover:bg-emerald-500/20">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-tight text-zinc-100 group-hover:text-emerald-400 transition">
                  BugHunt<span className="text-emerald-400">_Web</span>
                </span>
                <span className="hidden rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline-block">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Tarayıcı Tabanlı JS Hata Ayıklama Laboratuvarı
              </p>
            </div>
          </button>

          {activeChallengeTitle && (
            <div className="hidden items-center gap-2 border-l border-zinc-800 pl-3 md:flex">
              <button
                type="button"
                onClick={onNavigateHome}
                className="flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:border-emerald-500/40 hover:text-emerald-300"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Görevler
              </button>
              <span className="text-zinc-600">/</span>
              <span className="max-w-[220px] truncate font-mono text-xs text-emerald-400">
                {activeChallengeTitle}
              </span>
            </div>
          )}
        </div>

        {/* Player Telemetry: Level, XP Bar, Badges, Reset */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Sandbox Indicator */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[11px] font-mono text-zinc-400 lg:flex"
            title="Kodlarınız ana thread dışında izole Web Worker içinde çalıştırılır"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-400" />
            <span>Worker Sandbox</span>
          </div>

          {/* Level & XP Bar */}
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800/90 bg-[#161b22] px-3 py-1.5">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  SVY {levelInfo.level}
                </span>
                <span className="hidden text-xs font-medium text-zinc-300 sm:inline">
                  {levelInfo.title}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-800 sm:w-28">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-zinc-400">
                  {progress.xp} XP
                </span>
              </div>
            </div>
          </div>

          {/* Completed & Badges Pill */}
          <div className="flex items-center gap-2 rounded-lg border border-zinc-800/90 bg-[#161b22] px-3 py-1.5 font-mono text-xs">
            <span className="text-zinc-300" title="Tamamlanan Görevler">
              <strong className="text-emerald-400">{completedCount}</strong>/{totalChallenges} Görev
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1 text-amber-400" title="Kazanılan Rozetler">
              <Award className="h-3.5 w-3.5" />
              {progress.unlockedBadgeIds.length}/{BADGES.length}
            </span>
          </div>

          {/* Reset Progress */}
          <button
            type="button"
            onClick={onResetProgress}
            title="İlerlemeyi Sıfırla"
            className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-[#161b22] p-2 text-xs text-zinc-400 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Sıfırla</span>
          </button>
        </div>
      </div>
    </header>
  );
}
