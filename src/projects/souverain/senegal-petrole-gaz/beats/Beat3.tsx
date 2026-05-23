import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Beat 3 — "Et pourtant, l'État n'est pas certain d'en garder la moitié." (28.88s → 32.21s)
// Durée réelle : 3.33s / 99 frames — COURT, impact maximal immédiat
// Forced-alignment anchors (relatifs) :
//   0s    — "Et pourtant" → label arrive
//   1.16s — "l'État n'est pas certain" → chiffre <50% explose
//   2.36s — "garder la moitié" → sous-titre claque

const RED_CHOC = "#e63946";

const F_LABEL_IN    = 0;
const F_NUMBER_BOOM = Math.round(1.16 * 30); // 35f
const F_SUBTITLE_IN = Math.round(2.36 * 30); // 71f

export const Beat3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label — slide-in immédiat
  const labelP = spring({ frame, fps, config: { damping: 18, stiffness: 200 }, durationInFrames: 20 });
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(labelP, [0, 1], [-12, 0], { extrapolateRight: "clamp" });

  // Chiffre — explosion à 1.16s
  const numberP = spring({ frame: frame - F_NUMBER_BOOM, fps, config: { damping: 7, stiffness: 350 }, durationInFrames: 25 });
  const numberScale = interpolate(numberP, [0, 1], [0.05, 1], { extrapolateRight: "clamp" });
  const numberOpacity = interpolate(numberP, [0, 0.06, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const sinePulse = Math.sin((frame / 30) * Math.PI * 2);
  const heartScale = interpolate(sinePulse, [-1, 1], [1, 1.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Halo rouge — anticipe de 10f
  const haloP = spring({ frame: frame - F_NUMBER_BOOM + 10, fps, config: { damping: 10, stiffness: 200 }, durationInFrames: 30 });
  const haloOpacity = interpolate(haloP, [0, 1], [0, 0.38], { extrapolateRight: "clamp" });

  // Sous-titre — claque à 2.36s
  const subP = spring({ frame: frame - F_SUBTITLE_IN, fps, config: { damping: 10, stiffness: 320 }, durationInFrames: 20 });
  const subOpacity = interpolate(subP, [0, 0.08, 1], [0, 1, 1], { extrapolateRight: "clamp" });
  const subScale = interpolate(subP, [0, 1], [1.4, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-navy flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(200,169,81,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />

      {/* Label "DES REVENUS BRUTS" */}
      <div className="absolute left-0 right-0 text-center uppercase"
        style={{
          top: 200,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 38, fontWeight: 600,
          color: "rgba(242,235,217,0.55)",
          letterSpacing: "0.28em",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}>
        DES REVENUS BRUTS
      </div>

      {/* Halo rouge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div style={{
          width: 700, height: 700, borderRadius: "50%",
          backgroundColor: RED_CHOC, filter: "blur(120px)",
          opacity: haloOpacity, transform: `scale(${numberScale})`,
        }} />
      </div>

      {/* Chiffre <50% — explosion */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ marginTop: -40 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 320, fontWeight: 900, lineHeight: 1, color: "#f2ebd9",
          textShadow: "0 0 40px rgba(230,57,70,0.6), 0 0 100px rgba(230,57,70,0.25)",
          opacity: numberOpacity,
          transform: `scale(${numberScale * heartScale})`,
          transformOrigin: "center center", letterSpacing: "-0.03em",
        }}>
          {"<50%"}
        </div>
      </div>

      {/* Sous-titre — claque à 2.36s */}
      <div className="absolute left-0 right-0 text-center"
        style={{
          bottom: 130,
          fontFamily: "'Inter', sans-serif",
          fontSize: 36, fontWeight: 500, color: RED_CHOC,
          letterSpacing: "0.06em",
          opacity: subOpacity,
          transform: `scale(${subScale})`,
          transformOrigin: "center center",
          paddingLeft: 120, paddingRight: 120,
        }}>
        {"L'État n'est pas certain d'en garder la moitié."}
      </div>
    </AbsoluteFill>
  );
};

export default Beat3;
