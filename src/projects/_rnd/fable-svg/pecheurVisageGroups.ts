// Groupes SVG du portrait "pecheur-visage" (matiere statique generee par Fable).
// La MATIERE vient du SVG statique ; l'ANIMATION est faite en JSX par frame
// (cf doctrine SVG-SCENES-GENERATIVES : dangerouslySetInnerHTML n'anime pas les
// <g> internes, donc chaque groupe animable est injecte dans un wrapper JSX anime).
// On stocke le CONTENU INTERNE de chaque <g id="..."> (sans la balise <g> externe).
//
// Sous-groupes animes separement : oeil-gauche, oeil-droit (clignement scaleY),
// bouche (parole scaleY), chapeau (micro-mouvement), tete entiere (respiration).
// Le reste de la tete (peau, ombres, nez, sourcils, joues, traits) = statique,
// mais on separe les PATHS DE CONTOUR (fill=none, stroke) pour les tracer au crayon
// en phase 1 (stroke-dasharray + dashoffset anime).

export const PV_DEFS = `
  <radialGradient id="gFond2" cx="0.5" cy="0.42" r="0.9">
    <stop offset="0" stop-color="#f1e6d0"/>
    <stop offset="0.65" stop-color="#e0cfae"/>
    <stop offset="1" stop-color="#c9b28c"/>
  </radialGradient>
  <radialGradient id="gHalo" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#f9efd8" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#f9efd8" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="gVignette" cx="0.5" cy="0.5" r="0.72">
    <stop offset="0" stop-color="#7f6844" stop-opacity="0"/>
    <stop offset="0.72" stop-color="#7f6844" stop-opacity="0"/>
    <stop offset="1" stop-color="#6f5836" stop-opacity="0.42"/>
  </radialGradient>
  <radialGradient id="gPeau" cx="0.42" cy="0.4" r="0.78">
    <stop offset="0" stop-color="#7d4e2c"/>
    <stop offset="0.45" stop-color="#60391f"/>
    <stop offset="0.78" stop-color="#4a2a16"/>
    <stop offset="1" stop-color="#37200f"/>
  </radialGradient>
  <linearGradient id="gCou" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2f1a0c"/>
    <stop offset="0.45" stop-color="#4a2a16"/>
    <stop offset="1" stop-color="#5c371d"/>
  </linearGradient>
  <radialGradient id="gIris" cx="0.4" cy="0.35" r="0.75">
    <stop offset="0" stop-color="#6a3d1c"/>
    <stop offset="0.55" stop-color="#3a1e0e"/>
    <stop offset="1" stop-color="#1c0d05"/>
  </radialGradient>
  <radialGradient id="gOeil" cx="0.5" cy="0.4" r="0.7">
    <stop offset="0" stop-color="#efe3c6"/>
    <stop offset="0.75" stop-color="#e0d2b2"/>
    <stop offset="1" stop-color="#bfae8c"/>
  </radialGradient>
  <linearGradient id="gPailleH" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#dcc088"/>
    <stop offset="0.5" stop-color="#c2a166"/>
    <stop offset="1" stop-color="#8f7244"/>
  </linearGradient>
  <linearGradient id="gPailleV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e0c48c"/>
    <stop offset="0.6" stop-color="#c2a166"/>
    <stop offset="1" stop-color="#a4854f"/>
  </linearGradient>
  <linearGradient id="gChemise" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6f5f43"/>
    <stop offset="1" stop-color="#4d4028"/>
  </linearGradient>
  <filter id="b4" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="b8" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="b14" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
  <clipPath id="clipOG"><path d="M415 497 C426 483,452 479,470 491 C457 505,430 507,415 497 Z"/></clipPath>
  <clipPath id="clipOD"><path d="M552 495 C565 480,596 477,617 490 C601 506,568 508,552 495 Z"/></clipPath>
`;

export const PV_FOND = `
  <rect x="0" y="0" width="1080" height="1080" fill="url(#gFond2)"/>
  <circle cx="540" cy="500" r="430" fill="url(#gHalo)"/>
  <rect x="0" y="0" width="1080" height="1080" fill="url(#gVignette)"/>
`;

