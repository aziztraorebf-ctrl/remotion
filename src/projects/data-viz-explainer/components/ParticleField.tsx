import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  phase: number;
}

interface ParticleFieldProps {
  count?: number;
  color?: string;
  direction?: "up" | "down";
  startFrame?: number;
  maxOpacity?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 40,
  color = "rgba(255, 71, 87, 0.6)",
  direction = "up",
  startFrame = 0,
  maxOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    const seed = 42;
    return Array.from({ length: count }, (_, i) => {
      const hash = Math.sin(seed + i * 127.1) * 43758.5453;
      const h2 = Math.sin(seed + i * 269.5) * 13758.3;
      const h3 = Math.sin(seed + i * 419.2) * 23421.6;
      const h4 = Math.sin(seed + i * 631.7) * 9871.2;
      const h5 = Math.sin(seed + i * 853.3) * 31247.8;
      return {
        x: (hash - Math.floor(hash)) * width,
        y: (h2 - Math.floor(h2)) * height,
        size: 1.5 + (h3 - Math.floor(h3)) * 3,
        speed: 0.3 + (h4 - Math.floor(h4)) * 0.8,
        opacity: 0.2 + (h5 - Math.floor(h5)) * 0.6,
        drift: (h3 - Math.floor(h3)) * 2 - 1,
        phase: (h4 - Math.floor(h4)) * Math.PI * 2,
      };
    });
  }, [count, width, height]);

  const fadeIn = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: fadeIn * maxOpacity,
        pointerEvents: "none",
      }}
    >
      {particles.map((p, i) => {
        const t = (frame - startFrame) * p.speed;
        const dirMult = direction === "up" ? -1 : 1;
        const rawY = p.y + t * dirMult * 1.5;
        const y = ((rawY % height) + height) % height;
        const x = p.x + Math.sin(t * 0.02 + p.phase) * p.drift * 30;

        const pulse = 0.7 + Math.sin(frame * 0.05 + p.phase) * 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: p.opacity * pulse,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
