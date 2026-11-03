import type { Metadata } from "next";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/writing/CategoryFilter";
import { getAllPosts, getAllYears, getCategoryCounts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Journal",
  description: "Technical articles, personal experiences, everyday moments, and community stories — filterable by topic, tag, or year.",
};

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; year?: string }>;
}) {
  const params = await searchParams;
  const allPosts = getAllPosts();
  const categories = getCategoryCounts();
  const years = getAllYears();

  const filtered = allPosts.filter((post) => {
    if (params.category && post.category !== params.category) return false;
    if (params.tag && !post.tags.includes(params.tag)) return false;
    if (
      params.year &&
      new Date(post.publishedAt).getFullYear().toString() !== params.year
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="container-content py-16">
      <h1 className="font-serif text-4xl font-medium text-foreground md:text-5xl">Journal</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Technical articles, personal experiences, everyday moments, and community stories — all in one place.
      </p>

      <CategoryFilter
        categories={categories}
        years={years}
        active={{ category: params.category, tag: params.tag, year: params.year }}
      />

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No articles match these filters yet.
        </p>
      ) : (
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <ArticleCard key={post.slug} post={post} size="medium" />
          ))}
        </div>
      )}
    </div>
  );
}
