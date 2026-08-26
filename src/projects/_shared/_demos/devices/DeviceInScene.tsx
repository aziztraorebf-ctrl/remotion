/**
 * DeviceInScene — l'appareil POSE DANS UN DECOR, pas flottant dans le vide.
 *
 * C'est l'ecart n°1 releve sur la reference "Foster With Confidence" (2026-08-25) :
 * son telephone est sur un vrai bureau (tapis de decoupe, plante, cafe, regle),
 * avec une ombre portee et une lumiere qui vient de quelque part. Notre showreel
 * avait un objet techniquement reussi mais visuellement froid, parce qu'il
 * flottait dans le noir.
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
  Easing,
  Img,
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
  lightAngle: "_shared/refs/decors-mockup/desk-light-34.png",
  studio: "_shared/refs/decors-mockup/studio-neutral.png",
} as const;

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
 * Ombre portee. Une ellipse floutee decalee vers le BAS-GAUCHE (la lumiere vient
 * du haut-droite). `spread` grandit avec la hauteur simulee de l'objet : une
 * ombre serree = objet pose, une ombre large et pale = objet souleve.
 */
const ContactShadow: React.FC<{
  cx: string;
  cy: string;
  w: number;
  h: number;
  opacity: number;
  blur?: number;
}> = ({ cx, cy, w, h, opacity, blur = 42 }) => (
  <div
    style={{
      position: "absolute",
      left: cx,
      top: cy,
      width: w,
      height: h,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: "rgba(0,0,0,1)",
      opacity,
      filter: `blur(${blur}px)`,
      pointerEvents: "none",
    }}
  />
);

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
  const shadowScale = interpolate(p, [0, 1], [1, 1.9]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
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
      <ContactShadow
        cx="49%"
        cy="53.5%"
        w={150 * shadowScale}
        h={300 * shadowScale}
        opacity={0.5 * lit}
        blur={34}
      />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, camZ] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights />
        <PhoneModel
          rotationY={0}
          scale={1.0}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
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

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
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

      <ContactShadow
        cx="50%"
        cy="63%"
        w={interpolate(p, [0, 1], [520, 900])}
        h={interpolate(p, [0, 1], [110, 190])}
        opacity={0.55 * lit}
        blur={46}
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
          scale={1.15}
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
