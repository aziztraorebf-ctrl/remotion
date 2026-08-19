import React from "react";
import { AbsoluteFill } from "remotion";
import * as A from "./marcheNuitGroupsA";
import * as B from "./marcheNuitGroupsB";

/**
 * COMPARATIF A/B — meme brief, meme decor a produire, 2 modeles differents.
 * Rendu dans des conditions STRICTEMENT identiques (memes plans, meme ordre, meme
 * absence de parallaxe) pour que seule la qualite du dessin les distingue.
 *
 * ⛔ TEST AVEUGLE : les compositions s'appellent "Candidat-A" et "Candidat-B". Le nom du
 * modele n'apparait NI dans le code rendu, NI dans le fichier. C'est la methode qui a
 * tranche le beat 4 du CFA — un nom de modele oriente le jugement.
 */

export const MARCHE_NUIT_FRAMES = 90;

const W = 1920;
const H = 1080;

const Plans: React.FC<{ g: typeof A }> = ({ g }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <defs dangerouslySetInnerHTML={{ __html: g.DEFS }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_CIEL }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_VILLE }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_ETALS_FOND }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_ETALS }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_SOL }} />
    <g dangerouslySetInnerHTML={{ __html: g.PLAN_AVANT }} />
  </svg>
);

export const MarcheNuitA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
    <Plans g={A} />
  </AbsoluteFill>
);

export const MarcheNuitB: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#1a2238" }}>
    <Plans g={B as unknown as typeof A} />
  </AbsoluteFill>
);
