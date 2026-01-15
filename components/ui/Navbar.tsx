import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="font-bold text-xl">
        Omba
      </Link>
      <div className="space-x-4">
        <Link href="/cars">Cars</Link>
        <Link href="/bookings">Bookings</Link>
        <Link href="/auth/login">Login</Link>
      </div>
    </nav>
  );
};
