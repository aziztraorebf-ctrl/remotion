import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

// Palette enluminure (same as Enluminure.tsx)
const GOLD        = "#c9a84c";
const GOLD_BRIGHT = "#f0d060";
const GOLD_DARK   = "#8a6820";
const LAPIS       = "#1a3a7a";
const LAPIS_MID   = "#2a5aaa";
const VERMILLON   = "#c8301a";
const VERMILLON_MID = "#e04828";
const VERT        = "#2a6a30";
const OCRE        = "#c8a040";
const OCRE_PALE   = "#f0dca0";
const CHAIR       = "#e8c898";
const CHAIR_DARK  = "#c8a070";
const INK         = "#1a1008";
const PARCHMENT   = "#f4e8c8";
const STONE       = "#b8a888";

const EnlumDefs: React.FC = () => (
  <defs>
    <linearGradient id="s03-gold-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={GOLD_BRIGHT} />
      <stop offset="50%" stopColor={GOLD} />
      <stop offset="100%" stopColor={GOLD_DARK} />
    </linearGradient>
    <linearGradient id="s03-lapis" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={LAPIS_MID} />
      <stop offset="100%" stopColor={LAPIS} />
    </linearGradient>
    <linearGradient id="s03-vermillon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={VERMILLON_MID} />
      <stop offset="100%" stopColor={VERMILLON} />
    </linearGradient>
    <linearGradient id="s03-sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#8abbe8" />
      <stop offset="100%" stopColor="#d4e8f0" />
    </linearGradient>
    <filter id="s03-drop" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={INK} floodOpacity="0.28" />
    </filter>
    <filter id="s03-parch" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="8" result="n" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.82  0 0 0 0 0.62  0 0 0 0.08 0" result="t" />
      <feComposite in="t" in2="SourceGraphic" operator="over" />
    </filter>
    <pattern id="s03-arabesque" patternUnits="userSpaceOnUse" width="40" height="40">
      <rect width="40" height="40" fill={OCRE_PALE} />
      <path d="M20,0 Q30,10 20,20 Q10,10 20,0" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
      <path d="M0,20 Q10,30 20,20 Q10,10 0,20" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
      <path d="M20,20 Q30,30 20,40 Q10,30 20,20" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
    </pattern>
  </defs>
);

