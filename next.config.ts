import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dycomind.com",
      },
    ],
  },
};

export default nextConfig;
