// Test zoom + mouvement sprites PixelLab sur carte Atlas
// Render A : zoom progressif 1x -> 3x sur chameau (tient-il le zoom ?)
// Render B : chameau se deplace sur la route + zoom 1.5x fixe
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
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

// === RENDER A : Zoom progressif sur le chameau ===
export const AtlasPixelZoomA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const saharaCoord = wp.Sahara1 as [number, number];
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  // Zoom 1x -> 3x en 5s, centre sur le chameau en Sahara
  const zoom = interpolate(frame, [0, fps * 5], [1.0, 3.2], {
    extrapolateRight: "clamp",
  });

  const tiltDeg = 20;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  // Centre camera sur le chameau
  const focusX = saharaCoord[0];
  const focusY = saharaCoord[1];

  // Hop
  const hop = Math.sin(frame * 0.3) * 3;

  const SPRITE_SIZE = 64;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      <g
        transform={`
          translate(${width / 2} ${height / 2})
          scale(${zoom} ${zoom * scaleY})
          skewX(${skewX})
          translate(${-focusX} ${-focusY})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {otherCountries.map((c) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}

        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="10" opacity={0.15} />
          </g>
        )}

        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* Route caravane */}
        <path
          d={data.mercWide.caravaneSmooth}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          strokeDasharray="12 6"
          opacity={0.8}
        />

        {/* Chameau centre du zoom */}
        <image
          href={staticFile("atlas-mansa-moussa/assets/chameau-pixel-128.png")}
          x={saharaCoord[0] - SPRITE_SIZE / 2}
          y={saharaCoord[1] - SPRITE_SIZE + hop}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
          style={{ imageRendering: "pixelated" }}
        />

        {/* Mansa Moussa en arriere plan */}
        <image
          href={staticFile("atlas-mansa-moussa/assets/mansa-pixel-128.png")}
          x={(wp.Niani as [number, number])[0] - SPRITE_SIZE / 2}
          y={(wp.Niani as [number, number])[1] - SPRITE_SIZE + hop * 0.8}
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
          style={{ imageRendering: "pixelated" }}
        />
      </g>
    </svg>
  );
};

// Helper : sprite ancre au sol (ombre elliptique + tilt carte)
const AnchoredSprite: React.FC<{
  href: string;
  x: number;
  y: number;
  size: number;
  hop: number;
  skewX: number;
}> = ({ href, x, y, size, hop, skewX }) => {
  const shadowW = size * 0.6;
  const shadowH = size * 0.12;
  // Le sprite se penche dans le meme sens que la carte
  const spriteSkew = skewX * 0.4;

  return (
    <g>
      {/* Ombre elliptique au sol — reste fixe (pas de hop) */}
      <ellipse
        cx={x}
        cy={y}
        rx={shadowW / 2}
        ry={shadowH / 2}
        fill="#1A1208"
        opacity={0.35}
      />
      {/* Sprite avec tilt leger + hop */}
      <g transform={`translate(${x} ${y + hop}) skewX(${spriteSkew})`}>
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
};

// === RENDER C : Zoom gros plan sur Mansa Moussa + guerrier avec ancrage sol ===
export const AtlasPixelZoomC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const nianiCoord = wp.Niani as [number, number];
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");

  // Phase 1 (0-2s) : vue large 1x
  // Phase 2 (2-5s) : zoom 1x -> 4.5x
  // Phase 3 (5-7s) : maintien 4.5x
  const zoom = interpolate(frame, [fps * 2, fps * 5], [1.0, 4.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tilt s'annule au zoom pour que les persos restent lisibles en gros plan
  const tiltDeg = interpolate(frame, [fps * 2, fps * 5], [18, 4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  const hop = Math.sin(frame * 0.3) * 3;
  const SPRITE_SIZE = 64;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      <g
        transform={`
          translate(${width / 2} ${height / 2})
          scale(${zoom} ${zoom * scaleY})
          skewX(${skewX})
          translate(${-nianiCoord[0] - 10} ${-nianiCoord[1] + 10})
        `}
      >
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.oceanDeep} />

        {otherCountries.map((c) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}

        {mali && (
          <g>
            <path d={mali.d} fill={ATLAS_COLORS.maliFill} stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="2" />
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="10" opacity={0.15} />
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

        {/* Mansa Moussa — ancre au sol */}
        <AnchoredSprite
          href={staticFile("atlas-mansa-moussa/assets/mansa-pixel-128.png")}
          x={nianiCoord[0] - 28}
          y={nianiCoord[1]}
          size={SPRITE_SIZE}
          hop={hop}
          skewX={skewX}
        />

        {/* Guerrier — ancre au sol */}
        <AnchoredSprite
          href={staticFile("atlas-mansa-moussa/assets/guerrier-pixel-128.png")}
          x={nianiCoord[0] + 32}
          y={nianiCoord[1]}
          size={SPRITE_SIZE}
          hop={hop * 0.8}
          skewX={skewX}
        />
      </g>
    </svg>
  );
};

// Helper interne carte plate : sprite sans ombre, hop optionnel
const FlatSprite: React.FC<{
  href: string;
  x: number;
  y: number;
  size: number;
  hop: number;
}> = ({ href, x, y, size, hop }) => (
  <image
    href={href}
    x={x - size / 2}
    y={y - size + hop}
    width={size}
    height={size}
    style={{ imageRendering: "pixelated" }}
  />
);

// Composition partagee carte plate (hop + shadow controlables)
const AtlasPixelFlatBase: React.FC<{ withHop: boolean }> = ({ withHop }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;
  const nianiCoord = wp.Niani as [number, number];
  const tomboCoord = wp.Tombouctou as [number, number];
  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  const zoom = interpolate(frame, [0, fps * 5], [1.0, 1.6], {
    extrapolateRight: "clamp",
  });

  const hop = withHop ? Math.sin(frame * 0.35) * 4 : 0;

  const focusX = (nianiCoord[0] + tomboCoord[0]) / 2;
  const focusY = (nianiCoord[1] + tomboCoord[1]) / 2;

  const SPRITE_SIZE = 80;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.3} />

      <g
        transform={`
          translate(${width / 2} ${height / 2})
          scale(${zoom})
          translate(${-focusX} ${-focusY})
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
          opacity={0.8}
        />

        <FlatSprite href={staticFile("atlas-mansa-moussa/assets/mansa-pixel-128.png")} x={nianiCoord[0]} y={nianiCoord[1]} size={SPRITE_SIZE} hop={hop} />
        <FlatSprite href={staticFile("atlas-mansa-moussa/assets/guerrier-pixel-128.png")} x={tomboCoord[0]} y={tomboCoord[1]} size={SPRITE_SIZE} hop={hop * 0.8} />

        <AtlasLabel coord={tomboCoord} text="TOMBOUCTOU" appearAt={fps * 1} offsetY={-SPRITE_SIZE - 8} fontSize={18} />
        <AtlasLabel coord={nianiCoord} text="NIANI" appearAt={fps * 0.5} offsetY={-SPRITE_SIZE - 8} fontSize={16} />
      </g>
    </svg>
  );
};

