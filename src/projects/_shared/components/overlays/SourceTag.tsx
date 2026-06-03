import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface SourceTagProps {
  source: string;
  startFrame: number;
  endFrame: number;
}

export function SourceTag({ source, startFrame, endFrame }: SourceTagProps) {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 18, endFrame - 18, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 42,
        left: 60,
        opacity,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 18,
        fontWeight: 400,
        color: "rgba(200,169,81,0.65)",
        letterSpacing: "0.06em",
        pointerEvents: "none",
        backgroundColor: "rgba(22,33,58,0.55)",
        padding: "5px 14px",
        borderRadius: 3,
        borderLeft: "2px solid rgba(200,169,81,0.40)",
      }}
    >
      {source}
    </div>
  );
}
