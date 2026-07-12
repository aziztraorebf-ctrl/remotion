/**
 * PortSoudanNegociationScene — insert SVG plein écran, Beat 2 Acte 4 (base navale Port-Soudan).
 *
 * Registre "scène narrative" (pas un diagramme symbolique) : un navire de guerre russe navigue depuis
 * la droite vers un port déjà visible, se stabilise, tangue/roule sur une mer vivante — la voix off
 * porte SEULE les chiffres de l'accord (25 ans/300 soldats/4 navires/propulsion nucléaire), aucun
 * cartouche texte ne les répète (retour Aziz+Gemini+Kimi 2026-07-12 : redondance audio-visuelle qui
 * infantilise, l'apparition des 3 navires secondaires porte déjà "quatre navires" visuellement).
 *
 * Origine des assets : mix-and-match GPT-5.6 Sol (port/ciel/mer/navires-secondaires, prompt unique
 * "carte de guerre/gravure encre") + Gemini 3.1 Pro (navire-principal, silhouette militaire jugée
 * supérieure). Validé Aziz sur out/_rnd/soudan-acte4-beat2/test-render-v2.mp4.
 *
 * ⚠️ 2026-07-12 (leçon gravée) : une 1ère tentative de "vivifier" l'océan avait REMPLACÉ la mer Sol
 * d'origine par le composant partagé OceanProfondeurVagues — mauvaise géométrie (y=720 en dur dans
 * ce composant vs y=520 dans le fichier Sol validé), a cassé le raccord visuel port/mer et exigé
 * plusieurs rounds de rafistolage sans jamais retrouver le rendu validé. Corrigé en revenant à la
 * géométrie Sol d'origine intacte et en AJOUTANT des couches de vagues par-dessus (vitesses variées,
 * opacités dégressives) plutôt qu'en importimportant un système externe. Règle : enrichir l'existant
 * validé, ne pas le remplacer par un système qui semble "déjà prouvé ailleurs" si sa géométrie diffère.
 *
 * Corrections 2026-07-12 (retour Aziz + revue croisée Gemini/Kimi) :
 * - Cartouches texte + halo "propulsion nucléaire" SUPPRIMÉS (redondance avec la voix / effet "power-up").
 * - Tangage/roulis du navire ajoutés, MODÉRÉS (1ère tentative jugée "trop exagérée" par Aziz, réduite).
 * - Ligne de pont ocre RECALÉE sur le pont réel (était trop basse, lisait comme un défaut de rendu).
 * - Port animé : lumières scintillantes + léger pivot des grues (demande explicite Aziz).
 * - Océan enrichi in-place : couches de vagues supplémentaires à vitesses différentes (parallaxe),
 *   sur la géométrie/couleurs Sol d'origine intactes (pas de remplacement de composant).
 *
 * Timing : cf soudanActe4Timing.ts BEAT2 (frames RELATIVES à la section, section offset géré par le parent).
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── defs partagés (gradients + patterns + shape navire secondaire) — REPRIS TELS QUELS du SVG Sol validé ──
const DEFS = (
  <defs>
    <linearGradient id="a4b2_sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a3d54" />
      <stop offset="0.48" stopColor="#5d6f85" />
      <stop offset="0.8" stopColor="#c29a6e" />
      <stop offset="1" stopColor="#dcb684" />
    </linearGradient>
    <linearGradient id="a4b2_sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6d8886" />
      <stop offset="0.45" stopColor="#3f6167" />
      <stop offset="1" stopColor="#233f47" />
    </linearGradient>
    <linearGradient id="a4b2_sunrefl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c2a772" stopOpacity="0.5" />
      <stop offset="1" stopColor="#8d7958" stopOpacity="0" />
    </linearGradient>
    <pattern id="a4b2_ink" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
      <path d="M0 0V12" fill="none" stroke="#151d24" strokeWidth="2" opacity="0.45" />
    </pattern>
    <pattern id="a4b2_light" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(70)">
      <path d="M0 0V16" fill="none" stroke="#d0b67f" strokeWidth="1.5" opacity="0.22" />
    </pattern>
    <path id="a4b2_secship" d="M0 34L28 20H88L105 10H167L180 0H223L235 14H316L344 24L410 30L391 50H54L16 44Z" />
  </defs>
);

const Ciel: React.FC = () => (
  <g id="ciel">
    <rect width={1920} height={575} fill="url(#a4b2_sky)" />
    <path d="M0 404C190 368 333 395 485 382C638 369 760 331 924 349C1097 368 1210 401 1396 382C1578 364 1739 328 1920 353V518H0Z" fill="#c0a16f" opacity="0.12" />
    <g fill="none" stroke="#c8b184" strokeLinecap="round">
      <path d="M104 210C244 178 378 190 504 226" strokeWidth={3} opacity="0.22" />
      <path d="M131 226C271 199 385 210 462 239" strokeWidth={2} opacity="0.18" />
      <path d="M693 171C819 139 957 151 1082 190" strokeWidth={3} opacity="0.16" />
      <path d="M720 188C834 162 934 171 1038 202" strokeWidth={2} opacity="0.18" />
      <path d="M1310 255C1479 212 1639 220 1785 260" strokeWidth={3} opacity="0.2" />
      <path d="M1352 271C1482 242 1617 247 1741 277" strokeWidth={2} opacity="0.18" />
    </g>
    <path d="M82 236C219 202 356 209 490 245M680 197C819 159 949 170 1082 211M1301 282C1454 239 1630 244 1802 286" fill="none" stroke="url(#a4b2_light)" strokeWidth={17} opacity="0.45" />
  </g>
);

/** Grue portuaire animée : léger pivot de la flèche SEULE autour du sommet du mât. Coordonnées
 * reprises telles quelles du SVG Sol validé (bug corrigé 2026-07-12 : une version antérieure avait
 * réinventé des coordonnées locales approximatives -> silhouette cassée). */
