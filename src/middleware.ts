import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1";

  // Rate Limiting for all API routes (60 requests per minute per IP)
  if (pathname.startsWith("/api/")) {
    const limitResult = rateLimit(ip, 60, 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Por motivos de seguridad, intente de nuevo en un minuto." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // Strict Admin route authorization
  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isProtectedAdminRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = (token?.role as string) || "";

    if (!token || !["admin", "moderator"].includes(userRole)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Acceso denegado. Se requieren credenciales de administración." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const res = NextResponse.next();

  // Bank-grade security headers enforcement on all responses
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
