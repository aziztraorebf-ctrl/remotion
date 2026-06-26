// ARCHIVE — source historique Mansa Moussa V2. Source de verite pour tout nouvel episode : src/projects/atlas/_shared/atlas-components.tsx
// Atlas V2 reusable components — shared across all Mansa Moussa scenes (Hook, S1, S2, S3, S4, CTA).
// Pattern: d3-geo precompute + Remotion SVG overlays.
// Validated 2026-04-30 on S3 Climax Hadj Iter2.
import React from "react";
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import data from "./atlas-v2-data.json";

// =============================================================================
// PALETTE
// =============================================================================
export const ATLAS_COLORS = {
  bgTop: "#1A1F3A",
  bgBottom: "#2A1F2E",
  ocean: "#3A5A7E",
  oceanDeep: "#3A5A7E",
  land: "#C97D5A",
  landStroke: "#5A3A2A",
  maliFill: "#F5EBD8",
  egyptFill: "#E8B894",
  empireGold: "#D4A574",
  empireFillCream: "#F5EBD8",
  empireOutlineDark: "#1A1A1A", // noir mat pour outline empire (lisibilite)
  haloGold: "#D4A574",
  haloWhite: "#FFFFFF",
  star: "#FFFFFF",
  cream: "#F2E5C8",
  textGold: "#E8C97D",
  textInk: "#3A2A18",
  pulseRing: "#FFFFFF",
};

// National colors (off par defaut, opt-in via prop dans AtlasMercator)
// Useful for episodes where focus is modern (comparaisons taille/PIB).
// Pour Mansa Moussa: NE PAS activer (anachronisme empire historique vs moderne).
export const NATIONAL_COLORS: Record<string, string> = {
  MLI: "#14B53A", // vert Mali
  EGY: "#CE1126", // rouge Egypte
  MAR: "#C1272D", // rouge Maroc
  SEN: "#00853F", // vert Senegal
  GIN: "#CE1126", // rouge Guinee
  CIV: "#FF8200", // orange Cote d'Ivoire
  GHA: "#FCD116", // jaune Ghana
  NGA: "#008751", // vert Nigeria
  ETH: "#078930", // vert Ethiopie
  KEN: "#BB0000", // rouge Kenya
  ZAF: "#FFB81C", // jaune Afrique du Sud
  TCD: "#002664", // bleu Tchad
  NER: "#0DB02B", // vert Niger
  BFA: "#EF2B2D", // rouge Burkina Faso
  CMR: "#007A5E", // vert Cameroun
  DZA: "#006233", // vert Algerie
  TUN: "#E70013", // rouge Tunisie
  LBY: "#239E46", // vert Libye
};

// =============================================================================
// STARS BACKGROUND
// =============================================================================
const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = i * 9301 + 49297;
  return {
    x: (seed * 17) % 720,
    y: (seed * 31) % 1280,
    size: 0.5 + ((seed * 13) % 100) / 100,
    opacity: 0.4 + ((seed * 23) % 100) / 200,
  };
});

