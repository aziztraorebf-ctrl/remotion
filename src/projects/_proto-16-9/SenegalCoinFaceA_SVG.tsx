/**
 * SenegalCoinFaceA_SVG — gravure Face A "malediction" SVG VECTORIEL ANIME PAR PARTIES.
 *
 * Voie "stylise animable" (prouvee 2026-06-21). Source : Gemini 3.1 Pro V3, intent-driven
 * (compo pensee pour le geste : derrick a gauche, gros navire centre-droit proue a droite avec
 * espace pour sortir du cadre). Groupes : #bg #derrick (#pumphead) #ship #waves #rim.
 *
 * Animation calee sur la voix "des multinationales qui pompent et repartent" :
 *   - pumpProgress 0->1 : le derrick POMPE (pumphead monte/descend) pendant "pompent".
 *   - sailProgress 0->1 : le navire CHARGE (descend dans l'eau) puis REPART (glisse a droite, hors cadre).
 *   - les vagues ondulent en continu (l'ocean respire).
 *   - bloodProgress 0->1 (optionnel) : la mer vire au rouge sang (malediction). Defaut 0.
 */
import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

const RED = "#8a2a20";

export interface CoinFaceAProps {
  /** 0 = repos, 1 = navire charge puis reparti (avance legere + fade, jamais hors cadre) */
  sailProgress?: number;
  /** intensite du pompage (0 = arret, 1 = actif) */
  pumpActive?: number;
  /** 0 = mer doree, 1 = mer noircie (petrole). DEMO mallaeabilite couleur. */
  oilSpread?: number;
  /** 0 = derrick or, 1 = derrick rouge incandescent + pulse. */
  derrickHeat?: number;
  /** 0 = piece intacte, 1 = oxydee/ternie (desaturation+assombrissement global). */
  oxidize?: number;
  /** 0 = pas de goutte, 1 = une goutte de petrole tombe du pumphead et tache l'eau (cycle). */
  oilDrop?: number;
}

// melange lineaire de 2 couleurs hex
const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

