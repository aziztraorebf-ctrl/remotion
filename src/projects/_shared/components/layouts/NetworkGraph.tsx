import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Crown, Pickaxe, Landmark, Flag, Ship, Factory, Zap, Globe,
  Diamond, Wheat, Fuel, Building2, Boxes, Network,
} from "lucide-react";

export type NodeIcon =
  | "crown" | "pickaxe" | "bank" | "flag" | "ship" | "factory"
  | "zap" | "globe" | "diamond" | "wheat" | "fuel" | "building"
  | "boxes" | "network";

const ICON_MAP: Record<NodeIcon, React.FC<{ size: number; color: string }>> = {
  crown: ({ size, color }) => <Crown size={size} color={color} />,
  pickaxe: ({ size, color }) => <Pickaxe size={size} color={color} />,
  bank: ({ size, color }) => <Landmark size={size} color={color} />,
  flag: ({ size, color }) => <Flag size={size} color={color} />,
  ship: ({ size, color }) => <Ship size={size} color={color} />,
  factory: ({ size, color }) => <Factory size={size} color={color} />,
  zap: ({ size, color }) => <Zap size={size} color={color} />,
  globe: ({ size, color }) => <Globe size={size} color={color} />,
  diamond: ({ size, color }) => <Diamond size={size} color={color} />,
  wheat: ({ size, color }) => <Wheat size={size} color={color} />,
  fuel: ({ size, color }) => <Fuel size={size} color={color} />,
  building: ({ size, color }) => <Building2 size={size} color={color} />,
  boxes: ({ size, color }) => <Boxes size={size} color={color} />,
  network: ({ size, color }) => <Network size={size} color={color} />,
};

export interface SatelliteNode {
  cx: number;
  cy: number;
  label: string;
  icon: NodeIcon;
  edgeLabel?: string;
  lineWeight?: "thin" | "medium" | "thick";
}

export interface NetworkGraphProps {
  centralLabel?: string;
  centralIcon?: NodeIcon;
  nodes?: SatelliteNode[] | null;
  subtitle?: string;
  bgColor?: string;
}

function makeDefaultNodes(w: number, h: number): SatelliteNode[] {
  return [
    { cx: 0.5   * w, cy: 0.198 * h, label: "RESSOURCES", icon: "pickaxe", lineWeight: "thin" },
    { cx: 0.806 * w, cy: 0.328 * h, label: "FINANCES",   icon: "bank",    edgeLabel: "$4.2B", lineWeight: "thick" },
    { cx: 0.806 * w, cy: 0.630 * h, label: "COMMERCE",   icon: "ship",    lineWeight: "thin" },
    { cx: 0.5   * w, cy: 0.75  * h, label: "INDUSTRIE",  icon: "factory", lineWeight: "medium" },
    { cx: 0.148 * w, cy: 0.630 * h, label: "INFLUENCE",  icon: "flag",    lineWeight: "thin" },
    { cx: 0.148 * w, cy: 0.328 * h, label: "MINES",      icon: "pickaxe", edgeLabel: "85M T", lineWeight: "medium" },
  ];
}

