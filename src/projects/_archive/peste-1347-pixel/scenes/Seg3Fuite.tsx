import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  GOLD,
  GOLD_DARK,
  INK,
  PARCHMENT,
  VERMILLON,
  LAPIS,
  OCRE,
  OCRE_LIGHT,
  STONE,
  VERT,
  Guillaume,
  Martin,
  Agnes,
  VillageoisH,
  VillageoisF,
} from "../components/EnlumCharacters";

// ============================================================
// SEG 3 v2 — La Fuite des Elites (2620f @30fps)
// REBUILD 2026-02-23 : qualite 90-95% production
// Style : Enluminure couleur tout au long (Option A — pas de desaturation)
// Reference : EngravingVillage.tsx (buildings + chars organiques)
// ============================================================

// --- SEGMENTS DUREES ---
const SEG3_01_START = 0;    const SEG3_01_END = 181;
const SEG3_02_START = 182;  const SEG3_02_END = 812;
const SEG3_03_START = 813;  const SEG3_03_END = 992;
const SEG3_04_START = 993;  const SEG3_04_END = 1321;
const SEG3_05_START = 1322; const SEG3_05_END = 1659;
const SEG3_06_START = 1660; const SEG3_06_END = 1959;
const SEG3_07_START = 1960; const SEG3_07_END = 2053;
const SEG3_08_START = 2054; const SEG3_08_END = 2588;

void SEG3_07_END;

// --- BOCCACCIO cartouche — 2.5s seulement ---
const BOCCACCIO_IN = 192;
const BOCCACCIO_OUT = 267;

// --- GUILLAUME quitte le village ---
const GUILLAUME_EXIT_A = 752;

// --- DATA GRAPHIQUE timings ---
const DATA_BAR_START = 1008;
const DATA_NUM_LEFT = 1113;
const DATA_NUM_RIGHT = 1193;

// --- CARTE VILLES timings ---
const VENICE_IN = 1970;
const LONDON_IN = 2060;
const FLORENCE_IN = 2130;
const ROUTE_START = 2190;

// --- CONSTANTES TOTALES ---
const TOTAL_FRAMES = 2588;
const SCENE_TOTAL_WITH_BUFFER = 2620;
void TOTAL_FRAMES;

// ============================================================
// PALETTE ENLUMINURE (+ INK monochrome pour details)
// ============================================================
const PARCHMENT_WARM = "#EAD9A8";
const PARCHMENT_DARK = "#C8B47A";
const INK_MID = "#2a1e10";
const INK_LIGHT = "#4a3828";
const GOLD_BRIGHT = GOLD;
const VERMILLON_DARK = "#8B1A1A";
const LAPIS_MID = "#2855A0";
const OCRE_MID = OCRE;
const STONE_MID = STONE;
void STONE_MID;
void OCRE_MID;
void LAPIS_MID;
void VERMILLON_DARK;
void GOLD_BRIGHT;
void INK_LIGHT;
void INK_MID;
void PARCHMENT;
void GOLD_DARK;

// ============================================================
// SVG DEFS globaux — hachures, filtres, patrons
// ============================================================
const S3Defs: React.FC = () => (
  <defs>
    {/* Grain parchemin vieilli */}
    <filter id="s3-parchment-age" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="4" seed="12" result="noise" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0.58  0 0 0 0 0.47  0 0 0 0 0.28  0 0 0 0.18 0"
        result="coloredNoise" />
      <feComposite in="coloredNoise" in2="SourceGraphic" operator="over" />
    </filter>
    {/* Grain encre fin */}
    <filter id="s3-ink-grain" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="5" result="n" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0"
        result="c" />
      <feComposite in="c" in2="SourceGraphic" operator="over" />
    </filter>
    {/* Ombre douce */}
    <filter id="s3-drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor="rgba(26,16,8,0.25)" />
    </filter>
    {/* Hachures 45 deg */}
    <pattern id="s3-hatch-45" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" opacity="0.5" />
    </pattern>
    {/* Hachures verticales */}
    <pattern id="s3-hatch-v" patternUnits="userSpaceOnUse" width="4" height="4">
      <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.7" opacity="0.38" />
    </pattern>
    {/* Hachures denses */}
    <pattern id="s3-hatch-dense" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="3" stroke={INK} strokeWidth="0.9" opacity="0.55" />
    </pattern>
    {/* Crosshatch */}
    <pattern id="s3-crosshatch" patternUnits="userSpaceOnUse" width="5" height="5">
      <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.7" opacity="0.3" />
      <line x1="0" y1="0" x2="5" y2="0" stroke={INK} strokeWidth="0.7" opacity="0.3" />
    </pattern>
    {/* Fond parchemin gradient */}
    <linearGradient id="s3-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#D9C88A" />
      <stop offset="50%" stopColor="#EAD9A8" />
      <stop offset="100%" stopColor="#F5E8C0" />
    </linearGradient>
    {/* Gold gradient pour bordure */}
    <linearGradient id="s3-gold-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={GOLD} stopOpacity="0.9" />
      <stop offset="50%" stopColor="#FFD770" stopOpacity="1" />
      <stop offset="100%" stopColor={GOLD} stopOpacity="0.9" />
    </linearGradient>
  </defs>
);

// ============================================================
// GRAIN OVERLAY (film grain parchemin)
// ============================================================
function GrainOverlay({ frame }: { frame: number }) {
  const seed = frame % 8;
  return (
    <svg
      width="1920"
      height="1080"
      style={{ position: "absolute", top: 0, left: 0, mixBlendMode: "overlay", opacity: 0.04, pointerEvents: "none" }}
    >
      <defs>
        <filter id={`g3grain_${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="1920" height="1080" filter={`url(#g3grain_${seed})`} />
    </svg>
  );
}

// ============================================================
// BORDURE ENLUMINURE (double filet or + coins decoratifs)
// ============================================================
function BorderEnluminure({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      {/* Double filet or */}
      <rect x="20" y="20" width="1880" height="1040" fill="none" stroke="url(#s3-gold-grad)" strokeWidth={5} opacity={0.7} />
      <rect x="30" y="30" width="1860" height="1020" fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.35} />
      {/* Coins enlumines */}
      {([[55, 55], [1865, 55], [55, 1025], [1865, 1025]] as [number, number][]).map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          {/* Cercle or */}
          <circle cx={cx} cy={cy} r={18} fill="none" stroke={GOLD} strokeWidth={2.5} opacity={0.6} />
          <circle cx={cx} cy={cy} r={10} fill={GOLD} opacity={0.25} />
          <circle cx={cx} cy={cy} r={4} fill={GOLD} opacity={0.6} />
          {/* Pétales ornementaux */}
          {[0, 90, 180, 270].map((a) => (
            <line key={a}
              x1={cx + Math.cos((a * Math.PI) / 180) * 10}
              y1={cy + Math.sin((a * Math.PI) / 180) * 10}
              x2={cx + Math.cos((a * Math.PI) / 180) * 18}
              y2={cy + Math.sin((a * Math.PI) / 180) * 18}
              stroke={GOLD} strokeWidth={2} opacity={0.55} />
          ))}
        </g>
      ))}
      {/* Filigrane lateral gauche */}
      <text x="38" y="540"
        fontSize={11} fontFamily="serif" fill={INK} fontStyle="italic"
        transform="rotate(-90, 38, 540)" opacity={0.35} textAnchor="middle">
        ANNO DOMINI MCCCXLVII · PESTE NOIRE
      </text>
    </g>
  );
}

// ============================================================
// BATIMENT ENLUMINURE (style manuscrit medievale — bâtiment detaille)
// ============================================================
interface BuildingProps {
  x: number; groundY: number; w: number; h: number; roofH: number;
  roofStyle?: "triangle" | "battlements" | "spire";
  wallColor?: string; roofColor?: string;
  windows?: number; detailed?: boolean; opacity?: number;
  label?: string;
  drawProgress?: number; // 0-1 pour stroke-dasharray draw-on
}

