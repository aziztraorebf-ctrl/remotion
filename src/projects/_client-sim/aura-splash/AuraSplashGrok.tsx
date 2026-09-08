// MOTEUR: SVG — objet vectoriel (wordmark qui nait). Meme registre que AuraLogo.tsx
// et c'est voulu : les 3 versions doivent etre comparables, seul le TRAITEMENT change.
//
/**
 * AURA splash — VERSION GROK (fidelite stricte a sa proposition).
 *
 * Concept : « Un point devient le A. Le reste du mot n'arrive pas — on l'allume. »
 *
 * Les 3 partis pris qui lui sont propres :
 *  1. `u r a` n'ont AUCUNE interpolation d'opacite ni de transform. Ils sont
 *     reveles par UN masque horizontal (un rideau), pas par une choregraphie.
 *     Son argument : un fade ferait SaaS, un stagger ferait « letters bounce ».
 *  2. Stagger NUL entre les 3 lettres — c'est un rideau, pas une cascade.
 *  3. Apres 2,10 s : ZERO keyframe. Le hold de 54 frames est voulu, pas un reste.
 *     « Un pulse residuel tuerait la piece a la 30e vue. »
 *
 * Ecart assume vs sa proposition : il proposait un morph cercle -> A (keyframes
 * du `d`). Il fournit lui-meme le repli en cas de vertices non concordants —
 * trim path sur le contour, puis fill. Notre logo etant deja en `stroke` a ligne
 * mediane, le repli EST la voie naturelle : on l'applique, meme geste, zero risque
 * de plissement. Son propre § RISQUES l'autorise explicitement.
 */

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AURA_DOT,
  AURA_INK,
  AURA_WINE,
  AURA_WINE_DEEP,
  AuraBackground,
  AuraWordmark,
  PATH_LENGTHS,
} from "./AuraLogo";

export const AURA_SPLASH_FPS = 60;
export const AURA_SPLASH_FRAMES = 180; // 3,00 s

/** Courbes exactes citees par Grok. */
const EASE_DOT = [0.22, 0.8, 0.22, 1] as const;
const EASE_A = [0.16, 1, 0.3, 1] as const;
const EASE_CURTAIN = [0.4, 0, 0.2, 1] as const;
const EASE_SETTLE = [0.33, 1, 0.4, 1] as const;

/** Bezier cubique 1D (resolution par bissection — deterministe, sans dependance). */
const cubicBezier = (
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  t: number,
): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const bx = (u: number) =>
    3 * (1 - u) * (1 - u) * u * x1 + 3 * (1 - u) * u * u * x2 + u * u * u;
  const by = (u: number) =>
    3 * (1 - u) * (1 - u) * u * y1 + 3 * (1 - u) * u * u * y2 + u * u * u;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (bx(mid) < t) lo = mid;
    else hi = mid;
  }
  return by((lo + hi) / 2);
};

