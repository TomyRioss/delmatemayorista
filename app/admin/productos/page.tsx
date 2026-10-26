import Link from "next/link";
import Image from "next/image";
import { pbList, pbFileUrl } from "@/lib/pb";
import { getCategorias } from "@/lib/pb";
import type { CategoriaPb } from "@/lib/pb";
import type { ProductoPbShape } from "@/lib/admin-types";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const [items, categorias] = await Promise.all([
    pbList<ProductoPbShape>("productos", { sort: "-id" }),
    getCategorias(),
  ]);
  const catById = new Map<string, CategoriaPb>(categorias.map((c) => [c.id, c]));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black uppercase">Productos ({items.length})</h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Nuevo
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b-2 border-black/10 text-left text-xs font-bold uppercase tracking-wide text-black/50">
              <th className="px-3 py-3">Producto</th>
              <th className="px-3 py-3">Categoría</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Mínimo</th>
              <th className="px-3 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => {
              const cat = p.categoria ? catById.get(p.categoria) : null;
              const img = p.images?.[0] ? pbFileUrl("productos", p.id, p.images[0]) : null;
              return (
                <tr key={p.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="flex items-center gap-3 font-bold hover:text-[#FF3412]"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                        {img && (
                          <Image src={img} alt="" fill className="object-cover" sizes="40px" unoptimized />
                        )}
                      </span>
                      <span className="line-clamp-1 max-w-[300px]">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-black/60">{cat?.label ?? "—"}</td>
                  <td className="px-3 py-2">${p.price ?? "—"}</td>
                  <td className="px-3 py-2">{p.min_packs ?? "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {p.oferta && <span className="rounded-sm bg-[#FF3412]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#FF3412]">OFERTA</span>}
                      {p.novedad && <span className="rounded-sm bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">NOVEDAD</span>}
                      {p.pausado && <span className="rounded-sm bg-black/10 px-1.5 py-0.5 text-[10px] font-bold text-black/60">PAUSADO</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
