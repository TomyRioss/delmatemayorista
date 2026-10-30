"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { withCacheBust } from "@/lib/cache-bust";

type Slide = {
  imagenDesktop: string;
  imagenMobile: string | null;
  link?: string;
};

export default function BannerHeroCarousel({ slides }: { slides: Slide[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (!slides.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, i) => {
            const isExternal = slide.link?.startsWith("http");
            // ponytail: aspect-ratio en vez de altura fija. Assets 600x300 (mobile) y 1500x400 (desktop).
            const image = (
              <div className="relative h-[clamp(120px,50vw,400px)] w-full overflow-hidden rounded-sm sm:h-[clamp(200px,26vw,387px)]">
                <Image
                  src={withCacheBust(isMobile && slide.imagenMobile ? slide.imagenMobile : slide.imagenDesktop)}
                  alt=""
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1536px) calc(100vw - 3rem), 1452px"
                />
              </div>
            );

            return (
              <CarouselItem key={i}>
                {slide.link ? (
                  <Link
                    href={slide.link}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {slides.length > 1 && (
          <>
            <CarouselPrevious className="left-2 size-9 border-none bg-white/80 text-black hover:bg-white sm:left-4 sm:size-10" />
            <CarouselNext className="right-2 size-9 border-none bg-white/80 text-black hover:bg-white sm:right-4 sm:size-10" />
          </>
        )}
      </Carousel>
    </section>
  );
}
