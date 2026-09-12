import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getCategoryName } from "@/lib/categories";
import { site } from "@/lib/author";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Formats `next/og`'s bundled rasterizer (satori + resvg-wasm) can decode
// straight from a data URI. Everything else (webp, gif, avif) is transcoded
// to PNG via sharp below.
const NATIVE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

/**
 * Reads a frontmatter `coverImage` (an absolute public path such as
 * "/covers/foo.webp") from disk and returns it as a base64 data URI.
 *
 * Embedding the bytes — rather than handing `next/og` a relative URL — keeps
 * the per-post OG image working at build time (static generation) and at
 * runtime with no network fetch.
 *
 * `next/og`'s bundled rasterizer cannot decode WebP (it throws while the
 * route is prerendered), so those are converted to PNG with sharp, which
 * ships as an optional dependency of Next.js itself. If sharp is
 * unavailable, the conversion is skipped and the caller falls back to the
 * default title card.
 *
 * Returns null when the file is missing, the path escapes `public/`, or the
 * format is unsupported.
 */
async function readCoverDataUri(coverImage: string): Promise<string | null> {
  try {
    const cleanPath = coverImage.split(/[?#]/)[0].replace(/^\/+/, "");
    const filePath = path.resolve(PUBLIC_DIR, cleanPath);
    if (filePath !== PUBLIC_DIR && !filePath.startsWith(PUBLIC_DIR + path.sep)) {
      return null;
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return null;
    }

    const bytes = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();

    const nativeMime = NATIVE_MIME[ext];
    if (nativeMime) {
      return `data:${nativeMime};base64,${bytes.toString("base64")}`;
    }

    const sharp = (await import("sharp")).default;
    const png = await sharp(bytes).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch (err) {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? site.name;
  const category = post ? getCategoryName(post.category) : "";
  const cover = post?.coverImage ? await readCoverDataUri(post.coverImage) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0d1418",
          color: "#f2f3f4",
          fontFamily: "sans-serif",
        }}
      >
        {/* The bundled renderer has no z-index, so order within this flex
            parent is the stacking order: cover, then scrim, then text. The
            engine silently drops children of JSX fragments (`<>...</>`), so
            each element is emitted as a direct child instead. */}
        {cover && (
          <img
            src={cover}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {/* Left-anchored scrim keeps the text legible over any artwork. */}
        {cover && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(13,20,24,0.92) 0%, rgba(13,20,24,0.6) 45%, rgba(13,20,24,0.15) 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#c1442c" }} />
            <div style={{ fontSize: 26, fontWeight: 600 }}>{site.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {category && (
              <div
                style={{
                  fontSize: 22,
                  color: "#c1442c",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                }}
              >
                {category}
              </div>
            )}
            <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.15, maxWidth: 980 }}>
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
