import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features
  experimental: {
    // Enable React 19 concurrent features
    reactCompiler: true,
    // Enable partial prerendering for better performance
    ppr: 'incremental',
    // Enable React Server Components optimizations
    serverComponentsHmrCache: true,
  },

  // Performance optimizations
  poweredByHeader: false,

  // Bundle analyzer for production builds
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),
};

export default nextConfig;
