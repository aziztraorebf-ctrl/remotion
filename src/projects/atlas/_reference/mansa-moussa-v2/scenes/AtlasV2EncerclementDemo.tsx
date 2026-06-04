// AtlasV2EncerclementDemo — wrapper de test pour AtlasV2EncerclementScene.
// 4e beat systeme Atlas : banc d'essai CANNAE (encerclement, sprites en courbe).
// Beats fixes (en prod : forced-alignment). Test de CAPACITE sur carte Mansa.

import React from "react";
import { AbsoluteFill } from "remotion";
import { AtlasV2EncerclementScene } from "./AtlasV2EncerclementScene";

const FPS = 30;
export const ENCERCLEMENT_DEMO_FRAMES = 14 * FPS; // 14s = 420f

export const AtlasV2EncerclementDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1A1F3A" }}>
    <svg width={720} height={1280} viewBox="0 0 720 1280">
      <AtlasV2EncerclementScene
        startFrame={0}
        endFrame={ENCERCLEMENT_DEMO_FRAMES}
        trappedSize={6}
        beats={{
          enter: 20, // les armees apparaissent
          envelop: 90, // les ailes s'elancent en courbe
          close: 210, // les ailes se referment derriere l'encercle
          insert: 225, // Spotlight CANNAE
          insertOut: 300,
          clash: 310, // estoc
          death: 350, // l'encercle subit les pertes
        }}
      />
    </svg>
  </AbsoluteFill>
);
