import { ImageResponse } from "next/og";
export const alt = "Yoletech — Practical technology. Thoughtful solutions.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#F8FBF5",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "80px",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 40, color: "#018069", marginBottom: 45 }}>
        yoletech.
      </div>
      <div
        style={{
          fontSize: 74,
          color: "#17211B",
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        Practical technology.
      </div>
      <div
        style={{
          fontSize: 74,
          color: "#17211B",
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        Thoughtful solutions.
      </div>
      <div style={{ fontSize: 24, color: "#59645D", marginTop: 40 }}>
        Build. Learn. Grow. · yoletech.work
      </div>
    </div>,
    size,
  );
}
