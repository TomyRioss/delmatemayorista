import Link from "next/link";
import { pbList, pbFileUrl } from "@/lib/pb";
import { getCategorias } from "@/lib/pb";
import type { CategoriaPb } from "@/lib/pb";
import type { ProductoPbShape } from "@/lib/admin-types";
import { Plus } from "lucide-react";
import ProductosTable, { type ProductoTableItem } from "@/components/admin/ProductosTable";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const [items, categorias] = await Promise.all([
    pbList<ProductoPbShape>("productos", { sort: "-id" }),
    getCategorias(),
  ]);
  const catById = new Map<string, CategoriaPb>(categorias.map((c) => [c.id, c]));
  const tableItems: ProductoTableItem[] = items.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    created: product.created ?? "",
    category: product.categoria ? catById.get(product.categoria)?.label ?? null : null,
    min_packs: product.min_packs,
    image: product.images?.[0] ? pbFileUrl("productos", product.id, product.images[0]) : null,
    oferta: product.oferta,
    novedad: product.novedad,
    pausado: product.pausado,
  }));

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

      <ProductosTable items={tableItems} />
    </div>
  );
}
