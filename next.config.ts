import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.suporteleiloes.com.br',
      },
      {
        protocol: 'https',
        hostname: 'leiloespb.com.br',
      }
    ],
  },
};

export default nextConfig;
