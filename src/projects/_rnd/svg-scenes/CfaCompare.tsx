/**
 * CfaCompare — R&D banc d'essai : mecanisme du Franc CFA (registre tactique), Gemini vs GPT-5.5.
 * Mode STATIQUE (injection innerHTML). Sujet conceptuel : dependance monetaire / drainage des reserves.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { CFA_GEMINI, CFA_GPT } from "./cfaBodies";

const Panel: React.FC<{ svg: string; label: string }> = ({ svg, label }) => (
  <div style={{ position: "relative", flex: 1, background: "#0b1526", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ position: "relative", width: 1024, height: 1024 }}>
      <svg viewBox="0 0 1024 1024" width={1024} height={1024} style={{ position: "absolute", inset: 0 }}>
        <g dangerouslySetInnerHTML={{ __html: svg }} />
      </svg>
      <div style={{ position: "absolute", bottom: -48, left: 0, right: 0, textAlign: "center", color: "#5a8fc0", fontFamily: "monospace", fontSize: 26 }}>{label}</div>
    </div>
  </div>
);

export const CfaCompare: React.FC = () => (
  <AbsoluteFill style={{ background: "#070d18", display: "flex", flexDirection: "row" }}>
    <Panel svg={CFA_GEMINI} label="GEMINI 3.1 Pro" />
    <Panel svg={CFA_GPT} label="GPT-5.5" />
  </AbsoluteFill>
);

export default CfaCompare;
