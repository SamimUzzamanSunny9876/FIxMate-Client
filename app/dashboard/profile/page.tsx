"use client";

import React, { useEffect, useState } from "react";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  FileText,
  Link2,
  ShieldCheck,
  Sparkles,
  Loader2,
  Save,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { User, UserRole } from "@/types/fixmate";
import { getUserProfile, profileUpdate } from "@/lib/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const roleBadgeStyles: Record<UserRole, string> = {
  admin:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/60 dark:bg-violet-950/50 dark:text-violet-300",
  technician:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300",
  customer:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300",
};

const ProfileUpdatePage = () => {
  const {
    data: session,
    isPending: isSessionLoading,
    refetch,
  } = authClient.useSession();

  const userEmail = session?.user?.email;

  const [profile, setProfile] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");

  const isLoading = isSessionLoading || (Boolean(userEmail) && isFetching);

  useEffect(() => {
    if (isSessionLoading || !userEmail) return;

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await getUserProfile(userEmail);
        if (isMounted) {
          setProfile(data);
          setName(data?.name || session?.user?.name || "");
          setImage(data?.image || session?.user?.image || "");
          setPhone(data?.phone || "");
          setArea(data?.area || "");
          setBio(data?.bio || "");
        }
      } catch {
        if (isMounted) {
          setName(session?.user?.name || "");
          setImage(session?.user?.image || "");
          toast.error("Could not load full profile details.");
        }
      } finally {
        if (isMounted) setIsFetching(false);
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isSessionLoading, userEmail, session?.user?.name, session?.user?.image]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userEmail) return;

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        image: image.trim(),
        phone: phone.trim(),
        area: area.trim(),
        bio: bio.trim(),
      };

      await profileUpdate(userEmail, payload);

      // Keep BetterAuth session synced if name/image changed
      await authClient
        .updateUser({
          name: payload.name,
          image: payload.image || undefined,
        })
        .catch(() => {});

      await refetch();

      setProfile((prev) => (prev ? { ...prev, ...payload } : prev));
      toast.success("Profile updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const displayRole: UserRole =
    profile?.role ||
    ((session?.user as { role?: UserRole } | undefined)?.role ?? "customer");

  const initials = (name || userEmail || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="animate-in fade-in slide-in-from-top-3 duration-500">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          Account Settings
        </div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          My Profile
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep your personal details, service area, and bio up to date.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="rounded-3xl p-6 lg:col-span-4">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </Card>
          <Card className="rounded-3xl p-6 lg:col-span-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Live Profile Preview Card */}
          <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 lg:col-span-4 dark:border-slate-800 dark:bg-slate-950/90">
            <div className="h-24 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500" />
            <CardContent className="-mt-12 flex flex-col items-center px-6 pb-6 text-center">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile avatar"}
                  className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 object-cover shadow-md dark:border-slate-950"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-md dark:border-slate-950">
                  {initials}
                </div>
              )}

              <h2 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                {name || "Your Name"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {userEmail}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full px-3 py-0.5 text-xs font-semibold capitalize",
                    roleBadgeStyles[displayRole]
                  )}
                >
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  {displayRole}
                </Badge>

                {displayRole === "technician" && profile?.plan && (
                  <Badge
                    variant="outline"
                    className="rounded-full border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold capitalize text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/50 dark:text-amber-300"
                  >
                    <Crown className="mr-1 h-3 w-3" />
                    {profile.plan} Plan
                  </Badge>
                )}
              </div>

              <div className="mt-5 w-full space-y-2.5 border-t border-slate-100 pt-4 text-left text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                  <span className="truncate">{phone || "No phone added"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                  <span className="truncate">{area || "No area added"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Edit Form */}
          <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-15px_rgba(79,70,229,0.08)] animate-in fade-in slide-in-from-bottom-5 duration-500 delay-75 lg:col-span-8 dark:border-slate-800 dark:bg-slate-950/90">
            <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Edit Profile Information
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <UserIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="h-11 rounded-xl pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-email" className="text-slate-500">
                      Email Address (Read-only)
                    </Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-email"
                        value={userEmail || ""}
                        readOnly
                        disabled
                        className="h-11 rounded-xl bg-slate-50 pl-9 dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Area */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1XXX-XXXXXX"
                        className="h-11 rounded-xl pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="profile-area">Area / Location</Label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="profile-area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Dhanmondi, Dhaka"
                        className="h-11 rounded-xl pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar Image URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-image">Profile Image URL</Label>
                  <div className="relative">
                    <Link2 className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="profile-image"
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/your-photo.jpg"
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <div className="relative">
                    <FileText className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-slate-400" />
                    <Textarea
                      id="profile-bio"
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={
                        displayRole === "technician"
                          ? "Tell customers about your repair skills, certifications, and years of experience..."
                          : "Write a short bio about yourself..."
                      }
                      className="resize-none rounded-xl pl-9"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdatePage;