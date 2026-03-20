import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// Demonstration : 3 variantes sur fond noir pur
// Toutes les 3 ont le meme fond (#050208)
// La difference = comment la silhouette se detache
//
// Option 1 : teinte bleue sur silhouette (#0a1220)
// Option 2 : rim light (contour lune, halo fin)
// Option 3 : brume au sol (indigo bas, ciel noir pur)

const W = 1920;
const H = 1080;
const THIRD = W / 3;
const GROUND_Y = H * 0.75;

const BG        = "#050208"; // noir pur — identique dans les 3 cas
const STAR_COL  = "#c8d0e8";
const GLOW_WARM = "#ff9933";
const MOON_FILL = "#1a1a28";

// Silhouettes
const SIL_ORIGINAL = "#0a0610"; // quasi-invisible sur BG
const SIL_TINTED   = "#0a1220"; // teinte bleue subtile
const SIL_RIM      = "#0a0a18"; // meme que original, la difference vient du rim
const SIL_BRUME    = "#0a0610"; // meme que original, la difference vient du sol

function ci(frame: number, input: number[], output: number[]): number {
  return interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Silhouette generique ─────────────────────────────────────

const SilBase: React.FC<{
  x: number;
  fill: string;
  rimOpacity?: number;
  rimColor?: string;
}> = ({ x, fill, rimOpacity = 0, rimColor = "#a0b8d8" }) => {
  const h = 180;
  const headR = h * 0.12;
  const torsoH = h * 0.30;
  const robeH  = h * 0.52;
  const w      = h * 0.24;
  const y = GROUND_Y;

  const robeTop = y - robeH;
  const torsoBtm = robeTop;
  const torsoTop = torsoBtm - torsoH;
  const headCY = torsoTop - headR * 0.5;

  // Path du corps complet
  const bodyPath = `
    M${x - w * 0.6},${y}
    Q${x - w * 0.85},${y - robeH * 0.4} ${x - w * 0.28},${robeTop}
    L${x - w * 0.35},${torsoTop}
    Q${x - w * 0.55},${torsoTop - h * 0.16} ${x},${torsoTop - h * 0.32}
    Q${x + w * 0.55},${torsoTop - h * 0.16} ${x + w * 0.35},${torsoTop}
    L${x + w * 0.28},${robeTop}
    Q${x + w * 0.85},${y - robeH * 0.4} ${x + w * 0.6},${y}
    Z
  `;

  return (
    <g>
      {/* Rim light (option 2 uniquement — sinon opacity=0) */}
      {rimOpacity > 0 && (
        <g filter="url(#cl-rim)">
          <path d={bodyPath} fill="none" stroke={rimColor} strokeWidth={3} opacity={rimOpacity} />
          <circle cx={x} cy={headCY} r={headR} fill="none" stroke={rimColor} strokeWidth={2.5} opacity={rimOpacity} />
        </g>
      )}

      {/* Corps */}
      <path d={bodyPath} fill={fill} />

      {/* Tete */}
      <circle cx={x} cy={headCY} r={headR} fill={fill} />

      {/* Yeux */}
      <circle cx={x - 5} cy={headCY + 2} r={2.2} fill={GLOW_WARM} opacity={0.85} />
      <circle cx={x + 5} cy={headCY + 2} r={2.2} fill={GLOW_WARM} opacity={0.85} />

      {/* Bras leve */}
      <line
        x1={x + w * 0.35} y1={torsoTop + torsoH * 0.4}
        x2={x + w * 0.9}  y2={torsoTop - h * 0.08}
        stroke={fill} strokeWidth={11} strokeLinecap="round"
      />
    </g>
  );
};

// ─── Etoiles ─────────────────────────────────────────────────

const STAR_DATA = [
  { rx: 0.08, ry: 0.08, r: 2.4, ph: 0.0 },
  { rx: 0.22, ry: 0.06, r: 3.2, ph: 1.1 },
  { rx: 0.38, ry: 0.10, r: 2.0, ph: 2.3 },
  { rx: 0.55, ry: 0.07, r: 2.8, ph: 0.7 },
  { rx: 0.72, ry: 0.09, r: 3.0, ph: 3.1 },
  { rx: 0.88, ry: 0.06, r: 2.2, ph: 1.8 },
  { rx: 0.14, ry: 0.17, r: 2.0, ph: 2.7 },
  { rx: 0.35, ry: 0.19, r: 2.5, ph: 0.4 },
  { rx: 0.62, ry: 0.15, r: 3.0, ph: 1.5 },
  { rx: 0.80, ry: 0.18, r: 2.2, ph: 3.8 },
  { rx: 0.48, ry: 0.26, r: 2.8, ph: 2.1 },
  { rx: 0.28, ry: 0.30, r: 2.0, ph: 0.9 },
  { rx: 0.68, ry: 0.28, r: 2.4, ph: 1.2 },
];

const Stars: React.FC<{ frame: number; ox: number; width: number }> = ({ frame, ox, width }) => (
  <g>
    {STAR_DATA.map((s, i) => {
      const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.055 + s.ph);
      return (
        <circle key={i}
          cx={ox + s.rx * width} cy={s.ry * H}
          r={s.r} fill={STAR_COL} opacity={twinkle}
        />
      );
    })}
  </g>
);

