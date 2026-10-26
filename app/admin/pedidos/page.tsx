import { pbList } from "@/lib/pb";
import { pbSuperuserAuth } from "@/lib/admin-auth";
import type { PbRecord } from "@/lib/pb";
import { ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

type PedidoItem = {
  producto: string;
  cantidad: number;
  precioUnitario: number;
};

type PedidoRow = PbRecord & {
  codigo: string;
  fecha: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  items: PedidoItem[];
  total: number;
};

async function getPedidos(): Promise<PedidoRow[]> {
  const token = await pbSuperuserAuth();
  const base = (process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096").replace(/\/$/, "");
  const res = await fetch(`${base}/api/collections/pedidos/records?perPage=200&sort=-id`, {
    headers: { Authorization: token },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PB pedidos -> ${res.status}`);
  const data = (await res.json()) as { items: PedidoRow[] };
  return data.items;
}

export default async function AdminPedidosPage() {
  let pedidos: PedidoRow[] = [];
  let error = "";
  try {
    pedidos = await getPedidos();
  } catch (e) {
    error = e instanceof Error ? e.message : "No se pudieron cargar los pedidos.";
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-[#FF3412]" />
        <h1 className="text-3xl font-black uppercase">Pedidos ({pedidos.length})</h1>
      </div>
      <p className="mt-1 text-sm text-black/60">Los pedidos que entran desde la tienda.</p>

      {error && (
        <div className="mt-6 rounded-sm border-2 border-[#FF3412] bg-white p-5 text-sm font-bold text-[#FF3412]">
          {error}
        </div>
      )}

      {pedidos.length === 0 && !error && (
        <p className="mt-8 rounded-sm border-2 border-dashed border-black/15 p-8 text-center text-sm font-bold text-black/40">
          Todavía no hay pedidos.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {pedidos.map((p) => {
          const items = Array.isArray(p.items) ? p.items : [];
          return (
            <details key={p.id} className="rounded-sm border-2 border-black/10 bg-white px-4 py-3">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm">
                <span className="font-bold">{p.codigo}</span>
                <span className="text-black/50">{p.fecha}</span>
                <span className="text-black/70">
                  {p.nombre} {p.apellido}
                </span>
                <span className="ml-auto font-bold text-[#FF3412]">
                  ${p.total?.toLocaleString("en-US")}
                </span>
              </summary>
              <div className="mt-4 border-t border-black/10 pt-4 text-sm">
                <div className="grid grid-cols-1 gap-1 text-black/70 sm:grid-cols-3">
                  <span>
                    <strong>Email:</strong> {p.email}
                  </span>
                  <span>
                    <strong>Tel:</strong> {p.telefono}
                  </span>
                </div>
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold uppercase text-black/40">
                      <th className="py-1">Producto</th>
                      <th className="py-1">Cant</th>
                      <th className="py-1">Unit.</th>
                      <th className="py-1">Sub.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-t border-black/5">
                        <td className="py-1">{it.producto}</td>
                        <td className="py-1">{it.cantidad}</td>
                        <td className="py-1">${it.precioUnitario}</td>
                        <td className="py-1 font-bold">${it.cantidad * it.precioUnitario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
