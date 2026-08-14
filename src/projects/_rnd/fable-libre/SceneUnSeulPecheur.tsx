// ============================================================================================
// SCENE NARRATIVE — UN SEUL PECHEUR (2026-08-04)
// ============================================================================================
//
// POURQUOI CE FICHIER : 2e "vraie scene" du registre stick figure, format HYPOTHESE ("et si...")
// — inspire d'une reference Fiverr montree par Aziz (comparaison "et si la lune devenait un trou
// noir") : prémisse absurde posee sechement, escalade, chute qui desamorce sans resoudre. Angle
// choisi par Aziz : "et si un seul pecheur devait nourrir tout le continent".
//
// LE FILTRE DE SCENE (§ 4 de STICK-FIGURE-INDEX.md) applique AVANT de coder :
//   - SOL ? OUI — reutilise le decor VILLAGE deja valide et rendu (VillageParallaxeAnime.tsx),
//     sable/premier plan a plat, aucune surface a inventer.
//   - GESTE DU CORPS, pas d'objet complexe ? OUI — porter un panier (brique deja validee,
//     ObjetPanier de identite/Roles.tsx) + marcher charge (hipDrop, brique validee). Le panier
//     lui-meme n'est jamais retaille en cours de scene (ce serait un objet a ETAT non prouve,
//     cf. bug documente "bras elastique du sac") — seule la PILE au sol grossit, qui est du
//     decor statique, pas un geste du personnage.
//   - DECOR RENDU ET REGARDE ? OUI — VillageParallaxeAnime deja rendu et regarde (2026-07-27,
//     "reussi du premier coup" selon l'index).
// -> 3/3.
//
// ⛔ CE FICHIER NE REUTILISE PAS PecheurDuree16x9.tsx NI SON GESTE (tirer un filet) — decision
// Aziz (2026-08-04) : porter un fichier de scene ecrit pour un AUTRE recit revient a le
// desosser pour un benefice marginal. Seules les VRAIES briques transversales sont reutilisees :
// le decor village (matiere neutre, sans personnage), le socle <Figure>, la brique "porter"
// (hipDrop + walkDistance + ObjetPanier), toutes deja validees independamment.
//
// FORME CHOISIE (tranchee par Claude, cf. echange avec Aziz) : LA MULTIPLICATION, pas la
// disproportion figee des le depart. Le pecheur porte un panier, aller-retour apres aller-retour,
// TOUJOURS AU MEME RYTHME — mais la PILE de paniers deposes au sol grossit sous les yeux du
// spectateur a chaque retour, jusqu'a devenir absurde. La tension vient de l'ecart croissant
// entre son rythme inchange et la charge qui, elle, ne s'arrete jamais de s'accumuler — pas
// d'une chute, l'absurde ne se resout jamais (cf. reference : "for now").
//
// TECHNIQUE : frame-driven, zero Math.random / setTimeout / CSS transition / @keyframes.
// ============================================================================================
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { VillageParallaxeAnime } from "../fable-svg/VillageParallaxeAnime";
import {
  Figure,
  type Pose,
  type WalkParams,
  walkDistance,
  ENCRE,
} from "../../_shared/stick-figure-svg/StickFigure";
import { ObjetPanier, ROLE_MAIN_REPOS } from "../../_shared/stick-figure-svg/identite/Roles";

// --------------------------------------------------------------------------------------------
// TIMING — N allers-retours, cadence CONSTANTE (c'est le point : lui ne change pas)
// --------------------------------------------------------------------------------------------
const FPS = 30;
const SOL_Y = 900; // zone degagee du decor village (entre sable et premier plan filet/pirogues)
const PERSO_SCALE = 4.6;
const CADENCE = 1.15; // cycles/s — CONSTANT sur toute la scene (le rythme ne varie jamais)

