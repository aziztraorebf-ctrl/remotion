/**
 * DefenseCompare — R&D banc d'essai : clause de defense mutuelle AES (registre tactique), Gemini vs GPT-5.5.
 * Mode STATIQUE. Concept abstrait issu du VRAI script War-Map Sahel (Partie 3).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { DEFENSE_GEMINI, DEFENSE_GPT } from "./defenseBodies";

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

export const DefenseCompare: React.FC = () => (
  <AbsoluteFill style={{ background: "#070d18", display: "flex", flexDirection: "row" }}>
    <Panel svg={DEFENSE_GEMINI} label="GEMINI 3.1 Pro" />
    <Panel svg={DEFENSE_GPT} label="GPT-5.5" />
  </AbsoluteFill>
);
