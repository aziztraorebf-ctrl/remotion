/**
 * SvgSceneParchemin — R&D harnais registre ENCRE/PARCHEMIN (figure gravee sur papier creme).
 * Fond parchemin + scene SVG injectee. Pour juger la matiere brute avant animation.
 */
import React from "react";

export interface SvgSceneParcheminProps {
  sceneSvg: string;
  label?: string;
}

export const SvgSceneParchemin: React.FC<SvgSceneParcheminProps> = ({ sceneSvg, label }) => {
  return (
    <div style={{ position: "absolute", inset: 0, background: "#e8dcc0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1024, height: 1024 }}>
        <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
          <rect x="0" y="0" width="1024" height="1024" fill="#e3d5b5" />
          <g dangerouslySetInnerHTML={{ __html: sceneSvg }} />
        </svg>
        {label && (
          <div style={{ position: "absolute", bottom: -50, left: 0, right: 0, textAlign: "center", color: "#2b2117", fontFamily: "monospace", fontSize: 26 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default SvgSceneParchemin;
