import type { NextConfig } from "next";

const pbHost = (() => {
  try {
    return new URL(
      process.env.POCKETBASE_URL ?? process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8096",
    ).hostname;
  } catch {
    return "127.0.0.1";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "*.public.blob.vercel-storage.com" },
      { hostname: pbHost, protocol: "http" },
      { hostname: pbHost, protocol: "https" },
    ],
    localPatterns: [{ pathname: "/**" }],
    // PB en loopback (dev/tunel SSH): Next 16 bloquea el optimizer hacia
    // IPs privadas por SSRF-protection. Solo se habilita si el host PB es local.
    ...(["127.0.0.1", "localhost", "::1"].includes(pbHost)
      ? { dangerouslyAllowLocalIP: true }
      : {}),
    // Imagenes de PB via loader propio (thumbs nativos de PB): evita que el
    // optimizer de Next re-descargue originales por el tunel SSH (500/timeout).
    loader: "custom",
    loaderFile: "./lib/pb-image-loader.ts",
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingIncludes: {
    "/**": ["./content/**"],
  },
  env: {
    NEXT_PUBLIC_GIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA ?? "",
  },
};

export default nextConfig;
