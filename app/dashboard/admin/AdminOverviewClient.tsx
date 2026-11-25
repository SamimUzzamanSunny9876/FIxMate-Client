"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  ClipboardList,
  DollarSign,
  Clock,
  ArrowRight,
  Wrench,
  Receipt,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Booking, Payment, RepairService } from "@/types/fixmate";
import { getAdminServices } from "@/lib/api/services";
import { getAllBookings, getAllTransactions } from "@/lib/api/admin";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminOverviewClientProps {
  totalUsers: number;
  customerCount: number;
  technicianCount: number;
}

const formatDate = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0];
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const AdminOverviewClient = ({
  totalUsers,
  customerCount,
  technicianCount,
}: AdminOverviewClientProps) => {
  const [services, setServices] = useState<RepairService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPlatformStats = async () => {
      try {
        const [serviceList, bookingList, paymentList] = await Promise.all([
          getAdminServices(),
          getAllBookings(),
          getAllTransactions(),
        ]);

        if (isMounted) {
          setServices(serviceList);
          setBookings(bookingList);
          setTransactions(paymentList);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to load admin overview data."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadPlatformStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const pendingServices = services.filter(
    (s) => s.approvalStatus === "pending"
  );
  const approvedServicesCount = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const completedBookingsCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const activeBookingsCount = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  ).length;

  const recentBookings = bookings.slice(0, 5);
  const recentTransactions = transactions.slice(0, 5);

  const statusBreakdown = [
    {
      label: "Requested",
      count: bookings.filter((b) => b.status === "requested").length,
      bar: "bg-amber-500",
    },
    {
      label: "In Progress / Accepted",
      count: bookings.filter((b) =>
        ["accepted", "in-progress"].includes(b.status)
      ).length,
      bar: "bg-indigo-500",
    },
    {
      label: "Completed",
      count: completedBookingsCount,
      bar: "bg-emerald-500",
    },
    {
      label: "Cancelled / Rejected",
      count: bookings.filter((b) =>
        ["cancelled", "rejected"].includes(b.status)
      ).length,
      bar: "bg-slate-400",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin Control Center
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Platform Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Live snapshot of users, pending service approvals, bookings, and
            Stripe revenue.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services"
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg"
        >
          <ShieldCheck className="h-4 w-4" />
          Review Approvals
          {pendingServices.length > 0 && (
            <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold">
              {pendingServices.length}
            </span>
          )}
        </Link>
      </div>

      {/* Pending Approval Alert */}
      {!isLoading && pendingServices.length > 0 && (
        <Card className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-sm text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                <span className="font-bold">{pendingServices.length}</span>{" "}
                technician{" "}
                {pendingServices.length === 1 ? "service is" : "services are"}{" "}
                waiting for your approval before going live.
              </span>
            </div>
            <Link
              href="/dashboard/admin/services"
              className="text-xs font-semibold text-amber-900 underline-offset-4 hover:underline dark:text-amber-200"
            >
              Open Service Approval →
            </Link>
          </div>
        </Card>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Revenue",
            value: isLoading ? "—" : `$${totalRevenue.toFixed(2)}`,
            sub: `${transactions.length} paid transactions`,
            icon: DollarSign,
            accent: "text-emerald-600 dark:text-emerald-400",
            iconBg:
              "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
            href: "/dashboard/admin/transactions",
          },
          {
            label: "Registered Users",
            value: String(totalUsers),
            sub: `${customerCount} customers • ${technicianCount} techs`,
            icon: Users,
            accent: "text-violet-600 dark:text-violet-400",
            iconBg:
              "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
            href: "/dashboard/admin/users",
          },
          {
            label: "Total Bookings",
            value: isLoading ? "—" : String(bookings.length),
            sub: `${activeBookingsCount} active • ${completedBookingsCount} done`,
            icon: ClipboardList,
            accent: "text-indigo-600 dark:text-indigo-400",
            iconBg:
              "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
            href: "/dashboard/admin/bookings",
          },
          {
            label: "Service Listings",
            value: isLoading ? "—" : String(services.length),
            sub: `${approvedServicesCount} live • ${pendingServices.length} pending`,
            icon: Wrench,
            accent: "text-amber-600 dark:text-amber-400",
            iconBg:
              "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
            href: "/dashboard/admin/services",
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

      {/* Middle Row: Booking Breakdown + Recent Transactions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Booking Status Distribution */}
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">
              Booking Pipeline
            </CardTitle>
            <Link
              href="/dashboard/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              All Bookings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              statusBreakdown.map((item) => {
                const pct =
                  bookings.length > 0
                    ? Math.round((item.count / bookings.length) * 100)
                    : 0;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {item.count}{" "}
                        <span className="font-normal text-slate-400">
                          ({pct}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          item.bar
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Stripe Transactions */}
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">
              Recent Transactions
            </CardTitle>
            <Link
              href="/dashboard/admin/transactions"
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
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <Receipt className="h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-xs text-slate-500">
                  No Stripe payments recorded yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentTransactions.map((t, idx) => (
                  <div
                    key={t._id || idx}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {t.serviceTitle}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {t.customerName} → {t.technicianName} •{" "}
                        {formatDate(t.paidAt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      +${Number(t.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-950/80">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold">Recent Bookings</CardTitle>
          <Link
            href="/dashboard/admin/bookings"
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
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-500">
              No bookings placed yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentBookings.map((b, idx) => (
                <div
                  key={b._id || idx}
                  className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      Customer: {b.customerName} • Tech: {b.technicianName} •{" "}
                      {formatDate(b.preferredDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full text-xs capitalize"
                    >
                      {b.status === "completed" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3 text-emerald-500" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3 text-amber-500" />
                      )}
                      {b.status}
                    </Badge>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ${b.finalAmount ?? b.basePrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewClient;