import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name}: ${SITE.tagline}`;
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
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse 900px 420px at 50% 0%, rgba(212,168,83,0.35), #0b1d3a 70%)",
          backgroundColor: "#0b1d3a",
          color: "#f5efe0",
          fontFamily: "Georgia, serif",
          padding: 80,
        }}
      >
        <svg width="96" height="96" viewBox="0 0 32 32" fill="none" stroke="#d4a853" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="16" cy="16" r="13" opacity=".35" />
          <path d="M16 7v18M10.5 12.5h11" />
          <path d="M4 22c3.5-2.2 7.5-3.3 12-3.3S24.5 19.8 28 22" opacity=".6" />
        </svg>
        <div style={{ fontSize: 84, marginTop: 28, letterSpacing: -1 }}>{SITE.name}</div>
        <div style={{ fontSize: 38, marginTop: 20, color: "#d4a853", fontStyle: "italic" }}>{SITE.tagline}</div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#a9b6c9" }}>Submit a prayer · Pray for others · Give thanks</div>
      </div>
    ),
    size,
  );
}
