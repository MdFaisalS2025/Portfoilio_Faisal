import { ImageResponse } from "next/og";
import { getProject } from "@/lib/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

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
          background: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#9a3324", marginBottom: 20 }}>
          {project?.timeframe ?? "Case study"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            color: "#111111",
            marginBottom: 28,
          }}
        >
          {project?.name ?? "Project"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#525252",
            maxWidth: 950,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {project?.tagline ?? "Mohamed Faisal Sindhi"}
        </div>
      </div>
    ),
    { ...size }
  );
}