// Buste (contient col). Remplissages = fade-in phase 1.
export const PV_BUSTE = `
  <path d="M458 676 C462 760,456 800,444 828 L648 828 C634 796,628 740,634 668 C606 700,556 720,508 724 C488 718,470 700,458 676 Z" fill="url(#gCou)"/>
  <ellipse cx="545" cy="700" rx="98" ry="36" fill="#1d0e05" opacity="0.4" filter="url(#b14)"/>
  <path d="M458 676 C462 760,456 800,444 828" fill="none" stroke="#3a2313" stroke-width="3.5" opacity="0.75" stroke-linecap="round"/>
  <path d="M634 668 C628 740,634 796,648 828" fill="none" stroke="#3a2313" stroke-width="3.5" opacity="0.75" stroke-linecap="round"/>
  <g id="col">
    <path d="M140 1080 C158 952,246 872,368 840 C420 826,448 820,456 812 L470 826 L546 956 L620 824 L636 812 C652 820,690 830,748 850 C866 890,922 968,938 1080 Z" fill="url(#gChemise)" stroke="#3a2313" stroke-width="4" opacity="0.98"/>
    <path d="M472 828 C490 880,520 930,546 952 C572 928,598 878,616 826 Z" fill="url(#gCou)"/>
    <path d="M448 816 L502 852 L466 908 C443 875,435 842,448 816 Z" fill="#5d4e33" stroke="#3a2313" stroke-width="3"/>
    <path d="M644 812 L590 850 L628 906 C651 873,659 840,644 812 Z" fill="#564827" stroke="#3a2313" stroke-width="3"/>
    <path d="M456 826 L494 852 L468 894" fill="none" stroke="#38301c" stroke-width="2" stroke-dasharray="4 5" opacity="0.6"/>
    <path d="M636 822 L598 850 L624 892" fill="none" stroke="#38301c" stroke-width="2" stroke-dasharray="4 5" opacity="0.6"/>
    <path d="M300 898 C320 958,330 1020,332 1080" fill="none" stroke="#2f2718" stroke-width="3" opacity="0.35"/>
    <path d="M780 912 C764 968,758 1030,756 1080" fill="none" stroke="#2f2718" stroke-width="3" opacity="0.35"/>
    <path d="M418 928 C436 972,442 1020,442 1064" fill="none" stroke="#2f2718" stroke-width="2.5" opacity="0.25"/>
    <path d="M664 934 C654 976,650 1022,650 1064" fill="none" stroke="#2f2718" stroke-width="2.5" opacity="0.25"/>
    <ellipse cx="320" cy="900" rx="70" ry="40" fill="#f4e6c8" opacity="0.12" filter="url(#b14)"/>
    <ellipse cx="760" cy="920" rx="66" ry="38" fill="#f4e6c8" opacity="0.08" filter="url(#b14)"/>
  </g>
`;

// --- TETE : sous-blocs pour orchestrer trace (contours) puis fills ---

// Silhouette de peau (fond de la tete) = fill, fade-in.
export const PV_TETE_PEAU = `
  <path d="M392 430 C380 520,398 610,448 672 C472 700,488 718,508 724 C548 722,606 688,638 650 C664 614,674 555,671 470 C669 398,636 326,545 318 C458 312,400 360,392 430 Z" fill="url(#gPeau)"/>
`;

// Oreille + ombres/lumieres de modele = fills, fade-in (apres trace).
export const PV_TETE_MODELE = `
  <path d="M660 478 C682 464,702 478,705 507 C708 540,696 566,676 573 C665 576,658 568,661 553 C652 528,652 500,660 478 Z" fill="#4f2e18" stroke="#3a2313" stroke-width="3.5"/>
  <path d="M672 494 C686 492,694 505,692 523 C690 540,682 551,673 553" fill="none" stroke="#2c180c" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <ellipse cx="654" cy="522" rx="8" ry="34" fill="#241208" opacity="0.3" filter="url(#b4)"/>
  <ellipse cx="648" cy="540" rx="42" ry="130" fill="#2a1610" opacity="0.38" filter="url(#b14)"/>
  <ellipse cx="405" cy="480" rx="20" ry="44" fill="#2a1610" opacity="0.22" filter="url(#b8)"/>
  <ellipse cx="452" cy="612" rx="34" ry="20" fill="#241208" opacity="0.24" filter="url(#b8)"/>
  <ellipse cx="600" cy="612" rx="36" ry="22" fill="#241208" opacity="0.3" filter="url(#b8)"/>
  <ellipse cx="444" cy="486" rx="40" ry="17" fill="#241208" opacity="0.3" filter="url(#b8)"/>
  <ellipse cx="584" cy="484" rx="44" ry="17" fill="#241208" opacity="0.3" filter="url(#b8)"/>
  <ellipse cx="520" cy="520" rx="12" ry="44" fill="#241208" opacity="0.28" filter="url(#b8)"/>
  <ellipse cx="455" cy="545" rx="52" ry="34" fill="#f4e6c8" opacity="0.34" filter="url(#b14)"/>
  <ellipse cx="505" cy="452" rx="62" ry="20" fill="#f4e6c8" opacity="0.16" filter="url(#b14)"/>
  <ellipse cx="497" cy="514" rx="10" ry="32" fill="#f4e6c8" opacity="0.28" filter="url(#b8)"/>
  <ellipse cx="492" cy="552" rx="12" ry="9" fill="#f4e6c8" opacity="0.38" filter="url(#b4)"/>
  <ellipse cx="505" cy="692" rx="30" ry="18" fill="#f4e6c8" opacity="0.2" filter="url(#b8)"/>
  <ellipse cx="600" cy="540" rx="26" ry="40" fill="#f4e6c8" opacity="0.1" filter="url(#b14)"/>
  <path d="M396 374 C450 402,530 412,572 412 C626 410,662 396,672 380 L674 438 C610 460,470 462,398 440 Z" fill="#1d0e05" opacity="0.42" filter="url(#b8)"/>
`;

