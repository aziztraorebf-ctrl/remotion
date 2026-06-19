/**
 * SenegalScene0 — ASSEMBLAGE de la scene d'ouverture complete (~22s), UNE seule timeline.
 *
 * Doctrine CONTINUITE-SCENE : un seul monde, une seule narration continue (pas 2 bouts d'audio).
 *   - Partie A (0 -> 9s, f0-270)  : ProtoEffect_MapDrawParchemin = carte qui se dessine + count-up 8M$.
 *   - Partie B (9s -> fin, f270+)  : ProtoEffect_Fracture = fracture (sur "limoge") -> recits -> recomposition.
 * Les deux enfants tournent SANS leur propre audio (withNarration=false) ; l'audio (narration + musique)
 * est joue UNE FOIS au niveau de la scene, en continu depuis 0s. Le fond bascule clair->sombre a la fracture.
 *
 * Render via remotion render (audio embarque). cale forced-alignment ElevenLabs (hook-alignment.json).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ProtoEffect_MapDrawParchemin } from "./ProtoEffect_MapDrawParchemin";
import { ProtoEffect_Fracture } from "./ProtoEffect_Fracture";

const PART_A = 270; // 9s @30fps : la partie A occupe les 9 premieres secondes

export const SenegalScene0: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d1424" }}>
      {/* AUDIO CONTINU (une seule narration + musique pour toute la scene) */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} volume={0.16} />

      {/* PARTIE A : carte qui se dessine + count-up (audio off, gere par la scene) */}
      <Sequence from={0} durationInFrames={PART_A}>
        <ProtoEffect_MapDrawParchemin withNarration={false} noExitFade />
      </Sequence>

      {/* PARTIE B : fracture -> recits -> recomposition (audio off ; ses beats sont cales sur NARR_FROM=9s
          ce qui coincide avec son demarrage a la frame 270 = 9s) */}
      <Sequence from={PART_A}>
        <ProtoEffect_Fracture mode="sombre" withNarration={false} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default SenegalScene0;
