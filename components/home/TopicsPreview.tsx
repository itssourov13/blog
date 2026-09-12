import Link from "next/link";
import { getCategoryCounts } from "@/lib/posts";

export function TopicsPreview() {
  const categories = getCategoryCounts();

  return (
    <section className="container-content border-t border-border py-16 md:py-20">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
          Browse by Topic
        </h2>
        <Link href="/topics" className="link-underline text-sm text-muted-foreground">
          All topics
        </Link>
      </div>

      <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/writing?category=${category.slug}`}
            className="group flex items-baseline justify-between gap-4 border-b border-border py-5"
          >
            <span className="font-serif text-lg text-foreground transition-colors duration-150 group-hover:text-accent">
              {category.name}
            </span>
            <span className="shrink-0 text-sm text-muted-foreground">
              {category.count} {category.count === 1 ? "article" : "articles"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
