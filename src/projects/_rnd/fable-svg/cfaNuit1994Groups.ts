// Groupes SVG de la scene "nuit du 12 janvier 1994" (beat 1 / HOOK du franc CFA).
// MATIERE = MIX Fable 5 + Kimi K3 (statique, groupes nommes) ; VIE = animation JSX
// par frame (doctrine SVG-SCENES-GENERATIVES : le LLM fournit la matiere, le code la vie).
//
// MIX-AND-MATCH valide Aziz (2026-07-21) :
//   - Fable B  : ciel + etoiles + LUNE/halo + chambre en coupe (gauche) + dormeur + chevet.
//   - Kimi K3  : les MAISONS (avant + arriere-plan = le parallaxe) + REVEIL a sonnettes
//                (reduit, pose sur la chevet Fable) + PIECE CFA ronde (apparait dans la rue).
//   - Code     : decret vertical + fracture rouge #a8281f (JAMAIS dans la matiere LLM).
//
// PALETTE (encre analytique nocturne) :
//   fond nuit    #16213a / #101a2e / #070d18
//   encre claire #e8dcc0            (trait sur fond sombre)
//   or (chaud)   #b8860b            (fenetres/lune/piece/reveil)
//   ROUGE        #a8281f  <- code seulement, au climax.
//
// CONVENTION : chaque constante = CONTENU INTERNE d'un <g> (sans la balise <g> externe),
// injecte cote React dans un wrapper <g> anime. DEFS separe.

// ---- DEFS (gradients / filtres) : fusion des defs Fable B + Kimi ----
export const NUIT_DEFS = `
  <linearGradient id="grad-ciel" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#141f38"/><stop offset="0.6" stop-color="#1a2842"/><stop offset="1" stop-color="#22304e"/>
  </linearGradient>
  <linearGradient id="grad-sol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1a2842"/><stop offset="1" stop-color="#141f38"/>
  </linearGradient>
  <linearGradient id="grad-cityglow" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0"/><stop offset="1" stop-color="#b8860b" stop-opacity="0.10"/>
  </linearGradient>
  <radialGradient id="grad-halo-lune" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0.32"/><stop offset="0.55" stop-color="#b8860b" stop-opacity="0.10"/><stop offset="1" stop-color="#b8860b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="grad-glow-fenetre" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#b8860b" stop-opacity="0.42"/><stop offset="1" stop-color="#b8860b" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="grad-horloge" cx="0.5" cy="0.45" r="0.6">
    <stop offset="0" stop-color="#1a2440"/><stop offset="1" stop-color="#101a2e"/>
  </radialGradient>
  <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow-lune" x="-120%" y="-120%" width="340%" height="340%">
    <feGaussianBlur stdDeviation="18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="glow-etoile" x="-200%" y="-200%" width="500%" height="500%">
    <feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
`;

// ================= FOND PERMANENT (Fable B) =================

export const NUIT_CIEL = `
  <rect x="0" y="0" width="1920" height="1080" fill="url(#grad-ciel)"/>
  <rect x="0" y="580" width="1920" height="220" fill="url(#grad-cityglow)"/>
`;

// Vrai ciel etoile (retour Aziz : etoiles trop discretes -> beaucoup plus, tailles variees).
// Le code fait scintiller (chaque etoile a une phase differente via l'index cote React,
// ici on pose la matiere + opacites de base plus fortes). Les grosses etoiles ont un glow.
export const NUIT_ETOILES = `
  <g fill="#e8dcc0">
    <circle cx="140" cy="120" r="2.2" opacity="0.95" filter="url(#glow-etoile)"/><circle cx="480" cy="90" r="1.8" opacity="0.85" filter="url(#glow-etoile)"/>
    <circle cx="720" cy="70" r="2.4" opacity="0.95" filter="url(#glow-etoile)"/><circle cx="1245" cy="115" r="2.0" opacity="0.85" filter="url(#glow-etoile)"/>
    <circle cx="990" cy="90" r="1.9" opacity="0.8" filter="url(#glow-etoile)"/><circle cx="1850" cy="120" r="1.8" opacity="0.8" filter="url(#glow-etoile)"/>
    <circle cx="300" cy="180" r="1.5" opacity="0.7"/><circle cx="560" cy="200" r="1.4" opacity="0.65"/>
    <circle cx="90" cy="330" r="1.5" opacity="0.7"/><circle cx="390" cy="380" r="1.6" opacity="0.72"/>
    <circle cx="250" cy="250" r="1.4" opacity="0.6"/><circle cx="640" cy="300" r="1.5" opacity="0.65"/>
    <circle cx="820" cy="150" r="1.3" opacity="0.6"/><circle cx="1080" cy="200" r="1.4" opacity="0.62"/>
    <circle cx="1180" cy="320" r="1.3" opacity="0.55"/><circle cx="1350" cy="240" r="1.5" opacity="0.68"/>
    <circle cx="1470" cy="90" r="1.6" opacity="0.72"/><circle cx="1560" cy="330" r="1.3" opacity="0.55"/>
    <circle cx="1300" cy="420" r="1.3" opacity="0.5"/><circle cx="1680" cy="420" r="1.4" opacity="0.55"/>
    <circle cx="1780" cy="260" r="1.4" opacity="0.6"/><circle cx="200" cy="440" r="1.2" opacity="0.5"/>
    <circle cx="430" cy="150" r="1.2" opacity="0.55"/><circle cx="870" cy="360" r="1.2" opacity="0.5"/>
    <circle cx="1120" cy="420" r="1.1" opacity="0.45"/><circle cx="60" cy="200" r="1.3" opacity="0.55"/>
    <circle cx="700" cy="440" r="1.1" opacity="0.45"/><circle cx="960" cy="300" r="1.2" opacity="0.5"/>
    <circle cx="1420" cy="380" r="1.2" opacity="0.5"/><circle cx="1620" cy="180" r="1.5" opacity="0.68"/>
    <circle cx="360" cy="290" r="1.1" opacity="0.45"/><circle cx="540" cy="420" r="1.1" opacity="0.42"/>
  </g>
`;

