"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Receipt,
  Loader2,
  Calendar,
  User,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  DollarSign,
  Wrench,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Booking, Payment } from "@/types/fixmate";
import { downloadPaymentInvoice } from "@/lib/utils/downloadInvoice";
import {
  getCustomerPayments,
  createCheckoutSession,
  verifyStripeSession,
} from "@/lib/api/payments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { customerBookings } from "@/lib/api/services";

const formatDate = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0];
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PaymentPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const customerEmail = session?.user?.email;

  const [unpaidBookings, setUnpaidBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isLoading = isSessionLoading || (Boolean(customerEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !customerEmail) return;

    let isMounted = true;

    const loadAllData = async () => {
      try {
        // Check if returning from Stripe Checkout
        const urlParams = new URLSearchParams(window.location.search);
        const isSuccess = urlParams.get("success") === "true";
        const sessionId = urlParams.get("session_id");
        const isCanceled = urlParams.get("canceled") === "true";

        if (isSuccess && sessionId) {
          if (isMounted) setIsVerifying(true);
          try {
            await verifyStripeSession(sessionId);
            toast.success("Payment successful! Your receipt is ready.");
          } catch (err) {
            const msg =
              err instanceof Error
                ? err.message
                : "Could not verify payment session.";
            toast.error(msg);
          } finally {
            if (isMounted) setIsVerifying(false);
            // Clean query params from the URL
            window.history.replaceState({}, "", window.location.pathname);
          }
        } else if (isCanceled) {
          toast.info("Stripe checkout was canceled. You can pay anytime.");
          window.history.replaceState({}, "", window.location.pathname);
        }

        // Load bookings and payment history in parallel
        const [allBookings, paymentHistory] = await Promise.all([
          customerBookings(customerEmail),
          getCustomerPayments(customerEmail),
        ]);

        if (isMounted) {
          const readyToPay = allBookings.filter(
            (b) => b.status === "completed" && b.paymentStatus === "unpaid"
          );
          setUnpaidBookings(readyToPay);
          setPayments(paymentHistory);
        }
      } catch (err) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Failed to load payment data.";
          toast.error(msg);
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadAllData();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, customerEmail]);

  const handlePayWithStripe = async (bookingId?: string) => {
    if (!bookingId) return;
    setPayingBookingId(bookingId);
    try {
      const { url } = await createCheckoutSession(bookingId);
      window.location.assign(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not launch Stripe.";
      toast.error(message);
      setPayingBookingId(null);
    }
  };

  const handleCopyTxn = (txnId: string) => {
    navigator.clipboard.writeText(txnId);
    setCopiedId(txnId);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadInvoice = (payment: Payment) => {
    try {
      downloadPaymentInvoice(payment);
      toast.success("Invoice PDF downloaded!");
    } catch {
      toast.error("Failed to generate invoice PDF.");
    }
  };

  const totalSpent = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingTotal = unpaidBookings.reduce(
    (sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0),
    0
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secured by Stripe • Pay After Service
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Payments & Receipts
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pay for completed repairs securely online and review your transaction
            history.
          </p>
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <Wrench className="mr-2 h-4 w-4" />
          View My Bookings
        </Link>
      </div>

      {/* Verifying Banner when returning from Stripe */}
      {isVerifying && (
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/90 px-5 py-4 text-sm font-medium text-indigo-800 animate-pulse dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-200">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          Confirming your Stripe payment and generating your receipt...
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Spent
              </p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                {isLoading ? "—" : `$${totalSpent.toFixed(2)}`}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pending Payment
              </p>
              <p className="mt-1 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {isLoading
                  ? "—"
                  : `${unpaidBookings.length} ($${pendingTotal.toFixed(2)})`}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Completed Transactions
              </p>
              <p className="mt-1 text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {isLoading ? "—" : payments.length}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Receipt className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: Ready to Pay (Completed & Unpaid Bookings) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Ready to Pay
          </h2>
          {unpaidBookings.length > 0 && (
            <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300">
              {unpaidBookings.length} due
            </Badge>
          )}
        </div>

        {isLoading ? (
          <Card className="rounded-3xl p-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
          </Card>
        ) : unpaidBookings.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/30">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              All caught up! You have no unpaid completed repairs right now.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {unpaidBookings.map((booking, index) => {
              const isPaying = payingBookingId === booking._id;
              return (
                <Card
                  key={booking._id ?? index}
                  className="overflow-hidden rounded-3xl border border-amber-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-in fade-in slide-in-from-bottom-3 dark:border-amber-900/50 dark:bg-slate-950/90"
                >
                  <CardContent className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="h-16 w-20 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                      />
                      <div className="min-w-0">
                        <Badge
                          variant="outline"
                          className="mb-1 rounded-full border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                        >
                          Repair Completed
                        </Badge>
                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {booking.serviceTitle}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                          Tech: {booking.technicianName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0 dark:border-slate-800">
                      <div className="text-left sm:text-right">
                        <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                          Amount Due
                        </span>
                        <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                          ${booking.finalAmount ?? booking.basePrice}
                        </span>
                      </div>

                      <Button
                        type="button"
                        disabled={Boolean(payingBookingId)}
                        onClick={() => handlePayWithStripe(booking._id)}
                        className="h-10 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/40"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                            Pay with Stripe
                            <ExternalLink className="ml-1.5 h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Payment History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Payment History
        </h2>

        {isLoading ? (
          <Card className="rounded-3xl p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </Card>
        ) : payments.length === 0 ? (
          <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-14 text-center dark:border-slate-800 dark:bg-slate-950/60">
            <CardContent className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <Receipt className="h-7 w-7" />
              </div>
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                No payment records yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
                Once you pay for a completed repair service via Stripe, your
                receipt and transaction ID will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Desktop Table */}
            <Card className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm md:block dark:border-slate-800 dark:bg-slate-950/80">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
                  <TableRow className="border-slate-200/70 dark:border-slate-800">
                    <TableHead className="pl-6">Service</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow
                      key={payment._id || index}
                      style={{ animationDelay: `${index * 40}ms` }}
                      className="border-slate-100 transition-colors hover:bg-indigo-50/30 animate-in fade-in slide-in-from-bottom-2 fill-mode-both dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      <TableCell className="py-4 pl-6 font-semibold text-slate-900 dark:text-white">
                        {payment.serviceTitle}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {payment.technicianName}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          onClick={() => handleCopyTxn(payment.transactionId)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          <span className="max-w-[130px] truncate">
                            {payment.transactionId}
                          </span>
                          {copiedId === payment.transactionId ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3 text-slate-400" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {formatDate(payment.paidAt)}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                        ${Number(payment.amount).toFixed(2)}{" "}
                        <span className="text-[10px] font-medium text-slate-400 uppercase">
                          {payment.currency}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="inline-flex items-center gap-1 rounded-full border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedReceipt(payment)}
                            className="h-8 rounded-full px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                          >
                            <Receipt className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadInvoice(payment)}
                            className="h-8 rounded-full border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"
                          >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {payments.map((payment, index) => (
                <Card
                  key={payment._id || index}
                  className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {payment.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tech: {payment.technicianName}
                      </p>
                    </div>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${Number(payment.amount).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                    <span>{formatDate(payment.paidAt)}</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedReceipt(payment)}
                        className="h-7 rounded-full px-3 text-xs text-indigo-600"
                      >
                        <Receipt className="mr-1 h-3.5 w-3.5" />
                        Receipt
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(payment)}
                        className="h-7 rounded-full px-3 text-xs"
                      >
                        <Download className="mr-1 h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Receipt Details Modal */}
      <Dialog
        open={Boolean(selectedReceipt)}
        onOpenChange={(open) => {
          if (!open) setSelectedReceipt(null);
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          {selectedReceipt && (
            <>
              <DialogHeader>
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <DialogTitle className="text-center text-xl font-bold">
                  Payment Receipt
                </DialogTitle>
                <DialogDescription className="text-center text-xs">
                  Paid on {formatDate(selectedReceipt.paidAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-right text-slate-900 dark:text-white">
                    {selectedReceipt.serviceTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Technician</span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-800 dark:text-slate-200">
                    <User className="h-3.5 w-3.5 text-indigo-500" />
                    {selectedReceipt.technicianName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedReceipt.customerName}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Total Paid
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${Number(selectedReceipt.amount).toFixed(2)}{" "}
                    <span className="text-xs uppercase">
                      {selectedReceipt.currency}
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 px-3 py-2 font-mono text-[11px] dark:border-slate-800">
                  <span className="truncate">
                    {selectedReceipt.transactionId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTxn(selectedReceipt.transactionId)}
                    className={cn(
                      "ml-2 shrink-0 text-indigo-600 hover:underline"
                    )}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleDownloadInvoice(selectedReceipt)}
                className="mt-1 h-10 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:shadow-lg hover:shadow-indigo-500/40"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Invoice
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentPage;