"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function ProductDetail({ product }: { product: Product }) {
  const { slug, note, minQty, variants } = product;
  const { addItem } = useCart();

  const options = [
    {
      id: "standard",
      name: product.name,
      price: product.price,
      priceValue: product.priceValue,
      images: product.images,
      description: product.description,
    },
    ...variants,
  ];

  const [optionId, setOptionId] = useState("standard");
  const selected = options.find((o) => o.id === optionId) ?? options[0];

  const [imageIndex, setImageIndex] = useState(0);
  const image = selected.images[imageIndex] ?? selected.images[0];

  const selectOption = (id: string) => {
    setOptionId(id);
    setImageIndex(0);
  };

  const handleAddToCart = () => {
    const isStandard = selected.id === "standard";
    addItem({
      slug: isStandard ? slug : `${slug}--${selected.id}`,
      name: isStandard ? selected.name : `${product.name} - ${selected.name}`,
      image,
      priceValue: selected.priceValue,
      minQty,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-zinc-50">
          {image && (
            <Image
              src={image}
              alt={selected.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          )}
        </div>
        {selected.images.length > 1 && (
          <div className="flex gap-2">
            {selected.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 ${
                  i === imageIndex ? "border-[#FF3412]" : "border-transparent"
                }`}
              >
                <Image src={img} alt={selected.name} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
          {product.name}
        </h1>
        <p className="text-2xl font-bold text-[#FF3412]">{selected.price}</p>

        {variants.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-black/60">Elegí una opción</span>
            <div className="flex flex-wrap gap-2">
              {options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => selectOption(o.id)}
                  className={`rounded-sm border-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                    o.id === optionId
                      ? "border-[#FF3412] bg-[#FF3412] text-white"
                      : "border-black/20 text-black hover:border-[#FF3412]"
                  }`}
                >
                  {o.id === "standard" ? "Estándar" : o.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {note && <p className="text-sm font-semibold text-black/60">{note}</p>}
        {selected.description && <p className="text-sm text-black/70">{selected.description}</p>}

        <button
          type="button"
          onClick={handleAddToCart}
          className="sticky bottom-4 z-10 mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white shadow-lg transition-colors hover:bg-black sm:static sm:w-auto sm:px-8 sm:shadow-none"
        >
          <ShoppingCart className="h-4 w-4 shrink-0" />
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
