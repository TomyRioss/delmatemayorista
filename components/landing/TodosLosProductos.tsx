"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Producto } from "@/lib/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 32;

type Props = {
  productos: Producto[];
  titulo?: string;
  seccionId?: string;
  mensajeVacio?: string;
};

export default function TodosLosProductos({
  productos,
  titulo = "Todos los productos",
  seccionId = "productos",
  mensajeVacio = "Todavía no hay productos disponibles.",
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(productos.length / PRODUCTS_PER_PAGE));

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = productos.slice(start, start + PRODUCTS_PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id={seccionId} className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
        <h2 className="mb-6 border-b border-black/10 pb-4 text-2xl font-extrabold tracking-tight text-[#FF3412] sm:text-3xl">
          {titulo}
        </h2>

        {productos.length === 0 ? (
          <p className="py-10 text-center text-sm text-black/50">{mensajeVacio}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {pageProducts.map((producto) => (
                <ProductCard key={producto.slug} {...producto} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1) goToPage(page - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === page}
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages) goToPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </section>
  );
}
