import { ImageResponse } from "next/og";
import { site } from "@/lib/author";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.15, maxWidth: 900 }}>
            {site.title}
          </div>
          <div style={{ fontSize: 24, color: "#9aa4ab", maxWidth: 760 }}>{site.description}</div>
        </div>
      </div>
    ),
    size
  );
}
