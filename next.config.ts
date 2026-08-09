import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  allowedDevOrigins: ['TU-IP-QUE-TE-MOSTRÓ-EL-ERROR'],
};

export default nextConfig;
