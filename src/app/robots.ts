import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isProductionHost, PRODUCTION_SITE_URL } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const requestHeaders = await headers();
  const indexable = isProductionHost(requestHeaders.get("host"));

  if (!indexable) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${PRODUCTION_SITE_URL}/sitemap.xml`,
  };
}
