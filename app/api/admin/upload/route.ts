import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { SESSION_COOKIE, getSessionToken } from "@/lib/admin-auth";

const CARPETAS = ["productos", "categorias", "banner-hero", "banner-personalizado", "ventanas-laterales"];
const MAX_BYTES = 8 * 1024 * 1024;

function nombreSeguro(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return base || "imagen";
}

export async function POST(request: Request) {
  const cookieToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (cookieToken !== (await getSessionToken())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulario inválido." }, { status: 400 });
  }

  const file = form.get("file");
  const carpeta = String(form.get("carpeta") || "productos");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }
  if (!CARPETAS.includes(carpeta)) {
    return NextResponse.json({ error: "Carpeta inválida." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Máximo 8MB por imagen." }, { status: 400 });
  }

  const nombre = nombreSeguro(file.name);
  for (let intento = 0; intento < 3; intento++) {
    const ruta = intento === 0 ? `${carpeta}/${nombre}` : `${carpeta}/${Date.now()}-${nombre}`;
    try {
      const blob = await put(ruta, file, { access: "public", addRandomSuffix: false });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      if (intento === 2) {
        return NextResponse.json({ error: "No se pudo subir. Probá de nuevo." }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ error: "No se pudo subir." }, { status: 500 });
}
