// Atlas V2 reusable components — shared across all Mansa Moussa scenes (Hook, S1, S2, S3, S4, CTA).
// Pattern: d3-geo precompute + Remotion SVG overlays.
// Validated 2026-04-30 on S3 Climax Hadj Iter2.
import React from "react";
import {
  AbsoluteFill,
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
// CAMERA UTILITIES — 2-layer SVG+CSS architecture (standard Atlas >= 2026-05-05)
//
// Standard Atlas composition: SVG 720x1280 viewBox, CSS 1080x1920 (CSS_SCALE=1.5)
// Layer 1: SVG <g transform="translate(CX+drift CY+drift) scale(zoom) translate(-focusX -focusY)">
// Layer 2: CSS assets positioned via svgToComp()
//
// Zoom references (validated Beat3Ghana + Beat1Hannibal):
//   1.0 = vue large narrative
//   2.8 = zoom standard POI (ville, personnage en marche)
//   3.2 = insert détail (gros plan objet, crouch)
//   MAX without 2-layer arch: ~1.5x (sortie de cadre garantie au-delà)
// =============================================================================

export const ATLAS_SVG_W = 720;
export const ATLAS_SVG_H = 1280;
export const ATLAS_CSS_SCALE = 1.5; // 1080 / 720
export const ATLAS_CX = ATLAS_SVG_W / 2; // 360
export const ATLAS_CY = ATLAS_SVG_H / 2; // 640

export interface AtlasCameraState {
  focusX: number;
  focusY: number;
  camZoom: number;
  driftX: number;
  driftY: number;
  scaleY?: number; // perspective tilt — 1.0 default (flat), <1.0 pour effet relief
}

/**
 * Convertit coordonnées espace SVG (720×1280) → pixels CSS composition (1080×1920).
 * Tient compte du focus caméra, zoom, drift et perspective optionnelle.
 *
 * Usage:
 *   const pos = svgToComp(POI_SVG_X, POI_SVG_Y, cam);
 *   <div style={{ position: "absolute", left: pos.x, top: pos.y }} />
 */
export function svgToComp(
  svgX: number,
  svgY: number,
  cam: AtlasCameraState,
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.focusX) * cam.camZoom + ATLAS_CX + cam.driftX;
  const scaleY = cam.scaleY ?? 1.0;
  const screenSvgY = (svgY - cam.focusY) * cam.camZoom * scaleY + ATLAS_CY + cam.driftY;
  return { x: screenSvgX * ATLAS_CSS_SCALE, y: screenSvgY * ATLAS_CSS_SCALE };
}

/**
 * Calcule le focusX décalé pour garder un POI proche du bord visible à haut zoom.
 *
 * Problème: à 2.8x, un POI à x=517 centré exactement → screenX = (517-360)*2.8+360 = 799 SVG = 1199 CSS (hors cadre).
 * Solution: décaler focusX vers l'intérieur de screenMargin/zoom pixels.
 *
 * @param poiSvgX   Coordonnée X du POI en espace SVG (720px)
 * @param camZoom   Niveau de zoom caméra (ex: 2.8)
 * @param screenMargin  Marge souhaitée entre le bord du canvas et le POI (défaut: 100px SVG)
 * @returns focusX décalé à passer à computeCamera()
 *
 * Exemple Beat1Hannibal: focusOffsetForPOI(517, 2.8) = 417
 *   → (517-417)*2.8+360 = 640 SVG = 960 CSS → Rome visible tiers droit ✓
 */
export function focusOffsetForPOI(
  poiSvgX: number,
  camZoom: number,
  screenMargin: number = 100,
): number {
  return poiSvgX - screenMargin;
}

// =============================================================================
// SPRITE ANIMATION UTILITIES — walk cycle + clipPath masking (standard Atlas)
//
// Pattern validé Beat3Ghana (Berbere/Sahelien) + Beat1-2 Empire Ghana.
// Utiliser sin-based hopping pour sprites STATIQUES (pas de vrai walk cycle):
//   y += Math.abs(Math.sin(frame * 0.3)) * 4  (documenté ATLAS-COMPOSANTS.md)
// =============================================================================

/**
 * Calcule le frame d'animation courant pour un sprite en spritesheet horizontale.
 * @param frame           Frame Remotion courant
 * @param startFrame      Frame où l'animation commence
 * @param frameHoldDur    Nombre de frames par frame d'animation (ex: 5 = 6fps à 30fps)
 * @param totalFrames     Nombre total de frames dans le cycle (ex: 4 pour walk cycle)
 */
export function getSpriteAnimFrame(
  frame: number,
  startFrame: number,
  frameHoldDur: number,
  totalFrames: number,
): number {
  if (frame < startFrame) return 0;
  return Math.floor((frame - startFrame) / frameHoldDur) % totalFrames;
}

/**
 * Génère le clipPath CSS pour afficher un frame d'une spritesheet horizontale.
 * Compatible avec <Img> Remotion + spritesheet PixelLab (frames côte à côte).
 * @param animFrame    Frame courant (sortie de getSpriteAnimFrame)
 * @param totalFrames  Nombre total de frames dans la spritesheet
 */
