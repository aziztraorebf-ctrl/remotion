import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { getLength } from "@remotion/paths";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LaCalebasseProps {
  percentage?: number;
  label?: string;
  sublabel?: string;
  liquidColor?: string;
  strokeColor?: string;
  textColor?: string;
  bgColor?: string;
  startFrame?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT_MONO = '"IBM Plex Mono", monospace';

const calebassePath =
  "M120,50 L280,50 C280,50 320,150 360,250 C400,350 350,480 200,480 C50,480 0,350 40,250 C80,150 120,50 120,50 Z";

const fillWavePath =
  "M0,50 Q50,0 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 L800,600 L0,600 Z";

// ─── Crosshair corners (copied from StatComparisonGrid) ──────────────────────

function CrosshairCorners({ size = 12, color = "#f2ebd9" }: { size?: number; color?: string }) {
  const stroke = color;
  const strokeOpacity = 0.4;
  const w = 80;
  const h = 80;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
    >
      {/* Top-left */}
      <line x1={0} y1={size} x2={0} y2={0} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      <line x1={0} y1={0} x2={size} y2={0} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      {/* Top-right */}
      <line x1={w - size} y1={0} x2={w} y2={0} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      <line x1={w} y1={0} x2={w} y2={size} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      {/* Bottom-left */}
      <line x1={0} y1={h - size} x2={0} y2={h} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      <line x1={0} y1={h} x2={size} y2={h} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      {/* Bottom-right */}
      <line x1={w - size} y1={h} x2={w} y2={h} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
      <line x1={w} y1={h - size} x2={w} y2={h} stroke={stroke} strokeOpacity={strokeOpacity} strokeWidth={1.5} />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LaCalebasse({
  percentage = 60,
  label = "DES RESERVES MONDIALES",
  sublabel = "URANIUM NIGER · 2024",
  liquidColor = "#c8a951",
  strokeColor = "#f2ebd9",
  textColor = "#4a9eff",
  bgColor = "transparent",
  startFrame = 0,
}: LaCalebasseProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const f = frame - startFrame;

  // ─── Calebasse stroke draw-on (frames 0-20) ───────────────────────────────

  const pathLength = getLength(calebassePath);

  const strokeDashoffset = interpolate(f, [0, 20], [pathLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Liquid fill — vertical translate (frames 15-75) ─────────────────────

  // Cap fill at 100% visually; overflow handled via drip animation
  const fillPct = Math.min(percentage, 100);
  const liquidTranslateY = interpolate(
    f,
    [15, 75],
    [500, 500 - (fillPct / 100) * 450],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // ─── Liquid fill — horizontal wave (frames 15-infinity, deterministic) ───

  const waveTranslateX = -(((f - 15) * 3) % 400);

  // ─── Overflow drips (only when percentage > 100) ─────────────────────────

  const isOverflow = percentage > 100;
  const drips = isOverflow ? [0, 22, 44].map((offset) => {
    const cycle = 70;
    const t = f > 75 ? ((f - 75 + offset) % cycle) / cycle : 0;
    const dripsOp = interpolate(f, [75, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { t, opacity: dripsOp };
  }) : [];

  // ─── Count-up odometer (frames 40-70) ────────────────────────────────────

  const displayValue = Math.floor(
    interpolate(f, [40, 70], [0, percentage], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // ─── Value scale spring ───────────────────────────────────────────────────

  const valueScale = spring({
    frame: Math.max(0, f - 40),
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });

  const valueOpacity = interpolate(f, [40, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── Label fade in ────────────────────────────────────────────────────────

  const labelOpacity = interpolate(f, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelTranslateY = interpolate(f, [55, 70], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Left: calebasse SVG */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width={400}
            height={500}
            viewBox="0 0 400 500"
            overflow="visible"
          >
            <defs>
              <clipPath id="calebasse-clip">
                <path d={calebassePath} />
              </clipPath>
            </defs>

            {/* Liquid fill group — clipped to calebasse shape */}
            <g clipPath="url(#calebasse-clip)">
              <g
                transform={`translate(${waveTranslateX}, ${liquidTranslateY})`}
              >
                <path d={fillWavePath} fill={liquidColor} />
              </g>
            </g>

            {/* Calebasse outline — draw-on animation */}
            <path
              d={calebassePath}
              fill="transparent"
              stroke={strokeColor}
              strokeWidth={2}
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Overflow drips — 3 drops falling from rim when percentage > 100 */}
            {drips.map((drip, i) => {
              const xPositions = [110, 200, 290];
              const dropY = 46 + drip.t * 100;
              const dropSize = 1 - drip.t * 0.5;
              return (
                <ellipse
                  key={i}
                  cx={xPositions[i]}
                  cy={dropY}
                  rx={10 * dropSize}
                  ry={16 * dropSize}
                  fill={liquidColor}
                  opacity={drip.opacity * (1 - drip.t * 0.5)}
                />
              );
            })}
          </svg>
        </div>

        {/* Right: value + label */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Value encadree par CrosshairCorners */}
          <div
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px 32px",
              opacity: valueOpacity,
              transform: `scale(${valueScale})`,
            }}
          >
            <CrosshairCorners color={strokeColor} />
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 180,
                fontWeight: 700,
                color: strokeColor,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {displayValue}
              <span
                style={{
                  fontSize: 80,
                  fontWeight: 400,
                  letterSpacing: 0,
                }}
              >
                %
              </span>
            </span>
          </div>

          {/* Label */}
          <div
            style={{
              opacity: labelOpacity,
              transform: `translateY(${labelTranslateY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: FONT_MONO,
                fontSize: 32,
                fontWeight: 400,
                color: textColor,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              {label}
            </div>
            {sublabel && (
              <div
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 20,
                  fontWeight: 400,
                  color: strokeColor,
                  opacity: 0.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                {sublabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export default LaCalebasse;
