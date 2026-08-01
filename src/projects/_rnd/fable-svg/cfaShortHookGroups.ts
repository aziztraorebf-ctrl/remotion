// Groupes SVG vertical (1080x1920) pour CfaShortHook9x16 — recomposition spatiale de
// cfaNuit1994Groups.ts (16:9 -> 9:16). MEME matiere/couleurs/logique, DISPOSITION differente :
// le hook vertical empile CIEL (haut) -> VILLE/CHAMBRE (bande compacte) -> PIECE CFA (dominante,
// centree, climax visuel du hook, grande car sur mobile c'est LE plan qui doit porter le choc).
//
// Convention identique au fichier source : chaque export = CONTENU INTERNE d'un <g>, sans la
// balise <g> externe (injecte via dangerouslySetInnerHTML cote React).

export const HOOK_DEFS = `
  <linearGradient id="h-grad-ciel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#141f38"/><stop offset="0.6" stop-color="#1a2842"/><stop offset="1" stop-color="#22304e"/>
  </linearGradient>
  <linearGradient id="h-grad-sol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1a2842"/><stop offset="1" stop-color="#141f38"/>
  </linearGradient>
  <linearGradient id="h-grad-cityglow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0"/><stop offset="1" stop-color="#b8860b" stop-opacity="0.10"/>
  </linearGradient>
  <radialGradient id="h-grad-halo-lune" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0.32"/><stop offset="0.55" stop-color="#b8860b" stop-opacity="0.10"/><stop offset="1" stop-color="#b8860b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="h-grad-glow-fenetre" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0.42"/><stop offset="1" stop-color="#b8860b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="h-grad-horloge" cx="0.5" cy="0.45" r="0.6">
    <stop offset="0" stop-color="#1a2440"/><stop offset="1" stop-color="#101a2e"/>
  </radialGradient>
  <filter id="h-glow" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="h-glow-lune" x="-120%" y="-120%" width="340%" height="340%">
    <feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="h-glow-etoile" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
`;

// ================= CIEL (bande haute, 0-420) =================
export const HOOK_CIEL = `
  <rect x="0" y="0" width="1080" height="1920" fill="url(#h-grad-ciel)"/>
  <rect x="0" y="330" width="1080" height="120" fill="url(#h-grad-cityglow)"/>
`;

// Etoiles reparties sur toute la largeur 1080, concentrees dans la bande ciel (0-380).
export const HOOK_ETOILES = `
  <g fill="#e8dcc0">
    <circle cx="80" cy="60" r="2.2" opacity="0.95" filter="url(#h-glow-etoile)"/><circle cx="270" cy="45" r="1.8" opacity="0.85" filter="url(#h-glow-etoile)"/>
    <circle cx="410" cy="35" r="2.4" opacity="0.95" filter="url(#h-glow-etoile)"/><circle cx="700" cy="58" r="2.0" opacity="0.85" filter="url(#h-glow-etoile)"/>
    <circle cx="560" cy="45" r="1.9" opacity="0.8" filter="url(#h-glow-etoile)"/><circle cx="1040" cy="60" r="1.8" opacity="0.8" filter="url(#h-glow-etoile)"/>
    <circle cx="170" cy="90" r="1.5" opacity="0.7"/><circle cx="320" cy="100" r="1.4" opacity="0.65"/>
    <circle cx="50" cy="165" r="1.5" opacity="0.7"/><circle cx="220" cy="190" r="1.6" opacity="0.72"/>
    <circle cx="140" cy="125" r="1.4" opacity="0.6"/><circle cx="360" cy="150" r="1.5" opacity="0.65"/>
    <circle cx="460" cy="75" r="1.3" opacity="0.6"/><circle cx="610" cy="100" r="1.4" opacity="0.62"/>
    <circle cx="660" cy="160" r="1.3" opacity="0.55"/><circle cx="760" cy="120" r="1.5" opacity="0.68"/>
    <circle cx="830" cy="45" r="1.6" opacity="0.72"/><circle cx="880" cy="165" r="1.3" opacity="0.55"/>
    <circle cx="730" cy="210" r="1.3" opacity="0.5"/><circle cx="950" cy="210" r="1.4" opacity="0.55"/>
    <circle cx="1000" cy="130" r="1.4" opacity="0.6"/><circle cx="115" cy="220" r="1.2" opacity="0.5"/>
    <circle cx="240" cy="75" r="1.2" opacity="0.55"/><circle cx="490" cy="180" r="1.2" opacity="0.5"/>
    <circle cx="630" cy="210" r="1.1" opacity="0.45"/><circle cx="35" cy="100" r="1.3" opacity="0.55"/>
    <circle cx="395" cy="220" r="1.1" opacity="0.45"/><circle cx="540" cy="150" r="1.2" opacity="0.5"/>
    <circle cx="800" cy="190" r="1.2" opacity="0.5"/><circle cx="915" cy="90" r="1.5" opacity="0.68"/>
    <circle cx="200" cy="145" r="1.1" opacity="0.45"/><circle cx="305" cy="210" r="1.1" opacity="0.42"/>
  </g>
`;

// Lune deplacee en haut a droite du cadre vertical, meme rayon/style.
export const HOOK_LUNE = `
  <circle cx="900" cy="150" r="150" fill="url(#h-grad-halo-lune)"/>
  <circle cx="900" cy="150" r="54" fill="#b8860b" opacity="0.9" filter="url(#h-glow-lune)"/>
  <circle cx="900" cy="150" r="54" fill="#e8c86a" opacity="0.95"/>
  <circle cx="900" cy="150" r="54" fill="none" stroke="#e8dcc0" stroke-width="1.5" opacity="0.5"/>
  <circle cx="882" cy="136" r="9" fill="#b8860b" opacity="0.28"/><circle cx="916" cy="168" r="6" fill="#b8860b" opacity="0.24"/>
  <circle cx="920" cy="128" r="4" fill="#b8860b" opacity="0.2"/>
`;
export const HOOK_LUNE_CX = 900;
export const HOOK_LUNE_CY = 150;

// ================= VILLE LOINTAINE (bande skyline compacte, 420-560) =================
// Skyline etagee sur toute la largeur, hauteurs reduites vs l'original pour tenir en bande basse.
export const HOOK_VILLE_LOINTAINE = `
  <g fill="#0e1830" stroke="#3a4a6a" stroke-width="1" stroke-opacity="0.35">
    <rect x="20" y="480" width="55" height="80"/><rect x="90" y="500" width="42" height="60"/>
    <rect x="150" y="470" width="65" height="90"/><rect x="230" y="505" width="48" height="55"/>
    <rect x="295" y="490" width="78" height="70"/><rect x="390" y="510" width="54" height="50"/>
    <rect x="455" y="475" width="60" height="85"/><rect x="530" y="505" width="72" height="55"/>
    <rect x="620" y="488" width="48" height="72"/><rect x="685" y="470" width="66" height="90"/>
    <rect x="770" y="510" width="78" height="50"/><rect x="865" y="485" width="54" height="75"/>
    <rect x="935" y="500" width="72" height="60"/><rect x="1020" y="475" width="55" height="85"/>
  </g>
  <g fill="#b8860b">
    <rect x="42" y="505" width="6" height="8" opacity="0.75"/><rect x="170" y="497" width="6" height="8" opacity="0.7"/>
    <rect x="188" y="513" width="6" height="8" opacity="0.6"/><rect x="317" y="503" width="6" height="8" opacity="0.75"/>
    <rect x="345" y="518" width="6" height="8" opacity="0.65"/><rect x="475" y="497" width="6" height="8" opacity="0.7"/>
    <rect x="555" y="516" width="6" height="8" opacity="0.6"/><rect x="638" y="503" width="6" height="8" opacity="0.7"/>
    <rect x="705" y="493" width="6" height="8" opacity="0.75"/><rect x="790" y="518" width="6" height="8" opacity="0.6"/>
    <rect x="885" y="502" width="6" height="8" opacity="0.6"/><rect x="955" y="516" width="6" height="8" opacity="0.72"/>
    <rect x="1035" y="497" width="6" height="8" opacity="0.65"/>
  </g>
`;

