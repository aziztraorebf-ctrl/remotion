import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { INK, PARCH } from "../../_shared/svg-library/palette";

export const PROTO_INSERT_TACTIQUE_TOPDOWN_FRAMES = 150;

const TERRAIN = "#d1b27c";
const SAF = "#5a2c22";
const RSF = "#3b2558";
const ARROW = PARCH;

// --- Terrain hybride : base sable + grille fine + oued stylise + hachures ---

const TerrainBackground: React.FC = () => (
  <g>
    <defs>
      <pattern id="hatchSand" patternUnits="userSpaceOnUse" width={16} height={16}>
        <path d="M0 16 L16 0" stroke={INK} strokeWidth={1} opacity={0.06} />
      </pattern>
      <filter id="paperGrain">
        <feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} seed={7} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.17  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.05 0" />
      </filter>
    </defs>

    <rect x={160} y={140} width={1600} height={800} fill={TERRAIN} />
    <rect x={160} y={140} width={1600} height={800} fill="url(#hatchSand)" />
    <rect x={160} y={140} width={1600} height={800} filter="url(#paperGrain)" />

    {/* grille fine type etat-major */}
    {Array.from({ length: 9 }).map((_, i) => (
      <line key={`v${i}`} x1={160 + i * 200} y1={140} x2={160 + i * 200} y2={940} stroke={INK} strokeWidth={1} opacity={0.06} />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <line key={`h${i}`} x1={160} y1={140 + i * 200} x2={1760} y2={140 + i * 200} stroke={INK} strokeWidth={1} opacity={0.06} />
    ))}

    {/* oued stylise : casse la platitude sans relief */}
    <path
      d="M 200 850 Q 450 780 620 820 Q 820 870 980 780 Q 1180 690 1400 730"
      fill="none"
      stroke="#596777"
      strokeWidth={22}
      opacity={0.16}
      strokeLinecap="round"
    />
    <path
      d="M 200 850 Q 450 780 620 820 Q 820 870 980 780 Q 1180 690 1400 730"
      fill="none"
      stroke="#596777"
      strokeWidth={3}
      opacity={0.22}
    />

    {/* piste poussiereuse */}
    <path d="M 300 250 L 1500 500" stroke={INK} strokeWidth={3} strokeDasharray="14 10" opacity={0.14} />

    <rect x={160} y={140} width={1600} height={800} fill="none" stroke={INK} strokeWidth={3} />
  </g>
);

// --- Jetons : forme differenciee par camp, taille lisible ---

type UnitTokenProps = {
  x: number;
  y: number;
  rotation: number;
  faction: "SAF" | "RSF";
  kind: "infantry" | "technical";
  count?: number;
};

const UnitToken: React.FC<UnitTokenProps> = ({ x, y, rotation, faction, kind, count }) => {
  const color = faction === "SAF" ? SAF : RSF;

  if (kind === "technical") {
    return <TechnicalIcon x={x} y={y} angle={rotation} color={color} />;
  }

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
      {faction === "SAF" ? (
        <circle r={26} fill={color} stroke={PARCH} strokeWidth={3} />
      ) : (
        <rect x={-26} y={-26} width={52} height={52} fill={color} stroke={PARCH} strokeWidth={3} transform="rotate(45)" />
      )}
      <circle r={26} fill="none" stroke={INK} strokeWidth={1.5} opacity={0.35} />
      <path d="M -9 -9 L 9 9 M 9 -9 L -9 9" stroke={PARCH} strokeWidth={3.5} strokeLinecap="round" opacity={0.9} />
      {count && count > 1 && (
        <text y={44} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fontWeight="bold" fill={PARCH}>
          ×{count}
        </text>
      )}
    </g>
  );
};

// --- Vehicule : chassis + capot + cabine + plateau + arme, silhouette lisible ---

