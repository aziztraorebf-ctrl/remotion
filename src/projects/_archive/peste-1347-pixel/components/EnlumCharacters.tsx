import React from "react";
import { interpolate } from "remotion";
// Composants personnages partages — source CharacterSheet.tsx

// Palette officielle Peste 1347
export const GOLD        = "#c9a84c";
export const GOLD_BRIGHT = "#f0d060";
export const GOLD_DARK   = "#8a6820";
export const LAPIS       = "#1a3a7a";
export const LAPIS_MID   = "#2a5aaa";
export const LAPIS_LIGHT = "#5080d0";
export const VERMILLON   = "#c8301a";
export const VERMILLON_MID = "#e04828";
export const VERT        = "#2a6a30";
export const VERT_MID    = "#4a9a50";
export const VERT_LIGHT  = "#7ac080";
export const OCRE        = "#c8a040";
export const OCRE_LIGHT  = "#e8c870";
export const OCRE_PALE   = "#f0dca0";
export const CHAIR       = "#e8c898";
export const CHAIR_DARK  = "#c8a070";
export const INK         = "#1a1008";
export const INK_MID     = "#3a2510";
export const PARCHMENT   = "#f4e8c8";
export const PARCHMENT_DARK = "#dfd0a0";
export const WHITE       = "#f8f4e8";
export const STONE       = "#b8a888";

// Proportions medievales canoniques
export const TOTAL_H = 220;
export const HEAD_R  = 38;
export const TORSO_H = 85;
export const LEG_H   = 80;
export const ARM_L   = 75;

export type EtatPersonnage = "sain" | "malade" | "mort";

// Modificateurs visuels selon l'etat
function etatTint(color: string, etat: EtatPersonnage): string {
  if (etat === "mort") return "#8a8a8a";
  if (etat === "malade") {
    // Teinte verdatre : melange vers #7a9a60
    const hex = (s: string) => [parseInt(s.slice(1,3),16), parseInt(s.slice(3,5),16), parseInt(s.slice(5,7),16)];
    const c = hex(color);
    const t = 0.35;
    const r = Math.round(c[0] * (1-t) + 100 * t);
    const g = Math.round(c[1] * (1-t) + 140 * t);
    const b = Math.round(c[2] * (1-t) + 80  * t);
    return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
  }
  return color;
}

export interface CharProps {
  x: number;
  y: number;
  facing?: "right" | "left";
  anim?: "idle" | "walk" | "pray" | "talk";
  frame: number;
  scale?: number;
  etat?: EtatPersonnage;
}