const EnlumBuilding: React.FC<BuildingProps> = ({
  x, groundY, w, h, roofH, roofStyle = "triangle",
  wallColor = PARCHMENT_WARM, roofColor = VERMILLON,
  windows = 2, detailed = true, opacity = 1, label,
  drawProgress = 1,
}) => {
  const wallTop = groundY - h;
  const roofTop = wallTop - roofH;

  // stroke-dasharray draw-on pour l'effet "plume qui trace"
  const perimWall = 2 * (w + h);
  const wallDash = drawProgress >= 1 ? undefined : perimWall;
  const wallOffset = drawProgress >= 1 ? undefined : perimWall * (1 - Math.min(drawProgress, 0.6) / 0.6);

  return (
    <g filter="url(#s3-drop)" opacity={opacity}>
      {/* Mur principal */}
      <rect x={x} y={wallTop} width={w} height={h}
        fill={wallColor} stroke={INK} strokeWidth="2.5"
        strokeDasharray={wallDash} strokeDashoffset={wallOffset}
        filter="url(#s3-ink-grain)" />
      {/* Ombre cote gauche hachures */}
      <rect x={x} y={wallTop} width={w * 0.25} height={h}
        fill="url(#s3-hatch-45)" opacity={0.4} />

      {/* Joints de pierres */}
      {detailed && drawProgress > 0.5 && Array.from({ length: Math.floor(h / 28) }, (_, row) =>
        Array.from({ length: Math.floor(w / 36) + 1 }, (_, col) => {
          const bh = 26; const bw = 34;
          const offset = row % 2 === 0 ? 0 : bw / 2;
          return (
            <rect key={`${row}-${col}`}
              x={x + col * bw - offset} y={wallTop + row * bh}
              width={bw} height={bh}
              fill="none" stroke={INK_LIGHT} strokeWidth="1" opacity="0.22" />
          );
        })
      )}

      {/* Fenetres à arc */}
      {drawProgress > 0.55 && Array.from({ length: windows }, (_, i) => {
        const ww = w * 0.14; const wh = ww * 1.7;
        const wx = x + w * 0.15 + i * ((w * 0.7) / Math.max(windows - 1, 1));
        const wy = wallTop + h * 0.16;
        return (
          <g key={i}>
            <rect x={wx} y={wy} width={ww} height={wh} rx={ww * 0.5}
              fill={LAPIS_MID} stroke={INK} strokeWidth="2" opacity={0.85} />
            {/* Croisee */}
            <line x1={wx + ww / 2} y1={wy + wh * 0.08} x2={wx + ww / 2} y2={wy + wh * 0.92}
              stroke={PARCHMENT_WARM} strokeWidth="1.5" opacity="0.5" />
            <line x1={wx + ww * 0.1} y1={wy + wh * 0.48} x2={wx + ww * 0.9} y2={wy + wh * 0.48}
              stroke={PARCHMENT_WARM} strokeWidth="1.5" opacity="0.5" />
          </g>
        );
      })}

      {/* Porte en arc */}
      {drawProgress > 0.6 && (() => {
        const dw = w * 0.22; const dh = h * 0.35;
        const dx = x + w / 2 - dw / 2;
        return (
          <g>
            <rect x={dx} y={groundY - dh} width={dw} height={dh} rx={dw * 0.45}
              fill={INK_MID} stroke={INK} strokeWidth="2" />
            {Array.from({ length: 3 }, (_, i) => (
              <line key={i}
                x1={dx + 3} y1={groundY - dh * 0.88 + i * dh * 0.25}
                x2={dx + dw - 3} y2={groundY - dh * 0.88 + i * dh * 0.25}
                stroke={PARCHMENT_DARK} strokeWidth="1" opacity="0.35" />
            ))}
          </g>
        );
      })()}

      {/* Toit */}
      {roofStyle === "triangle" && drawProgress > 0.3 && (
        <g>
          <polygon points={`${x - 8},${wallTop} ${x + w / 2},${roofTop} ${x + w + 8},${wallTop}`}
            fill={roofColor} stroke={INK} strokeWidth="2.5" opacity={0.88} />
          <rect x={x - 8} y={wallTop} width={w + 16} height={5} fill={INK} opacity="0.65" />
          {/* Lignes de tuiles */}
          {Array.from({ length: 5 }, (_, i) => {
            const t = (i + 1) / 6;
            const ly = wallTop - (wallTop - roofTop) * t;
            const lx1 = x - 8 + (x + w / 2 - (x - 8)) * t;
            const lx2 = x + w + 8 - (x + w + 8 - (x + w / 2)) * t;
            return <line key={i} x1={lx1} y1={ly} x2={lx2} y2={ly}
              stroke={INK} strokeWidth="1.2" opacity="0.35" />;
          })}
          <clipPath id={`s3-roof-clip-${x}`}>
            <polygon points={`${x - 8},${wallTop} ${x + w / 2},${roofTop} ${x + w + 8},${wallTop}`} />
          </clipPath>
          <rect x={x - 8} y={roofTop} width={(w + 16) / 2} height={wallTop - roofTop}
            fill="url(#s3-hatch-dense)" opacity={0.3} clipPath={`url(#s3-roof-clip-${x})`} />
        </g>
      )}
      {roofStyle === "battlements" && drawProgress > 0.3 && (
        <g>
          <rect x={x - 5} y={wallTop - 36} width={w + 10} height={36}
            fill={STONE} stroke={INK} strokeWidth="2.5" />
          <rect x={x - 5} y={wallTop - 36} width={(w + 10) * 0.28} height={36}
            fill="url(#s3-hatch-45)" opacity={0.4} />
          {Array.from({ length: Math.floor((w + 10) / 28) }, (_, i) => (
            <rect key={i} x={x - 5 + i * 28} y={wallTop - 58}
              width={15} height={24} rx={2}
              fill={STONE} stroke={INK} strokeWidth="2.5" />
          ))}
        </g>
      )}
      {roofStyle === "spire" && drawProgress > 0.3 && (
        <g>
          <rect x={x + w * 0.3} y={wallTop - roofH * 0.5} width={w * 0.4} height={roofH * 0.5}
            fill={STONE} stroke={INK} strokeWidth="2" />
          <polygon
            points={`${x + w * 0.3 - 4},${wallTop - roofH * 0.5} ${x + w * 0.5},${roofTop} ${x + w * 0.7 + 4},${wallTop - roofH * 0.5}`}
            fill={INK_MID} stroke={INK} strokeWidth="2.5" />
          <clipPath id={`s3-spire-clip-${x}`}>
            <polygon points={`${x + w * 0.3 - 4},${wallTop - roofH * 0.5} ${x + w * 0.5},${roofTop} ${x + w * 0.7 + 4},${wallTop - roofH * 0.5}`} />
          </clipPath>
          <rect x={x + w * 0.3 - 4} y={roofTop} width={(w * 0.4 + 8) / 2} height={roofH * 0.5}
            fill="url(#s3-hatch-dense)" opacity={0.35} clipPath={`url(#s3-spire-clip-${x})`} />
          {/* Croix */}
          <line x1={x + w * 0.5} y1={roofTop - 32} x2={x + w * 0.5} y2={roofTop}
            stroke={INK} strokeWidth="3" />
          <line x1={x + w * 0.5 - 12} y1={roofTop - 20} x2={x + w * 0.5 + 12} y2={roofTop - 20}
            stroke={INK} strokeWidth="3" />
        </g>
      )}

      {/* Fumee de cheminee */}
      {drawProgress >= 1 && (
        <SmokeChimney x={x + w * 0.65} y={wallTop} frame={0} />
      )}

      {/* Enseigne */}
      {label && drawProgress > 0.8 && (
        <g>
          <line x1={x + w * 0.2} y1={wallTop - 8} x2={x + w * 0.2} y2={wallTop + 50}
            stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <rect x={x + w * 0.2 + 5} y={wallTop + 12} width={w * 0.62} height={28}
            rx={4} fill={PARCHMENT_WARM} stroke={INK} strokeWidth="2.5" />
          <text x={x + w * 0.2 + 5 + w * 0.31} y={wallTop + 31}
            textAnchor="middle" fontSize={12} fontFamily="serif" fill={INK} fontStyle="italic">
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// ============================================================
// VILLA RICHE (batiment nettement superieur — grand, ornemente)
// ============================================================
const VillaRiche: React.FC<{ x: number; groundY: number; drawProgress?: number; opacity?: number }> = ({
  x, groundY, drawProgress = 1, opacity = 1,
}) => {
  const w = 380; const h = 280; const roofH = 120;
  const wallTop = groundY - h;

  return (
    <g opacity={opacity}>
      {/* Corps principal */}
      <EnlumBuilding
        x={x} groundY={groundY} w={w} h={h} roofH={roofH}
        roofStyle="triangle"
        wallColor="#F0E4C0" roofColor={OCRE_MID}
        windows={4} detailed drawProgress={drawProgress}
      />
      {/* Colonnades (pilliers devant) */}
      {drawProgress > 0.7 && [0.12, 0.3, 0.7, 0.88].map((frac, i) => (
        <g key={i}>
          <rect x={x + w * frac - 7} y={wallTop + h * 0.3} width={14} height={h * 0.7}
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="2" filter="url(#s3-drop)" />
          <rect x={x + w * frac - 7} y={wallTop + h * 0.3} width={5} height={h * 0.7}
            fill="url(#s3-hatch-v)" opacity={0.35} />
          {/* Chapiteau */}
          <rect x={x + w * frac - 12} y={wallTop + h * 0.3 - 12} width={24} height={12}
            fill={STONE} stroke={INK} strokeWidth="1.5" />
        </g>
      ))}
      {/* Balcon central avec garde-corps */}
      {drawProgress > 0.75 && (
        <g>
          <rect x={x + w * 0.35} y={wallTop + h * 0.42} width={w * 0.3} height={8}
            fill={STONE} stroke={INK} strokeWidth="2" />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i}
              x={x + w * 0.35 + i * (w * 0.3 / 7)} y={wallTop + h * 0.42 - 28}
              width={4} height={30}
              fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1" />
          ))}
          <rect x={x + w * 0.35} y={wallTop + h * 0.42 - 30} width={w * 0.3} height={6}
            fill={STONE} stroke={INK} strokeWidth="1.5" />
        </g>
      )}
      {/* Titre "VILLA" */}
      {drawProgress >= 1 && (
        <text x={x + w / 2} y={wallTop - 30}
          textAnchor="middle" fontSize={22} fontFamily="serif" fill={INK} fontStyle="italic" opacity={0.7}>
          Villa Boccaccio
        </text>
      )}
    </g>
  );
};

// ============================================================
// FUMEE CHEMINEE
// ============================================================
const SmokeChimney: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => {
  return (
    <g opacity={0.4}>
      {[0, 1, 2].map((i) => {
        const t = ((frame * 0.6 + i * 40) % 120) / 120;
        const cy = y - t * 90 - 10;
        const cx = x + Math.sin(t * Math.PI * 2 + i) * 8;
        const r = 6 + t * 14;
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill={PARCHMENT_DARK} stroke="none" opacity={0.5 - t * 0.4} />
        );
      })}
    </g>
  );
};

// ============================================================
// ARBRE ENLUMINURE (avec couleur verte)
// ============================================================
const EnlumTree: React.FC<{ x: number; groundY: number; scale?: number }> = ({ x, groundY, scale = 1 }) => {
  const th = 50 * scale;
  const tw = 13 * scale;
  const cw1 = 60 * scale; const ch1 = 55 * scale;
  const cw2 = 48 * scale; const ch2 = 48 * scale;
  const cw3 = 34 * scale; const ch3 = 36 * scale;
  const GREEN_DARK = "#2A5C1E";
  const GREEN_MID = "#3D7A2A";
  const GREEN_LIGHT = "#5A9E3E";

  return (
    <g filter="url(#s3-drop)">
      {/* Tronc brun */}
      <rect x={x - tw / 2} y={groundY - th} width={tw} height={th}
        fill="#7A4A1A" stroke={INK} strokeWidth="2" rx={tw * 0.35} />
      <rect x={x - tw / 2} y={groundY - th} width={tw * 0.38} height={th}
        fill="url(#s3-hatch-v)" opacity={0.45} />
      {/* Feuillage bas */}
      <ellipse cx={x} cy={groundY - th - ch1 * 0.5} rx={cw1} ry={ch1 * 0.55}
        fill={GREEN_MID} stroke={INK} strokeWidth="2" />
      <ellipse cx={x - cw1 * 0.3} cy={groundY - th - ch1 * 0.5} rx={cw1 * 0.5} ry={ch1 * 0.5}
        fill={GREEN_DARK} opacity={0.55} />
      {/* Feuillage milieu */}
      <ellipse cx={x + cw2 * 0.08} cy={groundY - th - ch1 - ch2 * 0.4} rx={cw2} ry={ch2 * 0.55}
        fill={GREEN_DARK} stroke={INK} strokeWidth="2" />
      <ellipse cx={x - cw2 * 0.25} cy={groundY - th - ch1 - ch2 * 0.4} rx={cw2 * 0.5} ry={ch2 * 0.5}
        fill="url(#s3-crosshatch)" opacity={0.25} />
      {/* Feuillage sommet */}
      <ellipse cx={x - cw3 * 0.05} cy={groundY - th - ch1 - ch2 * 0.7 - ch3 * 0.45} rx={cw3} ry={ch3 * 0.6}
        fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.8" />
    </g>
  );
};

