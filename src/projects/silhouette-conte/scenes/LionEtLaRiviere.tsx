import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  Audio,
  AbsoluteFill,
  Sequence,
  staticFile,
} from "remotion";
import {
  LION_SCENE_TIMING,
  VISUAL_CUES,
  FPS,
  AUDIO_DURATION_FRAMES,
} from "../config/lionTiming";

const W = 1920;
const H = 1080;
const GROUND_Y = H * 0.76;

// ============================================================
// Helpers
// ============================================================

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

function ci(
  frame: number,
  range: [number, number] | number[],
  output: [number, number] | number[]
): number {
  return clamp(
    interpolate(frame, range, output, {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
}

// ============================================================
// SVG Defs — tous filtres + gradients centralises
// ============================================================

const AllDefs: React.FC = () => (
  <defs>
    {/* Filtres atmospheriques */}
    <filter id="glow-md" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-lg" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="35" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="glow-xl" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="50" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="soft" x="-15%" y="-15%" width="130%" height="130%">
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
    <filter id="soft-lg" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="water-blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="4" />
    </filter>

    {/* S1 — Crepuscule orange */}
    <linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7A1A00" />
      <stop offset="35%" stopColor="#C0391B" />
      <stop offset="65%" stopColor="#E8621A" />
      <stop offset="100%" stopColor="#D4922A" />
    </linearGradient>
    <radialGradient id="s1-sun" cx="50%" cy="100%" r="60%">
      <stop offset="0%" stopColor="#F5C842" stopOpacity="0.9" />
      <stop offset="40%" stopColor="#E8621A" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#C0391B" stopOpacity="0" />
    </radialGradient>

    {/* S2 — Nuit bleue */}
    <linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#040D2E" />
      <stop offset="50%" stopColor="#1E3A5F" />
      <stop offset="100%" stopColor="#0A1828" />
    </linearGradient>
    <radialGradient id="s2-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#E8F0FF" stopOpacity="0.95" />
      <stop offset="60%" stopColor="#C0C8E0" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#C0C8E0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="s2-danger" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#7A1A14" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#7A1A14" stopOpacity="0" />
    </radialGradient>

    {/* S3 — Aube rose */}
    <linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#1B2A4A" />
      <stop offset="40%" stopColor="#C87040" />
      <stop offset="100%" stopColor="#E8A88A" />
    </linearGradient>
    <radialGradient id="s3-dawn" cx="50%" cy="100%" r="80%">
      <stop offset="0%" stopColor="#F5C890" stopOpacity="0.7" />
      <stop offset="100%" stopColor="#F5C890" stopOpacity="0" />
    </radialGradient>

    {/* S4 — Aurore doree */}
    <linearGradient id="s4-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F0C060" />
      <stop offset="50%" stopColor="#F5EDD8" />
      <stop offset="100%" stopColor="#FFD080" />
    </linearGradient>
    <radialGradient id="s4-sun" cx="50%" cy="100%" r="70%">
      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="30%" stopColor="#F5C830" stopOpacity="0.85" />
      <stop offset="100%" stopColor="#F5C830" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="s4-flash" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFFCE0" stopOpacity="1" />
      <stop offset="100%" stopColor="#FFFCE0" stopOpacity="0" />
    </radialGradient>
  </defs>
);

// ============================================================
// Baobab — silhouette africaine authentique (tronc bulge + branches)
// ============================================================

const Baobab: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const s = scale;
  const trunkH = 180 * s;
  const branchY = y - trunkH;

  const branches = [
    { angle: -75, len: 110 * s, w: 9 * s },
    { angle: -45, len: 140 * s, w: 10 * s },
    { angle: -15, len: 120 * s, w: 8 * s },
    { angle: 20,  len: 130 * s, w: 10 * s },
    { angle: 55,  len: 105 * s, w: 8 * s },
    { angle: 80,  len: 90 * s,  w: 7 * s },
  ];

  return (
    <g>
      <ellipse cx={x} cy={y} rx={30 * s} ry={8 * s} fill="#000" opacity={0.35} filter="url(#soft)" />
      <path
        d={`M${x - 22 * s},${y}
            Q${x - 42 * s},${y - trunkH * 0.5} ${x - 18 * s},${branchY}
            L${x + 18 * s},${branchY}
            Q${x + 42 * s},${y - trunkH * 0.5} ${x + 22 * s},${y}
            Z`}
        fill="#000"
      />
      {branches.map((b, i) => {
        const rad = (b.angle * Math.PI) / 180;
        const bx2 = x + Math.cos(rad) * b.len;
        const by2 = branchY + Math.sin(rad) * b.len * 0.4;
        const midX = x + Math.cos(rad) * b.len * 0.5;
        const midY = branchY + Math.sin(rad) * b.len * 0.15;
        return (
          <g key={i}>
            <path
              d={`M${x},${branchY} Q${midX},${midY} ${bx2},${by2}`}
              stroke="#000"
              strokeWidth={b.w}
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={bx2} cy={by2} r={18 * s} fill="#000" />
            <circle cx={bx2 - 10 * s} cy={by2 - 8 * s} r={12 * s} fill="#000" />
            <circle cx={bx2 + 8 * s} cy={by2 - 10 * s} r={10 * s} fill="#000" />
          </g>
        );
      })}
    </g>
  );
};

// ============================================================
// Lion silhouette feline
// ============================================================

const LionSilhouette: React.FC<{
  x: number;
  y: number;
  scale?: number;
  walkPhase?: number;
  sitting?: boolean;
  inclineAngle?: number;
  facing?: "left" | "right";
}> = ({
  x,
  y,
  scale = 1,
  walkPhase = 0,
  sitting = false,
  inclineAngle = 0,
  facing = "right",
}) => {
  const s = scale;
  const flip = facing === "left" ? -1 : 1;
  const bob = sitting ? 0 : Math.abs(Math.sin(walkPhase)) * 5 * s;
  const bodyY = y - 70 * s + bob;
  const headX = x + 110 * s * flip;
  const headY = bodyY - 10 * s;
  const leg1 = Math.sin(walkPhase) * 18;
  const leg2 = Math.sin(walkPhase + Math.PI) * 18;
  const leg3 = Math.sin(walkPhase + 0.5) * 14;
  const leg4 = Math.sin(walkPhase + Math.PI + 0.5) * 14;
  const tailSwing = Math.sin(walkPhase * 0.7) * 15;

  return (
    <g transform={`rotate(${inclineAngle}, ${x}, ${y})`}>
      {/* Ombre sol */}
      <ellipse
        cx={x + 30 * s * flip}
        cy={y}
        rx={140 * s}
        ry={22 * s}
        fill="#000"
        opacity={0.3}
        filter="url(#soft)"
      />
      {/* Queue */}
      <path
        d={`M${x - 100 * s * flip},${bodyY + 20 * s}
            Q${x - 140 * s * flip},${bodyY - 20 * s + tailSwing}
              ${x - 130 * s * flip},${bodyY - 60 * s + tailSwing}`}
        stroke="#000"
        strokeWidth={10 * s}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={x - 130 * s * flip} cy={bodyY - 60 * s + tailSwing} r={16 * s} fill="#000" />

      {/* Pattes arriere */}
      {!sitting ? (
        <>
          <path
            d={`M${x - 60 * s * flip},${bodyY + 40 * s}
                Q${x - 55 * s * flip},${bodyY + 80 * s}
                  ${x - 50 * s * flip + leg3},${y}`}
            stroke="#000" strokeWidth={14 * s} fill="none" strokeLinecap="round"
          />
          <path
            d={`M${x - 30 * s * flip},${bodyY + 40 * s}
                Q${x - 28 * s * flip},${bodyY + 80 * s}
                  ${x - 20 * s * flip + leg4},${y}`}
            stroke="#000" strokeWidth={14 * s} fill="none" strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d={`M${x - 60 * s * flip},${bodyY + 50 * s} L${x - 65 * s * flip},${y}`}
            stroke="#000" strokeWidth={16 * s} fill="none" strokeLinecap="round"
          />
          <path
            d={`M${x - 25 * s * flip},${bodyY + 55 * s} L${x - 20 * s * flip},${y}`}
            stroke="#000" strokeWidth={16 * s} fill="none" strokeLinecap="round"
          />
        </>
      )}

      {/* Corps — ellipse feline allongee */}
      <ellipse cx={x} cy={bodyY} rx={120 * s} ry={sitting ? 60 * s : 65 * s} fill="#000" />

      {/* Pattes avant */}
      {!sitting ? (
        <>
          <path
            d={`M${x + 50 * s * flip},${bodyY + 30 * s}
                Q${x + 60 * s * flip},${bodyY + 70 * s}
                  ${x + 65 * s * flip + leg1},${y}`}
            stroke="#000" strokeWidth={15 * s} fill="none" strokeLinecap="round"
          />
          <path
            d={`M${x + 80 * s * flip},${bodyY + 25 * s}
                Q${x + 90 * s * flip},${bodyY + 65 * s}
                  ${x + 95 * s * flip + leg2},${y}`}
            stroke="#000" strokeWidth={15 * s} fill="none" strokeLinecap="round"
          />
          {/* Griffes glint */}
          <line
            x1={x + 65 * s * flip + leg1} y1={y - 4 * s}
            x2={x + 78 * s * flip + leg1} y2={y - 10 * s}
            stroke="#C8D0E8" strokeWidth={1.5} opacity={0.5}
          />
          <line
            x1={x + 95 * s * flip + leg2} y1={y - 4 * s}
            x2={x + 108 * s * flip + leg2} y2={y - 10 * s}
            stroke="#C8D0E8" strokeWidth={1.5} opacity={0.5}
          />
        </>
      ) : (
        <>
          <path
            d={`M${x + 60 * s * flip},${bodyY + 50 * s} L${x + 65 * s * flip},${y}`}
            stroke="#000" strokeWidth={16 * s} fill="none" strokeLinecap="round"
          />
          <path
            d={`M${x + 88 * s * flip},${bodyY + 50 * s} L${x + 95 * s * flip},${y}`}
            stroke="#000" strokeWidth={16 * s} fill="none" strokeLinecap="round"
          />
        </>
      )}

      {/* Criniere — disque + 12 pics triangulaires */}
      <circle cx={headX} cy={headY} r={60 * s} fill="#000" opacity={0.6} />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const len = (35 + ((i * 7) % 15)) * s;
        const mx = headX + Math.cos(angle) * 52 * s;
        const my = headY + Math.sin(angle) * 52 * s;
        const px = headX + Math.cos(angle) * (52 * s + len);
        const py = headY + Math.sin(angle) * (52 * s + len);
        const ox = Math.cos(angle + Math.PI / 2) * 8 * s;
        const oy = Math.sin(angle + Math.PI / 2) * 8 * s;
        return (
          <polygon key={i} points={`${mx + ox},${my + oy} ${px},${py} ${mx - ox},${my - oy}`} fill="#000" />
        );
      })}
      {/* Tete */}
      <circle cx={headX} cy={headY} r={52 * s} fill="#000" />
      {/* Museau */}
      <ellipse cx={headX + 34 * s * flip} cy={headY + 10 * s} rx={22 * s} ry={16 * s} fill="#000" />
      {/* Plis criniere */}
      {[-14, 0, 14].map((ox, i) => (
        <path
          key={i}
          d={`M${headX + ox * s * flip},${headY - 45 * s}
              Q${headX + (ox - 4) * s * flip},${headY}
                ${headX + ox * s * flip},${headY + 30 * s}`}
          stroke="#1a1010" strokeWidth={1.2} fill="none" opacity={0.4}
        />
      ))}
    </g>
  );
};

