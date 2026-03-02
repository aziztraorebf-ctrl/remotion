import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ─── Palette ────────────────────────────────────────────────────────────────
const SKY_TOP = "#e8c87a";
const SKY_BOT = "#f5a44a";
const SUN_COLOR = "#ffe066";
const CLOUD_COLOR = "#fff8e8";
const GROUND_COLOR = "#8B6914";
const DIRT_COLOR = "#6b4f10";
const GRASS_COLOR = "#5a8c3a";
const STONE_COLOR = "#b8a880";
const STONE_DARK = "#8a7a60";
const THATCH_COLOR = "#c8a040";
const THATCH_DARK = "#9a7a28";
const WOOD_COLOR = "#8B5E2A";
const WOOD_DARK = "#5a3a14";
const PLASTER_COLOR = "#e8d8b0";
const PARCHMENT = "#f4e4c1";
const SHADOW_COLOR = "rgba(60, 30, 0, 0.22)";
const STROKE = "#3a2000";

// Paysan homme
const SKIN = "#d4a76a";
const TUNIC_MAN = "#6b4a8a";
const PANTS_MAN = "#4a3a6a";
// Paysanne femme
const DRESS_WOMAN = "#8a4040";
const HAIR_WOMAN = "#4a2000";
// Marchand
const TUNIC_MERCHANT = "#3a6a3a";
const HAT_MERCHANT = "#2a4a2a";

// ─── Filtres SVG réutilisables ───────────────────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="4" stdDeviation="5" floodColor={SHADOW_COLOR} />
    </filter>
    <filter id="shadow-soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3" stdDeviation="8" floodColor="rgba(60,30,0,0.14)" />
    </filter>
    <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="5" result="n" />
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.09 0" result="c" />
      <feComposite in="c" in2="SourceGraphic" operator="over" />
    </filter>
    <filter id="glow-sun" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="18" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={SKY_TOP} />
      <stop offset="100%" stopColor={SKY_BOT} />
    </linearGradient>
    <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={GRASS_COLOR} />
      <stop offset="40%" stopColor={GROUND_COLOR} />
      <stop offset="100%" stopColor={DIRT_COLOR} />
    </linearGradient>
    <linearGradient id="stone-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={STONE_COLOR} />
      <stop offset="100%" stopColor={STONE_DARK} />
    </linearGradient>
    <linearGradient id="plaster-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={PLASTER_COLOR} />
      <stop offset="100%" stopColor="#d4c49a" />
    </linearGradient>
  </defs>
);

// ─── Nuage ───────────────────────────────────────────────────────────────────
interface CloudProps { cx: number; cy: number; scale: number; opacity: number }
const Cloud: React.FC<CloudProps> = ({ cx, cy, scale, opacity }) => (
  <g transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opacity} filter="url(#shadow-soft)">
    <ellipse cx={0}   cy={0}   rx={60} ry={30} fill={CLOUD_COLOR} />
    <ellipse cx={45}  cy={-10} rx={40} ry={25} fill={CLOUD_COLOR} />
    <ellipse cx={-40} cy={-8}  rx={35} ry={22} fill={CLOUD_COLOR} />
    <ellipse cx={10}  cy={-20} rx={45} ry={28} fill={CLOUD_COLOR} />
  </g>
);

