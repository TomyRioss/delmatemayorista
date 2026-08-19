import Image from "next/image";


export default function QuienesSomosPage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6">
        <h1 className="sr-only">Cómo hacer tu compra</h1>

        {/* Versión Desktop */}
        <div className="hidden sm:block">
          <Image
            src="/informativas/quienes-somos/desktop.png"
            alt="Cómo hacer tu compra - Mayorista Del Mate"
            width={1821}
            height={864}
            className="w-full h-auto rounded-sm"
            sizes="(max-width: 1500px) 100vw, 1500px"
          />
        </div>

        {/* Versión Mobile */}
        <div className="block sm:hidden">
          <Image
            src="/informativas/quienes-somos/mobile.png"
            alt="Cómo hacer tu compra - Mayorista Del Mate"
            width={750}
            height={512}
            className="w-full h-auto rounded-sm"
            sizes="100vw"
          />
        </div>
      </main>
    </div>
  );
}
