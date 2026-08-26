/**
 * DeviceShowreel — ce qu'on sait faire AUTOUR du mockup. Le mockup seul ne fait
 * pas le premium : ce sont les mouvements, la typo et les plans qui le font.
 *
 * 5 chapitres, chacun repond a une question posee :
 *   1. QUART DE TOUR   — pivot maitrise, l'objet reste lisible
 *   2. TOUR COMPLET    — 360 deg : possible, et on voit le dos (module camera)
 *   3. TEXTE DERRIERE  — le titre passe DERRIERE le chassis (mesure sur la
 *                        reference Comma : son texte est coupe par le telephone)
 *   4. TEXTE A COTE    — le split-screen de la reference : texte a gauche, objet a droite
 *   5. LES DEUX + UI   — l'assemblage complet
 *
 * ⛔ TEXTE DERRIERE — 2 voies, une seule est juste :
 *   (a) Empilement DOM : <div texte> sous <ThreeCanvas transparent>. Le canvas
 *       etant au-dessus, le texte passe derriere TOUT le canvas. Simple, exact,
 *       et c'est ce qu'on utilise : la profondeur vient de l'ordre des couches.
 *   (b) Texte dans la scene 3D (drei <Text>) : vrai tri en profondeur, le texte
 *       pourrait passer derriere l'objet ET devant le fond, voire etre coupe en
 *       biais. Plus riche, mais le texte devient une texture 3D — il perd la
 *       nettete du rendu de police DOM, exactement le probleme que `zoom` vs
 *       `scale` resout cote Shotcraft. On garde (a).
 *
 * Le fond reste #101010 plat (mesure aux 4 coins de la reference).
 */

import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

import { LaptopModel } from "./LaptopModel";
import { PhoneModel } from "./PhoneModel";

/**
 * ⛔ Charger les polices explicitement : sans ca, Chromium headless retombe
 * SILENCIEUSEMENT sur une police systeme et toute la typo change sans erreur.
 */
const { fontFamily: GROTESK } = loadGrotesk("normal", { weights: ["700"] });
const { fontFamily: PLEX } = loadPlexMono("normal", { weights: ["400", "500"] });

const BG = "#101010";
const PLATE_MOBILE = "_client-sim/noteshield/live-mobile/dashboard-mobile.png";
const PLATE_DESKTOP = "_client-sim/noteshield/live/dashboard-full.png";

/** Chargement HORS canvas (les effets d'un enfant de ThreeCanvas ne sont jamais flushes). */
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

const Lights: React.FC = () => (
  <>
    <ambientLight color="#ffffff" intensity={0.7} />
    <directionalLight position={[2.5, 7, 2]} color="#ffffff" intensity={4.0} />
    <directionalLight position={[-5, 1.5, 2.5]} color="#ffffff" intensity={1.3} />
    <directionalLight position={[4.5, 2, -3.5]} color="#ffffff" intensity={1.5} />
    {/* Contre-jour arriere : sans lui, le DOS de l'objet est noir au demi-tour. */}
    <directionalLight position={[0, 2, -6]} color="#ffffff" intensity={2.2} />
  </>
);

/** Le canvas est TRANSPARENT : ce qui est dessine sous lui passe derriere l'objet. */
const Stage: React.FC<{
  children: React.ReactNode;
  camZ: number;
  camY?: number;
}> = ({ children, camZ, camY = 0.1 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 40, position: [0, camY, camZ] }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <Lights />
      {children}
    </ThreeCanvas>
  );
};

/** Typo commune — une seule famille, deux graisses, comme la reference. */
const TITLE: React.CSSProperties = {
  fontFamily: GROTESK,
  fontWeight: 700,
  color: "#F4F1EA",
  letterSpacing: "-0.02em",
  lineHeight: 1.08,
  margin: 0,
};

const LABEL: React.CSSProperties = {
  fontFamily: PLEX,
  fontSize: 21,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#6FD08C",
  margin: 0,
};

/** Cartouche de chapitre — dit ce que le plan demontre. */
const Chapter: React.FC<{ n: string; title: string }> = ({ n, title }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 12, 66, 78], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        bottom: 64,
        opacity: o,
        display: "flex",
        alignItems: "baseline",
        gap: 18,
      }}
    >
      <span style={{ ...LABEL, fontSize: 17, color: "#5E6B74" }}>{n}</span>
      <span style={{ ...LABEL, fontSize: 19 }}>{title}</span>
    </div>
  );
};

// ---------------------------------------------------------------------------
// 1. QUART DE TOUR
// ---------------------------------------------------------------------------
const QuarterTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 84], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.42, 0, 0.25, 1),
  });
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Stage camZ={4.6}>
        <PhoneModel
          rotationY={interpolate(p, [0, 1], [-0.55, 0.55])}
          scale={1.0}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      </Stage>
      <Chapter n="01" title="Quart de tour" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. TOUR COMPLET — on voit le dos, donc le module camera