const LINE_WIDTHS = { thin: 2, medium: 3.5, thick: 5.5 };
const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212,175,55,0.35)";
const SLATE = "#8e95a5";

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  centralLabel = "EMPIRE\nCONNECTIONS",
  centralIcon = "crown",
  nodes = null,
  subtitle = "réseau de pouvoir",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const resolvedNodes: SatelliteNode[] = nodes ?? makeDefaultNodes(width, height);

  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) / 1080;
  const CR = Math.round(105 * scale);
  const SR = Math.round(68 * scale);

  // Titre entry
  const titleSpring = spring({ frame, fps, config: { damping: 18, stiffness: 80 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(titleSpring, [0, 1], [-30, 0], { extrapolateRight: "clamp" });

  // Noeud central
  const centerSpring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 70 } });
  const centerScale = interpolate(centerSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Lignes draw-in (une par noeud, délai croissant)
  // Noeuds satellites (révélation séquentielle)
  const nodeAnimations = resolvedNodes.map((_, i) => {
    const lineDelay = 18 + i * 12;
    const nodeDelay = lineDelay + 8;
    const lineSpring = spring({ frame: frame - lineDelay, fps, config: { damping: 22, stiffness: 60 } });
    const nodeSpring = spring({ frame: frame - nodeDelay, fps, config: { damping: 16, stiffness: 80 } });
    return {
      lineProg: interpolate(lineSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
      nodeOpacity: interpolate(nodeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
      nodeScale: interpolate(nodeSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
    };
  });

  // Pulse dot animé sur chaque ligne (un dot qui voyage centre → satellite)
  const totalFrames = 180;
  const CentralIcon = ICON_MAP[centralIcon];

  // Footer
  const footerSpring = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 70 } });
  const footerOpacity = interpolate(footerSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(212,175,55,0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Titre — fixe en haut, zone dégagée */}
      <div
        className="absolute left-0 right-0 text-center"
        style={{
          top: 100,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {centralLabel.split("\n").map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 52,
              color: GOLD,
              fontFamily: "Cinzel, serif",
              letterSpacing: "0.18em",
              lineHeight: 1.15,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* SVG — arcs + noeuds */}
      <svg
        className="absolute inset-0"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Flèche arrowhead */}
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill={GOLD} opacity="0.7" />
          </marker>
        </defs>

        {/* Arcs centre → satellites */}
        {resolvedNodes.map((node, i) => {
          const { lineProg } = nodeAnimations[i];
          const lw = LINE_WIDTHS[node.lineWeight ?? "thin"];

          // Vecteur centre → satellite
          const dx = node.cx - cx;
          const dy = node.cy - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          // Points d'entrée/sortie sur les bords des cercles
          const startX = cx + (dx / dist) * CR;
          const startY = cy + (dy / dist) * CR;
          const endX = node.cx - (dx / dist) * SR;
          const endY = node.cy - (dy / dist) * SR;

          // Point courant selon progression (draw-in)
          const curX = startX + (endX - startX) * lineProg;
          const curY = startY + (endY - startY) * lineProg;

          // Midpoint pour edgeLabel
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          // Pulse dot position (cycle continu)
          const cycleLen = 60;
          const pulseFrac = (frame % cycleLen) / cycleLen;
          const pulseX = startX + (endX - startX) * pulseFrac;
          const pulseY = startY + (endY - startY) * pulseFrac;
          const pulseVisible = lineProg > 0.95;

          return (
            <g key={i}>
              {/* Ligne principale */}
              <line
                x1={startX} y1={startY}
                x2={curX} y2={curY}
                stroke={GOLD}
                strokeWidth={lw}
                strokeOpacity={0.55}
                markerEnd={lineProg > 0.98 ? "url(#arrow)" : undefined}
              />

              {/* Pulse dot */}
              {pulseVisible && (
                <circle
                  cx={pulseX} cy={pulseY} r={5}
                  fill="rgba(212,175,55,0.85)"
                />
              )}

              {/* Edge label sur la ligne */}
              {node.edgeLabel && lineProg > 0.6 && (
                <text
                  x={midX + 12} y={midY - 12}
                  fontSize={22}
                  fill={GOLD}
                  fontFamily="'IBM Plex Mono', monospace"
                  opacity={Math.min((lineProg - 0.6) / 0.4, 1)}
                >
                  {node.edgeLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Noeud central */}
        <g transform={`translate(${cx}, ${cy}) scale(${centerScale})`}>
          {/* Glow */}
          <circle cx={0} cy={0} r={CR + 20} fill="rgba(212,175,55,0.08)" />
          <circle cx={0} cy={0} r={CR} fill="#0d1420" stroke={GOLD} strokeWidth={5} />
        </g>

        {/* Noeuds satellites */}
        {resolvedNodes.map((node, i) => {
          const { nodeOpacity, nodeScale } = nodeAnimations[i];
          return (
            <g
              key={i}
              transform={`translate(${node.cx}, ${node.cy}) scale(${nodeScale})`}
              opacity={nodeOpacity}
            >
              <circle cx={0} cy={0} r={SR} fill="#0d1420" stroke={GOLD} strokeWidth={3.5} strokeOpacity={0.8} />
            </g>
          );
        })}
      </svg>

      {/* Icône noeud central — React layer par-dessus SVG */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: cx - CR,
          top: cy - CR,
          width: CR * 2,
          height: CR * 2,
          opacity: centerScale,
          transform: `scale(${centerScale})`,
          transformOrigin: "center",
        }}
      >
        <CentralIcon size={56} color={GOLD} />
      </div>

      {/* Icônes + labels noeuds satellites */}
      {resolvedNodes.map((node, i) => {
        const { nodeOpacity, nodeScale } = nodeAnimations[i];
        const IconComp = ICON_MAP[node.icon];

        // Label : au-dessous si noeud dans moitié haute, au-dessus si moitié basse
        const labelBelow = node.cy < cy;
        const labelTop = labelBelow
          ? node.cy + SR + 14
          : node.cy - SR - 44;

        return (
          <React.Fragment key={i}>
            {/* Icône */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                left: node.cx - SR,
                top: node.cy - SR,
                width: SR * 2,
                height: SR * 2,
                opacity: nodeOpacity,
                transform: `scale(${nodeScale})`,
                transformOrigin: "center",
              }}
            >
              <IconComp size={36} color={GOLD} />
            </div>

            {/* Label */}
            <div
              className="absolute text-center"
              style={{
                left: node.cx - 100,
                top: labelTop,
                width: 200,
                fontSize: 20,
                color: SLATE,
                fontFamily: "'IBM Plex Mono', monospace",
                letterSpacing: "0.12em",
                opacity: nodeOpacity,
                transform: `scale(${nodeScale})`,
                transformOrigin: "center top",
              }}
            >
              {node.label}
            </div>
          </React.Fragment>
        );
      })}

      {/* Footer */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ bottom: 80, gap: 16, opacity: footerOpacity }}
      >
        <div style={{ width: 340, height: 1, backgroundColor: GOLD, opacity: 0.4 }} />
        <div
          className="font-mono text-center tracking-widest uppercase"
          style={{ fontSize: 24, color: SLATE }}
        >
          {subtitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
