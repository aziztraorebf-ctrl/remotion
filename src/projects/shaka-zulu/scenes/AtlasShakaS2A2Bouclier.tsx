// S2 A2 Bouclier — Atlas Shaka Zulu
// VAGUE 1B (refait Remotion pur) : utilise InsertBouclierSchema (SVG dataviz 3-step, pas image)
// Duree : 12.1s (frames 1130 -> 1493 globale, 0 -> 363 local)

import React from "react";
import { InsertBouclierSchema } from "../inserts/InsertBouclierSchema";

export interface AtlasShakaS2A2BouclierProps {
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp" | "remotion-pur";
  durationFrames: number;
}

export const AtlasShakaS2A2Bouclier: React.FC<AtlasShakaS2A2BouclierProps> = ({ durationFrames }) => {
  return <InsertBouclierSchema durationFrames={durationFrames} />;
};
