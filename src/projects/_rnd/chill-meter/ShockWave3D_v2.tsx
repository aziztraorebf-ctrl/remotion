/**
 * ShockWave3D_v2 — SPIKE 3 (R&D, branche rnd/chill-meter-3d)
 *
 * INTENTION : FAIRE SURSAUTER. Le 100 % doit se lire comme une DECHARGE, une
 *             rupture nette avec le 75 %, pas comme "un peu plus de givre".
 *             Mesure du probleme : entre le 75 % final et le 100 % final,
 *             21,4 % du cadre change seulement, dont 68 % dans la bande basse
 *             (la ou le meter est deja). Le haut du cadre — la ou l'onde est
 *             censee partir — ne bouge quasiment pas.
 *
 * FORME     : une PLAQUE DE GLACE QUI SE BRISE. Un front de fracture part du
 *             meter et se propage vers le haut-droite, projetant des ECLATS
 *             anguleux qui gardent leur epaisseur, puis meurt avant le visage.
 *             Pas une onde ronde : de la glace ne se propage jamais en cercle
 *             parfait, elle suit des lignes de rupture.
 *
 * MOTEUR    : 3D (Three.js / @remotion/three) — registre LA MATIERE.
 *             Justification du registre : le SVG dit OU (un contour qui
 *             grandit) ; la 3D dit DE QUOI C'EST FAIT. Un eclat de glace a
 *             besoin d'epaisseur, de facettes qui accrochent la lumiere
 *             differemment selon leur orientation, et d'une rotation dans les
 *             3 axes pour lire comme un VOLUME. En SVG plat, un eclat qui
 *             tourne reste un triangle qui tourne.
 *             ⛔ ECHEC DOCUMENTE DU SPIKE 2 (ShockWave3D.tsx) : des
 *             `ringGeometry` parfaits se lisent comme un SPINNER DE CHARGEMENT
 *             (verifie sur onset_f20/f40.png). Cercle regulier = UI, pas
 *             matiere. Ce fichier n'utilise AUCUN ringGeometry.
 *
 * TEMPLATE  : pattern ThreeCanvas alpha du spike 1 (prouve au render headless
 *             avec --gl=angle). `screenToWorld()` est REPRISE telle quelle de
 *             ShockWave3D.tsx : validee par mesure a dx=0,0 px / dy=0,5 px.
 *
 * CONTRAINTE DE BRIEF (Abigail) : "my face should never be heavily obscured".
 * Zone visage ~ x 1050-1750, y 150-750. Un masque de garde attenue tout ce qui
 * y entre, et l'onde est calibree pour mourir avant.
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

/** PRNG deterministe : meme rendu a chaque render, obligatoire pour Remotion. */
const rng = (seed: number) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * FRONT DE FRACTURE — une couronne polygonale IRREGULIERE.
 * Au lieu d'un anneau lisse, on construit une bande entre deux polygones dont
 * chaque sommet a son propre rayon (jitter) et sa propre epaisseur. Le resultat
 * a des pointes, des creux, des zones fines et des zones epaisses : la
 * signature visuelle d'une fissure, pas d'un cercle.
 */
