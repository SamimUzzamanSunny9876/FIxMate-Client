"use client"

import React, { useState } from "react"
import Link from "next/link"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { Wrench, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { UserRole } from "@/types/fixmate"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

interface FormErrors {
  email?: string
  password?: string
}

function getDashboardRoute(role?: UserRole): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin"
    case "technician":
      return "/dashboard/technician"
    case "customer":
    default:
      return "/dashboard/customer"
  }
}

export default function SignInPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Supports redirecting back to a protected page or service details page
  const rawCallback =
    searchParams.get("redirectTo") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("redirect")

  const safeCallbackUrl =
    rawCallback && rawCallback.startsWith("/") ? rawCallback : null

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      newErrors.password = "Password is required."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || "Invalid email or password.")
        return
      }

      const userRole = (data?.user as { role?: UserRole })?.role
      const targetUrl = safeCallbackUrl || getDashboardRoute(userRole)

      toast.success("Signed in successfully! Welcome back.")
      router.replace(targetUrl)
      router.refresh()
    } catch {
      toast.error("Invalid credentials or server error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      })
        console.log(data);
      toast.success("Redirecting to Google...")
      router.push('/dashboard/customer')
    } catch {
      toast.error("Google sign in failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-12 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-slate-950",
        className
      )}
      {...props}
    >
      {/* Ambient Background Gradient Mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-200/45 via-sky-200/40 to-emerald-100/40 blur-3xl dark:from-indigo-600/20 dark:via-sky-600/15 dark:to-emerald-500/10" />
        <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-sky-100/40 blur-3xl dark:from-violet-600/20 dark:via-indigo-600/15 dark:to-sky-600/10" />
      </div>

      <div className="w-full max-w-md animate-in space-y-6 duration-700 fade-in slide-in-from-bottom-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-6">
              <Wrench className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              FixMate
            </span>
          </Link>
        </div>

        {/* Glassmorphic Sign In Card */}
        <Card className="rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.12)] backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/85 dark:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
          <CardHeader className="space-y-1.5 pb-4 text-center">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to manage your repairs, bookings, or services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} noValidate>
              <FieldGroup className="gap-4">
                {/* Google Social Login */}
                <Field>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    className="h-11 w-full rounded-xl border-slate-200/90 bg-white font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-slate-50/80 hover:shadow-sm dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-2 h-4 w-4"
                    >
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </Field>

                <FieldSeparator className="text-xs text-slate-400 *:data-[slot=field-separator-content]:bg-white/90 dark:text-slate-500 dark:*:data-[slot=field-separator-content]:bg-slate-900">
                  Or sign in with email
                </FieldSeparator>

                {/* Email */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email)
                        setErrors({ ...errors, email: undefined })
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-200/90 bg-white/90 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-500/20",
                      errors.email &&
                        "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10 dark:border-red-500/80"
                    )}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 animate-in text-xs font-medium text-red-500 duration-200 fade-in slide-in-from-top-1 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </Field>

                {/* Password */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </FieldLabel>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password)
                          setErrors({ ...errors, password: undefined })
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-200/90 bg-white/90 pr-10 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:border-indigo-400 dark:focus-visible:ring-indigo-500/20",
                        errors.password &&
                          "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10 dark:border-red-500/80"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 animate-in text-xs font-medium text-red-500 duration-200 fade-in slide-in-from-top-1 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </Field>

                {/* Submit Button */}
                <Field className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 hover:brightness-105 active:translate-y-0 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <FieldDescription className="pt-3 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Sign Up
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Bottom Trust Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Secure login with role-based access protection</span>
        </div>
      </div>
    </div>
  )
}
