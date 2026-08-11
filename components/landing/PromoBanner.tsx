import Image from "next/image";
import Link from "next/link";
import { HelpCircle } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 pt-8 sm:px-6 lg:flex-row">
      <Link
        href="/personalizados"
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FF3412] px-6 py-4 transition-opacity hover:opacity-90 lg:w-[70%]"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-lg font-extrabold uppercase leading-tight text-white sm:text-2xl">
              Personaliza tus productos
              <br />
              en mayorista Del Mate
            </h2>
          </div>
          <ul className="flex flex-col text-xs font-extrabold uppercase leading-tight text-white sm:text-sm">
            <li>- Madera</li>
            <li>- Aluminio</li>
            <li>- Plástico</li>
            <li>- Acero</li>
          </ul>
        </div>

        <div className="flex shrink-0 gap-3">
          <Image
            src="https://images.pexels.com/photos/25436250/pexels-photo-25436250.jpeg?cs=srgb&dl=pexels-walter-spiess-42897-25436250.jpg&fm=jpg"
            alt="Mate personalizado"
            width={100}
            height={100}
            className="h-14 w-14 rounded-xl object-cover"
          />
          <Image
            src="https://images.pexels.com/photos/34449869/pexels-photo-34449869.jpeg?cs=srgb&fm=jpg"
            alt="Mate personalizado"
            width={100}
            height={100}
            className="hidden h-14 w-14 rounded-xl object-cover sm:block"
          />
        </div>
      </Link>

      <Link
        href="/como-comprar"
        className="flex items-center justify-between gap-4 rounded-2xl bg-[#FF3412] px-6 py-4 transition-opacity hover:opacity-90 lg:w-[30%]"
      >
        <div>
          <h2 className="text-lg font-extrabold uppercase leading-tight text-white sm:text-2xl">
            Como hacer tu compra
          </h2>
          <p className="mt-1 text-xs font-extrabold uppercase leading-tight text-white sm:text-sm">
            Te lo explicamos paso a paso
          </p>
        </div>
        <HelpCircle
          className="h-10 w-10 shrink-0 text-white sm:h-12 sm:w-12"
          strokeWidth={1.5}
        />
      </Link>
    </section>
  );
}