// ============================================================
// Enfant silhouette
// ============================================================

const EnfantSilhouette: React.FC<{
  x: number;
  y: number;
  scale?: number;
  armAngle?: number;
  facing?: "left" | "right";
}> = ({ x, y, scale = 1, armAngle = 0, facing = "left" }) => {
  const s = scale;
  const flip = facing === "left" ? -1 : 1;
  const bodyH = 160 * s;
  const headY = y - bodyH - 28 * s;

  return (
    <g>
      <ellipse cx={x} cy={y} rx={28 * s} ry={8 * s} fill="#000" opacity={0.3} filter="url(#soft)" />
      <path d={`M${x - 10 * s},${y - 50 * s} L${x - 12 * s},${y}`} stroke="#000" strokeWidth={12 * s} fill="none" strokeLinecap="round" />
      <path d={`M${x + 10 * s},${y - 50 * s} L${x + 12 * s},${y}`} stroke="#000" strokeWidth={12 * s} fill="none" strokeLinecap="round" />
      <path
        d={`M${x - 22 * s},${y - bodyH}
            Q${x - 25 * s},${y - 80 * s} ${x - 15 * s},${y - 50 * s}
            L${x + 15 * s},${y - 50 * s}
            Q${x + 25 * s},${y - 80 * s} ${x + 22 * s},${y - bodyH}
            Z`}
        fill="#000"
      />
      {/* Bras passif */}
      <path
        d={`M${x - 22 * s * flip},${y - bodyH + 10 * s}
            Q${x - 35 * s * flip},${y - bodyH + 60 * s}
              ${x - 28 * s * flip},${y - bodyH + 90 * s}`}
        stroke="#000" strokeWidth={9 * s} fill="none" strokeLinecap="round"
      />
      {/* Bras tendu vers le lion */}
      <path
        d={`M${x + 22 * s * flip},${y - bodyH + 10 * s}
            Q${x + 55 * s * flip},${y - bodyH + 30 * s - armAngle * 40 * s}
              ${x + 80 * s * flip},${y - bodyH + 50 * s - armAngle * 70 * s}`}
        stroke="#000" strokeWidth={9 * s} fill="none" strokeLinecap="round"
      />
      {/* Tete */}
      <circle cx={x} cy={headY} r={28 * s} fill="#000" />
      <ellipse cx={x} cy={headY - 26 * s} rx={14 * s} ry={8 * s} fill="#000" />
    </g>
  );
};

