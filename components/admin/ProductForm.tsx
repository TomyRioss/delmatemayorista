"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  actionCreateProduct,
  actionUpdateProduct,
} from "@/app/admin/actions";

const MAX_ORIGINAL_BYTES = 20 * 1024 * 1024;
const MAX_COMPRESSED_FILE_BYTES = 900_000;
const MAX_IMAGE_DIMENSION = 2000;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Elegí archivos de imagen válidos.");
  }

  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));

    for (let resizeAttempt = 0; resizeAttempt < 8; resizeAttempt++) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("El navegador no pudo procesar una imagen.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.88, 0.82, 0.76, 0.7, 0.64, 0.58]) {
        const compressed = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (result) => result ? resolve(result) : reject(new Error("No se pudo comprimir una imagen.")),
            "image/webp",
            quality,
          );
        });

        if (compressed.size <= MAX_COMPRESSED_FILE_BYTES) {
          const filename = `${file.name.replace(/\.[^.]+$/, "") || "imagen"}.webp`;
          return new File([compressed], filename, { type: "image/webp" });
        }
      }

      scale *= 0.8;
    }

    throw new Error("Una imagen no se pudo reducir lo suficiente. Probá con otra imagen.");
  } finally {
    bitmap.close();
  }
}

export default function ProductForm({
  isNew,
  children,
}: {
  isNew: boolean;
  children: ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[type="file"][name^="image"]'),
    );
    const selected = inputs
      .map((input) => ({ name: input.name, file: input.files?.[0] ?? null }))
      .filter((entry): entry is { name: string; file: File } => !!entry.file);
    const originalBytes = selected.reduce((total, entry) => total + entry.file.size, 0);

    if (originalBytes > MAX_ORIGINAL_BYTES) {
      setError("Las imágenes originales no pueden superar 20 MB en total.");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const formData = new FormData(form);
      for (const { name, file } of selected) {
        formData.set(name, await compressImage(file));
      }

      await (isNew ? actionCreateProduct(formData) : actionUpdateProduct(formData));
    } catch (cause) {
      console.error("No se pudo optimizar o guardar el producto:", cause);
      setError(cause instanceof Error ? cause.message : "No se pudo guardar el producto. Intentá de nuevo.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
      {error && (
        <p role="alert" className="rounded-sm border-2 border-[#FF3412]/30 bg-[#FF3412]/5 px-4 py-3 text-sm font-semibold text-[#B3210B]">
          {error}
        </p>
      )}
      {children}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-sm bg-[#FF3412] px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Optimizando imágenes y guardando..." : isNew ? "Crear producto" : "Guardar cambios"}
      </button>
    </form>
  );
}