// ─── Lune ────────────────────────────────────────────────────

const Moon: React.FC<{ cx: number }> = ({ cx }) => (
  <g>
    <circle cx={cx} cy={130} r={42} fill={MOON_FILL} />
    <circle cx={cx + 12} cy={124} r={32} fill={BG} />
  </g>
);

// ─── Label ───────────────────────────────────────────────────

const Label: React.FC<{ x: number; num: string; title: string; desc: string }> = ({ x, num, title, desc }) => (
  <g>
    <text x={x} y={52} textAnchor="middle" fill="#555577" fontSize={22}
      fontFamily="monospace" fontWeight="bold">
      {num}
    </text>
    <text x={x} y={88} textAnchor="middle" fill={STAR_COL} fontSize={30}
      fontFamily="system-ui, sans-serif" fontWeight="bold">
      {title}
    </text>
    <text x={x} y={122} textAnchor="middle" fill={STAR_COL} fontSize={19}
      fontFamily="system-ui, sans-serif" opacity={0.55}>
      {desc}
    </text>
  </g>
);

const Verdict: React.FC<{ x: number; frame: number; color: string; lines: string[] }> = ({ x, frame, color, lines }) => {
  const opacity = ci(frame, [90, 120], [0, 1]);
  return (
    <g opacity={opacity}>
      {lines.map((line, i) => (
        <text key={i} x={x} y={H - 80 + i * 36} textAnchor="middle"
          fill={color} fontSize={22} fontFamily="system-ui, sans-serif" fontStyle="italic">
          {line}
        </text>
      ))}
    </g>
  );
};

// ─── Composition ─────────────────────────────────────────────