/** Progression 0->1 entre deux temps en SECONDES, avec courbe. */
const seg = (
  frame: number,
  fps: number,
  from: number,
  to: number,
  ease: readonly [number, number, number, number],
): number => {
  const raw = interpolate(frame, [from * fps, to * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return cubicBezier(ease, raw);
};

export const AuraSplashGrok: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0.22 -> 0.42 : le disque nait a l'origine du A. Pas de rebond.
  const dotIn = seg(frame, fps, 0.22, 0.42, EASE_DOT);
  const dotOpacity = dotIn;
  const dotScale = 0.7 + 0.3 * dotIn;

  // 0.42 -> 1.48 : le disque devient le A. Presque pas d'ease-in, poids sur la fin.
  const aProgress = seg(frame, fps, 0.42, 1.48, EASE_A);
  // Le trace se dessine a l'envers du `d` : le geste part de la boucle (ou est
  // le point) et remonte vers l'arche. dashoffset negatif = depart par la fin.
  const aTraitOffset = -PATH_LENGTHS.aTrait * (1 - aProgress);
  // `stroke-linecap=round` dessine un demi-disque des que la longueur visible est
  // quasi nulle : sans ce masque, une pastille parasite apparait a cote du point
  // avant que le geste ne demarre. On ne montre le trace qu'a partir de 1,5 %.
  const aTraitVisible = aProgress > 0.015 ? 1 : 0;
  // La barre du A suit la meme progression, calee sur la fin du geste.
  const barreProgress = seg(frame, fps, 1.0, 1.48, EASE_A);
  const barreOffset = PATH_LENGTHS.aBarre * (1 - barreProgress);
  const barreVisible = barreProgress > 0.015 ? 1 : 0;

  // 1.00 -> 1.72 : le rideau. Part quand le A est ~55 % forme.
  // UN masque pour les trois lettres. Stagger nul. Aucune opacite.
  const curtain = seg(frame, fps, 1.0, 1.72, EASE_CURTAIN);
  const curtainX = 400 + curtain * 480; // du bord droit du A jusqu'au-dela du `a`

  // 1.48 -> 2.10 : micro-settle du lockup. Puis PLUS RIEN.
  const settle = seg(frame, fps, 1.48, 2.1, EASE_SETTLE);
  const scale = 1.025 - 0.025 * settle;

  return (
    <AbsoluteFill style={{ backgroundColor: AURA_WINE_DEEP }}>
      {/* viewBox 9:16 : le fond couvre tout l'ecran, le wordmark est centre.
          Le logo (bbox y 397-624 dans le carre 1024) est remonte au centre optique. */}
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bg-grok" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0" stopColor={AURA_WINE} />
            <stop offset="1" stopColor={AURA_WINE_DEEP} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bg-grok)" />
        {/* Le contenu est dessine dans le repere 1024 d'origine, puis place.
            Le wordmark (bbox 674x227 centre en 513,510 dans le carre) est mis a
            l'echelle 1.30 et centre sur 540,960 — taille de splash mobile. */}
        <g transform="translate(540 960) scale(1.12) translate(-513 -510)">

        <defs>
          {/* Le rideau : un rect qui balaie vers la droite. Alpha matte, pas d'opacite. */}
          <clipPath id="curtain-ura">
            <rect x="0" y="380" width={curtainX} height="260" />
          </clipPath>
        </defs>

        <g transform={`translate(512 512) scale(${scale}) translate(-512 -512)`}>
          {/* Le A : trace qui se forme. Le point est dedans, il nait en premier. */}
          <g
            fill="none"
            stroke={AURA_INK}
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d={
                "M380.00,608.50 L380.00,443.50 C381.50,440.62 375.92,430.92 374.00,425.30 C369.16,417.43 361.97,413.57 350.20,412.86 C336.89,413.32 328.72,420.22 325.14,429.20 C316.26,441.28 313.92,453.06 306.43,466.50 C296.64,479.23 291.99,494.25 286.45,505.09 L294.65,498.36 C285.19,509.49 269.95,503.14 254.50,505.66 C241.16,508.55 229.01,512.65 216.70,523.45 C204.53,534.22 195.95,545.49 191.03,564.50 C189.61,578.43 187.53,594.29 198.30,604.56 C213.24,614.57 230.42,607.51 238.98,596.40 C249.11,583.58 252.17,565.15 259.82,558.00 C269.63,539.21 277.14,526.59 279.55,512.36"
              }
              strokeDasharray={PATH_LENGTHS.aTrait}
              strokeDashoffset={aTraitOffset}
              opacity={aTraitVisible}
            />
            <path
              d={
                "M290.43,507.16 C295.41,511.28 303.01,512.40 309.70,515.42 C316.25,518.37 323.01,523.90 329.70,529.40 C335.46,535.62 343.15,542.50 347.78,550.24 C350.48,555.67 356.23,562.69 360.95,572.01 C362.48,576.74 369.38,586.06 370.81,594.74 C370.75,599.91 377.00,609.56 377.00,609.40"
              }
              strokeDasharray={PATH_LENGTHS.aBarre}
              strokeDashoffset={barreOffset}
            />
            <circle
              cx={AURA_DOT.cx}
              cy={AURA_DOT.cy}
              r={AURA_DOT.r * dotScale}
              fill={AURA_INK}
              stroke="none"
              opacity={dotOpacity}
            />
          </g>

          {/* `u r a` : deja en place, reveles par le rideau. Aucun fade, aucun stagger.
              Le A et son point sont a opacite 0 ici : ils sont dessines au-dessus
              par le bloc anime. Sans ca, le point apparait EN DOUBLE. */}
          <g clipPath="url(#curtain-ura)">
            <AuraWordmark
              aTrait={{ opacity: 0 }}
              aBarre={{ opacity: 0 }}
              dot={{ opacity: 0, scale: 0 }}
            />
          </g>
        </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
