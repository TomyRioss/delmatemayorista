"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCarrito } from "@/lib/cart-context";
import type { Producto } from "@/lib/products";

const PLACEHOLDER = "/categorias/placeholder.png";

export default function ProductCard(producto: Producto) {
  const {
    slug,
    nombre,
    precio,
    precioFormateado,
    precioOferta,
    precioOfertaFormateado,
    enOferta,
    imagenes,
    descripcion,
    cantidadMinima,
  } = producto;

  const [imageIndex, setImageIndex] = useState(0);
  const { agregar } = useCarrito();

  const imagenesMostradas = imagenes.length > 0 ? imagenes : [PLACEHOLDER];

  const prevImage = () =>
    setImageIndex((i) => (i === 0 ? imagenesMostradas.length - 1 : i - 1));
  const nextImage = () =>
    setImageIndex((i) => (i === imagenesMostradas.length - 1 ? 0 : i + 1));

  const handleAgregar = () => {
    agregar({
      slug,
      nombre,
      precio: enOferta && precioOferta !== null ? precioOferta : precio,
      precioFormateado: enOferta && precioOfertaFormateado ? precioOfertaFormateado : precioFormateado,
      imagen: imagenesMostradas[0],
      cantidadMinima,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-black/10 bg-white transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
        <Image
          src={imagenesMostradas[imageIndex]}
          alt={nombre}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {enOferta && (
          <span className="absolute right-2 top-2 rounded-full bg-[#F4C845] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black">
            Oferta
          </span>
        )}

        {imagenesMostradas.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextImage}
              aria-label="Siguiente imagen"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow hover:bg-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {descripcion && (
          <Dialog>
            <DialogTrigger className="absolute bottom-2 left-2 rounded-full bg-[#FF3412] px-3 py-1 text-xs font-bold uppercase text-white hover:bg-black">
              Descripción
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{nombre}</DialogTitle>
                <DialogDescription>{descripcion}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold text-black">{nombre}</h3>

        {enOferta && precioOfertaFormateado ? (
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xs font-semibold text-black/40 line-through">{precioFormateado}</p>
            <p className="text-base font-bold text-[#FF3412]">{precioOfertaFormateado}</p>
          </div>
        ) : (
          <p className="text-base font-bold text-[#FF3412]">{precioFormateado}</p>
        )}

        <p className="text-xs text-black/50">Cantidad mínima: {cantidadMinima}</p>

        <button
          type="button"
          onClick={handleAgregar}
          className="mt-2 flex items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
