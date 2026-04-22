// Scene 5A — Ken Burns zoom-in on scene 4 last frame
// "La barre formait un arc entre ses mains. Le village entier restait muet."
// Narration: 52.94s - 58.28s (village muet) = 5.34s -> 6s clip
// Technique: slow push-in on static image (no Seedance)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  useCurrentFrame,
  staticFile,
} from "remotion";

const FPS = 30;
const DURATION_S = 6;
const DURATION_FRAMES = DURATION_S * FPS;

const SOURCE_IMAGE = "assets/sonjata-papercraft/clips/scene5a-kenburns-source.png";
const NARRATION_AUDIO = "audio/sonjata-papercraft/sonjata-short-v2.mp3";

// Narration for scene 5 starts at 52.94s in the full audio
const NARRATION_START_S = 52.94;
const NARRATION_START_FRAMES = Math.round(NARRATION_START_S * FPS);

export const SCENE5A_DURATION_FRAMES = DURATION_FRAMES;

export const SonjataScene5AKenBurns: React.FC = () => {
  const frame = useCurrentFrame();

  // Strong push-in: scale from 1.0 to 1.45 over 6 seconds
  // Zooms tight on Sunjata upper body + bent bar
  const scale = interpolate(
    frame,
    [0, DURATION_FRAMES],
    [1.0, 1.45],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Upward drift to frame upper body + bar + face
  const translateY = interpolate(
    frame,
    [0, DURATION_FRAMES],
    [0, -80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Image with Ken Burns push-in */}
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transformOrigin: "center 45%",
        }}
      >
        <Img
          src={staticFile(SOURCE_IMAGE)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* Narration audio starting from 52.94s in the full narration file */}
      <Audio
        src={staticFile(NARRATION_AUDIO)}
        startFrom={NARRATION_START_FRAMES}
        volume={1.0}
      />
    </AbsoluteFill>
  );
};
