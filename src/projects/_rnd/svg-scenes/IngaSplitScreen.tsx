import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// ── Inga Split-Screen — Jour vs Nuit, câble or traversant les deux réalités ──
// Gauche (x 0..960)  : turbine active, ciel bleu, soleil, fleuve, palmiers
// Droite (x 960..1920): maisons bougies, ciel étoilé, turbine arrêtée en fond
// Câble or : tracé progressif f=30→180, traverse tout le cadre y~420
// Sous-titres : 3 plages d'apparition/disparition

export const INGA_SPLIT_FRAMES = 600;

const W = 1920;
const H = 1080;
const MID = W / 2;

// ── Helpers ──────────────────────────────────────────────────────────────────

function cl(f: number, a: number, b: number, from: number, to: number): number {
  return interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function osc(f: number, freq: number, amp: number, phase = 0): number {
  return Math.sin((f / freq) * Math.PI * 2 + phase) * amp;
}

function hexToRgb(h: string): [number, number, number] {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

function lerpC(f: number, frames: number[], colors: string[]): string {
  if (f <= frames[0]) return colors[0];
  if (f >= frames[frames.length - 1]) return colors[colors.length - 1];
  for (let i = 0; i < frames.length - 1; i++) {
    if (f >= frames[i] && f <= frames[i + 1]) {
      const t = (f - frames[i]) / (frames[i + 1] - frames[i]);
      const [r1, g1, b1] = hexToRgb(colors[i]);
      const [r2, g2, b2] = hexToRgb(colors[i + 1]);
      return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
    }
  }
  return colors[colors.length - 1];
}

// ── Côté GAUCHE — Jour ───────────────────────────────────────────────────────

const LeftSide: React.FC<{ f: number }> = ({ f }) => {
  const turbineAngle = (f * 0.5) % 360;

  // Nuages dérivent lentement
  const cloud1X = 80 + osc(f, 420, 25, 0);
  const cloud2X = 300 + osc(f, 600, 18, 1.2);
  const cloud3X = 640 + osc(f, 500, 20, 2.5);

  // Ombres des aubes
  const AUBE_COUNT = 6;
  const cx = 380;
  const cy = 500;
  const R = 220;

  const aubes = Array.from({ length: AUBE_COUNT }, (_, i) => {
    const angleRad = ((turbineAngle + (360 / AUBE_COUNT) * i) * Math.PI) / 180;
    const tipX = cx + Math.cos(angleRad) * R;
    const tipY = cy + Math.sin(angleRad) * R;
    const baseAngle1 = angleRad - 0.18;
    const baseAngle2 = angleRad + 0.18;
    const baseR = 32;
    const b1x = cx + Math.cos(baseAngle1) * baseR;
    const b1y = cy + Math.sin(baseAngle1) * baseR;
    const b2x = cx + Math.cos(baseAngle2) * baseR;
    const b2y = cy + Math.sin(baseAngle2) * baseR;
    return `M${b1x},${b1y} L${tipX},${tipY} L${b2x},${b2y} Z`;
  });

  return (
    <g clipPath="url(#leftClip)">
      {/* Fond ciel dégradé */}
      <defs>
        <linearGradient id="skyDayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5aaad8" />
          <stop offset="100%" stopColor="#d8eeee" />
        </linearGradient>
        <radialGradient id="sunHaloGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8d820" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f8d820" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect x="0" y="0" width={MID} height={H} fill="url(#skyDayGrad)" />

      {/* Halo soleil */}
      <ellipse cx={180} cy={120} rx={100} ry={100} fill="url(#sunHaloGrad)" filter="url(#softBlur)" />
      {/* Soleil */}
      <circle cx={180} cy={120} r={55} fill="#f8d820" />

      {/* Nuages */}
      {[
        { x: cloud1X, y: 80 },
        { x: cloud2X, y: 55 },
        { x: cloud3X, y: 100 },
      ].map((c, i) => (
        <g key={i} transform={`translate(${c.x},${c.y})`}>
          <ellipse rx={70} ry={28} fill="white" opacity={0.85} />
          <ellipse cx={-35} cy={8} rx={42} ry={20} fill="white" opacity={0.75} />
          <ellipse cx={38} cy={6} rx={38} ry={18} fill="white" opacity={0.75} />
        </g>
      ))}

      {/* Terrain vert */}
      <rect x={0} y={560} width={MID} height={H - 560} fill="#5a8a30" />

      {/* Fleuve */}
      <ellipse cx={300} cy={690} rx={290} ry={38} fill="#2a7abf" opacity={0.82} />

      {/* Pylône - acier léger */}
      <g opacity={0.9}>
        <line x1={750} y1={560} x2={730} y2={280} stroke="#b0b8c0" strokeWidth={5} />
        <line x1={750} y1={560} x2={770} y2={280} stroke="#b0b8c0" strokeWidth={5} />
        {[340, 400, 470].map((y, i) => (
          <line key={i} x1={735} y1={y} x2={765} y2={y} stroke="#b0b8c0" strokeWidth={3} />
        ))}
        <line x1={726} y1={280} x2={774} y2={280} stroke="#b0b8c0" strokeWidth={4} />
        <line x1={710} y1={290} x2={790} y2={290} stroke="#b0b8c0" strokeWidth={3} />
      </g>

      {/* Palmiers */}
      {[
        { x: 120, h: 90 },
        { x: 820, h: 80 },
        { x: 870, h: 70 },
      ].map((p, i) => (
        <g key={i}>
          <rect x={p.x - 5} y={560 - p.h} width={10} height={p.h} fill="#7a5a20" />
          {[-40, -20, 0, 20, 40].map((dx, j) => (
            <ellipse
              key={j}
              cx={p.x + dx * 0.6}
              cy={560 - p.h + dx * 0.3}
              rx={28}
              ry={8}
              fill="#2a6820"
              opacity={0.85}
              transform={`rotate(${dx * 1.5}, ${p.x + dx * 0.6}, ${560 - p.h + dx * 0.3})`}
            />
          ))}
        </g>
      ))}

      {/* Rotor — moyeu */}
      <circle cx={cx} cy={cy} r={28} fill="#c8d0d8" stroke="#8090a0" strokeWidth={4} />

      {/* Turbine — aubes */}
      {aubes.map((d, i) => (
        <path key={i} d={d} fill="#8090a0" opacity={0.88} />
      ))}

      {/* Turbine — mat (du moyeu jusqu'au sol) */}
      <rect x={cx - 14} y={cy} width={28} height={H - cy} fill="#a0a8b0" />
    </g>
  );
};

// ── Côté DROIT — Nuit ────────────────────────────────────────────────────────

const STARS: Array<{ x: number; y: number; r: number; ph: number }> = Array.from(
  { length: 20 },
  (_, i) => ({
    x: 970 + ((i * 47 + 13) % 900),
    y: 20 + ((i * 83 + 7) % 320),
    r: 1 + (i % 3) * 0.6,
    ph: i * 0.8,
  })
);

const HOUSES: Array<{ x: number; y: number; w: number; h: number }> = [
  { x: 1060, y: 530, w: 160, h: 140 },
  { x: 1280, y: 510, w: 200, h: 160 },
  { x: 1520, y: 525, w: 170, h: 145 },
  { x: 1730, y: 540, w: 140, h: 130 },
];

const RightSide: React.FC<{ f: number }> = ({ f }) => {
  const houseEnterOp = cl(f, 30, 90, 0, 1);
  const candleEnterOp = cl(f, 120, 240, 0, 1);

  return (
    <g clipPath="url(#rightClip)">
      <defs>
        {HOUSES.map((house, i) => (
          <radialGradient key={i} id={`candleGlow${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffcc60" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffcc60" stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient id="moonGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f8f0d0" />
          <stop offset="100%" stopColor="#c8c0a0" />
        </radialGradient>
      </defs>

      {/* Fond nuit */}
      <rect x={MID} y={0} width={MID} height={H} fill="#0a0818" />

      {/* Étoiles scintillantes */}
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={0.5 + osc(f, 80 + i * 7, 0.35, s.ph)}
        />
      ))}

      {/* Lune */}
      <circle cx={1760} cy={130} r={48} fill="url(#moonGrad)" />
      <circle cx={1778} cy={118} r={40} fill="#0a0818" />

      {/* Terrain nuit */}
      <rect x={MID} y={570} width={MID} height={H - 570} fill="#2a1808" />

      {/* Fleuve nuit */}
      <ellipse cx={1650} cy={710} rx={260} ry={32} fill="#0a1828" opacity={0.75} />

      {/* Turbine petite, arrêtée, très sombre */}
      <g opacity={0.38}>
        <circle cx={1010} cy={500} r={8} fill="#3a2a18" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i * 60 * Math.PI) / 180;
          const tx = 1010 + Math.cos(a) * 70;
          const ty = 500 + Math.sin(a) * 70;
          const b1x = 1010 + Math.cos(a - 0.18) * 10;
          const b1y = 500 + Math.sin(a - 0.18) * 10;
          const b2x = 1010 + Math.cos(a + 0.18) * 10;
          const b2y = 500 + Math.sin(a + 0.18) * 10;
          return <path key={i} d={`M${b1x},${b1y} L${tx},${ty} L${b2x},${b2y} Z`} fill="#3a2a18" />;
        })}
        <rect x={1006} y={500} width={8} height={80} fill="#3a2a18" />
      </g>

      {/* Maisons */}
      {HOUSES.map((house, i) => {
        const flickerFlame = 0.7 + osc(f, 12 + i * 3, 0.28, i * 1.1);
        const flickerGlow = 0.4 + osc(f, 18 + i * 4, 0.22, i * 2.3);

        return (
          <g key={i} opacity={houseEnterOp}>
            {/* Mur */}
            <rect
              x={house.x}
              y={house.y}
              width={house.w}
              height={house.h}
              fill="#4a3020"
              stroke="#c8a060"
              strokeWidth={1.5}
            />
            {/* Toit plat */}
            <rect
              x={house.x - 8}
              y={house.y - 14}
              width={house.w + 16}
              height={16}
              fill="#3a2010"
              stroke="#c8a060"
              strokeWidth={1}
            />

            {/* Fenêtre gauche — halo bougie */}
            <ellipse
              cx={house.x + house.w * 0.3}
              cy={house.y + house.h * 0.55}
              rx={38}
              ry={32}
              fill={`url(#candleGlow${i})`}
              opacity={flickerGlow * candleEnterOp}
            />
            {/* Fenêtre droite — halo bougie */}
            <ellipse
              cx={house.x + house.w * 0.7}
              cy={house.y + house.h * 0.55}
              rx={38}
              ry={32}
              fill={`url(#candleGlow${i})`}
              opacity={flickerGlow * 0.85 * candleEnterOp}
            />

            {/* Fenêtre gauche */}
            <rect
              x={house.x + house.w * 0.18}
              y={house.y + house.h * 0.38}
              width={house.w * 0.22}
              height={house.h * 0.32}
              fill="#1a0e06"
              stroke="#c8a060"
              strokeWidth={1}
            />
            {/* Flamme gauche */}
            <ellipse
              cx={house.x + house.w * 0.29}
              cy={house.y + house.h * 0.52}
              rx={4}
              ry={7 * flickerFlame}
              fill="#ffcc60"
              opacity={candleEnterOp}
            />

            {/* Fenêtre droite */}
            <rect
              x={house.x + house.w * 0.58}
              y={house.y + house.h * 0.38}
              width={house.w * 0.22}
              height={house.h * 0.32}
              fill="#1a0e06"
              stroke="#c8a060"
              strokeWidth={1}
            />
            {/* Flamme droite */}
            <ellipse
              cx={house.x + house.w * 0.69}
              cy={house.y + house.h * 0.52}
              rx={4}
              ry={7 * flickerFlame * 0.9}
              fill="#ffcc60"
              opacity={candleEnterOp}
            />

            {/* Porte */}
            <rect
              x={house.x + house.w * 0.42}
              y={house.y + house.h * 0.62}
              width={house.w * 0.16}
              height={house.h * 0.38}
              fill="#2a1808"
              stroke="#c8a060"
              strokeWidth={1}
            />
          </g>
        );
      })}
    </g>
  );
};

// ── Câble or — élément hero ──────────────────────────────────────────────────

const GoldenCable: React.FC<{ f: number }> = ({ f }) => {
  const dashOffset = cl(f, 30, 180, 1920, 0);

  // Arc légèrement incurvé, y~420
  const cablePath = `M0,425 Q480,395 960,420 Q1440,445 1920,415`;

  // Flèche pulsante à l'extrémité droite
  const arrowPulse = 0.7 + osc(f, 45, 0.3, 0);
  const arrowVisible = f > 180 ? arrowPulse : 0;

  return (
    <g>
      {/* Halo large */}
      <path
        d={cablePath}
        fill="none"
        stroke="#e8c030"
        strokeWidth={28}
        opacity={0.09}
        strokeLinecap="round"
        strokeDasharray="1920 1920"
        strokeDashoffset={dashOffset}
      />
      {/* Câble principal */}
      <path
        d={cablePath}
        fill="none"
        stroke="#e8c030"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray="1920 1920"
        strokeDashoffset={dashOffset}
      />
      {/* Reflet */}
      <path
        d={cablePath}
        fill="none"
        stroke="white"
        strokeWidth={1.5}
        opacity={0.22}
        strokeLinecap="round"
        strokeDasharray="1920 1920"
        strokeDashoffset={dashOffset}
      />

      {/* Flèche pulsante */}
      <g opacity={arrowVisible}>
        <polygon
          points="1910,415 1892,408 1892,422"
          fill="#e8c030"
        />
        <polygon
          points="1910,415 1892,408 1892,422"
          fill="white"
          opacity={0.3}
        />
      </g>
    </g>
  );
};

// ── Ligne de séparation centrale ──────────────────────────────────────────────

const CenterDivider: React.FC<{ f: number }> = ({ f }) => {
  const lineOp = 0.7 + osc(f, 90, 0.18, 0);

  return (
    <g>
      <defs>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line
        x1={MID}
        y1={0}
        x2={MID}
        y2={H}
        stroke="#e8dcc0"
        strokeWidth={2}
        filter="url(#lineGlow)"
        opacity={lineOp}
      />
    </g>
  );
};

// ── Sous-titres ───────────────────────────────────────────────────────────────

const SUBTITLES: Array<{ from: number; to: number; text: string }> = [
  { from: 20, to: 160, text: "La turbine produit. L'énergie part." },
  { from: 200, to: 350, text: "À quelques kilomètres — des bougies." },
  { from: 400, to: 560, text: "Le câble passe entre les deux." },
];

const Subtitles: React.FC<{ f: number }> = ({ f }) => {
  const active = SUBTITLES.find((s) => f >= s.from && f <= s.to);
  if (!active) return null;

  const fadeIn = cl(f, active.from, active.from + 12, 0, 1);
  const fadeOut = cl(f, active.to - 12, active.to, 1, 0);
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <text
      x={W / 2}
      y={H - 80}
      textAnchor="middle"
      fontFamily="'Helvetica Neue', Arial, sans-serif"
      fontSize={42}
      fontWeight="600"
      fill="white"
      opacity={opacity}
      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.9))" }}
    >
      {active.text}
    </text>
  );
};

// ── Composition principale ────────────────────────────────────────────────────

export const IngaSplitScreen: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#0a0818" }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ display: "block" }}
      >
        <defs>
          <clipPath id="leftClip">
            <rect x={0} y={0} width={MID} height={H} />
          </clipPath>
          <clipPath id="rightClip">
            <rect x={MID} y={0} width={MID} height={H} />
          </clipPath>
        </defs>

        <LeftSide f={f} />
        <RightSide f={f} />
        <GoldenCable f={f} />
        <CenterDivider f={f} />
        <Subtitles f={f} />
      </svg>
    </AbsoluteFill>
  );
};
