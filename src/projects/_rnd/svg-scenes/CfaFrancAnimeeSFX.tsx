/**
 * CfaFrancAnimeeSFX — CfaFrancAnimee + SFX timES frame-perfect (banque _shared/sfx, zero generation).
 *
 * Mapping geste -> son (doctrine SVG-SCENES-GENERATIVES, SFX-INDEX) :
 *   - ouverture de planche (f0)              -> ui/whoosh.mp3
 *   - apparition de chaque noeud-pays (x6)   -> ui/node-appear.mp3 (f22..42, pas de 4f)
 *   - chaque lien qui se trace (x6)          -> warmap/arrow-whoosh.mp3 (f40..65)
 *   - drainage continu (flux vers le centre) -> warmap/tension-drone.mp3 (drone de fond, 0.40)
 *   - remplissage jauge "part retenue" (x3)  -> data/tick-counter.mp3
 *   - verrouillage du coffre (f110)          -> impact/impact.mp3 (le claquement)
 *   - apparition flux garantie (f130)        -> data/tick-counter.mp3
 *
 * Regles SFX (SFX-INDEX) : <Sequence from durationInFrames>=20> OBLIGATOIRE · plancher 0.50
 * (0.40 pour le drone de fond continu) · durees verifiees au ffprobe (anti-corruption).
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CfaFrancAnimee } from "./CfaFrancAnimee";

const sfx = (p: string) => staticFile(`_shared/sfx/${p}`);

// frames de tracage des liens (alignees sur lienDash : start = 40 + i*5)
const LIEN_FRAMES = [40, 45, 50, 55, 60, 65];
// frames d'apparition des noeuds (alignees sur noeuds-pays : start = 22 + i*4)
const NODE_FRAMES = [22, 26, 30, 34, 38, 42];
// frames de remplissage de la jauge (100->130)
const TICK_FRAMES = [100, 112, 124];

export const CfaFrancAnimeeSFX: React.FC = () => (
  <AbsoluteFill>
    <CfaFrancAnimee />

    {/* ouverture de planche */}
    <Sequence from={0} durationInFrames={20}>
      <Audio src={sfx("ui/whoosh.mp3")} volume={0.55} />
    </Sequence>

    {/* apparition des noeuds-pays */}
    {NODE_FRAMES.map((fr, i) => (
      <Sequence key={`n${i}`} from={fr} durationInFrames={20}>
        <Audio src={sfx("ui/node-appear.mp3")} volume={0.5} />
      </Sequence>
    ))}

    {/* tracage des liens de dependance */}
    {LIEN_FRAMES.map((fr, i) => (
      <Sequence key={`l${i}`} from={fr} durationInFrames={20}>
        <Audio src={sfx("warmap/arrow-whoosh.mp3")} volume={0.5} />
      </Sequence>
    ))}

    {/* drainage continu = drone de fond grave (volume bas, sous le reste) */}
    <Sequence from={92} durationInFrames={90}>
      <Audio src={sfx("warmap/tension-drone.mp3")} volume={0.4} />
    </Sequence>

    {/* remplissage de la jauge "part retenue" */}
    {TICK_FRAMES.map((fr, i) => (
      <Sequence key={`t${i}`} from={fr} durationInFrames={20}>
        <Audio src={sfx("data/tick-counter.mp3")} volume={0.5} />
      </Sequence>
    ))}

    {/* verrouillage sec du coffre */}
    <Sequence from={110} durationInFrames={30}>
      <Audio src={sfx("impact/impact.mp3")} volume={0.6} />
    </Sequence>

    {/* apparition du flux de garantie (contrepoids) */}
    <Sequence from={130} durationInFrames={20}>
      <Audio src={sfx("data/tick-counter.mp3")} volume={0.5} />
    </Sequence>
  </AbsoluteFill>
);

export default CfaFrancAnimeeSFX;
