import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/landing/ProductGrid";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const allProducts = await getProducts();
  const products = query
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query))
    : allProducts;

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <ProductGrid
          products={products}
          title={query ? `Resultados para "${q}"` : "Todos los productos"}
        />
      </main>
    </div>
  );
}
