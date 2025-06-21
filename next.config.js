/** @type {import('next').NextConfig} */
const nextConfig = {
  // 12Factor App - X. Dev/prod parity: containerized deployment
  output: 'standalone',
  
  // 12Factor App - VII. Port binding: explicit port configuration
  experimental: {
    serverMinification: false,
  },
  
  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 