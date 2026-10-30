import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/landing/ProductGrid";

export const revalidate = 60;

export default async function OfertasPage() {
  const products = (await getProducts("destacados")).filter((p) => p.oferta || p.novedad);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <ProductGrid products={products} title="Ofertas y novedades" />
      </main>
    </div>
  );
}
