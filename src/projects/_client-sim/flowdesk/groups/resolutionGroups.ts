// Groupes SVG extraits de proto-fable5-resolution.svg (source Fable 5, statique).
// Doctrine SVG-SCENES-GENERATIVES : matiere LLM figee ici, animation en JSX cote composant.
// Genere par scripts/extract-svg-groups.py -- ne pas editer a la main, regenerer si le SVG source change.
//
// *_ATTRS : attributs portes par la balise <g id=...> source (opacity/fill/stroke/filter/
// transform/stroke-linecap...) -- HERITAGE CRITIQUE (ex fill="none" sur le <g> => les enfants
// sans fill explicite en heritent). A reappliquer sur le <g> wrapper qui injecte le contenu,
// sinon un cercle "stroke only" bascule vers le fill noir par defaut SVG.

export const RESOLUTION_DEFS = `<radialGradient id="bgSeal" cx="0.5833" cy="0.6222" r="0.86">
    <stop offset="0%" stop-color="#1A3A68" stop-opacity="0.80"/>
    <stop offset="34%" stop-color="#122B4E" stop-opacity="0.42"/>
    <stop offset="100%" stop-color="#0B1F3A" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="bgWarm" cx="0.4395" cy="0.4987" r="0.46">
    <stop offset="0%" stop-color="#FF6B1A" stop-opacity="0.34"/>
    <stop offset="30%" stop-color="#FF6B1A" stop-opacity="0.11"/>
    <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="vignette" cx="50%" cy="50%" r="78%">
    <stop offset="50%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000814" stop-opacity="0.66"/>
  </radialGradient>
  <radialGradient id="burst">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1"/>
    <stop offset="7%" stop-color="#FFFFFF" stop-opacity="0.92"/>
    <stop offset="16%" stop-color="#FFD9B4" stop-opacity="0.72"/>
    <stop offset="31%" stop-color="#FF8C3A" stop-opacity="0.42"/>
    <stop offset="56%" stop-color="#FF6B1A" stop-opacity="0.16"/>
    <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="burstWide">
    <stop offset="0%" stop-color="#FF8C3A" stop-opacity="0.30"/>
    <stop offset="45%" stop-color="#FF6B1A" stop-opacity="0.11"/>
    <stop offset="100%" stop-color="#FF6B1A" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="ringG" x1="0" y1="1" x2="0.65" y2="0">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.22"/>
    <stop offset="52%" stop-color="#FFFFFF" stop-opacity="0.62"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.95"/>
  </linearGradient>
  <linearGradient id="trailG" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#FF6B1A" stop-opacity="0"/>
    <stop offset="55%" stop-color="#FF6B1A" stop-opacity="0.26"/>
    <stop offset="88%" stop-color="#FFA25E" stop-opacity="0.72"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.96"/>
  </linearGradient>
  <filter id="glowO" x="-120%" y="-120%" width="340%" height="340%">
    <feDropShadow dx="0" dy="0" stdDeviation="13" flood-color="#FF6B1A" flood-opacity="0.95"/>
  </filter>
  <filter id="glowOSoft" x="-120%" y="-120%" width="340%" height="340%">
    <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#FF6B1A" flood-opacity="0.60"/>
  </filter>
  <filter id="glowW" x="-100%" y="-100%" width="300%" height="300%">
    <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#FFFFFF" flood-opacity="0.70"/>
  </filter>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.1"/></filter>
  <filter id="far" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="3.4"/></filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>`;

export const RESOLUTION_REST_WAVES = `<circle cx="560.0" cy="672.0" r="288.0" stroke-opacity="0.085" stroke-width="1.40"/>
<circle cx="560.0" cy="672.0" r="406.0" stroke-opacity="0.055" stroke-width="1.15"/>
<circle cx="560.0" cy="672.0" r="544.0" stroke-opacity="0.032" stroke-width="0.90"/>`;
export const RESOLUTION_REST_WAVES_ATTRS = { "fill": "none", "stroke": "#FFFFFF", "filter": "url(#far)" } as const;

export const RESOLUTION_GROUND = `<line x1="96" y1="952.0" x2="864" y2="952.0" stroke-opacity="0.1" stroke-width="1.2"/>
<line x1="152" y1="1002.0" x2="808" y2="1002.0" stroke-opacity="0.07" stroke-width="1.1"/>
<line x1="220" y1="1052.0" x2="740" y2="1052.0" stroke-opacity="0.045" stroke-width="1.0"/>`;
export const RESOLUTION_GROUND_ATTRS = { "stroke": "#FFFFFF", "fill": "none" } as const;