// ============================================================
// SOL MEDIEVAL (pavés enlumines + herbes)
// ============================================================
const EnlumGround: React.FC<{ groundY: number }> = ({ groundY }) => {
  // Pavés irréguliers style enluminure — traits a la plume, pas de hachures
  // 3 rangées de pavés avec décalage en quinconce
  const rows = [
    { y: groundY + 12, h: 22, count: 14, seed: 3 },
    { y: groundY + 38, h: 20, count: 13, seed: 7 },
    { y: groundY + 62, h: 18, count: 15, seed: 11 },
  ];

  return (
    <g>
      {/* Fond sol — parchemin chaud sans hachures */}
      <rect x={0} y={groundY} width={1920} height={1080 - groundY}
        fill="#D8C88A" />
      {/* Ligne de sol — trait a la plume epais */}
      <line x1={0} y1={groundY} x2={1920} y2={groundY}
        stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* Légere variation de teinte en bas — sol qui s'assombrit vers le bas */}
      <rect x={0} y={groundY + 80} width={1920} height={320}
        fill={INK} opacity={0.04} />

      {/* Pavés enluminure — rectangles irréguliers à la plume */}
      {rows.map((row, ri) =>
        Array.from({ length: row.count }, (_, i) => {
          const baseW = 1920 / row.count;
          const irregW = baseW - 8 + ((i * row.seed + ri * 13) % 16);
          const irregH = row.h - 2 + ((i * 5 + ri * 7) % 6);
          const offsetX = (ri % 2 === 0 ? 0 : baseW * 0.5) + ((i * row.seed) % 8) - 4;
          const px = i * baseW + offsetX;
          const py = row.y + ((i * 3 + ri * 5) % 5) - 2;
          return (
            <rect key={`${ri}-${i}`}
              x={px} y={py} width={irregW} height={irregH}
              rx={2}
              fill="none"
              stroke={INK} strokeWidth={1 + (i % 3) * 0.3}
              opacity={0.2 + (i % 4) * 0.04}
            />
          );
        })
      )}

      {/* Herbes — touffes a la base du sol, style enluminure */}
      {Array.from({ length: 22 }, (_, i) => {
        const gx = 18 + i * 86 + (i % 5) * 9;
        const gh = 14 + (i % 3) * 5;
        return (
          <g key={i} opacity={0.55 + (i % 3) * 0.1}>
            <path d={`M ${gx},${groundY} Q ${gx - 4},${groundY - gh} ${gx + 2},${groundY - gh - 4}`}
              stroke="#3a6a28" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d={`M ${gx + 10},${groundY} Q ${gx + 14},${groundY - gh + 3} ${gx + 9},${groundY - gh - 2}`}
              stroke="#2a5020" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            {i % 3 === 0 && (
              <path d={`M ${gx + 5},${groundY} Q ${gx + 3},${groundY - gh * 0.6} ${gx + 6},${groundY - gh * 0.8}`}
                stroke="#4a7a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            )}
          </g>
        );
      })}
    </g>
  );
};

// ============================================================
// PERSONNAGE ENLUMINURE (profil medieval, style manuscrit colore)
// Ancrage : pieds exactement a groundY
// ============================================================
interface EnlumCharProps {
  x: number;
  groundY: number;
  frame: number;
  phaseOffset?: number;
  scale?: number;
  type?: "paysan" | "femme" | "pretre" | "marchand" | "noble";
  facingRight?: boolean;
  anim?: "walk" | "idle" | "talk" | "pray";
  animFrame?: number;
}

const EnlumCharacter: React.FC<EnlumCharProps> = ({
  x, groundY, frame, phaseOffset = 0, scale = 1,
  type = "paysan", facingRight = true,
  anim = "walk", animFrame = 0,
}) => {
  void animFrame;
  const TOTAL_H = 185 * scale;
  const HEAD_H  = TOTAL_H * 0.21;
  const HEAD_W  = TOTAL_H * 0.165;
  const TORSO_H = TOTAL_H * 0.27;
  const TORSO_W = TOTAL_H * 0.15;
  const LEG_H   = TOTAL_H * 0.35;
  const LEG_W   = TOTAL_H * 0.07;
  const ARM_H   = TOTAL_H * 0.27;
  const ARM_W   = TOTAL_H * 0.055;
  const FOOT_RX = LEG_W * 1.1;
  const FOOT_RY = TOTAL_H * 0.022;

  // Ancrage exact au sol
  const feetY   = groundY;
  const hipY    = feetY - LEG_H;
  const torsoTopY = hipY - TORSO_H;
  const neckY   = torsoTopY - HEAD_H * 0.04;
  const headCY  = neckY - HEAD_H * 0.5;
  const shoulderY = torsoTopY + TORSO_H * 0.1;
  const shoulderX = TORSO_W * 0.12;

  const walkCycle = (frame + phaseOffset) / 11;
  const bob = anim === "walk" ? Math.abs(Math.sin(walkCycle)) * 3 * scale : 0;

  let legSwing = 0, armSwingF = 0, armSwingB = 0, torsoLean = 0, headNod = 0, mouthOpen = 0;

  if (anim === "walk") {
    legSwing  = Math.sin(walkCycle) * 22;
    armSwingF = Math.sin(walkCycle + Math.PI) * 16;
    armSwingB = Math.sin(walkCycle) * 16;
  } else if (anim === "talk") {
    legSwing  = 6;
    armSwingF = -20 + Math.sin(frame * 0.18) * 35;
    armSwingB = 8 + Math.sin(frame * 0.14) * 20;
    mouthOpen = Math.abs(Math.sin(frame * 0.22)) * 0.7;
    torsoLean = Math.sin(frame * 0.1) * 4;
  } else if (anim === "pray") {
    armSwingF = -65; armSwingB = -65;
    headNod = 25; torsoLean = 5;
  }

  // Couleurs par type
  const tunicFill = type === "noble" ? GOLD : type === "pretre" ? INK_MID : type === "femme" ? VERMILLON : OCRE_MID;
  const robeBottom = type === "noble" ? GOLD_DARK : type === "pretre" ? "#1a1008" : tunicFill;
  const skinColor = "#C8A070";
  const flip = facingRight ? 1 : -1;
  const uid = `${Math.round(x * 10)}-${type}`;
  void robeBottom;

  return (
    <g transform={`translate(${x}, 0) scale(${flip}, 1)`} filter="url(#s3-drop)">
      {/* Ombre au sol */}
      <ellipse cx={0} cy={groundY} rx={TOTAL_H * 0.13} ry={TOTAL_H * 0.03}
        fill={INK} opacity="0.14" />

      <g transform={`translate(0, ${-bob}) rotate(${torsoLean}, 0, ${hipY})`}>

        {/* JAMBE ARRIERE */}
        <g transform={`translate(${-LEG_W * 0.4}, ${hipY}) rotate(${-legSwing}, 0, 0)`}>
          <path d={`M ${-LEG_W * 0.42} 0 C ${-LEG_W * 0.52} ${LEG_H * 0.22} ${-LEG_W * 0.5} ${LEG_H * 0.44} ${-LEG_W * 0.32} ${LEG_H * 0.52} L ${LEG_W * 0.28} ${LEG_H * 0.52} C ${LEG_W * 0.42} ${LEG_H * 0.44} ${LEG_W * 0.38} ${LEG_H * 0.22} ${LEG_W * 0.28} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={1.2 * scale} />
          <path d={`M ${-LEG_W * 0.42} 0 C ${-LEG_W * 0.52} ${LEG_H * 0.22} ${-LEG_W * 0.5} ${LEG_H * 0.44} ${-LEG_W * 0.32} ${LEG_H * 0.52} L ${-LEG_W * 0.02} ${LEG_H * 0.52} C ${-LEG_W * 0.08} ${LEG_H * 0.3} ${-LEG_W * 0.1} ${LEG_H * 0.14} ${-LEG_W * 0.06} 0 Z`}
            fill="url(#s3-hatch-45)" opacity={0.35} />
          <path d={`M ${-LEG_W * 0.32} ${LEG_H * 0.52} C ${-LEG_W * 0.44} ${LEG_H * 0.62} ${-LEG_W * 0.38} ${LEG_H * 0.78} ${-LEG_W * 0.24} ${LEG_H} L ${LEG_W * 0.22} ${LEG_H} C ${LEG_W * 0.36} ${LEG_H * 0.78} ${LEG_W * 0.38} ${LEG_H * 0.62} ${LEG_W * 0.28} ${LEG_H * 0.52} Z`}
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth={scale} />
          <ellipse cx={FOOT_RX * 0.15} cy={LEG_H} rx={FOOT_RX} ry={FOOT_RY}
            fill={INK_MID} stroke={INK} strokeWidth={scale} />
        </g>

        {/* BRAS ARRIERE */}
        <g transform={`translate(${-shoulderX - ARM_W * 0.35}, ${shoulderY}) rotate(${armSwingB - 8}, 0, 0)`}>
          <path d={`M ${-ARM_W * 0.45} 0 C ${-ARM_W * 0.58} ${ARM_H * 0.25} ${-ARM_W * 0.55} ${ARM_H * 0.48} ${-ARM_W * 0.28} ${ARM_H * 0.56} L ${ARM_W * 0.28} ${ARM_H * 0.56} C ${ARM_W * 0.4} ${ARM_H * 0.48} ${ARM_W * 0.36} ${ARM_H * 0.25} ${ARM_W * 0.22} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale} />
          <path d={`M ${-ARM_W * 0.28} ${ARM_H * 0.55} C ${-ARM_W * 0.38} ${ARM_H * 0.68} ${-ARM_W * 0.3} ${ARM_H * 0.84} ${-ARM_W * 0.18} ${ARM_H} L ${ARM_W * 0.18} ${ARM_H} C ${ARM_W * 0.28} ${ARM_H * 0.84} ${ARM_W * 0.32} ${ARM_H * 0.68} ${ARM_W * 0.28} ${ARM_H * 0.55} Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale * 0.9} />
          <ellipse cx={0} cy={ARM_H} rx={ARM_W * 0.58} ry={TOTAL_H * 0.018}
            fill={skinColor} stroke={INK} strokeWidth={scale * 0.8} />
        </g>

        {/* TORSE */}
        <g transform={`translate(0, ${torsoTopY})`}>
          <path d={`M ${-TORSO_W * 0.45} 0 C ${-TORSO_W * 0.58} ${TORSO_H * 0.08} ${-TORSO_W * 0.54} ${TORSO_H * 0.4} ${-TORSO_W * 0.48} ${TORSO_H * 0.7} C ${-TORSO_W * 0.52} ${TORSO_H * 0.88} ${-TORSO_W * 0.46} ${TORSO_H} ${-TORSO_W * 0.38} ${TORSO_H} L ${TORSO_W * 0.3} ${TORSO_H} C ${TORSO_W * 0.42} ${TORSO_H} ${TORSO_W * 0.44} ${TORSO_H * 0.88} ${TORSO_W * 0.38} ${TORSO_H * 0.7} C ${TORSO_W * 0.36} ${TORSO_H * 0.4} ${TORSO_W * 0.4} ${TORSO_H * 0.08} ${TORSO_W * 0.28} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={1.5 * scale} />
          <rect x={-TORSO_W * 0.45} y={0} width={TORSO_W * 0.33} height={TORSO_H}
            fill="url(#s3-hatch-45)" opacity={0.35} />
          {Array.from({ length: 3 }, (_, i) => (
            <line key={i}
              x1={-TORSO_W * 0.18 + i * TORSO_W * 0.2} y1={TOTAL_H * 0.02}
              x2={-TORSO_W * 0.18 + i * TORSO_W * 0.2 + 3 * scale} y2={TORSO_H - TOTAL_H * 0.02}
              stroke={INK_LIGHT} strokeWidth={0.8 * scale} opacity="0.45" />
          ))}
          {/* Ceinture noble avec boucle or */}
          {type === "noble" && (
            <g>
              <rect x={-TORSO_W * 0.46} y={TORSO_H * 0.64} width={TORSO_W * 0.82} height={TOTAL_H * 0.032}
                fill={INK_MID} stroke={GOLD} strokeWidth={scale} rx={TOTAL_H * 0.006} />
              <rect x={-TOTAL_H * 0.017} y={TORSO_H * 0.64 + scale} width={TOTAL_H * 0.034} height={TOTAL_H * 0.025}
                fill={GOLD} stroke={INK} strokeWidth={scale * 0.8} />
            </g>
          )}
          {/* Croix pretre */}
          {type === "pretre" && (
            <g>
              <line x1={0} y1={TORSO_H * 0.15} x2={0} y2={TORSO_H * 0.55}
                stroke={PARCHMENT_WARM} strokeWidth={2 * scale} />
              <line x1={-TORSO_W * 0.18} y1={TORSO_H * 0.28} x2={TORSO_W * 0.18} y2={TORSO_H * 0.28}
                stroke={PARCHMENT_WARM} strokeWidth={2 * scale} />
            </g>
          )}
          {/* Robe brocart noble */}
          {type === "noble" && (
            <rect x={-TORSO_W * 0.45} y={TORSO_H * 0.08} width={TORSO_W * 0.9} height={TORSO_H * 0.55}
              fill="url(#s3-crosshatch)" opacity={0.15} />
          )}
        </g>

        {/* JAMBE AVANT */}
        <g transform={`translate(${LEG_W * 0.4}, ${hipY}) rotate(${legSwing}, 0, 0)`}>
          <path d={`M ${-LEG_W * 0.38} 0 C ${-LEG_W * 0.46} ${LEG_H * 0.22} ${-LEG_W * 0.44} ${LEG_H * 0.44} ${-LEG_W * 0.28} ${LEG_H * 0.52} L ${LEG_W * 0.32} ${LEG_H * 0.52} C ${LEG_W * 0.5} ${LEG_H * 0.44} ${LEG_W * 0.52} ${LEG_H * 0.22} ${LEG_W * 0.32} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={1.2 * scale} />
          <path d={`M ${-LEG_W * 0.28} ${LEG_H * 0.52} C ${-LEG_W * 0.38} ${LEG_H * 0.64} ${-LEG_W * 0.3} ${LEG_H * 0.8} ${-LEG_W * 0.18} ${LEG_H} L ${LEG_W * 0.24} ${LEG_H} C ${LEG_W * 0.4} ${LEG_H * 0.8} ${LEG_W * 0.44} ${LEG_H * 0.64} ${LEG_W * 0.32} ${LEG_H * 0.52} Z`}
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth={scale} />
          <ellipse cx={FOOT_RX * 0.15} cy={LEG_H} rx={FOOT_RX} ry={FOOT_RY}
            fill={INK_MID} stroke={INK} strokeWidth={scale} />
        </g>

        {/* BRAS AVANT */}
        <g transform={`translate(${shoulderX + ARM_W * 0.35}, ${shoulderY}) rotate(${armSwingF + 8}, 0, 0)`}>
          <path d={`M ${-ARM_W * 0.38} 0 C ${-ARM_W * 0.5} ${ARM_H * 0.24} ${-ARM_W * 0.46} ${ARM_H * 0.48} ${-ARM_W * 0.22} ${ARM_H * 0.56} L ${ARM_W * 0.32} ${ARM_H * 0.56} C ${ARM_W * 0.46} ${ARM_H * 0.48} ${ARM_W * 0.44} ${ARM_H * 0.24} ${ARM_W * 0.28} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale} />
          <path d={`M ${-ARM_W * 0.22} ${ARM_H * 0.55} C ${-ARM_W * 0.34} ${ARM_H * 0.7} ${-ARM_W * 0.26} ${ARM_H * 0.86} ${-ARM_W * 0.14} ${ARM_H} L ${ARM_W * 0.2} ${ARM_H} C ${ARM_W * 0.3} ${ARM_H * 0.86} ${ARM_W * 0.34} ${ARM_H * 0.7} ${ARM_W * 0.32} ${ARM_H * 0.55} Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale * 0.9} />
          <ellipse cx={0} cy={ARM_H} rx={ARM_W * 0.58} ry={TOTAL_H * 0.018}
            fill={skinColor} stroke={INK} strokeWidth={scale * 0.8} />
        </g>

        {/* COU */}
        <rect x={-TOTAL_H * 0.033} y={neckY} width={TOTAL_H * 0.074} height={TOTAL_H * 0.042}
          fill={skinColor} stroke={INK} strokeWidth={scale} rx={TOTAL_H * 0.016} />

        {/* TETE DE PROFIL */}
        <g transform={`translate(0, ${headCY}) rotate(${headNod}, 0, 0)`}>
          <ellipse cx={HEAD_W * 0.06} cy={0} rx={HEAD_W * 0.53} ry={HEAD_H * 0.53}
            fill={skinColor} stroke={INK} strokeWidth={1.8 * scale} filter="url(#s3-ink-grain)" />

          {/* Front */}
          <path d={`M ${HEAD_W * 0.12} ${-HEAD_H * 0.46} C ${HEAD_W * 0.42} ${-HEAD_H * 0.52} ${HEAD_W * 0.56} ${-HEAD_H * 0.3} ${HEAD_W * 0.56} ${-HEAD_H * 0.08}`}
            stroke={INK} strokeWidth={1.5 * scale} fill="none" />
          {/* Nez profil */}
          <path d={`M ${HEAD_W * 0.53} ${-HEAD_H * 0.07} L ${HEAD_W * 0.74} ${HEAD_H * 0.07} Q ${HEAD_W * 0.69} ${HEAD_H * 0.15} ${HEAD_W * 0.56} ${HEAD_H * 0.13}`}
            stroke={INK} strokeWidth={1.8 * scale} fill="#b88858" strokeLinejoin="round" />
          {/* Bouche */}
          <path d={`M ${HEAD_W * 0.52} ${HEAD_H * 0.22} Q ${HEAD_W * 0.42} ${HEAD_H * (0.28 + mouthOpen * 0.06)} ${HEAD_W * 0.28} ${HEAD_H * 0.24}`}
            stroke={INK} strokeWidth={1.5 * scale} fill="none" strokeLinecap="round" />
          {/* Oeil */}
          <ellipse cx={HEAD_W * 0.35} cy={-HEAD_H * 0.05} rx={TOTAL_H * 0.018} ry={TOTAL_H * 0.013}
            fill={INK} stroke={INK} strokeWidth={scale * 0.5} />
          {/* Sourcil */}
          <path d={`M ${HEAD_W * 0.22} ${-HEAD_H * 0.15} Q ${HEAD_W * 0.37} ${-HEAD_H * 0.22} ${HEAD_W * 0.49} ${-HEAD_H * 0.15}`}
            stroke={INK} strokeWidth={1.8 * scale} fill="none" strokeLinecap="round" />
          {/* Ombre visage */}
          <clipPath id={`s3-face-${uid}`}>
            <ellipse cx={HEAD_W * 0.06} cy={0} rx={HEAD_W * 0.53} ry={HEAD_H * 0.53} />
          </clipPath>
          <rect x={-HEAD_W * 0.5} y={-HEAD_H * 0.55} width={HEAD_W * 0.38} height={HEAD_H * 1.1}
            fill="url(#s3-hatch-45)" opacity={0.28} clipPath={`url(#s3-face-${uid})`} />

          {/* Coiffures par type */}
          {type === "paysan" && (
            <path d={`M ${-HEAD_W * 0.5} ${-HEAD_H * 0.14} Q ${-HEAD_W * 0.08} ${-HEAD_H * 0.96} ${HEAD_W * 0.32} ${-HEAD_H * 0.7} Q ${HEAD_W * 0.56} ${-HEAD_H * 0.52} ${HEAD_W * 0.46} ${-HEAD_H * 0.22} L ${-HEAD_W * 0.5} ${-HEAD_H * 0.14} Z`}
              fill={OCRE_MID} stroke={INK} strokeWidth={1.5 * scale} />
          )}
          {type === "noble" && (
            <g>
              {/* Chapeau noble a plumes */}
              <rect x={-HEAD_W * 0.5} y={-HEAD_H * 0.88} width={HEAD_W * 1.04} height={HEAD_H * 0.48}
                rx={3} fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale} />
              <ellipse cx={HEAD_W * 0.06} cy={-HEAD_H * 0.88} rx={HEAD_W * 0.68} ry={TOTAL_H * 0.028}
                fill={INK} stroke={INK} strokeWidth={scale} />
              {/* Plumes */}
              <path d={`M ${HEAD_W * 0.4} ${-HEAD_H * 0.88} Q ${HEAD_W * 0.62} ${-HEAD_H * 1.3} ${HEAD_W * 0.5} ${-HEAD_H * 1.55}`}
                stroke={VERMILLON} strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" opacity={0.9} />
              <path d={`M ${HEAD_W * 0.35} ${-HEAD_H * 0.9} Q ${HEAD_W * 0.7} ${-HEAD_H * 1.25} ${HEAD_W * 0.62} ${-HEAD_H * 1.5}`}
                stroke={GOLD} strokeWidth={2 * scale} fill="none" strokeLinecap="round" opacity={0.8} />
              <rect x={-HEAD_W * 0.5} y={-HEAD_H * 0.88} width={HEAD_W * 0.35} height={HEAD_H * 0.48}
                fill="url(#s3-hatch-v)" opacity={0.3} />
            </g>
          )}
          {type === "femme" && (
            <path d={`M ${-HEAD_W * 0.55} ${-HEAD_H * 0.18} Q ${-HEAD_W * 0.18} ${-HEAD_H * 0.96} ${HEAD_W * 0.36} ${-HEAD_H * 0.74} L ${HEAD_W * 0.52} ${-HEAD_H * 0.28} Q ${HEAD_W * 0.32} ${HEAD_H * 0.55} ${-HEAD_W * 0.08} ${HEAD_H * 0.65} Q ${-HEAD_W * 0.42} ${HEAD_H * 0.52} ${-HEAD_W * 0.55} ${-HEAD_H * 0.18} Z`}
              fill={PARCHMENT_WARM} stroke={INK} strokeWidth={1.5 * scale} opacity={0.92} />
          )}
          {type === "pretre" && (
            <path d={`M ${-HEAD_W * 0.56} ${HEAD_H * 0.52} L ${-HEAD_W * 0.62} ${-HEAD_H * 0.38} Q ${-HEAD_W * 0.08} ${-HEAD_H * 1.1} ${HEAD_W * 0.46} ${-HEAD_H * 0.68} L ${HEAD_W * 0.52} ${-HEAD_H * 0.28} Q ${HEAD_W * 0.22} ${HEAD_H * 0.42} ${-HEAD_W * 0.08} ${HEAD_H * 0.56} Z`}
              fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale} />
          )}
        </g>

        {/* Mains jointes pray */}
        {anim === "pray" && (
          <g transform={`translate(${shoulderX}, ${shoulderY - ARM_H * 0.3})`}>
            <ellipse cx={0} cy={0} rx={ARM_W * 1.4} ry={ARM_W * 0.9}
              fill={skinColor} stroke={INK} strokeWidth={scale} />
          </g>
        )}
      </g>
    </g>
  );
};

// ============================================================
// MEDAILLON BOCCACCIO (enluminure dorée, portrait dans disque)
// ============================================================
// Cartouche parchemin style note de bas de manuscrit medieval
const CartoucheBoccaccio: React.FC<{ globalFrame: number }> = ({ globalFrame }) => {
  // Slide-in depuis bas-gauche : translateY -40px + opacity
  const enterProgress = interpolate(globalFrame, [BOCCACCIO_IN, BOCCACCIO_IN + 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const exitProgress = interpolate(globalFrame, [BOCCACCIO_OUT - 15, BOCCACCIO_OUT], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const opacity = enterProgress * (1 - exitProgress);
  const slideY = (1 - enterProgress) * 40;

  if (opacity < 0.01) return null;

  // Position : zone ciel centrale, entre clocher et Villa Boccaccio
  const x = 480;
  const y = 60 + slideY;
  const w = 380;
  const h = 168;
  const pad = 18;

  return (
    <g opacity={opacity} filter="url(#s3-drop)">
      {/* Ombre portee sous le cartouche */}
      <rect x={x + 6} y={y + 6} width={w} height={h} rx={4}
        fill={INK} opacity={0.12} />

      {/* Corps parchemin — fond legerement plus fonce que le ciel */}
      <rect x={x} y={y} width={w} height={h} rx={3}
        fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />

      {/* Grain parchemin interieur */}
      <rect x={x} y={y} width={w} height={h} rx={3}
        fill="none" filter="url(#s3-ink-grain)" />

      {/* Filet or interieur */}
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx={2}
        fill="none" stroke={GOLD} strokeWidth="1.2" opacity={0.5} />

      {/* Ornement coin haut-gauche — croix enluminee simple */}
      <line x1={x + pad} y1={y + pad + 4} x2={x + pad + 20} y2={y + pad + 4}
        stroke={VERMILLON} strokeWidth="1.5" opacity={0.7} />
      <line x1={x + pad + 10} y1={y + pad - 4} x2={x + pad + 10} y2={y + pad + 12}
        stroke={VERMILLON} strokeWidth="1.5" opacity={0.7} />

      {/* Ornement coin haut-droit */}
      <line x1={x + w - pad - 20} y1={y + pad + 4} x2={x + w - pad} y2={y + pad + 4}
        stroke={VERMILLON} strokeWidth="1.5" opacity={0.7} />
      <line x1={x + w - pad - 10} y1={y + pad - 4} x2={x + w - pad - 10} y2={y + pad + 12}
        stroke={VERMILLON} strokeWidth="1.5" opacity={0.7} />

      {/* Ligne separatrice or sous le titre */}
      <line x1={x + pad + 28} y1={y + 52} x2={x + w - pad - 28} y2={y + 52}
        stroke={GOLD} strokeWidth="1" opacity={0.6} />

      {/* Titre principal */}
      <text x={x + w / 2} y={y + 42}
        textAnchor="middle" fontSize={22} fontFamily="serif"
        fill={VERMILLON} fontStyle="italic" fontWeight="bold" letterSpacing="1">
        Giovanni Boccaccio
      </text>

      {/* Ligne 1 */}
      <text x={x + pad + 32} y={y + 76}
        fontSize={15} fontFamily="serif" fill={INK} fontStyle="italic" opacity={0.88}>
        Florentin · ne en 1313
      </text>

      {/* Ligne 2 */}
      <text x={x + pad + 32} y={y + 98}
        fontSize={15} fontFamily="serif" fill={INK} fontStyle="italic" opacity={0.88}>
        Temoin de la Peste a Florence
      </text>

      {/* Ligne 3 */}
      <text x={x + pad + 32} y={y + 120}
        fontSize={15} fontFamily="serif" fill={INK} fontStyle="italic" opacity={0.88}>
        Auteur du Decameron · 1351
      </text>

      {/* Ligne bas — note de source enluminee */}
      <line x1={x + pad + 28} y1={y + 134} x2={x + w - pad - 28} y2={y + 134}
        stroke={GOLD} strokeWidth="0.8" opacity={0.45} />
      <text x={x + w / 2} y={y + 150}
        textAnchor="middle" fontSize={11} fontFamily="serif"
        fill={INK_LIGHT} fontStyle="italic" opacity={0.6} letterSpacing="1">
        FIRENZE · ANNO DOMINI MCCCXLVIII
      </text>
    </g>
  );
};

// ============================================================
// SCENE A — Village enluminure + Guillaume depart (0-812f)
// ============================================================
const SceneA: React.FC<{ frame: number }> = ({ frame }) => {
  const groundY = 760;

  // Entree scene
  const sceneOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Guillaume marche vers la droite puis quitte le village
  const guillaumeX = interpolate(frame,
    [SEG3_01_END, GUILLAUME_EXIT_A - 80, GUILLAUME_EXIT_A + 80],
    [300, 1200, 2100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const guillaumeAnim: "walk" | "idle" | "talk" | "pray" = frame > GUILLAUME_EXIT_A - 20 ? "walk" : "walk";

  // Serviteurs qui suivent Guillaume (légèrement derrière)
  const servX1 = Math.max(100, guillaumeX - 160);
  const servX2 = Math.max(80, guillaumeX - 280);

  // Nuages : drift horizontal lent (vitesse differenciee par couche)
  const cloudDrift = frame * 0.35;

  // Panning camera : suit Guillaume qui traverse le village
  // Debut au frame 60 (apres draw-on), acceleration quand Guillaume part
  const panBase = interpolate(frame,
    [60, SEG3_01_END, GUILLAUME_EXIT_A - 80, GUILLAUME_EXIT_A],
    [0, -60, -220, -380],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Couche arriere-plan (plan lointain) : se deplace moins vite = profondeur
  const panBG = panBase * 0.3;
  // Couche village principal : vitesse reference
  const panMID = panBase * 1.0;
  // Couche premier plan : se deplace plus vite = profondeur avant
  const panFG = panBase * 1.4;

  // Draw-on des bâtiments (debut au frame 30)
  const buildProgress = interpolate(frame, [30, 120], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneOpacity}>
      <S3Defs />

      {/* Fond parchemin chaud */}
      <rect width="1920" height="1080" fill="url(#s3-sky)" />
      <rect width="1920" height="1080" fill="none" filter="url(#s3-parchment-age)" />

      {/* Lignes manuscrit */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="0" y1={65 + i * 68} x2="1920" y2={65 + i * 68}
          stroke={INK} strokeWidth="0.6" opacity="0.08" />
      ))}

      {/* Soleil medieval */}
      <g>
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          return (
            <line key={i}
              x1={170 + Math.cos(angle) * 50} y1={140 + Math.sin(angle) * 50}
              x2={170 + Math.cos(angle) * 74} y2={140 + Math.sin(angle) * 74}
              stroke={GOLD} strokeWidth="2" opacity="0.65" />
          );
        })}
        <circle cx={170} cy={140} r={48} fill={OCRE_MID} stroke={GOLD} strokeWidth="3" opacity={0.85} />
        <circle cx={170} cy={140} r={38} fill={OCRE_LIGHT} opacity={0.5} />
      </g>

      {/* Nuages organiques style enluminure — paths irreguliers, 2 couches parallaxe */}
      {/* Couche lente 0.4x — gros nuages lointains */}
      <g transform={`translate(${-cloudDrift * 0.4}, 0)`}>
        <g opacity={0.68}>
          <path d="M 310,120 Q 330,90 370,88 Q 390,68 430,72 Q 470,58 510,78 Q 545,68 560,90 Q 580,88 590,108 Q 570,130 530,128 Q 490,138 440,132 Q 390,140 350,130 Q 318,138 310,120 Z"
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.8" />
          <path d="M 340,118 Q 370,110 420,108 Q 460,105 500,110"
            fill="none" stroke={INK} strokeWidth="0.8" opacity="0.2" />
        </g>
        <g opacity={0.55}>
          <path d="M 1020,118 Q 1045,96 1080,92 Q 1115,78 1155,86 Q 1190,80 1220,98 Q 1240,96 1248,114 Q 1235,132 1200,128 Q 1160,136 1110,130 Q 1060,138 1030,126 Q 1015,132 1020,118 Z"
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.6" />
        </g>
        <g opacity={0.5}>
          <path d="M 1720,104 Q 1738,86 1762,84 Q 1788,76 1808,90 Q 1824,88 1830,104 Q 1820,120 1796,118 Q 1766,126 1738,118 Q 1718,122 1720,104 Z"
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.5" />
        </g>
      </g>
      {/* Couche rapide 0.65x — nuages plus proches */}
      <g transform={`translate(${-cloudDrift * 0.65}, 0)`}>
        <g opacity={0.62}>
          <path d="M 700,82 Q 718,62 748,58 Q 774,46 808,56 Q 834,50 848,68 Q 862,66 868,82 Q 856,100 826,96 Q 792,106 754,98 Q 720,106 704,94 Q 692,98 700,82 Z"
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.7" />
          <path d="M 726,80 Q 758,72 800,74"
            fill="none" stroke={INK} strokeWidth="0.7" opacity="0.18" />
        </g>
        <g opacity={0.48}>
          <path d="M 1400,92 Q 1420,74 1454,70 Q 1486,62 1516,74 Q 1538,70 1548,88 Q 1540,108 1510,104 Q 1476,114 1440,106 Q 1408,112 1400,92 Z"
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.5" />
        </g>
      </g>

      {/* === COUCHE ARRIERE-PLAN (panBG * 0.3) — village lointain flou === */}
      <g transform={`translate(${panBG}, 0)`} opacity={0.38}>
        <EnlumBuilding x={60}   groundY={groundY} w={85}  h={135} roofH={58} roofStyle="triangle" windows={1} detailed={false} drawProgress={1} wallColor={PARCHMENT_WARM} />
        <EnlumBuilding x={190}  groundY={groundY} w={70}  h={120} roofH={50} roofStyle="triangle" windows={1} detailed={false} drawProgress={1} wallColor={PARCHMENT_WARM} />
        <EnlumBuilding x={1720} groundY={groundY} w={82}  h={130} roofH={55} roofStyle="triangle" windows={1} detailed={false} drawProgress={1} wallColor={PARCHMENT_WARM} />
        <EnlumBuilding x={1840} groundY={groundY} w={68}  h={112} roofH={48} roofStyle="triangle" windows={1} detailed={false} drawProgress={1} wallColor={PARCHMENT_WARM} />
      </g>

      {/* === COUCHE VILLAGE PRINCIPAL (panMID * 1.0) — plan d'action === */}
      <g transform={`translate(${panMID}, 0)`}>
        {/* Eglise paroissiale — pierre grise, fleche, toit ardoise */}
        <EnlumBuilding x={80}   groundY={groundY} w={190} h={248} roofH={130} roofStyle="spire"       windows={2} drawProgress={buildProgress} wallColor={STONE}         roofColor={INK_MID}       label="San Michele" />
        {/* Auberge — torchis beige chaud, toit vermillon, 3 fenetres */}
        <EnlumBuilding x={360}  groundY={groundY} w={228} h={268} roofH={94}  roofStyle="triangle"    windows={3} drawProgress={buildProgress} wallColor={PARCHMENT_WARM}  roofColor={VERMILLON}     label="Auberge de la Couronne" />
        {/* Boulangerie — murs ocre, toit brun, petite et trapue */}
        <EnlumBuilding x={640}  groundY={groundY} w={138} h={178} roofH={72}  roofStyle="triangle"    windows={1} drawProgress={buildProgress} wallColor={OCRE_LIGHT}      roofColor={OCRE}          label="Boulangerie" />
        {/* Forge — pierre sombre, pas de fenetres, toit plat avec creneaux */}
        <EnlumBuilding x={820}  groundY={groundY} w={130} h={192} roofH={48}  roofStyle="battlements" windows={0} drawProgress={buildProgress} wallColor={STONE_MID}       roofColor={STONE} />
        {/* Villa Boccaccio — composant dedie */}
        <VillaRiche x={1050} groundY={groundY} drawProgress={buildProgress} />
        {/* Apothicaire — murs lapis palisse, toit vert fonce, etroit */}
        <EnlumBuilding x={1480} groundY={groundY} w={132} h={212} roofH={96}  roofStyle="triangle"    windows={2} drawProgress={buildProgress} wallColor={LAPIS_MID}       roofColor={VERT}          label="Apothicaire" />
        {/* Eglise droite — pierre, fleche fine, toit ardoise */}
        <EnlumBuilding x={1680} groundY={groundY} w={165} h={222} roofH={110} roofStyle="spire"       windows={2} drawProgress={buildProgress} wallColor={STONE}           roofColor={INK_MID} />
        <EnlumTree x={318}  groundY={groundY} scale={0.82} />
        <EnlumTree x={990}  groundY={groundY} scale={0.76} />
        <EnlumTree x={1700} groundY={groundY} scale={0.88} />
      </g>

      {/* Sol — pas de panning (ancre visuel) */}
      <EnlumGround groundY={groundY} />

      {/* === COUCHE PERSONNAGES (panMID — meme plan que village) === */}
      {/* NOTE : y = groundY / scale pour ancrer les pieds correctement */}
      <g transform={`translate(${panMID}, 0)`}>
        <Martin x={580} y={groundY / 0.47} frame={frame} facing="right"
          anim={frame % 180 > 140 ? "pray" : "idle"} scale={0.47} />
        <Agnes x={420} y={groundY / 0.47} frame={frame} facing="left" anim="idle" scale={0.47} />
        <VillageoisF x={1420} y={groundY / 0.65} frame={frame} facing="left"
          anim="idle" scale={0.65} robeColor={OCRE} />
      </g>

      {/* === COUCHE PREMIER PLAN (panFG * 1.4) — Guillaume + serviteurs === */}
      <g transform={`translate(${panFG}, 0)`}>
        {servX2 > -200 && servX2 < 2100 && (
          <VillageoisH x={servX2} y={groundY / 0.65} frame={frame} facing="right"
            anim="walk" scale={0.65} tuniqueColor={STONE} />
        )}
        {servX1 > -200 && servX1 < 2100 && (
          <VillageoisH x={servX1} y={groundY / 0.65} frame={frame} facing="right"
            anim="walk" scale={0.65} tuniqueColor={LAPIS} />
        )}
        {/* Guillaume — meme taille que les figurants */}
        {guillaumeX < 2100 && (
          <Guillaume x={guillaumeX} y={groundY / 0.47} frame={frame} facing="right"
            anim={guillaumeAnim} scale={0.47} />
        )}
      </g>

      {/* Cartouche Boccaccio — fixe, pas de panning */}
      <CartoucheBoccaccio globalFrame={frame} />
    </g>
  );
};

// ============================================================
// SCENE B — Texte epoque + transition (813-992f)
// ============================================================
const SceneB: React.FC<{ frame: number }> = ({ frame }) => {
  const localF = frame - SEG3_03_START;

  const textOpacity1 = interpolate(localF, [15, 40, 130, 155], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const textOpacity2 = interpolate(localF, [45, 70, 140, 165], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [155, 180], [1, 0], { extrapolateRight: "clamp" });

  return (
    <g opacity={fadeOut}>
      <S3Defs />
      <rect width="1920" height="1080" fill={PARCHMENT_WARM} />
      <rect width="1920" height="1080" fill="none" filter="url(#s3-parchment-age)" />

      {/* Lignes manuscrit dense */}
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} x1="0" y1={55 + i * 58} x2="1920" y2={55 + i * 58}
          stroke={INK} strokeWidth="0.5" opacity="0.1" />
      ))}

      {/* Citation Boccaccio — texte manuscrit central */}
      <g opacity={textOpacity1}>
        <text x="960" y="380"
          textAnchor="middle" fontSize={32} fontFamily="serif" fill={VERMILLON}
          fontStyle="italic" letterSpacing="1">
          « La violence efface. »
        </text>
        <line x1="350" y1="400" x2="1570" y2="400" stroke={VERMILLON} strokeWidth="1.5" opacity={0.5} />
      </g>

      <g opacity={textOpacity2}>
        <text x="960" y="500"
          textAnchor="middle" fontSize={26} fontFamily="serif" fill={INK}
          fontStyle="italic" opacity={0.85}>
          « Et pendant qu'elle efface... ceux qui ont les moyens de partir... partent. »
        </text>
        <text x="960" y="580"
          textAnchor="middle" fontSize={19} fontFamily="serif" fill={INK_LIGHT}
          fontStyle="italic" opacity={0.65}>
          — Florence, 1348
        </text>
        {/* Ornement calligraphique */}
        <text x="960" y="680"
          textAnchor="middle" fontSize={42} fontFamily="serif" fill={GOLD}
          opacity={0.5} letterSpacing="8">
          ✦ ✦ ✦
        </text>
      </g>

      <BorderEnluminure opacity={0.6} />
    </g>
  );
};

// ============================================================
// GRAPHIQUE MORTALITE — barres enluminure avec draw-on
// ============================================================
const GraphiqueMortalite: React.FC<{ frame: number }> = ({ frame }) => {
  const localF = frame - SEG3_04_START;

  // Titre
  const titreOpacity = interpolate(localF, [8, 35], [0, 1], { extrapolateRight: "clamp" });

  // Barres draw-on progressif
  const barPauvresH = interpolate(frame, [DATA_BAR_START, DATA_BAR_START + 80], [0, 1], { extrapolateRight: "clamp" });
  const barRichesH  = interpolate(frame, [DATA_BAR_START + 25, DATA_BAR_START + 90], [0, 1], { extrapolateRight: "clamp" });

  // Chiffres apparaissent apres les barres
  const numRiches  = interpolate(frame, [DATA_NUM_LEFT, DATA_NUM_LEFT + 20], [0, 1], { extrapolateRight: "clamp" });
  const numPauvres = interpolate(frame, [DATA_NUM_RIGHT, DATA_NUM_RIGHT + 20], [0, 1], { extrapolateRight: "clamp" });

  const chartX = 560; const chartY = 820;
  const chartW = 800; const chartH = 380;

  const barRichesFullH = 180;  // 20-30% mortalite riches
  const barPauvresFullH = 285; // 40-50% mortalite pauvres

  const barW = 160; const gap = 320;
  const bar1X = chartX + 80;
  const bar2X = bar1X + gap;

  return (
    <g>
      {/* Fond parchemin graphique */}
      <rect x={chartX - 40} y={chartY - chartH - 80} width={chartW + 80} height={chartH + 120}
        fill={PARCHMENT_WARM} stroke={INK} strokeWidth="2" rx="4" opacity={0.92} />
      <rect x={chartX - 40} y={chartY - chartH - 80} width={chartW + 80} height={chartH + 120}
        fill="url(#s3-hatch-45)" opacity={0.05} />

      {/* Titre du graphique */}
      <g opacity={titreOpacity}>
        <text x={chartX + chartW / 2} y={chartY - chartH - 48}
          textAnchor="middle" fontSize={22} fontFamily="serif" fill={INK} fontStyle="italic" fontWeight="bold">
          Mortalité par classe sociale — Florence, 1348
        </text>
        <line x1={chartX - 20} y1={chartY - chartH - 32} x2={chartX + chartW + 20} y2={chartY - chartH - 32}
          stroke={INK} strokeWidth="1.5" opacity={0.4} />
      </g>

      {/* Axe Y */}
      <line x1={chartX} y1={chartY - chartH} x2={chartX} y2={chartY}
        stroke={INK} strokeWidth="2.5" />
      {/* Axe X */}
      <line x1={chartX} y1={chartY} x2={chartX + chartW} y2={chartY}
        stroke={INK} strokeWidth="2.5" />
      {/* Graduations Y (0%, 10%, 20%, 30%, 40%, 50%) */}
      {[0, 10, 20, 30, 40, 50].map((pct) => {
        const yy = chartY - (pct / 50) * chartH;
        return (
          <g key={pct}>
            <line x1={chartX - 8} y1={yy} x2={chartX + chartW} y2={yy}
              stroke={INK} strokeWidth={pct === 0 ? 2 : 0.8} opacity={pct === 0 ? 0.8 : 0.2} />
            <text x={chartX - 15} y={yy + 5}
              textAnchor="end" fontSize={14} fontFamily="serif" fill={INK} opacity={0.7}>
              {pct}%
            </text>
          </g>
        );
      })}

      {/* Barre RICHES (VERMILLON — ~25% mediane) */}
      <g>
        <rect x={bar1X} y={chartY - barRichesFullH * barRichesH}
          width={barW} height={barRichesFullH * barRichesH}
          fill={VERMILLON} stroke={INK} strokeWidth="2" opacity={0.85} />
        {/* Hachures ombre */}
        <rect x={bar1X} y={chartY - barRichesFullH * barRichesH}
          width={barW * 0.3} height={barRichesFullH * barRichesH}
          fill="url(#s3-hatch-45)" opacity={0.3} />
        {/* Fourchette 20-30% */}
        {barRichesH > 0.9 && (
          <g>
            <line x1={bar1X + barW * 0.5} y1={chartY - 200 * barRichesH}
              x2={bar1X + barW * 0.5} y2={chartY - 150 * barRichesH}
              stroke={INK} strokeWidth="2" />
            <line x1={bar1X + barW * 0.3} y1={chartY - 200 * barRichesH}
              x2={bar1X + barW * 0.7} y2={chartY - 200 * barRichesH}
              stroke={INK} strokeWidth="2" />
            <line x1={bar1X + barW * 0.3} y1={chartY - 150 * barRichesH}
              x2={bar1X + barW * 0.7} y2={chartY - 150 * barRichesH}
              stroke={INK} strokeWidth="2" />
          </g>
        )}
        {/* Chiffre */}
        <g opacity={numRiches}>
          <text x={bar1X + barW / 2} y={chartY - barRichesFullH - 25}
            textAnchor="middle" fontSize={28} fontFamily="serif" fill={VERMILLON} fontWeight="bold">
            20-30%
          </text>
        </g>
        {/* Etiquette */}
        <text x={bar1X + barW / 2} y={chartY + 28}
          textAnchor="middle" fontSize={18} fontFamily="serif" fill={INK} fontStyle="italic">
          Riches
        </text>
        <text x={bar1X + barW / 2} y={chartY + 48}
          textAnchor="middle" fontSize={13} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.7}>
          (villas, espace, eau propre)
        </text>
      </g>

      {/* Barre PAUVRES (LAPIS — ~45% mediane) */}
      <g>
        <rect x={bar2X} y={chartY - barPauvresFullH * barPauvresH}
          width={barW} height={barPauvresFullH * barPauvresH}
          fill={LAPIS} stroke={INK} strokeWidth="2" opacity={0.85} />
        <rect x={bar2X} y={chartY - barPauvresFullH * barPauvresH}
          width={barW * 0.3} height={barPauvresFullH * barPauvresH}
          fill="url(#s3-hatch-45)" opacity={0.3} />
        {/* Fourchette 40-50% */}
        {barPauvresH > 0.9 && (
          <g>
            <line x1={bar2X + barW * 0.5} y1={chartY - 280 * barPauvresH}
              x2={bar2X + barW * 0.5} y2={chartY - 240 * barPauvresH}
              stroke={INK} strokeWidth="2" />
            <line x1={bar2X + barW * 0.3} y1={chartY - 280 * barPauvresH}
              x2={bar2X + barW * 0.7} y2={chartY - 280 * barPauvresH}
              stroke={INK} strokeWidth="2" />
            <line x1={bar2X + barW * 0.3} y1={chartY - 240 * barPauvresH}
              x2={bar2X + barW * 0.7} y2={chartY - 240 * barPauvresH}
              stroke={INK} strokeWidth="2" />
          </g>
        )}
        <g opacity={numPauvres}>
          <text x={bar2X + barW / 2} y={chartY - barPauvresFullH - 25}
            textAnchor="middle" fontSize={28} fontFamily="serif" fill={LAPIS} fontWeight="bold">
            40-50%
          </text>
        </g>
        <text x={bar2X + barW / 2} y={chartY + 28}
          textAnchor="middle" fontSize={18} fontFamily="serif" fill={INK} fontStyle="italic">
          Pauvres
        </text>
        <text x={bar2X + barW / 2} y={chartY + 48}
          textAnchor="middle" fontSize={13} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.7}>
          (entassement, insalubrité)
        </text>
      </g>

      {/* Note source */}
      <text x={chartX + chartW / 2} y={chartY + 82}
        textAnchor="middle" fontSize={12} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.55}>
        Source : Registres du Catasto · Florence 1348 | Analyses ostéologiques · Londres
      </text>
    </g>
  );
};