const Grue1: React.FC<{ swing: number }> = ({ swing }) => (
  <g fill="none" stroke="#1a242a" strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter">
    <path d="M316 452V292H336V452" />
    <g transform={`rotate(${swing} 326 299)`}>
      <path d="M326 299L461 331" />
      <path d="M352 311L326 343L384 321L326 382L418 321L326 423" />
    </g>
  </g>
);
const Grue2: React.FC<{ swing: number }> = ({ swing }) => (
  <g fill="none" stroke="#1a242a" strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter">
    <path d="M742 444V270H762V444" />
    <g transform={`rotate(${swing} 752 279)`}>
      <path d="M752 279L893 311" />
      <path d="M778 289L752 326L814 296L752 369L852 302L752 414" />
    </g>
  </g>
);

const Horizon: React.FC<{ frame: number }> = ({ frame }) => {
  // pivot des grues RETIRÉ (retour Aziz 2026-07-12 : arrière-plan reste tel quel) — grues figées.
  const swing1 = 0;
  const swing2 = 0;
  // lumières de quai : scintillement doux, déphasées entre elles (pas synchronisées = plus organique)
  const lightBlink = (phase: number) => 0.45 + 0.4 * Math.max(0, Math.sin(frame / 26 + phase));

  return (
    <g id="horizon">
      <path d="M0 500C181 481 337 489 489 474C650 459 795 467 937 482C1090 499 1240 486 1397 476C1584 464 1733 478 1920 461V575H0Z" fill="#344047" stroke="#18232a" strokeWidth={4} />
      <path d="M0 504C176 486 333 494 487 480C643 465 793 474 938 489C1093 506 1237 493 1401 482C1585 471 1740 485 1920 468" fill="none" stroke="#b09467" strokeWidth={3} opacity="0.55" />
      <g fill="#27333a" stroke="#151e24" strokeWidth={4} strokeLinejoin="round">
        <path d="M64 439H211V501H64Z" />
        <path d="M78 420H186L207 439H63Z" />
        <path d="M249 451H397V498H249Z" />
        <path d="M276 427H363V451H276Z" />
        <path d="M448 414H614V493H448Z" />
        <path d="M471 391H589L614 414H448Z" />
        <path d="M679 446H820V489H679Z" />
        <path d="M704 420H788V446H704Z" />
      </g>
      <g fill="url(#a4b2_ink)" opacity="0.68">
        <path d="M64 439H211V501H64Z" />
        <path d="M249 451H397V498H249Z" />
        <path d="M448 414H614V493H448Z" />
        <path d="M679 446H820V489H679Z" />
      </g>
      {/* grues — flèche seule pivote autour du sommet du mât */}
      <Grue1 swing={swing1} />
      <Grue2 swing={swing2} />
      <g fill="none" stroke="#8d7858" strokeWidth={2} opacity="0.58">
        <path d="M316 321L336 343M316 361L336 383M316 401L336 423M742 302L762 324M742 344L762 366M742 386L762 408" />
      </g>
      <path d="M0 498L865 498L1010 520L1010 548L0 548Z" fill="#222f35" stroke="#151f24" strokeWidth={5} />
      <path d="M55 510H965M112 526H995" fill="none" stroke="#8e7b5f" strokeWidth={3} opacity="0.48" />
      <g fill="#1d282e">
        <path d="M1091 458H1166V497H1091Z" />
        <path d="M1202 443H1308V495H1202Z" />
        <path d="M1362 462H1435V490H1362Z" />
        <path d="M1501 429H1634V486H1501Z" />
        <path d="M1697 449H1800V480H1697Z" />
      </g>
      <g fill="none" stroke="#151f24" strokeWidth={4}>
        <path d="M1045 494V435M1034 435H1057M1459 488V422M1448 422H1470M1826 478V414M1815 414H1837" />
      </g>
      {/* lumières de quai scintillantes — petites, discrètes, déphasées */}
      <g>
        <circle cx={1128} cy={452} r={4} fill="#f2c98a" opacity={lightBlink(0)} />
        <circle cx={1255} cy={437} r={4} fill="#f2c98a" opacity={lightBlink(1.1)} />
        <circle cx={1567} cy={423} r={4} fill="#f2c98a" opacity={lightBlink(2.3)} />
        <circle cx={1748} cy={443} r={4} fill="#f2c98a" opacity={lightBlink(0.6)} />
      </g>
    </g>
  );
};

