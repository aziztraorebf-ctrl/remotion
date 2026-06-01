import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, staticFile } from "remotion";

const GOLD = "#c8a951";
const NAVY = "#16213a";
const IVORY = "#f5efe0";

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, width: "100%" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 3, flex: 1, borderRadius: 2, backgroundColor: i <= current ? GOLD : "rgba(200,169,81,0.25)" }} />
      ))}
    </div>
  );
}

export interface AtlasFormat4Props {
  bgImage: string;
  highlight?: string;
  body: string;
  slideIndex: number;
  totalSlides: number;
  /** "bottom" (défaut) ou "right" */
  panelPosition?: "bottom" | "right";
}

export const AtlasFormat4PanneauOpaque: React.FC<AtlasFormat4Props> = ({
  bgImage,
  highlight,
  body,
  slideIndex,
  totalSlides,
  panelPosition = "bottom",
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const panelStyle: React.CSSProperties = panelPosition === "bottom"
    ? {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "46%",
        backgroundColor: NAVY,
        borderTop: `3px solid ${GOLD}`,
        borderRadius: "24px 24px 0 0",
        padding: "48px 64px 250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }
    : {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "58%",
        backgroundColor: NAVY,
        borderLeft: `3px solid ${GOLD}`,
        borderRadius: "24px 0 0 24px",
        padding: "120px 56px 250px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      };

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      {/* Image full plein écran */}
      <Img src={staticFile(bgImage)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0", zIndex: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>K&amp;C</span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Panneau opaque 100% — écrase physiquement les labels */}
      <div style={{ ...panelStyle, opacity: textOpacity, zIndex: 10 }}>
        {highlight && (
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 84, fontWeight: 700, color: GOLD, lineHeight: 1, margin: "0 0 18px", letterSpacing: -1 }}>
            {highlight}
          </h2>
        )}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 46, lineHeight: 1.35, fontWeight: 500, color: IVORY, margin: 0 }}>
          {body}
        </p>
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center", zIndex: 20 }}>
        <span style={{ color: GOLD, fontSize: 20, letterSpacing: 3, opacity: 0.7 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
