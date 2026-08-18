import Image from "next/image";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { withCacheBust } from "@/lib/cache-bust";

type PromoBannerProps = {
  imagenDesktop?: string | null;
  imagenMobile?: string | null;
};

export default function PromoBanner({ imagenDesktop, imagenMobile }: PromoBannerProps) {
  return (
    <section className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 pt-8 sm:px-6 lg:flex-row">
      <Link
        href="/personalizados"
        className="overflow-hidden rounded-2xl transition-opacity hover:opacity-90 lg:w-[70%]"
      >
        {imagenMobile && (
          <div className="relative block aspect-[2/1] w-full lg:hidden">
            <Image
              src={withCacheBust(imagenMobile)}
              alt="Personaliza tus productos en Mayorista Del Mate"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}
        {imagenDesktop && (
          <Image
            src={withCacheBust(imagenDesktop)}
            alt="Personaliza tus productos en Mayorista Del Mate"
            width={1200}
            height={160}
            className="hidden h-auto w-full object-cover lg:block"
            sizes="70vw"
          />
        )}
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
