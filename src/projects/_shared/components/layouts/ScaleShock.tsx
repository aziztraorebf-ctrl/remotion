import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ScaleShockProps {
  topLabel?: string;
  labelLeft?: string;
  labelLeftSub?: string;
  labelRight?: string;
  labelRightSub?: string;
  subtitle?: string;
  ratioScale?: number;
  bgColor?: string;
}

const LEFT_R = 55; // rayon petit cercle (Belgique) en px
const MAX_RIGHT_DIAMETER = 480; // diametre max du grand cercle pour tenir dans la zone

export const ScaleShock: React.FC<ScaleShockProps> = ({
  topLabel = "SUPERFICIE COMPARÉE",
  labelLeft = "Belgique",
  labelLeftSub = "30 528 km²",
  labelRight = "Afrique",
  labelRightSub = "30 370 000 km²",
  subtitle = "superficie comparée",
  ratioScale = 30,
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Entry spring (titles + left circle) ---
  const entrySpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const entryOpacity = interpolate(entrySpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const entryY = interpolate(entrySpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

  // --- Right circle growth (starts at frame 20) ---
  const growSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, mass: 1.2, stiffness: 90 },
  });
  // Diametre final proportionnel à sqrt(ratio) * LEFT_R * 2, cappé à MAX_RIGHT_DIAMETER
  const finalDiameter = Math.min(LEFT_R * 2 * Math.sqrt(ratioScale), MAX_RIGHT_DIAMETER);
  const diameter = interpolate(growSpring, [0, 1], [LEFT_R * 2, finalDiameter], {
    extrapolateRight: "clamp",
  });

  // Glow suit la croissance
  const glowRadius = interpolate(growSpring, [0, 1], [8, 60], { extrapolateRight: "clamp" });
  const glowOpacity = interpolate(growSpring, [0, 1], [0.3, 0.7], { extrapolateRight: "clamp" });

  // Lines draw in (horizontal midline + vertical divider)
  const lineSpring = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 70 } });
  const lineScale = interpolate(lineSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Labels below circles fade in after growth starts
  const labelSpring = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 90 } });
  const labelOpacity = interpolate(labelSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(labelSpring, [0, 1], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>

      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,55,0.38) 1.5px, transparent 1.5px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top label */}
      <div
        className="absolute left-0 right-0 text-center tracking-[0.2em] uppercase"
        style={{
          top: 100,
          fontSize: 52,
          color: "#dcb35a",
          fontFamily: "Cinzel, serif",
          opacity: entryOpacity,
          transform: `translateY(${entryY}px)`,
        }}
      >
        {topLabel}
      </div>

      {/* Percentage markers row */}
      <div
        className="absolute left-0 right-0 flex flex-row"
        style={{ top: 240, opacity: entryOpacity }}
      >
        <div
          className="flex justify-center font-mono text-[#8e95a5]"
          style={{ width: "35%", fontSize: 26 }}
        >
          30%
        </div>
        <div
          className="flex justify-center font-mono text-[#8e95a5]"
          style={{ width: "65%", fontSize: 26 }}
        >
          70%
        </div>
      </div>

      {/* Horizontal separator line under percentages */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 284,
          height: 1,
          backgroundColor: "rgba(220,179,90,0.4)",
          transform: `scaleX(${lineScale})`,
          transformOrigin: "left center",
        }}
      />

      {/* Vertical divider — de la ligne horiz jusqu'au footer */}
      <div
        className="absolute"
        style={{
          left: "35%",
          top: 284,
          bottom: 200,
          width: 1,
          backgroundColor: "rgba(220,179,90,0.3)",
          transform: `scaleY(${lineScale})`,
          transformOrigin: "top center",
        }}
      />

      {/* Main content zone — cercles + labels en flex column */}
      <div
        className="absolute left-0 right-0 flex flex-row items-center"
        style={{ top: 340, bottom: 200, overflow: "visible" }}
      >
        {/* Left zone */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "35%", gap: 28, overflow: "visible", height: "100%" }}
        >
          <div
            style={{
              width: LEFT_R * 2,
              height: LEFT_R * 2,
              borderRadius: "50%",
              backgroundColor: "#c8a951",
              boxShadow: "0 0 18px 5px rgba(200,169,81,0.35)",
              opacity: entryOpacity,
              flexShrink: 0,
            }}
          />
          {/* Left label — directement sous le cercle */}
          <div
            className="flex flex-col items-center"
            style={{
              gap: 6,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
            }}
          >
            <div className="font-mono text-center" style={{ fontSize: 28, color: "#f5efe0" }}>
              {labelLeft}
            </div>
            <div className="font-mono text-center" style={{ fontSize: 22, color: "#8e95a5" }}>
              {labelLeftSub}
            </div>
          </div>
        </div>

        {/* Right zone */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: "65%", gap: 32, overflow: "visible", height: "100%" }}
        >
          <div
            style={{
              width: diameter,
              height: diameter,
              borderRadius: "50%",
              backgroundColor: "#dcb35a",
              boxShadow: `0 0 ${glowRadius}px ${glowRadius * 0.5}px rgba(220,179,90,${glowOpacity})`,
              flexShrink: 0,
            }}
          />
          {/* Right label — directement sous le grand cercle */}
          <div
            className="flex flex-col items-center"
            style={{
              gap: 6,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px)`,
            }}
          >
            <div className="font-mono text-center" style={{ fontSize: 28, color: "#f5efe0" }}>
              {labelRight}
            </div>
            <div className="font-mono text-center" style={{ fontSize: 22, color: "#8e95a5" }}>
              {labelRightSub}
            </div>
          </div>
        </div>
      </div>

      {/* Footer separator */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 80, gap: 18, opacity: entryOpacity }}
      >
        <div style={{ width: 380, height: 1, backgroundColor: "#dcb35a", opacity: 0.5 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 28, color: "#8e95a5" }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
