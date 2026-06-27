import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      // Job company logos from Remotive API
      { protocol: "https", hostname: "**" },
      // Local backend uploads
      { protocol: "http", hostname: "backend" },
    ],
  },
  async rewrites() {
    return [
      // Proxy /api/* → backend in development
      {
        source: "/api/:path*",
        destination: "http://backend:5000/api/:path*",
      },
      // Proxy /uploads/* → backend static files
      {
        source: "/uploads/:path*",
        destination: "http://backend:5000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
