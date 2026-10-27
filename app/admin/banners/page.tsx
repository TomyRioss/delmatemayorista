import Image from "next/image";
import { getBannerHero, getBannerSimple, getVentanas, pbFileUrl } from "@/lib/pb";
import type { VentanaPb } from "@/lib/pb";
import {
  actionCreateBannerHero,
  actionUpdateBannerSimple,
  actionUpdateVentana,
} from "@/app/admin/actions";
import FileBox from "@/components/admin/FileBox";
import FlyerSortableList from "@/components/admin/FlyerSortableList";
import { Save, Plus, ImageIcon } from "lucide-react";

export const dynamic = "force-dynamic";

// Tokens compartidos del panel — mismo mundo que la home:
// rojo protagonista, blanco de base, negro para el texto.
const inputCls =
  "w-full rounded border border-black/20 bg-white px-3 py-2 text-sm font-medium text-black transition-colors placeholder:text-black/35 focus:border-[#FF3412] focus:outline-none focus:ring-[3px] focus:ring-[#FF3412]/15";
const labelCls = "flex flex-col gap-1.5 text-sm font-bold text-black";
const card =
  "flex flex-col gap-4 rounded-md border border-black/10 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]";
const btnDark =
  "inline-flex items-center gap-2 rounded bg-black px-4 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-[#FF3412] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3412]";

