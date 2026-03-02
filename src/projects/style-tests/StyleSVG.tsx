import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// Building component: rectangle body + triangle roof
const Building: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  roofHeight: number;
  bodyColor: string;
  roofColor: string;
  windowColor: string;
}> = ({ x, y, width, height, roofHeight, bodyColor, roofColor, windowColor }) => {
  const roofPoints = `${x},${y} ${x + width / 2},${y - roofHeight} ${x + width},${y}`;

  return (
    <g>
      {/* Roof */}
      <polygon points={roofPoints} fill={roofColor} />
      {/* Body */}
      <rect x={x} y={y} width={width} height={height} fill={bodyColor} />
      {/* Door */}
      <rect
        x={x + width / 2 - 10}
        y={y + height - 40}
        width={20}
        height={40}
        fill="#2a1a0e"
        rx={2}
      />
      {/* Windows */}
      <rect
        x={x + 10}
        y={y + 20}
        width={22}
        height={18}
        fill={windowColor}
        rx={2}
      />
      <rect
        x={x + width - 32}
        y={y + 20}
        width={22}
        height={18}
        fill={windowColor}
        rx={2}
      />
    </g>
  );
};

// Stick figure with animated legs and arms
const Walker: React.FC<{
  x: number;
  y: number;
  legAngle: number;
  armAngle: number;
  color: string;
}> = ({ x, y, legAngle, armAngle, color }) => {
  const legLen = 28;
  const armLen = 20;
  const bodyTop = y - 60;
  const hipY = y - 28;
  const shoulderY = bodyTop + 16;

  // Left leg swings forward, right leg swings back
  const leftLegEndX = x + Math.sin(legAngle) * legLen;
  const leftLegEndY = hipY + Math.cos(Math.abs(legAngle)) * legLen;

  const rightLegEndX = x + Math.sin(-legAngle) * legLen;
  const rightLegEndY = hipY + Math.cos(Math.abs(legAngle)) * legLen;

  // Arms swing opposite to legs
  const leftArmEndX = x + Math.sin(-armAngle) * armLen;
  const leftArmEndY = shoulderY + Math.cos(Math.abs(armAngle)) * armLen;

  const rightArmEndX = x + Math.sin(armAngle) * armLen;
  const rightArmEndY = shoulderY + Math.cos(Math.abs(armAngle)) * armLen;

  return (
    <g>
      {/* Head */}
      <circle cx={x} cy={bodyTop - 12} r={12} fill={color} />
      {/* Body */}
      <line
        x1={x}
        y1={bodyTop}
        x2={x}
        y2={hipY}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Left arm */}
      <line
        x1={x}
        y1={shoulderY}
        x2={leftArmEndX}
        y2={leftArmEndY}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Right arm */}
      <line
        x1={x}
        y1={shoulderY}
        x2={rightArmEndX}
        y2={rightArmEndY}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* Left leg */}
      <line
        x1={x}
        y1={hipY}
        x2={leftLegEndX}
        y2={leftLegEndY}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Right leg */}
      <line
        x1={x}
        y1={hipY}
        x2={rightLegEndX}
        y2={rightLegEndY}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    </g>
  );
};

// Stars in the night sky
const Stars: React.FC<{ count: number; width: number; height: number }> = ({
  count,
  width,
  height,
}) => {
  const stars = React.useMemo(() => {
    const result = [];
    // Deterministic pseudo-random positions
    for (let i = 0; i < count; i++) {
      const seed = i * 7919;
      const sx = ((seed * 1103515245 + 12345) & 0x7fffffff) % width;
      const sy = ((seed * 1664525 + 1013904223) & 0x7fffffff) % (height * 0.5);
      const size = (i % 3) * 0.5 + 0.8;
      result.push({ x: sx, y: sy, size });
    }
    return result;
  }, [count, width, height]);

  return (
    <g>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.size} fill="#ffffff" opacity={0.7} />
      ))}
    </g>
  );
};

export const StyleSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Scene entry spring
  const sceneEntry = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  // Character horizontal position: walks from off-screen left to off-screen right
  const charX = interpolate(frame, [0, 150], [-60, width + 60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Character vertical bob: subtle up/down while walking
  const walkCycle = frame * 0.25; // radians per frame
  const charBob = Math.sin(walkCycle * 2) * 3;
  const charY = height - 130 + charBob;

  // Leg oscillation angle
  const legAngle = Math.sin(walkCycle) * 0.5;
  const armAngle = Math.sin(walkCycle) * 0.35;

  // Moon entrance
  const moonY = interpolate(sceneEntry, [0, 1], [-80, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ground line Y position
  const groundY = height - 90;

  // Building data (static positions)
  const buildings = [
    { x: 80, bodyW: 100, bodyH: 160, roofH: 55, roofColor: "#2d1f15" },
    { x: 210, bodyW: 130, bodyH: 200, roofH: 70, roofColor: "#3a2518" },
    { x: 380, bodyW: 90, bodyH: 130, roofH: 45, roofColor: "#251610" },
    { x: 520, bodyW: 115, bodyH: 175, roofH: 60, roofColor: "#2d1f15" },
    { x: 680, bodyW: 140, bodyH: 210, roofH: 80, roofColor: "#3a2518" },
    { x: 870, bodyW: 95, bodyH: 145, roofH: 50, roofColor: "#251610" },
    { x: 1010, bodyW: 120, bodyH: 185, roofH: 65, roofColor: "#2d1f15" },
    { x: 1180, bodyW: 105, bodyH: 155, roofH: 55, roofColor: "#3a2518" },
    { x: 1340, bodyW: 135, bodyH: 195, roofH: 72, roofColor: "#251610" },
    { x: 1530, bodyW: 90, bodyH: 135, roofH: 48, roofColor: "#2d1f15" },
    { x: 1670, bodyW: 115, bodyH: 170, roofH: 62, roofColor: "#3a2518" },
  ];

  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block", background: "#1a1a2e" }}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Night sky gradient */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0d1a" />
          <stop offset="70%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#2a1a3e" />
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffde0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fffde0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width={width} height={height} fill="url(#skyGrad)" />

      {/* Stars */}
      <Stars count={80} width={width} height={height - 200} />

      {/* Moon */}
      <circle cx={1700} cy={moonY} r={55} fill="url(#moonGlow)" />
      <circle cx={1700} cy={moonY} r={40} fill="#fffde0" opacity={0.9} />
      {/* Moon crescent shadow */}
      <circle cx={1715} cy={moonY - 5} r={34} fill="#1a1a2e" opacity={0.75} />

      {/* Buildings (behind ground, in front of sky) */}
      {buildings.map((b, i) => (
        <Building
          key={i}
          x={b.x}
          y={groundY - b.bodyH}
          width={b.bodyW}
          height={b.bodyH}
          roofHeight={b.roofH}
          bodyColor="#4a3728"
          roofColor={b.roofColor}
          windowColor="#c8a84b"
        />
      ))}

      {/* Ground */}
      <rect x={0} y={groundY} width={width} height={height - groundY} fill="#2a1e14" />
      {/* Ground highlight line */}
      <line
        x1={0}
        y1={groundY}
        x2={width}
        y2={groundY}
        stroke="#5a4030"
        strokeWidth={2}
      />
      {/* Cobblestone hints */}
      {Array.from({ length: 24 }).map((_, i) => (
        <ellipse
          key={i}
          cx={80 + i * 80}
          cy={groundY + 20}
          rx={28}
          ry={8}
          fill="#352518"
          opacity={0.5}
        />
      ))}

      {/* Walker character */}
      <Walker
        x={charX}
        y={charY}
        legAngle={legAngle}
        armAngle={armAngle}
        color="#e8d5b7"
      />

      {/* Title overlay — subtle */}
      <text
        x={width / 2}
        y={50}
        textAnchor="middle"
        fill="#7a6a5a"
        fontSize={18}
        fontFamily="Georgia, serif"
        opacity={0.6}
      >
        Style Test - SVG Village Medievale
      </text>
    </svg>
  );
};

export default StyleSVG;
