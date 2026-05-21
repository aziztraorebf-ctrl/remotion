import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const NARRATION_DURATION_S = 24.8;
const TOTAL_DURATION_S = 30;

export const POC_MONEY_LEGENDS_FRAMES = Math.ceil(TOTAL_DURATION_S * FPS);

// Timing (frames)
const T = {
  TEXT_CARD_1_IN: 0,
  TEXT_CARD_1_OUT: 4 * FPS,
  LOGOS_IN: 4 * FPS,
  LOGOS_OUT: 9 * FPS,
  PHOTO_IN: 9 * FPS,
  PHOTO_OUT: 17 * FPS,
  HIGHLIGHT_IN: 17 * FPS,
  HIGHLIGHT_OUT: 22 * FPS,
  FINAL_CARD_IN: 22 * FPS,
  FINAL_CARD_OUT: POC_MONEY_LEGENDS_FRAMES,
};

// --- Shared grid background ---
const GridBackground: React.FC<{ color?: string }> = ({ color = "#111111" }) => (
  <AbsoluteFill
    style={{
      backgroundColor: color,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "48px 48px",
    }}
  />
);

// --- Text card: white bold text on grid ---
const TextCard: React.FC<{ lines: string[]; color?: string }> = ({
  lines,
  color = "white",
}) => {
  const frame = useCurrentFrame();
  const opacity = spring({ frame, fps: FPS, config: { damping: 200 } });
  const y = interpolate(spring({ frame, fps: FPS, config: { damping: 80 } }), [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: 64,
              fontWeight: 900,
              fontFamily: "Arial Black, Impact, sans-serif",
              color,
              lineHeight: 1.15,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// --- Logo cascade: icons appearing one by one ---
const LogoCascade: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { emoji: "🐪", label: "80 CARAVANES" },
    { emoji: "👑", label: "MANSA MOUSSA" },
    { emoji: "⚖️", label: "MARCHÉ DU CAIRE" },
    { emoji: "📉", label: "−12 ANS" },
  ];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          padding: "0 60px",
        }}
      >
        {items.map((item, i) => {
          const delay = i * 12;
          const localFrame = Math.max(0, frame - delay);
          const scale = spring({ frame: localFrame, fps, config: { damping: 120, stiffness: 300 } });
          const opacity = interpolate(localFrame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

          return (
            <div
              key={i}
              style={{
                opacity,
                transform: `scale(${scale})`,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 56 }}>{item.emoji}</span>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  fontFamily: "Arial Black, sans-serif",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: "center",
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Ken Burns photo in white frame ---
const PhotoFrame: React.FC<{ src: string; caption: string }> = ({ src, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 8 * fps], [1.0, 1.08], { extrapolateRight: "clamp" });

  const captionIn = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" });
  const captionY = interpolate(frame, [20, 35], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeIn, width: "90%", maxWidth: 900, position: "relative" }}>
        <div
          style={{
            border: "8px solid white",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            aspectRatio: "16/9",
            position: "relative",
          }}
        >
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            backgroundColor: "#CC0000",
            padding: "14px 24px",
            opacity: captionIn,
            transform: `translateY(${captionY}px)`,
          }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {caption}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Highlight text (simulated source document) ---
const HighlightSource: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const highlightWidth = interpolate(frame, [15, 40], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "60px" }}>
      <div
        style={{
          opacity: fadeIn,
          backgroundColor: "#f5f0e8",
          border: "3px solid #ccc",
          borderRadius: 8,
          padding: "48px 56px",
          maxWidth: 860,
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontFamily: "serif",
            color: "#888",
            marginBottom: 20,
            letterSpacing: "0.1em",
          }}
        >
          AL-UMARI — MASALIK AL-ABSAR, ~1337
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: "Georgia, serif",
            color: "#222",
            lineHeight: 1.7,
            position: "relative",
          }}
        >
          <span>Ce sultan est le plus puissant des rois Soudanais. </span>
          <span style={{ position: "relative", display: "inline" }}>
            <span
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "100%",
                width: `${highlightWidth}%`,
                backgroundColor: "rgba(255, 220, 0, 0.55)",
                borderRadius: 2,
              }}
            />
            <span style={{ position: "relative" }}>
              Son pays est le plus grand, le plus abondant en or et le plus prospère.
            </span>
          </span>
          <span> Son arrivée au Caire provoqua une chute du prix de l'or pendant douze ans.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Final card with red banner ---
const FinalCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const bannerScale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 120, stiffness: 280 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeIn, textAlign: "center", padding: "0 80px" }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            fontFamily: "Arial Black, sans-serif",
            color: "white",
            textTransform: "uppercase",
            lineHeight: 1.2,
            marginBottom: 40,
          }}
        >
          IL N'AVAIT FAIT{"\n"}QUE PASSER.
        </div>
        <div
          style={{
            transform: `scale(${bannerScale})`,
            backgroundColor: "#CC0000",
            padding: "20px 48px",
            display: "inline-block",
          }}
        >
          <span
            style={{
              fontSize: 38,
              fontWeight: 900,
              fontFamily: "Arial Black, sans-serif",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            EN VACANCES.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Main composition ---
export const PocMoneyLegends: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const musicVolume = (f: number) =>
    interpolate(f, [0, fps * 2, NARRATION_DURATION_S * fps, POC_MONEY_LEGENDS_FRAMES], [0, 0.12, 0.12, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <AbsoluteFill style={{ backgroundColor: "#111111", fontFamily: "Arial Black, sans-serif" }}>
      <Audio src={staticFile("poc-money-legends/audio/music-v1.mp3")} volume={musicVolume} />
      <Audio src={staticFile("poc-money-legends/audio/narration-v1.mp3")} volume={1} />

      {/* Beat 1 — Text card hook */}
      <Sequence from={T.TEXT_CARD_1_IN} durationInFrames={T.TEXT_CARD_1_OUT - T.TEXT_CARD_1_IN}>
        <GridBackground />
        <TextCard lines={["Un seul homme", "a effondré", "l'économie mondiale.", "En vacances."]} />
      </Sequence>

      {/* Beat 2 — Logo cascade */}
      <Sequence from={T.LOGOS_IN} durationInFrames={T.LOGOS_OUT - T.LOGOS_IN}>
        <GridBackground color="#0a0a0a" />
        <LogoCascade />
      </Sequence>

      {/* Beat 3 — Photo Ken Burns + bandeau rouge */}
      <Sequence from={T.PHOTO_IN} durationInFrames={T.PHOTO_OUT - T.PHOTO_IN} premountFor={fps}>
        <GridBackground color="#0d0d0d" />
        <PhotoFrame
          src={staticFile("poc-money-legends/assets/mansa-musa-caravan.png")}
          caption="80 caravanes · 12 000 serviteurs · 500 kg d'or chacun"
        />
      </Sequence>

      {/* Beat 4 — Source highlight */}
      <Sequence from={T.HIGHLIGHT_IN} durationInFrames={T.HIGHLIGHT_OUT - T.HIGHLIGHT_IN}>
        <GridBackground color="#0a0a0a" />
        <HighlightSource />
      </Sequence>

      {/* Beat 5 — Final card + red banner */}
      <Sequence from={T.FINAL_CARD_IN} durationInFrames={T.FINAL_CARD_OUT - T.FINAL_CARD_IN}>
        <GridBackground />
        <FinalCard />
      </Sequence>
    </AbsoluteFill>
  );
};
