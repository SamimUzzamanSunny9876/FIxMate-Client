"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wrench,
  Home,
  Search,
  ArrowLeft,
  Compass,
  Sparkles,
  HelpCircle,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-14 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
      {/* Subtle Architectural Grid Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_65%_65%_at_50%_50%,#000_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"
      />

      {/* Animated Ambient Gradient Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 right-1/4 h-[420px] w-[420px] animate-pulse rounded-full bg-gradient-to-br from-indigo-300/40 via-sky-200/35 to-emerald-200/30 blur-3xl [animation-duration:7s] dark:from-indigo-600/20 dark:via-sky-600/15 dark:to-emerald-500/10" />
        <div className="absolute -bottom-28 left-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-tr from-violet-300/35 via-indigo-200/30 to-rose-200/25 blur-3xl [animation-duration:9s] dark:from-violet-600/20 dark:via-indigo-600/15 dark:to-rose-600/10" />
      </div>

      <div className="relative w-full max-w-xl animate-in space-y-6 duration-700 fade-in slide-in-from-bottom-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-6 group-hover:shadow-indigo-500/40">
              <Wrench className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              FixMate
            </span>
          </Link>
        </div>

        {/* Gradient Glow Wrapper */}
        <div className="group/card relative rounded-[2rem] bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-emerald-500/20 p-[1.5px] shadow-[0_24px_64px_-16px_rgba(79,70,229,0.16)] transition-all duration-500 hover:shadow-[0_28px_72px_-16px_rgba(79,70,229,0.24)] dark:from-indigo-500/30 dark:via-violet-500/15 dark:to-emerald-500/25 dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65)]">
          {/* Floating Decorative Chips (Desktop) */}
          <div className="pointer-events-none absolute -top-3.5 -left-4 z-10 hidden animate-[bounce_5.5s_ease-in-out_infinite] items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-md backdrop-blur-md sm:flex dark:border-slate-700/80 dark:bg-slate-900/95 dark:text-slate-200">
            <Radio className="h-3.5 w-3.5 animate-pulse text-rose-500" />
            <span>Route Offline</span>
          </div>

          <div className="pointer-events-none absolute -right-4 -bottom-3.5 z-10 hidden animate-[bounce_6.5s_ease-in-out_infinite] items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-semibold text-indigo-700 shadow-md backdrop-blur-md sm:flex dark:border-slate-700/80 dark:bg-slate-900/95 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            <span>FixMate Navigation</span>
          </div>

          {/* Main Glassmorphic Card */}
          <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-white/90 px-6 py-10 text-center backdrop-blur-xl sm:px-10 sm:py-12 dark:bg-slate-900/90">
            {/* Animated Icon + Orbit Ring */}
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20 [animation-duration:3s] dark:bg-indigo-500/15" />
              <span className="absolute inset-1 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-indigo-300/80 dark:border-indigo-700/70" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-indigo-600 shadow-lg shadow-indigo-500/15 transition-transform duration-300 group-hover/card:scale-105 dark:border-indigo-800/70 dark:from-indigo-950/90 dark:via-slate-900 dark:to-violet-950/80 dark:text-indigo-400">
                <Compass className="h-8 w-8 animate-[spin_16s_linear_infinite] stroke-[1.8]" />
              </div>
            </div>

            {/* Status Pill */}
            <div className="animate-in duration-500 delay-100 fade-in slide-in-from-bottom-2 fill-mode-both">
              <Badge
                variant="outline"
                className="rounded-full border-indigo-200/80 bg-indigo-50/90 px-3.5 py-1 text-[11px] font-bold tracking-wider text-indigo-700 uppercase dark:border-indigo-800/70 dark:bg-indigo-950/70 dark:text-indigo-300"
              >
                Error 404 • Page Not Found
              </Badge>
            </div>

            {/* Big Display 404 */}
            <p className="mt-3 animate-in bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-7xl font-black tracking-tighter text-transparent duration-700 delay-150 fade-in zoom-in-95 fill-mode-both sm:text-8xl dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400">
              404
            </p>

            {/* Headline */}
            <h1 className="mt-2 animate-in text-2xl font-extrabold tracking-tight text-slate-900 duration-700 delay-200 fade-in slide-in-from-bottom-3 fill-mode-both sm:text-3xl dark:text-white">
              Even our technicians couldn&apos;t find this page
            </h1>

            {/* Description */}
            <p className="mx-auto mt-3 max-w-md animate-in text-sm leading-relaxed text-slate-600 duration-700 delay-300 fade-in slide-in-from-bottom-3 fill-mode-both dark:text-slate-400">
              The service or page you&apos;re looking for may have been moved,
              removed, or the link might be mistyped.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="mt-8 flex w-full flex-col gap-3 animate-in duration-700 delay-300 fade-in slide-in-from-bottom-4 fill-mode-both sm:flex-row sm:justify-center">
              <Link href="/" className="w-full sm:w-auto">
                <Button className="h-11 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:translate-y-0 sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>

              <Link href="/browse-services" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full border-slate-200/90 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-600 sm:w-auto dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Browse Services
                </Button>
              </Link>
            </div>

            {/* Bottom Utility Links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Go Back
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                How FixMate Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}