const TechnicalIcon: React.FC<{ x: number; y: number; angle: number; color: string }> = ({ x, y, angle, color }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <rect x={-32} y={-24} width={12} height={8} rx={3} fill="#1b1512" />
    <rect x={20} y={-24} width={12} height={8} rx={3} fill="#1b1512" />
    <rect x={-32} y={16} width={12} height={8} rx={3} fill="#1b1512" />
    <rect x={20} y={16} width={12} height={8} rx={3} fill="#1b1512" />

    <path
      d="M-38,-16 L20,-16 L38,-7 L38,7 L20,16 L-38,16 Z"
      fill={color}
      stroke={INK}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <path
      d="M-33,-11 L17,-11 L31,-4 L31,4 L17,11 L-33,11 Z"
      fill="none"
      stroke={PARCH}
      strokeWidth={2}
      opacity={0.85}
    />
    <rect x={-13} y={-10} width={20} height={20} rx={3} fill={INK} stroke={PARCH} strokeWidth={1.5} opacity={0.9} />
    <rect x={-34} y={-10} width={18} height={20} rx={2} fill={INK} opacity={0.45} />

    <circle cx={-24} cy={0} r={5.5} fill={PARCH} stroke={INK} strokeWidth={1.5} />
    <line x1={-24} y1={0} x2={-44} y2={0} stroke={PARCH} strokeWidth={3.5} strokeLinecap="round" />
  </g>
);

const Medaillon: React.FC<{ x: number; y: number; label: string; camp: string }> = ({ x, y, label, camp }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={30} fill={PARCH} stroke={camp} strokeWidth={4} />
    <circle r={30} fill="none" stroke={INK} strokeWidth={1} opacity={0.4} />
    <text y={6} textAnchor="middle" fontFamily="Georgia, serif" fontSize={16} fontWeight="bold" fill={INK}>
      {label}
    </text>
  </g>
);

// --- Explosion en 4 couches : flash / anneau / eclats / fumee-encre ---

