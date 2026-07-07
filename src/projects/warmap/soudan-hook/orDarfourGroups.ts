// Or du Darfour — HOOK Soudan. Reskin PARCHEMIN/ENCRE des groupes GPT "or-darfour-hero"
// (source : _rnd/svg-scenes/_archive/heroGptGroups.ts, palette jour jaune vif REJETEE par Aziz).
//
// Technique : remap couleur cote code, ZERO nouvel appel LLM (meme methode que le passage jour->clair
// d'origine). Table de remap appliquee a la main :
//   fond jaune vif  #f4d98f / #e9c074      -> parchemin sable #d9c092 / #cbb488
//   terre miel      #c08a4e / #cf9a58      -> terre encre     #8a7c5e (contours encre #2b2117 / #4a1f18)
//   traits clairs   #dcab68 / #f6d885      -> encre grave     #4a1f18
//   L'OR (accent hero, GARDE son eclat)    -> #e7bd78 / #dca95e / #f6d885 (renforce)
//   soleil (ajout Aziz, doit BRILLER)      -> dore present #e7bd78 halo
//   fumee de guerre                        -> gardee grave
//   rouge sang climax  #8a2a12             -> rouge etat-major #8a2a20
//
// Registre = "trousseau encre" (doctrine SVG-MIDFORM) : fond parchemin + accent semantique unique
// (l'or + le sang), traits d'encre epais. Coherent avec inserts etat-major + GGW/cacao.

// palette
const SABLE = "#d9c092";
const SABLE_D = "#c9b184";
const ENCRE = "#2b2117";
const ENCRE_L = "#4a1f18";
const TERRE = "#9a8763";
const TERRE_D = "#7d6b4a";
const OR = "#e7bd78";
const OR_CLAIR = "#f2d491";
const OR_PROF = "#dca95e";
const SANG = "#8a2a20";

export const H_FOND = `<rect x="0" y="0" width="1920" height="1080" fill="${SABLE}"/><rect x="0" y="0" width="1920" height="760" fill="${SABLE_D}" opacity="0.5"/>`;

// ciel parchemin + SOLEIL qui brille (ajout Aziz : element colore present)
export const H_CIEL = `<path d="M0 640 C260 610 410 650 650 620 C900 585 1100 640 1320 604 C1540 570 1710 610 1920 585 L1920 760 L0 760 Z" fill="${SABLE_D}" opacity="0.7"/><ellipse cx="1500" cy="196" rx="92" ry="92" fill="${OR}" opacity="0.22"/><ellipse cx="1500" cy="196" rx="62" ry="62" fill="${OR_CLAIR}" opacity="0.5"/><ellipse cx="1500" cy="196" rx="40" ry="40" fill="${OR_CLAIR}" opacity="0.85"/><g stroke="${OR}" stroke-width="3" opacity="0.4"><line x1="1500" y1="70" x2="1500" y2="104"/><line x1="1610" y1="120" x2="1586" y2="144"/><line x1="1390" y1="120" x2="1414" y2="144"/><line x1="1636" y1="196" x2="1602" y2="196"/><line x1="1364" y1="196" x2="1398" y2="196"/></g><path d="M0 692 C300 665 520 704 760 672 C990 642 1190 682 1430 646 C1640 616 1770 652 1920 628" fill="none" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.4"/><path d="M0 720 C280 700 515 732 770 705 C1020 678 1190 712 1445 680 C1660 654 1800 690 1920 668" fill="none" stroke="${ENCRE_L}" stroke-width="1.8" opacity="0.3"/>`;

// nuages graves parchemin (traits encre)
export const H_NUAGES = `<path d="M188 205 C242 167 310 179 342 216 C386 197 445 214 468 252 C418 274 342 270 286 260 C242 266 200 248 188 205 Z" fill="${SABLE_D}" stroke="${ENCRE_L}" stroke-width="3.5" opacity="0.72"/><path d="M220 234 C284 226 356 235 440 249" fill="none" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.4"/><path d="M990 286 C1048 244 1122 257 1158 298 C1202 274 1284 288 1318 338 C1250 365 1162 357 1098 348 C1040 356 1000 332 990 286 Z" fill="${SABLE_D}" stroke="${ENCRE_L}" stroke-width="3.5" opacity="0.66"/><path d="M1028 318 C1110 306 1202 314 1288 335" fill="none" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.36"/>`;

