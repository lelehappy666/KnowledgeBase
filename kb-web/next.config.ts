import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['puppeteer-core', 'puppeteer', 'chromium-bidi'],
};

export default nextConfig;
