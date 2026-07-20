/**
 * VergerPreview — compo de TEST pour rendre des frames statiques de VergerCacao (3 etats).
 * Provisoire : valider le look avant d'animer dans B3/B4. A purger une fois fige.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { VergerCacao, VIVANTS_B3 } from "./VergerCacao";

// etat B3 : 2 cacaoyers sur 14 vivants (= un septieme), le reste mort.
const greenB3 = Array.from({ length: 14 }, (_, i) => (VIVANTS_B3.includes(i) ? 1 : 0));

export const VergerPreviewB3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
    <VergerCacao greenProgress={greenB3} crackProgress={0} />
  </AbsoluteFill>
);

// etat B4A : tous reverdis (climax)
const greenAll = Array.from({ length: 14 }, () => 1);
export const VergerPreviewReverdit: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
    <VergerCacao greenProgress={greenAll} crackProgress={0} />
  </AbsoluteFill>
);

// etat B4B : reverdi + fissure
export const VergerPreviewFissure: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#e8dcc0" }}>
    <VergerCacao greenProgress={greenAll} crackProgress={1} />
  </AbsoluteFill>
);