// un "voyage" = sortie (porte un panier vers le tas) + retour (repart chercher le suivant)
const X_DEPART = 620;  // point de depart/retour (source des paniers, hors-champ implicite)
const X_TAS = 1180;    // position du tas grandissant
// ⭐ calcule (pas devine) via walkDistance : a CADENCE=1.15 cycle/s, swing=15deg, PERSO_SCALE=4.6,
// il faut ~90 frames pour parcourir les 560px entre X_DEPART et X_TAS sans patiner.
const VOYAGE_DUR = 90;
// 5 voyages (pas 9) : la scene reste sous les 26s du decor (VillageParallaxeAnime se fige a sa
// derniere frame au-dela, ce qui serait narrativement ACCEPTABLE — "meme la nuit tombee, ca
// continue" — mais un format court gagne a rester dans le calibre du decor plutot que forcer.
const N_VOYAGES = 5;   // le tas grossit 5 fois — la derniere charge est deja visiblement absurde
const T_FIN = N_VOYAGES * VOYAGE_DUR * 2 + 40;
export const UN_SEUL_PECHEUR_FRAMES = T_FIN;

// verrou pas/distance (brique n1) : verifie que VOYAGE_DUR permet bien de parcourir la distance
// X_TAS - X_DEPART a la CADENCE fixee, swing WALK_PORTEUR — sinon le pas patinerait.
const WALK_PORTEUR: WalkParams = { swingMax: 15, bobAmp: 2, lean: 6, hipDrop: 2.5, armSwing: 12 };

// --------------------------------------------------------------------------------------------
// LE TAS DE PANIERS — decor qui grossit, PAS un geste du personnage (brique separee, aucun
// etat a gerer sur l'objet PORTE : seul le tas AU SOL, statique entre deux depots, s'empile).
// --------------------------------------------------------------------------------------------
// ObjetPanier est dessine dans le repere LOCAL du socle (unites ~10-30, meme echelle que
// <Figure>) — il DOIT donc etre place sous un <g scale={PERSO_SCALE}>, exactement comme le
// panier porte par le personnage, sinon il apparait ~5x trop petit (bug constate au rendu :
// mini-points dores a peine visibles pres des pieds). Le pas d'empilement est en unites LOCALES.
const TAS_PAS_X = 20;
const TAS_PAS_Y = 20;

const Tas: React.FC<{ nDeposes: number }> = ({ nDeposes }) => {
  if (nDeposes <= 0) return null;
  // empilement en pyramide grossiere : chaque rangee ajoute des paniers, la pile monte.
  const paniers: { x: number; y: number }[] = [];
  let placed = 0;
  let row = 0;
  while (placed < nDeposes) {
    const rowCount = Math.max(1, 5 - row); // rangees qui retrecissent vers le haut
    for (let i = 0; i < rowCount && placed < nDeposes; i++) {
      const x = (i - (rowCount - 1) / 2) * TAS_PAS_X;
      const y = -row * TAS_PAS_Y;
      paniers.push({ x, y });
      placed++;
    }
    row++;
  }
  return (
    <g transform={`translate(${X_TAS} ${SOL_Y}) scale(${PERSO_SCALE})`}>
      {paniers.map((p, i) => (
        <ObjetPanier key={i} main={{ x: p.x, y: p.y }} angleDeg={0} />
      ))}
    </g>
  );
};

// --------------------------------------------------------------------------------------------
// LE DEMI-TOUR — retour Aziz (2026-08-04) : "il marche a reculons" (meme bug deja corrige sur
// SceneCreancier — pas re-applique ici, erreur repetee). Le socle <Figure> ne sait dessiner QUE
// le profil, oriente pour avancer vers +x (regle dure du registre : dos/trois-quarts ecartes).
// Faire decroitre x sans rien changer d'autre fait "reculer" le personnage a rebours de sa
// propre anatomie. PAS de mirror permanent (inverserait tout le retour, cf. tentative ecartee
// sur SceneCreancier) — a la place : un PIVOT BREF au moment du demi-tour. Technique standard
// d'animation 2D pour un personnage de profil qui doit changer de sens : le corps se "raetrecit"
// en largeur (scaleX -> ~0, le profil s'aplatit, illisible une fraction de seconde comme un vrai
// demi-tour rapide) puis se redeploie de l'autre cote (scaleX -> -1) — jamais de dos montre,
// jamais de recul, jamais un flip instantane choquant.
const PIVOT_DUR = 10; // frames — bref, le temps d'un vrai demi-tour rapide

