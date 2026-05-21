/**
 * ComparisonTable V2 — composant de comparaison generique Souverain
 *
 * Cas d'usage : pays, entreprises, regimes, epoques, acteurs.
 * 4 backgrounds : accent (rouge brique), kraft (papier), dossier (bleu nuit), noir.
 *
 * Differenciation vs PolyMatter :
 *   - Renomme left/right -> colA/colB (generique)
 *   - kind="country|company|era|actor|custom" change rendu pill
 *   - Background paramatique avec decor adapte (cercles, grain kraft, points, rien)
 *   - Source line en bas (signature Souverain rigueur)
 *   - Verdict optionnel : phrase courte qui souligne l'ecart ("Avantage : Chine x6")
 *   - Underline styles : slab plein, manuscrit (dashes), fine
 *   - Font headers : Bebas Neue partout (continuite lib)
 *
 * Animations :
 *   - Pills slide-down spring (8f offset)
 *   - Rangees cascadent (icone fade-in + chiffre + souligne draw)
 *   - Verdict apparait en dernier (slide-up)
 */

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type ComparisonBackground = "accent" | "kraft" | "dossier" | "noir";
export type ColumnKind = "country" | "company" | "era" | "actor" | "custom";
export type UnderlineStyle = "slab" | "fine" | "dashed";

interface ColumnHeader {
  label: string;
  /** Couleur signature de la colonne (slab + pill) */
  color: string;
  /** Sous-label discret (ex: drapeau emoji, role, dates pour ere) */
  subLabel?: string;
  /** Petit logo carre simple (ex: <FlagIcon/> pour pays, logo entreprise) */
  badge?: React.ReactNode;
  kind?: ColumnKind;
}

interface ComparisonRow {
  icon?: React.ReactNode;
  label: string;
  valueA: string;
  valueB: string;
}

interface ComparisonTableProps {
  colA: ColumnHeader;
  colB: ColumnHeader;
  rows: ComparisonRow[];
  background?: ComparisonBackground;
  /** Phrase courte affichee en bas (signature narrative Souverain) */
  verdict?: string;
  source?: string;
  title?: string;
  subtitle?: string;
  underlineStyle?: UnderlineStyle;
  width?: number;
  height?: number;
}

const BG: Record<
  ComparisonBackground,
  { bg: string; ink: string; muted: string; decor: "circles" | "grain" | "dots" | "none" }
> = {
  accent: { bg: "#a82e2e", ink: "#ffffff", muted: "#f0d8d2", decor: "circles" },
  kraft: { bg: "#d4b895", ink: "#2a1f12", muted: "#5a4830", decor: "grain" },
  dossier: { bg: "#0d1628", ink: "#e6e9f0", muted: "#5a6a82", decor: "dots" },
  noir: { bg: "#0a0a0a", ink: "#f0e8d8", muted: "#7a7060", decor: "none" },
};

