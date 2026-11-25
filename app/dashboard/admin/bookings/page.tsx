"use client";

import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wrench,
  Search,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Phone,
  User,
  Loader2,
  SlidersHorizontal,
  Check,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Booking, BookingStatus } from "@/types/fixmate";
import {
  getAllBookings,
  adminUpdateBookingStatus,
  adminDeleteBooking,
} from "@/lib/api/admin";
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
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

const allStatuses: BookingStatus[] = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "cancelled",
  "rejected",
];

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

const AdminAllBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | BookingStatus>(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [nextStatus, setNextStatus] = useState<BookingStatus>("requested");
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const data = await getAllBookings();
        if (isMounted) setBookings(data);
      } catch (err) {
        if (isMounted) {
          toast.error(
            err instanceof Error ? err.message : "Could not load bookings."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const openStatusModal = (booking: Booking) => {
    setEditingBooking(booking);
    setNextStatus(booking.status);
  };

  const handleSaveStatus = async () => {
    if (!editingBooking?._id) return;
    setIsSubmitting(true);
    try {
      await adminUpdateBookingStatus(editingBooking._id, nextStatus);
      setBookings((prev) =>
        prev.map((item) =>
          item._id === editingBooking._id
            ? { ...item, status: nextStatus }
            : item
        )
      );
      toast.success(`Booking status updated to "${nextStatus}".`);
      setEditingBooking(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update booking status."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingBooking?._id) return;
    setIsSubmitting(true);
    try {
      await adminDeleteBooking(deletingBooking._id);
      setBookings((prev) =>
        prev.filter((item) => item._id !== deletingBooking._id)
      );
      toast.success(`Deleted booking for "${deletingBooking.serviceTitle}".`);
      setDeletingBooking(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Summary metrics
  const totalBookings = bookings.length;
  const activeCount = bookings.filter((b) =>
    ["requested", "accepted", "in-progress"].includes(b.status)
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const paidVolume = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + Number(b.finalAmount ?? b.basePrice ?? 0), 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesTab = activeFilter === "all" || b.status === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.serviceTitle?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q) ||
      b.customerEmail?.toLowerCase().includes(q) ||
      b.technicianName?.toLowerCase().includes(q) ||
      b.technicianEmail?.toLowerCase().includes(q) ||
      b.category?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <ClipboardList className="h-3.5 w-3.5" />
          Platform Bookings
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          All Bookings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Monitor every repair request across FixMate, inspect timelines, or
          intervene on booking statuses.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Bookings",
            value: totalBookings,
            accent: "text-slate-900 dark:text-white",
          },
          {
            label: "Active / Pending",
            value: activeCount,
            accent: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Completed",
            value: completedCount,
            accent: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Paid Volume",
            value: `$${paidVolume.toFixed(2)}`,
            accent: "text-emerald-600 dark:text-emerald-400",
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

      {/* Filter Pills + Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                activeFilter === tab.value
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service, customer, or tech..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-950/80">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((row) => (
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
              <ClipboardList className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No bookings found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {bookings.length === 0
                ? "No customer bookings have been placed on the platform yet."
                : "Try switching status tabs or clearing your search query."}
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
                      key={booking._id ?? index}
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
                            <p className="max-w-[190px] truncate font-semibold text-slate-900 dark:text-white">
                              {booking.serviceTitle}
                            </p>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="h-3 w-3 text-indigo-500" />
                              {formatDate(booking.preferredDate)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {booking.customerName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.customerEmail}
                        </p>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {booking.technicianName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {booking.technicianEmail}
                        </p>
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
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedBooking(booking)}
                            aria-label="Inspect booking"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => openStatusModal(booking)}
                            aria-label="Update status"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300"
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingBooking(booking)}
                            aria-label="Delete booking"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredBookings.map((booking, index) => {
              const statusInfo =
                statusBadgeConfig[booking.status] ||
                statusBadgeConfig.requested;
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={booking._id ?? index}
                  className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-slate-900 dark:text-white">
                        {booking.serviceTitle}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {booking.customerName} → {booking.technicianName}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full text-xs font-semibold",
                        statusInfo.className
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDate(booking.preferredDate)}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${booking.finalAmount ?? booking.basePrice} (
                      {booking.paymentStatus})
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedBooking(booking)}
                      className="h-8 rounded-full px-2.5 text-xs"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      View
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => openStatusModal(booking)}
                      className="h-8 rounded-full px-2.5 text-xs text-indigo-600"
                    >
                      Status
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeletingBooking(booking)}
                      className="h-8 w-8 rounded-full text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Inspect Booking Details Modal */}
      <Dialog
        open={Boolean(selectedBooking)}
        onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
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

              <div className="space-y-4 pt-1 text-sm">
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div>
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.customerName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {selectedBooking.customerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Technician</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <Wrench className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.technicianName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {selectedBooking.technicianEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Customer Phone</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedBooking.customerPhone || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Amount & Payment</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <CreditCard className="h-3.5 w-3.5" />$
                      {selectedBooking.finalAmount ?? selectedBooking.basePrice}{" "}
                      ({selectedBooking.paymentStatus})
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs text-slate-400">Service Address</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      {selectedBooking.address || "—"}
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

                {selectedBooking.statusHistory &&
                  selectedBooking.statusHistory.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold text-slate-500 uppercase">
                        Status Timeline
                      </p>
                      <div className="space-y-2 rounded-2xl border border-slate-200/80 p-3.5 dark:border-slate-800">
                        {selectedBooking.statusHistory.map((entry, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                              {entry.status}
                            </span>
                            <span className="text-slate-500">
                              {formatDate(entry.changedAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Booking Status Modal */}
      <Dialog
        open={Boolean(editingBooking)}
        onOpenChange={(open) => {
          if (!open) setEditingBooking(null);
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          {editingBooking && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Override Booking Status
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Update status for{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {editingBooking.serviceTitle}
                  </span>{" "}
                  ({editingBooking.customerName}).
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2 py-2">
                {allStatuses.map((statusOption) => {
                  const info = statusBadgeConfig[statusOption];
                  const Icon = info.icon;
                  const isSelected = nextStatus === statusOption;

                  return (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setNextStatus(statusOption)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left text-xs font-semibold transition-all",
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/70 text-indigo-700 ring-1 ring-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" />
                        {info.label}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingBooking(null)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveStatus}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Status"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Booking Confirmation */}
      <AlertDialog
        open={Boolean(deletingBooking)}
        onOpenChange={(open) => {
          if (!open) setDeletingBooking(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete the booking for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingBooking?.serviceTitle}
              </span>{" "}
              by {deletingBooking?.customerName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAllBookingsPage;