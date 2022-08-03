/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "imgs.search.brave.com",
      "firebasestorage.googleapis.com",
      "cdn-icons-png.flaticon.com"
    ],
  },
};





module.exports = nextConfig;
