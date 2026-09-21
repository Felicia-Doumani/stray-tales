import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: "standalone",

  images: {
    domains: ["gcptwkgwnnawdrepjmhg.supabase.co"],
  },
};

export default nextConfig;