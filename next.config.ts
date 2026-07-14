import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const localDevelopmentOrigins = Object.values(networkInterfaces())
  .flat()
  .filter((address) => address?.family === 'IPv4' && !address.internal)
  .map((address) => address!.address);

const nextConfig: NextConfig = {
  allowedDevOrigins: localDevelopmentOrigins,
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
