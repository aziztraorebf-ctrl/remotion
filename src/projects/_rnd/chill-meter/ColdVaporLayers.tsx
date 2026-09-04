/**
 * ColdVaporLayers — VAPEUR FROIDE MULTI-COUCHES (R&D, branche rnd/chill-meter-3d)
 *
 * INTENTION : FAIRE SENTIR LE FROID COMME UNE MATIERE VIVANTE qui monte du bas
 *             du cadre. Etat 75 % uniquement ("Cold mist rises from the bottom
 *             only", "The rest of the screen should remain clear").
 *
 * FORME     : une masse de brume UNIE (jamais trouee, jamais coupee) qui plafonne
 *             a ~16 % de la hauteur du cadre, alimentee en continu par le bas,
 *             et dont les volutes se forment et se defont en permanence.
 *
 * MOTEUR    : 3D (Three.js / @remotion/three) — registre LA MATIERE.
 *             Le moteur reste la 3D GPU, mais la TECHNIQUE change du tout au
 *             tout par rapport a ColdVapor3D.tsx (voir ci-dessous). Un degrade
 *             CSS ne peut produire ni volute, ni occlusion entre couches, ni
 *             deformation continue du champ : c'est ce qui impose le shader.
 *
 * TEMPLATE  : pattern ThreeCanvas alpha prouve au render headless (--gl=angle)
 *             sur ShockWave3D.tsx. `screenToWorld()` reprise telle quelle.
 *
 * ------------------------------------------------------------------------
 * POURQUOI UN NOUVEAU FICHIER PLUTOT QU'UN N-IEME DOSAGE DE ColdVapor3D.tsx
 * ------------------------------------------------------------------------
 * ColdVapor3D raymarche UN SEUL champ fbm dans une dalle. Trois defauts
 * mesures en decoulaient, et ils etaient STRUCTURELS, pas affaire de reglage :
 *
 *   1. TROUS (19,4 % de pixels vides). Le seuil `smoothstep` sur la densite
 *      PERCE le champ de part en part. Baisser le seuil bouchait les trous
 *      mais tuait le mouvement (6,08 % -> 0,54 % mesure) : densite et
 *      lisibilite du mouvement tiraient sur LA MEME CORDE, parce qu'un seul
 *      champ portait les deux.
 *   2. TACHES STATIQUES (0,5 % de pixels changeant entre 2 frames). Le champ
 *      etait seulement ADVECTE (translate). Or la mesure de la reference dit
 *      l'inverse : sur 10 frames, la translation n'explique que 11 % du
 *      changement — 89 % est de la DEFORMATION du champ lui-meme.
 *   3. AUCUNE PARALLAXE. Un raymarch mono-champ integre la densite : c'est un
 *      operateur de LISSAGE. Les volutes de devant ne peuvent pas masquer
 *      celles de derriere, il n'y a pas de "devant" et de "derriere".
 *
 * TECHNIQUE RETENUE : 4 COUCHES 2D INDEPENDANTES COMPOSITEES "OVER".
 *   Chaque couche a sa propre echelle, sa propre vitesse verticale, sa propre
 *   derive laterale, son propre plafond, et sa propre COORDONNEE DE VIE (z).
 *   Elles sont composees de l'avant vers l'arriere avec une transmittance :
 *   une couche de devant OCCULTE reellement celle de derriere.
 *
 *   Ce que ca resout, mecanisme par mecanisme :
 *   - Les trous disparaissent parce que la couverture est une SOMME de 4
 *     couches decorrelees : la ou l'une est creuse, une autre est pleine.
 *     Aucun seuil ne perce plus la masse. (mesure sim : 0,0 % de vide)
 *   - Le mouvement redevient lisible parce qu'il ne depend plus du seuil mais
 *     de la coordonnee z qui AVANCE dans le temps : le champ se deforme au
 *     lieu de glisser. Densite et mouvement sont enfin DECOUPLES.
 *   - La parallaxe existe parce que les 4 couches avancent a des vitesses
 *     differentes (0,072 a 0,214 v/s) ET s'occultent mutuellement.
 *
 * ------------------------------------------------------------------------
 * CALIBRE SUR MESURE DE LA REFERENCE PROFESSIONNELLE (aziz-smoke.mp4)
 * ------------------------------------------------------------------------
 *   - saturation = 0.000 sur 10 frames mesurees, sans exception. GRIS PUR.
 *     C'est la cause n.1 du "je ne ressens pas le givre" : notre vapeur etait
 *     a 0,211 de saturation, donc lue comme "bleue et pale". Le froid extreme
 *     est BLANC ; c'est la lumiere ambiante qui le teinte, jamais la matiere.
 *   - luminance moyenne de la fumee : 138 a 163 selon la frame.
 *   - vitesse verticale mesuree par correlation : 168 px/s = 15,6 % de la
 *     hauteur du cadre par seconde.
 *   - la translation n'explique que 11 % du changement image a image ; le
 *     reste est deformation. D'ou le terme d'evolution temporelle (evo).
 *   - mouvement de reference : 37 % des pixels changent de +-25 sur 20 frames.
 *
 * ⛔ Ce fichier ne touche AUCUN fichier du livrable contractuel
 *    (ChillMeterOverlay, ChillMeterDevice, GivrePlanche, ShockWave3D*).
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

const CAM_Z = 10.5;
const CAM_FOV = 40;

/**
 * Convertit un point ecran (px, origine haut-gauche) en coordonnees monde
 * Three.js sur le plan z=0. REPRISE TELLE QUELLE de ShockWave3D.tsx
 * (validee par mesure : dx=0,0 / dy=0,5 px).
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

export const VAPOR_LAYERS_FRAMES = 150;

/* ------------------------------------------------------------------ */
/* SHADERS                                                             */
/* ------------------------------------------------------------------ */

const VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * uv.x = 0..1 sur la largeur du cadre, uv.y = 0 en BAS.
 * Le quad couvre exactement la bande utile, donc uv est directement la
 * coordonnee normalisee dont on a besoin. Aucune conversion cachee.
 */
const FRAG = `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;       // secondes, derive de useCurrentFrame (deterministe)
  uniform float uAmount;     // montee en puissance 0..1
  uniform float uBandFrac;   // hauteur du quad en fraction de cadre
  uniform float uHardTop;    // plafond DUR contractuel, en fraction de cadre
  uniform float uSigma;      // extinction (densite -> alpha)
  uniform vec3  uColor;

  // --- bruit de valeur 3D, hash flottant : strictement deterministe.
  //     Aucun Math.random(), aucune texture, aucun Date.now().
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

  // fbm 5 octaves. La 3e coordonnee n'est PAS une profondeur spatiale : c'est
  // la coordonnee de VIE du champ. La faire avancer dans le temps deforme les
  // volutes sur place — c'est ce que la mesure de la reference exige (89 % du
  // changement image a image est de la deformation, pas de la translation).
  // ⭐ ITERATION 3 : 4 octaves au lieu de 5, et gain 0.40 au lieu de 0.50.
  // Defaut MESURE sur it2 : longueur de correlation horizontale = 0 px contre
  // 61 px dans la reference. Autrement dit notre "fumee" n'avait AUCUNE
  // structure coherente — c'etait du GRAIN, d'ou une lecture en "voile flou"
  // et non en volutes. Cause : la 5e octave descend a 15-30 px de periode et
  // domine le gradient. En retirant l'octave la plus fine et en affaiblissant
  // le gain, les grosses volutes (250-870 px) portent enfin le motif.
  float fbm(vec3 p) {
    float a = 0.58;
    float s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p = p * 2.03 + vec3(11.3, 7.7, 3.1);
      a *= 0.40;
    }
    return s;
  }

  /**
   * Densite d'UNE couche au point (u,v).
   *   sc   : echelle du motif (petit = gros nuages mous, grand = filaments)
   *   vy   : vitesse d'ascension, en fraction de cadre par seconde
   *   vx   : derive laterale
   *   z0   : decalage de graine (decorrele les couches entre elles)
   *   evo  : vitesse de deformation du champ
   *   hz   : plafond propre a la couche, en fraction de cadre
   *   k    : densite maximale de la couche
   */
  float layerDensity(
    vec2 uv, float sc, float vy, float vx, float z0,
    float evo, float hz, float k
  ) {
    float t = uTime;
    // coordonnee de vie : avance en continu, jamais remise a zero.
    float zz = z0 + t * evo;

    // ---- DOMAIN WARP : deux fbm decales tordent la grille. C'est ce qui
    // produit les ENROULEMENTS (volutes en champignon) plutot qu'un motif
    // qui glisse. Sans lui, une couche advectee se lit comme un calque plat.
    vec2 warpCoord = vec2(uv.x * sc * 0.5, (uv.y - vy * t) * sc * 0.5);
    float wx = fbm(vec3(warpCoord + vec2(3.1, 7.7), zz * 0.7 + 13.0)) - 0.5;
    float wy = fbm(vec3(warpCoord + vec2(9.4, 1.2), zz * 0.7 + 29.0)) - 0.5;

    vec2 p = vec2(
      uv.x * sc + vx * t * sc + wx * 0.9,
      (uv.y - vy * t) * sc + wy * 0.9
    );

    float f = fbm(vec3(p, zz));

    // Remise a l'echelle DOUCE (pas de seuil dur) : c'est la difference avec
    // l'ancienne implementation. Un smoothstep agressif percait la masse ;
    // ici la matiere decroit continument, comme dans la reference mesuree
    // (67 % de la fumee vit dans les valeurs basses, en decroissance continue).
    // Le nouveau fbm (4 octaves, gain 0.40) a une moyenne et une amplitude
    // differentes : la plage est recalee en consequence.
    float d = clamp((f - 0.30) / 0.42, 0.0, 1.0);

    // ---- ALIMENTATION PAR LE BAS + CRETE DENTELEE.
    // ⭐⭐ ITERATION 4 — LE DEFAUT STRUCTUREL QUI RESTAIT.
    // Defaut VU sur it3_onset_f60 : malgre une bonne densite et un bon
    // mouvement, la vapeur se lisait encore comme une VITRE EMBUEE — bord
    // superieur quasi horizontal, aucune volute qui depasse, aucun panache.
    // Cause : jusqu'ici l'enveloppe valait (1 - uv.y/hz), une fonction de la
    // SEULE hauteur. Une telle enveloppe est HORIZONTALEMENT UNIFORME PAR
    // CONSTRUCTION : elle ne peut produire qu'un bord droit, exactement le
    // defaut du degrade CSS qu'on cherchait a quitter. Ce n'etait donc pas un
    // probleme de dosage, mais de forme de la fonction.
    // Correction : le PLAFOND LUI-MEME devient une fonction de x et du temps.
    // Le breakdown le decrit precisement : "crete dentelee, pics et vallees de
    // 8-15 % de hauteur, qui se deplacent lateralement en se reformant".
    // ⭐ ITERATION 5 : la crete etait trop molle. Mesure it4 : la hauteur
    // atteinte ne variait que de 1,1 a 2,1 points d'une colonne a l'autre, la
    // silhouette restait donc quasi droite. Le breakdown demande des pics et
    // vallees de 8-15 % de la hauteur du cadre. Deux corrections :
    //   - frequence spatiale relevee (x2.4) : sans elle une seule bosse
    //     couvrait toute la largeur, ce qui ne se lit pas comme une dentelure ;
    //   - amplitude portee a 1.9, et la crete devient BIPOLAIRE (elle creuse
    //     autant qu'elle souleve), ce qui cree de vraies vallees.
    // ⭐ ITERATION 6 — REVENU EN ARRIERE APRES AVOIR REGARDE.
    // L'iteration 5 avait porte l'amplitude de la crete a 1.90 avec une
    // frequence x2.4, dans l'idee de "plus de dentelure". VU sur
    // it5_onset_f60 : la masse s'amincissait sur la droite et perdait son
    // unite — la crete ne dentelait plus le sommet, elle CREUSAIT le corps.
    // Mesure concordante : 26,5 % et 33,3 % de vide a f20/f40, contre 19,8 %
    // et 31,5 % en it4. Une crete plus forte n'est donc pas une crete
    // meilleure : au-dela d'un point elle mange la masse que le breakdown
    // demande justement de garder UNIE.
    // On garde la frequence double (elle, elle apporte de la dentelure reelle)
    // mais on revient a une amplitude moderee.
    float crest = fbm(vec3(uv.x * sc * 1.50 + 5.7, zz * 0.45, 71.0))
                + 0.40 * fbm(vec3(uv.x * sc * 3.10 + 19.4, zz * 0.62, 133.0));
    crest = (crest / 1.40) - 0.5;
    float hzLocal = hz * (1.0 + crest * 0.95);

    float env = pow(clamp(1.0 - (uv.y / max(hzLocal, 0.02)), 0.0, 1.0), 0.55);

    // ---- PANACHES : des colonnes montantes localisees, qui percent au-dessus
    // de la nappe et retombent. C'est le "ce n'est pas un mur qui monte :
    // plusieurs panaches independants, vitesses differentes" du breakdown.
    // Sans eux la masse n'a pas de silhouette, seulement une limite.
    float plume = fbm(vec3(uv.x * sc * 0.34 + 17.3, (uv.y - vy * t * 1.6) * 1.1, zz * 0.55 + 43.0));
    env *= 0.62 + 0.68 * smoothstep(0.22, 0.72, plume);

    return d * env * k;
  }

  void main() {
    // uv.y est en fraction du QUAD ; on le ramene en fraction de CADRE.
    vec2 uv = vec2(vUv.x, vUv.y * uBandFrac);

    // ---- 4 PANACHES INDEPENDANTS, composites de l'AVANT vers l'ARRIERE.
    // Vitesses toutes differentes (le breakdown : "le droit file, le centre
    // est plus lent, la gauche billow ; un seul calque qui translate vers le
    // haut ferait cheap"). La couche 4 (la plus rapide et la plus fine) est
    // devant : elle OCCULTE les autres, d'ou une vraie parallaxe interne.
    float trans = 1.0;   // transmittance restante
    float lumAcc = 0.0;  // lumiere accumulee
    float cov = 0.0;     // couverture (alpha)

    // --- couche 4 : filaments fins, rapides, devant
    {
      float d = layerDensity(uv, 7.6, 0.214, -0.042, 61.0, 3.40, 0.1008, 0.60);
      float a = 1.0 - exp(-d * uSigma);
      float lit = 0.55 + 0.45 * clamp(d * 1.4, 0.0, 1.0);
      lumAcc += trans * a * lit; cov += trans * a; trans *= (1.0 - a);
    }
    // --- couche 3
    {
      float d = layerDensity(uv, 5.0, 0.156, 0.030, 41.0, 2.48, 0.1188, 0.70);
      float a = 1.0 - exp(-d * uSigma);
      float lit = 0.55 + 0.45 * clamp(d * 1.4, 0.0, 1.0);
      lumAcc += trans * a * lit; cov += trans * a; trans *= (1.0 - a);
    }
    // --- couche 2
    {
      float d = layerDensity(uv, 3.4, 0.1105, -0.020, 21.0, 1.80, 0.1395, 0.78);
      float a = 1.0 - exp(-d * uSigma);
      float lit = 0.55 + 0.45 * clamp(d * 1.4, 0.0, 1.0);
      lumAcc += trans * a * lit; cov += trans * a; trans *= (1.0 - a);
    }
    // --- couche 1 : gros nuages mous, lents, au fond
    {
      float d = layerDensity(uv, 2.2, 0.0715, 0.012, 1.0, 1.19, 0.1620, 0.86);
      float a = 1.0 - exp(-d * uSigma);
      float lit = 0.55 + 0.45 * clamp(d * 1.4, 0.0, 1.0);
      lumAcc += trans * a * lit; cov += trans * a; trans *= (1.0 - a);
    }

    // ---- ALPHA : plafonne SOUS l'opacite totale.
    // ⭐ ITERATION 2. Defaut VU sur it1_onset_f60 : la vapeur se lisait comme
    // une BARRE BLANCHE PLATE, pas comme de la brume. Mesure : 25,3 % de la
    // bande a alpha > 240 (opacite pleine) et 100 % de la luminance au-dessus
    // de 170, contre 56 % entre 110 et 170 dans la reference. Autrement dit
    // notre vapeur n'avait AUCUN demi-ton : elle etait cramee.
    // Une vapeur totalement opaque cesse d'etre de la vapeur, elle devient un
    // cache. On borne donc la couverture, et le plateau doit rester lisible
    // par transparence.
    float alpha = clamp(cov, 0.0, 1.0) * uAmount * 0.88;

    // ---- PLAFOND DUR CONTRACTUEL. "The screen effect should appear on the
    // bottom edge only" / "The rest of the screen should remain clear".
    alpha *= 1.0 - smoothstep(uHardTop - 0.045, uHardTop, uv.y);

    if (alpha < 0.004) discard;

    // ---- GRADIENT D'OPACITE / COULEUR (4e mecanisme du breakdown).
    // lumAcc est la lumiere reellement accumulee le long de la pile : les
    // coeurs de volutes sont clairs, les bords restent gris.
    // ⭐ ITERATION 2 : la rampe partait de 0.62, donc la luminance ne pouvait
    // PHYSIQUEMENT pas descendre sous 158 — d'ou l'absence totale de demi-tons
    // mesuree. On ouvre la rampe vers le bas (0.20) pour couvrir la meme plage
    // que la reference (110-200), et on normalise lumAcc par la couverture :
    // sans ca, un pixel peu couvert mais tres eclaire ressortait aussi clair
    // qu'un coeur dense, ce qui ecrase le relief.
    // ⭐ ITERATION 3 : rampe recalee. it2 mesurait une luminance effective
    // moyenne de 85 dans la bande contre 199 pour la reference : la vapeur
    // etait globalement trop sombre/tenue une fois composee. On releve le
    // plancher et on adoucit l'exposant, en gardant un vrai ecart coeur/bord
    // (c'est lui qui donne le volume et l'auto-ombrage).
    float lumN = clamp(lumAcc / max(cov, 0.001), 0.0, 1.0);
    vec3 col = uColor * (0.55 + 0.45 * pow(lumN, 0.85));

    gl_FragColor = vec4(col, alpha);
  }
`;

