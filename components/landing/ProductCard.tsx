"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info, ShoppingCart, X as XIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export type { Product };

export default function ProductCard({
  slug,
  name,
  price,
  priceValue,
  images,
  note,
  description,
  category,
  minQty,
}: Product) {
  const [imageIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addItem } = useCart();
  const image = images[imageIndex];
  const href = category ? `/tienda/${category}/${slug}` : undefined;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-black/10 bg-white transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
        <button
          type="button"
          onClick={() => image && setZoomOpen(true)}
          aria-label="Ampliar imagen"
          className="absolute inset-0 cursor-zoom-in"
        >
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}
        </button>

        <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
          <DialogContent
            overlayClassName="bg-white/85 backdrop-blur-md"
            className="w-auto max-w-[calc(100%-2rem)] border-none bg-transparent p-0 shadow-none ring-0 sm:max-w-2xl"
            showCloseButton={false}
          >
            <DialogHeader className="sr-only">
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-square w-[min(90vw,32rem)] overflow-hidden rounded-lg bg-white shadow-2xl">
              {image && (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 90vw, 32rem"
                  quality={90}
                />
              )}
            </div>
            <DialogClose
              render={
                <button
                  type="button"
                  aria-label="Cerrar"
                  className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-lg transition-colors hover:bg-[#FF3412] hover:text-white"
                />
              }
            >
              <XIcon className="h-4 w-4" />
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden p-3 sm:p-4">
        {description && (
          <Dialog>
            <DialogTrigger
              title="Ver Descripción"
              aria-label="Ver descripción"
              className="mb-2 flex min-h-[38px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm bg-[#FF3412] px-2 py-2 text-center text-[10px] font-bold leading-tight uppercase tracking-normal text-white transition-colors hover:bg-[#FF5C3D] sm:min-h-[44px] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-wide"
            >
              <Info className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
              <span className="line-clamp-2 sm:line-clamp-1">Ver Descripción</span>
            </DialogTrigger>
            <DialogContent
              className="max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-lg md:max-w-2xl"
              overlayClassName="bg-black/40 backdrop-blur-sm"
            >
              <div className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto px-6 pt-12 pb-7 text-center sm:px-10 sm:pt-14 sm:pb-9">
                <DialogHeader className="gap-4">
                  <DialogTitle className="rounded-md bg-[#FF3412] px-4 py-3 text-center text-base font-black uppercase leading-snug tracking-wide text-white sm:text-xl">
                    {name}
                  </DialogTitle>
                  <DialogDescription className="text-center text-base leading-relaxed text-black/80 sm:text-lg">
                    {description}
                  </DialogDescription>
                </DialogHeader>

                <p className="mt-2 text-base font-bold uppercase tracking-wide text-[#FF3412] sm:text-lg">
                  Compra mínima: {minQty} unidades
                </p>

                {(category || (note && !note.toLowerCase().includes("compra mínima"))) && (
                  <div className="mt-3 flex flex-col gap-2 border-t border-black/10 pt-4">
                    {category && (
                      <p className="text-xs font-semibold uppercase tracking-wide text-black/50 sm:text-sm">
                        Categoría: {category}
                      </p>
                    )}
                    {note && !note.toLowerCase().includes("compra mínima") && (
                      <p className="text-sm text-black/60 sm:text-base">{note}</p>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        {href ? (
          <Link href={href} className="hover:underline">
            <h3 className="line-clamp-2 min-h-[2rem] overflow-hidden text-sm font-semibold text-black">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="line-clamp-2 min-h-[2rem] overflow-hidden text-sm font-semibold text-black">
            {name}
          </h3>
        )}
        <p className="truncate text-base font-bold text-[#FF3412]">{price}</p>
        <p className="min-h-[1rem] truncate text-xs text-black/50">{note}</p>

        <div className="mt-auto flex min-h-[38px] items-stretch overflow-hidden rounded-sm sm:min-h-[44px]">
          <button
            type="button"
            onClick={() => addItem({ slug, name, image, priceValue, minQty })}
            className="flex flex-1 items-center justify-center gap-1.5 bg-[#FF3412] px-2 py-2 text-center text-[10px] font-bold leading-tight uppercase tracking-normal text-white transition-colors hover:bg-[#FF5C3D] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-wide"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="line-clamp-2 sm:line-clamp-1">Agregar al carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
}
