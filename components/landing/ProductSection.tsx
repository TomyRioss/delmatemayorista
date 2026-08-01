import ProductCard from "./ProductCard";

type Product = {
  name: string;
  price: string;
  badge?: string;
  emoji?: string;
};

type ProductSectionProps = {
  id: string;
  title: string;
  products: Product[];
  ctaLabel: string;
  ctaHref: string;
};

export default function ProductSection({ id, title, products, ctaLabel, ctaHref }: ProductSectionProps) {
  return (
    <section id={id} className="bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-extrabold tracking-tight text-black sm:text-3xl">
          {title}
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href={ctaHref}
            className="rounded-full border-2 border-black px-8 py-3 text-sm font-semibold text-black transition-colors hover:border-[#FF3412] hover:text-[#FF3412]"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