// scaleX du personnage : 1 (va vers +x, aller) -> pivot au debut du retour -> -1 (marche
// normalement vers -x a l'ecran, mais TOUJOURS "en avant" pour son anatomie) -> pivot en fin de
// retour -> repart a 1. easeInOutCubic sur le pivot (jamais lineaire, cf. regle du registre).
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ⛔ PIEGE VECU : tVoyage va de 0 a VOYAGE_DUR*2 EXCLU (le voyage suivant repart a 0) — le pivot
// de "fin de retour" n'atteint donc JAMAIS tVoyage=VOYAGE_DUR*2, il tombe en TOUT DEBUT du
// PROCHAIN voyage (tVoyage proche de 0). 4 zones non chevauchantes, dans l'ordre :
//   [0, PIVOT_DUR/2[             : fin du pivot de retour->aller, scaleX -1 -> +1
//   [PIVOT_DUR/2, VOYAGE_DUR-PIVOT_DUR/2[ : ALLER stable, scaleX = +1
//   [VOYAGE_DUR-PIVOT_DUR/2, VOYAGE_DUR+PIVOT_DUR/2[ : pivot aller->retour, scaleX +1 -> -1
//   [VOYAGE_DUR+PIVOT_DUR/2, VOYAGE_DUR*2[ : RETOUR stable, scaleX = -1
const scaleXDuPivot = (tVoyage: number): number => {
  if (tVoyage < PIVOT_DUR / 2) {
    const p = (tVoyage + PIVOT_DUR / 2) / PIVOT_DUR; // 0.5 -> 1
    return -1 + 2 * easeInOutCubic(p);
  }
  const pivotStart = VOYAGE_DUR - PIVOT_DUR / 2;
  const pivotEnd = VOYAGE_DUR + PIVOT_DUR / 2;
  if (tVoyage >= pivotStart && tVoyage < pivotEnd) {
    const p = (tVoyage - pivotStart) / PIVOT_DUR; // 0 -> 1
    return 1 - 2 * easeInOutCubic(p);
  }
  return tVoyage < VOYAGE_DUR ? 1 : -1;
};