// Nez (statique, se dessine au trait via son contour propre inclus ici en fills).
export const PV_NEZ = `
  <path d="M506 468 C501 502,497 532,493 554" fill="none" stroke="#33200f" stroke-width="3" opacity="0.65" stroke-linecap="round"/>
  <path d="M493 554 C506 558,517 564,521 574 C523 583,515 588,505 585 C500 583,496 578,494 572" fill="none" stroke="#33200f" stroke-width="3.5" opacity="0.8" stroke-linecap="round"/>
  <path d="M472 566 C465 571,464 579,471 583" fill="none" stroke="#33200f" stroke-width="3" opacity="0.7" stroke-linecap="round"/>
  <ellipse cx="479" cy="577" rx="6" ry="3.5" transform="rotate(-12 479 577)" fill="#170a04" opacity="0.8"/>
  <ellipse cx="511" cy="581" rx="7.5" ry="4" transform="rotate(-8 511 581)" fill="#170a04" opacity="0.85"/>
  <ellipse cx="498" cy="594" rx="26" ry="8" fill="#241208" opacity="0.28" filter="url(#b4)"/>
`;

// Sillons joues/pommettes autour bouche = fills, apparaissent avec le modele.
export const PV_JOUES = `
  <path d="M474 584 C462 602,454 616,450 625" fill="none" stroke="#33200f" stroke-width="3" opacity="0.45" stroke-linecap="round"/>
  <path d="M524 582 C544 598,558 612,566 622" fill="none" stroke="#33200f" stroke-width="3" opacity="0.5" stroke-linecap="round"/>
  <path d="M600 560 C606 585,604 610,596 630" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.28" stroke-linecap="round"/>
`;

export const PV_SOURCILS = `
  <path d="M406 472 C424 458,452 451,478 457 C481 462,479 466,474 466 C452 461,428 464,411 476 Z" fill="#2c190c"/>
  <path d="M544 459 C568 449,600 451,624 464 C628 469,625 473,620 472 C598 462,569 460,548 465 Z" fill="#2c190c"/>
  <path d="M420 465 l10 -3 M444 458 l11 -1" stroke="#a08c6e" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
  <path d="M560 458 l12 -2 M594 458 l12 3" stroke="#a08c6e" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
`;

// Oeil gauche (contenu interne, clip via url(#clipOG)). Anime en scaleY autour de son centre.
export const PV_OEIL_GAUCHE = `
  <path d="M415 497 C426 483,452 479,470 491 C457 505,430 507,415 497 Z" fill="url(#gOeil)"/>
  <g clip-path="url(#clipOG)">
    <circle cx="438" cy="492" r="10" fill="url(#gIris)"/>
    <circle cx="438" cy="492" r="4.2" fill="#120803"/>
    <circle cx="434.5" cy="488.5" r="2" fill="#f7ecd6" opacity="0.9"/>
    <path d="M415 497 C426 483,452 479,470 491" fill="none" stroke="#241208" stroke-width="5" opacity="0.35"/>
  </g>
  <path d="M412 496 C424 480,454 476,473 490" fill="none" stroke="#33200f" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M418 500 C432 508,456 507,469 494" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <path d="M418 478 C432 468,456 466,472 474" fill="none" stroke="#33200f" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
  <path d="M420 512 C434 519,456 518,468 508" fill="none" stroke="#33200f" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
  <path d="M410 492 C398 490,388 492,380 497" fill="none" stroke="#33200f" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
  <path d="M411 500 C400 502,392 506,384 512" fill="none" stroke="#33200f" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
`;

