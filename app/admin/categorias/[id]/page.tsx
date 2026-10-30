import Link from "next/link";
import Image from "next/image";
import { pbList, pbFileUrl } from "@/lib/pb";
import type { CategoriaPb } from "@/lib/pb";
import {
  actionCreateCategoria,
  actionUpdateCategoria,
  actionDeleteCategoria,
} from "@/app/admin/actions";
import FileBox from "@/components/admin/FileBox";
import { Save, Trash2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriaEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "nueva";

  const existing = isNew
    ? null
    : (await pbList<CategoriaPb>("categorias", { filter: `id="${id}"`, perPage: 1 }))[0] ?? null;

  const c = existing;
  const img = c?.image ? pbFileUrl("categorias", c.id, c.image) : null;
  const imgMob = c?.imagen_mobile ? pbFileUrl("categorias", c.id, c.imagen_mobile) : null;

  const inputCls =
    "w-full rounded-sm border-2 border-black/15 bg-white px-3 py-2.5 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none";
  const labelCls = "flex flex-col gap-1.5 text-sm font-bold text-black";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/categorias"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> Volver a categorías
      </Link>

      <h1 className="text-3xl font-black uppercase">
        {isNew ? "Nueva categoría" : c?.label ?? "Categoría"}
      </h1>

      <form
        action={isNew ? actionCreateCategoria : actionUpdateCategoria}
        className="mt-8 flex flex-col gap-6"
      >
        {!isNew && <input type="hidden" name="id" value={id} />}

        <div className="flex flex-col gap-4 rounded-sm border-2 border-black/10 bg-white p-5">
          <label className={labelCls}>
            Nombre visible
            <input name="label" required defaultValue={c?.label ?? ""} className={inputCls} placeholder="SET MATERO" />
          </label>
          <p className="text-xs text-black/40">
            El slug (URL) se genera del nombre: {`"`}
            {c?.slug ?? "set-matero"}
            {`"`}. Cambiar el nombre cambia el slug y los links viejos dejan de funcionar.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              Imagen desktop
              <FileBox name="image" label="Subir imagen" hint="800x360 recomendado" />
              {img && (
                <span className="relative mt-2 block h-20 w-32 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                  <Image src={img} alt="" fill className="object-cover" sizes="128px" />
                </span>
              )}
            </label>
            <label className={labelCls}>
              Imagen mobile
              <FileBox name="imagenMobile" label="Subir imagen" hint="480x300 recomendado" />
              {imgMob && (
                <span className="relative mt-2 block h-20 w-32 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                  <Image src={imgMob} alt="" fill className="object-cover" sizes="128px" />
                </span>
              )}
            </label>
          </div>
          <p className="text-xs text-black/40">Si no subís una nueva, se conserva la actual.</p>
        </div>

        <button
          type="submit"
          className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#FF3412] px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black"
        >
          <Save className="h-4 w-4" strokeWidth={2.5} />
          {isNew ? "Crear categoría" : "Guardar cambios"}
        </button>
      </form>

      {!isNew && (
        <form action={actionDeleteCategoria} className="mt-10 border-t-2 border-black/10 pt-6">
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-sm border-2 border-[#FF3412] px-4 py-2 text-sm font-bold uppercase text-[#FF3412] transition-colors hover:bg-[#FF3412] hover:text-white"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2.5} /> Eliminar categoría
          </button>
        </form>
      )}
    </div>
  );
}
