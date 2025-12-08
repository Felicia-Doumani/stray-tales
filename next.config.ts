import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