/**
 * Mer — géométrie/couleurs REPRISES TELLES QUELLES du SVG Sol validé (y=520+, aucun changement).
 * Enrichissement demandé (Kimi "océan vivant", Aziz validé) : couches de vagues SUPPLÉMENTAIRES
 * ajoutées PAR-DESSUS les paths d'origine, chacune à une vitesse de dérive différente (parallaxe),
 * sans toucher à la géométrie de base ni au raccord avec le port.
 */
const Mer: React.FC<{ driftX: number; frame: number }> = ({ driftX, frame }) => {
  // couches supplémentaires de vagues fines, vitesses variées (parallaxe), déphasées de driftX de base
  const extraLayers = [
    { y: 545, width: 1, opacity: 0.22, color: "#ffffff", speed: 0.35 },
    { y: 605, width: 1.5, opacity: 0.28, color: "#ffffff", speed: 0.55 },
    { y: 690, width: 2, opacity: 0.32, color: "#9fae86", speed: 0.75 },
    { y: 780, width: 2.5, opacity: 0.3, color: "#ffffff", speed: 1.05 },
    { y: 900, width: 3, opacity: 0.28, color: "#1b333b", speed: 1.4 },
  ];

  // Bandes de vagues sombres premier-plan — retirées du groupe #mer statique (elles avaient un début/fin
  // FIXES, jamais prévues pour boucler ; translatées avec driftX, leur extrémité sortait du cadre et
  // laissait un vide, retour Aziz "les bandes se coupent"). Reconstruites en boucle explicite, même
  // couleurs/épaisseurs d'origine, vitesses de dérive progressivement plus rapides vers le 1er plan.
  const darkWaveLayers = [
    { y: 660, width: 8, opacity: 0.9, color: "#263f45", speed: 1.6 },
    { y: 736, width: 12, opacity: 1, color: "#203941", speed: 1.9 },
    { y: 832, width: 17, opacity: 1, color: "#1b333b", speed: 2.3 },
    { y: 950, width: 24, opacity: 1, color: "#142b34", speed: 2.7 },
  ];

  return (
    <>
      {/* fond solide NON translaté — évite tout trou visible quel que soit driftX (bug parallaxe
          classique déjà rencontré, cf buildHorizonPath "overflow" doctrine motion.ts) */}
      <rect x={0} y={520} width={1920} height={560} fill="url(#a4b2_sea)" />
      <g id="mer" transform={`translate(${driftX} 0)`}>
        <path d="M0 520C267 506 451 526 680 520C923 513 1092 501 1326 512C1536 522 1710 507 1920 516V1080H0Z" fill="url(#a4b2_sea)" />
        <path d="M700 521C832 534 949 557 1045 598C1155 646 1195 720 1270 865C1169 816 1085 796 982 789C1037 708 994 642 918 603C846 566 775 545 700 521Z" fill="url(#a4b2_sunrefl)" />
        <g fill="none" strokeLinecap="round">
          <path d="M18 556C100 540 163 568 244 553S392 565 476 549S625 562 715 548M814 557C912 540 986 567 1078 552S1242 565 1337 550M1434 558C1537 541 1622 568 1712 552S1841 562 1902 552" stroke="#a9a080" strokeWidth={3} opacity="0.48" />
          <path d="M38 596C134 574 211 614 314 590S496 612 598 590M679 606C792 578 884 619 1005 592S1210 615 1320 590M1403 607C1511 581 1631 618 1742 592S1850 598 1918 589" stroke="#87928a" strokeWidth={5} opacity="0.62" />
        </g>
        <g fill="none" stroke="#aa9872" strokeLinecap="round" opacity="0.34">
          <path d="M770 576C835 565 892 574 948 588" strokeWidth={4} />
          <path d="M810 628C884 613 956 632 1015 653" strokeWidth={5} />
          <path d="M874 702C955 682 1037 711 1091 743" strokeWidth={6} />
        </g>
      </g>
      {/* couches supplémentaires — chacune à SA propre vitesse de dérive (parallaxe réel), courbes
          douces répétées en boucle horizontale */}
      <g>
        {extraLayers.map((layer, i) => {
          const offset = (frame * layer.speed) % 240;
          const d = `M ${-240 - offset} ${layer.y} Q ${-120 - offset} ${layer.y - 6} ${0 - offset} ${layer.y} T ${240 - offset} ${layer.y} T ${480 - offset} ${layer.y} T ${720 - offset} ${layer.y} T ${960 - offset} ${layer.y} T ${1200 - offset} ${layer.y} T ${1440 - offset} ${layer.y} T ${1680 - offset} ${layer.y} T ${1920 - offset} ${layer.y} T ${2160 - offset} ${layer.y}`;
          return <path key={i} d={d} fill="none" stroke={layer.color} strokeWidth={layer.width} opacity={layer.opacity} />;
        })}
      </g>
      {/* bandes de vagues sombres 1er plan — reconstruites en boucle explicite (retour Aziz "elles se
          coupent"), même couleurs/épaisseurs que le SVG source d'origine */}
      <g strokeLinecap="round">
        {darkWaveLayers.map((layer, i) => {
          const offset = (frame * layer.speed) % 340;
          const d = `M ${-340 - offset} ${layer.y} C ${-210 - offset} ${layer.y - 30} ${-100 - offset} ${layer.y + 30} ${20 - offset} ${layer.y - 4} S ${260 - offset} ${layer.y - 26} ${360 - offset} ${layer.y - 2} S ${590 - offset} ${layer.y - 32} ${700 - offset} ${layer.y - 2} S ${940 - offset} ${layer.y - 30} ${1040 - offset} ${layer.y - 4} S ${1280 - offset} ${layer.y - 28} ${1380 - offset} ${layer.y - 2} S ${1620 - offset} ${layer.y - 30} ${1720 - offset} ${layer.y - 2} S ${1960 - offset} ${layer.y - 28} ${2060 - offset} ${layer.y - 2} S ${2300 - offset} ${layer.y - 30} ${2400 - offset} ${layer.y - 4}`;
          return <path key={i} d={d} fill="none" stroke={layer.color} strokeWidth={layer.width} opacity={layer.opacity} />;
        })}
      </g>
    </>
  );
};

