// S2 A1 Iklwa — Atlas Shaka Zulu
// VAGUE 1B (refait Remotion pur) : utilise InsertIklwaSchema (SVG dataviz, pas image)
// Duree : 14.9s (frames 683 -> 1130 dans la video globale, 0 -> 447 en local)

import React from "react";
import { InsertIklwaSchema } from "../inserts/InsertIklwaSchema";

export interface AtlasShakaS2A1IklwaProps {
  imageVariant?: "gemini-parchemin" | "gemini-pixellab" | "pixellab-mcp" | "remotion-pur";
  durationFrames: number;
}

export const AtlasShakaS2A1Iklwa: React.FC<AtlasShakaS2A1IklwaProps> = ({ durationFrames }) => {
  // Toujours Remotion pur maintenant. La prop imageVariant est conservee pour compatibilite mais ignoree.
  return <InsertIklwaSchema durationFrames={durationFrames} />;
};
