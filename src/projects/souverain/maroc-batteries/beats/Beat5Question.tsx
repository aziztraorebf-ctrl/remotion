import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * Beat5Question — PLACEHOLDER.
 * Beat Maroc Batteries non encore produit (A2-A6 à faire). Import présent dans
 * Root.tsx sans fichier => bundle cassé. Stub neutre pour rétablir la compilation.
 */

export const Beat5Question: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#16213a", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "Georgia, serif", color: "#c8a951", fontSize: 48 }}>
        Beat5Question (à produire)
      </span>
    </AbsoluteFill>
  );
};
