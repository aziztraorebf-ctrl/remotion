import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface TrombinoscapePortrait {
  name: string;
  role: string;
  pouvoir: number;
  statutColor?: string;
  imageUrl?: string;
}

export interface TrombinoscapeStrategiqueProps {
  titre?: string;
  portraits?: TrombinoscapePortrait[];
  arcs?: [number, number][];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const ITEM_W = 300;
const ITEM_H = 300;
const GAP = 40;

const POSITIONS: Record<number, { x: number; y: number }[]> = {
  4: [
    { x: 640, y: 160 }, { x: 980, y: 160 },
    { x: 640, y: 560 }, { x: 980, y: 560 },
  ],
  5: [
    { x: 470, y: 160 }, { x: 810, y: 160 }, { x: 1150, y: 160 },
    { x: 640, y: 560 }, { x: 980, y: 560 },
  ],
  6: [
    { x: 470, y: 160 }, { x: 810, y: 160 }, { x: 1150, y: 160 },
    { x: 470, y: 560 }, { x: 810, y: 560 }, { x: 1150, y: 560 },
  ],
};

const STAGGER_DELAYS = [20, 35, 50, 65, 80, 95];
const ARC_START = 130;
const ARC_DUR = 25;
const BAR_MAX_W = 200;

const DEFAULT_PORTRAITS: TrombinoscapePortrait[] = [
  { name: "GEN. AMADOU FALL", role: "CHEF D'ETAT-MAJOR", pouvoir: 85, statutColor: "#e63946" },
  { name: "DR. FATOU DIOP", role: "MINISTRE DES FINANCES", pouvoir: 92, statutColor: "#4a9eff" },
  { name: "MARCUS OBIANG", role: "DIR. RENSEIGNEMENTS", pouvoir: 78, statutColor: "#c8a951" },
  { name: "SOULEYMANE KEITA", role: "CONSEILLER SPECIAL", pouvoir: 65, statutColor: "#4a9eff" },
  { name: "COL. YASMINA TALL", role: "FORCES SPECIALES", pouvoir: 88, statutColor: "#e63946" },
];

function getPositions(count: number): { x: number; y: number }[] {
  const clamped = Math.min(Math.max(count, 4), 6);
  return POSITIONS[clamped] ?? POSITIONS[6]!;
}

function arcPath(
  ax: number, ay: number,
  bx: number, by: number,
  curvature = 80
): string {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2 - curvature;
  return `M ${ax} ${ay} Q ${mx} ${my} ${bx} ${by}`;
}

function pathLength(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy) * 1.2;
}

export const TrombinoscapeStrategique: React.FC<TrombinoscapeStrategiqueProps> = ({
  titre = "CARTOGRAPHIE DU POUVOIR",
  portraits = DEFAULT_PORTRAITS,
  arcs = [[0, 2], [1, 3], [2, 4]],
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.min(Math.max(portraits.length, 4), 6);
  const positions = getPositions(count);

  // Title fade + letter-spacing
  const titleOp = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleLS = interpolate(frame, [0, 25], [20, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Portrait springs
  const portraitSprings = STAGGER_DELAYS.slice(0, count).map((delay) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 12, stiffness: 100, mass: 1 },
    })
  );

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="trombGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text
          x={960}
          y={80}
          textAnchor="middle"
          opacity={titleOp}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 32,
            fontWeight: "bold",
            fill: "#f2ebd9",
            letterSpacing: titleLS,
          }}
        >
          {titre}
        </text>

        {/* Arc connections — drawn BEFORE portraits so they appear under */}
        {arcs.map(([a, b], ci) => {
          const posA = positions[a];
          const posB = positions[b];
          if (!posA || !posB) return null;
          const ax = posA.x + ITEM_W / 2;
          const ay = posA.y + ITEM_H / 2;
          const bx = posB.x + ITEM_W / 2;
          const by = posB.y + ITEM_H / 2;
          const d = arcPath(ax, ay, bx, by);
          const len = pathLength(ax, ay, bx, by);
          const arcOp = interpolate(
            frame,
            [ARC_START + ci * 15, ARC_START + ci * 15 + ARC_DUR],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const arcOffset = interpolate(
            frame,
            [ARC_START + ci * 15, ARC_START + ci * 15 + ARC_DUR],
            [len, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <path
              key={`arc-${ci}`}
              d={d}
              fill="none"
              stroke="#c8a951"
              strokeWidth={2}
              opacity={arcOp * 0.5}
              strokeDasharray={len}
              strokeDashoffset={arcOffset}
            />
          );
        })}

        {/* Portraits */}
        {portraits.slice(0, count).map((portrait, i) => {
          const pos = positions[i];
          if (!pos) return null;
          const delay = STAGGER_DELAYS[i] ?? 20 + i * 15;
          const sc = portraitSprings[i] ?? 0;
          const cx = pos.x + ITEM_W / 2;
          const cy = pos.y + ITEM_H / 2;

          const nameOp = interpolate(frame, [delay + 20, delay + 35], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const barW = interpolate(frame, [delay + 30, delay + 50], [0, BAR_MAX_W * (portrait.pouvoir / 100)], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const statColor = portrait.statutColor ?? "#c8a951";

          return (
            <g
              key={i}
              transform={`translate(${cx}, ${cy}) scale(${sc}) translate(${-cx}, ${-cy})`}
            >
              {/* Portrait background */}
              {portrait.imageUrl ? (
                <image
                  href={portrait.imageUrl}
                  x={pos.x}
                  y={pos.y}
                  width={ITEM_W}
                  height={ITEM_H}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <g>
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={ITEM_W}
                    height={ITEM_H}
                    fill="#1a2535"
                    stroke={statColor}
                    strokeWidth={1}
                    strokeOpacity={0.4}
                  />
                  {/* Placeholder — diamond + circle + neck line */}
                  <polygon
                    points={`${cx},${pos.y + 30} ${pos.x + ITEM_W - 20},${cy} ${cx},${pos.y + ITEM_H - 30} ${pos.x + 20},${cy}`}
                    stroke="#4a9eff"
                    strokeWidth={1}
                    fill="transparent"
                    opacity={0.4}
                  />
                  <circle cx={cx} cy={cy} r={20} fill={statColor} opacity={0.8} />
                  <line
                    x1={cx}
                    y1={cy + 20}
                    x2={cx}
                    y2={pos.y + ITEM_H}
                    stroke={statColor}
                    strokeWidth={1}
                    opacity={0.25}
                  />
                </g>
              )}

              {/* Colored top accent bar */}
              <rect x={pos.x} y={pos.y} width={ITEM_W} height={4} fill={statColor} />

              {/* Name */}
              <text
                x={cx}
                y={pos.y + ITEM_H + 30}
                textAnchor="middle"
                opacity={nameOp}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 18,
                  fontWeight: "bold",
                  fill: "#f2ebd9",
                }}
              >
                {portrait.name}
              </text>

              {/* Role */}
              <text
                x={cx}
                y={pos.y + ITEM_H + 55}
                textAnchor="middle"
                opacity={nameOp}
                style={{ fontFamily: FONT_MONO, fontSize: 14, fill: "#c8a951" }}
              >
                {portrait.role}
              </text>

              {/* Power bar background */}
              <rect
                x={pos.x + 50}
                y={pos.y + ITEM_H + 68}
                width={BAR_MAX_W}
                height={4}
                fill="#2a3b52"
                opacity={nameOp}
              />
              {/* Power bar fill */}
              <rect
                x={pos.x + 50}
                y={pos.y + ITEM_H + 68}
                width={barW}
                height={4}
                fill={statColor}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
