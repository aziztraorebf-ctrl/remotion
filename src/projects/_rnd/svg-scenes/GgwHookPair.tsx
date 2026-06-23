/**
 * GgwHookPair — 1 concept de hook, 2 modeles cote a cote (Gemini | GPT), grand format pour juger.
 * 3 compos : A (couture), B (coupe), C (blueprint).
 */
import React from "react";
import { AbsoluteFill, staticFile, continueRender, delayRender } from "remotion";

const CREME = "#e8dcc0";
const Pane: React.FC<{ file: string; label: string }> = ({ file, label }) => {
  const [svg, setSvg] = React.useState<string>("");
  const [h] = React.useState(() => delayRender(`l-${file}`));
  React.useEffect(() => {
    fetch(staticFile(`_rnd/ggw-svgtest/${file}`)).then((r) => r.text())
      .then((t) => { setSvg(t); continueRender(h); }).catch(() => continueRender(h));
  }, [h, file]);
  return (
    <div style={{ position: "relative", width: "50%", height: "100%", background: CREME, borderLeft: "3px solid #000" }}>
      <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: svg }} />
      <div style={{ position: "absolute", top: 16, left: 16, color: "#fff", fontFamily: "Arial", fontSize: 30, fontWeight: 800, background: "rgba(0,0,0,0.6)", padding: "6px 14px", borderRadius: 5 }}>{label}</div>
    </div>
  );
};
const mk = (c: string) => () => (
  <AbsoluteFill style={{ background: "#000", flexDirection: "row" }}>
    <Pane file={`svg2-${c}-gemini.svg`} label="Gemini 3.1 Pro" />
    <Pane file={`svg2-${c}-gpt.svg`} label="GPT-5.5" />
  </AbsoluteFill>
);
export const GgwHookPairA = mk("A");
export const GgwHookPairB = mk("B");
export const GgwHookPairC = mk("C");
