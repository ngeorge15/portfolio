import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Emitted only once a domain is configured; a wrong sitemap URL is
    // worse than none.
    ...(site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}),
  };
}
