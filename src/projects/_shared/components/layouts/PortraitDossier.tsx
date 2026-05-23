import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface PortraitDossierProps {
  name?: string;
  role?: string;
  nationality?: string;
  period?: string;
  keyFact?: string;
  status?: "ACTIF" | "RECHERCHE" | "DECEDE";
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const FRAME_START = 10;
const SILHOUETTE_START = 25;
const INFO_STARTS = [40, 55, 70, 85, 100];
const BANNER_START = 130;
const SCAN_START = 30;

const FRAME_X = 120;
const FRAME_Y = 200;
const FRAME_W = 500;
const FRAME_H = 600;
const FRAME_PERIMETER = 2 * (FRAME_W + FRAME_H);

const INFO_X = 700;
const INFO_START_Y = 230;
const LINE_SPACING = 90;
const INFO_LINE_W = 1100;

const STATUS_COLORS: Record<string, string> = {
  ACTIF: "#c8a951",
  RECHERCHE: "#ff4a4a",
  DECEDE: "#888888",
};

const INFO_FIELDS = [
  { label: "NOM",          key: "name" },
  { label: "ROLE",         key: "role" },
  { label: "NATIONALITE",  key: "nationality" },
  { label: "PERIODE",      key: "period" },
  { label: "FAIT CLE",     key: "keyFact" },
];

export const PortraitDossier: React.FC<PortraitDossierProps> = ({
  name = "EDWARD SNOWDEN",
  role = "CONSULTANT NSA / LANCEUR D'ALERTE",
  nationality = "AMERICAINE",
  period = "2013 - PRESENT",
  keyFact = "9 000+ DOCUMENTS CLASSES FUITES",
  status = "RECHERCHE",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const values: Record<string, string> = { name, role, nationality, period, keyFact };
  const statusColor = STATUS_COLORS[status] ?? "#888888";

  // Frame draw-on (spring from high dashoffset to 0)
  const frameSpring = spring({ frame: Math.max(0, frame - FRAME_START), fps, config: { damping: 16, mass: 1, stiffness: 60 } });
  const frameDash = interpolate(frameSpring, [0, 1], [FRAME_PERIMETER, 0]);

  // Silhouette fade
  const silhouetteOpacity = interpolate(frame, [SILHOUETTE_START, SILHOUETTE_START + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Scan line
  const scanY = interpolate(frame, [SCAN_START, SCAN_START + 180], [FRAME_Y, FRAME_Y + FRAME_H], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Banner
  const bannerScaleY = spring({ frame: Math.max(0, frame - BANNER_START), fps, config: { damping: 12, mass: 0.5, stiffness: 150 } });
  const bannerTextScale = spring({ frame: Math.max(0, frame - (BANNER_START + 10)), fps, config: { damping: 10, mass: 1, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>

        {/* Photo frame — clip-path polygon with cut corners */}
        <defs>
          <clipPath id="frameClip">
            <polygon points={`
              ${FRAME_X + 50},${FRAME_Y}
              ${FRAME_X + FRAME_W},${FRAME_Y}
              ${FRAME_X + FRAME_W},${FRAME_Y + FRAME_H - 50}
              ${FRAME_X + FRAME_W - 50},${FRAME_Y + FRAME_H}
              ${FRAME_X},${FRAME_Y + FRAME_H}
              ${FRAME_X},${FRAME_Y + 50}
            `} />
          </clipPath>
        </defs>

        {/* Frame background */}
        <polygon
          points={`
            ${FRAME_X + 50},${FRAME_Y}
            ${FRAME_X + FRAME_W},${FRAME_Y}
            ${FRAME_X + FRAME_W},${FRAME_Y + FRAME_H - 50}
            ${FRAME_X + FRAME_W - 50},${FRAME_Y + FRAME_H}
            ${FRAME_X},${FRAME_Y + FRAME_H}
            ${FRAME_X},${FRAME_Y + 50}
          `}
          fill="rgba(26,37,53,0.6)"
        />

        {/* Frame border draw-on */}
        <polygon
          points={`
            ${FRAME_X + 50},${FRAME_Y}
            ${FRAME_X + FRAME_W},${FRAME_Y}
            ${FRAME_X + FRAME_W},${FRAME_Y + FRAME_H - 50}
            ${FRAME_X + FRAME_W - 50},${FRAME_Y + FRAME_H}
            ${FRAME_X},${FRAME_Y + FRAME_H}
            ${FRAME_X},${FRAME_Y + 50}
          `}
          fill="none"
          stroke="#f2ebd9"
          strokeWidth={4}
          strokeDasharray={FRAME_PERIMETER}
          strokeDashoffset={frameDash}
        />

        {/* Silhouette inside frame */}
        <g opacity={silhouetteOpacity} clipPath="url(#frameClip)">
          {/* Head */}
          <circle cx={370} cy={400} r={80} fill="rgba(242,235,217,0.15)" />
          {/* Shoulders trapezoid */}
          <polygon
            points="220,520 520,520 580,800 160,800"
            fill="rgba(242,235,217,0.1)"
          />
          {/* Simple outline head */}
          <circle cx={370} cy={400} r={80} fill="none" stroke="rgba(242,235,217,0.3)" strokeWidth={2} />
        </g>

        {/* Scan line */}
        <line
          x1={FRAME_X} y1={scanY}
          x2={FRAME_X + FRAME_W} y2={scanY}
          stroke="#4a9eff"
          strokeWidth={2}
          opacity={0.5}
        />

        {/* Info lines */}
        {INFO_FIELDS.map((field, i) => {
          const delay = INFO_STARTS[i] ?? 40 + i * 15;
          const lineY = INFO_START_Y + i * LINE_SPACING;

          const underscoreProgress = interpolate(frame, [delay, delay + 15], [INFO_LINE_W, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const textOpacity = interpolate(frame, [delay + 10, delay + 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const textX = interpolate(frame, [delay + 10, delay + 25], [INFO_X - 20, INFO_X], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });

          const isKeyFact = field.key === "keyFact";

          return (
            <g key={i}>
              {/* Label */}
              <text
                x={textX}
                y={lineY}
                opacity={textOpacity}
                style={{ fontFamily: FONT_MONO, fontSize: 20, fill: "#4a9eff", letterSpacing: 4 }}
              >
                {field.label}
              </text>
              {/* Value */}
              <text
                x={textX}
                y={lineY + 38}
                opacity={textOpacity}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 32,
                  fill: isKeyFact ? "#c8a951" : "#f2ebd9",
                  fontWeight: isKeyFact ? "bold" : "normal",
                  letterSpacing: 2,
                }}
              >
                {values[field.key]}
              </text>
              {/* Underscore draw-on */}
              <line
                x1={INFO_X} y1={lineY + 50}
                x2={INFO_X + INFO_LINE_W} y2={lineY + 50}
                stroke="#4a9eff"
                strokeWidth={1}
                strokeDasharray={INFO_LINE_W}
                strokeDashoffset={underscoreProgress}
                opacity={0.4}
              />
            </g>
          );
        })}

        {/* Status banner */}
        <g transform={`translate(960, 920) scale(1, ${bannerScaleY}) translate(-960, -920)`}>
          <rect x={0} y={880} width={1920} height={80} fill={statusColor} />
        </g>
        <text
          x={960}
          y={932}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 48,
            fontWeight: "bold",
            fill: "#1a2535",
            letterSpacing: 12,
            transform: `scale(${bannerTextScale})`,
            transformOrigin: "960px 932px",
          }}
        >
          {status}
        </text>

      </svg>
    </AbsoluteFill>
  );
};
