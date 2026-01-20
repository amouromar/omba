import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";

/**
 * Creates a Supabase client for use in Client Components.
 * This hook returns a Supabase client that authenticates using the Clerk session token.
 *
 * @example
 * function MyComponent() {
 *   const supabase = useSupabaseClient();
 *   // Use supabase client...
 * }
 */
export function useSupabaseClient() {
  const { getToken, userId } = useAuth();

  console.log("🔐 [Supabase Client] Initializing with Clerk userId:", userId);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          console.log("🌐 [Supabase Request] URL:", url);

          const token = await getToken({ template: "supabase" });

          if (token) {
            console.log("✅ [Auth Token] Token retrieved successfully");
            console.log(
              "📝 [Auth Token] Token preview:",
              token.substring(0, 50) + "...",
            );

            // Decode JWT to see claims (for debugging)
            try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              console.log("🔍 [JWT Payload]", payload);
              console.log("👤 [JWT] User ID (sub):", payload.sub);
            } catch (e) {
              console.error("❌ [JWT] Failed to decode token:", e);
            }
          } else {
            console.error(
              "❌ [Auth Token] No token retrieved! JWT template may not be configured.",
            );
          }

          const headers = new Headers(options.headers);
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }

          console.log(
            "📤 [Request Headers]",
            Object.fromEntries(headers.entries()),
          );

          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    },
  );

  return supabase;
}
