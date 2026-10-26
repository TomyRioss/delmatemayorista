"use client";

import { useId, useEffect, useRef, useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";

// Zona de subida reutilizable del panel: recuadro punteado con icono.
// Sigue siendo un <input type="file"> real (misma FormData del server action);
// solo cambia el look y muestra el nombre + preview de lo elegido.
export default function FileBox({
  name,
  accept = "image/*",
  label = "Elegir archivo",
  hint,
  compact = false,
}: {
  name: string;
  accept?: string;
  label?: string;
  hint?: string;
  compact?: boolean;
}) {
  const id = useId();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function elegir(f: File | null) {
    setFile(f);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (f && (f.type.startsWith("image/") || f.type.startsWith("video/"))) {
      setPreviewUrl(URL.createObjectURL(f));
    } else {
      setPreviewUrl(null);
    }
  }

  const esVideo = file?.type.startsWith("video/");

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border-2 border-dashed border-black/25 bg-white text-center transition-colors hover:border-black hover:bg-black/[0.02] ${
          compact ? "px-2 py-2" : "px-3 py-5"
        }`}
      >
        {file ? (
          <>
            {previewUrl && !esVideo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt=""
                className={`rounded-sm border border-black/10 object-cover ${compact ? "h-10 w-10" : "h-14 w-14"}`}
              />
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF3412]">
              <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="max-w-[140px] truncate">{file.name}</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-black/40">
              Click para cambiar
            </span>
          </>
        ) : (
          <>
            <span
              className={`flex items-center justify-center rounded-full bg-black/5 ${compact ? "h-6 w-6" : "h-9 w-9"}`}
            >
              <Upload
                className={`${compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} text-black/60`}
                strokeWidth={2.5}
              />
            </span>
            <span className={`font-bold text-black/60 ${compact ? "text-[11px]" : "text-xs"}`}>
              {label}
            </span>
            {hint && (
              <span className="text-[10px] font-medium text-black/35">{hint}</span>
            )}
          </>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => elegir(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}
