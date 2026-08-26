/**
 * DeviceHeroShot — le mockup en PLAN SERRE, avec une VIDEO qui joue dans l'ecran
 * et une camera qui s'en approche. C'est le registre "hero section" de la
 * reference Comma, par opposition au banc (qui juge la geometrie, pas la mise en scene).
 *
 * MESURE SUR LA REFERENCE (ref_8.0s.jpg, 1200x781) :
 *   l'appareil occupe 82 % de la largeur et 90 % de la hauteur, et il DEBORDE
 *   du cadre par le bas. Il n'est pas pose au milieu d'un grand vide : il est
 *   pres, il sort du cadre, et c'est ce qui rend l'UI lisible a l'ecran.
 *   Un mockup cadre large = une UI illisible = un plan qui ne sert a rien.
 *
 * FOND : #101010 plat, mesure aux 4 coins de la reference — pas de degrade.
 *   Un mockup premium se lit par ses ARETES qui accrochent la lumiere ; un
 *   degrade derriere brouille ce contour. Seule concession : un vignettage
 *   radial tres sourd, invisible comme degrade, qui evite le fond "mort" en video.
 *
 * ⛔ La texture VIDEO est construite HORS du <ThreeCanvas> (voir FICHE-UI-PRODUIT
 *   § piege 1 : les effets React d'un enfant du canvas ne sont jamais flushes
 *   avant la capture d'une frame).
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
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

/** Fond mesure sur la reference Comma. */
const BG = "#101010";

/**
 * Sequence Shotcraft deja rendue, rejouee comme texture d'ecran.
 * C'est la reponse a "peut-on avoir une video qui joue DANS le mockup" : oui,
 * via VideoTexture — le <video> est cree en DOM, hors canvas, et three lit ses
 * frames. `muted` + `playsInline` sont obligatoires pour l'autoplay headless.
 */
const CLIP = "_client-sim/noteshield/renders/northshield-promo.mp4";

const useVideoTexture = (src: string, fps: number, frame: number) => {
  const [handle] = useState(() => delayRender("loading UI clip"));
  const [tex, setTex] = useState<THREE.VideoTexture | null>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    const el = document.createElement("video");
    el.src = staticFile(src);
    el.muted = true;
    el.playsInline = true;
    el.crossOrigin = "anonymous";
    el.preload = "auto";
    const onReady = () => {
      const t = new THREE.VideoTexture(el);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      setVideo(el);
      setTex(t);
      continueRender(handle);
    };
    el.addEventListener("loadeddata", onReady, { once: true });
    el.addEventListener("error", () => continueRender(handle), { once: true });
    el.load();
    return () => el.removeAttribute("src");
  }, [src, handle]);

  /**
   * Render deterministe : on ne LAIT PAS la video jouer toute seule (le temps
   * mur n'existe pas en headless). On force currentTime depuis la frame Remotion,
   * puis on demande a la texture de se rafraichir.
   */
  useLayoutEffect(() => {
    if (!video || !tex) return;
    const t = frame / fps;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = Math.min(t, video.duration - 0.01);
    }
    tex.needsUpdate = true;
  }, [video, tex, frame, fps]);

  return tex;
};

/** Image fixe de repli quand aucun clip n'est disponible. */
const useImageTexture = (src: string) => {
  const [handle] = useState(() => delayRender("loading UI plate"));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useLayoutEffect(() => {
    new THREE.TextureLoader().load(
      staticFile(src),
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        setTex(t);
        continueRender(handle);
      },
      undefined,
      () => continueRender(handle)
    );
  }, [src, handle]);
  return tex;
};

/**
 * Cadrage "cover" applique a la texture : on rogne, on n'etire jamais.
 * Fait ici et pas dans le loader pour que la meme texture serve 2 ratios d'ecran.
 */
const fitCover = (
  tex: THREE.Texture | null,
  texAspect: number,
  screenAspect: number
) => {
  if (!tex) return null;
  if (texAspect > screenAspect) {
    const r = screenAspect / texAspect;
    tex.repeat.set(r, 1);
    tex.offset.set((1 - r) / 2, 0);
  } else {
    const r = texAspect / screenAspect;
    tex.repeat.set(1, r);
    tex.offset.set(0, (1 - r) / 2);
  }
  return tex;
};

