import React from "react";
import { GRID_COLOR } from "../svg-library/palette";

/**
 * Grille de fond "carnet quadrillé" pour scènes data-viz encre/parchemin.
 * A insérer comme premier enfant d'un <svg viewBox="0 0 W H"> (pas de wrapper propre,
 * pur <g> SVG — cohérent avec l'usage original dans ProtoDataVizPleinEcran /
 * ProtoNarratifPlusData).
 *
 * Deux pas : un pas fin peu visible (`stepSmall`) et un pas large plus marqué
 * (`stepLarge`), pour un rendu "papier millimétré" plutôt qu'une grille uniforme.
 */
export interface GridBackgroundProps {
  /** Largeur totale à couvrir (doit correspondre au viewBox du <svg> parent). */
  width?: number;
  /** Hauteur totale à couvrir (doit correspondre au viewBox du <svg> parent). */
  height?: number;
  /** Pas des lignes fines. */
  stepSmall?: number;
  /** Pas des lignes marquées (doit être un multiple de stepSmall pour l'alignement). */
  stepLarge?: number;
  /** Couleur des lignes de grille. */
  color?: string;
  /** Opacité des lignes fines. */
  opacitySmall?: number;
  /** Opacité des lignes marquées. */
  opacityLarge?: number;
  /** Épaisseur des lignes fines. */
  strokeWidthSmall?: number;
  /** Épaisseur des lignes marquées. */
  strokeWidthLarge?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  width = 1920,
  height = 1080,
  stepSmall = 30,
  stepLarge = 150,
  color = GRID_COLOR,
  opacitySmall = 0.3,
  opacityLarge = 0.6,
  strokeWidthSmall = 0.5,
  strokeWidthLarge = 1,
}) => {
  const lines: React.ReactNode[] = [];

  for (let x = 0; x <= width; x += stepSmall) {
    const isLarge = x % stepLarge === 0;
    lines.push(
      <line
        key={`v${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={color}
        strokeWidth={isLarge ? strokeWidthLarge : strokeWidthSmall}
        opacity={isLarge ? opacityLarge : opacitySmall}
      />
    );
  }
  for (let y = 0; y <= height; y += stepSmall) {
    const isLarge = y % stepLarge === 0;
    lines.push(
      <line
        key={`h${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={color}
        strokeWidth={isLarge ? strokeWidthLarge : strokeWidthSmall}
        opacity={isLarge ? opacityLarge : opacitySmall}
      />
    );
  }

  return <g>{lines}</g>;
};
