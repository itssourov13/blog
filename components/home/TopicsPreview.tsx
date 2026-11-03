import Link from "next/link";
import { getCategoryCounts } from "@/lib/posts";

export function TopicsPreview() {
  const categories = getCategoryCounts();

  return (
    <section className="container-content border-t border-border py-16 md:py-20">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
            Explore by Topic
          </h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            From security research and engineering to everyday experiences and community work.
          </p>
        </div>
        <Link href="/topics" className="link-underline text-sm text-muted-foreground">
          All topics
        </Link>
      </div>

      <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/writing?category=${category.slug}`}
            className="group flex items-start justify-between gap-5 border-b border-border py-5"
          >
            <div className="min-w-0">
              <span className="font-serif text-lg text-foreground transition-colors duration-150 group-hover:text-accent">
                {category.name}
              </span>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </div>
            <span className="shrink-0 pt-1 text-sm text-muted-foreground">
              {category.count} {category.count === 1 ? "article" : "articles"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
