import Image from "next/image";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <Link
        href="/personalizados"
        className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FF3412] px-6 py-6 transition-opacity hover:opacity-90"
      >
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <h2 className="text-2xl font-extrabold uppercase leading-none text-white sm:text-4xl">
              Personaliza tus productos
              <br />
              en mayorista Del Mate
            </h2>
          </div>
          <ul className="flex flex-col text-sm font-extrabold uppercase leading-tight text-white sm:text-base">
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
            className="h-24 w-24 rounded-xl object-cover"
          />
          <Image
            src="https://images.pexels.com/photos/34449869/pexels-photo-34449869.jpeg?cs=srgb&fm=jpg"
            alt="Mate personalizado"
            width={100}
            height={100}
            className="hidden h-24 w-24 rounded-xl object-cover sm:block"
          />
        </div>
      </Link>
    </section>
  );
}
