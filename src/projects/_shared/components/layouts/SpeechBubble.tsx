import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface QuoteLine {
  text: string;
  highlight: boolean;
}

interface SpeechBubbleProps {
  quoteLines: QuoteLine[];
  speaker: string;
  speakerDetail: string;
  portraitSrc: string;
  startFrame: number;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  quoteLines,
  speaker,
  speakerDetail,
  portraitSrc,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;

  // Bubble reveal
  const bubbleProgress = spring({
    frame: relFrame,
    fps,
    config: { damping: 80, stiffness: 50 },
  });
  const bubbleOpacity = interpolate(bubbleProgress, [0, 1], [0, 1]);
  const bubbleTranslateY = interpolate(bubbleProgress, [0, 1], [-28, 0]);
  const bubbleScale = interpolate(bubbleProgress, [0, 1], [0.96, 1]);

  // Portrait reveal
  const portraitProgress = spring({
    frame: relFrame - 8,
    fps,
    config: { damping: 70, stiffness: 35 },
  });
  const portraitOpacity = interpolate(portraitProgress, [0, 1], [0, 1]);
  const portraitTranslateX = interpolate(portraitProgress, [0, 1], [-40, 0]);

  // Attribution fade
  const attributionProgress = spring({
    frame: relFrame - 20,
    fps,
    config: { damping: 80, stiffness: 40 },
  });
  const attributionOpacity = interpolate(attributionProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill className="bg-navy overflow-hidden">
      {/* Dots pattern overlay */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.055) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Portrait */}
      <div
        className="absolute bottom-0 left-0 z-10 grayscale"
        style={{
          width: "562px",
          height: "1382px",
          opacity: portraitOpacity,
          transform: `translateX(${portraitTranslateX}px)`,
        }}
      >
        <Img
          src={staticFile(portraitSrc)}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Speech bubble */}
      <div
        className="absolute z-20"
        style={{
          top: 88,
          right: 54,
          left: 270,
          opacity: bubbleOpacity,
          transform: `translateY(${bubbleTranslateY}px) scale(${bubbleScale})`,
          border: "2px solid #c8a951",
          borderRadius: "12px",
          backgroundColor: "rgba(26, 37, 64, 0.92)",
          padding: "40px 44px",
        }}
      >
        {/* Quote lines */}
        <div className="flex flex-col">
          {quoteLines.map((line, index) => {
            const lineProgress = spring({
              frame: relFrame - 4 - index * 3,
              fps,
              config: { damping: 90, stiffness: 60 },
            });
            const lineOpacity = interpolate(lineProgress, [0, 1], [0, 1]);
            const lineTranslateX = interpolate(lineProgress, [0, 1], [-12, 0]);

            return (
              <p
                key={index}
                style={{
                  fontFamily: "Cinzel, serif",
                  fontSize: "68px",
                  lineHeight: "1.18",
                  margin: 0,
                  opacity: lineOpacity,
                  transform: `translateX(${lineTranslateX}px)`,
                }}
              >
                {line.highlight ? (
                  <span className="text-gold font-bold">{line.text}</span>
                ) : (
                  <span className="text-ivory">{line.text}</span>
                )}
              </p>
            );
          })}
        </div>

        {/* Attribution */}
        <div
          className="mt-6 flex flex-col items-end"
          style={{ opacity: attributionOpacity }}
        >
          <span
            className="text-ivory"
            style={{ fontFamily: "Cinzel, serif", fontSize: "36px", opacity: 0.8 }}
          >
            {speaker}
          </span>
          <span
            className="text-slate"
            style={{ fontFamily: "Cinzel, serif", fontSize: "28px" }}
          >
            {speakerDetail}
          </span>
        </div>

        {/* Bubble tail — outer gold */}
        <div
          className="absolute"
          style={{
            bottom: -32,
            left: 60,
            width: 0,
            height: 0,
            borderLeft: "18px solid transparent",
            borderRight: "18px solid transparent",
            borderTop: "32px solid #c8a951",
          }}
        />
        {/* Bubble tail — inner navy */}
        <div
          className="absolute"
          style={{
            bottom: -29,
            left: 62,
            width: 0,
            height: 0,
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "30px solid rgba(26, 37, 64, 0.92)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