// ============================================================
// Hutte africaine — toit parabolique + foyer flickering
// ============================================================

const Hutte: React.FC<{ x: number; y: number; scale?: number; frame?: number; seed?: number }> = ({
  x, y, scale = 1, frame = 0, seed = 0,
}) => {
  const s = scale;
  const w = 80 * s;
  const h = 60 * s;
  const roofH = 55 * s;
  const flickerOpacity = 0.3 + Math.sin(frame * 0.2 + seed) * 0.15 + Math.sin(frame * 0.37 + seed * 1.7) * 0.08;

  return (
    <g>
      <path
        d={`M${x - w},${y}
            Q${x - w - 8 * s},${y - h * 0.6} ${x - w * 0.3},${y - h}
            Q${x},${y - h * 1.1} ${x + w * 0.3},${y - h}
            Q${x + w + 8 * s},${y - h * 0.6} ${x + w},${y}
            Z`}
        fill="#000"
      />
      <path
        d={`M${x - w - 10 * s},${y - h + 5 * s} Q${x},${y - h - roofH} ${x + w + 10 * s},${y - h + 5 * s}`}
        stroke="#000" strokeWidth={18 * s} fill="none" strokeLinecap="round"
      />
      <circle cx={x} cy={y - 15 * s} r={8 * s} fill="#FF6030" opacity={flickerOpacity} filter="url(#soft-lg)" />
    </g>
  );
};

