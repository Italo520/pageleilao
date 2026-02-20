import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

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

export default withSerwist(nextConfig);
