/**
 * CargoShipUnified — reprise de CargoShipGemini avec la PALETTE UNIFIEE observee dans la version
 * ameliorée par Gemini 3.1 Pro (mix-and-match 2026-07-03) : coque gris-anthracite/noir COHERENTE
 * avant/arriere (l'original melangeait coque foncee a l'arriere et passerelle claire sans lien visuel
 * assume).
 *
 * Corrections Aziz 2026-07-03 (le cargo faisait trop "dessin/cartoon") :
 * - Ligne de flottaison rouge RETIREE (coque = base noire/anthracite simple, pas de bande rouge).
 * - Conteneurs : UNE SEULE teinte (au lieu de 6 couleurs vives façon jouet) — bleu-gris marine sourd,
 *   registre éditorial adulte plutôt que cartoon enfant. La marchandise transportée n'a pas besoin
 *   d'être un arc-en-ciel pour se lire.
 *
 * Trace/geometrie : identique a CargoShipGemini (silhouette deja bonne, seul le remplissage change).
 */
import React from "react";

const INK = "#241f1b";
const HULL_DARK = "#2e2b28"; // anthracite unifie (au lieu de coque seule foncee + reste clair)
const CONTAINER_COLOR = "#4a6478"; // teinte unique marchandise — bleu-gris marine sourd, adulte/editorial

const CX = 940;
const CY = 720;
const SCALE = 420 / 1080;

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

export const CargoShipUnified: React.FC<{ ink?: string; hull?: string }> = ({ ink = INK, hull = HULL_DARK }) => (
  <g transform={`scale(${SCALE}) translate(${-CX} ${-CY})`}>
    {/* coque — anthracite unifie, base noire simple (pas de ligne de flottaison rouge : demande Aziz 2026-07-03,
        le cargo faisait trop "dessin/cartoon") */}
    <path d="M 420 780 L 1400 780 L 1480 660 L 400 660 Z" fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M 410 720 L 1440 720" fill="none" stroke="#ffffff20" strokeWidth={1.5} strokeDasharray="25 15" />
    <circle cx={1420} cy={690} r={8} fill="none" stroke="#ffffff30" strokeWidth={2} />
    <line x1={1420} y1={698} x2={1420} y2={725} stroke="#ffffff30" strokeWidth={2} />

    {/* passerelle (pont etage) — colorisee HULL (noir/anthracite comme la coque), demande Aziz 2026-07-03 :
        "le bloc gris avec l'antenne" doit etre de la meme couleur que le cargo, pas une teinte claire a part */}
    <rect x={430} y={580} width={170} height={80} fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={450} y={520} width={130} height={60} fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={470} y={460} width={90} height={60} fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={460} y={430} width={110} height={30} fill={hull} stroke={ink} strokeWidth={3} strokeLinejoin="round" />

    <line x1={470} y1={445} x2={560} y2={445} stroke="#ffffff30" strokeWidth={8} strokeDasharray="12 6" />
    <line x1={480} y1={480} x2={550} y2={480} stroke="#ffffff30" strokeWidth={6} strokeDasharray="10 8" />
    <line x1={460} y1={540} x2={570} y2={540} stroke="#ffffff30" strokeWidth={4} strokeDasharray="15 10" />

    {/* antenne */}
    <line x1={515} y1={430} x2={515} y2={280} stroke={ink} strokeWidth={3} />
    <line x1={485} y1={320} x2={545} y2={310} stroke={ink} strokeWidth={2} />
    <line x1={495} y1={350} x2={535} y2={340} stroke={ink} strokeWidth={2} />
    <circle cx={515} cy={280} r={4} fill={ink} />

    {/* conteneurs — teinte UNIQUE (marchandise sobre, pas un arc-en-ciel), leger degrade d'ombrage entre
        rangees pour garder du relief sans réintroduire de la couleur */}
    {CONTAINERS.map((c, i) => (
      <rect
        key={i}
        x={c.x}
        y={c.y}
        width={c.w}
        height={c.h}
        fill={CONTAINER_COLOR}
        stroke={ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
        opacity={0.85 + (i % 2) * 0.1}
      />
    ))}
    {CONTAINERS.map((c, i) => (
      <line key={`mid-${i}`} x1={c.x} y1={c.y + c.h / 2} x2={c.x + c.w} y2={c.y + c.h / 2} stroke={ink} strokeWidth={1} opacity={0.35} />
    ))}
  </g>
);