// ============================================================
// Riviere-esprit
// ============================================================

const RiviereSpirit: React.FC<{
  x: number; y: number; scale?: number; wavePhase?: number; opacity?: number;
}> = ({ x, y, scale = 1, wavePhase = 0, opacity = 1 }) => {
  const s = scale;
  const w1 = Math.sin(wavePhase) * 12 * s;
  const w2 = Math.sin(wavePhase + 1.2) * 10 * s;
  const bodyH = 160 * s;

  return (
    <g opacity={opacity}>
      <path
        d={`M${x - 25 * s + w1},${y}
            Q${x - 30 * s + w2},${y - bodyH * 0.4}
              ${x - 20 * s + w1},${y - bodyH * 0.6}
            Q${x - 15 * s + w2},${y - bodyH * 0.8}
              ${x + w1},${y - bodyH}
            Q${x + 15 * s + w2},${y - bodyH * 0.8}
              ${x + 20 * s + w1},${y - bodyH * 0.6}
            Q${x + 30 * s + w2},${y - bodyH * 0.4}
              ${x + 25 * s + w1},${y}
            Z`}
        fill="#2A5A9A"
        opacity={0.85}
      />
      <circle cx={x + w1 * 0.5} cy={y - bodyH - 30 * s} r={28 * s} fill="#2A5A9A" opacity={0.85} />
      <path
        d={`M${x - 25 * s + w1},${y - bodyH * 0.5}
            Q${x - 70 * s},${y - bodyH * 0.45 + w2} ${x - 90 * s},${y - bodyH * 0.35}`}
        stroke="#3A6AA8" strokeWidth={12 * s} fill="none" strokeLinecap="round"
      />
      <path
        d={`M${x + 25 * s + w1},${y - bodyH * 0.5}
            Q${x + 70 * s},${y - bodyH * 0.45 + w2} ${x + 90 * s},${y - bodyH * 0.35}`}
        stroke="#3A6AA8" strokeWidth={12 * s} fill="none" strokeLinecap="round"
      />
      <ellipse
        cx={x + w1 * 0.3} cy={y - bodyH * 0.3}
        rx={8 * s} ry={20 * s}
        fill="#C8D0E8" opacity={0.2} filter="url(#water-blur)"
      />
    </g>
  );
};

