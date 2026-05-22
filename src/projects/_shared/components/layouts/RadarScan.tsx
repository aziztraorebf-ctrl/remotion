import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { Diamond, Pickaxe, Ship, Factory, DollarSign, Crown, Flag, Zap } from "lucide-react";

export interface RadarTarget {
  dx: number;
  dy: number;
  icon: "diamond" | "pickaxe" | "ship" | "factory" | "dollar" | "crown" | "flag" | "zap";
  label: string;
  revealFrame: number;
}

export interface RadarScanProps {
  title?: string;
  targets?: RadarTarget[];
  subtitle?: string;
  bgColor?: string;
}

const DEFAULT_TARGETS: RadarTarget[] = [
  { dx: 120, dy: -200, icon: "diamond", label: "OR", revealFrame: 30 },
  { dx: -250, dy: -80, icon: "pickaxe", label: "MINES", revealFrame: 55 },
  { dx: 300, dy: 150, icon: "ship", label: "EXPORT", revealFrame: 80 },
  { dx: -150, dy: 250, icon: "factory", label: "USINES", revealFrame: 105 },
  { dx: 50, dy: 320, icon: "dollar", label: "FLUX", revealFrame: 130 },
];

const ICON_MAP: Record<RadarTarget["icon"], React.FC<{ size: number; color: string; strokeWidth: number }>> = {
  diamond: ({ size, color, strokeWidth }) => <Diamond size={size} color={color} strokeWidth={strokeWidth} />,
  pickaxe: ({ size, color, strokeWidth }) => <Pickaxe size={size} color={color} strokeWidth={strokeWidth} />,
  ship: ({ size, color, strokeWidth }) => <Ship size={size} color={color} strokeWidth={strokeWidth} />,
  factory: ({ size, color, strokeWidth }) => <Factory size={size} color={color} strokeWidth={strokeWidth} />,
  dollar: ({ size, color, strokeWidth }) => <DollarSign size={size} color={color} strokeWidth={strokeWidth} />,
  crown: ({ size, color, strokeWidth }) => <Crown size={size} color={color} strokeWidth={strokeWidth} />,
  flag: ({ size, color, strokeWidth }) => <Flag size={size} color={color} strokeWidth={strokeWidth} />,
  zap: ({ size, color, strokeWidth }) => <Zap size={size} color={color} strokeWidth={strokeWidth} />,
};

const GOLD = "#c4a053";
const SECTOR_WIDTH_DEG = 60;

function getSweepPath(sweepAngleDeg: number, cx: number, cy: number, r: number): string {
  const sweepRad = (sweepAngleDeg - 90) * (Math.PI / 180);
  const endRad = sweepRad - (SECTOR_WIDTH_DEG * Math.PI) / 180;

  const x1 = cx + r * Math.cos(sweepRad);
  const y1 = cy + r * Math.sin(sweepRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2} Z`;
}

function getTrailArcPath(sweepAngleDeg: number, offsetDeg: number, cx: number, cy: number, r: number): string {
  const startRad = (sweepAngleDeg - offsetDeg - 90) * (Math.PI / 180);
  const endRad = (sweepAngleDeg - offsetDeg - SECTOR_WIDTH_DEG - 90) * (Math.PI / 180);

  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);

  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 0 ${x2} ${y2} Z`;
}

