"use client";

import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const BookingCancelPage = () => {
  // We could use searchParams to get bookingId if we tracked it,
  // but typically we just redirect user back.
  const searchParams = useSearchParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-surface px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={48} className="text-red-500" />
        </div>

        <h1 className="text-4xl font-black text-primary-main">
          Payment Cancelled
        </h1>
        <p className="text-neutral-text-secondary text-lg">
          Your payment was not processed and no booking has been made. You can
          try again or choose a different vehicle.
        </p>

        <div className="pt-8 space-y-4">
          <Link
            href="/cars"
            className="block w-full bg-primary-main text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            Browse Cars
          </Link>
          <Link
            href="/"
            className="block w-full bg-white border border-neutral-border text-neutral-text-secondary py-4 rounded-xl font-bold hover:border-primary-main transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelPage;
