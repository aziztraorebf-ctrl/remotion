// Groupes SVG extraits de v3-resolution.svg (source Fable 5, statique).
// Doctrine SVG-SCENES-GENERATIVES : matiere LLM figee ici, animation en JSX cote composant.
// Genere par scripts/extract-svg-groups.py -- ne pas editer a la main, regenerer si le SVG source change.
//
// *_ATTRS : attributs portes par la balise <g id=...> source (opacity/fill/stroke/filter/
// transform/stroke-linecap...) -- HERITAGE CRITIQUE (ex fill="none" sur le <g> => les enfants
// sans fill explicite en heritent). A reappliquer sur le <g> wrapper qui injecte le contenu,
// sinon un cercle "stroke only" bascule vers le fill noir par defaut SVG.

export const RESOLUTIONV3_DEFS = `<radialGradient id="r-bgSeal" cx="0.5" cy="0.5" r="0.85">
    <stop offset="0" stop-color="#1A3A68" stop-opacity="0.8"/>
    <stop offset="0.4" stop-color="#122B4E" stop-opacity="0.4"/>
    <stop offset="1" stop-color="#0B1F3A" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="r-bgWarm">
    <stop offset="0%" stop-color="#FF6B1A" stop-opacity="0.3"/>
    <stop offset="35%" stop-color="#FF6B1A" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="r-burst">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
    <stop offset="10%" stop-color="#FFFFFF" stop-opacity="0.9"/>
    <stop offset="30%" stop-color="#FFD9B4" stop-opacity="0.5"/>
    <stop offset="60%" stop-color="#FF6B1A" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="r-ringG" x1="0" y1="1" x2="0.65" y2="0">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3"/>
    <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1"/>
  </linearGradient>
  <filter id="r-glowO" x="-120%" y="-120%" width="340%" height="340%">
    <feDropShadow dx="0" dy="0" stdDeviation="12" flood-color="#FF6B1A" flood-opacity="0.9"/>
  </filter>
  <filter id="r-glowOSoft" x="-120%" y="-120%" width="340%" height="340%">
    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#FF6B1A" flood-opacity="0.55"/>
  </filter>`;

export const RESOLUTIONV3_RES_GROUND = `<line x1="60" y1="1000" x2="1860" y2="1000" stroke-width="1"/>
  <line x1="120" y1="1040" x2="1800" y2="1040" stroke-width="1"/>`;
export const RESOLUTIONV3_RES_GROUND_ATTRS = { "opacity": "0.5", "stroke": "#FFFFFF", "fill": "none" } as const;

export const RESOLUTIONV3_RES_SEAL_GHOST = `<circle cx="960" cy="560" r="380" stroke-width="1.2"/>
  <circle cx="960" cy="560" r="330" stroke-width="1"/>`;
export const RESOLUTIONV3_RES_SEAL_GHOST_ATTRS = { "fill": "none", "stroke": "#FFFFFF", "opacity": "0.3" } as const;

export const RESOLUTIONV3_RES_SEAL_TICKS = ``;
export const RESOLUTIONV3_RES_SEAL_TICKS_ATTRS = { "stroke": "#FFFFFF", "strokeOpacity": "0.13", "strokeLinecap": "round" } as const;

export const RESOLUTIONV3_RES_SEAL_ARC = `<path d="M 1300 560 A 340 340 0 1 1 720 268" stroke="#FF6B1A" stroke-opacity="0.3" stroke-width="26" filter="url(#r-glowOSoft)" fill="none"/>
  <path d="M 1300 560 A 340 340 0 1 1 720 268" stroke="url(#r-ringG)" stroke-width="11" fill="none"/>
  <path d="M 1276 560 A 316 316 0 1 1 738 292" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.8" fill="none"/>`;

export const RESOLUTIONV3_RES_APPROACH = `<path d="M 100 90 C 380 190 600 260 720 268" stroke="#FF6B1A" stroke-opacity="0.15" stroke-width="20" filter="url(#r-glowOSoft)"/>
  <path d="M 100 90 C 380 190 600 260 720 268" stroke="url(#r-ringG)" stroke-width="6"/>`;
