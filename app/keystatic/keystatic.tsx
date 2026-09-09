"use client";
import { makePage } from "@keystatic/next/ui/app";
import config from "../../keystatic.config";

// Parche: Keystatic (browser) -> /api/gh-proxy (Vercel, EEUU) -> api.github.com.
// Evita el PoP Fastly/EZE que devuelve 503 Backend.max_conn.
// A nivel módulo para que aplique antes de cualquier fetch de Keystatic.
if (typeof window !== "undefined" && !(window as any).__ghProxyPatched) {
  (window as any).__ghProxyPatched = true;
  const GH = "https://api.github.com";
  const origFetch = window.fetch.bind(window);
  window.fetch = ((input: any, init?: RequestInit) => {
    try {
      const u = typeof input === "string" ? input : (input as Request)?.url;
      if (typeof u === "string" && u.startsWith(GH)) {
        const target = "/api/gh-proxy" + u.slice(GH.length);
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
