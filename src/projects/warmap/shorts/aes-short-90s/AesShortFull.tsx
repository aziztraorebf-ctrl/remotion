// AesShortFull — vidéo COMPLETE 92s (2756f @30fps). Assemble Part1 (0-36s) + Part2 (36-92s) en une
// seule composition. Audio UNIQUE sur toute la duree. Les 2 parties sont rendues sans audio (noAudio).
//
// Transition a 36s : Part1 finit sur le cadre large (trio+Libye), Part2 demarre sur le trio zoome (Libye
// retiree). On fait un CROSSFADE court (~14f) entre les deux -> l'oeil accepte le leger changement de
// cadrage comme une transition douce (pas un saut de zoom sec).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AesShortPart1 } from "./AesShortPart1";
import { AesShortPart2 } from "./AesShortPart2";

const FPS = 30;
const SPLIT = 36 * FPS; // 1080 : fin Part1 / debut Part2
const XFADE = 14; // frames de crossfade a la jointure
// +1.5s de marge apres la fin de la narration (91.86s) : "lien en description" etait coupe trop court.
const TOTAL = Math.round(93.4 * FPS);
const s = (sec: number) => Math.round(sec * FPS);

// SFX ponctuels (timing Whisper reel) : ping sur les traces de contour + climax naissance AES + ressources.
// Pas de SFX sur rupture CEDEAO/FRACTURE (choix Aziz : porte par la musique+visuel seul, sauf FRACTURE = snap).
const SFX_PING = [s(5.0), s(5.7), s(6.4), s(14.3), s(56.5)]; // trio + Libye qui se tracent + naissance AES (remplace le whoosh)
const SFX_RESOURCE = [s(66.4), s(69.2), s(70.2)]; // or / uranium / petrole
// etoile militaire apparait a prog>0.6 dans l'anneau (18f de fermeture) -> +0.36s apres le debut du coup
const SFX_DING = [s(24.5), s(38.9) + 11, s(39.6) + 11, s(40.3) + 11]; // France + les 3 etoiles militaires (coups d'Etat)

export const AesShortFull: React.FC = () => {
  const frame = useCurrentFrame();

  // opacites de crossfade autour de SPLIT
  const p1Op = interpolate(frame, [SPLIT - XFADE, SPLIT], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const p2Op = interpolate(frame, [SPLIT - XFADE, SPLIT], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1e2d52" }}>
      {/* AUDIO unique */}
      <Audio src={staticFile("_shared/audio/sahel-warmap/short-90s-v1.mp3")} />

      {/* MUSIQUE — reprise de la video longue War-Map AES (music-D-montee-maitrisee), volume bas sous la voix */}
      <Audio
        src={staticFile("_shared/audio/sahel-warmap/music/music-D-montee-maitrisee.mp3")}
        volume={0.1}
      />

      {/* SFX ping sur les traces de contour (trio + Libye) + naissance AES (remplace l'ancien whoosh) */}
      {SFX_PING.map((f) => (
        <Sequence key={`ping-${f}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("_shared/sfx/camera/sfx-map-ping.mp3")} volume={0.5} />
        </Sequence>
      ))}

      {/* Ding sur l'apparition de la France + des 3 etoiles militaires (coups d'Etat) */}
      {SFX_DING.map((f) => (
        <Sequence key={`ding-${f}`} from={f} durationInFrames={20}>
          <Audio src={staticFile("_shared/sfx/ui/blip-bubble.mp3")} volume={0.45} />
        </Sequence>
      ))}

      {/* FRACTURE trio/CEDEAO — les 2 blocs s'ecartent (~48.8s) */}
      <Sequence from={s(48.8)} durationInFrames={30}>
        <Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.5} />
      </Sequence>

      {/* CLIMAX — naissance de l'AES (sceau, ~57.3s, settle) */}
      <Sequence from={s(57.3)} durationInFrames={30}>
        <Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.6} />
      </Sequence>

      {/* Apparitions ressources (or / uranium / petrole) */}
      {SFX_RESOURCE.map((f) => (
        <Sequence key={`res-${f}`} from={f} durationInFrames={24}>
          <Audio src={staticFile("_shared/sfx/ui/plate-pop.mp3")} volume={0.4} />
        </Sequence>
      ))}

      {/* Count-up 60 ans (74.8-77.6s) — tick rapide pendant que le chiffre monte (loop, le SFX source fait 2s) */}
      <Sequence from={s(74.8)} durationInFrames={s(77.6) - s(74.8) + 6}>
        <Audio src={staticFile("_shared/sfx/data/counter-tick.mp3")} volume={0.35} loop />
      </Sequence>

      {/* PART 1 (0 -> 36s + petit debord pour le crossfade) */}
      {frame < SPLIT + 2 && (
        <AbsoluteFill style={{ opacity: p1Op }}>
          <Sequence from={0} durationInFrames={SPLIT + XFADE}>
            <AesShortPart1 noAudio />
          </Sequence>
        </AbsoluteFill>
      )}

      {/* PART 2 (36s -> fin, +1.5s de marge apres "lien en description" pour laisser la voix respirer) */}
      {frame >= SPLIT - XFADE && (
        <AbsoluteFill style={{ opacity: p2Op }}>
          <Sequence from={SPLIT} durationInFrames={TOTAL - SPLIT}>
            <AesShortPart2 noAudio />
          </Sequence>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default AesShortFull;
