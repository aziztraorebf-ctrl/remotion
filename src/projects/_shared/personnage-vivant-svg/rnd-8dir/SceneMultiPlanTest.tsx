/**
 * SceneMultiPlanTest — SCÈNE NARRATIVE DE TEST (session 2026-07-02, piste A "8 directions", étape finale).
 * LE vrai test de la consolidation StickRigMultiDir : un perso qui avance/tourne/recule/revient sur ses pas,
 * en changeant de vue EN COURS DE MOUVEMENT (pas 3 vues isolées côte à côte comme ProtoMultiDirTest).
 *
 * Décision Aziz 2026-07-02 : commencer par le CUT INSTANTANÉ entre vues (change de composant au bon frame),
 * PAS une interpolation géométrique fluide entre 2 projections (chantier à part si le cut ne convainc pas).
 *
 * v2 (RÈGLE PRO, après revue croisée Gemini 3.1 Pro + GPT-5.5, 2026-07-02) : le v1 utilisait StickRigMultiDir
 * partout — MAIS à petite échelle (perso lointain), les jambes dos/face deviennent illisibles (contrainte
 * géométrique : le pas se lit sur Y écran en dos/face, quelques pixels seulement, vs X en profil, large et
 * lisible à toute taille — voir PERSONNAGE-VIVANT-INDEX.md § 8 DIRECTIONS). Les 2 modèles confirment : les
 * studios pro (Kurzgesagt, Infographics Show...) NE forcent PAS un cycle de jambes lisible à toute échelle et
 * dans toutes les directions — ils réservent profil/3-4 à la marche en plan large, et dos/face à une version
 * simplifiée "Scale & Bob" (StickFigureSimplified : jambes fixes, bob du corps + swing bras + scale) quand le
 * perso est loin/petit. Le rig complet (StickRigMultiDir) reste utilisé pour dos/face en gros plan/proche.
 *
 * PARCOURS EN "U" (force les 4 vues dans l'ordre, y compris les 2 transitions les plus dures) :
 *  1. FACE — le perso marche DROIT vers la caméra (entrée).
 *  2. Pivote à gauche → 3/4 — s'engage vers le fond-gauche (passe devant un cacaoyer).
 *  3. PROFIL — longe le cacaoyer, franc profil gauche→droite... non, ICI le perso va vers la GAUCHE (facing=-1
 *     sur StickRig), cohérent avec la diagonale 3/4 précédente.
 *  4. Pivote encore → DOS — s'éloigne tout droit vers le fond (démonstration du Y-stride dos, version SIMPLIFIÉE
 *     car lointain).
 *  5. DEMI-TOUR (cut direct dos→dos, juste le sens de marche s'inverse conceptuellement — le rig ne bouge pas
 *     mais x recommence à augmenter).
 *  6. DOS→3/4 (retour) → PROFIL (retour, facing=1) → 3/4 (retour) → FACE (sortie vers la caméra).
 *
 * Chaque CUT est placé à un moment où le personnage change de direction (le mouvement lui-même masque une
 * partie de la discontinuité — le spectateur s'attend à un changement visuel au moment du virage).
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from "remotion";
import { StickRig } from "../rig/StickRig";
import { StickRigMultiDir } from "../rig/StickRigMultiDir";
import { StickFigureSimplified } from "../rig/StickFigureSimplified";

// seuil d'échelle sous lequel dos/face passent en version simplifiée (jambes fixes + bob) — au-dessus,
// le rig complet reste lisible. Calibré empiriquement (à ajuster visuellement si besoin).
const SIMPLIFIED_SCALE_THRESHOLD = 0.85;

const INK = "#2b2117";
const PARCH = "#e8dcc0";
const EASE = Easing.bezier(0.4, 0, 0.2, 1);

export const SCENE_MULTIPLAN_TEST_FRAMES = 480;

// ---- perso : identité visuelle CONSTANTE sur tout le parcours (le test porte sur la continuité) ----
const PERSO = { tunicColor: "#6b8e5a", tunicPattern: "stripes" as const, neckwear: "scarf-knot" as const, neckwearColor: "#b5552f", hat: "cap" as const };

// ---- timeline du parcours en U (frames @30) ----
const F_FACE_IN_END = 70;     // fin du segment FACE (entrée vers caméra)
const F_3Q_OUT_END = 150;     // fin du segment 3/4 (sortie, va vers le fond-gauche)
const F_PROFILE_OUT_END = 230; // fin du segment PROFIL (longe le cacaoyer, facing=-1)
const F_BACK_OUT_END = 300;   // fin du segment DOS (s'éloigne tout droit) — puis DEMI-TOUR
const F_BACK_IN_END = 340;    // fin du 2e segment DOS (retour, redémarre vers la caméra depuis le fond)
const F_PROFILE_IN_END = 400; // fin du segment PROFIL retour (facing=1)
const F_3Q_IN_END = 450;      // fin du segment 3/4 retour
const F_END = SCENE_MULTIPLAN_TEST_FRAMES; // segment FACE retour (sortie vers caméra)

// arbre décalé HORS de la trajectoire du perso (qui passe par x=W/2=960 en face, x=340 en dos) —
// bug trouvé en v2 : arbre pile sur le chemin d'entrée créait un faux "torse énorme" à l'écran.
const CACAO_X = 1400, CACAO_Y = 640;

const CacaoTreeSimple: React.FC = () => (
  <g transform={`translate(${CACAO_X} ${CACAO_Y})`}>
    <path d="M0 0 L-6 -140" stroke={INK} strokeWidth={10} strokeLinecap="round" fill="none" />
    <ellipse cx={-10} cy={-170} rx={70} ry={55} fill="#5a7a4a" stroke={INK} strokeWidth={4} opacity={0.85} />
  </g>
);

export const SceneMultiPlanTest: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1920, H = 1080;
  const GROUND_Y = 760;

  // position X,Y du perso sur l'écran selon le segment courant (trajectoire en U)
  let x = W / 2, y = GROUND_Y, view: "face" | "3quarter" | "profile" | "back" = "face", facing: 1 | -1 = -1;

  if (frame < F_FACE_IN_END) {
    // FACE : entre par le fond, marche droit vers la caméra (grossit légèrement = approche)
    const t = frame / F_FACE_IN_END;
    x = W / 2; y = interpolate(t, [0, 1], [GROUND_Y - 260, GROUND_Y], { easing: EASE });
    view = "face";
  } else if (frame < F_3Q_OUT_END) {
    // 3/4 : pivote, s'engage en diagonale vers le fond-gauche
    const t = (frame - F_FACE_IN_END) / (F_3Q_OUT_END - F_FACE_IN_END);
    x = interpolate(t, [0, 1], [W / 2, W / 2 - 260], { easing: EASE });
    y = interpolate(t, [0, 1], [GROUND_Y, GROUND_Y - 90], { easing: EASE });
    view = "3quarter"; facing = -1;
  } else if (frame < F_PROFILE_OUT_END) {
    // PROFIL : longe le cacaoyer vers la gauche (facing=-1)
    const t = (frame - F_3Q_OUT_END) / (F_PROFILE_OUT_END - F_3Q_OUT_END);
    x = interpolate(t, [0, 1], [W / 2 - 260, 340], { easing: EASE });
    y = GROUND_Y - 90;
    view = "profile"; facing = -1;
  } else if (frame < F_BACK_OUT_END) {
    // DOS : s'éloigne tout droit vers le fond (Y-stride, rétrécit)
    const t = (frame - F_PROFILE_OUT_END) / (F_BACK_OUT_END - F_PROFILE_OUT_END);
    x = 340; y = interpolate(t, [0, 1], [GROUND_Y - 90, GROUND_Y - 260], { easing: EASE });
    view = "back";
  } else if (frame < F_BACK_IN_END) {
    // DEMI-TOUR : cut direct, le perso repart (toujours DOS le temps du cut, redescend légèrement)
    const t = (frame - F_BACK_OUT_END) / (F_BACK_IN_END - F_BACK_OUT_END);
    x = 340; y = interpolate(t, [0, 1], [GROUND_Y - 260, GROUND_Y - 170], { easing: EASE });
    view = "back";
  } else if (frame < F_PROFILE_IN_END) {
    // PROFIL retour : revient vers la droite (facing=1), repasse devant le cacaoyer
    const t = (frame - F_BACK_IN_END) / (F_PROFILE_IN_END - F_BACK_IN_END);
    x = interpolate(t, [0, 1], [340, W / 2 - 260], { easing: EASE });
    y = interpolate(t, [0, 1], [GROUND_Y - 170, GROUND_Y - 90], { easing: EASE });
    view = "profile"; facing = 1;
  } else if (frame < F_3Q_IN_END) {
    // 3/4 retour : diagonale vers la caméra
    const t = (frame - F_PROFILE_IN_END) / (F_3Q_IN_END - F_PROFILE_IN_END);
    x = interpolate(t, [0, 1], [W / 2 - 260, W / 2], { easing: EASE });
    y = interpolate(t, [0, 1], [GROUND_Y - 90, GROUND_Y], { easing: EASE });
    view = "3quarter"; facing = 1;
  } else {
    // FACE retour : sortie droit vers la caméra (grossit, sort du cadre en bas)
    const t = (frame - F_3Q_IN_END) / (F_END - F_3Q_IN_END);
    x = W / 2; y = interpolate(t, [0, 1], [GROUND_Y, GROUND_Y + 260], { easing: EASE });
    view = "face";
  }

  // échelle : plus petit loin (dos au plus loin), plus grand près (face à l'arrivée/au départ)
  // corrigée (v2) : perso trop petit dans l'ensemble du v1 — bornes augmentées pour mieux exploiter le cadre.
  const distFromGround = GROUND_Y - y; // positif = plus loin (plus haut à l'écran)
  const scale = interpolate(distFromGround, [-260, 0, 260], [2.6, 1.7, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const moveAmt = 1; // marche continue tout le long (pas d'arrêt dans ce test)
  // dos/face : sous le seuil (perso lointain) -> version SIMPLIFIÉE (bob+scale+bras, pas de jambes articulées).
  // profil/3-4 : gardent TOUJOURS le rig complet (lisibles nativement à toute échelle — regle pro).
  const useSimplified = (view === "back" || view === "face") && scale < SIMPLIFIED_SCALE_THRESHOLD;

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 ${GROUND_Y + 20} H ${W}`} stroke={INK} strokeWidth={2.4} opacity={0.3} fill="none" />
        <CacaoTreeSimple />

        <g transform={`translate(${x} ${y})`}>
          {view === "profile" ? (
            <g transform={`scale(${scale})`}>
              <StickRig walkPhase={frame} moveAmt={moveAmt} facing={facing} {...PERSO} />
            </g>
          ) : useSimplified ? (
            <StickFigureSimplified view={view as "back" | "face"} walkPhase={frame} facing={facing} scale={scale} {...PERSO} />
          ) : (
            <StickRigMultiDir view={view} walkPhase={frame} moveAmt={moveAmt} facing={facing} scale={scale} {...PERSO} />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
