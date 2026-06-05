import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.railway.app' },
      { protocol: 'https', hostname: '**.render.com' },
    ],
  },
  async redirects() {
    return [{ source: '/home', destination: '/', permanent: true }];
  },
  async headers() {
    return [
      {
        source: '/opportunity/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
      },
    ];
  },
};

export default nextConfig;
