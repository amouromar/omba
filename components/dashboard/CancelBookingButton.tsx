"use client";

import { cancelBooking } from "@/app/actions/booking";
import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setIsPending(true);
    const result = await cancelBooking(bookingId);
    setIsPending(false);

    if (!result.success) {
      alert("Failed to cancel booking: " + result.error);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <XCircle size={14} />
      )}
      Cancel
    </button>
  );
}