// ─── Maison paysanne (chaume) ─────────────────────────────────────────────────
interface HouseProps { x: number; groundY: number; w: number; h: number; roofH: number; variant?: number }
const HousePeasant: React.FC<HouseProps> = ({ x, groundY, w, h, roofH, variant = 0 }) => {
  const wallTop = groundY - h;
  const roofTop = wallTop - roofH;
  const doorW = w * 0.22;
  const doorH = h * 0.42;
  const windowSize = w * 0.16;

  return (
    <g filter="url(#shadow)">
      {/* Mur */}
      <rect x={x} y={wallTop} width={w} height={h} fill="url(#plaster-wall)" stroke={STROKE} strokeWidth="2.5" filter="url(#paper)" />
      {/* Poutres bois croisées */}
      <line x1={x} y1={wallTop} x2={x + w * 0.5} y2={groundY} stroke={WOOD_COLOR} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1={x + w} y1={wallTop} x2={x + w * 0.5} y2={groundY} stroke={WOOD_COLOR} strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <line x1={x} y1={wallTop + h * 0.4} x2={x + w} y2={wallTop + h * 0.4} stroke={WOOD_COLOR} strokeWidth="4" opacity="0.45" />
      <line x1={x} y1={wallTop + h * 0.7} x2={x + w} y2={wallTop + h * 0.7} stroke={WOOD_COLOR} strokeWidth="4" opacity="0.45" />
      {/* Fenêtre */}
      {variant === 0 && (
        <g>
          <rect x={x + w * 0.62} y={wallTop + h * 0.2} width={windowSize} height={windowSize} rx={3} fill="#c8a84b" stroke={STROKE} strokeWidth="2" />
          <line x1={x + w * 0.62 + windowSize / 2} y1={wallTop + h * 0.2} x2={x + w * 0.62 + windowSize / 2} y2={wallTop + h * 0.2 + windowSize} stroke={STROKE} strokeWidth="1.5" opacity="0.6" />
        </g>
      )}
      {/* Porte */}
      <rect x={x + w * 0.5 - doorW / 2} y={groundY - doorH} width={doorW} height={doorH} rx={doorW * 0.4} fill={WOOD_DARK} stroke={STROKE} strokeWidth="2" />
      <rect x={x + w * 0.5 - doorW / 2 + 4} y={groundY - doorH + 4} width={doorW - 8} height={doorH - 4} rx={doorW * 0.35} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
      {/* Toit chaume */}
      <polygon
        points={`${x - 12},${wallTop} ${x + w / 2},${roofTop} ${x + w + 12},${wallTop}`}
        fill={THATCH_COLOR}
        stroke={STROKE}
        strokeWidth="2.5"
        filter="url(#paper)"
      />
      <polygon
        points={`${x - 12},${wallTop} ${x + w / 2},${roofTop} ${x + w + 12},${wallTop}`}
        fill="none"
        stroke={THATCH_DARK}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Lignes de chaume */}
      {Array.from({ length: 6 }, (_, i) => {
        const t = (i + 1) / 7;
        const lx1 = x - 12 + (x + w / 2 - (x - 12)) * t;
        const ly1 = wallTop + (roofTop - wallTop) * t;
        const lx2 = x + w + 12 - (x + w + 12 - (x + w / 2)) * t;
        return <line key={i} x1={lx1} y1={ly1} x2={lx2} y2={ly1} stroke={THATCH_DARK} strokeWidth="1.5" opacity="0.4" />;
      })}
    </g>
  );
};

