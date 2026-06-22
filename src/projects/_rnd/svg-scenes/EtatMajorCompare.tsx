/**
 * EtatMajorCompare — R&D banc d'essai : carte d'etat-major gravee, Gemini vs GPT-5.5, cote a cote.
 * Mode STATIQUE (frame 0). Animation = 2e passe.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SvgSceneCoin } from "./SvgSceneCoin";
import { EM_GEMINI, EM_GPT } from "./emBodies";

export const EtatMajorCompare: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0e1729", display: "flex", flexDirection: "row" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgSceneCoin sceneSvg={EM_GEMINI} label="GEMINI 3.1 Pro" />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgSceneCoin sceneSvg={EM_GPT} label="GPT-5.5" />
      </div>
    </AbsoluteFill>
  );
};

export default EtatMajorCompare;
