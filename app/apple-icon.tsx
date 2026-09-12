import { ImageResponse } from "next/og";
import { site } from "@/lib/author";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d1418",
          color: "#c1442c",
          fontSize: 96,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        {site.name.charAt(0).toUpperCase()}
      </div>
    ),
    size
  );
}
