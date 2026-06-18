/**
 * PROTO HERA #5 — TIMELINE / FICHES (famille F decodee de hera.video, reference V10 "Cyril Radcliffe 1947").
 *
 * Famille F = frise chronologique : axe horizontal + jalons (medaillon rond + date + fiche texte) qui
 * apparaissent en sequence. C'etait notre famille partielle. Registre = carte estompee (coherent avec proto #2).
 *
 * NOTE ASSETS : V10 utilise de vraies PHOTOS rondes N&B. Ici je mets des MEDAILLONS (cercle navy + initiale or)
 * pour prouver la MECANIQUE sans asset paye. En prod : remplacer par vraies photos (clip rond) — voir signalement.
 *
 * Grammaire Hera : 1 jalon a la fois qui s'allume · labels directs (date + 1 phrase) · 1 geste (medaillon pop + ligne qui avance).
 *
 * Sequence (~7s @30fps) : la ligne se trace, 3 jalons pop en sequence (date + medaillon + fiche).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { WEST_AFRICA_PATHS, WEST_AFRICA_VIEWBOX } from "./westAfricaPath";

const W = 1920;
const H = 1080;

const NAVY = "#16213a";
const NAVY_MAP = "#222d44";
const NAVY_LINE = "#39476680";
const GOLD = "#c8a951";
const GOLD_DARK = "#a8862f";
const IVORY = "#f4efe4";
const DISPLAY = "Cinzel, 'Playfair Display', Georgia, serif";
const NUM = "'Bebas Neue','Impact',sans-serif";
const SANS = "'Inter','Helvetica Neue',Arial,sans-serif";

type Milestone = { date: string; initial: string; title: string; desc: string };
const MS: Milestone[] = [
  { date: "1960", initial: "I", title: "Indépendances", desc: "La plupart des États accèdent à la souveraineté." },
  { date: "1994", initial: "F", title: "Dévaluation du franc CFA", desc: "Le pouvoir d'achat divisé par deux du jour au lendemain." },
  { date: "2023", initial: "A", title: "Alliance des États du Sahel", desc: "Mali, Burkina, Niger quittent la CEDEAO." },
];

export const ProtoHera_Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineY = 540;
  const x0 = 280;
  const x1 = W - 280;
  const span = x1 - x0;
  const positions = MS.map((_, i) => x0 + (span * i) / (MS.length - 1));

  const lineGrow = spring({ fps, frame: Math.max(0, frame - 18), config: { damping: 44, stiffness: 30 } });
  const mapOp = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* carte estompee de fond */}
      <svg width={W} height={H} viewBox={WEST_AFRICA_VIEWBOX} preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, opacity: mapOp * 0.5 }}>
        {WEST_AFRICA_PATHS.map((p) => (
          <path key={p.name} d={p.d} fill={NAVY_MAP} stroke={NAVY_LINE} strokeWidth={1} />
        ))}
      </svg>
      <AbsoluteFill style={{ background: "rgba(15,22,40,0.45)" }} />

      {/* titre */}
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", fontFamily: DISPLAY, fontSize: 56, fontWeight: 700, color: IVORY, opacity: mapOp }}>
        Trois ruptures, <span style={{ color: GOLD }}>une trajectoire</span>
      </div>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* ligne de temps qui se trace */}
        <line x1={x0} y1={lineY} x2={x0 + span * lineGrow} y2={lineY} stroke={GOLD} strokeWidth={4} strokeLinecap="round" opacity={0.85} />

        {MS.map((m, i) => {
          const delay = 40 + i * 34;
          const pop = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 12, stiffness: 180 } });
          if (pop <= 0.001) return null;
          const cx = positions[i];
          const r = 58 * Math.min(1, pop);
          return (
            <g key={m.date}>
              {/* tige verticale du medaillon a la ligne */}
              <line x1={cx} y1={lineY} x2={cx} y2={lineY - 120} stroke={GOLD} strokeWidth={2} opacity={0.5 * Math.min(1, pop)} />
              {/* medaillon */}
              <circle cx={cx} cy={lineY - 180} r={r} fill={NAVY} stroke={GOLD} strokeWidth={4} />
              <text x={cx} y={lineY - 180 + 26} textAnchor="middle" fontFamily={DISPLAY} fontSize={64} fill={GOLD} opacity={pop}>
                {m.initial}
              </text>
              {/* point sur la ligne */}
              <circle cx={cx} cy={lineY} r={9} fill={GOLD} />
            </g>
          );
        })}
      </svg>

      {/* fiches texte (date + titre + desc) sous la ligne */}
      {MS.map((m, i) => {
        const delay = 40 + i * 34;
        const op = interpolate(frame, [delay + 8, delay + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const up = interpolate(frame, [delay + 8, delay + 22], [18, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const cx = positions[i];
        return (
          <div
            key={m.date}
            style={{
              position: "absolute",
              left: cx,
              top: lineY + 50,
              width: 380,
              transform: `translateX(-50%) translateY(${up}px)`,
              opacity: op,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: NUM, fontSize: 64, color: GOLD, lineHeight: 1 }}>{m.date}</div>
            <div style={{ fontFamily: SANS, fontSize: 30, fontWeight: 800, color: IVORY, marginTop: 8 }}>{m.title}</div>
            <div style={{ fontFamily: SANS, fontSize: 24, color: "#c2cad9", marginTop: 8, lineHeight: 1.3 }}>{m.desc}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export default ProtoHera_Timeline;
