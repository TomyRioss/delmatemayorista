"use client";

import { useState } from "react";
import ProductCard, { type Product } from "./ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PRODUCTS_PER_PAGE = 32;

const productNames = [
  "Mate de vidrio forrado",
  "Mate imperial cuero",
  "Bombilla acero premium",
  "Termo 1L acero",
  "Yerbera + azucarera",
  "Mate torpedo camionero",
  "Set mate + bombilla",
  "Termo 1L con manija",
  "Mate calabaza forrado",
  "Mate porcelana artesanal",
  "Bombilla pico loro",
  "Kit mate + termo regalo",
  "Yerbera acero inoxidable",
  "Mochila térmica mate",
  "Mate camionero cuero",
  "Bombilla alpaca",
];

const productImages = [
  "https://images.pexels.com/photos/13526973/pexels-photo-13526973.jpeg",
  "https://images.pexels.com/photos/8279921/pexels-photo-8279921.jpeg",
  "https://images.pexels.com/photos/7041902/pexels-photo-7041902.jpeg",
];

const totalProducts = 96;

const allProducts: Product[] = Array.from({ length: totalProducts }, (_, i) => ({
  name: productNames[i % productNames.length],
  price: `$${(3000 + (i % 15) * 850).toLocaleString("es-AR")}`,
  images: [
    productImages[i % productImages.length],
    productImages[(i + 1) % productImages.length],
  ],
  note: i % 5 === 0 ? "Compra mínima: 3 unidades" : undefined,
  description:
    "Compra mínima mayorista: 3 unidades. Consultar disponibilidad de talles y caja cerrada antes de confirmar el pedido.",
}));

export default function TodosLosProductos() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const pageProducts = allProducts.slice(start, start + PRODUCTS_PER_PAGE);

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="productos" className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
        <h2 className="mb-6 border-b border-black/10 pb-4 text-2xl font-extrabold tracking-tight text-[#FF3412] sm:text-3xl">
          Todos los productos
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {pageProducts.map((product, i) => (
            <ProductCard key={`${product.name}-${start + i}`} {...product} />
          ))}
        </div>

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
      </div>
    </section>
  );
}
