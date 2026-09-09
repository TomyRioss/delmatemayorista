import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { SESSION_COOKIE, getSessionToken } from "@/lib/admin-auth";

const CARPETAS = ["productos", "categorias", "banner-hero", "banner-personalizado", "ventanas-laterales"];
const MAX_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  const cookieToken = (await cookies()).get(SESSION_COOKIE)?.value;
  if (cookieToken !== (await getSessionToken())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  const result = await handleUpload({
    request,
    body,
    onBeforeGenerateToken: async (pathname) => {
      const [carpeta] = pathname.split("/");
      if (!CARPETAS.includes(carpeta)) {
        throw new Error("Carpeta inválida.");
      }
      return {
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
        maximumSizeInBytes: MAX_BYTES,
        addRandomSuffix: false,
        allowOverwrite: true,
      };
    },
    onUploadCompleted: async () => {},
  });
  return Response.json(result);
}
