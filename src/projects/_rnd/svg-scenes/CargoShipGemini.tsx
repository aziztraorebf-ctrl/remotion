/**
 * CargoShipGemini — silhouette de cargo porte-conteneurs, GREFFEE depuis une cible SVG generee par
 * Gemini 3.1 Pro (test mix-and-match 2026-07-03, cf memory/Concept-video-SVG conversation Gemini).
 * Trace de coque/passerelle/antenne = Gemini (silhouette nette). Conteneurs redecoupes en rectangles
 * individuels + palette coloree (emprunt au style GPT) pour ne pas detonner encre-pure dans une scene
 * qui est globalement COLOREE (arbres, ocean, soleil). Recentre/scale dans le repere local de
 * CargoVoyage16x9 (origine = ligne de flottaison, cargo ~420 unites de large).
 * Fumee/sillage/ombre restent GERES PAR LE CODE APPELANT (pas dans ce tracé statique).
 */
import React from "react";

const INK = "#312A26";
const HULL = "#3d3630"; // coque foncee (plus proche de notre ancien cargo encre que du parchemin clair)
const DECK = "#E2D7C1"; // passerelle/superstructure claire

// bounding box de la cible generee : x=[400,1480] y=[280,780], centre x=940, ligne de flottaison y~720
const CX = 940;
const CY = 720;
const SCALE = 420 / 1080; // normalise vers largeur ~420 (notre gabarit cargo local)

// conteneurs individuels (x, yTop, w, h, couleur) — subdivise les paliers de l'escalier Gemini
const CONTAINER_COLORS = ["#7a9b6e", "#c8763a", "#4a7a96", "#b5484f", "#c8a951", "#5c8a6e"];
const CONTAINERS: { x: number; y: number; w: number; h: number }[] = [
  { x: 660, y: 560, w: 50, h: 100 },
  { x: 710, y: 560, w: 50, h: 100 },
  { x: 760, y: 520, w: 70, h: 140 },
  { x: 830, y: 520, w: 70, h: 140 },
  { x: 900, y: 480, w: 80, h: 180 },
  { x: 980, y: 480, w: 80, h: 180 },
  { x: 1060, y: 540, w: 60, h: 120 },
  { x: 1120, y: 540, w: 60, h: 120 },
  { x: 1180, y: 580, w: 50, h: 80 },
  { x: 1230, y: 580, w: 50, h: 80 },
  { x: 1280, y: 620, w: 40, h: 40 },
  { x: 1320, y: 620, w: 40, h: 40 },
];

export const CargoShipGemini: React.FC<{ ink?: string; hull?: string }> = ({ ink = INK, hull = HULL }) => (
  <g transform={`scale(${SCALE}) translate(${-CX} ${-CY})`}>
    {/* coque */}
    <path d="M 420 780 L 1400 780 L 1480 660 L 400 660 Z" fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M 410 720 L 1440 720" fill="none" stroke="#00000030" strokeWidth={1.5} strokeDasharray="25 15" />
    <circle cx={1420} cy={690} r={8} fill="none" stroke="#00000050" strokeWidth={2} />
    <line x1={1420} y1={698} x2={1420} y2={725} stroke="#00000050" strokeWidth={2} />

    {/* passerelle (pont etage) */}
    <rect x={430} y={580} width={170} height={80} fill={DECK} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={450} y={520} width={130} height={60} fill={DECK} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={470} y={460} width={90} height={60} fill={DECK} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={460} y={430} width={110} height={30} fill={DECK} stroke={ink} strokeWidth={3} strokeLinejoin="round" />

    <line x1={470} y1={445} x2={560} y2={445} stroke={ink} strokeWidth={8} strokeDasharray="12 6" />
    <line x1={480} y1={480} x2={550} y2={480} stroke={ink} strokeWidth={6} strokeDasharray="10 8" />
    <line x1={460} y1={540} x2={570} y2={540} stroke={ink} strokeWidth={4} strokeDasharray="15 10" />

    {/* antenne */}
    <line x1={515} y1={430} x2={515} y2={280} stroke={ink} strokeWidth={3} />
    <line x1={485} y1={320} x2={545} y2={310} stroke={ink} strokeWidth={2} />
    <line x1={495} y1={350} x2={535} y2={340} stroke={ink} strokeWidth={2} />
    <circle cx={515} cy={280} r={4} fill={ink} />

    {/* cheminee */}
    <path d="M 610 520 L 650 520 L 635 440 L 595 440 Z" fill={DECK} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <line x1={602} y1={460} x2={640} y2={460} stroke={ink} strokeWidth={2} />
    <line x1={606} y1={480} x2={644} y2={480} stroke={ink} strokeWidth={2} />

    {/* conteneurs colores individuels (escalier Gemini + palette GPT) */}
    {CONTAINERS.map((c, i) => (
      <rect
        key={i}
        x={c.x}
        y={c.y}
        width={c.w}
        height={c.h}
        fill={CONTAINER_COLORS[i % CONTAINER_COLORS.length]}
        stroke={ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    ))}
    {/* filet horizontal discret sur chaque rangee (echo du style ligne interieure Gemini) */}
    {CONTAINERS.map((c, i) => (
      <line key={`mid-${i}`} x1={c.x} y1={c.y + c.h / 2} x2={c.x + c.w} y2={c.y + c.h / 2} stroke={ink} strokeWidth={1} opacity={0.35} />
    ))}
  </g>
);
