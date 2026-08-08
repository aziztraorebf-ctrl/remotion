// P5 (V3) — "Sarah, Toronto : la friction zero." Frame 861-1229 absolu (368f relatif, ce
// composant recoit un frame LOCAL 0-368). Plan filme MiniMax H3 (Sarah, 155f = 5.17s de contenu
// reel) SUIVI d'un cut vers LaptopMockup/DashboardScreen riskCase="low" (React existant, data-
// driven, aucun changement de code necessaire sur cette brique) -- cf STORYBOARD-V3 § P5.
//
// REFONTE 2026-08-08 (retour Aziz, 2 correctifs) :
// 1. Sarah encadree en DISQUE + ANNEAU qui se referme (pattern FlowdeskAbstraitV4.tsx § Panneau
//    Resolution, voir ui/DiscFrame.tsx) au lieu du plein-cadre -- la donnee (annotations) vit
//    maintenant AUTOUR du disque plutot que dans un coin minuscule.
// 2. Annotations TORONTO / MACBOOK PRO / 09:14 : agrandies (18->24px), tenues plus longtemps
//    (l'ancienne version restait ~0.5s puis disparaissait, "trop petites et trop brefes" —
//    retour Aziz) et repositionnees autour du disque (droite, espacees verticalement, en dehors
//    de la zone occupee par l'anneau).
// 3. Bug LaptopMockup CORRIGE : `width * 1.3` faisait deborder le chassis hors cadre (2496px sur
//    canvas 1920px, seul l'ecran zoome restait visible). Fix : `width * 0.8` -- chassis entier
//    visible avec marge confortable de part et d'autre (verifie visuellement en mini-render).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { DashboardScreen } from "../ui/DashboardScreen";
import { DiscContent, DiscRing } from "../ui/DiscFrame";
import { LaptopMockup } from "../ui/LaptopMockup";
import { NS_COLORS } from "../ui/theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const CLIP_DUR = 155; // 5.17s de contenu H3 reel a 24fps, joue tel quel a 30fps (leger ralenti accepte)
const CUT_FADE = 10;

const DISC_CENTER_X = 760;
const DISC_CENTER_Y = 560;
const RING_DRAW_START = 12;
const RING_DRAW_END = 130;

// Annotations agrandies + tenues jusqu'a la fin du plan filme (plus de disparition prematuree) --
// alignees a droite du disque, colonne verticale espacee pour rester lisibles.
const AnnotationLine: React.FC<{ label: string; sub: string; delay: number; y: number }> = ({
  label,
  sub,
  delay,
  y,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 16, CLIP_DUR - 14, CLIP_DUR], [0, 1, 1, 0], clamp);
  const slideX = interpolate(frame, [delay, delay + 16], [-20, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 1300,
        top: y,
        opacity,
        transform: `translateX(${slideX}px)`,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: NS_COLORS.cyan, fontSize: 28, fontWeight: 600, letterSpacing: 2 }}>
        <div style={{ width: 26, height: 2, background: NS_COLORS.cyan, opacity: 0.8 }} />
        {label}
      </div>
      <div style={{ marginTop: 6, marginLeft: 38, color: NS_COLORS.ivoryMuted, fontSize: 17, letterSpacing: 1 }}>
        {sub}
      </div>
    </div>
  );
};

export const P5VideoSarah: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  const clipOpacity = interpolate(frame, [CLIP_DUR - CUT_FADE, CLIP_DUR], [1, 0], clamp);
  const dashboardOpacity = interpolate(frame, [CLIP_DUR - CUT_FADE, CLIP_DUR], [0, 1], clamp);
  const discOpacity = interpolate(frame, [0, 14], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <Sequence from={0} durationInFrames={CLIP_DUR + CUT_FADE} premountFor={30}>
        <AbsoluteFill style={{ opacity: clipOpacity }}>
          <DiscContent centerX={DISC_CENTER_X} centerY={DISC_CENTER_Y} opacity={discOpacity}>
            <OffthreadVideo
              src={staticFile("_client-sim/noteshield/video/p5-sarah-toronto.mp4")}
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

          <AnnotationLine label="TORONTO" sub="Bureau habituel" delay={20} y={340} />
          <AnnotationLine label="MACBOOK PRO" sub="Appareil reconnu" delay={40} y={430} />
          <AnnotationLine label="09:14" sub="Horaire cohérent" delay={60} y={520} />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={CLIP_DUR - CUT_FADE} premountFor={30}>
        <AbsoluteFill
          style={{
            opacity: dashboardOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LaptopMockup width={width * 0.8} screenContent={<DashboardScreen riskCase="low" />} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
