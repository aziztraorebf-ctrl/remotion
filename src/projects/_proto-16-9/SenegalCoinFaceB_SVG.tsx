/**
 * SenegalCoinFaceB_SVG — gravure Face B "le miracle" (arbre a billets) SVG VECTORIEL ANIME.
 *
 * Voie "stylise animable" (meme famille que Face A). Source : Gemini 3.1 Pro (intent-driven, groupes
 * #bg #trunk #rootcoins #leaves #fallingcoins #rim + symboles #coin #note-flat #note-wave).
 * Anime PAR PARTIES :
 *   - #leaves  : leger sway global (le feuillage de billets fremit) = arbre vivant
 *   - #fallingcoins : descente continue + fade (l'argent qui pleut)
 *   - oxidize : la piece se ternit (cohérent avec le moment fissure/malediction de la scene)
 * viewBox 1024x1024, a projeter dans le CoinFlip (custom face B).
 */
import React from "react";
import { useCurrentFrame } from "remotion";

export interface CoinFaceBProps {
  /** 0 = piece intacte, 1 = oxydee/ternie (au moment fissure). */
  oxidize?: number;
}

export const SenegalCoinFaceB_SVG: React.FC<CoinFaceBProps> = ({ oxidize = 0 }) => {
  const frame = useCurrentFrame();
  // feuillage qui fremit : leger sway (rotation globale tres faible autour du tronc ~512,860)
  const sway = Math.sin(frame / 22) * 0.7;
  // pieces qui tombent : descente cyclique + fade
  const fallCycle = (frame % 90) / 90;
  const fallY = fallCycle * 140;
  const fallOp = 1 - fallCycle;
  // oxydation
  const oxidizeFilter = oxidize > 0.02 ? `saturate(${1 - oxidize * 0.75}) brightness(${1 - oxidize * 0.4})` : "none";

  return (
    <svg viewBox="0 0 1024 1024" width="100%" height="100%" style={{ position: "absolute", inset: 0, filter: oxidizeFilter }}>
      <defs>
        <radialGradient id="coinBaseB" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e7bd78" /><stop offset="70%" stopColor="#d6ab62" /><stop offset="95%" stopColor="#bf9442" /><stop offset="100%" stopColor="#a47230" />
        </radialGradient>
        <linearGradient id="metalShineB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2ebd9" stopOpacity="0.6" /><stop offset="50%" stopColor="#e7bd78" stopOpacity="0.1" /><stop offset="100%" stopColor="#bf9442" stopOpacity="0.6" />
        </linearGradient>
        <clipPath id="coinClipB"><circle cx="512" cy="512" r="490" /></clipPath>

        <g id="coinB">
          <ellipse cx="0" cy="0" rx="22" ry="14" fill="#bf9442" stroke="#8a2a20" strokeWidth="2" />
          <ellipse cx="0" cy="-4" rx="22" ry="14" fill="#e7bd78" stroke="#8a2a20" strokeWidth="2" />
          <ellipse cx="0" cy="-4" rx="16" ry="9" fill="none" stroke="#8a2a20" strokeWidth="1" />
          <path d="M-4,-7 L4,-7 M-4,-1 L4,-1 M0,-9 L0,1" stroke="#8a2a20" strokeWidth="1.5" />
        </g>
        <g id="noteFlatB">
          <rect x="-38" y="-18" width="76" height="36" rx="2" fill="#bf9442" stroke="#8a2a20" strokeWidth="2" transform="translate(2,2)" />
          <rect x="-38" y="-18" width="76" height="36" rx="2" fill="#e7bd78" stroke="#8a2a20" strokeWidth="2" />
          <rect x="-32" y="-12" width="64" height="24" fill="none" stroke="#8a2a20" strokeWidth="1" />
          <circle cx="0" cy="0" r="7" fill="none" stroke="#8a2a20" strokeWidth="1.5" />
        </g>
        <g id="noteWaveB">
          <path d="M-38,-8 Q-18,-28 2,-8 T42,-8 L36,24 Q16,4 -4,24 T-44,24 Z" fill="#bf9442" stroke="#8a2a20" strokeWidth="2" transform="translate(2,2)" />
          <path d="M-38,-8 Q-18,-28 2,-8 T42,-8 L36,24 Q16,4 -4,24 T-44,24 Z" fill="#e7bd78" stroke="#8a2a20" strokeWidth="2" />
          <circle cx="-1" cy="6" r="5" fill="none" stroke="#8a2a20" strokeWidth="1.5" />
        </g>
        <path id="trunkBaseB" d="M 400,860 C 440,750 460,650 450,550 C 410,500 320,470 240,420 C 230,410 240,400 250,400 C 330,440 420,470 470,510 C 480,440 460,340 400,260 C 390,250 400,240 410,240 C 480,320 500,420 505,490 C 530,430 550,330 590,240 C 600,230 610,240 600,250 C 560,350 535,440 520,500 C 580,460 660,400 730,330 C 740,320 750,330 740,340 C 660,420 580,480 540,530 C 620,550 710,560 800,560 C 810,560 810,570 800,570 C 700,570 600,550 540,560 C 540,650 560,750 620,860 Z" />
      </defs>

      <g clipPath="url(#coinClipB)">
        <g id="bg">
          <circle cx="512" cy="512" r="490" fill="url(#coinBaseB)" />
          <circle cx="512" cy="512" r="240" fill="none" stroke="#8a2a20" strokeWidth="480" strokeDasharray="4 14" opacity="0.15" />
          <circle cx="512" cy="512" r="490" fill="url(#metalShineB)" opacity="0.3" />
        </g>

        <g id="trunk">
          <use href="#trunkBaseB" fill="#bf9442" transform="translate(6,6)" />
          <use href="#trunkBaseB" fill="#e7bd78" stroke="#8a2a20" strokeWidth="4" />
        </g>

        {/* pile de pieces aux racines (statique) */}
        <g id="rootcoins">
          {ROOT_COINS.map((t, i) => <use key={i} href="#coinB" transform={t} />)}
        </g>

        {/* feuillage de billets : FREMIT (sway global autour du pied de l'arbre) */}
        <g id="leaves" transform={`rotate(${sway} 512 820)`}>
          {LEAVES.map(([sym, t], i) => <use key={i} href={sym} transform={t} />)}
        </g>

        {/* pieces/billets qui TOMBENT (descente + fade en boucle) */}
        <g id="fallingcoins">
          {FALLING.map(([sym, t], i) => (
            <use key={i} href={sym} transform={`${t} translate(0 ${fallY})`} opacity={fallOp} />
          ))}
        </g>
      </g>

      <g id="rim">
        <circle cx="512" cy="512" r="475" fill="none" stroke="#bf9442" strokeWidth="10" />
        <circle cx="512" cy="512" r="475" fill="none" stroke="#8a2a20" strokeWidth="6" strokeDasharray="8 12" />
        <circle cx="512" cy="512" r="490" fill="none" stroke="#bf9442" strokeWidth="24" />
        <circle cx="512" cy="512" r="486" fill="none" stroke="#8a2a20" strokeWidth="6" />
        <circle cx="512" cy="512" r="498" fill="none" stroke="#8a2a20" strokeWidth="4" />
        <circle cx="512" cy="512" r="484" fill="none" stroke="#f2ebd9" strokeWidth="1.5" opacity="0.8" />
      </g>
    </svg>
  );
};

