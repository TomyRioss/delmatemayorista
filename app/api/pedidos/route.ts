import { NextResponse } from "next/server";

const PB_URL = (
  process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096"
).replace(/\/$/, "");

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

  const now = new Date();
  const baParts = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {});
  const dia = baParts.day;
  const mes = baParts.month;
  const anio = baParts.year;
  const hora = baParts.hour === "24" ? "00" : baParts.hour;
  const minutos = baParts.minute;
  const anio2 = anio.slice(-2);
  // Codigo legible + sufijo corto de unicidad (PB id != legible, no hay colision
  // real porque el id autogenerado de PB es unico; el codigo es display).
  const codigo = `pedido-${dia}-${mes}-${anio2}-C${hora}${minutos}`;
  const fecha = `${anio}-${mes}-${dia}`;

  const res = await fetch(`${PB_URL}/api/collections/pedidos/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo,
      fecha,
      nombre: body.nombre.trim(),
      apellido: body.apellido.trim(),
      email: body.email.trim(),
      telefono: body.telefono.trim(),
      items: body.items,
      total: body.total,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Error al guardar pedido en PocketBase:", res.status, errorBody);
    return NextResponse.json(
      { error: "No se pudo registrar el pedido. Contactanos por WhatsApp." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, codigo });
}
