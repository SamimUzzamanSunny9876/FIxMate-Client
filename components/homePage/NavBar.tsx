"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Wrench,
  Menu,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Loader2,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"

interface NavItem {
  label: string
  href: string
}



export function NavBar() {
  const pathname = usePathname()
  const router = useRouter()
 
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const userRole = (user as { role?: string } | undefined)?.role
  const dashboardHref =
    userRole === "technician" ? "/dashboard/technician" : "/dashboard/customer"


     if (pathname.startsWith("/dashboard")) return null;


    const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/browse-services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
   { label: "Dashboard", href: `/dashboard/${session?.user.role || 'customer'}` },
]

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error(error.message || "Failed to sign out. Please try again.")
        return
      }

      setIsAccountOpen(false)
      setIsSheetOpen(false)
      toast.success("Signed out successfully.")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Something went wrong while signing out.")
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-4 z-50 w-full animate-in px-4 duration-700 fade-in slide-in-from-top-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/85 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:border-indigo-100/80 hover:shadow-[0_12px_36px_rgb(79,70,229,0.1)] sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-all duration-300 group-hover:scale-105 group-hover:-rotate-6 group-hover:shadow-indigo-500/40 group-active:scale-95">
            <Wrench className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-12" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-xl font-bold tracking-tight text-transparent transition-colors group-hover:from-indigo-600 group-hover:to-violet-600">
            FixMate
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <li key={item.label} className="relative">
                <Link
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-indigo-50/90 font-semibold text-indigo-600 shadow-2xs"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                  )}
                >
                  {item.label}
                  {/* Active Indicator Dot */}
                  <span
                    className={cn(
                      "absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600 transition-all duration-300",
                      isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200/80" />
          ) : user ? (
            <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
              <DialogTrigger >
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="group relative flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 py-1 pr-3 pl-1 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 active:translate-y-0"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 ring-2 ring-indigo-500/20 transition-all duration-300 group-hover:ring-indigo-500/50">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? "User avatar"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <span className="max-w-[110px] truncate text-sm font-medium text-slate-700 transition-colors group-hover:text-indigo-600">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                </button>
              </DialogTrigger>

              <DialogContent className="overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-0 shadow-[0_24px_60px_-15px_rgba(79,70,229,0.2)] backdrop-blur-xl sm:max-w-sm">
                {/* Top Header Banner */}
                <div className="bg-gradient-to-br from-indigo-50 via-violet-50/60 to-white px-6 pt-6 pb-5">
                  <DialogHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
                    <Avatar className="h-14 w-14 shadow-md shadow-indigo-500/15 ring-2 ring-white">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name ?? "User avatar"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <DialogTitle className="truncate text-lg font-bold text-slate-900">
                        {user.name || "FixMate User"}
                      </DialogTitle>
                      <DialogDescription className="truncate text-xs text-slate-500">
                        {user.email}
                      </DialogDescription>
                      {userRole && (
                        <span className="mt-1.5 inline-flex items-center rounded-full bg-indigo-100/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-indigo-700 capitalize">
                          {userRole}
                        </span>
                      )}
                    </div>
                  </DialogHeader>
                </div>

                {/* Account Actions */}
                <div className="flex flex-col gap-2 p-4">
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsAccountOpen(false)}
                    className="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-indigo-50/70 hover:text-indigo-700"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      Dashboard
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsAccountOpen(false)}
                    className="group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-indigo-50/70 hover:text-indigo-700"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <UserIcon className="h-4 w-4" />
                      </span>
                      Profile Settings
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-500" />
                  </Link>

                  <hr className="my-1 border-slate-100" />

                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className="h-11 w-full justify-start gap-3 rounded-2xl px-4 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 active:scale-[0.98]"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      {isSigningOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                    </span>
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="rounded-full px-4 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-900 active:scale-95"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:translate-y-0 active:scale-95">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-700 transition-transform duration-200 hover:bg-slate-100 active:scale-95"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-80 flex-col border-l border-white/80 bg-white/95 p-6 backdrop-blur-xl"
            >
              <SheetTitle className="flex items-center gap-2.5 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-slate-900">
                  FixMate
                </span>
              </SheetTitle>

              {/* Mobile User Card (if signed in) */}
              {user && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl border border-indigo-100/80 bg-indigo-50/50 p-3.5">
                  <Avatar className="h-11 w-11 ring-2 ring-white">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? "User avatar"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div className="mt-6 flex flex-1 flex-col gap-1.5">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsSheetOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-indigo-50 font-semibold text-indigo-600"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      )}
                    </Link>
                  )
                })}

                <hr className="my-3 border-slate-100" />

                {/* Mobile Auth Actions */}
                <div className="flex flex-col gap-2">
                  {isPending ? (
                    <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
                  ) : user ? (
                    <>
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50/70 hover:text-indigo-600"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-indigo-50/70 hover:text-indigo-600"
                      >
                        <UserIcon className="h-4 w-4" />
                        Profile
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={isSigningOut}
                        onClick={handleSignOut}
                        className="mt-2 h-11 w-full justify-start gap-3 rounded-xl px-4 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {isSigningOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        {isSigningOut ? "Signing out..." : "Sign Out"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="h-11 w-full rounded-full border-slate-200 text-slate-700 transition-all active:scale-95"
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button className="h-11 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 font-semibold text-white shadow-md shadow-indigo-500/25 transition-all hover:brightness-105 active:scale-95">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}