// Pierre - le laboureur
// Traits distinctifs: bonnet brun, tunique grossiere brun fonce, FOURCHE en main droite
// Accessoire evolutif: sain=fourche, malade=beche, mort=rien
export const Pierre: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  // Mort = immobile
  const isWalk = anim === "walk" && etat !== "mort";
  // Malade = posture voûtee (torso incline)
  const maladeSlump = etat === "malade" ? 12 : etat === "mort" ? 25 : 0;
  const feetY  = y;
  const hipY   = feetY - LEG_H + (etat === "mort" ? 30 : 0);
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const legSwing = isWalk ? Math.sin(walk) * 20 : 0;
  const armSwing = isWalk ? Math.sin(walk) * 15 : etat === "malade" ? 20 : 0;
  // Opacite reduite si mort
  const baseOpacity = etat === "mort" ? 0.55 : 1;

  const TUNIC_BASE  = "#7a6030";
  const MANTLE_BASE = "#5a4020";
  const HAT_BASE    = "#4a3218";
  const TUNIC  = etatTint(TUNIC_BASE,  etat);
  const MANTLE = etatTint(MANTLE_BASE, etat);
  const HAT    = etatTint(HAT_BASE,    etat);
  const SKIN   = etatTint(CHAIR_DARK,  etat);

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      {/* Corps incline si malade (transform sur le groupe torso+tete) */}
      <g transform={etat === "mort" ? `rotate(85, 0, ${feetY})` : `rotate(${maladeSlump * 0.4}, 0, ${hipY})`}>
        {/* Jambe gauche */}
        <rect x={-10} y={hipY + legSwing * 0.5} width={18} height={LEG_H - legSwing * 0.5} rx={7} fill={TUNIC} stroke={INK} strokeWidth={1.5} />
        {/* Jambe droite */}
        <rect x={6} y={hipY - legSwing * 0.5} width={18} height={LEG_H + legSwing * 0.5} rx={7} fill={MANTLE} stroke={INK} strokeWidth={1.5} />
        {/* Chaussures rustiques */}
        <ellipse cx={-1} cy={feetY} rx={13} ry={6} fill={etat === "mort" ? "#3a3030" : INK} />
        <ellipse cx={15} cy={feetY} rx={13} ry={6} fill={etat === "mort" ? "#3a3030" : INK} />
        {/* Bras gauche */}
        <rect x={-42} y={shoulderY} width={15} height={ARM_L} rx={6} fill={TUNIC} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${-armSwing - 5 + maladeSlump}, -34, ${shoulderY})`} />
        {/* Corps */}
        <rect x={-28} y={torsoTopY} width={60} height={TORSO_H} rx={11} fill={TUNIC} stroke={INK} strokeWidth={2} />
        {/* Plis tunique */}
        <line x1={-8} y1={torsoTopY + 14} x2={-12} y2={hipY - 4} stroke={INK} strokeWidth={1} opacity={0.3} />
        <line x1={6}  y1={torsoTopY + 14} x2={4}   y2={hipY - 4} stroke={INK} strokeWidth={1} opacity={0.25} />
        {/* Ceinture de corde */}
        <rect x={-28} y={torsoTopY + TORSO_H * 0.6} width={60} height={10} rx={4} fill={INK_MID} stroke={INK} strokeWidth={1} />
        {/* Bras droit */}
        <rect x={22} y={shoulderY} width={15} height={ARM_L} rx={6} fill={MANTLE} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${armSwing + 8 - maladeSlump * 0.5}, 30, ${shoulderY})`} />
        {/* ACCESSOIRE EVOLUTIF: fourche(sain) / beche(malade) / rien(mort) */}
        {etat === "sain" && (
          <g>
            <line x1={42} y1={shoulderY - 40} x2={42} y2={feetY - 20} stroke={HAT} strokeWidth={4} strokeLinecap="round" />
            <line x1={36} y1={shoulderY - 40} x2={36} y2={shoulderY - 20} stroke={HAT} strokeWidth={3} strokeLinecap="round" />
            <line x1={42} y1={shoulderY - 40} x2={42} y2={shoulderY - 20} stroke={HAT} strokeWidth={3} strokeLinecap="round" />
            <line x1={48} y1={shoulderY - 40} x2={48} y2={shoulderY - 20} stroke={HAT} strokeWidth={3} strokeLinecap="round" />
            <line x1={34} y1={shoulderY - 25} x2={50} y2={shoulderY - 25} stroke={HAT} strokeWidth={3} strokeLinecap="round" />
          </g>
        )}
        {etat === "malade" && (
          <g>
            {/* Beche - manche + lame */}
            <line x1={40} y1={shoulderY - 20} x2={40} y2={feetY - 15} stroke={HAT} strokeWidth={4} strokeLinecap="round" />
            <ellipse cx={40} cy={feetY - 15} rx={10} ry={6} fill={STONE} stroke={INK} strokeWidth={1.5} />
            {/* Sueur - ligne simple sur visage */}
            <line x1={20} y1={headCY} x2={22} y2={headCY + 18} stroke="#a8c890" strokeWidth={1.5} opacity={0.7} strokeLinecap="round" />
          </g>
        )}
        {/* Cou */}
        <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={SKIN} stroke={INK} strokeWidth={1.5} />
        {/* Tete */}
        <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={SKIN} stroke={INK} strokeWidth={2} />
        {/* Oeil - ferme si mort */}
        {etat !== "mort" ? (
          <>
            <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth={1.5} />
            <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
          </>
        ) : (
          <line x1={10} y1={headCY - 4} x2={24} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Sourcil - fronce si malade */}
        <path d={etat === "malade"
          ? `M 8,${headCY - 14} Q 18,${headCY - 12} 26,${headCY - 8}`
          : `M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
          fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* Nez */}
        <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* Bouche - affaissee si malade/mort */}
        <path d={etat === "sain"
          ? `M 12,${headCY + 24} Q 20,${headCY + 28} 28,${headCY + 24}`
          : `M 12,${headCY + 26} Q 20,${headCY + 22} 28,${headCY + 26}`}
          fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* Bonnet paysan brun */}
        <ellipse cx={2} cy={headCY - HEAD_R * 0.75} rx={HEAD_R + 2} ry={HEAD_R * 0.45} fill={HAT} stroke={INK} strokeWidth={1.5} />
      </g>
    </g>
  );
};

// Martin - le pretre
// Traits distinctifs: habit blanc, manteau lapis, CROIX pectorale or, tonsure
// Accessoire evolutif: sain=croix droite, malade=croix inclinee, mort=cierge couche
export const Martin: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isPray = anim === "pray" && etat !== "mort";
  const isWalk = anim === "walk" && etat !== "mort";
  const baseOpacity = etat === "mort" ? 0.55 : 1;
  const feetY  = y;
  const hipY   = feetY - LEG_H;
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const armSwing = isPray ? -35 : isWalk ? Math.sin(walk) * 15 : 0;
  const SKIN = etatTint(CHAIR, etat);
  const crossTilt = etat === "malade" ? 20 : etat === "mort" ? 45 : 0;

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      {/* Robe longue (soutane) - descend jusqu'aux pieds */}
      <path d={`M -30,${torsoTopY} L -34,${feetY} L 36,${feetY} L 32,${torsoTopY} Z`}
        fill={etatTint(WHITE, etat)} stroke={INK} strokeWidth={2} />
      {/* Plis soutane */}
      <line x1={-8}  y1={torsoTopY + 20} x2={-10} y2={feetY - 5} stroke={INK} strokeWidth={1} opacity={0.2} />
      <line x1={6}   y1={torsoTopY + 20} x2={6}   y2={feetY - 5} stroke={INK} strokeWidth={1} opacity={0.18} />
      <line x1={18}  y1={torsoTopY + 20} x2={20}  y2={feetY - 5} stroke={INK} strokeWidth={1} opacity={0.15} />
      {/* Chaussures noires (a peine visibles sous soutane) */}
      <ellipse cx={-2} cy={feetY} rx={12} ry={5} fill={INK} opacity={0.6} />
      <ellipse cx={14} cy={feetY} rx={12} ry={5} fill={INK} opacity={0.6} />
      {/* Manteau lapis par-dessus */}
      <path d={`M -28,${torsoTopY + 8} Q -52,${hipY - 15} -42,${hipY + 25} L -30,${hipY}`}
        fill={etatTint(LAPIS, etat)} stroke={INK} strokeWidth={1.5} />
      {/* Bras gauche */}
      <rect x={-42} y={shoulderY} width={15} height={ARM_L} rx={6} fill={etatTint(LAPIS, etat)} stroke={INK} strokeWidth={1.5}
        transform={`rotate(${-armSwing}, -34, ${shoulderY})`} />
      {/* Corps */}
      <rect x={-28} y={torsoTopY} width={60} height={TORSO_H} rx={11} fill={etatTint(WHITE, etat)} stroke={INK} strokeWidth={2} />
      {/* Bras droit */}
      <rect x={22} y={shoulderY} width={15} height={ARM_L} rx={6} fill={etatTint(LAPIS, etat)} stroke={INK} strokeWidth={1.5}
        transform={`rotate(${armSwing}, 30, ${shoulderY})`} />
      {/* Main en priere */}
      {isPray && (
        <rect x={18} y={shoulderY + ARM_L - 15} width={14} height={22} rx={5}
          fill={SKIN} stroke={INK} strokeWidth={1.2}
          transform={`rotate(-40, 25, ${shoulderY + ARM_L})`} />
      )}
      {/* CROIX PECTORALE - inclinee si malade (crise de foi), grisee si mort */}
      <g transform={`rotate(${crossTilt}, 2, ${torsoTopY + 33})`}>
        <line x1={2} y1={torsoTopY + 18} x2={2} y2={torsoTopY + 48} stroke={etat === "mort" ? STONE : GOLD} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={-10} y1={torsoTopY + 28} x2={14} y2={torsoTopY + 28} stroke={etat === "mort" ? STONE : GOLD} strokeWidth={3.5} strokeLinecap="round" />
        <circle cx={2} cy={torsoTopY + 28} r={4} fill={etat === "mort" ? STONE : GOLD_BRIGHT} />
      </g>
      {/* Cou */}
      <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={SKIN} stroke={INK} strokeWidth={1.5} />
      {/* Tete */}
      <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={SKIN} stroke={INK} strokeWidth={2} />
      {/* Oeil - ferme si mort */}
      {etat !== "mort" ? (
        <>
          <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth={1.5} />
          <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
        </>
      ) : (
        <line x1={10} y1={headCY - 4} x2={24} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      )}
      {/* Sourcil - fronce si malade */}
      <path d={etat === "malade"
        ? `M 8,${headCY - 14} Q 18,${headCY - 12} 26,${headCY - 8}`
        : `M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
        fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* Bouche - affaissee si malade/mort */}
      <path d={etat === "sain"
        ? `M 12,${headCY + 24} Q 20,${headCY + 28} 28,${headCY + 24}`
        : `M 12,${headCY + 26} Q 20,${headCY + 22} 28,${headCY + 26}`}
        fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
      {/* TONSURE */}
      <ellipse cx={2} cy={headCY - HEAD_R * 0.6} rx={HEAD_R - 4} ry={HEAD_R * 0.4}
        fill={etatTint(WHITE, etat)} stroke={INK} strokeWidth={1.5} />
      <circle cx={2} cy={headCY - HEAD_R * 0.55} r={10} fill={SKIN} stroke={INK} strokeWidth={1} />
    </g>
  );
};

