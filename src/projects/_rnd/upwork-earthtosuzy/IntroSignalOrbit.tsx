// MOTEUR: SVG pur -- QUOI/COMMENT: hook 4,5 s candidature Upwork "Earth to Suzy".
// PISTE B "Signal Orbit" : construite sur SES MOTS SEULS (aucun recours a ses
// videos, donc aucun ballon ni accessoire de sport). Un globe filaire traite
// comme une MACHINE GRAPHIQUE ; "staying active" se dit par la PULSATION.
//
// Matiere dessinee (statique) : out/_r-and-d/upwork-earthtosuzy/svg-signal-orbit/
// Calques extraits dans signalOrbitLayers.ts. L'ANIMATION est codee ici.
//
// Raccord 1->2 : l'agent qui a dessine a signale que l'etat 1 ne partage PAS la
// projection des autres -> le recul camera est un MORPH PILOTE (echelle + fondu
// croise), jamais une interpolation de coordonnees. C'est traite ligne ~150.
//
// 12 principes, repere a chaque geste :
//   ANTICIPATION      le point signal recule avant de partir
//   ARCS              toutes les trajectoires sont courbes
//   SLOW IN/OUT       aucune vitesse lineaire
//   FOLLOW-THROUGH    la trainee retarde ; les anneaux depassent puis reviennent
//   SQUASH & STRETCH  le globe se comprime en ovale puis redevient rond
//   TIMING/SPACING    contraction rapide, rebond, reprise douce (la pulsation)
//   ACTION SECONDAIRE ticks lumineux decales, rotation lente du globe
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LAYERS, LENS } from "./signalOrbitLayers";

export const ETS_ORBIT_FPS = 30;
export const ETS_ORBIT_FRAMES = 135; // 4,5 s

const BACKDROP = "#0B1020";
const CX = 960;
const CY = 540;

// --- Timeline (30 fps) ------------------------------------------------------
const ARCS_HOLD = 22; // on est DEDANS : le reseau d'arcs passe pres de l'objectif
const PULLBACK_IN = 18; // le recul camera commence (chevauche : pas de temps mort)
const PULLBACK_OUT = 46;
const GLOBE_IN = 30; // le globe se revele pendant le recul
const ORBIT1 = 44;
const ORBIT2 = 56;
const ORBIT3 = 66;
const PULSE_IN = 74; // la pulsation : contraction -> rebond -> reprise
const PULSE_PERIOD = 26;
const END = ETS_ORBIT_FRAMES;

/**
 * Groupe de calques dessines, injecte tel quel.
 * dangerouslySetInnerHTML est sur ici : la source est signalOrbitLayers.ts, un
 * module GENERE a partir de nos propres SVG (out/.../svg-signal-orbit/), commite
 * dans le repo. Aucune entree utilisateur, aucune donnee distante, rien de
 * dynamique a l'execution -- le contenu est fige au build comme du JSX litteral.
 */
