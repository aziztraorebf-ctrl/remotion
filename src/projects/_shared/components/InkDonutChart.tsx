import React from "react";
import { spring, interpolate } from "remotion";
import { INK, PARCH, PARCH_DIM } from "../svg-library/palette";

export interface InkDonutSegment {
  value: number;
  color: string;
  label?: string;
}

export interface InkDonutChartProps {
  cx: number;
  cy: number;
  r: number;
  segments: InkDonutSegment[];
  frame: number;
  fps: number;
  /** Frame (locale) à laquelle démarre l'animation de tracé du donut. */
  startFrame?: number;
  /** Damping du spring de tracé (registre "inline" compact = 18, registre "leader" = 20). */
  springDamping?: number;
  /** Mass du spring de tracé. */
  springMass?: number;
  /** Ratio du rayon intérieur (trou central) par rapport à `r`. */
  innerRatio?: number;
  /** Opacité de remplissage des segments. */
  segmentOpacity?: number;
  /** Épaisseur du contour de chaque segment. */
  segmentStrokeWidth?: number;
  /** Couleur de fond derrière le trou central (doit matcher le fond de la scène). */
  backgroundColor?: string;
  /** Marge soustraite au rayon intérieur pour le cercle de fond (évite un liseré visible). */
  backgroundInset?: number;
  /**
   * Style des labels de segment :
   * - "inline" : labels posés juste à l'extérieur de l'arc (registre compact, ProtoDataVizEncre).
   * - "leader" : labels reliés par une ligne fine (leader line), registre plein écran plus aéré.
   * - "none" : pas de label par segment.
   */
  labelStyle?: "inline" | "leader" | "none";
  /** Texte central (2 lignes). Si omis, aucun texte central n'est affiché. */
  centerText?: { line1: string; line2: string };
}

/**
 * Donut chart "encre" animé (spring-based), segments proportionnels à `value`.
 * Unifie InkDonutChart (ProtoDataVizEncre), DonutFull (ProtoDataVizPleinEcran)
 * et DonutScene (ProtoNarratifPlusData).
 */
export const InkDonutChart: React.FC<InkDonutChartProps> = ({
  cx,
  cy,
  r,
  segments,
  frame,
  fps,
  startFrame = 5,
  springDamping = 18,
  springMass = 1.2,
  innerRatio = 0.55,
  segmentOpacity = 0.78,
  segmentStrokeWidth = 2,
  backgroundColor,
  backgroundInset = 2,
  labelStyle = "inline",
  centerText,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const progress = spring({ frame: frame - startFrame, fps, config: { damping: springDamping, mass: springMass } });
  const innerR = r * innerRatio;
  let cumAngle = -Math.PI / 2;

  return (
    <g>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const angle = pct * 2 * Math.PI * progress;
        const startAngle = cumAngle;
        cumAngle += angle;
        const endAngle = cumAngle;

        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const ix1 = cx + innerR * Math.cos(endAngle);
        const iy1 = cy + innerR * Math.sin(endAngle);
        const ix2 = cx + innerR * Math.cos(startAngle);
        const iy2 = cy + innerR * Math.sin(startAngle);
        const largeArc = angle > Math.PI ? 1 : 0;

        const midAngle = (startAngle + endAngle) / 2;
        const isRightHalf = !(midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2);

        return (
          <g key={i}>
            <path
              d={`M ${x1},${y1} A ${r},${r} 0 ${largeArc} 1 ${x2},${y2} L ${ix1},${iy1} A ${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2} Z`}
              fill={seg.color}
              opacity={segmentOpacity}
              stroke={INK}
              strokeWidth={segmentStrokeWidth}
            />

            {labelStyle === "inline" && seg.label && progress > 0.8 && (
              <text
                x={cx + (r + 25) * Math.cos(midAngle)}
                y={cy + (r + 25) * Math.sin(midAngle) + 4}
                textAnchor="middle"
                fill={PARCH}
                fontSize={11}
                fontFamily="Georgia, serif"
              >
                {seg.label} {Math.round(pct * 100)}%
              </text>
            )}

            {labelStyle === "leader" && seg.label && (() => {
              const labelR = r + 40;
              const lx = cx + labelR * Math.cos(midAngle);
              const ly = cy + labelR * Math.sin(midAngle);
              const labelOp = interpolate(frame, [50 + i * 10, 65 + i * 10], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <g opacity={labelOp}>
                  <line
                    x1={cx + (r + 5) * Math.cos(midAngle)}
                    y1={cy + (r + 5) * Math.sin(midAngle)}
                    x2={lx}
                    y2={ly}
                    stroke={PARCH_DIM}
                    strokeWidth={1}
                  />
                  <text
                    x={lx}
                    y={ly - 6}
                    textAnchor={isRightHalf ? "start" : "end"}
                    fill={PARCH}
                    fontSize={20}
                    fontFamily="Georgia, serif"
                    fontWeight="bold"
                  >
                    {Math.round(pct * 100)}%
                  </text>
                  <text
                    x={lx}
                    y={ly + 16}
                    textAnchor={isRightHalf ? "start" : "end"}
                    fill={PARCH_DIM}
                    fontSize={16}
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })()}
          </g>
        );
      })}

      {backgroundColor && <circle cx={cx} cy={cy} r={innerR - backgroundInset} fill={backgroundColor} />}

      {centerText && (
        <>
          <text x={cx} y={cy - 6} textAnchor="middle" fill={PARCH} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
            {centerText.line1}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill={PARCH} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
            {centerText.line2}
          </text>
        </>
      )}
    </g>
  );
};
