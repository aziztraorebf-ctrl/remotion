// P6 (V3) — "Berlin : l'anomalie." Frame 1229-1696 absolu (467f relatif, ce composant recoit un
// frame LOCAL 0-467). Plan bref MiniMax H3 (personnage DISTINCT de Sarah, registre neutre,
// 90f=3s retenues sur les 155f de contenu -- suffisant pour lire "quelqu'un d'autre, ailleurs",
// sans empieter sur le temps necessaire a la mecanique dashboard) PUIS bascule sur
// P5DashboardMorphBosse (direction-b, cascade+bosse 18->82 deja codee/validee, reutilisee telle
// quelle) -- cf STORYBOARD-V3 § P6, correction 2026-08-07 (le clip ne montre PAS Sarah).
//
// REFONTE 2026-08-08 (retour Aziz) : plan d'ouverture encadre en disque/anneau (meme pattern que
// P5VideoSarah, ui/DiscFrame.tsx) pour coherence visuelle entre les 2 plans filmes -- au lieu du
// plein-cadre precedent. Le curseur/cascade/bosse dans P5DashboardMorphBosse sont geres DANS ce
// composant reutilise (voir refonte separee de ce fichier -- curseur actif des le debut du plan
// dashboard, bosse plus vivante).
//
// Arbitrage duree (documente pour la prochaine session) : P5DashboardMorphBosse a un rythme
// interne propre qui totalise ~411f (13.7s) jusqu'a la fin du curseur de confirmation ; ce
// panneau ne lui laisse que 377f (12.57s) apres le clip d'intro. La bosse rouge (le beat le
// plus important, cf note jury "je n'ai meme pas vu le pic") tient tout entiere dans ce budget
// (elle se termine a 10.2s/306f interne) -- seule la toute fin (clic de confirmation du
// telephone) risque d'etre coupee net par la fin de Sequence. Accepte : la bosse prime.
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { P5DashboardMorphBosse } from "../direction-b/P5DashboardMorphBosse";
import { DiscContent, DiscRing } from "../ui/DiscFrame";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const CLIP_DUR = 90;
const CUT_FADE = 10;

const DISC_CENTER_X = 760;
const DISC_CENTER_Y = 560;
const RING_DRAW_START = 8;
const RING_DRAW_END = 78;

export const P6VideoInconnu: React.FC = () => {
  const frame = useCurrentFrame();

  const clipOpacity = interpolate(frame, [CLIP_DUR - CUT_FADE, CLIP_DUR], [1, 0], clamp);
  const dashOpacity = interpolate(frame, [CLIP_DUR - CUT_FADE, CLIP_DUR], [0, 1], clamp);
  const discOpacity = interpolate(frame, [0, 10], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <Sequence from={0} durationInFrames={CLIP_DUR + CUT_FADE} premountFor={30}>
        <AbsoluteFill style={{ opacity: clipOpacity }}>
          <DiscContent centerX={DISC_CENTER_X} centerY={DISC_CENTER_Y} opacity={discOpacity}>
            <OffthreadVideo
              src={staticFile("_client-sim/noteshield/video/p6-inconnu.mp4")}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </DiscContent>

          <svg
            viewBox="0 0 1920 1080"
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          >
            <DiscRing
              centerX={DISC_CENTER_X}
              centerY={DISC_CENTER_Y}
              drawStart={RING_DRAW_START}
              drawEnd={RING_DRAW_END}
            />
          </svg>
        </AbsoluteFill>
      </Sequence>

      {/* Sequence dediee : reset le frame local a 0 pour P5DashboardMorphBosse, qui pilote son
          propre timing interne depuis t=0 (cf ce composant, direction-b/). */}
      <Sequence from={CLIP_DUR - CUT_FADE} premountFor={30}>
        <AbsoluteFill style={{ opacity: dashOpacity }}>
          <P5DashboardMorphBosse />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
