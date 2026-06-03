import React from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AmpouleIcon — Métaphore "ampoule alimentée par X% d'uranium pays"
// Pour sujets uranium / minerais énergétiques (Niger, Namibie, Kazakhstan...)
//
// Structure visuelle :
//   - Ampoule à incandescence stylisée (silhouette claire)
//   - À l'intérieur : "filament" vertical aux couleurs du drapeau pays
//   - Halo lumineux derrière l'ampoule = "l'éclairage produit"
//   - Au pied de l'ampoule : "culot" gris métal
// ─────────────────────────────────────────────────────────────────────────────

export interface AmpouleIconProps {
  ratio: number;                       // % de revenus restant au pays (filament rempli à ce ratio)
  flagColors: { a: string; b: string; c: string };
  position?: { cx: number; cy: number };
  size?: { w: number; h: number };
}

const C = {
  gold:       "#c8a951",
  goldHi:     "#e8c472",
  goldGlow:   "#ffd84d",
  // Verre semi-transparent qui laisse voir le filament (plus clair que v1)
  bulbGlass:  "rgba(60, 75, 100, 0.45)",
  bulbHi:     "rgba(255, 230, 150, 0.25)",
  filamentDark: "#3a4150",
  metal:      "#5a6275",
  metalDark:  "#2a2f3a",
};

