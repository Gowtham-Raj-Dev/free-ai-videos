import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Free AI Video Download — AI Generated Videos in HD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 20%, #312e81 0%, #000000 55%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg,#6366f1,#a855f7,#ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            ▶
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>AIVideos</div>
        </div>
        <div
          style={{
            marginTop: 50,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          Download Premium
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            background: "linear-gradient(90deg,#818cf8,#a855f7,#ec4899)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          AI Videos — Free
        </div>
        <div style={{ marginTop: 36, fontSize: 30, color: "#a1a1aa" }}>
          Thousands of AI generated videos · HD · No watermark
        </div>
      </div>
    ),
    size,
  );
}
