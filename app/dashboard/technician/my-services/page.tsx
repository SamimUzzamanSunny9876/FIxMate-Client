"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Upload,
  X,
  Home,
  Store,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import {
  ApprovalStatus,
  RepairService,
  ServiceCategory,
  ServiceMode,
} from "@/types/fixmate";
import {
  getTechnicianServices,
  updateService,
  deleteService,
} from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const approvalBadgeConfig: Record<
  ApprovalStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  approved: {
    label: "Approved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
    icon: AlertCircle,
  },
  rejected: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
    icon: XCircle,
  },
};

interface EditFormState {
  title: string;
  category: ServiceCategory;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  image: string;
}

const TechnicianServicesPage = () => {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const technicianEmail = session?.user?.email;

  const [services, setServices] = useState<RepairService[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Edit modal states
  const [editingService, setEditingService] = useState<RepairService | null>(
    null
  );
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete confirmation modal states
  const [deletingService, setDeletingService] = useState<RepairService | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Computed directly instead of calling setIsLoading synchronously in useEffect
  const isLoading = isSessionLoading || (Boolean(technicianEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !technicianEmail) return;

    let isMounted = true;

    const loadServices = async () => {
      try {
        const data = await getTechnicianServices(technicianEmail);
        if (isMounted) setServices(data);
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Could not load your services.";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, technicianEmail]);

  const clearEditImageState = () => {
    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const closeEditModal = () => {
    clearEditImageState();
    setEditingService(null);
    setEditForm(null);
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    if (editImagePreview) URL.revokeObjectURL(editImagePreview);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API key is missing in .env.local.");
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data?.success) {
      throw new Error(data?.error?.message || "Failed to upload service image.");
    }

    return data.data.display_url || data.data.url;
  };

  // Open pre-filled Edit Dialog
  const openEditModal = (service: RepairService) => {
    clearEditImageState();
    setEditingService(service);
    setEditForm({
      title: service.title,
      category: service.category,
      description: service.description,
      basePrice: String(service.basePrice),
      estimatedDuration: service.estimatedDuration,
      serviceMode: service.serviceMode,
      serviceArea: service.serviceArea,
      image: service.image,
    });
  };

  // Submit Edit (resets approvalStatus back to 'pending')
  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingService || !editForm) return;

    const parsedPrice = Number(editForm.basePrice);
    if (!editForm.title.trim() || editForm.title.trim().length < 3) {
      toast.error("Service title must be at least 3 characters.");
      return;
    }
    if (!editForm.description.trim() || editForm.description.trim().length < 15) {
      toast.error("Description must be at least 15 characters.");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Base price must be a positive number.");
      return;
    }
    if (!editImageFile && !editForm.image.trim()) {
      toast.error("Service banner image is required.");
      return;
    }

    setIsSavingEdit(true);
    try {
      let finalImageUrl = editForm.image.trim();

      if (editImageFile) {
        finalImageUrl = await uploadToImgBB(editImageFile);
      }

      const updatedFields = {
        title: editForm.title.trim(),
        category: editForm.category,
        description: editForm.description.trim(),
        basePrice: parsedPrice,
        estimatedDuration: editForm.estimatedDuration.trim(),
        serviceMode: editForm.serviceMode,
        serviceArea: editForm.serviceArea.trim(),
        image: finalImageUrl,
        approvalStatus: "pending" as ApprovalStatus,
      };

      await updateService(editingService._id, updatedFields);

      setServices((prev) =>
        prev.map((item) =>
          item._id === editingService._id
            ? { ...item, ...updatedFields }
            : item
        )
      );

      toast.success(
        "Service updated! Its status is now Pending for admin re-approval."
      );
      closeEditModal();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update service.";
      toast.error(message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Toggle Availability Switch
  const handleToggleAvailability = async (
    service: RepairService,
    nextValue: boolean
  ) => {
    setTogglingId(service._id);
    // Optimistic update
    setServices((prev) =>
      prev.map((item) =>
        item._id === service._id ? { ...item, isAvailable: nextValue } : item
      )
    );

    try {
      await updateService(service._id, { isAvailable: nextValue });
      toast.success(
        nextValue
          ? `"${service.title}" is now visible to customers.`
          : `"${service.title}" has been turned off from public pages.`
      );
    } catch (err) {
      // Revert on failure
      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: !nextValue }
            : item
        )
      );
      const message =
        err instanceof Error ? err.message : "Failed to update availability.";
      toast.error(message);
    } finally {
      setTogglingId(null);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      await deleteService(deletingService._id);
      setServices((prev) =>
        prev.filter((item) => item._id !== deletingService._id)
      );
      toast.success(`"${deletingService.title}" deleted successfully.`);
      setDeletingService(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete service.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Summary counts
  const totalCount = services.length;
  const approvedCount = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const pendingCount = services.filter(
    (s) => s.approvalStatus === "pending"
  ).length;
  const activeCount = services.filter((s) => s.isAvailable).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-3 duration-500">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Briefcase className="h-3.5 w-3.5" />
            Service Management
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            My Services
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your repair listings, toggle availability, or update details
            anytime.
          </p>
        </div>

        <Button className="h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40">
          <Link href="/dashboard/technician/add-service" className="inline-flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Service
          </Link>
        </Button>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Services",
            value: totalCount,
            accent: "text-slate-900 dark:text-white",
          },
          {
            label: "Approved",
            value: approvedCount,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            accent: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Available Now",
            value: activeCount,
            accent: "text-indigo-600 dark:text-indigo-400",
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

      {/* Main Content Area */}
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
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      ) : services.length === 0 ? (
        /* Friendly Empty State */
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center animate-in fade-in zoom-in-95 duration-500 dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Wrench className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No services listed yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Add your first repair service so customers in your area can find
              and book you on FixMate.
            </p>
            <Button className="mt-6 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25">
              <Link href="/dashboard/technician/add-service" className="inline-flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden md:block overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_12px_40px_-15px_rgba(79,70,229,0.08)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500 dark:border-slate-800 dark:bg-slate-950/80">
            <Table>
              <TableHeader className="bg-slate-50/80 dark:bg-slate-900/60">
                <TableRow className="border-slate-200/70 dark:border-slate-800">
                  <TableHead className="pl-6">Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => {
                  const statusInfo =
                    approvalBadgeConfig[service.approvalStatus] ||
                    approvalBadgeConfig.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow
                      key={service._id}
                      style={{ animationDelay: `${index * 45}ms` }}
                      className="group border-slate-100 transition-colors hover:bg-indigo-50/30 animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      {/* Image + Title + Area */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="h-12 w-16 shrink-0 rounded-xl border border-slate-200/80 object-cover transition-transform duration-300 group-hover:scale-105 dark:border-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {service.title}
                            </p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-indigo-500" />
                                {service.serviceArea}
                              </span>
                              <span>•</span>
                              <span>{service.serviceMode}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-full bg-slate-100 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {service.category}
                        </Badge>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                        ${service.basePrice}
                      </TableCell>

                      {/* Approval Status */}
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

                      {/* Availability Toggle */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isAvailable}
                            disabled={togglingId === service._id}
                            onCheckedChange={(checked) =>
                              handleToggleAvailability(service, checked)
                            }
                            aria-label={`Toggle availability for ${service.title}`}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              service.isAvailable
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-slate-400"
                            )}
                          >
                            {service.isAvailable ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(service)}
                            aria-label={`Edit ${service.title}`}
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingService(service)}
                            aria-label={`Delete ${service.title}`}
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/50 dark:hover:text-red-400"
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
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {services.map((service, index) => {
              const statusInfo =
                approvalBadgeConfig[service.approvalStatus] ||
                approvalBadgeConfig.pending;
              const StatusIcon = statusInfo.icon;

              return (
                <Card
                  key={service._id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-300 fill-mode-both dark:border-slate-800 dark:bg-slate-950/80"
                >
                  <div className="relative h-40 w-full">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge className="absolute top-3 left-3 rounded-full bg-white/90 text-xs font-semibold text-slate-800 backdrop-blur-md">
                      {service.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full backdrop-blur-md text-xs font-semibold",
                        statusInfo.className
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        {service.title}
                      </h3>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${service.basePrice}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                        {service.serviceArea}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        {service.estimatedDuration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.isAvailable}
                          disabled={togglingId === service._id}
                          onCheckedChange={(checked) =>
                            handleToggleAvailability(service, checked)
                          }
                        />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          {service.isAvailable ? "Available" : "Hidden"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(service)}
                          className="h-8 rounded-full px-3 text-xs"
                        >
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeletingService(service)}
                          className="h-8 rounded-full px-3 text-xs"
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Pre-Filled Edit Service Modal */}
      <Dialog
        open={Boolean(editingService)}
        onOpenChange={(open) => {
          if (!open) closeEditModal();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Repair Service
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Saving changes will reset this service&apos;s approval status to{" "}
              <span className="font-semibold text-amber-600">Pending</span>{" "}
              until an admin reviews it again.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-title">Service Title</Label>
                  <Input
                    id="edit-title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) =>
                      setEditForm({
                        ...editForm,
                        category: value as ServiceCategory,
                      })
                    }
                  >
                    <SelectTrigger id="edit-category" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="resize-none rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price">Base Price (USD)</Label>
                  <div className="relative">
                    <DollarSign className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="edit-price"
                      type="number"
                      min="1"
                      step="0.01"
                      value={editForm.basePrice}
                      onChange={(e) =>
                        setEditForm({ ...editForm, basePrice: e.target.value })
                      }
                      className="h-10 rounded-xl pl-8"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    value={editForm.estimatedDuration}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        estimatedDuration: e.target.value,
                      })
                    }
                    className="h-10 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-area">Service Area</Label>
                  <Input
                    id="edit-area"
                    value={editForm.serviceArea}
                    onChange={(e) =>
                      setEditForm({ ...editForm, serviceArea: e.target.value })
                    }
                    className="h-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Service Mode */}
              <div className="space-y-1.5">
                <Label>Service Mode</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { mode: "Home Visit" as ServiceMode, icon: Home },
                      { mode: "Shop Drop-off" as ServiceMode, icon: Store },
                    ] as const
                  ).map(({ mode, icon: Icon }) => {
                    const selected = editForm.serviceMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() =>
                          setEditForm({ ...editForm, serviceMode: mode })
                        }
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all",
                          selected
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 dark:bg-indigo-950/50 dark:text-indigo-300"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Banner Image Upload (ImgBB) */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-image">Service Banner Image</Label>
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200/90 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  {editImagePreview || editForm.image ? (
                    <img
                      src={editImagePreview || editForm.image}
                      alt="Service banner preview"
                      className="h-14 w-20 shrink-0 rounded-xl border border-indigo-200 object-cover dark:border-indigo-900"
                    />
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      <Upload className="h-5 w-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <label
                      htmlFor="edit-image"
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs ring-1 ring-slate-200 transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {editImageFile ? "Change Image" : "Upload New Image"}
                    </label>
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <p className="mt-1 truncate text-[11px] text-slate-400">
                      {editImageFile
                        ? editImageFile.name
                        : "Keeping current image • PNG, JPG, or WEBP up to 5MB"}
                    </p>
                  </div>

                  {editImageFile && (
                    <button
                      type="button"
                      onClick={clearEditImageState}
                      aria-label="Revert to current image"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/50"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSavingEdit}
                  onClick={closeEditModal}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingEdit}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={Boolean(deletingService)}
        onOpenChange={(open) => {
          if (!open) setDeletingService(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this repair service?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingService?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Service"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TechnicianServicesPage;