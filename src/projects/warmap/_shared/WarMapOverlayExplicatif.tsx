/**
 * WarMapOverlayExplicatif — overlay EXPLICATIF generique (type R2 semi-transparent).
 *
 * Regle R2 (WARMAP-PLAYBOOK) : ce qui se passe sur la carte = fond SEMI-TRANSPARENT,
 * CENTRE (jamais en haut), coupe l'action le temps d'expliquer. L'action CONTINUE
 * derriere (pas de freeze — c'est la difference avec WarMapOverlayData).
 *
 * Extrait du bloc "texte-refugies" inline dans WarMapEngine (mode epic). Generalise :
 * titre + texte configurables, position verticale ajustable, wobble optionnel.
 *
 * Usage minimal :
 *   <WarMapOverlayExplicatif startFrame={400} holdFrames={180} fps={30}
 *     title="L'exode" text="Des millions fuient vers les frontieres" />
 *
 * Regle R4 : fond cream semi-transparent (jamais noir). Niveau opacity voile = 0
 * (pas de voile sur la carte — c'est ce qui distingue de l'overlay donnee).
 * Regle R3 : ne pas empiler ce composant avec des mouvements simultanees de sprites
 * sauf au moment-cle fort (exception R3 explicite).
 */

import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";

const ATLAS = {
  cream: "#F2E5C8",
  ink: "#3A2A18",
} as const;

type Props = {
  startFrame: number;
  holdFrames: number;
  fps?: number;
  title: string;           // ex: "L'exode" (UPPERCASE rendu via CSS)
  text: string;            // ex: "Des millions fuient vers les frontieres"
  topOffset?: number;      // position verticale px depuis le haut (defaut: 180)
  wobble?: boolean;        // rotation papier subtile (defaut: true)
  maxWidth?: number;       // px (defaut: 820)
};

const WOBBLE_AMP = 0.45; // degres max de rotation papier

export const WarMapOverlayExplicatif: React.FC<Props> = ({
  startFrame, holdFrames,
  title, text,
  topOffset = 180,
  wobble = true,
  maxWidth = 820,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  const op = Math.min(
    interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 14, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (op <= 0) return null;

  const slideIn = interpolate(local, [0, 16], [-28, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  // rotation papier subtile (sin base sur frame pour mouvement vivant)
  const rot = wobble ? Math.sin(frame * 0.018) * WOBBLE_AMP : 0;

  return (
    <div style={{
      position: "absolute",
      top: topOffset,
      left: 0, right: 0,
      display: "flex",
      justifyContent: "center",
      opacity: op,
      padding: "0 50px",
      transform: `translateY(${slideIn}px)`,
      pointerEvents: "none",
      fontFamily: "'Cormorant Garamond', Georgia, serif",
    }}>
      {/* PAS de voile sur la carte (R2 explicatif = semi-transparent = plaque seule,
          la carte reste entierement lisible derriere) */}
      <div style={{
        background: `${ATLAS.cream}E8`,  // semi-transparent : cream + alpha E8 (~91%)
        border: `2px solid ${ATLAS.ink}`,
        borderRadius: 8,
        padding: "14px 28px",
        color: ATLAS.ink,
        textAlign: "center",
        maxWidth,
        boxShadow: "0 6px 22px rgba(0,0,0,0.28)",
        transform: `rotate(${rot}deg)`,
      }}>
        <div style={{
          fontSize: 17, letterSpacing: 2.5, fontWeight: 700,
          textTransform: "uppercase", opacity: 0.65,
        }}>
          {title}
        </div>
        <div style={{ fontSize: 30, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>
          {text}
        </div>
      </div>
    </div>
  );
};
