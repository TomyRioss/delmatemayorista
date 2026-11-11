"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export type ProductoTableItem = {
  id: string;
  name: string;
  price: number | null;
  created: string;
  category: string | null;
  min_packs: number | null;
  image: string | null;
  oferta: boolean;
  novedad: boolean;
  pausado: boolean;
  posicion: number | null; // puesto en inicio/catalogo; null si esta pausado
};

type SortOption = "position" | "newest" | "oldest" | "name-asc" | "name-desc" | "price-asc" | "price-desc";

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-AR");
}

function createdTime(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export default function ProductosTable({ items }: { items: ProductoTableItem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  const visibleItems = useMemo(() => {
    const search = normalize(query.trim());
    const filtered = items.filter((item) => normalize(`${item.name} ${item.category ?? ""}`).includes(search));

    return filtered.sort((a, b) => {
      switch (sort) {
        case "position":
          return (a.posicion ?? Infinity) - (b.posicion ?? Infinity);
        case "oldest":
          return createdTime(a.created) - createdTime(b.created);
        case "name-asc":
          return a.name.localeCompare(b.name, "es", { sensitivity: "base", numeric: true });
        case "name-desc":
          return b.name.localeCompare(a.name, "es", { sensitivity: "base", numeric: true });
        case "price-asc":
          if (a.price == null) return b.price == null ? 0 : 1;
          if (b.price == null) return -1;
          return a.price - b.price;
        case "price-desc":
          if (a.price == null) return b.price == null ? 0 : 1;
          if (b.price == null) return -1;
          return b.price - a.price;
        case "newest":
        default:
          return createdTime(b.created) - createdTime(a.created);
      }
    });
  }, [items, query, sort]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-semibold text-black">
          <span>Buscar</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Producto o categoría"
            className="h-11 w-full rounded-sm border-2 border-black/15 bg-white px-3 text-sm font-normal text-black placeholder:text-black/45 focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3412] focus-visible:ring-offset-2"
          />
        </label>

        <label className="flex shrink-0 flex-col gap-1 text-sm font-semibold text-black">
          <span>Ordenar por</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-11 min-w-52 rounded-sm border-2 border-black/15 bg-white px-3 text-sm text-black focus:border-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3412] focus-visible:ring-offset-2"
          >
            <option value="position">Puesto en la web</option>
            <option value="newest">Fecha: más recientes</option>
            <option value="oldest">Fecha: más antiguas</option>
            <option value="name-asc">Nombre: A a Z</option>
            <option value="name-desc">Nombre: Z a A</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </label>
      </div>

      <p className="mt-2 text-xs text-black/55" aria-live="polite">
        {query.trim() ? `${visibleItems.length} de ${items.length} productos` : `${items.length} productos`}
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b-2 border-black/10 text-left text-xs font-bold uppercase tracking-wide text-black/55">
              <th className="px-3 py-3" title="Puesto en inicio y catálogo">Puesto</th>
              <th className="px-3 py-3">Producto</th>
              <th className="px-3 py-3">Categoría</th>
              <th className="px-3 py-3">Precio</th>
              <th className="px-3 py-3">Mínimo</th>
              <th className="px-3 py-3">Flags</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.length === 0 ? (
              <tr>
                <td colSpan={6}className="px-4 py-12 text-center">
                  <p className="font-semibold text-black">No encontramos productos para “{query}”.</p>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-2 text-sm font-bold text-[#C3270C] underline underline-offset-4 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3412]"
                  >
                    Limpiar búsqueda
                  </button>
                </td>
              </tr>
            ) : (
              visibleItems.map((item) => (
                <tr key={item.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                  <td className="px-3 py-2 font-black tabular-nums text-black/60">{item.posicion ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/productos/${item.id}`}
                      className="flex items-center gap-3 font-bold hover:text-[#FF3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3412]"
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-zinc-100">
                        {item.image && <Image src={item.image} alt="" fill className="object-cover" sizes="40px" />}
                      </span>
                      <span className="line-clamp-1 max-w-[300px]">{item.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-black/65">{item.category ?? "—"}</td>
                  <td className="px-3 py-2">${item.price ?? "—"}</td>
                  <td className="px-3 py-2">{item.min_packs ?? "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {item.oferta && <span className="rounded-sm bg-[#FF3412]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#C3270C]">OFERTA</span>}
                      {item.novedad && <span className="rounded-sm bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">NOVEDAD</span>}
                      {item.pausado && <span className="rounded-sm bg-black/10 px-1.5 py-0.5 text-[10px] font-bold text-black/65">PAUSADO</span>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
