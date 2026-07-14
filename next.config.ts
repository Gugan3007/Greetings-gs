import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    viewTransition: true,
  },
  transpilePackages: ['three'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
