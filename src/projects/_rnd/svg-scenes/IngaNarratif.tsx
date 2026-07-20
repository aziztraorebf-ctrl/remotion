/**
 * IngaNarratif — Grand Inga, registre ENCRE NARRATIVE version finale.
 * Deux variantes : fond parchemin (#e8dcc0) et fond blanc cassé (#f5f2ec).
 *
 * RÈGLES GGW appliquées :
 * R1 — Zéro chiffre à l'écran
 * R2 — Scène dessinée entière en encre dès f0, couleurs arrivent progressivement
 * R3 — Tout est vivant dès f0 (fleuve ondule, turbine tourne, câble vibre)
 * R4 — Grammaire horizontale : l'œil suit l'électricité gauche → droite → sortie cadre
 * Mécanisme C — les fenêtres du village s'allument or puis s'éteignent (dépossession)
 *
 * Timeline (1440f / 48s @30fps) :
 *  f0      Tout apparaît en encre neutre. Vie permanente active.
 *  f0-60   Stroke-dashoffset : turbine + pylône + maisons se tracent
 *  f60-120 Fleuve se trace + se bleuit (mécanisme A — naît coloré)
 *  f120-200 Turbine reçoit gris-béton (mécanisme B)
 *  f200-300 Câble or se trace gauche→droite (mécanisme B — l'énergie passe)
 *  f300-400 Pylône s'illumine légèrement quand le câble le touche
 *  f400-480 Fenêtres du village s'allument en or (l'espoir)
 *  f480-560 Fenêtres s'éteignent une à une → gris terne (mécanisme C)
 *  f560-700 Câble continue de briller, sort du cadre (la flèche pulse)
 *  f700-900 Tableau final : turbine tourne, câble or, village éteint, fleuve pulse
 *  f900-1200 Respiration — la scène vit dans son état final
 */

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// ── Couleurs ──────────────────────────────────────────────────────────────
const ENCRE      = "#2b2117";
const ENCRE_P    = "#b0a090";   // encre pâle (décor en attente)
const BLEU       = "#2a6fc9";   // fleuve — fort, pas timide
const BLEU_C     = "#6aaee8";   // reflet fleuve
const GRIS_BETON = "#8a8070";   // béton turbine
const OR         = "#e8a020";   // câble / lumière — or franc
const OR_VIF     = "#ffc040";   // fenêtres allumées
const GRIS_MORT  = "#6a6258";   // fenêtres éteintes (mécanisme C)

const W = 1920;
const H = 1080;

// ── Helper interpolate clampé ─────────────────────────────────────────────
const p = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ── Chemins SVG (constants) ───────────────────────────────────────────────
const CABLE_D    = "M 510 470 C 720 280 950 240 1100 310 C 1300 395 1520 480 1920 520";
const CABLE_LEN  = 1520; // longueur approx

const FLEUVE = [
  { d: "M 0 760 C 300 720 600 800 960 755 S 1400 700 1920 740", w: 2,   op: 0.9 },
  { d: "M 0 830 C 280 870 650 800 1000 840 S 1500 800 1920 820", w: 1.5, op: 0.7 },
  { d: "M 0 900 C 350 860 700 920 1050 880 S 1550 860 1920 905", w: 1.5, op: 0.55 },
  { d: "M 0 960 C 400 1010 750 950 1100 980 S 1600 940 1920 970", w: 1,   op: 0.4 },
];

// Maisons : [x, y, scale]
const MAISONS = [
  { x: 1520, y: 660, s: 1.15 },
  { x: 1620, y: 682, s: 0.95 },
  { x: 1710, y: 648, s: 1.2  },
  { x: 1810, y: 692, s: 0.82 },
];

// ── Composant partagé ─────────────────────────────────────────────────────
interface IngaNarratifProps {
  fond?: "parchemin" | "blanc";
}

