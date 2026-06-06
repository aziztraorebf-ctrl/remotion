/**
 * WarMapOverlayExplicatif — overlay EXPLICATIF generique (type R2).
 *
 * Version redesignee Session A (2026-06-06) sur direction Aziz :
 * - CENTRE comme l'overlay donnee (meme gravite visuelle)
 * - FIGE l'action pendant sa duree (l'action s'arrete, le texte s'installe, reprend)
 * - Portrait civil optionnel en intro : introduit le visage avant qu'il
 *   apparaisse sur la carte, cree une continuite narrative (on comprend
 *   pourquoi le jeton sera pose sur la carte ensuite).
 *
 * Regle R2 : fond SEMI-TRANSPARENT cream (pas solide — la carte reste visible
 * en silhouette derriere, ce qui rappelle qu'on parle de ce lieu).
 * Regle R4 : voile cream clair, jamais noir.
 * Regle R3 : l'action est figee pendant l'overlay (gestion dans WarMapEngine
 * via EPIC_WINDOWS — ajouter cette fenetre dans le tableau).
 *
 * Usage :
 *   Dans EPIC_WINDOWS :
 *     { start: REFUGEE_TEXT_START, hold: REFUGEE_TEXT_HOLD, kind: "explicatif",
 *       data: { title: "L'exode", text: "Des millions fuient...", portrait: "portrait-civil" } }
 *   Puis dans le JSX :
 *     <WarMapOverlayExplicatif startFrame={X} holdFrames={Y}
 *       title="L'exode" text="Des millions fuient vers les frontieres"
 *       portrait="portrait-civil" />
 */

import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const ATLAS = {
  cream:     "#F2E5C8",
  ink:       "#3A2A18",
  gold:      "#D4A574",
} as const;

type Props = {
  startFrame: number;
  holdFrames: number;
  title: string;           // ex: "L'exode"
  text: string;            // ex: "Des millions fuient vers les frontieres"
  portrait?: string;       // nom du PNG dans public/_shared/sprites/warmap/ (sans extension)
                           // ex: "portrait-civil". Si absent : overlay texte seul.
  source?: string;         // ligne source optionnelle
};

export const WarMapOverlayExplicatif: React.FC<Props> = ({
  startFrame, holdFrames,
  title, text, portrait, source,
}) => {
  const frame = useCurrentFrame();
  const local = frame - startFrame;
  if (local < 0 || local > holdFrames) return null;

  const op = Math.min(
    interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(local, [holdFrames - 14, holdFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  if (op <= 0) return null;

  // montee de la plaque (meme ressort que WarMapDataOverlay)
  const rise = interpolate(local, [0, 18], [50, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.9, 0.25, 1),
  });

  // portrait : apparait apres la plaque (decalage 8 frames) pour que le texte
  // soit lu d'abord, puis le visage confirme
  const portraitOp = portrait
    ? interpolate(local, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;
  const portraitScale = portrait
    ? interpolate(local, [8, 22], [0.75, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
        easing: Easing.bezier(0.2, 0.9, 0.25, 1),
      })
    : 0;

  return (
    <AbsoluteFill style={{ opacity: op, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      {/* voile semi-transparent cream (R4 + R2 : rappelle le lieu, pas de noir) */}
      <AbsoluteFill style={{ background: `${ATLAS.cream}72` }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 28, transform: `translateY(${rise}px)`, width: "100%", maxWidth: 860,
        }}>

          {/* portrait civil (intro soft — le visage avant le jeton sur la carte) */}
          {portrait && (
            <div style={{
              opacity: portraitOp,
              transform: `scale(${portraitScale})`,
              width: 200, height: 200, borderRadius: "50%",
              overflow: "hidden", flexShrink: 0,
              border: `4px solid ${ATLAS.ink}`,
              boxShadow: `0 0 0 3px ${ATLAS.cream}, 0 12px 40px rgba(0,0,0,0.4)`,
              background: ATLAS.cream,
            }}>
              <img
                src={staticFile(`_shared/sprites/warmap/${portrait}.png`)}
                style={{ width: "120%", height: "120%", objectFit: "cover",
                         objectPosition: "50% 16%", position: "relative",
                         left: "-10%", top: "-6%" }}
              />
            </div>
          )}

          {/* plaque explicatif — fond semi-transparent (pas solide : R2) */}
          <div style={{
            background: `${ATLAS.cream}E8`,
            border: `2.5px solid ${ATLAS.ink}`,
            borderRadius: 10,
            padding: "28px 40px",
            textAlign: "center",
            width: "100%",
            boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
          }}>
            {/* separateur or */}
            <div style={{ width: 48, height: 3, background: ATLAS.gold, margin: "0 auto 18px", borderRadius: 2 }} />

            <div style={{
              fontSize: 20, letterSpacing: 4, fontWeight: 700,
              textTransform: "uppercase", opacity: 0.6, color: ATLAS.ink,
            }}>
              {title}
            </div>

            <div style={{
              fontSize: 36, fontWeight: 600, marginTop: 10,
              color: ATLAS.ink, lineHeight: 1.25,
            }}>
              {text}
            </div>

            {source && (
              <div style={{ fontSize: 15, marginTop: 16, opacity: 0.5, fontStyle: "italic", color: ATLAS.ink }}>
                {source}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