// pile de pieces aux racines (extrait du SVG Gemini, condense)
const ROOT_COINS = [
  "translate(500,750) rotate(5) scale(1.1)", "translate(470,770) rotate(-10)", "translate(530,770) rotate(20)",
  "translate(550,775) rotate(-15) scale(1.1)", "translate(440,790) rotate(10)", "translate(500,795) rotate(-10) scale(1.2)",
  "translate(560,790) rotate(5) scale(0.9)", "translate(410,810) rotate(-10) scale(1.1)", "translate(470,815) rotate(10)",
  "translate(530,810) rotate(-15) scale(1.2)", "translate(590,815) rotate(15) scale(0.9)", "translate(380,830) rotate(10) scale(1.2)",
  "translate(440,835) rotate(-5) scale(1.1)", "translate(500,830) rotate(5) scale(0.9)", "translate(560,835) rotate(-5) scale(1.2)",
  "translate(620,825) rotate(5) scale(1.1)", "translate(350,850) rotate(-5) scale(1.1)", "translate(410,855) rotate(5)",
  "translate(470,845) rotate(-5) scale(1.2)", "translate(530,855) rotate(5) scale(0.9)", "translate(590,850) rotate(-5) scale(1.1)",
  "translate(650,855) rotate(5)", "translate(320,870) rotate(10) scale(0.9)", "translate(680,865) rotate(5) scale(1.1)",
  "translate(290,860) rotate(-5) scale(1.1)", "translate(730,860) rotate(15)",
];

