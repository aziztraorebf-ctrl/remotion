// Test 2 : Monk marche 4s -> s'arrete -> animation priere
// Test 3 : Deux moines se rencontrent au centre, animations distinctes
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
  AtlasLabel,
  atlasV2Data as data,
} from "./atlas-v2-components";
import { AtlasSharedDefs } from "./atlas-v2-shared-defs";

const MONK_WALK = "pixellab-walk-test/monk/animations/slow_somber_monastic_walk-24dfad5c";
const MONK_PRAY = "pixellab-walk-test/monk/animations/monk_kneeling_in_prayer_hands_clasped_together_hea-429a126c";
const MERCHANT_WALK = "pixellab-walk-test/merchant-dark/animations/nervous_hurried_walk-1e04d72a";
const MERCHANT_YELL = "pixellab-walk-test/merchant-dark/animations/yelling_piedestrian_to_sell_them_stuffs_transparen-406f95f9";

const WALK_FRAMES = 6;
const PRAY_FRAMES = 4;
const YELL_FRAMES = 16;
const WALK_FPS = 8;
const ANIM_FPS = 8;

// Sprite helper : direction + flip optionnel
const WalkSprite: React.FC<{
  href: string;
  x: number;
  y: number;
  size: number;
  flipX?: boolean;
}> = ({ href, x, y, size, flipX }) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform={flipX ? `scale(-1, 1)` : ""}>
      <image
        href={href}
        x={-size / 2}
        y={-size}
        width={size}
        height={size}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  </g>
);

// Fond carte commun
const MapBase: React.FC<{
  zoom: number;
  camX: number;
  camY: number;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ zoom, camX, camY, width, height, children }) => {
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");
  return (
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
      {children}
    </g>
  );
};

// === TEST 2 : Marche -> Animation priere ===
export const AtlasWalkThenPray: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const nianiCoord = wp.Niani as [number, number];
  const tomboCoord = wp.Tombouctou as [number, number];

  // Phase marche : 0 -> 4s | Phase priere : 4s -> 9s
  const WALK_END = fps * 4;
  const isWalking = frame < WALK_END;

  const charX = interpolate(frame, [0, WALK_END], [nianiCoord[0], tomboCoord[0]], {
    extrapolateRight: "clamp",
  });
  const charY = interpolate(frame, [0, WALK_END], [nianiCoord[1], tomboCoord[1]], {
    extrapolateRight: "clamp",
  });

  // Walk cycle
  const walkAnimFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
  const walkStr = String(walkAnimFrame).padStart(3, "0");

  // Priere cycle (demarre a WALK_END)
  const prayFrame = frame - WALK_END;
  const prayAnimFrame = Math.floor((prayFrame / fps) * ANIM_FPS) % PRAY_FRAMES;
  const prayStr = String(prayAnimFrame).padStart(3, "0");

  const spriteHref = isWalking
    ? staticFile(`${MONK_WALK}/east/frame_${walkStr}.png`)
    : staticFile(`${MONK_PRAY}/south/frame_${prayStr}.png`);

  // Zoom progresse : vue large -> zoom sur Tombouctou
  const zoom = interpolate(frame, [WALK_END - fps, WALK_END + fps * 1.5], [1.8, 2.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camX = interpolate(frame, [0, WALK_END], [nianiCoord[0], tomboCoord[0]], {
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [0, WALK_END], [nianiCoord[1], tomboCoord[1]], {
    extrapolateRight: "clamp",
  });

  const SPRITE_SIZE = 72;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.3} />
      <MapBase zoom={zoom} camX={camX} camY={camY} width={width} height={height}>
        <WalkSprite href={spriteHref} x={charX} y={charY} size={SPRITE_SIZE} />
      </MapBase>
    </svg>
  );
};

// === TEST 3 : Deux personnages se rencontrent ===
export const AtlasWalkMeet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const nianiCoord = wp.Niani as [number, number];
  const tomboCoord = wp.Tombouctou as [number, number];

  // Point de rencontre : milieu de la route
  const meetX = (nianiCoord[0] + tomboCoord[0]) / 2 + 10;
  const meetY = (nianiCoord[1] + tomboCoord[1]) / 2;

  // Phase marche : 0 -> 4s | Phase rencontre : 4s -> 9s
  const WALK_END = fps * 4;
  const isWalking = frame < WALK_END;

  // Monk : vient de l'ouest (Niani) -> marche vers l'est
  const monkX = interpolate(frame, [0, WALK_END], [nianiCoord[0], meetX - 20], {
    extrapolateRight: "clamp",
  });
  const monkY = interpolate(frame, [0, WALK_END], [nianiCoord[1], meetY], {
    extrapolateRight: "clamp",
  });

  // Merchant : vient de l'est (Tombouctou) -> marche vers l'ouest (flip)
  const merchantX = interpolate(frame, [0, WALK_END], [tomboCoord[0], meetX + 20], {
    extrapolateRight: "clamp",
  });
  const merchantY = interpolate(frame, [0, WALK_END], [tomboCoord[1], meetY], {
    extrapolateRight: "clamp",
  });

  // Walk cycles
  const walkAnimFrame = Math.floor((frame / fps) * WALK_FPS) % WALK_FRAMES;
  const walkStr = String(walkAnimFrame).padStart(3, "0");

  // Animations post-rencontre
  const postFrame = frame - WALK_END;
  const prayAnimFrame = Math.floor((postFrame / fps) * ANIM_FPS) % PRAY_FRAMES;
  const prayStr = String(prayAnimFrame).padStart(3, "0");
  const yellAnimFrame = Math.floor((postFrame / fps) * ANIM_FPS) % YELL_FRAMES;
  const yellStr = String(yellAnimFrame).padStart(3, "0");

  // Sprites
  const monkHref = isWalking
    ? staticFile(`${MONK_WALK}/east/frame_${walkStr}.png`)
    : staticFile(`${MONK_PRAY}/south/frame_${prayStr}.png`);

  const merchantHref = isWalking
    ? staticFile(`${MERCHANT_WALK}/east/frame_${walkStr}.png`)
    : staticFile(`${MERCHANT_YELL}/east/frame_${yellStr}.png`);

  // Camera zoom sur le point de rencontre progressivement
  const zoom = interpolate(frame, [fps * 2, WALK_END + fps], [1.6, 3.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const camX = interpolate(frame, [fps, WALK_END], [(nianiCoord[0] + tomboCoord[0]) / 2, meetX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [fps, WALK_END], [(nianiCoord[1] + tomboCoord[1]) / 2, meetY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const SPRITE_SIZE = 72;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.3} />
      <MapBase zoom={zoom} camX={camX} camY={camY} width={width} height={height}>
        {/* Monk vient de l'ouest, marche vers l'est — pas de flip */}
        <WalkSprite href={monkHref} x={monkX} y={monkY} size={SPRITE_SIZE} flipX={false} />
        {/* Merchant vient de l'est, marche vers l'ouest — flip pendant marche uniquement */}
        <WalkSprite href={merchantHref} x={merchantX} y={merchantY} size={SPRITE_SIZE} flipX={isWalking} />
      </MapBase>
    </svg>
  );
};
