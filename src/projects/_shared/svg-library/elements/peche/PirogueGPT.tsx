/**
 * PirogueGPT — pirogue artisanale (bois peint, bandes or/rouge/vert, proue/poupe travaillees).
 * Extraite de l'upgrade GPT-5.5 (svg-scene-upgrade.py, 2026-07-04, scene PecheurSurpeche16x9) —
 * verdict mix-and-match : GPT a produit la meilleure pirogue (motifs bois peints, details de
 * construction typiques Afrique de l'Ouest), retenue face au chalutier Gemini (voir ChalutierGemini.tsx).
 *
 * Coordonnees originales du SVG source (x 558-1042, y 1004-1062) recentrees ici sur l'origine
 * locale (0,0) via translate interne — l'appelant positionne/scale via son propre <g transform>.
 * Palette bois figee (grad wood_hull_grad + pattern wood_grain) : pas parametrable pour l'instant,
 * a etendre si un jour besoin d'une variante de couleur.
 */
import React from "react";

export const PirogueGPT: React.FC<{ idPrefix?: string }> = ({ idPrefix = "pirogueGpt" }) => (
  <g transform="translate(-800 -1033)">
    <defs>
      <linearGradient id={`${idPrefix}WoodHull`} x1="558" y1="1004" x2="1042" y2="1045" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#a0652d" />
        <stop offset="0.45" stopColor="#7b461f" />
        <stop offset="1" stopColor="#b17435" />
      </linearGradient>
      <pattern id={`${idPrefix}WoodGrain`} width="70" height="18" patternUnits="userSpaceOnUse">
        <path d="M0 9 C18 2 36 16 70 8" fill="none" stroke="#4b2a15" strokeOpacity="0.36" strokeWidth="2" />
        <path d="M0 15 C22 11 38 21 70 13" fill="none" stroke="#d49a5d" strokeOpacity="0.22" strokeWidth="1.2" />
      </pattern>
      <filter id={`${idPrefix}SoftShadow`} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1a1714" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter={`url(#${idPrefix}SoftShadow)`}>
      <path d="M558 1009 C678 1032 842 1035 1042 1004 L1019 1030 C857 1062 695 1060 580 1035 Z" fill={`url(#${idPrefix}WoodHull)`} stroke="#21160d" strokeWidth={5} strokeLinejoin="round" />
      <path d="M558 1009 C682 1034 840 1034 1042 1004 C1010 1017 928 1027 826 1029 C710 1031 618 1022 558 1009 Z" fill="#2b1a0d" opacity={0.66} />
      <path d="M585 1021 C704 1044 856 1044 1017 1019" fill="none" stroke={`url(#${idPrefix}WoodGrain)`} strokeWidth={18} opacity={0.9} />
      <path d="M620 1034 C720 1050 870 1052 984 1033" fill="none" stroke="#3c2110" strokeWidth={4} opacity={0.82} />
      <path d="M610 1019 L636 1043 M691 1029 L706 1052 M774 1033 L780 1056 M858 1032 L850 1055 M940 1023 L920 1048" stroke="#23150a" strokeOpacity="0.55" strokeWidth={3} />
      <path d="M574 1013 L600 1020 L586 1031 Z M1002 1011 L1031 1006 L1014 1023 Z" fill="#f1c65e" stroke="#24150b" strokeWidth={2} />
      <path d="M650 1038 C752 1054 866 1054 960 1039" fill="none" stroke="#e2b04d" strokeWidth={4} opacity={0.9} />
      <path d="M667 1043 L688 1034 L710 1044 L732 1035 L754 1045 L776 1036 L798 1046 L820 1037" fill="none" stroke="#e7d078" strokeWidth={2.1} opacity={0.9} />
      <path d="M589 1035 C708 1059 865 1061 1019 1030" fill="none" stroke="#130d08" strokeWidth={4} />
    </g>
  </g>
);
