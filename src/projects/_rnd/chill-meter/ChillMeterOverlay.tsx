// MOTEUR: objet/metaphore SVG
//
// Overlay plein cadre 1920x1080, fond TRANSPARENT, compteur verrouille en bas a gauche.
// Une seule composition parametree par `state` -> les 7 livrables du brief.
//
// Le brief exige "full-screen transparent overlays, not cropped tightly" : le compteur est
// donc positionne ICI, a sa place definitive, et le reste du cadre reste vide. La cliente
// depose le fichier dans CapCut, il se cale plein cadre, le compteur ne bouge jamais d'un pixel.

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from "remotion";
import { ChillMeterDevice, DEVICE_W, DEVICE_H, type MetalFinish } from "./ChillMeterDevice";
import { GivreDefs, CRISTAUX, ECLATS, FLEURS } from "./GivrePlanche";

export type MeterState =
  | "entrance"
  | "idle"
  | "fill25"
  | "fill50"
  | "fill75"
  | "fill100";

// Placement recalibre sur la capture de reference envoyee par Abigail (retour Jalon 1, 2026-09-01) :
// meter reduit, colle bas-gauche sous la fenetre du clip, marge de securite avec la video.
// SCALE au maximum exploitable compte tenu de l'espace vertical disponible sous la fenetre.
const POS_X = 198;
const POS_Y = 670;
const SCALE = 0.373595;

