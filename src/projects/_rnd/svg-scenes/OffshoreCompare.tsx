/**
 * OffshoreCompare — R&D banc d'essai : plateforme offshore BLUEPRINT, Gemini vs GPT-5.5, cote a cote.
 * Mode STATIQUE (frame 0). Animation = 2e passe.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { SvgScenePlanche } from "./SvgScenePlanche";
import { OFFSHORE_GEMINI, OFFSHORE_GPT } from "./offshoreBodies";

export const OffshoreCompare: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08122a", display: "flex", flexDirection: "row" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgScenePlanche sceneSvg={OFFSHORE_GEMINI} label="GEMINI 3.1 Pro" />
      </div>
      <div style={{ position: "relative", flex: 1 }}>
        <SvgScenePlanche sceneSvg={OFFSHORE_GPT} label="GPT-5.5" />
      </div>
    </AbsoluteFill>
  );
};

export default OffshoreCompare;
