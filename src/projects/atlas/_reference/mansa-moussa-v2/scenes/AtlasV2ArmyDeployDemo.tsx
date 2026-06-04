// AtlasV2ArmyDeployDemo — wrapper de test pour AtlasV2ArmyDeployScene.
// 3e beat systeme Atlas (test choregraphie multi-sprites file->ligne, 2026-06-04).
// Eprouve : (1) 2 files simultanees (Recette A x2) ; (2) transition file->ligne
// avec direction DEDUITE du deplacement (anti-moonwalk multi-sprites) ; (3) Spotlight
// Insert ; (4) COMBAT spear_attack (PixelLab) en 2 modes : sequentiel / simultane.

import React from "react";
import { AbsoluteFill } from "remotion";
import { AtlasV2ArmyDeployScene } from "./AtlasV2ArmyDeployScene";

const FPS = 30;
export const ARMY_DEPLOY_DEMO_FRAMES = 17 * FPS; // 17s = 510f

const COMMON_BEATS = {
  march: 20, // les 2 files entrent et avancent
  deploy: 120, // les files s'ouvrent en ligne
  formed: 200, // les 2 lignes face a face + cartouche
  insert: 215, // l'encart rapport de forces surgit
  insertOut: 290, // l'encart se retire
  charge: 300, // les 2 lignes se ruent l'une sur l'autre (anim charge)
  clash: 330, // contact : estoc play-once (spear_attack)
  death: 370, // le camp perdant encaisse : 2-3 soldats tombent + disparaissent
  clashEnd: 470, // fin du combat
};

const ArmyDeployVariant: React.FC<{ clashMode: "sequential" | "simultaneous" }> = ({
  clashMode,
}) => (
  <AbsoluteFill style={{ backgroundColor: "#1A1F3A" }}>
    <svg width={720} height={1280} viewBox="0 0 720 1280">
      <AtlasV2ArmyDeployScene
        startFrame={0}
        endFrame={ARMY_DEPLOY_DEMO_FRAMES}
        perSide={4}
        beats={COMMON_BEATS}
        clashMode={clashMode}
        forceA="8 000"
        forceB="30 000"
        labelA="SOSSO"
        labelB="MALI"
      />
    </svg>
  </AbsoluteFill>
);

// Mode simultane (choc frontal) — defaut historique.
export const AtlasV2ArmyDeployDemo: React.FC = () => (
  <ArmyDeployVariant clashMode="simultaneous" />
);

// Mode sequentiel (gauche attaque, puis droite repond).
export const AtlasV2ArmyDeploySeqDemo: React.FC = () => (
  <ArmyDeployVariant clashMode="sequential" />
);
