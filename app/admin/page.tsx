import { supabase } from "@/lib/supabase";
import { Car, Calendar, Users, BarChart3, ImageIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const { count: carCount } = await supabase
    .from("cars")
    .select("*", { count: "exact", head: true });
  const { count: bookingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });
  const { count: categoryCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  const stats = [
    {
      label: "Total Cars",
      value: carCount || 0,
      icon: Car,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Bookings",
      value: bookingCount || 0,
      icon: Calendar,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Categories",
      value: categoryCount || 0,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Users",
      value: 0,
      icon: Users,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back to Omba&apos;s administration panel.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border bg-card shadow-sm space-y-4"
          >
            <div
              className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon className={stat.color} size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h2 className="text-3xl font-bold">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/cars"
              className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-center space-y-2"
            >
              <Car className="mx-auto text-primary" size={20} />
              <span className="text-sm font-medium">Manage Fleet</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-center space-y-2"
            >
              <Calendar className="mx-auto text-primary" size={20} />
              <span className="text-sm font-medium">View Bookings</span>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
              <div className="p-1 rounded bg-orange-500/20 text-orange-600 mt-0.5">
                <ImageIcon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">Missing Car Photos</p>
                <p className="text-xs text-muted-foreground">
                  Toyota Vitz (VIN-VITZ-001) has no photos uploaded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
