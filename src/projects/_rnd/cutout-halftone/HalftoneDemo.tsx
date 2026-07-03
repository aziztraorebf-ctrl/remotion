import React from "react";
import { AbsoluteFill } from "remotion";
import { CutoutHalftone } from "./CutoutHalftone";

export const HalftoneDemo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#16213a",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 40,
        gap: 80,
      }}
    >
      {/* Variante 1 : stroke or Souverain */}
      <CutoutHalftone
        strokeColor="#E8A427"
        strokeX={-22}
        strokeY={-14}
        dotSize={4}
        width={320}
        height={380}
      />

      {/* Variante 2 : stroke rouge/terracotta */}
      <CutoutHalftone
        strokeColor="#C84B31"
        strokeX={20}
        strokeY={-14}
        dotSize={6}
        width={320}
        height={380}
      />

      {/* Variante 3 : gros dots + stroke blanc */}
      <CutoutHalftone
        strokeColor="#FFFFFF"
        strokeX={-18}
        strokeY={-18}
        dotSize={8}
        width={320}
        height={380}
        strokeOpacity={0.5}
      />
    </AbsoluteFill>
  );
};
