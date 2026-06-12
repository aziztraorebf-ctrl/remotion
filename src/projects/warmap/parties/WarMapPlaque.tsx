// WarMapPlaque — plaque de nom géo-ancrée, STYLE PARCHEMIN (adaptation war-map de GeoCountryPlaque Souverain).
//
// Aziz 2026-06-12 : porter GeoCountryPlaque (Souverain) sur la war-map pour des noms ÉLÉGANTS. Le style
// Souverain (fond noir + néon + IBM Plex Mono) jurerait sur la carte parchemin → on garde la STRUCTURE
// (pos projeté + slide-in + fadeIn + stat optionnelle) mais le STYLE devient parchemin (crème + encre + Georgia).
//
// Usage : <WarMapPlaque frame={frame} name="GAO" pos={project(lon,lat)} appearAt={F} hideAt={F2} accent={...} />

import React from "react";
import { interpolate } from "remotion";

const CREAM = "#F3E9C8";
const INK = "#2A1C0E";

export interface WarMapPlaqueProps {
  frame: number;
  name: string;
  pos: { x: number; y: number };
  appearAt: number;
  hideAt: number;
  accent?: string;       // couleur de bordure/accent (porteuse de sens : rouge menace, kaki junte, acier FR…)
  stat?: string;         // ligne secondaire optionnelle (ex. date, donnée)
  fadeFrames?: number;
  size?: number;         // taille de police du nom
  yOffset?: number;      // décalage vertical au-dessus du point (px)
}

export const WarMapPlaque: React.FC<WarMapPlaqueProps> = ({
  frame, name, pos, appearAt, hideAt, accent = INK, stat, fadeFrames = 10, size = 22, yOffset = 30,
}) => {
  if (frame < appearAt || frame >= hideAt) return null;
  const localFrame = frame - appearAt;
  const fadeIn = interpolate(localFrame, [0, fadeFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [hideAt - fadeFrames, hideAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const slideY = interpolate(localFrame, [0, fadeFrames + 4], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", left: pos.x, top: pos.y - yOffset,
      transform: `translate(-50%, calc(-100% + ${slideY}px))`,
      opacity, textAlign: "center", pointerEvents: "none", zIndex: 30,
    }}>
      {/* petite tige + point d'ancrage (la plaque pointe le lieu) */}
      <div style={{ position: "absolute", left: "50%", bottom: -yOffset + 4, width: 1.5, height: yOffset - 6,
        background: accent, opacity: 0.5, transform: "translateX(-50%)" }} />
      {/* pilule nom — parchemin + bordure accent */}
      <div style={{
        display: "inline-block", background: "rgba(243,233,200,0.92)",
        border: `2px solid ${accent}`, borderRadius: 7, padding: "5px 14px",
        fontFamily: "Georgia, serif", fontSize: size, fontWeight: 700, color: INK,
        letterSpacing: "1.5px", textTransform: "uppercase", whiteSpace: "nowrap",
        boxShadow: "0 3px 8px rgba(40,27,8,0.35)",
      }}>
        {name}
      </div>
      {stat && (
        <div style={{
          display: "inline-block", marginTop: 4, background: "rgba(243,233,200,0.82)",
          border: `1.5px solid ${accent}`, borderRadius: 6, padding: "3px 10px",
          fontFamily: "Georgia, serif", fontSize: size * 0.8, fontWeight: 800, color: accent,
        }}>
          {stat}
        </div>
      )}
    </div>
  );
};

export default WarMapPlaque;
