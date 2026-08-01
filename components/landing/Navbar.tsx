import Link from "next/link";
import Image from "next/image";

const secondaryLinks = [
  { href: "#productos", label: "Todos los productos" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "/catalogo", label: "Catálogo digital" },
  { href: "#envios", label: "Envíos al interior" },
  { href: "#envios", label: "Envío gratis CABA/AMBA" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="w-full bg-[#FF3412]">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-24 px-4 py-4 sm:px-6">
          <Link href="/" className="flex h-24 w-24 shrink-0 items-center justify-center">
            <Image
              src="/logo.png"
              alt="Del Mate"
              width={96}
              height={96}
              className="h-full w-full object-contain"
              priority
            />
          </Link>

          <div className="flex min-w-[320px] flex-1 items-center gap-2 rounded-full bg-white px-4 py-2">
            <input
              type="text"
              placeholder="QUE ESTAS BUSCANDO ?"
              className="w-full bg-transparent text-sm font-semibold uppercase tracking-wide text-black placeholder:text-black/50 focus:outline-none"
            />
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5 shrink-0 text-black"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="m20 20-3.5-3.5" />
            </svg>
          </div>

          <div className="flex items-center gap-12 text-xs font-bold text-white sm:text-sm">
            <a href="#sucursales" className="hover:text-black">
              Sucursales
            </a>
            <a href="#contacto" className="hover:text-black">
              Contacto
            </a>
            <a href="#carrito" className="flex flex-col items-center gap-1 hover:opacity-80">
              <Image src="/carrito.png" alt="Carrito" width={104} height={104} className="h-24 w-24 object-contain" />
              Carrito
            </a>
          </div>
        </div>
      </div>

      <nav className="w-full border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-y-2 px-4 py-3 text-xs font-bold uppercase tracking-wide text-black sm:px-6 sm:text-sm">
          {secondaryLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition-colors hover:text-[#FF3412]">
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
