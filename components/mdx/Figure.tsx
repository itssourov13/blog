import { CoverArt } from "@/components/article/CoverArt";
import type { Category } from "@/lib/types";

export function Figure({
  seed,
  caption,
  category = "research",
}: {
  seed: string;
  caption?: string;
  category?: Category;
}) {
  return (
    <figure className="not-prose my-8">
      <div className="aspect-[16/9] overflow-hidden rounded-sm">
        <CoverArt seed={seed} category={category} className="h-full w-full" />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
