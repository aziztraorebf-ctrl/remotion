import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// Demonstration : noir pur (#050208) vs bleu-nuit (#0d1b2a)
// Meme silhouette, meme etoiles, meme lune — seul le fond change
// Objectif : montrer la lisibilite en plein soleil (contraste percu)

const W = 1920;
const H = 1080;
const HALF = W / 2;
const GROUND_Y = H * 0.78;

// Palette A — noir pur (actuel)
const A_BG      = "#050208";
const A_DARK    = "#0a0610";
const A_SIL     = "#0e0a18";

// Palette B — bleu nuit (propose)
const B_BG      = "#0d1b2a";
const B_DARK    = "#162436";
const B_SIL     = "#1c2e4a";

// Communs
const GLOW_WARM = "#ff9933";
const GLOW_COOL = "#a0b8d8";
const STAR_A    = "#c8d0e8";
const STAR_B    = "#d8e8ff";

function ci(frame: number, input: number[], output: number[]): number {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Composants partagés ───────────────────────────────────────

const Silhouette: React.FC<{ x: number; sil: string; glow: string }> = ({ x, sil, glow }) => {
  const h = 160;
  const headR = h * 0.13;
  const torsoH = h * 0.32;
  const robeH  = h * 0.55;
  const w      = h * 0.26;
  const y = GROUND_Y;

  return (
    <g>
      {/* Halo warm sous le personnage */}
      <ellipse cx={x} cy={y} rx={60} ry={16} fill={GLOW_WARM} opacity={0.18} />

      {/* Robe */}
      <path
        d={`M${x - w * 0.6},${y} Q${x - w * 0.8},${y - robeH * 0.4} ${x - w * 0.3},${y - robeH} L${x + w * 0.3},${y - robeH} Q${x + w * 0.8},${y - robeH * 0.4} ${x + w * 0.6},${y} Z`}
        fill={sil}
      />
      {/* Torse */}
      <rect
        x={x - w * 0.38} y={y - robeH - torsoH}
        width={w * 0.76} height={torsoH}
        rx={4} fill={sil}
      />
      {/* Capuchon */}
      <path
        d={`M${x - w * 0.5},${y - robeH - torsoH + 8} Q${x - w * 0.7},${y - robeH - torsoH - h * 0.18} ${x},${y - robeH - torsoH - headR * 2.2} Q${x + w * 0.7},${y - robeH - torsoH - h * 0.18} ${x + w * 0.5},${y - robeH - torsoH + 8} Z`}
        fill={sil}
      />
      {/* Tete */}
      <circle
        cx={x} cy={y - robeH - torsoH - headR * 0.6}
        r={headR} fill={sil}
      />
      {/* Yeux lumineux */}
      <circle cx={x - 6} cy={y - robeH - torsoH - headR * 0.7} r={2.5} fill={glow} opacity={0.9} />
      <circle cx={x + 6} cy={y - robeH - torsoH - headR * 0.7} r={2.5} fill={glow} opacity={0.9} />

      {/* Bras droit leve */}
      <line
        x1={x + w * 0.38} y1={y - robeH - torsoH * 0.5}
        x2={x + w * 0.85} y2={y - robeH - torsoH * 1.05}
        stroke={sil} strokeWidth={10} strokeLinecap="round"
      />
    </g>
  );
};

const Stars: React.FC<{ frame: number; baseX: number; color: string }> = ({ frame, baseX, color }) => {
  const stars: { rx: number; ry: number; r: number; phase: number }[] = [
    { rx: 120, ry: 90,  r: 2.5, phase: 0 },
    { rx: 280, ry: 60,  r: 3.5, phase: 1.1 },
    { rx: 450, ry: 110, r: 2.0, phase: 2.3 },
    { rx: 600, ry: 75,  r: 3.0, phase: 0.7 },
    { rx: 750, ry: 95,  r: 2.8, phase: 3.1 },
    { rx: 850, ry: 55,  r: 2.2, phase: 1.8 },
    { rx: 160, ry: 180, r: 2.0, phase: 2.7 },
    { rx: 380, ry: 200, r: 2.5, phase: 0.4 },
    { rx: 570, ry: 160, r: 3.2, phase: 1.5 },
    { rx: 700, ry: 195, r: 2.0, phase: 3.8 },
    { rx: 820, ry: 175, r: 2.8, phase: 2.1 },
    { rx: 350, ry: 310, r: 2.2, phase: 0.9 },
    { rx: 500, ry: 280, r: 3.0, phase: 3.4 },
    { rx: 650, ry: 320, r: 2.4, phase: 1.2 },
  ];

  return (
    <g>
      {stars.map((s, i) => {
        const twinkle = 0.65 + 0.35 * Math.sin(frame * 0.06 + s.phase);
        return (
          <circle
            key={i}
            cx={baseX + s.rx} cy={s.ry}
            r={s.r} fill={color} opacity={twinkle}
          />
        );
      })}
    </g>
  );
};

const Moon: React.FC<{ baseX: number; moonfill: string; glowColor: string }> = ({ baseX, moonfill, glowColor }) => (
  <g>
    <circle cx={baseX + 700} cy={160} r={50} fill={glowColor} opacity={0.15} filter="url(#cc-halo)" />
    <circle cx={baseX + 700} cy={160} r={38} fill={moonfill} />
    <circle cx={baseX + 714} cy={154} r={30} fill="currentColor" />
  </g>
);

const Label: React.FC<{ x: number; title: string; sub: string; col: string }> = ({ x, title, sub, col }) => (
  <g>
    <text x={x} y={70} textAnchor="middle" fill={col} fontSize={36} fontWeight="bold" fontFamily="system-ui, sans-serif">
      {title}
    </text>
    <text x={x} y={108} textAnchor="middle" fill={col} fontSize={22} fontFamily="monospace" opacity={0.7}>
      {sub}
    </text>
  </g>
);

const Verdict: React.FC<{ x: number; frame: number; color: string; text: string }> = ({ x, frame, color, text }) => {
  const opacity = ci(frame, [90, 120], [0, 1]);
  return (
    <text x={x} y={H - 60} textAnchor="middle" fill={color} fontSize={28}
      fontFamily="system-ui, sans-serif" opacity={opacity} fontStyle="italic">
      {text}
    </text>
  );
};

const Divider: React.FC = () => (
  <line x1={HALF} y1={0} x2={HALF} y2={H} stroke="#ffffff" strokeWidth={1.5} opacity={0.25} />
);

// ─── Composition principale ────────────────────────────────────

export const ColorComparison: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = ci(frame, [0, 20], [0, 1]);

  // Animation lente de la lune (descente subtile sur 5s)
  const moonShift = ci(frame, [0, 150], [0, 30]);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="cc-halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="cc-blur-sm">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* ── Cote A : noir pur ─────────────── */}
        <rect x={0} y={0} width={HALF} height={H} fill={A_BG} />
        <clipPath id="clip-left">
          <rect x={0} y={0} width={HALF} height={H} />
        </clipPath>
        <g clipPath="url(#clip-left)">
          {/* Horizon gradient */}
          <rect x={0} y={GROUND_Y - 80} width={HALF} height={80} fill={A_DARK} opacity={0.6} />
          {/* Sol */}
          <rect x={0} y={GROUND_Y} width={HALF} height={H - GROUND_Y} fill={A_DARK} />

          {/* Etoiles */}
          <Stars frame={frame} baseX={0} color={STAR_A} />

          {/* Lune */}
          <g transform={`translate(0, ${moonShift})`}>
            <circle cx={700} cy={160} r={50} fill={A_DARK} opacity={0.2} filter="url(#cc-halo)" />
            <circle cx={700} cy={160} r={38} fill={A_DARK} />
            <circle cx={714} cy={154} r={30} fill={A_BG} />
          </g>

          {/* Silhouette */}
          <Silhouette x={HALF * 0.5} sil={A_SIL} glow={GLOW_WARM} />

          {/* Label */}
          <Label x={HALF * 0.5} title="Noir pur" sub="#050208 — actuel" col={STAR_A} />

          {/* Verdict */}
          <Verdict x={HALF * 0.5} frame={frame} color="#ff6644"
            text="Disparait au soleil — contraste insuffisant" />
        </g>

        {/* ── Cote B : bleu nuit ───────────── */}
        <rect x={HALF} y={0} width={HALF} height={H} fill={B_BG} />
        <clipPath id="clip-right">
          <rect x={HALF} y={0} width={HALF} height={H} />
        </clipPath>
        <g clipPath="url(#clip-right)">
          {/* Horizon gradient */}
          <rect x={HALF} y={GROUND_Y - 80} width={HALF} height={80} fill={B_DARK} opacity={0.6} />
          {/* Sol */}
          <rect x={HALF} y={GROUND_Y} width={HALF} height={H - GROUND_Y} fill={B_DARK} />

          {/* Etoiles */}
          <Stars frame={frame} baseX={HALF} color={STAR_B} />

          {/* Lune */}
          <g transform={`translate(${HALF}, ${moonShift})`}>
            <circle cx={700} cy={160} r={50} fill={B_DARK} opacity={0.2} filter="url(#cc-halo)" />
            <circle cx={700} cy={160} r={38} fill={B_DARK} />
            <circle cx={714} cy={154} r={30} fill={B_BG} />
          </g>

          {/* Silhouette */}
          <Silhouette x={HALF + HALF * 0.5} sil={B_SIL} glow={GLOW_COOL} />

          {/* Label */}
          <Label x={HALF + HALF * 0.5} title="Bleu nuit" sub="#0d1b2a — propose" col={STAR_B} />

          {/* Verdict */}
          <Verdict x={HALF + HALF * 0.5} frame={frame} color="#44ff88"
            text="Lisible en plein soleil — profondeur preservee" />
        </g>

        {/* Separateur central */}
        <Divider />

        {/* Tag VS */}
        <rect x={HALF - 30} y={H / 2 - 22} width={60} height={44} rx={8} fill="#1a1a2e" />
        <text x={HALF} y={H / 2 + 9} textAnchor="middle" fill="#ffffff"
          fontSize={26} fontWeight="bold" fontFamily="system-ui, sans-serif">
          VS
        </text>
      </svg>
    </AbsoluteFill>
  );
};
