import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";

// ── Palette enluminure medievale ─────────────────────────────────────────────
// Pigments authentiques : lapis-lazuli, vermillon, ocre, or, vert-de-gris
const GOLD        = "#c9a84c";
const GOLD_BRIGHT = "#f0d060";
const GOLD_DARK   = "#8a6820";
const LAPIS       = "#1a3a7a";   // lapis-lazuli profond
const LAPIS_MID   = "#2a5aaa";
const LAPIS_LIGHT = "#5080d0";
const VERMILLON   = "#c8301a";
const VERMILLON_MID = "#e04828";
const VERT        = "#2a6a30";   // vert-de-gris
const VERT_MID    = "#4a9a50";
const OCRE        = "#c8a040";
const OCRE_LIGHT  = "#e8c870";
const OCRE_PALE   = "#f0dca0";
const CHAIR       = "#e8c898";   // carnation medievale
const CHAIR_DARK  = "#c8a070";
const INK         = "#1a1008";   // encre brun fonce
const INK_MID     = "#3a2510";
const PARCHMENT   = "#f4e8c8";   // parchemin creme chaud
const PARCHMENT_DARK = "#dfd0a0";
const WHITE       = "#f8f4e8";
const STONE       = "#b8a888";

// ── Defs : or, pigments, bordure ornementale ─────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    {/* Or metallique - gradient simule */}
    <linearGradient id="el-gold-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor={GOLD_BRIGHT} />
      <stop offset="35%"  stopColor={GOLD} />
      <stop offset="65%"  stopColor={GOLD_DARK} />
      <stop offset="100%" stopColor={GOLD_BRIGHT} />
    </linearGradient>
    <linearGradient id="el-gold-h" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stopColor={GOLD_DARK} />
      <stop offset="50%"  stopColor={GOLD_BRIGHT} />
      <stop offset="100%" stopColor={GOLD_DARK} />
    </linearGradient>

    {/* Lapis lazuli - gradient profondeur */}
    <linearGradient id="el-lapis" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stopColor={LAPIS_MID} />
      <stop offset="100%" stopColor={LAPIS} />
    </linearGradient>

    {/* Vermillon - gradient chaud */}
    <linearGradient id="el-vermillon" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor={VERMILLON_MID} />
      <stop offset="100%" stopColor={VERMILLON} />
    </linearGradient>

    {/* Texture parchemin */}
    <filter id="el-parchment">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="12" result="n" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0.9  0 0 0 0 0.82  0 0 0 0 0.62  0 0 0 0.1 0"
        result="t" />
      <feComposite in="t" in2="SourceGraphic" operator="over" />
    </filter>

    {/* Scintillement or */}
    <filter id="el-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    {/* Ombre portee douce */}
    <filter id="el-drop" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor={INK} floodOpacity="0.3" />
    </filter>

    {/* Motif arabesque fond */}
    <pattern id="el-arabesque" patternUnits="userSpaceOnUse" width="40" height="40">
      <rect width="40" height="40" fill={OCRE_PALE} />
      <path d="M20,0 Q30,10 20,20 Q10,10 20,0" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
      <path d="M0,20 Q10,30 20,20 Q10,10 0,20" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
      <path d="M40,20 Q30,30 20,20 Q30,10 40,20" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
      <path d="M20,40 Q30,30 20,20 Q10,30 20,40" fill="none" stroke={OCRE} strokeWidth="0.8" opacity="0.4" />
    </pattern>

    {/* Motif fond central scene */}
    <pattern id="el-scene-bg" patternUnits="userSpaceOnUse" width="24" height="24">
      <rect width="24" height="24" fill={LAPIS} />
      <circle cx="12" cy="12" r="2" fill={LAPIS_LIGHT} opacity="0.15" />
      <line x1="0" y1="12" x2="24" y2="12" stroke={LAPIS_LIGHT} strokeWidth="0.4" opacity="0.1" />
      <line x1="12" y1="0" x2="12" y2="24" stroke={LAPIS_LIGHT} strokeWidth="0.4" opacity="0.1" />
    </pattern>

    {/* Bordure or pointillee */}
    <pattern id="el-border-dots" patternUnits="userSpaceOnUse" width="12" height="12">
      <circle cx="6" cy="6" r="2.5" fill="url(#el-gold-sheen)" />
    </pattern>

    {/* Clip scene centrale */}
    <clipPath id="el-scene-clip">
      <rect x={240} y={120} width={1440} height={840} rx={12} />
    </clipPath>
  </defs>
);

