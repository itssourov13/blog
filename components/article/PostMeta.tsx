import { Fragment, type ReactNode } from "react";
import { cn, formatDate, formatDateLong } from "@/lib/utils";
import { getCategoryName } from "@/lib/categories";
import type { Category } from "@/lib/types";

interface PostMetaProps {
  /** "card" = category · reading time · date (used on cards/search results). "header" = author · date · reading time (used on the post page). */
  variant?: "card" | "header";
  size?: "xs" | "sm";
  uppercase?: boolean;
  category?: Category;
  author?: string;
  readingTime: number;
  publishedAt: string;
  className?: string;
}

export function PostMeta({
  variant = "card",
  size = "xs",
  uppercase = false,
  category,
  author,
  readingTime,
  publishedAt,
  className,
}: PostMetaProps) {
  const dateLabel = variant === "header" ? formatDateLong(publishedAt) : formatDate(publishedAt);
  const parts: ReactNode[] = [];

  if (variant === "header") {
    if (author) parts.push(<span key="author">{author}</span>);
    parts.push(
      <time key="date" dateTime={publishedAt}>
        {dateLabel}
      </time>
    );
    parts.push(<span key="time">{readingTime} min read</span>);
  } else {
    if (category) {
      parts.push(
        <span key="category" className="font-medium text-accent">
          {getCategoryName(category)}
        </span>
      );
    }
    parts.push(<span key="time">{readingTime} min read</span>);
    parts.push(
      <time key="date" dateTime={publishedAt}>
        {dateLabel}
      </time>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground",
        size === "xs" ? "text-xs" : "text-sm",
        uppercase && "uppercase tracking-wide",
        className
      )}
    >
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <span aria-hidden="true">·</span>}
          {part}
        </Fragment>
      ))}
    </div>
  );
}
