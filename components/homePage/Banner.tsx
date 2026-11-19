"use client";

import Image, { StaticImageData } from "next/image";
import defaultTechnicianImg from "@/app/images/Gemini_Generated_Image_2yvr2o2yvr2o2yvr.jpeg"; // Ensure filename matches your file in app/images/
import React, { useState } from "react";
import { Check, Search, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface BannerProps {
  onSearch?: (query: string) => void;
  technicianImage?: StaticImageData | string;
}

export function Banner({
  onSearch,
  technicianImage = defaultTechnicianImg,
}: BannerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Ambient Background Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-200/40 via-sky-200/40 to-emerald-100/40 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-[350px] w-[350px] rounded-full bg-violet-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Hero Copy & Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Trust Pill Badge */}
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Badge
                variant="secondary"
                className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-xs hover:bg-emerald-100/80 transition-colors"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5] text-emerald-600" />
                Pay Only After Completion
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
              Broken Device? Get It Fixed by{" "}
              <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent">
                Verified Technicians
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 mt-4 max-w-xl text-base sm:text-lg text-slate-500 leading-relaxed">
              Clean natural of smart device and home appliances repair
              technicians
            </p>

            {/* Interactive Pill Search Bar */}
            <form
              onSubmit={handleSubmit}
              className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300 mt-8 w-full max-w-xl"
            >
              <div className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-3xl sm:rounded-full border border-slate-200/80 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10">
                <div className="flex flex-1 items-center pl-3">
                  <Search className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for services (e.g. AC, Laptop)..."
                    className="border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 sm:py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:scale-[0.98]"
                >
                  Browse Services
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Technician Card & Floating Badges */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end animate-in fade-in zoom-in-95 duration-700 delay-200">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] pt-6">
              {/* Backdrop Frame */}
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-slate-200/80 to-slate-300/60 shadow-xl ring-1 ring-white/60 aspect-[4/4.3]">
                <Image
                  src={technicianImage}
                  alt="Verified FixMate Technician holding a tablet"
                  fill
                  priority
                  sizes="(max-width: 640px) 340px, 380px"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                {/* Subtle bottom gradient blend */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/20 to-transparent" />
              </div>

              {/* Floating Badge 1: Job Completed */}
              <div className="absolute top-14 -left-4 sm:-left-10 z-10 flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.08)] backdrop-blur-md animate-[bounce_5s_ease-in-out_infinite]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                  Job Completed - $45
                </span>
              </div>

              {/* Floating Badge 2: Verified Pro */}
              <div className="absolute bottom-8 -right-3 sm:-right-6 z-10 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/75 px-4 py-2.5 shadow-[0_12px_30px_rgba(0,0,0,0.1)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                <BadgeCheck className="h-5 w-5 text-slate-700 stroke-[2]" />
                <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                  Verified Pro
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}