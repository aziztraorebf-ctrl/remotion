/**
 * HookEffects — overlays "effets AE" reutilisables, posables PAR-DESSUS n'importe quel hook.
 *
 * Issu de la Partie B du DA-brief 3 modeles (effets faisables en SVG/Remotion, frame-driven).
 * Tous render-safe (feTurbulence/feDisplacementMap deja prouves en render : WarMapEngine, GrainOverlay).
 *
 * - HookGrain          : grain/noise statique subtil (texture premium "film/parchemin vivant"). Pose partout.
 * - HookDisplacementBurst : onde de choc DEFORMANTE a un frame donne (feDisplacementMap qui s'attenue).
 *                           Donne le "tremblement de terre / deflagration" a un impact (lock, contagion).
 *
 * Doctrine : memory/projects/HOOKS-LIBRARY-PLAN.md (Partie B). Catalogue : HOOKS-LIBRARY-CATALOGUE.md.
 */

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/** Grain SVG subtil, deterministe (render-safe). Pose en dernier par-dessus le hook. */
export const HookGrain: React.FC<{ opacity?: number; baseFrequency?: number }> = ({
  opacity = 0.05,
  baseFrequency = 0.9,
}) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="hook-grain">
        <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hook-grain)" />
    </svg>
  </AbsoluteFill>
);

/**
 * Onde de choc deformante : a partir de `at`, la zone se "tord" brievement (feDisplacementMap)
 * puis se stabilise sur `dur` frames. A poser AUTOUR du contenu a deformer (ex: wrapper la carte).
 * Utiliser via le pattern : <HookDisplacementBurst at={..}>{children}</HookDisplacementBurst>
 */
export const HookDisplacementBurst: React.FC<{
  at: number;
  dur?: number;
  /** Intensite max du deplacement en px. */
  scale?: number;
  children: React.ReactNode;
}> = ({ at, dur = 26, scale = 28, children }) => {
  const frame = useCurrentFrame();
  const prog = interpolate(frame - at, [0, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const active = frame >= at && frame < at + dur;
  const disp = scale * prog;
  // seed varie par frame -> la turbulence "bouge" pendant la deformation
  const seed = (frame - at) % 100;
  const id = "hook-shock";

  if (!active) return <>{children}</>;
  return (
    <>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id}>
          <feTurbulence type="turbulence" baseFrequency="0.012 0.018" numOctaves={2} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={disp} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div style={{ filter: `url(#${id})`, width: "100%", height: "100%" }}>{children}</div>
    </>
  );
};
