/**
 * SmallMultiplesGrid — insert data-viz inspire The Pudding
 *
 * Reference visuelle validee Aziz 2026-05-09 :
 *   portrait B&W carre + label gauche + chart line + annotation inline
 *   pop-in sequentiel ligne par ligne + chart trace progressif
 *
 * V2 : layout 4 colonnes divs (pas SVG pour annotations),
 *      3 items max, dates en div flex sous le grid,
 *      2 variantes background (cream / kraft)
 */

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export type SmallMultiplesVariant = "cream" | "kraft";

export const SMALL_MULTIPLES_PALETTE: Record<SmallMultiplesVariant, {
  background: string;
  bgImage: string | null;
  chartLine: string;
  axisLine: string;
  label: string;
  annotation: string;
  divider: string;
  /** Couleur du point d'ancrage (anchor visuel mobile readability) */
  highlight: string;
  /** Couleur de la micro-source institutionnelle */
  source: string;
}> = {
  cream: {
    background: "#f3eee5",
    bgImage: null,
    chartLine: "#3d2a52",
    axisLine: "#9a8f7a",
    label: "#1a1a1a",
    annotation: "#2a2a2a",
    divider: "rgba(90,80,60,0.12)",
    highlight: "#c8963c",
    source: "rgba(50,40,30,0.55)",
  },
  kraft: {
    background: "#d4b896",
    bgImage: "_shared/textures/bg-kraft-affirme.png",
    chartLine: "#1a0a2e",
    axisLine: "#7a6040",
    label: "#0d0905",
    annotation: "#1a0a0a",
    divider: "rgba(60,40,10,0.2)",
    highlight: "#8a3a14",
    source: "rgba(40,20,5,0.55)",
  },
};

export type SmallMultipleItem = {
  entity: string;
  image: string;
  data: number[];
  annotation?: string;
  annotationX?: number;
  /** Index dans data[] du point cle (point dore). Si non fourni, max value. */
  highlightIndex?: number;
  /** Source institutionnelle micro affichee sous chaque ligne (regle Souverain) */
  source?: string;
};

type Props = {
  items: SmallMultipleItem[];
  xLabels?: string[];
  variant?: SmallMultiplesVariant;
  rowDelayFrames?: number;
  drawDurationFrames?: number;
};

