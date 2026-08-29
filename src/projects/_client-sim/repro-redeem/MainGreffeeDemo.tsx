// MOTEUR: objet/metaphore SVG (brique d'interface animee par code)
//
// DEMO — la main greffee en mouvement, pour repondre a « est-ce que ca tient
// une fois anime ? ». Le SVG statique est `assets/main-greffee.svg`.
//
// ⛔ LICENCE — la silhouette vient de « touch-to-screen » de Korhan Ulusoy
// (LottieFiles, Lottie Simple License). Modification et usage commercial sont
// autorises, attribution non obligatoire (faite ici quand meme). MAIS la licence
// est VIRALE : toute piece qui incorpore cette geometrie reste sous ces termes.
// -> OK pour notre portfolio. ⛔ PAS pour un livrable client exclusif.
//
// ⭐ LE MECANISME, releve sur 3 references de banque (2026-08-28) : le doigt ne
// PLIE PAS — zero morphing de forme mesure. L'illusion du tap vient du
// DEPLACEMENT de la main + de l'onde de contact qui se propage. C'est plus
// simple ET plus robuste que d'animer une articulation. On l'applique ici.

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// ⛔ La silhouette n'est PAS retapee ici : elle est generee depuis le SVG source
// par `assets/extraire-silhouette.py`. Voir la note de licence dans silhouette.ts.
import { MAIN_SILHOUETTE as SILHOUETTE } from "./silhouette";

// Courbe d'entree canonique (FICHE-GESTE-ANIME) — valeur exacte, jamais approximee.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

// Duree calee sur le CONTENU : la coche finit son ressort vers f125, au-dela
// la scene est figee (mesure : 0,02 d'ecart a f148). On coupe la ou ca s'arrete.
export const MAIN_DEMO_FRAMES = 128;
export const MAIN_DEMO_FPS = 60;



export const MainGreffeeDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- La main descend, appuie, remonte ---------------------------------
  // Timing ASYMETRIQUE : lente a la descente (on DECIDE), rapide au retrait
  // (le systeme a repondu, l'attention part deja ailleurs). Ratio ~0,45.
  // Le bout du doigt est au sommet de la silhouette : a translate(180 y) il tombe
  // a l'ecran en y. Le bouton occupe 196..268 -> contact a y=198.
  const y = interpolate(frame, [10, 52, 62, 84, 150], [430, 198, 198, 300, 300], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // L'appui : 10 frames d'enfoncement puis relachement.
  const appui = interpolate(frame, [52, 62, 78], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entree en fondu — sans elle la main est visible des la frame 0.
  const apparition = spring({ frame: frame - 6, fps, config: { damping: 200, mass: 0.6 } });

  // La main se retire ET s'efface : sans ca la scene se fige sur son dernier tiers
  // (mesure : 0,00 d'ecart entre f110 et f145 — 50 frames mortes).
  const retrait = interpolate(frame, [84, 108], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Le bouton REPOND : il bascule en valide une fois la main partie. C'est ce
  // changement qui occupe la fin, au lieu d'un temps mort.
  const valide = spring({ frame: frame - 96, fps, config: { damping: 16, mass: 0.7 } });

  // --- L'onde de contact : c'est ELLE qui dit « ca a touche » -------------
  // Elle nait a l'instant precis de l'appui et se propage en s'effacant.
  const onde = (retard: number) => {
    const t = frame - 58 - retard;
    if (t < 0 || t > 34) return null;
    const p = t / 34;
    return {
      r: 14 + p * 52,
      o: (1 - p) * 0.5,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#faf9ff" }}>
      <svg width={600} height={500} viewBox="0 0 600 500">
        {/* La cible : un bouton que la main vient toucher */}
        <g opacity={0.95}>
          <rect
            x={186}
            y={196}
            width={228}
            height={72}
            rx={36}
            fill={valide > 0.5 ? "#3fa96a" : appui > 0.5 ? "#7c5cf0" : "#8b6cf6"}
            transform={`translate(0 ${appui * 3}) scale(${1 - appui * 0.02} ${1 - appui * 0.03})`}
            style={{ transformOrigin: "300px 232px" }}
          />
          <text
            x={300}
            y={241}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={26}
            fontWeight={700}
            fill="#ffffff"
            opacity={1 - valide}
          >
            Redeem
          </text>
          {valide > 0.01 && (
            <g opacity={valide} transform={`translate(300 232) scale(${valide})`}>
              <path
                d="M -40 2 L -18 24 L 40 -26"
                fill="none"
                stroke="#ffffff"
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={116}
                strokeDashoffset={116 * (1 - valide)}
              />
            </g>
          )}
        </g>

        {/* L'onde de contact, sous la main */}
        {[0, 9].map((retard, i) => {
          const o = onde(retard);
          if (!o) return null;
          return (
            <circle
              key={i}
              cx={355}
              cy={232}
              r={o.r}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={5}
              opacity={o.o}
            />
          );
        })}

        {/* LA MAIN — dessinee en dernier : elle passe au-dessus */}
        <g opacity={apparition * retrait} transform={`translate(300 ${y}) scale(0.82)`}>
          <path d={SILHOUETTE} fill="#c888f8" opacity={0.14} transform="translate(6 8)" />
          <path
            d={SILHOUETTE}
            fill="#ffffff"
            stroke="#8b5cf6"
            strokeWidth={8}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
