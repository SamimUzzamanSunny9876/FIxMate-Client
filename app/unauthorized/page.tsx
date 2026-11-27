"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  LayoutDashboard,
  Lock,
  Wrench,
  LogIn,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types/fixmate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getDashboardRoute(role?: string): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "technician":
      return "/dashboard/technician";
    case "customer":
    default:
      return "/dashboard/customer";
  }
}

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = (user as { role?: UserRole } | undefined)?.role;
  const dashboardHref = getDashboardRoute(userRole);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-14 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950">
      {/* Animated Ambient Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-28 right-0 h-[460px] w-[460px] animate-pulse rounded-full bg-gradient-to-br from-rose-200/45 via-amber-100/35 to-indigo-200/35 blur-3xl [animation-duration:7s] dark:from-rose-600/20 dark:via-amber-600/10 dark:to-indigo-600/15" />
        <div className="absolute -bottom-32 -left-24 h-[440px] w-[440px] animate-pulse rounded-full bg-gradient-to-tr from-indigo-200/40 via-violet-200/35 to-rose-100/30 blur-3xl [animation-duration:9s] dark:from-indigo-600/20 dark:via-violet-600/15 dark:to-rose-600/10" />
      </div>

      <div className="w-full max-w-lg animate-in space-y-6 duration-700 fade-in slide-in-from-bottom-6">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
              <Wrench className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              FixMate
            </span>
          </Link>
        </div>

        {/* Glassmorphic Access Denied Card */}
        <Card className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-[0_24px_60px_-15px_rgba(225,29,72,0.12)] backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.55)]">
          {/* Top Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-600" />

          <CardContent className="flex flex-col items-center px-6 py-10 text-center sm:px-10 sm:py-12">
            {/* Animated Shield Icon */}
            <div className="relative mb-6 flex items-center justify-center">
              <span className="absolute h-24 w-24 animate-ping rounded-full bg-rose-400/20 [animation-duration:3s] dark:bg-rose-500/15" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-amber-50 text-rose-600 shadow-lg shadow-rose-500/15 transition-transform duration-300 hover:scale-105 dark:border-rose-900/60 dark:from-rose-950/80 dark:to-amber-950/40 dark:text-rose-400">
                <ShieldAlert className="h-10 w-10 stroke-[2]" />
              </div>
              <span className="absolute -right-1.5 -bottom-1.5 flex h-8 w-8 items-center justify-center rounded-xl border border-white bg-slate-900 text-white shadow-md dark:border-slate-800 dark:bg-slate-800">
                <Lock className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* 403 Pill */}
            <Badge
              variant="outline"
              className="rounded-full border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold tracking-wider text-rose-700 uppercase dark:border-rose-800/70 dark:bg-rose-950/60 dark:text-rose-300"
            >
              403 • Access Restricted
            </Badge>

            {/* Headline */}
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              You don&apos;t have permission to view this page
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This area is protected by role-based access control. Your current
              account role does not match the permissions required for this
              workspace.
            </p>

            {/* Current Role Indicator (when logged in) */}
            {!isPending && user && (
              <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
                <span>Signed in as</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.email}
                </span>
                {userRole && (
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 capitalize dark:bg-indigo-950 dark:text-indigo-300">
                    {userRole}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              {user ? (
                <Link href={dashboardHref} className="w-full sm:w-auto">
                  <Button className="h-11 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 sm:w-auto">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to My Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/sign-in" className="w-full sm:w-auto">
                  <Button className="h-11 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 sm:w-auto">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}

              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-full border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600 sm:w-auto dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Subtle Go Back Link */}
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to previous page
            </button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}