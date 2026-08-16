// MOTEUR: objet/metaphore SVG — le fait accompli (un coin enfonce dans la terre qui se fend) est une
// idee abstraite : seul l'objet-metaphore en SVG plat lui donne ce poids definitif, sans carte ni decor.
//
// GazoducActe5Faille — DERNIER PLAN de l'episode (Acte 5). L'image se fige sur le mot "CREUSER",
// dernier mot de la narration (45.740s), 0.42s avant la fin de l'audio.
//
// ORIGINE DU DESSIN : SVG produit par GPT-5.5 lors d'un CONCOURS 4 modeles (Gemini / GPT / Kimi K3 /
// Fable 5) sur la meme image cible, choisi par Aziz le 2026-08-16 ("le meilleur des SVG"). Le dessin
// est repris TEL QUEL ; seule l'animation est de nous. Les 12 groupes nommes d'origine sont conserves
// (#drill, #cracks, #crack-lines, #debris, #ground, #water).
//
// ZERO TREMBLEMENT, ZERO FLASH (exigence Aziz) : pas de scale du cadre, pas de pulse permanent.
// Le seul mouvement est NARRATIF : le coin s'enfonce, les fissures se propagent, puis TOUT SE FIGE.
// Determinisme total : aucun Math.random(), aucun Date.now() — tout depend de `frame`.
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const W = 1920;
const H = 1080;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
// Longueur de trace genereuse : couvre le plus long chemin de fissure sans le tronquer.
const DASH = 2600;