const Layer: React.FC<{
  name: string;
  opacity?: number;
  dash?: number; // 0..1 : portion tracee
  transform?: string;
  style?: React.CSSProperties;
}> = ({ name, opacity = 1, dash, transform, style }) => {
  const html = LAYERS[name];
  if (!html) return null;
  const len = LENS[name];
  const dashStyle: React.CSSProperties =
    dash !== undefined && len
      ? { strokeDasharray: len, strokeDashoffset: len * (1 - dash) }
      : {};
  return (
    <g
      opacity={opacity}
      transform={transform}
      style={{ ...dashStyle, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const IntroSignalOrbit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === RECUL CAMERA : morph pilote, pas une interpolation de coordonnees ====
  // L'etat 1 (arcs vus de tres pres) et l'etat 2 (globe) n'ont pas la meme
  // projection : on passe de l'un a l'autre par ECHELLE + FONDU CROISE.
  const pull = interpolate(frame, [PULLBACK_IN, PULLBACK_OUT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 0.9, 0.24, 1), // zoom-out exponentiel puis freinage
  });

  // Les arcs : on demarre DEDANS (echelle 2.6) et ils s'eloignent.
  const arcScale = interpolate(pull, [0, 1], [2.6, 0.92]);
  const arcOpacity = interpolate(frame, [0, ARCS_HOLD, PULLBACK_OUT - 4], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // ACTION SECONDAIRE : derive lente des arcs, jamais figes.
  const arcDrift = interpolate(frame, [0, END], [0, -9]);

  // === GLOBE : se revele pendant le recul ==================================
  const globeIn = spring({
    frame: frame - GLOBE_IN,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 110 },
    durationInFrames: 34,
  });
  // SQUASH & STRETCH discret : ovale pendant la rotation, revient rond.
  const globeSquash = (1 - globeIn) * 0.13;
  // ACTION SECONDAIRE : rotation lente et continue.
  const globeSpin = interpolate(frame, [GLOBE_IN, END], [0, 7], {
    extrapolateLeft: "clamp",
  });
  const globeScale = interpolate(globeIn, [0, 1], [0.82, 1]);

  // === ANNEAUX : entrees decalees, chacun depasse puis revient ==============
  const ringIn = (start: number) =>
    spring({
      frame: frame - start,
      fps,
      config: { damping: 12, mass: 0.6, stiffness: 140 }, // overshoot visible
      durationInFrames: 26,
    });
  const r1 = ringIn(ORBIT1);
  const r2 = ringIn(ORBIT2);
  const r3 = ringIn(ORBIT3);

  // === PULSATION : contraction rapide -> rebond -> reprise douce ============
  // C'est ce qui dit "staying active" sans aucun accessoire de sport.
  const pulsePhase = frame >= PULSE_IN ? (frame - PULSE_IN) % PULSE_PERIOD : -1;
  // TIMING/SPACING : 0.2 s de contraction, 0.35 s de rebond, reprise plus lente.
  const pulseScale =
    pulsePhase < 0
      ? 1
      : pulsePhase < 6
        ? interpolate(pulsePhase, [0, 6], [1, 0.9], {
            easing: Easing.bezier(0.5, 0, 0.75, 0.2),
          })
        : pulsePhase < 17
          ? interpolate(pulsePhase, [6, 17], [0.9, 1.06], {
              easing: Easing.bezier(0.1, 0.9, 0.3, 1.2),
            })
          : interpolate(pulsePhase, [17, PULSE_PERIOD], [1.06, 1], {
              easing: Easing.bezier(0.4, 0, 0.3, 1),
            });
  const pulseOpacity =
    frame < PULSE_IN
      ? 0
      : interpolate(frame, [PULSE_IN, PULSE_IN + 8], [0, 1], {
          extrapolateRight: "clamp",
        });
  // ACTION SECONDAIRE : les ticks suivent la pulsation avec 3 frames de retard.
  const tickPhase = pulsePhase < 0 ? -1 : (pulsePhase + PULSE_PERIOD - 3) % PULSE_PERIOD;
  const tickScale =
    tickPhase < 0 ? 1 : interpolate(Math.min(tickPhase, 17), [0, 6, 17], [1, 0.92, 1.04]);

  // === POINT SIGNAL : ANTICIPATION puis depart en arc ======================
  const dotIn = interpolate(frame, [4, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // recul de quelques degres avant de partir autour de l'anneau
  const dotAngle = interpolate(
    frame,
    [4, 12, END],
    [8, -6, 300],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.2, 1) },
  );
  const dotR = 430;
  const dotX = CX + Math.cos((dotAngle * Math.PI) / 180) * dotR;
  const dotY = CY + Math.sin((dotAngle * Math.PI) / 180) * dotR * 0.34;

  const globeTf = `translate(${CX} ${CY}) rotate(${globeSpin}) scale(${globeScale * (1 + globeSquash)} ${globeScale * (1 - globeSquash)}) translate(${-CX} ${-CY})`;

  return (
    <AbsoluteFill style={{ backgroundColor: BACKDROP }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080">
        {/* --- ON DEMARRE DEDANS : le reseau d'arcs, tres pres -------------- */}
        {arcOpacity > 0.01 && (
          <g
            opacity={arcOpacity}
            transform={`translate(${CX} ${CY}) rotate(${arcDrift}) scale(${arcScale}) translate(${-CX} ${-CY})`}
          >
            <Layer name="e1-arc-network" />
            <Layer name="e1-arc-cross" opacity={0.75} />
            <Layer name="e1-arc-nodes" opacity={interpolate(pull, [0, 0.6], [1, 0], { extrapolateRight: "clamp" })} />
          </g>
        )}

        {/* --- LE GLOBE : revele par le recul ------------------------------- */}
        {frame >= GLOBE_IN && (
          <g transform={globeTf} opacity={globeIn}>
            <Layer name="globe-limb" dash={globeIn} />
            <Layer name="globe-meridians" opacity={interpolate(globeIn, [0.25, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <Layer name="globe-parallels" opacity={interpolate(globeIn, [0.45, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <Layer name="globe-axis" opacity={interpolate(globeIn, [0.6, 1], [0, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            <Layer name="globe-nodes" opacity={interpolate(globeIn, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </g>
        )}

        {/* --- ANNEAUX : entrees decalees, overshoot puis retour ------------ */}
        {frame >= ORBIT1 && (
          <Layer name="orbit-ring-1" dash={Math.min(r1, 1)} opacity={Math.min(r1 * 1.4, 1)}
            transform={`translate(${CX} ${CY}) scale(${interpolate(r1, [0, 1], [0.88, 1])}) translate(${-CX} ${-CY})`} />
        )}
        {frame >= ORBIT2 && (
          <Layer name="orbit-ring-2" dash={Math.min(r2, 1)} opacity={Math.min(r2 * 1.4, 1)}
            transform={`translate(${CX} ${CY}) scale(${interpolate(r2, [0, 1], [0.88, 1])}) translate(${-CX} ${-CY})`} />
        )}
        {frame >= ORBIT3 && (
          <Layer name="orbit-ring-3" dash={Math.min(r3, 1)} opacity={Math.min(r3 * 1.4, 1)}
            transform={`translate(${CX} ${CY}) scale(${interpolate(r3, [0, 1], [0.88, 1])}) translate(${-CX} ${-CY})`} />
        )}

        {/* --- LA PULSATION : "staying active", sans accessoire de sport ---- */}
        {pulseOpacity > 0.01 && (
          <>
            <Layer
              name="pulse-ring"
              opacity={pulseOpacity}
              transform={`translate(${CX} ${CY}) scale(${pulseScale}) translate(${-CX} ${-CY})`}
            />
            <Layer
              name="pulse-ticks"
              opacity={pulseOpacity * 0.9}
              transform={`translate(${CX} ${CY}) scale(${tickScale}) translate(${-CX} ${-CY})`}
            />
          </>
        )}

        {/* --- LE POINT SIGNAL : anticipation puis orbite (FOLLOW-THROUGH) -- */}
        <g opacity={dotIn} transform={`translate(${dotX - CX} ${dotY - CY})`}>
          <Layer name="signal-dot" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
