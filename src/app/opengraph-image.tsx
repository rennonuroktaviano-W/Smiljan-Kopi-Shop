import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = "SMILJAN Kopi Shop — Kopi Pelan, Hari Tenang.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ink = "#111111";
const ivory = "#f4f1ea";
const muted = "#a8a49b";
const accent = "#9a9b7a";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: ink,
          color: ivory,
          padding: "72px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 26,
            letterSpacing: "11px",
            textTransform: "uppercase",
            color: muted,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 2,
              backgroundColor: accent,
            }}
          />
          <span>{`${siteConfig.name} \u2014 ${siteConfig.descriptor}`}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-2px",
            }}
          >
            {siteConfig.headline}
          </div>
          <div style={{ fontSize: 36, color: muted }}>{siteConfig.tagline}</div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: accent,
              paddingTop: 14,
            }}
          >
            Menu · Tentang Kami · Kunjungi
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
