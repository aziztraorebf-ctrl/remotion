// MOTEUR: objet/metaphore SVG (flux d'INTERFACE anime par code)
//
// REPRO-REDEEM — reproduction d'une piece REELLEMENT VENDUE.
// Source : kamotionstudio.site, `Tx4vZDPzej0dHX7jFHDZM4xg.lottie` (800x854, 60 fps,
// 351 frames = 5,85 s). Studio Lottie/UI SaaS, devis sur demande, cite comme
// niveau-cible dans `memory/projects/RECHERCHE-MARCHE-INDEX.md`.
//
// POURQUOI CELLE-CI : c'est le registre `ui-animation` (creneau etroit et cher,
// 969 services contre 27 366 pour product-demo-video), et non la mascotte, qui
// domine le corpus en volume mais que le marche paie moins (verdict 2 du dossier
// marche : les personnages sont au MILIEU du U, l'UI en HAUT).
//
// METHODE REPRO-FOSTER : on ne choisit ni le sujet ni le niveau d'ambition. La
// geometrie et le timing sont RELEVES sur la reference (frames dans `ref/`),
// pas inventes. L'ecart se MESURE (`verifier_fidelite.py`), il ne se juge pas a l'oeil.
//
// LE RECIT, releve frame par frame sur la reference :
//   f0-110    la piece "1000 Dose Coins" et le bouton Redeem sont poses
//   f110-170  la main descend, appuie sur Redeem ; la piece part en etincelles
//   f110-283  le menu monte (Giftcards / Cash / More), la main choisit
//   f277-351  tout s'efface, la coche se trace, "REDEEMED!" apparait
//
// ⚠️ Ce fichier redessine la scene a l'identique de ce qui est VU, il ne recopie
// pas le JSON de la reference. C'est le point du test : savons-nous PRODUIRE ca ?

import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Courbe d'entree canonique — valeur EXACTE relevee (FICHE-GESTE-ANIME), jamais approximee.
const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

export const REDEEM_W = 800;
export const REDEEM_H = 854;
export const REDEEM_FPS = 60;
export const REDEEM_FRAMES = 351;

// Palette relevee sur la reference (pipette sur les frames de `ref/`).
const VIOLET = "#c888f8";    // releve f210, bouton menu
const VIOLET_FONCE = "#8098f8"; // releve f210, bouton bas
const ROSE = "#f9a8d4";
const JAUNE = "#fbbf24";
const JAUNE_FONCE = "#f59e0b";
const BLEU = "#6898f8";      // releve f330, coeur de la coche
const TEXTE = "#7c6df0";
const VERT = "#86c67c";

