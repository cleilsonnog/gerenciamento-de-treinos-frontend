import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "exercisedb.dev",
      },
      {
        protocol: "https",
        hostname: "static.exercisedb.dev",
      },
    ],
  },
};

export default nextConfig;
