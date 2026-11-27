"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Booking } from "@/types/fixmate";
import { submitBookingReview } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingReviewModalProps {
  booking: Booking;
  customerEmail?: string;
  onReviewSaved: (updated: Partial<Booking>) => void;
}

export function BookingReviewModal({
  booking,
  customerEmail,
  onReviewSaved,
}: BookingReviewModalProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(booking.rating || 5);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [review, setReview] = useState<string>(booking.review || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (booking.paymentStatus !== "paid" || !booking._id) {
    return null;
  }

  const hasExistingReview = Boolean(booking.rating && booking.review);
  const activeScore = hoveredStar || rating;

  const handleOpen = () => {
    setRating(booking.rating || 5);
    setReview(booking.review || "");
    setHoveredStar(0);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please choose a rating between 1 and 5 stars.");
      return;
    }
    if (!review.trim()) {
      toast.error("Please enter a short review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewedAt = new Date().toISOString();
      await submitBookingReview({
        bookingId: booking._id!,
        rating,
        review: review.trim(),
        customerEmail,
      });

      onReviewSaved({
        rating,
        review: review.trim(),
        reviewedAt,
      });

      toast.success(
        hasExistingReview
          ? "Your review has been updated!"
          : "Thanks for rating your repair!"
      );
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not submit review."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant={hasExistingReview ? "outline" : "default"}
        onClick={handleOpen}
        className={cn(
          "h-8 rounded-full px-3 text-xs font-semibold transition-all",
          hasExistingReview
            ? "border-amber-200 bg-amber-50/70 text-amber-700 hover:bg-amber-100 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs hover:brightness-105"
        )}
      >
        {hasExistingReview ? (
          <>
            <Star className="mr-1.5 h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            Rated {booking.rating}/5
          </>
        ) : (
          <>
            <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
            Rate & Review
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md dark:border-slate-800 dark:bg-slate-950">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {hasExistingReview ? "Update Your Review" : "Rate Your Repair"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm dark:text-slate-400">
              How was{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {booking.technicianName}
              </span>{" "}
              for <span className="font-medium">{booking.serviceTitle}</span>?
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* 1-5 Star Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
                Your Rating (1–5 Stars)
              </Label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const filled = starValue <= activeScore;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoveredStar(starValue)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(starValue)}
                      aria-label={`Rate ${starValue} out of 5 stars`}
                      className="rounded-lg p-1 transition-transform duration-150 hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          filled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-600"
                        )}
                      />
                    </button>
                  );
                })}
                <span className="ml-auto text-sm font-bold text-amber-600 dark:text-amber-400">
                  {activeScore}.0 / 5
                </span>
              </div>
            </div>

            {/* Short Review Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="booking-review">Short Review</Label>
              <Textarea
                id="booking-review"
                rows={3}
                maxLength={400}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share how quickly the issue was diagnosed, technician professionalism, and repair quality..."
                className="resize-none rounded-xl dark:border-slate-800 dark:bg-slate-900"
                required
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified paid booking
                </span>
                <span>{review.length}/400</span>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
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
                className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}