import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  PECHEUR_DEFS,
  PECHEUR_OMBRE_SOL,
  PECHEUR_JAMBE_GAUCHE_HAUT,
  PECHEUR_JAMBE_DROITE_HAUT,
  PECHEUR_JAMBE_GAUCHE_BAS,
  PECHEUR_JAMBE_DROITE_BAS,
  PECHEUR_PIED_GAUCHE,
  PECHEUR_PIED_DROIT,
  PECHEUR_TORSE,
  PECHEUR_TETE,
  PECHEUR_BRAS_GAUCHE_HAUT,
  PECHEUR_BRAS_GAUCHE_BAS,
  PECHEUR_BRAS_DROIT_HAUT,
  PECHEUR_BRAS_DROIT_BAS,
  PECHEUR_CHAPEAU,
} from "./pecheurPersoGroups";

// ---------------------------------------------------------------------------
// PECHEUR RIGGE (13 segments) anime en 3 phases sequentielles :
//   PHASE 1 IDLE   (0-6s   / f 0-180)   : respiration + balancement + bras qui vivent.
//   PHASE 2 SALUT  (6-13s  / f 180-390) : bras droit leve, signe de la main, redescend.
//   PHASE 3 MARCHE (13-20s / f 390-600) : cycle de marche sur place, bras en opposition.
// Frame-driven pur (useCurrentFrame + interpolate + spring + Math.sin). ZERO CSS.
// Le rig s'anime par rotate(angle, px, py) autour du pivot de chaque segment ;
// les membres-bas sont imbriques dans le wrapper du membre-haut (heritage epaule->
// coude, hanche->genou) donc suivent leur parent automatiquement.
// ---------------------------------------------------------------------------

export const PECHEUR_PERSO_FRAMES = 600; // 20s @ 30fps

const W = 1080;
const H = 1080;

// Pivots de rig
const P = {
  epauleG: { x: 455, y: 330 },
  coudeG: { x: 428, y: 460 },
  epauleD: { x: 625, y: 330 },
  coudeD: { x: 656, y: 460 },
  hancheG: { x: 495, y: 575 },
  genouG: { x: 485, y: 755 },
  hancheD: { x: 586, y: 575 },
  genouD: { x: 595, y: 755 },
  cou: { x: 540, y: 285 },
};

// helper : rotation autour d'un pivot
const rot = (deg: number, px: number, py: number) => `rotate(${deg} ${px} ${py})`;

// segment feuille (statique) injecte, avec un transform anime en amont
const Seg: React.FC<{ html: string; transform?: string }> = ({ html, transform }) => (
  <g transform={transform} dangerouslySetInnerHTML={{ __html: html }} />
);

