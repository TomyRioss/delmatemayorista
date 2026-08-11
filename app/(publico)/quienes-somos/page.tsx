import Image from "next/image";
import Link from "next/link";
import { Truck, Package, Percent, MessageCircle } from "lucide-react";

const valores = [
  {
    icon: Package,
    titulo: "Stock real, todo el año",
    texto: "Mates, termos, mochilas, marroquinería y bazar siempre disponibles para reponer tu local.",
  },
  {
    icon: Percent,
    titulo: "Precio mayorista",
    texto: "Compra mínima accesible para que puedas revender con margen desde el primer pedido.",
  },
  {
    icon: Truck,
    titulo: "Envíos a todo el país",
    texto: "Despachamos a cualquier provincia, con seguimiento y tiempos claros.",
  },
  {
    icon: MessageCircle,
    titulo: "Atención directa",
    texto: "Hablás con nosotros por WhatsApp, sin cadenas de mails ni esperas.",
  },
];

export default function QuienesSomosPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <section className="bg-[#FF3412]">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="max-w-2xl text-3xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl">
            Quiénes somos
          </h1>
          <p className="mt-4 max-w-xl text-sm font-semibold text-white/90 sm:text-base">
            Somos Del Mate Mayorista: vendemos mates, termos, mochilas y marroquinería a comercios de todo el país.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1500px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="max-w-[65ch]">
            <h2 className="mb-4 text-xl font-black uppercase text-black sm:text-2xl">
              Mayoristas del mate, para tu negocio
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-black/70 sm:text-base">
              Trabajamos con kioscos, bazares, regalerías y comercios que buscan un proveedor confiable de productos
              relacionados al mate. Nuestro catálogo va desde mates y bombillas hasta termos, mochilas y artículos
              de marroquinería, pensado para que armes tu góndola sin complicarte buscando en varios lugares.
            </p>
            <p className="text-sm leading-relaxed text-black/70 sm:text-base">
              Compra mínima accesible, precio mayorista real y envíos a todo el país. Así trabajamos hace años con
              comercios que confían en nosotros para reponer stock.
            </p>
          </div>

          <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            <Image
              src="https://images.pexels.com/photos/8279921/pexels-photo-8279921.jpeg"
              alt="Mates y productos Del Mate Mayorista"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 700px"
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col divide-y divide-black/10 border-y border-black/10 sm:mt-20">
          {valores.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                <Icon className="h-7 w-7 shrink-0 text-[#FF3412]" strokeWidth={2} />
                <h3 className="text-base font-black uppercase text-black">{titulo}</h3>
              </div>
              <p className="text-sm leading-relaxed text-black/70 sm:text-base">{texto}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FF3412] px-6 py-6 sm:px-10 sm:py-8">
          <p className="text-lg font-black uppercase leading-tight text-white sm:text-2xl">
            ¿Querés ser revendedor Del Mate?
          </p>
          <Link
            href="https://wa.me/5491165358444"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase text-[#FF3412] transition-opacity hover:opacity-90 sm:text-base"
          >
            Escribinos por WhatsApp
          </Link>
        </div>
      </main>
    </div>
  );
}
