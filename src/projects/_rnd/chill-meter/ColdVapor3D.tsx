/**
 * ColdVapor3D — VAPEUR FROIDE VOLUMETRIQUE (R&D, branche rnd/chill-meter-3d)
 *
 * INTENTION : FAIRE SENTIR LE FROID COMME UNE MATIERE. Au 75 % l'air glace
 *             STAGNE au sol ; au 100 % il S'ECHAPPE du compteur et COURT vers
 *             la droite. La rupture entre les deux etats doit se lire comme un
 *             CHANGEMENT DE COMPORTEMENT, jamais comme "plus de brume".
 *
 * FORME     : une nappe de brouillard sec (CO2) au ras du sol.
 *             - 75 % : nappe dense montant du bas, limite haute nette a ~18 %
 *               de la hauteur du cadre, qui ondule sur place sans progresser.
 *             - 100 % : un souffle qui sort du flanc droit du device, tombe et
 *               court au ras du sol vers la droite en se dissipant. Le froid
 *               est plus lourd que l'air : il ne monte jamais.
 *
 * MOTEUR    : 3D (Three.js / @remotion/three) — registre LA MATIERE.
 *             ⭐ Justification mesuree du registre : la brume actuelle est un
 *             `linear-gradient` CSS + `blur(3px)` (ChillMeterOverlay.tsx,
 *             BottomEdgeEffect). Un degrade est LISSE PAR CONSTRUCTION : sa
 *             densite est une fonction d'UNE variable (la hauteur). Il ne peut
 *             produire ni volute, ni poche dense a cote d'une trouee, ni
 *             parallaxe. Ici la densite est le resultat d'une INTEGRALE le long
 *             d'un rayon traversant un champ de bruit 3D : elle varie en x, en
 *             y ET en profondeur. C'est ce que le degrade ne sait pas faire.
 *
 * TEMPLATE  : pattern ThreeCanvas alpha prouve au render headless (--gl=angle)
 *             sur ShockWave3D.tsx / ShockWave3D_v2.tsx. `screenToWorld()` est
 *             REPRISE telle quelle de ShockWave3D.tsx (validee dx=0,0/dy=0,5px).
 *
 * TECHNIQUE RETENUE : RAYMARCHING VOLUMETRIQUE dans une dalle bornee.
 *   Un seul quad couvre la zone utile. Pour chaque pixel, le fragment shader
 *   marche 24 pas dans une dalle d'epaisseur finie, echantillonne un fbm 3D
 *   (5 octaves de bruit de valeur) advecte dans le temps, et accumule la
 *   transmittance (Beer-Lambert). Le resultat : des volutes qui se recouvrent
 *   avec de vraies variations de densite, et une parallaxe reelle entre les
 *   couches proches et lointaines quand le champ derive.
 *   Cout : 1 draw call, 24 taps * 5 octaves. Tenable au render headless.
 *
 * ⛔ ECHECS DEJA PAYES SUR CE PROJET, evites ici :
 *   - `ringGeometry` parfait = spinner de chargement. Aucune primitive
 *     geometrique reguliere ici, uniquement du champ scalaire.
 *   - Une nappe bleu clair en NormalBlending sur ce plateau ROSE l'assombrit.
 *     => AdditiveBlending : de la vapeur froide eclairee AJOUTE de la lumiere.
 *   - Le garde-visage doit etre calcule en coordonnees MONDE REELLES.
 *     Mesure ici (CAM_Z=10.5, FOV=40, 1920x1080) :
 *       cadre       : x -6.794..+6.794   y -3.822..+3.822
 *       fenetre clip: x -6.518..-0.927   y -1.147..+2.555   (px 39..829/179..702)
 *       visage      : x +0.566..+4.345   y -1.550..+2.732   (px 1040..1574/154..759)
 *       device      : x -5.520..-1.692   y -4.046..-1.175   (px 180..721/706..1112)
 *     Les deux zones interdites ont pour BORD BAS y=-1.147 (clip) et y=-1.550
 *     (visage). La vapeur est donc plafonnee SOUS y=-1.75 par un masque dur,
 *     en plus du plafond doux propre a chaque etat.
 *
 * Ce fichier ne touche AUCUN fichier du livrable contractuel.
 */

