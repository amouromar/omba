"use server";

import { createServerSupabaseClient } from "@/lib/supabase-clerk";
import { revalidatePath } from "next/cache";

export async function cancelBooking(bookingId: string) {
  const supabase = await createServerSupabaseClient();

  // Verify auth is implicit via RLS policies on the 'bookings' table
  // Assuming RLS allows update if auth.uid() == user_id

  const { error } = await supabase
    .from("bookings")
    .update({ status: "CANCELLED" })
    .eq("id", bookingId);

  if (error) {
    console.error("Error cancelling booking:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
