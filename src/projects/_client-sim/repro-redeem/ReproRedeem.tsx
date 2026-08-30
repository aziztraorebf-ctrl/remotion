// MOTEUR: objet/metaphore SVG (flux d'INTERFACE anime par code)
//
// REPRO-REDEEM — reproduction d'une piece REELLEMENT VENDUE.
// Source : kamotionstudio.site, `Tx4vZDPzej0dHX7jFHDZM4xg.lottie` (800x854, 60 fps,
// 351 frames = 5,85 s). Studio Lottie/UI SaaS, cite comme niveau-cible dans
// `memory/projects/RECHERCHE-MARCHE-INDEX.md`.
//
// ⭐⭐ CE FICHIER NE DESSINE RIEN. Il PILOTE des formes dessinees ailleurs :
//   - les objets -> `assets/planche-ui.svg` (agent svg-dessinateur)
//   - la main    -> `assets/main-greffee.svg` (silhouette de banque restructuree)
// Les deux arrivent par des modules GENERES (`planche.ts`, `silhouette.ts`), jamais
// recopies a la main. C'est la regle n°0 — le modele dessine le statique, NOUS
// animons — et l'erreur deja payee une fois dans ce dossier meme :
// `memory/feedbacks/feedback_svg-dessine-a-la-main-au-lieu-de-deleguer-a-fable.md`
//
// ⛔ LICENCE : la main vient d'une piece sous Lottie Simple License, qui est VIRALE.
// Cette composition est un livrable de PORTFOLIO, pas une piece vendable en exclusivite
// a un client. Detail : `memory/tools/banques-lottie-et-greffe.md`.
//
// LE RECIT, releve frame par frame sur la reference :
//   f0-110    la piece « 1000 Dose Coins » et le bouton Redeem sont poses
//   f110-170  la main descend, appuie sur Redeem ; la piece part en etincelles
//   f110-283  le menu monte (Giftcards / Cash / More), la main choisit
//   f277-351  tout s'efface, la coche se trace, « REDEEMED! » apparait

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

import {
  DEFS,
  MEDAILLE,
  BOUTON_REDEEM,
  VIGNETTE_GIFTCARD,
  VIGNETTE_CASH,
  PILULE_MENU,
  PILULE_MENU_SURVOL,
  COCHE_VALIDATION,
} from "./planche";
import { MAIN_SILHOUETTE } from "./silhouette";

// Courbe d'entree canonique (FICHE-GESTE-ANIME) — valeur EXACTE, jamais approximee.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const REDEEM_W = 800;
export const REDEEM_H = 854;
export const REDEEM_FPS = 60;
export const REDEEM_FRAMES = 351;

const TEXTE = "#7c6df0";
const JAUNE = "#fbbf24";
const ROSE = "#f9a8d4";

/**
 * Pose un groupe dessine dans le SVG source, sous une transformation animee.
 * ⛔ Les formes viennent du SVG : ce composant ne fait que les placer.
 * Les groupes sont dessines a leur position finale dans la planche, d'ou le
 * recentrage sur `ancre` avant toute mise a l'echelle.
 */
const Piece: React.FC<{
  html: string;
  ancre: [number, number];
  x?: number;
  y?: number;
  echelle?: number;
  opacite?: number;
}> = ({ html, ancre, x = 0, y = 0, echelle = 1, opacite = 1 }) => {
  if (opacite <= 0.001 || echelle <= 0.001) return null;
  const [ax, ay] = ancre;
  return (
    <g opacity={opacite} transform={`translate(${ax + x} ${ay + y}) scale(${echelle})`}>
      <g transform={`translate(${-ax} ${-ay})`} dangerouslySetInnerHTML={{ __html: html }} />
    </g>
  );
};

