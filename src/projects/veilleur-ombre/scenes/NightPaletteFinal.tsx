import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// Palette nocturne finale : combinaison 02+03 + gradient atmospherique
//
// Fond : gradient vertical #050208 (zenith) -> #080d1a (horizon)
// Silhouettes : rim light 20% cote lune
// Sol : brume indigo 30%
// Comparatif : original (gauche) vs version finale (droite)

const W = 1920;
const H = 1080;
const HALF = W / 2;
const GROUND_Y = H * 0.75;

const BG_TOP    = "#050208";
const BG_HORIZ  = "#080d1a";
const SIL_OLD   = "#0a0610";
const SIL_NEW   = "#0c1018";
const STAR_COL  = "#c8d0e8";
const GLOW_WARM = "#ff9933";

function ci(f: number, i: number[], o: number[]): number {
  return interpolate(f, i, o, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── Silhouette ───────────────────────────────────────────────

const Sil: React.FC<{
  x: number;
  fill: string;
  rim?: boolean;
  rimSide?: "left" | "right";
}> = ({ x, fill, rim = false, rimSide = "left" }) => {
  const h = 190;
  const headR = h * 0.12;
  const torsoH = h * 0.30;
  const robeH  = h * 0.52;
  const w      = h * 0.24;
  const y = GROUND_Y;

  const robeTop  = y - robeH;
  const torsoTop = robeTop - torsoH;
  const headCY   = torsoTop - headR * 0.4;

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

  const rimX = rimSide === "left" ? x - w * 0.5 : x + w * 0.5;
  const rimDx = rimSide === "left" ? -w * 0.1 : w * 0.1;

  return (
    <g>
      {/* Halo chaud sous les pieds */}
      <ellipse cx={x} cy={y + 8} rx={52} ry={12}
        fill={GLOW_WARM} opacity={0.14} filter="url(#np-blur-sm)" />

      {/* Rim light lune */}
      {rim && (
        <g filter="url(#np-rim)">
          <path d={bodyPath} fill="none"
            stroke="#b0c8e0" strokeWidth={2.5} opacity={0.2} />
          <circle cx={x} cy={headCY} r={headR}
            fill="none" stroke="#b0c8e0" strokeWidth={2} opacity={0.18} />
          {/* Bras */}
          <line
            x1={x + w * 0.36} y1={torsoTop + torsoH * 0.35}
            x2={x + w * 0.95} y2={torsoTop - h * 0.06}
            stroke="#b0c8e0" strokeWidth={10} strokeLinecap="round" opacity={0.15}
          />
        </g>
      )}

      {/* Corps */}
      <path d={bodyPath} fill={fill} />
      <circle cx={x} cy={headCY} r={headR} fill={fill} />

      {/* Yeux */}
      <circle cx={x - 5} cy={headCY + 2} r={2.2} fill={GLOW_WARM} opacity={0.88} />
      <circle cx={x + 5} cy={headCY + 2} r={2.2} fill={GLOW_WARM} opacity={0.88} />

      {/* Bras leve */}
      <line
        x1={x + w * 0.36} y1={torsoTop + torsoH * 0.35}
        x2={x + w * 0.95} y2={torsoTop - h * 0.06}
        stroke={fill} strokeWidth={12} strokeLinecap="round"
      />
    </g>
  );
};

// ─── Etoiles ─────────────────────────────────────────────────

const STARS = [
  { rx: 0.09, ry: 0.07, r: 2.4, ph: 0.0 },
  { rx: 0.21, ry: 0.05, r: 3.0, ph: 1.1 },
  { rx: 0.36, ry: 0.10, r: 2.0, ph: 2.3 },
  { rx: 0.54, ry: 0.06, r: 2.8, ph: 0.7 },
  { rx: 0.70, ry: 0.09, r: 3.2, ph: 3.1 },
  { rx: 0.87, ry: 0.05, r: 2.2, ph: 1.8 },
  { rx: 0.13, ry: 0.16, r: 2.0, ph: 2.7 },
  { rx: 0.34, ry: 0.19, r: 2.5, ph: 0.4 },
  { rx: 0.60, ry: 0.14, r: 3.0, ph: 1.5 },
  { rx: 0.79, ry: 0.17, r: 2.2, ph: 3.8 },
  { rx: 0.46, ry: 0.25, r: 2.8, ph: 2.1 },
  { rx: 0.27, ry: 0.29, r: 2.0, ph: 0.9 },
  { rx: 0.67, ry: 0.27, r: 2.4, ph: 1.2 },
  { rx: 0.92, ry: 0.22, r: 2.6, ph: 0.5 },
  { rx: 0.04, ry: 0.32, r: 1.8, ph: 3.2 },
];

const Stars: React.FC<{ frame: number; ox: number; w: number }> = ({ frame, ox, w }) => (
  <g>
    {STARS.map((s, i) => {
      const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.055 + s.ph);
      return (
        <circle key={i}
          cx={ox + s.rx * w} cy={s.ry * H}
          r={s.r} fill={STAR_COL} opacity={twinkle}
        />
      );
    })}
  </g>
);

// ─── Lune ────────────────────────────────────────────────────

const Moon: React.FC<{ cx: number; bgTop: string }> = ({ cx, bgTop }) => (
  <g>
    <circle cx={cx} cy={135} r={44} fill="#12121e" />
    <circle cx={cx + 13} cy={128} r={33} fill={bgTop} />
  </g>
);

// ─── Labels ──────────────────────────────────────────────────

const Label: React.FC<{ x: number; title: string; tag: string }> = ({ x, title, tag }) => (
  <g>
    <text x={x} y={62} textAnchor="middle" fill={STAR_COL} fontSize={32}
      fontFamily="system-ui, sans-serif" fontWeight="bold">
      {title}
    </text>
    <text x={x} y={96} textAnchor="middle" fill={STAR_COL} fontSize={19}
      fontFamily="monospace" opacity={0.45}>
      {tag}
    </text>
  </g>
);

const Annotation: React.FC<{ x: number; frame: number; lines: string[]; color: string }> = ({ x, frame, lines, color }) => {
  const opacity = ci(frame, [60, 90], [0, 1]);
  return (
    <g opacity={opacity}>
      {lines.map((l, i) => (
        <text key={i} x={x} y={H - 90 + i * 34} textAnchor="middle"
          fill={color} fontSize={22} fontFamily="system-ui, sans-serif" fontStyle="italic">
          {l}
        </text>
      ))}
    </g>
  );
};

// ─── Composition ─────────────────────────────────────────────

export const NightPaletteFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = ci(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* Gradient ciel — identique gauche et droite mais applique differemment */}
          <linearGradient id="np-sky-flat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={BG_TOP} />
            <stop offset="100%" stopColor={BG_TOP} />
          </linearGradient>
          <linearGradient id="np-sky-atmo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={BG_TOP} />
            <stop offset="100%" stopColor={BG_HORIZ} />
          </linearGradient>

          {/* Brume sol */}
          <linearGradient id="np-brume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10182e" stopOpacity="0" />
            <stop offset="100%" stopColor="#10182e" stopOpacity="0.38" />
          </linearGradient>

          {/* Filters */}
          <filter id="np-rim" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="np-blur-sm">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="np-halo" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="28" />
          </filter>

          {/* Clip paths */}
          <clipPath id="np-left">
            <rect x={0} y={0} width={HALF} height={H} />
          </clipPath>
          <clipPath id="np-right">
            <rect x={HALF} y={0} width={HALF} height={H} />
          </clipPath>
        </defs>

        {/* ── GAUCHE : original flat noir ──────────────────── */}
        <g clipPath="url(#np-left)">
          {/* Ciel plat */}
          <rect x={0} y={0} width={HALF} height={H} fill={BG_TOP} />
          {/* Sol */}
          <rect x={0} y={GROUND_Y} width={HALF} height={H - GROUND_Y} fill="#060309" />

          <Stars frame={frame} ox={0} w={HALF} />
          <Moon cx={HALF * 0.75} bgTop={BG_TOP} />

          <Sil x={HALF * 0.5} fill={SIL_OLD} rim={false} />

          <Label x={HALF * 0.5} title="Original" tag="fond plat #050208, silhouette #0a0610" />
          <Annotation x={HALF * 0.5} frame={frame} color="#886655"
            lines={["Silhouette se fond dans le fond", "Pas de separation sol/ciel"]} />
        </g>

        {/* ── DROITE : version finale 02+03+gradient ────────── */}
        <g clipPath="url(#np-right)">
          {/* Ciel gradient atmospherique */}
          <rect x={HALF} y={0} width={HALF} height={H} fill="url(#np-sky-atmo)" />

          {/* Sol avec teinte */}
          <rect x={HALF} y={GROUND_Y} width={HALF} height={H - GROUND_Y} fill="#06080f" />

          {/* Brume montante */}
          <rect x={HALF} y={GROUND_Y - 240} width={HALF} height={240 + H - GROUND_Y}
            fill="url(#np-brume)" />

          <Stars frame={frame} ox={HALF} w={HALF} />

          {/* Aura lune (eclaire le contour de la silhouette) */}
          <circle cx={HALF + HALF * 0.75} cy={135} r={220}
            fill="#a0b8d8" opacity={0.07} filter="url(#np-halo)" />

          <Moon cx={HALF + HALF * 0.75} bgTop={BG_TOP} />

          <Sil x={HALF + HALF * 0.5} fill={SIL_NEW} rim={true} />

          <Label x={HALF + HALF * 0.5} title="Version finale"
            tag="gradient atmo + rim light + brume sol" />
          <Annotation x={HALF + HALF * 0.5} frame={frame} color="#88aacc"
            lines={["Ciel noir pur preserve en haut", "Silhouette lisible, atmosphere reelle"]} />
        </g>

        {/* Separateur */}
        <line x1={HALF} y1={0} x2={HALF} y2={H} stroke="#ffffff" strokeWidth={1} opacity={0.1} />

        {/* VS */}
        <rect x={HALF - 28} y={H / 2 - 20} width={56} height={40} rx={6} fill="#0d0d1a" />
        <text x={HALF} y={H / 2 + 7} textAnchor="middle" fill="#888899"
          fontSize={22} fontWeight="bold" fontFamily="system-ui, sans-serif">
          VS
        </text>
      </svg>
    </AbsoluteFill>
  );
};
