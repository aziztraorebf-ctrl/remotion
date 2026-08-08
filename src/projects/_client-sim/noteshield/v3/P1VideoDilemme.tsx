// P1 (V3) — "Le dilemme, incarne." Frame 4-457 absolu (453f relatif, ce composant recoit un
// frame LOCAL 0-453 via sa Sequence parente). Plan unique MiniMax H3 (p1c, genere via Comfy
// Cloud le 2026-08-08, cf STATUS.md) : badge visible passe calmement, sans badge reste bloque --
// mecanisme plus riche que le split descente/remontee (P1a/P1b, retires). Remplace le flux de
// traits abstrait de la Direction B -- cf STORYBOARD-V3-MIX-INCARNE.md § P1.
//
// REFONTE 2026-08-08 (retour Aziz) : P2 (slider) et P3 (ligne calme) retires de la composition
// -- P1 raconte deja tout le dilemme via la video H3, ces panneaux etaient redondants. Les 177f
// liberees vont ICI (453f au lieu de 276f) -- fenetre elargie couvre maintenant tout l'arc "on
// ralentit tout le monde / on croise les doigts / la securite a enfin le discernement" (verifie
// sur narration.alignment.json, le mot "NorthShield" du panneau suivant tombe pile a la frame
// de sortie). Le compteur de verifications, juge "trop petit/discret, presque manque" par Aziz,
// est agrandi significativement (police + container + fond semi-transparent qui le detache du
// decor, registre mono garde -- pas un gros HUD criard).
//
// Clip source : 12.25s (367f a 30fps) -- fenetre P1 = 453f (15.1s). Le clip est maintenant PLUS
// COURT que la fenetre -> playbackRate RALENTI (pas d'acceleration agressive, decision explicite
// du brief). Facteur = 367/453 ~= 0.81 (leger ralenti, pas de coupure ni d'etirement du timing).
//
// Resolution source SD (864x480, pas 2K comme P5/P6) -- accepte tel quel par decision Aziz
// (2026-08-08), pas de regeneration/upscale pour l'instant.
//
// OffthreadVideo muted obligatoire (R9/R10 -- pas d'audio natif du clip, la narration est la
// seule piste audio ; le clip source a son propre SFX mecanique, non utilise ici). Compteur mono
// discret en coin (overlay Remotion, jamais genere dans le plan H3 -- regle anti-texte-dans-clip-video).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { NS_COLORS } from "../ui/theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

const P1_DURATION = 453; // frames locales (fenetre elargie, 30fps)
const CLIP_SOURCE_FRAMES = 367; // 12.25s a 30fps
const PLAYBACK_RATE = CLIP_SOURCE_FRAMES / P1_DURATION; // ~0.81x (ralenti leger)

const VideoFrame: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo
      src={src}
      muted
      playbackRate={PLAYBACK_RATE}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

// Compteur "+1 verification" -- incremente doucement, un tick par silhouette qui passe le
// controle. Aziz : "presque manque le compteur en le regardant" -> agrandi significativement
// (police 16->30, container avec fond semi-transparent qui le detache du decor, pastille plus
// grande) tout en restant dans le registre mono/discret de la charte (pas un gros HUD criard --
// fond navy a faible opacite + bordure fine cyan, pas de bloc plein criard).
const VerificationCounter: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [10, 24], [0, 1], clamp);
  // 6 ticks repartis sur la duree elargie du panneau (453f, ~15.1s) -- pas lie au contenu exact
  // du clip (pas de dependance fragile a un instant precis de la video), juste un rythme
  // regulier credible sur toute la fenetre.
  const tickFrames = [40, 100, 165, 230, 300, 370];
  let count = 0;
  for (const tf of tickFrames) if (frame >= tf) count++;

  const lastTick = tickFrames.filter((tf) => frame >= tf).slice(-1)[0];
  const bump = lastTick !== undefined
    ? interpolate(frame - lastTick, [0, 6, 18], [1, 1.22, 1], clamp)
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        bottom: 110,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "18px 28px",
        borderRadius: 14,
        background: "rgba(10, 22, 40, 0.62)",
        border: `1px solid ${NS_COLORS.cyanDim}`,
        fontFamily: "'IBM Plex Mono', monospace",
        color: NS_COLORS.ivory,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 999,
          background: NS_COLORS.cyan,
          boxShadow: `0 0 16px ${NS_COLORS.cyan}`,
        }}
      />
      <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: 1.5, transform: `scale(${bump})` }}>
        +{count} vérification{count > 1 ? "s" : ""}
      </div>
    </div>
  );
};

export const P1VideoDilemme: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <VideoFrame src={staticFile("_client-sim/noteshield/video/p1c-badge-selectif-barre-mecanique-h3.mp4")} />

      <VerificationCounter frame={frame} />

      {/* Fondu de sortie avant le cut vers P4, pour eviter un cut sec sur un plan filme. */}
      <AbsoluteFill
        style={{
          background: "#0A1628",
          opacity: interpolate(frame, [P1_DURATION - 18, P1_DURATION], [0, 1], clamp),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
