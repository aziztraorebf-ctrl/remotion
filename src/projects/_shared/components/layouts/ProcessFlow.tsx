import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Pickaxe, Landmark, Factory, Ship, Flag, Diamond,
  Zap, Globe, Wheat, Fuel, Building2, Crown, Boxes,
  Search, Truck, Package, DollarSign, ArrowDown, ChevronDown,
  Smartphone, Users, TrendingUp, Wifi,
} from "lucide-react";

export type FlowIcon =
  | "pickaxe" | "bank" | "factory" | "ship" | "flag" | "diamond"
  | "zap" | "globe" | "wheat" | "fuel" | "building" | "crown"
  | "boxes" | "search" | "truck" | "package" | "dollar"
  | "smartphone" | "users" | "trending" | "wifi";

const ICONS: Record<FlowIcon, React.FC<{ size: number; color: string }>> = {
  pickaxe: ({ size, color }) => <Pickaxe size={size} color={color} />,
  bank: ({ size, color }) => <Landmark size={size} color={color} />,
  factory: ({ size, color }) => <Factory size={size} color={color} />,
  ship: ({ size, color }) => <Ship size={size} color={color} />,
  flag: ({ size, color }) => <Flag size={size} color={color} />,
  diamond: ({ size, color }) => <Diamond size={size} color={color} />,
  zap: ({ size, color }) => <Zap size={size} color={color} />,
  globe: ({ size, color }) => <Globe size={size} color={color} />,
  wheat: ({ size, color }) => <Wheat size={size} color={color} />,
  fuel: ({ size, color }) => <Fuel size={size} color={color} />,
  building: ({ size, color }) => <Building2 size={size} color={color} />,
  crown: ({ size, color }) => <Crown size={size} color={color} />,
  boxes: ({ size, color }) => <Boxes size={size} color={color} />,
  search: ({ size, color }) => <Search size={size} color={color} />,
  truck: ({ size, color }) => <Truck size={size} color={color} />,
  package: ({ size, color }) => <Package size={size} color={color} />,
  dollar: ({ size, color }) => <DollarSign size={size} color={color} />,
  smartphone: ({ size, color }) => <Smartphone size={size} color={color} />,
  users: ({ size, color }) => <Users size={size} color={color} />,
  trending: ({ size, color }) => <TrendingUp size={size} color={color} />,
  wifi: ({ size, color }) => <Wifi size={size} color={color} />,
};

export interface FlowStep {
  icon: FlowIcon;
  label: string;
  edgeLabel?: string;
  isActive?: boolean;
}

export interface ProcessFlowProps {
  title?: string;
  steps?: FlowStep[];
  subtitle?: string;
}

const DEFAULT_STEPS: FlowStep[] = [
  { icon: "pickaxe", label: "MINE", edgeLabel: "180K T" },
  { icon: "truck", label: "TRANSPORT", isActive: true, edgeLabel: "$4.2B" },
  { icon: "building", label: "BROKER" },
  { icon: "ship", label: "EXPORT" },
];

const GOLD = "#c4a053";
const GOLD_DIM = "rgba(196,160,83,0.35)";
const SLATE = "#64748b";
const CIRCLE_CX = 400; // position X du centre des cercles (légèrement à gauche du centre)

