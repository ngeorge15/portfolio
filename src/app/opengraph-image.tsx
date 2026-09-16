import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#081018",
        padding: "72px",
        color: "#EAF2F0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            border: "1px solid #21303D",
            borderRadius: 8,
            color: "#4DD6B4",
            fontSize: 18,
          }}
        >
          NG
        </div>
        <div style={{ fontSize: 24, color: "#9AA9B5" }}>{site.name}</div>
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 56,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: 980,
        }}
      >
        {site.headline}
      </div>

      {/* The same sensor-to-screen pipeline the site is organised around. */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {["Sensor", "Firmware", "Cloud", "Application"].map((label, i) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                border: `1px solid ${i === 3 ? "#4DD6B4" : "#21303D"}`,
                borderRadius: 10,
                background: "#0E1924",
                fontSize: 22,
                color: i === 3 ? "#4DD6B4" : "#9AA9B5",
              }}
            >
              {label}
            </div>
            {i < 3 && (
              <div
                style={{
                  display: "flex",
                  width: 26,
                  height: 1,
                  background: "#21303D",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>,
    size,
  );
}
