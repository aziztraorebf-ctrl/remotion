/**
 * DeviceInScene — l'appareil POSE DANS UN DECOR, pas flottant dans le vide.
 *
 * C'est l'ecart n°1 releve sur la reference "Foster With Confidence" (2026-08-25) :
 * son telephone est sur un vrai bureau (tapis de decoupe, plante, cafe, regle),
 * avec une ombre portee et une lumiere qui vient de quelque part. Notre showreel
 * avait un objet techniquement reussi mais visuellement froid, parce qu'il
 * flottait dans le noir.
 *
 * ⛔⛔ CONDITION ZERO — L'ECHELLE SE CALCULE, ELLE NE SE DOSE PAS.
 *   Defaut mesure le 2026-08-26 : la tasse du decor paraissait 2,2x plus grosse
 *   que le laptop, et le telephone 2,1x trop grand. Cause : `scale` et distance
 *   camera choisis AU JUGE. Le decor etait coherent, c'est l'objet 3D qui etait
 *   mal dimensionne.
 *   METHODE : reperer dans la photo un objet dont on connait la taille reelle
 *   (regle Staedtler 30 cm -> 738 px mesures) => echelle du decor (24,6 px/cm).
 *   L'appareil doit alors occuper sa taille REELLE : iPhone 14,7 cm -> 362 px,
 *   laptop 14" 31,2 cm de large -> 768 px. Le `scale` s'en deduit, il ne se choisit pas.
 *
 * LES 3 CONDITIONS POUR QUE L'ILLUSION TIENNE (aucune n'est optionnelle) :
 *  1. MEME DIRECTION DE LUMIERE — les decors sont generes avec une key light en
 *     haut a droite, donc le rig 3D garde exactement cette direction et l'ombre
 *     portee tombe en bas-a-gauche, comme celles des objets reels de la photo.
 *  2. UNE OMBRE PORTEE — un objet sans ombre est un collage. Elle est dessinee
 *     en DOM sous le canvas (ellipse floutee), pas en shadow map : moins cher,
 *     et surtout reglable au pixel sous l'objet.
 *  3. LE MEME ANGLE DE VUE — un decor shoote a 90 deg (flat lay) ne peut recevoir
 *     qu'un objet vu de dessus ; un decor en trois-quarts demande un objet incline.
 *     Melanger les deux casse immediatement la scene.
 *
 * ⛔ La texture d'ecran est chargee HORS du <ThreeCanvas> (cf FICHE-UI-PRODUIT :
 *    les effets React d'un enfant du canvas ne sont jamais flushes avant capture).
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { LaptopModel } from "./LaptopModel";
import { PhoneModel } from "./PhoneModel";

const DECORS = {
  designerTop: "_shared/refs/decors-mockup/desk-designer-top.png",
  execTop: "_shared/refs/decors-mockup/desk-exec-top.png",
  darkAngle: "_shared/refs/decors-mockup/desk-dark-34.png",
  darkWide: "_shared/refs/decors-mockup/desk-dark-wide.png",
  lightAngle: "_shared/refs/decors-mockup/desk-light-34.png",
  studio: "_shared/refs/decors-mockup/studio-neutral.png",
} as const;

/**
 * ECHELLE DES DECORS — mesuree sur le rendu 1920x1080, pas devinee.
 * Repere : la regle Staedtler 30 cm du decor "designer" = 738 px => 24,6 px/cm.
 * Les autres decors sont calibres sur un objet connu equivalent (tasse ~9,5 cm,
 * sous-main A3 42 cm, carnet A5 21 cm).
 */
