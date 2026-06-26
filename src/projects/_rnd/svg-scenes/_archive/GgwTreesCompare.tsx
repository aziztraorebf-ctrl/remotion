/** GgwTreesCompare — planches d'arbres SVG generees (Gemini | GPT) pour choisir/raffiner. */
import React from "react";
import { AbsoluteFill, staticFile, continueRender, delayRender } from "remotion";
const Pane: React.FC<{ file: string; label: string }> = ({ file, label }) => {
  const [svg, setSvg] = React.useState("");
  const [h] = React.useState(() => delayRender(`l-${file}`));
  React.useEffect(() => {
    fetch(staticFile(`_rnd/ggw-svgtest/${file}`)).then((r) => r.text()).then((t) => { setSvg(t); continueRender(h); }).catch(() => continueRender(h));
  }, [h, file]);
  return (
    <div style={{ position: "relative", width: "50%", height: "100%", background: "#e8dcc0", borderLeft: "3px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", top: 14, left: 14, color: "#fff", fontFamily: "Arial", fontSize: 28, fontWeight: 800, background: "rgba(0,0,0,0.6)", padding: "5px 12px" }}>{label}</div>
    </div>
  );
};
export const GgwTreesCompare: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Pane file="trees-gemini.svg" label="Gemini" />
    <Pane file="trees-gpt.svg" label="GPT-5.5" />
  </AbsoluteFill>
);
export default GgwTreesCompare;
