"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
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
  category,
  minQty,
}: Product) {
  const [imageIndex] = useState(0);
  const { addItem } = useCart();
  const image = images[imageIndex];
  const href = category ? `/tienda/${category}/${slug}` : undefined;

  const imageInner = image && (
    <Image
      src={image}
      alt={name}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 50vw, 25vw"
    />
  );

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-black/10 bg-white transition-shadow hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-zinc-50">
        {href ? (
          <Link
            href={href}
            aria-label={`Ver detalles de ${name}`}
            className="absolute inset-0"
          >
            {imageInner}
          </Link>
        ) : (
          imageInner
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-hidden p-3 sm:p-4">
        <h3 className="min-h-[2rem] text-sm font-semibold text-black">
          {name}
        </h3>
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
