import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

// ─── Palette gravure ─────────────────────────────────────────────────────────
const PARCHMENT = "#e8dcc8";
const PARCHMENT_DARK = "#d4c8a8";
const INK = "#1a1008";
const INK_MID = "#2a1e10";
const INK_LIGHT = "#4a3828";

// ─── Filtres SVG ──────────────────────────────────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    <filter id="parchment-age" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018 0.025" numOctaves="4" seed="8" result="noise" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0.56  0 0 0 0 0.45  0 0 0 0 0.28  0 0 0 0.22 0"
        result="coloredNoise" />
      <feComposite in="coloredNoise" in2="SourceGraphic" operator="over" />
    </filter>
    <filter id="ink-grain" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="3" result="n" />
      <feColorMatrix type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0"
        result="c" />
      <feComposite in="c" in2="SourceGraphic" operator="over" />
    </filter>
    <filter id="drop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="1.5" dy="2" stdDeviation="2.5" floodColor="rgba(26,16,8,0.28)" />
    </filter>
    <pattern id="hatch-45" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.8" opacity="0.55" />
    </pattern>
    <pattern id="hatch-v" patternUnits="userSpaceOnUse" width="4" height="4">
      <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.7" opacity="0.4" />
    </pattern>
    <pattern id="hatch-dense" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="3" stroke={INK} strokeWidth="0.9" opacity="0.6" />
    </pattern>
    <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="5" height="5">
      <line x1="0" y1="0" x2="0" y2="5" stroke={INK} strokeWidth="0.7" opacity="0.35" />
      <line x1="0" y1="0" x2="5" y2="0" stroke={INK} strokeWidth="0.7" opacity="0.35" />
    </pattern>
    <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={PARCHMENT_DARK} />
      <stop offset="100%" stopColor={PARCHMENT} />
    </linearGradient>
  </defs>
);

// ─── Hachures rect ────────────────────────────────────────────────────────────
interface HatchProps { x: number; y: number; w: number; h: number; pattern?: string; opacity?: number }
const Hatch: React.FC<HatchProps> = ({ x, y, w, h, pattern = "hatch-45", opacity = 1 }) => (
  <rect x={x} y={y} width={w} height={h} fill={`url(#${pattern})`} opacity={opacity} />
);

// ─── Soleil ───────────────────────────────────────────────────────────────────
const EngrSun: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      return (
        <line key={i}
          x1={cx + Math.cos(angle) * 50} y1={cy + Math.sin(angle) * 50}
          x2={cx + Math.cos(angle) * 76} y2={cy + Math.sin(angle) * 76}
          stroke={INK} strokeWidth="2" opacity="0.55" strokeLinecap="round" />
      );
    })}
    <circle cx={cx} cy={cy} r={48} fill={PARCHMENT} stroke={INK} strokeWidth="2.5" />
    <circle cx={cx} cy={cy} r={40} fill="none" stroke={INK} strokeWidth="1" opacity="0.3" />
    <Hatch x={cx - 48} y={cy - 48} w={54} h={96} pattern="hatch-45" opacity={0.18} />
  </g>
);

// ─── Arbre (corrigé : pas de clipPath global, formes simples) ─────────────────
interface EngrTreeProps { x: number; groundY: number; scale?: number }
const EngrTree: React.FC<EngrTreeProps> = ({ x, groundY, scale = 1 }) => {
  const th = 50 * scale;
  const tw = 13 * scale;
  const cw1 = 60 * scale; const ch1 = 55 * scale;
  const cw2 = 48 * scale; const ch2 = 48 * scale;
  const cw3 = 34 * scale; const ch3 = 36 * scale;

  return (
    <g filter="url(#drop)">
      {/* Tronc */}
      <rect x={x - tw / 2} y={groundY - th} width={tw} height={th}
        fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" rx={tw * 0.35} />
      {/* Hachures tronc côté gauche */}
      <rect x={x - tw / 2} y={groundY - th} width={tw * 0.38} height={th}
        fill="url(#hatch-v)" opacity={0.5} />

      {/* Feuillage bas */}
      <ellipse cx={x} cy={groundY - th - ch1 * 0.5} rx={cw1} ry={ch1 * 0.55}
        fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />
      <ellipse cx={x - cw1 * 0.3} cy={groundY - th - ch1 * 0.5} rx={cw1 * 0.5} ry={ch1 * 0.5}
        fill="url(#hatch-45)" opacity={0.42} />

      {/* Feuillage milieu */}
      <ellipse cx={x + cw2 * 0.08} cy={groundY - th - ch1 - ch2 * 0.4} rx={cw2} ry={ch2 * 0.55}
        fill={INK_MID} stroke={INK} strokeWidth="2" />
      <ellipse cx={x - cw2 * 0.25} cy={groundY - th - ch1 - ch2 * 0.4} rx={cw2 * 0.5} ry={ch2 * 0.5}
        fill="url(#crosshatch)" opacity={0.28} />

      {/* Feuillage sommet */}
      <ellipse cx={x - cw3 * 0.05} cy={groundY - th - ch1 - ch2 * 0.7 - ch3 * 0.45} rx={cw3} ry={ch3 * 0.6}
        fill={PARCHMENT} stroke={INK} strokeWidth="1.8" />
    </g>
  );
};

