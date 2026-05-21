import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Diamond, Crown, Zap, Globe, Flag, TrendingUp, Users } from "lucide-react";

export type BurnIcon = "diamond" | "crown" | "zap" | "flame" | "globe" | "flag" | "trending" | "users";

export interface BurnRevealProps {
  title?: string;
  icon?: BurnIcon;
  stat?: string;
  label?: string;
  subtitle?: string;
}

const GOLD = "#c4a053";
const IVORY = "#f2ebd9";
const SLATE = "#64748b";
const BG = "#0d1420";

function resolveIcon(icon: BurnIcon, size: number): React.ReactNode {
  const style = {
    width: size,
    height: size,
    color: GOLD,
    filter: `drop-shadow(0 0 40px rgba(196,160,83,0.6))`,
  };
  switch (icon) {
    case "diamond":
      return <Diamond style={style} strokeWidth={1.2} />;
    case "crown":
      return <Crown style={style} strokeWidth={1.2} />;
    case "zap":
      return <Zap style={style} strokeWidth={1.2} />;
    case "flame":
      return <Zap style={style} strokeWidth={1.2} />;
    case "globe":
      return <Globe style={style} strokeWidth={1.2} />;
    case "flag":
      return <Flag style={style} strokeWidth={1.2} />;
    case "trending":
      return <TrendingUp style={style} strokeWidth={1.2} />;
    case "users":
      return <Users style={style} strokeWidth={1.2} />;
    default:
      return <Diamond style={style} strokeWidth={1.2} />;
  }
}

// Generate sinusoidal flame path points
function buildFlamePath(frame: number, width: number): string {
  const points = Array.from({ length: 22 }, (_, i) => {
    const x = (i / 21) * width;
    const y =
      15 +
      Math.sin((x / 80 + frame / 8) * Math.PI) * 9 +
      Math.sin((x / 40 + frame / 5) * Math.PI) * 5;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return `M0,60 L${points.join(" L")} L${width},60 Z`;
}

export const BurnReveal: React.FC<BurnRevealProps> = ({
  title = "REVELATION",
  icon = "diamond",
  stat = "$1.2T",
  label = "RICHESSE CACHEE",
  subtitle = "AFRIQUE · SOUS-SOL",
}) => {
  const frame = useCurrentFrame();

  // Burn progress: frames 15-150 — overlay retreats upward
  const burnProgress = interpolate(frame, [15, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Height of revealed area (from bottom), in px
  const revealedHeight = burnProgress * 1920;
  // Overlay covers from top to (1920 - revealedHeight)
  const overlayHeight = Math.max(0, 1920 - revealedHeight);

  // Content opacity: starts fading in from frame 60, fully visible by 120
  const contentOpacity = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title fades in early
  const titleOpacity = interpolate(frame, [0, 25], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flame line visibility: only during burn phase
  const flameOpacity = interpolate(frame, [10, 20, 140, 155], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sparks: 8 particles rising from the flame line
  const sparks = Array.from({ length: 8 }, (_, i) => {
    const seed = Math.abs(Math.sin(i * 7.3)) * 0.5 + 0.25;
    const x = 80 + seed * 920;
    const lifetime = 40;
    const age = (frame + i * 13) % lifetime;
    const yOffset = -age * 7;
    const opacity = (1 - age / lifetime) * flameOpacity;
    const size = 3 + seed * 5;
    return { x, yOffset, opacity, size, key: i };
  });

  // Dot grid background pattern
  const dotGrid =
    "radial-gradient(circle, rgba(196,160,83,0.12) 1px, transparent 1px)";

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: "Cinzel, serif" }}>
      {/* --- Layer 1: Content (below burn overlay) --- */}
      <AbsoluteFill
        style={{
          backgroundImage: dotGrid,
          backgroundSize: "48px 48px",
        }}
      >
        {/* Top title */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: titleOpacity,
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 52,
              fontWeight: 700,
              color: GOLD,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
        </div>

        {/* Icon centered ~38% from top */}
        <div
          style={{
            position: "absolute",
            top: "32%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            opacity: contentOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {resolveIcon(icon, 340)}
        </div>

        {/* Stat massive */}
        <div
          style={{
            position: "absolute",
            top: "54%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: contentOpacity,
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 220,
              fontWeight: 900,
              color: IVORY,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "block",
              textShadow: `0 0 60px rgba(196,160,83,0.35)`,
            }}
          >
            {stat}
          </span>
        </div>

        {/* Label */}
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: contentOpacity,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 44,
              fontWeight: 500,
              color: GOLD,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>

        {/* Subtitle bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: contentOpacity,
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 24,
              color: SLATE,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {subtitle}
          </span>
        </div>
      </AbsoluteFill>

      {/* --- Layer 2: Burn overlay (retreats upward) --- */}
      {overlayHeight > 0 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: overlayHeight,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Main dark fire body */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(18,6,0,0.99) 0%, rgba(50,15,2,0.97) 50%, rgba(140,45,5,0.93) 80%, rgba(220,90,10,0.75) 92%, rgba(255,130,20,0.4) 100%)",
            }}
          />

          {/* Flame glow at bottom edge of overlay */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 120,
              background:
                "linear-gradient(to top, rgba(255,140,10,0.0) 0%, rgba(255,100,5,0.35) 60%, transparent 100%)",
              opacity: flameOpacity,
            }}
          />

          {/* Flame SVG line at the bottom edge */}
          <svg
            viewBox={`0 0 1080 60`}
            width={1080}
            height={60}
            style={{
              position: "absolute",
              bottom: -2,
              left: 0,
              opacity: flameOpacity,
              filter: "drop-shadow(0 0 15px rgba(196,160,83,0.8))",
            }}
            preserveAspectRatio="none"
          >
            <path
              d={buildFlamePath(frame, 1080)}
              fill="rgba(255,120,15,0.85)"
            />
            <path
              d={buildFlamePath(frame + 4, 1080)}
              fill="rgba(255,160,30,0.45)"
            />
          </svg>
        </div>
      )}

      {/* --- Layer 3: Sparks (above overlay) --- */}
      {sparks.map((spark) => (
        <div
          key={spark.key}
          style={{
            position: "absolute",
            left: spark.x,
            // Sparks originate at the flame line position
            top: overlayHeight + spark.yOffset - 8,
            width: spark.size,
            height: spark.size,
            borderRadius: "50%",
            backgroundColor: "#ff9020",
            opacity: spark.opacity,
            pointerEvents: "none",
            boxShadow: `0 0 ${spark.size * 2}px rgba(255,160,30,0.8)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
