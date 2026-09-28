import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = "Free 7-Day Prayer Guide: 7 Days to a Closer Walk With the Father";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for the guide landing page: headline on the left, the real cover on the right.
export default async function GuideImage() {
  const cover = await readFile(join(process.cwd(), "public/images/prayer-guide-cover.jpg"));
  const src = `data:image/jpeg;base64,${cover.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "radial-gradient(ellipse 900px 420px at 30% 0%, rgba(212,168,83,0.30), #0b1d3a 70%)",
          backgroundColor: "#0b1d3a",
          color: "#f5efe0",
          fontFamily: "Georgia, serif",
          padding: "0 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 620 }}>
          <div style={{ fontSize: 28, color: "#d4a853", letterSpacing: 4, textTransform: "uppercase" }}>Free 7-Day Prayer Guide</div>
          <div style={{ fontSize: 68, marginTop: 20, lineHeight: 1.1 }}>Build a prayer life you can actually keep.</div>
          <div style={{ fontSize: 30, marginTop: 28, color: "#a9b6c9" }}>Seven minutes a day. One step closer to Him.</div>
          <div style={{ fontSize: 26, marginTop: 40, color: "#d4a853" }}>{SITE.name}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={380} height={492} alt="" style={{ borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }} />
      </div>
    ),
    size,
  );
}