const Impact: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const t = frame - startFrame;
  if (t < 0) return null;

  const flashScale = interpolate(t, [0, 3, 8], [0.2, 1.4, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flashOpacity = interpolate(t, [0, 2, 8], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringR = interpolate(t, [2, 14], [8, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ringOpacity = interpolate(t, [2, 14], [0.8, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const smokeOpacity = interpolate(t, [6, 16, 45], [0, 0.45, 0.16], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const shards = Array.from({ length: 16 }).map((_, i) => {
    const a = (i / 16) * Math.PI * 2;
    const len = 28 + ((i * 17) % 24);
    const progress = interpolate(t, [2, 12], [0.2, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const opacity = interpolate(t, [2, 10], [0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <line
        key={i}
        x1={Math.cos(a) * 12}
        y1={Math.sin(a) * 12}
        x2={Math.cos(a) * len * progress}
        y2={Math.sin(a) * len * progress}
        stroke={PARCH}
        strokeWidth={3}
        strokeLinecap="round"
        opacity={opacity}
      />
    );
  });

  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={24 * flashScale} fill="#fff2c9" opacity={flashOpacity} />
      <circle r={ringR} fill="none" stroke={PARCH} strokeWidth={5} opacity={ringOpacity} />
      {shards}
      <g opacity={smokeOpacity}>
        <circle cx={-12} cy={6} r={26} fill={INK} opacity={0.35} />
        <circle cx={10} cy={-8} r={22} fill="#3a2c22" opacity={0.35} />
        <circle cx={16} cy={14} r={19} fill={INK} opacity={0.25} />
      </g>
    </g>
  );
};

const ManoeuvreArrow: React.FC<{ path: string; frame: number; fps: number; startAt: number; length: number }> = ({
  path,
  frame,
  fps,
  startAt,
  length,
}) => {
  const local = frame - startAt;
  const progress = spring({ frame: local, fps, config: { damping: 18, mass: 1 } });
  const dashOffset = length * (1 - progress);

  return (
    <path
      d={path}
      fill="none"
      stroke={ARROW}
      strokeWidth={7}
      strokeLinecap="round"
      strokeDasharray={`${length} ${length}`}
      strokeDashoffset={dashOffset}
      opacity={0.92}
      markerEnd="url(#arrowhead)"
    />
  );
};

// --- Chorégraphie temporelle (4 phases sur 150 frames / 5s @ 30fps) ---
// 0-30 : lecture (jetons pulsent, rien ne bouge)
// 30-75 : manoeuvre (fleche se trace, unite glisse en InOutCubic)
// 75-105 : contact (impact + camera shake)
// 105-150 : resolution (fumee reste, pause visuelle)

export const ProtoInsertTactiqueTopDown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pulseLecture = 1 + Math.sin(frame * 0.25) * (frame < 30 ? 0.04 : 0);

  const advance = spring({ frame: frame - 30, fps, config: { damping: 22, mass: 1.4 } });
  const safX = interpolate(advance, [0, 1], [420, 640]);
  const safY = interpolate(advance, [0, 1], [560, 470]);

  // camera shake au contact (frame 75-83)
  const shakeLocal = frame - 76;
  const shakeActive = shakeLocal >= 0 && shakeLocal < 7;
  const shakeX = shakeActive ? Math.sin(shakeLocal * 7) * 4 : 0;
  const shakeY = shakeActive ? Math.cos(shakeLocal * 9) * 3 : 0;

  const subtitleIdx = frame < 30 ? 0 : frame < 76 ? 1 : frame < 105 ? 2 : 3;
  const subtitles = [
    "El Fasher — les positions se lisent avant la manoeuvre.",
    "La colonne SAF glisse vers le nord du point de passage.",
    "Contact au point de passage.",
    "La RSF referme la ligne autour du marche central.",
  ];
  const subtitleOp = interpolate(frame % 30, [0, 5, 25, 30], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#0f1a2e" }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ width: "100%", height: "100%", transform: `translate(${shakeX}px, ${shakeY}px)` }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
            <path d="M0,0 L12,6 L0,12 Z" fill={ARROW} />
          </marker>
        </defs>

        <TerrainBackground />

        <text
          x={960}
          y={90}
          textAnchor="middle"
          fill={PARCH}
          fontSize={36}
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing={2}
          opacity={titleOp}
        >
          EL FASHER — MANOEUVRE D'ENCERCLEMENT
        </text>

        <ManoeuvreArrow path="M 500 550 Q 600 420 780 400" frame={frame} fps={fps} startAt={35} length={420} />

        <g transform={`scale(${pulseLecture})`} style={{ transformOrigin: `${safX}px ${safY}px` }}>
          <UnitToken x={safX} y={safY} rotation={-20} faction="SAF" kind="infantry" count={4} />
        </g>
        <UnitToken x={safX - 74} y={safY + 60} rotation={-20} faction="SAF" kind="technical" />
        <Medaillon x={safX - 50} y={safY - 70} label="SAF" camp={SAF} />

        <g transform="scale(1)" style={{ transformOrigin: "1300px 300px" }}>
          <UnitToken x={1300} y={330} rotation={160} faction="RSF" kind="infantry" count={5} />
        </g>
        <UnitToken x={1240} y={270} rotation={160} faction="RSF" kind="technical" />
        <Medaillon x={1320} y={230} label="RSF" camp={RSF} />

        <Impact x={780} y={400} frame={frame} startFrame={76} />

        <g opacity={subtitleOp}>
          <rect x={520} y={960} width={880} height={64} fill="#0f1a2e" stroke={PARCH} strokeWidth={1} opacity={0.9} />
          <text x={960} y={1000} textAnchor="middle" fill={PARCH} fontSize={22} fontFamily="Georgia, serif" fontStyle="italic">
            {subtitles[subtitleIdx]}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