import { ThreeCanvas } from "@remotion/three";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { DEVICE_W, DEVICE_H } from "./ChillMeterDevice";

// Placement du device — valeurs miroir de ChillMeterOverlay.tsx (jalon 1 valide).
const POS_X = 180;
const POS_Y = 706;
const SCALE = 0.373595;

const CAM_Z = 10.5;
const CAM_FOV = 40;

/**
 * Convertit un point ecran (px, origine haut-gauche) en coordonnees monde
 * Three.js sur le plan z=0, pour une camera perspective centree.
 * REPRISE TELLE QUELLE du spike 2 — validee par mesure (dx=0,0 / dy=0,5 px).
 */
export const screenToWorld = (
  px: number,
  py: number,
  width: number,
  height: number,
) => {
  const visibleH = 2 * CAM_Z * Math.tan((CAM_FOV * Math.PI) / 180 / 2);
  const visibleW = visibleH * (width / height);
  return {
    x: (px / width - 0.5) * visibleW,
    y: -(py / height - 0.5) * visibleH,
    visibleW,
    visibleH,
  };
};

export type VaporState = "stagne" | "souffle";

export const COLD_VAPOR_FRAMES = 150;

/* ------------------------------------------------------------------ */
/* SHADERS                                                             */
/* ------------------------------------------------------------------ */

