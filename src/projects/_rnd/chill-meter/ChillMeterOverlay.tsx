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
import { ChillMeterDevice, DEVICE_W, DEVICE_H } from "./ChillMeterDevice";

export type MeterState =
  | "entrance"
  | "idle"
  | "fill25"
  | "fill50"
  | "fill75"
  | "fill100";

// Placement calque sur la capture du brief (p.7) : bas-gauche, sous la fenetre du clip.
const POS_X = 96;
const POS_Y = 616;
const SCALE = 0.52;

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
      {/* particules qui derivent vers le haut (deterministe) */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 46 }).map((_, i) => {
          const seed = i + 1;
          const speed = 26 + Math.abs(Math.sin(seed * 3.1)) * 44;
          const life = 4.4;
          const phase = (t * speed / 100 + Math.abs(Math.sin(seed * 7.7))) % 1;
          const x = ((Math.abs(Math.sin(seed * 12.9898)) * 1920) + Math.sin(t * 0.7 + seed) * 22) % 1920;
          const y = 1080 - phase * 420;
          const op = intensity * (1 - phase) * (0.35 + Math.abs(Math.sin(seed * 2.2)) * 0.5);
          const r = 1.6 + Math.abs(Math.sin(seed * 5.4)) * 3.1;
          return <circle key={i} cx={x} cy={y} r={r} fill="#cfefff" opacity={op} />;
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
        {/* cristaux de givre accroches aux bords */}
        {Array.from({ length: 70 }).map((_, i) => {
          const seed = i + 1;
          const th = Math.abs(Math.sin(seed * 2.9)) * 0.5;
          const local = Math.max(0, Math.min(1, (progress - th) / 0.4));
          if (local <= 0) return null;
          const side = i % 4;
          let cx = 0;
          let cy = 0;
          const p = Math.abs(Math.sin(seed * 4.7));
          if (side === 0) {
            cx = p * 1920;
            cy = 1080 - Math.abs(Math.sin(seed * 3.3)) * 60;
          } else if (side === 1) {
            cx = p * 1920;
            cy = Math.abs(Math.sin(seed * 3.3)) * 50;
          } else if (side === 2) {
            cx = Math.abs(Math.sin(seed * 3.3)) * 60;
            cy = p * 1080;
          } else {
            cx = 1920 - Math.abs(Math.sin(seed * 3.3)) * 60;
            cy = p * 1080;
          }
          const r = (7 + Math.abs(Math.sin(seed * 6.2)) * 22) * local;
          const pts: string[] = [];
          for (let k = 0; k < 7; k++) {
            const a = (k / 7) * Math.PI * 2;
            const wob = 0.5 + 0.5 * Math.abs(Math.sin(seed * 11.3 + k * 3.7));
            pts.push(`${cx + Math.cos(a) * r * wob},${cy + Math.sin(a) * r * wob}`);
          }
          return <polygon key={i} points={pts.join(" ")} fill="#eaf7ff" opacity={0.5 * local} />;
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

        {/* neige / particules portees par la rafale */}
        {Array.from({ length: 120 }).map((_, i) => {
          const seed = i + 1;
          const th = Math.abs(Math.sin(seed * 1.7)) * 0.3;
          const local = Math.max(0, Math.min(1, (progress - th) / 0.5));
          if (local <= 0) return null;
          const drift = t * (38 + Math.abs(Math.sin(seed * 2.4)) * 88);
          const x = (Math.abs(Math.sin(seed * 12.9898)) * 1920 + drift) % 1920;
          const baseY = Math.abs(Math.sin(seed * 78.233)) * 1080;
          const y = (baseY - t * (16 + Math.abs(Math.sin(seed * 4.1)) * 40) + 1080) % 1080;
          // le brief : le visage (droite/haut) ne doit jamais etre lourdement masque
          const faceGuard = x > 1180 && y < 620 ? 0.28 : 1;
          const r = 1.4 + Math.abs(Math.sin(seed * 5.9)) * 3.4;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="#e9f8ff"
              opacity={local * (0.3 + Math.abs(Math.sin(seed * 3.6)) * 0.5) * faceGuard}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const ChillMeterOverlay: React.FC<{ state: MeterState }> = ({ state }) => {
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
        />
      </div>

      <FullChillEffect progress={fullChill} frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
