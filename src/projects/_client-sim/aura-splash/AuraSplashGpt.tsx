// MOTEUR: SVG — objet vectoriel (wordmark qui nait). Meme registre que les 2 autres
// versions, volontairement : seul le TRAITEMENT differe, pour que la comparaison porte.
//
/**
 * AURA splash — VERSION GPT (fidelite stricte a sa proposition).
 *
 * Concept : « Une goutte d'aura se depose sur le A, trace silencieusement sa
 * courbe distinctive, puis le mot se condense autour d'elle comme une marque
 * deja presente dans l'ombre. » Ce n'est ni une reservation ni un chargement :
 * c'est l'apparition d'une PRESENCE.
 *
 * Les 4 partis pris qui lui sont propres :
 *  1. DEUX passes sur le A : un trait FIN et translucide (opacite 0,55) trace la
 *     trajectoire en premier — « comme une trajectoire de parfum » — puis le A
 *     PLEIN est revele derriere avec 4-6 px de retard, et le trait fin s'efface.
 *     C'est sa signature : la matiere qui se depose.
 *  2. Decalages IRREGULIERS pour `ura` : u a 1.02, a a 1.05, r a 1.08 — sciemment
 *     pas dans l'ordre de lecture, pour eviter le « A puis U puis R » corporate.
 *  3. Une lueur plate, tres large et tres faible, balaie derriere le logo (1.68->2.05).
 *  4. Hold final long : stabilise avant 2,05 s, 0,7-1 s de lecture claire.
 *
 * Duree totale 2,75 s + maintien statique jusqu'a 3,00 s, comme il le prevoit.
 * Son gotcha applique : pas de vrai flou (ellipse a opacite plate, pas feGaussianBlur).
 */

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AURA_DOT,
  AURA_INK,
  AURA_PATHS,
  AURA_WINE,
  AURA_WINE_DEEP,
  AuraBackground,
  PATH_LENGTHS,
} from "./AuraLogo";

export const AURA_SPLASH_FPS = 60;
export const AURA_SPLASH_FRAMES = 180; // 3,00 s

/** Courbe exacte citee par GPT pour l'arrivee du point. */
const EASE_DOT = [0.22, 0.0, 0.0, 1.0] as const;

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

const seg = (
  frame: number,
  fps: number,
  from: number,
  to: number,
  ease?: readonly [number, number, number, number],
): number => {
  const raw = interpolate(frame, [from * fps, to * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return ease ? cubicBezier(ease, raw) : raw;
};

/** Decalages IRREGULIERS voulus par GPT — pas l'ordre de lecture. */
const LETTERS = [
  { key: "u", path: AURA_PATHS.uTrait, start: 1.02 },
  { key: "a-anneau", path: AURA_PATHS.anneau, start: 1.05 },
  { key: "a-jambage", path: AURA_PATHS.jambage, start: 1.05 },
  { key: "r", path: AURA_PATHS.rTrait, start: 1.08 },
] as const;

export const AuraSplashGpt: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0.18 -> 0.42 : le point ivoire apparait. Rien d'autre ne bouge.
  const dotIn = seg(frame, fps, 0.18, 0.42, EASE_DOT);
  const dotScale = 0.65 + 0.35 * dotIn;

  // 0.42 -> 0.95 : le trait FIN trace la courbe (la trajectoire de parfum).
  const trail = seg(frame, fps, 0.42, 0.95);
  const trailOffset = -PATH_LENGTHS.aTrait * (1 - trail);
  // Le trait fin s'efface une fois le A plein en place.
  const trailFade = 1 - seg(frame, fps, 1.18, 1.42);

  // 0.68 -> 1.18 : le A PLEIN est revele, avec du retard sur le trait fin.
  const aReveal = seg(frame, fps, 0.68, 1.18);
  const aOffset = -PATH_LENGTHS.aTrait * (1 - aReveal);
  // `stroke-linecap=round` : masquer tant que la longueur visible est quasi nulle,
  // sinon une pastille parasite apparait a cote du point (vu au rendu).
  const aVisible = aReveal > 0.015 ? 1 : 0;
  const trailVisible = trail > 0.015 ? 1 : 0;
  const barreReveal = seg(frame, fps, 0.95, 1.18);
  const barreOffset = PATH_LENGTHS.aBarre * (1 - barreReveal);

  // 1.30 -> 1.68 : micro-respiration, scale 1.006 -> 1.000, tres amorti, pas de rebond.
  const settle = seg(frame, fps, 1.3, 1.68);
  const scale = 1.006 - 0.006 * settle;

  // 1.68 -> 2.05 : la lueur plate balaie de gauche a droite, puis s'eteint.
  const sweep = seg(frame, fps, 1.68, 2.05);
  const sweepX = 150 + sweep * 750;
  const sweepOpacity = sweep < 0.5 ? sweep * 2 * 0.08 : (1 - sweep) * 2 * 0.08;

  return (
    <AbsoluteFill style={{ backgroundColor: AURA_WINE_DEEP }}>
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bg-gpt" x1="0" y1="0" x2="0.25" y2="1">
            <stop offset="0" stopColor={AURA_WINE} />
            <stop offset="1" stopColor={AURA_WINE_DEEP} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1080" height="1920" fill="url(#bg-gpt)" />

        <g transform="translate(540 960) scale(1.12) translate(-513 -510)">
        <g transform={`translate(512 512) scale(${scale}) translate(-512 -512)`}>
          {/* La lueur plate, DERRIERE le logo. Opacite plate, aucun flou. */}
          <ellipse
            cx={sweepX}
            cy={510}
            rx={260}
            ry={150}
            fill={AURA_INK}
            opacity={Math.max(0, sweepOpacity)}
          />

          {/* Le trait FIN — la trajectoire de parfum. Fin, translucide, ephemere. */}
          <path
            d={AURA_PATHS.aTrait}
            fill="none"
            stroke={AURA_INK}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={PATH_LENGTHS.aTrait}
            strokeDashoffset={trailOffset}
            opacity={0.55 * Math.max(0, trailFade) * trailVisible}
          />

          <g
            fill="none"
            stroke={AURA_INK}
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Le A plein, revele en retard sur le trait fin. */}
            <path
              d={AURA_PATHS.aTrait}
              strokeDasharray={PATH_LENGTHS.aTrait}
              strokeDashoffset={aOffset}
              opacity={aVisible}
            />
            <path
              d={AURA_PATHS.aBarre}
              strokeDasharray={PATH_LENGTHS.aBarre}
              strokeDashoffset={barreOffset}
            />

            {/* `ura` : montee de 8 px, opacite, decalages irreguliers. */}
            {LETTERS.map(({ key, path, start }) => {
              const t = seg(frame, fps, start, start + 0.34);
              return (
                <g key={key} transform={`translate(0 ${8 * (1 - t)})`} opacity={t}>
                  <path d={path} />
                </g>
              );
            })}
          </g>

          {/* Le point : il apparait AVANT tout et finit exactement a sa place. */}
          <circle
            cx={AURA_DOT.cx}
            cy={AURA_DOT.cy}
            r={AURA_DOT.r * dotScale}
            fill={AURA_INK}
            opacity={dotIn}
          />
        </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