// D1 — complètement statique, sans ombre
export const AtlasPixelFlatD: React.FC = () => <AtlasPixelFlatBase withHop={false} />;

// D2 — hop subtil, sans ombre
export const AtlasPixelFlatD2: React.FC = () => <AtlasPixelFlatBase withHop={true} />;

// === RENDER B : Chameau se deplace sur la route ===
export const AtlasPixelMoveB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const wp = data.mercWide.caravaneWaypoints;

  // 4 points de la route du chameau (Niani -> Tombouctou -> Sahara1 -> Sahara2)
  const routePoints: [number, number][] = [
    wp.Niani as [number, number],
    wp.Tombouctou as [number, number],
    wp.Sahara1 as [number, number],
    wp.Sahara2 as [number, number],
  ];

  // Progression 0 -> 1 sur 7s
  const progress = interpolate(frame, [0, fps * 7], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Interpolation position sur les segments
  const totalSegments = routePoints.length - 1;
  const segmentProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const segmentT = segmentProgress - segmentIndex;

  const fromPoint = routePoints[segmentIndex];
  const toPoint = routePoints[segmentIndex + 1];
  const charX = fromPoint[0] + (toPoint[0] - fromPoint[0]) * segmentT;
  const charY = fromPoint[1] + (toPoint[1] - fromPoint[1]) * segmentT;

  // Direction du mouvement -> flip horizontal si va vers l'ouest
  const movingEast = toPoint[0] > fromPoint[0];

  // Hop alterne simule walk
  const hop = Math.sin(frame * 0.5) * 4;
  // Lean leger dans la direction de marche
  const lean = movingEast ? 5 : -5;

  const mali = data.mercWide.countries.find((c) => c.iso === "MLI");
  const otherCountries = data.mercWide.countries.filter((c) => c.iso !== "MLI");

  // Camera suit le personnage avec leger lag
  const camX = interpolate(frame, [0, fps * 7], [routePoints[0][0], routePoints[3][0]], {
    extrapolateRight: "clamp",
  });
  const camY = interpolate(frame, [0, fps * 7], [routePoints[0][1], routePoints[3][1]], {
    extrapolateRight: "clamp",
  });

  const zoom = 2.0;
  const tiltDeg = 18;
  const skewX = tiltDeg * 0.15;
  const scaleY = 1 - tiltDeg * 0.008;

  const SPRITE_SIZE = 64;

  return (
    <svg width={width} height={height} style={{ background: "#1A1F3A" }}>
      <AtlasSharedDefs />
      <rect x="0" y="0" width={width} height={height} fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      <g
        transform={`
          translate(${width / 2} ${height / 2})
          scale(${zoom} ${zoom * scaleY})
          skewX(${skewX})
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
            <path d={mali.d} fill="none" stroke={ATLAS_COLORS.haloGold} strokeWidth="10" opacity={0.15} />
          </g>
        )}

        {data.mercWide.maliEmpire1300 && (
          <AtlasEmpire pathD={data.mercWide.maliEmpire1300} outlineDark={true} />
        )}

        {/* Route caravane */}
        <path
          d={data.mercWide.caravaneSmooth}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          strokeDasharray="12 6"
          opacity={0.9}
        />

        {/* Chameau qui se deplace — flip si direction ouest */}
        <g transform={`translate(${charX} ${charY + hop})`}>
          <g transform={`rotate(${lean}, 0, 0) scale(${movingEast ? 1 : -1}, 1)`}>
            <image
              href={staticFile("atlas-mansa-moussa/assets/chameau-pixel-128.png")}
              x={-SPRITE_SIZE / 2}
              y={-SPRITE_SIZE}
              width={SPRITE_SIZE}
              height={SPRITE_SIZE}
              style={{ imageRendering: "pixelated" }}
            />
          </g>
        </g>

        {/* Mansa Moussa suit avec un leger decalage */}
        <g transform={`translate(${charX - 30} ${charY + hop * 0.7})`}>
          <image
            href={staticFile("atlas-mansa-moussa/assets/mansa-pixel-128.png")}
            x={-SPRITE_SIZE / 2}
            y={-SPRITE_SIZE}
            width={SPRITE_SIZE}
            height={SPRITE_SIZE}
            style={{ imageRendering: "pixelated" }}
          />
        </g>

        {/* Pulse marker destination */}
        <AtlasPulseMarker
          coord={wp.Sahara2 as [number, number]}
          beatStart={fps * 5}
          color={ATLAS_COLORS.empireGold}
        />

        <AtlasLabel
          coord={wp.Tombouctou as [number, number]}
          text="TOMBOUCTOU"
          appearAt={fps * 1}
          offsetY={-36}
          fontSize={18}
        />
      </g>
    </svg>
  );
};
