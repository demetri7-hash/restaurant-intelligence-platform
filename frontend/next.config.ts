import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Configure turbopack properly with the new format
  turbopack: {
    // Set the root directory to the workspace root for proper module resolution
    root: path.resolve('../'),
    resolveAlias: {
      '@': './src',
      // Resolve the PostCSS dependency issues
      'picocolors': require.resolve('picocolors'),
      'source-map-js': require.resolve('source-map-js'),
      'nanoid/non-secure': require.resolve('nanoid/non-secure'),
    }
  },
  // Help resolve modules from parent directory for workspaces
  experimental: {
    externalDir: true
  },
  // Additional webpack config for module resolution
  webpack: (config) => {
    // Add parent node_modules to resolve modules
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push(path.resolve('../node_modules'));
    return config;
  }
};

export default nextConfig;
