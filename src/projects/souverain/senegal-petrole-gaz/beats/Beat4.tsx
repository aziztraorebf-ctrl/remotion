import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Beat 4 — "La vraie question n'est pas combien... C'est combien il va garder." (32.21s → 33.38s)
// Durée réelle : 1.17s / 35 frames — FLASH ULTRA-COURT
// Le forced-alignment v1 a des timestamps bloqués sur cette phrase (bug connu)
// Stratégie : impact instantané full-screen, tout visible dès frame 0, hold jusqu'à fin

const GOLD = "#c8a951";

export const Beat4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tout explose dès frame 0 — pas de stagger, on n'a pas le temps
  const entryP = spring({ frame, fps, config: { damping: 8, stiffness: 400 }, durationInFrames: 20 });
  const scale = interpolate(entryP, [0, 1], [1.8, 1], { extrapolateRight: "clamp" });
  const opacity = interpolate(entryP, [0, 0.05, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  // "IL VA GARDER" — gold, légèrement décalé (8f)
  const goldP = spring({ frame: frame - 8, fps, config: { damping: 8, stiffness: 400 }, durationInFrames: 20 });
  const goldScale = interpolate(goldP, [0, 1], [2.2, 1], { extrapolateRight: "clamp" });
  const goldOpacity = interpolate(goldP, [0, 0.05, 1], [0, 1, 1], { extrapolateRight: "clamp" });

  const haloP = spring({ frame: frame - 8, fps, config: { damping: 10, stiffness: 300 }, durationInFrames: 20 });
  const haloOpacity = interpolate(haloP, [0, 1], [0, 0.28], { extrapolateRight: "clamp" });

  const underlineP = spring({ frame: frame - 12, fps, config: { damping: 20, stiffness: 200 }, durationInFrames: 18 });
  const underlineW = interpolate(underlineP, [0, 1], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-navy flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />

      {/* Halo gold */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none" aria-hidden
        style={{ paddingBottom: 80 }}>
        <div style={{
          width: 900, height: 400, borderRadius: "50%",
          backgroundColor: GOLD, filter: "blur(100px)", opacity: haloOpacity,
        }} />
      </div>

      <div className="relative flex flex-col items-center" style={{ gap: 16, paddingLeft: 80, paddingRight: 80 }}>
        {/* Ligne 1 */}
        <div className="text-center uppercase" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 68, fontWeight: 700,
          color: "rgba(242,235,217,0.88)", lineHeight: 1.05,
          letterSpacing: "0.12em",
          opacity, transform: `scale(${scale})`, transformOrigin: "center center",
        }}>
          LA VRAIE QUESTION
        </div>
        {/* Ligne 2-3 */}
        <div className="text-center uppercase" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 68, fontWeight: 700,
          color: "rgba(242,235,217,0.88)", lineHeight: 1.15,
          letterSpacing: "0.12em",
          opacity, transform: `scale(${scale})`, transformOrigin: "center center",
        }}>
          N'EST PAS COMBIEN{"\n"}IL VA PRODUIRE
        </div>
        {/* Ligne 4 */}
        <div className="text-center uppercase" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 68, fontWeight: 700,
          color: "rgba(242,235,217,0.88)", lineHeight: 1.05,
          letterSpacing: "0.12em",
          opacity, transform: `scale(${scale})`, transformOrigin: "center center",
        }}>
          C'EST COMBIEN
        </div>
        {/* Ligne 5 — GOLD massif */}
        <div className="text-center uppercase" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 130, fontWeight: 900,
          color: GOLD, lineHeight: 1.0, letterSpacing: "0.06em",
          textShadow: "0 0 30px rgba(200,169,81,0.7), 0 0 80px rgba(200,169,81,0.3)",
          opacity: goldOpacity,
          transform: `scale(${goldScale})`, transformOrigin: "center center",
          position: "relative",
        }}>
          IL VA GARDER
          <div style={{
            position: "absolute", bottom: -10, left: "50%",
            transform: "translateX(-50%)",
            width: `${underlineW}%`, height: 4,
            backgroundColor: GOLD, boxShadow: "0 0 12px rgba(200,169,81,0.8)",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default Beat4;
