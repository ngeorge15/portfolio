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
        background: "#101613",
        padding: "72px",
        color: "#EEF1EC",
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
            border: "1px solid #2D3832",
            borderRadius: 8,
            color: "#8DBAA0",
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

      {/* A compact summary of the engineering range. */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {["Embedded", "Cloud", "Products"].map((label, i) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                border: `1px solid ${i === 2 ? "#76B1E2" : "#30404F"}`,
                borderRadius: 10,
                background: "#18211D",
                fontSize: 22,
                color: i === 2 ? "#76B1E2" : "#AAB6C2",
              }}
            >
              {label}
            </div>
            {i < 2 && (
              <div
                style={{
                  display: "flex",
                  width: 26,
                  height: 1,
                  background: "#30404F",
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
