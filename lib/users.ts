import { Profile } from "@/types";
import { currentUser } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from "./supabase-clerk";

/**
 * Get the current user's profile from Supabase.
 * If the profile doesn't exist, create it with basic info from Clerk.
 */
export async function getUserProfile(): Promise<Profile | null> {
  const user = await currentUser();
  if (!user) return null;

  const supabase = await createServerSupabaseClient();

  // Try to get existing profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  // If profile exists, return it
  if (profile && !error) {
    return profile as Profile;
  }

  // If profile doesn't exist, create it
  if (error?.code === "PGRST116") {
    const newProfile = {
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress || null,
      full_name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || null,
      phone_number: user.phoneNumbers[0]?.phoneNumber || null,
      avatar_url: user.imageUrl || null,
      is_verified: false,
      role: "USER" as const,
    };

    const { data: createdProfile, error: createError } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (createError) {
      console.error("Error creating profile:", createError);
      return null;
    }

    return createdProfile as Profile;
  }

  console.error("Error fetching profile:", error);
  return null;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "ADMIN";
}

export async function isVerified() {
  const profile = await getUserProfile();
  return profile?.is_verified === true;
}
