"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Wrench,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Phone,
  User,
  Search,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Booking, BookingStatus } from "@/types/fixmate";

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
import { customerBookings } from "@/lib/api/services";
import { cancelCustomerBooking } from "@/lib/actions/services";

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

const formatDate = (date: string | Date) => {
  if (typeof date === "string") return date.split("T")[0];
  return date.toISOString().split("T")[0];
};

const CustomerBookingPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const customerEmail = session?.user?.email;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(
    null
  );
  const [isCancelling, setIsCancelling] = useState(false);

  const isLoading = isSessionLoading || (Boolean(customerEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !customerEmail) return;

    let isMounted = true;

    const loadBookings = async () => {
      try {
        const data = await customerBookings(customerEmail);
        if (isMounted) setBookings(data);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Could not load bookings.";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadBookings();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, customerEmail]);

  const handleConfirmCancel = async () => {
    if (!cancellingBooking?._id) return;
    setIsCancelling(true);
    try {
      await cancelCustomerBooking(cancellingBooking._id);
      setBookings((prev) =>
        prev.map((item) =>
          item._id === cancellingBooking._id
            ? { ...item, status: "cancelled" }
            : item
        )
      );
      toast.success(
        `Booking for "${cancellingBooking.serviceTitle}" cancelled.`
      );
      setCancellingBooking(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel booking.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  // Summary counts
  const totalCount = bookings.length;
  const activeCount = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const unpaidCompletedCount = bookings.filter(
    (b) => b.status === "completed" && b.paymentStatus === "unpaid"
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <ClipboardList className="h-3.5 w-3.5" />
            Repair Tracker
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your repair requests, cancel pending orders, or pay once work
            is completed.
          </p>
        </div>

        <Link
          href="/browse-services"
          className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
        >
          <Search className="mr-2 h-4 w-4" />
          Browse Services
        </Link>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Bookings",
            value: totalCount,
            accent: "text-slate-900 dark:text-white",
          },
          {
            label: "Active Requests",
            value: activeCount,
            accent: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Completed",
            value: completedCount,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Ready to Pay",
            value: unpaidCompletedCount,
            accent: "text-amber-600 dark:text-amber-400",
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

      {/* Main Content */}
      {isLoading ? (
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center gap-4">
                <Skeleton className="h-14 w-20 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      ) : bookings.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center animate-in fade-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wrench className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No repair bookings yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Need a device or appliance fixed? Browse verified technicians and
              request your first repair.
            </p>
            <Link
              href="/browse-services"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25"
            >
              Explore Repair Services
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_12px_40px_-15px_rgba(79,70,229,0.08)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 md:block dark:border-slate-800 dark:bg-slate-950/80">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
                <TableRow className="border-slate-200/70 dark:border-slate-800">
                  <TableHead className="pl-6">Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => {
                  const statusInfo =
                    statusBadgeConfig[booking.status] ||
                    statusBadgeConfig.requested;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow
                      key={booking._id ?? `${booking.serviceId}-${index}`}
                      style={{ animationDelay: `${index * 45}ms` }}
                      className="group border-slate-100 transition-colors hover:bg-indigo-50/30 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      {/* Service Info */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceTitle}
                            className="h-12 w-16 shrink-0 rounded-xl border border-slate-200/80 object-cover transition-transform duration-300 group-hover:scale-105 dark:border-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {booking.serviceTitle}
                            </p>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {booking.category}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Technician */}
                      <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {booking.technicianName}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {formatDate(booking.preferredDate)}
                        </span>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                        ${booking.finalAmount ?? booking.basePrice}
                      </TableCell>

                      {/* Status */}
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

                      {/* Payment */}
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

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                            aria-label="View booking details"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {booking.status === "requested" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setCancellingBooking(booking)}
                              className="h-8 rounded-full border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                            >
                              Cancel
                            </Button>
                          )}

                          {booking.status === "completed" &&
                            booking.paymentStatus === "unpaid" && (
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  toast.info(
                                    "Stripe payment checkout coming next!"
                                  )
                                }
                                className="h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 text-xs font-semibold text-white shadow-sm"
                              >
                                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                                Pay Now
                              </Button>
                            )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {bookings.map((booking, index) => {
              const statusInfo =
                statusBadgeConfig[booking.status] ||
                statusBadgeConfig.requested;
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={booking._id ?? `${booking.serviceId}-${index}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300 fill-mode-both dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="relative h-36 w-full">
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle}
                      className="h-full w-full object-cover"
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full text-xs font-semibold backdrop-blur-md",
                        statusInfo.className
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {booking.serviceTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Tech: {booking.technicianName}
                        </p>
                      </div>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${booking.finalAmount ?? booking.basePrice}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                        {formatDate(booking.preferredDate)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        {booking.address}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
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
                        {booking.status === "requested" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => setCancellingBooking(booking)}
                            className="h-8 rounded-full px-3 text-xs"
                          >
                            Cancel
                          </Button>
                        )}
                        {booking.status === "completed" &&
                          booking.paymentStatus === "unpaid" && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                toast.info(
                                  "Stripe payment checkout coming next!"
                                )
                              }
                              className="h-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 text-xs text-white"
                            >
                              <CreditCard className="mr-1 h-3.5 w-3.5" />
                              Pay Now
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Booking Details Modal */}
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
                  {selectedBooking.category} • Scheduled for{" "}
                  {formatDate(selectedBooking.preferredDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div>
                    <p className="text-xs text-slate-400">Technician</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.technicianName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Amount</p>
                    <p className="mt-0.5 text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                      ${selectedBooking.finalAmount ?? selectedBooking.basePrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Contact Phone</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      <span className="truncate">{selectedBooking.address}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">
                    Problem Description
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={Boolean(cancellingBooking)}
        onOpenChange={(open) => {
          if (!open) setCancellingBooking(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this repair request?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your booking for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {cancellingBooking?.serviceTitle}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isCancelling}
              className="rounded-full"
            >
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isCancelling}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmCancel();
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerBookingPage;