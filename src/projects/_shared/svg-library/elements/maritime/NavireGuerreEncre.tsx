/**
 * NavireGuerreEncre — silhouette de navire de guerre (registre encre/gravure, distinct d'un cargo
 * civil : coque anguleuse, tourelles, pas de conteneurs). Extrait de PortSoudanNegociationScene.tsx
 * (Acte 4 Soudan, Beat 2 base navale, mix-and-match Gemini 3.1 Pro navire + GPT-5.6 Sol port/mer,
 * 2026-07-12).
 *
 * 2 exports : NavireGuerreEncre (version détaillée, premier plan) et NavireGuerreSilhouette
 * (version réduite/simplifiée, arrière-plan — sprite partagé via <use>, poser <NavireGuerreDefs/>
 * une seule fois dans un <defs> parent avant d'utiliser NavireGuerreSilhouette).
 *
 * Coordonnées natives : coque ~x873-1679 y391-757 (repère 1920x1080). Bas de coque (ligne de
 * flottaison) ~y728, pont supérieur ~y684-704.
 */
import React from "react";

export const NavireGuerreDefs: React.FC = () => (
  <path id="navireGuerre_silhouette" d="M0 34L28 20H88L105 10H167L180 0H223L235 14H316L344 24L410 30L391 50H54L16 44Z" />
);

export type NavireGuerreEncreProps = {
  /** opacité du sillage arrière (0 = navire à l'arrêt, 1 = en approche) */
  wakeOpacity?: number;
  /** couleur d'accent des lignes de pont (défaut ocre, cohérent registre crépuscule) */
  deckLineColor?: string;
  /** id du pattern hachures à utiliser pour les ombres (doit être défini dans un <defs> parent,
   * ex. <pattern id="navireInk" ...><path d="M0 0V12" stroke="#151d24" strokeWidth={2} opacity={0.45}/></pattern>) */
  hatchPatternId?: string;
};

export const NavireGuerreEncre: React.FC<NavireGuerreEncreProps> = ({ wakeOpacity = 0, deckLineColor = "#c9a877", hatchPatternId = "navireInk" }) => (
  <g id="navire-principal">
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
    <g fill={`url(#${hatchPatternId})`} opacity="0.72">
      <path d="M1049 660L1639 659L1610 720H1073Z" />
      <path d="M1150 540H1272L1314 584H1120Z" />
      <path d="M1304 524H1381L1410 603H1281Z" />
    </g>
    <g fill="none" stroke="#82908b" strokeWidth={3} opacity="0.45">
      <path d="M1160 557L1284 571M1310 540L1392 579" />
    </g>
    {/* sillage arrière — visible seulement pendant l'approche, disparaît à l'arrêt (piloter via wakeOpacity) */}
    <path d="M1655 671C1734 671 1812 690 1887 723M1634 695C1722 701 1796 726 1860 758" fill="none" stroke="#83918c" strokeWidth={8} strokeLinecap="round" opacity={0.58 * wakeOpacity} />
    {/* ligne de pont — accent couleur (ocre par défaut) sur le pont supérieur */}
    <path d="M960 685L1608 684" fill="none" stroke={deckLineColor} strokeWidth={4} opacity="0.55" />
  </g>
);

export type NavireGuerreSilhouetteProps = {
  x: number;
  y: number;
  scale: number;
  opacity?: number;
  deckLineColor?: string;
};

/** Version réduite/simplifiée pour navires secondaires en arrière-plan — nécessite NavireGuerreDefs
 * posé une fois dans un <defs> parent (id "navireGuerre_silhouette"). */
export const NavireGuerreSilhouette: React.FC<NavireGuerreSilhouetteProps> = ({ x, y, scale, opacity = 1, deckLineColor = "#a6997c" }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} fill="#29363d" stroke="#141f25" strokeWidth={5} strokeLinejoin="round">
    <use href="#navireGuerre_silhouette" />
    <path d="M40 8H370" fill="none" stroke={deckLineColor} strokeWidth={4} opacity="0.55" />
    <path d="M115 10V-27H173V10M135-27L147-54L158-27" fill="#29363d" />
    <path d="M234 14V-17H274V14M253-17V-45" fill="#29363d" />
  </g>
);

export default NavireGuerreEncre;
