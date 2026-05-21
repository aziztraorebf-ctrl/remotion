import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

// ─── Constants ────────────────────────────────────────────────────────────────

const SHAPE_SIZE = 780;
const SHAPE_TOP = 290;
const SHAPE_LEFT = 150;
const TEXT_TOP = 1100;
const HEXAGON_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const RING_PADDING = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PortraitGeometryProps {
  bgColor: string;
  shape: "circle" | "hexagon";
  portraitSrc: string;
  countryName: string;
  year: string;
  statLine: string;
  ringColor?: string;
  startFrame?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PortraitGeometry: React.FC<PortraitGeometryProps> = ({
  bgColor,
  shape,
  portraitSrc,
  countryName,
  year,
  statLine,
  ringColor = "#c8a951",
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = frame - startFrame;

  // ─── Spring helpers ─────────────────────────────────────────────────────────

  const shapeSpring = spring({ frame: relFrame - 0, fps, config: { damping: 70, stiffness: 45 } });
  const portraitSpring = spring({ frame: relFrame - 6, fps, config: { damping: 80, stiffness: 40 } });
  const countrySpring = spring({ frame: relFrame - 14, fps, config: { damping: 80, stiffness: 50 } });
  const dividerSpring = spring({ frame: relFrame - 20, fps, config: { damping: 80, stiffness: 60 } });
  const yearSpring = spring({ frame: relFrame - 26, fps, config: { damping: 75, stiffness: 40 } });
  const statSpring = spring({ frame: relFrame - 36, fps, config: { damping: 80, stiffness: 40 } });

  // ─── Animated values ────────────────────────────────────────────────────────

  const shapeScale = interpolate(shapeSpring, [0, 1], [0.82, 1]);
  const shapeOpacity = interpolate(shapeSpring, [0, 1], [0, 1]);

  const portraitOpacity = interpolate(portraitSpring, [0, 1], [0, 1]);
  const portraitTranslateY = interpolate(portraitSpring, [0, 1], [18, 0]);

  const countryOpacity = interpolate(countrySpring, [0, 1], [0, 1]);
  const countryTranslateY = interpolate(countrySpring, [0, 1], [22, 0]);

  const dividerScaleX = interpolate(dividerSpring, [0, 1], [0, 1]);

  const yearOpacity = interpolate(yearSpring, [0, 1], [0, 1]);
  const yearTranslateY = interpolate(yearSpring, [0, 1], [28, 0]);

  const statOpacity = interpolate(statSpring, [0, 1], [0, 0.75]);

  // ─── Shape rendering ────────────────────────────────────────────────────────

  const renderShape = () => {
    if (shape === "circle") {
      return (
        <div
          style={{
            width: SHAPE_SIZE,
            height: SHAPE_SIZE,
            borderRadius: "50%",
            border: `5px solid ${ringColor}`,
            overflow: "hidden",
            transform: `scale(${shapeScale})`,
            opacity: shapeOpacity,
          }}
        >
          <div
            style={{
              transform: `translateY(${portraitTranslateY}px)`,
              opacity: portraitOpacity,
              width: "100%",
              height: "100%",
            }}
          >
            <Img
              src={staticFile(portraitSrc)}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      );
    }

    // Hexagon: outer (ring) + inner (portrait)
    return (
      <div
        style={{
          width: SHAPE_SIZE,
          height: SHAPE_SIZE,
          clipPath: HEXAGON_CLIP,
          backgroundColor: ringColor,
          padding: RING_PADDING,
          transform: `scale(${shapeScale})`,
          opacity: shapeOpacity,
        }}
      >
        <div
          style={{
            clipPath: HEXAGON_CLIP,
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              transform: `translateY(${portraitTranslateY}px)`,
              opacity: portraitOpacity,
              width: "100%",
              height: "100%",
            }}
          >
            <Img
              src={staticFile(portraitSrc)}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      {/* Geometric shape + portrait */}
      <div
        style={{
          position: "absolute",
          top: SHAPE_TOP,
          left: SHAPE_LEFT,
          width: SHAPE_SIZE,
          height: SHAPE_SIZE,
        }}
      >
        {renderShape()}
      </div>

      {/* Text block */}
      <div
        style={{
          position: "absolute",
          top: TEXT_TOP,
          left: 0,
          right: 0,
        }}
        className="flex flex-col items-center"
      >
        {/* Country name */}
        <div
          style={{
            opacity: countryOpacity,
            transform: `translateY(${countryTranslateY}px)`,
            fontSize: 220,
            fontFamily: "Cinzel, serif",
            letterSpacing: "0.04em",
          }}
          className="text-ivory uppercase"
        >
          {countryName}
        </div>

        {/* Gold divider */}
        <div
          style={{
            transform: `scaleX(${dividerScaleX})`,
            transformOrigin: "center",
          }}
          className="w-28 h-0.5 bg-gold my-4"
        />

        {/* Year */}
        <div
          style={{
            opacity: yearOpacity,
            transform: `translateY(${yearTranslateY}px)`,
            fontSize: 260,
            fontFamily: "Cinzel, serif",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
          className="text-gold"
        >
          {year}
        </div>

        {/* Stat line */}
        <div
          style={{
            opacity: statOpacity,
            fontSize: 58,
            fontFamily: "'Nunito Sans', sans-serif",
            letterSpacing: "0.06em",
          }}
          className="text-gold mt-4 uppercase"
        >
          {statLine}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default PortraitGeometry;
