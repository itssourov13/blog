import { ImageResponse } from "next/og";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getCategoryName } from "@/lib/categories";
import { site } from "@/lib/author";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
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

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0d1418",
          color: "#f2f3f4",
          padding: "72px",
          fontFamily: "sans-serif",
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
    ),
    size
  );
}
