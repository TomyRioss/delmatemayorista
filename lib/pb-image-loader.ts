// Loader de next/image para delmatemayorista.
//
// Las imagenes guardadas en PocketBase se sirven con los thumbs nativos de PB
// (?thumb=WxHf) en vez del optimizer de Next:
//  - PB genera y cachea el resize en el VPS (una vez por tamano).
//  - Evita que cada variant del optimizer re-descargue el original por el
//    tunel SSH en dev (era la causa de los 500/timeout del /_next/image).
//
// IMPORTANTE (PB 0.40): solo se generan los tamaños declarados EXACTOS en el
// schema del campo file (thumbs 100/200/400/600/800, modo "f" = fit). Un
// ?thumb= no declarado devuelve el ORIGINAL completo.
//
// Regla de pesos (medidos sobre el catalogo real):
//  - thumb 400x400f de un producto ~40KB vs original ~93KB.
//  - thumb 1200x120f (sin downscale) re-encodea MAS pesado que el original
//    (~122KB). => arriba de 640 pedido conviene el original.
//  - PNG: PB re-encodea como PNG y puede engordar (800f=217KB vs orig=94KB).
//    GIF: el thumb rompe la animacion. Ambos viajan como original.
//
// Las imagenes que no son de PB (pexels, blob, local) pasan al loader default
// para que Next las configure/optimice como siempre.

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

/** Elige la variante declarada segun el ancho que pide el srcset de Next. */
export function pbThumbWidth(requested: number): number | null {
  const w = Math.round(requested);
  if (w <= 200) return 200; // thumbs chicos (admin, iconos): ~15KB
  if (w <= 640) return 400; // cards / slots medianos (hasta ~320 css px @2x): ~40KB
  return null; // grande: el original es mas liviano que el re-encode y mas nítido
}

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

  const lower = src.toLowerCase();
  if (lower.endsWith(".png") || lower.endsWith(".gif")) return src;

  const w = pbThumbWidth(width);
  if (w === null) return src;

  // PB exige WxH: variante cuadrada declarada, modo "f" (fit: imagen entera).
  // El CSS de <Image> mantiene el encuadre con object-fit.
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}thumb=${w}x${w}f`;
}
