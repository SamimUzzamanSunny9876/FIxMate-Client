"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  Quote,
  ArrowRight,
  Wrench,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Farhan Ahmed",
    area: "Dhanmondi, Dhaka",
    service: "AC Master Servicing",
    quote:
      "Booked a home visit in two minutes. The technician arrived on time, fixed the cooling issue, and I only paid via Stripe once the AC was running cold again.",
    initials: "FA",
    avatarBg: "from-indigo-500 to-violet-600",
  },
  {
    name: "Nusrat Jahan",
    area: "Uttara, Dhaka",
    service: "Laptop SSD & Thermal Paste",
    quote:
      "Loved seeing every status update in my dashboard. Having a proper PDF invoice right after payment made it feel way more professional than a random repair shop.",
    initials: "NJ",
    avatarBg: "from-emerald-500 to-teal-600",
  },
  {
    name: "Tanvir Hasan",
    area: "Banani, Dhaka",
    service: "Smartphone Display Replacement",
    quote:
      "Clear base pricing upfront and zero pressure to pay before the screen was tested. Easily the smoothest device repair experience I've had.",
    initials: "TH",
    avatarBg: "from-sky-500 to-indigo-600",
  },
];

export function TestimonialsAndCTA() {
  return (
    <section className="relative overflow-hidden py-16 transition-colors duration-300 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Testimonials Header */}
        <div className="mx-auto max-w-2xl text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Customer Feedback
          </Badge>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Trusted by Homeowners &{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-emerald-400">
              Device Owners
            </span>
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Real experiences from customers who booked verified repairs across
            Dhaka.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, idx) => (
            <Card
              key={item.name}
              style={{ animationDelay: `${idx * 90}ms` }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800/90 dark:bg-slate-900/80 dark:hover:border-indigo-700"
            >
              <CardContent className="flex h-full flex-col p-6">
                {/* Stars + Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-indigo-100 transition-colors group-hover:text-indigo-200 dark:text-slate-800 dark:group-hover:text-indigo-900" />
                </div>

                {/* Quote Text */}
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Service Tag */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Wrench className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                    {item.service}
                  </span>
                </div>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-sm ${item.avatarBg}`}
                  >
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3 w-3 text-indigo-500 dark:text-indigo-400" />
                      {item.area}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Dual CTA Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-8 text-white shadow-xl shadow-indigo-500/20 sm:p-12 dark:from-indigo-900 dark:via-violet-900 dark:to-slate-900 dark:ring-1 dark:ring-indigo-500/30">
          {/* Decorative Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-indigo-50 backdrop-blur-md">
                <Wrench className="h-3.5 w-3.5" />
                Get Started Today
              </span>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Need a quick repair, or ready to offer your skills?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-indigo-100/90">
                Book an admin-approved technician in minutes with zero upfront
                fees, or sign up as a FixMate Technician to grow your local
                repair business.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/browse-services"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-indigo-700 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Browse Services
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                Join as Technician
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}