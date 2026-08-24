import Image from "next/image";


export default function QuienesSomosPage() {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden bg-white">
      {/* Versión Mobile: imagen completa sin recortes ni márgenes */}
      <div className="block sm:hidden">
        <Image
          src="/informativas/quienes-somos/mobile-responsive.png"
          alt="Quiénes somos - Mayorista Del Mate"
          width={1500}
          height={1024}
          className="h-auto w-full"
          sizes="100vw"
          priority
        />
      </div>

      {/* Versión Desktop */}
      <main className="mx-auto hidden w-full max-w-[1500px] px-4 py-8 sm:block sm:px-6">
        <h1 className="sr-only">Cómo hacer tu compra</h1>

        <Image
          src="/informativas/quienes-somos/desktop.png"
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