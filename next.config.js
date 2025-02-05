/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Better for static hosting
  compress: true,  // Enable compression
}

// Suppress the punycode warning
if (typeof process !== 'undefined') {
  process.removeAllListeners('warning')
}

module.exports = nextConfig 