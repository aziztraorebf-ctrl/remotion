import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface StatSide {
  entity: string;
  stat: string;
  label: string;
  startFrame: number;
  side: "left" | "right";
}

interface DualStatProps {
  title: string;
  subtitle?: string;
  entityA: StatSide;
  entityB: StatSide;
  dividerStartFrame?: number;
}

// Hauteurs fixes 9:16 (1080x1920)
// Centre optique ~45% = 864px. Bloc contenu ~300px -> top zone = 864 - 150 = 714
const TITLE_TOP   = 160;
// Zone split centrée sur y=960 (milieu écran) : top = 960 - 500 = 460, height=1000
const SPLIT_TOP   = 460;
const SPLIT_H     = 1000;
const FOOTER_BOT  = 100;

const StatCard: React.FC<{ side: StatSide }> = ({ side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - side.startFrame);
  const progress = spring({ fps, frame: elapsed, config: { damping: 90, stiffness: 60 } });

  const translateX = interpolate(
    progress,
    [0, 1],
    [side.side === "left" ? -200 : 200, 0],
    { extrapolateRight: "clamp" }
  );
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.8, 1], { extrapolateRight: "clamp" });

  return (
    <div
      className="flex flex-col items-center"
      style={{
        position: "absolute",
        top: "50%",
        width: "50%",
        left: side.side === "left" ? 0 : "50%",
        transform: `translateX(${translateX}px) translateY(-50%)`,
        opacity,
        paddingLeft: side.side === "right" ? 24 : 0,
        paddingRight: side.side === "left" ? 24 : 0,
      }}
    >
      <span
        className="text-ivory font-bold uppercase text-center"
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: 60,
          letterSpacing: "0.1em",
          marginBottom: 16,
          lineHeight: 1.1,
        }}
      >
        {side.entity}
      </span>
      <span
        className="text-gold font-bold"
        style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 160,
          lineHeight: 1,
        }}
      >
        {side.stat}
      </span>
      <span
        className="text-slate"
        style={{
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: 44,
          marginTop: 12,
        }}
      >
        {side.label}
      </span>
    </div>
  );
};

export const DualStat: React.FC<DualStatProps> = ({
  title,
  subtitle,
  entityA,
  entityB,
  dividerStartFrame = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerProgress = spring({
    fps,
    frame: Math.max(0, frame - dividerStartFrame),
    config: { damping: 100, stiffness: 50 },
  });
  const dividerHeight = interpolate(
    Math.min(1, Math.max(0, dividerProgress)),
    [0, 1],
    [0, SPLIT_H],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill>
      {/* Titre */}
      <div
        className="absolute left-0 right-0 flex flex-col items-center"
        style={{ top: TITLE_TOP, opacity: titleOpacity }}
      >
        <span
          className="text-gold font-bold uppercase text-center"
          style={{
            fontFamily: "Cinzel, serif",
            fontSize: 38,
            letterSpacing: "0.2em",
          }}
        >
          {title}
        </span>
        <div className="w-20 h-0.5 bg-gold mt-4" />
      </div>

      {/* Zone split — hauteur fixe, centrée sur le centre optique */}
      <div
        className="absolute left-0 right-0"
        style={{ top: SPLIT_TOP, height: SPLIT_H }}
      >
        {/* Diviseur vertical — hors flux, draw top->bottom */}
        <div
          className="absolute bg-gold"
          style={{
            left: "50%",
            top: 0,
            width: 2,
            height: dividerHeight,
            transform: "translateX(-50%)",
          }}
        />

        {/* Cards absolues dans la zone */}
        <StatCard side={{ ...entityA, side: "left" }} />
        <StatCard side={{ ...entityB, side: "right" }} />
      </div>

      {/* Footer */}
      {subtitle && (
        <div
          className="absolute left-0 right-0 text-center"
          style={{ bottom: FOOTER_BOT, opacity: titleOpacity }}
        >
          <span
            className="text-slate"
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: 28,
              letterSpacing: "0.05em",
            }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
