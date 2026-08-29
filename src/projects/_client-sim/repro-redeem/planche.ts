// GENERE — ne pas editer a la main.
// Source de verite : `assets/planche-ui.svg`, dessine par l'agent svg-dessinateur.
// Regenerer : `python3 assets/extraire-groupes.py`
//
// ⛔ Le TSX ne redessine JAMAIS ces formes : il les PILOTE. C'est la regle n°0
// (le modele dessine le statique, NOUS animons) — et l'erreur deja payee une fois
// dans ce dossier meme.

export const DEFS = `<linearGradient id="grad-medaille-couronne" x1="400" y1="131.5" x2="400" y2="320.5" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#e6aa0f"/>
      <stop offset="0.18" stop-color="#fee22f"/>
      <stop offset="0.35" stop-color="#feda49"/>
      <stop offset="0.55" stop-color="#ba5336"/>
      <stop offset="0.72" stop-color="#a74d6f"/>
      <stop offset="0.88" stop-color="#ffb8b3"/>
      <stop offset="1" stop-color="#ffb4be"/>
    </linearGradient>
    <linearGradient id="grad-medaille-fond" x1="400" y1="150" x2="400" y2="302" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#edc357"/>
      <stop offset="0.18" stop-color="#ffeb6d"/>
      <stop offset="0.35" stop-color="#ffe580"/>
      <stop offset="0.55" stop-color="#cf8772"/>
      <stop offset="0.72" stop-color="#c1829a"/>
      <stop offset="0.88" stop-color="#ffcdca"/>
      <stop offset="1" stop-color="#ffcad2"/>
    </linearGradient>
    <linearGradient id="grad-medaille-etoile" x1="400" y1="178" x2="400" y2="282" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#b05053"/>
      <stop offset="1" stop-color="#ffb4be"/>
    </linearGradient>
    <linearGradient id="grad-bouton-redeem" x1="268" y1="486" x2="532" y2="486" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f97ca6"/>
      <stop offset="0.5" stop-color="#f9946f"/>
      <stop offset="1" stop-color="#fbaf68"/>
    </linearGradient>
    <linearGradient id="grad-gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="grad-pilule-menu" x1="289" y1="0" x2="511" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#799dff"/>
      <stop offset="0.3" stop-color="#9e94ff"/>
      <stop offset="0.5" stop-color="#aa91ff"/>
      <stop offset="0.75" stop-color="#c38cff"/>
      <stop offset="1" stop-color="#cf89ff"/>
    </linearGradient>
    <linearGradient id="grad-pilule-menu-survol" x1="289" y1="0" x2="511" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#c3d2ff"/>
      <stop offset="0.3" stop-color="#d6d1ff"/>
      <stop offset="0.5" stop-color="#dcd0ff"/>
      <stop offset="0.75" stop-color="#e6ceff"/>
      <stop offset="1" stop-color="#ebcdff"/>
    </linearGradient>
    <linearGradient id="grad-boite-cadeau" x1="0" y1="223" x2="0" y2="273" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#d3a0fa"/>
      <stop offset="1" stop-color="#b273ef"/>
    </linearGradient>
    <linearGradient id="grad-couvercle-cadeau" x1="0" y1="205" x2="0" y2="227" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ddb1fc"/>
      <stop offset="1" stop-color="#c888f8"/>
    </linearGradient>
    <linearGradient id="grad-billet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a3d69a"/>
      <stop offset="1" stop-color="#79bd6f"/>
    </linearGradient>
    <radialGradient id="grad-piece" cx="0.38" cy="0.32" r="0.85">
      <stop offset="0" stop-color="#ffeaa4"/>
      <stop offset="0.55" stop-color="#f8c33a"/>
      <stop offset="1" stop-color="#dd9414"/>
    </radialGradient>`;

export const COCHE_VALIDATION = `<g id="coche-cercle">
      <path d="M 483.47 295.49 A 85.5 85.5 0 1 1 418.51 230.53" fill="none" stroke="#6898f8" stroke-width="19" stroke-linecap="round"/>
    </g>
    <g id="coche-marque">
      <path d="M 356 316 L 392 352 L 452 276" fill="none" stroke="#6898f8" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>
    </g>`;

