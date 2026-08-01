// CtaCard — beat 10 (dernier) du Short AES 90s : "L'histoire complete... dans la video longue.
// Lien en description." Fond = frame extraite de la vraie video longue (warmap-sahel-aes-FINAL.mp4,
// bases + combattants JNIM/EIGS), assombrie sous un cartouche "VIDEO COMPLETE" + sous-titre.
// Prototype Short "L'AES en 90 secondes" — memory/episodes/warmap-sahel/SCRIPT-SHORT-90S-V1.txt.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const clampI = (f: number, a: number, b: number, lo = 0, hi = 1) =>
  interpolate(f, [a, b], [lo, hi], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = clampI(frame, 0, 14);
  const dimOp = clampI(frame, 0, 14, 0, 0.72);
  const cardPop = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 18 });
  const cardOp = frame >= 10 ? cardPop : 0;
  const subOp = clampI(frame, 30, 44);

  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a" }}>
      <Img
        src={staticFile("_shared/refs/warmap-sahel-short-cta-bg.jpg")}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", opacity: bgOp, filter: "grayscale(0.15)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#16213a", opacity: dimOp }} />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div
          style={{
            opacity: cardOp,
            transform: `scale(${cardOp})`,
            background: "#F4EBD5",
            border: "3px solid #2C1E16",
            borderRadius: 8,
            padding: "36px 48px",
            maxWidth: "82%",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontSize: 40,
              color: "#1A1008",
              letterSpacing: 4,
              lineHeight: 1.25,
            }}
          >
            L'HISTOIRE COMPLÈTE
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: "Georgia, serif",
              fontSize: 22,
              color: "#4A2E1B",
              letterSpacing: 2,
              opacity: subOp,
            }}
          >
            LIBYE · KIDAL · LE VRAI COÛT HUMAIN
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: "Georgia, serif",
              fontWeight: "bold",
              fontSize: 20,
              color: "#8A170E",
              letterSpacing: 3,
              opacity: subOp,
            }}
          >
            VIDÉO COMPLÈTE EN BIO
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default CtaCard;
