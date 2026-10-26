import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getSessionToken } from "@/lib/admin-auth";

export async function middleware(request: NextRequest) {
  // La pagina de login debe ser accesible sin sesion (evita loop de redirects).
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get(SESSION_COOKIE)?.value;
  const expectedToken = await getSessionToken();

  if (cookieToken === expectedToken) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  const host = request.headers.get("host");
  if (host) loginUrl.host = host;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/admin/subir-imagen", "/admin/visits"],
};
