/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // 3D assets in /public (e.g. /3dspecific.glb)
        source: "/:path*\\.(glb|gltf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
