import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { KraftCardBackground, KraftBgVariant } from "../_shared/components/inserts/KraftCardBackground";
import { OdometerFlip } from "../_shared/components/layouts/OdometerFlip";

type Props = {
  variant?: KraftBgVariant;
};

export const Prototype_B_OdometerDataHero: React.FC<Props> = ({ variant = "kraft" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelColor =
    variant === "kraft" ? "#1a120a" :
    variant === "slate" ? "#f0ece4" :
    "#1a1a1a";
  const subColor =
    variant === "kraft" ? "#4a3a2a" :
    variant === "slate" ? "#b0a8c0" :
    "#5a5a5a";

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const footerOpacity = interpolate(frame, [3 * fps, 3 * fps + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <KraftCardBackground variant={variant}>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 36,
            fontStyle: "italic",
            color: subColor,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 32,
            opacity: headerOpacity,
          }}
        >
          Bloc Sangomar &mdash; Senegal 2024
        </div>

        <OdometerFlip
          toValue="100000"
          label="BARILS PAR JOUR"
          spinStartFrame={20}
          spinStagger={6}
          spinDuration={45}
        />

        <div
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 28,
            fontStyle: "italic",
            color: subColor,
            marginTop: 48,
            opacity: footerOpacity,
            textAlign: "center",
            maxWidth: 1200,
          }}
        >
          Production cible &mdash; operateur Woodside Energy
        </div>
      </AbsoluteFill>
    </KraftCardBackground>
  );
};
