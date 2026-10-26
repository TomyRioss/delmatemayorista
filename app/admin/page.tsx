import Link from "next/link";
import { pbList } from "@/lib/pb";
import { Box, Layers, Image as ImageIcon, ShoppingCart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [productos, categorias, banners, ventanas] = await Promise.all([
    pbList("productos", { perPage: 1 }).then((r) => (r as unknown as { length: number }).length).catch(() => -1),
    pbList("categorias").catch(() => []),
    pbList("banner_hero").catch(() => []),
    pbList("ventanas_laterales").catch(() => []),
  ]);

  const stats = [
    { href: "/admin/productos", label: "Productos", icon: Box, count: productos },
    { href: "/admin/categorias", label: "Categorías", icon: Layers, count: (categorias as unknown[]).length },
    { href: "/admin/banners", label: "Banners", icon: ImageIcon, count: (banners as unknown[]).length },
    { href: "/admin/pedidos", label: "Ventanas", icon: ShoppingCart, count: (ventanas as unknown[]).length },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black uppercase">Panel</h1>
      <p className="mt-1 text-sm text-black/60">
        Contenido del sitio, servido desde PocketBase.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex flex-col gap-2 rounded-sm border-2 border-black/10 bg-white p-5 transition-colors hover:border-black"
          >
            <s.icon className="h-5 w-5 text-[#FF3412]" strokeWidth={2.5} />
            <span className="text-3xl font-black">{s.count >= 0 ? s.count : "—"}</span>
            <span className="text-xs font-bold uppercase tracking-wide text-black/60">
              {s.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
