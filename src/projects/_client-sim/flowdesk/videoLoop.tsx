import React from "react";
import { Sequence, OffthreadVideo, useCurrentFrame, interpolate, Img, staticFile } from "remotion";

// OffthreadVideo natif Remotion n'a pas de prop `loop` (contrairement a @remotion/media,
// non installe dans ce repo -- seulement media-parser/media-utils). Boucle geree a la main :
// N <Sequence> consecutives qui rejouent le meme clip, avec crossfade discret aux jonctions
// pour eviter un cut sec repete (valide Aziz : "boucler le clip" plutot que ralentir/figer).
export const LoopedVideo: React.FC<{
  src: string;
  clipDurationFrames: number;
  totalDurationFrames: number;
  crossfadeFrames?: number;
  style?: React.CSSProperties;
  muted?: boolean;
}> = ({ src, clipDurationFrames, totalDurationFrames, crossfadeFrames = 10, style, muted }) => {
  const loops = Math.ceil(totalDurationFrames / clipDurationFrames);
  return (
    <>
      {Array.from({ length: loops }, (_, i) => {
        const from = i * clipDurationFrames;
        const duration = Math.min(clipDurationFrames, totalDurationFrames - from);
        if (duration <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={duration} layout="none">
            <CrossfadeIn active={i > 0} frames={crossfadeFrames}>
              <OffthreadVideo src={src} style={style} muted={muted ?? true} />
            </CrossfadeIn>
          </Sequence>
        );
      })}
    </>
  );
};

const CrossfadeIn: React.FC<{ active: boolean; frames: number; children: React.ReactNode }> = ({
  active,
  frames,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = active
    ? interpolate(frame, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return <div style={{ opacity, width: "100%", height: "100%" }}>{children}</div>;
};

// Sequence PNG avec alpha (ex: chroma-key extrait via ffmpeg, cf panel2-frames -- webm+VP9 alpha
// s'est revele peu fiable sur cet environnement, canal alpha silencieusement perdu a l'export
// malgre des logs ffmpeg corrects -- verifie 2026-08-05 : mode RGB au lieu de RGBA en sortie).
// `frameFilePattern` = fonction (frameIndex 1-based) -> chemin staticFile, `sourceFps` = fps
// natif de la sequence source (peut differer du fps de la composition -- ex clip 24fps dans
// une comp 30fps), boucle en continu sur toute `totalDurationFrames` (frames de la COMPOSITION).
export const LoopedImageSequence: React.FC<{
  frameFilePattern: (frameIndex: number) => string;
  frameCount: number;
  sourceFps: number;
  compositionFps: number;
  style?: React.CSSProperties;
}> = ({ frameFilePattern, frameCount, sourceFps, compositionFps, style }) => {
  const frame = useCurrentFrame();
  // frame de la comp -> position temporelle -> frame source (gere le ratio de fps)
  const timeSeconds = frame / compositionFps;
  const sourceFrameFloat = (timeSeconds * sourceFps) % frameCount;
  const sourceFrameIndex = (Math.floor(sourceFrameFloat) % frameCount) + 1; // 1-based
  return (
    <Img src={staticFile(frameFilePattern(sourceFrameIndex))} style={style} />
  );
};
