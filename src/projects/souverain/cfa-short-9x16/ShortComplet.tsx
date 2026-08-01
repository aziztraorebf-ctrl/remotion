// ShortComplet — Short Franc CFA 9x16 — assemblage final des 4 scenes + narration unique.
//
// Structure (script condense valide, calee sur forced-alignment cfa-short-vo-v2.mp3, 75.62s) :
//   HOOK (Beat 1)      f0    -> f583   "12 janvier 1994... sans que personne ne vote"
//   MECANIQUE (Beat 3) f583  -> f1243  "parite fixe... tient la cle"
//   CLIMAX (Beat 5b)   f1243 -> f1946  "un pays qui controle... paie en autonomie"
//   CTA (nouveau)      f1946 -> f2359  "L'histoire complete... lien en description"
//
// Chaque scene garde ses propres SFX (et la musique d'episode, embarquee dans le Hook) ; leur
// narration mid-form individuelle est coupee (muteNarration) au profit d'UNE SEULE narration
// couvrant tout le Short.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CfaShortHook9x16, CFA_SHORT_HOOK_FRAMES } from "../../_rnd/fable-svg/CfaShortHook9x16";
import { CfaShortParite9x16, CFA_SHORT_PARITE_FRAMES } from "../../_rnd/fable-svg/CfaShortParite9x16";
import { CfaShortLevier9x16, CFA_SHORT_LEVIER_FRAMES } from "../../_rnd/fable-svg/CfaShortLevier9x16";
import { SceneCta, CFA_SHORT_CTA_FRAMES } from "./SceneCta";

const F_HOOK = 0;
const F_PARITE = F_HOOK + CFA_SHORT_HOOK_FRAMES; // 583
const F_LEVIER = F_PARITE + CFA_SHORT_PARITE_FRAMES; // 1243
const F_CTA = F_LEVIER + CFA_SHORT_LEVIER_FRAMES; // 1946

export const CFA_SHORT_TOTAL_FRAMES = F_CTA + CFA_SHORT_CTA_FRAMES;
export const CFA_SHORT_FPS = 30;

export const ShortComplet: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#182746" }}>
      {/* narration unique, couvre tout le Short */}
      <Audio src={staticFile("_rnd/cfa-short-9x16/cfa-short-vo.mp3")} />

      <Sequence from={F_HOOK} durationInFrames={CFA_SHORT_HOOK_FRAMES}>
        <CfaShortHook9x16 muteNarration />
      </Sequence>

      <Sequence from={F_PARITE} durationInFrames={CFA_SHORT_PARITE_FRAMES}>
        <CfaShortParite9x16 muteNarration />
      </Sequence>

      <Sequence from={F_LEVIER} durationInFrames={CFA_SHORT_LEVIER_FRAMES}>
        <CfaShortLevier9x16 muteNarration />
      </Sequence>

      <Sequence from={F_CTA} durationInFrames={CFA_SHORT_CTA_FRAMES}>
        <SceneCta />
      </Sequence>
    </AbsoluteFill>
  );
};

export default ShortComplet;
