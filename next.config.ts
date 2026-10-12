import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Konten dibaca dari folder `content/` lewat fs; pastikan ikut ter-trace saat deploy.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
