import Link from "next/link";
import { CoverArt } from "./CoverArt";
import { Tag } from "./Tag";
import { PostMeta } from "./PostMeta";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ArticleCard({
  post,
  size = "medium",
}: {
  post: Post;
  size?: "large" | "medium" | "compact";
}) {
  const isCompact = size === "compact";
  const isLarge = size === "large";

  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        {!isCompact && (
          <div
            className={cn(
              "relative mb-4 overflow-hidden rounded-sm",
              isLarge ? "aspect-[16/10]" : "aspect-[16/11]"
            )}
          >
            <CoverArt
              seed={post.slug}
              category={post.category}
              className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          </div>
        )}

        <PostMeta
          category={post.category}
          readingTime={post.readingTime}
          publishedAt={post.publishedAt}
        />

        <h3
          className={cn(
            "mt-2 font-serif font-medium leading-snug text-foreground transition-colors duration-150 group-hover:text-accent",
            isLarge ? "text-2xl md:text-[1.75rem]" : isCompact ? "text-base" : "text-xl"
          )}
        >
          {post.title}
        </h3>

        {!isCompact && (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
      </Link>

      {isLarge && (
        <div className="mt-3 flex flex-wrap gap-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}
