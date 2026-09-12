import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/lib/types";

interface Filters {
  category?: string;
  tag?: string;
  year?: string;
}

function hrefFor(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.year) params.set("year", filters.year);
  const query = params.toString();
  return query ? `/writing?${query}` : "/writing";
}

export function CategoryFilter({
  categories,
  years,
  active,
}: {
  categories: (CategoryMeta & { count: number })[];
  years: number[];
  active: Filters;
}) {
  const hasActiveFilters = Boolean(active.category || active.tag || active.year);

  return (
    <div className="mt-8 space-y-4 border-y border-border py-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Link
          href={hrefFor({ tag: active.tag, year: active.year })}
          className={cn(
            "text-sm",
            !active.category ? "font-medium text-accent" : "text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={hrefFor({ category: category.slug, tag: active.tag, year: active.year })}
            className={cn(
              "text-sm",
              active.category === category.slug
                ? "font-medium text-accent"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {category.name} <span className="text-xs">({category.count})</span>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {years.length > 1 && (
            <>
              <span>Year:</span>
              {years.map((year) => (
                <Link
                  key={year}
                  href={hrefFor({ category: active.category, tag: active.tag, year: String(year) })}
                  className={active.year === String(year) ? "font-medium text-accent" : "hover:text-foreground"}
                >
                  {year}
                </Link>
              ))}
            </>
          )}

          {active.tag && (
            <span className="flex items-center gap-1.5">
              Tag: <span className="text-foreground">#{active.tag}</span>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <Link href="/writing" className="link-underline">
            Clear filters
          </Link>
        )}
      </div>
    </div>
  );
}
