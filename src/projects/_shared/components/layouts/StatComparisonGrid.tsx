import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatEntry {
  label: string;
  value: string;
  sublabel?: string;
  accentColor?: string;
}

export interface StatComparisonGridProps {
  title?: string;
  leftStat?: StatEntry;
  rightStat?: StatEntry;
  vsLabel?: string;
  bgColor?: string;
  startFrame?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const FONT_MONO = '"IBM Plex Mono", monospace';

// ─── Helper: is the value purely numeric? ────────────────────────────────────

function isPureNumeric(value: string): boolean {
  return /^\d+$/.test(value.trim());
}

// ─── Crosshair corners ───────────────────────────────────────────────────────

function CrosshairCorners({ size = 12, color = GOLD }: { size?: number; color?: string }) {
  const stroke = color;
  const strokeOpacity = 0.4;
  const w = 80;
  const h = 80;

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
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

// ─── StatSide ────────────────────────────────────────────────────────────────

interface StatSideProps {
  stat: StatEntry;
  fadeInStart: number;
  odometerStart: number;
  frame: number;
  sideIndex: number;
}

function StatSide({ stat, fadeInStart, odometerStart, frame, sideIndex }: StatSideProps) {
  const accent = stat.accentColor ?? GOLD;
  const isNumeric = isPureNumeric(stat.value);

  const fadeOpacity = interpolate(frame, [fadeInStart, fadeInStart + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeTranslateY = interpolate(frame, [fadeInStart, fadeInStart + 20], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valueScale = spring({
    frame: frame - odometerStart,
    fps: 30,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });
  const valueOpacity = interpolate(frame, [odometerStart, odometerStart + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Count-up odometer for numeric values
  const displayValue = isNumeric
    ? String(
        Math.floor(
          interpolate(frame, [odometerStart, odometerStart + 40], [0, Number(stat.value)], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        )
      )
    : stat.value;

  // Glitch on label — deterministic, no Math.random
  const glitchActive = frame >= fadeInStart && frame < fadeInStart + 3;
  const displayLabel = glitchActive
    ? stat.label
        .split("")
        .map((_char, i) =>
          _char === " " ? " " : String.fromCharCode(65 + Math.floor((frame * 17 + i + sideIndex * 31) % 26))
        )
        .join("")
    : stat.label;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        opacity: fadeOpacity,
        transform: `translateY(${fadeTranslateY}px)`,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {displayLabel}
      </div>

      {/* Value — grand chiffre typographique with crosshair corners */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 24px",
        }}
      >
        <CrosshairCorners color={accent} />
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 180,
            fontWeight: 900,
            color: accent,
            letterSpacing: "-0.02em",
            opacity: valueOpacity,
            transform: `scale(${valueScale})`,
            textAlign: "center",
            lineHeight: 1,
          }}
        >
          {displayValue}
        </div>
      </div>

      {/* Sublabel */}
      {stat.sublabel && (
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 20,
            color: IVORY,
            opacity: 0.5,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {stat.sublabel}
        </div>
      )}
    </div>
  );
}

// ─── LaserDivider ─────────────────────────────────────────────────────────────

interface LaserDividerProps {
  appearFrame: number;
  frame: number;
}

function LaserDivider({ appearFrame, frame }: LaserDividerProps) {
  const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1,
        alignSelf: "stretch",
        background:
          "linear-gradient(to bottom, transparent, rgba(242,235,217,0.2) 20%, rgba(242,235,217,0.2) 80%, transparent)",
        flexShrink: 0,
        marginLeft: 40,
        marginRight: 40,
        opacity,
      }}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function StatComparisonGrid({
  title = "IMPACT ECONOMIQUE · SENEGAL PETROLE",
  leftStat = {
    label: "AVANT PRODUCTION",
    value: "27",
    sublabel: "MDS $ PIB · 2023",
    accentColor: "#c8a951",
  },
  rightStat = {
    label: "PROJECTIONS 2035",
    value: "52",
    sublabel: "MDS $ PIB ESTIME",
    accentColor: "#4a9eff",
  },
  vsLabel = "VS",
  bgColor = "transparent",
  startFrame = 0,
}: StatComparisonGridProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const titleOpacity = interpolate(frame, [startFrame, startFrame + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleTranslateY = interpolate(frame, [startFrame, startFrame + 18], [-12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bottomLineOpacity = interpolate(frame, [startFrame + 30, startFrame + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bottomLineScaleX = interpolate(frame, [startFrame + 30, startFrame + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const leftFadeStart = startFrame + 10;
  const leftOdometerStart = startFrame + 15;
  const rightFadeStart = startFrame + 25;
  const rightOdometerStart = startFrame + 25;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_MONO,
          fontSize: 28,
          fontWeight: 700,
          color: IVORY,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
        }}
      >
        {title}
      </div>

      {/* Center grid */}
      <div
        style={{
          position: "absolute",
          top: 160,
          left: 80,
          right: 80,
          bottom: 120,
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
        }}
      >
        <StatSide
          stat={leftStat}
          fadeInStart={leftFadeStart}
          odometerStart={leftOdometerStart}
          frame={frame}
          sideIndex={0}
        />

        <LaserDivider appearFrame={startFrame + 18} frame={frame} />

        <StatSide
          stat={rightStat}
          fadeInStart={rightFadeStart}
          odometerStart={rightOdometerStart}
          frame={frame}
          sideIndex={1}
        />
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          bottom: 72,
          left: 80,
          right: 80,
          height: 1,
          background: GOLD,
          opacity: bottomLineOpacity,
          transform: `scaleX(${bottomLineScaleX})`,
          transformOrigin: "center",
        }}
      />
    </AbsoluteFill>
  );
}

export default StatComparisonGrid;