const VERT = `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Le coeur : un raymarch dans une dalle d'epaisseur uSlab centree sur z=0.
 * Le champ est un fbm 3D advecte. Deux comportements pilotes par uMode :
 *   0 = STAGNE  : advection quasi nulle, respiration verticale sur place.
 *   1 = SOUFFLE : advection horizontale forte + etalement conique depuis la
 *                 source, et chute gravitaire (le froid tombe).
 */
const FRAG = `
  precision highp float;

  varying vec2 vUv;
  varying vec3 vWorld;

  uniform float uTime;      // secondes, derive de useCurrentFrame (deterministe)
  uniform float uMode;      // 0 = stagne, 1 = souffle
  uniform float uAmount;    // intensite globale 0..1
  uniform float uTopY;      // plafond doux de la nappe (monde)
  uniform float uHardTopY;  // plafond DUR contractuel (monde)
  uniform float uFloorY;    // bas du cadre (monde)
  uniform vec2  uSrc;       // source du souffle (monde)
  uniform float uReach;     // portee horizontale du souffle (unites monde)
  uniform vec3  uColor;
  uniform float uSlab;      // demi-epaisseur de la dalle traversee
  uniform float uSigma;     // coefficient d'extinction (calibre par simulation)

  // --- bruit de valeur 3D, hash entier : strictement deterministe, aucun
  //     Math.random(), aucune texture. Meme sortie a chaque render.
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.71, 0.113, 0.419));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z);
  }

  // fbm 5 octaves : c'est lui qui donne les volutes. Un degrade n'a pas
  // d'octaves — il n'a qu'une pente.
  float fbm(vec3 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 5; i++) {
      s += a * vnoise(p);
      p = p * 2.03 + vec3(11.3, 7.7, 3.1);
      a *= 0.5;
    }
    return s;
  }

  /**
   * Densite du milieu au point monde p.
   * C'est ici que vit LE COMPORTEMENT — la seule chose qui separe les 2 etats.
   */
  float density(vec3 p) {
    // ---- enveloppe verticale.
    // STAGNE : nappe bornee en haut (limite nette a ~18 % du cadre).
    // SOUFFLE : plus de plafond bas — l'onde monte, c'est la demande explicite
    // (« expands upward »). Son extinction vient de son propre front.
    float top = uTopY;
    float env = (uMode < 0.5)
      ? 1.0 - smoothstep(top - 0.62, top + 0.14, p.y)
      : 1.0;
    // le bas est dense mais pas uniforme : il se creuse un peu vers le sol
    if (uMode < 0.5) env *= smoothstep(uFloorY - 0.55, uFloorY + 0.85, p.y) * 0.35 + 0.65;

    // ---- enveloppe horizontale + advection, selon le comportement
    vec3 q = p;
    float envX = 1.0;

    if (uMode < 0.5) {
      // ===================== STAGNE =====================
      // Le champ ne se deplace quasiment pas : il RESPIRE. On advecte
      // verticalement d'une fraction d'unite, et on ondule tres lentement.
      // ⭐ CORRECTIF (Aziz, 2026-09-04) : « stagne » avait ete pris au pied de
      // la lettre -> nappe FIGEE qui scintille sur place (mesure : 0,5 % de
      // pixels changent entre 2 frames espacees de 20). De la vraie brume qui
      // stagne BOUILLONNE : elle roule sur elle-meme, forme et defait des
      // volutes en permanence. Ce qui la distingue du souffle n'est pas
      // l'absence de mouvement, c'est l'absence de DIRECTION : elle tourne sur
      // place au lieu de partir. On advecte donc franchement, mais en boucle
      // fermee (rotation lente + oscillation), pas en translation nette.
      float sw = uTime * 0.55;
      q.x += sin(p.y * 0.55 + uTime * 0.62) * 0.42 + cos(p.z * 0.7 + sw) * 0.30;
      q.y -= uTime * 0.34 + sin(p.x * 0.42 + uTime * 0.48) * 0.22;
      q.z += cos(p.x * 0.5 + uTime * 0.52) * 0.36 + uTime * 0.16;
      // ⭐ ITERATION 5 : defaut VU sur it5_75_onset_f100 — la nappe se
      // concentrait sur la MOITIE DROITE et disparaissait sous le device, a
      // gauche. La cible C-brume75 montre au contraire une nappe qui court sur
      // toute la largeur, plus dense pres du compteur. La cause n'etait pas le
      // dosage mais l'absence de PLANCHER : la ou le fbm est localement creux,
      // il n'y avait plus rien du tout. On ajoute donc une composante de fond
      // (la nappe existe partout) sur laquelle le bruit sculpte les volutes.
      // ⭐ PLANCHER RELEVE (retour Aziz 2026-09-04) : 19,4 % de pixels VIDES
      // dans la bande basse -> la nappe se lisait « coupee », avec des trous,
      // au lieu d'une masse unie. Le bruit doit CREUSER une masse continue,
      // jamais la percer de part en part.
      envX = mix(1.14, 1.44, smoothstep(2.5, -6.2, p.x));
    } else {
      // ===================== SOUFFLE (JAILLISSEMENT) ====================
      // ⭐ CORRECTION DE BRIEF (recue en cours de chantier) : la contrainte
      // "ne pas toucher la fenetre video" ne concernait QUE le placement de
      // l'objet metallique, jamais les effets. Le PDF de la cliente demande au
      // contraire, au 100 % :
      //   « The meter acts as the source of the effect. »
      //   « A frozen shock wave bursts from the meter. »
      //   « The shock wave expands upward and toward the right side. »
      //   « The shock wave fades before fully reaching my face. »
      //   « Wind gusts, snow [...] appear across the frame. »
      // Le souffle RASANT que j'avais code (froid qui tombe et court au sol)
      // repondait a une contrainte erronee. Il est remplace ici par un
      // EVENTAIL qui jaillit du compteur vers le HAUT-DROITE et meurt avant le
      // visage — la forme de la cible A-couronne, dont le seul defaut reel
      // etait d'etre trop massive, pas d'etre mal orientee.
      vec2 d2 = p.xy - uSrc;
      float rad = length(d2);
      float ang = atan(d2.y, d2.x);          // 0 = droite, +PI/2 = haut

      // Front d'onde : il part du compteur et s'etend. C'est l'ENVELOPPE qui
      // voyage (lecon de l'iteration 2 : un bruit qui defile derriere une
      // enveloppe fixe ne se lit pas comme un deplacement).
      // ⭐ ITERATION 7 : defaut VU sur it7_100_onset_f70 — la couronne s'etait
      // DETACHEE du compteur : a f70 elle flottait au-dessus de l'epaule et du
      // haut du cadre, et plus rien ne reliait l'effet a l'objet. Or le brief
      // est explicite : « The meter acts as the source of the effect. »
      // Cause : le bord INTERNE de la couronne avancait avec le front, donc la
      // base se vidait. Correction : le bord interne reste ANCRE pres de la
      // source (il ne recule que tres peu), seul le bord EXTERNE avance. Le
      // jaillissement reste donc attache a l'objet du debut a la fin.
      float front = uReach * clamp(uTime * 1.35, 0.0, 1.0);
      float inner = 0.02;
      float shell = 1.0 - smoothstep(front - 1.30, front + 0.25, rad);
      // ⭐ ITERATION 8 : bord interne colle a la source (0.02 au lieu de
      // 0.30->0.85). Defaut VU sur it8_100_onset_f40/f145 : un trou de ~100 px
      // separait le compteur de la base de la vapeur, donc l'objet ne se
      // lisait pas comme la SOURCE — c'est pourtant le point structurel du
      // brief (« The meter acts as the source of the effect »).
      shell *= smoothstep(inner, inner + 0.42, rad);
      // la densite retombe avec la distance : le jet est nourri a la base
      shell *= mix(1.0, 0.46, smoothstep(1.2, uReach, rad));

      // Eventail oriente HAUT-DROITE : centre a +50 deg, ouvert de ~±62 deg.
      // Axe a +42 deg (haut-droite), ouverture ±55 deg. Plus resserre qu'en
      // it.7 : un eventail large se lit comme un halo diffus, pas comme un jet.
      float axis = 0.73;
      float da = abs(ang - axis);
      float fan = 1.0 - smoothstep(0.55, 1.30, da);

      // Extinction AVANT le visage : le bord gauche du visage est a x=+0.566
      // (mesure monde). L'onde perd sa densite entre x=-0.30 et x=+1.35, donc
      // elle est deja tres faible quand elle atteint la zone, et nulle au
      // milieu — « fades before fully reaching my face ».
      float faceFade = 1.0 - smoothstep(-0.30, 1.35, p.x);

      // Modulation en dents : de la glace ne se propage pas en cercle lisse.
      float teeth = 0.74 + 0.26 * sin(ang * 15.0 + uTime * 1.4);

      envX = shell * fan * teeth * mix(0.30, 1.0, faceFade);

      // Le bruit derive vers l'exterieur : il texture le jaillissement.
      q.x -= uTime * 0.95;
      q.y -= uTime * 0.55;
      q.z += uTime * 0.10;
    }


    // ⭐ ITERATION 3 : echantillonnage ANISOTROPE (z 3.4x plus haute frequence
    // que x/y). Diagnostic it.2 : 20 % du cadre a alpha > 200, une dalle bleue
    // opaque a bord franc — pire qu'un degrade. Cause : le rayon marche presque
    // parallelement a z dans un champ dont la variation en z etait aussi lente
    // qu'en x/y. Les 24 pas voyaient donc quasiment LA MEME densite : l'integrale
    // n'avait aucune dynamique, elle saturait des que le pixel etait "dans" la
    // nappe. En montant la frequence en z, chaque rayon traverse reellement des
    // poches pleines et des vides -> l'integrale redevient discriminante, et
    // c'est ELLE qui dessine les volutes.
    float f = fbm(vec3(q.xy * 0.62, q.z * 1.10));
    // Plancher : en mode STAGNE la nappe est un MILIEU CONTINU que le bruit
    // creuse ; en mode SOUFFLE elle n'existe que dans le jet, donc pas de
    // plancher (sinon le souffle devient une nappe et perd son comportement).
    if (uMode < 0.5) f = mix(f, 0.66, 0.20);
    // seuil : en dessous, du vide franc. C'est ce qui cree des TROUEES, donc
    // une limite haute dechiquetee au lieu d'une ligne de degrade.
    // ⭐ SEUIL ABAISSE (2026-09-04) : c'est CE seuil qui percait la nappe, pas
    // l'enveloppe — a 0.48, tout le bruit sous ce niveau tombait a zero, d'ou
    // 19 a 29 % de pixels VIDES et une nappe « coupee ». La reference pro
    // mesuree montre l'inverse : 67 % de la fumee vit dans les valeurs BASSES,
    // en decroissance continue. Une vraie fumee est majoritairement TENUE,
    // rarement absente. On descend donc le pied du seuil et on elargit la
    // rampe : les voiles fins existent au lieu d'etre coupes.
    float d = smoothstep(0.34, 0.88, f);
    return d * env * envX;
  }

  void main() {
    // Rayon : camera en +Z regardant -Z. On approxime la direction par la
    // position monde du fragment (dalle mince -> l'erreur est invisible et
    // divise le cout par 2).
    vec3 ro = vec3(vWorld.xy, uSlab);
    vec3 rd = normalize(vec3(vWorld.xy * 0.055, -1.0));

    const int STEPS = 24;
    float stepLen = (2.0 * uSlab) / float(STEPS);

    float trans = 1.0;   // transmittance
    float acc = 0.0;     // lumiere accumulee

    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * (stepLen * (float(i) + 0.5));
      float d = density(p);
      if (d > 0.001) {
        // Beer-Lambert. ⭐ ITERATION 2 : le coefficient d'extinction passe de
        // 1.35 a 9.0. Mesure it.1 : alpha MAX 120/255 sur tout le rendu, avec
        // 7,4 % du cadre coince dans la bande 10-70 — exactement la signature
        // du "voile sale" deja paye sur ce projet. Cause : sigma = d*1.35*0.133
        // ~ 0.18 au mieux, donc exp(-sigma) restait proche de 1 : la vapeur ne
        // pouvait PHYSIQUEMENT pas devenir dense, quel que soit le bruit.
        // Une vapeur qui n'atteint jamais l'opacite n'est pas de la matiere,
        // c'est un filtre.
        // Extinction calibree pour un tau TOTAL de l'ordre de 1 a 3 sur les
        // 24 pas (et non 28 comme en it.2) : c'est la plage ou exp(-tau) varie
        // encore, donc la seule ou la vapeur a des demi-teintes.
        float sigma = d * uSigma * stepLen;
        // eclairage bon marche : la vapeur est plus lumineuse en surface haute
        float lit = 0.62 + 0.38 * smoothstep(uFloorY, uTopY, p.y);
        acc += trans * sigma * lit;
        trans *= exp(-sigma);
        if (trans < 0.05) break;
      }
    }

    // Alpha = 1 - transmittance : la couverture reelle du milieu, bornee a 1
    // par construction. C'est la grandeur physique, pas un facteur arbitraire.
    float a = (1.0 - trans) * uAmount;

    // --- GARDE LISIBILITE DU COMPTEUR (ajout it.3, defaut VU sur it2_75) :
    // la nappe recouvrait entierement le device, dont l'ecran LCD est le sujet
    // du livrable. La vapeur passe DEVANT le bas du device et DERRIERE sa
    // partie haute : on creuse la densite sur la boite (monde x -5.52..-1.69,
    // y au-dessus de -3.00), en laissant les bords se refermer.
    float mx = smoothstep(-5.90, -5.35, vWorld.x) * (1.0 - smoothstep(-1.90, -1.35, vWorld.x));
    float my = smoothstep(-3.10, -2.70, vWorld.y);
    if (uMode < 0.5) a *= 1.0 - 0.86 * mx * my;

    // --- GARDE selon l'etat.
    // 75 % : « The screen effect should appear on the bottom edge only » +
    //        « The rest of the screen should remain clear » -> plafond DUR.
    // 100 % : l'onde traverse librement le cadre (demande explicite). Seul
    //        subsiste le garde VISAGE, et ce n'est pas une interdiction de
    //        presence : « a small amount of snow/particles may pass over my
    //        face », seul « heavily obscured » est proscrit. On plafonne donc
    //        l'alpha dans la zone visage au lieu de l'annuler.
    if (uMode < 0.5) {
      a *= 1.0 - smoothstep(uHardTopY - 0.30, uHardTopY, vWorld.y);
    } else {
      float inFaceX = smoothstep(0.40, 0.95, vWorld.x)
                    * (1.0 - smoothstep(4.20, 4.60, vWorld.x));
      float inFaceY = smoothstep(-1.75, -1.35, vWorld.y)
                    * (1.0 - smoothstep(2.60, 2.95, vWorld.y));
      a *= 1.0 - 0.88 * inFaceX * inFaceY;
    }

    // --- Nettoyage du voile : tout ce qui est faible est ECRASE a zero.
    // C'est la contre-mesure directe a l'echec "nappe basse-opacite = voile
    // sale" : on interdit structurellement la plage d'alpha 1..~25.
    // ⭐ ITERATION 2 : courbe durcie (0.06->0.42 puis pow 1.25). Le but n'est
    // pas d'assombrir la vapeur mais de VIDER la plage d'alpha 10-70 : soit un
    // pixel appartient a une volute (il monte franchement), soit il n'existe
    // pas. C'est ce qui separe une nappe de matiere d'un voile gris.
    // Courbe de sortie : elle vide la plage 10-70 (le "voile sale") SANS
    // pousser le reste a l'opacite. Plafond a 0.86 : de la vapeur totalement
    // opaque cesse d'etre de la vapeur, elle devient un cache.
    a = pow(smoothstep(0.10, 0.62, a), 1.15) * 0.86;
    if (a < 0.010) discard;

    // ⭐ ITERATION 4 : la COULEUR varie, pas seulement l'alpha.
    // Defaut VU sur it.4 : RGB strictement constant (#9FDAFE) sur tout le
    // rendu — mesure sur 3 zones, ecart 0. Une nappe monochrome dont seul
    // l'alpha bouge partage le defaut du degrade : elle n'a pas de MATIERE,
    // juste une couverture. Une vraie vapeur a des coeurs qui diffusent plus
    // de lumiere (presque blancs) et des bords qui virent au bleu froid.
    // acc est la lumiere reellement accumulee le long du rayon : on s'en
    // sert comme luminance, ce qu'un degrade CSS ne peut pas produire.
    float lum = clamp(acc * 0.85, 0.0, 1.0);
    vec3 col = mix(uColor * 0.86, vec3(1.0), pow(lum, 0.75) * 0.72);

    gl_FragColor = vec4(col, a);
  }
