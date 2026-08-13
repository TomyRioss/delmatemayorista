import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/landing/Footer";
import { getCategorias } from "@/lib/products";

export default async function CategoriasPage() {
  const categorias = await getCategorias();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[1500px] px-4 py-10 sm:px-6">
          <h1 className="mb-6 border-b border-black/10 pb-4 text-2xl font-extrabold uppercase tracking-tight text-[#FF3412] sm:text-3xl">
            Categorías
          </h1>

          {categorias.length === 0 ? (
            <p className="py-10 text-center text-sm text-black/50">
              Todavía no hay categorías cargadas.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {categorias.map((categoria) => (
                <Link
                  key={categoria.slug}
                  href={`/productos?categoria=${categoria.slug}`}
                  className="group relative flex h-40 items-center justify-center overflow-hidden rounded-sm sm:h-48"
                >
                  <Image
                    src={categoria.image}
                    alt={categoria.label}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
                  <span className="relative text-center text-base font-black uppercase tracking-wide text-white sm:text-lg">
                    {categoria.label}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
