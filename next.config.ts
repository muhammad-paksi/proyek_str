import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Naikkan limit ke 100 MB (atau '1gb')
    },
  },
};

export default nextConfig;
