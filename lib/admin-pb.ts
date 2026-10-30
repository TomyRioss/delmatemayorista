// Operaciones de escritura de PocketBase para el panel de administracion.
// Todas autentican como superuser (credenciales del admin).

import { revalidatePath } from "next/cache";
import { pbSuperuserAuth } from "@/lib/admin-auth";

const PB_URL = (
  process.env.POCKETBASE_URL ?? "http://127.0.0.1:8096"
).replace(/\/$/, "");

async function pb<T>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: FormData | object,
): Promise<T> {
  const token = await pbSuperuserAuth();
  const headers: Record<string, string> = { Authorization: token };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(PB_URL + path, {
    method,
    headers,
    body: payload,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PocketBase ${method} ${path} -> ${res.status} ${text}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

// ---------- helpers de slugs/limpieza ----------

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- productos ----------

export type ProductWrite = {
  slug?: string;
  name: string;
  price: number | null;
  description: string;
  categoria: string | null; // id de categoria
  oferta: boolean;
  novedad: boolean;
  pausado: boolean;
  min_packs: number | null;
  min_price: number | null;
  orden_inicio: number;
  orden_destacados: number;
  variantes?: object[];
};

export function createProduct(data: ProductWrite, images: File[]) {
  return productUpsert(null, data, images);
}

export function updateProduct(id: string, data: ProductWrite, images: File[]) {
  return productUpsert(id, data, images);
}

async function productUpsert(
  id: string | null,
  data: ProductWrite,
  images: File[],
) {
  const fd = new FormData();
  fd.set("name", data.name);
  fd.set("price", String(data.price ?? 0));
  fd.set("description", data.description);
  if (data.categoria) fd.set("categoria", data.categoria);
  fd.set("oferta", String(data.oferta));
  fd.set("novedad", String(data.novedad));
  fd.set("pausado", String(data.pausado));
  if (data.min_packs != null) fd.set("min_packs", String(data.min_packs));
  if (data.min_price != null) fd.set("min_price", String(data.min_price));
  fd.set("orden_inicio", String(data.orden_inicio));
  fd.set("orden_destacados", String(data.orden_destacados));
  fd.set("variantes", JSON.stringify(data.variantes ?? []));
  for (const f of images) fd.append("images", f, f.name);

  const record = id
    ? await pb<Record<string, unknown>>("PATCH", `/api/collections/productos/records/${id}`, fd)
    : await pb<Record<string, unknown>>("POST", "/api/collections/productos/records", fd);

  revalidatePath("/", "layout");
  return record;
}

export async function deleteProduct(id: string) {
  await pb("DELETE", `/api/collections/productos/records/${id}`);
  revalidatePath("/", "layout");
}

// ---------- categorias ----------

export type CategoriaWrite = {
  slug: string;
  label: string;
};

export function createCategoria(data: CategoriaWrite, files: { image?: File; imagenMobile?: File }) {
  return categoriaUpsert(null, data, files);
}

export function updateCategoria(id: string, data: CategoriaWrite, files: { image?: File; imagenMobile?: File }) {
  return categoriaUpsert(id, data, files);
}

async function categoriaUpsert(
  id: string | null,
  data: CategoriaWrite,
  files: { image?: File; imagenMobile?: File },
) {
  const fd = new FormData();
  fd.set("slug", data.slug);
  fd.set("label", data.label);
  if (files.image) fd.append("image", files.image, files.image.name);
  if (files.imagenMobile) fd.append("imagen_mobile", files.imagenMobile, files.imagenMobile.name);

  const record = id
    ? await pb<Record<string, unknown>>("PATCH", `/api/collections/categorias/records/${id}`, fd)
    : await pb<Record<string, unknown>>("POST", "/api/collections/categorias/records", fd);

  revalidatePath("/", "layout");
  return record;
}

export async function deleteCategoria(id: string) {
  await pb("DELETE", `/api/collections/categorias/records/${id}`);
  revalidatePath("/", "layout");
}

// ---------- banner hero ----------

export function createBannerHero(data: { nombre: string; link: string; orden: number | null }, files: { desktop?: File; mobile?: File }) {
  return bannerHeroUpsert(null, data, files);
}

export function updateBannerHero(id: string, data: { nombre: string; link: string; orden: number | null }, files: { desktop?: File; mobile?: File }) {
  return bannerHeroUpsert(id, data, files);
}

async function bannerHeroUpsert(
  id: string | null,
  data: { nombre: string; link: string; orden: number | null },
  files: { desktop?: File; mobile?: File },
) {
  const fd = new FormData();
  fd.set("nombre", data.nombre);
  fd.set("link", data.link);
  if (data.orden != null) fd.set("orden", String(data.orden));
  if (files.desktop) fd.append("imagen_desktop", files.desktop, files.desktop.name);
  if (files.mobile) fd.append("imagen_mobile", files.mobile, files.mobile.name);

  const record = id
    ? await pb<Record<string, unknown>>("PATCH", `/api/collections/banner_hero/records/${id}`, fd)
    : await pb<Record<string, unknown>>("POST", "/api/collections/banner_hero/records", fd);

  revalidatePath("/", "layout");
  return record;
}

export async function deleteBannerHero(id: string) {
  await pb("DELETE", `/api/collections/banner_hero/records/${id}`);
  revalidatePath("/", "layout");
}

// Recibe los ids en el orden visual deseado y reescribe orden = 1..n.
// Secuencial: los PATCH llegan en orden al backend sin importar la red.
export async function reorderBannerHeroes(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    await pb("PATCH", `/api/collections/banner_hero/records/${ids[i]}`, { orden: i + 1 });
  }
  revalidatePath("/", "layout");
  revalidatePath("/admin/banners");
}

// ---------- banners simples ----------

export function updateBannerSimple(
  id: string,
  data: { link: string },
  files: { desktop?: File; mobile?: File },
) {
  const fd = new FormData();
  fd.set("link", data.link);
  if (files.desktop) fd.append("imagen_desktop", files.desktop, files.desktop.name);
  if (files.mobile) fd.append("imagen_mobile", files.mobile, files.mobile.name);
  const p = pb<Record<string, unknown>>("PATCH", `/api/collections/banners_simples/records/${id}`, fd);
  p.then(() => revalidatePath("/", "layout"));
  return p;
}

// ---------- ventanas laterales ----------

export function updateVentana(
  id: string,
  data: { tipo: "imagen" | "video"; link: string },
  file?: File,
) {
  const fd = new FormData();
  fd.set("tipo", data.tipo);
  fd.set("link", data.link);
  if (file) fd.append("archivo", file, file.name);
  const p = pb<Record<string, unknown>>("PATCH", `/api/collections/ventanas_laterales/records/${id}`, fd);
  p.then(() => revalidatePath("/", "layout"));
  return p;
}
