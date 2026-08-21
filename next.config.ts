import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport = process.env.SITES_BUILD === "1" || isGithubPages;
const basePath = isGithubPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/BEIMU")
  : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
