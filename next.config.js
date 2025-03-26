/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,  // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,  // Better for static hosting
  compress: true,  // Enable compression
  // Enable build caching
  experimental: {
    turbotrace: {
      logLevel: 'error'
    },
    turboCaching: true,
  },
}

// Suppress the punycode warning
if (typeof process !== 'undefined') {
  process.removeAllListeners('warning')
}

module.exports = nextConfig 