export const AtlasSubtleStars: React.FC<{ opacity?: number }> = ({
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();
  return (
    <g opacity={opacity}>
      {STARS.map((s, i) => {
        const tw = 0.7 + 0.3 * Math.sin(frame * 0.05 + i * 0.7);
        return (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill={ATLAS_COLORS.star}
            opacity={s.opacity * tw}
          />
        );
      })}
    </g>
  );
};

// =============================================================================
// CARTOUCHE — chiffre-choc + Cormorant + wobble + fadeOut chain
// =============================================================================
export interface AtlasCartoucheProps {
  appearAt: number;
  disappearAt?: number;
  text: string;
  subtext?: string;
  x: number;
  y: number;
  fontSize?: number;
}

export const AtlasCartouche: React.FC<AtlasCartoucheProps> = ({
  appearAt,
  disappearAt,
  text,
  subtext,
  x,
  y,
  fontSize = 44,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearAt) return null;
  if (disappearAt !== undefined && frame >= disappearAt) return null;
  const localFrame = frame - appearAt;
  const t = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });
  const scale = interpolate(t, [0, 1], [0, 1]);
  const wobble = Math.sin(localFrame * 0.08) * 0.5;
  const fadeOut =
    disappearAt !== undefined
      ? interpolate(frame, [disappearAt - 10, disappearAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  const opacity = t * fadeOut;

  return (
    <g
      transform={`translate(${x} ${y}) rotate(${-1.5 + wobble}) scale(${scale})`}
      opacity={opacity}
    >
      <rect
        x="-180"
        y="-60"
        width="360"
        height="120"
        fill={ATLAS_COLORS.cream}
        stroke={ATLAS_COLORS.empireGold}
        strokeWidth="3"
        rx="8"
      />
      <text
        x="0"
        y={subtext ? -8 : 12}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={ATLAS_COLORS.textInk}
      >
        {text}
      </text>
      {subtext && (
        <text
          x="0"
          y="32"
          textAnchor="middle"
          fontFamily="Cormorant Garamond, serif"
          fontSize="22"
          fontWeight="500"
          fill={ATLAS_COLORS.textInk}
          opacity="0.85"
        >
          {subtext}
        </text>
      )}
    </g>
  );
};

// =============================================================================
// LABEL — pill auto-width + spring entry
// =============================================================================
export interface AtlasLabelProps {
  coord: [number, number];
  text: string;
  appearAt: number;
  offsetX?: number;
  offsetY?: number;
  charW?: number;
  padding?: number;
  fontSize?: number;
}

export const AtlasLabel: React.FC<AtlasLabelProps> = ({
  coord,
  text,
  appearAt,
  offsetX = 14,
  offsetY = -32,
  charW = 16,
  padding = 36,
  fontSize = 26,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < appearAt) return null;
  const localFrame = frame - appearAt;
  const t = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 220 },
  });
  const opacity = interpolate(t, [0, 1], [0, 1]);
  const sc = interpolate(t, [0, 1], [0.6, 1]);
  const w = text.length * charW + padding;
  const h = 38;
  const lx = coord[0] + offsetX;
  const ly = coord[1] + offsetY;
  return (
    <g
      transform={`translate(${lx} ${ly}) scale(${sc}) translate(${-lx} ${-ly})`}
      opacity={opacity}
    >
      <rect
        x={lx - w / 2}
        y={ly - h / 2}
        width={w}
        height={h}
        rx="6"
        fill={ATLAS_COLORS.cream}
        stroke={ATLAS_COLORS.textInk}
        strokeWidth="2"
      />
      <text
        x={lx}
        y={ly + 9}
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={ATLAS_COLORS.textInk}
        letterSpacing="1"
      >
        {text}
      </text>
    </g>
  );
};

// =============================================================================
// PULSE MARKER — ring blanc + dot dore stroke noir
// =============================================================================
export interface AtlasPulseMarkerProps {
  coord: [number, number];
  beatStart: number;
  color?: string;
  ringInner?: number;
  ringOuter?: number;
}

export const AtlasPulseMarker: React.FC<AtlasPulseMarkerProps> = ({
  coord,
  beatStart,
  color = ATLAS_COLORS.empireGold,
  ringInner = 4,
  ringOuter = 18,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < beatStart) return null;
  const t = (frame - beatStart) / fps;
  const pulse = Math.max(0, 1 - (t % 1.5) / 1.5);
  return (
    <g>
      <circle
        cx={coord[0]}
        cy={coord[1]}
        r={ringInner + pulse * ringOuter}
        fill="none"
        stroke={ATLAS_COLORS.pulseRing}
        strokeWidth="3"
        opacity={(1 - pulse) * 0.95}
      />
      <circle
        cx={coord[0]}
        cy={coord[1]}
        r="6"
        fill={color}
        stroke={ATLAS_COLORS.textInk}
        strokeWidth="1.5"
      />
    </g>
  );
};

// =============================================================================
// CARAVANE — chibi + path or + halo blanc + hopping vertical
// =============================================================================
export interface AtlasCaravaneProps {
  startFrame: number;
  endFrame: number;
  pathD: string;
  pathTotalLength: number;
  waypoints: [number, number][];
  chibiSrc?: string;
  chibiSize?: number;
  showHaloOnPath?: boolean; // halo blanc autour stroke or pour lisibilite sur terre claire
}

