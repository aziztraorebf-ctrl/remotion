import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface MosaiqueActor {
  name: string;
  role: string;
  status: "ALLIE" | "NEUTRE" | "ANTAGONISTE" | "CIBLE";
  statusColor?: string;
}

export interface MosaiqueActeursProps {
  title?: string;
  actors?: MosaiqueActor[];
  connections?: [number, number][];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const TITLE_START = 0;
const CARD_DELAYS = [20, 40, 60, 80, 100, 120];
const CONNECTION_START = 140;
const CONNECTION_DUR = 30;

const CARD_W = 520;
const CARD_H = 220;
const CARD_RX = 8;

const GRID_POSITIONS = [
  { x: 80, y: 200 },
  { x: 700, y: 200 },
  { x: 1320, y: 200 },
  { x: 80, y: 500 },
  { x: 700, y: 500 },
  { x: 1320, y: 500 },
];

const FIXED_ROTATIONS = [-1.5, 0.8, -0.5, 1.2, -0.9, 0.4];

const STATUS_COLORS: Record<string, string> = {
  ALLIE: "#4a9eff",
  NEUTRE: "#c8a951",
  ANTAGONISTE: "#e63946",
  CIBLE: "#e63946",
};

const STATUS_BG: Record<string, string> = {
  ALLIE: "rgba(74,158,255,0.15)",
  NEUTRE: "rgba(200,169,81,0.15)",
  ANTAGONISTE: "rgba(230,57,70,0.15)",
  CIBLE: "rgba(230,57,70,0.1)",
};

const DEFAULT_ACTORS: MosaiqueActor[] = [
  { name: "BASSIROU DIOMAYE FAYE", role: "Président de la République", status: "ALLIE" },
  { name: "WOODSIDE ENERGY", role: "Opérateur principal", status: "NEUTRE" },
  { name: "PETROSEN", role: "Société nationale", status: "ALLIE" },
  { name: "MACKY SALL", role: "Ex-Président", status: "ANTAGONISTE" },
  { name: "FARBA NGOM", role: "Intermédiaire présumé", status: "CIBLE" },
  { name: "FMI", role: "Créancier international", status: "NEUTRE" },
];

function cardCenter(pos: { x: number; y: number }) {
  return { cx: pos.x + CARD_W / 2, cy: pos.y + CARD_H / 2 };
}

export const MosaiqueActeurs: React.FC<MosaiqueActeursProps> = ({
  title = "RÉSEAU — SANGOMAR OFFSHORE",
  actors = DEFAULT_ACTORS,
  connections = [[0, 2], [1, 2], [3, 4], [1, 3]],
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [TITLE_START, TITLE_START + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Title */}
        <text
          x={960} y={120}
          textAnchor="middle"
          opacity={titleOp}
          style={{ fontFamily: FONT_MONO, fontSize: 36, fontWeight: "bold", fill: "#f2ebd9", letterSpacing: 8 }}
        >
          {title}
        </text>

        {/* Cards */}
        {actors.slice(0, 6).map((actor, i) => {
          const pos = GRID_POSITIONS[i];
          if (!pos) return null;
          const delay = CARD_DELAYS[i] ?? 20 + i * 20;
          const rotation = FIXED_ROTATIONS[i] ?? 0;

          const cardSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 110 },
          });

          const statusColor = actor.statusColor ?? STATUS_COLORS[actor.status] ?? "#c8a951";
          const cardBg = STATUS_BG[actor.status] ?? "rgba(242,235,217,0.1)";
          const cx = pos.x + CARD_W / 2;
          const cy = pos.y + CARD_H / 2;

          return (
            <g
              key={i}
              transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${cardSpring}) translate(${-cx}, ${-cy})`}
            >
              {/* Card background */}
              <rect
                x={pos.x} y={pos.y}
                width={CARD_W} height={CARD_H}
                rx={CARD_RX}
                fill="#f2ebd9"
              />
              {/* Status tint overlay */}
              <rect
                x={pos.x} y={pos.y}
                width={CARD_W} height={CARD_H}
                rx={CARD_RX}
                fill={cardBg}
              />
              {/* Left accent bar */}
              <rect
                x={pos.x} y={pos.y}
                width={6} height={CARD_H}
                rx={CARD_RX}
                fill={statusColor}
              />
              {/* Name */}
              <text
                x={pos.x + 24} y={pos.y + 60}
                style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: "bold", fill: "#1a2535" }}
              >
                {actor.name}
              </text>
              {/* Role */}
              <text
                x={pos.x + 24} y={pos.y + 92}
                style={{ fontFamily: FONT_MONO, fontSize: 17, fill: "#1a2535", opacity: 0.7 }}
              >
                {actor.role}
              </text>
              {/* Status badge */}
              <rect
                x={pos.x} y={pos.y + CARD_H - 44}
                width={CARD_W} height={44}
                rx={CARD_RX}
                fill={statusColor}
                opacity={0.85}
              />
              <text
                x={pos.x + CARD_W / 2} y={pos.y + CARD_H - 16}
                textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: "bold", fill: "#f2ebd9", letterSpacing: 3 }}
              >
                {actor.status}
              </text>
            </g>
          );
        })}

        {/* Connection lines — drawn on top of cards */}
        {connections.map(([a, b], ci) => {
          if (a >= actors.length || b >= actors.length) return null;
          const posA = GRID_POSITIONS[a];
          const posB = GRID_POSITIONS[b];
          if (!posA || !posB) return null;
          const cA = cardCenter(posA);
          const cB = cardCenter(posB);
          const dx = cB.cx - cA.cx;
          const dy = cB.cy - cA.cy;
          const lineLen = Math.sqrt(dx * dx + dy * dy);
          const lineProgress = interpolate(
            frame,
            [CONNECTION_START + ci * 10, CONNECTION_START + ci * 10 + CONNECTION_DUR],
            [lineLen, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <line
              key={`conn-${ci}`}
              x1={cA.cx} y1={cA.cy}
              x2={cB.cx} y2={cB.cy}
              stroke="#c8a951"
              strokeWidth={2}
              opacity={0.5}
              strokeDasharray={lineLen}
              strokeDashoffset={lineProgress}
            />
          );
        })}

      </svg>
    </AbsoluteFill>
  );
};