// lune Fable B (dorée) + GLOW (retour Aziz). Le code fait pulser le halo.
// Le disque a un filter glow-lune ; le halo radial reste par-dessous.
export const NUIT_LUNE = `
  <circle cx="1630" cy="190" r="150" fill="url(#grad-halo-lune)"/>
  <circle cx="1630" cy="190" r="54" fill="#b8860b" opacity="0.9" filter="url(#glow-lune)"/>
  <circle cx="1630" cy="190" r="54" fill="#e8c86a" opacity="0.95"/>
  <circle cx="1630" cy="190" r="54" fill="none" stroke="#e8dcc0" stroke-width="1.5" opacity="0.5"/>
  <circle cx="1612" cy="176" r="9" fill="#b8860b" opacity="0.28"/><circle cx="1646" cy="208" r="6" fill="#b8860b" opacity="0.24"/>
  <circle cx="1650" cy="168" r="4" fill="#b8860b" opacity="0.2"/>
`;
export const NUIT_LUNE_CX = 1630;
export const NUIT_LUNE_CY = 190;

// ================= MAISONS (Kimi K3 — le parallaxe) =================
// Arriere-plan : skyline enrichie facon Fable (retour Aziz : s'inspirer des batiments
// arriere-plan de Fable pour la densite + points-lumieres PLUS LUMINEUX comme des fenetres).
// Silhouettes lointaines etagees + petites fenetres chaudes qui brillent (glow).
export const NUIT_VILLE_LOINTAINE = `
  <g fill="#0e1830" stroke="#3a4a6a" stroke-width="1" stroke-opacity="0.35">
    <rect x="40" y="510" width="90" height="90"/><rect x="150" y="540" width="70" height="60"/>
    <rect x="250" y="500" width="110" height="100"/><rect x="380" y="535" width="80" height="65"/>
    <rect x="490" y="520" width="130" height="80"/><rect x="650" y="545" width="90" height="55"/>
    <rect x="760" y="505" width="100" height="95"/><rect x="890" y="535" width="120" height="65"/>
    <rect x="1040" y="518" width="80" height="82"/><rect x="1150" y="500" width="110" height="100"/>
    <rect x="1290" y="540" width="130" height="60"/><rect x="1450" y="515" width="90" height="85"/>
    <rect x="1570" y="530" width="120" height="70"/><rect x="1720" y="505" width="100" height="95"/>
    <rect x="1850" y="540" width="70" height="60"/>
  </g>
  <g fill="#b8860b">
    <rect x="70" y="540" width="8" height="10" opacity="0.75"/><rect x="285" y="530" width="8" height="10" opacity="0.7"/>
    <rect x="315" y="555" width="8" height="10" opacity="0.6"/><rect x="530" y="545" width="8" height="10" opacity="0.75"/>
    <rect x="575" y="560" width="8" height="10" opacity="0.65"/><rect x="790" y="535" width="8" height="10" opacity="0.7"/>
    <rect x="930" y="558" width="8" height="10" opacity="0.6"/><rect x="1070" y="545" width="8" height="10" opacity="0.7"/>
    <rect x="1185" y="530" width="8" height="10" opacity="0.75"/><rect x="1225" y="558" width="8" height="10" opacity="0.6"/>
    <rect x="1330" y="562" width="8" height="10" opacity="0.6"/><rect x="1485" y="545" width="8" height="10" opacity="0.72"/>
    <rect x="1610" y="555" width="8" height="10" opacity="0.65"/><rect x="1755" y="535" width="8" height="10" opacity="0.7"/>
  </g>
`;

