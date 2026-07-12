/**
 * PortMilitaireEncre — silhouette de port industriel/militaire (quais, grues, bâtiments, jetée),
 * registre encre/gravure crépuscule-nuit. Extrait de PortSoudanNegociationScene.tsx (Acte 4 Soudan,
 * Beat 2 base navale, GPT-5.6 Sol, 2026-07-12 — jugé "excellent, très lisible" par Aziz).
 *
 * 2 grues incluses, coordonnées natives (x316/x742), chacune peut pivoter légèrement via la prop
 * `swing1`/`swing2` (rotation de la flèche SEULE autour du sommet du mât — ne jamais réinventer les
 * coordonnées de la flèche, toujours repartir de M316 452V292.../M742 444V270... ci-dessous, une
 * version antérieure avait cassé la silhouette en approximant des coordonnées locales).
 *
 * ⚠️ Sur CET usage précis (Beat 2 Acte 4), le pivot des grues a été explicitement RETIRÉ par Aziz
 * ("laisser l'arrière-plan tel quel") — swing1/swing2 par défaut à 0. Les activer est possible pour
 * un futur usage qui en aurait besoin, mais ce n'est PAS le comportement par défaut souhaité ici.
 *
 * Lumières de quai scintillantes optionnelles (4 points, déphasés) via `showLights`.
 */
import React from "react";

export type PortMilitaireEncreProps = {
  frame: number;
  /** angle de pivot de la flèche de la grue 1 (degrés). Défaut 0 = figée (retour Aziz 2026-07-12). */
  swing1?: number;
  /** angle de pivot de la flèche de la grue 2 (degrés). Défaut 0 = figée. */
  swing2?: number;
  /** id du pattern hachures (doit être défini dans un <defs> parent) */
  hatchPatternId?: string;
  showLights?: boolean;
};

export const PortMilitaireEncre: React.FC<PortMilitaireEncreProps> = ({
  frame,
  swing1 = 0,
  swing2 = 0,
  hatchPatternId = "portInk",
  showLights = true,
}) => {
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
      <g fill={`url(#${hatchPatternId})`} opacity="0.68">
        <path d="M64 439H211V501H64Z" />
        <path d="M249 451H397V498H249Z" />
        <path d="M448 414H614V493H448Z" />
        <path d="M679 446H820V489H679Z" />
      </g>
      {/* grue 1 — flèche seule pivote autour du sommet du mât (326, 299) */}
      <g fill="none" stroke="#1a242a" strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter">
        <path d="M316 452V292H336V452" />
        <g transform={`rotate(${swing1} 326 299)`}>
          <path d="M326 299L461 331" />
          <path d="M352 311L326 343L384 321L326 382L418 321L326 423" />
        </g>
      </g>
      {/* grue 2 — flèche seule pivote autour du sommet du mât (752, 279) */}
      <g fill="none" stroke="#1a242a" strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter">
        <path d="M742 444V270H762V444" />
        <g transform={`rotate(${swing2} 752 279)`}>
          <path d="M752 279L893 311" />
          <path d="M778 289L752 326L814 296L752 369L852 302L752 414" />
        </g>
      </g>
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
      {showLights && (
        <g>
          <circle cx={1128} cy={452} r={4} fill="#f2c98a" opacity={lightBlink(0)} />
          <circle cx={1255} cy={437} r={4} fill="#f2c98a" opacity={lightBlink(1.1)} />
          <circle cx={1567} cy={423} r={4} fill="#f2c98a" opacity={lightBlink(2.3)} />
          <circle cx={1748} cy={443} r={4} fill="#f2c98a" opacity={lightBlink(0.6)} />
        </g>
      )}
    </g>
  );
};

export default PortMilitaireEncre;