// sol
export const HOOK_SOL = `<rect x="0" y="1780" width="1080" height="140" fill="url(#h-grad-sol)"/>`;

// Maisons de premier plan (Kimi), reduites et etalees sur toute la largeur (bande 600-880).
export const HOOK_MAISONS = `
  <g id="hm2" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="30" y="700" width="130" height="180"/>
    <rect x="55" y="672" width="40" height="28" rx="4" fill="#101a2e"/>
  </g>
  <g id="hm3" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="195" y="745" width="115" height="135"/>
  </g>
  <g id="hm4" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="345" y="715" width="140" height="165"/>
    <line x1="415" y1="715" x2="415" y2="675" stroke="#e8dcc0" stroke-width="1.5" stroke-opacity="0.5"/>
    <line x1="403" y1="686" x2="427" y2="686" stroke="#e8dcc0" stroke-width="1" stroke-opacity="0.4"/>
  </g>
  <g id="hm5" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="560" y="742" width="127" height="138"/>
  </g>
  <g id="hm6" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="720" y="705" width="130" height="175"/>
  </g>
  <g id="hm7" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="890" y="740" width="150" height="140"/>
  </g>
`;

// ================= CHAMBRE EN COUPE (bande compacte au-dessus des maisons, 560-870) =================
// Recompose : chambre reduite (echelle ~0.7), centree horizontalement, posee juste sous la ville.
export const HOOK_CHAMBRE = `
  <ellipse cx="540" cy="866" rx="230" ry="8" fill="#070d18" opacity="0.6"/>
  <rect x="330" y="590" width="420" height="280" fill="#101b31" stroke="#e8dcc0" stroke-width="3"/>
  <rect x="330" y="590" width="420" height="26" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="330" y="616" width="28" height="254" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="722" y="616" width="28" height="254" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="358" y="616" width="364" height="254" fill="#0d1830"/>
  <rect x="358" y="800" width="364" height="70" fill="#0b1424"/>
  <line x1="358" y1="800" x2="722" y2="800" stroke="#e8dcc0" stroke-width="2" opacity="0.7"/>
  <rect x="385" y="650" width="62" height="70" fill="#0a1322" stroke="#e8dcc0" stroke-width="2"/>
`;

// lit (echelle 0.7 vs original, centre sous la fenetre gauche de la chambre)
export const HOOK_LIT = `
  <rect x="400" y="800" width="210" height="24" fill="#12203c" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="403" y="778" width="204" height="21" rx="6" fill="#16274a" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="612" y="778" width="87" height="8" rx="3" fill="#12203c" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="618" y="787" width="6" height="48" fill="#12203c" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="688" y="787" width="6" height="48" fill="#12203c" stroke="#e8dcc0" stroke-width="1.5"/>
`;

// dormeur (echelle ~0.7, tete + oreiller + z base)
export const HOOK_DORMEUR = `
  <path d="M 410 778 C 421 772 429 769 442 765 C 457 759 464 750 480 747 C 492 745 500 753 512 753 C 524 753 532 743 544 742 C 555 741 561 750 563 761 C 564 768 564 773 564 778 Z" fill="#0f1c36" stroke="#e8dcc0" stroke-width="2"/>
  <path d="M 496 778 C 499 768 502 759 509 752" fill="none" stroke="#e8dcc0" stroke-width="1.2" opacity="0.3"/>
  <path d="M 545 778 C 546 769 549 760 556 750" fill="none" stroke="#e8dcc0" stroke-width="1.2" opacity="0.3"/>
  <rect x="562" y="761" width="50" height="18" rx="9" fill="#101d38" stroke="#e8dcc0" stroke-width="2"/>
  <circle cx="587" cy="758" r="13" fill="#0f1c36" stroke="#e8dcc0" stroke-width="2"/>
  <path d="M 579 761 Q 582 763 585 762" fill="none" stroke="#e8dcc0" stroke-width="1.5" stroke-linecap="round"/>
`;
export const HOOK_Z_BASE = { x: 605, y: 733 };