// ============================================================
// SCENE C — Data graphique enluminure (993-1959f)
// ============================================================
const SceneC: React.FC<{ frame: number }> = ({ frame }) => {
  const localF = frame - SEG3_04_START;
  const sceneOpacity = interpolate(frame, [SEG3_04_START, SEG3_04_START + 25], [0, 1], { extrapolateRight: "clamp" });

  // Texte intro qui accompagne l'audio seg04
  const introOpacity = interpolate(localF, [5, 30, 280, 310], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Texte seg05 : raison simple
  const text05Opacity = interpolate(frame, [SEG3_05_START + 10, SEG3_05_START + 35], [0, 1], { extrapolateRight: "clamp" });

  // Texte seg06 : constante
  const text06Opacity = interpolate(frame, [SEG3_06_START + 10, SEG3_06_START + 35, SEG3_06_START + 265, SEG3_06_START + 285], [0, 1, 1, 0], { extrapolateRight: "clamp" });

  // Paysan : idle au debut, puis "talk" (geste vers graphique) quand les barres sont stables
  const peasantX = 1580;
  const chartStable = DATA_BAR_START + 95; // barres completement dessinees
  const peasantAnim = frame >= chartStable ? "talk" : "idle";

  return (
    <g opacity={sceneOpacity}>
      <S3Defs />
      <rect width="1920" height="1080" fill="url(#s3-sky)" />
      <rect width="1920" height="1080" fill="none" filter="url(#s3-parchment-age)" />

      {/* Lignes manuscrit */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="0" y1={65 + i * 68} x2="1920" y2={65 + i * 68}
          stroke={INK} strokeWidth="0.6" opacity="0.07" />
      ))}

      {/* Graphique mortalite */}
      <GraphiqueMortalite frame={frame} />

      {/* Texte introduction (seg04) */}
      <g opacity={introOpacity}>
        <text x="960" y="200"
          textAnchor="middle" fontSize={30} fontFamily="serif" fill={INK} fontStyle="italic">
          Les chiffres sont sans appel.
        </text>
        <line x1="380" y1="218" x2="1540" y2="218" stroke={INK} strokeWidth="1" opacity={0.3} />
      </g>

      {/* Texte seg05 — raison simple */}
      <g opacity={text05Opacity}>
        <text x="960" y="200"
          textAnchor="middle" fontSize={26} fontFamily="serif" fill={INK} fontStyle="italic">
          La raison est simple.
        </text>
        <text x="960" y="242"
          textAnchor="middle" fontSize={21} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.8}>
          Espace · Air · Eau propre
        </text>
      </g>

      {/* Texte seg06 — constante historique */}
      <g opacity={text06Opacity}>
        <text x="960" y="195"
          textAnchor="middle" fontSize={26} fontFamily="serif" fill={VERMILLON} fontStyle="italic">
          « Les siècles changent. Le réflexe reste le même. »
        </text>
        <line x1="300" y1="213" x2="1620" y2="213" stroke={VERMILLON} strokeWidth="1.2" opacity={0.35} />
      </g>

      {/* Paysan qui reagit au graphique (idle -> talk quand barres stables) */}
      <EnlumCharacter x={peasantX} groundY={860} frame={frame} phaseOffset={15} scale={0.92}
        type="paysan" facingRight={false} anim={peasantAnim} />

      <BorderEnluminure />
    </g>
  );
};

