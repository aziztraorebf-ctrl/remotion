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

export interface AtlasFormat1Props {
  bgImage: string;
  highlight?: string;
  body: string;
  slideIndex: number;
  totalSlides: number;
  imageHeightPct?: number;
}

export const AtlasFormat1SplitScreen: React.FC<AtlasFormat1Props> = ({
  bgImage,
  highlight,
  body,
  slideIndex,
  totalSlides,
  imageHeightPct = 48,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const imageH = `${imageHeightPct}%`;
  const textH = `${100 - imageHeightPct}%`;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, flexDirection: "column" }}>
      {/* Zone image (haut) */}
      <div style={{ width: "100%", height: imageH, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <Img src={staticFile(bgImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Header par-dessus l'image */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>K&amp;C</span>
          </div>
          <ProgressBar current={slideIndex} total={totalSlides} />
        </div>
      </div>

      {/* Ligne séparatrice or */}
      <div style={{ width: "100%", height: 3, backgroundColor: GOLD, flexShrink: 0 }} />

      {/* Zone texte (bas) — fond navy 100% opaque */}
      <div
        style={{
          width: "100%",
          height: textH,
          backgroundColor: NAVY,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 64px 250px",
          opacity: textOpacity,
          flexShrink: 0,
        }}
      >
        {highlight && (
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 700, color: GOLD, lineHeight: 1, margin: "0 0 20px", letterSpacing: -1 }}>
            {highlight}
          </h2>
        )}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 48, lineHeight: 1.35, fontWeight: 500, color: IVORY, margin: 0 }}>
          {body}
        </p>
      </div>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GOLD, fontSize: 20, letterSpacing: 3, opacity: 0.7 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