// ─── Taverne (bâtiment en pierre + enseigne) ──────────────────────────────────
interface TavernProps { x: number; groundY: number }
const Tavern: React.FC<TavernProps> = ({ x, groundY }) => {
  const w = 260;
  const h = 280;
  const wallTop = groundY - h;
  const roofH = 110;
  const roofTop = wallTop - roofH;

  return (
    <g filter="url(#shadow)">
      {/* Corps principal */}
      <rect x={x} y={wallTop} width={w} height={h} fill="url(#stone-wall)" stroke={STROKE} strokeWidth="3" filter="url(#paper)" />
      {/* Jointifs pierres */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => {
          const bw = w / 5;
          const bh = h / 8;
          const offset = row % 2 === 0 ? 0 : bw / 2;
          return (
            <rect
              key={`${row}-${col}`}
              x={x + col * bw - offset}
              y={wallTop + row * bh}
              width={bw}
              height={bh}
              fill="none"
              stroke={STONE_DARK}
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })
      )}
      {/* Grandes fenêtres */}
      <rect x={x + 30} y={wallTop + 40} width={70} height={80} rx={5} fill="#c8a84b" stroke={STROKE} strokeWidth="2.5" />
      <line x1={x + 65} y1={wallTop + 40} x2={x + 65} y2={wallTop + 120} stroke={STROKE} strokeWidth="2" opacity="0.6" />
      <line x1={x + 30} y1={wallTop + 80} x2={x + 100} y2={wallTop + 80} stroke={STROKE} strokeWidth="2" opacity="0.6" />
      <rect x={x + w - 100} y={wallTop + 40} width={70} height={80} rx={5} fill="#c8a84b" stroke={STROKE} strokeWidth="2.5" />
      <line x1={x + w - 65} y1={wallTop + 40} x2={x + w - 65} y2={wallTop + 120} stroke={STROKE} strokeWidth="2" opacity="0.6" />
      <line x1={x + w - 100} y1={wallTop + 80} x2={x + w - 30} y2={wallTop + 80} stroke={STROKE} strokeWidth="2" opacity="0.6" />
      {/* Porte double */}
      <rect x={x + w / 2 - 45} y={groundY - 130} width={90} height={130} rx={8} fill={WOOD_DARK} stroke={STROKE} strokeWidth="2.5" />
      <line x1={x + w / 2} y1={groundY - 130} x2={x + w / 2} y2={groundY} stroke={STROKE} strokeWidth="2" />
      <rect x={x + w / 2 - 40} y={groundY - 125} width={38} height={125} rx={6} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
      <rect x={x + w / 2 + 2} y={groundY - 125} width={38} height={125} rx={6} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
      {/* Toit tuiles */}
      <polygon
        points={`${x - 15},${wallTop} ${x + w / 2},${roofTop} ${x + w + 15},${wallTop}`}
        fill="#8a4020"
        stroke={STROKE}
        strokeWidth="3"
        filter="url(#paper)"
      />
      {Array.from({ length: 5 }, (_, i) => {
        const t = (i + 1) / 6;
        const lx1 = x - 15 + (x + w / 2 - (x - 15)) * t;
        const ly = wallTop + (roofTop - wallTop) * t;
        const lx2 = x + w + 15 - (x + w + 15 - (x + w / 2)) * t;
        return <line key={i} x1={lx1} y1={ly} x2={lx2} y2={ly} stroke="#6a2a10" strokeWidth="2" opacity="0.5" />;
      })}
      {/* Enseigne */}
      <line x1={x + 55} y1={wallTop - 10} x2={x + 55} y2={wallTop + 60} stroke={WOOD_DARK} strokeWidth="5" />
      <rect x={x + 60} y={wallTop + 15} width={130} height={44} rx={6} fill={PARCHMENT} stroke={WOOD_DARK} strokeWidth="3" />
      <text x={x + 125} y={wallTop + 44} textAnchor="middle" fontSize={18} fontFamily="serif" fill={STROKE} fontWeight="bold">
        LA BONNE BIERE
      </text>
    </g>
  );
};

