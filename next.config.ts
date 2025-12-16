// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ["gcptwkgwnnawdrepjmhg.supabase.co"],
  },
};

export default nextConfig;
