import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { Diamond, Crown, Globe, Zap, TrendingUp, Building2, Users, Flag } from "lucide-react";

export type ShatterIcon = "diamond" | "crown" | "globe" | "zap" | "trending" | "building" | "users" | "flag";

export interface ShatterReformProps {
  title?: string;
  icon?: ShatterIcon;
  stat?: string;
  label?: string;
  subtitle?: string;
}

const GOLD = "#c4a053";
const IVORY = "#f2ebd9";
const SLATE = "#64748b";
const BG = "#0d1420";
const FPS = 30;

// Deterministic pseudo-random from seed
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5;
  return x - Math.floor(x);
}

// Build fragment data once (stable across renders)
const fragments = Array.from({ length: 45 }, (_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);

  // Target position: center of each cell in the grid
  const targetX = 90 + col * 180 + 90;
  const targetY = 260 + row * 155 + 77;

  // Initial dispersed position
  const initX = pseudoRandom(i * 3.7) * 1080;
  const initY = pseudoRandom(i * 5.3) * 1920;

  // Delay: fragments closest to center reform first
  const distToCenter = Math.sqrt((col - 2) ** 2 + (row - 4) ** 2);
  const delay = 30 + distToCenter * 8;

  // Initial rotation offset (dispersed state)
  const initRotation = pseudoRandom(i * 11) * 60 - 30;

  return { col, row, targetX, targetY, initX, initY, delay, initRotation };
});

function resolveIcon(icon: ShatterIcon, size: number): React.ReactNode {
  const style = {
    width: size,
    height: size,
    color: GOLD,
    filter: `drop-shadow(0 0 30px rgba(196,160,83,0.7))`,
  };
  switch (icon) {
    case "diamond":
      return <Diamond style={style} strokeWidth={1.2} />;
    case "crown":
      return <Crown style={style} strokeWidth={1.2} />;
    case "globe":
      return <Globe style={style} strokeWidth={1.2} />;
    case "zap":
      return <Zap style={style} strokeWidth={1.2} />;
    case "trending":
      return <TrendingUp style={style} strokeWidth={1.2} />;
    case "building":
      return <Building2 style={style} strokeWidth={1.2} />;
    case "users":
      return <Users style={style} strokeWidth={1.2} />;
    case "flag":
      return <Flag style={style} strokeWidth={1.2} />;
    default:
      return <Crown style={style} strokeWidth={1.2} />;
  }
}

export const ShatterReform: React.FC<ShatterReformProps> = ({
  title = "RECONSTITUTION",
  icon = "crown",
  stat = "80%",
  label = "CONTROLE",
  subtitle = "RESSOURCES NATURELLES",
}) => {
  const frame = useCurrentFrame();

  // Crack lines opacity: visible at start, disappear as grid reforms
  const crackOpacity = interpolate(frame, [0, 90], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stat content appears when grid is mostly reformed (~frame 110)
  const statOpacity = spring({
    frame: frame - 110,
    fps: FPS,
    config: { damping: 25, stiffness: 50 },
  });

  // Title opacity: present from the start
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle opacity: matches stat reveal
  const subtitleOpacity = spring({
    frame: frame - 115,
    fps: FPS,
    config: { damping: 25, stiffness: 50 },
  });

  // Crack lines radiating from center
  const cracks = [
    { angle: 30, length: 300 },
    { angle: 105, length: 250 },
    { angle: 200, length: 280 },
    { angle: 290, length: 220 },
    { angle: 340, length: 190 },
  ];

  // Overall grid flash effect when fully reformed
  const gridFlash = spring({
    frame: frame - 105,
    fps: FPS,
    config: { damping: 40, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG, fontFamily: "Cinzel, serif", overflow: "hidden" }}>

      {/* === Layer 1: Fragment grid === */}
      <AbsoluteFill>
        {fragments.map((frag, i) => {
          const progress = spring({
            frame: frame - frag.delay,
            fps: FPS,
            config: { damping: 20, stiffness: 60 },
          });

          const currentX = frag.initX + (frag.targetX - frag.initX) * progress;
          const currentY = frag.initY + (frag.targetY - frag.initY) * progress;
          const rotation = (1 - progress) * frag.initRotation;
          const fragOpacity = interpolate(progress, [0, 0.15, 1], [0.15, 0.6, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const borderOpacity = 0.15 + progress * 0.25;

          // Pulse scale on reformed fragments (after frame 150)
          const pulseScale = frame > 150
            ? Math.sin(((frame - 150) / 12) * Math.PI) * 0.015 + 1
            : 1;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 170,
                height: 145,
                left: currentX - 85,
                top: currentY - 72,
                background: `linear-gradient(135deg, rgba(196,160,83,0.08) 0%, rgba(196,160,83,0.04) 100%)`,
                border: `1px solid rgba(196,160,83,${borderOpacity.toFixed(3)})`,
                borderRadius: 3,
                transform: `rotateZ(${rotation.toFixed(2)}deg) scale(${pulseScale.toFixed(4)})`,
                opacity: fragOpacity,
                boxShadow: progress > 0.85
                  ? `inset 0 0 20px rgba(196,160,83,${(gridFlash * 0.08).toFixed(3)})`
                  : "none",
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* === Layer 2: SVG crack lines overlay === */}
      {crackOpacity > 0 && (
        <AbsoluteFill style={{ opacity: crackOpacity, pointerEvents: "none" }}>
          <svg
            width={1080}
            height={1920}
            style={{ position: "absolute", inset: 0 }}
          >
            {cracks.map((crack, i) => {
              const angleRad = (crack.angle * Math.PI) / 180;
              const x2 = 540 + Math.cos(angleRad) * crack.length;
              const y2 = 960 + Math.sin(angleRad) * crack.length;
              return (
                <g key={i}>
                  <line
                    x1={540}
                    y1={960}
                    x2={x2}
                    y2={y2}
                    stroke={GOLD}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                  {/* Secondary micro-crack branching */}
                  <line
                    x1={540 + Math.cos(angleRad) * crack.length * 0.5}
                    y1={960 + Math.sin(angleRad) * crack.length * 0.5}
                    x2={540 + Math.cos(angleRad + 0.5) * crack.length * 0.3}
                    y2={960 + Math.sin(angleRad + 0.5) * crack.length * 0.3}
                    stroke={GOLD}
                    strokeWidth={0.8}
                    strokeLinecap="round"
                    opacity={0.6}
                  />
                </g>
              );
            })}
            {/* Center shard point */}
            <circle cx={540} cy={960} r={3} fill={GOLD} opacity={0.8} />
          </svg>
        </AbsoluteFill>
      )}

      {/* === Layer 3: Stat content (appears over reformed grid) === */}
      <AbsoluteFill style={{ opacity: statOpacity, pointerEvents: "none" }}>
        {/* Icon at ~35% from top */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {resolveIcon(icon, 200)}
        </div>

        {/* Stat — massive number */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            textAlign: "center",
            transform: "translateY(-50%)",
          }}
        >
          <span
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 240,
              fontWeight: 900,
              color: IVORY,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              display: "block",
              textShadow: `0 0 80px rgba(196,160,83,0.4)`,
            }}
          >
            {stat}
          </span>
        </div>

        {/* Label under stat */}
        <div
          style={{
            position: "absolute",
            top: "65%",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 50,
              fontWeight: 500,
              color: IVORY,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </AbsoluteFill>

      {/* === Layer 4: Fixed UI elements === */}

      {/* Top title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          pointerEvents: "none",
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

      {/* Bottom subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtitleOpacity,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 24,
            color: IVORY,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </span>
      </div>
    </AbsoluteFill>
  );
};
