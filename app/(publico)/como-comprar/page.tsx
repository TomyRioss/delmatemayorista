"use client";

import { useRef } from "react";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const galeria = [
  "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg",
  "https://images.pexels.com/photos/1004897/pexels-photo-1004897.jpeg",
  "https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg",
];

const secciones = [
  {
    id: "como-comprar",
    titulo: "Cómo hacer tu compra",
    parrafos: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    ],
  },
  {
    id: "registro",
    titulo: "Registrate como mayorista",
    parrafos: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    ],
  },
  {
    id: "pedido-minimo",
    titulo: "Compra mínima",
    parrafos: [
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    ],
  },
  {
    id: "medios-de-pago",
    titulo: "Medios de pago",
    parrafos: [
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
    ],
  },
  {
    id: "envios",
    titulo: "Envíos y entregas",
    parrafos: [
      "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    ],
  },
];

export default function ComoComprarPage() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-[320px] lg:h-fit lg:w-72">
          <a
            href="https://wa.me/5491100000000"
            className="flex items-center gap-3 whitespace-nowrap text-2xl font-black text-[#FF3412] hover:opacity-80 sm:text-3xl"
          >
            <FaWhatsapp className="h-8 w-8 shrink-0" />
            11 0000-0000
          </a>
        </aside>

        <div className="flex-1">
          <h1 className="mb-6 border-b border-black/10 pb-4 text-2xl font-black uppercase tracking-wide text-[#FF3412] sm:text-3xl">
            Como hacer tu compra
          </h1>

          <Carousel opts={{ loop: true }} plugins={[autoplay.current]}>
            <CarouselContent>
              {galeria.map((src) => (
                <CarouselItem key={src}>
                  <div className="relative h-64 w-full overflow-hidden rounded-sm sm:h-96">
                    <Image
                      src={src}
                      alt="Como hacer tu compra"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 900px"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="mt-10 flex flex-col gap-10">
            {secciones.map((seccion) => (
              <section key={seccion.id} id={seccion.id} className="scroll-mt-40">
                <h2 className="mb-3 text-xl font-black uppercase text-black sm:text-2xl">{seccion.titulo}</h2>
                {seccion.parrafos.map((p, i) => (
                  <p key={i} className="mb-3 text-sm leading-relaxed text-black/70 sm:text-base">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
