import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// Password sign-in goes through our server, so Supabase's per-IP rate limit sees
// Vercel's IPs, not the guesser's. This locks an email instead: MAX_FAILURES wrong
// passwords within WINDOW_MS locks password sign-in for that email for WINDOW_MS.
// Magic links are unaffected, so a member locked out by someone else can still get in.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Minutes until the email can try a password again, or 0 if it isn't locked.
// Fails open (0) if the table is missing or unreachable, so sign-in never breaks.
export async function lockedMinutes(email: string) {
  const { data } = await createSupabaseAdminClient()
    .from("login_attempts")
    .select("locked_until")
    .eq("email", email)
    .maybeSingle();
  const until = data?.locked_until ? new Date(data.locked_until).getTime() : 0;
  return until > Date.now() ? Math.ceil((until - Date.now()) / 60000) : 0;
}

export async function recordFailure(email: string) {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("login_attempts")
    .select("failures, last_failure")
    .eq("email", email)
    .maybeSingle();

  const now = Date.now();
  const recent = data?.last_failure && now - new Date(data.last_failure).getTime() < WINDOW_MS;
  const failures = (recent ? data.failures : 0) + 1;
  const lock = failures >= MAX_FAILURES;

  await admin.from("login_attempts").upsert({
    email,
    failures: lock ? 0 : failures,
    last_failure: new Date(now).toISOString(),
    locked_until: lock ? new Date(now + WINDOW_MS).toISOString() : null,
  });
}

export async function clearFailures(email: string) {
  await createSupabaseAdminClient().from("login_attempts").delete().eq("email", email);
}
