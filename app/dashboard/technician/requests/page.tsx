"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Phone,
  User,
  Play,
  Check,
  DollarSign,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Booking, BookingStatus } from "@/types/fixmate";
import { technicianBookings, updateBookingStatus } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusBadgeConfig: Record<
  BookingStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  requested: {
    label: "Requested",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300",
    icon: CheckCircle2,
  },
  "in-progress": {
    label: "In Progress",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300",
    icon: Wrench,
  },
  completed: {
    label: "Completed",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
    icon: XCircle,
  },
  rejected: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
    icon: AlertCircle,
  },
};

const filterTabs: { label: string; value: "all" | BookingStatus }[] = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
];

const formatDate = (date: string | Date) => {
  if (typeof date === "string") return date.split("T")[0];
  return date.toISOString().split("T")[0];
};

const TechnicianBookingsPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const technicianEmail = session?.user?.email;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>(
    "all"
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectingBooking, setRejectingBooking] = useState<Booking | null>(
    null
  );
  const [completingBooking, setCompletingBooking] = useState<Booking | null>(
    null
  );
  const [finalAmountInput, setFinalAmountInput] = useState<string>("");

  const isLoading =
    isSessionLoading || (Boolean(technicianEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !technicianEmail) return;

    let isMounted = true;

    const loadJobs = async () => {
      try {
        const data = await technicianBookings(technicianEmail);
        if (isMounted) setBookings(data);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Could not load job requests.";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadJobs();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, technicianEmail]);

  const handleStatusChange = async (
    booking: Booking,
    nextStatus: BookingStatus,
    finalAmount?: number
  ) => {
    if (!booking._id) return;
    setUpdatingId(booking._id);
    try {
      await updateBookingStatus(booking._id, {
        status: nextStatus,
        ...(finalAmount !== undefined ? { finalAmount } : {}),
      });

      setBookings((prev) =>
        prev.map((item) =>
          item._id === booking._id
            ? {
                ...item,
                status: nextStatus,
                ...(finalAmount !== undefined ? { finalAmount } : {}),
              }
            : item
        )
      );

      const statusMessages: Partial<Record<BookingStatus, string>> = {
        accepted: "Request accepted! Customer has been notified.",
        "in-progress": "Job marked as In Progress.",
        completed: "Job completed! Stripe payment is now unlocked for the customer.",
        rejected: "Repair request rejected.",
      };

      toast.success(statusMessages[nextStatus] || "Status updated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update job status.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const openCompleteModal = (booking: Booking) => {
    setCompletingBooking(booking);
    setFinalAmountInput(String(booking.finalAmount ?? booking.basePrice));
  };

  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingBooking) return;

    const parsedAmount = Number(finalAmountInput);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid final amount greater than $0.");
      return;
    }

    await handleStatusChange(completingBooking, "completed", parsedAmount);
    setCompletingBooking(null);
  };

  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;
    await handleStatusChange(rejectingBooking, "rejected");
    setRejectingBooking(null);
  };

  const filteredBookings =
    activeFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeFilter);

  // Stats
  const pendingCount = bookings.filter((b) => b.status === "requested").length;
  const activeCount = bookings.filter((b) =>
    ["accepted", "in-progress"].includes(b.status)
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const paidEarnings = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0), 0);

  const renderActionButtons = (booking: Booking) => {
    const isBusy = updatingId === booking._id;

    if (booking.status === "requested") {
      return (
        <>
          <Button
            type="button"
            size="sm"
            disabled={isBusy}
            onClick={() => handleStatusChange(booking, "accepted")}
            className="h-8 rounded-full bg-indigo-600 px-3 text-xs font-semibold text-white hover:bg-indigo-700"
          >
            {isBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Check className="mr-1 h-3.5 w-3.5" />
                Accept
              </>
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={isBusy}
            onClick={() => setRejectingBooking(booking)}
            className="h-8 rounded-full border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400"
          >
            Reject
          </Button>
        </>
      );
    }

    if (booking.status === "accepted") {
      return (
        <Button
          type="button"
          size="sm"
          disabled={isBusy}
          onClick={() => handleStatusChange(booking, "in-progress")}
          className="h-8 rounded-full bg-violet-600 px-3.5 text-xs font-semibold text-white hover:bg-violet-700"
        >
          {isBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <Play className="mr-1 h-3.5 w-3.5" />
              Start Work
            </>
          )}
        </Button>
      );
    }

    if (booking.status === "in-progress") {
      return (
        <Button
          type="button"
          size="sm"
          disabled={isBusy}
          onClick={() => openCompleteModal(booking)}
          className="h-8 rounded-full bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          {isBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Mark Completed
            </>
          )}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Briefcase className="h-3.5 w-3.5" />
          Technician Workspace
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Job Requests & Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Accept customer requests, update live repair progress, and mark jobs
          complete to unlock payment.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "New Requests",
            value: pendingCount,
            accent: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Active Jobs",
            value: activeCount,
            accent: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Completed",
            value: completedCount,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Paid Earnings",
            value: `$${paidEarnings.toFixed(2)}`,
            accent: "text-slate-900 dark:text-white",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950/80"
          >
            <CardContent className="p-4">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className={cn("mt-1 text-2xl font-extrabold", stat.accent)}>
                {isLoading ? "—" : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
              activeFilter === tab.value
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="space-y-4">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-4">
                <Skeleton className="h-12 w-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      ) : filteredBookings.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wrench className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No job requests found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {activeFilter === "all"
                ? "When customers book your approved services, their requests will appear here."
                : `You have no bookings with status "${activeFilter}".`}
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
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => {
                  const statusInfo =
                    statusBadgeConfig[booking.status] ||
                    statusBadgeConfig.requested;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow
                      key={booking._id ?? `${booking.serviceId}-${index}`}
                      className="border-slate-100 transition-colors hover:bg-indigo-50/30 dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceTitle}
                            className="h-11 w-14 shrink-0 rounded-xl border border-slate-200/80 object-cover dark:border-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {booking.serviceTitle}
                            </p>
                            <span className="text-xs text-slate-500">
                              {booking.category}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.customerPhone}
                        </p>
                      </TableCell>

                      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {formatDate(booking.preferredDate)}
                        </span>
                      </TableCell>

                      <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                        ${booking.finalAmount ?? booking.basePrice}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            statusInfo.className
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            booking.paymentStatus === "paid"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                          )}
                        >
                          {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                        </Badge>
                      </TableCell>

                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                            aria-label="View job details"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {renderActionButtons(booking)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredBookings.map((booking, index) => {
              const statusInfo =
                statusBadgeConfig[booking.status] ||
                statusBadgeConfig.requested;
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={booking._id ?? `${booking.serviceId}-${index}`}
                  className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {booking.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Customer: {booking.customerName}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full text-xs font-semibold",
                        statusInfo.className
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                      {formatDate(booking.preferredDate)}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${booking.finalAmount ?? booking.basePrice}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedBooking(booking)}
                      className="h-8 rounded-full px-3 text-xs"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Details
                    </Button>
                    <div className="flex items-center gap-2">
                      {renderActionButtons(booking)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Job Details Modal */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-lg">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedBooking.serviceTitle}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Requested for {formatDate(selectedBooking.preferredDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div>
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">Service Address</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      {selectedBooking.address}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">
                    Customer Problem Description
                  </p>
                  <p className="rounded-2xl border border-slate-200/80 p-3.5 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {selectedBooking.problemDescription}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Job & Confirm Final Amount Modal */}
      <Dialog
        open={Boolean(completingBooking)}
        onOpenChange={(open) => {
          if (!open) setCompletingBooking(null);
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          {completingBooking && (
            <form onSubmit={handleConfirmComplete}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Complete Repair & Set Final Bill
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Confirm the final amount for{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {completingBooking.serviceTitle}
                  </span>
                  . Once marked completed, {completingBooking.customerName} will
                  be able to pay via Stripe.
                </DialogDescription>
              </DialogHeader>

              <div className="my-5 space-y-2">
                <Label htmlFor="final-amount">Final Amount (USD)</Label>
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="final-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={finalAmountInput}
                    onChange={(e) => setFinalAmountInput(e.target.value)}
                    className="h-11 rounded-xl pl-9 text-base font-bold"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Base estimate: ${completingBooking.basePrice}
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCompletingBooking(null)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={Boolean(updatingId)}
                  className="rounded-full bg-emerald-600 px-6 text-white hover:bg-emerald-700"
                >
                  {updatingId ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Completing...
                    </>
                  ) : (
                    "Confirm & Complete"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={Boolean(rejectingBooking)}
        onOpenChange={(open) => {
          if (!open) setRejectingBooking(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this repair request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject the request from{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {rejectingBooking?.customerName}
              </span>{" "}
              for {rejectingBooking?.serviceTitle}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmReject();
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TechnicianBookingsPage;