// ─── Église (pierre, clocher) ────────────────────────────────────────────────
interface ChurchProps { x: number; groundY: number }
const Church: React.FC<ChurchProps> = ({ x, groundY }) => {
  const w = 200;
  const h = 240;
  const wallTop = groundY - h;
  const towerW = 70;
  const towerH = 180;
  const towerX = x + w - towerW - 10;
  const towerTop = groundY - h - towerH;
  const spireH = 100;

  return (
    <g filter="url(#shadow)">
      {/* Nef principale */}
      <rect x={x} y={wallTop} width={w} height={h} fill="url(#stone-wall)" stroke={STROKE} strokeWidth="3" filter="url(#paper)" />
      {/* Grandes fenêtres en arc */}
      {[x + 20, x + 90].map((wx, i) => (
        <g key={i}>
          <rect x={wx} y={wallTop + 30} width={44} height={70} rx={22} fill="#c8a84b" stroke={STROKE} strokeWidth="2.5" />
          <line x1={wx + 22} y1={wallTop + 30} x2={wx + 22} y2={wallTop + 100} stroke={STROKE} strokeWidth="1.5" opacity="0.5" />
        </g>
      ))}
      {/* Portail */}
      <rect x={x + w / 2 - 25} y={groundY - 100} width={50} height={100} rx={25} fill={WOOD_DARK} stroke={STROKE} strokeWidth="2.5" />
      <rect x={x + w / 2 - 20} y={groundY - 96} width={40} height={96} rx={20} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
      {/* Toit de la nef */}
      <polygon
        points={`${x - 10},${wallTop} ${x + w / 2},${wallTop - 80} ${x + w + 10},${wallTop}`}
        fill="#7a6050"
        stroke={STROKE}
        strokeWidth="2.5"
      />
      {/* Clocher */}
      <rect x={towerX} y={towerTop} width={towerW} height={towerH} fill="url(#stone-wall)" stroke={STROKE} strokeWidth="3" filter="url(#paper)" />
      {/* Fenêtre clocher */}
      <rect x={towerX + 12} y={towerTop + 40} width={46} height={60} rx={23} fill="#c8a84b" stroke={STROKE} strokeWidth="2" />
      {/* Flèche */}
      <polygon
        points={`${towerX - 5},${towerTop} ${towerX + towerW / 2},${towerTop - spireH} ${towerX + towerW + 5},${towerTop}`}
        fill="#6a5040"
        stroke={STROKE}
        strokeWidth="3"
      />
      {/* Croix au sommet */}
      <line x1={towerX + towerW / 2} y1={towerTop - spireH - 30} x2={towerX + towerW / 2} y2={towerTop - spireH} stroke={STROKE} strokeWidth="4" />
      <line x1={towerX + towerW / 2 - 12} y1={towerTop - spireH - 18} x2={towerX + towerW / 2 + 12} y2={towerTop - spireH - 18} stroke={STROKE} strokeWidth="4" />
    </g>
  );
};

// ─── Puits ────────────────────────────────────────────────────────────────────
interface WellProps { x: number; groundY: number }
const Well: React.FC<WellProps> = ({ x, groundY }) => {
  const w = 80;
  const h = 60;
  const wallTop = groundY - h;

  return (
    <g filter="url(#shadow)">
      {/* Base cylindrique */}
      <ellipse cx={x} cy={wallTop} rx={w / 2} ry={12} fill={STONE_DARK} stroke={STROKE} strokeWidth="2" />
      <rect x={x - w / 2} y={wallTop} width={w} height={h} fill={STONE_COLOR} stroke={STROKE} strokeWidth="2" />
      <ellipse cx={x} cy={wallTop + h} rx={w / 2} ry={12} fill={STONE_DARK} stroke={STROKE} strokeWidth="2" />
      {/* Toit du puits */}
      <line x1={x - 50} y1={wallTop - 20} x2={x - 50} y2={wallTop + 5} stroke={WOOD_DARK} strokeWidth="8" strokeLinecap="round" />
      <line x1={x + 50} y1={wallTop - 20} x2={x + 50} y2={wallTop + 5} stroke={WOOD_DARK} strokeWidth="8" strokeLinecap="round" />
      <polygon
        points={`${x - 65},${wallTop - 20} ${x},${wallTop - 60} ${x + 65},${wallTop - 20}`}
        fill={THATCH_COLOR}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Seau */}
      <rect x={x - 12} y={wallTop - 40} width={24} height={20} rx={4} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
      <line x1={x} y1={wallTop - 40} x2={x} y2={wallTop - 20} stroke={STROKE} strokeWidth="2" opacity="0.5" />
    </g>
  );
};