// ── Lettre ornee (initiale enluminee) ───────────────────────────────────────
const InitialeLetter: React.FC<{ x: number; y: number; letter: string; progress: number }> = ({
  x, y, letter, progress,
}) => {
  const scale = spring({ frame: Math.floor(progress * 30), fps: 30, config: { damping: 14, stiffness: 120 } });
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} filter="url(#el-drop)">
      {/* Fond carre or */}
      <rect x={-5} y={-5} width={110} height={110} rx={8} fill="url(#el-gold-sheen)" stroke={GOLD_DARK} strokeWidth="2.5" />
      {/* Fond interieur lapis */}
      <rect x={4} y={4} width={92} height={92} rx={5} fill="url(#el-lapis)" />
      {/* Volutes ornementales */}
      <path d="M 10,10 Q 25,8 30,20 Q 28,35 15,38 Q 5,35 8,22" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
      <path d="M 90,10 Q 75,8 70,20 Q 72,35 85,38 Q 95,35 92,22" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
      {/* Lettre */}
      <text x={50} y={72} textAnchor="middle" fontSize="68" fontFamily="serif"
        fill={GOLD_BRIGHT} filter="url(#el-gold-glow)" fontWeight="bold">
        {letter}
      </text>
      {/* Points aux coins */}
      <circle cx={0}   cy={0}   r={4} fill={GOLD_BRIGHT} />
      <circle cx={100} cy={0}   r={4} fill={GOLD_BRIGHT} />
      <circle cx={0}   cy={100} r={4} fill={GOLD_BRIGHT} />
      <circle cx={100} cy={100} r={4} fill={GOLD_BRIGHT} />
    </g>
  );
};

// ── Bordure ornementale enluminee ────────────────────────────────────────────
const EnlumBorder: React.FC<{ progress: number }> = ({ progress }) => {
  const W = 1920;
  const H = 1080;
  const M = 28; // marge
  const dotR = 6;

  // Ronces et fleurs dans les coins
  const Corner: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip = false }) => {
    const scaleX = flip ? -1 : 1;
    return (
      <g transform={`translate(${x},${y}) scale(${scaleX},1)`}>
        {/* Tige principale */}
        <path d="M 0,0 Q 40,20 60,60 Q 70,90 50,110" fill="none" stroke={VERT_MID} strokeWidth="2.5" strokeLinecap="round" />
        {/* Feuilles */}
        <ellipse cx={28} cy={22} rx={14} ry={7} fill={VERT} transform="rotate(30,28,22)" opacity="0.85" />
        <ellipse cx={52} cy={70} rx={12} ry={6} fill={VERT_MID} transform="rotate(-20,52,70)" opacity="0.85" />
        <ellipse cx={38} cy={96} rx={10} ry={5} fill={VERT} transform="rotate(40,38,96)" opacity="0.75" />
        {/* Fleur rouge */}
        <circle cx={60} cy={60} r={9} fill={VERMILLON} stroke={VERMILLON_MID} strokeWidth="1" />
        <circle cx={60} cy={60} r={4} fill={GOLD} />
        {/* Petites baies */}
        <circle cx={20} cy={42} r={4} fill={VERMILLON} opacity="0.8" />
        <circle cx={24} cy={38} r={3} fill={VERMILLON_MID} opacity="0.7" />
      </g>
    );
  };

  return (
    <g opacity={progress}>
      {/* Cadre or exterieur */}
      <rect x={M} y={M} width={W - M * 2} height={H - M * 2} rx={10}
        fill="none" stroke="url(#el-gold-h)" strokeWidth="8" />
      {/* Cadre or interieur */}
      <rect x={M + 14} y={M + 14} width={W - (M + 14) * 2} height={H - (M + 14) * 2} rx={6}
        fill="none" stroke={GOLD} strokeWidth="2" opacity="0.6" />

      {/* Bande de points or sur les 4 cotes */}
      {/* Haut */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={`t${i}`} cx={M + 30 + i * ((W - M * 2 - 60) / 29)} cy={M + 4}
          r={dotR * 0.7} fill={GOLD} opacity="0.6" />
      ))}
      {/* Bas */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={`b${i}`} cx={M + 30 + i * ((W - M * 2 - 60) / 29)} cy={H - M - 4}
          r={dotR * 0.7} fill={GOLD} opacity="0.6" />
      ))}

      {/* Coins ornementes */}
      <Corner x={M + 18} y={M + 18} />
      <Corner x={W - M - 18} y={M + 18} flip />
      <g transform={`translate(${M + 18},${H - M - 18}) scale(1,-1)`}><Corner x={0} y={0} /></g>
      <g transform={`translate(${W - M - 18},${H - M - 18}) scale(-1,-1)`}><Corner x={0} y={0} /></g>
    </g>
  );
};

