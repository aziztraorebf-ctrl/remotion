/**
 * GgwSvgTestCompare — TEST D'ECART image-cible (raster grave) -> SVG reproduit (Gemini vs GPT).
 * R&D Grande Muraille Verte (2026-06-22). 2 variantes : "coupe" et "top". Chacune affiche, cote a cote :
 *   image-cible raster (gauche) | SVG Gemini (centre) | SVG GPT (droite).
 * On JUGE SOI-MEME au render full HD si la gravure SVG tient ou s'effondre vs la cible (doctrine SVG-FAISABILITE-AMONT).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, continueRender, delayRender } from "remotion";

const CREME = "#e8dcc0";

const SvgPane: React.FC<{ file: string; label: string }> = ({ file, label }) => {
  const [svg, setSvg] = React.useState<string>("");
  const [handle] = React.useState(() => delayRender(`load-${file}`));
  React.useEffect(() => {
    fetch(staticFile(`_rnd/ggw-svgtest/${file}`))
      .then((r) => r.text())
      .then((t) => { setSvg(t); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle, file]);
  return (
    <div style={{ position: "relative", width: "33.33%", height: "100%", background: CREME, borderLeft: "3px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={lbl}>{label}</div>
    </div>
  );
};

const ImgPane: React.FC<{ src: string; label: string }> = ({ src, label }) => (
  <div style={{ position: "relative", width: "33.33%", height: "100%", background: CREME }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    <div style={{ ...lbl, background: "rgba(120,20,20,0.85)" }}>{label}</div>
  </div>
);

const lbl: React.CSSProperties = {
  position: "absolute", top: 16, left: 16, color: "#fff", fontFamily: "Arial", fontSize: 26,
  fontWeight: 800, background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 5, zIndex: 10,
};

export const GgwSvgTestCoupe: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <ImgPane src="_rnd/ggw-cibles/cible-COUPE-gptprompt.png" label="CIBLE raster" />
    <SvgPane file="svg-COUPE-gemini.svg" label="SVG Gemini" />
    <SvgPane file="svg-COUPE-gpt.svg" label="SVG GPT" />
  </AbsoluteFill>
);

export const GgwSvgTestTop: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <ImgPane src="_rnd/ggw-cibles/cible-TOP-gptprompt.png" label="CIBLE raster" />
    <SvgPane file="svg-TOP-gemini.svg" label="SVG Gemini" />
    <SvgPane file="svg-TOP-gpt.svg" label="SVG GPT" />
  </AbsoluteFill>
);

// Test d'ecart sur la cible CALIBREE niveau-SVG (doit etre quasi-nul vs le 1er test rate)
export const GgwSvgTestCalibre: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <ImgPane src="_rnd/ggw-cibles/cible-CALIBRE-v1.png" label="CIBLE calibree v1" />
    <SvgPane file="svgcal-gemini.svg" label="SVG Gemini" />
    <SvgPane file="svgcal-gpt.svg" label="SVG GPT" />
  </AbsoluteFill>
);

export default GgwSvgTestCoupe;
