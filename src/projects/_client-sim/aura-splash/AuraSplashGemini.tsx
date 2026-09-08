// MOTEUR: SVG — objet vectoriel (wordmark qui nait). Meme registre que les 2 autres
// versions, volontairement : seul le TRAITEMENT differe, pour que la comparaison porte.
//
/**
 * AURA splash — VERSION GEMINI (fidelite stricte a sa proposition).
 *
 * Concept : « L'etincelle de minuit » — le point du A est un catalyseur.
 * L'ecran commence dans une obscurite quasi totale (PLUS SOMBRE que la couleur
 * de marque), le point s'allume, GLISSE le long de la courbe du A en la tracant
 * dans son sillage, puis `ura` emerge en cascade et le FOND S'ILLUMINE pour
 * atteindre le bordeaux final. « Book. Glow. Repeat. »
 *
 * Les 4 partis pris qui lui sont propres :
 *  1. Le fond EVOLUE (#2A0812 -> #6B1830). Les 2 autres versions gardent un fond fixe.
 *  2. Le point GLISSE le long du trace (getPointAtLength) au lieu de rester en place.
 *  3. Cascade reguliere des lettres : delai i * 150 ms, translateY +15px -> 0.
 *  4. Micro-scale continu 1 -> 1.02 jusqu'a la fin, pour « garder l'ecran vivant ».
 *     ⚠️ C'est exactement ce que Grok proscrit (pulse residuel). Divergence assumee :
 *     c'est precisement ce que la comparaison doit trancher.
 *
 * Son gotcha technique applique : PAS de feGaussianBlur (casse en lottie-react-native).
 * Le halo du point est simule par 3 cercles concentriques sans filtre —
 * scale 1x/1.5x/2x, opacites 100/30/10 %.
 */

import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { AURA_DOT, AURA_INK, AURA_PATHS, PATH_LENGTHS } from "./AuraLogo";

export const AURA_SPLASH_FPS = 60;
export const AURA_SPLASH_FRAMES = 180; // 3,00 s

const DARK_START = "#2A0812"; // plus sombre que la marque, voulu par Gemini
const WINE_END = "#6B1830"; // la couleur de marque exacte du brief

/** Courbe exacte citee par Gemini pour le trace du A. */
const EASE_DRAW = [0.7, 0, 0.1, 1] as const;

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

/**
 * Position le long du trace du A, echantillonnee.
 * `getPointAtLength` n'existe pas au rendu serveur : on echantillonne le path
 * une seule fois via une approximation des points cles du geste (queue -> arche).
 * Les reperes viennent des `d` mesures, pas d'une invention.
 */
const A_TRAIL: ReadonlyArray<readonly [number, number]> = [
  [279.6, 512.4], [259.8, 558.0], [239.0, 596.4], [198.3, 604.6],
  [191.0, 564.5], [216.7, 523.5], [254.5, 505.7], [286.5, 505.1],
  [306.4, 466.5], [325.1, 429.2], [350.2, 412.9], [374.0, 425.3],
  [380.0, 443.5], [380.0, 608.5],
];

const pointAt = (t: number): readonly [number, number] => {
  const clamped = Math.max(0, Math.min(1, t));
  const pos = clamped * (A_TRAIL.length - 1);
  const i = Math.min(Math.floor(pos), A_TRAIL.length - 2);
  const f = pos - i;
  const [x0, y0] = A_TRAIL[i];
  const [x1, y1] = A_TRAIL[i + 1];
  return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f];
};

/** `u`, `r`, `a` — cascade reguliere, delai i * 150 ms comme specifie. */
const CASCADE = [
  { key: "u", path: AURA_PATHS.uTrait, delay: 0 },
  { key: "r", path: AURA_PATHS.rTrait, delay: 0.15 },
  { key: "a", path: AURA_PATHS.anneau, delay: 0.3 },
  { key: "a2", path: AURA_PATHS.jambage, delay: 0.3 },
] as const;

export const AuraSplashGemini: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0.0 -> 0.5 : le point s'allume dans le noir. Spring tres amorti (damping 100)
  // rendu ici par une courbe douce sans rebond — meme sensation, deterministe.
  const dotIn = seg(frame, fps, 0.0, 0.5);
  const dotOpacity = dotIn;
  const dotScale = 0.8 + 0.2 * dotIn;

  // 0.5 -> 1.5 : le point GLISSE et trace le A dans son sillage.
  const draw = seg(frame, fps, 0.5, 1.5, EASE_DRAW);
  const [dotX, dotY] = pointAt(draw);
  const traveling = draw > 0 && draw < 1;
  const aTraitOffset = -PATH_LENGTHS.aTrait * (1 - draw);
  // `stroke-linecap=round` : masquer tant que la longueur visible est quasi nulle,
  // sinon une pastille parasite apparait sous le point (vu au rendu).
  const aTraitVisible = draw > 0.015 ? 1 : 0;
  const barreProgress = seg(frame, fps, 1.15, 1.5, EASE_DRAW);
  const barreOffset = PATH_LENGTHS.aBarre * (1 - barreProgress);

  // 1.5 -> 3.0 : le fond s'illumine vers le bordeaux de marque.
  const bgT = seg(frame, fps, 1.5, 3.0);
  const bgColor = interpolateColors(bgT, [0, 1], [DARK_START, WINE_END]);

  // 1.5 -> 3.0 : micro-scale continu 1 -> 1.02 (« garder l'ecran vivant »).
  const alive = 1 + 0.02 * seg(frame, fps, 1.5, 3.0);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1080 1920"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Le fond EVOLUE ici (parti pris Gemini) : couleur pleine animee. */}
        <rect x="0" y="0" width="1080" height="1920" fill={bgColor} />

        <g transform="translate(540 960) scale(1.12) translate(-513 -510)">
        <g transform={`translate(512 512) scale(${alive}) translate(-512 -512)`}>
          <g
            fill="none"
            stroke={AURA_INK}
            strokeWidth={30}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d={AURA_PATHS.aTrait}
              strokeDasharray={PATH_LENGTHS.aTrait}
              strokeDashoffset={aTraitOffset}
              opacity={aTraitVisible}
            />
            <path
              d={AURA_PATHS.aBarre}
              strokeDasharray={PATH_LENGTHS.aBarre}
              strokeDashoffset={barreOffset}
            />

            {/* `ura` en cascade : opacite + translateY 15 -> 0, delai 150 ms/lettre. */}
            {CASCADE.map(({ key, path, delay }) => {
              const t = seg(frame, fps, 1.5 + delay, 1.9 + delay);
              return (
                <g key={key} transform={`translate(0 ${15 * (1 - t)})`} opacity={t}>
                  <path
                    d={path}
                    strokeDasharray={undefined}
                    strokeDashoffset={undefined}
                  />
                </g>
              );
            })}
          </g>

          {/* Le halo du point : 3 cercles concentriques SANS filtre (gotcha Lottie). */}
          <g opacity={dotOpacity}>
            <circle cx={dotX} cy={dotY} r={AURA_DOT.r * dotScale * 2} fill={AURA_INK} opacity={0.1} />
            <circle cx={dotX} cy={dotY} r={AURA_DOT.r * dotScale * 1.5} fill={AURA_INK} opacity={0.3} />
            <circle cx={dotX} cy={dotY} r={AURA_DOT.r * dotScale} fill={AURA_INK} />
          </g>

          {/* Le point final se pose a sa place exacte une fois le geste acheve. */}
          {!traveling && draw >= 1 && (
            <circle cx={AURA_DOT.cx} cy={AURA_DOT.cy} r={AURA_DOT.r} fill={AURA_INK} />
          )}
        </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
