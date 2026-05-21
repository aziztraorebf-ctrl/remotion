// Shared SVG <defs> for all Atlas V2 scenes and inserts.
// Centralizes gradients, filters, and patterns that may be used across multiple scenes.
import React from "react";
import { ATLAS_COLORS } from "./atlas-v2-components";

export const AtlasSharedDefs: React.FC = () => (
  <defs>
    {/* === Gradients === */}
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={ATLAS_COLORS.bgTop} />
      <stop offset="100%" stopColor={ATLAS_COLORS.bgBottom} />
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
    </radialGradient>
    <radialGradient id="maliGoldGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stopColor="#FFE9A8" />
      <stop offset="100%" stopColor={ATLAS_COLORS.empireGold} />
    </radialGradient>
    <radialGradient id="paleGoldGrad" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stopColor="#7A6A4A" />
      <stop offset="100%" stopColor="#5A4A33" />
    </radialGradient>
    <linearGradient id="wipeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} />
      <stop offset="100%" stopColor="#8B5A2B" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={ATLAS_COLORS.empireGold} />
      <stop offset="50%" stopColor="#E8703A" />
      <stop offset="100%" stopColor="#DA0000" />
    </linearGradient>
    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#DA0000" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#DA0000" stopOpacity="0.0" />
    </linearGradient>

    {/* === Patterns === */}
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

    {/* === Filters === */}
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* === Texture papier (SVG natif, deterministe, zero asset) === */}
    {/* Pattern : turbulence fractale tonue + colorMatrix vers cream/sepia */}
    <filter id="paperTexture" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="2"
        seed="7"
        result="grain"
      />
      <feColorMatrix
        in="grain"
        type="matrix"
        values="0 0 0 0 0.96
                0 0 0 0 0.92
                0 0 0 0 0.85
                0 0 0 0.5 0"
        result="cream"
      />
      <feComposite in="cream" in2="SourceGraphic" operator="in" />
    </filter>
    {/* Texture grain fin pour overlay multiply (donne effet papier sur tout) */}
    <filter id="paperGrain" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="1.8"
        numOctaves="3"
        seed="13"
        result="noise"
      />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 0.92
                0 0 0 0 0.86
                0 0 0 0 0.78
                0 0 0 0.18 0"
      />
    </filter>
  </defs>
);
