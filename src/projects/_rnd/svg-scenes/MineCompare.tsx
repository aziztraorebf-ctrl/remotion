/**
 * MineCompare — comparatif STATIQUE Gemini vs GPT pour la scene "mine-or-darfour" (registre braise-or, 16:9).
 *
 * R&D SVG-SCENES-GENERATIVES — piste "esthetiques chaudes" + "16:9" + integration Soudan (2026-06-21).
 * Juge la MATIERE statique avant d'animer (doctrine). Les 2 SVG sont injectes en innerHTML (rendu statique).
 * viewBox des SVG = 1920x1080 (paysage). On affiche les 2 empiles verticalement pour comparer en plein largeur.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { MINE_GEMINI, MINE_GPT } from "./mineBodies";

// fond terre sombre chaud du registre braise-or (le code pose le fond, le LLM ne le dessine pas forcement)
const TERRE = "#1c1108";

// convertir camelCase SVG -> kebab pour innerHTML (gotcha doctrine : les LLM rendent du JSX)
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
    // glyphes unicode fleches eventuels dans les <text>
    .replace(/↑/g, "(HAUT)")
    .replace(/↓/g, "(BAS)")
    .replace(/→/g, "->");
}

const Panel: React.FC<{ body: string; label: string }> = ({ body, label }) => (
  <div style={{ position: "relative", width: "50%", height: "100%" }}>
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}
      dangerouslySetInnerHTML={{ __html: toKebab(body) }} />
    <div style={{
      position: "absolute", top: 18, left: 24, color: "#ffe39a", fontFamily: "Arial, sans-serif",
      fontSize: 26, letterSpacing: 3, fontWeight: 700, textShadow: "0 2px 6px #000",
    }}>{label}</div>
  </div>
);

export const MineCompare: React.FC = () => (
  <AbsoluteFill style={{ background: TERRE, flexDirection: "row" }}>
    <Panel body={MINE_GEMINI} label="GEMINI" />
    <div style={{ width: 2, height: "100%", background: "#000", opacity: 0.5 }} />
    <Panel body={MINE_GPT} label="GPT-5.5" />
  </AbsoluteFill>
);

export default MineCompare;
