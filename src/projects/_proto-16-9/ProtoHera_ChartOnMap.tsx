/**
 * PROTO HERA #2 — CHART SUR CARTE (famille B decodee de hera.video, reference V08 "EU Military Spending").
 *
 * Famille B = la carte sert de FOND estompe, un chart se construit PAR-DESSUS. C'etait notre point faible
 * (on n'avait que WarMapDimmedOverlay, pensee pour la War-Map). Ici : registre "carte estompee" propre + chart.
 *
 * Reference V08 : carte Europe gris fonce + axe Y EUR100B->EUR300B + barre bleue qui monte + titre en pastille.
 * Appropriation Souverain : carte Afrique de l'Ouest (vraie geo d3-geo) estompee navy + barre OR + titre pastille navy.
 * Grammaire Hera : 1 idee/ecran · axe lisible · 1 geste (barre qui pousse) · pause sur le chiffre.
 *
 * Sequence (~6s @30fps) :
 *   0-20   : la carte apparait (fade), estompee
 *   20-40  : axe Y + annees + titre pastille
 *   40-130 : la barre OR monte (spring) + count-up de la valeur au sommet
 *   130+   : pause/respiration sur le chiffre cle
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { WEST_AFRICA_PATHS, WEST_AFRICA_VIEWBOX } from "./westAfricaPath";

const W = 1920;
const H = 1080;

const NAVY = "#16213a";
const NAVY_MAP = "#27344f"; // terre estompee
const NAVY_LINE = "#41506e"; // contours pays pales
const GOLD = "#c8a951";
const GOLD_DARK = "#a8862f";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

// la carte est generee dans une boite 1600x900 ; on l'etire plein cadre
const MAP_VB = WEST_AFRICA_VIEWBOX;

export const ProtoHera_ChartOnMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const axisOp = interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // axe Y : 0 -> 30 (Mds $), barre cible = 24
  const TARGET = 24;
  const AXIS_MAX = 30;
  const plotX = 230;
  const plotTop = 200;
  const plotBot = 880;
  const plotH = plotBot - plotTop;
  const barW = 150;

  const grow = spring({ fps, frame: Math.max(0, frame - 40), config: { damping: 30, stiffness: 42 } });
  const barH = plotH * (TARGET / AXIS_MAX) * grow;

  // count-up cale sur la croissance de la barre
  const countT = interpolate(frame, [40, 124], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const eased = 1 - Math.pow(1 - countT, 3);
  const val = (eased * TARGET).toFixed(1);

  const landPop = spring({ fps, frame: Math.max(0, frame - 124), config: { damping: 9, stiffness: 200 } });
  const breathe = frame > 140 ? 1 + 0.02 * Math.sin((frame - 140) * 0.15) : 1;
  const numScale = (1 + 0.06 * landPop) * breathe;

  const ticks = [0, 10, 20, 30];

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* CARTE estompee plein cadre */}
      <svg
        width={W}
        height={H}
        viewBox={MAP_VB}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, opacity: mapOp }}
      >
        {WEST_AFRICA_PATHS.map((p) => (
          <path key={p.name} d={p.d} fill={NAVY_MAP} stroke={NAVY_LINE} strokeWidth={1.2} />
        ))}
      </svg>

      {/* voile pour assombrir encore (la carte = contexte, pas sujet) */}
      <AbsoluteFill style={{ background: "rgba(15,22,40,0.42)" }} />

      {/* CHART par-dessus */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* axe Y + grille horizontale legere */}
        <g opacity={axisOp}>
          {ticks.map((t) => {
            const y = plotBot - plotH * (t / AXIS_MAX);
            return (
              <g key={t}>
                <line x1={plotX - 20} y1={y} x2={W - 120} y2={y} stroke="#ffffff" strokeWidth={1} opacity={0.08} />
                <text x={plotX - 38} y={y + 10} textAnchor="end" fontFamily={SANS} fontSize={28} fill="#cdd3df">
                  {t === 0 ? "$0" : `$${t}B`}
                </text>
              </g>
            );
          })}
        </g>

        {/* barre OR qui monte */}
        <rect x={plotX} y={plotBot - barH} width={barW} height={barH} fill={GOLD} rx={4} />
        {/* annee sous la barre */}
        <text x={plotX + barW / 2} y={plotBot + 44} textAnchor="middle" fontFamily={SANS} fontSize={30} fontWeight={700} fill="#e7ecf5" opacity={axisOp}>
          2025
        </text>
      </svg>

      {/* TITRE en pastille navy (signature V08) */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: axisOp,
          background: NAVY,
          border: `1.5px solid ${GOLD}`,
          padding: "14px 34px",
          borderRadius: 10,
          fontFamily: SANS,
          fontSize: 40,
          fontWeight: 800,
          color: "#f4efe4",
          letterSpacing: "0.5px",
          boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
        }}
      >
        Revenus pétroliers — Afrique de l'Ouest
      </div>

      {/* CHIFFRE cle au sommet de la barre (count-up + pause) */}
      <div
        style={{
          position: "absolute",
          left: plotX + barW / 2,
          top: plotBot - barH - 80,
          transform: `translateX(-50%) scale(${numScale})`,
          opacity: interpolate(frame, [44, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          fontFamily: NUM,
          fontSize: 88,
          color: GOLD,
          lineHeight: 1,
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        ${val}B
      </div>
    </AbsoluteFill>
  );
};

export default ProtoHera_ChartOnMap;
