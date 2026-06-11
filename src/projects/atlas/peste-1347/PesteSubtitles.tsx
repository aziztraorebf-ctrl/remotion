// PesteSubtitles — couche sous-titres sobres (registre analyste/documentaire).
// Fond TRANSPARENT : rendu en ProRes 4444 alpha, puis overlay ffmpeg sur l'épisode.
// Style : serif crème sur bandeau navy semi-transparent, bas d'écran, au-dessus des sources.

import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { PESTE_SUBTITLES } from "./subtitles";

const FPS = 30;
const CREAM = "#f5e6c8";

export const PesteSubtitles: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const cue = PESTE_SUBTITLES.find((c) => t >= c.start && t <= c.end);
  if (!cue) return <AbsoluteFill />;

  // Fade in/out doux sur chaque sous-titre (0.12s).
  const fadeIn = interpolate(t, [cue.start, cue.start + 0.12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(t, [cue.end - 0.12, cue.end], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute",
        bottom: 116,            // au-dessus des footers sources (bottom:28)
        left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity,
        pointerEvents: "none",
      }}>
        <div style={{
          maxWidth: "82%",
          background: "rgba(16, 22, 40, 0.62)",
          padding: "6px 18px",
          borderRadius: 4,
          textAlign: "center",
        }}>
          <span style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 27,
            lineHeight: 1.25,
            color: CREAM,
            letterSpacing: "0.01em",
            textShadow: "0 2px 6px rgba(0,0,0,0.85)",
          }}>
            {cue.text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
