import { reader } from "@/lib/keystatic";

export type Product = {
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  images: string[];
  note?: string;
  description?: string;
  category: string | null;
  minQty: number;
  variantGroup?: string;
  variantLabel?: string;
};

export async function getProducts(): Promise<Product[]> {
  const entries = await reader.collections.productos.all();

  return entries.map(({ slug, entry }) => {
    const priceValue = entry.price ?? 0;
    const minQty =
      entry.minPurchase.discriminant === "packs"
        ? Math.max(1, entry.minPurchase.value ?? 1)
        : priceValue > 0
          ? Math.max(1, Math.ceil((entry.minPurchase.value ?? 0) / priceValue))
          : 1;

    return {
      slug,
      name: entry.name,
      price: `$${priceValue.toLocaleString("es-AR")}`,
      priceValue,
      images: entry.images.filter((img): img is string => !!img),
      description: entry.description || undefined,
      category: entry.category,
      minQty,
      variantGroup: entry.variantGroup || undefined,
      variantLabel: entry.variantLabel || undefined,
      note:
        entry.minPurchase.discriminant === "packs"
          ? `Compra mínima: ${entry.minPurchase.value} unidades`
          : entry.minPurchase.value != null
            ? `Compra mínima: $${entry.minPurchase.value.toLocaleString("es-AR")}`
            : undefined,
    };
  });
}
