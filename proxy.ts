import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, obtenerTokenEsperado } from "@/lib/auth";

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};

export async function proxy(request: NextRequest) {
  try {
    const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const tokenEsperado = await obtenerTokenEsperado();

    if (cookie && cookie === tokenEsperado) {
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Error validando la sesión de administrador en el proxy", error);
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}