export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  title = "CIRCUIT",
  steps = DEFAULT_STEPS,
  subtitle = "FLUX",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleSpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

  const footerSpring = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 70 } });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  const H = 1920;
  const TITLE_H = 220;
  const FOOTER_H = 200;
  const availableH = H - TITLE_H - FOOTER_H;
  const N = steps.length;
  // Espacement vertical entre centres de cercles
  const STEP_SPACING = Math.min(availableH / N, 380);
  const totalH = STEP_SPACING * (N - 1);
  const firstY = TITLE_H + (availableH - totalH) / 2;

  const CR_ACTIVE = 100;
  const CR_DEFAULT = 78;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1220" }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(196,160,83,0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Titre */}
      <div
        className="absolute left-0 right-0 text-center tracking-[0.25em] uppercase"
        style={{
          top: 110,
          fontSize: 68,
          color: GOLD,
          fontFamily: "Cinzel, serif",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </div>

      {/* SVG — connecteurs + flèches */}
      <svg className="absolute inset-0" width={1080} height={1920} style={{ overflow: "visible" }}>
        <defs>
          <marker id="pf-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={GOLD} opacity="0.7" />
          </marker>
        </defs>

        {steps.map((step, i) => {
          if (i === steps.length - 1) return null;

          const cy1 = firstY + i * STEP_SPACING;
          const cy2 = firstY + (i + 1) * STEP_SPACING;
          const cr1 = step.isActive ? CR_ACTIVE : CR_DEFAULT;
          const cr2 = steps[i + 1].isActive ? CR_ACTIVE : CR_DEFAULT;

          const lineDelay = 10 + i * 15;
          const lineSpring = spring({ frame: frame - lineDelay, fps, config: { damping: 22, stiffness: 65 } });
          const lineProg = interpolate(lineSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

          const startY = cy1 + cr1;
          const endY = cy2 - cr2;
          const curEndY = startY + (endY - startY) * lineProg;
          const midY = (startY + endY) / 2;

          // Edge label de la prochaine étape (affiché sur le connecteur)
          const nextEdgeLabel = steps[i + 1].edgeLabel;

          return (
            <g key={i}>
              <line
                x1={CIRCLE_CX} y1={startY}
                x2={CIRCLE_CX} y2={curEndY}
                stroke={GOLD}
                strokeWidth={2}
                strokeOpacity={0.5}
                markerEnd={lineProg > 0.9 ? "url(#pf-arrow)" : undefined}
              />
              {/* Chevron visuel au milieu */}
              {lineProg > 0.5 && (
                <text
                  x={CIRCLE_CX}
                  y={midY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={40}
                  fill={GOLD}
                  opacity={Math.min((lineProg - 0.5) * 2, 0.8)}
                  fontFamily="sans-serif"
                >
                  ›
                </text>
              )}
              {/* Edge label — à gauche de la ligne pour éviter débordement droite */}
              {nextEdgeLabel && lineProg > 0.6 && (
                <text
                  x={CIRCLE_CX - 30}
                  y={midY}
                  fontSize={28}
                  fill={GOLD}
                  fontFamily="'IBM Plex Mono', monospace"
                  dominantBaseline="middle"
                  textAnchor="end"
                  opacity={Math.min((lineProg - 0.6) / 0.4, 1) * 0.85}
                >
                  {nextEdgeLabel}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Étapes — cercles + icônes + labels */}
      {steps.map((step, i) => {
        const cy = firstY + i * STEP_SPACING;
        const isActive = !!step.isActive;
        const CR = isActive ? CR_ACTIVE : CR_DEFAULT;
        const iconSize = isActive ? 72 : 56;

        const stepDelay = 8 + i * 15;
        const stepSpring = spring({ frame: frame - stepDelay, fps, config: { damping: 16, stiffness: 80 } });
        const stepOpacity = interpolate(stepSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
        const stepScale = interpolate(stepSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

        // Glow pulse pour l'étape active
        const glowPulse = isActive
          ? Math.sin((frame / 30) * Math.PI) * 0.25 + 0.5
          : 0;

        const IconComp = ICONS[step.icon];

        return (
          <React.Fragment key={i}>
            {/* Cercle SVG inline via div */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: CIRCLE_CX - CR,
                top: cy - CR,
                width: CR * 2,
                height: CR * 2,
                opacity: stepOpacity,
                transform: `scale(${stepScale})`,
                transformOrigin: "center",
              }}
            >
              {/* Glow actif */}
              {isActive && (
                <div
                  className="absolute"
                  style={{
                    width: CR * 2 + 60,
                    height: CR * 2 + 60,
                    borderRadius: "50%",
                    backgroundColor: `rgba(196,160,83,${glowPulse * 0.2})`,
                    filter: "blur(20px)",
                    top: -30,
                    left: -30,
                  }}
                />
              )}
              {/* Cercle border */}
              <div
                style={{
                  width: CR * 2,
                  height: CR * 2,
                  borderRadius: "50%",
                  backgroundColor: "#0b1220",
                  border: `${isActive ? 3 : 2}px solid ${isActive ? GOLD : GOLD_DIM}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <IconComp size={iconSize} color={GOLD} />
              </div>
            </div>

            {/* Label à droite du cercle */}
            <div
              className="absolute font-mono uppercase tracking-wider"
              style={{
                left: CIRCLE_CX + CR + 36,
                top: cy - 22,
                fontSize: isActive ? 38 : 30,
                color: isActive ? "#f5efe0" : SLATE,
                fontWeight: isActive ? 600 : 400,
                opacity: stepOpacity,
                transform: `scale(${stepScale})`,
                transformOrigin: "left center",
                letterSpacing: "0.1em",
              }}
            >
              {step.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Footer */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 80, gap: 16, opacity: footerOpacity }}
      >
        <div style={{ width: 320, height: 1, backgroundColor: GOLD, opacity: 0.4 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 26, color: SLATE }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
