"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  MapPin,
  Home,
  Store,
  User,
  Mail,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ApprovalStatus, RepairService } from "@/types/fixmate";
import { getAdminServices, updateServiceApproval } from "@/lib/api/services";
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

const approvalBadgeConfig: Record<
  ApprovalStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-300",
    icon: XCircle,
  },
};

const filterTabs: { label: string; value: "all" | ApprovalStatus }[] = [
  { label: "Pending Review", value: "pending" },
  { label: "All Services", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const AdminServiceApprovalPage = () => {
  const [services, setServices] = useState<RepairService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | ApprovalStatus>(
    "pending"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<RepairService | null>(
    null
  );
  const [rejectingService, setRejectingService] =
    useState<RepairService | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const data = await getAdminServices();
        if (isMounted) setServices(data);
      } catch (err) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Could not load services.";
          toast.error(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleApprovalChange = async (
    service: RepairService,
    nextStatus: ApprovalStatus
  ) => {
    setUpdatingId(service._id);
    try {
      await updateServiceApproval(service._id, nextStatus);
      setServices((prev) =>
        prev.map((item) =>
          item._id === service._id
            ? { ...item, approvalStatus: nextStatus }
            : item
        )
      );

      if (selectedService?._id === service._id) {
        setSelectedService({ ...service, approvalStatus: nextStatus });
      }

      toast.success(
        nextStatus === "approved"
          ? `"${service.title}" approved and published to Browse Services.`
          : `"${service.title}" has been rejected.`
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update approval status.";
      toast.error(msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingService) return;
    await handleApprovalChange(rejectingService, "rejected");
    setRejectingService(null);
  };

  // Filtered list
  const filteredServices = services.filter((s) => {
    const matchesTab =
      activeFilter === "all" || s.approvalStatus === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.technicianName.toLowerCase().includes(q) ||
      s.serviceArea.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  // Summary counts
  const totalCount = services.length;
  const pendingCount = services.filter(
    (s) => s.approvalStatus === "pending"
  ).length;
  const approvedCount = services.filter(
    (s) => s.approvalStatus === "approved"
  ).length;
  const rejectedCount = services.filter(
    (s) => s.approvalStatus === "rejected"
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin Moderation
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Service Approval
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review technician listings before they go live on the public Browse
          Services marketplace.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-75">
        {[
          {
            label: "Total Listings",
            value: totalCount,
            accent: "text-slate-900 dark:text-white",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            accent: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Approved & Live",
            value: approvedCount,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Rejected",
            value: rejectedCount,
            accent: "text-red-600 dark:text-red-400",
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

      {/* Filter Tabs + Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                activeFilter === tab.value
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {tab.label}
              {tab.value === "pending" && pendingCount > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                    activeFilter === "pending"
                      ? "bg-white/25 text-white"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  )}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search service or technician..."
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
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            ))}
          </div>
        </Card>
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {activeFilter === "pending"
                ? "All caught up!"
                : "No services match your filter"}
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {activeFilter === "pending"
                ? "There are no pending technician services waiting for approval right now."
                : "Try switching tabs or clearing your search query."}
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
                  <TableHead>Technician</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => {
                  const statusInfo =
                    approvalBadgeConfig[service.approvalStatus] ||
                    approvalBadgeConfig.pending;
                  const StatusIcon = statusInfo.icon;
                  const isBusy = updatingId === service._id;

                  return (
                    <TableRow
                      key={service._id}
                      className="border-slate-100 transition-colors hover:bg-indigo-50/30 dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="h-11 w-14 shrink-0 rounded-xl border border-slate-200/80 object-cover dark:border-slate-800"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {service.title}
                            </p>
                            <span className="text-xs text-slate-500">
                              {service.serviceArea} • {service.serviceMode}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {service.technicianName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {service.technicianEmail}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs font-medium"
                        >
                          {service.category}
                        </Badge>
                      </TableCell>

                      <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                        ${service.basePrice}
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

                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedService(service)}
                            aria-label="Inspect service details"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {service.approvalStatus !== "approved" && (
                            <Button
                              type="button"
                              size="sm"
                              disabled={isBusy}
                              onClick={() =>
                                handleApprovalChange(service, "approved")
                              }
                              className="h-8 rounded-full bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              {isBusy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Check className="mr-1 h-3.5 w-3.5" />
                                  Approve
                                </>
                              )}
                            </Button>
                          )}

                          {service.approvalStatus !== "rejected" && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              disabled={isBusy}
                              onClick={() => setRejectingService(service)}
                              className="h-8 rounded-full border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400"
                            >
                              <X className="mr-1 h-3.5 w-3.5" />
                              Reject
                            </Button>
                          )}
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
            {filteredServices.map((service) => {
              const statusInfo =
                approvalBadgeConfig[service.approvalStatus] ||
                approvalBadgeConfig.pending;
              const StatusIcon = statusInfo.icon;
              const isBusy = updatingId === service._id;

              return (
                <Card
                  key={service._id}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
                >
                  <div className="relative h-36 w-full">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <Badge
                      variant="outline"
                      className={cn(
                        "absolute top-3 right-3 inline-flex items-center gap-1 rounded-full text-xs font-semibold backdrop-blur-md",
                        statusInfo.className
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>

                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {service.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          By {service.technicianName} • {service.category}
                        </p>
                      </div>
                      <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${service.basePrice}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedService(service)}
                        className="h-8 rounded-full px-3 text-xs"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Inspect
                      </Button>

                      <div className="flex items-center gap-2">
                        {service.approvalStatus !== "approved" && (
                          <Button
                            type="button"
                            size="sm"
                            disabled={isBusy}
                            onClick={() =>
                              handleApprovalChange(service, "approved")
                            }
                            className="h-8 rounded-full bg-emerald-600 px-3 text-xs text-white"
                          >
                            Approve
                          </Button>
                        )}
                        {service.approvalStatus !== "rejected" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={isBusy}
                            onClick={() => setRejectingService(service)}
                            className="h-8 rounded-full px-3 text-xs"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Inspect Service Modal */}
      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => {
          if (!open) setSelectedService(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {selectedService.title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {selectedService.category} • Starting at $
                  {selectedService.basePrice}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-1 text-sm">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="h-44 w-full rounded-2xl border border-slate-200 object-cover dark:border-slate-800"
                />

                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div>
                    <p className="text-xs text-slate-400">Technician</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                      <User className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedService.technicianName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                      {selectedService.technicianEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Service Mode</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      {selectedService.serviceMode === "Home Visit" ? (
                        <Home className="h-3.5 w-3.5 text-indigo-500" />
                      ) : (
                        <Store className="h-3.5 w-3.5 text-indigo-500" />
                      )}
                      {selectedService.serviceMode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Service Area</p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      {selectedService.serviceArea}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">
                    Description
                  </p>
                  <p className="rounded-2xl border border-slate-200/80 p-3.5 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {selectedService.description}
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2">
                {selectedService.approvalStatus !== "rejected" && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={updatingId === selectedService._id}
                    onClick={() => {
                      setRejectingService(selectedService);
                      setSelectedService(null);
                    }}
                    className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Reject Listing
                  </Button>
                )}
                {selectedService.approvalStatus !== "approved" && (
                  <Button
                    type="button"
                    disabled={updatingId === selectedService._id}
                    onClick={() =>
                      handleApprovalChange(selectedService, "approved")
                    }
                    className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Approve & Publish
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog
        open={Boolean(rejectingService)}
        onOpenChange={(open) => {
          if (!open) setRejectingService(null);
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this service listing?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {rejectingService?.title}
              </span>
              ? It will remain hidden from customers on Browse Services until
              approved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmReject();
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              Yes, Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServiceApprovalPage;