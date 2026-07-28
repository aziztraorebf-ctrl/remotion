// STATIC preview — port fluvial ouest-africain vu du quai. R&D.
// Ce composant ne fait qu'AFFICHER la matiere de portDecorGroups.ts.
// Aucune animation ici : l'equipe animera les calques individuellement.
import React from "react";
import { AbsoluteFill } from "remotion";
import { CALQUES, PALETTE } from "./portDecorGroups";

const INNER = CALQUES.map((c) => `<g id="CALQUE_${c.nom}">${c.svg}</g>`).join("");

export const PortDecorStatique: React.FC = () => (
  <AbsoluteFill style={{ background: PALETTE.CIEL_BAS }}>
    <svg
      viewBox="0 0 1920 1080"
      width="100%"
      height="100%"
      style={{ position: "absolute", inset: 0 }}
      dangerouslySetInnerHTML={{ __html: INNER }}
    />
  </AbsoluteFill>
);

export default PortDecorStatique;
