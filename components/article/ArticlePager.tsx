import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";

export function ArticlePager({ prev, next }: { prev?: Post; next?: Post }) {
  if (!prev && !next) return null;

  return (
    <nav
      className="grid gap-6 border-t border-border py-10 sm:grid-cols-2 print:hidden"
      aria-label="Article navigation"
    >
      {prev ? (
        <Link href={`/posts/${prev.slug}`} className="group flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
            Previous
          </span>
          <span className="font-serif text-lg text-foreground transition-colors duration-150 group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group flex flex-col gap-2 sm:items-end sm:text-right"
        >
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
          <span className="font-serif text-lg text-foreground transition-colors duration-150 group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