/* ------------------------------------------------------------------ */
/* SCENE                                                               */
/* ------------------------------------------------------------------ */

// Hauteur de la bande utile, en fraction de cadre. Le quad ne couvre que ca :
// aucun pixel ne peut apparaitre en haut du cadre, par construction.
const BAND_FRAC = 0.26;
// Plafond DUR : ~17 % du cadre. La cliente a juge 21,5 % "beaucoup trop haut".
const HARD_TOP = 0.17;

const VaporMesh: React.FC<{
  time: number;
  amount: number;
  width: number;
  height: number;
}> = ({ time, amount, width, height }) => {
  const uniforms = React.useMemo(
    () => ({
      uTime: { value: 0 },
      uAmount: { value: 1 },
      uBandFrac: { value: BAND_FRAC },
      uHardTop: { value: HARD_TOP },
      uSigma: { value: 3.0 },
      // GRIS QUASI PUR. Mesure de la reference professionnelle : saturation
      // 0.000 sur 10 frames. Notre ancienne vapeur etait a 0,211 -> lue comme
      // "bleue, pale, pas givree". On garde une teinte froide infinitesimale
      // (saturation theorique 0,016) pour ne pas etre gris mort sur un plateau
      // rose, sans jamais approcher le bleu.
      uColor: { value: new THREE.Color(0.992, 0.996, 1.0) },
    }),
    [],
  );

  const mat = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        // AdditiveBlending : une nappe claire en NormalBlending ROSE et
        // assombrit ce plateau (echec deja mesure sur ce projet). De la vapeur
        // froide eclairee AJOUTE de la lumiere.
        blending: THREE.AdditiveBlending,
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
      }),
    [uniforms],
  );

  uniforms.uTime.value = time;
  uniforms.uAmount.value = amount;

  const { visibleW, visibleH } = screenToWorld(0, 0, width, height);
  const bandH = visibleH * BAND_FRAC;
  const floorY = -visibleH / 2;

  return (
    <mesh position={[0, floorY + bandH / 2, 0]} material={mat}>
      <planeGeometry args={[visibleW * 1.02, bandH, 1, 1]} />
    </mesh>
  );
};

export const ColdVaporLayers: React.FC<{ showGuides?: boolean }> = ({
  showGuides = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // ⭐ Le temps ne demarre PAS a zero : a t=0 toutes les couches sont alignees
  // sur la meme phase de leur reseau de bruit, ce qui produit une premiere
  // frame atypique. On demarre le champ deja etabli — la brume "est deja la",
  // exactement comme dans la reference (fumee presente des la frame 1).
  const time = 7.3 + frame / fps;

  // Montee en puissance douce, pilotee par la frame. Deterministe.
  const amount = interpolate(frame, [0, 18, VAPOR_LAYERS_FRAMES - 1], [0, 1, 1], {
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
        <VaporMesh
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
          <line x1={0} y1={height * (1 - HARD_TOP)} x2={width} y2={height * (1 - HARD_TOP)} stroke="#ffcc00" strokeWidth={2} />
        </svg>
      )}
    </AbsoluteFill>
  );
};
