const testimonials = [
  {
    name: "Marcela G.",
    text: "Pedí por mayor para mi kiosco y llegó todo perfecto, muy buena atención.",
  },
  {
    name: "Nahuel R.",
    text: "Excelente calidad de mates, los revendo y siempre vuelven a comprar.",
  },
  {
    name: "Julieta P.",
    text: "Rápidos con el envío al interior, superó lo que esperaba.",
  },
];

export default function Testimonials() {
  return (
    <section id="opiniones" className="bg-zinc-50">
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
          La experiencia de nuestros clientes
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <blockquote className="text-sm text-black/80">“{t.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-black">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
