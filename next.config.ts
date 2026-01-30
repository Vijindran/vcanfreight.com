import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Cloudflare Pages configuration handled by @cloudflare/next-on-pages
  images: {
    unoptimized: true, // Required for Cloudflare Pages
  },
};

export default nextConfig;