export const AmpouleIcon: React.FC<AmpouleIconProps> = ({
  ratio,
  flagColors,
  position = { cx: 540, cy: 380 },
  size = { w: 380, h: 480 },
}) => {
  const { cx, cy } = position;
  const { w, h } = size;

  // Ampoule = bulb sphérique + col + culot
  // Proportions classiques : bulb 60% h, col 10% h, culot 30% h
  const bulbR = w * 0.42;                   // rayon du bulb
  const bulbCy = cy - h * 0.18;             // centre du bulb (haut)
  const colTop = bulbCy + bulbR * 0.85;
  const colBottom = colTop + h * 0.10;
  const culotTop = colBottom;
  const culotBottom = cy + h * 0.42;
  const culotW = w * 0.32;

  // Filament vertical centré dans le bulb
  // Hauteur totale du filament potentielle = bulb + col
  const filamentTopMax = bulbCy - bulbR * 0.5;
  const filamentBottom = colBottom;
  const filamentMaxH = filamentBottom - filamentTopMax;
  const filamentW = w * 0.28;  // élargi pour visibilité

  // Rempli à `ratio`% depuis le bas
  const filamentTop = filamentBottom - (filamentMaxH * ratio) / 100;
  const filamentLeft = cx - filamentW / 2;
  const filamentRight = cx + filamentW / 2;

  // ID unique pour les gradients (éviter collision entre instances)
  const uid = flagColors.a.replace("#", "");

  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1280 720"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        {/* Halo lumineux derrière l'ampoule — beaucoup plus visible */}
        <radialGradient id={`halo-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={C.goldGlow} stopOpacity={0.7} />
          <stop offset="30%"  stopColor={C.goldHi} stopOpacity={0.35} />
          <stop offset="60%"  stopColor={C.gold} stopOpacity={0.1} />
          <stop offset="100%" stopColor={C.goldGlow} stopOpacity={0} />
        </radialGradient>

        {/* Verre du bulb (transparent qui laisse voir le filament) */}
        <radialGradient id={`glass-${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="rgba(120, 140, 170, 0.55)" />
          <stop offset="60%"  stopColor={C.bulbGlass} />
          <stop offset="100%" stopColor="rgba(30, 45, 70, 0.6)" />
        </radialGradient>

        {/* Filament drapeau pays — 3 bandes horizontales (a bas, b milieu, c haut) */}
        <linearGradient id={`filament-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"      stopColor={flagColors.a} />
          <stop offset="33%"     stopColor={flagColors.a} />
          <stop offset="33.01%"  stopColor={flagColors.b} />
          <stop offset="66%"     stopColor={flagColors.b} />
          <stop offset="66.01%"  stopColor={flagColors.c} />
          <stop offset="100%"    stopColor={flagColors.c} />
        </linearGradient>

        {/* Filament éteint (partie qui devrait être remplie mais ne l'est pas) */}
        <linearGradient id={`filamentDark-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={C.filamentDark} />
          <stop offset="100%" stopColor="#1a1f28" />
        </linearGradient>

        {/* Culot métal (vissable) */}
        <linearGradient id={`culot-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={C.metalDark} />
          <stop offset="30%"  stopColor={C.metal} />
          <stop offset="70%"  stopColor={C.metal} />
          <stop offset="100%" stopColor={C.metalDark} />
        </linearGradient>

        {/* Glow du filament allumé */}
        <filter id={`filamentGlow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* HALO LUMINEUX DERRIÈRE (effet "l'ampoule éclaire") */}
      <circle
        cx={cx} cy={bulbCy}
        r={bulbR * 1.8}
        fill={`url(#halo-${uid})`}
      />

      {/* BULB (corps en verre) */}
      <circle
        cx={cx} cy={bulbCy}
        r={bulbR}
        fill={`url(#glass-${uid})`}
        stroke={C.gold}
        strokeWidth={2.5}
        strokeOpacity={0.6}
      />
      {/* Highlight de reflet sur le verre */}
      <ellipse
        cx={cx - bulbR * 0.35}
        cy={bulbCy - bulbR * 0.4}
        rx={bulbR * 0.18}
        ry={bulbR * 0.28}
        fill="rgba(255,255,255,0.18)"
      />

      {/* COL entre bulb et culot */}
      <path
        d={`
          M ${cx - culotW / 2 - 6} ${colTop}
          Q ${cx} ${colTop - 8} ${cx + culotW / 2 + 6} ${colTop}
          L ${cx + culotW / 2} ${colBottom}
          L ${cx - culotW / 2} ${colBottom}
          Z
        `}
        fill={C.metalDark}
        stroke={C.gold}
        strokeWidth={1.5}
        strokeOpacity={0.4}
      />

      {/* CULOT VISSABLE */}
      <rect
        x={cx - culotW / 2}
        y={culotTop}
        width={culotW}
        height={culotBottom - culotTop}
        fill={`url(#culot-${uid})`}
      />
      {/* Stries du culot (effet vissé) */}
      {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
        <line
          key={i}
          x1={cx - culotW / 2}
          x2={cx + culotW / 2}
          y1={culotTop + (culotBottom - culotTop) * p}
          y2={culotTop + (culotBottom - culotTop) * p}
          stroke="rgba(0,0,0,0.6)"
          strokeWidth={2}
        />
      ))}

      {/* Petite plage de contact noire en bas du culot */}
      <rect
        x={cx - culotW / 4}
        y={culotBottom - 8}
        width={culotW / 2}
        height={8}
        fill="#0a0e16"
        stroke={C.gold}
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* FILAMENT — barre verticale qui "monte" comme un combustible */}
      {/* Tube extérieur (verre du tube interne) */}
      <rect
        x={filamentLeft - 4}
        y={filamentTopMax - 8}
        width={filamentW + 8}
        height={filamentMaxH + 16}
        fill="rgba(0,0,0,0.4)"
        stroke="rgba(200,169,81,0.3)"
        strokeWidth={1}
        rx={4}
      />

      {/* Partie ÉTEINTE du tube (au-dessus du niveau) */}
      <rect
        x={filamentLeft}
        y={filamentTopMax}
        width={filamentW}
        height={filamentTop - filamentTopMax}
        fill={`url(#filamentDark-${uid})`}
      />

      {/* Partie ALLUMÉE — drapeau pays avec glow */}
      <rect
        x={filamentLeft}
        y={filamentTop}
        width={filamentW}
        height={filamentBottom - filamentTop}
        fill={`url(#filament-${uid})`}
        filter={`url(#filamentGlow-${uid})`}
      />

      {/* Ligne de séparation entre allumé et éteint = "niveau de remplissage" */}
      <line
        x1={filamentLeft - 18}
        x2={filamentRight + 18}
        y1={filamentTop}
        y2={filamentTop}
        stroke={C.goldHi}
        strokeWidth={4}
        strokeLinecap="round"
        filter={`url(#filamentGlow-${uid})`}
      />

      {/* Rayons lumineux subtils sortant de l'ampoule (effet illumination) */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const innerR = bulbR * 1.0;
        const outerR = bulbR * 1.6;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = bulbCy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = bulbCy + Math.sin(angle) * outerR;
        // Skip rayons qui pointent vers le culot
        if (Math.sin(angle) > 0.3) return null;
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.goldGlow}
            strokeWidth={2.5}
            strokeOpacity={0.5}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
