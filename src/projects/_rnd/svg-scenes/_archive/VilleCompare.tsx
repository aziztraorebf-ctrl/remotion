/**
 * VilleCompare — R&D banc d'essai : ville/port grave, Gemini vs GPT-5.5, cote a cote.
 * Mode STATIQUE (frame 0) pour juger la matiere brute. Animation = 2e passe.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SvgSceneCoin } from "./SvgSceneCoin";
import { VILLE_GEMINI, VILLE_GPT } from "./villeBodies";

export const VilleCompare: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0e1729", display: "flex", flexDirection: "row" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgSceneCoin sceneSvg={VILLE_GEMINI} label="GEMINI 3.1 Pro" />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgSceneCoin sceneSvg={VILLE_GPT} label="GPT-5.5" />
      </div>
    </AbsoluteFill>
  );
};

export default VilleCompare;
