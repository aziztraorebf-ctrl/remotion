/**
 * GgwD3GeoMapEncreSFX — couche SON TIMEE frame-perfect sur le hook ENCRE (GgwD3GeoMapEncre).
 *
 * Meme mapping geste->son que la version braise (GgwD3GeoMapSFX) : meme animation, meme timing.
 *   - apparition de CHAQUE arbre (pop nature echelonne ouest->est)
 *   - mur complet (accord/impact)
 *   - LA MORT (snap sec + whoosh descendant + vent sec)
 *   - drone de fond chaud continu (0.40).
 *
 * Frames (lues dans GgwD3GeoMapEncre, identiques au proto braise) :
 *   naissance arbre i = 30 + i*3  ·  mur complet ~f78  ·  LA MORT a partir de f180.
 *
 * REGLES SFX (SFX-INDEX) : <Sequence from> OBLIGATOIRE · plancher 0.50 · drone 0.40 · durees verifiees ffprobe.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { GgwD3GeoMapEncre } from "./GgwD3GeoMapEncre";

const sfx = (p: string) => staticFile(`_shared/sfx/${p}`);

const NB_TREES = 16;
const birthFrame = (i: number) => 30 + i * 3;

export const GgwD3GeoMapEncreSFX: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* VISUEL encre, intact */}
      <GgwD3GeoMapEncre />

      {/* ---- COUCHE SON TIMEE ---- */}

      {/* drone chaud continu de fond, volume bas */}
      <Sequence from={0} durationInFrames={250}>
        <Audio src={sfx("warmap/tension-drone.mp3")} volume={0.4} loop />
      </Sequence>

      {/* apparition de CHAQUE arbre -> pop de pousse echelonne ouest->est */}
      {Array.from({ length: NB_TREES }).map((_, i) => (
        <Sequence key={`tree-${i}`} from={birthFrame(i)} durationInFrames={24}>
          <Audio src={sfx("nature/growth-pop.mp3")} volume={0.5} />
        </Sequence>
      ))}

      {/* mur complet -> accord/impact de validation */}
      <Sequence from={80} durationInFrames={40}>
        <Audio src={sfx("warmap/liptako-gong.mp3")} volume={0.42} />
      </Sequence>
      {/* le monde respire (vie installee) */}
      <Sequence from={92} durationInFrames={80}>
        <Audio src={sfx("nature/birds-ambient.mp3")} volume={0.32} />
      </Sequence>

      {/* LA MORT (f180) -> snap sec + whoosh descendant + vent sec */}
      <Sequence from={180} durationInFrames={30}>
        <Audio src={sfx("warmap/cedeao-snap.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={182} durationInFrames={30}>
        <Audio src={sfx("warmap/arrow-whoosh.mp3")} volume={0.55} />
      </Sequence>
      <Sequence from={188} durationInFrames={60}>
        <Audio src={sfx("nature/wind-leaves.mp3")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};

export default GgwD3GeoMapEncreSFX;