// ================= REVEIL (echelle appliquee cote React, contenu identique centre 0,0) =================
export const HOOK_REVEIL_CADRAN_R = 82;
export const HOOK_REVEIL = `
  <path d="M-60 -60 Q-75 -85 -50 -95" fill="none" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <path d="M60 -60 Q75 -85 50 -95" fill="none" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <line x1="0" y1="-88" x2="0" y2="-102" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <circle cx="0" cy="-106" r="5" fill="#e8dcc0" opacity="0.85"/>
  <line x1="-45" y1="70" x2="-57" y2="110" stroke="#e8dcc0" stroke-width="4" stroke-opacity="0.85"/>
  <line x1="45" y1="70" x2="57" y2="110" stroke="#e8dcc0" stroke-width="4" stroke-opacity="0.85"/>
  <circle cx="0" cy="0" r="82" fill="url(#h-grad-horloge)" stroke="#e8dcc0" stroke-width="3.5"/>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#e8dcc0" stroke-width="1" stroke-opacity="0.35"/>
  <g stroke="#e8dcc0" stroke-width="2.5" stroke-opacity="0.8">
    <line x1="0" y1="-68" x2="0" y2="-54"/><line x1="0" y1="54" x2="0" y2="68"/>
    <line x1="-68" y1="0" x2="-54" y2="0"/><line x1="54" y1="0" x2="68" y2="0"/>
  </g>
  <text x="0" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#b8860b" opacity="0.9">00:00</text>
`;

// ================= PIECE CFA — DOMINANTE, grande et centree (climax visuel du hook) =================
// Rayon AGRANDI vs l'original (92 -> 150) : sur mobile, cet element doit dominer l'ecran.
// Centree horizontalement (x=540), posee dans la zone basse/centrale du cadre (y=1280).
export const HOOK_PIECE_R = 150;
export const HOOK_PIECE_CX = 540;
export const HOOK_PIECE_CY = 1280;
export const HOOK_PIECE_INTERIEUR = `
  <circle cx="0" cy="0" r="124" fill="#101a2e"/>
  <circle cx="0" cy="0" r="124" fill="none" stroke="#b8860b" stroke-width="2.4" stroke-opacity="0.7"/>
  <g stroke="#b8860b" stroke-width="2.4" stroke-opacity="0.6">
    <line x1="0" y1="-150" x2="0" y2="-129"/><line x1="75" y1="-130" x2="64" y2="-111"/>
    <line x1="130" y1="-75" x2="112" y2="-64"/><line x1="150" y1="0" x2="129" y2="0"/>
    <line x1="130" y1="75" x2="112" y2="64"/><line x1="75" y1="130" x2="64" y2="111"/>
    <line x1="0" y1="150" x2="0" y2="129"/><line x1="-75" y1="130" x2="-64" y2="111"/>
    <line x1="-130" y1="75" x2="-112" y2="64"/><line x1="-150" y1="0" x2="-129" y2="0"/>
    <line x1="-130" y1="-75" x2="-112" y2="-64"/><line x1="-75" y1="-130" x2="-64" y2="-111"/>
  </g>
  <text x="0" y="21" text-anchor="middle" font-family="Georgia, serif" font-size="65" letter-spacing="5" fill="#b8860b">CFA</text>
  <path d="M-65 65 Q0 86 65 65" fill="none" stroke="#b8860b" stroke-width="2.4" stroke-opacity="0.6"/>
  <path d="M-65 -63 Q0 -84 65 -63" fill="none" stroke="#b8860b" stroke-width="2.4" stroke-opacity="0.6"/>
`;

// ================= ancrages code =================
export const HOOK_DECRET_X = HOOK_PIECE_CX; // le decret frappe la piece, verticalement (inchange : deja le sens naturel en vertical)
