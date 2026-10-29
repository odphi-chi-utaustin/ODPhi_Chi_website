import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// RFC 8058 one-click unsubscribe: Gmail/Yahoo POST here when someone hits their
// built-in "Unsubscribe" button. The token is the auth.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  if (/^[0-9a-f-]{36}$/i.test(token)) {
    await createSupabaseAdminClient()
      .from("newsletter_subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("token", token)
      .is("unsubscribed_at", null);
  }
  return new NextResponse(null, { status: 200 });
}

// Someone opened the header URL in a browser: send them to the confirm page.
export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/newsletter/unsubscribe";
  return NextResponse.redirect(url);
}
