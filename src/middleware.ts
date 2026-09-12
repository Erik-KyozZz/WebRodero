import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isProtectedAdminRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userRole = (token?.role as string) || "";

    // Permite el acceso tanto a "admin" como a "moderator"
    if (!token || !["admin", "moderator"].includes(userRole)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "No autorizado. Se requieren permisos de administración o moderación." },
          { status: 401 }
        );
      }

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
