import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface BarRaceProps {
  title?: string;
  data?: Array<{ label: string; value: number; suffix: string }>;
  maxValue?: number;
  subtitle?: string;
}

const STAGGER_PER_BAR = 12;
const COUNT_UP_FRAMES = 45;
const BAR_SPRING_CONFIG = { damping: 16, stiffness: 90 };
const ENTRY_SPRING_CONFIG = { damping: 14, stiffness: 100 };
// Bar zone = 68% of total row width after label bloc (180px) and value
const BAR_MAX_WIDTH_PCT = 62;
const BAR_HEIGHT = 120;
const LABEL_WIDTH = 200;

interface BarItemProps {
  label: string;
  value: number;
  suffix: string;
  maxValue: number;
  triggerFrame: number;
  isTop: boolean;
  fps: number;
}

const BarItem: React.FC<BarItemProps> = ({
  label,
  value,
  maxValue,
  suffix,
  triggerFrame,
  isTop,
  fps,
}) => {
  const frame = useCurrentFrame();
  const localFrame = Math.max(0, frame - triggerFrame);

  const entryProgress = spring({ frame: localFrame, fps, config: ENTRY_SPRING_CONFIG });
  const barProgress = spring({ frame: localFrame, fps, config: BAR_SPRING_CONFIG });

  const barWidthPercent = interpolate(
    barProgress,
    [0, 1],
    [0, (value / maxValue) * BAR_MAX_WIDTH_PCT],
    { extrapolateRight: "clamp" }
  );

  const countUpValue = Math.round(
    interpolate(frame, [triggerFrame, triggerFrame + COUNT_UP_FRAMES], [0, value], {
      extrapolateRight: "clamp",
    })
  );

  const opacity = interpolate(entryProgress, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(entryProgress, [0, 1], [-40, 0], { extrapolateRight: "clamp" });

  return (
    <div
      className="flex flex-row items-center w-full"
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        paddingLeft: 40,
        paddingRight: 40,
        height: BAR_HEIGHT,
      }}
    >
      {/* Label bloc crème */}
      <div
        style={{
          backgroundColor: "#f5efe0",
          color: "#0d1420",
          width: LABEL_WIDTH,
          height: BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          paddingLeft: 22,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          fontFamily: "Cinzel, serif",
          fontSize: 42,
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        {label}
      </div>

      {/* Barre dorée — colle directement au bloc crème */}
      <div
        style={{
          width: `${barWidthPercent}%`,
          height: BAR_HEIGHT,
          background: "linear-gradient(90deg, #e5c370 0%, #b8862d 100%)",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          boxShadow: isTop ? "0 0 32px 12px rgba(229,195,112,0.5)" : "none",
          flexShrink: 0,
          transition: "none",
        }}
      />

      {/* Valeur countUp */}
      <div
        style={{
          color: "#f5efe0",
          fontFamily: '"IBM Plex Mono", "Space Mono", monospace',
          fontSize: 56,
          fontWeight: 400,
          marginLeft: 28,
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {countUpValue}{suffix}
      </div>
    </div>
  );
};

export const BarRace: React.FC<BarRaceProps> = ({
  title = "PRODUCTION ANNUELLE",
  data = [
    { label: "Nigeria", value: 340, suffix: "Md" },
    { label: "Angola", value: 240, suffix: "Md" },
    { label: "Ghana", value: 160, suffix: "Md" },
    { label: "Congo", value: 88, suffix: "Md" },
  ],
  maxValue = 340,
  subtitle = "en milliards USD · 2023",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: ENTRY_SPRING_CONFIG });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const titleTranslateY = interpolate(titleSpring, [0, 1], [-20, 0], { extrapolateRight: "clamp" });

  const subtitleDelay = data.length * STAGGER_PER_BAR + COUNT_UP_FRAMES;
  const subtitleSpring = spring({
    frame: Math.max(0, frame - subtitleDelay),
    fps,
    config: ENTRY_SPRING_CONFIG,
  });
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0d1420",
        backgroundImage: "radial-gradient(rgba(212,175,55,0.42) 1.5px, transparent 1.5px)",
        backgroundSize: "30px 30px",
      }}
    >
      {/* Layout full-height flex — titre haut, barres centrées, footer bas */}
      <div className="flex flex-col w-full h-full">

        {/* Titre — zone fixe en haut */}
        <div
          className="w-full text-center shrink-0"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 56,
            color: "#c8a951",
            letterSpacing: "0.2em",
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
            paddingTop: 140,
            paddingBottom: 60,
            padding: "140px 40px 60px",
          }}
        >
          {title}
        </div>

        {/* Barres — flex-1 pour occuper tout l'espace restant, justify-evenly */}
        <div className="flex flex-col flex-1 justify-evenly">
          {data.map((item, i) => (
            <BarItem
              key={item.label}
              label={item.label}
              value={item.value}
              suffix={item.suffix}
              maxValue={maxValue}
              triggerFrame={i * STAGGER_PER_BAR}
              isTop={i === 0}
              fps={fps}
            />
          ))}
        </div>

        {/* Footer — ancré en bas */}
        <div
          className="flex flex-col items-center shrink-0"
          style={{
            paddingBottom: 120,
            gap: 20,
            opacity: subtitleOpacity,
          }}
        >
          <div
            style={{
              width: 400,
              height: 3,
              background: "linear-gradient(90deg, #a88e40, #c8a951)",
              borderRadius: 2,
            }}
          />
          <div
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: 38,
              color: "#9a8a6a",
              letterSpacing: "0.06em",
              textAlign: "center",
            }}
          >
            {subtitle}
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
