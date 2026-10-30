import Link from "next/link";
import Image from "next/image";
import { pbList, pbFileUrl } from "@/lib/pb";
import type { CategoriaPb } from "@/lib/pb";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const items = await pbList<CategoriaPb>("categorias", { sort: "slug" });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-black uppercase">Categorías</h1>
        <Link
          href="/admin/categorias/nueva"
          className="inline-flex items-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <Plus className="h-4 w-4" strokeWidth={3} /> Nueva
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => {
          const img = pbFileUrl("categorias", c.id, c.image);
          return (
            <Link
              key={c.id}
              href={`/admin/categorias/${c.id}`}
              className="group flex flex-col overflow-hidden rounded-sm border-2 border-black/10 bg-white transition-colors hover:border-black"
            >
              <div className="relative aspect-[8/3.6] bg-zinc-100">
                {img && (
                  <Image
                    src={img}
                    alt={c.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
              <div className="flex flex-col gap-0.5 p-3">
                <span className="text-sm font-bold">{c.label}</span>
                <span className="text-xs text-black/50">{c.slug}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
