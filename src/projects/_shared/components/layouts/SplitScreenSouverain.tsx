import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { fadeIn, gentleReveal } from "../../animations";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SplitItem {
  /** Texte affiché */
  text: string;
  /** Frame d'apparition */
  startAt: number;
  /** Taille px — défaut 80 */
  fontSize?: number;
  /** Couleur — défaut ivory */
  color?: string;
  /** Police — "bebas" | "mono" — défaut "bebas" */
  font?: "bebas" | "mono";
  /** true = séparateur gold AVANT cet item */
  separator?: boolean;
}

export interface SplitColumnProps {
  /** Image ou SVG pleine largeur en haut de la colonne */
  asset: React.ReactNode;
  /** Frame d'apparition de l'asset */
  assetStartAt?: number;
  /** Liste des textes sous l'asset */
  items: SplitItem[];
  /** Padding horizontal interne */
  px?: number;
}

export interface SplitScreenSouverainProps {
  left: SplitColumnProps;
  right: SplitColumnProps;
  /** Sous-titre bas de page */
  subtitle?: string;
  /** Frame d'apparition du sous-titre */
  subtitleStartAt?: number;
  /** Afficher séparateur vertical central — défaut true */
  showDivider?: boolean;
}

// ─── Fonts ────────────────────────────────────────────────────────────────────

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', Impact, sans-serif" };
const MONO: React.CSSProperties  = { fontFamily: "'IBM Plex Mono', monospace" };

// ─── Composant colonne ────────────────────────────────────────────────────────

const Column: React.FC<SplitColumnProps & { frame: number; slideFrom?: "left" | "right" }> = ({
  asset,
  assetStartAt = 0,
  items,
  px = 30,
  frame,
  slideFrom,
}) => {
  const assetOp = fadeIn(frame, assetStartAt, 20);

  const panelSlide = slideFrom
    ? gentleReveal(frame, assetStartAt, 30)
    : 1;
  const panelX = slideFrom === "right"
    ? interpolate(panelSlide, [0, 1], [120, 0], { extrapolateRight: "clamp" })
    : slideFrom === "left"
    ? interpolate(panelSlide, [0, 1], [-120, 0], { extrapolateRight: "clamp" })
    : 0;
  const panelOp = slideFrom
    ? interpolate(panelSlide, [0, 0.3], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      className="w-1/2 flex flex-col pt-[288px] pb-[200px]"
      style={{ paddingLeft: px, paddingRight: px, opacity: panelOp, transform: `translateX(${panelX}px)` }}
    >
      {/* Asset en haut */}
      <div className="w-full flex-shrink-0" style={{ opacity: assetOp }}>
        {asset}
      </div>

      {/* Textes — flex-1, s'adaptent à l'espace restant */}
      <div className="flex-1 flex flex-col justify-around pt-4">
        {items.map((item, i) => {
          const itemOp = fadeIn(frame, item.startAt, 20);
          const font = item.font === "mono" ? MONO : BEBAS;
          const color = item.color ?? "#f0e8d8";

          return (
            <React.Fragment key={i}>
              {item.separator && (
                <div className="h-[3px] w-full bg-gold/80" style={{ opacity: itemOp }} />
              )}
              <div
                style={{
                  ...font,
                  fontSize: item.fontSize ?? 80,
                  color,
                  opacity: itemOp,
                  lineHeight: 1.1,
                  letterSpacing: item.font === "mono" ? "0.05em" : "0.03em",
                  whiteSpace: "nowrap",
                }}
              >
                {item.text}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ─── Composant principal ──────────────────────────────────────────────────────

export const SplitScreenSouverain: React.FC<SplitScreenSouverainProps> = ({
  left,
  right,
  subtitle,
  subtitleStartAt = 0,
  showDivider = true,
}) => {
  const frame = useCurrentFrame();

  const grainX = Math.sin(frame * 0.025) * 4;
  const grainY = Math.cos(frame * 0.022) * 3;
  const subOp  = subtitle ? fadeIn(frame, subtitleStartAt, 10) : 0;

  return (
    <AbsoluteFill className="bg-navy overflow-hidden flex flex-row">

      {/* Background dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(96,128,192,0.38) 1.5px, transparent 2px)",
          backgroundSize: "32px 32px",
          transform: `translate(${grainX}px, ${grainY}px)`,
        }}
      />

      {/* Séparateur vertical */}
      {showDivider && (
        <svg width={1080} height={1920} className="absolute inset-0 pointer-events-none">
          <line
            x1={540} y1={288} x2={540} y2={1680}
            stroke="#c8a951" strokeWidth={3}
            opacity={0.7 + 0.1 * Math.sin(frame * 0.03)}
            strokeDasharray="6 6"
          />
        </svg>
      )}

      <Column {...left} frame={frame} px={left.px ?? 30} />
      <Column {...right} frame={frame} slideFrom="right" px={right.px ?? 30} />

      {/* Sous-titre */}
      {subtitle && subOp > 0 && (
        <div
          className="absolute left-0 right-0 flex items-center justify-center px-[60px]"
          style={{ bottom: 60, opacity: subOp }}
        >
          <div
            className="text-center"
            style={{
              ...MONO,
              fontSize: 36,
              color: "#f0e8d8",
              lineHeight: 1.4,
              background: "rgba(8,13,20,0.75)",
              padding: "16px 32px",
              borderRadius: 8,
            }}
          >
            {subtitle}
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
};
