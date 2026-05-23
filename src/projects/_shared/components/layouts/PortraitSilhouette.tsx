import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface PortraitSilhouetteProps {
  name?: string;
  title?: string;
  country?: string;
  countryCode?: string;
  facts?: string[];
  status?: "EN FONCTION" | "OPPOSANT" | "EXILE" | "DECEDE";
  statusColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DIVIDER_END = 20;
const FRAME_START = 10;
const SILHOUETTE_START = 30;
const NAME_START = 50;
const TITLE_START = 65;
const COUNTRY_START = 70;
const FACT_DELAYS = [90, 110, 130];
const STATUS_START = 155;

const FRAME_PERIMETER = 2640;
const DIVIDER_LENGTH = 880;

const STATUS_COLORS: Record<string, string> = {
  "EN FONCTION": "#4a9eff",
  "OPPOSANT": "#e63946",
  "EXILE": "#c8a951",
  "DECEDE": "#888888",
};

export const PortraitSilhouette: React.FC<PortraitSilhouetteProps> = ({
  name = "OUSMANE SONKO",
  title = "PREMIER MINISTRE",
  country = "SÉNÉGAL",
  countryCode = "SN",
  facts = [
    "Ancien inspecteur des impôts",
    "Figure de l'opposition (2014-2024)",
    "Nommé Premier ministre en avril 2024",
  ],
  status = "EN FONCTION",
  statusColor,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const resolvedStatusColor = statusColor ?? STATUS_COLORS[status] ?? "#4a9eff";

  // Divider draw-on
  const dividerDash = interpolate(frame, [0, DIVIDER_END], [DIVIDER_LENGTH, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Frame draw-on (spring)
  const frameSpring = spring({
    frame: Math.max(0, frame - FRAME_START),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });
  const frameDash = interpolate(frameSpring, [0, 1], [FRAME_PERIMETER, 0]);

  // Silhouette fade
  const silhouetteOp = interpolate(frame, [SILHOUETTE_START, SILHOUETTE_START + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Name spring
  const nameSpring = spring({
    frame: Math.max(0, frame - NAME_START),
    fps,
    config: { damping: 14, mass: 1, stiffness: 120 },
  });
  const titleSpring = spring({
    frame: Math.max(0, frame - TITLE_START),
    fps,
    config: { damping: 14, mass: 1, stiffness: 120 },
  });
  const countrySpring = spring({
    frame: Math.max(0, frame - COUNTRY_START),
    fps,
    config: { damping: 14, mass: 1, stiffness: 120 },
  });

  // Status fade
  const statusOp = interpolate(frame, [STATUS_START, STATUS_START + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="silGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="silGradHead" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Divider line gold */}
        <line
          x1={800} y1={100} x2={800} y2={980}
          stroke="#c8a951" strokeWidth={2}
          strokeDasharray={DIVIDER_LENGTH}
          strokeDashoffset={dividerDash}
        />

        {/* Portrait frame — octagonal polygon */}
        <polygon
          points="160,140 680,140 720,180 720,820 680,860 160,860 120,820 120,180"
          fill="rgba(26,37,53,0.5)"
          stroke="#4a9eff"
          strokeWidth={3}
          strokeDasharray={FRAME_PERIMETER}
          strokeDashoffset={frameDash}
        />

        {/* Country code badge */}
        <rect x={120} y={140} width={80} height={40} fill="#1a2535" />
        <text
          x={160} y={167}
          textAnchor="middle"
          style={{ fontFamily: FONT_MONO, fontSize: 20, fontWeight: "bold", fill: "#c8a951" }}
        >
          {countryCode}
        </text>

        {/* Silhouette */}
        <g opacity={silhouetteOp}>
          {/* Shoulders */}
          <polygon
            points="220,860 340,520 500,520 620,860"
            fill="url(#silGrad)"
          />
          {/* Head */}
          <circle cx={420} cy={380} r={110} fill="url(#silGradHead)" />
          {/* Subtle outline */}
          <circle cx={420} cy={380} r={110} fill="none" stroke="rgba(74,158,255,0.2)" strokeWidth={2} />
          {/* Neck suggestion */}
          <rect x={390} y={480} width={60} height={50} fill="rgba(42,59,85,0.7)" />
        </g>

        {/* Right side — identity */}

        {/* Name */}
        <text
          x={920} y={220}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 72,
            fontWeight: "bold",
            fill: "#f2ebd9",
            letterSpacing: 4,
            transform: `scale(${nameSpring})`,
            transformOrigin: "920px 220px",
          }}
        >
          {name}
        </text>

        {/* Title */}
        <text
          x={920} y={280}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 32,
            fill: "#c8a951",
            letterSpacing: 2,
            transform: `scale(${titleSpring})`,
            transformOrigin: "920px 280px",
          }}
        >
          {title}
        </text>

        {/* Country */}
        <text
          x={920} y={325}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 24,
            fill: "#4a9eff",
            letterSpacing: 2,
            transform: `scale(${countrySpring})`,
            transformOrigin: "920px 325px",
          }}
        >
          {country}
        </text>

        {/* Separator */}
        <line
          x1={920} y1={360} x2={1800} y2={360}
          stroke="#c8a951" strokeWidth={1} opacity={0.3}
        />

        {/* Facts */}
        {facts.slice(0, 3).map((fact, i) => {
          const delay = FACT_DELAYS[i] ?? 90 + i * 20;
          const tx = interpolate(frame, [delay, delay + 20], [40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const op = interpolate(frame, [delay, delay + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const factY = 420 + i * 80;
          return (
            <g key={i} opacity={op} transform={`translate(${tx}, 0)`}>
              <text
                x={920} y={factY}
                style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: "bold", fill: "#c8a951" }}
              >
                {`0${i + 1}`}
              </text>
              <text
                x={970} y={factY}
                style={{ fontFamily: FONT_MONO, fontSize: 22, fill: "#f2ebd9" }}
              >
                {fact}
              </text>
            </g>
          );
        })}

        {/* Status banner bottom */}
        {status && (
          <g opacity={statusOp}>
            <rect x={920} y={940} width={880} height={50} fill={resolvedStatusColor} opacity={0.15} rx={4} />
            <rect x={920} y={940} width={8} height={50} fill={resolvedStatusColor} rx={2} />
            <text
              x={945} y={972}
              style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: "bold", fill: resolvedStatusColor, letterSpacing: 4 }}
            >
              {status}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