const IngaNarratifScene: React.FC<IngaNarratifProps> = ({ fond = "parchemin" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const BG = fond === "parchemin" ? "#e8dcc0" : "#f5f2ec";

  // ── Vie permanente (dès f0) ───────────────────────────────────────────
  // Rotation turbine (lente, permanente)
  const turbSpin = f * 0.6;

  // Ondulation fleuve (sin lent)
  const fleuveOnd = Math.sin(f * 0.03) * 6;

  // Pulse câble (une fois tracé)
  const cablePulse = f > 200 ? 0.12 * Math.sin(f * 0.08) : 0;

  // ── Phase 1 : tracé initial (f0-60) ──────────────────────────────────
  // Turbine cercle
  const turbLen  = 1320; // circonférence r=210
  const turbDash = turbLen * (1 - p(f, 0, 50));

  // Pylône (longueur approximative de tous ses traits)
  const pyloneP  = p(f, 10, 65);

  // Maisons tracées en cascade
  const maisonP  = MAISONS.map((_, i) => p(f, 15 + i * 10, 55 + i * 10));

  // ── Phase 2 : fleuve se trace et se bleuit (f60-140) ─────────────────
  const fleuveTraceP = p(f, 60, 110);
  const fleuveBleuP  = p(f, 90, 160);  // mécanisme A — naît coloré

  // ── Phase 3 : turbine se colorise gris-béton (f120-220) ──────────────
  const turbColorP = p(f, 120, 220);
  const turbFill   = `rgba(138,128,112,${turbColorP * 0.42})`;

  // ── Phase 4 : câble or se trace (f200-340) ───────────────────────────
  const cableTraceP = p(f, 200, 340);
  const cableDash   = CABLE_LEN * (1 - cableTraceP);

  // ── Phase 5 : fenêtres s'allument or (f400-480) ──────────────────────
  const fenetreAllumeP = MAISONS.map((_, i) => p(f, 400 + i * 20, 460 + i * 20));

  // ── Phase 6 : mécanisme C — fenêtres s'éteignent (f490-580) ──────────
  const fenetreEteinteP = MAISONS.map((_, i) => p(f, 490 + i * 22, 560 + i * 22));

  // Couleur fenêtre : parchemin → or → gris_mort
  const fenetreCouleur = MAISONS.map((_, i) => {
    const allume  = fenetreAllumeP[i];
    const eteinte = fenetreEteinteP[i];
    if (eteinte > 0.5) return GRIS_MORT;
    if (allume > 0.5)  return OR_VIF;
    return BG;
  });

  // ── Flèche finale qui pulse (f560+) ──────────────────────────────────
  const flecheP   = p(f, 560, 620);
  const flechePulse = f > 620 ? 0.25 + 0.25 * Math.sin(f * 0.1) : flecheP;

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

        {/* ── Cadre double pointillé (signature GGW) ── */}
        <rect x={28} y={28} width={1864} height={1024}
          fill="none" stroke={ENCRE} strokeWidth={1.5}
          strokeDasharray="6 10" opacity={0.4}/>
        <rect x={42} y={42} width={1836} height={996}
          fill="none" stroke={ENCRE} strokeWidth={0.8}
          strokeDasharray="2 6" opacity={0.25}/>

        {/* ══════════ FLEUVE CONGO ══════════ */}
        <clipPath id="fleuveClip">
          <rect x={0} y={0} width={W * fleuveTraceP} height={H}/>
        </clipPath>
        <g clipPath="url(#fleuveClip)">
          {/* Remplissage bleu entre les lignes */}
          <path
            d="M 0 760 C 300 720 600 800 960 755 S 1400 700 1920 740 L 1920 1080 L 0 1080 Z"
            fill={BLEU} opacity={fleuveBleuP * 0.18}
          />
          {FLEUVE.map((fl, i) => (
            <path key={i}
              d={fl.d}
              fill="none"
              stroke={fleuveBleuP > 0.3 ? BLEU : ENCRE}
              strokeWidth={fl.w + (fleuveBleuP > 0.3 ? 0.8 : 0)}
              opacity={fl.op * (0.4 + fleuveBleuP * 0.6)}
              transform={`translate(0, ${fleuveOnd * (i % 2 === 0 ? 1 : -0.6)})`}
            />
          ))}
          {/* Reflet vif */}
          <path
            d="M 0 770 C 400 740 800 780 1200 755 S 1700 730 1920 750"
            fill="none" stroke={BLEU_C} strokeWidth={1.2}
            opacity={fleuveBleuP * 0.5}
            transform={`translate(0, ${fleuveOnd * 0.4})`}
          />
        </g>

        {/* Hachures de terrain (sol entre objets — encre pâle permanente) */}
        <g stroke={ENCRE} strokeWidth={1} opacity={0.07}>
          <path d="M 600 690 C 750 672 900 705 1000 685"/>
          <path d="M 560 728 C 700 710 860 738 980 718"/>
          <path d="M 1260 685 C 1360 670 1450 688 1505 675"/>
          <path d="M 1220 722 C 1330 708 1445 724 1512 712"/>
        </g>

        {/* ══════════ TURBINE ══════════ */}
        {/* Demi-cercle colorisé (mécanisme B) */}
        <path d={`M 300 260 A 210 210 0 0 0 300 680`}
          fill={GRIS_BETON} opacity={turbColorP * 0.38}/>

        {/* Cercle principal */}
        <circle cx={300} cy={470} r={210}
          fill="none" stroke={ENCRE} strokeWidth={3.5}
          strokeDasharray={`${turbLen} ${turbLen}`}
          strokeDashoffset={turbDash}
        />

        {/* Ligne verticale barrage */}
        <line x1={300} y1={200} x2={300} y2={750}
          stroke={ENCRE} strokeWidth={9} strokeLinecap="round"
          opacity={p(f, 0, 40)}
        />

        {/* Pales qui tournent (dès f0) */}
        <g transform={`translate(300, 470) rotate(${turbSpin})`}
          opacity={0.5 + turbColorP * 0.25}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return (
              <line key={i}
                x1={Math.cos(a) * 20} y1={Math.sin(a) * 20}
                x2={Math.cos(a) * 190} y2={Math.sin(a) * 190}
                stroke={turbColorP > 0.5 ? GRIS_BETON : ENCRE}
                strokeWidth={2.5} strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Axe central */}
        <circle cx={300} cy={470} r={22}
          fill={turbColorP > 0.4 ? GRIS_BETON : ENCRE}
          opacity={p(f, 0, 35)}
        />

        {/* Anneau pointillé extérieur */}
        <circle cx={300} cy={470} r={234}
          fill="none" stroke={ENCRE} strokeWidth={1}
          strokeDasharray="8 16" opacity={0.25}
        />

        {/* ══════════ CÂBLE CONDUCTEUR ══════════ */}
        {/* Ombre */}
        <path d={CABLE_D}
          fill="none" stroke={ENCRE} strokeWidth={3} opacity={0.08}
          strokeDasharray={`${CABLE_LEN} ${CABLE_LEN}`}
          strokeDashoffset={cableDash}
          strokeLinecap="round"
          transform="translate(4, 8)"
        />
        {/* Câble principal OR */}
        <path d={CABLE_D}
          fill="none" stroke={OR} strokeWidth={5 + cablePulse * 3}
          strokeDasharray={`${CABLE_LEN} ${CABLE_LEN}`}
          strokeDashoffset={cableDash}
          strokeLinecap="round"
          opacity={0.9}
        />
        {/* Filet secondaire */}
        <path d={CABLE_D}
          fill="none" stroke={OR_VIF} strokeWidth={2}
          strokeDasharray={`${CABLE_LEN} ${CABLE_LEN}`}
          strokeDashoffset={cableDash}
          strokeLinecap="round"
          opacity={0.35}
          transform="translate(0, 10)"
        />

        {/* Point d'attache pylône */}
        {cableTraceP > 0.5 && (
          <circle cx={1100} cy={310} r={9}
            fill={OR} opacity={0.85 + cablePulse}
          />
        )}

        {/* ══════════ PYLÔNE ══════════ */}
        <g opacity={pyloneP}>
          {/* Montants principaux */}
          <line x1={1030} y1={748} x2={1100} y2={80} stroke={ENCRE} strokeWidth={3} strokeLinecap="round"/>
          <line x1={1170} y1={748} x2={1100} y2={80} stroke={ENCRE} strokeWidth={3} strokeLinecap="round"/>

          {/* Traverses */}
          {[[1042,1158,628],[1054,1146,508],[1064,1136,388],[1074,1126,268],[1084,1116,168]].map(([x1,x2,y],i) => (
            <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={ENCRE} strokeWidth={2.2}/>
          ))}

          {/* Diagonales */}
          <g stroke={ENCRE} strokeWidth={1.4} opacity={0.6}>
            <line x1={1042} y1={748} x2={1158} y2={628}/><line x1={1158} y1={748} x2={1042} y2={628}/>
            <line x1={1042} y1={628} x2={1158} y2={508}/><line x1={1158} y1={628} x2={1042} y2={508}/>
            <line x1={1054} y1={508} x2={1146} y2={388}/><line x1={1146} y1={508} x2={1054} y2={388}/>
            <line x1={1064} y1={388} x2={1136} y2={268}/><line x1={1136} y1={388} x2={1064} y2={268}/>
            <line x1={1074} y1={268} x2={1126} y2={168}/><line x1={1126} y1={268} x2={1074} y2={168}/>
          </g>

          {/* Sommet */}
          <line x1={1060} y1={168} x2={1140} y2={168} stroke={ENCRE} strokeWidth={3}/>
          <line x1={1100} y1={80}  x2={1100} y2={168} stroke={ENCRE} strokeWidth={2.5}/>

          {/* Base */}
          <rect x={1008} y={748} width={184} height={14}
            fill={ENCRE} opacity={0.2} rx={2}/>
        </g>

        {/* ══════════ VILLAGE ══════════ */}
        {MAISONS.map((m, i) => {
          const traced = maisonP[i];
          const coulFen = fenetreCouleur[i];
          const glow    = fenetreAllumeP[i] > 0.5 && fenetreEteinteP[i] < 0.3;
          const W2 = 60 * m.s;
          const H2 = 48 * m.s;

          return (
            <g key={i} transform={`translate(${m.x}, ${m.y})`} opacity={traced}>
              {/* Ombre sol */}
              <ellipse cx={W2/2} cy={H2 + 8} rx={W2 * 0.55} ry={6}
                fill={ENCRE} opacity={0.05}/>
              {/* Corps maison */}
              <rect x={0} y={0} width={W2} height={H2}
                fill="none" stroke={ENCRE} strokeWidth={2 * m.s}/>
              {/* Toit */}
              <polygon points={`${-6*m.s},0 ${W2/2},${-22*m.s} ${W2+6*m.s},0`}
                fill="none" stroke={ENCRE} strokeWidth={1.8 * m.s}/>
              {/* Fenêtre gauche */}
              {glow && (
                <rect x={W2*0.18 - 5} y={H2*0.28 - 5} width={W2*0.22 + 10} height={H2*0.28 + 10}
                  fill={OR_VIF} opacity={0.2} rx={2}/>
              )}
              <rect x={W2*0.18} y={H2*0.28} width={W2*0.22} height={H2*0.28}
                fill={coulFen} stroke={ENCRE} strokeWidth={1}/>
              {/* Fenêtre droite */}
              {glow && (
                <rect x={W2*0.58 - 5} y={H2*0.28 - 5} width={W2*0.22 + 10} height={H2*0.28 + 10}
                  fill={OR_VIF} opacity={0.2} rx={2}/>
              )}
              <rect x={W2*0.58} y={H2*0.28} width={W2*0.22} height={H2*0.28}
                fill={coulFen} stroke={ENCRE} strokeWidth={1}/>
              {/* Croix d'extinction (mécanisme C) */}
              {fenetreEteinteP[i] > 0.5 && (
                <g opacity={fenetreEteinteP[i] * 0.6} stroke={ENCRE} strokeWidth={1.2}>
                  <line x1={W2*0.2} y1={H2*0.3} x2={W2*0.38} y2={H2*0.54}/>
                  <line x1={W2*0.38} y1={H2*0.3} x2={W2*0.2} y2={H2*0.54}/>
                  <line x1={W2*0.6} y1={H2*0.3} x2={W2*0.78} y2={H2*0.54}/>
                  <line x1={W2*0.78} y1={H2*0.3} x2={W2*0.6} y2={H2*0.54}/>
                </g>
              )}
            </g>
          );
        })}

        {/* Ligne de sol village */}
        <path d="M 1505 745 C 1610 735 1720 748 1870 738"
          fill="none" stroke={ENCRE} strokeWidth={1} opacity={0.22}
        />

        {/* ══════════ FLÈCHE — l'électricité s'exile ══════════ */}
        <g opacity={flechePulse}>
          {/* Trait final du câble → hors cadre */}
          <path d="M 1860 518 L 1915 524" fill="none" stroke={OR} strokeWidth={5}/>
          {/* Pointe de flèche */}
          <polygon
            points="1900,513 1920,524 1900,535"
            fill={OR} opacity={0.9}
          />
        </g>

      </svg>
    </AbsoluteFill>
  );
};

// ── Exports des deux versions ─────────────────────────────────────────────
export const IngaNarratifParchemin: React.FC = () => <IngaNarratifScene fond="parchemin"/>;
export const IngaNarratifBlanc: React.FC     = () => <IngaNarratifScene fond="blanc"/>;
export const INGA_NARRATIF_FRAMES = 1200;
