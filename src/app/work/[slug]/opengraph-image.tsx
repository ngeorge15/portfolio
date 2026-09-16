import { ImageResponse } from "next/og";
import { projects, getProject } from "@/content/projects";
import { getCaseStudy } from "@/content/case-studies";
import { site } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const study = project ? getCaseStudy(slug) : undefined;

  const title = project?.title ?? site.name;
  const proof = project?.proof ?? "";
  const steps = study?.architecture.steps.map((s) => s.name) ?? [];

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
      <div style={{ display: "flex", fontSize: 24, color: "#9AA9B5" }}>
        {site.name}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 62,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {proof && (
          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#4DD6B4",
              maxWidth: 980,
            }}
          >
            {proof}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {steps.map((label, i) => (
          <div
            key={label}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                display: "flex",
                padding: "9px 18px",
                border: `1px solid ${i === steps.length - 1 ? "#4DD6B4" : "#21303D"}`,
                borderRadius: 10,
                background: "#0E1924",
                fontSize: 20,
                color: i === steps.length - 1 ? "#4DD6B4" : "#9AA9B5",
              }}
            >
              {label}
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  display: "flex",
                  width: 22,
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
