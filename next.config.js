/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Add your image domains if needed
  },
  env: {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
  },
}

module.exports = nextConfig
