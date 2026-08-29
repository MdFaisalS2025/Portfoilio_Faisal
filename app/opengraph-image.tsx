import { ImageResponse } from "next/og";

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
          background: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#9a3324", marginBottom: 20 }}>
          Tampa, Florida
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 700,
            color: "#111111",
            marginBottom: 28,
          }}
        >
          Mohamed Faisal Sindhi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#525252",
            maxWidth: 900,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Founder of RAEY, designer of SENTINEL, and an AI engineer working
          across healthcare, legal retrieval, and federated learning.
        </div>
      </div>
    ),
    { ...size }
  );
}
