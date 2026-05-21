import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const MAP_URL = MAPBOX_TOKEN
  ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-70.5,47,5.5,0,0/1280x720?access_token=${MAPBOX_TOKEN}`
  : "";

const VERTEBRA_COUNT = 8;

export const Scene004River: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  const titleOpacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(localFrame, [0, 15], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#001a4d" }}>
      {MAPBOX_TOKEN && (
        <img
          src={MAP_URL}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
      )}

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,26,77,0.6) 100%)",
      }} />

      {/* Chapter indicator */}
      <div style={{
        position: "absolute", top: 20, left: 20,
        backgroundColor: "#cc0000",
        color: "white",
        fontFamily: "Helvetica Neue, Arial, sans-serif",
        fontWeight: "900",
        fontSize: 32,
        padding: "4px 12px",
        border: "3px solid white",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.4)",
      }}>
        2
      </div>

      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0,
        textAlign: "center",
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <div style={{
          color: "white",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: "900",
          fontSize: 42,
          textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
        }}>
          Fait #2 : Le Fleuve Saint-Laurent
        </div>
      </div>

      {/* Spine vertebrae appearing along a river path */}
      {Array.from({ length: VERTEBRA_COUNT }).map((_, i) => {
        const triggerFrame = i * 12;
        const age = localFrame - triggerFrame;
        const scale = age >= 0
          ? spring({ frame: age, fps, config: { damping: 8, stiffness: 300 } })
          : 0;

        const xBase = 180 + i * 120;
        const yBase = 360 + Math.sin(i * 0.8) * 40;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: xBase,
              top: yBase,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${i * 15}deg)`,
            }}
          >
            <Img
              src={staticFile("assets/images/spine-vertebra.png")}
              style={{ width: 70, height: 70, objectFit: "contain" }}
            />
          </div>
        );
      })}

      {/* Subtitle text */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        textAlign: "center",
        opacity: interpolate(localFrame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{
          color: "white",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: "700",
          fontSize: 28,
          fontStyle: "italic",
          textShadow: "1px 1px 6px rgba(0,0,0,0.9)",
        }}>
          "La colonne vertébrale du Québec"
        </div>
      </div>
    </AbsoluteFill>
  );
};
