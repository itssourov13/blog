import type { ReactNode } from "react";
import Image from "next/image";

type GalleryImageProps = {
  src: string;
  alt: string;
  caption: string;
  width: string;
  height: string;
};

export function PhotoGallery({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose my-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

export function GalleryImage({
  src,
  alt,
  caption,
  width,
  height,
}: GalleryImageProps) {
  const imageWidth = Number.parseInt(width, 10);
  const imageHeight = Number.parseInt(height, 10);

  if (
    !src ||
    !alt ||
    !Number.isFinite(imageWidth) ||
    !Number.isFinite(imageHeight) ||
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return null;
  }

  return (
    <figure className="overflow-hidden rounded-sm border border-border bg-card">
      <div className="bg-muted">
        <Image
          src={src}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
