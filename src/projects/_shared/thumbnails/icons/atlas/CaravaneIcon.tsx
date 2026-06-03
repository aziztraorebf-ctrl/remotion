import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CaravaneIcon — Carte Afrique du Nord-Ouest + Mali en or + route caravane
// Pour sujets Atlas type Mansa Moussa, Sonjata, routes commerciales médiévales
// ─────────────────────────────────────────────────────────────────────────────

export interface CaravaneIconProps {
  showRoute?: boolean;        // route caravane Mali → Caire
  showCaravane?: boolean;     // petit cavalier sur la route
  position?: { cx: number; cy: number };
  size?: { w: number; h: number };
}

const C = {
  terraCotta:   "#c47c5a",
  terraCottaHi: "#d9967a",
  terraCottaLo: "#8a5742",
  ocean:        "#16213a",
  gold:         "#d9b25e",
  goldHi:       "#f0c97a",
  goldGlow:     "#ffd84d",
  ivoryDim:     "#a8902f",
};

// Path stylisé continent africain partie nord-ouest + arabie
// Simplifié et stylisé (pas géographiquement exact mais reconnaissable)
const AFRIQUE_PATH = `
  M 80 280
  Q 95 245 120 220
  Q 145 195 200 175
  Q 250 160 305 165
  Q 360 170 410 180
  Q 460 188 495 195
  L 540 205
  Q 565 215 595 225
  Q 615 230 640 235
  L 670 240
  Q 700 250 725 268
  Q 745 290 760 320
  L 770 350
  Q 775 380 765 410
  Q 750 440 720 460
  Q 680 480 630 490
  Q 580 495 525 490
  Q 470 480 420 465
  Q 370 445 320 425
  Q 280 405 240 380
  Q 200 360 170 335
  Q 130 315 95 300
  Q 80 290 80 280
  Z
`;

// Path stylisé Mali (région nord-ouest Afrique)
// Approximatif mais visuellement reconnaissable
const MALI_PATH = `
  M 175 230
  Q 200 220 230 220
  Q 260 222 285 230
  Q 300 235 305 250
  L 310 280
  Q 305 310 285 325
  Q 260 335 230 332
  Q 200 325 180 305
  Q 165 285 165 260
  Q 168 240 175 230
  Z
`;

// Path Égypte (zone nord-est sur la carte)
const EGYPT_AREA = { cx: 660, cy: 290, r: 35 };

// Mini cavalier (silhouette pixel art)
const Cavalier: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => {
  const s = scale;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* Chameau corps */}
      <ellipse cx={0} cy={0} rx={18} ry={8} fill={C.gold} stroke={C.ivoryDim} strokeWidth={1} />
      {/* Bosse */}
      <ellipse cx={-2} cy={-8} rx={8} ry={6} fill={C.goldHi} />
      {/* Cou + tête */}
      <path d={`M 12 -2 Q 18 -10 16 -16 Q 14 -22 18 -22 L 24 -16 L 18 -2 Z`}
        fill={C.gold} stroke={C.ivoryDim} strokeWidth={0.5} />
      {/* Pattes */}
      <rect x={-12} y={5} width={3} height={12} fill={C.terraCottaLo} />
      <rect x={-4} y={5} width={3} height={12} fill={C.terraCottaLo} />
      <rect x={6} y={5} width={3} height={12} fill={C.terraCottaLo} />
      <rect x={12} y={5} width={3} height={12} fill={C.terraCottaLo} />
      {/* Cavalier sur la bosse */}
      <circle cx={-2} cy={-18} r={4} fill={C.ivoryDim} />
      <rect x={-5} y={-14} width={6} height={6} fill="#5a4a2a" />
    </g>
  );
};

export const CaravaneIcon: React.FC<CaravaneIconProps> = ({
  showRoute = true,
  showCaravane = true,
  position = { cx: 400, cy: 350 },
  size = { w: 700, h: 480 },
}) => {
  // Le SVG occupe la zone gauche du thumbnail 1280×720
  // viewBox déjà 0-1280 / 0-720, mais on positionne notre dessin via translate

  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        {/* Gradient or massif pour le Mali (pépite) */}
        <radialGradient id="goldNugget" cx="40%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={C.goldGlow} />
          <stop offset="40%"  stopColor={C.goldHi} />
          <stop offset="80%"  stopColor={C.gold} />
          <stop offset="100%" stopColor="#9a7a30" />
        </radialGradient>

        {/* Gradient terre cuite pour continent */}
        <linearGradient id="terraCottaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={C.terraCottaHi} />
          <stop offset="100%" stopColor={C.terraCottaLo} />
        </linearGradient>

        {/* Halo or autour du Mali */}
        <radialGradient id="goldHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={C.goldGlow} stopOpacity={0.6} />
          <stop offset="40%"  stopColor={C.goldHi} stopOpacity={0.3} />
          <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Groupe principal centré sur la zone gauche */}
      <g transform={`translate(${position.cx - 400} ${position.cy - 350}) scale(${size.w / 800})`}>

        {/* Continent en terre cuite */}
        <path d={AFRIQUE_PATH} fill="url(#terraCottaGrad)"
          stroke={C.terraCottaLo} strokeWidth={2} />

        {/* Subtle texture lines suggesting desert (lignes horizontales très douces) */}
        {[260, 300, 340, 380, 420].map((y, i) => (
          <line key={i}
            x1={120 + i * 15} x2={700 - i * 10}
            y1={y} y2={y + 2}
            stroke={C.terraCottaLo} strokeWidth={0.5} strokeOpacity={0.3}
          />
        ))}

        {/* Halo lumineux autour du Mali (gold glow) */}
        <circle cx={235} cy={275} r={90} fill="url(#goldHalo)" />

        {/* Mali en or massif */}
        <path d={MALI_PATH} fill="url(#goldNugget)"
          stroke={C.goldHi} strokeWidth={2.5} />

        {/* Reflets / brillance sur le Mali */}
        <path d={`M 185 240 Q 205 235 225 240 Q 235 245 230 255 Q 215 250 195 252 Q 182 250 185 240 Z`}
          fill="rgba(255,255,255,0.35)" />

        {/* Petite étoile/point brillant centre Mali */}
        <circle cx={235} cy={275} r={3} fill="#fff" opacity={0.9} />

        {/* Route caravane Mali → Caire (pointillés or) */}
        {showRoute && (
          <>
            {/* Ligne principale courbée */}
            <path
              d={`M 290 270
                  Q 380 250 480 260
                  Q 560 270 620 285`}
              fill="none"
              stroke={C.goldHi}
              strokeWidth={3}
              strokeDasharray="8 6"
              strokeLinecap="round"
              opacity={0.85}
            />
            {/* Glow sous la route */}
            <path
              d={`M 290 270
                  Q 380 250 480 260
                  Q 560 270 620 285`}
              fill="none"
              stroke={C.goldGlow}
              strokeWidth={8}
              strokeOpacity={0.25}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Petit marqueur "Le Caire" */}
        <circle cx={655} cy={290} r={6} fill={C.gold} stroke={C.ivoryDim} strokeWidth={1.5} />
        <circle cx={655} cy={290} r={11} fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.6} />

        {/* Cavalier sur la route, à mi-chemin */}
        {showCaravane && <Cavalier x={460} y={258} scale={0.9} />}

      </g>
    </svg>
  );
};
