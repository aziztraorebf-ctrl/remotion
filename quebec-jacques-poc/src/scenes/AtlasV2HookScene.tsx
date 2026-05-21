// Hook Scene (0-4s) - "Et si je te disais que l'homme le plus riche..."
// Globe orthographic + particules or qui s'effondrent + zoom progressif vers Afrique
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasGlobe,
  AtlasSubtleStars,
  atlasV2Data as data,
} from "../atlas-v2-components";

interface HookSceneProps {
  startFrame: number;
  endFrame: number;
}

interface GoldParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

const PARTICLES: GoldParticle[] = Array.from({ length: 80 }, (_, i) => {
  const seed = i * 9301 + 49297;
  return {
    x: ((seed * 17) % 720),
    y: -((seed * 31) % 200) - 50,
    size: 2 + ((seed * 13) % 100) / 25,
    speed: 1.5 + ((seed * 23) % 100) / 50,
    delay: ((seed * 41) % 90) / 30,
  };
});

export const AtlasV2HookScene: React.FC<HookSceneProps> = ({
  startFrame,
  endFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const sceneDuration = endFrame - startFrame;

  if (localFrame < 0 || frame >= endFrame) return null;

  const globeRotation = interpolate(
    localFrame,
    [0, sceneDuration],
    [-15, 5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const globeScale = interpolate(
    localFrame,
    [0, sceneDuration],
    [1.0, 1.15],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleAt = fps * 1.5;
  const titleT = spring({
    frame: localFrame - titleAt,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <>
      <rect x="0" y="0" width="720" height="1280" fill="url(#bgGrad)" />
      <AtlasSubtleStars opacity={0.7} />

      <AtlasGlobe
        countries={data.ortho.countries}
        rotation={globeRotation}
        scale={globeScale}
        showHalo={true}
      />

      <g>
        {PARTICLES.map((p, i) => {
          const fallStart = p.delay * fps;
          if (localFrame < fallStart) return null;
          const fallT = (localFrame - fallStart) / fps;
          const y = p.y + fallT * 100 * p.speed * fps;
          if (y > 1400) return null;
          const opacity = Math.min(1, fallT * 2) * (1 - Math.max(0, (y - 1100) / 300));
          return (
            <circle
              key={i}
              cx={p.x}
              cy={y}
              r={p.size}
              fill={ATLAS_COLORS.empireGold}
              opacity={opacity * 0.85}
            />
          );
        })}
      </g>

      {titleT > 0.05 && (
        <g
          transform={`translate(360 250) scale(${0.85 + 0.15 * titleT})`}
          opacity={titleT}
        >
          <rect
            x="-300"
            y="-60"
            width="600"
            height="120"
            fill={ATLAS_COLORS.cream}
            stroke={ATLAS_COLORS.empireGold}
            strokeWidth="3"
            rx="8"
            opacity="0.95"
          />
          <text
            x="0"
            y="-8"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="38"
            fontWeight="700"
            fill={ATLAS_COLORS.textInk}
            letterSpacing="2"
          >
            L'HOMME LE PLUS RICHE
          </text>
          <text
            x="0"
            y="36"
            textAnchor="middle"
            fontFamily="Cormorant Garamond, serif"
            fontSize="32"
            fontWeight="600"
            fill={ATLAS_COLORS.empireGold}
            letterSpacing="3"
          >
            DE L'HISTOIRE
          </text>
        </g>
      )}
    </>
  );
};
