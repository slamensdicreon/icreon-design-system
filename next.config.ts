import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cms.optimizely.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