export const RESOLUTION_SEAL_GHOST = `<circle cx="560.0" cy="672.0" r="192.0" stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="1.1"/>
<circle cx="560.0" cy="672.0" r="166.0" stroke="#FFFFFF" stroke-opacity="0.055" stroke-width="1.0"/>`;
export const RESOLUTION_SEAL_GHOST_ATTRS = { "fill": "none" } as const;

export const RESOLUTION_SEAL_ARC = `<path d="M 461.11 507.42 A 192.00 192.00 0 1 1 392.07 578.92" stroke="#FF6B1A" stroke-opacity="0.30" stroke-width="17" filter="url(#glowOSoft)"/>
<path d="M 461.11 507.42 A 192.00 192.00 0 1 1 392.07 578.92" stroke="url(#ringG)" stroke-width="6.4"/>
<path d="M 467.81 518.57 A 179.00 179.00 0 1 1 403.44 585.22" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="1.3"/>`;
export const RESOLUTION_SEAL_ARC_ATTRS = { "fill": "none", "strokeLinecap": "round" } as const;

export const RESOLUTION_SEAL_TICKS = `<line x1="455.45" y1="498.00" x2="452.36" y2="492.85" stroke="#FFFFFF" stroke-opacity="0.130" stroke-width="1.50"/>
<line x1="490.57" y1="481.24" x2="488.52" y2="475.60" stroke="#FFFFFF" stroke-opacity="0.130" stroke-width="1.50"/>
<line x1="528.24" y1="471.50" x2="527.30" y2="465.56" stroke="#FFFFFF" stroke-opacity="0.131" stroke-width="1.50"/>
<line x1="567.08" y1="469.12" x2="567.30" y2="463.08" stroke="#FFFFFF" stroke-opacity="0.132" stroke-width="1.50"/>
<line x1="605.67" y1="474.20" x2="607.03" y2="468.27" stroke="#FFFFFF" stroke-opacity="0.134" stroke-width="1.51"/>
<line x1="642.57" y1="486.55" x2="645.07" y2="480.93" stroke="#FFFFFF" stroke-opacity="0.137" stroke-width="1.51"/>
<line x1="676.44" y1="505.71" x2="680.01" y2="500.61" stroke="#FFFFFF" stroke-opacity="0.142" stroke-width="1.52"/>
<line x1="706.03" y1="530.98" x2="710.58" y2="526.58" stroke="#FFFFFF" stroke-opacity="0.147" stroke-width="1.53"/>
<line x1="730.25" y1="561.44" x2="735.67" y2="557.92" stroke="#FFFFFF" stroke-opacity="0.153" stroke-width="1.55"/>
<line x1="748.22" y1="595.95" x2="754.35" y2="593.48" stroke="#FFFFFF" stroke-opacity="0.161" stroke-width="1.56"/>
<line x1="759.27" y1="633.27" x2="765.93" y2="631.97" stroke="#FFFFFF" stroke-opacity="0.169" stroke-width="1.58"/>
<line x1="763.00" y1="672.00" x2="769.99" y2="672.00" stroke="#FFFFFF" stroke-opacity="0.180" stroke-width="1.60"/>
<line x1="759.27" y1="710.73" x2="766.36" y2="712.11" stroke="#FFFFFF" stroke-opacity="0.191" stroke-width="1.62"/>
<line x1="748.22" y1="748.05" x2="755.15" y2="750.85" stroke="#FFFFFF" stroke-opacity="0.204" stroke-width="1.65"/>
<line x1="730.25" y1="782.56" x2="736.76" y2="786.79" stroke="#FFFFFF" stroke-opacity="0.218" stroke-width="1.68"/>
<line x1="706.03" y1="813.02" x2="711.84" y2="818.63" stroke="#FFFFFF" stroke-opacity="0.234" stroke-width="1.71"/>
<line x1="676.44" y1="838.29" x2="681.27" y2="845.20" stroke="#FFFFFF" stroke-opacity="0.252" stroke-width="1.74"/>
<line x1="642.57" y1="857.45" x2="646.15" y2="865.50" stroke="#FFFFFF" stroke-opacity="0.271" stroke-width="1.78"/>
<line x1="605.67" y1="869.80" x2="607.74" y2="878.79" stroke="#FFFFFF" stroke-opacity="0.291" stroke-width="1.82"/>
<line x1="567.08" y1="874.88" x2="567.42" y2="884.55" stroke="#FFFFFF" stroke-opacity="0.314" stroke-width="1.87"/>
<line x1="528.24" y1="872.50" x2="526.65" y2="882.53" stroke="#FFFFFF" stroke-opacity="0.338" stroke-width="1.92"/>
<line x1="490.57" y1="862.76" x2="486.92" y2="872.79" stroke="#FFFFFF" stroke-opacity="0.364" stroke-width="1.97"/>
<line x1="455.45" y1="846.00" x2="449.67" y2="855.63" stroke="#FFFFFF" stroke-opacity="0.391" stroke-width="2.02"/>
<line x1="424.17" y1="822.86" x2="416.26" y2="831.64" stroke="#FFFFFF" stroke-opacity="0.421" stroke-width="2.08"/>
<line x1="397.88" y1="794.17" x2="387.94" y2="801.65" stroke="#FFFFFF" stroke-opacity="0.452" stroke-width="2.14"/>
<line x1="377.54" y1="760.99" x2="365.77" y2="766.73" stroke="#FF6B1A" stroke-opacity="0.485" stroke-width="2.21"/>
<line x1="363.92" y1="724.54" x2="350.58" y2="728.11" stroke="#FF6B1A" stroke-opacity="0.520" stroke-width="2.28"/>
<line x1="357.49" y1="686.16" x2="342.99" y2="687.17" stroke="#FF6B1A" stroke-opacity="0.557" stroke-width="2.35"/>
<line x1="358.51" y1="647.26" x2="343.31" y2="645.39" stroke="#FF6B1A" stroke-opacity="0.596" stroke-width="2.43"/>
<line x1="366.94" y1="609.27" x2="351.59" y2="604.28" stroke="#FF6B1A" stroke-opacity="0.637" stroke-width="2.51"/>
<line x1="382.45" y1="573.58" x2="367.58" y2="565.34" stroke="#FF6B1A" stroke-opacity="0.680" stroke-width="2.60"/>`;
export const RESOLUTION_SEAL_TICKS_ATTRS = { "strokeLinecap": "round" } as const;

