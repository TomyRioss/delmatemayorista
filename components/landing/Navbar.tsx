import Link from "next/link";
import Image from "next/image";
import { Search, Users, Mail } from "lucide-react";

const secondaryLinks = [
  { href: "#productos", label: "Todos los productos" },
  { href: "#categorias", label: "Categorias" },
  { href: "/personalizados", label: "Productos personalizados", bold: true },
  { href: "/como-comprar", label: "Como hacer tu compra" },
  { href: "/personalizados", label: "Ofertas" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-[#FF3412]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-8 px-4 py-6 sm:gap-10 sm:px-6 sm:py-8">
          <Link href="/" className="flex shrink-0 flex-col items-center justify-center">
            <span className="font-serif text-lg font-black uppercase tracking-widest text-black sm:text-2xl">
              Mayorista
            </span>
            <div className="-mt-4 flex h-20 w-20 items-center justify-center sm:-mt-6 sm:h-28 sm:w-28">
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

          <div className="flex min-w-[280px] flex-1 items-center gap-3 rounded-full bg-white px-5 py-3 sm:px-6 sm:py-4">
            <input
              type="text"
              placeholder="QUE ESTAS BUSCANDO ?"
              className="w-full bg-transparent text-sm font-semibold uppercase tracking-wide text-black placeholder:text-black/50 focus:outline-none sm:text-base"
            />
            <Search className="h-6 w-6 shrink-0 text-black" strokeWidth={2} />
          </div>

          <div className="flex items-center gap-6 text-white sm:gap-10">
            <a href="#quienes-somos" className="flex flex-col items-center gap-1.5 hover:opacity-80">
              <Users className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">Quienes somos</span>
            </a>
            <a href="#contacto" className="flex flex-col items-center gap-1.5 hover:opacity-80">
              <Mail className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2} />
              <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">Contacto</span>
            </a>
            <a href="#carrito" className="flex flex-col items-center gap-1.5 hover:opacity-80">
              <Image src="/carrito.png" alt="Carrito" width={112} height={112} className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
              <span className="text-[10px] font-bold uppercase tracking-wide sm:text-xs">Mi carrito</span>
            </a>
          </div>
        </div>
      </div>

      <nav className="w-full border-b border-black/10 bg-white">
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
