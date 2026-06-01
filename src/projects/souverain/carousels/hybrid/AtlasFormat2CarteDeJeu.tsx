import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from "remotion";

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

export interface AtlasFormat2Props {
  /** chemin image statique OU clip vidéo */
  bgImage: string;
  /** si true, bgImage est traité comme un clip vidéo (OffthreadVideo) */
  isVideo?: boolean;
  highlight?: string;
  body: string;
  slideIndex: number;
  totalSlides: number;
}

export const AtlasFormat2CarteDeJeu: React.FC<AtlasFormat2Props> = ({
  bgImage,
  isVideo = false,
  highlight,
  body,
  slideIndex,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "28px 40px 0", zIndex: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 18, color: GOLD, letterSpacing: 4, fontWeight: 700 }}>K&amp;C</span>
        </div>
        <ProgressBar current={slideIndex} total={totalSlides} />
      </div>

      {/* Image encadrée — objet précieux */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 48,
          right: 48,
          height: 560,
          border: `3px solid ${GOLD}`,
          boxShadow: `0 0 40px rgba(200,169,81,0.25), 0 8px 40px rgba(0,0,0,0.6)`,
          overflow: "hidden",
          borderRadius: 4,
        }}
      >
        {isVideo
          ? <OffthreadVideo src={staticFile(bgImage)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <Img src={staticFile(bgImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        }
      </div>

      {/* Texte en bas sur fond navy */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 250,
          top: 700,
          padding: "0 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: textOpacity,
        }}
      >
        {highlight && (
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 88, fontWeight: 700, color: GOLD, lineHeight: 1, margin: "0 0 18px", letterSpacing: -1 }}>
            {highlight}
          </h2>
        )}
        <p style={{ fontFamily: "Georgia, serif", fontSize: 46, lineHeight: 1.35, fontWeight: 500, color: IVORY, margin: 0 }}>
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
