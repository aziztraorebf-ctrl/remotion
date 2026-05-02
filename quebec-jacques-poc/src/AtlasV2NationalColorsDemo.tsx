// Mini-demo for Aziz: national colors mode for Atlas Mercator map.
// Phase A (0-4s): terracotta classic palette (reference)
// Phase B (4-8s): national colors transition (18 African countries)
// Duration: 8s. No audio.
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasDefs,
  AtlasMercator,
  AtlasSubtleStars,
  NATIONAL_COLORS,
  atlasV2Data as data,
} from "./atlas-v2-components";

const FPS = 30;

// Custom AtlasMercator with crossfade between palettes
const DualPaletteMercator: React.FC<{
  countries: { iso: string; d: string }[];
  classicOpacity: number;
  nationalOpacity: number;
  driftX: number;
  driftY: number;
  scale: number;
}> = ({ countries, classicOpacity, nationalOpacity, driftX, driftY, scale }) => {
  const cx = 360;
  const cy = 640;

  return (
    <g
      transform={`translate(${cx + driftX} ${cy + driftY}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <rect
        x="-300"
        y="-300"
        width="1320"
        height="1880"
        fill={ATLAS_COLORS.oceanDeep}
      />
      {/* Classic terracotta layer */}
      <g opacity={classicOpacity}>
        {countries.map((c) => (
          <path
            key={`classic-${c.iso}`}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.6"
            strokeOpacity="0.7"
          />
        ))}
      </g>
      {/* National colors layer */}
      <g opacity={nationalOpacity}>
        {countries.map((c) => {
          const fill = NATIONAL_COLORS[c.iso] ?? ATLAS_COLORS.land;
          return (
            <path
              key={`national-${c.iso}`}
              d={c.d}
              fill={fill}
              stroke={ATLAS_COLORS.landStroke}
              strokeWidth="0.6"
              strokeOpacity="0.7"
            />
          );
        })}
      </g>
    </g>
  );
};

export const AtlasV2NationalColorsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase A: classic only (0-3s)
  // Transition (3-5s): crossfade
  // Phase B: national colors only (5-8s)
  const transStart = fps * 3;
  const transEnd = fps * 5;

  const classicOpacity = interpolate(frame, [transStart, transEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nationalOpacity = interpolate(frame, [transStart, transEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous micro-drift
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 5;

  // Slow zoom for visual interest
  const scale = interpolate(frame, [0, fps * 8], [1.0, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <AtlasDefs />
        <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
        <AtlasSubtleStars opacity={0.6} />

        <DualPaletteMercator
          countries={data.mercWide.countries}
          classicOpacity={classicOpacity}
          nationalOpacity={nationalOpacity}
          driftX={driftX}
          driftY={driftY}
          scale={scale}
        />

        <rect
          x="0"
          y="0"
          width="720"
          height="1280"
          fill="url(#vignette)"
          pointerEvents="none"
        />

        {/* Phase indicator */}
        <text
          x="20"
          y="40"
          fontFamily="monospace"
          fontSize="20"
          fill={ATLAS_COLORS.cream}
          opacity="0.7"
        >
          {frame < transStart
            ? "Phase A: terracotta classic (reference)"
            : frame < transEnd
              ? "Transition: crossfade"
              : "Phase B: national colors (18 countries)"}
        </text>

        {/* Country count indicator */}
        <text
          x="20"
          y="1240"
          fontFamily="monospace"
          fontSize="16"
          fill={ATLAS_COLORS.cream}
          opacity="0.6"
        >
          18 pays africains coloris drapeau
        </text>
      </svg>
    </AbsoluteFill>
  );
};

export const ATLAS_V2_NATIONAL_COLORS_DEMO_DURATION = FPS * 8;
