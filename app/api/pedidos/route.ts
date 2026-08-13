import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

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

  const pedidosDir = path.join(process.cwd(), "content", "pedidos");
  await mkdir(pedidosDir, { recursive: true });

  const filePath = path.join(pedidosDir, `${codigo.toLowerCase()}.json`);
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

  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ ok: true, codigo });
}
