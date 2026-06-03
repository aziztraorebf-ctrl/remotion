import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SilhouetteHeroIcon — Silhouette héro Mandé sous baobab au crépuscule
// Pour sujets Sonjata, héros Mandé, contes oraux africains 13e-14e siècles
// ─────────────────────────────────────────────────────────────────────────────

export interface SilhouetteHeroIconProps {
  position?: { cx: number; cy: number };
  size?: { w: number; h: number };
}

const C = {
  sun:          "#ffb84d",
  sunCore:      "#fff5a0",
  sunGlow:      "#ff8540",
  sunDim:       "#c87238",
  // Silhouettes en noir/brun très foncé (contre soleil)
  silhouette:   "#1a0e08",
  silhouetteHi: "#3a2418",
  // Sol/horizon
  ground:       "#2a1810",
  groundLit:    "#5a3818",
  // Baobab branches détails
  baobabDark:   "#1a0e08",
};

export const SilhouetteHeroIcon: React.FC<SilhouetteHeroIconProps> = ({
  position = { cx: 400, cy: 380 },
  size = { w: 700, h: 600 },
}) => {
  const { cx, cy } = position;

  // Le grand soleil couchant en arrière-plan
  const sunCx = cx - 30;
  const sunCy = cy - 80;
  const sunR = 180;

  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        {/* Soleil multi-couche pour effet éclat */}
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={C.sunCore} />
          <stop offset="60%"  stopColor={C.sun} />
          <stop offset="100%" stopColor={C.sunGlow} stopOpacity={0.6} />
        </radialGradient>

        <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={C.sun} stopOpacity={0.5} />
          <stop offset="50%"  stopColor={C.sunGlow} stopOpacity={0.2} />
          <stop offset="100%" stopColor={C.sunGlow} stopOpacity={0} />
        </radialGradient>

        {/* Sol au crépuscule */}
        <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={C.groundLit} />
          <stop offset="100%" stopColor={C.ground} />
        </linearGradient>
      </defs>

      {/* Halo très large autour du soleil */}
      <circle cx={sunCx} cy={sunCy} r={sunR * 1.8} fill="url(#sunHalo)" />

      {/* Disque solaire */}
      <circle cx={sunCx} cy={sunCy} r={sunR} fill="url(#sunCore)" />

      {/* Petits rayons subtils */}
      {[0, 30, 60, 90, 120, 150].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = sunCx + Math.cos(rad) * sunR * 1.05;
        const y1 = sunCy + Math.sin(rad) * sunR * 1.05;
        const x2 = sunCx + Math.cos(rad) * sunR * 1.4;
        const y2 = sunCy + Math.sin(rad) * sunR * 1.4;
        return (
          <line key={angle}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.sunCore}
            strokeWidth={3}
            strokeOpacity={0.4}
            strokeLinecap="round"
          />
        );
      })}

      {/* Sol / horizon */}
      <rect x={0} y={cy + 100} width={1280} height={720 - (cy + 100)} fill="url(#groundGrad)" />

      {/* Détails sol : petite ligne d'ondulation suggérant herbe sèche */}
      <path
        d={`M 0 ${cy + 105}
            Q 80 ${cy + 102} 160 ${cy + 105}
            Q 240 ${cy + 108} 320 ${cy + 104}
            Q 400 ${cy + 100} 480 ${cy + 105}
            Q 560 ${cy + 110} 640 ${cy + 103}
            Q 720 ${cy + 100} 800 ${cy + 105}
            Q 880 ${cy + 108} 960 ${cy + 104}
            Q 1040 ${cy + 100} 1120 ${cy + 105}
            Q 1200 ${cy + 108} 1280 ${cy + 103}`}
        fill="none"
        stroke={C.groundLit}
        strokeWidth={2}
        strokeOpacity={0.6}
      />

      {/* BAOBAB silhouette à gauche du soleil */}
      <g transform={`translate(${cx - 220} ${cy + 100})`}>
        {/* Tronc massif */}
        <path
          d={`M -45 0
              L -50 -40
              Q -55 -90 -42 -140
              Q -32 -180 -25 -200
              L 25 -200
              Q 32 -180 42 -140
              Q 55 -90 50 -40
              L 45 0
              Z`}
          fill={C.silhouette}
        />
        {/* Couronne de branches (multiples lignes biscornues caractéristiques baobab) */}
        <g stroke={C.silhouette} fill="none" strokeWidth={5} strokeLinecap="round">
          <path d="M 0 -200 L -25 -250 L -45 -260" />
          <path d="M 0 -200 L -15 -255 L 0 -270" />
          <path d="M 0 -200 L 0 -260" />
          <path d="M 0 -200 L 15 -255 L 30 -265" />
          <path d="M 0 -200 L 25 -245 L 50 -255" />
          <path d="M 0 -200 L -30 -240 L -55 -245" />
          <path d="M 0 -200 L 30 -240 L 60 -250" />
        </g>
        {/* Petits feuillages stylisés en bout de branches */}
        {[[-45, -260], [0, -270], [30, -265], [50, -255], [60, -250], [-55, -245], [-30, -245]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill={C.silhouette} />
        ))}
      </g>

      {/* PETIT BAOBAB plus loin à gauche (perspective) */}
      <g transform={`translate(${cx - 380} ${cy + 100}) scale(0.5)`}>
        <path
          d={`M -45 0
              L -50 -40
              Q -55 -90 -42 -140
              L -25 -180
              L 25 -180
              Q 55 -90 50 -40
              L 45 0
              Z`}
          fill={C.silhouette}
          opacity={0.7}
        />
        <g stroke={C.silhouette} opacity={0.7} fill="none" strokeWidth={4} strokeLinecap="round">
          <path d="M 0 -180 L -20 -220" />
          <path d="M 0 -180 L 20 -220" />
          <path d="M 0 -180 L 0 -230" />
        </g>
      </g>

      {/* HÉRO SONJATA — silhouette debout devant le soleil, à droite du baobab */}
      <g transform={`translate(${cx + 50} ${cy + 100})`}>
        {/* Corps : silhouette d'un guerrier debout, jambes légèrement écartées, arc en main */}

        {/* Jambes (silhouette) */}
        <path
          d={`M -15 0
              L -18 -80
              L -12 -150
              L 0 -150
              L 6 -80
              L 3 0
              Z`}
          fill={C.silhouette}
        />
        <path
          d={`M 12 0
              L 8 -80
              L 18 -150
              L 25 -150
              L 22 -80
              L 25 0
              Z`}
          fill={C.silhouette}
        />

        {/* Torse */}
        <path
          d={`M -22 -150
              Q -25 -200 -20 -250
              L 30 -250
              Q 32 -200 28 -150
              Z`}
          fill={C.silhouette}
        />

        {/* Bras droit tenant arc, légèrement plié */}
        <path
          d={`M 25 -240
              L 50 -200
              L 60 -150
              L 55 -148
              L 45 -195
              L 22 -235
              Z`}
          fill={C.silhouette}
        />

        {/* Bras gauche le long du corps */}
        <path
          d={`M -22 -240
              L -32 -180
              L -28 -120
              L -22 -120
              L -24 -180
              L -18 -240
              Z`}
          fill={C.silhouette}
        />

        {/* Tête */}
        <circle cx={5} cy={-275} r={20} fill={C.silhouette} />

        {/* Coiffure légère */}
        <path
          d={`M -10 -290
              Q 5 -300 20 -290
              Q 18 -285 5 -283
              Q -8 -285 -10 -290 Z`}
          fill={C.silhouette}
        />

        {/* ARC tenu dans la main droite */}
        <path
          d={`M 55 -160
              Q 90 -195 95 -260
              Q 90 -220 60 -180
              Z`}
          fill="none"
          stroke={C.silhouette}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Corde de l'arc */}
        <line x1={60} y1={-180} x2={92} y2={-265}
          stroke={C.silhouette}
          strokeWidth={1.5}
          opacity={0.9}
        />
      </g>

      {/* Petit symbole Mandingue subtil en bas gauche (cauris stylisé) */}
      <g transform={`translate(70 670)`} opacity={0.5}>
        <ellipse cx={0} cy={0} rx={12} ry={8} fill={C.sunCore} />
        <line x1={-7} y1={0} x2={7} y2={0} stroke={C.silhouetteHi} strokeWidth={2} />
      </g>
    </svg>
  );
};