// Oeil droit (clip via url(#clipOD)).
export const PV_OEIL_DROIT = `
  <path d="M552 495 C565 480,596 477,617 490 C601 506,568 508,552 495 Z" fill="url(#gOeil)"/>
  <g clip-path="url(#clipOD)">
    <circle cx="578" cy="491" r="11.5" fill="url(#gIris)"/>
    <circle cx="578" cy="491" r="4.8" fill="#120803"/>
    <circle cx="574" cy="487" r="2.2" fill="#f7ecd6" opacity="0.9"/>
    <path d="M552 495 C565 480,596 477,617 490" fill="none" stroke="#241208" stroke-width="5" opacity="0.35"/>
  </g>
  <path d="M549 494 C563 477,598 474,620 489" fill="none" stroke="#33200f" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M556 499 C570 508,598 507,615 493" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.6" stroke-linecap="round"/>
  <path d="M553 476 C568 465,598 463,618 472" fill="none" stroke="#33200f" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
  <path d="M556 511 C572 519,598 518,613 507" fill="none" stroke="#33200f" stroke-width="2" opacity="0.35" stroke-linecap="round"/>
  <path d="M621 488 C632 485,641 486,650 491" fill="none" stroke="#33200f" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
  <path d="M620 496 C632 498,642 502,652 509" fill="none" stroke="#33200f" stroke-width="2" opacity="0.45" stroke-linecap="round"/>
`;

// Barbe / traits sous le menton = fills, avec le modele.
export const PV_BARBE = `
  <ellipse cx="508" cy="714" rx="66" ry="30" fill="#1d0e06" opacity="0.2" filter="url(#b8)"/>
  <ellipse cx="462" cy="662" rx="20" ry="46" transform="rotate(22 462 662)" fill="#1d0e06" opacity="0.18" filter="url(#b8)"/>
  <ellipse cx="612" cy="658" rx="22" ry="48" transform="rotate(-24 612 658)" fill="#1d0e06" opacity="0.2" filter="url(#b8)"/>
  <ellipse cx="509" cy="606" rx="44" ry="11" fill="#1d0e06" opacity="0.2" filter="url(#b4)"/>
  <g stroke-linecap="round" stroke-width="2.2" fill="none">
    <path d="M480 726 l3 13 M496 732 l1 14 M514 733 l-1 14 M530 728 l-3 13" stroke="#2c180c" opacity="0.55"/>
    <path d="M488 730 l2 12 M522 731 l-2 12" stroke="#ab967a" opacity="0.6"/>
    <path d="M452 672 l8 11 M594 690 l-7 11 M610 668 l-8 12" stroke="#2c180c" opacity="0.5"/>
    <path d="M444 654 l8 10 M626 648 l-8 11" stroke="#ab967a" opacity="0.55"/>
    <path d="M478 606 l3 9 M510 602 l-1 10 M540 608 l-4 8" stroke="#2c180c" opacity="0.45"/>
    <path d="M492 602 l2 10 M526 604 l-3 9" stroke="#ab967a" opacity="0.5"/>
    <path d="M652 500 l-4 12 M658 516 l-5 11" stroke="#ab967a" opacity="0.6"/>
  </g>
`;

// Bouche (contenu interne). Anime en scaleY autour de bouche-centre (509,630).
export const PV_BOUCHE = `
  <path d="M504 592 C503 600,502 608,502 616" fill="none" stroke="#33200f" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
  <path d="M451 628 C468 617,492 612,509 616 C526 611,549 615,567 625 C548 632,510 635,486 634 C472 633,459 631,451 628 Z" fill="#38200f" opacity="0.85"/>
  <path d="M458 633 C468 649,494 658,514 657 C536 656,552 646,563 631 C548 642,510 646,486 643 C474 641,464 638,458 633 Z" fill="#7a4530" opacity="0.85"/>
  <ellipse cx="512" cy="648" rx="18" ry="6" fill="#f4e6c8" opacity="0.32" filter="url(#b4)"/>
  <path d="M449 627 C475 637,540 639,569 625" fill="none" stroke="#2b1509" stroke-width="4" opacity="0.85" stroke-linecap="round"/>
  <path d="M446 626 C441 632,439 639,441 646" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.5" stroke-linecap="round"/>
  <path d="M572 624 C577 630,579 637,577 644" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.5" stroke-linecap="round"/>
  <ellipse cx="510" cy="670" rx="34" ry="10" fill="#241208" opacity="0.3" filter="url(#b8)"/>
`;

