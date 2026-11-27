"use client";

import React from "react";
import {
  ShieldCheck,
  CreditCard,
  Clock,
  FileText,
  Home,
  Wrench,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Pay Only After Completion",
    description:
      "Never pay upfront. Stripe Checkout unlocks only after your technician finishes the repair and marks the job completed.",
    icon: CreditCard,
    iconStyle:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    borderHover: "hover:border-emerald-300 dark:hover:border-emerald-800",
  },
  {
    title: "Admin-Verified Services",
    description:
      "Every repair listing and price update is reviewed by our admin team before going live, keeping the platform reliable.",
    icon: ShieldCheck,
    iconStyle:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    borderHover: "hover:border-indigo-300 dark:hover:border-indigo-800",
  },
  {
    title: "Live Step-by-Step Tracking",
    description:
      "Follow your booking from Requested to Accepted, In Progress, and Completed in real time from your dashboard.",
    icon: Clock,
    iconStyle:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    borderHover: "hover:border-amber-300 dark:hover:border-amber-800",
  },
  {
    title: "Home Visit or Shop Drop-off",
    description:
      "Choose doorstep servicing for heavy appliances like ACs and fridges, or quick shop drop-off for phones and laptops.",
    icon: Home,
    iconStyle: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
    borderHover: "hover:border-sky-300 dark:hover:border-sky-800",
  },
  {
    title: "Instant PDF Invoices",
    description:
      "Every Stripe payment generates a verified transaction ID and a one-click downloadable PDF receipt for your records.",
    icon: FileText,
    iconStyle:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
    borderHover: "hover:border-violet-300 dark:hover:border-violet-800",
  },
  {
    title: "Free Pre-Acceptance Cancel",
    description:
      "Plans changed? Cancel any repair request with one click while it is still in Requested status—no questions asked.",
    icon: Wrench,
    iconStyle:
      "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    borderHover: "hover:border-rose-300 dark:hover:border-rose-800",
  },
];

export function WhyChooseFixMate() {
  return (
    <section className="relative overflow-hidden py-16 transition-colors duration-300 sm:py-24">
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-200/30 via-violet-200/25 to-emerald-200/30 blur-3xl dark:from-indigo-600/10 dark:via-violet-600/10 dark:to-emerald-500/10"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/90 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Why Choose FixMate
          </Badge>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Repairs Built Around{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Trust & Transparency
            </span>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Every part of the FixMate workflow is designed to protect your
            devices, your time, and your money.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                style={{ animationDelay: `${index * 70}ms` }}
                className={`group rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:shadow-black/30 ${feature.borderHover}`}
              >
                <CardContent className="p-6">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${feature.iconStyle}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}