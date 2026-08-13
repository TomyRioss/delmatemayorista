import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  const cookieToken = request.cookies.get(SESSION_COOKIE)?.value;
  const expectedToken = await getSessionToken();

  if (cookieToken === expectedToken) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/keystatic")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
