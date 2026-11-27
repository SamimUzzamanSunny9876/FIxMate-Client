import React from "react";
import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading FixMate"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950"
    >
      {/* Animated Ambient Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-28 right-0 h-[440px] w-[440px] animate-pulse rounded-full bg-gradient-to-br from-indigo-200/45 via-sky-200/40 to-emerald-100/35 blur-3xl [animation-duration:6s] dark:from-indigo-600/20 dark:via-sky-600/15 dark:to-emerald-500/10" />
        <div className="absolute -bottom-32 -left-24 h-[420px] w-[420px] animate-pulse rounded-full bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-sky-100/35 blur-3xl [animation-duration:8s] dark:from-violet-600/20 dark:via-indigo-600/15 dark:to-sky-600/10" />
      </div>

      {/* Glassmorphic Loader Card */}
      <div className="w-full max-w-sm animate-in duration-500 fade-in zoom-in-95">
        <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/85 px-8 py-10 text-center shadow-[0_20px_50px_-15px_rgba(79,70,229,0.14)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]">
          {/* Animated Top Shimmer Bar */}
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500" />
          </div>

          {/* Pulsing Ring + Brand Icon */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <span className="absolute inset-0 animate-ping rounded-3xl bg-indigo-400/20 [animation-duration:2.4s] dark:bg-indigo-500/20" />
            <span className="absolute -inset-2 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-violet-500/60 [animation-duration:1.4s] dark:border-t-indigo-400 dark:border-r-violet-400/60" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              <Wrench className="h-7 w-7 animate-pulse stroke-[2.25]" />
            </div>
          </div>

          {/* Brand & Loading Copy */}
          <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-indigo-200 dark:to-white">
            FixMate
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Preparing your workspace...
          </p>

          {/* Staggered Bouncing Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s] dark:bg-indigo-400" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-600 [animation-delay:-0.15s] dark:bg-violet-400" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 dark:bg-emerald-400" />
          </div>

          <span className="sr-only">Loading content, please wait.</span>
        </div>
      </div>
    </main>
  );
}