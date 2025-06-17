// @ts-check

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        pathname: '/Media/icons/**',
      }
    ],
  },
};

module.exports = withNextIntl(nextConfig);
