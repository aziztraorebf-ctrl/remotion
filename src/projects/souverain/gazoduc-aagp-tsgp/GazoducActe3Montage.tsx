// GazoducActe3Montage — assemblage final de l'Acte 3 en 3 segments distincts, jamais un fichier
// monolithique (doctrine DOCTRINE-SOUVERAIN.md §4.4). 3 segments contigus sur narration-p3.mp3
// (123.07s), chacun avec sa propre fenêtre audio (startFrom) :
//
//   1. Carte TSGP        — 2227f/74.23s — audio 0.0s->73.928s   (f0->f2218)
//   2. Insert Sécurité   — 965f/32.17s  — audio 73.928s->105.808s (f2218->f3174)
//   3. Insert Paradoxe   — 527f/17.57s  — audio 105.808s->123.066s (f3174->f3692)
//
// (Segments 2 et 3 incluent +9f/300ms de marge de sécurité audio en fin de fenêtre — même pattern
// que GazoducActe2Montage.tsx : la Sequence coupe l'Audio net à sa durée sans tolérance.)
//
// narration-p3.mp3 est un fichier ISOLÉ (0 = début de la Partie 3, pas d'offset supplémentaire à
// appliquer) — contrairement à narration-p2.mp3 dont les offsets audio venaient du forced-align sur
// le fichier complet. Offsets ici = directement SEGMENTS.*.startSec de GazoducActe3Timing.ts.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GazoducActe3CarteTSGP } from "./GazoducActe3CarteTSGP";
import { GazoducActe3InsertSecurite } from "./GazoducActe3InsertSecurite";
import { GazoducActe3InsertParadoxe } from "./GazoducActe3InsertParadoxe";
import {
  SEGMENTS,
  GAZODUC_A3_CARTE_TSGP_FRAMES,
  GAZODUC_A3_INSERT_SECURITE_FRAMES,
  GAZODUC_A3_INSERT_PARADOXE_FRAMES,
} from "./GazoducActe3Timing";

const NARRATION_P3 = "souverain/gazoduc-aagp-tsgp/audio/narration-p3.mp3";
const FPS = 30;

const AUDIO_START = {
  carte: Math.round(SEGMENTS.A_carteTSGP.startSec * FPS), // 0
  securite: Math.round(SEGMENTS.B_insertSecurite.startSec * FPS), // 2218
  paradoxe: Math.round(SEGMENTS.C_insertParadoxe.startSec * FPS), // 3174
};

const F_CARTE = 0;
const F_SECURITE = F_CARTE + GAZODUC_A3_CARTE_TSGP_FRAMES; // 2227
const F_PARADOXE = F_SECURITE + GAZODUC_A3_INSERT_SECURITE_FRAMES; // 3192

export const GAZODUC_A3_MONTAGE_FRAMES = F_PARADOXE + GAZODUC_A3_INSERT_PARADOXE_FRAMES; // 3719

export const GazoducActe3Montage: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#182746" }}>
      <Sequence from={F_CARTE} durationInFrames={GAZODUC_A3_CARTE_TSGP_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P3)} startFrom={AUDIO_START.carte} />
          <GazoducActe3CarteTSGP />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F_SECURITE} durationInFrames={GAZODUC_A3_INSERT_SECURITE_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P3)} startFrom={AUDIO_START.securite} />
          <GazoducActe3InsertSecurite />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={F_PARADOXE} durationInFrames={GAZODUC_A3_INSERT_PARADOXE_FRAMES}>
        <AbsoluteFill>
          <Audio src={staticFile(NARRATION_P3)} startFrom={AUDIO_START.paradoxe} />
          <GazoducActe3InsertParadoxe />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default GazoducActe3Montage;
