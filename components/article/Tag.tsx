import Link from "next/link";
import { cn } from "@/lib/utils";

export function Tag({ tag, className }: { tag: string; className?: string }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={cn(
        "text-sm text-muted-foreground transition-colors duration-150 hover:text-accent",
        className
      )}
    >
      #{tag}
    </Link>
  );
}
