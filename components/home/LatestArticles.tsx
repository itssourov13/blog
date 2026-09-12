import { ArticleCard } from "@/components/article/ArticleCard";
import type { Post } from "@/lib/types";

export function LatestArticles({ posts }: { posts: Post[] }) {
  const [heroPost, sidePost, ...rest] = posts;
  const mediumPosts = rest.slice(0, 3);
  const compactPosts = rest.slice(3, 7);

  return (
    <section className="container-content border-t border-border py-16 md:py-20">
      <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
        Latest Writing
      </h2>

      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {heroPost && (
          <div className="md:col-span-2">
            <ArticleCard post={heroPost} size="large" />
          </div>
        )}
        {sidePost && <ArticleCard post={sidePost} size="medium" />}
      </div>

      {mediumPosts.length > 0 && (
        <div className="mt-14 grid gap-x-8 gap-y-12 border-t border-border pt-14 md:grid-cols-3">
          {mediumPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} size="medium" />
          ))}
        </div>
      )}

      {compactPosts.length > 0 && (
        <div className="mt-14 divide-y divide-border border-t border-border">
          {compactPosts.map((post) => (
            <div key={post.slug} className="py-5">
              <ArticleCard post={post} size="compact" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
