import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { DashboardScreen } from "./DashboardScreen";
import { VirtualCursor } from "./VirtualCursor";
import { NS_COLORS } from "./theme";

export const NS_CURSOR_TEST_FPS = 30;
export const NS_CURSOR_TEST_FRAMES = 90;

/**
 * Prototype de test -- souris virtuelle qui se deplace sur le dashboard et "clique" sur la
 * ligne Sarah (highlighted). Validation visuelle AVANT de decider si on l'integre au plan
 * d'animation final P4/P5 (demande Aziz 2026-08-07).
 */
export const CursorTestComp: React.FC = () => {
  const frame = useCurrentFrame();

  // Trajet : entre en haut-droite (frame 0) -> survole le badge "Autorisé" de Sarah (frame 45) -> clique (frame 45-60)
  const startX = 1700;
  const startY = 200;
  const targetX = 1443; // centre du badge ActionPill, ligne Sarah (highlighted)
  const targetY = 690;

  const moveProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const cursorX = startX + (targetX - startX) * moveProgress;
  const cursorY = startY + (targetY - startY) * moveProgress;

  const clicking = frame >= 45 && frame <= 63;
  const clickProgress = clicking
    ? interpolate(frame, [45, 63], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ background: NS_COLORS.navyDeep }}>
      <DashboardScreen riskCase="low" />
      <VirtualCursor x={cursorX} y={cursorY} clicking={clicking} clickProgress={clickProgress} />
    </AbsoluteFill>
  );
};