export const RadarScan: React.FC<RadarScanProps> = ({
  title = "DETECTION",
  targets = DEFAULT_TARGETS,
  subtitle = "SYSTEME · ACTIF",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const CX = width / 2;
  const CY = height / 2;
  const R = Math.min(width, height) * 0.39;

  const sweepAngle = (frame * 3.6) % 360;

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        backgroundImage: "radial-gradient(rgba(0,255,100,0.08) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        fontFamily: "Cinzel, serif",
        overflow: "hidden",
      }}
    >
      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Cinzel, serif",
          fontSize: 52,
          fontWeight: 700,
          color: GOLD,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      {/* Radar disc container — positioned absolutely at center */}
      <div
        style={{
          position: "absolute",
          left: CX - R,
          top: CY - R,
          width: R * 2,
          height: R * 2,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,40,20,0.85) 0%, rgba(0,15,8,0.95) 100%)",
          border: `2px solid rgba(196,160,83,0.5)`,
          overflow: "hidden",
        }}
      >
        <svg
          width={R * 2}
          height={R * 2}
          viewBox={`${CX - R} ${CY - R} ${R * 2} ${R * 2}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <radialGradient
              id="sweepGrad"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform={`translate(${CX},${CY}) scale(${R})`}
            >
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.0} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.25} />
            </radialGradient>
          </defs>

          {/* Concentric rings */}
          {[R * 0.25, R * 0.5, R * 0.75].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke={GOLD}
              strokeWidth={1}
              opacity={0.2}
            />
          ))}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.5} />

          {/* Cross axes */}
          <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke={GOLD} strokeWidth={1} opacity={0.15} />
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke={GOLD} strokeWidth={1} opacity={0.15} />

          {/* Trailing glow arcs */}
          <path d={getTrailArcPath(sweepAngle, 20, CX, CY, R)} fill="#00ff88" opacity={0.15} />
          <path d={getTrailArcPath(sweepAngle, 40, CX, CY, R)} fill="#00ff88" opacity={0.08} />
          <path d={getTrailArcPath(sweepAngle, 60, CX, CY, R)} fill="#00ff88" opacity={0.04} />

          {/* Main sweep sector */}
          <path d={getSweepPath(sweepAngle, CX, CY, R)} fill="url(#sweepGrad)" />

          {/* Sweep leading edge line */}
          {(() => {
            const rad = (sweepAngle - 90) * (Math.PI / 180);
            const ex = CX + R * Math.cos(rad);
            const ey = CY + R * Math.sin(rad);
            return (
              <line
                x1={CX}
                y1={CY}
                x2={ex}
                y2={ey}
                stroke="#00ff88"
                strokeWidth={2}
                opacity={0.7}
              />
            );
          })()}
        </svg>
      </div>

      {/* Target nodes — rendered outside SVG so we can use React components (Lucide) */}
      {targets.map((target, i) => {
        if (frame < target.revealFrame) return null;

        const elapsed = frame - target.revealFrame;
        const scale = spring({
          frame: elapsed,
          fps,
          config: { damping: 80, stiffness: 50, mass: 1 },
        });

        const blipOpacity = Math.sin((elapsed / 8) * Math.PI) * 0.3 + 0.7;

        const nodeSize = 72;
        const IconComp = ICON_MAP[target.icon];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX + target.dx - nodeSize / 2,
              top: CY + target.dy - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {/* Label above the node */}
            <div
              style={{
                position: "absolute",
                bottom: nodeSize + 6,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 22,
                color: "#c4a053",
                whiteSpace: "nowrap",
                opacity: blipOpacity,
                letterSpacing: "0.1em",
                fontWeight: "bold",
              }}
            >
              {target.label}
            </div>

            {/* Node circle */}
            <div
              style={{
                width: nodeSize,
                height: nodeSize,
                borderRadius: "50%",
                background: "rgba(0,20,10,0.9)",
                border: `2px solid ${GOLD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 30px rgba(0,255,136,0.8), 0 0 60px rgba(196,160,83,0.4)`,
                opacity: blipOpacity,
              }}
            >
              <IconComp size={32} color={GOLD} strokeWidth={1.5} />
            </div>
          </div>
        );
      })}

      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          left: CX - 5,
          top: CY - 5,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: GOLD,
          opacity: 0.8,
        }}
      />

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "IBM Plex Mono, monospace",
          fontSize: 24,
          color: "#64748b",
          letterSpacing: "0.15em",
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};
