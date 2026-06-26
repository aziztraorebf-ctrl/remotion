/**
 * DemiLuneCompare — comparatif STATIQUE de 3 REGISTRES pour la scene "demilune-racine".
 *
 * R&D Grande Muraille Verte (2026-06-22) : choisir l'IDENTITE VISUELLE de marque (longs<->shorts SVG).
 * Meme scene "la demi-lune capte l'eau et reveille la racine", meme modele (Gemini), seul le REGISTRE varie :
 *   - papier-decoupe (clair/pedagogique — a departager : trop enfantin pour GeoAfrique ?)
 *   - braise-or (chaud/grave — arc sec->vivant, meme monde chromatique que les longs)
 *   - encre (gravure parchemin — serieux, premium)
 * Injecte en innerHTML (rendu statique pour juger la matiere, doctrine SVG-SCENES-GENERATIVES).
 * viewBox des SVG = 1920x1080. 3 panneaux cote a cote.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { DL_PAPIER, DL_BRAISE, DL_ENCRE } from "./demiluneBodies";

// fonds poses par le code selon le registre (le LLM ne dessine pas toujours le fond)
const BG_PAPIER = "#bfe3ef"; // ciel pastel clair
const BG_BRAISE = "#1c1108"; // terre sombre chaude
const BG_ENCRE = "#e8dcc0"; // parchemin creme

function toKebab(svg: string): string {
  return svg
    .replace(/strokeWidth=/g, "stroke-width=")
    .replace(/strokeLinecap=/g, "stroke-linecap=")
    .replace(/strokeLinejoin=/g, "stroke-linejoin=")
    .replace(/strokeDasharray=/g, "stroke-dasharray=")
    .replace(/strokeDashoffset=/g, "stroke-dashoffset=")
    .replace(/strokeOpacity=/g, "stroke-opacity=")
    .replace(/fillOpacity=/g, "fill-opacity=")
    .replace(/fillRule=/g, "fill-rule=")
    .replace(/clipPath=/g, "clip-path=")
    .replace(/clipRule=/g, "clip-rule=")
    .replace(/textAnchor=/g, "text-anchor=")
    .replace(/fontFamily=/g, "font-family=")
    .replace(/fontSize=/g, "font-size=")
    .replace(/fontWeight=/g, "font-weight=")
    .replace(/letterSpacing=/g, "letter-spacing=")
    .replace(/stopColor=/g, "stop-color=")
    .replace(/stopOpacity=/g, "stop-opacity=")
    .replace(/gradientUnits=/g, "gradient-units=")
    .replace(/gradientTransform=/g, "gradient-transform=")
    .replace(/↑/g, "(HAUT)")
    .replace(/↓/g, "(BAS)")
    .replace(/→/g, "->");
}

const Panel: React.FC<{ body: string; label: string; bg: string }> = ({ body, label, bg }) => (
  <div style={{ position: "relative", width: "33.333%", height: "100%", background: bg }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}
      dangerouslySetInnerHTML={{ __html: toKebab(body) }} />
    <div style={{
      position: "absolute", top: 18, left: 24, color: "#fff", fontFamily: "Arial, sans-serif",
      fontSize: 30, letterSpacing: 2, fontWeight: 800, textShadow: "0 2px 8px #000",
      background: "rgba(0,0,0,0.45)", padding: "4px 14px", borderRadius: 6,
    }}>{label}</div>
  </div>
);

export const DemiLuneCompare: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Panel body={DL_PAPIER} label="PAPIER-DECOUPE" bg={BG_PAPIER} />
    <div style={{ width: 2, height: "100%", background: "#000" }} />
    <Panel body={DL_BRAISE} label="BRAISE-OR" bg={BG_BRAISE} />
    <div style={{ width: 2, height: "100%", background: "#000" }} />
    <Panel body={DL_ENCRE} label="ENCRE" bg={BG_ENCRE} />
  </AbsoluteFill>
);

export default DemiLuneCompare;