/** Etincelles — petits losanges qui naissent, grandissent et s'effacent. */
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
        // Position deterministe (pas de Math.random : le rendu doit etre reproductible).
        const a = (i / n) * Math.PI * 2 + 0.4;
        const retard = (i % 3) * 4;
        const p = interpolate(t - retard, [0, duree - retard], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const d = rayon * (0.45 + p * 0.75);
        const x = cx + Math.cos(a) * d;
        const y = cy + Math.sin(a) * d * 0.9;
        // Naissance rapide, disparition lente : timing asymetrique.
        const s = interpolate(p, [0, 0.25, 1], [0, 1, 0], { extrapolateRight: "clamp" });
        const r = 5 + (i % 2) * 3;
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

/** Le curseur-main. Il descend, appuie (l'index se retracte), remonte. */
const Main: React.FC<{ x: number; y: number; echelle: number; appui: number }> = ({
  x,
  y,
  echelle,
  appui,
}) => (
  <g transform={`translate(${x} ${y}) scale(${echelle})`}>
    {/* index — se retracte de 6px a l'appui (le doigt "s'enfonce") */}
    <path
      d={`M 0 ${-46 + appui * 6} L 0 -10`}
      stroke={VIOLET}
      strokeWidth={13}
      strokeLinecap="round"
      fill="none"
    />
    {/* paume */}
    <path
      d="M -20 -12 Q -24 -14 -24 -4 L -24 26 Q -24 46 -4 46 L 16 46 Q 34 46 34 28 L 34 -2 Q 34 -10 28 -10 Q 22 -10 22 -2 L 22 8 L 22 -8 Q 22 -16 16 -16 Q 10 -16 10 -8 L 10 6 L 10 -12 Q 10 -20 4 -20 Q -2 -20 -2 -12 L -2 6 Z"
      fill="#fff"
      stroke={VIOLET}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </g>
);

export const ReproRedeem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ===== TEMPS 1 — la piece et le bouton (f0 -> f170) =====================
  // La piece entre par un pop discret ; le bouton la suit APRES (regle 5 :
  // decaler les secondaires, ne pas faire entrer deux choses ensemble).
  const popPiece = spring({ frame: frame - 6, fps, config: { damping: 14, mass: 0.7 } });
  const popBouton = spring({ frame: frame - 22, fps, config: { damping: 16, mass: 0.6 } });

  // La piece part a l'appui : elle ne GLISSE pas (un jeton n'a pas de moteur),
  // elle se retracte sur place en s'effacant. Regle "objet inerte" du CLAUDE.md.
  const sortiePiece = interpolate(frame, [118, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const echellePiece = popPiece * (1 - sortiePiece * 0.55);
  const opPiece = Math.min(popPiece, 1 - sortiePiece);

  const opBouton = Math.min(popBouton, 1 - interpolate(frame, [118, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  // ===== LA MAIN — le point focal (regle 1) ===============================
  // Elle descend lentement (on DECIDE), appuie vite (le systeme REPOND) :
  // timing asymetrique, ratio ~0,45 comme sur LoadUp.
  const mainY1 = interpolate(frame, [58, 104, 116], [980, 576, 544], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  // L'appui : 8 frames d'enfoncement, puis relachement. Le doigt se retracte
  // ET la main recule de 5px — sans ce recul, l'appui se lit comme un arret net.
  const appui1 = interpolate(frame, [112, 120, 132], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 2e geste : elle remonte vers le menu et survole "Giftcards".
  const mainY2 = interpolate(frame, [150, 196, 232, 262], [544, 700, 600, 588], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  // Decalee a DROITE : la ref ne masque jamais le libelle qu'on choisit.
  const mainX = interpolate(frame, [150, 200, 262], [452, 470, 462], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const appui2 = interpolate(frame, [236, 244, 256], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mainVisible = interpolate(frame, [52, 62, 268, 280], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mY = frame < 150 ? mainY1 : mainY2;
  const mX = frame < 150 ? 430 : mainX;
  const appui = Math.max(appui1, appui2);

  // ===== TEMPS 2 — le menu (f110 -> f283) =================================
  // Les 3 entrees montent en CASCADE (stagger ~7 frames = 116 ms).
  // ⚠️ La cascade est notee "non eprouvee" dans la fiche : ici elle est
  // JUSTIFIEE par la reference, ou les 3 boutons n'arrivent pas ensemble.
  const entreeMenu = (i: number) =>
    spring({ frame: frame - (112 + i * 7), fps, config: { damping: 18, mass: 0.65 } });
  const sortieMenu = interpolate(frame, [272, 292], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });

  // ===== TEMPS 3 — la validation (f277 -> f351) ===========================
  // La coche se TRACE (trimPath), elle n'apparait pas : c'est le geste qui
  // dit "c'est valide". Le cercle tourne pendant qu'elle se dessine.
  const trace = interpolate(frame, [292, 322], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const rotCercle = interpolate(frame, [284, 322], [-120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const popValide = spring({ frame: frame - 284, fps, config: { damping: 15, mass: 0.7 } });
  // Le texte arrive APRES la coche (secondaire decale, regle 5).
  const opTexteFinal = interpolate(frame, [308, 328], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yTexteFinal = interpolate(opTexteFinal, [0, 1], [12, 0]);

  const LONG_COCHE = 132; // longueur mesuree du trace de la coche

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <svg width={REDEEM_W} height={REDEEM_H} viewBox={`0 0 ${REDEEM_W} ${REDEEM_H}`}>
        {/* ---- TEMPS 1 : la piece --------------------------------------- */}
        {opPiece > 0.001 && (
          <g
            opacity={opPiece}
            transform={`translate(400 226) scale(${echellePiece})`}
          >
            {/* medaille dentelee */}
            <g>
              {Array.from({ length: 20 }).map((_, i) => {
                const a = (i / 20) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={Math.cos(a) * 80}
                    cy={Math.sin(a) * 80}
                    r={15}
                    fill={JAUNE}
                  />
                );
              })}
              <circle r={80} fill={JAUNE} />
              <circle r={61} fill={JAUNE_FONCE} opacity={0.55} />
              {/* etoile centrale */}
              <path
                d={Array.from({ length: 10 })
                  .map((_, i) => {
                    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
                    const r = i % 2 === 0 ? 36 : 15;
                    return `${i === 0 ? "M" : "L"} ${Math.cos(a) * r} ${Math.sin(a) * r}`;
                  })
                  .join(" ") + " Z"}
                fill={ROSE}
              />
            </g>
            <text
              y={123}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={30}
              fontWeight={700}
              fill={TEXTE}
            >
              1000
            </text>
            <text
              y={160}
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontSize={26}
              fontWeight={700}
              fill={TEXTE}
            >
              Dose Coins
            </text>
          </g>
        )}

        {/* les etincelles de disparition de la piece */}
        <Etincelles frame={frame} debut={116} duree={40} cx={400} cy={226} rayon={108} n={9} />

        {/* ---- TEMPS 1 : le bouton Redeem -------------------------------- */}
        {opBouton > 0.001 && (
          <g opacity={opBouton} transform={`translate(400 486) scale(${popBouton})`}>
            {/* l'enfoncement du bouton repond a l'appui du doigt */}
            <g transform={`scale(${1 - appui1 * 0.05})`}>
              <rect
                x={-132}
                y={-39}
                width={264}
                height={78}
                rx={39}
                fill={appui1 > 0.5 ? JAUNE : ROSE}
              />
              <text
                y={11}
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
                fontSize={32}
                fontWeight={700}
                fill="#fff"
              >
                Redeem
              </text>
            </g>
          </g>
        )}

        {/* ---- TEMPS 2 : le menu ----------------------------------------- */}
        <g opacity={1 - sortieMenu}>
          {[
            // y = centre de la PILULE, releve sur f270. Ecart vignette->pilule
            // mesure a 122 px, identique pour les deux entrees : c'est une
            // gouttiere, pas un chevauchement.
            { label: "Giftcards", y: 349, couleur: VIOLET, carte: true },
            { label: "Cash", y: 601, couleur: VIOLET_FONCE, carte: false },
            { label: "More", y: 694, couleur: VIOLET_FONCE, carte: false, simple: true },
          ].map((it, i) => {
            const e = entreeMenu(i);
            if (e < 0.001) return null;
            const dy = interpolate(e, [0, 1], [40, 0]);
            // survol : "Giftcards" s'eclaircit quand la main est dessus
            const survol = i === 0 ? appui2 : 0;
            return (
              <g key={it.label} opacity={e} transform={`translate(400 ${it.y + dy})`}>
                {it.carte && (
                  <g transform="translate(0 -46)">
                    <rect x={-62} y={-85} width={124} height={170} rx={16} fill="#fff" stroke="#e8e6f5" strokeWidth={4} />
                    {/* cadeau */}
                    <rect x={-40} y={-12} width={80} height={52} rx={7} fill={VIOLET} />
                    <rect x={-40} y={-12} width={80} height={15} rx={5} fill={ROSE} />
                    <rect x={-7} y={-12} width={14} height={52} fill={ROSE} />
                    <path d="M -7 -12 Q -30 -38 -7 -28 Q 16 -38 7 -12" fill="none" stroke={ROSE} strokeWidth={7} />
                  </g>
                )}
                {!it.carte && !it.simple && (
                  <g transform="translate(0 -122)">
                    <rect x={-62} y={-85} width={124} height={170} rx={16} fill="#fff" stroke="#e8e6f5" strokeWidth={4} />
                    <rect x={-46} y={-26} width={92} height={52} rx={7} fill={VERT} />
                    <circle r={14} fill="#fff" opacity={0.85} />
                    <text y={7} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={19} fontWeight={700} fill={VERT}>
                      $
                    </text>
                  </g>
                )}
                <rect
                  x={-111}
                  y={-25}
                  width={222}
                  height={50}
                  rx={25}
                  fill={it.couleur}
                  opacity={1 - survol * 0.25}
                />
                <text
                  y={9}
                  textAnchor="middle"
                  fontFamily="Arial, sans-serif"
                  fontSize={24}
                  fontWeight={700}
                  fill="#fff"
                >
                  {it.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ---- TEMPS 3 : la validation ----------------------------------- */}
        {popValide > 0.001 && (
          <g transform={`translate(400 314) scale(${popValide})`}>
            <g transform={`rotate(${rotCercle})`}>
              <circle
                r={78}
                fill="none"
                stroke={BLEU}
                strokeWidth={19}
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 78 * 0.82} ${2 * Math.PI * 78}`}
              />
            </g>
            <path
              d="M -37 3 L -10 32 L 41 -29"
              fill="none"
              stroke={BLEU}
              strokeWidth={19}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={LONG_COCHE}
              strokeDashoffset={LONG_COCHE * (1 - trace)}
            />
            <Etincelles frame={frame} debut={296} duree={46} cx={0} cy={0} rayon={126} n={6} />
          </g>
        )}
        {opTexteFinal > 0.001 && (
          <text
            x={400}
            y={472 + yTexteFinal}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize={40}
            fontWeight={700}
            fill={TEXTE}
            opacity={opTexteFinal}
          >
            REDEEMED!
          </text>
        )}

        {/* ---- LA MAIN — dessinee en DERNIER : elle passe au-dessus ------- */}
        {mainVisible > 0.001 && (
          <g opacity={mainVisible}>
            <Main x={mX} y={mY + appui * 5} echelle={1.55} appui={appui} />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
