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

export type Product = {
  name: string;
  price: string;
  images: string[];
  note?: string;
  description?: string;
};

export default function ProductCard({ name, price, images, note, description }: Product) {
  const [imageIndex, setImageIndex] = useState(0);

  const prevImage = () => setImageIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setImageIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-black/10 bg-white transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
        <Image
          src={images[imageIndex]}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />

        {images.length > 1 && (
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

        {description && (
          <Dialog>
            <DialogTrigger
              className="absolute bottom-2 left-2 rounded-full bg-[#FF3412] px-3 py-1 text-xs font-bold uppercase text-white hover:bg-black"
            >
              Descripción
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-sm font-semibold text-black">{name}</h3>
        <p className="text-base font-bold text-[#FF3412]">{price}</p>
        {note && <p className="text-xs text-black/50">{note}</p>}

        <button
          type="button"
          className="mt-2 flex items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
