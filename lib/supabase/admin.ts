import { createClient } from "@supabase/supabase-js";

// Service-role client. Bypasses RLS — server only, never import from a client component.
// Callers must gate access with requireMember()/requireExec() from lib/portal/auth.ts.
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
