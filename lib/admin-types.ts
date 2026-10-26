// Shape de un producto tal como lo devuelve la collection de PB.
// Importable desde server y client components (solo tipos).

export type ProductoPbShape = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  images: string[];
  description: string | null;
  categoria: string | null;
  oferta: boolean;
  novedad: boolean;
  pausado: boolean;
  min_packs: number | null;
  min_price: number | null;
  variantes: object[];
};