const SecondaryShip: React.FC<{ x: number; y: number; scale: number; opacity: number }> = ({ x, y, scale, opacity }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} fill="#29363d" stroke="#141f25" strokeWidth={5} strokeLinejoin="round">
    <use href="#a4b2_secship" />
    <path d="M40 8H370" fill="none" stroke="#a6997c" strokeWidth={4} opacity="0.55" />
    <path d="M115 10V-27H173V10M135-27L147-54L158-27" fill="#29363d" />
    <path d="M234 14V-17H274V14M253-17V-45" fill="#29363d" />
  </g>
);

const NaviresSecondaires: React.FC<{ opacity: number }> = ({ opacity }) => (
  <g id="navires-secondaires">
    <SecondaryShip x={774} y={515} scale={0.65} opacity={opacity} />
    <SecondaryShip x={1115} y={488} scale={0.62} opacity={opacity} />
    <SecondaryShip x={1507} y={523} scale={0.67} opacity={opacity} />
  </g>
);

const NavirePrincipal: React.FC<{ x: number; wakeOpacity: number }> = ({ x, wakeOpacity }) => (
  <g id="navire-principal" transform={`translate(${x} 0)`}>
    <path d="M873 670L949 627L1109 613L1168 587L1317 584L1378 607L1557 617L1679 648L1628 728L1050 728L950 704L895 692Z" fill="#29343b" stroke="#111a20" strokeWidth={8} strokeLinejoin="round" />
    <path d="M1049 728H1628L1607 757H1100L1035 742Z" fill="#17262d" stroke="#10191e" strokeWidth={6} />
    <path d="M927 664L1608 659" fill="none" stroke="#9a896c" strokeWidth={4} opacity="0.65" />
    <path d="M1117 612L1148 536H1275L1317 584Z" fill="#39454a" stroke="#131d22" strokeWidth={7} strokeLinejoin="round" />
    <path d="M1171 536L1190 485H1243L1263 536Z" fill="#303d43" stroke="#131d22" strokeWidth={6} />
    <path d="M1278 586L1302 520H1384L1414 605Z" fill="#344148" stroke="#131d22" strokeWidth={7} />
    <path d="M1326 520L1342 458H1361L1377 520Z" fill="#253239" stroke="#131d22" strokeWidth={6} />
    <path d="M1352 458V391M1309 431H1397M1323 414H1382" fill="none" stroke="#161f24" strokeWidth={7} strokeLinecap="square" />
    <path d="M1288 422L1352 391L1413 425L1352 445Z" fill="none" stroke="#2a353a" strokeWidth={5} />
    <path d="M1352 391L1352 367M1340 367H1364" fill="none" stroke="#161f24" strokeWidth={5} />
    <g fill="#222e34" stroke="#111a20" strokeWidth={6} strokeLinejoin="round">
      <path d="M990 622L1011 586H1077L1102 615Z" />
      <path d="M1009 587L992 568H1061L1077 586Z" />
      <path d="M1435 613L1455 577H1519L1542 615Z" />
    </g>
    <g fill="none" stroke="#151e23" strokeWidth={9} strokeLinecap="round">
      <path d="M1020 574L961 542" />
      <path d="M1474 578L1538 552" />
    </g>
    <path d="M1181 551H1258M1309 551H1393" fill="none" stroke="#a6997c" strokeWidth={3} opacity="0.55" />
    <path d="M966 685L1608 684M1016 704L1583 704" fill="none" stroke="#111b20" strokeWidth={4} opacity="0.75" />
    <g fill="url(#a4b2_ink)" opacity="0.72">
      <path d="M1049 660L1639 659L1610 720H1073Z" />
      <path d="M1150 540H1272L1314 584H1120Z" />
      <path d="M1304 524H1381L1410 603H1281Z" />
    </g>
    <g fill="none" stroke="#82908b" strokeWidth={3} opacity="0.45">
      <path d="M1160 557L1284 571M1310 540L1392 579" />
    </g>
    {/* sillage arrière — visible seulement pendant l'approche, disparaît à l'arrêt */}
    <path d="M1655 671C1734 671 1812 690 1887 723M1634 695C1722 701 1796 726 1860 758" fill="none" stroke="#83918c" strokeWidth={8} strokeLinecap="round" opacity={0.58 * wakeOpacity} />
    {/* ligne de pont ocre — recalée sur le pont supérieur réel */}
    <path d="M960 685L1608 684" fill="none" stroke="#c9a877" strokeWidth={4} opacity="0.55" />
  </g>
);

