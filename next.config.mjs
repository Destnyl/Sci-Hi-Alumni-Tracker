/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper chunk loading
  experimental: {
    optimizePackageImports: ['zustand'],
  },
};

export default nextConfig;
