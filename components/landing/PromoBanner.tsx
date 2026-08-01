export default function PromoBanner() {
  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 pt-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FF3412] px-6 py-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="rounded-xl bg-black px-4 py-3 text-center text-sm font-extrabold uppercase leading-tight text-white">
            ¡Precios
            <br />
            mayoristas!
          </span>
          <div>
            <h2 className="text-2xl font-extrabold uppercase leading-none text-white sm:text-4xl">
              Ofertas relámpago
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase text-white/90">
              Por tiempo limitado hasta agotar stock
            </p>
          </div>
        </div>

        <a
          href="#ofertas"
          className="rounded-full bg-[#F4C845] px-6 py-3 text-sm font-extrabold uppercase text-black transition-colors hover:bg-black hover:text-white"
        >
          Ver ofertas
        </a>
      </div>
    </section>
  );
}
