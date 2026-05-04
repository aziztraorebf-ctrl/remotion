// Empire du Ghana — Full assembly (6 beats chaînés)
//
// Composition finale qui assemble Hook + Beat 1-5 sur les 3145 frames totales.
// Chaque beat reste autonome avec son propre <Audio> narration (synchronisé
// via startFrom dans le fichier original). Aucun trou audio car les beats
// se chevauchent jusqu'au début du beat suivant.
//
// Total : 3145 frames (~104.83s à 30fps).

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { SEGMENTS, TOTAL_FRAMES, AUDIO_DURATION_S, CTA_START_FRAME, CTA_FRAMES, CTA_HOLD_FRAMES } from "./timing";
import { EmpireGhanaHook } from "./EmpireGhanaHook";
import { Beat1Setup } from "./scenes/Beat1Setup";
import { Beat2Density } from "./scenes/Beat2Density";
import { Beat3Barter } from "./scenes/Beat3Barter";
import { Beat4Consequence } from "./scenes/Beat4Consequence";
import { Beat5CTA } from "./scenes/Beat5CTA";
import { Beat6CTA } from "./scenes/Beat6CTA";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { WHISPER_WORDS } from "./whisper-words";

export const EMPIRE_GHANA_FULL_FRAMES = TOTAL_FRAMES;

export const EmpireGhanaFull: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
      {/* Hook : frame 0 → 211 (couvre l'intro + gap avant Beat 1) */}
      <Sequence from={0} durationInFrames={SEGMENTS.S1_SETUP.startFrame}>
        <EmpireGhanaHook />
      </Sequence>

      {/* Beat 1 Setup : frame 211 → 676 */}
      <Sequence
        from={SEGMENTS.S1_SETUP.startFrame}
        durationInFrames={SEGMENTS.S2_DENSITY.startFrame - SEGMENTS.S1_SETUP.startFrame}
      >
        <Beat1Setup />
      </Sequence>

      {/* Beat 2 Density : frame 676 → 1462 */}
      <Sequence
        from={SEGMENTS.S2_DENSITY.startFrame}
        durationInFrames={SEGMENTS.S3_BARTER.startFrame - SEGMENTS.S2_DENSITY.startFrame}
      >
        <Beat2Density />
      </Sequence>

      {/* Beat 3 Silent Barter : frame 1462 → 2152 */}
      <Sequence
        from={SEGMENTS.S3_BARTER.startFrame}
        durationInFrames={SEGMENTS.S4_CONSEQUENCE.startFrame - SEGMENTS.S3_BARTER.startFrame}
      >
        <Beat3Barter />
      </Sequence>

      {/* Beat 4 Effondrement : frame 2152 → 2788 */}
      <Sequence
        from={SEGMENTS.S4_CONSEQUENCE.startFrame}
        durationInFrames={SEGMENTS.S5_CTA.startFrame - SEGMENTS.S4_CONSEQUENCE.startFrame}
      >
        <Beat4Consequence />
      </Sequence>

      {/* Beat 5 CTA : frame 2788 → 3178 (357 frames narration + 30 frames hold final) */}
      {/* Le hold de 1s apres "Jamais Wagadou" cree la respiration narrative avant CTA. */}
      {/* Toutes les interpolate de Beat5 ont extrapolateRight clamp = freeze naturel. */}
      <Sequence
        from={SEGMENTS.S5_CTA.startFrame}
        durationInFrames={SEGMENTS.S5_CTA.durationFrames + CTA_HOLD_FRAMES}
      >
        <Beat5CTA />
      </Sequence>

      {/* Sous-titres karaoke mot-par-mot — démarrent APRÈS le Hook (le Hook a déjà ses sous-titres intégrés) */}
      {/* Couleur : or (Atlas signature, héritage Sonjata V7) */}
      {/* Overrides : Whisper transcrit Wagadou comme "Ouagadou/Ouagadougou", Taghaza comme "Tagaza", Saleh comme "Salé" */}
      {/* Limit : sceneEndS = AUDIO_DURATION_S — ne couvre PAS Beat 6 CTA (ses propres lignes cascade visuelles servent de texte) */}
      <Sequence from={SEGMENTS.S1_SETUP.startFrame} durationInFrames={CTA_START_FRAME - SEGMENTS.S1_SETUP.startFrame}>
        <Subtitles
          sceneStartS={SEGMENTS.S1_SETUP.startS}
          sceneEndS={AUDIO_DURATION_S}
          highlightColor="#FFD84A"
          fontSize={52}
          bottomOffset={180}
          words={WHISPER_WORDS}
          wordOverrides={{
            ouagadou: "Wagadou",
            ouagadougou: "Wagadou",
            tagaza: "Taghaza",
            salé: "Saleh",
          }}
        />
      </Sequence>

      {/* Beat 6 CTA : frame 3148 → 3568 — plein écran narration newsletter */}
      <Sequence from={CTA_START_FRAME} durationInFrames={CTA_FRAMES}>
        <Beat6CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
