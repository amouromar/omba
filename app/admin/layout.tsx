import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Admin User</span>
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
