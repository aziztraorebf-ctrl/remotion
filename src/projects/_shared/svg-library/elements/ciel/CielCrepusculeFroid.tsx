/**
 * CielCrepusculeFroid — dégradé de ciel crépuscule/nuit froide (bleu-nuit en haut, ocre-doré en bas)
 * + nuages fins en hachures légères. Extrait de PortSoudanNegociationScene.tsx (Acte 4 Soudan, Beat 2,
 * GPT-5.6 Sol, 2026-07-12). Registre distinct de SoleilHaloRadial (jour chaud Afrique) — celui-ci sert
 * les scènes nocturnes/tendues (négociation, guet, veille).
 *
 * Usage : poser <CielCrepusculeDefs/> une fois dans un <defs> parent, puis <CielCrepusculeFroid/>.
 */
import React from "react";

export const CielCrepusculeDefs: React.FC = () => (
  <>
    <linearGradient id="cielCrepFroid_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a3d54" />
      <stop offset="0.48" stopColor="#5d6f85" />
      <stop offset="0.8" stopColor="#c29a6e" />
      <stop offset="1" stopColor="#dcb684" />
    </linearGradient>
    <pattern id="cielCrepFroid_light" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(70)">
      <path d="M0 0V16" fill="none" stroke="#d0b67f" strokeWidth="1.5" opacity="0.22" />
    </pattern>
  </>
);

export const CielCrepusculeFroid: React.FC = () => (
  <g id="ciel">
    <rect width={1920} height={575} fill="url(#cielCrepFroid_sky)" />
    <path d="M0 404C190 368 333 395 485 382C638 369 760 331 924 349C1097 368 1210 401 1396 382C1578 364 1739 328 1920 353V518H0Z" fill="#c0a16f" opacity="0.12" />
    <g fill="none" stroke="#c8b184" strokeLinecap="round">
      <path d="M104 210C244 178 378 190 504 226" strokeWidth={3} opacity="0.22" />
      <path d="M131 226C271 199 385 210 462 239" strokeWidth={2} opacity="0.18" />
      <path d="M693 171C819 139 957 151 1082 190" strokeWidth={3} opacity="0.16" />
      <path d="M720 188C834 162 934 171 1038 202" strokeWidth={2} opacity="0.18" />
      <path d="M1310 255C1479 212 1639 220 1785 260" strokeWidth={3} opacity="0.2" />
      <path d="M1352 271C1482 242 1617 247 1741 277" strokeWidth={2} opacity="0.18" />
    </g>
    <path d="M82 236C219 202 356 209 490 245M680 197C819 159 949 170 1082 211M1301 282C1454 239 1630 244 1802 286" fill="none" stroke="url(#cielCrepFroid_light)" strokeWidth={17} opacity="0.45" />
  </g>
);

export default CielCrepusculeFroid;