export const RESOLUTIONV3_RES_APPROACH_ATTRS = { "fill": "none", "strokeLinecap": "round" } as const;

export const RESOLUTIONV3_RES_PACKET = `<rect x="-20" y="-14" width="40" height="28" rx="4" fill="#FFD9B4" fill-opacity="0.6" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="2.2"/>
  <path d="M -20 -12 L 0 3 L 20 -12" fill="none" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="2.2"/>`;
export const RESOLUTIONV3_RES_PACKET_ATTRS = { "transform": "translate(720 268) rotate(18)", "opacity": "0.9" } as const;

export const RESOLUTIONV3_RES_SEAL_WELD = `<path d="M 720 268 A 340 340 0 0 1 1300 560" stroke="#FF6B1A" stroke-opacity="1" stroke-width="12" filter="url(#r-glowO)"/>
  <path d="M 720 268 A 340 340 0 0 1 1300 560" stroke="#FFE2C6" stroke-opacity="0.95" stroke-width="4.2"/>`;
export const RESOLUTIONV3_RES_SEAL_WELD_ATTRS = { "fill": "none", "strokeLinecap": "round" } as const;

export const RESOLUTIONV3_RES_IMPACT = `<circle cx="1300" cy="560" r="105" fill="url(#r-burst)"/>`;

export const RESOLUTIONV3_RES_ECHOES = `<circle cx="1650" cy="780" r="4" fill="#FFFFFF"/>
  <circle cx="1580" cy="860" r="3" fill="#FF6B1A"/>
  <circle cx="1720" cy="700" r="3" fill="#FFFFFF"/>
  <circle cx="280" cy="820" r="4" fill="#FFFFFF"/>
  <circle cx="360" cy="900" r="3" fill="#FF6B1A"/>
  <circle cx="1780" cy="900" r="3" fill="#FFFFFF"/>`;
export const RESOLUTIONV3_RES_ECHOES_ATTRS = { "opacity": "0.35" } as const;

export const RESOLUTIONV3_RES_CORE = `<circle r="12" fill="#FFFFFF" opacity="0.5"/>
  <circle r="4" fill="#FF6B1A"/>`;
export const RESOLUTIONV3_RES_CORE_ATTRS = { "transform": "translate(960 560)" } as const;

export const RESOLUTIONV3_RES_CONFIRM = `<circle r="76" fill="#FFFFFF"/>
  <path d="M -32 2 L -10 26 L 34 -24" fill="none" stroke="#FF6B1A" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="0" y="120" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="2" fill="#FFFFFF">TRAITÉ</text>`;
export const RESOLUTIONV3_RES_CONFIRM_ATTRS = { "transform": "translate(960 560)" } as const;

export const RESOLUTIONV3_RES_RESIDUE = `<circle cx="960" cy="540" r="340" fill="none" stroke="#FF6B1A" stroke-width="1" stroke-opacity="0.15"/>
  <circle cx="960" cy="540" r="420" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.1"/>`;
export const RESOLUTIONV3_RES_RESIDUE_ATTRS = { "opacity": "0.4" } as const;

export const RESOLUTIONV3_RES_REST_WAVES = `<circle cx="960" cy="540" r="480" stroke-width="1" stroke-opacity="0.08"/>
  <circle cx="960" cy="540" r="540" stroke-width="1" stroke-opacity="0.05"/>`;
export const RESOLUTIONV3_RES_REST_WAVES_ATTRS = { "fill": "none", "stroke": "#FFFFFF", "filter": "url(#r-glowOSoft)", "opacity": "0.5" } as const;

export const RESOLUTIONV3_GROUP_IDS = ["res-ground", "res-seal-ghost", "res-seal-ticks", "res-seal-arc", "res-approach", "res-packet", "res-seal-weld", "res-impact", "res-echoes", "res-core", "res-confirm", "res-residue", "res-rest-waves"];