// ── Personnage enluminure ────────────────────────────────────────────────────
// Style: silhouette aplatie, pigments vifs, contour encre, proportions medievales
// (tete grande = 1/5 corps, convention du 14e s.)
interface EnlumCharProps {
  x: number;
  y: number;                    // pieds = y
  facing?: "right" | "left";
  type: "noble" | "paysan" | "pretre" | "marchand";
  anim?: "idle" | "walk" | "pray" | "talk";
  frame: number;
}

const EnlumChar: React.FC<EnlumCharProps> = ({ x, y, facing = "right", type, anim = "idle", frame }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isWalk = anim === "walk";
  const isPray = anim === "pray";
  const isTalk = anim === "talk";

  // Proportions medievales: tete haute = 1/5 hauteur totale
  const totalH = 220;
  const headR   = 38;
  const torsoH  = 85;
  const legH    = 80;
  const armL    = 75;

  const feetY   = y;
  const hipY    = feetY - legH;
  const torsoTopY = hipY - torsoH;
  const neckY   = torsoTopY - 6;
  const headCY  = neckY - headR * 0.85;
  const shoulderY = torsoTopY + 16;

  // Oscillation marche
  const legSwing = isWalk ? Math.sin(walk) * 22 : 0;
  const armSwing = isWalk ? Math.sin(walk) * 18 : isPray ? -35 : isTalk ? Math.sin(walk * 0.5) * 12 : 0;

  // Couleurs par type
  const colors = {
    noble:    { tunic: LAPIS, mantle: VERMILLON, hat: GOLD, belt: GOLD_DARK, face: CHAIR },
    paysan:   { tunic: "#8a7040", mantle: "#6a5030", hat: "#5a4020", belt: INK, face: CHAIR_DARK },
    pretre:   { tunic: WHITE, mantle: LAPIS, hat: WHITE, belt: GOLD, face: CHAIR },
    marchand: { tunic: VERT, mantle: OCRE, hat: OCRE_LIGHT, belt: GOLD_DARK, face: CHAIR },
  };
  const c = colors[type];

  return (
    <g transform={`translate(${x}, 0) scale(${flip}, 1)`} filter="url(#el-drop)">
      {/* Jambe gauche (derriere) */}
      <rect x={-10} y={hipY + legSwing * 0.5} width={18} height={legH - legSwing * 0.5}
        rx={7} fill={c.tunic} stroke={INK} strokeWidth="1.5" />
      {/* Jambe droite (devant) */}
      <rect x={6} y={hipY - legSwing * 0.5} width={18} height={legH + legSwing * 0.5}
        rx={7} fill={c.mantle} stroke={INK} strokeWidth="1.5" />

      {/* Chaussures */}
      <ellipse cx={-1} cy={feetY} rx={14} ry={7} fill={INK} />
      <ellipse cx={15} cy={feetY} rx={14} ry={7} fill={INK} />

      {/* Bras gauche */}
      <rect x={-42} y={shoulderY}
        width={16} height={armL}
        rx={6}
        fill={c.tunic}
        stroke={INK} strokeWidth="1.5"
        transform={`rotate(${-armSwing}, -34, ${shoulderY})`}
      />

      {/* Corps / tunique */}
      <rect x={-28} y={torsoTopY} width={60} height={torsoH}
        rx={12} fill={c.tunic} stroke={INK} strokeWidth="2" />
      {/* Plis verticaux tunique */}
      <line x1={-10} y1={torsoTopY + 15} x2={-14} y2={hipY - 5}
        stroke={INK} strokeWidth="1" opacity="0.3" />
      <line x1={4}  y1={torsoTopY + 15} x2={2}   y2={hipY - 5}
        stroke={INK} strokeWidth="1" opacity="0.25" />
      <line x1={16} y1={torsoTopY + 15} x2={18}  y2={hipY - 5}
        stroke={INK} strokeWidth="1" opacity="0.2" />

      {/* Ceinture or */}
      <rect x={-28} y={torsoTopY + torsoH * 0.55} width={60} height={14}
        rx={5} fill={c.belt} stroke={INK} strokeWidth="1.2" />

      {/* Manteau (surcot) */}
      {type !== "paysan" && (
        <path
          d={`M -28,${torsoTopY + 10} Q -48,${hipY - 20} -38,${hipY + 20} L -28,${hipY}`}
          fill={c.mantle} stroke={INK} strokeWidth="1.5"
        />
      )}

      {/* Bras droit (devant) */}
      <rect x={22} y={shoulderY}
        width={16} height={armL}
        rx={6}
        fill={c.mantle}
        stroke={INK} strokeWidth="1.5"
        transform={`rotate(${armSwing}, 30, ${shoulderY})`}
      />
      {/* Main droite - geste priere */}
      {isPray && (
        <rect x={18} y={shoulderY + armL - 15}
          width={14} height={22} rx={5}
          fill={c.face} stroke={INK} strokeWidth="1.2"
          transform={`rotate(-40, 25, ${shoulderY + armL})`}
        />
      )}

      {/* Cou */}
      <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={c.face} stroke={INK} strokeWidth="1.5" />

      {/* Tete */}
      <ellipse cx={2} cy={headCY} rx={headR} ry={headR * 1.08}
        fill={c.face} stroke={INK} strokeWidth="2" />

      {/* Visage en profil droit (medievale = 3/4 ou profil) */}
      {/* Oeil */}
      <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth="1.5" />
      <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
      <circle  cx={19} cy={headCY - 4} r={1} fill={WHITE} opacity="0.6" />
      {/* Sourcil */}
      <path d={`M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
        fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      {/* Nez */}
      <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`}
        fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      {/* Bouche */}
      <path d={isTalk && Math.sin(walk * 0.4) > 0
        ? `M 12,${headCY + 22} Q 20,${headCY + 32} 28,${headCY + 22}`
        : `M 12,${headCY + 24} Q 20,${headCY + 28} 28,${headCY + 24}`}
        fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />

      {/* Cheveux / coiffe */}
      {type === "noble" && (
        <>
          {/* Chaperon or */}
          <ellipse cx={2} cy={headCY - headR * 0.7} rx={headR + 8} ry={headR * 0.55}
            fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
          <path d={`M ${headR + 6},${headCY - headR * 0.7} Q ${headR + 28},${headCY - headR} ${headR + 14},${headCY + 20}`}
            fill={GOLD} stroke={GOLD_DARK} strokeWidth="1.5" />
        </>
      )}
      {type === "pretre" && (
        <ellipse cx={2} cy={headCY - headR * 0.6} rx={headR - 4} ry={headR * 0.4}
          fill={WHITE} stroke={INK} strokeWidth="1.5" />
      )}
      {type === "paysan" && (
        <>
          {/* Bonnet simple */}
          <ellipse cx={2} cy={headCY - headR * 0.75} rx={headR + 2} ry={headR * 0.45}
            fill={c.hat} stroke={INK} strokeWidth="1.5" />
        </>
      )}
      {type === "marchand" && (
        <>
          {/* Chapeau a bords */}
          <ellipse cx={2} cy={headCY - headR * 0.5} rx={headR + 14} ry={8}
            fill={c.hat} stroke={INK} strokeWidth="1.5" />
          <ellipse cx={2} cy={headCY - headR * 0.8} rx={headR - 6} ry={headR * 0.5}
            fill={c.hat} stroke={INK} strokeWidth="1.5" />
        </>
      )}
    </g>
  );
};

