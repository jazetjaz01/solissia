import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { supabaseKey, supabaseUrl } from "./env";

// For Server Components, Server Actions and Route Handlers.
// Create a new client for every request.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component, which can't write cookies.
          // The proxy refreshes the session on every request instead.
        }
      },
    },
  });
}

// Verified claims of the signed-in user, or null.
export async function getClaims() {
  // Always per request, even before the keys are configured.
  await connection();
  if (!supabaseUrl || !supabaseKey) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
