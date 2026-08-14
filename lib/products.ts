import { reader } from "@/lib/keystatic";

export type ProductVariant = {
  id: string;
  name: string;
  price: string;
  priceValue: number;
  images: string[];
  description?: string;
};

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
  variants: ProductVariant[];
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
    const images = entry.images.filter((img): img is string => !!img);

    const variants: ProductVariant[] = entry.variantes.map((v, i) => {
      const variantPriceValue = v.precio ?? priceValue;
      const variantImages = v.imagenes.filter((img): img is string => !!img);

      return {
        id: `v${i}`,
        name: v.nombre || `Variante ${i + 1}`,
        price: `$${variantPriceValue.toLocaleString("es-AR")}`,
        priceValue: variantPriceValue,
        images: variantImages.length > 0 ? variantImages : images,
        description: v.descripcion || entry.description || undefined,
      };
    });

    return {
      slug,
      name: entry.name,
      price: `$${priceValue.toLocaleString("es-AR")}`,
      priceValue,
      images,
      description: entry.description || undefined,
      category: entry.category,
      minQty,
      variants,
      note:
        entry.minPurchase.discriminant === "packs"
          ? `Compra mínima: ${entry.minPurchase.value} unidades`
          : entry.minPurchase.value != null
            ? `Compra mínima: $${entry.minPurchase.value.toLocaleString("es-AR")}`
            : undefined,
    };
  });
}
