// AtlasV2SaharanDropDemo — wrapper de test standalone pour AtlasV2SaharanDropScene.
// Le beat "porteur depose un sac d'or au Sahara, puis repart" sur la vraie carte Mansa.
// Beats fixes ici (en prod : viennent du forced-alignment Whisper). Pas de son narratif.
// Composition de validation R&D — 1er beat produit via le systeme Atlas (test 2026-06-03).

import React from "react";
import { AbsoluteFill } from "remotion";
import { AtlasV2SaharanDropScene } from "./AtlasV2SaharanDropScene";

const FPS = 30;
export const SAHARAN_DROP_DEMO_FRAMES = 12 * FPS; // 12s

export const AtlasV2SaharanDropDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1F3A" }}>
      <svg width={720} height={1280} viewBox="0 0 720 1280">
        <AtlasV2SaharanDropScene
          startFrame={0}
          endFrame={SAHARAN_DROP_DEMO_FRAMES}
          beats={{
            arrive: 20, // le porteur entre et marche vers l'est
            depot: 130, // il s'arrete, le sac d'or apparait
            reprise: 230, // il repart vers l'ouest
          }}
        />
      </svg>
    </AbsoluteFill>
  );
};