// sol
export const NUIT_SOL = `<rect x="0" y="880" width="1920" height="200" fill="url(#grad-sol)"/>`;

// Maisons de premier plan (Kimi). Chacune : corps + ligne de toit. Traits pour traçage.
// On garde les maisons de Kimi MAIS on decale a droite pour laisser la place a la chambre
// Fable (a gauche, x 120-720). Maisons Kimi de x=760 a x=1920.
export const NUIT_MAISONS = `
  <g id="m2" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="760" y="590" width="200" height="290"/>
    <rect x="800" y="548" width="60" height="42" rx="6" fill="#101a2e"/>
  </g>
  <g id="m3" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="1000" y="655" width="180" height="225"/>
  </g>
  <g id="m4" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="1220" y="605" width="220" height="275"/>
    <line x1="1330" y1="605" x2="1330" y2="545" stroke="#e8dcc0" stroke-width="1.5" stroke-opacity="0.5"/>
    <line x1="1312" y1="560" x2="1348" y2="560" stroke="#e8dcc0" stroke-width="1" stroke-opacity="0.4"/>
  </g>
  <g id="m5" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="1480" y="650" width="200" height="230"/>
  </g>
  <g id="m6" fill="#1c2a48" stroke="#e8dcc0" stroke-width="2" stroke-opacity="0.72">
    <rect x="1720" y="595" width="200" height="285"/>
  </g>
`;

// ================= CHAMBRE EN COUPE (Fable B — a gauche) =================
export const NUIT_CHAMBRE = `
  <ellipse cx="470" cy="954" rx="300" ry="10" fill="#070d18" opacity="0.6"/>
  <rect x="200" y="470" width="540" height="480" fill="#101b31" stroke="#e8dcc0" stroke-width="3"/>
  <rect x="200" y="470" width="540" height="34" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="200" y="504" width="36" height="446" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="704" y="504" width="36" height="446" fill="#1b2a4a" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="236" y="504" width="468" height="446" fill="#0d1830"/>
  <rect x="236" y="880" width="468" height="70" fill="#0b1424"/>
  <line x1="236" y1="880" x2="704" y2="880" stroke="#e8dcc0" stroke-width="2" opacity="0.7"/>
  <rect x="275" y="560" width="80" height="90" fill="#0a1322" stroke="#e8dcc0" stroke-width="2"/>
`;

// lit (Fable B)
export const NUIT_LIT = `
  <rect x="270" y="830" width="300" height="34" fill="#12203c" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="274" y="800" width="292" height="30" rx="8" fill="#16274a" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="588" y="800" width="124" height="12" rx="3" fill="#12203c" stroke="#e8dcc0" stroke-width="2"/>
  <rect x="596" y="812" width="8" height="68" fill="#12203c" stroke="#e8dcc0" stroke-width="1.5"/>
  <rect x="696" y="812" width="8" height="68" fill="#12203c" stroke="#e8dcc0" stroke-width="1.5"/>
`;

// dormeur (Fable B — sur le cote, tete + oreiller + z z)
export const NUIT_DORMEUR = `
  <path d="M 284 800 C 300 792 312 788 330 782 C 352 774 362 762 384 758 C 402 755 414 766 432 766 C 450 766 462 752 480 750 C 496 749 505 762 508 778 C 509 788 509 795 509 800 Z" fill="#0f1c36" stroke="#e8dcc0" stroke-width="2"/>
  <path d="M 380 800 C 384 786 388 774 398 764" fill="none" stroke="#e8dcc0" stroke-width="1.2" opacity="0.3"/>
  <path d="M 450 800 C 452 788 456 776 466 762" fill="none" stroke="#e8dcc0" stroke-width="1.2" opacity="0.3"/>
  <rect x="488" y="778" width="72" height="26" rx="12" fill="#101d38" stroke="#e8dcc0" stroke-width="2"/>
  <circle cx="524" cy="774" r="19" fill="#0f1c36" stroke="#e8dcc0" stroke-width="2"/>
  <path d="M 512 779 Q 516 782 520 780" fill="none" stroke="#e8dcc0" stroke-width="1.5" stroke-linecap="round"/>
`;
// les "z" du sommeil sont animes en code (montent + fade) : positions de depart
export const NUIT_Z_BASE = { x: 556, y: 742 };

