import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MAP_URL = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/-71.5,52,3.5,0,0/1280x720?access_token=${MAPBOX_TOKEN}`;

export const Scene001Intro: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const quizScale = spring({ frame: localFrame - fps * 5, fps, config: { damping: 8, stiffness: 200 } });
  const charOpacity = interpolate(localFrame, [fps * 2, fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photo1Opacity = interpolate(localFrame, [fps * 1, fps * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const photo2Opacity = interpolate(localFrame, [fps * 3, fps * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#89cff0" }}>
      {MAPBOX_TOKEN && (
        <img
          src={MAP_URL}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,51,153,0.3) 0%, rgba(0,0,0,0.1) 100%)",
      }} />

      {/* Thinking character */}
      <div style={{
        position: "absolute", left: 80, bottom: 120,
        opacity: charOpacity,
        transform: `scale(${charOpacity})`,
      }}>
        <Img src={staticFile("assets/images/thinking-character.png")} style={{ width: 180, height: 180 }} />
      </div>

      {/* Floating photo placeholders */}
      <div style={{
        position: "absolute", right: 140, top: 120,
        opacity: photo1Opacity,
        transform: `rotate(-8deg) scale(${photo1Opacity})`,
        backgroundColor: "white", borderRadius: 12, padding: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        width: 180, height: 120,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#003399", fontSize: 14, fontFamily: "Helvetica Neue, Arial, sans-serif", fontWeight: "bold" }}>
          500 000 lacs
        </span>
      </div>

      <div style={{
        position: "absolute", right: 80, top: 280,
        opacity: photo2Opacity,
        transform: `rotate(5deg) scale(${photo2Opacity})`,
        backgroundColor: "white", borderRadius: 12, padding: 8,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        width: 180, height: 120,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#003399", fontSize: 14, fontFamily: "Helvetica Neue, Arial, sans-serif", fontWeight: "bold" }}>
          Baleines dans un fjord
        </span>
      </div>

      {/* QUIZ bubble */}
      <div style={{
        position: "absolute", left: "50%", top: 80,
        transform: `translateX(-50%) scale(${quizScale})`,
        transformOrigin: "50% 50%",
      }}>
        <Img src={staticFile("assets/images/quiz-bubble.png")} style={{ width: 260, height: 200 }} />
      </div>
    </AbsoluteFill>
  );
};
