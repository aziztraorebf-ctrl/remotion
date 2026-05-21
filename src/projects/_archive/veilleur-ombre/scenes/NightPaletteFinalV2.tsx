import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// NightPaletteFinalV2 — version plein ecran (pas de comparatif)
// Palette : gradient atmo + rim light + brume sol
// Ajustements :
//   - Etoiles : plus denses, plus grandes, micro-halos, quelques teintees
//   - Yeux : halo chaud fort, lanterne effet
//   - Quelques etoiles colorees (bleu, or)

const W = 1920;
const H = 1080;
const GROUND_Y = H * 0.74;

const BG_TOP   = "#050208";
const BG_HORIZ = "#080d1a";
const SIL_COL  = "#0c1018";
const WARM     = "#ff9933";
const COOL     = "#c8d0e8";

function ci(f: number, i: number[], o: number[]): number {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── Etoiles ─────────────────────────────────────────────────

const STARS: { x: number; y: number; r: number; ph: number; col: string }[] = [
  // Grandes etoiles blanches
  { x: 0.07, y: 0.07, r: 3.2, ph: 0.0, col: "#ffffff" },
  { x: 0.19, y: 0.05, r: 4.0, ph: 1.1, col: "#ffffff" },
  { x: 0.33, y: 0.09, r: 2.8, ph: 2.3, col: "#ffffff" },
  { x: 0.52, y: 0.06, r: 3.6, ph: 0.7, col: "#ffffff" },
  { x: 0.68, y: 0.08, r: 4.2, ph: 3.1, col: "#ffffff" },
  { x: 0.84, y: 0.05, r: 3.0, ph: 1.8, col: "#ffffff" },
  { x: 0.94, y: 0.10, r: 2.6, ph: 2.9, col: "#ffffff" },
  // Moyennes
  { x: 0.12, y: 0.15, r: 2.4, ph: 2.7, col: "#e8eeff" },
  { x: 0.27, y: 0.18, r: 3.0, ph: 0.4, col: "#e8eeff" },
  { x: 0.44, y: 0.13, r: 2.6, ph: 1.5, col: "#e8eeff" },
  { x: 0.60, y: 0.17, r: 2.8, ph: 3.8, col: "#e8eeff" },
  { x: 0.76, y: 0.14, r: 2.4, ph: 2.1, col: "#e8eeff" },
  { x: 0.90, y: 0.19, r: 3.2, ph: 0.8, col: "#e8eeff" },
  { x: 0.03, y: 0.22, r: 2.0, ph: 1.6, col: "#e8eeff" },
  // Petites fond
  { x: 0.38, y: 0.24, r: 1.8, ph: 0.9, col: COOL },
  { x: 0.55, y: 0.28, r: 2.2, ph: 3.4, col: COOL },
  { x: 0.71, y: 0.26, r: 1.8, ph: 1.2, col: COOL },
  { x: 0.22, y: 0.30, r: 2.0, ph: 0.3, col: COOL },
  { x: 0.86, y: 0.29, r: 1.6, ph: 2.6, col: COOL },
  { x: 0.48, y: 0.33, r: 1.8, ph: 1.7, col: COOL },
  { x: 0.15, y: 0.36, r: 1.6, ph: 3.0, col: COOL },
  { x: 0.64, y: 0.38, r: 2.0, ph: 0.6, col: COOL },
  // Etoiles colorees (accents)
  { x: 0.31, y: 0.11, r: 3.4, ph: 1.4, col: "#aaccff" }, // bleue
  { x: 0.79, y: 0.22, r: 3.0, ph: 2.8, col: "#aaccff" }, // bleue
  { x: 0.57, y: 0.10, r: 3.6, ph: 0.2, col: "#ffe8aa" }, // doree
  { x: 0.09, y: 0.29, r: 2.8, ph: 3.6, col: "#ffe8aa" }, // doree
  { x: 0.93, y: 0.16, r: 3.2, ph: 1.9, col: "#ffccaa" }, // orange pale
];

const StarField: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    {STARS.map((s, i) => {
      const twinkle = 0.6 + 0.4 * Math.sin(frame * 0.055 + s.ph);
      const hasHalo = s.r >= 3.0;
      return (
        <g key={i}>
          {hasHalo && (
            <circle
              cx={s.x * W} cy={s.y * H}
              r={s.r * 4} fill={s.col}
              opacity={twinkle * 0.18} filter="url(#np2-star-halo)"
            />
          )}
          <circle
            cx={s.x * W} cy={s.y * H}
            r={s.r} fill={s.col} opacity={twinkle * 0.92}
          />
        </g>
      );
    })}
  </g>
);

// ─── Lune ────────────────────────────────────────────────────

const Moon: React.FC<{ frame: number }> = ({ frame }) => {
  const shift = ci(frame, [0, 180], [0, 18]);
  const cx = W * 0.76;
  const cy = 148 + shift;
  return (
    <g>
      <circle cx={cx} cy={cy} r={56} fill="#a0b8d8" opacity={0.06} filter="url(#np2-halo)" />
      <circle cx={cx} cy={cy} r={44} fill="#12121e" />
      <circle cx={cx + 14} cy={cy - 7} r={33} fill={BG_TOP} />
    </g>
  );
};

