import type { NextConfig } from "next";

const isPagesExport = process.env.NEXT_EXPORT === "1";

const nextConfig: NextConfig = {
  // GitHub Pages 정적 배포 시에만 활성:
  //   NEXT_EXPORT=1 GITHUB_REPO=aeo-agency npm run build
  // 로컬 dev/build (Supabase 연동 ops 포함)에서는 비활성.
  output: isPagesExport ? "export" : undefined,
  basePath: isPagesExport ? `/${process.env.GITHUB_REPO || "aeo-agency"}` : undefined,
  trailingSlash: isPagesExport ? true : undefined,
  images: isPagesExport ? { unoptimized: true } : undefined,
};

export default nextConfig;