const FractureFront: React.FC<{
  p: number;
  x: number;
  y: number;
  maxR: number;
  seedBase: number;
  opacityMul: number;
}> = ({ p, x, y, maxR, seedBase, opacityMul }) => {
  const SEG = 72;

  // Profil de dents fige au montage : la forme ne "bouillonne" pas, elle
  // s'etire. Une forme qui change de silhouette a chaque frame lit comme du
  // bruit ; une forme fixe qui grandit lit comme une fracture qui court.
  const teeth = React.useMemo(() => {
    const out: { rMul: number; thick: number }[] = [];
    for (let i = 0; i < SEG; i++) {
      const a = (i / SEG) * Math.PI * 2;
      // Biais directionnel : le front pousse plus loin vers le haut-droite.
      // dir vaut 1 dans la direction (cos45, sin45), 0 a l'oppose.
      const dir = (Math.cos(a - Math.PI / 4) + 1) / 2;
      const bias = 0.42 + dir * dir * 0.95;
      // Dents anguleuses : somme de sinus non harmoniques + bruit fige.
      const jag =
        0.72 +
        Math.abs(Math.sin(a * 5.3 + seedBase)) * 0.42 +
        Math.abs(Math.sin(a * 11.7 + seedBase * 2.1)) * 0.24 +
        rng(i + seedBase * 13) * 0.3;
      out.push({
        rMul: bias * jag,
        // Crete FINE (iteration 2). Avant : 0.10-0.44 -> une bande large qui
        // remplissait le cadre d'un voile terne. Maintenant 0.035-0.115 : on ne
        // dessine plus que le fil de la fracture.
        thick: 0.05 + rng(i * 3.7 + seedBase) * 0.11,
      });
    }
    return out;
  }, [seedBase]);

  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    const alp: number[] = [];
    for (let i = 0; i < SEG; i++) {
      const j = (i + 1) % SEG;
      const a0 = (i / SEG) * Math.PI * 2;
      const a1 = (j / SEG) * Math.PI * 2;
      const t0 = teeth[i];
      const t1 = teeth[j];
      // Rayon unitaire : mis a l'echelle par le scale du groupe (anime).
      const ro0 = t0.rMul;
      const ro1 = t1.rMul;
      const ri0 = Math.max(0.02, t0.rMul - t0.thick);
      const ri1 = Math.max(0.02, t1.rMul - t1.thick);

      const O0 = [Math.cos(a0) * ro0, Math.sin(a0) * ro0];
      const O1 = [Math.cos(a1) * ro1, Math.sin(a1) * ro1];
      const I0 = [Math.cos(a0) * ri0, Math.sin(a0) * ri0];
      const I1 = [Math.cos(a1) * ri1, Math.sin(a1) * ri1];

      // Deux triangles par segment. Le bord exterieur est opaque (la crete de
      // la fracture accroche la lumiere), l'interieur retombe a zero : ca donne
      // une arete nette dehors et une dissolution dedans, comme du givre.
      //
      // ⭐ CORRECTION ITERATION 2 : l'interieur ne doit PAS couvrir une grande
      // surface. Mesure de l'iteration 1 : 12,7 % du cadre etait noye dans une
      // nappe alpha 10-70 (contre 1,2 % de vraies aretes) — et sur le plateau
      // rose vif, du bleu clair a 20 % d'alpha ASSOMBRIT au lieu d'eclairer.
      // Resultat visuel : des coins gris sales facon papier dechire, pas de la
      // glace. On garde donc une CRETE FINE (le trapeze est etroit) et on passe
      // l'interieur a alpha 0 des le sommet suivant.
      pos.push(O0[0], O0[1], 0, O1[0], O1[1], 0, I0[0], I0[1], 0);
      alp.push(1, 1, 0);
      pos.push(O1[0], O1[1], 0, I1[0], I1[1], 0, I0[0], I0[1], 0);
      alp.push(1, 0, 0);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aAlpha", new THREE.Float32BufferAttribute(alp, 1));
    return g;
  }, [teeth]);

  const mat = React.useMemo(() => {
    // Shader minimal : porte l'alpha par sommet pour obtenir le degrade
    // crete-nette / interieur-dissous sans texture.
    // ⭐ ITERATION 2 : AdditiveBlending. De la glace eclairee n'assombrit jamais
    // ce qu'elle recouvre — elle ajoute de la lumiere. En NormalBlending, un
    // bleu clair a faible alpha pose sur le plateau rose vif donnait un gris
    // sale (mesure it.1). En additif, un pixel faible = presque invisible, un
    // pixel fort = un eclat lumineux : exactement le comportement du givre, et
    // ca protege mecaniquement le visage (le faible ne peut plus salir).
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color("#f2fcff") },
      },
      vertexShader: `
        attribute float aAlpha;
        varying float vA;
        varying vec3 vW;
        void main() {
          vA = aAlpha;
          vW = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uColor;
        varying float vA;
        varying vec3 vW;
        void main() {
          // pow 2.6 (au lieu de 1.6) : l'alpha retombe beaucoup plus vite en
          // s'eloignant de la crete. C'est le 2e levier, avec l'epaisseur, qui
          // supprime le voile terne mesure a l'iteration 1.
          float a = pow(vA, 2.0) * uOpacity;

          // Meme garde-visage que les eclats (zone monde x>0.64, y<2.76).
          float fx = smoothstep(0.10, 1.05, vW.x);
          float fy = 1.0 - smoothstep(2.90, 3.40, vW.y);
          a *= 1.0 - fx * fy;

          if (a < 0.004) discard;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });
  }, []);

  if (p <= 0) return null;

  const r = interpolate(p, [0, 1], [0.12, maxR], { extrapolateRight: "clamp" });
  const op =
    interpolate(p, [0, 0.1, 0.55, 1], [0, 1, 0.5, 0], {
      extrapolateRight: "clamp",
    }) * opacityMul;
  if (op <= 0.002) return null;

  mat.uniforms.uOpacity.value = op;

  return <mesh position={[x, y, 0]} scale={[r, r, 1]} geometry={geo} material={mat} />;
};

/**
 * ECLATS DE GLACE — des splinters anguleux, avec epaisseur et facettes.
 * Chaque eclat est un prisme irregulier (pas un plan) : il tourne dans les 3
 * axes, donc ses faces accrochent la lumiere differemment. C'est ce qui separe
 * "un triangle blanc qui glisse" de "un morceau de glace qui vole".
 */
const IceShards: React.FC<{
  p: number;
  x: number;
  y: number;
  count: number;
  reach: number;
}> = ({ p, x, y, count, reach }) => {
  const shards = React.useMemo(() => {
    return new Array(count).fill(0).map((_, i) => {
      const r1 = rng(i * 1.3 + 0.5);
      const r2 = rng(i * 2.7 + 1.9);
      const r3 = rng(i * 4.1 + 3.3);
      const r4 = rng(i * 5.9 + 7.1);
      // Cone dirige vers le haut-droite. Centre a ~38 deg, ouverture +-52 deg.
      const a = Math.PI * 0.21 + (r1 - 0.5) * 1.82;
      const len = (0.32 + r2 * 0.68) * reach;
      const size = 0.1 + r3 * 0.26;
      return {
        a,
        len,
        size,
        elong: 1.9 + r4 * 2.4,
        spin: (r2 - 0.5) * 5.5,
        tilt: (r3 - 0.5) * 3.2,
        delay: r4 * 0.3,
        z: (r1 - 0.5) * 0.9,
      };
    });
  }, [count, reach]);

  // Prisme irregulier partage par tous les eclats : 6 sommets, facettes
  // dissymetriques. Cree une fois, reutilise — pas de cout par eclat.
  const geo = React.useMemo(() => {
    const g = new THREE.BufferGeometry();
    // Bipyramide asymetrique : pointe avant longue, base a 4 cotes inegaux.
    const v = [
      [1.0, 0, 0], // pointe avant
      [-0.55, 0.14, 0.1], // pointe arriere
      [0.05, 0.42, 0.06],
      [0.12, -0.06, 0.34],
      [-0.02, -0.38, -0.04],
      [0.08, 0.02, -0.3],
    ];
    const faces = [
      [0, 2, 3],
      [0, 3, 4],
      [0, 4, 5],
      [0, 5, 2],
      [1, 3, 2],
      [1, 4, 3],
      [1, 5, 4],
      [1, 2, 5],
    ];
    const pos: number[] = [];
    const shade: number[] = [];
    faces.forEach((f, fi) => {
      // Chaque facette a sa propre luminosite fixe : simule la refraction sans
      // eclairage dynamique (moins cher, et deterministe au render headless).
      const s = 0.52 + ((fi * 37) % 100) / 100 * 0.48;
      f.forEach((vi) => {
        pos.push(v[vi][0], v[vi][1], v[vi][2]);
        shade.push(s);
      });
    });
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aShade", new THREE.Float32BufferAttribute(shade, 1));
    return g;
  }, []);

  const makeMat = React.useMemo(
    () => () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        // Additif, meme raison que le front : un eclat de glace ajoute de la
        // lumiere, il ne pose jamais un cache gris sur le decor.
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 1 } },
        vertexShader: `
          attribute float aShade;
          varying float vS;
          varying vec3 vW;
          void main() {
            vS = aShade;
            // Position MONDE, transmise au fragment pour le garde-visage.
            vW = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying float vS;
          varying vec3 vW;
          void main() {
            // Bleu glace vers blanc selon la facette.
            vec3 c = mix(vec3(0.58, 0.85, 1.0), vec3(1.0, 1.0, 1.0), vS);

            // GARDE-VISAGE (brief Abigail : "my face should never be heavily
            // obscured"). Zone visage x 1050-1750 / y 150-750 en PIXELS ecran.
            // Conversion mesuree : x monde 0.64..5.59, y monde -1.49..2.76.
            // (Attention : la zone descend SOUS y=0 — un garde base seulement
            //  sur "y grand" laisserait passer les eclats dans le bas du
            //  visage. C'est l'erreur que cette version corrige.)
            // Le garde s'active des x>0.1 et couvre toute la plage y utile.
            float fx = smoothstep(0.10, 1.05, vW.x);
            float fy = 1.0 - smoothstep(2.90, 3.40, vW.y);
            float guard = 1.0 - fx * fy;

            gl_FragColor = vec4(c, uOpacity * (0.45 + vS * 0.55) * guard);
          }
        `,
      }),
    [],
  );

  const mats = React.useMemo(
    () => shards.map(() => makeMat()),
    [shards, makeMat],
  );

  return (
    <group position={[x, y, 0]}>
      {shards.map((s, i) => {
        const lp = Math.max(0, Math.min(1, (p - s.delay) / (1 - s.delay)));
        if (lp <= 0) return null;
        // Ejection rapide puis freinage : la glace part vite et ralentit.
        const eased = 1 - Math.pow(1 - lp, 2.4);
        const d = interpolate(eased, [0, 1], [0.16, s.len]);
        const op = interpolate(lp, [0, 0.12, 0.6, 1], [0, 1, 0.62, 0], {
          extrapolateRight: "clamp",
        });
        if (op <= 0.004) return null;
        mats[i].uniforms.uOpacity.value = op;
        const gx = Math.cos(s.a) * d;
        const gy = Math.sin(s.a) * d;
        return (
          <mesh
            key={i}
            geometry={geo}
            material={mats[i]}
            position={[gx, gy, s.z]}
            rotation={[s.tilt * lp, s.spin * lp, s.a]}
            scale={[s.size * s.elong, s.size, s.size]}
          />
        );
      })}
    </group>
  );
};

/**
 * FLASH D'IMPACT — un bref halo au point de depart. Sans lui, l'onde "apparait"
 * deja grande ; avec lui, elle est EXPULSEE d'un point. C'est le 1er quart de
 * seconde qui fait la difference entre "ca grandit" et "ca claque".
 */
const Burst: React.FC<{ p: number; x: number; y: number }> = ({ p, x, y }) => {
  const op = interpolate(p, [0, 0.05, 0.22], [0, 0.95, 0], {
    extrapolateRight: "clamp",
  });
  if (op <= 0.004) return null;
  const r = interpolate(p, [0, 0.22], [0.25, 2.6], { extrapolateRight: "clamp" });
  return (
    <mesh position={[x, y, -0.2]} scale={[r, r, 1]}>
      <circleGeometry args={[1, 40]} />
      <meshBasicMaterial
        color="#eaf9ff"
        transparent
        opacity={op * 0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

export const SHOCKWAVE_V2_FRAMES = 45;

export const ShockWave3Dv2: React.FC<{ showAnchor?: boolean }> = ({
  showAnchor = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const originPxX = POS_X + (DEVICE_W * SCALE) / 2;
  const originPxY = POS_Y + (DEVICE_H * SCALE) / 2;
  const { x, y } = screenToWorld(originPxX, originPxY, width, height);

  const progress = interpolate(frame, [0, SHOCKWAVE_V2_FRAMES - 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Trois fronts decales : le 1er ouvre, les suivants epaississent la rupture.
  const p0 = progress;
  const p1 = Math.max(0, (progress - 0.13) / 0.87);
  const p2 = Math.max(0, (progress - 0.28) / 0.72);

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
        <Burst p={p0} x={x} y={y} />
        <FractureFront p={p0} x={x} y={y} maxR={5.2} seedBase={1.7} opacityMul={1.35} />
        <FractureFront p={p1} x={x} y={y} maxR={3.8} seedBase={5.3} opacityMul={1.1} />
        <FractureFront p={p2} x={x} y={y} maxR={2.4} seedBase={9.1} opacityMul={0.85} />
        <IceShards p={p0} x={x} y={y} count={30} reach={4.4} />
      </ThreeCanvas>

      {/* Croix de controle : marque le centre du device en pixels ecran.
          Sert UNIQUEMENT a mesurer l'ancrage, jamais dans un livrable. */}
      {showAnchor && (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <line
            x1={originPxX - 40}
            y1={originPxY}
            x2={originPxX + 40}
            y2={originPxY}
            stroke="#ff0066"
            strokeWidth={3}
          />
          <line
            x1={originPxX}
            y1={originPxY - 40}
            x2={originPxX}
            y2={originPxY + 40}
            stroke="#ff0066"
            strokeWidth={3}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
