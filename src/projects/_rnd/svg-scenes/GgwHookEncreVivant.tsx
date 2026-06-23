/**
 * GgwHookEncreVivant — HOOK Grande Muraille Verte, registre ENCRE NARRATIVE, ANIME avec PILOTAGE COULEUR SEMANTIQUE.
 *
 * Base = la scene narrative encre Gemini (narr-1-encre, "le mur fier ecrase par l'immensite") :
 *   dunes ecrasantes + soleil de plomb + ligne d'arbres minuscule + pelle plantee abandonnee. Tout en ENCRE neutre.
 * AMELIORATIONS Claude-editeur-SVG (sans regenerer) :
 *   - arbres-touffes du LLM remplaces par les VRAIS arbres geminiTrees.ts (tronc + feuillage etage), agrandis,
 *     en groupes individuels animables (se-tracent/verdissent un a un).
 *   - pelle redessinee plus nette.
 * SEQUENCE COULEUR TIMEE (oilSpread inverse, monde mort->vie) :
 *   f0  : tout en encre. La PELLE se colore d'emblee (le seul effort humain vivant).
 *   ~f30->: les ARBRES se tracent un a un d'avant-plan vers l'horizon + virent au VERT plein.
 *   ~f90->: le SOLEIL s'embrase (jaune ardent + glow + rayons qui tournent).
 *   le DESERT (dunes/hachures/vents) reste en ENCRE = le monde neutre/aride.
 * Timing PROVISOIRE (sera cale sur la voix GeoAfrique ensuite). viewBox 1080x1920 (9:16).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { GGWX_TREES } from "./ggwTreesGpt";

const CREME = "#e8dcc0";
const ENCRE = "#2b2117";
const VERT = "#3e8f34", VERT_D = "#295c1c";
const OR = "#f2b53a", OR_GLOW = "#ffd86b";

// arbre Gemini recolore (encre brune = monde sec / vert = vivant)
function recolor(body: string, fill: string, stroke: string): string {
  return body.replace(/fill="(?!none")[^"]*"/g, `fill="${fill}"`)
             .replace(/stroke="(?!none")[^"]*"/g, `stroke="${stroke}"`);
}
// versions encre (sec/bruni) + verte (vivante) des 4 arbres GPT detailles
const TREES_ENCRE = GGWX_TREES.map((t) => recolor(t, "#cdbd9a", ENCRE));
const TREES_VERT = GGWX_TREES; // deja en verts pleins (acacia, rond, jeune, arbuste)

/* POSITIONS = chaque petit trait de hachure que le LLM a plante dans le sable (= un arbre, idee Aziz).
 * Extraites de narr-1-encre.svg (2 cretes), ordonnees par profondeur. y grand = avant-plan = gros arbre.
 * On NE DEVINE PAS le placement : on suit la composition exacte du modele. */