// lueur de guerre : rouge sang etat-major
export const H_GUERRE = `<ellipse cx="1335" cy="704" rx="335" ry="104" fill="${SANG}" opacity="0.26"/><ellipse cx="1360" cy="720" rx="220" ry="66" fill="#a5341f" opacity="0.24"/><ellipse cx="1398" cy="724" rx="108" ry="35" fill="${OR_PROF}" opacity="0.2"/><path d="M1390 675 C1352 622 1368 570 1418 538 C1460 512 1434 462 1398 433 C1486 462 1516 536 1482 590 C1458 628 1488 660 1536 690 C1482 704 1430 698 1390 675 Z" fill="#b8341f" stroke="${SANG}" stroke-width="5" opacity="0.6"/><path d="M1438 684 C1418 642 1430 606 1464 586 C1488 572 1480 536 1458 512" fill="none" stroke="${OR}" stroke-width="4" opacity="0.42"/>`;

// terre encre gravee
export const H_TERRE = `<path d="M0 704 C210 678 330 725 520 692 C705 662 860 704 1040 682 C1255 655 1395 700 1585 674 C1738 654 1845 682 1920 668 L1920 1080 L0 1080 Z" fill="${TERRE}"/><path d="M0 738 C225 718 410 754 620 724 C850 692 1044 744 1266 706 C1508 666 1715 710 1920 688" fill="none" stroke="${ENCRE_L}" stroke-width="5" opacity="0.55"/><path d="M0 803 C245 780 440 820 675 790 C935 758 1134 816 1382 772 C1612 732 1778 760 1920 748" fill="none" stroke="${TERRE_D}" stroke-width="4.5" opacity="0.6"/><path d="M0 876 C280 850 500 888 760 856 C1010 826 1225 874 1480 832 C1688 798 1826 822 1920 812" fill="none" stroke="${ENCRE_L}" stroke-width="3.5" opacity="0.4"/><path d="M95 775 C190 748 278 760 358 792 C265 810 172 812 95 775 Z" fill="${TERRE_D}" opacity="0.7"/><path d="M1505 768 C1602 738 1700 750 1792 786 C1688 808 1588 806 1505 768 Z" fill="${TERRE_D}" opacity="0.62"/><ellipse cx="420" cy="835" rx="24" ry="13" fill="${TERRE_D}" opacity="0.7"/><ellipse cx="500" cy="880" rx="15" ry="9" fill="${TERRE_D}" opacity="0.72"/><ellipse cx="1342" cy="850" rx="28" ry="15" fill="${TERRE_D}" opacity="0.6"/><ellipse cx="1520" cy="915" rx="18" ry="10" fill="${TERRE_D}" opacity="0.64"/><line x1="210" y1="820" x2="330" y2="798" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.3"/><line x1="612" y1="836" x2="760" y2="808" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.3"/><line x1="1210" y1="812" x2="1388" y2="780" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.28"/><line x1="1440" y1="886" x2="1610" y2="858" stroke="${ENCRE_L}" stroke-width="2.4" opacity="0.26"/><path d="M70 965 C290 930 448 966 670 936 C900 905 1076 952 1320 918 C1550 886 1740 914 1920 895" fill="none" stroke="${ENCRE}" stroke-width="4" opacity="0.32"/>`;

export const H_OMBRE_LINGOT = `<ellipse cx="970" cy="744" rx="340" ry="58" fill="${OR}" opacity="0.4"/><ellipse cx="1072" cy="734" rx="190" ry="34" fill="${ENCRE}" opacity="0.3"/>`;

