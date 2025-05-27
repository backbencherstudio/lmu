/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.4.3:3001/:path*'
      }
    ];
  },
  images: {
    domains: ['192.168.4.3'],
  }
};

export default nextConfig;
