/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  // serverActions: true,
  // mdxRs: true,
  // serverComponentsExternalPackages: ["mongoose"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/settings',
        destination: '/settings/suppliers',
        permanent: true,
      },

    ]
  },
};

export default nextConfig;
// module.exports = nextConfig;
