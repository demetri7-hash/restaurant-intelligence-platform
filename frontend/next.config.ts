import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure turbopack properly with the new format
  turbopack: {
    root: process.cwd(),
    resolveAlias: {
      '@': './src',
      // Resolve the PostCSS dependency issues
      'picocolors': require.resolve('picocolors'),
      'source-map-js': require.resolve('source-map-js'),
      'nanoid/non-secure': require.resolve('nanoid/non-secure'),
    }
  }
};

export default nextConfig;
