import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "spinespy.com",
          },
        ],
        destination: "https://www.spinespy.com",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "spinespy.com",
          },
        ],
        destination: "https://www.spinespy.com/:path*",
        permanent: true,
      },
    ];
  },
  trailingSlash: false,
};

export default nextConfig;