// feuilles = billets+pieces (extrait condense du #leaves Gemini)
const LEAVES: [string, string][] = [
  ["#noteFlatB", "translate(220,420) rotate(-15) scale(0.9)"], ["#noteWaveB", "translate(240,390) rotate(20) scale(1.1)"],
  ["#coinB", "translate(210,370) rotate(-5)"], ["#noteFlatB", "translate(290,370) rotate(-60) scale(0.9)"],
  ["#noteWaveB", "translate(340,430) rotate(-10)"], ["#noteFlatB", "translate(360,320) rotate(15) scale(1.1)"],
  ["#noteWaveB", "translate(380,280) rotate(-25) scale(0.9)"], ["#coinB", "translate(350,250) rotate(10)"],
  ["#noteFlatB", "translate(400,230) rotate(40) scale(0.8)"], ["#noteWaveB", "translate(420,270) rotate(-30)"],
  ["#coinB", "translate(460,250) rotate(-15) scale(1.1)"], ["#noteFlatB", "translate(490,210) rotate(-20) scale(1.1)"],
  ["#noteWaveB", "translate(510,170) rotate(35) scale(0.9)"], ["#noteFlatB", "translate(530,240) rotate(25)"],
  ["#noteWaveB", "translate(550,200) rotate(-45) scale(0.8)"], ["#coinB", "translate(580,230) rotate(50) scale(0.9)"],
  ["#noteFlatB", "translate(590,320) rotate(-15)"], ["#noteWaveB", "translate(610,280) rotate(20) scale(1.1)"],
  ["#coinB", "translate(630,250) rotate(-35) scale(0.9)"], ["#noteWaveB", "translate(670,330) rotate(-50) scale(1.1)"],
  ["#noteFlatB", "translate(690,270) rotate(30)"], ["#coinB", "translate(640,210) rotate(-5)"],
  ["#noteFlatB", "translate(710,380) rotate(15)"], ["#noteWaveB", "translate(730,420) rotate(-25) scale(1.1)"],
  ["#coinB", "translate(750,360) rotate(40) scale(0.9)"], ["#noteWaveB", "translate(500,330) rotate(10) scale(1.2)"],
  ["#noteFlatB", "translate(470,380) rotate(-35)"], ["#coinB", "translate(440,420) rotate(25) scale(1.1)"],
  ["#noteWaveB", "translate(590,420) rotate(-20) scale(1.1)"], ["#coinB", "translate(460,490) rotate(45) scale(0.9)"],
];

// pieces/billets en chute
const FALLING: [string, string][] = [
  ["#noteWaveB", "translate(180,550) rotate(-30) scale(0.9)"], ["#coinB", "translate(220,650) rotate(15) scale(1.1)"],
  ["#noteFlatB", "translate(140,720) rotate(45) scale(0.8)"], ["#coinB", "translate(830,520) rotate(-20) scale(0.9)"],
  ["#noteWaveB", "translate(880,620) rotate(-45) scale(1.1)"], ["#coinB", "translate(840,720) rotate(30)"],
  ["#noteFlatB", "translate(860,420) rotate(60)"],
];

export default SenegalCoinFaceB_SVG;
