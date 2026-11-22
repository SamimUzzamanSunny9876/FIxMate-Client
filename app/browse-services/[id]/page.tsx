import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Home,
  Store,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Mail,
  Wrench,
  Sparkles,
} from "lucide-react";
import { getServiceDetails } from "@/lib/api/services";
import { RepairService } from "@/types/fixmate";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RequestRepairModal } from "@/app/components/RequestRepairModal";

interface ServiceDetailsResponse extends RepairService {
  technicianImage?: string;
  technicianArea?: string;
  technicianBio?: string;
}

const ServiceDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const details: ServiceDetailsResponse | null = await getServiceDetails({
    id,
  });

  // Show 404 if service does not exist or is not approved/available
  if (
    !details ||
    !details._id ||
    details.approvalStatus !== "approved" ||
    !details.isAvailable
  ) {
    notFound();
  }

  const techInitials = (details.technicianName || "T")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section className="relative mx-auto min-h-[85vh] w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Subtle Background Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-80 max-w-4xl rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />

      {/* Back Navigation */}
      <div className="mb-6 animate-in fade-in slide-in-from-left-3 duration-400">
        <Link
          href="/browse-services"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-2xs backdrop-blur-md transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back to Services
        </Link>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Hero Image, Details & Technician Summary */}
        <div className="space-y-6 lg:col-span-8">
          {/* Large Hero Image Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500 dark:border-slate-800 dark:bg-slate-900">
            <img
              src={details.image}
              alt={details.title}
              className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80 md:h-[420px]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-md hover:bg-white dark:bg-slate-900/90 dark:text-white">
                {details.category}
              </Badge>
              <Badge className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/95 px-3.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-md hover:bg-indigo-600">
                {details.serviceMode === "Home Visit" ? (
                  <Home className="h-3.5 w-3.5" />
                ) : (
                  <Store className="h-3.5 w-3.5" />
                )}
                {details.serviceMode}
              </Badge>
            </div>

            {/* Bottom Title Overlay on Desktop/Tablet */}
            <div className="absolute right-5 bottom-5 left-5">
              <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                {details.title}
              </h1>
            </div>
          </div>

          {/* Quick Info Pills Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 uppercase">
                    Est. Duration
                  </p>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {details.estimatedDuration}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                  {details.serviceMode === "Home Visit" ? (
                    <Home className="h-5 w-5" />
                  ) : (
                    <Store className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 uppercase">
                    Service Mode
                  </p>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {details.serviceMode}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-950/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-slate-400 uppercase">
                    Service Area
                  </p>
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {details.serviceArea}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Description */}
          <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 dark:border-slate-800 dark:bg-slate-950/80">
            <CardContent className="space-y-4 p-6 sm:p-7">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  What&apos;s Included in This Service
                </h2>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
                {details.description}
              </p>
            </CardContent>
          </Card>

          {/* Technician Summary Card */}
          <Card className="rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 dark:border-slate-800 dark:bg-slate-950/80">
            <CardContent className="p-6 sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  About the Technician
                </h2>
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Pro
                </Badge>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {details.technicianImage ? (
                  <img
                    src={details.technicianImage}
                    alt={details.technicianName}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white shadow-md shadow-indigo-500/20">
                    {techInitials}
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {details.technicianName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        {details.technicianArea || details.serviceArea}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-indigo-500" />
                        {details.technicianEmail}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {details.technicianBio ||
                      `Certified ${details.category} repair specialist serving ${details.serviceArea}. Committed to transparent diagnostics, reliable repairs, and on-time completion.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sticky Booking & Trust Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_-20px_rgba(79,70,229,0.2)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
            <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-violet-50/80 px-6 py-5 dark:border-slate-800 dark:from-indigo-950/40 dark:to-violet-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  Starting Price
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 shadow-2xs dark:bg-slate-900 dark:text-indigo-300">
                  <Sparkles className="h-3 w-3" />
                  Pay After Service
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
                  ${details.basePrice}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  USD base estimate
                </span>
              </div>
            </div>

            <CardContent className="space-y-5 p-6">
              {/* Role-Restricted Request Button + Modal */}
              <RequestRepairModal service={details} />

              {/* Trust Highlights */}
              <div className="space-y-3 border-t border-slate-100 pt-4 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      Zero upfront payment:
                    </strong>{" "}
                    Pay securely with Stripe only after your repair is marked
                    completed.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      Live status tracking:
                    </strong>{" "}
                    Follow your job from Requested to Completed right from your
                    dashboard.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">
                      Free cancellation:
                    </strong>{" "}
                    Cancel anytime while your request is still in{" "}
                    <em>Requested</em> status.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsPage;