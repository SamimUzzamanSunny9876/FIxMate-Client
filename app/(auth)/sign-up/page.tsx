"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Wrench,
  User as UserIcon,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Upload,
} from "lucide-react"
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

type SelectableRole = Exclude<UserRole, "admin">

interface FormErrors {
  name?: string
  email?: string
  password?: string
}

export default function SignUpPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<SelectableRole>("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Live password rule checks
  const hasMinLength = password.length >= 6
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.")
      return
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview(null)
  }

  const uploadToImgBB = async (file: File): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
    if (!apiKey) {
      throw new Error("ImgBB API key is missing in .env.local.")
    }

    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.success) {
      throw new Error(data?.error?.message || "Failed to upload profile image.")
    }

    return data.data.display_url || data.data.url
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = "Full name is required."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address."
    }

    if (!password) {
      newErrors.password = "Password is required."
    } else if (!isPasswordValid) {
      newErrors.password =
        "Password must be at least 6 characters and include both uppercase and lowercase letters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      let uploadedImageUrl: string | undefined

      if (imageFile) {
        uploadedImageUrl = await uploadToImgBB(imageFile)
      }

    const { data, error } = await authClient.signUp.email({
  name: name.trim(),
  email: email.trim(),
  password,
  image: uploadedImageUrl,
  signupRole: role,
})

      if (error) {
        toast.error(error.message || "Failed to create account.")
        return
      }

      console.log("Created user:", data)
      toast.success("Account created successfully! Welcome to FixMate.")
      router.push(
        "/"
        // role === "technician" ? "/dashboard/technician" : "/dashboard/customer"
      )
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      // Replace with your BetterAuth Google social call:
      // await authClient.signIn.social({
      //   provider: "google",
      //   callbackURL: "/dashboard/customer",
      // });
      toast.success("Redirecting to Google...")
    } catch {
      toast.error("Google sign up failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        "relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {/* Ambient Background Gradient Mesh (matches Banner & Footer) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-32 right-0 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-indigo-200/45 via-sky-200/40 to-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-violet-200/40 via-indigo-100/30 to-sky-100/40 blur-3xl" />
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
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              FixMate
            </span>
          </Link>
        </div>

        {/* Glassmorphic Sign Up Card */}
        <Card className="rounded-3xl border border-white/80 bg-white/85 shadow-[0_20px_50px_-15px_rgba(79,70,229,0.12)] backdrop-blur-xl transition-all duration-300">
          <CardHeader className="space-y-1.5 pb-4 text-center">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Join FixMate to book trusted repairs or offer your services
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
                    onClick={handleGoogleSignUp}
                    className="h-11 w-full rounded-xl border-slate-200/90 bg-white font-medium text-slate-700 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-slate-50/80 hover:shadow-sm"
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

                <FieldSeparator className="text-xs text-slate-400 *:data-[slot=field-separator-content]:bg-white/90">
                  Or sign up with email
                </FieldSeparator>

                {/* Role Selection Cards (Customer / Technician only) */}
                <Field>
                  <FieldLabel className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
                    I want to join as
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={cn(
                        "group relative flex flex-col items-start gap-1.5 rounded-2xl border p-3.5 text-left transition-all duration-300",
                        role === "customer"
                          ? "border-indigo-500 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20"
                          : "border-slate-200/80 bg-white/70 hover:border-indigo-200 hover:bg-slate-50/80"
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                            role === "customer"
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                              : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                          )}
                        >
                          <UserIcon className="h-4 w-4" />
                        </span>
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                            role === "customer"
                              ? "scale-100 border-indigo-600 bg-indigo-600 text-white"
                              : "scale-90 border-slate-300"
                          )}
                        >
                          {role === "customer" && (
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          )}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Customer
                      </span>
                      <span className="text-[11px] leading-tight text-slate-500">
                        Book & track device repairs
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("technician")}
                      className={cn(
                        "group relative flex flex-col items-start gap-1.5 rounded-2xl border p-3.5 text-left transition-all duration-300",
                        role === "technician"
                          ? "border-indigo-500 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20"
                          : "border-slate-200/80 bg-white/70 hover:border-indigo-200 hover:bg-slate-50/80"
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                            role === "technician"
                              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                              : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                          )}
                        >
                          <Wrench className="h-4 w-4" />
                        </span>
                        <span
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
                            role === "technician"
                              ? "scale-100 border-indigo-600 bg-indigo-600 text-white"
                              : "scale-90 border-slate-300"
                          )}
                        >
                          {role === "technician" && (
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          )}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Technician
                      </span>
                      <span className="text-[11px] leading-tight text-slate-500">
                        List services & manage jobs
                      </span>
                    </button>
                  </div>
                </Field>

                {/* Full Name */}
                <Field>
                  <FieldLabel
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full Name
                  </FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tariqul Islam"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-200/90 bg-white/90 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                      errors.name &&
                        "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                    )}
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 animate-in text-xs font-medium text-red-500 duration-200 fade-in slide-in-from-top-1">
                      {errors.name}
                    </p>
                  )}
                </Field>

                {/* Email */}
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    Email Address
                  </FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email)
                        setErrors({ ...errors, email: undefined })
                    }}
                    className={cn(
                      "h-11 rounded-xl border-slate-200/90 bg-white/90 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                      errors.email &&
                        "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                    )}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 animate-in text-xs font-medium text-red-500 duration-200 fade-in slide-in-from-top-1">
                      {errors.email}
                    </p>
                  )}
                </Field>

                {/* Profile Photo Upload (Optional) */}
                <Field>
                  <FieldLabel
                    htmlFor="image"
                    className="text-sm font-medium text-slate-700"
                  >
                    Profile Photo{" "}
                    <span className="text-slate-400">(Optional)</span>
                  </FieldLabel>

                  <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200/90 bg-white/80 p-3">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="h-12 w-12 shrink-0 rounded-full border border-indigo-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Upload className="h-5 w-5" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="image"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {imageFile ? "Change Photo" : "Choose Image"}
                      </label>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="mt-1 truncate text-[11px] text-slate-400">
                        {imageFile
                          ? imageFile.name
                          : "PNG, JPG, or WEBP up to 5MB"}
                      </p>
                    </div>

                    {imageFile && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        aria-label="Remove selected image"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </Field>

                {/* Password */}
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password)
                          setErrors({ ...errors, password: undefined })
                      }}
                      className={cn(
                        "h-11 rounded-xl border-slate-200/90 bg-white/90 pr-10 text-slate-900 transition-all placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10",
                        errors.password &&
                          "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/10"
                      )}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Live Password Validation Rules */}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors",
                        hasMinLength
                          ? "font-medium text-emerald-600"
                          : "text-slate-400"
                      )}
                    >
                      {hasMinLength ? (
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      6+ characters
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors",
                        hasUppercase
                          ? "font-medium text-emerald-600"
                          : "text-slate-400"
                      )}
                    >
                      {hasUppercase ? (
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      1 uppercase
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors",
                        hasLowercase
                          ? "font-medium text-emerald-600"
                          : "text-slate-400"
                      )}
                    >
                      {hasLowercase ? (
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      1 lowercase
                    </span>
                  </div>

                  {errors.password && (
                    <p className="mt-1 animate-in text-xs font-medium text-red-500 duration-200 fade-in slide-in-from-top-1">
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
                        Creating Account...
                      </>
                    ) : (
                      `Sign Up as ${
                        role === "technician" ? "Technician" : "Customer"
                      }`
                    )}
                  </Button>

                  <FieldDescription className="pt-3 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-semibold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline"
                    >
                      Sign In
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Bottom Trust Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Secure authentication & pay-after-completion guarantee</span>
        </div>
      </div>
    </div>
  )
}