export const GazoducActe5Faille: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Le coin s'enfonce : course courte et decidee (pas de rebond comique).
  const drive = spring({ frame, fps, config: { damping: 200, stiffness: 90, mass: 1.1 } });
  const drillY = interpolate(drive, [0, 1], [-190, 0], clampB);

  // Propagation en 2 vagues : les failles maitresses d'abord, les ramifications ensuite.
  // C'est ce decalage qui fait lire une fracture qui SE PROPAGE, pas un dessin qui apparait.
  const crackMain = interpolate(frame, [22, 82], [0, 1], clampB);
  const crackBranch = interpolate(frame, [46, 112], [0, 1], clampB);
  const dashMain = DASH * (1 - crackMain);
  const dashBranch = DASH * (1 - crackBranch);

  // Les eclats se posent en dernier, puis restent.
  const debrisIn = interpolate(frame, [70, 104], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050c1a" }}>
      <svg width={W} height={H} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
        <linearGradient id="background-gradient" x1="0" y1="0" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0d1f38"/>
        <stop offset="1" stopColor="#050c1a"/>
        </linearGradient>
        <linearGradient id="water-gradient" x1="0" y1="190" x2="0" y2="315" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#1d4b6b"/>
        <stop offset="1" stopColor="#123047"/>
        </linearGradient>
        <linearGradient id="ground-gradient" x1="0" y1="260" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#123047"/>
        <stop offset="1" stopColor="#0a1c2c"/>
        </linearGradient>
        <linearGradient id="drill-gold-gradient" x1="810" y1="0" x2="1090" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#c98f16"/>
        <stop offset="0.16" stopColor="#FFC742"/>
        <stop offset="0.5" stopColor="#ffd66f"/>
        <stop offset="0.76" stopColor="#FFC742"/>
        <stop offset="1" stopColor="#c98f16"/>
        </linearGradient>
        <linearGradient id="drill-bit-gradient" x1="845" y1="0" x2="1060" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#b77d12"/>
        <stop offset="0.18" stopColor="#FFC742"/>
        <stop offset="0.52" stopColor="#ffdc78"/>
        <stop offset="0.82" stopColor="#FFC742"/>
        <stop offset="1" stopColor="#a87310"/>
        </linearGradient>
        <linearGradient id="drill-shine-gradient" x1="900" y1="0" x2="1010" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFC742" stopOpacity="0"/>
        <stop offset="0.48" stopColor="#fff0a3" stopOpacity="0.55"/>
        <stop offset="1" stopColor="#FFC742" stopOpacity="0"/>
        </linearGradient>
        <pattern id="stone-pattern" patternUnits="userSpaceOnUse" width="76" height="76">
        <rect width="76" height="76" fill="none"/>
        <path d="M5 9 C12 2 25 5 24 15 C21 25 8 23 4 16 C2 13 2 11 5 9 Z" fill="#1b3c52" opacity="0.55"/>
        <path d="M35 3 C45 0 55 6 53 16 C49 25 35 23 31 14 C29 9 31 5 35 3 Z" fill="#081827" opacity="0.74"/>
        <path d="M62 12 C71 10 77 18 72 27 C66 35 55 30 55 21 C55 16 58 13 62 12 Z" fill="#1f4359" opacity="0.5"/>
        <path d="M17 32 C26 27 38 30 39 39 C39 50 24 52 15 45 C9 40 10 35 17 32 Z" fill="#061522" opacity="0.65"/>
        <path d="M48 33 C55 27 69 31 70 41 C70 50 57 55 49 48 C43 43 42 38 48 33 Z" fill="#1a394d" opacity="0.62"/>
        <path d="M1 55 C11 49 24 54 24 64 C23 75 7 75 1 66 Z" fill="#1d4056" opacity="0.48"/>
        <path d="M33 59 C39 51 54 53 58 62 C62 72 47 79 37 73 C31 69 29 64 33 59 Z" fill="#081827" opacity="0.72"/>
        <path d="M66 60 C75 57 82 65 76 74 C68 82 57 75 59 66 C60 63 62 61 66 60 Z" fill="#1c3c51" opacity="0.5"/>
        <ellipse cx="10" cy="47" rx="4" ry="5" fill="#071624" opacity="0.75"/>
        <ellipse cx="29" cy="24" rx="5" ry="3" fill="#203f55" opacity="0.47"/>
        <ellipse cx="58" cy="4" rx="4" ry="3" fill="#203f55" opacity="0.5"/>
        <ellipse cx="42" cy="45" rx="4" ry="6" fill="#071624" opacity="0.75"/>
        <ellipse cx="70" cy="45" rx="3" ry="5" fill="#071624" opacity="0.62"/>
        <ellipse cx="27" cy="68" rx="3" ry="4" fill="#1e4157" opacity="0.48"/>
        <ellipse cx="4" cy="28" rx="4" ry="3" fill="#1e4157" opacity="0.45"/>
        <path d="M23 3 C29 5 31 12 25 15 C20 17 16 12 17 7 C18 4 20 3 23 3 Z" fill="#0b1c2c" opacity="0.58"/>
        <path d="M5 70 C12 66 18 70 16 75 L4 75 C2 73 2 71 5 70 Z" fill="#0b1c2c" opacity="0.7"/>
        <path d="M53 20 C60 17 67 21 65 28 C62 34 52 33 50 26 C49 23 50 21 53 20 Z" fill="#0a1928" opacity="0.62"/>
        <path d="M31 40 C35 37 42 38 44 43 C46 49 38 53 32 49 C28 47 28 43 31 40 Z" fill="#1f4359" opacity="0.38"/>
        <path d="M12 18 C18 15 24 18 23 24 C21 29 13 29 10 24 C8 21 9 19 12 18 Z" fill="#071624" opacity="0.55"/>
        </pattern>
        </defs>
        <g id="background">
        <rect x="0" y="0" width="1920" height="1080" fill="url(#background-gradient)"/>
        </g>
        <g id="water">
        <path id="water-left" d="M0 241 C36 231 65 225 98 228 C130 232 154 237 193 239 C235 241 278 239 318 240 C357 241 382 248 420 250 C469 253 493 242 539 235 C583 230 618 237 665 231 C699 226 732 226 742 239 C752 253 752 275 765 291 L765 314 L0 314 Z" fill="url(#water-gradient)" opacity="0.98"/>
        <path id="water-right" d="M1165 230 C1211 225 1251 213 1301 205 C1337 199 1371 209 1408 221 C1449 234 1493 239 1533 232 C1560 227 1572 221 1612 230 C1660 240 1697 237 1746 231 C1789 225 1812 237 1854 238 C1879 239 1902 237 1920 234 L1920 314 L1155 314 C1152 286 1155 252 1165 230 Z" fill="url(#water-gradient)" opacity="0.98"/>
        <path id="water-surface-left" d="M-8 242 C33 231 64 225 99 229 C129 233 154 238 192 240 C236 242 278 239 318 240 C357 241 382 248 420 250 C469 253 493 242 539 235 C583 230 618 237 665 231 C700 226 732 226 744 239" fill="none" stroke="#7FD8FF" strokeOpacity="0.58" strokeWidth="8" strokeLinecap="round"/>
        <path id="water-surface-right" d="M1167 230 C1212 225 1252 213 1301 205 C1337 199 1371 209 1408 221 C1449 234 1493 239 1533 232 C1560 227 1572 221 1612 230 C1660 240 1697 237 1746 231 C1789 225 1812 237 1854 238 C1879 239 1902 237 1928 233" fill="none" stroke="#7FD8FF" strokeOpacity="0.58" strokeWidth="8" strokeLinecap="round"/>
        </g>
        <g id="ground">
        <path id="ground-base" d="M0 303 C70 286 132 301 196 298 C280 294 349 298 419 305 C514 315 580 303 657 301 C704 300 727 293 744 292 C756 321 779 349 824 378 C791 394 767 425 735 438 C697 416 662 405 628 422 C594 438 566 460 514 471 C456 483 414 487 364 505 L0 1080 Z M1920 1080 L997 1080 C1017 1006 1036 925 1061 851 C1081 790 1110 727 1123 672 C1136 616 1143 556 1160 503 C1178 446 1174 402 1154 374 C1140 354 1137 331 1148 306 C1156 288 1169 262 1184 230 C1230 224 1279 210 1324 205 C1365 202 1398 220 1441 230 C1482 239 1518 236 1559 231 C1597 227 1618 235 1659 239 C1711 244 1750 235 1790 231 C1837 226 1859 240 1920 234 Z" fill="url(#ground-gradient)"/>
        <path id="ground-stones" d="M0 303 C70 286 132 301 196 298 C280 294 349 298 419 305 C514 315 580 303 657 301 C704 300 727 293 744 292 C756 321 779 349 824 378 C791 394 767 425 735 438 C697 416 662 405 628 422 C594 438 566 460 514 471 C456 483 414 487 364 505 L0 1080 Z M1920 1080 L997 1080 C1017 1006 1036 925 1061 851 C1081 790 1110 727 1123 672 C1136 616 1143 556 1160 503 C1178 446 1174 402 1154 374 C1140 354 1137 331 1148 306 C1156 288 1169 262 1184 230 C1230 224 1279 210 1324 205 C1365 202 1398 220 1441 230 C1482 239 1518 236 1559 231 C1597 227 1618 235 1659 239 C1711 244 1750 235 1790 231 C1837 226 1859 240 1920 234 Z" fill="url(#stone-pattern)" opacity="0.9"/>
        <path id="ground-upper-shadow-left" d="M0 303 C70 286 132 301 196 298 C280 294 349 298 419 305 C514 315 580 303 657 301 C704 300 727 293 744 292 C750 313 765 336 792 357 C720 337 636 343 540 340 C425 337 315 332 206 329 C122 327 58 321 0 331 Z" fill="#050c1a" opacity="0.28"/>
        <path id="ground-upper-shadow-right" d="M1155 315 C1165 289 1173 261 1184 230 C1230 224 1279 210 1324 205 C1365 202 1398 220 1441 230 C1482 239 1518 236 1559 231 C1597 227 1618 235 1659 239 C1711 244 1750 235 1790 231 C1837 226 1859 240 1920 234 L1920 333 C1828 335 1744 326 1644 322 C1534 318 1436 302 1328 301 C1269 300 1207 310 1155 315 Z" fill="#050c1a" opacity="0.28"/>
        </g>
        <g id="cracks">
        <g id="crack-shadows">
        <path d="M744 244 C742 281 774 301 792 324 L819 353 L796 381 L751 425 L708 440 L680 474 L670 533 L617 602 L641 653 L613 697 L643 748 L594 825" fill="none" stroke="#050c1a" strokeOpacity="0.9" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1169 236 C1159 271 1139 309 1127 351 L1155 390 L1138 431 L1160 483 L1133 526 L1116 588 L1074 650 L1105 706 L1076 762 L1039 888 L1001 1080" fill="none" stroke="#050c1a" strokeOpacity="0.9" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M708 440 C674 410 645 405 616 421 L557 453" fill="none" stroke="#050c1a" strokeOpacity="0.82" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M672 531 L604 557 L482 586" fill="none" stroke="#050c1a" strokeOpacity="0.82" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M617 602 L555 622 L485 635" fill="none" stroke="#050c1a" strokeOpacity="0.75" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M795 381 L836 428 L825 482 L851 543 L830 628" fill="none" stroke="#050c1a" strokeOpacity="0.75" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1140 431 L1194 393 L1267 388 L1295 334 L1360 349 L1390 303 L1432 261" fill="none" stroke="#050c1a" strokeOpacity="0.85" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1117 588 L1169 699 L1269 708 L1335 661 L1383 742 L1490 758" fill="none" stroke="#050c1a" strokeOpacity="0.85" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1267 388 L1297 441 L1340 493" fill="none" stroke="#050c1a" strokeOpacity="0.72" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1335 661 L1325 742 L1316 866" fill="none" stroke="#050c1a" strokeOpacity="0.72" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        </g>
        <g id="crack-glow">
        <path d="M744 244 C742 281 774 301 792 324 L819 353 L796 381 L751 425 L708 440 L680 474 L670 533 L617 602 L641 653 L613 697 L643 748 L594 825" fill="none" stroke="#FFC742" strokeOpacity="0.22" strokeWidth="58" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M744 244 C742 281 774 301 792 324 L819 353 L796 381 L751 425 L708 440 L680 474 L670 533 L617 602 L641 653 L613 697 L643 748 L594 825" fill="none" stroke="#FFC742" strokeOpacity="0.35" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1169 236 C1159 271 1139 309 1127 351 L1155 390 L1138 431 L1160 483 L1133 526 L1116 588 L1074 650 L1105 706 L1076 762 L1039 888 L1001 1080" fill="none" stroke="#FFC742" strokeOpacity="0.22" strokeWidth="60" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1169 236 C1159 271 1139 309 1127 351 L1155 390 L1138 431 L1160 483 L1133 526 L1116 588 L1074 650 L1105 706 L1076 762 L1039 888 L1001 1080" fill="none" stroke="#FFC742" strokeOpacity="0.35" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M708 440 C674 410 645 405 616 421 L557 453" fill="none" stroke="#FFC742" strokeOpacity="0.2" strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M672 531 L604 557 L482 586" fill="none" stroke="#FFC742" strokeOpacity="0.17" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M617 602 L555 622 L485 635" fill="none" stroke="#FFC742" strokeOpacity="0.14" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M795 381 L836 428 L825 482 L851 543 L830 628" fill="none" stroke="#FFC742" strokeOpacity="0.15" strokeWidth="29" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1140 431 L1194 393 L1267 388 L1295 334 L1360 349 L1390 303 L1432 261" fill="none" stroke="#FFC742" strokeOpacity="0.18" strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1117 588 L1169 699 L1269 708 L1335 661 L1383 742 L1490 758" fill="none" stroke="#FFC742" strokeOpacity="0.18" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        </g>
        <g id="crack-lines">
        <path d="M744 244 C742 281 774 301 792 324 L819 353 L796 381 L751 425 L708 440 L680 474 L670 533 L617 602 L641 653 L613 697 L643 748 L594 825" fill="none" stroke="#FFC742" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M744 244 C742 281 774 301 792 324 L819 353 L796 381 L751 425 L708 440 L680 474 L670 533 L617 602 L641 653 L613 697 L643 748 L594 825" fill="none" stroke="#ffe08a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M1169 236 C1159 271 1139 309 1127 351 L1155 390 L1138 431 L1160 483 L1133 526 L1116 588 L1074 650 L1105 706 L1076 762 L1039 888 L1001 1080" fill="none" stroke="#FFC742" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1169 236 C1159 271 1139 309 1127 351 L1155 390 L1138 431 L1160 483 L1133 526 L1116 588 L1074 650 L1105 706 L1076 762 L1039 888 L1001 1080" fill="none" stroke="#ffe08a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M708 440 C674 410 645 405 616 421 L557 453" fill="none" stroke="#FFC742" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M557 453 L510 467" fill="none" stroke="#ffe08a" strokeWidth="3" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M672 531 L604 557 L482 586" fill="none" stroke="#FFC742" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M617 602 L555 622 L485 635" fill="none" stroke="#FFC742" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M795 381 L836 428 L825 482 L851 543 L830 628" fill="none" stroke="#FFC742" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M830 628 C809 646 788 662 785 693" fill="none" stroke="#FFC742" strokeWidth="4" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M1140 431 L1194 393 L1267 388 L1295 334 L1360 349 L1390 303 L1432 261" fill="none" stroke="#FFC742" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1267 388 L1297 441 L1340 493" fill="none" stroke="#FFC742" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M1117 588 L1169 699 L1269 708 L1335 661 L1383 742 L1490 758" fill="none" stroke="#FFC742" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashMain}/>
        <path d="M1335 661 L1325 742 L1316 866" fill="none" stroke="#FFC742" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M1390 303 C1400 285 1416 269 1432 261" fill="none" stroke="#ffe08a" strokeWidth="3" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        <path d="M1490 758 C1525 754 1570 751 1617 760" fill="none" stroke="#ffe08a" strokeWidth="3" strokeLinecap="round" strokeDasharray={DASH} strokeDashoffset={dashBranch}/>
        </g>
        </g>
        <g id="debris-anim" opacity={debrisIn}>
          <g id="debris">
          <path d="M802 577 L837 563 L825 590 Z" fill="#071624" opacity="0.58"/>
          <path d="M789 628 L822 613 L812 640 Z" fill="#c98f16" opacity="0.35"/>
          <path d="M1090 604 L1122 588 L1110 623 Z" fill="#071624" opacity="0.58"/>
          <path d="M1110 675 L1141 692 L1102 701 Z" fill="#c98f16" opacity="0.3"/>
          <path d="M733 443 L763 426 L750 464 Z" fill="#050c1a" opacity="0.42"/>
          <path d="M1162 440 L1187 420 L1180 459 Z" fill="#050c1a" opacity="0.42"/>
          <path d="M583 500 L606 489 L599 514 Z" fill="#0a1c2c" opacity="0.7"/>
          <path d="M1287 493 L1310 510 L1281 521 Z" fill="#0a1c2c" opacity="0.62"/>
          </g>
        </g>
        <g id="drill-anim" transform={`translate(0, ${drillY.toFixed(2)})`}>
          <g id="drill">
          <g id="drill-glow">
          <path d="M816 -40 L1091 -40 L1085 91 L1074 127 L1085 164 L1081 390 C1075 454 1056 563 1029 692 L957 962 L881 693 C854 567 829 450 819 391 L819 164 L830 127 L820 91 Z" fill="#FFC742" opacity="0.08"/>
          <path d="M843 -25 L1066 -25 L1063 60 L1055 126 L1063 158 L1061 383 C1053 455 1032 567 1007 684 L956 932 L907 686 C879 557 855 454 848 383 L848 158 L856 126 L848 60 Z" fill="#FFC742" opacity="0.17"/>
          <path d="M833 0 L1077 0 L1070 392 C1064 475 1039 595 1011 718 L956 957 L902 718 C870 581 842 466 836 392 Z" fill="none" stroke="#FFC742" strokeOpacity="0.18" strokeWidth="42" strokeLinejoin="round"/>
          </g>
          <g id="drill-body">
          <path id="drill-upper-shell" d="M848 -28 L1062 -28 L1059 55 L1050 123 L1058 157 L1058 386 L848 386 L848 157 L856 123 L849 55 Z" fill="url(#drill-gold-gradient)" stroke="#594714" strokeWidth="6" strokeLinejoin="round"/>
          <path id="drill-bit-main" d="M848 382 C857 462 879 566 907 690 L956 932 L1006 690 C1034 562 1053 460 1058 382 Z" fill="url(#drill-bit-gradient)" stroke="#594714" strokeWidth="6" strokeLinejoin="round"/>
          <path id="drill-shine" d="M912 -28 L1016 -28 L1014 382 C1006 504 986 674 956 932 C927 675 911 506 912 382 Z" fill="url(#drill-shine-gradient)" opacity="0.72"/>
          <path id="drill-left-side-shadow" d="M848 -28 L880 -28 L878 60 L870 126 L877 158 L877 383 C884 475 903 589 929 713 L956 932 L907 690 C879 566 857 462 848 382 L848 157 L856 123 L849 55 Z" fill="#c98f16" opacity="0.22"/>
          <path id="drill-right-side-shadow" d="M1030 -28 L1062 -28 L1059 55 L1050 123 L1058 157 L1058 382 C1053 460 1034 562 1006 690 L956 932 L985 707 C1012 580 1029 470 1030 383 Z" fill="#8a6411" opacity="0.16"/>
          </g>
          <g id="drill-seams">
          <path d="M851 54 L1059 54" fill="none" stroke="#594714" strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round"/>
          <path d="M856 124 L1050 124" fill="none" stroke="#594714" strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round"/>
          <path d="M848 155 L1058 155" fill="none" stroke="#594714" strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round"/>
          <path d="M848 254 L1058 254" fill="none" stroke="#594714" strokeOpacity="0.72" strokeWidth="5" strokeLinecap="round"/>
          <path d="M848 382 L1058 382" fill="none" stroke="#594714" strokeOpacity="0.65" strokeWidth="5" strokeLinecap="round"/>
          <path d="M849 -28 L849 55 L856 123 L848 157" fill="none" stroke="#3d3211" strokeOpacity="0.62" strokeWidth="5" strokeLinecap="round"/>
          <path d="M1062 -28 L1059 55 L1050 123 L1058 157" fill="none" stroke="#3d3211" strokeOpacity="0.62" strokeWidth="5" strokeLinecap="round"/>
          <path d="M956 932 L956 806" fill="none" stroke="#fff0a3" strokeOpacity="0.42" strokeWidth="3" strokeLinecap="round"/>
          <path d="M907 690 C879 566 857 462 848 382" fill="none" stroke="#fff0a3" strokeOpacity="0.23" strokeWidth="4" strokeLinecap="round"/>
          </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe5Faille;
