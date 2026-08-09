"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Users, Mail, Menu, X } from "lucide-react";

const secondaryLinks = [
  { href: "#productos", label: "Todos los productos" },
  { href: "#categorias", label: "Categorias" },
  { href: "/personalizados", label: "Productos personalizados", bold: true },
  { href: "/como-comprar", label: "Como hacer tu compra" },
  { href: "/personalizados", label: "Ofertas" },
];

const iconLinks = [
  { href: "#quienes-somos", label: "Quienes somos", icon: Users },
  { href: "#contacto", label: "Contacto", icon: Mail },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-[#FF3412]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-4 px-4 py-4 sm:gap-10 sm:px-6 sm:py-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 flex-col items-center justify-center">
            <span className="font-serif text-lg font-black uppercase tracking-widest text-black sm:text-2xl">
              Mayorista
            </span>
            <div className="-mt-4 flex h-16 w-16 items-center justify-center sm:-mt-6 sm:h-28 sm:w-28">
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
          <div className="order-3 flex min-w-[280px] flex-1 basis-full items-center gap-3 rounded-full bg-white px-5 py-3 sm:order-none sm:basis-auto sm:px-6 sm:py-4">
            <input
              type="text"
              placeholder="QUE ESTAS BUSCANDO ?"
              className="w-full bg-transparent text-sm font-semibold uppercase tracking-wide text-black placeholder:text-black/50 focus:outline-none sm:text-base"
            />
            <Search className="h-6 w-6 shrink-0 text-black" strokeWidth={2} />
          </div>

          {/* Iconos desktop */}
          <div className="hidden items-center gap-6 text-white sm:gap-10 md:flex">
            {iconLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} className="flex flex-col items-center gap-1.5 hover:opacity-80">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
                <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">{label}</span>
              </a>
            ))}
            <a href="#carrito" className="flex flex-col items-center gap-1.5 hover:opacity-80">
              <Image src="/carrito.png" alt="Carrito" width={112} height={112} className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
              <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">Mi carrito</span>
            </a>
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30 md:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-7 w-7" strokeWidth={2.5} /> : <Menu className="h-7 w-7" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="border-b border-black/10 bg-white shadow-lg md:hidden">
          <nav className="mx-auto flex max-w-[1500px] flex-col px-4 py-4">
            {secondaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`border-b border-black/5 py-3 text-sm font-bold uppercase tracking-wide text-black transition-colors last:border-b-0 hover:text-[#FF3412] ${link.bold ? "font-black" : ""}`}
              >
                {link.label}
              </a>
            ))}

            {/* Iconos móvil */}
            <div className="mt-4 flex items-center justify-around border-t border-black/10 pt-4">
              {iconLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-1.5 text-black hover:text-[#FF3412]"
                >
                  <Icon className="h-6 w-6" strokeWidth={2} />
                  <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
                </a>
              ))}
              <a
                href="#carrito"
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 text-black hover:text-[#FF3412]"
              >
                <Image src="/carrito.png" alt="Carrito" width={112} height={112} className="h-16 w-16 object-contain" />
                <span className="text-[10px] font-bold uppercase tracking-wide">Mi carrito</span>
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Nav desktop */}
      <nav className="hidden w-full border-b border-black/10 bg-white md:block">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-y-2 px-4 py-6 text-xs font-bold uppercase tracking-wide text-black sm:px-6 sm:text-sm">
          {secondaryLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-[#FF3412] ${link.bold ? "font-black" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}