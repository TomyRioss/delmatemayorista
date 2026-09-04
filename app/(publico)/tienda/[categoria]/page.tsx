import { notFound } from "next/navigation";
import { reader } from "@/lib/keystatic";
import { getProducts } from "@/lib/products";
import ProductGrid from "@/components/landing/ProductGrid";

export const revalidate = 60;

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const categoria = decodeURIComponent((await params).categoria);

  const entry = await reader.collections.categorias.read(categoria);
  if (!entry) notFound();

  const products = (await getProducts()).filter((p) => p.category === categoria);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="flex flex-1 flex-col">
        <ProductGrid products={products} title={entry.label} />
      </main>
    </div>
  );
}