// ================= REVEIL a sonnettes (Kimi — reduit, sur la chevet Fable) =================
// Kimi l'avait dessine centre en (475, 830), rayon cadran 82. On l'injecte dans un wrapper
// que le code place + met a l'echelle (reduit) sur la table de chevet Fable (~x 630, y 770).
// Le contenu ci-dessous est CENTRE sur (0,0) pour un placement/scale propres par le code.
export const NUIT_REVEIL_CADRAN_R = 82;
export const NUIT_REVEIL = `
  <path d="M-60 -60 Q-75 -85 -50 -95" fill="none" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <path d="M60 -60 Q75 -85 50 -95" fill="none" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <line x1="0" y1="-88" x2="0" y2="-102" stroke="#e8dcc0" stroke-width="3" stroke-opacity="0.85"/>
  <circle cx="0" cy="-106" r="5" fill="#e8dcc0" opacity="0.85"/>
  <line x1="-45" y1="70" x2="-57" y2="110" stroke="#e8dcc0" stroke-width="4" stroke-opacity="0.85"/>
  <line x1="45" y1="70" x2="57" y2="110" stroke="#e8dcc0" stroke-width="4" stroke-opacity="0.85"/>
  <circle cx="0" cy="0" r="82" fill="url(#grad-horloge)" stroke="#e8dcc0" stroke-width="3.5"/>
  <circle cx="0" cy="0" r="70" fill="none" stroke="#e8dcc0" stroke-width="1" stroke-opacity="0.35"/>
  <g stroke="#e8dcc0" stroke-width="2.5" stroke-opacity="0.8">
    <line x1="0" y1="-68" x2="0" y2="-54"/><line x1="0" y1="54" x2="0" y2="68"/>
    <line x1="-68" y1="0" x2="-54" y2="0"/><line x1="54" y1="0" x2="68" y2="0"/>
  </g>
  <text x="0" y="44" text-anchor="middle" font-family="Georgia, serif" font-size="17" fill="#b8860b" opacity="0.9">00:00</text>
`;
// aiguilles = animees en code (tremblent legerement puis figent minuit) — dessinees a part.

// ================= PIECE CFA (Kimi — apparait dans la rue au mot "franc CFA") =================
// Kimi l'avait en (1535, 845) r=92. On la re-centre sur (0,0) pour placement/fracture propres.
// Le code : contour luisant (stroke-dashoffset dore) qui se trace, puis la fend au climax.
export const NUIT_PIECE_R = 92;
export const NUIT_PIECE_CX = 1050; // dans la rue, entre 2 maisons Kimi
export const NUIT_PIECE_CY = 820;
// contenu CENTRE (0,0). Le contour exterieur (le cercle r=92) est dessine A PART par le code
// pour le traçage lumineux ; ici l'interieur (stries, CFA, cercles internes).
export const NUIT_PIECE_INTERIEUR = `
  <circle cx="0" cy="0" r="76" fill="#101a2e"/>
  <circle cx="0" cy="0" r="76" fill="none" stroke="#b8860b" stroke-width="1.5" stroke-opacity="0.7"/>
  <g stroke="#b8860b" stroke-width="1.5" stroke-opacity="0.6">
    <line x1="0" y1="-92" x2="0" y2="-79"/><line x1="46" y1="-80" x2="39" y2="-68"/>
    <line x1="80" y1="-46" x2="69" y2="-39"/><line x1="92" y1="0" x2="79" y2="0"/>
    <line x1="80" y1="46" x2="69" y2="39"/><line x1="46" y1="80" x2="39" y2="68"/>
    <line x1="0" y1="92" x2="0" y2="79"/><line x1="-46" y1="80" x2="-39" y2="68"/>
    <line x1="-80" y1="46" x2="-69" y2="39"/><line x1="-92" y1="0" x2="-79" y2="0"/>
    <line x1="-80" y1="-46" x2="-69" y2="-39"/><line x1="-46" y1="-80" x2="-39" y2="-68"/>
  </g>
  <text x="0" y="13" text-anchor="middle" font-family="Georgia, serif" font-size="40" letter-spacing="3" fill="#b8860b">CFA</text>
  <path d="M-40 40 Q0 53 40 40" fill="none" stroke="#b8860b" stroke-width="1.5" stroke-opacity="0.6"/>
  <path d="M-40 -39 Q0 -52 40 -39" fill="none" stroke="#b8860b" stroke-width="1.5" stroke-opacity="0.6"/>
`;

// ================= ancrages code =================
export const NUIT_DECRET_X = NUIT_PIECE_CX; // le decret frappe la piece
