import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['11.6.0.193'],
  
  // 优化生产构建
  reactStrictMode: true,
  
  // 启用实验性功能
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // 头部优化（安全和性能）
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
        ],
      },
    ]
  },
};

export default nextConfig;