// Isaac - le preteur juif
// Traits distinctifs: JUDENHUT (chapeau conique jaune), habit vert, BOURSE a la ceinture
// Accessoire evolutif: sain=bourse pleine (gonflée), malade=bourse mince (aplatie), mort=bourse vide (coupée)
export const Isaac: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isWalk = anim === "walk" && etat !== "mort";
  const isTalk = anim === "talk" && etat !== "mort";
  const baseOpacity = etat === "mort" ? 0.55 : 1;
  const feetY  = y;
  const hipY   = feetY - LEG_H + (etat === "mort" ? 30 : 0);
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const legSwing = isWalk ? Math.sin(walk) * 20 : 0;
  const armSwing = isTalk ? Math.sin(walk * 0.5) * 14 : isWalk ? Math.sin(walk) * 15 : 0;
  const maladeSlump = etat === "malade" ? 10 : 0;

  const SKIN = etatTint(CHAIR, etat);
  const HABIT = etatTint(VERT, etat);
  const MANTEAU = etatTint(OCRE, etat);

  // Bourse: pleine(sain) = gonflée rx14, malade = aplatie rx10, mort = disparue
  const bourseRx = etat === "sain" ? 14 : etat === "malade" ? 10 : 0;
  const bourseRy = etat === "sain" ? 16 : etat === "malade" ? 10 : 0;
  const bourseY = torsoTopY + TORSO_H * 0.62 + 8;

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      <g transform={etat === "mort" ? `rotate(85, 0, ${feetY})` : `rotate(${maladeSlump * 0.4}, 0, ${hipY})`}>
        {/* Jambes */}
        <rect x={-10} y={hipY + legSwing * 0.5} width={18} height={LEG_H - legSwing * 0.5} rx={7} fill={HABIT} stroke={INK} strokeWidth={1.5} />
        <rect x={6} y={hipY - legSwing * 0.5} width={18} height={LEG_H + legSwing * 0.5} rx={7} fill={HABIT} stroke={INK} strokeWidth={1.5} />
        <ellipse cx={-1} cy={feetY} rx={13} ry={6} fill={etat === "mort" ? "#3a3030" : INK} />
        <ellipse cx={15} cy={feetY} rx={13} ry={6} fill={etat === "mort" ? "#3a3030" : INK} />
        {/* Bras gauche */}
        <rect x={-42} y={shoulderY} width={15} height={ARM_L} rx={6} fill={MANTEAU} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${-armSwing - 3 + maladeSlump}, -34, ${shoulderY})`} />
        {/* Corps */}
        <rect x={-28} y={torsoTopY} width={60} height={TORSO_H} rx={11} fill={HABIT} stroke={INK} strokeWidth={2} />
        {/* Plis */}
        <line x1={-8} y1={torsoTopY + 14} x2={-12} y2={hipY - 4} stroke={INK} strokeWidth={1} opacity={0.25} />
        <line x1={6}  y1={torsoTopY + 14} x2={4}   y2={hipY - 4} stroke={INK} strokeWidth={1} opacity={0.2} />
        {/* Manteau ocre */}
        <path d={`M -28,${torsoTopY + 10} Q -50,${hipY - 18} -40,${hipY + 22} L -28,${hipY}`}
          fill={MANTEAU} stroke={INK} strokeWidth={1.5} />
        {/* Ceinture */}
        <rect x={-28} y={torsoTopY + TORSO_H * 0.55} width={60} height={12} rx={5} fill={etatTint(GOLD_DARK, etat)} stroke={INK} strokeWidth={1.2} />
        {/* BOURSE EVOLUTIVE: pleine(sain), aplatie(malade), disparue(mort) */}
        {etat !== "mort" && (
          <g>
            <ellipse cx={28} cy={bourseY} rx={bourseRx} ry={bourseRy} fill={etatTint(OCRE_LIGHT, etat)} stroke={INK} strokeWidth={1.5} />
            <line x1={28} y1={torsoTopY + TORSO_H * 0.62 - 8} x2={28} y2={torsoTopY + TORSO_H * 0.62 - 18}
              stroke={etatTint(GOLD_DARK, etat)} strokeWidth={2} strokeLinecap="round" />
            {etat === "sain" && (
              <path d={`M 20,${torsoTopY + TORSO_H * 0.62 - 4} Q 28,${torsoTopY + TORSO_H * 0.62 - 10} 36,${torsoTopY + TORSO_H * 0.62 - 4}`}
                fill="none" stroke={GOLD_DARK} strokeWidth={1.5} />
            )}
          </g>
        )}
        {etat === "mort" && (
          // Bourse coupee - lien sectionne (vide, spoliee)
          <line x1={28} y1={torsoTopY + TORSO_H * 0.6} x2={32} y2={torsoTopY + TORSO_H * 0.6 + 15}
            stroke={STONE} strokeWidth={2} strokeLinecap="round" strokeDasharray="3,3" />
        )}
        {/* Bras droit */}
        <rect x={22} y={shoulderY} width={15} height={ARM_L} rx={6} fill={MANTEAU} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${armSwing}, 30, ${shoulderY})`} />
        {/* Cou */}
        <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={SKIN} stroke={INK} strokeWidth={1.5} />
        {/* Tete */}
        <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={SKIN} stroke={INK} strokeWidth={2} />
        {/* Oeil - ferme si mort */}
        {etat !== "mort" ? (
          <>
            <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth={1.5} />
            <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
          </>
        ) : (
          <line x1={10} y1={headCY - 4} x2={24} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Sourcil - fronce si malade */}
        <path d={etat === "malade"
          ? `M 8,${headCY - 14} Q 18,${headCY - 12} 26,${headCY - 8}`
          : `M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
          fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* Bouche - expression parole ou affaissee */}
        <path d={isTalk && Math.sin(walk * 0.4) > 0
          ? `M 12,${headCY + 22} Q 20,${headCY + 32} 28,${headCY + 22}`
          : etat !== "sain"
            ? `M 12,${headCY + 26} Q 20,${headCY + 22} 28,${headCY + 26}`
            : `M 12,${headCY + 24} Q 20,${headCY + 28} 28,${headCY + 24}`}
          fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* JUDENHUT - chapeau conique distinctif (jaune = sain, grise si mort) */}
        <ellipse cx={2} cy={headCY - HEAD_R * 0.5} rx={HEAD_R + 10} ry={7}
          fill={etatTint(OCRE_LIGHT, etat)} stroke={INK} strokeWidth={1.5} />
        <path d={`M ${-HEAD_R + 4},${headCY - HEAD_R * 0.5} Q 2,${headCY - HEAD_R * 3.2} ${HEAD_R - 2},${headCY - HEAD_R * 0.5}`}
          fill={etatTint(OCRE_LIGHT, etat)} stroke={INK} strokeWidth={1.5} />
      </g>
    </g>
  );
};

// Guillaume - le seigneur
// Traits distinctifs: chapeau or, MANTEAU FOURRE (bande blanche), posture droite, epee
// Hierarchie: scale 1.1 (plus grand que les autres)
// Accessoire evolutif: sain=epee au fourreau, malade=epee rangee (trop faible), mort=epee absente (emportee)
export const Guillaume: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1.1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isWalk = anim === "walk" && etat !== "mort";
  const isTalk = anim === "talk" && etat !== "mort";
  const baseOpacity = etat === "mort" ? 0.55 : 1;
  const feetY  = y;
  const hipY   = feetY - LEG_H + (etat === "mort" ? 30 : 0);
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const legSwing = isWalk ? Math.sin(walk) * 20 : 0;
  const armSwing = isTalk ? Math.sin(walk * 0.5) * 14 : isWalk ? Math.sin(walk) * 15 : 5;
  const maladeSlump = etat === "malade" ? 8 : 0;

  const SKIN = etatTint(CHAIR, etat);
  const TUNIQUE = etatTint(VERMILLON, etat);
  const JAMBE1 = etatTint(LAPIS, etat);
  const JAMBE2 = etatTint(LAPIS_MID, etat);
  const CEINTURE = etatTint(GOLD, etat);

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      <g transform={etat === "mort" ? `rotate(85, 0, ${feetY})` : `rotate(${maladeSlump * 0.4}, 0, ${hipY})`}>
        {/* Jambes lapis */}
        <rect x={-10} y={hipY + legSwing * 0.5} width={20} height={LEG_H - legSwing * 0.5} rx={7} fill={JAMBE1} stroke={INK} strokeWidth={1.5} />
        <rect x={8} y={hipY - legSwing * 0.5} width={20} height={LEG_H + legSwing * 0.5} rx={7} fill={JAMBE2} stroke={INK} strokeWidth={1.5} />
        <ellipse cx={0}  cy={feetY} rx={14} ry={7} fill={etat === "mort" ? "#3a3030" : INK} />
        <ellipse cx={18} cy={feetY} rx={14} ry={7} fill={etat === "mort" ? "#3a3030" : INK} />
        {/* Bras gauche */}
        <rect x={-44} y={shoulderY} width={16} height={ARM_L} rx={6} fill={TUNIQUE} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${-armSwing + maladeSlump}, -36, ${shoulderY})`} />
        {/* Corps - tunique vermillon */}
        <rect x={-30} y={torsoTopY} width={64} height={TORSO_H} rx={12} fill={TUNIQUE} stroke={INK} strokeWidth={2} />
        {/* MANTEAU FOURRE - lisere blanc caracteristique de Guillaume */}
        <path d={`M -30,${torsoTopY + 6} Q -58,${hipY - 10} -46,${hipY + 30} L -34,${hipY + 5} L -30,${torsoTopY + 25} Z`}
          fill={TUNIQUE} stroke={INK} strokeWidth={1.5} />
        {/* Bande de fourrure blanche sur le manteau */}
        <path d={`M -29,${torsoTopY + 6} Q -55,${hipY - 12} -44,${hipY + 25}`}
          fill="none" stroke={etatTint(WHITE, etat)} strokeWidth={5} opacity={0.85} />
        <path d={`M -29,${torsoTopY + 6} Q -55,${hipY - 12} -44,${hipY + 25}`}
          fill="none" stroke={INK} strokeWidth={1} strokeDasharray="3,4" opacity={0.4} />
        {/* Ceinture or */}
        <rect x={-30} y={torsoTopY + TORSO_H * 0.52} width={64} height={14} rx={5} fill={CEINTURE} stroke={INK} strokeWidth={1.2} />
        <circle cx={2} cy={torsoTopY + TORSO_H * 0.52 + 7} r={6} fill={etatTint(GOLD_BRIGHT, etat)} stroke={etatTint(GOLD_DARK, etat)} strokeWidth={1} />
        {/* EPEE EVOLUTIVE: presente(sain), inclinee(malade = trop faible), absente(mort = emportee) */}
        {etat === "sain" && (
          <g>
            <rect x={38} y={torsoTopY + TORSO_H * 0.52 + 5} width={5} height={90} rx={2} fill={STONE} stroke={INK} strokeWidth={1} />
            <rect x={28} y={torsoTopY + TORSO_H * 0.52 + 10} width={25} height={6} rx={2} fill={GOLD} stroke={INK} strokeWidth={1} />
            <ellipse cx={40} cy={torsoTopY + TORSO_H * 0.52 + 4} rx={8} ry={6} fill={GOLD_DARK} stroke={INK} strokeWidth={1} />
          </g>
        )}
        {etat === "malade" && (
          // Epee inclinee - Guillaume trop faible pour la porter droite
          <g transform={`rotate(35, 38, ${torsoTopY + TORSO_H * 0.52 + 5})`}>
            <rect x={38} y={torsoTopY + TORSO_H * 0.52 + 5} width={5} height={90} rx={2} fill={STONE} stroke={INK} strokeWidth={1} opacity={0.7} />
            <rect x={28} y={torsoTopY + TORSO_H * 0.52 + 10} width={25} height={6} rx={2} fill={etatTint(GOLD, etat)} stroke={INK} strokeWidth={1} />
            <ellipse cx={40} cy={torsoTopY + TORSO_H * 0.52 + 4} rx={8} ry={6} fill={etatTint(GOLD_DARK, etat)} stroke={INK} strokeWidth={1} />
          </g>
        )}
        {/* Bras droit */}
        <rect x={24} y={shoulderY} width={16} height={ARM_L} rx={6} fill={TUNIQUE} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${armSwing}, 32, ${shoulderY})`} />
        {/* Cou */}
        <rect x={-9} y={neckY} width={22} height={14} rx={6} fill={SKIN} stroke={INK} strokeWidth={1.5} />
        {/* Tete */}
        <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={SKIN} stroke={INK} strokeWidth={2} />
        {/* Oeil - ferme si mort */}
        {etat !== "mort" ? (
          <>
            <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth={1.5} />
            <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
          </>
        ) : (
          <line x1={10} y1={headCY - 4} x2={24} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Sourcil - fronce si malade */}
        <path d={etat === "malade"
          ? `M 8,${headCY - 14} Q 18,${headCY - 12} 26,${headCY - 8}`
          : `M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
          fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* Bouche - affaissee si malade/mort */}
        <path d={etat === "sain"
          ? `M 12,${headCY + 24} Q 20,${headCY + 28} 28,${headCY + 24}`
          : `M 12,${headCY + 26} Q 20,${headCY + 22} 28,${headCY + 26}`}
          fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* CHAPEAU OR - chaperon noble (grise si mort) */}
        <ellipse cx={2} cy={headCY - HEAD_R * 0.7} rx={HEAD_R + 9} ry={HEAD_R * 0.56}
          fill={CEINTURE} stroke={etatTint(GOLD_DARK, etat)} strokeWidth={1.5} />
        <path d={`M ${HEAD_R + 7},${headCY - HEAD_R * 0.7} Q ${HEAD_R + 30},${headCY - HEAD_R} ${HEAD_R + 16},${headCY + 22}`}
          fill={CEINTURE} stroke={etatTint(GOLD_DARK, etat)} strokeWidth={1.5} />
      </g>
    </g>
  );
};