/**
 * Rig studio du plan serre. Directions et couleurs reprises du rig VISION
 * (mesure au pixel sur la reference), intensites remontees : le rig brut
 * tombait l'objet en silhouette.
 */
const HeroLights: React.FC = () => (
  <>
    <ambientLight color="#ffffff" intensity={0.7} />
    {/* KEY neutre en haut-droite : la rampe de chanfrein 39->67 de la reference. */}
    <directionalLight position={[2.5, 7, 2]} color="#ffffff" intensity={4.0} />
    {/* Fill gauche : separe le rail du fond sans deboucher la face. */}
    <directionalLight position={[-5, 1.5, 2.5]} color="#ffffff" intensity={1.3} />
    {/* Rim arriere-droite, discret — la reference n'a PAS de rim chaud. */}
    <directionalLight position={[4.5, 2, -3.5]} color="#ffffff" intensity={1.5} />
  </>
);

/**
 * Vignettage radial tres sourd. Pas un degrade decoratif : il empeche seulement
 * le fond plat de paraitre mort une fois en mouvement.
 */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(70% 60% at 50% 45%, rgba(255,255,255,0.035), rgba(0,0,0,0) 70%)",
      pointerEvents: "none",
    }}
  />
);

type Device = "phone" | "laptop";

/**
 * Le plan : la camera part d'un plan large et se RAPPROCHE, pendant que
 * l'appareil pivote legerement. Mouvement continu (un seul interpolate par
 * canal, pas de segments) — un easing par segment produirait un arret a chaque
 * keypoint, piege deja paye sur les cameras D3.
 */
export const DeviceHeroShot: React.FC<{ device?: Device; useClip?: boolean }> = ({
  device = "phone",
  useClip = false,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const p = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;

  const isPhone = device === "phone";
  const screenAspect = isPhone ? 1.39 / 3.012 : 2.88 / 1.8;

  // Textures : les deux hooks tournent (regle des hooks), on ne garde que l'utile.
  const clipTex = useVideoTexture(CLIP, fps, frame);
  const plateTex = useImageTexture(
    isPhone
      ? "_client-sim/noteshield/live-mobile/dashboard-mobile.png"
      : "_client-sim/noteshield/live/dashboard-full.png"
  );
  const raw = useClip && clipTex ? clipTex : plateTex;
  const texAspect = useClip && clipTex ? 1920 / 1080 : isPhone ? 1170 / 2532 : 3840 / 2160;
  const tex = fitCover(raw, texAspect, screenAspect);

  /**
   * Camera : recul cadre par MESURE, pas au juge. 1re version (9.4 -> 6.2)
   * mesuree a 66 % de hauteur en fin de course, contre 90 % sur la reference :
   * beaucoup trop loin, l'UI devenait un timbre-poste. Valeurs resserrees pour
   * viser ~90 % et laisser l'objet DEBORDER, comme la reference.
   * L'appareil pivote de 0.42 a 0.06 rad : il s'ouvre vers le spectateur a
   * mesure qu'on approche, donc l'ecran devient lisible pile quand il est gros.
   * Interpolate unique par canal (pas de segments) : un easing par segment
   * produirait un arret a chaque keypoint — piege deja paye sur les cameras D3.
   */
  const camZ = interpolate(p, [0, 1], isPhone ? [7.2, 4.15] : [8.2, 4.5]);
  const rotY = interpolate(p, [0, 1], [0.42, 0.06]);
  const camY = interpolate(p, [0, 1], [0.35, 0.05]);

  const Model = isPhone ? PhoneModel : LaptopModel;
  const screen = tex ? (
    <meshBasicMaterial map={tex} toneMapped={false} />
  ) : undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 40, position: [0, camY, camZ] }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <HeroLights />
        <Model rotationY={rotY} scale={isPhone ? 1.0 : 1.25} screen={screen} />
      </ThreeCanvas>
      <Vignette />
    </AbsoluteFill>
  );
};

export const PhoneHeroShot: React.FC = () => <DeviceHeroShot device="phone" />;
export const LaptopHeroShot: React.FC = () => <DeviceHeroShot device="laptop" />;
export const PhoneHeroClip: React.FC = () => (
  <DeviceHeroShot device="phone" useClip />
);
