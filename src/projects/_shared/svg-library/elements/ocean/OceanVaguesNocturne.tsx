/**
 * OceanVaguesNocturne — 2e variante d'océan (registre nocturne/crépuscule froid), alternative à
 * OceanProfondeurVagues (registre chaud Afrique/cargo). Extrait de PortSoudanNegociationScene.tsx
 * (Acte 4 Soudan, Beat 2 base navale, 2026-07-12).
 *
 * Différence de mécanique vs OceanProfondeurVagues : pas de split fond/1er-plan par splitY — ici
 * un unique groupe #mer statique (paths pleins, translate driftX) SURMONTÉ de couches de vagues fines
 * bouclées explicitement (Q...T répétés avec offset modulo), plus des bandes sombres épaisses
 * également bouclées. Permet un océan plus "texturé/multi-couches" qu'une simple translation de bloc.
 *
 * ⚠️ Leçon gravée (ne pas répéter) : le groupe #mer statique (props driftX) contient des paths à
 * géométrie FIXE (début/fin définis, pas prévus pour boucler) — TOUJOURS garder un <rect> de fond
 * NON translaté derrière lui (cf JSX ci-dessous) sinon un vide apparaît quand driftX dépasse la largeur
 * du path. Les couches ajoutées (extraLayers/darkWaveLayers) sont, elles, construites en boucle
 * explicite dès le départ — c'est la bonne méthode pour toute nouvelle couche de vagues destinée à
 * défiler indéfiniment.
 *
 * Usage : poser <defs> avec un gradient id="oceanNoct_sea" (ou passer seaGradientId) AVANT ce composant,
 * puis <OceanVaguesNocturne driftX={...} frame={...} seaGradientId="oceanNoct_sea" />.
 */
import React from "react";

export type OceanVaguesNocturneProps = {
  driftX: number;
  frame: number;
  /** id du <linearGradient> à utiliser pour le fond de mer (doit être défini dans un <defs> parent) */
  seaGradientId: string;
  /** id du <linearGradient> pour le reflet du soleil/lune sur l'eau (optionnel) */
  reflectGradientId?: string;
};

const DEFAULT_EXTRA_LAYERS = [
  { y: 545, width: 1, opacity: 0.22, color: "#ffffff", speed: 0.35 },
  { y: 605, width: 1.5, opacity: 0.28, color: "#ffffff", speed: 0.55 },
  { y: 690, width: 2, opacity: 0.32, color: "#9fae86", speed: 0.75 },
  { y: 780, width: 2.5, opacity: 0.3, color: "#ffffff", speed: 1.05 },
  { y: 900, width: 3, opacity: 0.28, color: "#1b333b", speed: 1.4 },
];

const DEFAULT_DARK_WAVE_LAYERS = [
  { y: 660, width: 8, opacity: 0.9, color: "#263f45", speed: 1.6 },
  { y: 736, width: 12, opacity: 1, color: "#203941", speed: 1.9 },
  { y: 832, width: 17, opacity: 1, color: "#1b333b", speed: 2.3 },
  { y: 950, width: 24, opacity: 1, color: "#142b34", speed: 2.7 },
];

export const OceanVaguesNocturne: React.FC<OceanVaguesNocturneProps> = ({
  driftX,
  frame,
  seaGradientId,
  reflectGradientId,
}) => {
  return (
    <>
      {/* fond solide NON translaté — évite tout trou visible quel que soit driftX */}
      <rect x={0} y={520} width={1920} height={560} fill={`url(#${seaGradientId})`} />
      <g id="mer" transform={`translate(${driftX} 0)`}>
        <path d="M0 520C267 506 451 526 680 520C923 513 1092 501 1326 512C1536 522 1710 507 1920 516V1080H0Z" fill={`url(#${seaGradientId})`} />
        {reflectGradientId && (
          <path d="M700 521C832 534 949 557 1045 598C1155 646 1195 720 1270 865C1169 816 1085 796 982 789C1037 708 994 642 918 603C846 566 775 545 700 521Z" fill={`url(#${reflectGradientId})`} />
        )}
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
        {DEFAULT_EXTRA_LAYERS.map((layer, i) => {
          const offset = (frame * layer.speed) % 240;
          const d = `M ${-240 - offset} ${layer.y} Q ${-120 - offset} ${layer.y - 6} ${0 - offset} ${layer.y} T ${240 - offset} ${layer.y} T ${480 - offset} ${layer.y} T ${720 - offset} ${layer.y} T ${960 - offset} ${layer.y} T ${1200 - offset} ${layer.y} T ${1440 - offset} ${layer.y} T ${1680 - offset} ${layer.y} T ${1920 - offset} ${layer.y} T ${2160 - offset} ${layer.y}`;
          return <path key={i} d={d} fill="none" stroke={layer.color} strokeWidth={layer.width} opacity={layer.opacity} />;
        })}
      </g>
      {/* bandes de vagues sombres 1er plan — bouclées explicitement (ne jamais reprendre la version
          statique à début/fin fixes, elle se coupe visuellement quand driftX avance) */}
      <g strokeLinecap="round">
        {DEFAULT_DARK_WAVE_LAYERS.map((layer, i) => {
          const offset = (frame * layer.speed) % 340;
          const d = `M ${-340 - offset} ${layer.y} C ${-210 - offset} ${layer.y - 30} ${-100 - offset} ${layer.y + 30} ${20 - offset} ${layer.y - 4} S ${260 - offset} ${layer.y - 26} ${360 - offset} ${layer.y - 2} S ${590 - offset} ${layer.y - 32} ${700 - offset} ${layer.y - 2} S ${940 - offset} ${layer.y - 30} ${1040 - offset} ${layer.y - 4} S ${1280 - offset} ${layer.y - 28} ${1380 - offset} ${layer.y - 2} S ${1620 - offset} ${layer.y - 30} ${1720 - offset} ${layer.y - 2} S ${1960 - offset} ${layer.y - 28} ${2060 - offset} ${layer.y - 2} S ${2300 - offset} ${layer.y - 30} ${2400 - offset} ${layer.y - 4}`;
          return <path key={i} d={d} fill="none" stroke={layer.color} strokeWidth={layer.width} opacity={layer.opacity} />;
        })}
      </g>
    </>
  );
};

export default OceanVaguesNocturne;
