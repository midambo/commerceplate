const config = require("./src/config/config.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",
  images: {
    domains: ['cdn.shopify.com', 'localhost', 'via.placeholder.com'],
    unoptimized: false,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    missingSuspenseWithCSRBailout: false,
    workerThreads: true,
    optimizePackageImports: [
      '@headlessui/react',
      'date-fns',
      'framer-motion',
      'react-icons',
      'swiper',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  httpAgentOptions: {
    keepAlive: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Prevent duplicate modules
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      mergeDuplicateChunks: true,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            name: 'vendors',
          },
          commons: {
            test: /[\\/]node_modules[\\/](@headlessui|date-fns|framer-motion|react-icons|swiper)[\\/]/,
            name: 'commons',
            chunks: 'all',
            priority: 20,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Ensure module names are handled safely
    config.module = {
      ...config.module,
      parser: {
        javascript: {
          strictExportPresence: true,
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