export default async function AdminBannersPage() {
  const [hero, personalizado, comoComprar, ventanas] = await Promise.all([
    getBannerHero(),
    getBannerSimple("personalizado"),
    getBannerSimple("como_comprar"),
    getVentanas(),
  ]);

  const heroOrdenado = [...hero].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

  return (
    <div className="flex flex-col gap-12">
      {/* ---------------- Banner hero ---------------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div>
            <h2 className="text-2xl font-black uppercase">Flyer principal</h2>
            <p className="mt-1 text-sm text-black/60">
              Los slides del carrusel de arriba de la home. Arrastrá el asa para cambiar el orden — se guarda solo.
            </p>
          </div>
          <span className="text-sm font-bold tabular-nums text-black/50">
            {heroOrdenado.length} {heroOrdenado.length === 1 ? "slide" : "slides"}
          </span>
        </div>

        {heroOrdenado.length === 0 && (
          <div className="mt-5 flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-black/15 bg-white px-6 py-10 text-center">
            <ImageIcon className="h-8 w-8 text-black/25" strokeWidth={1.75} />
            <p className="text-sm font-bold text-black/60">Todavía no hay flyers en el carrusel.</p>
            <p className="text-sm text-black/45">Agregá el primero con el formulario de abajo.</p>
          </div>
        )}

        <FlyerSortableList
          className={heroOrdenado.length ? "mt-5" : ""}
          heroes={heroOrdenado}
        />

        {/* slide nuevo */}
        <form action={actionCreateBannerHero} className={`${card} mt-5 border-dashed`}>
          <p className="text-sm font-bold uppercase text-black/60">Agregar flyer</p>
          <div className="flex flex-wrap items-end gap-3">
            <label className={`${labelCls} w-40`}>
              Nombre
              <input name="nombre" required placeholder="slide-4" className={inputCls} />
            </label>
            <label className={`${labelCls} min-w-[200px] flex-1`}>
              Link (opcional)
              <input name="link" className={inputCls} placeholder="/tienda o https://..." />
            </label>
            <label className={`${labelCls} w-44`}>
              Desktop (1500x400)
              <FileBox name="imagenDesktop" label="Subir imagen" hint="JPG, PNG, WEBP" />
            </label>
            <label className={`${labelCls} w-44`}>
              Mobile (800x600)
              <FileBox name="imagenMobile" label="Subir imagen" hint="JPG, PNG, WEBP" />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded bg-[#FF3412] px-4 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <Plus className="h-4 w-4" strokeWidth={3} /> Agregar
            </button>
          </div>
          <p className="text-xs text-black/50">Se agrega al final del carrusel; después lo arrastrás donde quieras.</p>
        </form>
      </section>

      {/* ---------------- Banners simples ---------------- */}
      <section>
        <h2 className="text-2xl font-black uppercase">Banners</h2>
        <p className="mt-1 text-sm text-black/60">Personalizado y Cómo comprar, con su link.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {(
            [
              ["Personalizado", personalizado],
              ["Cómo comprar", comoComprar],
            ] as const
          ).map(([titulo, b]) => {
            if (!b) return null;
            const d = pbFileUrl("banners_simples", b.id, b.imagen_desktop);
            const m = pbFileUrl("banners_simples", b.id, b.imagen_mobile);
            return (
              <form key={b.id} action={actionUpdateBannerSimple} className={card}>
                <p className="text-sm font-bold uppercase tracking-wide text-black/70">{titulo}</p>
                <div className="flex gap-3">
                  {d ? (
                    <span className="relative block h-16 w-40 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                      <Image src={d} alt="" fill className="object-cover" sizes="160px" />
                    </span>
                  ) : (
                    <span className="flex h-16 w-40 items-center justify-center rounded-sm border border-dashed border-black/20 bg-zinc-50 text-xs font-bold text-black/40">
                      Sin imagen
                    </span>
                  )}
                  {m && (
                    <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-sm border border-black/10 bg-zinc-100 sm:hidden">
                      <Image src={m} alt="" fill className="object-cover" sizes="96px" />
                    </span>
                  )}
                </div>
                <input type="hidden" name="id" value={b.id} />
                <label className={labelCls}>
                  Link (opcional)
                  <input name="link" defaultValue={b.link} placeholder="/como-comprar" className={inputCls} />
                </label>
                <div className="flex flex-wrap items-end gap-3">
                  <label className={`${labelCls} w-36`}>
                    Desktop
                    <FileBox name="imagenDesktop" compact label="Imagen desktop" />
                  </label>
                  <label className={`${labelCls} w-36`}>
                    Mobile
                    <FileBox name="imagenMobile" compact label="Imagen mobile" />
                  </label>
                  <button type="submit" className={btnDark}>
                    <Save className="h-4 w-4" strokeWidth={2.5} /> Guardar
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </section>

      {/* ---------------- Ventanas laterales ---------------- */}
      <section>
        <h2 className="text-2xl font-black uppercase">Ventanas laterales</h2>
        <p className="mt-1 text-sm text-black/60">Imagen o video (mp4/webm) de cada lateral de la home.</p>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {ventanas.map((v: VentanaPb) => {
            const src = pbFileUrl("ventanas_laterales", v.id, v.archivo);
            return (
              <form key={v.id} action={actionUpdateVentana} className={card}>
                <p className="text-sm font-bold uppercase tracking-wide text-black/70">
                  {v.key === "izquierda" ? "Ventana izquierda" : "Ventana derecha"}
                  <span className="ml-2 text-black/40">({v.tipo})</span>
                </p>
                {src && v.tipo === "imagen" && (
                  <span className="relative block h-24 w-48 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                    <Image src={src} alt="" fill className="object-cover" sizes="192px" />
                  </span>
                )}
                {src && v.tipo === "video" && (
                  <video src={src} className="h-24 w-48 rounded-sm border border-black/10 bg-zinc-100" muted loop autoPlay playsInline />
                )}
                <input type="hidden" name="id" value={v.id} />
                <label className={labelCls}>
                  Tipo
                  <select name="tipo" defaultValue={v.tipo} className={inputCls}>
                    <option value="imagen">Imagen / GIF</option>
                    <option value="video">Video</option>
                  </select>
                </label>
                <label className={labelCls}>
                  Link (opcional)
                  <input name="link" defaultValue={v.link} className={inputCls} placeholder="/tienda" />
                </label>
                <label className={`${labelCls} w-56`}>
                  Archivo
                  <FileBox name="archivo" accept="image/*,video/mp4,video/webm" label="Subir imagen o video" hint="JPG, PNG, GIF, MP4, WEBM" />
                </label>
                <button type="submit" className={`${btnDark} w-fit`}>
                  <Save className="h-4 w-4" strokeWidth={2.5} /> Guardar
                </button>
              </form>
            );
          })}
        </div>
      </section>
    </div>
  );
}
