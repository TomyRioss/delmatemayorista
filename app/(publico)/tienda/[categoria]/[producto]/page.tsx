import { notFound } from "next/navigation";
import { reader } from "@/lib/keystatic";
import { getProducts } from "@/lib/products";
import ProductDetail from "@/components/landing/ProductDetail";
import ProductGrid from "@/components/landing/ProductGrid";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}) {
  const { categoria, producto } = await params;

  const categoriaEntry = await reader.collections.categorias.read(categoria);
  if (!categoriaEntry) notFound();

  const products = await getProducts();
  const product = products.find((p) => p.slug === producto && p.category === categoria);
  if (!product) notFound();

  const recommended = products
    .filter((p) => p.category === categoria && p.slug !== producto)
    .slice(0, 8);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-10 sm:px-6">
        <ProductDetail product={product} />
      </main>

      {recommended.length > 0 && (
        <ProductGrid products={recommended} title="También te puede interesar" />
      )}
    </div>
  );
}
