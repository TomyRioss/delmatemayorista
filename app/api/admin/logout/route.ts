import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  try {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(ADMIN_SESSION_COOKIE);
    return response;
  } catch (error) {
    console.error("Error en POST /api/admin/logout", error);
    return NextResponse.json(
      { error: "No pudimos cerrar la sesión. Intentá nuevamente." },
      { status: 500 }
    );
  }
}
