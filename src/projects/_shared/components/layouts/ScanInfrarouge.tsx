import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface ScanPoint {
  x: number;
  y: number;
  label: string;
  triggerFrame: number;
}

export interface ScanInfrarougeProps {
  hiddenPoints?: ScanPoint[];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DEFAULT_POINTS: ScanPoint[] = [
  { x: 480, y: 320, label: "BASE WAGNER", triggerFrame: 80 },
  { x: 900, y: 560, label: "CONCESSION MINIÈRE 1", triggerFrame: 100 },
  { x: 1400, y: 420, label: "CONCESSION MINIÈRE 2", triggerFrame: 120 },
  { x: 640, y: 730, label: "ACCORD NON PUBLIÉ — 2019", triggerFrame: 140 },
];

const SURFACE_POINTS = [
  { x: 320, y: 200, label: "PIB : 194 Mds $" },
  { x: 960, y: 380, label: "Exportations : 68 Mds $" },
  { x: 1500, y: 260, label: "IDE entrants : 12 Mds $" },
];

const GRID_XS = [160, 320, 480, 640, 800, 960, 1120, 1280, 1440, 1600, 1760];
const GRID_YS = [120, 240, 360, 480, 600, 720, 840, 960];

export const ScanInfrarouge: React.FC<ScanInfrarougeProps> = ({
  hiddenPoints = DEFAULT_POINTS,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanY = interpolate(frame, [40, 160], [0, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <clipPath id="scan-above">
            <rect x={0} y={0} width={1920} height={scanY} />
          </clipPath>
          <clipPath id="scan-below">
            <rect x={0} y={scanY} width={1920} height={1080 - scanY} />
          </clipPath>
          <filter id="scanGlow">
            <feGaussianBlur stdDeviation={9} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Zone révélée (en dessous du scan) */}
        <g clipPath="url(#scan-below)">
          <rect x={0} y={0} width={1920} height={1080} fill="#0d3a22" />
          {GRID_XS.map((x) => (
            <line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={1080} stroke="#4a9eff" strokeWidth={0.5} opacity={0.12} />
          ))}
          {GRID_YS.map((y) => (
            <line key={`gy-${y}`} x1={0} y1={y} x2={1920} y2={y} stroke="#4a9eff" strokeWidth={0.5} opacity={0.12} />
          ))}
          {hiddenPoints.map((pt, i) => {
            const isRevealed = scanY > pt.y;
            const pulseSpring = spring({
              frame: Math.max(0, frame - pt.triggerFrame),
              fps,
              config: { damping: 8, stiffness: 60 },
            });
            const pulseScale = isRevealed
              ? interpolate(Math.sin((frame - pt.triggerFrame) * 0.15), [-1, 1], [1.0, 1.8], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 0;
            const dotOp = isRevealed ? pulseSpring : 0;
            return (
              <g key={i} opacity={dotOp}>
                <circle cx={pt.x} cy={pt.y} r={10 * pulseScale} fill="#e63946" opacity={0.35} />
                <circle cx={pt.x} cy={pt.y} r={10} fill="#e63946" />
                <text
                  x={pt.x + 18} y={pt.y + 5}
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 24,
                    fontWeight: "bold",
                    fill: "#c8a951",
                    letterSpacing: "0.06em",
                  }}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Zone normale (au-dessus du scan) */}
        <g clipPath="url(#scan-above)">
          <rect x={0} y={0} width={1920} height={1080} fill="#1a2535" />
          {GRID_XS.map((x) => (
            <line key={`nx-${x}`} x1={x} y1={0} x2={x} y2={1080} stroke="#f2ebd9" strokeWidth={0.5} opacity={0.06} />
          ))}
          {GRID_YS.map((y) => (
            <line key={`ny-${y}`} x1={0} y1={y} x2={1920} y2={y} stroke="#f2ebd9" strokeWidth={0.5} opacity={0.06} />
          ))}
          {SURFACE_POINTS.map((pt, i) => (
            <text
              key={i}
              x={pt.x} y={pt.y}
              textAnchor="middle"
              style={{
                fontFamily: FONT_MONO,
                fontSize: 22,
                fill: "#f2ebd9",
                opacity: 0.45,
              }}
            >
              {pt.label}
            </text>
          ))}
        </g>

        {/* Ligne de scan */}
        {frame >= 40 && frame <= 165 && (
          <g>
            <rect x={0} y={scanY - 12} width={1920} height={24} fill="rgba(74,158,255,0.08)" />
            <line
              x1={0} y1={scanY} x2={1920} y2={scanY}
              stroke="#4a9eff"
              strokeWidth={3}
              filter="url(#scanGlow)"
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
