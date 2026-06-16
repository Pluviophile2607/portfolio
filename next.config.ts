import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.designfast.io",
      },
    ],
  },
  allowedDevOrigins: ["192.168.0.102"],
};

export default nextConfig;
