/**
 * SplitScreen — composant de mise en tension visuelle generique
 *
 * 3 layouts :
 *   "stacked" — vertical 50/50 (haut / bas) — natif 9:16
 *   "split"   — horizontal 50/50 (gauche / droite)
 *   "reveal"  — panneau droit cache, revele a revealFrame
 *
 * Separateur central configurable (couleur, epaisseur).
 * Aucun label, aucun verdict — projeter n'importe quel contenu.
 *
 * Usage :
 *   <SplitScreen
 *     layout="stacked"
 *     leftPanel={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *     rightPanel={<Img src={staticFile("...")} style={{width:"100%",height:"100%",objectFit:"cover"}} />}
 *     separatorColor="#f5d547"
 *     separatorSize={3}
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SplitLayout = "split" | "stacked" | "reveal";

interface SplitScreenProps {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  layout?: SplitLayout;
  revealFrame?: number;
  separatorColor?: string;
  separatorSize?: number;
}

export const SplitScreen: React.FC<SplitScreenProps> = ({
  leftPanel,
  rightPanel,
  layout = "stacked",
  revealFrame = 45,
  separatorColor = "#f5d547",
  separatorSize = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 60 },
    durationInFrames: 35,
  });
  const rightSlide = spring({
    frame: frame - 8,
    fps,
    config: { damping: 100, stiffness: 60 },
    durationInFrames: 35,
  });
  const revealProgress = spring({
    frame: frame - revealFrame,
    fps,
    config: { damping: 100, stiffness: 60 },
    durationInFrames: 30,
  });

  const separatorProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 150, stiffness: 80 },
    durationInFrames: 25,
  });

  const isStacked = layout === "stacked";
  const isReveal = layout === "reveal";

  const leftPanelStyle: React.CSSProperties = isStacked
    ? {
        position: "relative",
        overflow: "hidden",
        width: 1080,
        height: 960,
        transform: `translateY(${interpolate(leftSlide, [0, 1], [-960, 0])}px)`,
      }
    : {
        position: "relative",
        overflow: "hidden",
        width: 540,
        height: 1920,
        transform: `translateX(${interpolate(leftSlide, [0, 1], [-540, 0])}px)`,
      };

  const rightPanelStyle: React.CSSProperties = isStacked
    ? {
        position: "relative",
        overflow: "hidden",
        width: 1080,
        height: 960,
        transform: `translateY(${interpolate(rightSlide, [0, 1], [960, 0])}px)`,
        opacity: isReveal ? revealProgress : 1,
      }
    : {
        position: "relative",
        overflow: "hidden",
        width: 540,
        height: 1920,
        transform: `translateX(${interpolate(rightSlide, [0, 1], [540, 0])}px)`,
        opacity: isReveal ? revealProgress : 1,
      };

  return (
    <AbsoluteFill
      style={{
        background: "#0a0a0a",
        flexDirection: isStacked ? "column" : "row",
      }}
    >
      <div style={leftPanelStyle}>
        <div style={{ width: "100%", height: "100%" }}>{leftPanel}</div>
      </div>

      {/* Separateur */}
      <div
        style={
          isStacked
            ? {
                width: 1080,
                height: separatorSize,
                background: separatorColor,
                flexShrink: 0,
                opacity: separatorProgress,
              }
            : {
                width: separatorSize,
                height: 1920,
                background: separatorColor,
                flexShrink: 0,
                opacity: separatorProgress,
              }
        }
      />

      <div style={rightPanelStyle}>
        <div style={{ width: "100%", height: "100%" }}>{rightPanel}</div>
      </div>
    </AbsoluteFill>
  );
};
