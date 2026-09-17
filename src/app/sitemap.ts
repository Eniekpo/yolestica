import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await posts(undefined, 1000);
  return [
    ...[
      "",
      "/about",
      "/services",
      "/pricing",
      "/contact",
      "/blog",
      "/privacy",
      "/terms",
    ].map((p) => ({
      url: `https://yoletech.work${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...articles.map((p) => ({
      url: `https://yoletech.work/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