// Noble enluminure character
const EnlumNoble: React.FC<{ x: number; y: number; walkPhase: number; talking?: boolean }> = ({
  x, y, walkPhase, talking = false,
}) => {
  const bobY = Math.abs(Math.sin(walkPhase)) * 5;
  const legAngle = Math.sin(walkPhase) * 22;
  const legAngle2 = Math.sin(walkPhase + Math.PI) * 22;
  const armAngle = Math.sin(walkPhase + Math.PI) * 18;
  const talkArmAngle = talking ? -35 : Math.sin(walkPhase) * 18;

  // Dimensions
  const hr = 24; // head radius
  const tw = 58; const th = 82; // torso
  const ll = 80; const lw = 20; // leg
  const al = 68; const aw = 16; // arm
  const headY = y - th - ll - hr * 2 - 4 + bobY;
  const torsoY = y - th - ll + bobY;
  const hipY = y - ll + bobY;

  return (
    <g filter="url(#s03-drop)">
      {/* Back leg */}
      <g transform={`translate(${x - 14}, ${hipY}) rotate(${legAngle2}, 0, 0)`}>
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={lw / 2} fill="url(#s03-lapis)" stroke={INK} strokeWidth="1.5" />
        <rect x={-10} y={ll - 14} width={22} height={16} rx={6} fill={INK} />
      </g>
      {/* Back arm */}
      <g transform={`translate(${x - tw / 2 + 6}, ${torsoY + 14}) rotate(${armAngle}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={aw / 2} fill={CHAIR} stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al * 0.5} rx={aw / 2} fill="url(#s03-vermillon)" stroke={INK} strokeWidth="1.5" />
      </g>
      {/* Manteau (cloak) */}
      <path
        d={`M${x - tw / 2 - 12},${torsoY + 8} Q${x - tw / 2 - 24},${torsoY + th + 20} ${x - 30},${hipY + 20} Q${x - 10},${hipY + 6} ${x},${hipY}`}
        fill={GOLD}
        stroke={INK}
        strokeWidth="1.5"
        opacity="0.85"
      />
      {/* Torso */}
      <rect x={x - tw / 2} y={torsoY} width={tw} height={th} rx={12} fill="url(#s03-vermillon)" stroke={INK} strokeWidth="2" />
      {/* Gold belt */}
      <rect x={x - tw / 2} y={torsoY + th * 0.65} width={tw} height={14} rx={5} fill="url(#s03-gold-sheen)" stroke={INK} strokeWidth="1.5" />
      {/* Front arm */}
      <g transform={`translate(${x + tw / 2 - 6}, ${torsoY + 14}) rotate(${talkArmAngle}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={aw / 2} fill={CHAIR} stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al * 0.5} rx={aw / 2} fill="url(#s03-vermillon)" stroke={INK} strokeWidth="1.5" />
        {/* Hand */}
        <circle cx={0} cy={al} r={8} fill={CHAIR} stroke={INK} strokeWidth="1.5" />
      </g>
      {/* Front leg */}
      <g transform={`translate(${x + 14}, ${hipY}) rotate(${legAngle}, 0, 0)`}>
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={lw / 2} fill="url(#s03-lapis)" stroke={INK} strokeWidth="1.5" />
        <rect x={-10} y={ll - 14} width={22} height={16} rx={6} fill={INK} />
      </g>
      {/* Head */}
      <g transform={`translate(${x}, ${headY})`}>
        <ellipse cx={0} cy={hr} rx={hr} ry={hr * 1.12} fill={CHAIR} stroke={INK} strokeWidth="2" />
        {/* Gold crown/hat */}
        <polygon points={`-20,4 -22,-16 -10,-10 0,-22 10,-10 22,-16 20,4`} fill="url(#s03-gold-sheen)" stroke={INK} strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx={-9} cy={hr - 4} r={4} fill={INK} />
        <circle cx={9} cy={hr - 4} r={4} fill={INK} />
        <circle cx={-8} cy={hr - 5} r={1.5} fill={CHAIR_DARK} />
        <circle cx={10} cy={hr - 5} r={1.5} fill={CHAIR_DARK} />
        {/* Mouth — talking animation */}
        <path
          d={talking ? "M-8,${hr+8} Q0,${hr+14} 8,${hr+8}" : `M-8,${hr + 8} Q0,${hr + 12} 8,${hr + 8}`}
          stroke={INK}
          strokeWidth="1.8"
          fill={talking ? CHAIR_DARK : "none"}
          strokeLinecap="round"
        />
        {/* Beard */}
        <ellipse cx={0} cy={hr * 1.7} rx={14} ry={8} fill={INK} opacity="0.7" />
      </g>
    </g>
  );
};

// Priest enluminure character
const EnlumPretre: React.FC<{ x: number; y: number; walkPhase: number; praying?: boolean }> = ({
  x, y, walkPhase, praying = false,
}) => {
  const bobY = Math.abs(Math.sin(walkPhase)) * 5;
  const legAngle = Math.sin(walkPhase) * 20;
  const legAngle2 = Math.sin(walkPhase + Math.PI) * 20;

  const hr = 22;
  const tw = 52; const th = 88;
  const ll = 78; const lw = 18;
  const al = 64; const aw = 14;
  const headY = y - th - ll - hr * 2 - 4 + bobY;
  const torsoY = y - th - ll + bobY;
  const hipY = y - ll + bobY;

  const leftArmAngle = praying ? -20 : Math.sin(walkPhase) * 16;
  const rightArmAngle = praying ? 20 : Math.sin(walkPhase + Math.PI) * 16;

  return (
    <g filter="url(#s03-drop)">
      {/* Robe (cassock) — white/cream full length */}
      <path
        d={`M${x - tw / 2 - 8},${torsoY} Q${x - tw / 2 - 16},${hipY + 20} ${x - 20},${y + bobY} L${x + 20},${y + bobY} Q${x + tw / 2 + 16},${hipY + 20} ${x + tw / 2 + 8},${torsoY} Z`}
        fill={OCRE_PALE}
        stroke={INK}
        strokeWidth="2"
      />
      {/* Blue mantle */}
      <path
        d={`M${x - tw / 2 - 4},${torsoY + 6} Q${x - tw / 2 - 10},${hipY + 10} ${x - 14},${hipY + 22} Q${x + 14},${hipY + 22} ${x + tw / 2 + 10},${hipY + 10} Q${x + tw / 2 + 4},${torsoY + 6} ${x + tw / 2},${torsoY} L${x - tw / 2},${torsoY} Z`}
        fill="url(#s03-lapis)"
        stroke={INK}
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Gold cross pectoral */}
      <rect x={x - 4} y={torsoY + th * 0.3} width={8} height={20} rx={2} fill="url(#s03-gold-sheen)" stroke={INK} strokeWidth="1" />
      <rect x={x - 10} y={torsoY + th * 0.3 + 6} width={20} height={7} rx={2} fill="url(#s03-gold-sheen)" stroke={INK} strokeWidth="1" />
      {/* Arms (praying = raised and joined) */}
      <g transform={`translate(${x - tw / 2 + 4}, ${torsoY + 16}) rotate(${leftArmAngle}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={aw / 2} fill={CHAIR} stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al * 0.45} rx={aw / 2} fill={OCRE_PALE} stroke={INK} strokeWidth="1" />
      </g>
      <g transform={`translate(${x + tw / 2 - 4}, ${torsoY + 16}) rotate(${rightArmAngle}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={aw / 2} fill={CHAIR} stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al * 0.45} rx={aw / 2} fill={OCRE_PALE} stroke={INK} strokeWidth="1" />
      </g>
      {/* Head */}
      <g transform={`translate(${x}, ${headY})`}>
        <ellipse cx={0} cy={hr} rx={hr} ry={hr * 1.1} fill={CHAIR} stroke={INK} strokeWidth="2" />
        {/* Tonsure ring */}
        <ellipse cx={0} cy={hr * 0.2} rx={hr - 4} ry={(hr - 4) * 0.45} fill={CHAIR_DARK} opacity="0.5" />
        {/* Coif/hood band */}
        <rect x={-hr - 4} y={0} width={(hr + 4) * 2} height={10} rx={3} fill={OCRE_PALE} stroke={INK} strokeWidth="1.5" />
        {/* Eyes */}
        <circle cx={-8} cy={hr - 2} r={3.5} fill={INK} />
        <circle cx={8} cy={hr - 2} r={3.5} fill={INK} />
        {/* Serene expression */}
        <path d={`M-6,${hr + 8} Q0,${hr + 13} 6,${hr + 8}`} stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// Ornamental border (simplified)
const EnlumBorder: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g opacity={opacity}>
    {/* Outer gold border */}
    <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke="url(#s03-gold-sheen)" strokeWidth={10} />
    <rect x={36} y={36} width={W - 72} height={H - 72} fill="none" stroke={INK} strokeWidth={2} />
    {/* Corner ornaments */}
    {[[40, 40], [W - 40, 40], [40, H - 40], [W - 40, H - 40]].map(([cx, cy], i) => (
      <g key={i} transform={`translate(${cx}, ${cy})`}>
        <circle r={10} fill="url(#s03-gold-sheen)" stroke={INK} strokeWidth="1.5" />
        <circle r={4} fill={INK} />
      </g>
    ))}
    {/* Side vertical bands */}
    <rect x={28} y={80} width={40} height={H - 160} fill="url(#s03-arabesque)" opacity={0.7} />
    <rect x={W - 68} y={80} width={40} height={H - 160} fill="url(#s03-arabesque)" opacity={0.7} />
  </g>
);

// Banderole (speech/thought scroll)
const Banderole: React.FC<{ x: number; y: number; text: string; scaleSpring: number }> = ({
  x, y, text, scaleSpring,
}) => {
  const s = Math.max(0, Math.min(scaleSpring, 1));
  return (
    <g transform={`translate(${x}, ${y}) scale(${s}, ${s}) translate(${-x}, ${-y})`}>
      <rect x={x - 90} y={y - 28} width={180} height={48} rx={8} fill={PARCHMENT} stroke="url(#s03-gold-sheen)" strokeWidth={2.5} />
      <polygon points={`${x - 10},${y + 20} ${x + 10},${y + 20} ${x},${y + 38}`} fill={PARCHMENT} stroke="url(#s03-gold-sheen)" strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={18} fontFamily="Georgia, serif" fill={INK} fontStyle="italic">
        {text}
      </text>
    </g>
  );
};

// Parchment ground (dallage)
const Dallage: React.FC = () => (
  <g>
    {Array.from({ length: 9 }).map((_, row) =>
      Array.from({ length: 16 }).map((_, col) => (
        <rect
          key={`${row}-${col}`}
          x={col * 130 - (row % 2 === 0 ? 0 : 65)}
          y={GROUND_Y + row * 34}
          width={128}
          height={32}
          fill={row % 2 === 0 ? PARCHMENT : STONE}
          stroke={INK}
          strokeWidth="1"
          opacity={0.7 - row * 0.05}
        />
      ))
    )}
  </g>
);

export const S03Enluminure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const borderOpacity = enter(frame, 10, 30);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Noble walks in from left
  const nobleX = interpolate(frame, [20, 75], [200, 640], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalNobleX = frame >= 75 ? 640 : nobleX;
  const nobleWalking = frame < 75;

  // Priest walks in from right
  const pretreX = interpolate(frame, [35, 85], [W - 200, 1100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalPretreX = frame >= 85 ? 1100 : pretreX;
  const pretreWalking = frame < 85;

  const noblePhase = frame * 0.17;
  const pretrePhase = frame * 0.14 + 0.9;

  // Noble starts talking at f120
  const nobleTalking = frame >= 120 && frame < 220;
  // Priest starts praying at f150
  const pretrePraying = frame >= 150 && frame < 240;

  // Banderoles spring in
  const banderole1Spring = spring({ frame: frame - 120, fps, config: { damping: 14 }, durationInFrames: 20 });
  const banderole2Spring = spring({ frame: frame - 165, fps, config: { damping: 14 }, durationInFrames: 20 });
  const banderole1Visible = frame >= 120 && frame < 220;
  const banderole2Visible = frame >= 165 && frame < 240;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <EnlumDefs />

        {/* Parchment background */}
        <rect width={W} height={H} fill={PARCHMENT} />
        <rect width={W} height={H} fill="url(#s03-arabesque)" />

        {/* Sky portion */}
        <rect x={68} y={68} width={W - 136} height={GROUND_Y - 80} fill="url(#s03-sky)" opacity={0.7} />

        {/* Ground tiles */}
        <Dallage />

        {/* Characters */}
        <EnlumPretre x={finalPretreX} y={GROUND_Y} walkPhase={pretreWalking ? pretrePhase : 0} praying={pretrePraying} />
        <EnlumNoble x={finalNobleX} y={GROUND_Y} walkPhase={nobleWalking ? noblePhase : 0} talking={nobleTalking} />

        {/* Banderoles */}
        {banderole1Visible && (
          <Banderole
            x={finalNobleX}
            y={GROUND_Y - 280}
            text="Dieu vous garde!"
            scaleSpring={banderole1Spring}
          />
        )}
        {banderole2Visible && (
          <Banderole
            x={finalPretreX}
            y={GROUND_Y - 250}
            text="Ora pro nobis"
            scaleSpring={banderole2Spring}
          />
        )}

        {/* Border */}
        <EnlumBorder opacity={borderOpacity} />

        <CharLabel x={finalNobleX} y={GROUND_Y + 55} name="Le Noble" fill={INK} />
        <CharLabel x={finalPretreX} y={GROUND_Y + 55} name="Le Pretre" fill={INK} />
      </svg>

      <StyleTitle
        frame={frame}
        number="03"
        title="Enluminure Medievale SVG"
        subtitle="Pigments authentiques — Or, Lapis-lazuli, Vermillon — Style actif Peste 1347"
        textColor={INK}
        bgColor={`${PARCHMENT}EE`}
      />
    </div>
  );
};
