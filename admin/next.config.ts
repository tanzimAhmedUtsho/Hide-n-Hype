import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  outputFileTracingIncludes: { "/*": ["./prisma/migrations/**/*"] },
};
export default nextConfig;
