"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Clock,
  CheckCircle2,
  DollarSign,
  CreditCard,
  ArrowRight,
  Calendar,
  Search,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Booking, Payment } from "@/types/fixmate";
import { customerBookings } from "@/lib/api/services";
import { getCustomerPayments } from "@/lib/api/payments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0];
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const CustomerOverviewPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const customerEmail = session?.user?.email;
  const customerName = session?.user?.name || "Customer";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const isLoading = isSessionLoading || (Boolean(customerEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !customerEmail) return;

    let isMounted = true;

    const loadCustomerData = async () => {
      try {
        const [bookingList, paymentList] = await Promise.all([
          customerBookings(customerEmail),
          getCustomerPayments(customerEmail),
        ]);

        if (isMounted) {
          setBookings(bookingList);
          setPayments(paymentList);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to load your dashboard overview."
          );
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadCustomerData();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, customerEmail]);

  const activeBookings = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const readyToPay = bookings.filter(
    (b) => b.status === "completed" && b.paymentStatus === "unpaid"
  );
  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueAmount = readyToPay.reduce(
    (sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0),
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <Wrench className="h-3.5 w-3.5" />
            Customer Dashboard
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Welcome back, {customerName}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your active repair requests, pay completed bills securely, and
            access your receipts.
          </p>
        </div>

        <Link
          href="/browse-services"
          className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg"
        >
          <Search className="h-4 w-4" />
          Browse Services
        </Link>
      </div>

      {/* Payment Due Alert */}
      {!isLoading && readyToPay.length > 0 && (
        <Card className="rounded-2xl border border-indigo-200/80 bg-indigo-50/70 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 text-sm text-indigo-800 dark:text-indigo-200">
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>
                You have <span className="font-bold">{readyToPay.length}</span>{" "}
                completed {readyToPay.length === 1 ? "repair" : "repairs"} ready
                for Stripe payment (
                <span className="font-bold">${dueAmount.toFixed(2)}</span>).
              </span>
            </div>
            <Link
              href="/dashboard/customer/payments"
              className="text-xs font-semibold text-indigo-700 underline-offset-4 hover:underline dark:text-indigo-300"
            >
              Pay Now →
            </Link>
          </div>
        </Card>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Bookings",
            value: isLoading ? "—" : String(bookings.length),
            sub: `${completedBookings.length} completed repairs`,
            icon: Wrench,
            accent: "text-slate-900 dark:text-white",
            iconBg:
              "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
            href: "/dashboard/customer/bookings",
          },
          {
            label: "Active Repairs",
            value: isLoading ? "—" : String(activeBookings.length),
            sub: "Requested, accepted, or in progress",
            icon: Clock,
            accent: "text-indigo-600 dark:text-indigo-400",
            iconBg:
              "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
            href: "/dashboard/customer/bookings",
          },
          {
            label: "Ready to Pay",
            value: isLoading ? "—" : String(readyToPay.length),
            sub:
              dueAmount > 0
                ? `$${dueAmount.toFixed(2)} due via Stripe`
                : "No pending bills",
            icon: CreditCard,
            accent: "text-amber-600 dark:text-amber-400",
            iconBg:
              "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
            href: "/dashboard/customer/payments",
          },
          {
            label: "Total Spent",
            value: isLoading ? "—" : `$${totalSpent.toFixed(2)}`,
            sub: `${payments.length} verified receipts`,
            icon: DollarSign,
            accent: "text-emerald-600 dark:text-emerald-400",
            iconBg:
              "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
            href: "/dashboard/customer/payments",
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

      {/* Bottom Grid: Recent Bookings + Recent Receipts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs lg:col-span-2 dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">
              Recent Bookings
            </CardTitle>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              My Bookings
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
            ) : bookings.length === 0 ? (
              <div className="py-10 text-center">
                <Wrench className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  No repair requests yet
                </p>
                <Link
                  href="/browse-services"
                  className="mt-3 inline-flex text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Explore repair services →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.slice(0, 5).map((b, idx) => (
                  <div
                    key={b._id || idx}
                    className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {b.serviceTitle}
                      </p>
                      <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                        <span>Tech: {b.technicianName}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3 text-indigo-500" />
                        <span>{formatDate(b.preferredDate)}</span>
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

        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-bold">
              Recent Receipts
            </CardTitle>
            <Link
              href="/dashboard/customer/payments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Payments
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
            ) : payments.length === 0 ? (
              <div className="py-10 text-center">
                <Receipt className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700" />
                <p className="mt-2 text-xs text-slate-500">
                  Your Stripe receipts will appear here after checkout.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.slice(0, 4).map((p, idx) => (
                  <div
                    key={p._id || idx}
                    className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                        {p.serviceTitle}
                      </p>
                      <p className="truncate text-[11px] text-slate-500">
                        {formatDate(p.paidAt)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${Number(p.amount).toFixed(2)}
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

export default CustomerOverviewPage;