import React from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  MapPin,
  User,
  ArrowRight,
  Wrench,
  Sparkles,
  Home,
  Store,
  SearchX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBrowseServices } from "@/lib/api/services";
import { RepairService, ServiceCategory, ServiceMode } from "@/types/fixmate";
import { ServiceRatingBadge } from "@/app/components/ServiceRatingBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES: ServiceMode[] = ["Home Visit", "Shop Drop-off"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

const BrowserServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const resolvedParams = await searchParams;

  const getParam = (key: string) => {
    const val = resolvedParams[key];
    return typeof val === "string" ? val.trim() : "";
  };

  const currentSearch = getParam("search");
  const currentCategory = getParam("category");
  const currentMode = getParam("serviceMode");
  const currentSort = getParam("sort") || "newest";

  // Build query string for the backend API
  const apiParams = new URLSearchParams();
  if (currentSearch) apiParams.set("search", currentSearch);
  if (currentCategory && currentCategory !== "all")
    apiParams.set("category", currentCategory);
  if (currentMode && currentMode !== "all")
    apiParams.set("serviceMode", currentMode);
  if (currentSort) apiParams.set("sort", currentSort);

  const query = apiParams.toString();
  const services: RepairService[] = await getBrowseServices({ query });

  const hasActiveFilters =
    Boolean(currentSearch) ||
    (Boolean(currentCategory) && currentCategory !== "all") ||
    (Boolean(currentMode) && currentMode !== "all") ||
    currentSort !== "newest";

  // Builds a sort URL while preserving active search & filter params
  const buildSortHref = (sortValue: string) => {
    const nextParams = new URLSearchParams();
    if (currentSearch) nextParams.set("search", currentSearch);
    if (currentCategory && currentCategory !== "all")
      nextParams.set("category", currentCategory);
    if (currentMode && currentMode !== "all")
      nextParams.set("serviceMode", currentMode);
    if (sortValue !== "newest") nextParams.set("sort", sortValue);
    const qs = nextParams.toString();
    return qs ? `/browse-services?${qs}` : "/browse-services";
  };

  return (
    <section className="relative mx-auto min-h-[80vh] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Subtle Ambient Background Accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />

      {/* Page Header */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          Verified Technicians • Pay After Completion
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Browse Repair Services
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 sm:text-base dark:text-slate-400">
          Find trusted technicians for smartphones, laptops, home appliances,
          and electrical repairs near you.
        </p>
      </div>

      {/* Search & Filter Form (Server-Side GET) */}
      <div className="mb-4 animate-in fade-in slide-in-from-top-4 duration-500 delay-75">
        <form
          method="GET"
          action="/browse-services"
          className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_35px_-15px_rgba(79,70,229,0.12)] backdrop-blur-md lg:flex-row lg:items-center dark:border-slate-800 dark:bg-slate-950/80"
        >
          {/* Preserve active sort when searching/filtering */}
          {currentSort !== "newest" && (
            <input type="hidden" name="sort" value={currentSort} />
          )}

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              name="search"
              defaultValue={currentSearch}
              placeholder="Search by title, category, or area..."
              className="h-11 rounded-2xl border-slate-200/90 bg-slate-50/70 pl-10 transition-all focus-visible:border-indigo-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900"
            />
          </div>

          {/* Category & Service Mode Filters */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center">
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2 text-indigo-500" />
              <select
                name="category"
                defaultValue={currentCategory || "all"}
                aria-label="Filter by category"
                className="h-11 w-full appearance-none rounded-2xl border border-slate-200/90 bg-white pr-8 pl-9 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 lg:w-44 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="serviceMode"
              defaultValue={currentMode || "all"}
              aria-label="Filter by service mode"
              className="h-11 w-full appearance-none rounded-2xl border border-slate-200/90 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 lg:w-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="all">All Modes</option>
              {SERVICE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </form>
      </div>

      {/* Separate Sort Bar + Results Count */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between animate-in fade-in duration-500 delay-100 dark:border-slate-800/80 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {services.length}
            </span>{" "}
            {services.length === 1 ? "verified service" : "verified services"}
          </p>

          {hasActiveFilters && (
            <Link
              href="/browse-services"
              className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-950"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Link>
          )}
        </div>

        {/* Separate Sort Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="h-3.5 w-3.5 text-indigo-500" />
            Sort:
          </span>
          {SORT_OPTIONS.map((option) => {
            const isActive = currentSort === option.value;
            return (
              <Link
                key={option.value}
                href={buildSortHref(option.value)}
                scroll={false}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25"
                    : "border border-slate-200/80 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:text-indigo-300"
                )}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Services Grid or Friendly Empty State */}
      {services.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center animate-in fade-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <SearchX className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            No matching services found
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search keywords, switching categories, or clearing
            the active filters.
          </p>
          <Link
            href="/browse-services"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Wrench className="mr-2 h-4 w-4" />
            View All Services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <Card
              key={service._id}
              style={{ animationDelay: `${Math.min(index * 55, 450)}ms` }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-300/80 hover:shadow-xl hover:shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4 fill-mode-both dark:border-slate-800 dark:bg-slate-950/90 dark:hover:border-indigo-700/70"
            >
              {/* Uniform Image Header */}
              <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md hover:bg-white dark:bg-slate-900/90 dark:text-slate-100">
                  {service.category}
                </Badge>

                {/* Service Mode Badge */}
                <Badge className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-indigo-600/90 text-[11px] font-medium text-white backdrop-blur-md hover:bg-indigo-600">
                  {service.serviceMode === "Home Visit" ? (
                    <Home className="h-3 w-3" />
                  ) : (
                    <Store className="h-3 w-3" />
                  )}
                  {service.serviceMode}
                </Badge>

                {/* Average Rating Badge */}
                <ServiceRatingBadge
                  averageRating={service.averageRating}
                  reviewCount={service.reviewCount}
                  className="absolute bottom-3 left-3 shadow-xs backdrop-blur-md"
                />
              </div>

              {/* Card Body (equal height across grid) */}
              <CardContent className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="line-clamp-2 min-h-[2.75rem] text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {service.title}
                </h2>

                <div className="mt-auto space-y-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <span className="truncate">{service.serviceArea}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                      {service.technicianName}
                    </span>
                  </div>
                </div>
              </CardContent>

              {/* Card Footer: Starting Price & View Details */}
              <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div>
                  <span className="block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                    Starting at
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    ${service.basePrice}
                  </span>
                </div>

                <Link
                  href={`/browse-services/${service._id}`}
                  className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all duration-200 hover:shadow-md hover:shadow-indigo-500/35"
                >
                  View Details
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default BrowserServicesPage;