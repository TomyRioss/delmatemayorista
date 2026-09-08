"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { withCacheBust } from "@/lib/cache-bust";

type CategoryItem = {
  slug: string;
  label: string;
  image: string;
};

type Ventana = {
  imagen: string | null;
  video: string | null;
  link: string;
};

function VentanaFija({ ventana }: { ventana: Ventana }) {
  const media = ventana.video ? (
    <video
      src={withCacheBust(ventana.video)}
      autoPlay
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  ) : ventana.imagen ? (
    ventana.imagen.toLowerCase().endsWith(".gif") ? (
      // <img> para no romper la animación del GIF
      <img
        src={withCacheBust(ventana.imagen)}
        alt=""
        className="h-full w-full object-cover"
      />
    ) : (
      <Image
        src={withCacheBust(ventana.imagen)}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 50vw, 25vw"
      />
    )
  ) : (
    <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-xs font-bold uppercase text-neutral-400">
      Espacio para GIF
    </div>
  );

  const box = (
    <div className="relative h-28 w-full overflow-hidden rounded-sm sm:h-40">
      {media}
    </div>
  );

  if (!ventana.link) return box;

  const isExternal = ventana.link.startsWith("http");
  return (
    <Link
      href={ventana.link}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block"
    >
      {box}
    </Link>
  );
}

export default function HeroSlider({
  categories,
  ventanaIzquierda,
  ventanaDerecha,
}: {
  categories: CategoryItem[];
  ventanaIzquierda: Ventana;
  ventanaDerecha: Ventana;
}) {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Item 1 - fijo (izquierda). En mobile queda abajo a la izquierda. */}
        <div className="order-2 lg:order-1">
          <VentanaFija ventana={ventanaIzquierda} />
        </div>

        {/* Items 2 y 3 - categorías en loop automático (centro).
            En mobile arriba a ancho completo, en desktop las 2 columnas centrales. */}
        <div className="order-1 col-span-2 lg:order-2">
          <Carousel opts={{ loop: true, align: "start" }} plugins={[autoplay.current]}>
            <CarouselContent>
              {categories.map((cat) => (
                <CarouselItem key={cat.slug} className="basis-1/2">
                  <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-sm sm:h-40">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12vw"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <span className="relative text-center text-sm font-black uppercase tracking-wide text-white sm:text-base">
                      {cat.label}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Item 4 - fijo (derecha). En mobile queda abajo a la derecha. */}
        <div className="order-3">
          <VentanaFija ventana={ventanaDerecha} />
        </div>
      </div>
    </section>
  );
}
