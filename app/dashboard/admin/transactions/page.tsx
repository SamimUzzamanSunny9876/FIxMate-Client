"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Receipt,
  TrendingUp,
  Users,
  Search,
  Copy,
  Check,
  Calendar,
  CheckCircle2,
  Download,
  Wrench,
  User,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Payment } from "@/types/fixmate";
import { getAllTransactions } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

const formatDateTime = (date?: string | Date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      try {
        const data = await getAllTransactions();
        if (isMounted) setTransactions(data);
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error
              ? err.message
              : "Could not load platform transactions."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyTxn = (txnId: string) => {
    navigator.clipboard.writeText(txnId);
    setCopiedId(txnId);
    toast.success("Transaction ID copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      t.serviceTitle?.toLowerCase().includes(q) ||
      t.customerName?.toLowerCase().includes(q) ||
      t.customerEmail?.toLowerCase().includes(q) ||
      t.technicianName?.toLowerCase().includes(q) ||
      t.technicianEmail?.toLowerCase().includes(q) ||
      t.transactionId?.toLowerCase().includes(q)
    );
  });

  // Summary metrics
  const totalRevenue = transactions.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const totalCount = transactions.length;
  const avgOrderValue = totalCount > 0 ? totalRevenue / totalCount : 0;
  const uniqueCustomers = new Set(
    transactions.map((t) => t.customerEmail).filter(Boolean)
  ).size;

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.info("No transactions to export.");
      return;
    }

    const headers = [
      "Transaction ID",
      "Service",
      "Customer Name",
      "Customer Email",
      "Technician Name",
      "Technician Email",
      "Amount",
      "Currency",
      "Status",
      "Paid At",
    ];

    const escapeCsv = (val: unknown) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;

    const rows = filteredTransactions.map((t) =>
      [
        t.transactionId,
        t.serviceTitle,
        t.customerName,
        t.customerEmail,
        t.technicianName,
        t.technicianEmail,
        Number(t.amount || 0).toFixed(2),
        (t.currency || "usd").toUpperCase(),
        t.paymentStatus,
        formatDateTime(t.paidAt),
      ]
        .map(escapeCsv)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `fixmate-transactions-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Transactions exported to CSV.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Stripe Ledger
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            All Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track platform-wide Stripe revenue, inspect receipts, and export
            payment records.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isLoading || filteredTransactions.length === 0}
          onClick={handleExportCSV}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-2xs hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            accent: "text-emerald-600 dark:text-emerald-400",
            icon: DollarSign,
            iconBg:
              "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
          },
          {
            label: "Transactions",
            value: String(totalCount),
            accent: "text-indigo-600 dark:text-indigo-400",
            icon: Receipt,
            iconBg:
              "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
          },
          {
            label: "Avg. Payment",
            value: `$${avgOrderValue.toFixed(2)}`,
            accent: "text-violet-600 dark:text-violet-400",
            icon: TrendingUp,
            iconBg:
              "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
          },
          {
            label: "Paying Customers",
            value: String(uniqueCustomers),
            accent: "text-slate-900 dark:text-white",
            icon: Users,
            iconBg:
              "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-extrabold sm:text-2xl",
                      stat.accent
                    )}
                  >
                    {isLoading ? "—" : stat.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "hidden h-10 w-10 items-center justify-center rounded-xl sm:flex",
                    stat.iconBg
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {filteredTransactions.length}
          </span>{" "}
          of {transactions.length} transactions
        </p>

        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, user, tech, or txn ID..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Receipt className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {transactions.length === 0
                ? "No transactions recorded yet"
                : "No matching transactions"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {transactions.length === 0
                ? "Completed Stripe payments from customers will appear here automatically."
                : "Try adjusting or clearing your search query."}
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="pr-6 text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((payment, index) => (
                  <TableRow
                    key={payment._id || index}
                    className="border-slate-100 transition-colors hover:bg-indigo-50/30 dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                  >
                    <TableCell className="py-4 pl-6">
                      <p className="max-w-[180px] truncate font-semibold text-slate-900 dark:text-white">
                        {payment.serviceTitle}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-1 inline-flex items-center gap-1 rounded-full border-emerald-200 bg-emerald-50 px-2 py-0 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Paid
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {payment.customerName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.customerEmail}
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {payment.technicianName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {payment.technicianEmail}
                      </p>
                    </TableCell>

                    <TableCell>
                      <button
                        type="button"
                        onClick={() => handleCopyTxn(payment.transactionId)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <span className="max-w-[115px] truncate">
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
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        {formatDate(payment.paidAt)}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                      ${Number(payment.amount).toFixed(2)}{" "}
                      <span className="text-[10px] font-medium text-slate-400 uppercase">
                        {payment.currency || "usd"}
                      </span>
                    </TableCell>

                    <TableCell className="pr-6 text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredTransactions.map((payment, index) => (
              <Card
                key={payment._id || index}
                className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900 dark:text-white">
                      {payment.serviceTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {payment.customerName} → {payment.technicianName}
                    </p>
                  </div>
                  <span className="shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${Number(payment.amount).toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800">
                  <span>{formatDate(payment.paidAt)}</span>
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
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Full Transaction Receipt Modal */}
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
                  Transaction Details
                </DialogTitle>
                <DialogDescription className="text-center text-xs">
                  Paid on {formatDateTime(selectedReceipt.paidAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                <div className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                    Service
                  </span>
                  <span className="text-right font-semibold text-slate-900 dark:text-white">
                    {selectedReceipt.serviceTitle}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <User className="h-3.5 w-3.5 text-indigo-500" />
                    Customer
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedReceipt.customerName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedReceipt.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <User className="h-3.5 w-3.5 text-violet-500" />
                    Technician
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedReceipt.technicianName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedReceipt.technicianEmail}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-500">
                    <Hash className="h-3.5 w-3.5 text-indigo-500" />
                    Booking ID
                  </span>
                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                    {selectedReceipt.bookingId}
                  </span>
                </div>

                <div className="flex justify-between border-t border-slate-200 pt-3 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Total Paid
                  </span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${Number(selectedReceipt.amount).toFixed(2)}{" "}
                    <span className="text-xs uppercase">
                      {selectedReceipt.currency || "usd"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Stripe Transaction ID
                </p>
                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 px-3 py-2 font-mono text-[11px] dark:border-slate-800">
                  <span className="truncate">
                    {selectedReceipt.transactionId}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTxn(selectedReceipt.transactionId)}
                    className="ml-2 shrink-0 font-semibold text-indigo-600 hover:underline"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTransactionsPage;