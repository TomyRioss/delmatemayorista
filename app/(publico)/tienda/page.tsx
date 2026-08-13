import Image from "next/image";
import Link from "next/link";
import { reader } from "@/lib/keystatic";

export default async function TiendaPage() {
  const categoriasRaw = await reader.collections.categorias.all();
  const categorias = categoriasRaw.map((c) => ({
    slug: c.slug,
    label: c.entry.label,
    image: c.entry.image ?? "/categorias/placeholder.png",
  }));

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-10 sm:px-6">
        <h1 className="mb-6 inline-block border-2 border-black bg-[#F4C845] px-4 py-2 text-2xl font-extrabold uppercase tracking-tight text-black sm:text-3xl">
          Categorías
        </h1>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categorias.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tienda/${cat.slug}`}
              className="group relative flex h-32 items-center justify-center overflow-hidden rounded-sm sm:h-40"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative text-center text-sm font-black uppercase tracking-wide text-white sm:text-base">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
