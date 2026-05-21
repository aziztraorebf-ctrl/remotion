import React from "react";
import { Series } from "remotion";
import { HookBlocA } from "./HookBlocA";
import { HookBlocB } from "./HookBlocB";
import { HookBlocC } from "./HookBlocC";
import { HookBlocD } from "./HookBlocD";
import { HookBlocE } from "./HookBlocE";

// ============================================================
// HookMaster — Assemblage complet du hook
//
// Ordre narratif (logique script V3.1) :
//   1. HookBlocA  (706f / 23.5s) : Village Saint-Pierre — presentation des personnages
//   2. HookBlocB  (1018f / 33.9s): Galeres Issyk-Kul -> Caffa -> Messine — la menace arrive
//   3. HookBlocC  (180f / 6.0s)  : Galeres au quai de Messine — la menace debarque
//   4. HookBlocD  (168f / 5.6s)  : 27 000 000 de morts — l'ampleur
//   5. HookBlocE  (356f / 11.9s) : Reframe "pas la maladie, les humains" + 1347
//
// Transitions : coupes franches (pas de transition stylisee)
// Total : 706 + 1018 + 180 + 168 + 356 = 2428 frames (~80.9s @30fps)
// ============================================================

export const HookMaster: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={706}>
        <HookBlocA />
      </Series.Sequence>
      <Series.Sequence durationInFrames={1018}>
        <HookBlocB />
      </Series.Sequence>
      <Series.Sequence durationInFrames={180}>
        <HookBlocC />
      </Series.Sequence>
      <Series.Sequence durationInFrames={168}>
        <HookBlocD />
      </Series.Sequence>
      <Series.Sequence durationInFrames={356}>
        <HookBlocE />
      </Series.Sequence>
    </Series>
  );
};
