// Test walk cycle PixelLab sur carte plate Atlas
// Monk (slow_somber_monastic_walk, 6 frames, east) marche de Niani vers Tombouctou
import {
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasEmpire,
  AtlasSubtleStars,
  AtlasPulseMarker,
  AtlasLabel,
  atlasV2Data as data,
} from "./atlas-v2-components";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";

const MONK_WALK_BASE = "pixellab-walk-test/monk/animations/slow_somber_monastic_walk-24dfad5c";
const WALK_FRAMES = 6;
const WALK_FPS = 8; // frames d'animation par seconde

export const AtlasWalkTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const nianiCoord = wp.Niani as [number, number];
  const tomboCoord = wp.Tombouctou as [number, number];
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  // Duree totale : 8s de marche
  const DURATION_S = 8;

  // Position du monk : Niani -> Tombouctou sur 8s
  const charX = interpolate(frame, [0, fps * DURATION_S], [nianiCoord[0], tomboCoord[0]], {
    extrapolateRight: "clamp",
  });
  const charY = interpolate(frame, [0, fps * DURATION_S], [nianiCoord[1], tomboCoord[1]], {
    extrapolateRight: "clamp",
  });

  // Frame d'animation : cycle 0-5 a WALK_FPS
  const animFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
  const frameStr = String(animFrame).padStart(3, "0");

  // Direction : Tombouctou est a l'est de Niani -> "east"
  // (si on voulait ouest, on flipperait avec scale(-1,1))
  const walkDir = "east";
  const spriteHref = staticFile(`${MONK_WALK_BASE}/${walkDir}/frame_${frameStr}.png`);

  // Camera suit le personnage, zoom fixe 1.8x
  const camX = interpolate(frame, [0, fps * DURATION_S], [nianiCoord[0], tomboCoord[0]], {
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [0, fps * DURATION_S], [nianiCoord[1], tomboCoord[1]], {
    extrapolateRight: "clamp",
  });

  const zoom = 1.8;
  const SPRITE_SIZE = 64;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.3} />

      {/* Carte plate, camera suit le monk */}
      <g
        transform={`
          translate(${width / 2} ${height / 2})
          scale(${zoom})
          translate(${-camX} ${-camY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {otherCountries.map((c) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}

        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="10" opacity={0.18} />
          </g>
        )}

        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        <path
          d={data.mercWide.caravaneSmooth}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          strokeDasharray="12 6"
          opacity={0.7}
        />

        {/* Monk anime — walk cycle east */}
        <image
          href={spriteHref}
          x={charX - SPRITE_SIZE / 2}
          y={charY - SPRITE_SIZE}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
          style={{ imageRendering: "pixelated" }}
        />

      </g>
    </svg>
  );
};