// Menton + CONTOUR PRINCIPAL du visage (trace au crayon en phase 1).
export const PV_MENTON = `
  <path d="M478 680 C494 674,522 674,538 679" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.32" stroke-linecap="round"/>
  <path d="M612 664 C580 696,545 714,510 722" fill="none" stroke="#33200f" stroke-width="2.5" opacity="0.45" stroke-linecap="round"/>
`;

// Chapeau (contenu interne, applique rotate(-3 540 330) au wrapper).
export const PV_CHAPEAU = `
  <ellipse cx="540" cy="330" rx="332" ry="82" fill="url(#gPailleH)" stroke="#6f5330" stroke-width="4"/>
  <ellipse cx="540" cy="330" rx="300" ry="70" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="5 8" opacity="0.55"/>
  <ellipse cx="540" cy="330" rx="250" ry="57" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="5 8" opacity="0.55"/>
  <ellipse cx="540" cy="330" rx="195" ry="44" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="5 8" opacity="0.5"/>
  <ellipse cx="540" cy="330" rx="332" ry="82" fill="none" stroke="#5e4526" stroke-width="6" opacity="0.35" filter="url(#b4)"/>
  <path d="M400 334 C396 256,436 184,524 172 C618 162,678 230,682 326 C636 354,580 366,536 366 C478 366,434 352,400 334 Z" fill="url(#gPailleV)" stroke="#6f5330" stroke-width="4"/>
  <path d="M412 300 C480 330,600 330,672 296" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="6 7" opacity="0.5"/>
  <path d="M408 258 C478 288,604 288,674 254" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="6 7" opacity="0.5"/>
  <path d="M424 210 C486 236,596 236,662 208" fill="none" stroke="#8a6a3c" stroke-width="2" stroke-dasharray="6 7" opacity="0.5"/>
  <ellipse cx="500" cy="202" rx="70" ry="30" fill="#f4e6c8" opacity="0.32" filter="url(#b8)"/>
  <ellipse cx="648" cy="282" rx="48" ry="68" fill="#6b4e2b" opacity="0.38" filter="url(#b14)"/>
  <path d="M404 318 C462 350,620 352,678 310" fill="none" stroke="#6b4a28" stroke-width="30" opacity="0.97"/>
  <path d="M406 308 C462 340,620 342,676 300" fill="none" stroke="#8a6740" stroke-width="6" opacity="0.5"/>
  <path d="M404 332 C462 362,620 364,678 324" fill="none" stroke="#4d3218" stroke-width="3" opacity="0.55"/>
`;

// PATHS DE CONTOUR traces au crayon en phase 1 (stroke-dasharray anime).
// Chaque entree : d = path, len = longueur approx (pour dasharray), w, color, opacity.
export type TracePath = { d: string; len: number; w: number; color: string; op: number };

export const PV_TRACE_PATHS: TracePath[] = [
  // Contour principal du visage (le grand ovale ouvert) — le plus important.
  {
    d: "M392 430 C380 520,398 610,448 672 C472 700,488 718,508 724 C548 722,606 688,638 650 C664 614,674 555,671 470",
    len: 900,
    w: 4,
    color: "#3a2313",
    op: 0.85,
  },
  // Sourcils (contours superieurs), esquisse.
  { d: "M436 426 C472 418,540 417,602 426", len: 175, w: 2.5, color: "#33200f", op: 0.32 },
  { d: "M446 446 C482 439,544 438,596 445", len: 160, w: 2.5, color: "#33200f", op: 0.28 },
  // Arete du nez (haut).
  { d: "M496 470 C494 480,493 488,494 494", len: 26, w: 2, color: "#33200f", op: 0.4 },
  { d: "M508 470 C509 479,509 486,508 492", len: 24, w: 2, color: "#33200f", op: 0.28 },
  // Contour cou gauche/droit (buste).
  { d: "M458 676 C462 760,456 800,444 828", len: 160, w: 3.5, color: "#3a2313", op: 0.75 },
  { d: "M634 668 C628 740,634 796,648 828", len: 165, w: 3.5, color: "#3a2313", op: 0.75 },
];
