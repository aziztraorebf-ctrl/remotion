/**
 * SvgScenePlanche — R&D harnais registre BLUEPRINT (planche technique, pas de disque dore).
 * Fond bleu nuit Souverain + scene SVG injectee. Pour juger la matiere brute avant animation.
 */
import React from "react";

export interface SvgScenePlancheProps {
  sceneSvg: string;
  label?: string;
}

export const SvgScenePlanche: React.FC<SvgScenePlancheProps> = ({ sceneSvg, label }) => {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1b3a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1024, height: 1024 }}>
        <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
          <g dangerouslySetInnerHTML={{ __html: sceneSvg }} />
        </svg>
        {label && (
          <div style={{ position: "absolute", bottom: -52, left: 0, right: 0, textAlign: "center", color: "#7fd4ff", fontFamily: "monospace", fontSize: 28 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgScenePlanche;
