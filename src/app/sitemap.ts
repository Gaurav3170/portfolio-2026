import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().filter((post) => !post.draft);
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.updated ?? post.date })),
  ];
}
