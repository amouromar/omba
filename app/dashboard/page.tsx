import Link from "next/link";
import { getUserProfile } from "@/lib/users";
import { AlertCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const profile = await getUserProfile();
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
          <div className="bg-background border rounded-lg p-1 flex items-center gap-2">
            {isVerified ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-md text-sm font-medium">
                <CheckCircle2 size={16} />
                Verified Account
              </div>
            ) : isPending ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-md text-sm font-medium">
                <Clock size={16} />
                Verification Pending
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded-md text-sm font-medium">
                <AlertCircle size={16} />
                Verification Required
              </div>
            )}
          </div>
        </header>

        {!isVerified && !isPending && (
          <div className="bg-primary-main/10 border border-primary-main/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-primary-main/20 p-4 rounded-full">
              <AlertCircle className="w-8 h-8 text-primary-main" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-xl font-bold">Complete Your Profile</h3>
              <p className="text-muted-foreground text-sm">
                To start renting cars and making payments, we need to verify
                your identity. Please upload your documents for manual review.
              </p>
            </div>
            <Link
              href="/profile/complete"
              className="bg-primary-main text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-all flex items-center gap-2"
            >
              Get Verified <ArrowRight size={18} />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Bookings" value="0" />
          <StatCard title="Pending Payments" value="0" />
          <StatCard title="Active Rentals" value="0" />
        </div>

        <section className="bg-background border rounded-2xl overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="font-bold">Recent Activities</h3>
          </div>
          <div className="p-12 text-center text-muted-foreground">
            <p>No recent activities found.</p>
          </div>
        </section>
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
