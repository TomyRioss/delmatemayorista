"use client";

import { useRef } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const categories = [
  {
    label: "MARROQUINERIA",
    image: "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg",
  },
  {
    label: "BAZAR",
    image: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg",
  },
  {
    label: "YERBAS Y MATES",
    image: "https://images.pexels.com/photos/13526973/pexels-photo-13526973.jpeg",
  },
  {
    label: "LIQUIDACION",
    image: "https://images.pexels.com/photos/8279921/pexels-photo-8279921.jpeg",
  },
  {
    label: "OFERTAS RELAMPAGO",
    image: "https://images.pexels.com/photos/7041902/pexels-photo-7041902.jpeg",
  },
  {
    label: "TERMOS",
    image: "https://images.pexels.com/photos/1004897/pexels-photo-1004897.jpeg",
  },
  {
    label: "MOCHILAS",
    image: "https://images.pexels.com/photos/1294731/pexels-photo-1294731.jpeg",
  },
  {
    label: "ACCESORIOS",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
  },
];

export default function HeroSlider() {
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
              key={cat.label}
              className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
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
