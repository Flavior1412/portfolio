import { ImageResponse } from "next/og";
import content from "@/shared/data/content.json";

export const alt = content.metadata.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f4f1eb",
        color: "#1b1b1b",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px",
        width: "100%",
      }}
    >
      <div style={{ color: "#77736d", fontSize: 22, letterSpacing: 6 }}>
        PORTFOLIO / SENIOR FRONT-END ENGINEER
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 68, fontWeight: 700 }}>
          KHUONG NGUYEN HUU
        </div>
        <div style={{ color: "#77736d", fontSize: 30 }}>
          Angular · Vue.js · TypeScript · Frontend Architecture
        </div>
      </div>
      <div style={{ fontSize: 20, letterSpacing: 4 }}>
        HO CHI MINH CITY, VIETNAM
      </div>
    </div>,
    size,
  );
}
