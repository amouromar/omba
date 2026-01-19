import { supabase } from "./supabase";
import { auth } from "@clerk/nextjs/server";

export async function getUserProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "ADMIN";
}

export async function isVerified() {
  const profile = await getUserProfile();
  return profile?.is_verified === true;
}
