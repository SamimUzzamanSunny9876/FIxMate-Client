"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Link2,
  X,
  DollarSign,
  Clock,
  MapPin,
  Home,
  Store,
  Wrench,
  UserCheck,
  Loader2,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  ServiceCategory,
  ServiceMode,
  CreateServicePayload,
} from "@/types/fixmate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createService } from "@/lib/actions/services";

const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

interface FormErrors {
  title?: string;
  category?: string;
  description?: string;
  basePrice?: string;
  estimatedDuration?: string;
  serviceArea?: string;
  image?: string;
}

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  const technicianName = session?.user?.name || "";
  const technicianEmail = session?.user?.email || "";

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "">("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("Home Visit");
  const [serviceArea, setServiceArea] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgLoadError, setImgLoadError] = useState(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const parsedPrice = Number(basePrice);

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = "Service title must be at least 3 characters.";
    }
    if (!category) {
      newErrors.category = "Please select a repair category.";
    }
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description =
        "Please provide a clear description (at least 15 characters).";
    }
    if (!basePrice || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      newErrors.basePrice = "Base price must be a positive number.";
    }
    if (!estimatedDuration.trim()) {
      newErrors.estimatedDuration =
        'Estimated duration is required (e.g., "2-3 hours").';
    }
    if (!serviceArea.trim()) {
      newErrors.serviceArea =
        'Service area is required (e.g., "Dhanmondi, Dhaka").';
    }
    if (!imageUrl.trim()) {
      newErrors.image = "Please paste an image URL.";
    } else if (!isValidImageUrl(imageUrl.trim())) {
      newErrors.image =
        "Please enter a valid image URL starting with http:// or https://.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!technicianEmail) {
      toast.error("Session is still loading. Please try again in a moment.");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fix the highlighted errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateServicePayload = {
        title: title.trim(),
        category: category as ServiceCategory,
        description: description.trim(),
        image: imageUrl.trim(),
        basePrice: Number(basePrice),
        estimatedDuration: estimatedDuration.trim(),
        serviceMode,
        serviceArea: serviceArea.trim(),
        technicianName,
        technicianEmail,
        approvalStatus: "pending",
        isAvailable: true,
      };

      const result = await createService(payload);

      toast.success("Service submitted! It is now waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while adding your service.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showPreviewImage =
    Boolean(imageUrl.trim()) &&
    isValidImageUrl(imageUrl.trim()) &&
    !imgLoadError;

  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Technician Studio
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Add a New Repair Service
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            List your repair expertise. New services go live after quick admin
            approval.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: Form */}
        <Card className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_12px_40px_-15px_rgba(79,70,229,0.08)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 dark:border-slate-800 dark:bg-slate-950/80">
          <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800/80">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Service Details
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Fill out accurate pricing, duration, and coverage details so
              customers can book with confidence.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Service Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. iPhone 15 Screen Replacement"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title)
                        setErrors({ ...errors, title: undefined });
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-200/90 bg-white transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                      errors.title &&
                        "border-red-400 focus-visible:ring-red-500/10"
                    )}
                  />
                  {errors.title && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value as ServiceCategory);
                      if (errors.category)
                        setErrors({ ...errors, category: undefined });
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      className={cn(
                        "h-11 w-full rounded-xl border-slate-200/90 bg-white transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                        errors.category && "border-red-400"
                      )}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Service Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe what is included in this service, diagnostics, spare parts policy, and warranty..."
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description)
                      setErrors({ ...errors, description: undefined });
                  }}
                  className={cn(
                    "resize-none rounded-xl border-slate-200/90 bg-white transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                    errors.description &&
                      "border-red-400 focus-visible:ring-red-500/10"
                  )}
                />
                {errors.description && (
                  <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Row 3: Base Price, Estimated Duration, Service Area */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="basePrice"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Base Price (USD) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="basePrice"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="35"
                      value={basePrice}
                      onChange={(e) => {
                        setBasePrice(e.target.value);
                        if (errors.basePrice)
                          setErrors({ ...errors, basePrice: undefined });
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-200/90 bg-white pl-9 transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                        errors.basePrice && "border-red-400"
                      )}
                    />
                  </div>
                  {errors.basePrice && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.basePrice}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="estimatedDuration"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Estimated Duration <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="estimatedDuration"
                      placeholder="e.g. 2-3 hours"
                      value={estimatedDuration}
                      onChange={(e) => {
                        setEstimatedDuration(e.target.value);
                        if (errors.estimatedDuration)
                          setErrors({
                            ...errors,
                            estimatedDuration: undefined,
                          });
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-200/90 bg-white pl-9 transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                        errors.estimatedDuration && "border-red-400"
                      )}
                    />
                  </div>
                  {errors.estimatedDuration && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.estimatedDuration}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="serviceArea"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Service Area <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="serviceArea"
                      placeholder="e.g. Dhanmondi, Dhaka"
                      value={serviceArea}
                      onChange={(e) => {
                        setServiceArea(e.target.value);
                        if (errors.serviceArea)
                          setErrors({ ...errors, serviceArea: undefined });
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-200/90 bg-white pl-9 transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                        errors.serviceArea && "border-red-400"
                      )}
                    />
                  </div>
                  {errors.serviceArea && (
                    <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                      {errors.serviceArea}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Service Mode Cards */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Service Mode <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      {
                        mode: "Home Visit" as ServiceMode,
                        icon: Home,
                        desc: "You travel to the customer's address",
                      },
                      {
                        mode: "Shop Drop-off" as ServiceMode,
                        icon: Store,
                        desc: "Customer brings the device to your shop",
                      },
                    ] as const
                  ).map(({ mode, icon: Icon, desc }) => {
                    const isSelected = serviceMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setServiceMode(mode)}
                        className={cn(
                          "group flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40"
                            : "border-slate-200/80 bg-white/70 hover:border-indigo-200 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-800"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                              : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {mode}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {desc}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Service Banner Image URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="imageUrl"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Service Banner Image URL{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/repair-service.jpg"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImgLoadError(false);
                      if (errors.image)
                        setErrors({ ...errors, image: undefined });
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-200/90 bg-white pl-9 pr-10 transition-all focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900",
                      errors.image &&
                        "border-red-400 focus-visible:ring-red-500/10"
                    )}
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setImgLoadError(false);
                      }}
                      aria-label="Clear image URL"
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Right-click any web image, choose &ldquo;Copy image
                  address&rdquo;, and paste it here.
                </p>
                {errors.image && (
                  <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Row 6: Read-Only Technician Info from Session */}
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  <UserCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  Technician Info (Auto-filled)
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="technicianName"
                      className="text-xs text-slate-500"
                    >
                      Technician Name
                    </Label>
                    <Input
                      id="technicianName"
                      value={technicianName}
                      readOnly
                      disabled
                      className="h-10 rounded-xl bg-white/70 text-slate-600 dark:bg-slate-950/60 dark:text-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="technicianEmail"
                      className="text-xs text-slate-500"
                    >
                      Technician Email
                    </Label>
                    <Input
                      id="technicianEmail"
                      value={technicianEmail}
                      readOnly
                      disabled
                      className="h-10 rounded-xl bg-white/70 text-slate-600 dark:bg-slate-950/60 dark:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.back()}
                  className="h-11 rounded-full border-slate-200 px-6 dark:border-slate-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isSessionLoading}
                  className="h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:translate-y-0 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Wrench className="mr-2 h-4 w-4" />
                      Submit Service for Approval
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Column: Sticky Live Card Preview */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
              Live Card Preview
            </span>
            <Badge
              variant="secondary"
              className="rounded-full border border-amber-200 bg-amber-50 text-[11px] font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300"
            >
              Pending Approval
            </Badge>
          </div>

          <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
            {/* Preview Image */}
            <div className="relative h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              {showPreviewImage ? (
                <img
                  src={imageUrl.trim()}
                  alt="Service card preview"
                  onError={() => setImgLoadError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <ImageIcon className="h-8 w-8 opacity-60" />
                  <span className="text-xs">
                    {imgLoadError
                      ? "Could not load image URL"
                      : "Paste an image URL to preview"}
                  </span>
                </div>
              )}
              <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-xs font-semibold text-slate-800 shadow-xs backdrop-blur-md hover:bg-white dark:bg-slate-900/90 dark:text-slate-100">
                {category || "Category"}
              </Badge>
              <Badge className="absolute top-3 right-3 rounded-full bg-indigo-600/90 text-xs font-medium text-white backdrop-blur-md hover:bg-indigo-600">
                {serviceMode}
              </Badge>
            </div>

            {/* Preview Content */}
            <CardContent className="space-y-3 p-5">
              <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-white">
                {title || "Your Service Title"}
              </h3>

              <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {description ||
                  "A short overview of your repair service will appear here for customers."}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                  {serviceArea || "Service Area"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  {estimatedDuration || "Duration"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div>
                  <span className="block text-[10px] font-medium text-slate-400 uppercase">
                    Starting from
                  </span>
                  <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">
                    ${basePrice && Number(basePrice) > 0 ? basePrice : "0"}
                  </span>
                </div>
                <span className="rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  View Details
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}