export const MEDAILLE = `<g id="medaille-ombre">
      <path d="M 400 140 A 14.9 14.9 0 0 1 426.58 144.21 A 14.9 14.9 0 0 1 450.55 156.42 A 14.9 14.9 0 0 1 469.58 175.45 A 14.9 14.9 0 0 1 481.79 199.42 A 14.9 14.9 0 0 1 486 226 A 14.9 14.9 0 0 1 481.79 252.58 A 14.9 14.9 0 0 1 469.58 276.55 A 14.9 14.9 0 0 1 450.55 295.58 A 14.9 14.9 0 0 1 426.58 307.79 A 14.9 14.9 0 0 1 400 312 A 14.9 14.9 0 0 1 373.42 307.79 A 14.9 14.9 0 0 1 349.45 295.58 A 14.9 14.9 0 0 1 330.42 276.55 A 14.9 14.9 0 0 1 318.21 252.58 A 14.9 14.9 0 0 1 314 226 A 14.9 14.9 0 0 1 318.21 199.42 A 14.9 14.9 0 0 1 330.42 175.45 A 14.9 14.9 0 0 1 349.45 156.42 A 14.9 14.9 0 0 1 373.42 144.21 A 14.9 14.9 0 0 1 400 140 Z" transform="translate(0 8)" fill="#3b2a4a" opacity="0.08"/>
    </g>
    <g id="medaille-couronne">
      <path d="M 400 140 A 14.9 14.9 0 0 1 426.58 144.21 A 14.9 14.9 0 0 1 450.55 156.42 A 14.9 14.9 0 0 1 469.58 175.45 A 14.9 14.9 0 0 1 481.79 199.42 A 14.9 14.9 0 0 1 486 226 A 14.9 14.9 0 0 1 481.79 252.58 A 14.9 14.9 0 0 1 469.58 276.55 A 14.9 14.9 0 0 1 450.55 295.58 A 14.9 14.9 0 0 1 426.58 307.79 A 14.9 14.9 0 0 1 400 312 A 14.9 14.9 0 0 1 373.42 307.79 A 14.9 14.9 0 0 1 349.45 295.58 A 14.9 14.9 0 0 1 330.42 276.55 A 14.9 14.9 0 0 1 318.21 252.58 A 14.9 14.9 0 0 1 314 226 A 14.9 14.9 0 0 1 318.21 199.42 A 14.9 14.9 0 0 1 330.42 175.45 A 14.9 14.9 0 0 1 349.45 156.42 A 14.9 14.9 0 0 1 373.42 144.21 A 14.9 14.9 0 0 1 400 140 Z" fill="url(#grad-medaille-couronne)"/>
    </g>
    <g id="medaille-fond">
      <circle cx="400" cy="226" r="76" fill="url(#grad-medaille-fond)"/>
      <circle cx="400" cy="226" r="76" fill="none" stroke="#ffffff" stroke-opacity="0.4" stroke-width="2.5"/>
    </g>
    <g id="medaille-etoile">
      <path d="M 400 186 L 411.17 214.63 L 441.85 216.4 L 418.07 235.87 L 425.86 265.6 L 400 249 L 374.14 265.6 L 381.93 235.87 L 358.15 216.4 L 388.83 214.63 Z" fill="url(#grad-medaille-etoile)" stroke="url(#grad-medaille-etoile)" stroke-width="16" stroke-linejoin="round"/>
    </g>`;

