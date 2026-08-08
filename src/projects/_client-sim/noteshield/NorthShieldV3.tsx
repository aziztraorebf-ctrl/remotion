// NorthShieldV3 — composition complete, 5 panneaux (refonte 2026-08-08 apres retour Aziz sur le
// premier montage 7 panneaux). Storyboard V3 "Mix incarne" (System/Conceptual + Narrative/Human) :
// cf memory/client-sim-tests/noteshield/STORYBOARD-V3-MIX-INCARNE.md +
// memory/episodes/_client-sim/noteshield/STATUS.md.
//
// REFONTE 2026-08-08 (6 correctifs Aziz, detail dans le brief remotion-composer de cette session) :
// P2 (slider) et P3 (ligne calme) SUPPRIMES de la composition -- P1 raconte deja le dilemme via
// la video H3, ces 2 panneaux etaient redondants. Les 177f liberees vont TOUTES a P1 (decision
// Aziz : le compteur/mecanisme de P1 avait besoin de plus de place, pas d'accelerer le clip).
//
// P1 4-457      -- video H3 (dilemme incarne, badge selectif + barriere), compteur agrandi,
//                  playbackRate ralenti (clip 367f desormais PLUS COURT que la fenetre 453f)
// P4 457-861    -- SVG maison + cadre UI (P3QuatreSignaux + wrapper) + deltas numeriques visibles
//                  par signal (mecanisme rendu VISIBLE, pas juste suggere par la convergence)
// P5 861-1229   -- video H3 (Sarah Toronto) encadree en disque/anneau (pattern Flowdesk) +
//                  LaptopMockup/DashboardScreen (chassis complet visible, bug width*1.3 corrige)
// P6 1229-1696  -- video H3 (inconnu) encadre en disque/anneau a l'ouverture + VirtualCursor
//                  actif dans le dashboard + P5DashboardMorphBosse (bosse plus vivante)
// P7 1696-1900  -- SVG maison (P6Signature, direction-b, reutilise tel quel)
//
// Composition totale : 1900 frames / 30fps / 63.34s (INCHANGEE malgre la suppression de 2
// panneaux -- les frames liberees redistribuees, pas retirees). Audio : narration-full.mp3
// (63.39s mesure ffprobe, tolerance +-0.1s OK).
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { P6Signature } from "./direction-b/P6Signature";
import { P1VideoDilemme } from "./v3/P1VideoDilemme";
import { P4FrameWrapper } from "./v3/P4FrameWrapper";
import { P5VideoSarah } from "./v3/P5VideoSarah";
import { P6VideoInconnu } from "./v3/P6VideoInconnu";

export const NS_V3_FPS = 30;
export const NS_V3_FRAMES = 1900; // 63.34s a 30fps

const PANELS = [
  { key: "p1", Comp: P1VideoDilemme, from: 4, durationInFrames: 453 },
  { key: "p4", Comp: P4FrameWrapper, from: 457, durationInFrames: 404 },
  { key: "p5", Comp: P5VideoSarah, from: 861, durationInFrames: 368 },
  { key: "p6", Comp: P6VideoInconnu, from: 1229, durationInFrames: 467 },
  { key: "p7", Comp: P6Signature, from: 1696, durationInFrames: 204 },
];

export const NorthShieldV3: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <Audio src={staticFile("_client-sim/noteshield/audio/narration-full.mp3")} />
      {PANELS.map(({ key, Comp, from, durationInFrames }) => (
        <Sequence key={key} from={from} durationInFrames={durationInFrames} premountFor={30}>
          <Comp />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
