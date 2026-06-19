// MatterCompare — proto de comparaison : anciennes TEXTURES (icones) vs nouvelles MATIERES (continues).
// 1 frame suffit (statique). Render via still pour juger le realisme.
import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { drawOilTexture, drawGasTexture } from "../_shared/mapbox/resourceTextures";
import { drawOilMatter, drawGasMatter } from "../_shared/mapbox/resourceMatter";

const Tile: React.FC<{ draw: (s: number) => HTMLCanvasElement; label: string; size: number }> = ({ draw, label, size }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const src = draw(512);
    const dst = ref.current; if (!dst) return;
    const ctx = dst.getContext("2d")!;
    // remplit le tile en repetant le pattern (montre le TILING reel)
    const pat = ctx.createPattern(src, "repeat");
    if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, size, size); }
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <canvas ref={ref} width={size} height={size} style={{ borderRadius: 8, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, color: "#f2ebd9", letterSpacing: "0.1em" }}>{label}</div>
    </div>
  );
};

export const MatterCompare: React.FC = () => {
  const { width, height } = useVideoConfig();
  const S = Math.round(height * 0.34);
  return (
    <AbsoluteFill style={{ background: "#16213a", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
          <Tile draw={drawOilTexture} label="OIL — ANCIEN (icones)" size={S} />
          <Tile draw={drawOilMatter} label="OIL — MATIERE (neuf)" size={S} />
        </div>
        <div style={{ display: "flex", gap: 60, justifyContent: "center" }}>
          <Tile draw={drawGasTexture} label="GAS — ANCIEN (icones)" size={S} />
          <Tile draw={drawGasMatter} label="GAS — MATIERE (neuf)" size={S} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default MatterCompare;
