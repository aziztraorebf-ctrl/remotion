/**
 * GgwHookNarr4 — hook narratif "mur ecrase par l'immensite" : encre & medaille x Gemini & GPT-5.5.
 * Pour comparer modeles ET registres sur la meme intention narrative + juger le decoupage animable.
 */
import React from "react";
import { AbsoluteFill, staticFile, continueRender, delayRender } from "remotion";

const Pane: React.FC<{ file: string; label: string; bg: string }> = ({ file, label, bg }) => {
  const [svg, setSvg] = React.useState<string>("");
  const [h] = React.useState(() => delayRender(`l-${file}`));
  React.useEffect(() => {
    fetch(staticFile(`_rnd/ggw-svgtest/${file}`)).then((r) => r.text())
      .then((t) => { setSvg(t); continueRender(h); }).catch(() => continueRender(h));
  }, [h, file]);
  return (
    <div style={{ position: "relative", width: "25%", height: "100%", background: bg, borderLeft: "3px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", top: 12, left: 12, color: "#fff", fontFamily: "Arial", fontSize: 23, fontWeight: 800, background: "rgba(0,0,0,0.62)", padding: "5px 11px", borderRadius: 5 }}>{label}</div>
    </div>
  );
};

export const GgwHookNarr4: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Pane file="narr-1-encre.svg" label="Encre · Gemini" bg="#e8dcc0" />
    <Pane file="narr-1-encre-gpt.svg" label="Encre · GPT" bg="#e8dcc0" />
    <Pane file="narr-2-chaud.svg" label="Medaille · Gemini" bg="#1c1108" />
    <Pane file="narr-2-chaud-gpt.svg" label="Medaille · GPT" bg="#1c1108" />
  </AbsoluteFill>
);

export default GgwHookNarr4;
