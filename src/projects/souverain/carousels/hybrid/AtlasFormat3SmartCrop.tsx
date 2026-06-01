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

export interface AtlasFormat3Props {
  bgImage: string;
  highlight?: string;
  body: string;
  slideIndex: number;
  totalSlides: number;
  /** zoom factor — ex: 2.2 pour gros plan sur le pixel art */
  zoomScale?: number;
  /** décalage horizontal du zoom : -0.5 (gauche) → 0 (centre) → 0.5 (droite) */
  zoomX?: number;
  /** décalage vertical du zoom : -0.5 (haut) → 0 (centre) → 0.5 (bas) */
  zoomY?: number;
}

export const AtlasFormat3SmartCrop: React.FC<AtlasFormat3Props> = ({
  bgImage,
  highlight,
  body,
  slideIndex,
  totalSlides,
  zoomScale = 2.2,
  zoomX = -0.15,
  zoomY = 0.05,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kenBurns = interpolate(frame, [0, 120], [1, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const translateX = zoomX * 100;
  const translateY = zoomY * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY, overflow: "hidden" }}>
      {/* Image zoomée — élimine les labels en dehors du cadre */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(bgImage)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoomScale * kenBurns}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Dégradé bas fort */}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(22,33,58,0.98) 0%, rgba(22,33,58,0.85) 30%, rgba(22,33,58,0.0) 55%)" }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>K&amp;C</span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Texte bas */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 64px 250px",
          opacity: textOpacity,
        }}
      >
        {highlight && (
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 700, color: GOLD, lineHeight: 1, margin: "0 0 18px", letterSpacing: -1 }}>
            {highlight}
          </h2>
        )}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 48, lineHeight: 1.35, fontWeight: 500, color: IVORY, margin: 0 }}>
          {body}
        </p>
      </AbsoluteFill>

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 0 36px", textAlign: "center" }}>
        <span style={{ color: GOLD, fontSize: 20, letterSpacing: 3, opacity: 0.7 }}>@koraetcartes</span>
      </div>
    </AbsoluteFill>
  );
};
