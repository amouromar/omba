import Link from "next/link";
import { getUserProfile } from "@/lib/users";
import { createServerSupabaseClient } from "@/lib/supabase-clerk";
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { Profile, BookingWithCar } from "@/types";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

export default async function DashboardPage() {
  const profile = (await getUserProfile()) as Profile | null;

  // 1. Not Signed In State
  if (!profile) {
    return (
      <div className="container mx-auto px-4 pt-48 pb-12 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-primary-main/10 p-6 rounded-full">
          <ShieldAlert className="w-12 h-12 text-primary-main" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Access Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please sign in to view your account dashboard, manage bookings, and
            access your personal data.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="bg-primary-main text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  const { data: bookingsData } = await supabase
    .from("bookings")
    .select("*, cars(*)")
    .eq("user_id", profile.clerk_id)
    .order("created_at", { ascending: false });

  const bookings = (bookingsData as unknown as BookingWithCar[]) || [];

  const isVerified = profile?.is_verified;
  const isPending = profile?.national_id_number && !isVerified;

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {profile?.full_name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your bookings and account settings.
            </p>
          </div>
          <div className="bg-background border rounded-full p-1 flex items-center gap-2">
            {isVerified ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                <CheckCircle2 size={16} />
                Verified Account
              </div>
            ) : isPending ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-medium">
                <Clock size={16} />
                Verification Pending
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-full text-sm font-medium">
                <AlertCircle size={16} />
                Verification Required
              </div>
            )}
          </div>
        </header>

        <DashboardTabs profile={profile} bookings={bookings} />
      </div>
    </div>
  );
}
