/**
 * GgwD3GeoMapSFX — couche SON TIMEE frame-perfect sur le hook BRAISE (GgwD3GeoMap).
 *
 * Reutilise le visuel braise prouve, intact, et superpose des SFX cales EXACTEMENT sur les gestes :
 *   - apparition de CHAQUE arbre (pop nature echelonne ouest->est, growth-pop)
 *   - construction complete du mur (accord/impact a la fin de la pousse)
 *   - LA MORT (son sec descendant + snap, a partir de f180)
 *   - drone de fond chaud continu (0.40) pour tenir l'ambiance.
 *
 * Frames d'evenements (lues dans GgwD3GeoMap) :
 *   naissance arbre i = 30 + i*3  (16 arbres -> f30..f75)
 *   mur complet ~f78 (dernier arbre eclos)
 *   LA MORT a partir de f180 (3/4 grisent + retrecissent en ~15-40f)
 *
 * REGLES SFX (SFX-INDEX) : <Sequence from> OBLIGATOIRE (jamais frame===X) · plancher 0.50 · drone 0.40 ·
 * durees verifiees au ffprobe (toutes saines).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GgwD3GeoMap } from "./GgwD3GeoMap";

const sfx = (p: string) => staticFile(`_shared/sfx/${p}`);

const NB_TREES = 16;
const birthFrame = (i: number) => 30 + i * 3;

export const GgwD3GeoMapSFX: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* VISUEL braise prouve, intact */}
      <GgwD3GeoMap />

      {/* ---- COUCHE SON TIMEE ---- */}

      {/* drone chaud continu de fond (ambiance), volume bas sous tout le reste */}
      <Sequence from={0} durationInFrames={250}>
        <Audio src={sfx("warmap/tension-drone.mp3")} volume={0.4} loop />
      </Sequence>

      {/* apparition de CHAQUE arbre -> petit pop de pousse, echelonne ouest->est */}
      {Array.from({ length: NB_TREES }).map((_, i) => (
        <Sequence key={`tree-${i}`} from={birthFrame(i)} durationInFrames={24}>
          <Audio src={sfx("nature/growth-pop.mp3")} volume={0.5} />
        </Sequence>
      ))}

      {/* mur complet (dernier arbre eclos ~f78) -> accord/impact de validation */}
      <Sequence from={80} durationInFrames={40}>
        <Audio src={sfx("warmap/liptako-gong.mp3")} volume={0.42} />
      </Sequence>
      {/* nappe d'oiseaux brieve = le monde respire (vie installee), avant la bascule */}
      <Sequence from={92} durationInFrames={80}>
        <Audio src={sfx("nature/birds-ambient.mp3")} volume={0.32} />
      </Sequence>

      {/* LA MORT (f180) -> snap sec de fletrissement + whoosh descendant */}
      <Sequence from={180} durationInFrames={30}>
        <Audio src={sfx("warmap/cedeao-snap.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={182} durationInFrames={30}>
        <Audio src={sfx("warmap/arrow-whoosh.mp3")} volume={0.55} />
      </Sequence>
      {/* vent sec qui balaie le mur mort */}
      <Sequence from={188} durationInFrames={60}>
        <Audio src={sfx("nature/wind-leaves.mp3")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default GgwD3GeoMapSFX;
