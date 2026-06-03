import React from "react";
import { AbsoluteFill } from "remotion";

// Stub — fichier en reconstruction beat par beat.
// Composition de référence dans Root.tsx maintenue pour éviter les erreurs de build.

export const MAROC_SHORT_FRAMES = 3284;

export const MarocBatteriesShort: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#16213a", alignItems: "center", justifyContent: "center" }}>
    <span style={{ fontFamily: "Georgia, serif", color: "#c8a951", fontSize: 36 }}>
      MarocBatteriesShort — en reconstruction
    </span>
  </AbsoluteFill>
);
