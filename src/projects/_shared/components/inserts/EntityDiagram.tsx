/**
 * EntityDiagram V2 — diagramme entites style "dossier d'enquete Souverain"
 *
 * Differenciation vs NYT Visual Investigations :
 *   - Fond papier kraft sombre / bleu nuit dossier (pas noir absolu)
 *   - Grain papier overlay subtil
 *   - Icones plus gros (200px par defaut) + plus presents
 *   - Edges typees par couleur : direct (rouge plein), suspecte (jaune dashed), declare (gris pointille)
 *   - Annotations OSINT autour des nodes (coords, IMO, dates) en mono
 *   - Labels edges avec chip plein
 *   - Tampon "DOSSIER N°XXX" + date signature Souverain
 *   - Bebas Neue pour titres entites, mono uniquement pour annotations techniques
 *
 * Animations :
 *   - Cascade nodes (fade-in + scale spring)
 *   - Annotations apparaissent +6f apres node parent
 *   - Edges drawing apres dernier node
 *   - Tampon + footer fade-in en derniere phase
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type EdgeKind = "direct" | "suspected" | "declared";
export type DiagramBackground = "noir" | "kraft" | "dossier" | "mat";

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  pivot?: boolean;
  /** Annotation OSINT (coords GPS, IMO, date) — mono, sous le label */
  osintMeta?: string;
  /** Sous-titre court (role, fonction) — sans accent visuel particulier */
  subtitle?: string;
}

export interface DiagramEdge {
  from: string;
  to: string;
  arrow?: "to" | "from" | "none" | "both";
  label?: string;
  kind?: EdgeKind;
}

interface EntityDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  parentLabel?: string;
  parentBoxConnects?: string[];
  background?: DiagramBackground;
  accentColor?: string;
  dossierNumber?: string;
  dossierDate?: string;
  source?: string;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
}

const NODE_DELAY = 8;
const EDGE_START_OFFSET = 4;

const BG_COLORS: Record<DiagramBackground, { bg: string; ink: string; muted: string }> = {
  noir: { bg: "#0a0a0a", ink: "#ffffff", muted: "#666" },
  kraft: { bg: "#1f1a14", ink: "#e8d9b8", muted: "#8a7553" },
  dossier: { bg: "#0d1628", ink: "#e6e9f0", muted: "#5a6a82" },
  mat: { bg: "#141414", ink: "#f0e8d8", muted: "#7a7060" },
};

const EDGE_STYLES: Record<EdgeKind, { color: string; dash?: string; width: number; opacity: number }> = {
  direct: { color: "#d24a3c", width: 2.5, opacity: 0.95 },
  suspected: { color: "#e8b840", dash: "8 6", width: 2, opacity: 0.85 },
  declared: { color: "#9aa0a8", dash: "2 5", width: 1.5, opacity: 0.7 },
};

