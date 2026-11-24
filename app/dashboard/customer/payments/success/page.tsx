"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  User,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Payment } from "@/types/fixmate";
import { verifyStripeSession } from "@/lib/api/payments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const formatDate = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0];
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(
    sessionId ? null : "Missing Stripe session ID."
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(Boolean(sessionId));
  const [copied, setCopied] = useState(false);

  const hasVerifiedRef = useRef(false);

useEffect(() => {
  if (!sessionId || hasVerifiedRef.current) return;
  hasVerifiedRef.current = true;

  let isMounted = true;

  const confirmPayment = async () => {
    try {
      const verifiedPayment = await verifyStripeSession(sessionId);
      if (isMounted) {
        setPayment(verifiedPayment);
        toast.success("Payment verified and receipt saved!");
      }
    } catch (err) {
      if (isMounted) {
        const message =
          err instanceof Error
            ? err.message
            : "Could not verify your Stripe payment.";
        setError(message);
        toast.error(message);
      }
    } finally {
      if (isMounted) setIsVerifying(false);
    }
  };

  void confirmPayment();

  return () => {
    isMounted = false;
  };
}, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    const confirmPayment = async () => {
      try {
        const verifiedPayment = await verifyStripeSession(sessionId);
        if (isMounted) {
          setPayment(verifiedPayment);
          toast.success("Payment verified and receipt saved!");
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error
              ? err.message
              : "Could not verify your Stripe payment.";
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsVerifying(false);
      }
    };

    void confirmPayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const handleCopyTxn = () => {
    if (!payment?.transactionId) return;
    navigator.clipboard.writeText(payment.transactionId);
    setCopied(true);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isVerifying) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <Card className="w-full rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/90">
          <CardContent className="flex flex-col items-center space-y-4 p-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Verifying Your Payment...
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please wait while we confirm your Stripe transaction and update
              your booking receipt.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <Card className="w-full rounded-3xl border border-red-200/80 bg-white/95 p-8 shadow-sm dark:border-red-900/50 dark:bg-slate-950/90">
          <CardContent className="flex flex-col items-center space-y-4 p-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Payment Verification Failed
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {error || "We could not confirm this payment session."}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/dashboard/customer/payments"
                className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md"
              >
                Back to Payments
              </Link>
              <Link
                href="/dashboard/customer/bookings"
                className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                My Bookings
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-xl items-center justify-center px-4 py-10">
      <Card className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.18)] animate-in fade-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-950/90">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 px-6 py-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <CheckCircle2 className="h-9 w-9 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight">
            Payment Successful!
          </h1>
          <p className="mt-1 text-sm text-emerald-50">
            Thank you, {payment.customerName}. Your repair has been marked as
            paid.
          </p>
        </div>

        <CardContent className="space-y-6 p-6 sm:p-8">
          {/* Amount Highlight */}
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200/70 bg-emerald-50/70 px-5 py-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <div>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Total Paid
              </p>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                ${Number(payment.amount).toFixed(2)}{" "}
                <span className="text-xs font-semibold uppercase">
                  {payment.currency}
                </span>
              </p>
            </div>
            <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Paid via Stripe
            </Badge>
          </div>

          {/* Receipt Breakdown */}
          <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                Service
              </span>
              <span className="text-right font-semibold text-slate-900 dark:text-white">
                {payment.serviceTitle}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <User className="h-3.5 w-3.5 text-indigo-500" />
                Technician
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {payment.technicianName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                Paid At
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {formatDate(payment.paidAt)}
              </span>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-slate-500 uppercase">
              Transaction ID
            </p>
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <span className="truncate">{payment.transactionId}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCopyTxn}
                className="ml-2 h-7 shrink-0 rounded-lg px-2 text-xs text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/dashboard/customer/payments"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg"
            >
              <Receipt className="mr-2 h-4 w-4" />
              View Payment History
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              My Bookings
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}