// ─── Bâtiment gravure ─────────────────────────────────────────────────────────
interface EngrBuildingProps {
  x: number; groundY: number; w: number; h: number; roofH: number;
  roofStyle?: "triangle" | "battlements" | "spire";
  label?: string; windows?: number; detailed?: boolean; opacity?: number;
}
const EngrBuilding: React.FC<EngrBuildingProps> = ({
  x, groundY, w, h, roofH, roofStyle = "triangle",
  label, windows = 2, detailed = true, opacity = 1,
}) => {
  const wallTop = groundY - h;
  const roofTop = wallTop - roofH;

  return (
    <g filter="url(#drop)" opacity={opacity}>
      {/* Corps mur */}
      <rect x={x} y={wallTop} width={w} height={h}
        fill={PARCHMENT} stroke={INK} strokeWidth="2.5" filter="url(#ink-grain)" />
      {/* Ombre côté gauche */}
      <rect x={x} y={wallTop} width={w * 0.26} height={h} fill="url(#hatch-45)" opacity={0.48} />

      {/* Joints de pierres */}
      {detailed && Array.from({ length: Math.floor(h / 28) }, (_, row) =>
        Array.from({ length: Math.floor(w / 36) + 1 }, (_, col) => {
          const bh = 26; const bw = 34;
          const offset = row % 2 === 0 ? 0 : bw / 2;
          return (
            <rect key={`${row}-${col}`}
              x={x + col * bw - offset} y={wallTop + row * bh}
              width={bw} height={bh}
              fill="none" stroke={INK_LIGHT} strokeWidth="1" opacity="0.28" />
          );
        })
      )}

      {/* Fenêtres à meneau en arc */}
      {Array.from({ length: windows }, (_, i) => {
        const ww = w * 0.15; const wh = ww * 1.65;
        const wx = x + w * 0.16 + i * ((w * 0.68) / Math.max(windows - 1, 1));
        const wy = wallTop + h * 0.18;
        return (
          <g key={i}>
            <rect x={wx} y={wy} width={ww} height={wh} rx={ww * 0.5}
              fill={INK_MID} stroke={INK} strokeWidth="2" />
            <line x1={wx + ww / 2} y1={wy + wh * 0.08} x2={wx + ww / 2} y2={wy + wh * 0.92}
              stroke={PARCHMENT} strokeWidth="1.5" opacity="0.55" />
            <line x1={wx + ww * 0.1} y1={wy + wh * 0.5} x2={wx + ww * 0.9} y2={wy + wh * 0.5}
              stroke={PARCHMENT} strokeWidth="1.5" opacity="0.55" />
          </g>
        );
      })}

      {/* Porte */}
      {(() => {
        const dw = w * 0.22; const dh = h * 0.36;
        const dx = x + w / 2 - dw / 2;
        return (
          <g>
            <rect x={dx} y={groundY - dh} width={dw} height={dh} rx={dw * 0.45}
              fill={INK_MID} stroke={INK} strokeWidth="2" />
            {Array.from({ length: 3 }, (_, i) => (
              <line key={i}
                x1={dx + 3} y1={groundY - dh * 0.88 + i * dh * 0.25}
                x2={dx + dw - 3} y2={groundY - dh * 0.88 + i * dh * 0.25}
                stroke={PARCHMENT_DARK} strokeWidth="1" opacity="0.38" />
            ))}
            <circle cx={dx + dw * 0.72} cy={groundY - dh * 0.44}
              r={3} fill={PARCHMENT} stroke={INK} strokeWidth="1" />
          </g>
        );
      })()}

      {/* Toit */}
      {roofStyle === "triangle" && (
        <g>
          <polygon points={`${x - 8},${wallTop} ${x + w / 2},${roofTop} ${x + w + 8},${wallTop}`}
            fill={INK_MID} stroke={INK} strokeWidth="2.5" />
          <rect x={x - 8} y={wallTop} width={w + 16} height={5} fill={INK} opacity="0.75" />
          {/* Lignes de tuiles */}
          {Array.from({ length: 5 }, (_, i) => {
            const t = (i + 1) / 6;
            const ly = wallTop - (wallTop - roofTop) * t;
            const lx1 = x - 8 + (x + w / 2 - (x - 8)) * t;
            const lx2 = x + w + 8 - (x + w + 8 - (x + w / 2)) * t;
            return <line key={i} x1={lx1} y1={ly} x2={lx2} y2={ly}
              stroke={INK} strokeWidth="1.2" opacity="0.4" />;
          })}
          {/* Hachures moitié gauche du toit */}
          <clipPath id={`roof-clip-${x}`}>
            <polygon points={`${x - 8},${wallTop} ${x + w / 2},${roofTop} ${x + w + 8},${wallTop}`} />
          </clipPath>
          <rect x={x - 8} y={roofTop} width={(w + 16) / 2} height={wallTop - roofTop}
            fill="url(#hatch-dense)" opacity={0.35} clipPath={`url(#roof-clip-${x})`} />
        </g>
      )}
      {roofStyle === "battlements" && (
        <g>
          <rect x={x - 5} y={wallTop - 36} width={w + 10} height={36}
            fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2.5" />
          <rect x={x - 5} y={wallTop - 36} width={(w + 10) * 0.28} height={36}
            fill="url(#hatch-45)" opacity={0.42} />
          {Array.from({ length: Math.floor((w + 10) / 28) }, (_, i) => (
            <rect key={i} x={x - 5 + i * 28} y={wallTop - 58}
              width={15} height={24} rx={2}
              fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2.5" />
          ))}
        </g>
      )}
      {roofStyle === "spire" && (
        <g>
          <rect x={x + w * 0.3} y={wallTop - roofH * 0.5} width={w * 0.4} height={roofH * 0.5}
            fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />
          <rect x={x + w * 0.3} y={wallTop - roofH * 0.5} width={w * 0.11} height={roofH * 0.5}
            fill="url(#hatch-45)" opacity={0.45} />
          <polygon
            points={`${x + w * 0.3 - 4},${wallTop - roofH * 0.5} ${x + w * 0.5},${roofTop} ${x + w * 0.7 + 4},${wallTop - roofH * 0.5}`}
            fill={INK_MID} stroke={INK} strokeWidth="2.5" />
          <clipPath id={`spire-clip-${x}`}>
            <polygon
              points={`${x + w * 0.3 - 4},${wallTop - roofH * 0.5} ${x + w * 0.5},${roofTop} ${x + w * 0.7 + 4},${wallTop - roofH * 0.5}`} />
          </clipPath>
          <rect x={x + w * 0.3 - 4} y={roofTop} width={(w * 0.4 + 8) / 2} height={roofH * 0.5}
            fill="url(#hatch-dense)" opacity={0.4} clipPath={`url(#spire-clip-${x})`} />
          <line x1={x + w * 0.5} y1={roofTop - 32} x2={x + w * 0.5} y2={roofTop}
            stroke={INK} strokeWidth="3" />
          <line x1={x + w * 0.5 - 12} y1={roofTop - 20} x2={x + w * 0.5 + 12} y2={roofTop - 20}
            stroke={INK} strokeWidth="3" />
        </g>
      )}

      {/* Enseigne */}
      {label && (
        <g>
          <line x1={x + w * 0.2} y1={wallTop - 8} x2={x + w * 0.2} y2={wallTop + 50}
            stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <rect x={x + w * 0.2 + 5} y={wallTop + 12} width={w * 0.62} height={30}
            rx={4} fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2.5" />
          <text x={x + w * 0.2 + 5 + w * 0.31} y={wallTop + 33}
            textAnchor="middle" fontSize={13} fontFamily="serif" fill={INK} fontStyle="italic">
            {label}
          </text>
        </g>
      )}
    </g>
  );
};

