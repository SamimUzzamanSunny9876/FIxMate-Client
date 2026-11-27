import React from "react";
import Link from "next/link";
import {
  Wrench,
  ShieldCheck,
  Users,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Zap,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCategory } from "@/types/fixmate";

const stats = [
  { label: "Repair Categories", value: "7+", accent: "text-indigo-600 dark:text-indigo-400" },
  { label: "Upfront Risk", value: "$0", accent: "text-emerald-600 dark:text-emerald-400" },
  { label: "Status Transparency", value: "100%", accent: "text-violet-600 dark:text-violet-400" },
  { label: "Stripe Protected", value: "24/7", accent: "text-sky-600 dark:text-sky-400" },
];

const values = [
  {
    title: "Pay Only After Completion",
    description:
      "We built FixMate around a simple rule: customers should never have to pay before seeing results. Stripe checkout opens only after the repair is completed.",
    icon: CreditCard,
    iconBg:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  },
  {
    title: "Admin-Moderated Services",
    description:
      "Every service listing—and every edit to an existing listing—is reviewed by our admin team so customers only browse genuine, clearly priced offerings.",
    icon: ShieldCheck,
    iconBg:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  },
  {
    title: "Real-Time Job Tracking",
    description:
      "No more calling repeatedly for updates. Every booking moves cleanly through Requested, Accepted, In Progress, Completed, and Paid.",
    icon: Clock,
    iconBg:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  },
  {
    title: "Built for Local Technicians",
    description:
      "Skilled independent technicians get a dedicated workspace to showcase their expertise, control availability, and manage incoming repair jobs effortlessly.",
    icon: Users,
    iconBg:
      "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  },
];

const categories: { name: ServiceCategory; icon: React.ElementType; desc: string }[] = [
  { name: "Smartphone", icon: Smartphone, desc: "Screens, batteries & charging ports" },
  { name: "Laptop & PC", icon: Laptop, desc: "Hardware upgrades, OS & board repair" },
  { name: "AC", icon: Wind, desc: "Servicing, gas refill & cooling fixes" },
  { name: "Refrigerator", icon: Sparkles, desc: "Compressor, thermostat & seal repair" },
  { name: "TV", icon: Tv, desc: "LED panels, backlight & audio fixes" },
  { name: "Washing Machine", icon: Wrench, desc: "Drainage, motor & drum servicing" },
  { name: "Electrical", icon: Zap, desc: "Wiring, switches & appliance safety" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] transition-colors duration-300 dark:bg-slate-950">
      {/* Ambient Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-28 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/45 via-violet-200/35 to-emerald-100/35 blur-3xl dark:from-indigo-950/50 dark:via-violet-950/30 dark:to-slate-950" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Badge
              variant="secondary"
              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50/90 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              <Wrench className="h-3.5 w-3.5" />
              About FixMate
            </Badge>
          </div>

          <h1 className="mt-5 animate-in text-3xl font-extrabold tracking-tight text-slate-900 duration-700 fade-in slide-in-from-bottom-4 sm:text-5xl dark:text-white">
            Bringing Trust & Clarity to{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Everyday Repairs
            </span>
          </h1>

          <p className="mt-4 animate-in text-base leading-relaxed text-slate-600 duration-700 delay-100 fade-in slide-in-from-bottom-4 sm:text-lg dark:text-slate-400">
            Finding a reliable technician for a broken smartphone, laptop, or
            home appliance should not feel like a gamble. FixMate connects
            customers with verified local technicians through transparent
            tracking and pay-after-completion security.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white/90 text-center shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
            >
              <CardContent className="p-5">
                <p className={`text-3xl font-extrabold ${stat.accent}`}>
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Story / Problem & Solution */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-10">
              <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                Why We Built FixMate
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Solving Both Sides of the Repair Experience
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Across Dhaka and beyond, people frequently hand over valuable
                devices without knowing when the repair will start, what it will
                cost, or whether the technician is trustworthy. Meanwhile,
                talented technicians have no structured platform to showcase
                their services and manage bookings professionally.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                FixMate bridges that gap with role-based dashboards for
                Customers, Technicians, and Admins—ensuring clear communication,
                verified listings, and Stripe-powered payments only after the
                work is delivered.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 bg-gradient-to-br from-indigo-50/90 via-violet-50/60 to-emerald-50/60 p-8 sm:p-10 dark:from-indigo-950/50 dark:via-violet-950/30 dark:to-slate-950">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                What Makes FixMate Different
              </h3>
              {[
                "Every public repair service is manually approved by an Admin",
                "Strict server-enforced status pipeline prevents skipped steps",
                "Home Visit and Shop Drop-off options clearly labeled upfront",
                "Instant PDF invoice downloads for every completed Stripe payment",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-3.5 text-sm text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Core Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Built Around Accountability
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Four core principles behind every feature on the platform.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {values.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="group rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-3 fill-mode-both dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-700"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${item.iconBg}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Categories We Cover */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              What We Repair
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Click any category to browse approved technicians immediately.
            </p>
          </div>
          <Link
            href="/browse-services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/browse-services?category=${encodeURIComponent(cat.name)}`}
                className="group block"
              >
                <Card className="h-full rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-2xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-400 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:group-hover:border-indigo-600">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/70 dark:text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {cat.desc}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Contact & CTA Section */}
      <section className="mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
                Have Questions? Reach Out Anytime.
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Whether you need help with a booking or want to onboard your
                repair shop onto FixMate, our support team is ready to help.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/browse-services"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Browse Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition-all hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-indigo-700"
                >
                  How It Works
                </Link>
              </div>
            </div>

            <div className="space-y-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 text-sm dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Office Address
                  </p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    House 24, Road 7, Dhanmondi, Dhaka 1205, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Phone
                  </p>
                  <a
                    href="tel:+8801861805137"
                    className="font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                  >
                    +880 1861805137
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase">
                    Email
                  </p>
                  <a
                    href="mailto:support@fixmate.com"
                    className="font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
                  >
                    support@fixmate.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}