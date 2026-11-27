import React from "react";
import Link from "next/link";
import {
  Search,
  ClipboardCheck,
  Wrench,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Sparkles,
  FileText,
  XCircle,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Browse Verified Services",
    description:
      "Search by device category, service area, or mode (Home Visit or Shop Drop-off). Every listing is reviewed and approved by FixMate admins before going live.",
    icon: Search,
    accent:
      "from-indigo-500 to-violet-600 shadow-indigo-500/25 text-white",
    tag: "Admin Approved",
  },
  {
    number: "02",
    title: "Send a Repair Request",
    description:
      "Describe the issue, pick your preferred date, and share your address. Need to change plans? You can cancel anytime while the request is still pending.",
    icon: ClipboardCheck,
    accent:
      "from-sky-500 to-indigo-600 shadow-sky-500/25 text-white",
    tag: "Zero Upfront Fee",
  },
  {
    number: "03",
    title: "Track Live Progress",
    description:
      "Your technician moves the job step by step—Accepted, In Progress, and Completed—so you always know exactly what is happening with your device.",
    icon: Wrench,
    accent:
      "from-amber-500 to-orange-600 shadow-amber-500/25 text-white",
    tag: "Real-Time Status",
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Once the repair is finished and the technician sets the final amount, pay securely via Stripe Checkout and download your PDF invoice instantly.",
    icon: CreditCard,
    accent:
      "from-emerald-500 to-teal-600 shadow-emerald-500/25 text-white",
    tag: "Stripe Protected",
  },
];

const pipelineStages = [
  {
    label: "Requested",
    owner: "Customer submits",
    desc: "Cancellable by customer",
    dot: "bg-amber-500",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    label: "Accepted",
    owner: "Technician confirms",
    desc: "Schedule locked in",
    dot: "bg-sky-500",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/60 dark:bg-sky-950/50 dark:text-sky-300",
  },
  {
    label: "In Progress",
    owner: "Technician repairs",
    desc: "Work actively underway",
    dot: "bg-indigo-500",
    badge:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  {
    label: "Completed",
    owner: "Final bill set",
    desc: "Pay Now unlocked",
    dot: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    label: "Paid",
    owner: "Stripe verified",
    desc: "PDF invoice ready",
    dot: "bg-violet-500",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300",
  },
];

const faqs = [
  {
    q: "Do I have to pay anything when submitting a repair request?",
    a: "No. FixMate follows a strict pay-after-service model. The Pay Now button only unlocks after the technician finishes the repair and marks the job Completed.",
    icon: Lock,
  },
  {
    q: "Can I cancel a booking if I change my mind?",
    a: "Yes. Customers can cancel any booking directly from My Bookings while its status is still Requested. Once a technician accepts and starts the job, cancellations are locked.",
    icon: XCircle,
  },
  {
    q: "How are technicians and services verified?",
    a: "Every new or edited repair listing stays Pending until a FixMate Admin reviews and approves it. Unapproved or unavailable services never appear on public pages.",
    icon: UserCheck,
  },
  {
    q: "Will I receive a receipt after paying?",
    a: "Yes. Every Stripe Checkout payment is recorded in your Payment History with a unique transaction ID and a one-click downloadable PDF invoice.",
    icon: FileText,
  },
];

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] transition-colors duration-300 dark:bg-slate-950">
      {/* Ambient Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-200/45 via-sky-200/35 to-emerald-100/35 blur-3xl dark:from-indigo-950/50 dark:via-violet-950/30 dark:to-slate-950" />
        <div className="absolute top-1/2 -left-24 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-violet-200/35 via-indigo-100/25 to-transparent blur-3xl dark:from-violet-950/40 dark:via-indigo-950/20 dark:to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 text-center sm:px-6 sm:pt-20 lg:px-8">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Badge
            variant="secondary"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-indigo-50/90 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Simple, Transparent Repair Workflow
          </Badge>
        </div>

        <h1 className="mx-auto mt-5 max-w-3xl animate-in text-3xl font-extrabold tracking-tight text-slate-900 duration-700 fade-in slide-in-from-bottom-4 sm:text-5xl dark:text-white">
          From Broken Device to{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-emerald-400">
            Verified Fix
          </span>{" "}
          in 4 Clear Steps
        </h1>

        <p className="mx-auto mt-4 max-w-2xl animate-in text-base leading-relaxed text-slate-600 duration-700 delay-100 fade-in slide-in-from-bottom-4 sm:text-lg dark:text-slate-400">
          No guessing what is happening with your device and no paying before
          the work is done. Track every milestone and pay securely only after
          completion.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <Link
            href="/browse-services"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
          >
            Browse Services
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:text-indigo-400"
          >
            Join as a Technician
          </Link>
        </div>
      </section>

      {/* 4-Step Visual Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                style={{ animationDelay: `${index * 90}ms` }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-2xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-700"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${step.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-200 transition-colors group-hover:text-indigo-200 dark:text-slate-800 dark:group-hover:text-indigo-900">
                      {step.number}
                    </span>
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h2>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {step.tag}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Strict Job Status Pipeline Showcase */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md sm:p-10 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
              <Clock className="h-3.5 w-3.5" />
              Server-Enforced Pipeline
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Every Job Moves Forward One Verified Step at a Time
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Our backend strictly validates every status change so no step can
              be skipped and payment is impossible until work is actually done.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {pipelineStages.map((stage, idx) => (
              <div
                key={stage.label}
                className="relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-indigo-700 dark:hover:bg-slate-950"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${stage.badge}`}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${stage.dot}`}
                      />
                      {stage.label}
                    </Badge>
                    <span className="text-xs font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
                    {stage.owner}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* For Customers vs For Technicians */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-2xs transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
            <Badge className="rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300">
              For Customers
            </Badge>
            <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
              Stress-Free Repairs, Zero Risk
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                "Filter services by category, service mode, and price",
                "Cancel any request while it is still awaiting acceptance",
                "Pay via Stripe only after your technician completes the job",
                "Download official PDF invoices anytime from Payment History",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/browse-services"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Find a repair service
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>

          <Card className="rounded-3xl border border-slate-200/80 bg-white/90 p-7 shadow-2xs transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80">
            <Badge className="rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300">
              For Technicians
            </Badge>
            <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
              Grow Your Repair Business Online
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              {[
                "Publish detailed repair listings with custom photos and pricing",
                "Toggle service availability on or off whenever your schedule fills",
                "Accept or reject incoming requests from one clean workspace",
                "Set the final repair amount upon completion and get paid via Stripe",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Create a technician account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Quick answers about bookings, verification, and payments.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {faqs.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.q}
                className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-800"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-8 text-center text-white shadow-xl shadow-indigo-500/20 sm:p-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
            Ready to get your device fixed?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-indigo-100">
            Browse admin-approved technicians across Dhaka and book your repair
            in under two minutes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/browse-services"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-indigo-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Explore Repair Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}