import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import {
  DEFS,
  PLAN_CIEL,
  PLAN_LOINTAIN,
  PLAN_BATIMENTS,
  PLAN_VEHICULES,
  PLAN_SOL,
  PLAN_AVANT,
} from "./gareRoutiereGroups";

/**
 * DECOR SEUL — gare routiere ouest-africaine au petit matin (dessin : Fable 5, agent, 0 API).
 *
 * ⛔ POURQUOI ON LE REND VIDE D'ABORD : c'est la lecon de la scene de peche. On y avait herite
 * d'un decor jamais eprouve (concu pour le GeminiRig, il ne se rendait meme plus), et ses
 * defauts — « le chalutier ne ressemble pas vraiment a un chalutier, la mer n'est pas tout a
 * fait adequate » — ont ete pris pour des defauts de la scene nouvelle. Regle gravee dans
 * STICK-FIGURE-INDEX : avant de reutiliser un decor, LE RENDRE ET LE REGARDER.
 *
 * Parallaxe : chaque plan derive a sa propre vitesse (fond lent -> avant rapide), meme moteur
 * que VillageParallaxeAnime. La derive est CYCLIQUE (modulo) — pas de derive infinie qui
 * finirait par sortir le bord d'un plan dans le cadre (bug vecu sur la scene de peche).
 */

export const GARE_DECOR_FRAMES = 420; // 14s @ 30fps — assez pour juger la parallaxe

const W = 1920;
const H = 1080;

// ⭐ LA BANDE LIBRE (contrat du decor) : rien n'est dessine entre ces deux Y, c'est la que
// les personnages seront poses. Exporte pour que la scene animee s'y cale sans deviner.
export const BANDE_LIBRE_HAUT = 780;
export const BANDE_LIBRE_BAS = 1010;

const Inject: React.FC<{ html: string; tx: number }> = ({ html, tx }) => (
  <g transform={`translate(${tx} 0)`} dangerouslySetInnerHTML={{ __html: html }} />
);

// Derive cyclique : amplitude propre par plan, mais on boucle sur 240px pour ne jamais
// sortir le bord du plan dans le cadre (les plans couvrent -200..2120, soit 200px de marge
// de chaque cote).
const derive = (frame: number, vitesse: number) => -((frame * vitesse) % 190);

export const GareRoutiereDecor16x9: React.FC = () => {
  const frame = useCurrentFrame();

  // la lumiere du matin monte doucement sur la duree (le lieu se reveille)
  const jour = interpolate(frame, [0, GARE_DECOR_FRAMES], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        <Inject html={PLAN_CIEL} tx={derive(frame, 0.04)} />
        <Inject html={PLAN_LOINTAIN} tx={derive(frame, 0.13)} />
        <Inject html={PLAN_BATIMENTS} tx={derive(frame, 0.28)} />
        <Inject html={PLAN_VEHICULES} tx={derive(frame, 0.45)} />
        <Inject html={PLAN_SOL} tx={derive(frame, 0.62)} />
        <Inject html={PLAN_AVANT} tx={derive(frame, 0.95)} />

        {/* voile de lumiere rasante qui se leve — un seul rect, aucune texture ajoutee */}
        <rect
          x={0} y={0} width={W} height={H}
          fill="#d8a54a"
          opacity={0.12 - 0.09 * jour}
        />
      </svg>
    </AbsoluteFill>
  );
};

export default GareRoutiereDecor16x9;