// ─── Sol gravure ──────────────────────────────────────────────────────────────
const EngrGround: React.FC<{ groundY: number }> = ({ groundY }) => (
  <g>
    <line x1={0} y1={groundY} x2={1920} y2={groundY} stroke={INK} strokeWidth="3" />
    <rect x={0} y={groundY} width={1920} height={1080 - groundY} fill={PARCHMENT_DARK} />
    <rect x={0} y={groundY} width={1920} height={1080 - groundY} fill="url(#hatch-45)" opacity={0.5} />
    {/* Pavés */}
    {Array.from({ length: 32 }, (_, i) => {
      const pw = 50 + (i * 17) % 26; const ph = 11 + (i * 7) % 7;
      const px = 15 + i * 58 + (i % 5) * 5;
      const py = groundY + 10 + (i % 4) * 13;
      return (
        <ellipse key={i} cx={px + pw / 2} cy={py + ph / 2} rx={pw / 2} ry={ph / 2}
          fill="none" stroke={INK} strokeWidth="1.5" opacity="0.45" />
      );
    })}
    {/* Herbes */}
    {Array.from({ length: 24 }, (_, i) => {
      const gx = 30 + i * 78 + (i % 5) * 8;
      return (
        <g key={i}>
          <path d={`M ${gx} ${groundY} Q ${gx - 3} ${groundY - 14} ${gx} ${groundY - 20}`}
            stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
          <path d={`M ${gx + 8} ${groundY} Q ${gx + 11} ${groundY - 17} ${gx + 7} ${groundY - 23}`}
            stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d={`M ${gx + 17} ${groundY} Q ${gx + 19} ${groundY - 11} ${gx + 21} ${groundY - 16}`}
            stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
      );
    })}
  </g>
);

// ─── Personnage gravure — ancré au sol, visage de profil ──────────────────────
// groundY = Y exact du sol. Les pieds touchent groundY.
interface EngraveCharProps {
  x: number;
  groundY: number;
  frame: number;
  phaseOffset?: number;
  scale?: number;
  type?: "peasant" | "woman" | "priest" | "merchant";
  facingRight?: boolean;
  // Animations spéciales
  anim?: "walk" | "cough" | "look" | "talk" | "pray";
  animFrame?: number; // frame locale de l'animation spéciale
}

