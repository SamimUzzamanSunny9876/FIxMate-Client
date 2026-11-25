"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  DollarSign,
  Wrench,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Booking, RepairService } from "@/types/fixmate";
import { technicianBookings } from "@/lib/api/services";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const formatDate = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0];
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TechnicianOverviewPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const technicianEmail = session?.user?.email;
  const technicianName = session?.user?.name || "Technician";

  const [services, setServices] = useState<RepairService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const isLoading =
    isSessionLoading || (Boolean(technicianEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !technicianEmail) return;

    let isMounted = true;

    const loadTechnicianData = async () => {
      try {
        const [servicesRes, bookingList] = await Promise.all([
          fetch(
            `${BASE_URL}/services?technicianEmail=${encodeURIComponent(technicianEmail)}`,
            { credentials: "include", cache: "no-store" }
          ).then((r) => (r.ok ? r.json() : [])),
          technicianBookings(technicianEmail),
        ]);

        if (isMounted) {
          setServices(
            Array.isArray(servicesRes) ? servicesRes : (servicesRes?.data ?? [])
          );
          setBookings(bookingList);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to load technician overview."
          );
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadTechnicianData();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, technicianEmail]);

  const paidJobs = bookings.filter((b) => b.paymentStatus === "paid");
  const totalEarned = paidJobs.reduce(
    (sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0),
    0
  );
  const newRequests = bookings.filter((b) => b.status === "requested");
  const activeJobs = bookings.filter((b) =>
    ["accepted", "in-progress"].includes(b.status)
  );
  const completedJobs = bookings.filter((b) => b.status === "completed");
  const pendingPayout = completedJobs
    .filter((b) => b.paymentStatus === "unpaid")
    .reduce((sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0), 0);
  const approvedServices = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;

  const recentJobs = bookings.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Briefcase className="h-3.5 w-3.5" />
            Technician Overview
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Welcome back, {technicianName}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here is what is happening across your repair listings, incoming
            jobs, and completed payments.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      {/* Incoming Request Alert */}
      {!isLoading && newRequests.length > 0 && (
        <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-sm text-amber-800 dark:text-amber-300">
              <Clock className="h-4 w-4 shrink-0" />
              <span>
                You have{" "}
                <span className="font-bold">{newRequests.length}</span> new
                repair {newRequests.length === 1 ? "request" : "requests"}{" "}
                waiting for your response.
              </span>
            </div>
            <Link
              href="/dashboard/technician/requests"
              className="text-xs font-semibold text-amber-900 underline-offset-4 hover:underline dark:text-amber-200"
            >
              Manage Requests →
            </Link>
          </div>
        </Card>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Earned",
            value: isLoading ? "—" : `$${totalEarned.toFixed(2)}`,
            sub:
              pendingPayout > 0
                ? `$${pendingPayout.toFixed(2)} awaiting customer pay`
                : `${paidJobs.length} paid jobs`,
            icon: DollarSign,
            accent: "text-emerald-600 dark:text-emerald-400",
            iconBg:
              "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
            href: "/dashboard/technician/requests",
          },
          {
            label: "New Requests",
            value: isLoading ? "—" : String(newRequests.length),
            sub: `${activeJobs.length} currently in progress`,
            icon: Clock,
            accent: "text-amber-600 dark:text-amber-400",
            iconBg:
              "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
            href: "/dashboard/technician/requests",
          },
          {
            label: "Completed Jobs",
            value: isLoading ? "—" : String(completedJobs.length),
            sub: `${bookings.length} total requests received`,
            icon: CheckCircle2,
            accent: "text-indigo-600 dark:text-indigo-400",
            iconBg:
              "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
            href: "/dashboard/technician/requests",
          },
          {
            label: "My Services",
            value: isLoading ? "—" : String(services.length),
            sub: `${approvedServices} approved & live`,
            icon: Wrench,
            accent: "text-violet-600 dark:text-violet-400",
            iconBg:
              "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
            href: "/dashboard/technician/my-services",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group block">
              <Card className="h-full rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-indigo-300 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {stat.label}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-2xl font-extrabold",
                          stat.accent
                        )}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        stat.iconBg
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {stat.sub}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Bottom Grid: Recent Job Requests + Recently Paid Jobs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs lg:col-span-2 dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">
              Recent Job Requests
            </CardTitle>
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Manage All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="py-10 text-center">
                <Wrench className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  No incoming job requests yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Make sure your services are approved and active to receive
                  bookings.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentJobs.map((job, idx) => (
                  <div
                    key={job._id || idx}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {job.serviceTitle}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <span>{job.customerName}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3 text-indigo-500" />
                        <span>{formatDate(job.preferredDate)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="rounded-full text-xs capitalize"
                      >
                        {job.status}
                      </Badge>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        ${job.finalAmount ?? job.basePrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paid Jobs Summary */}
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">Paid Jobs</CardTitle>
            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : paidJobs.length === 0 ? (
              <div className="py-10 text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-xs text-slate-500">
                  Paid repair jobs will show here once customers complete
                  checkout.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {paidJobs.slice(0, 4).map((job, idx) => (
                  <div
                    key={job._id || idx}
                    className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                        {job.serviceTitle}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {job.customerName} • {formatDate(job.preferredDate)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      +${Number(job.finalAmount ?? job.basePrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianOverviewPage;