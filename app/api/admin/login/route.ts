import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, generarTokenSesion, validarCredenciales } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Ingresá tu email y contraseña." }, { status: 400 });
    }

    if (!validarCredenciales(email, password)) {
      return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
    }

    const token = await generarTokenSesion(email, password);

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 horas
    });

    return response;
  } catch (error) {
    console.error("Error en POST /api/admin/login", error);
    return NextResponse.json(
      { error: "No pudimos iniciar sesión. Intentá nuevamente." },
      { status: 500 }
    );
  }
}
