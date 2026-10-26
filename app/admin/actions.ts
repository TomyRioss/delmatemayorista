"use server";

import { redirect } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  createBannerHero,
  updateBannerHero,
  deleteBannerHero,
  updateBannerSimple,
  updateVentana,
  slugify,
  type ProductWrite,
} from "@/lib/admin-pb";

// ---------- helpers de FormData ----------

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

function num(fd: FormData, key: string): number | null {
  const raw = str(fd, key);
  if (!raw) return null;
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function file(fd: FormData, key: string): File | undefined {
  const f = fd.get(key);
  if (f instanceof File && f.size > 0) return f;
  return undefined;
}

// ---------- productos ----------

function productDataFrom(fd: FormData): { data: ProductWrite; images: File[] } {
  const name = str(fd, "name");
  const data: ProductWrite = {
    name,
    price: num(fd, "price"),
    description: str(fd, "description"),
    categoria: str(fd, "categoria") || null,
    oferta: bool(fd, "oferta"),
    novedad: bool(fd, "novedad"),
    pausado: bool(fd, "pausado"),
    min_packs: num(fd, "min_packs"),
    min_price: num(fd, "min_price"),
    variantes: [],
  };
  const images = (["image0", "image1", "image2", "image3"]
    .map((k) => file(fd, k))
    .filter((f): f is File => !!f));
  return { data, images };
}

export async function actionCreateProduct(fd: FormData) {
  const { data, images } = productDataFrom(fd);
  await createProduct(data, images);
  redirect("/admin/productos");
}

export async function actionUpdateProduct(fd: FormData) {
  const id = str(fd, "id");
  const { data, images } = productDataFrom(fd);
  await updateProduct(id, data, images);
  redirect("/admin/productos");
}

export async function actionDeleteProduct(fd: FormData) {
  await deleteProduct(str(fd, "id"));
  redirect("/admin/productos");
}

// ---------- categorias ----------

function catDataFrom(fd: FormData) {
  const label = str(fd, "label");
  return {
    data: { label, slug: slugify(label) },
    files: { image: file(fd, "image"), imagenMobile: file(fd, "imagenMobile") },
  };
}

export async function actionCreateCategoria(fd: FormData) {
  const { data, files } = catDataFrom(fd);
  await createCategoria(data, files);
  redirect("/admin/categorias");
}

export async function actionUpdateCategoria(fd: FormData) {
  const id = str(fd, "id");
  const { data, files } = catDataFrom(fd);
  await updateCategoria(id, data, files);
  redirect("/admin/categorias");
}

export async function actionDeleteCategoria(fd: FormData) {
  await deleteCategoria(str(fd, "id"));
  redirect("/admin/categorias");
}

// ---------- banner hero ----------

function heroDataFrom(fd: FormData) {
  return {
    data: {
      nombre: str(fd, "nombre"),
      link: str(fd, "link"),
      orden: num(fd, "orden") ?? 0,
    },
    files: { desktop: file(fd, "imagenDesktop"), mobile: file(fd, "imagenMobile") },
  };
}

export async function actionCreateBannerHero(fd: FormData) {
  const { data, files } = heroDataFrom(fd);
  await createBannerHero(data, files);
  redirect("/admin/banners");
}

export async function actionUpdateBannerHero(fd: FormData) {
  const id = str(fd, "id");
  const { data, files } = heroDataFrom(fd);
  await updateBannerHero(id, data, files);
  redirect("/admin/banners");
}

export async function actionDeleteBannerHero(fd: FormData) {
  await deleteBannerHero(str(fd, "id"));
  redirect("/admin/banners");
}

// ---------- banners simples ----------

export async function actionUpdateBannerSimple(fd: FormData) {
  const id = str(fd, "id");
  await updateBannerSimple(
    id,
    { link: str(fd, "link") },
    { desktop: file(fd, "imagenDesktop"), mobile: file(fd, "imagenMobile") },
  );
  redirect("/admin/banners");
}

// ---------- ventanas ----------

export async function actionUpdateVentana(fd: FormData) {
  const id = str(fd, "id");
  const tipo = str(fd, "tipo") as "imagen" | "video";
  await updateVentana(id, { tipo, link: str(fd, "link") }, file(fd, "archivo"));
  redirect("/admin/banners");
}
