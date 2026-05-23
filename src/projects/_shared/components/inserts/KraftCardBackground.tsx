import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

export type KraftBgVariant = "kraft" | "slate" | "ivoire";

type Palette = {
  bg: string;
  bgTexture: string | null;
  textureOpacity: number;
};

const PALETTES: Record<KraftBgVariant, Palette> = {
  kraft: {
    bg: "#d9c8a4",
    bgTexture: "_shared/textures/bg-kraft-affirme.png",
    textureOpacity: 0.85,
  },
  slate: {
    bg: "#1e2540",
    bgTexture: null,
    textureOpacity: 0.4,
  },
  ivoire: {
    bg: "#f5f0e6",
    bgTexture: null,
    textureOpacity: 0.85,
  },
};

type Props = {
  variant?: KraftBgVariant;
  children?: React.ReactNode;
};

export const KraftCardBackground: React.FC<Props> = ({
  variant = "kraft",
  children,
}) => {
  const palette = PALETTES[variant];

  return (
    <AbsoluteFill style={{ backgroundColor: palette.bg }}>
      {palette.bgTexture && (
        <Img
          src={staticFile(palette.bgTexture)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "multiply",
            opacity: palette.textureOpacity,
          }}
        />
      )}
      {children}
    </AbsoluteFill>
  );
};