// Agnes - la guerisseuse
// Traits distinctifs: BOUQUET D'HERBES (vert vif), tablier, robe brune, fichu blanc
// Accessoire evolutif: sain=herbes fraîches vertes + fleurs, malade=herbes fanees jaunies, mort=rien (impuissance)
export const Agnes: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isWalk = anim === "walk" && etat !== "mort";
  const baseOpacity = etat === "mort" ? 0.55 : 1;
  const feetY  = y;
  const hipY   = feetY - LEG_H + (etat === "mort" ? 30 : 0);
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const legSwing = isWalk ? Math.sin(walk) * 18 : 0;
  const armSwing = isWalk ? Math.sin(walk) * 12 : 0;
  const maladeSlump = etat === "malade" ? 10 : 0;

  const ROBE_BASE  = "#7a5828";
  const TABLIER_BASE = "#d4b880";
  const ROBE    = etatTint(ROBE_BASE, etat);
  const TABLIER = etatTint(TABLIER_BASE, etat);
  const SKIN    = etatTint(CHAIR, etat);

  // Couleurs bouquet: fraîches(sain), fanees(malade = herbes jaunies), rien(mort)
  const herbeBase = etat === "sain" ? VERT_MID : etat === "malade" ? "#8a7a30" : VERT_MID;
  const herbeAlt  = etat === "sain" ? VERT_LIGHT : etat === "malade" ? "#b0a050" : VERT_LIGHT;
  const herbeContour = etat === "sain" ? VERT : etat === "malade" ? "#6a6020" : VERT;

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      <g transform={etat === "mort" ? `rotate(85, 0, ${feetY})` : `rotate(${maladeSlump * 0.35}, 0, ${hipY})`}>
        {/* Robe longue */}
        <path d={`M -28,${torsoTopY} L -32,${feetY} L 34,${feetY} L 30,${torsoTopY} Z`}
          fill={ROBE} stroke={INK} strokeWidth={2} />
        {/* Plis robe */}
        <line x1={-6}  y1={torsoTopY + 15} x2={-10} y2={feetY - 5} stroke={INK} strokeWidth={1} opacity={0.22} />
        <line x1={8}   y1={torsoTopY + 15} x2={8}   y2={feetY - 5} stroke={INK} strokeWidth={1} opacity={0.18} />
        {/* Tablier (par-dessus la robe) */}
        <path d={`M -16,${torsoTopY + 35} L -20,${feetY - 5} L 22,${feetY - 5} L 18,${torsoTopY + 35} Z`}
          fill={TABLIER} stroke={INK} strokeWidth={1.2} opacity={0.85} />
        <line x1={-14} y1={torsoTopY + 35} x2={16} y2={torsoTopY + 35} stroke={INK} strokeWidth={1} opacity={0.4} />
        {/* Chaussures */}
        <ellipse cx={-4}  cy={feetY} rx={12} ry={5} fill={etat === "mort" ? "#3a3030" : INK} opacity={0.7} />
        <ellipse cx={12} cy={feetY} rx={12} ry={5} fill={etat === "mort" ? "#3a3030" : INK} opacity={0.7} />
        {/* Bras gauche */}
        <rect x={-40} y={shoulderY} width={14} height={ARM_L - 10} rx={6} fill={ROBE} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${-armSwing - 8 + maladeSlump}, -33, ${shoulderY})`} />
        {/* Corps */}
        <rect x={-28} y={torsoTopY} width={60} height={TORSO_H} rx={11} fill={ROBE} stroke={INK} strokeWidth={2} />
        {/* Bras droit - tient le bouquet (ou pend si mort) */}
        <rect x={20} y={shoulderY} width={14} height={ARM_L - 15} rx={6} fill={ROBE} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${etat === "mort" ? 30 : armSwing - 15}, 27, ${shoulderY})`} />
        {/* BOUQUET D'HERBES EVOLUTIF */}
        {etat !== "mort" && (
          <g>
            {/* Tige */}
            <line x1={28} y1={shoulderY + 50} x2={28} y2={shoulderY + 15} stroke={herbeContour} strokeWidth={3} strokeLinecap="round" />
            {/* Feuilles/herbes - fraîches ou fanees */}
            {[[-8, -5], [0, -12], [8, -5], [-6, -18], [6, -18], [0, -24]].map(([dx, dy], i) => (
              <ellipse key={i}
                cx={28 + dx} cy={shoulderY + 15 + dy}
                rx={etat === "malade" ? 6 : 7} ry={etat === "malade" ? 3 : 4}
                fill={i % 2 === 0 ? herbeBase : herbeAlt}
                stroke={herbeContour} strokeWidth={1}
                transform={`rotate(${dx * 5 + (etat === "malade" ? 15 : 0)}, ${28 + dx}, ${shoulderY + 15 + dy})`}
              />
            ))}
            {/* Petites fleurs - disparaissent si malade */}
            {etat === "sain" && (
              <>
                <circle cx={22} cy={shoulderY + 2} r={4} fill={VERMILLON_MID} stroke={INK} strokeWidth={1} />
                <circle cx={34} cy={shoulderY + 4} r={3} fill={OCRE_LIGHT} stroke={INK} strokeWidth={1} />
              </>
            )}
            {/* Lien du bouquet */}
            <rect x={24} y={shoulderY + 46} width={8} height={6} rx={2} fill={etatTint(OCRE, etat)} stroke={INK} strokeWidth={1} />
          </g>
        )}
        {/* Cou */}
        <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={SKIN} stroke={INK} strokeWidth={1.5} />
        {/* Tete */}
        <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={SKIN} stroke={INK} strokeWidth={2} />
        {/* Oeil - ferme si mort */}
        {etat !== "mort" ? (
          <>
            <ellipse cx={16} cy={headCY - 4} rx={7} ry={5} fill={WHITE} stroke={INK} strokeWidth={1.5} />
            <circle  cx={18} cy={headCY - 3} r={3} fill={INK} />
          </>
        ) : (
          <line x1={10} y1={headCY - 4} x2={24} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        )}
        {/* Sourcil - fronce si malade */}
        <path d={etat === "malade"
          ? `M 8,${headCY - 14} Q 18,${headCY - 12} 26,${headCY - 8}`
          : `M 8,${headCY - 12} Q 18,${headCY - 16} 26,${headCY - 10}`}
          fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
        <path d={`M 16,${headCY - 2} Q 30,${headCY + 8} 26,${headCY + 18}`} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* Bouche - affaissee si malade/mort */}
        <path d={etat === "sain"
          ? `M 12,${headCY + 24} Q 20,${headCY + 26} 28,${headCY + 24}`
          : `M 12,${headCY + 26} Q 20,${headCY + 22} 28,${headCY + 26}`}
          fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
        {/* CHEVEUX BRUNS - meches visibles sur les cotes et nuque, debordant du fichu */}
        {/* Meche gauche */}
        <path d={`M ${-HEAD_R + 6},${headCY - 2} Q ${-HEAD_R - 8},${headCY + 15} ${-HEAD_R - 4},${headCY + 35}`}
          fill="none" stroke={etatTint("#5a3a18", etat)} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
        {/* Meche arriere nuque */}
        <path d={`M ${-HEAD_R + 12},${headCY + 18} Q ${-HEAD_R - 2},${headCY + 32} ${-HEAD_R + 4},${headCY + 48}`}
          fill="none" stroke={etatTint("#4a3010", etat)} strokeWidth={6} strokeLinecap="round" opacity={0.8} />
        {/* Petite meche avant gauche */}
        <path d={`M ${-HEAD_R + 14},${headCY + 8} Q ${-HEAD_R + 8},${headCY + 22} ${-HEAD_R + 6},${headCY + 35}`}
          fill="none" stroke={etatTint("#6a4820", etat)} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        {/* FICHU BLANC - coiffe feminine medievale (par-dessus les cheveux) */}
        <path d={`M ${-HEAD_R + 4},${headCY - 5} Q 2,${headCY - HEAD_R * 1.1} ${HEAD_R - 2},${headCY - 5}`}
          fill={etatTint(WHITE, etat)} stroke={INK} strokeWidth={1.5} />
        <path d={`M ${-HEAD_R + 8},${headCY - 5} L ${-HEAD_R},${headCY + 20} Q 2,${headCY + 10} ${HEAD_R},${headCY + 20} L ${HEAD_R - 6},${headCY - 5}`}
          fill={etatTint(WHITE, etat)} stroke={INK} strokeWidth={1.2} opacity={0.7} />
      </g>
    </g>
  );
};

