import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://13.62.160.51:8080/:path*',
      },
    ];
  },
};

export default nextConfig;
