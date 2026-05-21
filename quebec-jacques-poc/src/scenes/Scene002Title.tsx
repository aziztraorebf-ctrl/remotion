import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const LETTERS = ["9", "faits", "incroyables", "sur", "le", "Québec"];

export const Scene002Title: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  return (
    <AbsoluteFill style={{ backgroundColor: "#003399", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
        {LETTERS.map((word, i) => {
          const wordScale = spring({
            frame: localFrame - i * 3,
            fps,
            config: { damping: 10, stiffness: 300, mass: 0.5 },
          });
          const wordRotation = interpolate(Math.max(0, localFrame - i * 3), [0, 8], [
            (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 6 + 2),
            (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 4 + 1),
          ], { extrapolateRight: "clamp" });

          const isNumber = word === "9";

          return (
            <div
              key={i}
              style={{
                transform: `scale(${wordScale}) rotate(${wordRotation}deg)`,
                backgroundColor: isNumber ? "#cc0000" : "white",
                color: isNumber ? "white" : "#003399",
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                fontWeight: "900",
                fontSize: isNumber ? 96 : 48,
                padding: isNumber ? "8px 20px" : "6px 14px",
                border: `4px solid ${isNumber ? "white" : "#003399"}`,
                borderRadius: 4,
                letterSpacing: "-0.02em",
                boxShadow: "3px 3px 0px rgba(0,0,0,0.4)",
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
