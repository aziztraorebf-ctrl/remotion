/**
 * Img2SvgCompare — TEST DE L'ECART : image-cible (gauche) vs SVG reel produit par Gemini depuis cette image (droite).
 * R&D faisabilite SVG (2026-06-22, reserve Aziz : la geo en SVG est-elle fidele ?). On juge SOI-MEME l'ecart.
 * Gauche = l'image raster generee (cible-topdown-apogee). Droite = le SVG que Gemini a produit pour la reproduire.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { IMG2SVG } from "./img2svgBody";

export const Img2SvgCompare: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <div style={{ position: "relative", width: "50%", height: "100%", background: "#1c1108" }}>
      <Img src={staticFile("_rnd/cible-topdown-apogee.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      <div style={lbl}>IMAGE-CIBLE (raster)</div>
    </div>
    <div style={{ width: 3, height: "100%", background: "#fff" }} />
    <div style={{ position: "relative", width: "50%", height: "100%", background: "#1c1108" }}>
      <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}
        dangerouslySetInnerHTML={{ __html: IMG2SVG }} />
      <div style={lbl}>SVG REEL (Gemini)</div>
    </div>
  </AbsoluteFill>
);

const lbl: React.CSSProperties = {
  position: "absolute", top: 18, left: 24, color: "#fff", fontFamily: "Arial", fontSize: 30,
  fontWeight: 800, background: "rgba(0,0,0,0.55)", padding: "6px 16px", borderRadius: 6,
};

export default Img2SvgCompare;
