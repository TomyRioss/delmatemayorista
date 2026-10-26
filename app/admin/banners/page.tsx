import Link from "next/link";
import Image from "next/image";
import { getBannerHero, getBannerSimple, getVentanas, pbFileUrl } from "@/lib/pb";
import type { BannerHeroPb, BannerSimplePb, VentanaPb } from "@/lib/pb";
import {
  actionUpdateBannerHero,
  actionCreateBannerHero,
  actionDeleteBannerHero,
  actionUpdateBannerSimple,
  actionUpdateVentana,
} from "@/app/admin/actions";
import FileBox from "@/components/admin/FileBox";
import { Save, Plus, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-sm border-2 border-black/15 bg-white px-3 py-2 text-sm font-medium text-black focus:border-black focus:outline-none";
const labelCls = "flex flex-col gap-1.5 text-sm font-bold text-black";
const card = "flex flex-col gap-4 rounded-sm border-2 border-black/10 bg-white p-5";

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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase">Flyer principal</h2>
        </div>
        <p className="mt-1 text-sm text-black/60">Los slides del carrusel de arriba de la home. Orden = posición.</p>

        <div className="mt-5 flex flex-col gap-4">
          {heroOrdenado.map((s) => {
            const d = pbFileUrl("banner_hero", s.id, s.imagen_desktop);
            const m = pbFileUrl("banner_hero", s.id, s.imagen_mobile);
            return (
              <div key={s.id} className={card}>
                <div className="flex flex-wrap items-center gap-5">
                  {d && (
                    <span className="relative block h-14 w-40 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                      <Image src={d} alt="" fill className="object-cover" sizes="160px" unoptimized />
                    </span>
                  )}
                  <form action={actionUpdateBannerHero} className="flex flex-1 flex-wrap items-end gap-3">
                    <input type="hidden" name="id" value={s.id} />
                    <label className={`${labelCls} w-40`}>
                      Nombre
                      <input name="nombre" defaultValue={s.nombre} className={inputCls} />
                    </label>
                    <label className={`${labelCls} w-24`}>
                      Orden
                      <input name="orden" type="number" defaultValue={s.orden ?? 0} className={inputCls} />
                    </label>
                    <label className={`${labelCls} min-w-[200px] flex-1`}>
                      Link (opcional)
                      <input name="link" defaultValue={s.link} placeholder="/tienda o https://..." className={inputCls} />
                    </label>
                    <label className={`${labelCls} w-40`}>
                      Desktop
                      <FileBox name="imagenDesktop" compact label="Imagen desktop" />
                    </label>
                    <label className={`${labelCls} w-40`}>
                      Mobile
                      <FileBox name="imagenMobile" compact label="Imagen mobile" />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-sm bg-black px-4 py-2.5 text-sm font-bold uppercase text-white hover:bg-[#FF3412]"
                    >
                      <Save className="h-4 w-4" strokeWidth={2.5} /> Guardar
                    </button>
                  </form>
                  {(d || m) && (
                    <form action={actionDeleteBannerHero}>
                      <input type="hidden" name="id" value={s.id} />
                      <button
                        type="submit"
                        title="Eliminar slide"
                        className="flex h-10 w-10 items-center justify-center rounded-sm border-2 border-[#FF3412] text-[#FF3412] transition-colors hover:bg-[#FF3412] hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}

          {/* slide nuevo */}
          <form action={actionCreateBannerHero} className={`${card} border-dashed`}>
            <p className="text-sm font-bold uppercase tracking-wide text-black/60">Agregar slide</p>
            <div className="flex flex-wrap items-end gap-3">
              <label className={`${labelCls} w-40`}>
                Nombre
                <input name="nombre" required placeholder="slide-4" className={inputCls} />
              </label>
              <label className={`${labelCls} w-24`}>
                Orden
                <input name="orden" type="number" defaultValue={heroOrdenado.length ? Math.max(...heroOrdenado.map((h) => h.orden ?? 0)) + 1 : 1} className={inputCls} />
              </label>
              <label className={`${labelCls} min-w-[200px] flex-1`}>
                Link (opcional)
                <input name="link" className={inputCls} placeholder="/tienda o https://..." />
              </label>
            </div>
            <div className="flex flex-wrap items-end gap-3">
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
                className="inline-flex items-center gap-2 rounded-sm bg-[#FF3412] px-4 py-2.5 text-sm font-bold uppercase text-white hover:bg-black"
              >
                <Plus className="h-4 w-4" strokeWidth={3} /> Agregar
              </button>
            </div>
          </form>
        </div>
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
                <div className="flex gap-5">
                  {d && (
                    <span className="relative block h-16 w-32 shrink-0 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                      <Image src={d} alt="" fill className="object-cover" sizes="128px" unoptimized />
                    </span>
                  )}
                  {m && (
                    <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-sm border border-black/10 bg-zinc-100 sm:hidden">
                      <Image src={m} alt="" fill className="object-cover" sizes="96px" unoptimized />
                    </span>
                  )}
                </div>
                <input type="hidden" name="id" value={b.id} />
                <label className={labelCls}>
                  Link (opcional)
                  <input name="link" defaultValue={b.link} placeholder="/como-comprar" className={inputCls} />
                </label>
                <div className="flex flex-wrap items-end gap-3">
                  <label className={`${labelCls} w-40`}>
                    Desktop
                    <FileBox name="imagenDesktop" compact label="Imagen desktop" />
                  </label>
                  <label className={`${labelCls} w-40`}>
                    Mobile
                    <FileBox name="imagenMobile" compact label="Imagen mobile" />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-sm bg-black px-4 py-2.5 text-sm font-bold uppercase text-white hover:bg-[#FF3412]"
                  >
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
                    <Image src={src} alt="" fill className="object-cover" sizes="192px" unoptimized />
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
                <button
                  type="submit"
                  className="inline-flex w-fit items-center gap-2 rounded-sm bg-black px-4 py-2.5 text-sm font-bold uppercase text-white hover:bg-[#FF3412]"
                >
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