// ---------------------------------------------------------------------------
const FullTurn: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 96], [0, 1], { extrapolateRight: "clamp" });
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Stage camZ={4.8}>
        <PhoneModel
          rotationY={p * Math.PI * 2}
          scale={1.0}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      </Stage>
      <Chapter n="02" title="Tour complet — le dos existe" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. TEXTE DERRIERE L'OBJET
// ---------------------------------------------------------------------------
const TextBehind: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);
  // Le mot glisse lateralement : on VOIT qu'il disparait derriere le chassis.
  const x = interpolate(p, [0, 1], [-140, 60]);
  const o = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* COUCHE DU DESSOUS — le canvas transparent la recouvre, d'ou l'occlusion. */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${x}px)`,
          opacity: o,
        }}
      >
        <h1 style={{ ...TITLE, fontSize: Math.round(width * 0.135) }}>
          DÉTERMINISTE
        </h1>
      </AbsoluteFill>
      <Stage camZ={4.9}>
        <PhoneModel
          rotationY={interpolate(p, [0, 1], [0.3, -0.12])}
          scale={1.0}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      </Stage>
      <Chapter n="03" title="Le texte passe derrière" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4. TEXTE A COTE — le split-screen de la reference
// ---------------------------------------------------------------------------
const TextBeside: React.FC = () => {
  const frame = useCurrentFrame();
  const tex = useTex(PLATE_MOBILE, 1170 / 2532, 1.39 / 3.012);
  const p = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: "clamp" });

  /** Chaque ligne monte et s'eclaircit avec un decalage — jamais toutes ensemble. */
  const line = (i: number) => {
    const s = i * 9;
    return {
      opacity: interpolate(frame, [s, s + 18], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(frame, [s, s + 22], [26, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })}px)`,
    };
  };

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* L'objet est decale a droite ; le texte occupe la gauche. */}
      <AbsoluteFill style={{ transform: "translateX(24%)" }}>
        <Stage camZ={5.4}>
          <PhoneModel
            rotationY={interpolate(p, [0, 1], [0.38, 0.2])}
            scale={1.0}
            screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
          />
        </Stage>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: "50%",
          transform: "translateY(-50%)",
          width: "38%",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <p style={{ ...LABEL, ...line(0) }}>Pilier 3 &times; Pilier 4</p>
        <h1 style={{ ...TITLE, fontSize: 76, ...line(1) }}>
          L&apos;interface
          <br />
          <span style={{ color: "#6FD08C" }}>capturée</span>, pas
          <br />
          redessinée.
        </h1>
        <p
          style={{
            fontFamily: PLEX,
            fontSize: 22,
            lineHeight: 1.6,
            color: "#8A99A3",
            margin: 0,
            ...line(2),
          }}
        >
          Une révision = un paramètre.
          <br />
          Pas une reprise à la main.
        </p>
      </div>
      <Chapter n="04" title="Texte à côté — le split de la référence" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. L'ASSEMBLAGE — laptop, camera qui approche, texte derriere puis a cote
// ---------------------------------------------------------------------------
const FullPlate: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const p = interpolate(frame, [0, 110], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const tex = useTex(PLATE_DESKTOP, 3840 / 2160, 2.88 / 1.8);
  const o = interpolate(frame, [6, 30], [0, 1], { extrapolateRight: "clamp" });
  const rise = interpolate(frame, [6, 34], [40, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "9%",
          opacity: o,
          transform: `translateY(${rise}px)`,
        }}
      >
        <h1
          style={{
            ...TITLE,
            fontSize: Math.round(width * 0.072),
            textAlign: "center",
          }}
        >
          Chaque render est <span style={{ color: "#6FD08C" }}>identique</span>.
        </h1>
      </AbsoluteFill>
      <Stage camZ={interpolate(p, [0, 1], [8.6, 4.6])} camY={interpolate(p, [0, 1], [0.5, 0.05])}>
        <LaptopModel
          rotationY={interpolate(p, [0, 1], [0.5, 0.08])}
          scale={1.25}
          screen={tex ? <meshBasicMaterial map={tex} toneMapped={false} /> : undefined}
        />
      </Stage>
      <Chapter n="05" title="Assemblage" />
    </AbsoluteFill>
  );
};

const CH = 90;

export const DeviceShowreel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: BG }}>
    <Sequence durationInFrames={CH}><QuarterTurn /></Sequence>
    <Sequence from={CH} durationInFrames={102}><FullTurn /></Sequence>
    <Sequence from={CH + 102} durationInFrames={96}><TextBehind /></Sequence>
    <Sequence from={CH + 198} durationInFrames={102}><TextBeside /></Sequence>
    <Sequence from={CH + 300} durationInFrames={118}><FullPlate /></Sequence>
  </AbsoluteFill>
);
