import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

export interface LoomWipeProps {
  bandColorA?: string;
  bandColorB?: string;
}

const BAND_H = 270;
const BAND_W = 480;

export const LoomWipe: React.FC<LoomWipeProps> = ({
  bandColorA = "#c8a951",
  bandColorB = "#1a2535",
}) => {
  const frame = useCurrentFrame();

  const entreeProgress = interpolate(frame, [0, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const sortieProgress = interpolate(frame, [50, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const hBandes = [
    { y: 0, color: bandColorA, fromLeft: true },
    { y: BAND_H, color: bandColorB, fromLeft: false },
    { y: BAND_H * 2, color: bandColorA, fromLeft: true },
    { y: BAND_H * 3, color: bandColorB, fromLeft: false },
  ];

  const vBandes = [
    { x: 0, color: bandColorB, fromTop: true },
    { x: BAND_W, color: bandColorA, fromTop: false },
    { x: BAND_W * 2, color: bandColorB, fromTop: true },
    { x: BAND_W * 3, color: bandColorA, fromTop: false },
  ];

  return (
    <AbsoluteFill>
      {/* Bandes horizontales */}
      {hBandes.map((b, i) => {
        const entreeX = b.fromLeft
          ? interpolate(entreeProgress, [0, 1], [-1920, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(entreeProgress, [0, 1], [1920, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sortieX = b.fromLeft
          ? interpolate(sortieProgress, [0, 1], [0, -1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(sortieProgress, [0, 1], [0, 1920], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const tx = frame < 50 ? entreeX : sortieX;
        return (
          <div
            key={`h-${i}`}
            style={{
              position: "absolute",
              top: `${(b.y / 1080) * 100}%`,
              left: 0,
              width: "100%",
              height: `${(BAND_H / 1080) * 100}%`,
              backgroundColor: b.color,
              transform: `translateX(${(tx / 1920) * 100}%)`,
              zIndex: 10,
            }}
          />
        );
      })}

      {/* Bandes verticales */}
      {vBandes.map((b, i) => {
        const entreeY = b.fromTop
          ? interpolate(entreeProgress, [0, 1], [-1080, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(entreeProgress, [0, 1], [1080, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const sortieY = b.fromTop
          ? interpolate(sortieProgress, [0, 1], [0, -1080], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
          : interpolate(sortieProgress, [0, 1], [0, 1080], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const ty = frame < 50 ? entreeY : sortieY;
        return (
          <div
            key={`v-${i}`}
            style={{
              position: "absolute",
              left: `${(b.x / 1920) * 100}%`,
              top: 0,
              width: `${(BAND_W / 1920) * 100}%`,
              height: "100%",
              backgroundColor: b.color,
              transform: `translateY(${(ty / 1080) * 100}%)`,
              zIndex: 20,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
