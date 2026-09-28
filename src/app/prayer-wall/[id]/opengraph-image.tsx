import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";
import { clip } from "@/lib/format";
import { getStore } from "@/lib/store";
import { isUuid } from "@/lib/validate";

export const alt = "A prayer request on Closer to the Father";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for one prayer request: who is asking and the start of the request.
export default async function PrayerImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const prayer = isUuid(id) ? await getStore().getPrayer(id).catch(() => null) : null;
  const who = !prayer || prayer.name === "Anonymous" ? "this request" : prayer.name;
  const excerpt = prayer ? clip(prayer.request, 160) : "Real people. Real needs. Pray with us.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "radial-gradient(ellipse 900px 420px at 50% 0%, rgba(212,168,83,0.30), #0b1d3a 70%)",
          backgroundColor: "#0b1d3a",
          color: "#f5efe0",
          fontFamily: "Georgia, serif",
          padding: "70px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#d4a853", letterSpacing: 4, textTransform: "uppercase" }}>
            {prayer?.category ? `${prayer.category} · Prayer request` : "Prayer request"}
          </div>
          <div style={{ fontSize: 76, marginTop: 24, lineHeight: 1.1 }}>{`Will you pray for ${who}?`}</div>
          <div style={{ fontSize: 34, marginTop: 30, color: "#a9b6c9", lineHeight: 1.4, fontStyle: "italic" }}>{`“${excerpt}”`}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <div style={{ color: "#d4a853" }}>{SITE.name}</div>
          <div style={{ color: "#a9b6c9" }}>Tap to pray</div>
        </div>
      </div>
    ),
    size,
  );
}