const buildPath = (data: number[], w: number, h: number): string => {
  if (data.length < 2) return "";
  const stepX = w / (data.length - 1);
  return data
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)},${(h - v * h).toFixed(1)}`)
    .join(" ");
};

const approxLen = (data: number[], w: number, h: number): number => {
  if (data.length < 2) return 0;
  const stepX = w / (data.length - 1);
  let len = 0;
  for (let i = 1; i < data.length; i++) {
    const dx = stepX;
    const dy = (data[i] - data[i - 1]) * h;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
};

export const SmallMultiplesGrid: React.FC<Props> = ({
  items,
  xLabels,
  variant = "cream",
  rowDelayFrames = 14,
  drawDurationFrames = 35,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const palette = SMALL_MULTIPLES_PALETTE[variant];

  const count = Math.min(items.length, 3);
  const paddingTop = 120;
  const paddingBottom = 100;
  const xLabelsH = xLabels ? 48 : 0;
  const gridH = height - paddingTop - paddingBottom - xLabelsH;
  const rowH = gridH / count;

  // Layout : label | avatar | courbe | annotation (4 colonnes fixes)
  const avatarSize = Math.round(Math.min(rowH * 0.44, width * 0.11));
  const colLabel = Math.round(width * 0.25);
  const colAvatar = avatarSize + 12;
  const colAnnotation = Math.round(width * 0.22);
  const paddingH = 32;
  const curveW = width - paddingH * 2 - colLabel - colAvatar - colAnnotation;
  const chartW = curveW;
  const chartH = rowH - 36;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, overflow: "hidden" }}>
      {/* Background texture */}
      {palette.bgImage && (
        <Img
          src={staticFile(palette.bgImage)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            opacity: 0.9,
          }}
        />
      )}

      {/* Grid rows */}
      {items.slice(0, count).map((item, i) => {
        const rowY = paddingTop + i * rowH;
        const startFrame = i * rowDelayFrames;

        const rowOpacity = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 20, stiffness: 90 },
          durationInFrames: 22,
        });

        const drawProgress = interpolate(
          frame - startFrame - 6,
          [0, drawDurationFrames],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const annotOpacity = interpolate(
          frame - startFrame - drawDurationFrames,
          [0, 14],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        const pathStr = buildPath(item.data, curveW, chartH);
        const pathLen = approxLen(item.data, curveW, chartH);

        // Point dore sur la valeur cle (max par defaut)
        const highlightIdx = item.highlightIndex ?? item.data.indexOf(Math.max(...item.data));
        const stepX = curveW / (item.data.length - 1);
        const highlightX = highlightIdx * stepX;
        const highlightY = chartH - item.data[highlightIdx] * chartH;
        const dotOpacity = interpolate(
          frame - startFrame - drawDurationFrames + 4,
          [0, 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              top: rowY,
              width,
              height: rowH,
              opacity: rowOpacity,
              display: "flex",
              alignItems: "center",
              paddingLeft: paddingH,
              paddingRight: paddingH,
              boxSizing: "border-box",
              borderBottom: i < count - 1 ? `1px solid ${palette.divider}` : "none",
            }}
          >
            {/* Label + source empiles, alignes verticalement avec le centre du portrait */}
            <div
              style={{
                width: colLabel,
                flexShrink: 0,
                paddingRight: 8,
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: Math.round(rowH * 0.105),
                  color: palette.label,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  letterSpacing: 0.3,
                  lineHeight: 1.1,
                }}
              >
                {item.entity}
              </div>
              {item.source && (
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "Georgia, serif",
                    fontSize: Math.round(rowH * 0.052),
                    color: palette.source,
                    fontStyle: "italic",
                    letterSpacing: 0.2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    opacity: annotOpacity,
                  }}
                >
                  {item.source}
                </div>
              )}
            </div>

            {/* Avatar — centre vertical par defaut via flex */}
            <div style={{ width: colAvatar, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Img
                src={item.image}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  objectFit: "cover",
                  filter: "grayscale(1) contrast(1.08)",
                  border: `1px solid ${palette.axisLine}`,
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Courbe SVG — stroke +1.5px (3.5 au lieu de 2.2) + point dore */}
            <div style={{ width: curveW, flexShrink: 0, overflow: "visible" }}>
              <svg width={curveW} height={chartH} style={{ display: "block", overflow: "visible" }}>
                <line x1={0} y1={chartH - 1} x2={curveW} y2={chartH - 1} stroke={palette.axisLine} strokeWidth={0.8} />
                <path
                  d={pathStr}
                  stroke={palette.chartLine}
                  strokeWidth={3.5}
                  fill="none"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen * (1 - drawProgress)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Point dore d'ancrage sur le highlight */}
                <g opacity={dotOpacity}>
                  <circle cx={highlightX} cy={highlightY} r={9} fill={palette.background} />
                  <circle cx={highlightX} cy={highlightY} r={7} fill={palette.highlight} />
                  <circle cx={highlightX} cy={highlightY} r={3.5} fill={palette.background} />
                </g>
              </svg>
            </div>

            {/* Annotation — top-right standardisee, ancree sur le highlight */}
            {item.annotation && (
              <div
                style={{
                  width: colAnnotation,
                  flexShrink: 0,
                  paddingLeft: 18,
                  paddingRight: 8,
                  boxSizing: "border-box",
                  opacity: annotOpacity,
                  fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                  fontSize: Math.round(rowH * 0.095),
                  color: palette.annotation,
                  lineHeight: 1.35,
                  overflow: "hidden",
                  wordBreak: "break-word",
                  // top-right : pousser vers le haut de la cellule
                  alignSelf: "flex-start",
                  marginTop: Math.round(rowH * 0.18),
                }}
              >
                {item.annotation}
              </div>
            )}
          </div>
        );
      })}

      {/* X Labels sous le grid — alignes sur le debut du chart */}
      {xLabels && (
        <div
          style={{
            position: "absolute",
            left: paddingH + colLabel + colAvatar,
            top: paddingTop + gridH + 8,
            width: curveW - 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {xLabels.map((lbl, k) => (
            <span
              key={k}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 22,
                color: palette.label,
                opacity: 0.65,
                textAlign: k === 0 ? "left" : k === xLabels.length - 1 ? "right" : "center",
              }}
            >
              {lbl}
            </span>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