// Renaud - le medecin
// Traits distinctifs: MASQUE EN BEC D'OISEAU (iconique), longue robe noire, chapeau large, baguette
// Note historique: le masque "bec" est du 17e s. (de Lorme 1619) - anachronisme conscient pour lisibilite visuelle
// Accessoire evolutif: sain=baguette tenue droite, malade=baguette baissee, mort=masque tombe
export const Renaud: React.FC<CharProps> = ({ x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain" }) => {
  const flip = facing === "left" ? -1 : 1;
  const walk = frame * 0.1;
  const isWalk = anim === "walk" && etat !== "mort";
  const baseOpacity = etat === "mort" ? 0.55 : 1;
  const feetY  = y;
  const hipY   = feetY - LEG_H + (etat === "mort" ? 30 : 0);
  const torsoTopY = hipY - TORSO_H;
  const neckY  = torsoTopY - 6;
  const headCY = neckY - HEAD_R * 0.85;
  const shoulderY = torsoTopY + 16;
  const legSwing = isWalk ? Math.sin(walk) * 20 : 0;
  const armSwing = isWalk ? Math.sin(walk) * 12 : 0;
  const maladeSlump = etat === "malade" ? 12 : 0;

  // Robe entierement noire - medecin porte le deuil et se protege
  const ROBE_NOIR = etatTint("#1a1a1a", etat);
  const ROBE_NOIR_MID = etatTint("#2a2a2a", etat);
  const SKIN = etatTint(CHAIR, etat);

  // Baguette: droite(sain), baissee(malade = epuise), absente si mort
  const baguetteAngle = etat === "sain" ? -25 : etat === "malade" ? 20 : 0;

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={baseOpacity}>
      <g transform={etat === "mort" ? `rotate(85, 0, ${feetY})` : `rotate(${maladeSlump * 0.4}, 0, ${hipY})`}>
        {/* Robe longue noire */}
        <path d={`M -28,${torsoTopY} L -34,${feetY} L 38,${feetY} L 32,${torsoTopY} Z`}
          fill={ROBE_NOIR} stroke={INK} strokeWidth={2} />
        {/* Plis robe */}
        <line x1={-6}  y1={torsoTopY + 20} x2={-10} y2={feetY - 5} stroke={WHITE} strokeWidth={0.8} opacity={0.12} />
        <line x1={8}   y1={torsoTopY + 20} x2={8}   y2={feetY - 5} stroke={WHITE} strokeWidth={0.8} opacity={0.1} />
        <line x1={18}  y1={torsoTopY + 20} x2={20}  y2={feetY - 5} stroke={WHITE} strokeWidth={0.8} opacity={0.08} />
        {/* Chaussures noires pointues */}
        <ellipse cx={-4} cy={feetY} rx={14} ry={6} fill={INK} />
        <ellipse cx={14} cy={feetY} rx={14} ry={6} fill={INK} />
        {/* Bras gauche */}
        <rect x={-42} y={shoulderY} width={14} height={ARM_L} rx={6} fill={ROBE_NOIR} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${-armSwing - 5 + maladeSlump}, -35, ${shoulderY})`} />
        {/* Corps */}
        <rect x={-28} y={torsoTopY} width={60} height={TORSO_H} rx={11} fill={ROBE_NOIR} stroke={INK} strokeWidth={2} />
        {/* Cape courte par-dessus */}
        <path d={`M -28,${torsoTopY + 5} Q -56,${hipY - 20} -44,${hipY + 20} L -30,${hipY}`}
          fill={ROBE_NOIR_MID} stroke={INK} strokeWidth={1.5} />
        {/* Bras droit - tient la baguette */}
        <rect x={22} y={shoulderY} width={14} height={ARM_L} rx={6} fill={ROBE_NOIR} stroke={INK} strokeWidth={1.5}
          transform={`rotate(${armSwing + baguetteAngle}, 29, ${shoulderY})`} />
        {/* CANNE D'EXAMEN - permet d'examiner les malades sans les toucher (distanciation sociale) */}
        {etat !== "mort" && (
          <g>
            {/* Manche de la canne - tenue en avant, etendue loin du corps */}
            <line
              x1={34} y1={shoulderY + ARM_L - 10}
              x2={etat === "sain" ? 90 : 70}
              y2={etat === "sain" ? shoulderY - 50 : shoulderY + 10}
              stroke={etatTint("#5a3a10", etat)} strokeWidth={5} strokeLinecap="round"
            />
            {/* Courbure du pommeau (canne medicale) */}
            <path
              d={etat === "sain"
                ? `M 88,${shoulderY - 50} Q 105,${shoulderY - 65} 100,${shoulderY - 80}`
                : `M 68,${shoulderY + 10} Q 84,${shoulderY - 2} 80,${shoulderY - 14}`}
              fill="none" stroke={etatTint("#5a3a10", etat)} strokeWidth={5} strokeLinecap="round"
            />
            {/* Embout metal dore au pommeau */}
            <circle
              cx={etat === "sain" ? 100 : 80}
              cy={etat === "sain" ? shoulderY - 80 : shoulderY - 14}
              r={5} fill={etatTint(GOLD, etat)} stroke={INK} strokeWidth={1.2}
            />
          </g>
        )}
        {/* Gants cuir (mains protegees - jamais la peau nue) */}
        <ellipse cx={-35} cy={shoulderY + ARM_L} rx={7} ry={5} fill={etatTint("#3a2808", etat)} stroke={INK} strokeWidth={1} />
        <ellipse cx={29}  cy={shoulderY + ARM_L} rx={7} ry={5} fill={etatTint("#3a2808", etat)} stroke={INK} strokeWidth={1} />
        {/* Cou */}
        <rect x={-8} y={neckY} width={20} height={14} rx={6} fill={ROBE_NOIR} stroke={INK} strokeWidth={1.5} />
        {/* Tete - masque bec d'oiseau, visage cache */}
        {/* Base du masque (ovale sombre) */}
        <ellipse cx={2} cy={headCY} rx={HEAD_R} ry={HEAD_R * 1.08} fill={etatTint("#2a2008", etat)} stroke={INK} strokeWidth={2} />
        {/* BEC D'OISEAU - element distinctif iconique */}
        {etat !== "mort" ? (
          <g>
            {/* Bec pointu vers l'avant */}
            <path d={`M ${HEAD_R - 10},${headCY - 2} Q ${HEAD_R + 30},${headCY + 5} ${HEAD_R + 38},${headCY + 8}`}
              fill={etatTint(OCRE_PALE, etat)} stroke={INK} strokeWidth={1.5} />
            <path d={`M ${HEAD_R - 10},${headCY + 8} Q ${HEAD_R + 28},${headCY + 12} ${HEAD_R + 38},${headCY + 8}`}
              fill={etatTint(OCRE_PALE, etat)} stroke={INK} strokeWidth={1.5} />
            {/* Narines du bec */}
            <circle cx={HEAD_R + 20} cy={headCY + 5} r={2} fill={etatTint(OCRE, etat)} opacity={0.6} />
            {/* Verres oculaires (lunettes rondes) */}
            <circle cx={10} cy={headCY - 6} r={9} fill={etatTint("#c8d8c0", etat)} stroke={INK} strokeWidth={1.5} opacity={0.7} />
            <circle cx={10} cy={headCY - 6} r={9} fill="none" stroke={INK} strokeWidth={1.5} />
          </g>
        ) : (
          // Masque tombe/arrache si mort
          <g>
            <path d={`M ${HEAD_R},${headCY + 15} Q ${HEAD_R + 20},${headCY + 35} ${HEAD_R + 30},${headCY + 50}`}
              fill={OCRE_PALE} stroke={INK} strokeWidth={1.5} opacity={0.6} />
            {/* Visage revele sous le masque - expression mort */}
            <ellipse cx={2} cy={headCY} rx={HEAD_R - 2} ry={HEAD_R * 1.05} fill={SKIN} stroke={INK} strokeWidth={1} />
            <line x1={-6} y1={headCY - 4} x2={10} y2={headCY - 2} stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </g>
        )}
        {/* GRAND CHAPEAU NOIR a large bord */}
        <ellipse cx={2} cy={headCY - HEAD_R * 0.85} rx={HEAD_R + 16} ry={8}
          fill={etatTint("#1a1a1a", etat)} stroke={INK} strokeWidth={1.5} />
        <path d={`M ${-HEAD_R - 4},${headCY - HEAD_R * 0.85} Q ${-HEAD_R + 2},${headCY - HEAD_R * 2.8} ${HEAD_R + 4},${headCY - HEAD_R * 0.85}`}
          fill={etatTint("#1a1a1a", etat)} stroke={INK} strokeWidth={1.5} />
      </g>
    </g>
  );
};

// ============================================================
// FIGURANTS DE FOULE — meme univers enluminure, moins detailles
// Utilisable pour les villageois anonymes en arriere-plan
// Proportions reduites (TOTAL_H ~160px a scale=1) — taille de reference pour tous les persos
// ============================================================

const FIG_HEAD_R = 26;
const FIG_TORSO_H = 58;
const FIG_LEG_H = 55;

// VillageoisH — homme du peuple, tunique simple, bonnet rond
export const VillageoisH: React.FC<CharProps & { tuniqueColor?: string }> = ({
  x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain", tuniqueColor = STONE,
}) => {
  const flip = facing === "left" ? -1 : 1;
  const isWalk = anim === "walk" && etat !== "mort";
  const walk = frame * 0.1;
  const legSwing = isWalk ? Math.sin(walk) * 14 : 0;
  const armSwing = isWalk ? Math.sin(walk) * 12 : 0;

  const feetY = y;
  const hipY = feetY - FIG_LEG_H;
  const torsoTopY = hipY - FIG_TORSO_H;
  const headCY = torsoTopY - FIG_HEAD_R * 0.9;
  const shoulderY = torsoTopY + 10;

  const SKIN = etatTint(CHAIR, etat);
  const TUNIQUE = etatTint(tuniqueColor, etat);
  const BONNET = etatTint(INK_MID, etat);

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={etat === "mort" ? 0.5 : 1}>
      {/* Jambes */}
      <rect x={-8} y={hipY + legSwing * 0.4} width={14} height={FIG_LEG_H - legSwing * 0.4} rx={5}
        fill={TUNIQUE} stroke={INK} strokeWidth={1.5} />
      <rect x={6} y={hipY - legSwing * 0.4} width={14} height={FIG_LEG_H + legSwing * 0.4} rx={5}
        fill={etatTint(PARCHMENT_DARK, etat)} stroke={INK} strokeWidth={1.5} />
      {/* Pieds */}
      <ellipse cx={0}  cy={feetY} rx={10} ry={5} fill={INK} />
      <ellipse cx={14} cy={feetY} rx={10} ry={5} fill={INK} />
      {/* Bras gauche */}
      <rect x={-26} y={shoulderY} width={11} height={48} rx={4} fill={TUNIQUE} stroke={INK} strokeWidth={1.2}
        transform={`rotate(${-armSwing}, -20, ${shoulderY})`} />
      {/* Corps — tunique simple */}
      <rect x={-20} y={torsoTopY} width={42} height={FIG_TORSO_H} rx={8}
        fill={TUNIQUE} stroke={INK} strokeWidth={1.8} />
      {/* Ombre cote gauche — hachure legere */}
      <rect x={-20} y={torsoTopY} width={12} height={FIG_TORSO_H} rx={8}
        fill={INK} opacity={0.07} />
      {/* Bras droit */}
      <rect x={18} y={shoulderY} width={11} height={48} rx={4} fill={TUNIQUE} stroke={INK} strokeWidth={1.2}
        transform={`rotate(${armSwing}, 24, ${shoulderY})`} />
      {/* Cou */}
      <rect x={-6} y={torsoTopY - 10} width={14} height={14} rx={5} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      {/* Tete */}
      <ellipse cx={2} cy={headCY} rx={FIG_HEAD_R} ry={FIG_HEAD_R * 0.95}
        fill={SKIN} stroke={INK} strokeWidth={1.8} />
      {/* Visage minimal — un oeil, bouche */}
      <circle cx={10} cy={headCY - 2} r={3} fill={INK} />
      <path d={`M 4,${headCY + 10} Q 10,${headCY + 15} 16,${headCY + 11}`}
        stroke={INK} strokeWidth={1.2} fill="none" />
      {/* Bonnet rond */}
      <ellipse cx={2} cy={headCY - FIG_HEAD_R * 0.7} rx={FIG_HEAD_R + 4} ry={8}
        fill={BONNET} stroke={INK} strokeWidth={1.4} opacity={0.85} />
      <path d={`M ${-FIG_HEAD_R - 2},${headCY - FIG_HEAD_R * 0.7} Q 2,${headCY - FIG_HEAD_R * 2.2} ${FIG_HEAD_R + 2},${headCY - FIG_HEAD_R * 0.7}`}
        fill={BONNET} stroke={INK} strokeWidth={1.4} opacity={0.85} />
    </g>
  );
};

// VillageoisF — femme du peuple, robe longue, voile simple
export const VillageoisF: React.FC<CharProps & { robeColor?: string }> = ({
  x, y, facing = "right", anim = "idle", frame, scale = 1, etat = "sain", robeColor = PARCHMENT_DARK,
}) => {
  const flip = facing === "left" ? -1 : 1;
  const isWalk = anim === "walk" && etat !== "mort";
  const walk = frame * 0.1;
  const sway = isWalk ? Math.sin(walk) * 5 : 0;

  const feetY = y;
  const hipY = feetY - FIG_LEG_H;
  const torsoTopY = hipY - FIG_TORSO_H;
  const headCY = torsoTopY - FIG_HEAD_R * 0.9;
  const shoulderY = torsoTopY + 10;

  const SKIN = etatTint(CHAIR, etat);
  const ROBE = etatTint(robeColor, etat);
  const VOILE = etatTint(WHITE, etat);

  return (
    <g transform={`translate(${x}, 0) scale(${flip * scale}, ${scale})`} opacity={etat === "mort" ? 0.5 : 1}>
      {/* Robe longue — trapeze couvrant les pieds */}
      <path d={`M -18,${torsoTopY + 10} L -24,${feetY} L 28,${feetY} L 22,${torsoTopY + 10} Z`}
        fill={ROBE} stroke={INK} strokeWidth={1.8} />
      {/* Sway leger de la robe en marche */}
      <path d={`M -18,${hipY} Q ${sway},${hipY + FIG_LEG_H * 0.6} -20,${feetY}`}
        fill={ROBE} stroke={INK} strokeWidth={1} opacity={0.3} />
      {/* Bras gauche */}
      <rect x={-28} y={shoulderY} width={10} height={44} rx={4} fill={ROBE} stroke={INK} strokeWidth={1.2}
        transform={`rotate(${-sway * 1.5}, -22, ${shoulderY})`} />
      {/* Corps — corsage */}
      <rect x={-18} y={torsoTopY} width={38} height={FIG_TORSO_H * 0.55} rx={7}
        fill={etatTint(STONE, etat)} stroke={INK} strokeWidth={1.8} />
      {/* Bras droit */}
      <rect x={18} y={shoulderY} width={10} height={44} rx={4} fill={ROBE} stroke={INK} strokeWidth={1.2}
        transform={`rotate(${sway * 1.5}, 24, ${shoulderY})`} />
      {/* Cou */}
      <rect x={-5} y={torsoTopY - 10} width={12} height={14} rx={5} fill={SKIN} stroke={INK} strokeWidth={1.2} />
      {/* Tete */}
      <ellipse cx={2} cy={headCY} rx={FIG_HEAD_R * 0.9} ry={FIG_HEAD_R * 0.92}
        fill={SKIN} stroke={INK} strokeWidth={1.8} />
      {/* Visage minimal */}
      <circle cx={9} cy={headCY - 2} r={3} fill={INK} />
      <path d={`M 3,${headCY + 9} Q 9,${headCY + 14} 15,${headCY + 10}`}
        stroke={INK} strokeWidth={1.2} fill="none" />
      {/* Voile — couvre tete et epaules */}
      <path d={`M ${-FIG_HEAD_R - 6},${headCY - 4} Q ${-FIG_HEAD_R},${headCY - FIG_HEAD_R * 2.0} ${FIG_HEAD_R + 4},${headCY - FIG_HEAD_R * 1.8} L ${FIG_HEAD_R + 6},${headCY + FIG_HEAD_R * 0.5} Q 2,${headCY + FIG_HEAD_R * 0.8} ${-FIG_HEAD_R - 6},${headCY + FIG_HEAD_R * 0.4} Z`}
        fill={VOILE} stroke={INK} strokeWidth={1.5} opacity={0.9} />
    </g>
  );
};


