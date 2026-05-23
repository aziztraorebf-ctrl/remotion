import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface MapboxPulseProps {
  mapboxChildren: React.ReactNode;
  label: string;
  sublabel?: string;
  pulseColor?: string;
  labelTriggerFrame?: number;
  cx?: number;
  cy?: number;
}

const RING_PERIOD = 90;
const RING_STAGGER = 30;

export const MapboxPulse: React.FC<MapboxPulseProps> = ({
  mapboxChildren,
  label,
  sublabel,
  pulseColor = "#4a9eff",
  labelTriggerFrame = 0,
  cx = 0.5,
  cy = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const PX = width * cx;
  const PY = height * cy;
  const MAX_RADIUS = Math.min(width, height) * 0.28;

  // Label entry
  const labelP = spring({
    frame: frame - labelTriggerFrame,
    fps,
    config: { damping: 18, stiffness: 120 },
    durationInFrames: 25,
  });
  const labelOpacity = interpolate(labelP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const labelY = interpolate(labelP, [0, 1], [16, 0], { extrapolateRight: "clamp" });

  // Dot entry
  const dotP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 18,
  });
  const dotScale = interpolate(dotP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Crosshair draw-in
  const crossP = spring({
    frame: frame - 4,
    fps,
    config: { damping: 20, stiffness: 100 },
    durationInFrames: 22,
  });
  const crossScale = interpolate(crossP, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Heartbeat pulse on dot
  const sinePulse = Math.sin((frame / 30) * Math.PI * 2);
  const dotGlow = interpolate(sinePulse, [-1, 1], [0.6, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 3 expanding rings
  const rings = [0, 1, 2].map((i) => {
    const localFrame = Math.max(0, frame - i * RING_STAGGER);
    const progress = (localFrame % RING_PERIOD) / RING_PERIOD;
    const radius = progress * MAX_RADIUS;
    const opacity = interpolate(progress, [0, 0.15, 0.7, 1], [0, 0.7, 0.3, 0], { extrapolateRight: "clamp" });
    return { radius, opacity };
  });

  const CROSS_ARM = 28;

  return (
    <AbsoluteFill>
      {/* Mapbox fond full */}
      <div style={{ position: "absolute", inset: 0 }}>
        {mapboxChildren}
      </div>

      {/* Vignette navy subtile pour lisibilité label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 30%, rgba(26,37,53,0.5) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* SVG — anneaux + point + crosshair */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        {/* Anneaux expansifs */}
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={PX}
            cy={PY}
            r={ring.radius}
            stroke={pulseColor}
            strokeWidth={1.5}
            fill="none"
            opacity={ring.opacity}
          />
        ))}

        {/* Cercle statique de référence */}
        <circle
          cx={PX}
          cy={PY}
          r={18}
          stroke={pulseColor}
          strokeWidth={1}
          fill="none"
          opacity={0.4}
        />

        {/* Crosshair — 4 bras */}
        {/* Haut */}
        <line
          x1={PX} y1={PY - 10}
          x2={PX} y2={PY - 10 - CROSS_ARM * crossScale}
          stroke={pulseColor} strokeWidth={1.5} opacity={0.8}
        />
        {/* Bas */}
        <line
          x1={PX} y1={PY + 10}
          x2={PX} y2={PY + 10 + CROSS_ARM * crossScale}
          stroke={pulseColor} strokeWidth={1.5} opacity={0.8}
        />
        {/* Gauche */}
        <line
          x1={PX - 10} y1={PY}
          x2={PX - 10 - CROSS_ARM * crossScale} y2={PY}
          stroke={pulseColor} strokeWidth={1.5} opacity={0.8}
        />
        {/* Droite */}
        <line
          x1={PX + 10} y1={PY}
          x2={PX + 10 + CROSS_ARM * crossScale} y2={PY}
          stroke={pulseColor} strokeWidth={1.5} opacity={0.8}
        />

        {/* Point central */}
        <circle
          cx={PX}
          cy={PY}
          r={6 * dotScale}
          fill={pulseColor}
          opacity={dotGlow}
        />
        {/* Halo point */}
        <circle
          cx={PX}
          cy={PY}
          r={12 * dotScale}
          fill={pulseColor}
          opacity={dotGlow * 0.25}
        />
      </svg>

      {/* Label — ancré à droite du point, vertical center */}
      <div
        style={{
          position: "absolute",
          left: PX + 52,
          top: PY - 36,
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 32,
            fontWeight: 700,
            color: "#f2ebd9",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 22,
              fontWeight: 400,
              color: pulseColor,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default MapboxPulse;