const ROW_DELAY = 18;
const PILL_DELAY = 8;

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  colA,
  colB,
  rows,
  background = "accent",
  verdict,
  source,
  title,
  subtitle,
  underlineStyle = "slab",
  width = 1080,
  height = 1920,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const palette = BG[background];

  // Layout
  const ICON_X = 130;
  const LABEL_X = 250;
  const COL_A_X = 670;
  const COL_B_X = 920;
  const UNDERLINE_HALF = 80;

  const TITLE_Y = 240;
  const HEADER_Y = 540;
  const ROW_START_Y = 760;
  const ROW_GAP = 270;

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 24,
  });

  const pillAProgress = spring({
    frame: frame - 6,
    fps,
    config: { damping: 90, stiffness: 75 },
    durationInFrames: 28,
  });

  const pillBProgress = spring({
    frame: frame - 6 - PILL_DELAY,
    fps,
    config: { damping: 90, stiffness: 75 },
    durationInFrames: 28,
  });

  const rowsStart = 28;
  const rowProgress = (i: number) =>
    spring({
      frame: frame - rowsStart - i * ROW_DELAY,
      fps,
      config: { damping: 100, stiffness: 70 },
      durationInFrames: 32,
    });

  const underlineProgress = (i: number) =>
    spring({
      frame: frame - rowsStart - i * ROW_DELAY - 8,
      fps,
      config: { damping: 100, stiffness: 60 },
      durationInFrames: 25,
    });

  const verdictStart = rowsStart + rows.length * ROW_DELAY + 12;
  const verdictProgress = spring({
    frame: frame - verdictStart,
    fps,
    config: { damping: 100, stiffness: 70 },
    durationInFrames: 28,
  });

  // Decor deterministe
  const grain = React.useMemo(() => {
    const result: { x: number; y: number; op: number; r: number }[] = [];
    let seed = 837;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      return (seed >>> 0) / 0xffffffff;
    };
    for (let i = 0; i < 800; i++) {
      result.push({
        x: rand() * width,
        y: rand() * height,
        op: rand() * 0.06 + 0.02,
        r: rand() < 0.1 ? 1.5 : 0.7,
      });
    }
    return result;
  }, [width, height]);

  const dots = React.useMemo(() => {
    const result: { x: number; y: number }[] = [];
    const step = 60;
    for (let x = step; x < width; x += step) {
      for (let y = step; y < height; y += step) {
        result.push({ x, y });
      }
    }
    return result;
  }, [width, height]);

  const renderUnderline = (
    cx: number,
    progress: number,
    color: string,
    yPos: number
  ) => {
    const startX = cx - UNDERLINE_HALF;
    const endX = interpolate(progress, [0, 1], [startX, cx + UNDERLINE_HALF]);
    if (underlineStyle === "slab") {
      return (
        <line
          x1={startX}
          y1={yPos}
          x2={endX}
          y2={yPos}
          stroke={color}
          strokeWidth="5"
          strokeLinecap="square"
        />
      );
    }
    if (underlineStyle === "dashed") {
      return (
        <line
          x1={startX}
          y1={yPos}
          x2={endX}
          y2={yPos}
          stroke={color}
          strokeWidth="3"
          strokeDasharray="6 5"
        />
      );
    }
    // fine
    return (
      <line
        x1={startX}
        y1={yPos}
        x2={endX}
        y2={yPos}
        stroke={color}
        strokeWidth="1.5"
      />
    );
  };

  return (
    <AbsoluteFill style={{ background: palette.bg }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* DECOR par background */}
        {palette.decor === "circles" && (
          <g>
            <circle cx={width} cy={0} r={260} fill={palette.ink} opacity="0.07" />
            <circle cx={0} cy={height} r={300} fill={palette.ink} opacity="0.06" />
            <circle cx={width - 60} cy={height - 80} r={120} fill={palette.ink} opacity="0.05" />
          </g>
        )}
        {palette.decor === "grain" && (
          <g opacity="0.7">
            {grain.map((g, i) => (
              <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={palette.muted} opacity={g.op} />
            ))}
          </g>
        )}
        {palette.decor === "dots" && (
          <g opacity="0.18">
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r="1.2" fill={palette.muted} />
            ))}
          </g>
        )}

        {/* TITLE / SUBTITLE */}
        {title && (
          <g opacity={titleProgress}>
            <text
              x={width / 2}
              y={TITLE_Y}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize="48"
              fontWeight="700"
              fill={palette.ink}
              letterSpacing="4"
            >
              {title.toUpperCase()}
            </text>
            {subtitle && (
              <text
                x={width / 2}
                y={TITLE_Y + 42}
                textAnchor="middle"
                fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                fontSize="18"
                fill={palette.muted}
                letterSpacing="3"
              >
                {subtitle.toUpperCase()}
              </text>
            )}
            <line
              x1={width / 2 - 60}
              y1={TITLE_Y + (subtitle ? 70 : 28)}
              x2={width / 2 + 60}
              y2={TITLE_Y + (subtitle ? 70 : 28)}
              stroke={palette.muted}
              strokeWidth="2"
              opacity="0.6"
            />
          </g>
        )}

        {/* PILLS COLONNES */}
        {[
          { col: colA, x: COL_A_X, prog: pillAProgress },
          { col: colB, x: COL_B_X, prog: pillBProgress },
        ].map(({ col, x, prog }, i) => {
          const pillW = 170;
          const pillH = 56;
          const pillX = x - pillW / 2;
          const pillY = HEADER_Y - pillH / 2;
          const slideY = interpolate(prog, [0, 1], [-25, 0]);
          return (
            <g key={i} opacity={prog}>
              <rect
                x={pillX}
                y={pillY + slideY}
                width={pillW}
                height={pillH}
                fill={col.color}
                rx="2"
              />
              {col.badge && (
                <g transform={`translate(${pillX + 12} ${pillY + slideY + 12})`}>
                  {col.badge}
                </g>
              )}
              <text
                x={x + (col.badge ? 18 : 0)}
                y={pillY + slideY + 38}
                textAnchor="middle"
                fontFamily="'Bebas Neue', 'Impact', sans-serif"
                fontSize="28"
                fontWeight="700"
                fill="#1a1a1a"
                letterSpacing="3"
              >
                {col.label}
              </text>
              {col.subLabel && (
                <text
                  x={x}
                  y={pillY + slideY + pillH + 26}
                  textAnchor="middle"
                  fontFamily="'IBM Plex Mono', 'Courier New', monospace"
                  fontSize="15"
                  fill={palette.muted}
                  letterSpacing="2"
                >
                  {col.subLabel.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {/* ROWS */}
        {rows.map((row, i) => {
          const y = ROW_START_Y + i * ROW_GAP;
          const prog = rowProgress(i);
          const upA = underlineProgress(i);
          const upB = underlineProgress(i);
          return (
            <g key={i} opacity={prog}>
              <g
                transform={`translate(${ICON_X - 70} ${y - 70})`}
                opacity={prog}
              >
                {row.icon || (
                  <rect width="140" height="140" fill={palette.ink} opacity="0.25" rx="4" />
                )}
              </g>

              {row.label.split("\n").map((line, li) => (
                <text
                  key={li}
                  x={LABEL_X}
                  y={y - 12 + li * 38}
                  fontFamily="'Bebas Neue', 'Impact', sans-serif"
                  fontSize="34"
                  fontWeight="700"
                  fill={palette.ink}
                  letterSpacing="2"
                >
                  {line}
                </text>
              ))}

              <text
                x={COL_A_X}
                y={y + 8}
                textAnchor="middle"
                fontFamily="'Roboto Slab', 'Georgia', serif"
                fontSize="38"
                fontWeight="700"
                fill={palette.ink}
              >
                {row.valueA}
              </text>
              {renderUnderline(COL_A_X, upA, colA.color, y + 18)}

              <text
                x={COL_B_X}
                y={y + 8}
                textAnchor="middle"
                fontFamily="'Roboto Slab', 'Georgia', serif"
                fontSize="38"
                fontWeight="700"
                fill={palette.ink}
              >
                {row.valueB}
              </text>
              {renderUnderline(COL_B_X, upB, colB.color, y + 18)}
            </g>
          );
        })}

        {/* VERDICT */}
        {verdict && (
          <g opacity={verdictProgress}>
            <line
              x1={width / 2 - 80}
              y1={ROW_START_Y + rows.length * ROW_GAP - 30}
              x2={width / 2 + 80}
              y2={ROW_START_Y + rows.length * ROW_GAP - 30}
              stroke={palette.muted}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <text
              x={width / 2}
              y={ROW_START_Y + rows.length * ROW_GAP + 20}
              textAnchor="middle"
              fontFamily="'Bebas Neue', 'Impact', sans-serif"
              fontSize="44"
              fontWeight="700"
              fill={palette.ink}
              letterSpacing="3"
              style={{
                transform: `translateY(${interpolate(verdictProgress, [0, 1], [16, 0])}px)`,
              }}
            >
              {verdict.toUpperCase()}
            </text>
          </g>
        )}

        {/* SOURCE */}
        {source && (
          <g>
            <line
              x1="80"
              y1={height - 90}
              x2={width - 80}
              y2={height - 90}
              stroke={palette.muted}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <text
              x="80"
              y={height - 60}
              fontFamily="'IBM Plex Mono', 'Courier New', monospace"
              fontSize="14"
              fill={palette.muted}
              letterSpacing="2"
            >
              SOURCE : {source.toUpperCase()}
            </text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};

// =============================================================================
// FLAT ICONS — silhouettes simples reutilisables
// =============================================================================

export const FighterIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <polygon points="60,10 65,55 110,75 110,82 65,72 65,90 78,98 78,104 60,100 42,104 42,98 55,90 55,72 10,82 10,75 55,55" />
    </g>
  </svg>
);

export const TroopsIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <ellipse cx="60" cy="58" rx="40" ry="22" />
      <rect x="20" y="56" width="80" height="8" />
      <rect x="32" y="64" width="56" height="6" opacity="0.6" />
    </g>
  </svg>
);

export const SubmarineIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <ellipse cx="60" cy="65" rx="48" ry="14" />
      <rect x="52" y="44" width="16" height="22" rx="2" />
      <rect x="58" y="34" width="3" height="14" />
      <circle cx="38" cy="65" r="3" fill="#1a1a1a" />
      <circle cx="78" cy="65" r="3" fill="#1a1a1a" />
    </g>
  </svg>
);

export const ShipIconFlat: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <path d="M 12 70 L 24 88 L 96 88 L 108 70 Z" />
      <rect x="28" y="58" width="60" height="12" />
      <rect x="68" y="42" width="20" height="16" />
    </g>
  </svg>
);

export const TankIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <rect x="14" y="68" width="92" height="18" rx="3" />
      <rect x="32" y="50" width="52" height="20" rx="2" />
      <rect x="84" y="55" width="28" height="6" />
      <circle cx="24" cy="92" r="6" />
      <circle cx="44" cy="92" r="6" />
      <circle cx="64" cy="92" r="6" />
      <circle cx="84" cy="92" r="6" />
    </g>
  </svg>
);

// Icones thematiques Souverain
export const UraniumIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <circle cx="60" cy="60" r="14" />
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke={color} strokeWidth="5" />
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke={color} strokeWidth="5" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="46" ry="18" fill="none" stroke={color} strokeWidth="5" transform="rotate(120 60 60)" />
      <circle cx="106" cy="60" r="5" />
      <circle cx="37" cy="100" r="5" />
      <circle cx="37" cy="20" r="5" />
    </g>
  </svg>
);

export const MoneyIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g>
      <rect x="10" y="28" width="100" height="64" rx="3" fill={color} />
      <rect x="14" y="32" width="92" height="56" rx="2" fill="none" stroke={color === "#ffffff" ? "#0a0a0a" : "#fff"} strokeWidth="2" opacity="0.4" />
      <text x="60" y="74" textAnchor="middle" fontFamily="'Roboto Slab', Georgia, serif" fontSize="44" fontWeight="900" fill={color === "#ffffff" ? "#0a0a0a" : "#fff"}>$</text>
    </g>
  </svg>
);

export const PercentIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <circle cx="32" cy="32" r="18" />
      <circle cx="32" cy="32" r="8" fill="#0d1628" />
      <circle cx="88" cy="88" r="18" />
      <circle cx="88" cy="88" r="8" fill="#0d1628" />
      <rect x="55" y="16" width="10" height="90" transform="rotate(30 60 60)" />
    </g>
  </svg>
);

export const FlagIconFlat: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = "#1a1a1a",
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32">
    <g fill={color}>
      <rect x="6" y="4" width="2" height="24" />
      <path d="M 8 4 L 28 4 L 24 12 L 28 20 L 8 20 Z" />
    </g>
  </svg>
);

export const PeopleGroupIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 140,
  color = "#ffffff",
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill={color}>
      <circle cx="34" cy="44" r="14" />
      <path d="M 12 96 Q 12 70 34 70 Q 56 70 56 96 Z" />
      <circle cx="86" cy="44" r="14" />
      <path d="M 64 96 Q 64 70 86 70 Q 108 70 108 96 Z" />
    </g>
  </svg>
);
