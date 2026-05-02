// S2 A3 Cornes — Atlas Shaka Zulu
// Utilise CornesFrameNarrative (schema tactique anime) avec walk cycle PixelLab sur les flancs
// Version carte disponible dans git history si besoin

import React from "react";
import { CornesFrameNarrative } from "./CornesFrameNarrative";

export interface AtlasShakaS2A3CornesProps {
  durationFrames: number;
}

export const AtlasShakaS2A3Cornes: React.FC<AtlasShakaS2A3CornesProps> = ({ durationFrames }) => {
  return <CornesFrameNarrative durationFrames={durationFrames} />;
};