`;

/* ------------------------------------------------------------------ */
/* SCENE                                                               */
/* ------------------------------------------------------------------ */

const VaporSlab: React.FC<{
  state: VaporState;
  time: number;
  amount: number;
  width: number;
  height: number;
}> = ({ state, time, amount, width, height }) => {
  // Bouche du souffle : le flanc DROIT du device, a mi-hauteur de sa partie
  // visible. Calcule en pixels puis converti — jamais suppose.
  const mouthPxX = POS_X + DEVICE_W * SCALE * 0.96;
  const mouthPxY = POS_Y + DEVICE_H * SCALE * 0.42;
  const mouth = screenToWorld(mouthPxX, mouthPxY, width, height);

  const floorY = screenToWorld(0, height, width, height).y; // -3.822
  // Plafond doux : ~18 % de la hauteur du cadre pour l'etat qui stagne.
  // ⭐ ABAISSE (retour Aziz 2026-09-04) : mesure a 21,5 % du cadre, lu comme
  // « beaucoup trop haute » face a « The screen effect should appear on the
  // bottom edge only ». 0.87 -> plafond a ~14 % du cadre.
  const topStagne = screenToWorld(0, height * 0.87, width, height).y;
  // Le souffle reste encore plus bas : il court au ras du sol.
  const topSouffle = screenToWorld(0, height * 0.845, width, height).y;

  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uMode: { value: 0 },
      uAmount: { value: 1 },
      uTopY: { value: -2.446 },
      uHardTopY: { value: -1.75 },
      uFloorY: { value: -3.822 },
      uSrc: { value: new THREE.Vector2(0, 0) },
      uReach: { value: 5.0 },
      // ⭐ CALIBRE SUR REFERENCE PROFESSIONNELLE (2026-09-04) : une fumee de
      // stock mesuree a une saturation de 0.000 (gris pur). La notre etait a
      // 0.211 -> lue comme « bleue, pas givree » (retour Aziz). Le froid
      // extreme est BLANC ; c'est la lumiere ambiante qui le teinte, pas la
      // matiere. On garde juste ce qu'il faut de bleu pour ne pas etre gris.
      uColor: { value: new THREE.Color("#eef7fc") },
      uSlab: { value: 1.6 },
      uSigma: { value: 3.4 },
    }),
    [],
  );

  const mat = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        // AdditiveBlending : de la vapeur froide eclairee AJOUTE de la lumiere.
        // En NormalBlending elle noircissait le plateau rose (echec mesure).
        blending: THREE.AdditiveBlending,
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
      }),
    [uniforms],
  );

  uniforms.uTime.value = time;
  uniforms.uMode.value = state === "souffle" ? 1 : 0;
  uniforms.uAmount.value = amount;
  uniforms.uTopY.value = state === "souffle" ? topSouffle : topStagne;
  uniforms.uFloorY.value = floorY;
  uniforms.uSrc.value.set(mouth.x, mouth.y);
  // Portee bornee par la MESURE : la zone visage commence a x=+0.566 monde.
  // Bouche a x~-1.85 -> une portee de 4.6 amene le front a x~+2.75, mais la
  // chute gravitaire l'a deja fait descendre a y~-3.4, soit 195 px SOUS le bas
  // du visage (y=-1.550). Le croisement en x est sans effet, le garde est en y.
uniforms.uReach.value = state === "souffle" ? 6.6 : 4.6;
  // ⭐ ITERATION 3 : uSigma calibre par SIMULATION du shader hors render
  // (scratchpad/sim.py, meme hash/vnoise/fbm en NumPy) et non par essais de
  // dosage au render. Cible visee : vider la bande 10-70 (le voile sale) tout
  // en gardant des coeurs denses. zf=1.10 / k=5.0 / seuil 0.48-0.92 donne
  // 3,0 % en 10-70 contre 8,4 % en 71-200 et 6,3 % au-dessus de 200.
  // Le souffle porte une enveloppe (cone x bouffees x dissipation) qui divise
  // deja la densite : il lui faut une extinction plus forte pour atteindre la
  // meme matiere que la nappe qui stagne.
  uniforms.uSigma.value = state === "souffle" ? 15.0 : 5.0;

  const { visibleW, visibleH } = screenToWorld(0, 0, width, height);
  // Le quad ne couvre que la bande utile en mode STAGNE (moins de fragments a
  // marcher, et impossible qu'un pixel apparaisse en haut du cadre). En mode
  // SOUFFLE l'onde traverse le cadre : le quad est plein cadre.
  const bandTop = -1.35;
  const bandH = state === "souffle" ? visibleH * 1.02 : bandTop - (floorY - 0.4);
  const bandCy = state === "souffle" ? 0 : (bandTop + (floorY - 0.4)) / 2;

  return (
    <mesh position={[0, bandCy, 0]} material={mat}>
      <planeGeometry args={[visibleW * 1.02, bandH, 1, 1]} />
    </mesh>
  );
};

export const ColdVapor3D: React.FC<{
  state?: VaporState;
  showGuides?: boolean;
}> = ({ state = "stagne", showGuides = false }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const time = frame / fps;

  // Montee en puissance puis regime etabli. Deterministe, pilote par la frame.
  const amount =
    state === "souffle"
      ? interpolate(frame, [0, 8, 20, COLD_VAPOR_FRAMES - 1], [0, 1, 1, 1], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [0, 24, COLD_VAPOR_FRAMES - 1], [0, 0.9, 0.9], {
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic={false}
        camera={{ fov: CAM_FOV, position: [0, 0, CAM_Z] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1} />
        <VaporSlab
          state={state}
          time={time}
          amount={amount}
          width={width}
          height={height}
        />
      </ThreeCanvas>

      {/* Reperes de controle : zones contractuelles interdites. Jamais livre. */}
      {showGuides && (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <rect x={39} y={179} width={790} height={523} fill="none" stroke="#ff0066" strokeWidth={3} />
          <rect x={1040} y={154} width={534} height={605} fill="none" stroke="#00ff88" strokeWidth={3} />
          <line x1={0} y1={height * 0.82} x2={width} y2={height * 0.82} stroke="#ffcc00" strokeWidth={2} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
