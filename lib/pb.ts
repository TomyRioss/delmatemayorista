// Cliente PocketBase para delmatemayorista.
// Lee desde la instancia PB del VPS (:8096). En dev se accede por tunel SSH;
// en prod apunta al PB publico configurado en POCKETBASE_URL.

const PB_URL = (
  process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096"
).replace(/\/$/, "");

export function pbFileUrl(
  collection: string,
  recordId: string,
  filename: string | null | undefined,
  thumb?: string,
): string | null {
  if (!filename || !recordId) return null;
  const base = `${PB_URL}/api/files/${collection}/${recordId}/${filename}`;
  return thumb ? `${base}?thumb=${thumb}` : base;
}

/**
 * Loader para next/image: en vez de pasar por el optimizer de Next (que por
 * tunel SSH re-descarga el original en cada variant), pide a PB el thumb del
 * tamano pedido. PB genera y cachea el thumb en el VPS.
 */
export const pbImageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string => {
  // Solo reescribe urls de files de PB
  if (!src.includes("/api/files/")) return src;
  const sep = src.includes("?") ? "&" : "?";
  // PB exige un tamano fijo WxH; cuadrado normalizado con crop centrado.
  const w = Math.max(32, Math.min(2048, Math.round(width)));
  return `${src}${sep}thumb=${w}x${w}` + (quality && quality < 100 ? `f` : "");
};

export type PbRecord = {
  id: string;
  collectionId: string;
  collectionName: string;
  [key: string]: unknown;
};

export async function pbList<T = PbRecord>(
  collection: string,
  opts: { perPage?: number; filter?: string; sort?: string } = {},
): Promise<T[]> {
  const params = new URLSearchParams();
  params.set("perPage", String(opts.perPage ?? 500));
  if (opts.filter) params.set("filter", opts.filter);
  if (opts.sort) params.set("sort", opts.sort);
  const res = await fetch(
    `${PB_URL}/api/collections/${collection}/records?${params}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error(
      `PocketBase: GET ${collection} -> ${res.status} ${await res.text()}`,
    );
  }
  const data = (await res.json()) as { items: T[] };
  return data.items;
}

// Los campos autogenerados (created/updated) no son ordenables cuando la
// collection usa listRule publico en PB 0.40: orden por id en server y,
// si hace falta, en cliente.

// ---------- Tipos de las collections ----------

export type CategoriaPb = {
  id: string;
  slug: string;
  label: string;
  image: string | null; // filename
  imagen_mobile: string | null;
};

export async function getCategorias(): Promise<CategoriaPb[]> {
  const items = await pbList<CategoriaPb>("categorias", { sort: "slug" });
  return items.sort((a, b) => a.label.localeCompare(b.label));
}

export async function getCategoriaBySlug(slug: string) {
  const items = await pbList<CategoriaPb>("categorias", {
    filter: `slug="${slug}"`,
    perPage: 1,
  });
  return items[0] ?? null;
}

export type BannerHeroPb = {
  id: string;
  nombre: string;
  imagen_desktop: string | null;
  imagen_mobile: string | null;
  link: string;
  orden: number;
};

export async function getBannerHero(): Promise<BannerHeroPb[]> {
  return pbList<BannerHeroPb>("banner_hero", { sort: "orden" });
}

export type BannerSimplePb = {
  id: string;
  key: string;
  imagen_desktop: string | null;
  imagen_mobile: string | null;
  link: string;
};

export async function getBannerSimple(key: "como_comprar" | "personalizado") {
  const items = await pbList<BannerSimplePb>("banners_simples", {
    filter: `key="${key}"`,
    perPage: 1,
  });
  return items[0] ?? null;
}

export type VentanaPb = {
  id: string;
  key: "izquierda" | "derecha";
  tipo: "imagen" | "video";
  archivo: string | null;
  link: string;
};

export async function getVentanas(): Promise<VentanaPb[]> {
  return pbList<VentanaPb>("ventanas_laterales");
}
