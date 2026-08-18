import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
    localPatterns: [
      { pathname: "/banner-personalizado/**" },
      { pathname: "/banner-hero/**" },
    ],
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
