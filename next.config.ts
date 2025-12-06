import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/Media/Products/**',
      },
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/media/site/**',
      },
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/Media/Profiles/**',
      },
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/Media/Blogs/**',
      },
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/Media/icons/**',
      },
      {
        protocol: 'https',
        hostname: 'fikrafarida.com',
        pathname: '/media/Blob/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,
  
  // Bundle optimization
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'react-icons',
      'framer-motion',
      'react-international-phone',
    ],
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/:path*\\.(jpg|jpeg|png|webp|avif|svg|gif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
