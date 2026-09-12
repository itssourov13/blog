import type { Metadata } from "next";
import Link from "next/link";
import { Hash } from "lucide-react";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse every article by tag.",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="container-content py-16">
      <h1 className="font-serif text-4xl font-medium text-foreground md:text-5xl">Tags</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Every article, grouped by tag.</p>

      {tags.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No tags yet.</p>
      ) : (
        <div className="mt-12 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${encodeURIComponent(tag.slug)}`}
              className="group flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <Hash
                className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent"
                aria-hidden="true"
              />
              {tag.name}
              <span className="text-muted-foreground">({tag.count})</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