export const RESOLUTION_SEAL_WELD = `<path d="M 379.58 606.33 A 192.00 192.00 0 0 1 488.08 493.98" stroke="#FF6B1A" stroke-opacity="0.98" stroke-width="7.2" filter="url(#glowO)"/>
<path d="M 379.58 606.33 A 192.00 192.00 0 0 1 488.08 493.98" stroke="#FFE2C6" stroke-opacity="0.92" stroke-width="2.6"/>`;
export const RESOLUTION_SEAL_WELD_ATTRS = { "fill": "none", "strokeLinecap": "round" } as const;

export const RESOLUTION_APPROACH = `<path d="M 104.0 196.0 C 214.0 268.0 526.5 292.1 421.89 538.63" stroke="#FF6B1A" stroke-opacity="0.13" stroke-width="13" filter="url(#soft)"/>
<path d="M 104.0 196.0 C 214.0 268.0 526.5 292.1 421.89 538.63" stroke="url(#trailG)" stroke-width="3.6"/>`;
export const RESOLUTION_APPROACH_ATTRS = { "fill": "none", "strokeLinecap": "round" } as const;

export const RESOLUTION_PACKET = `<g opacity="0.26" transform="translate(293.54 276.71) rotate(24.0)">
<path d="M 6.60 0 L 0 3.30 L -6.60 0 L 0 -3.30 Z" fill="#FFD9B4" fill-opacity="0.53" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="1.6"/>
</g>
<g opacity="0.42" transform="translate(363.99 314.80) rotate(34.3)">
<path d="M 8.71 0 L 0 4.36 L -8.71 0 L 0 -4.36 Z" fill="#FFD9B4" fill-opacity="0.60" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="1.6"/>
</g>
<g opacity="0.62" transform="translate(412.98 359.47) rotate(52.2)">
<path d="M 10.82 0 L 0 5.41 L -10.82 0 L 0 -5.41 Z" fill="#FFD9B4" fill-opacity="0.67" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="1.6"/>
</g>
<g opacity="0.88" transform="translate(439.56 415.24) rotate(77.5)">
<path d="M 13.20 0 L 0 6.60 L -13.20 0 L 0 -6.60 Z" fill="#FFD9B4" fill-opacity="0.75" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="1.6"/>
</g>`;

