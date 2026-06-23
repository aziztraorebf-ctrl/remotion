/**
 * GgwHookSvg6Up — 6 hooks SVG natifs (3 concepts A/B/C x 2 modeles Gemini/GPT-5.5), cote a cote.
 * Methode 2026-06-22 : image-cible = SVG natif du generateur (3.1 Pro + 5.5), zero raster intermediaire.
 * Concepts : A=couture/desert-dunes · B=coupe ingenieur · C=blueprint vertical.
 */
import React from "react";
import { AbsoluteFill, staticFile, continueRender, delayRender } from "remotion";

const CREME = "#e8dcc0";

const Pane: React.FC<{ file: string; label: string }> = ({ file, label }) => {
  const [svg, setSvg] = React.useState<string>("");
  const [handle] = React.useState(() => delayRender(`load-${file}`));
  React.useEffect(() => {
    fetch(staticFile(`_rnd/ggw-svgtest/${file}`))
      .then((r) => r.text()).then((t) => { setSvg(t); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle, file]);
  return (
    <div style={{ position: "relative", width: "16.666%", height: "100%", background: CREME, borderLeft: "2px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={lbl}>{label}</div>
    </div>
  );
};
const lbl: React.CSSProperties = {
  position: "absolute", top: 12, left: 10, color: "#fff", fontFamily: "Arial", fontSize: 22,
  fontWeight: 800, background: "rgba(0,0,0,0.62)", padding: "4px 10px", borderRadius: 4, zIndex: 10,
};

export const GgwHookSvg6Up: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Pane file="svg2-A-gemini.svg" label="A couture · Gem" />
    <Pane file="svg2-A-gpt.svg" label="A couture · GPT" />
    <Pane file="svg2-B-gemini.svg" label="B coupe · Gem" />
    <Pane file="svg2-B-gpt.svg" label="B coupe · GPT" />
    <Pane file="svg2-C-gemini.svg" label="C bluepr · Gem" />
    <Pane file="svg2-C-gpt.svg" label="C bluepr · GPT" />
  </AbsoluteFill>
);

export default GgwHookSvg6Up;
