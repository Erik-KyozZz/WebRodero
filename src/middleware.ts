import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

  // Rate Limiting for sensitive API routes (e.g. Auth, Messages, Checkout, Upload)
  if (pathname.startsWith("/api/auth/") || pathname.startsWith("/api/orders/") || pathname.startsWith("/api/checkout")) {
    const limitResult = rateLimit(ip, 40, 60 * 1000); // 40 requests per minute
    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Por seguridad, intente de nuevo en un minuto." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isProtectedAdminRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = (token?.role as string) || "";

    if (!token || !["admin", "moderator"].includes(userRole)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren credenciales de administrador." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();
  // Enforce security headers on response
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*", "/api/orders/:path*", "/api/checkout/:path*"],
};