export const RESOLUTION_IMPACT = `<circle cx="421.89" cy="538.63" r="360" fill="url(#burstWide)"/>
<circle cx="421.89" cy="538.63" r="196" fill="url(#burst)"/>
<circle cx="421.89" cy="538.63" r="44.0" fill="none" stroke="#FF6B1A" stroke-opacity="0.95" stroke-width="3.0"/>
<circle cx="421.89" cy="538.63" r="76.0" fill="none" stroke="#FF6B1A" stroke-opacity="0.42" stroke-width="1.9"/>
<circle cx="421.89" cy="538.63" r="118.0" fill="none" stroke="#FF6B1A" stroke-opacity="0.17" stroke-width="1.3"/>
<line x1="473.38" y1="545.86" x2="530.82" y2="553.93" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="462.86" y1="570.64" x2="487.29" y2="589.73" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<line x1="441.37" y1="586.84" x2="463.09" y2="640.62" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="414.65" y1="590.12" x2="410.34" y2="620.82" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<line x1="389.87" y1="579.60" x2="354.16" y2="625.31" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="373.67" y1="558.11" x2="344.93" y2="569.72" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<line x1="370.39" y1="531.39" x2="312.96" y2="523.32" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="380.91" y1="506.61" x2="356.48" y2="487.53" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<line x1="402.41" y1="490.41" x2="380.68" y2="436.64" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="429.12" y1="487.13" x2="433.44" y2="456.43" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<line x1="453.90" y1="497.65" x2="489.61" y2="451.94" stroke="#FF6B1A" stroke-opacity="0.62" stroke-width="2.1" stroke-linecap="round"/>
<line x1="470.10" y1="519.15" x2="498.84" y2="507.53" stroke="#FF6B1A" stroke-opacity="0.34" stroke-width="1.4" stroke-linecap="round"/>
<circle cx="421.89" cy="538.63" r="20.0" fill="#FFFFFF" filter="url(#glowO)"/>
<circle cx="421.89" cy="538.63" r="9.0" fill="#FFFFFF" filter="url(#glowW)"/>`;

export const RESOLUTION_CORE = `<circle cx="560.0" cy="672.0" r="7.5" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="1.4"/>
<circle cx="560.0" cy="672.0" r="2.1" fill="#FF6B1A" fill-opacity="0.85"/>
<line x1="560.0" y1="642.0" x2="560.0" y2="657.0" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1"/>
<line x1="560.0" y1="687.0" x2="560.0" y2="702.0" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1"/>
<line x1="530.0" y1="672.0" x2="545.0" y2="672.0" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1"/>
<line x1="575.0" y1="672.0" x2="590.0" y2="672.0" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1"/>`;
export const RESOLUTION_CORE_ATTRS = { "fill": "none" } as const;

export const RESOLUTION_RESIDUE = `<circle cx="212.0" cy="878.0" r="2.4" fill="#FF6B1A" opacity="0.22"/>
<circle cx="300.0" cy="932.0" r="1.8" fill="#FF6B1A" opacity="0.15"/>
<circle cx="824.0" cy="900.0" r="2.0" fill="#FF6B1A" opacity="0.18"/>`;

export const RESOLUTION_GROUP_IDS = ["rest-waves", "ground", "seal-ghost", "seal-arc", "seal-ticks", "seal-weld", "approach", "packet", "impact", "core", "residue"];

// --- AJOUT MANUEL (2026-08-05) ---
// Fond compose + vignette finale, hors de tout <g id>, ignores par l'extraction auto.
export const RESOLUTION_BG = `<rect x="0" y="0" width="960" height="1080" fill="#0B1F3A"/>
<rect x="0" y="0" width="960" height="1080" fill="url(#bgSeal)"/>
<rect x="0" y="0" width="960" height="1080" fill="url(#bgWarm)"/>`;
export const RESOLUTION_VIGNETTE = `<rect x="0" y="0" width="960" height="1080" fill="url(#vignette)"/>`;