// ─── Personnage générique articulé ────────────────────────────────────────────
interface CharProps {
  x: number;
  groundY: number;
  frame: number;
  phaseOffset?: number;
  scale?: number;
  tunicColor: string;
  pantsColor: string;
  skinColor?: string;
  hairColor?: string;
  isWoman?: boolean;
  hasBag?: boolean;
  hasHat?: boolean;
}
const Character: React.FC<CharProps> = ({
  x,
  groundY,
  frame,
  phaseOffset = 0,
  scale = 1,
  tunicColor,
  pantsColor,
  skinColor = SKIN,
  hairColor = "#4a2c00",
  isWoman = false,
  hasBag = false,
  hasHat = false,
}) => {
  const cycle = (frame + phaseOffset) / 10;
  const la = Math.sin(cycle) * 28;
  const ra = Math.sin(cycle + Math.PI) * 28;
  const ll = Math.sin(cycle + Math.PI) * 28;
  const rl = Math.sin(cycle) * 28;
  const bob = Math.abs(Math.sin(cycle)) * 4;

  const headR = 28;
  const torsoH = 68;
  const torsoW = 42;
  const armL = 54;
  const armW = 13;
  const legL = 65;
  const legW = 15;
  const footW = 22;
  const footH = 10;

  const neckY = groundY - legL - torsoH - headR * 2 - bob;
  const torsoTop = neckY + headR * 2 + 4;
  const hipY = torsoTop + torsoH;
  const shoulderY = torsoTop + 14;

  return (
    <g transform={`translate(${x}, 0) scale(${scale})`} filter="url(#shadow-soft)">
      {/* Shadow sous les pieds */}
      <ellipse cx={0} cy={groundY} rx={28} ry={6} fill="rgba(60,30,0,0.15)" />

      {/* Jambe gauche (derrière) */}
      <g transform={`translate(-10, ${hipY}) rotate(${ll}, 0, 0)`}>
        <rect x={-legW / 2} y={0} width={legW} height={legL} rx={legW / 2} fill={pantsColor} stroke={STROKE} strokeWidth="1.5" />
        <rect x={-legW / 2 - 2} y={legL - footH / 2} width={footW} height={footH} rx={footH / 2} fill={STROKE} />
      </g>

      {/* Bras gauche (derrière) */}
      <g transform={`translate(${-torsoW / 2 + 4}, ${shoulderY}) rotate(${la}, 0, 0)`}>
        <rect x={-armW / 2} y={0} width={armW} height={armL} rx={armW / 2} fill={skinColor} stroke={STROKE} strokeWidth="1.5" />
        <rect x={-armW / 2} y={0} width={armW} height={armL * 0.55} rx={armW / 2} fill={tunicColor} stroke={STROKE} strokeWidth="1" />
        {hasBag && (
          <rect x={-armW / 2 - 14} y={armL * 0.55} width={22} height={18} rx={4} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="1.5" />
        )}
      </g>

      {/* Torse */}
      <g transform={`translate(0, ${torsoTop})`}>
        {isWoman ? (
          <path
            d={`M ${-torsoW / 2} 0 Q ${-torsoW / 2 - 8} ${torsoH * 0.6} ${-torsoW / 2 - 12} ${torsoH}
                L ${torsoW / 2 + 12} ${torsoH} Q ${torsoW / 2 + 8} ${torsoH * 0.6} ${torsoW / 2} 0 Z`}
            fill={tunicColor}
            stroke={STROKE}
            strokeWidth="2"
            filter="url(#paper)"
          />
        ) : (
          <rect x={-torsoW / 2} y={0} width={torsoW} height={torsoH} rx={10} fill={tunicColor} stroke={STROKE} strokeWidth="2" filter="url(#paper)" />
        )}
        {/* Ceinture */}
        <rect x={-torsoW / 2} y={torsoH * 0.6} width={torsoW} height={9} rx={3} fill={STROKE} opacity="0.7" />
        <rect x={-6} y={torsoH * 0.6 + 2} width={12} height={5} rx={2} fill="#c8a020" />
      </g>

      {/* Jambe droite (devant) */}
      <g transform={`translate(10, ${hipY}) rotate(${rl}, 0, 0)`}>
        <rect x={-legW / 2} y={0} width={legW} height={legL} rx={legW / 2} fill={pantsColor} stroke={STROKE} strokeWidth="1.5" />
        <rect x={-legW / 2 - 2} y={legL - footH / 2} width={footW} height={footH} rx={footH / 2} fill={STROKE} />
      </g>

      {/* Bras droit (devant) */}
      <g transform={`translate(${torsoW / 2 - 4}, ${shoulderY}) rotate(${ra}, 0, 0)`}>
        <rect x={-armW / 2} y={0} width={armW} height={armL} rx={armW / 2} fill={skinColor} stroke={STROKE} strokeWidth="1.5" />
        <rect x={-armW / 2} y={0} width={armW} height={armL * 0.55} rx={armW / 2} fill={tunicColor} stroke={STROKE} strokeWidth="1" />
      </g>

      {/* Cou */}
      <rect x={-10} y={neckY + headR * 2 - 2} width={20} height={14} rx={6} fill={skinColor} stroke={STROKE} strokeWidth="1.5" />

      {/* Tête */}
      <g transform={`translate(0, ${neckY + headR})`}>
        <ellipse cx={0} cy={0} rx={headR} ry={headR * 1.08} fill={skinColor} stroke={STROKE} strokeWidth="2" filter="url(#paper)" />
        {/* Cheveux */}
        {isWoman ? (
          <>
            <ellipse cx={0} cy={-headR * 0.5} rx={headR + 3} ry={headR * 0.65} fill={hairColor} stroke={STROKE} strokeWidth="1.5" />
            <path d={`M ${-headR - 2} 0 Q ${-headR - 8} ${headR * 0.8} ${-headR + 4} ${headR * 1.2}`} stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d={`M ${headR + 2} 0 Q ${headR + 8} ${headR * 0.8} ${headR - 4} ${headR * 1.2}`} stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <ellipse cx={0} cy={-headR * 0.55} rx={headR + 3} ry={headR * 0.62} fill={hairColor} stroke={STROKE} strokeWidth="1.5" />
        )}
        {/* Chapeau marchand */}
        {hasHat && (
          <g>
            <rect x={-headR - 8} y={-headR * 0.8} width={(headR + 8) * 2} height={10} rx={4} fill={HAT_MERCHANT} stroke={STROKE} strokeWidth="1.5" />
            <rect x={-headR * 0.65} y={-headR * 1.5} width={headR * 1.3} height={headR * 0.75} rx={5} fill={HAT_MERCHANT} stroke={STROKE} strokeWidth="1.5" />
          </g>
        )}
        {/* Yeux */}
        <circle cx={-10} cy={4}  r={4} fill="white" stroke={STROKE} strokeWidth="1" />
        <circle cx={10}  cy={4}  r={4} fill="white" stroke={STROKE} strokeWidth="1" />
        <circle cx={-10} cy={5}  r={2} fill={STROKE} />
        <circle cx={10}  cy={5}  r={2} fill={STROKE} />
        {/* Bouche souriante */}
        <path d="M -7 14 Q 0 20 7 14" stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// ─── Arbres ───────────────────────────────────────────────────────────────────
interface TreeProps { x: number; groundY: number; h?: number; trunkH?: number }
const Tree: React.FC<TreeProps> = ({ x, groundY, h = 160, trunkH = 50 }) => (
  <g filter="url(#shadow-soft)">
    {/* Tronc */}
    <rect x={x - 12} y={groundY - trunkH} width={24} height={trunkH} rx={6} fill={WOOD_COLOR} stroke={STROKE} strokeWidth="2" />
    {/* Feuillage (3 couches) */}
    <ellipse cx={x} cy={groundY - trunkH - h * 0.35} rx={h * 0.38} ry={h * 0.32} fill="#4a7a28" stroke={STROKE} strokeWidth="2" filter="url(#paper)" />
    <ellipse cx={x} cy={groundY - trunkH - h * 0.6} rx={h * 0.30} ry={h * 0.28} fill="#5a8c38" stroke={STROKE} strokeWidth="2" filter="url(#paper)" />
    <ellipse cx={x} cy={groundY - trunkH - h * 0.8} rx={h * 0.20} ry={h * 0.20} fill="#6aA040" stroke={STROKE} strokeWidth="1.5" />
  </g>
);

// ─── Herbe / sol ──────────────────────────────────────────────────────────────
interface GroundProps { groundY: number }
const Ground: React.FC<GroundProps> = ({ groundY }) => (
  <g>
    <rect x={0} y={groundY} width={1920} height={1080 - groundY} fill="url(#ground-grad)" />
    {/* Pavés irréguliers */}
    {Array.from({ length: 28 }, (_, i) => {
      const pw = 55 + (i * 17) % 30;
      const ph = 18 + (i * 11) % 12;
      const px = 30 + i * 64 + (i % 3) * 8;
      const py = groundY + 8 + (i % 4) * 6;
      return (
        <rect key={i} x={px} y={py} width={pw} height={ph} rx={4}
          fill={STONE_COLOR} stroke={STONE_DARK} strokeWidth="1.5" opacity="0.65" />
      );
    })}
    {/* Touffes d'herbe */}
    {Array.from({ length: 18 }, (_, i) => {
      const gx = 60 + i * 108 + (i % 3) * 15;
      return (
        <g key={i}>
          <path d={`M ${gx} ${groundY} Q ${gx - 5} ${groundY - 18} ${gx - 2} ${groundY - 24}`} stroke={GRASS_COLOR} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M ${gx + 6} ${groundY} Q ${gx + 8} ${groundY - 22} ${gx + 4} ${groundY - 28}`} stroke="#6aA040" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d={`M ${gx + 14} ${groundY} Q ${gx + 16} ${groundY - 16} ${gx + 18} ${groundY - 22}`} stroke={GRASS_COLOR} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

// ─── Scène principale ─────────────────────────────────────────────────────────
export const SVGVillageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groundY = 780;

  // Entrée globale avec spring
  const sceneEntry = spring({ frame, fps, config: { damping: 30, stiffness: 60 } });
  const globalOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Nuages qui dérivent lentement
  const cloudDrift = frame * 0.25;

  // Soleil qui monte doucement
  const sunY = interpolate(frame, [0, 300], [160, 130], { extrapolateRight: "clamp" });

  // Personnages : positions qui bougent
  const peasantX = interpolate(frame, [0, 300], [200, 420], { extrapolateRight: "clamp" });
  const womanX = interpolate(frame, [0, 300], [1600, 1380], { extrapolateRight: "clamp" });
  const merchantX = interpolate(frame, [0, 300], [900, 980], { extrapolateRight: "clamp" });

  // Fumée de cheminée
  const smokeOffset = Math.sin(frame * 0.08) * 6;
  const smokeOpacity = 0.3 + Math.sin(frame * 0.12) * 0.1;

  return (
    <div style={{ width: 1920, height: 1080, overflow: "hidden", opacity: globalOpacity }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* Ciel */}
        <rect width="1920" height={groundY + 20} fill="url(#sky)" />

        {/* Soleil avec halo */}
        <circle cx={240} cy={sunY} r={55} fill={SUN_COLOR} filter="url(#glow-sun)" opacity="0.5" />
        <circle cx={240} cy={sunY} r={44} fill={SUN_COLOR} stroke="#ffd000" strokeWidth="3" />

        {/* Nuages */}
        <Cloud cx={300 + cloudDrift}  cy={120} scale={1.1}  opacity={0.9} />
        <Cloud cx={700 + cloudDrift}  cy={90}  scale={0.85} opacity={0.75} />
        <Cloud cx={1100 + cloudDrift} cy={140} scale={1.2}  opacity={0.88} />
        <Cloud cx={1500 + cloudDrift} cy={100} scale={0.9}  opacity={0.7} />
        <Cloud cx={1800 + cloudDrift} cy={130} scale={0.7}  opacity={0.65} />

        {/* === COUCHE BÂTIMENTS (arrière-plan d'abord) === */}

        {/* Arbres arrière */}
        <Tree x={60}  groundY={groundY} h={140} trunkH={45} />
        <Tree x={140} groundY={groundY} h={120} trunkH={38} />
        <Tree x={1780} groundY={groundY} h={150} trunkH={50} />
        <Tree x={1860} groundY={groundY} h={110} trunkH={35} />

        {/* Église (fond gauche) */}
        <Church x={80} groundY={groundY} />

        {/* Maisons */}
        <HousePeasant x={340}  groundY={groundY} w={160} h={200} roofH={90}  variant={0} />
        <HousePeasant x={520}  groundY={groundY} w={130} h={170} roofH={80}  variant={1} />
        <HousePeasant x={1300} groundY={groundY} w={150} h={190} roofH={85}  variant={0} />
        <HousePeasant x={1470} groundY={groundY} w={170} h={210} roofH={95}  variant={1} />
        <HousePeasant x={1660} groundY={groundY} w={120} h={155} roofH={70}  variant={0} />

        {/* Taverne (centre) */}
        <Tavern x={730} groundY={groundY} />

        {/* Puits */}
        <Well x={1060} groundY={groundY} />

        {/* Arbres avant-plan */}
        <Tree x={620}  groundY={groundY} h={100} trunkH={30} />
        <Tree x={1240} groundY={groundY} h={110} trunkH={32} />

        {/* Fumée de cheminée taverne */}
        {Array.from({ length: 5 }, (_, i) => {
          const age = (frame + i * 18) % 90;
          const sy = groundY - 280 - age * 1.8;
          const sx = 830 + smokeOffset + age * 0.4;
          const sr = 10 + age * 0.3;
          const sop = Math.max(0, smokeOpacity - age / 90 * 0.35);
          return <circle key={i} cx={sx} cy={sy} r={sr} fill="#c8b090" opacity={sop} />;
        })}

        {/* === SOL === */}
        <Ground groundY={groundY} />

        {/* === PERSONNAGES (sur le sol, au premier plan) === */}

        {/* Paysan homme - marche vers la droite */}
        <Character
          x={peasantX}
          groundY={groundY}
          frame={frame}
          phaseOffset={0}
          scale={1}
          tunicColor={TUNIC_MAN}
          pantsColor={PANTS_MAN}
          hairColor="#3a2000"
        />

        {/* Marchand - légèrement stationnaire, animé doucement */}
        <Character
          x={merchantX}
          groundY={groundY}
          frame={frame}
          phaseOffset={30}
          scale={1.05}
          tunicColor={TUNIC_MERCHANT}
          pantsColor="#2a3a2a"
          hairColor="#2a1a00"
          hasBag
          hasHat
        />

        {/* Paysanne - marche vers la gauche */}
        <Character
          x={womanX}
          groundY={groundY}
          frame={frame}
          phaseOffset={15}
          scale={0.9}
          tunicColor={DRESS_WOMAN}
          pantsColor="#6a2828"
          hairColor={HAIR_WOMAN}
          isWoman
        />

        {/* Titre bas de page */}
        <g opacity={interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={760} y={995} width={400} height={52} rx={8} fill={PARCHMENT} stroke={WOOD_DARK} strokeWidth="2.5" opacity="0.92" />
          <text x={960} y={1028} textAnchor="middle" fontSize={22} fontFamily="serif" fill={STROKE} fontStyle="italic">
            Un village médiéval — avant la Peste
          </text>
        </g>
      </svg>
    </div>
  );
};
