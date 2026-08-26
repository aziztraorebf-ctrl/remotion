// MOTEUR: objet 3D + UI produit (mockup device + plaque capturee)
/**
 * FOSTER — PLAN 1 (0 -> 1,60 s) : LE TELEPHONE SUR LE BUREAU
 * =========================================================
 * Reproduction de « Foster With Confidence » (vendue sur Fiverr).
 * Reference : public/_client-sim/_references/foster/foster-with-confidence.mp4
 *
 * CE QUE FAIT LA REFERENCE (mesure image par image, pas devine) :
 *   - t=0 a 0,53 s   : ecran quasi noir, le telephone est deja la, allume.
 *   - t=0,53 a 1,20 s: LE DECOR S'ALLUME progressivement (luminance du bas
 *                      mesuree : 9,8 -> 81,5). Montee lente puis acceleration
 *                      nette a partir de 1,07 s.
 *   - t=1,20 a 1,60 s: plateau, le plan large se stabilise.
 *   - t=1,602 s      : COUPE FRANCHE (score 0,60 mesure sur la zone centrale,
 *                      hors interface Fiverr) vers le tres gros plan.
 *
 * ⛔ LE DOSSIER SE TROMPAIT SUR DEUX POINTS, corriges ici :
 *   1. Ce n'est PAS « un telephone seul sur noir » : l'ecran porte une
 *      NOTIFICATION qui est l'accroche narrative de toute la video —
 *      « Head Of Service : Ofsted are coming. Can you assemble an evidence
 *      pack? ». C'est elle le sujet du plan, pas le telephone.
 *   2. L'allumage du decor appartient a CE plan, pas au plan 2.
 *
 * ECHELLE : CALCULEE, jamais dosee a l'oeil (voir DeviceInScene) — le telephone
 * doit occuper 14,7 cm a l'echelle du decor. Un scale choisi au juge donnait
 * 2,1x trop grand sur le plan equivalent.
 */

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
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { PhoneModel } from "../../../_shared/_demos/devices/PhoneModel";

/** Decor : bureau vu du DESSUS, tapis de decoupe — le plus proche de la reference. */
const DECOR = "_shared/refs/decors-mockup/desk-designer-top.png";
/** Regle Staedtler 30 cm mesuree a 738 px sur le rendu 1920x1080 (cf DeviceInScene). */
const DECOR_PX_PER_CM = 24.6;
const PHONE_H_CM = 14.7; // iPhone 15 Pro : 146,6 mm

/** Plaque d'ecran verrouille, capturee par ui-capture (1179x2556 natif). */
const PLATE = "_client-sim/foster/screens/lockscreen.png";

/** SFX — banque Shotcraft. ⛔ PAS de whoosh sur une UI. */
const SFX = {
  lightUp: "_client-sim/noteshield/sfx/hit-weak.mp3",
  notif: "_client-sim/noteshield/sfx/tone.mp3",
} as const;
const SFX_VOL = 0.5;

const unitsToPx = (units: number, camZ: number, renderH: number) =>
  (units / (2 * camZ * Math.tan((40 * Math.PI) / 360))) * renderH;

const scaleForRealSize = (
  modelUnits: number,
  targetCm: number,
  pxPerCm: number,
  camZ: number,
  renderH: number
) => (targetCm * pxPerCm) / unitsToPx(modelUnits, camZ, renderH);

/** Charge la plaque en texture, cadree "cover" sur l'ecran du modele. */
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

/** Rig cale sur la lumiere du decor : key en haut a droite. */
const SceneLights: React.FC = () => (
  <>
    <ambientLight intensity={0.55} />
    <directionalLight position={[4, 6, 5]} intensity={1.5} />
    <directionalLight position={[-4, -2, 3]} intensity={0.35} />
  </>
);

/** Ombre portee a 3 couches — une ombre reelle n'a pas un bord unique. */
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
  });
  return (
    <>
      <div style={layer(-6, 10, 1.25, 1.1, 0.30, 34)} />
      <div style={layer(-3, 6, 1.02, 1.0, 0.42, 16)} />
      <div style={layer(-1, 3, 0.86, 0.92, 0.5, 7)} />
    </>
  );
};

export const Plan01Lockscreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Plaque 1179x2556 ; ecran du modele 1.39 x 3.012 unites.
  const tex = useTex(PLATE, 1179 / 2556, 1.39 / 3.012);

  /**
   * ALLUMAGE DU DECOR — courbe MESUREE sur la reference, pas choisie :
   * montee lente 0,53 -> 1,03 s puis acceleration 1,07 -> 1,20 s.
   * On la reproduit en deux temps plutot qu'avec un seul ease.
   */
  const tSec = frame / fps;
  const litSlow = interpolate(tSec, [0.53, 1.03], [0, 0.33], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.linear,
  });
  const litFast = interpolate(tSec, [1.03, 1.2], [0, 0.67], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const lit = litSlow + litFast;

  /**
   * Le plan large est quasi FIXE : la reference ne bouge pas avant la coupe.
   * Une derive tres lente (1 -> 1.02) evite l'image morte sans inventer un
   * mouvement que la reference n'a pas.
   */
  const drift = interpolate(tSec, [0, 1.6], [1, 1.02], {
    extrapolateRight: "clamp",
  });
  /**
   * CADRAGE — facteur MESURE, pas dose : la periode des carreaux du tapis vaut
   * 214 px dans la reference contre 188 px chez nous (FFT sur une ligne du
   * tapis) => le decor doit etre agrandi de 214/188 = 1,138.
   * Le telephone, lui, etait deja a la bonne taille : on ne touche pas a son
   * echelle calculee, seulement au cadrage du decor.
   */
  const DECOR_ZOOM = 1.138;

  const camZ = 8.4;
  const phoneScale = scaleForRealSize(3.2, PHONE_H_CM, DECOR_PX_PER_CM, camZ, height);
  const phonePx = PHONE_H_CM * DECOR_PX_PER_CM;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* SFX cales sur les EVENEMENTS. La reference porte 12 transitoires en
          8 s : chaque apparition a son son. */}
      <Sequence from={Math.round(0.53 * fps)} durationInFrames={Math.round(1.2 * fps)}>
        <Audio src={staticFile(SFX.lightUp)} volume={SFX_VOL} />
      </Sequence>
      <Sequence from={Math.round(0.2 * fps)} durationInFrames={Math.round(0.8 * fps)}>
        <Audio src={staticFile(SFX.notif)} volume={SFX_VOL * 0.75} />
      </Sequence>

      {/* DECOR — il s'allume, il ne se devoile pas par un fondu plat :
          l'opacite monte sur une courbe mesuree. */}
      <AbsoluteFill style={{ opacity: lit, transform: `scale(${drift * DECOR_ZOOM})` }}>
        <Img src={staticFile(DECOR)} style={{ width, height, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Halo froid autour du telephone : present des 0,5 s dans la reference
          (eclats bleus), il precede l'allumage du decor. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(30% 24% at 50% 50%, rgba(120,195,255,0.55), rgba(60,140,230,0.20) 45%, transparent 72%)",
          mixBlendMode: "screen",
          opacity: interpolate(tSec, [0.10, 0.55, 1.3], [0, 1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <GroundShadow cx="50%" cy="51%" w={phonePx * 0.5} h={phonePx * 1.02} opacity={0.62 * lit} />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, camZ] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights />
        {/* 2,5 deg de desalignement : un objet vraiment pose n'est jamais
            parfaitement aligne sur le bord de la table. */}
        <group rotation={[0, 0, -0.044]} scale={drift}>
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
