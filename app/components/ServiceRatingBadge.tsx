import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceRatingBadgeProps {
  averageRating?: number;
  reviewCount?: number;
  className?: string;
}

export function ServiceRatingBadge({
  averageRating = 0,
  reviewCount = 0,
  className,
}: ServiceRatingBadgeProps) {
  if (!reviewCount || averageRating <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
          className
        )}
      >
        <Star className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        <span>New</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50/90 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
        className
      )}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span>{averageRating.toFixed(1)}</span>
      <span className="font-normal text-amber-700/80 dark:text-amber-400/80">
        ({reviewCount})
      </span>
    </span>
  );
}