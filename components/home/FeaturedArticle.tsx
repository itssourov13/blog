import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CoverArt } from "@/components/article/CoverArt";
import { PostMeta } from "@/components/article/PostMeta";
import type { Post } from "@/lib/types";

export function FeaturedArticle({ post }: { post: Post }) {
  return (
    <section className="container-content py-4 md:py-8">
      <p className="text-sm font-medium tracking-wide text-accent">Featured</p>

      <Link
        href={`/posts/${post.slug}`}
        className="group mt-6 grid gap-8 md:grid-cols-2 md:items-center md:gap-14"
      >
        <div className="aspect-[16/10] overflow-hidden rounded-sm">
          <CoverArt
            seed={post.slug}
            category={post.category}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>

        <div>
          <PostMeta
            category={post.category}
            readingTime={post.readingTime}
            publishedAt={post.publishedAt}
            uppercase
          />

          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight text-foreground transition-colors duration-150 group-hover:text-accent md:text-4xl">
            {post.title}
          </h2>

          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <span className="mt-6 inline-flex items-center gap-1.5 text-base font-medium text-foreground">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </section>
  );
}
