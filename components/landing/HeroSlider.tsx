"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

type CategoryItem = {
  slug: string;
  label: string;
  image: string;
};

export default function HeroSlider({ categories }: { categories: CategoryItem[] }) {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay.current]}
      >
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem
              key={cat.slug}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
            >
              <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-sm sm:h-40">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
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
    </section>
  );
}