export function getSpriteClipPath(animFrame: number, totalFrames: number): string {
  const pctLeft = (animFrame / totalFrames) * 100;
  const pctRight = ((totalFrames - animFrame - 1) / totalFrames) * 100;
  return `inset(0 ${pctRight.toFixed(2)}% 0 ${pctLeft.toFixed(2)}%)`;
}

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
  showHaloOnPath?: boolean;
  hopAmplitude?: number; // 0 = statique, 5 = defaut caravane
  walkFrames?: string[]; // si fourni, cycle les frames au lieu de chibiSrc statique
  walkSpeed?: number; // frames par sprite (defaut 4)
  tOffset?: number; // 0-1, decalage de position sur le chemin (plusieurs guerriers)
  flipX?: boolean; // miroir horizontal (pour guerriers allant vers la gauche)
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
  hopAmplitude = 5,
  walkFrames,
  walkSpeed = 4,
  tOffset = 0,
  flipX = false,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  // Fade-in sur 12 frames pour eviter le pop brutal
  const fadeIn = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rawT = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // tOffset > 0 = guerrier en retard (position derriere le leader)
  const t = Math.max(0, Math.min(1, rawT - tOffset));
  const dashOffset = pathTotalLength * (1 - rawT);

  const segmentT = t * (waypoints.length - 1);
  const segIdx = Math.min(Math.floor(segmentT), waypoints.length - 2);
  const localT = segmentT - segIdx;
  const p1 = waypoints[segIdx];
  const p2 = waypoints[segIdx + 1];
  const cx = p1[0] + (p2[0] - p1[0]) * localT;
  const cy = p1[1] + (p2[1] - p1[1]) * localT;

  // Arret de la marche quand le guerrier arrive en fin de chemin (t > 0.95)
  const isArrived = t >= 0.95;
  const hopY = isArrived ? 0 : Math.abs(Math.sin(frame * 0.4)) * hopAmplitude;

  const spriteSrc = walkFrames && walkFrames.length > 0
    ? (isArrived ? walkFrames[0] : walkFrames[Math.floor(frame / walkSpeed) % walkFrames.length])
    : chibiSrc;

  return (
    <g opacity={fadeIn}>
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
      {/* Halo or doux + stroke principal — conditionnel showHaloOnPath */}
      {showHaloOnPath && (
        <>
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
        </>
      )}
      {/* Sprite anime (walk cycle si walkFrames fourni, sinon chibi statique) */}
      <g transform={flipX ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
        <image
          href={staticFile(spriteSrc)}
          x={cx - chibiSize / 2}
          y={cy - chibiSize - 5 + hopY}
          width={chibiSize}
          height={chibiSize}
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: "brightness(1.4) contrast(1.1)" }}
        />
      </g>
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
  /** override couleurs (defaut = charte Atlas classique terracotta/navy).
   *  Pour le mode "diagramme tactique" light (cf. ref Napoleon mapanimation),
   *  passer oceanColor="#dcd2bd" landColor="#efe7d4" strokeColor="#9c8f73". */
  oceanColor?: string;
  landColor?: string;
  strokeColor?: string;
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
  oceanColor = ATLAS_COLORS.oceanDeep,
  landColor = ATLAS_COLORS.land,
  strokeColor = ATLAS_COLORS.landStroke,
}) => {
  const cx = width / 2;
  const cy = height / 2;

  const getFill = (iso: string): string => {
    if (highlightFills[iso]) return highlightFills[iso];
    if (useNationalColors && NATIONAL_COLORS[iso]) return NATIONAL_COLORS[iso];
    return landColor;
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
        fill={oceanColor}
      />
      {countries.map((c) => (
        <path
          key={c.iso}
          d={c.d}
          fill={getFill(c.iso)}
          stroke={strokeColor}
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

// =============================================================================
// ATLAS GLOBE HOOK — composant reutilisable pour hooks episodiques
// Globe orthographique + etoiles espace + texte cascade 3 lignes
// Valide : Empire Ghana Hook v7 (2026-05-03)
// Usage : forker les props par episode, ne pas toucher ce composant
// =============================================================================

export interface AtlasGlobeHookProps {
  // Globe data (ortho JSON, ex: atlas-v2-data.json ortho ou empire-ghana-data.json ortho)
  globeCountries: { iso: string; d: string }[];
  globeRadius: number;
  // Highlights pays (iso -> couleur)
  highlightFills?: Record<string, string>;
  // Rotation globe : angle depart et angle fin sur toute la duree
  rotateStart?: number;
  rotateEnd?: number;
  // Scale SVG (1.85 = globe occupe ~80% largeur sur 1080x1920)
  svgScale?: number;
  // Decalage vertical globe (px, negatif = monte)
  globeOffsetY?: number;
  // Texte cascade 3 lignes
  line1Text: string;
  line2Text: string;
  line3Text: string;
  // Frames d'entree de chaque ligne (relatifs a la composition)
  line1In?: number;
  line2In?: number;
  line3In?: number;
  // Duree totale de la composition (pour fade-out)
  durationFrames: number;
  // Couleur des lignes (defaut : ligne 1 blanc, lignes 2+3 or)
  line1Color?: string;
  line2Color?: string;
  line3Color?: string;
  fontSize?: number;
}

export const AtlasGlobeHook: React.FC<AtlasGlobeHookProps> = ({
  globeCountries,
  globeRadius,
  highlightFills = {},
  rotateStart = -30,
  rotateEnd = -15,
  svgScale: svgScaleProp = 1.85,
  globeOffsetY = -80,
  line1Text,
  line2Text,
  line3Text,
  line1In = 15,
  line2In = 45,
  line3In = 100,
  durationFrames,
  line1Color = "#F2EAD3",
  line2Color = "#D4A574",
  line3Color = "#D4A574",
  fontSize = 70,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const globeScaleAnim = interpolate(frame, [0, durationFrames], [1.0, 1.06], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const svgScale = svgScaleProp * globeScaleAnim;
  const translateX = (width / svgScale - 720) / 2;
  const translateY = (height / svgScale - 1280) / 2 + globeOffsetY / svgScale;

  const globeRotation = interpolate(frame, [0, durationFrames], [rotateStart, rotateEnd], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const globeOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const globalOpacity = interpolate(frame, [durationFrames - 10, durationFrames], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Etoiles deterministes — plus brillantes, mix de tailles
  const stars = React.useMemo(() => {
    const result: { x: number; y: number; r: number; opacity: number }[] = [];
    let seed = 42;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    for (let i = 0; i < 160; i++) {
      // Quelques etoiles plus grandes et tres brillantes (10% du total)
      const big = rand() < 0.1;
      result.push({
        x: rand() * 1080,
        y: rand() * 1920,
        r: big ? rand() * 2.0 + 1.2 : rand() * 1.2 + 0.4,
        opacity: big ? rand() * 0.3 + 0.7 : rand() * 0.4 + 0.5,
      });
    }
    return result;
  }, []);

  const starOpacityFor = (base: number, i: number) =>
    base * (0.8 + 0.2 * Math.sin((frame + i * 17) * 0.06)) * Math.min(1, frame / 20);

  // Texte cascade
  const makeSpring = (inFrame: number) =>
    spring({ frame: Math.max(0, frame - inFrame), fps, config: { damping: 20, stiffness: 200 } });

  const l1s = makeSpring(line1In);
  const l2s = makeSpring(line2In);
  const l3s = makeSpring(line3In);

  const line1Opacity = interpolate(frame,
    [line1In, line1In + 6, line2In - 3, line2In + 3],
    [0, l1s, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const line2Opacity = interpolate(frame,
    [line2In, line2In + 6, line3In - 3, line3In + 3],
    [0, l2s, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const line3Opacity = frame >= line3In ? l3s : 0;

  const textStyle = (color: string, spring_: number): React.CSSProperties => ({
    position: "absolute",
    bottom: 280,
    left: 50,
    right: 50,
    textAlign: "center",
    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
    fontSize,
    fontWeight: 700,
    color,
    letterSpacing: "0.04em",
    lineHeight: 1.2,
    textShadow: "0 3px 20px rgba(0,0,0,0.95)",
    transform: `translateY(${(1 - Math.min(1, spring_)) * 20}px)`,
  });

  // Fond espace : bleu nuit moins sombre que bgTop (#1A1F3A -> #242B52)
  const spaceBg = `linear-gradient(180deg, #242B52 0%, #1A2040 50%, #161830 100%)`;

  return (
    <AbsoluteFill style={{ background: spaceBg, opacity: globalOpacity }}>
      <div style={{ position: "absolute", top: 0, left: 0, width, height, opacity: globeOpacity }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <AtlasDefs />
          {/* Fond SVG aligné sur le fond CSS — pas de rect bgGrad qui assombrit */}
          <rect width={width} height={height} fill="transparent" />
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={starOpacityFor(s.opacity, i)} />
          ))}
          <g transform={`scale(${svgScale}) translate(${translateX} ${translateY})`}>
            <AtlasGlobe
              countries={globeCountries}
              highlightFills={highlightFills}
              rotation={globeRotation}
              scale={1}
              centerX={360}
              centerY={640}
              showHalo
              haloRadius={globeRadius}
            />
          </g>
          <rect width={width} height={height} fill="url(#vignette)" />
        </svg>
      </div>

      {frame >= line1In && frame < line2In + 6 && (
        <div style={{ ...textStyle(line1Color, l1s), opacity: line1Opacity }}>{line1Text}</div>
      )}
      {frame >= line2In && frame < line3In + 6 && (
        <div style={{ ...textStyle(line2Color, l2s), opacity: line2Opacity }}>{line2Text}</div>
      )}
      {frame >= line3In && (
        <div style={{ ...textStyle(line3Color, l3s), opacity: line3Opacity }}>{line3Text}</div>
      )}
    </AbsoluteFill>
  );
};
