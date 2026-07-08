// AesShortFull — vidéo COMPLETE 92s (2756f @30fps). Assemble Part1 (0-36s) + Part2 (36-92s) en une
// seule composition. Audio UNIQUE sur toute la duree. Les 2 parties sont rendues sans audio (noAudio).
//
// Transition a 36s : Part1 finit sur le cadre large (trio+Libye), Part2 demarre sur le trio zoome (Libye
// retiree). On fait un CROSSFADE court (~14f) entre les deux -> l'oeil accepte le leger changement de
// cadrage comme une transition douce (pas un saut de zoom sec).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AesShortPart1 } from "./AesShortPart1";
import { AesShortPart2 } from "./AesShortPart2";

const FPS = 30;
const SPLIT = 36 * FPS; // 1080 : fin Part1 / debut Part2
const XFADE = 14; // frames de crossfade a la jointure

export const AesShortFull: React.FC = () => {
  const frame = useCurrentFrame();

  // opacites de crossfade autour de SPLIT
  const p1Op = interpolate(frame, [SPLIT - XFADE, SPLIT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2Op = interpolate(frame, [SPLIT - XFADE, SPLIT], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1e2d52" }}>
      {/* AUDIO unique */}
      <Audio src={staticFile("_shared/audio/sahel-warmap/short-90s-v1.mp3")} />

      {/* PART 1 (0 -> 36s + petit debord pour le crossfade) */}
      {frame < SPLIT + 2 && (
        <AbsoluteFill style={{ opacity: p1Op }}>
          <Sequence from={0} durationInFrames={SPLIT + XFADE}>
            <AesShortPart1 noAudio />
          </Sequence>
        </AbsoluteFill>
      )}

      {/* PART 2 (36s -> 92s) */}
      {frame >= SPLIT - XFADE && (
        <AbsoluteFill style={{ opacity: p2Op }}>
          <Sequence from={SPLIT} durationInFrames={2756 - SPLIT}>
            <AesShortPart2 noAudio />
          </Sequence>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default AesShortFull;
