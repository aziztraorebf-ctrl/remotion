import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Zap, Crown, Flag, Diamond, Building2, Ship, Users, Flame } from "lucide-react";

export type FractureIcon = "zap" | "crown" | "flag" | "diamond" | "building" | "ship" | "users" | "flame";

export interface TimelineFractureProps {
  dateLabel?: string;
  eventLabel?: string;
  icon?: FractureIcon;
  subtitle?: string;
  bgColor?: string;
}

const ICON_MAP: Record<FractureIcon, React.FC<{ size?: number; color?: string }>> = {
  zap:      ({ size, color }) => <Zap size={size} color={color} />,
  crown:    ({ size, color }) => <Crown size={size} color={color} />,
  flag:     ({ size, color }) => <Flag size={size} color={color} />,
  diamond:  ({ size, color }) => <Diamond size={size} color={color} />,
  building: ({ size, color }) => <Building2 size={size} color={color} />,
  ship:     ({ size, color }) => <Ship size={size} color={color} />,
  users:    ({ size, color }) => <Users size={size} color={color} />,
  flame:    ({ size, color }) => <Flame size={size} color={color} />,
};

const SHARD_COLORS = ["#c4a053", "#f2ebd9", "#e8874a"];

const triPoints = (cx: number, cy: number, size: number, angle: number): string => {
  const tip   = { x: cx + Math.cos(angle) * size * 2, y: cy + Math.sin(angle) * size * 2 };
  const left  = { x: cx + Math.cos(angle + 2.5) * size, y: cy + Math.sin(angle + 2.5) * size };
  const right = { x: cx + Math.cos(angle - 2.5) * size, y: cy + Math.sin(angle - 2.5) * size };
  return `${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`;
};

