// AtlasV2ConfrontationDemo — wrapper de test standalone pour AtlasV2ConfrontationScene.
// 2e beat produit via le systeme Atlas (test confrontation 2 sprites, 2026-06-04).
// Beats fixes ici (en prod : forced-alignment Whisper). Pas de son narratif.
// Eprouve : (1) 2 sprites en SENS OPPOSES (anti-moonwalk) ; (2) Spotlight Insert chiffre.

import React from "react";
import { AbsoluteFill } from "remotion";
import { AtlasV2ConfrontationScene } from "./AtlasV2ConfrontationScene";

const FPS = 30;
export const CONFRONTATION_DEMO_FRAMES = 9 * FPS; // 9s = 270f

export const AtlasV2ConfrontationDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1A1F3A" }}>
      <svg width={720} height={1280} viewBox="0 0 720 1280">
        <AtlasV2ConfrontationScene
          startFrame={0}
          endFrame={CONFRONTATION_DEMO_FRAMES}
          beats={{
            approach: 20, // les 2 soldats entrent et convergent
            clash: 130, // ils s'arretent face a face + bump impact
            insert: 160, // la carte se dim, l'encart rapport de forces surgit
            insertOut: 250, // l'encart se retire, retour carte
          }}
          forceA="8 000"
          forceB="30 000"
          labelA="SOSSO"
          labelB="MALI"
        />
      </svg>
    </AbsoluteFill>
  );
};
