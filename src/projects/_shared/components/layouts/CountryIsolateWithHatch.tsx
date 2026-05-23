import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

export interface CountryIsolateWithHatchProps {
  countryName?: string;
  countryPath?: string;
  zonePath?: string;
  statValue?: string;
  statLabel?: string;
  badge?: string;
  badgeX?: number;
  badgeY?: number;
  fillColor?: string;
  hatchColor?: string;
  bgColor?: string;
  startFrame?: number;
}

const DEFAULT_COUNTRY_PATH =
  "M 180 80 L 220 75 L 260 90 L 280 110 L 290 140 L 285 170 L 275 200 L 260 220 L 240 230 L 210 235 L 180 225 L 160 210 L 150 190 L 145 165 L 150 140 L 160 115 Z";

const DEFAULT_ZONE_PATH =
  "M 200 220 L 240 215 L 270 225 L 290 250 L 295 280 L 285 300 L 260 310 L 230 305 L 205 290 L 195 265 Z";

export const CountryIsolateWithHatch: React.FC<CountryIsolateWithHatchProps> = ({
  countryName = "SENEGAL",
  countryPath = DEFAULT_COUNTRY_PATH,
  zonePath = DEFAULT_ZONE_PATH,
  statValue = "2.4 MDS $",
  statLabel = "PRODUCTION ANNUELLE",
  badge = "SANGOMAR",
  badgeX = 0.6,
  badgeY = 0.45,
  fillColor = "#c8a951",
  hatchColor = "rgba(74,158,255,0.4)",
  bgColor = "transparent",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const f = frame - startFrame;

  // --- Country fill: frames 0-25 ---
  const countryScale = spring({
    frame: f,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
    durationInFrames: 25,
  });
  const countryOpacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Hatch zone: frames 20-40 ---
  const hatchOpacity = interpolate(f, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Badge pin: frames 35-55 ---
  const badgeScale = spring({
    frame: Math.max(0, f - 35),
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.7 },
    durationInFrames: 20,
  });
  const badgeOpacity = interpolate(f, [35, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Badge pulse after appearing
  const badgePulse = interpolate(
    f,
    [55, 65, 75],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const badgeScaleFinal = f < 55 ? badgeScale : badgePulse;

  // --- Stat value: frames 50-70 ---
  const statOpacity = interpolate(f, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const statTranslateY = interpolate(f, [50, 70], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Country name: frames 5-25 ---
  const nameOpacity = interpolate(f, [5, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameTranslateY = interpolate(f, [5, 25], [-16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SVG viewBox is 400x400; we render it centered, ~52% of height
  const svgSize = height * 0.52;
  const svgLeft = (width - svgSize) / 2;
  const svgTop = (height - svgSize) / 2 - height * 0.04;

  // Badge position in absolute px
  const badgePxX = svgLeft + badgeX * svgSize;
  const badgePxY = svgTop + badgeY * svgSize;

  // Scan line: loops top-to-bottom over 60 frames
  const scanProgress = (f % 60) / 60;
  const scanY = svgTop + scanProgress * svgSize;

  const hatchPatternId = "hatch-pattern-zone";
  const hatchStrokeColor = hatchColor;

  // Crosshair corner size
  const cornerLen = 10;
  const cornerThick = 1.5;

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      }}
    >
      {/* Country name — top */}
      <div
        style={{
          position: "absolute",
          top: height * 0.08,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: nameOpacity,
          transform: `translateY(${nameTranslateY}px)`,
        }}
      >
        <span
          style={{
            color: "#c8a951",
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textShadow: "0 2px 24px rgba(0,0,0,0.55)",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          }}
        >
          {countryName}
        </span>
      </div>

      {/* SVG map layer */}
      <div
        style={{
          position: "absolute",
          left: svgLeft,
          top: svgTop,
          width: svgSize,
          height: svgSize,
        }}
      >
        <svg
          viewBox="0 0 400 400"
          width={svgSize}
          height={svgSize}
          style={{ overflow: "visible" }}
        >
          <defs>
            <pattern
              id={hatchPatternId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke={hatchStrokeColor}
                strokeWidth="2"
              />
            </pattern>

            {/* Drop shadow filter */}
            <filter id="country-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="8"
                floodColor="rgba(0,0,0,0.45)"
              />
            </filter>

            {/* Glow filter for country */}
            <filter id="country-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Hatch zone (offshore/contested area) */}
          <path
            d={zonePath}
            fill={`url(#${hatchPatternId})`}
            stroke={hatchColor}
            strokeWidth="1.5"
            style={{ opacity: hatchOpacity }}
          />

          {/* Country fill */}
          <path
            d={countryPath}
            fill={fillColor}
            stroke="rgba(200,169,81,0.6)"
            strokeWidth="1.5"
            filter="url(#country-shadow)"
            style={{
              opacity: countryOpacity,
              transformOrigin: "200px 155px",
              transform: `scale(${countryScale})`,
            }}
          />

          {/* Country inner highlight */}
          <path
            d={countryPath}
            fill="none"
            stroke="rgba(255,235,160,0.25)"
            strokeWidth="3"
            style={{
              opacity: countryOpacity,
              transformOrigin: "200px 155px",
              transform: `scale(${countryScale})`,
            }}
          />
        </svg>
      </div>

      {/* Scan line — horizontal, loops top-to-bottom over SVG area */}
      <div
        style={{
          position: "absolute",
          left: svgLeft,
          top: scanY,
          width: svgSize,
          height: 1,
          background: "#4a9eff",
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      {/* Badge pin */}
      <div
        style={{
          position: "absolute",
          left: badgePxX,
          top: badgePxY,
          opacity: badgeOpacity,
          transform: `scale(${badgeScaleFinal})`,
          transformOrigin: "center bottom",
          pointerEvents: "none",
        }}
      >
        {/* Pin badge — epure */}
        <div
          style={{
            background: "rgba(26,37,53,0.92)",
            border: `1.5px solid ${fillColor}`,
            borderRadius: 4,
            padding: "5px 12px",
            whiteSpace: "nowrap",
            marginBottom: 4,
            filter: "drop-shadow(0 0 6px rgba(200,169,81,0.4))",
          }}
        >
          <span
            style={{
              color: fillColor,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            }}
          >
            {badge}
          </span>
        </div>
        {/* Pin triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: `10px solid ${fillColor}`,
            margin: "0 auto",
          }}
        />
        {/* Position dot — SVG circle at junction, matches fill color */}
        <svg
          width="10"
          height="10"
          style={{ display: "block", margin: "0 auto" }}
        >
          <circle cx="5" cy="5" r="4" fill={fillColor} />
        </svg>
      </div>

      {/* Stat block — bottom center */}
      <div
        style={{
          position: "absolute",
          bottom: height * 0.1,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: statOpacity,
          transform: `translateY(${statTranslateY}px)`,
        }}
      >
        {/* Divider line */}
        <div
          style={{
            width: 48,
            height: 2,
            background: "rgba(200,169,81,0.5)",
            marginBottom: 14,
          }}
        />
        {/* Stat value with crosshair corners */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <span
            style={{
              color: "#c8a951",
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: "0.04em",
              lineHeight: 1,
              textShadow: "0 2px 32px rgba(200,169,81,0.35)",
              fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
              display: "block",
              padding: `${cornerLen + 4}px ${cornerLen + 4}px`,
            }}
          >
            {statValue}
          </span>
          {/* Crosshair corners — 4 L-shapes */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Top-left */}
            <polyline
              points={`${cornerLen},0 0,0 0,${cornerLen}`}
              fill="none"
              stroke="rgba(200,169,81,0.7)"
              strokeWidth={cornerThick}
              vectorEffect="non-scaling-stroke"
            />
            {/* Top-right */}
            <polyline
              points={`${100 - cornerLen},0 100,0 100,${cornerLen}`}
              fill="none"
              stroke="rgba(200,169,81,0.7)"
              strokeWidth={cornerThick}
              vectorEffect="non-scaling-stroke"
            />
            {/* Bottom-left */}
            <polyline
              points={`${cornerLen},100 0,100 0,${100 - cornerLen}`}
              fill="none"
              stroke="rgba(200,169,81,0.7)"
              strokeWidth={cornerThick}
              vectorEffect="non-scaling-stroke"
            />
            {/* Bottom-right */}
            <polyline
              points={`${100 - cornerLen},100 100,100 100,${100 - cornerLen}`}
              fill="none"
              stroke="rgba(200,169,81,0.7)"
              strokeWidth={cornerThick}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <span
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
          }}
        >
          {statLabel}
        </span>
      </div>
    </AbsoluteFill>
  );
};

export default CountryIsolateWithHatch;
