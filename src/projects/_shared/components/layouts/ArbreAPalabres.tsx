import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface PalabresActor {
  id: number;
  label: string;
  role?: string;
  angle: number;
  x: number;
  y: number;
  weight?: 1 | 2 | 3;
  alignment: "ally" | "neutral" | "adversary";
  branchPath: string;
}

export interface PalabresConnection {
  from: number;
  to: number;
  path: string;
}

export interface ArbreAPalabresProps {
  centralLabel?: string;
  actors?: PalabresActor[];
  connections?: PalabresConnection[];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const CENTER_X = 960;
const CENTER_Y = 540;
const CENTER_RADIUS = 80;

const ALIGNMENT_COLORS: Record<string, string> = {
  ally:       "#c8a951",
  neutral:    "#4a9eff",
  adversary:  "#e55353",
};

const DEFAULT_ACTORS: PalabresActor[] = [
  { id: 0, label: "ÉTAT SÉNÉGALAIS", role: "RÉGULATEUR",  angle: 0,   x: 1310, y: 540,  weight: 3, alignment: "ally",      branchPath: "M 960 540 C 1135 450, 1135 630, 1310 540" },
  { id: 1, label: "WOODSIDE",        role: "OPÉRATEUR",   angle: 60,  x: 1135, y: 843,  weight: 3, alignment: "neutral",   branchPath: "M 960 540 C 960 690, 1135 690, 1135 843" },
  { id: 2, label: "SOUS-TRAITANTS",  role: "SERVICES",    angle: 120, x: 785,  y: 843,  weight: 2, alignment: "neutral",   branchPath: "M 960 540 C 960 690, 785 690, 785 843" },
  { id: 3, label: "COMMUNAUTÉS",     role: "IMPACTÉS",    angle: 180, x: 610,  y: 540,  weight: 1, alignment: "adversary", branchPath: "M 960 540 C 785 450, 785 630, 610 540" },
  { id: 4, label: "ONG ENVIRONNEMENT", role: "OBSERVATEUR", angle: 240, x: 785, y: 237, weight: 1, alignment: "adversary", branchPath: "M 960 540 C 960 390, 785 390, 785 237" },
  { id: 5, label: "PETROSEN",        role: "PARTENAIRE",  angle: 300, x: 1135, y: 237,  weight: 2, alignment: "ally",      branchPath: "M 960 540 C 960 390, 1135 390, 1135 237" },
];

const DEFAULT_CONNECTIONS: PalabresConnection[] = [
  { from: 1, to: 2, path: "M 1135 843 Q 960 950 785 843" },
  { from: 0, to: 5, path: "M 1310 540 Q 1350 350 1135 237" },
  { from: 3, to: 4, path: "M 610 540 Q 550 350 785 237" },
];

function branchPathLength(path: string): number {
  const nums = path.match(/([\d.-]+)/g)!.map(Number);
  const [x0, y0, , , , , x3, y3] = nums;
  return Math.sqrt((x3 - x0) ** 2 + (y3 - y0) ** 2) * 1.4;
}

function connectionPathLength(path: string): number {
  const nums = path.match(/([\d.-]+)/g)!.map(Number);
  const [x0, y0, , , x2, y2] = nums;
  return Math.sqrt((x2 - x0) ** 2 + (y2 - y0) ** 2) * 1.3;
}

export const ArbreAPalabres: React.FC<ArbreAPalabresProps> = ({
  centralLabel = "PÉTROLE\nSANGOMAR",
  actors = DEFAULT_ACTORS,
  connections = DEFAULT_CONNECTIONS,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 — center pulse (0→30)
  const centerScale = spring({ frame, fps, config: { damping: 10, stiffness: 120, mass: 1.2 } });
  const centerPulse = 1 + 0.06 * Math.sin((frame / 10));

  // Phase 2 — branches grow staggered (30→90)
  const branchAnimations = actors.map((actor, i) => {
    const delay = 30 + i * 10;
    return spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 90, mass: 1 },
    });
  });

  // Phase 3 — nodes appear (60→120), staggered
  const nodeAnimations = actors.map((actor, i) => {
    const delay = 60 + i * 10;
    return spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 12, stiffness: 110, mass: 0.9 },
    });
  });

  // Phase 4 — connections (120→160)
  const connectionAnimations = connections.map((_, i) => {
    const delay = 120 + i * 13;
    return interpolate(frame, [delay, delay + 30], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  });

  // Labels opacity
  const labelsOpacity = interpolate(frame, [70, 100], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const centralLines = centralLabel.split("\n");

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Connections between actors */}
        {connections.map((conn, i) => {
          const fromActor = actors.find((a) => a.id === conn.from);
          const toActor = actors.find((a) => a.id === conn.to);
          if (!fromActor || !toActor) return null;
          const pathLen = connectionPathLength(conn.path);
          return (
            <path key={i}
              d={conn.path}
              fill="none"
              stroke="rgba(74,158,255,0.4)"
              strokeWidth={1.5}
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - connectionAnimations[i])}
            />
          );
        })}

        {/* Branches from center to actors */}
        {actors.map((actor, i) => {
          const len = branchPathLength(actor.branchPath);
          return (
            <path key={actor.id}
              d={actor.branchPath}
              fill="none"
              stroke="rgba(242,235,217,0.3)"
              strokeWidth={2}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - branchAnimations[i])}
            />
          );
        })}

        {/* Actor nodes */}
        {actors.map((actor, i) => {
          const color = ALIGNMENT_COLORS[actor.alignment];
          const nodeR = 28 + (actor.weight ?? 1) * 8;
          const sc = nodeAnimations[i];
          const isAbove = actor.y < CENTER_Y;
          return (
            <g key={actor.id} transform={`translate(${actor.x}, ${actor.y}) scale(${sc}) translate(-${actor.x}, -${actor.y})`}>
              <circle cx={actor.x} cy={actor.y} r={nodeR}
                fill={`${color}22`} stroke={color} strokeWidth={2} />
              <text x={actor.x} y={actor.y - 4} textAnchor="middle"
                style={{ fontFamily: FONT_MONO, fontSize: 16, letterSpacing: 2,
                  fill: "#f2ebd9", fontWeight: "bold", textTransform: "uppercase" }}>
                {actor.label.split(" ").slice(0, 2).join(" ")}
              </text>
              {actor.label.split(" ").length > 2 && (
                <text x={actor.x} y={actor.y + 14} textAnchor="middle"
                  style={{ fontFamily: FONT_MONO, fontSize: 16, letterSpacing: 2, fill: "#f2ebd9", textTransform: "uppercase" }}>
                  {actor.label.split(" ").slice(2).join(" ")}
                </text>
              )}
              {actor.role && (
                <text x={actor.x} y={isAbove ? actor.y - nodeR - 10 : actor.y + nodeR + 18}
                  textAnchor="middle"
                  style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: 3,
                    fill: color, opacity: labelsOpacity, textTransform: "uppercase" }}>
                  {actor.role}
                </text>
              )}
            </g>
          );
        })}

        {/* Central node */}
        <g transform={`translate(${CENTER_X}, ${CENTER_Y}) scale(${centerScale * centerPulse}) translate(-${CENTER_X}, -${CENTER_Y})`}>
          <circle cx={CENTER_X} cy={CENTER_Y} r={CENTER_RADIUS}
            fill="#f2ebd922" stroke="#f2ebd9" strokeWidth={2.5} />
          {centralLines.map((line, i) => (
            <text key={i}
              x={CENTER_X}
              y={CENTER_Y - ((centralLines.length - 1) * 16) + i * 32}
              textAnchor="middle" dominantBaseline="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 3,
                fill: "#f2ebd9", fontWeight: "bold", textTransform: "uppercase" }}>
              {line}
            </text>
          ))}
        </g>

        {/* Legend */}
        {[["ally", "#c8a951", "ALLIÉ"], ["neutral", "#4a9eff", "NEUTRE"], ["adversary", "#e55353", "ADVERSAIRE"]].map(([key, color, lbl], i) => (
          <g key={key} opacity={labelsOpacity}>
            <circle cx={80} cy={920 + i * 32} r={8} fill={color} />
            <text x={100} y={920 + i * 32} dominantBaseline="middle"
              style={{ fontFamily: FONT_MONO, fontSize: 14, letterSpacing: 3, fill: "#f2ebd9", opacity: 0.7 }}>
              {lbl}
            </text>
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
