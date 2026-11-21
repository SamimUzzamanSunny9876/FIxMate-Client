"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  Briefcase,
  ClipboardList,
  Users,
  ShieldCheck,
  Receipt,
  UserCog,
  Home,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/fixmate";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

interface SidebarNavItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

const menuItemsByRole: Record<UserRole, SidebarNavItem[]> = {
  admin: [
    {
      id: "admin-overview",
      name: "Overview",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      id: "admin-users",
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      id: "admin-services",
      name: "Service Approval",
      url: "/dashboard/admin/services",
      icon: ShieldCheck,
    },
    {
      id: "admin-bookings",
      name: "All Bookings",
      url: "/dashboard/admin/bookings",
      icon: ClipboardList,
    },
    {
      id: "admin-transactions",
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
  technician: [
    {
      id: "tech-overview",
      name: "Overview",
      url: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      id: "tech-add-service",
      name: "Add a Service",
      url: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    {
      id: "tech-my-services",
      name: "My Services",
      url: "/dashboard/technician/my-services",
      icon: Briefcase,
    },
    {
      id: "tech-requests",
      name: "Manage Requests",
      url: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ],
  customer: [
    {
      id: "customer-overview",
      name: "Overview",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      id: "customer-bookings",
      name: "My Bookings",
      url: "/dashboard/customer/bookings",
      icon: CalendarCheck,
    },
    {
      id: "customer-payments",
      name: "Payment History",
      url: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],
};

const sharedMenuItems: SidebarNavItem[] = [
  {
    id: "shared-profile",
    name: "Update Profile",
    url: "/dashboard/profile",
    icon: UserCog,
  },
  {
    id: "shared-home",
    name: "Back to Home",
    url: "/",
    icon: Home,
  },
];

const roleBadgeStyles: Record<UserRole, string> = {
  admin:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/60 dark:text-violet-300",
  technician:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/60 dark:text-indigo-300",
  customer:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300",
};

interface DashboardSidebarProps {
  /** Optional role override (falls back to BetterAuth session role) */
  role?: UserRole;
}

export function DashboardSidebar({ role: propRole }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const sessionRole = (session?.user as { role?: UserRole } | undefined)?.role;
  const activeRole: UserRole = propRole ?? sessionRole ?? "customer";
  const roleItems = menuItemsByRole[activeRole] ?? menuItemsByRole.customer;

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully.");
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90"
    >
      {/* Brand Header */}
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
              <Wrench className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:hidden">
              <span className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FixMate
              </span>
              <span
                className={cn(
                  "mt-0.5 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                  roleBadgeStyles[activeRole]
                )}
              >
                {activeRole}
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="bg-slate-200/70 dark:bg-slate-800" />

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-3">
        {/* Role-Specific Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            {activeRole} Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isPending && !propRole ? (
              <div className="space-y-2 px-2 pt-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-9 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : (
              <SidebarMenu className="mt-1 space-y-1">
                {roleItems.map((item, index) => {
                  const isActive = pathname === item.url;
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem
                      key={item.id}
                      style={{ animationDelay: `${index * 45}ms` }}
                      className="animate-in fade-in slide-in-from-left-2 duration-300 fill-mode-both"
                    >
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={item.name}
                        render={<Link href={item.url} />}
                        className={cn(
                          "group/item relative h-10 rounded-xl px-3 font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-600 hover:to-violet-600 hover:text-white"
                            : "text-slate-600 hover:translate-x-1 hover:bg-indigo-50/80 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-300"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover/item:text-indigo-600 dark:text-slate-500 dark:group-hover/item:text-indigo-400"
                          )}
                        />
                        <span className="truncate">{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 bg-slate-200/70 dark:bg-slate-800" />

        {/* Shared Account & Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
            Account & General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 space-y-1">
              {sharedMenuItems.map((item) => {
                const isActive = pathname === item.url;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.name}
                      render={<Link href={item.url} />}
                      className={cn(
                        "group/item h-10 rounded-xl px-3 font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 hover:text-white"
                          : "text-slate-600 hover:translate-x-1 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 group-hover/item:scale-110",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover/item:text-slate-700 dark:text-slate-500 dark:group-hover/item:text-slate-200"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Sign Out */}
      <SidebarFooter className="border-t border-slate-200/70 p-3 dark:border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={handleSignOut}
              className="group/logout h-10 w-full rounded-xl px-3 font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            >
              <LogOut className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}