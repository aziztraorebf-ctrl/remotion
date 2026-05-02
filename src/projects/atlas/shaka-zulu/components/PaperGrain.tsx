// PaperGrain — filtre transversal SVG appliquant un grain papier subtil
// Recommandation Jury Pass 2 (Gemini Q1) : unifier les textures cinematique (Seedance)
// + carte (d3-geo) + sprites (PixelLab) + SVG pur en appliquant un grain papier global.
//
// Usage : envelopper la composition entiere ou une scene avec <PaperGrain>...</PaperGrain>
// L'enfant est rendu, puis un overlay grain papier est applique par-dessus avec mix-blend-mode.
//
// IMPORTANT (piege technique Jury Pass 2) : feTurbulence sur des SVG complexes (Natural Earth)
// peut faire ramer le rendu. C'est pourquoi on l'applique en OVERLAY (div + SVG dedie),
// pas comme filtre sur le contenu lui-meme.

import React from "react";
import { AbsoluteFill } from "remotion";

interface PaperGrainProps {
  children: React.ReactNode;
  intensity?: number; // 0 a 1, defaut 0.18
  baseFrequency?: number; // defaut 0.85 (grain fin)
  seed?: number; // defaut 5
}

export const PaperGrain: React.FC<PaperGrainProps> = ({
  children,
  intensity = 0.18,
  baseFrequency = 0.85,
  seed = 5,
}) => {
  return (
    <AbsoluteFill>
      {children}
      {/* Overlay grain papier — pointer-events none pour ne pas bloquer interactions */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ mixBlendMode: "overlay", opacity: intensity }}
        >
          <defs>
            <filter id="paperGrainFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency={baseFrequency}
                numOctaves={2}
                seed={seed}
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.95
                        0 0 0 0 0.90
                        0 0 0 0 0.78
                        0 0 0 1 0"
              />
            </filter>
          </defs>
          <rect
            width="100%"
            height="100%"
            filter="url(#paperGrainFilter)"
          />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
