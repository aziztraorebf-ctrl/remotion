import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle } from "./ShowcaseShared";

const BG      = "#080408";
const SHADOW  = "#0d080d";
const GLOW    = "#c8d0e8";
const BLOOD_R = "#7a1a14";
const FOG_COL = "#1a1018";

const SilhouetteDefs: React.FC = () => (
  <defs>
    <radialGradient id="s06-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#e8f0ff" stopOpacity="0.95" />
      <stop offset="60%" stopColor="#c0c8e0" stopOpacity="0.6" />
      <stop offset="100%" stopColor="#c0c8e0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="s06-red-moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={BLOOD_R} stopOpacity="0.7" />
      <stop offset="100%" stopColor={BLOOD_R} stopOpacity="0" />
    </radialGradient>
    <filter id="s06-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="s06-soft" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2" />
    </filter>
    <linearGradient id="s06-fog" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={FOG_COL} stopOpacity="0" />
      <stop offset="100%" stopColor={FOG_COL} stopOpacity="0.7" />
    </linearGradient>
  </defs>
);

// Death figure (La Mort) — hooded silhouette with animated scythe
const DeathFigure: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  scytheRaise: number;  // 0..1
}> = ({ x, y, walkPhase, scytheRaise }) => {
  const bob = Math.abs(Math.sin(walkPhase)) * 4;
  const legSwing = Math.sin(walkPhase) * 0.22;
  const legSwing2 = Math.sin(walkPhase + Math.PI) * 0.22;

  const legLen = 90;
  const figureH = 280;
  const figureTopY = y - figureH + bob;

  // Scythe arm angle
  const scytheAngle = interpolate(scytheRaise, [0, 1], [30, -70]);

  return (
    <g color={SHADOW}>
      {/* Body shadow / fog base */}
      <ellipse cx={x} cy={y - 10} rx={48} ry={18} fill={SHADOW} opacity={0.6} filter="url(#s06-soft)" />

      {/* Left leg */}
      <g transform={`translate(${x - 16}, ${y - legLen}) rotate(${legSwing2 * 30}, 0, 0)`}>
        <path d={`M0,0 Q-8,${legLen * 0.5} ${Math.sin(legSwing2) * 12},${legLen}`} stroke={SHADOW} strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>
      {/* Right leg */}
      <g transform={`translate(${x + 16}, ${y - legLen}) rotate(${legSwing * 30}, 0, 0)`}>
        <path d={`M0,0 Q8,${legLen * 0.5} ${Math.sin(legSwing) * -12},${legLen}`} stroke={SHADOW} strokeWidth="14" fill="none" strokeLinecap="round" />
      </g>

      {/* Robe */}
      <path
        d={`M${x - 42},${figureTopY + 80} Q${x - 52},${y - 40} ${x - 30},${y} L${x + 30},${y} Q${x + 52},${y - 40} ${x + 42},${figureTopY + 80} Z`}
        fill={SHADOW}
      />
      {/* Robe folds as lines */}
      {[-16, 0, 16].map((ox, i) => (
        <path
          key={i}
          d={`M${x + ox},${figureTopY + 90} Q${x + ox - 4},${y - 60} ${x + ox},${y}`}
          stroke="#1a1018"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
      ))}

      {/* Arms */}
      <g transform={`translate(${x - 38}, ${figureTopY + 82})`}>
        <path d="M0,0 Q-14,30 -8,62" stroke={SHADOW} strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>

      {/* Scythe arm (right) — raises */}
      <g transform={`translate(${x + 38}, ${figureTopY + 82}) rotate(${scytheAngle}, 0, 0)`}>
        <path d="M0,0 Q14,30 8,65" stroke={SHADOW} strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* Scythe pole */}
        <line x1="6" y1="58" x2="6" y2={58 - 160} stroke={SHADOW} strokeWidth="6" strokeLinecap="round" />
        {/* Scythe blade */}
        <path d="M6,-102 Q80,-130 82,-80 Q60,-60 6,-78 Z" fill={GLOW} opacity="0.9" />
        {/* Blade edge glint */}
        <path d="M6,-102 Q80,-130 82,-80" stroke={GLOW} strokeWidth="1.5" fill="none" opacity="0.6" />
      </g>

      {/* Torso */}
      <rect x={x - 38} y={figureTopY + 60} width={76} height={100} rx={4} fill={SHADOW} />

      {/* Hood */}
      <path
        d={`M${x - 40},${figureTopY + 80} Q${x - 44},${figureTopY + 20} ${x},${figureTopY} Q${x + 44},${figureTopY + 20} ${x + 40},${figureTopY + 80} Z`}
        fill={SHADOW}
      />
      {/* Face — just void */}
      <ellipse cx={x} cy={figureTopY + 52} rx={22} ry={20} fill={BG} opacity="0.9" />
      {/* Eye glows — spectral */}
      <circle cx={x - 8} cy={figureTopY + 50} r={3} fill={GLOW} opacity="0.55" />
      <circle cx={x + 8} cy={figureTopY + 50} r={3} fill={GLOW} opacity="0.55" />
    </g>
  );
};

