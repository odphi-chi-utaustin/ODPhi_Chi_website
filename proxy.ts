import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Optimistic check only: bounce logged-out users away from /portal and
// logged-in users away from /login. Real authorization lives in lib/portal/auth.ts.
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Supabase falls back to the Site URL (the homepage) when the link's redirect
  // isn't on its Redirect URLs allowlist. Forward the code to the real callback.
  if (pathname === "/") {
    if (!searchParams.has("code") && !searchParams.has("token_hash")) {
      return NextResponse.next();
    }
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    return NextResponse.redirect(callback);
  }

  const { response, user } = await updateSession(request);

  if (pathname.startsWith("/portal") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/portal/:path*", "/login", "/auth/:path*"],
};