// ── Batiment enluminure ──────────────────────────────────────────────────────
// Proportions medievales : murs epais, fenetres etroites, couleurs vives
interface EnlumBuildingProps {
  x: number; y: number;
  w: number; h: number;
  roofType?: "triangle" | "arche" | "tour";
  wallColor?: string;
  roofColor?: string;
  label?: string;
  windows?: number;
}

const EnlumBuilding: React.FC<EnlumBuildingProps> = ({
  x, y, w, h, roofType = "triangle",
  wallColor = OCRE_PALE, roofColor = VERMILLON,
  label, windows = 2,
}) => {
  const left = x - w / 2;
  const roofBaseY = y - h;

  return (
    <g filter="url(#el-drop)">
      {/* Mur principal */}
      <rect x={left} y={roofBaseY} width={w} height={h}
        fill={wallColor} stroke={INK} strokeWidth="2.5" />
      {/* Pierres apparentes */}
      {Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 3 }, (_, col) => (
          <rect key={`${row}-${col}`}
            x={left + 4 + col * (w - 8) / 3}
            y={roofBaseY + 8 + row * (h - 16) / 4}
            width={(w - 8) / 3 - 3}
            height={(h - 16) / 4 - 3}
            rx={2}
            fill="none"
            stroke={INK}
            strokeWidth="0.8"
            opacity="0.25"
          />
        ))
      )}

      {/* Toit */}
      {roofType === "triangle" && (
        <polygon
          points={`${left - 8},${roofBaseY} ${x},${roofBaseY - h * 0.55} ${left + w + 8},${roofBaseY}`}
          fill={roofColor} stroke={INK} strokeWidth="2.5"
        />
      )}
      {roofType === "arche" && (
        <path d={`M ${left - 6},${roofBaseY} Q ${x},${roofBaseY - h * 0.6} ${left + w + 6},${roofBaseY}`}
          fill={roofColor} stroke={INK} strokeWidth="2.5" />
      )}
      {roofType === "tour" && (
        <>
          <rect x={left - 8} y={roofBaseY - 50} width={w + 16} height={50}
            fill={roofColor} stroke={INK} strokeWidth="2" />
          {/* Creneaux */}
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={left - 6 + i * (w + 12) / 4} y={roofBaseY - 68}
              width={(w + 12) / 5 - 4} height={20}
              fill={roofColor} stroke={INK} strokeWidth="1.5" />
          ))}
        </>
      )}

      {/* Fenetres a ogive (style gothique) */}
      {Array.from({ length: windows }, (_, i) => {
        const wx = left + (w / (windows + 1)) * (i + 1);
        const wy = roofBaseY + h * 0.22;
        const ww = Math.min(24, w / (windows + 1) - 8);
        const wh = h * 0.38;
        return (
          <g key={i}>
            <path
              d={`M ${wx - ww / 2},${wy + wh} L ${wx - ww / 2},${wy + wh * 0.4} Q ${wx},${wy} ${wx + ww / 2},${wy + wh * 0.4} L ${wx + ww / 2},${wy + wh} Z`}
              fill={LAPIS} stroke={INK} strokeWidth="1.5"
            />
            {/* Meneau */}
            <line x1={wx} y1={wy + wh * 0.38} x2={wx} y2={wy + wh}
              stroke={LAPIS_LIGHT} strokeWidth="1" opacity="0.5" />
          </g>
        );
      })}

      {/* Porte arche */}
      <path
        d={`M ${x - w * 0.14},${y} L ${x - w * 0.14},${roofBaseY + h * 0.62} Q ${x},${roofBaseY + h * 0.5} ${x + w * 0.14},${roofBaseY + h * 0.62} L ${x + w * 0.14},${y} Z`}
        fill={GOLD_DARK} stroke={INK} strokeWidth="1.8"
      />

      {/* Label */}
      {label && (
        <text x={x} y={y + 22} textAnchor="middle"
          fontSize="11" fontFamily="serif" fill={INK} fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
};

// ── Sol dallage colore ───────────────────────────────────────────────────────
const Dallage: React.FC<{ y: number }> = ({ y }) => (
  <g>
    {/* Bande sol couleur */}
    <rect x={0} y={y} width={1920} height={240} fill={OCRE} />
    {/* Carrelage bichrome */}
    {Array.from({ length: 20 }, (_, col) =>
      Array.from({ length: 4 }, (_, row) => {
        const isAlt = (col + row) % 2 === 0;
        return (
          <rect key={`${col}-${row}`}
            x={col * 96}
            y={y + row * 58}
            width={96}
            height={58}
            fill={isAlt ? OCRE_LIGHT : OCRE}
            stroke={GOLD_DARK}
            strokeWidth="1.2"
            opacity="0.7"
          />
        );
      })
    )}
    {/* Bande de transition haut */}
    <rect x={0} y={y} width={1920} height={6} fill={GOLD_DARK} opacity="0.6" />
  </g>
);

// ── Ciel enluminure : fond lapis avec etoiles or ─────────────────────────────
const EnlumSky: React.FC<{ frame: number }> = ({ frame }) => {
  const twinkle = Math.sin(frame * 0.04) * 0.15;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={820} fill="url(#el-scene-bg)" />
      {/* Etoiles or */}
      {[
        [120, 80], [340, 55], [580, 90], [820, 40], [1050, 70], [1280, 55], [1520, 85], [1740, 60],
        [200, 160], [480, 140], [760, 170], [1020, 130], [1300, 155], [1600, 145], [1820, 170],
        [80, 240], [650, 220], [960, 200], [1400, 230], [1750, 240],
      ].map(([sx, sy], i) => (
        <path key={i}
          d={`M ${sx},${sy - 8} L ${sx + 2},${sy - 2} L ${sx + 8},${sy} L ${sx + 2},${sy + 2} L ${sx},${sy + 8} L ${sx - 2},${sy + 2} L ${sx - 8},${sy} L ${sx - 2},${sy - 2} Z`}
          fill={GOLD_BRIGHT}
          opacity={0.5 + twinkle + (i % 3) * 0.12}
          transform={`scale(${0.7 + (i % 4) * 0.15})`}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}
      {/* Lune or */}
      <circle cx={1780} cy={120} r={52} fill={GOLD} stroke={GOLD_DARK} strokeWidth="2" />
      <circle cx={1750} cy={100} r={40} fill="url(#el-scene-bg)" />
    </g>
  );
};

// ── Banderole (phylactere medievale) ─────────────────────────────────────────
const Banderole: React.FC<{ x: number; y: number; text: string; progress: number }> = ({
  x, y, text, progress,
}) => {
  const w = text.length * 11 + 40;
  return (
    <g opacity={progress}>
      {/* Ruban */}
      <path
        d={`M ${x - w / 2 - 16},${y - 18} Q ${x - w / 2},${y - 22} ${x + w / 2},${y - 22} Q ${x + w / 2 + 16},${y - 18} ${x + w / 2},${y + 18} Q ${x + w / 2 - 8},${y + 22} ${x - w / 2},${y + 22} Q ${x - w / 2 - 16},${y + 18} ${x - w / 2 - 16},${y - 18} Z`}
        fill={PARCHMENT} stroke={GOLD_DARK} strokeWidth="1.8"
      />
      {/* Coins plies */}
      <path d={`M ${x - w / 2 - 16},${y - 18} L ${x - w / 2 - 28},${y - 10} L ${x - w / 2 - 16},${y - 2}`}
        fill={PARCHMENT_DARK} stroke={GOLD_DARK} strokeWidth="1.2" />
      <path d={`M ${x + w / 2 + 16},${y - 18} L ${x + w / 2 + 28},${y - 10} L ${x + w / 2 + 16},${y - 2}`}
        fill={PARCHMENT_DARK} stroke={GOLD_DARK} strokeWidth="1.2" />
      <text x={x} y={y + 6} textAnchor="middle" fontSize="14" fontFamily="serif" fill={INK} fontStyle="italic">
        {text}
      </text>
    </g>
  );
};

// ── Scene principale ─────────────────────────────────────────────────────────
export const Enluminure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrees progressives par element
  const enter = (start: number, dur = 25) =>
    interpolate(frame, [start, start + dur], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  const groundY = 820;

  // Mouvement nobles qui discutent
  const nobleTalk = Math.sin(frame * 0.04) * 8;
  // Paysan qui marche vers la droite
  const peasantX = interpolate(frame, [0, 300], [380, 680], { extrapolateRight: "clamp" });

  // Banderoles : apparaissent avec les personnages
  const banderole1Progress = enter(90);
  const banderole2Progress = enter(130);

  return (
    <AbsoluteFill style={{ background: PARCHMENT }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* ── Fond arabesque parchemin (marges) ── */}
        <rect width="1920" height="1080" fill="url(#el-arabesque)" />
        <rect width="1920" height="1080" fill={PARCHMENT} opacity="0.45" filter="url(#el-parchment)" />

        {/* ── Zone de scene centrale ── */}
        <rect x={240} y={120} width={1440} height={840} rx={12}
          fill="none" stroke={GOLD_DARK} strokeWidth="3" />
        <g clipPath="url(#el-scene-clip)">

          {/* Ciel lapis */}
          <EnlumSky frame={frame} />

          {/* Sol dallage */}
          <Dallage y={groundY} />

          {/* ── Batiments (apparaissent progressivement) ── */}
          <g opacity={enter(10)}>
            {/* Cathedrale centre-gauche */}
            <EnlumBuilding
              x={700} y={groundY} w={220} h={320}
              roofType="tour" wallColor={OCRE_PALE} roofColor={LAPIS}
              label="Sanctus Petrus" windows={3}
            />
            {/* Fleche cathedrale */}
            <polygon
              points={`688,${groundY - 370} 700,${groundY - 520} 712,${groundY - 370}`}
              fill={GOLD} stroke={GOLD_DARK} strokeWidth="2"
              opacity={enter(20)}
            />
            <circle cx={700} cy={groundY - 526} r={10} fill={GOLD_BRIGHT}
              stroke={GOLD_DARK} strokeWidth="1.5" opacity={enter(20)} />
          </g>

          <g opacity={enter(18)}>
            {/* Taverne droite */}
            <EnlumBuilding
              x={1280} y={groundY} w={180} h={240}
              roofType="triangle" wallColor="#e0d0b0" roofColor={VERMILLON}
              label="Auberge du Rat" windows={2}
            />
          </g>

          <g opacity={enter(25)}>
            {/* Maison marchande gauche */}
            <EnlumBuilding
              x={380} y={groundY} w={140} h={200}
              roofType="arche" wallColor={OCRE_PALE} roofColor={VERT}
              windows={1}
            />
          </g>

          <g opacity={enter(30)}>
            {/* Tour fortifiee extreme gauche */}
            <EnlumBuilding
              x={270} y={groundY} w={100} h={260}
              roofType="tour" wallColor={STONE} roofColor={LAPIS}
              windows={1}
            />
          </g>

          {/* ── Personnages ── */}
          <g opacity={enter(55)}>
            {/* Noble 1 - parle */}
            <EnlumChar x={960 + nobleTalk * 0.3} y={groundY} facing="right"
              type="noble" anim="talk" frame={frame} />
          </g>
          <g opacity={enter(65)}>
            {/* Noble 2 - ecoute */}
            <EnlumChar x={1100} y={groundY} facing="left"
              type="marchand" anim="idle" frame={frame} />
          </g>
          <g opacity={enter(75)}>
            {/* Pretre - prie */}
            <EnlumChar x={820} y={groundY} facing="right"
              type="pretre" anim="pray" frame={frame} />
          </g>
          <g opacity={enter(85)}>
            {/* Paysan - marche */}
            <EnlumChar x={peasantX} y={groundY} facing="right"
              type="paysan" anim="walk" frame={frame} />
          </g>

          {/* Banderoles */}
          <Banderole
            x={960 + nobleTalk * 0.3}
            y={groundY - 270}
            text="Dieu nous garde de ce mal..."
            progress={banderole1Progress}
          />
          <Banderole
            x={820}
            y={groundY - 300}
            text="Ora pro nobis"
            progress={banderole2Progress}
          />

        </g>

        {/* ── Initiale enluminee ── */}
        <InitialeLetter
          x={248}
          y={128}
          letter="A"
          progress={enter(0, 30)}
        />

        {/* ── Titre calligraphie ── */}
        <g opacity={enter(5)}>
          <text x={960} y={80} textAnchor="middle"
            fontSize="34" fontFamily="serif" fill={GOLD_DARK} letterSpacing="8">
            ANNO DOMINI MCCCXLVII
          </text>
          <line x1={400} y1={92} x2={1520} y2={92} stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
        </g>

        {/* ── Bordure ornementale ── */}
        <EnlumBorder progress={enter(0, 40)} />

        {/* ── Texte latin marge bas ── */}
        <text x={960} y={1058} textAnchor="middle"
          fontSize="11" fontFamily="serif" fill={GOLD_DARK} fontStyle="italic"
          opacity={enter(40)}>
          Hic incipit pestis magna · In nomine Patris et Filii et Spiritus Sancti
        </text>

        {/* ── Numerotation page medievale ── */}
        <text x={1880} y={1060} textAnchor="end"
          fontSize="11" fontFamily="serif" fill={INK_MID} opacity="0.6">
          fol. XII
        </text>
      </svg>
    </AbsoluteFill>
  );
};

