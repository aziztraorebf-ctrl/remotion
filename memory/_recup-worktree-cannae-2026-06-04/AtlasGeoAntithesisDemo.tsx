import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AtlasMercator, ATLAS_COLORS } from "./atlas-components";
import { AtlasGeoAntithesis, GeoPath } from "./AtlasGeoAntithesis";
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";

// Demo isolee du composant AtlasGeoAntithesis.
// Scenario = antithese Peste 1347 : l'Europe vire au gris cendre (la peste tue)
// pendant que la zone Mali s'illumine en or vivant (l'Afrique subsaharienne continue).

const ISO_EUROPE = new Set([
  "GBR", "IRL", "FRA", "ESP", "PRT", "ITA", "CHE", "AUT", "DEU", "BEL",
  "NLD", "DNK", "SWE", "NOR", "POL", "CZE", "HUN", "ROU", "BGR", "HRV",
  "SRB", "GRC", "SVN",
]);
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

export const AtlasGeoAntithesisDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const data = pesteData.mercLarge;
  const W = pesteData.width;
  const H = pesteData.height;

  const countries = data.countries as GeoPath[];
  const europePaths = countries.filter((c) => ISO_EUROPE.has(c.iso));
  const maliPaths = countries.filter((c) => ISO_MALI_ZONE.has(c.iso));

  // Declin Europe : monte de f30 a f110. Vie Mali : monte de f70 a f150 (decalee).
  const declineProgress = interpolate(frame, [30, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const thriveProgress = interpolate(frame, [70, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Micro-souffle (drift leger) pour ne pas figer l'image.
  const driftX = Math.sin(frame * 0.014) * 8;
  const driftY = Math.cos(frame * 0.011) * 6;
  const camScale = 1.02;

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgBottom }}>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ opacity: Math.min(fadeIn, fadeOut) }}
      >
        <rect x={0} y={0} width={W} height={H} fill={ATLAS_COLORS.ocean} />

        {/* Carte de base (territoires neutres terracotta) */}
        <AtlasMercator
          countries={countries}
          driftX={driftX}
          driftY={driftY}
          scale={camScale}
          width={W}
          height={H}
        />

        {/* Antithese : meme transform camera que AtlasMercator (drift/scale) */}
        <g
          transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}
        >
          <AtlasGeoAntithesis
            declinePaths={europePaths}
            thrivePaths={maliPaths}
            declineProgress={declineProgress}
            thriveProgress={thriveProgress}
            frame={frame}
            declineColorRgb={[178, 34, 34]}
          />
        </g>

        {/* Repere texte (demo only) */}
        <text
          x={W / 2}
          y={H * 0.06}
          textAnchor="middle"
          fill={ATLAS_COLORS.textGold}
          fontSize={20}
          fontFamily="Georgia, serif"
          letterSpacing={2}
        >
          AtlasGeoAntithesis — demo
        </text>
      </svg>
    </AbsoluteFill>
  );
};