// phase [start,end] -> progression 0..1 clampee
const ph = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const PecheurPersoAnime: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Bornes de phases
  const F_IDLE_END = 180;
  const F_SALUT_START = 180;
  const F_SALUT_END = 390;
  const F_MARCHE_START = 390;

  const inIdle = frame < F_IDLE_END;
  const inSalut = frame >= F_SALUT_START && frame < F_SALUT_END;
  const inMarche = frame >= F_MARCHE_START;

  // ==== PHASE 1 IDLE (respiration + balancement) ====================
  // respiration : montee/descente lente du haut du corps.
  const breath = Math.sin(frame / 22); // periode ~4.6s
  const breathTY = breath * 3.2; // px, subtil
  const breathScaleY = 1 + 0.012 * breath; // torse gonfle un peu
  // balancement global du poids (rotation +-1 deg autour du bassin)
  const swayIdle = Math.sin(frame / 34) * 1.0;
  // bras qui vivent un peu en idle (petite rotation epaule)
  const armIdleG = Math.sin(frame / 28) * 3.5;
  const armIdleD = Math.sin(frame / 28 + 0.6) * 3.5;
  // tete qui respire legerement (suit le breath)
  const headIdle = breath * 1.4;

  // ==== PHASE 2 SALUT ==============================================
  // le bras droit se leve (spring) sur f180-215, tient+salue jusqu'a ~360,
  // puis redescend f360-390.
  const raiseIn = spring({
    frame: Math.max(0, frame - F_SALUT_START),
    fps,
    config: { mass: 1, damping: 14, stiffness: 90 },
    durationInFrames: 35,
  });
  const lowerOut = ph(frame, 360, F_SALUT_END); // 0->1 quand on redescend
  const raise = raiseIn * (1 - lowerOut); // 0..1 bras leve
  // angle epaule droite : au repos ~0, leve = -120deg (le bras monte sur le cote/haut).
  // rotation SVG horaire ; -120 amene le bras droit vers le haut-exterieur.
  const salutEpauleD = raise * -122;
  // signe de la main : va-et-vient de l'avant-bras (coude droit) une fois leve.
  const waveActive = interpolate(frame, [200, 210, 355, 365], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const salutCoudeD = raise * (-18 + Math.sin(frame / 4.5) * 26 * waveActive);
  // le torse/tete accompagnent tres legerement le salut
  const salutLean = raise * -1.2;

  // ==== PHASE 3 MARCHE (cycle sur place) ===========================
  // fondu d'entree pour eviter un saut brutal en debut de marche.
  const marcheMix = ph(frame, F_MARCHE_START, F_MARCHE_START + 20);
  const step = (frame - F_MARCHE_START) / 8.5; // cadence du pas
  const gaitAmp = 20 * marcheMix; // amplitude cuisse (deg)
  // cuisses en opposition
  const thighG = Math.sin(step) * gaitAmp;
  const thighD = Math.sin(step + Math.PI) * gaitAmp;
  // genoux : le mollet se replie surtout quand la cuisse part en arriere.
  // repli = quand sin(step) negatif -> flexion positive (mollet vers l'arriere).
  const kneeG = Math.max(0, -Math.sin(step)) * 34 * marcheMix + 6 * marcheMix;
  const kneeD = Math.max(0, -Math.sin(step + Math.PI)) * 34 * marcheMix + 6 * marcheMix;
  // bras en balancier OPPOSE aux jambes : bras gauche avance (avec jambe droite).
  // amplitude moderee pour un balancier le long du corps sans croiser les avant-bras.
  const armWalkG = Math.sin(step + Math.PI) * 15 * marcheMix; // suit jambe droite
  const armWalkD = Math.sin(step) * 15 * marcheMix; // suit jambe gauche
  // avant-bras : leger flechi qui ne se replie que quand le bras part en avant.
  const forearmWalkG = (4 + Math.max(0, Math.sin(step + Math.PI)) * 8) * marcheMix;
  const forearmWalkD = (4 + Math.max(0, Math.sin(step)) * 8) * marcheMix;
  // rebond vertical du corps entier (2x la frequence du pas)
  const bounceY = -Math.abs(Math.sin(step)) * 9 * marcheMix;

  // ==== COMPOSITION DES TRANSFORMS PAR SEGMENT =====================
  // Corps entier : translate vertical (respiration idle + rebond marche) + sway idle.
  const bodyTY = breathTY + bounceY;
  const bodySway = swayIdle * (inIdle ? 1 : 0) + salutLean;
  // pivot de sway global = bassin approx (540, 575)
  const bodyTransform = `translate(0 ${bodyTY}) ${rot(bodySway, 540, 575)}`;

  // --- JAMBES (hanche->genou imbrique) ---
  const jambeGaucheTransform = rot(thighG, P.hancheG.x, P.hancheG.y);
  const jambeGaucheBasLocal = rot(kneeG, P.genouG.x, P.genouG.y);
  const jambeDroiteTransform = rot(thighD, P.hancheD.x, P.hancheD.y);
  const jambeDroiteBasLocal = rot(kneeD, P.genouD.x, P.genouD.y);

  // --- TORSE : respiration (scaleY autour du bas du torse ~y600) ---
  const torseTransform = `translate(540 600) scale(1 ${breathScaleY}) translate(-540 -600)`;

  // --- TETE + CHAPEAU (rotation autour du cou) ---
  const headAngle = (inIdle ? headIdle : 0) + salutLean * 0.8;
  const headTransform = rot(headAngle, P.cou.x, P.cou.y);

  // --- BRAS GAUCHE (epaule->coude imbrique) ---
  const brasGaucheAngle = armIdleG * (inIdle ? 1 : 0) + armWalkG;
  const brasGaucheTransform = rot(brasGaucheAngle, P.epauleG.x, P.epauleG.y);
  const brasGaucheBasLocal = rot(forearmWalkG, P.coudeG.x, P.coudeG.y);

  // --- BRAS DROIT (epaule->coude imbrique) : idle + salut + marche ---
  const brasDroitAngle = armIdleD * (inIdle ? 1 : 0) + salutEpauleD + armWalkD;
  const brasDroitTransform = rot(brasDroitAngle, P.epauleD.x, P.epauleD.y);
  const brasDroitBasLocal = rot(salutCoudeD + forearmWalkD, P.coudeD.x, P.coudeD.y);

  return (
    <AbsoluteFill style={{ backgroundColor: "#f2e6cf" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: PECHEUR_DEFS }} />

        {/* Ombre au sol : reste fixe (ne suit pas le corps), mais respire un peu. */}
        <Seg html={PECHEUR_OMBRE_SOL} transform={`scale(${1 - bounceY * 0.006} 1)`} />

        {/* Corps entier (hors ombre) : translate vertical + sway global */}
        <g transform={bodyTransform}>
          {/* Z-ORDER : jambes -> pieds -> torse -> tete -> bras -> chapeau */}

          {/* JAMBE GAUCHE (haut wrappe bas + pied) */}
          <g transform={jambeGaucheTransform}>
            <Seg html={PECHEUR_JAMBE_GAUCHE_HAUT} />
            <g transform={jambeGaucheBasLocal}>
              <Seg html={PECHEUR_JAMBE_GAUCHE_BAS} />
              <Seg html={PECHEUR_PIED_GAUCHE} />
            </g>
          </g>

          {/* JAMBE DROITE */}
          <g transform={jambeDroiteTransform}>
            <Seg html={PECHEUR_JAMBE_DROITE_HAUT} />
            <g transform={jambeDroiteBasLocal}>
              <Seg html={PECHEUR_JAMBE_DROITE_BAS} />
              <Seg html={PECHEUR_PIED_DROIT} />
            </g>
          </g>

          {/* TORSE (respiration) */}
          <Seg html={PECHEUR_TORSE} transform={torseTransform} />

          {/* TETE + CHAPEAU (le chapeau suit la tete : meme wrapper cou) */}
          <g transform={headTransform}>
            <Seg html={PECHEUR_TETE} />
            <Seg html={PECHEUR_CHAPEAU} />
          </g>

          {/* BRAS GAUCHE (haut wrappe bas) */}
          <g transform={brasGaucheTransform}>
            <Seg html={PECHEUR_BRAS_GAUCHE_HAUT} />
            <g transform={brasGaucheBasLocal}>
              <Seg html={PECHEUR_BRAS_GAUCHE_BAS} />
            </g>
          </g>

          {/* BRAS DROIT (haut wrappe bas) — celui du salut */}
          <g transform={brasDroitTransform}>
            <Seg html={PECHEUR_BRAS_DROIT_HAUT} />
            <g transform={brasDroitBasLocal}>
              <Seg html={PECHEUR_BRAS_DROIT_BAS} />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