export const VIGNETTE_GIFTCARD = `<g id="vignette-giftcard-carte">
      <rect x="340" y="149" width="124" height="170" rx="16" fill="#4a3d6b" opacity="0.09"/>
      <rect x="290" y="143" width="220" height="168" rx="18" fill="#ffffff" stroke="#d9d4f0" stroke-width="3"/>
    </g>
    <g id="vignette-giftcard-cadeau">
      <g id="cadeau-boite">
        <rect x="368" y="225" width="64" height="48" rx="6" fill="url(#grad-boite-cadeau)"/>
        <rect x="362" y="207" width="76" height="20" rx="7" fill="url(#grad-couvercle-cadeau)"/>
      </g>
      <g id="cadeau-ruban">
        <rect x="393" y="207" width="14" height="66" rx="4" fill="#f9a8d4"/>
        <rect x="368" y="242" width="64" height="13" rx="4" fill="#f9a8d4"/>
        <rect x="393" y="242" width="14" height="13" fill="#f48cc3"/>
      </g>
      <g id="cadeau-noeud">
        <path d="M 400 201 C 388 188 370 188 369 197 C 368 205 385 207 400 201 Z" fill="#f9a8d4" stroke="#ee85bd" stroke-width="2" stroke-linejoin="round"/>
        <path d="M 400 201 C 412 188 430 188 431 197 C 432 205 415 207 400 201 Z" fill="#f9a8d4" stroke="#ee85bd" stroke-width="2" stroke-linejoin="round"/>
        <circle cx="400" cy="201" r="6.5" fill="#f7bede" stroke="#ee85bd" stroke-width="2"/>
      </g>
    </g>`;

export const VIGNETTE_CASH = `<g id="vignette-cash-carte">
      <rect x="340" y="401" width="124" height="170" rx="16" fill="#4a3d6b" opacity="0.09"/>
      <rect x="290" y="395" width="220" height="168" rx="18" fill="#ffffff" stroke="#d9d4f0" stroke-width="3"/>
    </g>
    <g id="vignette-cash-billets">
      <g transform="rotate(-14 396 476)">
        <rect x="359" y="455" width="74" height="42" rx="5" fill="url(#grad-billet)" stroke="#5ea757" stroke-width="1.5"/>
      </g>
      <g transform="rotate(-4 399 471)">
        <rect x="362" y="450" width="74" height="42" rx="5" fill="url(#grad-billet)" stroke="#5ea757" stroke-width="1.5"/>
      </g>
      <g transform="rotate(7 398 466)">
        <rect x="361" y="445" width="74" height="42" rx="5" fill="url(#grad-billet)" stroke="#5ea757" stroke-width="1.5"/>
        <rect x="366" y="450" width="64" height="32" rx="4" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.5"/>
        <circle cx="398" cy="466" r="12.5" fill="#6db263"/>
        <text x="398" y="472.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" fill="#ffffff">$</text>
      </g>
    </g>
    <g id="vignette-cash-piece">
      <ellipse cx="438" cy="522" rx="19" ry="6" fill="#3b2a4a" opacity="0.1"/>
      <circle cx="438" cy="508" r="19" fill="url(#grad-piece)"/>
      <circle cx="438" cy="508" r="13.5" fill="none" stroke="#c9881a" stroke-width="2"/>
      <text x="438" y="514.5" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#a86e0c">$</text>
    </g>`;

export const BOUTON_REDEEM = `<g id="bouton-redeem-fond">
      <rect x="276" y="456" width="248" height="74" rx="37" fill="#e0567f" opacity="0.22"/>
      <rect x="268" y="447" width="264" height="78" rx="39" fill="url(#grad-bouton-redeem)"/>
      <rect x="282" y="454" width="236" height="32" rx="16" fill="url(#grad-gloss)"/>
    </g>
    <g id="bouton-redeem-texte">
      <text x="400" y="497" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700" fill="#ffffff" letter-spacing="0.5">Redeem</text>
    </g>`;

export const PILULE_MENU = `<rect x="289" y="-25" width="222" height="50" rx="25" fill="url(#grad-pilule-menu)"/>
    <rect x="297" y="-21" width="206" height="20" rx="10" fill="url(#grad-gloss)"/>`;

export const PILULE_MENU_SURVOL = `<rect x="289" y="-25" width="222" height="50" rx="25" fill="url(#grad-pilule-menu-survol)" stroke="#b9a8ff" stroke-opacity="0.6" stroke-width="1.5"/>`;
