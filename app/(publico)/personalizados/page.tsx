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
import Footer from "@/components/landing/Footer";

const indice = [
  { id: "personalizados", label: "Productos personalizados en grabado láser" },
  { id: "como-funciona", label: "¿Cómo funciona el grabado láser?" },
  { id: "por-que-elegir", label: "¿Por qué elegir un producto personalizado?" },
  { id: "materiales", label: "Materiales disponibles" },
  { id: "como-pedir", label: "Cómo hacer tu pedido" },
];

const galeria = [
  "https://images.pexels.com/photos/13526973/pexels-photo-13526973.jpeg",
  "https://images.pexels.com/photos/8279921/pexels-photo-8279921.jpeg",
  "https://images.pexels.com/photos/7041902/pexels-photo-7041902.jpeg",
];

const secciones = [
  {
    id: "personalizados",
    titulo: "Productos personalizados en grabado láser",
    parrafos: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    ],
  },
  {
    id: "como-funciona",
    titulo: "¿Cómo funciona el grabado láser?",
    parrafos: [
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.",
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    ],
  },
  {
    id: "por-que-elegir",
    titulo: "¿Por qué elegir un producto personalizado?",
    parrafos: [
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
    ],
  },
  {
    id: "materiales",
    titulo: "Materiales disponibles",
    parrafos: [
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.",
    ],
  },
  {
    id: "como-pedir",
    titulo: "Cómo hacer tu pedido",
    parrafos: [
      "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
    ],
  },
];

export default function PersonalizadosPage() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto flex w-full max-w-[1500px] flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:sticky lg:top-24 lg:h-fit lg:w-72">
          <a
            href="https://wa.me/5491100000000"
            className="flex items-center gap-2 rounded-sm border border-black/10 bg-zinc-50 px-4 py-3 font-bold text-[#FF3412] hover:bg-zinc-100"
          >
            <FaWhatsapp className="h-5 w-5" />
            11 0000-0000
          </a>

          <div className="rounded-sm border border-black/10">
            <h2 className="border-b border-black/10 px-4 py-3 text-sm font-black uppercase text-black">
              Índice: Productos personalizados
            </h2>
            <ul className="max-h-64 overflow-y-auto px-4 py-3">
              {indice.map((item) => (
                <li key={item.id} className="border-b border-black/5 py-2 last:border-0">
                  <a href={`#${item.id}`} className="text-sm font-semibold text-black hover:text-[#FF3412]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <h1 className="mb-6 border-b border-black/10 pb-4 text-2xl font-black uppercase tracking-wide text-[#FF3412] sm:text-3xl">
            Productos personalizados
          </h1>

          <Carousel opts={{ loop: true }} plugins={[autoplay.current]}>
            <CarouselContent>
              {galeria.map((src) => (
                <CarouselItem key={src}>
                  <div className="relative h-64 w-full overflow-hidden rounded-sm sm:h-96">
                    <Image
                      src={src}
                      alt="Producto personalizado"
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
              <section key={seccion.id} id={seccion.id} className="scroll-mt-24">
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
      <Footer />
    </div>
  );
}
