"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Trash2,
  Save,
} from "lucide-react";
import { pbFileUrl } from "@/lib/pb";
import {
  actionReorderBannerHeroes,
  actionUpdateBannerHero,
  actionDeleteBannerHero,
} from "@/app/admin/actions";

/*
 * Editor de flyers del hero: todo el ordenamiento vive aca.
 * - Drag & drop nativo: el asa (grip + numero) arrastra la fila entera.
 * - La lista se reacomoda en vivo mientras se arrastra.
 * - Al soltar (o con las flechas), se guardan los indices 1..n en PocketBase.
 * - Editar y eliminar usan los mismos server actions de antes.
 * Recibe los records serializados del server component (sin ReactNodes,
 * asi el server затman serializa sin drama).
 */
export default function FlyerSortableList({
  heroes,
  className = "",
}: {
  heroes: import("@/lib/pb").BannerHeroPb[];
  className?: string;
}) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(heroes.map((h) => h.id));
  const [dragFrom, setDragFrom] = useState<number | null>(null); // indice de partida en `ids`
  const [dragTo, setDragTo] = useState<number | null>(null); // indice destino (0..n) en el orden visual
  const [saving, setSaving] = useState(false);
  const [, startTransition] = useTransition();

  const byId = new Map(heroes.map((h) => [h.id, h]));

  // Vista: el orden real + reacomodo en vivo mientras se arrastra.
  const visual = ids.slice();
  if (dragFrom !== null && dragTo !== null) {
    const [moved] = visual.splice(dragFrom, 1);
    visual.splice(dragTo > dragFrom ? dragTo - 1 : dragTo, 0, moved);
  }
  const posOf = new Map(visual.map((id, i) => [id, i]));

  async function commit(next: string[]) {
    const prev = ids;
    setIds(next);
    setSaving(true);
    try {
      await actionReorderBannerHeroes(next);
      startTransition(() => router.refresh());
    } catch {
      setIds(prev); // rollback simple si el server fallo
    } finally {
      setSaving(false);
    }
  }

  function drop(to: number) {
    if (dragFrom === null) return;
    const from = dragFrom;
    setDragFrom(null);
    setDragTo(null);
    if (from === to) return;
    const next = ids.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to > from ? to - 1 : to, 0, moved);
    void commit(next);
  }

  function nudge(id: string, dir: -1 | 1) {
    const i = ids.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return;
    const next = ids.slice();
    [next[i], next[j]] = [next[j], next[i]];
    void commit(next);
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {visual.map((id) => {
        const s = byId.get(id);
        if (!s) return null;
        const vIdx = posOf.get(id) ?? 0;
        const dragging = dragFrom !== null && ids[dragFrom] === id;
        return (
          <div
            key={id}
            style={{ order: vIdx }}
            onDragOver={(e) => {
              if (dragFrom === null) return;
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              const after = e.clientY > rect.top + rect.height / 2;
              setDragTo(Math.max(0, Math.min(ids.length, vIdx + (after ? 1 : 0))));
            }}
            onDrop={(e) => {
              e.preventDefault();
              if (dragFrom === null || dragTo === null) return;
              drop(dragTo);
            }}
            className={`relative flex items-stretch gap-2.5 transition-[transform,filter] duration-200 ease-out ${
              dragging
                ? "z-10 scale-[1.01] shadow-[0_16px_40px_-14px_rgba(0,0,0,0.4)]"
                : ""
            }`}
          >
            {/* Asa + numero de posicion */}
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", id);
                setDragFrom(ids.indexOf(id));
                setDragTo(vIdx);
              }}
              onDragEnd={() => {
                setDragFrom(null);
                setDragTo(null);
              }}
              title="Arrastrar para reordenar"
              className={`flex w-11 shrink-0 cursor-grab touch-none flex-col items-center justify-center gap-1.5 rounded-md border select-none active:cursor-grabbing ${
                dragging
                  ? "border-[#FF3412] bg-[#FF3412] text-white"
                  : "border-black/10 bg-white text-black/35 hover:border-black/25 hover:text-black"
              }`}
            >
              <GripVertical className="h-4 w-4" strokeWidth={2.5} />
              <span
                className={`flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-black tabular-nums ${
                  dragging ? "bg-white text-[#FF3412]" : "bg-black text-white"
                }`}
              >
                {vIdx + 1}
              </span>
            </div>

            {/* Flechas subir/bajar, a la derecha del asa */}
            <div className="flex shrink-0 flex-col items-center justify-center gap-1.5">
              <button
                type="button"
                aria-label={`Subir ${s.nombre}`}
                disabled={vIdx === 0 || saving}
                onClick={() => nudge(id, -1)}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-black/60 ring-1 ring-black/10 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                aria-label={`Bajar ${s.nombre}`}
                disabled={vIdx === visual.length - 1 || saving}
                onClick={() => nudge(id, 1)}
                className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-black/60 ring-1 ring-black/10 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-25"
              >
                <ChevronDown className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Tarjeta: preview + edicion + eliminar */}
            <form
              action={actionUpdateBannerHero}
              className={`flex flex-1 items-stretch overflow-hidden rounded-md border bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow ${
                dragging
                  ? "border-[#FF3412] shadow-[0_14px_32px_-12px_rgba(255,52,18,0.35)]"
                  : "border-black/10 hover:shadow-[0_8px_24px_-10px_rgba(0,0,0,0.2)]"
              }`}
            >
              {/* Preview: la cara del flyer en sus dos formatos */}
              <div className="hidden w-52 shrink-0 flex-col justify-center gap-2 border-r border-black/10 p-4 sm:flex">
                {(() => {
                  const d = pbFileUrl("banner_hero", s.id, s.imagen_desktop);
                  const m = pbFileUrl("banner_hero", s.id, s.imagen_mobile);
                  return (
                    <>
                      {d ? (
                        <span className="relative block aspect-[15/4] w-full overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                          <Image src={d} alt={`${s.nombre} desktop`} fill className="object-cover" sizes="208px" />
                        </span>
                      ) : (
                        <span className="flex aspect-[15/4] w-full items-center justify-center rounded-sm border border-dashed border-black/20 bg-zinc-50 text-xs font-bold text-black/40">
                          Sin desktop
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        {m ? (
                          <span className="relative block aspect-[4/3] h-12 overflow-hidden rounded-sm border border-black/10 bg-zinc-100">
                            <Image src={m} alt={`${s.nombre} mobile`} fill className="object-cover" sizes="64px" />
                          </span>
                        ) : (
                          <span className="flex h-12 w-16 items-center justify-center rounded-sm border border-dashed border-black/20 bg-zinc-50 text-[10px] font-bold text-black/40">
                            Sin mobile
                          </span>
                        )}
                        <span className="text-[11px] font-bold uppercase tracking-wide text-black/35">Mobile</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Edicion */}
              <div className="flex flex-1 flex-wrap items-end gap-3 p-4">
                <input type="hidden" name="id" value={s.id} />
                <label className="flex w-36 flex-col gap-1.5 text-sm font-bold text-black">
                  Nombre
                  <input
                    name="nombre"
                    defaultValue={s.nombre}
                    className="w-full rounded border border-black/20 bg-white px-3 py-2 text-sm font-medium text-black transition-colors placeholder:text-black/35 focus:border-[#FF3412] focus:outline-none focus:ring-[3px] focus:ring-[#FF3412]/15"
                  />
                </label>
                <label className="flex min-w-[180px] flex-1 flex-col gap-1.5 text-sm font-bold text-black">
                  Link (opcional)
                  <input
                    name="link"
                    defaultValue={s.link}
                    placeholder="/tienda o https://..."
                    className="w-full rounded border border-black/20 bg-white px-3 py-2 text-sm font-medium text-black transition-colors placeholder:text-black/35 focus:border-[#FF3412] focus:outline-none focus:ring-[3px] focus:ring-[#FF3412]/15"
                  />
                </label>
                <label className="flex w-36 flex-col gap-1.5 text-sm font-bold text-black">
                  Reemplazar desktop
                  <FileDropbox name="imagenDesktop" />
                </label>
                <label className="flex w-36 flex-col gap-1.5 text-sm font-bold text-black">
                  Reemplazar mobile
                  <FileDropbox name="imagenMobile" />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded bg-black px-4 py-2.5 text-sm font-bold uppercase text-white transition-colors hover:bg-[#FF3412]"
                >
                  <Save className="h-4 w-4" strokeWidth={2.5} /> Guardar
                </button>
              </div>

              {/* Eliminar */}
              <div className="flex items-start p-2">
                <button
                  type="submit"
                  formAction={actionDeleteBannerHero}
                  title="Eliminar slide"
                  aria-label={`Eliminar ${s.nombre}`}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-black/35 transition-colors hover:border-[#FF3412] hover:bg-[#FF3412] hover:text-white"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        );
      })}
      <p
        aria-live="polite"
        className={`h-5 text-sm font-bold text-[#FF3412] transition-opacity duration-200 ${
          saving ? "opacity-100" : "opacity-0"
        }`}
      >
        Guardando orden…
      </p>
    </div>
  );
}

/* Dropzone minima inline (evita importar FileBox: mismo look que el resto del panel) */
function FileDropbox({ name }: { name: string }) {
  const [fileName, setFileName] = useState<string | null>(null);
  return (
    <span
      className={`flex h-[42px] items-center justify-center gap-2 rounded border border-dashed text-xs font-bold transition-colors ${
        fileName ? "border-black/30 bg-zinc-50 text-black" : "border-black/25 bg-white text-black/40 hover:border-black/50"
      }`}
    >
      <input
        type="file"
        name={name}
        accept="image/*"
        className="hidden"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
      <button
        type="button"
        onClick={(e) => (e.currentTarget.parentElement?.querySelector("input") as HTMLInputElement | null)?.click()}
        className="cursor-pointer select-none"
      >
        {fileName ?? "+Elegir archivo"}
      </button>
    </span>
  );
}
