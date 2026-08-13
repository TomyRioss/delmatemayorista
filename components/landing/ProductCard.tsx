"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, X as XIcon } from "lucide-react";
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

      <div className="flex flex-1 flex-col gap-1 overflow-hidden p-4">
        {href ? (
          <Link href={href} className="hover:underline">
            <h3 className="line-clamp-2 min-h-[2.5rem] overflow-hidden text-sm font-semibold text-black">
              {name}
            </h3>
          </Link>
        ) : (
          <h3 className="line-clamp-2 min-h-[2.5rem] overflow-hidden text-sm font-semibold text-black">
            {name}
          </h3>
        )}
        <p className="truncate text-base font-bold text-[#FF3412]">{price}</p>
        <p className="min-h-[1rem] truncate text-xs text-black/50">{note}</p>

        <button
          type="button"
          onClick={() => addItem({ slug, name, image, priceValue, minQty })}
          className="mt-auto flex items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2 text-xs font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <ShoppingCart className="h-4 w-4 shrink-0" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
