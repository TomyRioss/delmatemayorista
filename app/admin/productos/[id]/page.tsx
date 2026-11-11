import Link from "next/link";
import Image from "next/image";
import { pbFileUrl, getCategorias } from "@/lib/pb";
import { getProducts } from "@/lib/products";
import type { ProductoPbShape } from "@/lib/admin-types";
import {
  actionCreateProduct,
  actionUpdateProduct,
  actionDeleteProduct,
} from "@/app/admin/actions";
import FileBox from "@/components/admin/FileBox";
import { Save, Trash2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-sm border-2 border-black/15 bg-white px-3 py-2.5 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none";
const labelCls = "flex flex-col gap-1.5 text-sm font-bold text-black";

export default async function ProductoEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const isNew = id === "nuevo";
  const saveError = Array.isArray(error) ? error[0] : error;

  const [categorias, existing] = await Promise.all([
    getCategorias(),
    isNew
      ? Promise.resolve(null)
      : (await import("@/lib/pb")).pbList<ProductoPbShape>("productos", {
          filter: `id="${id}"`,
          perPage: 1,
        }).then((r) => r[0] ?? null),
  ]);

  const p = existing;
  const images = p?.images?.length
    ? p.images
        .map((f) => pbFileUrl("productos", p.id, f))
        .filter((u): u is string => !!u)
    : [];

  // Posicion real hoy en cada pagina (null si esta pausado o no aparece).
  let posInicio: string | null = null;
  let posCatalogo: string | null = null;
  let posOfertas: string | null = null;
  if (p) {
    try {
      const [todos, destacados] = await Promise.all([getProducts("inicio"), getProducts("destacados")]);
      const mine = todos.find((x) => x.slug === p.slug);
      if (mine) {
        posInicio = `${todos.indexOf(mine) + 1} de ${todos.length}`;
        const cat = todos.filter((x) => x.category === mine.category);
        posCatalogo = `${cat.indexOf(mine) + 1} de ${cat.length}`;
      }
      const ofertas = destacados.filter((x) => x.oferta || x.novedad);
      const mineO = ofertas.find((x) => x.slug === p.slug);
      if (mineO) posOfertas = `${ofertas.indexOf(mineO) + 1} de ${ofertas.length}`;
    } catch (e) {
      console.error("No se pudo calcular la posición actual del producto", e);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/productos"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Volver a productos
      </Link>

      <h1 className="text-3xl font-black uppercase">
        {isNew ? "Nuevo producto" : p?.name ?? "Producto"}
      </h1>

      {saveError && (
        <p role="alert" className="mt-4 rounded-sm border-2 border-[#FF3412]/30 bg-[#FF3412]/5 px-4 py-3 text-sm font-semibold text-[#B3210B]">
          {saveError === "name"
            ? "Ingresá un nombre con letras o números para generar la URL del producto."
            : "No se pudo guardar el producto. Revisá los datos e intentá de nuevo."}
        </p>
      )}

      <form
        action={isNew ? actionCreateProduct : actionUpdateProduct}
        className="mt-8 flex flex-col gap-6"
      >
        {!isNew && <input type="hidden" name="id" value={id} />}

        <div className="flex flex-col gap-4 rounded-sm border-2 border-black/10 bg-white p-5">
          <label className={labelCls}>
            Nombre
            <input
              name="name"
              required
              defaultValue={p?.name ?? ""}
              className={inputCls}
              placeholder="MATE DE VIDRIO NAVIDAD"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelCls}>
              Precio ($)
              <input
                name="price"
                type="number"
                min="0"
                step="1"
                defaultValue={p?.price ?? ""}
                className={inputCls}
              />
            </label>
            <label className={labelCls}>
              Categoría
              <select name="categoria" defaultValue={p?.categoria ?? ""} className={inputCls}>
                <option value="">— Sin categoría —</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className={labelCls}>
              Mínimo de packs
              <input
                name="min_packs"
                type="number"
                min="1"
                defaultValue={p?.min_packs ?? 6}
                className={inputCls}
              />
            </label>
            <label className={labelCls}>
              Mínimo por precio ($) — opcional
              <input
                name="min_price"
                type="number"
                min="0"
                defaultValue={p?.min_price ?? ""}
                className={inputCls}
                placeholder="si se carga, pisa min_packs"
              />
            </label>
          </div>

          <label className={labelCls}>
            Descripción
            <textarea
              name="description"
              rows={3}
              defaultValue={p?.description ?? ""}
              className={inputCls}
              placeholder={"COMPRA MINIMA 6 UNIDADES\nCONSULTAR COLORES"}
            />
          </label>

          <div className="flex flex-wrap gap-6">
            {(
              [
                ["oferta", "Oferta"],
                ["novedad", "Novedad"],
                ["pausado", "Pausado"],
              ] as const
            ).map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm font-bold text-black">
                <input
                  type="checkbox"
                  name={name}
                  defaultChecked={isNew ? false : !!p?.[name]}
                  className="h-4 w-4 accent-[#FF3412]"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-black/10 pt-4 sm:grid-cols-2">
            <label className={labelCls}>
              Posición en inicio y catálogo
              <input
                name="orden_inicio"
                type="number"
                min="1"
                step="1"
                defaultValue={p?.orden_inicio || ""}
                className={inputCls}
                placeholder={posInicio ? `Hoy: puesto ${posInicio}` : "Automático"}
              />
              <span className="text-xs font-normal text-black/55">
                Puesto donde querés que aparezca (2 = segundo). Vacío = automático.
                {posInicio && (
                  <>
                    {" "}Hoy: puesto <b>{posInicio}</b> en inicio
                    {posCatalogo && <>, <b>{posCatalogo}</b> dentro de su categoría</>}.
                  </>
                )}
              </span>
            </label>
            <label className={labelCls}>
              Posición en ofertas y novedades
              <input
                name="orden_destacados"
                type="number"
                min="1"
                step="1"
                defaultValue={p?.orden_destacados || ""}
                className={inputCls}
                placeholder={posOfertas ? `Hoy: puesto ${posOfertas}` : "Automático"}
              />
              <span className="text-xs font-normal text-black/55">
                Solo aplica a productos en oferta o novedad. Vacío = automático.
                {posOfertas && <> Hoy: puesto <b>{posOfertas}</b>.</>}
              </span>
            </label>
          </div>
        </div>

        {/* Imágenes existentes + nuevas */}
        <div className="flex flex-col gap-3 rounded-sm border-2 border-black/10 bg-white p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-black/70">Imágenes</p>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((src, i) => (
                <div key={i} className="relative h-20 w-20 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
          {/* Solo agrega: las existentes no se borran (simple y seguro). */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[0, 1, 2, 3].map((n) => (
              <FileBox
                key={n}
                name={`image${n}`}
                label={`Imagen ${images.length + n + 1}`}
                hint="JPG, PNG, WEBP"
              />
            ))}
          </div>
          <p className="text-xs text-black/40">
            Las imágenes nuevas se agregan al final. Para reemplazar una existente se borra y se vuelve a subir (sin pérdida de orden configurable todavía).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-sm bg-[#FF3412] px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black"
          >
            <Save className="h-4 w-4" strokeWidth={2.5} />
            {isNew ? "Crear producto" : "Guardar cambios"}
          </button>
        </div>
      </form>

      {!isNew && (
        <form action={actionDeleteProduct} className="mt-10 border-t-2 border-black/10 pt-6">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-[#FF3412] px-4 py-2 text-sm font-bold uppercase text-[#FF3412] transition-colors hover:bg-[#FF3412] hover:text-white"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} /> Eliminar producto
          </button>
        </form>
      )}
    </div>
  );
}
