import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type ItemPedido = {
  nombre: string;
  cantidad: number;
  precio: number;
};

type PedidoPayload = {
  comprador: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  items: ItemPedido[];
  total: number;
};

function esTextoValido(valor: unknown): valor is string {
  return typeof valor === "string" && valor.trim().length > 0;
}

function validarPedido(body: unknown): body is PedidoPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  const comprador = b.comprador as Record<string, unknown> | undefined;
  if (
    !comprador ||
    !esTextoValido(comprador.nombre) ||
    !esTextoValido(comprador.apellido) ||
    !esTextoValido(comprador.email) ||
    !esTextoValido(comprador.telefono)
  ) {
    return false;
  }

  if (!Array.isArray(b.items) || b.items.length === 0) return false;

  for (const item of b.items) {
    const i = item as Record<string, unknown>;
    if (
      !i ||
      !esTextoValido(i.nombre) ||
      typeof i.cantidad !== "number" ||
      i.cantidad <= 0 ||
      typeof i.precio !== "number" ||
      i.precio < 0
    ) {
      return false;
    }
  }

  if (typeof b.total !== "number" || b.total <= 0) return false;

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!validarPedido(body)) {
      return NextResponse.json(
        { error: "Los datos del pedido son inválidos. Revisá el formulario e intentá de nuevo." },
        { status: 400 }
      );
    }

    const codigo = `ord-${Date.now()}`;
    const pedido = {
      codigo,
      fecha: new Date().toISOString(),
      estado: "nuevo",
      comprador: body.comprador,
      items: body.items,
      total: body.total,
    };

    const directorio = path.join(process.cwd(), "content", "pedidos");
    await fs.mkdir(directorio, { recursive: true });
    await fs.writeFile(
      path.join(directorio, `${codigo}.json`),
      JSON.stringify(pedido, null, 2),
      "utf-8"
    );

    return NextResponse.json({ ok: true, codigo });
  } catch (error) {
    console.error("Error en POST /api/pedidos", error);
    return NextResponse.json(
      { error: "No pudimos registrar el pedido. Intentá nuevamente." },
      { status: 500 }
    );
  }
}