// ============================================================
// CARTE MEDIEVALE — villes et routes
// ============================================================
interface VilleMapProps {
  cx: number; cy: number; name: string; inFrame: number; frame: number;
  textDir?: "left" | "right";
  nodeColor?: string;
}

const VilleNode: React.FC<VilleMapProps> = ({ cx, cy, name, inFrame, frame, textDir = "right", nodeColor = VERMILLON }) => {
  const progress = spring({
    frame: frame - inFrame,
    fps: 30,
    config: { damping: 200, stiffness: 300, mass: 0.8 },
  });
  const scale = interpolate(progress, [0, 1], [0, 1]);

  return (
    <g transform={`translate(${cx}, ${cy})`} opacity={Math.min(scale * 2, 1)}>
      {/* Halo pulsant */}
      <circle cx={0} cy={0} r={22 + Math.sin(frame * 0.12) * 4} fill="none"
        stroke={nodeColor} strokeWidth="1.5" opacity={0.3 + Math.sin(frame * 0.12) * 0.15} />
      {/* Cercle de localisation */}
      <circle cx={0} cy={0} r={14} fill={PARCHMENT_WARM} stroke={nodeColor} strokeWidth="3"
        transform={`scale(${scale})`} />
      <circle cx={0} cy={0} r={6} fill={nodeColor} opacity={0.9}
        transform={`scale(${scale})`} />
      {/* Nom de la ville */}
      <text x={textDir === "right" ? 22 : -22} y={5}
        textAnchor={textDir === "right" ? "start" : "end"}
        fontSize={20} fontFamily="serif" fill={INK} fontStyle="italic"
        opacity={scale}>
        {name}
      </text>
    </g>
  );
};

