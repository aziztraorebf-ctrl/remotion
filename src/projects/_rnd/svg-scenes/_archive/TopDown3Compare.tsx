/**
 * TopDown3Compare — comparatif 3 SVG du hook "mur d'arbres" :
 *   GAUCHE  = Gemini v1 (image->SVG, avec fausse carte)
 *   CENTRE  = GPT-5.5 ameliore (brief : pas de carte, bande stylisee)
 *   DROITE  = Gemini itere sur son propre SVG (meme brief)
 * R&D faisabilite SVG (2026-06-22) : qui itere le mieux vers notre cible reelle ? On juge SOI-MEME au render.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SVG_GEMINI_V1, SVG_GPT_IMP, SVG_GEMINI_ITER } from "./topdown3Bodies";

const Panel: React.FC<{ body: string; label: string }> = ({ body, label }) => (
  <div style={{ position: "relative", width: "33.333%", height: "100%", background: "#1c1108" }}>
    <svg viewBox="0 0 1080 1920" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}
      dangerouslySetInnerHTML={{ __html: body }} />
    <div style={{
      position: "absolute", top: 14, left: 16, color: "#fff", fontFamily: "Arial", fontSize: 26,
      fontWeight: 800, background: "rgba(0,0,0,0.6)", padding: "5px 12px", borderRadius: 5,
    }}>{label}</div>
  </div>
);

export const TopDown3Compare: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Panel body={SVG_GEMINI_V1} label="GEMINI v1 (carte)" />
    <div style={{ width: 3, height: "100%", background: "#fff" }} />
    <Panel body={SVG_GPT_IMP} label="GPT-5.5 ameliore" />
    <div style={{ width: 3, height: "100%", background: "#fff" }} />
    <Panel body={SVG_GEMINI_ITER} label="GEMINI itere" />
  </AbsoluteFill>
);

export default TopDown3Compare;