export const ContrastLab: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = ci(frame, [0, 20], [0, 1]);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="cl-rim" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="cl-halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="cl-brume-blur" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="40" />
          </filter>

          {/* Gradient brume montante — option 3 */}
          <linearGradient id="cl-brume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2040" stopOpacity="0" />
            <stop offset="100%" stopColor="#1a2040" stopOpacity="0.35" />
          </linearGradient>

          {/* Rim light radial (lune) — option 2 */}
          <radialGradient id="cl-moon-rim" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#a0b8d8" stopOpacity="0" />
            <stop offset="100%" stopColor="#a0b8d8" stopOpacity="0.18" />
          </radialGradient>

          {/* Clip paths */}
          <clipPath id="cl-c1"><rect x={0}         y={0} width={THIRD} height={H} /></clipPath>
          <clipPath id="cl-c2"><rect x={THIRD}     y={0} width={THIRD} height={H} /></clipPath>
          <clipPath id="cl-c3"><rect x={THIRD * 2} y={0} width={THIRD} height={H} /></clipPath>
        </defs>

        {/* Fond noir pur — commun */}
        <rect width={W} height={H} fill={BG} />

        {/* ── Option 1 : Teinte bleue sur silhouette ─────── */}
        <g clipPath="url(#cl-c1)">
          <Stars frame={frame} ox={0} width={THIRD} />
          <Moon cx={THIRD * 0.72} />
          {/* Sol */}
          <rect x={0} y={GROUND_Y} width={THIRD} height={H - GROUND_Y} fill="#060309" />
          <Silhouette1 x={THIRD * 0.5} />
          <Label x={THIRD * 0.5} num="01" title="Teinte bleue" desc="silhouette #0a1220" />
          <Verdict x={THIRD * 0.5} frame={frame} color="#88aacc"
            lines={["Lisible + subtil", "Fond reste noir pur"]} />
        </g>

        {/* ── Option 2 : Rim light ───────────────────────── */}
        <g clipPath="url(#cl-c2)">
          <Stars frame={frame} ox={THIRD} width={THIRD} />
          <Moon cx={THIRD + THIRD * 0.72} />
          {/* Aura lune elargie (eclaire le contour) */}
          <circle cx={THIRD + THIRD * 0.72} cy={130} r={200}
            fill="url(#cl-moon-rim)" opacity={0.7} />
          {/* Sol */}
          <rect x={THIRD} y={GROUND_Y} width={THIRD} height={H - GROUND_Y} fill="#060309" />
          <Silhouette2 x={THIRD + THIRD * 0.5} />
          <Label x={THIRD + THIRD * 0.5} num="02" title="Rim light" desc="contour lune, 20% opacity" />
          <Verdict x={THIRD + THIRD * 0.5} frame={frame} color="#88aacc"
            lines={["Cinema — tres lisible", "Impression de profondeur"]} />
        </g>

        {/* ── Option 3 : Brume au sol ────────────────────── */}
        <g clipPath="url(#cl-c3)">
          <Stars frame={frame} ox={THIRD * 2} width={THIRD} />
          <Moon cx={THIRD * 2 + THIRD * 0.72} />
          {/* Brume montante */}
          <rect x={THIRD * 2} y={GROUND_Y - 200} width={THIRD} height={200 + H - GROUND_Y}
            fill="url(#cl-brume)" />
          {/* Sol */}
          <rect x={THIRD * 2} y={GROUND_Y} width={THIRD} height={H - GROUND_Y} fill="#060812" />
          <Silhouette3 x={THIRD * 2 + THIRD * 0.5} />
          <Label x={THIRD * 2 + THIRD * 0.5} num="03" title="Brume au sol" desc="indigo 30% en bas" />
          <Verdict x={THIRD * 2 + THIRD * 0.5} frame={frame} color="#88aacc"
            lines={["Ciel noir pur preserve", "Mystere + ancrage au sol"]} />
        </g>

        {/* Separateurs */}
        <line x1={THIRD}     y1={0} x2={THIRD}     y2={H} stroke="#ffffff" strokeWidth={1} opacity={0.12} />
        <line x1={THIRD * 2} y1={0} x2={THIRD * 2} y2={H} stroke="#ffffff" strokeWidth={1} opacity={0.12} />

        {/* Titre haut */}
        <text x={W / 2} y={H - 28} textAnchor="middle" fill="#333355"
          fontSize={18} fontFamily="monospace">
          fond #050208 identique dans les 3 cas — seule la technique change
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ─── Silhouettes specialisees ─────────────────────────────────

// Option 1 : teinte bleue, pas de rim
const Silhouette1: React.FC<{ x: number }> = ({ x }) => (
  <SilBase x={x} fill={SIL_TINTED} rimOpacity={0} />
);

// Option 2 : silhouette sombre + rim light lune (cote gauche eclaire)
const Silhouette2: React.FC<{ x: number }> = ({ x }) => (
  <SilBase x={x} fill={SIL_RIM} rimOpacity={0.22} rimColor="#b0c8e0" />
);

// Option 3 : silhouette sombre, la brume fait le travail
const Silhouette3: React.FC<{ x: number }> = ({ x }) => (
  <SilBase x={x} fill={SIL_BRUME} rimOpacity={0} />
);
