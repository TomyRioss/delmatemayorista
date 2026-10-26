// Loader de next/image para delmatemayorista.
//
// Las imagenes guardadas en PocketBase se sirven con los thumbs nativos de PB
// (?thumb=WxH[f]) en vez del optimizer de Next:
//  - PB genera y cachea el resize en el VPS (una vez por tamano).
//  - Evita que cada variant del optimizer re-descargue el original por el
//    tunel SSH en dev (era la causa de los 500/timeout del /_next/image).
// Las imagenes que no son de PB (pexels, blob, local) pasan por el loader
// default para que Next las configure/optimice como siempre.

const PB_HOSTS = (() => {
  try {
    const u = new URL(
      process.env.POCKETBASE_URL ?? process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8096",
    );
    return [u.host, u.hostname];
  } catch {
    return ["127.0.0.1:8096", "127.0.0.1"];
  }
})();

export default function pbImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  let path: URL | null = null;
  try {
    path = new URL(src, "http://placeholder.local");
  } catch {
    return src;
  }
  const isPbFile =
    path.pathname.includes("/api/files/") &&
    PB_HOSTS.includes(path.host) ||
    (path.host === "placeholder.local" && path.pathname.includes("/api/files/"));
  if (!isPbFile) return src;

  // PB exige WxH: normalizamos a cuadrado con crop centrado.
  // Para aspect ratios distintos el CSS de <Image> mantiene el object-fit.
  const w = Math.max(32, Math.min(2048, Math.round(width)));
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}thumb=${w}x${w}`;
}
