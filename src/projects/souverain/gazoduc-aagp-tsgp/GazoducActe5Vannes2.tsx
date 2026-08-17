// MOTEUR: objet/metaphore SVG — UNE vanne unique en amont, DEUX voies en aval : "une ressource, deux
// modeles". C'est la forme que le script impose ("LE prochain grand robinet", au singulier).
//
// GazoducActe5Vannes2 — Acte 5, segment "L'ENJEU" (9.3 -> 27.0s absolu, 530 frames).
//
// ⭐⭐ REFONTE APRES REVIEW DOWNSTREAM (2026-08-16). La version precedente (DEUX robinets identiques)
// a ete jetee pour deux raisons diagnostiquees par la review comparative et confirmees par Aziz :
//   1. ELLE CONTREDISAIT LE TEXTE : la voix dit "LE prochain grand robinet" (SINGULIER) et l'image en
//      montrait DEUX. Le spectateur cherchait a plaquer "finance vs souverain" sur deux robinets —
//      or un robinet distribue une ressource, il ne represente pas un modele de financement.
//   2. ELLE ETAIT STATIQUE : rien ne bougeait de 0 a 13s, le 1er vrai geste arrivait a 15s. Le plan
//      attendait la fin de la phrase pour agir au lieu de construire la tension PENDANT.
// Nouvelle forme : UNE vanne massive fermee, et en aval le tuyau se SEPARE EN DEUX BRANCHES
// asymetriques. Une ressource, un robinet, deux destinations possibles.
//
// ⭐ Dessin par GPT-5.5, qui a AUSSI prepare l'animation sur demande (methode d'Aziz) : pieces
// separees (valve-body / valve-wheel / branch-*), axe du volant DOCUMENTE dans le SVG
// — centre (760, 300) en coords ECRAN, sans transform parente — et sa recommandation : un volant de
// profil tourne autour d'un axe VERTICAL, donc squash horizontal, jamais un rotate 2D plat.
//
// Ancres (frames locales, forced-align reel) :
//   f0-260   GROS PLAN sur le flux sous pression, la vanne est fermee : la ressource s'accumule
//   f227     "robinet" (7.56s local, 17.961s absolu) — DEZOOM sec : la vanne entiere se revele, objet unique du pouvoir
//   f350     "modele" (11.66s local, 22.061s absolu) — la bifurcation se REVELE : deux voies possibles en aval
//   f499     "SOUVERAINS" (16.64s local, 27.041s absolu) — la vanne s'ouvre, le flux bascule vers la branche HAUTE (ambre)
//   f532-592 le mot SOUVERAINS dure 1.70s : l'ouverture se POURSUIT pendant qu'il est prononce et
//            se stabilise a sa fin (19.42s). ⛔ Ne jamais poser la frontiere SUR l'ancre d'un mot :
//            elle se pose APRES sa fin, sinon on coupe le mot (vecu ici, corrige par Aziz).
// Personne ne tourne la vanne : nul ne sait encore qui l'emportera. C'est le propos.
//
// ZERO tremblement, zero flash, zero texte. Determinisme total (aucun Math.random / Date.now).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

const W = 1920;
const H = 1080;
const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = { ...clampB, easing: Easing.inOut(Easing.quad) };

// Axe du volant DONNE PAR LE MODELE dans son commentaire XML (coords ecran, pas de transform parente).
const WHEEL_CX = 760;
const WHEEL_CY = 300;

