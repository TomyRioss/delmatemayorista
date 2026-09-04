import { notFound } from "next/navigation";
import { reader } from "@/lib/keystatic";
import { getProducts } from "@/lib/products";
import ProductDetail from "@/components/landing/ProductDetail";

export const revalidate = 60;

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ categoria: string; producto: string }>;
}) {
  const raw = await params;
  const categoria = decodeURIComponent(raw.categoria);
  const producto = decodeURIComponent(raw.producto);

  const categoriaEntry = await reader.collections.categorias.read(categoria);
  if (!categoriaEntry) notFound();

  const products = await getProducts();
  const product = products.find((p) => p.slug === producto && p.category === categoria);
  if (!product) notFound();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-10 sm:px-6">
        <ProductDetail product={product} />
      </main>
    </div>
  );
}