// ============================================================
// CARTE MEDIEVALE DETAILLEE
// Coordonnees : Europe occidentale 1348
// Centre carte : (960, 500) = Europe centrale
// Echelle : ~4px / 100km
//
// Positions geographiques approximatives (simplifiees, style enluminure) :
//   Angleterre      : 350-500, 195-300
//   France          : 480-680, 260-480
//   Penisnule Ib.   : 360-580, 480-680
//   Italie          : 780-1020, 420-700
//   Alpes           : 660-880, 410-460
//   Mediterranee    : 560-1200, 560-760
//   Mer du Nord     : 300-560, 140-250
//   Manche          : 360-540, 240-290
// ============================================================

// Fond mer (Mediterranee + Atlantique + Mer du Nord)
const CarteOceans: React.FC = () => (
  <g>
    {/* Ocean Atlantique (gauche) */}
    <rect x={40} y={140} width={340} height={600}
      fill={LAPIS} opacity={0.38} />
    {/* Mer du Nord */}
    <path d="M 300 140 L 560 140 L 580 180 L 540 240 L 480 265 L 420 255 L 360 270 L 320 250 L 295 210 Z"
      fill={LAPIS} opacity={0.40} stroke={LAPIS_MID} strokeWidth="1.2" />
    {/* Manche */}
    <path d="M 360 270 L 480 265 L 540 295 L 500 320 L 440 330 L 370 305 Z"
      fill={LAPIS} opacity={0.36} stroke={LAPIS_MID} strokeWidth="1" />
    {/* Mer Mediterranee */}
    <path d="M 520 560 L 640 548 L 750 552 L 860 545 L 960 548 L 1060 545 L 1160 550 L 1240 558 L 1280 580 L 1260 640 L 1200 680 L 1100 700 L 980 705 L 860 700 L 760 695 L 660 685 L 580 670 L 510 645 L 490 610 L 510 575 Z"
      fill={LAPIS} opacity={0.40} stroke={LAPIS_MID} strokeWidth="1.5" />
    {/* Mer Adriatique */}
    <path d="M 870 450 L 920 455 L 960 480 L 980 520 L 970 560 L 940 580 L 900 560 L 880 520 L 870 490 Z"
      fill={LAPIS} opacity={0.42} stroke={LAPIS_MID} strokeWidth="1.2" />
    {/* Mer Tyrrhenienne */}
    <path d="M 780 500 L 840 510 L 870 540 L 860 590 L 820 620 L 770 610 L 750 570 L 760 530 Z"
      fill={LAPIS} opacity={0.38} stroke={LAPIS_MID} strokeWidth="1" />
  </g>
);

// Masses terrestres principales (style enluminure manuscript)
// PARCHMENT_DARK (#C8B47A) sur fond PARCHMENT_WARM (#EAD9A8) = contraste visible
const CarteTerres: React.FC = () => (
  <g>
    {/* ANGLETERRE (ile) */}
    <path d="M 340 205 C 360 190 400 185 440 192 C 480 199 510 215 525 235 C 535 250 530 270 515 280 C 500 290 478 295 460 288 C 440 280 430 268 410 265 C 390 262 370 268 355 258 C 340 248 330 228 340 205 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" opacity={0.92} />
    <path d="M 340 205 C 360 190 400 185 440 192 C 480 199 510 215 525 235 C 535 250 530 270 515 280 C 500 290 478 295 460 288 C 440 280 430 268 410 265 C 390 262 370 268 355 258 C 340 248 330 228 340 205 Z"
      fill="url(#s3-hatch-45)" opacity={0.1} />
    {/* Ecosse (nord) */}
    <path d="M 380 205 C 388 188 408 180 425 185 C 435 190 438 202 430 210 C 416 210 396 210 380 205 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="1.5" opacity={0.88} />

    {/* FRANCE + BENELUX */}
    <path d="M 480 265 C 510 258 540 260 570 268 C 600 276 625 290 640 308 C 658 328 660 352 655 375 C 648 400 632 420 615 440 C 598 460 575 472 550 478 C 525 484 498 480 478 468 C 458 456 442 436 435 415 C 426 390 428 362 438 340 C 448 318 464 288 480 265 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" opacity={0.92} />
    <path d="M 480 265 C 510 258 540 260 570 268 C 600 276 625 290 640 308 C 658 328 660 352 655 375 C 648 400 632 420 615 440 C 598 460 575 472 550 478 C 525 484 498 480 478 468 C 458 456 442 436 435 415 C 426 390 428 362 438 340 C 448 318 464 288 480 265 Z"
      fill="url(#s3-hatch-45)" opacity={0.09} />

    {/* PENINSULE IBERIQUE */}
    <path d="M 380 490 C 410 470 450 465 490 468 C 530 471 565 480 588 498 C 610 516 615 540 608 562 C 600 585 580 600 555 608 C 530 616 500 614 476 604 C 452 594 432 576 418 556 C 402 534 390 510 380 490 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" opacity={0.88} />
    <path d="M 380 490 C 410 470 450 465 490 468 C 530 471 565 480 588 498 C 610 516 615 540 608 562 C 600 585 580 600 555 608 C 530 616 500 614 476 604 C 452 594 432 576 418 556 C 402 534 390 510 380 490 Z"
      fill="url(#s3-hatch-45)" opacity={0.08} />

    {/* ITALIE (botte) */}
    <path d="M 790 400 C 820 392 855 395 880 408 C 905 420 918 440 920 462 C 922 485 912 508 900 525 C 888 542 872 552 870 572 C 868 592 878 615 875 638 C 872 660 858 676 845 680 C 832 684 820 675 812 660 C 804 645 800 622 798 600 C 796 578 797 555 795 532 C 793 508 786 484 782 460 C 778 436 778 412 790 400 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" opacity={0.92} />
    <path d="M 790 400 C 820 392 855 395 880 408 C 905 420 918 440 920 462 C 922 485 912 508 900 525 C 888 542 872 552 870 572 C 868 592 878 615 875 638 C 872 660 858 676 845 680 C 832 684 820 675 812 660 C 804 645 800 622 798 600 C 796 578 797 555 795 532 C 793 508 786 484 782 460 C 778 436 778 412 790 400 Z"
      fill="url(#s3-hatch-45)" opacity={0.09} />
    {/* Sicile */}
    <ellipse cx={870} cy={702} rx={52} ry={28}
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="1.5" opacity={0.9} />

    {/* ALLEMAGNE / SAINT-EMPIRE (approximation) */}
    <path d="M 640 308 C 670 298 710 295 750 300 C 790 305 820 318 840 335 C 858 350 860 370 852 390 C 844 410 825 424 805 430 C 785 436 762 434 742 425 C 722 416 705 400 688 385 C 670 368 650 350 640 330 C 632 314 636 310 640 308 Z"
      fill={PARCHMENT_DARK} stroke={INK} strokeWidth="1.5" opacity={0.88} />
    <path d="M 640 308 C 670 298 710 295 750 300 C 790 305 820 318 840 335 C 858 350 860 370 852 390 C 844 410 825 424 805 430 C 785 436 762 434 742 425 C 722 416 705 400 688 385 C 670 368 650 350 640 330 C 632 314 636 310 640 308 Z"
      fill="url(#s3-hatch-45)" opacity={0.08} />
  </g>
);

// Reliefs : chaines de montagnes (style gravure chevrons)
const CarteReliefs: React.FC = () => (
  <g opacity={0.65}>
    {/* Alpes (arc de 660 a 840, y=408-435) */}
    {Array.from({ length: 18 }, (_, i) => {
      const bx = 670 + i * 10 + (i % 3) * 3;
      const by = 418 + (i % 4) * 5;
      return (
        <g key={i}>
          <polygon points={`${bx},${by + 8} ${bx + 5},${by - 2} ${bx + 10},${by + 8}`}
            fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.2" opacity={0.7} />
        </g>
      );
    })}
    {/* Pyrenees (entre France et Iberie, y=478-490) */}
    {Array.from({ length: 10 }, (_, i) => {
      const bx = 430 + i * 15;
      const by = 480;
      return (
        <polygon key={i} points={`${bx},${by + 7} ${bx + 7},${by - 2} ${bx + 14},${by + 7}`}
          fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.1" opacity={0.65} />
      );
    })}
    {/* Apennins (Italie, diagonale) */}
    {Array.from({ length: 8 }, (_, i) => {
      const bx = 808 + i * 8;
      const by = 450 + i * 22;
      return (
        <polygon key={i} points={`${bx},${by + 7} ${bx + 5},${by - 1} ${bx + 10},${by + 7}`}
          fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1" opacity={0.55} />
      );
    })}
  </g>
);

// Lagune de Venise (detail distinctif)
const LaguneVenise: React.FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [VENICE_IN - 10, VENICE_IN + 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={progress * 0.9}>
      {/* Lagon */}
      <ellipse cx={940} cy={452} rx={42} ry={18}
        fill={LAPIS} opacity={0.25} stroke={LAPIS_MID} strokeWidth="1.5" />
      {/* Iles de la lagune */}
      {[
        { cx: 930, cy: 450, rx: 8, ry: 5 },
        { cx: 948, cy: 448, rx: 6, ry: 4 },
        { cx: 938, cy: 458, rx: 5, ry: 3 },
      ].map((ile, i) => (
        <ellipse key={i} cx={ile.cx} cy={ile.cy} rx={ile.rx} ry={ile.ry}
          fill={PARCHMENT_WARM} stroke={INK} strokeWidth="1.2" />
      ))}
      {/* Label lagune */}
      <text x={980} y={448} fontSize={10} fontFamily="serif" fill={LAPIS_MID} fontStyle="italic" opacity={0.7}>
        Lagune
      </text>
    </g>
  );
};

// Annotations calligraphiques (noms de mers / regions)
const CarteAnnotations: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [SEG3_07_START + 30, SEG3_07_START + 60], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={opacity * 0.55} fontFamily="serif" fontStyle="italic">
      {/* Mer Mediterranee */}
      <text x={840} y={636} fontSize={15} fill={LAPIS_MID} textAnchor="middle" letterSpacing="3">
        Mare Mediterraneum
      </text>
      {/* Ocean Atlantique */}
      <text x={185} y={440} fontSize={13} fill={LAPIS_MID} textAnchor="middle"
        transform="rotate(-85, 185, 440)" letterSpacing="2">
        Oceanus Atlanticus
      </text>
      {/* Mer du Nord */}
      <text x={435} y={192} fontSize={12} fill={LAPIS_MID} textAnchor="middle" letterSpacing="1.5">
        Mare Germanicum
      </text>
      {/* Alpes */}
      <text x={750} y={410} fontSize={11} fill={INK_LIGHT} textAnchor="middle" letterSpacing="1">
        Alpes
      </text>
    </g>
  );
};

