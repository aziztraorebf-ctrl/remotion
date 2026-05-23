import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface StratigraphyLayer {
  id: string;
  path: string;
  depthLabel: string;
  fill: string;
  isResource: boolean;
  infoTitle?: string;
  infoDesc?: string;
}

export interface StratigraphieProps {
  layers?: StratigraphyLayer[];
  title?: string;
  subtitle?: string;
  bgColor?: string;
  startFrame?: number;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_LAYERS: StratigraphyLayer[] = [
  {
    id: "layer1",
    path: "M0,0 L1000,0 L1000,150 Q750,180 500,140 T0,160 Z",
    depthLabel: "0 m",
    fill: "#2d3b2a",
    isResource: false,
  },
  {
    id: "layer2",
    path: "M0,160 Q500,140 750,180 T1000,150 L1000,350 Q750,320 500,360 T0,340 Z",
    depthLabel: "-2 km",
    fill: "#3d2e1e",
    isResource: false,
  },
  {
    id: "layer3",
    path: "M0,340 Q500,360 750,320 T1000,350 L1000,480 Q750,510 500,470 T0,490 Z",
    depthLabel: "-4 km",
    fill: "#c8a951",
    isResource: true,
    infoTitle: "CHAMP SANGOMAR",
    infoDesc: "PETROLE · 4 KM",
  },
  {
    id: "layer4",
    path: "M0,490 Q500,470 750,510 T1000,480 L1000,800 L0,800 Z",
    depthLabel: "-6 km",
    fill: "#0f1520",
    isResource: false,
  },
];

// Depth label Y positions (midpoint of each layer in the 800-unit viewBox)
const DEPTH_LABEL_Y: Record<string, number> = {
  layer1: 80,
  layer2: 250,
  layer3: 410,
  layer4: 640,
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const Stratigraphie: React.FC<StratigraphieProps> = ({
  layers = DEFAULT_LAYERS,
  title = "COUPE GEOLOGIQUE",
  subtitle = "FORMATION PETROLIFERE",
  bgColor = "#0d1821",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f = frame - startFrame;

  // ── 1. Scan vertical : clipPath height 0 → 800 over frames 0-60 ──────────────
  const scanHeight = interpolate(f, [0, 60], [0, 800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 2. Pulsation couche ressource (starts at f=60) ─────────────────────────
  const pulse = f >= 60 ? (Math.sin(f * 0.15) + 1) / 2 : 0;
  const resourceFillOpacity = interpolate(pulse, [0, 1], [0.7, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── 3. Ligne de connexion L-shape (f 70-90) ───────────────────────────────
  // Total path length approximation for dashoffset animation
  // L-shape: horizontal from x=700 to x=850 at y=410, then vertical down to y=460
  const LINE_TOTAL_LENGTH = 210;
  const lineProgress = interpolate(f, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeDashoffset = LINE_TOTAL_LENGTH * (1 - lineProgress);

  // ── 4. Bloc texte info (f 90-110) ─────────────────────────────────────────
  const infoOpacity = interpolate(f, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const infoTranslateX = interpolate(f, [90, 110], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resourceLayer = layers.find((l) => l.isResource);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Main SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 -80 1000 880"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          {/* Scan clip path */}
          <clipPath id="scan-clip">
            <rect x="0" y="0" width="1000" height={scanHeight} />
          </clipPath>

          {/* Hatch pattern for resource layer */}
          <pattern
            id="resource-hatch"
            patternUnits="userSpaceOnUse"
            width="12"
            height="12"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke="#1a2535"
              strokeWidth="4"
              strokeOpacity="0.2"
            />
          </pattern>
        </defs>

        {/* Title inside SVG — stays aligned with viewBox */}
        <text
          x={170}
          y={-36}
          fill="#f2ebd9"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={32}
          fontWeight={700}
          letterSpacing="3"
        >
          {title?.toUpperCase()}
        </text>
        <text
          x={170}
          y={-8}
          fill="#c8a951"
          fontFamily="'IBM Plex Mono', monospace"
          fontSize={20}
          fontWeight={400}
          letterSpacing="2"
        >
          {subtitle?.toUpperCase()}
        </text>

        {/* ── Everything inside the scan clip ─────────────────────────────── */}
        <g clipPath="url(#scan-clip)">

          {/* ── Geological layers ─────────────────────────────────────────── */}
          {layers.map((layer) => {
            const isRes = layer.isResource;
            return (
              <g key={layer.id}>
                <path
                  d={layer.path}
                  fill={layer.fill}
                  fillOpacity={isRes ? resourceFillOpacity : 1}
                  stroke="#f2ebd9"
                  strokeOpacity={isRes ? 0.3 : layer.id === "layer4" ? 0.1 : 0.15}
                  strokeWidth={0.5}
                />
                {/* Overlay hatch texture on resource layer */}
                {isRes && (
                  <path
                    d={layer.path}
                    fill="url(#resource-hatch)"
                    fillOpacity={1}
                  />
                )}
              </g>
            );
          })}

          {/* ── Left axis: vertical line ────────────────────────────────── */}
          <line
            x1="140"
            y1="0"
            x2="140"
            y2="800"
            stroke="#4a9eff"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* ── Left axis: depth labels ─────────────────────────────────── */}
          {layers.map((layer) => {
            const y = DEPTH_LABEL_Y[layer.id] ?? 400;
            const isRes = layer.isResource;
            return (
              <text
                key={`label-${layer.id}`}
                x="110"
                y={y}
                textAnchor="end"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="20"
                fontWeight="400"
                fill={isRes ? "#c8a951" : "#4a9eff"}
              >
                {layer.depthLabel}
              </text>
            );
          })}

          {/* ── Tick marks on axis for each layer ───────────────────────── */}
          {layers.map((layer) => {
            const y = DEPTH_LABEL_Y[layer.id] ?? 400;
            return (
              <line
                key={`tick-${layer.id}`}
                x1="115"
                y1={y}
                x2="140"
                y2={y}
                stroke="#4a9eff"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
            );
          })}

          {/* ── Connection line L-shape from resource layer to right info block ── */}
          {resourceLayer && (
            <polyline
              points="700,410 860,410 860,460"
              fill="none"
              stroke="#c8a951"
              strokeWidth="1.5"
              strokeOpacity="0.9"
              strokeDasharray={LINE_TOTAL_LENGTH}
              strokeDashoffset={strokeDashoffset}
            />
          )}

          {/* ── Info block (right side) ─────────────────────────────────── */}
          {resourceLayer && (
            <g
              transform={`translate(${860 + infoTranslateX}, 470)`}
              opacity={infoOpacity}
            >
              {/* Background rect */}
              <rect
                x="0"
                y="0"
                width="130"
                height="56"
                rx="3"
                fill="#1a2535"
                fillOpacity="0.85"
                stroke="#c8a951"
                strokeOpacity="0.4"
                strokeWidth="1"
              />
              <text
                x="10"
                y="22"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="14"
                fontWeight="700"
                fill="#c8a951"
                letterSpacing="0.05em"
              >
                {resourceLayer.infoTitle}
              </text>
              <text
                x="10"
                y="42"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="12"
                fontWeight="400"
                fill="#f2ebd9"
                fillOpacity="0.8"
                letterSpacing="0.04em"
              >
                {resourceLayer.infoDesc}
              </text>
            </g>
          )}

        </g>
        {/* ── End scan clip ───────────────────────────────────────────────── */}
      </svg>
    </AbsoluteFill>
  );
};

export default Stratigraphie;