// ============================================================
// Herbes premier plan
// ============================================================

const GrassStrip: React.FC<{ y: number; count?: number; frame?: number; color?: string }> = ({
  y, count = 35, frame = 0, color = "#000",
}) => (
  <g>
    {Array.from({ length: count }).map((_, i) => {
      const gx = (W / count) * i + ((i * 137) % 60) - 20;
      const gh = 18 + ((i * 37) % 24);
      const wind = Math.sin(frame * 0.04 + i * 0.55) * 5;
      return (
        <path
          key={i}
          d={`M${gx},${y} Q${gx + wind},${y - gh * 0.6} ${gx + wind * 1.5},${y - gh}`}
          stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round"
          opacity={0.7 + (i % 3) * 0.1}
        />
      );
    })}
  </g>
);

// ============================================================
// Etoiles (S2 nuit)
// ============================================================

const Etoiles: React.FC<{ frame: number; opacity?: number }> = ({ frame, opacity = 1 }) => (
  <g opacity={opacity}>
    {Array.from({ length: 60 }).map((_, i) => {
      const seed = i * 6271;
      const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
      const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % 380;
      const twinkle = 0.4 + Math.sin(frame * 0.06 + i * 0.8) * 0.3;
      return <circle key={i} cx={sx} cy={sy} r={(i % 4) * 0.6 + 0.6} fill="#C8D0E8" opacity={twinkle} />;
    })}
  </g>
);

// ============================================================
// Particules finales S4
// ============================================================

const ParticulesFinales: React.FC<{ frame: number; burstFrame: number }> = ({ frame, burstFrame }) => {
  const elapsed = frame - burstFrame;
  if (elapsed < 0) return null;
  return (
    <g>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = ((i * 18) * Math.PI) / 180;
        const dist = 80 + i * 22 + elapsed * 0.8;
        const px = W / 2 + Math.cos(angle) * dist;
        const py = GROUND_Y - 180 - elapsed * 1.2 - i * 10;
        const op = clamp(1 - elapsed / 150);
        return <circle key={i} cx={px} cy={py} r={3 + (i % 3)} fill="#F5C830" opacity={op * 0.9} />;
      })}
    </g>
  );
};

// ============================================================
// Scene 1 — Savane Crepuscule
// ============================================================

const Scene1Savane: React.FC<{ frame: number }> = ({ frame }) => {
  const { s1 } = LION_SCENE_TIMING.scenes;
  const local = frame - s1.startFrame;

  const sceneOpacity = local < 25
    ? ci(local, [0, 25], [0, 1])
    : ci(frame, [VISUAL_CUES.s1_fade_out, VISUAL_CUES.s1_fade_out + 25], [1, 0]);

  const lionX = ci(local, [30, 200], [W + 200, 950]);
  const walkPhase = local * 0.08;
  const dustOpacity = ci(local, [30, 80], [0, 0.6]);

  return (
    <g opacity={sceneOpacity}>
      <rect width={W} height={H} fill="url(#s1-sky)" />

      {/* Halo soleil couchant */}
      <ellipse cx={960} cy={GROUND_Y} rx={800} ry={180} fill="url(#s1-sun)" filter="url(#glow-md)" opacity={0.8} />
      <circle cx={960} cy={GROUND_Y - 10} r={70} fill="#F5C842" opacity={0.75} filter="url(#glow-md)" />

      {/* Sol */}
      <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#3D1F08" />
      <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#5A2E0A" strokeWidth={2} />

      {/* Brouillard de chaleur */}
      <ellipse cx={500} cy={GROUND_Y} rx={550} ry={60} fill="#1A0C04" opacity={0.5} filter="url(#soft)" />
      <ellipse cx={1400} cy={GROUND_Y} rx={480} ry={50} fill="#1A0C04" opacity={0.4} filter="url(#soft)" />

      {/* Baobabs */}
      <Baobab x={200}  y={GROUND_Y} scale={0.55} />
      <Baobab x={500}  y={GROUND_Y} scale={0.4} />
      <Baobab x={1500} y={GROUND_Y} scale={0.5} />
      <Baobab x={1750} y={GROUND_Y} scale={0.38} />

      {/* Poussiere */}
      <g opacity={dustOpacity}>
        {Array.from({ length: 18 }).map((_, i) => {
          const px = (lionX + i * 22 + ((i * 37) % 80)) % W;
          const py = GROUND_Y - 8 - (i % 5) * 12;
          const tw = 0.3 + Math.sin(local * 0.08 + i * 1.1) * 0.2;
          return <circle key={i} cx={px} cy={py} r={2 + (i % 3)} fill="#D4922A" opacity={tw} />;
        })}
      </g>

      <GrassStrip y={GROUND_Y} count={40} frame={local} />
      <LionSilhouette x={lionX} y={GROUND_Y} scale={1.35} walkPhase={walkPhase} facing="left" />
    </g>
  );
};