export const SenegalCoinFaceA_SVG: React.FC<CoinFaceAProps> = ({ sailProgress = 0, pumpActive = 1, oilSpread = 0, derrickHeat = 0, oxidize = 0, oilDrop = 0 }) => {
  const frame = useCurrentFrame();
  // ocean qui respire — amplitude monte legerement avec oilDrop (la mer "fremit" avant de noircir)
  const shimmer = 1 + oilDrop * 0.8;
  const waveY = Math.sin(frame / 14) * 5 * shimmer;
  // derrick pompe (pumphead monte/descend) — amplitude pilotee par pumpActive
  const pump = Math.sin(frame / 7) * 10 * pumpActive;
  // nuages : derive lente continue (vie de fond sur toute la Face A), vitesses differentes
  const cloud1X = Math.sin(frame / 90) * 22;          // nuage gauche, lent
  const cloud2X = Math.sin(frame / 70 + 1.5) * 30;    // nuage droite, un peu plus ample
  // goutte de petrole : tombe du pumphead (~x200) vers la mer, en cycle de 36 frames quand oilDrop>0
  const dropCycle = (frame % 36) / 36;
  const dropY = 235 + dropCycle * 360;     // de la tete de pompe vers l'eau
  const dropVisible = oilDrop > 0.1 ? (1 - dropCycle) : 0;
  const splash = oilDrop > 0.1 && dropCycle > 0.85 ? (dropCycle - 0.85) / 0.15 : 0;

  // === COULEURS PILOTABLES (preuve de mallaeabilite SVG) ===
  // mer : or -> noir petrole
  const seaFill = mix("#e7bd78", "#140d04", oilSpread);
  const seaStroke = mix(RED, "#000000", oilSpread * 0.7);
  // derrick : rouge patine -> rouge incandescent qui pulse
  const heatPulse = derrickHeat * (0.6 + 0.4 * (Math.sin(frame / 5) + 1) / 2);
  const derrickStroke = mix(RED, "#ff4520", heatPulse);
  const derrickGlow = derrickHeat > 0.02 ? `drop-shadow(0 0 ${8 + heatPulse * 14}px rgba(255,80,30,${0.5 * heatPulse}))` : "none";
  // oxydation globale : desature + assombrit la piece entiere
  const oxidizeFilter = oxidize > 0.02 ? `saturate(${1 - oxidize * 0.75}) brightness(${1 - oxidize * 0.4})` : "none";
  // navire : charge (s'enfonce) sur la 1ere moitie, puis REPART = avance LEGEREMENT + FADE OUT.
  // GOTCHA (Aziz 2026-06-21) : NE JAMAIS sortir un element du cadre clippe (le clipPath le tranche
  // = artefact "navire coupe/qui bave sur le fond"). "Repart" = petit deplacement + disparition progressive.
  const shipSink = interpolate(sailProgress, [0, 0.5], [0, 14], { extrapolateRight: "clamp" });
  const shipX = interpolate(sailProgress, [0.5, 1], [0, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // avance LEGERE seulement
  const shipOpacity = interpolate(sailProgress, [0.55, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // fade out = "repart"

  return (
    <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ position: "absolute", inset: 0, filter: oxidizeFilter }}>
      <defs>
        <radialGradient id="coinGradA" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
          <stop offset="0%" stopColor="#e7bd78" /><stop offset="75%" stopColor="#dca95e" /><stop offset="100%" stopColor="#bf9442" />
        </radialGradient>
        <clipPath id="coinClipA"><circle cx="512" cy="512" r="480" /></clipPath>
      </defs>

      <g id="bg" clipPath="url(#coinClipA)">
        <circle cx="512" cy="512" r="480" fill="url(#coinGradA)" />
        <path d="M0 30L1024 30 M0 90L1024 90 M0 150L1024 150 M0 210L1024 210 M0 270L1024 270 M0 330L1024 330 M0 390L1024 390 M0 450L1024 450 M0 510L1024 510 M0 570L1024 570 M0 630L1024 630" stroke={RED} strokeWidth="1" opacity="0.3" />
        {/* nuages : derive lente continue = vie de fond sur toute la Face A */}
        <path transform={`translate(${cloud1X} 0)`} d="M 200 120 C 230 100, 270 100, 300 120 C 340 110, 380 130, 380 160 C 380 180, 350 200, 310 200 L 180 200 C 150 200, 140 170, 160 150 C 150 130, 170 110, 200 120 Z" fill="#e7bd78" stroke={RED} strokeWidth="2" />
        <path transform={`translate(${cloud2X} 0)`} d="M 700 180 C 730 160, 770 160, 800 180 C 840 170, 880 190, 880 220 C 880 240, 850 260, 810 260 L 680 260 C 650 260, 640 230, 660 210 C 650 190, 670 170, 700 180 Z" fill="#e7bd78" stroke={RED} strokeWidth="2" />
      </g>

      <g id="derrick" clipPath="url(#coinClipA)" style={{ filter: derrickGlow }}>
        <rect x="120" y="580" width="160" height="20" fill="#e7bd78" stroke={derrickStroke} strokeWidth="4" strokeLinejoin="round" />
        <path d="M 140 580 L 180 240 L 220 240 L 260 580 Z" fill="#e7bd78" stroke={derrickStroke} strokeWidth="4" strokeLinejoin="round" />
        <line x1="148" y1="520" x2="252" y2="520" stroke={derrickStroke} strokeWidth="3" />
        <line x1="156" y1="460" x2="244" y2="460" stroke={derrickStroke} strokeWidth="3" />
        <line x1="164" y1="400" x2="236" y2="400" stroke={derrickStroke} strokeWidth="3" />
        <line x1="171" y1="340" x2="229" y2="340" stroke={derrickStroke} strokeWidth="3" />
        <path d="M 140 580 L 252 520 M 260 580 L 148 520 M 148 520 L 244 460 M 252 520 L 156 460 M 156 460 L 236 400 M 244 460 L 164 400 M 164 400 L 229 340 M 236 400 L 171 340 M 171 340 L 224 290 M 229 340 L 176 290" stroke={derrickStroke} strokeWidth="2" />
        <line x1="228" y1="230" x2="228" y2="600" stroke={derrickStroke} strokeWidth="3" />
        {/* pumphead : POMPE (translateY) */}
        <g id="pumphead" transform={`translate(0 ${pump})`}>
          <path d="M 110 180 L 215 180 L 215 200 L 110 200 Z" fill="#e7bd78" stroke={derrickStroke} strokeWidth="3" strokeLinejoin="round" />
          <path d="M 210 180 Q 235 180 235 240 L 220 240 L 210 200 Z" fill="#e7bd78" stroke={derrickStroke} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="200" cy="190" r="5" fill={derrickStroke} />
        </g>
        {/* GOUTTE DE PETROLE qui tombe + petite tache a l'impact */}
        {dropVisible > 0.05 && (
          <ellipse cx="222" cy={dropY} rx="5" ry="8" fill="#140d04" opacity={dropVisible} />
        )}
        {splash > 0.05 && (
          <ellipse cx="222" cy="600" rx={6 + splash * 16} ry={2 + splash * 3} fill="#140d04" opacity={(1 - splash) * 0.7} />
        )}
      </g>

      {/* SHIP : charge (s'enfonce) puis REPART = avance legere + fade out (jamais hors cadre) */}
      <g id="ship" clipPath="url(#coinClipA)" transform={`translate(${shipX} ${shipSink})`} opacity={shipOpacity}>
        <path d="M 415 260 C 410 230, 380 230, 370 200 C 360 170, 390 150, 420 160 C 450 170, 460 140, 440 110" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        <line x1="430" y1="320" x2="430" y2="220" stroke={RED} strokeWidth="3" />
        <path d="M 415 320 L 410 260 L 440 260 L 435 320 Z" fill="#e7bd78" stroke={RED} strokeWidth="3" strokeLinejoin="round" />
        <line x1="412" y1="280" x2="438" y2="280" stroke={RED} strokeWidth="6" />
        <path d="M 390 460 L 390 380 L 460 380 L 460 460 Z" fill="#e7bd78" stroke={RED} strokeWidth="3" strokeLinejoin="round" />
        <path d="M 400 380 L 400 320 L 450 320 L 450 380 Z" fill="#e7bd78" stroke={RED} strokeWidth="3" strokeLinejoin="round" />
        <line x1="405" y1="335" x2="445" y2="335" stroke={RED} strokeWidth="4" strokeDasharray="6 4" />
        <line x1="405" y1="355" x2="445" y2="355" stroke={RED} strokeWidth="4" strokeDasharray="6 4" />
        <path d="M 396 660 L 380 460 L 780 460 C 820 460, 850 480, 860 520 C 870 560, 860 620, 850 640 C 870 645, 875 660, 860 660 Z" fill="#e7bd78" stroke={RED} strokeWidth="4" strokeLinejoin="round" />
        <path d="M 382 480 L 780 480 C 815 480, 840 495, 850 520" fill="none" stroke={RED} strokeWidth="2" />
        <path d="M 386 520 L 775 520 C 805 520, 825 530, 840 550" fill="none" stroke={RED} strokeWidth="2" />
        <path d="M 390 560 L 760 560 C 785 560, 800 565, 820 575" fill="none" stroke={RED} strokeWidth="2" />
        <path d="M 394 600 L 740 600 C 760 600, 770 605, 790 610" fill="none" stroke={RED} strokeWidth="2" />
        <circle cx="630" cy="550" r="10" fill="none" stroke={RED} strokeWidth="2" />
        <path d="M 680 510 L 720 510 L 700 550 Z" fill="none" stroke={RED} strokeWidth="4" strokeLinejoin="round" />
        <rect x="460" y="445" width="310" height="8" fill="none" stroke={RED} strokeWidth="2" />
        <path d="M 480 445 L 480 460 M 560 445 L 560 460 M 640 445 L 640 460 M 720 445 L 720 460" stroke={RED} strokeWidth="2" />
        <rect x="580" y="430" width="40" height="15" fill="#e7bd78" stroke={RED} strokeWidth="2" strokeLinejoin="round" />
        <line x1="600" y1="460" x2="560" y2="370" stroke={RED} strokeWidth="4" />
        <line x1="620" y1="460" x2="660" y2="380" stroke={RED} strokeWidth="4" />
      </g>

      {/* WAVES : l'ocean RESPIRE (ondulation) + couleur PILOTABLE (or -> noir petrole) */}
      <g id="waves" clipPath="url(#coinClipA)" transform={`translate(0 ${waveY})`}>
        <path d="M -40 630 A 80 50 0 0 0 120 630 A 80 50 0 0 0 280 630 A 80 50 0 0 0 440 630 A 80 50 0 0 0 600 630 A 80 50 0 0 0 760 630 A 80 50 0 0 0 920 630 A 80 50 0 0 0 1080 630 L 1080 1050 L -40 1050 Z" fill={seaFill} stroke={seaStroke} strokeWidth="4" />
        <path d="M -40 645 A 80 50 0 0 0 120 645 A 80 50 0 0 0 280 645 A 80 50 0 0 0 440 645 A 80 50 0 0 0 600 645 A 80 50 0 0 0 760 645 A 80 50 0 0 0 920 645 A 80 50 0 0 0 1080 645" fill="none" stroke={seaStroke} strokeWidth="2" />
        <path d="M 112 633 Q 120 620 128 633 M 272 633 Q 280 620 288 633 M 432 633 Q 440 620 448 633 M 592 633 Q 600 620 608 633 M 752 633 Q 760 620 768 633 M 912 633 Q 920 620 928 633" fill="none" stroke="#f2ebd9" strokeWidth="4" strokeLinecap="round" opacity={1 - oilSpread} />
        <path d="M -80 700 A 90 60 0 0 0 100 700 A 90 60 0 0 0 280 700 A 90 60 0 0 0 460 700 A 90 60 0 0 0 640 700 A 90 60 0 0 0 820 700 A 90 60 0 0 0 1000 700 A 90 60 0 0 0 1180 700 L 1180 1050 L -80 1050 Z" fill={seaFill} stroke={seaStroke} strokeWidth="4" />
        <path d="M -80 715 A 90 60 0 0 0 100 715 A 90 60 0 0 0 280 715 A 90 60 0 0 0 460 715 A 90 60 0 0 0 640 715 A 90 60 0 0 0 820 715 A 90 60 0 0 0 1000 715 A 90 60 0 0 0 1180 715" fill="none" stroke={seaStroke} strokeWidth="2" />
        <path d="M 92 703 Q 100 690 108 703 M 272 703 Q 280 690 288 703 M 452 703 Q 460 690 468 703 M 632 703 Q 640 690 648 703 M 812 703 Q 820 690 828 703 M 992 703 Q 1000 690 1008 703" fill="none" stroke="#f2ebd9" strokeWidth="4" strokeLinecap="round" opacity={1 - oilSpread} />
        <path d="M -100 780 A 100 70 0 0 0 100 780 A 100 70 0 0 0 300 780 A 100 70 0 0 0 500 780 A 100 70 0 0 0 700 780 A 100 70 0 0 0 900 780 A 100 70 0 0 0 1100 780 L 1100 1050 L -100 1050 Z" fill={seaFill} stroke={seaStroke} strokeWidth="4" />
        <path d="M -100 795 A 100 70 0 0 0 100 795 A 100 70 0 0 0 300 795 A 100 70 0 0 0 500 795 A 100 70 0 0 0 700 795 A 100 70 0 0 0 900 795 A 100 70 0 0 0 1100 795" fill="none" stroke={seaStroke} strokeWidth="2" />
        <path d="M 92 783 Q 100 770 108 783 M 292 783 Q 300 770 308 783 M 492 783 Q 500 770 508 783 M 692 783 Q 700 770 708 783 M 892 783 Q 900 770 908 783" fill="none" stroke="#f2ebd9" strokeWidth="4" strokeLinecap="round" opacity={1 - oilSpread} />
        <path d="M -60 870 A 110 80 0 0 0 160 870 A 110 80 0 0 0 380 870 A 110 80 0 0 0 600 870 A 110 80 0 0 0 820 870 A 110 80 0 0 0 1040 870 A 110 80 0 0 0 1260 870 L 1260 1050 L -60 1050 Z" fill={seaFill} stroke={seaStroke} strokeWidth="4" />
        <path d="M -60 885 A 110 80 0 0 0 160 885 A 110 80 0 0 0 380 885 A 110 80 0 0 0 600 885 A 110 80 0 0 0 820 885 A 110 80 0 0 0 1040 885 A 110 80 0 0 0 1260 885" fill="none" stroke={seaStroke} strokeWidth="2" />
        <path d="M -120 970 A 125 90 0 0 0 130 970 A 125 90 0 0 0 380 970 A 125 90 0 0 0 630 970 A 125 90 0 0 0 880 970 A 125 90 0 0 0 1130 970 L 1130 1050 L -120 1050 Z" fill={seaFill} stroke={seaStroke} strokeWidth="4" />
        <path d="M -120 985 A 125 90 0 0 0 130 985 A 125 90 0 0 0 380 985 A 125 90 0 0 0 630 985 A 125 90 0 0 0 880 985 A 125 90 0 0 0 1130 985" fill="none" stroke={seaStroke} strokeWidth="2" />
      </g>

      <g id="rim">
        <circle cx="512" cy="512" r="480" fill="none" stroke={RED} strokeWidth="12" />
        <circle cx="512" cy="512" r="468" fill="none" stroke={RED} strokeWidth="4" />
        <circle cx="512" cy="512" r="454" fill="none" stroke={RED} strokeWidth="8" strokeDasharray="4 20" strokeLinecap="round" />
        <circle cx="512" cy="512" r="495" fill="none" stroke={RED} strokeWidth="2" />
      </g>
    </svg>
  );
};

export default SenegalCoinFaceA_SVG;