const DECOR_PX_PER_CM = {
  /** Regle Staedtler 30 cm mesuree a 738 px sur le rendu 1920x1080. */
  designerTop: 24.6,
  /** Sous-main cuir ~A3 (42 cm de large). */
  execTop: 21.0,
  /**
   * ⚠️ CE DECOR EST UN GROS PLAN : la tasse (~9,5 cm) occupe la moitie de la
   * hauteur du cadre. L'echelle y est donc tres grande — un laptop de 31 cm
   * remplirait presque toute l'image et masquerait le decor.
   * -> reserve au TELEPHONE ou a un plan tres serre sur le laptop.
   */
  darkAngle: 40.0,
  /**
   * Version CADREE LARGE du meme registre, generee pour le laptop.
   * Tasse (~9,5 cm) = 179 px dans le fichier 1376x768 ; en cover sur 1920x1080
   * (x1,406) => 26,5 px/cm. Un laptop de 31,2 cm y fait 827 px, soit 43 % du
   * cadre : il tient sans masquer le decor.
   */
  darkWide: 26.5,
  /** Tasse ~9,5 cm, carnet A5. Cadrage plus large, adapte au laptop. */
  lightAngle: 23.0,
  studio: 22.0,
} as const;

/** Tailles reelles des appareils (cm). */
const PHONE_H_CM = 14.7;   // iPhone 15 Pro : 146,6 mm
const LAPTOP_W_CM = 31.2;  // 14 pouces : 312 mm de large

/**
 * Le modele 3D fait 3.2 unites de haut (telephone) / 3.2 de large (laptop) a
 * scale=1. A une distance camera donnee, on mesure combien de pixels cela fait,
 * puis on en deduit le scale qui donne la taille REELLE.
 * fov 40 deg, hauteur de rendu H : taille_px = (unites / (2*z*tan(fov/2))) * H
 */
const unitsToPx = (units: number, camZ: number, renderH: number) =>
  (units / (2 * camZ * Math.tan((40 * Math.PI) / 360))) * renderH;

/** Scale a appliquer pour que `modelUnits` occupent `targetCm` a l'ecran. */
const scaleForRealSize = (
  modelUnits: number,
  targetCm: number,
  pxPerCm: number,
  camZ: number,
  renderH: number
) => (targetCm * pxPerCm) / unitsToPx(modelUnits, camZ, renderH);

/**
 * SFX — banque Shotcraft (Apache-2.0), deja dans public/.
 * ⛔ PAS DE WHOOSH sur une UI : c'est un vocabulaire de mouvement d'AIR, sans
 * rapport avec un logiciel (retire le 2026-08-20 apres retour d'Aziz — sur
 * 5 coupes il devenait le son le plus present du film).
 * Volume : SFX a 0,50, comme la doctrine du pipeline.
 */
const SFX = {
  /** Allumage de la scene — court et sec (0,59 s). */
  lightUp: "_client-sim/noteshield/sfx/hit-weak.mp3",
  /** Pose de l'objet / ouverture du capot (1,10 s). */
  place: "_client-sim/noteshield/sfx/click.mp3",
  /** Micro-etat (apparition d'un element) — 0,20 s. */
  tick: "_client-sim/noteshield/sfx/tone.mp3",
} as const;
const SFX_VOL = 0.5;

const PLATE_MOBILE = "_client-sim/noteshield/live-mobile/dashboard-mobile.png";
const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";