export const GazoducActe5Vannes2: React.FC = () => {
  const frame = useCurrentFrame();

  // ---------- CAMERA : gros plan -> plan large. C'est elle qui porte le dynamisme du debut. ----------
  // Le downstream a mesure que le plan precedent "attendait la fin de la phrase pour agir" : ici la
  // camera travaille DES la premiere seconde, en continu, jusqu'au dezoom sec sur le mot "robinet".
  const camZoom = interpolate(frame, [0, 218, 230, 268], [2.35, 2.15, 1.0, 1.0], ease);
  const camX = interpolate(frame, [0, 218, 230], [-560, -520, 0], ease);
  const camY = interpolate(frame, [0, 218, 230], [-330, -300, 0], ease);

  // ---------- FLUX : sous pression des la 1re frame, il s'accumule contre la vanne fermee ----------
  const pressure = interpolate(frame, [0, 40], [0, 1], ease);
  // Le flux ACCELERE au fil de la phrase (tension qui monte), il n'est jamais lineaire-robotique.
  const flowSpeed = interpolate(frame, [0, 228, 368, 498], [1.4, 2.6, 3.4, 5.2], clampB);
  const flowDash = -frame * flowSpeed;

  // ---------- f383 "modele" : la bifurcation se revele ----------
  const split = interpolate(frame, [351, 420], [0, 1], ease);

  // ---------- f532 "SOUVERAINS" : la vanne s'ouvre, le flux bascule vers la branche haute ----------
  const open = interpolate(frame, [420, 534], [0, 1], ease);
  const squash = 1 - 0.68 * Math.abs(Math.sin(open * Math.PI * 1.5));
  const wheelT = `translate(${WHEEL_CX} ${WHEEL_CY}) scale(${squash.toFixed(3)} 1) translate(${-WHEEL_CX} ${-WHEEL_CY})`;
  // La branche haute (ambre) prend le debit ; la basse s'eteint sans disparaitre (rien n'est tranche).
  const upperTake = interpolate(frame, [438, 542], [0, 1], ease);
  const lowerFade = interpolate(upperTake, [0, 1], [1, 0.3], clampB);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050c1a" }}>
      <svg width={W} height={H} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <defs>
        <linearGradient id="background-gradient" x1="0" y1="0" x2="0" y2="1080" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#0d1f38"/>
        <stop offset="1" stopColor="#050c1a"/>
        </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="#050c1a"/>
        <g transform={`translate(${camX.toFixed(1)}, ${camY.toFixed(1)}) scale(${camZoom.toFixed(3)})`}>
          <g id="pipe-main" fill="none" strokeLinecap="butt" strokeLinejoin="miter">
          <path d="M-20 540 L990 540" stroke="#2E9FD4" strokeWidth="180"/>
          <path d="M-20 540 L990 540" stroke="#050c1a" strokeWidth="88"/>
          <path d="M0 459 L620 459" stroke="#7FD8FF" strokeWidth="8"/>
          <path d="M0 621 L620 621" stroke="#7FD8FF" strokeWidth="8"/>
          </g>
          <g id="branch-upper-anim" opacity={interpolate(split, [0, 1], [0.45, 1], clampB)}>
            <g id="branch-upper" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M905 540 C1020 535 1105 495 1195 392 C1288 286 1375 235 1495 168 C1605 108 1638 68 1695 18 C1765 -44 1830 -76 1935 -112" stroke="#2E9FD4" strokeWidth="118"/>
            <path d="M905 540 C1020 535 1105 495 1195 392 C1288 286 1375 235 1495 168 C1605 108 1638 68 1695 18 C1765 -44 1830 -76 1935 -112" stroke="#050c1a" strokeWidth="76"/>
            <path d="M930 518 C1045 508 1118 456 1216 348 C1308 247 1408 206 1524 138 C1624 80 1654 42 1718 -8 C1785 -62 1846 -92 1940 -126" stroke="#7FD8FF" strokeWidth="8"/>
            <path d="M930 562 C1042 552 1115 507 1214 410 C1311 315 1400 270 1522 202 C1630 142 1667 104 1728 54 C1793 0 1854 -30 1940 -62" stroke="#FFC742" strokeWidth="8"/>
            </g>
          </g>
          <g id="branch-lower-anim" opacity={interpolate(split, [0, 1], [0.45, 1], clampB) * lowerFade}>
            <g id="branch-lower" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M905 540 C1035 558 1082 635 1132 748 C1208 918 1280 1006 1495 1018 C1608 1024 1648 1010 1775 1086 C1855 1134 1902 1164 1970 1178" stroke="#2E9FD4" strokeWidth="118"/>
            <path d="M905 540 C1035 558 1082 635 1132 748 C1208 918 1280 1006 1495 1018 C1608 1024 1648 1010 1775 1086 C1855 1134 1902 1164 1970 1178" stroke="#050c1a" strokeWidth="76"/>
            <path d="M930 518 C1040 530 1114 566 1174 694 C1252 862 1322 910 1485 918 C1620 925 1664 936 1774 1010 C1852 1062 1906 1090 1970 1102" stroke="#7FD8FF" strokeWidth="8"/>
            <path d="M930 562 C1045 578 1076 655 1118 758 C1180 913 1250 984 1488 995 C1616 1001 1656 986 1780 1062 C1862 1112 1915 1138 1970 1148" stroke="#2E9FD4" strokeWidth="8"/>
            </g>
          </g>

          {/* FLUX — un seul trace par conduite, cale sur la vraie ligne centrale (longueurs donnees
              par le modele : main 1090px, upper 1130px, lower 1115px). */}
          <g id="flow" opacity={pressure * 0.9} fill="none" strokeLinecap="round">
            <path id="flow-main" d="M0 540 L990 540" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26 54" strokeDashoffset={flowDash} stroke="#7FD8FF" strokeWidth="7"/>
            <g opacity={upperTake}>
              <path id="flow-upper" d="M950 540 C1058 515 1132 466 1228 360 C1318 260 1400 220 1525 150 C1628 92 1660 54 1720 4 C1790 -54 1850 -84 1935 -118" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26 54" strokeDashoffset={flowDash} stroke="#FFC742" strokeWidth="7"/>
            </g>
            <g opacity={split * (1 - upperTake * 0.8)}>
              <path id="flow-lower" d="M950 540 C1048 562 1110 616 1162 734 C1236 902 1320 938 1490 948 C1626 956 1670 974 1785 1048 C1858 1094 1908 1120 1965 1132" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="26 54" strokeDashoffset={flowDash} stroke="#7FD8FF" strokeWidth="7"/>
            </g>
          </g>

          <g id="valve-body" strokeLinecap="round" strokeLinejoin="round">
          <rect x="590" y="430" width="74" height="220" fill="#2E9FD4"/>
          <rect x="856" y="430" width="74" height="220" fill="#2E9FD4"/>
          <rect x="610" y="450" width="300" height="52" fill="#2E9FD4"/>
          <rect x="610" y="578" width="300" height="52" fill="#2E9FD4"/>
          <rect x="664" y="502" width="192" height="76" fill="#050c1a"/>
          <rect x="604" y="426" width="120" height="8" fill="#7FD8FF"/>
          <rect x="796" y="426" width="120" height="8" fill="#7FD8FF"/>
          <rect x="604" y="646" width="120" height="8" fill="#7FD8FF"/>
          <rect x="796" y="646" width="120" height="8" fill="#7FD8FF"/>
          <rect x="670" y="400" width="180" height="30" fill="#2E9FD4"/>
          <rect x="658" y="416" width="204" height="8" fill="#7FD8FF"/>
          <rect x="658" y="440" width="204" height="8" fill="#7FD8FF"/>
          <rect x="700" y="340" width="120" height="60" fill="#2E9FD4"/>
          <rect x="730" y="340" width="60" height="60" fill="#7FD8FF"/>
          <rect x="720" y="360" width="80" height="40" fill="#2E9FD4"/>
          <rect x="680" y="316" width="160" height="24" fill="#2E9FD4"/>
          <rect x="700" y="310" width="120" height="8" fill="#7FD8FF"/>
          <rect x="724" y="454" width="72" height="172" fill="#7FD8FF"/>
          <rect x="740" y="454" width="40" height="172" fill="#050c1a"/>
          <path d="M724 454 L796 454 L780 626 L740 626 Z" fill="#7FD8FF"/>
          <path d="M744 454 L776 454 L768 626 L752 626 Z" fill="#050c1a"/>
          <path d="M708 512 L812 512" fill="none" stroke="#7FD8FF" strokeWidth="14"/>
          <path d="M702 578 L818 578" fill="none" stroke="#7FD8FF" strokeWidth="14"/>
          </g>
          <g id="valve-wheel-anim" transform={wheelT}>
            <g id="valve-wheel" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="750" y="228" width="20" height="178" fill="#7FD8FF" stroke="none"/>
            <path d="M760 212 L760 388" stroke="#7FD8FF" strokeWidth="20"/>
            <path d="M650 300 L870 300" stroke="#7FD8FF" strokeWidth="20"/>
            <path d="M693 233 L827 367" stroke="#2E9FD4" strokeWidth="16"/>
            <path d="M827 233 L693 367" stroke="#2E9FD4" strokeWidth="16"/>
            <circle cx="760" cy="300" r="36" fill="#2E9FD4" stroke="#7FD8FF" strokeWidth="10"/>
            <circle cx="760" cy="212" r="24" fill="#2E9FD4" stroke="#2E9FD4" strokeWidth="1"/>
            <circle cx="650" cy="300" r="28" fill="#2E9FD4" stroke="#2E9FD4" strokeWidth="1"/>
            <circle cx="870" cy="300" r="28" fill="#2E9FD4" stroke="#2E9FD4" strokeWidth="1"/>
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default GazoducActe5Vannes2;
