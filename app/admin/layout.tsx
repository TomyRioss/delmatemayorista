import Link from "next/link";
import { ArrowLeft, Box, Image, Layers, ShoppingCart, BarChart3 } from "lucide-react";

const nav = [
  { href: "/admin/productos", label: "Productos", icon: Box },
  { href: "/admin/categorias", label: "Categorías", icon: Layers },
  { href: "/admin/banners", label: "Banners y ventanas", icon: Image },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/visits", label: "Visitas", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f5f2] lg:flex-row">
      <aside className="flex flex-col gap-8 bg-[#FF3412] px-6 py-8 lg:w-64 lg:px-6 lg:py-10">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/90 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
          Ver sitio
        </Link>

        <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-sm px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-white/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4 shrink-0" strokeWidth={2.5} />
              {item.label}
            </Link>
          ))}
        </nav>

        <p className="mt-auto hidden text-xs font-bold uppercase tracking-[0.2em] text-white/50 lg:block">
          Del Mate Mayorista
        </p>
      </aside>

      <main className="flex-1 px-5 py-8 sm:px-10">{children}</main>
    </div>
  );
}
