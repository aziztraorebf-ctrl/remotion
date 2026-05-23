import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface SovereignEclipseProps {
  chapterLabel?: string;
  chapterTitle?: string;
  eclipseColor?: string;
  ringColor?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const DISK_RADIUS = 1500;
const RING_RADIUS = 200;
const RING_STROKE = 8;

const ENTER_START = 0;
const ENTER_END = 90;
const RING_BURST_START = 90;
const TEXT_APPEAR_START = 95;
const EXIT_START = 140;
const EXIT_END = 180;

// 6 fragments at 60-degree intervals
const FRAGMENTS = [0, 60, 120, 180, 240, 300];
const ARC_DEG = 30;

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

export const SovereignEclipse: React.FC<SovereignEclipseProps> = ({
  chapterLabel = "CHAPITRE II",
  chapterTitle = "L'EXTRACTION",
  eclipseColor = "#1a2535",
  ringColor = "#c8a951",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 540;

  // Disk enter: slides from left (-1920) to 0
  const diskEnterX = interpolate(
    frame,
    [ENTER_START, ENTER_END],
    [-1920, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Disk exit: slides to right (0 to 1920)
  const diskExitX = interpolate(
    frame,
    [EXIT_START, EXIT_END],
    [0, 1920],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const diskX = frame >= EXIT_START ? diskExitX : diskEnterX;

  // Ring burst — spring scale
  const ringScale = spring({
    frame: Math.max(0, frame - RING_BURST_START),
    fps,
    config: { damping: 12, stiffness: 300, mass: 0.5 },
  });

  // Fragments explosion — each fragment flies outward
  const fragProgress = interpolate(
    frame,
    [RING_BURST_START, RING_BURST_START + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Text appearance
  const textOpacity = interpolate(
    frame,
    [TEXT_APPEAR_START, TEXT_APPEAR_START + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const textExitOpacity = interpolate(
    frame,
    [EXIT_START - 15, EXIT_START],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const finalTextOpacity = textOpacity * textExitOpacity;

  // Ring opacity fades before exit
  const ringOpacity = interpolate(
    frame,
    [EXIT_START - 10, EXIT_START],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", width: "100%", height: "100%" }}>
        {/* Main eclipse disk */}
        <circle
          cx={CX + diskX}
          cy={CY}
          r={DISK_RADIUS}
          fill={eclipseColor}
        />

        {/* Gold ring at center */}
        <g opacity={ringOpacity}>
          <circle
            cx={CX}
            cy={CY}
            r={RING_RADIUS * ringScale}
            fill="none"
            stroke={ringColor}
            strokeWidth={RING_STROKE}
          />

          {/* 6 arc fragments flying outward */}
          {FRAGMENTS.map((angleDeg, i) => {
            const midAngleRad = ((angleDeg + ARC_DEG / 2) * Math.PI) / 180;
            const fragDist = fragProgress * 250;
            const fragX = Math.cos(midAngleRad) * fragDist;
            const fragY = Math.sin(midAngleRad) * fragDist;
            const fragR = RING_RADIUS + fragDist * 0.15;

            const arcD = arcPath(CX + fragX, CY + fragY, fragR * ringScale, angleDeg, angleDeg + ARC_DEG);

            return (
              <path
                key={i}
                d={arcD}
                fill="none"
                stroke={ringColor}
                strokeWidth={RING_STROKE * (1 - fragProgress * 0.6)}
                strokeLinecap="round"
                opacity={1 - fragProgress * 0.7}
              />
            );
          })}
        </g>

        {/* Chapter text */}
        <text
          x={CX}
          y={CY - 30}
          textAnchor="middle"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 24,
            letterSpacing: 8,
            fill: "#4a9eff",
            opacity: finalTextOpacity,
            textTransform: "uppercase",
          }}
        >
          {chapterLabel}
        </text>
        <text
          x={CX}
          y={CY + 50}
          textAnchor="middle"
          style={{
            fontFamily: FONT_MONO,
            fontSize: 64,
            letterSpacing: 6,
            fill: "#f2ebd9",
            opacity: finalTextOpacity,
            fontWeight: "bold",
          }}
        >
          {chapterTitle}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
