import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep Node-only SDKs external to the server bundle */
  serverExternalPackages: ["razorpay"],

  /* Image optimization */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /* Typescript */
  typescript: {
    ignoreBuildErrors: false,
  },
  /* Headers for security */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
