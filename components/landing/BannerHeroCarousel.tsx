"use client";

import Image from "next/image";
import Link from "next/link";
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
  if (!slides.length) return null;

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((slide, i) => {
            const isExternal = slide.link?.startsWith("http");
            // ponytail: aspect-ratio en vez de altura fija. Assets 600x300 (mobile) y 1500x400 (desktop).
            const image = (
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-sm sm:aspect-[15/4]">
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
