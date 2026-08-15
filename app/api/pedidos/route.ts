import { NextResponse } from "next/server";
import { getInstallationToken } from "@/lib/github-app";

type PedidoItem = {
  producto: string;
  cantidad: number;
  precioUnitario: number;
};

type PedidoPayload = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  items: PedidoItem[];
  total: number;
};

function isValidPayload(body: unknown): body is PedidoPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  if (
    typeof b.nombre !== "string" ||
    !b.nombre.trim() ||
    typeof b.apellido !== "string" ||
    !b.apellido.trim() ||
    typeof b.email !== "string" ||
    !b.email.trim() ||
    typeof b.telefono !== "string" ||
    !b.telefono.trim()
  ) {
    return false;
  }

  if (!Array.isArray(b.items) || b.items.length === 0) return false;
  for (const item of b.items) {
    if (
      !item ||
      typeof item !== "object" ||
      typeof (item as PedidoItem).producto !== "string" ||
      typeof (item as PedidoItem).cantidad !== "number" ||
      (item as PedidoItem).cantidad <= 0 ||
      typeof (item as PedidoItem).precioUnitario !== "number" ||
      (item as PedidoItem).precioUnitario < 0
    ) {
      return false;
    }
  }

  if (typeof b.total !== "number" || b.total < 0) return false;

  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Datos de pedido incompletos." }, { status: 400 });
  }

  const timestamp = Date.now();
  const codigo = `PED-${timestamp}`;
  const fecha = new Date(timestamp).toISOString().slice(0, 10);

  const data = {
    codigo,
    fecha,
    nombre: body.nombre.trim(),
    apellido: body.apellido.trim(),
    email: body.email.trim(),
    telefono: body.telefono.trim(),
    items: body.items,
    total: body.total,
  };

  let token: string;
  try {
    token = await getInstallationToken();
  } catch (err) {
    console.error("Error al obtener installation token de GitHub App:", err);
    return NextResponse.json(
      { error: "No se pudo registrar el pedido. Contactanos por WhatsApp." },
      { status: 500 }
    );
  }

  const owner = "TomyRioss";
  const repo = "delmatemayorista";
  const filePath = `content/pedidos/${codigo.toLowerCase()}.json`;
  const content = Buffer.from(JSON.stringify(data, null, 2), "utf-8").toString("base64");

  const ghResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `Nuevo pedido ${codigo}`,
        content,
        branch: "main",
      }),
    }
  );

  if (!ghResponse.ok) {
    const errorBody = await ghResponse.text();
    console.error("Error al commitear pedido en GitHub:", ghResponse.status, errorBody);
    return NextResponse.json(
      { error: "No se pudo registrar el pedido. Contactanos por WhatsApp." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, codigo });
}
