"use client";

import React from "react";
import Link from "next/link";
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ServiceCategory } from "@/types/fixmate";
import { usePathname } from "next/navigation";
 
interface QuickLink {
  label: string;
  href: string;
}

const quickLinks: QuickLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/browse-services" },
  { label: "About", href: "/about" },
];

const popularCategories: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}


export function Footer() {
  const currentYear = new Date().getFullYear();

   const pathname = usePathname()

     if (pathname.startsWith("/dashboard")) return null

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/80 bg-white/85 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-950/90">
      {/* Subtle Ambient Top Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-indigo-50/60 via-sky-50/30 to-transparent dark:from-indigo-950/40 dark:via-slate-900/20 dark:to-transparent"
      />

      <div className="mx-auto max-w-6xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand, Tagline & Socials */}
          <div className="space-y-4 lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
                <Wrench className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                FixMate
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Trusted on-demand smart device and home appliance repair
              platform. Track every step in real time and pay online only after
              your repair is completed.
            </p>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Pay Only After Completion</span>
            </div>

            {/* Social Links (featuring new X logo) */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow FixMate on X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <XLogoIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow FixMate on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <FacebookIcon className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with FixMate on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-600 hover:text-white hover:shadow-md hover:shadow-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-600 dark:hover:text-white"
              >
                <LinkedInIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-200 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
              Popular Categories
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-1">
              {popularCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/browse-services?category=${encodeURIComponent(category)}`}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 transition-colors duration-200 group-hover:bg-indigo-600 dark:bg-slate-700 dark:group-hover:bg-indigo-400" />
                    <span>{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-wider text-slate-900 uppercase dark:text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>House 24, Road 7, Dhanmondi, Dhaka 1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Phone className="h-4 w-4" />
                </span>
                <a
                  href="tel:+8801861805137"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  +880 1861805137
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Mail className="h-4 w-4" />
                </span>
                <a
                  href="mailto:support@fixmate.com"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  support@fixmate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200/70 dark:bg-slate-800" />

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row dark:text-slate-400">
          <p>© {currentYear} FixMate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              How It Works
            </Link>
            <Link
              href="/browse-services"
              className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Verified Technicians
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}