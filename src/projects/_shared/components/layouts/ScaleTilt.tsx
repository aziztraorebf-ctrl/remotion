import React from "react";
import { useCurrentFrame } from "remotion";
import { Building2, TrendingUp, Diamond, DollarSign, Crown, Factory, Globe, Flag } from "lucide-react";

const GOLD = "#c4a053";
const IVORY = "#f2ebd9";
const NAVY = "#0d1420";
const SLATE = "#64748b";

const ICON_MAP = {
  building: Building2,
  trending: TrendingUp,
  diamond: Diamond,
  dollar: DollarSign,
  crown: Crown,
  factory: Factory,
  globe: Globe,
  flag: Flag,
};

export interface ScaleSide {
  icon: "building" | "trending" | "diamond" | "dollar" | "crown" | "factory" | "globe" | "flag";
  label: string;
  stat: string;
}

export interface ScaleTiltProps {
  title?: string;
  leftSide?: ScaleSide;
  rightSide?: ScaleSide;
  heavySide?: "left" | "right";
  subtitle?: string;
}

const oscillation = (frame: number, startFrame: number, targetAngle: number): number => {
  if (frame < startFrame) return 0;
  const t = (frame - startFrame) / 30;
  const decay = Math.exp(-t * 1.8);
  const swing = Math.sin(t * 4.5) * decay * 18;
  return targetAngle + swing;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ScaleTilt: React.FC<ScaleTiltProps> = ({
  title = "DESEQUILIBRE",
  leftSide = { icon: "building", label: "DETTE", stat: "$400B" },
  rightSide = { icon: "trending", label: "PIB", stat: "$180B" },
  heavySide = "left",
  subtitle = "DETTE SOUVERAINE",
}) => {
  const frame = useCurrentFrame();

  const targetAngle = heavySide === "left" ? -18 : 18;

  const beamAngleDeg = oscillation(frame, 20, targetAngle);

  const halfBeam = 350;
  const chainLen = 180;
  const beamCY = 780;

  const dropLeft = Math.sin((beamAngleDeg * Math.PI) / 180) * halfBeam;
  const leftPlateauY = 980 - dropLeft;
  const rightPlateauY = 980 + dropLeft;

  const plateauSize = 240;

  const leftCX = 540 - halfBeam * Math.cos((beamAngleDeg * Math.PI) / 180);
  const rightCX = 540 + halfBeam * Math.cos((beamAngleDeg * Math.PI) / 180);

  const globalOpacity = frame < 10 ? frame / 10 : 1;

  const beamOpacity = frame < 20 ? lerp(0, 1, frame / 20) : 1;
  const platOpacity = frame < 30 ? lerp(0, 1, Math.max(0, (frame - 5) / 25)) : 1;

  const titleOpacity = frame < 25 ? lerp(0, 1, frame / 25) : 1;
  const subtitleOpacity = frame < 40 ? lerp(0, 1, Math.max(0, (frame - 15) / 25)) : 1;

  const LeftIcon = ICON_MAP[leftSide.icon];
  const RightIcon = ICON_MAP[rightSide.icon];

  const leftIsHeavy = heavySide === "left";

  const leftScale = leftIsHeavy ? 1.05 : 0.92;
  const rightScale = leftIsHeavy ? 0.92 : 1.05;

  const scaleProgress = frame < 80 ? 0 : Math.min(1, (frame - 80) / 70);
  const leftPlateauScale = lerp(1, leftScale, scaleProgress);
  const rightPlateauScale = lerp(1, rightScale, scaleProgress);

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        background: NAVY,
        position: "relative",
        overflow: "hidden",
        opacity: globalOpacity,
        backgroundImage: "radial-gradient(rgba(196,160,83,0.28) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        fontFamily: "Cinzel, serif",
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 62,
            color: GOLD,
            letterSpacing: "0.2em",
            fontWeight: 700,
            textShadow: `0 0 40px rgba(196,160,83,0.4)`,
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: 120,
            height: 3,
            background: GOLD,
            margin: "16px auto 0",
            opacity: 0.6,
          }}
        />
      </div>

      {/* SVG layer: pivot + beam + chains */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width={1080}
        height={1920}
        opacity={beamOpacity}
      >
        {/* Pivot vertical pillar */}
        <line
          x1={540}
          y1={beamCY}
          x2={540}
          y2={1100}
          stroke={GOLD}
          strokeWidth={3}
          opacity={0.6}
        />

        {/* Rotating beam group */}
        <g transform={`rotate(${beamAngleDeg}, 540, ${beamCY})`}>
          {/* Beam bar */}
          <line
            x1={190}
            y1={beamCY}
            x2={890}
            y2={beamCY}
            stroke={GOLD}
            strokeWidth={6}
          />
          {/* Center pivot ball */}
          <circle cx={540} cy={beamCY} r={12} fill={GOLD} />
          {/* End knobs */}
          <circle cx={190} cy={beamCY} r={8} fill={GOLD} opacity={0.7} />
          <circle cx={890} cy={beamCY} r={8} fill={GOLD} opacity={0.7} />
          {/* Left chain */}
          <line
            x1={190}
            y1={beamCY}
            x2={190}
            y2={beamCY + chainLen}
            stroke={GOLD}
            strokeWidth={2}
            strokeDasharray="6,6"
            opacity={0.6}
          />
          {/* Right chain */}
          <line
            x1={890}
            y1={beamCY}
            x2={890}
            y2={beamCY + chainLen}
            stroke={GOLD}
            strokeWidth={2}
            strokeDasharray="6,6"
            opacity={0.6}
          />
        </g>
      </svg>

      {/* Left plateau */}
      <div
        style={{
          position: "absolute",
          left: leftCX - plateauSize / 2,
          top: leftPlateauY,
          width: plateauSize,
          height: plateauSize,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #1a2a40, #0b1220)",
          border: `3px solid ${GOLD}`,
          boxShadow: `0 0 30px rgba(196,160,83,0.25), inset 0 0 20px rgba(0,0,0,0.5)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: platOpacity,
          transform: `rotateZ(${-beamAngleDeg}deg) scale(${leftPlateauScale})`,
          transformOrigin: "center center",
        }}
      >
        <LeftIcon size={80} color={GOLD} strokeWidth={1.5} />
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 48,
            color: IVORY,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {leftSide.stat}
        </div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 36,
            color: IVORY,
            letterSpacing: "0.05em",
            fontWeight: 700,
          }}
        >
          {leftSide.label}
        </div>
      </div>

      {/* Right plateau */}
      <div
        style={{
          position: "absolute",
          left: rightCX - plateauSize / 2,
          top: rightPlateauY,
          width: plateauSize,
          height: plateauSize,
          borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #1a2a40, #0b1220)",
          border: `3px solid ${GOLD}`,
          boxShadow: `0 0 30px rgba(196,160,83,0.25), inset 0 0 20px rgba(0,0,0,0.5)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: platOpacity,
          transform: `rotateZ(${-beamAngleDeg}deg) scale(${rightPlateauScale})`,
          transformOrigin: "center center",
        }}
      >
        <RightIcon size={80} color={GOLD} strokeWidth={1.5} />
        <div
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 48,
            color: IVORY,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {rightSide.stat}
        </div>
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 36,
            color: IVORY,
            letterSpacing: "0.05em",
            fontWeight: 700,
          }}
        >
          {rightSide.label}
        </div>
      </div>

      {/* Heavy indicator arrow */}
      {frame > 100 && (
        <div
          style={{
            position: "absolute",
            bottom: 280,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: Math.min(1, (frame - 100) / 30),
          }}
        >
          <div
            style={{
              fontFamily: "IBM Plex Mono, monospace",
              fontSize: 28,
              color: "#f2ebd9",
              letterSpacing: "0.15em",
              opacity: 0.9,
            }}
          >
            {heavySide === "left" ? leftSide.label : rightSide.label} &gt; {heavySide === "left" ? rightSide.label : leftSide.label}
          </div>
        </div>
      )}

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "IBM Plex Mono, monospace",
            fontSize: 26,
            color: SLATE,
            letterSpacing: "0.1em",
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};
