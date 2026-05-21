// CTA Scene "Mansa Moussa — L'homme le plus riche de l'histoire"
// Globe ortho + portrait Mansa + 4 noms richesse en cascade + appel action
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { ATLAS_COLORS } from "../atlas-v2-components";
import { T } from "../timing-mansa-moussa-v2";

interface CtaSceneProps {
  startFrame: number;
  endFrame: number;
}

const RICH_NAMES = [
  { name: "ROCKEFELLER", year: "1913", value: "$400 Mds" },
  { name: "BEZOS", year: "2021", value: "$211 Mds" },
  { name: "ELON MUSK", year: "2024", value: "$340 Mds" },
  { name: "MANSA MOUSSA", year: "1324", value: "$400+ Mds", highlight: true },
];

export const AtlasV2CtaScene: React.FC<CtaSceneProps> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  // Phases (17s total CTA)
  // 0-1.5s : portrait A fade in, title appears
  // 1.5-5s : 4 noms cascade
  // 5-8s : freeze / lecture
  // 8-10s : crossfade portrait A -> B
  // 10-14s : message final + abonnement
  // 14-17s : fade out

  const portraitFadeIn = spring({
    frame: localFrame - 5,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  const titleT = spring({
    frame: localFrame - 8,
    fps,
    config: { damping: 16, stiffness: 180 },
  });

  // Portrait crossfade A -> B at frame 8s
  const crossfadeStart = fps * 8;
  const crossfadeEnd = fps * 10;
  const crossfadeT = interpolate(
    localFrame,
    [crossfadeStart, crossfadeEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Final fade out at end
  const fadeOut = interpolate(
    localFrame,
    [duration - fps * 1.5, duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Globe-like background: dark circle + graticule (no Mapbox)
  const globeCx = 360;
  const globeCy = 420;
  const globeR = 280;

  // Graticule lines (simplified, decorative)
  const graticuleLines: string[] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = globeCy - (lat / 90) * globeR;
    const halfW = Math.sqrt(Math.max(0, globeR * globeR - (y - globeCy) * (y - globeCy)));
    if (halfW > 0) {
      graticuleLines.push(`M${globeCx - halfW},${y} A${globeR},${globeR} 0 0 1 ${globeCx + halfW},${y}`);
    }
  }
  for (let lon = -120; lon <= 180; lon += 60) {
    const x = globeCx + (lon / 180) * globeR;
    if (Math.abs(x - globeCx) <= globeR) {
      const halfH = Math.sqrt(Math.max(0, globeR * globeR - (x - globeCx) * (x - globeCx)));
      graticuleLines.push(`M${x},${globeCy - halfH} A${Math.abs(x - globeCx) * 0.5 + 20},${globeR} 0 0 1 ${x},${globeCy + halfH}`);
    }
  }

  // Drift globe slightly
  const globeDrift = Math.sin(localFrame * 0.012) * 6;

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="#0A0E1E" opacity={fadeOut} />

      {/* Globe background */}
      <g opacity={portraitFadeIn * fadeOut} transform={`translate(${globeDrift} 0)`}>
        <circle cx={globeCx} cy={globeCy} r={globeR + 2} fill="#1A2245" />
        <circle cx={globeCx} cy={globeCy} r={globeR} fill="#0D1428" />
        {graticuleLines.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={ATLAS_COLORS.empireGold}
            strokeWidth="0.8"
            opacity="0.12"
          />
        ))}
        {/* Africa highlight */}
        <ellipse
          cx={globeCx - 10}
          cy={globeCy + 30}
          rx={70}
          ry={100}
          fill={ATLAS_COLORS.empireGold}
          opacity="0.18"
        />
        {/* Globe rim */}
        <circle
          cx={globeCx}
          cy={globeCy}
          r={globeR}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          opacity="0.4"
        />
        {/* Gold pulse halo on globe */}
        <circle
          cx={globeCx}
          cy={globeCy}
          r={globeR + 12 + 6 * Math.sin(localFrame * 0.08)}
          fill="none"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2"
          opacity={0.15 + 0.1 * Math.sin(localFrame * 0.08)}
        />
      </g>

      {/* Portrait A (0 -> crossfade) */}
      <image
        href={staticFile("atlas-mansa-moussa/assets/mansa-portrait-A-v2-canonique.png")}
        x="160"
        y="180"
        width="400"
        height="400"
        preserveAspectRatio="xMidYMid meet"
        opacity={portraitFadeIn * (1 - crossfadeT) * fadeOut}
      />

      {/* Portrait B (crossfade ->) */}
      <image
        href={staticFile("atlas-mansa-moussa/assets/mansa-portrait-B-v2-canonique-trone.png")}
        x="160"
        y="180"
        width="400"
        height="400"
        preserveAspectRatio="xMidYMid meet"
        opacity={crossfadeT * fadeOut}
      />

      {/* TITLE */}
      <g
        opacity={titleT * fadeOut}
        transform={`translate(360 120) scale(${0.88 + 0.12 * titleT})`}
      >
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="28"
          fontWeight="700"
          fill={ATLAS_COLORS.empireGold}
          letterSpacing="3"
        >
          L'HOMME LE PLUS RICHE
        </text>
        <text
          x="0"
          y="30"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="500"
          fill={ATLAS_COLORS.cream}
          letterSpacing="2"
          opacity="0.85"
        >
          DE TOUTE L'HISTOIRE
        </text>
        <line
          x1="-180"
          y1="46"
          x2="180"
          y2="46"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="1.5"
          opacity="0.5"
        />
      </g>

      {/* 4 NAMES CASCADE — synced to narration beats */}
      {RICH_NAMES.map((item, i) => {
        // Each name appears when the narrator actually says it
        // Local frame = absolute frame - startFrame (startFrame = T.mansaReveal)
        const beatFrames = [
          T.rockefeller - startFrame,  // "Rockefeller"
          T.bezos - startFrame,        // "Bezos"
          T.musk - startFrame,         // "Musk"
          T.musk - startFrame + 20,    // "Mansa Moussa" — réponse, 0.7s après Musk
        ];
        const itemStart = beatFrames[i] ?? fps * 1.5 + i * Math.round(fps * 0.6);
        const itemT = spring({
          frame: localFrame - itemStart,
          fps,
          config: { damping: 80, stiffness: 400 },
        });
        const yBase = 640 + i * 105;
        const isHighlight = item.highlight;

        return (
          <g
            key={item.name}
            opacity={itemT * fadeOut}
            transform={`translate(0 ${interpolate(itemT, [0, 1], [30, 0])})`}
          >
            {/* Background row */}
            <rect
              x="60"
              y={yBase - 36}
              width="600"
              height={isHighlight ? 82 : 72}
              fill={isHighlight ? ATLAS_COLORS.empireGold : "#1A2245"}
              opacity={isHighlight ? 0.15 : 0.4}
              rx="6"
            />
            {isHighlight && (
              <rect
                x="60"
                y={yBase - 36}
                width="600"
                height="82"
                fill="none"
                stroke={ATLAS_COLORS.empireGold}
                strokeWidth="1.5"
                opacity="0.6"
                rx="6"
              />
            )}
            <text
              x="80"
              y={yBase}
              fontFamily="Cormorant Garamond, serif"
              fontSize={isHighlight ? "30" : "24"}
              fontWeight="700"
              fill={isHighlight ? ATLAS_COLORS.empireGold : ATLAS_COLORS.cream}
              letterSpacing="2"
            >
              {item.name}
            </text>
            <text
              x="80"
              y={yBase + 26}
              fontFamily="Cormorant Garamond, serif"
              fontSize="18"
              fontWeight="400"
              fill={isHighlight ? ATLAS_COLORS.cream : ATLAS_COLORS.cream}
              opacity={isHighlight ? 0.8 : 0.55}
              letterSpacing="1"
            >
              {item.year}
            </text>
            <text
              x="640"
              y={yBase}
              textAnchor="end"
              fontFamily="Cormorant Garamond, serif"
              fontSize={isHighlight ? "28" : "22"}
              fontWeight="700"
              fill={isHighlight ? ATLAS_COLORS.empireGold : "#C4A88A"}
              letterSpacing="1"
            >
              {item.value}
            </text>
            {isHighlight && (
              <text
                x="640"
                y={yBase + 26}
                textAnchor="end"
                fontFamily="Cormorant Garamond, serif"
                fontSize="16"
                fontWeight="400"
                fill={ATLAS_COLORS.cream}
                opacity="0.7"
                fontStyle="italic"
              >
                inestimable
              </text>
            )}
          </g>
        );
      })}

      {/* Abonnement : reserve pour une scene CTA dediee separee (BLOC 8) */}
    </>
  );
};
