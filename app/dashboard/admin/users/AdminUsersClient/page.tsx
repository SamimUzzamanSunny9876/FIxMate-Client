"use client"

import React, { useState } from "react"
import { updateUserRole } from "@/lib/api/admin"
import {  deleteUser } from "@/lib/api/admin";
import {
  Users,
  ShieldCheck,
  Wrench,
  User as UserIcon,
  Search,
  Eye,
  Trash2,
  UserCog,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Crown,
  Loader2,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { UserRole, TechnicianPlan } from "@/types/fixmate"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Compatible with both BetterAuth listUsers() and MongoDB User docs
export interface AdminUser {
  id?: string
  _id?: string
  name: string
  email: string
  image?: string | null
  role?: UserRole | string | null
  phone?: string | null
  area?: string | null
  bio?: string | null
  plan?: TechnicianPlan | string | null
  banned?: boolean | null
  createdAt?: string | Date
}

const roleBadgeConfig: Record<
  UserRole,
  { label: string; className: string; icon: React.ElementType }
> = {
  admin: {
    label: "Admin",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300",
    icon: ShieldCheck,
  },
  technician: {
    label: "Technician",
    className:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300",
    icon: Wrench,
  },
  customer: {
    label: "Customer",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
    icon: UserIcon,
  },
}

const filterTabs: { label: string; value: "all" | UserRole }[] = [
  { label: "All Users", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Technicians", value: "technician" },
  { label: "Admins", value: "admin" },
]

const getUserId = (u: AdminUser) => u.id ?? u._id ?? u.email

const normalizeRole = (role?: string | null): UserRole => {
  if (role === "admin" || role === "technician" || role === "customer") {
    return role
  }
  return "customer"
}

const formatDate = (date?: string | Date) => {
  if (!date) return "—"
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return String(date).split("T")[0]
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getInitials = (name?: string, email?: string) =>
  (name || email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

interface AdminUsersClientProps {
  initialUsers: AdminUser[]
}

const AdminUsersClient = ({ initialUsers }: AdminUsersClientProps) => {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [activeFilter, setActiveFilter] = useState<"all" | UserRole>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUser | null>(null)
  const [nextRole, setNextRole] = useState<UserRole>("customer")
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Summary counts
  const totalUsers = users.length
  const customerCount = users.filter(
    (u) => normalizeRole(u.role) === "customer"
  ).length
  const technicianCount = users.filter(
    (u) => normalizeRole(u.role) === "technician"
  ).length
  const adminCount = users.filter(
    (u) => normalizeRole(u.role) === "admin"
  ).length

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const userRole = normalizeRole(u.role)
    const matchesTab = activeFilter === "all" || userRole === activeFilter
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.area?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const openRoleModal = (user: AdminUser) => {
    setEditingRoleUser(user)
    setNextRole(normalizeRole(user.role))
  }

  const handleSaveRole = async () => {
    if (!editingRoleUser) return
    setIsSubmitting(true)
    try {
      const targetId = getUserId(editingRoleUser)

      const handleSaveRole = async () => {
        if (!editingRoleUser) return
        setIsSubmitting(true)
        try {
          const targetId = getUserId(editingRoleUser)

          await updateUserRole(editingRoleUser.email, nextRole)

          setUsers((prev) =>
            prev.map((u) =>
              getUserId(u) === targetId ? { ...u, role: nextRole } : u
            )
          )
          toast.success(
            `Updated ${editingRoleUser.name}'s role to ${nextRole}.`
          )
          setEditingRoleUser(null)
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Failed to update user role."
          )
        } finally {
          setIsSubmitting(false)
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === targetId ? { ...u, role: nextRole } : u
        )
      )
      toast.success(`Updated ${editingRoleUser.name}'s role to ${nextRole}.`)
      setEditingRoleUser(null)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update user role."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
  if (!deletingUser) return;
  setIsSubmitting(true);
  try {
    const targetId = getUserId(deletingUser);

    await deleteUser(deletingUser.email);

    setUsers((prev) => prev.filter((u) => getUserId(u) !== targetId));
    toast.success(`Removed user "${deletingUser.name}".`);
    setDeletingUser(null);
  } catch (err) {
    toast.error(
      err instanceof Error ? err.message : "Failed to delete user."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="animate-in duration-500 fade-in slide-in-from-top-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/70 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300">
          <Users className="h-3.5 w-3.5" />
          User Management
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          Manage Users
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View all registered customers, technicians, and admins. Update roles
          or remove accounts anytime.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="grid animate-in grid-cols-2 gap-3 delay-75 duration-500 fade-in slide-in-from-bottom-3 sm:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: totalUsers,
            accent: "text-slate-900 dark:text-white",
          },
          {
            label: "Customers",
            value: customerCount,
            accent: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Technicians",
            value: technicianCount,
            accent: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Admins",
            value: adminCount,
            accent: "text-violet-600 dark:text-violet-400",
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
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                activeFilter === tab.value
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, or area..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Users Table / Cards */}
      {filteredUsers.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-slate-300 bg-white/80 py-16 text-center dark:border-slate-800 dark:bg-slate-950/60">
          <CardContent className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Users className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No users found
            </h2>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Try switching role filters or clearing your search query.
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
                  <TableHead className="pl-6">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact & Area</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => {
                  const roleKey = normalizeRole(user.role)
                  const roleInfo = roleBadgeConfig[roleKey]
                  const RoleIcon = roleInfo.icon

                  return (
                    <TableRow
                      key={getUserId(user) || index}
                      className="border-slate-100 transition-colors hover:bg-indigo-50/30 dark:border-slate-800/80 dark:hover:bg-indigo-950/20"
                    >
                      {/* User Avatar + Name */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                            />
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                              {getInitials(user.name, user.email)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-white">
                              {user.name || "Unnamed User"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role + Optional Tech Plan */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                              roleInfo.className
                            )}
                          >
                            <RoleIcon className="h-3 w-3" />
                            {roleInfo.label}
                          </Badge>

                          {roleKey === "technician" && user.plan === "pro" && (
                            <Badge
                              variant="outline"
                              className="rounded-full border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300"
                            >
                              <Crown className="mr-0.5 h-2.5 w-2.5" />
                              Pro
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Contact & Area */}
                      <TableCell>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {user.phone || "No phone"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {user.area || "No area set"}
                        </p>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                          {formatDate(user.createdAt)}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                            aria-label="View user details"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => openRoleModal(user)}
                            aria-label="Change user role"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-violet-50 hover:text-violet-600 dark:text-slate-300"
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingUser(user)}
                            aria-label="Delete user"
                            className="h-8 w-8 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredUsers.map((user, index) => {
              const roleKey = normalizeRole(user.role)
              const roleInfo = roleBadgeConfig[roleKey]
              const RoleIcon = roleInfo.icon

              return (
                <Card
                  key={getUserId(user) || index}
                  className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-950/90"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                          {getInitials(user.name, user.email)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-slate-900 dark:text-white">
                          {user.name || "Unnamed User"}
                        </h3>
                        <p className="truncate text-xs text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 rounded-full text-xs font-semibold",
                        roleInfo.className
                      )}
                    >
                      <RoleIcon className="h-3 w-3" />
                      {roleInfo.label}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-xs text-slate-500">
                      Joined {formatDate(user.createdAt)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUser(user)}
                        className="h-8 rounded-full px-2.5 text-xs"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        View
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => openRoleModal(user)}
                        className="h-8 rounded-full px-2.5 text-xs text-indigo-600"
                      >
                        <UserCog className="mr-1 h-3.5 w-3.5" />
                        Role
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeletingUser(user)}
                        className="h-8 w-8 rounded-full text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Inspect User Modal */}
      <Dialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null)
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          {selectedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3.5">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="h-14 w-14 rounded-full border border-slate-200 object-cover dark:border-slate-800"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
                      {getInitials(selectedUser.name, selectedUser.email)}
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-lg font-bold">
                      {selectedUser.name || "Unnamed User"}
                    </DialogTitle>
                    <DialogDescription className="text-xs capitalize">
                      {normalizeRole(selectedUser.role)} • Joined{" "}
                      {formatDate(selectedUser.createdAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                  <span className="truncate">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Phone className="h-4 w-4 shrink-0 text-indigo-500" />
                  <span>{selectedUser.phone || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-4 w-4 shrink-0 text-indigo-500" />
                  <span>{selectedUser.area || "No area provided"}</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div>
                  <p className="mb-1 text-xs font-semibold text-slate-500 uppercase">
                    Bio
                  </p>
                  <p className="rounded-2xl border border-slate-200/80 p-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {selectedUser.bio}
                  </p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog
        open={Boolean(editingRoleUser)}
        onOpenChange={(open) => {
          if (!open) setEditingRoleUser(null)
        }}
      >
        <DialogContent className="rounded-3xl sm:max-w-md">
          {editingRoleUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Change User Role
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Select a new role for{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {editingRoleUser.name}
                  </span>{" "}
                  ({editingRoleUser.email}).
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-2.5 py-2">
                {(["customer", "technician", "admin"] as UserRole[]).map(
                  (roleOption) => {
                    const info = roleBadgeConfig[roleOption]
                    const Icon = info.icon
                    const isSelected = nextRole === roleOption

                    return (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => setNextRole(roleOption)}
                        className={cn(
                          "flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all",
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500 dark:bg-indigo-950/40"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-2xs dark:bg-slate-900">
                            <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {info.label}
                            </p>
                            <p className="text-xs text-slate-500">
                              {roleOption === "admin"
                                ? "Full platform moderation & oversight"
                                : roleOption === "technician"
                                  ? "Can list services & manage repair jobs"
                                  : "Can browse, book, and pay for repairs"}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </button>
                    )
                  }
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRoleUser(null)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSaveRole}
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Role"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null)
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {deletingUser?.name}
              </span>{" "}
              ({deletingUser?.email})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSubmitting}
              onClick={(e) => {
                e.preventDefault()
                handleConfirmDelete()
              }}
              className="rounded-full bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminUsersClient
