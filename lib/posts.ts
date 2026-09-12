import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { calculateReadingTime } from "./utils";
import { CATEGORIES } from "./categories";
import type { Category, CategoryMeta, Post, PostFrontmatter } from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export { CATEGORIES } from "./categories";

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const fullPath = path.join(POSTS_DIR, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;
  const { minutes, words } = calculateReadingTime(content);

  return {
    ...frontmatter,
    slug,
    content,
    readingTime: minutes,
    wordCount: words,
  };
}

/**
 * Reads every post from disk once per request (cached via React's `cache`,
 * not a browser cache) and sorts newest-first. This is the only function
 * that touches the file system — everything else derives from its output,
 * so swapping in a database later (see prisma/schema.prisma) means
 * rewriting this one function and leaving the rest of the app alone.
 */
export const getAllPosts = cache((): Post[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts = files.map(readPostFile);

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
});

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getFeaturedPost(): Post | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.featured) ?? posts[0];
}

export function getLatestPosts(options?: { excludeSlug?: string; limit?: number }): Post[] {
  const posts = getAllPosts().filter((post) => post.slug !== options?.excludeSlug);
  return typeof options?.limit === "number" ? posts.slice(0, options.limit) : posts;
}

export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);

  const scored = others.map((candidate) => {
    let score = 0;
    if (candidate.category === post.category) score += 2;
    score += candidate.tags.filter((tag) => post.tags.includes(tag)).length;
    return { candidate, score };
  });

  const ranked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.candidate);

  if (ranked.length >= limit) return ranked.slice(0, limit);

  // Backfill with the most recent posts if there aren't enough matches.
  const fallback = others.filter((p) => !ranked.includes(p));
  return [...ranked, ...fallback].slice(0, limit);
}

export function getAdjacentPosts(slug: string): { prev?: Post; next?: Post } {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    // "next" chronologically = the post published just before this one,
    // which sits earlier in this newest-first array (higher index).
    prev: posts[index + 1],
    next: posts[index - 1],
  };
}

export function getCategoryCounts(): (CategoryMeta & { count: number })[] {
  const posts = getAllPosts();
  return CATEGORIES.map((category) => ({
    ...category,
    count: posts.filter((post) => post.category === category.slug).length,
  })).filter((category) => category.count > 0);
}

export function getAllTags(): { slug: string; name: string; count: number }[] {
  const posts = getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, name: slug, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

export function getAllYears(): number[] {
  const years = new Set(getAllPosts().map((post) => new Date(post.publishedAt).getFullYear()));
  return Array.from(years).sort((a, b) => b - a);
}

export { getCategoryName } from "./categories";