const RAW_POS: [number, number][] = [
  [440, 965], [420, 985], [400, 1005], [380, 1025], [360, 1045], [340, 1065], [320, 1085], [300, 1105], [280, 1125],
  [370, 1475], [400, 1505], [430, 1535], [460, 1565], [490, 1595], [520, 1625], [550, 1655], [580, 1685], [610, 1715], [640, 1745], [670, 1775],
];
// taille selon la profondeur (y 950->1800 => scale 0.55->1.7), + variante d'arbre par index
const TREES = RAW_POS.map(([x, y], i) => ({
  x, y,
  s: interpolate(y, [950, 1800], [0.42, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  v: i % GGWX_TREES.length,
})).sort((a, b) => a.y - b.y); // horizon -> avant-plan

export const GgwHookEncreVivant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- soleil : embrasement + rayons qui tournent ---
  const sunWarm = interpolate(frame, [90, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunRot = frame * 0.25;
  const sunPulse = 1 + 0.03 * Math.sin(frame / 9);

  // --- pelle : coloree d'emblee (apparait f0-10) ---
  const pelleIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: CREME }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%">
        {/* fond parchemin + cadre epure */}
        <rect width={1080} height={1920} fill={CREME} />
        <rect x={40} y={40} width={1000} height={1840} stroke={ENCRE} strokeWidth={1.5} fill="none" />
        <rect x={50} y={50} width={980} height={1820} stroke={ENCRE} strokeWidth={1} strokeDasharray="4 8" fill="none" />

        {/* horizon (encre, permanent) */}
        <g id="horizon">
          <path d="M -50 500 Q 250 490 540 510 T 1150 495" stroke={ENCRE} strokeWidth={2} fill="none" />
          <path d="M 100 500 Q 300 480 450 505" stroke={ENCRE} strokeWidth={1} strokeDasharray="2 4" fill="none" />
          <path d="M 650 510 Q 800 480 1000 495" stroke={ENCRE} strokeWidth={1} strokeDasharray="3 6" fill="none" />
        </g>

        {/* SOLEIL : encre -> embrasement or + glow + rayons qui tournent */}
        <g id="soleil">
          {/* glow ardent (apparait avec sunWarm) */}
          <circle cx={540} cy={320} r={160 * sunPulse} fill={OR_GLOW}
            opacity={sunWarm * 0.5} style={{ filter: "blur(28px)" }} />
          <circle cx={540} cy={320} r={160} stroke={ENCRE} strokeWidth={4}
            fill={OR} fillOpacity={sunWarm * 0.9} />
          {/* couronnes */}
          <circle cx={540} cy={320} r={190} stroke={ENCRE} strokeWidth={2} strokeDasharray="12 18" fill="none" opacity={0.8} />
          <circle cx={540} cy={320} r={230} stroke={ENCRE} strokeWidth={1.5} strokeDasharray="4 10" fill="none" opacity={0.6} />
          <circle cx={540} cy={320} r={280} stroke={ENCRE} strokeWidth={1} strokeDasharray="1 8" fill="none" opacity={0.4} />
          {/* rayons qui tournent (8 branches), s'embrasent */}
          <g transform={`rotate(${sunRot} 540 320)`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const r1 = 300, r2 = 360;
              const x1 = 540 + Math.cos(a) * r1, y1 = 320 + Math.sin(a) * r1;
              const x2 = 540 + Math.cos(a) * r2, y2 = 320 + Math.sin(a) * r2;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={sunWarm > 0.3 ? OR : ENCRE} strokeWidth={2.5} strokeLinecap="round" opacity={0.4 + sunWarm * 0.6} />;
            })}
          </g>
        </g>

        {/* DUNES : restent en ENCRE (le monde aride / neutre) */}
        <g id="dunes">
          <path d="M 400 505 C 600 550 750 650 1150 750" stroke={ENCRE} strokeWidth={2.5} fill="none" />
          <path d="M 750 650 C 850 750 950 850 1150 880" stroke={ENCRE} strokeWidth={1.5} fill="none" />
          <path d="M -50 850 C 250 800 450 950 850 1100 C 950 1137 1050 1150 1150 1150" stroke={ENCRE} strokeWidth={3.5} fill="none" />
          <path d="M 450 950 C 350 1050 200 1150 -50 1250" stroke={ENCRE} strokeWidth={2} fill="none" />
          {/* (hachures crete mediane retirees : elles servaient de positions d'arbres, les arbres les remplacent) */}
          <path d="M 1150 1150 C 900 1350 700 1450 350 1450 C 150 1450 -10 1500 -50 1550" stroke={ENCRE} strokeWidth={5} fill="none" />
          <path d="M 350 1450 C 500 1600 750 1750 1150 1900" stroke={ENCRE} strokeWidth={3} fill="none" />
          {/* (hachures crete avant retirees : remplacees par les arbres) */}
        </g>

        {/* vents (encre) */}
        <g id="vents" opacity={0.8}>
          <path d="M -50 1050 Q 300 1150 600 1050 T 1150 1100" stroke={ENCRE} strokeWidth={1} strokeDasharray="15 25 5 15" fill="none" />
          <path d="M -50 1350 Q 400 1300 700 1400 T 1150 1350" stroke={ENCRE} strokeWidth={1.5} strokeDasharray="30 40 10 30" fill="none" />
        </g>

        {/* LIGNE D'ARBRES : un vrai arbre a CHAQUE trait que le LLM avait plante (idee Aziz).
            Se construisent un a un de l'AVANT-PLAN (pres de la pelle) vers l'HORIZON + virent au VERT. */}
        <g id="arbres">
          {[...TREES].sort((a, b) => b.y - a.y).map((t, i) => {
            const birth = 26 + i * 5; // avant-plan d'abord (y grand), puis vers l'horizon
            const pop = spring({ frame: frame - birth, fps, config: { mass: 1, damping: 13, stiffness: 120 } });
            if (pop < 0.01) return null;
            const greenIn = interpolate(frame, [birth + 5, birth + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const sway = Math.sin((frame - birth) / 17 + t.x) * 1.5;
            return (
              <g key={`${t.x}-${t.y}`} transform={`translate(${t.x} ${t.y}) rotate(${sway}) scale(${t.s * pop})`}>
                <g opacity={1 - greenIn} dangerouslySetInnerHTML={{ __html: TREES_ENCRE[t.v] }} />
                <g opacity={greenIn} dangerouslySetInnerHTML={{ __html: TREES_VERT[t.v] }} />
              </g>
            );
          })}
        </g>

        {/* PELLE : coloree d'emblee (le seul effort humain vivant) — redessinee plus nette */}
        <g id="pelle" opacity={pelleIn} transform={`translate(0 ${(1 - pelleIn) * 20})`}>
          {/* ombre portee */}
          <path d="M 260 1675 L 120 1715" stroke={ENCRE} strokeWidth={2} strokeDasharray="5 5" fill="none" opacity={0.5} />
          {/* tas de sable a la base (encre) */}
          <path d="M 215 1678 C 240 1648 285 1648 305 1688 Z" stroke={ENCRE} strokeWidth={2} fill="#d8c79c" />
          {/* manche bois */}
          <line x1="262" y1="1665" x2="305" y2="1470" stroke="#7a4a22" strokeWidth={7} strokeLinecap="round" />
          <line x1="262" y1="1665" x2="305" y2="1470" stroke={ENCRE} strokeWidth={8} strokeLinecap="round" opacity={0.25} />
          {/* poignee en D */}
          <path d="M 298 1474 C 274 1466 280 1432 308 1440 C 332 1447 326 1480 305 1474" stroke="#7a4a22" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* lame metal (trapeze net) */}
          <path d="M 244 1672 L 232 1620 L 292 1606 L 282 1684 Z" stroke={ENCRE} strokeWidth={3} fill="#b7b2a6" strokeLinejoin="round" />
          <path d="M 260 1614 L 252 1676" stroke={ENCRE} strokeWidth={1.5} fill="none" opacity={0.6} />
        </g>

        {/* titre (apparait tard, discret) */}
        <g id="titre" opacity={interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <text x={540} y={1820} fontFamily="Georgia, serif" fontSize={30} fill={ENCRE} textAnchor="middle" letterSpacing={6} fontWeight={700}>LA GRANDE MURAILLE VERTE</text>
          <line x1={540} y1={1778} x2={540} y2={1790} stroke={ENCRE} strokeWidth={1.5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GgwHookEncreVivant;