const EngraveCharacter: React.FC<EngraveCharProps> = ({
  x, groundY, frame, phaseOffset = 0, scale = 1,
  type = "peasant", facingRight = true,
  anim = "walk", animFrame = 0,
}) => {
  // ─── Proportions médiévales : tête ~1/5 de la hauteur totale ─────────────
  const TOTAL_H = 190 * scale;
  const HEAD_H  = TOTAL_H * 0.21;
  const HEAD_W  = TOTAL_H * 0.165;
  const TORSO_H = TOTAL_H * 0.27;
  const TORSO_W = TOTAL_H * 0.15;
  const LEG_H   = TOTAL_H * 0.35;  // cuisse + mollet
  const LEG_W   = TOTAL_H * 0.068;
  const ARM_H   = TOTAL_H * 0.27;
  const ARM_W   = TOTAL_H * 0.055;
  const FOOT_RX = LEG_W * 1.1;
  const FOOT_RY = TOTAL_H * 0.022;

  // ─── Ancrage : le bas des jambes = groundY exactement ───────────────────
  // Le "pied bas" est à groundY. On calcule tout vers le haut.
  const feetY   = groundY;
  const hipY    = feetY - LEG_H;
  const torsoTopY = hipY - TORSO_H;
  const neckY   = torsoTopY - HEAD_H * 0.04;
  const headCY  = neckY - HEAD_H * 0.5;

  const shoulderY = torsoTopY + TORSO_H * 0.1;
  const shoulderX = TORSO_W * 0.12;

  // ─── Cycles d'animation ───────────────────────────────────────────────────
  const walkCycle = (frame + phaseOffset) / 11;
  const bob = anim === "walk" ? Math.abs(Math.sin(walkCycle)) * 3 * scale : 0;

  // Angles membres selon animation
  let legSwing = 0, armSwingF = 0, armSwingB = 0;
  let torsoLean = 0;
  let headNod = 0;
  let mouthOpen = 0;
  let browFrown = 0;
  let armRaiseAngle = 0;

  if (anim === "walk") {
    legSwing   = Math.sin(walkCycle) * 22;
    armSwingF  = Math.sin(walkCycle + Math.PI) * 16;
    armSwingB  = Math.sin(walkCycle) * 16;
  } else if (anim === "cough") {
    // Personnage se courbe, bras avant levé vers la bouche
    torsoLean  = interpolate(animFrame, [0, 10, 20, 30, 40, 60], [0, 18, 8, 22, 10, 0], { extrapolateRight: "clamp" });
    armSwingF  = interpolate(animFrame, [0, 12, 25, 40, 60], [-30, -80, -60, -85, 0], { extrapolateRight: "clamp" });
    armSwingB  = 10;
    legSwing   = 5;
    headNod    = interpolate(animFrame, [0, 12, 25, 40, 60], [0, 20, 10, 25, 0], { extrapolateRight: "clamp" });
    mouthOpen  = interpolate(animFrame, [0, 10, 22, 35, 60], [0, 1, 0.5, 1, 0], { extrapolateRight: "clamp" });
  } else if (anim === "look") {
    // Personnage debout qui regarde autour, légèrement étonné
    legSwing   = Math.sin(frame * 0.04) * 4;
    armSwingF  = -15 + Math.sin(frame * 0.06) * 8;
    armSwingB  = 5;
    browFrown  = interpolate(animFrame, [0, 20, 40, 60], [0, -6, 2, 0], { extrapolateRight: "clamp" });
    headNod    = Math.sin(frame * 0.08) * 5;
  } else if (anim === "talk") {
    // Personnage qui gesticule et parle
    legSwing   = 6;
    armSwingF  = -20 + Math.sin(frame * 0.18) * 35;
    armSwingB  = 8 + Math.sin(frame * 0.14) * 20;
    mouthOpen  = Math.abs(Math.sin(frame * 0.22)) * 0.7;
    torsoLean  = Math.sin(frame * 0.1) * 4;
  } else if (anim === "pray") {
    // Mains jointes levées, tête baissée
    armSwingF  = -65;
    armSwingB  = -65;
    headNod    = 25;
    legSwing   = 0;
    torsoLean  = 5;
  }

  // couleur torse selon type
  const tunicFill = type === "priest" ? INK_MID : PARCHMENT_DARK;
  const flip = facingRight ? 1 : -1;

  const uid = `${Math.round(x * 10)}-${type}`;

  return (
    <g transform={`translate(${x}, 0) scale(${flip}, 1)`} filter="url(#drop)">

      {/* Ombre au sol — ellipse aplatie au niveau exact du sol */}
      <ellipse cx={0} cy={groundY} rx={TOTAL_H * 0.13} ry={TOTAL_H * 0.03}
        fill={INK} opacity="0.16" />

      {/* ── Corps avec torso lean éventuel ── */}
      <g transform={`translate(0, ${-bob}) rotate(${torsoLean}, 0, ${hipY})`}>

        {/* JAMBE ARRIÈRE — path organique cuisse+mollet */}
        <g transform={`translate(${-LEG_W * 0.4}, ${hipY}) rotate(${-legSwing}, 0, 0)`}>
          {/* Cuisse : légèrement bombée à l'extérieur */}
          <path
            d={`M ${-LEG_W * 0.42} 0
                C ${-LEG_W * 0.52} ${LEG_H * 0.22} ${-LEG_W * 0.5} ${LEG_H * 0.44} ${-LEG_W * 0.32} ${LEG_H * 0.52}
                L ${LEG_W * 0.28} ${LEG_H * 0.52}
                C ${LEG_W * 0.42} ${LEG_H * 0.44} ${LEG_W * 0.38} ${LEG_H * 0.22} ${LEG_W * 0.28} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={1.2 * scale}
          />
          {/* Ombre côté gauche cuisse — épouse la silhouette */}
          <path
            d={`M ${-LEG_W * 0.42} 0
                C ${-LEG_W * 0.52} ${LEG_H * 0.22} ${-LEG_W * 0.5} ${LEG_H * 0.44} ${-LEG_W * 0.32} ${LEG_H * 0.52}
                L ${-LEG_W * 0.02} ${LEG_H * 0.52}
                C ${-LEG_W * 0.08} ${LEG_H * 0.3} ${-LEG_W * 0.1} ${LEG_H * 0.14} ${-LEG_W * 0.06} 0 Z`}
            fill="url(#hatch-45)" opacity={0.4}
          />
          {/* Mollet : plus fin, inflexion du genou visible */}
          <path
            d={`M ${-LEG_W * 0.32} ${LEG_H * 0.52}
                C ${-LEG_W * 0.44} ${LEG_H * 0.62} ${-LEG_W * 0.38} ${LEG_H * 0.78} ${-LEG_W * 0.24} ${LEG_H}
                L ${LEG_W * 0.22} ${LEG_H}
                C ${LEG_W * 0.36} ${LEG_H * 0.78} ${LEG_W * 0.38} ${LEG_H * 0.62} ${LEG_W * 0.28} ${LEG_H * 0.52} Z`}
            fill={PARCHMENT_DARK} stroke={INK} strokeWidth={scale}
          />
          {/* Ombre mollet */}
          <path
            d={`M ${-LEG_W * 0.32} ${LEG_H * 0.52}
                C ${-LEG_W * 0.44} ${LEG_H * 0.62} ${-LEG_W * 0.38} ${LEG_H * 0.78} ${-LEG_W * 0.24} ${LEG_H}
                L ${-LEG_W * 0.02} ${LEG_H}
                C ${-LEG_W * 0.1} ${LEG_H * 0.78} ${-LEG_W * 0.12} ${LEG_H * 0.62} ${-LEG_W * 0.04} ${LEG_H * 0.52} Z`}
            fill="url(#hatch-45)" opacity={0.35}
          />
          {/* Pied */}
          <ellipse cx={FOOT_RX * 0.15} cy={LEG_H} rx={FOOT_RX} ry={FOOT_RY}
            fill={INK_MID} stroke={INK} strokeWidth={scale} />
        </g>

        {/* BRAS ARRIÈRE — path organique avec inflexion coude */}
        <g transform={`translate(${-shoulderX - ARM_W * 0.35}, ${shoulderY}) rotate(${armSwingB - 8}, 0, 0)`}>
          {/* Haut du bras : légèrement bombé à l'extérieur gauche */}
          <path
            d={`M ${-ARM_W * 0.45} 0
                C ${-ARM_W * 0.58} ${ARM_H * 0.25} ${-ARM_W * 0.55} ${ARM_H * 0.48} ${-ARM_W * 0.28} ${ARM_H * 0.56}
                L ${ARM_W * 0.28} ${ARM_H * 0.56}
                C ${ARM_W * 0.4} ${ARM_H * 0.48} ${ARM_W * 0.36} ${ARM_H * 0.25} ${ARM_W * 0.22} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale}
          />
          {/* Ombre bras arrière */}
          <path
            d={`M ${-ARM_W * 0.45} 0
                C ${-ARM_W * 0.58} ${ARM_H * 0.25} ${-ARM_W * 0.55} ${ARM_H * 0.48} ${-ARM_W * 0.28} ${ARM_H * 0.56}
                L ${-ARM_W * 0.04} ${ARM_H * 0.56}
                C ${-ARM_W * 0.1} ${ARM_H * 0.3} ${-ARM_W * 0.12} ${ARM_H * 0.12} ${-ARM_W * 0.1} 0 Z`}
            fill="url(#hatch-45)" opacity={0.36}
          />
          {/* Avant-bras : légèrement plus fin, inflexion coude */}
          <path
            d={`M ${-ARM_W * 0.28} ${ARM_H * 0.55}
                C ${-ARM_W * 0.38} ${ARM_H * 0.68} ${-ARM_W * 0.3} ${ARM_H * 0.84} ${-ARM_W * 0.18} ${ARM_H}
                L ${ARM_W * 0.18} ${ARM_H}
                C ${ARM_W * 0.28} ${ARM_H * 0.84} ${ARM_W * 0.32} ${ARM_H * 0.68} ${ARM_W * 0.28} ${ARM_H * 0.55} Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale * 0.9}
          />
          {/* Main */}
          <ellipse cx={0} cy={ARM_H} rx={ARM_W * 0.58} ry={TOTAL_H * 0.018}
            fill="#c8a070" stroke={INK} strokeWidth={scale * 0.8} />
        </g>

        {/* TORSE */}
        <g transform={`translate(0, ${torsoTopY})`}>
          {type === "woman" ? (
            <path
              d={`M ${-TORSO_W * 0.45} 0
                  C ${-TORSO_W * 0.52} ${TORSO_H * 0.45} ${-TORSO_W * 0.62} ${TORSO_H * 0.72} ${-TORSO_W * 0.55} ${TORSO_H}
                  L ${TORSO_W * 0.38} ${TORSO_H}
                  C ${TORSO_W * 0.32} ${TORSO_H * 0.72} ${TORSO_W * 0.28} ${TORSO_H * 0.45} ${TORSO_W * 0.32} 0 Z`}
              fill={tunicFill} stroke={INK} strokeWidth={1.5 * scale}
            />
          ) : (
            /* Torse homme : épaules légèrement tombantes, hanche discrètement évasée */
            <path
              d={`M ${-TORSO_W * 0.45} 0
                  C ${-TORSO_W * 0.58} ${TORSO_H * 0.08} ${-TORSO_W * 0.54} ${TORSO_H * 0.4} ${-TORSO_W * 0.48} ${TORSO_H * 0.7}
                  C ${-TORSO_W * 0.52} ${TORSO_H * 0.88} ${-TORSO_W * 0.46} ${TORSO_H} ${-TORSO_W * 0.38} ${TORSO_H}
                  L ${TORSO_W * 0.3} ${TORSO_H}
                  C ${TORSO_W * 0.42} ${TORSO_H} ${TORSO_W * 0.44} ${TORSO_H * 0.88} ${TORSO_W * 0.38} ${TORSO_H * 0.7}
                  C ${TORSO_W * 0.36} ${TORSO_H * 0.4} ${TORSO_W * 0.4} ${TORSO_H * 0.08} ${TORSO_W * 0.28} 0 Z`}
              fill={tunicFill} stroke={INK} strokeWidth={1.5 * scale}
            />
          )}
          {/* Ombre torse gauche */}
          <rect x={-TORSO_W * 0.45} y={0} width={TORSO_W * 0.33} height={TORSO_H}
            fill="url(#hatch-45)" opacity={0.4} />
          {/* Plis verticaux */}
          {Array.from({ length: 3 }, (_, i) => (
            <line key={i}
              x1={-TORSO_W * 0.18 + i * TORSO_W * 0.2} y1={TOTAL_H * 0.02}
              x2={-TORSO_W * 0.18 + i * TORSO_W * 0.2 + 3 * scale} y2={TORSO_H - TOTAL_H * 0.02}
              stroke={INK_LIGHT} strokeWidth={0.8 * scale} opacity="0.5" />
          ))}
          {/* Ceinture (pas femme) */}
          {type !== "woman" && (
            <g>
              <rect x={-TORSO_W * 0.46} y={TORSO_H * 0.64} width={TORSO_W * 0.82} height={TOTAL_H * 0.032}
                fill={INK_MID} stroke={INK} strokeWidth={scale} rx={TOTAL_H * 0.006} />
              <rect x={-TOTAL_H * 0.017} y={TORSO_H * 0.64 + scale} width={TOTAL_H * 0.034} height={TOTAL_H * 0.025}
                fill="none" stroke={PARCHMENT} strokeWidth={scale * 1.2} />
            </g>
          )}
          {/* Croix prêtre */}
          {type === "priest" && (
            <g>
              <line x1={0} y1={TORSO_H * 0.15} x2={0} y2={TORSO_H * 0.55}
                stroke={PARCHMENT} strokeWidth={2 * scale} />
              <line x1={-TORSO_W * 0.18} y1={TORSO_H * 0.28} x2={TORSO_W * 0.18} y2={TORSO_H * 0.28}
                stroke={PARCHMENT} strokeWidth={2 * scale} />
            </g>
          )}
        </g>

        {/* JAMBE AVANT — path organique */}
        <g transform={`translate(${LEG_W * 0.4}, ${hipY}) rotate(${legSwing}, 0, 0)`}>
          {/* Cuisse avant : bombement genou plus prononcé côté avant */}
          <path
            d={`M ${-LEG_W * 0.38} 0
                C ${-LEG_W * 0.46} ${LEG_H * 0.22} ${-LEG_W * 0.44} ${LEG_H * 0.44} ${-LEG_W * 0.28} ${LEG_H * 0.52}
                L ${LEG_W * 0.32} ${LEG_H * 0.52}
                C ${LEG_W * 0.5} ${LEG_H * 0.44} ${LEG_W * 0.52} ${LEG_H * 0.22} ${LEG_W * 0.32} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={1.2 * scale}
          />
          {/* Ombre cuisse avant */}
          <path
            d={`M ${-LEG_W * 0.38} 0
                C ${-LEG_W * 0.46} ${LEG_H * 0.22} ${-LEG_W * 0.44} ${LEG_H * 0.44} ${-LEG_W * 0.28} ${LEG_H * 0.52}
                L ${-LEG_W * 0.0} ${LEG_H * 0.52}
                C ${-LEG_W * 0.04} ${LEG_H * 0.3} ${-LEG_W * 0.06} ${LEG_H * 0.14} ${-LEG_W * 0.02} 0 Z`}
            fill="url(#hatch-45)" opacity={0.3}
          />
          {/* Mollet avant */}
          <path
            d={`M ${-LEG_W * 0.28} ${LEG_H * 0.52}
                C ${-LEG_W * 0.38} ${LEG_H * 0.64} ${-LEG_W * 0.3} ${LEG_H * 0.8} ${-LEG_W * 0.18} ${LEG_H}
                L ${LEG_W * 0.24} ${LEG_H}
                C ${LEG_W * 0.4} ${LEG_H * 0.8} ${LEG_W * 0.44} ${LEG_H * 0.64} ${LEG_W * 0.32} ${LEG_H * 0.52} Z`}
            fill={PARCHMENT_DARK} stroke={INK} strokeWidth={scale}
          />
          {/* Pied */}
          <ellipse cx={FOOT_RX * 0.15} cy={LEG_H} rx={FOOT_RX} ry={FOOT_RY}
            fill={INK_MID} stroke={INK} strokeWidth={scale} />
        </g>

        {/* BRAS AVANT — path organique avec coude */}
        <g transform={`translate(${shoulderX + ARM_W * 0.35}, ${shoulderY}) rotate(${armSwingF + 8}, 0, 0)`}>
          {/* Haut bras avant */}
          <path
            d={`M ${-ARM_W * 0.38} 0
                C ${-ARM_W * 0.5} ${ARM_H * 0.24} ${-ARM_W * 0.46} ${ARM_H * 0.48} ${-ARM_W * 0.22} ${ARM_H * 0.56}
                L ${ARM_W * 0.32} ${ARM_H * 0.56}
                C ${ARM_W * 0.46} ${ARM_H * 0.48} ${ARM_W * 0.44} ${ARM_H * 0.24} ${ARM_W * 0.28} 0 Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale}
          />
          {/* Ombre bras avant côté gauche */}
          <path
            d={`M ${-ARM_W * 0.38} 0
                C ${-ARM_W * 0.5} ${ARM_H * 0.24} ${-ARM_W * 0.46} ${ARM_H * 0.48} ${-ARM_W * 0.22} ${ARM_H * 0.56}
                L ${-ARM_W * 0.02} ${ARM_H * 0.56}
                C ${-ARM_W * 0.06} ${ARM_H * 0.32} ${-ARM_W * 0.08} ${ARM_H * 0.14} ${-ARM_W * 0.06} 0 Z`}
            fill="url(#hatch-45)" opacity={0.26}
          />
          {/* Avant-bras : inflexion coude vers l'extérieur */}
          <path
            d={`M ${-ARM_W * 0.22} ${ARM_H * 0.55}
                C ${-ARM_W * 0.34} ${ARM_H * 0.7} ${-ARM_W * 0.26} ${ARM_H * 0.86} ${-ARM_W * 0.14} ${ARM_H}
                L ${ARM_W * 0.2} ${ARM_H}
                C ${ARM_W * 0.3} ${ARM_H * 0.86} ${ARM_W * 0.34} ${ARM_H * 0.7} ${ARM_W * 0.32} ${ARM_H * 0.55} Z`}
            fill={tunicFill} stroke={INK} strokeWidth={scale * 0.9}
          />
          {/* Main */}
          <ellipse cx={0} cy={ARM_H} rx={ARM_W * 0.58} ry={TOTAL_H * 0.018}
            fill="#c8a070" stroke={INK} strokeWidth={scale * 0.8} />
        </g>

        {/* COU */}
        <rect x={-TOTAL_H * 0.033} y={neckY} width={TOTAL_H * 0.074} height={TOTAL_H * 0.042}
          fill="#c8a070" stroke={INK} strokeWidth={scale} rx={TOTAL_H * 0.016} />

        {/* ─── TÊTE DE PROFIL avec headNod ─── */}
        <g transform={`translate(0, ${headCY}) rotate(${headNod}, 0, 0)`}>
          {/* Crâne */}
          <ellipse cx={HEAD_W * 0.06} cy={0} rx={HEAD_W * 0.53} ry={HEAD_H * 0.53}
            fill="#c8a070" stroke={INK} strokeWidth={1.8 * scale} filter="url(#ink-grain)" />

          {/* Visage : front */}
          <path d={`M ${HEAD_W * 0.12} ${-HEAD_H * 0.46}
              C ${HEAD_W * 0.42} ${-HEAD_H * 0.52} ${HEAD_W * 0.56} ${-HEAD_H * 0.3} ${HEAD_W * 0.56} ${-HEAD_H * 0.08}`}
            stroke={INK} strokeWidth={1.5 * scale} fill="none" />

          {/* Nez de profil */}
          <path d={`M ${HEAD_W * 0.53} ${-HEAD_H * 0.07}
              L ${HEAD_W * 0.74} ${HEAD_H * 0.07}
              Q ${HEAD_W * 0.69} ${HEAD_H * 0.15} ${HEAD_W * 0.56} ${HEAD_H * 0.13}`}
            stroke={INK} strokeWidth={1.8 * scale} fill="#b88858" strokeLinejoin="round" />
          <line x1={HEAD_W * 0.56} y1={HEAD_H * 0.13} x2={HEAD_W * 0.72} y2={HEAD_H * 0.15}
            stroke={INK} strokeWidth={scale * 0.7} opacity="0.4" />

          {/* Bouche (s'ouvre selon mouthOpen) */}
          <path
            d={`M ${HEAD_W * 0.52} ${HEAD_H * 0.22}
                Q ${HEAD_W * 0.42} ${HEAD_H * (0.28 + mouthOpen * 0.06)} ${HEAD_W * 0.28} ${HEAD_H * 0.24}`}
            stroke={INK} strokeWidth={1.5 * scale} fill="none" strokeLinecap="round" />
          {mouthOpen > 0.3 && (
            <path
              d={`M ${HEAD_W * 0.5} ${HEAD_H * 0.25}
                  Q ${HEAD_W * 0.42} ${HEAD_H * (0.32 + mouthOpen * 0.04)} ${HEAD_W * 0.3} ${HEAD_H * 0.28}`}
              stroke={INK} strokeWidth={scale * 0.9} fill="none" opacity="0.5" strokeLinecap="round" />
          )}

          {/* Menton */}
          <path d={`M ${HEAD_W * 0.28} ${HEAD_H * 0.28}
              Q ${HEAD_W * 0.18} ${HEAD_H * 0.46} ${HEAD_W * 0.09} ${HEAD_H * 0.5}`}
            stroke={INK} strokeWidth={1.5 * scale} fill="none" />

          {/* Sourcil (avec browFrown) */}
          <path
            d={`M ${HEAD_W * 0.22} ${-HEAD_H * 0.15 + browFrown * scale}
                Q ${HEAD_W * 0.37} ${-HEAD_H * 0.22 + browFrown * scale * 0.6} ${HEAD_W * 0.49} ${-HEAD_H * 0.15 + browFrown * scale * 0.2}`}
            stroke={INK} strokeWidth={1.8 * scale} fill="none" strokeLinecap="round" />

          {/* Oeil de profil */}
          <ellipse cx={HEAD_W * 0.35} cy={-HEAD_H * 0.05} rx={TOTAL_H * 0.018} ry={TOTAL_H * 0.013}
            fill={INK} stroke={INK} strokeWidth={scale * 0.5} />

          {/* Ride joue */}
          <path d={`M ${HEAD_W * 0.5} ${HEAD_H * 0.03}
              Q ${HEAD_W * 0.44} ${HEAD_H * 0.13} ${HEAD_W * 0.42} ${HEAD_H * 0.19}`}
            stroke={INK_LIGHT} strokeWidth={scale * 0.7} fill="none" opacity="0.45" />

          {/* Ombre côté gauche du visage */}
          <clipPath id={`face-${uid}`}>
            <ellipse cx={HEAD_W * 0.06} cy={0} rx={HEAD_W * 0.53} ry={HEAD_H * 0.53} />
          </clipPath>
          <rect x={-HEAD_W * 0.5} y={-HEAD_H * 0.55} width={HEAD_W * 0.38} height={HEAD_H * 1.1}
            fill="url(#hatch-45)" opacity={0.32} clipPath={`url(#face-${uid})`} />

          {/* ─── Coiffures ─── */}
          {type === "peasant" && (
            <g>
              <path d={`M ${-HEAD_W * 0.5} ${-HEAD_H * 0.14}
                  Q ${-HEAD_W * 0.08} ${-HEAD_H * 0.96} ${HEAD_W * 0.32} ${-HEAD_H * 0.7}
                  Q ${HEAD_W * 0.56} ${-HEAD_H * 0.52} ${HEAD_W * 0.46} ${-HEAD_H * 0.22}
                  L ${-HEAD_W * 0.5} ${-HEAD_H * 0.14} Z`}
                fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale} />
              <clipPath id={`hat-${uid}`}>
                <path d={`M ${-HEAD_W * 0.5} ${-HEAD_H * 0.14}
                    Q ${-HEAD_W * 0.08} ${-HEAD_H * 0.96} ${HEAD_W * 0.32} ${-HEAD_H * 0.7}
                    Q ${HEAD_W * 0.56} ${-HEAD_H * 0.52} ${HEAD_W * 0.46} ${-HEAD_H * 0.22} Z`} />
              </clipPath>
              <rect x={-HEAD_W * 0.5} y={-HEAD_H} w={HEAD_W * 1.0} h={HEAD_H * 0.88}
                fill="url(#crosshatch)" opacity={0.3} clipPath={`url(#hat-${uid})`} />
            </g>
          )}
          {type === "merchant" && (
            <g>
              <ellipse cx={HEAD_W * 0.0} cy={-HEAD_H * 0.43} rx={HEAD_W * 0.74} ry={TOTAL_H * 0.023}
                fill={INK} stroke={INK} strokeWidth={scale} />
              <rect x={-HEAD_W * 0.38} y={-HEAD_H * 0.94} width={HEAD_W * 0.76} height={HEAD_H * 0.53}
                rx={TOTAL_H * 0.014} fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale} />
              <rect x={-HEAD_W * 0.38} y={-HEAD_H * 0.94} width={HEAD_W * 0.3} height={HEAD_H * 0.53}
                fill="url(#hatch-v)" opacity={0.38} />
            </g>
          )}
          {type === "woman" && (
            <g>
              <path d={`M ${-HEAD_W * 0.55} ${-HEAD_H * 0.18}
                  Q ${-HEAD_W * 0.18} ${-HEAD_H * 0.96} ${HEAD_W * 0.36} ${-HEAD_H * 0.74}
                  L ${HEAD_W * 0.52} ${-HEAD_H * 0.28}
                  Q ${HEAD_W * 0.32} ${HEAD_H * 0.55} ${-HEAD_W * 0.08} ${HEAD_H * 0.65}
                  Q ${-HEAD_W * 0.42} ${HEAD_H * 0.52} ${-HEAD_W * 0.55} ${-HEAD_H * 0.18} Z`}
                fill={PARCHMENT} stroke={INK} strokeWidth={1.5 * scale} opacity={0.92} />
              <rect x={-HEAD_W * 0.55} y={-HEAD_H * 0.96} width={HEAD_W * 1.08} height={HEAD_H * 1.62}
                fill="url(#hatch-45)" opacity={0.18} />
            </g>
          )}
          {type === "priest" && (
            <g>
              <path d={`M ${-HEAD_W * 0.56} ${HEAD_H * 0.52}
                  L ${-HEAD_W * 0.62} ${-HEAD_H * 0.38}
                  Q ${-HEAD_W * 0.08} ${-HEAD_H * 1.1} ${HEAD_W * 0.46} ${-HEAD_H * 0.68}
                  L ${HEAD_W * 0.52} ${-HEAD_H * 0.28}
                  Q ${HEAD_W * 0.22} ${HEAD_H * 0.42} ${-HEAD_W * 0.08} ${HEAD_H * 0.56} Z`}
                fill={INK_MID} stroke={INK} strokeWidth={1.5 * scale} />
              <rect x={-HEAD_W * 0.62} y={-HEAD_H * 1.1} width={HEAD_W * 1.16} height={HEAD_H * 1.66}
                fill="url(#hatch-dense)" opacity={0.28} />
            </g>
          )}
        </g>

        {/* Mains jointes pour "pray" */}
        {anim === "pray" && (
          <g transform={`translate(${shoulderX}, ${shoulderY - ARM_H * 0.3})`}>
            <ellipse cx={0} cy={0} rx={ARM_W * 1.4} ry={ARM_W * 0.9}
              fill="#c8a070" stroke={INK} strokeWidth={scale} />
            <line x1={-ARM_W} y1={0} x2={ARM_W} y2={0}
              stroke={INK} strokeWidth={scale * 0.8} opacity="0.4" />
          </g>
        )}

      </g>
    </g>
  );
};

// ─── Puits ────────────────────────────────────────────────────────────────────
const EngrWell: React.FC<{ x: number; groundY: number }> = ({ x, groundY }) => {
  const r = 36; const h = 50;
  return (
    <g filter="url(#drop)">
      <ellipse cx={x} cy={groundY - h} rx={r} ry={r * 0.3} fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />
      <rect x={x - r} y={groundY - h} width={r * 2} height={h}
        fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />
      <rect x={x - r} y={groundY - h} width={r * 0.55} height={h}
        fill="url(#hatch-45)" opacity={0.45} />
      {Array.from({ length: 3 }, (_, i) => (
        <line key={i} x1={x - r + 4} y1={groundY - h + 10 + i * 14}
          x2={x + r - 4} y2={groundY - h + 10 + i * 14}
          stroke={INK_LIGHT} strokeWidth="1" opacity="0.35" />
      ))}
      <ellipse cx={x} cy={groundY} rx={r} ry={r * 0.3} fill={PARCHMENT_DARK} stroke={INK} strokeWidth="2" />
      {/* Toit puits */}
      <line x1={x - r - 10} y1={groundY - h - 18} x2={x - r - 10} y2={groundY - h + 4}
        stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <line x1={x + r + 10} y1={groundY - h - 18} x2={x + r + 10} y2={groundY - h + 4}
        stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <polygon points={`${x - r - 22},${groundY - h - 18} ${x},${groundY - h - 55} ${x + r + 22},${groundY - h - 18}`}
        fill={INK_MID} stroke={INK} strokeWidth="2" />
      <clipPath id="well-roof">
        <polygon points={`${x - r - 22},${groundY - h - 18} ${x},${groundY - h - 55} ${x + r + 22},${groundY - h - 18}`} />
      </clipPath>
      <rect x={x - r - 22} y={groundY - h - 55} width={r + 22} height={37}
        fill="url(#hatch-dense)" opacity={0.35} clipPath="url(#well-roof)" />
      {/* Corde */}
      <line x1={x + 10} y1={groundY - h - 18} x2={x + 8} y2={groundY - h - 5}
        stroke={INK} strokeWidth="2" opacity="0.6" />
      <rect x={x + 2} y={groundY - h - 8} width={14} height={10} rx={2}
        fill={INK_MID} stroke={INK} strokeWidth="1.5" />
    </g>
  );
};

// ─── Scène principale ─────────────────────────────────────────────────────────
export const EngravingVillage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const groundY = 760;

  const globalOpacity = interpolate(frame, [0, 22], [0, 1], { extrapolateRight: "clamp" });

  // Nuages qui dérivent
  const cloudDrift = frame * 0.22;

  // ─── Positions personnages ────────────────────────────────────────────────
  // Paysan : marche de gauche à droite, en boucle
  const peasantX = ((frame * 1.5 + 200) % 2400) - 150;
  // Femme : marche de droite à gauche
  const womanX = 1920 - ((frame * 1.1 + 500) % 2400) + 150;
  // Marchand au centre — animation "talk" (debout + gesticule)
  const merchantX = 960;
  // Prêtre : marche lentement de gauche
  const priestX = ((frame * 0.7 + 1200) % 2400) - 150;

  // Animation cough : se déclenche toutes les 120 frames pour le paysan
  const coughCycle = frame % 150;
  const isCoughing = coughCycle > 100 && coughCycle < 150;
  const peasantAnim: "walk" | "cough" = isCoughing ? "cough" : "walk";
  const peasantAnimFrame = isCoughing ? coughCycle - 100 : 0;

  return (
    <div style={{ width: 1920, height: 1080, background: PARCHMENT, overflow: "hidden", opacity: globalOpacity }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <Defs />

        {/* Fond parchemin */}
        <rect width="1920" height="1080" fill={PARCHMENT} />
        <rect width="1920" height="1080" fill="none" filter="url(#parchment-age)" />
        {/* Lignes manuscrit */}
        {Array.from({ length: 16 }, (_, i) => (
          <line key={i} x1="0" y1={58 + i * 62} x2="1920" y2={58 + i * 62}
            stroke={INK} strokeWidth="0.6" opacity="0.1" />
        ))}

        {/* Soleil */}
        <EngrSun cx={170} cy={148} />

        {/* Nuages */}
        <g transform={`translate(${-cloudDrift * 0.6}, 0)`}>
          {[
            { cx: 400, cy: 108, rx: 88, ry: 30 },
            { cx: 780, cy: 78,  rx: 68, ry: 23 },
            { cx: 1120, cy: 118, rx: 96, ry: 33 },
            { cx: 1460, cy: 90, rx: 76, ry: 26 },
            { cx: 1760, cy: 112, rx: 62, ry: 21 },
          ].map((c, i) => (
            <g key={i}>
              <ellipse cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                fill={PARCHMENT_DARK} stroke={INK} strokeWidth="1.5" opacity="0.7" />
              <rect x={c.cx - c.rx} y={c.cy - c.ry} width={c.rx} height={c.ry * 2}
                fill="url(#hatch-45)" opacity={0.28} />
            </g>
          ))}
        </g>

        {/* ─── Plan lointain ─── */}
        <g opacity={0.42}>
          <EngrBuilding x={50}   groundY={groundY} w={90}  h={145} roofH={62} roofStyle="triangle" windows={1} detailed={false} />
          <EngrBuilding x={170}  groundY={groundY} w={75}  h={130} roofH={55} roofStyle="triangle" windows={1} detailed={false} />
          <EngrBuilding x={1680} groundY={groundY} w={85}  h={138} roofH={58} roofStyle="triangle" windows={1} detailed={false} />
          <EngrBuilding x={1800} groundY={groundY} w={100} h={155} roofH={66} roofStyle="triangle" windows={1} detailed={false} />
          <EngrTree x={360} groundY={groundY} scale={0.55} />
          <EngrTree x={1560} groundY={groundY} scale={0.5} />
        </g>

        {/* ─── Plan médian — bâtiments principaux ─── */}
        {/* Église gauche */}
        <EngrBuilding x={75}  groundY={groundY} w={195} h={255} roofH={138} roofStyle="spire" windows={2} />
        {/* Taverne */}
        <EngrBuilding x={350} groundY={groundY} w={235} h={275} roofH={98}  roofStyle="triangle" windows={3} label="Auberge du Rat" />
        {/* Maisons gauche */}
        <EngrBuilding x={628} groundY={groundY} w={145} h={205} roofH={88}  roofStyle="triangle" windows={2} />
        <EngrBuilding x={808} groundY={groundY} w={128} h={185} roofH={78}  roofStyle="triangle" windows={1} />
        {/* Rempart centre */}
        <EngrBuilding x={995} groundY={groundY} w={272} h={235} roofH={48}  roofStyle="battlements" windows={2} />
        {/* Maisons droite */}
        <EngrBuilding x={1325} groundY={groundY} w={155} h={215} roofH={92} roofStyle="triangle" windows={2} />
        <EngrBuilding x={1525} groundY={groundY} w={136} h={190} roofH={83} roofStyle="triangle" windows={1} />
        {/* Chapelle droite */}
        <EngrBuilding x={1720} groundY={groundY} w={170} h={228} roofH={108} roofStyle="spire" windows={2} />

        {/* Arbres */}
        <EngrTree x={308}  groundY={groundY} scale={0.82} />
        <EngrTree x={978}  groundY={groundY} scale={0.76} />
        <EngrTree x={1688} groundY={groundY} scale={0.88} />

        {/* Puits */}
        <EngrWell x={1120} groundY={groundY} />

        {/* ─── Sol ─── */}
        <EngrGround groundY={groundY} />

        {/* ─── Personnages — tous ancrés à groundY ─── */}

        {/* Prêtre : marche vers la droite, animation "pray" toutes les 200f */}
        <EngraveCharacter
          x={priestX} groundY={groundY}
          frame={frame} phaseOffset={70} scale={0.94}
          type="priest" facingRight={true}
          anim={frame % 200 > 160 ? "pray" : "walk"}
          animFrame={frame % 200 > 160 ? frame % 200 - 160 : 0}
        />

        {/* Femme : marche vers la gauche */}
        <EngraveCharacter
          x={womanX} groundY={groundY}
          frame={frame} phaseOffset={25} scale={0.90}
          type="woman" facingRight={false}
          anim="walk"
        />

        {/* Marchand : stationnaire, gesticule */}
        <EngraveCharacter
          x={merchantX} groundY={groundY}
          frame={frame} phaseOffset={0} scale={1.06}
          type="merchant" facingRight={true}
          anim="talk"
        />

        {/* Paysan : marche, tousse périodiquement */}
        <EngraveCharacter
          x={peasantX} groundY={groundY}
          frame={frame} phaseOffset={10} scale={1.0}
          type="peasant" facingRight={true}
          anim={peasantAnim}
          animFrame={peasantAnimFrame}
        />

        {/* ─── Cadre gravure ─── */}
        <rect x="16" y="16" width="1888" height="1048" rx="5"
          fill="none" stroke={INK} strokeWidth="4.5" />
        <rect x="25" y="25" width="1870" height="1030" rx="3"
          fill="none" stroke={INK} strokeWidth="1.5" opacity="0.45" />

        {/* ─── Titre ─── */}
        <g opacity={interpolate(frame, [18, 48], [0, 1], { extrapolateRight: "clamp" })}>
          <line x1="420" y1="1036" x2="1500" y2="1036" stroke={INK} strokeWidth="0.8" opacity="0.35" />
          <text x="960" y="1058" textAnchor="middle"
            fontSize={19} fontFamily="serif" fill={INK} letterSpacing="4" opacity="0.75">
            CIVITAS MEDIEVALIS · ANNO DOMINI MCCCXLVII
          </text>
          <line x1="420" y1="1066" x2="1500" y2="1066" stroke={INK} strokeWidth="0.8" opacity="0.35" />
        </g>

        {/* ─── Note de marge (annotation de manuscrit) ─── */}
        <g opacity={interpolate(frame, [40, 70], [0, 1], { extrapolateRight: "clamp" })}>
          <text x="38" y="420" fontSize={11} fontFamily="serif" fill={INK_LIGHT} fontStyle="italic"
            transform="rotate(-90, 38, 420)" opacity="0.45" textAnchor="middle">
            Finis terrae · finis temporis
          </text>
        </g>
      </svg>
    </div>
  );
};