const SceneD: React.FC<{ frame: number }> = ({ frame }) => {
  const sceneOpacity = interpolate(frame, [SEG3_07_START, SEG3_07_START + 25], [0, 1], { extrapolateRight: "clamp" });

  // Routes draw-on progressif
  const routeProgress = interpolate(frame, [ROUTE_START, ROUTE_START + 200], [0, 1], { extrapolateRight: "clamp" });

  // Longueurs approximatives des paths (pour stroke-dasharray)
  const ROUTE_VEN_LON = 560;
  const ROUTE_VEN_FLO = 185;
  const ROUTE_VEN_PAR = 490;

  // Retour de Guillaume depuis droite
  const guillaumeX = interpolate(frame, [SEG3_08_START, SEG3_08_END - 30], [2100, 1350], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp"
  });

  const textFinalOpacity = interpolate(frame, [SEG3_08_START + 40, SEG3_08_START + 65], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={sceneOpacity}>
      <S3Defs />
      {/* Fond parchemin chaud */}
      <rect width="1920" height="1080" fill="url(#s3-sky)" />
      <rect width="1920" height="1080" fill="none" filter="url(#s3-parchment-age)" />

      {/* Lignes manuscrit subtiles */}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={i} x1="0" y1={65 + i * 68} x2="1920" y2={65 + i * 68}
          stroke={INK} strokeWidth="0.6" opacity="0.06" />
      ))}

      {/* Titre enluminure */}
      <g opacity={interpolate(frame, [SEG3_07_START + 15, SEG3_07_START + 42], [0, 1], { extrapolateRight: "clamp" })}>
        {/* Rose ornementale au dessus du titre */}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line key={a}
            x1={960 + Math.cos((a * Math.PI) / 180) * 18}
            y1={48 + Math.sin((a * Math.PI) / 180) * 18}
            x2={960 + Math.cos((a * Math.PI) / 180) * 30}
            y2={48 + Math.sin((a * Math.PI) / 180) * 30}
            stroke={GOLD} strokeWidth="2.5" opacity={0.6} />
        ))}
        <circle cx={960} cy={48} r={8} fill={GOLD} opacity={0.5} />
        <text x="960" y="90"
          textAnchor="middle" fontSize={30} fontFamily="serif" fill={INK} letterSpacing="5" fontStyle="italic">
          LA CONSTANTE
        </text>
        <line x1="300" y1="104" x2="1620" y2="104" stroke={INK} strokeWidth="1.2" opacity={0.35} />
        <text x="960" y="130"
          textAnchor="middle" fontSize={17} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.65}>
          Ceux qui ont les moyens de fuir... fuient.
        </text>
      </g>

      {/* ── CARTE ── */}
      {/* Oceans */}
      <CarteOceans />
      {/* Terres */}
      <CarteTerres />
      {/* Reliefs */}
      <CarteReliefs />
      {/* Annotations calligraphiques */}
      <CarteAnnotations frame={frame} />
      {/* Lagune de Venise */}
      <LaguneVenise frame={frame} />

      {/* ── ROUTES (stroke-dasharray draw-on) ── */}
      {routeProgress > 0 && (
        <g>
          {/* Venise -> Florence (fuite vers villa campagne) */}
          <path d="M 935 448 C 900 480 860 510 820 535 C 800 548 782 555 762 558"
            fill="none" stroke={OCRE_MID} strokeWidth="3" opacity={0.7}
            strokeDasharray={`${ROUTE_VEN_FLO}`}
            strokeDashoffset={`${ROUTE_VEN_FLO * (1 - Math.min(routeProgress * 1.5, 1))}`}
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Venise -> Paris / nord */}
          <path d="M 932 442 C 900 410 860 380 820 355 C 780 330 735 318 690 310 C 660 305 628 304 600 308 C 572 312 548 322 528 332 C 515 340 508 350 502 360"
            fill="none" stroke={VERMILLON} strokeWidth="3" opacity={0.7}
            strokeDasharray={`${ROUTE_VEN_PAR}`}
            strokeDashoffset={`${ROUTE_VEN_PAR * (1 - Math.min(routeProgress * 1.2, 1))}`}
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Venise -> Londres (via Paris) */}
          <path d="M 502 360 C 490 340 478 320 465 305 C 452 290 438 280 425 275 C 415 272 408 274 400 280 C 392 286 387 295 382 306 C 376 318 375 330 378 342"
            fill="none" stroke={LAPIS_MID} strokeWidth="3" opacity={0.65}
            strokeDasharray={`${ROUTE_VEN_LON / 3}`}
            strokeDashoffset={`${(ROUTE_VEN_LON / 3) * (1 - Math.max(0, routeProgress * 2 - 1))}`}
            strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {/* ── VILLES ── */}
      <VilleNode cx={938} cy={448} name="Venise" inFrame={VENICE_IN} frame={frame} nodeColor={VERMILLON} textDir="right" />
      <VilleNode cx={762} cy={558} name="Florence" inFrame={FLORENCE_IN} frame={frame} nodeColor={OCRE_MID} textDir="left" />
      <VilleNode cx={380} cy={348} name="Londres" inFrame={LONDON_IN} frame={frame} nodeColor={LAPIS_MID} textDir="right" />
      <VilleNode cx={502} cy={360} name="Paris" inFrame={LONDON_IN + 25} frame={frame} nodeColor={INK_MID} textDir="right" />
      <VilleNode cx={620} cy={430} name="Florence II" inFrame={999999} frame={frame} nodeColor={INK_MID} textDir="left" />

      {/* ── ANNOTATIONS ROUTES ── */}
      {routeProgress > 0.7 && (
        <g opacity={interpolate(routeProgress, [0.7, 1], [0, 1], { extrapolateRight: "clamp" })}>
          {/* Etiquette Venise -> Florence */}
          <text x={858} y={508} fontSize={12} fontFamily="serif" fill={OCRE_MID} fontStyle="italic" opacity={0.85}
            textAnchor="middle">
            Villas de campagne
          </text>
          {/* Etiquette -> Londres */}
          <text x={430} y={262} fontSize={12} fontFamily="serif" fill={LAPIS_MID} fontStyle="italic" opacity={0.85}
            textAnchor="middle">
            Campagne anglaise
          </text>
        </g>
      )}

      {/* ── LEGENDE ── */}
      <g opacity={interpolate(frame, [ROUTE_START + 25, ROUTE_START + 55], [0, 1], { extrapolateRight: "clamp" })}>
        <rect x={1310} y={360} width={290} height={148} rx={5}
          fill={PARCHMENT_WARM} stroke={INK} strokeWidth="2" opacity={0.92} />
        <rect x={1310} y={360} width={290} height={28} rx={5}
          fill={OCRE_MID} opacity={0.25} />
        <text x={1455} y={378} textAnchor="middle" fontSize={13} fontFamily="serif" fill={INK} fontStyle="italic" fontWeight="bold">
          Fuite des patriciens · 1348
        </text>
        <line x1={1328} y1={408} x2={1375} y2={408} stroke={VERMILLON} strokeWidth="3" strokeLinecap="round" />
        <text x={1390} y={413} fontSize={13} fontFamily="serif" fill={INK}>Florence → campagne</text>
        <line x1={1328} y1={436} x2={1375} y2={436} stroke={LAPIS_MID} strokeWidth="3" strokeLinecap="round" />
        <text x={1390} y={441} fontSize={13} fontFamily="serif" fill={INK}>Venise → îles</text>
        <line x1={1328} y1={464} x2={1375} y2={464} stroke={OCRE_MID} strokeWidth="3" strokeLinecap="round" />
        <text x={1390} y={469} fontSize={13} fontFamily="serif" fill={INK}>Londres → manoirs</text>
        <text x={1455} y={500} textAnchor="middle" fontSize={11} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic" opacity={0.6}>
          Anno Domini MCCCXLVIII
        </text>
      </g>

      {/* ── SOL ── */}
      <EnlumGround groundY={860} />

      {/* Guillaume revient (depuis la droite, seg08) */}
      {frame >= SEG3_08_START && guillaumeX < 2000 && (
        <EnlumCharacter x={guillaumeX} groundY={860} frame={frame} phaseOffset={0} scale={1.05}
          type="noble" facingRight={false} anim="walk" />
      )}

      {/* Texte final encadre */}
      <g opacity={textFinalOpacity}>
        <rect x={490} y={914} width={940} height={96} rx={5}
          fill={PARCHMENT_WARM} stroke={GOLD} strokeWidth="2.5" opacity={0.95} />
        <text x="960" y="956"
          textAnchor="middle" fontSize={23} fontFamily="serif" fill={VERMILLON} fontStyle="italic">
          C'était vrai à Florence. C'était vrai à Londres.
        </text>
        <text x="960" y="994"
          textAnchor="middle" fontSize={23} fontFamily="serif" fill={INK} fontStyle="italic">
          C'est une constante.
        </text>
      </g>

      <BorderEnluminure />
    </g>
  );
};

// ============================================================
// SCENE PRINCIPALE — Seg3Fuite
// ============================================================
export const Seg3Fuite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;
  void PARCHMENT_WARM;

  const totalOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [SCENE_TOTAL_WITH_BUFFER - 20, SCENE_TOTAL_WITH_BUFFER], [1, 0], { extrapolateRight: "clamp" });
  const globalOp = totalOpacity * fadeOut;

  // Transition entre scenes A et C
  const sceneAOpacity = interpolate(frame, [SEG3_03_START, SEG3_03_END], [1, 0], { extrapolateRight: "clamp" });
  const sceneCOpacity = interpolate(frame, [SEG3_03_END, SEG3_04_START + 25], [0, 1], { extrapolateRight: "clamp" });
  const sceneDOpacity = interpolate(frame, [SEG3_07_START, SEG3_07_START + 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: PARCHMENT_WARM, overflow: "hidden" }}>
      {/* Toutes les pistes audio */}
      <Sequence from={SEG3_01_START} durationInFrames={SEG3_01_END - SEG3_01_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_01.mp3")} />
      </Sequence>
      <Sequence from={SEG3_02_START} durationInFrames={SEG3_02_END - SEG3_02_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_02.mp3")} />
      </Sequence>
      <Sequence from={SEG3_03_START} durationInFrames={SEG3_03_END - SEG3_03_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_03.mp3")} />
      </Sequence>
      <Sequence from={SEG3_04_START} durationInFrames={SEG3_04_END - SEG3_04_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_04.mp3")} />
      </Sequence>
      <Sequence from={SEG3_05_START} durationInFrames={SEG3_05_END - SEG3_05_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_05.mp3")} />
      </Sequence>
      <Sequence from={SEG3_06_START} durationInFrames={SEG3_06_END - SEG3_06_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_06.mp3")} />
      </Sequence>
      <Sequence from={SEG3_07_START} durationInFrames={SEG3_07_END - SEG3_07_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_07.mp3")} />
      </Sequence>
      <Sequence from={SEG3_08_START} durationInFrames={SEG3_08_END - SEG3_08_START + 1}>
        <Audio src={staticFile("audio/peste-pixel/s3/seg3_08.mp3")} />
      </Sequence>

      {/* Couche SVG principale */}
      <AbsoluteFill style={{ opacity: globalOp }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">

          {/* Scene A — Village + Guillaume depart (0-812f) */}
          {frame <= SEG3_03_END && (
            <g opacity={sceneAOpacity}>
              <SceneA frame={frame} />
            </g>
          )}

          {/* Scene B — Texte citation (813-992f) */}
          {frame >= SEG3_03_START && frame <= SEG3_04_START + 20 && (
            <SceneB frame={frame} />
          )}

          {/* Scene C — Data graphique (993-1959f) */}
          {frame >= SEG3_04_START - 10 && frame <= SEG3_07_START + 15 && (
            <g opacity={sceneCOpacity}>
              <SceneC frame={frame} />
            </g>
          )}

          {/* Scene D — Carte villes (1960-2588f) */}
          {frame >= SEG3_07_START - 5 && (
            <g opacity={sceneDOpacity}>
              <SceneD frame={frame} />
            </g>
          )}

          {/* Bordure enluminure persistante (scene A uniquement) */}
          {frame < SEG3_03_START && <BorderEnluminure />}

        </svg>
      </AbsoluteFill>

      {/* Grain film */}
      <GrainOverlay frame={frame} />
    </AbsoluteFill>
  );
};
