import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Anon-key client bound to the request's auth cookies. Used only to identify the
// signed-in user; it can't read portal tables (RLS, no policies).
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // Called from a Server Component, which can't set cookies.
            // proxy.ts refreshes the session instead.
          }
        },
      },
    },
  );
}
