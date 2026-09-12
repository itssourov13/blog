import { ArticleCard } from "./ArticleCard";
import type { Post } from "@/lib/types";

export function RelatedArticles({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-border py-16">
      <h2 className="font-serif text-2xl font-medium text-foreground">You may also like</h2>
      <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} size="medium" />
        ))}
      </div>
    </section>
  );
}
