import type { MetadataRoute } from "next";
import content from "@/shared/data/content.json";
import { SITE_URL } from "./_composition/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: content.metadata.lastUpdated,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
