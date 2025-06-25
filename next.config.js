/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "res.cloudinary.com", "images.unsplash.com", "via.placeholder.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