export type PortSoudanNegociationSceneProps = {
  frame: number;
  // frames RELATIVES à la section (mêmes ancrages que F2 dans SoudanActe4.tsx)
  portSoudanNomme: number;
  vingtCinqAns: number;
  troisCentsSoldats: number;
  quatreNavires: number;
  propulsionNucleaire: number;
  soudanPasSigne: number;
  end: number;
};

export const PORT_SOUDAN_SCENE_ENTER_FRAMES = 160; // ~5.3s, navire glisse depuis la droite jusqu'à portSoudanNomme

export const PortSoudanNegociationScene: React.FC<PortSoudanNegociationSceneProps> = (props) => {
  const { frame, portSoudanNomme, vingtCinqAns, troisCentsSoldats, quatreNavires, propulsionNucleaire, soudanPasSigne, end } = props;
  void vingtCinqAns;
  void troisCentsSoldats;
  void propulsionNucleaire;
  void soudanPasSigne;
  void end;

  // Phase 1 : le navire glisse depuis la droite (hors-cadre) jusqu'à sa position stabilisée à portSoudanNomme.
  const shipEnterX = interpolate(frame, [0, portSoudanNomme], [520, 0], clamp);

  // Tangage/roulis MODÉRÉS (retour Aziz : 1ère tentative "un peu trop exagérée", réduite ~40%).
  const roll = Math.sin(frame / 24) * 1.8;
  const pitch = Math.sin(frame / 32) * 6;

  // Mer : dérive continue (parallaxe), ralentit légèrement une fois le navire stabilisé.
  const seaSpeed = interpolate(frame, [0, portSoudanNomme], [2.4, 1.1], clamp);
  const driftX = -((frame * seaSpeed) % 1920);

  // Sillage arrière : visible seulement pendant l'approche, disparaît une fois le navire stabilisé.
  const wakeOpacity = interpolate(frame, [0, portSoudanNomme - 20, portSoudanNomme], [1, 1, 0], clamp);

  const navSecOpacity = interpolate(frame, [quatreNavires, quatreNavires + 20], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#1c2536" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        {DEFS}
        <Ciel />
        <Horizon frame={frame} />
        <Mer driftX={driftX} frame={frame} />
        <NaviresSecondaires opacity={navSecOpacity} />
        <g transform={`translate(0 ${pitch}) rotate(${roll} 1250 700)`}>
          <NavirePrincipal x={shipEnterX} wakeOpacity={wakeOpacity} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default PortSoudanNegociationScene;
