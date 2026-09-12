import type { MDXComponents } from "mdx/types";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import Image from "next/image";
import { CodeBlock } from "@/components/article/CodeBlock";
import { Callout } from "./Callout";
import { Figure } from "./Figure";

function ProseLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof props.href === "string" && /^https?:\/\//.test(props.href);
  return (
    <a
      {...props}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    />
  );
}

/**
 * Markdown images have no known intrinsic dimensions at authoring time, so
 * we can't pass next/image the width/height it wants for a plain <img>.
 * Instead we reserve space with a fixed-aspect-ratio wrapper and let the
 * image fill it — that's what actually fixes the layout shift (CLS), and
 * still gets us next/image's format negotiation and responsive sizing for
 * local assets. External URLs fall back to a plain <img>, since next/image
 * would otherwise throw for any domain not explicitly allow-listed in
 * next.config — a marker "post has an unconfigured remote image" is a worse
 * failure mode than an unoptimized one.
 *
 * Wrapper elements are <span>, not <div>: markdown puts a standalone image
 * inside a <p>, and the HTML parser only auto-closes <p> for certain block
 * tag names — not for a <span> with block styling — so this keeps the
 * output valid instead of nesting a block element inside a paragraph.
 */
function ProseImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt } = props;
  if (!src || typeof src !== "string") return null;

  const isLocal = src.startsWith("/");

  if (!isLocal) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} className="w-full rounded-sm" loading="lazy" />
    );
  }

  return (
    <span className="not-prose my-8 block overflow-hidden rounded-sm">
      <span className="relative block aspect-[16/9] w-full">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
      </span>
    </span>
  );
}

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  a: ProseLink,
  img: ProseImage,
  Callout,
  Figure,
};