// ============================================================
// Scene 2 — Nuit Bleue / Confrontation
// ============================================================

const Scene2Nuit: React.FC<{ frame: number }> = ({ frame }) => {
  const { s2 } = LION_SCENE_TIMING.scenes;
  const local = frame - s2.startFrame;

  const sceneOpacity = local < 25
    ? ci(local, [0, 25], [0, 1])
    : ci(frame, [VISUAL_CUES.s2_fade_out, VISUAL_CUES.s2_fade_out + 25], [1, 0]);

  const moonFlicker = 0.85 + Math.sin(frame * 0.07) * 0.1 + Math.sin(frame * 0.23) * 0.05;
  const lionX = ci(local, [30, 120], [W + 150, 800]);
  const walkPhase = local * 0.08;
  const rivOpacity = ci(local, [30, 80], [0, 1]);
  const wavePhase = local * 0.07;
  const redOpacity = ci(
    frame,
    [VISUAL_CUES.s2_lion_approach, VISUAL_CUES.s2_lion_approach + 40, 800, 850],
    [0, 0.38, 0.38, 0]
  );
  const starsOpacity = ci(local, [0, 60], [0, 1]);

  return (
    <g opacity={sceneOpacity}>
      <rect width={W} height={H} fill="url(#s2-sky)" />
      <Etoiles frame={frame} opacity={starsOpacity} />

      {/* Lune en croissant — technique S06 exacte */}
      <circle cx={1600} cy={160} r={200} fill="url(#s2-moon)" filter="url(#glow-md)" opacity={moonFlicker} />
      <circle cx={1600} cy={160} r={66} fill="#D8E4F8" opacity={moonFlicker * 0.92} />
      <circle cx={1628} cy={148} r={57} fill="#040D2E" opacity={0.66} />

      {/* Aura danger */}
      {redOpacity > 0 && (
        <circle cx={lionX} cy={GROUND_Y - 150} r={280} fill="url(#s2-danger)" filter="url(#glow-md)" opacity={redOpacity} />
      )}

      <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#0A1828" />
      <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#1A3A5A" strokeWidth={2} />

      {/* Reflets riviere au sol */}
      {Array.from({ length: 4 }).map((_, i) => (
        <ellipse
          key={i}
          cx={500 + i * 80 + Math.sin(wavePhase + i) * 12}
          cy={GROUND_Y + 20 + i * 8}
          rx={60 - i * 8} ry={6}
          fill="#2A5A9A" opacity={0.25 - i * 0.04} filter="url(#water-blur)"
        />
      ))}

      <ellipse cx={500} cy={GROUND_Y} rx={400} ry={50} fill="#0A1828" opacity={0.55} filter="url(#soft)" />
      <Baobab x={150}  y={GROUND_Y} scale={0.6} />
      <Baobab x={1700} y={GROUND_Y} scale={0.5} />
      <GrassStrip y={GROUND_Y} count={40} frame={local} color="#051020" />

      <g opacity={rivOpacity}>
        <RiviereSpirit x={500} y={GROUND_Y} scale={1.3} wavePhase={wavePhase} />
      </g>
      <LionSilhouette x={lionX} y={GROUND_Y} scale={1.35} walkPhase={walkPhase} facing="left" />
    </g>
  );
};

// ============================================================
// Scene 3 — Aube Rose / Enfant
// ============================================================

