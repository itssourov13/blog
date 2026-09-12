import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleCard } from "@/components/article/ArticleCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Articles tagged with "${decoded}".`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);

  if (posts.length === 0) notFound();

  return (
    <div className="container-content py-16">
      <p className="text-sm font-medium text-accent">Tag</p>
      <h1 className="mt-2 font-serif text-4xl font-medium text-foreground md:text-5xl">
        #{decoded}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {posts.length} {posts.length === 1 ? "article" : "articles"}
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} size="medium" />
        ))}
      </div>

      <p className="mt-16 text-sm text-muted-foreground">
        <Link href="/tags" className="link-underline">
          Browse all tags
        </Link>
      </p>
    </div>
  );
}
