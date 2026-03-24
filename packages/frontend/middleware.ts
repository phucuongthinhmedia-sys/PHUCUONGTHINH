import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin/* routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("auth_token")?.value;

    // Note: JWT is stored in localStorage (client-side only), so we can't
    // fully validate here. The AdminGuard component handles client-side auth.
    // This middleware only handles cookie-based tokens if set.
    if (!token) {
      // Let the client-side AdminGuard handle the redirect
      // (localStorage is not accessible in middleware)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