/** Effet de bord bas (75%) : brume + particules qui montent. */
const BottomEdgeEffect: React.FC<{ intensity: number; frame: number; fps: number }> = ({
  intensity,
  frame,
  fps,
}) => {
  if (intensity <= 0.001) return null;
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* brume froide montant du bas */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 210,
          background:
            "linear-gradient(to top, rgba(77,184,255,0.3), rgba(143,228,255,0.16) 45%, rgba(143,228,255,0) 100%)",
          opacity: intensity,
        }}
      />
      {/* liseré givré sur l'arête basse */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 54,
          background:
            "linear-gradient(to top, rgba(234,247,255,0.75), rgba(234,247,255,0) 100%)",
          opacity: intensity * 0.9,
          filter: "blur(3px)",
        }}
      />
      {/* Particules qui montent du bas — de vrais flocons, jamais des points ronds.
          Brief p.8 : a 75 %, l'effet est sur le BORD BAS uniquement, le reste du cadre
          doit rester clair. On borne donc leur remontee au tiers inferieur. */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <GivreDefs />
        {Array.from({ length: 26 }).map((_, i) => {
          const seed = i + 1;
          const speed = 20 + Math.abs(Math.sin(seed * 3.1)) * 30;
          const phase = ((t * speed) / 100 + Math.abs(Math.sin(seed * 7.7))) % 1;
          const x = (Math.abs(Math.sin(seed * 12.9898)) * 1920 + Math.sin(t * 0.7 + seed) * 18) % 1920;
          // remontee bornee : 320 px max au-dessus du bord bas
          const y = 1080 - phase * 320;
          const size = 13 + Math.abs(Math.sin(seed * 5.4)) * 17;
          const op = intensity * (1 - phase) * (0.3 + Math.abs(Math.sin(seed * 2.2)) * 0.45);
          if (op < 0.02) return null;
          const piece = CRISTAUX[i % CRISTAUX.length];
          const rot = (t * (6 + (seed % 4) * 5) + seed * 31) % 360;
          return (
            <g key={i} transform={`rotate(${rot} ${x + size / 2} ${y + size / 2})`} opacity={op}>
              <use href={`#${piece}`} x={x} y={y} width={size} height={size} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Effet plein ecran (100%) : 4 bords givres + onde de choc + neige. */
const FullChillEffect: React.FC<{ progress: number; frame: number; fps: number }> = ({
  progress,
  frame,
  fps,
}) => {
  if (progress <= 0.001) return null;
  const t = frame / fps;

  // Onde de choc : part du compteur, monte vers la droite, s'estompe avant le visage.
  const originX = POS_X + (DEVICE_W * SCALE) / 2;
  const originY = POS_Y + (DEVICE_H * SCALE) / 2;
  const waveR = interpolate(progress, [0, 1], [0, 1750], { extrapolateRight: "clamp" });
  const waveOp = interpolate(progress, [0, 0.15, 0.62, 1], [0, 0.72, 0.34, 0], {
    extrapolateRight: "clamp",
  });

  const edge = Math.min(1, progress * 1.7);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* --- givre sur les 4 bords --- */}
      {/* Bandes de bord COURTES et concentrees : le centre du cadre (son visage) reste clair.
          Regle du brief p.9 : "My face should never be heavily obscured." */}
      {(
        [
          ["to top", "bottom", 150],
          ["to bottom", "top", 96],
          ["to right", "left", 128],
          ["to left", "right", 104],
        ] as const
      ).map(([dir, side, size], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...(side === "bottom" || side === "top"
              ? { left: 0, right: 0, [side]: 0, height: size }
              : { top: 0, bottom: 0, [side]: 0, width: size }),
            background: `linear-gradient(${dir}, rgba(234,247,255,0.5), rgba(143,228,255,0.14) 38%, rgba(143,228,255,0) 100%)`,
            opacity: edge,
          }}
        />
      ))}

      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <GivreDefs />
        {/* GIVRE ACCROCHE AUX BORDS — vraies pieces dessinees (planche Fable+GPT).
            Remplace les heptagones generes par boucle : ils se lisaient comme
            "des petits carres blancs qui arrivent de nulle part". */}
        {Array.from({ length: 54 }).map((_, i) => {
          const seed = i + 1;
          const th = Math.abs(Math.sin(seed * 2.9)) * 0.5;
          const local = Math.max(0, Math.min(1, (progress - th) / 0.4));
          if (local <= 0) return null;

          const side = i % 4;
          const p = Math.abs(Math.sin(seed * 4.7));
          const inset = Math.abs(Math.sin(seed * 3.3));

          // Fleurs de givre : ancrees au bord, elles POUSSENT vers l'interieur.
          // Cristaux/eclats : en derive, plus petits, plus nombreux.
          const isFleur = i % 7 === 0;
          const piece = isFleur
            ? FLEURS[i % FLEURS.length]
            : i % 5 === 0
            ? ECLATS[i % ECLATS.length]
            : CRISTAUX[i % CRISTAUX.length];

          // grandes pieces sur les bords, plus petites vers le centre
          const size = isFleur
            ? 150 + inset * 110
            : (i % 3 === 0 ? 46 + inset * 40 : 20 + inset * 22);

          let x = 0;
          let y = 0;
          let rot = 0;
          if (side === 0) {        // bas
            x = p * 1920 - size / 2;
            y = 1080 - size * (isFleur ? 1 : 0.55) - inset * 26;
            rot = isFleur ? 0 : seed * 37;
          } else if (side === 1) { // haut
            x = p * 1920 - size / 2;
            y = -size * 0.35 + inset * 30;
            rot = isFleur ? 180 : seed * 53;
          } else if (side === 2) { // gauche
            x = -size * 0.3 + inset * 26;
            y = p * 1080 - size / 2;
            rot = isFleur ? 90 : seed * 71;
          } else {                 // droite
            x = 1920 - size * 0.7 - inset * 26;
            y = p * 1080 - size / 2;
            rot = isFleur ? 270 : seed * 29;
          }

          // le brief : ne jamais masquer lourdement son visage (zone droite-haute)
          const faceGuard = x > 1150 && y < 640 ? 0.3 : 1;

          return (
            <g
              key={i}
              transform={`rotate(${rot} ${x + size / 2} ${y + size / 2})`}
              opacity={local * (isFleur ? 0.72 : 0.85) * faceGuard}
            >
              <use href={`#${piece}`} x={x} y={y} width={size} height={size} />
            </g>
          );
        })}

        {/* Onde de choc gelee — anneaux nets, SANS blur.
            (Un gros cercle floute est rendu comme un rectangle opaque en headless : artefact vu au 1er rendu.) */}
        {waveR > 2 && (
          <>
            <circle
              cx={originX}
              cy={originY}
              r={waveR}
              fill="none"
              stroke="#bfe9ff"
              strokeWidth={14}
              opacity={waveOp * 0.32}
            />
            <circle
              cx={originX}
              cy={originY}
              r={waveR * 0.965}
              fill="none"
              stroke="#ffffff"
              strokeWidth={4}
              opacity={waveOp * 0.8}
            />
            <circle
              cx={originX}
              cy={originY}
              r={waveR * 0.9}
              fill="none"
              stroke="#8fe4ff"
              strokeWidth={2}
              opacity={waveOp * 0.45}
            />
          </>
        )}

        {/* NEIGE — de VRAIS flocons dessines, plus de points ronds.
            Regle du brief p.9 : "The strongest animation should stay concentrated along the
            bottom half, the outer edges, and the left/center portions of the frame."
            -> densite et taille decroissent avec la hauteur ; le haut-droite (son visage)
            ne recoit que quelques flocons tres discrets ("a small amount CAN pass over my face"). */}
        {Array.from({ length: 64 }).map((_, i) => {
          const seed = i + 1;
          const th = Math.abs(Math.sin(seed * 1.7)) * 0.3;
          const local = Math.max(0, Math.min(1, (progress - th) / 0.5));
          if (local <= 0) return null;

          // derive : lente, portee par la rafale vers la droite, chute douce
          const drift = t * (30 + Math.abs(Math.sin(seed * 2.4)) * 70);
          const x = (Math.abs(Math.sin(seed * 12.9898)) * 2040 + drift) % 2040 - 60;
          const fall = t * (14 + Math.abs(Math.sin(seed * 4.1)) * 34);
          const baseY = Math.abs(Math.sin(seed * 78.233)) * 1080;
          const y = (baseY + fall) % 1140 - 60;

          // hauteur relative : 0 en haut, 1 en bas -> pilote densite ET taille
          const depth = Math.min(1, Math.max(0, y / 1080));

          // le tiers superieur ne garde qu'un flocon sur trois, et minuscule
          if (depth < 0.34 && i % 3 !== 0) return null;

          const size = (depth < 0.34 ? 9 : 15 + depth * 34) + Math.abs(Math.sin(seed * 5.9)) * 12 * depth;
          const piece = CRISTAUX[i % CRISTAUX.length];
          const rot = (t * (7 + (seed % 5) * 4) + seed * 47) % 360;

          // zones protegees : son visage (droite-haut), la fenetre du clip (gauche)
          // et LE COMPTEUR lui-meme — c'est l'instrument qu'on doit pouvoir lire.
          const faceGuard = x > 1150 && y < 640 ? 0.22 : 1;
          const clipGuard = x < 880 && y > 230 && y < 730 ? 0.3 : 1;
          const meterGuard =
            x > POS_X - 30 && x < POS_X + DEVICE_W * SCALE + 30 && y > POS_Y - 30 ? 0 : 1;

          const op = local * (0.2 + depth * 0.55) * faceGuard * clipGuard * meterGuard;
          if (op < 0.02) return null;

          return (
            <g key={i} transform={`rotate(${rot} ${x + size / 2} ${y + size / 2})`} opacity={op}>
              <use href={`#${piece}`} x={x} y={y} width={size} height={size} />
            </g>
          );
        })}

      </svg>
    </AbsoluteFill>
  );
};

export const ChillMeterOverlay: React.FC<{ state: MeterState; metal?: MetalFinish }> = ({
  state,
  metal = "flat",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- Entree : arrive de la gauche en diagonale, atterrit, rebondit, s'allume ----
  const landSpring = spring({ frame, fps, config: { damping: 11, stiffness: 92, mass: 0.9 } });
  const isEntrance = state === "entrance";

  const entX = isEntrance ? interpolate(landSpring, [0, 1], [-720, 0]) : 0;
  const entY = isEntrance ? interpolate(landSpring, [0, 1], [-300, 0]) : 0;

  // petit rebond apres l'impact (frame ~26)
  const IMPACT = 26;
  const bounce = isEntrance
    ? interpolate(frame, [IMPACT, IMPACT + 5, IMPACT + 11, IMPACT + 17], [0, -17, 5, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad),
      })
    : 0;

  // allumage juste apres l'atterrissage
  const powerOn = isEntrance
    ? interpolate(frame, [IMPACT + 8, IMPACT + 22], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  // ---- Niveau de chill selon l'etat ----
  let chill = 0;
  let frost = 0;
  let bottomEdge = 0;
  let fullChill = 0;

  const RISE = 42; // duree de montee du gauge (1.4s)

  if (state === "fill25") {
    chill = interpolate(frame, [6, 6 + RISE], [0, 25], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (state === "fill50") {
    chill = interpolate(frame, [6, 6 + RISE], [25, 50], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    // le givre pousse sur l'appareil, en retard sur le gauge
    frost = interpolate(frame, [6 + RISE * 0.5, 6 + RISE + 34], [0, 0.62], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (state === "fill75") {
    chill = interpolate(frame, [6, 6 + RISE], [50, 75], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    frost = interpolate(frame, [0, 6 + RISE + 28], [0.62, 0.84], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bottomEdge = interpolate(frame, [6 + RISE * 0.7, 6 + RISE + 30], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (state === "fill100") {
    chill = interpolate(frame, [6, 6 + RISE], [75, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
    frost = interpolate(frame, [0, 6 + RISE + 20], [0.84, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    bottomEdge = 1;
    // le payoff se declenche quand le gauge touche 100
    fullChill = interpolate(frame, [6 + RISE, 6 + RISE + 46], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  }

  return (
    // Fond TRANSPARENT — aucune couleur de fond, c'est ce qui permet l'export alpha.
    <AbsoluteFill>
      <BottomEdgeEffect intensity={bottomEdge} frame={frame} fps={fps} />

      <div
        style={{
          position: "absolute",
          left: POS_X + entX,
          top: POS_Y + entY + bounce,
          width: DEVICE_W * SCALE,
          height: DEVICE_H * SCALE,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        <ChillMeterDevice
          chill={chill}
          frost={frost}
          powerOn={powerOn}
          frame={frame}
          fps={fps}
          metal={metal}
        />
      </div>

      <FullChillEffect progress={fullChill} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
