/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'], // Add your image domains if needed
  },
  env: {
    VITE_BACKEND_URL: process.env.VITE_BACKEND_URL,
    WHATSAPP: process.env.WHATSAPP || process.env.NEXT_PUBLIC_WHATSAPP,
    NEXT_PUBLIC_WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP || process.env.WHATSAPP,
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
