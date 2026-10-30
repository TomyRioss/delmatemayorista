import { notFound } from "next/navigation";
import { getProducts } from "@/lib/products";
import { getCategoriaBySlug } from "@/lib/pb";
import ProductGrid from "@/components/landing/ProductGrid";

export const revalidate = 60;

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const categoria = decodeURIComponent((await params).categoria);

  const entry = await getCategoriaBySlug(categoria);
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