const Scene3Aube: React.FC<{ frame: number }> = ({ frame }) => {
  const { s3 } = LION_SCENE_TIMING.scenes;
  const local = frame - s3.startFrame;

  const sceneOpacity = local < 25
    ? ci(local, [0, 25], [0, 1])
    : ci(frame, [VISUAL_CUES.s3_fade_out, VISUAL_CUES.s3_fade_out + 25], [1, 0]);

  const childX = spring({
    frame: local - 35,
    fps: FPS,
    config: { damping: 200, stiffness: 80 },
    from: W + 150,
    to: 1180,
  });

  const lionX = ci(local, [70, 170], [720, 560]);
  const armExtension = ci(local, [80, 150], [0, 1]);
  const dawnOpacity = ci(local, [0, 80], [0, 0.7]);

  return (
    <g opacity={sceneOpacity}>
      <rect width={W} height={H} fill="url(#s3-sky)" />

      {/* Halo aube */}
      <ellipse cx={960} cy={GROUND_Y} rx={900} ry={250} fill="url(#s3-dawn)" filter="url(#glow-lg)" opacity={dawnOpacity} />

      <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#2C1A00" />
      <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#5A3A10" strokeWidth={2} />

      <ellipse cx={700} cy={GROUND_Y} rx={600} ry={55} fill="#1A0A00" opacity={0.45} filter="url(#soft)" />

      <Hutte x={200}  y={GROUND_Y} scale={0.85} frame={local} seed={1} />
      <Hutte x={380}  y={GROUND_Y} scale={0.65} frame={local} seed={3} />
      <Hutte x={1650} y={GROUND_Y} scale={0.80} frame={local} seed={7} />
      <Hutte x={1820} y={GROUND_Y} scale={0.60} frame={local} seed={11} />

      <Baobab x={800}  y={GROUND_Y} scale={0.35} />
      <Baobab x={1250} y={GROUND_Y} scale={0.30} />

      <GrassStrip y={GROUND_Y} count={45} frame={local} />
      <LionSilhouette x={lionX} y={GROUND_Y} scale={1.3} sitting={true} facing="right" />
      <EnfantSilhouette x={childX} y={GROUND_Y} scale={1.1} armAngle={armExtension} facing="left" />
    </g>
  );
};

// ============================================================
// Scene 4 — Aurore Doree / Inclinaison
// ============================================================

const Scene4Aurore: React.FC<{ frame: number }> = ({ frame }) => {
  const { s4 } = LION_SCENE_TIMING.scenes;
  const local = frame - s4.startFrame;

  const sceneOpacity = local < 25
    ? ci(local, [0, 25], [0, 1])
    : ci(frame, [VISUAL_CUES.s4_fade_out_start, VISUAL_CUES.s4_fade_out_start + 50], [1, 0]);

  const inclineAngle = ci(local, [35, 140], [0, -32]);
  const sunY = ci(local, [0, 250], [GROUND_Y + 20, GROUND_Y - 160]);
  const sunFlicker = 0.9 + Math.sin(frame * 0.07) * 0.07 + Math.sin(frame * 0.19) * 0.03;

  const flashOpacity = ci(
    frame,
    [VISUAL_CUES.s4_light_burst, VISUAL_CUES.s4_light_burst + 20, VISUAL_CUES.s4_light_burst + 80, VISUAL_CUES.s4_light_burst + 120],
    [0, 1, 1, 0]
  );

  const waterRise = ci(frame, [VISUAL_CUES.s4_water_rise, VISUAL_CUES.s4_water_rise + 200], [0, 80]);
  const wavePhase = local * 0.08;

  return (
    <g opacity={sceneOpacity}>
      <rect width={W} height={H} fill="url(#s4-sky)" />

      {/* Halo soleil */}
      <circle cx={960} cy={sunY} r={600} fill="url(#s4-sun)" filter="url(#glow-xl)" opacity={sunFlicker * 0.9} />
      <circle cx={960} cy={sunY} r={90} fill="#FFFCE0" opacity={sunFlicker * 0.95} filter="url(#glow-md)" />

      {/* Flash explosion */}
      {flashOpacity > 0.01 && (
        <circle cx={960} cy={GROUND_Y - 100} r={1400} fill="url(#s4-flash)" filter="url(#glow-xl)" opacity={flashOpacity * 0.8} />
      )}

      <rect x={0} y={GROUND_Y - waterRise} width={W} height={H - GROUND_Y + waterRise} fill="#2A0A00" />
      <line x1={0} y1={GROUND_Y - waterRise} x2={W} y2={GROUND_Y - waterRise} stroke="#4A6A9A" strokeWidth={2} />

      {/* Reflets eau */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse
          key={i}
          cx={400 + i * 280 + Math.sin(wavePhase + i) * 15}
          cy={GROUND_Y - waterRise + 12 + i * 6}
          rx={80 - i * 10} ry={7}
          fill="#F5C830" opacity={0.22 - i * 0.03} filter="url(#water-blur)"
        />
      ))}

      <Baobab x={200}  y={GROUND_Y - waterRise} scale={0.65} />
      <Baobab x={1750} y={GROUND_Y - waterRise} scale={0.6} />
      <GrassStrip y={GROUND_Y - waterRise} count={35} frame={local} />

      <LionSilhouette x={820} y={GROUND_Y - waterRise} scale={1.4} sitting={true} inclineAngle={inclineAngle} facing="right" />
      <RiviereSpirit x={1200} y={GROUND_Y - waterRise} scale={1.45} wavePhase={wavePhase} opacity={0.85 + flashOpacity * 0.15} />
      <ParticulesFinales frame={frame} burstFrame={VISUAL_CUES.s4_light_burst} />
    </g>
  );
};

