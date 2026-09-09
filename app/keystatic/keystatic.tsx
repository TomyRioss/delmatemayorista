"use client";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";

// Parche: Keystatic (browser) -> /api/gh-proxy (Vercel, EEUU) -> api.github.com.
// Evita el PoP Fastly/EZE que devuelve 503 Backend.max_conn.
// A nivel módulo para que aplique antes de cualquier fetch de Keystatic.
if (typeof window !== "undefined" && !(window as any).__ghProxyPatched) {
  (window as any).__ghProxyPatched = true;
  const GH = "https://api.github.com";
  const RAW = "https://raw.githubusercontent.com";
  // Tope seguro para subir por el proxy (Vercel Hobby: ~4.5MB por request, base64 suma 37%).
  const MAX_SUBIDA_BYTES = 3 * 1024 * 1024;
  const origFetch = window.fetch.bind(window);
  window.fetch = ((input: any, init?: RequestInit) => {
    const u0 = typeof input === "string" ? input : (input as Request)?.url;
    // Aviso previo y legible si el archivo es muy pesado para el proxy.
    // Va fuera del try para que el error llegue a Keystatic y no haga fallback.
    if (
      typeof u0 === "string" &&
      u0.startsWith(GH) &&
      u0.includes("/git/blobs") &&
      (init?.method || "GET").toUpperCase() === "POST" &&
      typeof init?.body === "string" &&
      init.body.length > MAX_SUBIDA_BYTES * 1.4
    ) {
      throw new Error(
        `La imagen pesa ${(init.body.length / 1048576).toFixed(1)}MB y el máximo es 3MB. Comprimila y probá de nuevo.`
      );
    }
    try {
      const u = typeof input === "string" ? input : (input as Request)?.url;
      if (typeof u === "string" && u.startsWith(GH)) {
        const target = "/api/gh-proxy" + u.slice(GH.length);
        input = typeof input === "string" ? target : new Request(target, input);
      } else if (typeof u === "string" && u.startsWith(RAW)) {
        const target = "/api/gh-proxy/raw" + u.slice(RAW.length);
        input = typeof input === "string" ? target : new Request(target, input);
      }
    } catch {
      // ante cualquier duda, fetch original
    }
    return origFetch(input, init);
  }) as typeof fetch;
}

const Page = makePage(config);

export default function KeystaticApp() {
  return <Page />;
}
