import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

/* Sitemap <loc> values must be absolute URLs. Until NEXT_PUBLIC_SITE_URL is
   set there is no correct absolute form, so this emits an empty (but valid)
   urlset rather than relative paths a crawler would reject. Setting the env
   var populates it automatically. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  if (!base) return [];

  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/resume`, lastModified: now, priority: 0.7 },
    ...projects.map((p) => ({
      url: `${base}/work/${p.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
