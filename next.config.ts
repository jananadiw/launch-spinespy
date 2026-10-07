import type { NextConfig } from "next";
import { PRODUCTION_SITE_URL } from "./src/lib/site";

const canonicalHostRedirects = (host: string) => [
  {
    source: "/",
    has: [
      {
        type: "host" as const,
        value: host,
      },
    ],
    destination: PRODUCTION_SITE_URL,
    permanent: true,
  },
  {
    source: "/:path*",
    has: [
      {
        type: "host" as const,
        value: host,
      },
    ],
    destination: `${PRODUCTION_SITE_URL}/:path*`,
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...canonicalHostRedirects("spinespy.com"),
      ...canonicalHostRedirects("launch-spinespy.vercel.app"),
    ];
  },
  trailingSlash: false,
};

export default nextConfig;
