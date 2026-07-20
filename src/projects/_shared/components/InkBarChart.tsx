import React from "react";
import { spring, interpolate } from "remotion";
import { INK, PARCH, PARCH_DIM } from "../svg-library/palette";

export interface InkBarDatum {
  label: string;
  value: number;
  color: string;
}

export interface InkBarChartProps {
  x: number;
  y: number;
  w: number;
  h: number;
  data: InkBarDatum[];
  frame: number;
  fps: number;
  /** Titre au-dessus du graphe (omis si non fourni). */
  title?: string;
  /** Valeur max de l'axe (utilisée pour la hauteur des barres). Si omise, calculée à partir du plus grand `value`. */
  maxValue?: number;
  /** Nombre de graduations (ticks) sur l'axe Y, espacées régulièrement entre 0 et maxValue. */
  tickCount?: number;
  /** Formatteur de la valeur de graduation affichée. */
  formatTick?: (value: number) => string;
  /**
   * Multiplicateur appliqué uniquement à la valeur affichée dans le label de graduation
   * (n'affecte pas la hauteur réelle des barres). Permet de reproduire un axe dont les
   * données sont normalisées (0-1) mais dont l'échelle affichée représente une unité réelle
   * (ex: millions de tonnes). Défaut 1 (pas de conversion).
   */
  tickLabelScale?: number;
  /** Affiche la valeur numérique au-dessus de chaque barre une fois animée. */
  showValueLabels?: boolean;
  /** Formatteur de la valeur affichée au-dessus de chaque barre. */
  formatValue?: (value: number) => string;
  /** Frame de départ de l'animation de la première barre (les suivantes sont décalées). */
  startFrame?: number;
  /** Décalage (frames) entre le début d'animation de chaque barre. */
  staggerFrames?: number;
  /**
   * Marge verticale entre `h` et la hauteur réelle utilisée pour les barres
   * (`chartH = h - chartVerticalMargin`), laissant une respiration entre le sommet du
   * cadre et le haut de la barre la plus haute. Défaut 70 (registre compact "encre").
   * Le registre "plein écran" (pas de respiration, tick max touche le sommet) passe 0.
   */
  chartVerticalMargin?: number;
  /**
   * Distance entre `y` et le haut de la zone de graduations/axes (`chartTop = y + topPadding`).
   * Défaut 20 (registre compact "encre" sans titre). Avec `title` fourni, le composant
   * réserve automatiquement 50 sauf si `topPadding` est explicitement passé.
   * Le registre "plein écran" (titre dessiné hors composant) passe 0.
   */
  topPadding?: number;
}

/**
 * Bar chart "encre" animé (spring-based), style carnet/parchemin.
 * Unifie InkBarChart (ProtoDataVizEncre) et BarChartFull (ProtoDataVizPleinEcran).
 */
export const InkBarChart: React.FC<InkBarChartProps> = ({
  x,
  y,
  w,
  h,
  data,
  frame,
  fps,
  title,
  maxValue,
  tickCount = 4,
  formatTick = (v) => v.toFixed(1),
  tickLabelScale = 1,
  showValueLabels = false,
  formatValue = (v) => v.toFixed(2),
  startFrame = 15,
  staggerFrames = 8,
  chartVerticalMargin = 70,
  topPadding,
}) => {
  const resolvedMax = maxValue ?? Math.max(...data.map((d) => d.value));
  const barCount = data.length;
  const gap = 16;
  const barW = (w - gap * (barCount + 1)) / barCount;
  const resolvedTopPadding = topPadding ?? (title ? 50 : 20);
  const chartTop = y + resolvedTopPadding;
  const chartH = h - chartVerticalMargin;

  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (i / tickCount) * resolvedMax);

  return (
    <g>
      <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={PARCH_DIM} strokeWidth={2} strokeDasharray="6 4" />
      <line x1={x} y1={chartTop} x2={x} y2={y + h} stroke={PARCH_DIM} strokeWidth={2} strokeDasharray="6 4" />

      {title && (
        <text
          x={x + w / 2}
          y={y + 20}
          textAnchor="middle"
          fill={PARCH}
          fontSize={22}
          fontFamily="Georgia, serif"
          fontStyle="italic"
          letterSpacing={2}
        >
          {title}
        </text>
      )}

      {ticks.slice(1).map((tick) => {
        const ty = y + h - (tick / resolvedMax) * chartH;
        return (
          <g key={tick}>
            <line x1={x} y1={ty} x2={x + w} y2={ty} stroke={PARCH_DIM} strokeWidth={0.5} opacity={0.3} />
            <text x={x - 8} y={ty + 4} textAnchor="end" fill={PARCH_DIM} fontSize={11} fontFamily="Georgia, serif">
              {formatTick(tick * tickLabelScale)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const barProgress = spring({
          frame: frame - startFrame - i * staggerFrames,
          fps,
          config: { damping: 12, mass: 0.8 },
        });
        const barH = barProgress * (d.value / resolvedMax) * chartH;
        const bx = x + gap + i * (barW + gap);
        const by = y + h - barH;

        const valueOp = showValueLabels
          ? interpolate(frame, [startFrame + 25 + i * staggerFrames, startFrame + 40 + i * staggerFrames], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <g key={i}>
            <rect x={bx} y={by} width={barW} height={barH} rx={4} fill={d.color} opacity={0.75} stroke={INK} strokeWidth={2} />
            {barH > 20 &&
              Array.from({ length: Math.floor(barH / 12) }, (_, j) => (
                <line
                  key={j}
                  x1={bx + 4}
                  y1={by + 8 + j * 12}
                  x2={bx + barW - 4}
                  y2={by + 8 + j * 12}
                  stroke={INK}
                  strokeWidth={0.5}
                  opacity={0.15}
                />
              ))}
            <text x={bx + barW / 2} y={y + h + 18} textAnchor="middle" fill={PARCH} fontSize={13} fontFamily="Georgia, serif">
              {d.label}
            </text>
            {showValueLabels && (
              <text
                x={bx + barW / 2}
                y={by - 14}
                textAnchor="middle"
                fill={PARCH}
                fontSize={20}
                fontFamily="Georgia, serif"
                fontWeight="bold"
                opacity={valueOp}
              >
                {formatValue(d.value)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};
