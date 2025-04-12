const config = require("./src/config/config.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: config.base_path !== "/" ? config.base_path : "",
  trailingSlash: config.site.trailing_slash,
  output: "standalone",
  distDir: '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com'
      },
      {
        protocol: 'https',
        hostname: '*.cdn.shopify.com'
      }
    ],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  swcMinify: true,
  compiler: {
    removeConsole: false,
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
    missingSuspenseWithCSRBailout: false,
    workerThreads: false,
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
};

module.exports = nextConfig;