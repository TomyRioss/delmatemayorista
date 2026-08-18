"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { withCacheBust } from "@/lib/cache-bust";

type Slide = {
  imagenDesktop: string;
  imagenMobile: string | null;
  link?: string;
};

export default function BannerHeroCarousel({ slides }: { slides: Slide[] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  if (!slides.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <Carousel opts={{ loop: true }} plugins={[autoplay.current]}>
        <CarouselContent>
          {slides.map((slide, i) => {
            const isExternal = slide.link?.startsWith("http");
            const image = (
              <div className="relative h-40 w-full overflow-hidden rounded-sm sm:h-64 md:h-80">
                <Image
                  src={withCacheBust(slide.imagenDesktop)}
                  alt=""
                  fill
                  priority={i === 0}
                  className="hidden object-cover sm:block"
                  sizes="100vw"
                />
                {slide.imagenMobile && (
                  <Image
                    src={withCacheBust(slide.imagenMobile)}
                    alt=""
                    fill
                    priority={i === 0}
                    className="block object-cover sm:hidden"
                    sizes="100vw"
                  />
                )}
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
      </Carousel>
    </section>
  );
}
