"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Users, Mail, ChevronRight, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const secondaryLinks = [
  { href: "/#productos", label: "Todos los productos" },
  { href: "/tienda", label: "Categorias" },
  { href: "/ofertas", label: "Ofertas y novedades" },
  
];

const iconLinks = [
  { href: "/quienes-somos", label: "Quienes somos", icon: Users },
  { href: "/contacto", label: "Contacto", icon: Mail },
];

export default function Navbar() {
  const { totalCount, openCart } = useCart();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    router.push(`/buscar?q=${encodeURIComponent(String(query || ""))}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-[#FF3412]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-4 sm:gap-10 sm:px-6 sm:py-8">
          {/* Logo */}
          <Link href="/" className="order-1 flex w-full shrink-0 flex-col items-center justify-center sm:order-0 sm:w-auto">
            <div className="flex h-20 w-20 items-center justify-center sm:h-28 sm:w-28">
              <Image
                src="/logo.png"
                alt="Del Mate"
                width={112}
                height={112}
                className="h-full w-full object-contain"
                priority
              />
            </div>
          </Link>

          {/* Buscador */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="order-2 flex min-w-[280px] flex-1 basis-full items-center gap-3 rounded-full bg-white px-5 py-3 sm:basis-auto sm:px-6 sm:py-4"
          >
            <label htmlFor="navbar-search" className="sr-only">
              Buscar productos
            </label>
            <input
              id="navbar-search"
              name="q"
              type="search"
              placeholder="QUE ESTAS BUSCANDO ?"
              className="w-full bg-transparent text-sm font-semibold uppercase tracking-wide text-black placeholder:text-black/50 focus:outline-none sm:text-base"
            />
            <button type="submit" aria-label="Buscar" className="shrink-0">
              <Search className="h-6 w-6 text-black" strokeWidth={2} />
            </button>
          </form>

          {/* Botones secundarios móvil */}
          <div className="relative order-3 w-full basis-full sm:hidden">
            <div className="flex w-full gap-1.5 overflow-x-auto pr-8">
              {secondaryLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="shrink-0 whitespace-nowrap rounded-md border-2 border-black bg-[#F4C845] px-2.5 py-1.5 text-[11px] font-bold uppercase leading-tight tracking-wide text-black transition-colors hover:bg-[#E0B23A]"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-[#FF3412] via-[#FF3412]/90 to-transparent pl-6">
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md"
              >
                <ChevronRight className="h-4 w-4 text-[#FF3412]" strokeWidth={3.5} />
              </motion.div>
            </div>
          </div>

          {/* Iconos */}
          <div className="order-4 flex w-full basis-full items-center justify-center gap-6 text-white sm:order-2 sm:w-auto sm:basis-auto sm:gap-10">
            {iconLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} className="flex flex-col items-center gap-1.5 hover:opacity-80">
                <Icon className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">{label}</span>
              </a>
            ))}
            <button
              type="button"
              onClick={openCart}
              className="relative flex flex-col items-center gap-1.5 hover:opacity-80"
            >
              <Image src="/carrito.png" alt="Carrito" width={112} height={112} className="h-16 w-16 object-contain sm:h-28 sm:w-28" />
              {totalCount > 0 && (
                <span className="absolute top-0 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4C845] px-1 text-[11px] font-black text-black">
                  {totalCount}
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">Mi carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav desktop */}
      <nav className="hidden w-full border-b border-black/10 bg-white md:block">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-4 px-4 py-6 text-sm font-bold uppercase tracking-wide sm:px-6 sm:text-base">
          {secondaryLinks.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              className="flex items-center rounded-md border-2 border-black bg-[#F4C845] px-5 py-3 text-black transition-colors hover:bg-[#E0B23A]"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}