"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Wrench,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { RepairService, UserRole } from "@/types/fixmate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { customerBookingService } from "@/lib/actions/services";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

interface RequestRepairModalProps {
  service: RepairService;
}

export function RequestRepairModal({ service }: RequestRepairModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as
    | { name?: string; email?: string; role?: UserRole }
    | undefined;
  const role = user?.role;

  const [open, setOpen] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const[today, setToday] = useState('')

  // Today's local date in YYYY-MM-DD format for date input min attribute
 

  const handleTriggerClick = () => {
  if (!session?.user) {
    router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    return;
  }

  // Compute local YYYY-MM-DD when opening the modal
  const now = new Date();
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  setToday(localToday);
  setBookingSuccess(false);
  setOpen(true);
};

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!customerPhone.trim() || customerPhone.trim().length < 7) {
      nextErrors.customerPhone = "Please enter a valid phone number.";
    }
    if (!address.trim() || address.trim().length < 5) {
      nextErrors.address = "Please enter your service or pickup address.";
    }
    if (!preferredDate) {
      nextErrors.preferredDate = "Please select a preferred date.";
    } else if (preferredDate < today) {
      nextErrors.preferredDate = "Preferred date must be today or in the future.";
    }
    if (!problemDescription.trim() || problemDescription.trim().length < 20) {
      nextErrors.problemDescription =
        "Please describe the issue in at least 20 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const booking = {
        serviceId: service._id,
        serviceTitle: service.title,
        serviceImage: service.image,
        category: service.category,
        basePrice: service.basePrice,
        finalAmount: service.basePrice,
        technicianName: service.technicianName,
        technicianEmail: service.technicianEmail,
        customerName: user?.name || "",
        customerEmail: user?.email || "",
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
        status: "requested" as const,
        paymentStatus: "unpaid" as const ,
      };

      const customerBooking = await customerBookingService(booking)

     

      toast.success("Repair request sent! Track your job in My Bookings.");
      setBookingSuccess(true);
      setCustomerPhone("");
      setAddress("");
      setPreferredDate("");
      setProblemDescription("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting your request.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Technician or Admin notice
  if (!isPending && session?.user && role !== "customer") {
    return (
      <div className="space-y-3">
        <Button
          type="button"
          disabled
          className="h-12 w-full rounded-2xl bg-slate-200 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          <Wrench className="mr-2 h-4 w-4" />
          Request Repair
        </Button>
        <div className="flex items-start gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-3 text-xs text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Only customers can request a repair.</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        type="button"
        disabled={isPending}
        onClick={handleTriggerClick}
        className="h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/40 active:translate-y-0"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking session...
          </>
        ) : !session?.user ? (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In to Request Repair
          </>
        ) : (
          <>
            <Wrench className="mr-2 h-4 w-4" />
            Request Repair
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {bookingSuccess ? (
            <div className="flex flex-col items-center py-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                Repair Request Submitted!
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Your request for{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {service.title}
                </span>{" "}
                has been sent to {service.technicianName}. You only pay after
                the repair is completed.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="rounded-full"
                >
                  Close
                </Button>
                <Link
                  href="/dashboard/customer/bookings"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25"
                >
                  Go to My Bookings
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Request Repair Service
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Book{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {service.title}
                  </span>{" "}
                  (Starting at ${service.basePrice}). Pay online only after the
                  job is completed.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-2">
                {/* Read-Only Customer Info */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="req-name" className="text-xs text-slate-500">
                      Your Name
                    </Label>
                    <Input
                      id="req-name"
                      value={user?.name || ""}
                      readOnly
                      disabled
                      className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="req-email" className="text-xs text-slate-500">
                      Your Email
                    </Label>
                    <Input
                      id="req-email"
                      value={user?.email || ""}
                      readOnly
                      disabled
                      className="h-10 rounded-xl bg-slate-50 dark:bg-slate-900"
                    />
                  </div>
                </div>

                {/* Phone & Preferred Date */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="req-phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="req-phone"
                        type="tel"
                        placeholder="+880 1XXX-XXXXXX"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (errors.customerPhone)
                            setErrors({ ...errors, customerPhone: "" });
                        }}
                        className={cn(
                          "h-10 rounded-xl pl-9",
                          errors.customerPhone && "border-red-400"
                        )}
                      />
                    </div>
                    {errors.customerPhone && (
                      <p className="text-xs text-red-500">
                        {errors.customerPhone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="req-date">
                      Preferred Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="req-date"
                        type="date"
                        min={today}
                        value={preferredDate}
                        onChange={(e) => {
                          setPreferredDate(e.target.value);
                          if (errors.preferredDate)
                            setErrors({ ...errors, preferredDate: "" });
                        }}
                        className={cn(
                          "h-10 rounded-xl pl-9",
                          errors.preferredDate && "border-red-400"
                        )}
                      />
                    </div>
                    {errors.preferredDate && (
                      <p className="text-xs text-red-500">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="req-address">
                    Service / Pickup Address{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="req-address"
                      placeholder="House, Road, Area (e.g. House 12, Road 4, Dhanmondi)"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address)
                          setErrors({ ...errors, address: "" });
                      }}
                      className={cn(
                        "h-10 rounded-xl pl-9",
                        errors.address && "border-red-400"
                      )}
                    />
                  </div>
                  {errors.address && (
                    <p className="text-xs text-red-500">{errors.address}</p>
                  )}
                </div>

                {/* Problem Description (min 20 chars) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="req-problem">
                      Problem Description{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <span
                      className={cn(
                        "text-[11px]",
                        problemDescription.trim().length >= 20
                          ? "text-emerald-600"
                          : "text-slate-400"
                      )}
                    >
                      {problemDescription.trim().length}/20 min chars
                    </span>
                  </div>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="req-problem"
                      rows={4}
                      placeholder="Describe the device model and what went wrong (at least 20 characters)..."
                      value={problemDescription}
                      onChange={(e) => {
                        setProblemDescription(e.target.value);
                        if (errors.problemDescription)
                          setErrors({ ...errors, problemDescription: "" });
                      }}
                      className={cn(
                        "resize-none rounded-xl pl-9",
                        errors.problemDescription && "border-red-400"
                      )}
                    />
                  </div>
                  {errors.problemDescription && (
                    <p className="text-xs text-red-500">
                      {errors.problemDescription}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => setOpen(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white shadow-md shadow-indigo-500/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Confirm Request"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}