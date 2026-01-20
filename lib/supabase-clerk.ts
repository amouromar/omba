import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client that authenticates using the Clerk session token.
 * This should be used in Server Components and Server Actions.
 */
export async function createServerSupabaseClient() {
  const { getToken } = await auth();
  const token = await getToken();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
      auth: {
        persistSession: false,
      },
    },
  );
}
