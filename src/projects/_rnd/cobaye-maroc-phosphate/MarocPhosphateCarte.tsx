// MarocPhosphateCarte.tsx — COBAYE beat carte Maroc phosphate (RÉVÉLER)
// Direction validée : monde s'estompe -> bordure or se trace -> texture phosphate
// envahit le Maroc (Sahara occ. inclus) -> plateau, halo respire.
//
// Composant moteur : ResourceTextureFill (resource "phosphate", iso MAR,
// boundaryIsos ["ESH"]). NON RECODÉ — piloté uniquement par props + overlays.
//
// Camera : framing serré sur le Maroc (états B/C/D = 195f sur 240). Le moteur
// n'expose que le bearing en frame-driven (jumpTo) — pas de push zoom interne ;
// le "resserrement" du storyboard n'est donc pas reproduit (divergence assumée,
// recodage du moteur interdit).

import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ResourceTextureFill } from "../../_shared/mapbox/ResourceTextureFill";

const GOLD = "#c8a951";
const NAVY = "#16213a";

// Audio : segment "Sous le sol marocain dort 70%... phosphate" ~9.58s
const AUDIO_START_SEC = 9.58;
const FPS = 30;

// Halo qui respire (état D, plateau) — overlay radial centré sur le Maroc.
const PhosphateHalo: React.FC = () => {
  const frame = useCurrentFrame();
  // Apparition douce après le remplissage texture (~185f), puis respiration.
  const appear = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breathe = 0.5 + 0.5 * Math.sin((frame / FPS) * 1.4);
  const intensity = appear * (0.18 + 0.12 * breathe);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 38% 55% at 46% 50%, rgba(200,169,81,${intensity.toFixed(
            3
          )}) 0%, rgba(200,169,81,0) 60%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const MarocPhosphateCarte: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <ResourceTextureFill
        // Framing serré sur le Maroc + Sahara occidental (états révélateurs)
        center={[-7, 28.5]}
        baseZoom={4.5}
        basePitch={0}
        bearingStart={-2}
        bearingEnd={2}
        countries={[
          {
            iso: "MAR",
            boundaryIsos: ["ESH"],
            resource: "phosphate",
            at: 110, // état C : la texture envahit le Maroc
            fadeFrames: 60,
            opacity: 0.9,
            borderColor: GOLD,
          },
        ]}
        // Pays secondaires :
        //  - MAR (état B, at:45) : Maroc s'allume en ivoire + bordure OR se trace
        //    AVANT la texture (qui arrive à 110 via la couche `countries`).
        //  - voisins (at:45) : contexte gris qui s'estompe = monde dimmé.
        secondary={[
          { iso: "MAR", color: "#f2ebd9", borderColor: GOLD, at: 45 },
          // ESH (Sahara occ.) : meme ivoire que le Maroc -> territoire unifie
          { iso: "ESH", color: "#f2ebd9", borderColor: GOLD, at: 45 },
          { iso: "ESP", color: "#3a3f4a", at: 45 },
          { iso: "DZA", color: "#3a3f4a", at: 45 },
          { iso: "PRT", color: "#3a3f4a", at: 45 },
          { iso: "MRT", color: "#3a3f4a", at: 45 },
        ]}
      >
        <PhosphateHalo />
      </ResourceTextureFill>

      <Audio
        src={staticFile("souverain/maroc-batteries/audio/narration-maroc-v3.mp3")}
        startFrom={Math.round(AUDIO_START_SEC * FPS)}
        volume={1}
      />
    </AbsoluteFill>
  );
};

export const MAROC_PHOSPHATE_FRAMES = 240;
