/**
 * GlobeCountryReveal — hook d'ouverture spectaculaire (format 9:16)
 *
 * Style Or Africain : ocean #03224c, terres #2a1e0e, bordures #5a3e1e
 * Globe massif (svgScale 2.8) + fond etoile bleu nuit
 * Ligne connectrice spring + encadre silhouette pays + nom pays
 *
 * Props countryPath + countryBBox : calculer via d3-geo orthographic
 * rotate([-lon,-lat,0]) scale(500) translate([270,160]) avant de passer ici.
 *
 * Usage :
 *   <GlobeCountryReveal
 *     globeCountries={atlasData.ortho.countries}
 *     globeRadius={atlasData.ortho.radius}
 *     countryPath="M..."
 *     countryBBox={{ minX, maxX, minY, maxY }}
 *     countryName="NIGER"
 *     highlightIso="NER"
 *     durationFrames={150}
 *   />
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const OCEAN_COLOR = "#03224c";
const LAND_COLOR = "#2a1e0e";
const BORDER_COLOR = "#5a3e1e";

interface BBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface GlobeCountryRevealProps {
  globeCountries: { iso: string; d: string }[];
  globeRadius: number;
  countryPath: string;
  countryBBox: BBox;
  countryName: string;
  highlightIso?: string;
  highlightColor?: string;
  accentColor?: string;
  durationFrames?: number;
  rotateStart?: number;
  rotateEnd?: number;
}

export const GlobeCountryReveal: React.FC<GlobeCountryRevealProps> = ({
  globeCountries,
  globeRadius,
  countryPath,
  countryBBox,
  countryName,
  highlightIso,
  highlightColor = "#f5d547",
  accentColor = "#f5d547",
  durationFrames = 150,
  rotateStart = -12,
  rotateEnd = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Globe scale-in spring
  const globeScaleSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100 },
    durationInFrames: 40,
  });

  // Rotation globe lente et naturelle
  const globeRotation = interpolate(frame, [0, durationFrames], [rotateStart, rotateEnd], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne connectrice
  const lineProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 32,
  });

  // Encadre slide-up
  const panelSlide = spring({
    frame: frame - 38,
    fps,
    config: { damping: 90, stiffness: 65 },
    durationInFrames: 38,
  });

  // Nom pays fade
  const nameOpacity = spring({
    frame: frame - 55,
    fps,
    config: { damping: 150, stiffness: 100 },
    durationInFrames: 25,
  });

  // Fade global sortie
  const globalOpacity = interpolate(
    frame,
    [durationFrames - 12, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Etoiles deterministes
  const stars = React.useMemo(() => {
    const result: { x: number; y: number; r: number; op: number }[] = [];
    let seed = 137;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    for (let i = 0; i < 200; i++) {
      const big = rand() < 0.08;
      result.push({
        x: rand() * 1080,
        y: rand() * 1920,
        r: big ? rand() * 1.8 + 1.0 : rand() * 1.0 + 0.3,
        op: big ? rand() * 0.3 + 0.65 : rand() * 0.35 + 0.45,
      });
    }
    return result;
  }, []);

  const starOp = (base: number, i: number) =>
    base * (0.85 + 0.15 * Math.sin((frame + i * 17) * 0.05)) *
    Math.min(1, frame / 20);

  // Globe : coords SVG natif 720x1280, svgScale 2.8
  const SVG_W = 720;
  const SVG_H = 1280;
  const GLOBE_CX = 360;
  const GLOBE_CY = 580;
  const SVG_SCALE = 2.8;
  const translateX = (width / SVG_SCALE - SVG_W) / 2;
  const translateY = (height / SVG_SCALE - SVG_H) / 2 - 160 / SVG_SCALE;

  // Halo autour du globe
  const haloR = globeRadius;

  // Point de depart ligne : bord droit-bas du globe en coords ecran
  const LINE_START_X = width / 2 + haloR * SVG_SCALE * 0.55;
  const LINE_START_Y = height / 2 - 80 + haloR * SVG_SCALE * 0.35;

  // Encadre bas ecran
  const PANEL_X = 80;
  const PANEL_Y = 1280;
  const PANEL_W = 920;
  const PANEL_H = 480;
  const PANEL_PAD = 48;

  const LINE_END_X = PANEL_X + 40;
  const LINE_END_Y = PANEL_Y + 10;

  const LINE_LEN = Math.sqrt(
    (LINE_END_X - LINE_START_X) ** 2 + (LINE_END_Y - LINE_START_Y) ** 2
  );

  // Auto-centrage silhouette dans encadre
  const { minX: bMinX, maxX: bMaxX, minY: bMinY, maxY: bMaxY } = countryBBox;
  const bW = bMaxX - bMinX;
  const bH = bMaxY - bMinY;
  const availW = PANEL_W - PANEL_PAD * 2;
  const availH = PANEL_H - PANEL_PAD * 2 - 48;
  const shapeScale = Math.min(availW / bW, availH / bH) * 0.92;
  const shapeTX = PANEL_PAD + availW / 2 - (bMinX + bW / 2) * shapeScale;
  const shapeTY = PANEL_PAD + 48 + availH / 2 - (bMinY + bH / 2) * shapeScale;

  const panelTranslateY = interpolate(panelSlide, [0, 1], [60, 0]);

  const spaceBg = "linear-gradient(180deg, #1a2448 0%, #0d1530 55%, #080f1e 100%)";

  return (
    <AbsoluteFill style={{ background: spaceBg, opacity: globalOpacity }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Etoiles */}
        {stars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#ffffff"
            opacity={starOp(s.op, i)}
          />
        ))}

        {/* Globe massif — scale-in spring */}
        <g
          transform={`translate(${width / 2} ${height / 2 - 80}) scale(${globeScaleSpring}) translate(${-width / 2} ${-(height / 2 - 80)})`}
        >
          {/* Halo doré */}
          <g transform={`scale(${SVG_SCALE}) translate(${translateX} ${translateY})`}>
            <circle
              cx={GLOBE_CX}
              cy={GLOBE_CY}
              r={haloR + 30}
              fill="none"
              stroke="#c8972b"
              strokeWidth="0.6"
              opacity="0.15"
            />
            <circle
              cx={GLOBE_CX}
              cy={GLOBE_CY}
              r={haloR + 12}
              fill="none"
              stroke="#c8972b"
              strokeWidth="1.2"
              opacity="0.30"
            />
          </g>

          {/* Globe inline Or Africain */}
          <g transform={`scale(${SVG_SCALE}) translate(${translateX} ${translateY})`}>
            <g
              transform={`translate(${GLOBE_CX} ${GLOBE_CY}) rotate(${globeRotation}) translate(${-GLOBE_CX} ${-GLOBE_CY})`}
            >
              {/* Ocean */}
              <circle cx={GLOBE_CX} cy={GLOBE_CY} r={haloR} fill={OCEAN_COLOR} />
              {/* Pays */}
              {globeCountries.map((c) => (
                <path
                  key={c.iso}
                  d={c.d}
                  fill={c.iso === highlightIso ? highlightColor : LAND_COLOR}
                  stroke={c.iso === highlightIso ? highlightColor : BORDER_COLOR}
                  strokeWidth={c.iso === highlightIso ? 0.8 : 0.4}
                  strokeOpacity={c.iso === highlightIso ? 0.9 : 0.7}
                />
              ))}
            </g>
          </g>
        </g>

        {/* Ligne connectrice */}
        <line
          x1={LINE_START_X}
          y1={LINE_START_Y}
          x2={LINE_END_X}
          y2={LINE_END_Y}
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.65"
          strokeDasharray={LINE_LEN}
          strokeDashoffset={interpolate(lineProgress, [0, 1], [LINE_LEN, 0])}
        />
        <circle
          cx={LINE_END_X}
          cy={LINE_END_Y}
          r={4}
          fill={accentColor}
          opacity={lineProgress}
        />

        {/* Encadre pays */}
        <g
          transform={`translate(0 ${panelTranslateY})`}
          opacity={panelSlide}
        >
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={PANEL_H}
            fill="#080f1e"
            fillOpacity="0.94"
            rx={3}
          />
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={PANEL_H}
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.55"
            rx={3}
          />
          <rect
            x={PANEL_X}
            y={PANEL_Y}
            width={PANEL_W}
            height={52}
            fill={accentColor}
            fillOpacity="0.10"
            rx={3}
          />
          <line
            x1={PANEL_X}
            y1={PANEL_Y + 52}
            x2={PANEL_X + PANEL_W}
            y2={PANEL_Y + 52}
            stroke={accentColor}
            strokeWidth="1"
            strokeOpacity="0.35"
          />

          {/* Silhouette pays */}
          <g transform={`translate(${PANEL_X + shapeTX} ${PANEL_Y + shapeTY}) scale(${shapeScale})`}>
            <path
              d={countryPath}
              fill={accentColor}
              fillOpacity="0.88"
              stroke={accentColor}
              strokeWidth={0.5 / shapeScale}
              strokeOpacity="0.4"
            />
          </g>
        </g>
      </svg>

      {/* Nom pays — CSS Bebas Neue */}
      <div
        style={{
          position: "absolute",
          left: PANEL_X + 24,
          top: PANEL_Y + 12,
          width: PANEL_W - 48,
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: 30,
          letterSpacing: "0.28em",
          color: accentColor,
          opacity: nameOpacity * panelSlide,
          transform: `translateY(${panelTranslateY}px)`,
        }}
      >
        {countryName}
      </div>
    </AbsoluteFill>
  );
};
