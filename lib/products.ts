// Datos de productos desde PocketBase (reemplaza Keystatic).
// Mantiene el shape de Product para no tocar los componentes.

import { pbList, pbFileUrl, getCategorias, type CategoriaPb } from "@/lib/pb";
import { formatPrice, normalizePrice } from "@/lib/format";

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
  oferta: boolean;
  novedad: boolean;
  pausado: boolean;
  variants: ProductVariant[];
};

type ProductoPb = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  images: string[];
  description: string | null;
  categoria: string | null;
  variantes: {
    nombre?: string;
    precio?: number | null;
    imagenes?: string[];
    descripcion?: string | null;
  }[];
  oferta: boolean;
  novedad: boolean;
  pausado: boolean;
  min_packs: number | null;
  min_price: number | null;
};

function toUrl(
  collection: "productos" | "categorias",
  id: string,
  filename: string | null | undefined,
): string | null {
  return pbFileUrl(collection, id, filename);
}

export async function getProducts(): Promise<Product[]> {
  const [items, categorias] = await Promise.all([
    pbList<ProductoPb>("productos"),
    getCategorias(),
  ]);

  const catSlugById = new Map<string, string>();
  for (const c of categorias) catSlugById.set(c.id, c.slug);
  // los produtos sin categoria (3) usaban fallback en Keystatic: primera categoria
  const fallbackCategory = categorias[0]?.slug ?? null;

  return items
    .filter((p) => !p.pausado)
    .map((p) => {
      const priceValue = normalizePrice(p.price ?? 0);
      // En PB el minimo ya viene separado: min_packs directo,
      // min_price convierte a unidades equivalentes como hacia Keystatic.
      const minQty =
        p.min_packs != null
          ? Math.max(1, p.min_packs)
          : p.min_price != null && priceValue > 0
            ? Math.max(1, Math.ceil(normalizePrice(p.min_price) / priceValue))
            : 1;

      const images = (p.images ?? [])
        .map((f) => toUrl("productos", p.id, f))
        .filter((u): u is string => !!u);

      const variants: ProductVariant[] = (p.variantes ?? []).map((v, i) => {
        const variantPriceValue = normalizePrice(v.precio ?? priceValue);
        const variantImages = (v.imagenes ?? [])
          .map((f) => toUrl("productos", p.id, f))
          .filter((u): u is string => !!u);
        return {
          id: `v${i}`,
          name: v.nombre || `Variante ${i + 1}`,
          price: formatPrice(variantPriceValue),
          priceValue: variantPriceValue,
          images: variantImages.length > 0 ? variantImages : images,
          description: v.descripcion || p.description || undefined,
        };
      });

      const note = minQty > 1 ? `Mínimo ${minQty} unidades` : undefined;

      return {
        slug: p.slug,
        name: p.name,
        price: formatPrice(priceValue),
        priceValue,
        images,
        note,
        description: p.description || undefined,
        category: p.categoria
          ? catSlugById.get(p.categoria) ?? fallbackCategory
          : fallbackCategory,
        minQty,
        oferta: !!p.oferta,
        novedad: !!p.novedad,
        pausado: !!p.pausado,
        variants,
      };
    });
}

export type CategoriaView = {
  slug: string;
  label: string;
  image: string;
  imagenMobile: string | null;
};

export async function getCategoriasView(): Promise<CategoriaView[]> {
  const categorias = await getCategorias();
  return categorias.map((c: CategoriaPb) => ({
    slug: c.slug,
    label: c.label,
    image:
      pbFileUrl("categorias", c.id, c.image) ?? "/categorias/placeholder.png",
    imagenMobile: toUrl("categorias", c.id, c.imagen_mobile),
  }));
}