export const TimelineFracture: React.FC<TimelineFractureProps> = ({
  dateLabel  = "1235",
  eventLabel = "FONDATION",
  icon       = "crown",
  subtitle   = "EMPIRE MALI",
  bgColor    = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // --- Line draw-in (frame 0-30) ---
  const drawProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Date label fade-in (frame 30-50) ---
  const dateLabelOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Pulse (frame 30-50): scaleY oscillation subtile ---
  const pulseY = frame >= 30 && frame < 50
    ? 1 + Math.sin((frame - 30) * 0.6) * 0.3
    : 1;

  // --- Fracture separation (frame 50-75) ---
  const fracProgress = interpolate(frame, [50, 75], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });
  const fracSeparation = fracProgress * 40;

  const CX = width / 2;
  const CY = height / 2;
  const HALF_LINE = width / 2;

  // Left segment: draws from (CX - HALF_LINE * drawProgress) to CX
  // After fracture: right edge retracts by fracSeparation
  const leftX1 = CX - HALF_LINE * drawProgress;
  const leftX2 = frame >= 50 ? CX - 40 - fracSeparation : CX;

  // Right segment: draws from CX to (CX + HALF_LINE * drawProgress)
  // After fracture: left edge pushes out by fracSeparation
  const rightX1 = frame >= 50 ? CX + 40 + fracSeparation : CX;
  const rightX2 = CX + HALF_LINE * drawProgress;

  // Clamp so left segment doesn't go past CX
  const safeLeftX2  = Math.min(leftX2, CX);
  const safeRightX1 = Math.max(rightX1, CX);

  // --- Shards (frame 50-80) ---
  const shards = Array.from({ length: 8 }, (_, i) => {
    const angle   = (i * Math.PI * 2) / 8;
    const maxDist = 80 + i * 20;
    const progress = interpolate(frame, [50, 75], [0, 1], {
      extrapolateLeft:  "clamp",
      extrapolateRight: "clamp",
    });
    const dist    = maxDist * progress;
    const dx      = Math.cos(angle) * dist;
    const dy      = Math.sin(angle) * dist;
    const opacity = interpolate(frame, [55, 80], [0.9, 0], {
      extrapolateLeft:  "clamp",
      extrapolateRight: "clamp",
    });
    const size    = 14 + (i % 3) * 8;
    const color   = SHARD_COLORS[i % 3] ?? "#c4a053";
    return { dx, dy, opacity, size, angle, color };
  });

  // --- Glow at fracture point (frame 50-80) ---
  const glowOpacity = interpolate(frame, [50, 65, 80], [0, 1, 0], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Icon spring pop-in (starts frame 60) ---
  const iconSpring = spring({
    fps,
    frame: frame - 60,
    config: { damping: 80, stiffness: 60, mass: 1 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Event + date labels final fade-in (frame 120) ---
  const labelsOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- AVANT/APRES labels fade-in (frame 120) ---
  const edgeLabelsOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Title fade-in ---
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  // --- Footer fade-in ---
  const footerOpacity = interpolate(frame, [140, 180], [0, 1], {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
  });

  const IconComponent = ICON_MAP[icon];

  const dotGridStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle, rgba(196,160,83,0.15) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>

      {/* Dot grid */}
      <div style={dotGridStyle} />

      {/* Title top */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Cinzel, serif",
          fontSize: 72,
          color: "#c4a053",
          letterSpacing: "0.2em",
          opacity: titleOpacity,
        }}
      >
        RUPTURE
      </div>

      {/* SVG layer — line + shards */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Left line segment */}
        {drawProgress > 0 && (
          <line
            x1={leftX1}
            y1={CY}
            x2={safeLeftX2}
            y2={CY}
            stroke="#c4a053"
            strokeWidth={4}
            strokeLinecap="round"
            transform={`translate(0, ${(1 - pulseY) * 0}) scale(1, ${pulseY})`}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        )}

        {/* Right line segment */}
        {drawProgress > 0 && (
          <line
            x1={safeRightX1}
            y1={CY}
            x2={rightX2}
            y2={CY}
            stroke="#c4a053"
            strokeWidth={4}
            strokeLinecap="round"
          />
        )}

        {/* Shards */}
        {shards.map((shard, i) => (
          shard.opacity > 0 && (
            <polygon
              key={i}
              points={triPoints(CX + shard.dx, CY + shard.dy, shard.size, shard.angle)}
              fill={shard.color}
              opacity={shard.opacity * 0.8}
            />
          )
        ))}
      </svg>

      {/* Glow at fracture point */}
      {glowOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: CX - 160,
            top:  CY - 160,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,135,74,0.8) 0%, rgba(196,160,83,0.4) 40%, transparent 70%)",
            opacity: glowOpacity,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon centered on fracture point */}
      <div
        style={{
          position: "absolute",
          left: CX - 160,
          top:  CY - 160,
          width: 320,
          height: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${iconScale})`,
          filter: iconScale > 0.5
            ? "drop-shadow(0 0 24px rgba(196,160,83,0.9)) drop-shadow(0 0 60px rgba(196,160,83,0.5))"
            : "none",
        }}
      >
        <IconComponent size={160} color="#c4a053" />
      </div>

      {/* Bloc info centre — date + evenement (au-dessus de la ligne) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: Math.round(height * 0.318),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: labelsOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 80,
            color: "#c4a053",
            letterSpacing: "0.1em",
            lineHeight: 1,
          }}
        >
          {dateLabel}
        </div>
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 44,
            color: "#f2ebd9",
            letterSpacing: "0.15em",
            lineHeight: 1,
          }}
        >
          {eventLabel}
        </div>
      </div>

      {/* Label AVANT — extremite gauche de la ligne */}
      <div
        style={{
          position: "absolute",
          left: 40,
          top: CY - 22,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 28,
          color: "#64748b",
          letterSpacing: "0.15em",
          opacity: edgeLabelsOpacity,
        }}
      >
        AVANT
      </div>

      {/* Label APRES — extremite droite de la ligne */}
      <div
        style={{
          position: "absolute",
          right: 40,
          top: CY - 22,
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 28,
          color: "#64748b",
          letterSpacing: "0.15em",
          textAlign: "right",
          opacity: edgeLabelsOpacity,
        }}
      >
        {"APRES"}
      </div>

      {/* Footer subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 28,
          color: "#64748b",
          letterSpacing: "0.2em",
          opacity: footerOpacity,
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