export const EntityDiagram: React.FC<EntityDiagramProps> = ({
  nodes,
  edges,
  parentLabel,
  parentBoxConnects = [],
  background = "dossier",
  accentColor = "#e8b840",
  dossierNumber,
  dossierDate,
  source,
  title,
  subtitle,
  width = 1080,
  height = 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = BG_COLORS[background];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  const nodeProgress = (i: number) =>
    spring({
      frame: frame - i * NODE_DELAY,
      fps,
      config: { damping: 18, stiffness: 120 },
      durationInFrames: 25,
    });

  const annotationProgress = (i: number) =>
    spring({
      frame: frame - i * NODE_DELAY - 8,
      fps,
      config: { damping: 100, stiffness: 80 },
      durationInFrames: 20,
    });

  const edgesStart = nodes.length * NODE_DELAY + EDGE_START_OFFSET;

  const edgeProgress = (i: number) =>
    spring({
      frame: frame - edgesStart - i * 6,
      fps,
      config: { damping: 100, stiffness: 60 },
      durationInFrames: 30,
    });

  // Tampon "DOSSIER" en haut — apparait en premier
  const stampProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
    durationInFrames: 20,
  });

  // Footer (source) — apparait apres edges
  const footerProgress = spring({
    frame: frame - edgesStart - 18,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 22,
  });

  // Parent box centered above connected nodes
  let parentBox: { x: number; y: number; w: number; h: number } | null = null;
  if (parentLabel && parentBoxConnects.length > 0) {
    const connected = parentBoxConnects
      .map((id) => nodeMap.get(id))
      .filter(Boolean) as DiagramNode[];
    if (connected.length > 0) {
      const xs = connected.map((n) => n.x);
      const ys = connected.map((n) => n.y);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const minY = Math.min(...ys);
      const labelLen = parentLabel.length;
      const w = Math.max(360, labelLen * 22);
      const h = 86;
      parentBox = { x: cx - w / 2, y: minY - 420, w, h };
    }
  }

  const parentBoxProgress = spring({
    frame: frame - edgesStart - 14,
    fps,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 25,
  });

  // Grain noise texture (deterministe)
  const grain = React.useMemo(() => {
    const result: { x: number; y: number; op: number }[] = [];
    let seed = 421;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    for (let i = 0; i < 600; i++) {
      result.push({
        x: rand() * width,
        y: rand() * height,
        op: rand() * 0.04 + 0.01,
      });
    }
    return result;
  }, [width, height]);

  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Grain papier */}
        <g opacity="0.6">
          {grain.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r="1" fill={palette.ink} opacity={g.op} />
          ))}
        </g>

        {/* Coin replie haut-gauche (signature) */}
        <g opacity={stampProgress * 0.5}>
          <line x1="40" y1="40" x2="180" y2="40" stroke={palette.muted} strokeWidth="1" />
          <line x1="40" y1="40" x2="40" y2="180" stroke={palette.muted} strokeWidth="1" />
        </g>

        {/* Tampon DOSSIER */}
        {dossierNumber && (
          <g opacity={stampProgress} transform={`translate(80 110) rotate(-3)`}>
            <rect
              x="0"
              y="0"
              width="280"
              height="62"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
            <rect
              x="0"
              y="0"
              width="280"
              height="62"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.5"
              transform="translate(4 4)"
              opacity="0.5"
            />
            <text
              x="140"
              y="40"
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize="22"
              fontWeight="700"
              fill={accentColor}
              letterSpacing="3"
            >
              DOSSIER {dossierNumber}
            </text>
          </g>
        )}

        {/* Date signature haut-droit */}
        {dossierDate && (
          <g opacity={stampProgress * 0.85}>
            <text
              x={width - 60}
              y="100"
              textAnchor="end"
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize="18"
              fill={palette.muted}
              letterSpacing="2"
            >
              {dossierDate}
            </text>
            <line
              x1={width - 200}
              y1="115"
              x2={width - 60}
              y2="115"
              stroke={palette.muted}
              strokeWidth="1"
              opacity="0.5"
            />
          </g>
        )}

        {/* Title block */}
        {title && (
          <g opacity={stampProgress}>
            <text
              x={width / 2}
              y={400}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize="64"
              fontWeight="700"
              fill={palette.ink}
              letterSpacing="6"
            >
              {title.toUpperCase()}
            </text>
            {subtitle && (
              <text
                x={width / 2}
                y={460}
                textAnchor="middle"
                fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                fontSize="20"
                fill={palette.muted}
                letterSpacing="4"
              >
                {subtitle.toUpperCase()}
              </text>
            )}
            <line
              x1={width / 2 - 80}
              y1={subtitle ? 490 : 430}
              x2={width / 2 + 80}
              y2={subtitle ? 490 : 430}
              stroke={accentColor}
              strokeWidth="2"
              opacity="0.7"
            />
          </g>
        )}

        {/* Parent box */}
        {parentBox && (
          <g opacity={parentBoxProgress}>
            <rect
              x={parentBox.x}
              y={parentBox.y}
              width={parentBox.w}
              height={parentBox.h}
              fill={palette.bg}
              stroke={palette.ink}
              strokeWidth="2"
              opacity="1"
            />
            {/* Petit label "ENTITE PARENTE" */}
            <text
              x={parentBox.x + parentBox.w / 2}
              y={parentBox.y + 22}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize="13"
              fill={palette.muted}
              letterSpacing="3"
            >
              ENTITE PARENTE
            </text>
            <text
              x={parentBox.x + parentBox.w / 2}
              y={parentBox.y + parentBox.h / 2 + 18}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize="34"
              fontWeight="700"
              fill={palette.ink}
              letterSpacing="3"
            >
              {parentLabel}
            </text>
          </g>
        )}

        {/* Edges parent box -> connected nodes */}
        {parentBox &&
          parentBoxConnects.map((id) => {
            const n = nodeMap.get(id);
            if (!n) return null;
            const startX = parentBox!.x + parentBox!.w / 2;
            const startY = parentBox!.y + parentBox!.h;
            const midY = (startY + n.y - 110) / 2;
            const path = `M ${startX} ${startY} L ${startX} ${midY} L ${n.x} ${midY} L ${n.x} ${n.y - 110}`;
            return (
              <path
                key={`pe-${id}`}
                d={path}
                fill="none"
                stroke={palette.muted}
                strokeWidth="1.2"
                strokeDasharray="3 4"
                opacity={parentBoxProgress * 0.7}
              />
            );
          })}

        {/* Edges between nodes */}
        {edges.map((e, i) => {
          const a = nodeMap.get(e.from);
          const b = nodeMap.get(e.to);
          if (!a || !b) return null;
          const prog = edgeProgress(i);
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const inset = 105;
          const ux = dx / dist;
          const uy = dy / dist;
          const x1 = a.x + ux * inset;
          const y1 = a.y + uy * inset;
          const x2 = b.x - ux * inset;
          const y2 = b.y - uy * inset;
          const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

          const kind = e.kind || "direct";
          const style = EDGE_STYLES[kind];

          const arrowSize = 18;
          const ang = Math.atan2(y2 - y1, x2 - x1);
          const aTo = {
            x: x2,
            y: y2,
            ax1: x2 - arrowSize * Math.cos(ang - Math.PI / 7),
            ay1: y2 - arrowSize * Math.sin(ang - Math.PI / 7),
            ax2: x2 - arrowSize * Math.cos(ang + Math.PI / 7),
            ay2: y2 - arrowSize * Math.sin(ang + Math.PI / 7),
          };
          const aFrom = {
            x: x1,
            y: y1,
            ax1: x1 + arrowSize * Math.cos(ang - Math.PI / 7),
            ay1: y1 + arrowSize * Math.sin(ang - Math.PI / 7),
            ax2: x1 + arrowSize * Math.cos(ang + Math.PI / 7),
            ay2: y1 + arrowSize * Math.sin(ang + Math.PI / 7),
          };

          const showToArrow = e.arrow === "to" || e.arrow === undefined || e.arrow === "both";
          const showFromArrow = e.arrow === "from" || e.arrow === "both";

          // Label chip
          const labelMidX = (x1 + x2) / 2;
          const labelMidY = (y1 + y2) / 2;
          const labelW = e.label ? Math.max(100, e.label.length * 11) : 0;

          return (
            <g key={`e-${i}`} opacity={prog}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={style.color}
                strokeWidth={style.width}
                strokeOpacity={style.opacity}
                strokeDasharray={style.dash || len}
                strokeDashoffset={style.dash ? 0 : interpolate(prog, [0, 1], [len, 0])}
              />
              {showToArrow && (
                <polyline
                  points={`${aTo.ax1},${aTo.ay1} ${aTo.x},${aTo.y} ${aTo.ax2},${aTo.ay2}`}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={style.width}
                  strokeOpacity={style.opacity}
                />
              )}
              {showFromArrow && (
                <polyline
                  points={`${aFrom.ax1},${aFrom.ay1} ${aFrom.x},${aFrom.y} ${aFrom.ax2},${aFrom.ay2}`}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={style.width}
                  strokeOpacity={style.opacity}
                />
              )}
              {e.label && (
                <g>
                  <rect
                    x={labelMidX - labelW / 2}
                    y={labelMidY - 22}
                    width={labelW}
                    height="32"
                    fill={palette.bg}
                    stroke={style.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={labelMidX}
                    y={labelMidY - 1}
                    textAnchor="middle"
                    fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                    fontSize="15"
                    fill={style.color}
                    letterSpacing="1.5"
                    fontWeight="600"
                  >
                    {e.label.toUpperCase()}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const t = nodeProgress(i);
          const a = annotationProgress(i);
          const scale = interpolate(t, [0, 1], [0.4, 1]);
          const op = t;
          const iconSize = 200;
          return (
            <g key={n.id}>
              <g
                transform={`translate(${n.x} ${n.y}) scale(${scale})`}
                opacity={op}
              >
                {/* Icon — 200x200 par defaut */}
                <g transform={`translate(${-iconSize / 2} ${-iconSize / 2})`}>
                  {n.icon ? (
                    n.icon
                  ) : (
                    <rect
                      x="0"
                      y="0"
                      width={iconSize}
                      height={iconSize}
                      fill={n.color || "#888"}
                      opacity="0.9"
                    />
                  )}
                </g>
                {/* Halo subtil pour pivot */}
                {n.pivot && (
                  <circle
                    cx="0"
                    cy="0"
                    r={iconSize / 2 + 14}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                    opacity="0.6"
                  />
                )}
              </g>

              {/* Label entite — Bebas Neue */}
              <g opacity={a}>
                <text
                  x={n.x}
                  y={n.y + 150}
                  textAnchor="middle"
                  fontFamily="'Bebas Neue', 'Impact', sans-serif"
                  fontSize="32"
                  fontWeight={n.pivot ? 700 : 600}
                  fill={n.pivot ? accentColor : palette.ink}
                  letterSpacing="3"
                >
                  {n.label}
                </text>

                {/* Subtitle court */}
                {n.subtitle && (
                  <text
                    x={n.x}
                    y={n.y + 180}
                    textAnchor="middle"
                    fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                    fontSize="15"
                    fill={palette.muted}
                    letterSpacing="2"
                  >
                    {n.subtitle.toUpperCase()}
                  </text>
                )}

                {/* Annotation OSINT — mono, ton mute */}
                {n.osintMeta && (
                  <g>
                    <line
                      x1={n.x - 80}
                      y1={n.y + 200}
                      x2={n.x + 80}
                      y2={n.y + 200}
                      stroke={palette.muted}
                      strokeWidth="0.8"
                      opacity="0.5"
                    />
                    <text
                      x={n.x}
                      y={n.y + 220}
                      textAnchor="middle"
                      fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                      fontSize="13"
                      fill={palette.muted}
                      letterSpacing="1.5"
                    >
                      {n.osintMeta}
                    </text>
                  </g>
                )}
              </g>
            </g>
          );
        })}

        {/* Footer source */}
        {source && (
          <g opacity={footerProgress}>
            <line
              x1="80"
              y1={height - 90}
              x2={width - 80}
              y2={height - 90}
              stroke={palette.muted}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <text
              x="80"
              y={height - 60}
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize="14"
              fill={palette.muted}
              letterSpacing="2"
            >
              SOURCE : {source.toUpperCase()}
            </text>
          </g>
        )}

        {/* Coin replie bas-droit (signature) */}
        <g opacity={stampProgress * 0.5}>
          <line x1={width - 180} y1={height - 40} x2={width - 40} y2={height - 40} stroke={palette.muted} strokeWidth="1" />
          <line x1={width - 40} y1={height - 180} x2={width - 40} y2={height - 40} stroke={palette.muted} strokeWidth="1" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// =============================================================================
// ICONES — silhouettes plus appuyees, taille 200x200
// =============================================================================

export const ShipIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => {
  const h = w * 0.55;
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={{ display: "block", margin: "auto" }} preserveAspectRatio="xMidYMid meet">
      <g fill={color}>
        <path d="M 8 38 L 18 50 L 100 50 L 112 38 Z" />
        <rect x="20" y="28" width="60" height="10" />
        <rect x="62" y="14" width="22" height="14" />
        <rect x="84" y="20" width="6" height="8" />
        <rect x="22" y="20" width="8" height="8" opacity="0.6" />
        <rect x="32" y="20" width="8" height="8" opacity="0.7" />
        <rect x="42" y="20" width="8" height="8" opacity="0.55" />
        <rect x="52" y="20" width="8" height="8" opacity="0.65" />
      </g>
    </svg>
  );
};

export const FactoryIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => (
  <svg width={w} height={w} viewBox="0 0 120 120">
    <g fill={color}>
      {/* Toit / cheminees */}
      <rect x="20" y="40" width="14" height="50" />
      <rect x="22" y="20" width="10" height="22" />
      <rect x="40" y="50" width="60" height="40" />
      {/* Toit dents-de-scie */}
      <polygon points="40,50 50,40 60,50 70,40 80,50 90,40 100,50" />
      {/* Fenetres */}
      <rect x="46" y="58" width="8" height="10" fill={color} opacity="0.4" />
      <rect x="58" y="58" width="8" height="10" fill={color} opacity="0.4" />
      <rect x="70" y="58" width="8" height="10" fill={color} opacity="0.4" />
      <rect x="82" y="58" width="8" height="10" fill={color} opacity="0.4" />
      {/* Sol */}
      <rect x="14" y="90" width="92" height="6" />
    </g>
  </svg>
);

export const CrownIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => (
  <svg width={w} height={w} viewBox="0 0 120 120">
    <g fill={color}>
      <polygon points="20,80 30,40 50,60 60,30 70,60 90,40 100,80" />
      <rect x="20" y="80" width="80" height="14" />
      <circle cx="30" cy="40" r="5" opacity="0.7" />
      <circle cx="60" cy="30" r="5" opacity="0.7" />
      <circle cx="90" cy="40" r="5" opacity="0.7" />
    </g>
  </svg>
);

export const FlagIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => (
  <svg width={w} height={w} viewBox="0 0 120 120">
    <g fill={color}>
      <rect x="28" y="22" width="4" height="80" />
      <path d="M 32 22 L 92 22 L 80 38 L 92 54 L 32 54 Z" />
    </g>
  </svg>
);

export const BankIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => (
  <svg width={w} height={w} viewBox="0 0 120 120">
    <g fill={color}>
      <polygon points="60,20 100,42 20,42" />
      <rect x="20" y="42" width="80" height="6" />
      <rect x="28" y="50" width="8" height="40" />
      <rect x="44" y="50" width="8" height="40" />
      <rect x="60" y="50" width="8" height="40" />
      <rect x="76" y="50" width="8" height="40" />
      <rect x="92" y="50" width="8" height="40" opacity="0.85" />
      <rect x="20" y="92" width="80" height="8" />
    </g>
  </svg>
);

export const PersonIcon: React.FC<{ color?: string; w?: number }> = ({
  color = "#888",
  w = 200,
}) => (
  <svg width={w} height={w} viewBox="0 0 120 120">
    <g fill={color}>
      <circle cx="60" cy="40" r="20" />
      <path d="M 22 110 L 22 90 Q 22 64 60 64 Q 98 64 98 90 L 98 110 Z" />
    </g>
  </svg>
);
