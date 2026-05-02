import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MapPlatV3, type CameraKeyframe } from "../MapPlatV3";
import { QuebecFlagSilhouette } from "../QuebecFlagSilhouette";

// Scene 1 : 0 -> 8.539s = ~256 frames @ 30fps. Slow flat zoom-out on Quebec.
const KEYFRAMES: CameraKeyframe[] = [
  { frame: 0,   lon: -71, lat: 52, zoom: 4.5 },
  { frame: 130, lon: -73, lat: 55, zoom: 3.5 },
  { frame: 256, lon: -75, lat: 58, zoom: 2.6 },
];

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const interpolateCamera = (frame: number): CameraKeyframe => {
  if (frame <= KEYFRAMES[0].frame) return KEYFRAMES[0];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i];
    const b = KEYFRAMES[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const e = easeInOut(t);
      return {
        frame,
        lon: a.lon + (b.lon - a.lon) * e,
        lat: a.lat + (b.lat - a.lat) * e,
        zoom: a.zoom + (b.zoom - a.zoom) * e,
      };
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
};

const W = 1280;
const H = 720;

export const Scene001IntroV3: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const cam = interpolateCamera(localFrame);

  const hookOpacity = interpolate(
    localFrame,
    [10, 30, 90, 110],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const quizScale = spring({
    frame: localFrame - 180,
    fps,
    config: { damping: 7, stiffness: 220, mass: 0.6 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8d4e8" }}>
      <MapPlatV3 keyframes={KEYFRAMES} startFrame={startFrame} />

      <QuebecFlagSilhouette
        mapLon={cam.lon}
        mapLat={cam.lat}
        mapZoom={cam.zoom}
        mapW={W}
        mapH={H}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 80,
          transform: `translateX(-50%) scale(${0.9 + hookOpacity * 0.1})`,
          opacity: hookOpacity,
          fontFamily: "Helvetica Neue, Arial Black, sans-serif",
          fontWeight: 900,
          fontSize: 52,
          color: "white",
          textShadow:
            "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          whiteSpace: "nowrap",
        }}
      >
        Vous connaissez le Québec ?
      </div>

      {localFrame >= 180 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${quizScale}) rotate(-8deg)`,
            fontFamily: "Helvetica Neue, Arial Black, sans-serif",
            fontWeight: 900,
            fontSize: 140,
            color: "#FFD800",
            textShadow:
              "5px 5px 0 #cc0000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 30px rgba(0,0,0,0.7)",
            letterSpacing: "0.05em",
          }}
        >
          QUIZ !
        </div>
      )}
    </AbsoluteFill>
  );
};
