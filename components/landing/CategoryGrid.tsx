const categories = [
  { label: "Nuevos ingresos", href: "/novedades" },
  { label: "Lo más vendido", href: "/mas-vendidos" },
  { label: "Mateando", href: "/mateando" },
  { label: "Marroquinería", href: "/marroquineria" },
  { label: "Bazar", href: "/bazar" },
];

export default function CategoryGrid() {
  return (
    <section id="productos" className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
        <h2 className="mb-6 border-b border-black/10 pb-4 text-2xl font-extrabold tracking-tight text-[#FF3412] sm:text-3xl">
          Productos de Delmate
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.href}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-zinc-100"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-14 w-14 text-black/20 transition-transform group-hover:scale-110"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7.5 12 3l9 4.5M3 7.5v9L12 21m-9-4.5L12 12m0 9 9-4.5v-9M12 12l9-4.5M12 12v9"
                />
              </svg>
              <span className="absolute bottom-3 rounded bg-black/80 px-3 py-1 text-xs font-extrabold uppercase text-white">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
