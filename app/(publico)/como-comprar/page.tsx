"use client";


import Image from "next/image";

export default function ComoComprarPage() {

   return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-[#F8FAFB]">
      {/* Versión Mobile: imagen completa sin recortes ni márgenes */}
      <div className="block sm:hidden">
        <Image
          src="/informativas/como-comprar/mobile.png"
          alt="Cómo hacer tu compra - Mayorista Del Mate"
          width={750}
          height={512}
          className="h-auto w-full"
          sizes="100vw"
          priority
        />
      </div>

      {/* Versión Desktop */}
      <main className="mx-auto hidden w-full max-w-[1500px] px-4 py-8 sm:block sm:px-6">
        <h1 className="sr-only">Cómo hacer tu compra</h1>

        <Image
          src="/informativas/como-comprar/desktop.png"
          alt="Cómo hacer tu compra - Mayorista Del Mate"
          width={1821}
          height={864}
          className="h-auto w-full rounded-sm"
          sizes="(max-width: 1500px) 100vw, 1500px"
        />
      </main>
    </div>
  );
}