const useTex = (src: string, texAspect: number, screenAspect: number) => {
  const [handle] = useState(() => delayRender(`plate ${src}`));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useLayoutEffect(() => {
    new THREE.TextureLoader().load(
      staticFile(src),
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        if (texAspect > screenAspect) {
          const r = screenAspect / texAspect;
          t.repeat.set(r, 1);
          t.offset.set((1 - r) / 2, 0);
        } else {
          const r = texAspect / screenAspect;
          t.repeat.set(1, r);
          t.offset.set(0, (1 - r) / 2);
        }
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
  }, [src, texAspect, screenAspect, handle]);
  return tex;
};

/**
 * Rig cale sur la lumiere des decors : key en HAUT A DROITE. Si un decor est
 * eclaire autrement, c'est ce rig qu'il faut tourner, pas l'ombre.
 */
const SceneLights: React.FC<{ warm?: boolean }> = ({ warm = false }) => (
  <>
    <ambientLight color={warm ? "#fff2e0" : "#ffffff"} intensity={warm ? 1.1 : 0.75} />
    <directionalLight
      position={[3.2, 6.5, 2.5]}
      color={warm ? "#fff4e2" : "#ffffff"}
      intensity={warm ? 4.6 : 4.0}
    />
    <directionalLight position={[-4.5, 1.5, 3]} color="#ffffff" intensity={1.1} />
    <directionalLight position={[3.5, 1, -4]} color="#ffffff" intensity={1.3} />
  </>
);

/**
 * Ombre en TROIS couches — une ellipse floue unique ne suffit pas : mesure
 * comparative du 2026-08-26, la reference a un creux de luminosite PROGRESSIF
 * (122 niveaux) la ou le notre sautait brutalement (7 -> 203 -> 50 en quelques px).
 *
 *  1. AMBIENT  — halo large et pale tout autour de la base (occlusion ambiante).
 *                C'est CE detail qui fait lire "pose" plutot que "superpose".
 *  2. CAST     — ombre projetee, DECALEE du cote oppose a la lumiere
 *                (key en haut-droite => ombre vers le bas-gauche).
 *  3. CONTACT  — tres sombre, tres serree, tres peu floutee, juste sous l'objet :
 *                la zone ou plus aucune lumiere ne passe.
 */
const GroundShadow: React.FC<{
  cx: string;
  cy: string;
  w: number;
  h: number;
  opacity: number;
}> = ({ cx, cy, w, h, opacity }) => {
  const layer = (
    dx: number,
    dy: number,
    sw: number,
    sh: number,
    op: number,
    blur: number
  ): React.CSSProperties => ({
    position: "absolute",
    left: cx,
    top: cy,
    width: w * sw,
    height: h * sh,
    transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
    borderRadius: "50%",
    background: "#000",
    opacity: op * opacity,
    filter: `blur(${blur}px)`,
    pointerEvents: "none",
  });
  return (
    <>
      {/* 1. occlusion ambiante — large, tres pale */}
      <div style={layer(-6, 10, 1.75, 1.7, 0.30, 60)} />
      {/* 2. ombre projetee — decalee bas-gauche (lumiere en haut-droite) */}
      <div style={layer(-26, 22, 1.12, 1.15, 0.55, 26)} />
      {/* 3. contact — serree, sombre, a peine floutee */}
      <div style={layer(-3, 5, 0.9, 0.88, 0.75, 7)} />
    </>
  );
};

/**
 * PLAN 1 — TELEPHONE POSE SUR LE BUREAU (vue du dessus).
 * Le decor s'ALLUME en 0.3 s (mesure sur la reference : luma 5 -> 96 entre
 * 0.90 s et 1.20 s, cale sur un pic sonore). Ce n'est pas un fondu lent :
 * c'est une lumiere qu'on allume sur la scene.
 */
export const PhoneOnDesk: React.FC<{ decor?: keyof typeof DECORS }> = ({
  decor = "designerTop",
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);

  // Allumage du decor : 9f -> 18f (0.30 s a 30 fps), comme la reference.
  const lit = interpolate(frame, [9, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Le zoom demarre une fois la scene revelee.
  const p = interpolate(frame, [24, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.25, 1),
  });

  const camZ = interpolate(p, [0, 1], [8.4, 4.3]);

  /**
   * ⛔ Le scale est CALCULE : le modele fait 3.2 unites de haut et doit occuper
   * 14,7 cm a l'echelle du decor. Choisir 1.0 au juge donnait un telephone
   * 2,1x trop grand (755 px mesures contre 362 px attendus).
   */
  const phoneScale = scaleForRealSize(
    3.2,
    PHONE_H_CM,
    DECOR_PX_PER_CM[decor],
    camZ,
    height
  );
  const shadowScale = interpolate(p, [0, 1], [1, 1.9]);
  // Taille de l'ombre deduite de la taille REELLE a l'ecran, pas d'une constante.
  const phonePx = PHONE_H_CM * DECOR_PX_PER_CM[decor];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* SFX cales sur les EVENEMENTS, pas sur un tempo : la scene s'allume,
          puis l'objet se pose. Mesure sur la reference : 12 transitoires en 8 s,
          chaque apparition a son son. */}
      <Sequence from={9} durationInFrames={30}>
        <Audio src={staticFile(SFX.lightUp)} volume={SFX_VOL} />
      </Sequence>
      <Sequence from={22} durationInFrames={40}>
        <Audio src={staticFile(SFX.tick)} volume={SFX_VOL * 0.7} />
      </Sequence>

      {/* DECOR — il grossit LEGEREMENT moins vite que l'objet : ce leger
          differentiel donne la parallaxe qui vend la profondeur. */}
      <AbsoluteFill
        style={{
          opacity: lit,
          transform: `scale(${interpolate(p, [0, 1], [1, 1.42])})`,
        }}
      >
        <Img
          src={staticFile(DECORS[decor])}
          style={{ width, height, objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* OMBRE PORTEE — sous l'objet, decalee bas-gauche. */}
      <GroundShadow
        cx="50%"
        cy="51%"
        w={phonePx * 0.50 * shadowScale}
        h={phonePx * 1.02 * shadowScale}
        opacity={0.62 * lit}
      />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, camZ] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights />
        {/* Leger desalignement (2.5 deg) : un objet vraiment pose n'est jamais
            parfaitement aligne sur le bord de la table. */}
        <group rotation={[0, 0, -0.044]}>
          <PhoneModel
            rotationY={0}
            scale={phoneScale}
            screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
          />
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/**
 * PLAN 2 — LAPTOP SUR UN BUREAU (trois-quarts).
 * Le capot S'OUVRE pendant que la camera approche : `lidAngle` est un simple
 * parametre du modele, donc le geste ne coute rien. C'est l'equivalent du
 * "on allume le produit" et ca donne un debut de plan qui n'est pas statique.
 */
export const LaptopOnDesk: React.FC<{ decor?: keyof typeof DECORS; warm?: boolean }> = ({
  decor = "darkAngle",
  warm = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const tex = useTex(PLATE_DESKTOP, 3840 / 2160, 2.88 / 1.8);

  const lit = interpolate(frame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const p = interpolate(frame, [18, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.25, 1),
  });

  // Capot : ferme (0.06 rad) -> ouvert (1.85 rad). L'ecran s'allume en s'ouvrant.
  const lid = interpolate(p, [0.05, 0.55], [0.06, 1.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0, 0.2, 1),
  });

  const camZ = interpolate(p, [0, 1], [9.2, 5.4]);
  const camY = interpolate(p, [0, 1], [1.1, 0.2]);

  /**
   * ⛔ Scale CALCULE. Choisir 1.15 au juge rendait la tasse du decor 2,2x plus
   * grosse que le laptop entier — absurde et immediatement visible.
   * Le modele fait 3.2 unites de large et doit occuper 31,2 cm.
   */
  const laptopScale = scaleForRealSize(
    3.2,
    LAPTOP_W_CM,
    DECOR_PX_PER_CM[decor],
    camZ,
    height
  );
  const laptopPx = LAPTOP_W_CM * DECOR_PX_PER_CM[decor];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={6} durationInFrames={30}>
        <Audio src={staticFile(SFX.lightUp)} volume={SFX_VOL} />
      </Sequence>
      {/* Le clic tombe au moment ou le capot commence a s'ouvrir. */}
      <Sequence from={22} durationInFrames={40}>
        <Audio src={staticFile(SFX.place)} volume={SFX_VOL * 0.85} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: lit,
          transform: `scale(${interpolate(p, [0, 1], [1, 1.22])})`,
        }}
      >
        <Img
          src={staticFile(DECORS[decor])}
          style={{ width, height, objectFit: "cover" }}
        />
      </AbsoluteFill>

      <GroundShadow
        cx="50%"
        cy="60%"
        w={laptopPx * 0.92}
        h={laptopPx * 0.20}
        opacity={0.6 * lit}
      />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, camY, camZ] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights warm={warm} />
        <LaptopModel
          rotationY={interpolate(p, [0, 1], [0.34, 0.1])}
          scale={laptopScale}
          lidAngle={lid}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

export const PhoneOnDeskExec: React.FC = () => <PhoneOnDesk decor="execTop" />;
export const LaptopOnDeskLight: React.FC = () => (
  <LaptopOnDesk decor="lightAngle" warm />
);
/** Registre Comma : bureau sombre, bokeh chaud, cadre assez large pour un laptop. */
export const LaptopOnDeskDark: React.FC = () => <LaptopOnDesk decor="darkWide" />;
