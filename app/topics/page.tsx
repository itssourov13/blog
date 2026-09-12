import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryCounts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse articles by topic: security, research, engineering, and more.",
};

export default function TopicsPage() {
  const categories = getCategoryCounts();

  return (
    <div className="container-content py-16">
      <h1 className="font-serif text-4xl font-medium text-foreground md:text-5xl">Topics</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        Everything written here, grouped by subject.
      </p>

      <div className="mt-12 grid gap-x-10 gap-y-2 sm:grid-cols-2">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/writing?category=${category.slug}`}
            className="group flex items-start justify-between gap-6 border-b border-border py-6"
          >
            <div>
              <h2 className="font-serif text-xl text-foreground transition-colors duration-150 group-hover:text-accent">
                {category.name}
              </h2>
              <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">
              {category.count} {category.count === 1 ? "article" : "articles"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