// pelle : manche encre, fer sable grave
export const H_PELLE = `<rect x="592" y="255" width="22" height="432" rx="9" fill="${TERRE_D}" stroke="${ENCRE_L}" stroke-width="4"/><line x1="603" y1="276" x2="603" y2="654" stroke="${OR}" stroke-width="3" opacity="0.3"/><path d="M558 670 L648 668 L678 796 C640 828 582 828 536 796 Z" fill="${TERRE}" stroke="${ENCRE_L}" stroke-width="5"/><path d="M580 702 C610 714 635 713 660 699" fill="none" stroke="${ENCRE_L}" stroke-width="3" opacity="0.5"/><path d="M555 770 C592 790 626 790 664 768" fill="none" stroke="${ENCRE_L}" stroke-width="3" opacity="0.35"/><path d="M572 238 C592 218 616 218 636 238 L624 262 L584 262 Z" fill="${TERRE_D}" stroke="${ENCRE_L}" stroke-width="4"/>`;

// LINGOT-OR (accent hero, garde et RENFORCE son eclat) — c'est le seul element vraiment brillant
export const H_LINGOT_OR = `<polygon points="760,562 1102,542 1214,626 870,653" fill="${OR_CLAIR}" stroke="#fff0c2" stroke-width="6"/><polygon points="870,653 1214,626 1190,728 850,756" fill="${OR}" stroke="${OR_CLAIR}" stroke-width="6"/><polygon points="760,562 870,653 850,756 738,662" fill="${OR_PROF}" stroke="${OR}" stroke-width="6"/><path d="M820 586 C905 602 1014 590 1126 574" fill="none" stroke="#fff0c2" stroke-width="5" opacity="0.9"/><path d="M900 626 C990 620 1078 608 1160 594" fill="none" stroke="#fff8dc" stroke-width="3" opacity="0.66"/><path d="M882 690 C980 676 1075 668 1180 656" fill="none" stroke="#fff0c2" stroke-width="4" opacity="0.5"/><path d="M875 720 C966 708 1076 696 1180 686" fill="none" stroke="${OR_PROF}" stroke-width="4" opacity="0.44"/><path d="M786 604 L842 650 M810 628 L856 668 M824 662 L850 684" fill="none" stroke="${ENCRE_L}" stroke-width="3" opacity="0.4"/><path d="M1004 557 L1112 633" fill="none" stroke="#fff0c2" stroke-width="4" opacity="0.5"/><ellipse cx="1005" cy="638" rx="44" ry="18" fill="#fff0c2" opacity="0.28"/>`;

export const H_LINGOT_MOBILE = `<polygon points="1002,676 1190,660 1262,712 1074,732" fill="${OR_CLAIR}" stroke="#fff0c2" stroke-width="5"/><polygon points="1074,732 1262,712 1246,774 1060,792" fill="${OR}" stroke="${OR_CLAIR}" stroke-width="5"/><polygon points="1002,676 1074,732 1060,792 988,732" fill="${OR_PROF}" stroke="${OR}" stroke-width="5"/><path d="M1036 692 C1090 700 1148 690 1210 680" fill="none" stroke="#fff0c2" stroke-width="4" opacity="0.82"/><path d="M1090 756 C1148 748 1190 744 1240 736" fill="none" stroke="${OR_PROF}" stroke-width="3" opacity="0.46"/><ellipse cx="1156" cy="716" rx="30" ry="12" fill="#fff8dc" opacity="0.26"/>`;

// vignette parchemin (assombrit les bords, cadre grave)
export const H_VIGNETTE = `<rect x="0" y="0" width="1920" height="90" fill="${ENCRE}" opacity="0.14"/><rect x="0" y="990" width="1920" height="90" fill="${ENCRE}" opacity="0.18"/><rect x="0" y="0" width="95" height="1080" fill="${ENCRE}" opacity="0.12"/><rect x="1825" y="0" width="95" height="1080" fill="${ENCRE}" opacity="0.12"/><ellipse cx="0" cy="0" rx="420" ry="280" fill="${ENCRE}" opacity="0.1"/><ellipse cx="1920" cy="0" rx="420" ry="280" fill="${ENCRE}" opacity="0.1"/><ellipse cx="0" cy="1080" rx="460" ry="300" fill="${ENCRE}" opacity="0.12"/><ellipse cx="1920" cy="1080" rx="460" ry="300" fill="${ENCRE}" opacity="0.12"/>`;
