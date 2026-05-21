import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  src: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  rotation?: number;
  startFrame: number;
  exitFrame?: number;
  borderRadius?: number;
  shadowBlur?: number;
  caption?: string;
};

export const PhotoVignette: React.FC<Props> = ({
  src,
  x,
  y,
  width,
  height,
  rotation = -4,
  startFrame,
  exitFrame,
  borderRadius = 10,
  shadowBlur = 24,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const enterScale = spring({
    frame: local,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.7 },
  });

  let exitOpacity = 1;
  if (exitFrame !== undefined) {
    exitOpacity = interpolate(
      frame,
      [exitFrame, exitFrame + 15],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  if (local < 0) return null;

  const h = height ?? Math.round(width * 1.25);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height: h,
          transform: `translate(-50%, -50%) scale(${enterScale}) rotate(${rotation}deg)`,
          transformOrigin: "center center",
          opacity: exitOpacity,
          background: "#FFFFFF",
          padding: 8,
          borderRadius,
          boxShadow: `0 ${shadowBlur / 3}px ${shadowBlur}px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)`,
        }}
      >
        <Img
          src={src}
          style={{
            width: "100%",
            height: caption ? `calc(100% - 36px)` : "100%",
            objectFit: "cover",
            borderRadius: borderRadius - 4,
            display: "block",
          }}
        />
        {caption && (
          <div
            style={{
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Caveat, Georgia, serif",
              fontWeight: 700,
              fontSize: 22,
              color: "#1a1a1a",
            }}
          >
            {caption}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