// Survivor figure — smaller, crouching
const SurvivorFigure: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  shrink: number;     // 0..1 crouches when death approaches
}> = ({ x, y, walkPhase, shrink }) => {
  const bob = Math.abs(Math.sin(walkPhase)) * 3;
  const figureH = 220 * (1 - shrink * 0.3);
  const figureTopY = y - figureH + bob;

  const legSwing = Math.sin(walkPhase) * 0.18;
  const legSwing2 = Math.sin(walkPhase + Math.PI) * 0.18;

  return (
    <g color={SHADOW}>
      {/* Shadow */}
      <ellipse cx={x} cy={y - 8} rx={38} ry={14} fill={SHADOW} opacity={0.5} filter="url(#s06-soft)" />

      {/* Legs */}
      <g transform={`translate(${x - 12}, ${y - 60}) rotate(${legSwing2 * 25}, 0, 0)`}>
        <path d="M0,0 L-4,60" stroke={SHADOW} strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${x + 12}, ${y - 60}) rotate(${legSwing * 25}, 0, 0)`}>
        <path d="M0,0 L4,60" stroke={SHADOW} strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>

      {/* Cloak body */}
      <path
        d={`M${x - 34},${figureTopY + 60} Q${x - 40},${y - 35} ${x - 22},${y} L${x + 22},${y} Q${x + 40},${y - 35} ${x + 34},${figureTopY + 60} Z`}
        fill={SHADOW}
      />

      {/* Arms */}
      <path
        d={`M${x - 30},${figureTopY + 64} Q${x - 40},${figureTopY + 100} ${x - 26},${figureTopY + 128}`}
        stroke={SHADOW} strokeWidth="10" fill="none" strokeLinecap="round"
      />
      <path
        d={`M${x + 30},${figureTopY + 64} Q${x + 40},${figureTopY + 100} ${x + 26},${figureTopY + 128}`}
        stroke={SHADOW} strokeWidth="10" fill="none" strokeLinecap="round"
      />

      {/* Head/hood */}
      <path
        d={`M${x - 30},${figureTopY + 64} Q${x - 34},${figureTopY + 14} ${x},${figureTopY} Q${x + 34},${figureTopY + 14} ${x + 30},${figureTopY + 64} Z`}
        fill={SHADOW}
      />
      {/* Face void */}
      <ellipse cx={x} cy={figureTopY + 40} rx={16} ry={15} fill={BG} opacity="0.88" />
    </g>
  );
};

export const S06Silhouette: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Death walks from left
  const deathX = interpolate(frame, [20, 90], [180, 680], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalDeathX = frame >= 90 ? 680 : deathX;

  // Survivor walks from right, then freezes
  const survX = interpolate(frame, [30, 95], [W - 180, 1120], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalSurvX = frame >= 95 ? 1120 : survX;

  const deathPhase = frame * 0.11;
  const survPhase = frame * 0.13 + 0.6;

  // Death raises scythe at f130
  const scytheRaise = interpolate(frame, [130, 165], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scytheLower = interpolate(frame, [240, 270], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalScythe = frame >= 240 ? scytheRaise * scytheLower : scytheRaise;

  // Survivor shrinks
  const survShrink = interpolate(frame, [140, 175], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const survRecover = interpolate(frame, [240, 268], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalShrink = frame >= 240 ? survShrink * survRecover : survShrink;

  // Moon flicker — dramatic
  const moonFlicker = 0.85 + Math.sin(frame * 0.07) * 0.1 + Math.sin(frame * 0.23) * 0.05;

  // Red aura when scythe raised
  const redOpacity = interpolate(frame, [130, 170, 240, 265], [0, 0.35, 0.35, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <SilhouetteDefs />

        {/* Deep dark sky */}
        <rect width={W} height={H} fill={BG} />

        {/* Moon glow halo */}
        <circle cx={960} cy={160} r={220} fill="url(#s06-moon)" opacity={moonFlicker} filter="url(#s06-glow)" />
        {/* Moon disc */}
        <circle cx={960} cy={160} r={72} fill="#d8e4f8" opacity={moonFlicker * 0.92} />
        {/* Moon shadow (crescent effect) */}
        <circle cx={985} cy={148} r={62} fill={BG} opacity={0.62} />

        {/* Red omen aura */}
        {redOpacity > 0 && (
          <circle cx={960} cy={160} r={280} fill="url(#s06-red-moon)" opacity={redOpacity} filter="url(#s06-glow)" />
        )}

        {/* Stars */}
        {Array.from({ length: 60 }).map((_, i) => {
          const seed = i * 6271;
          const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % W;
          const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % 480;
          const twinkle = 0.4 + Math.sin(frame * 0.06 + i * 0.8) * 0.3;
          return (
            <circle key={i} cx={sx} cy={sy} r={(i % 4) * 0.6 + 0.6} fill={GLOW} opacity={twinkle} />
          );
        })}

        {/* Dark ground */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#0d0810" />
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#1a1020" strokeWidth={2} />

        {/* Fog layers */}
        <ellipse cx={500} cy={GROUND_Y} rx={600} ry={80} fill={FOG_COL} opacity={0.55} />
        <ellipse cx={1400} cy={GROUND_Y} rx={500} ry={60} fill={FOG_COL} opacity={0.45} />

        {/* Silhouette buildings */}
        {[100, 520, 1300, 1720].map((bx, i) => {
          const bh = [240, 310, 270, 200][i];
          const bw = [120, 100, 140, 90][i];
          return (
            <g key={i} opacity="0.85">
              <rect x={bx} y={GROUND_Y - bh} width={bw} height={bh} fill={SHADOW} />
              <polygon
                points={`${bx},${GROUND_Y - bh} ${bx + bw / 2},${GROUND_Y - bh - 70} ${bx + bw},${GROUND_Y - bh}`}
                fill={SHADOW}
              />
              {/* Faint window glow */}
              <rect x={bx + bw / 2 - 10} y={GROUND_Y - bh + 40} width={20} height={28} rx={2} fill="#2a1a08" opacity="0.7" />
            </g>
          );
        })}

        {/* Survivor */}
        <SurvivorFigure x={finalSurvX} y={GROUND_Y} walkPhase={frame < 95 ? survPhase : 0} shrink={finalShrink} />

        {/* Death */}
        <DeathFigure x={finalDeathX} y={GROUND_Y} walkPhase={frame < 90 ? deathPhase : 0} scytheRaise={finalScythe} />

        {/* Fog overlay bottom */}
        <rect x={0} y={GROUND_Y - 60} width={W} height={H - GROUND_Y + 60} fill="url(#s06-fog)" />

        {/* Frame border */}
        <rect x={0} y={0} width={W} height={H} fill="none" stroke="#1a1020" strokeWidth={4} />
      </svg>

      <StyleTitle
        frame={frame}
        number="06"
        title="SVG Silhouette / Theatre d'Ombres"
        subtitle="Formes pleines noires — contre-jour — atmospherique"
        textColor={GLOW}
        bgColor="rgba(8,4,8,0.92)"
      />
    </div>
  );
};