// --------------------------------------------------------------------------------------------
// LE PECHEUR — porte un panier, aller-retour, cadence CONSTANTE
// --------------------------------------------------------------------------------------------
const Pecheur: React.FC<{ frame: number }> = ({ frame }) => {
  const voyageIdx = Math.min(N_VOYAGES - 1, Math.floor(frame / (VOYAGE_DUR * 2)));
  const tVoyage = frame - voyageIdx * VOYAGE_DUR * 2;
  const enAller = tVoyage < VOYAGE_DUR; // va vers le tas, panier en main
  const localFrame = enAller ? tVoyage : tVoyage - VOYAGE_DUR;

  const t = localFrame / FPS;
  const cycles = t * CADENCE;
  const d = walkDistance(cycles * 2, WALK_PORTEUR.swingMax, PERSO_SCALE);
  const distanceTotale = X_TAS - X_DEPART;
  const dClamped = Math.min(d, distanceTotale);

  // xEcran : position affichee, decroit visuellement au retour (X_TAS -> X_DEPART) comme avant.
  // Ce qui EMPECHE le "moonwalk" n'est plus x mais le miroir scaleX(-1) applique au <g> parent
  // (cf. scaleXDuPivot ci-dessous) : le personnage garde SA MEME anatomie de marche +x, mais
  // affiche a l'envers pendant tout le retour -> il progresse "en avant" a l'ecran vers la
  // gauche, jamais a reculons, sans jamais montrer un dos.
  const xEcran = enAller ? X_DEPART + dClamped : X_TAS - dClamped;
  const phase = cycles % 1;

  const sx = scaleXDuPivot(tVoyage);
  // pendant le pivot (|sx| < 1), le personnage est virtuellement immobile — bloque a la position
  // ou il vient de s'arreter (PAS "enAller ? X_TAS : X_DEPART" — ce raccourci se trompe sur le
  // pivot de tout debut de voyage, ou enAller=true mais on sort du retour, donc a X_DEPART).
  const enPivot = Math.abs(sx) < 0.999;
  const pivotDebutVoyage = tVoyage < PIVOT_DUR / 2; // sortie du retour precedent -> bloque a X_DEPART
  const xFinal = !enPivot ? xEcran : pivotDebutVoyage ? X_DEPART : X_TAS;

  // le panier PORTE reste TOUJOURS le meme (jamais retaille) — seul le tas au sol grandit.
  // point d'accroche = ROLE_MAIN_REPOS.commercante (deja calibre pour un panier tenu en marche,
  // identite/Roles.tsx) — reutilise tel quel plutot que d'inventer des coordonnees a la main.
  const repos = ROLE_MAIN_REPOS.commercante;
  const pose: Pose = enAller && !enPivot
    ? { hand1: [repos.x, repos.y], torsoDeg: WALK_PORTEUR.lean }
    : {}; // retour ou pivot : bras au repos normal

  const nDeposes = voyageIdx + (enAller ? 0 : 1); // le tas grossit au moment du depot (fin d'aller)

  return (
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <Tas nDeposes={nDeposes} />
      <g transform={`translate(${xFinal} ${SOL_Y}) scale(${PERSO_SCALE * sx} ${PERSO_SCALE})`}>
        {/* panier D'ABORD (sous la main), Figure ENSUITE — pose.hand1 tend deja le bras avant
            du socle vers le point d'accroche : pas besoin de hideArm1/redessin, la main de
            <Figure> recouvre naturellement l'anse (meme mecanisme que Figure sans habillage). */}
        {enAller && !enPivot && <ObjetPanier main={{ x: repos.x, y: repos.y }} angleDeg={repos.angleDeg} />}
        <Figure x={0} y={0} phase={phase} p={WALK_PORTEUR} pose={pose} color={ENCRE} scale={1} />
      </g>
    </svg>
  );
};

// --------------------------------------------------------------------------------------------
// TEXTE — l'hypothese posee sechement, puis le chiffre qui l'aggrave (registre "reference")
// --------------------------------------------------------------------------------------------
const Texte: React.FC<{ frame: number }> = ({ frame }) => {
  const op1 = interpolate(frame, [10, 40, T_FIN * 0.35, T_FIN * 0.35 + 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op2 = interpolate(
    frame,
    [T_FIN * 0.4, T_FIN * 0.4 + 30, T_FIN - 20],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: op1,
          color: "#fdf6e3",
          fontSize: 46,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        Et si un seul pêcheur devait nourrir tout le continent ?
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: op2,
          color: "#fdf6e3",
          fontSize: 34,
          fontFamily: "Georgia, serif",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}
      >
        Il continue au même rythme. La charge, elle, ne s'arrête jamais.
      </div>
    </AbsoluteFill>
  );
};

// --------------------------------------------------------------------------------------------
// SCENE COMPLETE
// --------------------------------------------------------------------------------------------
export const SceneUnSeulPecheur: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <VillageParallaxeAnime />
      <Pecheur frame={frame} />
      <Texte frame={frame} />
    </AbsoluteFill>
  );
};

export default SceneUnSeulPecheur;
