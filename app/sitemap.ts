import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { site } from "@/lib/author";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const tags = getAllTags();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/writing`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/topics`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/tags`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/posts/${post.slug}`,
    lastModified: post.updatedAt ?? post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag.slug)}`,
    changeFrequency: "weekly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
