// S2 A3 Cornes — Atlas Shaka Zulu
// VAGUE 1B (refait Remotion pur) : utilise InsertCornesSchema (SVG tactique, pas sprites)
// Duree : 13.5s (frames 1493 -> 1899 globale, 0 -> 406 local)

import React from "react";
import { InsertCornesSchema } from "../inserts/InsertCornesSchema";

export interface AtlasShakaS2A3CornesProps {
  durationFrames: number;
}

export const AtlasShakaS2A3Cornes: React.FC<AtlasShakaS2A3CornesProps> = ({ durationFrames }) => {
  return <InsertCornesSchema durationFrames={durationFrames} />;
};
