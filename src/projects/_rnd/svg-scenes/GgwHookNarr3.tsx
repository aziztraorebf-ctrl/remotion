/**
 * GgwHookNarr3 — test concept SCENE NARRATIVE du hook "le mur fier ecrase par l'immensite", 3 registres.
 * 1=encre-narrative · 2=chaud-medaille · 3=libre (Gemini choisit). Prouver le transfert du NARRATIF au registre encre.
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
    <div style={{ position: "relative", width: "33.333%", height: "100%", background: bg, borderLeft: "3px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", top: 14, left: 14, color: "#fff", fontFamily: "Arial", fontSize: 26, fontWeight: 800, background: "rgba(0,0,0,0.62)", padding: "5px 12px", borderRadius: 5 }}>{label}</div>
    </div>
  );
};

export const GgwHookNarr3: React.FC = () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Pane file="narr-1-encre.svg" label="1 · Encre narrative" bg="#e8dcc0" />
    <Pane file="narr-2-chaud.svg" label="2 · Chaud medaille" bg="#1c1108" />
    <Pane file="narr-3-libre.svg" label="3 · Libre (Gemini)" bg="#e8dcc0" />
  </AbsoluteFill>
);

export default GgwHookNarr3;
