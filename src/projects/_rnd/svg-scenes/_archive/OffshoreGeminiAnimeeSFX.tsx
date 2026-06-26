/**
 * OffshoreGeminiAnimeeSFX — R&D (2026-06-21) : PROTO du SFX TIMÉ frame-perfect.
 *
 * Réutilise le visuel prouvé `OffshoreGeminiAnimee` et superpose une couche SON calée EXACTEMENT
 * sur les frames des événements de la construction du blueprint. C'est la thèse de la session :
 * une animation SVG contrôlée à la frame = des SFX frame-perfect (impossible avec une vidéo IA).
 *
 * Frames d'événements (lues dans OffshoreGeminiAnimee) :
 *   f0   planche/grille apparaît
 *   f15  ligne-mer se trace · f28 seabed · f40 jambes · f58 topside · f72 derrick · f85 flare · f88 riser
 *   f85  torchère s'allume · f90 réservoir se révèle · f108 structure complète (validation)
 *   f110 le pétrole commence à REMONTER le riser (drone continu)
 *   f100/110 cotes + étiquettes s'annotent (ticks)
 *
 * RÈGLES SFX (SFX-INDEX) : <Sequence from> OBLIGATOIRE autour de chaque <Audio> (jamais frame===X) ·
 * volume plancher 0.50 · durées vérifiées au ffprobe (toutes saines).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { OffshoreGeminiAnimee } from "./OffshoreGeminiAnimee";

const sfx = (p: string) => staticFile(`_shared/sfx/${p}`);

// un trait de structure qui se trace -> whoosh bas et sec (arrow-whoosh, 0.6s)
const TRACE_WHOOSH = "warmap/arrow-whoosh.mp3";
// une annotation (cote / etiquette) qui apparait -> tick sec (0.48s)
const TICK = "data/tick-counter.mp3";

// frames de tracé de chaque element de structure
const TRACE_FRAMES = [15, 28, 40, 58, 72, 88];
// frames d'annotations (cotes + etiquettes echelonnees)
const TICK_FRAMES = [100, 108, 116, 124, 132, 140];

export const OffshoreGeminiAnimeeSFX: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* VISUEL prouvé, intact */}
      <OffshoreGeminiAnimee />

      {/* ---- COUCHE SON TIMÉE ---- */}

      {/* f0 : la planche/grille apparaît -> whoosh d'ouverture */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={sfx("ui/whoosh.mp3")} volume={0.5} />
      </Sequence>

      {/* chaque trait de structure se trace -> whoosh bas et sec, frame-perfect */}
      {TRACE_FRAMES.map((f, i) => (
        <Sequence key={`trace-${i}`} from={f} durationInFrames={20}>
          <Audio src={sfx(TRACE_WHOOSH)} volume={0.5} />
        </Sequence>
      ))}

      {/* f85 : torchère s'allume -> petit pop d'apparition (node-appear) */}
      <Sequence from={85} durationInFrames={20}>
        <Audio src={sfx("ui/node-appear.mp3")} volume={0.55} />
      </Sequence>

      {/* f90 : réservoir se révèle -> pop d'apparition */}
      <Sequence from={90} durationInFrames={20}>
        <Audio src={sfx("ui/node-appear.mp3")} volume={0.5} />
      </Sequence>

      {/* f108 : structure complète -> impact de validation */}
      <Sequence from={108} durationInFrames={45}>
        <Audio src={sfx("impact/impact.mp3")} volume={0.55} />
      </Sequence>

      {/* f110 -> fin : le pétrole REMONTE -> drone grave continu (le flux) */}
      <Sequence from={110} durationInFrames={70}>
        <Audio src={sfx("warmap/tension-drone.mp3")} volume={0.4} />
      </Sequence>

      {/* annotations (cotes + étiquettes) -> ticks secs échelonnés */}
      {TICK_FRAMES.map((f, i) => (
        <Sequence key={`tick-${i}`} from={f} durationInFrames={15}>
          <Audio src={sfx(TICK)} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export default OffshoreGeminiAnimeeSFX;
