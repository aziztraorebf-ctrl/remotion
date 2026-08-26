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
  spring,
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

/**
 * L'ECRAN EST VIVANT : la notification s'ECRIT en 3 temps dans la reference
 * (mesure sur zoom serre) — bulle vide a 0,05 s, « Ofsted » a 0,30 s, phrase
 * complete a 0,60 s. Trois plaques capturees, pas une image fixe.
 */
const PLATES = [
  "_client-sim/foster/screens/lockscreen-s0.png",
  "_client-sim/foster/screens/lockscreen-s1.png",
  "_client-sim/foster/screens/lockscreen-s2.png",
] as const;
/** Bascule d'etat, en secondes (mesure sur la reference). */
const PLATE_AT = [0, 0.27, 0.55] as const;

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
  const t0 = useTex(PLATES[0], 1179 / 2556, 1.39 / 3.012);
  const t1 = useTex(PLATES[1], 1179 / 2556, 1.39 / 3.012);
  const t2 = useTex(PLATES[2], 1179 / 2556, 1.39 / 3.012);

  /**
   * ALLUMAGE DU DECOR — courbe MESUREE sur la reference, pas choisie :
   * montee lente 0,53 -> 1,03 s puis acceleration 1,07 -> 1,20 s.
   * On la reproduit en deux temps plutot qu'avec un seul ease.
   */
  const tSec = frame / fps;

  /**
   * LE « SPLASH » — ce n'est PAS un fondu lineaire.
   * Luminance globale mesuree frame par frame sur la reference : la montee
   * ACCELERE continument (+0,4/frame a 0,1 s, +3 a 0,9 s, PIC A +10,8 a 1,10 s)
   * puis s'ARRETE NET a 1,20 s (delta < 0,1 ensuite : plateau parfait).
   * Une courbe cubique-in reproduit cette acceleration ; le clamp donne l'arret sec.
   */
  const lit = interpolate(tSec, [0.0, 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  /** Plaque courante : l'ecran vit pendant que le decor s'allume. */
  const plateIdx = tSec >= PLATE_AT[2] ? 2 : tSec >= PLATE_AT[1] ? 1 : 0;
  const tex = plateIdx === 2 ? t2 : plateIdx === 1 ? t1 : t0;

  /**
   * Le plan large est quasi FIXE : la reference ne bouge pas avant la coupe.
   * Une derive tres lente (1 -> 1.02) evite l'image morte sans inventer un
   * mouvement que la reference n'a pas.
   */
  /**
   * PULL BACK REVEAL — le geste principal du plan, absent de la v1.
   * MESURE a la regle sur la reference (largeur du chassis, plein cadre) :
   *   t=0,05 s -> 342 px  |  t=0,60 s -> 322 px  |  t=1,45 s -> 155 px
   * Soit un recul de x2,2, concentre entre 0,9 et 1,3 s — avant ca le cadrage
   * ne bouge quasiment pas. On reproduit ce profil : plateau, puis recul.
   */
  const pull = interpolate(tSec, [0, 0.6, 0.9, 1.3], [2.2, 2.07, 1.9, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  /**
   * LA POSE — arret amorti avec un LEGER depassement.
   * ⚠️ Mesure honnete : je n'ai PAS pu prouver un overshoot franc sur la
   * reference (sa 1re seconde est recouverte par l'interface Fiverr, et tout
   * detecteur global derape quand le decor s'allume). Ce que je mesure est une
   * forte deceleration qui se cale a 1,30 s. On code donc un spring a
   * depassement leger — a ajuster au rendu si c'est trop marque.
   */
  const settle = spring({
    frame: frame - Math.round(1.05 * fps),
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 120 },
    durationInFrames: Math.round(0.55 * fps),
  });
  /** 1 -> leger depassement -> 1. Amplitude volontairement faible (1,8 %). */
  const bounce = 1 + 0.018 * Math.sin(settle * Math.PI) * (1 - settle * 0.35);
  /**
   * CADRAGE — facteur MESURE, pas dose : la periode des carreaux du tapis vaut
   * 214 px dans la reference contre 188 px chez nous (FFT sur une ligne du
   * tapis) => le decor doit etre agrandi de 214/188 = 1,138.
   * Le telephone, lui, etait deja a la bonne taille : on ne touche pas a son
   * echelle calculee, seulement au cadrage du decor.
   */
  const DECOR_ZOOM = 1.138;

  /**
   * ⛔⛔ CAUSE RACINE D'UN BUG QUI A COUTE 2 RENDUS (v3, v4) :
   * la prop `camera={{ position: [0, 0, camZ] }}` de <ThreeCanvas> n'est lue
   * QU'A L'INITIALISATION — c'est une valeur par DEFAUT de react-three-fiber,
   * pas une liaison reactive. Animer `camZ` ne bouge donc RIEN a l'ecran.
   * (`PhoneOnDesk` semble animer sa camera, mais son zoom vient en realite du
   * `scale` qu'il recalcule sur camZ — la camera, elle, ne bouge jamais.)
   * -> LE PULL BACK PASSE PAR LE SCALE. La camera reste a distance fixe.
   */
  const CAM_Z = 8.4;
  /**
   * Echelle de REFERENCE : le telephone fait ses 14,7 cm reels a l'echelle du
   * decor une fois le plan large atteint. `pull` la multiplie pendant le recul.
   */
  const phoneScaleBase = scaleForRealSize(3.2, PHONE_H_CM, DECOR_PX_PER_CM, CAM_Z, height);
  const phoneScale = phoneScaleBase * pull * bounce;
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
      <AbsoluteFill style={{ opacity: lit, transform: `scale(${pull * DECOR_ZOOM * bounce})` }}>
        <Img src={staticFile(DECOR)} style={{ width, height, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Halo froid autour du telephone : present des 0,5 s dans la reference
          (eclats bleus), il precede l'allumage du decor. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(26% 21% at 50% 50%, rgba(120,195,255,0.50), rgba(60,140,230,0.18) 48%, transparent 70%)",
          transform: `scale(${pull})`,
          mixBlendMode: "screen",
          opacity: interpolate(tSec, [0.10, 0.55, 1.3], [0, 1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* L'ombre suit le pull back : large quand on est serre, resserree a la pose.
          Elle porte aussi le rebond — une ombre qui ne bouge pas trahit l'objet colle. */}
      <GroundShadow
        cx="50%"
        cy="51%"
        w={phonePx * 0.5 * pull * bounce}
        h={phonePx * 1.02 * pull * bounce}
        opacity={0.62 * lit}
      />

      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, 0, CAM_Z] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <SceneLights />
        {/* 2,5 deg de desalignement : un objet vraiment pose n'est jamais
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
