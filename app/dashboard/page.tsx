import Link from "next/link";
import { getUserProfile } from "@/lib/users";
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { Profile } from "@/types";
import { VerificationStatus } from "@/components/auth/VerificationStatus";

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

        {/* 2. Verification Section - Dynamic based on status */}
        <VerificationStatus profile={profile} />

        {/* Data summary - Show for all authenticated users */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Bookings" value="0" />
          <StatCard title="Pending Payments" value="0" />
          <StatCard title="Active Rentals" value="0" />
        </div>

        {/* 3. Verified State - Additional content or specific UI */}
        {isVerified && (
          <section className="bg-background border rounded-2xl overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <h3 className="font-bold">Recent Activities</h3>
            </div>
            <div className="p-12 text-center text-muted-foreground">
              <p>No recent activities found.</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-background border rounded-2xl p-6 space-y-1">
    <p className="text-sm text-muted-foreground font-medium">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);
