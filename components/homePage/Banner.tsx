"use client";

import Image, { StaticImageData } from "next/image";
import defaultTechnicianImg from "@/app/images/Gemini_Generated_Image_2yvr2o2yvr2o2yvr.jpeg";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Search,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BannerProps {
  onSearch?: (query: string) => void;
  technicianImage?: StaticImageData | string;
}

const SEARCH_PLACEHOLDERS = [
  "Search for services (e.g. AC Servicing)...",
  "Try 'iPhone Screen Replacement'...",
  "Try 'Laptop & PC Repair'...",
  "Try 'Refrigerator Cooling Fix'...",
  "Try 'Washing Machine' or 'Electrical'...",
];

const QUICK_CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "Electrical",
];

export function Banner({
  onSearch,
  technicianImage = defaultTechnicianImg,
}: BannerProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Rotate search placeholder text smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();

    if (onSearch) {
      onSearch(trimmed);
      return;
    }

    if (trimmed) {
      router.push(`/browse-services?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/browse-services");
    }
  };

  const handleQuickCategory = (category: string) => {
    router.push(`/browse-services?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 transition-colors duration-300 sm:pt-12 sm:pb-24">
      {/* Animated Ambient Background Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 right-0 h-[500px] w-[500px] animate-pulse rounded-full bg-gradient-to-br from-indigo-200/45 via-sky-200/40 to-emerald-100/40 blur-3xl [animation-duration:7s] dark:from-indigo-600/20 dark:via-violet-600/15 dark:to-emerald-500/10" />
        <div className="absolute top-1/3 left-1/4 h-[360px] w-[360px] animate-pulse rounded-full bg-violet-200/35 blur-3xl [animation-duration:9s] dark:bg-violet-600/15" />
        <div className="absolute -bottom-24 -left-16 h-[320px] w-[320px] rounded-full bg-sky-200/30 blur-3xl dark:bg-indigo-900/20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Copy & Search */}
          <div className="flex flex-col items-start text-left lg:col-span-7">
            {/* Trust Pill Badge with Live Dot */}
            <div className="animate-in duration-500 fade-in slide-in-from-bottom-3">
              <Badge
                variant="secondary"
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs transition-colors hover:bg-emerald-100/80 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-950"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Pay Only After Completion
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="animate-in text-4xl font-extrabold tracking-tight text-slate-900 duration-700 delay-100 fade-in slide-in-from-bottom-4 fill-mode-both sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15] dark:text-white">
              Broken Device? Get It Fixed by{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400">
                Verified Technicians
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 max-w-xl animate-in text-base leading-relaxed text-slate-600 duration-700 delay-200 fade-in slide-in-from-bottom-4 fill-mode-both sm:text-lg dark:text-slate-300">
              Book trusted local technicians for smartphones, laptops, and home
              appliances — track every step live and pay securely only after the
              job is done.
            </p>

            {/* Interactive Pill Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 w-full max-w-xl animate-in duration-700 delay-300 fade-in slide-in-from-bottom-5 fill-mode-both"
            >
              <div className="group flex flex-col items-stretch gap-2 rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_12px_40px_-10px_rgba(79,70,229,0.12)] backdrop-blur-md transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/15 sm:flex-row sm:items-center sm:rounded-full dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.45)] dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/20">
                <div className="flex flex-1 items-center pl-3">
                  <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:text-slate-500 dark:group-focus-within:text-indigo-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={SEARCH_PLACEHOLDERS[placeholderIdx]}
                    aria-label="Search repair services"
                    className="border-0 bg-transparent text-sm text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent dark:text-slate-100 dark:placeholder:text-slate-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:translate-y-0 active:scale-[0.98] sm:py-2.5"
                >
                  <span>{searchQuery.trim() ? "Search Now" : "Browse Services"}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Button>
              </div>
            </form>

            {/* Quick Category Pills */}
            <div className="mt-5 flex flex-wrap items-center gap-2 animate-in duration-700 delay-500 fade-in slide-in-from-bottom-4 fill-mode-both">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                Popular:
              </span>
              {QUICK_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleQuickCategory(category)}
                  className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Technician Card & Floating Badges */}
          <div className="flex justify-center animate-in duration-700 delay-200 fade-in zoom-in-95 fill-mode-both lg:col-span-5 lg:justify-end">
            <div className="group/card relative w-full max-w-[340px] pt-6 sm:max-w-[380px]">
              {/* Subtle Glow Halo Behind Image */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/20 via-violet-500/15 to-emerald-400/20 opacity-75 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100 dark:from-indigo-500/25 dark:via-violet-500/20 dark:to-emerald-500/15"
              />

              {/* Backdrop Frame */}
              <div className="relative aspect-[4/4.3] overflow-hidden rounded-[2rem] bg-gradient-to-b from-slate-200/80 to-slate-300/60 shadow-xl ring-1 ring-white/60 transition-transform duration-500 group-hover/card:-translate-y-1 dark:from-slate-800 dark:to-slate-900 dark:ring-slate-700/70">
                <Image
                  src={technicianImage}
                  alt="Verified FixMate Technician holding a tablet"
                  fill
                  priority
                  sizes="(max-width: 640px) 340px, 380px"
                  className="object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
                />
                {/* Subtle bottom gradient blend */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/35 to-transparent" />
              </div>

              {/* Floating Badge 1: Job Completed */}
              <div className="absolute top-14 -left-4 z-10 flex animate-[bounce_5s_ease-in-out_infinite] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-left-10 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-slate-800 sm:text-sm dark:text-slate-100">
                  Job Completed - $45
                </span>
              </div>

              {/* Floating Badge 2: Verified Pro */}
              <div className="absolute right-0 -bottom-2 z-10 flex animate-[bounce_6.5s_ease-in-out_infinite] items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:-right-6 sm:bottom-8 dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
                <BadgeCheck className="h-5 w-5 stroke-[2] text-indigo-600 dark:text-indigo-400" />
                <span className="whitespace-nowrap text-xs font-semibold text-slate-800 sm:text-sm dark:text-slate-100">
                  Verified Pro
                </span>
              </div>

              {/* Floating Badge 3: Stripe Protected */}
              <div className="absolute -top-1 right-4 z-10 hidden items-center gap-1.5 rounded-full border border-indigo-200/70 bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 shadow-md backdrop-blur-md transition-transform duration-300 hover:scale-105 sm:flex dark:border-indigo-800/70 dark:bg-slate-900/90 dark:text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Stripe Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}