export const AtlasCaravane: React.FC<AtlasCaravaneProps> = ({
  startFrame,
  endFrame,
  pathD,
  pathTotalLength,
  waypoints,
  chibiSrc = "atlas-mansa-moussa/v2/chibi/caravane-A.png",
  chibiSize = 100,
  showHaloOnPath = true,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const t = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = pathTotalLength * (1 - t);

  const segmentT = t * (waypoints.length - 1);
  const segIdx = Math.min(Math.floor(segmentT), waypoints.length - 2);
  const localT = segmentT - segIdx;
  const p1 = waypoints[segIdx];
  const p2 = waypoints[segIdx + 1];
  const cx = p1[0] + (p2[0] - p1[0]) * localT;
  const cy = p1[1] + (p2[1] - p1[1]) * localT;

  const hopY = Math.abs(Math.sin(frame * 0.4)) * 5;

  return (
    <g>
      {/* Halo blanc large pour lisibilite sur terre claire (Egypte/Sinai/Arabie) */}
      {showHaloOnPath && (
        <path
          d={pathD}
          fill="none"
          stroke={ATLAS_COLORS.haloWhite}
          strokeWidth="9"
          strokeDasharray={pathTotalLength}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      )}
      {/* Halo or doux */}
      <path
        d={pathD}
        fill="none"
        stroke="#FFE9C2"
        strokeWidth="7"
        strokeDasharray={pathTotalLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      {/* Stroke principal or */}
      <path
        d={pathD}
        fill="none"
        stroke={ATLAS_COLORS.empireGold}
        strokeWidth="3.2"
        strokeDasharray={pathTotalLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Chibi caravane (frame A seul + hopping) */}
      <image
        href={staticFile(chibiSrc)}
        x={cx - chibiSize / 2}
        y={cy - chibiSize - 5 + hopY}
        width={chibiSize}
        height={chibiSize}
        preserveAspectRatio="xMidYMid meet"
      />
    </g>
  );
};

// =============================================================================
// EMPIRE OVERLAY — Mali Empire 1300 hatch + outline noir mat
// =============================================================================
export interface AtlasEmpireProps {
  pathD: string;
  outlineDark?: boolean; // si true: stroke noir mat (lisibilite max). Sinon cream.
  hatchOpacity?: number;
}

export const AtlasEmpire: React.FC<AtlasEmpireProps> = ({
  pathD,
  outlineDark = true,
  hatchOpacity = 0.85,
}) => {
  const stroke = outlineDark
    ? ATLAS_COLORS.empireOutlineDark
    : ATLAS_COLORS.empireFillCream;
  return (
    <>
      <path
        d={pathD}
        fill={ATLAS_COLORS.empireFillCream}
        fillOpacity="0.18"
        stroke="none"
      />
      <path
        d={pathD}
        fill="url(#empireHatch)"
        fillOpacity={hatchOpacity}
        stroke={stroke}
        strokeWidth="3"
        strokeOpacity="0.95"
        strokeLinejoin="round"
        strokeDasharray="10 5"
      />
    </>
  );
};

// =============================================================================
// MERCATOR MAP — vue plate avec scale/drift/center offset, optional national colors
// =============================================================================
export interface AtlasMercatorProps {
  countries: { iso: string; d: string }[];
  highlightIso?: string[]; // pays a fill custom (Mali cream, Egypte beige)
  highlightFills?: Record<string, string>;
  useNationalColors?: boolean; // off par defaut. Pour episodes modernes.
  driftX?: number;
  driftY?: number;
  scale?: number;
  centerOffsetX?: number;
  centerOffsetY?: number;
  rotation?: number; // degrees, autour du centre viewBox
  width?: number;
  height?: number;
}

export const AtlasMercator: React.FC<AtlasMercatorProps> = ({
  countries,
  highlightIso = [],
  highlightFills = {},
  useNationalColors = false,
  driftX = 0,
  driftY = 0,
  scale = 1,
  centerOffsetX = 0,
  centerOffsetY = 0,
  rotation = 0,
  width = 720,
  height = 1280,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  const getFill = (iso: string): string => {
    if (highlightFills[iso]) return highlightFills[iso];
    if (useNationalColors && NATIONAL_COLORS[iso]) return NATIONAL_COLORS[iso];
    return ATLAS_COLORS.land;
  };

  return (
    <g
      transform={`translate(${cx + driftX - centerOffsetX} ${cy + driftY - centerOffsetY}) rotate(${rotation}) scale(${scale}) translate(${-cx} ${-cy})`}
    >
      <rect
        x="-300"
        y="-300"
        width={width + 600}
        height={height + 600}
        fill={ATLAS_COLORS.oceanDeep}
      />
      {countries.map((c) => (
        <path
          key={c.iso}
          d={c.d}
          fill={getFill(c.iso)}
          stroke={ATLAS_COLORS.landStroke}
          strokeWidth="0.6"
          strokeOpacity="0.7"
        />
      ))}
    </g>
  );
};

// =============================================================================
// GLOBE ORTHOGRAPHIC — vue espace avec halo + ciel etoile
// =============================================================================
export interface AtlasGlobeProps {
  countries: { iso: string; d: string }[];
  highlightIso?: string[];
  highlightFills?: Record<string, string>;
  useNationalColors?: boolean;
  rotation?: number;
  scale?: number;
  centerX?: number;
  centerY?: number;
  showHalo?: boolean;
  haloRadius?: number;
}

export const AtlasGlobe: React.FC<AtlasGlobeProps> = ({
  countries,
  highlightFills = {},
  useNationalColors = false,
  rotation = 0,
  scale = 1,
  centerX = 360,
  centerY = 640,
  showHalo = true,
  haloRadius = 320,
}) => {
  const getFill = (iso: string): string => {
    if (highlightFills[iso]) return highlightFills[iso];
    if (useNationalColors && NATIONAL_COLORS[iso]) return NATIONAL_COLORS[iso];
    return ATLAS_COLORS.land;
  };

  return (
    <g>
      {showHalo && (
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={haloRadius * scale + 30}
            fill="none"
            stroke={ATLAS_COLORS.haloGold}
            strokeWidth="2"
            opacity="0.15"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={haloRadius * scale + 12}
            fill="none"
            stroke={ATLAS_COLORS.haloGold}
            strokeWidth="3"
            opacity="0.35"
          />
        </g>
      )}
      <g
        transform={`translate(${centerX} ${centerY}) rotate(${rotation}) scale(${scale}) translate(${-centerX} ${-centerY})`}
      >
        <circle
          cx={centerX}
          cy={centerY}
          r={haloRadius}
          fill={ATLAS_COLORS.oceanDeep}
        />
        {countries.map((c) => (
          <path
            key={c.iso}
            d={c.d}
            fill={getFill(c.iso)}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.4"
            strokeOpacity="0.7"
          />
        ))}
      </g>
    </g>
  );
};

// =============================================================================
// EMPIRE HATCH PATTERN — defs reutilisable pour SVG <defs>
// =============================================================================
export const AtlasDefs: React.FC = () => (
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={ATLAS_COLORS.bgTop} />
      <stop offset="100%" stopColor={ATLAS_COLORS.bgBottom} />
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
    </radialGradient>
    <pattern
      id="empireHatch"
      patternUnits="userSpaceOnUse"
      width="6"
      height="6"
      patternTransform="rotate(45)"
    >
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="6"
        stroke={ATLAS_COLORS.empireFillCream}
        strokeWidth="2"
        opacity="0.75"
      />
    </pattern>
  </defs>
);

// =============================================================================
// SPRING CAMERA HOOK — bump scale on arrival + continuous drift
// =============================================================================
export interface SpringCameraConfig {
  frame: number;
  fps: number;
  arrivalFrame?: number; // si defini, bump scale a ce frame
  bumpAmount?: number; // +0.08 par defaut
  driftAmplitudeX?: number;
  driftAmplitudeY?: number;
  driftSpeedX?: number;
  driftSpeedY?: number;
}

export interface SpringCameraResult {
  driftX: number;
  driftY: number;
  bumpScale: number;
}

export const useSpringCamera = (
  config: SpringCameraConfig
): SpringCameraResult => {
  const {
    frame,
    fps,
    arrivalFrame,
    bumpAmount = 0.08,
    driftAmplitudeX = 18,
    driftAmplitudeY = 10,
    driftSpeedX = 0.014,
    driftSpeedY = 0.011,
  } = config;

  const driftX = Math.sin(frame * driftSpeedX) * driftAmplitudeX;
  const driftY = Math.cos(frame * driftSpeedY) * driftAmplitudeY;

  let bumpScale = 1;
  if (arrivalFrame !== undefined && frame >= arrivalFrame) {
    const localFrame = frame - arrivalFrame;
    const bumpT = spring({
      frame: localFrame,
      fps,
      config: { damping: 8, stiffness: 180 },
    });
    // Bump goes up then settles back: 0 -> 1 -> 0
    const bumpCurve = Math.sin(bumpT * Math.PI);
    bumpScale = 1 + bumpAmount * bumpCurve;
  }

  return { driftX, driftY, bumpScale };
};

// =============================================================================
// CARAVANE WAYPOINT HELPER — pour assembler les paths Niani -> Mecque
// =============================================================================
export const estimateWaypointsLength = (
  waypoints: [number, number][],
  marginFactor = 1.15
): number => {
  let lenEstimate = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const dx = waypoints[i + 1][0] - waypoints[i][0];
    const dy = waypoints[i + 1][1] - waypoints[i][1];
    lenEstimate += Math.sqrt(dx * dx + dy * dy);
  }
  return lenEstimate * marginFactor;
};

// Re-export data for convenience
export { data as atlasV2Data };
