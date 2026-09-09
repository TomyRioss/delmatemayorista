"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, ImagePlus, Loader2, TriangleAlert } from "lucide-react";

const CARPETAS = [
  { value: "productos", label: "Productos" },
  { value: "categorias", label: "Categorías" },
  { value: "banner-hero", label: "Flyer principal" },
  { value: "banner-personalizado", label: "Banner personalizado" },
  { value: "ventanas-laterales", label: "Ventanas laterales" },
];

export default function SubirImagenPage() {
  const [carpeta, setCarpeta] = useState("productos");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  function elegir(f: File | null) {
    setUrl(null);
    setCopiado(false);
    setError(null);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function subir() {
    if (!file) return;
    setError(null);
    setSubiendo(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("carpeta", carpeta);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "No se pudo subir.");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubiendo(false);
    }
  }

  async function copiar() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopiado(true);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 bg-white px-6 py-10">
      <Link
        href="/keystatic"
        className="inline-flex w-fit items-center gap-2 text-sm font-bold uppercase text-black/60 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        Volver al admin
      </Link>

      <div>
        <h1 className="text-2xl font-black uppercase text-black">Subir imagen</h1>
        <p className="mt-1 text-sm text-black/60">
          Subí la imagen y pegá la URL en el campo correspondiente de Keystatic.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-bold text-black">
        Carpeta
        <select
          value={carpeta}
          onChange={(e) => setCarpeta(e.target.value)}
          className="rounded-sm border-2 border-black/15 bg-white px-3 py-2.5 text-sm font-medium focus:border-black focus:outline-none"
        >
          {CARPETAS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-black/20 px-4 py-10 text-center transition-colors hover:border-black"
      >
        <ImagePlus className="h-8 w-8 text-black/40" strokeWidth={2} />
        <span className="text-sm font-bold text-black">
          {file ? file.name : "Elegí una imagen (máx 8MB)"}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => elegir(e.target.files?.[0] ?? null)}
        />
      </label>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="max-h-64 w-full rounded-sm border border-black/10 object-contain" />
      )}

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-sm border-2 border-[#FF3412] bg-[#FF3412]/5 px-3 py-2.5">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#FF3412]" strokeWidth={2.5} />
          <p className="text-sm font-bold text-[#FF3412]">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={subir}
        disabled={!file || subiendo}
        className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#FF3412] px-4 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {subiendo && <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />}
        {subiendo ? "Subiendo..." : "Subir"}
      </button>

      {url && (
        <div className="flex flex-col gap-2 rounded-sm bg-black/[0.04] p-4">
          <p className="text-sm font-bold break-all text-black">{url}</p>
          <button
            type="button"
            onClick={copiar}
            className="inline-flex w-fit items-center gap-2 rounded-sm bg-black px-4 py-2 text-sm font-bold uppercase text-white hover:bg-[#FF3412]"
          >
            {copiado ? <Check className="h-4 w-4" strokeWidth={2.5} /> : <Copy className="h-4 w-4" strokeWidth={2.5} />}
            {copiado ? "Copiada" : "Copiar URL"}
          </button>
        </div>
      )}
    </div>
  );
}
