"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wrench, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export function NavBar() {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-white/80 bg-white/85 px-4 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)]">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
            <Wrench className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            FixMate
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <li key={item.label} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setActiveTab(item.label)}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 py-1",
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </Link>
                {/* Active Indicator Dot */}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-indigo-600 transition-all duration-300",
                    isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-full px-4 transition-colors"
          >
            Sign In
          </Button>
          <Button className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0">
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-slate-700 hover:bg-slate-100"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl">
              <SheetTitle className="flex items-center gap-2.5 text-left">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <Wrench className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-900">FixMate</span>
              </SheetTitle>

              <div className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => {
                  const isActive = activeTab === item.label;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setActiveTab(item.label);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-indigo-50 text-indigo-600 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      )}
                    </Link>
                  );
                })}

                <hr className="my-2 border-slate-100" />

                <div className="flex flex-col gap-2.5 px-1">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-slate-200 text-slate-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}