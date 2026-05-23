import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SouverainScene, DarkCssBg } from "../_shared/components/SouverainScene";
import { OdometerFlip } from "../_shared/components/layouts/OdometerFlip";

const DARK_VARIANTS: DarkCssBg[] = [
  "dark-dots-navy",
  "dark-dots-brown",
  "kraft-dark",
  "slate-medium",
  "paper-warm-dark",
];

const LABELS: Record<DarkCssBg, string> = {
  "dark-dots-navy":  "dark-dots-navy — Niger Uranium style",
  "dark-dots-brown": "dark-dots-brown — Or Africain style",
  "kraft-dark":      "kraft-dark — papier nuit",
  "slate-medium":    "slate-medium — ardoise lumineux",
  "paper-warm-dark": "paper-warm-dark — parchemin sombre",
};

const SCENE = 4 * 30;

export const Prototype_E_BackgroundsShowcase: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {DARK_VARIANTS.map((variant, i) => (
        <Sequence key={variant} from={i * SCENE} durationInFrames={SCENE} premountFor={fps}>
          <SouverainScene background={variant} vignette>
            <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
              <OdometerFlip
                toValue="86000"
                label="BARILS / JOUR"
                spinStartFrame={15}
                spinStagger={5}
                spinDuration={35}
              />
              <div style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 22,
                letterSpacing: 6,
                color: "rgba(200,169,81,0.7)",
                textTransform: "uppercase",
              }}>
                {LABELS[variant]}
              </div>
            </AbsoluteFill>
          </SouverainScene>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
