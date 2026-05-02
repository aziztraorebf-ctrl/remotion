// Test rapide : sprites PixelLab sur carte Atlas vectorielle
// Objectif : valider cohabitation style pixel art + Parchemin Mande
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasCaravane,
  AtlasPulseMarker,
  AtlasLabel,
  estimateWaypointsLength,
  atlasV2Data as data,
} from "./atlas-v2-components";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";

export const AtlasPixelLabTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const driftX = Math.sin(frame * 0.014) * 12;
  const driftY = Math.cos(frame * 0.011) * 7;

  const scale = interpolate(frame, [0, fps * 5], [1.0, 1.12], {
    extrapolateRight: "clamp",
  });

  const tiltDeg = 20;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  const wp = data.mercWide.caravaneWaypoints;
  const waypoints: [number, number][] = [
    wp.Niani as [number, number],
    wp.Tombouctou as [number, number],
    wp.Sahara1 as [number, number],
    wp.Sahara2 as [number, number],
    wp.LeCaire as [number, number],
    wp.Sinai as [number, number],
    wp.Mecque as [number, number],
  ];
  const lenEstimate = estimateWaypointsLength(waypoints);

  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");
  const tombouctou = data.mercWide.cities.Tombouctou as [number, number];
  const mecque = data.mercWide.cities.Mecque as [number, number];

  // Positions sur la carte pour les sprites PixelLab
  // Mansa Moussa : positionne sur Niani (point de depart)
  const nianiCoord = wp.Niani as [number, number];
  // Chameau : positionne en milieu de route (Sahara1)
  const saharaCoord = wp.Sahara1 as [number, number];
  // Guerrier : positionne a Tombouctou
  const tomboCoord = wp.Tombouctou as [number, number];

  // Taille sprite sur la carte : 128px natif affiche a 64px (visible sans etre envahissant)
  const SPRITE_SIZE = 64;
  const SPRITE_HALF = SPRITE_SIZE / 2;

  // Hop leger pour simuler la marche (en attendant le walk cycle MCP)
  const hop = Math.sin(frame * 0.3) * 3;

  return (
    <svg width="720" height="1280" style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.5} />

      <g
        transform={`
          translate(${360 + driftX} ${640 + driftY})
          scale(${scale} ${scale * scaleY})
          skewX(${skewX})
          translate(-360 -640)
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {otherCountries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {mali && (
          <g>
            <path
              d={mali.d}
              fill={ATLAS_COLORS.maliFill}
              stroke={ATLAS_COLORS.empireOutlineDark}
              strokeWidth="2"
            />
            <path
              d={mali.d}
              fill="none"
              stroke={ATLAS_COLORS.haloGold}
              strokeWidth="10"
              opacity={0.15}
            />
          </g>
        )}

        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* Route caravane pointillee */}
        <path
          d={data.mercWide.caravaneSmooth}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          strokeDasharray="12 6"
          opacity={0.8}
        />

        {/* === SPRITES PIXELLAB === */}

        {/* Mansa Moussa a Niani */}
        <image
          href={staticFile("atlas-mansa-moussa/assets/mansa-pixel-128.png")}
          x={nianiCoord[0] - SPRITE_HALF}
          y={nianiCoord[1] - SPRITE_SIZE + hop}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
        />

        {/* Guerrier a Tombouctou */}
        <image
          href={staticFile("atlas-mansa-moussa/assets/guerrier-pixel-128.png")}
          x={tomboCoord[0] - SPRITE_HALF}
          y={tomboCoord[1] - SPRITE_SIZE + hop * 0.7}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
        />

        {/* Chameau en Sahara */}
        <image
          href={staticFile("atlas-mansa-moussa/assets/chameau-pixel-128.png")}
          x={saharaCoord[0] - SPRITE_HALF}
          y={saharaCoord[1] - SPRITE_SIZE + hop * 1.3}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
        />

        {/* Pulse markers */}
        <AtlasPulseMarker
          coord={tombouctou}
          beatStart={0}
          color={ATLAS_COLORS.empireGold}
        />
        <AtlasPulseMarker
          coord={mecque}
          beatStart={fps * 2}
          color={ATLAS_COLORS.empireGold}
        />

        <AtlasLabel
          coord={tombouctou}
          text="TOMBOUCTOU"
          appearAt={fps}
          offsetY={-36}
          fontSize={20}
        />
        <AtlasLabel
          coord={mecque}
          text="LA MECQUE"
          appearAt={fps * 2}
          offsetY={-36}
          fontSize={20}
        />
      </g>
    </svg>
  );
};
