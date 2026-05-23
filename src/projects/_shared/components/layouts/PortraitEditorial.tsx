import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface EditorialStat {
  label: string;
  valeur: string;
}

export interface PortraitEditorialProps {
  imageUrl?: string;
  rubrique?: string;
  titre?: string[];
  sousTitre?: string;
  stats?: EditorialStat[];
  source?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const PHOTO_X = 40;
const PHOTO_Y = 90;
const PHOTO_W = 700;
const PHOTO_H = 900;

const FRAME_X = 44;
const FRAME_Y = 94;
const FRAME_W = 692;
const FRAME_H = 892;
const FRAME_PERIMETER = 2 * (FRAME_W + FRAME_H); // 3168

const BLOCK_X = 780;

const DEFAULT_STATS: EditorialStat[] = [
  { label: "FLUX FINANCIER", valeur: "4.2 Mrd $" },
  { label: "ACTEURS IMPLIQUES", valeur: "127 Entites" },
  { label: "IMPACT REGIONAL", valeur: "Critique" },
];

const STATS_X = [780, 1080, 1380];

export const PortraitEditorial: React.FC<PortraitEditorialProps> = ({
  imageUrl,
  rubrique = "INVESTIGATION",
  titre = ["LES RESEAUX INVISIBLES", "DE L'EXTRACTION MINIERE"],
  sousTitre = "Analyse des flux financiers en Afrique de l'Ouest",
  stats = DEFAULT_STATS,
  source = "SOURCE VERIFIEE",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Photo clip-path open left→right
  const clipW = interpolate(frame, [0, 30], [0, PHOTO_W], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gold frame draw-on
  const frameOffset = interpolate(frame, [30, 60], [FRAME_PERIMETER, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rubrique fade + translateY
  const rubriqueOp = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rubriqueTy = interpolate(frame, [40, 55], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Separator scaleX
  const sepScale = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Title lines
  const titleTx1 = interpolate(frame, [60, 80], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOp1 = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleTx2 = interpolate(frame, [70, 90], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOp2 = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle fade
  const subtitleOp = interpolate(frame, [85, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Stats spring pop — 3 items
  const STAT_DELAYS = [100, 115, 130];
  const statSprings = STAT_DELAYS.map((delay) =>
    spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: { damping: 14, stiffness: 120, mass: 1 },
    })
  );

  // Source badge fade
  const sourceOp = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          <clipPath id="photoClip">
            <rect x={PHOTO_X} y={PHOTO_Y} width={clipW} height={PHOTO_H} />
          </clipPath>
          <linearGradient id="silGrad8A" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3b55" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a2535" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Photo zone — image or placeholder */}
        <g clipPath="url(#photoClip)">
          {imageUrl ? (
            <image
              href={imageUrl}
              x={PHOTO_X}
              y={PHOTO_Y}
              width={PHOTO_W}
              height={PHOTO_H}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <g>
              <rect
                x={PHOTO_X}
                y={PHOTO_Y}
                width={PHOTO_W}
                height={PHOTO_H}
                fill="#1a2535"
              />
              {/* Diagonal cross lines */}
              <line
                x1={PHOTO_X}
                y1={PHOTO_Y}
                x2={PHOTO_X + PHOTO_W}
                y2={PHOTO_Y + PHOTO_H}
                stroke="#c8a951"
                strokeWidth={1}
                opacity={0.15}
              />
              <line
                x1={PHOTO_X + PHOTO_W}
                y1={PHOTO_Y}
                x2={PHOTO_X}
                y2={PHOTO_Y + PHOTO_H}
                stroke="#c8a951"
                strokeWidth={1}
                opacity={0.15}
              />
              {/* Silhouette géométrique */}
              <polygon
                points="220,900 320,600 460,600 560,900"
                fill="url(#silGrad8A)"
              />
              <circle cx={390} cy={480} r={90} fill="url(#silGrad8A)" />
              {/* Grid overlay */}
              {[200, 300, 400, 500, 600, 700].map((y) => (
                <line
                  key={y}
                  x1={PHOTO_X}
                  y1={y}
                  x2={PHOTO_X + PHOTO_W}
                  y2={y}
                  stroke="#4a9eff"
                  strokeWidth={0.5}
                  opacity={0.08}
                />
              ))}
            </g>
          )}
        </g>

        {/* Gold frame stroke-dashoffset */}
        <rect
          x={FRAME_X}
          y={FRAME_Y}
          width={FRAME_W}
          height={FRAME_H}
          fill="none"
          stroke="#c8a951"
          strokeWidth={2}
          strokeDasharray={FRAME_PERIMETER}
          strokeDashoffset={frameOffset}
        />

        {/* Rubrique */}
        <text
          x={BLOCK_X}
          y={140 + rubriqueTy}
          opacity={rubriqueOp}
          style={{
            fontFamily: FONT_MONO,
            fontSize: 20,
            fontWeight: "bold",
            fill: "#e63946",
            letterSpacing: 4,
          }}
        >
          {rubrique}
        </text>

        {/* Separator line — scaleX from left */}
        <line
          x1={BLOCK_X}
          y1={170}
          x2={BLOCK_X + 270 * sepScale}
          y2={170}
          stroke="#c8a951"
          strokeWidth={1}
        />

        {/* Title lines */}
        {(titre || []).slice(0, 2).map((line, i) => {
          const tx = i === 0 ? titleTx1 : titleTx2;
          const op = i === 0 ? titleOp1 : titleOp2;
          const y = i === 0 ? 250 : 320;
          return (
            <text
              key={i}
              x={BLOCK_X + tx}
              y={y}
              opacity={op}
              style={{
                fontFamily: FONT_MONO,
                fontSize: 52,
                fontWeight: "bold",
                fill: "#f2ebd9",
              }}
            >
              {line}
            </text>
          );
        })}

        {/* Subtitle */}
        <text
          x={BLOCK_X}
          y={420}
          opacity={subtitleOp}
          style={{ fontFamily: FONT_MONO, fontSize: 24, fill: "#c8a951" }}
        >
          {sousTitre}
        </text>

        {/* Stats — 3 items */}
        {stats.slice(0, 3).map((stat, i) => {
          const sc = statSprings[i] ?? 0;
          const sx = STATS_X[i] ?? BLOCK_X + i * 300;
          return (
            <g key={i} transform={`scale(${sc})`} style={{ transformOrigin: `${sx}px 580px` }}>
              <text
                x={sx}
                y={580}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  fill: "#8a96a8",
                  letterSpacing: 2,
                }}
              >
                {stat.label}
              </text>
              <text
                x={sx}
                y={620}
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 28,
                  fontWeight: "bold",
                  fill: "#f2ebd9",
                }}
              >
                {stat.valeur}
              </text>
              {/* Gold bar under value */}
              <rect x={sx} y={632} width={50} height={2} fill="#c8a951" />
            </g>
          );
        })}

        {/* Source badge */}
        <g opacity={sourceOp}>
          <rect
            x={BLOCK_X}
            y={930}
            width={Math.max(200, source.length * 10 + 32)}
            height={36}
            rx={2}
            fill="#101722"
          />
          <text
            x={BLOCK_X + 16}
            y={954}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 16,
              fill: "#c8a951",
              letterSpacing: 2,
            }}
          >
            {source}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