// ============================================================
// Composition principale
// ============================================================

export const LionEtLaRiviere: React.FC = () => {
  const frame = useCurrentFrame();
  const { s1, s2, s3, s4 } = LION_SCENE_TIMING.scenes;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <AllDefs />
        {frame < s2.startFrame + 30 && <Scene1Savane frame={frame} />}
        {frame >= s2.startFrame - 30 && frame < s3.startFrame + 30 && <Scene2Nuit frame={frame} />}
        {frame >= s3.startFrame - 30 && frame < s4.startFrame + 30 && <Scene3Aube frame={frame} />}
        {frame >= s4.startFrame - 30 && <Scene4Aurore frame={frame} />}
      </svg>

      {/* Narration — HORS du SVG (Remotion : Audio = element HTML) */}
      <Sequence from={s1.startFrame + s1.audioStartFrame} durationInFrames={AUDIO_DURATION_FRAMES.s1 + 10}>
        <Audio src={staticFile(s1.audioSrc)} />
      </Sequence>
      <Sequence from={s2.startFrame + s2.audioStartFrame} durationInFrames={AUDIO_DURATION_FRAMES.s2 + 10}>
        <Audio src={staticFile(s2.audioSrc)} />
      </Sequence>
      <Sequence from={s3.startFrame + s3.audioStartFrame} durationInFrames={AUDIO_DURATION_FRAMES.s3 + 10}>
        <Audio src={staticFile(s3.audioSrc)} />
      </Sequence>
      <Sequence from={s4.startFrame + s4.audioStartFrame} durationInFrames={AUDIO_DURATION_FRAMES.s4 + 10}>
        <Audio src={staticFile(s4.audioSrc)} />
      </Sequence>

      {/* Ambiances musicales — une passe par scene (20s couvre la duree de chaque scene) */}
      <Sequence from={s1.startFrame} durationInFrames={s1.durationInFrames}>
        <Audio src={staticFile("audio/silhouette-conte/ambiance/a1_savane.mp3")} volume={0.22} />
      </Sequence>

      <Sequence from={s2.startFrame} durationInFrames={s2.durationInFrames}>
        <Audio src={staticFile("audio/silhouette-conte/ambiance/a2_nuit.mp3")} volume={0.2} />
      </Sequence>

      <Sequence from={s3.startFrame} durationInFrames={s3.durationInFrames}>
        <Audio src={staticFile("audio/silhouette-conte/ambiance/a3_aube.mp3")} volume={0.22} />
      </Sequence>

      <Sequence from={s4.startFrame} durationInFrames={s4.durationInFrames}>
        <Audio src={staticFile("audio/silhouette-conte/ambiance/a4_aurore.mp3")} volume={0.25} />
      </Sequence>

      {/* Titre */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          pointerEvents: "none",
          opacity: interpolate(frame, [0, 30, 360, 420], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 28,
            letterSpacing: 6,
            color: "#FFD700",
            opacity: 0.9,
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(255,140,0,0.8)",
          }}
        >
          Le Lion et la Riviere qui Parle
        </div>
      </div>
    </AbsoluteFill>
  );
};
