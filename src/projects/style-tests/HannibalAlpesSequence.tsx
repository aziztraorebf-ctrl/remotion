import React from "react";
import { AbsoluteFill, Sequence, OffthreadVideo, useCurrentFrame, interpolate, staticFile } from "remotion";

// Clip durations measured via ffprobe
const CLIP1_FRAMES = 241; // 8.04s @ 30fps
const CLIP2_FRAMES = 301; // 10.04s @ 30fps
const TOTAL_FRAMES = CLIP1_FRAMES + CLIP2_FRAMES; // 542

// Text overlay timing
const TITLE_FADE = 15; // frames for fade in/out

const TextOverlay: React.FC<{
  text: string;
  localFrame: number;
  duration: number;
  fontSize?: number;
  color?: string;
  top?: string;
}> = ({ text, localFrame, duration, fontSize = 72, color = "#F5E6C8", top = "15%" }) => {
  const opacity = interpolate(
    localFrame,
    [0, TITLE_FADE, duration - TITLE_FADE, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        fontFamily: "'Cinzel', 'Georgia', serif",
        fontSize,
        fontWeight: 700,
        color,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textShadow: "0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(0,0,0,0.8), 2px 2px 0 rgba(0,0,0,0.7), -2px -2px 0 rgba(0,0,0,0.7)",
        padding: "0 60px",
      }}
    >
      {text}
    </div>
  );
};

export const HannibalAlpesSequence: React.FC = () => {
  const frame = useCurrentFrame();

  // Frame 0-60 : "218 av. J.-C." — over Hannibal facing forward
  const text1Start = 0;
  const text1Duration = 75;

  // Frame 180-241 : "90 000 hommes" — as army is revealed at end of clip 1
  const text2Start = 180;
  const text2Duration = 61; // runs to end of clip 1

  // Frame 390-480 : "Hannibal traverse les Alpes" — full army march in clip 2
  // Clip 2 starts at frame 241, so frame 390 = frame 149 within clip 2
  const text3Start = 390;
  const text3Duration = 90;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a14" }}>
      {/* Clip 1 */}
      <Sequence from={0} durationInFrames={CLIP1_FRAMES}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile("assets/hannibal-alpes/hannibal-o3-final-8s-VALIDATED.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* Clip 2 */}
      <Sequence from={CLIP1_FRAMES} durationInFrames={CLIP2_FRAMES}>
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile("assets/hannibal-alpes/hannibal-elements-v1.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* Text overlay 1 : "218 av. J.-C." */}
      {frame >= text1Start && frame < text1Start + text1Duration && (
        <TextOverlay
          text="218 av. J.-C."
          localFrame={frame - text1Start}
          duration={text1Duration}
          fontSize={64}
          color="#A8D8C8"
          top="12%"
        />
      )}

      {/* Text overlay 2 : "90 000 hommes" */}
      {frame >= text2Start && frame < text2Start + text2Duration && (
        <TextOverlay
          text="90 000 hommes"
          localFrame={frame - text2Start}
          duration={text2Duration}
          fontSize={72}
          color="#F5E6C8"
          top="80%"
        />
      )}

      {/* Text overlay 3 : "Hannibal traverse les Alpes" */}
      {frame >= text3Start && frame < text3Start + text3Duration && (
        <TextOverlay
          text="Hannibal traverse les Alpes"
          localFrame={frame - text3Start}
          duration={text3Duration}
          fontSize={54}
          color="#F5E6C8"
          top="85%"
        />
      )}
    </AbsoluteFill>
  );
};
