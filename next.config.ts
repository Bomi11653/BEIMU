import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport = process.env.SITES_BUILD === "1" || isGithubPages;
const basePath = isGithubPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/BEIMU")
  : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Explicit local preview hosts: permit dev resources and HMR over the LAN.
  allowedDevOrigins: ["192.168.1.8", "127.0.0.1"],
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