/** Etincelles — losanges qui naissent vite et s'effacent lentement. */
const Etincelles: React.FC<{
  frame: number;
  debut: number;
  duree: number;
  cx: number;
  cy: number;
  rayon: number;
  n?: number;
}> = ({ frame, debut, duree, cx, cy, rayon, n = 7 }) => {
  const t = frame - debut;
  if (t < 0 || t > duree) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        // Deterministe : pas de Math.random, le rendu doit etre reproductible.
        const a = (i / n) * Math.PI * 2 + 0.4;
        const retard = (i % 3) * 4;
        const p = interpolate(t - retard, [0, duree - retard], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const d = rayon * (0.45 + p * 0.75);
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d * 0.9;
        const s = interpolate(p, [0, 0.25, 1], [0, 1, 0], { extrapolateRight: "clamp" });
        const r = 6 + (i % 2) * 4;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s}) rotate(${i * 37})`}>
            <path
              d={`M 0 ${-r} Q 0.6 -0.6 ${r} 0 Q 0.6 0.6 0 ${r} Q -0.6 0.6 ${-r} 0 Q -0.6 -0.6 0 ${-r} Z`}
              fill={i % 2 === 0 ? JAUNE : ROSE}
            />
          </g>
        );
      })}
    </g>
  );
};

export const ReproRedeem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===== TEMPS 1 — la piece et le bouton (f0 -> f170) =====================
  // La piece entre, le bouton la suit APRES : on ne fait pas entrer deux choses
  // ensemble (regle du point focal unique).
  const popPiece = spring({ frame: frame - 6, fps, config: { damping: 14, mass: 0.7 } });
  const popBouton = spring({ frame: frame - 22, fps, config: { damping: 16, mass: 0.6 } });

  // La piece ne GLISSE pas (un jeton n'a pas de moteur) : elle se retracte sur place
  // en s'effacant. Regle « objet inerte » du CLAUDE.md.
  const sortiePiece = interpolate(frame, [118, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const echellePiece = popPiece * (1 - sortiePiece * 0.55);
  const opPiece = Math.min(popPiece, 1 - sortiePiece);

  const opBouton = Math.min(
    popBouton,
    1 -
      interpolate(frame, [118, 140], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
  );

  // ===== LA MAIN — le point focal =========================================
  // Timing ASYMETRIQUE : lente a la descente (on DECIDE), rapide au retrait (le
  // systeme a repondu). ⭐ Le doigt NE PLIE PAS — mesure sur 3 references de
  // banque : l'illusion du tap vient du DEPLACEMENT + de l'onde de contact.
  // ⭐⭐ LE DOIGT NE VISE PAS LE CENTRE DE LA CIBLE — mesure sur la reference.
  // Position MONDE relevee dans le .lottie (precomp 4, parent `Null 1` a 400,476) :
  //   Giftcard Button = (450, 422)  mais le doigt s'arrete a (400, 344)
  //   Cash Button     = (450, 629)  mais le doigt s'arrete a (400, 601)
  // => le doigt se pose SYSTEMATIQUEMENT en HAUT-A-GAUCHE de la cible (-50 px en x,
  // -78 / -28 px en y), la ou il n'y a PAS de texte. C'est CA qui garde le libelle
  // lisible, et non une main plus petite ou repoussee sur le cote.
  // ⛔ Viser le centre (ce que faisait la 1re passe du fix) remet le doigt sur le mot.
  const DECALAGE_X = -46; // le doigt mord le bord gauche de la pilule
  const Y_REDEEM = 486 - 20;
  const Y_GIFTCARDS = 349 - 26;
  const mainY1 = interpolate(frame, [58, 106, 118], [930, Y_REDEEM + 16, Y_REDEEM], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const mainY2 = interpolate(
    frame,
    [150, 200, 240, 268],
    [Y_REDEEM, Y_REDEEM + 124, Y_GIFTCARDS + 12, Y_GIFTCARDS],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_OUT,
    },
  );
  const mainVisible = interpolate(frame, [52, 64, 272, 288], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mY = frame < 150 ? mainY1 : mainY2;
  // ⭐⭐ CORRIGE le 2026-08-30 — mesure sur la reference, pas dosage.
  // L'ancien commentaire ici disait « le probleme n'etait pas sa TAILLE mais le
  // fait qu'elle COUVRAIT le contenu », et deplacait la main a droite (372/418).
  // C'etait FAUX, et la main couvrait toujours Redeem et Giftcards.
  //
  // Mesure du .lottie de reference (precomps 4 et 5, calque `Hand`) :
  //   - position     p = (400,2 , 344) puis (383,2 , 484,9)  => CENTREE sur x=400,
  //     c'est-a-dire exactement l'axe des boutons, PAS decalee sur le cote.
  //   - echelle      s = 62 %  sur une bbox de 214 px => 133 px de large.
  //     La main de reference est donc PLUS GROSSE que la notre (110 px), et elle
  //     ne gene pas malgre ca : la taille n'a jamais ete le probleme.
  //   - ancre        a = (-112,8 , -187,6) sur une bbox x[-111..104] y[-171..173]
  //     => l'ancre est au BOUT DU DOIGT (-1 % en largeur, -5 % en hauteur).
  //
  // ⭐ LA CAUSE REELLE : c'est l'ANCRE. En reference, `p` place le bout du doigt,
  // et le corps de la main s'etale vers le bas-droite, hors du contenu. Chez nous
  // `translate(mX,mY)` placait le COIN HAUT-GAUCHE du path, dont le doigt est a
  // (67,0) — soit 67 px plus a droite, corps rabattu SUR les boutons.
  // FIX : on vise le centre du bouton (x=400) et on soustrait l'offset du doigt.
  const MAIN_ECHELLE = 0.7;
  const DOIGT = [67.28, 0] as const; // bout du doigt dans le path source
  const mX = 400 + DECALAGE_X;

  // L'onde de contact : c'est ELLE qui dit « ca a touche », pas une articulation.
  const onde = (debut: number, retard: number) => {
    const t = frame - debut - retard;
    if (t < 0 || t > 30) return null;
    const p = t / 30;
    return { r: 12 + p * 46, o: (1 - p) * 0.45 };
  };

  // ===== TEMPS 2 — le menu (f110 -> f292) =================================
  // Les 3 entrees montent en CASCADE (stagger ~7 frames = 116 ms) : dans la
  // reference les boutons n'arrivent pas ensemble.
  const entreeMenu = (i: number) =>
    spring({ frame: frame - (112 + i * 7), fps, config: { damping: 18, mass: 0.65 } });
  const sortieMenu = interpolate(frame, [272, 292], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // Le survol de « Giftcards » quand la main arrive dessus.
  const survol = interpolate(frame, [236, 248, 262], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ===== TEMPS 3 — la validation (f284 -> f351) ===========================
  const popValide = spring({ frame: frame - 284, fps, config: { damping: 15, mass: 0.7 } });
  const opTexteFinal = interpolate(frame, [308, 328], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yTexteFinal = interpolate(opTexteFinal, [0, 1], [12, 0]);

  // Les 3 entrees du menu : y = centre de la pilule, releve sur la reference (f270).
  // La vignette est dessinee 122 px plus haut dans la planche : ecart mesure, constant.
  const ENTREES: {
    cle: string;
    libelle: string;
    y: number;
    vignette: string | null;
    ancreV: [number, number] | null;
  }[] = [
    {
      cle: "giftcards",
      libelle: "Giftcards",
      y: 349,
      vignette: VIGNETTE_GIFTCARD,
      ancreV: [400, 227],
    },
    { cle: "cash", libelle: "Cash", y: 601, vignette: VIGNETTE_CASH, ancreV: [400, 479] },
    { cle: "more", libelle: "More", y: 694, vignette: null, ancreV: null },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <svg width={REDEEM_W} height={REDEEM_H} viewBox={`0 0 ${REDEEM_W} ${REDEEM_H}`}>
        {/* Les degrades du SVG source, poses une seule fois. */}
        <defs dangerouslySetInnerHTML={{ __html: DEFS }} />

        {/* ---- TEMPS 1 : la medaille et le bouton ------------------------ */}
        <Piece html={MEDAILLE} ancre={[400, 226]} echelle={echellePiece} opacite={opPiece} />
        <g opacity={opPiece}>
          <text
            x={400}
            y={349}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={30}
            fontWeight={700}
            fill={TEXTE}
          >
            1000
          </text>
          <text
            x={400}
            y={386}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={26}
            fontWeight={700}
            fill={TEXTE}
          >
            Dose Coins
          </text>
        </g>
        <Etincelles frame={frame} debut={116} duree={40} cx={400} cy={226} rayon={108} n={9} />

        <Piece html={BOUTON_REDEEM} ancre={[400, 486]} echelle={popBouton} opacite={opBouton} />

        {/* ---- TEMPS 2 : le menu ----------------------------------------- */}
        <g opacity={1 - sortieMenu}>
          {ENTREES.map((e, i) => {
            const ent = entreeMenu(i);
            if (ent < 0.001) return null;
            const dy = interpolate(ent, [0, 1], [40, 0]);
            const actif = e.cle === "giftcards" && survol > 0.5;
            return (
              <g key={e.cle} opacity={ent}>
                {e.vignette && e.ancreV && (
                  // ⛔ Le facteur 2 essaye ici etait une SUR-CORRECTION : le 244-268
                  // mesure sur la reference incluait les etincelles autour, pas la
                  // carte. La CARTE de reference fait 169-171 de haut, la notre 170 :
                  // elle etait deja a la bonne taille.
                  // Le cadre fait desormais 220x168 (mesure sur la reference,
                  // PLUS LARGE que haut) : le contenu d'origine y tient sans mise a
                  // l'echelle, avec de la marge autour.
                  <Piece html={e.vignette} ancre={e.ancreV} y={dy} echelle={1.0} />
                )}
                {/* La pilule est dessinee centree en (400,0) dans la planche :
                    on la deplace a la hauteur de son entree. */}
                <Piece
                  html={actif ? PILULE_MENU_SURVOL : PILULE_MENU}
                  ancre={[400, 0]}
                  y={e.y + dy}
                />
                <text
                  x={400}
                  y={e.y + dy + 9}
                  textAnchor="middle"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize={24}
                  fontWeight={700}
                  fill="#ffffff"
                >
                  {e.libelle}
                </text>
              </g>
            );
          })}
        </g>

        {/* ---- TEMPS 3 : la validation ----------------------------------- */}
        <Piece
          html={COCHE_VALIDATION}
          ancre={[400, 314]}
          echelle={popValide}
          opacite={popValide}
        />
        {popValide > 0.01 && (
          <Etincelles frame={frame} debut={296} duree={46} cx={400} cy={314} rayon={126} n={6} />
        )}
        {opTexteFinal > 0.001 && (
          <text
            x={400}
            y={472 + yTexteFinal}
            textAnchor="middle"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize={40}
            fontWeight={700}
            fill={TEXTE}
            opacity={opTexteFinal}
          >
            REDEEMED!
          </text>
        )}

        {/* ---- LA MAIN — dessinee en DERNIER : elle passe au-dessus ------- */}
        {[0, 9].map((retard, i) => {
          const o = onde(frame < 150 ? 116 : 244, retard);
          if (!o) return null;
          return (
            <circle
              key={i}
              cx={mX}
              cy={mY}
              r={o.r}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth={5}
              opacity={o.o}
            />
          );
        })}
        {/* Ancrage sur le BOUT DU DOIGT (cf. bloc « LA MAIN » plus haut) : on se
            place au point de contact, on applique la rotation de 10 deg relevee
            sur la reference, puis on recule le path de l'offset du doigt pour que
            ce soit LUI qui tombe sur (mX,mY) — et non le coin haut-gauche. */}
        {mainVisible > 0.001 && (
          <g
            opacity={mainVisible}
            transform={
              `translate(${mX} ${mY}) rotate(10) scale(${MAIN_ECHELLE}) ` +
              `translate(${-DOIGT[0]} ${-DOIGT[1]})`
            }
          >
            <path d={MAIN_SILHOUETTE} fill="#c888f8" opacity={0.14} transform="translate(6 8)" />
            <path
              d={MAIN_SILHOUETTE}
              fill="#ffffff"
              stroke="#8b5cf6"
              strokeWidth={8}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
