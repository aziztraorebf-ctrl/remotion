// MOTEUR: aucun — INSTRUMENT DE MESURE TEMPORAIRE, pas une scene.
// Sert a mesurer la largeur reelle rendue d'un mot selon fontWeight (diagnostic
// plan 10). A SUPPRIMER apres la mesure.
import React from "react";
import { AbsoluteFill } from "remotion";
const STACK = '-apple-system, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';
export const FontProbe: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {[400, 500, 600, 700, 800].map((w, i) => (
      <div key={w} style={{ position: "absolute", left: 40, top: 40 + i * 130,
        fontFamily: STACK, fontSize: 68, fontWeight: w, color: "#fff", whiteSpace: "pre" }}>
        Confidence
      </div>
    ))}
  </AbsoluteFill>
);
