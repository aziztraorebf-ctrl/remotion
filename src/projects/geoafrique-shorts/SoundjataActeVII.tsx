import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useVideoConfig,
} from "remotion";
import { FPS, SCENES } from "./timing-soundjata";

// ============================================================
// Soundjata - Acte VII : Legende Vivante (griots)
// Duree totale : 13.22s (397 frames) — alignee exactement sur la fin de narration
// Format : 1080x1920 (vertical Short)
//
// Structure:
//   - Seedance clip (12.05s = 362 frames) @ 720x1280 native 9:16, scale-to-cover
//   - Loop tail muet (1.17s = 35 frames) rebouclant la queue contemplative du
//     clip (frames 240-362 : WIDE FINAL feu + etincelles, sans personnages)
//     pour couvrir le gap clip/narration sans cut visible sur noir.
//
// Audio strategy: keep-and-duck
//   Layer 1: Seedance audio @ 30% sur la Sequence principale seulement
//            (loop tail est mute pour ne pas relancer le mumble du griot)
//   Layer 2: ElevenLabs narration @ 100% sur toute la duree (trim narration-full.mp3)
//
// Narration window relative to full narration:
//   griots         108.98s - 111.70s
//   boucheOreille  111.70s - 116.64s
//   pasDeVersion   117.00s - 119.80s
//   chaqueGriot    120.30s - 122.20s
// Total narration span : 108.98s -> 122.20s = 13.22s
// ============================================================

// Clip Seedance
const CLIP_VIDEO =
  "assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte7-griots-v1.mp4";
const NARRATION_FULL =
  "assets/library/geoafrique/heros-oublies/soundjata/audio/narration-full.mp3";

// Clip Seedance effective duration : 12.05s (720 frames)
const CLIP_DURATION_S = 12.05;
const CLIP_DURATION_FRAMES = Math.round(CLIP_DURATION_S * FPS); // 362 frames

// Narration window (derive des scenes de timing-soundjata.ts)
// griots.start = 108.98s absolue dans narration-full.mp3
// chaqueGriot.end = 122.20s absolue -> 13.22s total
const NARRATION_START_S_ABS = 108.98;
const NARRATION_END_S_ABS = 122.20;

// Bornes internes a l'Acte VII (frame 0 = debut de la composition)
// griots.start dans timing-soundjata.ts = s(108.98) = 3269 frames absolute
// On aligne localement en soustrayant NARRATION_START_S_ABS pour tout relatif
const toLocalFrames = (absSceneFrame: number) =>
  absSceneFrame - Math.round(NARRATION_START_S_ABS * FPS);

// Verification coherence des scenes de l'Acte VII (griots -> chaqueGriot)
const LOCAL_GRIOTS_START = toLocalFrames(SCENES.griots.start); // = 0
const LOCAL_CHAQUE_GRIOT_END = toLocalFrames(SCENES.chaqueGriot.end); // = 13.22 * 30 ~ 397

// Duree totale de la composition : exactement la narration (13.22s = 397 frames)
// Le clip Seedance (12.05s = 362 frames) est complete par une boucle muette de la
// queue du clip (frames 240-362 rebouclees) pour couvrir les 35 frames restantes.
export const SOUNDJATA_ACTE_VII_FRAMES = LOCAL_CHAQUE_GRIOT_END; // 397 frames (~13.22s)

// Loop tail parameters
// Bascule reelle vers le WIDE FINAL (feu + baobab + lune, aucun personnage)
// verifiee par binaire-search ffmpeg : t=10.45s = encore MEDIUM,
// t=10.5s = WIDE FINAL. Bascule exacte ~t=10.47s ~ frame 314 du clip source.
// LOOP_SOURCE_START_FRAME = 315 : safe margin d'1 frame apres la bascule.
// Segment source stable : frames 315-362 = 47 frames de WIDE FINAL contemplatif.
// Boucle a remplir : 35 frames (35/47 = 74% du segment, pas de bouclage complet).
const LOOP_SOURCE_START_FRAME = 315;
const LOOP_DURATION_FRAMES = SOUNDJATA_ACTE_VII_FRAMES - CLIP_DURATION_FRAMES; // 35 frames

// Narration audio trim bounds (en frames absolues dans narration-full.mp3)
const NARRATION_START_FRAME_ABS = Math.round(NARRATION_START_S_ABS * FPS);
const NARRATION_END_FRAME_ABS = Math.round(NARRATION_END_S_ABS * FPS);
const NARRATION_DURATION_FRAMES =
  NARRATION_END_FRAME_ABS - NARRATION_START_FRAME_ABS;

export const SoundjataActeVII: React.FC = () => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* =================== VIDEO CLIP + AMBIENT AUDIO (ducked) =================== */}
      <Sequence
        from={0}
        durationInFrames={CLIP_DURATION_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_VIDEO)}
            muted
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          />
          {/* Seedance atmospheric audio ducked to 30% */}
          <Audio src={staticFile(CLIP_VIDEO)} volume={0.3} />
        </AbsoluteFill>
      </Sequence>

      {/* =================== LOOP TAIL (silent) =================== */}
      {/*
        Apres la fin naturelle du clip (frame 362), le WIDE FINAL contemplatif
        (feu + etincelles, pas de personnages, pas de dialogue) est reboucle
        sur 35 frames (1.17s) pour couvrir la fin de narration a 13.22s.
        Audio muet : eviter que le mumble du griot au panel 8 redemarre
        artificiellement pendant "chaque griot la raconte a sa maniere".
      */}
      <Sequence
        from={CLIP_DURATION_FRAMES}
        durationInFrames={LOOP_DURATION_FRAMES}
        premountFor={1 * FPS}
      >
        <AbsoluteFill>
          <OffthreadVideo
            src={staticFile(CLIP_VIDEO)}
            startFrom={LOOP_SOURCE_START_FRAME}
            endAt={CLIP_DURATION_FRAMES}
            muted
            loop
            style={{
              width,
              height,
              objectFit: "cover",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* =================== NARRATION (full Acte VII span) =================== */}
      <Sequence
        from={0}
        durationInFrames={NARRATION_DURATION_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={NARRATION_START_FRAME_ABS}
          endAt={NARRATION_END_FRAME_ABS}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
