import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  {
    src: "https://images.pexels.com/photos/13526973/pexels-photo-13526973.jpeg",
    alt: "Mate y yerba mate tradicional",
  },
  {
    src: "https://images.pexels.com/photos/8279921/pexels-photo-8279921.jpeg",
    alt: "Cebando mate con termo",
  },
  {
    src: "https://images.pexels.com/photos/7041902/pexels-photo-7041902.jpeg",
    alt: "Set de mate y bombilla",
  },
];

export default function HeroSlider() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-4 sm:px-6">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.src}>
              <div className="relative h-56 w-full overflow-hidden rounded-2xl sm:h-80">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 1152px"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </section>
  );
}