// ─── Silhouette ───────────────────────────────────────────────

const Sage: React.FC<{ frame: number }> = ({ frame }) => {
  const x = W * 0.5;
  const h = 210;
  const headR = h * 0.12;
  const torsoH = h * 0.30;
  const robeH  = h * 0.52;
  const w      = h * 0.24;
  const y = GROUND_Y;

  const robeTop  = y - robeH;
  const torsoTop = robeTop - torsoH;
  const headCY   = torsoTop - headR * 0.4;

  // Bras : lente remontee
  const armProgress = ci(frame, [30, 120], [0, 1]);
  const armEndX = x + w * (0.9 + armProgress * 0.3);
  const armEndY = torsoTop - h * (0.06 + armProgress * 0.20);

  const bodyPath = [
    `M${x - w * 0.6},${y}`,
    `Q${x - w * 0.85},${y - robeH * 0.38} ${x - w * 0.28},${robeTop}`,
    `L${x - w * 0.36},${torsoTop}`,
    `Q${x - w * 0.52},${torsoTop - h * 0.15} ${x},${torsoTop - h * 0.30}`,
    `Q${x + w * 0.52},${torsoTop - h * 0.15} ${x + w * 0.36},${torsoTop}`,
    `L${x + w * 0.28},${robeTop}`,
    `Q${x + w * 0.85},${y - robeH * 0.38} ${x + w * 0.6},${y}`,
    "Z",
  ].join(" ");

  // Intensite des yeux pulsee
  const eyePulse = 0.75 + 0.25 * Math.sin(frame * 0.07);
  const eyeR = 3.8;
  const eyeHaloR = eyeR * 5.5;

  return (
    <g>
      {/* Halo sol */}
      <ellipse cx={x} cy={y + 10} rx={80} ry={16}
        fill={WARM} opacity={0.12} filter="url(#np2-blur-md)" />

      {/* Rim light lune (cote droit — lune a droite) */}
      <g filter="url(#np2-rim)">
        <path d={bodyPath} fill="none"
          stroke="#b0c8e0" strokeWidth={2.5} opacity={0.22} />
        <circle cx={x} cy={headCY} r={headR}
          fill="none" stroke="#b0c8e0" strokeWidth={2} opacity={0.20} />
        <line
          x1={x + w * 0.36} y1={torsoTop + torsoH * 0.35}
          x2={armEndX} y2={armEndY}
          stroke="#b0c8e0" strokeWidth={11} strokeLinecap="round" opacity={0.15}
        />
      </g>

      {/* Corps */}
      <path d={bodyPath} fill={SIL_COL} />
      <circle cx={x} cy={headCY} r={headR} fill={SIL_COL} />

      {/* Bras */}
      <line
        x1={x + w * 0.36} y1={torsoTop + torsoH * 0.35}
        x2={armEndX} y2={armEndY}
        stroke={SIL_COL} strokeWidth={14} strokeLinecap="round"
      />

      {/* Yeux — halo chaud fort */}
      <circle cx={x - 7} cy={headCY + 2} r={eyeHaloR}
        fill={WARM} opacity={eyePulse * 0.28} filter="url(#np2-blur-md)" />
      <circle cx={x + 7} cy={headCY + 2} r={eyeHaloR}
        fill={WARM} opacity={eyePulse * 0.28} filter="url(#np2-blur-md)" />
      {/* Point central */}
      <circle cx={x - 7} cy={headCY + 2} r={eyeR}
        fill={WARM} opacity={eyePulse * 0.95} />
      <circle cx={x + 7} cy={headCY + 2} r={eyeR}
        fill={WARM} opacity={eyePulse * 0.95} />
      {/* Micro-reflet blanc */}
      <circle cx={x - 6} cy={headCY + 1} r={1.2} fill="#ffffff" opacity={0.8} />
      <circle cx={x + 8} cy={headCY + 1} r={1.2} fill="#ffffff" opacity={0.8} />
    </g>
  );
};

// ─── Composition principale ───────────────────────────────────

export const NightPaletteFinalV2: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = ci(frame, [0, 25], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* Gradient ciel atmospherique */}
          <linearGradient id="np2-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={BG_TOP} />
            <stop offset="100%" stopColor={BG_HORIZ} />
          </linearGradient>

          {/* Brume sol montante */}
          <linearGradient id="np2-brume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10182e" stopOpacity="0" />
            <stop offset="100%" stopColor="#10182e" stopOpacity="0.40" />
          </linearGradient>

          {/* Filters */}
          <filter id="np2-halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
          <filter id="np2-star-halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="np2-rim" x="-8%" y="-8%" width="116%" height="116%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="np2-blur-md">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="np2-blur-sm">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* Ciel gradient atmospherique */}
        <rect width={W} height={H} fill="url(#np2-sky)" />

        {/* Sol */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#060810" />

        {/* Brume montante */}
        <rect x={0} y={GROUND_Y - 260} width={W} height={260 + H - GROUND_Y}
          fill="url(#np2-brume)" />

        {/* Etoiles */}
        <StarField frame={frame} />

        {/* Lune */}
        <Moon frame={frame} />

        {/* Silhouette */}
        <Sage frame={frame} />
      </svg>
    </AbsoluteFill>
  );
};
