import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin, getUserProfile } from "@/lib/users";
import { Profile } from "@/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isUserAdmin = await isAdmin();
  const profile = await getUserProfile();

  if (!isUserAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-muted/40 px-6 py-4">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">
              OMBA <span className="text-primary text-sm">ADMIN</span>
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link
                href="/admin"
                className="hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/cars"
                className="hover:text-primary transition-colors"
              >
                Cars
              </Link>
              <Link
                href="/admin/bookings"
                className="hover:text-primary transition-colors"
              >
                Bookings
              </Link>
              <Link
                href="/admin/users"
                className="hover:text-primary transition-colors"
              >
                Users
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                {(profile as Profile | null)?.full_name || "Admin User"}
              </span>
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
